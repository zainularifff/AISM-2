/**
 * Dashboard Controller
 * Handles data retrieval and filtering by Project and Client levels
 */

const connectionManager = require('../database/connectionManager');
const dbConfig = require('../config/dbConfig');

class DashboardController {
    /**
     * Get dashboard data with dynamic filtering
     * Filter options:
     * - all: Show all projects and clients combined
     * - project: Show specific project with all its clients
     * - client: Show specific client
     */
    async getDashboardData(req, res) {
        try {
            const { partnerId, filterType = 'all', projectId, clientId } = req.query;

            // Validate partner exists
            const partner = dbConfig.partners.find(p => p.id === partnerId);
            if (!partner) {
                return res.status(404).json({
                    success: false,
                    message: 'Partner not found',
                    error: `Partner ID: ${partnerId}`
                });
            }

            let dashboardData = {
                partner: {
                    id: partner.id,
                    name: partner.name
                },
                filterType,
                data: []
            };

            switch (filterType) {
                case 'all':
                    dashboardData.data = await this._getAllProjectsAndClients(partnerId);
                    break;

                case 'project':
                    if (projectId) {
                        dashboardData.data = await this._getProjectData(partnerId, projectId);
                    } else {
                        // If no projectId provided, return all projects
                        dashboardData.data = await this._getAllProjectsAndClients(partnerId);
                    }
                    break;

                case 'client':
                    if (clientId) {
                        dashboardData.data = await this._getClientData(partnerId, clientId);
                    } else {
                        // If no clientId provided, return all projects
                        dashboardData.data = await this._getAllProjectsAndClients(partnerId);
                    }
                    break;

                default:
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid filterType. Use: all, project, or client'
                    });
            }

