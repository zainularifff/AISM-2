/**
 * Main Server Application
 * PC Leasing Dashboard Backend
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const dashboardRoutes = require('./routes/dashboardRoutes');
const connectionManager = require('./database/connectionManager');
const dbConfig = require('./config/dbConfig');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Initialize database connections on startup
async function initializeConnections() {
    console.log('Initializing database connections...');

    for (const partner of dbConfig.partners) {
        console.log(`\n--- Registering connections for ${partner.name} ---`);

        for (const connection of partner.dbConnections) {
            try {
                connectionManager.registerConnection(partner.id, connection.id, connection);

                // Establish connection immediately to verify
                await connectionManager.getConnection(partner.id, connection.id);
                console.log(`✓ ${connection.name} (${connection.type})`);
            } catch (error) {
                console.warn(`✗ ${connection.name}: ${error.message}`);
                // Continue even if one connection fails
            }
        }
    }

    console.log('\nDatabase initialization complete.\n');
}

// Routes
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// Partners endpoint
app.get('/api/partners', (req, res) => {
    const partners = dbConfig.partners.map(p => ({
        id: p.id,
        name: p.name,
        projectsCount: p.projects.length,
        status: 'active'
    }));

    res.status(200).json({
        success: true,
        data: partners
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// 404 handling
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.path}`
    });
});

// Graceful shutdown
process.on('SIGINT', async() => {
    console.log('\nShutting down gracefully...');
    await connectionManager.closeAllConnections();
    process.exit(0);
});

// Start server
async function startServer() {
    try {
        // Initialize database connections
        await initializeConnections();

        app.listen(PORT, () => {
            console.log(`\n✓ Server running on http://localhost:${PORT}`);
            console.log(`✓ API Documentation:`);
            console.log(`  - GET  /api/partners`);
            console.log(`  - GET  /api/dashboard?partnerId=PARTNER_001&filterType=all`);
            console.log(`  - GET  /api/partners/:partnerId/projects`);
            console.log(`  - GET  /api/partners/:partnerId/projects/:projectId/clients`);
            console.log(`  - GET  /api/partners/:partnerId/connections`);
            console.log(`  - GET  /health\n`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

module.exports = app;