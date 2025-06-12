// Configuration - Replace with your actual endpoints
const API_ENDPOINTS = {
    validateCode: 'https://us-central1-your-project.cloudfunctions.net/validateAccessCode',
    comaRisk: 'https://us-central1-your-project.cloudfunctions.net/calculateComaRisk',
    screen: 'https://us-central1-your-project.cloudfunctions.net/screen',
    confirm: 'https://us-central1-your-project.cloudfunctions.net/confirm'
};

// DOM Elements
const sections = {
    codeEntry: document.getElementById('codeEntrySection'),
    moduleSelection: document.getElementById('moduleSelectionSection'),
    comaModule: document.getElementById('comaModuleSection'),
    screening: document.getElementById('screeningSection'),
    confirmation: document.getElementById('confirmationSection')
};

const inputs = {
    accessCode: document.getElementById('accessCodeInput'),
    comaGfap: document.getElementById('comaGfapInput'),
    screenAge: document.getElementById('screenAgeInput'),
    screenGfap: document.getElementById('screenGfapInput'),
    screenSbp: document.getElementById('screenSbpInput'),
    confirmAge: document.getElementById('confirmAgeInput'),
    confirmGfap: document.getElementById('confirmGfapInput'),
    confirmSbp: document.getElementById('confirmSbpInput'),
    nihss: document.getElementById('nihssInput'),
    gcs: document.getElementById('gcsInput'),
    fastEd: document.getElementById('fastEdInput')
};

const buttons = {
    submitCode: document.getElementById('submitAccessCode'),
    comaModule: document.getElementById('comaModuleButton'),
    strokeModule: document.getElementById('strokeModuleButton'),
    calculateComa: document.getElementById('calculateComaRisk'),
    backFromComa: document.getElementById('backFromComa'),
    calculateScreening: document.getElementById('calculateScreeningButton'),
    backFromScreening: document.getElementById('backFromScreening'),
    calculateConfirmation: document.getElementById('calculateConfirmationButton'),
    backFromConfirmation: document.getElementById('backFromConfirmation'),
    logout: document.getElementById('logoutButton')
};

const outcomes = {
    screening: document.getElementById('screeningResult'),
    coma: document.getElementById('comaResult'),
    confirmation: document.getElementById('confirmationResult')
};

const controls = {
    language: document.getElementById('languageSelector'),
    theme: document.getElementById('themeToggle')
};

// State Management
let currentUser = null;
let screeningData = {};

// Initialize the application
function initApp() {
    // Check authentication
    if (sessionStorage.getItem('authenticated') === 'true') {
        showSection(sections.moduleSelection);
    }
    
    // Set theme preference
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        controls.theme.checked = true;
    }
    
    // Set language preference
    const savedLang = localStorage.getItem('language') || 'en';
    controls.language.value = savedLang;
    applyTranslations(savedLang);
    
    // Setup event listeners
    setupEventListeners();
}

// Setup all event listeners
function setupEventListeners() {
    // Navigation
    buttons.submitCode.addEventListener('click', validateAccessCode);
    buttons.comaModule.addEventListener('click', () => showSection(sections.comaModule));
    buttons.strokeModule.addEventListener('click', startStrokeModule);
    buttons.backFromComa.addEventListener('click', () => showSection(sections.moduleSelection));
    buttons.backFromScreening.addEventListener('click', () => showSection(sections.moduleSelection));
    buttons.backFromConfirmation.addEventListener('click', () => showSection(sections.screening));
    buttons.logout.addEventListener('click', logout);
    
    // Calculations
    buttons.calculateComa.addEventListener('click', calculateComaRisk);
    buttons.calculateScreening.addEventListener('click', handleScreening);
    buttons.calculateConfirmation.addEventListener('click', handleConfirmation);
    
    // FAST-ED calculator
    document.querySelectorAll('.fast-ed').forEach(checkbox => {
        checkbox.addEventListener('change', updateFastEdScore);
    });
    
    // Controls
    controls.language.addEventListener('change', changeLanguage);
    controls.theme.addEventListener('change', toggleTheme);
}

// Section Navigation
function showSection(section) {
    // Hide all sections
    Object.values(sections).forEach(sec => {
        sec.hidden = true;
    });
    
    // Show requested section
    section.hidden = false;
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Authentication
async function validateAccessCode() {
    const code = inputs.accessCode.value.trim();
    
    if (!code) {
        showError('Please enter an access code');
        return;
    }
    
    try {
        const response = await fetch(API_ENDPOINTS.validateCode, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accessCode: code })
        });
        
        if (!response.ok) throw new Error('Validation failed');
        
        const data = await response.json();
        
        if (data.valid) {
            sessionStorage.setItem('authenticated', 'true');
            showSection(sections.moduleSelection);
        } else {
            showError('Invalid access code');
        }
    } catch (error) {
        showError('Network error. Please try again.');
        console.error('Access code validation error:', error);
    }
}

function logout() {
    sessionStorage.removeItem('authenticated');
    showSection(sections.codeEntry);
    inputs.accessCode.value = '';
}

// Coma Module
async function calculateComaRisk() {
    const gfapValue = parseFloat(inputs.comaGfap.value);
    
    if (isNaN(gfapValue) {
        showError('Please enter a valid GFAP value', outcomes.coma);
        return;
    }
    
    try {
        const response = await fetch(API_ENDPOINTS.comaRisk, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gfap: gfapValue })
        });
        
        if (!response.ok) throw new Error('Calculation failed');
        
        const result = await response.json();
        
        // Display result - in a real app, you would have a more sophisticated display
        outcomes.coma.textContent = `Coma Risk: ${(result.risk * 100).toFixed(1)}%`;
        outcomes.coma.className = 'outcome';
    } catch (error) {
        showError('Error calculating coma risk', outcomes.coma);
        console.error('Coma risk calculation error:', error);
    }
}

