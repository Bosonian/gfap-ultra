import { store } from './state/store.js';
import { render } from './ui/render.js';
import { APP_CONFIG } from './config.js';
import { i18n, t } from './localization/i18n.js';
import { warmUpFunctions } from './api/client.js';
import { setResearchMode, isResearchModeEnabled } from './research/data-logger.js';
import { authManager } from './auth/authentication.js';

// Phase 3: Advanced offline capabilities
import { medicalSWManager } from './workers/sw-manager.js';
import { medicalPerformanceMonitor } from './performance/medical-performance-monitor.js';
import { medicalSyncManager } from './sync/medical-sync-manager.js';
import { lazyLoader, medicalComponentLoader } from './components/lazy-loader.js';

// Phase 4: Medical Intelligence & Analytics - TEMPORARILY DISABLED
// import { predictiveEngine } from './analytics/predictive-engine.js';
// import { clinicalDecisionSupport } from './analytics/clinical-decision-support.js';
// import { MedicalVisualizationDashboard } from './analytics/visualization-dashboard.js';
// import { mlModelIntegration } from './ml/model-integration.js';
// import { clinicalReportingSystem } from './analytics/clinical-reporting.js';
// import { qualityMetricsTracker } from './analytics/quality-metrics.js';
// import { clinicalAuditTrail } from './analytics/audit-trail.js';

class App {
  constructor() {
    this.container = null;
    this.unsubscribe = null;
  }

