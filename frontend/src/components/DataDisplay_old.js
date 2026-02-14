/**
 * DataDisplay Component
 * Displays dashboard data, statistics, and information
 */

import React from 'react';
import ProjectDetailView from './ProjectDetailView';
import '../styles/DataDisplay.css';

export default function DataDisplay({
  data,
  onProjectSelect,
  onClientSelect
}) {
  const renderStatistics = (stats) => (
    <div className="statistics-grid">
      <div className="stat-card">
        <div className="stat-value">{stats.totalPCs || 0}</div>
        <div className="stat-label">Total PCs</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">{stats.activeLeases || 0}</div>
        <div className="stat-label">Active Leases</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">{stats.expiredLeases || 0}</div>
        <div className="stat-label">Expired Leases</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">{stats.maintenanceTickets || 0}</div>
        <div className="stat-label">Maintenance Tickets</div>
      </div>
    </div>
  );

  const renderDatabaseQuality = (dbQuality) => (
    <div className="database-quality">
      <h4>Database Status</h4>
      <div className="db-status-grid">
        {Object.entries(dbQuality).map(([key, status]) => (
          <div key={key} className="db-status-item">
            <div className={`status-indicator ${status}`}></div>
            <strong>{key.replace(/([A-Z])/g, ' $1')}</strong>
          </div>
        ))}
      </div>
    </div>
  );

  // Show detailed project/client view
  if ((data.filterType === 'project' || data.filterType === 'client') && data.data[0]) {
    return <ProjectDetailView project={data.data[0]} client={data.data[0].name ? data.data[0] : null} />;
  }

  // Show all projects and clients summary
  return (
    <div className="data-display">
      {/* Partner Info */}
      <div className="partner-info">
        <h2>{data.partner.name}</h2>
        <p className="filter-indicator">
          Filter: <strong>{data.filterType === 'all' ? 'All Projects & Clients' : data.filterType}</strong>
        </p>
      </div>

      {/* Main Display */}
      {data.filterType === 'all' && (
        <div className="all-projects-view">
          {data.data.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-header" onClick={() => onProjectSelect(project.id)}>
                <h3>{project.name}</h3>
                <p className="project-description">{project.description}</p>
              </div>

              {project.statistics && renderStatistics(project.statistics)}

              {project.clients && project.clients.length > 0 && (
                <div className="clients-section">
                  <h4>Clients ({project.clients.length})</h4>
                  <div className="clients-grid">
                    {project.clients.map((client) => (
                      <div
                        key={client.id}
                        className="client-card"
                        onClick={() => onClientSelect(client.id)}
                      >
                        <h5>{client.name}</h5>
                        <span className={`status-badge ${client.status}`}>{client.status}</span>
                        {client.statistics && (
                          <div className="client-stats">
                            <small>PCs: {client.statistics.totalPCs}</small>
                            <small>Active: {client.statistics.activeLeases}</small>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}