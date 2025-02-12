#!/bin/bash

# File: /scripts/verify-dev-env.sh
# Description: Script to verify development environment setup
# Project: Household Chore Gamification System
# Last Modified: 2025-02-10

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Counter for failed checks
FAILED_CHECKS=0

echo "🔍 Starting development environment verification..."

# Function to check if a command exists
check_command() {
	if command -v $1 &>/dev/null; then
		echo -e "${GREEN}✓${NC} $2"
	else
		echo -e "${RED}✗${NC} $2"
		FAILED_CHECKS=$((FAILED_CHECKS + 1))
	fi
}

# Check required tools
echo -e "\n📦 Checking required tools..."
check_command "docker" "Docker is installed"
check_command "docker-compose" "Docker Compose is installed"
check_command "node" "Node.js is installed"
check_command "npm" "npm is installed"
check_command "git" "Git is installed"

# Check Node.js version
NODE_VERSION=$(node -v | sed 's/v//' | cut -d'.' -f1)
REQUIRED_VERSION="20"
if [ "$NODE_VERSION" -ge "$REQUIRED_VERSION" ]; then
	echo -e "${GREEN}✓${NC} Node.js version $(node -v) (meets requirement)"
else
	echo -e "${RED}✗${NC} Node.js version $(node -v) (requires v$REQUIRED_VERSION+)"
	FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi

# Check Docker containers
echo -e "\n🐳 Checking Docker containers..."
check_container() {
	if docker ps --format '{{.Names}}' | grep -q "^chore-gamification_${1}_1$"; then
		echo -e "${GREEN}✓${NC} Container 'chore-gamification_${1}_1' is running"
	else
		echo -e "${RED}✗${NC} Container 'chore-gamification_${1}_1' is not running"
		echo -e "  💡 Try: docker-compose up -d"
		FAILED_CHECKS=$((FAILED_CHECKS + 1))
	fi
}

check_container "app"
check_container "db"

# Check if required ports are available
echo -e "\n🔌 Checking port availability..."
check_port() {
	local port=$1
	local service=$2
	if nc -z localhost $port >/dev/null 2>&1; then
		local container_name="chore-gamification_${service}_1"
		if docker ps --format '{{.Names}} {{.Ports}}' | grep -q "^${container_name}.*:${port}->"; then
			echo -e "${GREEN}✓${NC} Port $port is correctly bound to $container_name"
		else
			echo -e "${RED}✗${NC} Port $port is in use but not by expected container"
			echo -e "  💡 Check: lsof -i :$port"
			FAILED_CHECKS=$((FAILED_CHECKS + 1))
		fi
	else
		echo -e "${GREEN}✓${NC} Port $port is available"
	fi
}

check_port 3000 "app" # Next.js
check_port 5432 "db"  # PostgreSQL

# Check project dependencies
echo -e "\n📚 Checking project dependencies..."
if [ -f "package.json" ]; then
	if npm list typescript next react @types/react prettier eslint >/dev/null 2>&1; then
		echo -e "${GREEN}✓${NC} Core dependencies are installed"
	else
		echo -e "${RED}✗${NC} Some core dependencies are missing"
		FAILED_CHECKS=$((FAILED_CHECKS + 1))
	fi
else
	echo -e "${RED}✗${NC} package.json not found"
	FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi

# Check database connection
echo -e "\n🗄️  Checking database connection..."
if docker-compose exec -T db pg_isready -h db >/dev/null 2>&1; then
	echo -e "${GREEN}✓${NC} Database is accepting connections"
else
	echo -e "${RED}✗${NC} Database is not accepting connections"
	FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi

# Check environment files
echo -e "\n📄 Checking environment files..."
if [ -f ".env.development" ]; then
	echo -e "${GREEN}✓${NC} Development environment file exists"
else
	echo -e "${RED}✗${NC} Development environment file missing"
	FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi

# Final summary
echo -e "\n📋 Verification Summary"
if [ $FAILED_CHECKS -eq 0 ]; then
	echo -e "${GREEN}✓ All checks passed! Development environment is ready.${NC}"
else
	echo -e "${RED}✗ Found $FAILED_CHECKS issue(s) that need to be addressed.${NC}"
	exit 1
fi
