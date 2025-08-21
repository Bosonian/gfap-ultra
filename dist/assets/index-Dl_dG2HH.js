(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function e(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(n){if(n.ep)return;n.ep=!0;const s=e(n);fetch(n.href,s)}})();class B{constructor(){this.state={currentScreen:"triage1",results:null,sessionId:null,startTime:null,formData:{},validationErrors:{}},this.listeners=new Set,this.initialize()}initialize(){this.state.sessionId=this.generateSessionId(),this.state.startTime=Date.now(),console.log("Store initialized with session:",this.state.sessionId)}generateSessionId(){return"session_"+Date.now()+"_"+Math.random().toString(36).substr(2,9)}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}notify(){this.listeners.forEach(t=>t(this.state))}getState(){return{...this.state}}setState(t){this.state={...this.state,...t},this.notify()}navigate(t){console.log(`Navigating from ${this.state.currentScreen} to ${t}`),this.setState({currentScreen:t})}setFormData(t,e){const a={...this.state.formData};a[t]={...e},this.setState({formData:a})}getFormData(t){return this.state.formData[t]||{}}setValidationErrors(t){this.setState({validationErrors:t})}clearValidationErrors(){this.setState({validationErrors:{}})}setResults(t){this.setState({results:t})}hasUnsavedData(){return Object.keys(this.state.formData).length>0&&!this.state.results}reset(){const t={currentScreen:"triage1",results:null,sessionId:this.generateSessionId(),startTime:Date.now(),formData:{},validationErrors:{}};this.setState(t),console.log("Store reset with new session:",t.sessionId)}logEvent(t,e={}){const a={timestamp:Date.now(),session:this.state.sessionId,event:t,data:e};console.log("Event:",a)}getSessionDuration(){return Date.now()-this.state.startTime}}const d=new B;function f(i){const t=[{id:1,label:"Triage"},{id:2,label:"Assessment"},{id:3,label:"Results"}];let e='<div class="progress-indicator">';return t.forEach((a,n)=>{const s=a.id===i,r=a.id<i;e+=`
      <div class="progress-step ${s?"active":""} ${r?"completed":""}">
        ${r?"":a.id}
      </div>
    `,n<t.length-1&&(e+=`<div class="progress-line ${r?"completed":""}"></div>`)}),e+="</div>",e}function A(){return`
    <div class="container">
      ${f(1)}
      <h2>Initial Assessment</h2>
      <p class="subtitle">Emergency Stroke Triage Protocol</p>
      <div class="triage-question">
        Is the patient comatose?
        <small>Glasgow Coma Scale &lt; 8</small>
      </div>
      <div class="triage-buttons">
        <button class="yes-btn" data-action="triage1" data-value="true">YES - Comatose</button>
        <button class="no-btn" data-action="triage1" data-value="false">NO - Conscious</button>
      </div>
    </div>
  `}function F(){return`
    <div class="container">
      ${f(1)}
      <h2>Examination Capability</h2>
      <p class="subtitle">Determine Assessment Module</p>
      <div class="triage-question">
        Can the patient be reliably examined?
        <small>Patient is not aphasic, confused, or uncooperative</small>
      </div>
      <div class="triage-buttons">
        <button class="yes-btn" data-action="triage2" data-value="true">YES - Full Exam Possible</button>
        <button class="no-btn" data-action="triage2" data-value="false">NO - Limited Exam Only</button>
      </div>
    </div>
  `}const b={COMA_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_coma_ich",LDM_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_limited_data_ich",FULL_STROKE:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_full_stroke"},k={ich:{high:60,critical:80},lvo:{high:50,critical:70}},g={min:29,max:10001},S={autoSaveInterval:3e4,sessionTimeout:30*60*1e3,requestTimeout:1e4},R={age_years:{required:!0,min:0,max:120},systolic_bp:{required:!0,min:60,max:300},diastolic_bp:{required:!0,min:30,max:200},gfap_value:{required:!0,min:g.min,max:g.max},fast_ed_score:{required:!0,min:0,max:9}};function H(){return`
    <div class="container">
      ${f(2)}
      <h2>Coma Module</h2>
      <p class="subtitle">ICH Risk Assessment for Comatose Patients</p>
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
  `}function N(){return`
    <div class="container">
      ${f(2)}
      <h2>Limited Data Module</h2>
      <p class="subtitle">ICH Risk Assessment with Limited Examination</p>
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
  `}function z(){return`
    <div class="container">
      ${f(2)}
      <h2>Full Stroke Module</h2>
      <p class="subtitle">Complete ICH and LVO Risk Assessment</p>
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
  `}function G(){return`
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
  `}function O(i){return!i||typeof i!="object"?{kind:"unavailable",units:null,positive:[],negative:[],meta:{}}:i.kind?i:i.shap_values||i.kind&&i.kind==="shap_values"?U(i):i.logistic_contributions||i.kind&&i.kind==="logistic_contributions"?q(i):V(i)?K(i):{kind:"unavailable",units:null,positive:[],negative:[],meta:{}}}function U(i){const t=i.shap_values||i,e=[];Array.isArray(t)?t.forEach((r,o)=>{typeof r=="object"&&r.feature&&r.value!==void 0?e.push({label:r.feature,weight:r.value}):typeof r=="number"&&e.push({label:`Feature ${o}`,weight:r})}):typeof t=="object"&&Object.entries(t).forEach(([r,o])=>{typeof o=="number"&&e.push({label:r,weight:o})}),e.sort((r,o)=>Math.abs(o.weight)-Math.abs(r.weight));const a=e.filter(r=>r.weight>0),n=e.filter(r=>r.weight<0),s={};return i.base_value!==void 0&&(s.base_value=i.base_value),i.contrib_sum!==void 0&&(s.contrib_sum=i.contrib_sum),i.logit_total!==void 0&&(s.logit_total=i.logit_total),{kind:"shap_values",units:"logit",positive:a,negative:n,meta:s}}function q(i){const t=i.logistic_contributions||i,e=[];typeof t=="object"&&Object.entries(t).forEach(([r,o])=>{typeof o=="number"&&!["intercept","contrib_sum","logit_total"].includes(r)&&e.push({label:r,weight:o})}),e.sort((r,o)=>Math.abs(o.weight)-Math.abs(r.weight));const a=e.filter(r=>r.weight>0),n=e.filter(r=>r.weight<0),s={};return t.intercept!==void 0&&(s.base_value=t.intercept),t.contrib_sum!==void 0&&(s.contrib_sum=t.contrib_sum),t.logit_total!==void 0&&(s.logit_total=t.logit_total),i.contrib_sum!==void 0&&(s.contrib_sum=i.contrib_sum),{kind:"logistic_contributions",units:"logit",positive:a,negative:n,meta:s}}function K(i){const t=[];Object.entries(i).forEach(([n,s])=>{typeof s=="number"&&t.push({label:n,weight:s})}),t.sort((n,s)=>Math.abs(s.weight)-Math.abs(n.weight));const e=t.filter(n=>n.weight>0),a=t.filter(n=>n.weight<0);return{kind:"raw_weights",units:null,positive:e,negative:a,meta:{}}}function V(i){return Object.values(i).every(t=>typeof t=="number")}function j(i,t){if(!(i!=null&&i.drivers)&&!(t!=null&&t.drivers))return"";let e=`
    <div class="drivers-section">
      <h3>Prediction Drivers</h3>
      <div class="drivers-grid">
  `;return i!=null&&i.drivers&&(e+=_(i.drivers,"ICH","ich")),t!=null&&t.drivers&&!t.notPossible&&(e+=_(t.drivers,"LVO","lvo")),e+=`
      </div>
    </div>
  `,e}function _(i,t,e){if(!i||Object.keys(i).length===0)return`
      <div class="drivers-panel">
        <h4>
          <span class="driver-icon ${e}">${e==="ich"?"I":"L"}</span>
          ${t} Risk Factors
        </h4>
        <p style="color: var(--text-secondary); font-style: italic;">
          Driver information not available from this prediction model.
        </p>
      </div>
    `;const a=O(i);if(a.kind==="unavailable")return`
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
  `;return a.positive.length>0&&a.positive.forEach(s=>{const r=Math.abs(s.weight*100),o=Math.min(r*2,100);n+=`
        <div class="driver-item">
          <span class="driver-label">${s.label}</span>
          <div class="driver-bar-container">
            <div class="driver-bar positive" style="width: ${o}%">
              <span class="driver-value">+${r.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      `}),a.negative.length>0&&a.negative.forEach(s=>{const r=Math.abs(s.weight*100),o=Math.min(r*2,100);n+=`
        <div class="driver-item">
          <span class="driver-label">${s.label}</span>
          <div class="driver-bar-container">
            <div class="driver-bar negative" style="width: ${o}%">
              <span class="driver-value">-${r.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      `}),a.meta&&Object.keys(a.meta).length>0&&(n+=`
      <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid var(--border-color);">
        <small style="color: var(--text-secondary);">
    `,a.meta.base_value!==void 0&&(n+=`Base value: ${a.meta.base_value.toFixed(2)} `),a.meta.contrib_sum!==void 0&&(n+=`Contrib sum: ${a.meta.contrib_sum.toFixed(2)} `),a.meta.logit_total!==void 0&&(n+=`Logit total: ${a.meta.logit_total.toFixed(2)}`),n+=`
        </small>
      </div>
    `),n+="</div>",n}const W=[{id:"uniklinik-freiburg",name:"Universitätsklinikum Freiburg",type:"comprehensive",address:"Hugstetter Str. 55, 79106 Freiburg im Breisgau",coordinates:{lat:48.0025,lng:7.8347},phone:"+49 761 270-0",emergency:"+49 761 270-34010",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"uniklinik-heidelberg",name:"Universitätsklinikum Heidelberg",type:"comprehensive",address:"Im Neuenheimer Feld 400, 69120 Heidelberg",coordinates:{lat:49.4178,lng:8.6706},phone:"+49 6221 56-0",emergency:"+49 6221 56-36643",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"uniklinik-tuebingen",name:"Universitätsklinikum Tübingen",type:"comprehensive",address:"Geissweg 3, 72076 Tübingen",coordinates:{lat:48.5378,lng:9.0538},phone:"+49 7071 29-0",emergency:"+49 7071 29-82211",services:["thrombectory","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"uniklinik-ulm",name:"Universitätsklinikum Ulm",type:"comprehensive",address:"Albert-Einstein-Allee 23, 89081 Ulm",coordinates:{lat:48.4196,lng:9.9592},phone:"+49 731 500-0",emergency:"+49 731 500-63001",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"klinikum-stuttgart",name:"Klinikum Stuttgart - Katharinenhospital",type:"comprehensive",address:"Kriegsbergstraße 60, 70174 Stuttgart",coordinates:{lat:48.7784,lng:9.1682},phone:"+49 711 278-0",emergency:"+49 711 278-32001",services:["thrombectomy","neurosurgery","icu"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"robert-bosch-stuttgart",name:"Robert-Bosch-Krankenhaus Stuttgart",type:"primary",address:"Auerbachstraße 110, 70376 Stuttgart",coordinates:{lat:48.7447,lng:9.2294},phone:"+49 711 8101-0",emergency:"+49 711 8101-3456",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"diakonie-stuttgart",name:"Diakonie-Klinikum Stuttgart",type:"primary",address:"Rosenbergstraße 38, 70176 Stuttgart",coordinates:{lat:48.7861,lng:9.1736},phone:"+49 711 991-0",emergency:"+49 711 991-2201",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"rkh-ludwigsburg",name:"RKH Klinikum Ludwigsburg",type:"primary",address:"Posilipostraße 4, 71640 Ludwigsburg",coordinates:{lat:48.8901,lng:9.1953},phone:"+49 7141 99-0",emergency:"+49 7141 99-67201",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-karlsruhe",name:"Städtisches Klinikum Karlsruhe",type:"comprehensive",address:"Moltkestraße 90, 76133 Karlsruhe",coordinates:{lat:49.0047,lng:8.3858},phone:"+49 721 974-0",emergency:"+49 721 974-2301",services:["thrombectomy","neurosurgery","icu"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"vincentius-karlsruhe",name:"ViDia Kliniken Karlsruhe - St. Vincentius",type:"primary",address:"Südendstraße 32, 76135 Karlsruhe",coordinates:{lat:48.9903,lng:8.3711},phone:"+49 721 8108-0",emergency:"+49 721 8108-9201",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-mannheim",name:"Universitätsmedizin Mannheim",type:"comprehensive",address:"Theodor-Kutzer-Ufer 1-3, 68167 Mannheim",coordinates:{lat:49.4828,lng:8.4664},phone:"+49 621 383-0",emergency:"+49 621 383-2251",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"theresienkrankenhaus-mannheim",name:"Theresienkrankenhaus Mannheim",type:"primary",address:"Bassermannstraße 1, 68165 Mannheim",coordinates:{lat:49.4904,lng:8.4594},phone:"+49 621 424-0",emergency:"+49 621 424-2101",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-pforzheim",name:"Helios Klinikum Pforzheim",type:"primary",address:"Kanzlerstraße 2-6, 75175 Pforzheim",coordinates:{lat:48.8833,lng:8.6936},phone:"+49 7231 969-0",emergency:"+49 7231 969-2301",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"zollernalb-klinikum",name:"Zollernalb Klinikum Albstadt",type:"primary",address:"Zollernring 10-14, 72488 Sigmaringen",coordinates:{lat:48.0878,lng:9.2233},phone:"+49 7571 100-0",emergency:"+49 7571 100-1501",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-konstanz",name:"Gesundheitsverbund Landkreis Konstanz",type:"primary",address:"Mainaustraße 14, 78464 Konstanz",coordinates:{lat:47.6779,lng:9.1732},phone:"+49 7531 801-0",emergency:"+49 7531 801-2301",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-friedrichshafen",name:"Klinikum Friedrichshafen",type:"primary",address:"Röntgenstraße 2, 88048 Friedrichshafen",coordinates:{lat:47.6587,lng:9.4685},phone:"+49 7541 96-0",emergency:"+49 7541 96-2401",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"oberschwabenklinik-ravensburg",name:"Oberschwabenklinik Ravensburg",type:"primary",address:"Elisabethenstraße 17, 88212 Ravensburg",coordinates:{lat:47.7815,lng:9.6078},phone:"+49 751 87-0",emergency:"+49 751 87-2201",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"alb-donau-klinikum",name:"Alb Donau Klinikum Ehingen",type:"primary",address:"Schwörhausgasse 7, 89584 Ehingen",coordinates:{lat:48.2833,lng:9.7262},phone:"+49 7391 789-0",emergency:"+49 7391 789-1801",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"ortenau-klinikum-offenburg",name:"Ortenau Klinikum Offenburg",type:"primary",address:"Ebertplatz 12, 77654 Offenburg",coordinates:{lat:48.4706,lng:7.9444},phone:"+49 781 472-0",emergency:"+49 781 472-2001",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-baden-baden",name:"Klinikum Mittelbaden Baden-Baden",type:"primary",address:"Balger Str. 50, 76532 Baden-Baden",coordinates:{lat:48.7606,lng:8.2275},phone:"+49 7221 91-0",emergency:"+49 7221 91-1701",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"}];function Y(i,t,e,a){const s=v(e-i),r=v(a-t),o=Math.sin(s/2)*Math.sin(s/2)+Math.cos(v(i))*Math.cos(v(e))*Math.sin(r/2)*Math.sin(r/2);return 6371*(2*Math.atan2(Math.sqrt(o),Math.sqrt(1-o)))}function v(i){return i*(Math.PI/180)}function Z(i,t,e=5,a=100){return W.map(s=>({...s,distance:Y(i,t,s.coordinates.lat,s.coordinates.lng)})).filter(s=>s.distance<=a).sort((s,r)=>s.distance-r.distance).slice(0,e)}function J(i,t,e="stroke"){const a=Z(i,t,10);if(e==="lvo"||e==="thrombectomy"){const n=a.filter(r=>r.type==="comprehensive"&&r.services.includes("thrombectomy")),s=a.filter(r=>r.type==="primary");return{recommended:n.slice(0,3),alternative:s.slice(0,2)}}return{recommended:a.slice(0,5),alternative:[]}}const I={en:{appTitle:"Stroke Triage Assistant",emergencyBadge:"Emergency Tool",helpButton:"Help and Instructions",darkModeButton:"Toggle dark mode",languageToggle:"Language",step1:"Initial Assessment",step2:"Data Collection",step3:"Results",triage1Title:"Initial Assessment",triage1Subtitle:"Emergency Stroke Triage Protocol",triage1Question:"Is the patient comatose?",triage1Help:"Glasgow Coma Scale < 8",triage1Yes:"YES - Comatose",triage1No:"NO - Conscious",triage2Title:"Clinical Assessment",triage2Subtitle:"Select appropriate assessment module",triage2Question:"Which assessment module should be used?",triage2Help:"Select based on available clinical data and examination findings",triage2Coma:"Coma Module",triage2ComaDesc:"For comatose patients (GCS < 8)",triage2Limited:"Limited Data Module",triage2LimitedDesc:"Basic vitals and limited examination",triage2Full:"Full Stroke Module",triage2FullDesc:"Complete neurological assessment available",ageLabel:"Age (years)",ageHelp:"Patient age in years",systolicLabel:"Systolic BP (mmHg)",systolicHelp:"Systolic blood pressure",diastolicLabel:"Diastolic BP (mmHg)",diastolicHelp:"Diastolic blood pressure",gfapLabel:"GFAP Value (pg/mL)",gfapHelp:"GFAP biomarker level",fastEdLabel:"FAST-ED Score",fastEdHelp:"FAST-ED assessment score (0-9)",headacheLabel:"Headache",vigilanzLabel:"Reduced consciousness",armPareseLabel:"Arm weakness",beinPareseLabel:"Leg weakness",eyeDeviationLabel:"Eye deviation",atrialFibLabel:"Atrial fibrillation",anticoagLabel:"Anticoagulated (NOAK)",antiplateletsLabel:"Antiplatelets",analyzeButton:"Analyze",analyzing:"Analyzing...",printResults:"Print Results",newAssessment:"Start New Assessment",resultsTitle:"Assessment Results",resultsSubtitle:"Clinical Decision Support Analysis",ichProbability:"ICH Probability",lvoProbability:"LVO Probability",riskLevel:"Risk Level",lowRisk:"Low Risk",moderateRisk:"Moderate Risk",highRisk:"High Risk",criticalRisk:"Critical Risk",riskLow:"Low",riskModerate:"Moderate",riskHigh:"High",riskCritical:"Critical",driversTitle:"Model Drivers",driversSubtitle:"Factors contributing to the prediction",ichDrivers:"ICH Risk Factors",lvoDrivers:"LVO Risk Factors",criticalAlertTitle:"CRITICAL RISK DETECTED",criticalAlertMessage:"High probability of intracerebral hemorrhage detected. Immediate medical attention required.",helpTitle:"Quick Reference Guide",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 8: Comatose patient - use Coma Module",gcsMod:"GCS 8-12: Moderate impairment",gcsHigh:"GCS 13-15: Mild impairment",fastEdTitle:"FAST-ED Score Components",fastEdFacial:"Facial Palsy: 0-1 points",fastEdArm:"Arm Weakness: 0-2 points",fastEdSpeech:"Speech Changes: 0-2 points",fastEdTime:"Time: Critical factor",fastEdEye:"Eye Deviation: 0-2 points",fastEdDenial:"Denial/Neglect: 0-2 points",criticalValuesTitle:"Critical Values",criticalBp:"Systolic BP > 180: Increased ICH risk",criticalGfap:"GFAP > 500 pg/mL: Significant marker",criticalFastEd:"FAST-ED ≥ 4: Consider LVO",disclaimer:"Clinical Disclaimer",disclaimerText:"This tool is for clinical decision support only. Always use clinical judgment and follow local protocols. Not a replacement for physician assessment.",importantNote:"Important",importantText:"These results are for clinical decision support only. Always use clinical judgment and follow institutional protocols.",privacyLink:"Privacy Policy",disclaimerLink:"Medical Disclaimer",versionLink:"Version 2.0.1",privacyPolicy:"Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.",medicalDisclaimer:"Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.",networkError:"Network error - please check your connection and try again",requestTimeout:"Request timeout - please try again",apiError:"Failed to get results",validationError:"Please check your input values",sessionTimeout:"Your session has been idle for 30 minutes. Would you like to continue?",unsavedData:"You have unsaved data. Are you sure you want to leave?",nearestCentersTitle:"Nearest Stroke Centers",useCurrentLocation:"Use Current Location",enterLocationPlaceholder:"Enter city or address...",enterManually:"Enter Location Manually",search:"Search",yourLocation:"Your Location",recommendedCenters:"Recommended Centers",alternativeCenters:"Alternative Centers",noCentersFound:"No stroke centers found in this area",gettingLocation:"Getting your location",searchingLocation:"Searching location",locationError:"Unable to get your location",locationPermissionDenied:"Location access denied. Please allow location access and try again.",locationUnavailable:"Location information is unavailable",locationTimeout:"Location request timed out",geolocationNotSupported:"Geolocation is not supported by this browser",geocodingNotImplemented:"Location search not available. Please use GPS or enter coordinates manually.",tryManualEntry:"Try entering your location manually or use GPS.",distanceNote:"Distances are calculated as straight-line distances. Actual travel times may vary.",comprehensiveCenter:"Comprehensive Stroke Center",primaryCenter:"Primary Stroke Center",telemetryCenter:"Telemedicine Center",thrombectomy:"Thrombectomy",neurosurgery:"Neurosurgery",icu:"Intensive Care",telemedicine:"Telemedicine",stroke_unit:"Stroke Unit",call:"Call",directions:"Directions",emergency:"Emergency",certified:"Certified"},de:{appTitle:"Schlaganfall-Triage-Assistent",emergencyBadge:"Notfall-Tool",helpButton:"Hilfe und Anweisungen",darkModeButton:"Dunklen Modus umschalten",languageToggle:"Sprache",step1:"Erstbeurteilung",step2:"Datenerhebung",step3:"Ergebnisse",triage1Title:"Erstbeurteilung",triage1Subtitle:"Notfall-Schlaganfall-Triage-Protokoll",triage1Question:"Ist der Patient komatös?",triage1Help:"Glasgow Coma Scale < 8",triage1Yes:"JA - Komatös",triage1No:"NEIN - Bei Bewusstsein",triage2Title:"Klinische Bewertung",triage2Subtitle:"Wählen Sie das entsprechende Bewertungsmodul",triage2Question:"Welches Bewertungsmodul soll verwendet werden?",triage2Help:"Auswahl basierend auf verfügbaren klinischen Daten und Untersuchungsbefunden",triage2Coma:"Koma-Modul",triage2ComaDesc:"Für komatöse Patienten (GCS < 8)",triage2Limited:"Begrenzte-Daten-Modul",triage2LimitedDesc:"Grundvitalwerte und begrenzte Untersuchung",triage2Full:"Vollständiges Schlaganfall-Modul",triage2FullDesc:"Vollständige neurologische Bewertung verfügbar",ageLabel:"Alter (Jahre)",ageHelp:"Patientenalter in Jahren",systolicLabel:"Systolischer RR (mmHg)",systolicHelp:"Systolischer Blutdruck",diastolicLabel:"Diastolischer RR (mmHg)",diastolicHelp:"Diastolischer Blutdruck",gfapLabel:"GFAP-Wert (pg/mL)",gfapHelp:"GFAP-Biomarker-Wert",fastEdLabel:"FAST-ED-Score",fastEdHelp:"FAST-ED-Bewertungsscore (0-9)",headacheLabel:"Kopfschmerzen",vigilanzLabel:"Bewusstseinstrübung",armPareseLabel:"Armschwäche",beinPareseLabel:"Beinschwäche",eyeDeviationLabel:"Blickdeviation",atrialFibLabel:"Vorhofflimmern",anticoagLabel:"Antikoaguliert (NOAK)",antiplateletsLabel:"Thrombozytenaggregationshemmer",analyzeButton:"Analysieren",analyzing:"Analysiere...",printResults:"Ergebnisse drucken",newAssessment:"Neue Bewertung starten",resultsTitle:"Bewertungsergebnisse",resultsSubtitle:"Klinische Entscheidungsunterstützungsanalyse",ichProbability:"ICB-Wahrscheinlichkeit",lvoProbability:"LVO-Wahrscheinlichkeit",riskLevel:"Risikostufe",riskLow:"Niedrig",riskModerate:"Mäßig",riskHigh:"Hoch",riskCritical:"Kritisch",driversTitle:"Modelltreiber",driversSubtitle:"Faktoren, die zur Vorhersage beitragen",ichDrivers:"ICB-Risikofaktoren",lvoDrivers:"LVO-Risikofaktoren",criticalAlertTitle:"KRITISCHES RISIKO ERKANNT",criticalAlertMessage:"Hohe Wahrscheinlichkeit einer intrazerebralen Blutung erkannt. Sofortige medizinische Behandlung erforderlich.",helpTitle:"Kurzreferenzleitfaden",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 8: Komatöser Patient - Koma-Modul verwenden",gcsMod:"GCS 8-12: Mäßige Beeinträchtigung",gcsHigh:"GCS 13-15: Leichte Beeinträchtigung",fastEdTitle:"FAST-ED-Score-Komponenten",fastEdFacial:"Faziale Parese: 0-1 Punkte",fastEdArm:"Armschwäche: 0-2 Punkte",fastEdSpeech:"Sprachveränderungen: 0-2 Punkte",fastEdTime:"Zeit: Kritischer Faktor",fastEdEye:"Blickdeviation: 0-2 Punkte",fastEdDenial:"Verneinung/Neglect: 0-2 Punkte",criticalValuesTitle:"Kritische Werte",criticalBp:"Systolischer RR > 180: Erhöhtes ICB-Risiko",criticalGfap:"GFAP > 500 pg/mL: Signifikanter Marker",criticalFastEd:"FAST-ED ≥ 4: LVO in Betracht ziehen",disclaimer:"Klinischer Haftungsausschluss",disclaimerText:"Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle. Kein Ersatz für ärztliche Beurteilung.",importantNote:"Wichtig",importantText:"Diese Ergebnisse dienen nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie institutionelle Protokolle.",privacyLink:"Datenschutzrichtlinie",disclaimerLink:"Medizinischer Haftungsausschluss",versionLink:"Version 2.0.1",privacyPolicy:"Datenschutzrichtlinie: Dieses Tool verarbeitet Daten lokal. Keine Patientendaten werden gespeichert oder übertragen.",medicalDisclaimer:"Medizinischer Haftungsausschluss: Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle.",networkError:"Netzwerkfehler - bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut",requestTimeout:"Anfrage-Timeout - bitte versuchen Sie es erneut",apiError:"Ergebnisse konnten nicht abgerufen werden",validationError:"Bitte überprüfen Sie Ihre Eingabewerte",sessionTimeout:"Ihre Sitzung war 30 Minuten lang inaktiv. Möchten Sie fortfahren?",unsavedData:"Sie haben ungespeicherte Daten. Sind Sie sicher, dass Sie verlassen möchten?",nearestCentersTitle:"Nächstgelegene Schlaganfall-Zentren",useCurrentLocation:"Aktuellen Standort verwenden",enterLocationPlaceholder:"Stadt oder Adresse eingeben...",enterManually:"Standort manuell eingeben",search:"Suchen",yourLocation:"Ihr Standort",recommendedCenters:"Empfohlene Zentren",alternativeCenters:"Alternative Zentren",noCentersFound:"Keine Schlaganfall-Zentren in diesem Bereich gefunden",gettingLocation:"Standort wird ermittelt",searchingLocation:"Standort wird gesucht",locationError:"Standort konnte nicht ermittelt werden",locationPermissionDenied:"Standortzugriff verweigert. Bitte erlauben Sie Standortzugriff und versuchen Sie es erneut.",locationUnavailable:"Standortinformationen sind nicht verfügbar",locationTimeout:"Standortanfrage ist abgelaufen",geolocationNotSupported:"Geolokalisierung wird von diesem Browser nicht unterstützt",geocodingNotImplemented:"Standortsuche nicht verfügbar. Bitte verwenden Sie GPS oder geben Sie Koordinaten manuell ein.",tryManualEntry:"Versuchen Sie, Ihren Standort manuell einzugeben oder GPS zu verwenden.",distanceNote:"Entfernungen werden als Luftlinie berechnet. Tatsächliche Fahrzeiten können variieren.",comprehensiveCenter:"Überregionales Schlaganfall-Zentrum",primaryCenter:"Regionales Schlaganfall-Zentrum",telemetryCenter:"Telemedizin-Zentrum",thrombectomy:"Thrombektomie",neurosurgery:"Neurochirurgie",icu:"Intensivstation",telemedicine:"Telemedizin",stroke_unit:"Stroke Unit",call:"Anrufen",directions:"Wegbeschreibung",emergency:"Notfall",certified:"Zertifiziert"}};class Q{constructor(){this.currentLanguage=this.detectLanguage(),this.supportedLanguages=["en","de"]}detectLanguage(){const t=localStorage.getItem("language");return t&&this.supportedLanguages.includes(t)?t:(navigator.language||navigator.userLanguage).substring(0,2).toLowerCase()==="de"?"de":"en"}getCurrentLanguage(){return this.currentLanguage}setLanguage(t){return this.supportedLanguages.includes(t)?(this.currentLanguage=t,localStorage.setItem("language",t),window.dispatchEvent(new CustomEvent("languageChanged",{detail:{language:t}})),!0):!1}getSupportedLanguages(){return[...this.supportedLanguages]}t(t){return(I[this.currentLanguage]||I.en)[t]||t}toggleLanguage(){const t=this.currentLanguage==="en"?"de":"en";return this.setLanguage(t)}getLanguageDisplayName(t=null){const e=t||this.currentLanguage;return{en:"English",de:"Deutsch"}[e]||e}formatDateTime(t){const e=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(e,{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(t)}formatTime(t){const e=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(e,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(t)}}const L=new Q,c=i=>L.t(i);function X(i){return`
    <div class="stroke-center-section">
      <h3>🏥 ${c("nearestCentersTitle")}</h3>
      <div id="locationContainer">
        <div class="location-controls">
          <button type="button" id="useGpsButton" class="secondary">
            📍 ${c("useCurrentLocation")}
          </button>
          <div class="location-manual" style="display: none;">
            <input type="text" id="locationInput" placeholder="${c("enterLocationPlaceholder")}" />
            <button type="button" id="searchLocationButton" class="secondary">${c("search")}</button>
          </div>
          <button type="button" id="manualLocationButton" class="secondary">
            ✏️ ${c("enterManually")}
          </button>
        </div>
        <div id="strokeCenterResults" class="stroke-center-results"></div>
      </div>
    </div>
  `}function x(i){const t=document.getElementById("useGpsButton"),e=document.getElementById("manualLocationButton"),a=document.querySelector(".location-manual"),n=document.getElementById("locationInput"),s=document.getElementById("searchLocationButton"),r=document.getElementById("strokeCenterResults");t&&t.addEventListener("click",()=>{ee(i,r)}),e&&e.addEventListener("click",()=>{a.style.display=a.style.display==="none"?"block":"none"}),s&&s.addEventListener("click",()=>{const o=n.value.trim();o&&M(o,i,r)}),n&&n.addEventListener("keypress",o=>{if(o.key==="Enter"){const m=n.value.trim();m&&M(m,i,r)}})}function ee(i,t){if(!navigator.geolocation){w(c("geolocationNotSupported"),t);return}t.innerHTML=`<div class="loading">${c("gettingLocation")}...</div>`,navigator.geolocation.getCurrentPosition(e=>{const{latitude:a,longitude:n}=e.coords;te(a,n,i,t)},e=>{let a=c("locationError");switch(e.code){case e.PERMISSION_DENIED:a=c("locationPermissionDenied");break;case e.POSITION_UNAVAILABLE:a=c("locationUnavailable");break;case e.TIMEOUT:a=c("locationTimeout");break}w(a,t)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:3e5})}async function M(i,t,e){e.innerHTML=`<div class="loading">${c("searchingLocation")}...</div>`,w(c("geocodingNotImplemented"),e)}function te(i,t,e,a){const n=ie(e),s=J(i,t,n),r=`
    <div class="location-info">
      <p><strong>${c("yourLocation")}:</strong> ${i.toFixed(4)}, ${t.toFixed(4)}</p>
    </div>
    
    <div class="recommended-centers">
      <h4>${c("recommendedCenters")}</h4>
      ${P(s.recommended,!0)}
    </div>
    
    ${s.alternative.length>0?`
      <div class="alternative-centers">
        <h4>${c("alternativeCenters")}</h4>
        ${P(s.alternative,!1)}
      </div>
    `:""}
    
    <div class="distance-note">
      <small>${c("distanceNote")}</small>
    </div>
  `;a.innerHTML=r}function P(i,t=!1){return!i||i.length===0?`<p>${c("noCentersFound")}</p>`:i.map(e=>`
    <div class="stroke-center-card ${t?"recommended":"alternative"}">
      <div class="center-header">
        <h5>${e.name}</h5>
        <span class="center-type ${e.type}">${c(e.type+"Center")}</span>
        <span class="distance">${e.distance.toFixed(1)} km</span>
      </div>
      
      <div class="center-details">
        <p class="address">📍 ${e.address}</p>
        <p class="phone">📞 ${c("emergency")}: ${e.emergency}</p>
        
        <div class="services">
          ${e.services.map(a=>`
            <span class="service-badge">${c(a)}</span>
          `).join("")}
        </div>
        
        ${e.certified?`
          <div class="certification">
            ✅ ${c("certified")}: ${e.certification}
          </div>
        `:""}
      </div>
      
      <div class="center-actions">
        <button class="call-button" onclick="window.open('tel:${e.emergency}')">
          📞 ${c("call")}
        </button>
        <button class="directions-button" onclick="window.open('https://maps.google.com/maps?daddr=${e.coordinates.lat},${e.coordinates.lng}', '_blank')">
          🧭 ${c("directions")}
        </button>
      </div>
    </div>
  `).join("")}function ie(i){return i?i.lvo&&i.lvo.probability>.5?"lvo":i.ich&&i.ich.probability>.6?"ich":"stroke":"stroke"}function w(i,t){t.innerHTML=`
    <div class="location-error">
      <p>⚠️ ${i}</p>
      <p><small>${c("tryManualEntry")}</small></p>
    </div>
  `}function $(i,t){const e=Number(i),a=k[t];return e>=a.critical?"🔴 CRITICAL RISK":e>=a.high?"🟠 HIGH RISK":e>=30?"🟡 MODERATE RISK":"🟢 LOW RISK"}function ae(i,t){const{ich:e,lvo:a}=i;let n="",s="";if(e){const l=Math.round(e.probability*100);n=`
      <div class="result-card ${l>k.ich.critical?"critical":"ich"}">
        <h3> 🧠 ${c("ichProbability")} <small>(${e.module} Module)</small> </h3>
        <div class="probability-display">${l}%</div>
        <div class="probability-meter">
          <div class="probability-fill" style="width: ${l}%"></div>
          <div class="probability-marker" style="left: ${l}%">${l}%</div>
        </div>
        <p><strong>${c("riskLevel")}:</strong> ${$(l,"ich")}</p>
      </div>
    `}if(a)if(a.notPossible)s=`
        <div class="result-card info">
          <h3>🔍 ${c("lvoProbability")}</h3>
          <p>LVO assessment not possible with limited data.</p>
          <p>A full neurological examination is required for LVO screening.</p>
        </div>
      `;else{const l=Math.round(a.probability*100);s=`
        <div class="result-card ${l>k.lvo.critical?"critical":"lvo"}">
          <h3> 🩸 ${c("lvoProbability")} <small>(${a.module} Module)</small> </h3>
          <div class="probability-display">${l}%</div>
          <div class="probability-meter">
            <div class="probability-fill" style="width: ${l}%"></div>
            <div class="probability-marker" style="left: ${l}%">${l}%</div>
          </div>
          <p><strong>${c("riskLevel")}:</strong> ${$(l,"lvo")}</p>
        </div>
      `}const r=e&&e.probability>.6?G():"",o=j(e,a),m=X();return`
    <div class="container">
      ${f(3)}
      <h2>${c("resultsTitle")}</h2>
      <p class="subtitle">${c("resultsSubtitle")}</p>
      ${r}
      <div style="display: flex; flex-direction: column; gap: 20px;">
        ${n}
        ${s}
      </div>
      ${o}
      ${m}
      <button type="button" class="primary" id="printResults"> 📄 ${c("printResults")} </button>
      <button type="button" class="secondary" data-action="reset"> ${c("newAssessment")} </button>
      <div class="disclaimer">
        <strong>⚠️ ${c("importantNote")}:</strong> ${c("importantText")} Results generated at ${new Date().toLocaleTimeString()}.
      </div>
    </div>
  `}function ne(i,t,e){const a=[];return e.required&&!t&&t!==0&&a.push("This field is required"),e.min!==void 0&&t!==""&&!isNaN(t)&&parseFloat(t)<e.min&&a.push(`Value must be at least ${e.min}`),e.max!==void 0&&t!==""&&!isNaN(t)&&parseFloat(t)>e.max&&a.push(`Value must be at most ${e.max}`),e.pattern&&!e.pattern.test(t)&&a.push("Invalid format"),a}function se(i){let t=!0;const e={};return Object.entries(R).forEach(([a,n])=>{const s=i.elements[a];if(s){const r=ne(a,s.value,n);r.length>0&&(e[a]=r,t=!1)}}),{isValid:t,validationErrors:e}}function re(i,t){Object.entries(t).forEach(([e,a])=>{const n=i.querySelector(`[name="${e}"]`);if(n){const s=n.closest(".input-group");if(s){s.classList.add("error"),s.querySelectorAll(".error-message").forEach(o=>o.remove());const r=document.createElement("div");r.className="error-message",r.innerHTML=`<span class="error-icon">⚠️</span> ${a[0]}`,s.appendChild(r)}}})}function oe(i){i.querySelectorAll(".input-group.error").forEach(t=>{t.classList.remove("error"),t.querySelectorAll(".error-message").forEach(e=>e.remove())})}class p extends Error{constructor(t,e,a){super(t),this.name="APIError",this.status=e,this.url=a}}function E(i){const t={...i};return Object.keys(t).forEach(e=>{const a=t[e];(typeof a=="boolean"||a==="on"||a==="true"||a==="false")&&(t[e]=a===!0||a==="on"||a==="true"?1:0)}),t}async function T(i,t){const e=new AbortController,a=setTimeout(()=>e.abort(),S.requestTimeout);try{const n=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(t),signal:e.signal,mode:"cors"});if(clearTimeout(a),!n.ok){let r=`HTTP ${n.status}`;try{const o=await n.json();r=o.error||o.message||r}catch{r=`${r}: ${n.statusText}`}throw new p(r,n.status,i)}return await n.json()}catch(n){throw clearTimeout(a),n.name==="AbortError"?new p("Request timeout - please try again",408,i):n instanceof p?n:new p("Network error - please check your connection and try again",0,i)}}async function le(i){const t=E(i);try{const e=await T(b.COMA_ICH,t);return{probability:e.probability||e.ich_probability,drivers:e.drivers||null,confidence:e.confidence||.75,module:"Coma"}}catch(e){throw console.error("Coma ICH prediction failed:",e),new p(`Failed to get ICH prediction: ${e.message}`,e.status,b.COMA_ICH)}}async function ce(i){const t=E(i);try{const e=await T(b.LDM_ICH,t);return{probability:e.probability||e.ich_probability,drivers:e.drivers||null,confidence:e.confidence||.65,module:"Limited Data"}}catch(e){throw console.error("Limited Data ICH prediction failed:",e),new p(`Failed to get ICH prediction: ${e.message}`,e.status,b.LDM_ICH)}}async function de(i){var a,n,s,r,o,m;const t={age_years:i.age_years,systolic_bp:i.systolic_bp,diastolic_bp:i.diastolic_bp,gfap_value:i.gfap_value,fast_ed_score:i.fast_ed_score,headache:i.headache||0,vigilanzminderung:i.vigilanzminderung||0,armparese:i.armparese||0,beinparese:i.beinparese||0,eye_deviation:i.eye_deviation||0,atrial_fibrillation:i.atrial_fibrillation||0,anticoagulated_noak:i.anticoagulated_noak||0,antiplatelets:i.antiplatelets||0},e=E(t);try{const l=await T(b.FULL_STROKE,e),u={probability:l.ich_probability||((a=l.ich)==null?void 0:a.probability),drivers:l.ich_drivers||((n=l.ich)==null?void 0:n.drivers),confidence:l.ich_confidence||((s=l.ich)==null?void 0:s.confidence)||.85,module:"Full Stroke"},h={probability:l.lvo_probability||((r=l.lvo)==null?void 0:r.probability),drivers:l.lvo_drivers||((o=l.lvo)==null?void 0:o.drivers),confidence:l.lvo_confidence||((m=l.lvo)==null?void 0:m.confidence)||.85,module:"Full Stroke"};return{ich:u,lvo:h}}catch(l){throw console.error("Full Stroke prediction failed:",l),new p(`Failed to get stroke predictions: ${l.message}`,l.status,b.FULL_STROKE)}}function ue(i){d.logEvent("triage1_answer",{comatose:i}),C(i?"coma":"triage2")}function me(i){d.logEvent("triage2_answer",{examinable:i}),C(i?"full":"limited")}function C(i){d.logEvent("navigate",{from:d.getState().currentScreen,to:i}),d.navigate(i),window.scrollTo(0,0)}function ge(){d.hasUnsavedData()&&!confirm("Are you sure you want to start over? All entered data will be lost.")||(d.logEvent("reset"),d.reset())}async function pe(i,t){i.preventDefault();const e=i.target,a=e.dataset.module,n=se(e);if(!n.isValid){re(t,n.validationErrors);return}const s=new FormData(e),r={};s.forEach((l,u)=>{const h=e.elements[u];if(h&&h.type==="checkbox")r[u]=h.checked;else{const D=parseFloat(l);r[u]=isNaN(D)?l:D}}),d.setFormData(a,r);const o=e.querySelector("button[type=submit]"),m=o?o.innerHTML:"";o&&(o.disabled=!0,o.innerHTML='<span class="loading-spinner"></span> Analyzing...');try{let l;switch(a){case"coma":l={ich:await le(r),lvo:null};break;case"limited":l={ich:await ce(r),lvo:{notPossible:!0}};break;case"full":l=await de(r);break;default:throw new Error("Unknown module: "+a)}d.setResults(l),d.logEvent("models_complete",{module:a,results:l}),C("results")}catch(l){console.error("Error running models:",l);let u="An error occurred during analysis. Please try again.";l instanceof p&&(u=l.message),he(t,u),o&&(o.disabled=!1,o.innerHTML=m)}}function he(i,t){i.querySelectorAll(".critical-alert").forEach(n=>{var s,r;(r=(s=n.querySelector("h4"))==null?void 0:s.textContent)!=null&&r.includes("Error")&&n.remove()});const e=document.createElement("div");e.className="critical-alert",e.innerHTML=`<h4><span class="alert-icon">⚠️</span> Error</h4><p>${t}</p>`;const a=i.querySelector(".container");a?a.prepend(e):i.prepend(e),setTimeout(()=>e.remove(),1e4)}function be(i){const t=document.createElement("div");t.className="sr-only",t.setAttribute("role","status"),t.setAttribute("aria-live","polite");const e={triage1:"Coma assessment",triage2:"Examination capability assessment",coma:"Coma module",limited:"Limited data module",full:"Full stroke assessment",results:"Assessment results"};t.textContent=`Navigated to ${e[i]||i}`,document.body.appendChild(t),setTimeout(()=>t.remove(),1e3)}function fe(i){const t={triage1:"Initial Assessment - Stroke Triage Assistant",triage2:"Examination Capability - Stroke Triage Assistant",coma:"Coma Module - Stroke Triage Assistant",limited:"Limited Data Module - Stroke Triage Assistant",full:"Full Stroke Module - Stroke Triage Assistant",results:"Assessment Results - Stroke Triage Assistant"};document.title=t[i]||"Stroke Triage Assistant"}function ve(){setTimeout(()=>{const i=document.querySelector("h2");i&&(i.setAttribute("tabindex","-1"),i.focus(),setTimeout(()=>i.removeAttribute("tabindex"),100))},100)}function y(i){const t=d.getState(),{currentScreen:e,results:a,startTime:n}=t;i.innerHTML="";let s="";switch(e){case"triage1":s=A();break;case"triage2":s=F();break;case"coma":s=H();break;case"limited":s=N();break;case"full":s=z();break;case"results":s=ae(a);break;default:s=A()}i.innerHTML=s;const r=i.querySelector("form[data-module]");if(r){const o=r.dataset.module;ye(r,o)}ke(i),e==="results"&&a&&setTimeout(()=>{x(a)},100),be(e),fe(e),ve()}function ye(i,t){const e=d.getFormData(t);!e||Object.keys(e).length===0||Object.entries(e).forEach(([a,n])=>{const s=i.elements[a];s&&(s.type==="checkbox"?s.checked=n===!0||n==="on"||n==="true":s.value=n)})}function ke(i){i.querySelectorAll('input[type="number"]').forEach(e=>{e.addEventListener("blur",()=>{oe(i)})}),i.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",a=>{const{action:n,value:s}=a.currentTarget.dataset,r=s==="true";switch(n){case"triage1":ue(r);break;case"triage2":me(r);break;case"reset":ge();break}})}),i.querySelectorAll("form[data-module]").forEach(e=>{e.addEventListener("submit",a=>{pe(a,i)})});const t=i.querySelector("#printResults");t&&t.addEventListener("click",()=>window.print())}class Se{constructor(){this.container=null,this.unsubscribe=null}async init(){if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",()=>this.init());return}if(this.container=document.getElementById("appContainer"),!this.container){console.error("App container not found");return}this.unsubscribe=d.subscribe(()=>{y(this.container)}),window.addEventListener("languageChanged",()=>{this.updateUILanguage(),y(this.container)}),this.setupGlobalEventListeners(),this.initializeTheme(),this.updateUILanguage(),this.startAutoSave(),this.setupSessionTimeout(),this.setCurrentYear(),y(this.container),console.log("Stroke Triage Assistant initialized")}setupGlobalEventListeners(){const t=document.getElementById("languageToggle");t&&t.addEventListener("click",()=>this.toggleLanguage());const e=document.getElementById("darkModeToggle");e&&e.addEventListener("click",()=>this.toggleDarkMode()),this.setupHelpModal(),this.setupFooterLinks(),document.addEventListener("keydown",a=>{if(a.key==="Escape"){const n=document.getElementById("helpModal");n&&n.classList.contains("show")&&(n.classList.remove("show"),n.setAttribute("aria-hidden","true"))}}),window.addEventListener("beforeunload",a=>{d.hasUnsavedData()&&(a.preventDefault(),a.returnValue="You have unsaved data. Are you sure you want to leave?")})}setupHelpModal(){const t=document.getElementById("helpButton"),e=document.getElementById("helpModal"),a=e==null?void 0:e.querySelector(".modal-close");t&&e&&(t.addEventListener("click",()=>{e.classList.add("show"),e.setAttribute("aria-hidden","false")}),a==null||a.addEventListener("click",()=>{e.classList.remove("show"),e.setAttribute("aria-hidden","true")}),e.addEventListener("click",n=>{n.target===e&&(e.classList.remove("show"),e.setAttribute("aria-hidden","true"))}))}setupFooterLinks(){var t,e;(t=document.getElementById("privacyLink"))==null||t.addEventListener("click",a=>{a.preventDefault(),this.showPrivacyPolicy()}),(e=document.getElementById("disclaimerLink"))==null||e.addEventListener("click",a=>{a.preventDefault(),this.showDisclaimer()})}initializeTheme(){const t=localStorage.getItem("theme"),e=document.getElementById("darkModeToggle");(t==="dark"||!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)&&(document.body.classList.add("dark-mode"),e&&(e.textContent="☀️"))}toggleLanguage(){L.toggleLanguage(),this.updateUILanguage()}updateUILanguage(){document.documentElement.lang=L.getCurrentLanguage();const t=document.querySelector(".app-header h1");t&&(t.textContent=c("appTitle"));const e=document.querySelector(".emergency-badge");e&&(e.textContent=c("emergencyBadge"));const a=document.getElementById("languageToggle");a&&(a.title=c("languageToggle"),a.setAttribute("aria-label",c("languageToggle")));const n=document.getElementById("helpButton");n&&(n.title=c("helpButton"),n.setAttribute("aria-label",c("helpButton")));const s=document.getElementById("darkModeToggle");s&&(s.title=c("darkModeButton"),s.setAttribute("aria-label",c("darkModeButton")));const r=document.getElementById("modalTitle");r&&(r.textContent=c("helpTitle"));const o=d.getState();o.currentScreen==="results"&&o.results&&setTimeout(()=>{x(o.results)},100)}toggleDarkMode(){const t=document.getElementById("darkModeToggle");document.body.classList.toggle("dark-mode");const e=document.body.classList.contains("dark-mode");t&&(t.textContent=e?"☀️":"🌙"),localStorage.setItem("theme",e?"dark":"light")}startAutoSave(){setInterval(()=>{this.saveCurrentFormData()},S.autoSaveInterval)}saveCurrentFormData(){this.container.querySelectorAll("form[data-module]").forEach(e=>{const a=new FormData(e),n=e.dataset.module;if(n){const s={};a.forEach((m,l)=>{const u=e.elements[l];u&&u.type==="checkbox"?s[l]=u.checked:s[l]=m});const r=d.getFormData(n);JSON.stringify(r)!==JSON.stringify(s)&&d.setFormData(n,s)}})}setupSessionTimeout(){setTimeout(()=>{confirm("Your session has been idle for 30 minutes. Would you like to continue?")?this.setupSessionTimeout():d.reset()},S.sessionTimeout)}setCurrentYear(){const t=document.getElementById("currentYear");t&&(t.textContent=new Date().getFullYear())}showPrivacyPolicy(){alert("Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.")}showDisclaimer(){alert("Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.")}destroy(){this.unsubscribe&&this.unsubscribe()}}const Le=new Se;Le.init();
//# sourceMappingURL=index-Dl_dG2HH.js.map
