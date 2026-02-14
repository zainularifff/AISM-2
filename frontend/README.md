# PC Leasing Dashboard - Frontend

React-based frontend for PC Leasing Dashboard with dynamic filtering by project and client level.

## Features

- **Partner Selection**: Choose from multiple partners
- **Dynamic Filtering**: 
  - View all projects and clients combined
  - Filter by specific project
  - Filter by specific client
- **Real-time Statistics**: Display PC counts, active leases, expired leases, maintenance tickets
- **Database Connection Status**: View active database connections for each partner
- **Responsive Design**: Modern, responsive UI with gradient styling
- **Interactive Components**: Click-based navigation between projects and clients

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Dashboard.js         # Main dashboard component
│   │   ├── FilterPanel.js       # Sidebar filter controls
│   │   └── DataDisplay.js       # Main content area
│   ├── services/
│   │   └── dashboardService.js  # API communication
│   ├── styles/
│   │   ├── Dashboard.css
│   │   ├── FilterPanel.css
│   │   └── DataDisplay.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── .env.example
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on http://localhost:5000

## Installation

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Ensure backend API URL is correct in `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode
```bash
npm start
```

Opens http://localhost:3000 in your browser with hot reload enabled.

### Build for Production
```bash
npm build
```

Creates optimized production build in `build/` directory.

## Components Overview

### Dashboard Component
Main container component that:
- Loads all partners on mount
- Manages filter state
- Loads projects and clients based on selected partner
- Fetches dashboard data based on current filter
- Passes data to Filter Panel and Data Display components

### FilterPanel Component
Sidebar component that provides:
- Partner selection dropdown
- View level radio buttons (All, Project, Client)
- Project selection (when filter is project/client)
- Client selection (when filter is client)
- Database connection status display
- Current filter summary

### DataDisplay Component
Main content area that:
- Displays partner information
- Shows appropriate view based on filter type:
  - **All View**: Shows all projects with clients nested inside
  - **Project View**: Shows single project with all clients
  - **Client View**: Shows single client with detailed information
- Displays statistics cards with PC counts and lease information
- Database status indicator in project view
- Click handlers for navigating between projects/clients

## API Integration

The dashboard communicates with backend via `dashboardService`:

```javascript
// Get all partners
const partners = await dashboardService.getAllPartners();

// Get dashboard data with filtering
const data = await dashboardService.getDashboardData(
  partnerId,
  filterType,  // 'all', 'project', or 'client'
  projectId,
  clientId
);

// Get projects for partner
const projects = await dashboardService.getProjects(partnerId);

// Get clients for project
const clients = await dashboardService.getClients(partnerId, projectId);

// Get database connections
const connections = await dashboardService.getConnections(partnerId);
```

## Styling

The dashboard uses a modern color scheme:
- Primary Color: `#667eea` (Purple/Blue)
- Secondary Color: `#764ba2` (Dark Purple)
- Success: `#4caf50` (Green)
- Error: `#f44336` (Red)
- Borders: `#e0e0e0`
- Text: `#333` (Dark Gray)

### Responsive Design

The layout uses CSS Grid and Flexbox:
- **Desktop**: Sidebar (300px) + Main content (flexible)
- **Tablet**: Adjusts spacing and card sizes
- **Mobile**: Stack layout (implementation needed)

## User Workflows

### 1. Default View (All Projects and Clients)
1. Application loads
2. Automatically selects first partner
3. Sets filter to "All Projects & Clients"
4. Displays all projects with their clients in a grid layout

### 2. View by Project
1. User selects "By Project" filter option
2. Project dropdown becomes available
3. User selects specific project
4. Dashboard shows only that project and its clients
5. User can click on client card to switch to client view

### 3. View by Client
1. User selects "By Client" filter option
2. User selects project first
3. Client dropdown becomes available
4. User selects specific client
5. Dashboard displays detailed client information

### 4. Switch Partner
1. User changes partner from dropdown
2. All filters reset to defaults
3. Filter type resets to "All"
4. New partner's data loads

## State Management

The dashboard manages state with React hooks:

```javascript
const [partners, setPartners] = useState([]);
const [selectedPartner, setSelectedPartner] = useState(null);
const [filterType, setFilterType] = useState('all');
const [selectedProject, setSelectedProject] = useState(null);
const [selectedClient, setSelectedClient] = useState(null);
const [dashboardData, setDashboardData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

State flows: Auto-loads projects when partner changes, auto-loads clients when project changes.

## Error Handling

The application handles errors gracefully:
- API errors display in red banner
- Loading states show spinner
- Network failures are caught and displayed
- Invalid selections are prevented at UI level

## Performance Optimizations

- Lazy loading of project/client data
- Images optimized via React build
- CSS classes reused across components
- State updates batched via React

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Environment Variables

### Development
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

### Production
```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_ENV=production
```

## Troubleshooting

### API Connection Failed
- Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` in `.env`
- Check browser console for CORS errors
- Verify backend CORS is configured correctly

### Components Not Loading
- Clear browser cache: Ctrl+Shift+Delete
- Restart development server: `npm start`
- Check console for JavaScript errors

### Styling Issues
- Ensure all CSS files are imported
- Check CSS file paths are correct
- Verify CSS modules are loaded

### Data Not Displaying
- Check API response in Network tab
- Verify partner ID exists in backend config
- Check that projects and clients are configured for partner

## Extending the System

### Adding a New Component

1. Create component file in `src/components/`
2. Import necessary hooks and styles
3. Export as default
4. Import in Dashboard.js

### Adding New API Endpoint

1. Create new method in `dashboardService.js`
2. Import and use in component
3. Handle loading and error states

### Customizing Styling

1. Edit CSS files in `src/styles/`
2. Update color variables
3. Adjust responsive breakpoints as needed

## Future Enhancements

- [ ] Mobile responsive design
- [ ] Dark mode toggle
- [ ] Export data to CSV/PDF
- [ ] Advanced filtering and search
- [ ] Dashboard customization
- [ ] User preferences storage
- [ ] WebSocket real-time updates
- [ ] Chart visualizations
- [ ] Notifications system
- [ ] Multi-language support

## Performance Metrics

Target performance:
- First Paint: < 2s
- Interaction to Paint: < 100ms
- Dashboard Load: < 3s

## License

MIT
