# PC Leasing Dashboard - API Documentation

Complete REST API documentation for the PC Leasing Dashboard backend.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Currently not required. Future versions will include JWT authentication.

## Response Format

All responses are JSON with the following structure:

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "timestamp": "2026-02-14T12:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (development only)"
}
```

## Status Codes

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Endpoints

### 1. Health Check

Check if the API is running.

```
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-14T12:00:00.000Z"
}
```

**Status Code:** 200

---

### 2. Get All Partners

List all available partners in the system.

```
GET /partners
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "PARTNER_001",
      "name": "Partner A",
      "projectsCount": 2,
      "status": "active"
    },
    {
      "id": "PARTNER_002",
      "name": "Partner B",
      "projectsCount": 2,
      "status": "active"
    }
  ]
}
```

**Status Code:** 200

**Example Request:**
```bash
curl http://localhost:5000/api/partners
```

---

### 3. Get Dashboard Data

Main endpoint for retrieving dashboard data with flexible filtering.

```
GET /dashboard
```

**Query Parameters:**

| Parameter | Type | Required | Values | Description |
|-----------|------|----------|--------|-------------|
| `partnerId` | string | Yes | e.g., "PARTNER_001" | Partner ID to fetch data for |
| `filterType` | string | No | "all", "project", "client" | Filter level (default: "all") |
| `projectId` | string | Conditional | e.g., "FGV" | Required if filterType="project" |
| `clientId` | string | Conditional | e.g., "KWSP" | Required if filterType="client" |

**Response (filterType="all"):**
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
        "description": "FGV Leasing Project",
        "clients": [
          {
            "type": "client",
            "id": "KWSP",
            "name": "Kumpulan Wang Simpanan Pekerja",
            "status": "active",
            "statistics": {
              "totalPCs": 250,
              "activeLeases": 212,
              "expiredLeases": 38,
              "maintenanceTickets": 5,
              "lastUpdated": "2026-02-14T12:00:00.000Z"
            }
          },
          {
            "type": "client",
            "id": "JPJ",
            "name": "Jabatan Pengangkutan Jalan",
            "status": "active",
            "statistics": {
              "totalPCs": 180,
              "activeLeases": 153,
              "expiredLeases": 27,
              "maintenanceTickets": 3,
              "lastUpdated": "2026-02-14T12:00:00.000Z"
            }
          }
        ],
        "statistics": {
          "totalClients": 3,
          "totalPCs": 850,
          "activeLeases": 722,
          "expiredLeases": 128,
          "maintenanceTickets": 12,
          "dataQuality": {
            "hardwareSoftwareDB": "connected",
            "helpdeskDB": "connected",
            "crmDB": "connected"
          }
        }
      }
    ]
  },
  "timestamp": "2026-02-14T12:00:00.000Z"
}
```

**Status Code:** 200

**Example Requests:**

All projects and clients:
```bash
curl "http://localhost:5000/api/dashboard?partnerId=PARTNER_001&filterType=all"
```

Specific project:
```bash
curl "http://localhost:5000/api/dashboard?partnerId=PARTNER_001&filterType=project&projectId=FGV"
```

Specific client:
```bash
curl "http://localhost:5000/api/dashboard?partnerId=PARTNER_001&filterType=client&clientId=KWSP"
```

**Error Response (404 - Partner not found):**
```json
{
  "success": false,
  "message": "Partner not found",
  "error": "Partner ID: INVALID_ID"
}
```

**Error Response (400 - Missing required parameter):**
```json
{
  "success": false,
  "message": "projectId is required for project filter"
}
```

---

### 4. List Projects

Get all projects for a specific partner.

```
GET /dashboard/partners/:partnerId/projects
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `partnerId` | string | Yes | Partner ID |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "FGV",
      "name": "FGV Project",
      "description": "FGV Leasing Project",
      "clientsCount": 3,
      "status": "active"
    },
    {
      "id": "RISDA",
      "name": "RISDA Project",
      "description": "RISDA Leasing Project",
      "clientsCount": 2,
      "status": "active"
    }
  ]
}
```

**Status Code:** 200

**Example Request:**
```bash
curl http://localhost:5000/api/dashboard/partners/PARTNER_001/projects
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Partner not found"
}
```

---

### 5. List Clients

Get all clients for a specific project.

```
GET /dashboard/partners/:partnerId/projects/:projectId/clients
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `partnerId` | string | Yes | Partner ID |
| `projectId` | string | Yes | Project ID |

**Response:**
```json
{
  "success": true,
  "partner": "PARTNER_001",
  "project": "FGV",
  "data": [
    {
      "id": "KWSP",
      "name": "Kumpulan Wang Simpanan Pekerja",
      "status": "active"
    },
    {
      "id": "JPJ",
      "name": "Jabatan Pengangkutan Jalan",
      "status": "active"
    },
    {
      "id": "PERKESO",
      "name": "Pertubuhan Keselamatan Sosial",
      "status": "active"
    }
  ]
}
```

**Status Code:** 200

**Example Request:**
```bash
curl http://localhost:5000/api/dashboard/partners/PARTNER_001/projects/FGV/clients
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Project not found or does not belong to partner"
}
```

---

### 6. Get Database Connections

Get all database connections configured for a partner.

```
GET /dashboard/partners/:partnerId/connections
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `partnerId` | string | Yes | Partner ID |

