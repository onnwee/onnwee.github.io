#!/bin/bash
set -e

echo "🔄 Resetting database using migrations..."

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "ERROR: DATABASE_URL is not set. Please set it in your .env file."
    exit 1
fi

echo "⬇️  Rolling back all migrations..."
migrate -path migrations -database "$DATABASE_URL" down -all 2>&1 | grep -v "Are you sure" || true

echo "⬆️  Applying all migrations..."
migrate -path migrations -database "$DATABASE_URL" up

echo "✅ Database reset complete using migrations!"
