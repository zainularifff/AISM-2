/**
 * FilterPanel Component
 * Provides filtering options by Project and Client
 */

import React from 'react';
import '../styles/FilterPanel.css';

export default function FilterPanel({
    partners,
    selectedPartner,
    onPartnerChange,
    filterType,
    onFilterChange,
    projects,
    selectedProject,
    onProjectSelect,
    clients,
    selectedClient,
    onClientSelect,
    connections
}) {
    return (
      <div className="filter-panel">
        {/* Partner Selection */}
        <div className="filter-section">
          <h3>Partner</h3>
          <select
            value={selectedPartner || ''}
            onChange={(e) => onPartnerChange(e.target.value)}
            className="filter-select"
          >
            <option value="">Select Partner</option>
            {partners.map((partner) => (
              <option key={partner.id} value={partner.id}>
                {partner.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Type Selection */}
        <div className="filter-section">
          <h3>View Level</h3>
          <div className="filter-options">
            <label className="radio-label">
              <input
                type="radio"
                value="all"
                checked={filterType === 'all'}
                onChange={(e) => onFilterChange(e.target.value)}
              />
              <span>All Projects & Clients</span>
            </label>

            <label className="radio-label">
              <input
                type="radio"
                value="project"
                checked={filterType === 'project'}
                onChange={(e) => onFilterChange(e.target.value)}
              />
              <span>By Project</span>
            </label>

            <label className="radio-label">
              <input
                type="radio"
                value="client"
                checked={filterType === 'client'}
                onChange={(e) => onFilterChange(e.target.value)}
              />
              <span>By Client</span>
            </label>
          </div>
        </div>

        {/* Project Selection */}
        {(filterType === 'project' || filterType === 'client') && (
          <div className="filter-section">
            <h3>Project</h3>
            <select
              value={selectedProject || ''}
              onChange={(e) => onProjectSelect(e.target.value)}
              className="filter-select"
            >
              <option value="">Select Project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name} ({project.clientsCount} clients)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Client Selection */}
        {filterType === 'client' && selectedProject && (
          <div className="filter-section">
            <h3>Client</h3>
            <select
              value={selectedClient || ''}
              onChange={(e) => onClientSelect(e.target.value)}
              className="filter-select"
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Database Connections */}
        <div className="filter-section connections-section">
          <h3>Database Connections</h3>
          <div className="connections-list">
            {connections && connections.length > 0 ? (
              connections.map((conn) => (
                <div key={conn.id} className="connection-item">
                  <div className="connection-status active"></div>
                  <div className="connection-info">
                    <strong>{conn.name}</strong>
                    <small>{conn.type}</small>
                    <small className="server-name">{conn.server}</small>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-connections">No connections configured</p>
            )}
          </div>
        </div>

        {/* Filter Summary */}
        <div className="filter-summary">
          <h4>Current Filter</h4>
          <ul>
            <li><strong>Level:</strong> {filterType === 'all' ? 'All Projects & Clients' : filterType === 'project' ? 'Project' : 'Client'}</li>
            {selectedProject && <li><strong>Project:</strong> {selectedProject}</li>}
            {selectedClient && <li><strong>Client:</strong> {selectedClient}</li>}
          </ul>
        </div>
      </div>
    );
}