(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function e(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(a){if(a.ep)return;a.ep=!0;const n=e(a);fetch(a.href,n)}})();class L{constructor(){this.state={currentScreen:"triage1",results:null,sessionId:null,startTime:null,formData:{},validationErrors:{}},this.listeners=new Set,this.initialize()}initialize(){this.state.sessionId=this.generateSessionId(),this.state.startTime=Date.now(),console.log("Store initialized with session:",this.state.sessionId)}generateSessionId(){return"session_"+Date.now()+"_"+Math.random().toString(36).substr(2,9)}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}notify(){this.listeners.forEach(t=>t(this.state))}getState(){return{...this.state}}setState(t){this.state={...this.state,...t},this.notify()}navigate(t){console.log(`Navigating from ${this.state.currentScreen} to ${t}`),this.setState({currentScreen:t})}setFormData(t,e){const s={...this.state.formData};s[t]={...e},this.setState({formData:s})}getFormData(t){return this.state.formData[t]||{}}setValidationErrors(t){this.setState({validationErrors:t})}clearValidationErrors(){this.setState({validationErrors:{}})}setResults(t){this.setState({results:t})}hasUnsavedData(){return Object.keys(this.state.formData).length>0&&!this.state.results}reset(){const t={currentScreen:"triage1",results:null,sessionId:this.generateSessionId(),startTime:Date.now(),formData:{},validationErrors:{}};this.setState(t),console.log("Store reset with new session:",t.sessionId)}logEvent(t,e={}){const s={timestamp:Date.now(),session:this.state.sessionId,event:t,data:e};console.log("Event:",s)}getSessionDuration(){return Date.now()-this.state.startTime}}const d=new L;function h(i){const t=[{id:1,label:"Triage"},{id:2,label:"Assessment"},{id:3,label:"Results"}];let e='<div class="progress-indicator">';return t.forEach((s,a)=>{const n=s.id===i,r=s.id<i;e+=`
      <div class="progress-step ${n?"active":""} ${r?"completed":""}">
        ${r?"":s.id}
      </div>
    `,a<t.length-1&&(e+=`<div class="progress-line ${r?"completed":""}"></div>`)}),e+="</div>",e}function S(){return`
    <div class="container">
      ${h(1)}
      <h2>Initial Assessment</h2>
      <p class="subtitle">Emergency Stroke Triage Protocol</p>
      <div class="triage-question">
        Is the patient comatose?
        <small>Glasgow Coma Scale &lt; 8</small>
      </div>
      <div class="disclaimer">
        <strong>⚠️ Time-Critical Assessment</strong>
        Every minute counts in stroke care. Complete assessment rapidly while maintaining accuracy.
      </div>
      <div class="triage-buttons">
        <button class="yes-btn" data-action="triage1" data-value="true">YES - Comatose</button>
        <button class="no-btn" data-action="triage1" data-value="false">NO - Conscious</button>
      </div>
    </div>
  `}function C(){return`
    <div class="container">
      ${h(1)}
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
  `}const b={COMA_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_coma_ich",LDM_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_limited_data_ich",FULL_STROKE:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_full_stroke"},g={ich:{high:60,critical:80},lvo:{high:50,critical:70}},p={min:29,max:10001},v={autoSaveInterval:3e4,sessionTimeout:30*60*1e3,requestTimeout:1e4},T={age_years:{required:!0,min:0,max:120},systolic_bp:{required:!0,min:60,max:300},diastolic_bp:{required:!0,min:30,max:200},gfap_value:{required:!0,min:p.min,max:p.max},fast_ed_score:{required:!0,min:0,max:9}};function I(){return`
    <div class="container">
      ${h(2)}
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
  `}function D(){return`
    <div class="container">
      ${h(2)}
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
  `}function $(){return`
    <div class="container">
      ${h(2)}
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
  `}function M(){return`
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
  `}function P(i){return!i||typeof i!="object"?{kind:"unavailable",units:null,positive:[],negative:[],meta:{}}:i.kind?i:i.shap_values||i.kind&&i.kind==="shap_values"?O(i):i.logistic_contributions||i.kind&&i.kind==="logistic_contributions"?F(i):H(i)?R(i):{kind:"unavailable",units:null,positive:[],negative:[],meta:{}}}function O(i){const t=i.shap_values||i,e=[];Array.isArray(t)?t.forEach((r,o)=>{typeof r=="object"&&r.feature&&r.value!==void 0?e.push({label:r.feature,weight:r.value}):typeof r=="number"&&e.push({label:`Feature ${o}`,weight:r})}):typeof t=="object"&&Object.entries(t).forEach(([r,o])=>{typeof o=="number"&&e.push({label:r,weight:o})}),e.sort((r,o)=>Math.abs(o.weight)-Math.abs(r.weight));const s=e.filter(r=>r.weight>0),a=e.filter(r=>r.weight<0),n={};return i.base_value!==void 0&&(n.base_value=i.base_value),i.contrib_sum!==void 0&&(n.contrib_sum=i.contrib_sum),i.logit_total!==void 0&&(n.logit_total=i.logit_total),{kind:"shap_values",units:"logit",positive:s,negative:a,meta:n}}function F(i){const t=i.logistic_contributions||i,e=[];typeof t=="object"&&Object.entries(t).forEach(([r,o])=>{typeof o=="number"&&!["intercept","contrib_sum","logit_total"].includes(r)&&e.push({label:r,weight:o})}),e.sort((r,o)=>Math.abs(o.weight)-Math.abs(r.weight));const s=e.filter(r=>r.weight>0),a=e.filter(r=>r.weight<0),n={};return t.intercept!==void 0&&(n.base_value=t.intercept),t.contrib_sum!==void 0&&(n.contrib_sum=t.contrib_sum),t.logit_total!==void 0&&(n.logit_total=t.logit_total),i.contrib_sum!==void 0&&(n.contrib_sum=i.contrib_sum),{kind:"logistic_contributions",units:"logit",positive:s,negative:a,meta:n}}function R(i){const t=[];Object.entries(i).forEach(([a,n])=>{typeof n=="number"&&t.push({label:a,weight:n})}),t.sort((a,n)=>Math.abs(n.weight)-Math.abs(a.weight));const e=t.filter(a=>a.weight>0),s=t.filter(a=>a.weight<0);return{kind:"raw_weights",units:null,positive:e,negative:s,meta:{}}}function H(i){return Object.values(i).every(t=>typeof t=="number")}function q(i,t){if(!(i!=null&&i.drivers)&&!(t!=null&&t.drivers))return"";let e=`
    <div class="drivers-section">
      <h3>Prediction Drivers</h3>
      <div class="drivers-grid">
  `;return i!=null&&i.drivers&&(e+=x(i.drivers,"ICH","ich")),t!=null&&t.drivers&&!t.notPossible&&(e+=x(t.drivers,"LVO","lvo")),e+=`
      </div>
    </div>
  `,e}function x(i,t,e){if(!i||Object.keys(i).length===0)return`
      <div class="drivers-panel">
        <h4>
          <span class="driver-icon ${e}">${e==="ich"?"I":"L"}</span>
          ${t} Risk Factors
        </h4>
        <p style="color: var(--text-secondary); font-style: italic;">
          Driver information not available from this prediction model.
        </p>
      </div>
    `;const s=P(i);if(s.kind==="unavailable")return`
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
  `;return s.positive.length>0&&s.positive.forEach(n=>{const r=Math.abs(n.weight*100),o=Math.min(r*2,100);a+=`
        <div class="driver-item">
          <span class="driver-label">${n.label}</span>
          <div class="driver-bar-container">
            <div class="driver-bar positive" style="width: ${o}%">
              <span class="driver-value">+${r.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      `}),s.negative.length>0&&s.negative.forEach(n=>{const r=Math.abs(n.weight*100),o=Math.min(r*2,100);a+=`
        <div class="driver-item">
          <span class="driver-label">${n.label}</span>
          <div class="driver-bar-container">
            <div class="driver-bar negative" style="width: ${o}%">
              <span class="driver-value">-${r.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      `}),s.meta&&Object.keys(s.meta).length>0&&(a+=`
      <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid var(--border-color);">
        <small style="color: var(--text-secondary);">
    `,s.meta.base_value!==void 0&&(a+=`Base value: ${s.meta.base_value.toFixed(2)} `),s.meta.contrib_sum!==void 0&&(a+=`Contrib sum: ${s.meta.contrib_sum.toFixed(2)} `),s.meta.logit_total!==void 0&&(a+=`Logit total: ${s.meta.logit_total.toFixed(2)}`),a+=`
        </small>
      </div>
    `),a+="</div>",a}function E(i,t){const e=Number(i),s=g[t];return e>=s.critical?"🔴 CRITICAL RISK":e>=s.high?"🟠 HIGH RISK":e>=30?"🟡 MODERATE RISK":"🟢 LOW RISK"}function N(i){const t=Math.floor(i/1e3),e=Math.floor(t/60),s=t%60;return`${e}:${s.toString().padStart(2,"0")}`}function V(i,t,e){return`
    <div class="result-card info">
      <h3>📋 Clinical Recommendations</h3>
      <ul style="text-align: left; margin: 10px 0;">
        ${j(i,t).map(a=>`<li>${a}</li>`).join("")}
      </ul>
      <p style="margin-top: 15px;">
        <strong>Time since assessment started:</strong> ${N(Date.now()-e)}
      </p>
    </div>
  `}function j(i,t){const e=[];if(i){const s=i.probability*100;s>80?(e.push("🚨 IMMEDIATE: Urgent CT imaging required"),e.push("🚨 Consider immediate BP management if SBP > 150"),e.push("🚨 Prepare for potential neurosurgical consultation")):s>60?(e.push("⚠️ HIGH PRIORITY: Expedite CT imaging"),e.push("⚠️ Monitor blood pressure closely"),e.push("⚠️ Consider withholding anticoagulation")):s>30?(e.push("📍 Standard stroke protocol with close monitoring"),e.push("📍 Obtain CT imaging as per protocol")):e.push("✓ Low ICH risk - proceed with standard evaluation")}if(t&&!t.notPossible){const s=t.probability*100;s>70?(e.push("🚁 Consider direct transport to comprehensive stroke center"),e.push("🚁 Alert interventional team for potential thrombectomy")):s>50?(e.push("🏥 Transport to stroke-capable facility"),e.push("🏥 Consider CTA for LVO confirmation")):s>30&&e.push("📊 Moderate LVO risk - standard stroke evaluation")}return e.push("⏱️ Document symptom onset time accurately"),e.push("📞 Notify receiving facility early for resource preparation"),e}function B(i,t){const{ich:e,lvo:s}=i;let a="",n="";if(e){const l=Math.round(e.probability*100);a=`
      <div class="result-card ${l>g.ich.critical?"critical":"ich"}">
        <h3> 🧠 ICH Probability <small>(${e.module} Module)</small> </h3>
        <div class="probability-display">${l}%</div>
        <div class="probability-meter">
          <div class="probability-fill" style="width: ${l}%"></div>
          <div class="probability-marker" style="left: ${l}%">${l}%</div>
        </div>
        <p><strong>Risk Level:</strong> ${E(l,"ich")}</p>
        <p><strong>Confidence:</strong> ${(e.confidence*100).toFixed(0)}%</p>
      </div>
    `}if(s)if(s.notPossible)n=`
        <div class="result-card info">
          <h3>🔍 LVO Prediction</h3>
          <p>LVO assessment not possible with limited data.</p>
          <p>A full neurological examination is required for LVO screening.</p>
        </div>
      `;else{const l=Math.round(s.probability*100);n=`
        <div class="result-card ${l>g.lvo.critical?"critical":"lvo"}">
          <h3> 🩸 LVO Probability <small>(${s.module} Module)</small> </h3>
          <div class="probability-display">${l}%</div>
          <div class="probability-meter">
            <div class="probability-fill" style="width: ${l}%"></div>
            <div class="probability-marker" style="left: ${l}%">${l}%</div>
          </div>
          <p><strong>Risk Level:</strong> ${E(l,"lvo")}</p>
          <p><strong>Confidence:</strong> ${(s.confidence*100).toFixed(0)}%</p>
        </div>
      `}const r=e&&e.probability>.6?M():"",o=V(e,s,t),c=q(e,s);return`
    <div class="container">
      ${h(3)}
      <h2>Assessment Results</h2>
      <p class="subtitle">Clinical Decision Support Analysis</p>
      ${r}
      <div style="display: flex; flex-direction: column; gap: 20px;">
        ${a}
        ${n}
        ${o}
      </div>
      ${c}
      <button type="button" class="primary" id="printResults"> 📄 Print Results </button>
      <button type="button" class="secondary" data-action="reset"> Start New Assessment </button>
      <div class="disclaimer">
        <strong>⚠️ Important:</strong> These results are for clinical decision support only. Always use clinical judgment and follow institutional protocols. Results generated at ${new Date().toLocaleTimeString()}.
      </div>
    </div>
  `}function z(i,t,e){const s=[];return e.required&&!t&&t!==0&&s.push("This field is required"),e.min!==void 0&&t!==""&&!isNaN(t)&&parseFloat(t)<e.min&&s.push(`Value must be at least ${e.min}`),e.max!==void 0&&t!==""&&!isNaN(t)&&parseFloat(t)>e.max&&s.push(`Value must be at most ${e.max}`),e.pattern&&!e.pattern.test(t)&&s.push("Invalid format"),s}function G(i){let t=!0;const e={};return Object.entries(T).forEach(([s,a])=>{const n=i.elements[s];if(n){const r=z(s,n.value,a);r.length>0&&(e[s]=r,t=!1)}}),{isValid:t,validationErrors:e}}function U(i,t){Object.entries(t).forEach(([e,s])=>{const a=i.querySelector(`[name="${e}"]`);if(a){const n=a.closest(".input-group");if(n){n.classList.add("error"),n.querySelectorAll(".error-message").forEach(o=>o.remove());const r=document.createElement("div");r.className="error-message",r.innerHTML=`<span class="error-icon">⚠️</span> ${s[0]}`,n.appendChild(r)}}})}function Y(i){i.querySelectorAll(".input-group.error").forEach(t=>{t.classList.remove("error"),t.querySelectorAll(".error-message").forEach(e=>e.remove())})}class m extends Error{constructor(t,e,s){super(t),this.name="APIError",this.status=e,this.url=s}}function y(i){const t={...i};return Object.keys(t).forEach(e=>{const s=t[e];(typeof s=="boolean"||s==="on"||s==="true"||s==="false")&&(t[e]=s===!0||s==="on"||s==="true"?1:0)}),t}async function k(i,t){const e=new AbortController,s=setTimeout(()=>e.abort(),v.requestTimeout);try{const a=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(t),signal:e.signal,mode:"cors"});if(clearTimeout(s),!a.ok){let r=`HTTP ${a.status}`;try{const o=await a.json();r=o.error||o.message||r}catch{r=`${r}: ${a.statusText}`}throw new m(r,a.status,i)}return await a.json()}catch(a){throw clearTimeout(s),a.name==="AbortError"?new m("Request timeout - please try again",408,i):a instanceof m?a:new m("Network error - please check your connection and try again",0,i)}}async function K(i){const t=y(i);try{const e=await k(b.COMA_ICH,t);return{probability:e.probability||e.ich_probability,drivers:e.drivers||null,confidence:e.confidence||.75,module:"Coma"}}catch(e){throw console.error("Coma ICH prediction failed:",e),new m(`Failed to get ICH prediction: ${e.message}`,e.status,b.COMA_ICH)}}async function J(i){const t=y(i);try{const e=await k(b.LDM_ICH,t);return{probability:e.probability||e.ich_probability,drivers:e.drivers||null,confidence:e.confidence||.65,module:"Limited Data"}}catch(e){throw console.error("Limited Data ICH prediction failed:",e),new m(`Failed to get ICH prediction: ${e.message}`,e.status,b.LDM_ICH)}}async function W(i){var e,s,a,n,r,o;const t=y(i);try{const c=await k(b.FULL_STROKE,t),l={probability:c.ich_probability||((e=c.ich)==null?void 0:e.probability),drivers:c.ich_drivers||((s=c.ich)==null?void 0:s.drivers),confidence:c.ich_confidence||((a=c.ich)==null?void 0:a.confidence)||.85,module:"Full Stroke"},u={probability:c.lvo_probability||((n=c.lvo)==null?void 0:n.probability),drivers:c.lvo_drivers||((r=c.lvo)==null?void 0:r.drivers),confidence:c.lvo_confidence||((o=c.lvo)==null?void 0:o.confidence)||.85,module:"Full Stroke"};return{ich:l,lvo:u}}catch(c){throw console.error("Full Stroke prediction failed:",c),new m(`Failed to get stroke predictions: ${c.message}`,c.status,b.FULL_STROKE)}}function Q(i){d.logEvent("triage1_answer",{comatose:i}),w(i?"coma":"triage2")}function X(i){d.logEvent("triage2_answer",{examinable:i}),w(i?"full":"limited")}function w(i){d.logEvent("navigate",{from:d.getState().currentScreen,to:i}),d.navigate(i),window.scrollTo(0,0)}function Z(){d.hasUnsavedData()&&!confirm("Are you sure you want to start over? All entered data will be lost.")||(d.logEvent("reset"),d.reset())}async function ee(i,t){i.preventDefault();const e=i.target,s=e.dataset.module,a=G(e);if(!a.isValid){U(t,a.validationErrors);return}const n=new FormData(e),r={};n.forEach((l,u)=>{const f=e.elements[u];if(f&&f.type==="checkbox")r[u]=f.checked;else{const _=parseFloat(l);r[u]=isNaN(_)?l:_}}),d.setFormData(s,r);const o=e.querySelector("button[type=submit]"),c=o?o.innerHTML:"";o&&(o.disabled=!0,o.innerHTML='<span class="loading-spinner"></span> Analyzing...');try{let l;switch(s){case"coma":l={ich:await K(r),lvo:null};break;case"limited":l={ich:await J(r),lvo:{notPossible:!0}};break;case"full":l=await W(r);break;default:throw new Error("Unknown module: "+s)}d.setResults(l),d.logEvent("models_complete",{module:s,results:l}),w("results")}catch(l){console.error("Error running models:",l);let u="An error occurred during analysis. Please try again.";l instanceof m&&(u=l.message),te(t,u),o&&(o.disabled=!1,o.innerHTML=c)}}function te(i,t){i.querySelectorAll(".critical-alert").forEach(a=>{var n,r;(r=(n=a.querySelector("h4"))==null?void 0:n.textContent)!=null&&r.includes("Error")&&a.remove()});const e=document.createElement("div");e.className="critical-alert",e.innerHTML=`<h4><span class="alert-icon">⚠️</span> Error</h4><p>${t}</p>`;const s=i.querySelector(".container");s?s.prepend(e):i.prepend(e),setTimeout(()=>e.remove(),1e4)}function ie(i){const t=document.createElement("div");t.className="sr-only",t.setAttribute("role","status"),t.setAttribute("aria-live","polite");const e={triage1:"Coma assessment",triage2:"Examination capability assessment",coma:"Coma module",limited:"Limited data module",full:"Full stroke assessment",results:"Assessment results"};t.textContent=`Navigated to ${e[i]||i}`,document.body.appendChild(t),setTimeout(()=>t.remove(),1e3)}function se(i){const t={triage1:"Initial Assessment - Stroke Triage Assistant",triage2:"Examination Capability - Stroke Triage Assistant",coma:"Coma Module - Stroke Triage Assistant",limited:"Limited Data Module - Stroke Triage Assistant",full:"Full Stroke Module - Stroke Triage Assistant",results:"Assessment Results - Stroke Triage Assistant"};document.title=t[i]||"Stroke Triage Assistant"}function ae(){setTimeout(()=>{const i=document.querySelector("h2");i&&(i.setAttribute("tabindex","-1"),i.focus(),setTimeout(()=>i.removeAttribute("tabindex"),100))},100)}function A(i){const t=d.getState(),{currentScreen:e,results:s,startTime:a}=t;i.innerHTML="";let n="";switch(e){case"triage1":n=S();break;case"triage2":n=C();break;case"coma":n=I();break;case"limited":n=D();break;case"full":n=$();break;case"results":n=B(s,a);break;default:n=S()}i.innerHTML=n;const r=i.querySelector("form[data-module]");if(r){const o=r.dataset.module;ne(r,o)}re(i),ie(e),se(e),ae()}function ne(i,t){const e=d.getFormData(t);!e||Object.keys(e).length===0||Object.entries(e).forEach(([s,a])=>{const n=i.elements[s];n&&(n.type==="checkbox"?n.checked=a===!0||a==="on"||a==="true":n.value=a)})}function re(i){i.querySelectorAll('input[type="number"]').forEach(e=>{e.addEventListener("blur",()=>{Y(i)})}),i.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",s=>{const{action:a,value:n}=s.currentTarget.dataset,r=n==="true";switch(a){case"triage1":Q(r);break;case"triage2":X(r);break;case"reset":Z();break}})}),i.querySelectorAll("form[data-module]").forEach(e=>{e.addEventListener("submit",s=>{ee(s,i)})});const t=i.querySelector("#printResults");t&&t.addEventListener("click",()=>window.print())}class oe{constructor(){this.container=null,this.unsubscribe=null}async init(){if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",()=>this.init());return}if(this.container=document.getElementById("appContainer"),!this.container){console.error("App container not found");return}this.unsubscribe=d.subscribe(()=>{A(this.container)}),this.setupGlobalEventListeners(),this.initializeTheme(),this.startAutoSave(),this.setupSessionTimeout(),this.setCurrentYear(),A(this.container),console.log("Stroke Triage Assistant initialized")}setupGlobalEventListeners(){const t=document.getElementById("darkModeToggle");t&&t.addEventListener("click",()=>this.toggleDarkMode()),this.setupHelpModal(),this.setupFooterLinks(),document.addEventListener("keydown",e=>{if(e.key==="Escape"){const s=document.getElementById("helpModal");s&&s.classList.contains("show")&&(s.classList.remove("show"),s.setAttribute("aria-hidden","true"))}}),window.addEventListener("beforeunload",e=>{d.hasUnsavedData()&&(e.preventDefault(),e.returnValue="You have unsaved data. Are you sure you want to leave?")})}setupHelpModal(){const t=document.getElementById("helpButton"),e=document.getElementById("helpModal"),s=e==null?void 0:e.querySelector(".modal-close");t&&e&&(t.addEventListener("click",()=>{e.classList.add("show"),e.setAttribute("aria-hidden","false")}),s==null||s.addEventListener("click",()=>{e.classList.remove("show"),e.setAttribute("aria-hidden","true")}),e.addEventListener("click",a=>{a.target===e&&(e.classList.remove("show"),e.setAttribute("aria-hidden","true"))}))}setupFooterLinks(){var t,e;(t=document.getElementById("privacyLink"))==null||t.addEventListener("click",s=>{s.preventDefault(),this.showPrivacyPolicy()}),(e=document.getElementById("disclaimerLink"))==null||e.addEventListener("click",s=>{s.preventDefault(),this.showDisclaimer()})}initializeTheme(){const t=localStorage.getItem("theme"),e=document.getElementById("darkModeToggle");(t==="dark"||!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)&&(document.body.classList.add("dark-mode"),e&&(e.textContent="☀️"))}toggleDarkMode(){const t=document.getElementById("darkModeToggle");document.body.classList.toggle("dark-mode");const e=document.body.classList.contains("dark-mode");t&&(t.textContent=e?"☀️":"🌙"),localStorage.setItem("theme",e?"dark":"light")}startAutoSave(){setInterval(()=>{this.saveCurrentFormData()},v.autoSaveInterval)}saveCurrentFormData(){this.container.querySelectorAll("form[data-module]").forEach(e=>{const s=new FormData(e),a=e.dataset.module;if(a){const n={};s.forEach((c,l)=>{const u=e.elements[l];u&&u.type==="checkbox"?n[l]=u.checked:n[l]=c});const r=d.getFormData(a);JSON.stringify(r)!==JSON.stringify(n)&&d.setFormData(a,n)}})}setupSessionTimeout(){setTimeout(()=>{confirm("Your session has been idle for 30 minutes. Would you like to continue?")?this.setupSessionTimeout():d.reset()},v.sessionTimeout)}setCurrentYear(){const t=document.getElementById("currentYear");t&&(t.textContent=new Date().getFullYear())}showPrivacyPolicy(){alert("Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.")}showDisclaimer(){alert("Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.")}destroy(){this.unsubscribe&&this.unsubscribe()}}const le=new oe;le.init();
//# sourceMappingURL=index-CpAZgQBM.js.map
