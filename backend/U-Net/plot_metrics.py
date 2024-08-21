import json
import matplotlib.pyplot as plt

def plot_metrics(filename='training_metrics.json', output_filename='training_metrics.png'):
    with open(filename, 'r') as f:
        metrics = json.load(f)

    plt.figure(figsize=(10, 8))
    plt.plot(metrics['loss'], label='Loss')
    plt.plot(metrics['dice'], label='Dice Coefficient')
    plt.plot(metrics['accuracy'], label='Accuracy')
    plt.plot(metrics['iou'], label='IoU')
    plt.plot(metrics['f1_score'], label='F1 Score')

    plt.title('Training Metrics Over Epochs')
    plt.xlabel('Epochs')
    plt.ylabel('Metric Value')
    plt.legend()
    plt.grid(True)
    # Guardar la figura en lugar de mostrarla en pantalla
    plt.savefig(output_filename)
    plt.close()  # Cierra la figura para liberar memoria

if __name__ == "__main__":
    plot_metrics()
