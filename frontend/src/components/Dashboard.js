/**
 * Main Dashboard Component - Redesigned
 * Displays PC leasing data with navbar filters
 * Default view shows ALL partners combined data
 */

import React, { useState, useEffect } from 'react';
import dashboardService from '../services/dashboardService';
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load partners on component mount
    useEffect(() => {
        const loadPartners = async() => {
            try {
                setLoading(true);
                const response = await dashboardService.getAllPartners();
                setPartners(response.data);
                // Don't set a default partner - show all initially
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
        if (!selectedPartner) {
            setProjects([]);
            setSelectedProject(null);
            setSelectedClient(null);
            setClients([]);
            return;
        }

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
                // service returns axios response.data (e.g. { success: true, data: [...] })
                setClients(response && response.data ? response.data : []);
                setSelectedClient(null);
            } catch (err) {
                console.error('Error loading clients:', err);
            }
        };

        loadClients();
    }, [selectedPartner, selectedProject]);

    // Load dashboard data based on filters
    useEffect(() => {
        // If no partner selected, load combined data for all partners
        if (!selectedPartner) {
            const loadCombinedData = async() => {
                try {
                    setLoading(true);
                    // Create combined dashboard data from all partners
                    const allProjectsData = [];

                    for (const partner of partners) {
                        try {
                            const response = await dashboardService.getDashboardData(
                                partner.id,
                                'all'
                            );
                            if (response && response.data) {
                                allProjectsData.push({
                                    partnerId: partner.id,
                                    partnerName: partner.name,
                                    projects: response.data
                                });
                            }
                        } catch (err) {
                            console.error(`Error loading data for ${partner.name}:`, err);
                        }
                    }

                    setDashboardData({
                        allPartners: true,
                        partners: allProjectsData,
                        filterType: 'all'
                    });
                    setError(null);
                } catch (err) {
                    setError('Failed to load dashboard data: ' + err.message);
                } finally {
                    setLoading(false);
                }
            };

            loadCombinedData();
            return;
        }

        // If partner is selected, load that partner's specific data
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

                // Backend returns: { success: true, data: { partner, filterType, data: [...] } }
                // response.data is already the dashboardData object
                const dashData = response ? .data || {};
                setDashboardData({
                    allPartners: false,
                    partner: dashData.partner || {
                        id: selectedPartner,
                        name: partners.find(p => p.id === selectedPartner) ? .name || ''
                    },
                    filterType: dashData.filterType || filterType,
                    data: Array.isArray(dashData.data) ? dashData.data : []
                });
                setError(null);
            } catch (err) {
                setError('Failed to load dashboard data: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, [selectedPartner, filterType, selectedProject, selectedClient, partners]);

    const handlePartnerChange = (partnerId) => {
        setSelectedPartner(partnerId);
        setFilterType('all');
    };

    const handleClearPartner = () => {
        setSelectedPartner(null);
        setFilterType('all');
        setSelectedProject(null);
        setSelectedClient(null);
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

    return ( <
        div className = "dashboard-container" > { /* Header */ } <
        header className = "dashboard-header" >
        <
        h1 > nPoint Management Dashboard < /h1> <
        /header>

        { /* Navigation Bar (Filters) */ } <
        nav className = "dashboard-navbar" >
        <
        div className = "navbar-content" > { /* Partner Selector */ } <
        div className = "nav-section" >
        <
        label > PARTNER: < /label> <
        select value = { selectedPartner || '' }
        onChange = {
            (e) => e.target.value ? handlePartnerChange(e.target.value) : handleClearPartner() }
        className = "nav-select" >
        <
        option value = "" > All Partners < /option> {
            partners.map(partner => ( <
                option key = { partner.id }
                value = { partner.id } > { partner.name } <
                /option>
            ))
        } <
        /select> <
        /div>

        { /* Filter Type Radio Buttons */ } {
            selectedPartner && ( <
                div className = "nav-section" >
                <
                label > VIEW LEVEL: < /label> <
                div className = "radio-group" >
                <
                label className = "radio-label" >
                <
                input type = "radio"
                name = "filterType"
                value = "all"
                checked = { filterType === 'all' }
                onChange = {
                    (e) => handleFilterChange(e.target.value) }
                />
                All Projects & Clients <
                /label> <
                label className = "radio-label" >
                <
                input type = "radio"
                name = "filterType"
                value = "project"
                checked = { filterType === 'project' }
                onChange = {
                    (e) => handleFilterChange(e.target.value) }
                />
                By Project <
                /label> <
                label className = "radio-label" >
                <
                input type = "radio"
                name = "filterType"
                value = "client"
                checked = { filterType === 'client' }
                onChange = {
                    (e) => handleFilterChange(e.target.value) }
                />
                By Client <
                /label> <
                /div> <
                /div>
            )
        }

        { /* Project Selector */ } {
            selectedPartner && (filterType === 'project' || filterType === 'client') && projects.length > 0 && ( <
                div className = "nav-section" >
                <
                label > PROJECT: < /label> <
                select value = { selectedProject || '' }
                onChange = {
                    (e) => handleProjectSelect(e.target.value) }
                className = "nav-select" >
                <
                option value = "" > Select Project < /option> {
                    projects.map(project => ( <
                        option key = { project.id }
                        value = { project.id } > { project.name } <
                        /option>
                    ))
                } <
                /select> <
                /div>
            )
        }

        { /* Client Selector */ } {
            selectedPartner && filterType === 'client' && selectedProject && clients.length > 0 && ( <
                div className = "nav-section" >
                <
                label > CLIENT: < /label> <
                select value = { selectedClient || '' }
                onChange = {
                    (e) => handleClientSelect(e.target.value) }
                className = "nav-select" >
                <
                option value = "" > Select Client < /option> {
                    clients.map(client => ( <
                        option key = { client.id }
                        value = { client.id } > { client.name } <
                        /option>
                    ))
                } <
                /select> <
                /div>
            )
        } <
        /div> <
        /nav>

        { /* Main Content */ } <
        main className = "dashboard-main" > {
            error && ( <
                div className = "error-message" > 🔴 < strong > Error: < /strong> {error} <
                /div>
            )
        }

        {
            loading && ( <
                div className = "loading-spinner" >
                <
                div className = "spinner" > < /div> <
                p > Loading dashboard data... < /p> <
                /div>
            )
        }

        {
            dashboardData && !loading && ( <
                DataDisplay data = { dashboardData }
                onProjectSelect = { handleProjectSelect }
                onClientSelect = { handleClientSelect }
                />
            )
        } <
        /main> <
        /div>
    );
}