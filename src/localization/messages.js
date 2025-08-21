// Localization messages for the Stroke Triage Assistant

export const messages = {
  en: {
    // Header
    appTitle: 'Stroke Triage Assistant',
    emergencyBadge: 'Emergency Tool',
    helpButton: 'Help and Instructions',
    darkModeButton: 'Toggle dark mode',
    languageToggle: 'Language',

    // Progress
    step1: 'Initial Assessment',
    step2: 'Data Collection', 
    step3: 'Results',

    // Triage 1
    triage1Title: 'Initial Assessment',
    triage1Subtitle: 'Emergency Stroke Triage Protocol',
    triage1Question: 'Is the patient comatose?',
    triage1Help: 'Glasgow Coma Scale < 8',
    triage1Yes: 'YES - Comatose',
    triage1No: 'NO - Conscious',

    // Triage 2
    triage2Title: 'Clinical Assessment',
    triage2Subtitle: 'Select appropriate assessment module',
    triage2Question: 'Which assessment module should be used?',
    triage2Help: 'Select based on available clinical data and examination findings',
    triage2Coma: 'Coma Module',
    triage2ComaDesc: 'For comatose patients (GCS < 8)',
    triage2Limited: 'Limited Data Module',
    triage2LimitedDesc: 'Basic vitals and limited examination',
    triage2Full: 'Full Stroke Module', 
    triage2FullDesc: 'Complete neurological assessment available',

    // Forms
    ageLabel: 'Age (years)',
    ageHelp: 'Patient age in years',
    systolicLabel: 'Systolic BP (mmHg)',
    systolicHelp: 'Systolic blood pressure',
    diastolicLabel: 'Diastolic BP (mmHg)', 
    diastolicHelp: 'Diastolic blood pressure',
    gfapLabel: 'GFAP Value (pg/mL)',
    gfapHelp: 'GFAP biomarker level',
    fastEdLabel: 'FAST-ED Score',
    fastEdHelp: 'FAST-ED assessment score (0-9)',

    // Checkboxes
    headacheLabel: 'Headache',
    vigilanzLabel: 'Reduced consciousness',
    armPareseLabel: 'Arm weakness',
    beinPareseLabel: 'Leg weakness', 
    eyeDeviationLabel: 'Eye deviation',
    atrialFibLabel: 'Atrial fibrillation',
    anticoagLabel: 'Anticoagulated (NOAK)',
    antiplateletsLabel: 'Antiplatelets',

    // Buttons
    analyzeButton: 'Analyze',
    analyzing: 'Analyzing...',
    printResults: 'Print Results',
    newAssessment: 'Start New Assessment',

    // Results
    resultsTitle: 'Assessment Results',
    resultsSubtitle: 'Clinical Decision Support Analysis',
    ichProbability: 'ICH Probability',
    lvoProbability: 'LVO Probability',
    riskLevel: 'Risk Level',
    lowRisk: 'Low Risk',
    moderateRisk: 'Moderate Risk', 
    highRisk: 'High Risk',
    criticalRisk: 'Critical Risk',

    // Risk levels
    riskLow: 'Low',
    riskModerate: 'Moderate',
    riskHigh: 'High', 
    riskCritical: 'Critical',

    // Drivers
    driversTitle: 'Model Drivers',
    driversSubtitle: 'Factors contributing to the prediction',
    ichDrivers: 'ICH Risk Factors',
    lvoDrivers: 'LVO Risk Factors',

    // Critical Alert
    criticalAlertTitle: 'CRITICAL RISK DETECTED',
    criticalAlertMessage: 'High probability of intracerebral hemorrhage detected. Immediate medical attention required.',

    // Help Modal
    helpTitle: 'Quick Reference Guide',
    gcsTitle: 'Glasgow Coma Scale (GCS)',
    gcsLow: 'GCS < 8: Comatose patient - use Coma Module',
    gcsMod: 'GCS 8-12: Moderate impairment',
    gcsHigh: 'GCS 13-15: Mild impairment',
    fastEdTitle: 'FAST-ED Score Components',
    fastEdFacial: 'Facial Palsy: 0-1 points',
    fastEdArm: 'Arm Weakness: 0-2 points',
    fastEdSpeech: 'Speech Changes: 0-2 points',
    fastEdTime: 'Time: Critical factor',
    fastEdEye: 'Eye Deviation: 0-2 points',
    fastEdDenial: 'Denial/Neglect: 0-2 points',
    criticalValuesTitle: 'Critical Values',
    criticalBp: 'Systolic BP > 180: Increased ICH risk',
    criticalGfap: 'GFAP > 500 pg/mL: Significant marker',
    criticalFastEd: 'FAST-ED ≥ 4: Consider LVO',

    // Disclaimer
    disclaimer: 'Clinical Disclaimer',
    disclaimerText: 'This tool is for clinical decision support only. Always use clinical judgment and follow local protocols. Not a replacement for physician assessment.',
    importantNote: 'Important',
    importantText: 'These results are for clinical decision support only. Always use clinical judgment and follow institutional protocols.',

    // Footer
    privacyLink: 'Privacy Policy',
    disclaimerLink: 'Medical Disclaimer', 
    versionLink: 'Version 2.0.1',

    // Privacy and disclaimers
    privacyPolicy: 'Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.',
    medicalDisclaimer: 'Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.',

    // Error messages
    networkError: 'Network error - please check your connection and try again',
    requestTimeout: 'Request timeout - please try again',
    apiError: 'Failed to get results',
    validationError: 'Please check your input values',

    // Session
    sessionTimeout: 'Your session has been idle for 30 minutes. Would you like to continue?',
    unsavedData: 'You have unsaved data. Are you sure you want to leave?',

    // Stroke Centers
    nearestCentersTitle: 'Nearest Stroke Centers',
    useCurrentLocation: 'Use Current Location',
    enterLocationPlaceholder: 'Enter city or address...',
    enterManually: 'Enter Location Manually',
    search: 'Search',
    yourLocation: 'Your Location',
    recommendedCenters: 'Recommended Centers',
    alternativeCenters: 'Alternative Centers',
    noCentersFound: 'No stroke centers found in this area',
    gettingLocation: 'Getting your location',
    searchingLocation: 'Searching location',
    locationError: 'Unable to get your location',
    locationPermissionDenied: 'Location access denied. Please allow location access and try again.',
    locationUnavailable: 'Location information is unavailable',
    locationTimeout: 'Location request timed out',
    geolocationNotSupported: 'Geolocation is not supported by this browser',
    geocodingNotImplemented: 'Location search not available. Please use GPS or enter coordinates manually.',
    tryManualEntry: 'Try entering your location manually or use GPS.',
    distanceNote: 'Distances are calculated as straight-line distances. Actual travel times may vary.',
    
    // Center Types and Services
    comprehensiveCenter: 'Comprehensive Stroke Center',
    primaryCenter: 'Primary Stroke Center',
    telemetryCenter: 'Telemedicine Center',
    thrombectomy: 'Thrombectomy',
    neurosurgery: 'Neurosurgery',
    icu: 'Intensive Care',
    telemedicine: 'Telemedicine',
    stroke_unit: 'Stroke Unit',
    
    // Actions
    call: 'Call',
    directions: 'Directions',
    emergency: 'Emergency',
    certified: 'Certified'
  },

  de: {
    // Header
    appTitle: 'Schlaganfall-Triage-Assistent',
    emergencyBadge: 'Notfall-Tool',
    helpButton: 'Hilfe und Anweisungen',
    darkModeButton: 'Dunklen Modus umschalten',
    languageToggle: 'Sprache',

    // Progress
    step1: 'Erstbeurteilung',
    step2: 'Datenerhebung',
    step3: 'Ergebnisse',

    // Triage 1
    triage1Title: 'Erstbeurteilung',
    triage1Subtitle: 'Notfall-Schlaganfall-Triage-Protokoll',
    triage1Question: 'Ist der Patient komatös?',
    triage1Help: 'Glasgow Coma Scale < 8',
    triage1Yes: 'JA - Komatös',
    triage1No: 'NEIN - Bei Bewusstsein',

    // Triage 2
    triage2Title: 'Klinische Bewertung',
    triage2Subtitle: 'Wählen Sie das entsprechende Bewertungsmodul',
    triage2Question: 'Welches Bewertungsmodul soll verwendet werden?',
    triage2Help: 'Auswahl basierend auf verfügbaren klinischen Daten und Untersuchungsbefunden',
    triage2Coma: 'Koma-Modul',
    triage2ComaDesc: 'Für komatöse Patienten (GCS < 8)',
    triage2Limited: 'Begrenzte-Daten-Modul',
    triage2LimitedDesc: 'Grundvitalwerte und begrenzte Untersuchung',
    triage2Full: 'Vollständiges Schlaganfall-Modul',
    triage2FullDesc: 'Vollständige neurologische Bewertung verfügbar',

    // Forms
    ageLabel: 'Alter (Jahre)',
    ageHelp: 'Patientenalter in Jahren',
    systolicLabel: 'Systolischer RR (mmHg)',
    systolicHelp: 'Systolischer Blutdruck',
    diastolicLabel: 'Diastolischer RR (mmHg)',
    diastolicHelp: 'Diastolischer Blutdruck',
    gfapLabel: 'GFAP-Wert (pg/mL)',
    gfapHelp: 'GFAP-Biomarker-Wert',
    fastEdLabel: 'FAST-ED-Score',
    fastEdHelp: 'FAST-ED-Bewertungsscore (0-9)',

    // Checkboxes
    headacheLabel: 'Kopfschmerzen',
    vigilanzLabel: 'Bewusstseinstrübung',
    armPareseLabel: 'Armschwäche',
    beinPareseLabel: 'Beinschwäche',
    eyeDeviationLabel: 'Blickdeviation',
    atrialFibLabel: 'Vorhofflimmern',
    anticoagLabel: 'Antikoaguliert (NOAK)',
    antiplateletsLabel: 'Thrombozytenaggregationshemmer',

    // Buttons
    analyzeButton: 'Analysieren',
    analyzing: 'Analysiere...',
    printResults: 'Ergebnisse drucken',
    newAssessment: 'Neue Bewertung starten',

    // Results
    resultsTitle: 'Bewertungsergebnisse',
    resultsSubtitle: 'Klinische Entscheidungsunterstützungsanalyse',
    ichProbability: 'ICB-Wahrscheinlichkeit',
    lvoProbability: 'LVO-Wahrscheinlichkeit',
    riskLevel: 'Risikostufe',

    // Risk levels
    riskLow: 'Niedrig',
    riskModerate: 'Mäßig',
    riskHigh: 'Hoch',
    riskCritical: 'Kritisch',

    // Drivers
    driversTitle: 'Modelltreiber',
    driversSubtitle: 'Faktoren, die zur Vorhersage beitragen',
    ichDrivers: 'ICB-Risikofaktoren',
    lvoDrivers: 'LVO-Risikofaktoren',

    // Critical Alert
    criticalAlertTitle: 'KRITISCHES RISIKO ERKANNT',
    criticalAlertMessage: 'Hohe Wahrscheinlichkeit einer intrazerebralen Blutung erkannt. Sofortige medizinische Behandlung erforderlich.',

    // Help Modal
    helpTitle: 'Kurzreferenzleitfaden',
    gcsTitle: 'Glasgow Coma Scale (GCS)',
    gcsLow: 'GCS < 8: Komatöser Patient - Koma-Modul verwenden',
    gcsMod: 'GCS 8-12: Mäßige Beeinträchtigung',
    gcsHigh: 'GCS 13-15: Leichte Beeinträchtigung',
    fastEdTitle: 'FAST-ED-Score-Komponenten',
    fastEdFacial: 'Faziale Parese: 0-1 Punkte',
    fastEdArm: 'Armschwäche: 0-2 Punkte',
    fastEdSpeech: 'Sprachveränderungen: 0-2 Punkte',
    fastEdTime: 'Zeit: Kritischer Faktor',
    fastEdEye: 'Blickdeviation: 0-2 Punkte',
    fastEdDenial: 'Verneinung/Neglect: 0-2 Punkte',
    criticalValuesTitle: 'Kritische Werte',
    criticalBp: 'Systolischer RR > 180: Erhöhtes ICB-Risiko',
    criticalGfap: 'GFAP > 500 pg/mL: Signifikanter Marker',
    criticalFastEd: 'FAST-ED ≥ 4: LVO in Betracht ziehen',

    // Disclaimer
    disclaimer: 'Klinischer Haftungsausschluss',
    disclaimerText: 'Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle. Kein Ersatz für ärztliche Beurteilung.',
    importantNote: 'Wichtig',
    importantText: 'Diese Ergebnisse dienen nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie institutionelle Protokolle.',

    // Footer
    privacyLink: 'Datenschutzrichtlinie',
    disclaimerLink: 'Medizinischer Haftungsausschluss',
    versionLink: 'Version 2.0.1',

    // Privacy and disclaimers
    privacyPolicy: 'Datenschutzrichtlinie: Dieses Tool verarbeitet Daten lokal. Keine Patientendaten werden gespeichert oder übertragen.',
    medicalDisclaimer: 'Medizinischer Haftungsausschluss: Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle.',

    // Error messages
    networkError: 'Netzwerkfehler - bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut',
    requestTimeout: 'Anfrage-Timeout - bitte versuchen Sie es erneut',
    apiError: 'Ergebnisse konnten nicht abgerufen werden',
    validationError: 'Bitte überprüfen Sie Ihre Eingabewerte',

    // Session
    sessionTimeout: 'Ihre Sitzung war 30 Minuten lang inaktiv. Möchten Sie fortfahren?',
    unsavedData: 'Sie haben ungespeicherte Daten. Sind Sie sicher, dass Sie verlassen möchten?',

    // Stroke Centers
    nearestCentersTitle: 'Nächstgelegene Schlaganfall-Zentren',
    useCurrentLocation: 'Aktuellen Standort verwenden',
    enterLocationPlaceholder: 'Stadt oder Adresse eingeben...',
    enterManually: 'Standort manuell eingeben',
    search: 'Suchen',
    yourLocation: 'Ihr Standort',
    recommendedCenters: 'Empfohlene Zentren',
    alternativeCenters: 'Alternative Zentren',
    noCentersFound: 'Keine Schlaganfall-Zentren in diesem Bereich gefunden',
    gettingLocation: 'Standort wird ermittelt',
    searchingLocation: 'Standort wird gesucht',
    locationError: 'Standort konnte nicht ermittelt werden',
    locationPermissionDenied: 'Standortzugriff verweigert. Bitte erlauben Sie Standortzugriff und versuchen Sie es erneut.',
    locationUnavailable: 'Standortinformationen sind nicht verfügbar',
    locationTimeout: 'Standortanfrage ist abgelaufen',
    geolocationNotSupported: 'Geolokalisierung wird von diesem Browser nicht unterstützt',
    geocodingNotImplemented: 'Standortsuche nicht verfügbar. Bitte verwenden Sie GPS oder geben Sie Koordinaten manuell ein.',
    tryManualEntry: 'Versuchen Sie, Ihren Standort manuell einzugeben oder GPS zu verwenden.',
    distanceNote: 'Entfernungen werden als Luftlinie berechnet. Tatsächliche Fahrzeiten können variieren.',
    
    // Center Types and Services
    comprehensiveCenter: 'Überregionales Schlaganfall-Zentrum',
    primaryCenter: 'Regionales Schlaganfall-Zentrum',
    telemetryCenter: 'Telemedizin-Zentrum',
    thrombectomy: 'Thrombektomie',
    neurosurgery: 'Neurochirurgie',
    icu: 'Intensivstation',
    telemedicine: 'Telemedizin',
    stroke_unit: 'Stroke Unit',
    
    // Actions
    call: 'Anrufen',
    directions: 'Wegbeschreibung',
    emergency: 'Notfall',
    certified: 'Zertifiziert'
  }
};