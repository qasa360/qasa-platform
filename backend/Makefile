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
	@echo "🚀 Building and starting QASA Backend..."
	@docker-compose up --build qasa-backend

# Essential commands
up: ## Start the development environment
	@echo "🚀 Starting QASA Backend..."
	@docker-compose up qasa-backend

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
