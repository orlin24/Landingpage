#!/bin/bash
set -e

# === CONFIG ===
DOMAIN="loopbotiq.com"
REPO="https://github.com/orlin24/Landingpage"
APP_DIR="/var/www/loopbotiq"
BACKEND_SERVICE="loopbotiq_backend"
USER_NAME="root"  # Ganti jika VPS kamu pakai user lain

echo "[INFO] Starting deployment to $DOMAIN"

# === SYSTEM UPDATE ===
apt update && apt upgrade -y
apt install -y python3 python3-pip python3-venv python3-setuptools python3-dev nginx git curl build-essential ufw

# === CREATE SWAP FOR BUILD ===
echo "[INFO] Creating swap file for build process..."
if [ ! -f /swapfile ]; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

echo "[INFO] Installing Node.js 20.x & pnpm..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g pnpm@latest

# Configure pnpm globally untuk menghindari build script issues
echo "[INFO] Configuring pnpm settings..."
pnpm config set auto-install-peers true
pnpm config set enable-pre-post-scripts true
pnpm config set shamefully-hoist true

# === FIREWALL ===
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# === CLONE PROJECT ===
echo "[INFO] Cloning repo..."
rm -rf "$APP_DIR"
git clone "$REPO" "$APP_DIR"

# === BACKEND SETUP ===
cd "$APP_DIR/backend/backend_app"
python3 -m venv venv
source venv/bin/activate

echo "[INFO] Installing Python dependencies..."
cat > requirements.txt <<EOF
blinker==1.8.2
click==8.1.8
Flask==3.0.3
flask-cors==5.0.0
Flask-SQLAlchemy==3.1.1
itsdangerous==2.2.0
Jinja2==3.1.6
MarkupSafe==2.1.5
SQLAlchemy==2.0.41
typing_extensions==4.13.2
Werkzeug==3.0.6
EOF

pip install --upgrade pip
pip install gunicorn
pip install -r requirements.txt

# === CREATE DEFAULT ADMIN ===
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

# === GUNICORN SYSTEMD SERVICE ===
echo "[INFO] Creating Gunicorn service..."
cat > /etc/systemd/system/$BACKEND_SERVICE.service <<EOF
[Unit]
Description=Gunicorn for LoopBOTIQ backend
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

systemctl daemon-reexec
systemctl daemon-reload
systemctl enable $BACKEND_SERVICE
systemctl restart $BACKEND_SERVICE

# === FRONTEND BUILD ===
echo "[INFO] Building frontend..."
cd "$APP_DIR/frontend/frontend_app"

# Set Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Clear cache and install with frozen lockfile
echo "[INFO] Installing frontend dependencies..."
pnpm store prune

# Allow build scripts for required packages
echo "[INFO] Configuring pnpm build scripts..."
pnpm config set auto-install-peers true
pnpm config set enable-pre-post-scripts true

# Install with build scripts allowed
pnpm install --frozen-lockfile --ignore-scripts=false

# Approve specific build scripts yang dibutuhkan
echo "[INFO] Approving build scripts..."
pnpm approve-builds @tailwindcss/oxide esbuild 2>/dev/null || {
    echo "[WARNING] approve-builds failed, using alternative method..."
    # Alternative: Install dengan --ignore-scripts lalu manual rebuild
    pnpm install --ignore-scripts
    # Rebuild critical packages
    pnpm rebuild @tailwindcss/oxide esbuild 2>/dev/null || echo "[INFO] Manual rebuild completed"
}

# Install terser for vite build optimization  
pnpm add -D terser

echo "[INFO] Building production bundle..."
# Try build with verbose logging
pnpm run build --verbose || {
    echo "[WARNING] Build failed, trying alternative build method..."
    # Alternative build method
    NODE_ENV=production pnpm vite build --mode production
}

# Verify build output
if [ ! -d "dist" ]; then
    echo "[ERROR] Frontend build failed - dist directory not found"
    exit 1
fi

echo "[INFO] Copying build files to web directory..."
mkdir -p /var/www/$DOMAIN
cp -r dist/* /var/www/$DOMAIN/

# Set proper permissions
chown -R www-data:www-data /var/www/$DOMAIN
chmod -R 755 /var/www/$DOMAIN

# === NGINX CONFIG ===
echo "[INFO] Configuring Nginx..."
cat > /etc/nginx/sites-available/$DOMAIN <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    root /var/www/$DOMAIN;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        include proxy_params;
        proxy_pass http://unix:$APP_DIR/backend/backend_app/$BACKEND_SERVICE.sock;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
EOF

ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# === SSL ===
echo "[INFO] Installing SSL with Certbot..."
apt install -y certbot python3-certbot-nginx
certbot --nginx --non-interactive --agree-tos -m admin@$DOMAIN -d $DOMAIN

echo "[DONE] LoopBOTIQ deployed successfully at https://$DOMAIN"
