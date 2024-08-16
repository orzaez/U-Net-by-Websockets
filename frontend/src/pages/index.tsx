import React, { useState } from 'react';
import Dashboard from '../components/DashBoard';
import GrafanaDashboard from '../components/GrafanaDashboard';
import UNet from '../components/UNet';
import styles from '../styles/Home.module.css';

const Home: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<'dashboard' | 'grafana' | 'unet'>('dashboard');

  return (
    <div className={styles.container}>
      <h1>Welcome to the Monitoring and U-Net Dashboard</h1>
      <div className={styles.linkContainer}>
        <button className={styles.linkBox} onClick={() => setActiveComponent('dashboard')}>
          Go to Dashboard
        </button>
        <button className={styles.linkBox} onClick={() => setActiveComponent('grafana')}>
          Go to Grafana
        </button>
        <button className={styles.linkBox} onClick={() => setActiveComponent('unet')}>
          Go to U-Net
        </button>
      </div>

      <div className={styles.content}>
        {activeComponent === 'dashboard' ? (
          <Dashboard />
        ) : activeComponent === 'grafana' ? (
          <GrafanaDashboard />
        ) : (
          <UNet />
        )}
      </div>
    </div>
  );
};

export default Home;
