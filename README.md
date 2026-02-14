# PC Leasing Dashboard - Complete System

A comprehensive, multi-server PC leasing management dashboard system designed to handle multiple partners, projects, and clients with independent database connections per partner.

## 🚀 System Overview

This dashboard system allows partners to view and manage their PC leasing data across multiple projects and clients. Each partner has their own server infrastructure with separate databases for hardware/software, helpdesk, and CRM data.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend                           │
│        (Dashboard with dynamic filtering)                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ HTTP/REST API
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                  Node.js/Express Backend                    │
│              (Multi-Database Connection Manager)            │
└──────────────┬─────────────────────┬──────────────────────┬─┘
               │                     │                      │
        Partner A Server      Partner B Server        Additional...
        ├─ PostgreSQL (HW/SW) ├─ MySQL (HW/SW)
        ├─ MySQL (Helpdesk)   └─ SQLite (other)
        └─ PostgreSQL (CRM)
```

## 📋 System Structure

### Hierarchical Data Model

```
Partner
├── Project 1 (e.g., FGV)
│   ├── Client 1 (e.g., KWSP)
│   ├── Client 2 (e.g., JPJ)
│   └── Client 3 (e.g., PERKESO)
└── Project 2 (e.g., RISDA)
    ├── Client 1 (e.g., RISDA_CLIENT_1)
    └── Client 2 (e.g., RISDA_CLIENT_2)
```

### Database Connections Per Partner

Each partner has independent servers with:
- **Hardware & Software Database**: Device inventory, specifications
- **Helpdesk Database**: Support tickets, issues, resolutions
- **CRM Database**: Customer relationships, contacts, interactions

## 📁 Project Structure

```
AI 2/
├── backend/                          # Node.js/Express Server
│   ├── src/
│   │   ├── config/
│   │   │   └── dbConfig.js          # Partner/Project/Client hierarchy
│   │   ├── database/
│   │   │   └── connectionManager.js # Multi-database connection handler
│   │   ├── controllers/
│   │   │   └── dashboardController.js
│   │   ├── routes/
│   │   │   └── dashboardRoutes.js
│   │   ├── middleware/
│   │   └── server.js                # Entry point
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── frontend/                         # React Application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js         # Main component
│   │   │   ├── FilterPanel.js       # Sidebar filters
│   │   │   └── DataDisplay.js       # Main content
│   │   ├── services/
│   │   │   └── dashboardService.js  # API client
│   │   ├── styles/
│   │   │   ├── Dashboard.css
│   │   │   ├── FilterPanel.css
│   │   │   └── DataDisplay.css
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── SETUP.md                         # This file
└── API_DOCUMENTATION.md             # API reference
```

## 🛠️ Quick Start

### Prerequisites

- Node.js 14+ and npm
- PostgreSQL, MySQL, or SQLite
- Git (optional)

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your database credentials
nano .env

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
# In another terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start the development server
npm start
```

The frontend will open at `http://localhost:3000`

## 🎯 Core Features

### 1. Multi-Partner Support
- Multiple partners can access the system
- Each partner sees only their own data
- Partners have independent database connections

### 2. Dynamic Filtering
- **View All**: See all projects and clients combined
- **Filter by Project**: View specific project (e.g., "FGV") with all its clients
- **Filter by Client**: Focus on single client data

### 3. Multi-Database Connection Manager
- Supports PostgreSQL, MySQL, SQLite
- Connection pooling for efficiency
- Automatic connection health checks
- Per-partner database configuration

### 4. Dashboard Statistics
- Total PCs per project/client
- Active and expired leases count
- Maintenance tickets
- Database connection status

## 📊 API Endpoints

### Partners
```
GET /api/partners
```
List all available partners.

### Dashboard Data (Main)
```
GET /api/dashboard?partnerId=PARTNER_001&filterType=all
```

Query parameters:
- `partnerId` (required): Partner ID
- `filterType` (optional): `all`, `project`, or `client` (default: `all`)
- `projectId` (required if filterType=project)
- `clientId` (required if filterType=client)

### Projects
```
GET /api/dashboard/partners/:partnerId/projects
```

### Clients
```
GET /api/dashboard/partners/:partnerId/projects/:projectId/clients
```

### Database Connections
```
GET /api/dashboard/partners/:partnerId/connections
```

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed endpoint documentation.

## 🔧 Configuration

### Adding a Partner

Edit `backend/src/config/dbConfig.js`:

```javascript
{
  id: 'PARTNER_NEW',
  name: 'New Partner',
  email: 'admin@newpartner.com',
  projects: ['PROJECT_A', 'PROJECT_B'],
  dbConnections: [
    {
      id: 'db_main',
      type: 'postgresql',
      name: 'Main Database',
      host: 'db.newpartner.com',
      port: 5432,
      database: 'leasing',
      username: 'user',
      password: 'password'
    }
  ]
}
```

