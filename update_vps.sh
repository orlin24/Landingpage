#!/bin/bash
set -e

# === CONFIG ===
DOMAIN="loopbotiq.com"
APP_DIR="/var/www/loopbotiq"
BACKEND_SERVICE="loopbotiq_backend"
WEB_DIR="/var/www/$DOMAIN"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           LoopBOTIQ Update Manager v2.0          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════╝${NC}"
echo ""

# Function to print colored messages
print_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Function to check if directory exists
check_directory() {
    if [ ! -d "$1" ]; then
        print_error "Directory $1 not found!"
        exit 1
    fi
}

# Function to backup current build
backup_current() {
    print_info "Creating backup of current build..."
    if [ -d "$WEB_DIR" ]; then
        cp -r "$WEB_DIR" "$WEB_DIR.backup.$(date +%Y%m%d_%H%M%S)"
        print_success "Backup created successfully"
    fi
}

# Function to restore backup if needed
restore_backup() {
    print_warning "Attempting to restore from backup..."
    local latest_backup=$(ls -t "$WEB_DIR".backup.* 2>/dev/null | head -n1)
    if [ -n "$latest_backup" ]; then
        rm -rf "$WEB_DIR"
        cp -r "$latest_backup" "$WEB_DIR"
        print_success "Backup restored successfully"
    else
        print_error "No backup found to restore!"
    fi
}

# === UPDATE OPTIONS ===
echo "Select update option:"
echo "1) Frontend Only (quick update)"
echo "2) Backend Only"  
echo "3) Full Update (frontend + backend)"
echo "4) Git Pull Only (no build)"
echo "5) Force Clean Build"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        UPDATE_TYPE="frontend"
        print_info "Frontend-only update selected"
        ;;
    2)
        UPDATE_TYPE="backend"
        print_info "Backend-only update selected"
        ;;
    3)
        UPDATE_TYPE="full"
        print_info "Full update selected"
        ;;
    4)
        UPDATE_TYPE="git-only"
        print_info "Git pull only selected"
        ;;
    5)
        UPDATE_TYPE="clean"
        print_info "Force clean build selected"
        ;;
    *)
        print_error "Invalid choice. Exiting..."
        exit 1
        ;;
esac

echo ""

# === PRE-UPDATE CHECKS ===
print_info "Running pre-update checks..."
check_directory "$APP_DIR"

# Check if services are running
if ! systemctl is-active --quiet "$BACKEND_SERVICE"; then
    print_warning "Backend service is not running"
fi

if ! systemctl is-active --quiet nginx; then
    print_warning "Nginx is not running"
fi

# === GIT PULL ===
print_info "Pulling latest changes from GitHub..."
cd "$APP_DIR"

# Show current commit
current_commit=$(git rev-parse --short HEAD)
print_info "Current commit: $current_commit"

# Pull changes
git fetch origin main
new_commit=$(git rev-parse --short origin/main)
print_info "Latest commit: $new_commit"

if [ "$current_commit" = "$new_commit" ]; then
    print_warning "No new changes found. Repository is up to date."
    if [ "$UPDATE_TYPE" != "clean" ]; then
        echo "Exiting..."
        exit 0
    fi
    print_info "Proceeding with clean build anyway..."
fi

git reset --hard origin/main
print_success "Git pull completed"

if [ "$UPDATE_TYPE" = "git-only" ]; then
    print_success "Git pull completed. No build required."
    exit 0
fi

# === UPDATE EXECUTION ===
case $UPDATE_TYPE in
    "frontend"|"full"|"clean")
        print_info "Updating frontend..."
        
        # Backup current build
        backup_current
        
        cd "$APP_DIR/frontend/frontend_app"
        
        # Set memory limit
        export NODE_OPTIONS="--max-old-space-size=4096"
        
        if [ "$UPDATE_TYPE" = "clean" ]; then
            print_info "Performing clean build..."
            rm -rf node_modules dist package-lock.json pnpm-lock.yaml 2>/dev/null || true
        fi
        
        # Check if node_modules exists
        if [ ! -d "node_modules" ] || [ "$UPDATE_TYPE" = "clean" ]; then
            print_info "Installing dependencies..."
            pnpm install
            pnpm add -D terser
        else
            print_info "Dependencies already installed, skipping..."
        fi
        
        # Build frontend
        print_info "Building frontend..."
        if pnpm run build; then
            print_success "Frontend build completed"
        else
            print_error "Frontend build failed!"
            restore_backup
            exit 1
        fi
        
        # Deploy built files
        print_info "Deploying frontend files..."
        if [ -d "dist" ]; then
            rm -rf "$WEB_DIR"/*
            cp -r dist/* "$WEB_DIR"/
            chown -R www-data:www-data "$WEB_DIR"
            chmod -R 755 "$WEB_DIR"
            print_success "Frontend deployed successfully"
        else
            print_error "Build output directory not found!"
            restore_backup
            exit 1
        fi
        ;;
esac

case $UPDATE_TYPE in
    "backend"|"full")
        print_info "Updating backend..."
        
        cd "$APP_DIR/backend/backend_app"
        
        # Activate virtual environment
        source venv/bin/activate
        
        # Update Python dependencies if requirements.txt changed
        if git diff --name-only "$current_commit" HEAD | grep -q "requirements.txt"; then
            print_info "Requirements.txt changed, updating dependencies..."
            pip install --upgrade pip
            pip install -r requirements.txt
        fi
        
        # Restart backend service
        print_info "Restarting backend service..."
        systemctl restart "$BACKEND_SERVICE"
        
        # Check service status
        if systemctl is-active --quiet "$BACKEND_SERVICE"; then
            print_success "Backend service restarted successfully"
        else
            print_error "Backend service failed to start!"
            systemctl status "$BACKEND_SERVICE" --no-pager
            exit 1
        fi
        ;;
esac

# === POST-UPDATE ACTIONS ===
print_info "Running post-update actions..."

# Reload Nginx
nginx -t && systemctl reload nginx
print_success "Nginx configuration reloaded"

# Clean old backups (keep last 5)
print_info "Cleaning old backups..."
ls -t "$WEB_DIR".backup.* 2>/dev/null | tail -n +6 | xargs rm -rf 2>/dev/null || true

# === VERIFICATION ===
print_info "Verifying deployment..."

# Check website response
if curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN" | grep -q "200"; then
    print_success "Website is responding correctly"
else
    print_warning "Website might not be responding correctly"
fi

# Check backend service
if systemctl is-active --quiet "$BACKEND_SERVICE"; then
    print_success "Backend service is running"
else
    print_warning "Backend service might have issues"
fi

# === SUMMARY ===
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                Update Completed!                 ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════╝${NC}"
echo ""
print_info "Update Summary:"
echo "  • Type: $UPDATE_TYPE"
echo "  • Previous commit: $current_commit"
echo "  • New commit: $new_commit"
echo "  • Domain: https://$DOMAIN"
echo "  • Backend service: $BACKEND_SERVICE"
echo ""
print_success "LoopBOTIQ update completed successfully!"

# Show service status
echo ""
print_info "Current service status:"
systemctl status "$BACKEND_SERVICE" --no-pager -l | head -10
echo ""
systemctl status nginx --no-pager -l | head -5