// Stroke Module
function startStrokeModule() {
    // Reset forms
    inputs.screenAge.value = '';
    inputs.screenGfap.value = '';
    inputs.screenSbp.value = '';
    outcomes.screening.innerHTML = '';
    
    showSection(sections.screening);
}

async function handleScreening() {
    // Get and validate inputs
    const age = parseFloat(inputs.screenAge.value);
    const gfap = parseFloat(inputs.screenGfap.value);
    const sbp = parseFloat(inputs.screenSbp.value);
    
    if (isNaN(age) || isNaN(gfap) || isNaN(sbp)) {
        showError('Please fill all fields with valid numbers', outcomes.screening);
        return;
    }
    
    // Prepare payload
    const payload = {
        "Age (years)": age,
        "GFAP value": gfap,
        "Systolic BP": sbp
    };
    
    try {
        const response = await fetch(API_ENDPOINTS.screen, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) throw new Error('Screening failed');
        
        const result = await response.json();
        
        if (result.outcome === "ICH_UNLIKELY") {
            displayOutcome(outcomes.screening, 'OUTCOME_A', result.probability);
        } else if (result.outcome === "PROCEED_TO_STEP_2") {
            // Save data for confirmation step
            screeningData = payload;
            prefillConfirmation();
            showSection(sections.confirmation);
        }
    } catch (error) {
        showError('Error processing screening data', outcomes.screening);
        console.error('Screening error:', error);
    }
}

function prefillConfirmation() {
    inputs.confirmAge.value = screeningData["Age (years)"];
    inputs.confirmGfap.value = screeningData["GFAP value"];
    inputs.confirmSbp.value = screeningData["Systolic BP"];
    
    // Reset additional fields
    inputs.nihss.value = '';
    inputs.gcs.value = '';
    document.querySelectorAll('.fast-ed').forEach(checkbox => {
        checkbox.checked = false;
    });
    inputs.fastEd.value = '';
    outcomes.confirmation.innerHTML = '';
}

function updateFastEdScore() {
    const checkboxes = document.querySelectorAll('.fast-ed:checked');
    const score = checkboxes.length;
    inputs.fastEd.value = score;
}

async function handleConfirmation() {
    // Get all 13 parameters
    const payload = {
        "Age (years)": parseFloat(inputs.confirmAge.value),
        "GFAP value": parseFloat(inputs.confirmGfap.value),
        "Systolic BP": parseFloat(inputs.confirmSbp.value),
        "NIHSS": parseFloat(inputs.nihss.value) || 0,
        "GCS": parseFloat(inputs.gcs.value) || 15,
        "FAST-ED": parseFloat(inputs.fastEd.value) || 0,
        // Add other parameters here
        "Atrial Fibrillation": 0, // Placeholder - would be from form
        "Anticoagulant Use": 0,    // Placeholder
        "Headache": 0,             // Placeholder
        "Vomiting": 0,             // Placeholder
        "Glucose Level": 120        // Placeholder
    };
    
    // Validate required fields
    if (isNaN(payload["NIHSS"]) || isNaN(payload["GCS"]) || isNaN(payload["FAST-ED"])) {
        showError('Please fill all required fields', outcomes.confirmation);
        return;
    }
    
    try {
        const response = await fetch(API_ENDPOINTS.confirm, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) throw new Error('Confirmation failed');
        
        const result = await response.json();
        
        if (result.outcome === "ICH_HIGHLY_LIKELY") {
            displayOutcome(outcomes.confirmation, 'OUTCOME_B', result.probability);
        } else if (result.outcome === "ICH_UNCONFIRMED") {
            displayOutcome(outcomes.confirmation, 'OUTCOME_C', result.probability);
        }
    } catch (error) {
        showError('Error processing confirmation data', outcomes.confirmation);
        console.error('Confirmation error:', error);
    }
}

// Outcome Display
function displayOutcome(container, outcomeKey, probability) {
    const translations = window.translations[currentLang];
    const outcomeText = translations[outcomeKey]
        .replace('[X%]', `${(probability * 100).toFixed(1)}%`)
        .replace('[Y%]', `${(probability * 100).toFixed(1)}%`);
    
    container.innerHTML = outcomeText;
    container.className = 'outcome';
    
    if (outcomeKey === 'OUTCOME_A') {
        container.classList.add('ich-unlikely');
    } else if (outcomeKey === 'OUTCOME_B') {
        container.classList.add('ich-highly-likely');
    } else if (outcomeKey === 'OUTCOME_C') {
        container.classList.add('ich-unconfirmed');
    }
}

function showError(message, container = null) {
    if (container) {
        container.textContent = message;
        container.className = 'outcome error';
    } else {
        // For access code error
        const errorElement = document.getElementById('accessCodeError');
        errorElement.textContent = message;
        errorElement.hidden = false;
    }
}

// Language and Theme
function changeLanguage() {
    const lang = controls.language.value;
    localStorage.setItem('language', lang);
    applyTranslations(lang);
}

function applyTranslations(lang) {
    currentLang = lang;
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (window.translations[lang] && window.translations[lang][key]) {
            el.textContent = window.translations[lang][key];
        }
    });
}

function toggleTheme() {
    if (controls.theme.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