  async init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
      return;
    }

    this.container = document.getElementById('appContainer');
    if (!this.container) {
      console.error('App container not found');
      return;
    }

    // Check authentication before proceeding
    if (!authManager.isValidSession()) {
      store.navigate('login');
    }

    // Subscribe to store changes
    this.unsubscribe = store.subscribe(() => {
      render(this.container);
      // Update research button visibility after each render
      setTimeout(() => this.initializeResearchMode(), 200);
    });

    // Subscribe to language changes
    window.addEventListener('languageChanged', () => {
      this.updateUILanguage();
      render(this.container);
    });

    // Setup global event listeners
    this.setupGlobalEventListeners();

    // Initialize theme
    this.initializeTheme();

    // Initialize research mode
    this.initializeResearchMode();

    // Initialize language
    this.updateUILanguage();

    // Start auto-save
    this.startAutoSave();

    // Setup session timeout
    this.setupSessionTimeout();

    // Set current year in footer
    this.setCurrentYear();

    // Initialize Phase 3 advanced features - TEMPORARILY DISABLED
    await this.initializeAdvancedFeatures();

    // Warm up Cloud Functions in background
    warmUpFunctions();

    // Initial render
    render(this.container);
  }

  setupGlobalEventListeners() {
    // Navigation buttons
    const backButton = document.getElementById('backButton');
    if (backButton) {
      backButton.addEventListener('click', () => {
        store.goBack();
        render(this.container);
      });
    }

    const homeButton = document.getElementById('homeButton');
    if (homeButton) {
      homeButton.addEventListener('click', () => {
        store.goHome();
        render(this.container);
      });
    }

    // Language toggle
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
      languageToggle.addEventListener('click', () => this.toggleLanguage());
    }

    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
      darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
    }

    // Research mode toggle
    const researchModeToggle = document.getElementById('researchModeToggle');
    if (researchModeToggle) {
      researchModeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleResearchMode();
      });
    }

    // Help modal
    this.setupHelpModal();

    // Footer links
    this.setupFooterLinks();

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const helpModal = document.getElementById('helpModal');
        if (helpModal && helpModal.classList.contains('show')) {
          helpModal.classList.remove('show');
          helpModal.style.display = 'none';
          helpModal.setAttribute('aria-hidden', 'true');
        }
      }
    });

    // Before unload warning
    window.addEventListener('beforeunload', (e) => {
      if (store.hasUnsavedData()) {
        e.preventDefault();
        e.returnValue = 'You have unsaved data. Are you sure you want to leave?';
      }
    });
  }

  setupHelpModal() {
    const helpButton = document.getElementById('helpButton');
    const helpModal = document.getElementById('helpModal');
    const modalClose = helpModal?.querySelector('.modal-close');

    if (helpButton && helpModal) {
      // Ensure modal starts hidden
      helpModal.classList.remove('show');
      helpModal.style.display = 'none';
      helpModal.setAttribute('aria-hidden', 'true');

      helpButton.addEventListener('click', () => {
        helpModal.style.display = 'flex';
        helpModal.classList.add('show');
        helpModal.setAttribute('aria-hidden', 'false');
      });

      const closeModal = () => {
        helpModal.classList.remove('show');
        helpModal.style.display = 'none';
        helpModal.setAttribute('aria-hidden', 'true');
      };

      modalClose?.addEventListener('click', closeModal);

      helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) {
          closeModal();
        }
      });
    }
  }

  setupFooterLinks() {
    document.getElementById('privacyLink')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showPrivacyPolicy();
    });

    document.getElementById('disclaimerLink')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showDisclaimer();
    });
  }

  initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const darkModeToggle = document.getElementById('darkModeToggle');

    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.body.classList.add('dark-mode');
      if (darkModeToggle) {
        darkModeToggle.textContent = '☀️';
      }
    }
  }

  toggleLanguage() {
    i18n.toggleLanguage();
    this.updateUILanguage();

    // Update flag icon
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
      const currentLang = i18n.getCurrentLanguage();
      languageToggle.textContent = currentLang === 'en' ? '🇬🇧' : '🇩🇪';
      languageToggle.dataset.lang = currentLang;
    }
  }

  updateUILanguage() {
    // Update HTML lang attribute
    document.documentElement.lang = i18n.getCurrentLanguage();

    // Update header text
    const headerTitle = document.querySelector('.app-header h1');
    if (headerTitle) {
      headerTitle.textContent = t('appTitle');
    }

    const emergencyBadge = document.querySelector('.emergency-badge');
    if (emergencyBadge) {
      emergencyBadge.textContent = t('emergencyBadge');
    }

    // Update button tooltips
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
      languageToggle.title = t('languageToggle');
      languageToggle.setAttribute('aria-label', t('languageToggle'));
    }

    const helpButton = document.getElementById('helpButton');
    if (helpButton) {
      helpButton.title = t('helpButton');
      helpButton.setAttribute('aria-label', t('helpButton'));
    }

    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
      darkModeToggle.title = t('darkModeButton');
      darkModeToggle.setAttribute('aria-label', t('darkModeButton'));
    }

    // Update help modal
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) {
      modalTitle.textContent = t('helpTitle');
    }

    // Note: Stroke center map initialization is handled in render.js
  }

  toggleDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');

    if (darkModeToggle) {
      darkModeToggle.textContent = isDark ? '☀️' : '🌙';
    }

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  initializeResearchMode() {
    const researchModeToggle = document.getElementById('researchModeToggle');
    if (researchModeToggle) {
      // Check if we're on results screen with stroke module
      const currentModule = this.getCurrentModuleFromResults();
      const shouldShow = currentModule === 'limited' || currentModule === 'full';

      researchModeToggle.style.display = shouldShow ? 'flex' : 'none';
      researchModeToggle.style.opacity = shouldShow ? '1' : '0.5';
    }
  }

  getCurrentModuleFromResults() {
    const state = store.getState();
    if (state.currentScreen !== 'results' || !state.results?.ich?.module) {
      return null;
    }

    const module = state.results.ich.module.toLowerCase();
    if (module.includes('coma')) {
      return 'coma';
    }
    if (module.includes('limited')) {
      return 'limited';
    }
    if (module.includes('full')) {
      return 'full';
    }
    return null;
  }

  toggleResearchMode() {
    // Simply toggle the research panel visibility without affecting app state
    const researchPanel = document.getElementById('researchPanel');
    if (!researchPanel) {
      console.warn('🔬 Research panel not found - likely not on results screen');
      return;
    }

    const isVisible = researchPanel.style.display !== 'none';
    researchPanel.style.display = isVisible ? 'none' : 'block';

    // Update button visual state
    const researchModeToggle = document.getElementById('researchModeToggle');
    if (researchModeToggle) {
      researchModeToggle.style.background = isVisible
        ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 102, 204, 0.2)';
    }

    // DO NOT trigger any navigation or state changes
    return false;
  }

  showResearchActivationMessage() {
    const message = document.createElement('div');
    message.className = 'research-activation-toast';
    message.innerHTML = `
      <div class="toast-content">
        🔬 <strong>Research Mode Activated</strong><br>
        <small>Model comparison features enabled</small>
      </div>
    `;

    document.body.appendChild(message);

    setTimeout(() => {
      if (document.body.contains(message)) {
        document.body.removeChild(message);
      }
    }, 3000);
  }

  startAutoSave() {
    setInterval(() => {
      this.saveCurrentFormData();
    }, APP_CONFIG.autoSaveInterval);
  }

  saveCurrentFormData() {
    const forms = this.container.querySelectorAll('form[data-module]');
    forms.forEach((form) => {
      const formData = new FormData(form);
      const { module } = form.dataset;
      if (module) {
        const data = {};
        formData.forEach((value, key) => {
          const element = form.elements[key];
          if (element && element.type === 'checkbox') {
            data[key] = element.checked;
          } else {
            data[key] = value;
          }
        });

        // Only save if data has actually changed to prevent unnecessary re-renders
        const currentData = store.getFormData(module);
        const hasChanges = JSON.stringify(currentData) !== JSON.stringify(data);
        if (hasChanges) {
          store.setFormData(module, data);
        }
      }
    });
  }

  setupSessionTimeout() {
    setTimeout(() => {
      if (confirm('Your session has been idle for 30 minutes. Would you like to continue?')) {
        this.setupSessionTimeout();
      } else {
        store.reset();
      }
    }, APP_CONFIG.sessionTimeout);
  }

  setCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  showPrivacyPolicy() {
    alert('Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.');
  }

  showDisclaimer() {
    alert('Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.');
  }

  /**
   * Initialize Phase 3 & 4 Advanced Features
   */
  async initializeAdvancedFeatures() {
    console.log('🚀 Initializing Phase 3 Advanced Features...');

    try {
      // Phase 3: Advanced offline capabilities
      // Start performance monitoring
      medicalPerformanceMonitor.start();

      // Initialize advanced service worker
      const swInitialized = await medicalSWManager.initialize();

      if (swInitialized) {
        console.log('✅ Advanced offline capabilities enabled');

        // Prefetch critical medical resources
        await this.prefetchCriticalResources();
      }

      // Initialize real-time data synchronization
      const syncInitialized = await medicalSyncManager.initialize();
      if (syncInitialized) {
        console.log('✅ Real-time synchronization enabled');
      }

      // Initialize progressive component loading
      await this.initializeProgressiveLoading();

      console.log('🎯 Phase 3 features initialized successfully');

      // Phase 4: Medical Intelligence & Analytics - STILL DISABLED
      // await this.initializeMedicalIntelligence();

    } catch (error) {
      console.error('❌ Phase 3 features initialization failed:', error);
    }
  }

  /**
   * Initialize progressive component loading
   */
  async initializeProgressiveLoading() {
    // Preload critical components immediately
    await lazyLoader.preload('critical');
    console.log('⚡ Critical components preloaded');

    // Setup viewport-based loading for result visualizations
    const setupViewportLoading = () => {
      const brainVizElements = document.querySelectorAll('.brain-visualization-placeholder');
      brainVizElements.forEach(element => {
        lazyLoader.observeElement(element, 'brain-visualization');
      });

      const mapElements = document.querySelectorAll('.stroke-center-map-placeholder');
      mapElements.forEach(element => {
        lazyLoader.observeElement(element, 'stroke-center-map');
      });
    };

    // Setup after initial render
    setTimeout(setupViewportLoading, 100);

    console.log('🔄 Progressive loading initialized');
  }

  /**
   * Prefetch critical resources for offline use
   */
  async prefetchCriticalResources() {
    const criticalResources = [
      '/0825/src/logic/lvo-local-model.js',
      '/0825/src/logic/ich-volume-calculator.js',
      '/0825/src/patterns/prediction-strategy.js',
      '/0825/src/performance/medical-cache.js'
    ];

    await medicalSWManager.prefetchResources(criticalResources);
    console.log('📦 Critical medical resources prefetched for offline use');
  }

  /**
   * Initialize Phase 4 Medical Intelligence & Analytics
   */
  async initializeMedicalIntelligence() {
    // TEMPORARILY DISABLED
    return;
    /* console.log('🧠 Initializing Medical Intelligence & Analytics...');

    try {
      // Initialize clinical audit trail first (for compliance)
      await clinicalAuditTrail.initialize();
      console.log('✅ Clinical audit trail initialized');

      // Initialize ML model integration
      await mlModelIntegration.initialize();
      console.log('✅ ML model integration initialized');

      // Initialize predictive analytics engine
      await predictiveEngine.initializeModels();
      console.log('✅ Predictive analytics engine initialized');

      // Start clinical decision support system
      clinicalDecisionSupport.start();
      console.log('✅ Clinical decision support system started');

      // Initialize quality metrics tracking
      await qualityMetricsTracker.initialize();
      console.log('✅ Quality metrics tracking initialized');

      // Start clinical reporting system
      clinicalReportingSystem.start();
      console.log('✅ Clinical reporting system started');

      // Initialize visualization dashboard if container exists
      const dashboardContainer = document.getElementById('medicalDashboard');
      if (dashboardContainer) {
        this.medicalDashboard = new MedicalVisualizationDashboard(dashboardContainer);
        console.log('✅ Medical visualization dashboard initialized');
      }

      // Setup integration event handlers
      this.setupMedicalIntelligenceEventHandlers();

      // Run Phase 4 feature tests
      await this.runPhase4Tests();

    } catch (error) {
      console.error('❌ Medical Intelligence initialization failed:', error);
    }
    */
  }

  /**
   * Setup event handlers for medical intelligence integration
   */
  setupMedicalIntelligenceEventHandlers() {
    // TEMPORARILY DISABLED
    return;
    /*
    // Listen for form submissions to trigger predictions
    document.addEventListener('submit', async (event) => {
      const form = event.target;
      if (form.dataset.module) {
        try {
          const formData = new FormData(form);
          const patientData = Object.fromEntries(formData.entries());

          // Generate predictions
          const predictions = await predictiveEngine.generatePredictions(patientData);

          // Generate comprehensive ML predictions
          const mlResults = await mlModelIntegration.getComprehensivePrediction(patientData);

          // Update visualization dashboard if available
          if (this.medicalDashboard) {
            await this.medicalDashboard.updateDashboard(patientData, predictions);
          }

          // Store results for reporting
          this.lastAnalysisResults = {
            patientData,
            predictions,
            mlResults,
            timestamp: new Date().toISOString()
          };

          console.log('🔬 Medical intelligence analysis completed');

        } catch (error) {
          console.warn('Medical intelligence analysis failed:', error);
        }
      }
    });

    // Setup research mode button for dashboard
    const researchModeToggle = document.getElementById('researchModeToggle');
    if (researchModeToggle) {
      researchModeToggle.addEventListener('click', () => {
        this.toggleMedicalDashboard();
      });
    }
    */
  }

  /**
   * Toggle medical dashboard visibility
   */
  toggleMedicalDashboard() {
    // TEMPORARILY DISABLED
    return;
    /*
    let dashboardContainer = document.getElementById('medicalDashboard');

    if (!dashboardContainer) {
      // Create dashboard container
      dashboardContainer = document.createElement('div');
      dashboardContainer.id = 'medicalDashboard';
      dashboardContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        z-index: 10000;
        overflow: auto;
        display: none;
      `;

      // Add close button
      const closeButton = document.createElement('button');
      closeButton.innerHTML = '✕ Close Dashboard';
      closeButton.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10001;
        padding: 10px 20px;
        background: #f44336;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      `;
      closeButton.onclick = () => this.toggleMedicalDashboard();

      dashboardContainer.appendChild(closeButton);
      document.body.appendChild(dashboardContainer);

      // Initialize dashboard
      this.medicalDashboard = new MedicalVisualizationDashboard(dashboardContainer);

      // Load last analysis if available
      if (this.lastAnalysisResults) {
        this.medicalDashboard.updateDashboard(
          this.lastAnalysisResults.patientData,
          this.lastAnalysisResults.predictions
        );
      }
    }

    // Toggle visibility
    const isVisible = dashboardContainer.style.display !== 'none';
    dashboardContainer.style.display = isVisible ? 'none' : 'block';

    console.log(isVisible ? '📊 Medical dashboard hidden' : '📊 Medical dashboard shown');
    */
  }

  /**
   * Generate comprehensive clinical report
   */
  async generateClinicalReport(reportType = 'comprehensive') {
    // TEMPORARILY DISABLED
    return;
    /*
    if (!this.lastAnalysisResults) {
      alert('No analysis data available. Please complete a patient assessment first.');
      return;
    }

    try {
      const report = await clinicalReportingSystem.generateReport(
        reportType,
        this.lastAnalysisResults,
        { format: 'html' }
      );

      // Trigger download
      clinicalReportingSystem.queueReportForDelivery(
        report,
        'download'
      );

      console.log('📄 Clinical report generated and queued for download');

    } catch (error) {
      console.error('Failed to generate clinical report:', error);
      alert('Failed to generate clinical report. Please try again.');
    }
    */
  }

  /**
   * Run Phase 4 feature tests
   */
  async runPhase4Tests() {
    // TEMPORARILY DISABLED
    return;
    /*
    console.log('🧪 Running Phase 4 feature tests...');

    try {
      // Test predictive analytics
      const testPatientData = {
        gfap_value: 3500,
        age: 68,
        gcs_score: 12,
        systolic_bp: 165,
        diastolic_bp: 95,
        fast_ed_score: 7
      };

      const predictions = await predictiveEngine.generatePredictions(testPatientData);
      console.log('✅ Predictive analytics test passed');

      // Test ML model integration
      const mlResults = await mlModelIntegration.getComprehensivePrediction(testPatientData);
      console.log('✅ ML model integration test passed');

      // Test quality metrics
      qualityMetricsTracker.recordMetric('prediction_accuracy', 'efficiency', 92);
      console.log('✅ Quality metrics tracking test passed');

      // Test audit trail
      clinicalAuditTrail.logEvent('clinical_decision', {
        action: 'phase4_test',
        resource: 'test_module'
      });
      console.log('✅ Audit trail test passed');

      // Test reporting system
      const testReport = await clinicalReportingSystem.generateReport(
        'clinical_summary',
        { patientData: testPatientData, predictions },
        { format: 'json' }
      );
      console.log('✅ Reporting system test passed');

      // Generate quality dashboard
      const qualityDashboard = qualityMetricsTracker.getQualityDashboard();
      console.log('✅ Quality dashboard test passed');

      // Test compliance reporting
      const complianceReport = clinicalAuditTrail.generateComplianceReport('hipaa');
      console.log('✅ Compliance reporting test passed');

      console.log('🎯 All Phase 4 feature tests completed successfully');

      // Store test results
      this.phase4TestResults = {
        predictions,
        mlResults,
        qualityDashboard,
        complianceReport,
        testReport,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Phase 4 feature tests failed:', error);
    }
    */
  }

  /**
   * Get Phase 4 system status
   */
  getPhase4Status() {
    return {
      predictiveEngine: predictiveEngine.isInitialized || false,
      clinicalDecisionSupport: clinicalDecisionSupport.isActive || false,
      qualityMetrics: qualityMetricsTracker.isActive || false,
      auditTrail: clinicalAuditTrail.isActive || false,
      reportingSystem: clinicalReportingSystem.isActive || false,
      mlIntegration: mlModelIntegration.isInitialized || false,
      dashboard: !!this.medicalDashboard,
      testResults: !!this.phase4TestResults
    };
  }

  showUpdateNotification() {
    // Create modal dialog for update notification
    const modal = document.createElement('div');
    modal.className = 'modal show update-modal';
    modal.style.cssText = `
      display: flex;
      position: fixed;
      z-index: 2000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.6);
      backdrop-filter: blur(5px);
      align-items: center;
      justify-content: center;
    `;

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.cssText = `
      background-color: var(--container-bg);
      padding: 30px;
      border-radius: 16px;
      max-width: 400px;
      box-shadow: var(--shadow-lg);
      text-align: center;
      animation: slideUp 0.3s ease;
    `;

    modalContent.innerHTML = `
      <div style="margin-bottom: 20px;">
        <div style="font-size: 3rem; margin-bottom: 16px;">🔄</div>
        <h3 style="margin: 0 0 12px 0; color: var(--text-color);">Update Available</h3>
        <p style="color: var(--text-secondary); margin: 0 0 24px 0; line-height: 1.5;">
          A new version with improvements is ready to install.
        </p>
      </div>
      <div style="display: flex; gap: 12px; justify-content: center;">
        <button id="updateNow" class="primary" style="flex: 1; max-width: 140px;">
          Refresh Now
        </button>
        <button id="updateLater" class="secondary" style="flex: 1; max-width: 140px;">
          Later
        </button>
      </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Handle buttons
    const updateNow = modal.querySelector('#updateNow');
    const updateLater = modal.querySelector('#updateLater');

    updateNow.addEventListener('click', () => {
      window.location.reload();
    });

    updateLater.addEventListener('click', () => {
      modal.remove();
      // Show again in 5 minutes
      setTimeout(() => this.showUpdateNotification(), 5 * 60 * 1000);
    });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        updateLater.click();
      }
    });
  }

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

// Initialize the application
const app = new App();
app.init();

// Export for potential testing or debugging
export default app;
