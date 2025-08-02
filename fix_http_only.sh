#!/bin/bash

DOMAIN="loopbotiq.com"
APP_DIR="/var/www/loopbotiq"
BACKEND_SERVICE="loopbotiq_backend"

echo "Setting up HTTP-only configuration for $DOMAIN..."

# Create HTTP-only nginx config
cat > /etc/nginx/sites-available/$DOMAIN <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

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
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
        add_header Vary "Accept-Encoding";
    }

    # Security
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
EOF

echo "Testing nginx configuration..."
if nginx -t; then
    echo "Reloading nginx..."
    systemctl reload nginx
    echo "HTTP configuration updated successfully!"
    echo "Website accessible at: http://$DOMAIN"
else
    echo "Nginx configuration error!"
    exit 1
fi

# Test HTTP
echo "Testing HTTP connection..."
sleep 2
curl -I http://$DOMAIN | head -5

echo "HTTP-only setup completed!"
echo "To add SSL later, run: certbot --nginx -d $DOMAIN"