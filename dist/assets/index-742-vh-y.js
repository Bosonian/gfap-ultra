(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function e(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(n){if(n.ep)return;n.ep=!0;const o=e(n);fetch(n.href,o)}})();class X{constructor(){this.state={currentScreen:"triage1",results:null,sessionId:null,startTime:null,formData:{},validationErrors:{},screenHistory:[]},this.listeners=new Set,this.initialize()}initialize(){this.state.sessionId=this.generateSessionId(),this.state.startTime=Date.now(),console.log("Store initialized with session:",this.state.sessionId)}generateSessionId(){return"session_"+Date.now()+"_"+Math.random().toString(36).substr(2,9)}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}notify(){this.listeners.forEach(t=>t(this.state))}getState(){return{...this.state}}setState(t){this.state={...this.state,...t},this.notify()}navigate(t){console.log(`Navigating from ${this.state.currentScreen} to ${t}`);const e=[...this.state.screenHistory];this.state.currentScreen!==t&&!e.includes(this.state.currentScreen)&&e.push(this.state.currentScreen),this.setState({currentScreen:t,screenHistory:e})}goBack(){const t=[...this.state.screenHistory];if(console.log("goBack() - current history:",t),console.log("goBack() - current screen:",this.state.currentScreen),t.length>0){const e=t.pop();return console.log("goBack() - navigating to:",e),this.setState({currentScreen:e,screenHistory:t}),!0}return console.log("goBack() - no history available"),!1}goHome(){this.setState({currentScreen:"triage1",screenHistory:[]})}setFormData(t,e){const a={...this.state.formData};a[t]={...e},this.setState({formData:a})}getFormData(t){return this.state.formData[t]||{}}setValidationErrors(t){this.setState({validationErrors:t})}clearValidationErrors(){this.setState({validationErrors:{}})}setResults(t){this.setState({results:t})}hasUnsavedData(){return Object.keys(this.state.formData).length>0&&!this.state.results}reset(){const t={currentScreen:"triage1",results:null,sessionId:this.generateSessionId(),startTime:Date.now(),formData:{},validationErrors:{},screenHistory:[]};this.setState(t),console.log("Store reset with new session:",t.sessionId)}logEvent(t,e={}){const a={timestamp:Date.now(),session:this.state.sessionId,event:t,data:e};console.log("Event:",a)}getSessionDuration(){return Date.now()-this.state.startTime}}const u=new X;function b(i){const t=[{id:1,label:"Triage"},{id:2,label:"Assessment"},{id:3,label:"Results"}];let e='<div class="progress-indicator">';return t.forEach((a,n)=>{const o=a.id===i,r=a.id<i;e+=`
      <div class="progress-step ${o?"active":""} ${r?"completed":""}">
        ${r?"":a.id}
      </div>
    `,n<t.length-1&&(e+=`<div class="progress-line ${r?"completed":""}"></div>`)}),e+="</div>",e}const F={en:{appTitle:"iGFAP",emergencyBadge:"Emergency Tool",helpButton:"Help and Instructions",darkModeButton:"Toggle dark mode",languageToggle:"Language",step1:"Initial Assessment",step2:"Data Collection",step3:"Results",comaModuleTitle:"Coma Module",limitedDataModuleTitle:"Limited Data Module",fullStrokeModuleTitle:"Full Stroke Module",triage1Title:"Patient Assessment",triage1Question:"Is the patient comatose?",triage1Help:"Glasgow Coma Scale < 8",triage1Yes:"YES - Comatose",triage1No:"NO - Conscious",triage2Title:"Examination Capability",triage2Question:"Can the patient be reliably examined?",triage2Help:"Patient is not aphasic, confused, or uncooperative",triage2Yes:"YES - Full Exam Possible",triage2No:"NO - Limited Exam Only",ageLabel:"Age (years)",ageHelp:"Patient age in years",systolicLabel:"Systolic BP (mmHg)",systolicHelp:"Systolic blood pressure",diastolicLabel:"Diastolic BP (mmHg)",diastolicHelp:"Diastolic blood pressure",gfapLabel:"GFAP Value (pg/mL)",gfapHelp:"GFAP biomarker level",fastEdLabel:"FAST-ED Score",fastEdHelp:"FAST-ED assessment score (0-9)",headacheLabel:"Headache",vigilanzLabel:"Reduced consciousness",armPareseLabel:"Arm weakness",beinPareseLabel:"Leg weakness",eyeDeviationLabel:"Eye deviation",atrialFibLabel:"Atrial fibrillation",anticoagLabel:"Anticoagulated (NOAK)",antiplateletsLabel:"Antiplatelets",analyzeButton:"Analyze",analyzing:"Analyzing...",printResults:"Print Results",newAssessment:"Start New Assessment",startOver:"Start Over",goBack:"Go Back",goHome:"Go Home",basicInformation:"Basic Information",biomarkersScores:"Biomarkers & Scores",clinicalSymptoms:"Clinical Symptoms",medicalHistory:"Medical History",ageYearsLabel:"Age (years)",systolicBpLabel:"Systolic BP (mmHg)",diastolicBpLabel:"Diastolic BP (mmHg)",gfapValueLabel:"GFAP Value (pg/mL)",fastEdScoreLabel:"FAST-ED Score",ageYearsHelp:"Patient's age in years",systolicBpHelp:"Normal: 90-140 mmHg",diastolicBpHelp:"Normal: 60-90 mmHg",gfapTooltip:"Brain injury biomarker",gfapTooltipLong:"Glial Fibrillary Acidic Protein - Brain injury biomarker",gfapRange:"Range: {min} - {max} pg/mL",fastEdTooltip:"0-9 scale for LVO screening",analyzeIchRisk:"Analyze ICH Risk",analyzeStrokeRisk:"Analyze Stroke Risk",criticalPatient:"Critical Patient",comaAlert:"Patient is comatose (GCS < 8). Rapid assessment required.",vigilanceReduction:"Vigilance Reduction (Decreased alertness)",armParesis:"Arm Paresis",legParesis:"Leg Paresis",eyeDeviation:"Eye Deviation",atrialFibrillation:"Atrial Fibrillation",onNoacDoac:"On NOAC/DOAC",onAntiplatelets:"On Antiplatelets",resultsTitle:"Assessment Results",bleedingRiskAssessment:"Bleeding Risk Assessment",ichProbability:"ICH Probability",lvoProbability:"LVO Probability",lvoMayBePossible:"Large vessel occlusion possible - further evaluation recommended",riskFactorsTitle:"Main Risk Factors",increasingRisk:"Increasing Risk",decreasingRisk:"Decreasing Risk",noFactors:"No factors",riskLevel:"Risk Level",lowRisk:"Low Risk",mediumRisk:"Medium Risk",highRisk:"High Risk",riskLow:"Low",riskMedium:"Medium",riskHigh:"High",driversTitle:"Model Drivers",driversSubtitle:"Factors contributing to the prediction",riskFactors:"Risk Factors",increaseRisk:"INCREASE",decreaseRisk:"DECREASE",noPositiveFactors:"No increasing factors",noNegativeFactors:"No decreasing factors",ichDrivers:"ICH Risk Factors",lvoDrivers:"LVO Risk Factors",criticalAlertTitle:"CRITICAL RISK DETECTED",criticalAlertMessage:"High probability of intracerebral hemorrhage detected. Immediate medical attention required.",immediateActionsRequired:"Immediate actions required",initiateStrokeProtocol:"Initiate stroke protocol immediately",urgentCtImaging:"Urgent CT imaging required",considerBpManagement:"Consider blood pressure management",prepareNeurosurgicalConsult:"Prepare for potential neurosurgical consultation",helpTitle:"Quick Reference Guide",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 8: Comatose patient - use Coma Module",gcsMod:"GCS 8-12: Moderate impairment",gcsHigh:"GCS 13-15: Mild impairment",fastEdTitle:"FAST-ED Score Components",fastEdFacial:"Facial Palsy: 0-1 points",fastEdArm:"Arm Weakness: 0-2 points",fastEdSpeech:"Speech Changes: 0-2 points",fastEdTime:"Time: Critical factor",fastEdEye:"Eye Deviation: 0-2 points",fastEdDenial:"Denial/Neglect: 0-2 points",criticalValuesTitle:"Critical Values",criticalBp:"Systolic BP > 180: Increased ICH risk",criticalGfap:"GFAP > 500 pg/mL: Significant marker",criticalFastEd:"FAST-ED ≥ 4: Consider LVO",fastEdCalculatorTitle:"FAST-ED Score Calculator",fastEdCalculatorSubtitle:"Click to calculate FAST-ED score components",facialPalsyTitle:"Facial Palsy",facialPalsyNormal:"Normal (0)",facialPalsyMild:"Mild drooping (1)",armWeaknessTitle:"Arm Weakness",armWeaknessNormal:"Normal (0)",armWeaknessMild:"Mild drift (1)",armWeaknessSevere:"Falls immediately (2)",speechChangesTitle:"Speech Changes",speechChangesNormal:"Normal (0)",speechChangesMild:"Slurred speech (1)",speechChangesSevere:"Severe aphasia (2)",eyeDeviationTitle:"Eye Deviation",eyeDeviationNormal:"Normal (0)",eyeDeviationPartial:"Partial gaze palsy (1)",eyeDeviationForced:"Forced deviation (2)",denialNeglectTitle:"Denial/Neglect",denialNeglectNormal:"Normal (0)",denialNeglectPartial:"Partial neglect (1)",denialNeglectComplete:"Complete neglect (2)",totalScoreTitle:"Total FAST-ED Score",riskLevel:"Risk Level",riskLevelLow:"LOW (Score <4)",riskLevelHigh:"HIGH (Score ≥4 - Consider LVO)",applyScore:"Apply Score",cancel:"Cancel",modelDrivers:"Model Drivers",modelDriversSubtitle:"Factors contributing to the prediction",contributingFactors:"Contributing factors",factorsShown:"shown",positiveFactors:"Positive factors",negativeFactors:"Negative factors",clinicalInformation:"Clinical Information",clinicalRecommendations:"Clinical Recommendations",clinicalRec1:"Consider immediate imaging if ICH risk is high",clinicalRec2:"Activate stroke team for LVO scores ≥ 50%",clinicalRec3:"Monitor blood pressure closely",clinicalRec4:"Document all findings thoroughly",noDriverData:"No driver data available",driverAnalysisUnavailable:"Driver analysis unavailable",driverInfoNotAvailable:"Driver information not available from this prediction model",driverAnalysisNotAvailable:"Driver analysis not available for this prediction",lvoNotPossible:"LVO assessment not possible with limited data",fullExamRequired:"Full neurological examination required for LVO screening",limitedAssessment:"Limited Assessment",disclaimer:"Clinical Disclaimer",disclaimerText:"This tool is for clinical decision support only. Always use clinical judgment and follow local protocols. Not a replacement for physician assessment.",importantNote:"Important",importantText:"These results are for clinical decision support only. Always use clinical judgment and follow institutional protocols.",inputSummaryTitle:"Input Summary",inputSummarySubtitle:"Values used for this analysis",privacyLink:"Privacy Policy",disclaimerLink:"Medical Disclaimer",versionLink:"Version 2.0.1",privacyPolicy:"Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.",medicalDisclaimer:"Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.",networkError:"Network error - please check your connection and try again",requestTimeout:"Request timeout - please try again",apiError:"Failed to get results",validationError:"Please check your input values",sessionTimeout:"Your session has been idle for 30 minutes. Would you like to continue?",unsavedData:"You have unsaved data. Are you sure you want to leave?",nearestCentersTitle:"Nearest Stroke Centers",useCurrentLocation:"Use Current Location",enterLocationPlaceholder:"Enter city or address...",enterManually:"Enter Location Manually",search:"Search",yourLocation:"Your Location",recommendedCenters:"Recommended Centers",alternativeCenters:"Alternative Centers",noCentersFound:"No stroke centers found in this area",gettingLocation:"Getting your location",searchingLocation:"Searching location",locationError:"Unable to get your location",locationPermissionDenied:"Location access denied. Please allow location access and try again.",locationUnavailable:"Location information is unavailable",locationTimeout:"Location request timed out",geolocationNotSupported:"Geolocation is not supported by this browser",geocodingNotImplemented:"Location search not available. Please use GPS or enter coordinates manually.",tryManualEntry:"Try entering your location manually or use GPS.",distanceNote:"Distances are calculated as straight-line distances. Actual travel times may vary.",travelTimeNote:"Travel times calculated for emergency vehicles with sirens and priority routing.",calculatingTravelTimes:"Calculating travel times",minutes:"min",poweredByOrs:"Travel times powered by OpenRoute Service",comprehensiveCenter:"Comprehensive Stroke Center",primaryCenter:"Primary Stroke Center",telemetryCenter:"Telemedicine Center",thrombectomy:"Thrombectomy",neurosurgery:"Neurosurgery",icu:"Intensive Care",telemedicine:"Telemedicine",stroke_unit:"Stroke Unit",call:"Call",directions:"Directions",emergency:"Emergency",certified:"Certified"},de:{appTitle:"iGFAP",emergencyBadge:"Notfall-Tool",helpButton:"Hilfe und Anweisungen",darkModeButton:"Dunklen Modus umschalten",languageToggle:"Sprache",step1:"Erstbeurteilung",step2:"Datenerhebung",step3:"Ergebnisse",comaModuleTitle:"Koma-Modul",limitedDataModuleTitle:"Begrenzte Daten Modul",fullStrokeModuleTitle:"Vollständiges Schlaganfall-Modul",triage1Title:"Patientenbeurteilung",triage1Question:"Ist der Patient komatös?",triage1Help:"Glasgow Coma Scale < 8",triage1Yes:"JA - Komatös",triage1No:"NEIN - Bei Bewusstsein",triage2Title:"Untersuchungsfähigkeit",triage2Question:"Kann der Patient zuverlässig untersucht werden?",triage2Help:"Patient ist nicht aphasisch, verwirrt oder unkooperativ",triage2Yes:"JA - Vollständige Untersuchung möglich",triage2No:"NEIN - Nur begrenzte Untersuchung",ageLabel:"Alter (Jahre)",ageHelp:"Patientenalter in Jahren",systolicLabel:"Systolischer RR (mmHg)",systolicHelp:"Systolischer Blutdruck",diastolicLabel:"Diastolischer RR (mmHg)",diastolicHelp:"Diastolischer Blutdruck",gfapLabel:"GFAP-Wert (pg/mL)",gfapHelp:"GFAP-Biomarker-Wert",fastEdLabel:"FAST-ED-Score",fastEdHelp:"FAST-ED-Bewertungsscore (0-9)",headacheLabel:"Kopfschmerzen",vigilanzLabel:"Bewusstseinstrübung",armPareseLabel:"Armschwäche",beinPareseLabel:"Beinschwäche",eyeDeviationLabel:"Blickdeviation",atrialFibLabel:"Vorhofflimmern",anticoagLabel:"Antikoaguliert (NOAK)",antiplateletsLabel:"Thrombozytenaggregationshemmer",analyzeButton:"Analysieren",analyzing:"Analysiere...",printResults:"Ergebnisse drucken",newAssessment:"Neue Bewertung starten",startOver:"Von vorn beginnen",goBack:"Zurück",goHome:"Zur Startseite",basicInformation:"Grundinformationen",biomarkersScores:"Biomarker & Scores",clinicalSymptoms:"Klinische Symptome",medicalHistory:"Anamnese",ageYearsLabel:"Alter (Jahre)",systolicBpLabel:"Systolischer RR (mmHg)",diastolicBpLabel:"Diastolischer RR (mmHg)",gfapValueLabel:"GFAP-Wert (pg/mL)",fastEdScoreLabel:"FAST-ED-Score",ageYearsHelp:"Patientenalter in Jahren",systolicBpHelp:"Normal: 90-140 mmHg",diastolicBpHelp:"Normal: 60-90 mmHg",gfapTooltip:"Hirnverletzungs-Biomarker",gfapTooltipLong:"Glial Fibrillary Acidic Protein - Hirnverletzungs-Biomarker",gfapRange:"Bereich: {min} - {max} pg/mL",fastEdTooltip:"0-9 Skala für LVO-Screening",analyzeIchRisk:"ICB-Risiko analysieren",analyzeStrokeRisk:"Schlaganfall-Risiko analysieren",criticalPatient:"Kritischer Patient",comaAlert:"Patient ist komatös (GCS < 8). Schnelle Beurteilung erforderlich.",vigilanceReduction:"Vigilanzminderung (Verminderte Wachheit)",armParesis:"Armparese",legParesis:"Beinparese",eyeDeviation:"Blickdeviation",atrialFibrillation:"Vorhofflimmern",onNoacDoac:"NOAK/DOAK-Therapie",onAntiplatelets:"Thrombozytenaggregationshemmer",resultsTitle:"Bewertungsergebnisse",bleedingRiskAssessment:"Blutungsrisiko-Bewertung",ichProbability:"ICB-Wahrscheinlichkeit",lvoProbability:"LVO-Wahrscheinlichkeit",lvoMayBePossible:"Großgefäßverschluss möglich - weitere Abklärung empfohlen",riskFactorsTitle:"Hauptrisikofaktoren",increasingRisk:"Risikoerhöhend",decreasingRisk:"Risikomindernd",noFactors:"Keine Faktoren",riskLevel:"Risikostufe",lowRisk:"Niedriges Risiko",mediumRisk:"Mittleres Risiko",highRisk:"Hohes Risiko",riskLow:"Niedrig",riskMedium:"Mittel",riskHigh:"Hoch",driversTitle:"Modelltreiber",driversSubtitle:"Faktoren, die zur Vorhersage beitragen",riskFactors:"Risikofaktoren",increaseRisk:"ERHÖHEN",decreaseRisk:"VERRINGERN",noPositiveFactors:"Keine erhöhenden Faktoren",noNegativeFactors:"Keine verringernden Faktoren",ichDrivers:"ICB-Risikofaktoren",lvoDrivers:"LVO-Risikofaktoren",criticalAlertTitle:"KRITISCHES RISIKO ERKANNT",criticalAlertMessage:"Hohe Wahrscheinlichkeit einer intrazerebralen Blutung erkannt. Sofortige medizinische Behandlung erforderlich.",immediateActionsRequired:"Sofortige Maßnahmen erforderlich",initiateStrokeProtocol:"Schlaganfall-Protokoll sofort einleiten",urgentCtImaging:"Dringende CT-Bildgebung erforderlich",considerBpManagement:"Blutdruckmanagement erwägen",prepareNeurosurgicalConsult:"Neurochirurgische Konsultation vorbereiten",helpTitle:"Kurzreferenzleitfaden",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 8: Komatöser Patient - Koma-Modul verwenden",gcsMod:"GCS 8-12: Mäßige Beeinträchtigung",gcsHigh:"GCS 13-15: Leichte Beeinträchtigung",fastEdTitle:"FAST-ED-Score-Komponenten",fastEdFacial:"Faziale Parese: 0-1 Punkte",fastEdArm:"Armschwäche: 0-2 Punkte",fastEdSpeech:"Sprachveränderungen: 0-2 Punkte",fastEdTime:"Zeit: Kritischer Faktor",fastEdEye:"Blickdeviation: 0-2 Punkte",fastEdDenial:"Verneinung/Neglect: 0-2 Punkte",criticalValuesTitle:"Kritische Werte",criticalBp:"Systolischer RR > 180: Erhöhtes ICB-Risiko",criticalGfap:"GFAP > 500 pg/mL: Signifikanter Marker",criticalFastEd:"FAST-ED ≥ 4: LVO in Betracht ziehen",fastEdCalculatorTitle:"FAST-ED-Score-Rechner",fastEdCalculatorSubtitle:"Klicken Sie, um FAST-ED-Score-Komponenten zu berechnen",facialPalsyTitle:"Fazialisparese",facialPalsyNormal:"Nein (0)",facialPalsyMild:"Ja (1)",armWeaknessTitle:"Armschwäche",armWeaknessNormal:"Normal (0)",armWeaknessMild:"Leichter Armabfall (1)",armWeaknessSevere:"Arm fällt sofort ab (2)",speechChangesTitle:"Sprachveränderungen",speechChangesNormal:"Normal (0)",speechChangesMild:"Verwaschene Sprache (1)",speechChangesSevere:"Schwere Aphasie (2)",eyeDeviationTitle:"Blickdeviation",eyeDeviationNormal:"Normal (0)",eyeDeviationPartial:"Partielle Blickparese (1)",eyeDeviationForced:"Forcierte Blickdeviation (2)",denialNeglectTitle:"Verneinung/Neglect",denialNeglectNormal:"Normal (0)",denialNeglectPartial:"Partieller Neglect (1)",denialNeglectComplete:"Kompletter Neglect (2)",totalScoreTitle:"Gesamt-FAST-ED-Score",riskLevel:"Risikostufe",riskLevelLow:"NIEDRIG (Score <4)",riskLevelHigh:"HOCH (Score ≥4 - LVO erwägen)",applyScore:"Score Anwenden",cancel:"Abbrechen",modelDrivers:"Modelltreiber",modelDriversSubtitle:"Faktoren, die zur Vorhersage beitragen",contributingFactors:"Beitragende Faktoren",factorsShown:"angezeigt",positiveFactors:"Positive Faktoren",negativeFactors:"Negative Faktoren",clinicalInformation:"Klinische Informationen",clinicalRecommendations:"Klinische Empfehlungen",clinicalRec1:"Sofortige Bildgebung erwägen bei hohem ICB-Risiko",clinicalRec2:"Stroke-Team aktivieren bei LVO-Score ≥ 50%",clinicalRec3:"Blutdruck engmaschig überwachen",clinicalRec4:"Alle Befunde gründlich dokumentieren",noDriverData:"Keine Treiberdaten verfügbar",driverAnalysisUnavailable:"Treiberanalyse nicht verfügbar",driverInfoNotAvailable:"Treiberinformationen von diesem Vorhersagemodell nicht verfügbar",driverAnalysisNotAvailable:"Treiberanalyse für diese Vorhersage nicht verfügbar",lvoNotPossible:"LVO-Bewertung mit begrenzten Daten nicht möglich",fullExamRequired:"Vollständige neurologische Untersuchung für LVO-Screening erforderlich",limitedAssessment:"Begrenzte Bewertung",disclaimer:"Klinischer Haftungsausschluss",disclaimerText:"Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle. Kein Ersatz für ärztliche Beurteilung.",importantNote:"Wichtig",importantText:"Diese Ergebnisse dienen nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie institutionelle Protokolle.",inputSummaryTitle:"Eingabezusammenfassung",inputSummarySubtitle:"Für diese Analyse verwendete Werte",privacyLink:"Datenschutzrichtlinie",disclaimerLink:"Medizinischer Haftungsausschluss",versionLink:"Version 2.0.1",privacyPolicy:"Datenschutzrichtlinie: Dieses Tool verarbeitet Daten lokal. Keine Patientendaten werden gespeichert oder übertragen.",medicalDisclaimer:"Medizinischer Haftungsausschluss: Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle.",networkError:"Netzwerkfehler - bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut",requestTimeout:"Anfrage-Timeout - bitte versuchen Sie es erneut",apiError:"Ergebnisse konnten nicht abgerufen werden",validationError:"Bitte überprüfen Sie Ihre Eingabewerte",sessionTimeout:"Ihre Sitzung war 30 Minuten lang inaktiv. Möchten Sie fortfahren?",unsavedData:"Sie haben ungespeicherte Daten. Sind Sie sicher, dass Sie verlassen möchten?",nearestCentersTitle:"Nächstgelegene Schlaganfall-Zentren",useCurrentLocation:"Aktuellen Standort verwenden",enterLocationPlaceholder:"Stadt oder Adresse eingeben...",enterManually:"Standort manuell eingeben",search:"Suchen",yourLocation:"Ihr Standort",recommendedCenters:"Empfohlene Zentren",alternativeCenters:"Alternative Zentren",noCentersFound:"Keine Schlaganfall-Zentren in diesem Bereich gefunden",gettingLocation:"Standort wird ermittelt",searchingLocation:"Standort wird gesucht",locationError:"Standort konnte nicht ermittelt werden",locationPermissionDenied:"Standortzugriff verweigert. Bitte erlauben Sie Standortzugriff und versuchen Sie es erneut.",locationUnavailable:"Standortinformationen sind nicht verfügbar",locationTimeout:"Standortanfrage ist abgelaufen",geolocationNotSupported:"Geolokalisierung wird von diesem Browser nicht unterstützt",geocodingNotImplemented:"Standortsuche nicht verfügbar. Bitte verwenden Sie GPS oder geben Sie Koordinaten manuell ein.",tryManualEntry:"Versuchen Sie, Ihren Standort manuell einzugeben oder GPS zu verwenden.",distanceNote:"Entfernungen werden als Luftlinie berechnet. Tatsächliche Fahrzeiten können variieren.",travelTimeNote:"Fahrzeiten berechnet für Rettungsfahrzeuge mit Sondersignalen und Vorfahrtsberechtigung.",calculatingTravelTimes:"Fahrzeiten werden berechnet",minutes:"Min",poweredByOrs:"Fahrzeiten bereitgestellt von OpenRoute Service",comprehensiveCenter:"Überregionales Schlaganfall-Zentrum",primaryCenter:"Regionales Schlaganfall-Zentrum",telemetryCenter:"Telemedizin-Zentrum",thrombectomy:"Thrombektomie",neurosurgery:"Neurochirurgie",icu:"Intensivstation",telemedicine:"Telemedizin",stroke_unit:"Stroke Unit",call:"Anrufen",directions:"Wegbeschreibung",emergency:"Notfall",certified:"Zertifiziert"}};class ee{constructor(){this.supportedLanguages=["en","de"],this.currentLanguage=this.detectLanguage()}detectLanguage(){const t=localStorage.getItem("language");return t&&this.supportedLanguages.includes(t)?t:(navigator.language||navigator.userLanguage).substring(0,2).toLowerCase()==="de"?"de":"en"}getCurrentLanguage(){return this.currentLanguage}setLanguage(t){return this.supportedLanguages.includes(t)?(this.currentLanguage=t,localStorage.setItem("language",t),window.dispatchEvent(new CustomEvent("languageChanged",{detail:{language:t}})),!0):!1}getSupportedLanguages(){return[...this.supportedLanguages]}t(t){return(F[this.currentLanguage]||F.en)[t]||t}toggleLanguage(){const t=this.currentLanguage==="en"?"de":"en";return this.setLanguage(t)}getLanguageDisplayName(t=null){const e=t||this.currentLanguage;return{en:"English",de:"Deutsch"}[e]||e}formatDateTime(t){const e=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(e,{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(t)}formatTime(t){const e=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(e,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(t)}}const S=new ee,s=i=>S.t(i);function B(){return`
    <div class="container">
      ${b(1)}
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
  `}function te(){return`
    <div class="container">
      ${b(1)}
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
  `}const v={COMA_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_coma_ich",LDM_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_limited_data_ich",FULL_STROKE:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_full_stroke"},D={ich:{medium:25,high:50},lvo:{medium:25,high:50}},g={min:29,max:10001},I={autoSaveInterval:18e4,sessionTimeout:30*60*1e3,requestTimeout:1e4},ie={age_years:{required:!0,min:0,max:120},systolic_bp:{required:!0,min:60,max:300},diastolic_bp:{required:!0,min:30,max:200},gfap_value:{required:!0,min:g.min,max:g.max},fast_ed_score:{required:!0,min:0,max:9}};function ae(){return`
    <div class="container">
      ${b(2)}
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
  `}function se(){return`
    <div class="container">
      ${b(2)}
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
  `}function ne(){return`
    <div class="container">
      ${b(2)}
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
            <input type="hidden" name="eye_deviation" id="eye_deviation_hidden" value="false">
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
  `}function V(){return`
    <div class="critical-alert">
      <h4><span class="alert-icon">🚨</span> ${s("criticalAlertTitle")}</h4>
      <p>${s("criticalAlertMessage")}</p>
      <p><strong>${s("immediateActionsRequired")}:</strong></p>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>${s("initiateStrokeProtocol")}</li>
        <li>${s("urgentCtImaging")}</li>
        <li>${s("considerBpManagement")}</li>
        <li>${s("prepareNeurosurgicalConsult")}</li>
      </ul>
    </div>
  `}const U=[{id:"klinikum-grosshadern-muenchen",name:"LMU Klinikum München - Großhadern",type:"comprehensive",address:"Marchioninistraße 15, 81377 München",coordinates:{lat:48.1106,lng:11.4684},phone:"+49 89 4400-0",emergency:"+49 89 4400-73331",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-08-01"},{id:"klinikum-rechts-der-isar-muenchen",name:"Klinikum rechts der Isar München (TUM)",type:"comprehensive",address:"Ismaninger Str. 22, 81675 München",coordinates:{lat:48.1497,lng:11.6052},phone:"+49 89 4140-0",emergency:"+49 89 4140-2249",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-08-01"},{id:"klinikum-schwabing-muenchen",name:"Städtisches Klinikum München Schwabing",type:"comprehensive",address:"Kölner Platz 1, 80804 München",coordinates:{lat:48.1732,lng:11.5755},phone:"+49 89 3068-0",emergency:"+49 89 3068-2050",services:["thrombectomy","neurosurgery","icu"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-08-01"},{id:"klinikum-bogenhausen-muenchen",name:"Städtisches Klinikum München Bogenhausen",type:"comprehensive",address:"Englschalkinger Str. 77, 81925 München",coordinates:{lat:48.1614,lng:11.6254},phone:"+49 89 9270-0",emergency:"+49 89 9270-2050",services:["thrombectomy","neurosurgery","icu"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-08-01"},{id:"uniklinikum-erlangen",name:"Universitätsklinikum Erlangen",type:"comprehensive",address:"Maximiliansplatz 2, 91054 Erlangen",coordinates:{lat:49.5982,lng:11.0037},phone:"+49 9131 85-0",emergency:"+49 9131 85-39003",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-08-01"},{id:"uniklinikum-regensburg",name:"Universitätsklinikum Regensburg",type:"comprehensive",address:"Franz-Josef-Strauß-Allee 11, 93053 Regensburg",coordinates:{lat:49.0134,lng:12.0991},phone:"+49 941 944-0",emergency:"+49 941 944-7501",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-08-01"},{id:"uniklinikum-wuerzburg",name:"Universitätsklinikum Würzburg",type:"comprehensive",address:"Oberdürrbacher Str. 6, 97080 Würzburg",coordinates:{lat:49.784,lng:9.9721},phone:"+49 931 201-0",emergency:"+49 931 201-24444",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-08-01"},{id:"klinikum-nuernberg",name:"Klinikum Nürnberg Nord",type:"comprehensive",address:"Prof.-Ernst-Nathan-Str. 1, 90419 Nürnberg",coordinates:{lat:49.4521,lng:11.0767},phone:"+49 911 398-0",emergency:"+49 911 398-2369",services:["thrombectomy","neurosurgery","icu"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-08-01"},{id:"klinikum-augsburg",name:"Universitätsklinikum Augsburg",type:"comprehensive",address:"Stenglinstr. 2, 86156 Augsburg",coordinates:{lat:48.3668,lng:10.9093},phone:"+49 821 400-01",emergency:"+49 821 400-2356",services:["thrombectomy","neurosurgery","icu","telemedicine"],certified:!0,certification:"DSG/DGN",lastUpdated:"2024-08-01"},{id:"klinikum-ingolstadt",name:"Klinikum Ingolstadt",type:"primary",address:"Krumenauerstraße 25, 85049 Ingolstadt",coordinates:{lat:48.7665,lng:11.4364},phone:"+49 841 880-0",emergency:"+49 841 880-2201",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-08-01"},{id:"klinikum-passau",name:"Klinikum Passau",type:"primary",address:"Bischof-Pilgrim-Str. 1, 94032 Passau",coordinates:{lat:48.5665,lng:13.4513},phone:"+49 851 5300-0",emergency:"+49 851 5300-2100",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-08-01"},{id:"klinikum-bamberg",name:"Sozialstiftung Bamberg Klinikum",type:"primary",address:"Buger Str. 80, 96049 Bamberg",coordinates:{lat:49.8988,lng:10.9027},phone:"+49 951 503-0",emergency:"+49 951 503-11101",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-08-01"},{id:"klinikum-bayreuth",name:"Klinikum Bayreuth",type:"primary",address:"Preuschwitzer Str. 101, 95445 Bayreuth",coordinates:{lat:49.9459,lng:11.5779},phone:"+49 921 400-0",emergency:"+49 921 400-5401",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-08-01"},{id:"klinikum-landshut",name:"Klinikum Landshut",type:"primary",address:"Robert-Koch-Str. 1, 84034 Landshut",coordinates:{lat:48.5436,lng:12.1619},phone:"+49 871 698-0",emergency:"+49 871 698-3333",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-08-01"},{id:"klinikum-rosenheim",name:"RoMed Klinikum Rosenheim",type:"primary",address:"Pettenkoferstr. 10, 83022 Rosenheim",coordinates:{lat:47.8567,lng:12.1265},phone:"+49 8031 365-0",emergency:"+49 8031 365-3711",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-08-01"},{id:"klinikum-memmingen",name:"Klinikum Memmingen",type:"primary",address:"Bismarckstr. 23, 87700 Memmingen",coordinates:{lat:47.9833,lng:10.1833},phone:"+49 8331 70-0",emergency:"+49 8331 70-2500",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-08-01"},{id:"klinikum-kempten",name:"Klinikum Kempten-Oberallgäu",type:"primary",address:"Robert-Weixler-Str. 50, 87439 Kempten",coordinates:{lat:47.7261,lng:10.3097},phone:"+49 831 530-0",emergency:"+49 831 530-2201",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-08-01"},{id:"klinikum-coburg",name:"Klinikum Coburg",type:"primary",address:"Ketschendorfer Str. 33, 96450 Coburg",coordinates:{lat:50.2596,lng:10.9685},phone:"+49 9561 22-0",emergency:"+49 9561 22-6300",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-08-01"},{id:"klinikum-aschaffenburg",name:"Klinikum Aschaffenburg-Alzenau",type:"primary",address:"Am Hasenkopf 1, 63739 Aschaffenburg",coordinates:{lat:49.9747,lng:9.1581},phone:"+49 6021 32-0",emergency:"+49 6021 32-2700",services:["stroke_unit","telemedicine"],certified:!0,certification:"DSG",lastUpdated:"2024-08-01"}];function A(i,t,e,a){const o=E(e-i),r=E(a-t),c=Math.sin(o/2)*Math.sin(o/2)+Math.cos(E(i))*Math.cos(E(e))*Math.sin(r/2)*Math.sin(r/2);return 6371*(2*Math.atan2(Math.sqrt(c),Math.sqrt(1-c)))}function E(i){return i*(Math.PI/180)}async function q(i,t,e,a,n="driving-car"){try{const o=`https://api.openrouteservice.org/v2/directions/${n}`,c=await fetch(o,{method:"POST",headers:{Accept:"application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",Authorization:"5b3ce3597851110001cf624868c4c27b63ae476c9c26c8bffbc35688","Content-Type":"application/json; charset=utf-8"},body:JSON.stringify({coordinates:[[t,i],[a,e]],radiuses:[1e3,1e3],format:"json"})});if(!c.ok)throw new Error(`Routing API error: ${c.status}`);const l=await c.json();if(l.routes&&l.routes.length>0){const d=l.routes[0];return{duration:Math.round(d.summary.duration/60),distance:Math.round(d.summary.distance/1e3),source:"routing"}}else throw new Error("No route found")}catch(o){console.warn("Travel time calculation failed, using distance estimate:",o);const r=A(i,t,e,a);return{duration:Math.round(r/.8),distance:Math.round(r),source:"estimated"}}}async function oe(i,t,e,a){try{const n=await q(i,t,e,a,"driving-car");return{duration:Math.round(n.duration*.75),distance:n.distance,source:n.source==="routing"?"emergency-routing":"emergency-estimated"}}catch{const o=A(i,t,e,a);return{duration:Math.round(o/1.2),distance:Math.round(o),source:"emergency-estimated"}}}async function re(i,t,e=5,a=120,n=!0){return console.log("Calculating travel times to stroke centers..."),(await Promise.all(U.map(async r=>{try{const c=n?await oe(i,t,r.coordinates.lat,r.coordinates.lng):await q(i,t,r.coordinates.lat,r.coordinates.lng);return{...r,travelTime:c.duration,distance:c.distance,travelSource:c.source}}catch(c){console.warn(`Failed to calculate travel time to ${r.name}:`,c);const l=A(i,t,r.coordinates.lat,r.coordinates.lng);return{...r,travelTime:Math.round(l/.8),distance:Math.round(l),travelSource:"fallback"}}}))).filter(r=>r.travelTime<=a).sort((r,c)=>r.travelTime-c.travelTime).slice(0,e)}function le(i,t,e=5,a=100){return U.map(o=>({...o,distance:A(i,t,o.coordinates.lat,o.coordinates.lng)})).filter(o=>o.distance<=a).sort((o,r)=>o.distance-r.distance).slice(0,e)}async function ce(i,t,e="stroke"){const a=await re(i,t,10,120,!0);if(e==="lvo"||e==="thrombectomy"){const n=a.filter(r=>r.type==="comprehensive"&&r.services.includes("thrombectomy")&&r.travelTime<=60),o=a.filter(r=>r.type==="primary");return{recommended:n.slice(0,3),alternative:o.slice(0,2)}}if(e==="ich"){const n=a.filter(o=>o.services.includes("neurosurgery")&&o.travelTime<=45);return{recommended:n.slice(0,3),alternative:a.filter(o=>!n.includes(o)).slice(0,2)}}return{recommended:a.slice(0,5),alternative:[]}}function de(i,t,e="stroke"){const a=le(i,t,10);if(e==="lvo"||e==="thrombectomy"){const n=a.filter(r=>r.type==="comprehensive"&&r.services.includes("thrombectomy")),o=a.filter(r=>r.type==="primary");return{recommended:n.slice(0,3),alternative:o.slice(0,2)}}return{recommended:a.slice(0,5),alternative:[]}}function K(i){return`
    <div class="stroke-center-section">
      <h3>🏥 ${s("nearestCentersTitle")}</h3>
      <div id="locationContainer">
        <div class="location-controls">
          <button type="button" id="useGpsButton" class="secondary">
            📍 ${s("useCurrentLocation")}
          </button>
          <div class="location-manual" style="display: none;">
            <input type="text" id="locationInput" placeholder="${s("enterLocationPlaceholder")||"e.g. München, Bad Tölz, or 48.1351, 11.5820"}" />
            <button type="button" id="searchLocationButton" class="secondary">${s("search")}</button>
          </div>
          <button type="button" id="manualLocationButton" class="secondary">
            ✏️ ${s("enterManually")}
          </button>
        </div>
        <div id="strokeCenterResults" class="stroke-center-results"></div>
      </div>
    </div>
  `}function ue(i){const t=document.getElementById("useGpsButton"),e=document.getElementById("manualLocationButton"),a=document.querySelector(".location-manual"),n=document.getElementById("locationInput"),o=document.getElementById("searchLocationButton"),r=document.getElementById("strokeCenterResults");t&&t.addEventListener("click",()=>{me(i,r)}),e&&e.addEventListener("click",()=>{a.style.display=a.style.display==="none"?"block":"none"}),o&&o.addEventListener("click",()=>{const c=n.value.trim();c&&x(c,i,r)}),n&&n.addEventListener("keypress",c=>{if(c.key==="Enter"){const l=n.value.trim();l&&x(l,i,r)}})}function me(i,t){if(!navigator.geolocation){L(s("geolocationNotSupported"),t);return}t.innerHTML=`<div class="loading">${s("gettingLocation")}...</div>`,navigator.geolocation.getCurrentPosition(e=>{const{latitude:a,longitude:n}=e.coords;N(a,n,i,t)},e=>{let a=s("locationError");switch(e.code){case e.PERMISSION_DENIED:a=s("locationPermissionDenied");break;case e.POSITION_UNAVAILABLE:a=s("locationUnavailable");break;case e.TIMEOUT:a=s("locationTimeout");break}L(a,t)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:3e5})}async function x(i,t,e){e.innerHTML=`<div class="loading">${s("searchingLocation")}...</div>`;const a=/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/,n=i.trim().match(a);if(n){const o=parseFloat(n[1]),r=parseFloat(n[2]);if(o>=47.2&&o<=55.1&&r>=5.9&&r<=15){e.innerHTML=`
        <div class="location-success">
          <p>📍 Coordinates: ${o.toFixed(4)}, ${r.toFixed(4)}</p>
        </div>
      `,setTimeout(()=>{N(o,r,t,e)},500);return}else{L("Coordinates appear to be outside Germany. Please check the values.",e);return}}try{let o=i.trim();!o.toLowerCase().includes("bayern")&&!o.toLowerCase().includes("bavaria")&&!o.toLowerCase().includes("deutschland")&&!o.toLowerCase().includes("germany")&&(o=o+", Bayern, Deutschland");const c=`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(o)}&countrycodes=de&format=json&limit=3&addressdetails=1`,l=await fetch(c,{method:"GET",headers:{Accept:"application/json","User-Agent":"iGFAP-StrokeTriage/2.1.0"}});if(!l.ok)throw new Error(`Geocoding API error: ${l.status}`);const d=await l.json();if(d&&d.length>0){let m=d[0];for(const f of d)if(f.address&&f.address.state==="Bayern"){m=f;break}const h=parseFloat(m.lat),y=parseFloat(m.lon),T=m.display_name||i;e.innerHTML=`
        <div class="location-success">
          <p>📍 Found: ${T}</p>
          <small style="color: #666;">Lat: ${h.toFixed(4)}, Lng: ${y.toFixed(4)}</small>
        </div>
      `,setTimeout(()=>{N(h,y,t,e)},1e3)}else L(`
        <strong>Location "${i}" not found.</strong><br>
        <small>Try:</small>
        <ul style="text-align: left; font-size: 0.9em; margin: 10px 0;">
          <li>City name: "München" or "Augsburg"</li>
          <li>Address: "Marienplatz 1, München"</li>
          <li>Coordinates: "48.1351, 11.5820"</li>
        </ul>
      `,e)}catch(o){console.warn("Geocoding failed:",o),L(`
      <strong>Unable to search location.</strong><br>
      <small>Please try entering coordinates directly (e.g., "48.1351, 11.5820")</small>
    `,e)}}async function N(i,t,e,a){const n=ge(e),o=pe(n,e);a.innerHTML=`
    <div class="location-info">
      <p><strong>${s("yourLocation")}:</strong> ${i.toFixed(4)}, ${t.toFixed(4)}</p>
    </div>
    <div class="loading">${s("calculatingTravelTimes")}...</div>
  `;try{const r=await ce(i,t,n),c=`
      <div class="location-info">
        <p><strong>${s("yourLocation")}:</strong> ${i.toFixed(4)}, ${t.toFixed(4)}</p>
        ${o}
      </div>
      
      <div class="recommended-centers">
        <h4>${s("recommendedCenters")}</h4>
        ${$(r.recommended,!0)}
      </div>
      
      ${r.alternative.length>0?`
        <div class="alternative-centers">
          <h4>${s("alternativeCenters")}</h4>
          ${$(r.alternative,!1)}
        </div>
      `:""}
      
      <div class="travel-time-note">
        <small>${s("travelTimeNote")}</small>
        <br><small class="powered-by">${s("poweredByOrs")}</small>
      </div>
    `;a.innerHTML=c}catch(r){console.warn("Travel time calculation failed, falling back to distance:",r);const c=de(i,t,n),l=`
      <div class="location-info">
        <p><strong>${s("yourLocation")}:</strong> ${i.toFixed(4)}, ${t.toFixed(4)}</p>
        ${o}
      </div>
      
      <div class="recommended-centers">
        <h4>${s("recommendedCenters")}</h4>
        ${$(c.recommended,!0)}
      </div>
      
      ${c.alternative.length>0?`
        <div class="alternative-centers">
          <h4>${s("alternativeCenters")}</h4>
          ${$(c.alternative,!1)}
        </div>
      `:""}
      
      <div class="distance-note">
        <small>${s("distanceNote")}</small>
      </div>
    `;a.innerHTML=l}}function $(i,t=!1){return!i||i.length===0?`<p>${s("noCentersFound")}</p>`:i.map(e=>`
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
  `).join("")}function ge(i){return i?i.ich&&i.ich.probability>.5?"ich":i.lvo&&i.lvo.probability>.5&&(!i.ich||i.ich.probability<.5)?"lvo":"stroke":"stroke"}function pe(i,t){var e;if(i==="ich"){const a=Math.round((((e=t==null?void 0:t.ich)==null?void 0:e.probability)||0)*100);return`
      <div class="routing-explanation ich-routing">
        <strong>⚠️ ${s("neurosurgeryRouting")||"Neurosurgical Centers Recommended"}</strong>
        <p>${s("ichRoutingExplanation")||`ICH risk ${a}% - Routing to centers with neurosurgery capability`}</p>
      </div>
    `}else if(i==="lvo")return`
      <div class="routing-explanation lvo-routing">
        <strong>⚡ ${s("thrombectomyRouting")||"Thrombectomy Centers Recommended"}</strong>
        <p>${s("lvoRoutingExplanation")||"Possible LVO - Routing to centers with thrombectomy capability"}</p>
      </div>
    `;return`
    <div class="routing-explanation general-routing">
      <p>${s("generalStrokeRouting")||"Showing nearest stroke-capable centers"}</p>
    </div>
  `}function L(i,t){t.innerHTML=`
    <div class="location-error">
      <p>⚠️ ${i}</p>
      <p><small>${s("tryManualEntry")}</small></p>
    </div>
  `}function he(i,t){const e=Number(i),a=D[t];return e>=a.high?"🔴 HIGH RISK":e>=a.medium?"🟡 MEDIUM RISK":"🟢 LOW RISK"}function W(){const t=u.getState().formData;if(!t||Object.keys(t).length===0)return"";let e="";return Object.entries(t).forEach(([a,n])=>{if(n&&Object.keys(n).length>0){const o=s(`${a}ModuleTitle`)||a.charAt(0).toUpperCase()+a.slice(1);let r="";Object.entries(n).forEach(([c,l])=>{if(l===""||l===null||l===void 0)return;let d=c;s(`${c}Label`)?d=s(`${c}Label`):d=c.replace(/_/g," ").replace(/\b\w/g,h=>h.toUpperCase());let m=l;typeof l=="boolean"&&(m=l?"✓":"✗"),r+=`
          <div class="summary-item">
            <span class="summary-label">${d}:</span>
            <span class="summary-value">${m}</span>
          </div>
        `}),r&&(e+=`
          <div class="summary-module">
            <h4>${o}</h4>
            <div class="summary-items">
              ${r}
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
  `:""}function j(i,t,e){if(!t)return"";const a=Math.round((t.probability||0)*100),n=he(a,i),o=a>D[i].critical,r=a>D[i].high,c={ich:"🩸",lvo:"🧠"},l={ich:s("ichProbability"),lvo:s("lvoProbability")},d={ich:"ICH",lvo:S.getCurrentLanguage()==="de"?"Großgefäßverschluss":"Large Vessel Occlusion"};return`
    <div class="enhanced-risk-card ${i} ${o?"critical":r?"high":"normal"}">
      <div class="risk-header">
        <div class="risk-icon">${c[i]}</div>
        <div class="risk-title">
          <h3>${l[i]}</h3>
          <span class="risk-subtitle">${d[i]}</span>
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
          <div class="risk-level ${o?"critical":r?"high":"normal"}">
            ${n}
          </div>
        </div>
      </div>
    </div>
  `}function ve(i,t){const{ich:e,lvo:a}=i,n=(e==null?void 0:e.module)==="Limited"||(e==null?void 0:e.module)==="Coma"||(a==null?void 0:a.notPossible)===!0;return e==null||e.module,n?be(e):fe(e,a)}function be(i,t,e){const a=i&&i.probability>.6?V():"",n=K(),o=W();return`
    <div class="container">
      ${b(3)}
      <h2>${s("bleedingRiskAssessment")||"Blutungsrisiko-Bewertung / Bleeding Risk Assessment"}</h2>
      ${a}
      
      <!-- Single ICH Risk Card -->
      <div class="risk-results-single">
        ${j("ich",i)}
      </div>
      
      <!-- ICH Drivers Only -->
      <div class="enhanced-drivers-section">
        <h3>${s("riskFactorsTitle")||"Hauptrisikofaktoren / Main Risk Factors"}</h3>
        ${Y(i)}
      </div>
      
      <!-- Collapsible Additional Information -->
      <div class="additional-info-section">
        <button class="info-toggle" data-target="input-summary">
          <span class="toggle-icon">📋</span>
          <span class="toggle-text">${s("inputSummaryTitle")}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="input-summary" style="display: none;">
          ${o}
        </div>
        
        <button class="info-toggle" data-target="stroke-centers">
          <span class="toggle-icon">🏥</span>
          <span class="toggle-text">${s("nearestCentersTitle")}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="stroke-centers" style="display: none;">
          ${n}
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
  `}function fe(i,t,e,a){const n=Math.round(((i==null?void 0:i.probability)||0)*100),o=Math.round(((t==null?void 0:t.probability)||0)*100),r=i&&i.probability>.6?V():"",c=K(),l=W(),d=n<30&&o>50;return`
    <div class="container">
      ${b(3)}
      <h2>${s("resultsTitle")}</h2>
      ${r}
      
      <!-- Primary ICH Risk Display -->
      <div class="risk-results-single">
        ${j("ich",i)}
        ${d?ye():""}
      </div>
      
      <!-- ICH Drivers Only -->
      <div class="enhanced-drivers-section">
        <h3>${s("riskFactorsTitle")||"Risikofaktoren / Risk Factors"}</h3>
        ${Y(i)}
      </div>
      
      <!-- Collapsible Additional Information -->
      <div class="additional-info-section">
        <button class="info-toggle" data-target="input-summary">
          <span class="toggle-icon">📋</span>
          <span class="toggle-text">${s("inputSummaryTitle")}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="input-summary" style="display: none;">
          ${l}
        </div>
        
        <button class="info-toggle" data-target="stroke-centers">
          <span class="toggle-icon">🏥</span>
          <span class="toggle-text">${s("nearestCentersTitle")}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="stroke-centers" style="display: none;">
          ${c}
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
  `}function ye(){return`
    <div class="secondary-notification">
      <p class="lvo-possible">
        ⚡ ${s("lvoMayBePossible")||"Großgefäßverschluss möglich / Large vessel occlusion possible"}
      </p>
    </div>
  `}function Y(i){if(!i||!i.drivers)return'<p class="no-drivers">No driver data available</p>';const t=i.drivers;if(!t.positive&&!t.negative)return'<p class="no-drivers">Driver format error</p>';const e=t.positive||[],a=t.negative||[];return`
    <div class="drivers-split-view">
      <div class="drivers-column positive-column">
        <div class="column-header">
          <span class="column-icon">⬆</span>
          <span class="column-title">${s("increasingRisk")||"Risikoerhöhend / Increasing Risk"}</span>
        </div>
        <div class="compact-drivers">
          ${e.length>0?e.slice(0,5).map(n=>H(n,"positive")).join(""):`<p class="no-factors">${s("noFactors")||"Keine Faktoren / No factors"}</p>`}
        </div>
      </div>
      
      <div class="drivers-column negative-column">
        <div class="column-header">
          <span class="column-icon">⬇</span>
          <span class="column-title">${s("decreasingRisk")||"Risikomindernd / Decreasing Risk"}</span>
        </div>
        <div class="compact-drivers">
          ${a.length>0?a.slice(0,5).map(n=>H(n,"negative")).join(""):`<p class="no-factors">${s("noFactors")||"Keine Faktoren / No factors"}</p>`}
        </div>
      </div>
    </div>
  `}function H(i,t){const e=Math.abs(i.weight*100),a=Math.min(e*2,100);return`
    <div class="compact-driver-item">
      <div class="compact-driver-label">${ke(i.label)}</div>
      <div class="compact-driver-bar ${t}" style="width: ${a}%;">
        <span class="compact-driver-value">${e.toFixed(1)}%</span>
      </div>
    </div>
  `}function ke(i){const t=i.replace(/_/g," ").replace(/\b\w/g,e=>e.toUpperCase());return s(`driver_${i}`)||t}function Se(i,t,e){const a=[];return e.required&&!t&&t!==0&&a.push("This field is required"),e.min!==void 0&&t!==""&&!isNaN(t)&&parseFloat(t)<e.min&&a.push(`Value must be at least ${e.min}`),e.max!==void 0&&t!==""&&!isNaN(t)&&parseFloat(t)>e.max&&a.push(`Value must be at most ${e.max}`),e.pattern&&!e.pattern.test(t)&&a.push("Invalid format"),a}function Le(i){let t=!0;const e={};return Object.entries(ie).forEach(([a,n])=>{const o=i.elements[a];if(o){const r=Se(a,o.value,n);r.length>0&&(e[a]=r,t=!1)}}),{isValid:t,validationErrors:e}}function Te(i,t){Object.entries(t).forEach(([e,a])=>{const n=i.querySelector(`[name="${e}"]`);if(n){const o=n.closest(".input-group");if(o){o.classList.add("error"),o.querySelectorAll(".error-message").forEach(c=>c.remove());const r=document.createElement("div");r.className="error-message",r.innerHTML=`<span class="error-icon">⚠️</span> ${a[0]}`,o.appendChild(r)}}})}function we(i){i.querySelectorAll(".input-group.error").forEach(t=>{t.classList.remove("error"),t.querySelectorAll(".error-message").forEach(e=>e.remove())})}function O(i,t){var r,c;console.log(`=== EXTRACTING ${t.toUpperCase()} DRIVERS ===`),console.log("Full response:",i);let e=null;if(t==="ICH"?(e=((r=i.ich_prediction)==null?void 0:r.drivers)||null,console.log("🧠 ICH raw drivers extracted:",e)):t==="LVO"&&(e=((c=i.lvo_prediction)==null?void 0:c.drivers)||null,console.log("🩸 LVO raw drivers extracted:",e)),!e)return console.log(`❌ No ${t} drivers found`),null;const a=Ee(e,t);console.log(`✅ ${t} drivers formatted:`,a);const o=[...a.positive,...a.negative].find(l=>l.label&&(l.label.toLowerCase().includes("fast")||l.label.includes("fast_ed")));return o?console.log(`🎯 FAST-ED found in ${t}:`,`${o.label}: ${o.weight>0?"+":""}${o.weight.toFixed(4)}`):console.log(`⚠️  FAST-ED NOT found in ${t} drivers`),a}function Ee(i,t){console.log(`🔄 Formatting ${t} drivers from dictionary:`,i);const e=[],a=[];return Object.entries(i).forEach(([n,o])=>{typeof o=="number"&&(o>0?e.push({label:n,weight:o}):o<0&&a.push({label:n,weight:Math.abs(o)}))}),e.sort((n,o)=>o.weight-n.weight),a.sort((n,o)=>o.weight-n.weight),console.log(`📈 ${t} positive drivers:`,e.slice(0,5)),console.log(`📉 ${t} negative drivers:`,a.slice(0,5)),{kind:"flat_dictionary",units:"logit",positive:e,negative:a,meta:{}}}function z(i,t){var a,n;console.log(`=== EXTRACTING ${t.toUpperCase()} PROBABILITY ===`);let e=0;return t==="ICH"?(e=((a=i.ich_prediction)==null?void 0:a.probability)||0,console.log("🧠 ICH probability extracted:",e)):t==="LVO"&&(e=((n=i.lvo_prediction)==null?void 0:n.probability)||0,console.log("🩸 LVO probability extracted:",e)),e}function G(i,t){var a,n;let e=.85;return t==="ICH"?e=((a=i.ich_prediction)==null?void 0:a.confidence)||.85:t==="LVO"&&(e=((n=i.lvo_prediction)==null?void 0:n.confidence)||.85),e}async function $e(){console.log("Warming up Cloud Functions...");const i=Object.values(v).map(async t=>{try{const e=new AbortController,a=setTimeout(()=>e.abort(),3e3);await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({}),signal:e.signal,mode:"cors"}),clearTimeout(a),console.log(`Warmed up: ${t}`)}catch{console.log(`Warm-up attempt for ${t.split("/").pop()} completed`)}});Promise.all(i).then(()=>{console.log("Cloud Functions warm-up complete")})}class p extends Error{constructor(t,e,a){super(t),this.name="APIError",this.status=e,this.url=a}}function P(i){const t={...i};return Object.keys(t).forEach(e=>{const a=t[e];(typeof a=="boolean"||a==="on"||a==="true"||a==="false")&&(t[e]=a===!0||a==="on"||a==="true"?1:0)}),t}function C(i,t=0){const e=parseFloat(i);return isNaN(e)?t:e}async function R(i,t){const e=new AbortController,a=setTimeout(()=>e.abort(),I.requestTimeout);try{const n=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(t),signal:e.signal,mode:"cors"});if(clearTimeout(a),!n.ok){let r=`HTTP ${n.status}`;try{const c=await n.json();r=c.error||c.message||r}catch{r=`${r}: ${n.statusText}`}throw new p(r,n.status,i)}return await n.json()}catch(n){throw clearTimeout(a),n.name==="AbortError"?new p("Request timeout - please try again",408,i):n instanceof p?n:new p("Network error - please check your connection and try again",0,i)}}async function Ce(i){const t=P(i);console.log("Coma ICH API Payload:",t);try{const e=await R(v.COMA_ICH,t);return console.log("Coma ICH API Response:",e),{probability:C(e.probability||e.ich_probability,0),drivers:e.drivers||null,confidence:C(e.confidence,.75),module:"Coma"}}catch(e){throw console.error("Coma ICH prediction failed:",e),new p(`Failed to get ICH prediction: ${e.message}`,e.status,v.COMA_ICH)}}async function Ae(i){const t={age_years:i.age_years,systolic_bp:i.systolic_bp,diastolic_bp:i.diastolic_bp,gfap_value:i.gfap_value,vigilanzminderung:i.vigilanzminderung||0},e=P(t);console.log("Limited Data ICH API Payload:",e);try{const a=await R(v.LDM_ICH,e);return console.log("Limited Data ICH API Response:",a),{probability:C(a.probability||a.ich_probability,0),drivers:a.drivers||null,confidence:C(a.confidence,.65),module:"Limited Data"}}catch(a){throw console.error("Limited Data ICH prediction failed:",a),new p(`Failed to get ICH prediction: ${a.message}`,a.status,v.LDM_ICH)}}async function De(i){var a,n,o,r,c,l;const t={age_years:i.age_years,systolic_bp:i.systolic_bp,diastolic_bp:i.diastolic_bp,gfap_value:i.gfap_value,fast_ed_score:i.fast_ed_score,headache:i.headache||0,vigilanzminderung:i.vigilanzminderung||0,armparese:i.armparese||0,beinparese:i.beinparese||0,eye_deviation:i.eye_deviation||0,atrial_fibrillation:i.atrial_fibrillation||0,anticoagulated_noak:i.anticoagulated_noak||0,antiplatelets:i.antiplatelets||0},e=P(t);console.log("=== BACKEND DATA MAPPING TEST ==="),console.log("📤 Full Stroke API Payload:",e),console.log("🧪 Clinical Variables Being Sent:"),console.log("  📊 FAST-ED Score:",e.fast_ed_score),console.log("  🩸 Systolic BP:",e.systolic_bp),console.log("  🩸 Diastolic BP:",e.diastolic_bp),console.log("  🧬 GFAP Value:",e.gfap_value),console.log("  👤 Age:",e.age_years),console.log("  🤕 Headache:",e.headache),console.log("  😵 Vigilanz:",e.vigilanzminderung),console.log("  💪 Arm Parese:",e.armparese),console.log("  🦵 Leg Parese:",e.beinparese),console.log("  👁️ Eye Deviation:",e.eye_deviation),console.log("  💓 Atrial Fib:",e.atrial_fibrillation),console.log("  💊 Anticoag NOAK:",e.anticoagulated_noak),console.log("  💊 Antiplatelets:",e.antiplatelets);try{const d=await R(v.FULL_STROKE,e);console.log("📥 Full Stroke API Response:",d),console.log("🔑 Available keys in response:",Object.keys(d)),console.log("=== BACKEND MAPPING VERIFICATION ===");const m=JSON.stringify(d).toLowerCase();console.log("🔍 Backend Feature Name Analysis:"),console.log('  Contains "fast":',m.includes("fast")),console.log('  Contains "ed":',m.includes("ed")),console.log('  Contains "fast_ed":',m.includes("fast_ed")),console.log('  Contains "systolic":',m.includes("systolic")),console.log('  Contains "diastolic":',m.includes("diastolic")),console.log('  Contains "gfap":',m.includes("gfap")),console.log('  Contains "age":',m.includes("age")),console.log('  Contains "headache":',m.includes("headache")),console.log("🧠 ICH driver sources:"),console.log("  response.ich_prediction?.drivers:",(a=d.ich_prediction)==null?void 0:a.drivers),console.log("  response.ich_drivers:",d.ich_drivers),console.log("  response.ich?.drivers:",(n=d.ich)==null?void 0:n.drivers),console.log("  response.drivers?.ich:",(o=d.drivers)==null?void 0:o.ich),console.log("🩸 LVO driver sources:"),console.log("  response.lvo_prediction?.drivers:",(r=d.lvo_prediction)==null?void 0:r.drivers),console.log("  response.lvo_drivers:",d.lvo_drivers),console.log("  response.lvo?.drivers:",(c=d.lvo)==null?void 0:c.drivers),console.log("  response.drivers?.lvo:",(l=d.drivers)==null?void 0:l.lvo),Object.keys(d).forEach(_=>{const w=d[_];typeof w=="number"&&w>=0&&w<=1&&console.log(`Potential probability field: ${_} = ${w}`)});const h=z(d,"ICH"),y=z(d,"LVO"),T=O(d,"ICH"),f=O(d,"LVO"),Z=G(d,"ICH"),Q=G(d,"LVO");return console.log("✅ Clean extraction results:"),console.log("  ICH:",{probability:h,hasDrivers:!!T}),console.log("  LVO:",{probability:y,hasDrivers:!!f}),{ich:{probability:h,drivers:T,confidence:Z,module:"Full Stroke"},lvo:{probability:y,drivers:f,confidence:Q,module:"Full Stroke"}}}catch(d){throw console.error("Full Stroke prediction failed:",d),new p(`Failed to get stroke predictions: ${d.message}`,d.status,v.FULL_STROKE)}}function Ie(i){u.logEvent("triage1_answer",{comatose:i}),M(i?"coma":"triage2")}function Ne(i){u.logEvent("triage2_answer",{examinable:i}),M(i?"full":"limited")}function M(i){u.logEvent("navigate",{from:u.getState().currentScreen,to:i}),u.navigate(i),window.scrollTo(0,0)}function Pe(){u.hasUnsavedData()&&!confirm("Are you sure you want to start over? All entered data will be lost.")||(u.logEvent("reset"),u.reset())}function Re(){console.log("goBack() called");const i=u.goBack();console.log("goBack() success:",i),i?(u.logEvent("navigate_back"),window.scrollTo(0,0)):(console.log("No history available, going home instead"),J())}function J(){console.log("goHome() called"),u.logEvent("navigate_home"),u.goHome(),window.scrollTo(0,0)}async function Me(i,t){i.preventDefault();const e=i.target,a=e.dataset.module,n=Le(e);if(!n.isValid){Te(t,n.validationErrors);return}const o={};Array.from(e.elements).forEach(l=>{if(l.name)if(l.type==="checkbox")o[l.name]=l.checked;else if(l.type==="number"){const d=parseFloat(l.value);o[l.name]=isNaN(d)?0:d}else l.type==="hidden"&&l.name==="armparese"?o[l.name]=l.value==="true":o[l.name]=l.value}),console.log("Collected form inputs:",o),u.setFormData(a,o);const r=e.querySelector("button[type=submit]"),c=r?r.innerHTML:"";r&&(r.disabled=!0,r.innerHTML=`<span class="loading-spinner"></span> ${s("analyzing")}`);try{let l;switch(a){case"coma":l={ich:await Ce(o),lvo:null};break;case"limited":l={ich:await Ae(o),lvo:{notPossible:!0}};break;case"full":l=await De(o);break;default:throw new Error("Unknown module: "+a)}u.setResults(l),u.logEvent("models_complete",{module:a,results:l}),M("results")}catch(l){console.error("Error running models:",l);let d="An error occurred during analysis. Please try again.";l instanceof p&&(d=l.message),_e(t,d),r&&(r.disabled=!1,r.innerHTML=c)}}function _e(i,t){i.querySelectorAll(".critical-alert").forEach(n=>{var o,r;(r=(o=n.querySelector("h4"))==null?void 0:o.textContent)!=null&&r.includes("Error")&&n.remove()});const e=document.createElement("div");e.className="critical-alert",e.innerHTML=`<h4><span class="alert-icon">⚠️</span> Error</h4><p>${t}</p>`;const a=i.querySelector(".container");a?a.prepend(e):i.prepend(e),setTimeout(()=>e.remove(),1e4)}function Fe(i){const t=document.createElement("div");t.className="sr-only",t.setAttribute("role","status"),t.setAttribute("aria-live","polite");const e={triage1:"Coma assessment",triage2:"Examination capability assessment",coma:"Coma module",limited:"Limited data module",full:"Full stroke assessment",results:"Assessment results"};t.textContent=`Navigated to ${e[i]||i}`,document.body.appendChild(t),setTimeout(()=>t.remove(),1e3)}function Be(i){const t={triage1:"Initial Assessment - Stroke Triage Assistant",triage2:"Examination Capability - Stroke Triage Assistant",coma:"Coma Module - Stroke Triage Assistant",limited:"Limited Data Module - Stroke Triage Assistant",full:"Full Stroke Module - Stroke Triage Assistant",results:"Assessment Results - Stroke Triage Assistant"};document.title=t[i]||"Stroke Triage Assistant"}function xe(){setTimeout(()=>{const i=document.querySelector("h2");i&&(i.setAttribute("tabindex","-1"),i.focus(),setTimeout(()=>i.removeAttribute("tabindex"),100))},100)}class He{constructor(){this.scores={facial_palsy:0,arm_weakness:0,speech_changes:0,eye_deviation:0,denial_neglect:0},this.onApply=null,this.modal=null}getTotal(){return Object.values(this.scores).reduce((t,e)=>t+e,0)}getRiskLevel(){return this.getTotal()>=4?"high":"low"}render(){const t=this.getTotal(),e=this.getRiskLevel();return`
      <div id="fastEdModal" class="modal" role="dialog" aria-labelledby="fastEdModalTitle" aria-hidden="true" style="display: none !important;">
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
    `}setupEventListeners(){if(this.modal=document.getElementById("fastEdModal"),!this.modal)return;this.modal.addEventListener("change",n=>{if(n.target.type==="radio"){const o=n.target.name,r=parseInt(n.target.value);this.scores[o]=r,this.updateDisplay()}});const t=this.modal.querySelector(".modal-close");t==null||t.addEventListener("click",()=>this.close());const e=this.modal.querySelector('[data-action="cancel-fast-ed"]');e==null||e.addEventListener("click",()=>this.close());const a=this.modal.querySelector('[data-action="apply-fast-ed"]');a==null||a.addEventListener("click",()=>this.apply()),this.modal.addEventListener("click",n=>{n.target===this.modal&&this.close()}),document.addEventListener("keydown",n=>{var o;n.key==="Escape"&&((o=this.modal)!=null&&o.classList.contains("show"))&&this.close()})}updateDisplay(){var a,n;const t=(a=this.modal)==null?void 0:a.querySelector(".total-score"),e=(n=this.modal)==null?void 0:n.querySelector(".risk-indicator");if(t&&(t.textContent=`${this.getTotal()}/9`),e){const o=this.getRiskLevel();e.className=`risk-indicator ${o}`,e.textContent=`${s("riskLevel")}: ${s(o==="high"?"riskLevelHigh":"riskLevelLow")}`}}show(t=0,e=null){this.onApply=e,t>0&&t<=9&&this.approximateFromTotal(t),document.getElementById("fastEdModal")?(this.modal.remove(),document.body.insertAdjacentHTML("beforeend",this.render()),this.modal=document.getElementById("fastEdModal")):document.body.insertAdjacentHTML("beforeend",this.render()),this.setupEventListeners(),this.modal.setAttribute("aria-hidden","false"),this.modal.style.display="flex",this.modal.classList.add("show");const a=this.modal.querySelector('input[type="radio"]');a==null||a.focus()}close(){this.modal&&(this.modal.classList.remove("show"),this.modal.style.display="none",this.modal.setAttribute("aria-hidden","true"))}apply(){const t=this.getTotal(),e=this.scores.arm_weakness>0,a=this.scores.eye_deviation>0;this.onApply&&this.onApply({total:t,components:{...this.scores},armWeaknessBoolean:e,eyeDeviationBoolean:a}),this.close()}approximateFromTotal(t){this.scores={facial_palsy:0,arm_weakness:0,speech_changes:0,eye_deviation:0,denial_neglect:0};let e=t;const a=Object.keys(this.scores);for(const n of a){if(e<=0)break;const r=Math.min(e,n==="facial_palsy"?1:2);this.scores[n]=r,e-=r}}}const Oe=new He;function k(i){const t=u.getState(),{currentScreen:e,results:a,startTime:n,navigationHistory:o}=t;i.innerHTML="";const r=document.getElementById("backButton");r&&(r.style.display=o&&o.length>0?"flex":"none");let c="";switch(e){case"triage1":c=B();break;case"triage2":c=te();break;case"coma":c=ae();break;case"limited":c=se();break;case"full":c=ne();break;case"results":c=ve(a);break;default:c=B()}i.innerHTML=c;const l=i.querySelector("form[data-module]");if(l){const d=l.dataset.module;ze(l,d)}Ge(i),e==="results"&&a&&setTimeout(()=>{ue(a)},100),Fe(e),Be(e),xe()}function ze(i,t){const e=u.getFormData(t);!e||Object.keys(e).length===0||Object.entries(e).forEach(([a,n])=>{const o=i.elements[a];o&&(o.type==="checkbox"?o.checked=n===!0||n==="on"||n==="true":o.value=n)})}function Ge(i){i.querySelectorAll('input[type="number"]').forEach(n=>{n.addEventListener("blur",()=>{we(i)})}),i.querySelectorAll("[data-action]").forEach(n=>{n.addEventListener("click",o=>{const{action:r,value:c}=o.currentTarget.dataset,l=c==="true";switch(r){case"triage1":Ie(l);break;case"triage2":Ne(l);break;case"reset":Pe();break;case"goBack":Re();break;case"goHome":J();break}})}),i.querySelectorAll("form[data-module]").forEach(n=>{n.addEventListener("submit",o=>{Me(o,i)})});const t=i.querySelector("#printResults");t&&t.addEventListener("click",()=>window.print());const e=i.querySelector("#fast_ed_score");e&&(e.addEventListener("click",n=>{n.preventDefault();const o=parseInt(e.value)||0;Oe.show(o,r=>{e.value=r.total;const c=i.querySelector("#armparese_hidden");c&&(c.value=r.armWeaknessBoolean?"true":"false");const l=i.querySelector("#eye_deviation_hidden");l&&(l.value=r.eyeDeviationBoolean?"true":"false"),e.dispatchEvent(new Event("change",{bubbles:!0}))})}),e.addEventListener("keydown",n=>{n.preventDefault()})),i.querySelectorAll(".info-toggle").forEach(n=>{n.addEventListener("click",o=>{const r=n.dataset.target,c=i.querySelector(`#${r}`),l=n.querySelector(".toggle-arrow");c&&(c.style.display!=="none"?(c.style.display="none",c.classList.remove("show"),n.classList.remove("active"),l.style.transform="rotate(0deg)"):(c.style.display="block",c.classList.add("show"),n.classList.add("active"),l.style.transform="rotate(180deg)"))})})}class Ve{constructor(){this.container=null,this.unsubscribe=null}async init(){if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",()=>this.init());return}if(this.container=document.getElementById("appContainer"),!this.container){console.error("App container not found");return}this.unsubscribe=u.subscribe(()=>{k(this.container)}),window.addEventListener("languageChanged",()=>{this.updateUILanguage(),k(this.container)}),this.setupGlobalEventListeners(),this.initializeTheme(),this.updateUILanguage(),this.startAutoSave(),this.setupSessionTimeout(),this.setCurrentYear(),this.registerServiceWorker(),$e(),k(this.container),console.log("iGFAP Stroke Triage Assistant initialized")}setupGlobalEventListeners(){const t=document.getElementById("backButton");t&&t.addEventListener("click",()=>{u.goBack(),k(this.container)});const e=document.getElementById("homeButton");e&&e.addEventListener("click",()=>{u.goHome(),k(this.container)});const a=document.getElementById("languageToggle");a&&a.addEventListener("click",()=>this.toggleLanguage());const n=document.getElementById("darkModeToggle");n&&n.addEventListener("click",()=>this.toggleDarkMode()),this.setupHelpModal(),this.setupFooterLinks(),document.addEventListener("keydown",o=>{if(o.key==="Escape"){const r=document.getElementById("helpModal");r&&r.classList.contains("show")&&(r.classList.remove("show"),r.style.display="none",r.setAttribute("aria-hidden","true"))}}),window.addEventListener("beforeunload",o=>{u.hasUnsavedData()&&(o.preventDefault(),o.returnValue="You have unsaved data. Are you sure you want to leave?")})}setupHelpModal(){const t=document.getElementById("helpButton"),e=document.getElementById("helpModal"),a=e==null?void 0:e.querySelector(".modal-close");if(t&&e){e.classList.remove("show"),e.style.display="none",e.setAttribute("aria-hidden","true"),t.addEventListener("click",()=>{e.style.display="flex",e.classList.add("show"),e.setAttribute("aria-hidden","false")});const n=()=>{e.classList.remove("show"),e.style.display="none",e.setAttribute("aria-hidden","true")};a==null||a.addEventListener("click",n),e.addEventListener("click",o=>{o.target===e&&n()})}}setupFooterLinks(){var t,e;(t=document.getElementById("privacyLink"))==null||t.addEventListener("click",a=>{a.preventDefault(),this.showPrivacyPolicy()}),(e=document.getElementById("disclaimerLink"))==null||e.addEventListener("click",a=>{a.preventDefault(),this.showDisclaimer()})}initializeTheme(){const t=localStorage.getItem("theme"),e=document.getElementById("darkModeToggle");(t==="dark"||!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)&&(document.body.classList.add("dark-mode"),e&&(e.textContent="☀️"))}toggleLanguage(){S.toggleLanguage(),this.updateUILanguage();const t=document.getElementById("languageToggle");if(t){const e=S.getCurrentLanguage();t.textContent=e==="en"?"🇬🇧":"🇩🇪",t.dataset.lang=e}}updateUILanguage(){document.documentElement.lang=S.getCurrentLanguage();const t=document.querySelector(".app-header h1");t&&(t.textContent=s("appTitle"));const e=document.querySelector(".emergency-badge");e&&(e.textContent=s("emergencyBadge"));const a=document.getElementById("languageToggle");a&&(a.title=s("languageToggle"),a.setAttribute("aria-label",s("languageToggle")));const n=document.getElementById("helpButton");n&&(n.title=s("helpButton"),n.setAttribute("aria-label",s("helpButton")));const o=document.getElementById("darkModeToggle");o&&(o.title=s("darkModeButton"),o.setAttribute("aria-label",s("darkModeButton")));const r=document.getElementById("modalTitle");r&&(r.textContent=s("helpTitle"))}toggleDarkMode(){const t=document.getElementById("darkModeToggle");document.body.classList.toggle("dark-mode");const e=document.body.classList.contains("dark-mode");t&&(t.textContent=e?"☀️":"🌙"),localStorage.setItem("theme",e?"dark":"light")}startAutoSave(){setInterval(()=>{this.saveCurrentFormData()},I.autoSaveInterval)}saveCurrentFormData(){this.container.querySelectorAll("form[data-module]").forEach(e=>{const a=new FormData(e),n=e.dataset.module;if(n){const o={};a.forEach((l,d)=>{const m=e.elements[d];m&&m.type==="checkbox"?o[d]=m.checked:o[d]=l});const r=u.getFormData(n);JSON.stringify(r)!==JSON.stringify(o)&&u.setFormData(n,o)}})}setupSessionTimeout(){setTimeout(()=>{confirm("Your session has been idle for 30 minutes. Would you like to continue?")?this.setupSessionTimeout():u.reset()},I.sessionTimeout)}setCurrentYear(){const t=document.getElementById("currentYear");t&&(t.textContent=new Date().getFullYear())}showPrivacyPolicy(){alert("Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.")}showDisclaimer(){alert("Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.")}async registerServiceWorker(){if(!("serviceWorker"in navigator)){console.log("Service Workers not supported");return}try{const t=await navigator.serviceWorker.register("/0825/sw.js",{scope:"/0825/"});console.log("Service Worker registered successfully:",t),t.addEventListener("updatefound",()=>{const e=t.installing;console.log("New service worker found"),e.addEventListener("statechange",()=>{e.state==="installed"&&navigator.serviceWorker.controller&&(console.log("New service worker installed, update available"),this.showUpdateNotification())})}),navigator.serviceWorker.addEventListener("message",e=>{console.log("Message from service worker:",e.data)})}catch(t){console.error("Service Worker registration failed:",t)}}showUpdateNotification(){const t=document.createElement("div");t.className="modal show update-modal",t.style.cssText=`
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
    `,t.appendChild(e),document.body.appendChild(t);const a=t.querySelector("#updateNow"),n=t.querySelector("#updateLater");a.addEventListener("click",()=>{window.location.reload()}),n.addEventListener("click",()=>{t.remove(),setTimeout(()=>this.showUpdateNotification(),5*60*1e3)}),t.addEventListener("click",o=>{o.target===t&&n.click()})}destroy(){this.unsubscribe&&this.unsubscribe()}}const Ue=new Ve;Ue.init();
//# sourceMappingURL=index-742-vh-y.js.map
