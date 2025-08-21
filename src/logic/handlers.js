import { store } from '../state/store.js';
import { validateForm, showValidationErrors } from './validate.js';
import { predictComaIch, predictLimitedIch, predictFullStroke, APIError } from '../api/client.js';
import { t } from '../localization/i18n.js';

export function handleTriage1(isComatose) {
  store.logEvent('triage1_answer', { comatose: isComatose });
  const nextScreen = isComatose ? 'coma' : 'triage2';
  navigate(nextScreen);
}

export function handleTriage2(isExaminable) {
  store.logEvent('triage2_answer', { examinable: isExaminable });
  const nextScreen = isExaminable ? 'full' : 'limited';
  navigate(nextScreen);
}

export function navigate(screen) {
  store.logEvent('navigate', { 
    from: store.getState().currentScreen, 
    to: screen 
  });
  store.navigate(screen);
  window.scrollTo(0, 0);
}

export function reset() {
  if (store.hasUnsavedData()) {
    if (!confirm('Are you sure you want to start over? All entered data will be lost.')) {
      return;
    }
  }
  store.logEvent('reset');
  store.reset();
}

export function goBack() {
  const success = store.goBack();
  if (success) {
    store.logEvent('navigate_back');
    window.scrollTo(0, 0);
  }
}

export function goHome() {
  store.logEvent('navigate_home');
  store.goHome();
  window.scrollTo(0, 0);
}

export async function handleSubmit(e, container) {
  e.preventDefault();
  const form = e.target;
  const module = form.dataset.module;

  // Validate form
  const validation = validateForm(form);
  if (!validation.isValid) {
    showValidationErrors(container, validation.validationErrors);
    return;
  }

  // Collect inputs
  const formData = new FormData(form);
  const inputs = {};
  formData.forEach((value, key) => {
    const element = form.elements[key];
    if (element && element.type === 'checkbox') {
      inputs[key] = element.checked;
    } else {
      const n = parseFloat(value);
      inputs[key] = isNaN(n) ? value : n;
    }
  });

  // Store form data
  store.setFormData(module, inputs);

  // Show loading state
  const button = form.querySelector('button[type=submit]');
  const originalContent = button ? button.innerHTML : '';
  if (button) {
    button.disabled = true;
    button.innerHTML = `<span class="loading-spinner"></span> ${t('analyzing')}`;
  }

  try {
    // Run models based on module
    let results;
    
    switch (module) {
      case 'coma':
        const comaResult = await predictComaIch(inputs);
        results = {
          ich: comaResult,
          lvo: null
        };
        break;
        
      case 'limited':
        const limitedResult = await predictLimitedIch(inputs);
        results = {
          ich: limitedResult,
          lvo: { notPossible: true }
        };
        break;
        
      case 'full':
        results = await predictFullStroke(inputs);
        break;
        
      default:
        throw new Error('Unknown module: ' + module);
    }

    store.setResults(results);
    store.logEvent('models_complete', { module, results });
    navigate('results');
    
  } catch (error) {
    console.error('Error running models:', error);
    
    let errorMessage = 'An error occurred during analysis. Please try again.';
    if (error instanceof APIError) {
      errorMessage = error.message;
    }
    
    showError(container, errorMessage);
    
    if (button) {
      button.disabled = false;
      button.innerHTML = originalContent;
    }
  }
}

function showError(container, message) {
  // Remove existing error alerts
  container.querySelectorAll('.critical-alert').forEach(alert => {
    if (alert.querySelector('h4')?.textContent?.includes('Error')) {
      alert.remove();
    }
  });

  const alert = document.createElement('div');
  alert.className = 'critical-alert';
  alert.innerHTML = `<h4><span class="alert-icon">⚠️</span> Error</h4><p>${message}</p>`;
  
  const containerDiv = container.querySelector('.container');
  if (containerDiv) {
    containerDiv.prepend(alert);
  } else {
    container.prepend(alert);
  }
  
  setTimeout(() => alert.remove(), 10000);
}