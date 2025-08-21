(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function e(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(n){if(n.ep)return;n.ep=!0;const r=e(n);fetch(n.href,r)}})();class ee{constructor(){this.state={currentScreen:"triage1",results:null,sessionId:null,startTime:null,formData:{},validationErrors:{},screenHistory:[]},this.listeners=new Set,this.initialize()}initialize(){this.state.sessionId=this.generateSessionId(),this.state.startTime=Date.now(),console.log("Store initialized with session:",this.state.sessionId)}generateSessionId(){return"session_"+Date.now()+"_"+Math.random().toString(36).substr(2,9)}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}notify(){this.listeners.forEach(t=>t(this.state))}getState(){return{...this.state}}setState(t){this.state={...this.state,...t},this.notify()}navigate(t){console.log(`Navigating from ${this.state.currentScreen} to ${t}`);const e=[...this.state.screenHistory];this.state.currentScreen!==t&&!e.includes(this.state.currentScreen)&&e.push(this.state.currentScreen),this.setState({currentScreen:t,screenHistory:e})}goBack(){const t=[...this.state.screenHistory];if(console.log("goBack() - current history:",t),console.log("goBack() - current screen:",this.state.currentScreen),t.length>0){const e=t.pop();return console.log("goBack() - navigating to:",e),this.setState({currentScreen:e,screenHistory:t}),!0}return console.log("goBack() - no history available"),!1}goHome(){this.setState({currentScreen:"triage1",screenHistory:[]})}setFormData(t,e){const a={...this.state.formData};a[t]={...e},this.setState({formData:a})}getFormData(t){return this.state.formData[t]||{}}setValidationErrors(t){this.setState({validationErrors:t})}clearValidationErrors(){this.setState({validationErrors:{}})}setResults(t){this.setState({results:t})}hasUnsavedData(){return Object.keys(this.state.formData).length>0&&!this.state.results}reset(){const t={currentScreen:"triage1",results:null,sessionId:this.generateSessionId(),startTime:Date.now(),formData:{},validationErrors:{},screenHistory:[]};this.setState(t),console.log("Store reset with new session:",t.sessionId)}logEvent(t,e={}){const a={timestamp:Date.now(),session:this.state.sessionId,event:t,data:e};console.log("Event:",a)}getSessionDuration(){return Date.now()-this.state.startTime}}const m=new ee;function y(i){const t=[{id:1,label:"Triage"},{id:2,label:"Assessment"},{id:3,label:"Results"}];let e='<div class="progress-indicator">';return t.forEach((a,n)=>{const r=a.id===i,o=a.id<i;e+=`
      <div class="progress-step ${r?"active":""} ${o?"completed":""}">
        ${o?"":a.id}
      </div>
    `,n<t.length-1&&(e+=`<div class="progress-line ${o?"completed":""}"></div>`)}),e+="</div>",e}const q={en:{appTitle:"Stroke Triage Assistant",emergencyBadge:"Emergency Tool",helpButton:"Help and Instructions",darkModeButton:"Toggle dark mode",languageToggle:"Language",step1:"Initial Assessment",step2:"Data Collection",step3:"Results",comaModuleTitle:"Coma Module",limitedDataModuleTitle:"Limited Data Module",fullStrokeModuleTitle:"Full Stroke Module",triage1Title:"Patient Assessment",triage1Question:"Is the patient comatose?",triage1Help:"Glasgow Coma Scale < 8",triage1Yes:"YES - Comatose",triage1No:"NO - Conscious",triage2Title:"Examination Capability",triage2Question:"Can the patient be reliably examined?",triage2Help:"Patient is not aphasic, confused, or uncooperative",triage2Yes:"YES - Full Exam Possible",triage2No:"NO - Limited Exam Only",ageLabel:"Age (years)",ageHelp:"Patient age in years",systolicLabel:"Systolic BP (mmHg)",systolicHelp:"Systolic blood pressure",diastolicLabel:"Diastolic BP (mmHg)",diastolicHelp:"Diastolic blood pressure",gfapLabel:"GFAP Value (pg/mL)",gfapHelp:"GFAP biomarker level",fastEdLabel:"FAST-ED Score",fastEdHelp:"FAST-ED assessment score (0-9)",headacheLabel:"Headache",vigilanzLabel:"Reduced consciousness",armPareseLabel:"Arm weakness",beinPareseLabel:"Leg weakness",eyeDeviationLabel:"Eye deviation",atrialFibLabel:"Atrial fibrillation",anticoagLabel:"Anticoagulated (NOAK)",antiplateletsLabel:"Antiplatelets",analyzeButton:"Analyze",analyzing:"Analyzing...",printResults:"Print Results",newAssessment:"Start New Assessment",startOver:"Start Over",goBack:"Go Back",goHome:"Go Home",basicInformation:"Basic Information",biomarkersScores:"Biomarkers & Scores",clinicalSymptoms:"Clinical Symptoms",medicalHistory:"Medical History",ageYearsLabel:"Age (years)",systolicBpLabel:"Systolic BP (mmHg)",diastolicBpLabel:"Diastolic BP (mmHg)",gfapValueLabel:"GFAP Value (pg/mL)",fastEdScoreLabel:"FAST-ED Score",ageYearsHelp:"Patient's age in years",systolicBpHelp:"Normal: 90-140 mmHg",diastolicBpHelp:"Normal: 60-90 mmHg",gfapTooltip:"Brain injury biomarker",gfapTooltipLong:"Glial Fibrillary Acidic Protein - Brain injury biomarker",gfapRange:"Range: {min} - {max} pg/mL",fastEdTooltip:"0-9 scale for LVO screening",analyzeIchRisk:"Analyze ICH Risk",analyzeStrokeRisk:"Analyze Stroke Risk",criticalPatient:"Critical Patient",comaAlert:"Patient is comatose (GCS < 8). Rapid assessment required.",vigilanceReduction:"Vigilance Reduction (Decreased alertness)",armParesis:"Arm Paresis",legParesis:"Leg Paresis",eyeDeviation:"Eye Deviation",atrialFibrillation:"Atrial Fibrillation",onNoacDoac:"On NOAC/DOAC",onAntiplatelets:"On Antiplatelets",resultsTitle:"Assessment Results",ichProbability:"ICH Probability",lvoProbability:"LVO Probability",riskLevel:"Risk Level",lowRisk:"Low Risk",moderateRisk:"Moderate Risk",highRisk:"High Risk",criticalRisk:"Critical Risk",riskLow:"Low",riskModerate:"Moderate",riskHigh:"High",riskCritical:"Critical",driversTitle:"Model Drivers",driversSubtitle:"Factors contributing to the prediction",ichDrivers:"ICH Risk Factors",lvoDrivers:"LVO Risk Factors",criticalAlertTitle:"CRITICAL RISK DETECTED",criticalAlertMessage:"High probability of intracerebral hemorrhage detected. Immediate medical attention required.",helpTitle:"Quick Reference Guide",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 8: Comatose patient - use Coma Module",gcsMod:"GCS 8-12: Moderate impairment",gcsHigh:"GCS 13-15: Mild impairment",fastEdTitle:"FAST-ED Score Components",fastEdFacial:"Facial Palsy: 0-1 points",fastEdArm:"Arm Weakness: 0-2 points",fastEdSpeech:"Speech Changes: 0-2 points",fastEdTime:"Time: Critical factor",fastEdEye:"Eye Deviation: 0-2 points",fastEdDenial:"Denial/Neglect: 0-2 points",criticalValuesTitle:"Critical Values",criticalBp:"Systolic BP > 180: Increased ICH risk",criticalGfap:"GFAP > 500 pg/mL: Significant marker",criticalFastEd:"FAST-ED ≥ 4: Consider LVO",fastEdCalculatorTitle:"FAST-ED Score Calculator",fastEdCalculatorSubtitle:"Click to calculate FAST-ED score components",facialPalsyTitle:"Facial Palsy",facialPalsyNormal:"Normal (0)",facialPalsyMild:"Mild drooping (1)",armWeaknessTitle:"Arm Weakness",armWeaknessNormal:"Normal (0)",armWeaknessMild:"Mild drift (1)",armWeaknessSevere:"Falls immediately (2)",speechChangesTitle:"Speech Changes",speechChangesNormal:"Normal (0)",speechChangesMild:"Slurred speech (1)",speechChangesSevere:"Severe aphasia (2)",eyeDeviationTitle:"Eye Deviation",eyeDeviationNormal:"Normal (0)",eyeDeviationPartial:"Partial gaze palsy (1)",eyeDeviationForced:"Forced deviation (2)",denialNeglectTitle:"Denial/Neglect",denialNeglectNormal:"Normal (0)",denialNeglectPartial:"Partial neglect (1)",denialNeglectComplete:"Complete neglect (2)",totalScoreTitle:"Total FAST-ED Score",riskLevel:"Risk Level",riskLevelLow:"LOW (Score <4)",riskLevelHigh:"HIGH (Score ≥4 - Consider LVO)",applyScore:"Apply Score",cancel:"Cancel",modelDrivers:"Model Drivers",modelDriversSubtitle:"Factors contributing to the prediction",contributingFactors:"Contributing factors",factorsShown:"shown",positiveFactors:"Positive factors",negativeFactors:"Negative factors",clinicalInformation:"Clinical Information",clinicalRecommendations:"Clinical Recommendations",clinicalRec1:"Consider immediate imaging if ICH risk is high",clinicalRec2:"Activate stroke team for LVO scores ≥ 50%",clinicalRec3:"Monitor blood pressure closely",clinicalRec4:"Document all findings thoroughly",noDriverData:"No driver data available",driverAnalysisUnavailable:"Driver analysis unavailable",driverInfoNotAvailable:"Driver information not available from this prediction model",driverAnalysisNotAvailable:"Driver analysis not available for this prediction",lvoNotPossible:"LVO assessment not possible with limited data",fullExamRequired:"Full neurological examination required for LVO screening",limitedAssessment:"Limited Assessment",disclaimer:"Clinical Disclaimer",disclaimerText:"This tool is for clinical decision support only. Always use clinical judgment and follow local protocols. Not a replacement for physician assessment.",importantNote:"Important",importantText:"These results are for clinical decision support only. Always use clinical judgment and follow institutional protocols.",inputSummaryTitle:"Input Summary",inputSummarySubtitle:"Values used for this analysis",privacyLink:"Privacy Policy",disclaimerLink:"Medical Disclaimer",versionLink:"Version 2.0.1",privacyPolicy:"Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.",medicalDisclaimer:"Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.",networkError:"Network error - please check your connection and try again",requestTimeout:"Request timeout - please try again",apiError:"Failed to get results",validationError:"Please check your input values",sessionTimeout:"Your session has been idle for 30 minutes. Would you like to continue?",unsavedData:"You have unsaved data. Are you sure you want to leave?",nearestCentersTitle:"Nearest Stroke Centers",useCurrentLocation:"Use Current Location",enterLocationPlaceholder:"Enter city or address...",enterManually:"Enter Location Manually",search:"Search",yourLocation:"Your Location",recommendedCenters:"Recommended Centers",alternativeCenters:"Alternative Centers",noCentersFound:"No stroke centers found in this area",gettingLocation:"Getting your location",searchingLocation:"Searching location",locationError:"Unable to get your location",locationPermissionDenied:"Location access denied. Please allow location access and try again.",locationUnavailable:"Location information is unavailable",locationTimeout:"Location request timed out",geolocationNotSupported:"Geolocation is not supported by this browser",geocodingNotImplemented:"Location search not available. Please use GPS or enter coordinates manually.",tryManualEntry:"Try entering your location manually or use GPS.",distanceNote:"Distances are calculated as straight-line distances. Actual travel times may vary.",travelTimeNote:"Travel times calculated for emergency vehicles with sirens and priority routing.",calculatingTravelTimes:"Calculating travel times",minutes:"min",poweredByOrs:"Travel times powered by OpenRoute Service",comprehensiveCenter:"Comprehensive Stroke Center",primaryCenter:"Primary Stroke Center",telemetryCenter:"Telemedicine Center",thrombectomy:"Thrombectomy",neurosurgery:"Neurosurgery",icu:"Intensive Care",telemedicine:"Telemedicine",stroke_unit:"Stroke Unit",call:"Call",directions:"Directions",emergency:"Emergency",certified:"Certified"},de:{appTitle:"Schlaganfall-Triage-Assistent",emergencyBadge:"Notfall-Tool",helpButton:"Hilfe und Anweisungen",darkModeButton:"Dunklen Modus umschalten",languageToggle:"Sprache",step1:"Erstbeurteilung",step2:"Datenerhebung",step3:"Ergebnisse",comaModuleTitle:"Koma-Modul",limitedDataModuleTitle:"Begrenzte Daten Modul",fullStrokeModuleTitle:"Vollständiges Schlaganfall-Modul",triage1Title:"Patientenbeurteilung",triage1Question:"Ist der Patient komatös?",triage1Help:"Glasgow Coma Scale < 8",triage1Yes:"JA - Komatös",triage1No:"NEIN - Bei Bewusstsein",triage2Title:"Untersuchungsfähigkeit",triage2Question:"Kann der Patient zuverlässig untersucht werden?",triage2Help:"Patient ist nicht aphasisch, verwirrt oder unkooperativ",triage2Yes:"JA - Vollständige Untersuchung möglich",triage2No:"NEIN - Nur begrenzte Untersuchung",ageLabel:"Alter (Jahre)",ageHelp:"Patientenalter in Jahren",systolicLabel:"Systolischer RR (mmHg)",systolicHelp:"Systolischer Blutdruck",diastolicLabel:"Diastolischer RR (mmHg)",diastolicHelp:"Diastolischer Blutdruck",gfapLabel:"GFAP-Wert (pg/mL)",gfapHelp:"GFAP-Biomarker-Wert",fastEdLabel:"FAST-ED-Score",fastEdHelp:"FAST-ED-Bewertungsscore (0-9)",headacheLabel:"Kopfschmerzen",vigilanzLabel:"Bewusstseinstrübung",armPareseLabel:"Armschwäche",beinPareseLabel:"Beinschwäche",eyeDeviationLabel:"Blickdeviation",atrialFibLabel:"Vorhofflimmern",anticoagLabel:"Antikoaguliert (NOAK)",antiplateletsLabel:"Thrombozytenaggregationshemmer",analyzeButton:"Analysieren",analyzing:"Analysiere...",printResults:"Ergebnisse drucken",newAssessment:"Neue Bewertung starten",startOver:"Von vorn beginnen",goBack:"Zurück",goHome:"Zur Startseite",basicInformation:"Grundinformationen",biomarkersScores:"Biomarker & Scores",clinicalSymptoms:"Klinische Symptome",medicalHistory:"Anamnese",ageYearsLabel:"Alter (Jahre)",systolicBpLabel:"Systolischer RR (mmHg)",diastolicBpLabel:"Diastolischer RR (mmHg)",gfapValueLabel:"GFAP-Wert (pg/mL)",fastEdScoreLabel:"FAST-ED-Score",ageYearsHelp:"Patientenalter in Jahren",systolicBpHelp:"Normal: 90-140 mmHg",diastolicBpHelp:"Normal: 60-90 mmHg",gfapTooltip:"Hirnverletzungs-Biomarker",gfapTooltipLong:"Glial Fibrillary Acidic Protein - Hirnverletzungs-Biomarker",gfapRange:"Bereich: {min} - {max} pg/mL",fastEdTooltip:"0-9 Skala für LVO-Screening",analyzeIchRisk:"ICB-Risiko analysieren",analyzeStrokeRisk:"Schlaganfall-Risiko analysieren",criticalPatient:"Kritischer Patient",comaAlert:"Patient ist komatös (GCS < 8). Schnelle Beurteilung erforderlich.",vigilanceReduction:"Vigilanzminderung (Verminderte Wachheit)",armParesis:"Armparese",legParesis:"Beinparese",eyeDeviation:"Blickdeviation",atrialFibrillation:"Vorhofflimmern",onNoacDoac:"NOAK/DOAK-Therapie",onAntiplatelets:"Thrombozytenaggregationshemmer",resultsTitle:"Bewertungsergebnisse",ichProbability:"ICB-Wahrscheinlichkeit",lvoProbability:"LVO-Wahrscheinlichkeit",riskLevel:"Risikostufe",riskLow:"Niedrig",riskModerate:"Mäßig",riskHigh:"Hoch",riskCritical:"Kritisch",driversTitle:"Modelltreiber",driversSubtitle:"Faktoren, die zur Vorhersage beitragen",ichDrivers:"ICB-Risikofaktoren",lvoDrivers:"LVO-Risikofaktoren",criticalAlertTitle:"KRITISCHES RISIKO ERKANNT",criticalAlertMessage:"Hohe Wahrscheinlichkeit einer intrazerebralen Blutung erkannt. Sofortige medizinische Behandlung erforderlich.",helpTitle:"Kurzreferenzleitfaden",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 8: Komatöser Patient - Koma-Modul verwenden",gcsMod:"GCS 8-12: Mäßige Beeinträchtigung",gcsHigh:"GCS 13-15: Leichte Beeinträchtigung",fastEdTitle:"FAST-ED-Score-Komponenten",fastEdFacial:"Faziale Parese: 0-1 Punkte",fastEdArm:"Armschwäche: 0-2 Punkte",fastEdSpeech:"Sprachveränderungen: 0-2 Punkte",fastEdTime:"Zeit: Kritischer Faktor",fastEdEye:"Blickdeviation: 0-2 Punkte",fastEdDenial:"Verneinung/Neglect: 0-2 Punkte",criticalValuesTitle:"Kritische Werte",criticalBp:"Systolischer RR > 180: Erhöhtes ICB-Risiko",criticalGfap:"GFAP > 500 pg/mL: Signifikanter Marker",criticalFastEd:"FAST-ED ≥ 4: LVO in Betracht ziehen",fastEdCalculatorTitle:"FAST-ED-Score-Rechner",fastEdCalculatorSubtitle:"Klicken Sie, um FAST-ED-Score-Komponenten zu berechnen",facialPalsyTitle:"Faziale Parese",facialPalsyNormal:"Normal (0)",facialPalsyMild:"Leichte Mundwinkelasymmetrie (1)",armWeaknessTitle:"Armschwäche",armWeaknessNormal:"Normal (0)",armWeaknessMild:"Leichter Armabfall (1)",armWeaknessSevere:"Arm fällt sofort ab (2)",speechChangesTitle:"Sprachveränderungen",speechChangesNormal:"Normal (0)",speechChangesMild:"Verwaschene Sprache (1)",speechChangesSevere:"Schwere Aphasie (2)",eyeDeviationTitle:"Blickdeviation",eyeDeviationNormal:"Normal (0)",eyeDeviationPartial:"Partielle Blickparese (1)",eyeDeviationForced:"Forcierte Blickdeviation (2)",denialNeglectTitle:"Verneinung/Neglect",denialNeglectNormal:"Normal (0)",denialNeglectPartial:"Partieller Neglect (1)",denialNeglectComplete:"Kompletter Neglect (2)",totalScoreTitle:"Gesamt-FAST-ED-Score",riskLevel:"Risikostufe",riskLevelLow:"NIEDRIG (Score <4)",riskLevelHigh:"HOCH (Score ≥4 - LVO erwägen)",applyScore:"Score Anwenden",cancel:"Abbrechen",modelDrivers:"Modelltreiber",modelDriversSubtitle:"Faktoren, die zur Vorhersage beitragen",contributingFactors:"Beitragende Faktoren",factorsShown:"angezeigt",positiveFactors:"Positive Faktoren",negativeFactors:"Negative Faktoren",clinicalInformation:"Klinische Informationen",clinicalRecommendations:"Klinische Empfehlungen",clinicalRec1:"Sofortige Bildgebung erwägen bei hohem ICB-Risiko",clinicalRec2:"Stroke-Team aktivieren bei LVO-Score ≥ 50%",clinicalRec3:"Blutdruck engmaschig überwachen",clinicalRec4:"Alle Befunde gründlich dokumentieren",noDriverData:"Keine Treiberdaten verfügbar",driverAnalysisUnavailable:"Treiberanalyse nicht verfügbar",driverInfoNotAvailable:"Treiberinformationen von diesem Vorhersagemodell nicht verfügbar",driverAnalysisNotAvailable:"Treiberanalyse für diese Vorhersage nicht verfügbar",lvoNotPossible:"LVO-Bewertung mit begrenzten Daten nicht möglich",fullExamRequired:"Vollständige neurologische Untersuchung für LVO-Screening erforderlich",limitedAssessment:"Begrenzte Bewertung",disclaimer:"Klinischer Haftungsausschluss",disclaimerText:"Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle. Kein Ersatz für ärztliche Beurteilung.",importantNote:"Wichtig",importantText:"Diese Ergebnisse dienen nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie institutionelle Protokolle.",inputSummaryTitle:"Eingabezusammenfassung",inputSummarySubtitle:"Für diese Analyse verwendete Werte",privacyLink:"Datenschutzrichtlinie",disclaimerLink:"Medizinischer Haftungsausschluss",versionLink:"Version 2.0.1",privacyPolicy:"Datenschutzrichtlinie: Dieses Tool verarbeitet Daten lokal. Keine Patientendaten werden gespeichert oder übertragen.",medicalDisclaimer:"Medizinischer Haftungsausschluss: Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle.",networkError:"Netzwerkfehler - bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut",requestTimeout:"Anfrage-Timeout - bitte versuchen Sie es erneut",apiError:"Ergebnisse konnten nicht abgerufen werden",validationError:"Bitte überprüfen Sie Ihre Eingabewerte",sessionTimeout:"Ihre Sitzung war 30 Minuten lang inaktiv. Möchten Sie fortfahren?",unsavedData:"Sie haben ungespeicherte Daten. Sind Sie sicher, dass Sie verlassen möchten?",nearestCentersTitle:"Nächstgelegene Schlaganfall-Zentren",useCurrentLocation:"Aktuellen Standort verwenden",enterLocationPlaceholder:"Stadt oder Adresse eingeben...",enterManually:"Standort manuell eingeben",search:"Suchen",yourLocation:"Ihr Standort",recommendedCenters:"Empfohlene Zentren",alternativeCenters:"Alternative Zentren",noCentersFound:"Keine Schlaganfall-Zentren in diesem Bereich gefunden",gettingLocation:"Standort wird ermittelt",searchingLocation:"Standort wird gesucht",locationError:"Standort konnte nicht ermittelt werden",locationPermissionDenied:"Standortzugriff verweigert. Bitte erlauben Sie Standortzugriff und versuchen Sie es erneut.",locationUnavailable:"Standortinformationen sind nicht verfügbar",locationTimeout:"Standortanfrage ist abgelaufen",geolocationNotSupported:"Geolokalisierung wird von diesem Browser nicht unterstützt",geocodingNotImplemented:"Standortsuche nicht verfügbar. Bitte verwenden Sie GPS oder geben Sie Koordinaten manuell ein.",tryManualEntry:"Versuchen Sie, Ihren Standort manuell einzugeben oder GPS zu verwenden.",distanceNote:"Entfernungen werden als Luftlinie berechnet. Tatsächliche Fahrzeiten können variieren.",travelTimeNote:"Fahrzeiten berechnet für Rettungsfahrzeuge mit Sondersignalen und Vorfahrtsberechtigung.",calculatingTravelTimes:"Fahrzeiten werden berechnet",minutes:"Min",poweredByOrs:"Fahrzeiten bereitgestellt von OpenRoute Service",comprehensiveCenter:"Überregionales Schlaganfall-Zentrum",primaryCenter:"Regionales Schlaganfall-Zentrum",telemetryCenter:"Telemedizin-Zentrum",thrombectomy:"Thrombektomie",neurosurgery:"Neurochirurgie",icu:"Intensivstation",telemedicine:"Telemedizin",stroke_unit:"Stroke Unit",call:"Anrufen",directions:"Wegbeschreibung",emergency:"Notfall",certified:"Zertifiziert"}};class te{constructor(){this.supportedLanguages=["en","de"],this.currentLanguage=this.detectLanguage()}detectLanguage(){const t=localStorage.getItem("language");return t&&this.supportedLanguages.includes(t)?t:(navigator.language||navigator.userLanguage).substring(0,2).toLowerCase()==="de"?"de":"en"}getCurrentLanguage(){return this.currentLanguage}setLanguage(t){return this.supportedLanguages.includes(t)?(this.currentLanguage=t,localStorage.setItem("language",t),window.dispatchEvent(new CustomEvent("languageChanged",{detail:{language:t}})),!0):!1}getSupportedLanguages(){return[...this.supportedLanguages]}t(t){return(q[this.currentLanguage]||q.en)[t]||t}toggleLanguage(){const t=this.currentLanguage==="en"?"de":"en";return this.setLanguage(t)}getLanguageDisplayName(t=null){const e=t||this.currentLanguage;return{en:"English",de:"Deutsch"}[e]||e}formatDateTime(t){const e=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(e,{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(t)}formatTime(t){const e=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(e,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(t)}}const A=new te,s=i=>A.t(i);function U(){return`
    <div class="container">
      ${y(1)}
      <h2>${s("triage1Title")}</h2>
      <div class="triage-question">
        ${s("triage1Question")}
        <small>${s("triage1Help")}</small>
      </div>
      <div class="triage-buttons">
        <button class="yes-btn" data-action="triage1" data-value="true">${s("triage1Yes")}</button>
        <button class="no-btn" data-action="triage1" data-value="false">${s("triage1No")}</button>
      </div>
    </div>
  `}function ie(){return`
    <div class="container">
      ${y(1)}
      <h2>${s("triage2Title")}</h2>
      <div class="triage-question">
        ${s("triage2Question")}
        <small>${s("triage2Help")}</small>
      </div>
      <div class="triage-buttons">
        <button class="yes-btn" data-action="triage2" data-value="true">${s("triage2Yes")}</button>
        <button class="no-btn" data-action="triage2" data-value="false">${s("triage2No")}</button>
      </div>
    </div>
  `}const f={COMA_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_coma_ich",LDM_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_limited_data_ich",FULL_STROKE:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_full_stroke"},_={ich:{high:60,critical:80},lvo:{high:50,critical:70}},g={min:29,max:10001},M={autoSaveInterval:3e4,sessionTimeout:30*60*1e3,requestTimeout:1e4},ae={age_years:{required:!0,min:0,max:120},systolic_bp:{required:!0,min:60,max:300},diastolic_bp:{required:!0,min:30,max:200},gfap_value:{required:!0,min:g.min,max:g.max},fast_ed_score:{required:!0,min:0,max:9}};function se(){return`
    <div class="container">
      ${y(2)}
      <h2>${s("comaModuleTitle")||"Coma Module"}</h2>
      <div class="critical-alert">
        <h4><span class="alert-icon">🚨</span> ${s("criticalPatient")}</h4>
        <p>${s("comaAlert")}</p>
      </div>
      <form data-module="coma">
        <div class="input-grid">
          <div class="input-group">
            <label for="gfap_value">
              ${s("gfapValueLabel")}
              <span class="tooltip">ℹ️
                <span class="tooltiptext">${s("gfapTooltipLong")}</span>
              </span>
            </label>
            <input type="number" id="gfap_value" name="gfap_value" min="${g.min}" max="${g.max}" step="0.1" required aria-describedby="gfap-help">
            <div id="gfap-help" class="input-help">
              ${s("gfapRange").replace("{min}",g.min).replace("{max}",g.max)}
            </div>
          </div>
        </div>
        <button type="submit" class="primary">${s("analyzeIchRisk")}</button>
        <button type="button" class="secondary" data-action="reset">${s("startOver")}</button>
      </form>
    </div>
  `}function ne(){return`
    <div class="container">
      ${y(2)}
      <h2>${s("limitedDataModuleTitle")||"Limited Data Module"}</h2>
      <form data-module="limited">
        <div class="input-grid">
          <div class="input-group">
            <label for="age_years">${s("ageYearsLabel")}</label>
            <input type="number" name="age_years" id="age_years" min="0" max="120" required aria-describedby="age-help">
            <div id="age-help" class="input-help">${s("ageYearsHelp")}</div>
          </div>
          <div class="input-group">
            <label for="systolic_bp">${s("systolicBpLabel")}</label>
            <input type="number" name="systolic_bp" id="systolic_bp" min="60" max="300" required aria-describedby="sbp-help">
            <div id="sbp-help" class="input-help">${s("systolicBpHelp")}</div>
          </div>
          <div class="input-group">
            <label for="diastolic_bp">${s("diastolicBpLabel")}</label>
            <input type="number" name="diastolic_bp" id="diastolic_bp" min="30" max="200" required aria-describedby="dbp-help">
            <div id="dbp-help" class="input-help">${s("diastolicBpHelp")}</div>
          </div>
          <div class="input-group">
            <label for="gfap_value">
              ${s("gfapValueLabel")}
              <span class="tooltip">ℹ️
                <span class="tooltiptext">${s("gfapTooltipLong")}</span>
              </span>
            </label>
            <input type="number" name="gfap_value" id="gfap_value" min="${g.min}" max="${g.max}" step="0.1" required>
          </div>
        </div>
        <div class="checkbox-group">
          <label class="checkbox-wrapper">
            <input type="checkbox" name="vigilanzminderung" id="vigilanzminderung">
            <span class="checkbox-label">${s("vigilanceReduction")}</span>
          </label>
        </div>
        <button type="submit" class="primary">${s("analyzeIchRisk")}</button>
        <button type="button" class="secondary" data-action="reset">${s("startOver")}</button>
      </form>
    </div>
  `}function re(){return`
    <div class="container">
      ${y(2)}
      <h2>${s("fullStrokeModuleTitle")||"Full Stroke Module"}</h2>
      <form data-module="full">
        <h3>${s("basicInformation")}</h3>
        <div class="input-grid">
          <div class="input-group">
            <label for="age_years">${s("ageYearsLabel")}</label>
            <input type="number" name="age_years" id="age_years" min="0" max="120" required>
          </div>
          <div class="input-group">
            <label for="systolic_bp">${s("systolicBpLabel")}</label>
            <input type="number" name="systolic_bp" id="systolic_bp" min="60" max="300" required>
          </div>
          <div class="input-group">
            <label for="diastolic_bp">${s("diastolicBpLabel")}</label>
            <input type="number" name="diastolic_bp" id="diastolic_bp" min="30" max="200" required>
          </div>
        </div>

        <h3>${s("biomarkersScores")}</h3>
        <div class="input-grid">
          <div class="input-group">
            <label for="gfap_value">
              ${s("gfapValueLabel")}
              <span class="tooltip">ℹ️
                <span class="tooltiptext">${s("gfapTooltip")}</span>
              </span>
            </label>
            <input type="number" name="gfap_value" id="gfap_value" min="${g.min}" max="${g.max}" step="0.1" required>
          </div>
          <div class="input-group">
            <label for="fast_ed_score">
              ${s("fastEdScoreLabel")}
              <span class="tooltip">ℹ️
                <span class="tooltiptext">${s("fastEdCalculatorSubtitle")}</span>
              </span>
            </label>
            <input type="number" name="fast_ed_score" id="fast_ed_score" min="0" max="9" required readonly placeholder="${s("fastEdCalculatorSubtitle")}" style="cursor: pointer;">
            <input type="hidden" name="armparese" id="armparese_hidden" value="false">
          </div>
        </div>

        <h3>${s("clinicalSymptoms")}</h3>
        <div class="input-grid">
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="headache" id="headache">
              <span class="checkbox-label">${s("headacheLabel")}</span>
            </label>
            <label class="checkbox-wrapper">
              <input type="checkbox" name="vigilanzminderung" id="vigilanzminderung">
              <span class="checkbox-label">${s("vigilanzLabel")}</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="beinparese" id="beinparese">
              <span class="checkbox-label">${s("legParesis")}</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="eye_deviation" id="eye_deviation">
              <span class="checkbox-label">${s("eyeDeviation")}</span>
            </label>
          </div>
        </div>

        <h3>${s("medicalHistory")}</h3>
        <div class="input-grid">
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="atrial_fibrillation" id="atrial_fibrillation">
              <span class="checkbox-label">${s("atrialFibrillation")}</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="anticoagulated_noak" id="anticoagulated_noak">
              <span class="checkbox-label">${s("onNoacDoac")}</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="antiplatelets" id="antiplatelets">
              <span class="checkbox-label">${s("onAntiplatelets")}</span>
            </label>
          </div>
        </div>

        <button type="submit" class="primary">${s("analyzeStrokeRisk")}</button>
        <button type="button" class="secondary" data-action="reset">${s("startOver")}</button>
      </form>
    </div>
  `}function oe(){return`
    <div class="critical-alert">
      <h4><span class="alert-icon">🚨</span> CRITICAL FINDING</h4>
      <p>High probability of intracerebral hemorrhage detected.</p>
      <p><strong>Immediate actions required:</strong></p>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>Initiate stroke protocol immediately</li>
        <li>Urgent CT imaging required</li>
        <li>Consider blood pressure management</li>
        <li>Prepare for potential neurosurgical consultation</li>
      </ul>
    </div>
  `}function le(i){return!i||typeof i!="object"?{kind:"unavailable",units:null,positive:[],negative:[],meta:{}}:i.kind?i:i.shap_values||i.kind&&i.kind==="shap_values"?ce(i):i.logistic_contributions||i.kind&&i.kind==="logistic_contributions"?de(i):me(i)?ue(i):{kind:"unavailable",units:null,positive:[],negative:[],meta:{}}}function ce(i){const t=i.shap_values||i,e=[];Array.isArray(t)?t.forEach((o,l)=>{typeof o=="object"&&o.feature&&o.value!==void 0?e.push({label:o.feature,weight:o.value}):typeof o=="number"&&e.push({label:`Feature ${l}`,weight:o})}):typeof t=="object"&&Object.entries(t).forEach(([o,l])=>{typeof l=="number"&&e.push({label:o,weight:l})}),e.sort((o,l)=>Math.abs(l.weight)-Math.abs(o.weight));const a=e.filter(o=>o.weight>0),n=e.filter(o=>o.weight<0),r={};return i.base_value!==void 0&&(r.base_value=i.base_value),i.contrib_sum!==void 0&&(r.contrib_sum=i.contrib_sum),i.logit_total!==void 0&&(r.logit_total=i.logit_total),{kind:"shap_values",units:"logit",positive:a,negative:n,meta:r}}function de(i){const t=i.logistic_contributions||i,e=[];typeof t=="object"&&Object.entries(t).forEach(([o,l])=>{typeof l=="number"&&!["intercept","contrib_sum","logit_total"].includes(o)&&e.push({label:o,weight:l})}),e.sort((o,l)=>Math.abs(l.weight)-Math.abs(o.weight));const a=e.filter(o=>o.weight>0),n=e.filter(o=>o.weight<0),r={};return t.intercept!==void 0&&(r.base_value=t.intercept),t.contrib_sum!==void 0&&(r.contrib_sum=t.contrib_sum),t.logit_total!==void 0&&(r.logit_total=t.logit_total),i.contrib_sum!==void 0&&(r.contrib_sum=i.contrib_sum),{kind:"logistic_contributions",units:"logit",positive:a,negative:n,meta:r}}function ue(i){const t=[];Object.entries(i).forEach(([n,r])=>{typeof r=="number"&&t.push({label:n,weight:r})}),t.sort((n,r)=>Math.abs(r.weight)-Math.abs(n.weight));const e=t.filter(n=>n.weight>0),a=t.filter(n=>n.weight<0);return{kind:"raw_weights",units:null,positive:e,negative:a,meta:{}}}function me(i){return Object.values(i).every(t=>typeof t=="number")}function pe(i,t){if(!(i!=null&&i.drivers)&&!(t!=null&&t.drivers))return"";let e=`
    <div class="drivers-section">
      <div class="drivers-header">
        <h3><span class="driver-header-icon">🎯</span> ${s("modelDrivers")}</h3>
        <p class="drivers-subtitle">${s("modelDriversSubtitle")}</p>
      </div>
      <div class="enhanced-drivers-grid">
  `;return i!=null&&i.drivers&&(e+=K(i.drivers,"ICH","ich",i.probability)),t!=null&&t.drivers&&!t.notPossible&&(e+=K(t.drivers,"LVO","lvo",t.probability)),e+=`
      </div>
    </div>
  `,e}function K(i,t,e,a){if(!i||Object.keys(i).length===0)return`
      <div class="enhanced-drivers-panel ${e}">
        <div class="panel-header">
          <div class="panel-icon ${e}">${e==="ich"?"🧠":"🩸"}</div>
          <div class="panel-title">
            <h4>${t} Risk Factors</h4>
            <span class="panel-subtitle">${s("noDriverData")}</span>
          </div>
        </div>
        <p class="no-drivers-message">
          ${s("driverInfoNotAvailable")}
        </p>
      </div>
    `;const n=le(i);if(n.kind==="unavailable")return`
      <div class="enhanced-drivers-panel ${e}">
        <div class="panel-header">
          <div class="panel-icon ${e}">${e==="ich"?"🧠":"🩸"}</div>
          <div class="panel-title">
            <h4>${t} Risk Factors</h4>
            <span class="panel-subtitle">${s("driverAnalysisUnavailable")}</span>
          </div>
        </div>
        <p class="no-drivers-message">
          ${s("driverAnalysisNotAvailable")}
        </p>
      </div>
    `;const r=[...n.positive,...n.negative].sort((l,c)=>Math.abs(c.weight)-Math.abs(l.weight)).slice(0,8);let o=`
    <div class="enhanced-drivers-panel ${e}">
      <div class="panel-header">
        <div class="panel-icon ${e}">${e==="ich"?"🧠":"🩸"}</div>
        <div class="panel-title">
          <h4>${t} Risk Factors</h4>
          <span class="panel-subtitle">${s("contributingFactors")} (${r.length} ${s("factorsShown")})</span>
        </div>
      </div>
      
      <div class="drivers-chart">
  `;if(r.length>0){const l=Math.max(...r.map(c=>Math.abs(c.weight)));r.forEach((c,u)=>{const p=c.weight,h=p>0,k=Math.abs(p*100),S=Math.abs(p)/l*100,L=c.label.replace(/_/g," ").replace(/\b\w/g,T=>T.toUpperCase());o+=`
        <div class="enhanced-driver-item">
          <div class="driver-info">
            <span class="driver-label">${L}</span>
            <div class="driver-impact ${h?"positive":"negative"}">
              ${h?"↑":"↓"} ${k.toFixed(1)}%
            </div>
          </div>
          <div class="driver-bar-wrapper">
            <div class="driver-bar-track">
              <div class="driver-bar ${h?"positive":"negative"}" 
                   style="width: ${S}%"
                   data-weight="${p.toFixed(3)}">
                <div class="bar-glow"></div>
              </div>
            </div>
          </div>
        </div>
      `})}return o+=`
      </div>
      
      <div class="drivers-summary">
        <div class="summary-stats">
          <span class="stat-item">
            <span class="stat-label">${s("positiveFactors")}:</span>
            <span class="stat-value positive">${n.positive.length}</span>
          </span>
          <span class="stat-item">
            <span class="stat-label">${s("negativeFactors")}:</span>
            <span class="stat-value negative">${n.negative.length}</span>
          </span>
        </div>
      </div>
    </div>
  `,o}const Y=[{id:"uniklinik-freiburg",name:"Universitätsklinikum Freiburg",type:"comprehensive",address:"Hugstetter Str. 55, 79106 Freiburg im Breisgau",coordinates:{lat:48.0025,lng:7.8347},phone:"+49 761 270-0",emergency:"+49 761 270-34010",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"uniklinik-heidelberg",name:"Universitätsklinikum Heidelberg",type:"comprehensive",address:"Im Neuenheimer Feld 400, 69120 Heidelberg",coordinates:{lat:49.4178,lng:8.6706},phone:"+49 6221 56-0",emergency:"+49 6221 56-36643",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"uniklinik-tuebingen",name:"Universitätsklinikum Tübingen",type:"comprehensive",address:"Geissweg 3, 72076 Tübingen",coordinates:{lat:48.5378,lng:9.0538},phone:"+49 7071 29-0",emergency:"+49 7071 29-82211",services:["thrombectory","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"uniklinik-ulm",name:"Universitätsklinikum Ulm",type:"comprehensive",address:"Albert-Einstein-Allee 23, 89081 Ulm",coordinates:{lat:48.4196,lng:9.9592},phone:"+49 731 500-0",emergency:"+49 731 500-63001",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"klinikum-stuttgart",name:"Klinikum Stuttgart - Katharinenhospital",type:"comprehensive",address:"Kriegsbergstraße 60, 70174 Stuttgart",coordinates:{lat:48.7784,lng:9.1682},phone:"+49 711 278-0",emergency:"+49 711 278-32001",services:["thrombectomy","neurosurgery","icu"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"robert-bosch-stuttgart",name:"Robert-Bosch-Krankenhaus Stuttgart",type:"primary",address:"Auerbachstraße 110, 70376 Stuttgart",coordinates:{lat:48.7447,lng:9.2294},phone:"+49 711 8101-0",emergency:"+49 711 8101-3456",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"diakonie-stuttgart",name:"Diakonie-Klinikum Stuttgart",type:"primary",address:"Rosenbergstraße 38, 70176 Stuttgart",coordinates:{lat:48.7861,lng:9.1736},phone:"+49 711 991-0",emergency:"+49 711 991-2201",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"rkh-ludwigsburg",name:"RKH Klinikum Ludwigsburg",type:"primary",address:"Posilipostraße 4, 71640 Ludwigsburg",coordinates:{lat:48.8901,lng:9.1953},phone:"+49 7141 99-0",emergency:"+49 7141 99-67201",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-karlsruhe",name:"Städtisches Klinikum Karlsruhe",type:"comprehensive",address:"Moltkestraße 90, 76133 Karlsruhe",coordinates:{lat:49.0047,lng:8.3858},phone:"+49 721 974-0",emergency:"+49 721 974-2301",services:["thrombectomy","neurosurgery","icu"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"vincentius-karlsruhe",name:"ViDia Kliniken Karlsruhe - St. Vincentius",type:"primary",address:"Südendstraße 32, 76135 Karlsruhe",coordinates:{lat:48.9903,lng:8.3711},phone:"+49 721 8108-0",emergency:"+49 721 8108-9201",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-mannheim",name:"Universitätsmedizin Mannheim",type:"comprehensive",address:"Theodor-Kutzer-Ufer 1-3, 68167 Mannheim",coordinates:{lat:49.4828,lng:8.4664},phone:"+49 621 383-0",emergency:"+49 621 383-2251",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"theresienkrankenhaus-mannheim",name:"Theresienkrankenhaus Mannheim",type:"primary",address:"Bassermannstraße 1, 68165 Mannheim",coordinates:{lat:49.4904,lng:8.4594},phone:"+49 621 424-0",emergency:"+49 621 424-2101",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-pforzheim",name:"Helios Klinikum Pforzheim",type:"primary",address:"Kanzlerstraße 2-6, 75175 Pforzheim",coordinates:{lat:48.8833,lng:8.6936},phone:"+49 7231 969-0",emergency:"+49 7231 969-2301",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"zollernalb-klinikum",name:"Zollernalb Klinikum Albstadt",type:"primary",address:"Zollernring 10-14, 72488 Sigmaringen",coordinates:{lat:48.0878,lng:9.2233},phone:"+49 7571 100-0",emergency:"+49 7571 100-1501",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-konstanz",name:"Gesundheitsverbund Landkreis Konstanz",type:"primary",address:"Mainaustraße 14, 78464 Konstanz",coordinates:{lat:47.6779,lng:9.1732},phone:"+49 7531 801-0",emergency:"+49 7531 801-2301",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-friedrichshafen",name:"Klinikum Friedrichshafen",type:"primary",address:"Röntgenstraße 2, 88048 Friedrichshafen",coordinates:{lat:47.6587,lng:9.4685},phone:"+49 7541 96-0",emergency:"+49 7541 96-2401",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"oberschwabenklinik-ravensburg",name:"Oberschwabenklinik Ravensburg",type:"primary",address:"Elisabethenstraße 17, 88212 Ravensburg",coordinates:{lat:47.7815,lng:9.6078},phone:"+49 751 87-0",emergency:"+49 751 87-2201",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"alb-donau-klinikum",name:"Alb Donau Klinikum Ehingen",type:"primary",address:"Schwörhausgasse 7, 89584 Ehingen",coordinates:{lat:48.2833,lng:9.7262},phone:"+49 7391 789-0",emergency:"+49 7391 789-1801",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"ortenau-klinikum-offenburg",name:"Ortenau Klinikum Offenburg",type:"primary",address:"Ebertplatz 12, 77654 Offenburg",coordinates:{lat:48.4706,lng:7.9444},phone:"+49 781 472-0",emergency:"+49 781 472-2001",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-baden-baden",name:"Klinikum Mittelbaden Baden-Baden",type:"primary",address:"Balger Str. 50, 76532 Baden-Baden",coordinates:{lat:48.7606,lng:8.2275},phone:"+49 7221 91-0",emergency:"+49 7221 91-1701",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"}];function D(i,t,e,a){const r=$(e-i),o=$(a-t),l=Math.sin(r/2)*Math.sin(r/2)+Math.cos($(i))*Math.cos($(e))*Math.sin(o/2)*Math.sin(o/2);return 6371*(2*Math.atan2(Math.sqrt(l),Math.sqrt(1-l)))}function $(i){return i*(Math.PI/180)}async function Z(i,t,e,a,n="driving-car"){try{const r=`https://api.openrouteservice.org/v2/directions/${n}`,l=await fetch(r,{method:"POST",headers:{Accept:"application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",Authorization:"5b3ce3597851110001cf624868c4c27b63ae476c9c26c8bffbc35688","Content-Type":"application/json; charset=utf-8"},body:JSON.stringify({coordinates:[[t,i],[a,e]],radiuses:[1e3,1e3],format:"json"})});if(!l.ok)throw new Error(`Routing API error: ${l.status}`);const c=await l.json();if(c.routes&&c.routes.length>0){const u=c.routes[0];return{duration:Math.round(u.summary.duration/60),distance:Math.round(u.summary.distance/1e3),source:"routing"}}else throw new Error("No route found")}catch(r){console.warn("Travel time calculation failed, using distance estimate:",r);const o=D(i,t,e,a);return{duration:Math.round(o/.8),distance:Math.round(o),source:"estimated"}}}async function ge(i,t,e,a){try{const n=await Z(i,t,e,a,"driving-car");return{duration:Math.round(n.duration*.75),distance:n.distance,source:n.source==="routing"?"emergency-routing":"emergency-estimated"}}catch{const r=D(i,t,e,a);return{duration:Math.round(r/1.2),distance:Math.round(r),source:"emergency-estimated"}}}async function he(i,t,e=5,a=120,n=!0){return console.log("Calculating travel times to stroke centers..."),(await Promise.all(Y.map(async o=>{try{const l=n?await ge(i,t,o.coordinates.lat,o.coordinates.lng):await Z(i,t,o.coordinates.lat,o.coordinates.lng);return{...o,travelTime:l.duration,distance:l.distance,travelSource:l.source}}catch(l){console.warn(`Failed to calculate travel time to ${o.name}:`,l);const c=D(i,t,o.coordinates.lat,o.coordinates.lng);return{...o,travelTime:Math.round(c/.8),distance:Math.round(c),travelSource:"fallback"}}}))).filter(o=>o.travelTime<=a).sort((o,l)=>o.travelTime-l.travelTime).slice(0,e)}function ve(i,t,e=5,a=100){return Y.map(r=>({...r,distance:D(i,t,r.coordinates.lat,r.coordinates.lng)})).filter(r=>r.distance<=a).sort((r,o)=>r.distance-o.distance).slice(0,e)}async function be(i,t,e="stroke"){const a=await he(i,t,10,120,!0);if(e==="lvo"||e==="thrombectomy"){const n=a.filter(o=>o.type==="comprehensive"&&o.services.includes("thrombectomy")&&o.travelTime<=60),r=a.filter(o=>o.type==="primary");return{recommended:n.slice(0,3),alternative:r.slice(0,2)}}if(e==="ich"){const n=a.filter(r=>r.services.includes("neurosurgery")&&r.travelTime<=45);return{recommended:n.slice(0,3),alternative:a.filter(r=>!n.includes(r)).slice(0,2)}}return{recommended:a.slice(0,5),alternative:[]}}function fe(i,t,e="stroke"){const a=ve(i,t,10);if(e==="lvo"||e==="thrombectomy"){const n=a.filter(o=>o.type==="comprehensive"&&o.services.includes("thrombectomy")),r=a.filter(o=>o.type==="primary");return{recommended:n.slice(0,3),alternative:r.slice(0,2)}}return{recommended:a.slice(0,5),alternative:[]}}function ye(i){return`
    <div class="stroke-center-section">
      <h3>🏥 ${s("nearestCentersTitle")}</h3>
      <div id="locationContainer">
        <div class="location-controls">
          <button type="button" id="useGpsButton" class="secondary">
            📍 ${s("useCurrentLocation")}
          </button>
          <div class="location-manual" style="display: none;">
            <input type="text" id="locationInput" placeholder="${s("enterLocationPlaceholder")}" />
            <button type="button" id="searchLocationButton" class="secondary">${s("search")}</button>
          </div>
          <button type="button" id="manualLocationButton" class="secondary">
            ✏️ ${s("enterManually")}
          </button>
        </div>
        <div id="strokeCenterResults" class="stroke-center-results"></div>
      </div>
    </div>
  `}function ke(i){const t=document.getElementById("useGpsButton"),e=document.getElementById("manualLocationButton"),a=document.querySelector(".location-manual"),n=document.getElementById("locationInput"),r=document.getElementById("searchLocationButton"),o=document.getElementById("strokeCenterResults");t&&t.addEventListener("click",()=>{Se(i,o)}),e&&e.addEventListener("click",()=>{a.style.display=a.style.display==="none"?"block":"none"}),r&&r.addEventListener("click",()=>{const l=n.value.trim();l&&W(l,i,o)}),n&&n.addEventListener("keypress",l=>{if(l.key==="Enter"){const c=n.value.trim();c&&W(c,i,o)}})}function Se(i,t){if(!navigator.geolocation){I(s("geolocationNotSupported"),t);return}t.innerHTML=`<div class="loading">${s("gettingLocation")}...</div>`,navigator.geolocation.getCurrentPosition(e=>{const{latitude:a,longitude:n}=e.coords;Le(a,n,i,t)},e=>{let a=s("locationError");switch(e.code){case e.PERMISSION_DENIED:a=s("locationPermissionDenied");break;case e.POSITION_UNAVAILABLE:a=s("locationUnavailable");break;case e.TIMEOUT:a=s("locationTimeout");break}I(a,t)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:3e5})}async function W(i,t,e){e.innerHTML=`<div class="loading">${s("searchingLocation")}...</div>`,I(s("geocodingNotImplemented"),e)}async function Le(i,t,e,a){const n=Te(e);a.innerHTML=`
    <div class="location-info">
      <p><strong>${s("yourLocation")}:</strong> ${i.toFixed(4)}, ${t.toFixed(4)}</p>
    </div>
    <div class="loading">${s("calculatingTravelTimes")}...</div>
  `;try{const r=await be(i,t,n),o=`
      <div class="location-info">
        <p><strong>${s("yourLocation")}:</strong> ${i.toFixed(4)}, ${t.toFixed(4)}</p>
      </div>
      
      <div class="recommended-centers">
        <h4>${s("recommendedCenters")}</h4>
        ${E(r.recommended,!0)}
      </div>
      
      ${r.alternative.length>0?`
        <div class="alternative-centers">
          <h4>${s("alternativeCenters")}</h4>
          ${E(r.alternative,!1)}
        </div>
      `:""}
      
      <div class="travel-time-note">
        <small>${s("travelTimeNote")}</small>
        <br><small class="powered-by">${s("poweredByOrs")}</small>
      </div>
    `;a.innerHTML=o}catch(r){console.warn("Travel time calculation failed, falling back to distance:",r);const o=fe(i,t,n),l=`
      <div class="location-info">
        <p><strong>${s("yourLocation")}:</strong> ${i.toFixed(4)}, ${t.toFixed(4)}</p>
      </div>
      
      <div class="recommended-centers">
        <h4>${s("recommendedCenters")}</h4>
        ${E(o.recommended,!0)}
      </div>
      
      ${o.alternative.length>0?`
        <div class="alternative-centers">
          <h4>${s("alternativeCenters")}</h4>
          ${E(o.alternative,!1)}
        </div>
      `:""}
      
      <div class="distance-note">
        <small>${s("distanceNote")}</small>
      </div>
    `;a.innerHTML=l}}function E(i,t=!1){return!i||i.length===0?`<p>${s("noCentersFound")}</p>`:i.map(e=>`
    <div class="stroke-center-card ${t?"recommended":"alternative"}">
      <div class="center-header">
        <h5>${e.name}</h5>
        <span class="center-type ${e.type}">${s(e.type+"Center")}</span>
        ${e.travelTime?`
          <span class="travel-time">
            <span class="time">${e.travelTime} ${s("minutes")}</span>
            <span class="distance">(${e.distance} km)</span>
          </span>
        `:`
          <span class="distance">${e.distance.toFixed(1)} km</span>
        `}
      </div>
      
      <div class="center-details">
        <p class="address">📍 ${e.address}</p>
        <p class="phone">📞 ${s("emergency")}: ${e.emergency}</p>
        
        <div class="services">
          ${e.services.map(a=>`
            <span class="service-badge">${s(a)}</span>
          `).join("")}
        </div>
        
        ${e.certified?`
          <div class="certification">
            ✅ ${s("certified")}: ${e.certification}
          </div>
        `:""}
      </div>
      
      <div class="center-actions">
        <button class="call-button" onclick="window.open('tel:${e.emergency}')">
          📞 ${s("call")}
        </button>
        <button class="directions-button" onclick="window.open('https://maps.google.com/maps?daddr=${e.coordinates.lat},${e.coordinates.lng}', '_blank')">
          🧭 ${s("directions")}
        </button>
      </div>
    </div>
  `).join("")}function Te(i){return i?i.lvo&&i.lvo.probability>.5?"lvo":i.ich&&i.ich.probability>.6?"ich":"stroke":"stroke"}function I(i,t){t.innerHTML=`
    <div class="location-error">
      <p>⚠️ ${i}</p>
      <p><small>${s("tryManualEntry")}</small></p>
    </div>
  `}function we(i,t){const e=Number(i),a=_[t];return e>=a.critical?"🔴 CRITICAL RISK":e>=a.high?"🟠 HIGH RISK":e>=30?"🟡 MODERATE RISK":"🟢 LOW RISK"}function $e(){const t=m.getState().formData;if(!t||Object.keys(t).length===0)return"";let e="";return Object.entries(t).forEach(([a,n])=>{if(n&&Object.keys(n).length>0){const r=s(`${a}ModuleTitle`)||a.charAt(0).toUpperCase()+a.slice(1);let o="";Object.entries(n).forEach(([l,c])=>{if(c===""||c===null||c===void 0)return;let u=l;s(`${l}Label`)?u=s(`${l}Label`):u=l.replace(/_/g," ").replace(/\b\w/g,h=>h.toUpperCase());let p=c;typeof c=="boolean"&&(p=c?"✓":"✗"),o+=`
          <div class="summary-item">
            <span class="summary-label">${u}:</span>
            <span class="summary-value">${p}</span>
          </div>
        `}),o&&(e+=`
          <div class="summary-module">
            <h4>${r}</h4>
            <div class="summary-items">
              ${o}
            </div>
          </div>
        `)}}),e?`
    <div class="input-summary">
      <h3>📋 ${s("inputSummaryTitle")}</h3>
      <p class="summary-subtitle">${s("inputSummarySubtitle")}</p>
      <div class="summary-content">
        ${e}
      </div>
    </div>
  `:""}function j(i,t,e){if(!t)return"";const a=Math.round((t.probability||0)*100),n=we(a,i),r=a>_[i].critical,o=a>_[i].high,l={ich:"🧠",lvo:"🩸"},c={ich:s("ichProbability"),lvo:s("lvoProbability")};return`
    <div class="enhanced-risk-card ${i} ${r?"critical":o?"high":"normal"}">
      <div class="risk-header">
        <div class="risk-icon">${l[i]}</div>
        <div class="risk-title">
          <h3>${c[i]}</h3>
          <span class="risk-module">${t.module} Module</span>
        </div>
      </div>
      
      <div class="risk-probability">
        <div class="probability-circle" data-percent="${a}">
          <div class="probability-number">${a}<span>%</span></div>
          <svg class="probability-ring" width="120" height="120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border-color)" stroke-width="8"/>
            <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" stroke-width="8" 
                    stroke-dasharray="${2*Math.PI*54}" 
                    stroke-dashoffset="${2*Math.PI*54*(1-a/100)}"
                    stroke-linecap="round" 
                    transform="rotate(-90 60 60)"
                    class="probability-progress"/>
          </svg>
        </div>
        
        <div class="risk-assessment">
          <div class="risk-level ${r?"critical":o?"high":"normal"}">
            ${n}
          </div>
        </div>
      </div>
    </div>
  `}function Ee(){return`
    <div class="enhanced-risk-card lvo not-possible">
      <div class="risk-header">
        <div class="risk-icon">🔍</div>
        <div class="risk-title">
          <h3>${s("lvoProbability")}</h3>
          <span class="risk-module">${s("limitedAssessment")}</span>
        </div>
      </div>
      
      <div class="not-possible-content">
        <p>${s("lvoNotPossible")}</p>
        <p>${s("fullExamRequired")}</p>
      </div>
    </div>
  `}function De(i,t){const{ich:e,lvo:a}=i,n=j("ich",e),r=a!=null&&a.notPossible?Ee():j("lvo",a),o=e&&e.probability>.6?oe():"",l=pe(e,a),c=ye(),u=$e();return`
    <div class="container">
      ${y(3)}
      <h2>${s("resultsTitle")}</h2>
      ${o}
      
      <!-- Primary Risk Results -->
      <div class="risk-results-grid">
        ${n}
        ${r}
      </div>
      
      <!-- Model Drivers - Prominent Display -->
      <div class="enhanced-drivers-section">
        ${l}
      </div>
      
      <!-- Collapsible Additional Information -->
      <div class="additional-info-section">
        <button class="info-toggle" data-target="input-summary">
          <span class="toggle-icon">📋</span>
          <span class="toggle-text">${s("inputSummaryTitle")}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="input-summary" style="display: none;">
          ${u}
        </div>
        
        <button class="info-toggle" data-target="stroke-centers">
          <span class="toggle-icon">🏥</span>
          <span class="toggle-text">${s("nearestCentersTitle")}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="stroke-centers" style="display: none;">
          ${c}
        </div>
        
        <button class="info-toggle" data-target="clinical-info">
          <span class="toggle-icon">ℹ️</span>
          <span class="toggle-text">${s("clinicalInformation")}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="clinical-info" style="display: none;">
          <div class="clinical-recommendations">
            <h4>${s("clinicalRecommendations")}</h4>
            <ul>
              <li>${s("clinicalRec1")}</li>
              <li>${s("clinicalRec2")}</li>
              <li>${s("clinicalRec3")}</li>
              <li>${s("clinicalRec4")}</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="results-actions">
        <div class="primary-actions">
          <button type="button" class="primary" id="printResults"> 📄 ${s("printResults")} </button>
          <button type="button" class="secondary" data-action="reset"> ${s("newAssessment")} </button>
        </div>
        <div class="navigation-actions">
          <button type="button" class="tertiary" data-action="goBack"> ← ${s("goBack")} </button>
          <button type="button" class="tertiary" data-action="goHome"> 🏠 ${s("goHome")} </button>
        </div>
      </div>
      
      <div class="disclaimer">
        <strong>⚠️ ${s("importantNote")}:</strong> ${s("importantText")} Results generated at ${new Date().toLocaleTimeString()}.
      </div>
    </div>
  `}function Ce(i,t,e){const a=[];return e.required&&!t&&t!==0&&a.push("This field is required"),e.min!==void 0&&t!==""&&!isNaN(t)&&parseFloat(t)<e.min&&a.push(`Value must be at least ${e.min}`),e.max!==void 0&&t!==""&&!isNaN(t)&&parseFloat(t)>e.max&&a.push(`Value must be at most ${e.max}`),e.pattern&&!e.pattern.test(t)&&a.push("Invalid format"),a}function Ae(i){let t=!0;const e={};return Object.entries(ae).forEach(([a,n])=>{const r=i.elements[a];if(r){const o=Ce(a,r.value,n);o.length>0&&(e[a]=o,t=!1)}}),{isValid:t,validationErrors:e}}function _e(i,t){Object.entries(t).forEach(([e,a])=>{const n=i.querySelector(`[name="${e}"]`);if(n){const r=n.closest(".input-group");if(r){r.classList.add("error"),r.querySelectorAll(".error-message").forEach(l=>l.remove());const o=document.createElement("div");o.className="error-message",o.innerHTML=`<span class="error-icon">⚠️</span> ${a[0]}`,r.appendChild(o)}}})}function Me(i){i.querySelectorAll(".input-group.error").forEach(t=>{t.classList.remove("error"),t.querySelectorAll(".error-message").forEach(e=>e.remove())})}class v extends Error{constructor(t,e,a){super(t),this.name="APIError",this.status=e,this.url=a}}function P(i){const t={...i};return Object.keys(t).forEach(e=>{const a=t[e];(typeof a=="boolean"||a==="on"||a==="true"||a==="false")&&(t[e]=a===!0||a==="on"||a==="true"?1:0)}),t}function b(i,t=0){const e=parseFloat(i);return isNaN(e)?t:e}async function N(i,t){const e=new AbortController,a=setTimeout(()=>e.abort(),M.requestTimeout);try{const n=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(t),signal:e.signal,mode:"cors"});if(clearTimeout(a),!n.ok){let o=`HTTP ${n.status}`;try{const l=await n.json();o=l.error||l.message||o}catch{o=`${o}: ${n.statusText}`}throw new v(o,n.status,i)}return await n.json()}catch(n){throw clearTimeout(a),n.name==="AbortError"?new v("Request timeout - please try again",408,i):n instanceof v?n:new v("Network error - please check your connection and try again",0,i)}}async function Ie(i){const t=P(i);console.log("Coma ICH API Payload:",t);try{const e=await N(f.COMA_ICH,t);return console.log("Coma ICH API Response:",e),{probability:b(e.probability||e.ich_probability,0),drivers:e.drivers||null,confidence:b(e.confidence,.75),module:"Coma"}}catch(e){throw console.error("Coma ICH prediction failed:",e),new v(`Failed to get ICH prediction: ${e.message}`,e.status,f.COMA_ICH)}}async function Pe(i){const t={age_years:i.age_years,systolic_bp:i.systolic_bp,diastolic_bp:i.diastolic_bp,gfap_value:i.gfap_value,vigilanzminderung:i.vigilanzminderung||0},e=P(t);console.log("Limited Data ICH API Payload:",e);try{const a=await N(f.LDM_ICH,e);return console.log("Limited Data ICH API Response:",a),{probability:b(a.probability||a.ich_probability,0),drivers:a.drivers||null,confidence:b(a.confidence,.65),module:"Limited Data"}}catch(a){throw console.error("Limited Data ICH prediction failed:",a),new v(`Failed to get ICH prediction: ${a.message}`,a.status,f.LDM_ICH)}}async function Ne(i){var a,n,r,o,l,c,u,p,h,k,S,L,T,R,F,x,H,z;const t={age_years:i.age_years,systolic_bp:i.systolic_bp,diastolic_bp:i.diastolic_bp,gfap_value:i.gfap_value,fast_ed_score:i.fast_ed_score,headache:i.headache||0,vigilanzminderung:i.vigilanzminderung||0,armparese:i.armparese||0,beinparese:i.beinparese||0,eye_deviation:i.eye_deviation||0,atrial_fibrillation:i.atrial_fibrillation||0,anticoagulated_noak:i.anticoagulated_noak||0,antiplatelets:i.antiplatelets||0},e=P(t);console.log("Full Stroke API Payload:",e);try{const d=await N(f.FULL_STROKE,e);console.log("Full Stroke API Response:",d),console.log("Available keys in response:",Object.keys(d)),console.log("Response type:",typeof d),Object.keys(d).forEach(V=>{const w=d[V];typeof w=="number"&&w>=0&&w<=1&&console.log(`Potential probability field: ${V} = ${w}`)});const O=b(((a=d.ich_prediction)==null?void 0:a.probability)||d.ich_probability||((n=d.ich)==null?void 0:n.probability)||d.ICH_probability||d.ich_prob||((r=d.probability)==null?void 0:r.ich)||((o=d.results)==null?void 0:o.ich_probability),0),G=b(((l=d.lvo_prediction)==null?void 0:l.probability)||d.lvo_probability||((c=d.lvo)==null?void 0:c.probability)||d.LVO_probability||d.lvo_prob||((u=d.probability)==null?void 0:u.lvo)||((p=d.results)==null?void 0:p.lvo_probability),0);console.log("Extracted probabilities:",{ich:O,lvo:G});const Q={probability:O,drivers:((h=d.ich_prediction)==null?void 0:h.drivers)||d.ich_drivers||((k=d.ich)==null?void 0:k.drivers)||((S=d.drivers)==null?void 0:S.ich)||null,confidence:b(((L=d.ich_prediction)==null?void 0:L.confidence)||d.ich_confidence||((T=d.ich)==null?void 0:T.confidence),.85),module:"Full Stroke"},X={probability:G,drivers:((R=d.lvo_prediction)==null?void 0:R.drivers)||d.lvo_drivers||((F=d.lvo)==null?void 0:F.drivers)||((x=d.drivers)==null?void 0:x.lvo)||null,confidence:b(((H=d.lvo_prediction)==null?void 0:H.confidence)||d.lvo_confidence||((z=d.lvo)==null?void 0:z.confidence),.85),module:"Full Stroke"};return{ich:Q,lvo:X}}catch(d){throw console.error("Full Stroke prediction failed:",d),new v(`Failed to get stroke predictions: ${d.message}`,d.status,f.FULL_STROKE)}}function Be(i){m.logEvent("triage1_answer",{comatose:i}),B(i?"coma":"triage2")}function Re(i){m.logEvent("triage2_answer",{examinable:i}),B(i?"full":"limited")}function B(i){m.logEvent("navigate",{from:m.getState().currentScreen,to:i}),m.navigate(i),window.scrollTo(0,0)}function Fe(){m.hasUnsavedData()&&!confirm("Are you sure you want to start over? All entered data will be lost.")||(m.logEvent("reset"),m.reset())}function xe(){console.log("goBack() called");const i=m.goBack();console.log("goBack() success:",i),i?(m.logEvent("navigate_back"),window.scrollTo(0,0)):(console.log("No history available, going home instead"),J())}function J(){console.log("goHome() called"),m.logEvent("navigate_home"),m.goHome(),window.scrollTo(0,0)}async function He(i,t){i.preventDefault();const e=i.target,a=e.dataset.module,n=Ae(e);if(!n.isValid){_e(t,n.validationErrors);return}const r={};Array.from(e.elements).forEach(c=>{if(c.name)if(c.type==="checkbox")r[c.name]=c.checked;else if(c.type==="number"){const u=parseFloat(c.value);r[c.name]=isNaN(u)?0:u}else c.type==="hidden"&&c.name==="armparese"?r[c.name]=c.value==="true":r[c.name]=c.value}),console.log("Collected form inputs:",r),m.setFormData(a,r);const o=e.querySelector("button[type=submit]"),l=o?o.innerHTML:"";o&&(o.disabled=!0,o.innerHTML=`<span class="loading-spinner"></span> ${s("analyzing")}`);try{let c;switch(a){case"coma":c={ich:await Ie(r),lvo:null};break;case"limited":c={ich:await Pe(r),lvo:{notPossible:!0}};break;case"full":c=await Ne(r);break;default:throw new Error("Unknown module: "+a)}m.setResults(c),m.logEvent("models_complete",{module:a,results:c}),B("results")}catch(c){console.error("Error running models:",c);let u="An error occurred during analysis. Please try again.";c instanceof v&&(u=c.message),ze(t,u),o&&(o.disabled=!1,o.innerHTML=l)}}function ze(i,t){i.querySelectorAll(".critical-alert").forEach(n=>{var r,o;(o=(r=n.querySelector("h4"))==null?void 0:r.textContent)!=null&&o.includes("Error")&&n.remove()});const e=document.createElement("div");e.className="critical-alert",e.innerHTML=`<h4><span class="alert-icon">⚠️</span> Error</h4><p>${t}</p>`;const a=i.querySelector(".container");a?a.prepend(e):i.prepend(e),setTimeout(()=>e.remove(),1e4)}function Oe(i){const t=document.createElement("div");t.className="sr-only",t.setAttribute("role","status"),t.setAttribute("aria-live","polite");const e={triage1:"Coma assessment",triage2:"Examination capability assessment",coma:"Coma module",limited:"Limited data module",full:"Full stroke assessment",results:"Assessment results"};t.textContent=`Navigated to ${e[i]||i}`,document.body.appendChild(t),setTimeout(()=>t.remove(),1e3)}function Ge(i){const t={triage1:"Initial Assessment - Stroke Triage Assistant",triage2:"Examination Capability - Stroke Triage Assistant",coma:"Coma Module - Stroke Triage Assistant",limited:"Limited Data Module - Stroke Triage Assistant",full:"Full Stroke Module - Stroke Triage Assistant",results:"Assessment Results - Stroke Triage Assistant"};document.title=t[i]||"Stroke Triage Assistant"}function Ve(){setTimeout(()=>{const i=document.querySelector("h2");i&&(i.setAttribute("tabindex","-1"),i.focus(),setTimeout(()=>i.removeAttribute("tabindex"),100))},100)}class qe{constructor(){this.scores={facial_palsy:0,arm_weakness:0,speech_changes:0,eye_deviation:0,denial_neglect:0},this.onApply=null,this.modal=null}getTotal(){return Object.values(this.scores).reduce((t,e)=>t+e,0)}getRiskLevel(){return this.getTotal()>=4?"high":"low"}render(){const t=this.getTotal(),e=this.getRiskLevel();return`
      <div id="fastEdModal" class="modal" role="dialog" aria-labelledby="fastEdModalTitle" aria-hidden="true" style="display: none;">
        <div class="modal-content fast-ed-modal">
          <div class="modal-header">
            <h2 id="fastEdModalTitle">${s("fastEdCalculatorTitle")}</h2>
            <button class="modal-close" aria-label="Close">&times;</button>
          </div>
          <div class="modal-body">
            
            <!-- Facial Palsy -->
            <div class="fast-ed-component">
              <h3>${s("facialPalsyTitle")}</h3>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="facial_palsy" value="0" ${this.scores.facial_palsy===0?"checked":""}>
                  <span class="radio-label">${s("facialPalsyNormal")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="facial_palsy" value="1" ${this.scores.facial_palsy===1?"checked":""}>
                  <span class="radio-label">${s("facialPalsyMild")}</span>
                </label>
              </div>
            </div>

            <!-- Arm Weakness -->
            <div class="fast-ed-component">
              <h3>${s("armWeaknessTitle")}</h3>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="arm_weakness" value="0" ${this.scores.arm_weakness===0?"checked":""}>
                  <span class="radio-label">${s("armWeaknessNormal")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="arm_weakness" value="1" ${this.scores.arm_weakness===1?"checked":""}>
                  <span class="radio-label">${s("armWeaknessMild")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="arm_weakness" value="2" ${this.scores.arm_weakness===2?"checked":""}>
                  <span class="radio-label">${s("armWeaknessSevere")}</span>
                </label>
              </div>
            </div>

            <!-- Speech Changes -->
            <div class="fast-ed-component">
              <h3>${s("speechChangesTitle")}</h3>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="speech_changes" value="0" ${this.scores.speech_changes===0?"checked":""}>
                  <span class="radio-label">${s("speechChangesNormal")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="speech_changes" value="1" ${this.scores.speech_changes===1?"checked":""}>
                  <span class="radio-label">${s("speechChangesMild")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="speech_changes" value="2" ${this.scores.speech_changes===2?"checked":""}>
                  <span class="radio-label">${s("speechChangesSevere")}</span>
                </label>
              </div>
            </div>

            <!-- Eye Deviation -->
            <div class="fast-ed-component">
              <h3>${s("eyeDeviationTitle")}</h3>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="eye_deviation" value="0" ${this.scores.eye_deviation===0?"checked":""}>
                  <span class="radio-label">${s("eyeDeviationNormal")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="eye_deviation" value="1" ${this.scores.eye_deviation===1?"checked":""}>
                  <span class="radio-label">${s("eyeDeviationPartial")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="eye_deviation" value="2" ${this.scores.eye_deviation===2?"checked":""}>
                  <span class="radio-label">${s("eyeDeviationForced")}</span>
                </label>
              </div>
            </div>

            <!-- Denial/Neglect -->
            <div class="fast-ed-component">
              <h3>${s("denialNeglectTitle")}</h3>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="denial_neglect" value="0" ${this.scores.denial_neglect===0?"checked":""}>
                  <span class="radio-label">${s("denialNeglectNormal")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="denial_neglect" value="1" ${this.scores.denial_neglect===1?"checked":""}>
                  <span class="radio-label">${s("denialNeglectPartial")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="denial_neglect" value="2" ${this.scores.denial_neglect===2?"checked":""}>
                  <span class="radio-label">${s("denialNeglectComplete")}</span>
                </label>
              </div>
            </div>

            <!-- Total Score Display -->
            <div class="fast-ed-total">
              <div class="score-display">
                <h3>${s("totalScoreTitle")}: <span class="total-score">${t}/9</span></h3>
                <div class="risk-indicator ${e}">
                  ${s("riskLevel")}: ${s(e==="high"?"riskLevelHigh":"riskLevelLow")}
                </div>
              </div>
            </div>

          </div>
          <div class="modal-footer">
            <button class="secondary" data-action="cancel-fast-ed">${s("cancel")}</button>
            <button class="primary" data-action="apply-fast-ed">${s("applyScore")}</button>
          </div>
        </div>
      </div>
    `}setupEventListeners(){if(this.modal=document.getElementById("fastEdModal"),!this.modal)return;this.modal.addEventListener("change",n=>{if(n.target.type==="radio"){const r=n.target.name,o=parseInt(n.target.value);this.scores[r]=o,this.updateDisplay()}});const t=this.modal.querySelector(".modal-close");t==null||t.addEventListener("click",()=>this.close());const e=this.modal.querySelector('[data-action="cancel-fast-ed"]');e==null||e.addEventListener("click",()=>this.close());const a=this.modal.querySelector('[data-action="apply-fast-ed"]');a==null||a.addEventListener("click",()=>this.apply()),this.modal.addEventListener("click",n=>{n.target===this.modal&&this.close()}),document.addEventListener("keydown",n=>{var r;n.key==="Escape"&&((r=this.modal)!=null&&r.classList.contains("show"))&&this.close()})}updateDisplay(){var a,n;const t=(a=this.modal)==null?void 0:a.querySelector(".total-score"),e=(n=this.modal)==null?void 0:n.querySelector(".risk-indicator");if(t&&(t.textContent=`${this.getTotal()}/9`),e){const r=this.getRiskLevel();e.className=`risk-indicator ${r}`,e.textContent=`${s("riskLevel")}: ${s(r==="high"?"riskLevelHigh":"riskLevelLow")}`}}show(t=0,e=null){this.onApply=e,t>0&&t<=9&&this.approximateFromTotal(t),document.getElementById("fastEdModal")?(this.modal.remove(),document.body.insertAdjacentHTML("beforeend",this.render()),this.modal=document.getElementById("fastEdModal")):document.body.insertAdjacentHTML("beforeend",this.render()),this.setupEventListeners(),this.modal.style.display="flex",this.modal.classList.add("show"),this.modal.setAttribute("aria-hidden","false");const a=this.modal.querySelector('input[type="radio"]');a==null||a.focus()}close(){this.modal&&(this.modal.classList.remove("show"),this.modal.style.display="none",this.modal.setAttribute("aria-hidden","true"))}apply(){const t=this.getTotal(),e=this.scores.arm_weakness>0,a=this.scores.eye_deviation>0;this.onApply&&this.onApply({total:t,components:{...this.scores},armWeaknessBoolean:e,eyeDeviationBoolean:a}),this.close()}approximateFromTotal(t){this.scores={facial_palsy:0,arm_weakness:0,speech_changes:0,eye_deviation:0,denial_neglect:0};let e=t;const a=Object.keys(this.scores);for(const n of a){if(e<=0)break;const o=Math.min(e,n==="facial_palsy"?1:2);this.scores[n]=o,e-=o}}}const Ue=new qe;function C(i){const t=m.getState(),{currentScreen:e,results:a,startTime:n}=t;i.innerHTML="";let r="";switch(e){case"triage1":r=U();break;case"triage2":r=ie();break;case"coma":r=se();break;case"limited":r=ne();break;case"full":r=re();break;case"results":r=De(a);break;default:r=U()}i.innerHTML=r;const o=i.querySelector("form[data-module]");if(o){const l=o.dataset.module;Ke(o,l)}We(i),e==="results"&&a&&setTimeout(()=>{ke(a)},100),Oe(e),Ge(e),Ve()}function Ke(i,t){const e=m.getFormData(t);!e||Object.keys(e).length===0||Object.entries(e).forEach(([a,n])=>{const r=i.elements[a];r&&(r.type==="checkbox"?r.checked=n===!0||n==="on"||n==="true":r.value=n)})}function We(i){i.querySelectorAll('input[type="number"]').forEach(n=>{n.addEventListener("blur",()=>{Me(i)})}),i.querySelectorAll("[data-action]").forEach(n=>{n.addEventListener("click",r=>{const{action:o,value:l}=r.currentTarget.dataset,c=l==="true";switch(o){case"triage1":Be(c);break;case"triage2":Re(c);break;case"reset":Fe();break;case"goBack":xe();break;case"goHome":J();break}})}),i.querySelectorAll("form[data-module]").forEach(n=>{n.addEventListener("submit",r=>{He(r,i)})});const t=i.querySelector("#printResults");t&&t.addEventListener("click",()=>window.print());const e=i.querySelector("#fast_ed_score");e&&(e.addEventListener("click",n=>{n.preventDefault();const r=parseInt(e.value)||0;Ue.show(r,o=>{e.value=o.total;const l=i.querySelector("#armparese_hidden");l&&(l.value=o.armWeaknessBoolean?"true":"false");const c=i.querySelector("#eye_deviation");c&&(c.checked=o.eyeDeviationBoolean),e.dispatchEvent(new Event("change",{bubbles:!0}))})}),e.addEventListener("keydown",n=>{n.preventDefault()})),i.querySelectorAll(".info-toggle").forEach(n=>{n.addEventListener("click",r=>{const o=n.dataset.target,l=i.querySelector(`#${o}`),c=n.querySelector(".toggle-arrow");l&&(l.style.display!=="none"?(l.style.display="none",l.classList.remove("show"),n.classList.remove("active"),c.style.transform="rotate(0deg)"):(l.style.display="block",l.classList.add("show"),n.classList.add("active"),c.style.transform="rotate(180deg)"))})})}class je{constructor(){this.container=null,this.unsubscribe=null}async init(){if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",()=>this.init());return}if(this.container=document.getElementById("appContainer"),!this.container){console.error("App container not found");return}this.unsubscribe=m.subscribe(()=>{C(this.container)}),window.addEventListener("languageChanged",()=>{this.updateUILanguage(),C(this.container)}),this.setupGlobalEventListeners(),this.initializeTheme(),this.updateUILanguage(),this.startAutoSave(),this.setupSessionTimeout(),this.setCurrentYear(),this.registerServiceWorker(),C(this.container),console.log("Stroke Triage Assistant initialized")}setupGlobalEventListeners(){const t=document.getElementById("languageToggle");t&&t.addEventListener("click",()=>this.toggleLanguage());const e=document.getElementById("darkModeToggle");e&&e.addEventListener("click",()=>this.toggleDarkMode()),this.setupHelpModal(),this.setupFooterLinks(),document.addEventListener("keydown",a=>{if(a.key==="Escape"){const n=document.getElementById("helpModal");n&&n.classList.contains("show")&&(n.classList.remove("show"),n.style.display="none",n.setAttribute("aria-hidden","true"))}}),window.addEventListener("beforeunload",a=>{m.hasUnsavedData()&&(a.preventDefault(),a.returnValue="You have unsaved data. Are you sure you want to leave?")})}setupHelpModal(){const t=document.getElementById("helpButton"),e=document.getElementById("helpModal"),a=e==null?void 0:e.querySelector(".modal-close");if(t&&e){e.classList.remove("show"),e.style.display="none",e.setAttribute("aria-hidden","true"),t.addEventListener("click",()=>{e.style.display="flex",e.classList.add("show"),e.setAttribute("aria-hidden","false")});const n=()=>{e.classList.remove("show"),e.style.display="none",e.setAttribute("aria-hidden","true")};a==null||a.addEventListener("click",n),e.addEventListener("click",r=>{r.target===e&&n()})}}setupFooterLinks(){var t,e;(t=document.getElementById("privacyLink"))==null||t.addEventListener("click",a=>{a.preventDefault(),this.showPrivacyPolicy()}),(e=document.getElementById("disclaimerLink"))==null||e.addEventListener("click",a=>{a.preventDefault(),this.showDisclaimer()})}initializeTheme(){const t=localStorage.getItem("theme"),e=document.getElementById("darkModeToggle");(t==="dark"||!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)&&(document.body.classList.add("dark-mode"),e&&(e.textContent="☀️"))}toggleLanguage(){A.toggleLanguage(),this.updateUILanguage()}updateUILanguage(){document.documentElement.lang=A.getCurrentLanguage();const t=document.querySelector(".app-header h1");t&&(t.textContent=s("appTitle"));const e=document.querySelector(".emergency-badge");e&&(e.textContent=s("emergencyBadge"));const a=document.getElementById("languageToggle");a&&(a.title=s("languageToggle"),a.setAttribute("aria-label",s("languageToggle")));const n=document.getElementById("helpButton");n&&(n.title=s("helpButton"),n.setAttribute("aria-label",s("helpButton")));const r=document.getElementById("darkModeToggle");r&&(r.title=s("darkModeButton"),r.setAttribute("aria-label",s("darkModeButton")));const o=document.getElementById("modalTitle");o&&(o.textContent=s("helpTitle"))}toggleDarkMode(){const t=document.getElementById("darkModeToggle");document.body.classList.toggle("dark-mode");const e=document.body.classList.contains("dark-mode");t&&(t.textContent=e?"☀️":"🌙"),localStorage.setItem("theme",e?"dark":"light")}startAutoSave(){setInterval(()=>{this.saveCurrentFormData()},M.autoSaveInterval)}saveCurrentFormData(){this.container.querySelectorAll("form[data-module]").forEach(e=>{const a=new FormData(e),n=e.dataset.module;if(n){const r={};a.forEach((c,u)=>{const p=e.elements[u];p&&p.type==="checkbox"?r[u]=p.checked:r[u]=c});const o=m.getFormData(n);JSON.stringify(o)!==JSON.stringify(r)&&m.setFormData(n,r)}})}setupSessionTimeout(){setTimeout(()=>{confirm("Your session has been idle for 30 minutes. Would you like to continue?")?this.setupSessionTimeout():m.reset()},M.sessionTimeout)}setCurrentYear(){const t=document.getElementById("currentYear");t&&(t.textContent=new Date().getFullYear())}showPrivacyPolicy(){alert("Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.")}showDisclaimer(){alert("Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.")}async registerServiceWorker(){if(!("serviceWorker"in navigator)){console.log("Service Workers not supported");return}try{const t=await navigator.serviceWorker.register("/0825/sw.js",{scope:"/0825/"});console.log("Service Worker registered successfully:",t),t.addEventListener("updatefound",()=>{const e=t.installing;console.log("New service worker found"),e.addEventListener("statechange",()=>{e.state==="installed"&&navigator.serviceWorker.controller&&(console.log("New service worker installed, update available"),this.showUpdateNotification())})}),navigator.serviceWorker.addEventListener("message",e=>{console.log("Message from service worker:",e.data)})}catch(t){console.error("Service Worker registration failed:",t)}}showUpdateNotification(){const t=document.createElement("div");t.style.cssText=`
      position: fixed;
      top: 70px;
      right: 20px;
      background: var(--primary-color);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1001;
      font-size: 0.9rem;
      max-width: 300px;
      cursor: pointer;
      transition: all 0.3s ease;
    `,t.textContent="App update available - Tap to refresh",t.addEventListener("click",()=>{window.location.reload()}),document.body.appendChild(t),setTimeout(()=>{t.parentNode&&t.remove()},1e4)}destroy(){this.unsubscribe&&this.unsubscribe()}}const Ye=new je;Ye.init();
//# sourceMappingURL=index-CuMeTSY9.js.map
