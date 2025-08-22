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
    
    // Module titles
    comaModuleTitle: 'Coma Module',
    limitedDataModuleTitle: 'Limited Data Module',
    fullStrokeModuleTitle: 'Full Stroke Module',

    // Triage 1
    triage1Title: 'Patient Assessment',
    triage1Question: 'Is the patient comatose?',
    triage1Help: 'Glasgow Coma Scale < 8',
    triage1Yes: 'YES - Comatose',
    triage1No: 'NO - Conscious',

    // Triage 2
    triage2Title: 'Examination Capability',
    triage2Question: 'Can the patient be reliably examined?',
    triage2Help: 'Patient is not aphasic, confused, or uncooperative',
    triage2Yes: 'YES - Full Exam Possible',
    triage2No: 'NO - Limited Exam Only',

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
    startOver: 'Start Over',
    goBack: 'Go Back',
    goHome: 'Go Home',
    
    // Form sections
    basicInformation: 'Basic Information',
    biomarkersScores: 'Biomarkers & Scores',
    clinicalSymptoms: 'Clinical Symptoms',
    medicalHistory: 'Medical History',
    
    // Form labels with units
    ageYearsLabel: 'Age (years)',
    systolicBpLabel: 'Systolic BP (mmHg)',
    diastolicBpLabel: 'Diastolic BP (mmHg)',
    gfapValueLabel: 'GFAP Value (pg/mL)',
    fastEdScoreLabel: 'FAST-ED Score',
    
    // Help text
    ageYearsHelp: "Patient's age in years",
    systolicBpHelp: 'Normal: 90-140 mmHg',
    diastolicBpHelp: 'Normal: 60-90 mmHg',
    gfapTooltip: 'Brain injury biomarker',
    gfapTooltipLong: 'Glial Fibrillary Acidic Protein - Brain injury biomarker',
    gfapRange: 'Range: {min} - {max} pg/mL',
    fastEdTooltip: '0-9 scale for LVO screening',
    
    // Module buttons
    analyzeIchRisk: 'Analyze ICH Risk',
    analyzeStrokeRisk: 'Analyze Stroke Risk',
    
    // Alert messages
    criticalPatient: 'Critical Patient',
    comaAlert: 'Patient is comatose (GCS < 8). Rapid assessment required.',
    vigilanceReduction: 'Vigilance Reduction (Decreased alertness)',
    
    // Additional symptom labels
    armParesis: 'Arm Paresis',
    legParesis: 'Leg Paresis',
    eyeDeviation: 'Eye Deviation',
    atrialFibrillation: 'Atrial Fibrillation',
    onNoacDoac: 'On NOAC/DOAC',
    onAntiplatelets: 'On Antiplatelets',

    // Results
    resultsTitle: 'Assessment Results',
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
    riskFactors: 'Risk Factors',
    increaseRisk: 'INCREASE',
    decreaseRisk: 'DECREASE',
    noPositiveFactors: 'No increasing factors',
    noNegativeFactors: 'No decreasing factors',
    ichDrivers: 'ICH Risk Factors',
    lvoDrivers: 'LVO Risk Factors',

    // Critical Alert
    criticalAlertTitle: 'CRITICAL RISK DETECTED',
    criticalAlertMessage: 'High probability of intracerebral hemorrhage detected. Immediate medical attention required.',
    immediateActionsRequired: 'Immediate actions required',
    initiateStrokeProtocol: 'Initiate stroke protocol immediately',
    urgentCtImaging: 'Urgent CT imaging required',
    considerBpManagement: 'Consider blood pressure management',
    prepareNeurosurgicalConsult: 'Prepare for potential neurosurgical consultation',

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

    // FAST-ED Calculator Modal
    fastEdCalculatorTitle: 'FAST-ED Score Calculator',
    fastEdCalculatorSubtitle: 'Click to calculate FAST-ED score components',
    facialPalsyTitle: 'Facial Palsy',
    facialPalsyNormal: 'Normal (0)',
    facialPalsyMild: 'Mild drooping (1)',
    armWeaknessTitle: 'Arm Weakness',
    armWeaknessNormal: 'Normal (0)',
    armWeaknessMild: 'Mild drift (1)',
    armWeaknessSevere: 'Falls immediately (2)',
    speechChangesTitle: 'Speech Changes', 
    speechChangesNormal: 'Normal (0)',
    speechChangesMild: 'Slurred speech (1)',
    speechChangesSevere: 'Severe aphasia (2)',
    eyeDeviationTitle: 'Eye Deviation',
    eyeDeviationNormal: 'Normal (0)',
    eyeDeviationPartial: 'Partial gaze palsy (1)',
    eyeDeviationForced: 'Forced deviation (2)',
    denialNeglectTitle: 'Denial/Neglect',
    denialNeglectNormal: 'Normal (0)',
    denialNeglectPartial: 'Partial neglect (1)',
    denialNeglectComplete: 'Complete neglect (2)',
    totalScoreTitle: 'Total FAST-ED Score',
    riskLevel: 'Risk Level',
    riskLevelLow: 'LOW (Score <4)',
    riskLevelHigh: 'HIGH (Score ≥4 - Consider LVO)',
    applyScore: 'Apply Score',
    cancel: 'Cancel',
    
    // Results Screen Enhancements
    modelDrivers: 'Model Drivers',
    modelDriversSubtitle: 'Factors contributing to the prediction',
    contributingFactors: 'Contributing factors',
    factorsShown: 'shown',
    positiveFactors: 'Positive factors',
    negativeFactors: 'Negative factors',
    clinicalInformation: 'Clinical Information',
    clinicalRecommendations: 'Clinical Recommendations',
    clinicalRec1: 'Consider immediate imaging if ICH risk is high',
    clinicalRec2: 'Activate stroke team for LVO scores ≥ 50%',
    clinicalRec3: 'Monitor blood pressure closely',
    clinicalRec4: 'Document all findings thoroughly',
    noDriverData: 'No driver data available',
    driverAnalysisUnavailable: 'Driver analysis unavailable',
    driverInfoNotAvailable: 'Driver information not available from this prediction model',
    driverAnalysisNotAvailable: 'Driver analysis not available for this prediction',
    lvoNotPossible: 'LVO assessment not possible with limited data',
    fullExamRequired: 'Full neurological examination required for LVO screening',
    limitedAssessment: 'Limited Assessment',

    // Disclaimer
    disclaimer: 'Clinical Disclaimer',
    disclaimerText: 'This tool is for clinical decision support only. Always use clinical judgment and follow local protocols. Not a replacement for physician assessment.',
    importantNote: 'Important',
    importantText: 'These results are for clinical decision support only. Always use clinical judgment and follow institutional protocols.',
    
    // Input Summary
    inputSummaryTitle: 'Input Summary',
    inputSummarySubtitle: 'Values used for this analysis',

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
    travelTimeNote: 'Travel times calculated for emergency vehicles with sirens and priority routing.',
    calculatingTravelTimes: 'Calculating travel times',
    minutes: 'min',
    poweredByOrs: 'Travel times powered by OpenRoute Service',
    
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
    
    // Module titles
    comaModuleTitle: 'Koma-Modul',
    limitedDataModuleTitle: 'Begrenzte Daten Modul',
    fullStrokeModuleTitle: 'Vollständiges Schlaganfall-Modul',

    // Triage 1
    triage1Title: 'Patientenbeurteilung',
    triage1Question: 'Ist der Patient komatös?',
    triage1Help: 'Glasgow Coma Scale < 8',
    triage1Yes: 'JA - Komatös',
    triage1No: 'NEIN - Bei Bewusstsein',

    // Triage 2
    triage2Title: 'Untersuchungsfähigkeit',
    triage2Question: 'Kann der Patient zuverlässig untersucht werden?',
    triage2Help: 'Patient ist nicht aphasisch, verwirrt oder unkooperativ',
    triage2Yes: 'JA - Vollständige Untersuchung möglich',
    triage2No: 'NEIN - Nur begrenzte Untersuchung',

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
    startOver: 'Von vorn beginnen',
    goBack: 'Zurück',
    goHome: 'Zur Startseite',
    
    // Form sections
    basicInformation: 'Grundinformationen',
    biomarkersScores: 'Biomarker & Scores',
    clinicalSymptoms: 'Klinische Symptome',
    medicalHistory: 'Anamnese',
    
    // Form labels with units
    ageYearsLabel: 'Alter (Jahre)',
    systolicBpLabel: 'Systolischer RR (mmHg)',
    diastolicBpLabel: 'Diastolischer RR (mmHg)',
    gfapValueLabel: 'GFAP-Wert (pg/mL)',
    fastEdScoreLabel: 'FAST-ED-Score',
    
    // Help text
    ageYearsHelp: 'Patientenalter in Jahren',
    systolicBpHelp: 'Normal: 90-140 mmHg',
    diastolicBpHelp: 'Normal: 60-90 mmHg',
    gfapTooltip: 'Hirnverletzungs-Biomarker',
    gfapTooltipLong: 'Glial Fibrillary Acidic Protein - Hirnverletzungs-Biomarker',
    gfapRange: 'Bereich: {min} - {max} pg/mL',
    fastEdTooltip: '0-9 Skala für LVO-Screening',
    
    // Module buttons
    analyzeIchRisk: 'ICB-Risiko analysieren',
    analyzeStrokeRisk: 'Schlaganfall-Risiko analysieren',
    
    // Alert messages
    criticalPatient: 'Kritischer Patient',
    comaAlert: 'Patient ist komatös (GCS < 8). Schnelle Beurteilung erforderlich.',
    vigilanceReduction: 'Vigilanzminderung (Verminderte Wachheit)',
    
    // Additional symptom labels
    armParesis: 'Armparese',
    legParesis: 'Beinparese',
    eyeDeviation: 'Blickdeviation',
    atrialFibrillation: 'Vorhofflimmern',
    onNoacDoac: 'NOAK/DOAK-Therapie',
    onAntiplatelets: 'Thrombozytenaggregationshemmer',

    // Results
    resultsTitle: 'Bewertungsergebnisse',
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
    riskFactors: 'Risikofaktoren',
    increaseRisk: 'ERHÖHEN',
    decreaseRisk: 'VERRINGERN',
    noPositiveFactors: 'Keine erhöhenden Faktoren',
    noNegativeFactors: 'Keine verringernden Faktoren',
    ichDrivers: 'ICB-Risikofaktoren',
    lvoDrivers: 'LVO-Risikofaktoren',

    // Critical Alert
    criticalAlertTitle: 'KRITISCHES RISIKO ERKANNT',
    criticalAlertMessage: 'Hohe Wahrscheinlichkeit einer intrazerebralen Blutung erkannt. Sofortige medizinische Behandlung erforderlich.',
    immediateActionsRequired: 'Sofortige Maßnahmen erforderlich',
    initiateStrokeProtocol: 'Schlaganfall-Protokoll sofort einleiten',
    urgentCtImaging: 'Dringende CT-Bildgebung erforderlich',
    considerBpManagement: 'Blutdruckmanagement erwägen',
    prepareNeurosurgicalConsult: 'Neurochirurgische Konsultation vorbereiten',

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

    // FAST-ED Calculator Modal
    fastEdCalculatorTitle: 'FAST-ED-Score-Rechner',
    fastEdCalculatorSubtitle: 'Klicken Sie, um FAST-ED-Score-Komponenten zu berechnen',
    facialPalsyTitle: 'Faziale Parese',
    facialPalsyNormal: 'Normal (0)',
    facialPalsyMild: 'Leichte Mundwinkelasymmetrie (1)',
    armWeaknessTitle: 'Armschwäche',
    armWeaknessNormal: 'Normal (0)',
    armWeaknessMild: 'Leichter Armabfall (1)',
    armWeaknessSevere: 'Arm fällt sofort ab (2)',
    speechChangesTitle: 'Sprachveränderungen',
    speechChangesNormal: 'Normal (0)',
    speechChangesMild: 'Verwaschene Sprache (1)',
    speechChangesSevere: 'Schwere Aphasie (2)',
    eyeDeviationTitle: 'Blickdeviation',
    eyeDeviationNormal: 'Normal (0)',
    eyeDeviationPartial: 'Partielle Blickparese (1)',
    eyeDeviationForced: 'Forcierte Blickdeviation (2)',
    denialNeglectTitle: 'Verneinung/Neglect',
    denialNeglectNormal: 'Normal (0)',
    denialNeglectPartial: 'Partieller Neglect (1)',
    denialNeglectComplete: 'Kompletter Neglect (2)',
    totalScoreTitle: 'Gesamt-FAST-ED-Score',
    riskLevel: 'Risikostufe',
    riskLevelLow: 'NIEDRIG (Score <4)',
    riskLevelHigh: 'HOCH (Score ≥4 - LVO erwägen)',
    applyScore: 'Score Anwenden',
    cancel: 'Abbrechen',
    
    // Results Screen Enhancements
    modelDrivers: 'Modelltreiber',
    modelDriversSubtitle: 'Faktoren, die zur Vorhersage beitragen',
    contributingFactors: 'Beitragende Faktoren',
    factorsShown: 'angezeigt',
    positiveFactors: 'Positive Faktoren',
    negativeFactors: 'Negative Faktoren',
    clinicalInformation: 'Klinische Informationen',
    clinicalRecommendations: 'Klinische Empfehlungen',
    clinicalRec1: 'Sofortige Bildgebung erwägen bei hohem ICB-Risiko',
    clinicalRec2: 'Stroke-Team aktivieren bei LVO-Score ≥ 50%',
    clinicalRec3: 'Blutdruck engmaschig überwachen',
    clinicalRec4: 'Alle Befunde gründlich dokumentieren',
    noDriverData: 'Keine Treiberdaten verfügbar',
    driverAnalysisUnavailable: 'Treiberanalyse nicht verfügbar',
    driverInfoNotAvailable: 'Treiberinformationen von diesem Vorhersagemodell nicht verfügbar',
    driverAnalysisNotAvailable: 'Treiberanalyse für diese Vorhersage nicht verfügbar',
    lvoNotPossible: 'LVO-Bewertung mit begrenzten Daten nicht möglich',
    fullExamRequired: 'Vollständige neurologische Untersuchung für LVO-Screening erforderlich',
    limitedAssessment: 'Begrenzte Bewertung',

    // Disclaimer
    disclaimer: 'Klinischer Haftungsausschluss',
    disclaimerText: 'Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle. Kein Ersatz für ärztliche Beurteilung.',
    importantNote: 'Wichtig',
    importantText: 'Diese Ergebnisse dienen nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie institutionelle Protokolle.',
    
    // Input Summary
    inputSummaryTitle: 'Eingabezusammenfassung',
    inputSummarySubtitle: 'Für diese Analyse verwendete Werte',

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
    travelTimeNote: 'Fahrzeiten berechnet für Rettungsfahrzeuge mit Sondersignalen und Vorfahrtsberechtigung.',
    calculatingTravelTimes: 'Fahrzeiten werden berechnet',
    minutes: 'Min',
    poweredByOrs: 'Fahrzeiten bereitgestellt von OpenRoute Service',
    
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