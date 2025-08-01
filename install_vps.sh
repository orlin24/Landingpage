#!/bin/bash

# Auto Installer for VPS Ubuntu 20.04
# LoopBotiq Landing Page & API

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="loopbotiq.com"
PROJECT_NAME="loopbotiq"
GITHUB_URL="https://github.com/orlin24/Landingpage/archive/refs/heads/main.zip"
INSTALL_DIR="/var/www/$PROJECT_NAME"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}    LoopBotiq VPS Auto Installer       ${NC}"
echo -e "${BLUE}========================================${NC}"

# Function to print status
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root (sudo ./install_vps.sh)"
    exit 1
fi

# Update system
print_status "Updating system packages..."
apt update && apt upgrade -y

# Install required packages
print_status "Installing required packages..."
apt install -y nginx python3 python3-pip python3-venv nodejs npm unzip curl wget git ufw

# Configure firewall
print_status "Configuring firewall..."
ufw --force enable
ufw allow ssh
ufw allow 80
ufw allow 443

# Create project directory
print_status "Creating project directory..."
mkdir -p $INSTALL_DIR
cd $INSTALL_DIR

# Download and extract project
print_status "Downloading project from GitHub..."
wget -O project.zip $GITHUB_URL
unzip -o project.zip
mv Landingpage-main/* .
rm -rf Landingpage-main project.zip

# Setup Backend
print_status "Setting up Python backend..."
cd $INSTALL_DIR/backend/backend_app

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn

# Set production environment variables
cat > .env << EOF
FLASK_DEBUG=false
FLASK_TESTING=false
FLASK_ENV=production
EOF

# Create systemd service for backend
print_status "Creating backend systemd service..."
cat > /etc/systemd/system/loopbotiq-backend.service << EOF
[Unit]
Description=LoopBotiq Backend API
After=network.target

[Service]
Type=notify
User=www-data
Group=www-data
WorkingDirectory=$INSTALL_DIR/backend/backend_app
Environment=PATH=$INSTALL_DIR/backend/backend_app/venv/bin
EnvironmentFile=$INSTALL_DIR/backend/backend_app/.env
ExecStart=$INSTALL_DIR/backend/backend_app/venv/bin/gunicorn --workers 4 --bind 127.0.0.1:5000 --timeout 120 --access-logfile /var/log/loopbotiq-backend.log --error-logfile /var/log/loopbotiq-backend-error.log src.main:app
ExecReload=/bin/kill -s HUP \$MAINPID
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Setup Frontend
print_status "Setting up React frontend..."
cd $INSTALL_DIR/frontend/frontend_app

# Install Node.js dependencies
npm install

# Build production version
npm run build

# Set correct permissions
print_status "Setting file permissions..."
chown -R www-data:www-data $INSTALL_DIR
chmod -R 755 $INSTALL_DIR

# Configure Nginx
print_status "Configuring Nginx..."
cat > /etc/nginx/sites-available/$PROJECT_NAME << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Frontend (React build)
    location / {
        root $INSTALL_DIR/frontend/frontend_app/dist;
        try_files \$uri \$uri/ /index.html;
        
        # Add security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
    }
    
    # API Backend
    location /api {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # CORS headers
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization" always;
        
        # Handle preflight requests
        if (\$request_method = 'OPTIONS') {
            return 204;
        }
    }
    
    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        root $INSTALL_DIR/frontend/frontend_app/dist;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Security: Hide sensitive files
    location ~ /\. {
        deny all;
    }
    
    location ~ /(venv|__pycache__|\.git) {
        deny all;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/$PROJECT_NAME /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Start and enable services
print_status "Starting services..."
systemctl daemon-reload
systemctl enable loopbotiq-backend
systemctl start loopbotiq-backend
systemctl enable nginx
systemctl restart nginx

# Install SSL certificate (optional)
print_status "Setting up SSL certificate..."
snap install core; snap refresh core
snap install --classic certbot
ln -sf /snap/bin/certbot /usr/bin/certbot

# Try to get SSL certificate
if certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN --redirect; then
    print_status "SSL certificate installed successfully!"
else
    print_warning "SSL certificate installation failed. You can run 'certbot --nginx' manually later."
fi

# Create log rotation
print_status "Setting up log rotation..."
cat > /etc/logrotate.d/loopbotiq << EOF
/var/log/loopbotiq-*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload loopbotiq-backend
    endscript
}
EOF

# Final status check
print_status "Checking service status..."
sleep 5

if systemctl is-active --quiet loopbotiq-backend; then
    BACKEND_STATUS="${GREEN}✓ Running${NC}"
else
    BACKEND_STATUS="${RED}✗ Failed${NC}"
fi

if systemctl is-active --quiet nginx; then
    NGINX_STATUS="${GREEN}✓ Running${NC}"
else
    NGINX_STATUS="${RED}✗ Failed${NC}"
fi

echo
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}      Installation Complete!           ${NC}"
echo -e "${BLUE}========================================${NC}"
echo
echo -e "Backend Service: $BACKEND_STATUS"
echo -e "Nginx Service:   $NGINX_STATUS"
echo
echo -e "${GREEN}Your application is now available at:${NC}"
echo -e "Frontend: ${BLUE}https://$DOMAIN${NC}"
echo -e "API:      ${BLUE}https://$DOMAIN/api${NC}"
echo
echo -e "${YELLOW}Useful commands:${NC}"
echo -e "• Check backend logs: ${BLUE}journalctl -u loopbotiq-backend -f${NC}"
echo -e "• Restart backend:    ${BLUE}systemctl restart loopbotiq-backend${NC}"
echo -e "• Restart nginx:      ${BLUE}systemctl restart nginx${NC}"
echo -e "• Check status:       ${BLUE}systemctl status loopbotiq-backend${NC}"
echo
echo -e "${GREEN}Installation completed successfully!${NC}"