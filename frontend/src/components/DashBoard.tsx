import React, { useState, useEffect } from 'react';
import { useWebSocketContext } from '../context/WebSocketContext';
import ReactSpeedometer from 'react-d3-speedometer';
import styles from '../styles/Dashboard.module.css';

interface Metrics {
  ram_usage: string;
  disk_usage: string;
  gpu_usage: string;
  cpu_usage: string;
  fan_speed: string;
  gpu_temp: string;
  cpu_temp: string;
  power_info: string;
  swap_usage: string;
}

const Dashboard: React.FC = () => {
  const { socket } = useWebSocketContext(); // Usamos el contexto para obtener la conexión WebSocket
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    if (socket) {
      socket.on('update_metrics', (newMetrics: Metrics) => {
        console.log('Received metrics:', newMetrics); // Para depuración
        setMetrics(newMetrics);
      });

      // Limpieza del efecto para evitar fugas de memoria
      return () => {
        socket.off('update_metrics');
      };
    }
  }, [socket]); // Dependencia de socket

  if (!metrics) {
    return <div className={styles.container}><p>Loading metrics...</p></div>;
  }

  // Convertir valores a números para los gauges
  const cpuUsage = parseFloat(metrics.cpu_usage.replace('%', ''));
  const gpuTemp = parseFloat(metrics.gpu_temp.replace('%', ''));
  const cpuTemp = parseFloat(metrics.cpu_temp.replace('%', ''));

  const ramUsage = parseFloat(metrics.ram_usage.replace('%', ''));

  return (
    <div className={styles.container}>
      <h1>Jetson Nano Monitoring Dashboard</h1>

      <div className={styles.metricContainer}>
        <div className={styles.metricGauge}>
          <h3>Uso de CPU </h3>
          <ReactSpeedometer
            value={cpuUsage}
            minValue={0}
            maxValue={100}
            needleColor="red"
            startColor="green"
            endColor="red"
            textColor="#000000"
          />
        </div>

        <div className={styles.metricGauge}>
          <h3>Temperatura de CPU</h3>
          <ReactSpeedometer
            value={cpuTemp}
            minValue={0}
            maxValue={100}
            needleColor="blue"
            startColor="green"
            endColor="red"
            textColor="#000000"
          />
        </div>
        <div className={styles.metricGauge}>
          <h3>Temperatura de GPU</h3>
          <ReactSpeedometer
            value={gpuTemp}
            minValue={0}
            maxValue={100}
            needleColor="blue"
            startColor="green"
            endColor="red"
            textColor="#000000"
          />
        </div>

        <div className={styles.metricGauge}>
          <h3>Uso de RAM</h3>
          <ReactSpeedometer
            value={ramUsage}
            minValue={0}
            maxValue={100}
            needleColor="purple"
            startColor="green"
            endColor="red"
            textColor="#000000"
          />
        </div>
      </div>

      
      {/* <div className={styles.metric}>
        <strong>Fan Speed:</strong> <span>{metrics.fan_speed}</span>
      </div> */}

      {/* <div className={styles.metric}>
        <strong>Power Info:</strong> <span>{metrics.power_info}</span>
      </div> */}
      <div className={styles.metric}>
        <strong>Swap Usage:</strong> <span>{metrics.swap_usage}</span>
      </div>
    </div>
  );
};

export default Dashboard;
