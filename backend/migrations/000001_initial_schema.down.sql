-- Rollback initial schema migration
-- This migration drops all tables in reverse order of dependencies

-- Drop tables in reverse order (respecting foreign key constraints)
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS page_views CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS logs CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Note: pgcrypto extension is not dropped as it may be used by other schemas/applications and dropping extensions requires superuser privileges.
