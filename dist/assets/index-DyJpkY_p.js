(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();class K{constructor(){this.state={currentScreen:"triage1",results:null,sessionId:null,startTime:null,formData:{},validationErrors:{}},this.listeners=new Set,this.initialize()}initialize(){this.state.sessionId=this.generateSessionId(),this.state.startTime=Date.now(),console.log("Store initialized with session:",this.state.sessionId)}generateSessionId(){return"session_"+Date.now()+"_"+Math.random().toString(36).substr(2,9)}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}notify(){this.listeners.forEach(t=>t(this.state))}getState(){return{...this.state}}setState(t){this.state={...this.state,...t},this.notify()}navigate(t){console.log(`Navigating from ${this.state.currentScreen} to ${t}`),this.setState({currentScreen:t})}setFormData(t,e){const a={...this.state.formData};a[t]={...e},this.setState({formData:a})}getFormData(t){return this.state.formData[t]||{}}setValidationErrors(t){this.setState({validationErrors:t})}clearValidationErrors(){this.setState({validationErrors:{}})}setResults(t){this.setState({results:t})}hasUnsavedData(){return Object.keys(this.state.formData).length>0&&!this.state.results}reset(){const t={currentScreen:"triage1",results:null,sessionId:this.generateSessionId(),startTime:Date.now(),formData:{},validationErrors:{}};this.setState(t),console.log("Store reset with new session:",t.sessionId)}logEvent(t,e={}){const a={timestamp:Date.now(),session:this.state.sessionId,event:t,data:e};console.log("Event:",a)}getSessionDuration(){return Date.now()-this.state.startTime}}const m=new K;function y(i){const t=[{id:1,label:"Triage"},{id:2,label:"Assessment"},{id:3,label:"Results"}];let e='<div class="progress-indicator">';return t.forEach((a,s)=>{const r=a.id===i,n=a.id<i;e+=`
      <div class="progress-step ${r?"active":""} ${n?"completed":""}">
        ${n?"":a.id}
      </div>
    `,s<t.length-1&&(e+=`<div class="progress-line ${n?"completed":""}"></div>`)}),e+="</div>",e}const N={en:{appTitle:"Stroke Triage Assistant",emergencyBadge:"Emergency Tool",helpButton:"Help and Instructions",darkModeButton:"Toggle dark mode",languageToggle:"Language",step1:"Initial Assessment",step2:"Data Collection",step3:"Results",triage1Title:"Patient Assessment",triage1Question:"Is the patient comatose?",triage1Help:"Glasgow Coma Scale < 8",triage1Yes:"YES - Comatose",triage1No:"NO - Conscious",triage2Title:"Examination Capability",triage2Question:"Can the patient be reliably examined?",triage2Help:"Patient is not aphasic, confused, or uncooperative",triage2Yes:"YES - Full Exam Possible",triage2No:"NO - Limited Exam Only",ageLabel:"Age (years)",ageHelp:"Patient age in years",systolicLabel:"Systolic BP (mmHg)",systolicHelp:"Systolic blood pressure",diastolicLabel:"Diastolic BP (mmHg)",diastolicHelp:"Diastolic blood pressure",gfapLabel:"GFAP Value (pg/mL)",gfapHelp:"GFAP biomarker level",fastEdLabel:"FAST-ED Score",fastEdHelp:"FAST-ED assessment score (0-9)",headacheLabel:"Headache",vigilanzLabel:"Reduced consciousness",armPareseLabel:"Arm weakness",beinPareseLabel:"Leg weakness",eyeDeviationLabel:"Eye deviation",atrialFibLabel:"Atrial fibrillation",anticoagLabel:"Anticoagulated (NOAK)",antiplateletsLabel:"Antiplatelets",analyzeButton:"Analyze",analyzing:"Analyzing...",printResults:"Print Results",newAssessment:"Start New Assessment",resultsTitle:"Assessment Results",ichProbability:"ICH Probability",lvoProbability:"LVO Probability",riskLevel:"Risk Level",lowRisk:"Low Risk",moderateRisk:"Moderate Risk",highRisk:"High Risk",criticalRisk:"Critical Risk",riskLow:"Low",riskModerate:"Moderate",riskHigh:"High",riskCritical:"Critical",driversTitle:"Model Drivers",driversSubtitle:"Factors contributing to the prediction",ichDrivers:"ICH Risk Factors",lvoDrivers:"LVO Risk Factors",criticalAlertTitle:"CRITICAL RISK DETECTED",criticalAlertMessage:"High probability of intracerebral hemorrhage detected. Immediate medical attention required.",helpTitle:"Quick Reference Guide",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 8: Comatose patient - use Coma Module",gcsMod:"GCS 8-12: Moderate impairment",gcsHigh:"GCS 13-15: Mild impairment",fastEdTitle:"FAST-ED Score Components",fastEdFacial:"Facial Palsy: 0-1 points",fastEdArm:"Arm Weakness: 0-2 points",fastEdSpeech:"Speech Changes: 0-2 points",fastEdTime:"Time: Critical factor",fastEdEye:"Eye Deviation: 0-2 points",fastEdDenial:"Denial/Neglect: 0-2 points",criticalValuesTitle:"Critical Values",criticalBp:"Systolic BP > 180: Increased ICH risk",criticalGfap:"GFAP > 500 pg/mL: Significant marker",criticalFastEd:"FAST-ED ≥ 4: Consider LVO",disclaimer:"Clinical Disclaimer",disclaimerText:"This tool is for clinical decision support only. Always use clinical judgment and follow local protocols. Not a replacement for physician assessment.",importantNote:"Important",importantText:"These results are for clinical decision support only. Always use clinical judgment and follow institutional protocols.",privacyLink:"Privacy Policy",disclaimerLink:"Medical Disclaimer",versionLink:"Version 2.0.1",privacyPolicy:"Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.",medicalDisclaimer:"Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.",networkError:"Network error - please check your connection and try again",requestTimeout:"Request timeout - please try again",apiError:"Failed to get results",validationError:"Please check your input values",sessionTimeout:"Your session has been idle for 30 minutes. Would you like to continue?",unsavedData:"You have unsaved data. Are you sure you want to leave?",nearestCentersTitle:"Nearest Stroke Centers",useCurrentLocation:"Use Current Location",enterLocationPlaceholder:"Enter city or address...",enterManually:"Enter Location Manually",search:"Search",yourLocation:"Your Location",recommendedCenters:"Recommended Centers",alternativeCenters:"Alternative Centers",noCentersFound:"No stroke centers found in this area",gettingLocation:"Getting your location",searchingLocation:"Searching location",locationError:"Unable to get your location",locationPermissionDenied:"Location access denied. Please allow location access and try again.",locationUnavailable:"Location information is unavailable",locationTimeout:"Location request timed out",geolocationNotSupported:"Geolocation is not supported by this browser",geocodingNotImplemented:"Location search not available. Please use GPS or enter coordinates manually.",tryManualEntry:"Try entering your location manually or use GPS.",distanceNote:"Distances are calculated as straight-line distances. Actual travel times may vary.",travelTimeNote:"Travel times calculated for emergency vehicles with sirens and priority routing.",calculatingTravelTimes:"Calculating travel times",minutes:"min",comprehensiveCenter:"Comprehensive Stroke Center",primaryCenter:"Primary Stroke Center",telemetryCenter:"Telemedicine Center",thrombectomy:"Thrombectomy",neurosurgery:"Neurosurgery",icu:"Intensive Care",telemedicine:"Telemedicine",stroke_unit:"Stroke Unit",call:"Call",directions:"Directions",emergency:"Emergency",certified:"Certified"},de:{appTitle:"Schlaganfall-Triage-Assistent",emergencyBadge:"Notfall-Tool",helpButton:"Hilfe und Anweisungen",darkModeButton:"Dunklen Modus umschalten",languageToggle:"Sprache",step1:"Erstbeurteilung",step2:"Datenerhebung",step3:"Ergebnisse",triage1Title:"Patientenbeurteilung",triage1Question:"Ist der Patient komatös?",triage1Help:"Glasgow Coma Scale < 8",triage1Yes:"JA - Komatös",triage1No:"NEIN - Bei Bewusstsein",triage2Title:"Untersuchungsfähigkeit",triage2Question:"Kann der Patient zuverlässig untersucht werden?",triage2Help:"Patient ist nicht aphasisch, verwirrt oder unkooperativ",triage2Yes:"JA - Vollständige Untersuchung möglich",triage2No:"NEIN - Nur begrenzte Untersuchung",ageLabel:"Alter (Jahre)",ageHelp:"Patientenalter in Jahren",systolicLabel:"Systolischer RR (mmHg)",systolicHelp:"Systolischer Blutdruck",diastolicLabel:"Diastolischer RR (mmHg)",diastolicHelp:"Diastolischer Blutdruck",gfapLabel:"GFAP-Wert (pg/mL)",gfapHelp:"GFAP-Biomarker-Wert",fastEdLabel:"FAST-ED-Score",fastEdHelp:"FAST-ED-Bewertungsscore (0-9)",headacheLabel:"Kopfschmerzen",vigilanzLabel:"Bewusstseinstrübung",armPareseLabel:"Armschwäche",beinPareseLabel:"Beinschwäche",eyeDeviationLabel:"Blickdeviation",atrialFibLabel:"Vorhofflimmern",anticoagLabel:"Antikoaguliert (NOAK)",antiplateletsLabel:"Thrombozytenaggregationshemmer",analyzeButton:"Analysieren",analyzing:"Analysiere...",printResults:"Ergebnisse drucken",newAssessment:"Neue Bewertung starten",resultsTitle:"Bewertungsergebnisse",ichProbability:"ICB-Wahrscheinlichkeit",lvoProbability:"LVO-Wahrscheinlichkeit",riskLevel:"Risikostufe",riskLow:"Niedrig",riskModerate:"Mäßig",riskHigh:"Hoch",riskCritical:"Kritisch",driversTitle:"Modelltreiber",driversSubtitle:"Faktoren, die zur Vorhersage beitragen",ichDrivers:"ICB-Risikofaktoren",lvoDrivers:"LVO-Risikofaktoren",criticalAlertTitle:"KRITISCHES RISIKO ERKANNT",criticalAlertMessage:"Hohe Wahrscheinlichkeit einer intrazerebralen Blutung erkannt. Sofortige medizinische Behandlung erforderlich.",helpTitle:"Kurzreferenzleitfaden",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 8: Komatöser Patient - Koma-Modul verwenden",gcsMod:"GCS 8-12: Mäßige Beeinträchtigung",gcsHigh:"GCS 13-15: Leichte Beeinträchtigung",fastEdTitle:"FAST-ED-Score-Komponenten",fastEdFacial:"Faziale Parese: 0-1 Punkte",fastEdArm:"Armschwäche: 0-2 Punkte",fastEdSpeech:"Sprachveränderungen: 0-2 Punkte",fastEdTime:"Zeit: Kritischer Faktor",fastEdEye:"Blickdeviation: 0-2 Punkte",fastEdDenial:"Verneinung/Neglect: 0-2 Punkte",criticalValuesTitle:"Kritische Werte",criticalBp:"Systolischer RR > 180: Erhöhtes ICB-Risiko",criticalGfap:"GFAP > 500 pg/mL: Signifikanter Marker",criticalFastEd:"FAST-ED ≥ 4: LVO in Betracht ziehen",disclaimer:"Klinischer Haftungsausschluss",disclaimerText:"Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle. Kein Ersatz für ärztliche Beurteilung.",importantNote:"Wichtig",importantText:"Diese Ergebnisse dienen nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie institutionelle Protokolle.",privacyLink:"Datenschutzrichtlinie",disclaimerLink:"Medizinischer Haftungsausschluss",versionLink:"Version 2.0.1",privacyPolicy:"Datenschutzrichtlinie: Dieses Tool verarbeitet Daten lokal. Keine Patientendaten werden gespeichert oder übertragen.",medicalDisclaimer:"Medizinischer Haftungsausschluss: Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle.",networkError:"Netzwerkfehler - bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut",requestTimeout:"Anfrage-Timeout - bitte versuchen Sie es erneut",apiError:"Ergebnisse konnten nicht abgerufen werden",validationError:"Bitte überprüfen Sie Ihre Eingabewerte",sessionTimeout:"Ihre Sitzung war 30 Minuten lang inaktiv. Möchten Sie fortfahren?",unsavedData:"Sie haben ungespeicherte Daten. Sind Sie sicher, dass Sie verlassen möchten?",nearestCentersTitle:"Nächstgelegene Schlaganfall-Zentren",useCurrentLocation:"Aktuellen Standort verwenden",enterLocationPlaceholder:"Stadt oder Adresse eingeben...",enterManually:"Standort manuell eingeben",search:"Suchen",yourLocation:"Ihr Standort",recommendedCenters:"Empfohlene Zentren",alternativeCenters:"Alternative Zentren",noCentersFound:"Keine Schlaganfall-Zentren in diesem Bereich gefunden",gettingLocation:"Standort wird ermittelt",searchingLocation:"Standort wird gesucht",locationError:"Standort konnte nicht ermittelt werden",locationPermissionDenied:"Standortzugriff verweigert. Bitte erlauben Sie Standortzugriff und versuchen Sie es erneut.",locationUnavailable:"Standortinformationen sind nicht verfügbar",locationTimeout:"Standortanfrage ist abgelaufen",geolocationNotSupported:"Geolokalisierung wird von diesem Browser nicht unterstützt",geocodingNotImplemented:"Standortsuche nicht verfügbar. Bitte verwenden Sie GPS oder geben Sie Koordinaten manuell ein.",tryManualEntry:"Versuchen Sie, Ihren Standort manuell einzugeben oder GPS zu verwenden.",distanceNote:"Entfernungen werden als Luftlinie berechnet. Tatsächliche Fahrzeiten können variieren.",travelTimeNote:"Fahrzeiten berechnet für Rettungsfahrzeuge mit Sondersignalen und Vorfahrtsberechtigung.",calculatingTravelTimes:"Fahrzeiten werden berechnet",minutes:"Min",comprehensiveCenter:"Überregionales Schlaganfall-Zentrum",primaryCenter:"Regionales Schlaganfall-Zentrum",telemetryCenter:"Telemedizin-Zentrum",thrombectomy:"Thrombektomie",neurosurgery:"Neurochirurgie",icu:"Intensivstation",telemedicine:"Telemedizin",stroke_unit:"Stroke Unit",call:"Anrufen",directions:"Wegbeschreibung",emergency:"Notfall",certified:"Zertifiziert"}};class V{constructor(){this.supportedLanguages=["en","de"],this.currentLanguage=this.detectLanguage()}detectLanguage(){const t=localStorage.getItem("language");return t&&this.supportedLanguages.includes(t)?t:(navigator.language||navigator.userLanguage).substring(0,2).toLowerCase()==="de"?"de":"en"}getCurrentLanguage(){return this.currentLanguage}setLanguage(t){return this.supportedLanguages.includes(t)?(this.currentLanguage=t,localStorage.setItem("language",t),window.dispatchEvent(new CustomEvent("languageChanged",{detail:{language:t}})),!0):!1}getSupportedLanguages(){return[...this.supportedLanguages]}t(t){return(N[this.currentLanguage]||N.en)[t]||t}toggleLanguage(){const t=this.currentLanguage==="en"?"de":"en";return this.setLanguage(t)}getLanguageDisplayName(t=null){const e=t||this.currentLanguage;return{en:"English",de:"Deutsch"}[e]||e}formatDateTime(t){const e=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(e,{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(t)}formatTime(t){const e=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(e,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(t)}}const C=new V,o=i=>C.t(i);function R(){return`
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
  `}const v={COMA_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_coma_ich",LDM_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_limited_data_ich",FULL_STROKE:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_full_stroke"},D={ich:{high:60,critical:80},lvo:{high:50,critical:70}},p={min:29,max:10001},_={autoSaveInterval:3e4,sessionTimeout:30*60*1e3,requestTimeout:1e4},W={age_years:{required:!0,min:0,max:120},systolic_bp:{required:!0,min:60,max:300},diastolic_bp:{required:!0,min:30,max:200},gfap_value:{required:!0,min:p.min,max:p.max},fast_ed_score:{required:!0,min:0,max:9}};function Y(){return`
    <div class="container">
      ${y(2)}
      <h2>Coma Module</h2>
      <div class="critical-alert">
        <h4><span class="alert-icon">🚨</span> Critical Patient</h4>
        <p>Patient is comatose (GCS &lt; 8). Rapid assessment required.</p>
      </div>
      <form data-module="coma">
        <div class="input-grid">
          <div class="input-group">
            <label for="gfap_value">
              GFAP Value (pg/mL)
              <span class="tooltip">ℹ️
                <span class="tooltiptext">Glial Fibrillary Acidic Protein - Brain injury biomarker</span>
              </span>
            </label>
            <input type="number" id="gfap_value" name="gfap_value" min="${p.min}" max="${p.max}" step="0.1" required aria-describedby="gfap-help">
            <div id="gfap-help" class="input-help">
              Range: ${p.min} - ${p.max} pg/mL
            </div>
          </div>
        </div>
        <button type="submit" class="primary">Analyze ICH Risk</button>
        <button type="button" class="secondary" data-action="reset">Start Over</button>
      </form>
    </div>
  `}function Z(){return`
    <div class="container">
      ${y(2)}
      <h2>Limited Data Module</h2>
      <form data-module="limited">
        <div class="input-grid">
          <div class="input-group">
            <label for="age_years">Age (years)</label>
            <input type="number" name="age_years" id="age_years" min="0" max="120" required aria-describedby="age-help">
            <div id="age-help" class="input-help">Patient's age in years</div>
          </div>
          <div class="input-group">
            <label for="systolic_bp">Systolic BP (mmHg)</label>
            <input type="number" name="systolic_bp" id="systolic_bp" min="60" max="300" required aria-describedby="sbp-help">
            <div id="sbp-help" class="input-help">Normal: 90-140 mmHg</div>
          </div>
          <div class="input-group">
            <label for="diastolic_bp">Diastolic BP (mmHg)</label>
            <input type="number" name="diastolic_bp" id="diastolic_bp" min="30" max="200" required aria-describedby="dbp-help">
            <div id="dbp-help" class="input-help">Normal: 60-90 mmHg</div>
          </div>
          <div class="input-group">
            <label for="gfap_value">
              GFAP Value (pg/mL)
              <span class="tooltip">ℹ️
                <span class="tooltiptext">Glial Fibrillary Acidic Protein</span>
              </span>
            </label>
            <input type="number" name="gfap_value" id="gfap_value" min="${p.min}" max="${p.max}" step="0.1" required>
          </div>
        </div>
        <div class="checkbox-group">
          <label class="checkbox-wrapper">
            <input type="checkbox" name="vigilanzminderung" id="vigilanzminderung">
            <span class="checkbox-label">Vigilance Reduction (Decreased alertness)</span>
          </label>
        </div>
        <button type="submit" class="primary">Analyze ICH Risk</button>
        <button type="button" class="secondary" data-action="reset">Start Over</button>
      </form>
    </div>
  `}function J(){return`
    <div class="container">
      ${y(2)}
      <h2>Full Stroke Module</h2>
      <form data-module="full">
        <h3>Basic Information</h3>
        <div class="input-grid">
          <div class="input-group">
            <label for="age_years">Age (years)</label>
            <input type="number" name="age_years" id="age_years" min="0" max="120" required>
          </div>
          <div class="input-group">
            <label for="systolic_bp">Systolic BP (mmHg)</label>
            <input type="number" name="systolic_bp" id="systolic_bp" min="60" max="300" required>
          </div>
          <div class="input-group">
            <label for="diastolic_bp">Diastolic BP (mmHg)</label>
            <input type="number" name="diastolic_bp" id="diastolic_bp" min="30" max="200" required>
          </div>
        </div>

        <h3>Biomarkers & Scores</h3>
        <div class="input-grid">
          <div class="input-group">
            <label for="gfap_value">
              GFAP Value (pg/mL)
              <span class="tooltip">ℹ️
                <span class="tooltiptext">Brain injury biomarker</span>
              </span>
            </label>
            <input type="number" name="gfap_value" id="gfap_value" min="${p.min}" max="${p.max}" step="0.1" required>
          </div>
          <div class="input-group">
            <label for="fast_ed_score">
              FAST-ED Score
              <span class="tooltip">ℹ️
                <span class="tooltiptext">0-9 scale for LVO screening</span>
              </span>
            </label>
            <input type="number" name="fast_ed_score" id="fast_ed_score" min="0" max="9" required>
          </div>
        </div>

        <h3>Clinical Symptoms</h3>
        <div class="input-grid">
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="headache" id="headache">
              <span class="checkbox-label">Headache</span>
            </label>
            <label class="checkbox-wrapper">
              <input type="checkbox" name="vigilanzminderung" id="vigilanzminderung">
              <span class="checkbox-label">Vigilance Reduction</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="armparese" id="armparese">
              <span class="checkbox-label">Arm Paresis</span>
            </label>
            <label class="checkbox-wrapper">
              <input type="checkbox" name="beinparese" id="beinparese">
              <span class="checkbox-label">Leg Paresis</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="eye_deviation" id="eye_deviation">
              <span class="checkbox-label">Eye Deviation</span>
            </label>
          </div>
        </div>

        <h3>Medical History</h3>
        <div class="input-grid">
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="atrial_fibrillation" id="atrial_fibrillation">
              <span class="checkbox-label">Atrial Fibrillation</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="anticoagulated_noak" id="anticoagulated_noak">
              <span class="checkbox-label">On NOAC/DOAC</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="antiplatelets" id="antiplatelets">
              <span class="checkbox-label">On Antiplatelets</span>
            </label>
          </div>
        </div>

        <button type="submit" class="primary">Analyze Stroke Risk</button>
        <button type="button" class="secondary" data-action="reset">Start Over</button>
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
  `}function X(i){return!i||typeof i!="object"?{kind:"unavailable",units:null,positive:[],negative:[],meta:{}}:i.kind?i:i.shap_values||i.kind&&i.kind==="shap_values"?ee(i):i.logistic_contributions||i.kind&&i.kind==="logistic_contributions"?te(i):ae(i)?ie(i):{kind:"unavailable",units:null,positive:[],negative:[],meta:{}}}function ee(i){const t=i.shap_values||i,e=[];Array.isArray(t)?t.forEach((n,l)=>{typeof n=="object"&&n.feature&&n.value!==void 0?e.push({label:n.feature,weight:n.value}):typeof n=="number"&&e.push({label:`Feature ${l}`,weight:n})}):typeof t=="object"&&Object.entries(t).forEach(([n,l])=>{typeof l=="number"&&e.push({label:n,weight:l})}),e.sort((n,l)=>Math.abs(l.weight)-Math.abs(n.weight));const a=e.filter(n=>n.weight>0),s=e.filter(n=>n.weight<0),r={};return i.base_value!==void 0&&(r.base_value=i.base_value),i.contrib_sum!==void 0&&(r.contrib_sum=i.contrib_sum),i.logit_total!==void 0&&(r.logit_total=i.logit_total),{kind:"shap_values",units:"logit",positive:a,negative:s,meta:r}}function te(i){const t=i.logistic_contributions||i,e=[];typeof t=="object"&&Object.entries(t).forEach(([n,l])=>{typeof l=="number"&&!["intercept","contrib_sum","logit_total"].includes(n)&&e.push({label:n,weight:l})}),e.sort((n,l)=>Math.abs(l.weight)-Math.abs(n.weight));const a=e.filter(n=>n.weight>0),s=e.filter(n=>n.weight<0),r={};return t.intercept!==void 0&&(r.base_value=t.intercept),t.contrib_sum!==void 0&&(r.contrib_sum=t.contrib_sum),t.logit_total!==void 0&&(r.logit_total=t.logit_total),i.contrib_sum!==void 0&&(r.contrib_sum=i.contrib_sum),{kind:"logistic_contributions",units:"logit",positive:a,negative:s,meta:r}}function ie(i){const t=[];Object.entries(i).forEach(([s,r])=>{typeof r=="number"&&t.push({label:s,weight:r})}),t.sort((s,r)=>Math.abs(r.weight)-Math.abs(s.weight));const e=t.filter(s=>s.weight>0),a=t.filter(s=>s.weight<0);return{kind:"raw_weights",units:null,positive:e,negative:a,meta:{}}}function ae(i){return Object.values(i).every(t=>typeof t=="number")}function ne(i,t){if(!(i!=null&&i.drivers)&&!(t!=null&&t.drivers))return"";let e=`
    <div class="drivers-section">
      <h3>Prediction Drivers</h3>
      <div class="drivers-grid">
  `;return i!=null&&i.drivers&&(e+=B(i.drivers,"ICH","ich")),t!=null&&t.drivers&&!t.notPossible&&(e+=B(t.drivers,"LVO","lvo")),e+=`
      </div>
    </div>
  `,e}function B(i,t,e){if(!i||Object.keys(i).length===0)return`
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
    `;let s=`
    <div class="drivers-panel">
      <h4>
        <span class="driver-icon ${e}">${e==="ich"?"I":"L"}</span>
        ${t} Risk Factors
      </h4>
  `;return a.positive.length>0&&a.positive.forEach(r=>{const n=Math.abs(r.weight*100),l=Math.min(n*2,100);s+=`
        <div class="driver-item">
          <span class="driver-label">${r.label}</span>
          <div class="driver-bar-container">
            <div class="driver-bar positive" style="width: ${l}%">
              <span class="driver-value">+${n.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      `}),a.negative.length>0&&a.negative.forEach(r=>{const n=Math.abs(r.weight*100),l=Math.min(n*2,100);s+=`
        <div class="driver-item">
          <span class="driver-label">${r.label}</span>
          <div class="driver-bar-container">
            <div class="driver-bar negative" style="width: ${l}%">
              <span class="driver-value">-${n.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      `}),a.meta&&Object.keys(a.meta).length>0&&(s+=`
      <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid var(--border-color);">
        <small style="color: var(--text-secondary);">
    `,a.meta.base_value!==void 0&&(s+=`Base value: ${a.meta.base_value.toFixed(2)} `),a.meta.contrib_sum!==void 0&&(s+=`Contrib sum: ${a.meta.contrib_sum.toFixed(2)} `),a.meta.logit_total!==void 0&&(s+=`Logit total: ${a.meta.logit_total.toFixed(2)}`),s+=`
        </small>
      </div>
    `),s+="</div>",s}const G=[{id:"uniklinik-freiburg",name:"Universitätsklinikum Freiburg",type:"comprehensive",address:"Hugstetter Str. 55, 79106 Freiburg im Breisgau",coordinates:{lat:48.0025,lng:7.8347},phone:"+49 761 270-0",emergency:"+49 761 270-34010",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"uniklinik-heidelberg",name:"Universitätsklinikum Heidelberg",type:"comprehensive",address:"Im Neuenheimer Feld 400, 69120 Heidelberg",coordinates:{lat:49.4178,lng:8.6706},phone:"+49 6221 56-0",emergency:"+49 6221 56-36643",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"uniklinik-tuebingen",name:"Universitätsklinikum Tübingen",type:"comprehensive",address:"Geissweg 3, 72076 Tübingen",coordinates:{lat:48.5378,lng:9.0538},phone:"+49 7071 29-0",emergency:"+49 7071 29-82211",services:["thrombectory","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"uniklinik-ulm",name:"Universitätsklinikum Ulm",type:"comprehensive",address:"Albert-Einstein-Allee 23, 89081 Ulm",coordinates:{lat:48.4196,lng:9.9592},phone:"+49 731 500-0",emergency:"+49 731 500-63001",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"klinikum-stuttgart",name:"Klinikum Stuttgart - Katharinenhospital",type:"comprehensive",address:"Kriegsbergstraße 60, 70174 Stuttgart",coordinates:{lat:48.7784,lng:9.1682},phone:"+49 711 278-0",emergency:"+49 711 278-32001",services:["thrombectomy","neurosurgery","icu"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"robert-bosch-stuttgart",name:"Robert-Bosch-Krankenhaus Stuttgart",type:"primary",address:"Auerbachstraße 110, 70376 Stuttgart",coordinates:{lat:48.7447,lng:9.2294},phone:"+49 711 8101-0",emergency:"+49 711 8101-3456",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"diakonie-stuttgart",name:"Diakonie-Klinikum Stuttgart",type:"primary",address:"Rosenbergstraße 38, 70176 Stuttgart",coordinates:{lat:48.7861,lng:9.1736},phone:"+49 711 991-0",emergency:"+49 711 991-2201",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"rkh-ludwigsburg",name:"RKH Klinikum Ludwigsburg",type:"primary",address:"Posilipostraße 4, 71640 Ludwigsburg",coordinates:{lat:48.8901,lng:9.1953},phone:"+49 7141 99-0",emergency:"+49 7141 99-67201",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-karlsruhe",name:"Städtisches Klinikum Karlsruhe",type:"comprehensive",address:"Moltkestraße 90, 76133 Karlsruhe",coordinates:{lat:49.0047,lng:8.3858},phone:"+49 721 974-0",emergency:"+49 721 974-2301",services:["thrombectomy","neurosurgery","icu"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"vincentius-karlsruhe",name:"ViDia Kliniken Karlsruhe - St. Vincentius",type:"primary",address:"Südendstraße 32, 76135 Karlsruhe",coordinates:{lat:48.9903,lng:8.3711},phone:"+49 721 8108-0",emergency:"+49 721 8108-9201",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-mannheim",name:"Universitätsmedizin Mannheim",type:"comprehensive",address:"Theodor-Kutzer-Ufer 1-3, 68167 Mannheim",coordinates:{lat:49.4828,lng:8.4664},phone:"+49 621 383-0",emergency:"+49 621 383-2251",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"theresienkrankenhaus-mannheim",name:"Theresienkrankenhaus Mannheim",type:"primary",address:"Bassermannstraße 1, 68165 Mannheim",coordinates:{lat:49.4904,lng:8.4594},phone:"+49 621 424-0",emergency:"+49 621 424-2101",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-pforzheim",name:"Helios Klinikum Pforzheim",type:"primary",address:"Kanzlerstraße 2-6, 75175 Pforzheim",coordinates:{lat:48.8833,lng:8.6936},phone:"+49 7231 969-0",emergency:"+49 7231 969-2301",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"zollernalb-klinikum",name:"Zollernalb Klinikum Albstadt",type:"primary",address:"Zollernring 10-14, 72488 Sigmaringen",coordinates:{lat:48.0878,lng:9.2233},phone:"+49 7571 100-0",emergency:"+49 7571 100-1501",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-konstanz",name:"Gesundheitsverbund Landkreis Konstanz",type:"primary",address:"Mainaustraße 14, 78464 Konstanz",coordinates:{lat:47.6779,lng:9.1732},phone:"+49 7531 801-0",emergency:"+49 7531 801-2301",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-friedrichshafen",name:"Klinikum Friedrichshafen",type:"primary",address:"Röntgenstraße 2, 88048 Friedrichshafen",coordinates:{lat:47.6587,lng:9.4685},phone:"+49 7541 96-0",emergency:"+49 7541 96-2401",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"oberschwabenklinik-ravensburg",name:"Oberschwabenklinik Ravensburg",type:"primary",address:"Elisabethenstraße 17, 88212 Ravensburg",coordinates:{lat:47.7815,lng:9.6078},phone:"+49 751 87-0",emergency:"+49 751 87-2201",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"alb-donau-klinikum",name:"Alb Donau Klinikum Ehingen",type:"primary",address:"Schwörhausgasse 7, 89584 Ehingen",coordinates:{lat:48.2833,lng:9.7262},phone:"+49 7391 789-0",emergency:"+49 7391 789-1801",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"ortenau-klinikum-offenburg",name:"Ortenau Klinikum Offenburg",type:"primary",address:"Ebertplatz 12, 77654 Offenburg",coordinates:{lat:48.4706,lng:7.9444},phone:"+49 781 472-0",emergency:"+49 781 472-2001",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-baden-baden",name:"Klinikum Mittelbaden Baden-Baden",type:"primary",address:"Balger Str. 50, 76532 Baden-Baden",coordinates:{lat:48.7606,lng:8.2275},phone:"+49 7221 91-0",emergency:"+49 7221 91-1701",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"}];function w(i,t,e,a){const r=L(e-i),n=L(a-t),l=Math.sin(r/2)*Math.sin(r/2)+Math.cos(L(i))*Math.cos(L(e))*Math.sin(n/2)*Math.sin(n/2);return 6371*(2*Math.atan2(Math.sqrt(l),Math.sqrt(1-l)))}function L(i){return i*(Math.PI/180)}async function O(i,t,e,a,s="driving-car"){try{const r=`https://api.openrouteservice.org/v2/directions/${s}`,l=await fetch(r,{method:"POST",headers:{Accept:"application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",Authorization:"5b3ce3597851110001cf624868c4c27b63ae476c9c26c8bffbc35688","Content-Type":"application/json; charset=utf-8"},body:JSON.stringify({coordinates:[[t,i],[a,e]],radiuses:[1e3,1e3],format:"json"})});if(!l.ok)throw new Error(`Routing API error: ${l.status}`);const u=await l.json();if(u.routes&&u.routes.length>0){const c=u.routes[0];return{duration:Math.round(c.summary.duration/60),distance:Math.round(c.summary.distance/1e3),source:"routing"}}else throw new Error("No route found")}catch(r){console.warn("Travel time calculation failed, using distance estimate:",r);const n=w(i,t,e,a);return{duration:Math.round(n/.8),distance:Math.round(n),source:"estimated"}}}async function re(i,t,e,a){try{const s=await O(i,t,e,a,"driving-car");return{duration:Math.round(s.duration*.75),distance:s.distance,source:s.source==="routing"?"emergency-routing":"emergency-estimated"}}catch{const r=w(i,t,e,a);return{duration:Math.round(r/1.2),distance:Math.round(r),source:"emergency-estimated"}}}async function se(i,t,e=5,a=120,s=!0){return console.log("Calculating travel times to stroke centers..."),(await Promise.all(G.map(async n=>{try{const l=s?await re(i,t,n.coordinates.lat,n.coordinates.lng):await O(i,t,n.coordinates.lat,n.coordinates.lng);return{...n,travelTime:l.duration,distance:l.distance,travelSource:l.source}}catch(l){console.warn(`Failed to calculate travel time to ${n.name}:`,l);const u=w(i,t,n.coordinates.lat,n.coordinates.lng);return{...n,travelTime:Math.round(u/.8),distance:Math.round(u),travelSource:"fallback"}}}))).filter(n=>n.travelTime<=a).sort((n,l)=>n.travelTime-l.travelTime).slice(0,e)}function oe(i,t,e=5,a=100){return G.map(r=>({...r,distance:w(i,t,r.coordinates.lat,r.coordinates.lng)})).filter(r=>r.distance<=a).sort((r,n)=>r.distance-n.distance).slice(0,e)}async function le(i,t,e="stroke"){const a=await se(i,t,10,120,!0);if(e==="lvo"||e==="thrombectomy"){const s=a.filter(n=>n.type==="comprehensive"&&n.services.includes("thrombectomy")&&n.travelTime<=60),r=a.filter(n=>n.type==="primary");return{recommended:s.slice(0,3),alternative:r.slice(0,2)}}if(e==="ich"){const s=a.filter(r=>r.services.includes("neurosurgery")&&r.travelTime<=45);return{recommended:s.slice(0,3),alternative:a.filter(r=>!s.includes(r)).slice(0,2)}}return{recommended:a.slice(0,5),alternative:[]}}function ce(i,t,e="stroke"){const a=oe(i,t,10);if(e==="lvo"||e==="thrombectomy"){const s=a.filter(n=>n.type==="comprehensive"&&n.services.includes("thrombectomy")),r=a.filter(n=>n.type==="primary");return{recommended:s.slice(0,3),alternative:r.slice(0,2)}}return{recommended:a.slice(0,5),alternative:[]}}function de(i){return`
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
  `}function ue(i){const t=document.getElementById("useGpsButton"),e=document.getElementById("manualLocationButton"),a=document.querySelector(".location-manual"),s=document.getElementById("locationInput"),r=document.getElementById("searchLocationButton"),n=document.getElementById("strokeCenterResults");t&&t.addEventListener("click",()=>{me(i,n)}),e&&e.addEventListener("click",()=>{a.style.display=a.style.display==="none"?"block":"none"}),r&&r.addEventListener("click",()=>{const l=s.value.trim();l&&H(l,i,n)}),s&&s.addEventListener("keypress",l=>{if(l.key==="Enter"){const u=s.value.trim();u&&H(u,i,n)}})}function me(i,t){if(!navigator.geolocation){A(o("geolocationNotSupported"),t);return}t.innerHTML=`<div class="loading">${o("gettingLocation")}...</div>`,navigator.geolocation.getCurrentPosition(e=>{const{latitude:a,longitude:s}=e.coords;ge(a,s,i,t)},e=>{let a=o("locationError");switch(e.code){case e.PERMISSION_DENIED:a=o("locationPermissionDenied");break;case e.POSITION_UNAVAILABLE:a=o("locationUnavailable");break;case e.TIMEOUT:a=o("locationTimeout");break}A(a,t)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:3e5})}async function H(i,t,e){e.innerHTML=`<div class="loading">${o("searchingLocation")}...</div>`,A(o("geocodingNotImplemented"),e)}async function ge(i,t,e,a){const s=pe(e);a.innerHTML=`
    <div class="location-info">
      <p><strong>${o("yourLocation")}:</strong> ${i.toFixed(4)}, ${t.toFixed(4)}</p>
    </div>
    <div class="loading">${o("calculatingTravelTimes")}...</div>
  `;try{const r=await le(i,t,s),n=`
      <div class="location-info">
        <p><strong>${o("yourLocation")}:</strong> ${i.toFixed(4)}, ${t.toFixed(4)}</p>
      </div>
      
      <div class="recommended-centers">
        <h4>${o("recommendedCenters")}</h4>
        ${T(r.recommended,!0)}
      </div>
      
      ${r.alternative.length>0?`
        <div class="alternative-centers">
          <h4>${o("alternativeCenters")}</h4>
          ${T(r.alternative,!1)}
        </div>
      `:""}
      
      <div class="travel-time-note">
        <small>${o("travelTimeNote")}</small>
      </div>
    `;a.innerHTML=n}catch(r){console.warn("Travel time calculation failed, falling back to distance:",r);const n=ce(i,t,s),l=`
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
  `}function z(i,t){const e=Number(i),a=D[t];return e>=a.critical?"🔴 CRITICAL RISK":e>=a.high?"🟠 HIGH RISK":e>=30?"🟡 MODERATE RISK":"🟢 LOW RISK"}function he(i,t){const{ich:e,lvo:a}=i;let s="",r="";if(e){const c=Math.round((e.probability||0)*100);s=`
      <div class="result-card ${c>D.ich.critical?"critical":"ich"}">
        <h3> 🧠 ${o("ichProbability")} <small>(${e.module} Module)</small> </h3>
        <div class="probability-display">${c}%</div>
        <div class="probability-meter">
          <div class="probability-fill" style="width: ${c}%"></div>
          <div class="probability-marker" style="left: ${c}%">${c}%</div>
        </div>
        <p><strong>${o("riskLevel")}:</strong> ${z(c,"ich")}</p>
      </div>
    `}if(a)if(a.notPossible)r=`
        <div class="result-card info">
          <h3>🔍 ${o("lvoProbability")}</h3>
          <p>LVO assessment not possible with limited data.</p>
          <p>A full neurological examination is required for LVO screening.</p>
        </div>
      `;else{const c=Math.round((a.probability||0)*100);r=`
        <div class="result-card ${c>D.lvo.critical?"critical":"lvo"}">
          <h3> 🩸 ${o("lvoProbability")} <small>(${a.module} Module)</small> </h3>
          <div class="probability-display">${c}%</div>
          <div class="probability-meter">
            <div class="probability-fill" style="width: ${c}%"></div>
            <div class="probability-marker" style="left: ${c}%">${c}%</div>
          </div>
          <p><strong>${o("riskLevel")}:</strong> ${z(c,"lvo")}</p>
        </div>
      `}const n=e&&e.probability>.6?Q():"",l=ne(e,a),u=de();return`
    <div class="container">
      ${y(3)}
      <h2>${o("resultsTitle")}</h2>
      ${n}
      <div style="display: flex; flex-direction: column; gap: 20px;">
        ${s}
        ${r}
      </div>
      ${l}
      ${u}
      <button type="button" class="primary" id="printResults"> 📄 ${o("printResults")} </button>
      <button type="button" class="secondary" data-action="reset"> ${o("newAssessment")} </button>
      <div class="disclaimer">
        <strong>⚠️ ${o("importantNote")}:</strong> ${o("importantText")} Results generated at ${new Date().toLocaleTimeString()}.
      </div>
    </div>
  `}function be(i,t,e){const a=[];return e.required&&!t&&t!==0&&a.push("This field is required"),e.min!==void 0&&t!==""&&!isNaN(t)&&parseFloat(t)<e.min&&a.push(`Value must be at least ${e.min}`),e.max!==void 0&&t!==""&&!isNaN(t)&&parseFloat(t)>e.max&&a.push(`Value must be at most ${e.max}`),e.pattern&&!e.pattern.test(t)&&a.push("Invalid format"),a}function fe(i){let t=!0;const e={};return Object.entries(W).forEach(([a,s])=>{const r=i.elements[a];if(r){const n=be(a,r.value,s);n.length>0&&(e[a]=n,t=!1)}}),{isValid:t,validationErrors:e}}function ve(i,t){Object.entries(t).forEach(([e,a])=>{const s=i.querySelector(`[name="${e}"]`);if(s){const r=s.closest(".input-group");if(r){r.classList.add("error"),r.querySelectorAll(".error-message").forEach(l=>l.remove());const n=document.createElement("div");n.className="error-message",n.innerHTML=`<span class="error-icon">⚠️</span> ${a[0]}`,r.appendChild(n)}}})}function ye(i){i.querySelectorAll(".input-group.error").forEach(t=>{t.classList.remove("error"),t.querySelectorAll(".error-message").forEach(e=>e.remove())})}class h extends Error{constructor(t,e,a){super(t),this.name="APIError",this.status=e,this.url=a}}function $(i){const t={...i};return Object.keys(t).forEach(e=>{const a=t[e];(typeof a=="boolean"||a==="on"||a==="true"||a==="false")&&(t[e]=a===!0||a==="on"||a==="true"?1:0)}),t}function b(i,t=0){const e=parseFloat(i);return isNaN(e)?t:e}async function I(i,t){const e=new AbortController,a=setTimeout(()=>e.abort(),_.requestTimeout);try{const s=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(t),signal:e.signal,mode:"cors"});if(clearTimeout(a),!s.ok){let n=`HTTP ${s.status}`;try{const l=await s.json();n=l.error||l.message||n}catch{n=`${n}: ${s.statusText}`}throw new h(n,s.status,i)}return await s.json()}catch(s){throw clearTimeout(a),s.name==="AbortError"?new h("Request timeout - please try again",408,i):s instanceof h?s:new h("Network error - please check your connection and try again",0,i)}}async function ke(i){const t=$(i);console.log("Coma ICH API Payload:",t);try{const e=await I(v.COMA_ICH,t);return console.log("Coma ICH API Response:",e),{probability:b(e.probability||e.ich_probability,0),drivers:e.drivers||null,confidence:b(e.confidence,.75),module:"Coma"}}catch(e){throw console.error("Coma ICH prediction failed:",e),new h(`Failed to get ICH prediction: ${e.message}`,e.status,v.COMA_ICH)}}async function Se(i){const t={age_years:i.age_years,systolic_bp:i.systolic_bp,diastolic_bp:i.diastolic_bp,gfap_value:i.gfap_value,vigilanzminderung:i.vigilanzminderung||0},e=$(t);console.log("Limited Data ICH API Payload:",e);try{const a=await I(v.LDM_ICH,e);return console.log("Limited Data ICH API Response:",a),{probability:b(a.probability||a.ich_probability,0),drivers:a.drivers||null,confidence:b(a.confidence,.65),module:"Limited Data"}}catch(a){throw console.error("Limited Data ICH prediction failed:",a),new h(`Failed to get ICH prediction: ${a.message}`,a.status,v.LDM_ICH)}}async function Le(i){var a,s,r,n,l,u,c,g,f,k,P,x;const t={age_years:i.age_years,systolic_bp:i.systolic_bp,diastolic_bp:i.diastolic_bp,gfap_value:i.gfap_value,fast_ed_score:i.fast_ed_score,headache:i.headache||0,vigilanzminderung:i.vigilanzminderung||0,armparese:i.armparese||0,beinparese:i.beinparese||0,eye_deviation:i.eye_deviation||0,atrial_fibrillation:i.atrial_fibrillation||0,anticoagulated_noak:i.anticoagulated_noak||0,antiplatelets:i.antiplatelets||0},e=$(t);console.log("Full Stroke API Payload:",e);try{const d=await I(v.FULL_STROKE,e);console.log("Full Stroke API Response:",d),console.log("Available keys in response:",Object.keys(d)),console.log("Response type:",typeof d),Object.keys(d).forEach(F=>{const S=d[F];typeof S=="number"&&S>=0&&S<=1&&console.log(`Potential probability field: ${F} = ${S}`)});const U={probability:b(d.ich_probability||((a=d.ich)==null?void 0:a.probability)||d.ICH_probability||d.ich_prob||((s=d.probability)==null?void 0:s.ich)||((r=d.results)==null?void 0:r.ich_probability),0),drivers:d.ich_drivers||((n=d.ich)==null?void 0:n.drivers)||((l=d.drivers)==null?void 0:l.ich)||null,confidence:b(d.ich_confidence||((u=d.ich)==null?void 0:u.confidence),.85),module:"Full Stroke"},q={probability:b(d.lvo_probability||((c=d.lvo)==null?void 0:c.probability)||d.LVO_probability||d.lvo_prob||((g=d.probability)==null?void 0:g.lvo)||((f=d.results)==null?void 0:f.lvo_probability),0),drivers:d.lvo_drivers||((k=d.lvo)==null?void 0:k.drivers)||((P=d.drivers)==null?void 0:P.lvo)||null,confidence:b(d.lvo_confidence||((x=d.lvo)==null?void 0:x.confidence),.85),module:"Full Stroke"};return{ich:U,lvo:q}}catch(d){throw console.error("Full Stroke prediction failed:",d),new h(`Failed to get stroke predictions: ${d.message}`,d.status,v.FULL_STROKE)}}function Te(i){m.logEvent("triage1_answer",{comatose:i}),M(i?"coma":"triage2")}function we(i){m.logEvent("triage2_answer",{examinable:i}),M(i?"full":"limited")}function M(i){m.logEvent("navigate",{from:m.getState().currentScreen,to:i}),m.navigate(i),window.scrollTo(0,0)}function Ee(){m.hasUnsavedData()&&!confirm("Are you sure you want to start over? All entered data will be lost.")||(m.logEvent("reset"),m.reset())}async function Ce(i,t){i.preventDefault();const e=i.target,a=e.dataset.module,s=fe(e);if(!s.isValid){ve(t,s.validationErrors);return}const r=new FormData(e),n={};r.forEach((c,g)=>{const f=e.elements[g];if(f&&f.type==="checkbox")n[g]=f.checked;else{const k=parseFloat(c);n[g]=isNaN(k)?c:k}}),m.setFormData(a,n);const l=e.querySelector("button[type=submit]"),u=l?l.innerHTML:"";l&&(l.disabled=!0,l.innerHTML=`<span class="loading-spinner"></span> ${o("analyzing")}`);try{let c;switch(a){case"coma":c={ich:await ke(n),lvo:null};break;case"limited":c={ich:await Se(n),lvo:{notPossible:!0}};break;case"full":c=await Le(n);break;default:throw new Error("Unknown module: "+a)}m.setResults(c),m.logEvent("models_complete",{module:a,results:c}),M("results")}catch(c){console.error("Error running models:",c);let g="An error occurred during analysis. Please try again.";c instanceof h&&(g=c.message),De(t,g),l&&(l.disabled=!1,l.innerHTML=u)}}function De(i,t){i.querySelectorAll(".critical-alert").forEach(s=>{var r,n;(n=(r=s.querySelector("h4"))==null?void 0:r.textContent)!=null&&n.includes("Error")&&s.remove()});const e=document.createElement("div");e.className="critical-alert",e.innerHTML=`<h4><span class="alert-icon">⚠️</span> Error</h4><p>${t}</p>`;const a=i.querySelector(".container");a?a.prepend(e):i.prepend(e),setTimeout(()=>e.remove(),1e4)}function _e(i){const t=document.createElement("div");t.className="sr-only",t.setAttribute("role","status"),t.setAttribute("aria-live","polite");const e={triage1:"Coma assessment",triage2:"Examination capability assessment",coma:"Coma module",limited:"Limited data module",full:"Full stroke assessment",results:"Assessment results"};t.textContent=`Navigated to ${e[i]||i}`,document.body.appendChild(t),setTimeout(()=>t.remove(),1e3)}function Ae(i){const t={triage1:"Initial Assessment - Stroke Triage Assistant",triage2:"Examination Capability - Stroke Triage Assistant",coma:"Coma Module - Stroke Triage Assistant",limited:"Limited Data Module - Stroke Triage Assistant",full:"Full Stroke Module - Stroke Triage Assistant",results:"Assessment Results - Stroke Triage Assistant"};document.title=t[i]||"Stroke Triage Assistant"}function $e(){setTimeout(()=>{const i=document.querySelector("h2");i&&(i.setAttribute("tabindex","-1"),i.focus(),setTimeout(()=>i.removeAttribute("tabindex"),100))},100)}function E(i){const t=m.getState(),{currentScreen:e,results:a,startTime:s}=t;i.innerHTML="";let r="";switch(e){case"triage1":r=R();break;case"triage2":r=j();break;case"coma":r=Y();break;case"limited":r=Z();break;case"full":r=J();break;case"results":r=he(a);break;default:r=R()}i.innerHTML=r;const n=i.querySelector("form[data-module]");if(n){const l=n.dataset.module;Ie(n,l)}Me(i),e==="results"&&a&&setTimeout(()=>{ue(a)},100),_e(e),Ae(e),$e()}function Ie(i,t){const e=m.getFormData(t);!e||Object.keys(e).length===0||Object.entries(e).forEach(([a,s])=>{const r=i.elements[a];r&&(r.type==="checkbox"?r.checked=s===!0||s==="on"||s==="true":r.value=s)})}function Me(i){i.querySelectorAll('input[type="number"]').forEach(e=>{e.addEventListener("blur",()=>{ye(i)})}),i.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",a=>{const{action:s,value:r}=a.currentTarget.dataset,n=r==="true";switch(s){case"triage1":Te(n);break;case"triage2":we(n);break;case"reset":Ee();break}})}),i.querySelectorAll("form[data-module]").forEach(e=>{e.addEventListener("submit",a=>{Ce(a,i)})});const t=i.querySelector("#printResults");t&&t.addEventListener("click",()=>window.print())}class Pe{constructor(){this.container=null,this.unsubscribe=null}async init(){if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",()=>this.init());return}if(this.container=document.getElementById("appContainer"),!this.container){console.error("App container not found");return}this.unsubscribe=m.subscribe(()=>{E(this.container)}),window.addEventListener("languageChanged",()=>{this.updateUILanguage(),E(this.container)}),this.setupGlobalEventListeners(),this.initializeTheme(),this.updateUILanguage(),this.startAutoSave(),this.setupSessionTimeout(),this.setCurrentYear(),E(this.container),console.log("Stroke Triage Assistant initialized")}setupGlobalEventListeners(){const t=document.getElementById("languageToggle");t&&t.addEventListener("click",()=>this.toggleLanguage());const e=document.getElementById("darkModeToggle");e&&e.addEventListener("click",()=>this.toggleDarkMode()),this.setupHelpModal(),this.setupFooterLinks(),document.addEventListener("keydown",a=>{if(a.key==="Escape"){const s=document.getElementById("helpModal");s&&s.classList.contains("show")&&(s.classList.remove("show"),s.setAttribute("aria-hidden","true"))}}),window.addEventListener("beforeunload",a=>{m.hasUnsavedData()&&(a.preventDefault(),a.returnValue="You have unsaved data. Are you sure you want to leave?")})}setupHelpModal(){const t=document.getElementById("helpButton"),e=document.getElementById("helpModal"),a=e==null?void 0:e.querySelector(".modal-close");t&&e&&(t.addEventListener("click",()=>{e.classList.add("show"),e.setAttribute("aria-hidden","false")}),a==null||a.addEventListener("click",()=>{e.classList.remove("show"),e.setAttribute("aria-hidden","true")}),e.addEventListener("click",s=>{s.target===e&&(e.classList.remove("show"),e.setAttribute("aria-hidden","true"))}))}setupFooterLinks(){var t,e;(t=document.getElementById("privacyLink"))==null||t.addEventListener("click",a=>{a.preventDefault(),this.showPrivacyPolicy()}),(e=document.getElementById("disclaimerLink"))==null||e.addEventListener("click",a=>{a.preventDefault(),this.showDisclaimer()})}initializeTheme(){const t=localStorage.getItem("theme"),e=document.getElementById("darkModeToggle");(t==="dark"||!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)&&(document.body.classList.add("dark-mode"),e&&(e.textContent="☀️"))}toggleLanguage(){C.toggleLanguage(),this.updateUILanguage()}updateUILanguage(){document.documentElement.lang=C.getCurrentLanguage();const t=document.querySelector(".app-header h1");t&&(t.textContent=o("appTitle"));const e=document.querySelector(".emergency-badge");e&&(e.textContent=o("emergencyBadge"));const a=document.getElementById("languageToggle");a&&(a.title=o("languageToggle"),a.setAttribute("aria-label",o("languageToggle")));const s=document.getElementById("helpButton");s&&(s.title=o("helpButton"),s.setAttribute("aria-label",o("helpButton")));const r=document.getElementById("darkModeToggle");r&&(r.title=o("darkModeButton"),r.setAttribute("aria-label",o("darkModeButton")));const n=document.getElementById("modalTitle");n&&(n.textContent=o("helpTitle"))}toggleDarkMode(){const t=document.getElementById("darkModeToggle");document.body.classList.toggle("dark-mode");const e=document.body.classList.contains("dark-mode");t&&(t.textContent=e?"☀️":"🌙"),localStorage.setItem("theme",e?"dark":"light")}startAutoSave(){setInterval(()=>{this.saveCurrentFormData()},_.autoSaveInterval)}saveCurrentFormData(){this.container.querySelectorAll("form[data-module]").forEach(e=>{const a=new FormData(e),s=e.dataset.module;if(s){const r={};a.forEach((u,c)=>{const g=e.elements[c];g&&g.type==="checkbox"?r[c]=g.checked:r[c]=u});const n=m.getFormData(s);JSON.stringify(n)!==JSON.stringify(r)&&m.setFormData(s,r)}})}setupSessionTimeout(){setTimeout(()=>{confirm("Your session has been idle for 30 minutes. Would you like to continue?")?this.setupSessionTimeout():m.reset()},_.sessionTimeout)}setCurrentYear(){const t=document.getElementById("currentYear");t&&(t.textContent=new Date().getFullYear())}showPrivacyPolicy(){alert("Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.")}showDisclaimer(){alert("Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.")}destroy(){this.unsubscribe&&this.unsubscribe()}}const xe=new Pe;xe.init();
//# sourceMappingURL=index-DyJpkY_p.js.map
