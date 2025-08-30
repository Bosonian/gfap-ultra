(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=e(i);fetch(i.href,n)}})();class te{constructor(){this.state={currentScreen:"triage1",results:null,sessionId:null,startTime:null,formData:{},validationErrors:{},screenHistory:[]},this.listeners=new Set,this.initialize()}initialize(){this.state.sessionId=this.generateSessionId(),this.state.startTime=Date.now(),console.log("Store initialized with session:",this.state.sessionId)}generateSessionId(){return"session_"+Date.now()+"_"+Math.random().toString(36).substr(2,9)}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}notify(){this.listeners.forEach(t=>t(this.state))}getState(){return{...this.state}}setState(t){this.state={...this.state,...t},this.notify()}navigate(t){console.log(`Navigating from ${this.state.currentScreen} to ${t}`);const e=[...this.state.screenHistory];this.state.currentScreen!==t&&!e.includes(this.state.currentScreen)&&e.push(this.state.currentScreen),this.setState({currentScreen:t,screenHistory:e})}goBack(){const t=[...this.state.screenHistory];if(console.log("goBack() - current history:",t),console.log("goBack() - current screen:",this.state.currentScreen),t.length>0){const e=t.pop();return console.log("goBack() - navigating to:",e),this.setState({currentScreen:e,screenHistory:t}),!0}return console.log("goBack() - no history available"),!1}goHome(){this.setState({currentScreen:"triage1",screenHistory:[]})}setFormData(t,e){const s={...this.state.formData};s[t]={...e},this.setState({formData:s})}getFormData(t){return this.state.formData[t]||{}}setValidationErrors(t){this.setState({validationErrors:t})}clearValidationErrors(){this.setState({validationErrors:{}})}setResults(t){this.setState({results:t})}hasUnsavedData(){return Object.keys(this.state.formData).length>0&&!this.state.results}reset(){const t={currentScreen:"triage1",results:null,sessionId:this.generateSessionId(),startTime:Date.now(),formData:{},validationErrors:{},screenHistory:[]};this.setState(t),console.log("Store reset with new session:",t.sessionId)}logEvent(t,e={}){const s={timestamp:Date.now(),session:this.state.sessionId,event:t,data:e};console.log("Event:",s)}getSessionDuration(){return Date.now()-this.state.startTime}}const m=new te;function S(a){const t=[{id:1,label:"Triage"},{id:2,label:"Assessment"},{id:3,label:"Results"}];let e='<div class="progress-indicator">';return t.forEach((s,i)=>{const n=s.id===a,o=s.id<a;e+=`
      <div class="progress-step ${n?"active":""} ${o?"completed":""}">
        ${o?"":s.id}
      </div>
    `,i<t.length-1&&(e+=`<div class="progress-line ${o?"completed":""}"></div>`)}),e+="</div>",e}const _={en:{appTitle:"iGFAP",emergencyBadge:"Emergency Tool",helpButton:"Help and Instructions",darkModeButton:"Toggle dark mode",languageToggle:"Language",step1:"Initial Assessment",step2:"Data Collection",step3:"Results",comaModuleTitle:"Coma Module",limitedDataModuleTitle:"Limited Data Module",fullStrokeModuleTitle:"Full Stroke Module",triage1Title:"Patient Assessment",triage1Question:"Is the patient comatose?",triage1Help:"Glasgow Coma Scale < 8",triage1Yes:"YES - Comatose",triage1No:"NO - Conscious",triage2Title:"Examination Capability",triage2Question:"Can the patient be reliably examined?",triage2Help:"Patient is not aphasic, confused, or uncooperative",triage2Yes:"YES - Full Exam Possible",triage2No:"NO - Limited Exam Only",ageLabel:"Age (years)",ageHelp:"Patient age in years",systolicLabel:"Systolic BP (mmHg)",systolicHelp:"Systolic blood pressure",diastolicLabel:"Diastolic BP (mmHg)",diastolicHelp:"Diastolic blood pressure",gfapLabel:"GFAP Value (pg/mL)",gfapHelp:"GFAP biomarker level",fastEdLabel:"FAST-ED Score",fastEdHelp:"FAST-ED assessment score (0-9)",headacheLabel:"Headache",vigilanzLabel:"Reduced consciousness",armPareseLabel:"Arm weakness",beinPareseLabel:"Leg weakness",eyeDeviationLabel:"Eye deviation",atrialFibLabel:"Atrial fibrillation",anticoagLabel:"Anticoagulated (NOAK)",antiplateletsLabel:"Antiplatelets",analyzeButton:"Analyze",analyzing:"Analyzing...",printResults:"Print Results",newAssessment:"Start New Assessment",startOver:"Start Over",goBack:"Go Back",goHome:"Go Home",basicInformation:"Basic Information",biomarkersScores:"Biomarkers & Scores",clinicalSymptoms:"Clinical Symptoms",medicalHistory:"Medical History",ageYearsLabel:"Age (years)",systolicBpLabel:"Systolic BP (mmHg)",diastolicBpLabel:"Diastolic BP (mmHg)",gfapValueLabel:"GFAP Value (pg/mL)",fastEdScoreLabel:"FAST-ED Score",ageYearsHelp:"Patient's age in years",systolicBpHelp:"Normal: 90-140 mmHg",diastolicBpHelp:"Normal: 60-90 mmHg",gfapTooltip:"Brain injury biomarker",gfapTooltipLong:"Glial Fibrillary Acidic Protein - Brain injury biomarker",gfapRange:"Range: {min} - {max} pg/mL",fastEdTooltip:"0-9 scale for LVO screening",analyzeIchRisk:"Analyze ICH Risk",analyzeStrokeRisk:"Analyze Stroke Risk",criticalPatient:"Critical Patient",comaAlert:"Patient is comatose (GCS < 8). Rapid assessment required.",vigilanceReduction:"Vigilance Reduction (Decreased alertness)",armParesis:"Arm Paresis",legParesis:"Leg Paresis",eyeDeviation:"Eye Deviation",atrialFibrillation:"Atrial Fibrillation",onNoacDoac:"On NOAC/DOAC",onAntiplatelets:"On Antiplatelets",resultsTitle:"Assessment Results",bleedingRiskAssessment:"Bleeding Risk Assessment",ichProbability:"ICH Probability",lvoProbability:"LVO Probability",lvoMayBePossible:"Large vessel occlusion possible - further evaluation recommended",riskFactorsTitle:"Main Risk Factors",increasingRisk:"Increasing Risk",decreasingRisk:"Decreasing Risk",noFactors:"No factors",riskLevel:"Risk Level",lowRisk:"Low Risk",mediumRisk:"Medium Risk",highRisk:"High Risk",riskLow:"Low",riskMedium:"Medium",riskHigh:"High",riskFactorsAnalysis:"Risk Factors",contributingFactors:"Contributing factors to the assessment",riskFactors:"Risk Factors",increaseRisk:"INCREASE",decreaseRisk:"DECREASE",noPositiveFactors:"No increasing factors",noNegativeFactors:"No decreasing factors",ichRiskFactors:"ICH Risk Factors",lvoRiskFactors:"LVO Risk Factors",criticalAlertTitle:"CRITICAL RISK DETECTED",criticalAlertMessage:"High probability of intracerebral hemorrhage detected.",immediateActionsRequired:"Immediate actions required",initiateStrokeProtocol:"Initiate stroke protocol immediately",urgentCtImaging:"Urgent CT imaging required",considerBpManagement:"Consider blood pressure management",prepareNeurosurgicalConsult:"Prepare for potential neurosurgical consultation",helpTitle:"Quick Reference Guide",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 8: Comatose patient - use Coma Module",gcsMod:"GCS 8-12: Moderate impairment",gcsHigh:"GCS 13-15: Mild impairment",fastEdTitle:"FAST-ED Score Components",fastEdFacial:"Facial Palsy: 0-1 points",fastEdArm:"Arm Weakness: 0-2 points",fastEdSpeech:"Speech Changes: 0-2 points",fastEdTime:"Time: Critical factor",fastEdEye:"Eye Deviation: 0-2 points",fastEdDenial:"Denial/Neglect: 0-2 points",criticalValuesTitle:"Critical Values",criticalBp:"Systolic BP > 180: Increased ICH risk",criticalGfap:"GFAP > 500 pg/mL: Significant marker",criticalFastEd:"FAST-ED ≥ 4: Consider LVO",fastEdCalculatorTitle:"FAST-ED Score Calculator",fastEdCalculatorSubtitle:"Click to calculate FAST-ED score components",facialPalsyTitle:"Facial Palsy",facialPalsyNormal:"Normal (0)",facialPalsyMild:"Mild drooping (1)",armWeaknessTitle:"Arm Weakness",armWeaknessNormal:"Normal (0)",armWeaknessMild:"Mild drift (1)",armWeaknessSevere:"Falls immediately (2)",speechChangesTitle:"Speech Changes",speechChangesNormal:"Normal (0)",speechChangesMild:"Slurred speech (1)",speechChangesSevere:"Severe aphasia (2)",eyeDeviationTitle:"Eye Deviation",eyeDeviationNormal:"Normal (0)",eyeDeviationPartial:"Partial gaze palsy (1)",eyeDeviationForced:"Forced deviation (2)",denialNeglectTitle:"Denial/Neglect",denialNeglectNormal:"Normal (0)",denialNeglectPartial:"Partial neglect (1)",denialNeglectComplete:"Complete neglect (2)",totalScoreTitle:"Total FAST-ED Score",riskLevel:"Risk Level",riskLevelLow:"LOW (Score <4)",riskLevelHigh:"HIGH (Score ≥4 - Consider LVO)",applyScore:"Apply Score",cancel:"Cancel",riskAnalysis:"Risk Analysis",riskAnalysisSubtitle:"Clinical factors in this assessment",contributingFactors:"Contributing factors",factorsShown:"shown",positiveFactors:"Positive factors",negativeFactors:"Negative factors",clinicalInformation:"Clinical Information",clinicalRecommendations:"Clinical Recommendations",clinicalRec1:"Consider immediate imaging if ICH risk is high",clinicalRec2:"Activate stroke team for LVO scores ≥ 50%",clinicalRec3:"Monitor blood pressure closely",clinicalRec4:"Document all findings thoroughly",noDriverData:"No driver data available",driverAnalysisUnavailable:"Driver analysis unavailable",driverInfoNotAvailable:"Driver information not available from this prediction model",driverAnalysisNotAvailable:"Driver analysis not available for this prediction",lvoNotPossible:"LVO assessment not possible with limited data",fullExamRequired:"Full neurological examination required for LVO screening",limitedAssessment:"Limited Assessment",disclaimer:"Clinical Disclaimer",disclaimerText:"This tool is for clinical decision support only. Always use clinical judgment and follow local protocols. Not a replacement for physician assessment.",importantNote:"Important",importantText:"These results are for clinical decision support only. Always use clinical judgment and follow institutional protocols.",inputSummaryTitle:"Input Summary",inputSummarySubtitle:"Values used for this analysis",privacyLink:"Privacy Policy",disclaimerLink:"Medical Disclaimer",versionLink:"Version 2.1.0 - Research Preview",privacyPolicy:"Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.",medicalDisclaimer:"Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.",networkError:"Network error - please check your connection and try again",requestTimeout:"Request timeout - please try again",apiError:"Failed to get results",validationError:"Please check your input values",sessionTimeout:"Your session has been idle for 30 minutes. Would you like to continue?",unsavedData:"You have unsaved data. Are you sure you want to leave?",nearestCentersTitle:"Nearest Stroke Centers",useCurrentLocation:"Use Current Location",enterLocationPlaceholder:"Enter city or address...",enterManually:"Enter Location Manually",search:"Search",yourLocation:"Your Location",recommendedCenters:"Recommended Centers",alternativeCenters:"Alternative Centers",noCentersFound:"No stroke centers found in this area",gettingLocation:"Getting your location",searchingLocation:"Searching location",locationError:"Unable to get your location",locationPermissionDenied:"Location access denied. Please allow location access and try again.",locationUnavailable:"Location information is unavailable",locationTimeout:"Location request timed out",geolocationNotSupported:"Geolocation is not supported by this browser",geocodingNotImplemented:"Location search not available. Please use GPS or enter coordinates manually.",tryManualEntry:"Try entering your location manually or use GPS.",distanceNote:"Distances are calculated as straight-line distances. Actual travel times may vary.",travelTimeNote:"Travel times calculated for emergency vehicles with sirens and priority routing.",calculatingTravelTimes:"Calculating travel times",minutes:"min",poweredByOrs:"Travel times powered by OpenRoute Service",comprehensiveCenter:"Comprehensive Stroke Center",primaryCenter:"Primary Stroke Center",telemetryCenter:"Telemedicine Center",thrombectomy:"Thrombectomy",neurosurgery:"Neurosurgery",icu:"Intensive Care",telemedicine:"Telemedicine",stroke_unit:"Stroke Unit",call:"Call",directions:"Directions",emergency:"Emergency",certified:"Certified"},de:{appTitle:"iGFAP",emergencyBadge:"Notfall-Tool",helpButton:"Hilfe und Anweisungen",darkModeButton:"Dunklen Modus umschalten",languageToggle:"Sprache",step1:"Erstbeurteilung",step2:"Datenerhebung",step3:"Ergebnisse",comaModuleTitle:"Koma-Modul",limitedDataModuleTitle:"Begrenzte Daten Modul",fullStrokeModuleTitle:"Vollständiges Schlaganfall-Modul",triage1Title:"Patientenbeurteilung",triage1Question:"Ist der Patient komatös?",triage1Help:"Glasgow Coma Scale < 8",triage1Yes:"JA - Komatös",triage1No:"NEIN - Bei Bewusstsein",triage2Title:"Untersuchungsfähigkeit",triage2Question:"Kann der Patient zuverlässig untersucht werden?",triage2Help:"Patient ist nicht aphasisch, verwirrt oder unkooperativ",triage2Yes:"JA - Vollständige Untersuchung möglich",triage2No:"NEIN - Nur begrenzte Untersuchung",ageLabel:"Alter (Jahre)",ageHelp:"Patientenalter in Jahren",systolicLabel:"Systolischer RR (mmHg)",systolicHelp:"Systolischer Blutdruck",diastolicLabel:"Diastolischer RR (mmHg)",diastolicHelp:"Diastolischer Blutdruck",gfapLabel:"GFAP-Wert (pg/mL)",gfapHelp:"GFAP-Biomarker-Wert",fastEdLabel:"FAST-ED-Score",fastEdHelp:"FAST-ED-Bewertungsscore (0-9)",headacheLabel:"Kopfschmerzen",vigilanzLabel:"Bewusstseinstrübung",armPareseLabel:"Armschwäche",beinPareseLabel:"Beinschwäche",eyeDeviationLabel:"Blickdeviation",atrialFibLabel:"Vorhofflimmern",anticoagLabel:"Antikoaguliert (NOAK)",antiplateletsLabel:"Thrombozytenaggregationshemmer",analyzeButton:"Analysieren",analyzing:"Analysiere...",printResults:"Ergebnisse drucken",newAssessment:"Neue Bewertung starten",startOver:"Von vorn beginnen",goBack:"Zurück",goHome:"Zur Startseite",basicInformation:"Grundinformationen",biomarkersScores:"Biomarker & Scores",clinicalSymptoms:"Klinische Symptome",medicalHistory:"Anamnese",ageYearsLabel:"Alter (Jahre)",systolicBpLabel:"Systolischer RR (mmHg)",diastolicBpLabel:"Diastolischer RR (mmHg)",gfapValueLabel:"GFAP-Wert (pg/mL)",fastEdScoreLabel:"FAST-ED-Score",ageYearsHelp:"Patientenalter in Jahren",systolicBpHelp:"Normal: 90-140 mmHg",diastolicBpHelp:"Normal: 60-90 mmHg",gfapTooltip:"Hirnverletzungs-Biomarker",gfapTooltipLong:"Glial Fibrillary Acidic Protein - Hirnverletzungs-Biomarker",gfapRange:"Bereich: {min} - {max} pg/mL",fastEdTooltip:"0-9 Skala für LVO-Screening",analyzeIchRisk:"ICB-Risiko analysieren",analyzeStrokeRisk:"Schlaganfall-Risiko analysieren",criticalPatient:"Kritischer Patient",comaAlert:"Patient ist komatös (GCS < 8). Schnelle Beurteilung erforderlich.",vigilanceReduction:"Vigilanzminderung (Verminderte Wachheit)",armParesis:"Armparese",legParesis:"Beinparese",eyeDeviation:"Blickdeviation",atrialFibrillation:"Vorhofflimmern",onNoacDoac:"NOAK/DOAK-Therapie",onAntiplatelets:"Thrombozytenaggregationshemmer",resultsTitle:"Bewertungsergebnisse",bleedingRiskAssessment:"Blutungsrisiko-Bewertung",ichProbability:"ICB-Wahrscheinlichkeit",lvoProbability:"LVO-Wahrscheinlichkeit",lvoMayBePossible:"Großgefäßverschluss möglich - weitere Abklärung empfohlen",riskFactorsTitle:"Hauptrisikofaktoren",increasingRisk:"Risikoerhöhend",decreasingRisk:"Risikomindernd",noFactors:"Keine Faktoren",riskLevel:"Risikostufe",lowRisk:"Niedriges Risiko",mediumRisk:"Mittleres Risiko",highRisk:"Hohes Risiko",riskLow:"Niedrig",riskMedium:"Mittel",riskHigh:"Hoch",riskFactorsAnalysis:"Risikofaktoren",contributingFactors:"Beitragende Faktoren zur Bewertung",riskFactors:"Risikofaktoren",increaseRisk:"ERHÖHEN",decreaseRisk:"VERRINGERN",noPositiveFactors:"Keine erhöhenden Faktoren",noNegativeFactors:"Keine verringernden Faktoren",ichRiskFactors:"ICB-Risikofaktoren",lvoRiskFactors:"LVO-Risikofaktoren",criticalAlertTitle:"KRITISCHES RISIKO ERKANNT",criticalAlertMessage:"Hohe Wahrscheinlichkeit einer intrazerebralen Blutung erkannt.",immediateActionsRequired:"Sofortige Maßnahmen erforderlich",initiateStrokeProtocol:"Schlaganfall-Protokoll sofort einleiten",urgentCtImaging:"Dringende CT-Bildgebung erforderlich",considerBpManagement:"Blutdruckmanagement erwägen",prepareNeurosurgicalConsult:"Neurochirurgische Konsultation vorbereiten",helpTitle:"Kurzreferenzleitfaden",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 8: Komatöser Patient - Koma-Modul verwenden",gcsMod:"GCS 8-12: Mäßige Beeinträchtigung",gcsHigh:"GCS 13-15: Leichte Beeinträchtigung",fastEdTitle:"FAST-ED-Score-Komponenten",fastEdFacial:"Faziale Parese: 0-1 Punkte",fastEdArm:"Armschwäche: 0-2 Punkte",fastEdSpeech:"Sprachveränderungen: 0-2 Punkte",fastEdTime:"Zeit: Kritischer Faktor",fastEdEye:"Blickdeviation: 0-2 Punkte",fastEdDenial:"Verneinung/Neglect: 0-2 Punkte",criticalValuesTitle:"Kritische Werte",criticalBp:"Systolischer RR > 180: Erhöhtes ICB-Risiko",criticalGfap:"GFAP > 500 pg/mL: Signifikanter Marker",criticalFastEd:"FAST-ED ≥ 4: LVO in Betracht ziehen",fastEdCalculatorTitle:"FAST-ED-Score-Rechner",fastEdCalculatorSubtitle:"Klicken Sie, um FAST-ED-Score-Komponenten zu berechnen",facialPalsyTitle:"Fazialisparese",facialPalsyNormal:"Nein (0)",facialPalsyMild:"Ja (1)",armWeaknessTitle:"Armschwäche",armWeaknessNormal:"Normal (0)",armWeaknessMild:"Leichter Armabfall (1)",armWeaknessSevere:"Arm fällt sofort ab (2)",speechChangesTitle:"Sprachveränderungen",speechChangesNormal:"Normal (0)",speechChangesMild:"Verwaschene Sprache (1)",speechChangesSevere:"Schwere Aphasie (2)",eyeDeviationTitle:"Blickdeviation",eyeDeviationNormal:"Normal (0)",eyeDeviationPartial:"Partielle Blickparese (1)",eyeDeviationForced:"Forcierte Blickdeviation (2)",denialNeglectTitle:"Verneinung/Neglect",denialNeglectNormal:"Normal (0)",denialNeglectPartial:"Partieller Neglect (1)",denialNeglectComplete:"Kompletter Neglect (2)",totalScoreTitle:"Gesamt-FAST-ED-Score",riskLevel:"Risikostufe",riskLevelLow:"NIEDRIG (Score <4)",riskLevelHigh:"HOCH (Score ≥4 - LVO erwägen)",applyScore:"Score Anwenden",cancel:"Abbrechen",riskAnalysis:"Risikoanalyse",riskAnalysisSubtitle:"Klinische Faktoren in dieser Bewertung",contributingFactors:"Beitragende Faktoren",factorsShown:"angezeigt",positiveFactors:"Positive Faktoren",negativeFactors:"Negative Faktoren",clinicalInformation:"Klinische Informationen",clinicalRecommendations:"Klinische Empfehlungen",clinicalRec1:"Sofortige Bildgebung erwägen bei hohem ICB-Risiko",clinicalRec2:"Stroke-Team aktivieren bei LVO-Score ≥ 50%",clinicalRec3:"Blutdruck engmaschig überwachen",clinicalRec4:"Alle Befunde gründlich dokumentieren",noDriverData:"Keine Treiberdaten verfügbar",driverAnalysisUnavailable:"Treiberanalyse nicht verfügbar",driverInfoNotAvailable:"Treiberinformationen von diesem Vorhersagemodell nicht verfügbar",driverAnalysisNotAvailable:"Treiberanalyse für diese Vorhersage nicht verfügbar",lvoNotPossible:"LVO-Bewertung mit begrenzten Daten nicht möglich",fullExamRequired:"Vollständige neurologische Untersuchung für LVO-Screening erforderlich",limitedAssessment:"Begrenzte Bewertung",disclaimer:"Klinischer Haftungsausschluss",disclaimerText:"Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle. Kein Ersatz für ärztliche Beurteilung.",importantNote:"Wichtig",importantText:"Diese Ergebnisse dienen nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie institutionelle Protokolle.",inputSummaryTitle:"Eingabezusammenfassung",inputSummarySubtitle:"Für diese Analyse verwendete Werte",privacyLink:"Datenschutzrichtlinie",disclaimerLink:"Medizinischer Haftungsausschluss",versionLink:"Version 2.1.0 - Research Preview",privacyPolicy:"Datenschutzrichtlinie: Dieses Tool verarbeitet Daten lokal. Keine Patientendaten werden gespeichert oder übertragen.",medicalDisclaimer:"Medizinischer Haftungsausschluss: Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle.",networkError:"Netzwerkfehler - bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut",requestTimeout:"Anfrage-Timeout - bitte versuchen Sie es erneut",apiError:"Ergebnisse konnten nicht abgerufen werden",validationError:"Bitte überprüfen Sie Ihre Eingabewerte",sessionTimeout:"Ihre Sitzung war 30 Minuten lang inaktiv. Möchten Sie fortfahren?",unsavedData:"Sie haben ungespeicherte Daten. Sind Sie sicher, dass Sie verlassen möchten?",nearestCentersTitle:"Nächstgelegene Schlaganfall-Zentren",useCurrentLocation:"Aktuellen Standort verwenden",enterLocationPlaceholder:"Stadt oder Adresse eingeben...",enterManually:"Standort manuell eingeben",search:"Suchen",yourLocation:"Ihr Standort",recommendedCenters:"Empfohlene Zentren",alternativeCenters:"Alternative Zentren",noCentersFound:"Keine Schlaganfall-Zentren in diesem Bereich gefunden",gettingLocation:"Standort wird ermittelt",searchingLocation:"Standort wird gesucht",locationError:"Standort konnte nicht ermittelt werden",locationPermissionDenied:"Standortzugriff verweigert. Bitte erlauben Sie Standortzugriff und versuchen Sie es erneut.",locationUnavailable:"Standortinformationen sind nicht verfügbar",locationTimeout:"Standortanfrage ist abgelaufen",geolocationNotSupported:"Geolokalisierung wird von diesem Browser nicht unterstützt",geocodingNotImplemented:"Standortsuche nicht verfügbar. Bitte verwenden Sie GPS oder geben Sie Koordinaten manuell ein.",tryManualEntry:"Versuchen Sie, Ihren Standort manuell einzugeben oder GPS zu verwenden.",distanceNote:"Entfernungen werden als Luftlinie berechnet. Tatsächliche Fahrzeiten können variieren.",travelTimeNote:"Fahrzeiten berechnet für Rettungsfahrzeuge mit Sondersignalen und Vorfahrtsberechtigung.",calculatingTravelTimes:"Fahrzeiten werden berechnet",minutes:"Min",poweredByOrs:"Fahrzeiten bereitgestellt von OpenRoute Service",comprehensiveCenter:"Überregionales Schlaganfall-Zentrum",primaryCenter:"Regionales Schlaganfall-Zentrum",telemetryCenter:"Telemedizin-Zentrum",thrombectomy:"Thrombektomie",neurosurgery:"Neurochirurgie",icu:"Intensivstation",telemedicine:"Telemedizin",stroke_unit:"Stroke Unit",call:"Anrufen",directions:"Wegbeschreibung",emergency:"Notfall",certified:"Zertifiziert"}};class ae{constructor(){this.supportedLanguages=["en","de"],this.currentLanguage=this.detectLanguage()}detectLanguage(){const t=localStorage.getItem("language");return t&&this.supportedLanguages.includes(t)?t:(navigator.language||navigator.userLanguage).substring(0,2).toLowerCase()==="de"?"de":"en"}getCurrentLanguage(){return this.currentLanguage}setLanguage(t){return this.supportedLanguages.includes(t)?(this.currentLanguage=t,localStorage.setItem("language",t),window.dispatchEvent(new CustomEvent("languageChanged",{detail:{language:t}})),!0):!1}getSupportedLanguages(){return[...this.supportedLanguages]}t(t){return(_[this.currentLanguage]||_.en)[t]||t}toggleLanguage(){const t=this.currentLanguage==="en"?"de":"en";return this.setLanguage(t)}getLanguageDisplayName(t=null){const e=t||this.currentLanguage;return{en:"English",de:"Deutsch"}[e]||e}formatDateTime(t){const e=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(e,{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(t)}formatTime(t){const e=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(e,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(t)}}const T=new ae,r=a=>T.t(a);function F(){return`
    <div class="container">
      ${S(1)}
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
  `}function se(){return`
    <div class="container">
      ${S(1)}
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
  `}const k={COMA_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_coma_ich",LDM_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_limited_data_ich",FULL_STROKE:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_full_stroke"},N={ich:{medium:25,high:50},lvo:{medium:25,high:50}},b={min:29,max:10001},P={autoSaveInterval:18e4,sessionTimeout:30*60*1e3,requestTimeout:1e4},ie={age_years:{required:!0,min:0,max:120},systolic_bp:{required:!0,min:60,max:300},diastolic_bp:{required:!0,min:30,max:200},gfap_value:{required:!0,min:b.min,max:b.max},fast_ed_score:{required:!0,min:0,max:9}};function ne(){return`
    <div class="container">
      ${S(2)}
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
            <input type="number" id="gfap_value" name="gfap_value" min="${b.min}" max="${b.max}" step="0.1" required aria-describedby="gfap-help">
            <div id="gfap-help" class="input-help">
              ${r("gfapRange").replace("{min}",b.min).replace("{max}",b.max)}
            </div>
          </div>
        </div>
        <button type="submit" class="primary">${r("analyzeIchRisk")}</button>
        <button type="button" class="secondary" data-action="reset">${r("startOver")}</button>
      </form>
    </div>
  `}function re(){return`
    <div class="container">
      ${S(2)}
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
            <input type="number" name="gfap_value" id="gfap_value" min="${b.min}" max="${b.max}" step="0.1" required>
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
  `}function oe(){return`
    <div class="container">
      ${S(2)}
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
            <input type="number" name="gfap_value" id="gfap_value" min="${b.min}" max="${b.max}" step="0.1" required>
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
            <input type="hidden" name="eye_deviation" id="eye_deviation_hidden" value="false">
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
  `}function G(){return`
    <div class="critical-alert">
      <h4><span class="alert-icon">🚨</span> ${r("criticalAlertTitle")}</h4>
      <p>${r("criticalAlertMessage")}</p>
    </div>
  `}const le={age_years:"ageLabel",age:"ageLabel",systolic_bp:"systolicLabel",diastolic_bp:"diastolicLabel",systolic_blood_pressure:"systolicLabel",diastolic_blood_pressure:"diastolicLabel",blood_pressure_systolic:"systolicLabel",blood_pressure_diastolic:"diastolicLabel",gfap_value:"gfapLabel",gfap:"gfapLabel",gfap_level:"gfapLabel",fast_ed_score:"fastEdLabel",fast_ed:"fastEdLabel",fast_ed_total:"fastEdLabel",vigilanzminderung:"vigilanzLabel",vigilance_reduction:"vigilanzLabel",reduced_consciousness:"vigilanzLabel",armparese:"armPareseLabel",arm_paresis:"armPareseLabel",arm_weakness:"armPareseLabel",beinparese:"beinPareseLabel",leg_paresis:"beinPareseLabel",leg_weakness:"beinPareseLabel",eye_deviation:"eyeDeviationLabel",blickdeviation:"eyeDeviationLabel",headache:"headacheLabel",kopfschmerzen:"headacheLabel",atrial_fibrillation:"atrialFibLabel",vorhofflimmern:"atrialFibLabel",anticoagulated_noak:"anticoagLabel",anticoagulation:"anticoagLabel",antiplatelets:"antiplateletsLabel",thrombozytenaggregationshemmer:"antiplateletsLabel"},ce=[{pattern:/_score$/,replacement:" Score"},{pattern:/_value$/,replacement:" Level"},{pattern:/_bp$/,replacement:" Blood Pressure"},{pattern:/_years?$/,replacement:" (years)"},{pattern:/^ich_/,replacement:"Brain Bleeding "},{pattern:/^lvo_/,replacement:"Large Vessel "},{pattern:/parese$/,replacement:"Weakness"},{pattern:/deviation$/,replacement:"Movement"}];function q(a){if(!a)return"";const t=le[a.toLowerCase()];if(t){const s=r(t);if(s&&s!==t)return s}let e=a.toLowerCase();return ce.forEach(({pattern:s,replacement:i})=>{e=e.replace(s,i)}),e=e.replace(/_/g," ").replace(/\b\w/g,s=>s.toUpperCase()).trim(),e}function de(a){return q(a).replace(/\s*\([^)]*\)\s*/g,"").trim()}function ue(a,t=""){return a==null||a===""?"":typeof a=="boolean"?a?"✓":"✗":typeof a=="number"?t.includes("bp")||t.includes("blood_pressure")?`${a} mmHg`:t.includes("gfap")?`${a} pg/mL`:t.includes("age")?`${a} years`:t.includes("score")||Number.isInteger(a)?a.toString():a.toFixed(1):a.toString()}const Y={bayern:{neurosurgicalCenters:[{id:"BY-NS-001",name:"LMU Klinikum München - Großhadern",address:"Marchioninistraße 15, 81377 München",coordinates:{lat:48.1106,lng:11.4684},phone:"+49 89 4400-0",emergency:"+49 89 4400-73331",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1440,network:"TEMPiS"},{id:"BY-NS-002",name:"Klinikum rechts der Isar München (TUM)",address:"Ismaninger Str. 22, 81675 München",coordinates:{lat:48.1497,lng:11.6052},phone:"+49 89 4140-0",emergency:"+49 89 4140-2249",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1161,network:"TEMPiS"},{id:"BY-NS-003",name:"Städtisches Klinikum München Schwabing",address:"Kölner Platz 1, 80804 München",coordinates:{lat:48.1732,lng:11.5755},phone:"+49 89 3068-0",emergency:"+49 89 3068-2050",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:648,network:"TEMPiS"},{id:"BY-NS-004",name:"Städtisches Klinikum München Bogenhausen",address:"Englschalkinger Str. 77, 81925 München",coordinates:{lat:48.1614,lng:11.6254},phone:"+49 89 9270-0",emergency:"+49 89 9270-2050",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:689,network:"TEMPiS"},{id:"BY-NS-005",name:"Universitätsklinikum Erlangen",address:"Maximiliansplatz 2, 91054 Erlangen",coordinates:{lat:49.5982,lng:11.0037},phone:"+49 9131 85-0",emergency:"+49 9131 85-39003",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1371,network:"TEMPiS"},{id:"BY-NS-006",name:"Universitätsklinikum Regensburg",address:"Franz-Josef-Strauß-Allee 11, 93053 Regensburg",coordinates:{lat:49.0134,lng:12.0991},phone:"+49 941 944-0",emergency:"+49 941 944-7501",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1042,network:"TEMPiS"},{id:"BY-NS-007",name:"Universitätsklinikum Würzburg",address:"Oberdürrbacher Str. 6, 97080 Würzburg",coordinates:{lat:49.784,lng:9.9721},phone:"+49 931 201-0",emergency:"+49 931 201-24444",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1264,network:"TEMPiS"},{id:"BY-NS-008",name:"Klinikum Nürnberg Nord",address:"Prof.-Ernst-Nathan-Str. 1, 90419 Nürnberg",coordinates:{lat:49.4521,lng:11.0767},phone:"+49 911 398-0",emergency:"+49 911 398-2369",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1368,network:"TEMPiS"},{id:"BY-NS-009",name:"Universitätsklinikum Augsburg",address:"Stenglinstr. 2, 86156 Augsburg",coordinates:{lat:48.3668,lng:10.9093},phone:"+49 821 400-01",emergency:"+49 821 400-2356",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1740,network:"TEMPiS"},{id:"BY-NS-010",name:"Klinikum Aschaffenburg-Alzenau",address:"Am Hasenkopf 1, 63739 Aschaffenburg",coordinates:{lat:49.9737,lng:9.157},phone:"+49 6021 32-0",emergency:"+49 6021 32-2800",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:40,network:"TRANSIT"},{id:"BY-NS-011",name:"Klinikum Landshut",address:"Robert-Koch-Str. 1, 84034 Landshut",coordinates:{lat:48.5665,lng:12.1512},phone:"+49 871 698-0",emergency:"+49 871 698-3333",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:505,network:"TEMPiS"},{id:"BY-NS-012",name:"Klinikum Coburg",address:"Ketschendorfer Str. 33, 96450 Coburg",coordinates:{lat:50.2596,lng:10.9644},phone:"+49 9561 22-0",emergency:"+49 9561 22-6800",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:547,network:"STENO"},{id:"BY-NS-013",name:"Klinikum Passau",address:"Bischof-Pilgrim-Str. 1, 94032 Passau",coordinates:{lat:48.5665,lng:13.4777},phone:"+49 851 5300-0",emergency:"+49 851 5300-2222",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:696,network:"TEMPiS"}],comprehensiveStrokeCenters:[{id:"BY-CS-001",name:"Klinikum Bamberg",address:"Buger Str. 80, 96049 Bamberg",coordinates:{lat:49.8988,lng:10.9027},phone:"+49 951 503-0",emergency:"+49 951 503-11101",thrombectomy:!0,thrombolysis:!0,beds:630,network:"TEMPiS"},{id:"BY-CS-002",name:"Klinikum Bayreuth",address:"Preuschwitzer Str. 101, 95445 Bayreuth",coordinates:{lat:49.9459,lng:11.5779},phone:"+49 921 400-0",emergency:"+49 921 400-5401",thrombectomy:!0,thrombolysis:!0,beds:848,network:"TEMPiS"},{id:"BY-CS-003",name:"Klinikum Coburg",address:"Ketschendorfer Str. 33, 96450 Coburg",coordinates:{lat:50.2596,lng:10.9685},phone:"+49 9561 22-0",emergency:"+49 9561 22-6300",thrombectomy:!0,thrombolysis:!0,beds:522,network:"TEMPiS"}],regionalStrokeUnits:[{id:"BY-RSU-001",name:"Goldberg-Klinik Kelheim",address:"Traubenweg 3, 93309 Kelheim",coordinates:{lat:48.9166,lng:11.8742},phone:"+49 9441 702-0",emergency:"+49 9441 702-6800",thrombolysis:!0,beds:200,network:"TEMPiS"},{id:"BY-RSU-002",name:"DONAUISAR Klinikum Deggendorf",address:"Perlasberger Str. 41, 94469 Deggendorf",coordinates:{lat:48.8372,lng:12.9619},phone:"+49 991 380-0",emergency:"+49 991 380-2201",thrombolysis:!0,beds:450,network:"TEMPiS"},{id:"BY-RSU-003",name:"Klinikum St. Elisabeth Straubing",address:"St.-Elisabeth-Str. 23, 94315 Straubing",coordinates:{lat:48.8742,lng:12.5733},phone:"+49 9421 710-0",emergency:"+49 9421 710-2000",thrombolysis:!0,beds:580,network:"TEMPiS"},{id:"BY-RSU-004",name:"Klinikum Freising",address:"Mainburger Str. 29, 85356 Freising",coordinates:{lat:48.4142,lng:11.7461},phone:"+49 8161 24-0",emergency:"+49 8161 24-2800",thrombolysis:!0,beds:380,network:"TEMPiS"},{id:"BY-RSU-005",name:"Klinikum Landkreis Erding",address:"Bajuwarenstr. 5, 85435 Erding",coordinates:{lat:48.3061,lng:11.9067},phone:"+49 8122 59-0",emergency:"+49 8122 59-2201",thrombolysis:!0,beds:350,network:"TEMPiS"},{id:"BY-RSU-006",name:"Helios Amper-Klinikum Dachau",address:"Krankenhausstr. 15, 85221 Dachau",coordinates:{lat:48.2599,lng:11.4342},phone:"+49 8131 76-0",emergency:"+49 8131 76-2201",thrombolysis:!0,beds:480,network:"TEMPiS"},{id:"BY-RSU-007",name:"Klinikum Fürstenfeldbruck",address:"Dachauer Str. 33, 82256 Fürstenfeldbruck",coordinates:{lat:48.1772,lng:11.2578},phone:"+49 8141 99-0",emergency:"+49 8141 99-2201",thrombolysis:!0,beds:420,network:"TEMPiS"},{id:"BY-RSU-008",name:"Klinikum Ingolstadt",address:"Krumenauerstraße 25, 85049 Ingolstadt",coordinates:{lat:48.7665,lng:11.4364},phone:"+49 841 880-0",emergency:"+49 841 880-2201",thrombolysis:!0,beds:665,network:"TEMPiS"},{id:"BY-RSU-009",name:"Klinikum Passau",address:"Bischof-Pilgrim-Str. 1, 94032 Passau",coordinates:{lat:48.5665,lng:13.4513},phone:"+49 851 5300-0",emergency:"+49 851 5300-2100",thrombolysis:!0,beds:540,network:"TEMPiS"},{id:"BY-RSU-010",name:"Klinikum Landshut",address:"Robert-Koch-Str. 1, 84034 Landshut",coordinates:{lat:48.5436,lng:12.1619},phone:"+49 871 698-0",emergency:"+49 871 698-3333",thrombolysis:!0,beds:790,network:"TEMPiS"},{id:"BY-RSU-011",name:"RoMed Klinikum Rosenheim",address:"Pettenkoferstr. 10, 83022 Rosenheim",coordinates:{lat:47.8567,lng:12.1265},phone:"+49 8031 365-0",emergency:"+49 8031 365-3711",thrombolysis:!0,beds:870,network:"TEMPiS"},{id:"BY-RSU-012",name:"Klinikum Memmingen",address:"Bismarckstr. 23, 87700 Memmingen",coordinates:{lat:47.9833,lng:10.1833},phone:"+49 8331 70-0",emergency:"+49 8331 70-2500",thrombolysis:!0,beds:520,network:"TEMPiS"},{id:"BY-RSU-013",name:"Klinikum Kempten-Oberallgäu",address:"Robert-Weixler-Str. 50, 87439 Kempten",coordinates:{lat:47.7261,lng:10.3097},phone:"+49 831 530-0",emergency:"+49 831 530-2201",thrombolysis:!0,beds:650,network:"TEMPiS"},{id:"BY-RSU-014",name:"Klinikum Aschaffenburg-Alzenau",address:"Am Hasenkopf 1, 63739 Aschaffenburg",coordinates:{lat:49.9747,lng:9.1581},phone:"+49 6021 32-0",emergency:"+49 6021 32-2700",thrombolysis:!0,beds:590,network:"TEMPiS"}],thrombolysisHospitals:[{id:"BY-TH-001",name:"Krankenhaus Vilsbiburg",address:"Sonnenstraße 10, 84137 Vilsbiburg",coordinates:{lat:48.6333,lng:12.2833},phone:"+49 8741 60-0",thrombolysis:!0,beds:180},{id:"BY-TH-002",name:"Krankenhaus Eggenfelden",address:"Pfarrkirchener Str. 5, 84307 Eggenfelden",coordinates:{lat:48.4,lng:12.7667},phone:"+49 8721 98-0",thrombolysis:!0,beds:220}]},badenWuerttemberg:{neurosurgicalCenters:[{id:"BW-NS-001",name:"Universitätsklinikum Freiburg",address:"Hugstetter Str. 55, 79106 Freiburg",coordinates:{lat:48.0025,lng:7.8347},phone:"+49 761 270-0",emergency:"+49 761 270-34010",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1600,network:"FAST"},{id:"BW-NS-002",name:"Universitätsklinikum Heidelberg",address:"Im Neuenheimer Feld 400, 69120 Heidelberg",coordinates:{lat:49.4178,lng:8.6706},phone:"+49 6221 56-0",emergency:"+49 6221 56-36643",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1621,network:"FAST"},{id:"BW-NS-003",name:"Universitätsklinikum Tübingen",address:"Geissweg 3, 72076 Tübingen",coordinates:{lat:48.5378,lng:9.0538},phone:"+49 7071 29-0",emergency:"+49 7071 29-82211",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1550,network:"FAST"},{id:"BW-NS-004",name:"Universitätsklinikum Ulm",address:"Albert-Einstein-Allee 23, 89081 Ulm",coordinates:{lat:48.4196,lng:9.9592},phone:"+49 731 500-0",emergency:"+49 731 500-63001",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1264,network:"FAST"},{id:"BW-NS-005",name:"Klinikum Stuttgart - Katharinenhospital",address:"Kriegsbergstraße 60, 70174 Stuttgart",coordinates:{lat:48.7784,lng:9.1682},phone:"+49 711 278-0",emergency:"+49 711 278-32001",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:950,network:"FAST"},{id:"BW-NS-006",name:"Städtisches Klinikum Karlsruhe",address:"Moltkestraße 90, 76133 Karlsruhe",coordinates:{lat:49.0047,lng:8.3858},phone:"+49 721 974-0",emergency:"+49 721 974-2301",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1570,network:"FAST"},{id:"BW-NS-007",name:"Klinikum Ludwigsburg",address:"Posilipostraße 4, 71640 Ludwigsburg",coordinates:{lat:48.8901,lng:9.1953},phone:"+49 7141 99-0",emergency:"+49 7141 99-67201",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:720,network:"FAST"}],comprehensiveStrokeCenters:[{id:"BW-CS-001",name:"Universitätsmedizin Mannheim",address:"Theodor-Kutzer-Ufer 1-3, 68167 Mannheim",coordinates:{lat:49.4828,lng:8.4664},phone:"+49 621 383-0",emergency:"+49 621 383-2251",thrombectomy:!0,thrombolysis:!0,beds:1400,network:"FAST"}],regionalStrokeUnits:[{id:"BW-RSU-001",name:"Robert-Bosch-Krankenhaus Stuttgart",address:"Auerbachstraße 110, 70376 Stuttgart",coordinates:{lat:48.7447,lng:9.2294},phone:"+49 711 8101-0",emergency:"+49 711 8101-3456",thrombolysis:!0,beds:850,network:"FAST"}],thrombolysisHospitals:[]},nordrheinWestfalen:{neurosurgicalCenters:[{id:"NRW-NS-001",name:"Universitätsklinikum Düsseldorf",address:"Moorenstraße 5, 40225 Düsseldorf",coordinates:{lat:51.1906,lng:6.8064},phone:"+49 211 81-0",emergency:"+49 211 81-17700",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1300,network:"NEVANO+"},{id:"NRW-NS-002",name:"Universitätsklinikum Köln",address:"Kerpener Str. 62, 50937 Köln",coordinates:{lat:50.9253,lng:6.9187},phone:"+49 221 478-0",emergency:"+49 221 478-32500",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1500,network:"NEVANO+"},{id:"NRW-NS-003",name:"Universitätsklinikum Essen",address:"Hufelandstraße 55, 45147 Essen",coordinates:{lat:51.4285,lng:7.0073},phone:"+49 201 723-0",emergency:"+49 201 723-84444",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1350,network:"NEVANO+"},{id:"NRW-NS-004",name:"Universitätsklinikum Münster",address:"Albert-Schweitzer-Campus 1, 48149 Münster",coordinates:{lat:51.9607,lng:7.6261},phone:"+49 251 83-0",emergency:"+49 251 83-47255",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1513,network:"NEVANO+"},{id:"NRW-NS-005",name:"Universitätsklinikum Bonn",address:"Venusberg-Campus 1, 53127 Bonn",coordinates:{lat:50.6916,lng:7.1127},phone:"+49 228 287-0",emergency:"+49 228 287-15107",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1200,network:"NEVANO+"},{id:"NRW-NS-006",name:"Klinikum Dortmund",address:"Beurhausstraße 40, 44137 Dortmund",coordinates:{lat:51.5036,lng:7.4663},phone:"+49 231 953-0",emergency:"+49 231 953-20050",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1200,network:"NVNR"},{id:"NRW-NS-007",name:"Rhein-Maas Klinikum Würselen",address:"Mauerfeldstraße 25, 52146 Würselen",coordinates:{lat:50.8178,lng:6.1264},phone:"+49 2405 62-0",emergency:"+49 2405 62-2222",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:420,network:"NEVANO+"}],comprehensiveStrokeCenters:[{id:"NRW-CS-001",name:"Universitätsklinikum Aachen",address:"Pauwelsstraße 30, 52074 Aachen",coordinates:{lat:50.778,lng:6.0614},phone:"+49 241 80-0",emergency:"+49 241 80-89611",thrombectomy:!0,thrombolysis:!0,beds:1400,network:"NEVANO+"}],regionalStrokeUnits:[{id:"NRW-RSU-001",name:"Helios Universitätsklinikum Wuppertal",address:"Heusnerstraße 40, 42283 Wuppertal",coordinates:{lat:51.2467,lng:7.1703},phone:"+49 202 896-0",emergency:"+49 202 896-2180",thrombolysis:!0,beds:1050,network:"NEVANO+"}],thrombolysisHospitals:[{id:"NRW-TH-009",name:"Elisabeth-Krankenhaus Essen",address:"Klara-Kopp-Weg 1, 45138 Essen",coordinates:{lat:51.4495,lng:7.0137},phone:"+49 201 897-0",thrombolysis:!0,beds:583},{id:"NRW-TH-010",name:"Klinikum Oberberg Gummersbach",address:"Wilhelm-Breckow-Allee 20, 51643 Gummersbach",coordinates:{lat:51.0277,lng:7.5694},phone:"+49 2261 17-0",thrombolysis:!0,beds:431},{id:"NRW-TH-011",name:"St. Vincenz-Krankenhaus Limburg",address:"Auf dem Schafsberg, 65549 Limburg",coordinates:{lat:50.3856,lng:8.0584},phone:"+49 6431 292-0",thrombolysis:!0,beds:452},{id:"NRW-TH-012",name:"Klinikum Lüdenscheid",address:"Paulmannshöher Straße 14, 58515 Lüdenscheid",coordinates:{lat:51.2186,lng:7.6298},phone:"+49 2351 46-0",thrombolysis:!0,beds:869}]}},me={routePatient:function(a){const{location:t,state:e,ichProbability:s,timeFromOnset:i,clinicalFactors:n}=a,o=e||this.detectState(t),c=Y[o];if(s>=.5){const l=this.findNearest(t,c.neurosurgicalCenters);if(!l)throw new Error(`No neurosurgical centers available in ${o}`);return{category:"NEUROSURGICAL_CENTER",destination:l,urgency:"IMMEDIATE",reasoning:"High bleeding probability (≥50%) - neurosurgical evaluation required",preAlert:"Activate neurosurgery team",bypassLocal:!0,threshold:"≥50%",state:o}}else if(s>=.3){const l=[...c.neurosurgicalCenters,...c.comprehensiveStrokeCenters];return{category:"COMPREHENSIVE_CENTER",destination:this.findNearest(t,l),urgency:"URGENT",reasoning:"Intermediate bleeding risk (30-50%) - CT and possible intervention",preAlert:"Prepare for possible neurosurgical consultation",transferPlan:this.findNearest(t,c.neurosurgicalCenters),threshold:"30-50%",state:o}}else if(i&&i<=270){const l=[...c.neurosurgicalCenters,...c.comprehensiveStrokeCenters,...c.regionalStrokeUnits,...c.thrombolysisHospitals];return{category:"THROMBOLYSIS_CAPABLE",destination:this.findNearest(t,l),urgency:"TIME_CRITICAL",reasoning:"Low bleeding risk (<30%), within tPA window - nearest thrombolysis",preAlert:"Prepare for thrombolysis protocol",bypassLocal:!1,threshold:"<30%",timeWindow:"≤4.5h",state:o}}else{const l=[...c.neurosurgicalCenters,...c.comprehensiveStrokeCenters,...c.regionalStrokeUnits];return{category:"STROKE_UNIT",destination:this.findNearest(t,l),urgency:"STANDARD",reasoning:i>270?"Low bleeding risk, outside tPA window - standard stroke evaluation":"Low bleeding risk - standard stroke evaluation",preAlert:"Standard stroke protocol",bypassLocal:!1,threshold:"<30%",timeWindow:i?">4.5h":"unknown",state:o}}},detectState:function(a){return a.lat>=47.5&&a.lat<=49.8&&a.lng>=7.5&&a.lng<=10.2?"badenWuerttemberg":a.lat>=50.3&&a.lat<=52.5&&a.lng>=5.9&&a.lng<=9.5?"nordrheinWestfalen":a.lat>=47.2&&a.lat<=50.6&&a.lng>=10.2&&a.lng<=13.8?"bayern":this.findNearestState(a)},findNearestState:function(a){const t={bayern:{lat:49,lng:11.5},badenWuerttemberg:{lat:48.5,lng:9},nordrheinWestfalen:{lat:51.5,lng:7.5}};let e="bayern",s=1/0;for(const[i,n]of Object.entries(t)){const o=this.calculateDistance(a,n);o<s&&(s=o,e=i)}return e},findNearest:function(a,t){return!t||t.length===0?(console.warn("No hospitals available in database"),null):t.map(e=>!e.coordinates||typeof e.coordinates.lat!="number"?(console.warn(`Hospital ${e.name} missing valid coordinates`),null):{...e,distance:this.calculateDistance(a,e.coordinates)}).filter(e=>e!==null).sort((e,s)=>e.distance-s.distance)[0]},calculateDistance:function(a,t){const s=this.toRad(t.lat-a.lat),i=this.toRad(t.lng-a.lng),n=Math.sin(s/2)*Math.sin(s/2)+Math.cos(this.toRad(a.lat))*Math.cos(this.toRad(t.lat))*Math.sin(i/2)*Math.sin(i/2);return 6371*(2*Math.atan2(Math.sqrt(n),Math.sqrt(1-n)))},toRad:function(a){return a*(Math.PI/180)}};function C(a,t,e,s){const n=A(e-a),o=A(s-t),c=Math.sin(n/2)*Math.sin(n/2)+Math.cos(A(a))*Math.cos(A(e))*Math.sin(o/2)*Math.sin(o/2);return 6371*(2*Math.atan2(Math.sqrt(c),Math.sqrt(1-c)))}function A(a){return a*(Math.PI/180)}async function ge(a,t,e,s,i="driving-car"){try{const n=`https://api.openrouteservice.org/v2/directions/${i}`,c=await fetch(n,{method:"POST",headers:{Accept:"application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",Authorization:"5b3ce3597851110001cf624868c4c27b63ae476c9c26c8bffbc35688","Content-Type":"application/json; charset=utf-8"},body:JSON.stringify({coordinates:[[t,a],[s,e]],radiuses:[1e3,1e3],format:"json"})});if(!c.ok)throw new Error(`Routing API error: ${c.status}`);const l=await c.json();if(l.routes&&l.routes.length>0){const d=l.routes[0];return{duration:Math.round(d.summary.duration/60),distance:Math.round(d.summary.distance/1e3),source:"routing"}}else throw new Error("No route found")}catch(n){console.warn("Travel time calculation failed, using distance estimate:",n);const o=C(a,t,e,s);return{duration:Math.round(o/.8),distance:Math.round(o),source:"estimated"}}}async function H(a,t,e,s){try{const i=await ge(a,t,e,s,"driving-car");return{duration:Math.round(i.duration*.75),distance:i.distance,source:i.source==="routing"?"emergency-routing":"emergency-estimated"}}catch{const n=C(a,t,e,s);return{duration:Math.round(n/1.2),distance:Math.round(n),source:"emergency-estimated"}}}function j(a){return`
    <div class="stroke-center-section">
      <h3>🏥 ${r("nearestCentersTitle")}</h3>
      <div id="locationContainer">
        <div class="location-controls">
          <button type="button" id="useGpsButton" class="secondary">
            📍 ${r("useCurrentLocation")}
          </button>
          <div class="location-manual" style="display: none;">
            <input type="text" id="locationInput" placeholder="${r("enterLocationPlaceholder")||"e.g. München, Köln, Stuttgart, or 48.1351, 11.5820"}" />
            <button type="button" id="searchLocationButton" class="secondary">${r("search")}</button>
          </div>
          <button type="button" id="manualLocationButton" class="secondary">
            ✏️ ${r("enterManually")}
          </button>
        </div>
        <div id="strokeCenterResults" class="stroke-center-results"></div>
      </div>
    </div>
  `}function pe(a){const t=document.getElementById("useGpsButton"),e=document.getElementById("manualLocationButton"),s=document.querySelector(".location-manual"),i=document.getElementById("locationInput"),n=document.getElementById("searchLocationButton"),o=document.getElementById("strokeCenterResults");t&&t.addEventListener("click",()=>{he(a,o)}),e&&e.addEventListener("click",()=>{s.style.display=s.style.display==="none"?"block":"none"}),n&&n.addEventListener("click",()=>{const c=i.value.trim();c&&x(c,a,o)}),i&&i.addEventListener("keypress",c=>{if(c.key==="Enter"){const l=i.value.trim();l&&x(l,a,o)}})}function he(a,t){if(!navigator.geolocation){w(r("geolocationNotSupported"),t);return}t.innerHTML=`<div class="loading">${r("gettingLocation")}...</div>`,navigator.geolocation.getCurrentPosition(e=>{const{latitude:s,longitude:i}=e.coords;R(s,i,a,t)},e=>{let s=r("locationError");switch(e.code){case e.PERMISSION_DENIED:s=r("locationPermissionDenied");break;case e.POSITION_UNAVAILABLE:s=r("locationUnavailable");break;case e.TIMEOUT:s=r("locationTimeout");break}w(s,t)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:3e5})}async function x(a,t,e){e.innerHTML=`<div class="loading">${r("searchingLocation")}...</div>`;const s=/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/,i=a.trim().match(s);if(i){const n=parseFloat(i[1]),o=parseFloat(i[2]);if(n>=47.2&&n<=52.5&&o>=5.9&&o<=15){e.innerHTML=`
        <div class="location-success">
          <p>📍 Coordinates: ${n.toFixed(4)}, ${o.toFixed(4)}</p>
        </div>
      `,setTimeout(()=>{R(n,o,t,e)},500);return}else{w("Coordinates appear to be outside Germany. Please check the values.",e);return}}try{let n=a.trim();!n.toLowerCase().includes("deutschland")&&!n.toLowerCase().includes("germany")&&!n.toLowerCase().includes("bayern")&&!n.toLowerCase().includes("bavaria")&&!n.toLowerCase().includes("nordrhein")&&!n.toLowerCase().includes("baden")&&(n=n+", Deutschland");const c=`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(n)}&countrycodes=de&format=json&limit=3&addressdetails=1`,l=await fetch(c,{method:"GET",headers:{Accept:"application/json","User-Agent":"iGFAP-StrokeTriage/2.1.0"}});if(!l.ok)throw new Error(`Geocoding API error: ${l.status}`);const d=await l.json();if(d&&d.length>0){let g=d[0];const p=["Bayern","Baden-Württemberg","Nordrhein-Westfalen"];for(const h of d)if(h.address&&p.includes(h.address.state)){g=h;break}const y=parseFloat(g.lat),f=parseFloat(g.lon),u=g.display_name||a;e.innerHTML=`
        <div class="location-success">
          <p>📍 Found: ${u}</p>
          <small style="color: #666;">Lat: ${y.toFixed(4)}, Lng: ${f.toFixed(4)}</small>
        </div>
      `,setTimeout(()=>{R(y,f,t,e)},1e3)}else w(`
        <strong>Location "${a}" not found.</strong><br>
        <small>Try:</small>
        <ul style="text-align: left; font-size: 0.9em; margin: 10px 0;">
          <li>City name: "München", "Köln", "Stuttgart"</li>
          <li>Address: "Marienplatz 1, München"</li>
          <li>Coordinates: "48.1351, 11.5820"</li>
        </ul>
      `,e)}catch(n){console.warn("Geocoding failed:",n),w(`
      <strong>Unable to search location.</strong><br>
      <small>Please try entering coordinates directly (e.g., "48.1351, 11.5820")</small>
    `,e)}}async function R(a,t,e,s){var c,l;const i={lat:a,lng:t},n=me.routePatient({location:i,ichProbability:((c=e==null?void 0:e.ich)==null?void 0:c.probability)||0,timeFromOnset:(e==null?void 0:e.timeFromOnset)||null,clinicalFactors:(e==null?void 0:e.clinicalFactors)||{}});if(!n||!n.destination){s.innerHTML=`
      <div class="location-error">
        <p>⚠️ No suitable stroke centers found in this area.</p>
        <p><small>Please try a different location or contact emergency services directly.</small></p>
      </div>
    `;return}const o=be(n,e);s.innerHTML=`
    <div class="location-info">
      <p><strong>${r("yourLocation")}:</strong> ${a.toFixed(4)}, ${t.toFixed(4)}</p>
      <p><strong>Detected State:</strong> ${O(n.state)}</p>
    </div>
    <div class="loading">${r("calculatingTravelTimes")}...</div>
  `;try{const d=Y[n.state],g=[...d.neurosurgicalCenters,...d.comprehensiveStrokeCenters,...d.regionalStrokeUnits,...d.thrombolysisHospitals||[]],p=n.destination;p.distance=C(a,t,p.coordinates.lat,p.coordinates.lng);try{const u=await H(a,t,p.coordinates.lat,p.coordinates.lng);p.travelTime=u.duration,p.travelSource=u.source}catch{p.travelTime=Math.round(p.distance/.8),p.travelSource="estimated"}const y=g.filter(u=>u.id!==p.id).map(u=>({...u,distance:C(a,t,u.coordinates.lat,u.coordinates.lng)})).sort((u,h)=>u.distance-h.distance).slice(0,3);for(const u of y)try{const h=await H(a,t,u.coordinates.lat,u.coordinates.lng);u.travelTime=h.duration,u.travelSource=h.source}catch{u.travelTime=Math.round(u.distance/.8),u.travelSource="estimated"}const f=`
      <div class="location-info">
        <p><strong>${r("yourLocation")}:</strong> ${a.toFixed(4)}, ${t.toFixed(4)}</p>
        <p><strong>State:</strong> ${O(n.state)}</p>
        ${o}
      </div>
      
      <div class="recommended-centers">
        <h4>🏥 ${n.urgency==="IMMEDIATE"?"Emergency":"Recommended"} Destination</h4>
        ${z(p,!0,n)}
      </div>
      
      ${y.length>0?`
        <div class="alternative-centers">
          <h4>Alternative Centers</h4>
          ${y.map(u=>z(u,!1,n)).join("")}
        </div>
      `:""}
      
      <div class="travel-time-note">
        <small>${r("travelTimeNote")||"Travel times estimated for emergency vehicles"}</small>
      </div>
    `;s.innerHTML=f}catch(d){console.warn("Enhanced routing failed, using basic display:",d),s.innerHTML=`
      <div class="location-info">
        <p><strong>${r("yourLocation")}:</strong> ${a.toFixed(4)}, ${t.toFixed(4)}</p>
        ${o}
      </div>
      
      <div class="recommended-centers">
        <h4>Recommended Center</h4>
        <div class="stroke-center-card recommended">
          <div class="center-header">
            <h5>${n.destination.name}</h5>
            <span class="distance">${((l=n.destination.distance)==null?void 0:l.toFixed(1))||"?"} km</span>
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
    `}}function O(a){return{bayern:"Bayern (Bavaria)",badenWuerttemberg:"Baden-Württemberg",nordrheinWestfalen:"Nordrhein-Westfalen (NRW)"}[a]||a}function be(a,t){var i;const e=Math.round((((i=t==null?void 0:t.ich)==null?void 0:i.probability)||0)*100);let s="🏥";return a.urgency==="IMMEDIATE"?s="🚨":a.urgency==="TIME_CRITICAL"?s="⏰":a.urgency==="URGENT"&&(s="⚠️"),`
    <div class="routing-explanation ${a.category.toLowerCase()}">
      <div class="routing-header">
        <strong>${s} ${a.category.replace("_"," ")} - ${a.urgency}</strong>
      </div>
      <div class="routing-details">
        <p><strong>ICH Risk:</strong> ${e}% ${a.threshold?`(${a.threshold})`:""}</p>
        ${a.timeWindow?`<p><strong>Time Window:</strong> ${a.timeWindow}</p>`:""}
        <p><strong>Routing Logic:</strong> ${a.reasoning}</p>
        <p><strong>Pre-Alert:</strong> ${a.preAlert}</p>
        ${a.bypassLocal?'<p class="bypass-warning">⚠️ Bypassing local hospitals</p>':""}
      </div>
    </div>
  `}function z(a,t,e){const s=[];a.neurosurgery&&s.push("🧠 Neurosurgery"),a.thrombectomy&&s.push("🩸 Thrombectomy"),a.thrombolysis&&s.push("💉 Thrombolysis");const i=a.network?`<span class="network-badge">${a.network}</span>`:"";return`
    <div class="stroke-center-card ${t?"recommended":"alternative"} enhanced">
      <div class="center-header">
        <h5>${a.name}</h5>
        <div class="center-badges">
          ${a.neurosurgery?'<span class="capability-badge neurosurgery">NS</span>':""}
          ${a.thrombectomy?'<span class="capability-badge thrombectomy">TE</span>':""}
          ${i}
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
        
        ${s.length>0?`
          <div class="capabilities">
            ${s.join(" • ")}
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
  `}function w(a,t){t.innerHTML=`
    <div class="location-error">
      <p>⚠️ ${a}</p>
      <p><small>${r("tryManualEntry")}</small></p>
    </div>
  `}function ye(a,t){const e=Number(a),s=N[t];return e>=s.high?"🔴 HIGH RISK":e>=s.medium?"🟡 MEDIUM RISK":"🟢 LOW RISK"}function J(){const t=m.getState().formData;if(!t||Object.keys(t).length===0)return"";let e="";return Object.entries(t).forEach(([s,i])=>{if(i&&Object.keys(i).length>0){const n=r(`${s}ModuleTitle`)||s.charAt(0).toUpperCase()+s.slice(1);let o="";Object.entries(i).forEach(([c,l])=>{if(l===""||l===null||l===void 0)return;let d=de(c),g=ue(l,c);o+=`
          <div class="summary-item">
            <span class="summary-label">${d}:</span>
            <span class="summary-value">${g}</span>
          </div>
        `}),o&&(e+=`
          <div class="summary-module">
            <h4>${n}</h4>
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
  `:""}function Z(a,t,e){if(!t)return"";const s=Math.round((t.probability||0)*100),i=ye(s,a),n=s>N[a].critical,o=s>N[a].high,c={ich:"🩸",lvo:"🧠"},l={ich:r("ichProbability"),lvo:r("lvoProbability")},d={ich:"ICH",lvo:T.getCurrentLanguage()==="de"?"Großgefäßverschluss":"Large Vessel Occlusion"};return`
    <div class="enhanced-risk-card ${a} ${n?"critical":o?"high":"normal"}">
      <div class="risk-header">
        <div class="risk-icon">${c[a]}</div>
        <div class="risk-title">
          <h3>${l[a]}</h3>
          <span class="risk-subtitle">${d[a]}</span>
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
          <div class="risk-level ${n?"critical":o?"high":"normal"}">
            ${i}
          </div>
        </div>
      </div>
    </div>
  `}function ve(a,t){const{ich:e,lvo:s}=a,i=(e==null?void 0:e.module)==="Limited"||(e==null?void 0:e.module)==="Coma"||(s==null?void 0:s.notPossible)===!0;return e==null||e.module,i?fe(e):ke(e,s)}function fe(a,t,e){const s=a&&a.probability>.6?G():"",i=j(),n=J();return`
    <div class="container">
      ${S(3)}
      <h2>${r("bleedingRiskAssessment")||"Blutungsrisiko-Bewertung / Bleeding Risk Assessment"}</h2>
      ${s}
      
      <!-- Single ICH Risk Card -->
      <div class="risk-results-single">
        ${Z("ich",a)}
      </div>
      
      <!-- ICH Drivers Only -->
      <div class="enhanced-drivers-section">
        <h3>${r("riskFactorsTitle")||"Hauptrisikofaktoren / Main Risk Factors"}</h3>
        ${Q(a)}
      </div>
      
      <!-- Collapsible Additional Information -->
      <div class="additional-info-section">
        <button class="info-toggle" data-target="input-summary">
          <span class="toggle-icon">📋</span>
          <span class="toggle-text">${r("inputSummaryTitle")}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="input-summary" style="display: none;">
          ${n}
        </div>
        
        <button class="info-toggle" data-target="stroke-centers">
          <span class="toggle-icon">🏥</span>
          <span class="toggle-text">${r("nearestCentersTitle")}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="stroke-centers" style="display: none;">
          ${i}
        </div>
      </div>
      
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
  `}function ke(a,t,e,s){const i=Math.round(((a==null?void 0:a.probability)||0)*100),n=Math.round(((t==null?void 0:t.probability)||0)*100),o=a&&a.probability>.6?G():"",c=j(),l=J(),d=i<30&&n>50;return`
    <div class="container">
      ${S(3)}
      <h2>${r("resultsTitle")}</h2>
      ${o}
      
      <!-- Primary ICH Risk Display -->
      <div class="risk-results-single">
        ${Z("ich",a)}
        ${d?Se():""}
      </div>
      
      <!-- ICH Drivers Only -->
      <div class="enhanced-drivers-section">
        <h3>${r("riskFactorsTitle")||"Risikofaktoren / Risk Factors"}</h3>
        ${Q(a)}
      </div>
      
      <!-- Collapsible Additional Information -->
      <div class="additional-info-section">
        <button class="info-toggle" data-target="input-summary">
          <span class="toggle-icon">📋</span>
          <span class="toggle-text">${r("inputSummaryTitle")}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="input-summary" style="display: none;">
          ${l}
        </div>
        
        <button class="info-toggle" data-target="stroke-centers">
          <span class="toggle-icon">🏥</span>
          <span class="toggle-text">${r("nearestCentersTitle")}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="stroke-centers" style="display: none;">
          ${c}
        </div>
      </div>
      
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
  `}function Se(){return`
    <div class="secondary-notification">
      <p class="lvo-possible">
        ⚡ ${r("lvoMayBePossible")||"Großgefäßverschluss möglich / Large vessel occlusion possible"}
      </p>
    </div>
  `}function Q(a){if(!a||!a.drivers)return'<p class="no-drivers">No driver data available</p>';const t=a.drivers;if(!t.positive&&!t.negative)return'<p class="no-drivers">Driver format error</p>';const e=t.positive||[],s=t.negative||[];return`
    <div class="drivers-split-view">
      <div class="drivers-column positive-column">
        <div class="column-header">
          <span class="column-icon">⬆</span>
          <span class="column-title">${r("increasingRisk")||"Risikoerhöhend / Increasing Risk"}</span>
        </div>
        <div class="compact-drivers">
          ${e.length>0?e.slice(0,5).map(i=>K(i,"positive")).join(""):`<p class="no-factors">${r("noFactors")||"Keine Faktoren / No factors"}</p>`}
        </div>
      </div>
      
      <div class="drivers-column negative-column">
        <div class="column-header">
          <span class="column-icon">⬇</span>
          <span class="column-title">${r("decreasingRisk")||"Risikomindernd / Decreasing Risk"}</span>
        </div>
        <div class="compact-drivers">
          ${s.length>0?s.slice(0,5).map(i=>K(i,"negative")).join(""):`<p class="no-factors">${r("noFactors")||"Keine Faktoren / No factors"}</p>`}
        </div>
      </div>
    </div>
  `}function K(a,t){const e=Math.abs(a.weight*100),s=Math.min(e*2,100);return`
    <div class="compact-driver-item">
      <div class="compact-driver-label">${q(a.label)}</div>
      <div class="compact-driver-bar ${t}" style="width: ${s}%;">
        <span class="compact-driver-value">${e.toFixed(1)}%</span>
      </div>
    </div>
  `}function Le(a,t,e){const s=[];return e.required&&!t&&t!==0&&s.push("This field is required"),e.min!==void 0&&t!==""&&!isNaN(t)&&parseFloat(t)<e.min&&s.push(`Value must be at least ${e.min}`),e.max!==void 0&&t!==""&&!isNaN(t)&&parseFloat(t)>e.max&&s.push(`Value must be at most ${e.max}`),e.pattern&&!e.pattern.test(t)&&s.push("Invalid format"),s}function Te(a){let t=!0;const e={};return Object.entries(ie).forEach(([s,i])=>{const n=a.elements[s];if(n){const o=Le(s,n.value,i);o.length>0&&(e[s]=o,t=!1)}}),{isValid:t,validationErrors:e}}function we(a,t){Object.entries(t).forEach(([e,s])=>{const i=a.querySelector(`[name="${e}"]`);if(i){const n=i.closest(".input-group");if(n){n.classList.add("error"),n.querySelectorAll(".error-message").forEach(c=>c.remove());const o=document.createElement("div");o.className="error-message",o.innerHTML=`<span class="error-icon">⚠️</span> ${s[0]}`,n.appendChild(o)}}})}function Ee(a){a.querySelectorAll(".input-group.error").forEach(t=>{t.classList.remove("error"),t.querySelectorAll(".error-message").forEach(e=>e.remove())})}function U(a,t){var o,c;console.log(`=== EXTRACTING ${t.toUpperCase()} DRIVERS ===`),console.log("Full response:",a);let e=null;if(t==="ICH"?(e=((o=a.ich_prediction)==null?void 0:o.drivers)||null,console.log("🧠 ICH raw drivers extracted:",e)):t==="LVO"&&(e=((c=a.lvo_prediction)==null?void 0:c.drivers)||null,console.log("🩸 LVO raw drivers extracted:",e)),!e)return console.log(`❌ No ${t} drivers found`),null;const s=Ae(e,t);console.log(`✅ ${t} drivers formatted:`,s);const n=[...s.positive,...s.negative].find(l=>l.label&&(l.label.toLowerCase().includes("fast")||l.label.includes("fast_ed")));return n?console.log(`🎯 FAST-ED found in ${t}:`,`${n.label}: ${n.weight>0?"+":""}${n.weight.toFixed(4)}`):console.log(`⚠️  FAST-ED NOT found in ${t} drivers`),s}function Ae(a,t){console.log(`🔄 Formatting ${t} drivers from dictionary:`,a);const e=[],s=[];return Object.entries(a).forEach(([i,n])=>{typeof n=="number"&&(n>0?e.push({label:i,weight:n}):n<0&&s.push({label:i,weight:Math.abs(n)}))}),e.sort((i,n)=>n.weight-i.weight),s.sort((i,n)=>n.weight-i.weight),console.log(`📈 ${t} positive drivers:`,e.slice(0,5)),console.log(`📉 ${t} negative drivers:`,s.slice(0,5)),{kind:"flat_dictionary",units:"logit",positive:e,negative:s,meta:{}}}function V(a,t){var s,i;console.log(`=== EXTRACTING ${t.toUpperCase()} PROBABILITY ===`);let e=0;return t==="ICH"?(e=((s=a.ich_prediction)==null?void 0:s.probability)||0,console.log("🧠 ICH probability extracted:",e)):t==="LVO"&&(e=((i=a.lvo_prediction)==null?void 0:i.probability)||0,console.log("🩸 LVO probability extracted:",e)),e}function W(a,t){var s,i;let e=.85;return t==="ICH"?e=((s=a.ich_prediction)==null?void 0:s.confidence)||.85:t==="LVO"&&(e=((i=a.lvo_prediction)==null?void 0:i.confidence)||.85),e}async function Ce(){console.log("Warming up Cloud Functions...");const a=Object.values(k).map(async t=>{try{const e=new AbortController,s=setTimeout(()=>e.abort(),3e3);await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({}),signal:e.signal,mode:"cors"}),clearTimeout(s),console.log(`Warmed up: ${t}`)}catch{console.log(`Warm-up attempt for ${t.split("/").pop()} completed`)}});Promise.all(a).then(()=>{console.log("Cloud Functions warm-up complete")})}class v extends Error{constructor(t,e,s){super(t),this.name="APIError",this.status=e,this.url=s}}function M(a){const t={...a};return Object.keys(t).forEach(e=>{const s=t[e];(typeof s=="boolean"||s==="on"||s==="true"||s==="false")&&(t[e]=s===!0||s==="on"||s==="true"?1:0)}),t}function $(a,t=0){const e=parseFloat(a);return isNaN(e)?t:e}async function B(a,t){const e=new AbortController,s=setTimeout(()=>e.abort(),P.requestTimeout);try{const i=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(t),signal:e.signal,mode:"cors"});if(clearTimeout(s),!i.ok){let o=`HTTP ${i.status}`;try{const c=await i.json();o=c.error||c.message||o}catch{o=`${o}: ${i.statusText}`}throw new v(o,i.status,a)}return await i.json()}catch(i){throw clearTimeout(s),i.name==="AbortError"?new v("Request timeout - please try again",408,a):i instanceof v?i:new v("Network error - please check your connection and try again",0,a)}}async function $e(a){const t=M(a);console.log("Coma ICH API Payload:",t);try{const e=await B(k.COMA_ICH,t);return console.log("Coma ICH API Response:",e),{probability:$(e.probability||e.ich_probability,0),drivers:e.drivers||null,confidence:$(e.confidence,.75),module:"Coma"}}catch(e){throw console.error("Coma ICH prediction failed:",e),new v(`Failed to get ICH prediction: ${e.message}`,e.status,k.COMA_ICH)}}async function Ne(a){const t={age_years:a.age_years,systolic_bp:a.systolic_bp,diastolic_bp:a.diastolic_bp,gfap_value:a.gfap_value,vigilanzminderung:a.vigilanzminderung||0},e=M(t);console.log("Limited Data ICH API Payload:",e);try{const s=await B(k.LDM_ICH,e);return console.log("Limited Data ICH API Response:",s),{probability:$(s.probability||s.ich_probability,0),drivers:s.drivers||null,confidence:$(s.confidence,.65),module:"Limited Data"}}catch(s){throw console.error("Limited Data ICH prediction failed:",s),new v(`Failed to get ICH prediction: ${s.message}`,s.status,k.LDM_ICH)}}async function Pe(a){var s,i,n,o,c,l;const t={age_years:a.age_years,systolic_bp:a.systolic_bp,diastolic_bp:a.diastolic_bp,gfap_value:a.gfap_value,fast_ed_score:a.fast_ed_score,headache:a.headache||0,vigilanzminderung:a.vigilanzminderung||0,armparese:a.armparese||0,beinparese:a.beinparese||0,eye_deviation:a.eye_deviation||0,atrial_fibrillation:a.atrial_fibrillation||0,anticoagulated_noak:a.anticoagulated_noak||0,antiplatelets:a.antiplatelets||0},e=M(t);console.log("=== BACKEND DATA MAPPING TEST ==="),console.log("📤 Full Stroke API Payload:",e),console.log("🧪 Clinical Variables Being Sent:"),console.log("  📊 FAST-ED Score:",e.fast_ed_score),console.log("  🩸 Systolic BP:",e.systolic_bp),console.log("  🩸 Diastolic BP:",e.diastolic_bp),console.log("  🧬 GFAP Value:",e.gfap_value),console.log("  👤 Age:",e.age_years),console.log("  🤕 Headache:",e.headache),console.log("  😵 Vigilanz:",e.vigilanzminderung),console.log("  💪 Arm Parese:",e.armparese),console.log("  🦵 Leg Parese:",e.beinparese),console.log("  👁️ Eye Deviation:",e.eye_deviation),console.log("  💓 Atrial Fib:",e.atrial_fibrillation),console.log("  💊 Anticoag NOAK:",e.anticoagulated_noak),console.log("  💊 Antiplatelets:",e.antiplatelets);try{const d=await B(k.FULL_STROKE,e);console.log("📥 Full Stroke API Response:",d),console.log("🔑 Available keys in response:",Object.keys(d)),console.log("=== BACKEND MAPPING VERIFICATION ===");const g=JSON.stringify(d).toLowerCase();console.log("🔍 Backend Feature Name Analysis:"),console.log('  Contains "fast":',g.includes("fast")),console.log('  Contains "ed":',g.includes("ed")),console.log('  Contains "fast_ed":',g.includes("fast_ed")),console.log('  Contains "systolic":',g.includes("systolic")),console.log('  Contains "diastolic":',g.includes("diastolic")),console.log('  Contains "gfap":',g.includes("gfap")),console.log('  Contains "age":',g.includes("age")),console.log('  Contains "headache":',g.includes("headache")),console.log("🧠 ICH driver sources:"),console.log("  response.ich_prediction?.drivers:",(s=d.ich_prediction)==null?void 0:s.drivers),console.log("  response.ich_drivers:",d.ich_drivers),console.log("  response.ich?.drivers:",(i=d.ich)==null?void 0:i.drivers),console.log("  response.drivers?.ich:",(n=d.drivers)==null?void 0:n.ich),console.log("🩸 LVO driver sources:"),console.log("  response.lvo_prediction?.drivers:",(o=d.lvo_prediction)==null?void 0:o.drivers),console.log("  response.lvo_drivers:",d.lvo_drivers),console.log("  response.lvo?.drivers:",(c=d.lvo)==null?void 0:c.drivers),console.log("  response.drivers?.lvo:",(l=d.drivers)==null?void 0:l.lvo),Object.keys(d).forEach(D=>{const E=d[D];typeof E=="number"&&E>=0&&E<=1&&console.log(`Potential probability field: ${D} = ${E}`)});const p=V(d,"ICH"),y=V(d,"LVO"),f=U(d,"ICH"),u=U(d,"LVO"),h=W(d,"ICH"),ee=W(d,"LVO");return console.log("✅ Clean extraction results:"),console.log("  ICH:",{probability:p,hasDrivers:!!f}),console.log("  LVO:",{probability:y,hasDrivers:!!u}),{ich:{probability:p,drivers:f,confidence:h,module:"Full Stroke"},lvo:{probability:y,drivers:u,confidence:ee,module:"Full Stroke"}}}catch(d){throw console.error("Full Stroke prediction failed:",d),new v(`Failed to get stroke predictions: ${d.message}`,d.status,k.FULL_STROKE)}}function Re(a){m.logEvent("triage1_answer",{comatose:a}),I(a?"coma":"triage2")}function Me(a){m.logEvent("triage2_answer",{examinable:a}),I(a?"full":"limited")}function I(a){m.logEvent("navigate",{from:m.getState().currentScreen,to:a}),m.navigate(a),window.scrollTo(0,0)}function Be(){m.hasUnsavedData()&&!confirm("Are you sure you want to start over? All entered data will be lost.")||(m.logEvent("reset"),m.reset())}function Ie(){console.log("goBack() called");const a=m.goBack();console.log("goBack() success:",a),a?(m.logEvent("navigate_back"),window.scrollTo(0,0)):(console.log("No history available, going home instead"),X())}function X(){console.log("goHome() called"),m.logEvent("navigate_home"),m.goHome(),window.scrollTo(0,0)}async function De(a,t){a.preventDefault();const e=a.target,s=e.dataset.module,i=Te(e);if(!i.isValid){we(t,i.validationErrors);return}const n={};Array.from(e.elements).forEach(l=>{if(l.name)if(l.type==="checkbox")n[l.name]=l.checked;else if(l.type==="number"){const d=parseFloat(l.value);n[l.name]=isNaN(d)?0:d}else l.type==="hidden"&&l.name==="armparese"?n[l.name]=l.value==="true":n[l.name]=l.value}),console.log("Collected form inputs:",n),m.setFormData(s,n);const o=e.querySelector("button[type=submit]"),c=o?o.innerHTML:"";o&&(o.disabled=!0,o.innerHTML=`<span class="loading-spinner"></span> ${r("analyzing")}`);try{let l;switch(s){case"coma":l={ich:await $e(n),lvo:null};break;case"limited":l={ich:await Ne(n),lvo:{notPossible:!0}};break;case"full":l=await Pe(n);break;default:throw new Error("Unknown module: "+s)}m.setResults(l),m.logEvent("models_complete",{module:s,results:l}),I("results")}catch(l){console.error("Error running models:",l);let d="An error occurred during analysis. Please try again.";l instanceof v&&(d=l.message),_e(t,d),o&&(o.disabled=!1,o.innerHTML=c)}}function _e(a,t){a.querySelectorAll(".critical-alert").forEach(i=>{var n,o;(o=(n=i.querySelector("h4"))==null?void 0:n.textContent)!=null&&o.includes("Error")&&i.remove()});const e=document.createElement("div");e.className="critical-alert",e.innerHTML=`<h4><span class="alert-icon">⚠️</span> Error</h4><p>${t}</p>`;const s=a.querySelector(".container");s?s.prepend(e):a.prepend(e),setTimeout(()=>e.remove(),1e4)}function Fe(a){const t=document.createElement("div");t.className="sr-only",t.setAttribute("role","status"),t.setAttribute("aria-live","polite");const e={triage1:"Coma assessment",triage2:"Examination capability assessment",coma:"Coma module",limited:"Limited data module",full:"Full stroke assessment",results:"Assessment results"};t.textContent=`Navigated to ${e[a]||a}`,document.body.appendChild(t),setTimeout(()=>t.remove(),1e3)}function He(a){const t={triage1:"Initial Assessment - Stroke Triage Assistant",triage2:"Examination Capability - Stroke Triage Assistant",coma:"Coma Module - Stroke Triage Assistant",limited:"Limited Data Module - Stroke Triage Assistant",full:"Full Stroke Module - Stroke Triage Assistant",results:"Assessment Results - Stroke Triage Assistant"};document.title=t[a]||"Stroke Triage Assistant"}function xe(){setTimeout(()=>{const a=document.querySelector("h2");a&&(a.setAttribute("tabindex","-1"),a.focus(),setTimeout(()=>a.removeAttribute("tabindex"),100))},100)}class Oe{constructor(){this.scores={facial_palsy:0,arm_weakness:0,speech_changes:0,eye_deviation:0,denial_neglect:0},this.onApply=null,this.modal=null}getTotal(){return Object.values(this.scores).reduce((t,e)=>t+e,0)}getRiskLevel(){return this.getTotal()>=4?"high":"low"}render(){const t=this.getTotal(),e=this.getRiskLevel();return`
      <div id="fastEdModal" class="modal" role="dialog" aria-labelledby="fastEdModalTitle" aria-hidden="true" style="display: none !important;">
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
    `}setupEventListeners(){if(this.modal=document.getElementById("fastEdModal"),!this.modal)return;this.modal.addEventListener("change",i=>{if(i.target.type==="radio"){const n=i.target.name,o=parseInt(i.target.value);this.scores[n]=o,this.updateDisplay()}});const t=this.modal.querySelector(".modal-close");t==null||t.addEventListener("click",()=>this.close());const e=this.modal.querySelector('[data-action="cancel-fast-ed"]');e==null||e.addEventListener("click",()=>this.close());const s=this.modal.querySelector('[data-action="apply-fast-ed"]');s==null||s.addEventListener("click",()=>this.apply()),this.modal.addEventListener("click",i=>{i.target===this.modal&&this.close()}),document.addEventListener("keydown",i=>{var n;i.key==="Escape"&&((n=this.modal)!=null&&n.classList.contains("show"))&&this.close()})}updateDisplay(){var s,i;const t=(s=this.modal)==null?void 0:s.querySelector(".total-score"),e=(i=this.modal)==null?void 0:i.querySelector(".risk-indicator");if(t&&(t.textContent=`${this.getTotal()}/9`),e){const n=this.getRiskLevel();e.className=`risk-indicator ${n}`,e.textContent=`${r("riskLevel")}: ${r(n==="high"?"riskLevelHigh":"riskLevelLow")}`}}show(t=0,e=null){this.onApply=e,t>0&&t<=9&&this.approximateFromTotal(t),document.getElementById("fastEdModal")?(this.modal.remove(),document.body.insertAdjacentHTML("beforeend",this.render()),this.modal=document.getElementById("fastEdModal")):document.body.insertAdjacentHTML("beforeend",this.render()),this.setupEventListeners(),this.modal.setAttribute("aria-hidden","false"),this.modal.style.display="flex",this.modal.classList.add("show");const s=this.modal.querySelector('input[type="radio"]');s==null||s.focus()}close(){this.modal&&(this.modal.classList.remove("show"),this.modal.style.display="none",this.modal.setAttribute("aria-hidden","true"))}apply(){const t=this.getTotal(),e=this.scores.arm_weakness>0,s=this.scores.eye_deviation>0;this.onApply&&this.onApply({total:t,components:{...this.scores},armWeaknessBoolean:e,eyeDeviationBoolean:s}),this.close()}approximateFromTotal(t){this.scores={facial_palsy:0,arm_weakness:0,speech_changes:0,eye_deviation:0,denial_neglect:0};let e=t;const s=Object.keys(this.scores);for(const i of s){if(e<=0)break;const o=Math.min(e,i==="facial_palsy"?1:2);this.scores[i]=o,e-=o}}}const ze=new Oe;function L(a){const t=m.getState(),{currentScreen:e,results:s,startTime:i,navigationHistory:n}=t;a.innerHTML="";const o=document.getElementById("backButton");o&&(o.style.display=n&&n.length>0?"flex":"none");let c="";switch(e){case"triage1":c=F();break;case"triage2":c=se();break;case"coma":c=ne();break;case"limited":c=re();break;case"full":c=oe();break;case"results":c=ve(s);break;default:c=F()}a.innerHTML=c;const l=a.querySelector("form[data-module]");if(l){const d=l.dataset.module;Ke(l,d)}Ue(a),e==="results"&&s&&setTimeout(()=>{pe(s)},100),Fe(e),He(e),xe()}function Ke(a,t){const e=m.getFormData(t);!e||Object.keys(e).length===0||Object.entries(e).forEach(([s,i])=>{const n=a.elements[s];n&&(n.type==="checkbox"?n.checked=i===!0||i==="on"||i==="true":n.value=i)})}function Ue(a){a.querySelectorAll('input[type="number"]').forEach(i=>{i.addEventListener("blur",()=>{Ee(a)})}),a.querySelectorAll("[data-action]").forEach(i=>{i.addEventListener("click",n=>{const{action:o,value:c}=n.currentTarget.dataset,l=c==="true";switch(o){case"triage1":Re(l);break;case"triage2":Me(l);break;case"reset":Be();break;case"goBack":Ie();break;case"goHome":X();break}})}),a.querySelectorAll("form[data-module]").forEach(i=>{i.addEventListener("submit",n=>{De(n,a)})});const t=a.querySelector("#printResults");t&&t.addEventListener("click",()=>window.print());const e=a.querySelector("#fast_ed_score");e&&(e.addEventListener("click",i=>{i.preventDefault();const n=parseInt(e.value)||0;ze.show(n,o=>{e.value=o.total;const c=a.querySelector("#armparese_hidden");c&&(c.value=o.armWeaknessBoolean?"true":"false");const l=a.querySelector("#eye_deviation_hidden");l&&(l.value=o.eyeDeviationBoolean?"true":"false"),e.dispatchEvent(new Event("change",{bubbles:!0}))})}),e.addEventListener("keydown",i=>{i.preventDefault()})),a.querySelectorAll(".info-toggle").forEach(i=>{i.addEventListener("click",n=>{const o=i.dataset.target,c=a.querySelector(`#${o}`),l=i.querySelector(".toggle-arrow");c&&(c.style.display!=="none"?(c.style.display="none",c.classList.remove("show"),i.classList.remove("active"),l.style.transform="rotate(0deg)"):(c.style.display="block",c.classList.add("show"),i.classList.add("active"),l.style.transform="rotate(180deg)"))})})}class Ve{constructor(){this.container=null,this.unsubscribe=null}async init(){if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",()=>this.init());return}if(this.container=document.getElementById("appContainer"),!this.container){console.error("App container not found");return}this.unsubscribe=m.subscribe(()=>{L(this.container)}),window.addEventListener("languageChanged",()=>{this.updateUILanguage(),L(this.container)}),this.setupGlobalEventListeners(),this.initializeTheme(),this.updateUILanguage(),this.startAutoSave(),this.setupSessionTimeout(),this.setCurrentYear(),this.registerServiceWorker(),Ce(),L(this.container),console.log("iGFAP Stroke Triage Assistant initialized")}setupGlobalEventListeners(){const t=document.getElementById("backButton");t&&t.addEventListener("click",()=>{m.goBack(),L(this.container)});const e=document.getElementById("homeButton");e&&e.addEventListener("click",()=>{m.goHome(),L(this.container)});const s=document.getElementById("languageToggle");s&&s.addEventListener("click",()=>this.toggleLanguage());const i=document.getElementById("darkModeToggle");i&&i.addEventListener("click",()=>this.toggleDarkMode()),this.setupHelpModal(),this.setupFooterLinks(),document.addEventListener("keydown",n=>{if(n.key==="Escape"){const o=document.getElementById("helpModal");o&&o.classList.contains("show")&&(o.classList.remove("show"),o.style.display="none",o.setAttribute("aria-hidden","true"))}}),window.addEventListener("beforeunload",n=>{m.hasUnsavedData()&&(n.preventDefault(),n.returnValue="You have unsaved data. Are you sure you want to leave?")})}setupHelpModal(){const t=document.getElementById("helpButton"),e=document.getElementById("helpModal"),s=e==null?void 0:e.querySelector(".modal-close");if(t&&e){e.classList.remove("show"),e.style.display="none",e.setAttribute("aria-hidden","true"),t.addEventListener("click",()=>{e.style.display="flex",e.classList.add("show"),e.setAttribute("aria-hidden","false")});const i=()=>{e.classList.remove("show"),e.style.display="none",e.setAttribute("aria-hidden","true")};s==null||s.addEventListener("click",i),e.addEventListener("click",n=>{n.target===e&&i()})}}setupFooterLinks(){var t,e;(t=document.getElementById("privacyLink"))==null||t.addEventListener("click",s=>{s.preventDefault(),this.showPrivacyPolicy()}),(e=document.getElementById("disclaimerLink"))==null||e.addEventListener("click",s=>{s.preventDefault(),this.showDisclaimer()})}initializeTheme(){const t=localStorage.getItem("theme"),e=document.getElementById("darkModeToggle");(t==="dark"||!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)&&(document.body.classList.add("dark-mode"),e&&(e.textContent="☀️"))}toggleLanguage(){T.toggleLanguage(),this.updateUILanguage();const t=document.getElementById("languageToggle");if(t){const e=T.getCurrentLanguage();t.textContent=e==="en"?"🇬🇧":"🇩🇪",t.dataset.lang=e}}updateUILanguage(){document.documentElement.lang=T.getCurrentLanguage();const t=document.querySelector(".app-header h1");t&&(t.textContent=r("appTitle"));const e=document.querySelector(".emergency-badge");e&&(e.textContent=r("emergencyBadge"));const s=document.getElementById("languageToggle");s&&(s.title=r("languageToggle"),s.setAttribute("aria-label",r("languageToggle")));const i=document.getElementById("helpButton");i&&(i.title=r("helpButton"),i.setAttribute("aria-label",r("helpButton")));const n=document.getElementById("darkModeToggle");n&&(n.title=r("darkModeButton"),n.setAttribute("aria-label",r("darkModeButton")));const o=document.getElementById("modalTitle");o&&(o.textContent=r("helpTitle"))}toggleDarkMode(){const t=document.getElementById("darkModeToggle");document.body.classList.toggle("dark-mode");const e=document.body.classList.contains("dark-mode");t&&(t.textContent=e?"☀️":"🌙"),localStorage.setItem("theme",e?"dark":"light")}startAutoSave(){setInterval(()=>{this.saveCurrentFormData()},P.autoSaveInterval)}saveCurrentFormData(){this.container.querySelectorAll("form[data-module]").forEach(e=>{const s=new FormData(e),i=e.dataset.module;if(i){const n={};s.forEach((l,d)=>{const g=e.elements[d];g&&g.type==="checkbox"?n[d]=g.checked:n[d]=l});const o=m.getFormData(i);JSON.stringify(o)!==JSON.stringify(n)&&m.setFormData(i,n)}})}setupSessionTimeout(){setTimeout(()=>{confirm("Your session has been idle for 30 minutes. Would you like to continue?")?this.setupSessionTimeout():m.reset()},P.sessionTimeout)}setCurrentYear(){const t=document.getElementById("currentYear");t&&(t.textContent=new Date().getFullYear())}showPrivacyPolicy(){alert("Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.")}showDisclaimer(){alert("Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.")}async registerServiceWorker(){if(!("serviceWorker"in navigator)){console.log("Service Workers not supported");return}try{const t=await navigator.serviceWorker.register("/0825/sw.js",{scope:"/0825/"});console.log("Service Worker registered successfully:",t),t.addEventListener("updatefound",()=>{const e=t.installing;console.log("New service worker found"),e.addEventListener("statechange",()=>{e.state==="installed"&&navigator.serviceWorker.controller&&(console.log("New service worker installed, update available"),this.showUpdateNotification())})}),navigator.serviceWorker.addEventListener("message",e=>{console.log("Message from service worker:",e.data)})}catch(t){console.error("Service Worker registration failed:",t)}}showUpdateNotification(){const t=document.createElement("div");t.className="modal show update-modal",t.style.cssText=`
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
    `,t.appendChild(e),document.body.appendChild(t);const s=t.querySelector("#updateNow"),i=t.querySelector("#updateLater");s.addEventListener("click",()=>{window.location.reload()}),i.addEventListener("click",()=>{t.remove(),setTimeout(()=>this.showUpdateNotification(),5*60*1e3)}),t.addEventListener("click",n=>{n.target===t&&i.click()})}destroy(){this.unsubscribe&&this.unsubscribe()}}const We=new Ve;We.init();
//# sourceMappingURL=index-CbQZXTl9.js.map
