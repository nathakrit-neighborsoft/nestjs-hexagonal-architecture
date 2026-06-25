# Makefile for Expense Tracker API Docker Deployment

.PHONY: help dev prod stop status logs clean build test lint

# Default target
help:
	@echo "Available commands:"
	@echo "  dev     - Start development environment"
	@echo "  prod    - Start production environment"
	@echo "  stop    - Stop all containers"
	@echo "  status  - Show container status"
	@echo "  logs    - Show application logs"
	@echo "  clean   - Remove all containers, networks, and volumes"
	@echo "  build   - Build Docker images"
	@echo "  test    - Run tests"
	@echo "  lint    - Run linting"

# Development environment
dev:
	@echo "Starting development environment..."
	@echo "Note: Database migrations will run automatically on startup"
	./scripts/docker-deploy.sh dev

# Production environment
prod:
	@echo "Starting production environment..."
	./scripts/docker-deploy.sh prod

# Stop all containers
stop:
	@echo "Stopping all containers..."
	./scripts/docker-deploy.sh stop

# Show container status
status:
	@echo "Container status:"
	./scripts/docker-deploy.sh status

# Show logs
logs:
	@echo "Showing application logs..."
	docker-compose logs -f api

# Clean up everything
clean:
	@echo "Cleaning up..."
	./scripts/docker-deploy.sh cleanup

# Build Docker images
build:
	@echo "Building Docker images..."
	docker-compose build
	docker-compose -f docker-compose.dev.yml build
	docker-compose -f docker-compose.prod.yml build

# Run tests
test:
	@echo "Running tests..."
	pnpm run test

# Run linting
lint:
	@echo "Running linting..."
	pnpm run lint

# Database migrations
migrate:
	@echo "Running database migrations..."
	docker-compose exec api pnpm run migration:run

# Generate migration
migration:
	@echo "Generating migration..."
	docker-compose exec api pnpm run migration:generate

# Revert migration
migrate-revert:
	@echo "Reverting migration..."
	docker-compose exec api pnpm run migration:revert

# Show database status
db-status:
	@echo "Database migration status:"
	docker-compose exec api pnpm run db:status

# Reset database
db-reset:
	@echo "Resetting database..."
	docker-compose exec api pnpm run db:reset

# Development shortcuts
dev-logs:
	@echo "Showing development logs..."
	docker-compose -f docker-compose.dev.yml logs -f api

dev-shell:
	@echo "Opening development shell..."
	docker-compose -f docker-compose.dev.yml exec api sh

# Production shortcuts
prod-logs:
	@echo "Showing production logs..."
	docker-compose -f docker-compose.prod.yml logs -f api

prod-shell:
	@echo "Opening production shell..."
	docker-compose -f docker-compose.prod.yml exec api sh

# Health checks
health:
	@echo "Checking application health..."
	curl -f http://localhost:9009/health || echo "Health check failed"

health-dev:
	@echo "Checking development application health..."
	curl -f http://localhost:9009/health || echo "Health check failed"

# Quick start for new developers
setup:
	@echo "Setting up development environment..."
	@echo "1. Copying environment file..."
	cp env.example .env
	@echo "2. Starting development environment..."
	./scripts/docker-deploy.sh dev
	@echo "Setup complete! API available at http://localhost:9009"
	@echo "Note: Migrations will run automatically in production mode"
