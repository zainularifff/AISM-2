/**
 * ProjectDetailView Component
 * Executive dashboard view with comprehensive charts and metrics
 */

import React from 'react';
import KPICard from './KPICard';
import LeaseLifecycleChart from './LeaseLifecycleChart';
import DeviceStatusChart from './DeviceStatusChart';
import MaintenanceTrendChart from './MaintenanceTrendChart';
import TopClientsChart from './TopClientsChart';
import PaymentHistoryChart from './PaymentHistoryChart';
import ExpiringLeasesTable from './ExpiringLeasesTable';
import '../styles/ProjectDetailView.css';

export default function ProjectDetailView({ project, client }) {
  // Mock data - replace with real data from backend
  const projectMetrics = {
    totalPCs: 670,
    activeLeases: 569,
    revenue: 125000,
    profitMargin: 28,
    slaCompliance: 96
  };

  const kpis = [
    {
      title: 'Total PCs',
      value: projectMetrics.totalPCs,
      unit: 'devices',
      status: 'normal',
      trend: { direction: 'up', percent: 5 }
    },
    {
      title: 'Active Leases',
      value: projectMetrics.activeLeases,
      unit: 'active',
      status: 'success',
      trend: { direction: 'up', percent: 8 }
    },
    {
      title: 'Monthly Revenue',
      value: projectMetrics.revenue,
      unit: '$',
      status: 'normal',
      trend: { direction: 'up', percent: 12 }
    },
    {
      title: 'Profit Margin',
      value: projectMetrics.profitMargin,
      unit: '%',
      status: 'success'
    }
  ];

  if (!project) {
    return <div className="project-detail-view">Loading project details...</div>;
  }

  return (
    <div className="project-detail-view-wrapper">
      <div className="project-detail-view">
        {/* Header */}
        <div className="view-header">
          <div className="header-content">
            <h1>{project.name}</h1>
            {client && <p className="client-context">Client: {client.name}</p>}
            <div className="header-meta">
              {project.dbConnections && (
                <span className="db-sources">
                  📊 {project.dbConnections.length} data sources connected
                </span>
              )}
              <span className="last-updated">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        {/* KPI Cards - Grid Layout */}
        <div className="kpi-grid">
          {kpis.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>

        {/* Charts Section - Disabled temporarily */}
        <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px', marginBottom: '24px' }}>
          <p>Charts loading...</p>
        </div>

        {/* Detailed Lease Information */}
        <div className="detailed-section">
          <h3>Detailed Lease Information</h3>
          <div className="lease-details-table">
            <table>
              <thead>
                <tr>
                  <th>Device ID</th>
                  <th>Client</th>
                  <th>Device Type</th>
                  <th>Lease Start</th>
                  <th>Lease End</th>
                  <th>Status</th>
                  <th>Monthly Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>DEV-001</td>
                  <td>KWSP</td>
                  <td>Laptop</td>
                  <td>2024-01-15</td>
                  <td>2026-01-15</td>
                  <td><span className="status-active">Active</span></td>
                  <td>$450</td>
                </tr>
                <tr>
                  <td>DEV-002</td>
                  <td>JPJ</td>
                  <td>Desktop</td>
                  <td>2023-06-01</td>
                  <td>2026-03-15</td>
                  <td><span className="status-active">Active</span></td>
                  <td>$350</td>
                </tr>
                <tr>
                  <td>DEV-003</td>
                  <td>PERKESO</td>
                  <td>Laptop</td>
                  <td>2022-12-01</td>
                  <td>2026-04-10</td>
                  <td><span className="status-maintenance">Maintenance</span></td>
                  <td>$450</td>
                </tr>
                <tr>
                  <td>DEV-004</td>
                  <td>RISDA_CLIENT_1</td>
                  <td>Server</td>
                  <td>2023-03-15</td>
                  <td>2026-05-01</td>
                  <td><span className="status-active">Active</span></td>
                  <td>$1200</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
