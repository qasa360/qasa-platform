# QASA Backend Makefile
# Simplified commands for Docker-based development

.PHONY: help build-stack up down logs clean clean-migrations fix-migrations-permissions migrate-reset migrate-init migrate-status migrate-sync seed

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
	@echo "🔧 Fixing migrations permissions..."
	@sudo chown -R $$(id -u):$$(id -g) prisma/migrations 2>/dev/null || true
	@echo "✅ Migration completed successfully!"

db-seed: ## Run Prisma migrations inside the backend container
	@echo "✅ Migration completed successfully!"
	@echo "🏗️  Running Prisma seed..."
	@docker compose exec qasa-backend npm run prisma:seed

debug: ## Start backend in debug mode (port 9229 exposed for remote debugging)
	@echo "🐛 Starting backend in debug mode..."
	@docker-compose -f docker-compose.yml -f docker-compose.debug.yml up --build qasa-backend
	@echo "✅ Debug mode active on port 9229. Attach your IDE debugger."

clean-migrations: ## Remove all Prisma migrations and fix permissions
	@echo "🗑️  Removing all migrations..."
	@sudo rm -rf prisma/migrations
	@mkdir -p prisma/migrations
	@sudo chown -R $$(id -u):$$(id -g) prisma/migrations
	@echo "✅ Migrations cleaned and permissions fixed!"

fix-migrations-permissions: ## Fix ownership of migrations folder to current user
	@echo "🔧 Fixing migrations permissions..."
	@sudo chown -R $$(id -u):$$(id -g) prisma/migrations 2>/dev/null || true
	@echo "✅ Permissions fixed!"

migrate-reset: ## Reset database and all migrations (WARNING: deletes all data)
	@echo "⚠️  WARNING: This will delete all data in the database!"
	@echo "📦 Checking if backend container is running..."
	@if [ "$$(docker ps -q -f name=qasa-backend)" = "" ]; then \
		echo "⚠️  Backend container not running. Starting it first..."; \
		docker compose up -d qasa-backend; \
		sleep 5; \
	fi
	@echo "🔄 Resetting database and migrations..."
	@docker compose exec -T qasa-backend npx prisma migrate reset --force --skip-seed
	@echo "🔧 Fixing migrations permissions..."
	@sudo chown -R $$(id -u):$$(id -g) prisma/migrations 2>/dev/null || true
	@echo "✅ Database reset completed!"

migrate-init: clean-migrations migrate-reset ## Clean migrations, reset DB, and create initial migration
	@echo "📦 Checking if backend container is running..."
	@if [ "$$(docker ps -q -f name=qasa-backend)" = "" ]; then \
		echo "⚠️  Backend container not running. Starting it first..."; \
		docker compose up -d qasa-backend; \
		sleep 5; \
	fi
	@echo "🏗️  Creating initial migration..."
	@docker compose exec -T qasa-backend npx prisma migrate dev --name init
	@echo "🔧 Fixing migrations permissions..."
	@sudo chown -R $$(id -u):$$(id -g) prisma/migrations 2>/dev/null || true
	@echo "✅ Initial migration created successfully!"

migrate-status: ## Check migration status without applying changes
	@echo "📦 Checking if backend container is running..."
	@if [ "$$(docker ps -q -f name=qasa-backend)" = "" ]; then \
		echo "⚠️  Backend container not running. Starting it first..."; \
		docker compose up -d qasa-backend; \
		sleep 5; \
	fi
	@echo "📊 Checking migration status..."
	@docker compose exec -T qasa-backend npx prisma migrate status

create-default-template: ## Create default audit template
	@echo "📦 Checking if backend container is running..."
	@if [ "$$(docker ps -q -f name=qasa-backend)" = "" ]; then \
		echo "⚠️  Backend container not running. Starting it first..."; \
		docker compose up -d qasa-backend; \
		sleep 5; \
	fi
	@echo "📝 Creating default audit template..."
	@docker compose exec qasa-backend npx ts-node scripts/create-default-template.ts
	@echo "✅ Default template created"

migrate-sync: ## Sync migrations when DB and local files are out of sync (PRODUCTION-SAFE)
	@echo "⚠️  This will sync migrations without resetting the database"
	@echo "📦 Checking if backend container is running..."
	@if [ "$$(docker ps -q -f name=qasa-backend)" = "" ]; then \
		echo "⚠️  Backend container not running. Starting it first..."; \
		docker compose up -d qasa-backend; \
		sleep 5; \
	fi
	@echo "🔍 Checking what differences exist..."
	@docker compose exec -T qasa-backend npx prisma migrate diff \
		--from-schema-datasource prisma/schema.prisma \
		--to-schema-datamodel prisma/schema.prisma \
		--script > /tmp/migration_diff.sql || true
	@if [ -s /tmp/migration_diff.sql ]; then \
		echo "📝 Differences found. Creating sync migration..."; \
		docker compose exec -T qasa-backend npx prisma migrate dev --name sync_missing_changes; \
	else \
		echo "✅ No differences found. Database is in sync."; \
	fi
	@echo "🔧 Fixing migrations permissions..."
	@sudo chown -R $$(id -u):$$(id -g) prisma/migrations 2>/dev/null || true
	@echo "✅ Sync completed!"
