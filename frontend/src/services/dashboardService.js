/**
 * Dashboard API Service
 * Communication with backend
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const dashboardService = {
    /**
     * Get all partners
     */
    getAllPartners: async() => {
        try {
            const response = await api.get('/partners');
            return response.data;
        } catch (error) {
            console.error('Error fetching partners:', error);
            throw error;
        }
    },

    /**
     * Get dashboard data with filtering
     * @param {string} partnerId
     * @param {string} filterType - 'all', 'project', or 'client'
     * @param {string} projectId - optional, required if filterType='project'
     * @param {string} clientId - optional, required if filterType='client'
     */
    getDashboardData: async(partnerId, filterType = 'all', projectId = null, clientId = null) => {
        try {
            const params = {
                partnerId,
                filterType
            };

            if (projectId) params.projectId = projectId;
            if (clientId) params.clientId = clientId;

            const response = await api.get('/dashboard', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            throw error;
        }
    },

    /**
     * Get all projects for a partner
     */
    getProjects: async(partnerId) => {
        try {
            const response = await api.get(`/dashboard/partners/${partnerId}/projects`);
            return response.data;
        } catch (error) {
            console.error('Error fetching projects:', error);
            throw error;
        }
    },

    /**
     * Get all clients for a project
     */
    getClients: async(partnerId, projectId) => {
        try {
            const response = await api.get(`/dashboard/partners/${partnerId}/projects/${projectId}/clients`);
            return response.data;
        } catch (error) {
            console.error('Error fetching clients:', error);
            throw error;
        }
    },

    /**
     * Get database connections for a partner
     */
    getConnections: async(partnerId) => {
        try {
            const response = await api.get(`/dashboard/partners/${partnerId}/connections`);
            return response.data;
        } catch (error) {
            console.error('Error fetching connections:', error);
            throw error;
        }
    }
};

export default dashboardService;