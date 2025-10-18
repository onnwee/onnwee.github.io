#!/bin/bash
set -e

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
migrate -path /app/migrations -database "$DATABASE_URL" up

echo "✅ Migrations complete!"
