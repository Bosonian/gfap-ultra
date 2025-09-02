import { t, i18n } from '../../localization/i18n.js';
import { navigate } from '../../logic/handlers.js';

/**
 * Prerequisites checklist items
 */
const getPrerequisites = () => {
  const isDE = i18n.getCurrentLanguage() === 'de';
  
  return [
    {
      id: 'acute_deficit',
      labelDE: 'Akutes (schweres) neurologisches Defizit vorhanden',
      labelEN: 'Acute (severe) neurological deficit present',
      checked: false
    },
    {
      id: 'symptom_onset',
      labelDE: 'Symptombeginn innerhalb 6h',
      labelEN: 'Symptom onset within 6 hours',
      checked: false
    },
    {
      id: 'no_preexisting',
      labelDE: 'Keine vorbestehende schwere neurologische Defizite',
      labelEN: 'No pre-existing severe neurological deficits',
      checked: false
    },
    {
      id: 'no_trauma',
      labelDE: 'Kein Schädelhirntrauma vorhanden',
      labelEN: 'No traumatic brain injury present',
      checked: false
    }
  ];
};

/**
 * Render prerequisites modal
 * @returns {string} HTML for prerequisites modal
 */
export function renderPrerequisitesModal() {
  const isDE = i18n.getCurrentLanguage() === 'de';
  const prerequisites = getPrerequisites();
  
  return `
    <div id="prerequisitesModal" class="modal prerequisites-modal" style="display: flex;">
      <div class="modal-content prerequisites-content">
        <div class="modal-header">
          <h2>${isDE ? 'Voraussetzungen für Schlaganfall-Triage' : 'Prerequisites for Stroke Triage'}</h2>
          <button class="modal-close" id="closePrerequisites">&times;</button>
        </div>
        
        <div class="modal-body">
          <p class="prerequisites-intro">
            ${isDE ? 
              'Bitte bestätigen Sie, dass alle folgenden Voraussetzungen erfüllt sind:' : 
              'Please confirm that all of the following prerequisites are met:'
            }
          </p>
          
          <div class="prerequisites-list">
            ${prerequisites.map(item => `
              <div class="prerequisite-item" data-id="${item.id}">
                <label class="toggle-switch">
                  <input type="checkbox" id="${item.id}" class="toggle-input">
                  <span class="toggle-slider"></span>
                </label>
                <span class="prerequisite-label">
                  ${isDE ? item.labelDE : item.labelEN}
                </span>
              </div>
            `).join('')}
          </div>
          
          <div class="prerequisites-warning" id="prerequisitesWarning" style="display: none;">
            <span class="warning-icon">⚠️</span>
            <span class="warning-text">
              ${isDE ? 
                'Alle Voraussetzungen müssen erfüllt sein, um fortzufahren' : 
                'All prerequisites must be met to continue'
              }
            </span>
          </div>
        </div>
        
        <div class="modal-footer">
          <button type="button" class="secondary" id="cancelPrerequisites">
            ${isDE ? 'Abbrechen' : 'Cancel'}
          </button>
          <button type="button" class="primary" id="confirmPrerequisites">
            ${isDE ? 'Weiter' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Initialize prerequisites modal event handlers
 */
export function initPrerequisitesModal() {
  const modal = document.getElementById('prerequisitesModal');
  if (!modal) return;
  
  // Close button handlers
  const closeBtn = document.getElementById('closePrerequisites');
  const cancelBtn = document.getElementById('cancelPrerequisites');
  const confirmBtn = document.getElementById('confirmPrerequisites');
  
  const closeModal = () => {
    modal.style.display = 'none';
    // Navigate back to welcome screen if cancelled
    navigate('welcome');
  };
  
  closeBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', closeModal);
  
  // Confirm button handler
  confirmBtn?.addEventListener('click', () => {
    const checkboxes = modal.querySelectorAll('.toggle-input');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    
    if (allChecked) {
      modal.style.display = 'none';
      // Proceed to triage2 (stroke module selection)
      navigate('triage2');
    } else {
      // Show warning
      const warning = document.getElementById('prerequisitesWarning');
      if (warning) {
        warning.style.display = 'flex';
        // Shake animation
        warning.classList.add('shake');
        setTimeout(() => warning.classList.remove('shake'), 500);
      }
    }
  });
  
  // Toggle change handler to hide warning when all checked
  const checkboxes = modal.querySelectorAll('.toggle-input');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const allChecked = Array.from(checkboxes).every(cb => cb.checked);
      const warning = document.getElementById('prerequisitesWarning');
      
      if (allChecked && warning) {
        warning.style.display = 'none';
      }
    });
  });
}

/**
 * Show prerequisites modal
 */
export function showPrerequisitesModal() {
  const existingModal = document.getElementById('prerequisitesModal');
  
  if (!existingModal) {
    // Insert modal into DOM
    const modalHtml = renderPrerequisitesModal();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    initPrerequisitesModal();
  } else {
    // Reset checkboxes
    const checkboxes = existingModal.querySelectorAll('.toggle-input');
    checkboxes.forEach(cb => cb.checked = false);
    
    // Hide warning
    const warning = document.getElementById('prerequisitesWarning');
    if (warning) warning.style.display = 'none';
    
    // Show modal
    existingModal.style.display = 'flex';
  }
}