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

.PHONY: all build run seed docker-up docker-down docker-restart logs

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
	docker-compose -f $(COMPOSE_FILE) up -d

## Stop the Docker stack
down:
	docker-compose -f $(COMPOSE_FILE) down

## Restart Docker services
restart: down up

## Tail logs from all Docker services
logs:
	docker-compose -f $(COMPOSE_FILE) logs -f --tail=100

## Rebuild everything
rebuild: clean build

## Clean up build artifacts
clean:
	rm -f bin/$(APP_NAME)

reset-db:
	@bash scripts/reset_db.sh
