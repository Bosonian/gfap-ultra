(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(n){if(n.ep)return;n.ep=!0;const r=e(n);fetch(n.href,r)}})();class ee{constructor(){this.state={currentScreen:"triage1",results:null,sessionId:null,startTime:null,formData:{},validationErrors:{},screenHistory:[]},this.listeners=new Set,this.initialize()}initialize(){this.state.sessionId=this.generateSessionId(),this.state.startTime=Date.now(),console.log("Store initialized with session:",this.state.sessionId)}generateSessionId(){return"session_"+Date.now()+"_"+Math.random().toString(36).substr(2,9)}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}notify(){this.listeners.forEach(t=>t(this.state))}getState(){return{...this.state}}setState(t){this.state={...this.state,...t},this.notify()}navigate(t){console.log(`Navigating from ${this.state.currentScreen} to ${t}`);const e=[...this.state.screenHistory];this.state.currentScreen!==t&&!e.includes(this.state.currentScreen)&&e.push(this.state.currentScreen),this.setState({currentScreen:t,screenHistory:e})}goBack(){const t=[...this.state.screenHistory];if(console.log("goBack() - current history:",t),console.log("goBack() - current screen:",this.state.currentScreen),t.length>0){const e=t.pop();return console.log("goBack() - navigating to:",e),this.setState({currentScreen:e,screenHistory:t}),!0}return console.log("goBack() - no history available"),!1}goHome(){this.setState({currentScreen:"triage1",screenHistory:[]})}setFormData(t,e){const s={...this.state.formData};s[t]={...e},this.setState({formData:s})}getFormData(t){return this.state.formData[t]||{}}setValidationErrors(t){this.setState({validationErrors:t})}clearValidationErrors(){this.setState({validationErrors:{}})}setResults(t){this.setState({results:t})}hasUnsavedData(){return Object.keys(this.state.formData).length>0&&!this.state.results}reset(){const t={currentScreen:"triage1",results:null,sessionId:this.generateSessionId(),startTime:Date.now(),formData:{},validationErrors:{},screenHistory:[]};this.setState(t),console.log("Store reset with new session:",t.sessionId)}logEvent(t,e={}){const s={timestamp:Date.now(),session:this.state.sessionId,event:t,data:e};console.log("Event:",s)}getSessionDuration(){return Date.now()-this.state.startTime}}const m=new ee;function S(i){const t=[{id:1,label:"Triage"},{id:2,label:"Assessment"},{id:3,label:"Results"}];let e='<div class="progress-indicator">';return t.forEach((s,n)=>{const r=s.id===i,o=s.id<i;e+=`
      <div class="progress-step ${r?"active":""} ${o?"completed":""}">
        ${o?"":s.id}
      </div>
    `,n<t.length-1&&(e+=`<div class="progress-line ${o?"completed":""}"></div>`)}),e+="</div>",e}const q={en:{appTitle:"Stroke Triage Assistant",emergencyBadge:"Emergency Tool",helpButton:"Help and Instructions",darkModeButton:"Toggle dark mode",languageToggle:"Language",step1:"Initial Assessment",step2:"Data Collection",step3:"Results",comaModuleTitle:"Coma Module",limitedDataModuleTitle:"Limited Data Module",fullStrokeModuleTitle:"Full Stroke Module",triage1Title:"Patient Assessment",triage1Question:"Is the patient comatose?",triage1Help:"Glasgow Coma Scale < 8",triage1Yes:"YES - Comatose",triage1No:"NO - Conscious",triage2Title:"Examination Capability",triage2Question:"Can the patient be reliably examined?",triage2Help:"Patient is not aphasic, confused, or uncooperative",triage2Yes:"YES - Full Exam Possible",triage2No:"NO - Limited Exam Only",ageLabel:"Age (years)",ageHelp:"Patient age in years",systolicLabel:"Systolic BP (mmHg)",systolicHelp:"Systolic blood pressure",diastolicLabel:"Diastolic BP (mmHg)",diastolicHelp:"Diastolic blood pressure",gfapLabel:"GFAP Value (pg/mL)",gfapHelp:"GFAP biomarker level",fastEdLabel:"FAST-ED Score",fastEdHelp:"FAST-ED assessment score (0-9)",headacheLabel:"Headache",vigilanzLabel:"Reduced consciousness",armPareseLabel:"Arm weakness",beinPareseLabel:"Leg weakness",eyeDeviationLabel:"Eye deviation",atrialFibLabel:"Atrial fibrillation",anticoagLabel:"Anticoagulated (NOAK)",antiplateletsLabel:"Antiplatelets",analyzeButton:"Analyze",analyzing:"Analyzing...",printResults:"Print Results",newAssessment:"Start New Assessment",startOver:"Start Over",goBack:"Go Back",goHome:"Go Home",basicInformation:"Basic Information",biomarkersScores:"Biomarkers & Scores",clinicalSymptoms:"Clinical Symptoms",medicalHistory:"Medical History",ageYearsLabel:"Age (years)",systolicBpLabel:"Systolic BP (mmHg)",diastolicBpLabel:"Diastolic BP (mmHg)",gfapValueLabel:"GFAP Value (pg/mL)",fastEdScoreLabel:"FAST-ED Score",ageYearsHelp:"Patient's age in years",systolicBpHelp:"Normal: 90-140 mmHg",diastolicBpHelp:"Normal: 60-90 mmHg",gfapTooltip:"Brain injury biomarker",gfapTooltipLong:"Glial Fibrillary Acidic Protein - Brain injury biomarker",gfapRange:"Range: {min} - {max} pg/mL",fastEdTooltip:"0-9 scale for LVO screening",analyzeIchRisk:"Analyze ICH Risk",analyzeStrokeRisk:"Analyze Stroke Risk",criticalPatient:"Critical Patient",comaAlert:"Patient is comatose (GCS < 8). Rapid assessment required.",vigilanceReduction:"Vigilance Reduction (Decreased alertness)",armParesis:"Arm Paresis",legParesis:"Leg Paresis",eyeDeviation:"Eye Deviation",atrialFibrillation:"Atrial Fibrillation",onNoacDoac:"On NOAC/DOAC",onAntiplatelets:"On Antiplatelets",resultsTitle:"Assessment Results",ichProbability:"ICH Probability",lvoProbability:"LVO Probability",riskLevel:"Risk Level",lowRisk:"Low Risk",moderateRisk:"Moderate Risk",highRisk:"High Risk",criticalRisk:"Critical Risk",riskLow:"Low",riskModerate:"Moderate",riskHigh:"High",riskCritical:"Critical",driversTitle:"Model Drivers",driversSubtitle:"Factors contributing to the prediction",riskFactors:"Risk Factors",increaseRisk:"INCREASE",decreaseRisk:"DECREASE",noPositiveFactors:"No increasing factors",noNegativeFactors:"No decreasing factors",ichDrivers:"ICH Risk Factors",lvoDrivers:"LVO Risk Factors",criticalAlertTitle:"CRITICAL RISK DETECTED",criticalAlertMessage:"High probability of intracerebral hemorrhage detected. Immediate medical attention required.",immediateActionsRequired:"Immediate actions required",initiateStrokeProtocol:"Initiate stroke protocol immediately",urgentCtImaging:"Urgent CT imaging required",considerBpManagement:"Consider blood pressure management",prepareNeurosurgicalConsult:"Prepare for potential neurosurgical consultation",helpTitle:"Quick Reference Guide",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 8: Comatose patient - use Coma Module",gcsMod:"GCS 8-12: Moderate impairment",gcsHigh:"GCS 13-15: Mild impairment",fastEdTitle:"FAST-ED Score Components",fastEdFacial:"Facial Palsy: 0-1 points",fastEdArm:"Arm Weakness: 0-2 points",fastEdSpeech:"Speech Changes: 0-2 points",fastEdTime:"Time: Critical factor",fastEdEye:"Eye Deviation: 0-2 points",fastEdDenial:"Denial/Neglect: 0-2 points",criticalValuesTitle:"Critical Values",criticalBp:"Systolic BP > 180: Increased ICH risk",criticalGfap:"GFAP > 500 pg/mL: Significant marker",criticalFastEd:"FAST-ED ≥ 4: Consider LVO",fastEdCalculatorTitle:"FAST-ED Score Calculator",fastEdCalculatorSubtitle:"Click to calculate FAST-ED score components",facialPalsyTitle:"Facial Palsy",facialPalsyNormal:"Normal (0)",facialPalsyMild:"Mild drooping (1)",armWeaknessTitle:"Arm Weakness",armWeaknessNormal:"Normal (0)",armWeaknessMild:"Mild drift (1)",armWeaknessSevere:"Falls immediately (2)",speechChangesTitle:"Speech Changes",speechChangesNormal:"Normal (0)",speechChangesMild:"Slurred speech (1)",speechChangesSevere:"Severe aphasia (2)",eyeDeviationTitle:"Eye Deviation",eyeDeviationNormal:"Normal (0)",eyeDeviationPartial:"Partial gaze palsy (1)",eyeDeviationForced:"Forced deviation (2)",denialNeglectTitle:"Denial/Neglect",denialNeglectNormal:"Normal (0)",denialNeglectPartial:"Partial neglect (1)",denialNeglectComplete:"Complete neglect (2)",totalScoreTitle:"Total FAST-ED Score",riskLevel:"Risk Level",riskLevelLow:"LOW (Score <4)",riskLevelHigh:"HIGH (Score ≥4 - Consider LVO)",applyScore:"Apply Score",cancel:"Cancel",modelDrivers:"Model Drivers",modelDriversSubtitle:"Factors contributing to the prediction",contributingFactors:"Contributing factors",factorsShown:"shown",positiveFactors:"Positive factors",negativeFactors:"Negative factors",clinicalInformation:"Clinical Information",clinicalRecommendations:"Clinical Recommendations",clinicalRec1:"Consider immediate imaging if ICH risk is high",clinicalRec2:"Activate stroke team for LVO scores ≥ 50%",clinicalRec3:"Monitor blood pressure closely",clinicalRec4:"Document all findings thoroughly",noDriverData:"No driver data available",driverAnalysisUnavailable:"Driver analysis unavailable",driverInfoNotAvailable:"Driver information not available from this prediction model",driverAnalysisNotAvailable:"Driver analysis not available for this prediction",lvoNotPossible:"LVO assessment not possible with limited data",fullExamRequired:"Full neurological examination required for LVO screening",limitedAssessment:"Limited Assessment",disclaimer:"Clinical Disclaimer",disclaimerText:"This tool is for clinical decision support only. Always use clinical judgment and follow local protocols. Not a replacement for physician assessment.",importantNote:"Important",importantText:"These results are for clinical decision support only. Always use clinical judgment and follow institutional protocols.",inputSummaryTitle:"Input Summary",inputSummarySubtitle:"Values used for this analysis",privacyLink:"Privacy Policy",disclaimerLink:"Medical Disclaimer",versionLink:"Version 2.0.1",privacyPolicy:"Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.",medicalDisclaimer:"Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.",networkError:"Network error - please check your connection and try again",requestTimeout:"Request timeout - please try again",apiError:"Failed to get results",validationError:"Please check your input values",sessionTimeout:"Your session has been idle for 30 minutes. Would you like to continue?",unsavedData:"You have unsaved data. Are you sure you want to leave?",nearestCentersTitle:"Nearest Stroke Centers",useCurrentLocation:"Use Current Location",enterLocationPlaceholder:"Enter city or address...",enterManually:"Enter Location Manually",search:"Search",yourLocation:"Your Location",recommendedCenters:"Recommended Centers",alternativeCenters:"Alternative Centers",noCentersFound:"No stroke centers found in this area",gettingLocation:"Getting your location",searchingLocation:"Searching location",locationError:"Unable to get your location",locationPermissionDenied:"Location access denied. Please allow location access and try again.",locationUnavailable:"Location information is unavailable",locationTimeout:"Location request timed out",geolocationNotSupported:"Geolocation is not supported by this browser",geocodingNotImplemented:"Location search not available. Please use GPS or enter coordinates manually.",tryManualEntry:"Try entering your location manually or use GPS.",distanceNote:"Distances are calculated as straight-line distances. Actual travel times may vary.",travelTimeNote:"Travel times calculated for emergency vehicles with sirens and priority routing.",calculatingTravelTimes:"Calculating travel times",minutes:"min",poweredByOrs:"Travel times powered by OpenRoute Service",comprehensiveCenter:"Comprehensive Stroke Center",primaryCenter:"Primary Stroke Center",telemetryCenter:"Telemedicine Center",thrombectomy:"Thrombectomy",neurosurgery:"Neurosurgery",icu:"Intensive Care",telemedicine:"Telemedicine",stroke_unit:"Stroke Unit",call:"Call",directions:"Directions",emergency:"Emergency",certified:"Certified"},de:{appTitle:"Schlaganfall-Triage-Assistent",emergencyBadge:"Notfall-Tool",helpButton:"Hilfe und Anweisungen",darkModeButton:"Dunklen Modus umschalten",languageToggle:"Sprache",step1:"Erstbeurteilung",step2:"Datenerhebung",step3:"Ergebnisse",comaModuleTitle:"Koma-Modul",limitedDataModuleTitle:"Begrenzte Daten Modul",fullStrokeModuleTitle:"Vollständiges Schlaganfall-Modul",triage1Title:"Patientenbeurteilung",triage1Question:"Ist der Patient komatös?",triage1Help:"Glasgow Coma Scale < 8",triage1Yes:"JA - Komatös",triage1No:"NEIN - Bei Bewusstsein",triage2Title:"Untersuchungsfähigkeit",triage2Question:"Kann der Patient zuverlässig untersucht werden?",triage2Help:"Patient ist nicht aphasisch, verwirrt oder unkooperativ",triage2Yes:"JA - Vollständige Untersuchung möglich",triage2No:"NEIN - Nur begrenzte Untersuchung",ageLabel:"Alter (Jahre)",ageHelp:"Patientenalter in Jahren",systolicLabel:"Systolischer RR (mmHg)",systolicHelp:"Systolischer Blutdruck",diastolicLabel:"Diastolischer RR (mmHg)",diastolicHelp:"Diastolischer Blutdruck",gfapLabel:"GFAP-Wert (pg/mL)",gfapHelp:"GFAP-Biomarker-Wert",fastEdLabel:"FAST-ED-Score",fastEdHelp:"FAST-ED-Bewertungsscore (0-9)",headacheLabel:"Kopfschmerzen",vigilanzLabel:"Bewusstseinstrübung",armPareseLabel:"Armschwäche",beinPareseLabel:"Beinschwäche",eyeDeviationLabel:"Blickdeviation",atrialFibLabel:"Vorhofflimmern",anticoagLabel:"Antikoaguliert (NOAK)",antiplateletsLabel:"Thrombozytenaggregationshemmer",analyzeButton:"Analysieren",analyzing:"Analysiere...",printResults:"Ergebnisse drucken",newAssessment:"Neue Bewertung starten",startOver:"Von vorn beginnen",goBack:"Zurück",goHome:"Zur Startseite",basicInformation:"Grundinformationen",biomarkersScores:"Biomarker & Scores",clinicalSymptoms:"Klinische Symptome",medicalHistory:"Anamnese",ageYearsLabel:"Alter (Jahre)",systolicBpLabel:"Systolischer RR (mmHg)",diastolicBpLabel:"Diastolischer RR (mmHg)",gfapValueLabel:"GFAP-Wert (pg/mL)",fastEdScoreLabel:"FAST-ED-Score",ageYearsHelp:"Patientenalter in Jahren",systolicBpHelp:"Normal: 90-140 mmHg",diastolicBpHelp:"Normal: 60-90 mmHg",gfapTooltip:"Hirnverletzungs-Biomarker",gfapTooltipLong:"Glial Fibrillary Acidic Protein - Hirnverletzungs-Biomarker",gfapRange:"Bereich: {min} - {max} pg/mL",fastEdTooltip:"0-9 Skala für LVO-Screening",analyzeIchRisk:"ICB-Risiko analysieren",analyzeStrokeRisk:"Schlaganfall-Risiko analysieren",criticalPatient:"Kritischer Patient",comaAlert:"Patient ist komatös (GCS < 8). Schnelle Beurteilung erforderlich.",vigilanceReduction:"Vigilanzminderung (Verminderte Wachheit)",armParesis:"Armparese",legParesis:"Beinparese",eyeDeviation:"Blickdeviation",atrialFibrillation:"Vorhofflimmern",onNoacDoac:"NOAK/DOAK-Therapie",onAntiplatelets:"Thrombozytenaggregationshemmer",resultsTitle:"Bewertungsergebnisse",ichProbability:"ICB-Wahrscheinlichkeit",lvoProbability:"LVO-Wahrscheinlichkeit",riskLevel:"Risikostufe",riskLow:"Niedrig",riskModerate:"Mäßig",riskHigh:"Hoch",riskCritical:"Kritisch",driversTitle:"Modelltreiber",driversSubtitle:"Faktoren, die zur Vorhersage beitragen",riskFactors:"Risikofaktoren",increaseRisk:"ERHÖHEN",decreaseRisk:"VERRINGERN",noPositiveFactors:"Keine erhöhenden Faktoren",noNegativeFactors:"Keine verringernden Faktoren",ichDrivers:"ICB-Risikofaktoren",lvoDrivers:"LVO-Risikofaktoren",criticalAlertTitle:"KRITISCHES RISIKO ERKANNT",criticalAlertMessage:"Hohe Wahrscheinlichkeit einer intrazerebralen Blutung erkannt. Sofortige medizinische Behandlung erforderlich.",immediateActionsRequired:"Sofortige Maßnahmen erforderlich",initiateStrokeProtocol:"Schlaganfall-Protokoll sofort einleiten",urgentCtImaging:"Dringende CT-Bildgebung erforderlich",considerBpManagement:"Blutdruckmanagement erwägen",prepareNeurosurgicalConsult:"Neurochirurgische Konsultation vorbereiten",helpTitle:"Kurzreferenzleitfaden",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 8: Komatöser Patient - Koma-Modul verwenden",gcsMod:"GCS 8-12: Mäßige Beeinträchtigung",gcsHigh:"GCS 13-15: Leichte Beeinträchtigung",fastEdTitle:"FAST-ED-Score-Komponenten",fastEdFacial:"Faziale Parese: 0-1 Punkte",fastEdArm:"Armschwäche: 0-2 Punkte",fastEdSpeech:"Sprachveränderungen: 0-2 Punkte",fastEdTime:"Zeit: Kritischer Faktor",fastEdEye:"Blickdeviation: 0-2 Punkte",fastEdDenial:"Verneinung/Neglect: 0-2 Punkte",criticalValuesTitle:"Kritische Werte",criticalBp:"Systolischer RR > 180: Erhöhtes ICB-Risiko",criticalGfap:"GFAP > 500 pg/mL: Signifikanter Marker",criticalFastEd:"FAST-ED ≥ 4: LVO in Betracht ziehen",fastEdCalculatorTitle:"FAST-ED-Score-Rechner",fastEdCalculatorSubtitle:"Klicken Sie, um FAST-ED-Score-Komponenten zu berechnen",facialPalsyTitle:"Faziale Parese",facialPalsyNormal:"Normal (0)",facialPalsyMild:"Leichte Mundwinkelasymmetrie (1)",armWeaknessTitle:"Armschwäche",armWeaknessNormal:"Normal (0)",armWeaknessMild:"Leichter Armabfall (1)",armWeaknessSevere:"Arm fällt sofort ab (2)",speechChangesTitle:"Sprachveränderungen",speechChangesNormal:"Normal (0)",speechChangesMild:"Verwaschene Sprache (1)",speechChangesSevere:"Schwere Aphasie (2)",eyeDeviationTitle:"Blickdeviation",eyeDeviationNormal:"Normal (0)",eyeDeviationPartial:"Partielle Blickparese (1)",eyeDeviationForced:"Forcierte Blickdeviation (2)",denialNeglectTitle:"Verneinung/Neglect",denialNeglectNormal:"Normal (0)",denialNeglectPartial:"Partieller Neglect (1)",denialNeglectComplete:"Kompletter Neglect (2)",totalScoreTitle:"Gesamt-FAST-ED-Score",riskLevel:"Risikostufe",riskLevelLow:"NIEDRIG (Score <4)",riskLevelHigh:"HOCH (Score ≥4 - LVO erwägen)",applyScore:"Score Anwenden",cancel:"Abbrechen",modelDrivers:"Modelltreiber",modelDriversSubtitle:"Faktoren, die zur Vorhersage beitragen",contributingFactors:"Beitragende Faktoren",factorsShown:"angezeigt",positiveFactors:"Positive Faktoren",negativeFactors:"Negative Faktoren",clinicalInformation:"Klinische Informationen",clinicalRecommendations:"Klinische Empfehlungen",clinicalRec1:"Sofortige Bildgebung erwägen bei hohem ICB-Risiko",clinicalRec2:"Stroke-Team aktivieren bei LVO-Score ≥ 50%",clinicalRec3:"Blutdruck engmaschig überwachen",clinicalRec4:"Alle Befunde gründlich dokumentieren",noDriverData:"Keine Treiberdaten verfügbar",driverAnalysisUnavailable:"Treiberanalyse nicht verfügbar",driverInfoNotAvailable:"Treiberinformationen von diesem Vorhersagemodell nicht verfügbar",driverAnalysisNotAvailable:"Treiberanalyse für diese Vorhersage nicht verfügbar",lvoNotPossible:"LVO-Bewertung mit begrenzten Daten nicht möglich",fullExamRequired:"Vollständige neurologische Untersuchung für LVO-Screening erforderlich",limitedAssessment:"Begrenzte Bewertung",disclaimer:"Klinischer Haftungsausschluss",disclaimerText:"Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle. Kein Ersatz für ärztliche Beurteilung.",importantNote:"Wichtig",importantText:"Diese Ergebnisse dienen nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie institutionelle Protokolle.",inputSummaryTitle:"Eingabezusammenfassung",inputSummarySubtitle:"Für diese Analyse verwendete Werte",privacyLink:"Datenschutzrichtlinie",disclaimerLink:"Medizinischer Haftungsausschluss",versionLink:"Version 2.0.1",privacyPolicy:"Datenschutzrichtlinie: Dieses Tool verarbeitet Daten lokal. Keine Patientendaten werden gespeichert oder übertragen.",medicalDisclaimer:"Medizinischer Haftungsausschluss: Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle.",networkError:"Netzwerkfehler - bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut",requestTimeout:"Anfrage-Timeout - bitte versuchen Sie es erneut",apiError:"Ergebnisse konnten nicht abgerufen werden",validationError:"Bitte überprüfen Sie Ihre Eingabewerte",sessionTimeout:"Ihre Sitzung war 30 Minuten lang inaktiv. Möchten Sie fortfahren?",unsavedData:"Sie haben ungespeicherte Daten. Sind Sie sicher, dass Sie verlassen möchten?",nearestCentersTitle:"Nächstgelegene Schlaganfall-Zentren",useCurrentLocation:"Aktuellen Standort verwenden",enterLocationPlaceholder:"Stadt oder Adresse eingeben...",enterManually:"Standort manuell eingeben",search:"Suchen",yourLocation:"Ihr Standort",recommendedCenters:"Empfohlene Zentren",alternativeCenters:"Alternative Zentren",noCentersFound:"Keine Schlaganfall-Zentren in diesem Bereich gefunden",gettingLocation:"Standort wird ermittelt",searchingLocation:"Standort wird gesucht",locationError:"Standort konnte nicht ermittelt werden",locationPermissionDenied:"Standortzugriff verweigert. Bitte erlauben Sie Standortzugriff und versuchen Sie es erneut.",locationUnavailable:"Standortinformationen sind nicht verfügbar",locationTimeout:"Standortanfrage ist abgelaufen",geolocationNotSupported:"Geolokalisierung wird von diesem Browser nicht unterstützt",geocodingNotImplemented:"Standortsuche nicht verfügbar. Bitte verwenden Sie GPS oder geben Sie Koordinaten manuell ein.",tryManualEntry:"Versuchen Sie, Ihren Standort manuell einzugeben oder GPS zu verwenden.",distanceNote:"Entfernungen werden als Luftlinie berechnet. Tatsächliche Fahrzeiten können variieren.",travelTimeNote:"Fahrzeiten berechnet für Rettungsfahrzeuge mit Sondersignalen und Vorfahrtsberechtigung.",calculatingTravelTimes:"Fahrzeiten werden berechnet",minutes:"Min",poweredByOrs:"Fahrzeiten bereitgestellt von OpenRoute Service",comprehensiveCenter:"Überregionales Schlaganfall-Zentrum",primaryCenter:"Regionales Schlaganfall-Zentrum",telemetryCenter:"Telemedizin-Zentrum",thrombectomy:"Thrombektomie",neurosurgery:"Neurochirurgie",icu:"Intensivstation",telemedicine:"Telemedizin",stroke_unit:"Stroke Unit",call:"Anrufen",directions:"Wegbeschreibung",emergency:"Notfall",certified:"Zertifiziert"}};class te{constructor(){this.supportedLanguages=["en","de"],this.currentLanguage=this.detectLanguage()}detectLanguage(){const t=localStorage.getItem("language");return t&&this.supportedLanguages.includes(t)?t:(navigator.language||navigator.userLanguage).substring(0,2).toLowerCase()==="de"?"de":"en"}getCurrentLanguage(){return this.currentLanguage}setLanguage(t){return this.supportedLanguages.includes(t)?(this.currentLanguage=t,localStorage.setItem("language",t),window.dispatchEvent(new CustomEvent("languageChanged",{detail:{language:t}})),!0):!1}getSupportedLanguages(){return[...this.supportedLanguages]}t(t){return(q[this.currentLanguage]||q.en)[t]||t}toggleLanguage(){const t=this.currentLanguage==="en"?"de":"en";return this.setLanguage(t)}getLanguageDisplayName(t=null){const e=t||this.currentLanguage;return{en:"English",de:"Deutsch"}[e]||e}formatDateTime(t){const e=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(e,{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(t)}formatTime(t){const e=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(e,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(t)}}const C=new te,a=i=>C.t(i);function U(){return`
    <div class="container">
      ${S(1)}
      <h2>${a("triage1Title")}</h2>
      <div class="triage-question">
        ${a("triage1Question")}
        <small>${a("triage1Help")}</small>
      </div>
      <div class="triage-buttons">
        <button class="yes-btn" data-action="triage1" data-value="true">${a("triage1Yes")}</button>
        <button class="no-btn" data-action="triage1" data-value="false">${a("triage1No")}</button>
      </div>
    </div>
  `}function ie(){return`
    <div class="container">
      ${S(1)}
      <h2>${a("triage2Title")}</h2>
      <div class="triage-question">
        ${a("triage2Question")}
        <small>${a("triage2Help")}</small>
      </div>
      <div class="triage-buttons">
        <button class="yes-btn" data-action="triage2" data-value="true">${a("triage2Yes")}</button>
        <button class="no-btn" data-action="triage2" data-value="false">${a("triage2No")}</button>
      </div>
    </div>
  `}const k={COMA_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_coma_ich",LDM_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_limited_data_ich",FULL_STROKE:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_full_stroke"},D={ich:{high:60,critical:80},lvo:{high:50,critical:70}},g={min:29,max:10001},A={autoSaveInterval:18e4,sessionTimeout:30*60*1e3,requestTimeout:1e4},ae={age_years:{required:!0,min:0,max:120},systolic_bp:{required:!0,min:60,max:300},diastolic_bp:{required:!0,min:30,max:200},gfap_value:{required:!0,min:g.min,max:g.max},fast_ed_score:{required:!0,min:0,max:9}};function se(){return`
    <div class="container">
      ${S(2)}
      <h2>${a("comaModuleTitle")||"Coma Module"}</h2>
      <div class="critical-alert">
        <h4><span class="alert-icon">🚨</span> ${a("criticalPatient")}</h4>
        <p>${a("comaAlert")}</p>
      </div>
      <form data-module="coma">
        <div class="input-grid">
          <div class="input-group">
            <label for="gfap_value">
              ${a("gfapValueLabel")}
              <span class="tooltip">ℹ️
                <span class="tooltiptext">${a("gfapTooltipLong")}</span>
              </span>
            </label>
            <input type="number" id="gfap_value" name="gfap_value" min="${g.min}" max="${g.max}" step="0.1" required aria-describedby="gfap-help">
            <div id="gfap-help" class="input-help">
              ${a("gfapRange").replace("{min}",g.min).replace("{max}",g.max)}
            </div>
          </div>
        </div>
        <button type="submit" class="primary">${a("analyzeIchRisk")}</button>
        <button type="button" class="secondary" data-action="reset">${a("startOver")}</button>
      </form>
    </div>
  `}function ne(){return`
    <div class="container">
      ${S(2)}
      <h2>${a("limitedDataModuleTitle")||"Limited Data Module"}</h2>
      <form data-module="limited">
        <div class="input-grid">
          <div class="input-group">
            <label for="age_years">${a("ageYearsLabel")}</label>
            <input type="number" name="age_years" id="age_years" min="0" max="120" required aria-describedby="age-help">
            <div id="age-help" class="input-help">${a("ageYearsHelp")}</div>
          </div>
          <div class="input-group">
            <label for="systolic_bp">${a("systolicBpLabel")}</label>
            <input type="number" name="systolic_bp" id="systolic_bp" min="60" max="300" required aria-describedby="sbp-help">
            <div id="sbp-help" class="input-help">${a("systolicBpHelp")}</div>
          </div>
          <div class="input-group">
            <label for="diastolic_bp">${a("diastolicBpLabel")}</label>
            <input type="number" name="diastolic_bp" id="diastolic_bp" min="30" max="200" required aria-describedby="dbp-help">
            <div id="dbp-help" class="input-help">${a("diastolicBpHelp")}</div>
          </div>
          <div class="input-group">
            <label for="gfap_value">
              ${a("gfapValueLabel")}
              <span class="tooltip">ℹ️
                <span class="tooltiptext">${a("gfapTooltipLong")}</span>
              </span>
            </label>
            <input type="number" name="gfap_value" id="gfap_value" min="${g.min}" max="${g.max}" step="0.1" required>
          </div>
        </div>
        <div class="checkbox-group">
          <label class="checkbox-wrapper">
            <input type="checkbox" name="vigilanzminderung" id="vigilanzminderung">
            <span class="checkbox-label">${a("vigilanceReduction")}</span>
          </label>
        </div>
        <button type="submit" class="primary">${a("analyzeIchRisk")}</button>
        <button type="button" class="secondary" data-action="reset">${a("startOver")}</button>
      </form>
    </div>
  `}function re(){return`
    <div class="container">
      ${S(2)}
      <h2>${a("fullStrokeModuleTitle")||"Full Stroke Module"}</h2>
      <form data-module="full">
        <h3>${a("basicInformation")}</h3>
        <div class="input-grid">
          <div class="input-group">
            <label for="age_years">${a("ageYearsLabel")}</label>
            <input type="number" name="age_years" id="age_years" min="0" max="120" required>
          </div>
          <div class="input-group">
            <label for="systolic_bp">${a("systolicBpLabel")}</label>
            <input type="number" name="systolic_bp" id="systolic_bp" min="60" max="300" required>
          </div>
          <div class="input-group">
            <label for="diastolic_bp">${a("diastolicBpLabel")}</label>
            <input type="number" name="diastolic_bp" id="diastolic_bp" min="30" max="200" required>
          </div>
        </div>

        <h3>${a("biomarkersScores")}</h3>
        <div class="input-grid">
          <div class="input-group">
            <label for="gfap_value">
              ${a("gfapValueLabel")}
              <span class="tooltip">ℹ️
                <span class="tooltiptext">${a("gfapTooltip")}</span>
              </span>
            </label>
            <input type="number" name="gfap_value" id="gfap_value" min="${g.min}" max="${g.max}" step="0.1" required>
          </div>
          <div class="input-group">
            <label for="fast_ed_score">
              ${a("fastEdScoreLabel")}
              <span class="tooltip">ℹ️
                <span class="tooltiptext">${a("fastEdCalculatorSubtitle")}</span>
              </span>
            </label>
            <input type="number" name="fast_ed_score" id="fast_ed_score" min="0" max="9" required readonly placeholder="${a("fastEdCalculatorSubtitle")}" style="cursor: pointer;">
            <input type="hidden" name="armparese" id="armparese_hidden" value="false">
          </div>
        </div>

        <h3>${a("clinicalSymptoms")}</h3>
        <div class="input-grid">
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="headache" id="headache">
              <span class="checkbox-label">${a("headacheLabel")}</span>
            </label>
            <label class="checkbox-wrapper">
              <input type="checkbox" name="vigilanzminderung" id="vigilanzminderung">
              <span class="checkbox-label">${a("vigilanzLabel")}</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="beinparese" id="beinparese">
              <span class="checkbox-label">${a("legParesis")}</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="eye_deviation" id="eye_deviation">
              <span class="checkbox-label">${a("eyeDeviation")}</span>
            </label>
          </div>
        </div>

        <h3>${a("medicalHistory")}</h3>
        <div class="input-grid">
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="atrial_fibrillation" id="atrial_fibrillation">
              <span class="checkbox-label">${a("atrialFibrillation")}</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="anticoagulated_noak" id="anticoagulated_noak">
              <span class="checkbox-label">${a("onNoacDoac")}</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="antiplatelets" id="antiplatelets">
              <span class="checkbox-label">${a("onAntiplatelets")}</span>
            </label>
          </div>
        </div>

        <button type="submit" class="primary">${a("analyzeStrokeRisk")}</button>
        <button type="button" class="secondary" data-action="reset">${a("startOver")}</button>
      </form>
    </div>
  `}function oe(){return`
    <div class="critical-alert">
      <h4><span class="alert-icon">🚨</span> ${a("criticalAlertTitle")}</h4>
      <p>${a("criticalAlertMessage")}</p>
      <p><strong>${a("immediateActionsRequired")}:</strong></p>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>${a("initiateStrokeProtocol")}</li>
        <li>${a("urgentCtImaging")}</li>
        <li>${a("considerBpManagement")}</li>
        <li>${a("prepareNeurosurgicalConsult")}</li>
      </ul>
    </div>
  `}function le(i){return!i||typeof i!="object"?{kind:"unavailable",units:null,positive:[],negative:[],meta:{}}:i.kind?i:i.shap_values||i.kind&&i.kind==="shap_values"?ce(i):i.logistic_contributions||i.kind&&i.kind==="logistic_contributions"?de(i):me(i)?ue(i):{kind:"unavailable",units:null,positive:[],negative:[],meta:{}}}function ce(i){const t=i.shap_values||i,e=[];Array.isArray(t)?t.forEach((o,l)=>{typeof o=="object"&&o.feature&&o.value!==void 0?e.push({label:o.feature,weight:o.value}):typeof o=="number"&&e.push({label:`Feature ${l}`,weight:o})}):typeof t=="object"&&Object.entries(t).forEach(([o,l])=>{typeof l=="number"&&e.push({label:o,weight:l})}),e.sort((o,l)=>Math.abs(l.weight)-Math.abs(o.weight));const s=e.filter(o=>o.weight>0),n=e.filter(o=>o.weight<0),r={};return i.base_value!==void 0&&(r.base_value=i.base_value),i.contrib_sum!==void 0&&(r.contrib_sum=i.contrib_sum),i.logit_total!==void 0&&(r.logit_total=i.logit_total),{kind:"shap_values",units:"logit",positive:s,negative:n,meta:r}}function de(i){const t=i.logistic_contributions||i,e=[];typeof t=="object"&&Object.entries(t).forEach(([o,l])=>{typeof l=="number"&&!["intercept","contrib_sum","logit_total"].includes(o)&&e.push({label:o,weight:l})}),e.sort((o,l)=>Math.abs(l.weight)-Math.abs(o.weight));const s=e.filter(o=>o.weight>0),n=e.filter(o=>o.weight<0),r={};return t.intercept!==void 0&&(r.base_value=t.intercept),t.contrib_sum!==void 0&&(r.contrib_sum=t.contrib_sum),t.logit_total!==void 0&&(r.logit_total=t.logit_total),i.contrib_sum!==void 0&&(r.contrib_sum=i.contrib_sum),{kind:"logistic_contributions",units:"logit",positive:s,negative:n,meta:r}}function ue(i){const t=[];Object.entries(i).forEach(([n,r])=>{typeof r=="number"&&t.push({label:n,weight:r})}),t.sort((n,r)=>Math.abs(r.weight)-Math.abs(n.weight));const e=t.filter(n=>n.weight>0),s=t.filter(n=>n.weight<0);return{kind:"raw_weights",units:null,positive:e,negative:s,meta:{}}}function me(i){return Object.values(i).every(t=>typeof t=="number")}function pe(i,t){if(!(i!=null&&i.drivers)&&!(t!=null&&t.drivers))return"";let e=`
    <div class="drivers-section">
      <div class="drivers-header">
        <h3><span class="driver-header-icon">🎯</span> ${a("modelDrivers")}</h3>
        <p class="drivers-subtitle">${a("modelDriversSubtitle")}</p>
      </div>
      <div class="enhanced-drivers-grid">
  `;return i!=null&&i.drivers&&(e+=K(i.drivers,"ICH","ich",i.probability)),t!=null&&t.drivers&&!t.notPossible&&(e+=K(t.drivers,"LVO","lvo",t.probability)),e+=`
      </div>
    </div>
  `,e}function K(i,t,e,s){if(!i||Object.keys(i).length===0)return`
      <div class="enhanced-drivers-panel ${e}">
        <div class="panel-header">
          <div class="panel-icon ${e}">${e==="ich"?"🧠":"🩸"}</div>
          <div class="panel-title">
            <h4>${t} ${a("riskFactors")}</h4>
            <span class="panel-subtitle">${a("noDriverData")}</span>
          </div>
        </div>
        <p class="no-drivers-message">
          ${a("driverInfoNotAvailable")}
        </p>
      </div>
    `;const n=le(i);if(n.kind==="unavailable")return`
      <div class="enhanced-drivers-panel ${e}">
        <div class="panel-header">
          <div class="panel-icon ${e}">${e==="ich"?"🧠":"🩸"}</div>
          <div class="panel-title">
            <h4>${t} ${a("riskFactors")}</h4>
            <span class="panel-subtitle">${a("driverAnalysisUnavailable")}</span>
          </div>
        </div>
        <p class="no-drivers-message">
          ${a("driverAnalysisNotAvailable")}
        </p>
      </div>
    `;const r=n.positive.sort((d,p)=>Math.abs(p.weight)-Math.abs(d.weight)).slice(0,3),o=n.negative.sort((d,p)=>Math.abs(p.weight)-Math.abs(d.weight)).slice(0,3),l=Math.max(...r.map(d=>Math.abs(d.weight)),...o.map(d=>Math.abs(d.weight)),.01);let c=`
    <div class="enhanced-drivers-panel ${e}">
      <div class="panel-header">
        <div class="panel-icon ${e}">${e==="ich"?"🧠":"🩸"}</div>
        <div class="panel-title">
          <h4>${t} ${a("riskFactors")}</h4>
          <span class="panel-subtitle">${a("contributingFactors")}</span>
        </div>
      </div>
      
      <div class="drivers-split-view">
        <div class="drivers-column positive-column">
          <div class="column-header">
            <span class="column-icon">↑</span>
            <span class="column-title">${a("increaseRisk")}</span>
          </div>
          <div class="compact-drivers">
  `;return r.length>0?r.forEach(d=>{const p=Math.abs(d.weight*100),h=Math.abs(d.weight)/l*100,f=d.label.replace(/_/g," ").replace(/\b\w/g,y=>y.toUpperCase());c+=`
        <div class="compact-driver-item">
          <div class="compact-driver-label">${f}</div>
          <div class="compact-driver-bar positive" style="width: ${h}%">
            <span class="compact-driver-value">+${p.toFixed(0)}%</span>
          </div>
        </div>
      `}):c+=`<div class="no-factors">${a("noPositiveFactors")}</div>`,c+=`
          </div>
        </div>
        
        <div class="drivers-column negative-column">
          <div class="column-header">
            <span class="column-icon">↓</span>
            <span class="column-title">${a("decreaseRisk")}</span>
          </div>
          <div class="compact-drivers">
  `,o.length>0?o.forEach(d=>{const p=Math.abs(d.weight*100),h=Math.abs(d.weight)/l*100,f=d.label.replace(/_/g," ").replace(/\b\w/g,y=>y.toUpperCase());c+=`
        <div class="compact-driver-item">
          <div class="compact-driver-label">${f}</div>
          <div class="compact-driver-bar negative" style="width: ${h}%">
            <span class="compact-driver-value">-${p.toFixed(0)}%</span>
          </div>
        </div>
      `}):c+=`<div class="no-factors">${a("noNegativeFactors")}</div>`,c+=`
          </div>
        </div>
      </div>
    </div>
  `,c}const Y=[{id:"uniklinik-freiburg",name:"Universitätsklinikum Freiburg",type:"comprehensive",address:"Hugstetter Str. 55, 79106 Freiburg im Breisgau",coordinates:{lat:48.0025,lng:7.8347},phone:"+49 761 270-0",emergency:"+49 761 270-34010",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"uniklinik-heidelberg",name:"Universitätsklinikum Heidelberg",type:"comprehensive",address:"Im Neuenheimer Feld 400, 69120 Heidelberg",coordinates:{lat:49.4178,lng:8.6706},phone:"+49 6221 56-0",emergency:"+49 6221 56-36643",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"uniklinik-tuebingen",name:"Universitätsklinikum Tübingen",type:"comprehensive",address:"Geissweg 3, 72076 Tübingen",coordinates:{lat:48.5378,lng:9.0538},phone:"+49 7071 29-0",emergency:"+49 7071 29-82211",services:["thrombectory","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"uniklinik-ulm",name:"Universitätsklinikum Ulm",type:"comprehensive",address:"Albert-Einstein-Allee 23, 89081 Ulm",coordinates:{lat:48.4196,lng:9.9592},phone:"+49 731 500-0",emergency:"+49 731 500-63001",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"klinikum-stuttgart",name:"Klinikum Stuttgart - Katharinenhospital",type:"comprehensive",address:"Kriegsbergstraße 60, 70174 Stuttgart",coordinates:{lat:48.7784,lng:9.1682},phone:"+49 711 278-0",emergency:"+49 711 278-32001",services:["thrombectomy","neurosurgery","icu"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"robert-bosch-stuttgart",name:"Robert-Bosch-Krankenhaus Stuttgart",type:"primary",address:"Auerbachstraße 110, 70376 Stuttgart",coordinates:{lat:48.7447,lng:9.2294},phone:"+49 711 8101-0",emergency:"+49 711 8101-3456",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"diakonie-stuttgart",name:"Diakonie-Klinikum Stuttgart",type:"primary",address:"Rosenbergstraße 38, 70176 Stuttgart",coordinates:{lat:48.7861,lng:9.1736},phone:"+49 711 991-0",emergency:"+49 711 991-2201",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"rkh-ludwigsburg",name:"RKH Klinikum Ludwigsburg",type:"primary",address:"Posilipostraße 4, 71640 Ludwigsburg",coordinates:{lat:48.8901,lng:9.1953},phone:"+49 7141 99-0",emergency:"+49 7141 99-67201",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-karlsruhe",name:"Städtisches Klinikum Karlsruhe",type:"comprehensive",address:"Moltkestraße 90, 76133 Karlsruhe",coordinates:{lat:49.0047,lng:8.3858},phone:"+49 721 974-0",emergency:"+49 721 974-2301",services:["thrombectomy","neurosurgery","icu"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"vincentius-karlsruhe",name:"ViDia Kliniken Karlsruhe - St. Vincentius",type:"primary",address:"Südendstraße 32, 76135 Karlsruhe",coordinates:{lat:48.9903,lng:8.3711},phone:"+49 721 8108-0",emergency:"+49 721 8108-9201",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-mannheim",name:"Universitätsmedizin Mannheim",type:"comprehensive",address:"Theodor-Kutzer-Ufer 1-3, 68167 Mannheim",coordinates:{lat:49.4828,lng:8.4664},phone:"+49 621 383-0",emergency:"+49 621 383-2251",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-01-01"},{id:"theresienkrankenhaus-mannheim",name:"Theresienkrankenhaus Mannheim",type:"primary",address:"Bassermannstraße 1, 68165 Mannheim",coordinates:{lat:49.4904,lng:8.4594},phone:"+49 621 424-0",emergency:"+49 621 424-2101",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-pforzheim",name:"Helios Klinikum Pforzheim",type:"primary",address:"Kanzlerstraße 2-6, 75175 Pforzheim",coordinates:{lat:48.8833,lng:8.6936},phone:"+49 7231 969-0",emergency:"+49 7231 969-2301",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"zollernalb-klinikum",name:"Zollernalb Klinikum Albstadt",type:"primary",address:"Zollernring 10-14, 72488 Sigmaringen",coordinates:{lat:48.0878,lng:9.2233},phone:"+49 7571 100-0",emergency:"+49 7571 100-1501",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-konstanz",name:"Gesundheitsverbund Landkreis Konstanz",type:"primary",address:"Mainaustraße 14, 78464 Konstanz",coordinates:{lat:47.6779,lng:9.1732},phone:"+49 7531 801-0",emergency:"+49 7531 801-2301",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-friedrichshafen",name:"Klinikum Friedrichshafen",type:"primary",address:"Röntgenstraße 2, 88048 Friedrichshafen",coordinates:{lat:47.6587,lng:9.4685},phone:"+49 7541 96-0",emergency:"+49 7541 96-2401",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"oberschwabenklinik-ravensburg",name:"Oberschwabenklinik Ravensburg",type:"primary",address:"Elisabethenstraße 17, 88212 Ravensburg",coordinates:{lat:47.7815,lng:9.6078},phone:"+49 751 87-0",emergency:"+49 751 87-2201",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"alb-donau-klinikum",name:"Alb Donau Klinikum Ehingen",type:"primary",address:"Schwörhausgasse 7, 89584 Ehingen",coordinates:{lat:48.2833,lng:9.7262},phone:"+49 7391 789-0",emergency:"+49 7391 789-1801",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"ortenau-klinikum-offenburg",name:"Ortenau Klinikum Offenburg",type:"primary",address:"Ebertplatz 12, 77654 Offenburg",coordinates:{lat:48.4706,lng:7.9444},phone:"+49 781 472-0",emergency:"+49 781 472-2001",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"},{id:"klinikum-baden-baden",name:"Klinikum Mittelbaden Baden-Baden",type:"primary",address:"Balger Str. 50, 76532 Baden-Baden",coordinates:{lat:48.7606,lng:8.2275},phone:"+49 7221 91-0",emergency:"+49 7221 91-1701",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-01-01"}];function E(i,t,e,s){const r=w(e-i),o=w(s-t),l=Math.sin(r/2)*Math.sin(r/2)+Math.cos(w(i))*Math.cos(w(e))*Math.sin(o/2)*Math.sin(o/2);return 6371*(2*Math.atan2(Math.sqrt(l),Math.sqrt(1-l)))}function w(i){return i*(Math.PI/180)}async function Z(i,t,e,s,n="driving-car"){try{const r=`https://api.openrouteservice.org/v2/directions/${n}`,l=await fetch(r,{method:"POST",headers:{Accept:"application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",Authorization:"5b3ce3597851110001cf624868c4c27b63ae476c9c26c8bffbc35688","Content-Type":"application/json; charset=utf-8"},body:JSON.stringify({coordinates:[[t,i],[s,e]],radiuses:[1e3,1e3],format:"json"})});if(!l.ok)throw new Error(`Routing API error: ${l.status}`);const c=await l.json();if(c.routes&&c.routes.length>0){const d=c.routes[0];return{duration:Math.round(d.summary.duration/60),distance:Math.round(d.summary.distance/1e3),source:"routing"}}else throw new Error("No route found")}catch(r){console.warn("Travel time calculation failed, using distance estimate:",r);const o=E(i,t,e,s);return{duration:Math.round(o/.8),distance:Math.round(o),source:"estimated"}}}async function ge(i,t,e,s){try{const n=await Z(i,t,e,s,"driving-car");return{duration:Math.round(n.duration*.75),distance:n.distance,source:n.source==="routing"?"emergency-routing":"emergency-estimated"}}catch{const r=E(i,t,e,s);return{duration:Math.round(r/1.2),distance:Math.round(r),source:"emergency-estimated"}}}async function he(i,t,e=5,s=120,n=!0){return console.log("Calculating travel times to stroke centers..."),(await Promise.all(Y.map(async o=>{try{const l=n?await ge(i,t,o.coordinates.lat,o.coordinates.lng):await Z(i,t,o.coordinates.lat,o.coordinates.lng);return{...o,travelTime:l.duration,distance:l.distance,travelSource:l.source}}catch(l){console.warn(`Failed to calculate travel time to ${o.name}:`,l);const c=E(i,t,o.coordinates.lat,o.coordinates.lng);return{...o,travelTime:Math.round(c/.8),distance:Math.round(c),travelSource:"fallback"}}}))).filter(o=>o.travelTime<=s).sort((o,l)=>o.travelTime-l.travelTime).slice(0,e)}function ve(i,t,e=5,s=100){return Y.map(r=>({...r,distance:E(i,t,r.coordinates.lat,r.coordinates.lng)})).filter(r=>r.distance<=s).sort((r,o)=>r.distance-o.distance).slice(0,e)}async function be(i,t,e="stroke"){const s=await he(i,t,10,120,!0);if(e==="lvo"||e==="thrombectomy"){const n=s.filter(o=>o.type==="comprehensive"&&o.services.includes("thrombectomy")&&o.travelTime<=60),r=s.filter(o=>o.type==="primary");return{recommended:n.slice(0,3),alternative:r.slice(0,2)}}if(e==="ich"){const n=s.filter(r=>r.services.includes("neurosurgery")&&r.travelTime<=45);return{recommended:n.slice(0,3),alternative:s.filter(r=>!n.includes(r)).slice(0,2)}}return{recommended:s.slice(0,5),alternative:[]}}function fe(i,t,e="stroke"){const s=ve(i,t,10);if(e==="lvo"||e==="thrombectomy"){const n=s.filter(o=>o.type==="comprehensive"&&o.services.includes("thrombectomy")),r=s.filter(o=>o.type==="primary");return{recommended:n.slice(0,3),alternative:r.slice(0,2)}}return{recommended:s.slice(0,5),alternative:[]}}function ye(i){return`
    <div class="stroke-center-section">
      <h3>🏥 ${a("nearestCentersTitle")}</h3>
      <div id="locationContainer">
        <div class="location-controls">
          <button type="button" id="useGpsButton" class="secondary">
            📍 ${a("useCurrentLocation")}
          </button>
          <div class="location-manual" style="display: none;">
            <input type="text" id="locationInput" placeholder="${a("enterLocationPlaceholder")}" />
            <button type="button" id="searchLocationButton" class="secondary">${a("search")}</button>
          </div>
          <button type="button" id="manualLocationButton" class="secondary">
            ✏️ ${a("enterManually")}
          </button>
        </div>
        <div id="strokeCenterResults" class="stroke-center-results"></div>
      </div>
    </div>
  `}function ke(i){const t=document.getElementById("useGpsButton"),e=document.getElementById("manualLocationButton"),s=document.querySelector(".location-manual"),n=document.getElementById("locationInput"),r=document.getElementById("searchLocationButton"),o=document.getElementById("strokeCenterResults");t&&t.addEventListener("click",()=>{Se(i,o)}),e&&e.addEventListener("click",()=>{s.style.display=s.style.display==="none"?"block":"none"}),r&&r.addEventListener("click",()=>{const l=n.value.trim();l&&W(l,i,o)}),n&&n.addEventListener("keypress",l=>{if(l.key==="Enter"){const c=n.value.trim();c&&W(c,i,o)}})}function Se(i,t){if(!navigator.geolocation){_(a("geolocationNotSupported"),t);return}t.innerHTML=`<div class="loading">${a("gettingLocation")}...</div>`,navigator.geolocation.getCurrentPosition(e=>{const{latitude:s,longitude:n}=e.coords;Le(s,n,i,t)},e=>{let s=a("locationError");switch(e.code){case e.PERMISSION_DENIED:s=a("locationPermissionDenied");break;case e.POSITION_UNAVAILABLE:s=a("locationUnavailable");break;case e.TIMEOUT:s=a("locationTimeout");break}_(s,t)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:3e5})}async function W(i,t,e){e.innerHTML=`<div class="loading">${a("searchingLocation")}...</div>`,_(a("geocodingNotImplemented"),e)}async function Le(i,t,e,s){const n=we(e);s.innerHTML=`
    <div class="location-info">
      <p><strong>${a("yourLocation")}:</strong> ${i.toFixed(4)}, ${t.toFixed(4)}</p>
    </div>
    <div class="loading">${a("calculatingTravelTimes")}...</div>
  `;try{const r=await be(i,t,n),o=`
      <div class="location-info">
        <p><strong>${a("yourLocation")}:</strong> ${i.toFixed(4)}, ${t.toFixed(4)}</p>
      </div>
      
      <div class="recommended-centers">
        <h4>${a("recommendedCenters")}</h4>
        ${T(r.recommended,!0)}
      </div>
      
      ${r.alternative.length>0?`
        <div class="alternative-centers">
          <h4>${a("alternativeCenters")}</h4>
          ${T(r.alternative,!1)}
        </div>
      `:""}
      
      <div class="travel-time-note">
        <small>${a("travelTimeNote")}</small>
        <br><small class="powered-by">${a("poweredByOrs")}</small>
      </div>
    `;s.innerHTML=o}catch(r){console.warn("Travel time calculation failed, falling back to distance:",r);const o=fe(i,t,n),l=`
      <div class="location-info">
        <p><strong>${a("yourLocation")}:</strong> ${i.toFixed(4)}, ${t.toFixed(4)}</p>
      </div>
      
      <div class="recommended-centers">
        <h4>${a("recommendedCenters")}</h4>
        ${T(o.recommended,!0)}
      </div>
      
      ${o.alternative.length>0?`
        <div class="alternative-centers">
          <h4>${a("alternativeCenters")}</h4>
          ${T(o.alternative,!1)}
        </div>
      `:""}
      
      <div class="distance-note">
        <small>${a("distanceNote")}</small>
      </div>
    `;s.innerHTML=l}}function T(i,t=!1){return!i||i.length===0?`<p>${a("noCentersFound")}</p>`:i.map(e=>`
    <div class="stroke-center-card ${t?"recommended":"alternative"}">
      <div class="center-header">
        <h5>${e.name}</h5>
        <span class="center-type ${e.type}">${a(e.type+"Center")}</span>
        ${e.travelTime?`
          <span class="travel-time">
            <span class="time">${e.travelTime} ${a("minutes")}</span>
            <span class="distance">(${e.distance} km)</span>
          </span>
        `:`
          <span class="distance">${e.distance.toFixed(1)} km</span>
        `}
      </div>
      
      <div class="center-details">
        <p class="address">📍 ${e.address}</p>
        <p class="phone">📞 ${a("emergency")}: ${e.emergency}</p>
        
        <div class="services">
          ${e.services.map(s=>`
            <span class="service-badge">${a(s)}</span>
          `).join("")}
        </div>
        
        ${e.certified?`
          <div class="certification">
            ✅ ${a("certified")}: ${e.certification}
          </div>
        `:""}
      </div>
      
      <div class="center-actions">
        <button class="call-button" onclick="window.open('tel:${e.emergency}')">
          📞 ${a("call")}
        </button>
        <button class="directions-button" onclick="window.open('https://maps.google.com/maps?daddr=${e.coordinates.lat},${e.coordinates.lng}', '_blank')">
          🧭 ${a("directions")}
        </button>
      </div>
    </div>
  `).join("")}function we(i){return i?i.lvo&&i.lvo.probability>.5?"lvo":i.ich&&i.ich.probability>.6?"ich":"stroke":"stroke"}function _(i,t){t.innerHTML=`
    <div class="location-error">
      <p>⚠️ ${i}</p>
      <p><small>${a("tryManualEntry")}</small></p>
    </div>
  `}function Te(i,t){const e=Number(i),s=D[t];return e>=s.critical?"🔴 CRITICAL RISK":e>=s.high?"🟠 HIGH RISK":e>=30?"🟡 MODERATE RISK":"🟢 LOW RISK"}function Ee(){const t=m.getState().formData;if(!t||Object.keys(t).length===0)return"";let e="";return Object.entries(t).forEach(([s,n])=>{if(n&&Object.keys(n).length>0){const r=a(`${s}ModuleTitle`)||s.charAt(0).toUpperCase()+s.slice(1);let o="";Object.entries(n).forEach(([l,c])=>{if(c===""||c===null||c===void 0)return;let d=l;a(`${l}Label`)?d=a(`${l}Label`):d=l.replace(/_/g," ").replace(/\b\w/g,h=>h.toUpperCase());let p=c;typeof c=="boolean"&&(p=c?"✓":"✗"),o+=`
          <div class="summary-item">
            <span class="summary-label">${d}:</span>
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
      <h3>📋 ${a("inputSummaryTitle")}</h3>
      <p class="summary-subtitle">${a("inputSummarySubtitle")}</p>
      <div class="summary-content">
        ${e}
      </div>
    </div>
  `:""}function j(i,t,e){if(!t)return"";const s=Math.round((t.probability||0)*100),n=Te(s,i),r=s>D[i].critical,o=s>D[i].high,l={ich:"🧠",lvo:"🩸"},c={ich:a("ichProbability"),lvo:a("lvoProbability")};return`
    <div class="enhanced-risk-card ${i} ${r?"critical":o?"high":"normal"}">
      <div class="risk-header">
        <div class="risk-icon">${l[i]}</div>
        <div class="risk-title">
          <h3>${c[i]}</h3>
          <span class="risk-module">${t.module} Module</span>
        </div>
      </div>
      
      <div class="risk-probability">
        <div class="probability-circle" data-percent="${s}">
          <div class="probability-number">${s}<span>%</span></div>
          <svg class="probability-ring" width="120" height="120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border-color)" stroke-width="8"/>
            <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" stroke-width="8" 
                    stroke-dasharray="${2*Math.PI*54}" 
                    stroke-dashoffset="${2*Math.PI*54*(1-s/100)}"
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
  `}function $e(){return`
    <div class="enhanced-risk-card lvo not-possible">
      <div class="risk-header">
        <div class="risk-icon">🔍</div>
        <div class="risk-title">
          <h3>${a("lvoProbability")}</h3>
          <span class="risk-module">${a("limitedAssessment")}</span>
        </div>
      </div>
      
      <div class="not-possible-content">
        <p>${a("lvoNotPossible")}</p>
        <p>${a("fullExamRequired")}</p>
      </div>
    </div>
  `}function Ce(i,t){const{ich:e,lvo:s}=i,n=j("ich",e),r=s!=null&&s.notPossible?$e():j("lvo",s),o=e&&e.probability>.6?oe():"",l=pe(e,s),c=ye(),d=Ee();return`
    <div class="container">
      ${S(3)}
      <h2>${a("resultsTitle")}</h2>
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
          <span class="toggle-text">${a("inputSummaryTitle")}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="input-summary" style="display: none;">
          ${d}
        </div>
        
        <button class="info-toggle" data-target="stroke-centers">
          <span class="toggle-icon">🏥</span>
          <span class="toggle-text">${a("nearestCentersTitle")}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="stroke-centers" style="display: none;">
          ${c}
        </div>
        
        <button class="info-toggle" data-target="clinical-info">
          <span class="toggle-icon">ℹ️</span>
          <span class="toggle-text">${a("clinicalInformation")}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="clinical-info" style="display: none;">
          <div class="clinical-recommendations">
            <h4>${a("clinicalRecommendations")}</h4>
            <ul>
              <li>${a("clinicalRec1")}</li>
              <li>${a("clinicalRec2")}</li>
              <li>${a("clinicalRec3")}</li>
              <li>${a("clinicalRec4")}</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="results-actions">
        <div class="primary-actions">
          <button type="button" class="primary" id="printResults"> 📄 ${a("printResults")} </button>
          <button type="button" class="secondary" data-action="reset"> ${a("newAssessment")} </button>
        </div>
        <div class="navigation-actions">
          <button type="button" class="tertiary" data-action="goBack"> ← ${a("goBack")} </button>
          <button type="button" class="tertiary" data-action="goHome"> 🏠 ${a("goHome")} </button>
        </div>
      </div>
      
      <div class="disclaimer">
        <strong>⚠️ ${a("importantNote")}:</strong> ${a("importantText")} Results generated at ${new Date().toLocaleTimeString()}.
      </div>
    </div>
  `}function De(i,t,e){const s=[];return e.required&&!t&&t!==0&&s.push("This field is required"),e.min!==void 0&&t!==""&&!isNaN(t)&&parseFloat(t)<e.min&&s.push(`Value must be at least ${e.min}`),e.max!==void 0&&t!==""&&!isNaN(t)&&parseFloat(t)>e.max&&s.push(`Value must be at most ${e.max}`),e.pattern&&!e.pattern.test(t)&&s.push("Invalid format"),s}function Ae(i){let t=!0;const e={};return Object.entries(ae).forEach(([s,n])=>{const r=i.elements[s];if(r){const o=De(s,r.value,n);o.length>0&&(e[s]=o,t=!1)}}),{isValid:t,validationErrors:e}}function _e(i,t){Object.entries(t).forEach(([e,s])=>{const n=i.querySelector(`[name="${e}"]`);if(n){const r=n.closest(".input-group");if(r){r.classList.add("error"),r.querySelectorAll(".error-message").forEach(l=>l.remove());const o=document.createElement("div");o.className="error-message",o.innerHTML=`<span class="error-icon">⚠️</span> ${s[0]}`,r.appendChild(o)}}})}function Me(i){i.querySelectorAll(".input-group.error").forEach(t=>{t.classList.remove("error"),t.querySelectorAll(".error-message").forEach(e=>e.remove())})}class v extends Error{constructor(t,e,s){super(t),this.name="APIError",this.status=e,this.url=s}}function M(i){const t={...i};return Object.keys(t).forEach(e=>{const s=t[e];(typeof s=="boolean"||s==="on"||s==="true"||s==="false")&&(t[e]=s===!0||s==="on"||s==="true"?1:0)}),t}function b(i,t=0){const e=parseFloat(i);return isNaN(e)?t:e}async function N(i,t){const e=new AbortController,s=setTimeout(()=>e.abort(),A.requestTimeout);try{const n=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(t),signal:e.signal,mode:"cors"});if(clearTimeout(s),!n.ok){let o=`HTTP ${n.status}`;try{const l=await n.json();o=l.error||l.message||o}catch{o=`${o}: ${n.statusText}`}throw new v(o,n.status,i)}return await n.json()}catch(n){throw clearTimeout(s),n.name==="AbortError"?new v("Request timeout - please try again",408,i):n instanceof v?n:new v("Network error - please check your connection and try again",0,i)}}async function Ne(i){const t=M(i);console.log("Coma ICH API Payload:",t);try{const e=await N(k.COMA_ICH,t);return console.log("Coma ICH API Response:",e),{probability:b(e.probability||e.ich_probability,0),drivers:e.drivers||null,confidence:b(e.confidence,.75),module:"Coma"}}catch(e){throw console.error("Coma ICH prediction failed:",e),new v(`Failed to get ICH prediction: ${e.message}`,e.status,k.COMA_ICH)}}async function Pe(i){const t={age_years:i.age_years,systolic_bp:i.systolic_bp,diastolic_bp:i.diastolic_bp,gfap_value:i.gfap_value,vigilanzminderung:i.vigilanzminderung||0},e=M(t);console.log("Limited Data ICH API Payload:",e);try{const s=await N(k.LDM_ICH,e);return console.log("Limited Data ICH API Response:",s),{probability:b(s.probability||s.ich_probability,0),drivers:s.drivers||null,confidence:b(s.confidence,.65),module:"Limited Data"}}catch(s){throw console.error("Limited Data ICH prediction failed:",s),new v(`Failed to get ICH prediction: ${s.message}`,s.status,k.LDM_ICH)}}async function Ie(i){var s,n,r,o,l,c,d,p,h,f,y,I,R,B,x,F,H,z;const t={age_years:i.age_years,systolic_bp:i.systolic_bp,diastolic_bp:i.diastolic_bp,gfap_value:i.gfap_value,fast_ed_score:i.fast_ed_score,headache:i.headache||0,vigilanzminderung:i.vigilanzminderung||0,armparese:i.armparese||0,beinparese:i.beinparese||0,eye_deviation:i.eye_deviation||0,atrial_fibrillation:i.atrial_fibrillation||0,anticoagulated_noak:i.anticoagulated_noak||0,antiplatelets:i.antiplatelets||0},e=M(t);console.log("Full Stroke API Payload:",e);try{const u=await N(k.FULL_STROKE,e);console.log("Full Stroke API Response:",u),console.log("Available keys in response:",Object.keys(u)),console.log("Response type:",typeof u),Object.keys(u).forEach(V=>{const L=u[V];typeof L=="number"&&L>=0&&L<=1&&console.log(`Potential probability field: ${V} = ${L}`)});const O=b(((s=u.ich_prediction)==null?void 0:s.probability)||u.ich_probability||((n=u.ich)==null?void 0:n.probability)||u.ICH_probability||u.ich_prob||((r=u.probability)==null?void 0:r.ich)||((o=u.results)==null?void 0:o.ich_probability),0),G=b(((l=u.lvo_prediction)==null?void 0:l.probability)||u.lvo_probability||((c=u.lvo)==null?void 0:c.probability)||u.LVO_probability||u.lvo_prob||((d=u.probability)==null?void 0:d.lvo)||((p=u.results)==null?void 0:p.lvo_probability),0);console.log("Extracted probabilities:",{ich:O,lvo:G});const Q={probability:O,drivers:((h=u.ich_prediction)==null?void 0:h.drivers)||u.ich_drivers||((f=u.ich)==null?void 0:f.drivers)||((y=u.drivers)==null?void 0:y.ich)||null,confidence:b(((I=u.ich_prediction)==null?void 0:I.confidence)||u.ich_confidence||((R=u.ich)==null?void 0:R.confidence),.85),module:"Full Stroke"},X={probability:G,drivers:((B=u.lvo_prediction)==null?void 0:B.drivers)||u.lvo_drivers||((x=u.lvo)==null?void 0:x.drivers)||((F=u.drivers)==null?void 0:F.lvo)||null,confidence:b(((H=u.lvo_prediction)==null?void 0:H.confidence)||u.lvo_confidence||((z=u.lvo)==null?void 0:z.confidence),.85),module:"Full Stroke"};return{ich:Q,lvo:X}}catch(u){throw console.error("Full Stroke prediction failed:",u),new v(`Failed to get stroke predictions: ${u.message}`,u.status,k.FULL_STROKE)}}function Re(i){m.logEvent("triage1_answer",{comatose:i}),P(i?"coma":"triage2")}function Be(i){m.logEvent("triage2_answer",{examinable:i}),P(i?"full":"limited")}function P(i){m.logEvent("navigate",{from:m.getState().currentScreen,to:i}),m.navigate(i),window.scrollTo(0,0)}function xe(){m.hasUnsavedData()&&!confirm("Are you sure you want to start over? All entered data will be lost.")||(m.logEvent("reset"),m.reset())}function Fe(){console.log("goBack() called");const i=m.goBack();console.log("goBack() success:",i),i?(m.logEvent("navigate_back"),window.scrollTo(0,0)):(console.log("No history available, going home instead"),J())}function J(){console.log("goHome() called"),m.logEvent("navigate_home"),m.goHome(),window.scrollTo(0,0)}async function He(i,t){i.preventDefault();const e=i.target,s=e.dataset.module,n=Ae(e);if(!n.isValid){_e(t,n.validationErrors);return}const r={};Array.from(e.elements).forEach(c=>{if(c.name)if(c.type==="checkbox")r[c.name]=c.checked;else if(c.type==="number"){const d=parseFloat(c.value);r[c.name]=isNaN(d)?0:d}else c.type==="hidden"&&c.name==="armparese"?r[c.name]=c.value==="true":r[c.name]=c.value}),console.log("Collected form inputs:",r),m.setFormData(s,r);const o=e.querySelector("button[type=submit]"),l=o?o.innerHTML:"";o&&(o.disabled=!0,o.innerHTML=`<span class="loading-spinner"></span> ${a("analyzing")}`);try{let c;switch(s){case"coma":c={ich:await Ne(r),lvo:null};break;case"limited":c={ich:await Pe(r),lvo:{notPossible:!0}};break;case"full":c=await Ie(r);break;default:throw new Error("Unknown module: "+s)}m.setResults(c),m.logEvent("models_complete",{module:s,results:c}),P("results")}catch(c){console.error("Error running models:",c);let d="An error occurred during analysis. Please try again.";c instanceof v&&(d=c.message),ze(t,d),o&&(o.disabled=!1,o.innerHTML=l)}}function ze(i,t){i.querySelectorAll(".critical-alert").forEach(n=>{var r,o;(o=(r=n.querySelector("h4"))==null?void 0:r.textContent)!=null&&o.includes("Error")&&n.remove()});const e=document.createElement("div");e.className="critical-alert",e.innerHTML=`<h4><span class="alert-icon">⚠️</span> Error</h4><p>${t}</p>`;const s=i.querySelector(".container");s?s.prepend(e):i.prepend(e),setTimeout(()=>e.remove(),1e4)}function Oe(i){const t=document.createElement("div");t.className="sr-only",t.setAttribute("role","status"),t.setAttribute("aria-live","polite");const e={triage1:"Coma assessment",triage2:"Examination capability assessment",coma:"Coma module",limited:"Limited data module",full:"Full stroke assessment",results:"Assessment results"};t.textContent=`Navigated to ${e[i]||i}`,document.body.appendChild(t),setTimeout(()=>t.remove(),1e3)}function Ge(i){const t={triage1:"Initial Assessment - Stroke Triage Assistant",triage2:"Examination Capability - Stroke Triage Assistant",coma:"Coma Module - Stroke Triage Assistant",limited:"Limited Data Module - Stroke Triage Assistant",full:"Full Stroke Module - Stroke Triage Assistant",results:"Assessment Results - Stroke Triage Assistant"};document.title=t[i]||"Stroke Triage Assistant"}function Ve(){setTimeout(()=>{const i=document.querySelector("h2");i&&(i.setAttribute("tabindex","-1"),i.focus(),setTimeout(()=>i.removeAttribute("tabindex"),100))},100)}class qe{constructor(){this.scores={facial_palsy:0,arm_weakness:0,speech_changes:0,eye_deviation:0,denial_neglect:0},this.onApply=null,this.modal=null}getTotal(){return Object.values(this.scores).reduce((t,e)=>t+e,0)}getRiskLevel(){return this.getTotal()>=4?"high":"low"}render(){const t=this.getTotal(),e=this.getRiskLevel();return`
      <div id="fastEdModal" class="modal" role="dialog" aria-labelledby="fastEdModalTitle" aria-hidden="true" style="display: none;">
        <div class="modal-content fast-ed-modal">
          <div class="modal-header">
            <h2 id="fastEdModalTitle">${a("fastEdCalculatorTitle")}</h2>
            <button class="modal-close" aria-label="Close">&times;</button>
          </div>
          <div class="modal-body">
            
            <!-- Facial Palsy -->
            <div class="fast-ed-component">
              <h3>${a("facialPalsyTitle")}</h3>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="facial_palsy" value="0" ${this.scores.facial_palsy===0?"checked":""}>
                  <span class="radio-label">${a("facialPalsyNormal")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="facial_palsy" value="1" ${this.scores.facial_palsy===1?"checked":""}>
                  <span class="radio-label">${a("facialPalsyMild")}</span>
                </label>
              </div>
            </div>

            <!-- Arm Weakness -->
            <div class="fast-ed-component">
              <h3>${a("armWeaknessTitle")}</h3>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="arm_weakness" value="0" ${this.scores.arm_weakness===0?"checked":""}>
                  <span class="radio-label">${a("armWeaknessNormal")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="arm_weakness" value="1" ${this.scores.arm_weakness===1?"checked":""}>
                  <span class="radio-label">${a("armWeaknessMild")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="arm_weakness" value="2" ${this.scores.arm_weakness===2?"checked":""}>
                  <span class="radio-label">${a("armWeaknessSevere")}</span>
                </label>
              </div>
            </div>

            <!-- Speech Changes -->
            <div class="fast-ed-component">
              <h3>${a("speechChangesTitle")}</h3>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="speech_changes" value="0" ${this.scores.speech_changes===0?"checked":""}>
                  <span class="radio-label">${a("speechChangesNormal")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="speech_changes" value="1" ${this.scores.speech_changes===1?"checked":""}>
                  <span class="radio-label">${a("speechChangesMild")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="speech_changes" value="2" ${this.scores.speech_changes===2?"checked":""}>
                  <span class="radio-label">${a("speechChangesSevere")}</span>
                </label>
              </div>
            </div>

            <!-- Eye Deviation -->
            <div class="fast-ed-component">
              <h3>${a("eyeDeviationTitle")}</h3>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="eye_deviation" value="0" ${this.scores.eye_deviation===0?"checked":""}>
                  <span class="radio-label">${a("eyeDeviationNormal")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="eye_deviation" value="1" ${this.scores.eye_deviation===1?"checked":""}>
                  <span class="radio-label">${a("eyeDeviationPartial")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="eye_deviation" value="2" ${this.scores.eye_deviation===2?"checked":""}>
                  <span class="radio-label">${a("eyeDeviationForced")}</span>
                </label>
              </div>
            </div>

            <!-- Denial/Neglect -->
            <div class="fast-ed-component">
              <h3>${a("denialNeglectTitle")}</h3>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="denial_neglect" value="0" ${this.scores.denial_neglect===0?"checked":""}>
                  <span class="radio-label">${a("denialNeglectNormal")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="denial_neglect" value="1" ${this.scores.denial_neglect===1?"checked":""}>
                  <span class="radio-label">${a("denialNeglectPartial")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="denial_neglect" value="2" ${this.scores.denial_neglect===2?"checked":""}>
                  <span class="radio-label">${a("denialNeglectComplete")}</span>
                </label>
              </div>
            </div>

            <!-- Total Score Display -->
            <div class="fast-ed-total">
              <div class="score-display">
                <h3>${a("totalScoreTitle")}: <span class="total-score">${t}/9</span></h3>
                <div class="risk-indicator ${e}">
                  ${a("riskLevel")}: ${a(e==="high"?"riskLevelHigh":"riskLevelLow")}
                </div>
              </div>
            </div>

          </div>
          <div class="modal-footer">
            <button class="secondary" data-action="cancel-fast-ed">${a("cancel")}</button>
            <button class="primary" data-action="apply-fast-ed">${a("applyScore")}</button>
          </div>
        </div>
      </div>
    `}setupEventListeners(){if(this.modal=document.getElementById("fastEdModal"),!this.modal)return;this.modal.addEventListener("change",n=>{if(n.target.type==="radio"){const r=n.target.name,o=parseInt(n.target.value);this.scores[r]=o,this.updateDisplay()}});const t=this.modal.querySelector(".modal-close");t==null||t.addEventListener("click",()=>this.close());const e=this.modal.querySelector('[data-action="cancel-fast-ed"]');e==null||e.addEventListener("click",()=>this.close());const s=this.modal.querySelector('[data-action="apply-fast-ed"]');s==null||s.addEventListener("click",()=>this.apply()),this.modal.addEventListener("click",n=>{n.target===this.modal&&this.close()}),document.addEventListener("keydown",n=>{var r;n.key==="Escape"&&((r=this.modal)!=null&&r.classList.contains("show"))&&this.close()})}updateDisplay(){var s,n;const t=(s=this.modal)==null?void 0:s.querySelector(".total-score"),e=(n=this.modal)==null?void 0:n.querySelector(".risk-indicator");if(t&&(t.textContent=`${this.getTotal()}/9`),e){const r=this.getRiskLevel();e.className=`risk-indicator ${r}`,e.textContent=`${a("riskLevel")}: ${a(r==="high"?"riskLevelHigh":"riskLevelLow")}`}}show(t=0,e=null){this.onApply=e,t>0&&t<=9&&this.approximateFromTotal(t),document.getElementById("fastEdModal")?(this.modal.remove(),document.body.insertAdjacentHTML("beforeend",this.render()),this.modal=document.getElementById("fastEdModal")):document.body.insertAdjacentHTML("beforeend",this.render()),this.setupEventListeners(),this.modal.style.display="flex",this.modal.classList.add("show"),this.modal.setAttribute("aria-hidden","false");const s=this.modal.querySelector('input[type="radio"]');s==null||s.focus()}close(){this.modal&&(this.modal.classList.remove("show"),this.modal.style.display="none",this.modal.setAttribute("aria-hidden","true"))}apply(){const t=this.getTotal(),e=this.scores.arm_weakness>0,s=this.scores.eye_deviation>0;this.onApply&&this.onApply({total:t,components:{...this.scores},armWeaknessBoolean:e,eyeDeviationBoolean:s}),this.close()}approximateFromTotal(t){this.scores={facial_palsy:0,arm_weakness:0,speech_changes:0,eye_deviation:0,denial_neglect:0};let e=t;const s=Object.keys(this.scores);for(const n of s){if(e<=0)break;const o=Math.min(e,n==="facial_palsy"?1:2);this.scores[n]=o,e-=o}}}const Ue=new qe;function $(i){const t=m.getState(),{currentScreen:e,results:s,startTime:n}=t;i.innerHTML="";let r="";switch(e){case"triage1":r=U();break;case"triage2":r=ie();break;case"coma":r=se();break;case"limited":r=ne();break;case"full":r=re();break;case"results":r=Ce(s);break;default:r=U()}i.innerHTML=r;const o=i.querySelector("form[data-module]");if(o){const l=o.dataset.module;Ke(o,l)}We(i),e==="results"&&s&&setTimeout(()=>{ke(s)},100),Oe(e),Ge(e),Ve()}function Ke(i,t){const e=m.getFormData(t);!e||Object.keys(e).length===0||Object.entries(e).forEach(([s,n])=>{const r=i.elements[s];r&&(r.type==="checkbox"?r.checked=n===!0||n==="on"||n==="true":r.value=n)})}function We(i){i.querySelectorAll('input[type="number"]').forEach(n=>{n.addEventListener("blur",()=>{Me(i)})}),i.querySelectorAll("[data-action]").forEach(n=>{n.addEventListener("click",r=>{const{action:o,value:l}=r.currentTarget.dataset,c=l==="true";switch(o){case"triage1":Re(c);break;case"triage2":Be(c);break;case"reset":xe();break;case"goBack":Fe();break;case"goHome":J();break}})}),i.querySelectorAll("form[data-module]").forEach(n=>{n.addEventListener("submit",r=>{He(r,i)})});const t=i.querySelector("#printResults");t&&t.addEventListener("click",()=>window.print());const e=i.querySelector("#fast_ed_score");e&&(e.addEventListener("click",n=>{n.preventDefault();const r=parseInt(e.value)||0;Ue.show(r,o=>{e.value=o.total;const l=i.querySelector("#armparese_hidden");l&&(l.value=o.armWeaknessBoolean?"true":"false");const c=i.querySelector("#eye_deviation");c&&(c.checked=o.eyeDeviationBoolean),e.dispatchEvent(new Event("change",{bubbles:!0}))})}),e.addEventListener("keydown",n=>{n.preventDefault()})),i.querySelectorAll(".info-toggle").forEach(n=>{n.addEventListener("click",r=>{const o=n.dataset.target,l=i.querySelector(`#${o}`),c=n.querySelector(".toggle-arrow");l&&(l.style.display!=="none"?(l.style.display="none",l.classList.remove("show"),n.classList.remove("active"),c.style.transform="rotate(0deg)"):(l.style.display="block",l.classList.add("show"),n.classList.add("active"),c.style.transform="rotate(180deg)"))})})}class je{constructor(){this.container=null,this.unsubscribe=null}async init(){if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",()=>this.init());return}if(this.container=document.getElementById("appContainer"),!this.container){console.error("App container not found");return}this.unsubscribe=m.subscribe(()=>{$(this.container)}),window.addEventListener("languageChanged",()=>{this.updateUILanguage(),$(this.container)}),this.setupGlobalEventListeners(),this.initializeTheme(),this.updateUILanguage(),this.startAutoSave(),this.setupSessionTimeout(),this.setCurrentYear(),this.registerServiceWorker(),$(this.container),console.log("Stroke Triage Assistant initialized")}setupGlobalEventListeners(){const t=document.getElementById("languageToggle");t&&t.addEventListener("click",()=>this.toggleLanguage());const e=document.getElementById("darkModeToggle");e&&e.addEventListener("click",()=>this.toggleDarkMode()),this.setupHelpModal(),this.setupFooterLinks(),document.addEventListener("keydown",s=>{if(s.key==="Escape"){const n=document.getElementById("helpModal");n&&n.classList.contains("show")&&(n.classList.remove("show"),n.style.display="none",n.setAttribute("aria-hidden","true"))}}),window.addEventListener("beforeunload",s=>{m.hasUnsavedData()&&(s.preventDefault(),s.returnValue="You have unsaved data. Are you sure you want to leave?")})}setupHelpModal(){const t=document.getElementById("helpButton"),e=document.getElementById("helpModal"),s=e==null?void 0:e.querySelector(".modal-close");if(t&&e){e.classList.remove("show"),e.style.display="none",e.setAttribute("aria-hidden","true"),t.addEventListener("click",()=>{e.style.display="flex",e.classList.add("show"),e.setAttribute("aria-hidden","false")});const n=()=>{e.classList.remove("show"),e.style.display="none",e.setAttribute("aria-hidden","true")};s==null||s.addEventListener("click",n),e.addEventListener("click",r=>{r.target===e&&n()})}}setupFooterLinks(){var t,e;(t=document.getElementById("privacyLink"))==null||t.addEventListener("click",s=>{s.preventDefault(),this.showPrivacyPolicy()}),(e=document.getElementById("disclaimerLink"))==null||e.addEventListener("click",s=>{s.preventDefault(),this.showDisclaimer()})}initializeTheme(){const t=localStorage.getItem("theme"),e=document.getElementById("darkModeToggle");(t==="dark"||!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)&&(document.body.classList.add("dark-mode"),e&&(e.textContent="☀️"))}toggleLanguage(){C.toggleLanguage(),this.updateUILanguage()}updateUILanguage(){document.documentElement.lang=C.getCurrentLanguage();const t=document.querySelector(".app-header h1");t&&(t.textContent=a("appTitle"));const e=document.querySelector(".emergency-badge");e&&(e.textContent=a("emergencyBadge"));const s=document.getElementById("languageToggle");s&&(s.title=a("languageToggle"),s.setAttribute("aria-label",a("languageToggle")));const n=document.getElementById("helpButton");n&&(n.title=a("helpButton"),n.setAttribute("aria-label",a("helpButton")));const r=document.getElementById("darkModeToggle");r&&(r.title=a("darkModeButton"),r.setAttribute("aria-label",a("darkModeButton")));const o=document.getElementById("modalTitle");o&&(o.textContent=a("helpTitle"))}toggleDarkMode(){const t=document.getElementById("darkModeToggle");document.body.classList.toggle("dark-mode");const e=document.body.classList.contains("dark-mode");t&&(t.textContent=e?"☀️":"🌙"),localStorage.setItem("theme",e?"dark":"light")}startAutoSave(){setInterval(()=>{this.saveCurrentFormData()},A.autoSaveInterval)}saveCurrentFormData(){this.container.querySelectorAll("form[data-module]").forEach(e=>{const s=new FormData(e),n=e.dataset.module;if(n){const r={};s.forEach((c,d)=>{const p=e.elements[d];p&&p.type==="checkbox"?r[d]=p.checked:r[d]=c});const o=m.getFormData(n);JSON.stringify(o)!==JSON.stringify(r)&&m.setFormData(n,r)}})}setupSessionTimeout(){setTimeout(()=>{confirm("Your session has been idle for 30 minutes. Would you like to continue?")?this.setupSessionTimeout():m.reset()},A.sessionTimeout)}setCurrentYear(){const t=document.getElementById("currentYear");t&&(t.textContent=new Date().getFullYear())}showPrivacyPolicy(){alert("Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.")}showDisclaimer(){alert("Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.")}async registerServiceWorker(){if(!("serviceWorker"in navigator)){console.log("Service Workers not supported");return}try{const t=await navigator.serviceWorker.register("/0825/sw.js",{scope:"/0825/"});console.log("Service Worker registered successfully:",t),t.addEventListener("updatefound",()=>{const e=t.installing;console.log("New service worker found"),e.addEventListener("statechange",()=>{e.state==="installed"&&navigator.serviceWorker.controller&&(console.log("New service worker installed, update available"),this.showUpdateNotification())})}),navigator.serviceWorker.addEventListener("message",e=>{console.log("Message from service worker:",e.data)})}catch(t){console.error("Service Worker registration failed:",t)}}showUpdateNotification(){const t=document.createElement("div");t.className="modal show update-modal",t.style.cssText=`
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
    `;const e=document.createElement("div");e.className="modal-content",e.style.cssText=`
      background-color: var(--container-bg);
      padding: 30px;
      border-radius: 16px;
      max-width: 400px;
      box-shadow: var(--shadow-lg);
      text-align: center;
      animation: slideUp 0.3s ease;
    `,e.innerHTML=`
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
    `,t.appendChild(e),document.body.appendChild(t);const s=t.querySelector("#updateNow"),n=t.querySelector("#updateLater");s.addEventListener("click",()=>{window.location.reload()}),n.addEventListener("click",()=>{t.remove(),setTimeout(()=>this.showUpdateNotification(),5*60*1e3)}),t.addEventListener("click",r=>{r.target===t&&n.click()})}destroy(){this.unsubscribe&&this.unsubscribe()}}const Ye=new je;Ye.init();
//# sourceMappingURL=index-DiFycUyZ.js.map
