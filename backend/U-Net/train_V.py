import os
import numpy as np
import torch
import torch.optim as optim
from torch.utils.data import DataLoader
import torchmetrics
from torchmetrics import F1Score
from torchmetrics.functional.segmentation import mean_iou
from model import UNet, load_data, SegmentationDataset
import json


"""Al principio se configura una tasa de aprendizaje fija en las 5 primeras epocas para que el modelo aprenda rapido, pero si se mantiene una misma 
tasa de aprendizaje fija puede ser que el modelo se sobre entrene y se den resultados sobreajustados y por tanto erroneos y no 
convergan a donde debe de hacerlo"""

def schedule(epoch, lr):
    if epoch < 5:
        return lr
    else:
        return lr * np.exp(-0.1)

def save_model(model, filename):
    torch.save(model.state_dict(), filename)
    print(f"Model saved in: {filename}")

def accuracy(pred, target):
    pred = torch.sigmoid(pred)
    pred = (pred > 0.5).float()
    correct = (pred == target).float().sum()
    return correct / target.numel()

def precision(pred, target):
    pred = torch.sigmoid(pred)
    pred = (pred > 0.5).float()
    tp = (pred * target).sum().to(torch.float32)
    fp = ((1 - target) * pred).sum().to(torch.float32)
    precision = tp / (tp + fp + 1e-10)  # Añadir un pequeño valor para evitar la división por cero
    return precision

def train_model(X_train_paths, y_train_paths, img_h, img_w, epochs=60, batch_size=8):
    filename = "/home/xrdpuser/AI/miguel_orzaez/models/modelo_entrenado.pth"
    model = UNet(n_channels=3, n_classes=1)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    print("Using device:", device)

    train_dataset = SegmentationDataset(X_train_paths, y_train_paths)
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)

    optimizer = optim.Adam(model.parameters(), lr=0.001)
    # Entropía Cruzada Binaria:
    criterion = torch.nn.BCEWithLogitsLoss()
    f1_metric = F1Score(num_classes=1, threshold=0.5, task='binary').to(device)
    metrics = {'loss': [], 'dice': [], 'accuracy': [], 'iou': [], 'f1_score': []}

    for epoch in range(epochs):
        model.train()
        epoch_loss = 0
        epoch_acc = 0
        epoch_iou = 0
        epoch_f1_score = 0
        epoch_precision = 0

        for images, masks in train_loader:
            images = images.to(device)
            masks = masks.to(device)
            masks = (masks > 0).float()
            masks_int = masks.int()
            outputs = model(images)
            loss = criterion(outputs, masks)
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            outputs_sig = (torch.sigmoid(outputs) > 0.5).int()

            epoch_loss += loss.item()
            epoch_precision += precision(outputs, masks).item()
            epoch_acc += accuracy(outputs, masks).item()
            epoch_f1_score += f1_metric(outputs_sig, masks_int).item()
            iou = mean_iou(outputs_sig, masks_int, num_classes=1)
            epoch_iou += iou.mean().item()

        # TP (True Positives, Verdaderos Positivos): Número de casos positivos que el modelo ha predicho BIEN como positivos.
        # FN (False Negatives, Falsos Negativos): Número de casos positivos que el modelo ha predicho MAL como negativos.
        # FP (False Positives, Falsos Positivos): Número de casos negativos PERO que el modelo ha predicho MAL como positivos.
        # TN (True Negatives, Verdaderos Negativos): Número de casos negativos que el modelo ha predicho BIEN como negativos.
        
        # Compute average metrics for the epoch
        #cuantifica la diferencia entre las predicciones del modelo y los valores esperados (verdaderos)
        metrics['loss'].append(epoch_loss / len(train_loader))

        # proporción de verdaderos positivos (TP) sobre el total de predicciones positivas
        # (la suma de verdaderos positivos y falsos positivos, FP).
        metrics['precision'].append(epoch_precision / len(train_loader))
        
        # proporción de predicciones correctas (tanto verdaderos positivos como verdaderos negativos) sobre el total de instancias.(TP + TN + FP + FN)).
        metrics['accuracy'].append(epoch_acc / len(train_loader))
        
        metrics['iou'].append(epoch_iou / len(train_loader))
        
        # RECALL: proporción de verdaderos positivos (TP) sobre el total de positivos reales (la suma de verdaderos positivos y falsos negativos, FN
        #El F1 Score es la media armónica del recall y la precisión, proporcionando una única métrica que considera ambos aspectos.
        metrics['f1_score'].append(epoch_f1_score / len(train_loader))

        # Print metrics for the current epoch
        print(f"Epoch {epoch+1}/{epochs}, Loss: {metrics['loss'][-1]}, Dice: {metrics['dice'][-1]}, Accuracy: {metrics['accuracy'][-1]}, IoU: {metrics['iou'][-1]}, F1 Score: {metrics['f1_score'][-1]}")

    # Save metrics to a JSON file
    with open('training_metrics.json', 'w') as f:
        json.dump(metrics, f)

    save_model(model, filename)

if __name__ == "__main__":
    dataset_path = "/home/xrdpuser/AI/miguel_orzaez/people_segmentation_split"
    (X_train_paths, y_train_paths), _, _ = load_data(dataset_path)
    img_h, img_w = 256, 256
    train_model(X_train_paths, y_train_paths, img_h, img_w)
