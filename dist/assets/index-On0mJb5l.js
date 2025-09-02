var fe=Object.defineProperty;var ve=(a,e,t)=>e in a?fe(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t;var _=(a,e,t)=>ve(a,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(n){if(n.ep)return;n.ep=!0;const s=t(n);fetch(n.href,s)}})();class ye{constructor(){this.state={currentScreen:"triage1",results:null,sessionId:null,startTime:null,formData:{},validationErrors:{},screenHistory:[]},this.listeners=new Set,this.initialize()}initialize(){this.state.sessionId=this.generateSessionId(),this.state.startTime=Date.now(),console.log("Store initialized with session:",this.state.sessionId)}generateSessionId(){return"session_"+Date.now()+"_"+Math.random().toString(36).substr(2,9)}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}notify(){this.listeners.forEach(e=>e(this.state))}getState(){return{...this.state}}setState(e){this.state={...this.state,...e},this.notify()}navigate(e){console.log(`Navigating from ${this.state.currentScreen} to ${e}`);const t=[...this.state.screenHistory];this.state.currentScreen!==e&&!t.includes(this.state.currentScreen)&&t.push(this.state.currentScreen),this.setState({currentScreen:e,screenHistory:t})}goBack(){const e=[...this.state.screenHistory];if(console.log("goBack() - current history:",e),console.log("goBack() - current screen:",this.state.currentScreen),e.length>0){const t=e.pop();return console.log("goBack() - navigating to:",t),this.setState({currentScreen:t,screenHistory:e}),!0}return console.log("goBack() - no history available"),!1}goHome(){this.setState({currentScreen:"triage1",screenHistory:[]})}setFormData(e,t){const i={...this.state.formData};i[e]={...t},this.setState({formData:i})}getFormData(e){return this.state.formData[e]||{}}setValidationErrors(e){this.setState({validationErrors:e})}clearValidationErrors(){this.setState({validationErrors:{}})}setResults(e){this.setState({results:e})}hasUnsavedData(){return Object.keys(this.state.formData).length>0&&!this.state.results}reset(){const e={currentScreen:"triage1",results:null,sessionId:this.generateSessionId(),startTime:Date.now(),formData:{},validationErrors:{},screenHistory:[]};this.setState(e),console.log("Store reset with new session:",e.sessionId)}logEvent(e,t={}){const i={timestamp:Date.now(),session:this.state.sessionId,event:e,data:t};console.log("Event:",i)}getSessionDuration(){return Date.now()-this.state.startTime}}const g=new ye;function E(a){const e=[{id:1,label:"Triage"},{id:2,label:"Assessment"},{id:3,label:"Results"}];let t='<div class="progress-indicator">';return e.forEach((i,n)=>{const s=i.id===a,o=i.id<a;t+=`
      <div class="progress-step ${s?"active":""} ${o?"completed":""}">
        ${o?"":i.id}
      </div>
    `,n<e.length-1&&(t+=`<div class="progress-line ${o?"completed":""}"></div>`)}),t+="</div>",t}const U={en:{appTitle:"iGFAP",emergencyBadge:"Emergency Tool",helpButton:"Help and Instructions",darkModeButton:"Toggle dark mode",languageToggle:"Language",step1:"Initial Assessment",step2:"Data Collection",step3:"Results",comaModuleTitle:"Coma Module",limitedDataModuleTitle:"Limited Data Module",fullStrokeModuleTitle:"Full Stroke Module",triage1Title:"Patient Assessment",triage1Question:"Is the patient comatose?",triage1Help:"Glasgow Coma Scale < 8",triage1Yes:"YES - Comatose",triage1No:"NO - Conscious",triage2Title:"Examination Capability",triage2Question:"Can the patient be reliably examined?",triage2Help:"Patient is not aphasic, confused, or uncooperative",triage2Yes:"YES - Full Exam Possible",triage2No:"NO - Limited Exam Only",ageLabel:"Age (years)",ageHelp:"Patient age in years",systolicLabel:"Systolic BP (mmHg)",systolicHelp:"Systolic blood pressure",diastolicLabel:"Diastolic BP (mmHg)",diastolicHelp:"Diastolic blood pressure",gfapLabel:"GFAP Value (pg/mL)",gfapHelp:"GFAP biomarker level",fastEdLabel:"FAST-ED Score",fastEdHelp:"FAST-ED assessment score (0-9)",headacheLabel:"Headache",vigilanzLabel:"Reduced consciousness",armPareseLabel:"Arm weakness",beinPareseLabel:"Leg weakness",eyeDeviationLabel:"Eye deviation",atrialFibLabel:"Atrial fibrillation",anticoagLabel:"Anticoagulated (NOAK)",antiplateletsLabel:"Antiplatelets",analyzeButton:"Analyze",analyzing:"Analyzing...",printResults:"Print Results",newAssessment:"Start New Assessment",startOver:"Start Over",goBack:"Go Back",goHome:"Go Home",basicInformation:"Basic Information",biomarkersScores:"Biomarkers & Scores",clinicalSymptoms:"Clinical Symptoms",medicalHistory:"Medical History",ageYearsLabel:"Age (years)",systolicBpLabel:"Systolic BP (mmHg)",diastolicBpLabel:"Diastolic BP (mmHg)",gfapValueLabel:"GFAP Value (pg/mL)",fastEdScoreLabel:"FAST-ED Score",ageYearsHelp:"Patient's age in years",systolicBpHelp:"Normal: 90-140 mmHg",diastolicBpHelp:"Normal: 60-90 mmHg",gfapTooltip:"Brain injury biomarker",gfapTooltipLong:"Glial Fibrillary Acidic Protein - Brain injury biomarker",gfapRange:"Range: {min} - {max} pg/mL",fastEdTooltip:"0-9 scale for LVO screening",analyzeIchRisk:"Analyze ICH Risk",analyzeStrokeRisk:"Analyze Stroke Risk",criticalPatient:"Critical Patient",comaAlert:"Patient is comatose (GCS < 8). Rapid assessment required.",vigilanceReduction:"Vigilance Reduction (Decreased alertness)",armParesis:"Arm Paresis",legParesis:"Leg Paresis",eyeDeviation:"Eye Deviation",atrialFibrillation:"Atrial Fibrillation",onNoacDoac:"On NOAC/DOAC",onAntiplatelets:"On Antiplatelets",resultsTitle:"Assessment Results",bleedingRiskAssessment:"Bleeding Risk Assessment",ichProbability:"ICH Probability",lvoProbability:"LVO Probability",lvoMayBePossible:"Large vessel occlusion possible - further evaluation recommended",riskFactorsTitle:"Main Risk Factors",increasingRisk:"Increasing Risk",decreasingRisk:"Decreasing Risk",noFactors:"No factors",riskLevel:"Risk Level",lowRisk:"Low Risk",mediumRisk:"Medium Risk",highRisk:"High Risk",riskLow:"Low",riskMedium:"Medium",riskHigh:"High",riskFactorsAnalysis:"Risk Factors",contributingFactors:"Contributing factors to the assessment",riskFactors:"Risk Factors",increaseRisk:"INCREASE",decreaseRisk:"DECREASE",noPositiveFactors:"No increasing factors",noNegativeFactors:"No decreasing factors",ichRiskFactors:"ICH Risk Factors",lvoRiskFactors:"LVO Risk Factors",criticalAlertTitle:"CRITICAL RISK DETECTED",criticalAlertMessage:"High probability of intracerebral hemorrhage detected.",immediateActionsRequired:"Immediate actions required",initiateStrokeProtocol:"Initiate stroke protocol immediately",urgentCtImaging:"Urgent CT imaging required",considerBpManagement:"Consider blood pressure management",prepareNeurosurgicalConsult:"Prepare for potential neurosurgical consultation",helpTitle:"Quick Reference Guide",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 8: Comatose patient - use Coma Module",gcsMod:"GCS 8-12: Moderate impairment",gcsHigh:"GCS 13-15: Mild impairment",fastEdTitle:"FAST-ED Score Components",fastEdFacial:"Facial Palsy: 0-1 points",fastEdArm:"Arm Weakness: 0-2 points",fastEdSpeech:"Speech Changes: 0-2 points",fastEdTime:"Time: Critical factor",fastEdEye:"Eye Deviation: 0-2 points",fastEdDenial:"Denial/Neglect: 0-2 points",criticalValuesTitle:"Critical Values",criticalBp:"Systolic BP > 180: Increased ICH risk",criticalGfap:"GFAP > 500 pg/mL: Significant marker",criticalFastEd:"FAST-ED ≥ 4: Consider LVO",fastEdCalculatorTitle:"FAST-ED Score Calculator",fastEdCalculatorSubtitle:"Click to calculate FAST-ED score components",facialPalsyTitle:"Facial Palsy",facialPalsyNormal:"Normal (0)",facialPalsyMild:"Mild drooping (1)",armWeaknessTitle:"Arm Weakness",armWeaknessNormal:"Normal (0)",armWeaknessMild:"Mild drift (1)",armWeaknessSevere:"Falls immediately (2)",speechChangesTitle:"Speech Changes",speechChangesNormal:"Normal (0)",speechChangesMild:"Slurred speech (1)",speechChangesSevere:"Severe aphasia (2)",eyeDeviationTitle:"Eye Deviation",eyeDeviationNormal:"Normal (0)",eyeDeviationPartial:"Partial gaze palsy (1)",eyeDeviationForced:"Forced deviation (2)",denialNeglectTitle:"Denial/Neglect",denialNeglectNormal:"Normal (0)",denialNeglectPartial:"Partial neglect (1)",denialNeglectComplete:"Complete neglect (2)",totalScoreTitle:"Total FAST-ED Score",riskLevel:"Risk Level",riskLevelLow:"LOW (Score <4)",riskLevelHigh:"HIGH (Score ≥4 - Consider LVO)",applyScore:"Apply Score",cancel:"Cancel",riskAnalysis:"Risk Analysis",riskAnalysisSubtitle:"Clinical factors in this assessment",contributingFactors:"Contributing factors",factorsShown:"shown",positiveFactors:"Positive factors",negativeFactors:"Negative factors",clinicalInformation:"Clinical Information",clinicalRecommendations:"Clinical Recommendations",clinicalRec1:"Consider immediate imaging if ICH risk is high",clinicalRec2:"Activate stroke team for LVO scores ≥ 50%",clinicalRec3:"Monitor blood pressure closely",clinicalRec4:"Document all findings thoroughly",noDriverData:"No driver data available",driverAnalysisUnavailable:"Driver analysis unavailable",driverInfoNotAvailable:"Driver information not available from this prediction model",driverAnalysisNotAvailable:"Driver analysis not available for this prediction",lvoNotPossible:"LVO assessment not possible with limited data",fullExamRequired:"Full neurological examination required for LVO screening",limitedAssessment:"Limited Assessment",disclaimer:"Clinical Disclaimer",disclaimerText:"This tool is for clinical decision support only. Always use clinical judgment and follow local protocols. Not a replacement for physician assessment.",importantNote:"Important",importantText:"These results are for clinical decision support only. Always use clinical judgment and follow institutional protocols.",predictedMortality:"Predicted 30-day mortality",ichVolumeLabel:"ICH Volume",references:"References",inputSummaryTitle:"Input Summary",inputSummarySubtitle:"Values used for this analysis",privacyLink:"Privacy Policy",disclaimerLink:"Medical Disclaimer",versionLink:"Version 2.1.0 - Research Preview",privacyPolicy:"Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.",medicalDisclaimer:"Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.",networkError:"Network error - please check your connection and try again",requestTimeout:"Request timeout - please try again",apiError:"Failed to get results",validationError:"Please check your input values",sessionTimeout:"Your session has been idle for 30 minutes. Would you like to continue?",unsavedData:"You have unsaved data. Are you sure you want to leave?",nearestCentersTitle:"Nearest Stroke Centers",useCurrentLocation:"Use Current Location",enterLocationPlaceholder:"Enter city or address...",enterManually:"Enter Location Manually",search:"Search",yourLocation:"Your Location",recommendedCenters:"Recommended Centers",alternativeCenters:"Alternative Centers",noCentersFound:"No stroke centers found in this area",gettingLocation:"Getting your location",searchingLocation:"Searching location",locationError:"Unable to get your location",locationPermissionDenied:"Location access denied. Please allow location access and try again.",locationUnavailable:"Location information is unavailable",locationTimeout:"Location request timed out",geolocationNotSupported:"Geolocation is not supported by this browser",geocodingNotImplemented:"Location search not available. Please use GPS or enter coordinates manually.",tryManualEntry:"Try entering your location manually or use GPS.",distanceNote:"Distances are calculated as straight-line distances. Actual travel times may vary.",travelTimeNote:"Travel times calculated for emergency vehicles with sirens and priority routing.",calculatingTravelTimes:"Calculating travel times",minutes:"min",poweredByOrs:"Travel times powered by OpenRoute Service",comprehensiveCenter:"Comprehensive Stroke Center",primaryCenter:"Primary Stroke Center",telemetryCenter:"Telemedicine Center",thrombectomy:"Thrombectomy",neurosurgery:"Neurosurgery",icu:"Intensive Care",telemedicine:"Telemedicine",stroke_unit:"Stroke Unit",call:"Call",directions:"Directions",emergency:"Emergency",certified:"Certified",prerequisitesTitle:"Prerequisites for Stroke Triage",prerequisitesIntro:"Please confirm that all of the following prerequisites are met:",prerequisitesWarning:"All prerequisites must be met to continue",continue:"Continue",acute_deficit:"Acute (severe) neurological deficit present",symptom_onset:"Symptom onset within 6 hours",no_preexisting:"No pre-existing severe neurological deficits",no_trauma:"No traumatic brain injury present"},de:{appTitle:"iGFAP",emergencyBadge:"Notfall-Tool",helpButton:"Hilfe und Anweisungen",darkModeButton:"Dunklen Modus umschalten",languageToggle:"Sprache",step1:"Erstbeurteilung",step2:"Datenerhebung",step3:"Ergebnisse",comaModuleTitle:"Koma-Modul",limitedDataModuleTitle:"Begrenzte Daten Modul",fullStrokeModuleTitle:"Vollständiges Schlaganfall-Modul",triage1Title:"Patientenbeurteilung",triage1Question:"Ist der Patient komatös?",triage1Help:"Glasgow Coma Scale < 8",triage1Yes:"JA - Komatös",triage1No:"NEIN - Bei Bewusstsein",triage2Title:"Untersuchungsfähigkeit",triage2Question:"Kann der Patient zuverlässig untersucht werden?",triage2Help:"Patient ist nicht aphasisch, verwirrt oder unkooperativ",triage2Yes:"JA - Vollständige Untersuchung möglich",triage2No:"NEIN - Nur begrenzte Untersuchung",ageLabel:"Alter (Jahre)",ageHelp:"Patientenalter in Jahren",systolicLabel:"Systolischer RR (mmHg)",systolicHelp:"Systolischer Blutdruck",diastolicLabel:"Diastolischer RR (mmHg)",diastolicHelp:"Diastolischer Blutdruck",gfapLabel:"GFAP-Wert (pg/mL)",gfapHelp:"GFAP-Biomarker-Wert",fastEdLabel:"FAST-ED-Score",fastEdHelp:"FAST-ED-Bewertungsscore (0-9)",headacheLabel:"Kopfschmerzen",vigilanzLabel:"Bewusstseinstrübung",armPareseLabel:"Armschwäche",beinPareseLabel:"Beinschwäche",eyeDeviationLabel:"Blickdeviation",atrialFibLabel:"Vorhofflimmern",anticoagLabel:"Antikoaguliert (NOAK)",antiplateletsLabel:"Thrombozytenaggregationshemmer",analyzeButton:"Analysieren",analyzing:"Analysiere...",printResults:"Ergebnisse drucken",newAssessment:"Neue Bewertung starten",startOver:"Von vorn beginnen",goBack:"Zurück",goHome:"Zur Startseite",basicInformation:"Grundinformationen",biomarkersScores:"Biomarker & Scores",clinicalSymptoms:"Klinische Symptome",medicalHistory:"Anamnese",ageYearsLabel:"Alter (Jahre)",systolicBpLabel:"Systolischer RR (mmHg)",diastolicBpLabel:"Diastolischer RR (mmHg)",gfapValueLabel:"GFAP-Wert (pg/mL)",fastEdScoreLabel:"FAST-ED-Score",ageYearsHelp:"Patientenalter in Jahren",systolicBpHelp:"Normal: 90-140 mmHg",diastolicBpHelp:"Normal: 60-90 mmHg",gfapTooltip:"Hirnverletzungs-Biomarker",gfapTooltipLong:"Glial Fibrillary Acidic Protein - Hirnverletzungs-Biomarker",gfapRange:"Bereich: {min} - {max} pg/mL",fastEdTooltip:"0-9 Skala für LVO-Screening",analyzeIchRisk:"ICB-Risiko analysieren",analyzeStrokeRisk:"Schlaganfall-Risiko analysieren",criticalPatient:"Kritischer Patient",comaAlert:"Patient ist komatös (GCS < 8). Schnelle Beurteilung erforderlich.",vigilanceReduction:"Vigilanzminderung (Verminderte Wachheit)",armParesis:"Armparese",legParesis:"Beinparese",eyeDeviation:"Blickdeviation",atrialFibrillation:"Vorhofflimmern",onNoacDoac:"NOAK/DOAK-Therapie",onAntiplatelets:"Thrombozytenaggregationshemmer",resultsTitle:"Bewertungsergebnisse",bleedingRiskAssessment:"Blutungsrisiko-Bewertung",ichProbability:"ICB-Wahrscheinlichkeit",lvoProbability:"LVO-Wahrscheinlichkeit",lvoMayBePossible:"Großgefäßverschluss möglich - weitere Abklärung empfohlen",riskFactorsTitle:"Hauptrisikofaktoren",increasingRisk:"Risikoerhöhend",decreasingRisk:"Risikomindernd",noFactors:"Keine Faktoren",riskLevel:"Risikostufe",lowRisk:"Niedriges Risiko",mediumRisk:"Mittleres Risiko",highRisk:"Hohes Risiko",riskLow:"Niedrig",riskMedium:"Mittel",riskHigh:"Hoch",riskFactorsAnalysis:"Risikofaktoren",contributingFactors:"Beitragende Faktoren zur Bewertung",riskFactors:"Risikofaktoren",increaseRisk:"ERHÖHEN",decreaseRisk:"VERRINGERN",noPositiveFactors:"Keine erhöhenden Faktoren",noNegativeFactors:"Keine verringernden Faktoren",ichRiskFactors:"ICB-Risikofaktoren",lvoRiskFactors:"LVO-Risikofaktoren",criticalAlertTitle:"KRITISCHES RISIKO ERKANNT",criticalAlertMessage:"Hohe Wahrscheinlichkeit einer intrazerebralen Blutung erkannt.",immediateActionsRequired:"Sofortige Maßnahmen erforderlich",initiateStrokeProtocol:"Schlaganfall-Protokoll sofort einleiten",urgentCtImaging:"Dringende CT-Bildgebung erforderlich",considerBpManagement:"Blutdruckmanagement erwägen",prepareNeurosurgicalConsult:"Neurochirurgische Konsultation vorbereiten",helpTitle:"Kurzreferenzleitfaden",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 8: Komatöser Patient - Koma-Modul verwenden",gcsMod:"GCS 8-12: Mäßige Beeinträchtigung",gcsHigh:"GCS 13-15: Leichte Beeinträchtigung",fastEdTitle:"FAST-ED-Score-Komponenten",fastEdFacial:"Faziale Parese: 0-1 Punkte",fastEdArm:"Armschwäche: 0-2 Punkte",fastEdSpeech:"Sprachveränderungen: 0-2 Punkte",fastEdTime:"Zeit: Kritischer Faktor",fastEdEye:"Blickdeviation: 0-2 Punkte",fastEdDenial:"Verneinung/Neglect: 0-2 Punkte",criticalValuesTitle:"Kritische Werte",criticalBp:"Systolischer RR > 180: Erhöhtes ICB-Risiko",criticalGfap:"GFAP > 500 pg/mL: Signifikanter Marker",criticalFastEd:"FAST-ED ≥ 4: LVO in Betracht ziehen",fastEdCalculatorTitle:"FAST-ED-Score-Rechner",fastEdCalculatorSubtitle:"Klicken Sie, um FAST-ED-Score-Komponenten zu berechnen",facialPalsyTitle:"Fazialisparese",facialPalsyNormal:"Nein (0)",facialPalsyMild:"Ja (1)",armWeaknessTitle:"Armschwäche",armWeaknessNormal:"Normal (0)",armWeaknessMild:"Leichter Armabfall (1)",armWeaknessSevere:"Arm fällt sofort ab (2)",speechChangesTitle:"Sprachveränderungen",speechChangesNormal:"Normal (0)",speechChangesMild:"Verwaschene Sprache (1)",speechChangesSevere:"Schwere Aphasie (2)",eyeDeviationTitle:"Blickdeviation",eyeDeviationNormal:"Normal (0)",eyeDeviationPartial:"Partielle Blickparese (1)",eyeDeviationForced:"Forcierte Blickdeviation (2)",denialNeglectTitle:"Verneinung/Neglect",denialNeglectNormal:"Normal (0)",denialNeglectPartial:"Partieller Neglect (1)",denialNeglectComplete:"Kompletter Neglect (2)",totalScoreTitle:"Gesamt-FAST-ED-Score",riskLevel:"Risikostufe",riskLevelLow:"NIEDRIG (Score <4)",riskLevelHigh:"HOCH (Score ≥4 - LVO erwägen)",applyScore:"Score Anwenden",cancel:"Abbrechen",riskAnalysis:"Risikoanalyse",riskAnalysisSubtitle:"Klinische Faktoren in dieser Bewertung",contributingFactors:"Beitragende Faktoren",factorsShown:"angezeigt",positiveFactors:"Positive Faktoren",negativeFactors:"Negative Faktoren",clinicalInformation:"Klinische Informationen",clinicalRecommendations:"Klinische Empfehlungen",clinicalRec1:"Sofortige Bildgebung erwägen bei hohem ICB-Risiko",clinicalRec2:"Stroke-Team aktivieren bei LVO-Score ≥ 50%",clinicalRec3:"Blutdruck engmaschig überwachen",clinicalRec4:"Alle Befunde gründlich dokumentieren",noDriverData:"Keine Treiberdaten verfügbar",driverAnalysisUnavailable:"Treiberanalyse nicht verfügbar",driverInfoNotAvailable:"Treiberinformationen von diesem Vorhersagemodell nicht verfügbar",driverAnalysisNotAvailable:"Treiberanalyse für diese Vorhersage nicht verfügbar",lvoNotPossible:"LVO-Bewertung mit begrenzten Daten nicht möglich",fullExamRequired:"Vollständige neurologische Untersuchung für LVO-Screening erforderlich",limitedAssessment:"Begrenzte Bewertung",disclaimer:"Klinischer Haftungsausschluss",disclaimerText:"Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle. Kein Ersatz für ärztliche Beurteilung.",importantNote:"Wichtig",importantText:"Diese Ergebnisse dienen nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie institutionelle Protokolle.",predictedMortality:"Vorhergesagte 30-Tage-Mortalität",ichVolumeLabel:"ICB-Volumen",references:"Referenzen",inputSummaryTitle:"Eingabezusammenfassung",inputSummarySubtitle:"Für diese Analyse verwendete Werte",privacyLink:"Datenschutzrichtlinie",disclaimerLink:"Medizinischer Haftungsausschluss",versionLink:"Version 2.1.0 - Research Preview",privacyPolicy:"Datenschutzrichtlinie: Dieses Tool verarbeitet Daten lokal. Keine Patientendaten werden gespeichert oder übertragen.",medicalDisclaimer:"Medizinischer Haftungsausschluss: Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle.",networkError:"Netzwerkfehler - bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut",requestTimeout:"Anfrage-Timeout - bitte versuchen Sie es erneut",apiError:"Ergebnisse konnten nicht abgerufen werden",validationError:"Bitte überprüfen Sie Ihre Eingabewerte",sessionTimeout:"Ihre Sitzung war 30 Minuten lang inaktiv. Möchten Sie fortfahren?",unsavedData:"Sie haben ungespeicherte Daten. Sind Sie sicher, dass Sie verlassen möchten?",nearestCentersTitle:"Nächstgelegene Schlaganfall-Zentren",useCurrentLocation:"Aktuellen Standort verwenden",enterLocationPlaceholder:"Stadt oder Adresse eingeben...",enterManually:"Standort manuell eingeben",search:"Suchen",yourLocation:"Ihr Standort",recommendedCenters:"Empfohlene Zentren",alternativeCenters:"Alternative Zentren",noCentersFound:"Keine Schlaganfall-Zentren in diesem Bereich gefunden",gettingLocation:"Standort wird ermittelt",searchingLocation:"Standort wird gesucht",locationError:"Standort konnte nicht ermittelt werden",locationPermissionDenied:"Standortzugriff verweigert. Bitte erlauben Sie Standortzugriff und versuchen Sie es erneut.",locationUnavailable:"Standortinformationen sind nicht verfügbar",locationTimeout:"Standortanfrage ist abgelaufen",geolocationNotSupported:"Geolokalisierung wird von diesem Browser nicht unterstützt",geocodingNotImplemented:"Standortsuche nicht verfügbar. Bitte verwenden Sie GPS oder geben Sie Koordinaten manuell ein.",tryManualEntry:"Versuchen Sie, Ihren Standort manuell einzugeben oder GPS zu verwenden.",distanceNote:"Entfernungen werden als Luftlinie berechnet. Tatsächliche Fahrzeiten können variieren.",travelTimeNote:"Fahrzeiten berechnet für Rettungsfahrzeuge mit Sondersignalen und Vorfahrtsberechtigung.",calculatingTravelTimes:"Fahrzeiten werden berechnet",minutes:"Min",poweredByOrs:"Fahrzeiten bereitgestellt von OpenRoute Service",comprehensiveCenter:"Überregionales Schlaganfall-Zentrum",primaryCenter:"Regionales Schlaganfall-Zentrum",telemetryCenter:"Telemedizin-Zentrum",thrombectomy:"Thrombektomie",neurosurgery:"Neurochirurgie",icu:"Intensivstation",telemedicine:"Telemedizin",stroke_unit:"Stroke Unit",call:"Anrufen",directions:"Wegbeschreibung",emergency:"Notfall",certified:"Zertifiziert",prerequisitesTitle:"Voraussetzungen für Schlaganfall-Triage",prerequisitesIntro:"Bitte bestätigen Sie, dass alle folgenden Voraussetzungen erfüllt sind:",prerequisitesWarning:"Alle Voraussetzungen müssen erfüllt sein, um fortzufahren",continue:"Weiter",acute_deficit:"Akutes (schweres) neurologisches Defizit vorhanden",symptom_onset:"Symptombeginn innerhalb 6h",no_preexisting:"Keine vorbestehende schwere neurologische Defizite",no_trauma:"Kein Schädelhirntrauma vorhanden"}};class ke{constructor(){this.supportedLanguages=["en","de"],this.currentLanguage=this.detectLanguage()}detectLanguage(){const e=localStorage.getItem("language");return e&&this.supportedLanguages.includes(e)?e:(navigator.language||navigator.userLanguage).substring(0,2).toLowerCase()==="de"?"de":"en"}getCurrentLanguage(){return this.currentLanguage}setLanguage(e){return this.supportedLanguages.includes(e)?(this.currentLanguage=e,localStorage.setItem("language",e),window.dispatchEvent(new CustomEvent("languageChanged",{detail:{language:e}})),!0):!1}getSupportedLanguages(){return[...this.supportedLanguages]}t(e){return(U[this.currentLanguage]||U.en)[e]||e}toggleLanguage(){const e=this.currentLanguage==="en"?"de":"en";return this.setLanguage(e)}getLanguageDisplayName(e=null){const t=e||this.currentLanguage;return{en:"English",de:"Deutsch"}[t]||t}formatDateTime(e){const t=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(t,{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(e)}formatTime(e){const t=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(t,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(e)}}const A=new ke,r=a=>A.t(a);function W(){return`
    <div class="container">
      ${E(1)}
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
  `}function Se(){return`
    <div class="container">
      ${E(1)}
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
  `}const w={COMA_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_coma_ich",LDM_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_limited_data_ich",FULL_STROKE:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_full_stroke"},te={ich:{medium:25,high:50},lvo:{medium:25,high:50}},y={min:29,max:10001},V={autoSaveInterval:18e4,sessionTimeout:30*60*1e3,requestTimeout:1e4},we={age_years:{required:!0,min:0,max:120},systolic_bp:{required:!0,min:60,max:300},diastolic_bp:{required:!0,min:30,max:200},gfap_value:{required:!0,min:y.min,max:y.max},fast_ed_score:{required:!0,min:0,max:9}};function Le(){return`
    <div class="container">
      ${E(2)}
      <h2>${r("comaModuleTitle")||"Coma Module"}</h2>
      <form data-module="coma">
        <div class="input-grid">
          <div class="input-group">
            <label for="gfap_value">
              ${r("gfapValueLabel")}
              <span class="tooltip">ℹ️
                <span class="tooltiptext">${r("gfapTooltipLong")}</span>
              </span>
            </label>
            <input type="number" id="gfap_value" name="gfap_value" min="${y.min}" max="${y.max}" step="0.1" required aria-describedby="gfap-help">
            <div id="gfap-help" class="input-help">
              ${r("gfapRange").replace("{min}",y.min).replace("{max}",y.max)}
            </div>
          </div>
        </div>
        <button type="submit" class="primary">${r("analyzeIchRisk")}</button>
        <button type="button" class="secondary" data-action="reset">${r("startOver")}</button>
      </form>
    </div>
  `}function Ee(){return`
    <div class="container">
      ${E(2)}
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
            <input type="number" name="gfap_value" id="gfap_value" min="${y.min}" max="${y.max}" step="0.1" required>
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
  `}function Te(){return`
    <div class="container">
      ${E(2)}
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
            <input type="number" name="gfap_value" id="gfap_value" min="${y.min}" max="${y.max}" step="0.1" required>
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
  `}const Ae={age_years:"ageLabel",age:"ageLabel",systolic_bp:"systolicLabel",diastolic_bp:"diastolicLabel",systolic_blood_pressure:"systolicLabel",diastolic_blood_pressure:"diastolicLabel",blood_pressure_systolic:"systolicLabel",blood_pressure_diastolic:"diastolicLabel",gfap_value:"gfapLabel",gfap:"gfapLabel",gfap_level:"gfapLabel",fast_ed_score:"fastEdLabel",fast_ed:"fastEdLabel",fast_ed_total:"fastEdLabel",vigilanzminderung:"vigilanzLabel",vigilance_reduction:"vigilanzLabel",reduced_consciousness:"vigilanzLabel",armparese:"armPareseLabel",arm_paresis:"armPareseLabel",arm_weakness:"armPareseLabel",beinparese:"beinPareseLabel",leg_paresis:"beinPareseLabel",leg_weakness:"beinPareseLabel",eye_deviation:"eyeDeviationLabel",blickdeviation:"eyeDeviationLabel",headache:"headacheLabel",kopfschmerzen:"headacheLabel",atrial_fibrillation:"atrialFibLabel",vorhofflimmern:"atrialFibLabel",anticoagulated_noak:"anticoagLabel",anticoagulation:"anticoagLabel",antiplatelets:"antiplateletsLabel",thrombozytenaggregationshemmer:"antiplateletsLabel"},Ce=[{pattern:/_score$/,replacement:" Score"},{pattern:/_value$/,replacement:" Level"},{pattern:/_bp$/,replacement:" Blood Pressure"},{pattern:/_years?$/,replacement:" (years)"},{pattern:/^ich_/,replacement:"Brain Bleeding "},{pattern:/^lvo_/,replacement:"Large Vessel "},{pattern:/parese$/,replacement:"Weakness"},{pattern:/deviation$/,replacement:"Movement"}];function ie(a){if(!a)return"";const e=Ae[a.toLowerCase()];if(e){const i=r(e);if(i&&i!==e)return i}let t=a.toLowerCase();return Ce.forEach(({pattern:i,replacement:n})=>{t=t.replace(i,n)}),t=t.replace(/_/g," ").replace(/\b\w/g,i=>i.toUpperCase()).trim(),t}function Me(a){return ie(a).replace(/\s*\([^)]*\)\s*/g,"").trim()}function $e(a,e=""){return a==null||a===""?"":typeof a=="boolean"?a?"✓":"✗":typeof a=="number"?e.includes("bp")||e.includes("blood_pressure")?`${a} mmHg`:e.includes("gfap")?`${a} pg/mL`:e.includes("age")?`${a} years`:e.includes("score")||Number.isInteger(a)?a.toString():a.toFixed(1):a.toString()}const se={bayern:{neurosurgicalCenters:[{id:"BY-NS-001",name:"LMU Klinikum München - Großhadern",address:"Marchioninistraße 15, 81377 München",coordinates:{lat:48.1106,lng:11.4684},phone:"+49 89 4400-0",emergency:"+49 89 4400-73331",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1440,network:"TEMPiS"},{id:"BY-NS-002",name:"Klinikum rechts der Isar München (TUM)",address:"Ismaninger Str. 22, 81675 München",coordinates:{lat:48.1497,lng:11.6052},phone:"+49 89 4140-0",emergency:"+49 89 4140-2249",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1161,network:"TEMPiS"},{id:"BY-NS-003",name:"Städtisches Klinikum München Schwabing",address:"Kölner Platz 1, 80804 München",coordinates:{lat:48.1732,lng:11.5755},phone:"+49 89 3068-0",emergency:"+49 89 3068-2050",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:648,network:"TEMPiS"},{id:"BY-NS-004",name:"Städtisches Klinikum München Bogenhausen",address:"Englschalkinger Str. 77, 81925 München",coordinates:{lat:48.1614,lng:11.6254},phone:"+49 89 9270-0",emergency:"+49 89 9270-2050",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:689,network:"TEMPiS"},{id:"BY-NS-005",name:"Universitätsklinikum Erlangen",address:"Maximiliansplatz 2, 91054 Erlangen",coordinates:{lat:49.5982,lng:11.0037},phone:"+49 9131 85-0",emergency:"+49 9131 85-39003",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1371,network:"TEMPiS"},{id:"BY-NS-006",name:"Universitätsklinikum Regensburg",address:"Franz-Josef-Strauß-Allee 11, 93053 Regensburg",coordinates:{lat:49.0134,lng:12.0991},phone:"+49 941 944-0",emergency:"+49 941 944-7501",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1042,network:"TEMPiS"},{id:"BY-NS-007",name:"Universitätsklinikum Würzburg",address:"Oberdürrbacher Str. 6, 97080 Würzburg",coordinates:{lat:49.784,lng:9.9721},phone:"+49 931 201-0",emergency:"+49 931 201-24444",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1264,network:"TEMPiS"},{id:"BY-NS-008",name:"Klinikum Nürnberg Nord",address:"Prof.-Ernst-Nathan-Str. 1, 90419 Nürnberg",coordinates:{lat:49.4521,lng:11.0767},phone:"+49 911 398-0",emergency:"+49 911 398-2369",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1368,network:"TEMPiS"},{id:"BY-NS-009",name:"Universitätsklinikum Augsburg",address:"Stenglinstr. 2, 86156 Augsburg",coordinates:{lat:48.3668,lng:10.9093},phone:"+49 821 400-01",emergency:"+49 821 400-2356",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1740,network:"TEMPiS"},{id:"BY-NS-010",name:"Klinikum Aschaffenburg-Alzenau",address:"Am Hasenkopf 1, 63739 Aschaffenburg",coordinates:{lat:49.9737,lng:9.157},phone:"+49 6021 32-0",emergency:"+49 6021 32-2800",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:40,network:"TRANSIT"},{id:"BY-NS-011",name:"Klinikum Landshut",address:"Robert-Koch-Str. 1, 84034 Landshut",coordinates:{lat:48.5665,lng:12.1512},phone:"+49 871 698-0",emergency:"+49 871 698-3333",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:505,network:"TEMPiS"},{id:"BY-NS-012",name:"Klinikum Coburg",address:"Ketschendorfer Str. 33, 96450 Coburg",coordinates:{lat:50.2596,lng:10.9644},phone:"+49 9561 22-0",emergency:"+49 9561 22-6800",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:547,network:"STENO"},{id:"BY-NS-013",name:"Klinikum Passau",address:"Bischof-Pilgrim-Str. 1, 94032 Passau",coordinates:{lat:48.5665,lng:13.4777},phone:"+49 851 5300-0",emergency:"+49 851 5300-2222",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:696,network:"TEMPiS"}],comprehensiveStrokeCenters:[{id:"BY-CS-001",name:"Klinikum Bamberg",address:"Buger Str. 80, 96049 Bamberg",coordinates:{lat:49.8988,lng:10.9027},phone:"+49 951 503-0",emergency:"+49 951 503-11101",thrombectomy:!0,thrombolysis:!0,beds:630,network:"TEMPiS"},{id:"BY-CS-002",name:"Klinikum Bayreuth",address:"Preuschwitzer Str. 101, 95445 Bayreuth",coordinates:{lat:49.9459,lng:11.5779},phone:"+49 921 400-0",emergency:"+49 921 400-5401",thrombectomy:!0,thrombolysis:!0,beds:848,network:"TEMPiS"},{id:"BY-CS-003",name:"Klinikum Coburg",address:"Ketschendorfer Str. 33, 96450 Coburg",coordinates:{lat:50.2596,lng:10.9685},phone:"+49 9561 22-0",emergency:"+49 9561 22-6300",thrombectomy:!0,thrombolysis:!0,beds:522,network:"TEMPiS"}],regionalStrokeUnits:[{id:"BY-RSU-001",name:"Goldberg-Klinik Kelheim",address:"Traubenweg 3, 93309 Kelheim",coordinates:{lat:48.9166,lng:11.8742},phone:"+49 9441 702-0",emergency:"+49 9441 702-6800",thrombolysis:!0,beds:200,network:"TEMPiS"},{id:"BY-RSU-002",name:"DONAUISAR Klinikum Deggendorf",address:"Perlasberger Str. 41, 94469 Deggendorf",coordinates:{lat:48.8372,lng:12.9619},phone:"+49 991 380-0",emergency:"+49 991 380-2201",thrombolysis:!0,beds:450,network:"TEMPiS"},{id:"BY-RSU-003",name:"Klinikum St. Elisabeth Straubing",address:"St.-Elisabeth-Str. 23, 94315 Straubing",coordinates:{lat:48.8742,lng:12.5733},phone:"+49 9421 710-0",emergency:"+49 9421 710-2000",thrombolysis:!0,beds:580,network:"TEMPiS"},{id:"BY-RSU-004",name:"Klinikum Freising",address:"Mainburger Str. 29, 85356 Freising",coordinates:{lat:48.4142,lng:11.7461},phone:"+49 8161 24-0",emergency:"+49 8161 24-2800",thrombolysis:!0,beds:380,network:"TEMPiS"},{id:"BY-RSU-005",name:"Klinikum Landkreis Erding",address:"Bajuwarenstr. 5, 85435 Erding",coordinates:{lat:48.3061,lng:11.9067},phone:"+49 8122 59-0",emergency:"+49 8122 59-2201",thrombolysis:!0,beds:350,network:"TEMPiS"},{id:"BY-RSU-006",name:"Helios Amper-Klinikum Dachau",address:"Krankenhausstr. 15, 85221 Dachau",coordinates:{lat:48.2599,lng:11.4342},phone:"+49 8131 76-0",emergency:"+49 8131 76-2201",thrombolysis:!0,beds:480,network:"TEMPiS"},{id:"BY-RSU-007",name:"Klinikum Fürstenfeldbruck",address:"Dachauer Str. 33, 82256 Fürstenfeldbruck",coordinates:{lat:48.1772,lng:11.2578},phone:"+49 8141 99-0",emergency:"+49 8141 99-2201",thrombolysis:!0,beds:420,network:"TEMPiS"},{id:"BY-RSU-008",name:"Klinikum Ingolstadt",address:"Krumenauerstraße 25, 85049 Ingolstadt",coordinates:{lat:48.7665,lng:11.4364},phone:"+49 841 880-0",emergency:"+49 841 880-2201",thrombolysis:!0,beds:665,network:"TEMPiS"},{id:"BY-RSU-009",name:"Klinikum Passau",address:"Bischof-Pilgrim-Str. 1, 94032 Passau",coordinates:{lat:48.5665,lng:13.4513},phone:"+49 851 5300-0",emergency:"+49 851 5300-2100",thrombolysis:!0,beds:540,network:"TEMPiS"},{id:"BY-RSU-010",name:"Klinikum Landshut",address:"Robert-Koch-Str. 1, 84034 Landshut",coordinates:{lat:48.5436,lng:12.1619},phone:"+49 871 698-0",emergency:"+49 871 698-3333",thrombolysis:!0,beds:790,network:"TEMPiS"},{id:"BY-RSU-011",name:"RoMed Klinikum Rosenheim",address:"Pettenkoferstr. 10, 83022 Rosenheim",coordinates:{lat:47.8567,lng:12.1265},phone:"+49 8031 365-0",emergency:"+49 8031 365-3711",thrombolysis:!0,beds:870,network:"TEMPiS"},{id:"BY-RSU-012",name:"Klinikum Memmingen",address:"Bismarckstr. 23, 87700 Memmingen",coordinates:{lat:47.9833,lng:10.1833},phone:"+49 8331 70-0",emergency:"+49 8331 70-2500",thrombolysis:!0,beds:520,network:"TEMPiS"},{id:"BY-RSU-013",name:"Klinikum Kempten-Oberallgäu",address:"Robert-Weixler-Str. 50, 87439 Kempten",coordinates:{lat:47.7261,lng:10.3097},phone:"+49 831 530-0",emergency:"+49 831 530-2201",thrombolysis:!0,beds:650,network:"TEMPiS"},{id:"BY-RSU-014",name:"Klinikum Aschaffenburg-Alzenau",address:"Am Hasenkopf 1, 63739 Aschaffenburg",coordinates:{lat:49.9747,lng:9.1581},phone:"+49 6021 32-0",emergency:"+49 6021 32-2700",thrombolysis:!0,beds:590,network:"TEMPiS"}],thrombolysisHospitals:[{id:"BY-TH-001",name:"Krankenhaus Vilsbiburg",address:"Sonnenstraße 10, 84137 Vilsbiburg",coordinates:{lat:48.6333,lng:12.2833},phone:"+49 8741 60-0",thrombolysis:!0,beds:180},{id:"BY-TH-002",name:"Krankenhaus Eggenfelden",address:"Pfarrkirchener Str. 5, 84307 Eggenfelden",coordinates:{lat:48.4,lng:12.7667},phone:"+49 8721 98-0",thrombolysis:!0,beds:220}]},badenWuerttemberg:{neurosurgicalCenters:[{id:"BW-NS-001",name:"Universitätsklinikum Freiburg",address:"Hugstetter Str. 55, 79106 Freiburg",coordinates:{lat:48.0025,lng:7.8347},phone:"+49 761 270-0",emergency:"+49 761 270-34010",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1600,network:"FAST"},{id:"BW-NS-002",name:"Universitätsklinikum Heidelberg",address:"Im Neuenheimer Feld 400, 69120 Heidelberg",coordinates:{lat:49.4178,lng:8.6706},phone:"+49 6221 56-0",emergency:"+49 6221 56-36643",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1621,network:"FAST"},{id:"BW-NS-003",name:"Universitätsklinikum Tübingen",address:"Geissweg 3, 72076 Tübingen",coordinates:{lat:48.5378,lng:9.0538},phone:"+49 7071 29-0",emergency:"+49 7071 29-82211",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1550,network:"FAST"},{id:"BW-NS-004",name:"Universitätsklinikum Ulm",address:"Albert-Einstein-Allee 23, 89081 Ulm",coordinates:{lat:48.4196,lng:9.9592},phone:"+49 731 500-0",emergency:"+49 731 500-63001",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1264,network:"FAST"},{id:"BW-NS-005",name:"Klinikum Stuttgart - Katharinenhospital",address:"Kriegsbergstraße 60, 70174 Stuttgart",coordinates:{lat:48.7784,lng:9.1682},phone:"+49 711 278-0",emergency:"+49 711 278-32001",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:950,network:"FAST"},{id:"BW-NS-006",name:"Städtisches Klinikum Karlsruhe",address:"Moltkestraße 90, 76133 Karlsruhe",coordinates:{lat:49.0047,lng:8.3858},phone:"+49 721 974-0",emergency:"+49 721 974-2301",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1570,network:"FAST"},{id:"BW-NS-007",name:"Klinikum Ludwigsburg",address:"Posilipostraße 4, 71640 Ludwigsburg",coordinates:{lat:48.8901,lng:9.1953},phone:"+49 7141 99-0",emergency:"+49 7141 99-67201",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:720,network:"FAST"}],comprehensiveStrokeCenters:[{id:"BW-CS-001",name:"Universitätsmedizin Mannheim",address:"Theodor-Kutzer-Ufer 1-3, 68167 Mannheim",coordinates:{lat:49.4828,lng:8.4664},phone:"+49 621 383-0",emergency:"+49 621 383-2251",thrombectomy:!0,thrombolysis:!0,beds:1400,network:"FAST"}],regionalStrokeUnits:[{id:"BW-RSU-001",name:"Robert-Bosch-Krankenhaus Stuttgart",address:"Auerbachstraße 110, 70376 Stuttgart",coordinates:{lat:48.7447,lng:9.2294},phone:"+49 711 8101-0",emergency:"+49 711 8101-3456",thrombolysis:!0,beds:850,network:"FAST"}],thrombolysisHospitals:[]},nordrheinWestfalen:{neurosurgicalCenters:[{id:"NRW-NS-001",name:"Universitätsklinikum Düsseldorf",address:"Moorenstraße 5, 40225 Düsseldorf",coordinates:{lat:51.1906,lng:6.8064},phone:"+49 211 81-0",emergency:"+49 211 81-17700",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1300,network:"NEVANO+"},{id:"NRW-NS-002",name:"Universitätsklinikum Köln",address:"Kerpener Str. 62, 50937 Köln",coordinates:{lat:50.9253,lng:6.9187},phone:"+49 221 478-0",emergency:"+49 221 478-32500",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1500,network:"NEVANO+"},{id:"NRW-NS-003",name:"Universitätsklinikum Essen",address:"Hufelandstraße 55, 45147 Essen",coordinates:{lat:51.4285,lng:7.0073},phone:"+49 201 723-0",emergency:"+49 201 723-84444",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1350,network:"NEVANO+"},{id:"NRW-NS-004",name:"Universitätsklinikum Münster",address:"Albert-Schweitzer-Campus 1, 48149 Münster",coordinates:{lat:51.9607,lng:7.6261},phone:"+49 251 83-0",emergency:"+49 251 83-47255",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1513,network:"NEVANO+"},{id:"NRW-NS-005",name:"Universitätsklinikum Bonn",address:"Venusberg-Campus 1, 53127 Bonn",coordinates:{lat:50.6916,lng:7.1127},phone:"+49 228 287-0",emergency:"+49 228 287-15107",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1200,network:"NEVANO+"},{id:"NRW-NS-006",name:"Klinikum Dortmund",address:"Beurhausstraße 40, 44137 Dortmund",coordinates:{lat:51.5036,lng:7.4663},phone:"+49 231 953-0",emergency:"+49 231 953-20050",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1200,network:"NVNR"},{id:"NRW-NS-007",name:"Rhein-Maas Klinikum Würselen",address:"Mauerfeldstraße 25, 52146 Würselen",coordinates:{lat:50.8178,lng:6.1264},phone:"+49 2405 62-0",emergency:"+49 2405 62-2222",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:420,network:"NEVANO+"}],comprehensiveStrokeCenters:[{id:"NRW-CS-001",name:"Universitätsklinikum Aachen",address:"Pauwelsstraße 30, 52074 Aachen",coordinates:{lat:50.778,lng:6.0614},phone:"+49 241 80-0",emergency:"+49 241 80-89611",thrombectomy:!0,thrombolysis:!0,beds:1400,network:"NEVANO+"}],regionalStrokeUnits:[{id:"NRW-RSU-001",name:"Helios Universitätsklinikum Wuppertal",address:"Heusnerstraße 40, 42283 Wuppertal",coordinates:{lat:51.2467,lng:7.1703},phone:"+49 202 896-0",emergency:"+49 202 896-2180",thrombolysis:!0,beds:1050,network:"NEVANO+"}],thrombolysisHospitals:[{id:"NRW-TH-009",name:"Elisabeth-Krankenhaus Essen",address:"Klara-Kopp-Weg 1, 45138 Essen",coordinates:{lat:51.4495,lng:7.0137},phone:"+49 201 897-0",thrombolysis:!0,beds:583},{id:"NRW-TH-010",name:"Klinikum Oberberg Gummersbach",address:"Wilhelm-Breckow-Allee 20, 51643 Gummersbach",coordinates:{lat:51.0277,lng:7.5694},phone:"+49 2261 17-0",thrombolysis:!0,beds:431},{id:"NRW-TH-011",name:"St. Vincenz-Krankenhaus Limburg",address:"Auf dem Schafsberg, 65549 Limburg",coordinates:{lat:50.3856,lng:8.0584},phone:"+49 6431 292-0",thrombolysis:!0,beds:452},{id:"NRW-TH-012",name:"Klinikum Lüdenscheid",address:"Paulmannshöher Straße 14, 58515 Lüdenscheid",coordinates:{lat:51.2186,lng:7.6298},phone:"+49 2351 46-0",thrombolysis:!0,beds:869}]}},Pe={routePatient:function(a){const{location:e,state:t,ichProbability:i,timeFromOnset:n,clinicalFactors:s}=a,o=t||this.detectState(e),c=se[o];if(i>=.5){const l=this.findNearest(e,c.neurosurgicalCenters);if(!l)throw new Error(`No neurosurgical centers available in ${o}`);return{category:"NEUROSURGICAL_CENTER",destination:l,urgency:"IMMEDIATE",reasoning:"High bleeding probability (≥50%) - neurosurgical evaluation required",preAlert:"Activate neurosurgery team",bypassLocal:!0,threshold:"≥50%",state:o}}else if(i>=.3){const l=[...c.neurosurgicalCenters,...c.comprehensiveStrokeCenters];return{category:"COMPREHENSIVE_CENTER",destination:this.findNearest(e,l),urgency:"URGENT",reasoning:"Intermediate bleeding risk (30-50%) - CT and possible intervention",preAlert:"Prepare for possible neurosurgical consultation",transferPlan:this.findNearest(e,c.neurosurgicalCenters),threshold:"30-50%",state:o}}else if(n&&n<=270){const l=[...c.neurosurgicalCenters,...c.comprehensiveStrokeCenters,...c.regionalStrokeUnits,...c.thrombolysisHospitals];return{category:"THROMBOLYSIS_CAPABLE",destination:this.findNearest(e,l),urgency:"TIME_CRITICAL",reasoning:"Low bleeding risk (<30%), within tPA window - nearest thrombolysis",preAlert:"Prepare for thrombolysis protocol",bypassLocal:!1,threshold:"<30%",timeWindow:"≤4.5h",state:o}}else{const l=[...c.neurosurgicalCenters,...c.comprehensiveStrokeCenters,...c.regionalStrokeUnits];return{category:"STROKE_UNIT",destination:this.findNearest(e,l),urgency:"STANDARD",reasoning:n>270?"Low bleeding risk, outside tPA window - standard stroke evaluation":"Low bleeding risk - standard stroke evaluation",preAlert:"Standard stroke protocol",bypassLocal:!1,threshold:"<30%",timeWindow:n?">4.5h":"unknown",state:o}}},detectState:function(a){return a.lat>=47.5&&a.lat<=49.8&&a.lng>=7.5&&a.lng<=10.2?"badenWuerttemberg":a.lat>=50.3&&a.lat<=52.5&&a.lng>=5.9&&a.lng<=9.5?"nordrheinWestfalen":a.lat>=47.2&&a.lat<=50.6&&a.lng>=10.2&&a.lng<=13.8?"bayern":this.findNearestState(a)},findNearestState:function(a){const e={bayern:{lat:49,lng:11.5},badenWuerttemberg:{lat:48.5,lng:9},nordrheinWestfalen:{lat:51.5,lng:7.5}};let t="bayern",i=1/0;for(const[n,s]of Object.entries(e)){const o=this.calculateDistance(a,s);o<i&&(i=o,t=n)}return t},findNearest:function(a,e){return!e||e.length===0?(console.warn("No hospitals available in database"),null):e.map(t=>!t.coordinates||typeof t.coordinates.lat!="number"?(console.warn(`Hospital ${t.name} missing valid coordinates`),null):{...t,distance:this.calculateDistance(a,t.coordinates)}).filter(t=>t!==null).sort((t,i)=>t.distance-i.distance)[0]},calculateDistance:function(a,e){const i=this.toRad(e.lat-a.lat),n=this.toRad(e.lng-a.lng),s=Math.sin(i/2)*Math.sin(i/2)+Math.cos(this.toRad(a.lat))*Math.cos(this.toRad(e.lat))*Math.sin(n/2)*Math.sin(n/2);return 6371*(2*Math.atan2(Math.sqrt(s),Math.sqrt(1-s)))},toRad:function(a){return a*(Math.PI/180)}};function F(a,e,t,i){const s=B(t-a),o=B(i-e),c=Math.sin(s/2)*Math.sin(s/2)+Math.cos(B(a))*Math.cos(B(t))*Math.sin(o/2)*Math.sin(o/2);return 6371*(2*Math.atan2(Math.sqrt(c),Math.sqrt(1-c)))}function B(a){return a*(Math.PI/180)}async function Re(a,e,t,i,n="driving-car"){try{const s=`https://api.openrouteservice.org/v2/directions/${n}`,c=await fetch(s,{method:"POST",headers:{Accept:"application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",Authorization:"5b3ce3597851110001cf624868c4c27b63ae476c9c26c8bffbc35688","Content-Type":"application/json; charset=utf-8"},body:JSON.stringify({coordinates:[[e,a],[i,t]],radiuses:[1e3,1e3],format:"json"})});if(!c.ok)throw new Error(`Routing API error: ${c.status}`);const l=await c.json();if(l.routes&&l.routes.length>0){const d=l.routes[0];return{duration:Math.round(d.summary.duration/60),distance:Math.round(d.summary.distance/1e3),source:"routing"}}else throw new Error("No route found")}catch(s){console.warn("Travel time calculation failed, using distance estimate:",s);const o=F(a,e,t,i);return{duration:Math.round(o/.8),distance:Math.round(o),source:"estimated"}}}async function G(a,e,t,i){try{const n=await Re(a,e,t,i,"driving-car");return{duration:Math.round(n.duration*.75),distance:n.distance,source:n.source==="routing"?"emergency-routing":"emergency-estimated"}}catch{const s=F(a,e,t,i);return{duration:Math.round(s/1.2),distance:Math.round(s),source:"emergency-estimated"}}}function ne(a){return`
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
  `}function Ie(a){const e=document.getElementById("useGpsButton"),t=document.getElementById("manualLocationButton"),i=document.querySelector(".location-manual"),n=document.getElementById("locationInput"),s=document.getElementById("searchLocationButton"),o=document.getElementById("strokeCenterResults");e&&e.addEventListener("click",()=>{Ne(a,o)}),t&&t.addEventListener("click",()=>{i.style.display=i.style.display==="none"?"block":"none"}),s&&s.addEventListener("click",()=>{const c=n.value.trim();c&&Y(c,a,o)}),n&&n.addEventListener("keypress",c=>{if(c.key==="Enter"){const l=n.value.trim();l&&Y(l,a,o)}})}function Ne(a,e){if(!navigator.geolocation){R(r("geolocationNotSupported"),e);return}e.innerHTML=`<div class="loading">${r("gettingLocation")}...</div>`,navigator.geolocation.getCurrentPosition(t=>{const{latitude:i,longitude:n}=t.coords;z(i,n,a,e)},t=>{let i=r("locationError");switch(t.code){case t.PERMISSION_DENIED:i=r("locationPermissionDenied");break;case t.POSITION_UNAVAILABLE:i=r("locationUnavailable");break;case t.TIMEOUT:i=r("locationTimeout");break}R(i,e)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:3e5})}async function Y(a,e,t){t.innerHTML=`<div class="loading">${r("searchingLocation")}...</div>`;const i=/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/,n=a.trim().match(i);if(n){const s=parseFloat(n[1]),o=parseFloat(n[2]);if(s>=47.2&&s<=52.5&&o>=5.9&&o<=15){t.innerHTML=`
        <div class="location-success">
          <p>📍 Coordinates: ${s.toFixed(4)}, ${o.toFixed(4)}</p>
        </div>
      `,setTimeout(()=>{z(s,o,e,t)},500);return}else{R("Coordinates appear to be outside Germany. Please check the values.",t);return}}try{let s=a.trim();!s.toLowerCase().includes("deutschland")&&!s.toLowerCase().includes("germany")&&!s.toLowerCase().includes("bayern")&&!s.toLowerCase().includes("bavaria")&&!s.toLowerCase().includes("nordrhein")&&!s.toLowerCase().includes("baden")&&(s=s+", Deutschland");const c=`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(s)}&countrycodes=de&format=json&limit=3&addressdetails=1`,l=await fetch(c,{method:"GET",headers:{Accept:"application/json","User-Agent":"iGFAP-StrokeTriage/2.1.0"}});if(!l.ok)throw new Error(`Geocoding API error: ${l.status}`);const d=await l.json();if(d&&d.length>0){let u=d[0];const p=["Bayern","Baden-Württemberg","Nordrhein-Westfalen"];for(const h of d)if(h.address&&p.includes(h.address.state)){u=h;break}const b=parseFloat(u.lat),f=parseFloat(u.lon),m=u.display_name||a;t.innerHTML=`
        <div class="location-success">
          <p>📍 Found: ${m}</p>
          <small style="color: #666;">Lat: ${b.toFixed(4)}, Lng: ${f.toFixed(4)}</small>
        </div>
      `,setTimeout(()=>{z(b,f,e,t)},1e3)}else R(`
        <strong>Location "${a}" not found.</strong><br>
        <small>Try:</small>
        <ul style="text-align: left; font-size: 0.9em; margin: 10px 0;">
          <li>City name: "München", "Köln", "Stuttgart"</li>
          <li>Address: "Marienplatz 1, München"</li>
          <li>Coordinates: "48.1351, 11.5820"</li>
        </ul>
      `,t)}catch(s){console.warn("Geocoding failed:",s),R(`
      <strong>Unable to search location.</strong><br>
      <small>Please try entering coordinates directly (e.g., "48.1351, 11.5820")</small>
    `,t)}}async function z(a,e,t,i){var c,l;const n={lat:a,lng:e},s=Pe.routePatient({location:n,ichProbability:((c=t==null?void 0:t.ich)==null?void 0:c.probability)||0,timeFromOnset:(t==null?void 0:t.timeFromOnset)||null,clinicalFactors:(t==null?void 0:t.clinicalFactors)||{}});if(!s||!s.destination){i.innerHTML=`
      <div class="location-error">
        <p>⚠️ No suitable stroke centers found in this area.</p>
        <p><small>Please try a different location or contact emergency services directly.</small></p>
      </div>
    `;return}const o=De(s,t);i.innerHTML=`
    <div class="location-info">
      <p><strong>${r("yourLocation")}:</strong> ${a.toFixed(4)}, ${e.toFixed(4)}</p>
      <p><strong>Detected State:</strong> ${j(s.state)}</p>
    </div>
    <div class="loading">${r("calculatingTravelTimes")}...</div>
  `;try{const d=se[s.state],u=[...d.neurosurgicalCenters,...d.comprehensiveStrokeCenters,...d.regionalStrokeUnits,...d.thrombolysisHospitals||[]],p=s.destination;p.distance=F(a,e,p.coordinates.lat,p.coordinates.lng);try{const m=await G(a,e,p.coordinates.lat,p.coordinates.lng);p.travelTime=m.duration,p.travelSource=m.source}catch{p.travelTime=Math.round(p.distance/.8),p.travelSource="estimated"}const b=u.filter(m=>m.id!==p.id).map(m=>({...m,distance:F(a,e,m.coordinates.lat,m.coordinates.lng)})).sort((m,h)=>m.distance-h.distance).slice(0,3);for(const m of b)try{const h=await G(a,e,m.coordinates.lat,m.coordinates.lng);m.travelTime=h.duration,m.travelSource=h.source}catch{m.travelTime=Math.round(m.distance/.8),m.travelSource="estimated"}const f=`
      <div class="location-info">
        <p><strong>${r("yourLocation")}:</strong> ${a.toFixed(4)}, ${e.toFixed(4)}</p>
        <p><strong>State:</strong> ${j(s.state)}</p>
        ${o}
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
        <small>${r("travelTimeNote")||"Travel times estimated for emergency vehicles"}</small>
      </div>
    `;i.innerHTML=f}catch(d){console.warn("Enhanced routing failed, using basic display:",d),i.innerHTML=`
      <div class="location-info">
        <p><strong>${r("yourLocation")}:</strong> ${a.toFixed(4)}, ${e.toFixed(4)}</p>
        ${o}
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
    `}}function j(a){return{bayern:"Bayern (Bavaria)",badenWuerttemberg:"Baden-Württemberg",nordrheinWestfalen:"Nordrhein-Westfalen (NRW)"}[a]||a}function De(a,e){var n;const t=Math.round((((n=e==null?void 0:e.ich)==null?void 0:n.probability)||0)*100);let i="🏥";return a.urgency==="IMMEDIATE"?i="🚨":a.urgency==="TIME_CRITICAL"?i="⏰":a.urgency==="URGENT"&&(i="⚠️"),`
    <div class="routing-explanation ${a.category.toLowerCase()}">
      <div class="routing-header">
        <strong>${i} ${a.category.replace("_"," ")} - ${a.urgency}</strong>
      </div>
      <div class="routing-details">
        <p><strong>ICH Risk:</strong> ${t}% ${a.threshold?`(${a.threshold})`:""}</p>
        ${a.timeWindow?`<p><strong>Time Window:</strong> ${a.timeWindow}</p>`:""}
        <p><strong>Routing Logic:</strong> ${a.reasoning}</p>
        <p><strong>Pre-Alert:</strong> ${a.preAlert}</p>
        ${a.bypassLocal?'<p class="bypass-warning">⚠️ Bypassing local hospitals</p>':""}
      </div>
    </div>
  `}function J(a,e,t){const i=[];a.neurosurgery&&i.push("🧠 Neurosurgery"),a.thrombectomy&&i.push("🩸 Thrombectomy"),a.thrombolysis&&i.push("💉 Thrombolysis");const n=a.network?`<span class="network-badge">${a.network}</span>`:"";return`
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
  `}function R(a,e){e.innerHTML=`
    <div class="location-error">
      <p>⚠️ ${a}</p>
      <p><small>${r("tryManualEntry")}</small></p>
    </div>
  `}function _e(a,e){const t=Number(a),i=te[e];return t>=i.high?"🔴 HIGH RISK":t>=i.medium?"🟡 MEDIUM RISK":"🟢 LOW RISK"}const O={moderate:{min:10},high:{min:20},critical:{min:30}};function re(a){if(!a||a<=0)return{volume:0,volumeRange:{min:0,max:0},riskLevel:"low",mortalityRate:"~0%",isValid:!0,calculation:"No hemorrhage detected"};const e=Math.min(a,1e4);a>1e4&&console.warn(`GFAP value ${a} exceeds expected range, capped at 10,000 pg/ml`);try{const t=.0192+.4533*Math.log10(e),i=Math.pow(10,t),n={min:i*.7,max:i*1.3},s=Be(i),o=Fe(i),c=i<1?"<1":i.toFixed(1);return{volume:i,displayVolume:c,volumeRange:{min:n.min.toFixed(1),max:n.max.toFixed(1)},riskLevel:s,mortalityRate:o,isValid:!0,calculation:`Based on GFAP ${a} pg/ml`,threshold:i>=30?"SURGICAL":i>=20?"HIGH_RISK":"MANAGEABLE"}}catch(t){return console.error("Volume calculation error:",t),{volume:0,volumeRange:{min:0,max:0},riskLevel:"low",mortalityRate:"Unknown",isValid:!1,calculation:"Calculation error",error:t.message}}}function Be(a){return a>=O.critical.min?"critical":a>=O.high.min?"high":a>=O.moderate.min?"moderate":"low"}function Fe(a){return a<10?"5-10%⁴":a<30?`${Math.round(10+(a-10)*9/20)}%⁴`:a<50?`${Math.round(19+(a-30)*25/20)}%³`:a<60?`${Math.round(44+(a-50)*47/10)}%²`:a<80?`${Math.round(91+(a-60)*5/20)}%¹`:"96-100%¹"}function He(a){return a<1?"<1 ml":a<10?`${a.toFixed(1)} ml`:`${Math.round(a)} ml`}function xe(a){if(!a||a<=0)return`
      <div class="volume-circle" data-volume="0">
        <div class="volume-number">0<span> ml</span></div>
        <canvas class="volume-canvas" width="120" height="120"></canvas>
      </div>
    `;const e=He(a),t=`volume-canvas-${Math.random().toString(36).substr(2,9)}`;return`
    <div class="volume-circle" data-volume="${a}">
      <div class="volume-number">${e}</div>
      <canvas id="${t}" class="volume-canvas" 
              data-volume="${a}" data-canvas-id="${t}"></canvas>
    </div>
  `}function Oe(){document.querySelectorAll(".volume-canvas").forEach(e=>{const t=e.offsetWidth||120,i=e.offsetHeight||120;e.width=t,e.height=i;const n=parseFloat(e.dataset.volume)||0;n>0&&Ve(e,n)})}function Ve(a,e){const t=a.getContext("2d"),i=a.width/2,n=a.height/2,s=a.width*.45;let o=0,c=!0;const l=document.body.classList.contains("dark-mode")||window.matchMedia("(prefers-color-scheme: dark)").matches;function d(){c&&(t.clearRect(0,0,a.width,a.height),u())}function u(){const m=Math.min(e/80,.9)*(s*1.8),h=n+s-4-m;if(e>0){t.save(),t.beginPath(),t.arc(i,n,s-4,0,Math.PI*2),t.clip(),t.fillStyle="#dc2626",t.globalAlpha=.7,t.fillRect(0,h+5,a.width,a.height),t.globalAlpha=.9,t.fillStyle="#dc2626",t.beginPath();let k=i-s+4;t.moveTo(k,h);for(let v=k;v<=i+s-4;v+=2){const pe=Math.sin(v*.05+o*.08)*3,he=Math.sin(v*.08+o*.12+1)*2,be=h+pe+he;t.lineTo(v,be)}t.lineTo(i+s-4,a.height),t.lineTo(k,a.height),t.closePath(),t.fill(),t.restore()}const T=getComputedStyle(document.documentElement).getPropertyValue("--text-secondary").trim()||(l?"#8899a6":"#6c757d");t.strokeStyle=T,t.lineWidth=8,t.globalAlpha=.4,t.beginPath(),t.arc(i,n,s,0,Math.PI*2),t.stroke(),t.globalAlpha=1;const M=Math.min(e/100,1),$=getComputedStyle(document.documentElement).getPropertyValue("--danger-color").trim()||"#dc2626";t.strokeStyle=$,t.lineWidth=8,t.setLineDash([]),t.lineCap="round",t.beginPath(),t.arc(i,n,s,-Math.PI/2,-Math.PI/2+M*2*Math.PI),t.stroke(),o+=1,e>0&&requestAnimationFrame(d)}d();const p=new MutationObserver(()=>{document.contains(a)||(c=!1,p.disconnect())});p.observe(document.body,{childList:!0,subtree:!0})}class D{static calculateProbability(e,t){if(!e||!t||e<=0||t<=0)return{probability:0,confidence:0,isValid:!1,reason:"Invalid inputs: age and GFAP required"};if(e<18||e>120)return{probability:0,confidence:0,isValid:!1,reason:`Age ${e} outside valid range (18-120 years)`};(t<10||t>2e4)&&console.warn(`GFAP ${t} outside typical range (10-20000 pg/ml)`);try{const i=(e-this.PARAMS.age.mean)/this.PARAMS.age.std,n=(t-this.PARAMS.gfap.mean)/this.PARAMS.gfap.std,s=this.PARAMS.coefficients.intercept+this.PARAMS.coefficients.age*i+this.PARAMS.coefficients.gfap*n,o=1/(1+Math.exp(-s)),c=o*100,l=Math.abs(o-.5)*2,d=this.getRiskCategory(c);return{probability:Math.round(c*10)/10,confidence:Math.round(l*100)/100,logit:Math.round(s*1e3)/1e3,riskCategory:d,scaledInputs:{age:Math.round(i*1e3)/1e3,gfap:Math.round(n*1e3)/1e3},rawInputs:{age:e,gfap:t},isValid:!0,calculationMethod:"logistic_regression_age_gfap"}}catch(i){return console.error("Legacy model calculation error:",i),{probability:0,confidence:0,isValid:!1,reason:"Calculation error",error:i.message}}}static getRiskCategory(e){return e<10?{level:"very_low",color:"#10b981",label:"Very Low Risk",description:"Minimal ICH likelihood"}:e<25?{level:"low",color:"#84cc16",label:"Low Risk",description:"Below typical threshold"}:e<50?{level:"moderate",color:"#f59e0b",label:"Moderate Risk",description:"Elevated concern"}:e<75?{level:"high",color:"#f97316",label:"High Risk",description:"Significant likelihood"}:{level:"very_high",color:"#dc2626",label:"Very High Risk",description:"Critical ICH probability"}}static compareModels(e,t){if(!e||!t||!t.isValid)return{isValid:!1,reason:"Invalid model results for comparison"};let i=e.probability||0;i<=1&&(i=i*100);const n=t.probability||0,s=i-n,o=n>0?s/n*100:0,c=i>n?"main":n>i?"legacy":"equal";let l;const d=Math.abs(s);return d<5?l="strong":d<15?l="moderate":d<30?l="weak":l="poor",{isValid:!0,probabilities:{main:Math.round(i*10)/10,legacy:Math.round(n*10)/10},differences:{absolute:Math.round(s*10)/10,relative:Math.round(o*10)/10},agreement:{level:l,higherRiskModel:c},interpretation:this.getComparisonInterpretation(s,l)}}static getComparisonInterpretation(e,t){const i=Math.abs(e);return t==="strong"?{type:"concordant",message:"Models show strong agreement",implication:"Age and GFAP are primary risk factors"}:i>20?{type:"divergent",message:"Significant model disagreement",implication:"Complex model captures additional risk factors not in age/GFAP"}:{type:"moderate_difference",message:"Models show moderate difference",implication:"Additional factors provide incremental predictive value"}}static runValidationTests(){const t=[{age:65,gfap:100,expected:"low",description:"Younger patient, low GFAP"},{age:75,gfap:500,expected:"moderate",description:"Average age, moderate GFAP"},{age:85,gfap:1e3,expected:"high",description:"Older patient, high GFAP"},{age:70,gfap:2e3,expected:"very_high",description:"High GFAP dominates"},{age:90,gfap:50,expected:"very_low",description:"Low GFAP despite age"}].map(s=>{const o=this.calculateProbability(s.age,s.gfap);return{...s,result:o,passed:o.isValid&&o.riskCategory.level===s.expected}}),i=t.filter(s=>s.passed).length,n=t.length;return{summary:{passed:i,total:n,passRate:Math.round(i/n*100)},details:t}}static getModelMetadata(){return{name:"Legacy ICH Model",type:"Logistic Regression",version:"1.0.0",features:["age","gfap"],performance:{rocAuc:.789,recall:.4,precision:.86,f1Score:.55,specificity:.94},trainingData:{samples:"Historical cohort",dateRange:"Research study period",validation:"Cross-validation"},limitations:["Only uses age and GFAP - ignores clinical symptoms","Lower recall (40%) - misses some ICH cases","No time-to-onset consideration","No blood pressure or medication factors","Simplified feature set for baseline comparison"],purpose:"Research baseline for evaluating complex model improvements"}}}_(D,"PARAMS",{age:{mean:74.59,std:12.75},gfap:{mean:665.23,std:2203.77},coefficients:{intercept:.3248,age:-.2108,gfap:3.1631}});function ze(a){try{const e=(a==null?void 0:a.age_years)||(a==null?void 0:a.age)||null,t=(a==null?void 0:a.gfap_value)||(a==null?void 0:a.gfap)||null;return!e||!t?null:D.calculateProbability(e,t)}catch(e){return console.warn("Legacy ICH calculation failed (non-critical):",e),null}}class C{static logComparison(e){try{const t={id:this.generateEntryId(),timestamp:new Date().toISOString(),sessionId:this.getSessionId(),...e},i=this.getStoredData();return i.entries.push(t),i.entries.length>this.MAX_ENTRIES&&(i.entries=i.entries.slice(-this.MAX_ENTRIES)),i.lastUpdated=new Date().toISOString(),i.totalComparisons=i.entries.length,localStorage.setItem(this.STORAGE_KEY,JSON.stringify(i)),console.log(`📊 Research data logged (${i.totalComparisons} comparisons)`),!0}catch(t){return console.warn("Research data logging failed (non-critical):",t),!1}}static getStoredData(){try{const e=localStorage.getItem(this.STORAGE_KEY);if(!e)return this.createEmptyDataset();const t=JSON.parse(e);return!t.entries||!Array.isArray(t.entries)?(console.warn("Invalid research data structure, resetting"),this.createEmptyDataset()):t}catch(e){return console.warn("Failed to load research data, creating new:",e),this.createEmptyDataset()}}static createEmptyDataset(){return{version:"1.0.0",created:new Date().toISOString(),lastUpdated:null,totalComparisons:0,entries:[],metadata:{app:"iGFAP Stroke Triage",purpose:"Model comparison research",dataRetention:"Local storage only"}}}static exportAsCSV(){const e=this.getStoredData();if(!e.entries||e.entries.length===0)return"No research data available for export";const t=["timestamp","session_id","age","gfap_value","main_model_probability","main_model_module","legacy_model_probability","legacy_model_confidence","absolute_difference","relative_difference","agreement_level","higher_risk_model"],i=e.entries.map(s=>{var o,c,l,d,u,p,b,f,m,h,T,M,$,k;return[s.timestamp,s.sessionId,((o=s.inputs)==null?void 0:o.age)||"",((c=s.inputs)==null?void 0:c.gfap)||"",((l=s.main)==null?void 0:l.probability)||"",((d=s.main)==null?void 0:d.module)||"",((u=s.legacy)==null?void 0:u.probability)||"",((p=s.legacy)==null?void 0:p.confidence)||"",((f=(b=s.comparison)==null?void 0:b.differences)==null?void 0:f.absolute)||"",((h=(m=s.comparison)==null?void 0:m.differences)==null?void 0:h.relative)||"",((M=(T=s.comparison)==null?void 0:T.agreement)==null?void 0:M.level)||"",((k=($=s.comparison)==null?void 0:$.agreement)==null?void 0:k.higherRiskModel)||""].join(",")});return[t.join(","),...i].join(`
`)}static exportAsJSON(){const e=this.getStoredData();return JSON.stringify(e,null,2)}static downloadData(e="csv"){try{const t=e==="csv"?this.exportAsCSV():this.exportAsJSON(),i=`igfap-research-${Date.now()}.${e}`,n=new Blob([t],{type:e==="csv"?"text/csv":"application/json"}),s=URL.createObjectURL(n),o=document.createElement("a");return o.href=s,o.download=i,document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(s),console.log(`📥 Downloaded research data: ${i}`),!0}catch(t){return console.error("Failed to download research data:",t),!1}}static clearData(){try{return localStorage.removeItem(this.STORAGE_KEY),console.log("🗑️ Research data cleared"),!0}catch(e){return console.warn("Failed to clear research data:",e),!1}}static getDataSummary(){var s,o;const e=this.getStoredData();if(!e.entries||e.entries.length===0)return{totalEntries:0,dateRange:null,avgDifference:null};const t=e.entries,i=t.map(c=>{var l,d;return(d=(l=c.comparison)==null?void 0:l.differences)==null?void 0:d.absolute}).filter(c=>c!=null),n=i.length>0?i.reduce((c,l)=>c+Math.abs(l),0)/i.length:0;return{totalEntries:t.length,dateRange:{first:(s=t[0])==null?void 0:s.timestamp,last:(o=t[t.length-1])==null?void 0:o.timestamp},avgAbsoluteDifference:Math.round(n*10)/10,storageSize:JSON.stringify(e).length}}static generateEntryId(){return Date.now().toString(36)+Math.random().toString(36).substr(2)}static getSessionId(){let e=sessionStorage.getItem("research_session_id");return e||(e="session_"+Date.now().toString(36),sessionStorage.setItem("research_session_id",e)),e}}_(C,"STORAGE_KEY","igfap_research_data"),_(C,"MAX_ENTRIES",1e3);function qe(a,e,t){try{if(!L())return;const i={inputs:{age:t.age_years||t.age,gfap:t.gfap_value||t.gfap,module:a.module||"unknown"},main:{probability:a.probability,module:a.module,confidence:a.confidence},legacy:e,comparison:e?D.compareModels(a,e):null};C.logComparison(i)}catch(i){console.warn("Research logging failed (non-critical):",i)}}function L(a=null){var e;if(a==="coma")return!1;if(a==="limited"||a==="full")return!0;if(typeof window<"u")try{const t=window.store||((e=require("../state/store.js"))==null?void 0:e.store);if(t){const i=t.getState().formData;return i.limited||i.full}}catch{}return!1}function oe(){return""}function le(a,e,t){if(!(e!=null&&e.isValid))return console.log("🔬 Legacy model results invalid:",e),`
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
    `;const i=D.compareModels(a,e);return`
    <div class="research-panel" id="researchPanel" style="display: none;">
      <div class="research-header">
        <h4>🔬 Model Comparison (Research)</h4>
        <button class="close-research" id="closeResearch">×</button>
      </div>
      
      <div class="model-comparison">
        ${Ke(a,e)}
        ${Ue(i)}
        ${We(e,t)}
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
  `}function Ke(a,e){let t=a.probability||0;t<=1&&(t=t*100);const i=e.probability||0;return`
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
          <div class="bar-fill legacy-model" style="width: ${Math.min(i,100)}%">
            <span class="bar-value">${i.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  `}function Ue(a){if(!a.isValid)return'<div class="comparison-error">Unable to compare models</div>';const{differences:e,agreement:t}=a;return`
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
  `}function We(a,e){return`
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
  `}function Ye(){if(!document.getElementById("researchPanel"))return;const e=document.getElementById("closeResearch");e&&e.addEventListener("click",()=>{const s=document.getElementById("researchPanel");s&&(s.style.display="none")});const t=document.getElementById("exportResearchData");t&&t.addEventListener("click",()=>{C.downloadData("csv")});const i=document.getElementById("toggleCalculationDetails");i&&i.addEventListener("click",()=>{const s=document.getElementById("calculationDetails");s&&(s.style.display=s.style.display==="none"?"block":"none",i.textContent=s.style.display==="none"?"🧮 Details":"🧮 Hide")});const n=document.getElementById("clearResearchData");n&&n.addEventListener("click",()=>{if(confirm("Clear all research data? This cannot be undone.")){C.clearData();const s=C.getDataSummary();console.log(`Data cleared. Total entries: ${s.totalEntries}`)}}),console.log("🔬 Research mode initialized")}function ce(){const e=g.getState().formData;if(!e||Object.keys(e).length===0)return"";let t="";return Object.entries(e).forEach(([i,n])=>{if(n&&Object.keys(n).length>0){const s=r(`${i}ModuleTitle`)||i.charAt(0).toUpperCase()+i.slice(1);let o="";Object.entries(n).forEach(([c,l])=>{if(l===""||l===null||l===void 0)return;let d=Me(c),u=$e(l,c);o+=`
          <div class="summary-item">
            <span class="summary-label">${d}:</span>
            <span class="summary-value">${u}</span>
          </div>
        `}),o&&(t+=`
          <div class="summary-module">
            <h4>${s}</h4>
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
  `:""}function de(a,e,t){if(!e)return"";const i=Math.round((e.probability||0)*100),n=_e(i,a),s=i>70,o=i>te[a].high,c={ich:"🩸",lvo:"🧠"},l={ich:r("ichProbability"),lvo:r("lvoProbability")},d={ich:"ICH",lvo:A.getCurrentLanguage()==="de"?"Großgefäßverschluss":"Large Vessel Occlusion"};return`
    <div class="enhanced-risk-card ${a} ${s?"critical":o?"high":"normal"}">
      <div class="risk-header">
        <div class="risk-icon">${c[a]}</div>
        <div class="risk-title">
          <h3>${l[a]}</h3>
          <span class="risk-subtitle">${d[a]}</span>
          <span class="risk-module">${e.module} Module</span>
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
                ${je(e)}
                <div class="circle-label">${r("ichVolumeLabel")}</div>
              </div>
            `:""}
          </div>
          
          <div class="risk-level ${s?"critical":o?"high":"normal"}">
            ${n}
          </div>
        </div>
        
        <div class="risk-assessment">
          ${i>=50&&H()>0?`
            <div class="mortality-assessment">
              ${r("predictedMortality")}: ${re(H()).mortalityRate}
            </div>
          `:""}
        </div>
      </div>
    </div>
  `}function je(a){const e=a.gfap_value||H();if(!e||e<=0)return"";const t=re(e);return`
    <div class="volume-display-container">
      ${xe(t.volume)}
    </div>
  `}function H(){var t;const e=g.getState().formData;for(const i of["coma","limited","full"])if((t=e[i])!=null&&t.gfap_value)return parseFloat(e[i].gfap_value);return 0}function Je(a,e){const{ich:t,lvo:i}=a,n=at(t),s=n!=="coma"?et():null;console.log("🔬 Research Debug - Always Active:",{module:n,researchEnabled:L(n),mainResults:t,legacyResults:s,patientInputs:I(),legacyCalculationAttempted:n!=="coma"}),s&&L(n)&&qe(t,s,I());const o=(t==null?void 0:t.module)==="Limited"||(t==null?void 0:t.module)==="Coma"||(i==null?void 0:i.notPossible)===!0;t==null||t.module;let c;return o?c=Ze(t,a,e,s,n):c=Qe(t,i,a,e,s,n),setTimeout(()=>{Oe()},100),c}function Ze(a,e,t,i,n){const s=a&&a.probability>.6?ae():"",o=ne(),c=ce(),l=L(n)?oe():"",d=i&&L(n)?le(a,i,I()):"",u=(a==null?void 0:a.module)==="Coma"?tt(a.probability):"";return`
    <div class="container">
      ${E(3)}
      <h2>${r("bleedingRiskAssessment")||"Blutungsrisiko-Bewertung / Bleeding Risk Assessment"}</h2>
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
          <h3>${r("riskFactorsTitle")||"Hauptrisikofaktoren / Main Risk Factors"}</h3>
          ${ue(a)}
        </div>
      `:""}
      
      <!-- Collapsible Additional Information -->
      <div class="additional-info-section">
        <button class="info-toggle" data-target="input-summary">
          <span class="toggle-icon">📋</span>
          <span class="toggle-text">${r("inputSummaryTitle")}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="input-summary" style="display: none;">
          ${c}
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
      ${l}
    </div>
  `}function Qe(a,e,t,i,n,s){const o=Math.round(((a==null?void 0:a.probability)||0)*100),c=Math.round(((e==null?void 0:e.probability)||0)*100),l=a&&a.probability>.6?ae():"",d=ne(),u=ce(),p=L(s)?oe():"",b=n&&L(s)?le(a,n,I()):"",f=o<30&&c>50;return`
    <div class="container">
      ${E(3)}
      <h2>${r("resultsTitle")}</h2>
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
          ${u}
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
  `}function Xe(){return`
    <div class="secondary-notification">
      <p class="lvo-possible">
        ⚡ ${r("lvoMayBePossible")||"Großgefäßverschluss möglich / Large vessel occlusion possible"}
      </p>
    </div>
  `}function ue(a){if(!a||!a.drivers)return'<p class="no-drivers">No driver data available</p>';const e=a.drivers;if(!e.positive&&!e.negative)return'<p class="no-drivers">Driver format error</p>';const t=e.positive||[],i=e.negative||[];return`
    <div class="drivers-split-view">
      <div class="drivers-column positive-column">
        <div class="column-header">
          <span class="column-icon">⬆</span>
          <span class="column-title">${r("increasingRisk")||"Risikoerhöhend / Increasing Risk"}</span>
        </div>
        <div class="compact-drivers">
          ${t.length>0?t.slice(0,5).map(n=>Z(n,"positive")).join(""):`<p class="no-factors">${r("noFactors")||"Keine Faktoren / No factors"}</p>`}
        </div>
      </div>
      
      <div class="drivers-column negative-column">
        <div class="column-header">
          <span class="column-icon">⬇</span>
          <span class="column-title">${r("decreasingRisk")||"Risikomindernd / Decreasing Risk"}</span>
        </div>
        <div class="compact-drivers">
          ${i.length>0?i.slice(0,5).map(n=>Z(n,"negative")).join(""):`<p class="no-factors">${r("noFactors")||"Keine Faktoren / No factors"}</p>`}
        </div>
      </div>
    </div>
  `}function Z(a,e){const t=Math.abs(a.weight*100),i=Math.min(t*2,100);return`
    <div class="compact-driver-item">
      <div class="compact-driver-label">${ie(a.label)}</div>
      <div class="compact-driver-bar ${e}" style="width: ${i}%;">
        <span class="compact-driver-value">${t.toFixed(1)}%</span>
      </div>
    </div>
  `}function me(a){if(!a||!a.probability||Math.round((a.probability||0)*100)<50)return"";const t=H();return!t||t<=0?"":`
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
  `}function et(a){try{const e=I();if(console.log("🔍 Legacy calculation inputs:",e),!e.age||!e.gfap)return console.warn("🔍 Missing required inputs for legacy model:",{age:e.age,gfap:e.gfap}),null;const t=ze(e);return console.log("🔍 Legacy calculation result:",t),t}catch(e){return console.warn("Legacy model calculation failed (non-critical):",e),null}}function I(){const e=g.getState().formData;console.log("🔍 Debug formData structure:",e);let t=null,i=null;for(const s of["coma","limited","full"])e[s]&&(console.log(`🔍 ${s} module data:`,e[s]),t=t||e[s].age_years,i=i||e[s].gfap_value);const n={age:parseInt(t)||null,gfap:parseFloat(i)||null};return console.log("🔍 Extracted patient inputs:",n),n}function tt(a){const e=Math.round(a*100),t=A.getCurrentLanguage()==="de";return e>25?`
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
    `}function at(a){if(!(a!=null&&a.module))return"unknown";const e=a.module.toLowerCase();return e.includes("coma")?"coma":e.includes("limited")?"limited":e.includes("full")?"full":"unknown"}function it(a,e,t){const i=[];return t.required&&!e&&e!==0&&i.push("This field is required"),t.min!==void 0&&e!==""&&!isNaN(e)&&parseFloat(e)<t.min&&i.push(`Value must be at least ${t.min}`),t.max!==void 0&&e!==""&&!isNaN(e)&&parseFloat(e)>t.max&&i.push(`Value must be at most ${t.max}`),t.pattern&&!t.pattern.test(e)&&i.push("Invalid format"),i}function st(a){let e=!0;const t={};return Object.entries(we).forEach(([i,n])=>{const s=a.elements[i];if(s){const o=it(i,s.value,n);o.length>0&&(t[i]=o,e=!1)}}),{isValid:e,validationErrors:t}}function nt(a,e){Object.entries(e).forEach(([t,i])=>{const n=a.querySelector(`[name="${t}"]`);if(n){const s=n.closest(".input-group");if(s){s.classList.add("error"),s.querySelectorAll(".error-message").forEach(c=>c.remove());const o=document.createElement("div");o.className="error-message",o.innerHTML=`<span class="error-icon">⚠️</span> ${i[0]}`,s.appendChild(o)}}})}function rt(a){a.querySelectorAll(".input-group.error").forEach(e=>{e.classList.remove("error"),e.querySelectorAll(".error-message").forEach(t=>t.remove())})}function Q(a,e){var o,c;console.log(`=== EXTRACTING ${e.toUpperCase()} DRIVERS ===`),console.log("Full response:",a);let t=null;if(e==="ICH"?(t=((o=a.ich_prediction)==null?void 0:o.drivers)||null,console.log("🧠 ICH raw drivers extracted:",t)):e==="LVO"&&(t=((c=a.lvo_prediction)==null?void 0:c.drivers)||null,console.log("🩸 LVO raw drivers extracted:",t)),!t)return console.log(`❌ No ${e} drivers found`),null;const i=ot(t,e);console.log(`✅ ${e} drivers formatted:`,i);const s=[...i.positive,...i.negative].find(l=>l.label&&(l.label.toLowerCase().includes("fast")||l.label.includes("fast_ed")));return s?console.log(`🎯 FAST-ED found in ${e}:`,`${s.label}: ${s.weight>0?"+":""}${s.weight.toFixed(4)}`):console.log(`⚠️  FAST-ED NOT found in ${e} drivers`),i}function ot(a,e){console.log(`🔄 Formatting ${e} drivers from dictionary:`,a);const t=[],i=[];return Object.entries(a).forEach(([n,s])=>{typeof s=="number"&&(s>0?t.push({label:n,weight:s}):s<0&&i.push({label:n,weight:Math.abs(s)}))}),t.sort((n,s)=>s.weight-n.weight),i.sort((n,s)=>s.weight-n.weight),console.log(`📈 ${e} positive drivers:`,t.slice(0,5)),console.log(`📉 ${e} negative drivers:`,i.slice(0,5)),{kind:"flat_dictionary",units:"logit",positive:t,negative:i,meta:{}}}function X(a,e){var i,n;console.log(`=== EXTRACTING ${e.toUpperCase()} PROBABILITY ===`);let t=0;return e==="ICH"?(t=((i=a.ich_prediction)==null?void 0:i.probability)||0,console.log("🧠 ICH probability extracted:",t)):e==="LVO"&&(t=((n=a.lvo_prediction)==null?void 0:n.probability)||0,console.log("🩸 LVO probability extracted:",t)),t}function ee(a,e){var i,n;let t=.85;return e==="ICH"?t=((i=a.ich_prediction)==null?void 0:i.confidence)||.85:e==="LVO"&&(t=((n=a.lvo_prediction)==null?void 0:n.confidence)||.85),t}async function lt(){console.log("Warming up Cloud Functions...");const a=Object.values(w).map(async e=>{try{const t=new AbortController,i=setTimeout(()=>t.abort(),3e3);await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({}),signal:t.signal,mode:"cors"}),clearTimeout(i),console.log(`Warmed up: ${e}`)}catch{console.log(`Warm-up attempt for ${e.split("/").pop()} completed`)}});Promise.all(a).then(()=>{console.log("Cloud Functions warm-up complete")})}class S extends Error{constructor(e,t,i){super(e),this.name="APIError",this.status=t,this.url=i}}function q(a){const e={...a};return Object.keys(e).forEach(t=>{const i=e[t];(typeof i=="boolean"||i==="on"||i==="true"||i==="false")&&(e[t]=i===!0||i==="on"||i==="true"?1:0)}),e}function x(a,e=0){const t=parseFloat(a);return isNaN(t)?e:t}async function K(a,e){const t=new AbortController,i=setTimeout(()=>t.abort(),V.requestTimeout);try{const n=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(e),signal:t.signal,mode:"cors"});if(clearTimeout(i),!n.ok){let o=`HTTP ${n.status}`;try{const c=await n.json();o=c.error||c.message||o}catch{o=`${o}: ${n.statusText}`}throw new S(o,n.status,a)}return await n.json()}catch(n){throw clearTimeout(i),n.name==="AbortError"?new S("Request timeout - please try again",408,a):n instanceof S?n:new S("Network error - please check your connection and try again",0,a)}}async function ct(a){const e=q(a);console.log("Coma ICH API Payload:",e);try{const t=await K(w.COMA_ICH,e);return console.log("Coma ICH API Response:",t),{probability:x(t.probability||t.ich_probability,0),drivers:t.drivers||null,confidence:x(t.confidence,.75),module:"Coma"}}catch(t){throw console.error("Coma ICH prediction failed:",t),new S(`Failed to get ICH prediction: ${t.message}`,t.status,w.COMA_ICH)}}async function dt(a){const e={age_years:a.age_years,systolic_bp:a.systolic_bp,diastolic_bp:a.diastolic_bp,gfap_value:a.gfap_value,vigilanzminderung:a.vigilanzminderung||0},t=q(e);console.log("Limited Data ICH API Payload:",t);try{const i=await K(w.LDM_ICH,t);return console.log("Limited Data ICH API Response:",i),{probability:x(i.probability||i.ich_probability,0),drivers:i.drivers||null,confidence:x(i.confidence,.65),module:"Limited Data"}}catch(i){throw console.error("Limited Data ICH prediction failed:",i),new S(`Failed to get ICH prediction: ${i.message}`,i.status,w.LDM_ICH)}}async function ut(a){var i,n,s,o,c,l;const e={age_years:a.age_years,systolic_bp:a.systolic_bp,diastolic_bp:a.diastolic_bp,gfap_value:a.gfap_value,fast_ed_score:a.fast_ed_score,headache:a.headache||0,vigilanzminderung:a.vigilanzminderung||0,armparese:a.armparese||0,beinparese:a.beinparese||0,eye_deviation:a.eye_deviation||0,atrial_fibrillation:a.atrial_fibrillation||0,anticoagulated_noak:a.anticoagulated_noak||0,antiplatelets:a.antiplatelets||0},t=q(e);console.log("=== BACKEND DATA MAPPING TEST ==="),console.log("📤 Full Stroke API Payload:",t),console.log("🧪 Clinical Variables Being Sent:"),console.log("  📊 FAST-ED Score:",t.fast_ed_score),console.log("  🩸 Systolic BP:",t.systolic_bp),console.log("  🩸 Diastolic BP:",t.diastolic_bp),console.log("  🧬 GFAP Value:",t.gfap_value),console.log("  👤 Age:",t.age_years),console.log("  🤕 Headache:",t.headache),console.log("  😵 Vigilanz:",t.vigilanzminderung),console.log("  💪 Arm Parese:",t.armparese),console.log("  🦵 Leg Parese:",t.beinparese),console.log("  👁️ Eye Deviation:",t.eye_deviation),console.log("  💓 Atrial Fib:",t.atrial_fibrillation),console.log("  💊 Anticoag NOAK:",t.anticoagulated_noak),console.log("  💊 Antiplatelets:",t.antiplatelets);try{const d=await K(w.FULL_STROKE,t);console.log("📥 Full Stroke API Response:",d),console.log("🔑 Available keys in response:",Object.keys(d)),console.log("=== BACKEND MAPPING VERIFICATION ===");const u=JSON.stringify(d).toLowerCase();console.log("🔍 Backend Feature Name Analysis:"),console.log('  Contains "fast":',u.includes("fast")),console.log('  Contains "ed":',u.includes("ed")),console.log('  Contains "fast_ed":',u.includes("fast_ed")),console.log('  Contains "systolic":',u.includes("systolic")),console.log('  Contains "diastolic":',u.includes("diastolic")),console.log('  Contains "gfap":',u.includes("gfap")),console.log('  Contains "age":',u.includes("age")),console.log('  Contains "headache":',u.includes("headache")),console.log("🧠 ICH driver sources:"),console.log("  response.ich_prediction?.drivers:",(i=d.ich_prediction)==null?void 0:i.drivers),console.log("  response.ich_drivers:",d.ich_drivers),console.log("  response.ich?.drivers:",(n=d.ich)==null?void 0:n.drivers),console.log("  response.drivers?.ich:",(s=d.drivers)==null?void 0:s.ich),console.log("🩸 LVO driver sources:"),console.log("  response.lvo_prediction?.drivers:",(o=d.lvo_prediction)==null?void 0:o.drivers),console.log("  response.lvo_drivers:",d.lvo_drivers),console.log("  response.lvo?.drivers:",(c=d.lvo)==null?void 0:c.drivers),console.log("  response.drivers?.lvo:",(l=d.drivers)==null?void 0:l.lvo),Object.keys(d).forEach(k=>{const v=d[k];typeof v=="number"&&v>=0&&v<=1&&console.log(`Potential probability field: ${k} = ${v}`)});const p=X(d,"ICH"),b=X(d,"LVO"),f=Q(d,"ICH"),m=Q(d,"LVO"),h=ee(d,"ICH"),T=ee(d,"LVO");return console.log("✅ Clean extraction results:"),console.log("  ICH:",{probability:p,hasDrivers:!!f}),console.log("  LVO:",{probability:b,hasDrivers:!!m}),{ich:{probability:p,drivers:f,confidence:h,module:"Full Stroke"},lvo:{probability:b,drivers:m,confidence:T,module:"Full Stroke"}}}catch(d){throw console.error("Full Stroke prediction failed:",d),new S(`Failed to get stroke predictions: ${d.message}`,d.status,w.FULL_STROKE)}}const mt=()=>[{id:"acute_deficit",checked:!1},{id:"symptom_onset",checked:!1},{id:"no_preexisting",checked:!1},{id:"no_trauma",checked:!1}];function gt(){const a=mt();return`
    <div id="prerequisitesModal" class="modal prerequisites-modal" style="display: flex;">
      <div class="modal-content prerequisites-content">
        <div class="modal-header">
          <h2>${r("prerequisitesTitle")}</h2>
          <button class="modal-close" id="closePrerequisites">&times;</button>
        </div>
        
        <div class="modal-body">
          <p class="prerequisites-intro">
            ${r("prerequisitesIntro")}
          </p>
          
          <div class="prerequisites-list">
            ${a.map(e=>`
              <div class="prerequisite-item" data-id="${e.id}">
                <label class="toggle-switch">
                  <input type="checkbox" id="${e.id}" class="toggle-input">
                  <span class="toggle-slider"></span>
                </label>
                <span class="prerequisite-label">
                  ${r(e.id)}
                </span>
              </div>
            `).join("")}
          </div>
          
          <div class="prerequisites-warning" id="prerequisitesWarning" style="display: none;">
            <span class="warning-icon">⚠️</span>
            <span class="warning-text">
              ${r("prerequisitesWarning")}
            </span>
          </div>
        </div>
        
        <div class="modal-footer">
          <button type="button" class="secondary" id="cancelPrerequisites">
            ${r("cancel")}
          </button>
          <button type="button" class="primary" id="confirmPrerequisites">
            ${r("continue")}
          </button>
        </div>
      </div>
    </div>
  `}function pt(){const a=document.getElementById("prerequisitesModal");if(!a)return;const e=document.getElementById("closePrerequisites"),t=document.getElementById("cancelPrerequisites"),i=document.getElementById("confirmPrerequisites"),n=()=>{a.style.display="none",N("welcome")};e==null||e.addEventListener("click",n),t==null||t.addEventListener("click",n),i==null||i.addEventListener("click",()=>{const o=a.querySelectorAll(".toggle-input");if(Array.from(o).every(l=>l.checked))a.style.display="none",N("triage2");else{const l=document.getElementById("prerequisitesWarning");l&&(l.style.display="flex",l.classList.add("shake"),setTimeout(()=>l.classList.remove("shake"),500))}});const s=a.querySelectorAll(".toggle-input");s.forEach(o=>{o.addEventListener("change",()=>{const c=Array.from(s).every(d=>d.checked),l=document.getElementById("prerequisitesWarning");c&&l&&(l.style.display="none")})})}function ht(){const a=document.getElementById("prerequisitesModal");a&&a.remove();const e=gt();document.body.insertAdjacentHTML("beforeend",e),pt()}function bt(a){g.logEvent("triage1_answer",{comatose:a}),a?N("coma"):ht()}function ft(a){g.logEvent("triage2_answer",{examinable:a}),N(a?"full":"limited")}function N(a){g.logEvent("navigate",{from:g.getState().currentScreen,to:a}),g.navigate(a),window.scrollTo(0,0)}function vt(){g.hasUnsavedData()&&!confirm("Are you sure you want to start over? All entered data will be lost.")||(g.logEvent("reset"),g.reset())}function yt(){console.log("goBack() called");const a=g.goBack();console.log("goBack() success:",a),a?(g.logEvent("navigate_back"),window.scrollTo(0,0)):(console.log("No history available, going home instead"),ge())}function ge(){console.log("goHome() called"),g.logEvent("navigate_home"),g.goHome(),window.scrollTo(0,0)}async function kt(a,e){a.preventDefault();const t=a.target,i=t.dataset.module,n=st(t);if(!n.isValid){nt(e,n.validationErrors);return}const s={};Array.from(t.elements).forEach(l=>{if(l.name)if(l.type==="checkbox")s[l.name]=l.checked;else if(l.type==="number"){const d=parseFloat(l.value);s[l.name]=isNaN(d)?0:d}else l.type==="hidden"&&l.name==="armparese"?s[l.name]=l.value==="true":s[l.name]=l.value}),console.log("Collected form inputs:",s),g.setFormData(i,s);const o=t.querySelector("button[type=submit]"),c=o?o.innerHTML:"";o&&(o.disabled=!0,o.innerHTML=`<span class="loading-spinner"></span> ${r("analyzing")}`);try{let l;switch(i){case"coma":l={ich:await ct(s),lvo:null};break;case"limited":l={ich:await dt(s),lvo:{notPossible:!0}};break;case"full":l=await ut(s);break;default:throw new Error("Unknown module: "+i)}g.setResults(l),g.logEvent("models_complete",{module:i,results:l}),N("results")}catch(l){console.error("Error running models:",l);let d="An error occurred during analysis. Please try again.";l instanceof S&&(d=l.message),St(e,d),o&&(o.disabled=!1,o.innerHTML=c)}}function St(a,e){a.querySelectorAll(".critical-alert").forEach(n=>{var s,o;(o=(s=n.querySelector("h4"))==null?void 0:s.textContent)!=null&&o.includes("Error")&&n.remove()});const t=document.createElement("div");t.className="critical-alert",t.innerHTML=`<h4><span class="alert-icon">⚠️</span> Error</h4><p>${e}</p>`;const i=a.querySelector(".container");i?i.prepend(t):a.prepend(t),setTimeout(()=>t.remove(),1e4)}function wt(a){const e=document.createElement("div");e.className="sr-only",e.setAttribute("role","status"),e.setAttribute("aria-live","polite");const t={triage1:"Coma assessment",triage2:"Examination capability assessment",coma:"Coma module",limited:"Limited data module",full:"Full stroke assessment",results:"Assessment results"};e.textContent=`Navigated to ${t[a]||a}`,document.body.appendChild(e),setTimeout(()=>e.remove(),1e3)}function Lt(a){const e={triage1:"Initial Assessment - Stroke Triage Assistant",triage2:"Examination Capability - Stroke Triage Assistant",coma:"Coma Module - Stroke Triage Assistant",limited:"Limited Data Module - Stroke Triage Assistant",full:"Full Stroke Module - Stroke Triage Assistant",results:"Assessment Results - Stroke Triage Assistant"};document.title=e[a]||"Stroke Triage Assistant"}function Et(){setTimeout(()=>{const a=document.querySelector("h2");a&&(a.setAttribute("tabindex","-1"),a.focus(),setTimeout(()=>a.removeAttribute("tabindex"),100))},100)}class Tt{constructor(){this.scores={facial_palsy:0,arm_weakness:0,speech_changes:0,eye_deviation:0,denial_neglect:0},this.onApply=null,this.modal=null}getTotal(){return Object.values(this.scores).reduce((e,t)=>e+t,0)}getRiskLevel(){return this.getTotal()>=4?"high":"low"}render(){const e=this.getTotal(),t=this.getRiskLevel();return`
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
    `}setupEventListeners(){if(this.modal=document.getElementById("fastEdModal"),!this.modal)return;this.modal.addEventListener("change",n=>{if(n.target.type==="radio"){const s=n.target.name,o=parseInt(n.target.value);this.scores[s]=o,this.updateDisplay()}});const e=this.modal.querySelector(".modal-close");e==null||e.addEventListener("click",()=>this.close());const t=this.modal.querySelector('[data-action="cancel-fast-ed"]');t==null||t.addEventListener("click",()=>this.close());const i=this.modal.querySelector('[data-action="apply-fast-ed"]');i==null||i.addEventListener("click",()=>this.apply()),this.modal.addEventListener("click",n=>{n.target===this.modal&&this.close()}),document.addEventListener("keydown",n=>{var s;n.key==="Escape"&&((s=this.modal)!=null&&s.classList.contains("show"))&&this.close()})}updateDisplay(){var i,n;const e=(i=this.modal)==null?void 0:i.querySelector(".total-score"),t=(n=this.modal)==null?void 0:n.querySelector(".risk-indicator");if(e&&(e.textContent=`${this.getTotal()}/9`),t){const s=this.getRiskLevel();t.className=`risk-indicator ${s}`,t.textContent=`${r("riskLevel")}: ${r(s==="high"?"riskLevelHigh":"riskLevelLow")}`}}show(e=0,t=null){this.onApply=t,e>0&&e<=9&&this.approximateFromTotal(e),document.getElementById("fastEdModal")?(this.modal.remove(),document.body.insertAdjacentHTML("beforeend",this.render()),this.modal=document.getElementById("fastEdModal")):document.body.insertAdjacentHTML("beforeend",this.render()),this.setupEventListeners(),this.modal.setAttribute("aria-hidden","false"),this.modal.style.display="flex",this.modal.classList.add("show");const i=this.modal.querySelector('input[type="radio"]');i==null||i.focus()}close(){this.modal&&(this.modal.classList.remove("show"),this.modal.style.display="none",this.modal.setAttribute("aria-hidden","true"))}apply(){const e=this.getTotal(),t=this.scores.arm_weakness>0,i=this.scores.eye_deviation>0;this.onApply&&this.onApply({total:e,components:{...this.scores},armWeaknessBoolean:t,eyeDeviationBoolean:i}),this.close()}approximateFromTotal(e){this.scores={facial_palsy:0,arm_weakness:0,speech_changes:0,eye_deviation:0,denial_neglect:0};let t=e;const i=Object.keys(this.scores);for(const n of i){if(t<=0)break;const o=Math.min(t,n==="facial_palsy"?1:2);this.scores[n]=o,t-=o}}}const At=new Tt;function P(a){const e=g.getState(),{currentScreen:t,results:i,startTime:n,navigationHistory:s}=e,o=document.createElement("div"),c=document.getElementById("backButton");c&&(c.style.display=s&&s.length>0?"flex":"none");let l="";switch(t){case"triage1":l=W();break;case"triage2":l=Se();break;case"coma":l=Le();break;case"limited":l=Ee();break;case"full":l=Te();break;case"results":l=Je(i,n);break;default:l=W()}for(o.innerHTML=l,a.innerHTML="";o.firstChild;)a.appendChild(o.firstChild);const d=a.querySelector("form[data-module]");if(d){const u=d.dataset.module;Ct(d,u)}Mt(a),t==="results"&&i&&setTimeout(()=>{Ie(i)},100),setTimeout(()=>{Ye()},150),wt(t),Lt(t),Et()}function Ct(a,e){const t=g.getFormData(e);!t||Object.keys(t).length===0||Object.entries(t).forEach(([i,n])=>{const s=a.elements[i];s&&(s.type==="checkbox"?s.checked=n===!0||n==="on"||n==="true":s.value=n)})}function Mt(a){a.querySelectorAll('input[type="number"]').forEach(n=>{n.addEventListener("blur",()=>{rt(a)})}),a.querySelectorAll("[data-action]").forEach(n=>{n.addEventListener("click",s=>{const{action:o,value:c}=s.currentTarget.dataset,l=c==="true";switch(o){case"triage1":bt(l);break;case"triage2":ft(l);break;case"reset":vt();break;case"goBack":yt();break;case"goHome":ge();break}})}),a.querySelectorAll("form[data-module]").forEach(n=>{n.addEventListener("submit",s=>{kt(s,a)})});const e=a.querySelector("#printResults");e&&e.addEventListener("click",()=>window.print());const t=a.querySelector("#fast_ed_score");t&&(t.addEventListener("click",n=>{n.preventDefault();const s=parseInt(t.value)||0;At.show(s,o=>{t.value=o.total;const c=a.querySelector("#armparese_hidden");c&&(c.value=o.armWeaknessBoolean?"true":"false");const l=a.querySelector("#eye_deviation_hidden");l&&(l.value=o.eyeDeviationBoolean?"true":"false"),t.dispatchEvent(new Event("change",{bubbles:!0}))})}),t.addEventListener("keydown",n=>{n.preventDefault()})),a.querySelectorAll(".info-toggle").forEach(n=>{n.addEventListener("click",s=>{const o=n.dataset.target,c=a.querySelector(`#${o}`),l=n.querySelector(".toggle-arrow");c&&(c.style.display!=="none"?(c.style.display="none",c.classList.remove("show"),n.classList.remove("active"),l.style.transform="rotate(0deg)"):(c.style.display="block",c.classList.add("show"),n.classList.add("active"),l.style.transform="rotate(180deg)"))})})}class $t{constructor(){this.container=null,this.unsubscribe=null}async init(){if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",()=>this.init());return}if(this.container=document.getElementById("appContainer"),!this.container){console.error("App container not found");return}this.unsubscribe=g.subscribe(()=>{P(this.container),setTimeout(()=>this.initializeResearchMode(),200)}),window.addEventListener("languageChanged",()=>{this.updateUILanguage(),P(this.container)}),this.setupGlobalEventListeners(),this.initializeTheme(),this.initializeResearchMode(),this.updateUILanguage(),this.startAutoSave(),this.setupSessionTimeout(),this.setCurrentYear(),this.registerServiceWorker(),lt(),P(this.container),console.log("iGFAP Stroke Triage Assistant initialized")}setupGlobalEventListeners(){const e=document.getElementById("backButton");e&&e.addEventListener("click",()=>{g.goBack(),P(this.container)});const t=document.getElementById("homeButton");t&&t.addEventListener("click",()=>{g.goHome(),P(this.container)});const i=document.getElementById("languageToggle");i&&i.addEventListener("click",()=>this.toggleLanguage());const n=document.getElementById("darkModeToggle");n&&n.addEventListener("click",()=>this.toggleDarkMode());const s=document.getElementById("researchModeToggle");s&&s.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),this.toggleResearchMode()}),this.setupHelpModal(),this.setupFooterLinks(),document.addEventListener("keydown",o=>{if(o.key==="Escape"){const c=document.getElementById("helpModal");c&&c.classList.contains("show")&&(c.classList.remove("show"),c.style.display="none",c.setAttribute("aria-hidden","true"))}}),window.addEventListener("beforeunload",o=>{g.hasUnsavedData()&&(o.preventDefault(),o.returnValue="You have unsaved data. Are you sure you want to leave?")})}setupHelpModal(){const e=document.getElementById("helpButton"),t=document.getElementById("helpModal"),i=t==null?void 0:t.querySelector(".modal-close");if(e&&t){t.classList.remove("show"),t.style.display="none",t.setAttribute("aria-hidden","true"),e.addEventListener("click",()=>{t.style.display="flex",t.classList.add("show"),t.setAttribute("aria-hidden","false")});const n=()=>{t.classList.remove("show"),t.style.display="none",t.setAttribute("aria-hidden","true")};i==null||i.addEventListener("click",n),t.addEventListener("click",s=>{s.target===t&&n()})}}setupFooterLinks(){var e,t;(e=document.getElementById("privacyLink"))==null||e.addEventListener("click",i=>{i.preventDefault(),this.showPrivacyPolicy()}),(t=document.getElementById("disclaimerLink"))==null||t.addEventListener("click",i=>{i.preventDefault(),this.showDisclaimer()})}initializeTheme(){const e=localStorage.getItem("theme"),t=document.getElementById("darkModeToggle");(e==="dark"||!e&&window.matchMedia("(prefers-color-scheme: dark)").matches)&&(document.body.classList.add("dark-mode"),t&&(t.textContent="☀️"))}toggleLanguage(){A.toggleLanguage(),this.updateUILanguage();const e=document.getElementById("languageToggle");if(e){const t=A.getCurrentLanguage();e.textContent=t==="en"?"🇬🇧":"🇩🇪",e.dataset.lang=t}}updateUILanguage(){document.documentElement.lang=A.getCurrentLanguage();const e=document.querySelector(".app-header h1");e&&(e.textContent=r("appTitle"));const t=document.querySelector(".emergency-badge");t&&(t.textContent=r("emergencyBadge"));const i=document.getElementById("languageToggle");i&&(i.title=r("languageToggle"),i.setAttribute("aria-label",r("languageToggle")));const n=document.getElementById("helpButton");n&&(n.title=r("helpButton"),n.setAttribute("aria-label",r("helpButton")));const s=document.getElementById("darkModeToggle");s&&(s.title=r("darkModeButton"),s.setAttribute("aria-label",r("darkModeButton")));const o=document.getElementById("modalTitle");o&&(o.textContent=r("helpTitle"))}toggleDarkMode(){const e=document.getElementById("darkModeToggle");document.body.classList.toggle("dark-mode");const t=document.body.classList.contains("dark-mode");e&&(e.textContent=t?"☀️":"🌙"),localStorage.setItem("theme",t?"dark":"light")}initializeResearchMode(){const e=document.getElementById("researchModeToggle");if(e){const t=this.getCurrentModuleFromResults(),i=t==="limited"||t==="full";e.style.display=i?"flex":"none",e.style.opacity=i?"1":"0.5",console.log(`🔬 Research button visibility: ${i?"VISIBLE":"HIDDEN"} (module: ${t})`)}}getCurrentModuleFromResults(){var i,n;const e=g.getState();if(e.currentScreen!=="results"||!((n=(i=e.results)==null?void 0:i.ich)!=null&&n.module))return null;const t=e.results.ich.module.toLowerCase();return t.includes("coma")?"coma":t.includes("limited")?"limited":t.includes("full")?"full":null}toggleResearchMode(){const e=document.getElementById("researchPanel");if(!e){console.warn("🔬 Research panel not found - likely not on results screen");return}const t=e.style.display!=="none";e.style.display=t?"none":"block";const i=document.getElementById("researchModeToggle");return i&&(i.style.background=t?"rgba(255, 255, 255, 0.1)":"rgba(0, 102, 204, 0.2)"),console.log(`🔬 Research panel ${t?"HIDDEN":"SHOWN"}`),!1}showResearchActivationMessage(){const e=document.createElement("div");e.className="research-activation-toast",e.innerHTML=`
      <div class="toast-content">
        🔬 <strong>Research Mode Activated</strong><br>
        <small>Model comparison features enabled</small>
      </div>
    `,document.body.appendChild(e),setTimeout(()=>{document.body.contains(e)&&document.body.removeChild(e)},3e3)}startAutoSave(){setInterval(()=>{this.saveCurrentFormData()},V.autoSaveInterval)}saveCurrentFormData(){this.container.querySelectorAll("form[data-module]").forEach(t=>{const i=new FormData(t),n=t.dataset.module;if(n){const s={};i.forEach((l,d)=>{const u=t.elements[d];u&&u.type==="checkbox"?s[d]=u.checked:s[d]=l});const o=g.getFormData(n);JSON.stringify(o)!==JSON.stringify(s)&&g.setFormData(n,s)}})}setupSessionTimeout(){setTimeout(()=>{confirm("Your session has been idle for 30 minutes. Would you like to continue?")?this.setupSessionTimeout():g.reset()},V.sessionTimeout)}setCurrentYear(){const e=document.getElementById("currentYear");e&&(e.textContent=new Date().getFullYear())}showPrivacyPolicy(){alert("Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.")}showDisclaimer(){alert("Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.")}async registerServiceWorker(){if(!("serviceWorker"in navigator)){console.log("Service Workers not supported");return}try{const e=await navigator.serviceWorker.register("/0825/sw.js",{scope:"/0825/"});console.log("Service Worker registered successfully:",e),e.addEventListener("updatefound",()=>{const t=e.installing;console.log("New service worker found"),t.addEventListener("statechange",()=>{t.state==="installed"&&navigator.serviceWorker.controller&&(console.log("New service worker installed, update available"),this.showUpdateNotification())})}),navigator.serviceWorker.addEventListener("message",t=>{console.log("Message from service worker:",t.data)})}catch(e){console.error("Service Worker registration failed:",e)}}showUpdateNotification(){const e=document.createElement("div");e.className="modal show update-modal",e.style.cssText=`
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
    `,e.appendChild(t),document.body.appendChild(e);const i=e.querySelector("#updateNow"),n=e.querySelector("#updateLater");i.addEventListener("click",()=>{window.location.reload()}),n.addEventListener("click",()=>{e.remove(),setTimeout(()=>this.showUpdateNotification(),5*60*1e3)}),e.addEventListener("click",s=>{s.target===e&&n.click()})}destroy(){this.unsubscribe&&this.unsubscribe()}}const Pt=new $t;Pt.init();
//# sourceMappingURL=index-On0mJb5l.js.map
