# PC Leasing Dashboard - Backend

PC Leasing Dashboard Backend with multi-server database support for managing PC leasing across multiple partners, projects, and clients.

## Features

- **Multi-Server Support**: Connect to multiple partner servers simultaneously
- **Multi-Database Support**: PostgreSQL, MySQL, and SQLite database support
- **Dynamic Database Connection Manager**: Register and manage connections per partner
- **Hierarchical Data Model**: Partners → Projects → Clients
- **Flexible Filtering**: View data at different levels (all, project-specific, client-specific)
- **Database Connection Mapping**: Define which database belongs to which partner/owner
- **RESTful API**: Complete API for dashboard data retrieval

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── dbConfig.js           # Partner/Project/Client configuration
│   ├── database/
│   │   └── connectionManager.js  # Multi-database connection handler
│   ├── controllers/
│   │   └── dashboardController.js # Dashboard business logic
│   ├── routes/
│   │   └── dashboardRoutes.js    # API routes
│   ├── middleware/
│   └── server.js                 # Main application entry point
├── package.json
└── .env.example
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL, MySQL, or SQLite (depending on your database setup)

## Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your database credentials:
```env
PORT=5000
FRONTEND_URL=http://localhost:3000
DB_USER_PARTNER_A=your_user
DB_PASS_PARTNER_A=your_password
```

## Configuration

Edit `src/config/dbConfig.js` to add your partners, projects, and clients:

```javascript
{
  partners: [
    {
      id: 'PARTNER_001',
      name: 'Partner A',
      projects: ['FGV', 'RISDA'],
      dbConnections: [
        {
          id: 'db_hardware_software',
          type: 'postgresql',
          host: 'db.example.com',
          port: 5432,
          database: 'leasing_hw_sw',
          username: 'user',
          password: 'password'
        }
        // ... more connections
      ]
    }
    // ... more partners
  ],
  projects: {
    FGV: {
      id: 'FGV',
      partnerId: 'PARTNER_001',
      clients: ['KWSP', 'JPJ', 'PERKESO']
    }
    // ... more projects
  },
  clients: {
    KWSP: {
      id: 'KWSP',
      projectId: 'FGV'
    }
    // ... more clients
  }
}
```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Get All Partners
```
GET /api/partners
```
Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "PARTNER_001",
      "name": "Partner A",
      "projectsCount": 2,
      "status": "active"
    }
  ]
}
```

### Get Dashboard Data (Main Endpoint)
```
GET /api/dashboard?partnerId=PARTNER_001&filterType=all
```

Query Parameters:
- `partnerId` (required): Partner ID
- `filterType` (optional): 'all', 'project', or 'client' (default: 'all')
- `projectId` (required if filterType='project'): Project ID
- `clientId` (required if filterType='client'): Client ID

Response:
```json
{
  "success": true,
  "data": {
    "partner": {
      "id": "PARTNER_001",
      "name": "Partner A"
    },
    "filterType": "all",
    "data": [
      {
        "type": "project",
        "id": "FGV",
        "name": "FGV Project",
        "clients": [
          {
            "type": "client",
            "id": "KWSP",
            "name": "KWSP",
            "statistics": {
              "totalPCs": 250,
              "activeLeases": 212,
              "expiredLeases": 38
            }
          }
        ],
        "statistics": {
          "totalClients": 3,
          "totalPCs": 850,
          "activeLeases": 722,
          "expiredLeases": 128
        }
      }
    ]
  }
}
```

### List Projects for Partner
```
GET /api/dashboard/partners/:partnerId/projects
```

### List Clients for Project
```
GET /api/dashboard/partners/:partnerId/projects/:projectId/clients
```

### Get Database Connections
```
GET /api/dashboard/partners/:partnerId/connections
```

### Health Check
```
GET /health
```

## Database Connection Manager

The `connectionManager` handles all database connections:

```javascript
const connectionManager = require('./src/database/connectionManager');

// Register connection
connectionManager.registerConnection('PARTNER_001', 'db_hw_sw', config);

// Get connection
const pool = await connectionManager.getConnection('PARTNER_001', 'db_hw_sw');

// Execute query
const results = await connectionManager.query(
  'PARTNER_001',
  'db_hw_sw',
  'SELECT * FROM devices WHERE status = ?',
  ['active']
);

// Close connection
await connectionManager.closeConnection('PARTNER_001', 'db_hw_sw');

// Close all connections
await connectionManager.closeAllConnections();
```

## Error Handling

The API returns appropriate HTTP status codes:
- `200`: Success
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error

All errors include a `success: false` flag and error message:
```json
{
  "success": false,
  "message": "Partner not found",
  "error": "Partner ID: INVALID_ID"
}
```

## Database Support

### PostgreSQL
```javascript
{
  type: 'postgresql',
  host: 'localhost',
  port: 5432,
  database: 'leasing_db',
  username: 'user',
  password: 'password'
}
```

### MySQL
```javascript
{
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  database: 'leasing_db',
  username: 'user',
  password: 'password'
}
```

### SQLite
```javascript
{
  type: 'sqlite',
  path: './data/leasing.db'
}
```

## Extending the System

### Adding a New Partner

1. Update `src/config/dbConfig.js`:
```javascript
{
  id: 'PARTNER_003',
  name: 'Partner C',
  projects: ['PROJECT_Z'],
  dbConnections: [
    {
      id: 'db_main',
      type: 'postgresql',
      // ... connection details
    }
  ]
}
```

2. Register connections in `src/server.js` (automatic via config)

### Adding New Database Queries

Update the query functions in `dashboardController.js` to fetch actual data from your databases using `connectionManager.query()`.

## Troubleshooting

### Database Connection Failed
- Ensure database credentials in `.env` are correct
- Check firewall/network connectivity to database server
- Verify database server is running

### CORS Errors
- Update `FRONTEND_URL` in `.env` to match your frontend URL
- Ensure frontend is on the same port configured in CORS settings

### Port Already in Use
```bash
# Find and kill process using port 5000
lsof -i :5000
kill -9 <PID>
```

## Performance Considerations

- Connection pooling is enabled by default for PostgreSQL and MySQL
- Consider implementing caching for frequently accessed data
- Large datasets should be paginated
- Add indexes on frequently queried columns

## Security Considerations

- Keep database credentials in `.env` file (not in version control)
- Use strong, unique passwords for database connections
- Implement authentication middleware for API endpoints
- Validate all input data
- Consider adding rate limiting

## Future Enhancements

- [ ] Authentication and authorization
- [ ] API pagination
- [ ] Caching layer (Redis)
- [ ] Real-time updates with WebSockets
- [ ] Data export functionality (CSV, PDF)
- [ ] Advanced analytics and reporting
- [ ] Audit logging
- [ ] Multi-language support

## License

MIT
