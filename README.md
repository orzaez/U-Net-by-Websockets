# Image Processing Application

This is a full-stack application for processing images using deep learning models. The project is composed of a React frontend and a Python (Flask) backend. The frontend allows users to upload images, which are then processed by a deep learning model on the backend. The processed images are sent back to the frontend and displayed the processed image to the user.

## Project Structure

The project is organized into two main directories:

- **frontend**: Contains the React application.
- **backend**: Contains the Flask application and the deep learning model.

## Features

- **Real-time Image Processing**: Upload an image and get a processed version in real-time.
- **WebSocket Communication**: The frontend and backend communicate using WebSockets for instant feedback.
- **Deep Learning**: The backend uses a UNet model to process the images.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** and **npm** for the frontend.
- **Python 3.6** for the backend.
- **CUDA and cuDNN** (if running with GPU support on a Jetson Nano).

### Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/orzaez/front-Unet
    cd front-Unet
    ```

2. **Setup the frontend**:

    ```bash
    cd frontend
    npm install
    ```

3. **Setup the backend**:

    ```bash
    cd ../backend
    pip3 install -r requirements.txt
    ```

### Running the Application

1. **Start the backend server**:

    ```bash
    python3 app.py
    ```

2. **Start the frontend development server**:

    ```bash
    cd ../frontend
    npm start
    ```

    The frontend will be available at `http://localhost:3000`.

3. **Using the Application**:

    - Open the frontend in your web browser.
    - Upload an image.
    - The processed image will be displayed once the backend finishes processing.

### Deployment

To deploy the application:

1. **Build the frontend**:

    ```bash
    cd frontend
    npm run build
    ```

    The build files will be in the `build` directory.

2. **Run the backend in production mode** using a production WSGI server like Gunicorn.

### Files Structure

```bash
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   ├── README.md
│   └── ...
├── backend
│   ├── app.py
│   ├── model.py
│   ├── test.py
│   ├── requirements.txt
│   └── ...
└── README.md
```

### Troubleshooting

- WebSocket Connection Failed: Make sure the backend is running and accessible.
  
- CUDA Errors: Ensure that CUDA is installed correctly and that PyTorch is configured to use it.

### Contributing

Contributions are welcome! Please fork the repository and use a feature branch. Pull requests are warmly welcome.

### License

This project is licensed under the MIT License - see the LICENSE file for details.
