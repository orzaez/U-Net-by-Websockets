# U-Net by Websockets

Este repositorio contiene un monorepo híbrido que alberga tanto el frontend como el backend de una aplicación web que integra múltiples funcionalidades, incluida la segmentación de imágenes con U-Net, un dashboard en tiempo real de diferentes metricas del sistema recogidas mediante WebSockets, y un segundo dashboard (por si no te gusta el primero) con Grafana para la visualización de métricas.

## Tabla de Contenidos

- [U-Net by Websockets](#u-net-by-websockets)
  - [Tabla de Contenidos](#tabla-de-contenidos)
  - [Descripción](#descripción)
  - [Estructura del Proyecto](#estructura-del-proyecto)
  - [Requisitos Previos](#requisitos-previos)
  - [Instalación](#instalación)
    - [1. Clona el repositorio](#1-clona-el-repositorio)
    - [2. Configura el frontend](#2-configura-el-frontend)
    - [3. Configura el backend](#3-configura-el-backend)
    - [4. Ejecuta el frontend](#4-ejecuta-el-frontend)
    - [5. Ejecuta el backend](#5-ejecuta-el-backend)
    - [Acceso a Grafana](#acceso-a-grafana)
    - [Contribuir](#contribuir)
    - [Licencia](#licencia)
    - [Contacto](#contacto)

## Descripción

Este proyecto está dividido en dos componentes principales:

1. **Frontend**: Desarrollado en React, este componente proporciona tres funcionalidades clave:
   - **U-Net**: Permite la segmentación de imágenes utilizando un modelo de red neuronal U-Net.
   - **Dashboard en tiempo real**: Recoge y muestra métricas en tiempo real utilizando WebSockets.
   - **Integración con Grafana**: A través de un iframe, se muestran dashboards de Grafana que visualizan datos recolectados por Prometheus.

2. **Backend**: Desarrollado en Python, este componente maneja la lógica detrás del procesamiento de imágenes, la recolección de métricas y la integración con servicios externos como Prometheus y Grafana. Además, el backend puede desplegarse usando Docker para gestionar los servicios de monitoreo.

## Estructura del Proyecto

El repositorio tiene la siguiente estructura:

``` bash
U-Net-by-Websockets/
│
├── frontend/ # Contiene el código del frontend en React
│ ├── src/ # Código fuente del frontend
│ └── package.json # Dependencias y scripts del frontend
│
├── backend/ # Contiene el código del backend en Python
│    ├── grafana/ # Contiene la configuracion para grafana
│        └── docker-compose.yml # Archivo para orquestar los contenedores Docker
│    ├── U-Net/ # Contiene la configuracion para grafana
│       └── .gitattributes # Configuración de Git LFS
│       └── app.py # Archivo principal para ejecutar el backend
│           └── ... # Otros archivos y scripts necesarios para el backend 
│    └── requirements.txt # Dependencias de Python para el backend
│
└── README.md # Este archivo
```

## Requisitos Previos

Asegúrate de tener instalados los siguientes requisitos en tu sistema:

- **Node.js y npm** (para el frontend)
- **Python 3.6** (para el backend)
- **Docker y Docker Compose** (para los servicios de Prometheus y Grafana)
- **Git LFS** (opcional, si quieres usar mi modelo entrenado)

## Instalación

### 1. Clona el repositorio

```bash
git clone https://github.com/orzaez/U-Net-by-Websockets.git
cd U-Net-by-Websockets
```

### 2. Configura el frontend

```bash
cd frontend
npm install

```

### 3. Configura el backend

```bash

cd ../backend
pip install -r requirements.txt
cd grafana
docker-compose up -d
```

### 4. Ejecuta el frontend

```bash

cd ../frontend
python3.6 app.py
```

### 5. Ejecuta el backend

```bash

cd frontend
npm run dev

```

Esto iniciará el servidor de desarrollo del frontend y abrirá automáticamente el navegador en ``` http://localhost:3000. ```

### Acceso a Grafana

Grafana estará disponible en ```http://localhost:3000``` dentro de un iframe en el frontend, o directamente accediendo desde el navegador si prefieres ver los dashboards completos

### Contribuir

¡Las contribuciones son bienvenidas! No dudes en enviar un Pull Request.

### Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

### Contacto

Si tienes alguna pregunta o sugerencia, no dudes en ponerte en contacto con el propietario del repositorio.
