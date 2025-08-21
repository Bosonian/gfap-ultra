(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function e(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(a){if(a.ep)return;a.ep=!0;const r=e(a);fetch(a.href,r)}})();class B{constructor(){this.state={currentScreen:"triage1",results:null,sessionId:null,startTime:null,formData:{},validationErrors:{}},this.listeners=new Set,this.initialize()}initialize(){this.state.sessionId=this.generateSessionId(),this.state.startTime=Date.now(),console.log("Store initialized with session:",this.state.sessionId)}generateSessionId(){return"session_"+Date.now()+"_"+Math.random().toString(36).substr(2,9)}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}notify(){this.listeners.forEach(t=>t(this.state))}getState(){return{...this.state}}setState(t){this.state={...this.state,...t},this.notify()}navigate(t){console.log(`Navigating from ${this.state.currentScreen} to ${t}`),this.setState({currentScreen:t})}setFormData(t,e){const n={...this.state.formData};n[t]={...e},this.setState({formData:n})}getFormData(t){return this.state.formData[t]||{}}setValidationErrors(t){this.setState({validationErrors:t})}clearValidationErrors(){this.setState({validationErrors:{}})}setResults(t){this.setState({results:t})}hasUnsavedData(){return Object.keys(this.state.formData).length>0&&!this.state.results}reset(){const t={currentScreen:"triage1",results:null,sessionId:this.generateSessionId(),startTime:Date.now(),formData:{},validationErrors:{}};this.setState(t),console.log("Store reset with new session:",t.sessionId)}logEvent(t,e={}){const n={timestamp:Date.now(),session:this.state.sessionId,event:t,data:e};console.log("Event:",n)}getSessionDuration(){return Date.now()-this.state.startTime}}const d=new B;function v(i){const t=[{id:1,label:"Triage"},{id:2,label:"Assessment"},{id:3,label:"Results"}];let e='<div class="progress-indicator">';return t.forEach((n,a)=>{const r=n.id===i,s=n.id<i;e+=`
      <div class="progress-step ${r?"active":""} ${s?"completed":""}">
        ${s?"":n.id}
      </div>
    `,a<t.length-1&&(e+=`<div class="progress-line ${s?"completed":""}"></div>`)}),e+="</div>",e}const _={en:{appTitle:"Stroke Triage Assistant",emergencyBadge:"Emergency Tool",helpButton:"Help and Instructions",darkModeButton:"Toggle dark mode",languageToggle:"Language",step1:"Initial Assessment",step2:"Data Collection",step3:"Results",triage1Title:"Patient Assessment",triage1Question:"Is the patient comatose?",triage1Help:"Glasgow Coma Scale < 8",triage1Yes:"YES - Comatose",triage1No:"NO - Conscious",triage2Title:"Examination Capability",triage2Question:"Can the patient be reliably examined?",triage2Help:"Patient is not aphasic, confused, or uncooperative",triage2Yes:"YES - Full Exam Possible",triage2No:"NO - Limited Exam Only",ageLabel:"Age (years)",ageHelp:"Patient age in years",systolicLabel:"Systolic BP (mmHg)",systolicHelp:"Systolic blood pressure",diastolicLabel:"Diastolic BP (mmHg)",diastolicHelp:"Diastolic blood pressure",gfapLabel:"GFAP Value (pg/mL)",gfapHelp:"GFAP biomarker level",fastEdLabel:"FAST-ED Score",fastEdHelp:"FAST-ED assessment score (0-9)",headacheLabel:"Headache",vigilanzLabel:"Reduced consciousness",armPareseLabel:"Arm weakness",beinPareseLabel:"Leg weakness",eyeDeviationLabel:"Eye deviation",atrialFibLabel:"Atrial fibrillation",anticoagLabel:"Anticoagulated (NOAK)",antiplateletsLabel:"Antiplatelets",analyzeButton:"Analyze",analyzing:"Analyzing...",printResults:"Print Results",newAssessment:"Start New Assessment",resultsTitle:"Assessment Results",ichProbability:"ICH Probability",lvoProbability:"LVO Probability",riskLevel:"Risk Level",lowRisk:"Low Risk",moderateRisk:"Moderate Risk",highRisk:"High Risk",criticalRisk:"Critical Risk",riskLow:"Low",riskModerate:"Moderate",riskHigh:"High",riskCritical:"Critical",driversTitle:"Model Drivers",driversSubtitle:"Factors contributing to the prediction",ichDrivers:"ICH Risk Factors",lvoDrivers:"LVO Risk Factors",criticalAlertTitle:"CRITICAL RISK DETECTED",criticalAlertMessage:"High probability of intracerebral hemorrhage detected. Immediate medical attention required.",helpTitle:"Quick Reference Guide",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 8: Comatose patient - use Coma Module",gcsMod:"GCS 8-12: Moderate impairment",gcsHigh:"GCS 13-15: Mild impairment",fastEdTitle:"FAST-ED Score Components",fastEdFacial:"Facial Palsy: 0-1 points",fastEdArm:"Arm Weakness: 0-2 points",fastEdSpeech:"Speech Changes: 0-2 points",fastEdTime:"Time: Critical factor",fastEdEye:"Eye Deviation: 0-2 points",fastEdDenial:"Denial/Neglect: 0-2 points",criticalValuesTitle:"Critical Values",criticalBp:"Systolic BP > 180: Increased ICH risk",criticalGfap:"GFAP > 500 pg/mL: Significant marker",criticalFastEd:"FAST-ED ≥ 4: Consider LVO",disclaimer:"Clinical Disclaimer",disclaimerText:"This tool is for clinical decision support only. Always use clinical judgment and follow local protocols. Not a replacement for physician assessment.",importantNote:"Important",importantText:"These results are for clinical decision support only. Always use clinical judgment and follow institutional protocols.",privacyLink:"Privacy Policy",disclaimerLink:"Medical Disclaimer",versionLink:"Version 2.0.1",privacyPolicy:"Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.",medicalDisclaimer:"Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.",networkError:"Network error - please check your connection and try again",requestTimeout:"Request timeout - please try again",apiError:"Failed to get results",validationError:"Please check your input values",sessionTimeout:"Your session has been idle for 30 minutes. Would you like to continue?",unsavedData:"You have unsaved data. Are you sure you want to leave?",nearestCentersTitle:"Nearest Stroke Centers",useCurrentLocation:"Use Current Location",enterLocationPlaceholder:"Enter city or address...",enterManually:"Enter Location Manually",search:"Search",yourLocation:"Your Location",recommendedCenters:"Recommended Centers",alternativeCenters:"Alternative Centers",noCentersFound:"No stroke centers found in this area",gettingLocation:"Getting your location",searchingLocation:"Searching location",locationError:"Unable to get your location",locationPermissionDenied:"Location access denied. Please allow location access and try again.",locationUnavailable:"Location information is unavailable",locationTimeout:"Location request timed out",geolocationNotSupported:"Geolocation is not supported by this browser",geocodingNotImplemented:"Location search not available. Please use GPS or enter coordinates manually.",tryManualEntry:"Try entering your location manually or use GPS.",distanceNote:"Distances are calculated as straight-line distances. Actual travel times may vary.",comprehensiveCenter:"Comprehensive Stroke Center",primaryCenter:"Primary Stroke Center",telemetryCenter:"Telemedicine Center",thrombectomy:"Thrombectomy",neurosurgery:"Neurosurgery",icu:"Intensive Care",telemedicine:"Telemedicine",stroke_unit:"Stroke Unit",call:"Call",directions:"Directions",emergency:"Emergency",certified:"Certified"},de:{appTitle:"Schlaganfall-Triage-Assistent",emergencyBadge:"Notfall-Tool",helpButton:"Hilfe und Anweisungen",darkModeButton:"Dunklen Modus umschalten",languageToggle:"Sprache",step1:"Erstbeurteilung",step2:"Datenerhebung",step3:"Ergebnisse",triage1Title:"Patientenbeurteilung",triage1Question:"Ist der Patient komatös?",triage1Help:"Glasgow Coma Scale < 8",triage1Yes:"JA - Komatös",triage1No:"NEIN - Bei Bewusstsein",triage2Title:"Untersuchungsfähigkeit",triage2Question:"Kann der Patient zuverlässig untersucht werden?",triage2Help:"Patient ist nicht aphasisch, verwirrt oder unkooperativ",triage2Yes:"JA - Vollständige Untersuchung möglich",triage2No:"NEIN - Nur begrenzte Untersuchung",ageLabel:"Alter (Jahre)",ageHelp:"Patientenalter in Jahren",systolicLabel:"Systolischer RR (mmHg)",systolicHelp:"Systolischer Blutdruck",diastolicLabel:"Diastolischer RR (mmHg)",diastolicHelp:"Diastolischer Blutdruck",gfapLabel:"GFAP-Wert (pg/mL)",gfapHelp:"GFAP-Biomarker-Wert",fastEdLabel:"FAST-ED-Score",fastEdHelp:"FAST-ED-Bewertungsscore (0-9)",headacheLabel:"Kopfschmerzen",vigilanzLabel:"Bewusstseinstrübung",armPareseLabel:"Armschwäche",beinPareseLabel:"Beinschwäche",eyeDeviationLabel:"Blickdeviation",atrialFibLabel:"Vorhofflimmern",anticoagLabel:"Antikoaguliert (NOAK)",antiplateletsLabel:"Thrombozytenaggregationshemmer",analyzeButton:"Analysieren",analyzing:"Analysiere...",printResults:"Ergebnisse drucken",newAssessment:"Neue Bewertung starten",resultsTitle:"Bewertungsergebnisse",ichProbability:"ICB-Wahrscheinlichkeit",lvoProbability:"LVO-Wahrscheinlichkeit",riskLevel:"Risikostufe",riskLow:"Niedrig",riskModerate:"Mäßig",riskHigh:"Hoch",riskCritical:"Kritisch",driversTitle:"Modelltreiber",driversSubtitle:"Faktoren, die zur Vorhersage beitragen",ichDrivers:"ICB-Risikofaktoren",lvoDrivers:"LVO-Risikofaktoren",criticalAlertTitle:"KRITISCHES RISIKO ERKANNT",criticalAlertMessage:"Hohe Wahrscheinlichkeit einer intrazerebralen Blutung erkannt. Sofortige medizinische Behandlung erforderlich.",helpTitle:"Kurzreferenzleitfaden",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 8: Komatöser Patient - Koma-Modul verwenden",gcsMod:"GCS 8-12: Mäßige Beeinträchtigung",gcsHigh:"GCS 13-15: Leichte Beeinträchtigung",fastEdTitle:"FAST-ED-Score-Komponenten",fastEdFacial:"Faziale Parese: 0-1 Punkte",fastEdArm:"Armschwäche: 0-2 Punkte",fastEdSpeech:"Sprachveränderungen: 0-2 Punkte",fastEdTime:"Zeit: Kritischer Faktor",fastEdEye:"Blickdeviation: 0-2 Punkte",fastEdDenial:"Verneinung/Neglect: 0-2 Punkte",criticalValuesTitle:"Kritische Werte",criticalBp:"Systolischer RR > 180: Erhöhtes ICB-Risiko",criticalGfap:"GFAP > 500 pg/mL: Signifikanter Marker",criticalFastEd:"FAST-ED ≥ 4: LVO in Betracht ziehen",disclaimer:"Klinischer Haftungsausschluss",disclaimerText:"Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle. Kein Ersatz für ärztliche Beurteilung.",importantNote:"Wichtig",importantText:"Diese Ergebnisse dienen nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie institutionelle Protokolle.",privacyLink:"Datenschutzrichtlinie",disclaimerLink:"Medizinischer Haftungsausschluss",versionLink:"Version 2.0.1",privacyPolicy:"Datenschutzrichtlinie: Dieses Tool verarbeitet Daten lokal. Keine Patientendaten werden gespeichert oder übertragen.",medicalDisclaimer:"Medizinischer Haftungsausschluss: Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle.",networkError:"Netzwerkfehler - bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut",requestTimeout:"Anfrage-Timeout - bitte versuchen Sie es erneut",apiError:"Ergebnisse konnten nicht abgerufen werden",validationError:"Bitte überprüfen Sie Ihre Eingabewerte",sessionTimeout:"Ihre Sitzung war 30 Minuten lang inaktiv. Möchten Sie fortfahren?",unsavedData:"Sie haben ungespeicherte Daten. Sind Sie sicher, dass Sie verlassen möchten?",nearestCentersTitle:"Nächstgelegene Schlaganfall-Zentren",useCurrentLocation:"Aktuellen Standort verwenden",enterLocationPlaceholder:"Stadt oder Adresse eingeben...",enterManually:"Standort manuell eingeben",search:"Suchen",yourLocation:"Ihr Standort",recommendedCenters:"Empfohlene Zentren",alternativeCenters:"Alternative Zentren",noCentersFound:"Keine Schlaganfall-Zentren in diesem Bereich gefunden",gettingLocation:"Standort wird ermittelt",searchingLocation:"Standort wird gesucht",locationError:"Standort konnte nicht ermittelt werden",locationPermissionDenied:"Standortzugriff verweigert. Bitte erlauben Sie Standortzugriff und versuchen Sie es erneut.",locationUnavailable:"Standortinformationen sind nicht verfügbar",locationTimeout:"Standortanfrage ist abgelaufen",geolocationNotSupported:"Geolokalisierung wird von diesem Browser nicht unterstützt",geocodingNotImplemented:"Standortsuche nicht verfügbar. Bitte verwenden Sie GPS oder geben Sie Koordinaten manuell ein.",tryManualEntry:"Versuchen Sie, Ihren Standort manuell einzugeben oder GPS zu verwenden.",distanceNote:"Entfernungen werden als Luftlinie berechnet. Tatsächliche Fahrzeiten können variieren.",comprehensiveCenter:"Überregionales Schlaganfall-Zentrum",primaryCenter:"Regionales Schlaganfall-Zentrum",telemetryCenter:"Telemedizin-Zentrum",thrombectomy:"Thrombektomie",neurosurgery:"Neurochirurgie",icu:"Intensivstation",telemedicine:"Telemedizin",stroke_unit:"Stroke Unit",call:"Anrufen",directions:"Wegbeschreibung",emergency:"Notfall",certified:"Zertifiziert"}};class F{constructor(){this.supportedLanguages=["en","de"],this.currentLanguage=this.detectLanguage()}detectLanguage(){const t=localStorage.getItem("language");return t&&this.supportedLanguages.includes(t)?t:(navigator.language||navigator.userLanguage).substring(0,2).toLowerCase()==="de"?"de":"en"}getCurrentLanguage(){return this.currentLanguage}setLanguage(t){return this.supportedLanguages.includes(t)?(this.currentLanguage=t,localStorage.setItem("language",t),window.dispatchEvent(new CustomEvent("languageChanged",{detail:{language:t}})),!0):!1}getSupportedLanguages(){return[...this.supportedLanguages]}t(t){return(_[this.currentLanguage]||_.en)[t]||t}toggleLanguage(){const t=this.currentLanguage==="en"?"de":"en";return this.setLanguage(t)}getLanguageDisplayName(t=null){const e=t||this.currentLanguage;return{en:"English",de:"Deutsch"}[e]||e}formatDateTime(t){const e=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(e,{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(t)}formatTime(t){const e=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(e,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(t)}}const S=new F,o=i=>S.t(i);function I(){return`
    <div class="container">
      ${v(1)}
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
  `}function R(){return`
    <div class="container">
      ${v(1)}
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
  `}const f={COMA_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_coma_ich",LDM_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_limited_data_ich",FULL_STROKE:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_full_stroke"},L={ich:{high:60,critical:80},lvo:{high:50,critical:70}},g={min:29,max:10001},w={autoSaveInterval:3e4,sessionTimeout:30*60*1e3,requestTimeout:1e4},N={age_years:{required:!0,min:0,max:120},systolic_bp:{required:!0,min:60,max:300},diastolic_bp:{required:!0,min:30,max:200},gfap_value:{required:!0,min:g.min,max:g.max},fast_ed_score:{required:!0,min:0,max:9}};function H(){return`
    <div class="container">
      ${v(2)}
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
            <input type="number" id="gfap_value" name="gfap_value" min="${g.min}" max="${g.max}" step="0.1" required aria-describedby="gfap-help">
            <div id="gfap-help" class="input-help">
              Range: ${g.min} - ${g.max} pg/mL
            </div>
          </div>
        </div>
        <button type="submit" class="primary">Analyze ICH Risk</button>
        <button type="button" class="secondary" data-action="reset">Start Over</button>
      </form>
    </div>
  `}function z(){return`
    <div class="container">
      ${v(2)}
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
            <input type="number" name="gfap_value" id="gfap_value" min="${g.min}" max="${g.max}" step="0.1" required>
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
  `}function G(){return`
    <div class="container">
      ${v(2)}
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
            <input type="number" name="gfap_value" id="gfap_value" min="${g.min}" max="${g.max}" step="0.1" required>
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
  `}function O(){return`
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
  `}function U(i){return!i||typeof i!="object"?{kind:"unavailable",units:null,positive:[],negative:[],meta:{}}:i.kind?i:i.shap_values||i.kind&&i.kind==="shap_values"?q(i):i.logistic_contributions||i.kind&&i.kind==="logistic_contributions"?K(i):j(i)?V(i):{kind:"unavailable",units:null,positive:[],negative:[],meta:{}}}function q(i){const t=i.shap_values||i,e=[];Array.isArray(t)?t.forEach((s,c)=>{typeof s=="object"&&s.feature&&s.value!==void 0?e.push({label:s.feature,weight:s.value}):typeof s=="number"&&e.push({label:`Feature ${c}`,weight:s})}):typeof t=="object"&&Object.entries(t).forEach(([s,c])=>{typeof c=="number"&&e.push({label:s,weight:c})}),e.sort((s,c)=>Math.abs(c.weight)-Math.abs(s.weight));const n=e.filter(s=>s.weight>0),a=e.filter(s=>s.weight<0),r={};return i.base_value!==void 0&&(r.base_value=i.base_value),i.contrib_sum!==void 0&&(r.contrib_sum=i.contrib_sum),i.logit_total!==void 0&&(r.logit_total=i.logit_total),{kind:"shap_values",units:"logit",positive:n,negative:a,meta:r}}function K(i){const t=i.logistic_contributions||i,e=[];typeof t=="object"&&Object.entries(t).forEach(([s,c])=>{typeof c=="number"&&!["intercept","contrib_sum","logit_total"].includes(s)&&e.push({label:s,weight:c})}),e.sort((s,c)=>Math.abs(c.weight)-Math.abs(s.weight));const n=e.filter(s=>s.weight>0),a=e.filter(s=>s.weight<0),r={};return t.intercept!==void 0&&(r.base_value=t.intercept),t.contrib_sum!==void 0&&(r.contrib_sum=t.contrib_sum),t.logit_total!==void 0&&(r.logit_total=t.logit_total),i.contrib_sum!==void 0&&(r.contrib_sum=i.contrib_sum),{kind:"logistic_contributions",units:"logit",positive:n,negative:a,meta:r}}function V(i){const t=[];Object.entries(i).forEach(([a,r])=>{typeof r=="number"&&t.push({label:a,weight:r})}),t.sort((a,r)=>Math.abs(r.weight)-Math.abs(a.weight));const e=t.filter(a=>a.weight>0),n=t.filter(a=>a.weight<0);return{kind:"raw_weights",units:null,positive:e,negative:n,meta:{}}}function j(i){return Object.values(i).every(t=>typeof t=="number")}function Y(i,t){if(!(i!=null&&i.drivers)&&!(t!=null&&t.drivers))return"";let e=`
    <div class="drivers-section">
      <h3>Prediction Drivers</h3>
      <div class="drivers-grid">
  `;return i!=null&&i.drivers&&(e+=$(i.drivers,"ICH","ich")),t!=null&&t.drivers&&!t.notPossible&&(e+=$(t.drivers,"LVO","lvo")),e+=`
      </div>
    </div>
  `,e}function $(i,t,e){if(!i||Object.keys(i).length===0)return`
      <div class="drivers-panel">
        <h4>
          <span class="driver-icon ${e}">${e==="ich"?"I":"L"}</span>
          ${t} Risk Factors
        </h4>
        <p style="color: var(--text-secondary); font-style: italic;">
          Driver information not available from this prediction model.
        </p>
      </div>
    `;const n=U(i);if(n.kind==="unavailable")return`
      <div class="drivers-panel">
        <h4>
          <span class="driver-icon ${e}">${e==="ich"?"I":"L"}</span>
          ${t} Risk Factors
        </h4>
        <p style="color: var(--text-secondary); font-style: italic;">
          Driver analysis not available for this prediction.
        </p>
      </div>
    `;let a=`
    <div class="drivers-panel">
      <h4>
        <span class="driver-icon ${e}">${e==="ich"?"I":"L"}</span>
        ${t} Risk Factors
      </h4>
  `;return n.positive.length>0&&n.positive.forEach(r=>{const s=Math.abs(r.weight*100),c=Math.min(s*2,100);a+=`
        <div class="driver-item">
          <span class="driver-label">${r.label}</span>
          <div class="driver-bar-container">
            <div class="driver-bar positive" style="width: ${c}%">
              <span class="driver-value">+${s.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      `}),n.negative.length>0&&n.negative.forEach(r=>{const s=Math.abs(r.weight*100),c=Math.min(s*2,100);a+=`
        <div class="driver-item">
          <span class="driver-label">${r.label}</span>
          <div class="driver-bar-container">
            <div class="driver-bar negative" style="width: ${c}%">
              <span class="driver-value">-${s.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      `}),n.meta&&Object.keys(n.meta).length>0&&(a+=`
      <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid var(--border-color);">
        <small style="color: var(--text-secondary);">
    `,n.meta.base_value!==void 0&&(a+=`Base value: ${n.meta.base_value.toFixed(2)} `),n.meta.contrib_sum!==void 0&&(a+=`Contrib sum: ${n.meta.contrib_sum.toFixed(2)} `),n.meta.logit_total!==void 0&&(a+=`Logit total: ${n.meta.logit_total.toFixed(2)}`),a+=`
        </small>
      </div>
    `),a+="</div>",a}const W=[{id:"uniklinik-freiburg",name:"Universitätsklinikum Freiburg",type:"comprehensive",address:"Hugstetter Str. 55, 79106 Freiburg im Breisgau",coordinates:{lat:48.0025,lng:7.8347},phone:"+49 761 270-0",emergency:"+49 761 270-34010",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"uniklinik-heidelberg",name:"Universitätsklinikum Heidelberg",type:"comprehensive",address:"Im Neuenheimer Feld 400, 69120 Heidelberg",coordinates:{lat:49.4178,lng:8.6706},phone:"+49 6221 56-0",emergency:"+49 6221 56-36643",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"uniklinik-tuebingen",name:"Universitätsklinikum Tübingen",type:"comprehensive",address:"Geissweg 3, 72076 Tübingen",coordinates:{lat:48.5378,lng:9.0538},phone:"+49 7071 29-0",emergency:"+49 7071 29-82211",services:["thrombectory","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"uniklinik-ulm",name:"Universitätsklinikum Ulm",type:"comprehensive",address:"Albert-Einstein-Allee 23, 89081 Ulm",coordinates:{lat:48.4196,lng:9.9592},phone:"+49 731 500-0",emergency:"+49 731 500-63001",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"klinikum-stuttgart",name:"Klinikum Stuttgart - Katharinenhospital",type:"comprehensive",address:"Kriegsbergstraße 60, 70174 Stuttgart",coordinates:{lat:48.7784,lng:9.1682},phone:"+49 711 278-0",emergency:"+49 711 278-32001",services:["thrombectomy","neurosurgery","icu"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"robert-bosch-stuttgart",name:"Robert-Bosch-Krankenhaus Stuttgart",type:"primary",address:"Auerbachstraße 110, 70376 Stuttgart",coordinates:{lat:48.7447,lng:9.2294},phone:"+49 711 8101-0",emergency:"+49 711 8101-3456",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"diakonie-stuttgart",name:"Diakonie-Klinikum Stuttgart",type:"primary",address:"Rosenbergstraße 38, 70176 Stuttgart",coordinates:{lat:48.7861,lng:9.1736},phone:"+49 711 991-0",emergency:"+49 711 991-2201",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"rkh-ludwigsburg",name:"RKH Klinikum Ludwigsburg",type:"primary",address:"Posilipostraße 4, 71640 Ludwigsburg",coordinates:{lat:48.8901,lng:9.1953},phone:"+49 7141 99-0",emergency:"+49 7141 99-67201",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-karlsruhe",name:"Städtisches Klinikum Karlsruhe",type:"comprehensive",address:"Moltkestraße 90, 76133 Karlsruhe",coordinates:{lat:49.0047,lng:8.3858},phone:"+49 721 974-0",emergency:"+49 721 974-2301",services:["thrombectomy","neurosurgery","icu"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"vincentius-karlsruhe",name:"ViDia Kliniken Karlsruhe - St. Vincentius",type:"primary",address:"Südendstraße 32, 76135 Karlsruhe",coordinates:{lat:48.9903,lng:8.3711},phone:"+49 721 8108-0",emergency:"+49 721 8108-9201",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-mannheim",name:"Universitätsmedizin Mannheim",type:"comprehensive",address:"Theodor-Kutzer-Ufer 1-3, 68167 Mannheim",coordinates:{lat:49.4828,lng:8.4664},phone:"+49 621 383-0",emergency:"+49 621 383-2251",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"theresienkrankenhaus-mannheim",name:"Theresienkrankenhaus Mannheim",type:"primary",address:"Bassermannstraße 1, 68165 Mannheim",coordinates:{lat:49.4904,lng:8.4594},phone:"+49 621 424-0",emergency:"+49 621 424-2101",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-pforzheim",name:"Helios Klinikum Pforzheim",type:"primary",address:"Kanzlerstraße 2-6, 75175 Pforzheim",coordinates:{lat:48.8833,lng:8.6936},phone:"+49 7231 969-0",emergency:"+49 7231 969-2301",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"zollernalb-klinikum",name:"Zollernalb Klinikum Albstadt",type:"primary",address:"Zollernring 10-14, 72488 Sigmaringen",coordinates:{lat:48.0878,lng:9.2233},phone:"+49 7571 100-0",emergency:"+49 7571 100-1501",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-konstanz",name:"Gesundheitsverbund Landkreis Konstanz",type:"primary",address:"Mainaustraße 14, 78464 Konstanz",coordinates:{lat:47.6779,lng:9.1732},phone:"+49 7531 801-0",emergency:"+49 7531 801-2301",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-friedrichshafen",name:"Klinikum Friedrichshafen",type:"primary",address:"Röntgenstraße 2, 88048 Friedrichshafen",coordinates:{lat:47.6587,lng:9.4685},phone:"+49 7541 96-0",emergency:"+49 7541 96-2401",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"oberschwabenklinik-ravensburg",name:"Oberschwabenklinik Ravensburg",type:"primary",address:"Elisabethenstraße 17, 88212 Ravensburg",coordinates:{lat:47.7815,lng:9.6078},phone:"+49 751 87-0",emergency:"+49 751 87-2201",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"alb-donau-klinikum",name:"Alb Donau Klinikum Ehingen",type:"primary",address:"Schwörhausgasse 7, 89584 Ehingen",coordinates:{lat:48.2833,lng:9.7262},phone:"+49 7391 789-0",emergency:"+49 7391 789-1801",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"ortenau-klinikum-offenburg",name:"Ortenau Klinikum Offenburg",type:"primary",address:"Ebertplatz 12, 77654 Offenburg",coordinates:{lat:48.4706,lng:7.9444},phone:"+49 781 472-0",emergency:"+49 781 472-2001",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-baden-baden",name:"Klinikum Mittelbaden Baden-Baden",type:"primary",address:"Balger Str. 50, 76532 Baden-Baden",coordinates:{lat:48.7606,lng:8.2275},phone:"+49 7221 91-0",emergency:"+49 7221 91-1701",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"}];function Z(i,t,e,n){const r=y(e-i),s=y(n-t),c=Math.sin(r/2)*Math.sin(r/2)+Math.cos(y(i))*Math.cos(y(e))*Math.sin(s/2)*Math.sin(s/2);return 6371*(2*Math.atan2(Math.sqrt(c),Math.sqrt(1-c)))}function y(i){return i*(Math.PI/180)}function J(i,t,e=5,n=100){return W.map(r=>({...r,distance:Z(i,t,r.coordinates.lat,r.coordinates.lng)})).filter(r=>r.distance<=n).sort((r,s)=>r.distance-s.distance).slice(0,e)}function Q(i,t,e="stroke"){const n=J(i,t,10);if(e==="lvo"||e==="thrombectomy"){const a=n.filter(s=>s.type==="comprehensive"&&s.services.includes("thrombectomy")),r=n.filter(s=>s.type==="primary");return{recommended:a.slice(0,3),alternative:r.slice(0,2)}}return{recommended:n.slice(0,5),alternative:[]}}function X(i){return`
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
  `}function ee(i){const t=document.getElementById("useGpsButton"),e=document.getElementById("manualLocationButton"),n=document.querySelector(".location-manual"),a=document.getElementById("locationInput"),r=document.getElementById("searchLocationButton"),s=document.getElementById("strokeCenterResults");t&&t.addEventListener("click",()=>{te(i,s)}),e&&e.addEventListener("click",()=>{n.style.display=n.style.display==="none"?"block":"none"}),r&&r.addEventListener("click",()=>{const c=a.value.trim();c&&M(c,i,s)}),a&&a.addEventListener("keypress",c=>{if(c.key==="Enter"){const m=a.value.trim();m&&M(m,i,s)}})}function te(i,t){if(!navigator.geolocation){E(o("geolocationNotSupported"),t);return}t.innerHTML=`<div class="loading">${o("gettingLocation")}...</div>`,navigator.geolocation.getCurrentPosition(e=>{const{latitude:n,longitude:a}=e.coords;ie(n,a,i,t)},e=>{let n=o("locationError");switch(e.code){case e.PERMISSION_DENIED:n=o("locationPermissionDenied");break;case e.POSITION_UNAVAILABLE:n=o("locationUnavailable");break;case e.TIMEOUT:n=o("locationTimeout");break}E(n,t)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:3e5})}async function M(i,t,e){e.innerHTML=`<div class="loading">${o("searchingLocation")}...</div>`,E(o("geocodingNotImplemented"),e)}function ie(i,t,e,n){const a=ne(e),r=Q(i,t,a),s=`
    <div class="location-info">
      <p><strong>${o("yourLocation")}:</strong> ${i.toFixed(4)}, ${t.toFixed(4)}</p>
    </div>
    
    <div class="recommended-centers">
      <h4>${o("recommendedCenters")}</h4>
      ${P(r.recommended,!0)}
    </div>
    
    ${r.alternative.length>0?`
      <div class="alternative-centers">
        <h4>${o("alternativeCenters")}</h4>
        ${P(r.alternative,!1)}
      </div>
    `:""}
    
    <div class="distance-note">
      <small>${o("distanceNote")}</small>
    </div>
  `;n.innerHTML=s}function P(i,t=!1){return!i||i.length===0?`<p>${o("noCentersFound")}</p>`:i.map(e=>`
    <div class="stroke-center-card ${t?"recommended":"alternative"}">
      <div class="center-header">
        <h5>${e.name}</h5>
        <span class="center-type ${e.type}">${o(e.type+"Center")}</span>
        <span class="distance">${e.distance.toFixed(1)} km</span>
      </div>
      
      <div class="center-details">
        <p class="address">📍 ${e.address}</p>
        <p class="phone">📞 ${o("emergency")}: ${e.emergency}</p>
        
        <div class="services">
          ${e.services.map(n=>`
            <span class="service-badge">${o(n)}</span>
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
  `).join("")}function ne(i){return i?i.lvo&&i.lvo.probability>.5?"lvo":i.ich&&i.ich.probability>.6?"ich":"stroke":"stroke"}function E(i,t){t.innerHTML=`
    <div class="location-error">
      <p>⚠️ ${i}</p>
      <p><small>${o("tryManualEntry")}</small></p>
    </div>
  `}function x(i,t){const e=Number(i),n=L[t];return e>=n.critical?"🔴 CRITICAL RISK":e>=n.high?"🟠 HIGH RISK":e>=30?"🟡 MODERATE RISK":"🟢 LOW RISK"}function ae(i,t){const{ich:e,lvo:n}=i;let a="",r="";if(e){const l=Math.round((e.probability||0)*100);a=`
      <div class="result-card ${l>L.ich.critical?"critical":"ich"}">
        <h3> 🧠 ${o("ichProbability")} <small>(${e.module} Module)</small> </h3>
        <div class="probability-display">${l}%</div>
        <div class="probability-meter">
          <div class="probability-fill" style="width: ${l}%"></div>
          <div class="probability-marker" style="left: ${l}%">${l}%</div>
        </div>
        <p><strong>${o("riskLevel")}:</strong> ${x(l,"ich")}</p>
      </div>
    `}if(n)if(n.notPossible)r=`
        <div class="result-card info">
          <h3>🔍 ${o("lvoProbability")}</h3>
          <p>LVO assessment not possible with limited data.</p>
          <p>A full neurological examination is required for LVO screening.</p>
        </div>
      `;else{const l=Math.round((n.probability||0)*100);r=`
        <div class="result-card ${l>L.lvo.critical?"critical":"lvo"}">
          <h3> 🩸 ${o("lvoProbability")} <small>(${n.module} Module)</small> </h3>
          <div class="probability-display">${l}%</div>
          <div class="probability-meter">
            <div class="probability-fill" style="width: ${l}%"></div>
            <div class="probability-marker" style="left: ${l}%">${l}%</div>
          </div>
          <p><strong>${o("riskLevel")}:</strong> ${x(l,"lvo")}</p>
        </div>
      `}const s=e&&e.probability>.6?O():"",c=Y(e,n),m=X();return`
    <div class="container">
      ${v(3)}
      <h2>${o("resultsTitle")}</h2>
      ${s}
      <div style="display: flex; flex-direction: column; gap: 20px;">
        ${a}
        ${r}
      </div>
      ${c}
      ${m}
      <button type="button" class="primary" id="printResults"> 📄 ${o("printResults")} </button>
      <button type="button" class="secondary" data-action="reset"> ${o("newAssessment")} </button>
      <div class="disclaimer">
        <strong>⚠️ ${o("importantNote")}:</strong> ${o("importantText")} Results generated at ${new Date().toLocaleTimeString()}.
      </div>
    </div>
  `}function re(i,t,e){const n=[];return e.required&&!t&&t!==0&&n.push("This field is required"),e.min!==void 0&&t!==""&&!isNaN(t)&&parseFloat(t)<e.min&&n.push(`Value must be at least ${e.min}`),e.max!==void 0&&t!==""&&!isNaN(t)&&parseFloat(t)>e.max&&n.push(`Value must be at most ${e.max}`),e.pattern&&!e.pattern.test(t)&&n.push("Invalid format"),n}function se(i){let t=!0;const e={};return Object.entries(N).forEach(([n,a])=>{const r=i.elements[n];if(r){const s=re(n,r.value,a);s.length>0&&(e[n]=s,t=!1)}}),{isValid:t,validationErrors:e}}function oe(i,t){Object.entries(t).forEach(([e,n])=>{const a=i.querySelector(`[name="${e}"]`);if(a){const r=a.closest(".input-group");if(r){r.classList.add("error"),r.querySelectorAll(".error-message").forEach(c=>c.remove());const s=document.createElement("div");s.className="error-message",s.innerHTML=`<span class="error-icon">⚠️</span> ${n[0]}`,r.appendChild(s)}}})}function le(i){i.querySelectorAll(".input-group.error").forEach(t=>{t.classList.remove("error"),t.querySelectorAll(".error-message").forEach(e=>e.remove())})}class p extends Error{constructor(t,e,n){super(t),this.name="APIError",this.status=e,this.url=n}}function T(i){const t={...i};return Object.keys(t).forEach(e=>{const n=t[e];(typeof n=="boolean"||n==="on"||n==="true"||n==="false")&&(t[e]=n===!0||n==="on"||n==="true"?1:0)}),t}function h(i,t=0){const e=parseFloat(i);return isNaN(e)?t:e}async function D(i,t){const e=new AbortController,n=setTimeout(()=>e.abort(),w.requestTimeout);try{const a=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(t),signal:e.signal,mode:"cors"});if(clearTimeout(n),!a.ok){let s=`HTTP ${a.status}`;try{const c=await a.json();s=c.error||c.message||s}catch{s=`${s}: ${a.statusText}`}throw new p(s,a.status,i)}return await a.json()}catch(a){throw clearTimeout(n),a.name==="AbortError"?new p("Request timeout - please try again",408,i):a instanceof p?a:new p("Network error - please check your connection and try again",0,i)}}async function ce(i){const t=T(i);try{const e=await D(f.COMA_ICH,t);return console.log("Coma ICH API Response:",e),{probability:h(e.probability||e.ich_probability,0),drivers:e.drivers||null,confidence:h(e.confidence,.75),module:"Coma"}}catch(e){throw console.error("Coma ICH prediction failed:",e),new p(`Failed to get ICH prediction: ${e.message}`,e.status,f.COMA_ICH)}}async function de(i){const t=T(i);try{const e=await D(f.LDM_ICH,t);return console.log("Limited Data ICH API Response:",e),{probability:h(e.probability||e.ich_probability,0),drivers:e.drivers||null,confidence:h(e.confidence,.65),module:"Limited Data"}}catch(e){throw console.error("Limited Data ICH prediction failed:",e),new p(`Failed to get ICH prediction: ${e.message}`,e.status,f.LDM_ICH)}}async function ue(i){var n,a,r,s,c,m;const t={age_years:i.age_years,systolic_bp:i.systolic_bp,diastolic_bp:i.diastolic_bp,gfap_value:i.gfap_value,fast_ed_score:i.fast_ed_score,headache:i.headache||0,vigilanzminderung:i.vigilanzminderung||0,armparese:i.armparese||0,beinparese:i.beinparese||0,eye_deviation:i.eye_deviation||0,atrial_fibrillation:i.atrial_fibrillation||0,anticoagulated_noak:i.anticoagulated_noak||0,antiplatelets:i.antiplatelets||0},e=T(t);try{const l=await D(f.FULL_STROKE,e);console.log("Full Stroke API Response:",l);const u={probability:h(l.ich_probability||((n=l.ich)==null?void 0:n.probability),0),drivers:l.ich_drivers||((a=l.ich)==null?void 0:a.drivers)||null,confidence:h(l.ich_confidence||((r=l.ich)==null?void 0:r.confidence),.85),module:"Full Stroke"},b={probability:h(l.lvo_probability||((s=l.lvo)==null?void 0:s.probability),0),drivers:l.lvo_drivers||((c=l.lvo)==null?void 0:c.drivers)||null,confidence:h(l.lvo_confidence||((m=l.lvo)==null?void 0:m.confidence),.85),module:"Full Stroke"};return{ich:u,lvo:b}}catch(l){throw console.error("Full Stroke prediction failed:",l),new p(`Failed to get stroke predictions: ${l.message}`,l.status,f.FULL_STROKE)}}function me(i){d.logEvent("triage1_answer",{comatose:i}),C(i?"coma":"triage2")}function ge(i){d.logEvent("triage2_answer",{examinable:i}),C(i?"full":"limited")}function C(i){d.logEvent("navigate",{from:d.getState().currentScreen,to:i}),d.navigate(i),window.scrollTo(0,0)}function pe(){d.hasUnsavedData()&&!confirm("Are you sure you want to start over? All entered data will be lost.")||(d.logEvent("reset"),d.reset())}async function he(i,t){i.preventDefault();const e=i.target,n=e.dataset.module,a=se(e);if(!a.isValid){oe(t,a.validationErrors);return}const r=new FormData(e),s={};r.forEach((l,u)=>{const b=e.elements[u];if(b&&b.type==="checkbox")s[u]=b.checked;else{const A=parseFloat(l);s[u]=isNaN(A)?l:A}}),d.setFormData(n,s);const c=e.querySelector("button[type=submit]"),m=c?c.innerHTML:"";c&&(c.disabled=!0,c.innerHTML=`<span class="loading-spinner"></span> ${o("analyzing")}`);try{let l;switch(n){case"coma":l={ich:await ce(s),lvo:null};break;case"limited":l={ich:await de(s),lvo:{notPossible:!0}};break;case"full":l=await ue(s);break;default:throw new Error("Unknown module: "+n)}d.setResults(l),d.logEvent("models_complete",{module:n,results:l}),C("results")}catch(l){console.error("Error running models:",l);let u="An error occurred during analysis. Please try again.";l instanceof p&&(u=l.message),be(t,u),c&&(c.disabled=!1,c.innerHTML=m)}}function be(i,t){i.querySelectorAll(".critical-alert").forEach(a=>{var r,s;(s=(r=a.querySelector("h4"))==null?void 0:r.textContent)!=null&&s.includes("Error")&&a.remove()});const e=document.createElement("div");e.className="critical-alert",e.innerHTML=`<h4><span class="alert-icon">⚠️</span> Error</h4><p>${t}</p>`;const n=i.querySelector(".container");n?n.prepend(e):i.prepend(e),setTimeout(()=>e.remove(),1e4)}function fe(i){const t=document.createElement("div");t.className="sr-only",t.setAttribute("role","status"),t.setAttribute("aria-live","polite");const e={triage1:"Coma assessment",triage2:"Examination capability assessment",coma:"Coma module",limited:"Limited data module",full:"Full stroke assessment",results:"Assessment results"};t.textContent=`Navigated to ${e[i]||i}`,document.body.appendChild(t),setTimeout(()=>t.remove(),1e3)}function ve(i){const t={triage1:"Initial Assessment - Stroke Triage Assistant",triage2:"Examination Capability - Stroke Triage Assistant",coma:"Coma Module - Stroke Triage Assistant",limited:"Limited Data Module - Stroke Triage Assistant",full:"Full Stroke Module - Stroke Triage Assistant",results:"Assessment Results - Stroke Triage Assistant"};document.title=t[i]||"Stroke Triage Assistant"}function ye(){setTimeout(()=>{const i=document.querySelector("h2");i&&(i.setAttribute("tabindex","-1"),i.focus(),setTimeout(()=>i.removeAttribute("tabindex"),100))},100)}function k(i){const t=d.getState(),{currentScreen:e,results:n,startTime:a}=t;i.innerHTML="";let r="";switch(e){case"triage1":r=I();break;case"triage2":r=R();break;case"coma":r=H();break;case"limited":r=z();break;case"full":r=G();break;case"results":r=ae(n);break;default:r=I()}i.innerHTML=r;const s=i.querySelector("form[data-module]");if(s){const c=s.dataset.module;ke(s,c)}Se(i),e==="results"&&n&&setTimeout(()=>{ee(n)},100),fe(e),ve(e),ye()}function ke(i,t){const e=d.getFormData(t);!e||Object.keys(e).length===0||Object.entries(e).forEach(([n,a])=>{const r=i.elements[n];r&&(r.type==="checkbox"?r.checked=a===!0||a==="on"||a==="true":r.value=a)})}function Se(i){i.querySelectorAll('input[type="number"]').forEach(e=>{e.addEventListener("blur",()=>{le(i)})}),i.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",n=>{const{action:a,value:r}=n.currentTarget.dataset,s=r==="true";switch(a){case"triage1":me(s);break;case"triage2":ge(s);break;case"reset":pe();break}})}),i.querySelectorAll("form[data-module]").forEach(e=>{e.addEventListener("submit",n=>{he(n,i)})});const t=i.querySelector("#printResults");t&&t.addEventListener("click",()=>window.print())}class Le{constructor(){this.container=null,this.unsubscribe=null}async init(){if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",()=>this.init());return}if(this.container=document.getElementById("appContainer"),!this.container){console.error("App container not found");return}this.unsubscribe=d.subscribe(()=>{k(this.container)}),window.addEventListener("languageChanged",()=>{this.updateUILanguage(),k(this.container)}),this.setupGlobalEventListeners(),this.initializeTheme(),this.updateUILanguage(),this.startAutoSave(),this.setupSessionTimeout(),this.setCurrentYear(),k(this.container),console.log("Stroke Triage Assistant initialized")}setupGlobalEventListeners(){const t=document.getElementById("languageToggle");t&&t.addEventListener("click",()=>this.toggleLanguage());const e=document.getElementById("darkModeToggle");e&&e.addEventListener("click",()=>this.toggleDarkMode()),this.setupHelpModal(),this.setupFooterLinks(),document.addEventListener("keydown",n=>{if(n.key==="Escape"){const a=document.getElementById("helpModal");a&&a.classList.contains("show")&&(a.classList.remove("show"),a.setAttribute("aria-hidden","true"))}}),window.addEventListener("beforeunload",n=>{d.hasUnsavedData()&&(n.preventDefault(),n.returnValue="You have unsaved data. Are you sure you want to leave?")})}setupHelpModal(){const t=document.getElementById("helpButton"),e=document.getElementById("helpModal"),n=e==null?void 0:e.querySelector(".modal-close");t&&e&&(t.addEventListener("click",()=>{e.classList.add("show"),e.setAttribute("aria-hidden","false")}),n==null||n.addEventListener("click",()=>{e.classList.remove("show"),e.setAttribute("aria-hidden","true")}),e.addEventListener("click",a=>{a.target===e&&(e.classList.remove("show"),e.setAttribute("aria-hidden","true"))}))}setupFooterLinks(){var t,e;(t=document.getElementById("privacyLink"))==null||t.addEventListener("click",n=>{n.preventDefault(),this.showPrivacyPolicy()}),(e=document.getElementById("disclaimerLink"))==null||e.addEventListener("click",n=>{n.preventDefault(),this.showDisclaimer()})}initializeTheme(){const t=localStorage.getItem("theme"),e=document.getElementById("darkModeToggle");(t==="dark"||!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)&&(document.body.classList.add("dark-mode"),e&&(e.textContent="☀️"))}toggleLanguage(){S.toggleLanguage(),this.updateUILanguage()}updateUILanguage(){document.documentElement.lang=S.getCurrentLanguage();const t=document.querySelector(".app-header h1");t&&(t.textContent=o("appTitle"));const e=document.querySelector(".emergency-badge");e&&(e.textContent=o("emergencyBadge"));const n=document.getElementById("languageToggle");n&&(n.title=o("languageToggle"),n.setAttribute("aria-label",o("languageToggle")));const a=document.getElementById("helpButton");a&&(a.title=o("helpButton"),a.setAttribute("aria-label",o("helpButton")));const r=document.getElementById("darkModeToggle");r&&(r.title=o("darkModeButton"),r.setAttribute("aria-label",o("darkModeButton")));const s=document.getElementById("modalTitle");s&&(s.textContent=o("helpTitle"))}toggleDarkMode(){const t=document.getElementById("darkModeToggle");document.body.classList.toggle("dark-mode");const e=document.body.classList.contains("dark-mode");t&&(t.textContent=e?"☀️":"🌙"),localStorage.setItem("theme",e?"dark":"light")}startAutoSave(){setInterval(()=>{this.saveCurrentFormData()},w.autoSaveInterval)}saveCurrentFormData(){this.container.querySelectorAll("form[data-module]").forEach(e=>{const n=new FormData(e),a=e.dataset.module;if(a){const r={};n.forEach((m,l)=>{const u=e.elements[l];u&&u.type==="checkbox"?r[l]=u.checked:r[l]=m});const s=d.getFormData(a);JSON.stringify(s)!==JSON.stringify(r)&&d.setFormData(a,r)}})}setupSessionTimeout(){setTimeout(()=>{confirm("Your session has been idle for 30 minutes. Would you like to continue?")?this.setupSessionTimeout():d.reset()},w.sessionTimeout)}setCurrentYear(){const t=document.getElementById("currentYear");t&&(t.textContent=new Date().getFullYear())}showPrivacyPolicy(){alert("Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.")}showDisclaimer(){alert("Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.")}destroy(){this.unsubscribe&&this.unsubscribe()}}const we=new Le;we.init();
//# sourceMappingURL=index-r407y-pj.js.map
