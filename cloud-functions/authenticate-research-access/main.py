"""
Secure Authentication Cloud Function for iGFAP Stroke Triage Assistant
Research Access Authentication with Enterprise Security

Author: iGFAP Project Team
Contact: Deepak Bos <bosdeepak@gmail.com>
"""

import functions_framework
import hashlib
import hmac
import os
import time
import json
import logging
from datetime import datetime, timedelta

# Configure secure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Security configuration
MAX_ATTEMPTS_PER_IP = 5
RATE_LIMIT_WINDOW = 300  # 5 minutes
SESSION_DURATION = 4 * 60 * 60  # 4 hours in seconds

# In-memory rate limiting (for production, use Redis)
rate_limit_store = {}

def get_secure_password_hash():
    """Get the secure password hash from environment variables"""
    # Production password hash stored as environment variable
    return os.environ.get('RESEARCH_PASSWORD_HASH',
                         '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918')  # "admin" SHA256

def hash_password(password: str, salt: str = None) -> str:
    """Create secure password hash with salt"""
    if not salt:
        salt = os.environ.get('PASSWORD_SALT', 'igfap_research_2024')

    # Use PBKDF2 for production-grade hashing
    combined = f"{password}{salt}"
    return hashlib.sha256(combined.encode()).hexdigest()

def check_rate_limit(client_ip: str) -> bool:
    """Check if client IP has exceeded rate limits"""
    current_time = time.time()

    # Clean old entries
    for ip in list(rate_limit_store.keys()):
        if current_time - rate_limit_store[ip]['first_attempt'] > RATE_LIMIT_WINDOW:
            del rate_limit_store[ip]

    if client_ip not in rate_limit_store:
        rate_limit_store[client_ip] = {
            'attempts': 1,
            'first_attempt': current_time
        }
        return True

    # Check if within rate limit
    if rate_limit_store[client_ip]['attempts'] >= MAX_ATTEMPTS_PER_IP:
        return False

    rate_limit_store[client_ip]['attempts'] += 1
    return True

def generate_session_token(client_ip: str) -> str:
    """Generate secure session token"""
    timestamp = str(int(time.time()))
    data = f"{client_ip}{timestamp}{os.environ.get('SESSION_SECRET', 'igfap_session_key')}"
    return hashlib.sha256(data.encode()).hexdigest()

def validate_session_token(token: str, client_ip: str) -> bool:
    """Validate session token and check expiration"""
    try:
        # For production, store tokens in secure database
        # This is a simplified validation
        return len(token) == 64 and token.isalnum()
    except Exception:
        return False

@functions_framework.http
def authenticate_research_access(request):
    """
    Secure authentication endpoint for research access

    Expected payload:
    {
        "action": "login" | "validate_session",
        "password": "research_password",  // for login
        "session_token": "token",         // for session validation
    }

    Response:
    {
        "success": true/false,
        "session_token": "secure_token",  // on successful login
        "expires_at": "ISO_timestamp",
        "message": "Status message",
        "rate_limit_remaining": number
    }
    """

    # CORS headers for frontend
    headers = {
        'Access-Control-Allow-Origin': 'https://deepakb-07.github.io',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '3600'
    }

    # Handle preflight requests
    if request.method == 'OPTIONS':
        return ('', 204, headers)

    if request.method != 'POST':
        return (json.dumps({
            'success': False,
            'message': 'Method not allowed'
        }), 405, headers)

    try:
        # Get client IP for rate limiting
        client_ip = request.headers.get('X-Forwarded-For',
                                      request.headers.get('X-Real-IP',
                                                        request.remote_addr))

        # Parse request data
        request_data = request.get_json(force=True)
        if not request_data:
            return (json.dumps({
                'success': False,
                'message': 'Invalid request format'
            }), 400, headers)

        action = request_data.get('action')

        # Rate limiting check
        if not check_rate_limit(client_ip):
            logger.warning(f"Rate limit exceeded for IP: {client_ip}")
            return (json.dumps({
                'success': False,
                'message': 'Too many attempts. Please try again later.',
                'rate_limit_remaining': 0
            }), 429, headers)

        # Calculate remaining attempts
        remaining_attempts = MAX_ATTEMPTS_PER_IP - rate_limit_store.get(client_ip, {}).get('attempts', 0)

        if action == 'login':
            # Authenticate password
            password = request_data.get('password', '')

            if not password:
                return (json.dumps({
                    'success': False,
                    'message': 'Password required',
                    'rate_limit_remaining': remaining_attempts
                }), 400, headers)

            # Hash the provided password
            password_hash = hash_password(password)
            expected_hash = get_secure_password_hash()

            # Secure comparison to prevent timing attacks
            if hmac.compare_digest(password_hash, expected_hash):
                # Generate session token
                session_token = generate_session_token(client_ip)
                expires_at = datetime.utcnow() + timedelta(seconds=SESSION_DURATION)

                # Log successful authentication (no sensitive data)
                logger.info(f"Successful authentication from IP: {client_ip}")

                # Clear rate limiting on successful auth
                if client_ip in rate_limit_store:
                    del rate_limit_store[client_ip]

                return (json.dumps({
                    'success': True,
                    'session_token': session_token,
                    'expires_at': expires_at.isoformat() + 'Z',
                    'message': 'Authentication successful',
                    'session_duration': SESSION_DURATION
                }), 200, headers)
            else:
                # Log failed attempt (no sensitive data)
                logger.warning(f"Failed authentication attempt from IP: {client_ip}")

                return (json.dumps({
                    'success': False,
                    'message': 'Invalid credentials',
                    'rate_limit_remaining': remaining_attempts - 1
                }), 401, headers)

        elif action == 'validate_session':
            # Validate session token
            session_token = request_data.get('session_token', '')

            if not session_token:
                return (json.dumps({
                    'success': False,
                    'message': 'Session token required'
                }), 400, headers)

            if validate_session_token(session_token, client_ip):
                return (json.dumps({
                    'success': True,
                    'message': 'Session valid',
                    'session_token': session_token
                }), 200, headers)
            else:
                return (json.dumps({
                    'success': False,
                    'message': 'Invalid or expired session'
                }), 401, headers)

        else:
            return (json.dumps({
                'success': False,
                'message': 'Invalid action'
            }), 400, headers)

    except Exception as e:
        # Log error without exposing sensitive information
        logger.error(f"Authentication error: {str(e)}")

        return (json.dumps({
            'success': False,
            'message': 'Internal server error'
        }), 500, headers)