# -*- coding: utf-8 -*-
import gevent.monkey
gevent.monkey.patch_all()

import os
import numpy as np
import cv2
import torch
from flask import Flask, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from werkzeug.utils import secure_filename
from threading import Thread
import requests
import time
from model import UNet

# Configurar las variables de entorno para OpenBLAS antes de importar cualquier biblioteca que las utilice
os.environ['OPENBLAS_NUM_THREADS'] = '1'
os.environ['GOTO_NUM_THREADS'] = '1'
os.environ['OMP_NUM_THREADS'] = '1'

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
CORS(app)  # Habilitar CORS en la aplicación Flask
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='gevent', ping_timeout=120, ping_interval=25)

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
OUTPUT_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'output_predictions')
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'modelo_entrenado.pth')

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

PROMETHEUS_URL = "http://localhost:9090/api/v1/query"  # Cambia si es necesario

# Funciones de la U-Net

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg', 'gif'}

def load_test_image(image_path):
    image = cv2.imread(image_path, cv2.IMREAD_COLOR)
    image = cv2.resize(image, (256, 256))
    image = image / 255.0
    image = torch.tensor(image, dtype=torch.float32).permute(2, 0, 1).unsqueeze(0).clone().detach()
    return image

def visualize_prediction(image, output, output_dir, image_name):
    original_image = image.cpu().numpy().squeeze().transpose(1, 2, 0)
    output = torch.sigmoid(output).cpu().numpy().squeeze()
    binary_output = (output > 0.5).astype(np.uint8)  # Binarización de la predicción para obtener máscara

    # Usar OpenCV para encontrar contornos en la máscara binaria
    contours, _ = cv2.findContours(binary_output, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    image_with_contours = np.copy(original_image)
    
    # Dibujar contornos en la imagen
    cv2.drawContours(image_with_contours, contours, -1, (0, 255, 0), 2)  # Dibuja todos los contornos

    # Convertir de RGB a BGR para guardar con OpenCV
    image_with_contours = cv2.cvtColor((image_with_contours * 255).astype(np.uint8), cv2.COLOR_RGB2BGR)

    # Guardar la imagen con contornos
    os.makedirs(output_dir, exist_ok=True)
    output_filename = os.path.join(output_dir, f"{image_name}_contours.jpg")
    cv2.imwrite(output_filename, image_with_contours)

    print(f"Image with contours saved as {output_filename}")
    return output_filename

def run_test_script(input_path):
    print('Running test script...')
    # Cargar la imagen de prueba
    image = load_test_image(input_path)

    # Cargar el modelo entrenado
    model = UNet(n_channels=3, n_classes=1)
    model.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device('cpu')))
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)

    # Evaluar la imagen de prueba
    model.eval()
    with torch.no_grad():
        image = image.to(device)
        output = model(image)

    # Visualizar y guardar la predicción
    image_name = os.path.splitext(os.path.basename(input_path))[0]
    output_image_path = visualize_prediction(image, output, OUTPUT_FOLDER, image_name)
    return output_image_path

# Funciones del Dashboard de Métricas

def query_prometheus(query):
    try:
        response = requests.get(PROMETHEUS_URL, params={'query': query})
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {'error': str(e)}

def get_ram_usage():
    result = query_prometheus('node_memory_MemAvailable_bytes')
    if 'error' in result:
        return result['error']
    mem_available = float(result['data']['result'][0]['value'][1])
    mem_total = float(query_prometheus('node_memory_MemTotal_bytes')['data']['result'][0]['value'][1])
    ram_usage_percent = 100 * (1 - mem_available / mem_total)
    return f"{ram_usage_percent:.2f}%"

def get_disk_usage():
    result = query_prometheus('100 - (node_filesystem_avail_bytes{fstype!~"tmpfs|aufs|overlay"} / node_filesystem_size_bytes{fstype!~"tmpfs|aufs|overlay"} * 100)')
    if 'error' in result:
        return result['error']
    return f"{float(result['data']['result'][0]['value'][1]):.2f}%"


def get_gpu_usage():
    result = query_prometheus('nvidia_smi_utilization_gpu')
    if 'error' in result or not result['data']['result']:
        return "No data"
    return f"{float(result['data']['result'][0]['value'][1]):.2f}%"

def get_cpu_usage():
    result = query_prometheus('100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)')
    if 'error' in result or not result['data']['result']:
        return "No data"
    return f"{float(result['data']['result'][0]['value'][1]):.2f}%"


def get_gpu_temp():
    result = query_prometheus('node_thermal_zone_temp{instance="node-exporter:9100", job="node_exporter", type="GPU-therm", zone="2"}')
    if 'error' in result or not result['data']['result']:
        return "No data"
    return f"{float(result['data']['result'][0]['value'][1]):.2f} °C"

def get_cpu_temp():
    result = query_prometheus('node_thermal_zone_temp{instance="node-exporter:9100", job="node_exporter", type="CPU-therm", zone="1"}')
    if 'error' in result or not result['data']['result']:
        return "No data"
    return f"{float(result['data']['result'][0]['value'][1]):.2f} °C"

def get_swap_usage():
    result = query_prometheus('node_memory_SwapFree_bytes')
    if 'error' in result:
        return result['error']
    swap_free = float(result['data']['result'][0]['value'][1])
    swap_total = float(query_prometheus('node_memory_SwapTotal_bytes')['data']['result'][0]['value'][1])
    swap_usage_percent = 100 * (1 - swap_free / swap_total)
    return f"{swap_usage_percent:.2f}%"

def fetch_metrics():
    while True:
        metrics = {
            'ram_usage': get_ram_usage(),
            'disk_usage': get_disk_usage(),
            'gpu_usage': get_gpu_usage(),
            'cpu_usage': get_cpu_usage(),
            'gpu_temp': get_gpu_temp(),
            'cpu_temp': get_cpu_temp(),
            'swap_usage': get_swap_usage()
        }
        socketio.emit('update_metrics', metrics)
        time.sleep(2)

# Manejo de conexiones WebSocket

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    emit('connection_status', {'status': 'Connected'})

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('upload_file')
def handle_file_upload(data):
    try:
        print('Received file upload')
        file_data = data['file']
        filename = secure_filename(data['filename'])
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        
        with open(filepath, 'wb') as f:
            f.write(bytearray(file_data))
        print(f"File saved to {filepath}")

        # Procesar la imagen
        output_image_path = run_test_script(filepath)
        print(f"Output image path: {output_image_path}")

        # Leer la imagen de salida para enviarla de vuelta al cliente
        with open(output_image_path, 'rb') as f:
            image_data = f.read()
        print("Output image read successfully")
        
        emit('file_processed', {'image': image_data, 'filename': os.path.basename(output_image_path)})
        print('File processed and response sent')
    except Exception as e:
        print(f"Error during file upload: {e}")
        emit('file_processed', {'error': str(e)})

# Iniciar el hilo para la emisión de métricas y el servidor
if __name__ == '__main__':
    print("Server is starting...")
    thread = Thread(target=fetch_metrics)
    thread.start()
    socketio.run(app, host='0.0.0.0', port=5000)
    print("Server has started")
