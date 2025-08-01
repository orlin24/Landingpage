from datetime import datetime
import uuid
from src.models.user import db

class License(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    license_key = db.Column(db.String(36), unique=True, nullable=False)
    email = db.Column(db.String(120), nullable=False)
    expired_date = db.Column(db.DateTime, nullable=False)
    device_id = db.Column(db.String(64), nullable=True)  # Device ID when activated
    device_name = db.Column(db.String(255), nullable=True)  # Device name when activated
    status = db.Column(db.String(20), default='active')  # active, expired, inactive
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    activated_at = db.Column(db.DateTime, nullable=True)
    
    def __repr__(self):
        return f'<License {self.license_key}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'license_key': self.license_key,
            'email': self.email,
            'expired_date': self.expired_date.isoformat() if self.expired_date else None,
            'device_id': self.device_id,
            'device_name': self.device_name,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'activated_at': self.activated_at.isoformat() if self.activated_at else None
        }
    
    @staticmethod
    def generate_license_key():
        """Generate a license key in format: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"""
        return str(uuid.uuid4()).upper()
    
    def is_expired(self):
        """Check if license is expired"""
        return datetime.utcnow() > self.expired_date
    
    def is_active(self):
        """Check if license is active and not expired"""
        return self.status == 'active' and not self.is_expired()

