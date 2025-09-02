import { t, i18n } from '../../localization/i18n.js';
import { navigate } from '../../logic/handlers.js';

/**
 * Prerequisites checklist items
 */
const getPrerequisites = () => {
  return [
    { id: 'acute_deficit', checked: false },
    { id: 'symptom_onset', checked: false },
    { id: 'no_preexisting', checked: false },
    { id: 'no_trauma', checked: false }
  ];
};

/**
 * Render prerequisites modal
 * @returns {string} HTML for prerequisites modal
 */
export function renderPrerequisitesModal() {
  const prerequisites = getPrerequisites();
  
  return `
    <div id="prerequisitesModal" class="modal prerequisites-modal" style="display: flex;">
      <div class="modal-content prerequisites-content">
        <div class="modal-header">
          <h2>${t('prerequisitesTitle')}</h2>
          <button class="modal-close" id="closePrerequisites">&times;</button>
        </div>
        
        <div class="modal-body">
          <p class="prerequisites-intro">
            ${t('prerequisitesIntro')}
          </p>
          
          <div class="prerequisites-list">
            ${prerequisites.map(item => `
              <div class="prerequisite-item" data-id="${item.id}">
                <label class="toggle-switch">
                  <input type="checkbox" id="${item.id}" class="toggle-input">
                  <span class="toggle-slider"></span>
                </label>
                <span class="prerequisite-label">
                  ${t(item.id)}
                </span>
              </div>
            `).join('')}
          </div>
          
          <div class="prerequisites-warning" id="prerequisitesWarning" style="display: none;">
            <span class="warning-icon">⚠️</span>
            <span class="warning-text">
              ${t('prerequisitesWarning')}
            </span>
          </div>
        </div>
        
        <div class="modal-footer">
          <div class="button-group">
            <button type="button" class="secondary" id="cancelPrerequisites">
              ${t('cancel')}
            </button>
            <button type="button" class="primary" id="confirmPrerequisites">
              ${t('continue')}
            </button>
          </div>
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
  if (!modal) {
    console.error('Prerequisites modal not found');
    return;
  }
  
  console.log('Initializing prerequisites modal');
  
  // Close button handlers
  const closeBtn = document.getElementById('closePrerequisites');
  const cancelBtn = document.getElementById('cancelPrerequisites');
  const confirmBtn = document.getElementById('confirmPrerequisites');
  
  console.log('Modal buttons found:', { closeBtn: !!closeBtn, cancelBtn: !!cancelBtn, confirmBtn: !!confirmBtn });
  
  const closeModal = () => {
    modal.remove();
    // Navigate back to welcome screen if cancelled
    navigate('welcome');
  };
  
  closeBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', closeModal);
  
  // Confirm button handler
  confirmBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Prerequisites confirm button clicked');
    const checkboxes = modal.querySelectorAll('.toggle-input');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    console.log('All prerequisites checked:', allChecked);
    
    if (allChecked) {
      console.log('Navigating to triage2');
      modal.remove();
      // Proceed to triage2 (stroke module selection)
      navigate('triage2');
    } else {
      console.log('Showing prerequisites warning');
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
  
  // Always remove existing modal and create fresh one to handle language changes
  if (existingModal) {
    existingModal.remove();
  }
  
  // Create modal element directly instead of innerHTML
  const modalElement = document.createElement('div');
  modalElement.innerHTML = renderPrerequisitesModal();
  const modal = modalElement.firstElementChild;
  
  // Insert into DOM
  document.body.appendChild(modal);
  
  // Initialize immediately since DOM is ready
  initPrerequisitesModal();
}