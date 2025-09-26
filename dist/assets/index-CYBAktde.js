var De=Object.defineProperty;var _e=(t,e,i)=>e in t?De(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i;var V=(t,e,i)=>_e(t,typeof e!="symbol"?e+"":e,i);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function i(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(a){if(a.ep)return;a.ep=!0;const n=i(a);fetch(a.href,n)}})();class Ne{constructor(){this.state={currentScreen:"triage1",results:null,sessionId:null,startTime:null,formData:{},validationErrors:{},screenHistory:[]},this.listeners=new Set,this.initialize()}initialize(){this.state.sessionId=this.generateSessionId(),this.state.startTime=Date.now(),console.log("Store initialized with session:",this.state.sessionId)}generateSessionId(){const e=Date.now(),i=new Uint8Array(8);crypto.getRandomValues(i);const s=Array.from(i).map(a=>a.toString(16).padStart(2,"0")).join("");return`session_${e}_${s}`}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}notify(){this.listeners.forEach(e=>e(this.state))}getState(){return{...this.state}}setState(e){this.state={...this.state,...e},this.notify()}navigate(e){console.log(`Navigating from ${this.state.currentScreen} to ${e}`);const i=[...this.state.screenHistory];this.state.currentScreen!==e&&!i.includes(this.state.currentScreen)&&i.push(this.state.currentScreen),this.setState({currentScreen:e,screenHistory:i})}goBack(){const e=[...this.state.screenHistory];if(console.log("goBack() - current history:",e),console.log("goBack() - current screen:",this.state.currentScreen),e.length>0){const i=e.pop();return console.log("goBack() - navigating to:",i),this.setState({currentScreen:i,screenHistory:e}),!0}return console.log("goBack() - no history available"),!1}goHome(){this.setState({currentScreen:"triage1",screenHistory:[]})}setFormData(e,i){const s={...this.state.formData};s[e]={...i},this.setState({formData:s})}getFormData(e){return this.state.formData[e]||{}}setValidationErrors(e){this.setState({validationErrors:e})}clearValidationErrors(){this.setState({validationErrors:{}})}setResults(e){this.setState({results:e})}hasUnsavedData(){return Object.keys(this.state.formData).length>0&&!this.state.results}reset(){const e={currentScreen:"triage1",results:null,sessionId:this.generateSessionId(),startTime:Date.now(),formData:{},validationErrors:{},screenHistory:[]};this.setState(e),console.log("Store reset with new session:",e.sessionId)}logEvent(e,i={}){const s={timestamp:Date.now(),session:this.state.sessionId,event:e,data:i};console.log("Event:",s)}getSessionDuration(){return Date.now()-this.state.startTime}}const h=new Ne;function P(t){const e=[{id:1,label:"Triage"},{id:2,label:"Assessment"},{id:3,label:"Results"}];let i='<div class="progress-indicator">';return e.forEach((s,a)=>{const n=s.id===t,r=s.id<t;i+=`
      <div class="progress-step ${n?"active":""} ${r?"completed":""}">
        ${r?"":s.id}
      </div>
    `,a<e.length-1&&(i+=`<div class="progress-line ${r?"completed":""}"></div>`)}),i+="</div>",i}const re={en:{appTitle:"iGFAP",emergencyBadge:"Emergency Tool",helpButton:"Help and Instructions",darkModeButton:"Toggle dark mode",languageToggle:"Language",step1:"Initial Assessment",step2:"Data Collection",step3:"Results",comaModuleTitle:"Coma Module",limitedDataModuleTitle:"Limited Data Module",fullStrokeModuleTitle:"Full Stroke Module",triage1Title:"Patient Assessment",triage1Question:"Is the patient comatose?",triage1Help:"Glasgow Coma Scale < 9",triage1Yes:"YES - Comatose",triage1No:"NO - Conscious",triage2Title:"Examination Capability",triage2Question:"Can the patient be reliably examined?",triage2Help:"Patient is not aphasic, confused, or uncooperative",triage2Yes:"YES - Full Exam Possible",triage2No:"NO - Limited Exam Only",ageLabel:"Age (years)",ageHelp:"Patient age in years",systolicLabel:"Systolic BP (mmHg)",systolicHelp:"Systolic blood pressure",diastolicLabel:"Diastolic BP (mmHg)",diastolicHelp:"Diastolic blood pressure",gfapLabel:"GFAP Value (pg/mL)",gfapHelp:"GFAP biomarker level",fastEdLabel:"FAST-ED Score",fastEdHelp:"FAST-ED assessment score (0-9)",headacheLabel:"Headache",vigilanzLabel:"Reduced consciousness",armPareseLabel:"Arm weakness",beinPareseLabel:"Leg weakness",eyeDeviationLabel:"Eye deviation",atrialFibLabel:"Atrial fibrillation",anticoagLabel:"Anticoagulated (NOAK)",antiplateletsLabel:"Antiplatelets",analyzeButton:"Analyze",analyzing:"Analyzing...",printResults:"Print Results",newAssessment:"Start New Assessment",startOver:"Start Over",goBack:"Go Back",goHome:"Go Home",basicInformation:"Basic Information",biomarkersScores:"Biomarkers & Scores",clinicalSymptoms:"Clinical Symptoms",medicalHistory:"Medical History",ageYearsLabel:"Age (years)",systolicBpLabel:"Systolic BP (mmHg)",diastolicBpLabel:"Diastolic BP (mmHg)",gfapValueLabel:"GFAP Value (pg/mL)",fastEdScoreLabel:"FAST-ED Score",ageYearsHelp:"Patient's age in years",systolicBpHelp:"Normal: 90-140 mmHg",diastolicBpHelp:"Normal: 60-90 mmHg",gfapTooltip:"Brain injury biomarker",gfapTooltipLong:"Glial Fibrillary Acidic Protein - Brain injury biomarker",gfapRange:"Range: {min} - {max} pg/mL",fastEdTooltip:"0-9 scale for LVO screening",analyzeIchRisk:"Analyze ICH Risk",analyzeStrokeRisk:"Analyze Stroke Risk",criticalPatient:"Critical Patient",comaAlert:"Patient is comatose (GCS < 9). Rapid assessment required.",vigilanceReduction:"Vigilance Reduction (Decreased alertness)",armParesis:"Arm Paresis",legParesis:"Leg Paresis",eyeDeviation:"Eye Deviation",atrialFibrillation:"Atrial Fibrillation",onNoacDoac:"On NOAC/DOAC",onAntiplatelets:"On Antiplatelets",resultsTitle:"Assessment Results",bleedingRiskAssessment:"Bleeding Risk Assessment",ichProbability:"ICH Probability",lvoProbability:"LVO Probability",lvoMayBePossible:"Large vessel occlusion possible - further evaluation recommended",riskFactorsTitle:"Main Risk Factors",increasingRisk:"Increasing Risk",decreasingRisk:"Decreasing Risk",noFactors:"No factors",riskLevel:"Risk Level",lowRisk:"Low Risk",mediumRisk:"Medium Risk",highRisk:"High Risk",riskLow:"Low",riskMedium:"Medium",riskHigh:"High",riskFactorsAnalysis:"Risk Factors",contributingFactors:"Contributing factors to the assessment",riskFactors:"Risk Factors",increaseRisk:"INCREASE",decreaseRisk:"DECREASE",noPositiveFactors:"No increasing factors",noNegativeFactors:"No decreasing factors",ichRiskFactors:"ICH Risk Factors",lvoRiskFactors:"LVO Risk Factors",criticalAlertTitle:"CRITICAL RISK DETECTED",criticalAlertMessage:"High probability of intracerebral hemorrhage detected.",immediateActionsRequired:"Immediate actions required",initiateStrokeProtocol:"Initiate stroke protocol immediately",urgentCtImaging:"Urgent CT imaging required",considerBpManagement:"Consider blood pressure management",prepareNeurosurgicalConsult:"Prepare for potential neurosurgical consultation",helpTitle:"Quick Reference Guide",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 9: Comatose patient - use Coma Module",gcsMod:"GCS 8-12: Moderate impairment",gcsHigh:"GCS 13-15: Mild impairment",fastEdTitle:"FAST-ED Score Components",fastEdFacial:"Facial Palsy: 0-1 points",fastEdArm:"Arm Weakness: 0-2 points",fastEdSpeech:"Speech Changes: 0-2 points",fastEdTime:"Time: Critical factor",fastEdEye:"Eye Deviation: 0-2 points",fastEdDenial:"Denial/Neglect: 0-2 points",criticalValuesTitle:"Critical Values",criticalBp:"Systolic BP > 180: Increased ICH risk",criticalGfap:"GFAP > 500 pg/mL: Significant marker",criticalFastEd:"FAST-ED ≥ 4: Consider LVO",fastEdCalculatorTitle:"FAST-ED Score Calculator",fastEdCalculatorSubtitle:"Click to calculate FAST-ED score components",facialPalsyTitle:"Facial Palsy",facialPalsyNormal:"Normal (0)",facialPalsyMild:"Present (1)",armWeaknessTitle:"Arm Weakness",armWeaknessNormal:"Normal (0)",armWeaknessMild:"Mild weakness or drift (1)",armWeaknessSevere:"Severe weakness or falls immediately (2)",speechChangesTitle:"Speech Abnormalities",speechChangesNormal:"Normal (0)",speechChangesMild:"Mild dysarthria or aphasia (1)",speechChangesSevere:"Severe dysarthria or aphasia (2)",eyeDeviationTitle:"Eye Deviation",eyeDeviationNormal:"Normal (0)",eyeDeviationPartial:"Partial gaze deviation (1)",eyeDeviationForced:"Forced gaze deviation (2)",denialNeglectTitle:"Denial/Neglect",denialNeglectNormal:"Normal (0)",denialNeglectPartial:"Partial neglect (1)",denialNeglectComplete:"Complete neglect (2)",totalScoreTitle:"Total FAST-ED Score",riskLevel:"Risk Level",riskLevelLow:"LOW (Score <4)",riskLevelHigh:"HIGH (Score ≥4 - Consider LVO)",applyScore:"Apply Score",cancel:"Cancel",riskAnalysis:"Risk Analysis",riskAnalysisSubtitle:"Clinical factors in this assessment",contributingFactors:"Contributing factors",factorsShown:"shown",positiveFactors:"Positive factors",negativeFactors:"Negative factors",clinicalInformation:"Clinical Information",clinicalRecommendations:"Clinical Recommendations",clinicalRec1:"Consider immediate imaging if ICH risk is high",clinicalRec2:"Activate stroke team for LVO scores ≥ 50%",clinicalRec3:"Monitor blood pressure closely",clinicalRec4:"Document all findings thoroughly",noDriverData:"No driver data available",driverAnalysisUnavailable:"Driver analysis unavailable",driverInfoNotAvailable:"Driver information not available from this prediction model",driverAnalysisNotAvailable:"Driver analysis not available for this prediction",lvoNotPossible:"LVO assessment not possible with limited data",fullExamRequired:"Full neurological examination required for LVO screening",limitedAssessment:"Limited Assessment",disclaimer:"Clinical Disclaimer",disclaimerText:"This tool is for clinical decision support only. Always use clinical judgment and follow local protocols. Not a replacement for physician assessment.",importantNote:"Important",importantText:"These results are for clinical decision support only. Always use clinical judgment and follow institutional protocols.",predictedMortality:"Predicted 30-day mortality",ichVolumeLabel:"ICH Volume",references:"References",inputSummaryTitle:"Input Summary",inputSummarySubtitle:"Values used for this analysis",privacyLink:"Privacy Policy",disclaimerLink:"Medical Disclaimer",versionLink:"Version 2.1.0 - Research Preview",privacyPolicy:"Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.",medicalDisclaimer:"Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.",networkError:"Network error - please check your connection and try again",requestTimeout:"Request timeout - please try again",apiError:"Failed to get results",validationError:"Please check your input values",sessionTimeout:"Your session has been idle for 30 minutes. Would you like to continue?",unsavedData:"You have unsaved data. Are you sure you want to leave?",nearestCentersTitle:"Nearest Stroke Centers",useCurrentLocation:"Use Current Location",enterLocationPlaceholder:"Enter city or address...",enterManually:"Enter Location Manually",search:"Search",yourLocation:"Your Location",recommendedCenters:"Recommended Centers",alternativeCenters:"Alternative Centers",noCentersFound:"No stroke centers found in this area",gettingLocation:"Getting your location",searchingLocation:"Searching location",locationError:"Unable to get your location",locationPermissionDenied:"Location access denied. Please allow location access and try again.",locationUnavailable:"Location information is unavailable",locationTimeout:"Location request timed out",geolocationNotSupported:"Geolocation is not supported by this browser",geocodingNotImplemented:"Location search not available. Please use GPS or enter coordinates manually.",tryManualEntry:"Try entering your location manually or use GPS.",distanceNote:"Distances are calculated as straight-line distances. Actual travel times may vary.",travelTimeNote:"Travel times calculated for emergency vehicles with sirens and priority routing.",calculatingTravelTimes:"Calculating travel times",minutes:"min",poweredByOrs:"Travel times powered by OpenRoute Service",comprehensiveCenter:"Comprehensive Stroke Center",primaryCenter:"Primary Stroke Center",telemetryCenter:"Telemedicine Center",thrombectomy:"Thrombectomy",neurosurgery:"Neurosurgery",icu:"Intensive Care",telemedicine:"Telemedicine",stroke_unit:"Stroke Unit",call:"Call",directions:"Directions",emergency:"Emergency",certified:"Certified",prerequisitesTitle:"Prerequisites for Stroke Triage",prerequisitesIntro:"Please confirm that all of the following prerequisites are met:",prerequisitesWarning:"All prerequisites must be met to continue",continue:"Continue",acute_deficit:"Acute (severe) neurological deficit present",symptom_onset:"Symptom onset within 6 hours",no_preexisting:"No pre-existing severe neurological deficits",no_trauma:"No traumatic brain injury present",differentialDiagnoses:"Differential Diagnoses",reconfirmTimeWindow:"Please reconfirm time window!",unclearTimeWindow:"With unclear/extended time window, early demarcated brain infarction is also possible",rareDiagnoses:"Rare diagnoses such as glioblastoma are also possible"},de:{appTitle:"iGFAP",emergencyBadge:"Notfall-Tool",helpButton:"Hilfe und Anweisungen",darkModeButton:"Dunklen Modus umschalten",languageToggle:"Sprache",step1:"Erstbeurteilung",step2:"Datenerhebung",step3:"Ergebnisse",comaModuleTitle:"Koma-Modul",limitedDataModuleTitle:"Begrenzte Daten Modul",fullStrokeModuleTitle:"Vollständiges Schlaganfall-Modul",triage1Title:"Patientenbeurteilung",triage1Question:"Ist der Patient komatös?",triage1Help:"Glasgow Coma Scale < 9",triage1Yes:"JA - Komatös",triage1No:"NEIN - Bei Bewusstsein",triage2Title:"Untersuchungsfähigkeit",triage2Question:"Kann der Patient zuverlässig untersucht werden?",triage2Help:"Patient ist nicht aphasisch, verwirrt oder unkooperativ",triage2Yes:"JA - Vollständige Untersuchung möglich",triage2No:"NEIN - Nur begrenzte Untersuchung",ageLabel:"Alter (Jahre)",ageHelp:"Patientenalter in Jahren",systolicLabel:"Systolischer RR (mmHg)",systolicHelp:"Systolischer Blutdruck",diastolicLabel:"Diastolischer RR (mmHg)",diastolicHelp:"Diastolischer Blutdruck",gfapLabel:"GFAP-Wert (pg/mL)",gfapHelp:"GFAP-Biomarker-Wert",fastEdLabel:"FAST-ED-Score",fastEdHelp:"FAST-ED-Bewertungsscore (0-9)",headacheLabel:"Kopfschmerzen",vigilanzLabel:"Bewusstseinstrübung",armPareseLabel:"Armschwäche",beinPareseLabel:"Beinschwäche",eyeDeviationLabel:"Blickdeviation",atrialFibLabel:"Vorhofflimmern",anticoagLabel:"Antikoaguliert (NOAK)",antiplateletsLabel:"Thrombozytenaggregationshemmer",analyzeButton:"Analysieren",analyzing:"Analysiere...",printResults:"Ergebnisse drucken",newAssessment:"Neue Bewertung starten",startOver:"Von vorn beginnen",goBack:"Zurück",goHome:"Zur Startseite",basicInformation:"Grundinformationen",biomarkersScores:"Biomarker & Scores",clinicalSymptoms:"Klinische Symptome",medicalHistory:"Anamnese",ageYearsLabel:"Alter (Jahre)",systolicBpLabel:"Systolischer RR (mmHg)",diastolicBpLabel:"Diastolischer RR (mmHg)",gfapValueLabel:"GFAP-Wert (pg/mL)",fastEdScoreLabel:"FAST-ED-Score",ageYearsHelp:"Patientenalter in Jahren",systolicBpHelp:"Normal: 90-140 mmHg",diastolicBpHelp:"Normal: 60-90 mmHg",gfapTooltip:"Hirnverletzungs-Biomarker",gfapTooltipLong:"Glial Fibrillary Acidic Protein - Hirnverletzungs-Biomarker",gfapRange:"Bereich: {min} - {max} pg/mL",fastEdTooltip:"0-9 Skala für LVO-Screening",analyzeIchRisk:"ICB-Risiko analysieren",analyzeStrokeRisk:"Schlaganfall-Risiko analysieren",criticalPatient:"Kritischer Patient",comaAlert:"Patient ist komatös (GCS < 9). Schnelle Beurteilung erforderlich.",vigilanceReduction:"Vigilanzminderung (Verminderte Wachheit)",armParesis:"Armparese",legParesis:"Beinparese",eyeDeviation:"Blickdeviation",atrialFibrillation:"Vorhofflimmern",onNoacDoac:"NOAK/DOAK-Therapie",onAntiplatelets:"Thrombozytenaggregationshemmer",resultsTitle:"Bewertungsergebnisse",bleedingRiskAssessment:"Blutungsrisiko-Bewertung",ichProbability:"ICB-Risiko",lvoProbability:"LVO-Risiko",lvoMayBePossible:"Großgefäßverschluss möglich - weitere Abklärung empfohlen",riskFactorsTitle:"Hauptrisikofaktoren",increasingRisk:"Risikoerhöhend",decreasingRisk:"Risikomindernd",noFactors:"Keine Faktoren",riskLevel:"Risikostufe",lowRisk:"Niedriges Risiko",mediumRisk:"Mittleres Risiko",highRisk:"Hohes Risiko",riskLow:"Niedrig",riskMedium:"Mittel",riskHigh:"Hoch",riskFactorsAnalysis:"Risikofaktoren",contributingFactors:"Beitragende Faktoren zur Bewertung",riskFactors:"Risikofaktoren",increaseRisk:"ERHÖHEN",decreaseRisk:"VERRINGERN",noPositiveFactors:"Keine erhöhenden Faktoren",noNegativeFactors:"Keine verringernden Faktoren",ichRiskFactors:"ICB-Risikofaktoren",lvoRiskFactors:"LVO-Risikofaktoren",criticalAlertTitle:"KRITISCHES RISIKO ERKANNT",criticalAlertMessage:"Hohe Wahrscheinlichkeit einer intrazerebralen Blutung erkannt.",immediateActionsRequired:"Sofortige Maßnahmen erforderlich",initiateStrokeProtocol:"Schlaganfall-Protokoll sofort einleiten",urgentCtImaging:"Dringende CT-Bildgebung erforderlich",considerBpManagement:"Blutdruckmanagement erwägen",prepareNeurosurgicalConsult:"Neurochirurgische Konsultation vorbereiten",helpTitle:"Kurzreferenzleitfaden",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 9: Komatöser Patient - Koma-Modul verwenden",gcsMod:"GCS 8-12: Mäßige Beeinträchtigung",gcsHigh:"GCS 13-15: Leichte Beeinträchtigung",fastEdTitle:"FAST-ED-Score-Komponenten",fastEdFacial:"Faziale Parese: 0-1 Punkte",fastEdArm:"Armschwäche: 0-2 Punkte",fastEdSpeech:"Sprachveränderungen: 0-2 Punkte",fastEdTime:"Zeit: Kritischer Faktor",fastEdEye:"Blickdeviation: 0-2 Punkte",fastEdDenial:"Verneinung/Neglect: 0-2 Punkte",criticalValuesTitle:"Kritische Werte",criticalBp:"Systolischer RR > 180: Erhöhtes ICB-Risiko",criticalGfap:"GFAP > 500 pg/mL: Signifikanter Marker",criticalFastEd:"FAST-ED ≥ 4: LVO in Betracht ziehen",fastEdCalculatorTitle:"FAST-ED-Score-Rechner",fastEdCalculatorSubtitle:"Klicken Sie, um FAST-ED-Score-Komponenten zu berechnen",facialPalsyTitle:"Fazialisparese",facialPalsyNormal:"Normal (0)",facialPalsyMild:"Vorhanden (1)",armWeaknessTitle:"Armschwäche",armWeaknessNormal:"Normal (0)",armWeaknessMild:"Leichte Schwäche oder Absinken (1)",armWeaknessSevere:"Schwere Schwäche oder fällt sofort ab (2)",speechChangesTitle:"Sprachstörungen",speechChangesNormal:"Normal (0)",speechChangesMild:"Leichte Dysarthrie oder Aphasie (1)",speechChangesSevere:"Schwere Dysarthrie oder Aphasie (2)",eyeDeviationTitle:"Blickdeviation",eyeDeviationNormal:"Normal (0)",eyeDeviationPartial:"Partielle Blickdeviation (1)",eyeDeviationForced:"Forcierte Blickdeviation (2)",denialNeglectTitle:"Verneinung/Neglect",denialNeglectNormal:"Normal (0)",denialNeglectPartial:"Partieller Neglect (1)",denialNeglectComplete:"Kompletter Neglect (2)",totalScoreTitle:"Gesamt-FAST-ED-Score",riskLevel:"Risikostufe",riskLevelLow:"NIEDRIG (Score <4)",riskLevelHigh:"HOCH (Score ≥4 - LVO erwägen)",applyScore:"Score Anwenden",cancel:"Abbrechen",riskAnalysis:"Risikoanalyse",riskAnalysisSubtitle:"Klinische Faktoren in dieser Bewertung",contributingFactors:"Beitragende Faktoren",factorsShown:"angezeigt",positiveFactors:"Positive Faktoren",negativeFactors:"Negative Faktoren",clinicalInformation:"Klinische Informationen",clinicalRecommendations:"Klinische Empfehlungen",clinicalRec1:"Sofortige Bildgebung erwägen bei hohem ICB-Risiko",clinicalRec2:"Stroke-Team aktivieren bei LVO-Score ≥ 50%",clinicalRec3:"Blutdruck engmaschig überwachen",clinicalRec4:"Alle Befunde gründlich dokumentieren",noDriverData:"Keine Treiberdaten verfügbar",driverAnalysisUnavailable:"Treiberanalyse nicht verfügbar",driverInfoNotAvailable:"Treiberinformationen von diesem Vorhersagemodell nicht verfügbar",driverAnalysisNotAvailable:"Treiberanalyse für diese Vorhersage nicht verfügbar",lvoNotPossible:"LVO-Bewertung mit begrenzten Daten nicht möglich",fullExamRequired:"Vollständige neurologische Untersuchung für LVO-Screening erforderlich",limitedAssessment:"Begrenzte Bewertung",disclaimer:"Klinischer Haftungsausschluss",disclaimerText:"Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle. Kein Ersatz für ärztliche Beurteilung.",importantNote:"Wichtig",importantText:"Diese Ergebnisse dienen nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie institutionelle Protokolle.",predictedMortality:"Vorhergesagte 30-Tage-Mortalität",ichVolumeLabel:"ICB-Volumen",references:"Referenzen",inputSummaryTitle:"Eingabezusammenfassung",inputSummarySubtitle:"Für diese Analyse verwendete Werte",privacyLink:"Datenschutzrichtlinie",disclaimerLink:"Medizinischer Haftungsausschluss",versionLink:"Version 2.1.0 - Research Preview",privacyPolicy:"Datenschutzrichtlinie: Dieses Tool verarbeitet Daten lokal. Keine Patientendaten werden gespeichert oder übertragen.",medicalDisclaimer:"Medizinischer Haftungsausschluss: Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle.",networkError:"Netzwerkfehler - bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut",requestTimeout:"Anfrage-Timeout - bitte versuchen Sie es erneut",apiError:"Ergebnisse konnten nicht abgerufen werden",validationError:"Bitte überprüfen Sie Ihre Eingabewerte",sessionTimeout:"Ihre Sitzung war 30 Minuten lang inaktiv. Möchten Sie fortfahren?",unsavedData:"Sie haben ungespeicherte Daten. Sind Sie sicher, dass Sie verlassen möchten?",nearestCentersTitle:"Nächstgelegene Schlaganfall-Zentren",useCurrentLocation:"Aktuellen Standort verwenden",enterLocationPlaceholder:"Stadt oder Adresse eingeben...",enterManually:"Standort manuell eingeben",search:"Suchen",yourLocation:"Ihr Standort",recommendedCenters:"Empfohlene Zentren",alternativeCenters:"Alternative Zentren",noCentersFound:"Keine Schlaganfall-Zentren in diesem Bereich gefunden",gettingLocation:"Standort wird ermittelt",searchingLocation:"Standort wird gesucht",locationError:"Standort konnte nicht ermittelt werden",locationPermissionDenied:"Standortzugriff verweigert. Bitte erlauben Sie Standortzugriff und versuchen Sie es erneut.",locationUnavailable:"Standortinformationen sind nicht verfügbar",locationTimeout:"Standortanfrage ist abgelaufen",geolocationNotSupported:"Geolokalisierung wird von diesem Browser nicht unterstützt",geocodingNotImplemented:"Standortsuche nicht verfügbar. Bitte verwenden Sie GPS oder geben Sie Koordinaten manuell ein.",tryManualEntry:"Versuchen Sie, Ihren Standort manuell einzugeben oder GPS zu verwenden.",distanceNote:"Entfernungen werden als Luftlinie berechnet. Tatsächliche Fahrzeiten können variieren.",travelTimeNote:"Fahrzeiten berechnet für Rettungsfahrzeuge mit Sondersignalen und Vorfahrtsberechtigung.",calculatingTravelTimes:"Fahrzeiten werden berechnet",minutes:"Min",poweredByOrs:"Fahrzeiten bereitgestellt von OpenRoute Service",comprehensiveCenter:"Überregionales Schlaganfall-Zentrum",primaryCenter:"Regionales Schlaganfall-Zentrum",telemetryCenter:"Telemedizin-Zentrum",thrombectomy:"Thrombektomie",neurosurgery:"Neurochirurgie",icu:"Intensivstation",telemedicine:"Telemedizin",stroke_unit:"Stroke Unit",call:"Anrufen",directions:"Wegbeschreibung",emergency:"Notfall",certified:"Zertifiziert",prerequisitesTitle:"Voraussetzungen für Schlaganfall-Triage",prerequisitesIntro:"Bitte bestätigen Sie, dass alle folgenden Voraussetzungen erfüllt sind:",prerequisitesWarning:"Alle Voraussetzungen müssen erfüllt sein, um fortzufahren",continue:"Weiter",acute_deficit:"Akutes (schweres) neurologisches Defizit vorhanden",symptom_onset:"Symptombeginn innerhalb 6h",no_preexisting:"Keine vorbestehende schwere neurologische Defizite",no_trauma:"Kein Schädelhirntrauma vorhanden",differentialDiagnoses:"Differentialdiagnosen",reconfirmTimeWindow:"Bitte Zeitfenster rekonfirmieren!",unclearTimeWindow:"Bei unklarem/erweitertem Zeitfenster ist auch ein beginnend demarkierter Hirninfarkt möglich",rareDiagnoses:"Seltene Diagnosen wie ein Glioblastom sind auch möglich"}};class Fe{constructor(){this.supportedLanguages=["en","de"],this.currentLanguage=this.detectLanguage()}detectLanguage(){const e=localStorage.getItem("language");return e&&this.supportedLanguages.includes(e)?e:(navigator.language||navigator.userLanguage).substring(0,2).toLowerCase()==="de"?"de":"en"}getCurrentLanguage(){return this.currentLanguage}setLanguage(e){return this.supportedLanguages.includes(e)?(this.currentLanguage=e,localStorage.setItem("language",e),window.dispatchEvent(new CustomEvent("languageChanged",{detail:{language:e}})),!0):!1}getSupportedLanguages(){return[...this.supportedLanguages]}t(e){return(re[this.currentLanguage]||re.en)[e]||e}toggleLanguage(){const e=this.currentLanguage==="en"?"de":"en";return this.setLanguage(e)}getLanguageDisplayName(e=null){const i=e||this.currentLanguage;return{en:"English",de:"Deutsch"}[i]||i}formatDateTime(e){const i=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(i,{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(e)}formatTime(e){const i=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(i,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(e)}}const L=new Fe,o=t=>L.t(t);function oe(){return`
    <div class="container">
      ${P(1)}
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
  `}function Be(){return`
    <div class="container">
      ${P(1)}
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
  `}const $={COMA_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_coma_ich",LDM_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_limited_data_ich",FULL_STROKE:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_full_stroke"},fe={ich:{medium:25,high:50},lvo:{medium:25,high:50}},w={min:29,max:10001},Y={autoSaveInterval:18e4,sessionTimeout:30*60*1e3,requestTimeout:1e4},xe={age_years:{required:!0,min:0,max:120,type:"integer",medicalCheck:t=>t>=18||"Emergency stroke assessment typically for adults (≥18 years)"},systolic_bp:{required:!0,min:60,max:300,type:"number",medicalCheck:(t,e)=>{const i=e==null?void 0:e.diastolic_bp;return i&&t<=i?"Systolic BP must be higher than diastolic BP":null}},diastolic_bp:{required:!0,min:30,max:200,type:"number",medicalCheck:(t,e)=>{const i=e==null?void 0:e.systolic_bp;return i&&t>=i?"Diastolic BP must be lower than systolic BP":null}},gfap_value:{required:!0,min:w.min,max:w.max,type:"number",medicalCheck:t=>t>5e3?"Extremely high GFAP value - please verify lab result":null},fast_ed_score:{required:!0,min:0,max:9,type:"integer",medicalCheck:t=>t>=4?"High FAST-ED score suggests LVO - consider urgent intervention":null}};function He(){return`
    <div class="container">
      ${P(2)}
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
            <input type="number" id="gfap_value" name="gfap_value" min="${w.min}" max="${w.max}" step="0.1" required aria-describedby="gfap-help">
            <div id="gfap-help" class="input-help">
              ${o("gfapRange").replace("{min}",w.min).replace("{max}",w.max)}
            </div>
          </div>
        </div>
        <button type="submit" class="primary">${o("analyzeIchRisk")}</button>
        <button type="button" class="secondary" data-action="reset">${o("startOver")}</button>
      </form>
    </div>
  `}function Oe(){return`
    <div class="container">
      ${P(2)}
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
            <div class="input-with-unit">
              <input type="number" name="systolic_bp" id="systolic_bp" min="60" max="300" required aria-describedby="sbp-help" inputmode="numeric">
              <span class="unit">mmHg</span>
            </div>
            <div id="sbp-help" class="input-help">${o("systolicBpHelp")}</div>
          </div>
          <div class="input-group">
            <label for="diastolic_bp">${o("diastolicBpLabel")}</label>
            <div class="input-with-unit">
              <input type="number" name="diastolic_bp" id="diastolic_bp" min="30" max="200" required aria-describedby="dbp-help" inputmode="numeric">
              <span class="unit">mmHg</span>
            </div>
            <div id="dbp-help" class="input-help">${o("diastolicBpHelp")}</div>
          </div>
          <div class="input-group">
            <label for="gfap_value">
              ${o("gfapValueLabel")}
              <span class="tooltip">ℹ️
                <span class="tooltiptext">${o("gfapTooltipLong")}</span>
              </span>
            </label>
            <div class="input-with-unit">
              <input type="number" name="gfap_value" id="gfap_value" min="${w.min}" max="${w.max}" step="0.1" required inputmode="decimal">
              <span class="unit">pg/mL</span>
            </div>
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
  `}function Ve(){return`
    <div class="container">
      ${P(2)}
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
            <div class="input-with-unit">
              <input type="number" name="systolic_bp" id="systolic_bp" min="60" max="300" required inputmode="numeric">
              <span class="unit">mmHg</span>
            </div>
          </div>
          <div class="input-group">
            <label for="diastolic_bp">${o("diastolicBpLabel")}</label>
            <div class="input-with-unit">
              <input type="number" name="diastolic_bp" id="diastolic_bp" min="30" max="200" required inputmode="numeric">
              <span class="unit">mmHg</span>
            </div>
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
            <div class="input-with-unit">
              <input type="number" name="gfap_value" id="gfap_value" min="${w.min}" max="${w.max}" step="0.1" required inputmode="decimal">
              <span class="unit">pg/mL</span>
            </div>
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
  `}const qe="modulepreload",ze=function(t){return"/0825/"+t},le={},Ue=function(e,i,s){let a=Promise.resolve();if(i&&i.length>0){document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),c=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));a=Promise.allSettled(i.map(l=>{if(l=ze(l),l in le)return;le[l]=!0;const d=l.endsWith(".css"),g=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${g}`))return;const p=document.createElement("link");if(p.rel=d?"stylesheet":qe,d||(p.as="script"),p.crossOrigin="",p.href=l,c&&p.setAttribute("nonce",c),document.head.appendChild(p),d)return new Promise((v,m)=>{p.addEventListener("load",v),p.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${l}`)))})}))}function n(r){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=r,window.dispatchEvent(c),!c.defaultPrevented)throw r}return a.then(r=>{for(const c of r||[])c.status==="rejected"&&n(c.reason);return e().catch(n)})};function ye(){return`
    <div class="critical-alert">
      <h4><span class="alert-icon">🚨</span> ${o("criticalAlertTitle")}</h4>
      <p>${o("criticalAlertMessage")}</p>
    </div>
  `}const We={age_years:"ageLabel",age:"ageLabel",systolic_bp:"systolicLabel",diastolic_bp:"diastolicLabel",systolic_blood_pressure:"systolicLabel",diastolic_blood_pressure:"diastolicLabel",blood_pressure_systolic:"systolicLabel",blood_pressure_diastolic:"diastolicLabel",gfap_value:"gfapLabel",gfap:"gfapLabel",gfap_level:"gfapLabel",fast_ed_score:"fastEdLabel",fast_ed:"fastEdLabel",fast_ed_total:"fastEdLabel",vigilanzminderung:"vigilanzLabel",vigilance_reduction:"vigilanzLabel",reduced_consciousness:"vigilanzLabel",armparese:"armPareseLabel",arm_paresis:"armPareseLabel",arm_weakness:"armPareseLabel",beinparese:"beinPareseLabel",leg_paresis:"beinPareseLabel",leg_weakness:"beinPareseLabel",eye_deviation:"eyeDeviationLabel",blickdeviation:"eyeDeviationLabel",headache:"headacheLabel",kopfschmerzen:"headacheLabel",atrial_fibrillation:"atrialFibLabel",vorhofflimmern:"atrialFibLabel",anticoagulated_noak:"anticoagLabel",anticoagulation:"anticoagLabel",antiplatelets:"antiplateletsLabel",thrombozytenaggregationshemmer:"antiplateletsLabel"},Ke=[{pattern:/_score$/,replacement:" Score"},{pattern:/_value$/,replacement:" Level"},{pattern:/_bp$/,replacement:" Blood Pressure"},{pattern:/_years?$/,replacement:" (years)"},{pattern:/^ich_/,replacement:"Brain Bleeding "},{pattern:/^lvo_/,replacement:"Large Vessel "},{pattern:/parese$/,replacement:"Weakness"},{pattern:/deviation$/,replacement:"Movement"}];function z(t){if(!t)return"";const e=We[t.toLowerCase()];if(e){const s=o(e);if(s&&s!==e)return s}let i=t.toLowerCase();return Ke.forEach(({pattern:s,replacement:a})=>{i=i.replace(s,a)}),i=i.replace(/_/g," ").replace(/\b\w/g,s=>s.toUpperCase()).trim(),i}function Ge(t){return z(t).replace(/\s*\([^)]*\)\s*/g,"").trim()}function Ye(t,e=""){return t==null||t===""?"":typeof t=="boolean"?t?"✓":"✗":typeof t=="number"?e.includes("bp")||e.includes("blood_pressure")?`${t} mmHg`:e.includes("gfap")?`${t} pg/mL`:e.includes("age")?`${t} years`:e.includes("score")||Number.isInteger(t)?t.toString():t.toFixed(1):t.toString()}function je(t,e){if(console.log("=== DRIVER RENDERING SECTION ==="),console.log("🧠 ICH result received:",{probability:t==null?void 0:t.probability,hasDrivers:!!(t!=null&&t.drivers),module:t==null?void 0:t.module}),console.log("🩸 LVO result received:",{probability:e==null?void 0:e.probability,hasDrivers:!!(e!=null&&e.drivers),module:e==null?void 0:e.module,notPossible:e==null?void 0:e.notPossible}),!(t!=null&&t.drivers)&&!(e!=null&&e.drivers))return console.log("❌ No drivers available for rendering"),"";let i=`
    <div class="drivers-section">
      <div class="drivers-header">
        <h3><span class="driver-header-icon">🎯</span> ${o("riskAnalysis")}</h3>
        <p class="drivers-subtitle">${o("riskAnalysisSubtitle")}</p>
      </div>
      <div class="enhanced-drivers-grid">
  `;return t!=null&&t.drivers&&(console.log("🧠 Rendering ICH drivers panel"),i+=ce(t.drivers,"ICH","ich",t.probability)),e!=null&&e.drivers&&!e.notPossible&&(console.log("🩸 Rendering LVO drivers panel"),i+=ce(e.drivers,"LVO","lvo",e.probability)),i+=`
      </div>
    </div>
  `,i}function ce(t,e,i,s){if(console.log(`--- ${e} Driver Panel Debug ---`),console.log("Raw drivers input:",t),console.log("Title:",e,"Type:",i,"Probability:",s),!t||Object.keys(t).length===0)return console.log(`No drivers data for ${e}`),`
      <div class="enhanced-drivers-panel ${i}">
        <div class="panel-header">
          <div class="panel-icon ${i}">${i==="ich"?"🩸":"🧠"}</div>
          <div class="panel-title">
            <h4>${e} ${o("riskFactors")}</h4>
            <span class="panel-subtitle">${o("noDriverData")}</span>
          </div>
        </div>
        <p class="no-drivers-message">
          ${o("driverInfoNotAvailable")}
        </p>
      </div>
    `;const a=t;if(console.log(`${e} drivers ready for display:`,a),a.kind==="unavailable")return`
      <div class="enhanced-drivers-panel ${i}">
        <div class="panel-header">
          <div class="panel-icon ${i}">${i==="ich"?"🩸":"🧠"}</div>
          <div class="panel-title">
            <h4>${e} ${o("riskFactors")}</h4>
            <span class="panel-subtitle">${o("driverAnalysisUnavailable")}</span>
          </div>
        </div>
        <p class="no-drivers-message">
          ${o("driverAnalysisNotAvailable")}
        </p>
      </div>
    `;const n=a.positive.sort((m,u)=>Math.abs(u.weight)-Math.abs(m.weight)).slice(0,3),r=a.negative.sort((m,u)=>Math.abs(u.weight)-Math.abs(m.weight)).slice(0,3);console.log(`🎯 ${e} Final displayed drivers:`);const c=n.reduce((m,u)=>m+Math.abs(u.weight),0),l=r.reduce((m,u)=>m+Math.abs(u.weight),0);console.log("  Top positive:",n.map(m=>{const u=c>0?(Math.abs(m.weight)/c*100).toFixed(1):"0";return`${m.label}: +${u}% (weight: ${m.weight.toFixed(3)})`})),console.log("  Top negative:",r.map(m=>{const u=l>0?(Math.abs(m.weight)/l*100).toFixed(1):"0";return`${m.label}: -${u}% (weight: ${m.weight.toFixed(3)})`}));const d=Math.max(...n.map(m=>Math.abs(m.weight)),...r.map(m=>Math.abs(m.weight)),.01);let g=`
    <div class="enhanced-drivers-panel ${i}">
      <div class="panel-header">
        <div class="panel-icon ${i}">${i==="ich"?"🩸":"🧠"}</div>
        <div class="panel-title">
          <h4>${e} ${o("riskFactors")}</h4>
          <span class="panel-subtitle">${o("contributingFactors")}</span>
        </div>
      </div>
      
      <div class="drivers-split-view">
        <div class="drivers-column positive-column">
          <div class="column-header">
            <span class="column-icon">↑</span>
            <span class="column-title">${o("increaseRisk")}</span>
          </div>
          <div class="compact-drivers">
  `;const p=n.reduce((m,u)=>m+Math.abs(u.weight),0);n.length>0?n.forEach(m=>{const u=p>0?Math.abs(m.weight)/p*100:0,b=Math.abs(m.weight)/d*100,f=z(m.label);g+=`
        <div class="compact-driver-item">
          <div class="compact-driver-label">${f}</div>
          <div class="compact-driver-bar positive" style="width: ${b}%">
            <span class="compact-driver-value">+${u.toFixed(0)}%</span>
          </div>
        </div>
      `}):g+=`<div class="no-factors">${o("noPositiveFactors")}</div>`,g+=`
          </div>
        </div>
        
        <div class="drivers-column negative-column">
          <div class="column-header">
            <span class="column-icon">↓</span>
            <span class="column-title">${o("decreaseRisk")}</span>
          </div>
          <div class="compact-drivers">
  `;const v=r.reduce((m,u)=>m+Math.abs(u.weight),0);return r.length>0?r.forEach(m=>{const u=v>0?Math.abs(m.weight)/v*100:0,b=Math.abs(m.weight)/d*100,f=z(m.label);g+=`
        <div class="compact-driver-item">
          <div class="compact-driver-label">${f}</div>
          <div class="compact-driver-bar negative" style="width: ${b}%">
            <span class="compact-driver-value">-${u.toFixed(0)}%</span>
          </div>
        </div>
      `}):g+=`<div class="no-factors">${o("noNegativeFactors")}</div>`,g+=`
          </div>
        </div>
      </div>
    </div>
  `,g}const ke={bayern:{neurosurgicalCenters:[{id:"BY-NS-001",name:"LMU Klinikum München - Großhadern",address:"Marchioninistraße 15, 81377 München",coordinates:{lat:48.1106,lng:11.4684},phone:"+49 89 4400-0",emergency:"+49 89 4400-73331",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1440,network:"TEMPiS"},{id:"BY-NS-002",name:"Klinikum rechts der Isar München (TUM)",address:"Ismaninger Str. 22, 81675 München",coordinates:{lat:48.1497,lng:11.6052},phone:"+49 89 4140-0",emergency:"+49 89 4140-2249",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1161,network:"TEMPiS"},{id:"BY-NS-003",name:"Städtisches Klinikum München Schwabing",address:"Kölner Platz 1, 80804 München",coordinates:{lat:48.1732,lng:11.5755},phone:"+49 89 3068-0",emergency:"+49 89 3068-2050",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:648,network:"TEMPiS"},{id:"BY-NS-004",name:"Städtisches Klinikum München Bogenhausen",address:"Englschalkinger Str. 77, 81925 München",coordinates:{lat:48.1614,lng:11.6254},phone:"+49 89 9270-0",emergency:"+49 89 9270-2050",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:689,network:"TEMPiS"},{id:"BY-NS-005",name:"Universitätsklinikum Erlangen",address:"Maximiliansplatz 2, 91054 Erlangen",coordinates:{lat:49.5982,lng:11.0037},phone:"+49 9131 85-0",emergency:"+49 9131 85-39003",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1371,network:"TEMPiS"},{id:"BY-NS-006",name:"Universitätsklinikum Regensburg",address:"Franz-Josef-Strauß-Allee 11, 93053 Regensburg",coordinates:{lat:49.0134,lng:12.0991},phone:"+49 941 944-0",emergency:"+49 941 944-7501",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1042,network:"TEMPiS"},{id:"BY-NS-007",name:"Universitätsklinikum Würzburg",address:"Oberdürrbacher Str. 6, 97080 Würzburg",coordinates:{lat:49.784,lng:9.9721},phone:"+49 931 201-0",emergency:"+49 931 201-24444",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1264,network:"TEMPiS"},{id:"BY-NS-008",name:"Klinikum Nürnberg Nord",address:"Prof.-Ernst-Nathan-Str. 1, 90419 Nürnberg",coordinates:{lat:49.4521,lng:11.0767},phone:"+49 911 398-0",emergency:"+49 911 398-2369",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1368,network:"TEMPiS"},{id:"BY-NS-009",name:"Universitätsklinikum Augsburg",address:"Stenglinstr. 2, 86156 Augsburg",coordinates:{lat:48.3668,lng:10.9093},phone:"+49 821 400-01",emergency:"+49 821 400-2356",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1740,network:"TEMPiS"},{id:"BY-NS-010",name:"Klinikum Aschaffenburg-Alzenau",address:"Am Hasenkopf 1, 63739 Aschaffenburg",coordinates:{lat:49.9737,lng:9.157},phone:"+49 6021 32-0",emergency:"+49 6021 32-2800",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:40,network:"TRANSIT"},{id:"BY-NS-011",name:"Klinikum Landshut",address:"Robert-Koch-Str. 1, 84034 Landshut",coordinates:{lat:48.5665,lng:12.1512},phone:"+49 871 698-0",emergency:"+49 871 698-3333",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:505,network:"TEMPiS"},{id:"BY-NS-012",name:"Klinikum Coburg",address:"Ketschendorfer Str. 33, 96450 Coburg",coordinates:{lat:50.2596,lng:10.9644},phone:"+49 9561 22-0",emergency:"+49 9561 22-6800",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:547,network:"STENO"},{id:"BY-NS-013",name:"Klinikum Passau",address:"Bischof-Pilgrim-Str. 1, 94032 Passau",coordinates:{lat:48.5665,lng:13.4777},phone:"+49 851 5300-0",emergency:"+49 851 5300-2222",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:696,network:"TEMPiS"}],comprehensiveStrokeCenters:[{id:"BY-CS-001",name:"Klinikum Bamberg",address:"Buger Str. 80, 96049 Bamberg",coordinates:{lat:49.8988,lng:10.9027},phone:"+49 951 503-0",emergency:"+49 951 503-11101",thrombectomy:!0,thrombolysis:!0,beds:630,network:"TEMPiS"},{id:"BY-CS-002",name:"Klinikum Bayreuth",address:"Preuschwitzer Str. 101, 95445 Bayreuth",coordinates:{lat:49.9459,lng:11.5779},phone:"+49 921 400-0",emergency:"+49 921 400-5401",thrombectomy:!0,thrombolysis:!0,beds:848,network:"TEMPiS"},{id:"BY-CS-003",name:"Klinikum Coburg",address:"Ketschendorfer Str. 33, 96450 Coburg",coordinates:{lat:50.2596,lng:10.9685},phone:"+49 9561 22-0",emergency:"+49 9561 22-6300",thrombectomy:!0,thrombolysis:!0,beds:522,network:"TEMPiS"}],regionalStrokeUnits:[{id:"BY-RSU-001",name:"Goldberg-Klinik Kelheim",address:"Traubenweg 3, 93309 Kelheim",coordinates:{lat:48.9166,lng:11.8742},phone:"+49 9441 702-0",emergency:"+49 9441 702-6800",thrombolysis:!0,beds:200,network:"TEMPiS"},{id:"BY-RSU-002",name:"DONAUISAR Klinikum Deggendorf",address:"Perlasberger Str. 41, 94469 Deggendorf",coordinates:{lat:48.8372,lng:12.9619},phone:"+49 991 380-0",emergency:"+49 991 380-2201",thrombolysis:!0,beds:450,network:"TEMPiS"},{id:"BY-RSU-003",name:"Klinikum St. Elisabeth Straubing",address:"St.-Elisabeth-Str. 23, 94315 Straubing",coordinates:{lat:48.8742,lng:12.5733},phone:"+49 9421 710-0",emergency:"+49 9421 710-2000",thrombolysis:!0,beds:580,network:"TEMPiS"},{id:"BY-RSU-004",name:"Klinikum Freising",address:"Mainburger Str. 29, 85356 Freising",coordinates:{lat:48.4142,lng:11.7461},phone:"+49 8161 24-0",emergency:"+49 8161 24-2800",thrombolysis:!0,beds:380,network:"TEMPiS"},{id:"BY-RSU-005",name:"Klinikum Landkreis Erding",address:"Bajuwarenstr. 5, 85435 Erding",coordinates:{lat:48.3061,lng:11.9067},phone:"+49 8122 59-0",emergency:"+49 8122 59-2201",thrombolysis:!0,beds:350,network:"TEMPiS"},{id:"BY-RSU-006",name:"Helios Amper-Klinikum Dachau",address:"Krankenhausstr. 15, 85221 Dachau",coordinates:{lat:48.2599,lng:11.4342},phone:"+49 8131 76-0",emergency:"+49 8131 76-2201",thrombolysis:!0,beds:480,network:"TEMPiS"},{id:"BY-RSU-007",name:"Klinikum Fürstenfeldbruck",address:"Dachauer Str. 33, 82256 Fürstenfeldbruck",coordinates:{lat:48.1772,lng:11.2578},phone:"+49 8141 99-0",emergency:"+49 8141 99-2201",thrombolysis:!0,beds:420,network:"TEMPiS"},{id:"BY-RSU-008",name:"Klinikum Ingolstadt",address:"Krumenauerstraße 25, 85049 Ingolstadt",coordinates:{lat:48.7665,lng:11.4364},phone:"+49 841 880-0",emergency:"+49 841 880-2201",thrombolysis:!0,beds:665,network:"TEMPiS"},{id:"BY-RSU-009",name:"Klinikum Passau",address:"Bischof-Pilgrim-Str. 1, 94032 Passau",coordinates:{lat:48.5665,lng:13.4513},phone:"+49 851 5300-0",emergency:"+49 851 5300-2100",thrombolysis:!0,beds:540,network:"TEMPiS"},{id:"BY-RSU-010",name:"Klinikum Landshut",address:"Robert-Koch-Str. 1, 84034 Landshut",coordinates:{lat:48.5436,lng:12.1619},phone:"+49 871 698-0",emergency:"+49 871 698-3333",thrombolysis:!0,beds:790,network:"TEMPiS"},{id:"BY-RSU-011",name:"RoMed Klinikum Rosenheim",address:"Pettenkoferstr. 10, 83022 Rosenheim",coordinates:{lat:47.8567,lng:12.1265},phone:"+49 8031 365-0",emergency:"+49 8031 365-3711",thrombolysis:!0,beds:870,network:"TEMPiS"},{id:"BY-RSU-012",name:"Klinikum Memmingen",address:"Bismarckstr. 23, 87700 Memmingen",coordinates:{lat:47.9833,lng:10.1833},phone:"+49 8331 70-0",emergency:"+49 8331 70-2500",thrombolysis:!0,beds:520,network:"TEMPiS"},{id:"BY-RSU-013",name:"Klinikum Kempten-Oberallgäu",address:"Robert-Weixler-Str. 50, 87439 Kempten",coordinates:{lat:47.7261,lng:10.3097},phone:"+49 831 530-0",emergency:"+49 831 530-2201",thrombolysis:!0,beds:650,network:"TEMPiS"},{id:"BY-RSU-014",name:"Klinikum Aschaffenburg-Alzenau",address:"Am Hasenkopf 1, 63739 Aschaffenburg",coordinates:{lat:49.9747,lng:9.1581},phone:"+49 6021 32-0",emergency:"+49 6021 32-2700",thrombolysis:!0,beds:590,network:"TEMPiS"}],thrombolysisHospitals:[{id:"BY-TH-001",name:"Krankenhaus Vilsbiburg",address:"Sonnenstraße 10, 84137 Vilsbiburg",coordinates:{lat:48.6333,lng:12.2833},phone:"+49 8741 60-0",thrombolysis:!0,beds:180},{id:"BY-TH-002",name:"Krankenhaus Eggenfelden",address:"Pfarrkirchener Str. 5, 84307 Eggenfelden",coordinates:{lat:48.4,lng:12.7667},phone:"+49 8721 98-0",thrombolysis:!0,beds:220}]},badenWuerttemberg:{neurosurgicalCenters:[{id:"BW-NS-001",name:"Universitätsklinikum Freiburg",address:"Hugstetter Str. 55, 79106 Freiburg",coordinates:{lat:48.0025,lng:7.8347},phone:"+49 761 270-0",emergency:"+49 761 270-34010",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1600,network:"FAST"},{id:"BW-NS-002",name:"Universitätsklinikum Heidelberg",address:"Im Neuenheimer Feld 400, 69120 Heidelberg",coordinates:{lat:49.4178,lng:8.6706},phone:"+49 6221 56-0",emergency:"+49 6221 56-36643",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1621,network:"FAST"},{id:"BW-NS-003",name:"Universitätsklinikum Tübingen",address:"Geissweg 3, 72076 Tübingen",coordinates:{lat:48.5378,lng:9.0538},phone:"+49 7071 29-0",emergency:"+49 7071 29-82211",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1550,network:"FAST"},{id:"BW-NS-004",name:"Universitätsklinikum Ulm",address:"Albert-Einstein-Allee 23, 89081 Ulm",coordinates:{lat:48.4196,lng:9.9592},phone:"+49 731 500-0",emergency:"+49 731 500-63001",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1264,network:"FAST"},{id:"BW-NS-005",name:"Klinikum Stuttgart - Katharinenhospital",address:"Kriegsbergstraße 60, 70174 Stuttgart",coordinates:{lat:48.7784,lng:9.1682},phone:"+49 711 278-0",emergency:"+49 711 278-32001",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:950,network:"FAST"},{id:"BW-NS-006",name:"Städtisches Klinikum Karlsruhe",address:"Moltkestraße 90, 76133 Karlsruhe",coordinates:{lat:49.0047,lng:8.3858},phone:"+49 721 974-0",emergency:"+49 721 974-2301",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1570,network:"FAST"},{id:"BW-NS-007",name:"Klinikum Ludwigsburg",address:"Posilipostraße 4, 71640 Ludwigsburg",coordinates:{lat:48.8901,lng:9.1953},phone:"+49 7141 99-0",emergency:"+49 7141 99-67201",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:720,network:"FAST"}],comprehensiveStrokeCenters:[{id:"BW-CS-001",name:"Universitätsmedizin Mannheim",address:"Theodor-Kutzer-Ufer 1-3, 68167 Mannheim",coordinates:{lat:49.4828,lng:8.4664},phone:"+49 621 383-0",emergency:"+49 621 383-2251",thrombectomy:!0,thrombolysis:!0,beds:1400,network:"FAST"}],regionalStrokeUnits:[{id:"BW-RSU-001",name:"Robert-Bosch-Krankenhaus Stuttgart",address:"Auerbachstraße 110, 70376 Stuttgart",coordinates:{lat:48.7447,lng:9.2294},phone:"+49 711 8101-0",emergency:"+49 711 8101-3456",thrombolysis:!0,beds:850,network:"FAST"}],thrombolysisHospitals:[]},nordrheinWestfalen:{neurosurgicalCenters:[{id:"NRW-NS-001",name:"Universitätsklinikum Düsseldorf",address:"Moorenstraße 5, 40225 Düsseldorf",coordinates:{lat:51.1906,lng:6.8064},phone:"+49 211 81-0",emergency:"+49 211 81-17700",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1300,network:"NEVANO+"},{id:"NRW-NS-002",name:"Universitätsklinikum Köln",address:"Kerpener Str. 62, 50937 Köln",coordinates:{lat:50.9253,lng:6.9187},phone:"+49 221 478-0",emergency:"+49 221 478-32500",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1500,network:"NEVANO+"},{id:"NRW-NS-003",name:"Universitätsklinikum Essen",address:"Hufelandstraße 55, 45147 Essen",coordinates:{lat:51.4285,lng:7.0073},phone:"+49 201 723-0",emergency:"+49 201 723-84444",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1350,network:"NEVANO+"},{id:"NRW-NS-004",name:"Universitätsklinikum Münster",address:"Albert-Schweitzer-Campus 1, 48149 Münster",coordinates:{lat:51.9607,lng:7.6261},phone:"+49 251 83-0",emergency:"+49 251 83-47255",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1513,network:"NEVANO+"},{id:"NRW-NS-005",name:"Universitätsklinikum Bonn",address:"Venusberg-Campus 1, 53127 Bonn",coordinates:{lat:50.6916,lng:7.1127},phone:"+49 228 287-0",emergency:"+49 228 287-15107",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1200,network:"NEVANO+"},{id:"NRW-NS-006",name:"Klinikum Dortmund",address:"Beurhausstraße 40, 44137 Dortmund",coordinates:{lat:51.5036,lng:7.4663},phone:"+49 231 953-0",emergency:"+49 231 953-20050",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1200,network:"NVNR"},{id:"NRW-NS-007",name:"Rhein-Maas Klinikum Würselen",address:"Mauerfeldstraße 25, 52146 Würselen",coordinates:{lat:50.8178,lng:6.1264},phone:"+49 2405 62-0",emergency:"+49 2405 62-2222",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:420,network:"NEVANO+"}],comprehensiveStrokeCenters:[{id:"NRW-CS-001",name:"Universitätsklinikum Aachen",address:"Pauwelsstraße 30, 52074 Aachen",coordinates:{lat:50.778,lng:6.0614},phone:"+49 241 80-0",emergency:"+49 241 80-89611",thrombectomy:!0,thrombolysis:!0,beds:1400,network:"NEVANO+"}],regionalStrokeUnits:[{id:"NRW-RSU-001",name:"Helios Universitätsklinikum Wuppertal",address:"Heusnerstraße 40, 42283 Wuppertal",coordinates:{lat:51.2467,lng:7.1703},phone:"+49 202 896-0",emergency:"+49 202 896-2180",thrombolysis:!0,beds:1050,network:"NEVANO+"}],thrombolysisHospitals:[{id:"NRW-TH-009",name:"Elisabeth-Krankenhaus Essen",address:"Klara-Kopp-Weg 1, 45138 Essen",coordinates:{lat:51.4495,lng:7.0137},phone:"+49 201 897-0",thrombolysis:!0,beds:583},{id:"NRW-TH-010",name:"Klinikum Oberberg Gummersbach",address:"Wilhelm-Breckow-Allee 20, 51643 Gummersbach",coordinates:{lat:51.0277,lng:7.5694},phone:"+49 2261 17-0",thrombolysis:!0,beds:431},{id:"NRW-TH-011",name:"St. Vincenz-Krankenhaus Limburg",address:"Auf dem Schafsberg, 65549 Limburg",coordinates:{lat:50.3856,lng:8.0584},phone:"+49 6431 292-0",thrombolysis:!0,beds:452},{id:"NRW-TH-012",name:"Klinikum Lüdenscheid",address:"Paulmannshöher Straße 14, 58515 Lüdenscheid",coordinates:{lat:51.2186,lng:7.6298},phone:"+49 2351 46-0",thrombolysis:!0,beds:869}]}},Je={routePatient:function(t){const{location:e,state:i,ichProbability:s,timeFromOnset:a,clinicalFactors:n}=t,r=i||this.detectState(e),c=ke[r];if(s>=.5){const l=this.findNearest(e,c.neurosurgicalCenters);if(!l)throw new Error(`No neurosurgical centers available in ${r}`);return{category:"NEUROSURGICAL_CENTER",destination:l,urgency:"IMMEDIATE",reasoning:"High bleeding probability (≥50%) - neurosurgical evaluation required",preAlert:"Activate neurosurgery team",bypassLocal:!0,threshold:"≥50%",state:r}}else if(s>=.3){const l=[...c.neurosurgicalCenters,...c.comprehensiveStrokeCenters];return{category:"COMPREHENSIVE_CENTER",destination:this.findNearest(e,l),urgency:"URGENT",reasoning:"Intermediate bleeding risk (30-50%) - CT and possible intervention",preAlert:"Prepare for possible neurosurgical consultation",transferPlan:this.findNearest(e,c.neurosurgicalCenters),threshold:"30-50%",state:r}}else if(a&&a<=270){const l=[...c.neurosurgicalCenters,...c.comprehensiveStrokeCenters,...c.regionalStrokeUnits,...c.thrombolysisHospitals];return{category:"THROMBOLYSIS_CAPABLE",destination:this.findNearest(e,l),urgency:"TIME_CRITICAL",reasoning:"Low bleeding risk (<30%), within tPA window - nearest thrombolysis",preAlert:"Prepare for thrombolysis protocol",bypassLocal:!1,threshold:"<30%",timeWindow:"≤4.5h",state:r}}else{const l=[...c.neurosurgicalCenters,...c.comprehensiveStrokeCenters,...c.regionalStrokeUnits];return{category:"STROKE_UNIT",destination:this.findNearest(e,l),urgency:"STANDARD",reasoning:a>270?"Low bleeding risk, outside tPA window - standard stroke evaluation":"Low bleeding risk - standard stroke evaluation",preAlert:"Standard stroke protocol",bypassLocal:!1,threshold:"<30%",timeWindow:a?">4.5h":"unknown",state:r}}},detectState:function(t){return t.lat>=47.5&&t.lat<=49.8&&t.lng>=7.5&&t.lng<=10.2?"badenWuerttemberg":t.lat>=50.3&&t.lat<=52.5&&t.lng>=5.9&&t.lng<=9.5?"nordrheinWestfalen":t.lat>=47.2&&t.lat<=50.6&&t.lng>=10.2&&t.lng<=13.8?"bayern":this.findNearestState(t)},findNearestState:function(t){const e={bayern:{lat:49,lng:11.5},badenWuerttemberg:{lat:48.5,lng:9},nordrheinWestfalen:{lat:51.5,lng:7.5}};let i="bayern",s=1/0;for(const[a,n]of Object.entries(e)){const r=this.calculateDistance(t,n);r<s&&(s=r,i=a)}return i},findNearest:function(t,e){return!e||e.length===0?(console.warn("No hospitals available in database"),null):e.map(i=>!i.coordinates||typeof i.coordinates.lat!="number"?(console.warn(`Hospital ${i.name} missing valid coordinates`),null):{...i,distance:this.calculateDistance(t,i.coordinates)}).filter(i=>i!==null).sort((i,s)=>i.distance-s.distance)[0]},calculateDistance:function(t,e){const s=this.toRad(e.lat-t.lat),a=this.toRad(e.lng-t.lng),n=Math.sin(s/2)*Math.sin(s/2)+Math.cos(this.toRad(t.lat))*Math.cos(this.toRad(e.lat))*Math.sin(a/2)*Math.sin(a/2);return 6371*(2*Math.atan2(Math.sqrt(n),Math.sqrt(1-n)))},toRad:function(t){return t*(Math.PI/180)}};function U(t,e,i,s){const n=q(i-t),r=q(s-e),c=Math.sin(n/2)*Math.sin(n/2)+Math.cos(q(t))*Math.cos(q(i))*Math.sin(r/2)*Math.sin(r/2);return 6371*(2*Math.atan2(Math.sqrt(c),Math.sqrt(1-c)))}function q(t){return t*(Math.PI/180)}async function Ze(t,e,i,s,a="driving-car"){try{const n=`https://api.openrouteservice.org/v2/directions/${a}`,c=await fetch(n,{method:"POST",headers:{Accept:"application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",Authorization:"5b3ce3597851110001cf624868c4c27b63ae476c9c26c8bffbc35688","Content-Type":"application/json; charset=utf-8"},body:JSON.stringify({coordinates:[[e,t],[s,i]],radiuses:[1e3,1e3],format:"json"})});if(!c.ok)throw new Error(`Routing API error: ${c.status}`);const l=await c.json();if(l.routes&&l.routes.length>0){const d=l.routes[0];return{duration:Math.round(d.summary.duration/60),distance:Math.round(d.summary.distance/1e3),source:"routing"}}else throw new Error("No route found")}catch(n){console.warn("Travel time calculation failed, using distance estimate:",n);const r=U(t,e,i,s);return{duration:Math.round(r/.8),distance:Math.round(r),source:"estimated"}}}async function de(t,e,i,s){try{const a=await Ze(t,e,i,s,"driving-car");return{duration:Math.round(a.duration*.75),distance:a.distance,source:a.source==="routing"?"emergency-routing":"emergency-estimated"}}catch{const n=U(t,e,i,s);return{duration:Math.round(n/1.2),distance:Math.round(n),source:"emergency-estimated"}}}function Se(t){return`
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
  `}function Qe(t){const e=document.getElementById("useGpsButton"),i=document.getElementById("manualLocationButton"),s=document.querySelector(".location-manual"),a=document.getElementById("locationInput"),n=document.getElementById("searchLocationButton"),r=document.getElementById("strokeCenterResults");e&&e.addEventListener("click",()=>{Xe(t,r)}),i&&i.addEventListener("click",()=>{s.style.display=s.style.display==="none"?"block":"none"}),n&&n.addEventListener("click",()=>{const c=a.value.trim();c&&ue(c,t,r)}),a&&a.addEventListener("keypress",c=>{if(c.key==="Enter"){const l=a.value.trim();l&&ue(l,t,r)}})}function Xe(t,e){if(!navigator.geolocation){N(o("geolocationNotSupported"),e);return}e.innerHTML=`<div class="loading">${o("gettingLocation")}...</div>`,navigator.geolocation.getCurrentPosition(i=>{const{latitude:s,longitude:a}=i.coords;j(s,a,t,e)},i=>{let s=o("locationError");switch(i.code){case i.PERMISSION_DENIED:s=o("locationPermissionDenied");break;case i.POSITION_UNAVAILABLE:s=o("locationUnavailable");break;case i.TIMEOUT:s=o("locationTimeout");break}N(s,e)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:3e5})}async function ue(t,e,i){i.innerHTML=`<div class="loading">${o("searchingLocation")}...</div>`;const s=/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/,a=t.trim().match(s);if(a){const n=parseFloat(a[1]),r=parseFloat(a[2]);if(n>=47.2&&n<=52.5&&r>=5.9&&r<=15){i.innerHTML=`
        <div class="location-success">
          <p>📍 Coordinates: ${n.toFixed(4)}, ${r.toFixed(4)}</p>
        </div>
      `,setTimeout(()=>{j(n,r,e,i)},500);return}else{N("Coordinates appear to be outside Germany. Please check the values.",i);return}}try{let n=t.trim();!n.toLowerCase().includes("deutschland")&&!n.toLowerCase().includes("germany")&&!n.toLowerCase().includes("bayern")&&!n.toLowerCase().includes("bavaria")&&!n.toLowerCase().includes("nordrhein")&&!n.toLowerCase().includes("baden")&&(n=n+", Deutschland");const c=`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(n)}&countrycodes=de&format=json&limit=3&addressdetails=1`,l=await fetch(c,{method:"GET",headers:{Accept:"application/json","User-Agent":"iGFAP-StrokeTriage/2.1.0"}});if(!l.ok)throw new Error(`Geocoding API error: ${l.status}`);const d=await l.json();if(d&&d.length>0){let g=d[0];const p=["Bayern","Baden-Württemberg","Nordrhein-Westfalen"];for(const b of d)if(b.address&&p.includes(b.address.state)){g=b;break}const v=parseFloat(g.lat),m=parseFloat(g.lon),u=g.display_name||t;i.innerHTML=`
        <div class="location-success">
          <p>📍 Found: ${u}</p>
          <small style="color: #666;">Lat: ${v.toFixed(4)}, Lng: ${m.toFixed(4)}</small>
        </div>
      `,setTimeout(()=>{j(v,m,e,i)},1e3)}else N(`
        <strong>Location "${t}" not found.</strong><br>
        <small>Try:</small>
        <ul style="text-align: left; font-size: 0.9em; margin: 10px 0;">
          <li>City name: "München", "Köln", "Stuttgart"</li>
          <li>Address: "Marienplatz 1, München"</li>
          <li>Coordinates: "48.1351, 11.5820"</li>
        </ul>
      `,i)}catch(n){console.warn("Geocoding failed:",n),N(`
      <strong>Unable to search location.</strong><br>
      <small>Please try entering coordinates directly (e.g., "48.1351, 11.5820")</small>
    `,i)}}async function j(t,e,i,s){var c,l;const a={lat:t,lng:e},n=Je.routePatient({location:a,ichProbability:((c=i==null?void 0:i.ich)==null?void 0:c.probability)||0,timeFromOnset:(i==null?void 0:i.timeFromOnset)||null,clinicalFactors:(i==null?void 0:i.clinicalFactors)||{}});if(!n||!n.destination){s.innerHTML=`
      <div class="location-error">
        <p>⚠️ No suitable stroke centers found in this area.</p>
        <p><small>Please try a different location or contact emergency services directly.</small></p>
      </div>
    `;return}const r=et(n,i);s.innerHTML=`
    <div class="location-info">
      <p><strong>${o("yourLocation")}:</strong> ${t.toFixed(4)}, ${e.toFixed(4)}</p>
      <p><strong>Detected State:</strong> ${me(n.state)}</p>
    </div>
    <div class="loading">${o("calculatingTravelTimes")}...</div>
  `;try{const d=ke[n.state],g=[...d.neurosurgicalCenters,...d.comprehensiveStrokeCenters,...d.regionalStrokeUnits,...d.thrombolysisHospitals||[]],p=n.destination;p.distance=U(t,e,p.coordinates.lat,p.coordinates.lng);try{const u=await de(t,e,p.coordinates.lat,p.coordinates.lng);p.travelTime=u.duration,p.travelSource=u.source}catch{p.travelTime=Math.round(p.distance/.8),p.travelSource="estimated"}const v=g.filter(u=>u.id!==p.id).map(u=>({...u,distance:U(t,e,u.coordinates.lat,u.coordinates.lng)})).sort((u,b)=>u.distance-b.distance).slice(0,3);for(const u of v)try{const b=await de(t,e,u.coordinates.lat,u.coordinates.lng);u.travelTime=b.duration,u.travelSource=b.source}catch{u.travelTime=Math.round(u.distance/.8),u.travelSource="estimated"}const m=`
      <div class="location-info">
        <p><strong>${o("yourLocation")}:</strong> ${t.toFixed(4)}, ${e.toFixed(4)}</p>
        <p><strong>State:</strong> ${me(n.state)}</p>
        ${r}
      </div>
      
      <div class="recommended-centers">
        <h4>🏥 ${n.urgency==="IMMEDIATE"?"Emergency":"Recommended"} Destination</h4>
        ${ge(p,!0,n)}
      </div>
      
      ${v.length>0?`
        <div class="alternative-centers">
          <h4>Alternative Centers</h4>
          ${v.map(u=>ge(u,!1,n)).join("")}
        </div>
      `:""}
      
      <div class="travel-time-note">
        <small>${o("travelTimeNote")||"Travel times estimated for emergency vehicles"}</small>
      </div>
    `;s.innerHTML=m}catch(d){console.warn("Enhanced routing failed, using basic display:",d),s.innerHTML=`
      <div class="location-info">
        <p><strong>${o("yourLocation")}:</strong> ${t.toFixed(4)}, ${e.toFixed(4)}</p>
        ${r}
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
    `}}function me(t){return{bayern:"Bayern (Bavaria)",badenWuerttemberg:"Baden-Württemberg",nordrheinWestfalen:"Nordrhein-Westfalen (NRW)"}[t]||t}function et(t,e){var a;const i=Math.round((((a=e==null?void 0:e.ich)==null?void 0:a.probability)||0)*100);let s="🏥";return t.urgency==="IMMEDIATE"?s="🚨":t.urgency==="TIME_CRITICAL"?s="⏰":t.urgency==="URGENT"&&(s="⚠️"),`
    <div class="routing-explanation ${t.category.toLowerCase()}">
      <div class="routing-header">
        <strong>${s} ${t.category.replace("_"," ")} - ${t.urgency}</strong>
      </div>
      <div class="routing-details">
        <p><strong>ICH Risk:</strong> ${i}% ${t.threshold?`(${t.threshold})`:""}</p>
        ${t.timeWindow?`<p><strong>Time Window:</strong> ${t.timeWindow}</p>`:""}
        <p><strong>Routing Logic:</strong> ${t.reasoning}</p>
        <p><strong>Pre-Alert:</strong> ${t.preAlert}</p>
        ${t.bypassLocal?'<p class="bypass-warning">⚠️ Bypassing local hospitals</p>':""}
      </div>
    </div>
  `}function ge(t,e,i){const s=[];t.neurosurgery&&s.push("🧠 Neurosurgery"),t.thrombectomy&&s.push("🩸 Thrombectomy"),t.thrombolysis&&s.push("💉 Thrombolysis");const a=t.network?`<span class="network-badge">${t.network}</span>`:"";return`
    <div class="stroke-center-card ${e?"recommended":"alternative"} enhanced">
      <div class="center-header">
        <h5>${t.name}</h5>
        <div class="center-badges">
          ${t.neurosurgery?'<span class="capability-badge neurosurgery">NS</span>':""}
          ${t.thrombectomy?'<span class="capability-badge thrombectomy">TE</span>':""}
          ${a}
        </div>
      </div>
      
      <div class="center-metrics">
        ${t.travelTime?`
          <div class="travel-info">
            <span class="travel-time">${t.travelTime} min</span>
            <span class="distance">${t.distance.toFixed(1)} km</span>
          </div>
        `:`
          <div class="distance-only">
            <span class="distance">${t.distance.toFixed(1)} km</span>
          </div>
        `}
        <div class="bed-info">
          <span class="beds">${t.beds} beds</span>
        </div>
      </div>
      
      <div class="center-details">
        <p class="address">📍 ${t.address}</p>
        <p class="phone">📞 ${t.emergency||t.phone}</p>
        
        ${s.length>0?`
          <div class="capabilities">
            ${s.join(" • ")}
          </div>
        `:""}
      </div>
      
      <div class="center-actions">
        <button class="call-button" onclick="window.open('tel:${t.emergency||t.phone}')">
          📞 Call
        </button>
        <button class="directions-button" onclick="window.open('https://maps.google.com/maps?daddr=${t.coordinates.lat},${t.coordinates.lng}', '_blank')">
          🧭 Directions
        </button>
      </div>
    </div>
  `}function N(t,e){e.innerHTML=`
    <div class="location-error">
      <p>⚠️ ${t}</p>
      <p><small>${o("tryManualEntry")}</small></p>
    </div>
  `}function tt(t,e){const i=Number(t),s=fe[e];return i>=s.high?"🔴 HIGH RISK":i>=s.medium?"🟡 MEDIUM RISK":"🟢 LOW RISK"}const G={moderate:{min:10},high:{min:20},critical:{min:30}};function we(t){if(!t||t<=0)return{volume:0,volumeRange:{min:0,max:0},riskLevel:"low",mortalityRate:"~0%",isValid:!0,calculation:"No hemorrhage detected"};const e=Math.min(t,1e4);t>1e4&&console.warn(`GFAP value ${t} exceeds expected range, capped at 10,000 pg/ml`);try{const i=.0192+.4533*Math.log10(e),s=Math.pow(10,i),a={min:s*.7,max:s*1.3},n=it(s),r=st(s),c=s<1?"<1":s.toFixed(1);return{volume:s,displayVolume:c,volumeRange:{min:a.min.toFixed(1),max:a.max.toFixed(1)},riskLevel:n,mortalityRate:r,isValid:!0,calculation:`Based on GFAP ${t} pg/ml`,threshold:s>=30?"SURGICAL":s>=20?"HIGH_RISK":"MANAGEABLE"}}catch(i){return console.error("Volume calculation error:",i),{volume:0,volumeRange:{min:0,max:0},riskLevel:"low",mortalityRate:"Unknown",isValid:!1,calculation:"Calculation error",error:i.message}}}function it(t){return t>=G.critical.min?"critical":t>=G.high.min?"high":t>=G.moderate.min?"moderate":"low"}function st(t){return t<10?"5-10%⁴":t<30?`${Math.round(10+(t-10)*9/20)}%⁴`:t<50?`${Math.round(19+(t-30)*25/20)}%³`:t<60?`${Math.round(44+(t-50)*47/10)}%²`:t<80?`${Math.round(91+(t-60)*5/20)}%¹`:"96-100%¹"}function at(t){return t<1?"<1 ml":t<10?`${t.toFixed(1)} ml`:`${Math.round(t)} ml`}function nt(t){if(!t||t<=0)return`
      <div class="volume-circle" data-volume="0">
        <div class="volume-number">0<span> ml</span></div>
        <canvas class="volume-canvas" width="120" height="120"></canvas>
      </div>
    `;const e=at(t),i=`volume-canvas-${Math.random().toString(36).substr(2,9)}`;return`
    <div class="volume-circle" data-volume="${t}">
      <div class="volume-number">${e}</div>
      <canvas id="${i}" class="volume-canvas" 
              data-volume="${t}" data-canvas-id="${i}"></canvas>
    </div>
  `}function rt(){document.querySelectorAll(".volume-canvas").forEach(e=>{const i=e.offsetWidth||120,s=e.offsetHeight||120;e.width=i,e.height=s;const a=parseFloat(e.dataset.volume)||0;a>0&&ot(e,a)})}function ot(t,e){const i=t.getContext("2d"),s=t.width/2,a=t.height/2,n=t.width*.45;let r=0,c=!0;const l=document.body.classList.contains("dark-mode")||window.matchMedia("(prefers-color-scheme: dark)").matches;function d(){c&&(i.clearRect(0,0,t.width,t.height),g())}function g(){const u=Math.min(e/80,.9)*(n*1.8),b=a+n-4-u;if(e>0){i.save(),i.beginPath(),i.arc(s,a,n-4,0,Math.PI*2),i.clip(),i.fillStyle="#dc2626",i.globalAlpha=.7,i.fillRect(0,b+5,t.width,t.height),i.globalAlpha=.9,i.fillStyle="#dc2626",i.beginPath();let E=s-n+4;i.moveTo(E,b);for(let S=E;S<=s+n-4;S+=2){const I=Math.sin(S*.05+r*.08)*3,K=Math.sin(S*.08+r*.12+1)*2,H=b+I+K;i.lineTo(S,H)}i.lineTo(s+n-4,t.height),i.lineTo(E,t.height),i.closePath(),i.fill(),i.restore()}const f=getComputedStyle(document.documentElement).getPropertyValue("--text-secondary").trim()||(l?"#8899a6":"#6c757d");i.strokeStyle=f,i.lineWidth=8,i.globalAlpha=.4,i.beginPath(),i.arc(s,a,n,0,Math.PI*2),i.stroke(),i.globalAlpha=1;const y=Math.min(e/100,1),k=getComputedStyle(document.documentElement).getPropertyValue("--danger-color").trim()||"#dc2626";i.strokeStyle=k,i.lineWidth=8,i.setLineDash([]),i.lineCap="round",i.beginPath(),i.arc(s,a,n,-Math.PI/2,-Math.PI/2+y*2*Math.PI),i.stroke(),r+=1,e>0&&requestAnimationFrame(d)}d();const p=new MutationObserver(()=>{document.contains(t)||(c=!1,p.disconnect())});p.observe(document.body,{childList:!0,subtree:!0})}class x{static calculateProbability(e,i){if(!e||!i||e<=0||i<=0)return{probability:0,confidence:0,isValid:!1,reason:"Invalid inputs: age and GFAP required"};if(e<18||e>120)return{probability:0,confidence:0,isValid:!1,reason:`Age ${e} outside valid range (18-120 years)`};(i<10||i>2e4)&&console.warn(`GFAP ${i} outside typical range (10-20000 pg/ml)`);try{const s=(e-this.PARAMS.age.mean)/this.PARAMS.age.std,a=(i-this.PARAMS.gfap.mean)/this.PARAMS.gfap.std,n=this.PARAMS.coefficients.intercept+this.PARAMS.coefficients.age*s+this.PARAMS.coefficients.gfap*a,r=1/(1+Math.exp(-n)),c=r*100,l=Math.abs(r-.5)*2,d=this.getRiskCategory(c);return{probability:Math.round(c*10)/10,confidence:Math.round(l*100)/100,logit:Math.round(n*1e3)/1e3,riskCategory:d,scaledInputs:{age:Math.round(s*1e3)/1e3,gfap:Math.round(a*1e3)/1e3},rawInputs:{age:e,gfap:i},isValid:!0,calculationMethod:"logistic_regression_age_gfap"}}catch(s){return console.error("Legacy model calculation error:",s),{probability:0,confidence:0,isValid:!1,reason:"Calculation error",error:s.message}}}static getRiskCategory(e){return e<10?{level:"very_low",color:"#10b981",label:"Very Low Risk",description:"Minimal ICH likelihood"}:e<25?{level:"low",color:"#84cc16",label:"Low Risk",description:"Below typical threshold"}:e<50?{level:"moderate",color:"#f59e0b",label:"Moderate Risk",description:"Elevated concern"}:e<75?{level:"high",color:"#f97316",label:"High Risk",description:"Significant likelihood"}:{level:"very_high",color:"#dc2626",label:"Very High Risk",description:"Critical ICH probability"}}static compareModels(e,i){if(!e||!i||!i.isValid)return{isValid:!1,reason:"Invalid model results for comparison"};let s=e.probability||0;s<=1&&(s=s*100);const a=i.probability||0,n=s-a,r=a>0?n/a*100:0,c=s>a?"main":a>s?"legacy":"equal";let l;const d=Math.abs(n);return d<5?l="strong":d<15?l="moderate":d<30?l="weak":l="poor",{isValid:!0,probabilities:{main:Math.round(s*10)/10,legacy:Math.round(a*10)/10},differences:{absolute:Math.round(n*10)/10,relative:Math.round(r*10)/10},agreement:{level:l,higherRiskModel:c},interpretation:this.getComparisonInterpretation(n,l)}}static getComparisonInterpretation(e,i){const s=Math.abs(e);return i==="strong"?{type:"concordant",message:"Models show strong agreement",implication:"Age and GFAP are primary risk factors"}:s>20?{type:"divergent",message:"Significant model disagreement",implication:"Complex model captures additional risk factors not in age/GFAP"}:{type:"moderate_difference",message:"Models show moderate difference",implication:"Additional factors provide incremental predictive value"}}static runValidationTests(){const i=[{age:65,gfap:100,expected:"low",description:"Younger patient, low GFAP"},{age:75,gfap:500,expected:"moderate",description:"Average age, moderate GFAP"},{age:85,gfap:1e3,expected:"high",description:"Older patient, high GFAP"},{age:70,gfap:2e3,expected:"very_high",description:"High GFAP dominates"},{age:90,gfap:50,expected:"very_low",description:"Low GFAP despite age"}].map(n=>{const r=this.calculateProbability(n.age,n.gfap);return{...n,result:r,passed:r.isValid&&r.riskCategory.level===n.expected}}),s=i.filter(n=>n.passed).length,a=i.length;return{summary:{passed:s,total:a,passRate:Math.round(s/a*100)},details:i}}static getModelMetadata(){return{name:"Legacy ICH Model",type:"Logistic Regression",version:"1.0.0",features:["age","gfap"],performance:{rocAuc:.789,recall:.4,precision:.86,f1Score:.55,specificity:.94},trainingData:{samples:"Historical cohort",dateRange:"Research study period",validation:"Cross-validation"},limitations:["Only uses age and GFAP - ignores clinical symptoms","Lower recall (40%) - misses some ICH cases","No time-to-onset consideration","No blood pressure or medication factors","Simplified feature set for baseline comparison"],purpose:"Research baseline for evaluating complex model improvements"}}}V(x,"PARAMS",{age:{mean:74.59,std:12.75},gfap:{mean:665.23,std:2203.77},coefficients:{intercept:.3248,age:-.2108,gfap:3.1631}});function lt(t){try{const e=(t==null?void 0:t.age_years)||(t==null?void 0:t.age)||null,i=(t==null?void 0:t.gfap_value)||(t==null?void 0:t.gfap)||null;return!e||!i?null:x.calculateProbability(e,i)}catch(e){return console.warn("Legacy ICH calculation failed (non-critical):",e),null}}class R{static logComparison(e){try{const i={id:this.generateEntryId(),timestamp:new Date().toISOString(),sessionId:this.getSessionId(),...e},s=this.getStoredData();return s.entries.push(i),s.entries.length>this.MAX_ENTRIES&&(s.entries=s.entries.slice(-this.MAX_ENTRIES)),s.lastUpdated=new Date().toISOString(),s.totalComparisons=s.entries.length,localStorage.setItem(this.STORAGE_KEY,JSON.stringify(s)),console.log(`📊 Research data logged (${s.totalComparisons} comparisons)`),!0}catch(i){return console.warn("Research data logging failed (non-critical):",i),!1}}static getStoredData(){try{const e=localStorage.getItem(this.STORAGE_KEY);if(!e)return this.createEmptyDataset();const i=JSON.parse(e);return!i.entries||!Array.isArray(i.entries)?(console.warn("Invalid research data structure, resetting"),this.createEmptyDataset()):i}catch(e){return console.warn("Failed to load research data, creating new:",e),this.createEmptyDataset()}}static createEmptyDataset(){return{version:"1.0.0",created:new Date().toISOString(),lastUpdated:null,totalComparisons:0,entries:[],metadata:{app:"iGFAP Stroke Triage",purpose:"Model comparison research",dataRetention:"Local storage only"}}}static exportAsCSV(){const e=this.getStoredData();if(!e.entries||e.entries.length===0)return"No research data available for export";const i=["timestamp","session_id","age","gfap_value","main_model_probability","main_model_module","legacy_model_probability","legacy_model_confidence","absolute_difference","relative_difference","agreement_level","higher_risk_model"],s=e.entries.map(n=>{var r,c,l,d,g,p,v,m,u,b,f,y,k,E;return[n.timestamp,n.sessionId,((r=n.inputs)==null?void 0:r.age)||"",((c=n.inputs)==null?void 0:c.gfap)||"",((l=n.main)==null?void 0:l.probability)||"",((d=n.main)==null?void 0:d.module)||"",((g=n.legacy)==null?void 0:g.probability)||"",((p=n.legacy)==null?void 0:p.confidence)||"",((m=(v=n.comparison)==null?void 0:v.differences)==null?void 0:m.absolute)||"",((b=(u=n.comparison)==null?void 0:u.differences)==null?void 0:b.relative)||"",((y=(f=n.comparison)==null?void 0:f.agreement)==null?void 0:y.level)||"",((E=(k=n.comparison)==null?void 0:k.agreement)==null?void 0:E.higherRiskModel)||""].join(",")});return[i.join(","),...s].join(`
`)}static exportAsJSON(){const e=this.getStoredData();return JSON.stringify(e,null,2)}static downloadData(e="csv"){try{const i=e==="csv"?this.exportAsCSV():this.exportAsJSON(),s=`igfap-research-${Date.now()}.${e}`,a=new Blob([i],{type:e==="csv"?"text/csv":"application/json"}),n=URL.createObjectURL(a),r=document.createElement("a");return r.href=n,r.download=s,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(n),console.log(`📥 Downloaded research data: ${s}`),!0}catch(i){return console.error("Failed to download research data:",i),!1}}static clearData(){try{return localStorage.removeItem(this.STORAGE_KEY),console.log("🗑️ Research data cleared"),!0}catch(e){return console.warn("Failed to clear research data:",e),!1}}static getDataSummary(){var n,r;const e=this.getStoredData();if(!e.entries||e.entries.length===0)return{totalEntries:0,dateRange:null,avgDifference:null};const i=e.entries,s=i.map(c=>{var l,d;return(d=(l=c.comparison)==null?void 0:l.differences)==null?void 0:d.absolute}).filter(c=>c!=null),a=s.length>0?s.reduce((c,l)=>c+Math.abs(l),0)/s.length:0;return{totalEntries:i.length,dateRange:{first:(n=i[0])==null?void 0:n.timestamp,last:(r=i[i.length-1])==null?void 0:r.timestamp},avgAbsoluteDifference:Math.round(a*10)/10,storageSize:JSON.stringify(e).length}}static generateEntryId(){return Date.now().toString(36)+Math.random().toString(36).substr(2)}static getSessionId(){let e=sessionStorage.getItem("research_session_id");return e||(e="session_"+Date.now().toString(36),sessionStorage.setItem("research_session_id",e)),e}}V(R,"STORAGE_KEY","igfap_research_data"),V(R,"MAX_ENTRIES",1e3);function ct(t,e,i){try{if(!M())return;const s={inputs:{age:i.age_years||i.age,gfap:i.gfap_value||i.gfap,module:t.module||"unknown"},main:{probability:t.probability,module:t.module,confidence:t.confidence},legacy:e,comparison:e?x.compareModels(t,e):null};R.logComparison(s)}catch(s){console.warn("Research logging failed (non-critical):",s)}}function M(t=null){var e;if(t==="coma")return!1;if(t==="limited"||t==="full")return!0;if(typeof window<"u")try{const i=window.store||((e=require("../state/store.js"))==null?void 0:e.store);if(i){const s=i.getState().formData;return s.limited||s.full}}catch{}return!1}function Le(){return""}function Ee(t,e,i){if(!(e!=null&&e.isValid))return console.log("🔬 Legacy model results invalid:",e),`
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
    `;const s=x.compareModels(t,e);return`
    <div class="research-panel" id="researchPanel" style="display: none;">
      <div class="research-header">
        <h4>🔬 Model Comparison (Research)</h4>
        <button class="close-research" id="closeResearch">×</button>
      </div>
      
      <div class="model-comparison">
        ${dt(t,e)}
        ${ut(s)}
        ${mt(e,i)}
        ${gt()}
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
  `}function dt(t,e){let i=t.probability||0;i<=1&&(i=i*100);const s=e.probability||0;return`
    <div class="probability-comparison">
      <div class="bar-group">
        <label class="bar-label">Main Model (Complex) - ${t.module||"Unknown"}</label>
        <div class="probability-bar">
          <div class="bar-fill main-model" style="width: ${Math.min(i,100)}%">
            <span class="bar-value">${i.toFixed(1)}%</span>
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
  `}function ut(t){if(!t.isValid)return'<div class="comparison-error">Unable to compare models</div>';const{differences:e,agreement:i}=t;return`
    <div class="difference-analysis">
      <div class="difference-metric">
        <span class="metric-label">Difference:</span>
        <span class="metric-value ${e.absolute>0?"higher":"lower"}">
          ${e.absolute>0?"+":""}${e.absolute}%
        </span>
      </div>
      
      <div class="agreement-level">
        <span class="metric-label">Agreement:</span>
        <span class="agreement-badge ${i.level}">
          ${i.level.charAt(0).toUpperCase()+i.level.slice(1)}
        </span>
      </div>
      
      <div class="interpretation">
        <p class="interpretation-text">${t.interpretation.message}</p>
        <small class="interpretation-detail">${t.interpretation.implication}</small>
      </div>
    </div>
  `}function mt(t,e){return`
    <div class="calculation-details" id="calculationDetails" style="display: none;">
      <h5>Legacy Model Calculation</h5>
      <div class="calculation-steps">
        <div class="step">
          <strong>Inputs:</strong> Age ${e.age}, GFAP ${e.gfap} pg/ml
        </div>
        <div class="step">
          <strong>Scaling:</strong> Age → ${t.scaledInputs.age}, GFAP → ${t.scaledInputs.gfap}
        </div>
        <div class="step">
          <strong>Logit:</strong> ${t.logit}
        </div>
        <div class="step">
          <strong>Probability:</strong> ${t.probability}% (Confidence: ${(t.confidence*100).toFixed(0)}%)
        </div>
      </div>
    </div>
  `}function gt(){const t=x.getModelMetadata();return`
    <div class="model-metrics">
      <h5>Performance Comparison</h5>
      <div class="metrics-grid">
        <div class="metric-item">
          <span class="metric-name">ROC-AUC</span>
          <span class="metric-value">Legacy: ${t.performance.rocAuc}</span>
        </div>
        <div class="metric-item">
          <span class="metric-name">Recall</span>
          <span class="metric-value">Legacy: ${(t.performance.recall*100).toFixed(0)}%</span>
        </div>
        <div class="metric-item">
          <span class="metric-name">Precision</span>
          <span class="metric-value">Legacy: ${(t.performance.precision*100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  `}function pt(){if(!document.getElementById("researchPanel"))return;const e=document.getElementById("closeResearch");e&&e.addEventListener("click",()=>{const n=document.getElementById("researchPanel");n&&(n.style.display="none")});const i=document.getElementById("exportResearchData");i&&i.addEventListener("click",()=>{R.downloadData("csv")});const s=document.getElementById("toggleCalculationDetails");s&&s.addEventListener("click",()=>{const n=document.getElementById("calculationDetails");n&&(n.style.display=n.style.display==="none"?"block":"none",s.textContent=n.style.display==="none"?"🧮 Details":"🧮 Hide")});const a=document.getElementById("clearResearchData");a&&a.addEventListener("click",()=>{if(confirm("Clear all research data? This cannot be undone.")){R.clearData();const n=R.getDataSummary();console.log(`Data cleared. Total entries: ${n.totalEntries}`)}}),console.log("🔬 Research mode initialized")}function Ce(){const e=h.getState().formData;if(!e||Object.keys(e).length===0)return"";let i="";return Object.entries(e).forEach(([s,a])=>{if(a&&Object.keys(a).length>0){const n=o(`${s}ModuleTitle`)||s.charAt(0).toUpperCase()+s.slice(1);let r="";Object.entries(a).forEach(([c,l])=>{if(l===""||l===null||l===void 0)return;let d=Ge(c),g=Ye(l,c);r+=`
          <div class="summary-item">
            <span class="summary-label">${d}:</span>
            <span class="summary-value">${g}</span>
          </div>
        `}),r&&(i+=`
          <div class="summary-module">
            <h4>${n}</h4>
            <div class="summary-items">
              ${r}
            </div>
          </div>
        `)}}),i?`
    <div class="input-summary">
      <h3>📋 ${o("inputSummaryTitle")}</h3>
      <p class="summary-subtitle">${o("inputSummarySubtitle")}</p>
      <div class="summary-content">
        ${i}
      </div>
    </div>
  `:""}function J(t,e,i){if(!e)return"";const s=Math.round((e.probability||0)*100),a=tt(s,t),n=s>70,r=s>fe[t].high,c={ich:"🩸",lvo:"🧠"},l={ich:o("ichProbability"),lvo:o("lvoProbability")},d=n?"critical":r?"high":"normal";return`
    <div class="enhanced-risk-card ${t} ${d}">
      <div class="risk-header">
        <div class="risk-icon">${c[t]}</div>
        <div class="risk-title">
          <h3>${l[t]}</h3>
        </div>
      </div>
      
      <div class="risk-probability">
        <div class="circles-container">
          <div class="rings-row">
            <div class="circle-item">
              <div class="probability-circle" data-react-ring data-percent="${s}" data-level="${d}"></div>
              <div class="circle-label">${t==="ich"?"ICH Risk":"LVO Risk"}</div>
            </div>
          </div>
          <div class="risk-level ${d}">${a}</div>
        </div>
        
        <div class="risk-assessment"></div>
      </div>
    </div>
  `}function ht(t){const e=t.gfap_value||Z();if(!e||e<=0)return"";const i=we(e);return`
    <div class="volume-display-container">
      ${nt(i.volume)}
    </div>
  `}function Z(){var i;const e=h.getState().formData;for(const s of["coma","limited","full"])if((i=e[s])!=null&&i.gfap_value)return parseFloat(e[s].gfap_value);return 0}function bt(t,e){const{ich:i,lvo:s}=t,a=wt(i),n=a!=="coma"?kt():null;console.log("🔬 Research Debug - Always Active:",{module:a,researchEnabled:M(a),mainResults:i,legacyResults:n,patientInputs:F(),legacyCalculationAttempted:a!=="coma"}),n&&M(a)&&ct(i,n,F());const r=(i==null?void 0:i.module)==="Limited"||(i==null?void 0:i.module)==="Coma"||(s==null?void 0:s.notPossible)===!0;i==null||i.module;let c;return r?c=vt(i,t,e,n,a):c=ft(i,s,t,e,n,a),setTimeout(async()=>{rt();try{const{mountIslands:l}=await Ue(async()=>{const{mountIslands:d}=await import("./mountIslands-cdRD6v1g.js");return{mountIslands:d}},[]);l()}catch(l){console.warn("React islands not available:",l)}},100),c}function vt(t,e,i,s,a){const n=t&&t.probability>.6?ye():"",r=Math.round(((t==null?void 0:t.probability)||0)*100),c=Se(),l=Ce(),d=M(a)?Le():"",g=s&&M(a)?Ee(t,s,F()):"",p=(t==null?void 0:t.module)==="Coma"?St(t.probability):"",v=(t==null?void 0:t.module)!=="Coma"?$e(t.probability):"";return`
    <div class="container">
      ${P(3)}
      <h2>${o("bleedingRiskAssessment")||"Blutungsrisiko-Bewertung / Bleeding Risk Assessment"}</h2>
      ${n}
      
      <!-- Single ICH Risk Card -->
      <div class="risk-results-single">
        ${J("ich",t)}
      </div>

      ${(t==null?void 0:t.module)==="Coma"&&r>=50?`
      <!-- ICH Volume Card (Coma only) -->
      <div class="risk-results-single">
        ${Me(t)}
      </div>
      `:""}
      
      <!-- Alternative Diagnoses for Coma Module -->
      ${p}
      
      <!-- Differential Diagnoses for Stroke Modules -->
      ${v}
      
      <!-- Research Model Comparison (hidden unless research mode) -->
      ${g}
      
      <!-- ICH Drivers Only (not shown for Coma module) -->
      ${(t==null?void 0:t.module)!=="Coma"?`
        <div class="enhanced-drivers-section">
          <h3>${o("riskFactorsTitle")||"Hauptrisikofaktoren / Main Risk Factors"}</h3>
          ${Ae(t)}
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
          ${l}
        </div>
        
        <button class="info-toggle" data-target="stroke-centers">
          <span class="toggle-icon">🏥</span>
          <span class="toggle-text">${o("nearestCentersTitle")}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="stroke-centers" style="display: none;">
          ${c}
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
      
      ${Te(t)}
      ${d}
    </div>
  `}function ft(t,e,i,s,a,n){var ie,se,ae,ne;const r=Math.round(((t==null?void 0:t.probability)||0)*100),c=Math.round(((e==null?void 0:e.probability)||0)*100),l=t&&t.probability>.6?ye():"",d=Se(),g=Ce(),p=M(n)?Le():"",v=a&&M(n)?Ee(t,a,F()):"",m=h.getState(),u=parseInt((se=(ie=m.formData)==null?void 0:ie.full)==null?void 0:se.fast_ed_score)||0;console.log("🔍 Debug LVO Display:"),console.log("  Current Module:",n),console.log("  FAST-ED Score:",u),console.log("  FAST-ED Raw:",(ne=(ae=m.formData)==null?void 0:ae.full)==null?void 0:ne.fast_ed_score),console.log("  LVO Data:",e),console.log("  LVO notPossible:",e==null?void 0:e.notPossible),console.log("  LVO Probability:",e==null?void 0:e.probability),console.log("  ICH Module:",t==null?void 0:t.module);const b=n==="full"||(t==null?void 0:t.module)==="Full",f=e&&typeof e.probability=="number"&&!e.notPossible,y=b&&u>3&&f;console.log("  Conditions: isFullModule:",b),console.log("  Conditions: fastEdScore > 3:",u>3),console.log("  Conditions: hasValidLVO:",f),console.log("  Show LVO Card:",y);const k=r>=50,S=c/Math.max(r,.5),I=S>=.6&&S<=1.7,K=b&&r>=50&&c>=50&&I,H=b&&r>=50&&c>=50&&!I,te=b&&r>=30&&c>=30;console.log("🎯 Tachometer conditions:",{isFullModule:b,ichPercent:r,lvoPercent:c,ratio:S.toFixed(2),inRatioBand:I,showTachometer:K,showDominanceBanner:H});let O=1;y&&O++,k&&O++;const Re=O===1?"risk-results-single":O===2?"risk-results-dual":"risk-results-triple",Ie=$e(t.probability);return`
    <div class="container">
      ${P(3)}
      <h2>${o("resultsTitle")}</h2>
      ${l}
      
      <!-- Risk Assessment Display -->
      <div class="${Re}">
        ${J("ich",t)}
        ${y?J("lvo",e):""}
        ${k?Me(t):""}
      </div>
      
      <!-- Treatment Decision Gauge (when strong signal) -->
      ${te?Lt(r,c):""}
      ${!te&&H?yt(r,c,S):""}
      
      <!-- Differential Diagnoses for Stroke Modules -->
      ${Ie}
      
      <!-- Research Model Comparison (hidden unless research mode) -->
      ${v}
      
      <!-- Risk Factor Drivers -->
      <div class="enhanced-drivers-section">
        <h3>${o("riskFactorsTitle")||"Risikofaktoren / Risk Factors"}</h3>
        ${y?je(t,e):Ae(t)}
      </div>
      
      <!-- Collapsible Additional Information -->
      <div class="additional-info-section">
        <button class="info-toggle" data-target="input-summary">
          <span class="toggle-icon">📋</span>
          <span class="toggle-text">${o("inputSummaryTitle")}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="input-summary" style="display: none;">
          ${g}
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
      
      ${Te(t)}
      ${p}
    </div>
  `}function yt(t,e,i){const s=i>1?"LVO":"ICH",a=s==="LVO"?"🧠":"🩸",n=L.getCurrentLanguage()==="de"?s==="LVO"?"LVO-dominant":"ICH-dominant":s==="LVO"?"LVO dominant":"ICH dominant",r=L.getCurrentLanguage()==="de"?`Verhältnis LVO/ICH: ${i.toFixed(2)}`:`LVO/ICH ratio: ${i.toFixed(2)}`;return`
    <div class="tachometer-section">
      <div class="tachometer-card">
        <div class="treatment-recommendation ${s==="LVO"?"lvo-dominant":"ich-dominant"}">
          <div class="recommendation-icon">${a}</div>
          <div class="recommendation-text">
            <h4>${n}</h4>
            <p>${r}</p>
          </div>
          <div class="probability-summary">
            ICH: ${t}% | LVO: ${e}%
          </div>
        </div>
      </div>
    </div>
  `}function Ae(t){if(!t||!t.drivers)return'<p class="no-drivers">No driver data available</p>';const e=t.drivers;if(!e.positive&&!e.negative)return'<p class="no-drivers">Driver format error</p>';const i=e.positive||[],s=e.negative||[];return`
    <div class="drivers-split-view">
      <div class="drivers-column positive-column">
        <div class="column-header">
          <span class="column-icon">⬆</span>
          <span class="column-title">${o("increasingRisk")||"Risikoerhöhend / Increasing Risk"}</span>
        </div>
        <div class="compact-drivers">
          ${i.length>0?i.slice(0,5).map(a=>pe(a,"positive")).join(""):`<p class="no-factors">${o("noFactors")||"Keine Faktoren / No factors"}</p>`}
        </div>
      </div>
      
      <div class="drivers-column negative-column">
        <div class="column-header">
          <span class="column-icon">⬇</span>
          <span class="column-title">${o("decreasingRisk")||"Risikomindernd / Decreasing Risk"}</span>
        </div>
        <div class="compact-drivers">
          ${s.length>0?s.slice(0,5).map(a=>pe(a,"negative")).join(""):`<p class="no-factors">${o("noFactors")||"Keine Faktoren / No factors"}</p>`}
        </div>
      </div>
    </div>
  `}function pe(t,e){const i=Math.abs(t.weight*100),s=Math.min(i*2,100);return`
    <div class="compact-driver-item">
      <div class="compact-driver-label">${z(t.label)}</div>
      <div class="compact-driver-bar ${e}" style="width: ${s}%;">
        <span class="compact-driver-value">${i.toFixed(1)}%</span>
      </div>
    </div>
  `}function Te(t){if(!t||!t.probability||Math.round((t.probability||0)*100)<50)return"";const i=Z();return!i||i<=0?"":`
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
  `}function kt(t){try{const e=F();if(console.log("🔍 Legacy calculation inputs:",e),!e.age||!e.gfap)return console.warn("🔍 Missing required inputs for legacy model:",{age:e.age,gfap:e.gfap}),null;const i=lt(e);return console.log("🔍 Legacy calculation result:",i),i}catch(e){return console.warn("Legacy model calculation failed (non-critical):",e),null}}function F(){const e=h.getState().formData;console.log("🔍 Debug formData structure:",e);let i=null,s=null;for(const n of["coma","limited","full"])e[n]&&(console.log(`🔍 ${n} module data:`,e[n]),i=i||e[n].age_years,s=s||e[n].gfap_value);const a={age:parseInt(i)||null,gfap:parseFloat(s)||null};return console.log("🔍 Extracted patient inputs:",a),a}function $e(t){return Math.round(t*100)>25?`
      <div class="alternative-diagnosis-card">
        <div class="diagnosis-header">
          <span class="lightning-icon">⚡</span>
          <h3>${o("differentialDiagnoses")}</h3>
        </div>
        <div class="diagnosis-content">
          <!-- Time Window Confirmation - Clinical Action -->
          <h4 class="clinical-action-heading">${o("reconfirmTimeWindow")}</h4>
          
          <!-- Actual Differential Diagnoses -->
          <ul class="diagnosis-list">
            <li>${o("unclearTimeWindow")}</li>
            <li>${o("rareDiagnoses")}</li>
          </ul>
        </div>
      </div>
    `:""}function St(t){const e=Math.round(t*100),i=L.getCurrentLanguage()==="de";return e>25?`
      <div class="alternative-diagnosis-card">
        <div class="diagnosis-header">
          <span class="lightning-icon">⚡</span>
          <h3>${i?"Differentialdiagnosen":"Differential Diagnoses"}</h3>
        </div>
        <div class="diagnosis-content">
          <ul class="diagnosis-list">
            <li>
              ${i?"Alternative Diagnosen sind SAB, SDH, EDH (Subarachnoidalblutung, Subduralhämatom, Epiduralhämatom)":"Alternative diagnoses include SAH, SDH, EDH (Subarachnoid Hemorrhage, Subdural Hematoma, Epidural Hematoma)"}
            </li>
            <li>
              ${i?"Bei unklarem Zeitfenster seit Symptombeginn oder im erweiterten Zeitfenster kommen auch ein demarkierter Infarkt oder hypoxischer Hirnschaden in Frage":"In cases of unclear time window since symptom onset or extended time window, demarcated infarction or hypoxic brain injury should also be considered"}
            </li>
          </ul>
        </div>
      </div>
    `:`
      <div class="alternative-diagnosis-card">
        <div class="diagnosis-header">
          <span class="lightning-icon">⚡</span>
          <h3>${i?"Differentialdiagnosen":"Differential Diagnoses"}</h3>
        </div>
        <div class="diagnosis-content">
          <ul class="diagnosis-list">
            <li>
              ${i?"Alternative Diagnose von Vigilanzminderung wahrscheinlich":"Alternative diagnosis for reduced consciousness likely"}
            </li>
            <li>
              ${i?"Ein Verschluss der Arteria Basilaris ist nicht ausgeschlossen":"Basilar artery occlusion cannot be excluded"}
            </li>
          </ul>
        </div>
      </div>
    `}function wt(t){if(!(t!=null&&t.module))return"unknown";const e=t.module.toLowerCase();return e.includes("coma")?"coma":e.includes("limited")?"limited":e.includes("full")?"full":"unknown"}function Me(t){const e=Z();if(!e||e<=0)return"";const i=we(e);return Math.round(((t==null?void 0:t.probability)||0)*100),`
    <div class="enhanced-risk-card volume-card normal">
      <div class="risk-header">
        <div class="risk-icon">🧮</div>
        <div class="risk-title">
          <h3>${o("ichVolumeLabel")}</h3>
        </div>
      </div>
      
      <div class="risk-probability">
        <div class="circles-container">
          <div class="rings-row">
            <div class="circle-item">
              ${ht(t)}
              <div class="circle-label">${o("ichVolumeLabel")}</div>
            </div>
          </div>
        </div>
        
        <div class="risk-assessment">
          <div class="mortality-assessment">
            ${o("predictedMortality")}: ${i.mortalityRate}
          </div>
        </div>
      </div>
    </div>
  `}function Lt(t,e){const i=e/Math.max(t,1);return`
    <div class="tachometer-section">
      <div class="tachometer-card">
        <div class="tachometer-header">
          <h3>🎯 ${L.getCurrentLanguage()==="de"?"Entscheidungshilfe – LVO/ICH":"Decision Support – LVO/ICH"}</h3>
          <div class="ratio-display">LVO/ICH Ratio: ${i.toFixed(2)}</div>
        </div>
        
        <div class="tachometer-gauge" id="tachometer-canvas-container">
          <div data-react-tachometer data-ich="${t}" data-lvo="${e}" data-title="${L.getCurrentLanguage()==="de"?"Entscheidungshilfe – LVO/ICH":"Decision Support – LVO/ICH"}"></div>
        </div>

        <!-- Legend chips for zones -->
        <div class="tachometer-legend" aria-hidden="true">
          <span class="legend-chip ich">ICH</span>
          <span class="legend-chip uncertain">${L.getCurrentLanguage()==="de"?"Unsicher":"Uncertain"}</span>
          <span class="legend-chip lvo">LVO</span>
        </div>

        <!-- Metrics row: ratio, confidence, absolute difference -->
        <div class="metrics-row" role="group" aria-label="Tachometer metrics">
          <div class="metric-card">
            <div class="metric-label">Ratio</div>
            <div class="metric-value">${i.toFixed(2)}</div>
            <div class="metric-unit">LVO/ICH</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Confidence</div>
            <div class="metric-value">${(()=>{const s=Math.abs(e-t),a=Math.max(e,t);let n=s<10?Math.round(30+a*.3):s<20?Math.round(50+a*.4):Math.round(70+a*.3);return n=Math.max(0,Math.min(100,n)),n})()}%</div>
            <div class="metric-unit">percent</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Difference</div>
            <div class="metric-value">${Math.abs(e-t).toFixed(0)}%</div>
            <div class="metric-unit">|LVO − ICH|</div>
          </div>
        </div>
        
        <div class="probability-summary">
          ICH: ${t}% | LVO: ${e}%
        </div>
        
        <!-- Hidden probability summary for initialization -->
        <div class="probability-summary" style="display: none;">
          ICH: ${t}% | LVO: ${e}%
        </div>
      </div>
    </div>
  `}class Et{constructor(){this.isAuthenticated=!1,this.sessionTimeout=4*60*60*1e3,this.lastActivity=Date.now(),this.setupActivityTracking()}authenticate(e){const i=this.hashPassword(e),s=this.hashPassword("Neuro25");return i===s?(this.isAuthenticated=!0,this.lastActivity=Date.now(),this.storeAuthSession(),!0):(this.delayFailedAttempt(),!1)}isValidSession(){return this.isAuthenticated?Date.now()-this.lastActivity>this.sessionTimeout?(this.logout(),!1):!0:this.checkStoredSession()}updateActivity(){this.lastActivity=Date.now(),this.storeAuthSession()}logout(){this.isAuthenticated=!1,sessionStorage.removeItem("auth_session"),sessionStorage.removeItem("auth_timestamp")}hashPassword(e){let i=0;for(let s=0;s<e.length;s++){const a=e.charCodeAt(s);i=(i<<5)-i+a,i=i&i}return i.toString(36)}storeAuthSession(){this.isAuthenticated&&(sessionStorage.setItem("auth_session","verified"),sessionStorage.setItem("auth_timestamp",this.lastActivity.toString()))}checkStoredSession(){const e=sessionStorage.getItem("auth_session"),i=sessionStorage.getItem("auth_timestamp");if(e==="verified"&&i){const s=parseInt(i);if(Date.now()-s<this.sessionTimeout)return this.isAuthenticated=!0,this.lastActivity=s,!0}return this.logout(),!1}setupActivityTracking(){const e=["mousedown","mousemove","keypress","scroll","touchstart"],i=()=>{this.isAuthenticated&&this.updateActivity()};e.forEach(s=>{document.addEventListener(s,i,{passive:!0})})}async delayFailedAttempt(){return new Promise(e=>{setTimeout(e,1e3)})}getSessionInfo(){if(!this.isAuthenticated)return{authenticated:!1};const e=this.sessionTimeout-(Date.now()-this.lastActivity),i=Math.floor(e/(60*60*1e3)),s=Math.floor(e%(60*60*1e3)/(60*1e3));return{authenticated:!0,timeRemaining:`${i}h ${s}m`,lastActivity:new Date(this.lastActivity).toLocaleTimeString()}}}const Q=new Et;function Ct(){return`
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
                <li><strong>Contact:</strong> Deepak Bos (bosdeepakgmail.com)</li>
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
  `}function At(){const t=document.getElementById("loginForm"),e=document.getElementById("researchPassword"),i=document.getElementById("loginError"),s=t.querySelector(".login-button");if(!t)return;e.focus(),t.addEventListener("submit",async c=>{c.preventDefault();const l=e.value.trim();if(!l){a("Please enter the research access code");return}r(!0),n();try{await Q.authenticate(l)?(h.logEvent("auth_success",{timestamp:new Date().toISOString(),userAgent:navigator.userAgent.substring(0,100)}),h.navigate("triage1")):(a("Invalid access code. Please contact Deepak Bos for research access."),e.value="",e.focus(),h.logEvent("auth_failed",{timestamp:new Date().toISOString()}))}catch(d){a("Authentication system error. Please try again."),console.error("Authentication error:",d)}finally{r(!1)}}),e.addEventListener("input",()=>{n()});function a(c){i.textContent=c,i.style.display="block",e.classList.add("error")}function n(){i.style.display="none",e.classList.remove("error")}function r(c){const l=s.querySelector(".button-text"),d=s.querySelector(".loading-spinner");c?(l.style.display="none",d.style.display="inline",s.disabled=!0):(l.style.display="inline",d.style.display="none",s.disabled=!1)}}function Tt(t,e,i){const s=[];return i.required&&!e&&e!==0&&s.push("This field is required"),i.min!==void 0&&e!==""&&!isNaN(e)&&parseFloat(e)<i.min&&s.push(`Value must be at least ${i.min}`),i.max!==void 0&&e!==""&&!isNaN(e)&&parseFloat(e)>i.max&&s.push(`Value must be at most ${i.max}`),i.pattern&&!i.pattern.test(e)&&s.push("Invalid format"),s}function $t(t){let e=!0;const i={};return Object.entries(xe).forEach(([s,a])=>{const n=t.elements[s];if(n){const r=Tt(s,n.value,a);r.length>0&&(i[s]=r,e=!1)}}),{isValid:e,validationErrors:i}}function Mt(t,e){Object.entries(e).forEach(([i,s])=>{const a=t.querySelector(`[name="${i}"]`);if(a){const n=a.closest(".input-group");if(n){n.classList.add("error"),n.querySelectorAll(".error-message").forEach(l=>l.remove());const r=document.createElement("div");r.className="error-message";const c=document.createElement("span");c.className="error-icon",c.textContent="⚠️",r.appendChild(c),r.appendChild(document.createTextNode(" "+s[0])),n.appendChild(r)}}})}function Pt(t){t.querySelectorAll(".input-group.error").forEach(e=>{e.classList.remove("error"),e.querySelectorAll(".error-message").forEach(i=>i.remove())})}function he(t,e){var r,c;console.log(`=== EXTRACTING ${e.toUpperCase()} DRIVERS ===`),console.log("Full response:",t);let i=null;if(e==="ICH"?(i=((r=t.ich_prediction)==null?void 0:r.drivers)||null,console.log("🧠 ICH raw drivers extracted:",i)):e==="LVO"&&(i=((c=t.lvo_prediction)==null?void 0:c.drivers)||null,console.log("🩸 LVO raw drivers extracted:",i)),!i)return console.log(`❌ No ${e} drivers found`),null;const s=Rt(i,e);console.log(`✅ ${e} drivers formatted:`,s);const n=[...s.positive,...s.negative].find(l=>l.label&&(l.label.toLowerCase().includes("fast")||l.label.includes("fast_ed")));return n?console.log(`🎯 FAST-ED found in ${e}:`,`${n.label}: ${n.weight>0?"+":""}${n.weight.toFixed(4)}`):console.log(`⚠️  FAST-ED NOT found in ${e} drivers`),s}function Rt(t,e){console.log(`🔄 Formatting ${e} drivers from dictionary:`,t);const i=[],s=[];return Object.entries(t).forEach(([a,n])=>{typeof n=="number"&&(n>0?i.push({label:a,weight:n}):n<0&&s.push({label:a,weight:Math.abs(n)}))}),i.sort((a,n)=>n.weight-a.weight),s.sort((a,n)=>n.weight-a.weight),console.log(`📈 ${e} positive drivers:`,i.slice(0,5)),console.log(`📉 ${e} negative drivers:`,s.slice(0,5)),{kind:"flat_dictionary",units:"logit",positive:i,negative:s,meta:{}}}function be(t,e){var s,a;console.log(`=== EXTRACTING ${e.toUpperCase()} PROBABILITY ===`);let i=0;return e==="ICH"?(i=((s=t.ich_prediction)==null?void 0:s.probability)||0,console.log("🧠 ICH probability extracted:",i)):e==="LVO"&&(i=((a=t.lvo_prediction)==null?void 0:a.probability)||0,console.log("🩸 LVO probability extracted:",i)),i}function ve(t,e){var s,a;let i=.85;return e==="ICH"?i=((s=t.ich_prediction)==null?void 0:s.confidence)||.85:e==="LVO"&&(i=((a=t.lvo_prediction)==null?void 0:a.confidence)||.85),i}const It=[.4731,.8623,1.8253,3.6667,2.3495,1,0],Dt=btoa("proprietary-lvo-model-v2"),T=t=>It[t],C=(()=>{const t="intercept",e="coefficients",i="scaling";return{[t]:-T(0),[e]:{gfap:-T(1),fastEd:T(2)},[i]:{gfap:{mean:T(6),std:T(5)},fastEd:{mean:T(3),std:T(4)}}}})(),D={_0x7b2c:(t,e=0)=>t>=0?e===0?Math.log(t+1):(Math.pow(t+1,e)-1)/e:e===2?-Math.log(-t+1):-(Math.pow(-t+1,2-e)-1)/(2-e),_0x9d4e:(t,e,i)=>(t-e)/i,_0x3f8a:t=>{const e=Math.exp;return 1/(1+e(-t))},_0x5c1d:t=>Math.sin(t*1e3)*0+t};function _t(t,e){try{if(t==null||e==null)throw new Error("Missing required inputs: GFAP and FAST-ED scores");if(t<0)throw new Error("GFAP value must be non-negative");if(e<0||e>9)throw new Error("FAST-ED score must be between 0 and 9");const i="gfap",s="fastEd",a={i:"intercept",c:"coefficients",s:"scaling",m:"mean",d:"std"},n=D._0x7b2c(t,0),r=D._0x5c1d(n),c=D._0x9d4e(n,C[a.s][i][a.m],C[a.s][i][a.d]),l=D._0x9d4e(e,C[a.s][s][a.m],C[a.s][s][a.d]),d=(()=>{const y=C[a.i],k=C[a.c][i]*c,E=C[a.c][s]*l;return y+k+E})(),g=D._0x3f8a(d),p=c,v=l,m=d,u=[],b={f:C[a.c][s]*v,g:C[a.c][i]*p};e>=4?u.push({name:"High FAST-ED Score",value:e,impact:"increase",contribution:b.f}):e<=2&&u.push({name:"Low FAST-ED Score",value:e,impact:"decrease",contribution:b.f});const f=[500,100];return t>f[0]?u.push({name:"Elevated GFAP",value:`${Math.round(t)} pg/mL`,impact:"decrease",contribution:b.g,note:"May indicate hemorrhagic vs ischemic event"}):t<f[1]&&u.push({name:"Low GFAP",value:`${Math.round(t)} pg/mL`,impact:"increase",contribution:Math.abs(b.g),note:"Consistent with ischemic LVO"}),u.sort((y,k)=>Math.abs(k.contribution)-Math.abs(y.contribution)),{probability:g,riskLevel:g>.7?"high":g>.4?"moderate":"low",model:atob(Dt).replace("proprietary-","").replace("-v2",""),inputs:{[i]:t,[s]:e},scaledInputs:{[i]:c,[s]:l},logit:d,riskFactors:u,interpretation:Nt(g,e,t)}}catch(i){return console.error("LVO prediction error:",i),{probability:null,error:i.message,model:"Local LVO Model v2"}}}function Nt(t,e,i){const s=Math.round(t*100);return t>.7?e>=6?`High probability of LVO (${s}%). FAST-ED score of ${e} strongly suggests large vessel occlusion. Consider immediate thrombectomy evaluation.`:`High probability of LVO (${s}%). Despite moderate FAST-ED score, biomarker pattern suggests large vessel occlusion.`:t>.4?i>500?`Moderate LVO probability (${s}%). Elevated GFAP (${i.toFixed(0)} pg/mL) may indicate hemorrhagic component. Further imaging recommended.`:`Moderate LVO probability (${s}%). Clinical correlation and vascular imaging recommended.`:e<=3?`Low probability of LVO (${s}%). FAST-ED score of ${e} suggests small vessel disease or non-vascular etiology.`:`Low probability of LVO (${s}%) despite FAST-ED score. Consider alternative diagnoses.`}function Ft(t){return(t==null?void 0:t.gfapValue)!=null&&(t==null?void 0:t.fastEdScore)!=null&&(t==null?void 0:t.gfapValue)>=0&&(t==null?void 0:t.fastEdScore)>=0&&(t==null?void 0:t.fastEdScore)<=9}async function Bt(){console.log("Warming up Cloud Functions...");const t=Object.values($).map(async e=>{try{const i=new AbortController,s=setTimeout(()=>i.abort(),3e3);await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({}),signal:i.signal,mode:"cors"}),clearTimeout(s),console.log(`Warmed up: ${e}`)}catch{console.log(`Warm-up attempt for ${e.split("/").pop()} completed`)}});Promise.all(t).then(()=>{console.log("Cloud Functions warm-up complete")})}class A extends Error{constructor(e,i,s){super(e),this.name="APIError",this.status=i,this.url=s}}function X(t){const e={...t};return Object.keys(e).forEach(i=>{const s=e[i];(typeof s=="boolean"||s==="on"||s==="true"||s==="false")&&(e[i]=s===!0||s==="on"||s==="true"?1:0)}),e}function W(t,e=0){const i=parseFloat(t);return isNaN(i)?e:i}async function ee(t,e){const i=new AbortController,s=setTimeout(()=>i.abort(),Y.requestTimeout);try{const a=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(e),signal:i.signal,mode:"cors"});if(clearTimeout(s),!a.ok){let r=`HTTP ${a.status}`;try{const c=await a.json();r=c.error||c.message||r}catch{r=`${r}: ${a.statusText}`}throw new A(r,a.status,t)}return await a.json()}catch(a){throw clearTimeout(s),a.name==="AbortError"?new A("Request timeout - please try again",408,t):a instanceof A?a:new A("Network error - please check your connection and try again",0,t)}}async function xt(t){const e=X(t);try{const i=await ee($.COMA_ICH,e);return{probability:W(i.probability||i.ich_probability,0),drivers:i.drivers||null,confidence:W(i.confidence,.75),module:"Coma"}}catch(i){throw console.error("Coma ICH prediction failed:",i),new A(`Failed to get ICH prediction: ${i.message}`,i.status,$.COMA_ICH)}}async function Ht(t){const e={age_years:t.age_years,systolic_bp:t.systolic_bp,diastolic_bp:t.diastolic_bp,gfap_value:t.gfap_value,vigilanzminderung:t.vigilanzminderung||0},i=X(e);try{const s=await ee($.LDM_ICH,i);return{probability:W(s.probability||s.ich_probability,0),drivers:s.drivers||null,confidence:W(s.confidence,.65),module:"Limited Data"}}catch(s){throw console.error("Limited Data ICH prediction failed:",s),new A(`Failed to get ICH prediction: ${s.message}`,s.status,$.LDM_ICH)}}async function Ot(t){const e={age_years:t.age_years,systolic_bp:t.systolic_bp,diastolic_bp:t.diastolic_bp,gfap_value:t.gfap_value,fast_ed_score:t.fast_ed_score,headache:t.headache||0,vigilanzminderung:t.vigilanzminderung||0,armparese:t.armparese||0,beinparese:t.beinparese||0,eye_deviation:t.eye_deviation||0,atrial_fibrillation:t.atrial_fibrillation||0,anticoagulated_noak:t.anticoagulated_noak||0,antiplatelets:t.antiplatelets||0},i=X(e);let s=null;if(Ft(i)){console.log("🚀 Using local LVO model (GFAP + FAST-ED)");const a=_t(i.gfap_value,i.fast_ed_score);a.probability!==null&&(s={probability:a.probability,drivers:a.riskFactors.map(n=>({feature:n.name,value:n.value,contribution:n.contribution,impact:n.impact})),confidence:a.riskLevel==="high"?.9:a.riskLevel==="moderate"?.7:.5,module:"Full Stroke (Local LVO)",interpretation:a.interpretation})}try{const a=await ee($.FULL_STROKE,i),n=be(a,"ICH"),r=he(a,"ICH"),c=ve(a,"ICH"),l={probability:n,drivers:r,confidence:c,module:"Full Stroke"};if(!s){console.log("⚠️ Falling back to API for LVO prediction");const d=be(a,"LVO"),g=he(a,"LVO"),p=ve(a,"LVO");s={probability:d,drivers:g,confidence:p,module:"Full Stroke (API)"}}return{ich:l,lvo:s}}catch(a){throw console.error("Full Stroke prediction failed:",a),new A(`Failed to get stroke predictions: ${a.message}`,a.status,$.FULL_STROKE)}}const Vt=()=>[{id:"acute_deficit",checked:!1},{id:"symptom_onset",checked:!1},{id:"no_preexisting",checked:!1},{id:"no_trauma",checked:!1}];function qt(){const t=Vt();return`
    <div id="prerequisitesModal" class="modal prerequisites-modal" style="display: flex;">
      <div class="modal-content prerequisites-content">
        <div class="modal-header">
          <h2>${o("prerequisitesTitle")}</h2>
          <button class="modal-close" id="closePrerequisites">&times;</button>
        </div>
        
        <div class="modal-body">
          <p class="prerequisites-intro">
            ${o("prerequisitesIntro")}
          </p>
          
          <div class="prerequisites-list">
            ${t.map(e=>`
              <div class="prerequisite-item" data-id="${e.id}">
                <label class="toggle-switch">
                  <input type="checkbox" id="${e.id}" class="toggle-input">
                  <span class="toggle-slider"></span>
                </label>
                <span class="prerequisite-label">
                  ${o(e.id)}
                </span>
              </div>
            `).join("")}
          </div>
          
          <div class="prerequisites-warning" id="prerequisitesWarning" style="display: none;">
            <span class="warning-icon">⚠️</span>
            <span class="warning-text">
              ${o("prerequisitesWarning")}
            </span>
          </div>
        </div>
        
        <div class="modal-footer">
          <div class="button-group">
            <button type="button" class="secondary" id="cancelPrerequisites">
              ${o("cancel")}
            </button>
            <button type="button" class="primary" id="confirmPrerequisites">
              ${o("continue")}
            </button>
          </div>
        </div>
      </div>
    </div>
  `}function zt(){const t=document.getElementById("prerequisitesModal");if(!t){console.error("Prerequisites modal not found");return}console.log("Initializing prerequisites modal");const e=document.getElementById("closePrerequisites"),i=document.getElementById("cancelPrerequisites"),s=document.getElementById("confirmPrerequisites");console.log("Modal buttons found:",{closeBtn:!!e,cancelBtn:!!i,confirmBtn:!!s});const a=()=>{t.remove(),B("welcome")};e==null||e.addEventListener("click",a),i==null||i.addEventListener("click",a),s==null||s.addEventListener("click",r=>{r.preventDefault(),r.stopPropagation(),console.log("Prerequisites confirm button clicked");const c=t.querySelectorAll(".toggle-input"),l=Array.from(c).every(d=>d.checked);if(console.log("All prerequisites checked:",l),l)console.log("Navigating to triage2"),t.remove(),B("triage2");else{console.log("Showing prerequisites warning");const d=document.getElementById("prerequisitesWarning");d&&(d.style.display="flex",d.classList.add("shake"),setTimeout(()=>d.classList.remove("shake"),500))}});const n=t.querySelectorAll(".toggle-input");n.forEach(r=>{r.addEventListener("change",()=>{const c=Array.from(n).every(d=>d.checked),l=document.getElementById("prerequisitesWarning");c&&l&&(l.style.display="none")})})}function Ut(){const t=document.getElementById("prerequisitesModal");t&&t.remove();const e=document.createElement("div");e.innerHTML=qt();const i=e.firstElementChild;document.body.appendChild(i),zt()}function Wt(t){h.logEvent("triage1_answer",{comatose:t}),t?B("coma"):Ut()}function Kt(t){h.logEvent("triage2_answer",{examinable:t}),B(t?"full":"limited")}function B(t){h.logEvent("navigate",{from:h.getState().currentScreen,to:t}),h.navigate(t),window.scrollTo(0,0)}function Gt(){h.hasUnsavedData()&&!confirm("Are you sure you want to start over? All entered data will be lost.")||(h.logEvent("reset"),h.reset())}function Yt(){console.log("goBack() called");const t=h.goBack();console.log("goBack() success:",t),t?(h.logEvent("navigate_back"),window.scrollTo(0,0)):(console.log("No history available, going home instead"),Pe())}function Pe(){console.log("goHome() called"),h.logEvent("navigate_home"),h.goHome(),window.scrollTo(0,0)}async function jt(t,e){t.preventDefault();const i=t.target,s=i.dataset.module,a=$t(i);if(!a.isValid){Mt(e,a.validationErrors);try{const l=Object.keys(a.validationErrors)[0];if(l&&i.elements[l]){const p=i.elements[l];p.focus({preventScroll:!0}),p.scrollIntoView({behavior:"smooth",block:"center"})}const d=document.createElement("div");d.className="sr-only",d.setAttribute("role","status"),d.setAttribute("aria-live","polite");const g=Object.keys(a.validationErrors).length;d.textContent=`${g} field${g===1?"":"s"} need attention.`,document.body.appendChild(d),setTimeout(()=>d.remove(),1200)}catch{}return}const n={};Array.from(i.elements).forEach(l=>{if(l.name)if(l.type==="checkbox")n[l.name]=l.checked;else if(l.type==="number"){const d=parseFloat(l.value);n[l.name]=isNaN(d)?0:d}else l.type==="hidden"&&l.name==="armparese"?n[l.name]=l.value==="true":n[l.name]=l.value}),console.log("Collected form inputs:",n),h.setFormData(s,n);const r=i.querySelector("button[type=submit]"),c=r?r.innerHTML:"";r&&(r.disabled=!0,r.innerHTML=`<span class="loading-spinner"></span> ${o("analyzing")}`);try{let l;switch(s){case"coma":l={ich:await xt(n),lvo:null};break;case"limited":l={ich:await Ht(n),lvo:{notPossible:!0}};break;case"full":l=await Ot(n);break;default:throw new Error("Unknown module: "+s)}h.setResults(l),h.logEvent("models_complete",{module:s,results:l}),B("results")}catch(l){console.error("Error running models:",l);let d="An error occurred during analysis. Please try again.";l instanceof A&&(d=l.message),Jt(e,d),r&&(r.disabled=!1,r.innerHTML=c)}}function Jt(t,e){t.querySelectorAll(".critical-alert").forEach(c=>{var l,d;(d=(l=c.querySelector("h4"))==null?void 0:l.textContent)!=null&&d.includes("Error")&&c.remove()});const i=document.createElement("div");i.className="critical-alert";const s=document.createElement("h4"),a=document.createElement("span");a.className="alert-icon",a.textContent="⚠️",s.appendChild(a),s.appendChild(document.createTextNode(" Error"));const n=document.createElement("p");n.textContent=e,i.appendChild(s),i.appendChild(n);const r=t.querySelector(".container");r?r.prepend(i):t.prepend(i),setTimeout(()=>i.remove(),1e4)}function Zt(t){const e=document.createElement("div");e.className="sr-only",e.setAttribute("role","status"),e.setAttribute("aria-live","polite");const i={triage1:"Coma assessment",triage2:"Examination capability assessment",coma:"Coma module",limited:"Limited data module",full:"Full stroke assessment",results:"Assessment results"};e.textContent=`Navigated to ${i[t]||t}`,document.body.appendChild(e),setTimeout(()=>e.remove(),1e3)}function Qt(t){const e="iGFAP",s={triage1:"Initial Assessment",triage2:"Examination Capability",coma:"Coma Module",limited:"Limited Data Module",full:"Full Stroke Module",results:"Assessment Results"}[t];document.title=s?`${e} — ${s}`:e}function Xt(){setTimeout(()=>{const t=document.querySelector("h2");t&&(t.setAttribute("tabindex","-1"),t.focus(),setTimeout(()=>t.removeAttribute("tabindex"),100))},100)}class ei{constructor(){this.scores={facial_palsy:0,arm_weakness:0,speech_changes:0,eye_deviation:0,denial_neglect:0},this.onApply=null,this.modal=null}getTotal(){return Object.values(this.scores).reduce((e,i)=>e+i,0)}getRiskLevel(){return this.getTotal()>=4?"high":"low"}render(){const e=this.getTotal(),i=this.getRiskLevel();return`
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
                <h3>${o("totalScoreTitle")}: <span class="total-score">${e}/9</span></h3>
                <div class="risk-indicator ${i}">
                  ${o("riskLevel")}: ${o(i==="high"?"riskLevelHigh":"riskLevelLow")}
                </div>
              </div>
            </div>

          </div>
          <div class="modal-footer">
            <div class="button-group">
              <button class="secondary" data-action="cancel-fast-ed">${o("cancel")}</button>
              <button class="primary" data-action="apply-fast-ed">${o("applyScore")}</button>
            </div>
          </div>
        </div>
      </div>
    `}setupEventListeners(){if(this.modal=document.getElementById("fastEdModal"),!this.modal)return;this.modal.addEventListener("change",a=>{if(a.target.type==="radio"){const n=a.target.name,r=parseInt(a.target.value);this.scores[n]=r,this.updateDisplay()}});const e=this.modal.querySelector(".modal-close");e==null||e.addEventListener("click",()=>this.close());const i=this.modal.querySelector('[data-action="cancel-fast-ed"]');i==null||i.addEventListener("click",()=>this.close());const s=this.modal.querySelector('[data-action="apply-fast-ed"]');s==null||s.addEventListener("click",()=>this.apply()),this.modal.addEventListener("click",a=>{a.target===this.modal&&(a.preventDefault(),a.stopPropagation())}),document.addEventListener("keydown",a=>{var n;a.key==="Escape"&&((n=this.modal)!=null&&n.classList.contains("show"))&&this.close()})}updateDisplay(){var s,a;const e=(s=this.modal)==null?void 0:s.querySelector(".total-score"),i=(a=this.modal)==null?void 0:a.querySelector(".risk-indicator");if(e&&(e.textContent=`${this.getTotal()}/9`),i){const n=this.getRiskLevel();i.className=`risk-indicator ${n}`,i.textContent=`${o("riskLevel")}: ${o(n==="high"?"riskLevelHigh":"riskLevelLow")}`}}show(e=0,i=null){this.onApply=i,e>0&&e<=9&&this.approximateFromTotal(e),document.getElementById("fastEdModal")?(this.modal.remove(),document.body.insertAdjacentHTML("beforeend",this.render()),this.modal=document.getElementById("fastEdModal")):document.body.insertAdjacentHTML("beforeend",this.render()),this.setupEventListeners(),this.modal.setAttribute("aria-hidden","false"),this.modal.style.display="flex",this.modal.classList.add("show");const s=this.modal.querySelector('input[type="radio"]');s==null||s.focus()}close(){this.modal&&(this.modal.classList.remove("show"),this.modal.style.display="none",this.modal.setAttribute("aria-hidden","true"))}apply(){const e=this.getTotal(),i=this.scores.arm_weakness>0,s=this.scores.eye_deviation>0;this.onApply&&this.onApply({total:e,components:{...this.scores},armWeaknessBoolean:i,eyeDeviationBoolean:s}),this.close()}approximateFromTotal(e){this.scores={facial_palsy:0,arm_weakness:0,speech_changes:0,eye_deviation:0,denial_neglect:0};let i=e;const s=Object.keys(this.scores);for(const a of s){if(i<=0)break;const r=Math.min(i,a==="facial_palsy"?1:2);this.scores[a]=r,i-=r}}}const ti=new ei;function _(t){const e=h.getState(),{currentScreen:i,results:s,startTime:a,navigationHistory:n}=e,r=document.createElement("div"),c=document.getElementById("backButton");c&&(c.style.display=n&&n.length>0?"flex":"none");let l="";switch(i){case"login":l=Ct();break;case"triage1":if(!Q.isValidSession()){h.navigate("login");return}l=oe();break;case"triage2":l=Be();break;case"coma":l=He();break;case"limited":l=Oe();break;case"full":l=Ve();break;case"results":l=bt(s,a);break;default:l=oe()}for(r.innerHTML=l,t.innerHTML="";r.firstChild;)t.appendChild(r.firstChild);const d=t.querySelector("form[data-module]");if(d){const g=d.dataset.module;ii(d,g)}si(t),i==="login"&&setTimeout(()=>{At()},100),i==="results"&&s&&setTimeout(()=>{Qe(s)},100),setTimeout(()=>{pt()},150),Zt(i),Qt(i),Xt()}function ii(t,e){const i=h.getFormData(e);!i||Object.keys(i).length===0||Object.entries(i).forEach(([s,a])=>{const n=t.elements[s];n&&(n.type==="checkbox"?n.checked=a===!0||a==="on"||a==="true":n.value=a)})}function si(t){t.querySelectorAll('input[type="number"]').forEach(a=>{a.addEventListener("blur",()=>{Pt(t)})}),t.querySelectorAll("[data-action]").forEach(a=>{a.addEventListener("click",n=>{const{action:r,value:c}=n.currentTarget.dataset,l=c==="true";switch(r){case"triage1":Wt(l);break;case"triage2":Kt(l);break;case"reset":Gt();break;case"goBack":Yt();break;case"goHome":Pe();break}})}),t.querySelectorAll("form[data-module]").forEach(a=>{a.addEventListener("submit",n=>{jt(n,t)})});const e=t.querySelector("#printResults");e&&e.addEventListener("click",()=>window.print());const i=t.querySelector("#fast_ed_score");i&&(i.addEventListener("click",a=>{a.preventDefault();const n=parseInt(i.value)||0;ti.show(n,r=>{i.value=r.total;const c=t.querySelector("#armparese_hidden");c&&(c.value=r.armWeaknessBoolean?"true":"false");const l=t.querySelector("#eye_deviation_hidden");l&&(l.value=r.eyeDeviationBoolean?"true":"false"),i.dispatchEvent(new Event("change",{bubbles:!0}))})}),i.addEventListener("keydown",a=>{a.preventDefault()})),t.querySelectorAll(".info-toggle").forEach(a=>{a.addEventListener("click",n=>{const r=a.dataset.target,c=t.querySelector(`#${r}`),l=a.querySelector(".toggle-arrow");c&&(c.style.display!=="none"?(c.style.display="none",c.classList.remove("show"),a.classList.remove("active"),l.style.transform="rotate(0deg)"):(c.style.display="block",c.classList.add("show"),a.classList.add("active"),l.style.transform="rotate(180deg)"))})})}class ai{constructor(){this.container=null,this.unsubscribe=null}async init(){if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",()=>this.init());return}if(this.container=document.getElementById("appContainer"),!this.container){console.error("App container not found");return}Q.isValidSession()||h.navigate("login"),this.unsubscribe=h.subscribe(()=>{_(this.container),setTimeout(()=>this.initializeResearchMode(),200)}),window.addEventListener("languageChanged",()=>{this.updateUILanguage(),_(this.container)}),this.setupGlobalEventListeners(),this.initializeTheme(),this.initializeResearchMode(),this.updateUILanguage(),this.startAutoSave(),this.setupSessionTimeout(),this.setCurrentYear(),this.registerServiceWorker(),Bt(),_(this.container),console.log("iGFAP Stroke Triage Assistant initialized")}setupGlobalEventListeners(){const e=document.getElementById("backButton");e&&e.addEventListener("click",()=>{h.goBack(),_(this.container)});const i=document.getElementById("homeButton");i&&i.addEventListener("click",()=>{h.goHome(),_(this.container)});const s=document.getElementById("languageToggle");s&&s.addEventListener("click",()=>this.toggleLanguage());const a=document.getElementById("darkModeToggle");a&&a.addEventListener("click",()=>this.toggleDarkMode());const n=document.getElementById("researchModeToggle");n&&n.addEventListener("click",r=>{r.preventDefault(),r.stopPropagation(),this.toggleResearchMode()}),this.setupHelpModal(),this.setupFooterLinks(),document.addEventListener("keydown",r=>{if(r.key==="Escape"){const c=document.getElementById("helpModal");c&&c.classList.contains("show")&&(c.classList.remove("show"),c.style.display="none",c.setAttribute("aria-hidden","true"))}}),window.addEventListener("beforeunload",r=>{h.hasUnsavedData()&&(r.preventDefault(),r.returnValue="You have unsaved data. Are you sure you want to leave?")})}setupHelpModal(){const e=document.getElementById("helpButton"),i=document.getElementById("helpModal"),s=i==null?void 0:i.querySelector(".modal-close");if(e&&i){i.classList.remove("show"),i.style.display="none",i.setAttribute("aria-hidden","true"),e.addEventListener("click",()=>{i.style.display="flex",i.classList.add("show"),i.setAttribute("aria-hidden","false")});const a=()=>{i.classList.remove("show"),i.style.display="none",i.setAttribute("aria-hidden","true")};s==null||s.addEventListener("click",a),i.addEventListener("click",n=>{n.target===i&&a()})}}setupFooterLinks(){var e,i;(e=document.getElementById("privacyLink"))==null||e.addEventListener("click",s=>{s.preventDefault(),this.showPrivacyPolicy()}),(i=document.getElementById("disclaimerLink"))==null||i.addEventListener("click",s=>{s.preventDefault(),this.showDisclaimer()})}initializeTheme(){const e=localStorage.getItem("theme"),i=document.getElementById("darkModeToggle");(e==="dark"||!e&&window.matchMedia("(prefers-color-scheme: dark)").matches)&&(document.body.classList.add("dark-mode"),i&&(i.textContent="☀️"))}toggleLanguage(){L.toggleLanguage(),this.updateUILanguage();const e=document.getElementById("languageToggle");if(e){const i=L.getCurrentLanguage();e.textContent=i==="en"?"🇬🇧":"🇩🇪",e.dataset.lang=i}}updateUILanguage(){document.documentElement.lang=L.getCurrentLanguage();const e=document.querySelector(".app-header h1");e&&(e.textContent=o("appTitle"));const i=document.querySelector(".emergency-badge");i&&(i.textContent=o("emergencyBadge"));const s=document.getElementById("languageToggle");s&&(s.title=o("languageToggle"),s.setAttribute("aria-label",o("languageToggle")));const a=document.getElementById("helpButton");a&&(a.title=o("helpButton"),a.setAttribute("aria-label",o("helpButton")));const n=document.getElementById("darkModeToggle");n&&(n.title=o("darkModeButton"),n.setAttribute("aria-label",o("darkModeButton")));const r=document.getElementById("modalTitle");r&&(r.textContent=o("helpTitle"))}toggleDarkMode(){const e=document.getElementById("darkModeToggle");document.body.classList.toggle("dark-mode");const i=document.body.classList.contains("dark-mode");e&&(e.textContent=i?"☀️":"🌙"),localStorage.setItem("theme",i?"dark":"light")}initializeResearchMode(){const e=document.getElementById("researchModeToggle");if(e){const i=this.getCurrentModuleFromResults(),s=i==="limited"||i==="full";e.style.display=s?"flex":"none",e.style.opacity=s?"1":"0.5",console.log(`🔬 Research button visibility: ${s?"VISIBLE":"HIDDEN"} (module: ${i})`)}}getCurrentModuleFromResults(){var s,a;const e=h.getState();if(e.currentScreen!=="results"||!((a=(s=e.results)==null?void 0:s.ich)!=null&&a.module))return null;const i=e.results.ich.module.toLowerCase();return i.includes("coma")?"coma":i.includes("limited")?"limited":i.includes("full")?"full":null}toggleResearchMode(){const e=document.getElementById("researchPanel");if(!e){console.warn("🔬 Research panel not found - likely not on results screen");return}const i=e.style.display!=="none";e.style.display=i?"none":"block";const s=document.getElementById("researchModeToggle");return s&&(s.style.background=i?"rgba(255, 255, 255, 0.1)":"rgba(0, 102, 204, 0.2)"),console.log(`🔬 Research panel ${i?"HIDDEN":"SHOWN"}`),!1}showResearchActivationMessage(){const e=document.createElement("div");e.className="research-activation-toast",e.innerHTML=`
      <div class="toast-content">
        🔬 <strong>Research Mode Activated</strong><br>
        <small>Model comparison features enabled</small>
      </div>
    `,document.body.appendChild(e),setTimeout(()=>{document.body.contains(e)&&document.body.removeChild(e)},3e3)}startAutoSave(){setInterval(()=>{this.saveCurrentFormData()},Y.autoSaveInterval)}saveCurrentFormData(){this.container.querySelectorAll("form[data-module]").forEach(i=>{const s=new FormData(i),a=i.dataset.module;if(a){const n={};s.forEach((l,d)=>{const g=i.elements[d];g&&g.type==="checkbox"?n[d]=g.checked:n[d]=l});const r=h.getFormData(a);JSON.stringify(r)!==JSON.stringify(n)&&h.setFormData(a,n)}})}setupSessionTimeout(){setTimeout(()=>{confirm("Your session has been idle for 30 minutes. Would you like to continue?")?this.setupSessionTimeout():h.reset()},Y.sessionTimeout)}setCurrentYear(){const e=document.getElementById("currentYear");e&&(e.textContent=new Date().getFullYear())}showPrivacyPolicy(){alert("Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.")}showDisclaimer(){alert("Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.")}async registerServiceWorker(){if(!("serviceWorker"in navigator)){console.log("Service Workers not supported");return}try{const e=await navigator.serviceWorker.register("/0825/sw.js",{scope:"/0825/"});console.log("Service Worker registered successfully:",e),e.addEventListener("updatefound",()=>{const i=e.installing;console.log("New service worker found"),i.addEventListener("statechange",()=>{i.state==="installed"&&navigator.serviceWorker.controller&&(console.log("New service worker installed, update available"),this.showUpdateNotification())})}),navigator.serviceWorker.addEventListener("message",i=>{console.log("Message from service worker:",i.data)})}catch(e){console.error("Service Worker registration failed:",e)}}showUpdateNotification(){const e=document.createElement("div");e.className="modal show update-modal",e.style.cssText=`
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
    `;const i=document.createElement("div");i.className="modal-content",i.style.cssText=`
      background-color: var(--container-bg);
      padding: 30px;
      border-radius: 16px;
      max-width: 400px;
      box-shadow: var(--shadow-lg);
      text-align: center;
      animation: slideUp 0.3s ease;
    `,i.innerHTML=`
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
    `,e.appendChild(i),document.body.appendChild(e);const s=e.querySelector("#updateNow"),a=e.querySelector("#updateLater");s.addEventListener("click",()=>{window.location.reload()}),a.addEventListener("click",()=>{e.remove(),setTimeout(()=>this.showUpdateNotification(),5*60*1e3)}),e.addEventListener("click",n=>{n.target===e&&a.click()})}destroy(){this.unsubscribe&&this.unsubscribe()}}const ni=new ai;ni.init();
//# sourceMappingURL=index-CYBAktde.js.map
