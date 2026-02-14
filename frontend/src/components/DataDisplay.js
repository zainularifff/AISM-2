/**
 * DataDisplay Component - Updated to handle combined partners view
 */

import React from 'react';
import ProjectDetailView from './ProjectDetailView';
import '../styles/DataDisplay.css';

export default function DataDisplay({ data, onProjectSelect, onClientSelect }) {
  
  // Handle combined partners view (all partners) - flatten into single display
  if (data.allPartners) {
    // Flatten all projects from all partners into one array
    const allProjects = [];
    const partnerMap = {}; // Map to track partner name for each project
    
    data.partners.forEach((partnerData) => {
      if (partnerData.projects && Array.isArray(partnerData.projects)) {
        partnerData.projects.forEach((project) => {
          allProjects.push(project);
          partnerMap[project.id] = partnerData.partnerName;
        });
      }
    });

    const totalPCs = allProjects.reduce((sum, p) => sum + (p.statistics?.totalPCs || 0), 0);
    const totalLeases = allProjects.reduce((sum, p) => sum + (p.statistics?.activeLeases || 0), 0);
    const totalClients = allProjects.reduce((sum, p) => sum + (p.clients?.length || 0), 0);
    const totalTickets = allProjects.reduce((sum, p) => sum + (p.statistics?.maintenanceTickets || 0), 0);

    return (
      <div className="data-display">
        <div className="combined-header">
          <h2>System Overview - All Partners</h2>
          <p className="partners-count">Complete System Dashboard</p>
          <div className="statistics-grid" style={{ marginTop: '15px' }}>
            <div className="stat-card">
              <div className="stat-value">{data.partners.length}</div>
              <div className="stat-label">Total Partner</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{allProjects.length}</div>
              <div className="stat-label">Total Project</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{totalClients}</div>
              <div className="stat-label">Total Client</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{totalPCs}</div>
              <div className="stat-label">Total PC</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{totalLeases}</div>
              <div className="stat-label">Active Lease</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{totalTickets}</div>
              <div className="stat-label">Open Ticket</div>
            </div>
          </div>
        </div>

        <div className="all-projects-view">
          {allProjects.map((project) => (
            <div key={project.id} className="project-card">
                <div className="project-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4>{project.name}</h4>
                    <p className="project-description">{project.description}</p>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#666', whiteSpace: 'nowrap', marginLeft: '10px' }}>
                    {partnerMap[project.id]}
                  </span>
                </div>

                <div 
                  onClick={() => onProjectSelect(project.id)}
                  style={{ cursor: 'pointer', padding: '10px 0' }}
                >
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
                            onClick={(e) => {
                              e.stopPropagation();
                              onClientSelect(client.id);
                            }}
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
              </div>
            ))}
          </div>
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
  if (!data.data || !Array.isArray(data.data)) {
    return (
      <div className="data-display">
        <div className="empty-state">
          <p>No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="data-display">
      {/* Partner Info */}
      <div className="partner-info">
        <h2>{data.partner?.name || 'Unknown Partner'}</h2>
        <p className="filter-indicator">
          Filter: <strong>{data.filterType === 'all' ? 'All Projects & Clients' : data.filterType}</strong>
        </p>
      </div>

      {/* Main Display */}
      {data.filterType === 'all' && (
        <div className="all-projects-view">
          {Array.isArray(data.data) && data.data.map((project) => (
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
