import React from 'react';
import '../styles/KPICard.css';

export default function KPICard({ title, value, unit = '', status = 'normal', trend = null }) {
  const getStatusColor = () => {
    switch (status) {
      case 'critical':
        return '#ff4757';
      case 'warning':
        return '#ffa502';
      case 'success':
        return '#2ed573';
      default:
        return '#0984e3';
    }
  };

  return (
    <div className="kpi-card" style={{ borderLeftColor: getStatusColor() }}>
      <div className="kpi-title">{title}</div>
      <div className="kpi-value">{value.toLocaleString()}</div>
      {unit && <div className="kpi-unit">{unit}</div>}
      {trend && (
        <div className={`kpi-trend ${trend.direction}`}>
          <span>{trend.direction === 'up' ? '↑' : '↓'}</span>
          {trend.percent}% vs last month
        </div>
      )}
    </div>
  );
}
