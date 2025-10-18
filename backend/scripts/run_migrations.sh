#!/bin/bash
set -e

# Migration path (for Docker container)
MIGRATION_PATH="/app/migrations"

# Write .pgpass file for secure authentication
echo "$DB_HOST:5432:$POSTGRES_DB:$POSTGRES_USER:$POSTGRES_PASSWORD" > ~/.pgpass
chmod 600 ~/.pgpass

echo "⏳ Waiting for database to be ready..."
until psql -h "$DB_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q' 2>/dev/null; do
  echo "Postgres is unavailable - sleeping"
  sleep 2
done

echo "✅ Database is ready!"

echo "🚀 Running migrations..."
if ! migrate -path "$MIGRATION_PATH" -database "$DATABASE_URL" up; then
  echo "❌ ERROR: Migration failed!"
  echo "Possible causes:"
  echo "  - Invalid DATABASE_URL format or connection details"
  echo "  - Database is not accessible or down"
  echo "  - Migration files are corrupted or contain SQL errors"
  echo "  - Insufficient database permissions"
  echo "  - Migration version conflict (try 'migrate -path $MIGRATION_PATH -database \$DATABASE_URL version' to check current version)"
  exit 1
fi

echo "✅ Migrations complete!"
