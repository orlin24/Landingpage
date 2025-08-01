from flask import Blueprint, request, jsonify, session, make_response
from src.models.license import License
from src.models.user import db
from src.routes.admin import admin_required
from datetime import datetime, timedelta
import re

license_bp = Blueprint('license', __name__)

@license_bp.route('/create', methods=['POST'])
@admin_required
def create_license():
    """Create a new license"""
    try:
        data = request.get_json()
        email = data.get('email')
        expired_date_str = data.get('expired_date')
        
        if not email or not expired_date_str:
            return jsonify({'error': 'Email and expired_date required'}), 400
        
        # Validate email format
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Parse expired date
        try:
            expired_date = datetime.fromisoformat(expired_date_str.replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use ISO format (YYYY-MM-DDTHH:MM:SS)'}), 400
        
        # Generate license key
        license_key = License.generate_license_key()
        
        # Create new license
        new_license = License(
            license_key=license_key,
            email=email,
            expired_date=expired_date,
            status='active'
        )
        
        db.session.add(new_license)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'License created successfully',
            'license': new_license.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@license_bp.route('/list', methods=['GET'])
@admin_required
def list_licenses():
    """List all licenses with optional search and filter"""
    try:
        # Get query parameters
        search = request.args.get('search', '')
        status_filter = request.args.get('status', '')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        # Build query
        query = License.query
        
        # Apply search filter
        if search:
            query = query.filter(
                (License.license_key.contains(search)) |
                (License.email.contains(search)) |
                (License.device_name.contains(search))
            )
        
        # Apply status filter
        if status_filter:
            query = query.filter_by(status=status_filter)
        
        # Order by created_at desc
        query = query.order_by(License.created_at.desc())
        
        # Paginate
        licenses = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'success': True,
            'licenses': [license.to_dict() for license in licenses.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': licenses.total,
                'pages': licenses.pages,
                'has_next': licenses.has_next,
                'has_prev': licenses.has_prev
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@license_bp.route('/download/<license_key>', methods=['GET'])
@admin_required
def download_license_file(license_key):
    """Download license file as .txt"""
    try:
        license_obj = License.query.filter_by(license_key=license_key).first()
        
        if not license_obj:
            return jsonify({'error': 'License not found'}), 404
        
        # Format expired date
        expired_date_formatted = license_obj.expired_date.strftime('%m/%d/%y')
        
        # Create file content
        file_content = f"""LoopBot expired {expired_date_formatted}
✅License: {license_obj.license_key}
⬇️Download Tools: https://mega.nz/file/
📝Tutorial: https://domain.com/ytmss/tutorial.html"""
        
        # Create response
        response = make_response(file_content)
        response.headers['Content-Type'] = 'text/plain'
        response.headers['Content-Disposition'] = f'attachment; filename="{license_key}.txt"'
        
        return response
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@license_bp.route('/edit/<int:license_id>', methods=['PUT'])
@admin_required
def edit_license(license_id):
    """Edit/extend a license"""
    try:
        license_obj = License.query.get(license_id)
        
        if not license_obj:
            return jsonify({'error': 'License not found'}), 404
        
        data = request.get_json()
        
        # Update email if provided
        if 'email' in data:
            email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(email_pattern, data['email']):
                return jsonify({'error': 'Invalid email format'}), 400
            license_obj.email = data['email']
        
        # Update expired date if provided
        if 'expired_date' in data:
            try:
                expired_date = datetime.fromisoformat(data['expired_date'].replace('Z', '+00:00'))
                license_obj.expired_date = expired_date
            except ValueError:
                return jsonify({'error': 'Invalid date format. Use ISO format (YYYY-MM-DDTHH:MM:SS)'}), 400
        
        # Update status if provided
        if 'status' in data:
            if data['status'] in ['active', 'inactive', 'expired']:
                license_obj.status = data['status']
            else:
                return jsonify({'error': 'Invalid status. Use: active, inactive, expired'}), 400
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'License updated successfully',
            'license': license_obj.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@license_bp.route('/delete/<int:license_id>', methods=['DELETE'])
@admin_required
def delete_license(license_id):
    """Delete a license"""
    try:
        license_obj = License.query.get(license_id)
        
        if not license_obj:
            return jsonify({'error': 'License not found'}), 404
        
        db.session.delete(license_obj)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'License deleted successfully'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@license_bp.route('/extend/<int:license_id>', methods=['POST'])
@admin_required
def extend_license(license_id):
    """Extend license validity period"""
    try:
        license_obj = License.query.get(license_id)
        
        if not license_obj:
            return jsonify({'error': 'License not found'}), 404
        
        data = request.get_json()
        days = data.get('days')
        
        if not days or not isinstance(days, int) or days <= 0:
            return jsonify({'error': 'Days must be a positive integer'}), 400
        
        # Extend the license by adding days to current expired_date
        license_obj.expired_date = license_obj.expired_date + timedelta(days=days)
        
        # If license was expired and we're extending it, reactivate it
        if license_obj.status == 'expired':
            license_obj.status = 'active'
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'License extended by {days} days',
            'license': license_obj.to_dict(),
            'new_expired_date': license_obj.expired_date.isoformat()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@license_bp.route('/shorten/<int:license_id>', methods=['POST'])
@admin_required
def shorten_license(license_id):
    """Shorten license validity period"""
    try:
        license_obj = License.query.get(license_id)
        
        if not license_obj:
            return jsonify({'error': 'License not found'}), 404
        
        data = request.get_json()
        days = data.get('days')
        
        if not days or not isinstance(days, int) or days <= 0:
            return jsonify({'error': 'Days must be a positive integer'}), 400
        
        # Calculate new expiry date
        new_expired_date = license_obj.expired_date - timedelta(days=days)
        
        # Prevent setting expiry date in the past before created_at
        if new_expired_date <= license_obj.created_at:
            return jsonify({'error': 'Cannot shorten license beyond its creation date'}), 400
        
        license_obj.expired_date = new_expired_date
        
        # If new expiry date is in the past, mark as expired
        if new_expired_date < datetime.utcnow():
            license_obj.status = 'expired'
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'License shortened by {days} days',
            'license': license_obj.to_dict(),
            'new_expired_date': license_obj.expired_date.isoformat()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

