var fe=Object.defineProperty;var ve=(a,t,e)=>t in a?fe(a,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):a[t]=e;var B=(a,t,e)=>ve(a,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function e(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(n){if(n.ep)return;n.ep=!0;const s=e(n);fetch(n.href,s)}})();class ye{constructor(){this.state={currentScreen:"triage1",results:null,sessionId:null,startTime:null,formData:{},validationErrors:{},screenHistory:[]},this.listeners=new Set,this.initialize()}initialize(){this.state.sessionId=this.generateSessionId(),this.state.startTime=Date.now(),console.log("Store initialized with session:",this.state.sessionId)}generateSessionId(){return"session_"+Date.now()+"_"+Math.random().toString(36).substr(2,9)}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}notify(){this.listeners.forEach(t=>t(this.state))}getState(){return{...this.state}}setState(t){this.state={...this.state,...t},this.notify()}navigate(t){console.log(`Navigating from ${this.state.currentScreen} to ${t}`);const e=[...this.state.screenHistory];this.state.currentScreen!==t&&!e.includes(this.state.currentScreen)&&e.push(this.state.currentScreen),this.setState({currentScreen:t,screenHistory:e})}goBack(){const t=[...this.state.screenHistory];if(console.log("goBack() - current history:",t),console.log("goBack() - current screen:",this.state.currentScreen),t.length>0){const e=t.pop();return console.log("goBack() - navigating to:",e),this.setState({currentScreen:e,screenHistory:t}),!0}return console.log("goBack() - no history available"),!1}goHome(){this.setState({currentScreen:"triage1",screenHistory:[]})}setFormData(t,e){const i={...this.state.formData};i[t]={...e},this.setState({formData:i})}getFormData(t){return this.state.formData[t]||{}}setValidationErrors(t){this.setState({validationErrors:t})}clearValidationErrors(){this.setState({validationErrors:{}})}setResults(t){this.setState({results:t})}hasUnsavedData(){return Object.keys(this.state.formData).length>0&&!this.state.results}reset(){const t={currentScreen:"triage1",results:null,sessionId:this.generateSessionId(),startTime:Date.now(),formData:{},validationErrors:{},screenHistory:[]};this.setState(t),console.log("Store reset with new session:",t.sessionId)}logEvent(t,e={}){const i={timestamp:Date.now(),session:this.state.sessionId,event:t,data:e};console.log("Event:",i)}getSessionDuration(){return Date.now()-this.state.startTime}}const g=new ye;function T(a){const t=[{id:1,label:"Triage"},{id:2,label:"Assessment"},{id:3,label:"Results"}];let e='<div class="progress-indicator">';return t.forEach((i,n)=>{const s=i.id===a,r=i.id<a;e+=`
      <div class="progress-step ${s?"active":""} ${r?"completed":""}">
        ${r?"":i.id}
      </div>
    `,n<t.length-1&&(e+=`<div class="progress-line ${r?"completed":""}"></div>`)}),e+="</div>",e}const q={en:{appTitle:"iGFAP",emergencyBadge:"Emergency Tool",helpButton:"Help and Instructions",darkModeButton:"Toggle dark mode",languageToggle:"Language",step1:"Initial Assessment",step2:"Data Collection",step3:"Results",comaModuleTitle:"Coma Module",limitedDataModuleTitle:"Limited Data Module",fullStrokeModuleTitle:"Full Stroke Module",triage1Title:"Patient Assessment",triage1Question:"Is the patient comatose?",triage1Help:"Glasgow Coma Scale < 8",triage1Yes:"YES - Comatose",triage1No:"NO - Conscious",triage2Title:"Examination Capability",triage2Question:"Can the patient be reliably examined?",triage2Help:"Patient is not aphasic, confused, or uncooperative",triage2Yes:"YES - Full Exam Possible",triage2No:"NO - Limited Exam Only",ageLabel:"Age (years)",ageHelp:"Patient age in years",systolicLabel:"Systolic BP (mmHg)",systolicHelp:"Systolic blood pressure",diastolicLabel:"Diastolic BP (mmHg)",diastolicHelp:"Diastolic blood pressure",gfapLabel:"GFAP Value (pg/mL)",gfapHelp:"GFAP biomarker level",fastEdLabel:"FAST-ED Score",fastEdHelp:"FAST-ED assessment score (0-9)",headacheLabel:"Headache",vigilanzLabel:"Reduced consciousness",armPareseLabel:"Arm weakness",beinPareseLabel:"Leg weakness",eyeDeviationLabel:"Eye deviation",atrialFibLabel:"Atrial fibrillation",anticoagLabel:"Anticoagulated (NOAK)",antiplateletsLabel:"Antiplatelets",analyzeButton:"Analyze",analyzing:"Analyzing...",printResults:"Print Results",newAssessment:"Start New Assessment",startOver:"Start Over",goBack:"Go Back",goHome:"Go Home",basicInformation:"Basic Information",biomarkersScores:"Biomarkers & Scores",clinicalSymptoms:"Clinical Symptoms",medicalHistory:"Medical History",ageYearsLabel:"Age (years)",systolicBpLabel:"Systolic BP (mmHg)",diastolicBpLabel:"Diastolic BP (mmHg)",gfapValueLabel:"GFAP Value (pg/mL)",fastEdScoreLabel:"FAST-ED Score",ageYearsHelp:"Patient's age in years",systolicBpHelp:"Normal: 90-140 mmHg",diastolicBpHelp:"Normal: 60-90 mmHg",gfapTooltip:"Brain injury biomarker",gfapTooltipLong:"Glial Fibrillary Acidic Protein - Brain injury biomarker",gfapRange:"Range: {min} - {max} pg/mL",fastEdTooltip:"0-9 scale for LVO screening",analyzeIchRisk:"Analyze ICH Risk",analyzeStrokeRisk:"Analyze Stroke Risk",criticalPatient:"Critical Patient",comaAlert:"Patient is comatose (GCS < 8). Rapid assessment required.",vigilanceReduction:"Vigilance Reduction (Decreased alertness)",armParesis:"Arm Paresis",legParesis:"Leg Paresis",eyeDeviation:"Eye Deviation",atrialFibrillation:"Atrial Fibrillation",onNoacDoac:"On NOAC/DOAC",onAntiplatelets:"On Antiplatelets",resultsTitle:"Assessment Results",bleedingRiskAssessment:"Bleeding Risk Assessment",ichProbability:"ICH Probability",lvoProbability:"LVO Probability",lvoMayBePossible:"Large vessel occlusion possible - further evaluation recommended",riskFactorsTitle:"Main Risk Factors",increasingRisk:"Increasing Risk",decreasingRisk:"Decreasing Risk",noFactors:"No factors",riskLevel:"Risk Level",lowRisk:"Low Risk",mediumRisk:"Medium Risk",highRisk:"High Risk",riskLow:"Low",riskMedium:"Medium",riskHigh:"High",riskFactorsAnalysis:"Risk Factors",contributingFactors:"Contributing factors to the assessment",riskFactors:"Risk Factors",increaseRisk:"INCREASE",decreaseRisk:"DECREASE",noPositiveFactors:"No increasing factors",noNegativeFactors:"No decreasing factors",ichRiskFactors:"ICH Risk Factors",lvoRiskFactors:"LVO Risk Factors",criticalAlertTitle:"CRITICAL RISK DETECTED",criticalAlertMessage:"High probability of intracerebral hemorrhage detected.",immediateActionsRequired:"Immediate actions required",initiateStrokeProtocol:"Initiate stroke protocol immediately",urgentCtImaging:"Urgent CT imaging required",considerBpManagement:"Consider blood pressure management",prepareNeurosurgicalConsult:"Prepare for potential neurosurgical consultation",helpTitle:"Quick Reference Guide",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 8: Comatose patient - use Coma Module",gcsMod:"GCS 8-12: Moderate impairment",gcsHigh:"GCS 13-15: Mild impairment",fastEdTitle:"FAST-ED Score Components",fastEdFacial:"Facial Palsy: 0-1 points",fastEdArm:"Arm Weakness: 0-2 points",fastEdSpeech:"Speech Changes: 0-2 points",fastEdTime:"Time: Critical factor",fastEdEye:"Eye Deviation: 0-2 points",fastEdDenial:"Denial/Neglect: 0-2 points",criticalValuesTitle:"Critical Values",criticalBp:"Systolic BP > 180: Increased ICH risk",criticalGfap:"GFAP > 500 pg/mL: Significant marker",criticalFastEd:"FAST-ED ≥ 4: Consider LVO",fastEdCalculatorTitle:"FAST-ED Score Calculator",fastEdCalculatorSubtitle:"Click to calculate FAST-ED score components",facialPalsyTitle:"Facial Palsy",facialPalsyNormal:"Normal (0)",facialPalsyMild:"Mild drooping (1)",armWeaknessTitle:"Arm Weakness",armWeaknessNormal:"Normal (0)",armWeaknessMild:"Mild drift (1)",armWeaknessSevere:"Falls immediately (2)",speechChangesTitle:"Speech Changes",speechChangesNormal:"Normal (0)",speechChangesMild:"Slurred speech (1)",speechChangesSevere:"Severe aphasia (2)",eyeDeviationTitle:"Eye Deviation",eyeDeviationNormal:"Normal (0)",eyeDeviationPartial:"Partial gaze palsy (1)",eyeDeviationForced:"Forced deviation (2)",denialNeglectTitle:"Denial/Neglect",denialNeglectNormal:"Normal (0)",denialNeglectPartial:"Partial neglect (1)",denialNeglectComplete:"Complete neglect (2)",totalScoreTitle:"Total FAST-ED Score",riskLevel:"Risk Level",riskLevelLow:"LOW (Score <4)",riskLevelHigh:"HIGH (Score ≥4 - Consider LVO)",applyScore:"Apply Score",cancel:"Cancel",riskAnalysis:"Risk Analysis",riskAnalysisSubtitle:"Clinical factors in this assessment",contributingFactors:"Contributing factors",factorsShown:"shown",positiveFactors:"Positive factors",negativeFactors:"Negative factors",clinicalInformation:"Clinical Information",clinicalRecommendations:"Clinical Recommendations",clinicalRec1:"Consider immediate imaging if ICH risk is high",clinicalRec2:"Activate stroke team for LVO scores ≥ 50%",clinicalRec3:"Monitor blood pressure closely",clinicalRec4:"Document all findings thoroughly",noDriverData:"No driver data available",driverAnalysisUnavailable:"Driver analysis unavailable",driverInfoNotAvailable:"Driver information not available from this prediction model",driverAnalysisNotAvailable:"Driver analysis not available for this prediction",lvoNotPossible:"LVO assessment not possible with limited data",fullExamRequired:"Full neurological examination required for LVO screening",limitedAssessment:"Limited Assessment",disclaimer:"Clinical Disclaimer",disclaimerText:"This tool is for clinical decision support only. Always use clinical judgment and follow local protocols. Not a replacement for physician assessment.",importantNote:"Important",importantText:"These results are for clinical decision support only. Always use clinical judgment and follow institutional protocols.",predictedMortality:"Predicted 30-day mortality",ichVolumeLabel:"ICH Volume",references:"References",inputSummaryTitle:"Input Summary",inputSummarySubtitle:"Values used for this analysis",privacyLink:"Privacy Policy",disclaimerLink:"Medical Disclaimer",versionLink:"Version 2.1.0 - Research Preview",privacyPolicy:"Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.",medicalDisclaimer:"Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.",networkError:"Network error - please check your connection and try again",requestTimeout:"Request timeout - please try again",apiError:"Failed to get results",validationError:"Please check your input values",sessionTimeout:"Your session has been idle for 30 minutes. Would you like to continue?",unsavedData:"You have unsaved data. Are you sure you want to leave?",nearestCentersTitle:"Nearest Stroke Centers",useCurrentLocation:"Use Current Location",enterLocationPlaceholder:"Enter city or address...",enterManually:"Enter Location Manually",search:"Search",yourLocation:"Your Location",recommendedCenters:"Recommended Centers",alternativeCenters:"Alternative Centers",noCentersFound:"No stroke centers found in this area",gettingLocation:"Getting your location",searchingLocation:"Searching location",locationError:"Unable to get your location",locationPermissionDenied:"Location access denied. Please allow location access and try again.",locationUnavailable:"Location information is unavailable",locationTimeout:"Location request timed out",geolocationNotSupported:"Geolocation is not supported by this browser",geocodingNotImplemented:"Location search not available. Please use GPS or enter coordinates manually.",tryManualEntry:"Try entering your location manually or use GPS.",distanceNote:"Distances are calculated as straight-line distances. Actual travel times may vary.",travelTimeNote:"Travel times calculated for emergency vehicles with sirens and priority routing.",calculatingTravelTimes:"Calculating travel times",minutes:"min",poweredByOrs:"Travel times powered by OpenRoute Service",comprehensiveCenter:"Comprehensive Stroke Center",primaryCenter:"Primary Stroke Center",telemetryCenter:"Telemedicine Center",thrombectomy:"Thrombectomy",neurosurgery:"Neurosurgery",icu:"Intensive Care",telemedicine:"Telemedicine",stroke_unit:"Stroke Unit",call:"Call",directions:"Directions",emergency:"Emergency",certified:"Certified"},de:{appTitle:"iGFAP",emergencyBadge:"Notfall-Tool",helpButton:"Hilfe und Anweisungen",darkModeButton:"Dunklen Modus umschalten",languageToggle:"Sprache",step1:"Erstbeurteilung",step2:"Datenerhebung",step3:"Ergebnisse",comaModuleTitle:"Koma-Modul",limitedDataModuleTitle:"Begrenzte Daten Modul",fullStrokeModuleTitle:"Vollständiges Schlaganfall-Modul",triage1Title:"Patientenbeurteilung",triage1Question:"Ist der Patient komatös?",triage1Help:"Glasgow Coma Scale < 8",triage1Yes:"JA - Komatös",triage1No:"NEIN - Bei Bewusstsein",triage2Title:"Untersuchungsfähigkeit",triage2Question:"Kann der Patient zuverlässig untersucht werden?",triage2Help:"Patient ist nicht aphasisch, verwirrt oder unkooperativ",triage2Yes:"JA - Vollständige Untersuchung möglich",triage2No:"NEIN - Nur begrenzte Untersuchung",ageLabel:"Alter (Jahre)",ageHelp:"Patientenalter in Jahren",systolicLabel:"Systolischer RR (mmHg)",systolicHelp:"Systolischer Blutdruck",diastolicLabel:"Diastolischer RR (mmHg)",diastolicHelp:"Diastolischer Blutdruck",gfapLabel:"GFAP-Wert (pg/mL)",gfapHelp:"GFAP-Biomarker-Wert",fastEdLabel:"FAST-ED-Score",fastEdHelp:"FAST-ED-Bewertungsscore (0-9)",headacheLabel:"Kopfschmerzen",vigilanzLabel:"Bewusstseinstrübung",armPareseLabel:"Armschwäche",beinPareseLabel:"Beinschwäche",eyeDeviationLabel:"Blickdeviation",atrialFibLabel:"Vorhofflimmern",anticoagLabel:"Antikoaguliert (NOAK)",antiplateletsLabel:"Thrombozytenaggregationshemmer",analyzeButton:"Analysieren",analyzing:"Analysiere...",printResults:"Ergebnisse drucken",newAssessment:"Neue Bewertung starten",startOver:"Von vorn beginnen",goBack:"Zurück",goHome:"Zur Startseite",basicInformation:"Grundinformationen",biomarkersScores:"Biomarker & Scores",clinicalSymptoms:"Klinische Symptome",medicalHistory:"Anamnese",ageYearsLabel:"Alter (Jahre)",systolicBpLabel:"Systolischer RR (mmHg)",diastolicBpLabel:"Diastolischer RR (mmHg)",gfapValueLabel:"GFAP-Wert (pg/mL)",fastEdScoreLabel:"FAST-ED-Score",ageYearsHelp:"Patientenalter in Jahren",systolicBpHelp:"Normal: 90-140 mmHg",diastolicBpHelp:"Normal: 60-90 mmHg",gfapTooltip:"Hirnverletzungs-Biomarker",gfapTooltipLong:"Glial Fibrillary Acidic Protein - Hirnverletzungs-Biomarker",gfapRange:"Bereich: {min} - {max} pg/mL",fastEdTooltip:"0-9 Skala für LVO-Screening",analyzeIchRisk:"ICB-Risiko analysieren",analyzeStrokeRisk:"Schlaganfall-Risiko analysieren",criticalPatient:"Kritischer Patient",comaAlert:"Patient ist komatös (GCS < 8). Schnelle Beurteilung erforderlich.",vigilanceReduction:"Vigilanzminderung (Verminderte Wachheit)",armParesis:"Armparese",legParesis:"Beinparese",eyeDeviation:"Blickdeviation",atrialFibrillation:"Vorhofflimmern",onNoacDoac:"NOAK/DOAK-Therapie",onAntiplatelets:"Thrombozytenaggregationshemmer",resultsTitle:"Bewertungsergebnisse",bleedingRiskAssessment:"Blutungsrisiko-Bewertung",ichProbability:"ICB-Wahrscheinlichkeit",lvoProbability:"LVO-Wahrscheinlichkeit",lvoMayBePossible:"Großgefäßverschluss möglich - weitere Abklärung empfohlen",riskFactorsTitle:"Hauptrisikofaktoren",increasingRisk:"Risikoerhöhend",decreasingRisk:"Risikomindernd",noFactors:"Keine Faktoren",riskLevel:"Risikostufe",lowRisk:"Niedriges Risiko",mediumRisk:"Mittleres Risiko",highRisk:"Hohes Risiko",riskLow:"Niedrig",riskMedium:"Mittel",riskHigh:"Hoch",riskFactorsAnalysis:"Risikofaktoren",contributingFactors:"Beitragende Faktoren zur Bewertung",riskFactors:"Risikofaktoren",increaseRisk:"ERHÖHEN",decreaseRisk:"VERRINGERN",noPositiveFactors:"Keine erhöhenden Faktoren",noNegativeFactors:"Keine verringernden Faktoren",ichRiskFactors:"ICB-Risikofaktoren",lvoRiskFactors:"LVO-Risikofaktoren",criticalAlertTitle:"KRITISCHES RISIKO ERKANNT",criticalAlertMessage:"Hohe Wahrscheinlichkeit einer intrazerebralen Blutung erkannt.",immediateActionsRequired:"Sofortige Maßnahmen erforderlich",initiateStrokeProtocol:"Schlaganfall-Protokoll sofort einleiten",urgentCtImaging:"Dringende CT-Bildgebung erforderlich",considerBpManagement:"Blutdruckmanagement erwägen",prepareNeurosurgicalConsult:"Neurochirurgische Konsultation vorbereiten",helpTitle:"Kurzreferenzleitfaden",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 8: Komatöser Patient - Koma-Modul verwenden",gcsMod:"GCS 8-12: Mäßige Beeinträchtigung",gcsHigh:"GCS 13-15: Leichte Beeinträchtigung",fastEdTitle:"FAST-ED-Score-Komponenten",fastEdFacial:"Faziale Parese: 0-1 Punkte",fastEdArm:"Armschwäche: 0-2 Punkte",fastEdSpeech:"Sprachveränderungen: 0-2 Punkte",fastEdTime:"Zeit: Kritischer Faktor",fastEdEye:"Blickdeviation: 0-2 Punkte",fastEdDenial:"Verneinung/Neglect: 0-2 Punkte",criticalValuesTitle:"Kritische Werte",criticalBp:"Systolischer RR > 180: Erhöhtes ICB-Risiko",criticalGfap:"GFAP > 500 pg/mL: Signifikanter Marker",criticalFastEd:"FAST-ED ≥ 4: LVO in Betracht ziehen",fastEdCalculatorTitle:"FAST-ED-Score-Rechner",fastEdCalculatorSubtitle:"Klicken Sie, um FAST-ED-Score-Komponenten zu berechnen",facialPalsyTitle:"Fazialisparese",facialPalsyNormal:"Nein (0)",facialPalsyMild:"Ja (1)",armWeaknessTitle:"Armschwäche",armWeaknessNormal:"Normal (0)",armWeaknessMild:"Leichter Armabfall (1)",armWeaknessSevere:"Arm fällt sofort ab (2)",speechChangesTitle:"Sprachveränderungen",speechChangesNormal:"Normal (0)",speechChangesMild:"Verwaschene Sprache (1)",speechChangesSevere:"Schwere Aphasie (2)",eyeDeviationTitle:"Blickdeviation",eyeDeviationNormal:"Normal (0)",eyeDeviationPartial:"Partielle Blickparese (1)",eyeDeviationForced:"Forcierte Blickdeviation (2)",denialNeglectTitle:"Verneinung/Neglect",denialNeglectNormal:"Normal (0)",denialNeglectPartial:"Partieller Neglect (1)",denialNeglectComplete:"Kompletter Neglect (2)",totalScoreTitle:"Gesamt-FAST-ED-Score",riskLevel:"Risikostufe",riskLevelLow:"NIEDRIG (Score <4)",riskLevelHigh:"HOCH (Score ≥4 - LVO erwägen)",applyScore:"Score Anwenden",cancel:"Abbrechen",riskAnalysis:"Risikoanalyse",riskAnalysisSubtitle:"Klinische Faktoren in dieser Bewertung",contributingFactors:"Beitragende Faktoren",factorsShown:"angezeigt",positiveFactors:"Positive Faktoren",negativeFactors:"Negative Faktoren",clinicalInformation:"Klinische Informationen",clinicalRecommendations:"Klinische Empfehlungen",clinicalRec1:"Sofortige Bildgebung erwägen bei hohem ICB-Risiko",clinicalRec2:"Stroke-Team aktivieren bei LVO-Score ≥ 50%",clinicalRec3:"Blutdruck engmaschig überwachen",clinicalRec4:"Alle Befunde gründlich dokumentieren",noDriverData:"Keine Treiberdaten verfügbar",driverAnalysisUnavailable:"Treiberanalyse nicht verfügbar",driverInfoNotAvailable:"Treiberinformationen von diesem Vorhersagemodell nicht verfügbar",driverAnalysisNotAvailable:"Treiberanalyse für diese Vorhersage nicht verfügbar",lvoNotPossible:"LVO-Bewertung mit begrenzten Daten nicht möglich",fullExamRequired:"Vollständige neurologische Untersuchung für LVO-Screening erforderlich",limitedAssessment:"Begrenzte Bewertung",disclaimer:"Klinischer Haftungsausschluss",disclaimerText:"Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle. Kein Ersatz für ärztliche Beurteilung.",importantNote:"Wichtig",importantText:"Diese Ergebnisse dienen nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie institutionelle Protokolle.",predictedMortality:"Vorhergesagte 30-Tage-Mortalität",ichVolumeLabel:"ICB-Volumen",references:"Referenzen",inputSummaryTitle:"Eingabezusammenfassung",inputSummarySubtitle:"Für diese Analyse verwendete Werte",privacyLink:"Datenschutzrichtlinie",disclaimerLink:"Medizinischer Haftungsausschluss",versionLink:"Version 2.1.0 - Research Preview",privacyPolicy:"Datenschutzrichtlinie: Dieses Tool verarbeitet Daten lokal. Keine Patientendaten werden gespeichert oder übertragen.",medicalDisclaimer:"Medizinischer Haftungsausschluss: Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle.",networkError:"Netzwerkfehler - bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut",requestTimeout:"Anfrage-Timeout - bitte versuchen Sie es erneut",apiError:"Ergebnisse konnten nicht abgerufen werden",validationError:"Bitte überprüfen Sie Ihre Eingabewerte",sessionTimeout:"Ihre Sitzung war 30 Minuten lang inaktiv. Möchten Sie fortfahren?",unsavedData:"Sie haben ungespeicherte Daten. Sind Sie sicher, dass Sie verlassen möchten?",nearestCentersTitle:"Nächstgelegene Schlaganfall-Zentren",useCurrentLocation:"Aktuellen Standort verwenden",enterLocationPlaceholder:"Stadt oder Adresse eingeben...",enterManually:"Standort manuell eingeben",search:"Suchen",yourLocation:"Ihr Standort",recommendedCenters:"Empfohlene Zentren",alternativeCenters:"Alternative Zentren",noCentersFound:"Keine Schlaganfall-Zentren in diesem Bereich gefunden",gettingLocation:"Standort wird ermittelt",searchingLocation:"Standort wird gesucht",locationError:"Standort konnte nicht ermittelt werden",locationPermissionDenied:"Standortzugriff verweigert. Bitte erlauben Sie Standortzugriff und versuchen Sie es erneut.",locationUnavailable:"Standortinformationen sind nicht verfügbar",locationTimeout:"Standortanfrage ist abgelaufen",geolocationNotSupported:"Geolokalisierung wird von diesem Browser nicht unterstützt",geocodingNotImplemented:"Standortsuche nicht verfügbar. Bitte verwenden Sie GPS oder geben Sie Koordinaten manuell ein.",tryManualEntry:"Versuchen Sie, Ihren Standort manuell einzugeben oder GPS zu verwenden.",distanceNote:"Entfernungen werden als Luftlinie berechnet. Tatsächliche Fahrzeiten können variieren.",travelTimeNote:"Fahrzeiten berechnet für Rettungsfahrzeuge mit Sondersignalen und Vorfahrtsberechtigung.",calculatingTravelTimes:"Fahrzeiten werden berechnet",minutes:"Min",poweredByOrs:"Fahrzeiten bereitgestellt von OpenRoute Service",comprehensiveCenter:"Überregionales Schlaganfall-Zentrum",primaryCenter:"Regionales Schlaganfall-Zentrum",telemetryCenter:"Telemedizin-Zentrum",thrombectomy:"Thrombektomie",neurosurgery:"Neurochirurgie",icu:"Intensivstation",telemedicine:"Telemedizin",stroke_unit:"Stroke Unit",call:"Anrufen",directions:"Wegbeschreibung",emergency:"Notfall",certified:"Zertifiziert"}};class ke{constructor(){this.supportedLanguages=["en","de"],this.currentLanguage=this.detectLanguage()}detectLanguage(){const t=localStorage.getItem("language");return t&&this.supportedLanguages.includes(t)?t:(navigator.language||navigator.userLanguage).substring(0,2).toLowerCase()==="de"?"de":"en"}getCurrentLanguage(){return this.currentLanguage}setLanguage(t){return this.supportedLanguages.includes(t)?(this.currentLanguage=t,localStorage.setItem("language",t),window.dispatchEvent(new CustomEvent("languageChanged",{detail:{language:t}})),!0):!1}getSupportedLanguages(){return[...this.supportedLanguages]}t(t){return(q[this.currentLanguage]||q.en)[t]||t}toggleLanguage(){const t=this.currentLanguage==="en"?"de":"en";return this.setLanguage(t)}getLanguageDisplayName(t=null){const e=t||this.currentLanguage;return{en:"English",de:"Deutsch"}[e]||e}formatDateTime(t){const e=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(e,{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(t)}formatTime(t){const e=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(e,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(t)}}const w=new ke,o=a=>w.t(a);function W(){return`
    <div class="container">
      ${T(1)}
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
  `}function Se(){return`
    <div class="container">
      ${T(1)}
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
  `}const L={COMA_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_coma_ich",LDM_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_limited_data_ich",FULL_STROKE:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_full_stroke"},te={ich:{medium:25,high:50},lvo:{medium:25,high:50}},y={min:29,max:10001},V={autoSaveInterval:18e4,sessionTimeout:30*60*1e3,requestTimeout:1e4},we={age_years:{required:!0,min:0,max:120},systolic_bp:{required:!0,min:60,max:300},diastolic_bp:{required:!0,min:30,max:200},gfap_value:{required:!0,min:y.min,max:y.max},fast_ed_score:{required:!0,min:0,max:9}};function Le(){return`
    <div class="container">
      ${T(2)}
      <h2>${o("comaModuleTitle")||"Coma Module"}</h2>
      <form data-module="coma">
        <div class="input-grid">
          <div class="input-group">
            <label for="gfap_value">
              ${o("gfapValueLabel")}
              <span class="tooltip">ℹ️
                <span class="tooltiptext">${o("gfapTooltipLong")}</span>
              </span>
            </label>
            <input type="number" id="gfap_value" name="gfap_value" min="${y.min}" max="${y.max}" step="0.1" required aria-describedby="gfap-help">
            <div id="gfap-help" class="input-help">
              ${o("gfapRange").replace("{min}",y.min).replace("{max}",y.max)}
            </div>
          </div>
        </div>
        <button type="submit" class="primary">${o("analyzeIchRisk")}</button>
        <button type="button" class="secondary" data-action="reset">${o("startOver")}</button>
      </form>
    </div>
  `}function Ee(){return`
    <div class="container">
      ${T(2)}
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
            <input type="number" name="gfap_value" id="gfap_value" min="${y.min}" max="${y.max}" step="0.1" required>
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
  `}function Te(){return`
    <div class="container">
      ${T(2)}
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
            <input type="number" name="gfap_value" id="gfap_value" min="${y.min}" max="${y.max}" step="0.1" required>
          </div>
          <div class="input-group">
            <label for="fast_ed_score">
              ${o("fastEdScoreLabel")}
              <span class="tooltip">ℹ️
                <span class="tooltiptext">${o("fastEdCalculatorSubtitle")}</span>
              </span>
            </label>
            <input type="number" name="fast_ed_score" id="fast_ed_score" min="0" max="9" required readonly placeholder="${o("fastEdCalculatorSubtitle")}" style="cursor: pointer;">
            <input type="hidden" name="armparese" id="armparese_hidden" value="false">
            <input type="hidden" name="eye_deviation" id="eye_deviation_hidden" value="false">
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
              <input type="checkbox" name="beinparese" id="beinparese">
              <span class="checkbox-label">${o("legParesis")}</span>
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
  `}function ae(){return`
    <div class="critical-alert">
      <h4><span class="alert-icon">🚨</span> ${o("criticalAlertTitle")}</h4>
      <p>${o("criticalAlertMessage")}</p>
    </div>
  `}const Ae={age_years:"ageLabel",age:"ageLabel",systolic_bp:"systolicLabel",diastolic_bp:"diastolicLabel",systolic_blood_pressure:"systolicLabel",diastolic_blood_pressure:"diastolicLabel",blood_pressure_systolic:"systolicLabel",blood_pressure_diastolic:"diastolicLabel",gfap_value:"gfapLabel",gfap:"gfapLabel",gfap_level:"gfapLabel",fast_ed_score:"fastEdLabel",fast_ed:"fastEdLabel",fast_ed_total:"fastEdLabel",vigilanzminderung:"vigilanzLabel",vigilance_reduction:"vigilanzLabel",reduced_consciousness:"vigilanzLabel",armparese:"armPareseLabel",arm_paresis:"armPareseLabel",arm_weakness:"armPareseLabel",beinparese:"beinPareseLabel",leg_paresis:"beinPareseLabel",leg_weakness:"beinPareseLabel",eye_deviation:"eyeDeviationLabel",blickdeviation:"eyeDeviationLabel",headache:"headacheLabel",kopfschmerzen:"headacheLabel",atrial_fibrillation:"atrialFibLabel",vorhofflimmern:"atrialFibLabel",anticoagulated_noak:"anticoagLabel",anticoagulation:"anticoagLabel",antiplatelets:"antiplateletsLabel",thrombozytenaggregationshemmer:"antiplateletsLabel"},Ce=[{pattern:/_score$/,replacement:" Score"},{pattern:/_value$/,replacement:" Level"},{pattern:/_bp$/,replacement:" Blood Pressure"},{pattern:/_years?$/,replacement:" (years)"},{pattern:/^ich_/,replacement:"Brain Bleeding "},{pattern:/^lvo_/,replacement:"Large Vessel "},{pattern:/parese$/,replacement:"Weakness"},{pattern:/deviation$/,replacement:"Movement"}];function ie(a){if(!a)return"";const t=Ae[a.toLowerCase()];if(t){const i=o(t);if(i&&i!==t)return i}let e=a.toLowerCase();return Ce.forEach(({pattern:i,replacement:n})=>{e=e.replace(i,n)}),e=e.replace(/_/g," ").replace(/\b\w/g,i=>i.toUpperCase()).trim(),e}function Me(a){return ie(a).replace(/\s*\([^)]*\)\s*/g,"").trim()}function $e(a,t=""){return a==null||a===""?"":typeof a=="boolean"?a?"✓":"✗":typeof a=="number"?t.includes("bp")||t.includes("blood_pressure")?`${a} mmHg`:t.includes("gfap")?`${a} pg/mL`:t.includes("age")?`${a} years`:t.includes("score")||Number.isInteger(a)?a.toString():a.toFixed(1):a.toString()}const se={bayern:{neurosurgicalCenters:[{id:"BY-NS-001",name:"LMU Klinikum München - Großhadern",address:"Marchioninistraße 15, 81377 München",coordinates:{lat:48.1106,lng:11.4684},phone:"+49 89 4400-0",emergency:"+49 89 4400-73331",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1440,network:"TEMPiS"},{id:"BY-NS-002",name:"Klinikum rechts der Isar München (TUM)",address:"Ismaninger Str. 22, 81675 München",coordinates:{lat:48.1497,lng:11.6052},phone:"+49 89 4140-0",emergency:"+49 89 4140-2249",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1161,network:"TEMPiS"},{id:"BY-NS-003",name:"Städtisches Klinikum München Schwabing",address:"Kölner Platz 1, 80804 München",coordinates:{lat:48.1732,lng:11.5755},phone:"+49 89 3068-0",emergency:"+49 89 3068-2050",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:648,network:"TEMPiS"},{id:"BY-NS-004",name:"Städtisches Klinikum München Bogenhausen",address:"Englschalkinger Str. 77, 81925 München",coordinates:{lat:48.1614,lng:11.6254},phone:"+49 89 9270-0",emergency:"+49 89 9270-2050",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:689,network:"TEMPiS"},{id:"BY-NS-005",name:"Universitätsklinikum Erlangen",address:"Maximiliansplatz 2, 91054 Erlangen",coordinates:{lat:49.5982,lng:11.0037},phone:"+49 9131 85-0",emergency:"+49 9131 85-39003",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1371,network:"TEMPiS"},{id:"BY-NS-006",name:"Universitätsklinikum Regensburg",address:"Franz-Josef-Strauß-Allee 11, 93053 Regensburg",coordinates:{lat:49.0134,lng:12.0991},phone:"+49 941 944-0",emergency:"+49 941 944-7501",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1042,network:"TEMPiS"},{id:"BY-NS-007",name:"Universitätsklinikum Würzburg",address:"Oberdürrbacher Str. 6, 97080 Würzburg",coordinates:{lat:49.784,lng:9.9721},phone:"+49 931 201-0",emergency:"+49 931 201-24444",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1264,network:"TEMPiS"},{id:"BY-NS-008",name:"Klinikum Nürnberg Nord",address:"Prof.-Ernst-Nathan-Str. 1, 90419 Nürnberg",coordinates:{lat:49.4521,lng:11.0767},phone:"+49 911 398-0",emergency:"+49 911 398-2369",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1368,network:"TEMPiS"},{id:"BY-NS-009",name:"Universitätsklinikum Augsburg",address:"Stenglinstr. 2, 86156 Augsburg",coordinates:{lat:48.3668,lng:10.9093},phone:"+49 821 400-01",emergency:"+49 821 400-2356",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1740,network:"TEMPiS"},{id:"BY-NS-010",name:"Klinikum Aschaffenburg-Alzenau",address:"Am Hasenkopf 1, 63739 Aschaffenburg",coordinates:{lat:49.9737,lng:9.157},phone:"+49 6021 32-0",emergency:"+49 6021 32-2800",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:40,network:"TRANSIT"},{id:"BY-NS-011",name:"Klinikum Landshut",address:"Robert-Koch-Str. 1, 84034 Landshut",coordinates:{lat:48.5665,lng:12.1512},phone:"+49 871 698-0",emergency:"+49 871 698-3333",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:505,network:"TEMPiS"},{id:"BY-NS-012",name:"Klinikum Coburg",address:"Ketschendorfer Str. 33, 96450 Coburg",coordinates:{lat:50.2596,lng:10.9644},phone:"+49 9561 22-0",emergency:"+49 9561 22-6800",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:547,network:"STENO"},{id:"BY-NS-013",name:"Klinikum Passau",address:"Bischof-Pilgrim-Str. 1, 94032 Passau",coordinates:{lat:48.5665,lng:13.4777},phone:"+49 851 5300-0",emergency:"+49 851 5300-2222",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:696,network:"TEMPiS"}],comprehensiveStrokeCenters:[{id:"BY-CS-001",name:"Klinikum Bamberg",address:"Buger Str. 80, 96049 Bamberg",coordinates:{lat:49.8988,lng:10.9027},phone:"+49 951 503-0",emergency:"+49 951 503-11101",thrombectomy:!0,thrombolysis:!0,beds:630,network:"TEMPiS"},{id:"BY-CS-002",name:"Klinikum Bayreuth",address:"Preuschwitzer Str. 101, 95445 Bayreuth",coordinates:{lat:49.9459,lng:11.5779},phone:"+49 921 400-0",emergency:"+49 921 400-5401",thrombectomy:!0,thrombolysis:!0,beds:848,network:"TEMPiS"},{id:"BY-CS-003",name:"Klinikum Coburg",address:"Ketschendorfer Str. 33, 96450 Coburg",coordinates:{lat:50.2596,lng:10.9685},phone:"+49 9561 22-0",emergency:"+49 9561 22-6300",thrombectomy:!0,thrombolysis:!0,beds:522,network:"TEMPiS"}],regionalStrokeUnits:[{id:"BY-RSU-001",name:"Goldberg-Klinik Kelheim",address:"Traubenweg 3, 93309 Kelheim",coordinates:{lat:48.9166,lng:11.8742},phone:"+49 9441 702-0",emergency:"+49 9441 702-6800",thrombolysis:!0,beds:200,network:"TEMPiS"},{id:"BY-RSU-002",name:"DONAUISAR Klinikum Deggendorf",address:"Perlasberger Str. 41, 94469 Deggendorf",coordinates:{lat:48.8372,lng:12.9619},phone:"+49 991 380-0",emergency:"+49 991 380-2201",thrombolysis:!0,beds:450,network:"TEMPiS"},{id:"BY-RSU-003",name:"Klinikum St. Elisabeth Straubing",address:"St.-Elisabeth-Str. 23, 94315 Straubing",coordinates:{lat:48.8742,lng:12.5733},phone:"+49 9421 710-0",emergency:"+49 9421 710-2000",thrombolysis:!0,beds:580,network:"TEMPiS"},{id:"BY-RSU-004",name:"Klinikum Freising",address:"Mainburger Str. 29, 85356 Freising",coordinates:{lat:48.4142,lng:11.7461},phone:"+49 8161 24-0",emergency:"+49 8161 24-2800",thrombolysis:!0,beds:380,network:"TEMPiS"},{id:"BY-RSU-005",name:"Klinikum Landkreis Erding",address:"Bajuwarenstr. 5, 85435 Erding",coordinates:{lat:48.3061,lng:11.9067},phone:"+49 8122 59-0",emergency:"+49 8122 59-2201",thrombolysis:!0,beds:350,network:"TEMPiS"},{id:"BY-RSU-006",name:"Helios Amper-Klinikum Dachau",address:"Krankenhausstr. 15, 85221 Dachau",coordinates:{lat:48.2599,lng:11.4342},phone:"+49 8131 76-0",emergency:"+49 8131 76-2201",thrombolysis:!0,beds:480,network:"TEMPiS"},{id:"BY-RSU-007",name:"Klinikum Fürstenfeldbruck",address:"Dachauer Str. 33, 82256 Fürstenfeldbruck",coordinates:{lat:48.1772,lng:11.2578},phone:"+49 8141 99-0",emergency:"+49 8141 99-2201",thrombolysis:!0,beds:420,network:"TEMPiS"},{id:"BY-RSU-008",name:"Klinikum Ingolstadt",address:"Krumenauerstraße 25, 85049 Ingolstadt",coordinates:{lat:48.7665,lng:11.4364},phone:"+49 841 880-0",emergency:"+49 841 880-2201",thrombolysis:!0,beds:665,network:"TEMPiS"},{id:"BY-RSU-009",name:"Klinikum Passau",address:"Bischof-Pilgrim-Str. 1, 94032 Passau",coordinates:{lat:48.5665,lng:13.4513},phone:"+49 851 5300-0",emergency:"+49 851 5300-2100",thrombolysis:!0,beds:540,network:"TEMPiS"},{id:"BY-RSU-010",name:"Klinikum Landshut",address:"Robert-Koch-Str. 1, 84034 Landshut",coordinates:{lat:48.5436,lng:12.1619},phone:"+49 871 698-0",emergency:"+49 871 698-3333",thrombolysis:!0,beds:790,network:"TEMPiS"},{id:"BY-RSU-011",name:"RoMed Klinikum Rosenheim",address:"Pettenkoferstr. 10, 83022 Rosenheim",coordinates:{lat:47.8567,lng:12.1265},phone:"+49 8031 365-0",emergency:"+49 8031 365-3711",thrombolysis:!0,beds:870,network:"TEMPiS"},{id:"BY-RSU-012",name:"Klinikum Memmingen",address:"Bismarckstr. 23, 87700 Memmingen",coordinates:{lat:47.9833,lng:10.1833},phone:"+49 8331 70-0",emergency:"+49 8331 70-2500",thrombolysis:!0,beds:520,network:"TEMPiS"},{id:"BY-RSU-013",name:"Klinikum Kempten-Oberallgäu",address:"Robert-Weixler-Str. 50, 87439 Kempten",coordinates:{lat:47.7261,lng:10.3097},phone:"+49 831 530-0",emergency:"+49 831 530-2201",thrombolysis:!0,beds:650,network:"TEMPiS"},{id:"BY-RSU-014",name:"Klinikum Aschaffenburg-Alzenau",address:"Am Hasenkopf 1, 63739 Aschaffenburg",coordinates:{lat:49.9747,lng:9.1581},phone:"+49 6021 32-0",emergency:"+49 6021 32-2700",thrombolysis:!0,beds:590,network:"TEMPiS"}],thrombolysisHospitals:[{id:"BY-TH-001",name:"Krankenhaus Vilsbiburg",address:"Sonnenstraße 10, 84137 Vilsbiburg",coordinates:{lat:48.6333,lng:12.2833},phone:"+49 8741 60-0",thrombolysis:!0,beds:180},{id:"BY-TH-002",name:"Krankenhaus Eggenfelden",address:"Pfarrkirchener Str. 5, 84307 Eggenfelden",coordinates:{lat:48.4,lng:12.7667},phone:"+49 8721 98-0",thrombolysis:!0,beds:220}]},badenWuerttemberg:{neurosurgicalCenters:[{id:"BW-NS-001",name:"Universitätsklinikum Freiburg",address:"Hugstetter Str. 55, 79106 Freiburg",coordinates:{lat:48.0025,lng:7.8347},phone:"+49 761 270-0",emergency:"+49 761 270-34010",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1600,network:"FAST"},{id:"BW-NS-002",name:"Universitätsklinikum Heidelberg",address:"Im Neuenheimer Feld 400, 69120 Heidelberg",coordinates:{lat:49.4178,lng:8.6706},phone:"+49 6221 56-0",emergency:"+49 6221 56-36643",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1621,network:"FAST"},{id:"BW-NS-003",name:"Universitätsklinikum Tübingen",address:"Geissweg 3, 72076 Tübingen",coordinates:{lat:48.5378,lng:9.0538},phone:"+49 7071 29-0",emergency:"+49 7071 29-82211",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1550,network:"FAST"},{id:"BW-NS-004",name:"Universitätsklinikum Ulm",address:"Albert-Einstein-Allee 23, 89081 Ulm",coordinates:{lat:48.4196,lng:9.9592},phone:"+49 731 500-0",emergency:"+49 731 500-63001",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1264,network:"FAST"},{id:"BW-NS-005",name:"Klinikum Stuttgart - Katharinenhospital",address:"Kriegsbergstraße 60, 70174 Stuttgart",coordinates:{lat:48.7784,lng:9.1682},phone:"+49 711 278-0",emergency:"+49 711 278-32001",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:950,network:"FAST"},{id:"BW-NS-006",name:"Städtisches Klinikum Karlsruhe",address:"Moltkestraße 90, 76133 Karlsruhe",coordinates:{lat:49.0047,lng:8.3858},phone:"+49 721 974-0",emergency:"+49 721 974-2301",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1570,network:"FAST"},{id:"BW-NS-007",name:"Klinikum Ludwigsburg",address:"Posilipostraße 4, 71640 Ludwigsburg",coordinates:{lat:48.8901,lng:9.1953},phone:"+49 7141 99-0",emergency:"+49 7141 99-67201",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:720,network:"FAST"}],comprehensiveStrokeCenters:[{id:"BW-CS-001",name:"Universitätsmedizin Mannheim",address:"Theodor-Kutzer-Ufer 1-3, 68167 Mannheim",coordinates:{lat:49.4828,lng:8.4664},phone:"+49 621 383-0",emergency:"+49 621 383-2251",thrombectomy:!0,thrombolysis:!0,beds:1400,network:"FAST"}],regionalStrokeUnits:[{id:"BW-RSU-001",name:"Robert-Bosch-Krankenhaus Stuttgart",address:"Auerbachstraße 110, 70376 Stuttgart",coordinates:{lat:48.7447,lng:9.2294},phone:"+49 711 8101-0",emergency:"+49 711 8101-3456",thrombolysis:!0,beds:850,network:"FAST"}],thrombolysisHospitals:[]},nordrheinWestfalen:{neurosurgicalCenters:[{id:"NRW-NS-001",name:"Universitätsklinikum Düsseldorf",address:"Moorenstraße 5, 40225 Düsseldorf",coordinates:{lat:51.1906,lng:6.8064},phone:"+49 211 81-0",emergency:"+49 211 81-17700",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1300,network:"NEVANO+"},{id:"NRW-NS-002",name:"Universitätsklinikum Köln",address:"Kerpener Str. 62, 50937 Köln",coordinates:{lat:50.9253,lng:6.9187},phone:"+49 221 478-0",emergency:"+49 221 478-32500",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1500,network:"NEVANO+"},{id:"NRW-NS-003",name:"Universitätsklinikum Essen",address:"Hufelandstraße 55, 45147 Essen",coordinates:{lat:51.4285,lng:7.0073},phone:"+49 201 723-0",emergency:"+49 201 723-84444",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1350,network:"NEVANO+"},{id:"NRW-NS-004",name:"Universitätsklinikum Münster",address:"Albert-Schweitzer-Campus 1, 48149 Münster",coordinates:{lat:51.9607,lng:7.6261},phone:"+49 251 83-0",emergency:"+49 251 83-47255",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1513,network:"NEVANO+"},{id:"NRW-NS-005",name:"Universitätsklinikum Bonn",address:"Venusberg-Campus 1, 53127 Bonn",coordinates:{lat:50.6916,lng:7.1127},phone:"+49 228 287-0",emergency:"+49 228 287-15107",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1200,network:"NEVANO+"},{id:"NRW-NS-006",name:"Klinikum Dortmund",address:"Beurhausstraße 40, 44137 Dortmund",coordinates:{lat:51.5036,lng:7.4663},phone:"+49 231 953-0",emergency:"+49 231 953-20050",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1200,network:"NVNR"},{id:"NRW-NS-007",name:"Rhein-Maas Klinikum Würselen",address:"Mauerfeldstraße 25, 52146 Würselen",coordinates:{lat:50.8178,lng:6.1264},phone:"+49 2405 62-0",emergency:"+49 2405 62-2222",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:420,network:"NEVANO+"}],comprehensiveStrokeCenters:[{id:"NRW-CS-001",name:"Universitätsklinikum Aachen",address:"Pauwelsstraße 30, 52074 Aachen",coordinates:{lat:50.778,lng:6.0614},phone:"+49 241 80-0",emergency:"+49 241 80-89611",thrombectomy:!0,thrombolysis:!0,beds:1400,network:"NEVANO+"}],regionalStrokeUnits:[{id:"NRW-RSU-001",name:"Helios Universitätsklinikum Wuppertal",address:"Heusnerstraße 40, 42283 Wuppertal",coordinates:{lat:51.2467,lng:7.1703},phone:"+49 202 896-0",emergency:"+49 202 896-2180",thrombolysis:!0,beds:1050,network:"NEVANO+"}],thrombolysisHospitals:[{id:"NRW-TH-009",name:"Elisabeth-Krankenhaus Essen",address:"Klara-Kopp-Weg 1, 45138 Essen",coordinates:{lat:51.4495,lng:7.0137},phone:"+49 201 897-0",thrombolysis:!0,beds:583},{id:"NRW-TH-010",name:"Klinikum Oberberg Gummersbach",address:"Wilhelm-Breckow-Allee 20, 51643 Gummersbach",coordinates:{lat:51.0277,lng:7.5694},phone:"+49 2261 17-0",thrombolysis:!0,beds:431},{id:"NRW-TH-011",name:"St. Vincenz-Krankenhaus Limburg",address:"Auf dem Schafsberg, 65549 Limburg",coordinates:{lat:50.3856,lng:8.0584},phone:"+49 6431 292-0",thrombolysis:!0,beds:452},{id:"NRW-TH-012",name:"Klinikum Lüdenscheid",address:"Paulmannshöher Straße 14, 58515 Lüdenscheid",coordinates:{lat:51.2186,lng:7.6298},phone:"+49 2351 46-0",thrombolysis:!0,beds:869}]}},Pe={routePatient:function(a){const{location:t,state:e,ichProbability:i,timeFromOnset:n,clinicalFactors:s}=a,r=e||this.detectState(t),c=se[r];if(i>=.5){const l=this.findNearest(t,c.neurosurgicalCenters);if(!l)throw new Error(`No neurosurgical centers available in ${r}`);return{category:"NEUROSURGICAL_CENTER",destination:l,urgency:"IMMEDIATE",reasoning:"High bleeding probability (≥50%) - neurosurgical evaluation required",preAlert:"Activate neurosurgery team",bypassLocal:!0,threshold:"≥50%",state:r}}else if(i>=.3){const l=[...c.neurosurgicalCenters,...c.comprehensiveStrokeCenters];return{category:"COMPREHENSIVE_CENTER",destination:this.findNearest(t,l),urgency:"URGENT",reasoning:"Intermediate bleeding risk (30-50%) - CT and possible intervention",preAlert:"Prepare for possible neurosurgical consultation",transferPlan:this.findNearest(t,c.neurosurgicalCenters),threshold:"30-50%",state:r}}else if(n&&n<=270){const l=[...c.neurosurgicalCenters,...c.comprehensiveStrokeCenters,...c.regionalStrokeUnits,...c.thrombolysisHospitals];return{category:"THROMBOLYSIS_CAPABLE",destination:this.findNearest(t,l),urgency:"TIME_CRITICAL",reasoning:"Low bleeding risk (<30%), within tPA window - nearest thrombolysis",preAlert:"Prepare for thrombolysis protocol",bypassLocal:!1,threshold:"<30%",timeWindow:"≤4.5h",state:r}}else{const l=[...c.neurosurgicalCenters,...c.comprehensiveStrokeCenters,...c.regionalStrokeUnits];return{category:"STROKE_UNIT",destination:this.findNearest(t,l),urgency:"STANDARD",reasoning:n>270?"Low bleeding risk, outside tPA window - standard stroke evaluation":"Low bleeding risk - standard stroke evaluation",preAlert:"Standard stroke protocol",bypassLocal:!1,threshold:"<30%",timeWindow:n?">4.5h":"unknown",state:r}}},detectState:function(a){return a.lat>=47.5&&a.lat<=49.8&&a.lng>=7.5&&a.lng<=10.2?"badenWuerttemberg":a.lat>=50.3&&a.lat<=52.5&&a.lng>=5.9&&a.lng<=9.5?"nordrheinWestfalen":a.lat>=47.2&&a.lat<=50.6&&a.lng>=10.2&&a.lng<=13.8?"bayern":this.findNearestState(a)},findNearestState:function(a){const t={bayern:{lat:49,lng:11.5},badenWuerttemberg:{lat:48.5,lng:9},nordrheinWestfalen:{lat:51.5,lng:7.5}};let e="bayern",i=1/0;for(const[n,s]of Object.entries(t)){const r=this.calculateDistance(a,s);r<i&&(i=r,e=n)}return e},findNearest:function(a,t){return!t||t.length===0?(console.warn("No hospitals available in database"),null):t.map(e=>!e.coordinates||typeof e.coordinates.lat!="number"?(console.warn(`Hospital ${e.name} missing valid coordinates`),null):{...e,distance:this.calculateDistance(a,e.coordinates)}).filter(e=>e!==null).sort((e,i)=>e.distance-i.distance)[0]},calculateDistance:function(a,t){const i=this.toRad(t.lat-a.lat),n=this.toRad(t.lng-a.lng),s=Math.sin(i/2)*Math.sin(i/2)+Math.cos(this.toRad(a.lat))*Math.cos(this.toRad(t.lat))*Math.sin(n/2)*Math.sin(n/2);return 6371*(2*Math.atan2(Math.sqrt(s),Math.sqrt(1-s)))},toRad:function(a){return a*(Math.PI/180)}};function F(a,t,e,i){const s=_(e-a),r=_(i-t),c=Math.sin(s/2)*Math.sin(s/2)+Math.cos(_(a))*Math.cos(_(e))*Math.sin(r/2)*Math.sin(r/2);return 6371*(2*Math.atan2(Math.sqrt(c),Math.sqrt(1-c)))}function _(a){return a*(Math.PI/180)}async function Re(a,t,e,i,n="driving-car"){try{const s=`https://api.openrouteservice.org/v2/directions/${n}`,c=await fetch(s,{method:"POST",headers:{Accept:"application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",Authorization:"5b3ce3597851110001cf624868c4c27b63ae476c9c26c8bffbc35688","Content-Type":"application/json; charset=utf-8"},body:JSON.stringify({coordinates:[[t,a],[i,e]],radiuses:[1e3,1e3],format:"json"})});if(!c.ok)throw new Error(`Routing API error: ${c.status}`);const l=await c.json();if(l.routes&&l.routes.length>0){const d=l.routes[0];return{duration:Math.round(d.summary.duration/60),distance:Math.round(d.summary.distance/1e3),source:"routing"}}else throw new Error("No route found")}catch(s){console.warn("Travel time calculation failed, using distance estimate:",s);const r=F(a,t,e,i);return{duration:Math.round(r/.8),distance:Math.round(r),source:"estimated"}}}async function G(a,t,e,i){try{const n=await Re(a,t,e,i,"driving-car");return{duration:Math.round(n.duration*.75),distance:n.distance,source:n.source==="routing"?"emergency-routing":"emergency-estimated"}}catch{const s=F(a,t,e,i);return{duration:Math.round(s/1.2),distance:Math.round(s),source:"emergency-estimated"}}}function ne(a){return`
    <div class="stroke-center-section">
      <h3>🏥 ${o("nearestCentersTitle")}</h3>
      <div id="locationContainer">
        <div class="location-controls">
          <button type="button" id="useGpsButton" class="secondary">
            📍 ${o("useCurrentLocation")}
          </button>
          <div class="location-manual" style="display: none;">
            <input type="text" id="locationInput" placeholder="${o("enterLocationPlaceholder")||"e.g. München, Köln, Stuttgart, or 48.1351, 11.5820"}" />
            <button type="button" id="searchLocationButton" class="secondary">${o("search")}</button>
          </div>
          <button type="button" id="manualLocationButton" class="secondary">
            ✏️ ${o("enterManually")}
          </button>
        </div>
        <div id="strokeCenterResults" class="stroke-center-results"></div>
      </div>
    </div>
  `}function Ie(a){const t=document.getElementById("useGpsButton"),e=document.getElementById("manualLocationButton"),i=document.querySelector(".location-manual"),n=document.getElementById("locationInput"),s=document.getElementById("searchLocationButton"),r=document.getElementById("strokeCenterResults");t&&t.addEventListener("click",()=>{Ne(a,r)}),e&&e.addEventListener("click",()=>{i.style.display=i.style.display==="none"?"block":"none"}),s&&s.addEventListener("click",()=>{const c=n.value.trim();c&&Y(c,a,r)}),n&&n.addEventListener("keypress",c=>{if(c.key==="Enter"){const l=n.value.trim();l&&Y(l,a,r)}})}function Ne(a,t){if(!navigator.geolocation){R(o("geolocationNotSupported"),t);return}t.innerHTML=`<div class="loading">${o("gettingLocation")}...</div>`,navigator.geolocation.getCurrentPosition(e=>{const{latitude:i,longitude:n}=e.coords;z(i,n,a,t)},e=>{let i=o("locationError");switch(e.code){case e.PERMISSION_DENIED:i=o("locationPermissionDenied");break;case e.POSITION_UNAVAILABLE:i=o("locationUnavailable");break;case e.TIMEOUT:i=o("locationTimeout");break}R(i,t)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:3e5})}async function Y(a,t,e){e.innerHTML=`<div class="loading">${o("searchingLocation")}...</div>`;const i=/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/,n=a.trim().match(i);if(n){const s=parseFloat(n[1]),r=parseFloat(n[2]);if(s>=47.2&&s<=52.5&&r>=5.9&&r<=15){e.innerHTML=`
        <div class="location-success">
          <p>📍 Coordinates: ${s.toFixed(4)}, ${r.toFixed(4)}</p>
        </div>
      `,setTimeout(()=>{z(s,r,t,e)},500);return}else{R("Coordinates appear to be outside Germany. Please check the values.",e);return}}try{let s=a.trim();!s.toLowerCase().includes("deutschland")&&!s.toLowerCase().includes("germany")&&!s.toLowerCase().includes("bayern")&&!s.toLowerCase().includes("bavaria")&&!s.toLowerCase().includes("nordrhein")&&!s.toLowerCase().includes("baden")&&(s=s+", Deutschland");const c=`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(s)}&countrycodes=de&format=json&limit=3&addressdetails=1`,l=await fetch(c,{method:"GET",headers:{Accept:"application/json","User-Agent":"iGFAP-StrokeTriage/2.1.0"}});if(!l.ok)throw new Error(`Geocoding API error: ${l.status}`);const d=await l.json();if(d&&d.length>0){let u=d[0];const p=["Bayern","Baden-Württemberg","Nordrhein-Westfalen"];for(const h of d)if(h.address&&p.includes(h.address.state)){u=h;break}const b=parseFloat(u.lat),f=parseFloat(u.lon),m=u.display_name||a;e.innerHTML=`
        <div class="location-success">
          <p>📍 Found: ${m}</p>
          <small style="color: #666;">Lat: ${b.toFixed(4)}, Lng: ${f.toFixed(4)}</small>
        </div>
      `,setTimeout(()=>{z(b,f,t,e)},1e3)}else R(`
        <strong>Location "${a}" not found.</strong><br>
        <small>Try:</small>
        <ul style="text-align: left; font-size: 0.9em; margin: 10px 0;">
          <li>City name: "München", "Köln", "Stuttgart"</li>
          <li>Address: "Marienplatz 1, München"</li>
          <li>Coordinates: "48.1351, 11.5820"</li>
        </ul>
      `,e)}catch(s){console.warn("Geocoding failed:",s),R(`
      <strong>Unable to search location.</strong><br>
      <small>Please try entering coordinates directly (e.g., "48.1351, 11.5820")</small>
    `,e)}}async function z(a,t,e,i){var c,l;const n={lat:a,lng:t},s=Pe.routePatient({location:n,ichProbability:((c=e==null?void 0:e.ich)==null?void 0:c.probability)||0,timeFromOnset:(e==null?void 0:e.timeFromOnset)||null,clinicalFactors:(e==null?void 0:e.clinicalFactors)||{}});if(!s||!s.destination){i.innerHTML=`
      <div class="location-error">
        <p>⚠️ No suitable stroke centers found in this area.</p>
        <p><small>Please try a different location or contact emergency services directly.</small></p>
      </div>
    `;return}const r=De(s,e);i.innerHTML=`
    <div class="location-info">
      <p><strong>${o("yourLocation")}:</strong> ${a.toFixed(4)}, ${t.toFixed(4)}</p>
      <p><strong>Detected State:</strong> ${j(s.state)}</p>
    </div>
    <div class="loading">${o("calculatingTravelTimes")}...</div>
  `;try{const d=se[s.state],u=[...d.neurosurgicalCenters,...d.comprehensiveStrokeCenters,...d.regionalStrokeUnits,...d.thrombolysisHospitals||[]],p=s.destination;p.distance=F(a,t,p.coordinates.lat,p.coordinates.lng);try{const m=await G(a,t,p.coordinates.lat,p.coordinates.lng);p.travelTime=m.duration,p.travelSource=m.source}catch{p.travelTime=Math.round(p.distance/.8),p.travelSource="estimated"}const b=u.filter(m=>m.id!==p.id).map(m=>({...m,distance:F(a,t,m.coordinates.lat,m.coordinates.lng)})).sort((m,h)=>m.distance-h.distance).slice(0,3);for(const m of b)try{const h=await G(a,t,m.coordinates.lat,m.coordinates.lng);m.travelTime=h.duration,m.travelSource=h.source}catch{m.travelTime=Math.round(m.distance/.8),m.travelSource="estimated"}const f=`
      <div class="location-info">
        <p><strong>${o("yourLocation")}:</strong> ${a.toFixed(4)}, ${t.toFixed(4)}</p>
        <p><strong>State:</strong> ${j(s.state)}</p>
        ${r}
      </div>
      
      <div class="recommended-centers">
        <h4>🏥 ${s.urgency==="IMMEDIATE"?"Emergency":"Recommended"} Destination</h4>
        ${J(p,!0,s)}
      </div>
      
      ${b.length>0?`
        <div class="alternative-centers">
          <h4>Alternative Centers</h4>
          ${b.map(m=>J(m,!1,s)).join("")}
        </div>
      `:""}
      
      <div class="travel-time-note">
        <small>${o("travelTimeNote")||"Travel times estimated for emergency vehicles"}</small>
      </div>
    `;i.innerHTML=f}catch(d){console.warn("Enhanced routing failed, using basic display:",d),i.innerHTML=`
      <div class="location-info">
        <p><strong>${o("yourLocation")}:</strong> ${a.toFixed(4)}, ${t.toFixed(4)}</p>
        ${r}
      </div>
      
      <div class="recommended-centers">
        <h4>Recommended Center</h4>
        <div class="stroke-center-card recommended">
          <div class="center-header">
            <h5>${s.destination.name}</h5>
            <span class="distance">${((l=s.destination.distance)==null?void 0:l.toFixed(1))||"?"} km</span>
          </div>
          <div class="center-details">
            <p class="address">📍 ${s.destination.address}</p>
            <p class="phone">📞 ${s.destination.emergency||s.destination.phone}</p>
          </div>
        </div>
      </div>
      
      <div class="routing-reasoning">
        <p><strong>Routing Logic:</strong> ${s.reasoning}</p>
      </div>
    `}}function j(a){return{bayern:"Bayern (Bavaria)",badenWuerttemberg:"Baden-Württemberg",nordrheinWestfalen:"Nordrhein-Westfalen (NRW)"}[a]||a}function De(a,t){var n;const e=Math.round((((n=t==null?void 0:t.ich)==null?void 0:n.probability)||0)*100);let i="🏥";return a.urgency==="IMMEDIATE"?i="🚨":a.urgency==="TIME_CRITICAL"?i="⏰":a.urgency==="URGENT"&&(i="⚠️"),`
    <div class="routing-explanation ${a.category.toLowerCase()}">
      <div class="routing-header">
        <strong>${i} ${a.category.replace("_"," ")} - ${a.urgency}</strong>
      </div>
      <div class="routing-details">
        <p><strong>ICH Risk:</strong> ${e}% ${a.threshold?`(${a.threshold})`:""}</p>
        ${a.timeWindow?`<p><strong>Time Window:</strong> ${a.timeWindow}</p>`:""}
        <p><strong>Routing Logic:</strong> ${a.reasoning}</p>
        <p><strong>Pre-Alert:</strong> ${a.preAlert}</p>
        ${a.bypassLocal?'<p class="bypass-warning">⚠️ Bypassing local hospitals</p>':""}
      </div>
    </div>
  `}function J(a,t,e){const i=[];a.neurosurgery&&i.push("🧠 Neurosurgery"),a.thrombectomy&&i.push("🩸 Thrombectomy"),a.thrombolysis&&i.push("💉 Thrombolysis");const n=a.network?`<span class="network-badge">${a.network}</span>`:"";return`
    <div class="stroke-center-card ${t?"recommended":"alternative"} enhanced">
      <div class="center-header">
        <h5>${a.name}</h5>
        <div class="center-badges">
          ${a.neurosurgery?'<span class="capability-badge neurosurgery">NS</span>':""}
          ${a.thrombectomy?'<span class="capability-badge thrombectomy">TE</span>':""}
          ${n}
        </div>
      </div>
      
      <div class="center-metrics">
        ${a.travelTime?`
          <div class="travel-info">
            <span class="travel-time">${a.travelTime} min</span>
            <span class="distance">${a.distance.toFixed(1)} km</span>
          </div>
        `:`
          <div class="distance-only">
            <span class="distance">${a.distance.toFixed(1)} km</span>
          </div>
        `}
        <div class="bed-info">
          <span class="beds">${a.beds} beds</span>
        </div>
      </div>
      
      <div class="center-details">
        <p class="address">📍 ${a.address}</p>
        <p class="phone">📞 ${a.emergency||a.phone}</p>
        
        ${i.length>0?`
          <div class="capabilities">
            ${i.join(" • ")}
          </div>
        `:""}
      </div>
      
      <div class="center-actions">
        <button class="call-button" onclick="window.open('tel:${a.emergency||a.phone}')">
          📞 Call
        </button>
        <button class="directions-button" onclick="window.open('https://maps.google.com/maps?daddr=${a.coordinates.lat},${a.coordinates.lng}', '_blank')">
          🧭 Directions
        </button>
      </div>
    </div>
  `}function R(a,t){t.innerHTML=`
    <div class="location-error">
      <p>⚠️ ${a}</p>
      <p><small>${o("tryManualEntry")}</small></p>
    </div>
  `}function Be(a,t){const e=Number(a),i=te[t];return e>=i.high?"🔴 HIGH RISK":e>=i.medium?"🟡 MEDIUM RISK":"🟢 LOW RISK"}const O={moderate:{min:10},high:{min:20},critical:{min:30}};function re(a){if(!a||a<=0)return{volume:0,volumeRange:{min:0,max:0},riskLevel:"low",mortalityRate:"~0%",isValid:!0,calculation:"No hemorrhage detected"};const t=Math.min(a,1e4);a>1e4&&console.warn(`GFAP value ${a} exceeds expected range, capped at 10,000 pg/ml`);try{const e=.0192+.4533*Math.log10(t),i=Math.pow(10,e),n={min:i*.7,max:i*1.3},s=_e(i),r=Fe(i),c=i<1?"<1":i.toFixed(1);return{volume:i,displayVolume:c,volumeRange:{min:n.min.toFixed(1),max:n.max.toFixed(1)},riskLevel:s,mortalityRate:r,isValid:!0,calculation:`Based on GFAP ${a} pg/ml`,threshold:i>=30?"SURGICAL":i>=20?"HIGH_RISK":"MANAGEABLE"}}catch(e){return console.error("Volume calculation error:",e),{volume:0,volumeRange:{min:0,max:0},riskLevel:"low",mortalityRate:"Unknown",isValid:!1,calculation:"Calculation error",error:e.message}}}function _e(a){return a>=O.critical.min?"critical":a>=O.high.min?"high":a>=O.moderate.min?"moderate":"low"}function Fe(a){return a<10?"5-10%⁴":a<30?`${Math.round(10+(a-10)*9/20)}%⁴`:a<50?`${Math.round(19+(a-30)*25/20)}%³`:a<60?`${Math.round(44+(a-50)*47/10)}%²`:a<80?`${Math.round(91+(a-60)*5/20)}%¹`:"96-100%¹"}function He(a){return a<1?"<1 ml":a<10?`${a.toFixed(1)} ml`:`${Math.round(a)} ml`}function xe(a){if(!a||a<=0)return`
      <div class="volume-circle" data-volume="0">
        <div class="volume-number">0<span> ml</span></div>
        <canvas class="volume-canvas" width="120" height="120"></canvas>
      </div>
    `;const t=He(a),e=`volume-canvas-${Math.random().toString(36).substr(2,9)}`;return`
    <div class="volume-circle" data-volume="${a}">
      <div class="volume-number">${t}</div>
      <canvas id="${e}" class="volume-canvas" 
              data-volume="${a}" data-canvas-id="${e}"></canvas>
    </div>
  `}function Oe(){document.querySelectorAll(".volume-canvas").forEach(t=>{const e=t.offsetWidth||120,i=t.offsetHeight||120;t.width=e,t.height=i;const n=parseFloat(t.dataset.volume)||0;n>0&&Ve(t,n)})}function Ve(a,t){const e=a.getContext("2d"),i=a.width/2,n=a.height/2,s=a.width*.45;let r=0,c=!0;const l=document.body.classList.contains("dark-mode")||window.matchMedia("(prefers-color-scheme: dark)").matches;function d(){c&&(e.clearRect(0,0,a.width,a.height),u())}function u(){const m=Math.min(t/80,.9)*(s*1.8),h=n+s-4-m;if(t>0){e.save(),e.beginPath(),e.arc(i,n,s-4,0,Math.PI*2),e.clip(),e.fillStyle="#dc2626",e.globalAlpha=.7,e.fillRect(0,h+5,a.width,a.height),e.globalAlpha=.9,e.fillStyle="#dc2626",e.beginPath();let k=i-s+4;e.moveTo(k,h);for(let v=k;v<=i+s-4;v+=2){const pe=Math.sin(v*.05+r*.08)*3,he=Math.sin(v*.08+r*.12+1)*2,be=h+pe+he;e.lineTo(v,be)}e.lineTo(i+s-4,a.height),e.lineTo(k,a.height),e.closePath(),e.fill(),e.restore()}const A=getComputedStyle(document.documentElement).getPropertyValue("--text-secondary").trim()||(l?"#8899a6":"#6c757d");e.strokeStyle=A,e.lineWidth=8,e.globalAlpha=.4,e.beginPath(),e.arc(i,n,s,0,Math.PI*2),e.stroke(),e.globalAlpha=1;const M=Math.min(t/100,1),$=getComputedStyle(document.documentElement).getPropertyValue("--danger-color").trim()||"#dc2626";e.strokeStyle=$,e.lineWidth=8,e.setLineDash([]),e.lineCap="round",e.beginPath(),e.arc(i,n,s,-Math.PI/2,-Math.PI/2+M*2*Math.PI),e.stroke(),r+=1,t>0&&requestAnimationFrame(d)}d();const p=new MutationObserver(()=>{document.contains(a)||(c=!1,p.disconnect())});p.observe(document.body,{childList:!0,subtree:!0})}class D{static calculateProbability(t,e){if(!t||!e||t<=0||e<=0)return{probability:0,confidence:0,isValid:!1,reason:"Invalid inputs: age and GFAP required"};if(t<18||t>120)return{probability:0,confidence:0,isValid:!1,reason:`Age ${t} outside valid range (18-120 years)`};(e<10||e>2e4)&&console.warn(`GFAP ${e} outside typical range (10-20000 pg/ml)`);try{const i=(t-this.PARAMS.age.mean)/this.PARAMS.age.std,n=(e-this.PARAMS.gfap.mean)/this.PARAMS.gfap.std,s=this.PARAMS.coefficients.intercept+this.PARAMS.coefficients.age*i+this.PARAMS.coefficients.gfap*n,r=1/(1+Math.exp(-s)),c=r*100,l=Math.abs(r-.5)*2,d=this.getRiskCategory(c);return{probability:Math.round(c*10)/10,confidence:Math.round(l*100)/100,logit:Math.round(s*1e3)/1e3,riskCategory:d,scaledInputs:{age:Math.round(i*1e3)/1e3,gfap:Math.round(n*1e3)/1e3},rawInputs:{age:t,gfap:e},isValid:!0,calculationMethod:"logistic_regression_age_gfap"}}catch(i){return console.error("Legacy model calculation error:",i),{probability:0,confidence:0,isValid:!1,reason:"Calculation error",error:i.message}}}static getRiskCategory(t){return t<10?{level:"very_low",color:"#10b981",label:"Very Low Risk",description:"Minimal ICH likelihood"}:t<25?{level:"low",color:"#84cc16",label:"Low Risk",description:"Below typical threshold"}:t<50?{level:"moderate",color:"#f59e0b",label:"Moderate Risk",description:"Elevated concern"}:t<75?{level:"high",color:"#f97316",label:"High Risk",description:"Significant likelihood"}:{level:"very_high",color:"#dc2626",label:"Very High Risk",description:"Critical ICH probability"}}static compareModels(t,e){if(!t||!e||!e.isValid)return{isValid:!1,reason:"Invalid model results for comparison"};let i=t.probability||0;i<=1&&(i=i*100);const n=e.probability||0,s=i-n,r=n>0?s/n*100:0,c=i>n?"main":n>i?"legacy":"equal";let l;const d=Math.abs(s);return d<5?l="strong":d<15?l="moderate":d<30?l="weak":l="poor",{isValid:!0,probabilities:{main:Math.round(i*10)/10,legacy:Math.round(n*10)/10},differences:{absolute:Math.round(s*10)/10,relative:Math.round(r*10)/10},agreement:{level:l,higherRiskModel:c},interpretation:this.getComparisonInterpretation(s,l)}}static getComparisonInterpretation(t,e){const i=Math.abs(t);return e==="strong"?{type:"concordant",message:"Models show strong agreement",implication:"Age and GFAP are primary risk factors"}:i>20?{type:"divergent",message:"Significant model disagreement",implication:"Complex model captures additional risk factors not in age/GFAP"}:{type:"moderate_difference",message:"Models show moderate difference",implication:"Additional factors provide incremental predictive value"}}static runValidationTests(){const e=[{age:65,gfap:100,expected:"low",description:"Younger patient, low GFAP"},{age:75,gfap:500,expected:"moderate",description:"Average age, moderate GFAP"},{age:85,gfap:1e3,expected:"high",description:"Older patient, high GFAP"},{age:70,gfap:2e3,expected:"very_high",description:"High GFAP dominates"},{age:90,gfap:50,expected:"very_low",description:"Low GFAP despite age"}].map(s=>{const r=this.calculateProbability(s.age,s.gfap);return{...s,result:r,passed:r.isValid&&r.riskCategory.level===s.expected}}),i=e.filter(s=>s.passed).length,n=e.length;return{summary:{passed:i,total:n,passRate:Math.round(i/n*100)},details:e}}static getModelMetadata(){return{name:"Legacy ICH Model",type:"Logistic Regression",version:"1.0.0",features:["age","gfap"],performance:{rocAuc:.789,recall:.4,precision:.86,f1Score:.55,specificity:.94},trainingData:{samples:"Historical cohort",dateRange:"Research study period",validation:"Cross-validation"},limitations:["Only uses age and GFAP - ignores clinical symptoms","Lower recall (40%) - misses some ICH cases","No time-to-onset consideration","No blood pressure or medication factors","Simplified feature set for baseline comparison"],purpose:"Research baseline for evaluating complex model improvements"}}}B(D,"PARAMS",{age:{mean:74.59,std:12.75},gfap:{mean:665.23,std:2203.77},coefficients:{intercept:.3248,age:-.2108,gfap:3.1631}});function ze(a){try{const t=(a==null?void 0:a.age_years)||(a==null?void 0:a.age)||null,e=(a==null?void 0:a.gfap_value)||(a==null?void 0:a.gfap)||null;return!t||!e?null:D.calculateProbability(t,e)}catch(t){return console.warn("Legacy ICH calculation failed (non-critical):",t),null}}class C{static logComparison(t){try{const e={id:this.generateEntryId(),timestamp:new Date().toISOString(),sessionId:this.getSessionId(),...t},i=this.getStoredData();return i.entries.push(e),i.entries.length>this.MAX_ENTRIES&&(i.entries=i.entries.slice(-this.MAX_ENTRIES)),i.lastUpdated=new Date().toISOString(),i.totalComparisons=i.entries.length,localStorage.setItem(this.STORAGE_KEY,JSON.stringify(i)),console.log(`📊 Research data logged (${i.totalComparisons} comparisons)`),!0}catch(e){return console.warn("Research data logging failed (non-critical):",e),!1}}static getStoredData(){try{const t=localStorage.getItem(this.STORAGE_KEY);if(!t)return this.createEmptyDataset();const e=JSON.parse(t);return!e.entries||!Array.isArray(e.entries)?(console.warn("Invalid research data structure, resetting"),this.createEmptyDataset()):e}catch(t){return console.warn("Failed to load research data, creating new:",t),this.createEmptyDataset()}}static createEmptyDataset(){return{version:"1.0.0",created:new Date().toISOString(),lastUpdated:null,totalComparisons:0,entries:[],metadata:{app:"iGFAP Stroke Triage",purpose:"Model comparison research",dataRetention:"Local storage only"}}}static exportAsCSV(){const t=this.getStoredData();if(!t.entries||t.entries.length===0)return"No research data available for export";const e=["timestamp","session_id","age","gfap_value","main_model_probability","main_model_module","legacy_model_probability","legacy_model_confidence","absolute_difference","relative_difference","agreement_level","higher_risk_model"],i=t.entries.map(s=>{var r,c,l,d,u,p,b,f,m,h,A,M,$,k;return[s.timestamp,s.sessionId,((r=s.inputs)==null?void 0:r.age)||"",((c=s.inputs)==null?void 0:c.gfap)||"",((l=s.main)==null?void 0:l.probability)||"",((d=s.main)==null?void 0:d.module)||"",((u=s.legacy)==null?void 0:u.probability)||"",((p=s.legacy)==null?void 0:p.confidence)||"",((f=(b=s.comparison)==null?void 0:b.differences)==null?void 0:f.absolute)||"",((h=(m=s.comparison)==null?void 0:m.differences)==null?void 0:h.relative)||"",((M=(A=s.comparison)==null?void 0:A.agreement)==null?void 0:M.level)||"",((k=($=s.comparison)==null?void 0:$.agreement)==null?void 0:k.higherRiskModel)||""].join(",")});return[e.join(","),...i].join(`
`)}static exportAsJSON(){const t=this.getStoredData();return JSON.stringify(t,null,2)}static downloadData(t="csv"){try{const e=t==="csv"?this.exportAsCSV():this.exportAsJSON(),i=`igfap-research-${Date.now()}.${t}`,n=new Blob([e],{type:t==="csv"?"text/csv":"application/json"}),s=URL.createObjectURL(n),r=document.createElement("a");return r.href=s,r.download=i,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(s),console.log(`📥 Downloaded research data: ${i}`),!0}catch(e){return console.error("Failed to download research data:",e),!1}}static clearData(){try{return localStorage.removeItem(this.STORAGE_KEY),console.log("🗑️ Research data cleared"),!0}catch(t){return console.warn("Failed to clear research data:",t),!1}}static getDataSummary(){var s,r;const t=this.getStoredData();if(!t.entries||t.entries.length===0)return{totalEntries:0,dateRange:null,avgDifference:null};const e=t.entries,i=e.map(c=>{var l,d;return(d=(l=c.comparison)==null?void 0:l.differences)==null?void 0:d.absolute}).filter(c=>c!=null),n=i.length>0?i.reduce((c,l)=>c+Math.abs(l),0)/i.length:0;return{totalEntries:e.length,dateRange:{first:(s=e[0])==null?void 0:s.timestamp,last:(r=e[e.length-1])==null?void 0:r.timestamp},avgAbsoluteDifference:Math.round(n*10)/10,storageSize:JSON.stringify(t).length}}static generateEntryId(){return Date.now().toString(36)+Math.random().toString(36).substr(2)}static getSessionId(){let t=sessionStorage.getItem("research_session_id");return t||(t="session_"+Date.now().toString(36),sessionStorage.setItem("research_session_id",t)),t}}B(C,"STORAGE_KEY","igfap_research_data"),B(C,"MAX_ENTRIES",1e3);function Ke(a,t,e){try{if(!E())return;const i={inputs:{age:e.age_years||e.age,gfap:e.gfap_value||e.gfap,module:a.module||"unknown"},main:{probability:a.probability,module:a.module,confidence:a.confidence},legacy:t,comparison:t?D.compareModels(a,t):null};C.logComparison(i)}catch(i){console.warn("Research logging failed (non-critical):",i)}}function E(a=null){var t;if(a==="coma")return!1;if(a==="limited"||a==="full")return!0;if(typeof window<"u")try{const e=window.store||((t=require("../state/store.js"))==null?void 0:t.store);if(e){const i=e.getState().formData;return i.limited||i.full}}catch{}return!1}function oe(){return""}function le(a,t,e){if(!(t!=null&&t.isValid))return console.log("🔬 Legacy model results invalid:",t),`
      <div class="research-panel" id="researchPanel" style="display: none;">
        <div class="research-header">
          <h4>🔬 Model Comparison (Research)</h4>
          <button class="close-research" id="closeResearch">×</button>
        </div>
        <div class="research-error">
          <p>⚠️ Legacy model calculation failed</p>
          <small>Debug: ${(t==null?void 0:t.reason)||"Unknown error"}</small>
        </div>
      </div>
    `;const i=D.compareModels(a,t);return`
    <div class="research-panel" id="researchPanel" style="display: none;">
      <div class="research-header">
        <h4>🔬 Model Comparison (Research)</h4>
        <button class="close-research" id="closeResearch">×</button>
      </div>
      
      <div class="model-comparison">
        ${Ue(a,t)}
        ${qe(i)}
        ${We(t,e)}
        ${Ge()}
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
  `}function Ue(a,t){let e=a.probability||0;e<=1&&(e=e*100);const i=t.probability||0;return`
    <div class="probability-comparison">
      <div class="bar-group">
        <label class="bar-label">Main Model (Complex) - ${a.module||"Unknown"}</label>
        <div class="probability-bar">
          <div class="bar-fill main-model" style="width: ${Math.min(e,100)}%">
            <span class="bar-value">${e.toFixed(1)}%</span>
          </div>
        </div>
      </div>
      
      <div class="bar-group">
        <label class="bar-label">Legacy Model (Age + GFAP Only)</label>
        <div class="probability-bar">
          <div class="bar-fill legacy-model" style="width: ${Math.min(i,100)}%">
            <span class="bar-value">${i.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  `}function qe(a){if(!a.isValid)return'<div class="comparison-error">Unable to compare models</div>';const{differences:t,agreement:e}=a;return`
    <div class="difference-analysis">
      <div class="difference-metric">
        <span class="metric-label">Difference:</span>
        <span class="metric-value ${t.absolute>0?"higher":"lower"}">
          ${t.absolute>0?"+":""}${t.absolute}%
        </span>
      </div>
      
      <div class="agreement-level">
        <span class="metric-label">Agreement:</span>
        <span class="agreement-badge ${e.level}">
          ${e.level.charAt(0).toUpperCase()+e.level.slice(1)}
        </span>
      </div>
      
      <div class="interpretation">
        <p class="interpretation-text">${a.interpretation.message}</p>
        <small class="interpretation-detail">${a.interpretation.implication}</small>
      </div>
    </div>
  `}function We(a,t){return`
    <div class="calculation-details" id="calculationDetails" style="display: none;">
      <h5>Legacy Model Calculation</h5>
      <div class="calculation-steps">
        <div class="step">
          <strong>Inputs:</strong> Age ${t.age}, GFAP ${t.gfap} pg/ml
        </div>
        <div class="step">
          <strong>Scaling:</strong> Age → ${a.scaledInputs.age}, GFAP → ${a.scaledInputs.gfap}
        </div>
        <div class="step">
          <strong>Logit:</strong> ${a.logit}
        </div>
        <div class="step">
          <strong>Probability:</strong> ${a.probability}% (Confidence: ${(a.confidence*100).toFixed(0)}%)
        </div>
      </div>
    </div>
  `}function Ge(){const a=D.getModelMetadata();return`
    <div class="model-metrics">
      <h5>Performance Comparison</h5>
      <div class="metrics-grid">
        <div class="metric-item">
          <span class="metric-name">ROC-AUC</span>
          <span class="metric-value">Legacy: ${a.performance.rocAuc}</span>
        </div>
        <div class="metric-item">
          <span class="metric-name">Recall</span>
          <span class="metric-value">Legacy: ${(a.performance.recall*100).toFixed(0)}%</span>
        </div>
        <div class="metric-item">
          <span class="metric-name">Precision</span>
          <span class="metric-value">Legacy: ${(a.performance.precision*100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  `}function Ye(){if(!document.getElementById("researchPanel"))return;const t=document.getElementById("closeResearch");t&&t.addEventListener("click",()=>{const s=document.getElementById("researchPanel");s&&(s.style.display="none")});const e=document.getElementById("exportResearchData");e&&e.addEventListener("click",()=>{C.downloadData("csv")});const i=document.getElementById("toggleCalculationDetails");i&&i.addEventListener("click",()=>{const s=document.getElementById("calculationDetails");s&&(s.style.display=s.style.display==="none"?"block":"none",i.textContent=s.style.display==="none"?"🧮 Details":"🧮 Hide")});const n=document.getElementById("clearResearchData");n&&n.addEventListener("click",()=>{if(confirm("Clear all research data? This cannot be undone.")){C.clearData();const s=C.getDataSummary();console.log(`Data cleared. Total entries: ${s.totalEntries}`)}}),console.log("🔬 Research mode initialized")}function ce(){const t=g.getState().formData;if(!t||Object.keys(t).length===0)return"";let e="";return Object.entries(t).forEach(([i,n])=>{if(n&&Object.keys(n).length>0){const s=o(`${i}ModuleTitle`)||i.charAt(0).toUpperCase()+i.slice(1);let r="";Object.entries(n).forEach(([c,l])=>{if(l===""||l===null||l===void 0)return;let d=Me(c),u=$e(l,c);r+=`
          <div class="summary-item">
            <span class="summary-label">${d}:</span>
            <span class="summary-value">${u}</span>
          </div>
        `}),r&&(e+=`
          <div class="summary-module">
            <h4>${s}</h4>
            <div class="summary-items">
              ${r}
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
  `:""}function de(a,t,e){if(!t)return"";const i=Math.round((t.probability||0)*100),n=Be(i,a),s=i>70,r=i>te[a].high,c={ich:"🩸",lvo:"🧠"},l={ich:o("ichProbability"),lvo:o("lvoProbability")},d={ich:"ICH",lvo:w.getCurrentLanguage()==="de"?"Großgefäßverschluss":"Large Vessel Occlusion"};return`
    <div class="enhanced-risk-card ${a} ${s?"critical":r?"high":"normal"}">
      <div class="risk-header">
        <div class="risk-icon">${c[a]}</div>
        <div class="risk-title">
          <h3>${l[a]}</h3>
          <span class="risk-subtitle">${d[a]}</span>
          <span class="risk-module">${t.module} Module</span>
        </div>
      </div>
      
      <div class="risk-probability">
        <div class="circles-container">
          <div class="rings-row">
            <div class="circle-item">
              <div class="probability-circle" data-percent="${i}">
                <div class="probability-number">${i}<span>%</span></div>
                <svg class="probability-ring" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="var(--text-secondary)" stroke-width="8" opacity="0.4"/>
                  <circle cx="60" cy="60" r="54" fill="none" stroke-width="8" 
                          stroke-dasharray="${2*Math.PI*54}" 
                          stroke-dashoffset="${2*Math.PI*54*(1-i/100)}"
                          stroke-linecap="round" 
                          transform="rotate(-90 60 60)"
                          class="probability-progress"/>
                </svg>
              </div>
              <div class="circle-label">ICH Risk</div>
            </div>
            
            ${i>=50?`
              <div class="circle-item">
                ${je(t)}
                <div class="circle-label">${o("ichVolumeLabel")}</div>
              </div>
            `:""}
          </div>
          
          <div class="risk-level ${s?"critical":r?"high":"normal"}">
            ${n}
          </div>
        </div>
        
        <div class="risk-assessment">
          ${i>=50&&H()>0?`
            <div class="mortality-assessment">
              ${o("predictedMortality")}: ${re(H()).mortalityRate}
            </div>
          `:""}
        </div>
      </div>
    </div>
  `}function je(a){const t=a.gfap_value||H();if(!t||t<=0)return"";const e=re(t);return`
    <div class="volume-display-container">
      ${xe(e.volume)}
    </div>
  `}function H(){var e;const t=g.getState().formData;for(const i of["coma","limited","full"])if((e=t[i])!=null&&e.gfap_value)return parseFloat(t[i].gfap_value);return 0}function Je(a,t){const{ich:e,lvo:i}=a,n=at(e),s=n!=="coma"?et():null;console.log("🔬 Research Debug - Always Active:",{module:n,researchEnabled:E(n),mainResults:e,legacyResults:s,patientInputs:I(),legacyCalculationAttempted:n!=="coma"}),s&&E(n)&&Ke(e,s,I());const r=(e==null?void 0:e.module)==="Limited"||(e==null?void 0:e.module)==="Coma"||(i==null?void 0:i.notPossible)===!0;e==null||e.module;let c;return r?c=Ze(e,a,t,s,n):c=Qe(e,i,a,t,s,n),setTimeout(()=>{Oe()},100),c}function Ze(a,t,e,i,n){const s=a&&a.probability>.6?ae():"",r=ne(),c=ce(),l=E(n)?oe():"",d=i&&E(n)?le(a,i,I()):"",u=(a==null?void 0:a.module)==="Coma"?tt(a.probability):"";return`
    <div class="container">
      ${T(3)}
      <h2>${o("bleedingRiskAssessment")||"Blutungsrisiko-Bewertung / Bleeding Risk Assessment"}</h2>
      ${s}
      
      <!-- Single ICH Risk Card -->
      <div class="risk-results-single">
        ${de("ich",a)}
      </div>
      
      <!-- Alternative Diagnoses for Coma Module -->
      ${u}
      
      <!-- Research Model Comparison (hidden unless research mode) -->
      ${d}
      
      <!-- ICH Drivers Only (not shown for Coma module) -->
      ${(a==null?void 0:a.module)!=="Coma"?`
        <div class="enhanced-drivers-section">
          <h3>${o("riskFactorsTitle")||"Hauptrisikofaktoren / Main Risk Factors"}</h3>
          ${ue(a)}
        </div>
      `:""}
      
      <!-- Collapsible Additional Information -->
      <div class="additional-info-section">
        <button class="info-toggle" data-target="input-summary">
          <span class="toggle-icon">📋</span>
          <span class="toggle-text">${o("inputSummaryTitle")}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="input-summary" style="display: none;">
          ${c}
        </div>
        
        <button class="info-toggle" data-target="stroke-centers">
          <span class="toggle-icon">🏥</span>
          <span class="toggle-text">${o("nearestCentersTitle")}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="stroke-centers" style="display: none;">
          ${r}
        </div>
      </div>
      
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
      
      ${me(a)}
      ${l}
    </div>
  `}function Qe(a,t,e,i,n,s){const r=Math.round(((a==null?void 0:a.probability)||0)*100),c=Math.round(((t==null?void 0:t.probability)||0)*100),l=a&&a.probability>.6?ae():"",d=ne(),u=ce(),p=E(s)?oe():"",b=n&&E(s)?le(a,n,I()):"",f=r<30&&c>50;return`
    <div class="container">
      ${T(3)}
      <h2>${o("resultsTitle")}</h2>
      ${l}
      
      <!-- Primary ICH Risk Display -->
      <div class="risk-results-single">
        ${de("ich",a)}
        ${f?Xe():""}
      </div>
      
      <!-- Research Model Comparison (hidden unless research mode) -->
      ${b}
      
      <!-- ICH Drivers Only -->
      <div class="enhanced-drivers-section">
        <h3>${o("riskFactorsTitle")||"Risikofaktoren / Risk Factors"}</h3>
        ${ue(a)}
      </div>
      
      <!-- Collapsible Additional Information -->
      <div class="additional-info-section">
        <button class="info-toggle" data-target="input-summary">
          <span class="toggle-icon">📋</span>
          <span class="toggle-text">${o("inputSummaryTitle")}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="input-summary" style="display: none;">
          ${u}
        </div>
        
        <button class="info-toggle" data-target="stroke-centers">
          <span class="toggle-icon">🏥</span>
          <span class="toggle-text">${o("nearestCentersTitle")}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="stroke-centers" style="display: none;">
          ${d}
        </div>
      </div>
      
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
      
      ${me(a)}
      ${p}
    </div>
  `}function Xe(){return`
    <div class="secondary-notification">
      <p class="lvo-possible">
        ⚡ ${o("lvoMayBePossible")||"Großgefäßverschluss möglich / Large vessel occlusion possible"}
      </p>
    </div>
  `}function ue(a){if(!a||!a.drivers)return'<p class="no-drivers">No driver data available</p>';const t=a.drivers;if(!t.positive&&!t.negative)return'<p class="no-drivers">Driver format error</p>';const e=t.positive||[],i=t.negative||[];return`
    <div class="drivers-split-view">
      <div class="drivers-column positive-column">
        <div class="column-header">
          <span class="column-icon">⬆</span>
          <span class="column-title">${o("increasingRisk")||"Risikoerhöhend / Increasing Risk"}</span>
        </div>
        <div class="compact-drivers">
          ${e.length>0?e.slice(0,5).map(n=>Z(n,"positive")).join(""):`<p class="no-factors">${o("noFactors")||"Keine Faktoren / No factors"}</p>`}
        </div>
      </div>
      
      <div class="drivers-column negative-column">
        <div class="column-header">
          <span class="column-icon">⬇</span>
          <span class="column-title">${o("decreasingRisk")||"Risikomindernd / Decreasing Risk"}</span>
        </div>
        <div class="compact-drivers">
          ${i.length>0?i.slice(0,5).map(n=>Z(n,"negative")).join(""):`<p class="no-factors">${o("noFactors")||"Keine Faktoren / No factors"}</p>`}
        </div>
      </div>
    </div>
  `}function Z(a,t){const e=Math.abs(a.weight*100),i=Math.min(e*2,100);return`
    <div class="compact-driver-item">
      <div class="compact-driver-label">${ie(a.label)}</div>
      <div class="compact-driver-bar ${t}" style="width: ${i}%;">
        <span class="compact-driver-value">${e.toFixed(1)}%</span>
      </div>
    </div>
  `}function me(a){if(!a||!a.probability||Math.round((a.probability||0)*100)<50)return"";const e=H();return!e||e<=0?"":`
    <div class="bibliography-section">
      <h4>${o("references")}</h4>
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
  `}function et(a){try{const t=I();if(console.log("🔍 Legacy calculation inputs:",t),!t.age||!t.gfap)return console.warn("🔍 Missing required inputs for legacy model:",{age:t.age,gfap:t.gfap}),null;const e=ze(t);return console.log("🔍 Legacy calculation result:",e),e}catch(t){return console.warn("Legacy model calculation failed (non-critical):",t),null}}function I(){const t=g.getState().formData;console.log("🔍 Debug formData structure:",t);let e=null,i=null;for(const s of["coma","limited","full"])t[s]&&(console.log(`🔍 ${s} module data:`,t[s]),e=e||t[s].age_years,i=i||t[s].gfap_value);const n={age:parseInt(e)||null,gfap:parseFloat(i)||null};return console.log("🔍 Extracted patient inputs:",n),n}function tt(a){const t=Math.round(a*100),e=w.getCurrentLanguage()==="de";return t>25?`
      <div class="alternative-diagnosis-card">
        <div class="diagnosis-header">
          <span class="lightning-icon">⚡</span>
          <h3>${e?"Differentialdiagnosen":"Differential Diagnoses"}</h3>
        </div>
        <div class="diagnosis-content">
          <ul class="diagnosis-list">
            <li>
              ${e?"Alternative Diagnosen sind SAB, SDH, EDH (Subarachnoidalblutung, Subduralhämatom, Epiduralhämatom)":"Alternative diagnoses include SAH, SDH, EDH (Subarachnoid Hemorrhage, Subdural Hematoma, Epidural Hematoma)"}
            </li>
            <li>
              ${e?"Bei unklarem Zeitfenster seit Symptombeginn oder im erweiterten Zeitfenster kommen auch ein demarkierter Infarkt oder hypoxischer Hirnschaden in Frage":"In cases of unclear time window since symptom onset or extended time window, demarcated infarction or hypoxic brain injury should also be considered"}
            </li>
          </ul>
        </div>
      </div>
    `:`
      <div class="alternative-diagnosis-card">
        <div class="diagnosis-header">
          <span class="lightning-icon">⚡</span>
          <h3>${e?"Differentialdiagnosen":"Differential Diagnoses"}</h3>
        </div>
        <div class="diagnosis-content">
          <ul class="diagnosis-list">
            <li>
              ${e?"Alternative Diagnose von Vigilanzminderung wahrscheinlich":"Alternative diagnosis for reduced consciousness likely"}
            </li>
            <li>
              ${e?"Ein Verschluss der Arteria Basilaris ist nicht ausgeschlossen":"Basilar artery occlusion cannot be excluded"}
            </li>
          </ul>
        </div>
      </div>
    `}function at(a){if(!(a!=null&&a.module))return"unknown";const t=a.module.toLowerCase();return t.includes("coma")?"coma":t.includes("limited")?"limited":t.includes("full")?"full":"unknown"}function it(a,t,e){const i=[];return e.required&&!t&&t!==0&&i.push("This field is required"),e.min!==void 0&&t!==""&&!isNaN(t)&&parseFloat(t)<e.min&&i.push(`Value must be at least ${e.min}`),e.max!==void 0&&t!==""&&!isNaN(t)&&parseFloat(t)>e.max&&i.push(`Value must be at most ${e.max}`),e.pattern&&!e.pattern.test(t)&&i.push("Invalid format"),i}function st(a){let t=!0;const e={};return Object.entries(we).forEach(([i,n])=>{const s=a.elements[i];if(s){const r=it(i,s.value,n);r.length>0&&(e[i]=r,t=!1)}}),{isValid:t,validationErrors:e}}function nt(a,t){Object.entries(t).forEach(([e,i])=>{const n=a.querySelector(`[name="${e}"]`);if(n){const s=n.closest(".input-group");if(s){s.classList.add("error"),s.querySelectorAll(".error-message").forEach(c=>c.remove());const r=document.createElement("div");r.className="error-message",r.innerHTML=`<span class="error-icon">⚠️</span> ${i[0]}`,s.appendChild(r)}}})}function rt(a){a.querySelectorAll(".input-group.error").forEach(t=>{t.classList.remove("error"),t.querySelectorAll(".error-message").forEach(e=>e.remove())})}function Q(a,t){var r,c;console.log(`=== EXTRACTING ${t.toUpperCase()} DRIVERS ===`),console.log("Full response:",a);let e=null;if(t==="ICH"?(e=((r=a.ich_prediction)==null?void 0:r.drivers)||null,console.log("🧠 ICH raw drivers extracted:",e)):t==="LVO"&&(e=((c=a.lvo_prediction)==null?void 0:c.drivers)||null,console.log("🩸 LVO raw drivers extracted:",e)),!e)return console.log(`❌ No ${t} drivers found`),null;const i=ot(e,t);console.log(`✅ ${t} drivers formatted:`,i);const s=[...i.positive,...i.negative].find(l=>l.label&&(l.label.toLowerCase().includes("fast")||l.label.includes("fast_ed")));return s?console.log(`🎯 FAST-ED found in ${t}:`,`${s.label}: ${s.weight>0?"+":""}${s.weight.toFixed(4)}`):console.log(`⚠️  FAST-ED NOT found in ${t} drivers`),i}function ot(a,t){console.log(`🔄 Formatting ${t} drivers from dictionary:`,a);const e=[],i=[];return Object.entries(a).forEach(([n,s])=>{typeof s=="number"&&(s>0?e.push({label:n,weight:s}):s<0&&i.push({label:n,weight:Math.abs(s)}))}),e.sort((n,s)=>s.weight-n.weight),i.sort((n,s)=>s.weight-n.weight),console.log(`📈 ${t} positive drivers:`,e.slice(0,5)),console.log(`📉 ${t} negative drivers:`,i.slice(0,5)),{kind:"flat_dictionary",units:"logit",positive:e,negative:i,meta:{}}}function X(a,t){var i,n;console.log(`=== EXTRACTING ${t.toUpperCase()} PROBABILITY ===`);let e=0;return t==="ICH"?(e=((i=a.ich_prediction)==null?void 0:i.probability)||0,console.log("🧠 ICH probability extracted:",e)):t==="LVO"&&(e=((n=a.lvo_prediction)==null?void 0:n.probability)||0,console.log("🩸 LVO probability extracted:",e)),e}function ee(a,t){var i,n;let e=.85;return t==="ICH"?e=((i=a.ich_prediction)==null?void 0:i.confidence)||.85:t==="LVO"&&(e=((n=a.lvo_prediction)==null?void 0:n.confidence)||.85),e}async function lt(){console.log("Warming up Cloud Functions...");const a=Object.values(L).map(async t=>{try{const e=new AbortController,i=setTimeout(()=>e.abort(),3e3);await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({}),signal:e.signal,mode:"cors"}),clearTimeout(i),console.log(`Warmed up: ${t}`)}catch{console.log(`Warm-up attempt for ${t.split("/").pop()} completed`)}});Promise.all(a).then(()=>{console.log("Cloud Functions warm-up complete")})}class S extends Error{constructor(t,e,i){super(t),this.name="APIError",this.status=e,this.url=i}}function K(a){const t={...a};return Object.keys(t).forEach(e=>{const i=t[e];(typeof i=="boolean"||i==="on"||i==="true"||i==="false")&&(t[e]=i===!0||i==="on"||i==="true"?1:0)}),t}function x(a,t=0){const e=parseFloat(a);return isNaN(e)?t:e}async function U(a,t){const e=new AbortController,i=setTimeout(()=>e.abort(),V.requestTimeout);try{const n=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(t),signal:e.signal,mode:"cors"});if(clearTimeout(i),!n.ok){let r=`HTTP ${n.status}`;try{const c=await n.json();r=c.error||c.message||r}catch{r=`${r}: ${n.statusText}`}throw new S(r,n.status,a)}return await n.json()}catch(n){throw clearTimeout(i),n.name==="AbortError"?new S("Request timeout - please try again",408,a):n instanceof S?n:new S("Network error - please check your connection and try again",0,a)}}async function ct(a){const t=K(a);console.log("Coma ICH API Payload:",t);try{const e=await U(L.COMA_ICH,t);return console.log("Coma ICH API Response:",e),{probability:x(e.probability||e.ich_probability,0),drivers:e.drivers||null,confidence:x(e.confidence,.75),module:"Coma"}}catch(e){throw console.error("Coma ICH prediction failed:",e),new S(`Failed to get ICH prediction: ${e.message}`,e.status,L.COMA_ICH)}}async function dt(a){const t={age_years:a.age_years,systolic_bp:a.systolic_bp,diastolic_bp:a.diastolic_bp,gfap_value:a.gfap_value,vigilanzminderung:a.vigilanzminderung||0},e=K(t);console.log("Limited Data ICH API Payload:",e);try{const i=await U(L.LDM_ICH,e);return console.log("Limited Data ICH API Response:",i),{probability:x(i.probability||i.ich_probability,0),drivers:i.drivers||null,confidence:x(i.confidence,.65),module:"Limited Data"}}catch(i){throw console.error("Limited Data ICH prediction failed:",i),new S(`Failed to get ICH prediction: ${i.message}`,i.status,L.LDM_ICH)}}async function ut(a){var i,n,s,r,c,l;const t={age_years:a.age_years,systolic_bp:a.systolic_bp,diastolic_bp:a.diastolic_bp,gfap_value:a.gfap_value,fast_ed_score:a.fast_ed_score,headache:a.headache||0,vigilanzminderung:a.vigilanzminderung||0,armparese:a.armparese||0,beinparese:a.beinparese||0,eye_deviation:a.eye_deviation||0,atrial_fibrillation:a.atrial_fibrillation||0,anticoagulated_noak:a.anticoagulated_noak||0,antiplatelets:a.antiplatelets||0},e=K(t);console.log("=== BACKEND DATA MAPPING TEST ==="),console.log("📤 Full Stroke API Payload:",e),console.log("🧪 Clinical Variables Being Sent:"),console.log("  📊 FAST-ED Score:",e.fast_ed_score),console.log("  🩸 Systolic BP:",e.systolic_bp),console.log("  🩸 Diastolic BP:",e.diastolic_bp),console.log("  🧬 GFAP Value:",e.gfap_value),console.log("  👤 Age:",e.age_years),console.log("  🤕 Headache:",e.headache),console.log("  😵 Vigilanz:",e.vigilanzminderung),console.log("  💪 Arm Parese:",e.armparese),console.log("  🦵 Leg Parese:",e.beinparese),console.log("  👁️ Eye Deviation:",e.eye_deviation),console.log("  💓 Atrial Fib:",e.atrial_fibrillation),console.log("  💊 Anticoag NOAK:",e.anticoagulated_noak),console.log("  💊 Antiplatelets:",e.antiplatelets);try{const d=await U(L.FULL_STROKE,e);console.log("📥 Full Stroke API Response:",d),console.log("🔑 Available keys in response:",Object.keys(d)),console.log("=== BACKEND MAPPING VERIFICATION ===");const u=JSON.stringify(d).toLowerCase();console.log("🔍 Backend Feature Name Analysis:"),console.log('  Contains "fast":',u.includes("fast")),console.log('  Contains "ed":',u.includes("ed")),console.log('  Contains "fast_ed":',u.includes("fast_ed")),console.log('  Contains "systolic":',u.includes("systolic")),console.log('  Contains "diastolic":',u.includes("diastolic")),console.log('  Contains "gfap":',u.includes("gfap")),console.log('  Contains "age":',u.includes("age")),console.log('  Contains "headache":',u.includes("headache")),console.log("🧠 ICH driver sources:"),console.log("  response.ich_prediction?.drivers:",(i=d.ich_prediction)==null?void 0:i.drivers),console.log("  response.ich_drivers:",d.ich_drivers),console.log("  response.ich?.drivers:",(n=d.ich)==null?void 0:n.drivers),console.log("  response.drivers?.ich:",(s=d.drivers)==null?void 0:s.ich),console.log("🩸 LVO driver sources:"),console.log("  response.lvo_prediction?.drivers:",(r=d.lvo_prediction)==null?void 0:r.drivers),console.log("  response.lvo_drivers:",d.lvo_drivers),console.log("  response.lvo?.drivers:",(c=d.lvo)==null?void 0:c.drivers),console.log("  response.drivers?.lvo:",(l=d.drivers)==null?void 0:l.lvo),Object.keys(d).forEach(k=>{const v=d[k];typeof v=="number"&&v>=0&&v<=1&&console.log(`Potential probability field: ${k} = ${v}`)});const p=X(d,"ICH"),b=X(d,"LVO"),f=Q(d,"ICH"),m=Q(d,"LVO"),h=ee(d,"ICH"),A=ee(d,"LVO");return console.log("✅ Clean extraction results:"),console.log("  ICH:",{probability:p,hasDrivers:!!f}),console.log("  LVO:",{probability:b,hasDrivers:!!m}),{ich:{probability:p,drivers:f,confidence:h,module:"Full Stroke"},lvo:{probability:b,drivers:m,confidence:A,module:"Full Stroke"}}}catch(d){throw console.error("Full Stroke prediction failed:",d),new S(`Failed to get stroke predictions: ${d.message}`,d.status,L.FULL_STROKE)}}const mt=()=>(w.getCurrentLanguage(),[{id:"acute_deficit",labelDE:"Akutes (schweres) neurologisches Defizit vorhanden",labelEN:"Acute (severe) neurological deficit present",checked:!1},{id:"symptom_onset",labelDE:"Symptombeginn innerhalb 6h",labelEN:"Symptom onset within 6 hours",checked:!1},{id:"no_preexisting",labelDE:"Keine vorbestehende schwere neurologische Defizite",labelEN:"No pre-existing severe neurological deficits",checked:!1},{id:"no_trauma",labelDE:"Kein Schädelhirntrauma vorhanden",labelEN:"No traumatic brain injury present",checked:!1}]);function gt(){const a=w.getCurrentLanguage()==="de",t=mt();return`
    <div id="prerequisitesModal" class="modal prerequisites-modal" style="display: flex;">
      <div class="modal-content prerequisites-content">
        <div class="modal-header">
          <h2>${a?"Voraussetzungen für Schlaganfall-Triage":"Prerequisites for Stroke Triage"}</h2>
          <button class="modal-close" id="closePrerequisites">&times;</button>
        </div>
        
        <div class="modal-body">
          <p class="prerequisites-intro">
            ${a?"Bitte bestätigen Sie, dass alle folgenden Voraussetzungen erfüllt sind:":"Please confirm that all of the following prerequisites are met:"}
          </p>
          
          <div class="prerequisites-list">
            ${t.map(e=>`
              <div class="prerequisite-item" data-id="${e.id}">
                <label class="toggle-switch">
                  <input type="checkbox" id="${e.id}" class="toggle-input">
                  <span class="toggle-slider"></span>
                </label>
                <span class="prerequisite-label">
                  ${a?e.labelDE:e.labelEN}
                </span>
              </div>
            `).join("")}
          </div>
          
          <div class="prerequisites-warning" id="prerequisitesWarning" style="display: none;">
            <span class="warning-icon">⚠️</span>
            <span class="warning-text">
              ${a?"Alle Voraussetzungen müssen erfüllt sein, um fortzufahren":"All prerequisites must be met to continue"}
            </span>
          </div>
        </div>
        
        <div class="modal-footer">
          <button type="button" class="secondary" id="cancelPrerequisites">
            ${a?"Abbrechen":"Cancel"}
          </button>
          <button type="button" class="primary" id="confirmPrerequisites">
            ${a?"Weiter":"Continue"}
          </button>
        </div>
      </div>
    </div>
  `}function pt(){const a=document.getElementById("prerequisitesModal");if(!a)return;const t=document.getElementById("closePrerequisites"),e=document.getElementById("cancelPrerequisites"),i=document.getElementById("confirmPrerequisites"),n=()=>{a.style.display="none",N("welcome")};t==null||t.addEventListener("click",n),e==null||e.addEventListener("click",n),i==null||i.addEventListener("click",()=>{const r=a.querySelectorAll(".toggle-input");if(Array.from(r).every(l=>l.checked))a.style.display="none",N("triage2");else{const l=document.getElementById("prerequisitesWarning");l&&(l.style.display="flex",l.classList.add("shake"),setTimeout(()=>l.classList.remove("shake"),500))}});const s=a.querySelectorAll(".toggle-input");s.forEach(r=>{r.addEventListener("change",()=>{const c=Array.from(s).every(d=>d.checked),l=document.getElementById("prerequisitesWarning");c&&l&&(l.style.display="none")})})}function ht(){const a=document.getElementById("prerequisitesModal");if(a){a.querySelectorAll(".toggle-input").forEach(i=>i.checked=!1);const e=document.getElementById("prerequisitesWarning");e&&(e.style.display="none"),a.style.display="flex"}else{const t=gt();document.body.insertAdjacentHTML("beforeend",t),pt()}}function bt(a){g.logEvent("triage1_answer",{comatose:a}),a?N("coma"):ht()}function ft(a){g.logEvent("triage2_answer",{examinable:a}),N(a?"full":"limited")}function N(a){g.logEvent("navigate",{from:g.getState().currentScreen,to:a}),g.navigate(a),window.scrollTo(0,0)}function vt(){g.hasUnsavedData()&&!confirm("Are you sure you want to start over? All entered data will be lost.")||(g.logEvent("reset"),g.reset())}function yt(){console.log("goBack() called");const a=g.goBack();console.log("goBack() success:",a),a?(g.logEvent("navigate_back"),window.scrollTo(0,0)):(console.log("No history available, going home instead"),ge())}function ge(){console.log("goHome() called"),g.logEvent("navigate_home"),g.goHome(),window.scrollTo(0,0)}async function kt(a,t){a.preventDefault();const e=a.target,i=e.dataset.module,n=st(e);if(!n.isValid){nt(t,n.validationErrors);return}const s={};Array.from(e.elements).forEach(l=>{if(l.name)if(l.type==="checkbox")s[l.name]=l.checked;else if(l.type==="number"){const d=parseFloat(l.value);s[l.name]=isNaN(d)?0:d}else l.type==="hidden"&&l.name==="armparese"?s[l.name]=l.value==="true":s[l.name]=l.value}),console.log("Collected form inputs:",s),g.setFormData(i,s);const r=e.querySelector("button[type=submit]"),c=r?r.innerHTML:"";r&&(r.disabled=!0,r.innerHTML=`<span class="loading-spinner"></span> ${o("analyzing")}`);try{let l;switch(i){case"coma":l={ich:await ct(s),lvo:null};break;case"limited":l={ich:await dt(s),lvo:{notPossible:!0}};break;case"full":l=await ut(s);break;default:throw new Error("Unknown module: "+i)}g.setResults(l),g.logEvent("models_complete",{module:i,results:l}),N("results")}catch(l){console.error("Error running models:",l);let d="An error occurred during analysis. Please try again.";l instanceof S&&(d=l.message),St(t,d),r&&(r.disabled=!1,r.innerHTML=c)}}function St(a,t){a.querySelectorAll(".critical-alert").forEach(n=>{var s,r;(r=(s=n.querySelector("h4"))==null?void 0:s.textContent)!=null&&r.includes("Error")&&n.remove()});const e=document.createElement("div");e.className="critical-alert",e.innerHTML=`<h4><span class="alert-icon">⚠️</span> Error</h4><p>${t}</p>`;const i=a.querySelector(".container");i?i.prepend(e):a.prepend(e),setTimeout(()=>e.remove(),1e4)}function wt(a){const t=document.createElement("div");t.className="sr-only",t.setAttribute("role","status"),t.setAttribute("aria-live","polite");const e={triage1:"Coma assessment",triage2:"Examination capability assessment",coma:"Coma module",limited:"Limited data module",full:"Full stroke assessment",results:"Assessment results"};t.textContent=`Navigated to ${e[a]||a}`,document.body.appendChild(t),setTimeout(()=>t.remove(),1e3)}function Lt(a){const t={triage1:"Initial Assessment - Stroke Triage Assistant",triage2:"Examination Capability - Stroke Triage Assistant",coma:"Coma Module - Stroke Triage Assistant",limited:"Limited Data Module - Stroke Triage Assistant",full:"Full Stroke Module - Stroke Triage Assistant",results:"Assessment Results - Stroke Triage Assistant"};document.title=t[a]||"Stroke Triage Assistant"}function Et(){setTimeout(()=>{const a=document.querySelector("h2");a&&(a.setAttribute("tabindex","-1"),a.focus(),setTimeout(()=>a.removeAttribute("tabindex"),100))},100)}class Tt{constructor(){this.scores={facial_palsy:0,arm_weakness:0,speech_changes:0,eye_deviation:0,denial_neglect:0},this.onApply=null,this.modal=null}getTotal(){return Object.values(this.scores).reduce((t,e)=>t+e,0)}getRiskLevel(){return this.getTotal()>=4?"high":"low"}render(){const t=this.getTotal(),e=this.getRiskLevel();return`
      <div id="fastEdModal" class="modal" role="dialog" aria-labelledby="fastEdModalTitle" aria-hidden="true" style="display: none !important;">
        <div class="modal-content fast-ed-modal">
          <div class="modal-header">
            <h2 id="fastEdModalTitle">${o("fastEdCalculatorTitle")}</h2>
            <button class="modal-close" aria-label="Close">&times;</button>
          </div>
          <div class="modal-body">
            
            <!-- Facial Palsy -->
            <div class="fast-ed-component">
              <h3>${o("facialPalsyTitle")}</h3>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="facial_palsy" value="0" ${this.scores.facial_palsy===0?"checked":""}>
                  <span class="radio-label">${o("facialPalsyNormal")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="facial_palsy" value="1" ${this.scores.facial_palsy===1?"checked":""}>
                  <span class="radio-label">${o("facialPalsyMild")}</span>
                </label>
              </div>
            </div>

            <!-- Arm Weakness -->
            <div class="fast-ed-component">
              <h3>${o("armWeaknessTitle")}</h3>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="arm_weakness" value="0" ${this.scores.arm_weakness===0?"checked":""}>
                  <span class="radio-label">${o("armWeaknessNormal")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="arm_weakness" value="1" ${this.scores.arm_weakness===1?"checked":""}>
                  <span class="radio-label">${o("armWeaknessMild")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="arm_weakness" value="2" ${this.scores.arm_weakness===2?"checked":""}>
                  <span class="radio-label">${o("armWeaknessSevere")}</span>
                </label>
              </div>
            </div>

            <!-- Speech Changes -->
            <div class="fast-ed-component">
              <h3>${o("speechChangesTitle")}</h3>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="speech_changes" value="0" ${this.scores.speech_changes===0?"checked":""}>
                  <span class="radio-label">${o("speechChangesNormal")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="speech_changes" value="1" ${this.scores.speech_changes===1?"checked":""}>
                  <span class="radio-label">${o("speechChangesMild")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="speech_changes" value="2" ${this.scores.speech_changes===2?"checked":""}>
                  <span class="radio-label">${o("speechChangesSevere")}</span>
                </label>
              </div>
            </div>

            <!-- Eye Deviation -->
            <div class="fast-ed-component">
              <h3>${o("eyeDeviationTitle")}</h3>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="eye_deviation" value="0" ${this.scores.eye_deviation===0?"checked":""}>
                  <span class="radio-label">${o("eyeDeviationNormal")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="eye_deviation" value="1" ${this.scores.eye_deviation===1?"checked":""}>
                  <span class="radio-label">${o("eyeDeviationPartial")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="eye_deviation" value="2" ${this.scores.eye_deviation===2?"checked":""}>
                  <span class="radio-label">${o("eyeDeviationForced")}</span>
                </label>
              </div>
            </div>

            <!-- Denial/Neglect -->
            <div class="fast-ed-component">
              <h3>${o("denialNeglectTitle")}</h3>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="denial_neglect" value="0" ${this.scores.denial_neglect===0?"checked":""}>
                  <span class="radio-label">${o("denialNeglectNormal")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="denial_neglect" value="1" ${this.scores.denial_neglect===1?"checked":""}>
                  <span class="radio-label">${o("denialNeglectPartial")}</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="denial_neglect" value="2" ${this.scores.denial_neglect===2?"checked":""}>
                  <span class="radio-label">${o("denialNeglectComplete")}</span>
                </label>
              </div>
            </div>

            <!-- Total Score Display -->
            <div class="fast-ed-total">
              <div class="score-display">
                <h3>${o("totalScoreTitle")}: <span class="total-score">${t}/9</span></h3>
                <div class="risk-indicator ${e}">
                  ${o("riskLevel")}: ${o(e==="high"?"riskLevelHigh":"riskLevelLow")}
                </div>
              </div>
            </div>

          </div>
          <div class="modal-footer">
            <button class="secondary" data-action="cancel-fast-ed">${o("cancel")}</button>
            <button class="primary" data-action="apply-fast-ed">${o("applyScore")}</button>
          </div>
        </div>
      </div>
    `}setupEventListeners(){if(this.modal=document.getElementById("fastEdModal"),!this.modal)return;this.modal.addEventListener("change",n=>{if(n.target.type==="radio"){const s=n.target.name,r=parseInt(n.target.value);this.scores[s]=r,this.updateDisplay()}});const t=this.modal.querySelector(".modal-close");t==null||t.addEventListener("click",()=>this.close());const e=this.modal.querySelector('[data-action="cancel-fast-ed"]');e==null||e.addEventListener("click",()=>this.close());const i=this.modal.querySelector('[data-action="apply-fast-ed"]');i==null||i.addEventListener("click",()=>this.apply()),this.modal.addEventListener("click",n=>{n.target===this.modal&&this.close()}),document.addEventListener("keydown",n=>{var s;n.key==="Escape"&&((s=this.modal)!=null&&s.classList.contains("show"))&&this.close()})}updateDisplay(){var i,n;const t=(i=this.modal)==null?void 0:i.querySelector(".total-score"),e=(n=this.modal)==null?void 0:n.querySelector(".risk-indicator");if(t&&(t.textContent=`${this.getTotal()}/9`),e){const s=this.getRiskLevel();e.className=`risk-indicator ${s}`,e.textContent=`${o("riskLevel")}: ${o(s==="high"?"riskLevelHigh":"riskLevelLow")}`}}show(t=0,e=null){this.onApply=e,t>0&&t<=9&&this.approximateFromTotal(t),document.getElementById("fastEdModal")?(this.modal.remove(),document.body.insertAdjacentHTML("beforeend",this.render()),this.modal=document.getElementById("fastEdModal")):document.body.insertAdjacentHTML("beforeend",this.render()),this.setupEventListeners(),this.modal.setAttribute("aria-hidden","false"),this.modal.style.display="flex",this.modal.classList.add("show");const i=this.modal.querySelector('input[type="radio"]');i==null||i.focus()}close(){this.modal&&(this.modal.classList.remove("show"),this.modal.style.display="none",this.modal.setAttribute("aria-hidden","true"))}apply(){const t=this.getTotal(),e=this.scores.arm_weakness>0,i=this.scores.eye_deviation>0;this.onApply&&this.onApply({total:t,components:{...this.scores},armWeaknessBoolean:e,eyeDeviationBoolean:i}),this.close()}approximateFromTotal(t){this.scores={facial_palsy:0,arm_weakness:0,speech_changes:0,eye_deviation:0,denial_neglect:0};let e=t;const i=Object.keys(this.scores);for(const n of i){if(e<=0)break;const r=Math.min(e,n==="facial_palsy"?1:2);this.scores[n]=r,e-=r}}}const At=new Tt;function P(a){const t=g.getState(),{currentScreen:e,results:i,startTime:n,navigationHistory:s}=t;a.innerHTML="";const r=document.getElementById("backButton");r&&(r.style.display=s&&s.length>0?"flex":"none");let c="";switch(e){case"triage1":c=W();break;case"triage2":c=Se();break;case"coma":c=Le();break;case"limited":c=Ee();break;case"full":c=Te();break;case"results":c=Je(i,n);break;default:c=W()}a.innerHTML=c;const l=a.querySelector("form[data-module]");if(l){const d=l.dataset.module;Ct(l,d)}Mt(a),e==="results"&&i&&setTimeout(()=>{Ie(i)},100),setTimeout(()=>{Ye()},150),wt(e),Lt(e),Et()}function Ct(a,t){const e=g.getFormData(t);!e||Object.keys(e).length===0||Object.entries(e).forEach(([i,n])=>{const s=a.elements[i];s&&(s.type==="checkbox"?s.checked=n===!0||n==="on"||n==="true":s.value=n)})}function Mt(a){a.querySelectorAll('input[type="number"]').forEach(n=>{n.addEventListener("blur",()=>{rt(a)})}),a.querySelectorAll("[data-action]").forEach(n=>{n.addEventListener("click",s=>{const{action:r,value:c}=s.currentTarget.dataset,l=c==="true";switch(r){case"triage1":bt(l);break;case"triage2":ft(l);break;case"reset":vt();break;case"goBack":yt();break;case"goHome":ge();break}})}),a.querySelectorAll("form[data-module]").forEach(n=>{n.addEventListener("submit",s=>{kt(s,a)})});const t=a.querySelector("#printResults");t&&t.addEventListener("click",()=>window.print());const e=a.querySelector("#fast_ed_score");e&&(e.addEventListener("click",n=>{n.preventDefault();const s=parseInt(e.value)||0;At.show(s,r=>{e.value=r.total;const c=a.querySelector("#armparese_hidden");c&&(c.value=r.armWeaknessBoolean?"true":"false");const l=a.querySelector("#eye_deviation_hidden");l&&(l.value=r.eyeDeviationBoolean?"true":"false"),e.dispatchEvent(new Event("change",{bubbles:!0}))})}),e.addEventListener("keydown",n=>{n.preventDefault()})),a.querySelectorAll(".info-toggle").forEach(n=>{n.addEventListener("click",s=>{const r=n.dataset.target,c=a.querySelector(`#${r}`),l=n.querySelector(".toggle-arrow");c&&(c.style.display!=="none"?(c.style.display="none",c.classList.remove("show"),n.classList.remove("active"),l.style.transform="rotate(0deg)"):(c.style.display="block",c.classList.add("show"),n.classList.add("active"),l.style.transform="rotate(180deg)"))})})}class $t{constructor(){this.container=null,this.unsubscribe=null}async init(){if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",()=>this.init());return}if(this.container=document.getElementById("appContainer"),!this.container){console.error("App container not found");return}this.unsubscribe=g.subscribe(()=>{P(this.container),setTimeout(()=>this.initializeResearchMode(),200)}),window.addEventListener("languageChanged",()=>{this.updateUILanguage(),P(this.container)}),this.setupGlobalEventListeners(),this.initializeTheme(),this.initializeResearchMode(),this.updateUILanguage(),this.startAutoSave(),this.setupSessionTimeout(),this.setCurrentYear(),this.registerServiceWorker(),lt(),P(this.container),console.log("iGFAP Stroke Triage Assistant initialized")}setupGlobalEventListeners(){const t=document.getElementById("backButton");t&&t.addEventListener("click",()=>{g.goBack(),P(this.container)});const e=document.getElementById("homeButton");e&&e.addEventListener("click",()=>{g.goHome(),P(this.container)});const i=document.getElementById("languageToggle");i&&i.addEventListener("click",()=>this.toggleLanguage());const n=document.getElementById("darkModeToggle");n&&n.addEventListener("click",()=>this.toggleDarkMode());const s=document.getElementById("researchModeToggle");s&&s.addEventListener("click",r=>{r.preventDefault(),r.stopPropagation(),this.toggleResearchMode()}),this.setupHelpModal(),this.setupFooterLinks(),document.addEventListener("keydown",r=>{if(r.key==="Escape"){const c=document.getElementById("helpModal");c&&c.classList.contains("show")&&(c.classList.remove("show"),c.style.display="none",c.setAttribute("aria-hidden","true"))}}),window.addEventListener("beforeunload",r=>{g.hasUnsavedData()&&(r.preventDefault(),r.returnValue="You have unsaved data. Are you sure you want to leave?")})}setupHelpModal(){const t=document.getElementById("helpButton"),e=document.getElementById("helpModal"),i=e==null?void 0:e.querySelector(".modal-close");if(t&&e){e.classList.remove("show"),e.style.display="none",e.setAttribute("aria-hidden","true"),t.addEventListener("click",()=>{e.style.display="flex",e.classList.add("show"),e.setAttribute("aria-hidden","false")});const n=()=>{e.classList.remove("show"),e.style.display="none",e.setAttribute("aria-hidden","true")};i==null||i.addEventListener("click",n),e.addEventListener("click",s=>{s.target===e&&n()})}}setupFooterLinks(){var t,e;(t=document.getElementById("privacyLink"))==null||t.addEventListener("click",i=>{i.preventDefault(),this.showPrivacyPolicy()}),(e=document.getElementById("disclaimerLink"))==null||e.addEventListener("click",i=>{i.preventDefault(),this.showDisclaimer()})}initializeTheme(){const t=localStorage.getItem("theme"),e=document.getElementById("darkModeToggle");(t==="dark"||!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)&&(document.body.classList.add("dark-mode"),e&&(e.textContent="☀️"))}toggleLanguage(){w.toggleLanguage(),this.updateUILanguage();const t=document.getElementById("languageToggle");if(t){const e=w.getCurrentLanguage();t.textContent=e==="en"?"🇬🇧":"🇩🇪",t.dataset.lang=e}}updateUILanguage(){document.documentElement.lang=w.getCurrentLanguage();const t=document.querySelector(".app-header h1");t&&(t.textContent=o("appTitle"));const e=document.querySelector(".emergency-badge");e&&(e.textContent=o("emergencyBadge"));const i=document.getElementById("languageToggle");i&&(i.title=o("languageToggle"),i.setAttribute("aria-label",o("languageToggle")));const n=document.getElementById("helpButton");n&&(n.title=o("helpButton"),n.setAttribute("aria-label",o("helpButton")));const s=document.getElementById("darkModeToggle");s&&(s.title=o("darkModeButton"),s.setAttribute("aria-label",o("darkModeButton")));const r=document.getElementById("modalTitle");r&&(r.textContent=o("helpTitle"))}toggleDarkMode(){const t=document.getElementById("darkModeToggle");document.body.classList.toggle("dark-mode");const e=document.body.classList.contains("dark-mode");t&&(t.textContent=e?"☀️":"🌙"),localStorage.setItem("theme",e?"dark":"light")}initializeResearchMode(){const t=document.getElementById("researchModeToggle");if(t){const e=this.getCurrentModuleFromResults(),i=e==="limited"||e==="full";t.style.display=i?"flex":"none",t.style.opacity=i?"1":"0.5",console.log(`🔬 Research button visibility: ${i?"VISIBLE":"HIDDEN"} (module: ${e})`)}}getCurrentModuleFromResults(){var i,n;const t=g.getState();if(t.currentScreen!=="results"||!((n=(i=t.results)==null?void 0:i.ich)!=null&&n.module))return null;const e=t.results.ich.module.toLowerCase();return e.includes("coma")?"coma":e.includes("limited")?"limited":e.includes("full")?"full":null}toggleResearchMode(){const t=document.getElementById("researchPanel");if(!t){console.warn("🔬 Research panel not found - likely not on results screen");return}const e=t.style.display!=="none";t.style.display=e?"none":"block";const i=document.getElementById("researchModeToggle");return i&&(i.style.background=e?"rgba(255, 255, 255, 0.1)":"rgba(0, 102, 204, 0.2)"),console.log(`🔬 Research panel ${e?"HIDDEN":"SHOWN"}`),!1}showResearchActivationMessage(){const t=document.createElement("div");t.className="research-activation-toast",t.innerHTML=`
      <div class="toast-content">
        🔬 <strong>Research Mode Activated</strong><br>
        <small>Model comparison features enabled</small>
      </div>
    `,document.body.appendChild(t),setTimeout(()=>{document.body.contains(t)&&document.body.removeChild(t)},3e3)}startAutoSave(){setInterval(()=>{this.saveCurrentFormData()},V.autoSaveInterval)}saveCurrentFormData(){this.container.querySelectorAll("form[data-module]").forEach(e=>{const i=new FormData(e),n=e.dataset.module;if(n){const s={};i.forEach((l,d)=>{const u=e.elements[d];u&&u.type==="checkbox"?s[d]=u.checked:s[d]=l});const r=g.getFormData(n);JSON.stringify(r)!==JSON.stringify(s)&&g.setFormData(n,s)}})}setupSessionTimeout(){setTimeout(()=>{confirm("Your session has been idle for 30 minutes. Would you like to continue?")?this.setupSessionTimeout():g.reset()},V.sessionTimeout)}setCurrentYear(){const t=document.getElementById("currentYear");t&&(t.textContent=new Date().getFullYear())}showPrivacyPolicy(){alert("Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.")}showDisclaimer(){alert("Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.")}async registerServiceWorker(){if(!("serviceWorker"in navigator)){console.log("Service Workers not supported");return}try{const t=await navigator.serviceWorker.register("/0825/sw.js",{scope:"/0825/"});console.log("Service Worker registered successfully:",t),t.addEventListener("updatefound",()=>{const e=t.installing;console.log("New service worker found"),e.addEventListener("statechange",()=>{e.state==="installed"&&navigator.serviceWorker.controller&&(console.log("New service worker installed, update available"),this.showUpdateNotification())})}),navigator.serviceWorker.addEventListener("message",e=>{console.log("Message from service worker:",e.data)})}catch(t){console.error("Service Worker registration failed:",t)}}showUpdateNotification(){const t=document.createElement("div");t.className="modal show update-modal",t.style.cssText=`
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
    `,t.appendChild(e),document.body.appendChild(t);const i=t.querySelector("#updateNow"),n=t.querySelector("#updateLater");i.addEventListener("click",()=>{window.location.reload()}),n.addEventListener("click",()=>{t.remove(),setTimeout(()=>this.showUpdateNotification(),5*60*1e3)}),t.addEventListener("click",s=>{s.target===t&&n.click()})}destroy(){this.unsubscribe&&this.unsubscribe()}}const Pt=new $t;Pt.init();
//# sourceMappingURL=index-Dc38sJJY.js.map
