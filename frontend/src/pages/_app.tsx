import '../styles/global.css';
import type { AppProps } from 'next/app';
import { WebSocketProvider } from '../context/WebSocketContext';
// Se encarga de inicializar la aplicación y asegura que el contexto WebSocket esté disponible en todas las páginas

function MyApp({ Component, pageProps }: AppProps) {
  // WebSocketProvider: Aquí es donde se envuelve toda la aplicación con el WebSocketProvider. 
  // Esto significa que todos los componentes de la aplicación tendrán acceso al contexto de WebSocket.
  return (
    <WebSocketProvider>
      <Component {...pageProps} />
    </WebSocketProvider>
  );
}

export default MyApp;
// race Route: Cuando el usuario navega por diferentes páginas (index.tsx, dashboard.tsx, etc.), 
// MyApp asegura que el contexto WebSocket esté disponible y que los estilos globales se apliquen.