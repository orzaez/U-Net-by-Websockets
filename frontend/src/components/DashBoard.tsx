
import io from 'socket.io-client';
import styles from '../styles/Dashboard.module.css';

// Establece una conexión WebSocket con el servidor
const socket = io('http://10.14.31.212:5000', { transports: ['websocket'] });

// Es una interfaz TypeScript que define la estructura de las
//  métricas que se esperan recibir del servido
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
  // Estado Inicial del Componente estado del componente, función que permite actualizar el estado metrics.
  // Inicialmente, metrics es null, lo que indica que aún no se han recibido datos.
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  // Este hook se ejecuta cuando el componente se monta Este código se ejecuta cuando el componente se monta. 
  // Está suscribiendo al socket para que escuche el evento update_metrics Cada vez que el servidor envía nuevas métricas (datos que representan, por ejemplo, el uso de CPU, RAM, etc.), 
  // esta función de callback se ejecuta.permite que tu componente reaccione en tiempo real a las actualizaciones del servidor. Cada vez que el servidor envía nuevas métricas, 
  // el componente las recibe y actualiza su interfaz de usuario.
  useEffect(() => {
    socket.on('update_metrics', (newMetrics: Metrics) => {
      // Cuando se reciben nuevas métricas, el estado metrics se actualiza con esos datos.
      console.log('Received metrics:', newMetrics); 
      setMetrics(newMetrics);
    });

    return () => {
      // Esta es la función de limpieza que se ejecuta automáticamente cuando el componente se desmonta 
      // (por ejemplo, cuando el usuario navega fuera de la página que utiliza este componente).
      socket.off('update_metrics');
    };
  }, []);

  if (!metrics) {
    // Si metrics es null, no se recibe nada y se pone como que estan cargando
    return <div className={styles.container}><p>Cargando métricas...</p></div>;
  }

  // El componente retorna una estructura div
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
