#!/bin/bash

# Konfigurasi
REPO_ZIP="https://github.com/orlin24/Landingpage/archive/refs/heads/main.zip"
APP_DIR="/var/www/landingpage"
DOMAIN="loopbotiq.com"
GUNICORN_SERVICE="loopbotiq_backend"

echo "🚀 Memulai instalasi untuk domain: $DOMAIN"

# Install dependensi dasar
sudo apt update && sudo apt upgrade -y
sudo apt install unzip curl nginx python3 python3-venv python3-pip nodejs npm -y
npm install -g pnpm

# Unduh dan ekstrak repo
cd /tmp
curl -L $REPO_ZIP -o landingpage.zip
unzip -o landingpage.zip
rm -rf $APP_DIR
mv Landingpage-main $APP_DIR

# --- SETUP BACKEND ---
cd $APP_DIR/backend/backend_app
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

if [ -f "create_admin.py" ]; then
    echo "🔐 Membuat admin user..."
    python create_admin.py
fi

# Buat service Gunicorn
sudo tee /etc/systemd/system/$GUNICORN_SERVICE.service > /dev/null <<EOF
[Unit]
Description=Gunicorn untuk Backend LoopBOTIQ
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=$APP_DIR/backend/backend_app
ExecStart=$APP_DIR/backend/backend_app/venv/bin/gunicorn --workers 3 --bind unix:$APP_DIR/backend/backend_app/backend.sock src.main:app
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable $GUNICORN_SERVICE
sudo systemctl start $GUNICORN_SERVICE

# --- SETUP FRONTEND ---
cd $APP_DIR/frontend/frontend_app
pnpm install
pnpm run build

sudo mkdir -p /var/www/loopbotiq_frontend
sudo cp -r dist/* /var/www/loopbotiq_frontend/

# --- NGINX CONFIG ---
echo "🌍 Membuat konfigurasi Nginx untuk domain $DOMAIN..."

sudo tee /etc/nginx/sites-available/loopbotiq > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    root /var/www/loopbotiq_frontend;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        include proxy_params;
        proxy_pass http://unix:$APP_DIR/backend/backend_app/backend.sock;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
EOF

# Aktifkan konfigurasi Nginx
sudo ln -sf /etc/nginx/sites-available/loopbotiq /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

echo "✅ INSTALASI SELESAI!"
echo "🔗 Website dapat diakses di: http://$DOMAIN"
