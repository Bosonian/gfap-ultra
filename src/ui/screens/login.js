/**
 * Login Screen for Research Preview Access
 * iGFAP Stroke Triage Assistant
 */

import { t } from '../../localization/i18n.js';
import { authManager } from '../../auth/authentication.js';
import { store } from '../../state/store.js';

export function renderLoginScreen() {
  return `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="app-logo">
            <div class="logo-icon">🧠</div>
            <h1>iGFAP Stroke Triage</h1>
            <div class="version-badge">Research Preview v2.1</div>
          </div>
        </div>

        <div class="login-content">
          <div class="access-notice">
            <h2>🔬 Research Access Required</h2>
            <p>This is a research preview of the iGFAP Stroke Triage Assistant for clinical validation.</p>

            <div class="research-disclaimer">
              <h3>⚠️ Important Notice</h3>
              <ul>
                <li><strong>Research Use Only</strong> - Not for clinical decision making</li>
                <li><strong>No Patient Data Storage</strong> - All data processed locally</li>
                <li><strong>Clinical Advisory</strong> - Under supervision of Prof. Christian Förch & Dr. Lovepreet Kalra</li>
                <li><strong>Contact:</strong> Deepak Bos (bosdeepak@gmail.com)</li>
              </ul>
            </div>
          </div>

          <form id="loginForm" class="login-form">
            <div class="form-group">
              <label for="researchPassword">Research Access Code</label>
              <input
                type="password"
                id="researchPassword"
                name="password"
                required
                autocomplete="off"
                placeholder="Enter research access code"
                class="password-input"
              >
            </div>

            <div id="loginError" class="error-message" style="display: none;"></div>

            <button type="submit" class="login-button primary">
              <span class="button-text">Access Research System</span>
              <span class="loading-spinner" style="display: none;">⏳</span>
            </button>
          </form>

          <div class="login-footer">
            <div class="regulatory-notice">
              <p><strong>Regulatory Status:</strong> Research prototype - CE certification pending</p>
              <p><strong>Data Protection:</strong> GDPR compliant - local processing only</p>
              <p><strong>Clinical Oversight:</strong> RKH Klinikum Ludwigsburg, Neurologie</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initializeLoginScreen() {
  const loginForm = document.getElementById('loginForm');

  if (!loginForm) {
    return;
  }

  const passwordInput = document.getElementById('researchPassword');
  const loginError = document.getElementById('loginError');
  const loginButton = loginForm.querySelector('.login-button');

  // Focus password input on load
  passwordInput.focus();

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = passwordInput.value.trim();

    if (!password) {
      showLoginError('Please enter the research access code');
      return;
    }

    // Show loading state
    setLoginLoading(true);
    hideLoginError();

    try {
      const authResult = await authManager.authenticate(password);

      if (authResult.success) {
        // Log successful authentication
        store.logEvent('auth_success', {
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent.substring(0, 100), // Limited info
        });

        // Navigate to main application
        store.navigate('triage1');
      } else {
        // Handle authentication failure
        let errorMessage = authResult.message;

        showLoginError(errorMessage);
        passwordInput.value = '';
        passwordInput.focus();

        // Log failed attempt (no sensitive data)
        store.logEvent('auth_failed', {
          timestamp: new Date().toISOString(),
          errorCode: authResult.errorCode,
        });
      }
    } catch (error) {
      showLoginError('Authentication system error. Please try again.');
      // Remove // for production
    } finally {
      setLoginLoading(false);
    }
  });

  // Hide error on input
  passwordInput.addEventListener('input', () => {
    hideLoginError();
  });

  function showLoginError(message) {
    loginError.textContent = message;
    loginError.style.display = 'block';
    passwordInput.classList.add('error');
  }

  function hideLoginError() {
    loginError.style.display = 'none';
    passwordInput.classList.remove('error');
  }

  function setLoginLoading(isLoading) {
    const buttonText = loginButton.querySelector('.button-text');
    const loadingSpinner = loginButton.querySelector('.loading-spinner');

    if (isLoading) {
      buttonText.style.display = 'none';
      loadingSpinner.style.display = 'inline';
      loginButton.disabled = true;
    } else {
      buttonText.style.display = 'inline';
      loadingSpinner.style.display = 'none';
      loginButton.disabled = false;
    }
  }
}
