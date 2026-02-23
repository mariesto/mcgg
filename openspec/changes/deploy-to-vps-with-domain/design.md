## Context

**Current State:**
- Vue 3 + Vite frontend (builds to `dist/`)
- Express.js backend server on port 3000
- Supabase for database (external, already configured)
- Development runs via `npm run dev` (concurrently)
- User has fresh VPS with nginx installed
- Domain purchased but not yet configured

**Constraints:**
- Node.js version requirement: `^20.19.0 || >=22.12.0`
- Backend serves API at `/api/*` routes
- Frontend is static files after build
- Environment variables required: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`

## Goals / Non-Goals

**Goals:**
- Deploy application accessible via custom domain with HTTPS
- Nginx serves frontend static files and proxies `/api/*` to Express
- Automatic SSL certificate via Let's Encrypt
- Process manager keeps backend alive and restarts on crash
- Simple deployment workflow (build → deploy)

**Non-Goals:**
- CI/CD pipeline (manual deployment for now)
- Docker containerization
- Multiple environment support (staging/production)
- Auto-scaling or load balancing

## Decisions

### 1. Process Manager: PM2
**Choice:** PM2 over systemd
**Rationale:** PM2 is Node-specific, easier to configure, provides process monitoring and log management out of the box. Systemd is more complex for Node apps.
**Alternatives:** systemd (more ops overhead), Docker (overkill for single app)

### 2. Nginx Configuration Strategy
**Choice:** Single server block, reverse proxy for API
**Rationale:** Simplest setup - nginx serves static frontend files directly, proxies `/api/*` requests to localhost:3000 where Express runs.
**Pattern:**
```
/           → static files from dist/
/api/*      → proxy_pass http://localhost:3000
```

### 3. SSL Strategy
**Choice:** Certbot with nginx plugin
**Rationale:** Let's Encrypt is free, certbot automates certificate renewal. Nginx plugin handles config updates automatically.
**Command:** `certbot --nginx -d yourdomain.com`

### 4. Deployment Method
**Choice:** Manual git pull + build on server
**Rationale:** Simplest for single developer. Build on server ensures production build matches environment.
**Workflow:** SSH → git pull → npm ci → npm run build → pm2 restart

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| SSL certificate expires | Certbot sets up auto-renewal via cron/systemd timer |
| Server runs out of memory | Monitor with `pm2 monit`, set up swap if needed |
| .env file with secrets on server | Restrict file permissions (chmod 600), never commit to git |
| Downtime during deployment | PM2's `--wait-ready` flag for zero-downtime reload |
| Domain DNS propagation delay | Set low TTL before switching, verify with `dig` |

## Migration Plan

### Step 1: Server Setup
1. Install Node.js (v20+ or v22+)
2. Install PM2 globally: `npm install -g pm2`
3. Clone repository to `/var/www/mcgg-rank`

### Step 2: Build & Configure
1. Copy `.env` file with production credentials
2. Run `npm ci && npm run build`
3. Create PM2 ecosystem file

### Step 3: Nginx Configuration
1. Create `/etc/nginx/sites-available/mcgg-rank`
2. Enable site: `ln -s /etc/nginx/sites-available/mcgg-rank /etc/nginx/sites-enabled/`
3. Test and reload: `nginx -t && systemctl reload nginx`

### Step 4: SSL Certificate
1. Run `certbot --nginx -d yourdomain.com`
2. Verify auto-renewal: `certbot renew --dry-run`

### Step 5: DNS Configuration
1. Add A record pointing domain to VPS IP
2. Wait for propagation

**Rollback:** Keep previous `dist/` backup, revert nginx config, `pm2 restart`

## Open Questions

- [ ] What is the domain name?
- [ ] Does the VPS have sufficient RAM (recommend 1GB+ for Node)?
- [ ] Should we set up basic firewall (ufw) rules?
