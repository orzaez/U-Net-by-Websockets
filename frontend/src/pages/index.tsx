import React, { useState } from 'react';
import Link from 'next/link';
import WebSocketComponent from '../components/WebSocketComponent';
import styles from '../styles/Home.module.css';

const Home: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>('Connecting...');

  return (
    <div className={styles.container}>
      <h1>Monitoreo y aplicación de U-Net </h1>
      <WebSocketComponent setConnectionStatus={setConnectionStatus} />
      <p>Estado de la conexión: {connectionStatus}</p>
      <div className={styles.linkContainer}>
        <Link href="/dashboard" className={styles.linkBox}>
          Dashboard
        </Link>
        <Link href="/u-net" className={styles.linkBox}>
          U-Net
        </Link>
      </div>
    </div>
  );
};

export default Home;
