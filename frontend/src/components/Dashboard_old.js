/**
 * Main Dashboard Component
 * Displays PC leasing data with filtering options
 */

import React, { useState, useEffect } from 'react';
import dashboardService from '../services/dashboardService';
import FilterPanel from './FilterPanel';
import DataDisplay from './DataDisplay';
import '../styles/Dashboard.css';

export default function Dashboard() {
    const [partners, setPartners] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [filterType, setFilterType] = useState('all');
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load partners on component mount
    useEffect(() => {
        const loadPartners = async() => {
            try {
                setLoading(true);
                const response = await dashboardService.getAllPartners();
                setPartners(response.data);
                if (response.data.length > 0) {
                    setSelectedPartner(response.data[0].id);
                }
            } catch (err) {
                setError('Failed to load partners: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        loadPartners();
    }, []);

    // Load projects when partner changes
    useEffect(() => {
        if (!selectedPartner) return;

        const loadProjects = async() => {
            try {
                const response = await dashboardService.getProjects(selectedPartner);
                setProjects(response.data);
                setSelectedProject(null);
                setSelectedClient(null);
                setClients([]);
            } catch (err) {
                console.error('Error loading projects:', err);
            }
        };

        loadProjects();
    }, [selectedPartner]);

    // Load clients when project changes
    useEffect(() => {
        if (!selectedPartner || !selectedProject) return;

        const loadClients = async() => {
            try {
                const response = await dashboardService.getClients(selectedPartner, selectedProject);
                setClients(response.data.data);
                setSelectedClient(null);
            } catch (err) {
                console.error('Error loading clients:', err);
            }
        };

        loadClients();
    }, [selectedPartner, selectedProject]);

    // Load connections for selected partner
    useEffect(() => {
        if (!selectedPartner) return;

        const loadConnections = async() => {
            try {
                const response = await dashboardService.getConnections(selectedPartner);
                setConnections(response.data.connections);
            } catch (err) {
                console.error('Error loading connections:', err);
            }
        };

        loadConnections();
    }, [selectedPartner]);

    // Load dashboard data based on filters
    useEffect(() => {
        if (!selectedPartner) return;

        const loadDashboardData = async() => {
            try {
                setLoading(true);
                let projectId = null;
                let clientId = null;

                if (filterType === 'project' && selectedProject) {
                    projectId = selectedProject;
                } else if (filterType === 'client' && selectedClient) {
                    clientId = selectedClient;
                }

                const response = await dashboardService.getDashboardData(
                    selectedPartner,
                    filterType,
                    projectId,
                    clientId
                );

                setDashboardData(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to load dashboard data: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, [selectedPartner, filterType, selectedProject, selectedClient]);

    const handlePartnerChange = (partnerId) => {
        setSelectedPartner(partnerId);
        setFilterType('all');
    };

    const handleFilterChange = (newFilterType) => {
        setFilterType(newFilterType);
        if (newFilterType === 'all') {
            setSelectedProject(null);
            setSelectedClient(null);
        }
    };

    const handleProjectSelect = (projectId) => {
        setSelectedProject(projectId);
        setSelectedClient(null);
        setFilterType('project');
    };

    const handleClientSelect = (clientId) => {
        setSelectedClient(clientId);
        setFilterType('client');
    };

    return (
      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <h1>PC Leasing Dashboard</h1>
          <p className="header-subtitle">Multi-Partner, Multi-Project Management System</p>
        </header>

        {/* Main Content */}
        <div className="dashboard-content">
          {/* Sidebar */}
          <aside className="dashboard-sidebar">
            <FilterPanel
              partners={partners}
              selectedPartner={selectedPartner}
              onPartnerChange={handlePartnerChange}
              filterType={filterType}
              onFilterChange={handleFilterChange}
              projects={projects}
              selectedProject={selectedProject}
              onProjectSelect={handleProjectSelect}
              clients={clients}
              selectedClient={selectedClient}
              onClientSelect={handleClientSelect}
              connections={connections}
            />
          </aside>

          {/* Main Display Area */}
          <main className="dashboard-main">
            {error && (
              <div className="error-message">
                <strong>Error:</strong> {error}
              </div>
            )}

            {loading && (
              <div className="loading">
                <div className="spinner"></div>
                <p>Loading dashboard data...</p>
              </div>
            )}

            {dashboardData && !loading && (
              <DataDisplay
                data={dashboardData}
                onProjectSelect={handleProjectSelect}
                onClientSelect={handleClientSelect}
              />
            )}
          </main>
        </div>
      </div>
    );
}