### Adding a Project

```javascript
PROJECT_NEW: {
  id: 'PROJECT_NEW',
  name: 'New Project',
  partnerId: 'PARTNER_NEW',
  clients: ['CLIENT_A', 'CLIENT_B'],
  description: 'Description of project',
  dbConnections: ['db_main']
}
```

### Adding a Client

```javascript
CLIENT_NEW: {
  id: 'CLIENT_NEW',
  name: 'New Client Name',
  projectId: 'PROJECT_NEW',
  status: 'active'
}
```

## 🔐 Security Considerations

### Done
- Environment variables for sensitive data
- Database connection pooling
- CORS protection

### Recommended
- [ ] Add authentication middleware (JWT)
- [ ] Implement role-based access control (RBAC)
- [ ] Add API rate limiting
- [ ] Encrypt database passwords
- [ ] Add input validation
- [ ] Implement audit logging
- [ ] Use HTTPS in production

## 📈 Performance Tips

1. **Database Indexing**: Add indexes on frequently queried columns
2. **Connection Pooling**: Already enabled (10 connections per pool)
3. **Caching**: Consider implementing Redis for frequently accessed data
4. **Pagination**: Implement pagination for large datasets
5. **Query Optimization**: Use specific queries instead of SELECT *

## 🚀 Deployment

### Backend Deployment (Example: Heroku)

```bash
cd backend
heroku create your-app-name
heroku config:set PORT=5000
git push heroku main
```

### Frontend Deployment (Example: Vercel)

```bash
cd frontend
vercel
```

Set environment variable in Vercel dashboard:
```
REACT_APP_API_URL=https://your-backend-domain.com/api
```

## 📝 Common Tasks

### Connecting Real Databases

Edit `backend/src/config/dbConfig.js` and update connection details with your actual database servers.

### Querying Real Data

Update `backend/src/controllers/dashboardController.js` statistics methods to query from databases:

```javascript
const result = await connectionManager.query(
  partnerId,
  connectionId,
  'SELECT COUNT(*) as total FROM devices WHERE status = ?',
  ['active']
);
```

### Adding Authentication

1. Create authentication middleware
2. Add JWT token generation on login
3. Protect routes with authentication check
4. Add login page to frontend

### Custom Styling

Edit CSS files in:
- `frontend/src/styles/Dashboard.css`
- `frontend/src/styles/FilterPanel.css`
- `frontend/src/styles/DataDisplay.css`

## 🐛 Troubleshooting

### Backend fails to start
```
Error: port 5000 already in use
```
Solution: Kill process on port 5000 or change PORT in .env

### Frontend can't connect to API
```
Error: Failed to fetch API
```
Solutions:
1. Ensure backend is running
2. Check REACT_APP_API_URL in .env
3. Check browser console for CORS errors
4. Verify backend CORS settings

### Database connection error
```
Error: connect ECONNREFUSED
```
Solutions:
1. Verify database is running
2. Check host/port configuration
3. Verify username/password
4. Check network connectivity

## 📚 Documentation

- [Backend README](./backend/README.md) - Detailed backend documentation
- [Frontend README](./frontend/README.md) - Detailed frontend documentation
- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference

## 🤝 Contributing

To extend the system:

1. **Add New Database**: Update connectionManager to support new database types
2. **Add New Endpoints**: Create new route files and controllers
3. **Add New Components**: Create new React components in frontend
4. **Add New Filters**: Extend FilterPanel and Dashboard components

## 📋 Implementation Checklist

- [x] Multi-server architecture
- [x] Multi-partner system
- [x] Hierarchical data model (Partner → Project → Client)
- [x] Database connection manager
- [x] RESTful API
- [x] React frontend with filtering
- [x] Multiple database type support
- [ ] Authentication & Authorization
- [ ] Real data integration
- [ ] Production deployment
- [ ] Performance optimization
- [ ] Advanced analytics
- [ ] WebSocket real-time updates

## 📞 Support

For issues and questions:
1. Check [Troubleshooting](#-troubleshooting) section
2. Review backend/frontend README files
3. Check console for error messages
4. Verify configuration files

## 📄 License

MIT License - Feel free to use this project as a starting point for your PC leasing management system.

## 🎓 Next Steps

1. **Configure Real Databases**: Update dbConfig.js with actual database connections
2. **Integrate Real Data**: Update queries in dashboardController.js
3. **Add Authentication**: Implement user login and role-based access
4. **Deploy**: Deploy to your preferred hosting platform
5. **Monitor**: Set up monitoring and alerting

---

**Created**: February 2026  
**Version**: 1.0.0  
**Status**: Ready for Development
