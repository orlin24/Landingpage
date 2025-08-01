from flask import Blueprint, request, jsonify, session
from src.models.admin import Admin
from src.models.license import License
from src.models.user import db
from datetime import datetime
from functools import wraps

admin_bp = Blueprint('admin', __name__)

def admin_required(f):
    """Decorator to require admin login"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'admin_id' not in session:
            return jsonify({'error': 'Admin login required'}), 401
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route('/login', methods=['POST'])
def admin_login():
    """Admin login endpoint"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password required'}), 400
        
        admin = Admin.query.filter_by(username=username).first()
        
        if admin and admin.check_password(password):
            session['admin_id'] = admin.id
            admin.last_login = datetime.utcnow()
            db.session.commit()
            
            return jsonify({
                'success': True,
                'message': 'Login successful',
                'admin': admin.to_dict()
            })
        else:
            return jsonify({'error': 'Invalid username or password'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/logout', methods=['POST'])
@admin_required
def admin_logout():
    """Admin logout endpoint"""
    session.pop('admin_id', None)
    return jsonify({'success': True, 'message': 'Logout successful'})

@admin_bp.route('/check', methods=['GET'])
def check_admin_status():
    """Check if admin is logged in"""
    if 'admin_id' in session:
        admin = Admin.query.get(session['admin_id'])
        if admin:
            return jsonify({
                'logged_in': True,
                'admin': admin.to_dict()
            })
    
    return jsonify({'logged_in': False})

@admin_bp.route('/dashboard', methods=['GET'])
@admin_required
def admin_dashboard():
    """Get admin dashboard data"""
    try:
        # Get license statistics
        total_licenses = License.query.count()
        active_licenses = License.query.filter_by(status='active').count()
        expired_licenses = License.query.filter(License.expired_date < datetime.utcnow()).count()
        activated_licenses = License.query.filter(License.device_id.isnot(None)).count()
        
        return jsonify({
            'success': True,
            'stats': {
                'total_licenses': total_licenses,
                'active_licenses': active_licenses,
                'expired_licenses': expired_licenses,
                'activated_licenses': activated_licenses
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

