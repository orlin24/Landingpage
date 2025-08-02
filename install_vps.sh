#!/bin/bash

# LoopBOTIQ Auto Installer Script
# Auto installer untuk VPS Ubuntu/Debian
# Repository: https://github.com/orlin24/Landingpage

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO_URL="https://github.com/orlin24/Landingpage.git"
PROJECT_DIR="/var/www/loopbotiq"
BACKEND_PORT="5000"
FRONTEND_PORT="3000"
NGINX_DOMAIN="${1:-localhost}"

# Functions
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "Script ini harus dijalankan sebagai root (gunakan sudo)"
        exit 1
    fi
}

update_system() {
    print_status "Updating system packages..."
    apt update && apt upgrade -y
    print_success "System updated successfully"
}

install_dependencies() {
    print_status "Installing system dependencies..."
    
    # Install basic tools
    apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
    
    # Install Python and pip
    apt install -y python3 python3-pip python3-venv python3-dev
    
    # Install Node.js 20.x
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
    
    # Install pnpm
    npm install -g pnpm
    
    # Install Nginx
    apt install -y nginx
    
    # Install supervisor for process management
    apt install -y supervisor
    
    print_success "Dependencies installed successfully"
}

clone_repository() {
    print_status "Cloning repository..."
    
    if [ -d "$PROJECT_DIR" ]; then
        print_warning "Project directory exists, removing..."
        rm -rf "$PROJECT_DIR"
    fi
    
    mkdir -p "$PROJECT_DIR"
    git clone "$REPO_URL" "$PROJECT_DIR"
    cd "$PROJECT_DIR"
    
    print_success "Repository cloned successfully"
}

setup_backend() {
    print_status "Setting up backend..."
    
    cd "$PROJECT_DIR/backend/backend_app"
    
    # Create virtual environment
    python3 -m venv venv
    source venv/bin/activate
    
    # Install Python dependencies
    pip install --upgrade pip
    pip install -r requirements.txt
    pip install gunicorn
    
    # Create admin user
    python3 create_admin.py
    
    print_success "Backend setup completed"
}

setup_frontend() {
    print_status "Setting up frontend..."
    
    cd "$PROJECT_DIR/frontend/frontend_app"
    
    # Install dependencies
    pnpm install
    
    # Build for production
    pnpm build
    
    print_success "Frontend setup completed"
}

setup_supervisor() {
    print_status "Setting up supervisor for backend service..."
    
    cat > /etc/supervisor/conf.d/loopbotiq-backend.conf << EOF
[program:loopbotiq-backend]
command=$PROJECT_DIR/backend/backend_app/venv/bin/gunicorn --bind 127.0.0.1:$BACKEND_PORT --workers 3 src.main:app
directory=$PROJECT_DIR/backend/backend_app
user=www-data
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/loopbotiq-backend.log
environment=FLASK_ENV=production
EOF

    supervisorctl reread
    supervisorctl update
    supervisorctl start loopbotiq-backend
    
    print_success "Supervisor configured and backend service started"
}

setup_nginx() {
    print_status "Setting up Nginx..."
    
    # Remove default site
    rm -f /etc/nginx/sites-enabled/default
    
    # Create new site configuration
    cat > /etc/nginx/sites-available/loopbotiq << EOF
server {
    listen 80;
    server_name $NGINX_DOMAIN;
    
    # Frontend (React App)
    location / {
        root $PROJECT_DIR/frontend/frontend_app/dist;
        index index.html;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:$BACKEND_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # CORS headers
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type, Authorization";
        
        if (\$request_method = 'OPTIONS') {
            return 204;
        }
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
}
EOF

    # Enable site
    ln -s /etc/nginx/sites-available/loopbotiq /etc/nginx/sites-enabled/
    
    # Test and reload Nginx
    nginx -t
    systemctl reload nginx
    
    print_success "Nginx configured successfully"
}

setup_firewall() {
    print_status "Configuring firewall..."
    
    # Install ufw if not installed
    apt install -y ufw
    
    # Configure firewall
    ufw --force reset
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow ssh
    ufw allow 'Nginx Full'
    ufw --force enable
    
    print_success "Firewall configured"
}

setup_ssl() {
    if [ "$NGINX_DOMAIN" != "localhost" ] && [ "$NGINX_DOMAIN" != "127.0.0.1" ]; then
        print_status "Setting up SSL with Let's Encrypt..."
        
        # Install certbot
        apt install -y certbot python3-certbot-nginx
        
        # Get SSL certificate
        certbot --nginx -d "$NGINX_DOMAIN" --non-interactive --agree-tos --email admin@"$NGINX_DOMAIN"
        
        # Setup auto-renewal
        echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
        
        print_success "SSL configured successfully"
    else
        print_warning "Skipping SSL setup for localhost/IP address"
    fi
}

create_startup_script() {
    print_status "Creating startup script..."
    
    cat > /usr/local/bin/loopbotiq-start << 'EOF'
#!/bin/bash
supervisorctl start loopbotiq-backend
systemctl start nginx
echo "LoopBOTIQ services started"
EOF

    cat > /usr/local/bin/loopbotiq-stop << 'EOF'
#!/bin/bash
supervisorctl stop loopbotiq-backend
systemctl stop nginx
echo "LoopBOTIQ services stopped"
EOF

    cat > /usr/local/bin/loopbotiq-restart << 'EOF'
#!/bin/bash
supervisorctl restart loopbotiq-backend
systemctl restart nginx
echo "LoopBOTIQ services restarted"
EOF

    chmod +x /usr/local/bin/loopbotiq-*
    
    print_success "Startup scripts created"
}

show_summary() {
    echo ""
    echo "================================"
    print_success "INSTALASI SELESAI!"
    echo "================================"
    echo ""
    echo "Informasi Akses:"
    echo "- Frontend URL: http://$NGINX_DOMAIN"
    echo "- Backend API: http://$NGINX_DOMAIN/api/"
    echo "- Project Directory: $PROJECT_DIR"
    echo ""
    echo "Service Management:"
    echo "- Start services: loopbotiq-start"
    echo "- Stop services: loopbotiq-stop"
    echo "- Restart services: loopbotiq-restart"
    echo ""
    echo "Log Files:"
    echo "- Backend: /var/log/loopbotiq-backend.log"
    echo "- Nginx: /var/log/nginx/access.log"
    echo "- Nginx Error: /var/log/nginx/error.log"
    echo ""
    echo "Manual Service Commands:"
    echo "- Backend: supervisorctl status loopbotiq-backend"
    echo "- Nginx: systemctl status nginx"
    echo ""
    if [ "$NGINX_DOMAIN" != "localhost" ] && [ "$NGINX_DOMAIN" != "127.0.0.1" ]; then
        echo "SSL Certificate: Configured for $NGINX_DOMAIN"
    fi
    echo "================================"
}

# Main installation process
main() {
    print_status "Starting LoopBOTIQ Auto Installer..."
    echo "Domain/IP: $NGINX_DOMAIN"
    echo ""
    
    check_root
    update_system
    install_dependencies
    clone_repository
    setup_backend
    setup_frontend
    setup_supervisor
    setup_nginx
    setup_firewall
    setup_ssl
    create_startup_script
    show_summary
}

# Run installation
main "$@"