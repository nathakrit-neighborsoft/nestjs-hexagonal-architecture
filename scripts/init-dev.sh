#!/bin/sh

# Development initialization script for Docker containers
# This script runs when the API container starts in development mode

set -e

echo "🚀 Starting API initialization (Development mode)..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
node scripts/wait-for-db.js

# Run database migrations in development mode
echo "🔄 Running database migrations..."
pnpm run migration:run
echo "✅ Migrations completed successfully!"

# Start the development server
echo "🚀 Starting NestJS development server..."
exec pnpm run start:dev
