#!/bin/bash
set -e

# === CONFIG ===
DOMAIN="loopbotiq.com"
REPO="https://github.com/orlin24/Landingpage"
APP_DIR="/var/www/loopbotiq"
BACKEND_SERVICE="loopbotiq_backend"
USER_NAME="root"

echo "[INFO] Starting simple deployment to $DOMAIN"
echo "[INFO] Following README deployment approach..."

# === SYSTEM UPDATE ===
apt update && apt upgrade -y
apt install -y python3 python3-pip python3-venv nginx git curl ufw

# === FIREWALL ===
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# === CLONE PROJECT ===
echo "[INFO] Cloning repo..."
rm -rf "$APP_DIR"
git clone "$REPO" "$APP_DIR"

# === BACKEND SETUP (Following README exactly) ===
echo "[INFO] Setting up backend..."
cd "$APP_DIR/backend/backend_app"

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install gunicorn flask flask-cors flask-sqlalchemy

# Create default admin
echo "[INFO] Creating default admin..."
cat > create_admin.py <<EOF
#!/usr/bin/env python3
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.models.admin import Admin
from src.models.user import db
from src.main import app

def create_default_admin():
    with app.app_context():
        existing_admin = Admin.query.filter_by(username='joss').first()
        if not existing_admin:
            admin = Admin(username='joss')
            admin.set_password('24ciumdulu#*')
            db.session.add(admin)
            db.session.commit()
            print('✅ Default admin created: joss / 24ciumdulu#*')
        else:
            print('⚠️ Admin already exists')

if __name__ == '__main__':
    create_default_admin()
EOF

python3 create_admin.py

# === GUNICORN SERVICE (Following README exactly) ===
echo "[INFO] Creating Gunicorn service..."
cat > /etc/systemd/system/$BACKEND_SERVICE.service <<EOF
[Unit]
Description=Gunicorn instance for LoopBOTIQ Backend
After=network.target

[Service]
User=$USER_NAME
Group=www-data
WorkingDirectory=$APP_DIR/backend/backend_app
ExecStart=$APP_DIR/backend/backend_app/venv/bin/gunicorn --workers 3 --bind unix:$APP_DIR/backend/backend_app/$BACKEND_SERVICE.sock src.main:app
Restart=always

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable $BACKEND_SERVICE
systemctl start $BACKEND_SERVICE

# === BUILD FRONTEND LOCALLY (Following README approach) ===
echo "[INFO] Installing Node.js for local build..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Set memory for build process
export NODE_OPTIONS="--max-old-space-size=4096"

echo "[INFO] Building frontend fresh on VPS with latest changes..."
cd "$APP_DIR/frontend/frontend_app"

# Clean build untuk ensure fresh build dengan latest changes
echo "[INFO] Cleaning previous build artifacts..."
rm -rf node_modules dist package-lock.json pnpm-lock.yaml 2>/dev/null || true

# Fresh install and build
echo "[INFO] Fresh install dependencies..."
pnpm install

# Install terser yang dibutuhkan Vite v6.3.5
echo "[INFO] Installing terser for Vite build optimization..."
pnpm add -D terser

# Force rebuild esbuild untuk fix version conflicts
echo "[INFO] Rebuilding esbuild to fix version mismatch..."
pnpm rebuild esbuild

echo "[INFO] Building production bundle with all latest optimizations..."
pnpm run build

# Verify build success
if [ ! -d "dist" ]; then
    echo "[ERROR] Build failed - dist directory not created"
    exit 1
fi

echo "[SUCCESS] Frontend built successfully with latest changes"

# === DEPLOY BUILT FILES (Following README exactly) ===
echo "[INFO] Deploying built files..."
mkdir -p /var/www/$DOMAIN
cp -r dist/* /var/www/$DOMAIN/
chown -R www-data:www-data /var/www/$DOMAIN
chmod -R 755 /var/www/$DOMAIN

# === NGINX CONFIG (Combined frontend + backend) ===
echo "[INFO] Configuring Nginx..."
cat > /etc/nginx/sites-available/$DOMAIN <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    root /var/www/$DOMAIN;
    index index.html;

    # Frontend (static files)
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api {
        include proxy_params;
        proxy_pass http://unix:$APP_DIR/backend/backend_app/$BACKEND_SERVICE.sock;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and reload nginx
nginx -t && systemctl reload nginx

# === SSL (Optional) ===
echo "[INFO] Installing SSL with Certbot..."
apt install -y certbot python3-certbot-nginx
certbot --nginx --non-interactive --agree-tos -m admin@$DOMAIN -d $DOMAIN

# === STATUS CHECK ===
echo "[INFO] Checking services status..."
systemctl status $BACKEND_SERVICE --no-pager
systemctl status nginx --no-pager

echo "[DONE] LoopBOTIQ deployed successfully at https://$DOMAIN"
echo "[INFO] Backend service: $BACKEND_SERVICE"
echo "[INFO] Admin credentials: joss / 24ciumdulu#*"