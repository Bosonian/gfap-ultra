import { VALIDATION_RULES } from '../config.js';

export function validateInput(name, value, rules) {
  const errors = [];
  
  if (rules.required && !value && value !== 0) {
    errors.push('This field is required');
  }
  
  if (rules.min !== undefined && value !== '' && !isNaN(value) && parseFloat(value) < rules.min) {
    errors.push(`Value must be at least ${rules.min}`);
  }
  
  if (rules.max !== undefined && value !== '' && !isNaN(value) && parseFloat(value) > rules.max) {
    errors.push(`Value must be at most ${rules.max}`);
  }
  
  if (rules.pattern && !rules.pattern.test(value)) {
    errors.push('Invalid format');
  }
  
  return errors;
}

export function validateForm(form) {
  let isValid = true;
  const validationErrors = {};

  Object.entries(VALIDATION_RULES).forEach(([name, rules]) => {
    const input = form.elements[name];
    if (input) {
      const errors = validateInput(name, input.value, rules);
      if (errors.length > 0) {
        validationErrors[name] = errors;
        isValid = false;
      }
    }
  });
  
  return { isValid, validationErrors };
}

export function showValidationErrors(container, validationErrors) {
  Object.entries(validationErrors).forEach(([name, errors]) => {
    const input = container.querySelector(`[name="${name}"]`);
    if (input) {
      const group = input.closest('.input-group');
      if (group) {
        group.classList.add('error');
        // Remove existing error messages
        group.querySelectorAll('.error-message').forEach(el => el.remove());
        // Add new error message safely without innerHTML
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';

        const iconSpan = document.createElement('span');
        iconSpan.className = 'error-icon';
        iconSpan.textContent = '⚠️';

        errorDiv.appendChild(iconSpan);
        errorDiv.appendChild(document.createTextNode(' ' + errors[0]));
        group.appendChild(errorDiv);
      }
    }
  });
}

export function clearValidationErrors(container) {
  container.querySelectorAll('.input-group.error').forEach(group => {
    group.classList.remove('error');
    group.querySelectorAll('.error-message').forEach(el => el.remove());
  });
}