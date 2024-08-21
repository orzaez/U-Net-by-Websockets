import os
import numpy as np
import cv2
from glob import glob
import torch
import torch.nn as nn
import torch.nn.functional as F  # Importar torch.nn.functional como F
from torch.utils.data import Dataset

"""Una capa de convolución aplica un conjunto de filtros (o kernels) a la entrada (por ejemplo, una imagen) para extraer 
características específicas, como bordes, texturas o patrones.Cada filtro se mueve a través de la imagen, 
realizando una operación de convolución que produce un mapa de características."""

# Partes del modelo U-Net
# La clase DoubleConv encapsula dos operaciones de convolución, cada una seguida de normalización por lotes y activación ReLU, 
# en una única unidad. Esta clase se utiliza para construir bloques de procesamiento en arquitecturas de redes neuronales 
# convolucionales, permitiendo extraer y procesar características de las imágenes de manera eficiente
class DoubleConv(nn.Module):
    """(convolution => [BN] => ReLU) * 2"""
    def __init__(self, in_channels, out_channels, mid_channels=None):
        super().__init__()
        # (opcional): Número de canales en la capa intermedia. Si no se especifica, se establece igual a out_channels
        if not mid_channels:
            mid_channels = out_channels
        self.double_conv = nn.Sequential(
            # El padding de 1 en mantener las dimensiones espaciales de la salida iguales a las de la entrada
            nn.Conv2d(in_channels, mid_channels, kernel_size=3, padding=1, bias=False),
            # Normaliza las salidas de la convolución para acelerar el entrenamiento y mejorar la estabilidad.
            nn.BatchNorm2d(mid_channels),
            nn.ReLU(inplace=True),
            nn.Conv2d(mid_channels, out_channels, kernel_size=3, padding=1, bias=False),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True)
        )

    def forward(self, x):
        return self.double_conv(x)
    
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f'Using device: {device}')

class Down(nn.Module):
    """reducción de las dimensiones espaciales y el incremento de la profundidad de las características"""
    def __init__(self, in_channels, out_channels):
        super().__init__()
        self.maxpool_conv = nn.Sequential(
            nn.MaxPool2d(2),
            DoubleConv(in_channels, out_channels)
        )

    def forward(self, x):
        return self.maxpool_conv(x)

class Up(nn.Module):
    """Upscaling then double conv"""
    def __init__(self, in_channels, out_channels, bilinear=True):
        super().__init__()

        """El condicional bilinear permite elegir entre dos métodos diferentes para realizar el upsampling (aumento de dimensiones espaciales)
        de los mapas de características:
            1. Interpolación Bilineal (nn.Upsample)
            2. Convolución Transpuesta (nn.ConvTranspose2d)"""
        if bilinear:
            self.up = nn.Upsample(scale_factor=2, mode='bilinear', align_corners=True)
            self.conv = DoubleConv(in_channels, out_channels, in_channels // 2)
        else:
            self.up = nn.ConvTranspose2d(in_channels, in_channels // 2, kernel_size=2, stride=2)
            self.conv = DoubleConv(in_channels, out_channels)

    def forward(self, x1, x2):
        x1 = self.up(x1)
        # input is CHW
        # Ajuste de las dimensiones para que coincidan
        diffY = x2.size()[2] - x1.size()[2]
        diffX = x2.size()[3] - x1.size()[3]

        x1 = F.pad(x1, [diffX // 2, diffX - diffX // 2,
                        diffY // 2, diffY - diffY // 2])
        
        # Concatenación de los mapas de características
        x = torch.cat([x2, x1], dim=1)
        return self.conv(x)

class OutConv(nn.Module):
    def __init__(self, in_channels, out_channels):
        super(OutConv, self).__init__()
        self.conv = nn.Conv2d(in_channels, out_channels, kernel_size=1)

    def forward(self, x):
        return self.conv(x)

# Montaje completo del modelo U-Net
class UNet(nn.Module):
    def __init__(self, n_channels, n_classes, bilinear=False):
        super(UNet, self).__init__()
        self.n_channels = n_channels
        self.n_classes = n_classes
        self.bilinear = bilinear

        self.inc = (DoubleConv(n_channels, 64))
        self.down1 = (Down(64, 128))
        self.down2 = (Down(128, 256))
        self.down3 = (Down(256, 512))
        factor = 2 if bilinear else 1 #?????
        self.down4 = (Down(512, 1024 // factor))
        self.up1 = (Up(1024, 512 // factor, bilinear))
        self.up2 = (Up(512, 256 // factor, bilinear))
        self.up3 = (Up(256, 128 // factor, bilinear))
        self.up4 = (Up(128, 64, bilinear))
        self.outc = (OutConv(64, n_classes))

    def forward(self, x):
        x1 = self.inc(x)          # Bloque inicial de convolución doble
        x2 = self.down1(x1)       # Primera capa de contracción
        x3 = self.down2(x2)       # Segunda capa de contracción
        x4 = self.down3(x3)       # Tercera capa de contracción
        x5 = self.down4(x4)       # Cuarta capa de contracción (parte más profunda)
        x = self.up1(x5, x4)      # Primera capa de expansión
        x = self.up2(x, x3)       # Segunda capa de expansión
        x = self.up3(x, x2)       # Tercera capa de expansión
        x = self.up4(x, x1)       # Cuarta capa de expansión
        logits = self.outc(x)     # Capa de salida
        return logits
        
model = UNet(n_channels=3, n_classes=1)
model = model.to(device)
# Dataset personalizado para PyTorch
class SegmentationDataset(Dataset):
    def __init__(self, image_paths, mask_paths, transform=None):
        self.image_paths = image_paths
        self.mask_paths = mask_paths
        self.transform = transform

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, idx):
        image = cv2.imread(self.image_paths[idx], cv2.IMREAD_COLOR)
        image = cv2.resize(image, (256, 256))
        # Normalización de los Valores de los Píxeles
        image = image / 255.0
        # Cambio de formato correcto para que pytorch pueda procesarlo (H, W, C) ==> (C, H, W).
        image = torch.tensor(image, dtype=torch.float32).permute(2, 0, 1).clone().detach()

        mask = cv2.imread(self.mask_paths[idx], cv2.IMREAD_GRAYSCALE)
        mask = cv2.resize(mask, (256, 256))
        mask = mask / 255.0
        mask = torch.tensor(mask, dtype=torch.float32).unsqueeze(0).clone().detach()

        return image, mask

def load_data(dataset_path, max_images=1000):
    train_images = sorted(glob(os.path.join(dataset_path, "train/images/*")))[:max_images]
    train_masks = sorted(glob(os.path.join(dataset_path, "train/masks/*")))[:max_images]
    val_images = sorted(glob(os.path.join(dataset_path, "val/images/*")))[:max_images]
    val_masks = sorted(glob(os.path.join(dataset_path, "val/masks/*")))[:max_images]
    test_images = sorted(glob(os.path.join(dataset_path, "test/images/*")))[:max_images]
    test_masks = sorted(glob(os.path.join(dataset_path, "test/masks/*")))[:max_images]

    return (train_images, train_masks), (val_images, val_masks), (test_images, test_masks)
