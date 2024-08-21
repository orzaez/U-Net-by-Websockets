import React from 'react';

const GrafanaDashboard = () => {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <iframe
      //IP DEL DOCKER DE GRAFANA
        src="http://10.14.31.212:3000/dashboards"
        frameBorder="0"
        width="100%"
        height="100%"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default GrafanaDashboard;