            return res.status(200).json({
                success: true,
                data: dashboardData,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Dashboard error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to retrieve dashboard data',
                error: error.message
            });
        }
    }

    /**
     * Get all projects and clients for a partner
     */
    async _getAllProjectsAndClients(partnerId) {
        const partner = dbConfig.partners.find(p => p.id === partnerId);
        const results = [];

        for (const projectId of partner.projects) {
            const project = dbConfig.projects[projectId];
            const projectData = {
                type: 'project',
                id: project.id,
                name: project.name,
                description: project.description,
                clients: [],
                statistics: await this._getProjectStatistics(partnerId, projectId)
            };

            // Add clients for this project
            for (const clientId of project.clients) {
                const client = dbConfig.clients[clientId];
                projectData.clients.push({
                    type: 'client',
                    id: client.id,
                    name: client.name,
                    status: client.status,
                    statistics: await this._getClientStatistics(partnerId, projectId, clientId)
                });
            }

            results.push(projectData);
        }

        return results;
    }

    /**
     * Get data for a specific project with all its clients
     */
    async _getProjectData(partnerId, projectId) {
        const project = dbConfig.projects[projectId];

        if (!project || project.partnerId !== partnerId) {
            throw new Error(`Project not found or does not belong to partner: ${projectId}`);
        }

        const projectData = {
            type: 'project',
            id: project.id,
            name: project.name,
            description: project.description,
            databaseConnections: project.dbConnections,
            clients: [],
            statistics: await this._getProjectStatistics(partnerId, projectId)
        };

        // Add clients for this project
        for (const clientId of project.clients) {
            const client = dbConfig.clients[clientId];
            projectData.clients.push({
                type: 'client',
                id: client.id,
                name: client.name,
                status: client.status,
                statistics: await this._getClientStatistics(partnerId, projectId, clientId)
            });
        }

        return [projectData];
    }

    /**
     * Get data for a specific client
     */
    async _getClientData(partnerId, clientId) {
        const client = dbConfig.clients[clientId];

        if (!client) {
            throw new Error(`Client not found: ${clientId}`);
        }

        const project = dbConfig.projects[client.projectId];

        if (project.partnerId !== partnerId) {
            throw new Error(`Client does not belong to partner: ${partnerId}`);
        }

        const clientData = {
            type: 'client',
            id: client.id,
            name: client.name,
            status: client.status,
            projectId: client.projectId,
            projectName: project.name,
            databaseConnections: project.dbConnections,
            statistics: await this._getClientStatistics(partnerId, client.projectId, clientId)
        };

        return [clientData];
    }

    /**
     * Get project-level statistics
     */
    async _getProjectStatistics(partnerId, projectId) {
        const project = dbConfig.projects[projectId];

        const statistics = {
            totalClients: project.clients.length,
            totalPCs: 0,
            activeLeases: 0,
            expiredLeases: 0,
            maintenanceTickets: 0,
            dataQuality: {
                hardwareSoftwareDB: 'connected',
                helpdeskDB: 'connected',
                crmDB: 'connected'
            }
        };

        // In production, fetch actual data from databases
        // For now, returning mock data
        for (const connectionId of project.dbConnections) {
            try {
                // This would normally query the actual database
                // const result = await connectionManager.query(partnerId, connectionId, 'SELECT COUNT(*) FROM devices');
                statistics.totalPCs += Math.floor(Math.random() * 1000) + 100;
            } catch (error) {
                console.log(`Could not connect to ${connectionId}:`, error.message);
            }
        }

        statistics.activeLeases = Math.floor(statistics.totalPCs * 0.85);
        statistics.expiredLeases = Math.floor(statistics.totalPCs * 0.15);
        statistics.maintenanceTickets = Math.floor(Math.random() * 50);

        return statistics;
    }

    /**
     * Get client-level statistics
     */
    async _getClientStatistics(partnerId, projectId, clientId) {
        const statistics = {
            totalPCs: Math.floor(Math.random() * 500) + 50,
            activeLeases: 0,
            expiredLeases: 0,
            maintenanceTickets: Math.floor(Math.random() * 20),
            lastUpdated: new Date().toISOString()
        };

        statistics.activeLeases = Math.floor(statistics.totalPCs * 0.85);
        statistics.expiredLeases = Math.floor(statistics.totalPCs * 0.15);

        return statistics;
    }

    /**
     * List all projects for a partner
     */
    async listProjects(req, res) {
        try {
            const { partnerId } = req.params;

            const partner = dbConfig.partners.find(p => p.id === partnerId);
            if (!partner) {
                return res.status(404).json({
                    success: false,
                    message: 'Partner not found'
                });
            }

            const projects = partner.projects.map(projectId => {
                const project = dbConfig.projects[projectId];
                return {
                    id: project.id,
                    name: project.name,
                    description: project.description,
                    clientsCount: project.clients.length,
                    status: 'active'
                };
            });

            return res.status(200).json({
                success: true,
                data: projects
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * List all clients for a project
     */
    async listClients(req, res) {
        try {
            const { partnerId, projectId } = req.params;

            const project = dbConfig.projects[projectId];
            if (!project || project.partnerId !== partnerId) {
                return res.status(404).json({
                    success: false,
                    message: 'Project not found or does not belong to partner'
                });
            }

            const clients = project.clients.map(clientId => {
                const client = dbConfig.clients[clientId];
                return {
                    id: client.id,
                    name: client.name,
                    status: client.status
                };
            });

            return res.status(200).json({
                success: true,
                partner: partnerId,
                project: projectId,
                data: clients
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get database connection info for a partner
     */
    async getConnectionInfo(req, res) {
        try {
            const { partnerId } = req.params;

            const partner = dbConfig.partners.find(p => p.id === partnerId);
            if (!partner) {
                return res.status(404).json({
                    success: false,
                    message: 'Partner not found'
                });
            }

            const connections = partner.dbConnections.map(conn => ({
                id: conn.id,
                name: conn.name,
                type: conn.type,
                server: conn.host,
                database: conn.database,
                status: 'active'
            }));

            return res.status(200).json({
                success: true,
                partner: {
                    id: partner.id,
                    name: partner.name
                },
                connections
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new DashboardController();