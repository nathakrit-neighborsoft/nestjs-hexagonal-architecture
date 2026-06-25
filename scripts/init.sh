#!/bin/sh

# Database initialization script for Docker containers
# This script runs when the API container starts

set -e

echo "🚀 Starting API initialization..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
node scripts/wait-for-db.js

# Run database migrations
echo "🔄 Running database migrations..."
pnpm run migration:run

echo "✅ Migrations completed successfully!"

# Start the application
echo "🚀 Starting NestJS application..."
exec node dist/main
