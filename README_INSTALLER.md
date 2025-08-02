# LoopBOTIQ Auto Installer

Auto installer script untuk deploy aplikasi LoopBOTIQ di VPS Ubuntu/Debian.

## Fitur

- ✅ Install semua dependencies (Python, Node.js, Nginx, dll)
- ✅ Setup backend Flask dengan Gunicorn
- ✅ Build dan deploy frontend React
- ✅ Konfigurasi Nginx sebagai reverse proxy
- ✅ Setup SSL certificate dengan Let's Encrypt
- ✅ Konfigurasi firewall dengan UFW
- ✅ Service management dengan Supervisor
- ✅ Monitoring dan logging

## Cara Penggunaan

### 1. Basic Installation (localhost)
```bash
sudo bash install_vps.sh
```

### 2. Installation dengan Domain
```bash
sudo bash install_vps.sh yourdomain.com
```

### 3. Download dan Install Langsung
```bash
curl -sSL https://raw.githubusercontent.com/orlin24/Landingpage/main/install_vps.sh | sudo bash -s yourdomain.com
```

## Requirements

- Ubuntu 20.04+ atau Debian 11+
- Minimal 1GB RAM
- Access root (sudo)
- Domain name (optional, untuk SSL)

## Yang Diinstall

### System Dependencies
- Python 3.x + pip + venv
- Node.js 20.x + pnpm
- Nginx
- Supervisor
- UFW Firewall
- Certbot (untuk SSL)

### Project Setup
- Clone repository dari GitHub
- Setup Python virtual environment
- Install backend dependencies (Flask, SQLAlchemy, dll)
- Install frontend dependencies (React, Vite, dll)
- Build production frontend
- Create admin user

### Services
- Backend: Gunicorn WSGI server (port 5000)
- Frontend: Static files served by Nginx
- Reverse proxy: Nginx
- Process manager: Supervisor

## Management Commands

Setelah instalasi, gunakan command berikut:

```bash
# Start services
loopbotiq-start

# Stop services
loopbotiq-stop

# Restart services
loopbotiq-restart

# Check status
supervisorctl status loopbotiq-backend
systemctl status nginx
```

## File Locations

```
/var/www/loopbotiq/          # Project directory
├── backend/
│   └── backend_app/
│       ├── venv/            # Python virtual environment
│       ├── src/             # Flask app source
│       └── requirements.txt
└── frontend/
    └── frontend_app/
        ├── dist/            # Built React app
        └── package.json
```

## Configuration Files

```
/etc/nginx/sites-available/loopbotiq    # Nginx configuration
/etc/supervisor/conf.d/loopbotiq-backend.conf    # Supervisor config
/usr/local/bin/loopbotiq-*              # Management scripts
```

## Log Files

```
/var/log/loopbotiq-backend.log          # Backend application logs
/var/log/nginx/access.log               # Nginx access logs
/var/log/nginx/error.log                # Nginx error logs
/var/log/supervisor/supervisord.log     # Supervisor logs
```

## Ports

- **80/443**: Nginx (HTTP/HTTPS)
- **5000**: Backend Gunicorn (internal)
- **22**: SSH

## SSL Certificate

Jika menggunakan domain (bukan localhost/IP), script akan otomatis:
- Install certbot
- Generate SSL certificate dari Let's Encrypt
- Setup auto-renewal
- Redirect HTTP ke HTTPS

## Troubleshooting

### Check Services Status
```bash
# Backend service
supervisorctl status loopbotiq-backend

# Nginx
systemctl status nginx

# Check ports
netstat -tlnp | grep -E '(80|443|5000)'
```

### View Logs
```bash
# Backend logs
tail -f /var/log/loopbotiq-backend.log

# Nginx error logs
tail -f /var/log/nginx/error.log

# Supervisor logs
tail -f /var/log/supervisor/supervisord.log
```

### Restart Services
```bash
# Restart backend only
supervisorctl restart loopbotiq-backend

# Restart nginx only
systemctl restart nginx

# Restart all
loopbotiq-restart
```

### Database Issues
```bash
cd /var/www/loopbotiq/backend/backend_app
source venv/bin/activate
python3 create_admin.py
```

### Permission Issues
```bash
chown -R www-data:www-data /var/www/loopbotiq
chmod -R 755 /var/www/loopbotiq
```

## Security

- Firewall dikonfigurasi untuk hanya allow port SSH, HTTP, dan HTTPS
- Backend hanya accessible via Nginx reverse proxy
- SSL/TLS encryption untuk HTTPS
- Process isolation dengan user www-data

## Update Deployment

Untuk update aplikasi:

```bash
cd /var/www/loopbotiq
git pull origin main

# Update backend
cd backend/backend_app
source venv/bin/activate
pip install -r requirements.txt

# Update frontend
cd ../../frontend/frontend_app
pnpm install
pnpm build

# Restart services
loopbotiq-restart
```

## Support

Untuk issue dan bug report: https://github.com/orlin24/Landingpage/issues