/**
 * DataDisplay Component - Updated to handle combined partners view
 */

import React from 'react';
import ProjectDetailView from './ProjectDetailView';
import '../styles/DataDisplay.css';

export default function DataDisplay({ data, onProjectSelect, onClientSelect }) {
  
  // Handle combined partners view (all partners)
  if (data.allPartners) {
    return (
      <div className="data-display">
        <div className="combined-header">
          <h2>System Overview - All Partners</h2>
          <p className="partners-count">Viewing {data.partners.length} partner(s)</p>
        </div>

        {data.partners.map((partnerData) => (
          <div key={partnerData.partnerId} className="partner-section">
            <h3 className="partner-title">
              📊 {partnerData.partnerName}
            </h3>

            {partnerData.projects && partnerData.projects.length > 0 ? (
              <div className="all-projects-view">
                {partnerData.projects.map((project) => (
                  <div key={project.id} className="project-card">
                    <div 
                      className="project-header"
                      onClick={() => onProjectSelect(project.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <h4>{project.name}</h4>
                      <p className="project-description">{project.description}</p>
                    </div>

                    {project.statistics && (
                      <div className="statistics-grid">
                        <div className="stat-card">
                          <div className="stat-value">{project.statistics.totalPCs || 0}</div>
                          <div className="stat-label">Total PCs</div>
                        </div>
                        <div className="stat-card">
                          <div className="stat-value">{project.statistics.activeLeases || 0}</div>
                          <div className="stat-label">Active Leases</div>
                        </div>
                        <div className="stat-card">
                          <div className="stat-value">{project.statistics.expiredLeases || 0}</div>
                          <div className="stat-label">Expired Leases</div>
                        </div>
                        <div className="stat-card">
                          <div className="stat-value">{project.statistics.maintenanceTickets || 0}</div>
                          <div className="stat-label">Maintenance</div>
                        </div>
                      </div>
                    )}

                    {project.clients && project.clients.length > 0 && (
                      <div className="clients-section">
                        <h5>Clients ({project.clients.length})</h5>
                        <div className="clients-grid">
                          {project.clients.map((client) => (
                            <div
                              key={client.id}
                              className="client-card"
                              onClick={() => onClientSelect(client.id)}
                              style={{ cursor: 'pointer' }}
                            >
                              <h6>{client.name}</h6>
                              <span className={`status-badge ${client.status}`}>
                                {client.status}
                              </span>
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
            ) : (
              <div className="empty-state">
                <p>No projects found for {partnerData.partnerName}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Handle single partner view
  if (data.filterType === 'project' || data.filterType === 'client') {
    if (data.data && data.data[0]) {
      return (
        <ProjectDetailView 
          project={data.data[0]} 
          client={data.data[0].name ? data.data[0] : null} 
        />
      );
    }
  }

  // Handle all projects view for single partner
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
          {data.data && data.data.map((project) => (
            <div key={project.id} className="project-card">
              <div 
                className="project-header"
                onClick={() => onProjectSelect(project.id)}
                style={{ cursor: 'pointer' }}
              >
                <h3>{project.name}</h3>
                <p className="project-description">{project.description}</p>
              </div>

              {project.statistics && (
                <div className="statistics-grid">
                  <div className="stat-card">
                    <div className="stat-value">{project.statistics.totalPCs || 0}</div>
                    <div className="stat-label">Total PCs</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{project.statistics.activeLeases || 0}</div>
                    <div className="stat-label">Active Leases</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{project.statistics.expiredLeases || 0}</div>
                    <div className="stat-label">Expired Leases</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{project.statistics.maintenanceTickets || 0}</div>
                    <div className="stat-label">Maintenance Tickets</div>
                  </div>
                </div>
              )}

              {project.clients && project.clients.length > 0 && (
                <div className="clients-section">
                  <h4>Clients ({project.clients.length})</h4>
                  <div className="clients-grid">
                    {project.clients.map((client) => (
                      <div
                        key={client.id}
                        className="client-card"
                        onClick={() => onClientSelect(client.id)}
                        style={{ cursor: 'pointer' }}
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
