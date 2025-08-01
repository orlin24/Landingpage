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
        existing_admin = Admin.query.filter_by(username='joss').first()
        if not existing_admin:
            admin = Admin(username='joss')
            admin.set_password('24ciumdulu#*')
            db.session.add(admin)
            db.session.commit()
            print('✅ Default admin created: username=joss, password=24ciumdulu#*')
        else:
            print('⚠️ Admin already exists')

if __name__ == '__main__':
    create_default_admin()

