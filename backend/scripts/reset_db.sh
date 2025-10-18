#!/bin/bash
set -e

echo "⚠️  WARNING: This script uses hardcoded SQL and is deprecated."
echo "⚠️  Please use 'make migrate-down' and 'make migrate-up' instead."
echo "⚠️  Or use scripts/reset_db_with_migrations.sh for a quick reset."
echo ""
echo "🔄 Resetting database (legacy method)..."

docker exec -i backend-db-1 psql -U postgres -d onnwee_db <<EOSQL
-- Drop all tables explicitly
DROP TABLE IF EXISTS 
  sessions,
  page_views,
  events,
  logs,
  projects,
  posts,
  users 
  CASCADE;

-- Recreate tables
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  tags TEXT[] NOT NULL,
  is_draft BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  repo_url TEXT,
  live_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS logs (
  id SERIAL PRIMARY KEY,
  level TEXT NOT NULL,
  message TEXT NOT NULL,
  context JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_logs_created_at ON logs (created_at DESC);
CREATE INDEX idx_logs_level ON logs (level);

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  event_name TEXT,
  data JSONB NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  session_id TEXT,
  ip_address TEXT,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS page_views (
  id SERIAL PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  session_id TEXT,
  ip_address TEXT,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);
CREATE INDEX idx_page_views_path ON page_views (path);
CREATE INDEX idx_page_views_viewed_at ON page_views (viewed_at DESC);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ
);
EOSQL

echo "✅ Database reset complete."
