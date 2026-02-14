# Setup Guide - PC Leasing Dashboard

Step-by-step setup and deployment instructions.

## Prerequisites

- **Node.js**: v14 or higher (Download from https://nodejs.org)
- **npm**: Comes with Node.js
- **Git**: (Optional, for cloning)
- **Database**: PostgreSQL, MySQL, or SQLite
- **Code Editor**: VS Code recommended

## Installation Steps

### Step 1: Clone or Download Project

If using Git:
```bash
git clone <repository-url>
cd "AI 2"
```

Or extract the ZIP file to your desired location.

### Step 2: Backend Setup

#### 2.1 Navigate to Backend Directory
```bash
cd backend
```

#### 2.2 Install Dependencies
```bash
npm install
```

This will install all required Node.js packages:
- express
- postgresql (pg)
- mysql2
- sqlite3
- cors
- dotenv
- and others

#### 2.3 Configure Environment Variables

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` with your actual database credentials:

**For PostgreSQL:**
```env
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

DB_USER_PARTNER_A=postgres
DB_PASS_PARTNER_A=your_postgres_password
DB_USER_HELPDESK=helpdesk_user
DB_PASS_HELPDESK=helpdesk_password
DB_USER_CRM=crm_user
DB_PASS_CRM=crm_password
```

**For MySQL:**
```env
DB_USER_PARTNER_B=root
DB_PASS_PARTNER_B=mysql_password
```

#### 2.4 (Optional) Configure Partners/Projects/Clients

Edit `src/config/dbConfig.js` to add your partner configurations and database connections.

#### 2.5 Start Backend Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The backend will start on: `http://localhost:5000`

You should see:
```
✓ Server running on http://localhost:5000
✓ API Documentation:
  - GET  /api/partners
  - GET  /api/dashboard?partnerId=PARTNER_001&filterType=all
  ...
```

### Step 3: Frontend Setup

#### 3.1 Open New Terminal/Command Prompt

Leave the backend running in the first terminal.

#### 3.2 Navigate to Frontend Directory
```bash
cd frontend
```

#### 3.3 Install Dependencies
```bash
npm install
```

#### 3.4 Configure Environment Variables

Create `.env` file:
```bash
cp .env.example .env
```

Verify `.env` contains:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

If your backend is on a different host/port, update `REACT_APP_API_URL`.

#### 3.5 Start Frontend Development Server
```bash
npm start
```

This will:
1. Compile the React application
2. Start development server on `http://localhost:3000`
3. Automatically open browser

## Verification Checklist

- [ ] Backend server running on `http://localhost:5000`
- [ ] Frontend application open on `http://localhost:3000`
- [ ] No errors in browser console
- [ ] Able to select partner from dropdown
- [ ] Dashboard data displays
- [ ] Filter options work (All, Project, Client)

## Testing the Setup

### Test 1: Backend API

Open browser or use curl:
```bash
curl http://localhost:5000/api/partners
```

Should return:
```json
{
  "success": true,
  "data": [...]
}
```

### Test 2: Frontend Connection

1. Open http://localhost:3000
2. Select a partner from dropdown
3. Should display projects and clients
4. Change filter options and verify data updates

### Test 3: Database Connections

1. Check Backend Console for connection messages
2. Should show "✓ Connected to PostgreSQL/MySQL/SQLite"
3. If errors, check database credentials in `.env`

## Common Setup Issues

### Issue: "Port 5000 already in use"

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use different port in .env
PORT=5001
```

### Issue: "Module not found"

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Cannot connect to database"

**Solution:**
1. Verify database is running
2. Check host, port, username, password in `.env`
3. Ensure database exists
4. Check firewall settings

### Issue: "Access-Control-Allow-Origin error"

**Solution:**
1. Ensure backend FRONTEND_URL is correct
2. Verify frontend URL matches FRONTEND_URL in `.env`
3. Restart backend server

### Issue: Frontend shows "Failed to load partners"

**Solution:**
1. Check REACT_APP_API_URL in frontend `.env`
2. Verify backend is running
3. Check browser console for errors
4. Check backend logs for errors

## Development Tools

### VS Code Extensions (Recommended)

- ES7+ React/Redux/React-Native snippets
- REST Client
- PostgreSQL
- Thunder Client (API testing)
- Prettier - Code Formatter

### API Testing Tools

**Using curl:**
```bash
curl http://localhost:5000/api/dashboard?partnerId=PARTNER_001
```

**Using REST Client extension in VS Code:**

Create `test.http` file:
```http
GET http://localhost:5000/api/partners HTTP/1.1
Content-Type: application/json

###

GET http://localhost:5000/api/dashboard?partnerId=PARTNER_001&filterType=all HTTP/1.1
Content-Type: application/json
```

## Useful Commands

### Backend Commands

```bash
# Start development server
npm run dev

# Start production server
npm start

# Run tests
npm test
```

### Frontend Commands

```bash
# Start development server
npm start

# Build for production
npm build

# Run tests
npm test

# Eject configuration (not recommended)
npm eject
```

## Database-Specific Setup

### PostgreSQL Setup

1. Install PostgreSQL (https://www.postgresql.org/download/)
2. Create database:
```sql
CREATE DATABASE leasing_hw_sw;
CREATE DATABASE leasing_crm;
```

3. Create user:
```sql
CREATE USER partner_a_user WITH PASSWORD 'secure_password_123';
GRANT ALL PRIVILEGES ON DATABASE leasing_hw_sw TO partner_a_user;
GRANT ALL PRIVILEGES ON DATABASE leasing_crm TO partner_a_user;
```

### MySQL Setup

1. Install MySQL (https://dev.mysql.com/downloads/mysql/)
2. Create database:
```sql
CREATE DATABASE leasing_hw_sw;
CREATE DATABASE helpdesk;
```

3. Create user:
```sql
CREATE USER 'partner_a_user'@'localhost' IDENTIFIED BY 'secure_password_123';
GRANT ALL PRIVILEGES ON leasing_hw_sw.* TO 'partner_a_user'@'localhost';
GRANT ALL PRIVILEGES ON helpdesk.* TO 'partner_a_user'@'localhost';
FLUSH PRIVILEGES;
```

### SQLite Setup

SQLite databases are file-based, no setup needed. Specify path in `dbConfig.js`:
```javascript
{
  type: 'sqlite',
  path: './data/leasing.db'
}
```

## File Structure After Installation

```
AI 2/
├── backend/
│   ├── src/
│   │   ├── config/dbConfig.js
│   │   ├── database/connectionManager.js
│   │   ├── controllers/dashboardController.js
│   │   ├── routes/dashboardRoutes.js
│   │   └── server.js
│   ├── node_modules/          (Created after npm install)
│   ├── package.json
│   ├── package-lock.json      (Created after npm install)
│   ├── .env                   (Created from .env.example)
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.js
│   │   └── index.js
│   ├── node_modules/          (Created after npm install)
│   ├── package.json
│   ├── package-lock.json      (Created after npm install)
│   ├── .env                   (Created from .env.example)
│   └── .env.example
│
├── README.md
├── API_DOCUMENTATION.md
└── SETUP.md
```

## Next Steps

1. **Add Your Data**: Edit `backend/src/config/dbConfig.js` to add your partners
2. **Connect Real Databases**: Update database credentials in `.env`
3. **Customize Styling**: Edit CSS files in `frontend/src/styles/`
4. **Add Authentication**: Implement login functionality
5. **Deploy**: Deploy to production (Heroku, AWS, DigitalOcean, etc.)

## Troubleshooting Guide

See the troubleshooting sections in:
- [backend/README.md](./backend/README.md#troubleshooting)
- [frontend/README.md](./frontend/README.md#troubleshooting)

## Support Resources

- **Package Documentation**: 
  - Express.js: https://expressjs.com/
  - React: https://react.dev/
  - Node.js: https://nodejs.org/en/docs/

- **Database Documentation**:
  - PostgreSQL: https://www.postgresql.org/docs/
  - MySQL: https://dev.mysql.com/doc/
  - SQLite: https://www.sqlite.org/docs.html

- **API Testing**:
  - Postman: https://www.postman.com/
  - Insomnia: https://insomnia.rest/

## Quick Reference

### Start Both Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

### Environment Files

Always create `.env` from `.env.example`:
```bash
cp .env.example .env
```

Never commit `.env` files to version control.

---

**Status**: ✅ Ready for development and testing  
**Last Updated**: February 2026
