import os
import sys
import numpy as np
import cv2
import torch
import matplotlib.pyplot as plt
from model import UNet

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

    print(output_filename)  # Output the path of the saved image

if __name__ == "__main__":
    # Ruta de la imagen de prueba proporcionada como argumento
    test_image_path = sys.argv[1]

    # Cargar la imagen de prueba
    image = load_test_image(test_image_path)
    print("Hola")
    
    # Cargar el modelo entrenado
    model = UNet(n_channels=3, n_classes=1)
    model_path = "/home/deuser/miguelorzaez/backend/models/modelo_entrenado.pth"
    model.load_state_dict(torch.load(model_path))
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)

    # Evaluar la imagen de prueba
    model.eval()
    with torch.no_grad():
        image = image.to(device)
        output = model(image)

    # Directorio de salida para guardar la predicción
    output_dir = "./output_predictions"

    # Visualizar y guardar la predicción
    image_name = os.path.splitext(os.path.basename(test_image_path))[0]
    visualize_prediction(image, output, output_dir, image_name)
