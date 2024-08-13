import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import styles from '../styles/Dashboard.module.css';

const socket = io('http://10.14.31.212:5000', { transports: ['websocket'] });

interface Metrics {
  ram_usage: string;
  disk_usage: string;
  temperature: string;
  gpu_usage: string;
  cpu_usage: string;
  fan_speed: string;
  gpu_temp: string;
  cpu_temp: string;
  power_info: string;
  swap_usage: string;
}

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    socket.on('update_metrics', (newMetrics: Metrics) => {
      console.log('Received metrics:', newMetrics); // Para depuración
      setMetrics(newMetrics);
    });

    return () => {
      socket.off('update_metrics');
    };
  }, []);

  if (!metrics) {
    return <div className={styles.container}><p>Loading metrics...</p></div>;
  }

  return (
    <div className={styles.container}>
      <h1>Jetson Nano Monitoring Dashboard</h1>
      <div className={styles.metric}><strong>Uso de RAM:</strong> <span>{metrics.ram_usage}</span></div>
      <div className={styles.metric}><strong>Uso de Disco:</strong> <span>{metrics.disk_usage}</span></div>
      <div className={styles.metric}><strong>Temperatura del Sistema:</strong> <span>{metrics.temperature}</span></div>
      <div className={styles.metric}><strong>Uso de GPU:</strong> <span>{metrics.gpu_usage}</span></div>
      <div className={styles.metric}><strong>Uso de CPU :</strong> <span>{metrics.cpu_usage}</span></div>
      <div className={styles.metric}><strong>Velocidad der ventilador:</strong> <span>{metrics.fan_speed}</span></div>
      <div className={styles.metric}><strong>Temperatura de GPU:</strong> <span>{metrics.gpu_temp}</span></div>
      <div className={styles.metric}><strong>Temperatura de CPU:</strong> <span>{metrics.cpu_temp}</span></div>
      {/* <div className={styles.metric}><strong>Power Info:</strong> <span>{metrics.power_info}</span></div> */}
      <div className={styles.metric}><strong>Swap Usage:</strong> <span>{metrics.swap_usage}</span></div>
    </div>
  );
};

export default Dashboard;
