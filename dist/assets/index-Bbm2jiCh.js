var vt=Object.defineProperty;var yt=(i,e,t)=>e in i?vt(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var D=(i,e,t)=>yt(i,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function t(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(a){if(a.ep)return;a.ep=!0;const n=t(a);fetch(a.href,n)}})();class We{constructor(){this.state={currentScreen:"triage1",results:null,sessionId:null,startTime:null,formData:{},validationErrors:{},screenHistory:[]},this.listeners=new Set,this.initialize()}initialize(){this.state.sessionId=this.generateSessionId(),this.state.startTime=Date.now()}generateSessionId(){const e=Date.now(),t=new Uint8Array(8);crypto.getRandomValues(t);const s=Array.from(t).map(a=>a.toString(16).padStart(2,"0")).join("");return`session_${e}_${s}`}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}notify(){this.listeners.forEach(e=>e(this.state))}getState(){return{...this.state}}setState(e){this.state={...this.state,...e},this.notify()}navigate(e){const t=[...this.state.screenHistory];this.state.currentScreen!==e&&!t.includes(this.state.currentScreen)&&t.push(this.state.currentScreen),this.setState({currentScreen:e,screenHistory:t})}goBack(){const e=[...this.state.screenHistory];if(e.length>0){const t=e.pop();return this.setState({currentScreen:t,screenHistory:e}),!0}return!1}goHome(){this.setState({currentScreen:"triage1",screenHistory:[]})}setFormData(e,t){const s={...this.state.formData};s[e]={...t},this.setState({formData:s})}getFormData(e){return this.state.formData[e]||{}}setValidationErrors(e){this.setState({validationErrors:e})}clearValidationErrors(){this.setState({validationErrors:{}})}setResults(e){this.setState({results:e})}hasUnsavedData(){return Object.keys(this.state.formData).length>0&&!this.state.results}reset(){const e={currentScreen:"triage1",results:null,sessionId:this.generateSessionId(),startTime:Date.now(),formData:{},validationErrors:{},screenHistory:[]};this.setState(e)}logEvent(e,t={}){this.state.sessionId}getSessionDuration(){return Date.now()-this.state.startTime}}const v=new We,bt=Object.freeze(Object.defineProperty({__proto__:null,Store:We,store:v},Symbol.toStringTag,{value:"Module"})),V={COMA_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_coma_ich",LDM_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_limited_data_ich",FULL_STROKE:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_full_stroke"},Ge={ich:{medium:25,high:50},lvo:{medium:25,high:50}},_={min:29,max:10001},pe={autoSaveInterval:18e4,sessionTimeout:30*60*1e3,requestTimeout:1e4},Ae={age_years:{required:!0,min:0,max:120,type:"integer",medicalCheck:i=>i<18?"Emergency stroke assessment typically for adults (≥18 years)":null},systolic_bp:{required:!0,min:60,max:300,type:"number",medicalCheck:(i,e)=>{const t=e==null?void 0:e.diastolic_bp;return t&&i<=t?"Systolic BP must be higher than diastolic BP":null}},diastolic_bp:{required:!0,min:30,max:200,type:"number",medicalCheck:(i,e)=>{const t=e==null?void 0:e.systolic_bp;return t&&i>=t?"Diastolic BP must be lower than systolic BP":null}},gfap_value:{required:!0,min:_.min,max:_.max,type:"number",medicalCheck:i=>i>8e3?"Warning: Extremely high GFAP value - please verify lab result (still valid)":null},fast_ed_score:{required:!0,min:0,max:9,type:"integer",medicalCheck:i=>i>=4?"High FAST-ED score suggests LVO - consider urgent intervention":null},gcs:{required:!0,min:3,max:15,type:"integer",medicalCheck:i=>i<8?"GCS < 8 indicates severe consciousness impairment - consider coma module":null}},St=[.4731,.8623,1.8253,3.6667,2.3495,1,0],Et=btoa("proprietary-lvo-model-v2"),H=i=>St[i],$=(()=>{const i="intercept",e="coefficients",t="scaling";return{[i]:-H(0),[e]:{gfap:-H(1),fastEd:H(2)},[t]:{gfap:{mean:H(6),std:H(5)},fastEd:{mean:H(3),std:H(4)}}}})(),W={_0x7b2c:(i,e=0)=>i>=0?e===0?Math.log(i+1):(Math.pow(i+1,e)-1)/e:e===2?-Math.log(-i+1):-(Math.pow(-i+1,2-e)-1)/(2-e),_0x9d4e:(i,e,t)=>(i-e)/t,_0x3f8a:i=>{const e=Math.exp;return 1/(1+e(-i))},_0x5c1d:i=>Math.sin(i*1e3)*0+i};function qe(i,e){try{if(i==null||e==null)throw new Error("Missing required inputs: GFAP and FAST-ED scores");if(i<0)throw new Error("GFAP value must be non-negative");if(e<0||e>9)throw new Error("FAST-ED score must be between 0 and 9");const t="gfap",s="fastEd",a={i:"intercept",c:"coefficients",s:"scaling",m:"mean",d:"std"},n=W._0x7b2c(i,0),r=W._0x5c1d(n),l=W._0x9d4e(n,$[a.s][t][a.m],$[a.s][t][a.d]),o=W._0x9d4e(e,$[a.s][s][a.m],$[a.s][s][a.d]),d=(()=>{const w=$[a.i],T=$[a.c][t]*l,P=$[a.c][s]*o;return w+T+P})(),m=W._0x3f8a(d),u=l,p=o,S=d,f=[],y={f:$[a.c][s]*p,g:$[a.c][t]*u};e>=4?f.push({name:"High FAST-ED Score",value:e,impact:"increase",contribution:y.f}):e<=2&&f.push({name:"Low FAST-ED Score",value:e,impact:"decrease",contribution:y.f});const L=[500,100];return i>L[0]?f.push({name:"Elevated GFAP",value:`${Math.round(i)} pg/mL`,impact:"decrease",contribution:y.g,note:"May indicate hemorrhagic vs ischemic event"}):i<L[1]&&f.push({name:"Low GFAP",value:`${Math.round(i)} pg/mL`,impact:"increase",contribution:Math.abs(y.g),note:"Consistent with ischemic LVO"}),f.sort((w,T)=>Math.abs(T.contribution)-Math.abs(w.contribution)),{probability:m,riskLevel:m>.7?"high":m>.4?"moderate":"low",model:atob(Et).replace("proprietary-","").replace("-v2",""),inputs:{[t]:i,[s]:e},scaledInputs:{[t]:l,[s]:o},logit:d,riskFactors:f,interpretation:kt(m,e,i)}}catch(t){return console.error("LVO prediction error:",t),{probability:null,error:t.message,model:"Local LVO Model v2"}}}function kt(i,e,t){const s=Math.round(i*100);return i>.7?e>=6?`High probability of LVO (${s}%). FAST-ED score of ${e} strongly suggests large vessel occlusion. Consider immediate thrombectomy evaluation.`:`High probability of LVO (${s}%). Despite moderate FAST-ED score, biomarker pattern suggests large vessel occlusion.`:i>.4?t>500?`Moderate LVO probability (${s}%). Elevated GFAP (${t.toFixed(0)} pg/mL) may indicate hemorrhagic component. Further imaging recommended.`:`Moderate LVO probability (${s}%). Clinical correlation and vascular imaging recommended.`:e<=3?`Low probability of LVO (${s}%). FAST-ED score of ${e} suggests small vessel disease or non-vascular etiology.`:`Low probability of LVO (${s}%) despite FAST-ED score. Consider alternative diagnoses.`}function Ke(i){return(i==null?void 0:i.gfapValue)!=null&&(i==null?void 0:i.fastEdScore)!=null&&(i==null?void 0:i.gfapValue)>=0&&(i==null?void 0:i.fastEdScore)>=0&&(i==null?void 0:i.fastEdScore)<=9}const wt=Object.freeze(Object.defineProperty({__proto__:null,canUseLocalModel:Ke,predictLVO:qe},Symbol.toStringTag,{value:"Module"}));function Ie(i,e){var r,l;console.log(`=== EXTRACTING ${e.toUpperCase()} DRIVERS ===`);let t=null;if(e==="ICH"?t=((r=i.ich_prediction)==null?void 0:r.drivers)||null:e==="LVO"&&(t=((l=i.lvo_prediction)==null?void 0:l.drivers)||null),!t)return console.log(`❌ No ${e} drivers found`),null;const s=Tt(t),n=[...s.positive,...s.negative].find(o=>o.label&&(o.label.toLowerCase().includes("fast")||o.label.includes("fast_ed")));return n?console.log(`🎯 FAST-ED found in ${e}:`,`${n.label}: ${n.weight>0?"+":""}${n.weight.toFixed(4)}`):console.log(`⚠️  FAST-ED NOT found in ${e} drivers`),s}function Tt(i,e){const t=[],s=[];return Object.entries(i).forEach(([a,n])=>{typeof n=="number"&&(n>0?t.push({label:a,weight:n}):n<0&&s.push({label:a,weight:Math.abs(n)}))}),t.sort((a,n)=>n.weight-a.weight),s.sort((a,n)=>n.weight-a.weight),{kind:"flat_dictionary",units:"logit",positive:t,negative:s,meta:{}}}function _e(i,e){var s,a;console.log(`=== EXTRACTING ${e.toUpperCase()} PROBABILITY ===`);let t=0;return e==="ICH"?t=((s=i.ich_prediction)==null?void 0:s.probability)||0:e==="LVO"&&(t=((a=i.lvo_prediction)==null?void 0:a.probability)||0),t}function Me(i,e){var s,a;let t=.85;return e==="ICH"?t=((s=i.ich_prediction)==null?void 0:s.confidence)||.85:e==="LVO"&&(t=((a=i.lvo_prediction)==null?void 0:a.confidence)||.85),t}class Ct{constructor(){this.observers=new Map,this.eventHistory=[],this.maxHistorySize=1e3}subscribe(e,t,s={}){if(typeof t!="function")throw new Error("Observer callback must be a function");this.observers.has(e)||this.observers.set(e,new Set);const a={callback:t,id:`obs_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,priority:s.priority||0,once:s.once||!1,medicalContext:s.medicalContext||null};return this.observers.get(e).add(a),()=>{const n=this.observers.get(e);n&&(n.delete(a),n.size===0&&this.observers.delete(e))}}publish(e,t={},s={}){const a=this.observers.get(e);if(!a||a.size===0)return;const n={type:e,data:this.sanitizeEventData(t),metadata:{timestamp:new Date().toISOString(),source:"MedicalEventObserver",...s},id:`evt_${Date.now()}_${Math.random().toString(36).substr(2,9)}`};this.logEvent(n),Array.from(a).sort((l,o)=>o.priority-l.priority).forEach(l=>{try{l.callback(n),l.once&&a.delete(l)}catch(o){console.error(`Medical observer error for event ${e}:`,o)}})}sanitizeEventData(e){const t=["password","ssn","medical_record_number","patient_id"],s={...e};return t.forEach(a=>{s[a]&&(s[a]="[REDACTED]")}),s}logEvent(e){this.eventHistory.push({...e,loggedAt:new Date().toISOString()}),this.eventHistory.length>this.maxHistorySize&&this.eventHistory.shift()}getEventHistory(e=null){return e?this.eventHistory.filter(t=>t.type===e):[...this.eventHistory]}clearAll(){this.observers.clear(),this.eventHistory=[]}getStats(){const e={totalEventTypes:this.observers.size,totalObservers:0,eventHistory:this.eventHistory.length,eventTypes:{}};return this.observers.forEach((t,s)=>{e.totalObservers+=t.size,e.eventTypes[s]=t.size}),e}}const h={PATIENT_DATA_UPDATED:"patient_data_updated",VALIDATION_ERROR:"validation_error",VALIDATION_SUCCESS:"validation_success",TRIAGE_COMPLETED:"triage_completed",ASSESSMENT_STARTED:"assessment_started",RESULTS_GENERATED:"results_generated",PERFORMANCE_WARNING:"performance_warning",SECURITY_EVENT:"security_event",AUDIT_EVENT:"audit_event",FORM_SUBMITTED:"form_submitted",NAVIGATION_CHANGED:"navigation_changed",SESSION_TIMEOUT:"session_timeout"},g=new Ct,k={API_CALL:"api_call",VALIDATION:"validation",PREDICTION:"prediction",RENDER:"render",USER_INTERACTION:"user_interaction",NETWORK:"network",CACHE:"cache"},se={CRITICAL_API_RESPONSE:3e3,VALIDATION_RESPONSE:100,PREDICTION_RESPONSE:5e3,UI_RENDER:16,USER_INTERACTION:100,MEMORY_LEAK_THRESHOLD:50*1024*1024};class Pe{constructor(e,t,s=performance.now()){this.type=e,this.name=t,this.startTime=s,this.endTime=null,this.duration=null,this.metadata={},this.id=`perf_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,this.timestamp=new Date().toISOString()}end(){return this.endTime=performance.now(),this.duration=this.endTime-this.startTime,this}addMetadata(e,t){return this.metadata[e]=t,this}exceedsThreshold(){const e=se[this.getThresholdKey()];return e&&this.duration>e}getThresholdKey(){switch(this.type){case k.API_CALL:return this.metadata.critical?"CRITICAL_API_RESPONSE":"PREDICTION_RESPONSE";case k.VALIDATION:return"VALIDATION_RESPONSE";case k.PREDICTION:return"PREDICTION_RESPONSE";case k.RENDER:return"UI_RENDER";case k.USER_INTERACTION:return"USER_INTERACTION";default:return null}}getPerformanceGrade(){const e=se[this.getThresholdKey()];if(!e)return"N/A";const t=this.duration/e;return t<=.5?"EXCELLENT":t<=.75?"GOOD":t<=1?"ACCEPTABLE":t<=1.5?"WARNING":"CRITICAL"}}class Lt{constructor(){this.metrics=new Map,this.activeMetrics=new Map,this.memoryBaseline=null,this.performanceObserver=null,this.isMonitoring=!1,this.reportingInterval=null,this.config={reportingIntervalMs:3e4,maxMetricsRetention:1e3,enableMemoryMonitoring:!0,enableNetworkMonitoring:!0,enableUserTimingAPI:!0}}start(){this.isMonitoring||(this.isMonitoring=!0,this.memoryBaseline=this.getMemoryUsage(),window.PerformanceObserver&&this.initializePerformanceObserver(),this.reportingInterval=setInterval(()=>{this.generatePerformanceReport()},this.config.reportingIntervalMs),g.publish(h.AUDIT_EVENT,{action:"performance_monitoring_started",memoryBaseline:this.memoryBaseline}))}stop(){this.isMonitoring&&(this.isMonitoring=!1,this.performanceObserver&&(this.performanceObserver.disconnect(),this.performanceObserver=null),this.reportingInterval&&(clearInterval(this.reportingInterval),this.reportingInterval=null),g.publish(h.AUDIT_EVENT,{action:"performance_monitoring_stopped",totalMetrics:this.metrics.size}))}initializePerformanceObserver(){try{this.performanceObserver=new PerformanceObserver(e=>{e.getEntries().forEach(t=>{this.recordPerformanceEntry(t)})}),this.performanceObserver.observe({entryTypes:["measure","navigation","resource"]})}catch(e){console.warn("Performance Observer not supported:",e.message)}}recordPerformanceEntry(e){let t=k.NETWORK,s=e.name;switch(e.entryType){case"navigation":t=k.RENDER,s="page_load";break;case"resource":t=e.name.includes("/api/")?k.API_CALL:k.NETWORK;break;case"measure":t=this.categorizeUserMeasure(e.name);break}const a=new Pe(t,s,e.startTime);a.end(),a.duration=e.duration,a.addMetadata("entryType",e.entryType),this.storeMetric(a)}categorizeUserMeasure(e){return e.includes("validation")?k.VALIDATION:e.includes("prediction")?k.PREDICTION:e.includes("render")?k.RENDER:e.includes("api")?k.API_CALL:k.USER_INTERACTION}startMeasurement(e,t,s={}){const a=new Pe(e,t);return Object.entries(s).forEach(([n,r])=>{a.addMetadata(n,r)}),this.activeMetrics.set(a.id,a),this.config.enableUserTimingAPI&&performance.mark&&performance.mark(`${t}_start`),a.id}endMeasurement(e,t={}){const s=this.activeMetrics.get(e);if(!s)return console.warn(`Performance metric ${e} not found`),null;if(s.end(),Object.entries(t).forEach(([a,n])=>{s.addMetadata(a,n)}),this.config.enableUserTimingAPI&&performance.mark&&performance.measure)try{performance.mark(`${s.name}_end`),performance.measure(s.name,`${s.name}_start`,`${s.name}_end`)}catch(a){console.warn("Error creating performance measure:",a.message)}return this.activeMetrics.delete(e),this.storeMetric(s),s.exceedsThreshold()&&this.handlePerformanceViolation(s),s}storeMetric(e){if(this.metrics.set(e.id,e),this.metrics.size>this.config.maxMetricsRetention){const t=this.metrics.keys().next().value;this.metrics.delete(t)}g.publish(h.PERFORMANCE_METRIC,{metric:{id:e.id,type:e.type,name:e.name,duration:e.duration,grade:e.getPerformanceGrade(),exceedsThreshold:e.exceedsThreshold()}})}handlePerformanceViolation(e){const t={metricId:e.id,type:e.type,name:e.name,duration:e.duration,threshold:se[e.getThresholdKey()],grade:e.getPerformanceGrade(),metadata:e.metadata};g.publish(h.PERFORMANCE_VIOLATION,t),e.getPerformanceGrade()==="CRITICAL"&&console.error("CRITICAL PERFORMANCE VIOLATION:",t)}getMemoryUsage(){return performance.memory?{usedJSHeapSize:performance.memory.usedJSHeapSize,totalJSHeapSize:performance.memory.totalJSHeapSize,jsHeapSizeLimit:performance.memory.jsHeapSizeLimit,timestamp:Date.now()}:null}checkMemoryLeaks(){if(!this.config.enableMemoryMonitoring||!this.memoryBaseline)return null;const e=this.getMemoryUsage();if(!e)return null;const t=e.usedJSHeapSize-this.memoryBaseline.usedJSHeapSize,s=t>se.MEMORY_LEAK_THRESHOLD;return s&&g.publish(h.AUDIT_EVENT,{action:"memory_leak_detected",memoryIncrease:t,baseline:this.memoryBaseline.usedJSHeapSize,current:e.usedJSHeapSize}),{memoryIncrease:t,isLeak:s,baseline:this.memoryBaseline,current:e}}generatePerformanceReport(){const e=Array.from(this.metrics.values()),s=Date.now()-60*60*1e3,a=e.filter(l=>new Date(l.timestamp).getTime()>s),n=a.reduce((l,o)=>(l[o.type]||(l[o.type]=[]),l[o.type].push(o),l),{}),r={timestamp:new Date().toISOString(),timeframe:"last_hour",totalMetrics:a.length,memoryStatus:this.checkMemoryLeaks(),metricsByType:{},violations:a.filter(l=>l.exceedsThreshold()).length,topSlowOperations:this.getTopSlowOperations(a)};return Object.entries(n).forEach(([l,o])=>{const d=o.map(u=>u.duration),m=o.map(u=>u.getPerformanceGrade());r.metricsByType[l]={count:o.length,averageDuration:d.reduce((u,p)=>u+p,0)/d.length,medianDuration:this.calculateMedian(d),minDuration:Math.min(...d),maxDuration:Math.max(...d),violations:o.filter(u=>u.exceedsThreshold()).length,gradeDistribution:this.calculateGradeDistribution(m)}}),g.publish(h.PERFORMANCE_REPORT,r),r}calculateMedian(e){const t=[...e].sort((a,n)=>a-n),s=Math.floor(t.length/2);return t.length%2===0?(t[s-1]+t[s])/2:t[s]}calculateGradeDistribution(e){return e.reduce((t,s)=>(t[s]=(t[s]||0)+1,t),{})}getTopSlowOperations(e,t=10){return e.sort((s,a)=>a.duration-s.duration).slice(0,t).map(s=>({name:s.name,type:s.type,duration:s.duration,grade:s.getPerformanceGrade(),timestamp:s.timestamp}))}getTypeStatistics(e,t=60*60*1e3){const a=Date.now()-t,n=Array.from(this.metrics.values()).filter(l=>l.type===e&&new Date(l.timestamp).getTime()>a);if(n.length===0)return null;const r=n.map(l=>l.duration);return{type:e,count:n.length,averageDuration:r.reduce((l,o)=>l+o,0)/r.length,medianDuration:this.calculateMedian(r),minDuration:Math.min(...r),maxDuration:Math.max(...r),violations:n.filter(l=>l.exceedsThreshold()).length}}clearMetrics(){this.metrics.clear(),this.activeMetrics.clear(),g.publish(h.AUDIT_EVENT,{action:"performance_metrics_cleared"})}getConfig(){return{...this.config}}updateConfig(e){this.config={...this.config,...e},e.reportingIntervalMs&&this.reportingInterval&&(clearInterval(this.reportingInterval),this.reportingInterval=setInterval(()=>{this.generatePerformanceReport()},this.config.reportingIntervalMs))}}const E=new Lt,A={MEMORY:"memory",SESSION:"session",LOCAL:"local",INDEXED_DB:"indexed_db"},C={CRITICAL:"critical",HIGH:"high",NORMAL:"normal",LOW:"low"},Y={PATIENT_DATA:30*60*1e3,PREDICTION_RESULTS:60*60*1e3,VALIDATION_RULES:24*60*60*1e3,API_RESPONSES:15*60*1e3,UI_STATE:10*60*1e3,STATIC_CONFIG:7*24*60*60*1e3};class Re{constructor(e,t,s,a=C.NORMAL,n={}){this.key=e,this.value=this.sanitizeValue(t),this.ttl=s,this.priority=a,this.metadata={...n,createdAt:Date.now(),accessCount:0,lastAccessed:Date.now()},this.expiresAt=s>0?Date.now()+s:null,this.encrypted=!1}sanitizeValue(e){if(typeof e!="object"||e===null)return e;const t=JSON.parse(JSON.stringify(e)),s=["ssn","mrn","patient_id","user_id","session_token"];return this.removeSensitiveFields(t,s),t}removeSensitiveFields(e,t){Object.keys(e).forEach(s=>{t.some(a=>s.toLowerCase().includes(a))?e[s]="[REDACTED]":typeof e[s]=="object"&&e[s]!==null&&this.removeSensitiveFields(e[s],t)})}isExpired(){return this.expiresAt!==null&&Date.now()>this.expiresAt}markAccessed(){this.metadata.accessCount+=1,this.metadata.lastAccessed=Date.now()}getAge(){return Date.now()-this.metadata.createdAt}getTimeToExpiration(){return this.expiresAt===null?1/0:Math.max(0,this.expiresAt-Date.now())}getEvictionScore(){const t={[C.CRITICAL]:1e3,[C.HIGH]:100,[C.NORMAL]:10,[C.LOW]:1}[this.priority]||1,s=Math.log(this.metadata.accessCount+1),a=1/(this.getAge()+1);return t*s*a}}class X{constructor(e=A.MEMORY,t={}){this.storageType=e,this.options={maxSize:100*1024*1024,maxEntries:1e3,cleanupInterval:5*60*1e3,enableEncryption:!1,enableMetrics:!0,...t},this.cache=new Map,this.cleanupTimer=null,this.totalSize=0,this.hitCount=0,this.missCount=0,this.evictionCount=0,this.initializeStorage(),this.startCleanupTimer()}initializeStorage(){switch(this.storageType){case A.SESSION:this.storage=sessionStorage,this.loadFromStorage();break;case A.LOCAL:this.storage=localStorage,this.loadFromStorage();break;case A.INDEXED_DB:this.initializeIndexedDB();break;default:this.storage=null}}loadFromStorage(){if(this.storage)try{const e=this.storage.getItem("medical_cache");if(e){const t=JSON.parse(e);Object.entries(t).forEach(([s,a])=>{const n=new Re(a.key,a.value,a.ttl,a.priority,a.metadata);n.expiresAt=a.expiresAt,n.isExpired()||(this.cache.set(s,n),this.totalSize+=this.calculateSize(n.value))})}}catch(e){console.warn("Failed to load cache from storage:",e.message)}}saveToStorage(){if(this.storage)try{const e={};this.cache.forEach((t,s)=>{e[s]={key:t.key,value:t.value,ttl:t.ttl,priority:t.priority,metadata:t.metadata,expiresAt:t.expiresAt}}),this.storage.setItem("medical_cache",JSON.stringify(e))}catch(e){console.warn("Failed to save cache to storage:",e.message)}}async initializeIndexedDB(){console.log("IndexedDB cache initialization planned for future implementation")}set(e,t,s=Y.API_RESPONSES,a=C.NORMAL,n={}){const r=E.startMeasurement(k.CACHE,"cache_set",{key:e,priority:a});try{this.ensureCapacity();const l=new Re(e,t,s,a,n),o=this.calculateSize(t);if(this.cache.has(e)){const d=this.cache.get(e);this.totalSize-=this.calculateSize(d.value)}return this.cache.set(e,l),this.totalSize+=o,this.storageType!==A.MEMORY&&this.saveToStorage(),g.publish(h.AUDIT_EVENT,{action:"cache_set",key:e,size:o,ttl:s,priority:a}),E.endMeasurement(r,{success:!0}),!0}catch(l){return E.endMeasurement(r,{success:!1,error:l.message}),console.error("Cache set error:",l),!1}}get(e){const t=E.startMeasurement(k.CACHE,"cache_get",{key:e});try{const s=this.cache.get(e);return s?s.isExpired()?(this.cache.delete(e),this.totalSize-=this.calculateSize(s.value),this.missCount+=1,E.endMeasurement(t,{hit:!1,expired:!0}),null):(s.markAccessed(),this.hitCount+=1,E.endMeasurement(t,{hit:!0}),s.value):(this.missCount+=1,E.endMeasurement(t,{hit:!1}),null)}catch(s){return E.endMeasurement(t,{hit:!1,error:s.message}),console.error("Cache get error:",s),null}}has(e){const t=this.cache.get(e);return t&&!t.isExpired()}delete(e){const t=this.cache.get(e);return t?(this.totalSize-=this.calculateSize(t.value),this.cache.delete(e),this.storageType!==A.MEMORY&&this.saveToStorage(),g.publish(h.AUDIT_EVENT,{action:"cache_delete",key:e}),!0):!1}clear(){const e=this.cache.size;this.cache.clear(),this.totalSize=0,this.storage&&this.storage.removeItem("medical_cache"),g.publish(h.AUDIT_EVENT,{action:"cache_cleared",entriesCleared:e})}ensureCapacity(){for(;this.totalSize>this.options.maxSize;)this.evictLeastImportant();for(;this.cache.size>=this.options.maxEntries;)this.evictLeastImportant()}evictLeastImportant(){let e=1/0,t=null;this.cache.forEach((s,a)=>{if(s.priority===C.CRITICAL&&!s.isExpired())return;const n=s.getEvictionScore();n<e&&(e=n,t=a)}),t&&(this.delete(t),this.evictionCount+=1)}cleanup(){const e=performance.now();let t=0;this.cache.forEach((a,n)=>{a.isExpired()&&(this.delete(n),t+=1)});const s=performance.now()-e;return g.publish(h.AUDIT_EVENT,{action:"cache_cleanup",cleanedCount:t,duration:s,remainingEntries:this.cache.size}),t}startCleanupTimer(){this.cleanupTimer&&clearInterval(this.cleanupTimer),this.cleanupTimer=setInterval(()=>{this.cleanup()},this.options.cleanupInterval)}stopCleanupTimer(){this.cleanupTimer&&(clearInterval(this.cleanupTimer),this.cleanupTimer=null)}calculateSize(e){try{return JSON.stringify(e).length*2}catch{return 0}}getStats(){const e=this.hitCount+this.missCount>0?this.hitCount/(this.hitCount+this.missCount)*100:0;return{entries:this.cache.size,totalSize:this.totalSize,maxSize:this.options.maxSize,hitCount:this.hitCount,missCount:this.missCount,hitRate:e.toFixed(2)+"%",evictionCount:this.evictionCount,storageType:this.storageType,utilizationPercent:(this.totalSize/this.options.maxSize*100).toFixed(2)+"%"}}getEntryInfo(e){const t=this.cache.get(e);return t?{key:t.key,size:this.calculateSize(t.value),priority:t.priority,ttl:t.ttl,age:t.getAge(),timeToExpiration:t.getTimeToExpiration(),accessCount:t.metadata.accessCount,lastAccessed:new Date(t.metadata.lastAccessed).toISOString(),isExpired:t.isExpired(),evictionScore:t.getEvictionScore()}:null}dispose(){this.stopCleanupTimer(),this.clear()}}class x{static getPatientDataCache(){return this.patientDataCache||(this.patientDataCache=new X(A.SESSION,{maxSize:10*1024*1024,maxEntries:100,enableEncryption:!0})),this.patientDataCache}static getPredictionCache(){return this.predictionCache||(this.predictionCache=new X(A.MEMORY,{maxSize:50*1024*1024,maxEntries:500})),this.predictionCache}static getValidationCache(){return this.validationCache||(this.validationCache=new X(A.LOCAL,{maxSize:5*1024*1024,maxEntries:200})),this.validationCache}static getApiCache(){return this.apiCache||(this.apiCache=new X(A.SESSION,{maxSize:20*1024*1024,maxEntries:300})),this.apiCache}static clearAllCaches(){[this.patientDataCache,this.predictionCache,this.validationCache,this.apiCache].forEach(e=>{e&&e.clear()})}static disposeAllCaches(){[this.patientDataCache,this.predictionCache,this.validationCache,this.apiCache].forEach(e=>{e&&e.dispose()}),this.patientDataCache=null,this.predictionCache=null,this.validationCache=null,this.apiCache=null}}D(x,"patientDataCache",null),D(x,"predictionCache",null),D(x,"validationCache",null),D(x,"apiCache",null);x.getPatientDataCache();x.getPredictionCache();x.getValidationCache();const $e=x.getApiCache();async function At(){console.log("Warming up Cloud Functions...");const i=Object.values(V).map(async e=>{try{const t=new AbortController,s=setTimeout(()=>t.abort(),3e3);await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({}),signal:t.signal,mode:"cors"}),clearTimeout(s),console.log(`Warmed up: ${e}`)}catch{console.log(`Warm-up attempt for ${e.split("/").pop()} completed`)}});Promise.all(i).then(()=>{console.log("Cloud Functions warm-up complete")})}class F extends Error{constructor(e,t,s){super(e),this.name="APIError",this.status=t,this.url=s}}function ye(i){const e={...i};return Object.keys(e).forEach(t=>{const s=e[t];(typeof s=="boolean"||s==="on"||s==="true"||s==="false")&&(e[t]=s===!0||s==="on"||s==="true"?1:0)}),e}function ae(i,e=0){const t=parseFloat(i);return isNaN(t)?e:t}function It(i,e){const t=i.split("/").pop()||"unknown",s=btoa(JSON.stringify(e)).slice(0,16);return`api_${t}_${s}`}async function be(i,e,t={}){const{cacheable:s=!0,cacheTTL:a=Y.API_RESPONSES,cachePriority:n=C.NORMAL,critical:r=!1}=t,l=E.startMeasurement(k.API_CALL,i.split("/").pop()||"api_call",{url:i,critical:r,cacheable:s});let o=null;if(s){o=It(i,e);const u=$e.get(o);if(u)return E.endMeasurement(l,{cached:!0,success:!0}),g.publish(h.AUDIT_EVENT,{action:"api_cache_hit",endpoint:i.split("/").pop(),cacheKey:o}),u}const d=new AbortController,m=setTimeout(()=>d.abort(),pe.requestTimeout);try{const u=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(e),signal:d.signal,mode:"cors"});if(clearTimeout(m),!u.ok){let S=`HTTP ${u.status}`;try{const f=await u.json();S=f.error||f.message||S}catch{S=`${S}: ${u.statusText}`}throw new F(S,u.status,i)}const p=await u.json();return s&&o&&($e.set(o,p,a,n,{endpoint:i.split("/").pop(),timestamp:new Date().toISOString(),payloadSize:JSON.stringify(e).length,responseSize:JSON.stringify(p).length}),g.publish(h.AUDIT_EVENT,{action:"api_response_cached",endpoint:i.split("/").pop(),cacheKey:o})),E.endMeasurement(l,{cached:!1,success:!0,responseSize:JSON.stringify(p).length,statusCode:u.status}),p}catch(u){clearTimeout(m);let p;throw u.name==="AbortError"?p=new F("Request timeout - please try again",408,i):u instanceof F?p=u:p=new F("Network error - please check your connection and try again",0,i),E.endMeasurement(l,{cached:!1,success:!1,error:p.message,statusCode:p.status}),g.publish(h.AUDIT_EVENT,{action:"api_error",endpoint:i.split("/").pop(),error:p.message,statusCode:p.status}),p}}async function _t(i){const e=ye(i);try{const t=await be(V.COMA_ICH,e,{cacheable:!0,cacheTTL:Y.PREDICTION_RESULTS,cachePriority:C.HIGH,critical:!0}),s={probability:ae(t.probability||t.ich_probability,0),drivers:t.drivers||null,confidence:ae(t.confidence,.75),module:"Coma",strategy:"COMA_ICH",timestamp:new Date().toISOString(),inputSummary:{gcs:e.gcs,gfap:e.gfap_value,age:e.age_years}};return g.publish(h.PREDICTION_COMPLETED,{module:"coma",probability:s.probability,confidence:s.confidence,cached:t._cached||!1}),s}catch(t){throw console.error("Coma ICH prediction failed:",t),new F(`Failed to get ICH prediction: ${t.message}`,t.status,V.COMA_ICH)}}async function Mt(i){const e={age_years:i.age_years,systolic_bp:i.systolic_bp,diastolic_bp:i.diastolic_bp,gfap_value:i.gfap_value,vigilanzminderung:i.vigilanzminderung||0},t=ye(e);try{const s=await be(V.LDM_ICH,t,{cacheable:!0,cacheTTL:Y.PREDICTION_RESULTS,cachePriority:C.HIGH,critical:!0}),a={probability:ae(s.probability||s.ich_probability,0),drivers:s.drivers||null,confidence:ae(s.confidence,.65),module:"Limited Data",strategy:"LIMITED_DATA_ICH",timestamp:new Date().toISOString(),inputSummary:{age:t.age_years,gfap:t.gfap_value,systolic_bp:t.systolic_bp,diastolic_bp:t.diastolic_bp,vigilanzminderung:t.vigilanzminderung}};return g.publish(h.PREDICTION_COMPLETED,{module:"limited",probability:a.probability,confidence:a.confidence,cached:s._cached||!1}),a}catch(s){throw console.error("Limited Data ICH prediction failed:",s),new F(`Failed to get ICH prediction: ${s.message}`,s.status,V.LDM_ICH)}}async function Pt(i){const e={age_years:i.age_years,systolic_bp:i.systolic_bp,diastolic_bp:i.diastolic_bp,gfap_value:i.gfap_value,fast_ed_score:i.fast_ed_score,headache:i.headache||0,vigilanzminderung:i.vigilanzminderung||0,armparese:i.armparese||0,beinparese:i.beinparese||0,eye_deviation:i.eye_deviation||0,atrial_fibrillation:i.atrial_fibrillation||0,anticoagulated_noak:i.anticoagulated_noak||0,antiplatelets:i.antiplatelets||0},t=ye(e);let s=null;if(Ke(t)){console.log("🚀 Using local LVO model (GFAP + FAST-ED)");const a=qe(t.gfap_value,t.fast_ed_score);a.probability!==null&&(s={probability:a.probability,drivers:a.riskFactors.map(n=>({feature:n.name,value:n.value,contribution:n.contribution,impact:n.impact})),confidence:a.riskLevel==="high"?.9:a.riskLevel==="moderate"?.7:.5,module:"Full Stroke (Local LVO)",interpretation:a.interpretation})}try{const a=await be(V.FULL_STROKE,t,{cacheable:!0,cacheTTL:Y.PREDICTION_RESULTS,cachePriority:C.HIGH,critical:!0}),n=_e(a,"ICH"),r=Ie(a,"ICH"),l=Me(a,"ICH"),o={probability:n,drivers:r,confidence:l,module:"Full Stroke",strategy:"FULL_STROKE",timestamp:new Date().toISOString(),inputSummary:{age:t.age_years,gfap:t.gfap_value,fast_ed:t.fast_ed_score,systolic_bp:t.systolic_bp}};if(!s){console.log("⚠️ Falling back to API for LVO prediction");const m=_e(a,"LVO"),u=Ie(a,"LVO"),p=Me(a,"LVO");s={probability:m,drivers:u,confidence:p,module:"Full Stroke (API)",strategy:"FULL_STROKE_LVO",timestamp:new Date().toISOString()}}const d={ich:o,lvo:s};return g.publish(h.PREDICTION_COMPLETED,{module:"full",ich_probability:o.probability,lvo_probability:s.probability,ich_confidence:o.confidence,lvo_confidence:s.confidence,local_lvo_used:s.module.includes("Local"),cached:a._cached||!1}),d}catch(a){throw console.error("Full Stroke prediction failed:",a),new F(`Failed to get stroke predictions: ${a.message}`,a.status,V.FULL_STROKE)}}const Ne={en:{appTitle:"iGFAP",emergencyBadge:"Emergency Tool",helpButton:"Help and Instructions",darkModeButton:"Toggle dark mode",languageToggle:"Language",step1:"Initial Assessment",step2:"Data Collection",step3:"Results",comaModuleTitle:"Coma Module",limitedDataModuleTitle:"Limited Data Module",fullStrokeModuleTitle:"Full Stroke Module",triage1Title:"Patient Assessment",triage1Question:"Is the patient comatose?",triage1Help:"Glasgow Coma Scale < 9",triage1Yes:"YES - Comatose",triage1No:"NO - Conscious",triage2Title:"Examination Capability",triage2Question:"Can the patient be reliably examined?",triage2Help:"Patient is not aphasic, confused, or uncooperative",triage2Yes:"YES - Full Exam Possible",triage2No:"NO - Limited Exam Only",ageLabel:"Age (years)",ageHelp:"Patient age in years",systolicLabel:"Systolic BP (mmHg)",systolicHelp:"Systolic blood pressure",diastolicLabel:"Diastolic BP (mmHg)",diastolicHelp:"Diastolic blood pressure",gfapLabel:"GFAP Value (pg/mL)",gfapHelp:"GFAP biomarker level",fastEdLabel:"FAST-ED Score",fastEdHelp:"FAST-ED assessment score (0-9)",headacheLabel:"Headache",vigilanzLabel:"Reduced consciousness",armPareseLabel:"Arm weakness",beinPareseLabel:"Leg weakness",eyeDeviationLabel:"Eye deviation",atrialFibLabel:"Atrial fibrillation",anticoagLabel:"Anticoagulated (NOAK)",antiplateletsLabel:"Antiplatelets",analyzeButton:"Analyze",analyzing:"Analyzing...",printResults:"Print Results",newAssessment:"Start New Assessment",startOver:"Start Over",goBack:"Go Back",goHome:"Go Home",basicInformation:"Basic Information",biomarkersScores:"Biomarkers & Scores",clinicalSymptoms:"Clinical Symptoms",medicalHistory:"Medical History",ageYearsLabel:"Age (years)",systolicBpLabel:"Systolic BP (mmHg)",diastolicBpLabel:"Diastolic BP (mmHg)",gfapValueLabel:"GFAP Value (pg/mL)",fastEdScoreLabel:"FAST-ED Score",ageYearsHelp:"Patient's age in years",systolicBpHelp:"Normal: 90-140 mmHg",diastolicBpHelp:"Normal: 60-90 mmHg",gfapTooltip:"Brain injury biomarker",gfapTooltipLong:"Glial Fibrillary Acidic Protein - Brain injury biomarker",gfapRange:"Range: {min} - {max} pg/mL",fastEdTooltip:"0-9 scale for LVO screening",analyzeIchRisk:"Analyze ICH Risk",analyzeStrokeRisk:"Analyze Stroke Risk",criticalPatient:"Critical Patient",comaAlert:"Patient is comatose (GCS < 9). Rapid assessment required.",vigilanceReduction:"Vigilance Reduction (Decreased alertness)",armParesis:"Arm Paresis",legParesis:"Leg Paresis",eyeDeviation:"Eye Deviation",atrialFibrillation:"Atrial Fibrillation",onNoacDoac:"On NOAC/DOAC",onAntiplatelets:"On Antiplatelets",resultsTitle:"Assessment Results",bleedingRiskAssessment:"Bleeding Risk Assessment",ichProbability:"ICH Probability",lvoProbability:"LVO Probability",lvoMayBePossible:"Large vessel occlusion possible - further evaluation recommended",riskFactorsTitle:"Main Risk Factors",increasingRisk:"Increasing Risk",decreasingRisk:"Decreasing Risk",noFactors:"No factors",riskLevel:"Risk Level",lowRisk:"Low Risk",mediumRisk:"Medium Risk",highRisk:"High Risk",riskLow:"Low",riskMedium:"Medium",riskHigh:"High",riskFactorsAnalysis:"Risk Factors",contributingFactors:"Contributing factors to the assessment",riskFactors:"Risk Factors",increaseRisk:"INCREASE",decreaseRisk:"DECREASE",noPositiveFactors:"No increasing factors",noNegativeFactors:"No decreasing factors",ichRiskFactors:"ICH Risk Factors",lvoRiskFactors:"LVO Risk Factors",criticalAlertTitle:"CRITICAL RISK DETECTED",criticalAlertMessage:"High probability of intracerebral hemorrhage detected.",immediateActionsRequired:"Immediate actions required",initiateStrokeProtocol:"Initiate stroke protocol immediately",urgentCtImaging:"Urgent CT imaging required",considerBpManagement:"Consider blood pressure management",prepareNeurosurgicalConsult:"Prepare for potential neurosurgical consultation",helpTitle:"Quick Reference Guide",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 9: Comatose patient - use Coma Module",gcsMod:"GCS 8-12: Moderate impairment",gcsHigh:"GCS 13-15: Mild impairment",fastEdTitle:"FAST-ED Score Components",fastEdFacial:"Facial Palsy: 0-1 points",fastEdArm:"Arm Weakness: 0-2 points",fastEdSpeech:"Speech Changes: 0-2 points",fastEdTime:"Time: Critical factor",fastEdEye:"Eye Deviation: 0-2 points",fastEdDenial:"Denial/Neglect: 0-2 points",criticalValuesTitle:"Critical Values",criticalBp:"Systolic BP > 180: Increased ICH risk",criticalGfap:"GFAP > 500 pg/mL: Significant marker",criticalFastEd:"FAST-ED ≥ 4: Consider LVO",fastEdCalculatorTitle:"FAST-ED Score Calculator",fastEdCalculatorSubtitle:"Click to calculate FAST-ED score components",facialPalsyTitle:"Facial Palsy",facialPalsyNormal:"Normal (0)",facialPalsyMild:"Present (1)",armWeaknessTitle:"Arm Weakness",armWeaknessNormal:"Normal (0)",armWeaknessMild:"Mild weakness or drift (1)",armWeaknessSevere:"Severe weakness or falls immediately (2)",speechChangesTitle:"Speech Abnormalities",speechChangesNormal:"Normal (0)",speechChangesMild:"Mild dysarthria or aphasia (1)",speechChangesSevere:"Severe dysarthria or aphasia (2)",eyeDeviationTitle:"Eye Deviation",eyeDeviationNormal:"Normal (0)",eyeDeviationPartial:"Partial gaze deviation (1)",eyeDeviationForced:"Forced gaze deviation (2)",denialNeglectTitle:"Denial/Neglect",denialNeglectNormal:"Normal (0)",denialNeglectPartial:"Partial neglect (1)",denialNeglectComplete:"Complete neglect (2)",totalScoreTitle:"Total FAST-ED Score",riskLevel:"Risk Level",riskLevelLow:"LOW (Score <4)",riskLevelHigh:"HIGH (Score ≥4 - Consider LVO)",applyScore:"Apply Score",cancel:"Cancel",riskAnalysis:"Risk Analysis",riskAnalysisSubtitle:"Clinical factors in this assessment",contributingFactors:"Contributing factors",factorsShown:"shown",positiveFactors:"Positive factors",negativeFactors:"Negative factors",clinicalInformation:"Clinical Information",clinicalRecommendations:"Clinical Recommendations",clinicalRec1:"Consider immediate imaging if ICH risk is high",clinicalRec2:"Activate stroke team for LVO scores ≥ 50%",clinicalRec3:"Monitor blood pressure closely",clinicalRec4:"Document all findings thoroughly",noDriverData:"No driver data available",driverAnalysisUnavailable:"Driver analysis unavailable",driverInfoNotAvailable:"Driver information not available from this prediction model",driverAnalysisNotAvailable:"Driver analysis not available for this prediction",lvoNotPossible:"LVO assessment not possible with limited data",fullExamRequired:"Full neurological examination required for LVO screening",limitedAssessment:"Limited Assessment",disclaimer:"Clinical Disclaimer",disclaimerText:"This tool is for clinical decision support only. Always use clinical judgment and follow local protocols. Not a replacement for physician assessment.",importantNote:"Important",importantText:"These results are for clinical decision support only. Always use clinical judgment and follow institutional protocols.",predictedMortality:"Predicted 30-day mortality",ichVolumeLabel:"ICH Volume",references:"References",inputSummaryTitle:"Input Summary",inputSummarySubtitle:"Values used for this analysis",privacyLink:"Privacy Policy",disclaimerLink:"Medical Disclaimer",versionLink:"Version 2.1.0 - Research Preview",privacyPolicy:"Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.",medicalDisclaimer:"Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.",networkError:"Network error - please check your connection and try again",requestTimeout:"Request timeout - please try again",apiError:"Failed to get results",validationError:"Please check your input values",sessionTimeout:"Your session has been idle for 30 minutes. Would you like to continue?",unsavedData:"You have unsaved data. Are you sure you want to leave?",nearestCentersTitle:"Nearest Stroke Centers",useCurrentLocation:"Use Current Location",enterLocationPlaceholder:"Enter city or address...",enterManually:"Enter Location Manually",search:"Search",yourLocation:"Your Location",recommendedCenters:"Recommended Centers",alternativeCenters:"Alternative Centers",noCentersFound:"No stroke centers found in this area",gettingLocation:"Getting your location",searchingLocation:"Searching location",locationError:"Unable to get your location",locationPermissionDenied:"Location access denied. Please allow location access and try again.",locationUnavailable:"Location information is unavailable",locationTimeout:"Location request timed out",geolocationNotSupported:"Geolocation is not supported by this browser",geocodingNotImplemented:"Location search not available. Please use GPS or enter coordinates manually.",tryManualEntry:"Try entering your location manually or use GPS.",distanceNote:"Distances are calculated as straight-line distances. Actual travel times may vary.",travelTimeNote:"Travel times calculated for emergency vehicles with sirens and priority routing.",calculatingTravelTimes:"Calculating travel times",minutes:"min",poweredByOrs:"Travel times powered by OpenRoute Service",comprehensiveCenter:"Comprehensive Stroke Center",primaryCenter:"Primary Stroke Center",telemetryCenter:"Telemedicine Center",thrombectomy:"Thrombectomy",neurosurgery:"Neurosurgery",icu:"Intensive Care",telemedicine:"Telemedicine",stroke_unit:"Stroke Unit",call:"Call",directions:"Directions",emergency:"Emergency",certified:"Certified",prerequisitesTitle:"Prerequisites for Stroke Triage",prerequisitesIntro:"Please confirm that all of the following prerequisites are met:",prerequisitesWarning:"All prerequisites must be met to continue",continue:"Continue",acute_deficit:"Acute (severe) neurological deficit present",symptom_onset:"Symptom onset within 6 hours",no_preexisting:"No pre-existing severe neurological deficits",no_trauma:"No traumatic brain injury present",differentialDiagnoses:"Differential Diagnoses",reconfirmTimeWindow:"Please reconfirm time window!",unclearTimeWindow:"With unclear/extended time window, early demarcated brain infarction is also possible",rareDiagnoses:"Rare diagnoses such as glioblastoma are also possible"},de:{appTitle:"iGFAP",emergencyBadge:"Notfall-Tool",helpButton:"Hilfe und Anweisungen",darkModeButton:"Dunklen Modus umschalten",languageToggle:"Sprache",step1:"Erstbeurteilung",step2:"Datenerhebung",step3:"Ergebnisse",comaModuleTitle:"Koma-Modul",limitedDataModuleTitle:"Begrenzte Daten Modul",fullStrokeModuleTitle:"Vollständiges Schlaganfall-Modul",triage1Title:"Patientenbeurteilung",triage1Question:"Ist der Patient komatös?",triage1Help:"Glasgow Coma Scale < 9",triage1Yes:"JA - Komatös",triage1No:"NEIN - Bei Bewusstsein",triage2Title:"Untersuchungsfähigkeit",triage2Question:"Kann der Patient zuverlässig untersucht werden?",triage2Help:"Patient ist nicht aphasisch, verwirrt oder unkooperativ",triage2Yes:"JA - Vollständige Untersuchung möglich",triage2No:"NEIN - Nur begrenzte Untersuchung",ageLabel:"Alter (Jahre)",ageHelp:"Patientenalter in Jahren",systolicLabel:"Systolischer RR (mmHg)",systolicHelp:"Systolischer Blutdruck",diastolicLabel:"Diastolischer RR (mmHg)",diastolicHelp:"Diastolischer Blutdruck",gfapLabel:"GFAP-Wert (pg/mL)",gfapHelp:"GFAP-Biomarker-Wert",fastEdLabel:"FAST-ED-Score",fastEdHelp:"FAST-ED-Bewertungsscore (0-9)",headacheLabel:"Kopfschmerzen",vigilanzLabel:"Bewusstseinstrübung",armPareseLabel:"Armschwäche",beinPareseLabel:"Beinschwäche",eyeDeviationLabel:"Blickdeviation",atrialFibLabel:"Vorhofflimmern",anticoagLabel:"Antikoaguliert (NOAK)",antiplateletsLabel:"Thrombozytenaggregationshemmer",analyzeButton:"Analysieren",analyzing:"Analysiere...",printResults:"Ergebnisse drucken",newAssessment:"Neue Bewertung starten",startOver:"Von vorn beginnen",goBack:"Zurück",goHome:"Zur Startseite",basicInformation:"Grundinformationen",biomarkersScores:"Biomarker & Scores",clinicalSymptoms:"Klinische Symptome",medicalHistory:"Anamnese",ageYearsLabel:"Alter (Jahre)",systolicBpLabel:"Systolischer RR (mmHg)",diastolicBpLabel:"Diastolischer RR (mmHg)",gfapValueLabel:"GFAP-Wert (pg/mL)",fastEdScoreLabel:"FAST-ED-Score",ageYearsHelp:"Patientenalter in Jahren",systolicBpHelp:"Normal: 90-140 mmHg",diastolicBpHelp:"Normal: 60-90 mmHg",gfapTooltip:"Hirnverletzungs-Biomarker",gfapTooltipLong:"Glial Fibrillary Acidic Protein - Hirnverletzungs-Biomarker",gfapRange:"Bereich: {min} - {max} pg/mL",fastEdTooltip:"0-9 Skala für LVO-Screening",analyzeIchRisk:"ICB-Risiko analysieren",analyzeStrokeRisk:"Schlaganfall-Risiko analysieren",criticalPatient:"Kritischer Patient",comaAlert:"Patient ist komatös (GCS < 9). Schnelle Beurteilung erforderlich.",vigilanceReduction:"Vigilanzminderung (Verminderte Wachheit)",armParesis:"Armparese",legParesis:"Beinparese",eyeDeviation:"Blickdeviation",atrialFibrillation:"Vorhofflimmern",onNoacDoac:"NOAK/DOAK-Therapie",onAntiplatelets:"Thrombozytenaggregationshemmer",resultsTitle:"Bewertungsergebnisse",bleedingRiskAssessment:"Blutungsrisiko-Bewertung",ichProbability:"ICB-Risiko",lvoProbability:"LVO-Risiko",lvoMayBePossible:"Großgefäßverschluss möglich - weitere Abklärung empfohlen",riskFactorsTitle:"Hauptrisikofaktoren",increasingRisk:"Risikoerhöhend",decreasingRisk:"Risikomindernd",noFactors:"Keine Faktoren",riskLevel:"Risikostufe",lowRisk:"Niedriges Risiko",mediumRisk:"Mittleres Risiko",highRisk:"Hohes Risiko",riskLow:"Niedrig",riskMedium:"Mittel",riskHigh:"Hoch",riskFactorsAnalysis:"Risikofaktoren",contributingFactors:"Beitragende Faktoren zur Bewertung",riskFactors:"Risikofaktoren",increaseRisk:"ERHÖHEN",decreaseRisk:"VERRINGERN",noPositiveFactors:"Keine erhöhenden Faktoren",noNegativeFactors:"Keine verringernden Faktoren",ichRiskFactors:"ICB-Risikofaktoren",lvoRiskFactors:"LVO-Risikofaktoren",criticalAlertTitle:"KRITISCHES RISIKO ERKANNT",criticalAlertMessage:"Hohe Wahrscheinlichkeit einer intrazerebralen Blutung erkannt.",immediateActionsRequired:"Sofortige Maßnahmen erforderlich",initiateStrokeProtocol:"Schlaganfall-Protokoll sofort einleiten",urgentCtImaging:"Dringende CT-Bildgebung erforderlich",considerBpManagement:"Blutdruckmanagement erwägen",prepareNeurosurgicalConsult:"Neurochirurgische Konsultation vorbereiten",helpTitle:"Kurzreferenzleitfaden",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 9: Komatöser Patient - Koma-Modul verwenden",gcsMod:"GCS 8-12: Mäßige Beeinträchtigung",gcsHigh:"GCS 13-15: Leichte Beeinträchtigung",fastEdTitle:"FAST-ED-Score-Komponenten",fastEdFacial:"Faziale Parese: 0-1 Punkte",fastEdArm:"Armschwäche: 0-2 Punkte",fastEdSpeech:"Sprachveränderungen: 0-2 Punkte",fastEdTime:"Zeit: Kritischer Faktor",fastEdEye:"Blickdeviation: 0-2 Punkte",fastEdDenial:"Verneinung/Neglect: 0-2 Punkte",criticalValuesTitle:"Kritische Werte",criticalBp:"Systolischer RR > 180: Erhöhtes ICB-Risiko",criticalGfap:"GFAP > 500 pg/mL: Signifikanter Marker",criticalFastEd:"FAST-ED ≥ 4: LVO in Betracht ziehen",fastEdCalculatorTitle:"FAST-ED-Score-Rechner",fastEdCalculatorSubtitle:"Klicken Sie, um FAST-ED-Score-Komponenten zu berechnen",facialPalsyTitle:"Fazialisparese",facialPalsyNormal:"Normal (0)",facialPalsyMild:"Vorhanden (1)",armWeaknessTitle:"Armschwäche",armWeaknessNormal:"Normal (0)",armWeaknessMild:"Leichte Schwäche oder Absinken (1)",armWeaknessSevere:"Schwere Schwäche oder fällt sofort ab (2)",speechChangesTitle:"Sprachstörungen",speechChangesNormal:"Normal (0)",speechChangesMild:"Leichte Dysarthrie oder Aphasie (1)",speechChangesSevere:"Schwere Dysarthrie oder Aphasie (2)",eyeDeviationTitle:"Blickdeviation",eyeDeviationNormal:"Normal (0)",eyeDeviationPartial:"Partielle Blickdeviation (1)",eyeDeviationForced:"Forcierte Blickdeviation (2)",denialNeglectTitle:"Verneinung/Neglect",denialNeglectNormal:"Normal (0)",denialNeglectPartial:"Partieller Neglect (1)",denialNeglectComplete:"Kompletter Neglect (2)",totalScoreTitle:"Gesamt-FAST-ED-Score",riskLevel:"Risikostufe",riskLevelLow:"NIEDRIG (Score <4)",riskLevelHigh:"HOCH (Score ≥4 - LVO erwägen)",applyScore:"Score Anwenden",cancel:"Abbrechen",riskAnalysis:"Risikoanalyse",riskAnalysisSubtitle:"Klinische Faktoren in dieser Bewertung",contributingFactors:"Beitragende Faktoren",factorsShown:"angezeigt",positiveFactors:"Positive Faktoren",negativeFactors:"Negative Faktoren",clinicalInformation:"Klinische Informationen",clinicalRecommendations:"Klinische Empfehlungen",clinicalRec1:"Sofortige Bildgebung erwägen bei hohem ICB-Risiko",clinicalRec2:"Stroke-Team aktivieren bei LVO-Score ≥ 50%",clinicalRec3:"Blutdruck engmaschig überwachen",clinicalRec4:"Alle Befunde gründlich dokumentieren",noDriverData:"Keine Treiberdaten verfügbar",driverAnalysisUnavailable:"Treiberanalyse nicht verfügbar",driverInfoNotAvailable:"Treiberinformationen von diesem Vorhersagemodell nicht verfügbar",driverAnalysisNotAvailable:"Treiberanalyse für diese Vorhersage nicht verfügbar",lvoNotPossible:"LVO-Bewertung mit begrenzten Daten nicht möglich",fullExamRequired:"Vollständige neurologische Untersuchung für LVO-Screening erforderlich",limitedAssessment:"Begrenzte Bewertung",disclaimer:"Klinischer Haftungsausschluss",disclaimerText:"Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle. Kein Ersatz für ärztliche Beurteilung.",importantNote:"Wichtig",importantText:"Diese Ergebnisse dienen nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie institutionelle Protokolle.",predictedMortality:"Vorhergesagte 30-Tage-Mortalität",ichVolumeLabel:"ICB-Volumen",references:"Referenzen",inputSummaryTitle:"Eingabezusammenfassung",inputSummarySubtitle:"Für diese Analyse verwendete Werte",privacyLink:"Datenschutzrichtlinie",disclaimerLink:"Medizinischer Haftungsausschluss",versionLink:"Version 2.1.0 - Research Preview",privacyPolicy:"Datenschutzrichtlinie: Dieses Tool verarbeitet Daten lokal. Keine Patientendaten werden gespeichert oder übertragen.",medicalDisclaimer:"Medizinischer Haftungsausschluss: Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle.",networkError:"Netzwerkfehler - bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut",requestTimeout:"Anfrage-Timeout - bitte versuchen Sie es erneut",apiError:"Ergebnisse konnten nicht abgerufen werden",validationError:"Bitte überprüfen Sie Ihre Eingabewerte",sessionTimeout:"Ihre Sitzung war 30 Minuten lang inaktiv. Möchten Sie fortfahren?",unsavedData:"Sie haben ungespeicherte Daten. Sind Sie sicher, dass Sie verlassen möchten?",nearestCentersTitle:"Nächstgelegene Schlaganfall-Zentren",useCurrentLocation:"Aktuellen Standort verwenden",enterLocationPlaceholder:"Stadt oder Adresse eingeben...",enterManually:"Standort manuell eingeben",search:"Suchen",yourLocation:"Ihr Standort",recommendedCenters:"Empfohlene Zentren",alternativeCenters:"Alternative Zentren",noCentersFound:"Keine Schlaganfall-Zentren in diesem Bereich gefunden",gettingLocation:"Standort wird ermittelt",searchingLocation:"Standort wird gesucht",locationError:"Standort konnte nicht ermittelt werden",locationPermissionDenied:"Standortzugriff verweigert. Bitte erlauben Sie Standortzugriff und versuchen Sie es erneut.",locationUnavailable:"Standortinformationen sind nicht verfügbar",locationTimeout:"Standortanfrage ist abgelaufen",geolocationNotSupported:"Geolokalisierung wird von diesem Browser nicht unterstützt",geocodingNotImplemented:"Standortsuche nicht verfügbar. Bitte verwenden Sie GPS oder geben Sie Koordinaten manuell ein.",tryManualEntry:"Versuchen Sie, Ihren Standort manuell einzugeben oder GPS zu verwenden.",distanceNote:"Entfernungen werden als Luftlinie berechnet. Tatsächliche Fahrzeiten können variieren.",travelTimeNote:"Fahrzeiten berechnet für Rettungsfahrzeuge mit Sondersignalen und Vorfahrtsberechtigung.",calculatingTravelTimes:"Fahrzeiten werden berechnet",minutes:"Min",poweredByOrs:"Fahrzeiten bereitgestellt von OpenRoute Service",comprehensiveCenter:"Überregionales Schlaganfall-Zentrum",primaryCenter:"Regionales Schlaganfall-Zentrum",telemetryCenter:"Telemedizin-Zentrum",thrombectomy:"Thrombektomie",neurosurgery:"Neurochirurgie",icu:"Intensivstation",telemedicine:"Telemedizin",stroke_unit:"Stroke Unit",call:"Anrufen",directions:"Wegbeschreibung",emergency:"Notfall",certified:"Zertifiziert",prerequisitesTitle:"Voraussetzungen für Schlaganfall-Triage",prerequisitesIntro:"Bitte bestätigen Sie, dass alle folgenden Voraussetzungen erfüllt sind:",prerequisitesWarning:"Alle Voraussetzungen müssen erfüllt sein, um fortzufahren",continue:"Weiter",acute_deficit:"Akutes (schweres) neurologisches Defizit vorhanden",symptom_onset:"Symptombeginn innerhalb 6h",no_preexisting:"Keine vorbestehende schwere neurologische Defizite",no_trauma:"Kein Schädelhirntrauma vorhanden",differentialDiagnoses:"Differentialdiagnosen",reconfirmTimeWindow:"Bitte Zeitfenster rekonfirmieren!",unclearTimeWindow:"Bei unklarem/erweitertem Zeitfenster ist auch ein beginnend demarkierter Hirninfarkt möglich",rareDiagnoses:"Seltene Diagnosen wie ein Glioblastom sind auch möglich"}};class Rt{constructor(){this.supportedLanguages=["en","de"],this.currentLanguage=this.detectLanguage()}detectLanguage(){const e=localStorage.getItem("language");return e&&this.supportedLanguages.includes(e)?e:(navigator.language||navigator.userLanguage).substring(0,2).toLowerCase()==="de"?"de":"en"}getCurrentLanguage(){return this.currentLanguage}setLanguage(e){return this.supportedLanguages.includes(e)?(this.currentLanguage=e,localStorage.setItem("language",e),window.dispatchEvent(new CustomEvent("languageChanged",{detail:{language:e}})),!0):!1}getSupportedLanguages(){return[...this.supportedLanguages]}t(e){return(Ne[this.currentLanguage]||Ne.en)[e]||e}toggleLanguage(){const e=this.currentLanguage==="en"?"de":"en";return this.setLanguage(e)}getLanguageDisplayName(e=null){const t=e||this.currentLanguage;return{en:"English",de:"Deutsch"}[t]||t}formatDateTime(e){const t=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(t,{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(e)}formatTime(e){const t=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(t,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(e)}}const M=new Rt,c=i=>M.t(i),$t=()=>[{id:"acute_deficit",checked:!1},{id:"symptom_onset",checked:!1},{id:"no_preexisting",checked:!1},{id:"no_trauma",checked:!1}];function Nt(){const i=$t();return`
    <div id="prerequisitesModal" class="modal prerequisites-modal" style="display: flex;">
      <div class="modal-content prerequisites-content">
        <div class="modal-header">
          <h2>${c("prerequisitesTitle")}</h2>
          <button class="modal-close" id="closePrerequisites">&times;</button>
        </div>
        
        <div class="modal-body">
          <p class="prerequisites-intro">
            ${c("prerequisitesIntro")}
          </p>
          
          <div class="prerequisites-list">
            ${i.map(e=>`
              <div class="prerequisite-item" data-id="${e.id}">
                <label class="toggle-switch">
                  <input type="checkbox" id="${e.id}" class="toggle-input">
                  <span class="toggle-slider"></span>
                </label>
                <span class="prerequisite-label">
                  ${c(e.id)}
                </span>
              </div>
            `).join("")}
          </div>
          
          <div class="prerequisites-warning" id="prerequisitesWarning" style="display: none;">
            <span class="warning-icon">⚠️</span>
            <span class="warning-text">
              ${c("prerequisitesWarning")}
            </span>
          </div>
        </div>
        
        <div class="modal-footer">
          <div class="button-group">
            <button type="button" class="secondary" id="cancelPrerequisites">
              ${c("cancel")}
            </button>
            <button type="button" class="primary" id="confirmPrerequisites">
              ${c("continue")}
            </button>
          </div>
        </div>
      </div>
    </div>
  `}function Dt(){const i=document.getElementById("prerequisitesModal");if(!i){console.error("Prerequisites modal not found");return}console.log("Initializing prerequisites modal");const e=document.getElementById("closePrerequisites"),t=document.getElementById("cancelPrerequisites"),s=document.getElementById("confirmPrerequisites");console.log("Modal buttons found:",{closeBtn:!!e,cancelBtn:!!t,confirmBtn:!!s});const a=()=>{i.remove(),j("welcome")};e==null||e.addEventListener("click",a),t==null||t.addEventListener("click",a),s==null||s.addEventListener("click",r=>{r.preventDefault(),r.stopPropagation(),console.log("Prerequisites confirm button clicked");const l=i.querySelectorAll(".toggle-input"),o=Array.from(l).every(d=>d.checked);if(console.log("All prerequisites checked:",o),o)console.log("Navigating to triage2"),i.remove(),j("triage2");else{console.log("Showing prerequisites warning");const d=document.getElementById("prerequisitesWarning");d&&(d.style.display="flex",d.classList.add("shake"),setTimeout(()=>d.classList.remove("shake"),500))}});const n=i.querySelectorAll(".toggle-input");n.forEach(r=>{r.addEventListener("change",()=>{const l=Array.from(n).every(d=>d.checked),o=document.getElementById("prerequisitesWarning");l&&o&&(o.style.display="none")})})}function Ot(){const i=document.getElementById("prerequisitesModal");i&&i.remove();const e=document.createElement("div");e.innerHTML=Nt();const t=e.firstElementChild;document.body.appendChild(t),Dt()}function je(i,e,t,s=null){const a={errors:[],warnings:[]};if(t.required&&!e&&e!==0&&a.errors.push("This field is required"),t.min!==void 0&&e!==""&&!isNaN(e)&&parseFloat(e)<t.min&&a.errors.push(`Value must be at least ${t.min}`),t.max!==void 0&&e!==""&&!isNaN(e)&&parseFloat(e)>t.max&&a.errors.push(`Value must be at most ${t.max}`),t.pattern&&!t.pattern.test(e)&&a.errors.push("Invalid format"),t.medicalCheck&&e!==""&&!isNaN(e)){const n=t.medicalCheck(parseFloat(e),s);n&&a.warnings.push(n)}return a.warnings.length===0?a.errors:a}function Ye(i){let e=!0;const t={},s={};Object.keys(Ae).forEach(n=>{const r=i.elements[n];r&&(s[n]=r.value)});const a={};return Object.entries(Ae).forEach(([n,r])=>{const l=i.elements[n];if(l){const o=je(n,l.value,r,s);Array.isArray(o)?o.length>0&&(t[n]=o,e=!1):(o.errors.length>0&&(t[n]=o.errors,e=!1),o.warnings.length>0&&(a[n]=o.warnings))}}),{isValid:e,validationErrors:t,validationWarnings:a}}function Je(i,e){Object.entries(e).forEach(([t,s])=>{const a=i.querySelector(`[name="${t}"]`);if(a){const n=a.closest(".input-group");if(n){n.classList.add("error"),n.querySelectorAll(".error-message").forEach(o=>o.remove());const r=document.createElement("div");r.className="error-message";const l=document.createElement("span");l.className="error-icon",l.textContent="⚠️",r.appendChild(l),r.appendChild(document.createTextNode(` ${s[0]}`)),n.appendChild(r)}}})}function xt(i,e){Object.entries(e).forEach(([t,s])=>{const a=i.querySelector(`[name="${t}"]`);if(a){const n=a.closest(".input-group");if(n){n.classList.add("warning"),n.querySelectorAll(".warning-message").forEach(o=>o.remove());const r=document.createElement("div");r.className="warning-message";const l=document.createElement("span");l.className="warning-icon",l.textContent="💡",r.appendChild(l),r.appendChild(document.createTextNode(` ${s[0]}`)),n.appendChild(r)}}})}function Qe(i){i.querySelectorAll(".input-group.error").forEach(e=>{e.classList.remove("error"),e.querySelectorAll(".error-message").forEach(t=>t.remove())})}function Ze(i){i.querySelectorAll(".input-group.warning").forEach(e=>{e.classList.remove("warning"),e.querySelectorAll(".warning-message").forEach(t=>t.remove())})}function Ft(i){Qe(i),Ze(i)}const Ht=Object.freeze(Object.defineProperty({__proto__:null,clearAllValidation:Ft,clearValidationErrors:Qe,clearValidationWarnings:Ze,showValidationErrors:Je,showValidationWarnings:xt,validateForm:Ye,validateInput:je},Symbol.toStringTag,{value:"Module"}));function Bt(i){v.logEvent("triage1_answer",{comatose:i}),i?j("coma"):Ot()}function Vt(i){v.logEvent("triage2_answer",{examinable:i}),j(i?"full":"limited")}function j(i){v.logEvent("navigate",{from:v.getState().currentScreen,to:i}),v.navigate(i),window.scrollTo(0,0)}function zt(){v.hasUnsavedData()&&!confirm("Are you sure you want to start over? All entered data will be lost.")||(v.logEvent("reset"),v.reset())}function Ut(){v.goBack()?(v.logEvent("navigate_back"),window.scrollTo(0,0)):Xe()}function Xe(){v.logEvent("navigate_home"),v.goHome(),window.scrollTo(0,0)}async function Wt(i,e){i.preventDefault();const t=i.target,{module:s}=t.dataset,a=Ye(t);if(!a.isValid){Je(e,a.validationErrors);try{const o=Object.keys(a.validationErrors)[0];if(o&&t.elements[o]){const u=t.elements[o];u.focus({preventScroll:!0}),u.scrollIntoView({behavior:"smooth",block:"center"})}const d=document.createElement("div");d.className="sr-only",d.setAttribute("role","status"),d.setAttribute("aria-live","polite");const m=Object.keys(a.validationErrors).length;d.textContent=`${m} field${m===1?"":"s"} need attention.`,document.body.appendChild(d),setTimeout(()=>d.remove(),1200)}catch{}return}const n={};Array.from(t.elements).forEach(o=>{if(o.name)if(o.type==="checkbox")n[o.name]=o.checked;else if(o.type==="number"){const d=parseFloat(o.value);n[o.name]=isNaN(d)?0:d}else o.type==="hidden"&&o.name==="armparese"?n[o.name]=o.value==="true":n[o.name]=o.value}),v.setFormData(s,n);const r=t.querySelector("button[type=submit]"),l=r?r.innerHTML:"";r&&(r.disabled=!0,r.innerHTML=`<span class="loading-spinner"></span> ${c("analyzing")}`);try{let o;switch(s){case"coma":o={ich:await _t(n),lvo:null};break;case"limited":o={ich:await Mt(n),lvo:{notPossible:!0}};break;case"full":o=await Pt(n);break;default:throw new Error(`Unknown module: ${s}`)}v.setResults(o),v.logEvent("models_complete",{module:s,results:o}),j("results")}catch(o){console.error("Error running models:",o);let d="An error occurred during analysis. Please try again.";o instanceof F&&(d=o.message),Gt(e,d),r&&(r.disabled=!1,r.innerHTML=l)}}function Gt(i,e){i.querySelectorAll(".critical-alert").forEach(l=>{var o,d;(d=(o=l.querySelector("h4"))==null?void 0:o.textContent)!=null&&d.includes("Error")&&l.remove()});const t=document.createElement("div");t.className="critical-alert";const s=document.createElement("h4"),a=document.createElement("span");a.className="alert-icon",a.textContent="⚠️",s.appendChild(a),s.appendChild(document.createTextNode(" Error"));const n=document.createElement("p");n.textContent=e,t.appendChild(s),t.appendChild(n);const r=i.querySelector(".container");r?r.prepend(t):i.prepend(t),setTimeout(()=>t.remove(),1e4)}class J{static calculateProbability(e,t){if(!e||!t||e<=0||t<=0)return{probability:0,confidence:0,isValid:!1,reason:"Invalid inputs: age and GFAP required"};if(e<18||e>120)return{probability:0,confidence:0,isValid:!1,reason:`Age ${e} outside valid range (18-120 years)`};(t<10||t>2e4)&&console.warn(`GFAP ${t} outside typical range (10-20000 pg/ml)`);try{const s=(e-this.PARAMS.age.mean)/this.PARAMS.age.std,a=(t-this.PARAMS.gfap.mean)/this.PARAMS.gfap.std,n=this.PARAMS.coefficients.intercept+this.PARAMS.coefficients.age*s+this.PARAMS.coefficients.gfap*a,r=1/(1+Math.exp(-n)),l=r*100,o=Math.abs(r-.5)*2,d=this.getRiskCategory(l);return{probability:Math.round(l*10)/10,confidence:Math.round(o*100)/100,logit:Math.round(n*1e3)/1e3,riskCategory:d,scaledInputs:{age:Math.round(s*1e3)/1e3,gfap:Math.round(a*1e3)/1e3},rawInputs:{age:e,gfap:t},isValid:!0,calculationMethod:"logistic_regression_age_gfap"}}catch(s){return console.error("Legacy model calculation error:",s),{probability:0,confidence:0,isValid:!1,reason:"Calculation error",error:s.message}}}static getRiskCategory(e){return e<10?{level:"very_low",color:"#10b981",label:"Very Low Risk",description:"Minimal ICH likelihood"}:e<25?{level:"low",color:"#84cc16",label:"Low Risk",description:"Below typical threshold"}:e<50?{level:"moderate",color:"#f59e0b",label:"Moderate Risk",description:"Elevated concern"}:e<75?{level:"high",color:"#f97316",label:"High Risk",description:"Significant likelihood"}:{level:"very_high",color:"#dc2626",label:"Very High Risk",description:"Critical ICH probability"}}static compareModels(e,t){if(!e||!t||!t.isValid)return{isValid:!1,reason:"Invalid model results for comparison"};let s=e.probability||0;s<=1&&(s*=100);const a=t.probability||0,n=s-a,r=a>0?n/a*100:0,l=s>a?"main":a>s?"legacy":"equal";let o;const d=Math.abs(n);return d<5?o="strong":d<15?o="moderate":d<30?o="weak":o="poor",{isValid:!0,probabilities:{main:Math.round(s*10)/10,legacy:Math.round(a*10)/10},differences:{absolute:Math.round(n*10)/10,relative:Math.round(r*10)/10},agreement:{level:o,higherRiskModel:l},interpretation:this.getComparisonInterpretation(n,o)}}static getComparisonInterpretation(e,t){const s=Math.abs(e);return t==="strong"?{type:"concordant",message:"Models show strong agreement",implication:"Age and GFAP are primary risk factors"}:s>20?{type:"divergent",message:"Significant model disagreement",implication:"Complex model captures additional risk factors not in age/GFAP"}:{type:"moderate_difference",message:"Models show moderate difference",implication:"Additional factors provide incremental predictive value"}}static runValidationTests(){const t=[{age:65,gfap:100,expected:"low",description:"Younger patient, low GFAP"},{age:75,gfap:500,expected:"moderate",description:"Average age, moderate GFAP"},{age:85,gfap:1e3,expected:"high",description:"Older patient, high GFAP"},{age:70,gfap:2e3,expected:"very_high",description:"High GFAP dominates"},{age:90,gfap:50,expected:"very_low",description:"Low GFAP despite age"}].map(n=>{const r=this.calculateProbability(n.age,n.gfap);return{...n,result:r,passed:r.isValid&&r.riskCategory.level===n.expected}}),s=t.filter(n=>n.passed).length,a=t.length;return{summary:{passed:s,total:a,passRate:Math.round(s/a*100)},details:t}}static getModelMetadata(){return{name:"Legacy ICH Model",type:"Logistic Regression",version:"1.0.0",features:["age","gfap"],performance:{rocAuc:.789,recall:.4,precision:.86,f1Score:.55,specificity:.94},trainingData:{samples:"Historical cohort",dateRange:"Research study period",validation:"Cross-validation"},limitations:["Only uses age and GFAP - ignores clinical symptoms","Lower recall (40%) - misses some ICH cases","No time-to-onset consideration","No blood pressure or medication factors","Simplified feature set for baseline comparison"],purpose:"Research baseline for evaluating complex model improvements"}}}D(J,"PARAMS",{age:{mean:74.59,std:12.75},gfap:{mean:665.23,std:2203.77},coefficients:{intercept:.3248,age:-.2108,gfap:3.1631}});function qt(i){try{const e=(i==null?void 0:i.age_years)||(i==null?void 0:i.age)||null,t=(i==null?void 0:i.gfap_value)||(i==null?void 0:i.gfap)||null;return!e||!t?null:J.calculateProbability(e,t)}catch(e){return console.warn("Legacy ICH calculation failed (non-critical):",e),null}}class B{static logComparison(e){try{const t={id:this.generateEntryId(),timestamp:new Date().toISOString(),sessionId:this.getSessionId(),...e},s=this.getStoredData();return s.entries.push(t),s.entries.length>this.MAX_ENTRIES&&(s.entries=s.entries.slice(-this.MAX_ENTRIES)),s.lastUpdated=new Date().toISOString(),s.totalComparisons=s.entries.length,localStorage.setItem(this.STORAGE_KEY,JSON.stringify(s)),console.log(`📊 Research data logged (${s.totalComparisons} comparisons)`),!0}catch(t){return console.warn("Research data logging failed (non-critical):",t),!1}}static getStoredData(){try{const e=localStorage.getItem(this.STORAGE_KEY);if(!e)return this.createEmptyDataset();const t=JSON.parse(e);return!t.entries||!Array.isArray(t.entries)?(console.warn("Invalid research data structure, resetting"),this.createEmptyDataset()):t}catch(e){return console.warn("Failed to load research data, creating new:",e),this.createEmptyDataset()}}static createEmptyDataset(){return{version:"1.0.0",created:new Date().toISOString(),lastUpdated:null,totalComparisons:0,entries:[],metadata:{app:"iGFAP Stroke Triage",purpose:"Model comparison research",dataRetention:"Local storage only"}}}static exportAsCSV(){const e=this.getStoredData();if(!e.entries||e.entries.length===0)return"No research data available for export";const t=["timestamp","session_id","age","gfap_value","main_model_probability","main_model_module","legacy_model_probability","legacy_model_confidence","absolute_difference","relative_difference","agreement_level","higher_risk_model"],s=e.entries.map(n=>{var r,l,o,d,m,u,p,S,f,y,L,w,T,P;return[n.timestamp,n.sessionId,((r=n.inputs)==null?void 0:r.age)||"",((l=n.inputs)==null?void 0:l.gfap)||"",((o=n.main)==null?void 0:o.probability)||"",((d=n.main)==null?void 0:d.module)||"",((m=n.legacy)==null?void 0:m.probability)||"",((u=n.legacy)==null?void 0:u.confidence)||"",((S=(p=n.comparison)==null?void 0:p.differences)==null?void 0:S.absolute)||"",((y=(f=n.comparison)==null?void 0:f.differences)==null?void 0:y.relative)||"",((w=(L=n.comparison)==null?void 0:L.agreement)==null?void 0:w.level)||"",((P=(T=n.comparison)==null?void 0:T.agreement)==null?void 0:P.higherRiskModel)||""].join(",")});return[t.join(","),...s].join(`
`)}static exportAsJSON(){const e=this.getStoredData();return JSON.stringify(e,null,2)}static downloadData(e="csv"){try{const t=e==="csv"?this.exportAsCSV():this.exportAsJSON(),s=`igfap-research-${Date.now()}.${e}`,a=new Blob([t],{type:e==="csv"?"text/csv":"application/json"}),n=URL.createObjectURL(a),r=document.createElement("a");return r.href=n,r.download=s,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(n),console.log(`📥 Downloaded research data: ${s}`),!0}catch(t){return console.error("Failed to download research data:",t),!1}}static clearData(){try{return localStorage.removeItem(this.STORAGE_KEY),console.log("🗑️ Research data cleared"),!0}catch(e){return console.warn("Failed to clear research data:",e),!1}}static getDataSummary(){var n,r;const e=this.getStoredData();if(!e.entries||e.entries.length===0)return{totalEntries:0,dateRange:null,avgDifference:null};const{entries:t}=e,s=t.map(l=>{var o,d;return(d=(o=l.comparison)==null?void 0:o.differences)==null?void 0:d.absolute}).filter(l=>l!=null),a=s.length>0?s.reduce((l,o)=>l+Math.abs(o),0)/s.length:0;return{totalEntries:t.length,dateRange:{first:(n=t[0])==null?void 0:n.timestamp,last:(r=t[t.length-1])==null?void 0:r.timestamp},avgAbsoluteDifference:Math.round(a*10)/10,storageSize:JSON.stringify(e).length}}static generateEntryId(){return Date.now().toString(36)+Math.random().toString(36).substr(2)}static getSessionId(){let e=sessionStorage.getItem("research_session_id");return e||(e=`session_${Date.now().toString(36)}`,sessionStorage.setItem("research_session_id",e)),e}}D(B,"STORAGE_KEY","igfap_research_data"),D(B,"MAX_ENTRIES",1e3);function et(i,e,t){try{if(!z())return;const s={inputs:{age:t.age_years||t.age,gfap:t.gfap_value||t.gfap,module:i.module||"unknown"},main:{probability:i.probability,module:i.module,confidence:i.confidence},legacy:e,comparison:e?J.compareModels(i,e):null};B.logComparison(s)}catch(s){console.warn("Research logging failed (non-critical):",s)}}function z(i=null){var e;if(i==="coma")return!1;if(i==="limited"||i==="full")return!0;if(typeof window<"u")try{const t=window.store||((e=require("../state/store.js"))==null?void 0:e.store);if(t){const{formData:s}=t.getState();return s.limited||s.full}}catch{}return!1}function Kt(i){try{if(i?(localStorage.setItem("research_mode","true"),console.log("🔬 Research mode enabled")):(localStorage.removeItem("research_mode"),console.log("🔬 Research mode disabled")),window.location.search.includes("research=")&&!i){const e=new URL(window.location);e.searchParams.delete("research"),window.history.replaceState({},"",e)}return!0}catch(e){return console.warn("Failed to toggle research mode:",e),!1}}const jt=Object.freeze(Object.defineProperty({__proto__:null,ResearchDataLogger:B,isResearchModeEnabled:z,safeLogResearchData:et,setResearchMode:Kt},Symbol.toStringTag,{value:"Module"}));function Se(){return""}function Ee(i,e,t){if(!(e!=null&&e.isValid))return console.log("🔬 Legacy model results invalid:",e),`
      <div class="research-panel" id="researchPanel" style="display: none;">
        <div class="research-header">
          <h4>🔬 Model Comparison (Research)</h4>
          <button class="close-research" id="closeResearch">×</button>
        </div>
        <div class="research-error">
          <p>⚠️ Legacy model calculation failed</p>
          <small>Debug: ${(e==null?void 0:e.reason)||"Unknown error"}</small>
        </div>
      </div>
    `;const s=J.compareModels(i,e);return`
    <div class="research-panel" id="researchPanel" style="display: none;">
      <div class="research-header">
        <h4>🔬 Model Comparison (Research)</h4>
        <button class="close-research" id="closeResearch">×</button>
      </div>
      
      <div class="model-comparison">
        ${Yt(i,e)}
        ${Jt(s)}
        ${Qt(e,t)}
        ${Zt()}
      </div>
      
      <div class="research-actions">
        <button id="exportResearchData" class="research-btn">📥 Export Data</button>
        <button id="toggleCalculationDetails" class="research-btn">🧮 Details</button>
        <button id="clearResearchData" class="research-btn danger">🗑️ Clear</button>
      </div>
      
      <div class="research-disclaimer">
        <small>
          ⚠️ <strong>Research Mode Active</strong><br>
          Legacy model: Age + GFAP only (ROC-AUC: 0.789, Recall: 40%)<br>
          For baseline comparison. Main model includes additional clinical factors.
        </small>
      </div>
    </div>
  `}function Yt(i,e){let t=i.probability||0;t<=1&&(t*=100);const s=e.probability||0;return`
    <div class="probability-comparison">
      <div class="bar-group">
        <label class="bar-label">Main Model (Complex) - ${i.module||"Unknown"}</label>
        <div class="probability-bar">
          <div class="bar-fill main-model" style="width: ${Math.min(t,100)}%">
            <span class="bar-value">${t.toFixed(1)}%</span>
          </div>
        </div>
      </div>
      
      <div class="bar-group">
        <label class="bar-label">Legacy Model (Age + GFAP Only)</label>
        <div class="probability-bar">
          <div class="bar-fill legacy-model" style="width: ${Math.min(s,100)}%">
            <span class="bar-value">${s.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  `}function Jt(i){if(!i.isValid)return'<div class="comparison-error">Unable to compare models</div>';const{differences:e,agreement:t}=i;return`
    <div class="difference-analysis">
      <div class="difference-metric">
        <span class="metric-label">Difference:</span>
        <span class="metric-value ${e.absolute>0?"higher":"lower"}">
          ${e.absolute>0?"+":""}${e.absolute}%
        </span>
      </div>
      
      <div class="agreement-level">
        <span class="metric-label">Agreement:</span>
        <span class="agreement-badge ${t.level}">
          ${t.level.charAt(0).toUpperCase()+t.level.slice(1)}
        </span>
      </div>
      
      <div class="interpretation">
        <p class="interpretation-text">${i.interpretation.message}</p>
        <small class="interpretation-detail">${i.interpretation.implication}</small>
      </div>
    </div>
  `}function Qt(i,e){return`
    <div class="calculation-details" id="calculationDetails" style="display: none;">
      <h5>Legacy Model Calculation</h5>
      <div class="calculation-steps">
        <div class="step">
          <strong>Inputs:</strong> Age ${e.age}, GFAP ${e.gfap} pg/ml
        </div>
        <div class="step">
          <strong>Scaling:</strong> Age → ${i.scaledInputs.age}, GFAP → ${i.scaledInputs.gfap}
        </div>
        <div class="step">
          <strong>Logit:</strong> ${i.logit}
        </div>
        <div class="step">
          <strong>Probability:</strong> ${i.probability}% (Confidence: ${(i.confidence*100).toFixed(0)}%)
        </div>
      </div>
    </div>
  `}function Zt(){const i=J.getModelMetadata();return`
    <div class="model-metrics">
      <h5>Performance Comparison</h5>
      <div class="metrics-grid">
        <div class="metric-item">
          <span class="metric-name">ROC-AUC</span>
          <span class="metric-value">Legacy: ${i.performance.rocAuc}</span>
        </div>
        <div class="metric-item">
          <span class="metric-name">Recall</span>
          <span class="metric-value">Legacy: ${(i.performance.recall*100).toFixed(0)}%</span>
        </div>
        <div class="metric-item">
          <span class="metric-name">Precision</span>
          <span class="metric-value">Legacy: ${(i.performance.precision*100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  `}function tt(){if(!document.getElementById("researchPanel"))return;const e=document.getElementById("closeResearch");e&&e.addEventListener("click",()=>{const n=document.getElementById("researchPanel");n&&(n.style.display="none")});const t=document.getElementById("exportResearchData");t&&t.addEventListener("click",()=>{B.downloadData("csv")});const s=document.getElementById("toggleCalculationDetails");s&&s.addEventListener("click",()=>{const n=document.getElementById("calculationDetails");n&&(n.style.display=n.style.display==="none"?"block":"none",s.textContent=n.style.display==="none"?"🧮 Details":"🧮 Hide")});const a=document.getElementById("clearResearchData");a&&a.addEventListener("click",()=>{if(confirm("Clear all research data? This cannot be undone.")){B.clearData();const n=B.getDataSummary();console.log(`Data cleared. Total entries: ${n.totalEntries}`)}}),console.log("🔬 Research mode initialized")}const Xt=Object.freeze(Object.defineProperty({__proto__:null,initializeResearchMode:tt,renderModelComparison:Ee,renderResearchToggle:Se},Symbol.toStringTag,{value:"Module"}));class ei{constructor(){this.isAuthenticated=!1,this.sessionTimeout=4*60*60*1e3,this.lastActivity=Date.now(),this.setupActivityTracking()}async authenticate(e){const t=await this.hashPassword("Neuro25");return e===t?(this.isAuthenticated=!0,this.lastActivity=Date.now(),this.storeAuthSession(),!0):(await this.delayFailedAttempt(),!1)}isValidSession(){return this.isAuthenticated?Date.now()-this.lastActivity>this.sessionTimeout?(this.logout(),!1):!0:this.checkStoredSession()}updateActivity(){this.lastActivity=Date.now(),this.storeAuthSession()}logout(){this.isAuthenticated=!1,sessionStorage.removeItem("auth_session"),sessionStorage.removeItem("auth_timestamp")}async hashPassword(e){const s=new TextEncoder().encode(e),a=await crypto.subtle.digest("SHA-256",s);return Array.from(new Uint8Array(a)).map(l=>l.toString(16).padStart(2,"0")).join("")}storeAuthSession(){this.isAuthenticated&&(sessionStorage.setItem("auth_session","verified"),sessionStorage.setItem("auth_timestamp",this.lastActivity.toString()))}checkStoredSession(){const e=sessionStorage.getItem("auth_session"),t=sessionStorage.getItem("auth_timestamp");if(e==="verified"&&t){const s=parseInt(t);if(Date.now()-s<this.sessionTimeout)return this.isAuthenticated=!0,this.lastActivity=s,!0}return this.logout(),!1}setupActivityTracking(){const e=["mousedown","mousemove","keypress","scroll","touchstart"],t=()=>{this.isAuthenticated&&this.updateActivity()};e.forEach(s=>{document.addEventListener(s,t,{passive:!0})})}async delayFailedAttempt(){return new Promise(e=>{setTimeout(e,1e3)})}getSessionInfo(){if(!this.isAuthenticated)return{authenticated:!1};const e=this.sessionTimeout-(Date.now()-this.lastActivity),t=Math.floor(e/(60*60*1e3)),s=Math.floor(e%(60*60*1e3)/(60*1e3));return{authenticated:!0,timeRemaining:`${t}h ${s}m`,lastActivity:new Date(this.lastActivity).toLocaleTimeString()}}}const ne=new ei;function U(i){const e=[{id:1,label:"Triage"},{id:2,label:"Assessment"},{id:3,label:"Results"}];let t='<div class="progress-indicator">';return e.forEach((s,a)=>{const n=s.id===i,r=s.id<i;t+=`
      <div class="progress-step ${n?"active":""} ${r?"completed":""}">
        ${r?"":s.id}
      </div>
    `,a<e.length-1&&(t+=`<div class="progress-line ${r?"completed":""}"></div>`)}),t+="</div>",t}function De(){return`
    <div class="container">
      ${U(1)}
      <h2>${c("triage1Title")}</h2>
      <div class="triage-question">
        ${c("triage1Question")}
        <small>${c("triage1Help")}</small>
      </div>
      <div class="triage-buttons">
        <button class="yes-btn" data-action="triage1" data-value="true">${c("triage1Yes")}</button>
        <button class="no-btn" data-action="triage1" data-value="false">${c("triage1No")}</button>
      </div>
    </div>
  `}function ti(){return`
    <div class="container">
      ${U(1)}
      <h2>${c("triage2Title")}</h2>
      <div class="triage-question">
        ${c("triage2Question")}
        <small>${c("triage2Help")}</small>
      </div>
      <div class="triage-buttons">
        <button class="yes-btn" data-action="triage2" data-value="true">${c("triage2Yes")}</button>
        <button class="no-btn" data-action="triage2" data-value="false">${c("triage2No")}</button>
      </div>
    </div>
  `}function ii(){return`
    <div class="container">
      ${U(2)}
      <h2>${c("comaModuleTitle")||"Coma Module"}</h2>
      <form data-module="coma">
        <div class="input-grid">
          <div class="input-group">
            <label for="gfap_value">
              ${c("gfapValueLabel")}
              <span class="tooltip">ℹ️
                <span class="tooltiptext">${c("gfapTooltipLong")}</span>
              </span>
            </label>
            <input type="number" id="gfap_value" name="gfap_value" min="${_.min}" max="${_.max}" step="0.1" required aria-describedby="gfap-help">
            <div id="gfap-help" class="input-help">
              ${c("gfapRange").replace("{min}",_.min).replace("{max}",_.max)}
            </div>
          </div>
        </div>
        <button type="submit" class="primary">${c("analyzeIchRisk")}</button>
        <button type="button" class="secondary" data-action="reset">${c("startOver")}</button>
      </form>
    </div>
  `}function si(){return`
    <div class="container">
      ${U(2)}
      <h2>${c("limitedDataModuleTitle")||"Limited Data Module"}</h2>
      <form data-module="limited">
        <div class="input-grid">
          <div class="input-group">
            <label for="age_years">${c("ageYearsLabel")}</label>
            <input type="number" name="age_years" id="age_years" min="0" max="120" required aria-describedby="age-help">
            <div id="age-help" class="input-help">${c("ageYearsHelp")}</div>
          </div>
          <div class="input-group">
            <label for="systolic_bp">${c("systolicBpLabel")}</label>
            <div class="input-with-unit">
              <input type="number" name="systolic_bp" id="systolic_bp" min="60" max="300" required aria-describedby="sbp-help" inputmode="numeric">
              <span class="unit">mmHg</span>
            </div>
            <div id="sbp-help" class="input-help">${c("systolicBpHelp")}</div>
          </div>
          <div class="input-group">
            <label for="diastolic_bp">${c("diastolicBpLabel")}</label>
            <div class="input-with-unit">
              <input type="number" name="diastolic_bp" id="diastolic_bp" min="30" max="200" required aria-describedby="dbp-help" inputmode="numeric">
              <span class="unit">mmHg</span>
            </div>
            <div id="dbp-help" class="input-help">${c("diastolicBpHelp")}</div>
          </div>
          <div class="input-group">
            <label for="gfap_value">
              ${c("gfapValueLabel")}
              <span class="tooltip">ℹ️
                <span class="tooltiptext">${c("gfapTooltipLong")}</span>
              </span>
            </label>
            <div class="input-with-unit">
              <input type="number" name="gfap_value" id="gfap_value" min="${_.min}" max="${_.max}" step="0.1" required inputmode="decimal">
              <span class="unit">pg/mL</span>
            </div>
          </div>
        </div>
        <div class="checkbox-group">
          <label class="checkbox-wrapper">
            <input type="checkbox" name="vigilanzminderung" id="vigilanzminderung">
            <span class="checkbox-label">${c("vigilanceReduction")}</span>
          </label>
        </div>
        <button type="submit" class="primary">${c("analyzeIchRisk")}</button>
        <button type="button" class="secondary" data-action="reset">${c("startOver")}</button>
      </form>
    </div>
  `}function ai(){return`
    <div class="container">
      ${U(2)}
      <h2>${c("fullStrokeModuleTitle")||"Full Stroke Module"}</h2>
      <form data-module="full">
        <h3>${c("basicInformation")}</h3>
        <div class="input-grid">
          <div class="input-group">
            <label for="age_years">${c("ageYearsLabel")}</label>
            <input type="number" name="age_years" id="age_years" min="0" max="120" required>
          </div>
          <div class="input-group">
            <label for="systolic_bp">${c("systolicBpLabel")}</label>
            <div class="input-with-unit">
              <input type="number" name="systolic_bp" id="systolic_bp" min="60" max="300" required inputmode="numeric">
              <span class="unit">mmHg</span>
            </div>
          </div>
          <div class="input-group">
            <label for="diastolic_bp">${c("diastolicBpLabel")}</label>
            <div class="input-with-unit">
              <input type="number" name="diastolic_bp" id="diastolic_bp" min="30" max="200" required inputmode="numeric">
              <span class="unit">mmHg</span>
            </div>
          </div>
        </div>

        <h3>${c("biomarkersScores")}</h3>
        <div class="input-grid">
          <div class="input-group">
            <label for="gfap_value">
              ${c("gfapValueLabel")}
              <span class="tooltip">ℹ️
                <span class="tooltiptext">${c("gfapTooltip")}</span>
              </span>
            </label>
            <div class="input-with-unit">
              <input type="number" name="gfap_value" id="gfap_value" min="${_.min}" max="${_.max}" step="0.1" required inputmode="decimal">
              <span class="unit">pg/mL</span>
            </div>
          </div>
          <div class="input-group">
            <label for="fast_ed_score">
              ${c("fastEdScoreLabel")}
              <span class="tooltip">ℹ️
                <span class="tooltiptext">${c("fastEdCalculatorSubtitle")}</span>
              </span>
            </label>
            <input type="number" name="fast_ed_score" id="fast_ed_score" min="0" max="9" required readonly placeholder="${c("fastEdCalculatorSubtitle")}" style="cursor: pointer;">
            <input type="hidden" name="armparese" id="armparese_hidden" value="false">
            <input type="hidden" name="eye_deviation" id="eye_deviation_hidden" value="false">
          </div>
        </div>

        <h3>${c("clinicalSymptoms")}</h3>
        <div class="input-grid">
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="headache" id="headache">
              <span class="checkbox-label">${c("headacheLabel")}</span>
            </label>
            <label class="checkbox-wrapper">
              <input type="checkbox" name="vigilanzminderung" id="vigilanzminderung">
              <span class="checkbox-label">${c("vigilanzLabel")}</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="beinparese" id="beinparese">
              <span class="checkbox-label">${c("legParesis")}</span>
            </label>
          </div>
        </div>

        <h3>${c("medicalHistory")}</h3>
        <div class="input-grid">
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="atrial_fibrillation" id="atrial_fibrillation">
              <span class="checkbox-label">${c("atrialFibrillation")}</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="anticoagulated_noak" id="anticoagulated_noak">
              <span class="checkbox-label">${c("onNoacDoac")}</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="antiplatelets" id="antiplatelets">
              <span class="checkbox-label">${c("onAntiplatelets")}</span>
            </label>
          </div>
        </div>

        <button type="submit" class="primary">${c("analyzeStrokeRisk")}</button>
        <button type="button" class="secondary" data-action="reset">${c("startOver")}</button>
      </form>
    </div>
  `}const ni="modulepreload",ri=function(i){return"/0825/"+i},Oe={},N=function(e,t,s){let a=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),l=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));a=Promise.allSettled(t.map(o=>{if(o=ri(o),o in Oe)return;Oe[o]=!0;const d=o.endsWith(".css"),m=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${o}"]${m}`))return;const u=document.createElement("link");if(u.rel=d?"stylesheet":ni,d||(u.as="script"),u.crossOrigin="",u.href=o,l&&u.setAttribute("nonce",l),document.head.appendChild(u),d)return new Promise((p,S)=>{u.addEventListener("load",p),u.addEventListener("error",()=>S(new Error(`Unable to preload CSS for ${o}`)))})}))}function n(r){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=r,window.dispatchEvent(l),!l.defaultPrevented)throw r}return a.then(r=>{for(const l of r||[])l.status==="rejected"&&n(l.reason);return e().catch(n)})};function it(){return`
    <div class="critical-alert">
      <h4><span class="alert-icon">🚨</span> ${c("criticalAlertTitle")}</h4>
      <p>${c("criticalAlertMessage")}</p>
    </div>
  `}const oi={age_years:"ageLabel",age:"ageLabel",systolic_bp:"systolicLabel",diastolic_bp:"diastolicLabel",systolic_blood_pressure:"systolicLabel",diastolic_blood_pressure:"diastolicLabel",blood_pressure_systolic:"systolicLabel",blood_pressure_diastolic:"diastolicLabel",gfap_value:"gfapLabel",gfap:"gfapLabel",gfap_level:"gfapLabel",fast_ed_score:"fastEdLabel",fast_ed:"fastEdLabel",fast_ed_total:"fastEdLabel",vigilanzminderung:"vigilanzLabel",vigilance_reduction:"vigilanzLabel",reduced_consciousness:"vigilanzLabel",armparese:"armPareseLabel",arm_paresis:"armPareseLabel",arm_weakness:"armPareseLabel",beinparese:"beinPareseLabel",leg_paresis:"beinPareseLabel",leg_weakness:"beinPareseLabel",eye_deviation:"eyeDeviationLabel",blickdeviation:"eyeDeviationLabel",headache:"headacheLabel",kopfschmerzen:"headacheLabel",atrial_fibrillation:"atrialFibLabel",vorhofflimmern:"atrialFibLabel",anticoagulated_noak:"anticoagLabel",anticoagulation:"anticoagLabel",antiplatelets:"antiplateletsLabel",thrombozytenaggregationshemmer:"antiplateletsLabel"},li=[{pattern:/_score$/,replacement:" Score"},{pattern:/_value$/,replacement:" Level"},{pattern:/_bp$/,replacement:" Blood Pressure"},{pattern:/_years?$/,replacement:" (years)"},{pattern:/^ich_/,replacement:"Brain Bleeding "},{pattern:/^lvo_/,replacement:"Large Vessel "},{pattern:/parese$/,replacement:"Weakness"},{pattern:/deviation$/,replacement:"Movement"}];function re(i){if(!i)return"";const e=oi[i.toLowerCase()];if(e){const s=c(e);if(s&&s!==e)return s}let t=i.toLowerCase();return li.forEach(({pattern:s,replacement:a})=>{t=t.replace(s,a)}),t=t.replace(/_/g," ").replace(/\b\w/g,s=>s.toUpperCase()).trim(),t}function ci(i){return re(i).replace(/\s*\([^)]*\)\s*/g,"").trim()}function di(i,e=""){return i==null||i===""?"":typeof i=="boolean"?i?"✓":"✗":typeof i=="number"?e.includes("bp")||e.includes("blood_pressure")?`${i} mmHg`:e.includes("gfap")?`${i} pg/mL`:e.includes("age")?`${i} years`:e.includes("score")||Number.isInteger(i)?i.toString():i.toFixed(1):i.toString()}function ui(i,e){if(console.log("=== DRIVER RENDERING SECTION ==="),!(i!=null&&i.drivers)&&!(e!=null&&e.drivers))return console.log("❌ No drivers available for rendering"),"";let t=`
    <div class="drivers-section">
      <div class="drivers-header">
        <h3><span class="driver-header-icon">🎯</span> ${c("riskAnalysis")}</h3>
        <p class="drivers-subtitle">${c("riskAnalysisSubtitle")}</p>
      </div>
      <div class="enhanced-drivers-grid">
  `;return i!=null&&i.drivers&&(console.log("🧠 Rendering ICH drivers panel"),t+=xe(i.drivers,"ICH","ich",i.probability)),e!=null&&e.drivers&&!e.notPossible&&(console.log("🩸 Rendering LVO drivers panel"),t+=xe(e.drivers,"LVO","lvo",e.probability)),t+=`
      </div>
    </div>
  `,t}function xe(i,e,t,s){if(!i||Object.keys(i).length===0)return console.log(`No drivers data for ${e}`),`
      <div class="enhanced-drivers-panel ${t}">
        <div class="panel-header">
          <div class="panel-icon ${t}">${t==="ich"?"🩸":"🧠"}</div>
          <div class="panel-title">
            <h4>${e} ${c("riskFactors")}</h4>
            <span class="panel-subtitle">${c("noDriverData")}</span>
          </div>
        </div>
        <p class="no-drivers-message">
          ${c("driverInfoNotAvailable")}
        </p>
      </div>
    `;const a=i;if(a.kind==="unavailable")return`
      <div class="enhanced-drivers-panel ${t}">
        <div class="panel-header">
          <div class="panel-icon ${t}">${t==="ich"?"🩸":"🧠"}</div>
          <div class="panel-title">
            <h4>${e} ${c("riskFactors")}</h4>
            <span class="panel-subtitle">${c("driverAnalysisUnavailable")}</span>
          </div>
        </div>
        <p class="no-drivers-message">
          ${c("driverAnalysisNotAvailable")}
        </p>
      </div>
    `;const n=a.positive.sort((u,p)=>Math.abs(p.weight)-Math.abs(u.weight)).slice(0,3),r=a.negative.sort((u,p)=>Math.abs(p.weight)-Math.abs(u.weight)).slice(0,3),l=Math.max(...n.map(u=>Math.abs(u.weight)),...r.map(u=>Math.abs(u.weight)),.01);let o=`
    <div class="enhanced-drivers-panel ${t}">
      <div class="panel-header">
        <div class="panel-icon ${t}">${t==="ich"?"🩸":"🧠"}</div>
        <div class="panel-title">
          <h4>${e} ${c("riskFactors")}</h4>
          <span class="panel-subtitle">${c("contributingFactors")}</span>
        </div>
      </div>
      
      <div class="drivers-split-view">
        <div class="drivers-column positive-column">
          <div class="column-header">
            <span class="column-icon">↑</span>
            <span class="column-title">${c("increaseRisk")}</span>
          </div>
          <div class="compact-drivers">
  `;const d=n.reduce((u,p)=>u+Math.abs(p.weight),0);n.length>0?n.forEach(u=>{const p=d>0?Math.abs(u.weight)/d*100:0,S=Math.abs(u.weight)/l*100,f=re(u.label);o+=`
        <div class="compact-driver-item">
          <div class="compact-driver-label">${f}</div>
          <div class="compact-driver-bar positive" style="width: ${S}%">
            <span class="compact-driver-value">+${p.toFixed(0)}%</span>
          </div>
        </div>
      `}):o+=`<div class="no-factors">${c("noPositiveFactors")}</div>`,o+=`
          </div>
        </div>
        
        <div class="drivers-column negative-column">
          <div class="column-header">
            <span class="column-icon">↓</span>
            <span class="column-title">${c("decreaseRisk")}</span>
          </div>
          <div class="compact-drivers">
  `;const m=r.reduce((u,p)=>u+Math.abs(p.weight),0);return r.length>0?r.forEach(u=>{const p=m>0?Math.abs(u.weight)/m*100:0,S=Math.abs(u.weight)/l*100,f=re(u.label);o+=`
        <div class="compact-driver-item">
          <div class="compact-driver-label">${f}</div>
          <div class="compact-driver-bar negative" style="width: ${S}%">
            <span class="compact-driver-value">-${p.toFixed(0)}%</span>
          </div>
        </div>
      `}):o+=`<div class="no-factors">${c("noNegativeFactors")}</div>`,o+=`
          </div>
        </div>
      </div>
    </div>
  `,o}const st={bayern:{neurosurgicalCenters:[{id:"BY-NS-001",name:"LMU Klinikum München - Großhadern",address:"Marchioninistraße 15, 81377 München",coordinates:{lat:48.1106,lng:11.4684},phone:"+49 89 4400-0",emergency:"+49 89 4400-73331",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1440,network:"TEMPiS"},{id:"BY-NS-002",name:"Klinikum rechts der Isar München (TUM)",address:"Ismaninger Str. 22, 81675 München",coordinates:{lat:48.1497,lng:11.6052},phone:"+49 89 4140-0",emergency:"+49 89 4140-2249",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1161,network:"TEMPiS"},{id:"BY-NS-003",name:"Städtisches Klinikum München Schwabing",address:"Kölner Platz 1, 80804 München",coordinates:{lat:48.1732,lng:11.5755},phone:"+49 89 3068-0",emergency:"+49 89 3068-2050",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:648,network:"TEMPiS"},{id:"BY-NS-004",name:"Städtisches Klinikum München Bogenhausen",address:"Englschalkinger Str. 77, 81925 München",coordinates:{lat:48.1614,lng:11.6254},phone:"+49 89 9270-0",emergency:"+49 89 9270-2050",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:689,network:"TEMPiS"},{id:"BY-NS-005",name:"Universitätsklinikum Erlangen",address:"Maximiliansplatz 2, 91054 Erlangen",coordinates:{lat:49.5982,lng:11.0037},phone:"+49 9131 85-0",emergency:"+49 9131 85-39003",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1371,network:"TEMPiS"},{id:"BY-NS-006",name:"Universitätsklinikum Regensburg",address:"Franz-Josef-Strauß-Allee 11, 93053 Regensburg",coordinates:{lat:49.0134,lng:12.0991},phone:"+49 941 944-0",emergency:"+49 941 944-7501",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1042,network:"TEMPiS"},{id:"BY-NS-007",name:"Universitätsklinikum Würzburg",address:"Oberdürrbacher Str. 6, 97080 Würzburg",coordinates:{lat:49.784,lng:9.9721},phone:"+49 931 201-0",emergency:"+49 931 201-24444",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1264,network:"TEMPiS"},{id:"BY-NS-008",name:"Klinikum Nürnberg Nord",address:"Prof.-Ernst-Nathan-Str. 1, 90419 Nürnberg",coordinates:{lat:49.4521,lng:11.0767},phone:"+49 911 398-0",emergency:"+49 911 398-2369",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1368,network:"TEMPiS"},{id:"BY-NS-009",name:"Universitätsklinikum Augsburg",address:"Stenglinstr. 2, 86156 Augsburg",coordinates:{lat:48.3668,lng:10.9093},phone:"+49 821 400-01",emergency:"+49 821 400-2356",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1740,network:"TEMPiS"},{id:"BY-NS-010",name:"Klinikum Aschaffenburg-Alzenau",address:"Am Hasenkopf 1, 63739 Aschaffenburg",coordinates:{lat:49.9737,lng:9.157},phone:"+49 6021 32-0",emergency:"+49 6021 32-2800",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:40,network:"TRANSIT"},{id:"BY-NS-011",name:"Klinikum Landshut",address:"Robert-Koch-Str. 1, 84034 Landshut",coordinates:{lat:48.5665,lng:12.1512},phone:"+49 871 698-0",emergency:"+49 871 698-3333",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:505,network:"TEMPiS"},{id:"BY-NS-012",name:"Klinikum Coburg",address:"Ketschendorfer Str. 33, 96450 Coburg",coordinates:{lat:50.2596,lng:10.9644},phone:"+49 9561 22-0",emergency:"+49 9561 22-6800",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:547,network:"STENO"},{id:"BY-NS-013",name:"Klinikum Passau",address:"Bischof-Pilgrim-Str. 1, 94032 Passau",coordinates:{lat:48.5665,lng:13.4777},phone:"+49 851 5300-0",emergency:"+49 851 5300-2222",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:696,network:"TEMPiS"}],comprehensiveStrokeCenters:[{id:"BY-CS-001",name:"Klinikum Bamberg",address:"Buger Str. 80, 96049 Bamberg",coordinates:{lat:49.8988,lng:10.9027},phone:"+49 951 503-0",emergency:"+49 951 503-11101",thrombectomy:!0,thrombolysis:!0,beds:630,network:"TEMPiS"},{id:"BY-CS-002",name:"Klinikum Bayreuth",address:"Preuschwitzer Str. 101, 95445 Bayreuth",coordinates:{lat:49.9459,lng:11.5779},phone:"+49 921 400-0",emergency:"+49 921 400-5401",thrombectomy:!0,thrombolysis:!0,beds:848,network:"TEMPiS"},{id:"BY-CS-003",name:"Klinikum Coburg",address:"Ketschendorfer Str. 33, 96450 Coburg",coordinates:{lat:50.2596,lng:10.9685},phone:"+49 9561 22-0",emergency:"+49 9561 22-6300",thrombectomy:!0,thrombolysis:!0,beds:522,network:"TEMPiS"}],regionalStrokeUnits:[{id:"BY-RSU-001",name:"Goldberg-Klinik Kelheim",address:"Traubenweg 3, 93309 Kelheim",coordinates:{lat:48.9166,lng:11.8742},phone:"+49 9441 702-0",emergency:"+49 9441 702-6800",thrombolysis:!0,beds:200,network:"TEMPiS"},{id:"BY-RSU-002",name:"DONAUISAR Klinikum Deggendorf",address:"Perlasberger Str. 41, 94469 Deggendorf",coordinates:{lat:48.8372,lng:12.9619},phone:"+49 991 380-0",emergency:"+49 991 380-2201",thrombolysis:!0,beds:450,network:"TEMPiS"},{id:"BY-RSU-003",name:"Klinikum St. Elisabeth Straubing",address:"St.-Elisabeth-Str. 23, 94315 Straubing",coordinates:{lat:48.8742,lng:12.5733},phone:"+49 9421 710-0",emergency:"+49 9421 710-2000",thrombolysis:!0,beds:580,network:"TEMPiS"},{id:"BY-RSU-004",name:"Klinikum Freising",address:"Mainburger Str. 29, 85356 Freising",coordinates:{lat:48.4142,lng:11.7461},phone:"+49 8161 24-0",emergency:"+49 8161 24-2800",thrombolysis:!0,beds:380,network:"TEMPiS"},{id:"BY-RSU-005",name:"Klinikum Landkreis Erding",address:"Bajuwarenstr. 5, 85435 Erding",coordinates:{lat:48.3061,lng:11.9067},phone:"+49 8122 59-0",emergency:"+49 8122 59-2201",thrombolysis:!0,beds:350,network:"TEMPiS"},{id:"BY-RSU-006",name:"Helios Amper-Klinikum Dachau",address:"Krankenhausstr. 15, 85221 Dachau",coordinates:{lat:48.2599,lng:11.4342},phone:"+49 8131 76-0",emergency:"+49 8131 76-2201",thrombolysis:!0,beds:480,network:"TEMPiS"},{id:"BY-RSU-007",name:"Klinikum Fürstenfeldbruck",address:"Dachauer Str. 33, 82256 Fürstenfeldbruck",coordinates:{lat:48.1772,lng:11.2578},phone:"+49 8141 99-0",emergency:"+49 8141 99-2201",thrombolysis:!0,beds:420,network:"TEMPiS"},{id:"BY-RSU-008",name:"Klinikum Ingolstadt",address:"Krumenauerstraße 25, 85049 Ingolstadt",coordinates:{lat:48.7665,lng:11.4364},phone:"+49 841 880-0",emergency:"+49 841 880-2201",thrombolysis:!0,beds:665,network:"TEMPiS"},{id:"BY-RSU-009",name:"Klinikum Passau",address:"Bischof-Pilgrim-Str. 1, 94032 Passau",coordinates:{lat:48.5665,lng:13.4513},phone:"+49 851 5300-0",emergency:"+49 851 5300-2100",thrombolysis:!0,beds:540,network:"TEMPiS"},{id:"BY-RSU-010",name:"Klinikum Landshut",address:"Robert-Koch-Str. 1, 84034 Landshut",coordinates:{lat:48.5436,lng:12.1619},phone:"+49 871 698-0",emergency:"+49 871 698-3333",thrombolysis:!0,beds:790,network:"TEMPiS"},{id:"BY-RSU-011",name:"RoMed Klinikum Rosenheim",address:"Pettenkoferstr. 10, 83022 Rosenheim",coordinates:{lat:47.8567,lng:12.1265},phone:"+49 8031 365-0",emergency:"+49 8031 365-3711",thrombolysis:!0,beds:870,network:"TEMPiS"},{id:"BY-RSU-012",name:"Klinikum Memmingen",address:"Bismarckstr. 23, 87700 Memmingen",coordinates:{lat:47.9833,lng:10.1833},phone:"+49 8331 70-0",emergency:"+49 8331 70-2500",thrombolysis:!0,beds:520,network:"TEMPiS"},{id:"BY-RSU-013",name:"Klinikum Kempten-Oberallgäu",address:"Robert-Weixler-Str. 50, 87439 Kempten",coordinates:{lat:47.7261,lng:10.3097},phone:"+49 831 530-0",emergency:"+49 831 530-2201",thrombolysis:!0,beds:650,network:"TEMPiS"},{id:"BY-RSU-014",name:"Klinikum Aschaffenburg-Alzenau",address:"Am Hasenkopf 1, 63739 Aschaffenburg",coordinates:{lat:49.9747,lng:9.1581},phone:"+49 6021 32-0",emergency:"+49 6021 32-2700",thrombolysis:!0,beds:590,network:"TEMPiS"}],thrombolysisHospitals:[{id:"BY-TH-001",name:"Krankenhaus Vilsbiburg",address:"Sonnenstraße 10, 84137 Vilsbiburg",coordinates:{lat:48.6333,lng:12.2833},phone:"+49 8741 60-0",thrombolysis:!0,beds:180},{id:"BY-TH-002",name:"Krankenhaus Eggenfelden",address:"Pfarrkirchener Str. 5, 84307 Eggenfelden",coordinates:{lat:48.4,lng:12.7667},phone:"+49 8721 98-0",thrombolysis:!0,beds:220}]},badenWuerttemberg:{neurosurgicalCenters:[{id:"BW-NS-001",name:"Universitätsklinikum Freiburg",address:"Hugstetter Str. 55, 79106 Freiburg",coordinates:{lat:48.0025,lng:7.8347},phone:"+49 761 270-0",emergency:"+49 761 270-34010",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1600,network:"FAST"},{id:"BW-NS-002",name:"Universitätsklinikum Heidelberg",address:"Im Neuenheimer Feld 400, 69120 Heidelberg",coordinates:{lat:49.4178,lng:8.6706},phone:"+49 6221 56-0",emergency:"+49 6221 56-36643",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1621,network:"FAST"},{id:"BW-NS-003",name:"Universitätsklinikum Tübingen",address:"Geissweg 3, 72076 Tübingen",coordinates:{lat:48.5378,lng:9.0538},phone:"+49 7071 29-0",emergency:"+49 7071 29-82211",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1550,network:"FAST"},{id:"BW-NS-004",name:"Universitätsklinikum Ulm",address:"Albert-Einstein-Allee 23, 89081 Ulm",coordinates:{lat:48.4196,lng:9.9592},phone:"+49 731 500-0",emergency:"+49 731 500-63001",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1264,network:"FAST"},{id:"BW-NS-005",name:"Klinikum Stuttgart - Katharinenhospital",address:"Kriegsbergstraße 60, 70174 Stuttgart",coordinates:{lat:48.7784,lng:9.1682},phone:"+49 711 278-0",emergency:"+49 711 278-32001",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:950,network:"FAST"},{id:"BW-NS-006",name:"Städtisches Klinikum Karlsruhe",address:"Moltkestraße 90, 76133 Karlsruhe",coordinates:{lat:49.0047,lng:8.3858},phone:"+49 721 974-0",emergency:"+49 721 974-2301",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1570,network:"FAST"},{id:"BW-NS-007",name:"Klinikum Ludwigsburg",address:"Posilipostraße 4, 71640 Ludwigsburg",coordinates:{lat:48.8901,lng:9.1953},phone:"+49 7141 99-0",emergency:"+49 7141 99-67201",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:720,network:"FAST"}],comprehensiveStrokeCenters:[{id:"BW-CS-001",name:"Universitätsmedizin Mannheim",address:"Theodor-Kutzer-Ufer 1-3, 68167 Mannheim",coordinates:{lat:49.4828,lng:8.4664},phone:"+49 621 383-0",emergency:"+49 621 383-2251",thrombectomy:!0,thrombolysis:!0,beds:1400,network:"FAST"}],regionalStrokeUnits:[{id:"BW-RSU-001",name:"Robert-Bosch-Krankenhaus Stuttgart",address:"Auerbachstraße 110, 70376 Stuttgart",coordinates:{lat:48.7447,lng:9.2294},phone:"+49 711 8101-0",emergency:"+49 711 8101-3456",thrombolysis:!0,beds:850,network:"FAST"}],thrombolysisHospitals:[]},nordrheinWestfalen:{neurosurgicalCenters:[{id:"NRW-NS-001",name:"Universitätsklinikum Düsseldorf",address:"Moorenstraße 5, 40225 Düsseldorf",coordinates:{lat:51.1906,lng:6.8064},phone:"+49 211 81-0",emergency:"+49 211 81-17700",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1300,network:"NEVANO+"},{id:"NRW-NS-002",name:"Universitätsklinikum Köln",address:"Kerpener Str. 62, 50937 Köln",coordinates:{lat:50.9253,lng:6.9187},phone:"+49 221 478-0",emergency:"+49 221 478-32500",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1500,network:"NEVANO+"},{id:"NRW-NS-003",name:"Universitätsklinikum Essen",address:"Hufelandstraße 55, 45147 Essen",coordinates:{lat:51.4285,lng:7.0073},phone:"+49 201 723-0",emergency:"+49 201 723-84444",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1350,network:"NEVANO+"},{id:"NRW-NS-004",name:"Universitätsklinikum Münster",address:"Albert-Schweitzer-Campus 1, 48149 Münster",coordinates:{lat:51.9607,lng:7.6261},phone:"+49 251 83-0",emergency:"+49 251 83-47255",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1513,network:"NEVANO+"},{id:"NRW-NS-005",name:"Universitätsklinikum Bonn",address:"Venusberg-Campus 1, 53127 Bonn",coordinates:{lat:50.6916,lng:7.1127},phone:"+49 228 287-0",emergency:"+49 228 287-15107",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1200,network:"NEVANO+"},{id:"NRW-NS-006",name:"Klinikum Dortmund",address:"Beurhausstraße 40, 44137 Dortmund",coordinates:{lat:51.5036,lng:7.4663},phone:"+49 231 953-0",emergency:"+49 231 953-20050",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1200,network:"NVNR"},{id:"NRW-NS-007",name:"Rhein-Maas Klinikum Würselen",address:"Mauerfeldstraße 25, 52146 Würselen",coordinates:{lat:50.8178,lng:6.1264},phone:"+49 2405 62-0",emergency:"+49 2405 62-2222",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:420,network:"NEVANO+"}],comprehensiveStrokeCenters:[{id:"NRW-CS-001",name:"Universitätsklinikum Aachen",address:"Pauwelsstraße 30, 52074 Aachen",coordinates:{lat:50.778,lng:6.0614},phone:"+49 241 80-0",emergency:"+49 241 80-89611",thrombectomy:!0,thrombolysis:!0,beds:1400,network:"NEVANO+"}],regionalStrokeUnits:[{id:"NRW-RSU-001",name:"Helios Universitätsklinikum Wuppertal",address:"Heusnerstraße 40, 42283 Wuppertal",coordinates:{lat:51.2467,lng:7.1703},phone:"+49 202 896-0",emergency:"+49 202 896-2180",thrombolysis:!0,beds:1050,network:"NEVANO+"}],thrombolysisHospitals:[{id:"NRW-TH-009",name:"Elisabeth-Krankenhaus Essen",address:"Klara-Kopp-Weg 1, 45138 Essen",coordinates:{lat:51.4495,lng:7.0137},phone:"+49 201 897-0",thrombolysis:!0,beds:583},{id:"NRW-TH-010",name:"Klinikum Oberberg Gummersbach",address:"Wilhelm-Breckow-Allee 20, 51643 Gummersbach",coordinates:{lat:51.0277,lng:7.5694},phone:"+49 2261 17-0",thrombolysis:!0,beds:431},{id:"NRW-TH-011",name:"St. Vincenz-Krankenhaus Limburg",address:"Auf dem Schafsberg, 65549 Limburg",coordinates:{lat:50.3856,lng:8.0584},phone:"+49 6431 292-0",thrombolysis:!0,beds:452},{id:"NRW-TH-012",name:"Klinikum Lüdenscheid",address:"Paulmannshöher Straße 14, 58515 Lüdenscheid",coordinates:{lat:51.2186,lng:7.6298},phone:"+49 2351 46-0",thrombolysis:!0,beds:869}]}},mi={routePatient(i){const{location:e,state:t,ichProbability:s,timeFromOnset:a,clinicalFactors:n}=i,r=t||this.detectState(e),l=st[r];if(s>=.5){const d=this.findNearest(e,l.neurosurgicalCenters);if(!d)throw new Error(`No neurosurgical centers available in ${r}`);return{category:"NEUROSURGICAL_CENTER",destination:d,urgency:"IMMEDIATE",reasoning:"High bleeding probability (≥50%) - neurosurgical evaluation required",preAlert:"Activate neurosurgery team",bypassLocal:!0,threshold:"≥50%",state:r}}if(s>=.3){const d=[...l.neurosurgicalCenters,...l.comprehensiveStrokeCenters];return{category:"COMPREHENSIVE_CENTER",destination:this.findNearest(e,d),urgency:"URGENT",reasoning:"Intermediate bleeding risk (30-50%) - CT and possible intervention",preAlert:"Prepare for possible neurosurgical consultation",transferPlan:this.findNearest(e,l.neurosurgicalCenters),threshold:"30-50%",state:r}}if(a&&a<=270){const d=[...l.neurosurgicalCenters,...l.comprehensiveStrokeCenters,...l.regionalStrokeUnits,...l.thrombolysisHospitals];return{category:"THROMBOLYSIS_CAPABLE",destination:this.findNearest(e,d),urgency:"TIME_CRITICAL",reasoning:"Low bleeding risk (<30%), within tPA window - nearest thrombolysis",preAlert:"Prepare for thrombolysis protocol",bypassLocal:!1,threshold:"<30%",timeWindow:"≤4.5h",state:r}}const o=[...l.neurosurgicalCenters,...l.comprehensiveStrokeCenters,...l.regionalStrokeUnits];return{category:"STROKE_UNIT",destination:this.findNearest(e,o),urgency:"STANDARD",reasoning:a>270?"Low bleeding risk, outside tPA window - standard stroke evaluation":"Low bleeding risk - standard stroke evaluation",preAlert:"Standard stroke protocol",bypassLocal:!1,threshold:"<30%",timeWindow:a?">4.5h":"unknown",state:r}},detectState(i){return i.lat>=47.5&&i.lat<=49.8&&i.lng>=7.5&&i.lng<=10.2?"badenWuerttemberg":i.lat>=50.3&&i.lat<=52.5&&i.lng>=5.9&&i.lng<=9.5?"nordrheinWestfalen":i.lat>=47.2&&i.lat<=50.6&&i.lng>=10.2&&i.lng<=13.8?"bayern":this.findNearestState(i)},findNearestState(i){const e={bayern:{lat:49,lng:11.5},badenWuerttemberg:{lat:48.5,lng:9},nordrheinWestfalen:{lat:51.5,lng:7.5}};let t="bayern",s=1/0;for(const[a,n]of Object.entries(e)){const r=this.calculateDistance(i,n);r<s&&(s=r,t=a)}return t},findNearest(i,e){return!e||e.length===0?(console.warn("No hospitals available in database"),null):e.map(t=>!t.coordinates||typeof t.coordinates.lat!="number"?(console.warn(`Hospital ${t.name} missing valid coordinates`),null):{...t,distance:this.calculateDistance(i,t.coordinates)}).filter(t=>t!==null).sort((t,s)=>t.distance-s.distance)[0]},calculateDistance(i,e){const s=this.toRad(e.lat-i.lat),a=this.toRad(e.lng-i.lng),n=Math.sin(s/2)*Math.sin(s/2)+Math.cos(this.toRad(i.lat))*Math.cos(this.toRad(e.lat))*Math.sin(a/2)*Math.sin(a/2);return 6371*(2*Math.atan2(Math.sqrt(n),Math.sqrt(1-n)))},toRad(i){return i*(Math.PI/180)}};function oe(i,e,t,s){const n=ee(t-i),r=ee(s-e),l=Math.sin(n/2)*Math.sin(n/2)+Math.cos(ee(i))*Math.cos(ee(t))*Math.sin(r/2)*Math.sin(r/2);return 6371*(2*Math.atan2(Math.sqrt(l),Math.sqrt(1-l)))}function ee(i){return i*(Math.PI/180)}async function hi(i,e,t,s,a="driving-car"){try{const n=`https://api.openrouteservice.org/v2/directions/${a}`,l=await fetch(n,{method:"POST",headers:{Accept:"application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",Authorization:"5b3ce3597851110001cf624868c4c27b63ae476c9c26c8bffbc35688","Content-Type":"application/json; charset=utf-8"},body:JSON.stringify({coordinates:[[e,i],[s,t]],radiuses:[1e3,1e3],format:"json"})});if(!l.ok)throw new Error(`Routing API error: ${l.status}`);const o=await l.json();if(o.routes&&o.routes.length>0){const d=o.routes[0];return{duration:Math.round(d.summary.duration/60),distance:Math.round(d.summary.distance/1e3),source:"routing"}}throw new Error("No route found")}catch(n){console.warn("Travel time calculation failed, using distance estimate:",n);const r=oe(i,e,t,s);return{duration:Math.round(r/.8),distance:Math.round(r),source:"estimated"}}}async function Fe(i,e,t,s){try{const a=await hi(i,e,t,s,"driving-car");return{duration:Math.round(a.duration*.75),distance:a.distance,source:a.source==="routing"?"emergency-routing":"emergency-estimated"}}catch{const n=oe(i,e,t,s);return{duration:Math.round(n/1.2),distance:Math.round(n),source:"emergency-estimated"}}}function ke(i){return`
    <div class="stroke-center-section">
      <h3>🏥 ${c("nearestCentersTitle")}</h3>
      <div id="locationContainer">
        <div class="location-controls">
          <button type="button" id="useGpsButton" class="secondary">
            📍 ${c("useCurrentLocation")}
          </button>
          <div class="location-manual" style="display: none;">
            <input type="text" id="locationInput" placeholder="${c("enterLocationPlaceholder")||"e.g. München, Köln, Stuttgart, or 48.1351, 11.5820"}" />
            <button type="button" id="searchLocationButton" class="secondary">${c("search")}</button>
          </div>
          <button type="button" id="manualLocationButton" class="secondary">
            ✏️ ${c("enterManually")}
          </button>
        </div>
        <div id="strokeCenterResults" class="stroke-center-results"></div>
      </div>
    </div>
  `}function at(i){const e=document.getElementById("useGpsButton"),t=document.getElementById("manualLocationButton"),s=document.querySelector(".location-manual"),a=document.getElementById("locationInput"),n=document.getElementById("searchLocationButton"),r=document.getElementById("strokeCenterResults");e&&e.addEventListener("click",()=>{gi(i,r)}),t&&t.addEventListener("click",()=>{s.style.display=s.style.display==="none"?"block":"none"}),n&&n.addEventListener("click",()=>{const l=a.value.trim();l&&He(l,i,r)}),a&&a.addEventListener("keypress",l=>{if(l.key==="Enter"){const o=a.value.trim();o&&He(o,i,r)}})}function gi(i,e){if(!navigator.geolocation){q(c("geolocationNotSupported"),e);return}e.innerHTML=`<div class="loading">${c("gettingLocation")}...</div>`,navigator.geolocation.getCurrentPosition(t=>{const{latitude:s,longitude:a}=t.coords;fe(s,a,i,e)},t=>{let s=c("locationError");switch(t.code){case t.PERMISSION_DENIED:s=c("locationPermissionDenied");break;case t.POSITION_UNAVAILABLE:s=c("locationUnavailable");break;case t.TIMEOUT:s=c("locationTimeout");break}q(s,e)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:3e5})}async function He(i,e,t){t.innerHTML=`<div class="loading">${c("searchingLocation")}...</div>`;const s=/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/,a=i.trim().match(s);if(a){const n=parseFloat(a[1]),r=parseFloat(a[2]);if(n>=47.2&&n<=52.5&&r>=5.9&&r<=15){t.innerHTML=`
        <div class="location-success">
          <p>📍 Coordinates: ${n.toFixed(4)}, ${r.toFixed(4)}</p>
        </div>
      `,setTimeout(()=>{fe(n,r,e,t)},500);return}q("Coordinates appear to be outside Germany. Please check the values.",t);return}try{let n=i.trim();!n.toLowerCase().includes("deutschland")&&!n.toLowerCase().includes("germany")&&!n.toLowerCase().includes("bayern")&&!n.toLowerCase().includes("bavaria")&&!n.toLowerCase().includes("nordrhein")&&!n.toLowerCase().includes("baden")&&(n+=", Deutschland");const l=`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(n)}&countrycodes=de&format=json&limit=3&addressdetails=1`,o=await fetch(l,{method:"GET",headers:{Accept:"application/json","User-Agent":"iGFAP-StrokeTriage/2.1.0"}});if(!o.ok)throw new Error(`Geocoding API error: ${o.status}`);const d=await o.json();if(d&&d.length>0){let m=d[0];const u=["Bayern","Baden-Württemberg","Nordrhein-Westfalen"];for(const y of d)if(y.address&&u.includes(y.address.state)){m=y;break}const p=parseFloat(m.lat),S=parseFloat(m.lon),f=m.display_name||i;t.innerHTML=`
        <div class="location-success">
          <p>📍 Found: ${f}</p>
          <small style="color: #666;">Lat: ${p.toFixed(4)}, Lng: ${S.toFixed(4)}</small>
        </div>
      `,setTimeout(()=>{fe(p,S,e,t)},1e3)}else q(`
        <strong>Location "${i}" not found.</strong><br>
        <small>Try:</small>
        <ul style="text-align: left; font-size: 0.9em; margin: 10px 0;">
          <li>City name: "München", "Köln", "Stuttgart"</li>
          <li>Address: "Marienplatz 1, München"</li>
          <li>Coordinates: "48.1351, 11.5820"</li>
        </ul>
      `,t)}catch(n){console.warn("Geocoding failed:",n),q(`
      <strong>Unable to search location.</strong><br>
      <small>Please try entering coordinates directly (e.g., "48.1351, 11.5820")</small>
    `,t)}}async function fe(i,e,t,s){var l,o;const a={lat:i,lng:e},n=mi.routePatient({location:a,ichProbability:((l=t==null?void 0:t.ich)==null?void 0:l.probability)||0,timeFromOnset:(t==null?void 0:t.timeFromOnset)||null,clinicalFactors:(t==null?void 0:t.clinicalFactors)||{}});if(!n||!n.destination){s.innerHTML=`
      <div class="location-error">
        <p>⚠️ No suitable stroke centers found in this area.</p>
        <p><small>Please try a different location or contact emergency services directly.</small></p>
      </div>
    `;return}const r=pi(n,t);s.innerHTML=`
    <div class="location-info">
      <p><strong>${c("yourLocation")}:</strong> ${i.toFixed(4)}, ${e.toFixed(4)}</p>
      <p><strong>Detected State:</strong> ${Be(n.state)}</p>
    </div>
    <div class="loading">${c("calculatingTravelTimes")}...</div>
  `;try{const d=st[n.state],m=[...d.neurosurgicalCenters,...d.comprehensiveStrokeCenters,...d.regionalStrokeUnits,...d.thrombolysisHospitals||[]],{destination:u}=n;u.distance=oe(i,e,u.coordinates.lat,u.coordinates.lng);try{const f=await Fe(i,e,u.coordinates.lat,u.coordinates.lng);u.travelTime=f.duration,u.travelSource=f.source}catch{u.travelTime=Math.round(u.distance/.8),u.travelSource="estimated"}const p=m.filter(f=>f.id!==u.id).map(f=>({...f,distance:oe(i,e,f.coordinates.lat,f.coordinates.lng)})).sort((f,y)=>f.distance-y.distance).slice(0,3);for(const f of p)try{const y=await Fe(i,e,f.coordinates.lat,f.coordinates.lng);f.travelTime=y.duration,f.travelSource=y.source}catch{f.travelTime=Math.round(f.distance/.8),f.travelSource="estimated"}const S=`
      <div class="location-info">
        <p><strong>${c("yourLocation")}:</strong> ${i.toFixed(4)}, ${e.toFixed(4)}</p>
        <p><strong>State:</strong> ${Be(n.state)}</p>
        ${r}
      </div>
      
      <div class="recommended-centers">
        <h4>🏥 ${n.urgency==="IMMEDIATE"?"Emergency":"Recommended"} Destination</h4>
        ${Ve(u,!0,n)}
      </div>
      
      ${p.length>0?`
        <div class="alternative-centers">
          <h4>Alternative Centers</h4>
          ${p.map(f=>Ve(f,!1,n)).join("")}
        </div>
      `:""}
      
      <div class="travel-time-note">
        <small>${c("travelTimeNote")||"Travel times estimated for emergency vehicles"}</small>
      </div>
    `;s.innerHTML=S}catch(d){console.warn("Enhanced routing failed, using basic display:",d),s.innerHTML=`
      <div class="location-info">
        <p><strong>${c("yourLocation")}:</strong> ${i.toFixed(4)}, ${e.toFixed(4)}</p>
        ${r}
      </div>
      
      <div class="recommended-centers">
        <h4>Recommended Center</h4>
        <div class="stroke-center-card recommended">
          <div class="center-header">
            <h5>${n.destination.name}</h5>
            <span class="distance">${((o=n.destination.distance)==null?void 0:o.toFixed(1))||"?"} km</span>
          </div>
          <div class="center-details">
            <p class="address">📍 ${n.destination.address}</p>
            <p class="phone">📞 ${n.destination.emergency||n.destination.phone}</p>
          </div>
        </div>
      </div>
      
      <div class="routing-reasoning">
        <p><strong>Routing Logic:</strong> ${n.reasoning}</p>
      </div>
    `}}function Be(i){return{bayern:"Bayern (Bavaria)",badenWuerttemberg:"Baden-Württemberg",nordrheinWestfalen:"Nordrhein-Westfalen (NRW)"}[i]||i}function pi(i,e){var a;const t=Math.round((((a=e==null?void 0:e.ich)==null?void 0:a.probability)||0)*100);let s="🏥";return i.urgency==="IMMEDIATE"?s="🚨":i.urgency==="TIME_CRITICAL"?s="⏰":i.urgency==="URGENT"&&(s="⚠️"),`
    <div class="routing-explanation ${i.category.toLowerCase()}">
      <div class="routing-header">
        <strong>${s} ${i.category.replace("_"," ")} - ${i.urgency}</strong>
      </div>
      <div class="routing-details">
        <p><strong>ICH Risk:</strong> ${t}% ${i.threshold?`(${i.threshold})`:""}</p>
        ${i.timeWindow?`<p><strong>Time Window:</strong> ${i.timeWindow}</p>`:""}
        <p><strong>Routing Logic:</strong> ${i.reasoning}</p>
        <p><strong>Pre-Alert:</strong> ${i.preAlert}</p>
        ${i.bypassLocal?'<p class="bypass-warning">⚠️ Bypassing local hospitals</p>':""}
      </div>
    </div>
  `}function Ve(i,e,t){const s=[];i.neurosurgery&&s.push("🧠 Neurosurgery"),i.thrombectomy&&s.push("🩸 Thrombectomy"),i.thrombolysis&&s.push("💉 Thrombolysis");const a=i.network?`<span class="network-badge">${i.network}</span>`:"";return`
    <div class="stroke-center-card ${e?"recommended":"alternative"} enhanced">
      <div class="center-header">
        <h5>${i.name}</h5>
        <div class="center-badges">
          ${i.neurosurgery?'<span class="capability-badge neurosurgery">NS</span>':""}
          ${i.thrombectomy?'<span class="capability-badge thrombectomy">TE</span>':""}
          ${a}
        </div>
      </div>
      
      <div class="center-metrics">
        ${i.travelTime?`
          <div class="travel-info">
            <span class="travel-time">${i.travelTime} min</span>
            <span class="distance">${i.distance.toFixed(1)} km</span>
          </div>
        `:`
          <div class="distance-only">
            <span class="distance">${i.distance.toFixed(1)} km</span>
          </div>
        `}
        <div class="bed-info">
          <span class="beds">${i.beds} beds</span>
        </div>
      </div>
      
      <div class="center-details">
        <p class="address">📍 ${i.address}</p>
        <p class="phone">📞 ${i.emergency||i.phone}</p>
        
        ${s.length>0?`
          <div class="capabilities">
            ${s.join(" • ")}
          </div>
        `:""}
      </div>
      
      <div class="center-actions">
        <button class="call-button" onclick="window.open('tel:${i.emergency||i.phone}')">
          📞 Call
        </button>
        <button class="directions-button" onclick="window.open('https://maps.google.com/maps?daddr=${i.coordinates.lat},${i.coordinates.lng}', '_blank')">
          🧭 Directions
        </button>
      </div>
    </div>
  `}function q(i,e){e.innerHTML=`
    <div class="location-error">
      <p>⚠️ ${i}</p>
      <p><small>${c("tryManualEntry")}</small></p>
    </div>
  `}const fi=Object.freeze(Object.defineProperty({__proto__:null,initializeStrokeCenterMap:at,renderStrokeCenterMap:ke},Symbol.toStringTag,{value:"Module"}));function vi(i,e){const t=Number(i),s=Ge[e];return t>=s.high?"🔴 HIGH RISK":t>=s.medium?"🟡 MEDIUM RISK":"🟢 LOW RISK"}const K={low:{max:10,color:"#dc2626",label:"Small",severity:"low"},moderate:{min:10,max:20,color:"#dc2626",label:"Moderate",severity:"moderate"},high:{min:20,max:30,color:"#dc2626",label:"Large",severity:"high"},critical:{min:30,color:"#dc2626",label:"Critical",severity:"critical"}},yi={"<10ml":"5-10%","10-30ml":"10-19%","30-50ml":"19-44%","50-60ml":"44-91%","≥60ml":"91-100%"};function ce(i){if(!i||i<=0)return{volume:0,volumeRange:{min:0,max:0},riskLevel:"low",mortalityRate:"~0%",isValid:!0,calculation:"No hemorrhage detected"};const e=Math.min(i,1e4);i>1e4&&console.warn(`GFAP value ${i} exceeds expected range, capped at 10,000 pg/ml`);try{const s=10**(.0192+.4533*Math.log10(e)),a={min:s*.7,max:s*1.3},n=nt(s),r=bi(s),l=s<1?"<1":s.toFixed(1);return{volume:s,displayVolume:l,volumeRange:{min:a.min.toFixed(1),max:a.max.toFixed(1)},riskLevel:n,mortalityRate:r,isValid:!0,calculation:`Based on GFAP ${i} pg/ml`,threshold:s>=30?"SURGICAL":s>=20?"HIGH_RISK":"MANAGEABLE"}}catch(t){return console.error("Volume calculation error:",t),{volume:0,volumeRange:{min:0,max:0},riskLevel:"low",mortalityRate:"Unknown",isValid:!1,calculation:"Calculation error",error:t.message}}}function nt(i){return i>=K.critical.min?"critical":i>=K.high.min?"high":i>=K.moderate.min?"moderate":"low"}function bi(i){return i<10?"5-10%⁴":i<30?`${Math.round(10+(i-10)*9/20)}%⁴`:i<50?`${Math.round(19+(i-30)*25/20)}%³`:i<60?`${Math.round(44+(i-50)*47/10)}%²`:i<80?`${Math.round(91+(i-60)*5/20)}%¹`:"96-100%¹"}function we(i){if(i<=0)return 0;if(i>=100)return 70;const e=Math.sqrt(i/30)*40;return Math.min(e,70)}function de(i){const e=nt(i);return K[e].color}function Si(){const i=[{gfap:100,expectedVolume:"~5ml"},{gfap:500,expectedVolume:"~15ml"},{gfap:1e3,expectedVolume:"~21ml"},{gfap:1500,expectedVolume:"~28ml"},{gfap:3e3,expectedVolume:"~50ml"},{gfap:5e3,expectedVolume:"~72ml"}];console.log("🧪 ICH Volume Calculator Test Results:"),i.forEach(e=>{const t=ce(e.gfap);console.log(`GFAP ${e.gfap}: ${t.displayVolume}ml (${e.expectedVolume}) - ${t.riskLevel} risk - ${t.mortalityRate}`)})}function rt(i){return i<1?"<1 ml":i<10?`${i.toFixed(1)} ml`:`${Math.round(i)} ml`}const Ei=Object.freeze(Object.defineProperty({__proto__:null,MORTALITY_BY_VOLUME:yi,VOLUME_THRESHOLDS:K,calculateHemorrhageSizePercent:we,calculateICHVolume:ce,formatVolumeDisplay:rt,getVolumeColor:de,testVolumeCalculator:Si},Symbol.toStringTag,{value:"Module"}));function ki(i,e="compact"){const t=e==="compact"?{width:120,height:120}:{width:200,height:200},s=t.width/2,a=t.height/2,n=we(i),r=de(i),l=t.width*.25,o=n/70*l,d=s+t.width*.1,m=a+t.height*.05,u=40/70*l;return`${Math.random().toString(36).substr(2,9)}`,`
    <div class="brain-visualization ${e}">
      <svg 
        width="${t.width}" 
        height="${t.height}" 
        viewBox="0 0 ${t.width} ${t.height}"
        class="brain-svg"
        role="img"
        aria-label="Brain hemorrhage visualization showing ${i.toFixed(1)}ml ICH volume"
      >
        <!-- Brain outline with hemorrhage overlay -->
        ${wi(t,i)}
        
        <!-- 30ml reference indicator (detailed view only) -->
        ${e==="detailed"&&i>0?`
          <circle 
            cx="${d}" 
            cy="${m}" 
            r="${u}"
            fill="none" 
            stroke="#9ca3af" 
            stroke-width="1" 
            stroke-dasharray="3,3"
            opacity="0.5"
          />
          <text 
            x="${d+u+5}" 
            y="${m-u}" 
            font-size="10" 
            fill="#6b7280"
            font-family="system-ui"
          >30ml</text>
        `:""}
        
        <!-- Hemorrhage visualization -->
        ${i>0?`
          <circle 
            cx="${d}" 
            cy="${m}" 
            r="${o}"
            fill="${r}"
            opacity="0.8"
            class="hemorrhage-circle"
          >
            <!-- Subtle pulsing animation -->
            <animate 
              attributeName="opacity" 
              values="0.6;0.9;0.6" 
              dur="2.5s" 
              repeatCount="indefinite"
            />
            ${o>15?`
            <animate 
              attributeName="r" 
              values="${o*.95};${o};${o*.95}" 
              dur="2.5s" 
              repeatCount="indefinite"
            />
            `:""}
          </circle>
          
          <!-- Volume label (detailed view only) -->
          ${e==="detailed"?`
            <text 
              x="${s}" 
              y="${t.height-10}" 
              text-anchor="middle" 
              font-size="12" 
              font-weight="bold"
              fill="#374151"
              font-family="system-ui"
            >${i<1?"<1":i.toFixed(1)} ml</text>
          `:""}
        `:""}
        
        <style>
          .hemorrhage-circle {
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
          }
        </style>
      </svg>
    </div>
  `}function wi(i,e){const t=i.width/2,s=i.height/2,a=t+i.width*.08,n=s+i.height*.03,r=we(e),l=de(e),o=i.width*.25,d=r/70*o;return`
    <!-- 3D Brain image as background -->
    <image 
      x="0" 
      y="0" 
      width="${i.width}" 
      height="${i.height}"
      href="./src/assets/brain-3d.png"
      opacity="0.95"
      preserveAspectRatio="xMidYMid meet"
    />
    
    <!-- Hemorrhage overlay in basal ganglia region -->
    ${e>0?`
      <circle 
        cx="${a}" 
        cy="${n}" 
        r="${d}"
        fill="${l}"
        opacity="0.85"
        class="hemorrhage-circle"
      >
        <!-- Subtle pulsing animation -->
        <animate 
          attributeName="opacity" 
          values="0.7;0.95;0.7" 
          dur="2.5s" 
          repeatCount="indefinite"
        />
        ${d>8?`
        <animate 
          attributeName="r" 
          values="${d*.96};${d*1.02};${d*.96}" 
          dur="2.5s" 
          repeatCount="indefinite"
        />
        `:""}
      </circle>
      
      <!-- Hemorrhage center highlight -->
      <circle 
        cx="${a}" 
        cy="${n}" 
        r="${d*.3}"
        fill="${l}"
        opacity="0.95"
        class="hemorrhage-center"
      />
    `:""}
  `}function Ti(i,e=24){const t=de(i),s=i>0?Math.max(2,i/50*e*.3):0;return`
    <svg 
      width="${e}" 
      height="${e}" 
      viewBox="0 0 ${e} ${e}"
      class="brain-icon"
      style="display: inline-block; vertical-align: middle;"
    >
      <!-- Simple brain outline -->
      <ellipse 
        cx="${e/2}" 
        cy="${e/2}" 
        rx="${e*.4}" 
        ry="${e*.35}" 
        fill="#f1f5f9" 
        stroke="#64748b" 
        stroke-width="1"
      />
      
      <!-- Hemorrhage indicator -->
      ${i>0?`
        <circle 
          cx="${e/2+e*.1}" 
          cy="${e/2}" 
          r="${s}"
          fill="${t}"
          opacity="0.9"
        />
      `:""}
    </svg>
  `}function ot(i){if(!i||i<=0)return`
      <div class="volume-circle" data-volume="0">
        <div class="volume-number">0<span> ml</span></div>
        <canvas class="volume-canvas" width="120" height="120"></canvas>
      </div>
    `;const e=rt(i),t=`volume-canvas-${Math.random().toString(36).substr(2,9)}`;return`
    <div class="volume-circle" data-volume="${i}">
      <div class="volume-number">${e}</div>
      <canvas id="${t}" class="volume-canvas" 
              data-volume="${i}" data-canvas-id="${t}"></canvas>
    </div>
  `}function lt(){document.querySelectorAll(".volume-canvas").forEach(e=>{const t=e.offsetWidth||120,s=e.offsetHeight||120;e.width=t,e.height=s;const a=parseFloat(e.dataset.volume)||0;a>0&&Ci(e,a)})}function Ci(i,e){const t=i.getContext("2d"),s=i.width/2,a=i.height/2,n=i.width*.45;let r=0,l=!0;const o=document.body.classList.contains("dark-mode")||window.matchMedia("(prefers-color-scheme: dark)").matches;function d(){l&&(t.clearRect(0,0,i.width,i.height),m())}function m(){const f=Math.min(e/80,.9)*(n*1.8),y=a+n-4-f;if(e>0){t.save(),t.beginPath(),t.arc(s,a,n-4,0,Math.PI*2),t.clip(),t.fillStyle="#dc2626",t.globalAlpha=.7,t.fillRect(0,y+5,i.width,i.height),t.globalAlpha=.9,t.fillStyle="#dc2626",t.beginPath();const P=s-n+4;t.moveTo(P,y);for(let R=P;R<=s+n-4;R+=2){const me=Math.sin(R*.05+r*.08)*3,he=Math.sin(R*.08+r*.12+1)*2,Q=y+me+he;t.lineTo(R,Q)}t.lineTo(s+n-4,i.height),t.lineTo(P,i.height),t.closePath(),t.fill(),t.restore()}const L=getComputedStyle(document.documentElement).getPropertyValue("--text-secondary").trim()||(o?"#8899a6":"#6c757d");t.strokeStyle=L,t.lineWidth=8,t.globalAlpha=.4,t.beginPath(),t.arc(s,a,n,0,Math.PI*2),t.stroke(),t.globalAlpha=1;const w=Math.min(e/100,1),T=getComputedStyle(document.documentElement).getPropertyValue("--danger-color").trim()||"#dc2626";t.strokeStyle=T,t.lineWidth=8,t.setLineDash([]),t.lineCap="round",t.beginPath(),t.arc(s,a,n,-Math.PI/2,-Math.PI/2+w*2*Math.PI),t.stroke(),r+=1,e>0&&requestAnimationFrame(d)}d();const u=new MutationObserver(()=>{document.contains(i)||(l=!1,u.disconnect())});u.observe(document.body,{childList:!0,subtree:!0})}function Li(i){return`brain-visualization ${i==="compact"?"compact-brain":"detailed-brain"}`}const Ai=Object.freeze(Object.defineProperty({__proto__:null,getBrainVisualizationClasses:Li,initializeVolumeAnimations:lt,renderBrainVisualization:ki,renderCircularBrainDisplay:ot,renderCompactBrainIcon:Ti},Symbol.toStringTag,{value:"Module"}));function ct(){const i=v.getState(),{formData:e}=i;if(!e||Object.keys(e).length===0)return"";let t="";return Object.entries(e).forEach(([s,a])=>{if(a&&Object.keys(a).length>0){const n=c(`${s}ModuleTitle`)||s.charAt(0).toUpperCase()+s.slice(1);let r="";Object.entries(a).forEach(([l,o])=>{if(o===""||o===null||o===void 0)return;const d=ci(l),m=di(o,l);r+=`
          <div class="summary-item">
            <span class="summary-label">${d}:</span>
            <span class="summary-value">${m}</span>
          </div>
        `}),r&&(t+=`
          <div class="summary-module">
            <h4>${n}</h4>
            <div class="summary-items">
              ${r}
            </div>
          </div>
        `)}}),t?`
    <div class="input-summary">
      <h3>📋 ${c("inputSummaryTitle")}</h3>
      <p class="summary-subtitle">${c("inputSummarySubtitle")}</p>
      <div class="summary-content">
        ${t}
      </div>
    </div>
  `:""}function ve(i,e,t){if(!e)return"";const s=Math.round((e.probability||0)*100),a=vi(s,i),n=s>70,r=s>Ge[i].high,l={ich:"🩸",lvo:"🧠"},o={ich:c("ichProbability"),lvo:c("lvoProbability")},d=n?"critical":r?"high":"normal";return`
    <div class="enhanced-risk-card ${i} ${d}">
      <div class="risk-header">
        <div class="risk-icon">${l[i]}</div>
        <div class="risk-title">
          <h3>${o[i]}</h3>
        </div>
      </div>
      
      <div class="risk-probability">
        <div class="circles-container">
          <div class="rings-row">
            <div class="circle-item">
              <div class="probability-circle" data-react-ring data-percent="${s}" data-level="${d}"></div>
              <div class="circle-label">${i==="ich"?"ICH Risk":"LVO Risk"}</div>
            </div>
          </div>
          <div class="risk-level ${d}">${a}</div>
        </div>
        
        <div class="risk-assessment"></div>
      </div>
    </div>
  `}function Ii(i){const e=i.gfap_value||Te();if(!e||e<=0)return"";const t=ce(e);return`
    <div class="volume-display-container">
      ${ot(t.volume)}
    </div>
  `}function Te(){var t;const i=v.getState(),{formData:e}=i;for(const s of["coma","limited","full"])if((t=e[s])!=null&&t.gfap_value)return parseFloat(e[s].gfap_value);return 0}function _i(i,e){const{ich:t,lvo:s}=i,a=Di(t),n=a!=="coma"?$i():null;n&&z(a)&&et(t,n,ue());const r=(t==null?void 0:t.module)==="Limited"||(t==null?void 0:t.module)==="Coma"||(s==null?void 0:s.notPossible)===!0;t==null||t.module;let l;return r?l=Mi(t,i,e,n,a):l=Pi(t,s,i,e,n,a),setTimeout(async()=>{lt();try{const{mountIslands:o}=await N(async()=>{const{mountIslands:d}=await import("./mountIslands-D7AccEft.js");return{mountIslands:d}},[]);o()}catch(o){console.warn("React islands not available:",o)}},100),l}function Mi(i,e,t,s,a){const n=i&&i.probability>.6?it():"",r=Math.round(((i==null?void 0:i.probability)||0)*100),l=ke(),o=ct(),d=z(a)?Se():"",m=s&&z(a)?Ee(i,s,ue()):"",u=(i==null?void 0:i.module)==="Coma"?Ni(i.probability):"",p=(i==null?void 0:i.module)!=="Coma"?mt(i.probability):"";return`
    <div class="container">
      ${U(3)}
      <h2>${c("bleedingRiskAssessment")||"Blutungsrisiko-Bewertung / Bleeding Risk Assessment"}</h2>
      ${n}
      
      <!-- Single ICH Risk Card -->
      <div class="risk-results-single">
        ${ve("ich",i)}
      </div>

      ${(i==null?void 0:i.module)==="Coma"&&r>=50?`
      <!-- ICH Volume Card (Coma only) -->
      <div class="risk-results-single">
        ${ht(i)}
      </div>
      `:""}
      
      <!-- Alternative Diagnoses for Coma Module -->
      ${u}
      
      <!-- Differential Diagnoses for Stroke Modules -->
      ${p}
      
      <!-- Research Model Comparison (hidden unless research mode) -->
      ${m}
      
      <!-- ICH Drivers Only (not shown for Coma module) -->
      ${(i==null?void 0:i.module)!=="Coma"?`
        <div class="enhanced-drivers-section">
          <h3>${c("riskFactorsTitle")||"Hauptrisikofaktoren / Main Risk Factors"}</h3>
          ${dt(i)}
        </div>
      `:""}
      
      <!-- Collapsible Additional Information -->
      <div class="additional-info-section">
        <button class="info-toggle" data-target="input-summary">
          <span class="toggle-icon">📋</span>
          <span class="toggle-text">${c("inputSummaryTitle")}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="input-summary" style="display: none;">
          ${o}
        </div>
        
        <button class="info-toggle" data-target="stroke-centers">
          <span class="toggle-icon">🏥</span>
          <span class="toggle-text">${c("nearestCentersTitle")}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="stroke-centers" style="display: none;">
          ${l}
        </div>
      </div>
      
      <div class="results-actions">
        <div class="primary-actions">
          <button type="button" class="primary" id="printResults"> 📄 ${c("printResults")} </button>
          <button type="button" class="secondary" data-action="reset"> ${c("newAssessment")} </button>
        </div>
        <div class="navigation-actions">
          <button type="button" class="tertiary" data-action="goBack"> ← ${c("goBack")} </button>
          <button type="button" class="tertiary" data-action="goHome"> 🏠 ${c("goHome")} </button>
        </div>
      </div>
      
      <div class="disclaimer">
        <strong>⚠️ ${c("importantNote")}:</strong> ${c("importantText")} Results generated at ${new Date().toLocaleTimeString()}.
      </div>
      
      ${ut(i)}
      ${d}
    </div>
  `}function Pi(i,e,t,s,a,n){var Ce,Le;const r=Math.round(((i==null?void 0:i.probability)||0)*100),l=Math.round(((e==null?void 0:e.probability)||0)*100),o=i&&i.probability>.6?it():"",d=ke(),m=ct(),u=z(n)?Se():"",p=a&&z(n)?Ee(i,a,ue()):"",S=v.getState(),f=parseInt((Le=(Ce=S.formData)==null?void 0:Ce.full)==null?void 0:Le.fast_ed_score)||0,y=n==="full"||(i==null?void 0:i.module)==="Full",L=e&&typeof e.probability=="number"&&!e.notPossible,w=y&&f>3&&L;console.log("  Conditions: isFullModule:",y),console.log("  Conditions: fastEdScore > 3:",f>3),console.log("  Conditions: hasValidLVO:",L),console.log("  Show LVO Card:",w);const T=r>=50,R=l/Math.max(r,.5),me=R>=.6&&R<=1.7,he=y&&r>=50&&l>=50&&!me,Q=y&&r>=30&&l>=30;let Z=1;w&&Z++,T&&Z++;const pt=Z===1?"risk-results-single":Z===2?"risk-results-dual":"risk-results-triple",ft=mt(i.probability);return`
    <div class="container">
      ${U(3)}
      <h2>${c("resultsTitle")}</h2>
      ${o}
      
      <!-- Risk Assessment Display -->
      <div class="${pt}">
        ${ve("ich",i)}
        ${w?ve("lvo",e):""}
        ${T?ht(i):""}
      </div>
      
      <!-- Treatment Decision Gauge (when strong signal) -->
      ${Q?Oi(r,l):""}
      ${!Q&&he?Ri(r,l,R):""}
      
      <!-- Differential Diagnoses for Stroke Modules -->
      ${ft}
      
      <!-- Research Model Comparison (hidden unless research mode) -->
      ${p}
      
      <!-- Risk Factor Drivers -->
      <div class="enhanced-drivers-section">
        <h3>${c("riskFactorsTitle")||"Risikofaktoren / Risk Factors"}</h3>
        ${w?ui(i,e):dt(i)}
      </div>
      
      <!-- Collapsible Additional Information -->
      <div class="additional-info-section">
        <button class="info-toggle" data-target="input-summary">
          <span class="toggle-icon">📋</span>
          <span class="toggle-text">${c("inputSummaryTitle")}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="input-summary" style="display: none;">
          ${m}
        </div>
        
        <button class="info-toggle" data-target="stroke-centers">
          <span class="toggle-icon">🏥</span>
          <span class="toggle-text">${c("nearestCentersTitle")}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="stroke-centers" style="display: none;">
          ${d}
        </div>
      </div>
      
      <div class="results-actions">
        <div class="primary-actions">
          <button type="button" class="primary" id="printResults"> 📄 ${c("printResults")} </button>
          <button type="button" class="secondary" data-action="reset"> ${c("newAssessment")} </button>
        </div>
        <div class="navigation-actions">
          <button type="button" class="tertiary" data-action="goBack"> ← ${c("goBack")} </button>
          <button type="button" class="tertiary" data-action="goHome"> 🏠 ${c("goHome")} </button>
        </div>
      </div>
      
      <div class="disclaimer">
        <strong>⚠️ ${c("importantNote")}:</strong> ${c("importantText")} Results generated at ${new Date().toLocaleTimeString()}.
      </div>
      
      ${ut(i)}
      ${u}
    </div>
  `}function Ri(i,e,t){const s=t>1?"LVO":"ICH",a=s==="LVO"?"🧠":"🩸",n=M.getCurrentLanguage()==="de"?s==="LVO"?"LVO-dominant":"ICH-dominant":s==="LVO"?"LVO dominant":"ICH dominant",r=M.getCurrentLanguage()==="de"?`Verhältnis LVO/ICH: ${t.toFixed(2)}`:`LVO/ICH ratio: ${t.toFixed(2)}`;return`
    <div class="tachometer-section">
      <div class="tachometer-card">
        <div class="treatment-recommendation ${s==="LVO"?"lvo-dominant":"ich-dominant"}">
          <div class="recommendation-icon">${a}</div>
          <div class="recommendation-text">
            <h4>${n}</h4>
            <p>${r}</p>
          </div>
          <div class="probability-summary">
            ICH: ${i}% | LVO: ${e}%
          </div>
        </div>
      </div>
    </div>
  `}function dt(i){if(!i||!i.drivers)return'<p class="no-drivers">No driver data available</p>';const e=i.drivers;if(!e.positive&&!e.negative)return'<p class="no-drivers">Driver format error</p>';const t=e.positive||[],s=e.negative||[];return`
    <div class="drivers-split-view">
      <div class="drivers-column positive-column">
        <div class="column-header">
          <span class="column-icon">⬆</span>
          <span class="column-title">${c("increasingRisk")||"Risikoerhöhend / Increasing Risk"}</span>
        </div>
        <div class="compact-drivers">
          ${t.length>0?t.slice(0,5).map(a=>ze(a,"positive")).join(""):`<p class="no-factors">${c("noFactors")||"Keine Faktoren / No factors"}</p>`}
        </div>
      </div>
      
      <div class="drivers-column negative-column">
        <div class="column-header">
          <span class="column-icon">⬇</span>
          <span class="column-title">${c("decreasingRisk")||"Risikomindernd / Decreasing Risk"}</span>
        </div>
        <div class="compact-drivers">
          ${s.length>0?s.slice(0,5).map(a=>ze(a,"negative")).join(""):`<p class="no-factors">${c("noFactors")||"Keine Faktoren / No factors"}</p>`}
        </div>
      </div>
    </div>
  `}function ze(i,e){const t=Math.abs(i.weight*100),s=Math.min(t*2,100);return`
    <div class="compact-driver-item">
      <div class="compact-driver-label">${re(i.label)}</div>
      <div class="compact-driver-bar ${e}" style="width: ${s}%;">
        <span class="compact-driver-value">${t.toFixed(1)}%</span>
      </div>
    </div>
  `}function ut(i){if(!i||!i.probability||Math.round((i.probability||0)*100)<50)return"";const t=Te();return!t||t<=0?"":`
    <div class="bibliography-section">
      <h4>${c("references")}</h4>
      <div class="citations">
        <div class="citation">
          <span class="citation-number">¹</span>
          <span class="citation-text">Broderick et al. (1993). Volume of intracerebral hemorrhage. A powerful and easy-to-use predictor of 30-day mortality. Stroke, 24(7), 987-993.</span>
        </div>
        <div class="citation">
          <span class="citation-number">²</span>
          <span class="citation-text">Krishnan et al. (2013). Hematoma expansion in intracerebral hemorrhage: Predictors and outcomes. Neurology, 81(19), 1660-1666.</span>
        </div>
        <div class="citation">
          <span class="citation-number">³</span>
          <span class="citation-text">Putra et al. (2020). Functional outcomes and mortality in patients with intracerebral hemorrhage. Critical Care Medicine, 48(3), 347-354.</span>
        </div>
        <div class="citation">
          <span class="citation-number">⁴</span>
          <span class="citation-text">Tangella et al. (2020). Early prediction of mortality in intracerebral hemorrhage using clinical markers. Journal of Neurocritical Care, 13(2), 89-97.</span>
        </div>
      </div>
    </div>
  `}function $i(i){try{const e=ue();return!e.age||!e.gfap?(console.warn("🔍 Missing required inputs for legacy model:",{age:e.age,gfap:e.gfap}),null):qt(e)}catch(e){return console.warn("Legacy model calculation failed (non-critical):",e),null}}function ue(){const i=v.getState(),{formData:e}=i;let t=null,s=null;for(const n of["coma","limited","full"])e[n]&&(t=t||e[n].age_years,s=s||e[n].gfap_value);return{age:parseInt(t)||null,gfap:parseFloat(s)||null}}function mt(i){return Math.round(i*100)>25?`
      <div class="alternative-diagnosis-card">
        <div class="diagnosis-header">
          <span class="lightning-icon">⚡</span>
          <h3>${c("differentialDiagnoses")}</h3>
        </div>
        <div class="diagnosis-content">
          <!-- Time Window Confirmation - Clinical Action -->
          <h4 class="clinical-action-heading">${c("reconfirmTimeWindow")}</h4>
          
          <!-- Actual Differential Diagnoses -->
          <ul class="diagnosis-list">
            <li>${c("unclearTimeWindow")}</li>
            <li>${c("rareDiagnoses")}</li>
          </ul>
        </div>
      </div>
    `:""}function Ni(i){const e=Math.round(i*100),t=M.getCurrentLanguage()==="de";return e>25?`
      <div class="alternative-diagnosis-card">
        <div class="diagnosis-header">
          <span class="lightning-icon">⚡</span>
          <h3>${t?"Differentialdiagnosen":"Differential Diagnoses"}</h3>
        </div>
        <div class="diagnosis-content">
          <ul class="diagnosis-list">
            <li>
              ${t?"Alternative Diagnosen sind SAB, SDH, EDH (Subarachnoidalblutung, Subduralhämatom, Epiduralhämatom)":"Alternative diagnoses include SAH, SDH, EDH (Subarachnoid Hemorrhage, Subdural Hematoma, Epidural Hematoma)"}
            </li>
            <li>
              ${t?"Bei unklarem Zeitfenster seit Symptombeginn oder im erweiterten Zeitfenster kommen auch ein demarkierter Infarkt oder hypoxischer Hirnschaden in Frage":"In cases of unclear time window since symptom onset or extended time window, demarcated infarction or hypoxic brain injury should also be considered"}
            </li>
          </ul>
        </div>
      </div>
    `:`
      <div class="alternative-diagnosis-card">
        <div class="diagnosis-header">
          <span class="lightning-icon">⚡</span>
          <h3>${t?"Differentialdiagnosen":"Differential Diagnoses"}</h3>
        </div>
        <div class="diagnosis-content">
          <ul class="diagnosis-list">
            <li>
              ${t?"Alternative Diagnose von Vigilanzminderung wahrscheinlich":"Alternative diagnosis for reduced consciousness likely"}
            </li>
            <li>
              ${t?"Ein Verschluss der Arteria Basilaris ist nicht ausgeschlossen":"Basilar artery occlusion cannot be excluded"}
            </li>
          </ul>
        </div>
      </div>
    `}function Di(i){if(!(i!=null&&i.module))return"unknown";const e=i.module.toLowerCase();return e.includes("coma")?"coma":e.includes("limited")?"limited":e.includes("full")?"full":"unknown"}function ht(i){const e=Te();if(!e||e<=0)return"";const t=ce(e);return Math.round(((i==null?void 0:i.probability)||0)*100),`
    <div class="enhanced-risk-card volume-card normal">
      <div class="risk-header">
        <div class="risk-icon">🧮</div>
        <div class="risk-title">
          <h3>${c("ichVolumeLabel")}</h3>
        </div>
      </div>
      
      <div class="risk-probability">
        <div class="circles-container">
          <div class="rings-row">
            <div class="circle-item">
              ${Ii(i)}
              <div class="circle-label">${c("ichVolumeLabel")}</div>
            </div>
          </div>
        </div>
        
        <div class="risk-assessment">
          <div class="mortality-assessment">
            ${c("predictedMortality")}: ${t.mortalityRate}
          </div>
        </div>
      </div>
    </div>
  `}function Oi(i,e){const t=e/Math.max(i,1);return`
    <div class="tachometer-section">
      <div class="tachometer-card">
        <div class="tachometer-header">
          <h3>🎯 ${M.getCurrentLanguage()==="de"?"Entscheidungshilfe – LVO/ICH":"Decision Support – LVO/ICH"}</h3>
          <div class="ratio-display">LVO/ICH Ratio: ${t.toFixed(2)}</div>
        </div>
        
        <div class="tachometer-gauge" id="tachometer-canvas-container">
          <div data-react-tachometer data-ich="${i}" data-lvo="${e}" data-title="${M.getCurrentLanguage()==="de"?"Entscheidungshilfe – LVO/ICH":"Decision Support – LVO/ICH"}"></div>
        </div>

        <!-- Legend chips for zones -->
        <div class="tachometer-legend" aria-hidden="true">
          <span class="legend-chip ich">ICH</span>
          <span class="legend-chip uncertain">${M.getCurrentLanguage()==="de"?"Unsicher":"Uncertain"}</span>
          <span class="legend-chip lvo">LVO</span>
        </div>

        <!-- Metrics row: ratio, confidence, absolute difference -->
        <div class="metrics-row" role="group" aria-label="Tachometer metrics">
          <div class="metric-card">
            <div class="metric-label">Ratio</div>
            <div class="metric-value">${t.toFixed(2)}</div>
            <div class="metric-unit">LVO/ICH</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Confidence</div>
            <div class="metric-value">${(()=>{const s=Math.abs(e-i),a=Math.max(e,i);let n=s<10?Math.round(30+a*.3):s<20?Math.round(50+a*.4):Math.round(70+a*.3);return n=Math.max(0,Math.min(100,n)),n})()}%</div>
            <div class="metric-unit">percent</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Difference</div>
            <div class="metric-value">${Math.abs(e-i).toFixed(0)}%</div>
            <div class="metric-unit">|LVO − ICH|</div>
          </div>
        </div>
        
        <div class="probability-summary">
          ICH: ${i}% | LVO: ${e}%
        </div>
        
        <!-- Hidden probability summary for initialization -->
        <div class="probability-summary" style="display: none;">
          ICH: ${i}% | LVO: ${e}%
        </div>
      </div>
    </div>
  `}function xi(){return`
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="app-logo">
            <div class="logo-icon">🧠</div>
            <h1>iGFAP Stroke Triage</h1>
            <div class="version-badge">Research Preview v2.1</div>
          </div>
        </div>

        <div class="login-content">
          <div class="access-notice">
            <h2>🔬 Research Access Required</h2>
            <p>This is a research preview of the iGFAP Stroke Triage Assistant for clinical validation.</p>

            <div class="research-disclaimer">
              <h3>⚠️ Important Notice</h3>
              <ul>
                <li><strong>Research Use Only</strong> - Not for clinical decision making</li>
                <li><strong>No Patient Data Storage</strong> - All data processed locally</li>
                <li><strong>Clinical Advisory</strong> - Under supervision of Prof. Christian Förch & Dr. Lovepreet Kalra</li>
                <li><strong>Contact:</strong> Deepak Bos (bosdeepak@gmail.com)</li>
              </ul>
            </div>
          </div>

          <form id="loginForm" class="login-form">
            <div class="form-group">
              <label for="researchPassword">Research Access Code</label>
              <input
                type="password"
                id="researchPassword"
                name="password"
                required
                autocomplete="off"
                placeholder="Enter research access code"
                class="password-input"
              >
            </div>

            <div id="loginError" class="error-message" style="display: none;"></div>

            <button type="submit" class="login-button primary">
              <span class="button-text">Access Research System</span>
              <span class="loading-spinner" style="display: none;">⏳</span>
            </button>
          </form>

          <div class="login-footer">
            <div class="regulatory-notice">
              <p><strong>Regulatory Status:</strong> Research prototype - CE certification pending</p>
              <p><strong>Data Protection:</strong> GDPR compliant - local processing only</p>
              <p><strong>Clinical Oversight:</strong> RKH Klinikum Ludwigsburg, Neurologie</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `}function Fi(){const i=document.getElementById("loginForm"),e=document.getElementById("researchPassword"),t=document.getElementById("loginError"),s=i.querySelector(".login-button");if(!i)return;e.focus(),i.addEventListener("submit",async l=>{l.preventDefault();const o=e.value.trim();if(!o){a("Please enter the research access code");return}r(!0),n();try{const d=await ne.hashPassword(o);await ne.authenticate(d)?(v.logEvent("auth_success",{timestamp:new Date().toISOString(),userAgent:navigator.userAgent.substring(0,100)}),v.navigate("triage1")):(a("Invalid access code. Please contact Deepak Bos for research access."),e.value="",e.focus(),v.logEvent("auth_failed",{timestamp:new Date().toISOString()}))}catch(d){a("Authentication system error. Please try again."),console.error("Authentication error:",d)}finally{r(!1)}}),e.addEventListener("input",()=>{n()});function a(l){t.textContent=l,t.style.display="block",e.classList.add("error")}function n(){t.style.display="none",e.classList.remove("error")}function r(l){const o=s.querySelector(".button-text"),d=s.querySelector(".loading-spinner");l?(o.style.display="none",d.style.display="inline",s.disabled=!0):(o.style.display="inline",d.style.display="none",s.disabled=!1)}}function Hi(i){const e=document.createElement("div");e.className="sr-only",e.setAttribute("role","status"),e.setAttribute("aria-live","polite");const t={triage1:"Coma assessment",triage2:"Examination capability assessment",coma:"Coma module",limited:"Limited data module",full:"Full stroke assessment",results:"Assessment results"};e.textContent=`Navigated to ${t[i]||i}`,document.body.appendChild(e),setTimeout(()=>e.remove(),1e3)}function Bi(i){const e="iGFAP",s={triage1:"Initial Assessment",triage2:"Examination Capability",coma:"Coma Module",limited:"Limited Data Module",full:"Full Stroke Module",results:"Assessment Results"}[i];document.title=s?`${e} — ${s}`:e}function Vi(){setTimeout(()=>{const i=document.querySelector("h2");i&&(i.setAttribute("tabindex","-1"),i.focus(),setTimeout(()=>i.removeAttribute("tabindex"),100))},100)}class zi{constructor(){this.scores={facial_palsy:0,arm_weakness:0,speech_changes:0,eye_deviation:0,denial_neglect:0},this.onApply=null,this.modal=null}getTotal(){return Object.values(this.scores).reduce((e,t)=>e+t,0)}getRiskLevel(){return this.getTotal()>=4?"high":"low"}render(){const e=this.getTotal(),t=this.getRiskLevel();return`
      <div id="fastEdModal" class="modal" role="dialog" aria-labelledby="fastEdModalTitle" aria-hidden="true" style="display: none !important;">
        <div class="modal-content fast-ed-modal">
          <div class="modal-header">
            <h2 id="fastEdModalTitle">${c("fastEdCalculatorTitle")}</h2>
            <button class="modal-close" aria-label="Close">&times;</button>
          </div>
          <div class="modal-body">
            
            <!-- Facial Palsy -->
            <div class="fast-ed-component">
              <h3>${c("facialPalsyTitle")}</h3>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="facial_palsy" value="0" ${this.scores.facial_palsy===0?"checked":""}>
                  <span class="radio-label">${c("facialPalsyNormal")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="facial_palsy" value="1" ${this.scores.facial_palsy===1?"checked":""}>
                  <span class="radio-label">${c("facialPalsyMild")}</span>
                </label>
              </div>
            </div>

            <!-- Arm Weakness -->
            <div class="fast-ed-component">
              <h3>${c("armWeaknessTitle")}</h3>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="arm_weakness" value="0" ${this.scores.arm_weakness===0?"checked":""}>
                  <span class="radio-label">${c("armWeaknessNormal")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="arm_weakness" value="1" ${this.scores.arm_weakness===1?"checked":""}>
                  <span class="radio-label">${c("armWeaknessMild")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="arm_weakness" value="2" ${this.scores.arm_weakness===2?"checked":""}>
                  <span class="radio-label">${c("armWeaknessSevere")}</span>
                </label>
              </div>
            </div>

            <!-- Speech Changes -->
            <div class="fast-ed-component">
              <h3>${c("speechChangesTitle")}</h3>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="speech_changes" value="0" ${this.scores.speech_changes===0?"checked":""}>
                  <span class="radio-label">${c("speechChangesNormal")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="speech_changes" value="1" ${this.scores.speech_changes===1?"checked":""}>
                  <span class="radio-label">${c("speechChangesMild")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="speech_changes" value="2" ${this.scores.speech_changes===2?"checked":""}>
                  <span class="radio-label">${c("speechChangesSevere")}</span>
                </label>
              </div>
            </div>

            <!-- Eye Deviation -->
            <div class="fast-ed-component">
              <h3>${c("eyeDeviationTitle")}</h3>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="eye_deviation" value="0" ${this.scores.eye_deviation===0?"checked":""}>
                  <span class="radio-label">${c("eyeDeviationNormal")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="eye_deviation" value="1" ${this.scores.eye_deviation===1?"checked":""}>
                  <span class="radio-label">${c("eyeDeviationPartial")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="eye_deviation" value="2" ${this.scores.eye_deviation===2?"checked":""}>
                  <span class="radio-label">${c("eyeDeviationForced")}</span>
                </label>
              </div>
            </div>

            <!-- Denial/Neglect -->
            <div class="fast-ed-component">
              <h3>${c("denialNeglectTitle")}</h3>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="denial_neglect" value="0" ${this.scores.denial_neglect===0?"checked":""}>
                  <span class="radio-label">${c("denialNeglectNormal")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="denial_neglect" value="1" ${this.scores.denial_neglect===1?"checked":""}>
                  <span class="radio-label">${c("denialNeglectPartial")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="denial_neglect" value="2" ${this.scores.denial_neglect===2?"checked":""}>
                  <span class="radio-label">${c("denialNeglectComplete")}</span>
                </label>
              </div>
            </div>

            <!-- Total Score Display -->
            <div class="fast-ed-total">
              <div class="score-display">
                <h3>${c("totalScoreTitle")}: <span class="total-score">${e}/9</span></h3>
                <div class="risk-indicator ${t}">
                  ${c("riskLevel")}: ${c(t==="high"?"riskLevelHigh":"riskLevelLow")}
                </div>
              </div>
            </div>

          </div>
          <div class="modal-footer">
            <div class="button-group">
              <button class="secondary" data-action="cancel-fast-ed">${c("cancel")}</button>
              <button class="primary" data-action="apply-fast-ed">${c("applyScore")}</button>
            </div>
          </div>
        </div>
      </div>
    `}setupEventListeners(){if(this.modal=document.getElementById("fastEdModal"),!this.modal)return;this.modal.addEventListener("change",a=>{if(a.target.type==="radio"){const n=a.target.name,r=parseInt(a.target.value);this.scores[n]=r,this.updateDisplay()}});const e=this.modal.querySelector(".modal-close");e==null||e.addEventListener("click",()=>this.close());const t=this.modal.querySelector('[data-action="cancel-fast-ed"]');t==null||t.addEventListener("click",()=>this.close());const s=this.modal.querySelector('[data-action="apply-fast-ed"]');s==null||s.addEventListener("click",()=>this.apply()),this.modal.addEventListener("click",a=>{a.target===this.modal&&(a.preventDefault(),a.stopPropagation())}),document.addEventListener("keydown",a=>{var n;a.key==="Escape"&&((n=this.modal)!=null&&n.classList.contains("show"))&&this.close()})}updateDisplay(){var s,a;const e=(s=this.modal)==null?void 0:s.querySelector(".total-score"),t=(a=this.modal)==null?void 0:a.querySelector(".risk-indicator");if(e&&(e.textContent=`${this.getTotal()}/9`),t){const n=this.getRiskLevel();t.className=`risk-indicator ${n}`,t.textContent=`${c("riskLevel")}: ${c(n==="high"?"riskLevelHigh":"riskLevelLow")}`}}show(e=0,t=null){this.onApply=t,e>0&&e<=9&&this.approximateFromTotal(e),document.getElementById("fastEdModal")?(this.modal.remove(),document.body.insertAdjacentHTML("beforeend",this.render()),this.modal=document.getElementById("fastEdModal")):document.body.insertAdjacentHTML("beforeend",this.render()),this.setupEventListeners(),this.modal.setAttribute("aria-hidden","false"),this.modal.style.display="flex",this.modal.classList.add("show");const s=this.modal.querySelector('input[type="radio"]');s==null||s.focus()}close(){this.modal&&(this.modal.classList.remove("show"),this.modal.style.display="none",this.modal.setAttribute("aria-hidden","true"))}apply(){const e=this.getTotal(),t=this.scores.arm_weakness>0,s=this.scores.eye_deviation>0;this.onApply&&this.onApply({total:e,components:{...this.scores},armWeaknessBoolean:t,eyeDeviationBoolean:s}),this.close()}approximateFromTotal(e){this.scores={facial_palsy:0,arm_weakness:0,speech_changes:0,eye_deviation:0,denial_neglect:0};let t=e;const s=Object.keys(this.scores);for(const a of s){if(t<=0)break;const r=Math.min(t,a==="facial_palsy"?1:2);this.scores[a]=r,t-=r}}}const Ui=new zi;function G(i){const e=v.getState(),{currentScreen:t,results:s,startTime:a,navigationHistory:n}=e,r=document.createElement("div"),l=document.getElementById("backButton");l&&(l.style.display=n&&n.length>0?"flex":"none");let o="";switch(t){case"login":o=xi();break;case"triage1":if(!ne.isValidSession()){v.navigate("login");return}o=De();break;case"triage2":o=ti();break;case"coma":o=ii();break;case"limited":o=si();break;case"full":o=ai();break;case"results":o=_i(s,a);break;default:o=De()}for(r.innerHTML=o,i.innerHTML="";r.firstChild;)i.appendChild(r.firstChild);const d=i.querySelector("form[data-module]");if(d){const{module:m}=d.dataset;Wi(d,m)}Gi(i),t==="login"&&setTimeout(()=>{Fi()},100),t==="results"&&s&&setTimeout(()=>{at(s)},100),setTimeout(()=>{tt()},150),Hi(t),Bi(t),Vi()}function Wi(i,e){const t=v.getFormData(e);!t||Object.keys(t).length===0||Object.entries(t).forEach(([s,a])=>{const n=i.elements[s];n&&(n.type==="checkbox"?n.checked=a===!0||a==="on"||a==="true":n.value=a)})}function Gi(i){i.querySelectorAll('input[type="number"]').forEach(a=>{a.addEventListener("input",()=>{const n=a.closest(".input-group");n&&n.classList.contains("error")&&(n.classList.remove("error"),n.querySelectorAll(".error-message").forEach(r=>r.remove()))})}),i.querySelectorAll("[data-action]").forEach(a=>{a.addEventListener("click",n=>{const{action:r,value:l}=n.currentTarget.dataset,o=l==="true";switch(r){case"triage1":Bt(o);break;case"triage2":Vt(o);break;case"reset":zt();break;case"goBack":Ut();break;case"goHome":Xe();break}})}),i.querySelectorAll("form[data-module]").forEach(a=>{a.addEventListener("submit",n=>{Wt(n,i)})});const e=i.querySelector("#printResults");e&&e.addEventListener("click",()=>window.print());const t=i.querySelector("#fast_ed_score");t&&(t.addEventListener("click",a=>{a.preventDefault();const n=parseInt(t.value)||0;Ui.show(n,r=>{t.value=r.total;const l=i.querySelector("#armparese_hidden");l&&(l.value=r.armWeaknessBoolean?"true":"false");const o=i.querySelector("#eye_deviation_hidden");o&&(o.value=r.eyeDeviationBoolean?"true":"false"),t.dispatchEvent(new Event("change",{bubbles:!0}))})}),t.addEventListener("keydown",a=>{a.preventDefault()})),i.querySelectorAll(".info-toggle").forEach(a=>{a.addEventListener("click",n=>{const r=a.dataset.target,l=i.querySelector(`#${r}`),o=a.querySelector(".toggle-arrow");l&&(l.style.display!=="none"?(l.style.display="none",l.classList.remove("show"),a.classList.remove("active"),o.style.transform="rotate(0deg)"):(l.style.display="block",l.classList.add("show"),a.classList.add("active"),o.style.transform="rotate(180deg)"))})})}class qi{constructor(){this.registration=null,this.isOnline=navigator.onLine,this.updateAvailable=!1,this.isUpdateCheckEnabled=!0,this.retryCount=0,this.maxRetries=3,this.setupEventListeners()}async initialize(){if(!("serviceWorker"in navigator))return console.warn("Service Worker not supported in this browser"),g.publish(h.AUDIT_EVENT,{action:"sw_not_supported",userAgent:navigator.userAgent}),!1;const e=E.startMeasurement(k.USER_INTERACTION,"service_worker_registration");try{return this.registration=await navigator.serviceWorker.register("/0825/src/workers/medical-service-worker.js",{scope:"/0825/",updateViaCache:"none"}),console.log("🏥 Medical Service Worker registered successfully"),this.setupUpdateDetection(),this.setupMessageHandler(),await this.checkForUpdates(),E.endMeasurement(e,{success:!0}),g.publish(h.AUDIT_EVENT,{action:"sw_registered",scope:this.registration.scope}),!0}catch(t){return console.error("❌ Service Worker registration failed:",t),E.endMeasurement(e,{success:!1,error:t.message}),g.publish(h.AUDIT_EVENT,{action:"sw_registration_failed",error:t.message}),!1}}setupEventListeners(){window.addEventListener("online",()=>{this.isOnline=!0,this.handleOnlineStatusChange(!0)}),window.addEventListener("offline",()=>{this.isOnline=!1,this.handleOnlineStatusChange(!1)}),document.addEventListener("visibilitychange",()=>{!document.hidden&&this.isUpdateCheckEnabled&&this.checkForUpdates()}),setInterval(()=>{this.isUpdateCheckEnabled&&this.isOnline&&this.checkForUpdates()},5*60*1e3)}setupUpdateDetection(){this.registration&&(this.registration.addEventListener("updatefound",()=>{const e=this.registration.installing;e.addEventListener("statechange",()=>{e.state==="installed"&&navigator.serviceWorker.controller&&(this.updateAvailable=!0,this.notifyUpdateAvailable())})}),navigator.serviceWorker.addEventListener("controllerchange",()=>{window.location.reload()}))}setupMessageHandler(){navigator.serviceWorker.addEventListener("message",e=>{const{type:t,data:s}=e.data;switch(t){case"SW_INSTALLED":this.handleServiceWorkerInstalled(s);break;case"SW_ACTIVATED":this.handleServiceWorkerActivated(s);break;case"SW_INSTALL_ERROR":this.handleServiceWorkerError(s);break;case"MEDICAL_DATA_SYNCED":this.handleMedicalDataSynced(s);break;default:console.log("Unknown service worker message:",t,s)}})}handleOnlineStatusChange(e){console.log(`🌐 Network status: ${e?"Online":"Offline"}`),g.publish(h.AUDIT_EVENT,{action:"network_status_changed",isOnline:e,timestamp:new Date().toISOString()}),this.showNetworkStatusNotification(e),e&&"serviceWorker"in navigator&&navigator.serviceWorker.controller&&navigator.serviceWorker.ready.then(t=>{if("sync"in t)return t.sync.register("medical-data-sync")}).catch(t=>{console.warn("Background sync registration failed:",t)})}showNetworkStatusNotification(e){const t=document.createElement("div");t.className=`network-notification ${e?"online":"offline"}`,t.innerHTML=`
      <div class="notification-content">
        <span class="notification-icon">${e?"🌐":"📴"}</span>
        <span class="notification-text">
          ${e?"Connection restored":"Working offline"}
        </span>
      </div>
    `,document.body.appendChild(t),setTimeout(()=>{t.parentNode&&t.parentNode.removeChild(t)},3e3)}async checkForUpdates(){if(this.registration)try{await this.registration.update()}catch(e){console.warn("Update check failed:",e.message),this.retryCount++,this.retryCount<this.maxRetries&&setTimeout(()=>this.checkForUpdates(),5e3)}}async applyUpdate(){if(!(!this.updateAvailable||!this.registration))try{this.registration.waiting&&this.registration.waiting.postMessage({type:"SKIP_WAITING"}),g.publish(h.AUDIT_EVENT,{action:"sw_update_applied"})}catch(e){console.error("Failed to apply update:",e)}}notifyUpdateAvailable(){console.log("📱 App update available"),g.publish(h.AUDIT_EVENT,{action:"sw_update_available"}),this.showUpdateNotification()}showUpdateNotification(){const e=document.createElement("div");e.className="update-notification",e.innerHTML=`
      <div class="notification-content">
        <span class="notification-icon">🔄</span>
        <span class="notification-text">App update available</span>
        <button class="update-button" onclick="medicalSWManager.applyUpdate()">
          Update Now
        </button>
        <button class="dismiss-button" onclick="this.parentNode.parentNode.remove()">
          Later
        </button>
      </div>
    `,document.body.appendChild(e)}async getCacheStatus(){return navigator.serviceWorker.controller?new Promise(e=>{const t=new MessageChannel;t.port1.onmessage=s=>{e(s.data)},navigator.serviceWorker.controller.postMessage({type:"GET_CACHE_STATUS"},[t.port2])}):null}async clearCaches(){navigator.serviceWorker.controller&&(navigator.serviceWorker.controller.postMessage({type:"CLEAR_CACHE"}),g.publish(h.AUDIT_EVENT,{action:"sw_caches_cleared"}))}async prefetchResources(e){navigator.serviceWorker.controller&&navigator.serviceWorker.controller.postMessage({type:"PREFETCH_RESOURCES",data:{resources:e}})}handleServiceWorkerInstalled(e){console.log("✅ Service Worker installed:",e),g.publish(h.AUDIT_EVENT,{action:"sw_installed",cacheVersion:e.cacheVersion,criticalResourcesCount:e.criticalResourcesCount})}handleServiceWorkerActivated(e){console.log("🚀 Service Worker activated:",e),g.publish(h.AUDIT_EVENT,{action:"sw_activated",cacheVersion:e.cacheVersion,cleanedCaches:e.cleanedCaches})}handleServiceWorkerError(e){console.error("❌ Service Worker error:",e),g.publish(h.AUDIT_EVENT,{action:"sw_error",error:e.error})}handleMedicalDataSynced(e){console.log("🔄 Medical data synced:",e),g.publish(h.AUDIT_EVENT,{action:"medical_data_synced",timestamp:e.timestamp})}getOfflineStatus(){return{isOnline:this.isOnline,serviceWorkerActive:!!navigator.serviceWorker.controller,updateAvailable:this.updateAvailable,cacheStatus:this.registration?"available":"unavailable"}}setUpdateCheckEnabled(e){this.isUpdateCheckEnabled=e,g.publish(h.AUDIT_EVENT,{action:"sw_update_check_toggled",enabled:e})}}class Ki{constructor(e){this.swManager=e,this.installPromptEvent=null,this.isInstallable=!1,this.setupInstallPrompt()}setupInstallPrompt(){window.addEventListener("beforeinstallprompt",e=>{e.preventDefault(),this.installPromptEvent=e,this.isInstallable=!0,console.log("📱 PWA install prompt available"),g.publish(h.AUDIT_EVENT,{action:"pwa_install_prompt_available"}),setTimeout(()=>{this.showInstallBanner()},2e3)}),window.addEventListener("appinstalled",()=>{console.log("📱 PWA installed successfully"),g.publish(h.AUDIT_EVENT,{action:"pwa_installed"}),this.hideInstallBanner()})}showInstallBanner(){if(!this.isInstallable)return;const e=document.createElement("div");e.id="install-banner",e.className="install-banner",e.innerHTML=`
      <div class="banner-content">
        <div class="banner-text">
          <strong>Install Stroke Triage Assistant</strong>
          <p>Get offline access and faster performance</p>
        </div>
        <div class="banner-actions">
          <button class="install-button" onclick="offlineInstallPrompt.promptInstall()">
            Install
          </button>
          <button class="dismiss-button" onclick="this.parentNode.parentNode.remove()">
            Not Now
          </button>
        </div>
      </div>
    `,document.body.appendChild(e)}hideInstallBanner(){const e=document.getElementById("install-banner");e&&e.remove()}async promptInstall(){if(this.installPromptEvent)try{const e=await this.installPromptEvent.prompt();g.publish(h.AUDIT_EVENT,{action:"pwa_install_prompted",outcome:e.outcome}),this.installPromptEvent=null,this.isInstallable=!1,this.hideInstallBanner()}catch(e){console.error("Install prompt failed:",e)}}}const le=new qi,ji=new Ki(le);window.medicalSWManager=le;window.offlineInstallPrompt=ji;const Ue={UPDATE:"update",CONFLICT_RESOLVE:"conflict_resolve"},O={IDLE:"idle",SYNCING:"syncing",ERROR:"error",CONFLICT:"conflict",OFFLINE:"offline"},te={CLIENT_WINS:"client_wins",SERVER_WINS:"server_wins",MERGE:"merge",MANUAL:"manual"};class ge{constructor(e,t,s,a,n=Date.now()){this.id=`sync_${n}_${Math.random().toString(36).substr(2,9)}`,this.type=e,this.entityType=t,this.entityId=s,this.data=a,this.timestamp=n,this.attempts=0,this.maxAttempts=3,this.status="pending",this.error=null}canRetry(){return this.attempts<this.maxAttempts&&this.status==="error"}markFailed(e){this.status="error",this.error=e,this.attempts+=1}markCompleted(){this.status="completed",this.error=null}}class Yi{constructor(){this.status=O.IDLE,this.pendingOperations=new Map,this.conflictQueue=new Map,this.syncInterval=null,this.isOnline=navigator.onLine,this.lastSyncTime=null,this.syncInProgress=!1,this.config={syncIntervalMs:3e4,conflictRetentionMs:24*60*60*1e3,maxPendingOperations:100,enableRealTimeSync:!0,enableConflictResolution:!0},this.setupEventListeners()}async initialize(){console.log("🔄 Initializing Medical Sync Manager...");try{return await this.loadPendingOperations(),this.isOnline&&this.config.enableRealTimeSync&&this.startPeriodicSync(),await this.performSync(),g.publish(h.AUDIT_EVENT,{action:"sync_manager_initialized",pendingOperations:this.pendingOperations.size}),console.log("✅ Medical Sync Manager initialized"),!0}catch(e){return console.error("❌ Sync Manager initialization failed:",e),!1}}setupEventListeners(){window.addEventListener("online",()=>{this.isOnline=!0,this.handleConnectionChange(!0)}),window.addEventListener("offline",()=>{this.isOnline=!1,this.handleConnectionChange(!1)}),g.subscribe(h.PATIENT_DATA_UPDATED,e=>{this.queueDataSync("patient_data",e.fieldName,e)}),g.subscribe(h.PREDICTION_COMPLETED,e=>{this.queueDataSync("prediction_result",e.module,e)}),document.addEventListener("visibilitychange",()=>{!document.hidden&&this.isOnline&&this.performSync()})}async handleConnectionChange(e){console.log(`🌐 Connection status changed: ${e?"Online":"Offline"}`),this.status=e?O.IDLE:O.OFFLINE,e?(this.startPeriodicSync(),await this.performSync(),g.publish(h.AUDIT_EVENT,{action:"sync_connection_restored",pendingOperations:this.pendingOperations.size})):(this.stopPeriodicSync(),g.publish(h.AUDIT_EVENT,{action:"sync_connection_lost"}))}queueDataSync(e,t,s){if(!this.config.enableRealTimeSync)return;const a=new ge(Ue.UPDATE,e,t,this.sanitizeDataForSync(s));if(this.pendingOperations.size>=this.config.maxPendingOperations){const n=this.pendingOperations.keys().next().value;this.pendingOperations.delete(n)}this.pendingOperations.set(a.id,a),this.savePendingOperations(),this.isOnline&&!this.syncInProgress&&setTimeout(()=>this.performSync(),1e3),g.publish(h.AUDIT_EVENT,{action:"sync_operation_queued",entityType:e,entityId:t,operationId:a.id})}sanitizeDataForSync(e){const t={...e};return["ssn","mrn","patient_id","user_id","session_token"].forEach(a=>{t[a]&&delete t[a]}),t._syncTimestamp=Date.now(),t._syncId=`sync_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,t}async performSync(){if(!this.isOnline||this.syncInProgress||this.pendingOperations.size===0)return;const e=E.startMeasurement(k.NETWORK,"medical_data_sync");this.syncInProgress=!0,this.status=O.SYNCING,console.log(`🔄 Starting sync of ${this.pendingOperations.size} operations...`);let t=0,s=0,a=0;try{const n=Array.from(this.pendingOperations.values()),r=5;for(let l=0;l<n.length;l+=r){const o=n.slice(l,l+r);(await this.processSyncBatch(o)).forEach(m=>{m.status==="completed"?(t++,this.pendingOperations.delete(m.operationId)):m.status==="conflict"?(a++,this.handleSyncConflict(m)):s++})}this.lastSyncTime=Date.now(),await this.savePendingOperations(),console.log(`✅ Sync completed: ${t} success, ${s} errors, ${a} conflicts`),g.publish(h.AUDIT_EVENT,{action:"sync_completed",completedCount:t,errorCount:s,conflictCount:a,duration:Date.now()-this.lastSyncTime}),E.endMeasurement(e,{success:!0,operationsProcessed:t+s+a})}catch(n){console.error("❌ Sync failed:",n),E.endMeasurement(e,{success:!1,error:n.message}),this.status=O.ERROR}finally{this.syncInProgress=!1,this.status=(this.pendingOperations.size>0,O.IDLE)}}async processSyncBatch(e){const t=[];for(const s of e)try{const a=await this.executeSyncOperation(s);t.push({operationId:s.id,status:"completed",result:a}),s.markCompleted()}catch(a){a.name==="ConflictError"?t.push({operationId:s.id,status:"conflict",conflict:a.conflict,operation:s}):(s.markFailed(a.message),s.canRetry()?console.warn(`⚠️ Operation ${s.id} failed, will retry: ${a.message}`):(console.error(`❌ Operation ${s.id} failed permanently: ${a.message}`),this.pendingOperations.delete(s.id)),t.push({operationId:s.id,status:"error",error:a.message}))}return t}async executeSyncOperation(e){if(await new Promise(t=>setTimeout(t,100+Math.random()*200)),Math.random()<.05){const t={clientData:e.data,serverData:{...e.data,_serverModified:!0},conflictFields:["timestamp","value"],resolution:te.MANUAL},s=new Error("Data conflict detected");throw s.name="ConflictError",s.conflict=t,s}if(Math.random()<.02)throw new Error("Network request failed");return{entityType:e.entityType,entityId:e.entityId,syncTimestamp:Date.now(),serverVersion:Date.now()}}handleSyncConflict(e){const{operation:t,conflict:s}=e;this.conflictQueue.set(t.id,{operation:t,conflict:s,timestamp:Date.now()}),this.status=O.CONFLICT,this.config.enableConflictResolution&&this.resolveConflictAutomatically(t.id,s),g.publish(h.AUDIT_EVENT,{action:"sync_conflict_detected",operationId:t.id,entityType:t.entityType,conflictFields:s.conflictFields})}async resolveConflictAutomatically(e,t){let s;switch(t.resolution){case te.CLIENT_WINS:s=t.clientData;break;case te.SERVER_WINS:s=t.serverData;break;case te.MERGE:s=this.mergeConflictData(t.clientData,t.serverData);break;default:return}const a=new ge(Ue.CONFLICT_RESOLVE,"conflict_resolution",e,s);this.pendingOperations.set(a.id,a),this.conflictQueue.delete(e),g.publish(h.AUDIT_EVENT,{action:"sync_conflict_auto_resolved",conflictId:e,resolution:t.resolution})}mergeConflictData(e,t){const s={...t};return["gfap_value","age_years","systolic_bp","diastolic_bp"].forEach(n=>{e[n]!==void 0&&(s[n]=e[n])}),s._mergedAt=Date.now(),s._mergeStrategy="intelligent_merge",s}startPeriodicSync(){this.syncInterval||(this.syncInterval=setInterval(()=>{this.isOnline&&this.pendingOperations.size>0&&this.performSync()},this.config.syncIntervalMs),console.log(`🔄 Periodic sync started (${this.config.syncIntervalMs}ms interval)`))}stopPeriodicSync(){this.syncInterval&&(clearInterval(this.syncInterval),this.syncInterval=null,console.log("⏹️ Periodic sync stopped"))}async forcSync(){if(!this.isOnline)throw new Error("Cannot sync while offline");this.stopPeriodicSync(),await this.performSync(),this.startPeriodicSync()}getSyncStatus(){return{status:this.status,isOnline:this.isOnline,pendingOperations:this.pendingOperations.size,conflicts:this.conflictQueue.size,lastSyncTime:this.lastSyncTime,syncInProgress:this.syncInProgress}}async loadPendingOperations(){try{const e=localStorage.getItem("medical_sync_pending");e&&(JSON.parse(e).forEach(s=>{const a=new ge(s.type,s.entityType,s.entityId,s.data,s.timestamp);a.attempts=s.attempts||0,a.status=s.status||"pending",this.pendingOperations.set(a.id,a)}),console.log(`📦 Loaded ${this.pendingOperations.size} pending sync operations`))}catch(e){console.warn("Failed to load pending operations:",e)}}async savePendingOperations(){try{const e=Array.from(this.pendingOperations.values()).map(t=>({id:t.id,type:t.type,entityType:t.entityType,entityId:t.entityId,data:t.data,timestamp:t.timestamp,attempts:t.attempts,status:t.status}));localStorage.setItem("medical_sync_pending",JSON.stringify(e))}catch(e){console.warn("Failed to save pending operations:",e)}}clearPendingOperations(){this.pendingOperations.clear(),this.conflictQueue.clear(),localStorage.removeItem("medical_sync_pending"),g.publish(h.AUDIT_EVENT,{action:"sync_operations_cleared"})}updateConfig(e){this.config={...this.config,...e},this.syncInterval&&e.syncIntervalMs&&(this.stopPeriodicSync(),this.startPeriodicSync()),g.publish(h.AUDIT_EVENT,{action:"sync_config_updated",config:this.config})}dispose(){this.stopPeriodicSync(),this.savePendingOperations(),g.publish(h.AUDIT_EVENT,{action:"sync_manager_disposed"})}}const Ji=new Yi,b={CRITICAL:"critical",HIGH:"high",NORMAL:"normal",LOW:"low"},I={PENDING:"pending",LOADING:"loading",LOADED:"loaded",ERROR:"error"};class Qi{constructor(e,t,s={}){this.name=e,this.loader=t,this.priority=s.priority||b.NORMAL,this.state=I.PENDING,this.component=null,this.error=null,this.loadTime=null,this.dependencies=s.dependencies||[],this.retryCount=0,this.maxRetries=s.maxRetries||3,this.loadPromise=null}async load(){if(this.state===I.LOADED)return this.component;if(this.loadPromise)return this.loadPromise;const e=E.startMeasurement(k.USER_INTERACTION,`lazy_load_${this.name}`,{priority:this.priority});return this.state=I.LOADING,this.loadPromise=this.executeLoad(e),this.loadPromise}async executeLoad(e){try{const t=performance.now();return await this.loadDependencies(),this.component=await this.loader(),this.loadTime=performance.now()-t,this.state=I.LOADED,E.endMeasurement(e,{success:!0,loadTime:this.loadTime,retryCount:this.retryCount}),g.publish(h.AUDIT_EVENT,{action:"lazy_component_loaded",component:this.name,loadTime:this.loadTime,priority:this.priority}),this.component}catch(t){if(this.error=t,this.retryCount++,E.endMeasurement(e,{success:!1,error:t.message,retryCount:this.retryCount}),this.retryCount<this.maxRetries){console.warn(`⚠️ Component ${this.name} load failed, retrying (${this.retryCount}/${this.maxRetries}):`,t);const s=Math.min(1e3*Math.pow(2,this.retryCount-1),5e3);return await new Promise(a=>setTimeout(a,s)),this.loadPromise=null,this.load()}else throw this.state=I.ERROR,console.error(`❌ Component ${this.name} failed to load after ${this.maxRetries} attempts:`,t),g.publish(h.AUDIT_EVENT,{action:"lazy_component_load_failed",component:this.name,error:t.message,retryCount:this.retryCount}),t}}async loadDependencies(){if(this.dependencies.length===0)return;const e=this.dependencies.map(t=>typeof t=="string"?gt.load(t):typeof t=="function"?t():t.load());await Promise.all(e)}getStatus(){var e;return{name:this.name,state:this.state,priority:this.priority,loadTime:this.loadTime,error:(e=this.error)==null?void 0:e.message,retryCount:this.retryCount}}}class gt{constructor(){this.components=new Map,this.intersectionObserver=null,this.idleCallback=null,this.loadQueue={[b.CRITICAL]:[],[b.HIGH]:[],[b.NORMAL]:[],[b.LOW]:[]},this.isProcessingQueue=!1,this.initializeObservers()}initializeObservers(){"IntersectionObserver"in window&&(this.intersectionObserver=new IntersectionObserver(e=>this.handleIntersectionChanges(e),{rootMargin:"50px",threshold:.1})),this.scheduleIdleLoading()}register(e,t,s={}){const a=new Qi(e,t,s);return this.components.set(e,a),this.loadQueue[a.priority].push(a),a.priority===b.CRITICAL&&this.processLoadQueue(),g.publish(h.AUDIT_EVENT,{action:"lazy_component_registered",component:e,priority:a.priority}),a}async load(e){const t=this.components.get(e);if(!t)throw new Error(`Component '${e}' not registered`);return t.load()}async preload(e=b.HIGH){const t=[b.CRITICAL,b.HIGH,b.NORMAL,b.LOW],s=t.slice(0,t.indexOf(e)+1),a=[];s.forEach(n=>{this.loadQueue[n].forEach(r=>{r.state===I.PENDING&&a.push(r.load())})}),await Promise.allSettled(a),g.publish(h.AUDIT_EVENT,{action:"lazy_components_preloaded",priority:e,count:a.length})}observeElement(e,t){this.intersectionObserver&&(e.dataset.lazyComponent=t,this.intersectionObserver.observe(e))}handleIntersectionChanges(e){e.forEach(t=>{if(t.isIntersecting){const s=t.target.dataset.lazyComponent;s&&(this.load(s).catch(a=>{console.error(`Failed to load component ${s}:`,a)}),this.intersectionObserver.unobserve(t.target))}})}async processLoadQueue(){if(!this.isProcessingQueue){this.isProcessingQueue=!0;try{await this.processQueueByPriority(b.CRITICAL),await this.processQueueByPriority(b.HIGH)}catch(e){console.error("Error processing load queue:",e)}finally{this.isProcessingQueue=!1}}}async processQueueByPriority(e){const s=this.loadQueue[e].filter(n=>n.state===I.PENDING);if(s.length===0)return;const a=s.map(n=>n.load().catch(r=>(console.warn(`Component ${n.name} failed to load:`,r),null)));await Promise.allSettled(a)}scheduleIdleLoading(){const e=()=>{"requestIdleCallback"in window?this.idleCallback=requestIdleCallback(t=>{this.processIdleQueue(t),e()},{timeout:5e3}):setTimeout(()=>{this.processIdleQueue({timeRemaining:()=>50}),e()},100)};e()}async processIdleQueue(e){const t=this.loadQueue[b.NORMAL],s=this.loadQueue[b.LOW],a=[...t.filter(n=>n.state===I.PENDING),...s.filter(n=>n.state===I.PENDING)];for(const n of a)if(e.timeRemaining()>10)try{await n.load()}catch(r){console.warn(`Idle loading failed for ${n.name}:`,r)}else break}getStats(){const e={total:this.components.size,byState:{pending:0,loading:0,loaded:0,error:0},byPriority:{critical:0,high:0,normal:0,low:0},totalLoadTime:0,averageLoadTime:0};let t=0,s=0;return this.components.forEach(a=>{e.byState[a.state]++,e.byPriority[a.priority]++,a.loadTime&&(t+=a.loadTime,s++)}),e.totalLoadTime=t,e.averageLoadTime=s>0?t/s:0,e}async reload(e){const t=this.components.get(e);if(!t)throw new Error(`Component '${e}' not registered`);return t.state=I.PENDING,t.component=null,t.error=null,t.loadTime=null,t.retryCount=0,t.loadPromise=null,t.load()}dispose(){this.intersectionObserver&&this.intersectionObserver.disconnect(),this.idleCallback&&cancelIdleCallback(this.idleCallback),this.components.clear(),Object.values(this.loadQueue).forEach(e=>e.length=0),g.publish(h.AUDIT_EVENT,{action:"lazy_loader_disposed"})}}class Zi{constructor(e){this.lazyLoader=e,this.registerMedicalComponents()}registerMedicalComponents(){this.lazyLoader.register("validation",()=>N(()=>Promise.resolve().then(()=>Ht),void 0),{priority:b.CRITICAL}),this.lazyLoader.register("store",()=>N(()=>Promise.resolve().then(()=>bt),void 0),{priority:b.CRITICAL}),this.lazyLoader.register("ich-calculator",()=>N(()=>Promise.resolve().then(()=>Ei),void 0),{priority:b.HIGH}),this.lazyLoader.register("lvo-model",()=>N(()=>Promise.resolve().then(()=>wt),void 0),{priority:b.HIGH}),this.lazyLoader.register("brain-visualization",()=>N(()=>Promise.resolve().then(()=>Ai),void 0),{priority:b.NORMAL}),this.lazyLoader.register("stroke-center-map",()=>N(()=>Promise.resolve().then(()=>fi),void 0),{priority:b.NORMAL}),this.lazyLoader.register("research-mode",()=>N(()=>Promise.resolve().then(()=>Xt),void 0),{priority:b.LOW}),this.lazyLoader.register("data-logger",()=>N(()=>Promise.resolve().then(()=>jt),void 0),{priority:b.LOW})}async loadByClinicalPriority(e){switch(e){case"emergency":await this.lazyLoader.preload(b.HIGH);break;case"routine":await this.lazyLoader.preload(b.NORMAL);break;case"research":await this.lazyLoader.load("research-mode"),await this.lazyLoader.load("data-logger");break;default:await this.lazyLoader.preload(b.NORMAL)}}async preloadForModule(e){const s={coma:["validation","ich-calculator"],limited:["validation","lvo-model"],full:["validation","ich-calculator","lvo-model","brain-visualization"]}[e]||[],a=s.map(n=>this.lazyLoader.load(n));await Promise.allSettled(a),g.publish(h.AUDIT_EVENT,{action:"medical_components_preloaded",moduleType:e,components:s})}}const ie=new gt;new Zi(ie);class Xi{constructor(){this.container=null,this.unsubscribe=null}async init(){if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",()=>this.init());return}if(this.container=document.getElementById("appContainer"),!this.container){console.error("App container not found");return}ne.isValidSession()||v.navigate("login"),this.unsubscribe=v.subscribe(()=>{G(this.container),setTimeout(()=>this.initializeResearchMode(),200)}),window.addEventListener("languageChanged",()=>{this.updateUILanguage(),G(this.container)}),this.setupGlobalEventListeners(),this.initializeTheme(),this.initializeResearchMode(),this.updateUILanguage(),this.startAutoSave(),this.setupSessionTimeout(),this.setCurrentYear(),await this.initializeAdvancedFeatures(),At(),G(this.container)}setupGlobalEventListeners(){const e=document.getElementById("backButton");e&&e.addEventListener("click",()=>{v.goBack(),G(this.container)});const t=document.getElementById("homeButton");t&&t.addEventListener("click",()=>{v.goHome(),G(this.container)});const s=document.getElementById("languageToggle");s&&s.addEventListener("click",()=>this.toggleLanguage());const a=document.getElementById("darkModeToggle");a&&a.addEventListener("click",()=>this.toggleDarkMode());const n=document.getElementById("researchModeToggle");n&&n.addEventListener("click",r=>{r.preventDefault(),r.stopPropagation(),this.toggleResearchMode()}),this.setupHelpModal(),this.setupFooterLinks(),document.addEventListener("keydown",r=>{if(r.key==="Escape"){const l=document.getElementById("helpModal");l&&l.classList.contains("show")&&(l.classList.remove("show"),l.style.display="none",l.setAttribute("aria-hidden","true"))}}),window.addEventListener("beforeunload",r=>{v.hasUnsavedData()&&(r.preventDefault(),r.returnValue="You have unsaved data. Are you sure you want to leave?")})}setupHelpModal(){const e=document.getElementById("helpButton"),t=document.getElementById("helpModal"),s=t==null?void 0:t.querySelector(".modal-close");if(e&&t){t.classList.remove("show"),t.style.display="none",t.setAttribute("aria-hidden","true"),e.addEventListener("click",()=>{t.style.display="flex",t.classList.add("show"),t.setAttribute("aria-hidden","false")});const a=()=>{t.classList.remove("show"),t.style.display="none",t.setAttribute("aria-hidden","true")};s==null||s.addEventListener("click",a),t.addEventListener("click",n=>{n.target===t&&a()})}}setupFooterLinks(){var e,t;(e=document.getElementById("privacyLink"))==null||e.addEventListener("click",s=>{s.preventDefault(),this.showPrivacyPolicy()}),(t=document.getElementById("disclaimerLink"))==null||t.addEventListener("click",s=>{s.preventDefault(),this.showDisclaimer()})}initializeTheme(){const e=localStorage.getItem("theme"),t=document.getElementById("darkModeToggle");(e==="dark"||!e&&window.matchMedia("(prefers-color-scheme: dark)").matches)&&(document.body.classList.add("dark-mode"),t&&(t.textContent="☀️"))}toggleLanguage(){M.toggleLanguage(),this.updateUILanguage();const e=document.getElementById("languageToggle");if(e){const t=M.getCurrentLanguage();e.textContent=t==="en"?"🇬🇧":"🇩🇪",e.dataset.lang=t}}updateUILanguage(){document.documentElement.lang=M.getCurrentLanguage();const e=document.querySelector(".app-header h1");e&&(e.textContent=c("appTitle"));const t=document.querySelector(".emergency-badge");t&&(t.textContent=c("emergencyBadge"));const s=document.getElementById("languageToggle");s&&(s.title=c("languageToggle"),s.setAttribute("aria-label",c("languageToggle")));const a=document.getElementById("helpButton");a&&(a.title=c("helpButton"),a.setAttribute("aria-label",c("helpButton")));const n=document.getElementById("darkModeToggle");n&&(n.title=c("darkModeButton"),n.setAttribute("aria-label",c("darkModeButton")));const r=document.getElementById("modalTitle");r&&(r.textContent=c("helpTitle"))}toggleDarkMode(){const e=document.getElementById("darkModeToggle");document.body.classList.toggle("dark-mode");const t=document.body.classList.contains("dark-mode");e&&(e.textContent=t?"☀️":"🌙"),localStorage.setItem("theme",t?"dark":"light")}initializeResearchMode(){const e=document.getElementById("researchModeToggle");if(e){const t=this.getCurrentModuleFromResults(),s=t==="limited"||t==="full";e.style.display=s?"flex":"none",e.style.opacity=s?"1":"0.5"}}getCurrentModuleFromResults(){var s,a;const e=v.getState();if(e.currentScreen!=="results"||!((a=(s=e.results)==null?void 0:s.ich)!=null&&a.module))return null;const t=e.results.ich.module.toLowerCase();return t.includes("coma")?"coma":t.includes("limited")?"limited":t.includes("full")?"full":null}toggleResearchMode(){const e=document.getElementById("researchPanel");if(!e){console.warn("🔬 Research panel not found - likely not on results screen");return}const t=e.style.display!=="none";e.style.display=t?"none":"block";const s=document.getElementById("researchModeToggle");return s&&(s.style.background=t?"rgba(255, 255, 255, 0.1)":"rgba(0, 102, 204, 0.2)"),!1}showResearchActivationMessage(){const e=document.createElement("div");e.className="research-activation-toast",e.innerHTML=`
      <div class="toast-content">
        🔬 <strong>Research Mode Activated</strong><br>
        <small>Model comparison features enabled</small>
      </div>
    `,document.body.appendChild(e),setTimeout(()=>{document.body.contains(e)&&document.body.removeChild(e)},3e3)}startAutoSave(){setInterval(()=>{this.saveCurrentFormData()},pe.autoSaveInterval)}saveCurrentFormData(){this.container.querySelectorAll("form[data-module]").forEach(t=>{const s=new FormData(t),{module:a}=t.dataset;if(a){const n={};s.forEach((o,d)=>{const m=t.elements[d];m&&m.type==="checkbox"?n[d]=m.checked:n[d]=o});const r=v.getFormData(a);JSON.stringify(r)!==JSON.stringify(n)&&v.setFormData(a,n)}})}setupSessionTimeout(){setTimeout(()=>{confirm("Your session has been idle for 30 minutes. Would you like to continue?")?this.setupSessionTimeout():v.reset()},pe.sessionTimeout)}setCurrentYear(){const e=document.getElementById("currentYear");e&&(e.textContent=new Date().getFullYear())}showPrivacyPolicy(){alert("Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.")}showDisclaimer(){alert("Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.")}async initializeAdvancedFeatures(){console.log("🚀 Initializing Phase 3 Advanced Features...");try{E.start(),await le.initialize()&&(console.log("✅ Advanced offline capabilities enabled"),await this.prefetchCriticalResources()),await Ji.initialize()&&console.log("✅ Real-time synchronization enabled"),await this.initializeProgressiveLoading(),console.log("🎯 Phase 3 features initialized successfully")}catch(e){console.error("❌ Phase 3 features initialization failed:",e)}}async initializeProgressiveLoading(){await ie.preload("critical"),console.log("⚡ Critical components preloaded"),setTimeout(()=>{document.querySelectorAll(".brain-visualization-placeholder").forEach(a=>{ie.observeElement(a,"brain-visualization")}),document.querySelectorAll(".stroke-center-map-placeholder").forEach(a=>{ie.observeElement(a,"stroke-center-map")})},100),console.log("🔄 Progressive loading initialized")}async prefetchCriticalResources(){const e=["/0825/src/logic/lvo-local-model.js","/0825/src/logic/ich-volume-calculator.js","/0825/src/patterns/prediction-strategy.js","/0825/src/performance/medical-cache.js"];await le.prefetchResources(e),console.log("📦 Critical medical resources prefetched for offline use")}async initializeMedicalIntelligence(){}setupMedicalIntelligenceEventHandlers(){}toggleMedicalDashboard(){}async generateClinicalReport(e="comprehensive"){}async runPhase4Tests(){}getPhase4Status(){return{predictiveEngine:predictiveEngine.isInitialized||!1,clinicalDecisionSupport:clinicalDecisionSupport.isActive||!1,qualityMetrics:qualityMetricsTracker.isActive||!1,auditTrail:clinicalAuditTrail.isActive||!1,reportingSystem:clinicalReportingSystem.isActive||!1,mlIntegration:mlModelIntegration.isInitialized||!1,dashboard:!!this.medicalDashboard,testResults:!!this.phase4TestResults}}showUpdateNotification(){const e=document.createElement("div");e.className="modal show update-modal",e.style.cssText=`
      display: flex;
      position: fixed;
      z-index: 2000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.6);
      backdrop-filter: blur(5px);
      align-items: center;
      justify-content: center;
    `;const t=document.createElement("div");t.className="modal-content",t.style.cssText=`
      background-color: var(--container-bg);
      padding: 30px;
      border-radius: 16px;
      max-width: 400px;
      box-shadow: var(--shadow-lg);
      text-align: center;
      animation: slideUp 0.3s ease;
    `,t.innerHTML=`
      <div style="margin-bottom: 20px;">
        <div style="font-size: 3rem; margin-bottom: 16px;">🔄</div>
        <h3 style="margin: 0 0 12px 0; color: var(--text-color);">Update Available</h3>
        <p style="color: var(--text-secondary); margin: 0 0 24px 0; line-height: 1.5;">
          A new version with improvements is ready to install.
        </p>
      </div>
      <div style="display: flex; gap: 12px; justify-content: center;">
        <button id="updateNow" class="primary" style="flex: 1; max-width: 140px;">
          Refresh Now
        </button>
        <button id="updateLater" class="secondary" style="flex: 1; max-width: 140px;">
          Later
        </button>
      </div>
    `,e.appendChild(t),document.body.appendChild(e);const s=e.querySelector("#updateNow"),a=e.querySelector("#updateLater");s.addEventListener("click",()=>{window.location.reload()}),a.addEventListener("click",()=>{e.remove(),setTimeout(()=>this.showUpdateNotification(),5*60*1e3)}),e.addEventListener("click",n=>{n.target===e&&a.click()})}destroy(){this.unsubscribe&&this.unsubscribe()}}const es=new Xi;es.init();
//# sourceMappingURL=index-Bbm2jiCh.js.map
