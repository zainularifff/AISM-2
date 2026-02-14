/**
 * Multi-Server Database Connection Manager
 * Handles connections to multiple partner servers with different database types
 */

const { Pool } = require('pg');
const mysql = require('mysql2/promise');
const sqlite3 = require('sqlite3').verbose();

class ConnectionManager {
    constructor() {
        this.connections = new Map(); // Store active connections
        this.poolConfigs = new Map(); // Store pool configurations
        this.dbSchemas = new Map(); // Store which database belongs to which owner
    }

    /**
     * Register a database connection configuration
     * @param {string} ownerId - Partner/Owner ID
     * @param {string} connectionId - Unique connection identifier
     * @param {object} config - Database configuration
     */
    registerConnection(ownerId, connectionId, config) {
        const key = `${ownerId}:${connectionId}`;

        this.dbSchemas.set(key, {
            ownerId,
            connectionId,
            dbType: config.type,
            name: config.name,
            server: config.server
        });

        this.poolConfigs.set(key, config);
        console.log(`Registered connection: ${key}`);
    }

    /**
     * Get or create a database connection
     * @param {string} ownerId - Partner/Owner ID
     * @param {string} connectionId - Connection identifier
     * @returns {Promise<any>} - Database connection pool
     */
    async getConnection(ownerId, connectionId) {
        const key = `${ownerId}:${connectionId}`;

        // Return existing connection if available
        if (this.connections.has(key)) {
            return this.connections.get(key);
        }

        const config = this.poolConfigs.get(key);
        if (!config) {
            throw new Error(`Connection not registered: ${key}`);
        }

        let connection;

        switch (config.type) {
            case 'postgresql':
                connection = await this._createPostgresConnection(config);
                break;
            case 'mysql':
                connection = await this._createMysqlConnection(config);
                break;
            case 'sqlite':
                connection = this._createSqliteConnection(config);
                break;
            default:
                throw new Error(`Unsupported database type: ${config.type}`);
        }

        this.connections.set(key, connection);
        return connection;
    }

    /**
     * Create PostgreSQL connection pool
     */
    async _createPostgresConnection(config) {
        const pool = new Pool({
            user: config.username,
            password: config.password,
            host: config.host,
            port: config.port,
            database: config.database
        });

        // Test connection
        try {
            const client = await pool.connect();
            console.log(`Connected to PostgreSQL: ${config.host}:${config.port}/${config.database}`);
            client.release();
        } catch (error) {
            console.error(`PostgreSQL connection failed: ${error.message}`);
            throw error;
        }

        return pool;
    }

    /**
     * Create MySQL connection pool
     */
    async _createMysqlConnection(config) {
        const pool = mysql.createPool({
            host: config.host,
            user: config.username,
            password: config.password,
            database: config.database,
            port: config.port,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        // Test connection
        try {
            const connection = await pool.getConnection();
            console.log(`Connected to MySQL: ${config.host}:${config.port}/${config.database}`);
            await connection.release();
        } catch (error) {
            console.error(`MySQL connection failed: ${error.message}`);
            throw error;
        }

        return pool;
    }

    /**
     * Create SQLite connection
     */
    _createSqliteConnection(config) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(config.path, (err) => {
                if (err) {
                    console.error(`SQLite connection failed: ${err.message}`);
                    reject(err);
                } else {
                    console.log(`Connected to SQLite: ${config.path}`);
                    resolve(db);
                }
            });
        });
    }

    /**
     * Execute query on specific database
     * @param {string} ownerId - Partner/Owner ID
     * @param {string} connectionId - Connection identifier
     * @param {string} query - SQL query
     * @param {array} params - Query parameters
     */
    async query(ownerId, connectionId, query, params = []) {
        const connection = await this.getConnection(ownerId, connectionId);
        const key = `${ownerId}:${connectionId}`;
        const config = this.poolConfigs.get(key);

        try {
            let result;

            if (config.type === 'postgresql') {
                result = await connection.query(query, params);
                return result.rows;
            } else if (config.type === 'mysql') {
                const [rows] = await connection.execute(query, params);
                return rows;
            } else if (config.type === 'sqlite') {
                return new Promise((resolve, reject) => {
                    connection.all(query, params, (err, rows) => {
                        if (err) reject(err);
                        else resolve(rows);
                    });
                });
            }
        } catch (error) {
            console.error(`Query execution failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get all connections for an owner (partner)
     */
    getOwnerConnections(ownerId) {
        const connections = [];
        for (const [key, schema] of this.dbSchemas.entries()) {
            if (schema.ownerId === ownerId) {
                connections.push(schema);
            }
        }
        return connections;
    }

    /**
     * Close specific connection
     */
    async closeConnection(ownerId, connectionId) {
        const key = `${ownerId}:${connectionId}`;
        const connection = this.connections.get(key);

        if (connection) {
            const config = this.poolConfigs.get(key);
            if (config.type === 'postgresql' || config.type === 'mysql') {
                await connection.end();
            } else if (config.type === 'sqlite') {
                await new Promise((resolve, reject) => {
                    connection.close((err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            }

            this.connections.delete(key);
            console.log(`Closed connection: ${key}`);
        }
    }

    /**
     * Close all connections
     */
    async closeAllConnections() {
        for (const [key] of this.connections.entries()) {
            const [ownerId, connectionId] = key.split(':');
            await this.closeConnection(ownerId, connectionId);
        }
    }
}

// Export singleton instance
module.exports = new ConnectionManager();