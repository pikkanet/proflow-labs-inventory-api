.PHONY: prepare docker-up docker-down prisma-generate prisma-reset help install start

# Default target
help:
	@echo "Available targets:"
	@echo "  make prepare        - Run all setup steps (docker, generate, reset)"
	@echo "  make docker-up      - Start Docker containers"
	@echo "  make docker-down    - Stop Docker containers"
	@echo "  make prisma-generate - Generate Prisma client"
	@echo "  make prisma-reset   - Reset database and run migrations"
	@echo "  make install        - Install npm dependencies"
	@echo "  make start          - Start the application (development)"

# Main prepare target - runs all setup steps
prepare: docker-up install prisma-generate prisma-reset 
	@echo "✅ Setup complete! Ready to run the application."

# Start Docker containers
docker-up:
	@echo "🐳 Starting Docker containers..."
	docker-compose up -d
	@echo "⏳ Waiting for database to be ready..."
	@sleep 5

# Stop Docker containers
docker-down:
	@echo "🛑 Stopping Docker containers..."
	docker-compose down

# Generate Prisma client
prisma-generate:
	@echo "🔧 Generating Prisma client..."
	npx prisma generate

# Reset database and run migrations (skip confirmation with --force)
prisma-reset:
	@echo "🔄 Resetting database and running migrations..."
	npx prisma migrate reset --force
	@echo "✅ Database reset complete!"

# Install npm dependencies
install:
	@echo "📦 Installing dependencies..."
	npm install

# Start application in development mode
start:
	@echo "🚀 Starting application (development)..."
	npm run start:dev

