#!/bin/bash
set -e

# Force output flushing untuk debugging
exec > >(tee -a /tmp/install.log)
exec 2>&1

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

# Alternative: Skip pnpm completely dan use npm untuk avoid hanging
echo "[INFO] Installing frontend dependencies with npm (bypassing pnpm issues)..."
echo "[INFO] This may take a few minutes, please wait..."

# Clear any existing node_modules
rm -rf node_modules package-lock.json pnpm-lock.yaml 2>/dev/null || true

# Use npm directly to avoid pnpm hanging issues
echo "[DEBUG] Starting npm install..."
npm install --no-audit --no-fund --legacy-peer-deps || {
    echo "[ERROR] npm installation failed"
    exit 1
}

echo "[INFO] Installing terser for build optimization..."
npm install --save-dev terser

USE_NPM=true
echo "[SUCCESS] npm installation completed successfully"
echo "[DEBUG] Continuing to next step..."

if [ "$USE_NPM" != "true" ]; then
    echo "[DEBUG] Installing terser with pnpm..."
    echo "[INFO] Installing terser for build optimization..."
    pnpm add -D terser --ignore-scripts
    echo "[DEBUG] Terser installation completed"
fi

# Manual rebuild critical packages yang dibutuhkan untuk build
echo "[DEBUG] Starting rebuild critical packages..."
echo "[INFO] Rebuilding critical packages..."

if [ "$USE_NPM" != "true" ]; then
    pnpm rebuild esbuild 2>/dev/null || echo "[WARNING] esbuild rebuild failed, continuing..."
    pnpm rebuild @tailwindcss/oxide 2>/dev/null || echo "[WARNING] tailwindcss rebuild failed, continuing..."
    
    # Force approve builds untuk menghindari interactive prompt
    echo "[DEBUG] Starting build scripts approval..."
    echo "[INFO] Force approving build scripts..."
    timeout 30 bash -c 'yes | pnpm approve-builds @tailwindcss/oxide esbuild' 2>/dev/null || echo "[INFO] Build scripts approval skipped"
    echo "[DEBUG] Build scripts approval completed"
else
    echo "[INFO] Using npm, skipping pnpm-specific rebuilds"
fi

echo "[DEBUG] All preparation steps completed, moving to build..."

echo "[DEBUG] Starting build process..."
echo "[INFO] Building production bundle..."

# Set environment variables dan build
export NODE_ENV=production
export NODE_OPTIONS="--max-old-space-size=4096"

echo "[DEBUG] Environment set - NODE_ENV=$NODE_ENV"
echo "[DEBUG] Current directory: $(pwd)"
echo "[DEBUG] Available scripts:"
ls -la package.json 2>/dev/null && cat package.json | grep -A 10 '"scripts"' || echo "No package.json found"

if [ "$USE_NPM" = "true" ]; then
    echo "[DEBUG] Using npm for build..."
    echo "[INFO] Building with npm..."
    npm run build || {
        echo "[WARNING] npm build failed, trying direct vite..."
        npx vite build --mode production || {
            echo "[ERROR] All build methods failed"
            exit 1
        }
    }
    echo "[DEBUG] npm build completed successfully"
else
    echo "[DEBUG] Using pnpm for build..."
    echo "[INFO] Building with pnpm..."
    pnpm run build || {
        echo "[WARNING] pnpm build failed, trying alternative methods..."
        
        # Try with npm instead of pnpm
        echo "[INFO] Trying with npm fallback..."
        npm run build 2>/dev/null || {
            echo "[INFO] Trying direct vite build..."
            # Direct vite build
            npx vite build --mode production || {
                echo "[ERROR] All build methods failed"
                exit 1
            }
        }
    }
    echo "[DEBUG] pnpm build completed successfully"
fi

echo "[DEBUG] Build process finished, checking output..."

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
