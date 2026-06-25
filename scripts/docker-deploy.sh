#!/bin/bash

# Docker deployment script for Expense Tracker API
# Usage: ./scripts/docker-deploy.sh [dev|prod]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Function to deploy development environment
deploy_dev() {
    print_status "Deploying development environment..."
    
    # Stop existing containers
    docker-compose -f docker-compose.dev.yml down --remove-orphans
    
    # Build and start containers
    docker-compose -f docker-compose.dev.yml up --build -d
    
    print_success "Development environment deployed successfully!"
    print_status "API will be available at: http://localhost:9009"
    print_status "API Documentation: http://localhost:9009/api"
    print_status "Database: localhost:5432"
    print_status "Note: Database migrations will run automatically on startup"
    
    # Show logs
    print_status "Showing logs (Ctrl+C to exit)..."
    docker-compose -f docker-compose.dev.yml logs -f api
}

# Function to deploy production environment
deploy_prod() {
    print_status "Deploying production environment..."
    
    # Stop existing containers
    docker-compose down --remove-orphans
    docker-compose -f docker-compose.prod.yml down --remove-orphans
    
    # Build and start containers
    docker-compose -f docker-compose.prod.yml up --build -d
    
    print_success "Production environment deployed successfully!"
    print_status "API will be available at: http://localhost:9009"
    print_status "API Documentation: http://localhost:9009/api"
    print_status "Health Check: http://localhost:9009/health"
    print_status "Database: localhost:5432"
    print_status "Nginx: http://localhost:80"
    print_status "Note: Database migrations will run automatically on startup"
    
    # Show logs
    print_status "Showing logs (Ctrl+C to exit)..."
    docker-compose -f docker-compose.prod.yml logs -f api
}

# Function to stop all containers
stop_all() {
    print_status "Stopping all containers..."
    docker-compose down --remove-orphans
    docker-compose -f docker-compose.dev.yml down --remove-orphans
    docker-compose -f docker-compose.prod.yml down --remove-orphans
    print_success "All containers stopped"
}

# Function to show status
show_status() {
    print_status "Container status:"
    docker-compose ps
    echo ""
    docker-compose -f docker-compose.dev.yml ps
    echo ""
    docker-compose -f docker-compose.prod.yml ps
}

# Function to clean up
cleanup() {
    print_warning "This will remove all containers, networks, and volumes. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Cleaning up..."
        docker-compose down --volumes --remove-orphans
        docker-compose -f docker-compose.dev.yml down --volumes --remove-orphans
        docker-compose -f docker-compose.prod.yml down --volumes --remove-orphans
        docker system prune -f
        print_success "Cleanup completed"
    else
        print_status "Cleanup cancelled"
    fi
}

# Main script logic
main() {
    check_docker
    
    case "${1:-}" in
        "dev")
            deploy_dev
            ;;
        "prod")
            deploy_prod
            ;;
        "stop")
            stop_all
            ;;
        "status")
            show_status
            ;;
        "cleanup")
            cleanup
            ;;
        *)
            echo "Usage: $0 {dev|prod|stop|status|cleanup}"
            echo ""
            echo "Commands:"
            echo "  dev     - Deploy development environment"
            echo "  prod    - Deploy production environment"
            echo "  stop    - Stop all containers"
            echo "  status  - Show container status"
            echo "  cleanup - Remove all containers, networks, and volumes"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
