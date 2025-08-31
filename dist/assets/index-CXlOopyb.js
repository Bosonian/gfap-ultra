var pe=Object.defineProperty;var he=(a,e,t)=>e in a?pe(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t;var N=(a,e,t)=>he(a,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function t(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(n){if(n.ep)return;n.ep=!0;const i=t(n);fetch(n.href,i)}})();class be{constructor(){this.state={currentScreen:"triage1",results:null,sessionId:null,startTime:null,formData:{},validationErrors:{},screenHistory:[]},this.listeners=new Set,this.initialize()}initialize(){this.state.sessionId=this.generateSessionId(),this.state.startTime=Date.now(),console.log("Store initialized with session:",this.state.sessionId)}generateSessionId(){return"session_"+Date.now()+"_"+Math.random().toString(36).substr(2,9)}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}notify(){this.listeners.forEach(e=>e(this.state))}getState(){return{...this.state}}setState(e){this.state={...this.state,...e},this.notify()}navigate(e){console.log(`Navigating from ${this.state.currentScreen} to ${e}`);const t=[...this.state.screenHistory];this.state.currentScreen!==e&&!t.includes(this.state.currentScreen)&&t.push(this.state.currentScreen),this.setState({currentScreen:e,screenHistory:t})}goBack(){const e=[...this.state.screenHistory];if(console.log("goBack() - current history:",e),console.log("goBack() - current screen:",this.state.currentScreen),e.length>0){const t=e.pop();return console.log("goBack() - navigating to:",t),this.setState({currentScreen:t,screenHistory:e}),!0}return console.log("goBack() - no history available"),!1}goHome(){this.setState({currentScreen:"triage1",screenHistory:[]})}setFormData(e,t){const s={...this.state.formData};s[e]={...t},this.setState({formData:s})}getFormData(e){return this.state.formData[e]||{}}setValidationErrors(e){this.setState({validationErrors:e})}clearValidationErrors(){this.setState({validationErrors:{}})}setResults(e){this.setState({results:e})}hasUnsavedData(){return Object.keys(this.state.formData).length>0&&!this.state.results}reset(){const e={currentScreen:"triage1",results:null,sessionId:this.generateSessionId(),startTime:Date.now(),formData:{},validationErrors:{},screenHistory:[]};this.setState(e),console.log("Store reset with new session:",e.sessionId)}logEvent(e,t={}){const s={timestamp:Date.now(),session:this.state.sessionId,event:e,data:t};console.log("Event:",s)}getSessionDuration(){return Date.now()-this.state.startTime}}const m=new be;function L(a){const e=[{id:1,label:"Triage"},{id:2,label:"Assessment"},{id:3,label:"Results"}];let t='<div class="progress-indicator">';return e.forEach((s,n)=>{const i=s.id===a,o=s.id<a;t+=`
      <div class="progress-step ${i?"active":""} ${o?"completed":""}">
        ${o?"":s.id}
      </div>
    `,n<e.length-1&&(t+=`<div class="progress-line ${o?"completed":""}"></div>`)}),t+="</div>",t}const W={en:{appTitle:"iGFAP",emergencyBadge:"Emergency Tool",helpButton:"Help and Instructions",darkModeButton:"Toggle dark mode",languageToggle:"Language",step1:"Initial Assessment",step2:"Data Collection",step3:"Results",comaModuleTitle:"Coma Module",limitedDataModuleTitle:"Limited Data Module",fullStrokeModuleTitle:"Full Stroke Module",triage1Title:"Patient Assessment",triage1Question:"Is the patient comatose?",triage1Help:"Glasgow Coma Scale < 8",triage1Yes:"YES - Comatose",triage1No:"NO - Conscious",triage2Title:"Examination Capability",triage2Question:"Can the patient be reliably examined?",triage2Help:"Patient is not aphasic, confused, or uncooperative",triage2Yes:"YES - Full Exam Possible",triage2No:"NO - Limited Exam Only",ageLabel:"Age (years)",ageHelp:"Patient age in years",systolicLabel:"Systolic BP (mmHg)",systolicHelp:"Systolic blood pressure",diastolicLabel:"Diastolic BP (mmHg)",diastolicHelp:"Diastolic blood pressure",gfapLabel:"GFAP Value (pg/mL)",gfapHelp:"GFAP biomarker level",fastEdLabel:"FAST-ED Score",fastEdHelp:"FAST-ED assessment score (0-9)",headacheLabel:"Headache",vigilanzLabel:"Reduced consciousness",armPareseLabel:"Arm weakness",beinPareseLabel:"Leg weakness",eyeDeviationLabel:"Eye deviation",atrialFibLabel:"Atrial fibrillation",anticoagLabel:"Anticoagulated (NOAK)",antiplateletsLabel:"Antiplatelets",analyzeButton:"Analyze",analyzing:"Analyzing...",printResults:"Print Results",newAssessment:"Start New Assessment",startOver:"Start Over",goBack:"Go Back",goHome:"Go Home",basicInformation:"Basic Information",biomarkersScores:"Biomarkers & Scores",clinicalSymptoms:"Clinical Symptoms",medicalHistory:"Medical History",ageYearsLabel:"Age (years)",systolicBpLabel:"Systolic BP (mmHg)",diastolicBpLabel:"Diastolic BP (mmHg)",gfapValueLabel:"GFAP Value (pg/mL)",fastEdScoreLabel:"FAST-ED Score",ageYearsHelp:"Patient's age in years",systolicBpHelp:"Normal: 90-140 mmHg",diastolicBpHelp:"Normal: 60-90 mmHg",gfapTooltip:"Brain injury biomarker",gfapTooltipLong:"Glial Fibrillary Acidic Protein - Brain injury biomarker",gfapRange:"Range: {min} - {max} pg/mL",fastEdTooltip:"0-9 scale for LVO screening",analyzeIchRisk:"Analyze ICH Risk",analyzeStrokeRisk:"Analyze Stroke Risk",criticalPatient:"Critical Patient",comaAlert:"Patient is comatose (GCS < 8). Rapid assessment required.",vigilanceReduction:"Vigilance Reduction (Decreased alertness)",armParesis:"Arm Paresis",legParesis:"Leg Paresis",eyeDeviation:"Eye Deviation",atrialFibrillation:"Atrial Fibrillation",onNoacDoac:"On NOAC/DOAC",onAntiplatelets:"On Antiplatelets",resultsTitle:"Assessment Results",bleedingRiskAssessment:"Bleeding Risk Assessment",ichProbability:"ICH Probability",lvoProbability:"LVO Probability",lvoMayBePossible:"Large vessel occlusion possible - further evaluation recommended",riskFactorsTitle:"Main Risk Factors",increasingRisk:"Increasing Risk",decreasingRisk:"Decreasing Risk",noFactors:"No factors",riskLevel:"Risk Level",lowRisk:"Low Risk",mediumRisk:"Medium Risk",highRisk:"High Risk",riskLow:"Low",riskMedium:"Medium",riskHigh:"High",riskFactorsAnalysis:"Risk Factors",contributingFactors:"Contributing factors to the assessment",riskFactors:"Risk Factors",increaseRisk:"INCREASE",decreaseRisk:"DECREASE",noPositiveFactors:"No increasing factors",noNegativeFactors:"No decreasing factors",ichRiskFactors:"ICH Risk Factors",lvoRiskFactors:"LVO Risk Factors",criticalAlertTitle:"CRITICAL RISK DETECTED",criticalAlertMessage:"High probability of intracerebral hemorrhage detected.",immediateActionsRequired:"Immediate actions required",initiateStrokeProtocol:"Initiate stroke protocol immediately",urgentCtImaging:"Urgent CT imaging required",considerBpManagement:"Consider blood pressure management",prepareNeurosurgicalConsult:"Prepare for potential neurosurgical consultation",helpTitle:"Quick Reference Guide",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 8: Comatose patient - use Coma Module",gcsMod:"GCS 8-12: Moderate impairment",gcsHigh:"GCS 13-15: Mild impairment",fastEdTitle:"FAST-ED Score Components",fastEdFacial:"Facial Palsy: 0-1 points",fastEdArm:"Arm Weakness: 0-2 points",fastEdSpeech:"Speech Changes: 0-2 points",fastEdTime:"Time: Critical factor",fastEdEye:"Eye Deviation: 0-2 points",fastEdDenial:"Denial/Neglect: 0-2 points",criticalValuesTitle:"Critical Values",criticalBp:"Systolic BP > 180: Increased ICH risk",criticalGfap:"GFAP > 500 pg/mL: Significant marker",criticalFastEd:"FAST-ED ≥ 4: Consider LVO",fastEdCalculatorTitle:"FAST-ED Score Calculator",fastEdCalculatorSubtitle:"Click to calculate FAST-ED score components",facialPalsyTitle:"Facial Palsy",facialPalsyNormal:"Normal (0)",facialPalsyMild:"Mild drooping (1)",armWeaknessTitle:"Arm Weakness",armWeaknessNormal:"Normal (0)",armWeaknessMild:"Mild drift (1)",armWeaknessSevere:"Falls immediately (2)",speechChangesTitle:"Speech Changes",speechChangesNormal:"Normal (0)",speechChangesMild:"Slurred speech (1)",speechChangesSevere:"Severe aphasia (2)",eyeDeviationTitle:"Eye Deviation",eyeDeviationNormal:"Normal (0)",eyeDeviationPartial:"Partial gaze palsy (1)",eyeDeviationForced:"Forced deviation (2)",denialNeglectTitle:"Denial/Neglect",denialNeglectNormal:"Normal (0)",denialNeglectPartial:"Partial neglect (1)",denialNeglectComplete:"Complete neglect (2)",totalScoreTitle:"Total FAST-ED Score",riskLevel:"Risk Level",riskLevelLow:"LOW (Score <4)",riskLevelHigh:"HIGH (Score ≥4 - Consider LVO)",applyScore:"Apply Score",cancel:"Cancel",riskAnalysis:"Risk Analysis",riskAnalysisSubtitle:"Clinical factors in this assessment",contributingFactors:"Contributing factors",factorsShown:"shown",positiveFactors:"Positive factors",negativeFactors:"Negative factors",clinicalInformation:"Clinical Information",clinicalRecommendations:"Clinical Recommendations",clinicalRec1:"Consider immediate imaging if ICH risk is high",clinicalRec2:"Activate stroke team for LVO scores ≥ 50%",clinicalRec3:"Monitor blood pressure closely",clinicalRec4:"Document all findings thoroughly",noDriverData:"No driver data available",driverAnalysisUnavailable:"Driver analysis unavailable",driverInfoNotAvailable:"Driver information not available from this prediction model",driverAnalysisNotAvailable:"Driver analysis not available for this prediction",lvoNotPossible:"LVO assessment not possible with limited data",fullExamRequired:"Full neurological examination required for LVO screening",limitedAssessment:"Limited Assessment",disclaimer:"Clinical Disclaimer",disclaimerText:"This tool is for clinical decision support only. Always use clinical judgment and follow local protocols. Not a replacement for physician assessment.",importantNote:"Important",importantText:"These results are for clinical decision support only. Always use clinical judgment and follow institutional protocols.",predictedMortality:"Predicted 30-day mortality",ichVolumeLabel:"ICH Volume",references:"References",inputSummaryTitle:"Input Summary",inputSummarySubtitle:"Values used for this analysis",privacyLink:"Privacy Policy",disclaimerLink:"Medical Disclaimer",versionLink:"Version 2.1.0 - Research Preview",privacyPolicy:"Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.",medicalDisclaimer:"Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.",networkError:"Network error - please check your connection and try again",requestTimeout:"Request timeout - please try again",apiError:"Failed to get results",validationError:"Please check your input values",sessionTimeout:"Your session has been idle for 30 minutes. Would you like to continue?",unsavedData:"You have unsaved data. Are you sure you want to leave?",nearestCentersTitle:"Nearest Stroke Centers",useCurrentLocation:"Use Current Location",enterLocationPlaceholder:"Enter city or address...",enterManually:"Enter Location Manually",search:"Search",yourLocation:"Your Location",recommendedCenters:"Recommended Centers",alternativeCenters:"Alternative Centers",noCentersFound:"No stroke centers found in this area",gettingLocation:"Getting your location",searchingLocation:"Searching location",locationError:"Unable to get your location",locationPermissionDenied:"Location access denied. Please allow location access and try again.",locationUnavailable:"Location information is unavailable",locationTimeout:"Location request timed out",geolocationNotSupported:"Geolocation is not supported by this browser",geocodingNotImplemented:"Location search not available. Please use GPS or enter coordinates manually.",tryManualEntry:"Try entering your location manually or use GPS.",distanceNote:"Distances are calculated as straight-line distances. Actual travel times may vary.",travelTimeNote:"Travel times calculated for emergency vehicles with sirens and priority routing.",calculatingTravelTimes:"Calculating travel times",minutes:"min",poweredByOrs:"Travel times powered by OpenRoute Service",comprehensiveCenter:"Comprehensive Stroke Center",primaryCenter:"Primary Stroke Center",telemetryCenter:"Telemedicine Center",thrombectomy:"Thrombectomy",neurosurgery:"Neurosurgery",icu:"Intensive Care",telemedicine:"Telemedicine",stroke_unit:"Stroke Unit",call:"Call",directions:"Directions",emergency:"Emergency",certified:"Certified"},de:{appTitle:"iGFAP",emergencyBadge:"Notfall-Tool",helpButton:"Hilfe und Anweisungen",darkModeButton:"Dunklen Modus umschalten",languageToggle:"Sprache",step1:"Erstbeurteilung",step2:"Datenerhebung",step3:"Ergebnisse",comaModuleTitle:"Koma-Modul",limitedDataModuleTitle:"Begrenzte Daten Modul",fullStrokeModuleTitle:"Vollständiges Schlaganfall-Modul",triage1Title:"Patientenbeurteilung",triage1Question:"Ist der Patient komatös?",triage1Help:"Glasgow Coma Scale < 8",triage1Yes:"JA - Komatös",triage1No:"NEIN - Bei Bewusstsein",triage2Title:"Untersuchungsfähigkeit",triage2Question:"Kann der Patient zuverlässig untersucht werden?",triage2Help:"Patient ist nicht aphasisch, verwirrt oder unkooperativ",triage2Yes:"JA - Vollständige Untersuchung möglich",triage2No:"NEIN - Nur begrenzte Untersuchung",ageLabel:"Alter (Jahre)",ageHelp:"Patientenalter in Jahren",systolicLabel:"Systolischer RR (mmHg)",systolicHelp:"Systolischer Blutdruck",diastolicLabel:"Diastolischer RR (mmHg)",diastolicHelp:"Diastolischer Blutdruck",gfapLabel:"GFAP-Wert (pg/mL)",gfapHelp:"GFAP-Biomarker-Wert",fastEdLabel:"FAST-ED-Score",fastEdHelp:"FAST-ED-Bewertungsscore (0-9)",headacheLabel:"Kopfschmerzen",vigilanzLabel:"Bewusstseinstrübung",armPareseLabel:"Armschwäche",beinPareseLabel:"Beinschwäche",eyeDeviationLabel:"Blickdeviation",atrialFibLabel:"Vorhofflimmern",anticoagLabel:"Antikoaguliert (NOAK)",antiplateletsLabel:"Thrombozytenaggregationshemmer",analyzeButton:"Analysieren",analyzing:"Analysiere...",printResults:"Ergebnisse drucken",newAssessment:"Neue Bewertung starten",startOver:"Von vorn beginnen",goBack:"Zurück",goHome:"Zur Startseite",basicInformation:"Grundinformationen",biomarkersScores:"Biomarker & Scores",clinicalSymptoms:"Klinische Symptome",medicalHistory:"Anamnese",ageYearsLabel:"Alter (Jahre)",systolicBpLabel:"Systolischer RR (mmHg)",diastolicBpLabel:"Diastolischer RR (mmHg)",gfapValueLabel:"GFAP-Wert (pg/mL)",fastEdScoreLabel:"FAST-ED-Score",ageYearsHelp:"Patientenalter in Jahren",systolicBpHelp:"Normal: 90-140 mmHg",diastolicBpHelp:"Normal: 60-90 mmHg",gfapTooltip:"Hirnverletzungs-Biomarker",gfapTooltipLong:"Glial Fibrillary Acidic Protein - Hirnverletzungs-Biomarker",gfapRange:"Bereich: {min} - {max} pg/mL",fastEdTooltip:"0-9 Skala für LVO-Screening",analyzeIchRisk:"ICB-Risiko analysieren",analyzeStrokeRisk:"Schlaganfall-Risiko analysieren",criticalPatient:"Kritischer Patient",comaAlert:"Patient ist komatös (GCS < 8). Schnelle Beurteilung erforderlich.",vigilanceReduction:"Vigilanzminderung (Verminderte Wachheit)",armParesis:"Armparese",legParesis:"Beinparese",eyeDeviation:"Blickdeviation",atrialFibrillation:"Vorhofflimmern",onNoacDoac:"NOAK/DOAK-Therapie",onAntiplatelets:"Thrombozytenaggregationshemmer",resultsTitle:"Bewertungsergebnisse",bleedingRiskAssessment:"Blutungsrisiko-Bewertung",ichProbability:"ICB-Wahrscheinlichkeit",lvoProbability:"LVO-Wahrscheinlichkeit",lvoMayBePossible:"Großgefäßverschluss möglich - weitere Abklärung empfohlen",riskFactorsTitle:"Hauptrisikofaktoren",increasingRisk:"Risikoerhöhend",decreasingRisk:"Risikomindernd",noFactors:"Keine Faktoren",riskLevel:"Risikostufe",lowRisk:"Niedriges Risiko",mediumRisk:"Mittleres Risiko",highRisk:"Hohes Risiko",riskLow:"Niedrig",riskMedium:"Mittel",riskHigh:"Hoch",riskFactorsAnalysis:"Risikofaktoren",contributingFactors:"Beitragende Faktoren zur Bewertung",riskFactors:"Risikofaktoren",increaseRisk:"ERHÖHEN",decreaseRisk:"VERRINGERN",noPositiveFactors:"Keine erhöhenden Faktoren",noNegativeFactors:"Keine verringernden Faktoren",ichRiskFactors:"ICB-Risikofaktoren",lvoRiskFactors:"LVO-Risikofaktoren",criticalAlertTitle:"KRITISCHES RISIKO ERKANNT",criticalAlertMessage:"Hohe Wahrscheinlichkeit einer intrazerebralen Blutung erkannt.",immediateActionsRequired:"Sofortige Maßnahmen erforderlich",initiateStrokeProtocol:"Schlaganfall-Protokoll sofort einleiten",urgentCtImaging:"Dringende CT-Bildgebung erforderlich",considerBpManagement:"Blutdruckmanagement erwägen",prepareNeurosurgicalConsult:"Neurochirurgische Konsultation vorbereiten",helpTitle:"Kurzreferenzleitfaden",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 8: Komatöser Patient - Koma-Modul verwenden",gcsMod:"GCS 8-12: Mäßige Beeinträchtigung",gcsHigh:"GCS 13-15: Leichte Beeinträchtigung",fastEdTitle:"FAST-ED-Score-Komponenten",fastEdFacial:"Faziale Parese: 0-1 Punkte",fastEdArm:"Armschwäche: 0-2 Punkte",fastEdSpeech:"Sprachveränderungen: 0-2 Punkte",fastEdTime:"Zeit: Kritischer Faktor",fastEdEye:"Blickdeviation: 0-2 Punkte",fastEdDenial:"Verneinung/Neglect: 0-2 Punkte",criticalValuesTitle:"Kritische Werte",criticalBp:"Systolischer RR > 180: Erhöhtes ICB-Risiko",criticalGfap:"GFAP > 500 pg/mL: Signifikanter Marker",criticalFastEd:"FAST-ED ≥ 4: LVO in Betracht ziehen",fastEdCalculatorTitle:"FAST-ED-Score-Rechner",fastEdCalculatorSubtitle:"Klicken Sie, um FAST-ED-Score-Komponenten zu berechnen",facialPalsyTitle:"Fazialisparese",facialPalsyNormal:"Nein (0)",facialPalsyMild:"Ja (1)",armWeaknessTitle:"Armschwäche",armWeaknessNormal:"Normal (0)",armWeaknessMild:"Leichter Armabfall (1)",armWeaknessSevere:"Arm fällt sofort ab (2)",speechChangesTitle:"Sprachveränderungen",speechChangesNormal:"Normal (0)",speechChangesMild:"Verwaschene Sprache (1)",speechChangesSevere:"Schwere Aphasie (2)",eyeDeviationTitle:"Blickdeviation",eyeDeviationNormal:"Normal (0)",eyeDeviationPartial:"Partielle Blickparese (1)",eyeDeviationForced:"Forcierte Blickdeviation (2)",denialNeglectTitle:"Verneinung/Neglect",denialNeglectNormal:"Normal (0)",denialNeglectPartial:"Partieller Neglect (1)",denialNeglectComplete:"Kompletter Neglect (2)",totalScoreTitle:"Gesamt-FAST-ED-Score",riskLevel:"Risikostufe",riskLevelLow:"NIEDRIG (Score <4)",riskLevelHigh:"HOCH (Score ≥4 - LVO erwägen)",applyScore:"Score Anwenden",cancel:"Abbrechen",riskAnalysis:"Risikoanalyse",riskAnalysisSubtitle:"Klinische Faktoren in dieser Bewertung",contributingFactors:"Beitragende Faktoren",factorsShown:"angezeigt",positiveFactors:"Positive Faktoren",negativeFactors:"Negative Faktoren",clinicalInformation:"Klinische Informationen",clinicalRecommendations:"Klinische Empfehlungen",clinicalRec1:"Sofortige Bildgebung erwägen bei hohem ICB-Risiko",clinicalRec2:"Stroke-Team aktivieren bei LVO-Score ≥ 50%",clinicalRec3:"Blutdruck engmaschig überwachen",clinicalRec4:"Alle Befunde gründlich dokumentieren",noDriverData:"Keine Treiberdaten verfügbar",driverAnalysisUnavailable:"Treiberanalyse nicht verfügbar",driverInfoNotAvailable:"Treiberinformationen von diesem Vorhersagemodell nicht verfügbar",driverAnalysisNotAvailable:"Treiberanalyse für diese Vorhersage nicht verfügbar",lvoNotPossible:"LVO-Bewertung mit begrenzten Daten nicht möglich",fullExamRequired:"Vollständige neurologische Untersuchung für LVO-Screening erforderlich",limitedAssessment:"Begrenzte Bewertung",disclaimer:"Klinischer Haftungsausschluss",disclaimerText:"Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle. Kein Ersatz für ärztliche Beurteilung.",importantNote:"Wichtig",importantText:"Diese Ergebnisse dienen nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie institutionelle Protokolle.",predictedMortality:"Vorhergesagte 30-Tage-Mortalität",ichVolumeLabel:"ICB-Volumen",references:"Referenzen",inputSummaryTitle:"Eingabezusammenfassung",inputSummarySubtitle:"Für diese Analyse verwendete Werte",privacyLink:"Datenschutzrichtlinie",disclaimerLink:"Medizinischer Haftungsausschluss",versionLink:"Version 2.1.0 - Research Preview",privacyPolicy:"Datenschutzrichtlinie: Dieses Tool verarbeitet Daten lokal. Keine Patientendaten werden gespeichert oder übertragen.",medicalDisclaimer:"Medizinischer Haftungsausschluss: Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle.",networkError:"Netzwerkfehler - bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut",requestTimeout:"Anfrage-Timeout - bitte versuchen Sie es erneut",apiError:"Ergebnisse konnten nicht abgerufen werden",validationError:"Bitte überprüfen Sie Ihre Eingabewerte",sessionTimeout:"Ihre Sitzung war 30 Minuten lang inaktiv. Möchten Sie fortfahren?",unsavedData:"Sie haben ungespeicherte Daten. Sind Sie sicher, dass Sie verlassen möchten?",nearestCentersTitle:"Nächstgelegene Schlaganfall-Zentren",useCurrentLocation:"Aktuellen Standort verwenden",enterLocationPlaceholder:"Stadt oder Adresse eingeben...",enterManually:"Standort manuell eingeben",search:"Suchen",yourLocation:"Ihr Standort",recommendedCenters:"Empfohlene Zentren",alternativeCenters:"Alternative Zentren",noCentersFound:"Keine Schlaganfall-Zentren in diesem Bereich gefunden",gettingLocation:"Standort wird ermittelt",searchingLocation:"Standort wird gesucht",locationError:"Standort konnte nicht ermittelt werden",locationPermissionDenied:"Standortzugriff verweigert. Bitte erlauben Sie Standortzugriff und versuchen Sie es erneut.",locationUnavailable:"Standortinformationen sind nicht verfügbar",locationTimeout:"Standortanfrage ist abgelaufen",geolocationNotSupported:"Geolokalisierung wird von diesem Browser nicht unterstützt",geocodingNotImplemented:"Standortsuche nicht verfügbar. Bitte verwenden Sie GPS oder geben Sie Koordinaten manuell ein.",tryManualEntry:"Versuchen Sie, Ihren Standort manuell einzugeben oder GPS zu verwenden.",distanceNote:"Entfernungen werden als Luftlinie berechnet. Tatsächliche Fahrzeiten können variieren.",travelTimeNote:"Fahrzeiten berechnet für Rettungsfahrzeuge mit Sondersignalen und Vorfahrtsberechtigung.",calculatingTravelTimes:"Fahrzeiten werden berechnet",minutes:"Min",poweredByOrs:"Fahrzeiten bereitgestellt von OpenRoute Service",comprehensiveCenter:"Überregionales Schlaganfall-Zentrum",primaryCenter:"Regionales Schlaganfall-Zentrum",telemetryCenter:"Telemedizin-Zentrum",thrombectomy:"Thrombektomie",neurosurgery:"Neurochirurgie",icu:"Intensivstation",telemedicine:"Telemedizin",stroke_unit:"Stroke Unit",call:"Anrufen",directions:"Wegbeschreibung",emergency:"Notfall",certified:"Zertifiziert"}};class fe{constructor(){this.supportedLanguages=["en","de"],this.currentLanguage=this.detectLanguage()}detectLanguage(){const e=localStorage.getItem("language");return e&&this.supportedLanguages.includes(e)?e:(navigator.language||navigator.userLanguage).substring(0,2).toLowerCase()==="de"?"de":"en"}getCurrentLanguage(){return this.currentLanguage}setLanguage(e){return this.supportedLanguages.includes(e)?(this.currentLanguage=e,localStorage.setItem("language",e),window.dispatchEvent(new CustomEvent("languageChanged",{detail:{language:e}})),!0):!1}getSupportedLanguages(){return[...this.supportedLanguages]}t(e){return(W[this.currentLanguage]||W.en)[e]||e}toggleLanguage(){const e=this.currentLanguage==="en"?"de":"en";return this.setLanguage(e)}getLanguageDisplayName(e=null){const t=e||this.currentLanguage;return{en:"English",de:"Deutsch"}[t]||t}formatDateTime(e){const t=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(t,{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(e)}formatTime(e){const t=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(t,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(e)}}const A=new fe,r=a=>A.t(a);function q(){return`
    <div class="container">
      ${L(1)}
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
  `}function ve(){return`
    <div class="container">
      ${L(1)}
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
  `}const k={COMA_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_coma_ich",LDM_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_limited_data_ich",FULL_STROKE:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_full_stroke"},O={ich:{medium:25,high:50},lvo:{medium:25,high:50}},v={min:29,max:10001},V={autoSaveInterval:18e4,sessionTimeout:30*60*1e3,requestTimeout:1e4},ye={age_years:{required:!0,min:0,max:120},systolic_bp:{required:!0,min:60,max:300},diastolic_bp:{required:!0,min:30,max:200},gfap_value:{required:!0,min:v.min,max:v.max},fast_ed_score:{required:!0,min:0,max:9}};function ke(){return`
    <div class="container">
      ${L(2)}
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
            <input type="number" id="gfap_value" name="gfap_value" min="${v.min}" max="${v.max}" step="0.1" required aria-describedby="gfap-help">
            <div id="gfap-help" class="input-help">
              ${r("gfapRange").replace("{min}",v.min).replace("{max}",v.max)}
            </div>
          </div>
        </div>
        <button type="submit" class="primary">${r("analyzeIchRisk")}</button>
        <button type="button" class="secondary" data-action="reset">${r("startOver")}</button>
      </form>
    </div>
  `}function Se(){return`
    <div class="container">
      ${L(2)}
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
            <input type="number" name="gfap_value" id="gfap_value" min="${v.min}" max="${v.max}" step="0.1" required>
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
  `}function Le(){return`
    <div class="container">
      ${L(2)}
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
            <input type="number" name="gfap_value" id="gfap_value" min="${v.min}" max="${v.max}" step="0.1" required>
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
  `}function ae(){return`
    <div class="critical-alert">
      <h4><span class="alert-icon">🚨</span> ${r("criticalAlertTitle")}</h4>
      <p>${r("criticalAlertMessage")}</p>
    </div>
  `}const we={age_years:"ageLabel",age:"ageLabel",systolic_bp:"systolicLabel",diastolic_bp:"diastolicLabel",systolic_blood_pressure:"systolicLabel",diastolic_blood_pressure:"diastolicLabel",blood_pressure_systolic:"systolicLabel",blood_pressure_diastolic:"diastolicLabel",gfap_value:"gfapLabel",gfap:"gfapLabel",gfap_level:"gfapLabel",fast_ed_score:"fastEdLabel",fast_ed:"fastEdLabel",fast_ed_total:"fastEdLabel",vigilanzminderung:"vigilanzLabel",vigilance_reduction:"vigilanzLabel",reduced_consciousness:"vigilanzLabel",armparese:"armPareseLabel",arm_paresis:"armPareseLabel",arm_weakness:"armPareseLabel",beinparese:"beinPareseLabel",leg_paresis:"beinPareseLabel",leg_weakness:"beinPareseLabel",eye_deviation:"eyeDeviationLabel",blickdeviation:"eyeDeviationLabel",headache:"headacheLabel",kopfschmerzen:"headacheLabel",atrial_fibrillation:"atrialFibLabel",vorhofflimmern:"atrialFibLabel",anticoagulated_noak:"anticoagLabel",anticoagulation:"anticoagLabel",antiplatelets:"antiplateletsLabel",thrombozytenaggregationshemmer:"antiplateletsLabel"},Ee=[{pattern:/_score$/,replacement:" Score"},{pattern:/_value$/,replacement:" Level"},{pattern:/_bp$/,replacement:" Blood Pressure"},{pattern:/_years?$/,replacement:" (years)"},{pattern:/^ich_/,replacement:"Brain Bleeding "},{pattern:/^lvo_/,replacement:"Large Vessel "},{pattern:/parese$/,replacement:"Weakness"},{pattern:/deviation$/,replacement:"Movement"}];function se(a){if(!a)return"";const e=we[a.toLowerCase()];if(e){const s=r(e);if(s&&s!==e)return s}let t=a.toLowerCase();return Ee.forEach(({pattern:s,replacement:n})=>{t=t.replace(s,n)}),t=t.replace(/_/g," ").replace(/\b\w/g,s=>s.toUpperCase()).trim(),t}function Te(a){return se(a).replace(/\s*\([^)]*\)\s*/g,"").trim()}function Ae(a,e=""){return a==null||a===""?"":typeof a=="boolean"?a?"✓":"✗":typeof a=="number"?e.includes("bp")||e.includes("blood_pressure")?`${a} mmHg`:e.includes("gfap")?`${a} pg/mL`:e.includes("age")?`${a} years`:e.includes("score")||Number.isInteger(a)?a.toString():a.toFixed(1):a.toString()}const ie={bayern:{neurosurgicalCenters:[{id:"BY-NS-001",name:"LMU Klinikum München - Großhadern",address:"Marchioninistraße 15, 81377 München",coordinates:{lat:48.1106,lng:11.4684},phone:"+49 89 4400-0",emergency:"+49 89 4400-73331",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1440,network:"TEMPiS"},{id:"BY-NS-002",name:"Klinikum rechts der Isar München (TUM)",address:"Ismaninger Str. 22, 81675 München",coordinates:{lat:48.1497,lng:11.6052},phone:"+49 89 4140-0",emergency:"+49 89 4140-2249",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1161,network:"TEMPiS"},{id:"BY-NS-003",name:"Städtisches Klinikum München Schwabing",address:"Kölner Platz 1, 80804 München",coordinates:{lat:48.1732,lng:11.5755},phone:"+49 89 3068-0",emergency:"+49 89 3068-2050",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:648,network:"TEMPiS"},{id:"BY-NS-004",name:"Städtisches Klinikum München Bogenhausen",address:"Englschalkinger Str. 77, 81925 München",coordinates:{lat:48.1614,lng:11.6254},phone:"+49 89 9270-0",emergency:"+49 89 9270-2050",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:689,network:"TEMPiS"},{id:"BY-NS-005",name:"Universitätsklinikum Erlangen",address:"Maximiliansplatz 2, 91054 Erlangen",coordinates:{lat:49.5982,lng:11.0037},phone:"+49 9131 85-0",emergency:"+49 9131 85-39003",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1371,network:"TEMPiS"},{id:"BY-NS-006",name:"Universitätsklinikum Regensburg",address:"Franz-Josef-Strauß-Allee 11, 93053 Regensburg",coordinates:{lat:49.0134,lng:12.0991},phone:"+49 941 944-0",emergency:"+49 941 944-7501",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1042,network:"TEMPiS"},{id:"BY-NS-007",name:"Universitätsklinikum Würzburg",address:"Oberdürrbacher Str. 6, 97080 Würzburg",coordinates:{lat:49.784,lng:9.9721},phone:"+49 931 201-0",emergency:"+49 931 201-24444",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1264,network:"TEMPiS"},{id:"BY-NS-008",name:"Klinikum Nürnberg Nord",address:"Prof.-Ernst-Nathan-Str. 1, 90419 Nürnberg",coordinates:{lat:49.4521,lng:11.0767},phone:"+49 911 398-0",emergency:"+49 911 398-2369",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1368,network:"TEMPiS"},{id:"BY-NS-009",name:"Universitätsklinikum Augsburg",address:"Stenglinstr. 2, 86156 Augsburg",coordinates:{lat:48.3668,lng:10.9093},phone:"+49 821 400-01",emergency:"+49 821 400-2356",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1740,network:"TEMPiS"},{id:"BY-NS-010",name:"Klinikum Aschaffenburg-Alzenau",address:"Am Hasenkopf 1, 63739 Aschaffenburg",coordinates:{lat:49.9737,lng:9.157},phone:"+49 6021 32-0",emergency:"+49 6021 32-2800",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:40,network:"TRANSIT"},{id:"BY-NS-011",name:"Klinikum Landshut",address:"Robert-Koch-Str. 1, 84034 Landshut",coordinates:{lat:48.5665,lng:12.1512},phone:"+49 871 698-0",emergency:"+49 871 698-3333",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:505,network:"TEMPiS"},{id:"BY-NS-012",name:"Klinikum Coburg",address:"Ketschendorfer Str. 33, 96450 Coburg",coordinates:{lat:50.2596,lng:10.9644},phone:"+49 9561 22-0",emergency:"+49 9561 22-6800",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:547,network:"STENO"},{id:"BY-NS-013",name:"Klinikum Passau",address:"Bischof-Pilgrim-Str. 1, 94032 Passau",coordinates:{lat:48.5665,lng:13.4777},phone:"+49 851 5300-0",emergency:"+49 851 5300-2222",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:696,network:"TEMPiS"}],comprehensiveStrokeCenters:[{id:"BY-CS-001",name:"Klinikum Bamberg",address:"Buger Str. 80, 96049 Bamberg",coordinates:{lat:49.8988,lng:10.9027},phone:"+49 951 503-0",emergency:"+49 951 503-11101",thrombectomy:!0,thrombolysis:!0,beds:630,network:"TEMPiS"},{id:"BY-CS-002",name:"Klinikum Bayreuth",address:"Preuschwitzer Str. 101, 95445 Bayreuth",coordinates:{lat:49.9459,lng:11.5779},phone:"+49 921 400-0",emergency:"+49 921 400-5401",thrombectomy:!0,thrombolysis:!0,beds:848,network:"TEMPiS"},{id:"BY-CS-003",name:"Klinikum Coburg",address:"Ketschendorfer Str. 33, 96450 Coburg",coordinates:{lat:50.2596,lng:10.9685},phone:"+49 9561 22-0",emergency:"+49 9561 22-6300",thrombectomy:!0,thrombolysis:!0,beds:522,network:"TEMPiS"}],regionalStrokeUnits:[{id:"BY-RSU-001",name:"Goldberg-Klinik Kelheim",address:"Traubenweg 3, 93309 Kelheim",coordinates:{lat:48.9166,lng:11.8742},phone:"+49 9441 702-0",emergency:"+49 9441 702-6800",thrombolysis:!0,beds:200,network:"TEMPiS"},{id:"BY-RSU-002",name:"DONAUISAR Klinikum Deggendorf",address:"Perlasberger Str. 41, 94469 Deggendorf",coordinates:{lat:48.8372,lng:12.9619},phone:"+49 991 380-0",emergency:"+49 991 380-2201",thrombolysis:!0,beds:450,network:"TEMPiS"},{id:"BY-RSU-003",name:"Klinikum St. Elisabeth Straubing",address:"St.-Elisabeth-Str. 23, 94315 Straubing",coordinates:{lat:48.8742,lng:12.5733},phone:"+49 9421 710-0",emergency:"+49 9421 710-2000",thrombolysis:!0,beds:580,network:"TEMPiS"},{id:"BY-RSU-004",name:"Klinikum Freising",address:"Mainburger Str. 29, 85356 Freising",coordinates:{lat:48.4142,lng:11.7461},phone:"+49 8161 24-0",emergency:"+49 8161 24-2800",thrombolysis:!0,beds:380,network:"TEMPiS"},{id:"BY-RSU-005",name:"Klinikum Landkreis Erding",address:"Bajuwarenstr. 5, 85435 Erding",coordinates:{lat:48.3061,lng:11.9067},phone:"+49 8122 59-0",emergency:"+49 8122 59-2201",thrombolysis:!0,beds:350,network:"TEMPiS"},{id:"BY-RSU-006",name:"Helios Amper-Klinikum Dachau",address:"Krankenhausstr. 15, 85221 Dachau",coordinates:{lat:48.2599,lng:11.4342},phone:"+49 8131 76-0",emergency:"+49 8131 76-2201",thrombolysis:!0,beds:480,network:"TEMPiS"},{id:"BY-RSU-007",name:"Klinikum Fürstenfeldbruck",address:"Dachauer Str. 33, 82256 Fürstenfeldbruck",coordinates:{lat:48.1772,lng:11.2578},phone:"+49 8141 99-0",emergency:"+49 8141 99-2201",thrombolysis:!0,beds:420,network:"TEMPiS"},{id:"BY-RSU-008",name:"Klinikum Ingolstadt",address:"Krumenauerstraße 25, 85049 Ingolstadt",coordinates:{lat:48.7665,lng:11.4364},phone:"+49 841 880-0",emergency:"+49 841 880-2201",thrombolysis:!0,beds:665,network:"TEMPiS"},{id:"BY-RSU-009",name:"Klinikum Passau",address:"Bischof-Pilgrim-Str. 1, 94032 Passau",coordinates:{lat:48.5665,lng:13.4513},phone:"+49 851 5300-0",emergency:"+49 851 5300-2100",thrombolysis:!0,beds:540,network:"TEMPiS"},{id:"BY-RSU-010",name:"Klinikum Landshut",address:"Robert-Koch-Str. 1, 84034 Landshut",coordinates:{lat:48.5436,lng:12.1619},phone:"+49 871 698-0",emergency:"+49 871 698-3333",thrombolysis:!0,beds:790,network:"TEMPiS"},{id:"BY-RSU-011",name:"RoMed Klinikum Rosenheim",address:"Pettenkoferstr. 10, 83022 Rosenheim",coordinates:{lat:47.8567,lng:12.1265},phone:"+49 8031 365-0",emergency:"+49 8031 365-3711",thrombolysis:!0,beds:870,network:"TEMPiS"},{id:"BY-RSU-012",name:"Klinikum Memmingen",address:"Bismarckstr. 23, 87700 Memmingen",coordinates:{lat:47.9833,lng:10.1833},phone:"+49 8331 70-0",emergency:"+49 8331 70-2500",thrombolysis:!0,beds:520,network:"TEMPiS"},{id:"BY-RSU-013",name:"Klinikum Kempten-Oberallgäu",address:"Robert-Weixler-Str. 50, 87439 Kempten",coordinates:{lat:47.7261,lng:10.3097},phone:"+49 831 530-0",emergency:"+49 831 530-2201",thrombolysis:!0,beds:650,network:"TEMPiS"},{id:"BY-RSU-014",name:"Klinikum Aschaffenburg-Alzenau",address:"Am Hasenkopf 1, 63739 Aschaffenburg",coordinates:{lat:49.9747,lng:9.1581},phone:"+49 6021 32-0",emergency:"+49 6021 32-2700",thrombolysis:!0,beds:590,network:"TEMPiS"}],thrombolysisHospitals:[{id:"BY-TH-001",name:"Krankenhaus Vilsbiburg",address:"Sonnenstraße 10, 84137 Vilsbiburg",coordinates:{lat:48.6333,lng:12.2833},phone:"+49 8741 60-0",thrombolysis:!0,beds:180},{id:"BY-TH-002",name:"Krankenhaus Eggenfelden",address:"Pfarrkirchener Str. 5, 84307 Eggenfelden",coordinates:{lat:48.4,lng:12.7667},phone:"+49 8721 98-0",thrombolysis:!0,beds:220}]},badenWuerttemberg:{neurosurgicalCenters:[{id:"BW-NS-001",name:"Universitätsklinikum Freiburg",address:"Hugstetter Str. 55, 79106 Freiburg",coordinates:{lat:48.0025,lng:7.8347},phone:"+49 761 270-0",emergency:"+49 761 270-34010",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1600,network:"FAST"},{id:"BW-NS-002",name:"Universitätsklinikum Heidelberg",address:"Im Neuenheimer Feld 400, 69120 Heidelberg",coordinates:{lat:49.4178,lng:8.6706},phone:"+49 6221 56-0",emergency:"+49 6221 56-36643",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1621,network:"FAST"},{id:"BW-NS-003",name:"Universitätsklinikum Tübingen",address:"Geissweg 3, 72076 Tübingen",coordinates:{lat:48.5378,lng:9.0538},phone:"+49 7071 29-0",emergency:"+49 7071 29-82211",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1550,network:"FAST"},{id:"BW-NS-004",name:"Universitätsklinikum Ulm",address:"Albert-Einstein-Allee 23, 89081 Ulm",coordinates:{lat:48.4196,lng:9.9592},phone:"+49 731 500-0",emergency:"+49 731 500-63001",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1264,network:"FAST"},{id:"BW-NS-005",name:"Klinikum Stuttgart - Katharinenhospital",address:"Kriegsbergstraße 60, 70174 Stuttgart",coordinates:{lat:48.7784,lng:9.1682},phone:"+49 711 278-0",emergency:"+49 711 278-32001",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:950,network:"FAST"},{id:"BW-NS-006",name:"Städtisches Klinikum Karlsruhe",address:"Moltkestraße 90, 76133 Karlsruhe",coordinates:{lat:49.0047,lng:8.3858},phone:"+49 721 974-0",emergency:"+49 721 974-2301",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1570,network:"FAST"},{id:"BW-NS-007",name:"Klinikum Ludwigsburg",address:"Posilipostraße 4, 71640 Ludwigsburg",coordinates:{lat:48.8901,lng:9.1953},phone:"+49 7141 99-0",emergency:"+49 7141 99-67201",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:720,network:"FAST"}],comprehensiveStrokeCenters:[{id:"BW-CS-001",name:"Universitätsmedizin Mannheim",address:"Theodor-Kutzer-Ufer 1-3, 68167 Mannheim",coordinates:{lat:49.4828,lng:8.4664},phone:"+49 621 383-0",emergency:"+49 621 383-2251",thrombectomy:!0,thrombolysis:!0,beds:1400,network:"FAST"}],regionalStrokeUnits:[{id:"BW-RSU-001",name:"Robert-Bosch-Krankenhaus Stuttgart",address:"Auerbachstraße 110, 70376 Stuttgart",coordinates:{lat:48.7447,lng:9.2294},phone:"+49 711 8101-0",emergency:"+49 711 8101-3456",thrombolysis:!0,beds:850,network:"FAST"}],thrombolysisHospitals:[]},nordrheinWestfalen:{neurosurgicalCenters:[{id:"NRW-NS-001",name:"Universitätsklinikum Düsseldorf",address:"Moorenstraße 5, 40225 Düsseldorf",coordinates:{lat:51.1906,lng:6.8064},phone:"+49 211 81-0",emergency:"+49 211 81-17700",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1300,network:"NEVANO+"},{id:"NRW-NS-002",name:"Universitätsklinikum Köln",address:"Kerpener Str. 62, 50937 Köln",coordinates:{lat:50.9253,lng:6.9187},phone:"+49 221 478-0",emergency:"+49 221 478-32500",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1500,network:"NEVANO+"},{id:"NRW-NS-003",name:"Universitätsklinikum Essen",address:"Hufelandstraße 55, 45147 Essen",coordinates:{lat:51.4285,lng:7.0073},phone:"+49 201 723-0",emergency:"+49 201 723-84444",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1350,network:"NEVANO+"},{id:"NRW-NS-004",name:"Universitätsklinikum Münster",address:"Albert-Schweitzer-Campus 1, 48149 Münster",coordinates:{lat:51.9607,lng:7.6261},phone:"+49 251 83-0",emergency:"+49 251 83-47255",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1513,network:"NEVANO+"},{id:"NRW-NS-005",name:"Universitätsklinikum Bonn",address:"Venusberg-Campus 1, 53127 Bonn",coordinates:{lat:50.6916,lng:7.1127},phone:"+49 228 287-0",emergency:"+49 228 287-15107",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1200,network:"NEVANO+"},{id:"NRW-NS-006",name:"Klinikum Dortmund",address:"Beurhausstraße 40, 44137 Dortmund",coordinates:{lat:51.5036,lng:7.4663},phone:"+49 231 953-0",emergency:"+49 231 953-20050",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1200,network:"NVNR"},{id:"NRW-NS-007",name:"Rhein-Maas Klinikum Würselen",address:"Mauerfeldstraße 25, 52146 Würselen",coordinates:{lat:50.8178,lng:6.1264},phone:"+49 2405 62-0",emergency:"+49 2405 62-2222",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:420,network:"NEVANO+"}],comprehensiveStrokeCenters:[{id:"NRW-CS-001",name:"Universitätsklinikum Aachen",address:"Pauwelsstraße 30, 52074 Aachen",coordinates:{lat:50.778,lng:6.0614},phone:"+49 241 80-0",emergency:"+49 241 80-89611",thrombectomy:!0,thrombolysis:!0,beds:1400,network:"NEVANO+"}],regionalStrokeUnits:[{id:"NRW-RSU-001",name:"Helios Universitätsklinikum Wuppertal",address:"Heusnerstraße 40, 42283 Wuppertal",coordinates:{lat:51.2467,lng:7.1703},phone:"+49 202 896-0",emergency:"+49 202 896-2180",thrombolysis:!0,beds:1050,network:"NEVANO+"}],thrombolysisHospitals:[{id:"NRW-TH-009",name:"Elisabeth-Krankenhaus Essen",address:"Klara-Kopp-Weg 1, 45138 Essen",coordinates:{lat:51.4495,lng:7.0137},phone:"+49 201 897-0",thrombolysis:!0,beds:583},{id:"NRW-TH-010",name:"Klinikum Oberberg Gummersbach",address:"Wilhelm-Breckow-Allee 20, 51643 Gummersbach",coordinates:{lat:51.0277,lng:7.5694},phone:"+49 2261 17-0",thrombolysis:!0,beds:431},{id:"NRW-TH-011",name:"St. Vincenz-Krankenhaus Limburg",address:"Auf dem Schafsberg, 65549 Limburg",coordinates:{lat:50.3856,lng:8.0584},phone:"+49 6431 292-0",thrombolysis:!0,beds:452},{id:"NRW-TH-012",name:"Klinikum Lüdenscheid",address:"Paulmannshöher Straße 14, 58515 Lüdenscheid",coordinates:{lat:51.2186,lng:7.6298},phone:"+49 2351 46-0",thrombolysis:!0,beds:869}]}},Ce={routePatient:function(a){const{location:e,state:t,ichProbability:s,timeFromOnset:n,clinicalFactors:i}=a,o=t||this.detectState(e),l=ie[o];if(s>=.5){const c=this.findNearest(e,l.neurosurgicalCenters);if(!c)throw new Error(`No neurosurgical centers available in ${o}`);return{category:"NEUROSURGICAL_CENTER",destination:c,urgency:"IMMEDIATE",reasoning:"High bleeding probability (≥50%) - neurosurgical evaluation required",preAlert:"Activate neurosurgery team",bypassLocal:!0,threshold:"≥50%",state:o}}else if(s>=.3){const c=[...l.neurosurgicalCenters,...l.comprehensiveStrokeCenters];return{category:"COMPREHENSIVE_CENTER",destination:this.findNearest(e,c),urgency:"URGENT",reasoning:"Intermediate bleeding risk (30-50%) - CT and possible intervention",preAlert:"Prepare for possible neurosurgical consultation",transferPlan:this.findNearest(e,l.neurosurgicalCenters),threshold:"30-50%",state:o}}else if(n&&n<=270){const c=[...l.neurosurgicalCenters,...l.comprehensiveStrokeCenters,...l.regionalStrokeUnits,...l.thrombolysisHospitals];return{category:"THROMBOLYSIS_CAPABLE",destination:this.findNearest(e,c),urgency:"TIME_CRITICAL",reasoning:"Low bleeding risk (<30%), within tPA window - nearest thrombolysis",preAlert:"Prepare for thrombolysis protocol",bypassLocal:!1,threshold:"<30%",timeWindow:"≤4.5h",state:o}}else{const c=[...l.neurosurgicalCenters,...l.comprehensiveStrokeCenters,...l.regionalStrokeUnits];return{category:"STROKE_UNIT",destination:this.findNearest(e,c),urgency:"STANDARD",reasoning:n>270?"Low bleeding risk, outside tPA window - standard stroke evaluation":"Low bleeding risk - standard stroke evaluation",preAlert:"Standard stroke protocol",bypassLocal:!1,threshold:"<30%",timeWindow:n?">4.5h":"unknown",state:o}}},detectState:function(a){return a.lat>=47.5&&a.lat<=49.8&&a.lng>=7.5&&a.lng<=10.2?"badenWuerttemberg":a.lat>=50.3&&a.lat<=52.5&&a.lng>=5.9&&a.lng<=9.5?"nordrheinWestfalen":a.lat>=47.2&&a.lat<=50.6&&a.lng>=10.2&&a.lng<=13.8?"bayern":this.findNearestState(a)},findNearestState:function(a){const e={bayern:{lat:49,lng:11.5},badenWuerttemberg:{lat:48.5,lng:9},nordrheinWestfalen:{lat:51.5,lng:7.5}};let t="bayern",s=1/0;for(const[n,i]of Object.entries(e)){const o=this.calculateDistance(a,i);o<s&&(s=o,t=n)}return t},findNearest:function(a,e){return!e||e.length===0?(console.warn("No hospitals available in database"),null):e.map(t=>!t.coordinates||typeof t.coordinates.lat!="number"?(console.warn(`Hospital ${t.name} missing valid coordinates`),null):{...t,distance:this.calculateDistance(a,t.coordinates)}).filter(t=>t!==null).sort((t,s)=>t.distance-s.distance)[0]},calculateDistance:function(a,e){const s=this.toRad(e.lat-a.lat),n=this.toRad(e.lng-a.lng),i=Math.sin(s/2)*Math.sin(s/2)+Math.cos(this.toRad(a.lat))*Math.cos(this.toRad(e.lat))*Math.sin(n/2)*Math.sin(n/2);return 6371*(2*Math.atan2(Math.sqrt(i),Math.sqrt(1-i)))},toRad:function(a){return a*(Math.PI/180)}};function D(a,e,t,s){const i=I(t-a),o=I(s-e),l=Math.sin(i/2)*Math.sin(i/2)+Math.cos(I(a))*Math.cos(I(t))*Math.sin(o/2)*Math.sin(o/2);return 6371*(2*Math.atan2(Math.sqrt(l),Math.sqrt(1-l)))}function I(a){return a*(Math.PI/180)}async function Me(a,e,t,s,n="driving-car"){try{const i=`https://api.openrouteservice.org/v2/directions/${n}`,l=await fetch(i,{method:"POST",headers:{Accept:"application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",Authorization:"5b3ce3597851110001cf624868c4c27b63ae476c9c26c8bffbc35688","Content-Type":"application/json; charset=utf-8"},body:JSON.stringify({coordinates:[[e,a],[s,t]],radiuses:[1e3,1e3],format:"json"})});if(!l.ok)throw new Error(`Routing API error: ${l.status}`);const c=await l.json();if(c.routes&&c.routes.length>0){const d=c.routes[0];return{duration:Math.round(d.summary.duration/60),distance:Math.round(d.summary.distance/1e3),source:"routing"}}else throw new Error("No route found")}catch(i){console.warn("Travel time calculation failed, using distance estimate:",i);const o=D(a,e,t,s);return{duration:Math.round(o/.8),distance:Math.round(o),source:"estimated"}}}async function Y(a,e,t,s){try{const n=await Me(a,e,t,s,"driving-car");return{duration:Math.round(n.duration*.75),distance:n.distance,source:n.source==="routing"?"emergency-routing":"emergency-estimated"}}catch{const i=D(a,e,t,s);return{duration:Math.round(i/1.2),distance:Math.round(i),source:"emergency-estimated"}}}function ne(a){return`
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
  `}function $e(a){const e=document.getElementById("useGpsButton"),t=document.getElementById("manualLocationButton"),s=document.querySelector(".location-manual"),n=document.getElementById("locationInput"),i=document.getElementById("searchLocationButton"),o=document.getElementById("strokeCenterResults");e&&e.addEventListener("click",()=>{Re(a,o)}),t&&t.addEventListener("click",()=>{s.style.display=s.style.display==="none"?"block":"none"}),i&&i.addEventListener("click",()=>{const l=n.value.trim();l&&j(l,a,o)}),n&&n.addEventListener("keypress",l=>{if(l.key==="Enter"){const c=n.value.trim();c&&j(c,a,o)}})}function Re(a,e){if(!navigator.geolocation){C(r("geolocationNotSupported"),e);return}e.innerHTML=`<div class="loading">${r("gettingLocation")}...</div>`,navigator.geolocation.getCurrentPosition(t=>{const{latitude:s,longitude:n}=t.coords;z(s,n,a,e)},t=>{let s=r("locationError");switch(t.code){case t.PERMISSION_DENIED:s=r("locationPermissionDenied");break;case t.POSITION_UNAVAILABLE:s=r("locationUnavailable");break;case t.TIMEOUT:s=r("locationTimeout");break}C(s,e)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:3e5})}async function j(a,e,t){t.innerHTML=`<div class="loading">${r("searchingLocation")}...</div>`;const s=/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/,n=a.trim().match(s);if(n){const i=parseFloat(n[1]),o=parseFloat(n[2]);if(i>=47.2&&i<=52.5&&o>=5.9&&o<=15){t.innerHTML=`
        <div class="location-success">
          <p>📍 Coordinates: ${i.toFixed(4)}, ${o.toFixed(4)}</p>
        </div>
      `,setTimeout(()=>{z(i,o,e,t)},500);return}else{C("Coordinates appear to be outside Germany. Please check the values.",t);return}}try{let i=a.trim();!i.toLowerCase().includes("deutschland")&&!i.toLowerCase().includes("germany")&&!i.toLowerCase().includes("bayern")&&!i.toLowerCase().includes("bavaria")&&!i.toLowerCase().includes("nordrhein")&&!i.toLowerCase().includes("baden")&&(i=i+", Deutschland");const l=`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(i)}&countrycodes=de&format=json&limit=3&addressdetails=1`,c=await fetch(l,{method:"GET",headers:{Accept:"application/json","User-Agent":"iGFAP-StrokeTriage/2.1.0"}});if(!c.ok)throw new Error(`Geocoding API error: ${c.status}`);const d=await c.json();if(d&&d.length>0){let g=d[0];const p=["Bayern","Baden-Württemberg","Nordrhein-Westfalen"];for(const b of d)if(b.address&&p.includes(b.address.state)){g=b;break}const h=parseFloat(g.lat),f=parseFloat(g.lon),u=g.display_name||a;t.innerHTML=`
        <div class="location-success">
          <p>📍 Found: ${u}</p>
          <small style="color: #666;">Lat: ${h.toFixed(4)}, Lng: ${f.toFixed(4)}</small>
        </div>
      `,setTimeout(()=>{z(h,f,e,t)},1e3)}else C(`
        <strong>Location "${a}" not found.</strong><br>
        <small>Try:</small>
        <ul style="text-align: left; font-size: 0.9em; margin: 10px 0;">
          <li>City name: "München", "Köln", "Stuttgart"</li>
          <li>Address: "Marienplatz 1, München"</li>
          <li>Coordinates: "48.1351, 11.5820"</li>
        </ul>
      `,t)}catch(i){console.warn("Geocoding failed:",i),C(`
      <strong>Unable to search location.</strong><br>
      <small>Please try entering coordinates directly (e.g., "48.1351, 11.5820")</small>
    `,t)}}async function z(a,e,t,s){var l,c;const n={lat:a,lng:e},i=Ce.routePatient({location:n,ichProbability:((l=t==null?void 0:t.ich)==null?void 0:l.probability)||0,timeFromOnset:(t==null?void 0:t.timeFromOnset)||null,clinicalFactors:(t==null?void 0:t.clinicalFactors)||{}});if(!i||!i.destination){s.innerHTML=`
      <div class="location-error">
        <p>⚠️ No suitable stroke centers found in this area.</p>
        <p><small>Please try a different location or contact emergency services directly.</small></p>
      </div>
    `;return}const o=Pe(i,t);s.innerHTML=`
    <div class="location-info">
      <p><strong>${r("yourLocation")}:</strong> ${a.toFixed(4)}, ${e.toFixed(4)}</p>
      <p><strong>Detected State:</strong> ${J(i.state)}</p>
    </div>
    <div class="loading">${r("calculatingTravelTimes")}...</div>
  `;try{const d=ie[i.state],g=[...d.neurosurgicalCenters,...d.comprehensiveStrokeCenters,...d.regionalStrokeUnits,...d.thrombolysisHospitals||[]],p=i.destination;p.distance=D(a,e,p.coordinates.lat,p.coordinates.lng);try{const u=await Y(a,e,p.coordinates.lat,p.coordinates.lng);p.travelTime=u.duration,p.travelSource=u.source}catch{p.travelTime=Math.round(p.distance/.8),p.travelSource="estimated"}const h=g.filter(u=>u.id!==p.id).map(u=>({...u,distance:D(a,e,u.coordinates.lat,u.coordinates.lng)})).sort((u,b)=>u.distance-b.distance).slice(0,3);for(const u of h)try{const b=await Y(a,e,u.coordinates.lat,u.coordinates.lng);u.travelTime=b.duration,u.travelSource=b.source}catch{u.travelTime=Math.round(u.distance/.8),u.travelSource="estimated"}const f=`
      <div class="location-info">
        <p><strong>${r("yourLocation")}:</strong> ${a.toFixed(4)}, ${e.toFixed(4)}</p>
        <p><strong>State:</strong> ${J(i.state)}</p>
        ${o}
      </div>
      
      <div class="recommended-centers">
        <h4>🏥 ${i.urgency==="IMMEDIATE"?"Emergency":"Recommended"} Destination</h4>
        ${Z(p,!0,i)}
      </div>
      
      ${h.length>0?`
        <div class="alternative-centers">
          <h4>Alternative Centers</h4>
          ${h.map(u=>Z(u,!1,i)).join("")}
        </div>
      `:""}
      
      <div class="travel-time-note">
        <small>${r("travelTimeNote")||"Travel times estimated for emergency vehicles"}</small>
      </div>
    `;s.innerHTML=f}catch(d){console.warn("Enhanced routing failed, using basic display:",d),s.innerHTML=`
      <div class="location-info">
        <p><strong>${r("yourLocation")}:</strong> ${a.toFixed(4)}, ${e.toFixed(4)}</p>
        ${o}
      </div>
      
      <div class="recommended-centers">
        <h4>Recommended Center</h4>
        <div class="stroke-center-card recommended">
          <div class="center-header">
            <h5>${i.destination.name}</h5>
            <span class="distance">${((c=i.destination.distance)==null?void 0:c.toFixed(1))||"?"} km</span>
          </div>
          <div class="center-details">
            <p class="address">📍 ${i.destination.address}</p>
            <p class="phone">📞 ${i.destination.emergency||i.destination.phone}</p>
          </div>
        </div>
      </div>
      
      <div class="routing-reasoning">
        <p><strong>Routing Logic:</strong> ${i.reasoning}</p>
      </div>
    `}}function J(a){return{bayern:"Bayern (Bavaria)",badenWuerttemberg:"Baden-Württemberg",nordrheinWestfalen:"Nordrhein-Westfalen (NRW)"}[a]||a}function Pe(a,e){var n;const t=Math.round((((n=e==null?void 0:e.ich)==null?void 0:n.probability)||0)*100);let s="🏥";return a.urgency==="IMMEDIATE"?s="🚨":a.urgency==="TIME_CRITICAL"?s="⏰":a.urgency==="URGENT"&&(s="⚠️"),`
    <div class="routing-explanation ${a.category.toLowerCase()}">
      <div class="routing-header">
        <strong>${s} ${a.category.replace("_"," ")} - ${a.urgency}</strong>
      </div>
      <div class="routing-details">
        <p><strong>ICH Risk:</strong> ${t}% ${a.threshold?`(${a.threshold})`:""}</p>
        ${a.timeWindow?`<p><strong>Time Window:</strong> ${a.timeWindow}</p>`:""}
        <p><strong>Routing Logic:</strong> ${a.reasoning}</p>
        <p><strong>Pre-Alert:</strong> ${a.preAlert}</p>
        ${a.bypassLocal?'<p class="bypass-warning">⚠️ Bypassing local hospitals</p>':""}
      </div>
    </div>
  `}function Z(a,e,t){const s=[];a.neurosurgery&&s.push("🧠 Neurosurgery"),a.thrombectomy&&s.push("🩸 Thrombectomy"),a.thrombolysis&&s.push("💉 Thrombolysis");const n=a.network?`<span class="network-badge">${a.network}</span>`:"";return`
    <div class="stroke-center-card ${e?"recommended":"alternative"} enhanced">
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
  `}function C(a,e){e.innerHTML=`
    <div class="location-error">
      <p>⚠️ ${a}</p>
      <p><small>${r("tryManualEntry")}</small></p>
    </div>
  `}function Ne(a,e){const t=Number(a),s=O[e];return t>=s.high?"🔴 HIGH RISK":t>=s.medium?"🟡 MEDIUM RISK":"🟢 LOW RISK"}const x={moderate:{min:10},high:{min:20},critical:{min:30}};function re(a){if(!a||a<=0)return{volume:0,volumeRange:{min:0,max:0},riskLevel:"low",mortalityRate:"~0%",isValid:!0,calculation:"No hemorrhage detected"};const e=Math.min(a,1e4);a>1e4&&console.warn(`GFAP value ${a} exceeds expected range, capped at 10,000 pg/ml`);try{const t=.0192+.4533*Math.log10(e),s=Math.pow(10,t),n={min:s*.7,max:s*1.3},i=Ie(s),o=De(s),l=s<1?"<1":s.toFixed(1);return{volume:s,displayVolume:l,volumeRange:{min:n.min.toFixed(1),max:n.max.toFixed(1)},riskLevel:i,mortalityRate:o,isValid:!0,calculation:`Based on GFAP ${a} pg/ml`,threshold:s>=30?"SURGICAL":s>=20?"HIGH_RISK":"MANAGEABLE"}}catch(t){return console.error("Volume calculation error:",t),{volume:0,volumeRange:{min:0,max:0},riskLevel:"low",mortalityRate:"Unknown",isValid:!1,calculation:"Calculation error",error:t.message}}}function Ie(a){return a>=x.critical.min?"critical":a>=x.high.min?"high":a>=x.moderate.min?"moderate":"low"}function De(a){return a<10?"5-10%⁴":a<30?`${Math.round(10+(a-10)*9/20)}%⁴`:a<50?`${Math.round(19+(a-30)*25/20)}%³`:a<60?`${Math.round(44+(a-50)*47/10)}%²`:a<80?`${Math.round(91+(a-60)*5/20)}%¹`:"96-100%¹"}function _e(a){return a<1?"<1 ml":a<10?`${a.toFixed(1)} ml`:`${Math.round(a)} ml`}function Be(a){if(!a||a<=0)return`
      <div class="volume-circle" data-volume="0">
        <div class="volume-number">0<span> ml</span></div>
        <svg class="volume-ring" width="120" height="120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="var(--text-secondary)" stroke-width="8" opacity="0.4"/>
          <circle cx="60" cy="60" r="54" fill="none" stroke="var(--primary-color)" stroke-width="8" 
                  stroke-dasharray="${2*Math.PI*54}" 
                  stroke-dashoffset="${2*Math.PI*54}"
                  stroke-linecap="round" 
                  transform="rotate(-90 60 60)"
                  class="volume-progress"/>
        </svg>
      </div>
    `;const e=_e(a),s=Math.min(a/200*100,100);return`
    <div class="volume-circle" data-volume="${a}">
      <div class="volume-number">${e}</div>
      <svg class="volume-ring" width="120" height="120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="var(--text-secondary)" stroke-width="8" opacity="0.4"/>
        <circle cx="60" cy="60" r="54" fill="none" stroke="var(--primary-color)" stroke-width="8" 
                stroke-dasharray="${2*Math.PI*54}" 
                stroke-dashoffset="${2*Math.PI*54*(1-s/100)}"
                stroke-linecap="round" 
                transform="rotate(-90 60 60)"
                class="volume-progress"/>
      </svg>
    </div>
  `}function Fe(){document.querySelectorAll(".volume-progress").forEach(e=>{e.style.strokeDashoffset=e.getAttribute("stroke-dashoffset")})}class ${static calculateProbability(e,t){if(!e||!t||e<=0||t<=0)return{probability:0,confidence:0,isValid:!1,reason:"Invalid inputs: age and GFAP required"};if(e<18||e>120)return{probability:0,confidence:0,isValid:!1,reason:`Age ${e} outside valid range (18-120 years)`};(t<10||t>2e4)&&console.warn(`GFAP ${t} outside typical range (10-20000 pg/ml)`);try{const s=(e-this.PARAMS.age.mean)/this.PARAMS.age.std,n=(t-this.PARAMS.gfap.mean)/this.PARAMS.gfap.std,i=this.PARAMS.coefficients.intercept+this.PARAMS.coefficients.age*s+this.PARAMS.coefficients.gfap*n,o=1/(1+Math.exp(-i)),l=o*100,c=Math.abs(o-.5)*2,d=this.getRiskCategory(l);return{probability:Math.round(l*10)/10,confidence:Math.round(c*100)/100,logit:Math.round(i*1e3)/1e3,riskCategory:d,scaledInputs:{age:Math.round(s*1e3)/1e3,gfap:Math.round(n*1e3)/1e3},rawInputs:{age:e,gfap:t},isValid:!0,calculationMethod:"logistic_regression_age_gfap"}}catch(s){return console.error("Legacy model calculation error:",s),{probability:0,confidence:0,isValid:!1,reason:"Calculation error",error:s.message}}}static getRiskCategory(e){return e<10?{level:"very_low",color:"#10b981",label:"Very Low Risk",description:"Minimal ICH likelihood"}:e<25?{level:"low",color:"#84cc16",label:"Low Risk",description:"Below typical threshold"}:e<50?{level:"moderate",color:"#f59e0b",label:"Moderate Risk",description:"Elevated concern"}:e<75?{level:"high",color:"#f97316",label:"High Risk",description:"Significant likelihood"}:{level:"very_high",color:"#dc2626",label:"Very High Risk",description:"Critical ICH probability"}}static compareModels(e,t){if(!e||!t||!t.isValid)return{isValid:!1,reason:"Invalid model results for comparison"};let s=e.probability||0;s<=1&&(s=s*100);const n=t.probability||0,i=s-n,o=n>0?i/n*100:0,l=s>n?"main":n>s?"legacy":"equal";let c;const d=Math.abs(i);return d<5?c="strong":d<15?c="moderate":d<30?c="weak":c="poor",{isValid:!0,probabilities:{main:Math.round(s*10)/10,legacy:Math.round(n*10)/10},differences:{absolute:Math.round(i*10)/10,relative:Math.round(o*10)/10},agreement:{level:c,higherRiskModel:l},interpretation:this.getComparisonInterpretation(i,c)}}static getComparisonInterpretation(e,t){const s=Math.abs(e);return t==="strong"?{type:"concordant",message:"Models show strong agreement",implication:"Age and GFAP are primary risk factors"}:s>20?{type:"divergent",message:"Significant model disagreement",implication:"Complex model captures additional risk factors not in age/GFAP"}:{type:"moderate_difference",message:"Models show moderate difference",implication:"Additional factors provide incremental predictive value"}}static runValidationTests(){const t=[{age:65,gfap:100,expected:"low",description:"Younger patient, low GFAP"},{age:75,gfap:500,expected:"moderate",description:"Average age, moderate GFAP"},{age:85,gfap:1e3,expected:"high",description:"Older patient, high GFAP"},{age:70,gfap:2e3,expected:"very_high",description:"High GFAP dominates"},{age:90,gfap:50,expected:"very_low",description:"Low GFAP despite age"}].map(i=>{const o=this.calculateProbability(i.age,i.gfap);return{...i,result:o,passed:o.isValid&&o.riskCategory.level===i.expected}}),s=t.filter(i=>i.passed).length,n=t.length;return{summary:{passed:s,total:n,passRate:Math.round(s/n*100)},details:t}}static getModelMetadata(){return{name:"Legacy ICH Model",type:"Logistic Regression",version:"1.0.0",features:["age","gfap"],performance:{rocAuc:.789,recall:.4,precision:.86,f1Score:.55,specificity:.94},trainingData:{samples:"Historical cohort",dateRange:"Research study period",validation:"Cross-validation"},limitations:["Only uses age and GFAP - ignores clinical symptoms","Lower recall (40%) - misses some ICH cases","No time-to-onset consideration","No blood pressure or medication factors","Simplified feature set for baseline comparison"],purpose:"Research baseline for evaluating complex model improvements"}}}N($,"PARAMS",{age:{mean:74.59,std:12.75},gfap:{mean:665.23,std:2203.77},coefficients:{intercept:.3248,age:-.2108,gfap:3.1631}});function He(a){try{const e=(a==null?void 0:a.age_years)||(a==null?void 0:a.age)||null,t=(a==null?void 0:a.gfap_value)||(a==null?void 0:a.gfap)||null;return!e||!t?null:$.calculateProbability(e,t)}catch(e){return console.warn("Legacy ICH calculation failed (non-critical):",e),null}}class w{static logComparison(e){try{const t={id:this.generateEntryId(),timestamp:new Date().toISOString(),sessionId:this.getSessionId(),...e},s=this.getStoredData();return s.entries.push(t),s.entries.length>this.MAX_ENTRIES&&(s.entries=s.entries.slice(-this.MAX_ENTRIES)),s.lastUpdated=new Date().toISOString(),s.totalComparisons=s.entries.length,localStorage.setItem(this.STORAGE_KEY,JSON.stringify(s)),console.log(`📊 Research data logged (${s.totalComparisons} comparisons)`),!0}catch(t){return console.warn("Research data logging failed (non-critical):",t),!1}}static getStoredData(){try{const e=localStorage.getItem(this.STORAGE_KEY);if(!e)return this.createEmptyDataset();const t=JSON.parse(e);return!t.entries||!Array.isArray(t.entries)?(console.warn("Invalid research data structure, resetting"),this.createEmptyDataset()):t}catch(e){return console.warn("Failed to load research data, creating new:",e),this.createEmptyDataset()}}static createEmptyDataset(){return{version:"1.0.0",created:new Date().toISOString(),lastUpdated:null,totalComparisons:0,entries:[],metadata:{app:"iGFAP Stroke Triage",purpose:"Model comparison research",dataRetention:"Local storage only"}}}static exportAsCSV(){const e=this.getStoredData();if(!e.entries||e.entries.length===0)return"No research data available for export";const t=["timestamp","session_id","age","gfap_value","main_model_probability","main_model_module","legacy_model_probability","legacy_model_confidence","absolute_difference","relative_difference","agreement_level","higher_risk_model"],s=e.entries.map(i=>{var o,l,c,d,g,p,h,f,u,b,R,F,H,E;return[i.timestamp,i.sessionId,((o=i.inputs)==null?void 0:o.age)||"",((l=i.inputs)==null?void 0:l.gfap)||"",((c=i.main)==null?void 0:c.probability)||"",((d=i.main)==null?void 0:d.module)||"",((g=i.legacy)==null?void 0:g.probability)||"",((p=i.legacy)==null?void 0:p.confidence)||"",((f=(h=i.comparison)==null?void 0:h.differences)==null?void 0:f.absolute)||"",((b=(u=i.comparison)==null?void 0:u.differences)==null?void 0:b.relative)||"",((F=(R=i.comparison)==null?void 0:R.agreement)==null?void 0:F.level)||"",((E=(H=i.comparison)==null?void 0:H.agreement)==null?void 0:E.higherRiskModel)||""].join(",")});return[t.join(","),...s].join(`
`)}static exportAsJSON(){const e=this.getStoredData();return JSON.stringify(e,null,2)}static downloadData(e="csv"){try{const t=e==="csv"?this.exportAsCSV():this.exportAsJSON(),s=`igfap-research-${Date.now()}.${e}`,n=new Blob([t],{type:e==="csv"?"text/csv":"application/json"}),i=URL.createObjectURL(n),o=document.createElement("a");return o.href=i,o.download=s,document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(i),console.log(`📥 Downloaded research data: ${s}`),!0}catch(t){return console.error("Failed to download research data:",t),!1}}static clearData(){try{return localStorage.removeItem(this.STORAGE_KEY),console.log("🗑️ Research data cleared"),!0}catch(e){return console.warn("Failed to clear research data:",e),!1}}static getDataSummary(){var i,o;const e=this.getStoredData();if(!e.entries||e.entries.length===0)return{totalEntries:0,dateRange:null,avgDifference:null};const t=e.entries,s=t.map(l=>{var c,d;return(d=(c=l.comparison)==null?void 0:c.differences)==null?void 0:d.absolute}).filter(l=>l!=null),n=s.length>0?s.reduce((l,c)=>l+Math.abs(c),0)/s.length:0;return{totalEntries:t.length,dateRange:{first:(i=t[0])==null?void 0:i.timestamp,last:(o=t[t.length-1])==null?void 0:o.timestamp},avgAbsoluteDifference:Math.round(n*10)/10,storageSize:JSON.stringify(e).length}}static generateEntryId(){return Date.now().toString(36)+Math.random().toString(36).substr(2)}static getSessionId(){let e=sessionStorage.getItem("research_session_id");return e||(e="session_"+Date.now().toString(36),sessionStorage.setItem("research_session_id",e)),e}}N(w,"STORAGE_KEY","igfap_research_data"),N(w,"MAX_ENTRIES",1e3);function xe(a,e,t){try{if(!S())return;const s={inputs:{age:t.age_years||t.age,gfap:t.gfap_value||t.gfap,module:a.module||"unknown"},main:{probability:a.probability,module:a.module,confidence:a.confidence},legacy:e,comparison:e?$.compareModels(a,e):null};w.logComparison(s)}catch(s){console.warn("Research logging failed (non-critical):",s)}}function S(a=null){var e;if(a==="coma")return!1;if(a==="limited"||a==="full")return!0;if(typeof window<"u")try{const t=window.store||((e=require("../state/store.js"))==null?void 0:e.store);if(t){const s=t.getState().formData;return s.limited||s.full}}catch{}return!1}function oe(){return""}function le(a,e,t){if(!(e!=null&&e.isValid))return console.log("🔬 Legacy model results invalid:",e),`
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
    `;const s=$.compareModels(a,e);return`
    <div class="research-panel" id="researchPanel" style="display: none;">
      <div class="research-header">
        <h4>🔬 Model Comparison (Research)</h4>
        <button class="close-research" id="closeResearch">×</button>
      </div>
      
      <div class="model-comparison">
        ${Oe(a,e)}
        ${Ve(s)}
        ${ze(e,t)}
        ${Ke()}
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
  `}function Oe(a,e){let t=a.probability||0;t<=1&&(t=t*100);const s=e.probability||0;return`
    <div class="probability-comparison">
      <div class="bar-group">
        <label class="bar-label">Main Model (Complex) - ${a.module||"Unknown"}</label>
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
  `}function Ve(a){if(!a.isValid)return'<div class="comparison-error">Unable to compare models</div>';const{differences:e,agreement:t}=a;return`
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
        <p class="interpretation-text">${a.interpretation.message}</p>
        <small class="interpretation-detail">${a.interpretation.implication}</small>
      </div>
    </div>
  `}function ze(a,e){return`
    <div class="calculation-details" id="calculationDetails" style="display: none;">
      <h5>Legacy Model Calculation</h5>
      <div class="calculation-steps">
        <div class="step">
          <strong>Inputs:</strong> Age ${e.age}, GFAP ${e.gfap} pg/ml
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
  `}function Ke(){const a=$.getModelMetadata();return`
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
  `}function Ue(){if(!document.getElementById("researchPanel"))return;const e=document.getElementById("closeResearch");e&&e.addEventListener("click",()=>{const i=document.getElementById("researchPanel");i&&(i.style.display="none")});const t=document.getElementById("exportResearchData");t&&t.addEventListener("click",()=>{w.downloadData("csv")});const s=document.getElementById("toggleCalculationDetails");s&&s.addEventListener("click",()=>{const i=document.getElementById("calculationDetails");i&&(i.style.display=i.style.display==="none"?"block":"none",s.textContent=i.style.display==="none"?"🧮 Details":"🧮 Hide")});const n=document.getElementById("clearResearchData");n&&n.addEventListener("click",()=>{if(confirm("Clear all research data? This cannot be undone.")){w.clearData();const i=w.getDataSummary();console.log(`Data cleared. Total entries: ${i.totalEntries}`)}}),console.log("🔬 Research mode initialized")}function ce(){const e=m.getState().formData;if(!e||Object.keys(e).length===0)return"";let t="";return Object.entries(e).forEach(([s,n])=>{if(n&&Object.keys(n).length>0){const i=r(`${s}ModuleTitle`)||s.charAt(0).toUpperCase()+s.slice(1);let o="";Object.entries(n).forEach(([l,c])=>{if(c===""||c===null||c===void 0)return;let d=Te(l),g=Ae(c,l);o+=`
          <div class="summary-item">
            <span class="summary-label">${d}:</span>
            <span class="summary-value">${g}</span>
          </div>
        `}),o&&(t+=`
          <div class="summary-module">
            <h4>${i}</h4>
            <div class="summary-items">
              ${o}
            </div>
          </div>
        `)}}),t?`
    <div class="input-summary">
      <h3>📋 ${r("inputSummaryTitle")}</h3>
      <p class="summary-subtitle">${r("inputSummarySubtitle")}</p>
      <div class="summary-content">
        ${t}
      </div>
    </div>
  `:""}function de(a,e,t){if(!e)return"";const s=Math.round((e.probability||0)*100),n=Ne(s,a),i=s>O[a].critical,o=s>O[a].high,l={ich:"🩸",lvo:"🧠"},c={ich:r("ichProbability"),lvo:r("lvoProbability")},d={ich:"ICH",lvo:A.getCurrentLanguage()==="de"?"Großgefäßverschluss":"Large Vessel Occlusion"};return`
    <div class="enhanced-risk-card ${a} ${i?"critical":o?"high":"normal"}">
      <div class="risk-header">
        <div class="risk-icon">${l[a]}</div>
        <div class="risk-title">
          <h3>${c[a]}</h3>
          <span class="risk-subtitle">${d[a]}</span>
          <span class="risk-module">${e.module} Module</span>
        </div>
      </div>
      
      <div class="risk-probability">
        <div class="circles-container">
          <div class="circle-item">
            <div class="probability-circle" data-percent="${s}">
              <div class="probability-number">${s}<span>%</span></div>
              <svg class="probability-ring" width="120" height="120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="var(--text-secondary)" stroke-width="8" opacity="0.4"/>
                <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" stroke-width="8" 
                        stroke-dasharray="${2*Math.PI*54}" 
                        stroke-dashoffset="${2*Math.PI*54*(1-s/100)}"
                        stroke-linecap="round" 
                        transform="rotate(-90 60 60)"
                        class="probability-progress"/>
              </svg>
            </div>
            <div class="circle-label">ICH Risk</div>
            <div class="risk-level ${i?"critical":o?"high":"normal"}">
              ${n}
            </div>
          </div>
          
          ${s>=50?`
            <div class="circle-item">
              ${Ge(e)}
              <div class="circle-label">${r("ichVolumeLabel")}</div>
            </div>
          `:""}
        </div>
        
        <div class="risk-assessment">
          ${s>=50&&_()>0?`
            <div class="mortality-assessment">
              ${r("predictedMortality")}: ${re(_()).mortalityRate}
            </div>
          `:""}
        </div>
      </div>
    </div>
  `}function Ge(a){const e=a.gfap_value||_();if(!e||e<=0)return"";const t=re(e);return`
    <div class="volume-display-container">
      ${Be(t.volume)}
    </div>
  `}function _(){var t;const e=m.getState().formData;for(const s of["coma","limited","full"])if((t=e[s])!=null&&t.gfap_value)return parseFloat(e[s].gfap_value);return 0}function We(a,e){const{ich:t,lvo:s}=a,n=Ze(t),i=n!=="coma"?Je():null;console.log("🔬 Research Debug - Always Active:",{module:n,researchEnabled:S(n),mainResults:t,legacyResults:i,patientInputs:M(),legacyCalculationAttempted:n!=="coma"}),i&&S(n)&&xe(t,i,M());const o=(t==null?void 0:t.module)==="Limited"||(t==null?void 0:t.module)==="Coma"||(s==null?void 0:s.notPossible)===!0;t==null||t.module;let l;return o?l=qe(t,a,e,i,n):l=Ye(t,s,a,e,i,n),setTimeout(()=>{Fe()},100),l}function qe(a,e,t,s,n){const i=a&&a.probability>.6?ae():"",o=ne(),l=ce(),c=S(n)?oe():"",d=s&&S(n)?le(a,s,M()):"";return`
    <div class="container">
      ${L(3)}
      <h2>${r("bleedingRiskAssessment")||"Blutungsrisiko-Bewertung / Bleeding Risk Assessment"}</h2>
      ${i}
      
      <!-- Single ICH Risk Card -->
      <div class="risk-results-single">
        ${de("ich",a)}
      </div>
      
      <!-- Research Model Comparison (hidden unless research mode) -->
      ${d}
      
      <!-- ICH Drivers Only -->
      <div class="enhanced-drivers-section">
        <h3>${r("riskFactorsTitle")||"Hauptrisikofaktoren / Main Risk Factors"}</h3>
        ${ue(a)}
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
          ${o}
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
      
      ${me(a)}
      ${c}
    </div>
  `}function Ye(a,e,t,s,n,i){const o=Math.round(((a==null?void 0:a.probability)||0)*100),l=Math.round(((e==null?void 0:e.probability)||0)*100),c=a&&a.probability>.6?ae():"",d=ne(),g=ce(),p=S(i)?oe():"",h=n&&S(i)?le(a,n,M()):"",f=o<30&&l>50;return`
    <div class="container">
      ${L(3)}
      <h2>${r("resultsTitle")}</h2>
      ${c}
      
      <!-- Primary ICH Risk Display -->
      <div class="risk-results-single">
        ${de("ich",a)}
        ${f?je():""}
      </div>
      
      <!-- Research Model Comparison (hidden unless research mode) -->
      ${h}
      
      <!-- ICH Drivers Only -->
      <div class="enhanced-drivers-section">
        <h3>${r("riskFactorsTitle")||"Risikofaktoren / Risk Factors"}</h3>
        ${ue(a)}
      </div>
      
      <!-- Collapsible Additional Information -->
      <div class="additional-info-section">
        <button class="info-toggle" data-target="input-summary">
          <span class="toggle-icon">📋</span>
          <span class="toggle-text">${r("inputSummaryTitle")}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="input-summary" style="display: none;">
          ${g}
        </div>
        
        <button class="info-toggle" data-target="stroke-centers">
          <span class="toggle-icon">🏥</span>
          <span class="toggle-text">${r("nearestCentersTitle")}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="stroke-centers" style="display: none;">
          ${d}
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
      
      ${me(a)}
      ${p}
    </div>
  `}function je(){return`
    <div class="secondary-notification">
      <p class="lvo-possible">
        ⚡ ${r("lvoMayBePossible")||"Großgefäßverschluss möglich / Large vessel occlusion possible"}
      </p>
    </div>
  `}function ue(a){if(!a||!a.drivers)return'<p class="no-drivers">No driver data available</p>';const e=a.drivers;if(!e.positive&&!e.negative)return'<p class="no-drivers">Driver format error</p>';const t=e.positive||[],s=e.negative||[];return`
    <div class="drivers-split-view">
      <div class="drivers-column positive-column">
        <div class="column-header">
          <span class="column-icon">⬆</span>
          <span class="column-title">${r("increasingRisk")||"Risikoerhöhend / Increasing Risk"}</span>
        </div>
        <div class="compact-drivers">
          ${t.length>0?t.slice(0,5).map(n=>Q(n,"positive")).join(""):`<p class="no-factors">${r("noFactors")||"Keine Faktoren / No factors"}</p>`}
        </div>
      </div>
      
      <div class="drivers-column negative-column">
        <div class="column-header">
          <span class="column-icon">⬇</span>
          <span class="column-title">${r("decreasingRisk")||"Risikomindernd / Decreasing Risk"}</span>
        </div>
        <div class="compact-drivers">
          ${s.length>0?s.slice(0,5).map(n=>Q(n,"negative")).join(""):`<p class="no-factors">${r("noFactors")||"Keine Faktoren / No factors"}</p>`}
        </div>
      </div>
    </div>
  `}function Q(a,e){const t=Math.abs(a.weight*100),s=Math.min(t*2,100);return`
    <div class="compact-driver-item">
      <div class="compact-driver-label">${se(a.label)}</div>
      <div class="compact-driver-bar ${e}" style="width: ${s}%;">
        <span class="compact-driver-value">${t.toFixed(1)}%</span>
      </div>
    </div>
  `}function me(a){if(!a||!a.probability||Math.round((a.probability||0)*100)<50)return"";const t=_();return!t||t<=0?"":`
    <div class="bibliography-section">
      <h4>${r("references")}</h4>
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
  `}function Je(a){try{const e=M();if(console.log("🔍 Legacy calculation inputs:",e),!e.age||!e.gfap)return console.warn("🔍 Missing required inputs for legacy model:",{age:e.age,gfap:e.gfap}),null;const t=He(e);return console.log("🔍 Legacy calculation result:",t),t}catch(e){return console.warn("Legacy model calculation failed (non-critical):",e),null}}function M(){const e=m.getState().formData;console.log("🔍 Debug formData structure:",e);let t=null,s=null;for(const i of["coma","limited","full"])e[i]&&(console.log(`🔍 ${i} module data:`,e[i]),t=t||e[i].age_years,s=s||e[i].gfap_value);const n={age:parseInt(t)||null,gfap:parseFloat(s)||null};return console.log("🔍 Extracted patient inputs:",n),n}function Ze(a){if(!(a!=null&&a.module))return"unknown";const e=a.module.toLowerCase();return e.includes("coma")?"coma":e.includes("limited")?"limited":e.includes("full")?"full":"unknown"}function Qe(a,e,t){const s=[];return t.required&&!e&&e!==0&&s.push("This field is required"),t.min!==void 0&&e!==""&&!isNaN(e)&&parseFloat(e)<t.min&&s.push(`Value must be at least ${t.min}`),t.max!==void 0&&e!==""&&!isNaN(e)&&parseFloat(e)>t.max&&s.push(`Value must be at most ${t.max}`),t.pattern&&!t.pattern.test(e)&&s.push("Invalid format"),s}function Xe(a){let e=!0;const t={};return Object.entries(ye).forEach(([s,n])=>{const i=a.elements[s];if(i){const o=Qe(s,i.value,n);o.length>0&&(t[s]=o,e=!1)}}),{isValid:e,validationErrors:t}}function et(a,e){Object.entries(e).forEach(([t,s])=>{const n=a.querySelector(`[name="${t}"]`);if(n){const i=n.closest(".input-group");if(i){i.classList.add("error"),i.querySelectorAll(".error-message").forEach(l=>l.remove());const o=document.createElement("div");o.className="error-message",o.innerHTML=`<span class="error-icon">⚠️</span> ${s[0]}`,i.appendChild(o)}}})}function tt(a){a.querySelectorAll(".input-group.error").forEach(e=>{e.classList.remove("error"),e.querySelectorAll(".error-message").forEach(t=>t.remove())})}function X(a,e){var o,l;console.log(`=== EXTRACTING ${e.toUpperCase()} DRIVERS ===`),console.log("Full response:",a);let t=null;if(e==="ICH"?(t=((o=a.ich_prediction)==null?void 0:o.drivers)||null,console.log("🧠 ICH raw drivers extracted:",t)):e==="LVO"&&(t=((l=a.lvo_prediction)==null?void 0:l.drivers)||null,console.log("🩸 LVO raw drivers extracted:",t)),!t)return console.log(`❌ No ${e} drivers found`),null;const s=at(t,e);console.log(`✅ ${e} drivers formatted:`,s);const i=[...s.positive,...s.negative].find(c=>c.label&&(c.label.toLowerCase().includes("fast")||c.label.includes("fast_ed")));return i?console.log(`🎯 FAST-ED found in ${e}:`,`${i.label}: ${i.weight>0?"+":""}${i.weight.toFixed(4)}`):console.log(`⚠️  FAST-ED NOT found in ${e} drivers`),s}function at(a,e){console.log(`🔄 Formatting ${e} drivers from dictionary:`,a);const t=[],s=[];return Object.entries(a).forEach(([n,i])=>{typeof i=="number"&&(i>0?t.push({label:n,weight:i}):i<0&&s.push({label:n,weight:Math.abs(i)}))}),t.sort((n,i)=>i.weight-n.weight),s.sort((n,i)=>i.weight-n.weight),console.log(`📈 ${e} positive drivers:`,t.slice(0,5)),console.log(`📉 ${e} negative drivers:`,s.slice(0,5)),{kind:"flat_dictionary",units:"logit",positive:t,negative:s,meta:{}}}function ee(a,e){var s,n;console.log(`=== EXTRACTING ${e.toUpperCase()} PROBABILITY ===`);let t=0;return e==="ICH"?(t=((s=a.ich_prediction)==null?void 0:s.probability)||0,console.log("🧠 ICH probability extracted:",t)):e==="LVO"&&(t=((n=a.lvo_prediction)==null?void 0:n.probability)||0,console.log("🩸 LVO probability extracted:",t)),t}function te(a,e){var s,n;let t=.85;return e==="ICH"?t=((s=a.ich_prediction)==null?void 0:s.confidence)||.85:e==="LVO"&&(t=((n=a.lvo_prediction)==null?void 0:n.confidence)||.85),t}async function st(){console.log("Warming up Cloud Functions...");const a=Object.values(k).map(async e=>{try{const t=new AbortController,s=setTimeout(()=>t.abort(),3e3);await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({}),signal:t.signal,mode:"cors"}),clearTimeout(s),console.log(`Warmed up: ${e}`)}catch{console.log(`Warm-up attempt for ${e.split("/").pop()} completed`)}});Promise.all(a).then(()=>{console.log("Cloud Functions warm-up complete")})}class y extends Error{constructor(e,t,s){super(e),this.name="APIError",this.status=t,this.url=s}}function K(a){const e={...a};return Object.keys(e).forEach(t=>{const s=e[t];(typeof s=="boolean"||s==="on"||s==="true"||s==="false")&&(e[t]=s===!0||s==="on"||s==="true"?1:0)}),e}function B(a,e=0){const t=parseFloat(a);return isNaN(t)?e:t}async function U(a,e){const t=new AbortController,s=setTimeout(()=>t.abort(),V.requestTimeout);try{const n=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(e),signal:t.signal,mode:"cors"});if(clearTimeout(s),!n.ok){let o=`HTTP ${n.status}`;try{const l=await n.json();o=l.error||l.message||o}catch{o=`${o}: ${n.statusText}`}throw new y(o,n.status,a)}return await n.json()}catch(n){throw clearTimeout(s),n.name==="AbortError"?new y("Request timeout - please try again",408,a):n instanceof y?n:new y("Network error - please check your connection and try again",0,a)}}async function it(a){const e=K(a);console.log("Coma ICH API Payload:",e);try{const t=await U(k.COMA_ICH,e);return console.log("Coma ICH API Response:",t),{probability:B(t.probability||t.ich_probability,0),drivers:t.drivers||null,confidence:B(t.confidence,.75),module:"Coma"}}catch(t){throw console.error("Coma ICH prediction failed:",t),new y(`Failed to get ICH prediction: ${t.message}`,t.status,k.COMA_ICH)}}async function nt(a){const e={age_years:a.age_years,systolic_bp:a.systolic_bp,diastolic_bp:a.diastolic_bp,gfap_value:a.gfap_value,vigilanzminderung:a.vigilanzminderung||0},t=K(e);console.log("Limited Data ICH API Payload:",t);try{const s=await U(k.LDM_ICH,t);return console.log("Limited Data ICH API Response:",s),{probability:B(s.probability||s.ich_probability,0),drivers:s.drivers||null,confidence:B(s.confidence,.65),module:"Limited Data"}}catch(s){throw console.error("Limited Data ICH prediction failed:",s),new y(`Failed to get ICH prediction: ${s.message}`,s.status,k.LDM_ICH)}}async function rt(a){var s,n,i,o,l,c;const e={age_years:a.age_years,systolic_bp:a.systolic_bp,diastolic_bp:a.diastolic_bp,gfap_value:a.gfap_value,fast_ed_score:a.fast_ed_score,headache:a.headache||0,vigilanzminderung:a.vigilanzminderung||0,armparese:a.armparese||0,beinparese:a.beinparese||0,eye_deviation:a.eye_deviation||0,atrial_fibrillation:a.atrial_fibrillation||0,anticoagulated_noak:a.anticoagulated_noak||0,antiplatelets:a.antiplatelets||0},t=K(e);console.log("=== BACKEND DATA MAPPING TEST ==="),console.log("📤 Full Stroke API Payload:",t),console.log("🧪 Clinical Variables Being Sent:"),console.log("  📊 FAST-ED Score:",t.fast_ed_score),console.log("  🩸 Systolic BP:",t.systolic_bp),console.log("  🩸 Diastolic BP:",t.diastolic_bp),console.log("  🧬 GFAP Value:",t.gfap_value),console.log("  👤 Age:",t.age_years),console.log("  🤕 Headache:",t.headache),console.log("  😵 Vigilanz:",t.vigilanzminderung),console.log("  💪 Arm Parese:",t.armparese),console.log("  🦵 Leg Parese:",t.beinparese),console.log("  👁️ Eye Deviation:",t.eye_deviation),console.log("  💓 Atrial Fib:",t.atrial_fibrillation),console.log("  💊 Anticoag NOAK:",t.anticoagulated_noak),console.log("  💊 Antiplatelets:",t.antiplatelets);try{const d=await U(k.FULL_STROKE,t);console.log("📥 Full Stroke API Response:",d),console.log("🔑 Available keys in response:",Object.keys(d)),console.log("=== BACKEND MAPPING VERIFICATION ===");const g=JSON.stringify(d).toLowerCase();console.log("🔍 Backend Feature Name Analysis:"),console.log('  Contains "fast":',g.includes("fast")),console.log('  Contains "ed":',g.includes("ed")),console.log('  Contains "fast_ed":',g.includes("fast_ed")),console.log('  Contains "systolic":',g.includes("systolic")),console.log('  Contains "diastolic":',g.includes("diastolic")),console.log('  Contains "gfap":',g.includes("gfap")),console.log('  Contains "age":',g.includes("age")),console.log('  Contains "headache":',g.includes("headache")),console.log("🧠 ICH driver sources:"),console.log("  response.ich_prediction?.drivers:",(s=d.ich_prediction)==null?void 0:s.drivers),console.log("  response.ich_drivers:",d.ich_drivers),console.log("  response.ich?.drivers:",(n=d.ich)==null?void 0:n.drivers),console.log("  response.drivers?.ich:",(i=d.drivers)==null?void 0:i.ich),console.log("🩸 LVO driver sources:"),console.log("  response.lvo_prediction?.drivers:",(o=d.lvo_prediction)==null?void 0:o.drivers),console.log("  response.lvo_drivers:",d.lvo_drivers),console.log("  response.lvo?.drivers:",(l=d.lvo)==null?void 0:l.drivers),console.log("  response.drivers?.lvo:",(c=d.drivers)==null?void 0:c.lvo),Object.keys(d).forEach(E=>{const P=d[E];typeof P=="number"&&P>=0&&P<=1&&console.log(`Potential probability field: ${E} = ${P}`)});const p=ee(d,"ICH"),h=ee(d,"LVO"),f=X(d,"ICH"),u=X(d,"LVO"),b=te(d,"ICH"),R=te(d,"LVO");return console.log("✅ Clean extraction results:"),console.log("  ICH:",{probability:p,hasDrivers:!!f}),console.log("  LVO:",{probability:h,hasDrivers:!!u}),{ich:{probability:p,drivers:f,confidence:b,module:"Full Stroke"},lvo:{probability:h,drivers:u,confidence:R,module:"Full Stroke"}}}catch(d){throw console.error("Full Stroke prediction failed:",d),new y(`Failed to get stroke predictions: ${d.message}`,d.status,k.FULL_STROKE)}}function ot(a){m.logEvent("triage1_answer",{comatose:a}),G(a?"coma":"triage2")}function lt(a){m.logEvent("triage2_answer",{examinable:a}),G(a?"full":"limited")}function G(a){m.logEvent("navigate",{from:m.getState().currentScreen,to:a}),m.navigate(a),window.scrollTo(0,0)}function ct(){m.hasUnsavedData()&&!confirm("Are you sure you want to start over? All entered data will be lost.")||(m.logEvent("reset"),m.reset())}function dt(){console.log("goBack() called");const a=m.goBack();console.log("goBack() success:",a),a?(m.logEvent("navigate_back"),window.scrollTo(0,0)):(console.log("No history available, going home instead"),ge())}function ge(){console.log("goHome() called"),m.logEvent("navigate_home"),m.goHome(),window.scrollTo(0,0)}async function ut(a,e){a.preventDefault();const t=a.target,s=t.dataset.module,n=Xe(t);if(!n.isValid){et(e,n.validationErrors);return}const i={};Array.from(t.elements).forEach(c=>{if(c.name)if(c.type==="checkbox")i[c.name]=c.checked;else if(c.type==="number"){const d=parseFloat(c.value);i[c.name]=isNaN(d)?0:d}else c.type==="hidden"&&c.name==="armparese"?i[c.name]=c.value==="true":i[c.name]=c.value}),console.log("Collected form inputs:",i),m.setFormData(s,i);const o=t.querySelector("button[type=submit]"),l=o?o.innerHTML:"";o&&(o.disabled=!0,o.innerHTML=`<span class="loading-spinner"></span> ${r("analyzing")}`);try{let c;switch(s){case"coma":c={ich:await it(i),lvo:null};break;case"limited":c={ich:await nt(i),lvo:{notPossible:!0}};break;case"full":c=await rt(i);break;default:throw new Error("Unknown module: "+s)}m.setResults(c),m.logEvent("models_complete",{module:s,results:c}),G("results")}catch(c){console.error("Error running models:",c);let d="An error occurred during analysis. Please try again.";c instanceof y&&(d=c.message),mt(e,d),o&&(o.disabled=!1,o.innerHTML=l)}}function mt(a,e){a.querySelectorAll(".critical-alert").forEach(n=>{var i,o;(o=(i=n.querySelector("h4"))==null?void 0:i.textContent)!=null&&o.includes("Error")&&n.remove()});const t=document.createElement("div");t.className="critical-alert",t.innerHTML=`<h4><span class="alert-icon">⚠️</span> Error</h4><p>${e}</p>`;const s=a.querySelector(".container");s?s.prepend(t):a.prepend(t),setTimeout(()=>t.remove(),1e4)}function gt(a){const e=document.createElement("div");e.className="sr-only",e.setAttribute("role","status"),e.setAttribute("aria-live","polite");const t={triage1:"Coma assessment",triage2:"Examination capability assessment",coma:"Coma module",limited:"Limited data module",full:"Full stroke assessment",results:"Assessment results"};e.textContent=`Navigated to ${t[a]||a}`,document.body.appendChild(e),setTimeout(()=>e.remove(),1e3)}function pt(a){const e={triage1:"Initial Assessment - Stroke Triage Assistant",triage2:"Examination Capability - Stroke Triage Assistant",coma:"Coma Module - Stroke Triage Assistant",limited:"Limited Data Module - Stroke Triage Assistant",full:"Full Stroke Module - Stroke Triage Assistant",results:"Assessment Results - Stroke Triage Assistant"};document.title=e[a]||"Stroke Triage Assistant"}function ht(){setTimeout(()=>{const a=document.querySelector("h2");a&&(a.setAttribute("tabindex","-1"),a.focus(),setTimeout(()=>a.removeAttribute("tabindex"),100))},100)}class bt{constructor(){this.scores={facial_palsy:0,arm_weakness:0,speech_changes:0,eye_deviation:0,denial_neglect:0},this.onApply=null,this.modal=null}getTotal(){return Object.values(this.scores).reduce((e,t)=>e+t,0)}getRiskLevel(){return this.getTotal()>=4?"high":"low"}render(){const e=this.getTotal(),t=this.getRiskLevel();return`
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
                <h3>${r("totalScoreTitle")}: <span class="total-score">${e}/9</span></h3>
                <div class="risk-indicator ${t}">
                  ${r("riskLevel")}: ${r(t==="high"?"riskLevelHigh":"riskLevelLow")}
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
    `}setupEventListeners(){if(this.modal=document.getElementById("fastEdModal"),!this.modal)return;this.modal.addEventListener("change",n=>{if(n.target.type==="radio"){const i=n.target.name,o=parseInt(n.target.value);this.scores[i]=o,this.updateDisplay()}});const e=this.modal.querySelector(".modal-close");e==null||e.addEventListener("click",()=>this.close());const t=this.modal.querySelector('[data-action="cancel-fast-ed"]');t==null||t.addEventListener("click",()=>this.close());const s=this.modal.querySelector('[data-action="apply-fast-ed"]');s==null||s.addEventListener("click",()=>this.apply()),this.modal.addEventListener("click",n=>{n.target===this.modal&&this.close()}),document.addEventListener("keydown",n=>{var i;n.key==="Escape"&&((i=this.modal)!=null&&i.classList.contains("show"))&&this.close()})}updateDisplay(){var s,n;const e=(s=this.modal)==null?void 0:s.querySelector(".total-score"),t=(n=this.modal)==null?void 0:n.querySelector(".risk-indicator");if(e&&(e.textContent=`${this.getTotal()}/9`),t){const i=this.getRiskLevel();t.className=`risk-indicator ${i}`,t.textContent=`${r("riskLevel")}: ${r(i==="high"?"riskLevelHigh":"riskLevelLow")}`}}show(e=0,t=null){this.onApply=t,e>0&&e<=9&&this.approximateFromTotal(e),document.getElementById("fastEdModal")?(this.modal.remove(),document.body.insertAdjacentHTML("beforeend",this.render()),this.modal=document.getElementById("fastEdModal")):document.body.insertAdjacentHTML("beforeend",this.render()),this.setupEventListeners(),this.modal.setAttribute("aria-hidden","false"),this.modal.style.display="flex",this.modal.classList.add("show");const s=this.modal.querySelector('input[type="radio"]');s==null||s.focus()}close(){this.modal&&(this.modal.classList.remove("show"),this.modal.style.display="none",this.modal.setAttribute("aria-hidden","true"))}apply(){const e=this.getTotal(),t=this.scores.arm_weakness>0,s=this.scores.eye_deviation>0;this.onApply&&this.onApply({total:e,components:{...this.scores},armWeaknessBoolean:t,eyeDeviationBoolean:s}),this.close()}approximateFromTotal(e){this.scores={facial_palsy:0,arm_weakness:0,speech_changes:0,eye_deviation:0,denial_neglect:0};let t=e;const s=Object.keys(this.scores);for(const n of s){if(t<=0)break;const o=Math.min(t,n==="facial_palsy"?1:2);this.scores[n]=o,t-=o}}}const ft=new bt;function T(a){const e=m.getState(),{currentScreen:t,results:s,startTime:n,navigationHistory:i}=e;a.innerHTML="";const o=document.getElementById("backButton");o&&(o.style.display=i&&i.length>0?"flex":"none");let l="";switch(t){case"triage1":l=q();break;case"triage2":l=ve();break;case"coma":l=ke();break;case"limited":l=Se();break;case"full":l=Le();break;case"results":l=We(s,n);break;default:l=q()}a.innerHTML=l;const c=a.querySelector("form[data-module]");if(c){const d=c.dataset.module;vt(c,d)}yt(a),t==="results"&&s&&setTimeout(()=>{$e(s)},100),setTimeout(()=>{Ue()},150),gt(t),pt(t),ht()}function vt(a,e){const t=m.getFormData(e);!t||Object.keys(t).length===0||Object.entries(t).forEach(([s,n])=>{const i=a.elements[s];i&&(i.type==="checkbox"?i.checked=n===!0||n==="on"||n==="true":i.value=n)})}function yt(a){a.querySelectorAll('input[type="number"]').forEach(n=>{n.addEventListener("blur",()=>{tt(a)})}),a.querySelectorAll("[data-action]").forEach(n=>{n.addEventListener("click",i=>{const{action:o,value:l}=i.currentTarget.dataset,c=l==="true";switch(o){case"triage1":ot(c);break;case"triage2":lt(c);break;case"reset":ct();break;case"goBack":dt();break;case"goHome":ge();break}})}),a.querySelectorAll("form[data-module]").forEach(n=>{n.addEventListener("submit",i=>{ut(i,a)})});const e=a.querySelector("#printResults");e&&e.addEventListener("click",()=>window.print());const t=a.querySelector("#fast_ed_score");t&&(t.addEventListener("click",n=>{n.preventDefault();const i=parseInt(t.value)||0;ft.show(i,o=>{t.value=o.total;const l=a.querySelector("#armparese_hidden");l&&(l.value=o.armWeaknessBoolean?"true":"false");const c=a.querySelector("#eye_deviation_hidden");c&&(c.value=o.eyeDeviationBoolean?"true":"false"),t.dispatchEvent(new Event("change",{bubbles:!0}))})}),t.addEventListener("keydown",n=>{n.preventDefault()})),a.querySelectorAll(".info-toggle").forEach(n=>{n.addEventListener("click",i=>{const o=n.dataset.target,l=a.querySelector(`#${o}`),c=n.querySelector(".toggle-arrow");l&&(l.style.display!=="none"?(l.style.display="none",l.classList.remove("show"),n.classList.remove("active"),c.style.transform="rotate(0deg)"):(l.style.display="block",l.classList.add("show"),n.classList.add("active"),c.style.transform="rotate(180deg)"))})})}class kt{constructor(){this.container=null,this.unsubscribe=null}async init(){if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",()=>this.init());return}if(this.container=document.getElementById("appContainer"),!this.container){console.error("App container not found");return}this.unsubscribe=m.subscribe(()=>{T(this.container),setTimeout(()=>this.initializeResearchMode(),200)}),window.addEventListener("languageChanged",()=>{this.updateUILanguage(),T(this.container)}),this.setupGlobalEventListeners(),this.initializeTheme(),this.initializeResearchMode(),this.updateUILanguage(),this.startAutoSave(),this.setupSessionTimeout(),this.setCurrentYear(),this.registerServiceWorker(),st(),T(this.container),console.log("iGFAP Stroke Triage Assistant initialized")}setupGlobalEventListeners(){const e=document.getElementById("backButton");e&&e.addEventListener("click",()=>{m.goBack(),T(this.container)});const t=document.getElementById("homeButton");t&&t.addEventListener("click",()=>{m.goHome(),T(this.container)});const s=document.getElementById("languageToggle");s&&s.addEventListener("click",()=>this.toggleLanguage());const n=document.getElementById("darkModeToggle");n&&n.addEventListener("click",()=>this.toggleDarkMode());const i=document.getElementById("researchModeToggle");i&&i.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),this.toggleResearchMode()}),this.setupHelpModal(),this.setupFooterLinks(),document.addEventListener("keydown",o=>{if(o.key==="Escape"){const l=document.getElementById("helpModal");l&&l.classList.contains("show")&&(l.classList.remove("show"),l.style.display="none",l.setAttribute("aria-hidden","true"))}}),window.addEventListener("beforeunload",o=>{m.hasUnsavedData()&&(o.preventDefault(),o.returnValue="You have unsaved data. Are you sure you want to leave?")})}setupHelpModal(){const e=document.getElementById("helpButton"),t=document.getElementById("helpModal"),s=t==null?void 0:t.querySelector(".modal-close");if(e&&t){t.classList.remove("show"),t.style.display="none",t.setAttribute("aria-hidden","true"),e.addEventListener("click",()=>{t.style.display="flex",t.classList.add("show"),t.setAttribute("aria-hidden","false")});const n=()=>{t.classList.remove("show"),t.style.display="none",t.setAttribute("aria-hidden","true")};s==null||s.addEventListener("click",n),t.addEventListener("click",i=>{i.target===t&&n()})}}setupFooterLinks(){var e,t;(e=document.getElementById("privacyLink"))==null||e.addEventListener("click",s=>{s.preventDefault(),this.showPrivacyPolicy()}),(t=document.getElementById("disclaimerLink"))==null||t.addEventListener("click",s=>{s.preventDefault(),this.showDisclaimer()})}initializeTheme(){const e=localStorage.getItem("theme"),t=document.getElementById("darkModeToggle");(e==="dark"||!e&&window.matchMedia("(prefers-color-scheme: dark)").matches)&&(document.body.classList.add("dark-mode"),t&&(t.textContent="☀️"))}toggleLanguage(){A.toggleLanguage(),this.updateUILanguage();const e=document.getElementById("languageToggle");if(e){const t=A.getCurrentLanguage();e.textContent=t==="en"?"🇬🇧":"🇩🇪",e.dataset.lang=t}}updateUILanguage(){document.documentElement.lang=A.getCurrentLanguage();const e=document.querySelector(".app-header h1");e&&(e.textContent=r("appTitle"));const t=document.querySelector(".emergency-badge");t&&(t.textContent=r("emergencyBadge"));const s=document.getElementById("languageToggle");s&&(s.title=r("languageToggle"),s.setAttribute("aria-label",r("languageToggle")));const n=document.getElementById("helpButton");n&&(n.title=r("helpButton"),n.setAttribute("aria-label",r("helpButton")));const i=document.getElementById("darkModeToggle");i&&(i.title=r("darkModeButton"),i.setAttribute("aria-label",r("darkModeButton")));const o=document.getElementById("modalTitle");o&&(o.textContent=r("helpTitle"))}toggleDarkMode(){const e=document.getElementById("darkModeToggle");document.body.classList.toggle("dark-mode");const t=document.body.classList.contains("dark-mode");e&&(e.textContent=t?"☀️":"🌙"),localStorage.setItem("theme",t?"dark":"light")}initializeResearchMode(){const e=document.getElementById("researchModeToggle");if(e){const t=this.getCurrentModuleFromResults(),s=t==="limited"||t==="full";e.style.display=s?"flex":"none",e.style.opacity=s?"1":"0.5",console.log(`🔬 Research button visibility: ${s?"VISIBLE":"HIDDEN"} (module: ${t})`)}}getCurrentModuleFromResults(){var s,n;const e=m.getState();if(e.currentScreen!=="results"||!((n=(s=e.results)==null?void 0:s.ich)!=null&&n.module))return null;const t=e.results.ich.module.toLowerCase();return t.includes("coma")?"coma":t.includes("limited")?"limited":t.includes("full")?"full":null}toggleResearchMode(){const e=document.getElementById("researchPanel");if(!e){console.warn("🔬 Research panel not found - likely not on results screen");return}const t=e.style.display!=="none";e.style.display=t?"none":"block";const s=document.getElementById("researchModeToggle");return s&&(s.style.background=t?"rgba(255, 255, 255, 0.1)":"rgba(0, 102, 204, 0.2)"),console.log(`🔬 Research panel ${t?"HIDDEN":"SHOWN"}`),!1}showResearchActivationMessage(){const e=document.createElement("div");e.className="research-activation-toast",e.innerHTML=`
      <div class="toast-content">
        🔬 <strong>Research Mode Activated</strong><br>
        <small>Model comparison features enabled</small>
      </div>
    `,document.body.appendChild(e),setTimeout(()=>{document.body.contains(e)&&document.body.removeChild(e)},3e3)}startAutoSave(){setInterval(()=>{this.saveCurrentFormData()},V.autoSaveInterval)}saveCurrentFormData(){this.container.querySelectorAll("form[data-module]").forEach(t=>{const s=new FormData(t),n=t.dataset.module;if(n){const i={};s.forEach((c,d)=>{const g=t.elements[d];g&&g.type==="checkbox"?i[d]=g.checked:i[d]=c});const o=m.getFormData(n);JSON.stringify(o)!==JSON.stringify(i)&&m.setFormData(n,i)}})}setupSessionTimeout(){setTimeout(()=>{confirm("Your session has been idle for 30 minutes. Would you like to continue?")?this.setupSessionTimeout():m.reset()},V.sessionTimeout)}setCurrentYear(){const e=document.getElementById("currentYear");e&&(e.textContent=new Date().getFullYear())}showPrivacyPolicy(){alert("Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.")}showDisclaimer(){alert("Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.")}async registerServiceWorker(){if(!("serviceWorker"in navigator)){console.log("Service Workers not supported");return}try{const e=await navigator.serviceWorker.register("/0825/sw.js",{scope:"/0825/"});console.log("Service Worker registered successfully:",e),e.addEventListener("updatefound",()=>{const t=e.installing;console.log("New service worker found"),t.addEventListener("statechange",()=>{t.state==="installed"&&navigator.serviceWorker.controller&&(console.log("New service worker installed, update available"),this.showUpdateNotification())})}),navigator.serviceWorker.addEventListener("message",t=>{console.log("Message from service worker:",t.data)})}catch(e){console.error("Service Worker registration failed:",e)}}showUpdateNotification(){const e=document.createElement("div");e.className="modal show update-modal",e.style.cssText=`
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
    `,e.appendChild(t),document.body.appendChild(e);const s=e.querySelector("#updateNow"),n=e.querySelector("#updateLater");s.addEventListener("click",()=>{window.location.reload()}),n.addEventListener("click",()=>{e.remove(),setTimeout(()=>this.showUpdateNotification(),5*60*1e3)}),e.addEventListener("click",i=>{i.target===e&&n.click()})}destroy(){this.unsubscribe&&this.unsubscribe()}}const St=new kt;St.init();
//# sourceMappingURL=index-CXlOopyb.js.map
