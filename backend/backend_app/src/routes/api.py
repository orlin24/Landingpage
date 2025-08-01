from flask import Blueprint, request, jsonify
from src.models.license import License
from src.models.user import db
from datetime import datetime
import re

api_bp = Blueprint('api', __name__)

def validate_license_key_format(license_key):
    """Validate license key format: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"""
    pattern = r'^[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}$'
    return bool(re.match(pattern, license_key))

@api_bp.route('/verify_license', methods=['POST'])
def verify_license():
    """Verify license for application use"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        license_key = data.get('license_key')
        device_id = data.get('device_id')
        device_name = data.get('device_name', 'Unknown Device')
        
        if not license_key or not device_id:
            return jsonify({
                'success': False,
                'error': 'License key and device ID required'
            }), 400
        
        # Validate license key format
        if not validate_license_key_format(license_key):
            return jsonify({
                'success': False,
                'error': 'Invalid license key format.\\nFormat expected: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'
            }), 400
        
        # Find license in database
        license_obj = License.query.filter_by(license_key=license_key).first()
        
        if not license_obj:
            return jsonify({
                'success': False,
                'error': 'License not found',
                'status': 'invalid'
            }), 404
        
        # Check if license is expired
        if license_obj.is_expired():
            return jsonify({
                'success': False,
                'error': 'License has expired',
                'status': 'expired',
                'expired_date': license_obj.expired_date.isoformat()
            }), 403
        
        # Check if license is inactive
        if license_obj.status != 'active':
            return jsonify({
                'success': False,
                'error': f'License is {license_obj.status}',
                'status': license_obj.status
            }), 403
        
        # Check device binding
        if license_obj.device_id is None:
            # First time activation - bind to this device
            license_obj.device_id = device_id
            license_obj.device_name = device_name
            license_obj.activated_at = datetime.utcnow()
            db.session.commit()
            
            return jsonify({
                'success': True,
                'message': 'License activated successfully',
                'status': 'activated',
                'expired_date': license_obj.expired_date.isoformat(),
                'hash': f"{license_key}_{device_id}"[:32]  # Simple hash for verification
            })
        
        elif license_obj.device_id == device_id:
            # Same device - allow access
            return jsonify({
                'success': True,
                'message': 'License verified successfully',
                'status': 'verified',
                'expired_date': license_obj.expired_date.isoformat(),
                'hash': f"{license_key}_{device_id}"[:32]
            })
        
        else:
            # Different device - deny access
            return jsonify({
                'success': False,
                'error': 'License is already activated on another device',
                'status': 'device_mismatch',
                'activated_device': license_obj.device_name or 'Unknown Device'
            }), 403
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

@api_bp.route('/deactivate_license', methods=['POST'])
def deactivate_license():
    """Deactivate license from current device"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        license_key = data.get('license_key')
        device_id = data.get('device_id')
        
        if not license_key or not device_id:
            return jsonify({
                'success': False,
                'error': 'License key and device ID required'
            }), 400
        
        # Validate license key format
        if not validate_license_key_format(license_key):
            return jsonify({
                'success': False,
                'error': 'Invalid license key format'
            }), 400
        
        # Find license in database
        license_obj = License.query.filter_by(license_key=license_key).first()
        
        if not license_obj:
            return jsonify({
                'success': False,
                'error': 'License not found'
            }), 404
        
        # Check if this device owns the license
        if license_obj.device_id != device_id:
            return jsonify({
                'success': False,
                'error': 'License is not activated on this device'
            }), 403
        
        # Deactivate license (remove device binding)
        license_obj.device_id = None
        license_obj.device_name = None
        license_obj.activated_at = None
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'License deactivated successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

@api_bp.route('/license_status/<license_key>', methods=['GET'])
def get_license_status(license_key):
    """Get license status (for debugging/admin purposes)"""
    try:
        # Validate license key format
        if not validate_license_key_format(license_key):
            return jsonify({
                'success': False,
                'error': 'Invalid license key format'
            }), 400
        
        # Find license in database
        license_obj = License.query.filter_by(license_key=license_key).first()
        
        if not license_obj:
            return jsonify({
                'success': False,
                'error': 'License not found'
            }), 404
        
        return jsonify({
            'success': True,
            'license': {
                'license_key': license_obj.license_key,
                'email': license_obj.email,
                'status': license_obj.status,
                'expired_date': license_obj.expired_date.isoformat(),
                'device_id': license_obj.device_id,
                'device_name': license_obj.device_name,
                'activated_at': license_obj.activated_at.isoformat() if license_obj.activated_at else None,
                'is_expired': license_obj.is_expired(),
                'is_active': license_obj.is_active()
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

