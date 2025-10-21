# QASA Backend Makefile
# Simplified commands for Docker-based development

.PHONY: help build-stack up down logs clean

# Default target
help: ## Show this help message
	@echo "QASA Backend - Available Commands:"
	@echo "=================================="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

# Main command
build-stack: ## Build and start the development stack
	@echo "🧹 Cleaning up existing containers..."
	@docker-compose down --remove-orphans 2>/dev/null || true
	@echo "🚀 Building and starting QASA Backend..."
	@docker-compose up --build

# Essential commands
up: ## Start the development environment
	@echo "🚀 Starting QASA Backend..."
	@docker-compose up

down: ## Stop and remove all containers
	@echo "🛑 Stopping all containers..."
	@docker-compose down

logs: ## Show logs from backend
	@echo "📋 Showing backend logs..."
	@docker-compose logs -f qasa-backend

clean: ## Clean up containers, images, and volumes
	@echo "🧹 Cleaning up Docker resources..."
	@docker-compose down --volumes --remove-orphans
	@docker system prune -f
	@echo "✅ Cleanup completed"

migrate: ## Run Prisma migrations inside the backend container
	@echo "📦 Checking if backend container is running..."
	@if [ "$$(docker ps -q -f name=qasa-backend)" = "" ]; then \
		echo "⚠️  Backend container not running. Starting it first..."; \
		docker compose up -d qasa-backend; \
		sleep 5; \
	fi
	@echo "🏗️  Running Prisma migrations..."
	@docker compose exec qasa-backend npx prisma migrate dev --name "auto_migration"
	@echo "✅ Migration completed successfully!"

debug: ## Start backend in debug mode (port 9229 exposed for remote debugging)
	@echo "🐛 Starting backend in debug mode..."
	@docker-compose -f docker-compose.yml -f docker-compose.debug.yml up --build qasa-backend
	@echo "✅ Debug mode active on port 9229. Attach your IDE debugger."
