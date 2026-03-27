#!/bin/bash
set -e

echo "🚀 Rentrooo Deployment Script"
echo "=============================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo "Creating from .env.prod.example..."
    cp .env.prod.example .env
    echo -e "${RED}❌ Please edit .env file with your configuration before deploying${NC}"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"
echo ""

# Pull latest changes
echo "📦 Pulling latest code..."
git pull origin main

# Build and deploy
echo "🔨 Building and deploying services..."
docker-compose -f docker-compose.prod.yml down --remove-orphans 2>/dev/null || true
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Services deployed:"
echo "  - Gateway: http://localhost:8080"
echo "  - MongoDB: localhost:27017"
echo "  - Redis: localhost:6379"
echo ""
echo "Check status:"
echo "  docker-compose -f docker-compose.prod.yml ps"
echo ""
echo "View logs:"
echo "  docker-compose -f docker-compose.prod.yml logs -f"