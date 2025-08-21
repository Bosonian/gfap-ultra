(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function e(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(n){if(n.ep)return;n.ep=!0;const s=e(n);fetch(n.href,s)}})();class ee{constructor(){this.state={currentScreen:"triage1",results:null,sessionId:null,startTime:null,formData:{},validationErrors:{},screenHistory:[]},this.listeners=new Set,this.initialize()}initialize(){this.state.sessionId=this.generateSessionId(),this.state.startTime=Date.now(),console.log("Store initialized with session:",this.state.sessionId)}generateSessionId(){return"session_"+Date.now()+"_"+Math.random().toString(36).substr(2,9)}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}notify(){this.listeners.forEach(t=>t(this.state))}getState(){return{...this.state}}setState(t){this.state={...this.state,...t},this.notify()}navigate(t){console.log(`Navigating from ${this.state.currentScreen} to ${t}`);const e=[...this.state.screenHistory];this.state.currentScreen!==t&&!e.includes(this.state.currentScreen)&&e.push(this.state.currentScreen),this.setState({currentScreen:t,screenHistory:e})}goBack(){const t=[...this.state.screenHistory];if(console.log("goBack() - current history:",t),console.log("goBack() - current screen:",this.state.currentScreen),t.length>0){const e=t.pop();return console.log("goBack() - navigating to:",e),this.setState({currentScreen:e,screenHistory:t}),!0}return console.log("goBack() - no history available"),!1}goHome(){this.setState({currentScreen:"triage1",screenHistory:[]})}setFormData(t,e){const a={...this.state.formData};a[t]={...e},this.setState({formData:a})}getFormData(t){return this.state.formData[t]||{}}setValidationErrors(t){this.setState({validationErrors:t})}clearValidationErrors(){this.setState({validationErrors:{}})}setResults(t){this.setState({results:t})}hasUnsavedData(){return Object.keys(this.state.formData).length>0&&!this.state.results}reset(){const t={currentScreen:"triage1",results:null,sessionId:this.generateSessionId(),startTime:Date.now(),formData:{},validationErrors:{},screenHistory:[]};this.setState(t),console.log("Store reset with new session:",t.sessionId)}logEvent(t,e={}){const a={timestamp:Date.now(),session:this.state.sessionId,event:t,data:e};console.log("Event:",a)}getSessionDuration(){return Date.now()-this.state.startTime}}const m=new ee;function y(i){const t=[{id:1,label:"Triage"},{id:2,label:"Assessment"},{id:3,label:"Results"}];let e='<div class="progress-indicator">';return t.forEach((a,n)=>{const s=a.id===i,o=a.id<i;e+=`
      <div class="progress-step ${s?"active":""} ${o?"completed":""}">
        ${o?"":a.id}
      </div>
    `,n<t.length-1&&(e+=`<div class="progress-line ${o?"completed":""}"></div>`)}),e+="</div>",e}const q={en:{appTitle:"Stroke Triage Assistant",emergencyBadge:"Emergency Tool",helpButton:"Help and Instructions",darkModeButton:"Toggle dark mode",languageToggle:"Language",step1:"Initial Assessment",step2:"Data Collection",step3:"Results",comaModuleTitle:"Coma Module",limitedDataModuleTitle:"Limited Data Module",fullStrokeModuleTitle:"Full Stroke Module",triage1Title:"Patient Assessment",triage1Question:"Is the patient comatose?",triage1Help:"Glasgow Coma Scale < 8",triage1Yes:"YES - Comatose",triage1No:"NO - Conscious",triage2Title:"Examination Capability",triage2Question:"Can the patient be reliably examined?",triage2Help:"Patient is not aphasic, confused, or uncooperative",triage2Yes:"YES - Full Exam Possible",triage2No:"NO - Limited Exam Only",ageLabel:"Age (years)",ageHelp:"Patient age in years",systolicLabel:"Systolic BP (mmHg)",systolicHelp:"Systolic blood pressure",diastolicLabel:"Diastolic BP (mmHg)",diastolicHelp:"Diastolic blood pressure",gfapLabel:"GFAP Value (pg/mL)",gfapHelp:"GFAP biomarker level",fastEdLabel:"FAST-ED Score",fastEdHelp:"FAST-ED assessment score (0-9)",headacheLabel:"Headache",vigilanzLabel:"Reduced consciousness",armPareseLabel:"Arm weakness",beinPareseLabel:"Leg weakness",eyeDeviationLabel:"Eye deviation",atrialFibLabel:"Atrial fibrillation",anticoagLabel:"Anticoagulated (NOAK)",antiplateletsLabel:"Antiplatelets",analyzeButton:"Analyze",analyzing:"Analyzing...",printResults:"Print Results",newAssessment:"Start New Assessment",startOver:"Start Over",goBack:"Go Back",goHome:"Go Home",basicInformation:"Basic Information",biomarkersScores:"Biomarkers & Scores",clinicalSymptoms:"Clinical Symptoms",medicalHistory:"Medical History",ageYearsLabel:"Age (years)",systolicBpLabel:"Systolic BP (mmHg)",diastolicBpLabel:"Diastolic BP (mmHg)",gfapValueLabel:"GFAP Value (pg/mL)",fastEdScoreLabel:"FAST-ED Score",ageYearsHelp:"Patient's age in years",systolicBpHelp:"Normal: 90-140 mmHg",diastolicBpHelp:"Normal: 60-90 mmHg",gfapTooltip:"Brain injury biomarker",gfapTooltipLong:"Glial Fibrillary Acidic Protein - Brain injury biomarker",gfapRange:"Range: {min} - {max} pg/mL",fastEdTooltip:"0-9 scale for LVO screening",analyzeIchRisk:"Analyze ICH Risk",analyzeStrokeRisk:"Analyze Stroke Risk",criticalPatient:"Critical Patient",comaAlert:"Patient is comatose (GCS < 8). Rapid assessment required.",vigilanceReduction:"Vigilance Reduction (Decreased alertness)",armParesis:"Arm Paresis",legParesis:"Leg Paresis",eyeDeviation:"Eye Deviation",atrialFibrillation:"Atrial Fibrillation",onNoacDoac:"On NOAC/DOAC",onAntiplatelets:"On Antiplatelets",resultsTitle:"Assessment Results",ichProbability:"ICH Probability",lvoProbability:"LVO Probability",riskLevel:"Risk Level",lowRisk:"Low Risk",moderateRisk:"Moderate Risk",highRisk:"High Risk",criticalRisk:"Critical Risk",riskLow:"Low",riskModerate:"Moderate",riskHigh:"High",riskCritical:"Critical",driversTitle:"Model Drivers",driversSubtitle:"Factors contributing to the prediction",ichDrivers:"ICH Risk Factors",lvoDrivers:"LVO Risk Factors",criticalAlertTitle:"CRITICAL RISK DETECTED",criticalAlertMessage:"High probability of intracerebral hemorrhage detected. Immediate medical attention required.",helpTitle:"Quick Reference Guide",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 8: Comatose patient - use Coma Module",gcsMod:"GCS 8-12: Moderate impairment",gcsHigh:"GCS 13-15: Mild impairment",fastEdTitle:"FAST-ED Score Components",fastEdFacial:"Facial Palsy: 0-1 points",fastEdArm:"Arm Weakness: 0-2 points",fastEdSpeech:"Speech Changes: 0-2 points",fastEdTime:"Time: Critical factor",fastEdEye:"Eye Deviation: 0-2 points",fastEdDenial:"Denial/Neglect: 0-2 points",criticalValuesTitle:"Critical Values",criticalBp:"Systolic BP > 180: Increased ICH risk",criticalGfap:"GFAP > 500 pg/mL: Significant marker",criticalFastEd:"FAST-ED ≥ 4: Consider LVO",fastEdCalculatorTitle:"FAST-ED Score Calculator",fastEdCalculatorSubtitle:"Click to calculate FAST-ED score components",facialPalsyTitle:"Facial Palsy",facialPalsyNormal:"Normal (0)",facialPalsyMild:"Mild drooping (1)",armWeaknessTitle:"Arm Weakness",armWeaknessNormal:"Normal (0)",armWeaknessMild:"Mild drift (1)",armWeaknessSevere:"Falls immediately (2)",speechChangesTitle:"Speech Changes",speechChangesNormal:"Normal (0)",speechChangesMild:"Slurred speech (1)",speechChangesSevere:"Severe aphasia (2)",eyeDeviationTitle:"Eye Deviation",eyeDeviationNormal:"Normal (0)",eyeDeviationPartial:"Partial gaze palsy (1)",eyeDeviationForced:"Forced deviation (2)",denialNeglectTitle:"Denial/Neglect",denialNeglectNormal:"Normal (0)",denialNeglectPartial:"Partial neglect (1)",denialNeglectComplete:"Complete neglect (2)",totalScoreTitle:"Total FAST-ED Score",riskLevel:"Risk Level",riskLevelLow:"LOW (Score <4)",riskLevelHigh:"HIGH (Score ≥4 - Consider LVO)",applyScore:"Apply Score",cancel:"Cancel",disclaimer:"Clinical Disclaimer",disclaimerText:"This tool is for clinical decision support only. Always use clinical judgment and follow local protocols. Not a replacement for physician assessment.",importantNote:"Important",importantText:"These results are for clinical decision support only. Always use clinical judgment and follow institutional protocols.",inputSummaryTitle:"Input Summary",inputSummarySubtitle:"Values used for this analysis",privacyLink:"Privacy Policy",disclaimerLink:"Medical Disclaimer",versionLink:"Version 2.0.1",privacyPolicy:"Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.",medicalDisclaimer:"Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.",networkError:"Network error - please check your connection and try again",requestTimeout:"Request timeout - please try again",apiError:"Failed to get results",validationError:"Please check your input values",sessionTimeout:"Your session has been idle for 30 minutes. Would you like to continue?",unsavedData:"You have unsaved data. Are you sure you want to leave?",nearestCentersTitle:"Nearest Stroke Centers",useCurrentLocation:"Use Current Location",enterLocationPlaceholder:"Enter city or address...",enterManually:"Enter Location Manually",search:"Search",yourLocation:"Your Location",recommendedCenters:"Recommended Centers",alternativeCenters:"Alternative Centers",noCentersFound:"No stroke centers found in this area",gettingLocation:"Getting your location",searchingLocation:"Searching location",locationError:"Unable to get your location",locationPermissionDenied:"Location access denied. Please allow location access and try again.",locationUnavailable:"Location information is unavailable",locationTimeout:"Location request timed out",geolocationNotSupported:"Geolocation is not supported by this browser",geocodingNotImplemented:"Location search not available. Please use GPS or enter coordinates manually.",tryManualEntry:"Try entering your location manually or use GPS.",distanceNote:"Distances are calculated as straight-line distances. Actual travel times may vary.",travelTimeNote:"Travel times calculated for emergency vehicles with sirens and priority routing.",calculatingTravelTimes:"Calculating travel times",minutes:"min",poweredByOrs:"Travel times powered by OpenRoute Service",comprehensiveCenter:"Comprehensive Stroke Center",primaryCenter:"Primary Stroke Center",telemetryCenter:"Telemedicine Center",thrombectomy:"Thrombectomy",neurosurgery:"Neurosurgery",icu:"Intensive Care",telemedicine:"Telemedicine",stroke_unit:"Stroke Unit",call:"Call",directions:"Directions",emergency:"Emergency",certified:"Certified"},de:{appTitle:"Schlaganfall-Triage-Assistent",emergencyBadge:"Notfall-Tool",helpButton:"Hilfe und Anweisungen",darkModeButton:"Dunklen Modus umschalten",languageToggle:"Sprache",step1:"Erstbeurteilung",step2:"Datenerhebung",step3:"Ergebnisse",comaModuleTitle:"Koma-Modul",limitedDataModuleTitle:"Begrenzte Daten Modul",fullStrokeModuleTitle:"Vollständiges Schlaganfall-Modul",triage1Title:"Patientenbeurteilung",triage1Question:"Ist der Patient komatös?",triage1Help:"Glasgow Coma Scale < 8",triage1Yes:"JA - Komatös",triage1No:"NEIN - Bei Bewusstsein",triage2Title:"Untersuchungsfähigkeit",triage2Question:"Kann der Patient zuverlässig untersucht werden?",triage2Help:"Patient ist nicht aphasisch, verwirrt oder unkooperativ",triage2Yes:"JA - Vollständige Untersuchung möglich",triage2No:"NEIN - Nur begrenzte Untersuchung",ageLabel:"Alter (Jahre)",ageHelp:"Patientenalter in Jahren",systolicLabel:"Systolischer RR (mmHg)",systolicHelp:"Systolischer Blutdruck",diastolicLabel:"Diastolischer RR (mmHg)",diastolicHelp:"Diastolischer Blutdruck",gfapLabel:"GFAP-Wert (pg/mL)",gfapHelp:"GFAP-Biomarker-Wert",fastEdLabel:"FAST-ED-Score",fastEdHelp:"FAST-ED-Bewertungsscore (0-9)",headacheLabel:"Kopfschmerzen",vigilanzLabel:"Bewusstseinstrübung",armPareseLabel:"Armschwäche",beinPareseLabel:"Beinschwäche",eyeDeviationLabel:"Blickdeviation",atrialFibLabel:"Vorhofflimmern",anticoagLabel:"Antikoaguliert (NOAK)",antiplateletsLabel:"Thrombozytenaggregationshemmer",analyzeButton:"Analysieren",analyzing:"Analysiere...",printResults:"Ergebnisse drucken",newAssessment:"Neue Bewertung starten",startOver:"Von vorn beginnen",goBack:"Zurück",goHome:"Zur Startseite",basicInformation:"Grundinformationen",biomarkersScores:"Biomarker & Scores",clinicalSymptoms:"Klinische Symptome",medicalHistory:"Anamnese",ageYearsLabel:"Alter (Jahre)",systolicBpLabel:"Systolischer RR (mmHg)",diastolicBpLabel:"Diastolischer RR (mmHg)",gfapValueLabel:"GFAP-Wert (pg/mL)",fastEdScoreLabel:"FAST-ED-Score",ageYearsHelp:"Patientenalter in Jahren",systolicBpHelp:"Normal: 90-140 mmHg",diastolicBpHelp:"Normal: 60-90 mmHg",gfapTooltip:"Hirnverletzungs-Biomarker",gfapTooltipLong:"Glial Fibrillary Acidic Protein - Hirnverletzungs-Biomarker",gfapRange:"Bereich: {min} - {max} pg/mL",fastEdTooltip:"0-9 Skala für LVO-Screening",analyzeIchRisk:"ICB-Risiko analysieren",analyzeStrokeRisk:"Schlaganfall-Risiko analysieren",criticalPatient:"Kritischer Patient",comaAlert:"Patient ist komatös (GCS < 8). Schnelle Beurteilung erforderlich.",vigilanceReduction:"Vigilanzminderung (Verminderte Wachheit)",armParesis:"Armparese",legParesis:"Beinparese",eyeDeviation:"Blickdeviation",atrialFibrillation:"Vorhofflimmern",onNoacDoac:"NOAK/DOAK-Therapie",onAntiplatelets:"Thrombozytenaggregationshemmer",resultsTitle:"Bewertungsergebnisse",ichProbability:"ICB-Wahrscheinlichkeit",lvoProbability:"LVO-Wahrscheinlichkeit",riskLevel:"Risikostufe",riskLow:"Niedrig",riskModerate:"Mäßig",riskHigh:"Hoch",riskCritical:"Kritisch",driversTitle:"Modelltreiber",driversSubtitle:"Faktoren, die zur Vorhersage beitragen",ichDrivers:"ICB-Risikofaktoren",lvoDrivers:"LVO-Risikofaktoren",criticalAlertTitle:"KRITISCHES RISIKO ERKANNT",criticalAlertMessage:"Hohe Wahrscheinlichkeit einer intrazerebralen Blutung erkannt. Sofortige medizinische Behandlung erforderlich.",helpTitle:"Kurzreferenzleitfaden",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 8: Komatöser Patient - Koma-Modul verwenden",gcsMod:"GCS 8-12: Mäßige Beeinträchtigung",gcsHigh:"GCS 13-15: Leichte Beeinträchtigung",fastEdTitle:"FAST-ED-Score-Komponenten",fastEdFacial:"Faziale Parese: 0-1 Punkte",fastEdArm:"Armschwäche: 0-2 Punkte",fastEdSpeech:"Sprachveränderungen: 0-2 Punkte",fastEdTime:"Zeit: Kritischer Faktor",fastEdEye:"Blickdeviation: 0-2 Punkte",fastEdDenial:"Verneinung/Neglect: 0-2 Punkte",criticalValuesTitle:"Kritische Werte",criticalBp:"Systolischer RR > 180: Erhöhtes ICB-Risiko",criticalGfap:"GFAP > 500 pg/mL: Signifikanter Marker",criticalFastEd:"FAST-ED ≥ 4: LVO in Betracht ziehen",fastEdCalculatorTitle:"FAST-ED-Score-Rechner",fastEdCalculatorSubtitle:"Klicken Sie, um FAST-ED-Score-Komponenten zu berechnen",facialPalsyTitle:"Faziale Parese",facialPalsyNormal:"Normal (0)",facialPalsyMild:"Leichte Mundwinkelasymmetrie (1)",armWeaknessTitle:"Armschwäche",armWeaknessNormal:"Normal (0)",armWeaknessMild:"Leichter Armabfall (1)",armWeaknessSevere:"Arm fällt sofort ab (2)",speechChangesTitle:"Sprachveränderungen",speechChangesNormal:"Normal (0)",speechChangesMild:"Verwaschene Sprache (1)",speechChangesSevere:"Schwere Aphasie (2)",eyeDeviationTitle:"Blickdeviation",eyeDeviationNormal:"Normal (0)",eyeDeviationPartial:"Partielle Blickparese (1)",eyeDeviationForced:"Forcierte Blickdeviation (2)",denialNeglectTitle:"Verneinung/Neglect",denialNeglectNormal:"Normal (0)",denialNeglectPartial:"Partieller Neglect (1)",denialNeglectComplete:"Kompletter Neglect (2)",totalScoreTitle:"Gesamt-FAST-ED-Score",riskLevel:"Risikostufe",riskLevelLow:"NIEDRIG (Score <4)",riskLevelHigh:"HOCH (Score ≥4 - LVO erwägen)",applyScore:"Score Anwenden",cancel:"Abbrechen",disclaimer:"Klinischer Haftungsausschluss",disclaimerText:"Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle. Kein Ersatz für ärztliche Beurteilung.",importantNote:"Wichtig",importantText:"Diese Ergebnisse dienen nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie institutionelle Protokolle.",inputSummaryTitle:"Eingabezusammenfassung",inputSummarySubtitle:"Für diese Analyse verwendete Werte",privacyLink:"Datenschutzrichtlinie",disclaimerLink:"Medizinischer Haftungsausschluss",versionLink:"Version 2.0.1",privacyPolicy:"Datenschutzrichtlinie: Dieses Tool verarbeitet Daten lokal. Keine Patientendaten werden gespeichert oder übertragen.",medicalDisclaimer:"Medizinischer Haftungsausschluss: Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle.",networkError:"Netzwerkfehler - bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut",requestTimeout:"Anfrage-Timeout - bitte versuchen Sie es erneut",apiError:"Ergebnisse konnten nicht abgerufen werden",validationError:"Bitte überprüfen Sie Ihre Eingabewerte",sessionTimeout:"Ihre Sitzung war 30 Minuten lang inaktiv. Möchten Sie fortfahren?",unsavedData:"Sie haben ungespeicherte Daten. Sind Sie sicher, dass Sie verlassen möchten?",nearestCentersTitle:"Nächstgelegene Schlaganfall-Zentren",useCurrentLocation:"Aktuellen Standort verwenden",enterLocationPlaceholder:"Stadt oder Adresse eingeben...",enterManually:"Standort manuell eingeben",search:"Suchen",yourLocation:"Ihr Standort",recommendedCenters:"Empfohlene Zentren",alternativeCenters:"Alternative Zentren",noCentersFound:"Keine Schlaganfall-Zentren in diesem Bereich gefunden",gettingLocation:"Standort wird ermittelt",searchingLocation:"Standort wird gesucht",locationError:"Standort konnte nicht ermittelt werden",locationPermissionDenied:"Standortzugriff verweigert. Bitte erlauben Sie Standortzugriff und versuchen Sie es erneut.",locationUnavailable:"Standortinformationen sind nicht verfügbar",locationTimeout:"Standortanfrage ist abgelaufen",geolocationNotSupported:"Geolokalisierung wird von diesem Browser nicht unterstützt",geocodingNotImplemented:"Standortsuche nicht verfügbar. Bitte verwenden Sie GPS oder geben Sie Koordinaten manuell ein.",tryManualEntry:"Versuchen Sie, Ihren Standort manuell einzugeben oder GPS zu verwenden.",distanceNote:"Entfernungen werden als Luftlinie berechnet. Tatsächliche Fahrzeiten können variieren.",travelTimeNote:"Fahrzeiten berechnet für Rettungsfahrzeuge mit Sondersignalen und Vorfahrtsberechtigung.",calculatingTravelTimes:"Fahrzeiten werden berechnet",minutes:"Min",poweredByOrs:"Fahrzeiten bereitgestellt von OpenRoute Service",comprehensiveCenter:"Überregionales Schlaganfall-Zentrum",primaryCenter:"Regionales Schlaganfall-Zentrum",telemetryCenter:"Telemedizin-Zentrum",thrombectomy:"Thrombektomie",neurosurgery:"Neurochirurgie",icu:"Intensivstation",telemedicine:"Telemedizin",stroke_unit:"Stroke Unit",call:"Anrufen",directions:"Wegbeschreibung",emergency:"Notfall",certified:"Zertifiziert"}};class te{constructor(){this.supportedLanguages=["en","de"],this.currentLanguage=this.detectLanguage()}detectLanguage(){const t=localStorage.getItem("language");return t&&this.supportedLanguages.includes(t)?t:(navigator.language||navigator.userLanguage).substring(0,2).toLowerCase()==="de"?"de":"en"}getCurrentLanguage(){return this.currentLanguage}setLanguage(t){return this.supportedLanguages.includes(t)?(this.currentLanguage=t,localStorage.setItem("language",t),window.dispatchEvent(new CustomEvent("languageChanged",{detail:{language:t}})),!0):!1}getSupportedLanguages(){return[...this.supportedLanguages]}t(t){return(q[this.currentLanguage]||q.en)[t]||t}toggleLanguage(){const t=this.currentLanguage==="en"?"de":"en";return this.setLanguage(t)}getLanguageDisplayName(t=null){const e=t||this.currentLanguage;return{en:"English",de:"Deutsch"}[e]||e}formatDateTime(t){const e=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(e,{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(t)}formatTime(t){const e=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(e,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(t)}}const E=new te,r=i=>E.t(i);function V(){return`
    <div class="container">
      ${y(1)}
      <h2>${r("triage1Title")}</h2>
      <div class="triage-question">
        ${r("triage1Question")}
        <small>${r("triage1Help")}</small>
      </div>
      <div class="triage-buttons">
        <button class="yes-btn" data-action="triage1" data-value="true">${r("triage1Yes")}</button>
        <button class="no-btn" data-action="triage1" data-value="false">${r("triage1No")}</button>
      </div>
    </div>
  `}function ie(){return`
    <div class="container">
      ${y(1)}
      <h2>${r("triage2Title")}</h2>
      <div class="triage-question">
        ${r("triage2Question")}
        <small>${r("triage2Help")}</small>
      </div>
      <div class="triage-buttons">
        <button class="yes-btn" data-action="triage2" data-value="true">${r("triage2Yes")}</button>
        <button class="no-btn" data-action="triage2" data-value="false">${r("triage2No")}</button>
      </div>
    </div>
  `}const f={COMA_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_coma_ich",LDM_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_limited_data_ich",FULL_STROKE:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_full_stroke"},$={ich:{high:60,critical:80},lvo:{high:50,critical:70}},g={min:29,max:10001},_={autoSaveInterval:3e4,sessionTimeout:30*60*1e3,requestTimeout:1e4},ae={age_years:{required:!0,min:0,max:120},systolic_bp:{required:!0,min:60,max:300},diastolic_bp:{required:!0,min:30,max:200},gfap_value:{required:!0,min:g.min,max:g.max},fast_ed_score:{required:!0,min:0,max:9}};function se(){return`
    <div class="container">
      ${y(2)}
      <h2>${r("comaModuleTitle")||"Coma Module"}</h2>
      <div class="critical-alert">
        <h4><span class="alert-icon">🚨</span> ${r("criticalPatient")}</h4>
        <p>${r("comaAlert")}</p>
      </div>
      <form data-module="coma">
        <div class="input-grid">
          <div class="input-group">
            <label for="gfap_value">
              ${r("gfapValueLabel")}
              <span class="tooltip">ℹ️
                <span class="tooltiptext">${r("gfapTooltipLong")}</span>
              </span>
            </label>
            <input type="number" id="gfap_value" name="gfap_value" min="${g.min}" max="${g.max}" step="0.1" required aria-describedby="gfap-help">
            <div id="gfap-help" class="input-help">
              ${r("gfapRange").replace("{min}",g.min).replace("{max}",g.max)}
            </div>
          </div>
        </div>
        <button type="submit" class="primary">${r("analyzeIchRisk")}</button>
        <button type="button" class="secondary" data-action="reset">${r("startOver")}</button>
      </form>
    </div>
  `}function ne(){return`
    <div class="container">
      ${y(2)}
      <h2>${r("limitedDataModuleTitle")||"Limited Data Module"}</h2>
      <form data-module="limited">
        <div class="input-grid">
          <div class="input-group">
            <label for="age_years">${r("ageYearsLabel")}</label>
            <input type="number" name="age_years" id="age_years" min="0" max="120" required aria-describedby="age-help">
            <div id="age-help" class="input-help">${r("ageYearsHelp")}</div>
          </div>
          <div class="input-group">
            <label for="systolic_bp">${r("systolicBpLabel")}</label>
            <input type="number" name="systolic_bp" id="systolic_bp" min="60" max="300" required aria-describedby="sbp-help">
            <div id="sbp-help" class="input-help">${r("systolicBpHelp")}</div>
          </div>
          <div class="input-group">
            <label for="diastolic_bp">${r("diastolicBpLabel")}</label>
            <input type="number" name="diastolic_bp" id="diastolic_bp" min="30" max="200" required aria-describedby="dbp-help">
            <div id="dbp-help" class="input-help">${r("diastolicBpHelp")}</div>
          </div>
          <div class="input-group">
            <label for="gfap_value">
              ${r("gfapValueLabel")}
              <span class="tooltip">ℹ️
                <span class="tooltiptext">${r("gfapTooltipLong")}</span>
              </span>
            </label>
            <input type="number" name="gfap_value" id="gfap_value" min="${g.min}" max="${g.max}" step="0.1" required>
          </div>
        </div>
        <div class="checkbox-group">
          <label class="checkbox-wrapper">
            <input type="checkbox" name="vigilanzminderung" id="vigilanzminderung">
            <span class="checkbox-label">${r("vigilanceReduction")}</span>
          </label>
        </div>
        <button type="submit" class="primary">${r("analyzeIchRisk")}</button>
        <button type="button" class="secondary" data-action="reset">${r("startOver")}</button>
      </form>
    </div>
  `}function re(){return`
    <div class="container">
      ${y(2)}
      <h2>${r("fullStrokeModuleTitle")||"Full Stroke Module"}</h2>
      <form data-module="full">
        <h3>${r("basicInformation")}</h3>
        <div class="input-grid">
          <div class="input-group">
            <label for="age_years">${r("ageYearsLabel")}</label>
            <input type="number" name="age_years" id="age_years" min="0" max="120" required>
          </div>
          <div class="input-group">
            <label for="systolic_bp">${r("systolicBpLabel")}</label>
            <input type="number" name="systolic_bp" id="systolic_bp" min="60" max="300" required>
          </div>
          <div class="input-group">
            <label for="diastolic_bp">${r("diastolicBpLabel")}</label>
            <input type="number" name="diastolic_bp" id="diastolic_bp" min="30" max="200" required>
          </div>
        </div>

        <h3>${r("biomarkersScores")}</h3>
        <div class="input-grid">
          <div class="input-group">
            <label for="gfap_value">
              ${r("gfapValueLabel")}
              <span class="tooltip">ℹ️
                <span class="tooltiptext">${r("gfapTooltip")}</span>
              </span>
            </label>
            <input type="number" name="gfap_value" id="gfap_value" min="${g.min}" max="${g.max}" step="0.1" required>
          </div>
          <div class="input-group">
            <label for="fast_ed_score">
              ${r("fastEdScoreLabel")}
              <span class="tooltip">ℹ️
                <span class="tooltiptext">${r("fastEdCalculatorSubtitle")}</span>
              </span>
            </label>
            <input type="number" name="fast_ed_score" id="fast_ed_score" min="0" max="9" required readonly placeholder="${r("fastEdCalculatorSubtitle")}" style="cursor: pointer;">
            <input type="hidden" name="armparese" id="armparese_hidden" value="false">
          </div>
        </div>

        <h3>${r("clinicalSymptoms")}</h3>
        <div class="input-grid">
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="headache" id="headache">
              <span class="checkbox-label">${r("headacheLabel")}</span>
            </label>
            <label class="checkbox-wrapper">
              <input type="checkbox" name="vigilanzminderung" id="vigilanzminderung">
              <span class="checkbox-label">${r("vigilanzLabel")}</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="beinparese" id="beinparese">
              <span class="checkbox-label">${r("legParesis")}</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="eye_deviation" id="eye_deviation">
              <span class="checkbox-label">${r("eyeDeviation")}</span>
            </label>
          </div>
        </div>

        <h3>${r("medicalHistory")}</h3>
        <div class="input-grid">
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="atrial_fibrillation" id="atrial_fibrillation">
              <span class="checkbox-label">${r("atrialFibrillation")}</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="anticoagulated_noak" id="anticoagulated_noak">
              <span class="checkbox-label">${r("onNoacDoac")}</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="antiplatelets" id="antiplatelets">
              <span class="checkbox-label">${r("onAntiplatelets")}</span>
            </label>
          </div>
        </div>

        <button type="submit" class="primary">${r("analyzeStrokeRisk")}</button>
        <button type="button" class="secondary" data-action="reset">${r("startOver")}</button>
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
  `}function le(i){return!i||typeof i!="object"?{kind:"unavailable",units:null,positive:[],negative:[],meta:{}}:i.kind?i:i.shap_values||i.kind&&i.kind==="shap_values"?ce(i):i.logistic_contributions||i.kind&&i.kind==="logistic_contributions"?de(i):me(i)?ue(i):{kind:"unavailable",units:null,positive:[],negative:[],meta:{}}}function ce(i){const t=i.shap_values||i,e=[];Array.isArray(t)?t.forEach((o,l)=>{typeof o=="object"&&o.feature&&o.value!==void 0?e.push({label:o.feature,weight:o.value}):typeof o=="number"&&e.push({label:`Feature ${l}`,weight:o})}):typeof t=="object"&&Object.entries(t).forEach(([o,l])=>{typeof l=="number"&&e.push({label:o,weight:l})}),e.sort((o,l)=>Math.abs(l.weight)-Math.abs(o.weight));const a=e.filter(o=>o.weight>0),n=e.filter(o=>o.weight<0),s={};return i.base_value!==void 0&&(s.base_value=i.base_value),i.contrib_sum!==void 0&&(s.contrib_sum=i.contrib_sum),i.logit_total!==void 0&&(s.logit_total=i.logit_total),{kind:"shap_values",units:"logit",positive:a,negative:n,meta:s}}function de(i){const t=i.logistic_contributions||i,e=[];typeof t=="object"&&Object.entries(t).forEach(([o,l])=>{typeof l=="number"&&!["intercept","contrib_sum","logit_total"].includes(o)&&e.push({label:o,weight:l})}),e.sort((o,l)=>Math.abs(l.weight)-Math.abs(o.weight));const a=e.filter(o=>o.weight>0),n=e.filter(o=>o.weight<0),s={};return t.intercept!==void 0&&(s.base_value=t.intercept),t.contrib_sum!==void 0&&(s.contrib_sum=t.contrib_sum),t.logit_total!==void 0&&(s.logit_total=t.logit_total),i.contrib_sum!==void 0&&(s.contrib_sum=i.contrib_sum),{kind:"logistic_contributions",units:"logit",positive:a,negative:n,meta:s}}function ue(i){const t=[];Object.entries(i).forEach(([n,s])=>{typeof s=="number"&&t.push({label:n,weight:s})}),t.sort((n,s)=>Math.abs(s.weight)-Math.abs(n.weight));const e=t.filter(n=>n.weight>0),a=t.filter(n=>n.weight<0);return{kind:"raw_weights",units:null,positive:e,negative:a,meta:{}}}function me(i){return Object.values(i).every(t=>typeof t=="number")}function pe(i,t){if(!(i!=null&&i.drivers)&&!(t!=null&&t.drivers))return"";let e=`
    <div class="drivers-section">
      <h3>Prediction Drivers</h3>
      <div class="drivers-grid">
  `;return i!=null&&i.drivers&&(e+=K(i.drivers,"ICH","ich")),t!=null&&t.drivers&&!t.notPossible&&(e+=K(t.drivers,"LVO","lvo")),e+=`
      </div>
    </div>
  `,e}function K(i,t,e){if(!i||Object.keys(i).length===0)return`
      <div class="drivers-panel">
        <h4>
          <span class="driver-icon ${e}">${e==="ich"?"I":"L"}</span>
          ${t} Risk Factors
        </h4>
        <p style="color: var(--text-secondary); font-style: italic;">
          Driver information not available from this prediction model.
        </p>
      </div>
    `;const a=le(i);if(a.kind==="unavailable")return`
      <div class="drivers-panel">
        <h4>
          <span class="driver-icon ${e}">${e==="ich"?"I":"L"}</span>
          ${t} Risk Factors
        </h4>
        <p style="color: var(--text-secondary); font-style: italic;">
          Driver analysis not available for this prediction.
        </p>
      </div>
    `;let n=`
    <div class="drivers-panel">
      <h4>
        <span class="driver-icon ${e}">${e==="ich"?"I":"L"}</span>
        ${t} Risk Factors
      </h4>
  `;return a.positive.length>0&&a.positive.forEach(s=>{const o=Math.abs(s.weight*100),l=Math.min(o*2,100);n+=`
        <div class="driver-item">
          <span class="driver-label">${s.label}</span>
          <div class="driver-bar-container">
            <div class="driver-bar positive" style="width: ${l}%">
              <span class="driver-value">+${o.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      `}),a.negative.length>0&&a.negative.forEach(s=>{const o=Math.abs(s.weight*100),l=Math.min(o*2,100);n+=`
        <div class="driver-item">
          <span class="driver-label">${s.label}</span>
          <div class="driver-bar-container">
            <div class="driver-bar negative" style="width: ${l}%">
              <span class="driver-value">-${o.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      `}),a.meta&&Object.keys(a.meta).length>0&&(n+=`
      <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid var(--border-color);">
        <small style="color: var(--text-secondary);">
    `,a.meta.base_value!==void 0&&(n+=`Base value: ${a.meta.base_value.toFixed(2)} `),a.meta.contrib_sum!==void 0&&(n+=`Contrib sum: ${a.meta.contrib_sum.toFixed(2)} `),a.meta.logit_total!==void 0&&(n+=`Logit total: ${a.meta.logit_total.toFixed(2)}`),n+=`
        </small>
      </div>
    `),n+="</div>",n}const Y=[{id:"uniklinik-freiburg",name:"Universitätsklinikum Freiburg",type:"comprehensive",address:"Hugstetter Str. 55, 79106 Freiburg im Breisgau",coordinates:{lat:48.0025,lng:7.8347},phone:"+49 761 270-0",emergency:"+49 761 270-34010",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"uniklinik-heidelberg",name:"Universitätsklinikum Heidelberg",type:"comprehensive",address:"Im Neuenheimer Feld 400, 69120 Heidelberg",coordinates:{lat:49.4178,lng:8.6706},phone:"+49 6221 56-0",emergency:"+49 6221 56-36643",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"uniklinik-tuebingen",name:"Universitätsklinikum Tübingen",type:"comprehensive",address:"Geissweg 3, 72076 Tübingen",coordinates:{lat:48.5378,lng:9.0538},phone:"+49 7071 29-0",emergency:"+49 7071 29-82211",services:["thrombectory","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"uniklinik-ulm",name:"Universitätsklinikum Ulm",type:"comprehensive",address:"Albert-Einstein-Allee 23, 89081 Ulm",coordinates:{lat:48.4196,lng:9.9592},phone:"+49 731 500-0",emergency:"+49 731 500-63001",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"klinikum-stuttgart",name:"Klinikum Stuttgart - Katharinenhospital",type:"comprehensive",address:"Kriegsbergstraße 60, 70174 Stuttgart",coordinates:{lat:48.7784,lng:9.1682},phone:"+49 711 278-0",emergency:"+49 711 278-32001",services:["thrombectomy","neurosurgery","icu"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"robert-bosch-stuttgart",name:"Robert-Bosch-Krankenhaus Stuttgart",type:"primary",address:"Auerbachstraße 110, 70376 Stuttgart",coordinates:{lat:48.7447,lng:9.2294},phone:"+49 711 8101-0",emergency:"+49 711 8101-3456",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"diakonie-stuttgart",name:"Diakonie-Klinikum Stuttgart",type:"primary",address:"Rosenbergstraße 38, 70176 Stuttgart",coordinates:{lat:48.7861,lng:9.1736},phone:"+49 711 991-0",emergency:"+49 711 991-2201",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"rkh-ludwigsburg",name:"RKH Klinikum Ludwigsburg",type:"primary",address:"Posilipostraße 4, 71640 Ludwigsburg",coordinates:{lat:48.8901,lng:9.1953},phone:"+49 7141 99-0",emergency:"+49 7141 99-67201",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-karlsruhe",name:"Städtisches Klinikum Karlsruhe",type:"comprehensive",address:"Moltkestraße 90, 76133 Karlsruhe",coordinates:{lat:49.0047,lng:8.3858},phone:"+49 721 974-0",emergency:"+49 721 974-2301",services:["thrombectomy","neurosurgery","icu"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"vincentius-karlsruhe",name:"ViDia Kliniken Karlsruhe - St. Vincentius",type:"primary",address:"Südendstraße 32, 76135 Karlsruhe",coordinates:{lat:48.9903,lng:8.3711},phone:"+49 721 8108-0",emergency:"+49 721 8108-9201",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-mannheim",name:"Universitätsmedizin Mannheim",type:"comprehensive",address:"Theodor-Kutzer-Ufer 1-3, 68167 Mannheim",coordinates:{lat:49.4828,lng:8.4664},phone:"+49 621 383-0",emergency:"+49 621 383-2251",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"theresienkrankenhaus-mannheim",name:"Theresienkrankenhaus Mannheim",type:"primary",address:"Bassermannstraße 1, 68165 Mannheim",coordinates:{lat:49.4904,lng:8.4594},phone:"+49 621 424-0",emergency:"+49 621 424-2101",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-pforzheim",name:"Helios Klinikum Pforzheim",type:"primary",address:"Kanzlerstraße 2-6, 75175 Pforzheim",coordinates:{lat:48.8833,lng:8.6936},phone:"+49 7231 969-0",emergency:"+49 7231 969-2301",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"zollernalb-klinikum",name:"Zollernalb Klinikum Albstadt",type:"primary",address:"Zollernring 10-14, 72488 Sigmaringen",coordinates:{lat:48.0878,lng:9.2233},phone:"+49 7571 100-0",emergency:"+49 7571 100-1501",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-konstanz",name:"Gesundheitsverbund Landkreis Konstanz",type:"primary",address:"Mainaustraße 14, 78464 Konstanz",coordinates:{lat:47.6779,lng:9.1732},phone:"+49 7531 801-0",emergency:"+49 7531 801-2301",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-friedrichshafen",name:"Klinikum Friedrichshafen",type:"primary",address:"Röntgenstraße 2, 88048 Friedrichshafen",coordinates:{lat:47.6587,lng:9.4685},phone:"+49 7541 96-0",emergency:"+49 7541 96-2401",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"oberschwabenklinik-ravensburg",name:"Oberschwabenklinik Ravensburg",type:"primary",address:"Elisabethenstraße 17, 88212 Ravensburg",coordinates:{lat:47.7815,lng:9.6078},phone:"+49 751 87-0",emergency:"+49 751 87-2201",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"alb-donau-klinikum",name:"Alb Donau Klinikum Ehingen",type:"primary",address:"Schwörhausgasse 7, 89584 Ehingen",coordinates:{lat:48.2833,lng:9.7262},phone:"+49 7391 789-0",emergency:"+49 7391 789-1801",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"ortenau-klinikum-offenburg",name:"Ortenau Klinikum Offenburg",type:"primary",address:"Ebertplatz 12, 77654 Offenburg",coordinates:{lat:48.4706,lng:7.9444},phone:"+49 781 472-0",emergency:"+49 781 472-2001",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-baden-baden",name:"Klinikum Mittelbaden Baden-Baden",type:"primary",address:"Balger Str. 50, 76532 Baden-Baden",coordinates:{lat:48.7606,lng:8.2275},phone:"+49 7221 91-0",emergency:"+49 7221 91-1701",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"}];function T(i,t,e,a){const s=S(e-i),o=S(a-t),l=Math.sin(s/2)*Math.sin(s/2)+Math.cos(S(i))*Math.cos(S(e))*Math.sin(o/2)*Math.sin(o/2);return 6371*(2*Math.atan2(Math.sqrt(l),Math.sqrt(1-l)))}function S(i){return i*(Math.PI/180)}async function Z(i,t,e,a,n="driving-car"){try{const s=`https://api.openrouteservice.org/v2/directions/${n}`,l=await fetch(s,{method:"POST",headers:{Accept:"application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",Authorization:"5b3ce3597851110001cf624868c4c27b63ae476c9c26c8bffbc35688","Content-Type":"application/json; charset=utf-8"},body:JSON.stringify({coordinates:[[t,i],[a,e]],radiuses:[1e3,1e3],format:"json"})});if(!l.ok)throw new Error(`Routing API error: ${l.status}`);const c=await l.json();if(c.routes&&c.routes.length>0){const p=c.routes[0];return{duration:Math.round(p.summary.duration/60),distance:Math.round(p.summary.distance/1e3),source:"routing"}}else throw new Error("No route found")}catch(s){console.warn("Travel time calculation failed, using distance estimate:",s);const o=T(i,t,e,a);return{duration:Math.round(o/.8),distance:Math.round(o),source:"estimated"}}}async function ge(i,t,e,a){try{const n=await Z(i,t,e,a,"driving-car");return{duration:Math.round(n.duration*.75),distance:n.distance,source:n.source==="routing"?"emergency-routing":"emergency-estimated"}}catch{const s=T(i,t,e,a);return{duration:Math.round(s/1.2),distance:Math.round(s),source:"emergency-estimated"}}}async function he(i,t,e=5,a=120,n=!0){return console.log("Calculating travel times to stroke centers..."),(await Promise.all(Y.map(async o=>{try{const l=n?await ge(i,t,o.coordinates.lat,o.coordinates.lng):await Z(i,t,o.coordinates.lat,o.coordinates.lng);return{...o,travelTime:l.duration,distance:l.distance,travelSource:l.source}}catch(l){console.warn(`Failed to calculate travel time to ${o.name}:`,l);const c=T(i,t,o.coordinates.lat,o.coordinates.lng);return{...o,travelTime:Math.round(c/.8),distance:Math.round(c),travelSource:"fallback"}}}))).filter(o=>o.travelTime<=a).sort((o,l)=>o.travelTime-l.travelTime).slice(0,e)}function ve(i,t,e=5,a=100){return Y.map(s=>({...s,distance:T(i,t,s.coordinates.lat,s.coordinates.lng)})).filter(s=>s.distance<=a).sort((s,o)=>s.distance-o.distance).slice(0,e)}async function be(i,t,e="stroke"){const a=await he(i,t,10,120,!0);if(e==="lvo"||e==="thrombectomy"){const n=a.filter(o=>o.type==="comprehensive"&&o.services.includes("thrombectomy")&&o.travelTime<=60),s=a.filter(o=>o.type==="primary");return{recommended:n.slice(0,3),alternative:s.slice(0,2)}}if(e==="ich"){const n=a.filter(s=>s.services.includes("neurosurgery")&&s.travelTime<=45);return{recommended:n.slice(0,3),alternative:a.filter(s=>!n.includes(s)).slice(0,2)}}return{recommended:a.slice(0,5),alternative:[]}}function fe(i,t,e="stroke"){const a=ve(i,t,10);if(e==="lvo"||e==="thrombectomy"){const n=a.filter(o=>o.type==="comprehensive"&&o.services.includes("thrombectomy")),s=a.filter(o=>o.type==="primary");return{recommended:n.slice(0,3),alternative:s.slice(0,2)}}return{recommended:a.slice(0,5),alternative:[]}}function ye(i){return`
    <div class="stroke-center-section">
      <h3>🏥 ${r("nearestCentersTitle")}</h3>
      <div id="locationContainer">
        <div class="location-controls">
          <button type="button" id="useGpsButton" class="secondary">
            📍 ${r("useCurrentLocation")}
          </button>
          <div class="location-manual" style="display: none;">
            <input type="text" id="locationInput" placeholder="${r("enterLocationPlaceholder")}" />
            <button type="button" id="searchLocationButton" class="secondary">${r("search")}</button>
          </div>
          <button type="button" id="manualLocationButton" class="secondary">
            ✏️ ${r("enterManually")}
          </button>
        </div>
        <div id="strokeCenterResults" class="stroke-center-results"></div>
      </div>
    </div>
  `}function ke(i){const t=document.getElementById("useGpsButton"),e=document.getElementById("manualLocationButton"),a=document.querySelector(".location-manual"),n=document.getElementById("locationInput"),s=document.getElementById("searchLocationButton"),o=document.getElementById("strokeCenterResults");t&&t.addEventListener("click",()=>{Se(i,o)}),e&&e.addEventListener("click",()=>{a.style.display=a.style.display==="none"?"block":"none"}),s&&s.addEventListener("click",()=>{const l=n.value.trim();l&&W(l,i,o)}),n&&n.addEventListener("keypress",l=>{if(l.key==="Enter"){const c=n.value.trim();c&&W(c,i,o)}})}function Se(i,t){if(!navigator.geolocation){C(r("geolocationNotSupported"),t);return}t.innerHTML=`<div class="loading">${r("gettingLocation")}...</div>`,navigator.geolocation.getCurrentPosition(e=>{const{latitude:a,longitude:n}=e.coords;Le(a,n,i,t)},e=>{let a=r("locationError");switch(e.code){case e.PERMISSION_DENIED:a=r("locationPermissionDenied");break;case e.POSITION_UNAVAILABLE:a=r("locationUnavailable");break;case e.TIMEOUT:a=r("locationTimeout");break}C(a,t)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:3e5})}async function W(i,t,e){e.innerHTML=`<div class="loading">${r("searchingLocation")}...</div>`,C(r("geocodingNotImplemented"),e)}async function Le(i,t,e,a){const n=Te(e);a.innerHTML=`
    <div class="location-info">
      <p><strong>${r("yourLocation")}:</strong> ${i.toFixed(4)}, ${t.toFixed(4)}</p>
    </div>
    <div class="loading">${r("calculatingTravelTimes")}...</div>
  `;try{const s=await be(i,t,n),o=`
      <div class="location-info">
        <p><strong>${r("yourLocation")}:</strong> ${i.toFixed(4)}, ${t.toFixed(4)}</p>
      </div>
      
      <div class="recommended-centers">
        <h4>${r("recommendedCenters")}</h4>
        ${L(s.recommended,!0)}
      </div>
      
      ${s.alternative.length>0?`
        <div class="alternative-centers">
          <h4>${r("alternativeCenters")}</h4>
          ${L(s.alternative,!1)}
        </div>
      `:""}
      
      <div class="travel-time-note">
        <small>${r("travelTimeNote")}</small>
        <br><small class="powered-by">${r("poweredByOrs")}</small>
      </div>
    `;a.innerHTML=o}catch(s){console.warn("Travel time calculation failed, falling back to distance:",s);const o=fe(i,t,n),l=`
      <div class="location-info">
        <p><strong>${r("yourLocation")}:</strong> ${i.toFixed(4)}, ${t.toFixed(4)}</p>
      </div>
      
      <div class="recommended-centers">
        <h4>${r("recommendedCenters")}</h4>
        ${L(o.recommended,!0)}
      </div>
      
      ${o.alternative.length>0?`
        <div class="alternative-centers">
          <h4>${r("alternativeCenters")}</h4>
          ${L(o.alternative,!1)}
        </div>
      `:""}
      
      <div class="distance-note">
        <small>${r("distanceNote")}</small>
      </div>
    `;a.innerHTML=l}}function L(i,t=!1){return!i||i.length===0?`<p>${r("noCentersFound")}</p>`:i.map(e=>`
    <div class="stroke-center-card ${t?"recommended":"alternative"}">
      <div class="center-header">
        <h5>${e.name}</h5>
        <span class="center-type ${e.type}">${r(e.type+"Center")}</span>
        ${e.travelTime?`
          <span class="travel-time">
            <span class="time">${e.travelTime} ${r("minutes")}</span>
            <span class="distance">(${e.distance} km)</span>
          </span>
        `:`
          <span class="distance">${e.distance.toFixed(1)} km</span>
        `}
      </div>
      
      <div class="center-details">
        <p class="address">📍 ${e.address}</p>
        <p class="phone">📞 ${r("emergency")}: ${e.emergency}</p>
        
        <div class="services">
          ${e.services.map(a=>`
            <span class="service-badge">${r(a)}</span>
          `).join("")}
        </div>
        
        ${e.certified?`
          <div class="certification">
            ✅ ${r("certified")}: ${e.certification}
          </div>
        `:""}
      </div>
      
      <div class="center-actions">
        <button class="call-button" onclick="window.open('tel:${e.emergency}')">
          📞 ${r("call")}
        </button>
        <button class="directions-button" onclick="window.open('https://maps.google.com/maps?daddr=${e.coordinates.lat},${e.coordinates.lng}', '_blank')">
          🧭 ${r("directions")}
        </button>
      </div>
    </div>
  `).join("")}function Te(i){return i?i.lvo&&i.lvo.probability>.5?"lvo":i.ich&&i.ich.probability>.6?"ich":"stroke":"stroke"}function C(i,t){t.innerHTML=`
    <div class="location-error">
      <p>⚠️ ${i}</p>
      <p><small>${r("tryManualEntry")}</small></p>
    </div>
  `}function j(i,t){const e=Number(i),a=$[t];return e>=a.critical?"🔴 CRITICAL RISK":e>=a.high?"🟠 HIGH RISK":e>=30?"🟡 MODERATE RISK":"🟢 LOW RISK"}function we(){const t=m.getState().formData;if(!t||Object.keys(t).length===0)return"";let e="";return Object.entries(t).forEach(([a,n])=>{if(n&&Object.keys(n).length>0){const s=r(`${a}ModuleTitle`)||a.charAt(0).toUpperCase()+a.slice(1);let o="";Object.entries(n).forEach(([l,c])=>{if(c===""||c===null||c===void 0)return;let p=l;r(`${l}Label`)?p=r(`${l}Label`):p=l.replace(/_/g," ").replace(/\b\w/g,b=>b.toUpperCase());let u=c;typeof c=="boolean"&&(u=c?"✓":"✗"),o+=`
          <div class="summary-item">
            <span class="summary-label">${p}:</span>
            <span class="summary-value">${u}</span>
          </div>
        `}),o&&(e+=`
          <div class="summary-module">
            <h4>${s}</h4>
            <div class="summary-items">
              ${o}
            </div>
          </div>
        `)}}),e?`
    <div class="input-summary">
      <h3>📋 ${r("inputSummaryTitle")}</h3>
      <p class="summary-subtitle">${r("inputSummarySubtitle")}</p>
      <div class="summary-content">
        ${e}
      </div>
    </div>
  `:""}function Ee(i,t){const{ich:e,lvo:a}=i;let n="",s="";if(e){const u=Math.round((e.probability||0)*100);n=`
      <div class="result-card ${u>$.ich.critical?"critical":"ich"}">
        <h3> 🧠 ${r("ichProbability")} <small>(${e.module} Module)</small> </h3>
        <div class="probability-display">${u}%</div>
        <div class="probability-meter">
          <div class="probability-fill" style="width: ${u}%"></div>
          <div class="probability-marker" style="left: ${u}%">${u}%</div>
        </div>
        <p><strong>${r("riskLevel")}:</strong> ${j(u,"ich")}</p>
      </div>
    `}if(a)if(a.notPossible)s=`
        <div class="result-card info">
          <h3>🔍 ${r("lvoProbability")}</h3>
          <p>LVO assessment not possible with limited data.</p>
          <p>A full neurological examination is required for LVO screening.</p>
        </div>
      `;else{const u=Math.round((a.probability||0)*100);s=`
        <div class="result-card ${u>$.lvo.critical?"critical":"lvo"}">
          <h3> 🩸 ${r("lvoProbability")} <small>(${a.module} Module)</small> </h3>
          <div class="probability-display">${u}%</div>
          <div class="probability-meter">
            <div class="probability-fill" style="width: ${u}%"></div>
            <div class="probability-marker" style="left: ${u}%">${u}%</div>
          </div>
          <p><strong>${r("riskLevel")}:</strong> ${j(u,"lvo")}</p>
        </div>
      `}const o=e&&e.probability>.6?oe():"",l=pe(e,a),c=ye(),p=we();return`
    <div class="container">
      ${y(3)}
      <h2>${r("resultsTitle")}</h2>
      ${o}
      <div style="display: flex; flex-direction: column; gap: 20px;">
        ${n}
        ${s}
      </div>
      ${p}
      ${l}
      ${c}
      <div class="results-actions">
        <div class="primary-actions">
          <button type="button" class="primary" id="printResults"> 📄 ${r("printResults")} </button>
          <button type="button" class="secondary" data-action="reset"> ${r("newAssessment")} </button>
        </div>
        <div class="navigation-actions">
          <button type="button" class="tertiary" data-action="goBack"> ← ${r("goBack")} </button>
          <button type="button" class="tertiary" data-action="goHome"> 🏠 ${r("goHome")} </button>
        </div>
      </div>
      <div class="disclaimer">
        <strong>⚠️ ${r("importantNote")}:</strong> ${r("importantText")} Results generated at ${new Date().toLocaleTimeString()}.
      </div>
    </div>
  `}function $e(i,t,e){const a=[];return e.required&&!t&&t!==0&&a.push("This field is required"),e.min!==void 0&&t!==""&&!isNaN(t)&&parseFloat(t)<e.min&&a.push(`Value must be at least ${e.min}`),e.max!==void 0&&t!==""&&!isNaN(t)&&parseFloat(t)>e.max&&a.push(`Value must be at most ${e.max}`),e.pattern&&!e.pattern.test(t)&&a.push("Invalid format"),a}function _e(i){let t=!0;const e={};return Object.entries(ae).forEach(([a,n])=>{const s=i.elements[a];if(s){const o=$e(a,s.value,n);o.length>0&&(e[a]=o,t=!1)}}),{isValid:t,validationErrors:e}}function Ce(i,t){Object.entries(t).forEach(([e,a])=>{const n=i.querySelector(`[name="${e}"]`);if(n){const s=n.closest(".input-group");if(s){s.classList.add("error"),s.querySelectorAll(".error-message").forEach(l=>l.remove());const o=document.createElement("div");o.className="error-message",o.innerHTML=`<span class="error-icon">⚠️</span> ${a[0]}`,s.appendChild(o)}}})}function De(i){i.querySelectorAll(".input-group.error").forEach(t=>{t.classList.remove("error"),t.querySelectorAll(".error-message").forEach(e=>e.remove())})}class h extends Error{constructor(t,e,a){super(t),this.name="APIError",this.status=e,this.url=a}}function D(i){const t={...i};return Object.keys(t).forEach(e=>{const a=t[e];(typeof a=="boolean"||a==="on"||a==="true"||a==="false")&&(t[e]=a===!0||a==="on"||a==="true"?1:0)}),t}function v(i,t=0){const e=parseFloat(i);return isNaN(e)?t:e}async function A(i,t){const e=new AbortController,a=setTimeout(()=>e.abort(),_.requestTimeout);try{const n=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(t),signal:e.signal,mode:"cors"});if(clearTimeout(a),!n.ok){let o=`HTTP ${n.status}`;try{const l=await n.json();o=l.error||l.message||o}catch{o=`${o}: ${n.statusText}`}throw new h(o,n.status,i)}return await n.json()}catch(n){throw clearTimeout(a),n.name==="AbortError"?new h("Request timeout - please try again",408,i):n instanceof h?n:new h("Network error - please check your connection and try again",0,i)}}async function Ae(i){const t=D(i);console.log("Coma ICH API Payload:",t);try{const e=await A(f.COMA_ICH,t);return console.log("Coma ICH API Response:",e),{probability:v(e.probability||e.ich_probability,0),drivers:e.drivers||null,confidence:v(e.confidence,.75),module:"Coma"}}catch(e){throw console.error("Coma ICH prediction failed:",e),new h(`Failed to get ICH prediction: ${e.message}`,e.status,f.COMA_ICH)}}async function Me(i){const t={age_years:i.age_years,systolic_bp:i.systolic_bp,diastolic_bp:i.diastolic_bp,gfap_value:i.gfap_value,vigilanzminderung:i.vigilanzminderung||0},e=D(t);console.log("Limited Data ICH API Payload:",e);try{const a=await A(f.LDM_ICH,e);return console.log("Limited Data ICH API Response:",a),{probability:v(a.probability||a.ich_probability,0),drivers:a.drivers||null,confidence:v(a.confidence,.65),module:"Limited Data"}}catch(a){throw console.error("Limited Data ICH prediction failed:",a),new h(`Failed to get ICH prediction: ${a.message}`,a.status,f.LDM_ICH)}}async function Pe(i){var a,n,s,o,l,c,p,u,b,P,I,N,x,B,H,F,R,z;const t={age_years:i.age_years,systolic_bp:i.systolic_bp,diastolic_bp:i.diastolic_bp,gfap_value:i.gfap_value,fast_ed_score:i.fast_ed_score,headache:i.headache||0,vigilanzminderung:i.vigilanzminderung||0,armparese:i.armparese||0,beinparese:i.beinparese||0,eye_deviation:i.eye_deviation||0,atrial_fibrillation:i.atrial_fibrillation||0,anticoagulated_noak:i.anticoagulated_noak||0,antiplatelets:i.antiplatelets||0},e=D(t);console.log("Full Stroke API Payload:",e);try{const d=await A(f.FULL_STROKE,e);console.log("Full Stroke API Response:",d),console.log("Available keys in response:",Object.keys(d)),console.log("Response type:",typeof d),Object.keys(d).forEach(U=>{const k=d[U];typeof k=="number"&&k>=0&&k<=1&&console.log(`Potential probability field: ${U} = ${k}`)});const O=v(((a=d.ich_prediction)==null?void 0:a.probability)||d.ich_probability||((n=d.ich)==null?void 0:n.probability)||d.ICH_probability||d.ich_prob||((s=d.probability)==null?void 0:s.ich)||((o=d.results)==null?void 0:o.ich_probability),0),G=v(((l=d.lvo_prediction)==null?void 0:l.probability)||d.lvo_probability||((c=d.lvo)==null?void 0:c.probability)||d.LVO_probability||d.lvo_prob||((p=d.probability)==null?void 0:p.lvo)||((u=d.results)==null?void 0:u.lvo_probability),0);console.log("Extracted probabilities:",{ich:O,lvo:G});const Q={probability:O,drivers:((b=d.ich_prediction)==null?void 0:b.drivers)||d.ich_drivers||((P=d.ich)==null?void 0:P.drivers)||((I=d.drivers)==null?void 0:I.ich)||null,confidence:v(((N=d.ich_prediction)==null?void 0:N.confidence)||d.ich_confidence||((x=d.ich)==null?void 0:x.confidence),.85),module:"Full Stroke"},X={probability:G,drivers:((B=d.lvo_prediction)==null?void 0:B.drivers)||d.lvo_drivers||((H=d.lvo)==null?void 0:H.drivers)||((F=d.drivers)==null?void 0:F.lvo)||null,confidence:v(((R=d.lvo_prediction)==null?void 0:R.confidence)||d.lvo_confidence||((z=d.lvo)==null?void 0:z.confidence),.85),module:"Full Stroke"};return{ich:Q,lvo:X}}catch(d){throw console.error("Full Stroke prediction failed:",d),new h(`Failed to get stroke predictions: ${d.message}`,d.status,f.FULL_STROKE)}}function Ie(i){m.logEvent("triage1_answer",{comatose:i}),M(i?"coma":"triage2")}function Ne(i){m.logEvent("triage2_answer",{examinable:i}),M(i?"full":"limited")}function M(i){m.logEvent("navigate",{from:m.getState().currentScreen,to:i}),m.navigate(i),window.scrollTo(0,0)}function xe(){m.hasUnsavedData()&&!confirm("Are you sure you want to start over? All entered data will be lost.")||(m.logEvent("reset"),m.reset())}function Be(){console.log("goBack() called");const i=m.goBack();console.log("goBack() success:",i),i?(m.logEvent("navigate_back"),window.scrollTo(0,0)):(console.log("No history available, going home instead"),J())}function J(){console.log("goHome() called"),m.logEvent("navigate_home"),m.goHome(),window.scrollTo(0,0)}async function He(i,t){i.preventDefault();const e=i.target,a=e.dataset.module,n=_e(e);if(!n.isValid){Ce(t,n.validationErrors);return}const s={};Array.from(e.elements).forEach(c=>{if(c.name)if(c.type==="checkbox")s[c.name]=c.checked;else if(c.type==="number"){const p=parseFloat(c.value);s[c.name]=isNaN(p)?0:p}else c.type==="hidden"&&c.name==="armparese"?s[c.name]=c.value==="true":s[c.name]=c.value}),console.log("Collected form inputs:",s),m.setFormData(a,s);const o=e.querySelector("button[type=submit]"),l=o?o.innerHTML:"";o&&(o.disabled=!0,o.innerHTML=`<span class="loading-spinner"></span> ${r("analyzing")}`);try{let c;switch(a){case"coma":c={ich:await Ae(s),lvo:null};break;case"limited":c={ich:await Me(s),lvo:{notPossible:!0}};break;case"full":c=await Pe(s);break;default:throw new Error("Unknown module: "+a)}m.setResults(c),m.logEvent("models_complete",{module:a,results:c}),M("results")}catch(c){console.error("Error running models:",c);let p="An error occurred during analysis. Please try again.";c instanceof h&&(p=c.message),Fe(t,p),o&&(o.disabled=!1,o.innerHTML=l)}}function Fe(i,t){i.querySelectorAll(".critical-alert").forEach(n=>{var s,o;(o=(s=n.querySelector("h4"))==null?void 0:s.textContent)!=null&&o.includes("Error")&&n.remove()});const e=document.createElement("div");e.className="critical-alert",e.innerHTML=`<h4><span class="alert-icon">⚠️</span> Error</h4><p>${t}</p>`;const a=i.querySelector(".container");a?a.prepend(e):i.prepend(e),setTimeout(()=>e.remove(),1e4)}function Re(i){const t=document.createElement("div");t.className="sr-only",t.setAttribute("role","status"),t.setAttribute("aria-live","polite");const e={triage1:"Coma assessment",triage2:"Examination capability assessment",coma:"Coma module",limited:"Limited data module",full:"Full stroke assessment",results:"Assessment results"};t.textContent=`Navigated to ${e[i]||i}`,document.body.appendChild(t),setTimeout(()=>t.remove(),1e3)}function ze(i){const t={triage1:"Initial Assessment - Stroke Triage Assistant",triage2:"Examination Capability - Stroke Triage Assistant",coma:"Coma Module - Stroke Triage Assistant",limited:"Limited Data Module - Stroke Triage Assistant",full:"Full Stroke Module - Stroke Triage Assistant",results:"Assessment Results - Stroke Triage Assistant"};document.title=t[i]||"Stroke Triage Assistant"}function Oe(){setTimeout(()=>{const i=document.querySelector("h2");i&&(i.setAttribute("tabindex","-1"),i.focus(),setTimeout(()=>i.removeAttribute("tabindex"),100))},100)}class Ge{constructor(){this.scores={facial_palsy:0,arm_weakness:0,speech_changes:0,eye_deviation:0,denial_neglect:0},this.onApply=null,this.modal=null}getTotal(){return Object.values(this.scores).reduce((t,e)=>t+e,0)}getRiskLevel(){return this.getTotal()>=4?"high":"low"}render(){const t=this.getTotal(),e=this.getRiskLevel();return`
      <div id="fastEdModal" class="modal" role="dialog" aria-labelledby="fastEdModalTitle" aria-hidden="true" style="display: none;">
        <div class="modal-content fast-ed-modal">
          <div class="modal-header">
            <h2 id="fastEdModalTitle">${r("fastEdCalculatorTitle")}</h2>
            <button class="modal-close" aria-label="Close">&times;</button>
          </div>
          <div class="modal-body">
            
            <!-- Facial Palsy -->
            <div class="fast-ed-component">
              <h3>${r("facialPalsyTitle")}</h3>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="facial_palsy" value="0" ${this.scores.facial_palsy===0?"checked":""}>
                  <span class="radio-label">${r("facialPalsyNormal")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="facial_palsy" value="1" ${this.scores.facial_palsy===1?"checked":""}>
                  <span class="radio-label">${r("facialPalsyMild")}</span>
                </label>
              </div>
            </div>

            <!-- Arm Weakness -->
            <div class="fast-ed-component">
              <h3>${r("armWeaknessTitle")}</h3>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="arm_weakness" value="0" ${this.scores.arm_weakness===0?"checked":""}>
                  <span class="radio-label">${r("armWeaknessNormal")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="arm_weakness" value="1" ${this.scores.arm_weakness===1?"checked":""}>
                  <span class="radio-label">${r("armWeaknessMild")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="arm_weakness" value="2" ${this.scores.arm_weakness===2?"checked":""}>
                  <span class="radio-label">${r("armWeaknessSevere")}</span>
                </label>
              </div>
            </div>

            <!-- Speech Changes -->
            <div class="fast-ed-component">
              <h3>${r("speechChangesTitle")}</h3>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="speech_changes" value="0" ${this.scores.speech_changes===0?"checked":""}>
                  <span class="radio-label">${r("speechChangesNormal")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="speech_changes" value="1" ${this.scores.speech_changes===1?"checked":""}>
                  <span class="radio-label">${r("speechChangesMild")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="speech_changes" value="2" ${this.scores.speech_changes===2?"checked":""}>
                  <span class="radio-label">${r("speechChangesSevere")}</span>
                </label>
              </div>
            </div>

            <!-- Eye Deviation -->
            <div class="fast-ed-component">
              <h3>${r("eyeDeviationTitle")}</h3>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="eye_deviation" value="0" ${this.scores.eye_deviation===0?"checked":""}>
                  <span class="radio-label">${r("eyeDeviationNormal")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="eye_deviation" value="1" ${this.scores.eye_deviation===1?"checked":""}>
                  <span class="radio-label">${r("eyeDeviationPartial")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="eye_deviation" value="2" ${this.scores.eye_deviation===2?"checked":""}>
                  <span class="radio-label">${r("eyeDeviationForced")}</span>
                </label>
              </div>
            </div>

            <!-- Denial/Neglect -->
            <div class="fast-ed-component">
              <h3>${r("denialNeglectTitle")}</h3>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="denial_neglect" value="0" ${this.scores.denial_neglect===0?"checked":""}>
                  <span class="radio-label">${r("denialNeglectNormal")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="denial_neglect" value="1" ${this.scores.denial_neglect===1?"checked":""}>
                  <span class="radio-label">${r("denialNeglectPartial")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="denial_neglect" value="2" ${this.scores.denial_neglect===2?"checked":""}>
                  <span class="radio-label">${r("denialNeglectComplete")}</span>
                </label>
              </div>
            </div>

            <!-- Total Score Display -->
            <div class="fast-ed-total">
              <div class="score-display">
                <h3>${r("totalScoreTitle")}: <span class="total-score">${t}/9</span></h3>
                <div class="risk-indicator ${e}">
                  ${r("riskLevel")}: ${r(e==="high"?"riskLevelHigh":"riskLevelLow")}
                </div>
              </div>
            </div>

          </div>
          <div class="modal-footer">
            <button class="secondary" data-action="cancel-fast-ed">${r("cancel")}</button>
            <button class="primary" data-action="apply-fast-ed">${r("applyScore")}</button>
          </div>
        </div>
      </div>
    `}setupEventListeners(){if(this.modal=document.getElementById("fastEdModal"),!this.modal)return;this.modal.addEventListener("change",n=>{if(n.target.type==="radio"){const s=n.target.name,o=parseInt(n.target.value);this.scores[s]=o,this.updateDisplay()}});const t=this.modal.querySelector(".modal-close");t==null||t.addEventListener("click",()=>this.close());const e=this.modal.querySelector('[data-action="cancel-fast-ed"]');e==null||e.addEventListener("click",()=>this.close());const a=this.modal.querySelector('[data-action="apply-fast-ed"]');a==null||a.addEventListener("click",()=>this.apply()),this.modal.addEventListener("click",n=>{n.target===this.modal&&this.close()}),document.addEventListener("keydown",n=>{var s;n.key==="Escape"&&((s=this.modal)!=null&&s.classList.contains("show"))&&this.close()})}updateDisplay(){var a,n;const t=(a=this.modal)==null?void 0:a.querySelector(".total-score"),e=(n=this.modal)==null?void 0:n.querySelector(".risk-indicator");if(t&&(t.textContent=`${this.getTotal()}/9`),e){const s=this.getRiskLevel();e.className=`risk-indicator ${s}`,e.textContent=`${r("riskLevel")}: ${r(s==="high"?"riskLevelHigh":"riskLevelLow")}`}}show(t=0,e=null){this.onApply=e,t>0&&t<=9&&this.approximateFromTotal(t),document.getElementById("fastEdModal")?(this.modal.remove(),document.body.insertAdjacentHTML("beforeend",this.render()),this.modal=document.getElementById("fastEdModal")):document.body.insertAdjacentHTML("beforeend",this.render()),this.setupEventListeners(),this.modal.style.display="flex",this.modal.classList.add("show"),this.modal.setAttribute("aria-hidden","false");const a=this.modal.querySelector('input[type="radio"]');a==null||a.focus()}close(){this.modal&&(this.modal.classList.remove("show"),this.modal.style.display="none",this.modal.setAttribute("aria-hidden","true"))}apply(){const t=this.getTotal(),e=this.scores.arm_weakness>0,a=this.scores.eye_deviation>0;this.onApply&&this.onApply({total:t,components:{...this.scores},armWeaknessBoolean:e,eyeDeviationBoolean:a}),this.close()}approximateFromTotal(t){this.scores={facial_palsy:0,arm_weakness:0,speech_changes:0,eye_deviation:0,denial_neglect:0};let e=t;const a=Object.keys(this.scores);for(const n of a){if(e<=0)break;const o=Math.min(e,n==="facial_palsy"?1:2);this.scores[n]=o,e-=o}}}const Ue=new Ge;function w(i){const t=m.getState(),{currentScreen:e,results:a,startTime:n}=t;i.innerHTML="";let s="";switch(e){case"triage1":s=V();break;case"triage2":s=ie();break;case"coma":s=se();break;case"limited":s=ne();break;case"full":s=re();break;case"results":s=Ee(a);break;default:s=V()}i.innerHTML=s;const o=i.querySelector("form[data-module]");if(o){const l=o.dataset.module;qe(o,l)}Ve(i),e==="results"&&a&&setTimeout(()=>{ke(a)},100),Re(e),ze(e),Oe()}function qe(i,t){const e=m.getFormData(t);!e||Object.keys(e).length===0||Object.entries(e).forEach(([a,n])=>{const s=i.elements[a];s&&(s.type==="checkbox"?s.checked=n===!0||n==="on"||n==="true":s.value=n)})}function Ve(i){i.querySelectorAll('input[type="number"]').forEach(a=>{a.addEventListener("blur",()=>{De(i)})}),i.querySelectorAll("[data-action]").forEach(a=>{a.addEventListener("click",n=>{const{action:s,value:o}=n.currentTarget.dataset,l=o==="true";switch(s){case"triage1":Ie(l);break;case"triage2":Ne(l);break;case"reset":xe();break;case"goBack":Be();break;case"goHome":J();break}})}),i.querySelectorAll("form[data-module]").forEach(a=>{a.addEventListener("submit",n=>{He(n,i)})});const t=i.querySelector("#printResults");t&&t.addEventListener("click",()=>window.print());const e=i.querySelector("#fast_ed_score");e&&(e.addEventListener("click",a=>{a.preventDefault();const n=parseInt(e.value)||0;Ue.show(n,s=>{e.value=s.total;const o=i.querySelector("#armparese_hidden");o&&(o.value=s.armWeaknessBoolean?"true":"false");const l=i.querySelector("#eye_deviation");l&&(l.checked=s.eyeDeviationBoolean),e.dispatchEvent(new Event("change",{bubbles:!0}))})}),e.addEventListener("keydown",a=>{a.preventDefault()}))}class Ke{constructor(){this.container=null,this.unsubscribe=null}async init(){if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",()=>this.init());return}if(this.container=document.getElementById("appContainer"),!this.container){console.error("App container not found");return}this.unsubscribe=m.subscribe(()=>{w(this.container)}),window.addEventListener("languageChanged",()=>{this.updateUILanguage(),w(this.container)}),this.setupGlobalEventListeners(),this.initializeTheme(),this.updateUILanguage(),this.startAutoSave(),this.setupSessionTimeout(),this.setCurrentYear(),this.registerServiceWorker(),w(this.container),console.log("Stroke Triage Assistant initialized")}setupGlobalEventListeners(){const t=document.getElementById("languageToggle");t&&t.addEventListener("click",()=>this.toggleLanguage());const e=document.getElementById("darkModeToggle");e&&e.addEventListener("click",()=>this.toggleDarkMode()),this.setupHelpModal(),this.setupFooterLinks(),document.addEventListener("keydown",a=>{if(a.key==="Escape"){const n=document.getElementById("helpModal");n&&n.classList.contains("show")&&(n.classList.remove("show"),n.style.display="none",n.setAttribute("aria-hidden","true"))}}),window.addEventListener("beforeunload",a=>{m.hasUnsavedData()&&(a.preventDefault(),a.returnValue="You have unsaved data. Are you sure you want to leave?")})}setupHelpModal(){const t=document.getElementById("helpButton"),e=document.getElementById("helpModal"),a=e==null?void 0:e.querySelector(".modal-close");if(t&&e){e.classList.remove("show"),e.style.display="none",e.setAttribute("aria-hidden","true"),t.addEventListener("click",()=>{e.style.display="flex",e.classList.add("show"),e.setAttribute("aria-hidden","false")});const n=()=>{e.classList.remove("show"),e.style.display="none",e.setAttribute("aria-hidden","true")};a==null||a.addEventListener("click",n),e.addEventListener("click",s=>{s.target===e&&n()})}}setupFooterLinks(){var t,e;(t=document.getElementById("privacyLink"))==null||t.addEventListener("click",a=>{a.preventDefault(),this.showPrivacyPolicy()}),(e=document.getElementById("disclaimerLink"))==null||e.addEventListener("click",a=>{a.preventDefault(),this.showDisclaimer()})}initializeTheme(){const t=localStorage.getItem("theme"),e=document.getElementById("darkModeToggle");(t==="dark"||!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)&&(document.body.classList.add("dark-mode"),e&&(e.textContent="☀️"))}toggleLanguage(){E.toggleLanguage(),this.updateUILanguage()}updateUILanguage(){document.documentElement.lang=E.getCurrentLanguage();const t=document.querySelector(".app-header h1");t&&(t.textContent=r("appTitle"));const e=document.querySelector(".emergency-badge");e&&(e.textContent=r("emergencyBadge"));const a=document.getElementById("languageToggle");a&&(a.title=r("languageToggle"),a.setAttribute("aria-label",r("languageToggle")));const n=document.getElementById("helpButton");n&&(n.title=r("helpButton"),n.setAttribute("aria-label",r("helpButton")));const s=document.getElementById("darkModeToggle");s&&(s.title=r("darkModeButton"),s.setAttribute("aria-label",r("darkModeButton")));const o=document.getElementById("modalTitle");o&&(o.textContent=r("helpTitle"))}toggleDarkMode(){const t=document.getElementById("darkModeToggle");document.body.classList.toggle("dark-mode");const e=document.body.classList.contains("dark-mode");t&&(t.textContent=e?"☀️":"🌙"),localStorage.setItem("theme",e?"dark":"light")}startAutoSave(){setInterval(()=>{this.saveCurrentFormData()},_.autoSaveInterval)}saveCurrentFormData(){this.container.querySelectorAll("form[data-module]").forEach(e=>{const a=new FormData(e),n=e.dataset.module;if(n){const s={};a.forEach((c,p)=>{const u=e.elements[p];u&&u.type==="checkbox"?s[p]=u.checked:s[p]=c});const o=m.getFormData(n);JSON.stringify(o)!==JSON.stringify(s)&&m.setFormData(n,s)}})}setupSessionTimeout(){setTimeout(()=>{confirm("Your session has been idle for 30 minutes. Would you like to continue?")?this.setupSessionTimeout():m.reset()},_.sessionTimeout)}setCurrentYear(){const t=document.getElementById("currentYear");t&&(t.textContent=new Date().getFullYear())}showPrivacyPolicy(){alert("Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.")}showDisclaimer(){alert("Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.")}async registerServiceWorker(){if(!("serviceWorker"in navigator)){console.log("Service Workers not supported");return}try{const t=await navigator.serviceWorker.register("/0825/sw.js",{scope:"/0825/"});console.log("Service Worker registered successfully:",t),t.addEventListener("updatefound",()=>{const e=t.installing;console.log("New service worker found"),e.addEventListener("statechange",()=>{e.state==="installed"&&navigator.serviceWorker.controller&&(console.log("New service worker installed, update available"),this.showUpdateNotification())})}),navigator.serviceWorker.addEventListener("message",e=>{console.log("Message from service worker:",e.data)})}catch(t){console.error("Service Worker registration failed:",t)}}showUpdateNotification(){const t=document.createElement("div");t.style.cssText=`
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
    `,t.textContent="App update available - Tap to refresh",t.addEventListener("click",()=>{window.location.reload()}),document.body.appendChild(t),setTimeout(()=>{t.parentNode&&t.remove()},1e4)}destroy(){this.unsubscribe&&this.unsubscribe()}}const We=new Ke;We.init();
//# sourceMappingURL=index-kEMNKm8F.js.map
