"""
Case Sharing Cloud Function
Handles case storage, location updates, and case retrieval for kiosk display
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from google.cloud import storage
from datetime import datetime, timedelta
import json
import os

app = Flask(__name__)
# Configure CORS to allow both production and local development
CORS(app, resources={
    r"/*": {
        "origins": [
            "https://igfap.eu",              # Primary production domain (HTTPS)
            "http://igfap.eu",               # Primary production domain (HTTP)
            "https://bosonian.github.io",     # GitHub Pages fallback
            "http://localhost:3002",          # Local PWA dev
            "http://localhost:3020",          # Local PWA preview
            "http://localhost:3001",          # Local kiosk dev
            "http://localhost:4173",          # Local preview (vite build preview)
            "http://localhost:5173",          # Vite dev server (default port)
            "http://localhost:8080",          # Alternative dev port
            "http://127.0.0.1:5173",          # Vite dev (127.0.0.1)
            "http://127.0.0.1:8080"           # Alternative dev (127.0.0.1)
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Accept"],
        "supports_credentials": True
    }
})

# Initialize Cloud Storage
storage_client = storage.Client()
BUCKET_NAME = os.environ.get('BUCKET_NAME', 'igfap-stroke-cases')

def get_bucket():
    """Get or create the cases bucket"""
    try:
        bucket = storage_client.bucket(BUCKET_NAME)
        if not bucket.exists():
            bucket = storage_client.create_bucket(BUCKET_NAME, location='europe-west3')
        return bucket
    except Exception as e:
        print(f"Error accessing bucket: {e}")
        return None


@app.route('/store-case', methods=['POST'])
def store_case():
    """
    Store a new case from field PWA
    Expects: results, formData, location, hospitalId, estimatedArrival
    """
    try:
        data = request.get_json()

        # Validate required fields
        if not data.get('results') or not data.get('hospitalId'):
            return jsonify({'error': 'Missing required fields'}), 400

        # Generate unique case ID
        timestamp = datetime.now().timestamp()
        case_id = f"case_{int(timestamp)}_{os.urandom(4).hex()}"

        # CRITICAL: Sanitize form data to remove defaults/placeholders
        raw_form_data = data.get('formData', {})
        sanitized_form_data = sanitize_form_data(raw_form_data)

        # Log sanitization for auditing
        if raw_form_data != sanitized_form_data:
            raw_keys = set()
            san_keys = set()
            for m in raw_form_data.values():
                if isinstance(m, dict):
                    raw_keys.update(m.keys())
            for m in sanitized_form_data.values():
                if isinstance(m, dict):
                    san_keys.update(m.keys())
            removed_keys = raw_keys - san_keys
            print(f"⚠️  Sanitized form data - removed default fields: {removed_keys}")

        # Create case object with sanitized data
        case_data = {
            'id': case_id,
            'createdAt': datetime.now().isoformat(),
            'status': 'in_transit',
            'ambulanceId': data.get('ambulanceId', f"AMB-{os.urandom(3).hex().upper()}"),

            # Hospital destination
            'hospitalId': data['hospitalId'],
            'hospitalName': data.get('hospitalName', 'Unknown Hospital'),

            # Assessment results
            'results': data['results'],
            'formData': sanitized_form_data,  # SANITIZED - only actual user inputs
            'moduleType': data.get('moduleType', 'unknown'),

            # Location tracking
            'tracking': {
                'currentLocation': data.get('location'),
                'destinationLocation': data.get('destination'),
                'estimatedArrival': data.get('estimatedArrival'),
                'distance': data.get('distance'),
                'duration': data.get('duration'),
                'lastUpdated': datetime.now().isoformat()
            },

            # Computed urgency
            'urgency': compute_urgency(data['results']),

            # Metadata
            'version': 1,
            'lastUpdated': datetime.now().isoformat(),

            # Data integrity: hash of case data
            'dataIntegrityHash': hash(json.dumps({
                'id': case_id,
                'results': data['results'],
                'formData': sanitized_form_data
            }, sort_keys=True))
        }

        # Store in Cloud Storage
        bucket = get_bucket()
        if not bucket:
            return jsonify({'error': 'Storage unavailable'}), 503

        blob = bucket.blob(f"cases/{case_id}.json")
        blob.upload_from_string(
            json.dumps(case_data, indent=2),
            content_type='application/json'
        )

        print(f"✓ Case created: {case_id}")

        return jsonify({
            'success': True,
            'caseId': case_id,
            'message': 'Case created successfully'
        }), 201

    except Exception as e:
        print(f"Error storing case: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/update-location', methods=['POST'])
def update_location():
    """
    Update ambulance location and recalculate ETA
    Expects: caseId, location, estimatedArrival, distance, duration
    """
    try:
        data = request.get_json()

        # Validate required fields
        case_id = data.get('caseId')
        if not case_id or not data.get('location'):
            return jsonify({'error': 'Missing caseId or location'}), 400

        # Load existing case
        bucket = get_bucket()
        if not bucket:
            return jsonify({'error': 'Storage unavailable'}), 503

        blob = bucket.blob(f"cases/{case_id}.json")

        if not blob.exists():
            return jsonify({'error': 'Case not found'}), 404

        case_data = json.loads(blob.download_as_text())

        # Update tracking data
        case_data['tracking'].update({
            'currentLocation': data['location'],
            'estimatedArrival': data.get('estimatedArrival'),
            'distance': data.get('distance'),
            'duration': data.get('duration'),
            'lastUpdated': datetime.now().isoformat()
        })

        case_data['lastUpdated'] = datetime.now().isoformat()

        # Save updated case
        blob.upload_from_string(
            json.dumps(case_data, indent=2),
            content_type='application/json'
        )

        print(f"✓ Location updated: {case_id}")

        return jsonify({
            'success': True,
            'message': 'Location updated'
        }), 200

    except Exception as e:
        print(f"Error updating location: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/get-cases', methods=['GET'])
def get_cases():
    """
    Get all active cases (for kiosk display)
    Optional query params:
    - hospitalId: filter by hospital
    - status: filter by status (default: in_transit)
    """
    try:
        hospital_id = request.args.get('hospitalId')
        status_filter = request.args.get('status', 'in_transit')

        bucket = get_bucket()
        if not bucket:
            return jsonify({'error': 'Storage unavailable'}), 503

        # List all case files
        blobs = bucket.list_blobs(prefix='cases/')
        cases = []

        for blob in blobs:
            if blob.name.endswith('.json'):
                try:
                    case_data = json.loads(blob.download_as_text())

                    # Apply filters
                    if hospital_id and case_data.get('hospitalId') != hospital_id:
                        continue

                    if status_filter and case_data.get('status') != status_filter:
                        continue

                    # Check if case should be auto-archived (2 hours old)
                    created_at = datetime.fromisoformat(case_data['createdAt'])
                    age = datetime.now() - created_at

                    if age > timedelta(hours=2) and case_data['status'] == 'in_transit':
                        # Auto-archive old cases
                        case_data['status'] = 'archived'
                        blob.upload_from_string(
                            json.dumps(case_data, indent=2),
                            content_type='application/json'
                        )
                        continue  # Don't include in results

                    # Check for stale GPS data (>5 minutes)
                    if case_data.get('tracking', {}).get('lastUpdated'):
                        last_update = datetime.fromisoformat(case_data['tracking']['lastUpdated'])
                        gps_age = datetime.now() - last_update

                        if gps_age > timedelta(minutes=5):
                            case_data['tracking']['gpsStale'] = True

                    cases.append(case_data)

                except Exception as e:
                    print(f"Error reading case {blob.name}: {e}")
                    continue

        # Sort by urgency and creation time
        urgency_order = {'IMMEDIATE': 0, 'TIME_CRITICAL': 1, 'URGENT': 2, 'STANDARD': 3}
        cases.sort(key=lambda c: (
            urgency_order.get(c.get('urgency', 'STANDARD'), 4),
            c.get('createdAt', '')
        ))

        return jsonify({
            'success': True,
            'cases': cases,
            'count': len(cases),
            'timestamp': datetime.now().isoformat()
        }), 200

    except Exception as e:
        print(f"Error getting cases: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/mark-arrived', methods=['POST'])
def mark_arrived():
    """
    Mark case as arrived (manually or automatically)
    Expects: caseId
    """
    try:
        data = request.get_json()
        case_id = data.get('caseId')

        if not case_id:
            return jsonify({'error': 'Missing caseId'}), 400

        bucket = get_bucket()
        if not bucket:
            return jsonify({'error': 'Storage unavailable'}), 503

        blob = bucket.blob(f"cases/{case_id}.json")

        if not blob.exists():
            return jsonify({'error': 'Case not found'}), 404

        case_data = json.loads(blob.download_as_text())

        # Update status
        case_data['status'] = 'arrived'
        case_data['arrivedAt'] = datetime.now().isoformat()
        case_data['lastUpdated'] = datetime.now().isoformat()

        # Save
        blob.upload_from_string(
            json.dumps(case_data, indent=2),
            content_type='application/json'
        )

        print(f"✓ Case marked arrived: {case_id}")

        return jsonify({
            'success': True,
            'message': 'Case marked as arrived'
        }), 200

    except Exception as e:
        print(f"Error marking arrived: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/archive-case', methods=['POST', 'OPTIONS'])
def archive_case():
    """
    Archive/dismiss a case (from kiosk)
    Expects: caseId, reason (optional)
    """
    # Handle preflight
    if request.method == 'OPTIONS':
        return '', 204

    try:
        data = request.get_json()
        case_id = data.get('caseId')

        if not case_id:
            return jsonify({'error': 'Missing caseId'}), 400

        bucket = get_bucket()
        if not bucket:
            return jsonify({'error': 'Storage unavailable'}), 503

        blob = bucket.blob(f"cases/{case_id}.json")

        if not blob.exists():
            return jsonify({'error': 'Case not found'}), 404

        case_data = json.loads(blob.download_as_text())

        # Update status to archived
        case_data['status'] = 'archived'
        case_data['archivedAt'] = datetime.now().isoformat()
        case_data['archiveReason'] = data.get('reason', 'dismissed_by_kiosk')
        case_data['lastUpdated'] = datetime.now().isoformat()

        # Save updated case
        blob.upload_from_string(
            json.dumps(case_data, indent=2),
            content_type='application/json'
        )

        print(f"✓ Case archived: {case_id} (reason: {case_data['archiveReason']})")

        return jsonify({
            'success': True,
            'message': 'Case archived successfully'
        }), 200

    except Exception as e:
        print(f"Error archiving case: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/cleanup-old-cases', methods=['POST'])
def cleanup_old_cases():
    """
    Cleanup cases older than 24 hours
    Called by Cloud Scheduler or manually
    """
    try:
        bucket = get_bucket()
        if not bucket:
            return jsonify({'error': 'Storage unavailable'}), 503

        cutoff = datetime.now() - timedelta(hours=24)
        deleted_count = 0

        blobs = bucket.list_blobs(prefix='cases/')

        for blob in blobs:
            if blob.name.endswith('.json'):
                try:
                    case_data = json.loads(blob.download_as_text())
                    created_at = datetime.fromisoformat(case_data['createdAt'])

                    if created_at < cutoff:
                        blob.delete()
                        deleted_count += 1
                        print(f"Deleted old case: {case_data['id']}")

                except Exception as e:
                    print(f"Error processing {blob.name}: {e}")
                    continue

        return jsonify({
            'success': True,
            'deletedCount': deleted_count,
            'message': f'Cleaned up {deleted_count} old cases'
        }), 200

    except Exception as e:
        print(f"Error cleaning up: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/store-shared-case', methods=['POST', 'OPTIONS'])
def store_shared_case():
    """
    Store case data for shareable link (1-hour expiration)
    Expects: caseId, results, formData, timestamp, sharedAt, expiresAt
    Used by PWA share link functionality
    """
    # Handle preflight
    if request.method == 'OPTIONS':
        return '', 204

    try:
        data = request.get_json()

        # Validate required fields
        case_id = data.get('caseId')
        if not case_id or not data.get('results'):
            return jsonify({'error': 'Missing caseId or results'}), 400

        # Create shared case object
        shared_case = {
            'caseId': case_id,
            'results': data['results'],
            'formData': data.get('formData', {}),
            'timestamp': data.get('timestamp', datetime.now().timestamp() * 1000),
            'sharedAt': data.get('sharedAt', datetime.now().isoformat()),
            'expiresAt': data.get('expiresAt', (datetime.now() + timedelta(hours=1)).isoformat()),
            'type': 'shared_link',
            'version': 1
        }

        # Store in Cloud Storage with 'shared/' prefix
        bucket = get_bucket()
        if not bucket:
            return jsonify({'error': 'Storage unavailable'}), 503

        blob = bucket.blob(f"shared/{case_id}.json")
        blob.upload_from_string(
            json.dumps(shared_case, indent=2),
            content_type='application/json'
        )

        print(f"✓ Shared case stored: {case_id}")

        return jsonify({
            'success': True,
            'caseId': case_id,
            'message': 'Shared case stored successfully'
        }), 201

    except Exception as e:
        print(f"Error storing shared case: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/get-shared-case/<case_id>', methods=['GET', 'OPTIONS'])
def get_shared_case(case_id):
    """
    Retrieve shared case data by case ID
    Returns: Case data if found and not expired
    """
    # Handle preflight
    if request.method == 'OPTIONS':
        return '', 204

    try:
        bucket = get_bucket()
        if not bucket:
            return jsonify({'error': 'Storage unavailable'}), 503

        blob = bucket.blob(f"shared/{case_id}.json")

        if not blob.exists():
            return jsonify({'error': 'Case not found'}), 404

        shared_case = json.loads(blob.download_as_text())

        # Check expiration
        expires_at = datetime.fromisoformat(shared_case.get('expiresAt', datetime.now().isoformat()))
        if datetime.now() > expires_at:
            # Delete expired case
            blob.delete()
            print(f"Deleted expired shared case: {case_id}")
            return jsonify({'error': 'Case expired'}), 410

        print(f"✓ Shared case retrieved: {case_id}")

        return jsonify(shared_case), 200

    except Exception as e:
        print(f"Error retrieving shared case: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'case-sharing',
        'timestamp': datetime.now().isoformat()
    }), 200


def sanitize_form_data(form_data):
    """
    CRITICAL: Remove default/placeholder values from form data
    Only keep values that were actually input by users
    This prevents displaying incorrect patient data
    """
    if not form_data or not isinstance(form_data, dict):
        return {}

    sanitized = {}

    # Default values that indicate no user input
    DEFAULT_VALUES = {
        None, '', 0, '0', False,
        'no', 'nein', 'none', 'keine', 'unknown', 'unbekannt',
        '× nein', '× no', 'x nein', 'x no',
        '× nein / no', 'x nein / no'
    }

    for module_key, module_data in form_data.items():
        if not isinstance(module_data, dict):
            continue

        sanitized_module = {}

        for field_key, field_value in module_data.items():
            # Skip if value is in default set
            if field_value in DEFAULT_VALUES:
                continue

            # Skip if value is string and matches default patterns
            if isinstance(field_value, str):
                value_lower = field_value.lower().strip()
                if value_lower in DEFAULT_VALUES:
                    continue
                # Skip patterns like "× Nein / No" or "Nein / No"
                if value_lower.startswith('×') or value_lower.startswith('x'):
                    if 'nein' in value_lower or 'no' in value_lower:
                        continue
                if value_lower.endswith('/no') or value_lower.endswith('/nein'):
                    continue

            # Skip empty arrays
            if isinstance(field_value, list) and len(field_value) == 0:
                continue

            # Value passed validation - include it
            sanitized_module[field_key] = field_value

        # Only include module if it has valid data
        if sanitized_module:
            sanitized[module_key] = sanitized_module

    return sanitized


def compute_urgency(results):
    """
    Compute urgency level from assessment results
    """
    ich_percent = results.get('ich', {}).get('probability', 0) * 100
    lvo_percent = results.get('lvo', {}).get('probability', 0) * 100 if results.get('lvo') else 0

    # Critical: ICH > 70% or LVO > 70%
    if ich_percent > 70 or lvo_percent > 70:
        return 'IMMEDIATE'

    # Time critical: ICH > 50% or LVO > 50%
    if ich_percent > 50 or lvo_percent > 50:
        return 'TIME_CRITICAL'

    # Urgent: ICH > 30% or LVO > 30%
    if ich_percent > 30 or lvo_percent > 30:
        return 'URGENT'

    return 'STANDARD'


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
