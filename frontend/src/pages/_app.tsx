import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { WebSocketProvider } from '../context/WebSocketContext';
import 'globals.css';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WebSocketProvider>
      <Component {...pageProps} />
    </WebSocketProvider>
  );
}

export default MyApp;
