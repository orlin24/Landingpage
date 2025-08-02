# LoopBOTIQ Project Documentation

This documentation provides instructions on how to set up and run the LoopBOTIQ project locally and deploy it to a VPS.

## Table of Contents

1.  [Project Overview](#project-overview)
2.  [Local Setup](#local-setup)
    - [Backend (Flask)](#backend-flask)
    - [Frontend (React)](#frontend-react)
3.  [VPS Deployment](#vps-deployment)
    - [Backend (Flask)](#backend-flask-1)
    - [Frontend (React)](#frontend-react-1)
4.  [Admin Panel Usage](#admin-panel-usage)
5.  [License API Usage](#license-api-usage)

## 1. Project Overview

LoopBOTIQ is a comprehensive project designed to automate YouTube Live Streams with a robust license management system. It consists of:

- **Backend (Flask):** An admin panel for license management and APIs for license verification and deactivation.
- **Frontend (React):** A public-facing landing page for product showcase and an admin panel interface.

## 2. Local Setup

### Backend (Flask)

### Frontend (React)

## 3. VPS Deployment

### Backend (Flask)

### Frontend (React)

## 4. Admin Panel Usage

## 5. License API Usage

### Backend (Flask)

To run the Flask backend locally, follow these steps:

1.  **Navigate to the backend directory:**

    ```bash
    cd loopbotiq_project/backend/backend_app
    ```

2.  **Create and activate a virtual environment:**

    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

4.  **Initialize the database and create a default admin user (first time only):**

    ```bash
    python create_admin.py
    ```

    This will create an admin user with `username: admin` and `password: admin123`.

5.  **Run the Flask application:**

    ```bash
    python src/main.py
    ```

    The Flask application will run on `http://localhost:5000`.

    **Note:** If you encounter `ModuleNotFoundError` for `flask_cors`, ensure you have activated the virtual environment and run `pip install flask-cors`.

### Frontend (React)

To run the React frontend locally, follow these steps:

1.  **Navigate to the frontend directory:**

    ```bash
    cd loopbotiq_project/frontend/frontend_app
    ```

2.  **Install dependencies (using pnpm):**

    ```bash
    pnpm install
    ```

    If you don't have pnpm installed, you can install it globally:

    ```bash
    npm install -g pnpm
    ```

3.  **Run the React development server:**

    ```bash
    pnpm run dev
    ```

    The React application will typically run on `http://localhost:5173` (or another available port).

    **Note:** Ensure your Flask backend is running before accessing the frontend, as the frontend will communicate with the backend APIs.

### Backend (Flask) on VPS

To deploy the Flask backend to a VPS, you can use Gunicorn as a WSGI server and Nginx as a reverse proxy.

1.  **Prepare your VPS:**

    - Update your system:
      ```bash
      sudo apt update && sudo apt upgrade -y
      ```
    - Install Python, pip, virtualenv, Nginx, and Gunicorn:
      ```bash
      sudo apt install python3-pip python3-venv nginx gunicorn -y
      ```

2.  **Transfer your project:**

    - Copy your `loopbotiq_project/backend/backend_app` directory to your VPS (e.g., to `/var/www/loopbotiq_backend`).

    ```bash
    # On your local machine
    scp -r loopbotiq_project/backend/backend_app user@your_vps_ip:/var/www/loopbotiq_backend
    ```

3.  **Set up the virtual environment on VPS:**

    ```bash
    cd /var/www/loopbotiq_backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```

4.  **Create a Gunicorn service file:**

    - Create a file named `/etc/systemd/system/loopbotiq_backend.service`:
      ```bash
      sudo nano /etc/systemd/system/loopbotiq_backend.service
      ```
    - Add the following content (replace `user` with your VPS username):

      ```ini
      [Unit]
      Description=Gunicorn instance for LoopBOTIQ Backend
      After=network.target

      [Service]
      User=root
      Group=www-data
      WorkingDirectory=/var/www/loopbotiq_backend
      ExecStart=/var/www/loopbotiq_backend/venv/bin/gunicorn --workers 3 --bind unix:/var/www/loopbotiq_backend/loopbotiq_backend.sock src.main:app
      Restart=always

      [Install]
      WantedBy=multi-user.target
      ```

5.  **Start and enable the Gunicorn service:**

    ```bash
    sudo systemctl start loopbotiq_backend
    sudo systemctl enable loopbotiq_backend
    ```

6.  **Configure Nginx as a reverse proxy:**

    - Create a new Nginx configuration file:
      ```bash
      sudo nano /etc/nginx/sites-available/loopbotiq_backend
      ```
    - Add the following content:

      ```nginx
      server {
          listen 80;
          server_name your_backend_domain_or_ip;

          location / {
              include proxy_params;
              proxy_pass http://unix:/var/www/loopbotiq_backend/loopbotiq_backend.sock;
          }
      }
      ```

    - Create a symbolic link to enable the site:
      ```bash
      sudo ln -s /etc/nginx/sites-available/loopbotiq_backend /etc/nginx/sites-enabled
      ```
    - Test Nginx configuration and restart:
      ```bash
      sudo nginx -t
      sudo systemctl restart nginx
      ```

    Your Flask backend should now be accessible via your VPS IP or domain on port 80.

### Frontend (React) on VPS

To deploy the React frontend to a VPS, you will build the application and serve the static files using Nginx.

1.  **Build the React application (on your local machine):**

    ```bash
    cd loopbotiq_project/frontend/frontend_app
    pnpm run build
    ```

    This will create a `dist` directory containing the optimized static files for your React application.

2.  **Transfer the built application to your VPS:**

    ```bash
    # On your local machine
    scp -r loopbotiq_project/frontend/frontend_app/dist user@your_vps_ip:/var/www/loopbotiq_frontend
    ```

3.  **Configure Nginx to serve the static files:**

    - Create a new Nginx configuration file:
      ```bash
      sudo nano /etc/nginx/sites-available/loopbotiq_frontend
      ```
    - Add the following content (replace `your_frontend_domain_or_ip` with your actual domain or IP):

      ```nginx
      server {
          listen 80;
          server_name your_frontend_domain_or_ip;

          root /var/www/loopbotiq_frontend;
          index index.html index.htm;

          location / {
              try_files $uri $uri/ /index.html;
          }

          # Optional: Add caching headers for better performance
          location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
              expires 1y;
              add_header Cache-Control "public, no-transform";
          }
      }
      ```

    - Create a symbolic link to enable the site:
      ```bash
      sudo ln -s /etc/nginx/sites-available/loopbotiq_frontend /etc/nginx/sites-enabled
      ```
    - Test Nginx configuration and restart:
      ```bash
      sudo nginx -t
      sudo systemctl restart nginx
      ```

    Your React frontend should now be accessible via your VPS IP or domain on port 80.

    **Note:** If your backend and frontend are on different domains/IPs, ensure that your Flask backend has CORS properly configured to allow requests from your frontend domain.

## 4. Admin Panel Usage

The admin panel allows you to manage licenses, create new ones, and monitor their status. Access the admin panel through the frontend application once it's running.

**Default Admin Credentials:**

- **Username:** `admin`
- **Password:** `admin123`

**Key Features:**

- **Login/Logout:** Secure access to the admin interface.
- **License Creation:** Generate new license keys, set expiry dates, and assign them to buyer emails.
- **License Listing:** View all licenses with details like key, expiry, email, status, and device ID. Includes search and filter functionalities.
- **License Management:** Edit, extend, deactivate, or delete existing licenses.
- **Download License File:** Generate and download a `.txt` file for each license containing its details and important links.

## 5. License API Usage

The `run.py` application (YouTube Live Stream Automation Tool) interacts with the backend APIs for license verification and deactivation. These APIs ensure that a license is valid and used on only one device at a time.

### `POST /api/verify_license`

This endpoint is used by the `run.py` application to verify a license key and bind it to a device upon first activation.

- **Method:** `POST`
- **URL:** `http://your_backend_domain_or_ip/api/verify_license`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "license_key": "YOUR_LICENSE_KEY_UUID",
    "device_id": "UNIQUE_DEVICE_IDENTIFIER",
    "device_name": "OPTIONAL_DEVICE_NAME"
  }
  ```
- **Responses:**
  - **Success (200 OK):**
    ```json
    {
        "success": true,
        "message": "License activated successfully" || "License verified successfully",
        "status": "activated" || "verified",
        "expired_date": "YYYY-MM-DDTHH:MM:SS",
        "hash": "SHORT_HASH_FOR_VERIFICATION"
    }
    ```
  - **Error (400 Bad Request):** Invalid input (e.g., missing `license_key`, `device_id`, or invalid `license_key` format).
  - **Error (403 Forbidden):** License expired, inactive, or already activated on another device.
  - **Error (404 Not Found):** License key not found.

### `POST /api/deactivate_license`

This endpoint allows the `run.py` application to deactivate a license from the current device, making it available for activation on another device.

- **Method:** `POST`
- **URL:** `http://your_backend_domain_or_ip/api/deactivate_license`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "license_key": "YOUR_LICENSE_KEY_UUID",
    "device_id": "UNIQUE_DEVICE_IDENTIFIER_OF_CURRENT_DEVICE"
  }
  ```
- **Responses:**
  - **Success (200 OK):**
    ```json
    {
      "success": true,
      "message": "License deactivated successfully"
    }
    ```
  - **Error (400 Bad Request):** Invalid input (e.g., missing `license_key`, `device_id`, or invalid `license_key` format).
  - **Error (403 Forbidden):** License not activated on the provided `device_id`.
  - **Error (404 Not Found):** License key not found.