**Response:**
```json
{
  "success": true,
  "partner": {
    "id": "PARTNER_001",
    "name": "Partner A"
  },
  "connections": [
    {
      "id": "db_hardware_software",
      "name": "Hardware & Software Database",
      "type": "postgresql",
      "server": "partner-a-db.example.com",
      "database": "leasing_hw_sw",
      "status": "active"
    },
    {
      "id": "db_helpdesk",
      "name": "Helpdesk Database",
      "type": "mysql",
      "server": "partner-a-helpdesk.example.com",
      "database": "helpdesk",
      "status": "active"
    },
    {
      "id": "db_crm",
      "name": "CRM Database",
      "type": "postgresql",
      "server": "partner-a-crm.example.com",
      "database": "crm_data",
      "status": "active"
    }
  ]
}
```

**Status Code:** 200

**Example Request:**
```bash
curl http://localhost:5000/api/dashboard/partners/PARTNER_001/connections
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Partner not found"
}
```

---

## Data Models

### Partner Object
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "projects": ["string"],
  "dbConnections": [
    {
      "id": "string",
      "type": "postgresql|mysql|sqlite",
      "name": "string",
      "host": "string",
      "port": "number",
      "database": "string",
      "username": "string",
      "password": "string"
    }
  ]
}
```

### Project Object
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "partnerId": "string",
  "clients": ["string"],
  "dbConnections": ["string"]
}
```

### Client Object
```json
{
  "id": "string",
  "name": "string",
  "projectId": "string",
  "status": "active|inactive"
}
```

### Statistics Object
```json
{
  "totalPCs": "number",
  "activeLeases": "number",
  "expiredLeases": "number",
  "maintenanceTickets": "number",
  "lastUpdated": "ISO8601 timestamp"
}
```

### Connection Object
```json
{
  "id": "string",
  "name": "string",
  "type": "postgresql|mysql|sqlite",
  "server": "string",
  "database": "string",
  "status": "connected|disconnected"
}
```

---

## Common Use Cases

### 1. Fetch All Data for Partner Dashboard
```bash
curl "http://localhost:5000/api/dashboard?partnerId=PARTNER_001&filterType=all"
```

### 2. Fetch Specific Project Data
```bash
curl "http://localhost:5000/api/dashboard?partnerId=PARTNER_001&filterType=project&projectId=FGV"
```

### 3. Fetch Specific Client Data
```bash
curl "http://localhost:5000/api/dashboard?partnerId=PARTNER_001&filterType=client&clientId=KWSP"
```

### 4. List All Projects
```bash
curl "http://localhost:5000/api/dashboard/partners/PARTNER_001/projects"
```

### 5. List All Clients in Project
```bash
curl "http://localhost:5000/api/dashboard/partners/PARTNER_001/projects/FGV/clients"
```

### 6. Check Database Connections
```bash
curl "http://localhost:5000/api/dashboard/partners/PARTNER_001/connections"
```

---

## Error Handling

The API provides clear error messages and appropriate HTTP status codes:

### Common Errors

**Invalid Partner ID**
- Status: 404
- Message: "Partner not found"

**Invalid Project ID**
- Status: 404
- Message: "Project not found or does not belong to partner"

**Missing Required Parameter**
- Status: 400
- Message: "projectId is required for project filter"

**Invalid Filter Type**
- Status: 400
- Message: "Invalid filterType. Use: all, project, or client"

**Server Error**
- Status: 500
- Message: "Failed to retrieve dashboard data"
- Error: Detailed error information

---

## Rate Limiting

Currently no rate limiting. Consider adding in production:
- 100 requests per minute per IP
- 10 requests per second per authenticated user

---

## CORS

CORS is enabled for frontend URL specified in environment:
```
Allowed Origin: http://localhost:3000
```

---

## Pagination

Not currently implemented. Consider adding for large datasets:
- `?page=1&limit=20`
- Response includes `total` and `hasMore` fields

---

## Response Examples (cURL)

### All Projects and Clients
```bash
curl -X GET \
  "http://localhost:5000/api/dashboard?partnerId=PARTNER_001&filterType=all" \
  -H "Content-Type: application/json"
```

### Specific Project
```bash
curl -X GET \
  "http://localhost:5000/api/dashboard?partnerId=PARTNER_001&filterType=project&projectId=FGV" \
  -H "Content-Type: application/json"
```

### With jq Filter (Pretty Print)
```bash
curl -s "http://localhost:5000/api/dashboard?partnerId=PARTNER_001&filterType=all" | jq '.data.data[0].name'
```

---

## Versions

**Current Version:** 1.0.0  
**Last Updated:** February 2026

## Future Enhancements

- [ ] Authentication with JWT
- [ ] Pagination support
- [ ] Advanced filtering and search
- [ ] Caching headers
- [ ] GraphQL endpoint
- [ ] WebSocket support for real-time updates
- [ ] Rate limiting
- [ ] API versioning (v2, v3, etc.)
- [ ] Data export endpoints (CSV, PDF)
- [ ] Audit logging endpoints

---

## Support & Feedback

For API issues or requests:
1. Check this documentation
2. Review backend README
3. Check error responses and logs
