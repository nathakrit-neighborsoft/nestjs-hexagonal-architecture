# Docker Deployment Guide

This guide explains how to deploy the Expense Tracker API using Docker and Docker Compose.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (usually included with Docker Desktop)
- Git (to clone the repository)

## Quick Start

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd expense_tracker_api
```

### 2. Set Up Environment Variables
```bash
# Copy the example environment file
cp env.example .env

# Edit the .env file with your configuration
nano .env
```

### 3. Deploy Using the Script

#### Development Environment
```bash
./scripts/docker-deploy.sh dev
```

#### Production Environment
```bash
./scripts/docker-deploy.sh prod
```

## Manual Deployment

### Development Environment

1. **Start the development environment:**
```bash
docker-compose -f docker-compose.dev.yml up --build -d
```

2. **View logs:**
```bash
docker-compose -f docker-compose.dev.yml logs -f api
```

3. **Stop the environment:**
```bash
docker-compose -f docker-compose.dev.yml down
```

### Production Environment

1. **Start the production environment:**
```bash
docker-compose up --build -d
```

2. **View logs:**
```bash
docker-compose logs -f api
```

3. **Stop the environment:**
```bash
docker-compose down
```

## Services

The Docker setup includes the following services:

### API Service
- **Port:** 9009
- **Description:** NestJS application
- **Health Check:** Available at `/health` endpoint

### PostgreSQL Database
- **Port:** 5432
- **Database:** expense_tracker (prod) / expense_tracker_dev (dev)
- **Username:** postgres
- **Password:** postgres123



## Environment Variables

### Required Variables
- `NODE_ENV`: Environment (development/production)
- `PORT`: API port (default: 9009)
- `DB_HOST`: Database host
- `DB_PORT`: Database port (default: 5432)
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `DB_DATABASE`: Database name
- `DB_DIALECT`: Database dialect (postgres)
- `JWT_SECRET`: JWT secret key

### Optional Variables
- `DEFAULT_PASSWORD`: Default admin password
- `DEFAULT_TIME_ZONE`: Timezone (default: Asia/Bangkok)
- `LOG_LEVEL`: Logging level

## Useful Commands

### Using the Deployment Script
```bash
# Deploy development environment
./scripts/docker-deploy.sh dev

# Deploy production environment
./scripts/docker-deploy.sh prod

# Stop all containers
./scripts/docker-deploy.sh stop

# Show container status
./scripts/docker-deploy.sh status

# Clean up everything (containers, networks, volumes)
./scripts/docker-deploy.sh cleanup
```

### Manual Docker Commands
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Execute commands in containers
docker-compose exec api pnpm run migration:run
docker-compose exec postgres psql -U postgres -d expense_tracker

# Remove everything including volumes
docker-compose down -v
```

## Database Migrations

### Automatic Migrations
In production mode, database migrations run automatically when the API container starts. The system will:
1. Wait for the database to be ready (with proper connection testing)
2. Run all pending migrations
3. Start the application

**Development Mode**: In development, migrations are not run automatically to avoid conflicts during development. Run `make migrate` manually when needed.

### Manual Migration Commands
```bash
# Connect to the API container and run migrations manually
docker-compose exec api pnpm run migration:run
```

### Generate New Migration
```bash
# Connect to the API container and generate migration
docker-compose exec api pnpm run migration:generate -- src/databases/migrations/MigrationName
```

### Revert Migration
```bash
# Connect to the API container and revert migration
docker-compose exec api pnpm run migration:revert
```

## Health Checks

The application includes health checks for all services:

- **API:** Checks if the application responds on port 9009
- **PostgreSQL:** Uses `pg_isready` to check database connectivity

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :9009
   
   # Stop the service using the port or change the port in docker-compose.yml
   ```

2. **Database Connection Issues**
   ```bash
   # Check if PostgreSQL is running
   docker-compose ps postgres
   
   # Check PostgreSQL logs
   docker-compose logs postgres
   ```

3. **Permission Issues**
   ```bash
   # Make the deployment script executable
   chmod +x scripts/docker-deploy.sh
   ```

4. **Build Issues**
   ```bash
   # Clean up Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

### Logs and Debugging

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs api
docker-compose logs postgres

# Follow logs in real-time
docker-compose logs -f api

# View logs with timestamps
docker-compose logs -t api
```

## Production Considerations

### Security
- Change default passwords in production
- Use strong JWT secrets
- Enable HTTPS in production
- Restrict database access
- Use environment-specific configurations

### Performance
- Use production-grade PostgreSQL configuration
- Enable connection pooling
- Configure proper logging levels
- Set up monitoring and alerting

### Backup
- Set up regular database backups
- Use Docker volumes for data persistence
- Consider using external storage for backups

## Monitoring

### Container Health
```bash
# Check container health
docker-compose ps

# View resource usage
docker stats
```

### Application Health
- API Health Check: `http://localhost:9009/health`
- Swagger Documentation: `http://localhost:9009/api`

## Scaling

To scale the application horizontally:

```bash
# Scale the API service
docker-compose up -d --scale api=3

# Scale with specific configuration
docker-compose -f docker-compose.prod.yml up -d --scale api=3
```

## Cleanup

To completely remove all Docker resources:

```bash
# Stop and remove containers, networks, and volumes
./scripts/docker-deploy.sh cleanup

# Or manually
docker-compose down -v --remove-orphans
docker system prune -a --volumes
```

## Support

For issues related to:
- **Docker setup:** Check this guide and Docker documentation
- **Application issues:** Check the application logs and documentation
- **Database issues:** Check PostgreSQL logs and configuration
