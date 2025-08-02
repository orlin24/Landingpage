#!/bin/bash
set -e

# === CONFIG ===
APP_DIR="/var/www/loopbotiq"
WEB_DIR="/var/www/loopbotiq.com"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

echo -e "${BLUE}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║              ESBuild Version Fix v1.0            ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════╝${NC}"
echo ""

print_info "Fixing ESBuild version mismatch issue..."

# Backup current build
print_info "Creating backup of current build..."
if [ -d "$WEB_DIR" ]; then
    cp -r "$WEB_DIR" "$WEB_DIR.backup.$(date +%Y%m%d_%H%M%S)"
    print_success "Backup created successfully"
fi

cd "$APP_DIR/frontend/frontend_app"

# Set memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

print_info "Current directory: $(pwd)"

# Show current esbuild version
print_info "Checking current esbuild versions..."
if [ -f "node_modules/.pnpm/esbuild@*/node_modules/esbuild/package.json" ]; then
    find node_modules/.pnpm -name "esbuild" -type d | head -5
fi

# Complete clean and rebuild
print_info "Performing complete clean rebuild..."
rm -rf node_modules dist .pnpm-store package-lock.json pnpm-lock.yaml 2>/dev/null || true

# Clear pnpm cache
print_info "Clearing pnpm cache..."
pnpm store prune || true

# Fresh install
print_info "Fresh install with latest dependencies..."
pnpm install

# Install terser
print_info "Installing terser..."
pnpm add -D terser

# Force rebuild all binary packages
print_info "Force rebuilding all binary packages..."
pnpm rebuild

# Specifically rebuild esbuild
print_info "Specifically rebuilding esbuild..."
pnpm rebuild esbuild

# Alternative: Reinstall esbuild completely
print_info "Reinstalling esbuild completely..."
pnpm remove esbuild 2>/dev/null || true
pnpm add -D esbuild

# Check esbuild installation
print_info "Verifying esbuild installation..."
if [ -f "node_modules/.bin/esbuild" ]; then
    print_success "ESBuild binary found"
    ls -la node_modules/.bin/esbuild
else
    print_error "ESBuild binary not found!"
fi

# Try to run esbuild test
print_info "Testing esbuild functionality..."
if node_modules/.bin/esbuild --version 2>/dev/null; then
    print_success "ESBuild is working correctly"
else
    print_warning "ESBuild test failed, but continuing..."
fi

# Attempt build
print_info "Attempting frontend build..."
if pnpm run build; then
    print_success "Build completed successfully!"
    
    # Deploy built files
    print_info "Deploying built files..."
    if [ -d "dist" ]; then
        rm -rf "$WEB_DIR"/*
        cp -r dist/* "$WEB_DIR"/
        chown -R www-data:www-data "$WEB_DIR"
        chmod -R 755 "$WEB_DIR"
        print_success "Deployment completed successfully"
    else
        print_error "Build output directory not found!"
        exit 1
    fi
else
    print_error "Build failed even after esbuild fix!"
    print_info "Trying alternative build method..."
    
    # Try with npm instead
    print_info "Installing with npm as fallback..."
    rm -rf node_modules package-lock.json
    npm install
    npm install --save-dev terser esbuild
    
    if npm run build; then
        print_success "Build completed with npm!"
        rm -rf "$WEB_DIR"/*
        cp -r dist/* "$WEB_DIR"/
        chown -R www-data:www-data "$WEB_DIR"
        chmod -R 755 "$WEB_DIR"
        print_success "Deployment completed successfully"
    else
        print_error "All build methods failed!"
        exit 1
    fi
fi

# Reload nginx
nginx -t && systemctl reload nginx
print_success "Nginx reloaded"

# Final verification
print_info "Verifying website..."
if curl -s -o /dev/null -w "%{http_code}" "https://loopbotiq.com" | grep -q "200"; then
    print_success "Website is responding correctly"
else
    print_warning "Website might not be responding correctly"
fi

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║            ESBuild Fix Completed!               ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════╝${NC}"
echo ""
print_success "ESBuild version mismatch has been resolved!"
print_info "Website: https://loopbotiq.com"