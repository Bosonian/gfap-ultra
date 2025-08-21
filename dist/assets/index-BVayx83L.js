(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function e(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(r){if(r.ep)return;r.ep=!0;const s=e(r);fetch(r.href,s)}})();class K{constructor(){this.state={currentScreen:"triage1",results:null,sessionId:null,startTime:null,formData:{},validationErrors:{},screenHistory:[]},this.listeners=new Set,this.initialize()}initialize(){this.state.sessionId=this.generateSessionId(),this.state.startTime=Date.now(),console.log("Store initialized with session:",this.state.sessionId)}generateSessionId(){return"session_"+Date.now()+"_"+Math.random().toString(36).substr(2,9)}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}notify(){this.listeners.forEach(t=>t(this.state))}getState(){return{...this.state}}setState(t){this.state={...this.state,...t},this.notify()}navigate(t){console.log(`Navigating from ${this.state.currentScreen} to ${t}`);const e=[...this.state.screenHistory];this.state.currentScreen!==t&&!e.includes(this.state.currentScreen)&&e.push(this.state.currentScreen),this.setState({currentScreen:t,screenHistory:e})}goBack(){const t=[...this.state.screenHistory];if(t.length>0){const e=t.pop();return this.setState({currentScreen:e,screenHistory:t}),!0}return!1}goHome(){this.setState({currentScreen:"triage1",screenHistory:[]})}setFormData(t,e){const a={...this.state.formData};a[t]={...e},this.setState({formData:a})}getFormData(t){return this.state.formData[t]||{}}setValidationErrors(t){this.setState({validationErrors:t})}clearValidationErrors(){this.setState({validationErrors:{}})}setResults(t){this.setState({results:t})}hasUnsavedData(){return Object.keys(this.state.formData).length>0&&!this.state.results}reset(){const t={currentScreen:"triage1",results:null,sessionId:this.generateSessionId(),startTime:Date.now(),formData:{},validationErrors:{},screenHistory:[]};this.setState(t),console.log("Store reset with new session:",t.sessionId)}logEvent(t,e={}){const a={timestamp:Date.now(),session:this.state.sessionId,event:t,data:e};console.log("Event:",a)}getSessionDuration(){return Date.now()-this.state.startTime}}const g=new K;function y(i){const t=[{id:1,label:"Triage"},{id:2,label:"Assessment"},{id:3,label:"Results"}];let e='<div class="progress-indicator">';return t.forEach((a,r)=>{const s=a.id===i,n=a.id<i;e+=`
      <div class="progress-step ${s?"active":""} ${n?"completed":""}">
        ${n?"":a.id}
      </div>
    `,r<t.length-1&&(e+=`<div class="progress-line ${n?"completed":""}"></div>`)}),e+="</div>",e}const H={en:{appTitle:"Stroke Triage Assistant",emergencyBadge:"Emergency Tool",helpButton:"Help and Instructions",darkModeButton:"Toggle dark mode",languageToggle:"Language",step1:"Initial Assessment",step2:"Data Collection",step3:"Results",comaModuleTitle:"Coma Module",limitedDataModuleTitle:"Limited Data Module",fullStrokeModuleTitle:"Full Stroke Module",triage1Title:"Patient Assessment",triage1Question:"Is the patient comatose?",triage1Help:"Glasgow Coma Scale < 8",triage1Yes:"YES - Comatose",triage1No:"NO - Conscious",triage2Title:"Examination Capability",triage2Question:"Can the patient be reliably examined?",triage2Help:"Patient is not aphasic, confused, or uncooperative",triage2Yes:"YES - Full Exam Possible",triage2No:"NO - Limited Exam Only",ageLabel:"Age (years)",ageHelp:"Patient age in years",systolicLabel:"Systolic BP (mmHg)",systolicHelp:"Systolic blood pressure",diastolicLabel:"Diastolic BP (mmHg)",diastolicHelp:"Diastolic blood pressure",gfapLabel:"GFAP Value (pg/mL)",gfapHelp:"GFAP biomarker level",fastEdLabel:"FAST-ED Score",fastEdHelp:"FAST-ED assessment score (0-9)",headacheLabel:"Headache",vigilanzLabel:"Reduced consciousness",armPareseLabel:"Arm weakness",beinPareseLabel:"Leg weakness",eyeDeviationLabel:"Eye deviation",atrialFibLabel:"Atrial fibrillation",anticoagLabel:"Anticoagulated (NOAK)",antiplateletsLabel:"Antiplatelets",analyzeButton:"Analyze",analyzing:"Analyzing...",printResults:"Print Results",newAssessment:"Start New Assessment",startOver:"Start Over",goBack:"Go Back",goHome:"Go Home",basicInformation:"Basic Information",biomarkersScores:"Biomarkers & Scores",clinicalSymptoms:"Clinical Symptoms",medicalHistory:"Medical History",ageYearsLabel:"Age (years)",systolicBpLabel:"Systolic BP (mmHg)",diastolicBpLabel:"Diastolic BP (mmHg)",gfapValueLabel:"GFAP Value (pg/mL)",fastEdScoreLabel:"FAST-ED Score",ageYearsHelp:"Patient's age in years",systolicBpHelp:"Normal: 90-140 mmHg",diastolicBpHelp:"Normal: 60-90 mmHg",gfapTooltip:"Brain injury biomarker",gfapTooltipLong:"Glial Fibrillary Acidic Protein - Brain injury biomarker",gfapRange:"Range: {min} - {max} pg/mL",fastEdTooltip:"0-9 scale for LVO screening",analyzeIchRisk:"Analyze ICH Risk",analyzeStrokeRisk:"Analyze Stroke Risk",criticalPatient:"Critical Patient",comaAlert:"Patient is comatose (GCS < 8). Rapid assessment required.",vigilanceReduction:"Vigilance Reduction (Decreased alertness)",armParesis:"Arm Paresis",legParesis:"Leg Paresis",eyeDeviation:"Eye Deviation",atrialFibrillation:"Atrial Fibrillation",onNoacDoac:"On NOAC/DOAC",onAntiplatelets:"On Antiplatelets",resultsTitle:"Assessment Results",ichProbability:"ICH Probability",lvoProbability:"LVO Probability",riskLevel:"Risk Level",lowRisk:"Low Risk",moderateRisk:"Moderate Risk",highRisk:"High Risk",criticalRisk:"Critical Risk",riskLow:"Low",riskModerate:"Moderate",riskHigh:"High",riskCritical:"Critical",driversTitle:"Model Drivers",driversSubtitle:"Factors contributing to the prediction",ichDrivers:"ICH Risk Factors",lvoDrivers:"LVO Risk Factors",criticalAlertTitle:"CRITICAL RISK DETECTED",criticalAlertMessage:"High probability of intracerebral hemorrhage detected. Immediate medical attention required.",helpTitle:"Quick Reference Guide",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 8: Comatose patient - use Coma Module",gcsMod:"GCS 8-12: Moderate impairment",gcsHigh:"GCS 13-15: Mild impairment",fastEdTitle:"FAST-ED Score Components",fastEdFacial:"Facial Palsy: 0-1 points",fastEdArm:"Arm Weakness: 0-2 points",fastEdSpeech:"Speech Changes: 0-2 points",fastEdTime:"Time: Critical factor",fastEdEye:"Eye Deviation: 0-2 points",fastEdDenial:"Denial/Neglect: 0-2 points",criticalValuesTitle:"Critical Values",criticalBp:"Systolic BP > 180: Increased ICH risk",criticalGfap:"GFAP > 500 pg/mL: Significant marker",criticalFastEd:"FAST-ED ≥ 4: Consider LVO",disclaimer:"Clinical Disclaimer",disclaimerText:"This tool is for clinical decision support only. Always use clinical judgment and follow local protocols. Not a replacement for physician assessment.",importantNote:"Important",importantText:"These results are for clinical decision support only. Always use clinical judgment and follow institutional protocols.",inputSummaryTitle:"Input Summary",inputSummarySubtitle:"Values used for this analysis",privacyLink:"Privacy Policy",disclaimerLink:"Medical Disclaimer",versionLink:"Version 2.0.1",privacyPolicy:"Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.",medicalDisclaimer:"Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.",networkError:"Network error - please check your connection and try again",requestTimeout:"Request timeout - please try again",apiError:"Failed to get results",validationError:"Please check your input values",sessionTimeout:"Your session has been idle for 30 minutes. Would you like to continue?",unsavedData:"You have unsaved data. Are you sure you want to leave?",nearestCentersTitle:"Nearest Stroke Centers",useCurrentLocation:"Use Current Location",enterLocationPlaceholder:"Enter city or address...",enterManually:"Enter Location Manually",search:"Search",yourLocation:"Your Location",recommendedCenters:"Recommended Centers",alternativeCenters:"Alternative Centers",noCentersFound:"No stroke centers found in this area",gettingLocation:"Getting your location",searchingLocation:"Searching location",locationError:"Unable to get your location",locationPermissionDenied:"Location access denied. Please allow location access and try again.",locationUnavailable:"Location information is unavailable",locationTimeout:"Location request timed out",geolocationNotSupported:"Geolocation is not supported by this browser",geocodingNotImplemented:"Location search not available. Please use GPS or enter coordinates manually.",tryManualEntry:"Try entering your location manually or use GPS.",distanceNote:"Distances are calculated as straight-line distances. Actual travel times may vary.",travelTimeNote:"Travel times calculated for emergency vehicles with sirens and priority routing.",calculatingTravelTimes:"Calculating travel times",minutes:"min",poweredByOrs:"Travel times powered by OpenRoute Service",comprehensiveCenter:"Comprehensive Stroke Center",primaryCenter:"Primary Stroke Center",telemetryCenter:"Telemedicine Center",thrombectomy:"Thrombectomy",neurosurgery:"Neurosurgery",icu:"Intensive Care",telemedicine:"Telemedicine",stroke_unit:"Stroke Unit",call:"Call",directions:"Directions",emergency:"Emergency",certified:"Certified"},de:{appTitle:"Schlaganfall-Triage-Assistent",emergencyBadge:"Notfall-Tool",helpButton:"Hilfe und Anweisungen",darkModeButton:"Dunklen Modus umschalten",languageToggle:"Sprache",step1:"Erstbeurteilung",step2:"Datenerhebung",step3:"Ergebnisse",comaModuleTitle:"Koma-Modul",limitedDataModuleTitle:"Begrenzte Daten Modul",fullStrokeModuleTitle:"Vollständiges Schlaganfall-Modul",triage1Title:"Patientenbeurteilung",triage1Question:"Ist der Patient komatös?",triage1Help:"Glasgow Coma Scale < 8",triage1Yes:"JA - Komatös",triage1No:"NEIN - Bei Bewusstsein",triage2Title:"Untersuchungsfähigkeit",triage2Question:"Kann der Patient zuverlässig untersucht werden?",triage2Help:"Patient ist nicht aphasisch, verwirrt oder unkooperativ",triage2Yes:"JA - Vollständige Untersuchung möglich",triage2No:"NEIN - Nur begrenzte Untersuchung",ageLabel:"Alter (Jahre)",ageHelp:"Patientenalter in Jahren",systolicLabel:"Systolischer RR (mmHg)",systolicHelp:"Systolischer Blutdruck",diastolicLabel:"Diastolischer RR (mmHg)",diastolicHelp:"Diastolischer Blutdruck",gfapLabel:"GFAP-Wert (pg/mL)",gfapHelp:"GFAP-Biomarker-Wert",fastEdLabel:"FAST-ED-Score",fastEdHelp:"FAST-ED-Bewertungsscore (0-9)",headacheLabel:"Kopfschmerzen",vigilanzLabel:"Bewusstseinstrübung",armPareseLabel:"Armschwäche",beinPareseLabel:"Beinschwäche",eyeDeviationLabel:"Blickdeviation",atrialFibLabel:"Vorhofflimmern",anticoagLabel:"Antikoaguliert (NOAK)",antiplateletsLabel:"Thrombozytenaggregationshemmer",analyzeButton:"Analysieren",analyzing:"Analysiere...",printResults:"Ergebnisse drucken",newAssessment:"Neue Bewertung starten",startOver:"Von vorn beginnen",goBack:"Zurück",goHome:"Zur Startseite",basicInformation:"Grundinformationen",biomarkersScores:"Biomarker & Scores",clinicalSymptoms:"Klinische Symptome",medicalHistory:"Anamnese",ageYearsLabel:"Alter (Jahre)",systolicBpLabel:"Systolischer RR (mmHg)",diastolicBpLabel:"Diastolischer RR (mmHg)",gfapValueLabel:"GFAP-Wert (pg/mL)",fastEdScoreLabel:"FAST-ED-Score",ageYearsHelp:"Patientenalter in Jahren",systolicBpHelp:"Normal: 90-140 mmHg",diastolicBpHelp:"Normal: 60-90 mmHg",gfapTooltip:"Hirnverletzungs-Biomarker",gfapTooltipLong:"Glial Fibrillary Acidic Protein - Hirnverletzungs-Biomarker",gfapRange:"Bereich: {min} - {max} pg/mL",fastEdTooltip:"0-9 Skala für LVO-Screening",analyzeIchRisk:"ICB-Risiko analysieren",analyzeStrokeRisk:"Schlaganfall-Risiko analysieren",criticalPatient:"Kritischer Patient",comaAlert:"Patient ist komatös (GCS < 8). Schnelle Beurteilung erforderlich.",vigilanceReduction:"Vigilanzminderung (Verminderte Wachheit)",armParesis:"Armparese",legParesis:"Beinparese",eyeDeviation:"Blickdeviation",atrialFibrillation:"Vorhofflimmern",onNoacDoac:"NOAK/DOAK-Therapie",onAntiplatelets:"Thrombozytenaggregationshemmer",resultsTitle:"Bewertungsergebnisse",ichProbability:"ICB-Wahrscheinlichkeit",lvoProbability:"LVO-Wahrscheinlichkeit",riskLevel:"Risikostufe",riskLow:"Niedrig",riskModerate:"Mäßig",riskHigh:"Hoch",riskCritical:"Kritisch",driversTitle:"Modelltreiber",driversSubtitle:"Faktoren, die zur Vorhersage beitragen",ichDrivers:"ICB-Risikofaktoren",lvoDrivers:"LVO-Risikofaktoren",criticalAlertTitle:"KRITISCHES RISIKO ERKANNT",criticalAlertMessage:"Hohe Wahrscheinlichkeit einer intrazerebralen Blutung erkannt. Sofortige medizinische Behandlung erforderlich.",helpTitle:"Kurzreferenzleitfaden",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 8: Komatöser Patient - Koma-Modul verwenden",gcsMod:"GCS 8-12: Mäßige Beeinträchtigung",gcsHigh:"GCS 13-15: Leichte Beeinträchtigung",fastEdTitle:"FAST-ED-Score-Komponenten",fastEdFacial:"Faziale Parese: 0-1 Punkte",fastEdArm:"Armschwäche: 0-2 Punkte",fastEdSpeech:"Sprachveränderungen: 0-2 Punkte",fastEdTime:"Zeit: Kritischer Faktor",fastEdEye:"Blickdeviation: 0-2 Punkte",fastEdDenial:"Verneinung/Neglect: 0-2 Punkte",criticalValuesTitle:"Kritische Werte",criticalBp:"Systolischer RR > 180: Erhöhtes ICB-Risiko",criticalGfap:"GFAP > 500 pg/mL: Signifikanter Marker",criticalFastEd:"FAST-ED ≥ 4: LVO in Betracht ziehen",disclaimer:"Klinischer Haftungsausschluss",disclaimerText:"Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle. Kein Ersatz für ärztliche Beurteilung.",importantNote:"Wichtig",importantText:"Diese Ergebnisse dienen nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie institutionelle Protokolle.",inputSummaryTitle:"Eingabezusammenfassung",inputSummarySubtitle:"Für diese Analyse verwendete Werte",privacyLink:"Datenschutzrichtlinie",disclaimerLink:"Medizinischer Haftungsausschluss",versionLink:"Version 2.0.1",privacyPolicy:"Datenschutzrichtlinie: Dieses Tool verarbeitet Daten lokal. Keine Patientendaten werden gespeichert oder übertragen.",medicalDisclaimer:"Medizinischer Haftungsausschluss: Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle.",networkError:"Netzwerkfehler - bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut",requestTimeout:"Anfrage-Timeout - bitte versuchen Sie es erneut",apiError:"Ergebnisse konnten nicht abgerufen werden",validationError:"Bitte überprüfen Sie Ihre Eingabewerte",sessionTimeout:"Ihre Sitzung war 30 Minuten lang inaktiv. Möchten Sie fortfahren?",unsavedData:"Sie haben ungespeicherte Daten. Sind Sie sicher, dass Sie verlassen möchten?",nearestCentersTitle:"Nächstgelegene Schlaganfall-Zentren",useCurrentLocation:"Aktuellen Standort verwenden",enterLocationPlaceholder:"Stadt oder Adresse eingeben...",enterManually:"Standort manuell eingeben",search:"Suchen",yourLocation:"Ihr Standort",recommendedCenters:"Empfohlene Zentren",alternativeCenters:"Alternative Zentren",noCentersFound:"Keine Schlaganfall-Zentren in diesem Bereich gefunden",gettingLocation:"Standort wird ermittelt",searchingLocation:"Standort wird gesucht",locationError:"Standort konnte nicht ermittelt werden",locationPermissionDenied:"Standortzugriff verweigert. Bitte erlauben Sie Standortzugriff und versuchen Sie es erneut.",locationUnavailable:"Standortinformationen sind nicht verfügbar",locationTimeout:"Standortanfrage ist abgelaufen",geolocationNotSupported:"Geolokalisierung wird von diesem Browser nicht unterstützt",geocodingNotImplemented:"Standortsuche nicht verfügbar. Bitte verwenden Sie GPS oder geben Sie Koordinaten manuell ein.",tryManualEntry:"Versuchen Sie, Ihren Standort manuell einzugeben oder GPS zu verwenden.",distanceNote:"Entfernungen werden als Luftlinie berechnet. Tatsächliche Fahrzeiten können variieren.",travelTimeNote:"Fahrzeiten berechnet für Rettungsfahrzeuge mit Sondersignalen und Vorfahrtsberechtigung.",calculatingTravelTimes:"Fahrzeiten werden berechnet",minutes:"Min",poweredByOrs:"Fahrzeiten bereitgestellt von OpenRoute Service",comprehensiveCenter:"Überregionales Schlaganfall-Zentrum",primaryCenter:"Regionales Schlaganfall-Zentrum",telemetryCenter:"Telemedizin-Zentrum",thrombectomy:"Thrombektomie",neurosurgery:"Neurochirurgie",icu:"Intensivstation",telemedicine:"Telemedizin",stroke_unit:"Stroke Unit",call:"Anrufen",directions:"Wegbeschreibung",emergency:"Notfall",certified:"Zertifiziert"}};class q{constructor(){this.supportedLanguages=["en","de"],this.currentLanguage=this.detectLanguage()}detectLanguage(){const t=localStorage.getItem("language");return t&&this.supportedLanguages.includes(t)?t:(navigator.language||navigator.userLanguage).substring(0,2).toLowerCase()==="de"?"de":"en"}getCurrentLanguage(){return this.currentLanguage}setLanguage(t){return this.supportedLanguages.includes(t)?(this.currentLanguage=t,localStorage.setItem("language",t),window.dispatchEvent(new CustomEvent("languageChanged",{detail:{language:t}})),!0):!1}getSupportedLanguages(){return[...this.supportedLanguages]}t(t){return(H[this.currentLanguage]||H.en)[t]||t}toggleLanguage(){const t=this.currentLanguage==="en"?"de":"en";return this.setLanguage(t)}getLanguageDisplayName(t=null){const e=t||this.currentLanguage;return{en:"English",de:"Deutsch"}[e]||e}formatDateTime(t){const e=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(e,{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(t)}formatTime(t){const e=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(e,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(t)}}const $=new q,o=i=>$.t(i);function R(){return`
    <div class="container">
      ${y(1)}
      <h2>${o("triage1Title")}</h2>
      <div class="triage-question">
        ${o("triage1Question")}
        <small>${o("triage1Help")}</small>
      </div>
      <div class="triage-buttons">
        <button class="yes-btn" data-action="triage1" data-value="true">${o("triage1Yes")}</button>
        <button class="no-btn" data-action="triage1" data-value="false">${o("triage1No")}</button>
      </div>
    </div>
  `}function j(){return`
    <div class="container">
      ${y(1)}
      <h2>${o("triage2Title")}</h2>
      <div class="triage-question">
        ${o("triage2Question")}
        <small>${o("triage2Help")}</small>
      </div>
      <div class="triage-buttons">
        <button class="yes-btn" data-action="triage2" data-value="true">${o("triage2Yes")}</button>
        <button class="no-btn" data-action="triage2" data-value="false">${o("triage2No")}</button>
      </div>
    </div>
  `}const v={COMA_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_coma_ich",LDM_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_limited_data_ich",FULL_STROKE:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_full_stroke"},D={ich:{high:60,critical:80},lvo:{high:50,critical:70}},h={min:29,max:10001},C={autoSaveInterval:3e4,sessionTimeout:30*60*1e3,requestTimeout:1e4},W={age_years:{required:!0,min:0,max:120},systolic_bp:{required:!0,min:60,max:300},diastolic_bp:{required:!0,min:30,max:200},gfap_value:{required:!0,min:h.min,max:h.max},fast_ed_score:{required:!0,min:0,max:9}};function Y(){return`
    <div class="container">
      ${y(2)}
      <h2>${o("comaModuleTitle")||"Coma Module"}</h2>
      <div class="critical-alert">
        <h4><span class="alert-icon">🚨</span> ${o("criticalPatient")}</h4>
        <p>${o("comaAlert")}</p>
      </div>
      <form data-module="coma">
        <div class="input-grid">
          <div class="input-group">
            <label for="gfap_value">
              ${o("gfapValueLabel")}
              <span class="tooltip">ℹ️
                <span class="tooltiptext">${o("gfapTooltipLong")}</span>
              </span>
            </label>
            <input type="number" id="gfap_value" name="gfap_value" min="${h.min}" max="${h.max}" step="0.1" required aria-describedby="gfap-help">
            <div id="gfap-help" class="input-help">
              ${o("gfapRange").replace("{min}",h.min).replace("{max}",h.max)}
            </div>
          </div>
        </div>
        <button type="submit" class="primary">${o("analyzeIchRisk")}</button>
        <button type="button" class="secondary" data-action="reset">${o("startOver")}</button>
      </form>
    </div>
  `}function Z(){return`
    <div class="container">
      ${y(2)}
      <h2>${o("limitedDataModuleTitle")||"Limited Data Module"}</h2>
      <form data-module="limited">
        <div class="input-grid">
          <div class="input-group">
            <label for="age_years">${o("ageYearsLabel")}</label>
            <input type="number" name="age_years" id="age_years" min="0" max="120" required aria-describedby="age-help">
            <div id="age-help" class="input-help">${o("ageYearsHelp")}</div>
          </div>
          <div class="input-group">
            <label for="systolic_bp">${o("systolicBpLabel")}</label>
            <input type="number" name="systolic_bp" id="systolic_bp" min="60" max="300" required aria-describedby="sbp-help">
            <div id="sbp-help" class="input-help">${o("systolicBpHelp")}</div>
          </div>
          <div class="input-group">
            <label for="diastolic_bp">${o("diastolicBpLabel")}</label>
            <input type="number" name="diastolic_bp" id="diastolic_bp" min="30" max="200" required aria-describedby="dbp-help">
            <div id="dbp-help" class="input-help">${o("diastolicBpHelp")}</div>
          </div>
          <div class="input-group">
            <label for="gfap_value">
              ${o("gfapValueLabel")}
              <span class="tooltip">ℹ️
                <span class="tooltiptext">${o("gfapTooltipLong")}</span>
              </span>
            </label>
            <input type="number" name="gfap_value" id="gfap_value" min="${h.min}" max="${h.max}" step="0.1" required>
          </div>
        </div>
        <div class="checkbox-group">
          <label class="checkbox-wrapper">
            <input type="checkbox" name="vigilanzminderung" id="vigilanzminderung">
            <span class="checkbox-label">${o("vigilanceReduction")}</span>
          </label>
        </div>
        <button type="submit" class="primary">${o("analyzeIchRisk")}</button>
        <button type="button" class="secondary" data-action="reset">${o("startOver")}</button>
      </form>
    </div>
  `}function J(){return`
    <div class="container">
      ${y(2)}
      <h2>${o("fullStrokeModuleTitle")||"Full Stroke Module"}</h2>
      <form data-module="full">
        <h3>${o("basicInformation")}</h3>
        <div class="input-grid">
          <div class="input-group">
            <label for="age_years">${o("ageYearsLabel")}</label>
            <input type="number" name="age_years" id="age_years" min="0" max="120" required>
          </div>
          <div class="input-group">
            <label for="systolic_bp">${o("systolicBpLabel")}</label>
            <input type="number" name="systolic_bp" id="systolic_bp" min="60" max="300" required>
          </div>
          <div class="input-group">
            <label for="diastolic_bp">${o("diastolicBpLabel")}</label>
            <input type="number" name="diastolic_bp" id="diastolic_bp" min="30" max="200" required>
          </div>
        </div>

        <h3>${o("biomarkersScores")}</h3>
        <div class="input-grid">
          <div class="input-group">
            <label for="gfap_value">
              ${o("gfapValueLabel")}
              <span class="tooltip">ℹ️
                <span class="tooltiptext">${o("gfapTooltip")}</span>
              </span>
            </label>
            <input type="number" name="gfap_value" id="gfap_value" min="${h.min}" max="${h.max}" step="0.1" required>
          </div>
          <div class="input-group">
            <label for="fast_ed_score">
              ${o("fastEdScoreLabel")}
              <span class="tooltip">ℹ️
                <span class="tooltiptext">${o("fastEdTooltip")}</span>
              </span>
            </label>
            <input type="number" name="fast_ed_score" id="fast_ed_score" min="0" max="9" required>
          </div>
        </div>

        <h3>${o("clinicalSymptoms")}</h3>
        <div class="input-grid">
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="headache" id="headache">
              <span class="checkbox-label">${o("headacheLabel")}</span>
            </label>
            <label class="checkbox-wrapper">
              <input type="checkbox" name="vigilanzminderung" id="vigilanzminderung">
              <span class="checkbox-label">${o("vigilanzLabel")}</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="armparese" id="armparese">
              <span class="checkbox-label">${o("armParesis")}</span>
            </label>
            <label class="checkbox-wrapper">
              <input type="checkbox" name="beinparese" id="beinparese">
              <span class="checkbox-label">${o("legParesis")}</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="eye_deviation" id="eye_deviation">
              <span class="checkbox-label">${o("eyeDeviation")}</span>
            </label>
          </div>
        </div>

        <h3>${o("medicalHistory")}</h3>
        <div class="input-grid">
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="atrial_fibrillation" id="atrial_fibrillation">
              <span class="checkbox-label">${o("atrialFibrillation")}</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="anticoagulated_noak" id="anticoagulated_noak">
              <span class="checkbox-label">${o("onNoacDoac")}</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="antiplatelets" id="antiplatelets">
              <span class="checkbox-label">${o("onAntiplatelets")}</span>
            </label>
          </div>
        </div>

        <button type="submit" class="primary">${o("analyzeStrokeRisk")}</button>
        <button type="button" class="secondary" data-action="reset">${o("startOver")}</button>
      </form>
    </div>
  `}function Q(){return`
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
  `}function X(i){return!i||typeof i!="object"?{kind:"unavailable",units:null,positive:[],negative:[],meta:{}}:i.kind?i:i.shap_values||i.kind&&i.kind==="shap_values"?ee(i):i.logistic_contributions||i.kind&&i.kind==="logistic_contributions"?te(i):ae(i)?ie(i):{kind:"unavailable",units:null,positive:[],negative:[],meta:{}}}function ee(i){const t=i.shap_values||i,e=[];Array.isArray(t)?t.forEach((n,l)=>{typeof n=="object"&&n.feature&&n.value!==void 0?e.push({label:n.feature,weight:n.value}):typeof n=="number"&&e.push({label:`Feature ${l}`,weight:n})}):typeof t=="object"&&Object.entries(t).forEach(([n,l])=>{typeof l=="number"&&e.push({label:n,weight:l})}),e.sort((n,l)=>Math.abs(l.weight)-Math.abs(n.weight));const a=e.filter(n=>n.weight>0),r=e.filter(n=>n.weight<0),s={};return i.base_value!==void 0&&(s.base_value=i.base_value),i.contrib_sum!==void 0&&(s.contrib_sum=i.contrib_sum),i.logit_total!==void 0&&(s.logit_total=i.logit_total),{kind:"shap_values",units:"logit",positive:a,negative:r,meta:s}}function te(i){const t=i.logistic_contributions||i,e=[];typeof t=="object"&&Object.entries(t).forEach(([n,l])=>{typeof l=="number"&&!["intercept","contrib_sum","logit_total"].includes(n)&&e.push({label:n,weight:l})}),e.sort((n,l)=>Math.abs(l.weight)-Math.abs(n.weight));const a=e.filter(n=>n.weight>0),r=e.filter(n=>n.weight<0),s={};return t.intercept!==void 0&&(s.base_value=t.intercept),t.contrib_sum!==void 0&&(s.contrib_sum=t.contrib_sum),t.logit_total!==void 0&&(s.logit_total=t.logit_total),i.contrib_sum!==void 0&&(s.contrib_sum=i.contrib_sum),{kind:"logistic_contributions",units:"logit",positive:a,negative:r,meta:s}}function ie(i){const t=[];Object.entries(i).forEach(([r,s])=>{typeof s=="number"&&t.push({label:r,weight:s})}),t.sort((r,s)=>Math.abs(s.weight)-Math.abs(r.weight));const e=t.filter(r=>r.weight>0),a=t.filter(r=>r.weight<0);return{kind:"raw_weights",units:null,positive:e,negative:a,meta:{}}}function ae(i){return Object.values(i).every(t=>typeof t=="number")}function ne(i,t){if(!(i!=null&&i.drivers)&&!(t!=null&&t.drivers))return"";let e=`
    <div class="drivers-section">
      <h3>Prediction Drivers</h3>
      <div class="drivers-grid">
  `;return i!=null&&i.drivers&&(e+=F(i.drivers,"ICH","ich")),t!=null&&t.drivers&&!t.notPossible&&(e+=F(t.drivers,"LVO","lvo")),e+=`
      </div>
    </div>
  `,e}function F(i,t,e){if(!i||Object.keys(i).length===0)return`
      <div class="drivers-panel">
        <h4>
          <span class="driver-icon ${e}">${e==="ich"?"I":"L"}</span>
          ${t} Risk Factors
        </h4>
        <p style="color: var(--text-secondary); font-style: italic;">
          Driver information not available from this prediction model.
        </p>
      </div>
    `;const a=X(i);if(a.kind==="unavailable")return`
      <div class="drivers-panel">
        <h4>
          <span class="driver-icon ${e}">${e==="ich"?"I":"L"}</span>
          ${t} Risk Factors
        </h4>
        <p style="color: var(--text-secondary); font-style: italic;">
          Driver analysis not available for this prediction.
        </p>
      </div>
    `;let r=`
    <div class="drivers-panel">
      <h4>
        <span class="driver-icon ${e}">${e==="ich"?"I":"L"}</span>
        ${t} Risk Factors
      </h4>
  `;return a.positive.length>0&&a.positive.forEach(s=>{const n=Math.abs(s.weight*100),l=Math.min(n*2,100);r+=`
        <div class="driver-item">
          <span class="driver-label">${s.label}</span>
          <div class="driver-bar-container">
            <div class="driver-bar positive" style="width: ${l}%">
              <span class="driver-value">+${n.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      `}),a.negative.length>0&&a.negative.forEach(s=>{const n=Math.abs(s.weight*100),l=Math.min(n*2,100);r+=`
        <div class="driver-item">
          <span class="driver-label">${s.label}</span>
          <div class="driver-bar-container">
            <div class="driver-bar negative" style="width: ${l}%">
              <span class="driver-value">-${n.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      `}),a.meta&&Object.keys(a.meta).length>0&&(r+=`
      <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid var(--border-color);">
        <small style="color: var(--text-secondary);">
    `,a.meta.base_value!==void 0&&(r+=`Base value: ${a.meta.base_value.toFixed(2)} `),a.meta.contrib_sum!==void 0&&(r+=`Contrib sum: ${a.meta.contrib_sum.toFixed(2)} `),a.meta.logit_total!==void 0&&(r+=`Logit total: ${a.meta.logit_total.toFixed(2)}`),r+=`
        </small>
      </div>
    `),r+="</div>",r}const O=[{id:"uniklinik-freiburg",name:"Universitätsklinikum Freiburg",type:"comprehensive",address:"Hugstetter Str. 55, 79106 Freiburg im Breisgau",coordinates:{lat:48.0025,lng:7.8347},phone:"+49 761 270-0",emergency:"+49 761 270-34010",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"uniklinik-heidelberg",name:"Universitätsklinikum Heidelberg",type:"comprehensive",address:"Im Neuenheimer Feld 400, 69120 Heidelberg",coordinates:{lat:49.4178,lng:8.6706},phone:"+49 6221 56-0",emergency:"+49 6221 56-36643",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"uniklinik-tuebingen",name:"Universitätsklinikum Tübingen",type:"comprehensive",address:"Geissweg 3, 72076 Tübingen",coordinates:{lat:48.5378,lng:9.0538},phone:"+49 7071 29-0",emergency:"+49 7071 29-82211",services:["thrombectory","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"uniklinik-ulm",name:"Universitätsklinikum Ulm",type:"comprehensive",address:"Albert-Einstein-Allee 23, 89081 Ulm",coordinates:{lat:48.4196,lng:9.9592},phone:"+49 731 500-0",emergency:"+49 731 500-63001",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"klinikum-stuttgart",name:"Klinikum Stuttgart - Katharinenhospital",type:"comprehensive",address:"Kriegsbergstraße 60, 70174 Stuttgart",coordinates:{lat:48.7784,lng:9.1682},phone:"+49 711 278-0",emergency:"+49 711 278-32001",services:["thrombectomy","neurosurgery","icu"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"robert-bosch-stuttgart",name:"Robert-Bosch-Krankenhaus Stuttgart",type:"primary",address:"Auerbachstraße 110, 70376 Stuttgart",coordinates:{lat:48.7447,lng:9.2294},phone:"+49 711 8101-0",emergency:"+49 711 8101-3456",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"diakonie-stuttgart",name:"Diakonie-Klinikum Stuttgart",type:"primary",address:"Rosenbergstraße 38, 70176 Stuttgart",coordinates:{lat:48.7861,lng:9.1736},phone:"+49 711 991-0",emergency:"+49 711 991-2201",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"rkh-ludwigsburg",name:"RKH Klinikum Ludwigsburg",type:"primary",address:"Posilipostraße 4, 71640 Ludwigsburg",coordinates:{lat:48.8901,lng:9.1953},phone:"+49 7141 99-0",emergency:"+49 7141 99-67201",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-karlsruhe",name:"Städtisches Klinikum Karlsruhe",type:"comprehensive",address:"Moltkestraße 90, 76133 Karlsruhe",coordinates:{lat:49.0047,lng:8.3858},phone:"+49 721 974-0",emergency:"+49 721 974-2301",services:["thrombectomy","neurosurgery","icu"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"vincentius-karlsruhe",name:"ViDia Kliniken Karlsruhe - St. Vincentius",type:"primary",address:"Südendstraße 32, 76135 Karlsruhe",coordinates:{lat:48.9903,lng:8.3711},phone:"+49 721 8108-0",emergency:"+49 721 8108-9201",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-mannheim",name:"Universitätsmedizin Mannheim",type:"comprehensive",address:"Theodor-Kutzer-Ufer 1-3, 68167 Mannheim",coordinates:{lat:49.4828,lng:8.4664},phone:"+49 621 383-0",emergency:"+49 621 383-2251",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"theresienkrankenhaus-mannheim",name:"Theresienkrankenhaus Mannheim",type:"primary",address:"Bassermannstraße 1, 68165 Mannheim",coordinates:{lat:49.4904,lng:8.4594},phone:"+49 621 424-0",emergency:"+49 621 424-2101",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-pforzheim",name:"Helios Klinikum Pforzheim",type:"primary",address:"Kanzlerstraße 2-6, 75175 Pforzheim",coordinates:{lat:48.8833,lng:8.6936},phone:"+49 7231 969-0",emergency:"+49 7231 969-2301",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"zollernalb-klinikum",name:"Zollernalb Klinikum Albstadt",type:"primary",address:"Zollernring 10-14, 72488 Sigmaringen",coordinates:{lat:48.0878,lng:9.2233},phone:"+49 7571 100-0",emergency:"+49 7571 100-1501",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-konstanz",name:"Gesundheitsverbund Landkreis Konstanz",type:"primary",address:"Mainaustraße 14, 78464 Konstanz",coordinates:{lat:47.6779,lng:9.1732},phone:"+49 7531 801-0",emergency:"+49 7531 801-2301",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-friedrichshafen",name:"Klinikum Friedrichshafen",type:"primary",address:"Röntgenstraße 2, 88048 Friedrichshafen",coordinates:{lat:47.6587,lng:9.4685},phone:"+49 7541 96-0",emergency:"+49 7541 96-2401",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"oberschwabenklinik-ravensburg",name:"Oberschwabenklinik Ravensburg",type:"primary",address:"Elisabethenstraße 17, 88212 Ravensburg",coordinates:{lat:47.7815,lng:9.6078},phone:"+49 751 87-0",emergency:"+49 751 87-2201",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"alb-donau-klinikum",name:"Alb Donau Klinikum Ehingen",type:"primary",address:"Schwörhausgasse 7, 89584 Ehingen",coordinates:{lat:48.2833,lng:9.7262},phone:"+49 7391 789-0",emergency:"+49 7391 789-1801",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"ortenau-klinikum-offenburg",name:"Ortenau Klinikum Offenburg",type:"primary",address:"Ebertplatz 12, 77654 Offenburg",coordinates:{lat:48.4706,lng:7.9444},phone:"+49 781 472-0",emergency:"+49 781 472-2001",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-baden-baden",name:"Klinikum Mittelbaden Baden-Baden",type:"primary",address:"Balger Str. 50, 76532 Baden-Baden",coordinates:{lat:48.7606,lng:8.2275},phone:"+49 7221 91-0",emergency:"+49 7221 91-1701",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"}];function w(i,t,e,a){const s=L(e-i),n=L(a-t),l=Math.sin(s/2)*Math.sin(s/2)+Math.cos(L(i))*Math.cos(L(e))*Math.sin(n/2)*Math.sin(n/2);return 6371*(2*Math.atan2(Math.sqrt(l),Math.sqrt(1-l)))}function L(i){return i*(Math.PI/180)}async function G(i,t,e,a,r="driving-car"){try{const s=`https://api.openrouteservice.org/v2/directions/${r}`,l=await fetch(s,{method:"POST",headers:{Accept:"application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",Authorization:"5b3ce3597851110001cf624868c4c27b63ae476c9c26c8bffbc35688","Content-Type":"application/json; charset=utf-8"},body:JSON.stringify({coordinates:[[t,i],[a,e]],radiuses:[1e3,1e3],format:"json"})});if(!l.ok)throw new Error(`Routing API error: ${l.status}`);const m=await l.json();if(m.routes&&m.routes.length>0){const u=m.routes[0];return{duration:Math.round(u.summary.duration/60),distance:Math.round(u.summary.distance/1e3),source:"routing"}}else throw new Error("No route found")}catch(s){console.warn("Travel time calculation failed, using distance estimate:",s);const n=w(i,t,e,a);return{duration:Math.round(n/.8),distance:Math.round(n),source:"estimated"}}}async function re(i,t,e,a){try{const r=await G(i,t,e,a,"driving-car");return{duration:Math.round(r.duration*.75),distance:r.distance,source:r.source==="routing"?"emergency-routing":"emergency-estimated"}}catch{const s=w(i,t,e,a);return{duration:Math.round(s/1.2),distance:Math.round(s),source:"emergency-estimated"}}}async function se(i,t,e=5,a=120,r=!0){return console.log("Calculating travel times to stroke centers..."),(await Promise.all(O.map(async n=>{try{const l=r?await re(i,t,n.coordinates.lat,n.coordinates.lng):await G(i,t,n.coordinates.lat,n.coordinates.lng);return{...n,travelTime:l.duration,distance:l.distance,travelSource:l.source}}catch(l){console.warn(`Failed to calculate travel time to ${n.name}:`,l);const m=w(i,t,n.coordinates.lat,n.coordinates.lng);return{...n,travelTime:Math.round(m/.8),distance:Math.round(m),travelSource:"fallback"}}}))).filter(n=>n.travelTime<=a).sort((n,l)=>n.travelTime-l.travelTime).slice(0,e)}function oe(i,t,e=5,a=100){return O.map(s=>({...s,distance:w(i,t,s.coordinates.lat,s.coordinates.lng)})).filter(s=>s.distance<=a).sort((s,n)=>s.distance-n.distance).slice(0,e)}async function le(i,t,e="stroke"){const a=await se(i,t,10,120,!0);if(e==="lvo"||e==="thrombectomy"){const r=a.filter(n=>n.type==="comprehensive"&&n.services.includes("thrombectomy")&&n.travelTime<=60),s=a.filter(n=>n.type==="primary");return{recommended:r.slice(0,3),alternative:s.slice(0,2)}}if(e==="ich"){const r=a.filter(s=>s.services.includes("neurosurgery")&&s.travelTime<=45);return{recommended:r.slice(0,3),alternative:a.filter(s=>!r.includes(s)).slice(0,2)}}return{recommended:a.slice(0,5),alternative:[]}}function ce(i,t,e="stroke"){const a=oe(i,t,10);if(e==="lvo"||e==="thrombectomy"){const r=a.filter(n=>n.type==="comprehensive"&&n.services.includes("thrombectomy")),s=a.filter(n=>n.type==="primary");return{recommended:r.slice(0,3),alternative:s.slice(0,2)}}return{recommended:a.slice(0,5),alternative:[]}}function de(i){return`
    <div class="stroke-center-section">
      <h3>🏥 ${o("nearestCentersTitle")}</h3>
      <div id="locationContainer">
        <div class="location-controls">
          <button type="button" id="useGpsButton" class="secondary">
            📍 ${o("useCurrentLocation")}
          </button>
          <div class="location-manual" style="display: none;">
            <input type="text" id="locationInput" placeholder="${o("enterLocationPlaceholder")}" />
            <button type="button" id="searchLocationButton" class="secondary">${o("search")}</button>
          </div>
          <button type="button" id="manualLocationButton" class="secondary">
            ✏️ ${o("enterManually")}
          </button>
        </div>
        <div id="strokeCenterResults" class="stroke-center-results"></div>
      </div>
    </div>
  `}function ue(i){const t=document.getElementById("useGpsButton"),e=document.getElementById("manualLocationButton"),a=document.querySelector(".location-manual"),r=document.getElementById("locationInput"),s=document.getElementById("searchLocationButton"),n=document.getElementById("strokeCenterResults");t&&t.addEventListener("click",()=>{me(i,n)}),e&&e.addEventListener("click",()=>{a.style.display=a.style.display==="none"?"block":"none"}),s&&s.addEventListener("click",()=>{const l=r.value.trim();l&&N(l,i,n)}),r&&r.addEventListener("keypress",l=>{if(l.key==="Enter"){const m=r.value.trim();m&&N(m,i,n)}})}function me(i,t){if(!navigator.geolocation){A(o("geolocationNotSupported"),t);return}t.innerHTML=`<div class="loading">${o("gettingLocation")}...</div>`,navigator.geolocation.getCurrentPosition(e=>{const{latitude:a,longitude:r}=e.coords;ge(a,r,i,t)},e=>{let a=o("locationError");switch(e.code){case e.PERMISSION_DENIED:a=o("locationPermissionDenied");break;case e.POSITION_UNAVAILABLE:a=o("locationUnavailable");break;case e.TIMEOUT:a=o("locationTimeout");break}A(a,t)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:3e5})}async function N(i,t,e){e.innerHTML=`<div class="loading">${o("searchingLocation")}...</div>`,A(o("geocodingNotImplemented"),e)}async function ge(i,t,e,a){const r=pe(e);a.innerHTML=`
    <div class="location-info">
      <p><strong>${o("yourLocation")}:</strong> ${i.toFixed(4)}, ${t.toFixed(4)}</p>
    </div>
    <div class="loading">${o("calculatingTravelTimes")}...</div>
  `;try{const s=await le(i,t,r),n=`
      <div class="location-info">
        <p><strong>${o("yourLocation")}:</strong> ${i.toFixed(4)}, ${t.toFixed(4)}</p>
      </div>
      
      <div class="recommended-centers">
        <h4>${o("recommendedCenters")}</h4>
        ${T(s.recommended,!0)}
      </div>
      
      ${s.alternative.length>0?`
        <div class="alternative-centers">
          <h4>${o("alternativeCenters")}</h4>
          ${T(s.alternative,!1)}
        </div>
      `:""}
      
      <div class="travel-time-note">
        <small>${o("travelTimeNote")}</small>
        <br><small class="powered-by">${o("poweredByOrs")}</small>
      </div>
    `;a.innerHTML=n}catch(s){console.warn("Travel time calculation failed, falling back to distance:",s);const n=ce(i,t,r),l=`
      <div class="location-info">
        <p><strong>${o("yourLocation")}:</strong> ${i.toFixed(4)}, ${t.toFixed(4)}</p>
      </div>
      
      <div class="recommended-centers">
        <h4>${o("recommendedCenters")}</h4>
        ${T(n.recommended,!0)}
      </div>
      
      ${n.alternative.length>0?`
        <div class="alternative-centers">
          <h4>${o("alternativeCenters")}</h4>
          ${T(n.alternative,!1)}
        </div>
      `:""}
      
      <div class="distance-note">
        <small>${o("distanceNote")}</small>
      </div>
    `;a.innerHTML=l}}function T(i,t=!1){return!i||i.length===0?`<p>${o("noCentersFound")}</p>`:i.map(e=>`
    <div class="stroke-center-card ${t?"recommended":"alternative"}">
      <div class="center-header">
        <h5>${e.name}</h5>
        <span class="center-type ${e.type}">${o(e.type+"Center")}</span>
        ${e.travelTime?`
          <span class="travel-time">
            <span class="time">${e.travelTime} ${o("minutes")}</span>
            <span class="distance">(${e.distance} km)</span>
          </span>
        `:`
          <span class="distance">${e.distance.toFixed(1)} km</span>
        `}
      </div>
      
      <div class="center-details">
        <p class="address">📍 ${e.address}</p>
        <p class="phone">📞 ${o("emergency")}: ${e.emergency}</p>
        
        <div class="services">
          ${e.services.map(a=>`
            <span class="service-badge">${o(a)}</span>
          `).join("")}
        </div>
        
        ${e.certified?`
          <div class="certification">
            ✅ ${o("certified")}: ${e.certification}
          </div>
        `:""}
      </div>
      
      <div class="center-actions">
        <button class="call-button" onclick="window.open('tel:${e.emergency}')">
          📞 ${o("call")}
        </button>
        <button class="directions-button" onclick="window.open('https://maps.google.com/maps?daddr=${e.coordinates.lat},${e.coordinates.lng}', '_blank')">
          🧭 ${o("directions")}
        </button>
      </div>
    </div>
  `).join("")}function pe(i){return i?i.lvo&&i.lvo.probability>.5?"lvo":i.ich&&i.ich.probability>.6?"ich":"stroke":"stroke"}function A(i,t){t.innerHTML=`
    <div class="location-error">
      <p>⚠️ ${i}</p>
      <p><small>${o("tryManualEntry")}</small></p>
    </div>
  `}function z(i,t){const e=Number(i),a=D[t];return e>=a.critical?"🔴 CRITICAL RISK":e>=a.high?"🟠 HIGH RISK":e>=30?"🟡 MODERATE RISK":"🟢 LOW RISK"}function he(){const t=g.getState().formData;if(!t||Object.keys(t).length===0)return"";let e="";return Object.entries(t).forEach(([a,r])=>{if(r&&Object.keys(r).length>0){const s=o(`${a}ModuleTitle`)||a.charAt(0).toUpperCase()+a.slice(1);let n="";Object.entries(r).forEach(([l,m])=>{if(m===""||m===null||m===void 0)return;let u=l;o(`${l}Label`)?u=o(`${l}Label`):u=l.replace(/_/g," ").replace(/\b\w/g,p=>p.toUpperCase());let c=m;typeof m=="boolean"&&(c=m?"✓":"✗"),n+=`
          <div class="summary-item">
            <span class="summary-label">${u}:</span>
            <span class="summary-value">${c}</span>
          </div>
        `}),n&&(e+=`
          <div class="summary-module">
            <h4>${s}</h4>
            <div class="summary-items">
              ${n}
            </div>
          </div>
        `)}}),e?`
    <div class="input-summary">
      <h3>📋 ${o("inputSummaryTitle")}</h3>
      <p class="summary-subtitle">${o("inputSummarySubtitle")}</p>
      <div class="summary-content">
        ${e}
      </div>
    </div>
  `:""}function be(i,t){const{ich:e,lvo:a}=i;let r="",s="";if(e){const c=Math.round((e.probability||0)*100);r=`
      <div class="result-card ${c>D.ich.critical?"critical":"ich"}">
        <h3> 🧠 ${o("ichProbability")} <small>(${e.module} Module)</small> </h3>
        <div class="probability-display">${c}%</div>
        <div class="probability-meter">
          <div class="probability-fill" style="width: ${c}%"></div>
          <div class="probability-marker" style="left: ${c}%">${c}%</div>
        </div>
        <p><strong>${o("riskLevel")}:</strong> ${z(c,"ich")}</p>
      </div>
    `}if(a)if(a.notPossible)s=`
        <div class="result-card info">
          <h3>🔍 ${o("lvoProbability")}</h3>
          <p>LVO assessment not possible with limited data.</p>
          <p>A full neurological examination is required for LVO screening.</p>
        </div>
      `;else{const c=Math.round((a.probability||0)*100);s=`
        <div class="result-card ${c>D.lvo.critical?"critical":"lvo"}">
          <h3> 🩸 ${o("lvoProbability")} <small>(${a.module} Module)</small> </h3>
          <div class="probability-display">${c}%</div>
          <div class="probability-meter">
            <div class="probability-fill" style="width: ${c}%"></div>
            <div class="probability-marker" style="left: ${c}%">${c}%</div>
          </div>
          <p><strong>${o("riskLevel")}:</strong> ${z(c,"lvo")}</p>
        </div>
      `}const n=e&&e.probability>.6?Q():"",l=ne(e,a),m=de(),u=he();return`
    <div class="container">
      ${y(3)}
      <h2>${o("resultsTitle")}</h2>
      ${n}
      <div style="display: flex; flex-direction: column; gap: 20px;">
        ${r}
        ${s}
      </div>
      ${u}
      ${l}
      ${m}
      <div class="results-actions">
        <div class="primary-actions">
          <button type="button" class="primary" id="printResults"> 📄 ${o("printResults")} </button>
          <button type="button" class="secondary" data-action="reset"> ${o("newAssessment")} </button>
        </div>
        <div class="navigation-actions">
          <button type="button" class="tertiary" data-action="goBack"> ← ${o("goBack")} </button>
          <button type="button" class="tertiary" data-action="goHome"> 🏠 ${o("goHome")} </button>
        </div>
      </div>
      <div class="disclaimer">
        <strong>⚠️ ${o("importantNote")}:</strong> ${o("importantText")} Results generated at ${new Date().toLocaleTimeString()}.
      </div>
    </div>
  `}function fe(i,t,e){const a=[];return e.required&&!t&&t!==0&&a.push("This field is required"),e.min!==void 0&&t!==""&&!isNaN(t)&&parseFloat(t)<e.min&&a.push(`Value must be at least ${e.min}`),e.max!==void 0&&t!==""&&!isNaN(t)&&parseFloat(t)>e.max&&a.push(`Value must be at most ${e.max}`),e.pattern&&!e.pattern.test(t)&&a.push("Invalid format"),a}function ve(i){let t=!0;const e={};return Object.entries(W).forEach(([a,r])=>{const s=i.elements[a];if(s){const n=fe(a,s.value,r);n.length>0&&(e[a]=n,t=!1)}}),{isValid:t,validationErrors:e}}function ye(i,t){Object.entries(t).forEach(([e,a])=>{const r=i.querySelector(`[name="${e}"]`);if(r){const s=r.closest(".input-group");if(s){s.classList.add("error"),s.querySelectorAll(".error-message").forEach(l=>l.remove());const n=document.createElement("div");n.className="error-message",n.innerHTML=`<span class="error-icon">⚠️</span> ${a[0]}`,s.appendChild(n)}}})}function ke(i){i.querySelectorAll(".input-group.error").forEach(t=>{t.classList.remove("error"),t.querySelectorAll(".error-message").forEach(e=>e.remove())})}class b extends Error{constructor(t,e,a){super(t),this.name="APIError",this.status=e,this.url=a}}function _(i){const t={...i};return Object.keys(t).forEach(e=>{const a=t[e];(typeof a=="boolean"||a==="on"||a==="true"||a==="false")&&(t[e]=a===!0||a==="on"||a==="true"?1:0)}),t}function f(i,t=0){const e=parseFloat(i);return isNaN(e)?t:e}async function I(i,t){const e=new AbortController,a=setTimeout(()=>e.abort(),C.requestTimeout);try{const r=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(t),signal:e.signal,mode:"cors"});if(clearTimeout(a),!r.ok){let n=`HTTP ${r.status}`;try{const l=await r.json();n=l.error||l.message||n}catch{n=`${n}: ${r.statusText}`}throw new b(n,r.status,i)}return await r.json()}catch(r){throw clearTimeout(a),r.name==="AbortError"?new b("Request timeout - please try again",408,i):r instanceof b?r:new b("Network error - please check your connection and try again",0,i)}}async function Se(i){const t=_(i);console.log("Coma ICH API Payload:",t);try{const e=await I(v.COMA_ICH,t);return console.log("Coma ICH API Response:",e),{probability:f(e.probability||e.ich_probability,0),drivers:e.drivers||null,confidence:f(e.confidence,.75),module:"Coma"}}catch(e){throw console.error("Coma ICH prediction failed:",e),new b(`Failed to get ICH prediction: ${e.message}`,e.status,v.COMA_ICH)}}async function Le(i){const t={age_years:i.age_years,systolic_bp:i.systolic_bp,diastolic_bp:i.diastolic_bp,gfap_value:i.gfap_value,vigilanzminderung:i.vigilanzminderung||0},e=_(t);console.log("Limited Data ICH API Payload:",e);try{const a=await I(v.LDM_ICH,e);return console.log("Limited Data ICH API Response:",a),{probability:f(a.probability||a.ich_probability,0),drivers:a.drivers||null,confidence:f(a.confidence,.65),module:"Limited Data"}}catch(a){throw console.error("Limited Data ICH prediction failed:",a),new b(`Failed to get ICH prediction: ${a.message}`,a.status,v.LDM_ICH)}}async function Te(i){var a,r,s,n,l,m,u,c,p,k,P,x;const t={age_years:i.age_years,systolic_bp:i.systolic_bp,diastolic_bp:i.diastolic_bp,gfap_value:i.gfap_value,fast_ed_score:i.fast_ed_score,headache:i.headache||0,vigilanzminderung:i.vigilanzminderung||0,armparese:i.armparese||0,beinparese:i.beinparese||0,eye_deviation:i.eye_deviation||0,atrial_fibrillation:i.atrial_fibrillation||0,anticoagulated_noak:i.anticoagulated_noak||0,antiplatelets:i.antiplatelets||0},e=_(t);console.log("Full Stroke API Payload:",e);try{const d=await I(v.FULL_STROKE,e);console.log("Full Stroke API Response:",d),console.log("Available keys in response:",Object.keys(d)),console.log("Response type:",typeof d),Object.keys(d).forEach(B=>{const S=d[B];typeof S=="number"&&S>=0&&S<=1&&console.log(`Potential probability field: ${B} = ${S}`)});const U={probability:f(d.ich_probability||((a=d.ich)==null?void 0:a.probability)||d.ICH_probability||d.ich_prob||((r=d.probability)==null?void 0:r.ich)||((s=d.results)==null?void 0:s.ich_probability),0),drivers:d.ich_drivers||((n=d.ich)==null?void 0:n.drivers)||((l=d.drivers)==null?void 0:l.ich)||null,confidence:f(d.ich_confidence||((m=d.ich)==null?void 0:m.confidence),.85),module:"Full Stroke"},V={probability:f(d.lvo_probability||((u=d.lvo)==null?void 0:u.probability)||d.LVO_probability||d.lvo_prob||((c=d.probability)==null?void 0:c.lvo)||((p=d.results)==null?void 0:p.lvo_probability),0),drivers:d.lvo_drivers||((k=d.lvo)==null?void 0:k.drivers)||((P=d.drivers)==null?void 0:P.lvo)||null,confidence:f(d.lvo_confidence||((x=d.lvo)==null?void 0:x.confidence),.85),module:"Full Stroke"};return{ich:U,lvo:V}}catch(d){throw console.error("Full Stroke prediction failed:",d),new b(`Failed to get stroke predictions: ${d.message}`,d.status,v.FULL_STROKE)}}function we(i){g.logEvent("triage1_answer",{comatose:i}),M(i?"coma":"triage2")}function Ee(i){g.logEvent("triage2_answer",{examinable:i}),M(i?"full":"limited")}function M(i){g.logEvent("navigate",{from:g.getState().currentScreen,to:i}),g.navigate(i),window.scrollTo(0,0)}function $e(){g.hasUnsavedData()&&!confirm("Are you sure you want to start over? All entered data will be lost.")||(g.logEvent("reset"),g.reset())}function De(){g.goBack()&&(g.logEvent("navigate_back"),window.scrollTo(0,0))}function Ce(){g.logEvent("navigate_home"),g.goHome(),window.scrollTo(0,0)}async function Ae(i,t){i.preventDefault();const e=i.target,a=e.dataset.module,r=ve(e);if(!r.isValid){ye(t,r.validationErrors);return}const s=new FormData(e),n={};s.forEach((u,c)=>{const p=e.elements[c];if(p&&p.type==="checkbox")n[c]=p.checked;else{const k=parseFloat(u);n[c]=isNaN(k)?u:k}}),g.setFormData(a,n);const l=e.querySelector("button[type=submit]"),m=l?l.innerHTML:"";l&&(l.disabled=!0,l.innerHTML=`<span class="loading-spinner"></span> ${o("analyzing")}`);try{let u;switch(a){case"coma":u={ich:await Se(n),lvo:null};break;case"limited":u={ich:await Le(n),lvo:{notPossible:!0}};break;case"full":u=await Te(n);break;default:throw new Error("Unknown module: "+a)}g.setResults(u),g.logEvent("models_complete",{module:a,results:u}),M("results")}catch(u){console.error("Error running models:",u);let c="An error occurred during analysis. Please try again.";u instanceof b&&(c=u.message),_e(t,c),l&&(l.disabled=!1,l.innerHTML=m)}}function _e(i,t){i.querySelectorAll(".critical-alert").forEach(r=>{var s,n;(n=(s=r.querySelector("h4"))==null?void 0:s.textContent)!=null&&n.includes("Error")&&r.remove()});const e=document.createElement("div");e.className="critical-alert",e.innerHTML=`<h4><span class="alert-icon">⚠️</span> Error</h4><p>${t}</p>`;const a=i.querySelector(".container");a?a.prepend(e):i.prepend(e),setTimeout(()=>e.remove(),1e4)}function Ie(i){const t=document.createElement("div");t.className="sr-only",t.setAttribute("role","status"),t.setAttribute("aria-live","polite");const e={triage1:"Coma assessment",triage2:"Examination capability assessment",coma:"Coma module",limited:"Limited data module",full:"Full stroke assessment",results:"Assessment results"};t.textContent=`Navigated to ${e[i]||i}`,document.body.appendChild(t),setTimeout(()=>t.remove(),1e3)}function Me(i){const t={triage1:"Initial Assessment - Stroke Triage Assistant",triage2:"Examination Capability - Stroke Triage Assistant",coma:"Coma Module - Stroke Triage Assistant",limited:"Limited Data Module - Stroke Triage Assistant",full:"Full Stroke Module - Stroke Triage Assistant",results:"Assessment Results - Stroke Triage Assistant"};document.title=t[i]||"Stroke Triage Assistant"}function Pe(){setTimeout(()=>{const i=document.querySelector("h2");i&&(i.setAttribute("tabindex","-1"),i.focus(),setTimeout(()=>i.removeAttribute("tabindex"),100))},100)}function E(i){const t=g.getState(),{currentScreen:e,results:a,startTime:r}=t;i.innerHTML="";let s="";switch(e){case"triage1":s=R();break;case"triage2":s=j();break;case"coma":s=Y();break;case"limited":s=Z();break;case"full":s=J();break;case"results":s=be(a);break;default:s=R()}i.innerHTML=s;const n=i.querySelector("form[data-module]");if(n){const l=n.dataset.module;xe(n,l)}Be(i),e==="results"&&a&&setTimeout(()=>{ue(a)},100),Ie(e),Me(e),Pe()}function xe(i,t){const e=g.getFormData(t);!e||Object.keys(e).length===0||Object.entries(e).forEach(([a,r])=>{const s=i.elements[a];s&&(s.type==="checkbox"?s.checked=r===!0||r==="on"||r==="true":s.value=r)})}function Be(i){i.querySelectorAll('input[type="number"]').forEach(e=>{e.addEventListener("blur",()=>{ke(i)})}),i.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",a=>{const{action:r,value:s}=a.currentTarget.dataset,n=s==="true";switch(r){case"triage1":we(n);break;case"triage2":Ee(n);break;case"reset":$e();break;case"goBack":De();break;case"goHome":Ce();break}})}),i.querySelectorAll("form[data-module]").forEach(e=>{e.addEventListener("submit",a=>{Ae(a,i)})});const t=i.querySelector("#printResults");t&&t.addEventListener("click",()=>window.print())}class He{constructor(){this.container=null,this.unsubscribe=null}async init(){if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",()=>this.init());return}if(this.container=document.getElementById("appContainer"),!this.container){console.error("App container not found");return}this.unsubscribe=g.subscribe(()=>{E(this.container)}),window.addEventListener("languageChanged",()=>{this.updateUILanguage(),E(this.container)}),this.setupGlobalEventListeners(),this.initializeTheme(),this.updateUILanguage(),this.startAutoSave(),this.setupSessionTimeout(),this.setCurrentYear(),this.registerServiceWorker(),E(this.container),console.log("Stroke Triage Assistant initialized")}setupGlobalEventListeners(){const t=document.getElementById("languageToggle");t&&t.addEventListener("click",()=>this.toggleLanguage());const e=document.getElementById("darkModeToggle");e&&e.addEventListener("click",()=>this.toggleDarkMode()),this.setupHelpModal(),this.setupFooterLinks(),document.addEventListener("keydown",a=>{if(a.key==="Escape"){const r=document.getElementById("helpModal");r&&r.classList.contains("show")&&(r.classList.remove("show"),r.setAttribute("aria-hidden","true"))}}),window.addEventListener("beforeunload",a=>{g.hasUnsavedData()&&(a.preventDefault(),a.returnValue="You have unsaved data. Are you sure you want to leave?")})}setupHelpModal(){const t=document.getElementById("helpButton"),e=document.getElementById("helpModal"),a=e==null?void 0:e.querySelector(".modal-close");t&&e&&(t.addEventListener("click",()=>{e.classList.add("show"),e.setAttribute("aria-hidden","false")}),a==null||a.addEventListener("click",()=>{e.classList.remove("show"),e.setAttribute("aria-hidden","true")}),e.addEventListener("click",r=>{r.target===e&&(e.classList.remove("show"),e.setAttribute("aria-hidden","true"))}))}setupFooterLinks(){var t,e;(t=document.getElementById("privacyLink"))==null||t.addEventListener("click",a=>{a.preventDefault(),this.showPrivacyPolicy()}),(e=document.getElementById("disclaimerLink"))==null||e.addEventListener("click",a=>{a.preventDefault(),this.showDisclaimer()})}initializeTheme(){const t=localStorage.getItem("theme"),e=document.getElementById("darkModeToggle");(t==="dark"||!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)&&(document.body.classList.add("dark-mode"),e&&(e.textContent="☀️"))}toggleLanguage(){$.toggleLanguage(),this.updateUILanguage()}updateUILanguage(){document.documentElement.lang=$.getCurrentLanguage();const t=document.querySelector(".app-header h1");t&&(t.textContent=o("appTitle"));const e=document.querySelector(".emergency-badge");e&&(e.textContent=o("emergencyBadge"));const a=document.getElementById("languageToggle");a&&(a.title=o("languageToggle"),a.setAttribute("aria-label",o("languageToggle")));const r=document.getElementById("helpButton");r&&(r.title=o("helpButton"),r.setAttribute("aria-label",o("helpButton")));const s=document.getElementById("darkModeToggle");s&&(s.title=o("darkModeButton"),s.setAttribute("aria-label",o("darkModeButton")));const n=document.getElementById("modalTitle");n&&(n.textContent=o("helpTitle"))}toggleDarkMode(){const t=document.getElementById("darkModeToggle");document.body.classList.toggle("dark-mode");const e=document.body.classList.contains("dark-mode");t&&(t.textContent=e?"☀️":"🌙"),localStorage.setItem("theme",e?"dark":"light")}startAutoSave(){setInterval(()=>{this.saveCurrentFormData()},C.autoSaveInterval)}saveCurrentFormData(){this.container.querySelectorAll("form[data-module]").forEach(e=>{const a=new FormData(e),r=e.dataset.module;if(r){const s={};a.forEach((m,u)=>{const c=e.elements[u];c&&c.type==="checkbox"?s[u]=c.checked:s[u]=m});const n=g.getFormData(r);JSON.stringify(n)!==JSON.stringify(s)&&g.setFormData(r,s)}})}setupSessionTimeout(){setTimeout(()=>{confirm("Your session has been idle for 30 minutes. Would you like to continue?")?this.setupSessionTimeout():g.reset()},C.sessionTimeout)}setCurrentYear(){const t=document.getElementById("currentYear");t&&(t.textContent=new Date().getFullYear())}showPrivacyPolicy(){alert("Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.")}showDisclaimer(){alert("Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.")}async registerServiceWorker(){if(!("serviceWorker"in navigator)){console.log("Service Workers not supported");return}try{const t=await navigator.serviceWorker.register("/0825/sw.js",{scope:"/0825/"});console.log("Service Worker registered successfully:",t),t.addEventListener("updatefound",()=>{const e=t.installing;console.log("New service worker found"),e.addEventListener("statechange",()=>{e.state==="installed"&&navigator.serviceWorker.controller&&(console.log("New service worker installed, update available"),this.showUpdateNotification())})}),navigator.serviceWorker.addEventListener("message",e=>{console.log("Message from service worker:",e.data)})}catch(t){console.error("Service Worker registration failed:",t)}}showUpdateNotification(){const t=document.createElement("div");t.style.cssText=`
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
    `,t.textContent="App update available - Tap to refresh",t.addEventListener("click",()=>{window.location.reload()}),document.body.appendChild(t),setTimeout(()=>{t.parentNode&&t.remove()},1e4)}destroy(){this.unsubscribe&&this.unsubscribe()}}const Re=new He;Re.init();
//# sourceMappingURL=index-BVayx83L.js.map
