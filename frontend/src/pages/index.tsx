import React from 'react';
import Link from 'next/link';
import { useWebSocketContext } from '../context/WebSocketContext';
import styles from '../styles/Home.module.css';

const Home: React.FC = () => {
  const { socket } = useWebSocketContext();
  const connectionStatus = socket?.connected ? 'Connected' : 'Disconnected';

  return (
    <div className={styles.container}>
      <h1>Welcome to the Monitoring and U-Net Dashboard</h1>
      <p>WebSocket Status: {connectionStatus}</p>
      <div className={styles.linkContainer}>
        <Link href="/dashboard" className={styles.linkBox}>
          Go to Dashboard
        </Link>
        <Link href="/u-net" className={styles.linkBox}>
          Go to U-Net
        </Link>
      </div>
    </div>
  );
};

export default Home;
