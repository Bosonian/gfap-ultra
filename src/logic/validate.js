import { VALIDATION_RULES } from '../config.js';

export function validateInput(name, value, rules, formData = null) {
  const result = {
    errors: [],
    warnings: [],
  };

  if (rules.required && !value && value !== 0) {
    result.errors.push('This field is required');
  }

  if (rules.min !== undefined && value !== '' && !isNaN(value) && parseFloat(value) < rules.min) {
    result.errors.push(`Value must be at least ${rules.min}`);
  }

  if (rules.max !== undefined && value !== '' && !isNaN(value) && parseFloat(value) > rules.max) {
    result.errors.push(`Value must be at most ${rules.max}`);
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    result.errors.push('Invalid format');
  }

  // Medical validation checks (warnings, not blocking errors)
  if (rules.medicalCheck && value !== '' && !isNaN(value)) {
    const medicalWarning = rules.medicalCheck(parseFloat(value), formData);
    if (medicalWarning) {
      result.warnings.push(medicalWarning);
    }
  }

  // For backward compatibility, return just errors array if no warnings
  if (result.warnings.length === 0) {
    return result.errors;
  }

  return result;
}

export function validateForm(form) {
  let isValid = true;
  const validationErrors = {};

  // Collect form data for medical checks
  const formData = {};
  Object.keys(VALIDATION_RULES).forEach((name) => {
    const input = form.elements[name];
    if (input) {
      formData[name] = input.value;
    }
  });

  const validationWarnings = {};

  Object.entries(VALIDATION_RULES).forEach(([name, rules]) => {
    const input = form.elements[name];
    if (input) {
      const validation = validateInput(name, input.value, rules, formData);

      // Handle both old format (array) and new format (object)
      if (Array.isArray(validation)) {
        // Old format - just errors
        if (validation.length > 0) {
          validationErrors[name] = validation;
          isValid = false;
        }
      } else {
        // New format - errors and warnings
        if (validation.errors.length > 0) {
          validationErrors[name] = validation.errors;
          isValid = false;
        }
        if (validation.warnings.length > 0) {
          validationWarnings[name] = validation.warnings;
        }
      }
    }
  });

  return { isValid, validationErrors, validationWarnings };
}

export function showValidationErrors(container, validationErrors) {
  Object.entries(validationErrors).forEach(([name, errors]) => {
    const input = container.querySelector(`[name="${name}"]`);
    if (input) {
      const group = input.closest('.input-group');
      if (group) {
        group.classList.add('error');
        // Remove existing error messages
        group.querySelectorAll('.error-message').forEach((el) => el.remove());
        // Add new error message safely without innerHTML
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';

        const iconSpan = document.createElement('span');
        iconSpan.className = 'error-icon';
        iconSpan.textContent = '⚠️';

        errorDiv.appendChild(iconSpan);
        errorDiv.appendChild(document.createTextNode(` ${errors[0]}`));
        group.appendChild(errorDiv);
      }
    }
  });
}

export function showValidationWarnings(container, validationWarnings) {
  Object.entries(validationWarnings).forEach(([name, warnings]) => {
    const input = container.querySelector(`[name="${name}"]`);
    if (input) {
      const group = input.closest('.input-group');
      if (group) {
        group.classList.add('warning');
        // Remove existing warning messages
        group.querySelectorAll('.warning-message').forEach((el) => el.remove());
        // Add new warning message safely without innerHTML
        const warningDiv = document.createElement('div');
        warningDiv.className = 'warning-message';

        const iconSpan = document.createElement('span');
        iconSpan.className = 'warning-icon';
        iconSpan.textContent = '💡';

        warningDiv.appendChild(iconSpan);
        warningDiv.appendChild(document.createTextNode(` ${warnings[0]}`));
        group.appendChild(warningDiv);
      }
    }
  });
}

export function clearValidationErrors(container) {
  container.querySelectorAll('.input-group.error').forEach((group) => {
    group.classList.remove('error');
    group.querySelectorAll('.error-message').forEach((el) => el.remove());
  });
}

export function clearValidationWarnings(container) {
  container.querySelectorAll('.input-group.warning').forEach((group) => {
    group.classList.remove('warning');
    group.querySelectorAll('.warning-message').forEach((el) => el.remove());
  });
}

export function clearAllValidation(container) {
  clearValidationErrors(container);
  clearValidationWarnings(container);
}
