#!/bin/bash

DOMAIN="loopbotiq.com"
APP_DIR="/var/www/loopbotiq"
BACKEND_SERVICE="loopbotiq_backend"

echo "Fixing SSL configuration for $DOMAIN..."

# Create proper nginx config with SSL
cat > /etc/nginx/sites-available/$DOMAIN <<EOF
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

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
    echo "SSL configuration updated successfully!"
else
    echo "Nginx configuration error!"
    exit 1
fi

# Test SSL
echo "Testing SSL connection..."
sleep 2
curl -I https://$DOMAIN | head -5

echo "SSL fix completed!"
echo "Visit: https://$DOMAIN"