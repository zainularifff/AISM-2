# Quick Start Guide - PC Leasing Dashboard

Get the system running in minutes!

## Option 1: Traditional Setup (Recommended for Development)

### Prerequisites
- Node.js 14+ installed
- A text editor (VS Code recommended)

### Get Running (5 minutes)

**Terminal 1 - Backend:**
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm start
```

**Done!** Open http://localhost:3000

---

## Option 2: Docker Setup (Recommended for Production)

### Prerequisites
- Docker Desktop installed

### Get Running (2 commands)

```bash
# From project root
docker-compose up -d
```

**Done!** Open http://localhost:3000

Check status:
```bash
docker-compose ps
```

---

## 🎯 First Steps After Startup

1. **Open Browser**: http://localhost:3000
2. **Select Partner**: Choose a partner from dropdown
3. **View Dashboard**: Default shows all projects and clients
4. **Try Filters**: 
   - Select "By Project" → Choose FGV
   - Select "By Client" → Choose KWSP

---

## 🔧 Configuration Quick Ref

### Edit Backend Config

Edit `backend/src/config/dbConfig.js` to:
- Add partners
- Add projects
- Add clients

### Set Database Credentials

Edit `backend/.env`:
```env
DB_USER_PARTNER_A=your_username
DB_PASS_PARTNER_A=your_password
```

---

## 📊 API Quick Test

Test backend is working:
```bash
curl http://localhost:5000/api/partners
```

Expected response:
```json
{
  "success": true,
  "data": [...]
}
```

---

## 🛑 Stop Everything

### Traditional
```bash
Ctrl+C in both terminals
```

### Docker
```bash
docker-compose down
```

---

## 📁 Key Files to Know

| File | Purpose | Edit? |
|------|---------|-------|
| `backend/src/config/dbConfig.js` | Partner/Project/Client config | ✓ Add your data |
| `backend/.env` | Database credentials | ✓ Add your passwords |
| `frontend/.env` | API URL config | ✓ If API on different host |
| `backend/src/controllers/dashboardController.js` | Business logic | ✓ Custom queries |
| `frontend/src/components/Dashboard.js` | Main UI | ✓ Custom styling |

---

## 🔗 Dashboard URLs

```
Frontend:    http://localhost:3000
API:         http://localhost:5000/api
Health:      http://localhost:5000/health
Docs:        See README.md and API_DOCUMENTATION.md
```

---

## 💡 Common Tasks

### Add New Partner
1. Edit `backend/src/config/dbConfig.js`
2. Add to `partners` array
3. Restart backend: `npm run dev`

### Change Port
Edit `backend/.env`:
```env
PORT=5001
```

### Query Real Data
Edit `backend/src/controllers/dashboardController.js` statistics methods

### Custom Styling
Edit `frontend/src/styles/Dashboard.css`

---

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| "Port 5000 in use" | Change in `.env` or kill process: `lsof -i :5000` |
| "Cannot connect to API" | Check REACT_APP_API_URL in frontend `.env` |
| "Database error" | Verify credentials in backend `.env` |
| "Module not found" | Run `npm install` in that directory |
| "Blank dashboard" | Check browser console for errors |

---

## 📚 Full Documentation

- **Setup**: See [SETUP.md](./SETUP.md)
- **Backend**: See [backend/README.md](./backend/README.md)
- **Frontend**: See [frontend/README.md](./frontend/README.md)
- **API**: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Docker**: See [DOCKER.md](./DOCKER.md)

---

## 🚀 Next Level

### Add Authentication
- Add login page to frontend
- Create JWT middleware in backend
- Implement role-based access

### Add Real Data Integration
- Connect to actual databases
- Update database queries in controllers
- Implement data caching

### Deploy to Production
- Deploy backend to AWS/Heroku/Azure
- Deploy frontend to Vercel/Netlify
- Set up monitoring and logging

### Add Features
- Export data to CSV/PDF
- Real-time updates with WebSockets
- Advanced analytics and charts
- Mobile app with React Native

---

## 📞 Key Commands

**Development:**
```bash
npm run dev          # Backend watch mode
npm start            # Frontend dev server
```

**Production:**
```bash
npm start            # Backend server
npm build && npm start  # Frontend production
```

**Docker:**
```bash
docker-compose up -d      # Start all services
docker-compose down       # Stop all services
docker-compose logs -f    # View logs
```

---

**3... 2... 1... Go!** 🚀

You now have a fully functional PC Leasing Dashboard ready to customize!

---

**For detailed help, see the full README.md file.**
