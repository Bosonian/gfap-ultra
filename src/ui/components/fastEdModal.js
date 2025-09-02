import { t } from '../../localization/i18n.js';

export class FastEdCalculator {
  constructor() {
    this.scores = {
      facial_palsy: 0,
      arm_weakness: 0,
      speech_changes: 0,
      eye_deviation: 0,
      denial_neglect: 0
    };
    this.onApply = null;
    this.modal = null;
  }

  getTotal() {
    return Object.values(this.scores).reduce((sum, score) => sum + score, 0);
  }

  getRiskLevel() {
    const total = this.getTotal();
    return total >= 4 ? 'high' : 'low';
  }

  render() {
    const total = this.getTotal();
    const riskLevel = this.getRiskLevel();
    
    return `
      <div id="fastEdModal" class="modal" role="dialog" aria-labelledby="fastEdModalTitle" aria-hidden="true" style="display: none !important;">
        <div class="modal-content fast-ed-modal">
          <div class="modal-header">
            <h2 id="fastEdModalTitle">${t('fastEdCalculatorTitle')}</h2>
            <button class="modal-close" aria-label="Close">&times;</button>
          </div>
          <div class="modal-body">
            
            <!-- Facial Palsy -->
            <div class="fast-ed-component">
              <h3>${t('facialPalsyTitle')}</h3>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="facial_palsy" value="0" ${this.scores.facial_palsy === 0 ? 'checked' : ''}>
                  <span class="radio-label">${t('facialPalsyNormal')}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="facial_palsy" value="1" ${this.scores.facial_palsy === 1 ? 'checked' : ''}>
                  <span class="radio-label">${t('facialPalsyMild')}</span>
                </label>
              </div>
            </div>

            <!-- Arm Weakness -->
            <div class="fast-ed-component">
              <h3>${t('armWeaknessTitle')}</h3>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="arm_weakness" value="0" ${this.scores.arm_weakness === 0 ? 'checked' : ''}>
                  <span class="radio-label">${t('armWeaknessNormal')}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="arm_weakness" value="1" ${this.scores.arm_weakness === 1 ? 'checked' : ''}>
                  <span class="radio-label">${t('armWeaknessMild')}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="arm_weakness" value="2" ${this.scores.arm_weakness === 2 ? 'checked' : ''}>
                  <span class="radio-label">${t('armWeaknessSevere')}</span>
                </label>
              </div>
            </div>

            <!-- Speech Changes -->
            <div class="fast-ed-component">
              <h3>${t('speechChangesTitle')}</h3>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="speech_changes" value="0" ${this.scores.speech_changes === 0 ? 'checked' : ''}>
                  <span class="radio-label">${t('speechChangesNormal')}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="speech_changes" value="1" ${this.scores.speech_changes === 1 ? 'checked' : ''}>
                  <span class="radio-label">${t('speechChangesMild')}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="speech_changes" value="2" ${this.scores.speech_changes === 2 ? 'checked' : ''}>
                  <span class="radio-label">${t('speechChangesSevere')}</span>
                </label>
              </div>
            </div>

            <!-- Eye Deviation -->
            <div class="fast-ed-component">
              <h3>${t('eyeDeviationTitle')}</h3>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="eye_deviation" value="0" ${this.scores.eye_deviation === 0 ? 'checked' : ''}>
                  <span class="radio-label">${t('eyeDeviationNormal')}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="eye_deviation" value="1" ${this.scores.eye_deviation === 1 ? 'checked' : ''}>
                  <span class="radio-label">${t('eyeDeviationPartial')}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="eye_deviation" value="2" ${this.scores.eye_deviation === 2 ? 'checked' : ''}>
                  <span class="radio-label">${t('eyeDeviationForced')}</span>
                </label>
              </div>
            </div>

            <!-- Denial/Neglect -->
            <div class="fast-ed-component">
              <h3>${t('denialNeglectTitle')}</h3>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="denial_neglect" value="0" ${this.scores.denial_neglect === 0 ? 'checked' : ''}>
                  <span class="radio-label">${t('denialNeglectNormal')}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="denial_neglect" value="1" ${this.scores.denial_neglect === 1 ? 'checked' : ''}>
                  <span class="radio-label">${t('denialNeglectPartial')}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="denial_neglect" value="2" ${this.scores.denial_neglect === 2 ? 'checked' : ''}>
                  <span class="radio-label">${t('denialNeglectComplete')}</span>
                </label>
              </div>
            </div>

            <!-- Total Score Display -->
            <div class="fast-ed-total">
              <div class="score-display">
                <h3>${t('totalScoreTitle')}: <span class="total-score">${total}/9</span></h3>
                <div class="risk-indicator ${riskLevel}">
                  ${t('riskLevel')}: ${riskLevel === 'high' ? t('riskLevelHigh') : t('riskLevelLow')}
                </div>
              </div>
            </div>

          </div>
          <div class="modal-footer">
            <div class="button-group">
              <button class="secondary" data-action="cancel-fast-ed">${t('cancel')}</button>
              <button class="primary" data-action="apply-fast-ed">${t('applyScore')}</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    this.modal = document.getElementById('fastEdModal');
    if (!this.modal) return;

    // Radio button changes
    this.modal.addEventListener('change', (e) => {
      if (e.target.type === 'radio') {
        const component = e.target.name;
        const value = parseInt(e.target.value);
        this.scores[component] = value;
        this.updateDisplay();
      }
    });

    // Close button
    const closeBtn = this.modal.querySelector('.modal-close');
    closeBtn?.addEventListener('click', () => this.close());

    // Cancel button
    const cancelBtn = this.modal.querySelector('[data-action="cancel-fast-ed"]');
    cancelBtn?.addEventListener('click', () => this.close());

    // Apply button
    const applyBtn = this.modal.querySelector('[data-action="apply-fast-ed"]');
    applyBtn?.addEventListener('click', () => this.apply());

    // Disable backdrop click-to-close to prevent accidental dismissal
    // Users must explicitly Cancel or Apply
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal?.classList.contains('show')) {
        this.close();
      }
    });
  }

  updateDisplay() {
    const totalElement = this.modal?.querySelector('.total-score');
    const riskElement = this.modal?.querySelector('.risk-indicator');
    
    if (totalElement) {
      totalElement.textContent = `${this.getTotal()}/9`;
    }
    
    if (riskElement) {
      const riskLevel = this.getRiskLevel();
      riskElement.className = `risk-indicator ${riskLevel}`;
      riskElement.textContent = `${t('riskLevel')}: ${riskLevel === 'high' ? t('riskLevelHigh') : t('riskLevelLow')}`;
    }
  }

  show(currentScore = 0, onApplyCallback = null) {
    this.onApply = onApplyCallback;
    
    // If we have a current score, try to reverse engineer it (basic approximation)
    if (currentScore > 0 && currentScore <= 9) {
      this.approximateFromTotal(currentScore);
    }
    
    // Inject modal HTML if not already present
    if (!document.getElementById('fastEdModal')) {
      document.body.insertAdjacentHTML('beforeend', this.render());
    } else {
      // Re-render the modal with current state
      this.modal.remove();
      document.body.insertAdjacentHTML('beforeend', this.render());
      this.modal = document.getElementById('fastEdModal');
    }
    
    this.setupEventListeners();
    
    this.modal.setAttribute('aria-hidden', 'false');
    this.modal.style.display = 'flex';
    this.modal.classList.add('show');
    
    // Focus first radio button
    const firstRadio = this.modal.querySelector('input[type="radio"]');
    firstRadio?.focus();
  }

  close() {
    if (this.modal) {
      this.modal.classList.remove('show');
      this.modal.style.display = 'none';
      this.modal.setAttribute('aria-hidden', 'true');
    }
  }

  apply() {
    const total = this.getTotal();
    const armWeaknessBoolean = this.scores.arm_weakness > 0;
    const eyeDeviationBoolean = this.scores.eye_deviation > 0;
    
    if (this.onApply) {
      this.onApply({
        total,
        components: { ...this.scores },
        armWeaknessBoolean,
        eyeDeviationBoolean
      });
    }
    
    this.close();
  }

  approximateFromTotal(total) {
    // Simple approximation - distribute points across components
    // This is basic but gives users a starting point
    this.scores = {
      facial_palsy: 0,
      arm_weakness: 0,
      speech_changes: 0,
      eye_deviation: 0,
      denial_neglect: 0
    };
    
    let remaining = total;
    const components = Object.keys(this.scores);
    
    for (const component of components) {
      if (remaining <= 0) break;
      
      const maxForComponent = (component === 'facial_palsy') ? 1 : 2;
      const assignToThis = Math.min(remaining, maxForComponent);
      this.scores[component] = assignToThis;
      remaining -= assignToThis;
    }
  }
}

// Create singleton instance
export const fastEdCalculator = new FastEdCalculator();
