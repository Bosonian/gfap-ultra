// translations.js
window.translations = {
    en: {
        // Access and Navigation
        APP_TITLE: "iGFAP Check",
        ACCESS_CODE_LABEL: "Enter Access Code:",
        SUBMIT_BUTTON: "Submit",
        LOGOUT_BUTTON: "Logout",
        BACK_BUTTON: "Back",
        
        // Modules
        MODULE_SELECTION_TITLE: "Select Diagnostic Module",
        COMA_MODULE_TITLE: "Coma Module",
        STROKE_MODULE_TITLE: "Stroke Module",
        
        // Buttons
        CALCULATE_BUTTON: "Calculate",
        ANALYZE_SCREENING: "Analyze Screening Data",
        CALCULATE_FINAL: "Calculate Final Probability",
        
        // Input Labels
        AGE_LABEL: "Patient Age (years):",
        GFAP_LABEL: "GFAP Value (pg/mL):",
        SBP_LABEL: "Systolic BP (mmHg):",
        NIHSS_LABEL: "NIHSS Score:",
        GCS_LABEL: "Glasgow Coma Scale:",
        FAST_ED_LABEL: "FAST-ED Score:",
        
        // Outcomes
        OUTCOME_A: "ICH Unlikely. Probability: [X%]. CT scan recommended for confirmation. Do not reduce blood pressure based on this result.",
        OUTCOME_B: "ICH Highly Likely. Probability: [Y%]. Consider alarming neurosurgery and initiating blood pressure management protocols.",
        OUTCOME_C: "ICH Cannot Be Confirmed by this model. Final Probability: [Y%]. An intracranial hemorrhage is less likely but cannot be completely ruled out. CT scan is essential for diagnosis. Do not reduce blood pressure without definitive imaging.",
        
        // Errors
        INVALID_CODE: "Invalid access code",
        MISSING_FIELDS: "Please fill all required fields"
    },
    de: {
        // Access and Navigation
        APP_TITLE: "iGFAP Check",
        ACCESS_CODE_LABEL: "Zugangscode eingeben:",
        SUBMIT_BUTTON: "Einreichen",
        LOGOUT_BUTTON: "Abmelden",
        BACK_BUTTON: "Zurück",
        
        // Modules
        MODULE_SELECTION_TITLE: "Diagnosemodul auswählen",
        COMA_MODULE_TITLE: "Koma-Modul",
        STROKE_MODULE_TITLE: "Schlaganfall-Modul",
        
        // Buttons
        CALCULATE_BUTTON: "Berechnen",
        ANALYZE_SCREENING: "Screening-Daten analysieren",
        CALCULATE_FINAL: "Endgültige Wahrscheinlichkeit berechnen",
        
        // Input Labels
        AGE_LABEL: "Patientenalter (Jahre):",
        GFAP_LABEL: "GFAP-Wert (pg/mL):",
        SBP_LABEL: "Systolischer Blutdruck (mmHg):",
        NIHSS_LABEL: "NIHSS-Score:",
        GCS_LABEL: "Glasgow Coma Scale:",
        FAST_ED_LABEL: "FAST-ED-Score:",
        
        // Outcomes
        OUTCOME_A: "ICH unwahrscheinlich. Wahrscheinlichkeit: [X%]. CT-Scan zur Bestätigung empfohlen. Blutdruck nicht aufgrund dieses Ergebnisses senken.",
        OUTCOME_B: "ICH höchstwahrscheinlich. Wahrscheinlichkeit: [Y%]. Neurochirurgie alarmieren und Blutdruckmanagementprotokolle einleiten.",
        OUTCOME_C: "ICH kann durch dieses Modell nicht bestätigt werden. Endgültige Wahrscheinlichkeit: [Y%]. Eine intrakranielle Blutung ist weniger wahrscheinlich, kann aber nicht vollständig ausgeschlossen werden. CT-Scan ist für die Diagnose unerlässlich. Blutdruck nicht ohne definitive Bildgebung senken.",
        
        // Errors
        INVALID_CODE: "Ungültiger Zugangscode",
        MISSING_FIELDS: "Bitte füllen Sie alle erforderlichen Felder aus"
    }
};
