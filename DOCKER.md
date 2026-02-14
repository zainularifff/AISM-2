# Docker Deployment Guide

Complete guide for deploying the PC Leasing Dashboard using Docker and Docker Compose.

## Prerequisites

- Docker (https://www.docker.com/products/docker-desktop)
- Docker Compose (included with Docker Desktop)
- 4GB RAM minimum for all containers

## Quick Start (One Command)

Navigate to project root and run:

```bash
docker-compose up -d
```

This will:
1. Create and start PostgreSQL databases
2. Create and start MySQL database
3. Build and start backend API
4. Build and start frontend application

Access the application:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

## Detailed Setup

### Step 1: Install Docker

#### Windows/Mac
Download Docker Desktop: https://www.docker.com/products/docker-desktop

#### Linux
```bash
sudo apt-get update
sudo apt-get install docker.io docker-compose
sudo usermod -aG docker $USER
```

### Step 2: Navigate to Project Directory

```bash
cd "complete/path/to/AI 2"
```

### Step 3: Build Images

```bash
docker-compose build
```

This builds:
- Backend image
- Frontend image
- Downloads PostgreSQL and MySQL images

### Step 4: Start Services

```bash
docker-compose up -d
```

The `-d` flag runs services in background.

### Step 5: Monitor Services

Check status:
```bash
docker-compose ps
```

Should show:
```
NAME                COMMAND                  STATUS
postgres_partner_a  "docker-entrypoint.s…"   Up 2 minutes (healthy)
postgres_crm        "docker-entrypoint.s…"   Up 2 minutes (healthy)
mysql_helpdesk      "docker-entrypoint.s…"   Up 2 minutes (healthy)
leasing_backend     "node src/server.js"     Up 1 minute (healthy)
leasing_frontend    "serve -s build -l 30…"  Up 1 minute (healthy)
```

### Step 6: View Logs

Backend logs:
```bash
docker-compose logs -f backend
```

Frontend logs:
```bash
docker-compose logs -f frontend
```

All logs:
```bash
docker-compose logs -f
```

## Services and Ports

| Service | Container Name | Port | Type |
|---------|----------------|------|------|
| Frontend | leasing_frontend | 3000 | React |
| Backend | leasing_backend | 5000 | Node.js |
| PostgreSQL (Partner A) | postgres_partner_a | 5432 | PostgreSQL |
| PostgreSQL (CRM) | postgres_crm | 5433 | PostgreSQL |
| MySQL (Helpdesk) | mysql_helpdesk | 3306 | MySQL |

## Accessing Services

### Frontend
```
http://localhost:3000
```

### Backend API
```
http://localhost:5000/api
```

### PostgreSQL (Partner A)
```
Host: localhost
Port: 5432
User: partner_a_user
Password: Partner@123
Database: leasing_hw_sw
```

### PostgreSQL (CRM)
```
Host: localhost
Port: 5433
User: crm_user
Password: CRM@123
Database: crm_data
```

### MySQL (Helpdesk)
```
Host: localhost
Port: 3306
User: helpdesk_user
Password: Helpdesk@123
Database: helpdesk
```

## Container Management

### Stop All Services
```bash
docker-compose down
```

### Stop Specific Service
```bash
docker-compose stop backend
```

### Start Specific Service
```bash
docker-compose start backend
```

### Restart Services
```bash
docker-compose restart backend
```

### Remove Containers and Volumes
```bash
docker-compose down -v
```

This removes:
- All containers
- All volumes (database data will be lost)

## Viewing Container Details

### List Running Containers
```bash
docker ps
```

### Full Container Output
```bash
docker ps -a
```

### Container Statistics
```bash
docker stats
```

### Container Logs
```bash
docker logs leasing_backend
docker logs leasing_frontend
```

## Database Access

### Connect to PostgreSQL (Partner A)

Using Docker:
```bash
docker exec -it postgres_partner_a psql -U partner_a_user -d leasing_hw_sw
```

Or use external client:
- **DBeaver**: Connection to localhost:5432
- **pgAdmin**: Connection to localhost:5432
- **psql**: `psql -h localhost -U partner_a_user -d leasing_hw_sw`

### Connect to MySQL (Helpdesk)

Using Docker:
```bash
docker exec -it mysql_helpdesk mysql -u helpdesk_user -p helpdesk
# Enter password: Helpdesk@123
```

Or use external client:
- **MySQL Workbench**: Connection to localhost:3306
- **heidiSQL**: Connection to localhost:3306
- **mysql**: `mysql -h localhost -u helpdesk_user -p helpdesk`

## Troubleshooting

### Port Already in Use

```
Error: Bind for 0.0.0.0:5000 failed: port is already allocated
```

Find process using port:
```bash
lsof -i :5000
```

Kill process or use different port:

Edit `docker-compose.yml`:
```yaml
backend:
  ports:
    - "5001:5000"  # Use 5001 instead of 5000
```

### Container Failed to Start

Check logs:
```bash
docker-compose logs backend
docker-compose logs frontend
```

Common issues:
- Insufficient RAM
- Volume permission issues
- Network issues

### Database Connection Failed

Ensure all database containers are healthy:
```bash
docker-compose ps
```

Check status column - should show "healthy"

Wait for health checks:
```bash
# Wait 30 seconds for databases to be ready
sleep 30
docker-compose up backend frontend
```

### Volume Issues

Remove and recreate volumes:
```bash
docker-compose down -v
docker-compose up -d
```

### Memory Problems

If containers keep crashing, increase Docker memory:

**Docker Desktop** → Preferences → Resources → Memory (increase to 8GB+)

## Rebuilding

### Rebuild Specific Service

```bash
docker-compose up -d --build backend
```

### Rebuild All Services

```bash
docker-compose up -d --build
```

### Clean Build (Remove Old Images)

```bash
docker-compose down
docker system prune -a
docker-compose up -d --build
```

## Production Deployment

### Environment Variables

Edit `docker-compose.yml` to set production variables:

```yaml
backend:
  environment:
    NODE_ENV: production
    FRONTEND_URL: https://yourdomain.com
```

### Using Environment File

Create `.env` file:

```env
COMPOSE_PROJECT_NAME=pc-leasing-prod
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

Run with env file:
```bash
docker-compose --env-file .env up -d
```

### Deploy to Cloud

#### AWS ECS
```bash
# Push images to ECR and update docker-compose
ecs-cli compose -f docker-compose.yml up
```

#### DigitalOcean App Platform
Connect GitHub repo and deploy.

#### Azure Container Instances
```bash
az container create --resource-group myGroup \
  --name leasing-app \
  --image leasing-backend:latest \
  --ports 5000
```

## Backup and Restore

### Backup PostgreSQL

```bash
docker exec postgres_partner_a pg_dump -U partner_a_user leasing_hw_sw > backup_partner_a.sql
```

### Restore PostgreSQL

```bash
docker exec -i postgres_partner_a psql -U partner_a_user -d leasing_hw_sw < backup_partner_a.sql
```

### Backup MySQL

```bash
docker exec mysql_helpdesk mysqldump -u helpdesk_user -p helpdesk > backup_helpdesk.sql
```

### Restore MySQL

```bash
docker exec -i mysql_helpdesk mysql -u helpdesk_user -p helpdesk < backup_helpdesk.sql
```

## Scaling

### Run Multiple Backend Instances

```yaml
backend:
  deploy:
    replicas: 3
```

Use with load balancer (nginx):
```yaml
nginx:
  image: nginx:alpine
  ports:
    - "5000:80"
  depends_on:
    - backend
```

## Monitoring

### Prometheus & Grafana

Add to docker-compose.yml:

```yaml
prometheus:
  image: prom/prometheus
  ports:
    - "9090:9090"
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml

grafana:
  image: grafana/grafana
  ports:
    - "3001:3000"
  depends_on:
    - prometheus
```

### Docker Events

```bash
docker events --filter type=container
```

### Health Monitoring

```bash
watch 'docker-compose ps'
```

## Advanced Configuration

### Custom Network

```yaml
networks:
  backend:
    driver: bridge
  frontend:
    driver: bridge
```

### Volume Management

#### Named Volumes
```yaml
volumes:
  postgres_data:
    driver: local
```

#### Bind Mounts
```yaml
volumes:
  - ./data:/app/data
```

## Cleanup

### Remove Unused Images

```bash
docker image prune
```

### Remove Unused Volumes

```bash
docker volume prune
```

### Full Cleanup

```bash
docker system prune -a --volumes
```

## Docker Compose Commands Reference

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# List services
docker-compose ps

# Stop services
docker-compose stop

# Start services
docker-compose start

# Restart services
docker-compose restart

# Remove services
docker-compose down

# Remove services and volumes
docker-compose down -v

# Services status
docker-compose ps -a

# Execute command in container
docker-compose exec backend npm run dev

# View resource usage
docker stats
```

## Performance Tips

1. **Use alpine base images** (already done in Dockerfiles)
2. **Cache docker layers** properly
3. **Use multi-stage builds** (already done)
4. **Limit container resources**:
   ```yaml
   resources:
     limits:
       cpus: '0.5'
       memory: 512M
   ```
5. **Use health checks** (already configured)

## Security Considerations

- [ ] Change default database passwords
- [ ] Use Docker secrets for sensitive data
- [ ] Enable Docker Content Trust
- [ ] Regular security updates
- [ ] Use private Docker registries
- [ ] Network isolation

## Useful Resources

- Docker Documentation: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/
- Docker Best Practices: https://docs.docker.com/develop/dev-best-practices/

## Support

For Docker-specific issues:
1. Check `docker logs` output
2. Verify port conflicts
3. Check resource constraints
4. Review docker-compose.yml syntax

---

**Version**: 1.0.0  
**Last Updated**: February 2026
