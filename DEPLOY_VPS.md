# Deploy To Ubuntu VPS

This project is a Vue (Vite) frontend + Express API backend.
Recommended production layout:
- `nginx` serves `dist/` and reverse proxies `/api` to Node on `127.0.0.1:3000`
- `systemd` keeps the Node API running

## 1. Prepare the server

```bash
sudo apt update
sudo apt install -y nginx git curl ufw
```

Install Node.js 22 (matches this repo's engine range):

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

## 2. Clone and build

```bash
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
cd /var/www
git clone <your-repo-url> mcgg-rank
cd /var/www/mcgg-rank
npm ci
```

Create production env:

```bash
cp .env.example .env
nano .env
```

Set at least:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_KEY`
- `PORT=3000`

Lock down env file permissions (contains service key):

```bash
sudo chown root:www-data /var/www/mcgg-rank/.env
sudo chmod 640 /var/www/mcgg-rank/.env
```

Build frontend:

```bash
npm run build
```

## 3. Configure systemd for API

Install the service file:

```bash
sudo cp /var/www/mcgg-rank/deploy/mcgg-rank-api.service /etc/systemd/system/mcgg-rank-api.service
sudo systemctl daemon-reload
sudo systemctl enable --now mcgg-rank-api
sudo systemctl status mcgg-rank-api --no-pager
```

Follow logs:

```bash
journalctl -u mcgg-rank-api -f
```

## 4. Configure nginx

Copy the site config and update domain:

```bash
sudo cp /var/www/mcgg-rank/deploy/nginx.mcgg-rank.conf /etc/nginx/sites-available/mcgg-rank
sudo nano /etc/nginx/sites-available/mcgg-rank
```

Replace:
- `your-domain.com`
- `www.your-domain.com`

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/mcgg-rank /etc/nginx/sites-enabled/mcgg-rank
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## 5. Firewall and HTTPS

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

If your domain already points to the VPS, install TLS:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 6. Verify deployment

```bash
curl -i http://127.0.0.1:3000/api/health
curl -I https://your-domain.com
```

Expected:
- API health returns `{"status":"ok"}`
- Frontend loads from `https://your-domain.com`

## 7. Update on new deploys

```bash
cd /var/www/mcgg-rank
git pull
npm ci
npm run build
sudo systemctl restart mcgg-rank-api
sudo systemctl reload nginx
```
