-- ⚠️ DEPRECATED: This file is kept for reference only.
-- The project now uses versioned migrations in the migrations/ directory.
-- See README.md for migration documentation.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY NOT NULL,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY NOT NULL,
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
  id SERIAL PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  repo_url TEXT,
  live_url TEXT,
  -- Frontend-aligned fields
  summary TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  footer TEXT,
  href TEXT,
  external BOOLEAN NOT NULL DEFAULT false,
  color TEXT,
  emoji TEXT,
  content TEXT,
  image TEXT,
  embed TEXT,
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