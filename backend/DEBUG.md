# Debug Mode Configuration

## Overview
Simple debug mode configuration for the QASA backend using Docker and VS Code.

## Key Features
- Docker-based development environment with debug support
- VS Code debugging integration
- Hot reload with source code mounting

## Usage

### 1. Start Development Environment
```bash
# Start the development environment with debug support
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### 2. VS Code Debugging
1. Open VS Code in the backend directory
2. Go to Run and Debug (Ctrl+Shift+D)
3. Select "Debug Docker Backend" configuration
4. Set breakpoints in your code
5. Start debugging (F5)

### 3. Debug Port
- Application port: `${PORT:-3000}` (configurable via env var)
- Debug port: `${DEBUG_PORT:-9229}` (configurable via env var)
- Access application: `http://localhost:${PORT:-3000}`

### 4. Environment Variables
Configure ports via environment variables:
```bash
# Set custom ports
export PORT=3001
export DEBUG_PORT=9230

# Or create .env file
echo "PORT=3001" >> .env
echo "DEBUG_PORT=9230" >> .env
```

## File Structure
```
backend/
├── Dockerfile.dev              # Development Dockerfile
├── docker-compose.yml          # Docker Compose configuration
├── .vscode/
│   └── launch.json            # VS Code debug configuration
└── DEBUG.md                   # This file
```

## Troubleshooting

### Debug Port Not Accessible
1. Ensure port 9229 is not blocked by firewall
2. Check if another process is using port 9229
3. Verify Docker container is running: `docker ps`

### VS Code Can't Connect
1. Ensure the container is running with debug mode
2. Check the `remoteRoot` path in launch.json matches container path (`/app`)
3. Verify the debug port mapping in docker-compose.yml

### Hot Reload Not Working
1. Check volume mounts in docker-compose.yml
2. Ensure source code is properly mounted
3. Verify file permissions

## Example
```bash
# Start development environment
docker-compose up --build

# In another terminal, check if debug port is accessible
telnet localhost 9229

# Check container logs
docker-compose logs qasa-backend
```
