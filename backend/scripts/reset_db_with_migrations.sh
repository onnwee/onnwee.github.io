#!/bin/bash
set -e

echo "🔄 Resetting database using migrations..."

# Load environment variables safely
if [ -f .env ]; then
    set -a
    source .env
    set +a
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "ERROR: DATABASE_URL is not set. Please set it in your .env file."
    exit 1
fi

echo "⬇️  Rolling back all migrations..."
# Use -all flag which doesn't prompt for confirmation
if ! migrate -path migrations -database "$DATABASE_URL" down -all; then
    echo "⚠️  Warning: Migration rollback failed (expected if no migrations have been applied yet)"
fi

echo "⬆️  Applying all migrations..."
if ! migrate -path migrations -database "$DATABASE_URL" up; then
  echo "❌ ERROR: Migration failed!"
  echo "Possible causes:"
  echo "  - Invalid DATABASE_URL format or connection details"
  echo "  - Database is not accessible or down"
  echo "  - Migration files are corrupted or contain SQL errors"
  echo "  - Insufficient database permissions"
  echo "  - Migration version conflict (try 'migrate -path migrations -database \$DATABASE_URL version' to check current version)"
  exit 1
fi

echo "✅ Database reset complete using migrations!"
