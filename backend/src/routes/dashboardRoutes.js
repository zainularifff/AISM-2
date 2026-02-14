/**
 * Dashboard Routes
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

/**
 * GET /api/dashboard
 * Get dashboard data with filtering
 * Query params:
 * - partnerId (required)
 * - filterType (all|project|client) default: all
 * - projectId (required if filterType=project)
 * - clientId (required if filterType=client)
 */
router.get('/', dashboardController.getDashboardData.bind(dashboardController));

/**
 * GET /api/partners/:partnerId/projects
 * List all projects for a partner
 */
router.get('/partners/:partnerId/projects', dashboardController.listProjects.bind(dashboardController));

/**
 * GET /api/partners/:partnerId/projects/:projectId/clients
 * List all clients for a project
 */
router.get('/partners/:partnerId/projects/:projectId/clients', dashboardController.listClients.bind(dashboardController));

/**
 * GET /api/partners/:partnerId/connections
 * Get database connection information for a partner
 */
router.get('/partners/:partnerId/connections', dashboardController.getConnectionInfo.bind(dashboardController));

module.exports = router;