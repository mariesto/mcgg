## Why

The application needs to be deployed to a production VPS to make it publicly accessible via a custom domain. Currently the project only runs locally for development. Deploying will allow real users to access the Magic Chess Go Go ranking system.

## What Changes

- Production build configuration for Vue/Vite frontend
- Process management setup for Express backend server
- Nginx reverse proxy configuration to route traffic to frontend and backend
- SSL/HTTPS setup using Let's Encrypt for secure connections
- DNS configuration to point domain to VPS IP
- Environment variables management for production

## Capabilities

### New Capabilities
- `nginx-config`: Nginx configuration as reverse proxy for frontend (static) and backend (API)
- `ssl-cert`: SSL certificate setup using Certbot/Let's Encrypt for HTTPS
- `process-manager`: PM2 process manager configuration for keeping Node.js server running
- `deployment-scripts`: Build and deployment scripts for production

### Modified Capabilities

(None - this is new infrastructure)

## Impact

- New nginx site configuration file
- PM2 ecosystem config or systemd service
- Production .env file on server
- Build scripts may need adjustment for production paths
- DNS A/AAAA records pointing to VPS
