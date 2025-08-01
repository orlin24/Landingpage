#!/usr/bin/env python3
import os
import sys

# Add the project root to the Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.models.admin import Admin
from src.models.user import db
from src.main import app

def create_default_admin():
    with app.app_context():
        # Check if admin already exists
        existing_admin = Admin.query.filter_by(username='admin').first()
        if not existing_admin:
            admin = Admin(username='admin')
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
            print('✅ Default admin created: username=admin, password=admin123')
        else:
            print('⚠️ Admin already exists')

if __name__ == '__main__':
    create_default_admin()

