#!/bin/bash

# Konfigurasi
REPO_ZIP="https://github.com/orlin24/Landingpage/archive/refs/heads/main.zip"
APP_DIR="/var/www/landingpage"
DOMAIN="loopbotiq.com"
GUNICORN_SERVICE="loopbotiq_backend"

echo "🚀 Mulai instalasi Landingpage untuk domain: $DOMAIN"

# Update & install dependensi
sudo apt update && sudo apt upgrade -y
sudo apt install unzip curl nginx python3 python3-venv python3-pip nodejs npm certbot python3-certbot-nginx -y

# Install pnpm
npm install -g pnpm

# Download project
cd /tmp
curl -L $REPO_ZIP -o landingpage.zip
unzip -o landingpage.zip
rm -rf $APP_DIR
mv Landingpage-main $APP_DIR

# ------------------- BACKEND -------------------
echo "⚙️ Setup backend..."
cd $APP_DIR/backend/backend_app
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

if [ -f "create_admin.py" ]; then
    python create_admin.py
fi

# Buat Gunicorn service
sudo tee /etc/systemd/system/$GUNICORN_SERVICE.service > /dev/null <<EOF
[Unit]
Description=Gunicorn untuk LoopBOTIQ Backend
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
sudo systemctl restart $GUNICORN_SERVICE

# ------------------- FRONTEND -------------------
echo "⚙️ Setup frontend..."
cd $APP_DIR/frontend/frontend_app
pnpm install
pnpm run build

sudo mkdir -p /var/www/loopbotiq_frontend
sudo cp -r dist/* /var/www/loopbotiq_frontend/
sudo chown -R www-data:www-data /var/www/loopbotiq_frontend

# ------------------- NGINX -------------------
echo "🌐 Konfigurasi Nginx..."
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

# Aktifkan konfigurasi
sudo ln -sf /etc/nginx/sites-available/loopbotiq /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# Restart backend service jika sudah ada
if sudo systemctl is-active --quiet $GUNICORN_SERVICE; then
    echo "🔄 Restart backend service..."
    sudo systemctl restart $GUNICORN_SERVICE
fi

# ------------------- SSL -------------------
echo "🔐 Mendapatkan SSL dari Let's Encrypt..."
sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN

echo "✅ Selesai!"
echo "🔗 Website kamu tersedia di: https://$DOMAIN"
