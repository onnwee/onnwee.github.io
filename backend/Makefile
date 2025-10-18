# Makefile for API + Docker infrastructure

# Go build settings
APP_NAME := onnwee-api
SEED_FILE := cmd/seed/seed.go
MAIN_FILE := cmd/server/main.go

# Docker settings
COMPOSE_FILE := docker-compose.yml

# Environment
ENV_FILE := .env

# Load env vars if .env exists
ifneq ("$(wildcard $(ENV_FILE))","")
	include $(ENV_FILE)
	export
endif

.PHONY: all build run seed docker-up docker-down docker-restart logs migrate-up migrate-down migrate-down-1 migrate-create migrate-force migrate-reset reset-db

all: build

## Build the Go API binary
build:
	go build -o bin/$(APP_NAME) $(MAIN_FILE)

## Run the API with live reload using nodemon
run:
	nodemon --exec 'go run $(MAIN_FILE)'

## Seed the database with fake data
seed:
	go run $(SEED_FILE)

## Bring up the full Docker stack (db, prometheus, grafana)
up:
	docker compose -f $(COMPOSE_FILE) up -d

## Stop the Docker stack
down:
	docker compose -f $(COMPOSE_FILE) down

## Restart Docker services
restart: down up

## Tail logs from all Docker services
logs:
	docker compose -f $(COMPOSE_FILE) logs -f --tail=100

## Rebuild everything
rebuild: clean build

## Clean up build artifacts
clean:
	rm -f bin/$(APP_NAME)

## Reset database using migrations (recommended)
migrate-reset:
	@bash scripts/reset_db_with_migrations.sh

## Reset database using legacy script (deprecated)
reset-db:
	@bash scripts/reset_db.sh

## Run database migrations up
migrate-up:
	@if [ -z "$(DATABASE_URL)" ]; then \
		echo "ERROR: DATABASE_URL is not set. Please set it in your .env file or environment."; \
		exit 1; \
	fi
	migrate -path migrations -database "$(DATABASE_URL)" up

## Rollback database migrations (all - requires confirmation)
migrate-down:
	@if [ -z "$(DATABASE_URL)" ]; then \
		echo "ERROR: DATABASE_URL is not set. Please set it in your .env file or environment."; \
		exit 1; \
	fi
	migrate -path migrations -database "$(DATABASE_URL)" down

## Rollback last migration (single step)
migrate-down-1:
	@if [ -z "$(DATABASE_URL)" ]; then \
		echo "ERROR: DATABASE_URL is not set. Please set it in your .env file or environment."; \
		exit 1; \
	fi
	migrate -path migrations -database "$(DATABASE_URL)" down 1

## Create a new migration file
## Usage: make migrate-create NAME=add_users_table
migrate-create:
	@if [ -z "$(NAME)" ]; then \
		echo "ERROR: NAME is required. Usage: make migrate-create NAME=add_users_table"; \
		exit 1; \
	fi
	migrate create -ext sql -dir migrations -seq $(NAME)

## Force set migration version (use with caution)
## Usage: make migrate-force VERSION=1
migrate-force:
	@if [ -z "$(VERSION)" ]; then \
		echo "ERROR: VERSION is required. Usage: make migrate-force VERSION=1"; \
		exit 1; \
	fi
	@if [ -z "$(DATABASE_URL)" ]; then \
		echo "ERROR: DATABASE_URL is not set. Please set it in your .env file or environment."; \
		exit 1; \
	fi
	migrate -path migrations -database "$(DATABASE_URL)" force $(VERSION)
