#!/bin/bash

DOMAIN="loopbotiq.com"
APP_DIR="/var/www/loopbotiq"
BACKEND_SERVICE="loopbotiq_backend"

echo "Fixing HTTPS 'Not Secure' issues for $DOMAIN..."

# Check current certificate
echo "Checking current SSL certificate..."
certbot certificates

# Check if using staging certificate
if certbot certificates | grep -q "INVALID"; then
    echo "Detected STAGING certificate - this causes 'Not Secure' warning"
    echo "Options:"
    echo "1. Wait for rate limit reset (2025-08-03 07:15:48 UTC)"
    echo "2. Continue with staging for testing"
    echo "3. Use production certificate if available"
    
    read -p "Continue with current certificate? (y/n): " choice
    if [ "$choice" != "y" ]; then
        echo "Exiting. Run 'certbot --nginx -d $DOMAIN' when rate limit resets."
        exit 0
    fi
fi

# Create comprehensive HTTPS nginx config
cat > /etc/nginx/sites-available/$DOMAIN <<EOF
# Force HTTPS redirect
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Special handling for Let's Encrypt challenges
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://\$server_name\$request_uri;
    }
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

    # Enhanced Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; connect-src 'self' https:; font-src 'self' data: https:;" always;

    root /var/www/$DOMAIN;
    index index.html;

    # Frontend (static files) - ensure HTTPS
    location / {
        try_files \$uri \$uri/ /index.html;
        
        # Additional security for HTML files
        location ~* \.html$ {
            add_header Cache-Control "no-cache, no-store, must-revalidate";
            add_header Pragma "no-cache";
            add_header Expires "0";
        }
    }

    # Backend API - ensure HTTPS forwarding
    location /api {
        include proxy_params;
        proxy_pass http://unix:$APP_DIR/backend/backend_app/$BACKEND_SERVICE.sock;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-Port 443;
        proxy_redirect off;
    }

    # Static assets with long caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform, immutable";
        add_header Vary "Accept-Encoding";
        
        # CORS for fonts and assets
        add_header Access-Control-Allow-Origin "https://$DOMAIN";
        add_header Access-Control-Allow-Methods "GET, OPTIONS";
        add_header Access-Control-Allow-Headers "Range";
    }

    # Security - hide sensitive files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # Block access to sensitive files
    location ~* \.(env|log|ini|conf|sql|bak)$ {
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
    echo "HTTPS configuration updated successfully!"
else
    echo "Nginx configuration error!"
    exit 1
fi

# Test HTTPS
echo "Testing HTTPS connection..."
sleep 2
echo "HTTP response (should redirect):"
curl -I http://$DOMAIN | head -3
echo ""
echo "HTTPS response:"
curl -I https://$DOMAIN | head -5

# Check for mixed content
echo ""
echo "Checking for mixed content issues..."
if curl -s https://$DOMAIN | grep -i "http://" > /dev/null; then
    echo "WARNING: Found potential mixed content (HTTP resources on HTTPS page)"
    echo "Found these HTTP references:"
    curl -s https://$DOMAIN | grep -i "http://" | head -5
else
    echo "No obvious mixed content found"
fi

echo ""
echo "HTTPS fix completed!"
echo "Visit: https://$DOMAIN"
echo ""
echo "If still 'Not Secure':"
echo "1. Check if using staging certificate (browser will warn)"
echo "2. Clear browser cache and try incognito mode"
echo "3. Wait for DNS propagation (few minutes)"
echo "4. Install production certificate when rate limit resets"