var Re=Object.defineProperty;var Ie=(t,e,i)=>e in t?Re(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i;var x=(t,e,i)=>Ie(t,typeof e!="symbol"?e+"":e,i);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function i(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(s){if(s.ep)return;s.ep=!0;const n=i(s);fetch(s.href,n)}})();class De{constructor(){this.state={currentScreen:"triage1",results:null,sessionId:null,startTime:null,formData:{},validationErrors:{},screenHistory:[]},this.listeners=new Set,this.initialize()}initialize(){this.state.sessionId=this.generateSessionId(),this.state.startTime=Date.now(),console.log("Store initialized with session:",this.state.sessionId)}generateSessionId(){return"session_"+Date.now()+"_"+Math.random().toString(36).substr(2,9)}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}notify(){this.listeners.forEach(e=>e(this.state))}getState(){return{...this.state}}setState(e){this.state={...this.state,...e},this.notify()}navigate(e){console.log(`Navigating from ${this.state.currentScreen} to ${e}`);const i=[...this.state.screenHistory];this.state.currentScreen!==e&&!i.includes(this.state.currentScreen)&&i.push(this.state.currentScreen),this.setState({currentScreen:e,screenHistory:i})}goBack(){const e=[...this.state.screenHistory];if(console.log("goBack() - current history:",e),console.log("goBack() - current screen:",this.state.currentScreen),e.length>0){const i=e.pop();return console.log("goBack() - navigating to:",i),this.setState({currentScreen:i,screenHistory:e}),!0}return console.log("goBack() - no history available"),!1}goHome(){this.setState({currentScreen:"triage1",screenHistory:[]})}setFormData(e,i){const a={...this.state.formData};a[e]={...i},this.setState({formData:a})}getFormData(e){return this.state.formData[e]||{}}setValidationErrors(e){this.setState({validationErrors:e})}clearValidationErrors(){this.setState({validationErrors:{}})}setResults(e){this.setState({results:e})}hasUnsavedData(){return Object.keys(this.state.formData).length>0&&!this.state.results}reset(){const e={currentScreen:"triage1",results:null,sessionId:this.generateSessionId(),startTime:Date.now(),formData:{},validationErrors:{},screenHistory:[]};this.setState(e),console.log("Store reset with new session:",e.sessionId)}logEvent(e,i={}){const a={timestamp:Date.now(),session:this.state.sessionId,event:e,data:i};console.log("Event:",a)}getSessionDuration(){return Date.now()-this.state.startTime}}const p=new De;function M(t){const e=[{id:1,label:"Triage"},{id:2,label:"Assessment"},{id:3,label:"Results"}];let i='<div class="progress-indicator">';return e.forEach((a,s)=>{const n=a.id===t,r=a.id<t;i+=`
      <div class="progress-step ${n?"active":""} ${r?"completed":""}">
        ${r?"":a.id}
      </div>
    `,s<e.length-1&&(i+=`<div class="progress-line ${r?"completed":""}"></div>`)}),i+="</div>",i}const ae={en:{appTitle:"iGFAP",emergencyBadge:"Emergency Tool",helpButton:"Help and Instructions",darkModeButton:"Toggle dark mode",languageToggle:"Language",step1:"Initial Assessment",step2:"Data Collection",step3:"Results",comaModuleTitle:"Coma Module",limitedDataModuleTitle:"Limited Data Module",fullStrokeModuleTitle:"Full Stroke Module",triage1Title:"Patient Assessment",triage1Question:"Is the patient comatose?",triage1Help:"Glasgow Coma Scale < 9",triage1Yes:"YES - Comatose",triage1No:"NO - Conscious",triage2Title:"Examination Capability",triage2Question:"Can the patient be reliably examined?",triage2Help:"Patient is not aphasic, confused, or uncooperative",triage2Yes:"YES - Full Exam Possible",triage2No:"NO - Limited Exam Only",ageLabel:"Age (years)",ageHelp:"Patient age in years",systolicLabel:"Systolic BP (mmHg)",systolicHelp:"Systolic blood pressure",diastolicLabel:"Diastolic BP (mmHg)",diastolicHelp:"Diastolic blood pressure",gfapLabel:"GFAP Value (pg/mL)",gfapHelp:"GFAP biomarker level",fastEdLabel:"FAST-ED Score",fastEdHelp:"FAST-ED assessment score (0-9)",headacheLabel:"Headache",vigilanzLabel:"Reduced consciousness",armPareseLabel:"Arm weakness",beinPareseLabel:"Leg weakness",eyeDeviationLabel:"Eye deviation",atrialFibLabel:"Atrial fibrillation",anticoagLabel:"Anticoagulated (NOAK)",antiplateletsLabel:"Antiplatelets",analyzeButton:"Analyze",analyzing:"Analyzing...",printResults:"Print Results",newAssessment:"Start New Assessment",startOver:"Start Over",goBack:"Go Back",goHome:"Go Home",basicInformation:"Basic Information",biomarkersScores:"Biomarkers & Scores",clinicalSymptoms:"Clinical Symptoms",medicalHistory:"Medical History",ageYearsLabel:"Age (years)",systolicBpLabel:"Systolic BP (mmHg)",diastolicBpLabel:"Diastolic BP (mmHg)",gfapValueLabel:"GFAP Value (pg/mL)",fastEdScoreLabel:"FAST-ED Score",ageYearsHelp:"Patient's age in years",systolicBpHelp:"Normal: 90-140 mmHg",diastolicBpHelp:"Normal: 60-90 mmHg",gfapTooltip:"Brain injury biomarker",gfapTooltipLong:"Glial Fibrillary Acidic Protein - Brain injury biomarker",gfapRange:"Range: {min} - {max} pg/mL",fastEdTooltip:"0-9 scale for LVO screening",analyzeIchRisk:"Analyze ICH Risk",analyzeStrokeRisk:"Analyze Stroke Risk",criticalPatient:"Critical Patient",comaAlert:"Patient is comatose (GCS < 9). Rapid assessment required.",vigilanceReduction:"Vigilance Reduction (Decreased alertness)",armParesis:"Arm Paresis",legParesis:"Leg Paresis",eyeDeviation:"Eye Deviation",atrialFibrillation:"Atrial Fibrillation",onNoacDoac:"On NOAC/DOAC",onAntiplatelets:"On Antiplatelets",resultsTitle:"Assessment Results",bleedingRiskAssessment:"Bleeding Risk Assessment",ichProbability:"ICH Probability",lvoProbability:"LVO Probability",lvoMayBePossible:"Large vessel occlusion possible - further evaluation recommended",riskFactorsTitle:"Main Risk Factors",increasingRisk:"Increasing Risk",decreasingRisk:"Decreasing Risk",noFactors:"No factors",riskLevel:"Risk Level",lowRisk:"Low Risk",mediumRisk:"Medium Risk",highRisk:"High Risk",riskLow:"Low",riskMedium:"Medium",riskHigh:"High",riskFactorsAnalysis:"Risk Factors",contributingFactors:"Contributing factors to the assessment",riskFactors:"Risk Factors",increaseRisk:"INCREASE",decreaseRisk:"DECREASE",noPositiveFactors:"No increasing factors",noNegativeFactors:"No decreasing factors",ichRiskFactors:"ICH Risk Factors",lvoRiskFactors:"LVO Risk Factors",criticalAlertTitle:"CRITICAL RISK DETECTED",criticalAlertMessage:"High probability of intracerebral hemorrhage detected.",immediateActionsRequired:"Immediate actions required",initiateStrokeProtocol:"Initiate stroke protocol immediately",urgentCtImaging:"Urgent CT imaging required",considerBpManagement:"Consider blood pressure management",prepareNeurosurgicalConsult:"Prepare for potential neurosurgical consultation",helpTitle:"Quick Reference Guide",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 9: Comatose patient - use Coma Module",gcsMod:"GCS 8-12: Moderate impairment",gcsHigh:"GCS 13-15: Mild impairment",fastEdTitle:"FAST-ED Score Components",fastEdFacial:"Facial Palsy: 0-1 points",fastEdArm:"Arm Weakness: 0-2 points",fastEdSpeech:"Speech Changes: 0-2 points",fastEdTime:"Time: Critical factor",fastEdEye:"Eye Deviation: 0-2 points",fastEdDenial:"Denial/Neglect: 0-2 points",criticalValuesTitle:"Critical Values",criticalBp:"Systolic BP > 180: Increased ICH risk",criticalGfap:"GFAP > 500 pg/mL: Significant marker",criticalFastEd:"FAST-ED ≥ 4: Consider LVO",fastEdCalculatorTitle:"FAST-ED Score Calculator",fastEdCalculatorSubtitle:"Click to calculate FAST-ED score components",facialPalsyTitle:"Facial Palsy",facialPalsyNormal:"Normal (0)",facialPalsyMild:"Present (1)",armWeaknessTitle:"Arm Weakness",armWeaknessNormal:"Normal (0)",armWeaknessMild:"Mild weakness or drift (1)",armWeaknessSevere:"Severe weakness or falls immediately (2)",speechChangesTitle:"Speech Abnormalities",speechChangesNormal:"Normal (0)",speechChangesMild:"Mild dysarthria or aphasia (1)",speechChangesSevere:"Severe dysarthria or aphasia (2)",eyeDeviationTitle:"Eye Deviation",eyeDeviationNormal:"Normal (0)",eyeDeviationPartial:"Partial gaze deviation (1)",eyeDeviationForced:"Forced gaze deviation (2)",denialNeglectTitle:"Denial/Neglect",denialNeglectNormal:"Normal (0)",denialNeglectPartial:"Partial neglect (1)",denialNeglectComplete:"Complete neglect (2)",totalScoreTitle:"Total FAST-ED Score",riskLevel:"Risk Level",riskLevelLow:"LOW (Score <4)",riskLevelHigh:"HIGH (Score ≥4 - Consider LVO)",applyScore:"Apply Score",cancel:"Cancel",riskAnalysis:"Risk Analysis",riskAnalysisSubtitle:"Clinical factors in this assessment",contributingFactors:"Contributing factors",factorsShown:"shown",positiveFactors:"Positive factors",negativeFactors:"Negative factors",clinicalInformation:"Clinical Information",clinicalRecommendations:"Clinical Recommendations",clinicalRec1:"Consider immediate imaging if ICH risk is high",clinicalRec2:"Activate stroke team for LVO scores ≥ 50%",clinicalRec3:"Monitor blood pressure closely",clinicalRec4:"Document all findings thoroughly",noDriverData:"No driver data available",driverAnalysisUnavailable:"Driver analysis unavailable",driverInfoNotAvailable:"Driver information not available from this prediction model",driverAnalysisNotAvailable:"Driver analysis not available for this prediction",lvoNotPossible:"LVO assessment not possible with limited data",fullExamRequired:"Full neurological examination required for LVO screening",limitedAssessment:"Limited Assessment",disclaimer:"Clinical Disclaimer",disclaimerText:"This tool is for clinical decision support only. Always use clinical judgment and follow local protocols. Not a replacement for physician assessment.",importantNote:"Important",importantText:"These results are for clinical decision support only. Always use clinical judgment and follow institutional protocols.",predictedMortality:"Predicted 30-day mortality",ichVolumeLabel:"ICH Volume",references:"References",inputSummaryTitle:"Input Summary",inputSummarySubtitle:"Values used for this analysis",privacyLink:"Privacy Policy",disclaimerLink:"Medical Disclaimer",versionLink:"Version 2.1.0 - Research Preview",privacyPolicy:"Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.",medicalDisclaimer:"Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.",networkError:"Network error - please check your connection and try again",requestTimeout:"Request timeout - please try again",apiError:"Failed to get results",validationError:"Please check your input values",sessionTimeout:"Your session has been idle for 30 minutes. Would you like to continue?",unsavedData:"You have unsaved data. Are you sure you want to leave?",nearestCentersTitle:"Nearest Stroke Centers",useCurrentLocation:"Use Current Location",enterLocationPlaceholder:"Enter city or address...",enterManually:"Enter Location Manually",search:"Search",yourLocation:"Your Location",recommendedCenters:"Recommended Centers",alternativeCenters:"Alternative Centers",noCentersFound:"No stroke centers found in this area",gettingLocation:"Getting your location",searchingLocation:"Searching location",locationError:"Unable to get your location",locationPermissionDenied:"Location access denied. Please allow location access and try again.",locationUnavailable:"Location information is unavailable",locationTimeout:"Location request timed out",geolocationNotSupported:"Geolocation is not supported by this browser",geocodingNotImplemented:"Location search not available. Please use GPS or enter coordinates manually.",tryManualEntry:"Try entering your location manually or use GPS.",distanceNote:"Distances are calculated as straight-line distances. Actual travel times may vary.",travelTimeNote:"Travel times calculated for emergency vehicles with sirens and priority routing.",calculatingTravelTimes:"Calculating travel times",minutes:"min",poweredByOrs:"Travel times powered by OpenRoute Service",comprehensiveCenter:"Comprehensive Stroke Center",primaryCenter:"Primary Stroke Center",telemetryCenter:"Telemedicine Center",thrombectomy:"Thrombectomy",neurosurgery:"Neurosurgery",icu:"Intensive Care",telemedicine:"Telemedicine",stroke_unit:"Stroke Unit",call:"Call",directions:"Directions",emergency:"Emergency",certified:"Certified",prerequisitesTitle:"Prerequisites for Stroke Triage",prerequisitesIntro:"Please confirm that all of the following prerequisites are met:",prerequisitesWarning:"All prerequisites must be met to continue",continue:"Continue",acute_deficit:"Acute (severe) neurological deficit present",symptom_onset:"Symptom onset within 6 hours",no_preexisting:"No pre-existing severe neurological deficits",no_trauma:"No traumatic brain injury present",differentialDiagnoses:"Differential Diagnoses",reconfirmTimeWindow:"Please reconfirm time window!",unclearTimeWindow:"With unclear/extended time window, early demarcated brain infarction is also possible",rareDiagnoses:"Rare diagnoses such as glioblastoma are also possible"},de:{appTitle:"iGFAP",emergencyBadge:"Notfall-Tool",helpButton:"Hilfe und Anweisungen",darkModeButton:"Dunklen Modus umschalten",languageToggle:"Sprache",step1:"Erstbeurteilung",step2:"Datenerhebung",step3:"Ergebnisse",comaModuleTitle:"Koma-Modul",limitedDataModuleTitle:"Begrenzte Daten Modul",fullStrokeModuleTitle:"Vollständiges Schlaganfall-Modul",triage1Title:"Patientenbeurteilung",triage1Question:"Ist der Patient komatös?",triage1Help:"Glasgow Coma Scale < 9",triage1Yes:"JA - Komatös",triage1No:"NEIN - Bei Bewusstsein",triage2Title:"Untersuchungsfähigkeit",triage2Question:"Kann der Patient zuverlässig untersucht werden?",triage2Help:"Patient ist nicht aphasisch, verwirrt oder unkooperativ",triage2Yes:"JA - Vollständige Untersuchung möglich",triage2No:"NEIN - Nur begrenzte Untersuchung",ageLabel:"Alter (Jahre)",ageHelp:"Patientenalter in Jahren",systolicLabel:"Systolischer RR (mmHg)",systolicHelp:"Systolischer Blutdruck",diastolicLabel:"Diastolischer RR (mmHg)",diastolicHelp:"Diastolischer Blutdruck",gfapLabel:"GFAP-Wert (pg/mL)",gfapHelp:"GFAP-Biomarker-Wert",fastEdLabel:"FAST-ED-Score",fastEdHelp:"FAST-ED-Bewertungsscore (0-9)",headacheLabel:"Kopfschmerzen",vigilanzLabel:"Bewusstseinstrübung",armPareseLabel:"Armschwäche",beinPareseLabel:"Beinschwäche",eyeDeviationLabel:"Blickdeviation",atrialFibLabel:"Vorhofflimmern",anticoagLabel:"Antikoaguliert (NOAK)",antiplateletsLabel:"Thrombozytenaggregationshemmer",analyzeButton:"Analysieren",analyzing:"Analysiere...",printResults:"Ergebnisse drucken",newAssessment:"Neue Bewertung starten",startOver:"Von vorn beginnen",goBack:"Zurück",goHome:"Zur Startseite",basicInformation:"Grundinformationen",biomarkersScores:"Biomarker & Scores",clinicalSymptoms:"Klinische Symptome",medicalHistory:"Anamnese",ageYearsLabel:"Alter (Jahre)",systolicBpLabel:"Systolischer RR (mmHg)",diastolicBpLabel:"Diastolischer RR (mmHg)",gfapValueLabel:"GFAP-Wert (pg/mL)",fastEdScoreLabel:"FAST-ED-Score",ageYearsHelp:"Patientenalter in Jahren",systolicBpHelp:"Normal: 90-140 mmHg",diastolicBpHelp:"Normal: 60-90 mmHg",gfapTooltip:"Hirnverletzungs-Biomarker",gfapTooltipLong:"Glial Fibrillary Acidic Protein - Hirnverletzungs-Biomarker",gfapRange:"Bereich: {min} - {max} pg/mL",fastEdTooltip:"0-9 Skala für LVO-Screening",analyzeIchRisk:"ICB-Risiko analysieren",analyzeStrokeRisk:"Schlaganfall-Risiko analysieren",criticalPatient:"Kritischer Patient",comaAlert:"Patient ist komatös (GCS < 9). Schnelle Beurteilung erforderlich.",vigilanceReduction:"Vigilanzminderung (Verminderte Wachheit)",armParesis:"Armparese",legParesis:"Beinparese",eyeDeviation:"Blickdeviation",atrialFibrillation:"Vorhofflimmern",onNoacDoac:"NOAK/DOAK-Therapie",onAntiplatelets:"Thrombozytenaggregationshemmer",resultsTitle:"Bewertungsergebnisse",bleedingRiskAssessment:"Blutungsrisiko-Bewertung",ichProbability:"ICB-Risiko",lvoProbability:"LVO-Risiko",lvoMayBePossible:"Großgefäßverschluss möglich - weitere Abklärung empfohlen",riskFactorsTitle:"Hauptrisikofaktoren",increasingRisk:"Risikoerhöhend",decreasingRisk:"Risikomindernd",noFactors:"Keine Faktoren",riskLevel:"Risikostufe",lowRisk:"Niedriges Risiko",mediumRisk:"Mittleres Risiko",highRisk:"Hohes Risiko",riskLow:"Niedrig",riskMedium:"Mittel",riskHigh:"Hoch",riskFactorsAnalysis:"Risikofaktoren",contributingFactors:"Beitragende Faktoren zur Bewertung",riskFactors:"Risikofaktoren",increaseRisk:"ERHÖHEN",decreaseRisk:"VERRINGERN",noPositiveFactors:"Keine erhöhenden Faktoren",noNegativeFactors:"Keine verringernden Faktoren",ichRiskFactors:"ICB-Risikofaktoren",lvoRiskFactors:"LVO-Risikofaktoren",criticalAlertTitle:"KRITISCHES RISIKO ERKANNT",criticalAlertMessage:"Hohe Wahrscheinlichkeit einer intrazerebralen Blutung erkannt.",immediateActionsRequired:"Sofortige Maßnahmen erforderlich",initiateStrokeProtocol:"Schlaganfall-Protokoll sofort einleiten",urgentCtImaging:"Dringende CT-Bildgebung erforderlich",considerBpManagement:"Blutdruckmanagement erwägen",prepareNeurosurgicalConsult:"Neurochirurgische Konsultation vorbereiten",helpTitle:"Kurzreferenzleitfaden",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 9: Komatöser Patient - Koma-Modul verwenden",gcsMod:"GCS 8-12: Mäßige Beeinträchtigung",gcsHigh:"GCS 13-15: Leichte Beeinträchtigung",fastEdTitle:"FAST-ED-Score-Komponenten",fastEdFacial:"Faziale Parese: 0-1 Punkte",fastEdArm:"Armschwäche: 0-2 Punkte",fastEdSpeech:"Sprachveränderungen: 0-2 Punkte",fastEdTime:"Zeit: Kritischer Faktor",fastEdEye:"Blickdeviation: 0-2 Punkte",fastEdDenial:"Verneinung/Neglect: 0-2 Punkte",criticalValuesTitle:"Kritische Werte",criticalBp:"Systolischer RR > 180: Erhöhtes ICB-Risiko",criticalGfap:"GFAP > 500 pg/mL: Signifikanter Marker",criticalFastEd:"FAST-ED ≥ 4: LVO in Betracht ziehen",fastEdCalculatorTitle:"FAST-ED-Score-Rechner",fastEdCalculatorSubtitle:"Klicken Sie, um FAST-ED-Score-Komponenten zu berechnen",facialPalsyTitle:"Fazialisparese",facialPalsyNormal:"Normal (0)",facialPalsyMild:"Vorhanden (1)",armWeaknessTitle:"Armschwäche",armWeaknessNormal:"Normal (0)",armWeaknessMild:"Leichte Schwäche oder Absinken (1)",armWeaknessSevere:"Schwere Schwäche oder fällt sofort ab (2)",speechChangesTitle:"Sprachstörungen",speechChangesNormal:"Normal (0)",speechChangesMild:"Leichte Dysarthrie oder Aphasie (1)",speechChangesSevere:"Schwere Dysarthrie oder Aphasie (2)",eyeDeviationTitle:"Blickdeviation",eyeDeviationNormal:"Normal (0)",eyeDeviationPartial:"Partielle Blickdeviation (1)",eyeDeviationForced:"Forcierte Blickdeviation (2)",denialNeglectTitle:"Verneinung/Neglect",denialNeglectNormal:"Normal (0)",denialNeglectPartial:"Partieller Neglect (1)",denialNeglectComplete:"Kompletter Neglect (2)",totalScoreTitle:"Gesamt-FAST-ED-Score",riskLevel:"Risikostufe",riskLevelLow:"NIEDRIG (Score <4)",riskLevelHigh:"HOCH (Score ≥4 - LVO erwägen)",applyScore:"Score Anwenden",cancel:"Abbrechen",riskAnalysis:"Risikoanalyse",riskAnalysisSubtitle:"Klinische Faktoren in dieser Bewertung",contributingFactors:"Beitragende Faktoren",factorsShown:"angezeigt",positiveFactors:"Positive Faktoren",negativeFactors:"Negative Faktoren",clinicalInformation:"Klinische Informationen",clinicalRecommendations:"Klinische Empfehlungen",clinicalRec1:"Sofortige Bildgebung erwägen bei hohem ICB-Risiko",clinicalRec2:"Stroke-Team aktivieren bei LVO-Score ≥ 50%",clinicalRec3:"Blutdruck engmaschig überwachen",clinicalRec4:"Alle Befunde gründlich dokumentieren",noDriverData:"Keine Treiberdaten verfügbar",driverAnalysisUnavailable:"Treiberanalyse nicht verfügbar",driverInfoNotAvailable:"Treiberinformationen von diesem Vorhersagemodell nicht verfügbar",driverAnalysisNotAvailable:"Treiberanalyse für diese Vorhersage nicht verfügbar",lvoNotPossible:"LVO-Bewertung mit begrenzten Daten nicht möglich",fullExamRequired:"Vollständige neurologische Untersuchung für LVO-Screening erforderlich",limitedAssessment:"Begrenzte Bewertung",disclaimer:"Klinischer Haftungsausschluss",disclaimerText:"Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle. Kein Ersatz für ärztliche Beurteilung.",importantNote:"Wichtig",importantText:"Diese Ergebnisse dienen nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie institutionelle Protokolle.",predictedMortality:"Vorhergesagte 30-Tage-Mortalität",ichVolumeLabel:"ICB-Volumen",references:"Referenzen",inputSummaryTitle:"Eingabezusammenfassung",inputSummarySubtitle:"Für diese Analyse verwendete Werte",privacyLink:"Datenschutzrichtlinie",disclaimerLink:"Medizinischer Haftungsausschluss",versionLink:"Version 2.1.0 - Research Preview",privacyPolicy:"Datenschutzrichtlinie: Dieses Tool verarbeitet Daten lokal. Keine Patientendaten werden gespeichert oder übertragen.",medicalDisclaimer:"Medizinischer Haftungsausschluss: Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle.",networkError:"Netzwerkfehler - bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut",requestTimeout:"Anfrage-Timeout - bitte versuchen Sie es erneut",apiError:"Ergebnisse konnten nicht abgerufen werden",validationError:"Bitte überprüfen Sie Ihre Eingabewerte",sessionTimeout:"Ihre Sitzung war 30 Minuten lang inaktiv. Möchten Sie fortfahren?",unsavedData:"Sie haben ungespeicherte Daten. Sind Sie sicher, dass Sie verlassen möchten?",nearestCentersTitle:"Nächstgelegene Schlaganfall-Zentren",useCurrentLocation:"Aktuellen Standort verwenden",enterLocationPlaceholder:"Stadt oder Adresse eingeben...",enterManually:"Standort manuell eingeben",search:"Suchen",yourLocation:"Ihr Standort",recommendedCenters:"Empfohlene Zentren",alternativeCenters:"Alternative Zentren",noCentersFound:"Keine Schlaganfall-Zentren in diesem Bereich gefunden",gettingLocation:"Standort wird ermittelt",searchingLocation:"Standort wird gesucht",locationError:"Standort konnte nicht ermittelt werden",locationPermissionDenied:"Standortzugriff verweigert. Bitte erlauben Sie Standortzugriff und versuchen Sie es erneut.",locationUnavailable:"Standortinformationen sind nicht verfügbar",locationTimeout:"Standortanfrage ist abgelaufen",geolocationNotSupported:"Geolokalisierung wird von diesem Browser nicht unterstützt",geocodingNotImplemented:"Standortsuche nicht verfügbar. Bitte verwenden Sie GPS oder geben Sie Koordinaten manuell ein.",tryManualEntry:"Versuchen Sie, Ihren Standort manuell einzugeben oder GPS zu verwenden.",distanceNote:"Entfernungen werden als Luftlinie berechnet. Tatsächliche Fahrzeiten können variieren.",travelTimeNote:"Fahrzeiten berechnet für Rettungsfahrzeuge mit Sondersignalen und Vorfahrtsberechtigung.",calculatingTravelTimes:"Fahrzeiten werden berechnet",minutes:"Min",poweredByOrs:"Fahrzeiten bereitgestellt von OpenRoute Service",comprehensiveCenter:"Überregionales Schlaganfall-Zentrum",primaryCenter:"Regionales Schlaganfall-Zentrum",telemetryCenter:"Telemedizin-Zentrum",thrombectomy:"Thrombektomie",neurosurgery:"Neurochirurgie",icu:"Intensivstation",telemedicine:"Telemedizin",stroke_unit:"Stroke Unit",call:"Anrufen",directions:"Wegbeschreibung",emergency:"Notfall",certified:"Zertifiziert",prerequisitesTitle:"Voraussetzungen für Schlaganfall-Triage",prerequisitesIntro:"Bitte bestätigen Sie, dass alle folgenden Voraussetzungen erfüllt sind:",prerequisitesWarning:"Alle Voraussetzungen müssen erfüllt sein, um fortzufahren",continue:"Weiter",acute_deficit:"Akutes (schweres) neurologisches Defizit vorhanden",symptom_onset:"Symptombeginn innerhalb 6h",no_preexisting:"Keine vorbestehende schwere neurologische Defizite",no_trauma:"Kein Schädelhirntrauma vorhanden",differentialDiagnoses:"Differentialdiagnosen",reconfirmTimeWindow:"Bitte Zeitfenster rekonfirmieren!",unclearTimeWindow:"Bei unklarem/erweitertem Zeitfenster ist auch ein beginnend demarkierter Hirninfarkt möglich",rareDiagnoses:"Seltene Diagnosen wie ein Glioblastom sind auch möglich"}};class Fe{constructor(){this.supportedLanguages=["en","de"],this.currentLanguage=this.detectLanguage()}detectLanguage(){const e=localStorage.getItem("language");return e&&this.supportedLanguages.includes(e)?e:(navigator.language||navigator.userLanguage).substring(0,2).toLowerCase()==="de"?"de":"en"}getCurrentLanguage(){return this.currentLanguage}setLanguage(e){return this.supportedLanguages.includes(e)?(this.currentLanguage=e,localStorage.setItem("language",e),window.dispatchEvent(new CustomEvent("languageChanged",{detail:{language:e}})),!0):!1}getSupportedLanguages(){return[...this.supportedLanguages]}t(e){return(ae[this.currentLanguage]||ae.en)[e]||e}toggleLanguage(){const e=this.currentLanguage==="en"?"de":"en";return this.setLanguage(e)}getLanguageDisplayName(e=null){const i=e||this.currentLanguage;return{en:"English",de:"Deutsch"}[i]||i}formatDateTime(e){const i=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(i,{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(e)}formatTime(e){const i=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(i,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(e)}}const S=new Fe,o=t=>S.t(t);function se(){return`
    <div class="container">
      ${M(1)}
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
  `}function Ne(){return`
    <div class="container">
      ${M(1)}
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
  `}const A={COMA_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_coma_ich",LDM_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_limited_data_ich",FULL_STROKE:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_full_stroke"},be={ich:{medium:25,high:50},lvo:{medium:25,high:50}},k={min:29,max:10001},W={autoSaveInterval:18e4,sessionTimeout:30*60*1e3,requestTimeout:1e4},_e={age_years:{required:!0,min:0,max:120},systolic_bp:{required:!0,min:60,max:300},diastolic_bp:{required:!0,min:30,max:200},gfap_value:{required:!0,min:k.min,max:k.max},fast_ed_score:{required:!0,min:0,max:9}};function Be(){return`
    <div class="container">
      ${M(2)}
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
            <input type="number" id="gfap_value" name="gfap_value" min="${k.min}" max="${k.max}" step="0.1" required aria-describedby="gfap-help">
            <div id="gfap-help" class="input-help">
              ${o("gfapRange").replace("{min}",k.min).replace("{max}",k.max)}
            </div>
          </div>
        </div>
        <button type="submit" class="primary">${o("analyzeIchRisk")}</button>
        <button type="button" class="secondary" data-action="reset">${o("startOver")}</button>
      </form>
    </div>
  `}function He(){return`
    <div class="container">
      ${M(2)}
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
              <input type="number" name="gfap_value" id="gfap_value" min="${k.min}" max="${k.max}" step="0.1" required inputmode="decimal">
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
  `}function xe(){return`
    <div class="container">
      ${M(2)}
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
              <input type="number" name="gfap_value" id="gfap_value" min="${k.min}" max="${k.max}" step="0.1" required inputmode="decimal">
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
  `}const Oe="modulepreload",Ve=function(t){return"/0825/"+t},ne={},ze=function(e,i,a){let s=Promise.resolve();if(i&&i.length>0){document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),c=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));s=Promise.allSettled(i.map(l=>{if(l=Ve(l),l in ne)return;ne[l]=!0;const d=l.endsWith(".css"),m=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${m}`))return;const u=document.createElement("link");if(u.rel=d?"stylesheet":Oe,d||(u.as="script"),u.crossOrigin="",u.href=l,c&&u.setAttribute("nonce",c),document.head.appendChild(u),d)return new Promise((b,v)=>{u.addEventListener("load",b),u.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${l}`)))})}))}function n(r){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=r,window.dispatchEvent(c),!c.defaultPrevented)throw r}return s.then(r=>{for(const c of r||[])c.status==="rejected"&&n(c.reason);return e().catch(n)})};function ve(){return`
    <div class="critical-alert">
      <h4><span class="alert-icon">🚨</span> ${o("criticalAlertTitle")}</h4>
      <p>${o("criticalAlertMessage")}</p>
    </div>
  `}const qe={age_years:"ageLabel",age:"ageLabel",systolic_bp:"systolicLabel",diastolic_bp:"diastolicLabel",systolic_blood_pressure:"systolicLabel",diastolic_blood_pressure:"diastolicLabel",blood_pressure_systolic:"systolicLabel",blood_pressure_diastolic:"diastolicLabel",gfap_value:"gfapLabel",gfap:"gfapLabel",gfap_level:"gfapLabel",fast_ed_score:"fastEdLabel",fast_ed:"fastEdLabel",fast_ed_total:"fastEdLabel",vigilanzminderung:"vigilanzLabel",vigilance_reduction:"vigilanzLabel",reduced_consciousness:"vigilanzLabel",armparese:"armPareseLabel",arm_paresis:"armPareseLabel",arm_weakness:"armPareseLabel",beinparese:"beinPareseLabel",leg_paresis:"beinPareseLabel",leg_weakness:"beinPareseLabel",eye_deviation:"eyeDeviationLabel",blickdeviation:"eyeDeviationLabel",headache:"headacheLabel",kopfschmerzen:"headacheLabel",atrial_fibrillation:"atrialFibLabel",vorhofflimmern:"atrialFibLabel",anticoagulated_noak:"anticoagLabel",anticoagulation:"anticoagLabel",antiplatelets:"antiplateletsLabel",thrombozytenaggregationshemmer:"antiplateletsLabel"},Ue=[{pattern:/_score$/,replacement:" Score"},{pattern:/_value$/,replacement:" Level"},{pattern:/_bp$/,replacement:" Blood Pressure"},{pattern:/_years?$/,replacement:" (years)"},{pattern:/^ich_/,replacement:"Brain Bleeding "},{pattern:/^lvo_/,replacement:"Large Vessel "},{pattern:/parese$/,replacement:"Weakness"},{pattern:/deviation$/,replacement:"Movement"}];function V(t){if(!t)return"";const e=qe[t.toLowerCase()];if(e){const a=o(e);if(a&&a!==e)return a}let i=t.toLowerCase();return Ue.forEach(({pattern:a,replacement:s})=>{i=i.replace(a,s)}),i=i.replace(/_/g," ").replace(/\b\w/g,a=>a.toUpperCase()).trim(),i}function Ke(t){return V(t).replace(/\s*\([^)]*\)\s*/g,"").trim()}function We(t,e=""){return t==null||t===""?"":typeof t=="boolean"?t?"✓":"✗":typeof t=="number"?e.includes("bp")||e.includes("blood_pressure")?`${t} mmHg`:e.includes("gfap")?`${t} pg/mL`:e.includes("age")?`${t} years`:e.includes("score")||Number.isInteger(t)?t.toString():t.toFixed(1):t.toString()}function Ge(t,e){if(console.log("=== DRIVER RENDERING SECTION ==="),console.log("🧠 ICH result received:",{probability:t==null?void 0:t.probability,hasDrivers:!!(t!=null&&t.drivers),module:t==null?void 0:t.module}),console.log("🩸 LVO result received:",{probability:e==null?void 0:e.probability,hasDrivers:!!(e!=null&&e.drivers),module:e==null?void 0:e.module,notPossible:e==null?void 0:e.notPossible}),!(t!=null&&t.drivers)&&!(e!=null&&e.drivers))return console.log("❌ No drivers available for rendering"),"";let i=`
    <div class="drivers-section">
      <div class="drivers-header">
        <h3><span class="driver-header-icon">🎯</span> ${o("riskAnalysis")}</h3>
        <p class="drivers-subtitle">${o("riskAnalysisSubtitle")}</p>
      </div>
      <div class="enhanced-drivers-grid">
  `;return t!=null&&t.drivers&&(console.log("🧠 Rendering ICH drivers panel"),i+=re(t.drivers,"ICH","ich",t.probability)),e!=null&&e.drivers&&!e.notPossible&&(console.log("🩸 Rendering LVO drivers panel"),i+=re(e.drivers,"LVO","lvo",e.probability)),i+=`
      </div>
    </div>
  `,i}function re(t,e,i,a){if(console.log(`--- ${e} Driver Panel Debug ---`),console.log("Raw drivers input:",t),console.log("Title:",e,"Type:",i,"Probability:",a),!t||Object.keys(t).length===0)return console.log(`No drivers data for ${e}`),`
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
    `;const s=t;if(console.log(`${e} drivers ready for display:`,s),s.kind==="unavailable")return`
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
    `;const n=s.positive.sort((d,m)=>Math.abs(m.weight)-Math.abs(d.weight)).slice(0,3),r=s.negative.sort((d,m)=>Math.abs(m.weight)-Math.abs(d.weight)).slice(0,3);console.log(`🎯 ${e} Final displayed drivers:`),console.log("  Top positive:",n.map(d=>`${d.label}: +${(Math.abs(d.weight)*100).toFixed(1)}%`)),console.log("  Top negative:",r.map(d=>`${d.label}: -${(Math.abs(d.weight)*100).toFixed(1)}%`));const c=Math.max(...n.map(d=>Math.abs(d.weight)),...r.map(d=>Math.abs(d.weight)),.01);let l=`
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
  `;return n.length>0?n.forEach(d=>{const m=Math.abs(d.weight*100),u=Math.abs(d.weight)/c*100,b=V(d.label);l+=`
        <div class="compact-driver-item">
          <div class="compact-driver-label">${b}</div>
          <div class="compact-driver-bar positive" style="width: ${u}%">
            <span class="compact-driver-value">+${m.toFixed(0)}%</span>
          </div>
        </div>
      `}):l+=`<div class="no-factors">${o("noPositiveFactors")}</div>`,l+=`
          </div>
        </div>
        
        <div class="drivers-column negative-column">
          <div class="column-header">
            <span class="column-icon">↓</span>
            <span class="column-title">${o("decreaseRisk")}</span>
          </div>
          <div class="compact-drivers">
  `,r.length>0?r.forEach(d=>{const m=Math.abs(d.weight*100),u=Math.abs(d.weight)/c*100,b=V(d.label);l+=`
        <div class="compact-driver-item">
          <div class="compact-driver-label">${b}</div>
          <div class="compact-driver-bar negative" style="width: ${u}%">
            <span class="compact-driver-value">-${m.toFixed(0)}%</span>
          </div>
        </div>
      `}):l+=`<div class="no-factors">${o("noNegativeFactors")}</div>`,l+=`
          </div>
        </div>
      </div>
    </div>
  `,l}const fe={bayern:{neurosurgicalCenters:[{id:"BY-NS-001",name:"LMU Klinikum München - Großhadern",address:"Marchioninistraße 15, 81377 München",coordinates:{lat:48.1106,lng:11.4684},phone:"+49 89 4400-0",emergency:"+49 89 4400-73331",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1440,network:"TEMPiS"},{id:"BY-NS-002",name:"Klinikum rechts der Isar München (TUM)",address:"Ismaninger Str. 22, 81675 München",coordinates:{lat:48.1497,lng:11.6052},phone:"+49 89 4140-0",emergency:"+49 89 4140-2249",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1161,network:"TEMPiS"},{id:"BY-NS-003",name:"Städtisches Klinikum München Schwabing",address:"Kölner Platz 1, 80804 München",coordinates:{lat:48.1732,lng:11.5755},phone:"+49 89 3068-0",emergency:"+49 89 3068-2050",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:648,network:"TEMPiS"},{id:"BY-NS-004",name:"Städtisches Klinikum München Bogenhausen",address:"Englschalkinger Str. 77, 81925 München",coordinates:{lat:48.1614,lng:11.6254},phone:"+49 89 9270-0",emergency:"+49 89 9270-2050",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:689,network:"TEMPiS"},{id:"BY-NS-005",name:"Universitätsklinikum Erlangen",address:"Maximiliansplatz 2, 91054 Erlangen",coordinates:{lat:49.5982,lng:11.0037},phone:"+49 9131 85-0",emergency:"+49 9131 85-39003",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1371,network:"TEMPiS"},{id:"BY-NS-006",name:"Universitätsklinikum Regensburg",address:"Franz-Josef-Strauß-Allee 11, 93053 Regensburg",coordinates:{lat:49.0134,lng:12.0991},phone:"+49 941 944-0",emergency:"+49 941 944-7501",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1042,network:"TEMPiS"},{id:"BY-NS-007",name:"Universitätsklinikum Würzburg",address:"Oberdürrbacher Str. 6, 97080 Würzburg",coordinates:{lat:49.784,lng:9.9721},phone:"+49 931 201-0",emergency:"+49 931 201-24444",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1264,network:"TEMPiS"},{id:"BY-NS-008",name:"Klinikum Nürnberg Nord",address:"Prof.-Ernst-Nathan-Str. 1, 90419 Nürnberg",coordinates:{lat:49.4521,lng:11.0767},phone:"+49 911 398-0",emergency:"+49 911 398-2369",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1368,network:"TEMPiS"},{id:"BY-NS-009",name:"Universitätsklinikum Augsburg",address:"Stenglinstr. 2, 86156 Augsburg",coordinates:{lat:48.3668,lng:10.9093},phone:"+49 821 400-01",emergency:"+49 821 400-2356",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1740,network:"TEMPiS"},{id:"BY-NS-010",name:"Klinikum Aschaffenburg-Alzenau",address:"Am Hasenkopf 1, 63739 Aschaffenburg",coordinates:{lat:49.9737,lng:9.157},phone:"+49 6021 32-0",emergency:"+49 6021 32-2800",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:40,network:"TRANSIT"},{id:"BY-NS-011",name:"Klinikum Landshut",address:"Robert-Koch-Str. 1, 84034 Landshut",coordinates:{lat:48.5665,lng:12.1512},phone:"+49 871 698-0",emergency:"+49 871 698-3333",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:505,network:"TEMPiS"},{id:"BY-NS-012",name:"Klinikum Coburg",address:"Ketschendorfer Str. 33, 96450 Coburg",coordinates:{lat:50.2596,lng:10.9644},phone:"+49 9561 22-0",emergency:"+49 9561 22-6800",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:547,network:"STENO"},{id:"BY-NS-013",name:"Klinikum Passau",address:"Bischof-Pilgrim-Str. 1, 94032 Passau",coordinates:{lat:48.5665,lng:13.4777},phone:"+49 851 5300-0",emergency:"+49 851 5300-2222",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:696,network:"TEMPiS"}],comprehensiveStrokeCenters:[{id:"BY-CS-001",name:"Klinikum Bamberg",address:"Buger Str. 80, 96049 Bamberg",coordinates:{lat:49.8988,lng:10.9027},phone:"+49 951 503-0",emergency:"+49 951 503-11101",thrombectomy:!0,thrombolysis:!0,beds:630,network:"TEMPiS"},{id:"BY-CS-002",name:"Klinikum Bayreuth",address:"Preuschwitzer Str. 101, 95445 Bayreuth",coordinates:{lat:49.9459,lng:11.5779},phone:"+49 921 400-0",emergency:"+49 921 400-5401",thrombectomy:!0,thrombolysis:!0,beds:848,network:"TEMPiS"},{id:"BY-CS-003",name:"Klinikum Coburg",address:"Ketschendorfer Str. 33, 96450 Coburg",coordinates:{lat:50.2596,lng:10.9685},phone:"+49 9561 22-0",emergency:"+49 9561 22-6300",thrombectomy:!0,thrombolysis:!0,beds:522,network:"TEMPiS"}],regionalStrokeUnits:[{id:"BY-RSU-001",name:"Goldberg-Klinik Kelheim",address:"Traubenweg 3, 93309 Kelheim",coordinates:{lat:48.9166,lng:11.8742},phone:"+49 9441 702-0",emergency:"+49 9441 702-6800",thrombolysis:!0,beds:200,network:"TEMPiS"},{id:"BY-RSU-002",name:"DONAUISAR Klinikum Deggendorf",address:"Perlasberger Str. 41, 94469 Deggendorf",coordinates:{lat:48.8372,lng:12.9619},phone:"+49 991 380-0",emergency:"+49 991 380-2201",thrombolysis:!0,beds:450,network:"TEMPiS"},{id:"BY-RSU-003",name:"Klinikum St. Elisabeth Straubing",address:"St.-Elisabeth-Str. 23, 94315 Straubing",coordinates:{lat:48.8742,lng:12.5733},phone:"+49 9421 710-0",emergency:"+49 9421 710-2000",thrombolysis:!0,beds:580,network:"TEMPiS"},{id:"BY-RSU-004",name:"Klinikum Freising",address:"Mainburger Str. 29, 85356 Freising",coordinates:{lat:48.4142,lng:11.7461},phone:"+49 8161 24-0",emergency:"+49 8161 24-2800",thrombolysis:!0,beds:380,network:"TEMPiS"},{id:"BY-RSU-005",name:"Klinikum Landkreis Erding",address:"Bajuwarenstr. 5, 85435 Erding",coordinates:{lat:48.3061,lng:11.9067},phone:"+49 8122 59-0",emergency:"+49 8122 59-2201",thrombolysis:!0,beds:350,network:"TEMPiS"},{id:"BY-RSU-006",name:"Helios Amper-Klinikum Dachau",address:"Krankenhausstr. 15, 85221 Dachau",coordinates:{lat:48.2599,lng:11.4342},phone:"+49 8131 76-0",emergency:"+49 8131 76-2201",thrombolysis:!0,beds:480,network:"TEMPiS"},{id:"BY-RSU-007",name:"Klinikum Fürstenfeldbruck",address:"Dachauer Str. 33, 82256 Fürstenfeldbruck",coordinates:{lat:48.1772,lng:11.2578},phone:"+49 8141 99-0",emergency:"+49 8141 99-2201",thrombolysis:!0,beds:420,network:"TEMPiS"},{id:"BY-RSU-008",name:"Klinikum Ingolstadt",address:"Krumenauerstraße 25, 85049 Ingolstadt",coordinates:{lat:48.7665,lng:11.4364},phone:"+49 841 880-0",emergency:"+49 841 880-2201",thrombolysis:!0,beds:665,network:"TEMPiS"},{id:"BY-RSU-009",name:"Klinikum Passau",address:"Bischof-Pilgrim-Str. 1, 94032 Passau",coordinates:{lat:48.5665,lng:13.4513},phone:"+49 851 5300-0",emergency:"+49 851 5300-2100",thrombolysis:!0,beds:540,network:"TEMPiS"},{id:"BY-RSU-010",name:"Klinikum Landshut",address:"Robert-Koch-Str. 1, 84034 Landshut",coordinates:{lat:48.5436,lng:12.1619},phone:"+49 871 698-0",emergency:"+49 871 698-3333",thrombolysis:!0,beds:790,network:"TEMPiS"},{id:"BY-RSU-011",name:"RoMed Klinikum Rosenheim",address:"Pettenkoferstr. 10, 83022 Rosenheim",coordinates:{lat:47.8567,lng:12.1265},phone:"+49 8031 365-0",emergency:"+49 8031 365-3711",thrombolysis:!0,beds:870,network:"TEMPiS"},{id:"BY-RSU-012",name:"Klinikum Memmingen",address:"Bismarckstr. 23, 87700 Memmingen",coordinates:{lat:47.9833,lng:10.1833},phone:"+49 8331 70-0",emergency:"+49 8331 70-2500",thrombolysis:!0,beds:520,network:"TEMPiS"},{id:"BY-RSU-013",name:"Klinikum Kempten-Oberallgäu",address:"Robert-Weixler-Str. 50, 87439 Kempten",coordinates:{lat:47.7261,lng:10.3097},phone:"+49 831 530-0",emergency:"+49 831 530-2201",thrombolysis:!0,beds:650,network:"TEMPiS"},{id:"BY-RSU-014",name:"Klinikum Aschaffenburg-Alzenau",address:"Am Hasenkopf 1, 63739 Aschaffenburg",coordinates:{lat:49.9747,lng:9.1581},phone:"+49 6021 32-0",emergency:"+49 6021 32-2700",thrombolysis:!0,beds:590,network:"TEMPiS"}],thrombolysisHospitals:[{id:"BY-TH-001",name:"Krankenhaus Vilsbiburg",address:"Sonnenstraße 10, 84137 Vilsbiburg",coordinates:{lat:48.6333,lng:12.2833},phone:"+49 8741 60-0",thrombolysis:!0,beds:180},{id:"BY-TH-002",name:"Krankenhaus Eggenfelden",address:"Pfarrkirchener Str. 5, 84307 Eggenfelden",coordinates:{lat:48.4,lng:12.7667},phone:"+49 8721 98-0",thrombolysis:!0,beds:220}]},badenWuerttemberg:{neurosurgicalCenters:[{id:"BW-NS-001",name:"Universitätsklinikum Freiburg",address:"Hugstetter Str. 55, 79106 Freiburg",coordinates:{lat:48.0025,lng:7.8347},phone:"+49 761 270-0",emergency:"+49 761 270-34010",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1600,network:"FAST"},{id:"BW-NS-002",name:"Universitätsklinikum Heidelberg",address:"Im Neuenheimer Feld 400, 69120 Heidelberg",coordinates:{lat:49.4178,lng:8.6706},phone:"+49 6221 56-0",emergency:"+49 6221 56-36643",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1621,network:"FAST"},{id:"BW-NS-003",name:"Universitätsklinikum Tübingen",address:"Geissweg 3, 72076 Tübingen",coordinates:{lat:48.5378,lng:9.0538},phone:"+49 7071 29-0",emergency:"+49 7071 29-82211",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1550,network:"FAST"},{id:"BW-NS-004",name:"Universitätsklinikum Ulm",address:"Albert-Einstein-Allee 23, 89081 Ulm",coordinates:{lat:48.4196,lng:9.9592},phone:"+49 731 500-0",emergency:"+49 731 500-63001",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1264,network:"FAST"},{id:"BW-NS-005",name:"Klinikum Stuttgart - Katharinenhospital",address:"Kriegsbergstraße 60, 70174 Stuttgart",coordinates:{lat:48.7784,lng:9.1682},phone:"+49 711 278-0",emergency:"+49 711 278-32001",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:950,network:"FAST"},{id:"BW-NS-006",name:"Städtisches Klinikum Karlsruhe",address:"Moltkestraße 90, 76133 Karlsruhe",coordinates:{lat:49.0047,lng:8.3858},phone:"+49 721 974-0",emergency:"+49 721 974-2301",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1570,network:"FAST"},{id:"BW-NS-007",name:"Klinikum Ludwigsburg",address:"Posilipostraße 4, 71640 Ludwigsburg",coordinates:{lat:48.8901,lng:9.1953},phone:"+49 7141 99-0",emergency:"+49 7141 99-67201",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:720,network:"FAST"}],comprehensiveStrokeCenters:[{id:"BW-CS-001",name:"Universitätsmedizin Mannheim",address:"Theodor-Kutzer-Ufer 1-3, 68167 Mannheim",coordinates:{lat:49.4828,lng:8.4664},phone:"+49 621 383-0",emergency:"+49 621 383-2251",thrombectomy:!0,thrombolysis:!0,beds:1400,network:"FAST"}],regionalStrokeUnits:[{id:"BW-RSU-001",name:"Robert-Bosch-Krankenhaus Stuttgart",address:"Auerbachstraße 110, 70376 Stuttgart",coordinates:{lat:48.7447,lng:9.2294},phone:"+49 711 8101-0",emergency:"+49 711 8101-3456",thrombolysis:!0,beds:850,network:"FAST"}],thrombolysisHospitals:[]},nordrheinWestfalen:{neurosurgicalCenters:[{id:"NRW-NS-001",name:"Universitätsklinikum Düsseldorf",address:"Moorenstraße 5, 40225 Düsseldorf",coordinates:{lat:51.1906,lng:6.8064},phone:"+49 211 81-0",emergency:"+49 211 81-17700",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1300,network:"NEVANO+"},{id:"NRW-NS-002",name:"Universitätsklinikum Köln",address:"Kerpener Str. 62, 50937 Köln",coordinates:{lat:50.9253,lng:6.9187},phone:"+49 221 478-0",emergency:"+49 221 478-32500",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1500,network:"NEVANO+"},{id:"NRW-NS-003",name:"Universitätsklinikum Essen",address:"Hufelandstraße 55, 45147 Essen",coordinates:{lat:51.4285,lng:7.0073},phone:"+49 201 723-0",emergency:"+49 201 723-84444",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1350,network:"NEVANO+"},{id:"NRW-NS-004",name:"Universitätsklinikum Münster",address:"Albert-Schweitzer-Campus 1, 48149 Münster",coordinates:{lat:51.9607,lng:7.6261},phone:"+49 251 83-0",emergency:"+49 251 83-47255",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1513,network:"NEVANO+"},{id:"NRW-NS-005",name:"Universitätsklinikum Bonn",address:"Venusberg-Campus 1, 53127 Bonn",coordinates:{lat:50.6916,lng:7.1127},phone:"+49 228 287-0",emergency:"+49 228 287-15107",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1200,network:"NEVANO+"},{id:"NRW-NS-006",name:"Klinikum Dortmund",address:"Beurhausstraße 40, 44137 Dortmund",coordinates:{lat:51.5036,lng:7.4663},phone:"+49 231 953-0",emergency:"+49 231 953-20050",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1200,network:"NVNR"},{id:"NRW-NS-007",name:"Rhein-Maas Klinikum Würselen",address:"Mauerfeldstraße 25, 52146 Würselen",coordinates:{lat:50.8178,lng:6.1264},phone:"+49 2405 62-0",emergency:"+49 2405 62-2222",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:420,network:"NEVANO+"}],comprehensiveStrokeCenters:[{id:"NRW-CS-001",name:"Universitätsklinikum Aachen",address:"Pauwelsstraße 30, 52074 Aachen",coordinates:{lat:50.778,lng:6.0614},phone:"+49 241 80-0",emergency:"+49 241 80-89611",thrombectomy:!0,thrombolysis:!0,beds:1400,network:"NEVANO+"}],regionalStrokeUnits:[{id:"NRW-RSU-001",name:"Helios Universitätsklinikum Wuppertal",address:"Heusnerstraße 40, 42283 Wuppertal",coordinates:{lat:51.2467,lng:7.1703},phone:"+49 202 896-0",emergency:"+49 202 896-2180",thrombolysis:!0,beds:1050,network:"NEVANO+"}],thrombolysisHospitals:[{id:"NRW-TH-009",name:"Elisabeth-Krankenhaus Essen",address:"Klara-Kopp-Weg 1, 45138 Essen",coordinates:{lat:51.4495,lng:7.0137},phone:"+49 201 897-0",thrombolysis:!0,beds:583},{id:"NRW-TH-010",name:"Klinikum Oberberg Gummersbach",address:"Wilhelm-Breckow-Allee 20, 51643 Gummersbach",coordinates:{lat:51.0277,lng:7.5694},phone:"+49 2261 17-0",thrombolysis:!0,beds:431},{id:"NRW-TH-011",name:"St. Vincenz-Krankenhaus Limburg",address:"Auf dem Schafsberg, 65549 Limburg",coordinates:{lat:50.3856,lng:8.0584},phone:"+49 6431 292-0",thrombolysis:!0,beds:452},{id:"NRW-TH-012",name:"Klinikum Lüdenscheid",address:"Paulmannshöher Straße 14, 58515 Lüdenscheid",coordinates:{lat:51.2186,lng:7.6298},phone:"+49 2351 46-0",thrombolysis:!0,beds:869}]}},Ye={routePatient:function(t){const{location:e,state:i,ichProbability:a,timeFromOnset:s,clinicalFactors:n}=t,r=i||this.detectState(e),c=fe[r];if(a>=.5){const l=this.findNearest(e,c.neurosurgicalCenters);if(!l)throw new Error(`No neurosurgical centers available in ${r}`);return{category:"NEUROSURGICAL_CENTER",destination:l,urgency:"IMMEDIATE",reasoning:"High bleeding probability (≥50%) - neurosurgical evaluation required",preAlert:"Activate neurosurgery team",bypassLocal:!0,threshold:"≥50%",state:r}}else if(a>=.3){const l=[...c.neurosurgicalCenters,...c.comprehensiveStrokeCenters];return{category:"COMPREHENSIVE_CENTER",destination:this.findNearest(e,l),urgency:"URGENT",reasoning:"Intermediate bleeding risk (30-50%) - CT and possible intervention",preAlert:"Prepare for possible neurosurgical consultation",transferPlan:this.findNearest(e,c.neurosurgicalCenters),threshold:"30-50%",state:r}}else if(s&&s<=270){const l=[...c.neurosurgicalCenters,...c.comprehensiveStrokeCenters,...c.regionalStrokeUnits,...c.thrombolysisHospitals];return{category:"THROMBOLYSIS_CAPABLE",destination:this.findNearest(e,l),urgency:"TIME_CRITICAL",reasoning:"Low bleeding risk (<30%), within tPA window - nearest thrombolysis",preAlert:"Prepare for thrombolysis protocol",bypassLocal:!1,threshold:"<30%",timeWindow:"≤4.5h",state:r}}else{const l=[...c.neurosurgicalCenters,...c.comprehensiveStrokeCenters,...c.regionalStrokeUnits];return{category:"STROKE_UNIT",destination:this.findNearest(e,l),urgency:"STANDARD",reasoning:s>270?"Low bleeding risk, outside tPA window - standard stroke evaluation":"Low bleeding risk - standard stroke evaluation",preAlert:"Standard stroke protocol",bypassLocal:!1,threshold:"<30%",timeWindow:s?">4.5h":"unknown",state:r}}},detectState:function(t){return t.lat>=47.5&&t.lat<=49.8&&t.lng>=7.5&&t.lng<=10.2?"badenWuerttemberg":t.lat>=50.3&&t.lat<=52.5&&t.lng>=5.9&&t.lng<=9.5?"nordrheinWestfalen":t.lat>=47.2&&t.lat<=50.6&&t.lng>=10.2&&t.lng<=13.8?"bayern":this.findNearestState(t)},findNearestState:function(t){const e={bayern:{lat:49,lng:11.5},badenWuerttemberg:{lat:48.5,lng:9},nordrheinWestfalen:{lat:51.5,lng:7.5}};let i="bayern",a=1/0;for(const[s,n]of Object.entries(e)){const r=this.calculateDistance(t,n);r<a&&(a=r,i=s)}return i},findNearest:function(t,e){return!e||e.length===0?(console.warn("No hospitals available in database"),null):e.map(i=>!i.coordinates||typeof i.coordinates.lat!="number"?(console.warn(`Hospital ${i.name} missing valid coordinates`),null):{...i,distance:this.calculateDistance(t,i.coordinates)}).filter(i=>i!==null).sort((i,a)=>i.distance-a.distance)[0]},calculateDistance:function(t,e){const a=this.toRad(e.lat-t.lat),s=this.toRad(e.lng-t.lng),n=Math.sin(a/2)*Math.sin(a/2)+Math.cos(this.toRad(t.lat))*Math.cos(this.toRad(e.lat))*Math.sin(s/2)*Math.sin(s/2);return 6371*(2*Math.atan2(Math.sqrt(n),Math.sqrt(1-n)))},toRad:function(t){return t*(Math.PI/180)}};function z(t,e,i,a){const n=O(i-t),r=O(a-e),c=Math.sin(n/2)*Math.sin(n/2)+Math.cos(O(t))*Math.cos(O(i))*Math.sin(r/2)*Math.sin(r/2);return 6371*(2*Math.atan2(Math.sqrt(c),Math.sqrt(1-c)))}function O(t){return t*(Math.PI/180)}async function je(t,e,i,a,s="driving-car"){try{const n=`https://api.openrouteservice.org/v2/directions/${s}`,c=await fetch(n,{method:"POST",headers:{Accept:"application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",Authorization:"5b3ce3597851110001cf624868c4c27b63ae476c9c26c8bffbc35688","Content-Type":"application/json; charset=utf-8"},body:JSON.stringify({coordinates:[[e,t],[a,i]],radiuses:[1e3,1e3],format:"json"})});if(!c.ok)throw new Error(`Routing API error: ${c.status}`);const l=await c.json();if(l.routes&&l.routes.length>0){const d=l.routes[0];return{duration:Math.round(d.summary.duration/60),distance:Math.round(d.summary.distance/1e3),source:"routing"}}else throw new Error("No route found")}catch(n){console.warn("Travel time calculation failed, using distance estimate:",n);const r=z(t,e,i,a);return{duration:Math.round(r/.8),distance:Math.round(r),source:"estimated"}}}async function oe(t,e,i,a){try{const s=await je(t,e,i,a,"driving-car");return{duration:Math.round(s.duration*.75),distance:s.distance,source:s.source==="routing"?"emergency-routing":"emergency-estimated"}}catch{const n=z(t,e,i,a);return{duration:Math.round(n/1.2),distance:Math.round(n),source:"emergency-estimated"}}}function ye(t){return`
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
  `}function Je(t){const e=document.getElementById("useGpsButton"),i=document.getElementById("manualLocationButton"),a=document.querySelector(".location-manual"),s=document.getElementById("locationInput"),n=document.getElementById("searchLocationButton"),r=document.getElementById("strokeCenterResults");e&&e.addEventListener("click",()=>{Ze(t,r)}),i&&i.addEventListener("click",()=>{a.style.display=a.style.display==="none"?"block":"none"}),n&&n.addEventListener("click",()=>{const c=s.value.trim();c&&le(c,t,r)}),s&&s.addEventListener("keypress",c=>{if(c.key==="Enter"){const l=s.value.trim();l&&le(l,t,r)}})}function Ze(t,e){if(!navigator.geolocation){D(o("geolocationNotSupported"),e);return}e.innerHTML=`<div class="loading">${o("gettingLocation")}...</div>`,navigator.geolocation.getCurrentPosition(i=>{const{latitude:a,longitude:s}=i.coords;G(a,s,t,e)},i=>{let a=o("locationError");switch(i.code){case i.PERMISSION_DENIED:a=o("locationPermissionDenied");break;case i.POSITION_UNAVAILABLE:a=o("locationUnavailable");break;case i.TIMEOUT:a=o("locationTimeout");break}D(a,e)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:3e5})}async function le(t,e,i){i.innerHTML=`<div class="loading">${o("searchingLocation")}...</div>`;const a=/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/,s=t.trim().match(a);if(s){const n=parseFloat(s[1]),r=parseFloat(s[2]);if(n>=47.2&&n<=52.5&&r>=5.9&&r<=15){i.innerHTML=`
        <div class="location-success">
          <p>📍 Coordinates: ${n.toFixed(4)}, ${r.toFixed(4)}</p>
        </div>
      `,setTimeout(()=>{G(n,r,e,i)},500);return}else{D("Coordinates appear to be outside Germany. Please check the values.",i);return}}try{let n=t.trim();!n.toLowerCase().includes("deutschland")&&!n.toLowerCase().includes("germany")&&!n.toLowerCase().includes("bayern")&&!n.toLowerCase().includes("bavaria")&&!n.toLowerCase().includes("nordrhein")&&!n.toLowerCase().includes("baden")&&(n=n+", Deutschland");const c=`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(n)}&countrycodes=de&format=json&limit=3&addressdetails=1`,l=await fetch(c,{method:"GET",headers:{Accept:"application/json","User-Agent":"iGFAP-StrokeTriage/2.1.0"}});if(!l.ok)throw new Error(`Geocoding API error: ${l.status}`);const d=await l.json();if(d&&d.length>0){let m=d[0];const u=["Bayern","Baden-Württemberg","Nordrhein-Westfalen"];for(const h of d)if(h.address&&u.includes(h.address.state)){m=h;break}const b=parseFloat(m.lat),v=parseFloat(m.lon),g=m.display_name||t;i.innerHTML=`
        <div class="location-success">
          <p>📍 Found: ${g}</p>
          <small style="color: #666;">Lat: ${b.toFixed(4)}, Lng: ${v.toFixed(4)}</small>
        </div>
      `,setTimeout(()=>{G(b,v,e,i)},1e3)}else D(`
        <strong>Location "${t}" not found.</strong><br>
        <small>Try:</small>
        <ul style="text-align: left; font-size: 0.9em; margin: 10px 0;">
          <li>City name: "München", "Köln", "Stuttgart"</li>
          <li>Address: "Marienplatz 1, München"</li>
          <li>Coordinates: "48.1351, 11.5820"</li>
        </ul>
      `,i)}catch(n){console.warn("Geocoding failed:",n),D(`
      <strong>Unable to search location.</strong><br>
      <small>Please try entering coordinates directly (e.g., "48.1351, 11.5820")</small>
    `,i)}}async function G(t,e,i,a){var c,l;const s={lat:t,lng:e},n=Ye.routePatient({location:s,ichProbability:((c=i==null?void 0:i.ich)==null?void 0:c.probability)||0,timeFromOnset:(i==null?void 0:i.timeFromOnset)||null,clinicalFactors:(i==null?void 0:i.clinicalFactors)||{}});if(!n||!n.destination){a.innerHTML=`
      <div class="location-error">
        <p>⚠️ No suitable stroke centers found in this area.</p>
        <p><small>Please try a different location or contact emergency services directly.</small></p>
      </div>
    `;return}const r=Qe(n,i);a.innerHTML=`
    <div class="location-info">
      <p><strong>${o("yourLocation")}:</strong> ${t.toFixed(4)}, ${e.toFixed(4)}</p>
      <p><strong>Detected State:</strong> ${ce(n.state)}</p>
    </div>
    <div class="loading">${o("calculatingTravelTimes")}...</div>
  `;try{const d=fe[n.state],m=[...d.neurosurgicalCenters,...d.comprehensiveStrokeCenters,...d.regionalStrokeUnits,...d.thrombolysisHospitals||[]],u=n.destination;u.distance=z(t,e,u.coordinates.lat,u.coordinates.lng);try{const g=await oe(t,e,u.coordinates.lat,u.coordinates.lng);u.travelTime=g.duration,u.travelSource=g.source}catch{u.travelTime=Math.round(u.distance/.8),u.travelSource="estimated"}const b=m.filter(g=>g.id!==u.id).map(g=>({...g,distance:z(t,e,g.coordinates.lat,g.coordinates.lng)})).sort((g,h)=>g.distance-h.distance).slice(0,3);for(const g of b)try{const h=await oe(t,e,g.coordinates.lat,g.coordinates.lng);g.travelTime=h.duration,g.travelSource=h.source}catch{g.travelTime=Math.round(g.distance/.8),g.travelSource="estimated"}const v=`
      <div class="location-info">
        <p><strong>${o("yourLocation")}:</strong> ${t.toFixed(4)}, ${e.toFixed(4)}</p>
        <p><strong>State:</strong> ${ce(n.state)}</p>
        ${r}
      </div>
      
      <div class="recommended-centers">
        <h4>🏥 ${n.urgency==="IMMEDIATE"?"Emergency":"Recommended"} Destination</h4>
        ${de(u,!0,n)}
      </div>
      
      ${b.length>0?`
        <div class="alternative-centers">
          <h4>Alternative Centers</h4>
          ${b.map(g=>de(g,!1,n)).join("")}
        </div>
      `:""}
      
      <div class="travel-time-note">
        <small>${o("travelTimeNote")||"Travel times estimated for emergency vehicles"}</small>
      </div>
    `;a.innerHTML=v}catch(d){console.warn("Enhanced routing failed, using basic display:",d),a.innerHTML=`
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
    `}}function ce(t){return{bayern:"Bayern (Bavaria)",badenWuerttemberg:"Baden-Württemberg",nordrheinWestfalen:"Nordrhein-Westfalen (NRW)"}[t]||t}function Qe(t,e){var s;const i=Math.round((((s=e==null?void 0:e.ich)==null?void 0:s.probability)||0)*100);let a="🏥";return t.urgency==="IMMEDIATE"?a="🚨":t.urgency==="TIME_CRITICAL"?a="⏰":t.urgency==="URGENT"&&(a="⚠️"),`
    <div class="routing-explanation ${t.category.toLowerCase()}">
      <div class="routing-header">
        <strong>${a} ${t.category.replace("_"," ")} - ${t.urgency}</strong>
      </div>
      <div class="routing-details">
        <p><strong>ICH Risk:</strong> ${i}% ${t.threshold?`(${t.threshold})`:""}</p>
        ${t.timeWindow?`<p><strong>Time Window:</strong> ${t.timeWindow}</p>`:""}
        <p><strong>Routing Logic:</strong> ${t.reasoning}</p>
        <p><strong>Pre-Alert:</strong> ${t.preAlert}</p>
        ${t.bypassLocal?'<p class="bypass-warning">⚠️ Bypassing local hospitals</p>':""}
      </div>
    </div>
  `}function de(t,e,i){const a=[];t.neurosurgery&&a.push("🧠 Neurosurgery"),t.thrombectomy&&a.push("🩸 Thrombectomy"),t.thrombolysis&&a.push("💉 Thrombolysis");const s=t.network?`<span class="network-badge">${t.network}</span>`:"";return`
    <div class="stroke-center-card ${e?"recommended":"alternative"} enhanced">
      <div class="center-header">
        <h5>${t.name}</h5>
        <div class="center-badges">
          ${t.neurosurgery?'<span class="capability-badge neurosurgery">NS</span>':""}
          ${t.thrombectomy?'<span class="capability-badge thrombectomy">TE</span>':""}
          ${s}
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
        
        ${a.length>0?`
          <div class="capabilities">
            ${a.join(" • ")}
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
  `}function D(t,e){e.innerHTML=`
    <div class="location-error">
      <p>⚠️ ${t}</p>
      <p><small>${o("tryManualEntry")}</small></p>
    </div>
  `}function Xe(t,e){const i=Number(t),a=be[e];return i>=a.high?"🔴 HIGH RISK":i>=a.medium?"🟡 MEDIUM RISK":"🟢 LOW RISK"}const K={moderate:{min:10},high:{min:20},critical:{min:30}};function ke(t){if(!t||t<=0)return{volume:0,volumeRange:{min:0,max:0},riskLevel:"low",mortalityRate:"~0%",isValid:!0,calculation:"No hemorrhage detected"};const e=Math.min(t,1e4);t>1e4&&console.warn(`GFAP value ${t} exceeds expected range, capped at 10,000 pg/ml`);try{const i=.0192+.4533*Math.log10(e),a=Math.pow(10,i),s={min:a*.7,max:a*1.3},n=et(a),r=tt(a),c=a<1?"<1":a.toFixed(1);return{volume:a,displayVolume:c,volumeRange:{min:s.min.toFixed(1),max:s.max.toFixed(1)},riskLevel:n,mortalityRate:r,isValid:!0,calculation:`Based on GFAP ${t} pg/ml`,threshold:a>=30?"SURGICAL":a>=20?"HIGH_RISK":"MANAGEABLE"}}catch(i){return console.error("Volume calculation error:",i),{volume:0,volumeRange:{min:0,max:0},riskLevel:"low",mortalityRate:"Unknown",isValid:!1,calculation:"Calculation error",error:i.message}}}function et(t){return t>=K.critical.min?"critical":t>=K.high.min?"high":t>=K.moderate.min?"moderate":"low"}function tt(t){return t<10?"5-10%⁴":t<30?`${Math.round(10+(t-10)*9/20)}%⁴`:t<50?`${Math.round(19+(t-30)*25/20)}%³`:t<60?`${Math.round(44+(t-50)*47/10)}%²`:t<80?`${Math.round(91+(t-60)*5/20)}%¹`:"96-100%¹"}function it(t){return t<1?"<1 ml":t<10?`${t.toFixed(1)} ml`:`${Math.round(t)} ml`}function at(t){if(!t||t<=0)return`
      <div class="volume-circle" data-volume="0">
        <div class="volume-number">0<span> ml</span></div>
        <canvas class="volume-canvas" width="120" height="120"></canvas>
      </div>
    `;const e=it(t),i=`volume-canvas-${Math.random().toString(36).substr(2,9)}`;return`
    <div class="volume-circle" data-volume="${t}">
      <div class="volume-number">${e}</div>
      <canvas id="${i}" class="volume-canvas" 
              data-volume="${t}" data-canvas-id="${i}"></canvas>
    </div>
  `}function st(){document.querySelectorAll(".volume-canvas").forEach(e=>{const i=e.offsetWidth||120,a=e.offsetHeight||120;e.width=i,e.height=a;const s=parseFloat(e.dataset.volume)||0;s>0&&nt(e,s)})}function nt(t,e){const i=t.getContext("2d"),a=t.width/2,s=t.height/2,n=t.width*.45;let r=0,c=!0;const l=document.body.classList.contains("dark-mode")||window.matchMedia("(prefers-color-scheme: dark)").matches;function d(){c&&(i.clearRect(0,0,t.width,t.height),m())}function m(){const g=Math.min(e/80,.9)*(n*1.8),h=s+n-4-g;if(e>0){i.save(),i.beginPath(),i.arc(a,s,n-4,0,Math.PI*2),i.clip(),i.fillStyle="#dc2626",i.globalAlpha=.7,i.fillRect(0,h+5,t.width,t.height),i.globalAlpha=.9,i.fillStyle="#dc2626",i.beginPath();let T=a-n+4;i.moveTo(T,h);for(let y=T;y<=a+n-4;y+=2){const R=Math.sin(y*.05+r*.08)*3,U=Math.sin(y*.08+r*.12+1)*2,B=h+R+U;i.lineTo(y,B)}i.lineTo(a+n-4,t.height),i.lineTo(T,t.height),i.closePath(),i.fill(),i.restore()}const E=getComputedStyle(document.documentElement).getPropertyValue("--text-secondary").trim()||(l?"#8899a6":"#6c757d");i.strokeStyle=E,i.lineWidth=8,i.globalAlpha=.4,i.beginPath(),i.arc(a,s,n,0,Math.PI*2),i.stroke(),i.globalAlpha=1;const L=Math.min(e/100,1),$=getComputedStyle(document.documentElement).getPropertyValue("--danger-color").trim()||"#dc2626";i.strokeStyle=$,i.lineWidth=8,i.setLineDash([]),i.lineCap="round",i.beginPath(),i.arc(a,s,n,-Math.PI/2,-Math.PI/2+L*2*Math.PI),i.stroke(),r+=1,e>0&&requestAnimationFrame(d)}d();const u=new MutationObserver(()=>{document.contains(t)||(c=!1,u.disconnect())});u.observe(document.body,{childList:!0,subtree:!0})}class _{static calculateProbability(e,i){if(!e||!i||e<=0||i<=0)return{probability:0,confidence:0,isValid:!1,reason:"Invalid inputs: age and GFAP required"};if(e<18||e>120)return{probability:0,confidence:0,isValid:!1,reason:`Age ${e} outside valid range (18-120 years)`};(i<10||i>2e4)&&console.warn(`GFAP ${i} outside typical range (10-20000 pg/ml)`);try{const a=(e-this.PARAMS.age.mean)/this.PARAMS.age.std,s=(i-this.PARAMS.gfap.mean)/this.PARAMS.gfap.std,n=this.PARAMS.coefficients.intercept+this.PARAMS.coefficients.age*a+this.PARAMS.coefficients.gfap*s,r=1/(1+Math.exp(-n)),c=r*100,l=Math.abs(r-.5)*2,d=this.getRiskCategory(c);return{probability:Math.round(c*10)/10,confidence:Math.round(l*100)/100,logit:Math.round(n*1e3)/1e3,riskCategory:d,scaledInputs:{age:Math.round(a*1e3)/1e3,gfap:Math.round(s*1e3)/1e3},rawInputs:{age:e,gfap:i},isValid:!0,calculationMethod:"logistic_regression_age_gfap"}}catch(a){return console.error("Legacy model calculation error:",a),{probability:0,confidence:0,isValid:!1,reason:"Calculation error",error:a.message}}}static getRiskCategory(e){return e<10?{level:"very_low",color:"#10b981",label:"Very Low Risk",description:"Minimal ICH likelihood"}:e<25?{level:"low",color:"#84cc16",label:"Low Risk",description:"Below typical threshold"}:e<50?{level:"moderate",color:"#f59e0b",label:"Moderate Risk",description:"Elevated concern"}:e<75?{level:"high",color:"#f97316",label:"High Risk",description:"Significant likelihood"}:{level:"very_high",color:"#dc2626",label:"Very High Risk",description:"Critical ICH probability"}}static compareModels(e,i){if(!e||!i||!i.isValid)return{isValid:!1,reason:"Invalid model results for comparison"};let a=e.probability||0;a<=1&&(a=a*100);const s=i.probability||0,n=a-s,r=s>0?n/s*100:0,c=a>s?"main":s>a?"legacy":"equal";let l;const d=Math.abs(n);return d<5?l="strong":d<15?l="moderate":d<30?l="weak":l="poor",{isValid:!0,probabilities:{main:Math.round(a*10)/10,legacy:Math.round(s*10)/10},differences:{absolute:Math.round(n*10)/10,relative:Math.round(r*10)/10},agreement:{level:l,higherRiskModel:c},interpretation:this.getComparisonInterpretation(n,l)}}static getComparisonInterpretation(e,i){const a=Math.abs(e);return i==="strong"?{type:"concordant",message:"Models show strong agreement",implication:"Age and GFAP are primary risk factors"}:a>20?{type:"divergent",message:"Significant model disagreement",implication:"Complex model captures additional risk factors not in age/GFAP"}:{type:"moderate_difference",message:"Models show moderate difference",implication:"Additional factors provide incremental predictive value"}}static runValidationTests(){const i=[{age:65,gfap:100,expected:"low",description:"Younger patient, low GFAP"},{age:75,gfap:500,expected:"moderate",description:"Average age, moderate GFAP"},{age:85,gfap:1e3,expected:"high",description:"Older patient, high GFAP"},{age:70,gfap:2e3,expected:"very_high",description:"High GFAP dominates"},{age:90,gfap:50,expected:"very_low",description:"Low GFAP despite age"}].map(n=>{const r=this.calculateProbability(n.age,n.gfap);return{...n,result:r,passed:r.isValid&&r.riskCategory.level===n.expected}}),a=i.filter(n=>n.passed).length,s=i.length;return{summary:{passed:a,total:s,passRate:Math.round(a/s*100)},details:i}}static getModelMetadata(){return{name:"Legacy ICH Model",type:"Logistic Regression",version:"1.0.0",features:["age","gfap"],performance:{rocAuc:.789,recall:.4,precision:.86,f1Score:.55,specificity:.94},trainingData:{samples:"Historical cohort",dateRange:"Research study period",validation:"Cross-validation"},limitations:["Only uses age and GFAP - ignores clinical symptoms","Lower recall (40%) - misses some ICH cases","No time-to-onset consideration","No blood pressure or medication factors","Simplified feature set for baseline comparison"],purpose:"Research baseline for evaluating complex model improvements"}}}x(_,"PARAMS",{age:{mean:74.59,std:12.75},gfap:{mean:665.23,std:2203.77},coefficients:{intercept:.3248,age:-.2108,gfap:3.1631}});function rt(t){try{const e=(t==null?void 0:t.age_years)||(t==null?void 0:t.age)||null,i=(t==null?void 0:t.gfap_value)||(t==null?void 0:t.gfap)||null;return!e||!i?null:_.calculateProbability(e,i)}catch(e){return console.warn("Legacy ICH calculation failed (non-critical):",e),null}}class P{static logComparison(e){try{const i={id:this.generateEntryId(),timestamp:new Date().toISOString(),sessionId:this.getSessionId(),...e},a=this.getStoredData();return a.entries.push(i),a.entries.length>this.MAX_ENTRIES&&(a.entries=a.entries.slice(-this.MAX_ENTRIES)),a.lastUpdated=new Date().toISOString(),a.totalComparisons=a.entries.length,localStorage.setItem(this.STORAGE_KEY,JSON.stringify(a)),console.log(`📊 Research data logged (${a.totalComparisons} comparisons)`),!0}catch(i){return console.warn("Research data logging failed (non-critical):",i),!1}}static getStoredData(){try{const e=localStorage.getItem(this.STORAGE_KEY);if(!e)return this.createEmptyDataset();const i=JSON.parse(e);return!i.entries||!Array.isArray(i.entries)?(console.warn("Invalid research data structure, resetting"),this.createEmptyDataset()):i}catch(e){return console.warn("Failed to load research data, creating new:",e),this.createEmptyDataset()}}static createEmptyDataset(){return{version:"1.0.0",created:new Date().toISOString(),lastUpdated:null,totalComparisons:0,entries:[],metadata:{app:"iGFAP Stroke Triage",purpose:"Model comparison research",dataRetention:"Local storage only"}}}static exportAsCSV(){const e=this.getStoredData();if(!e.entries||e.entries.length===0)return"No research data available for export";const i=["timestamp","session_id","age","gfap_value","main_model_probability","main_model_module","legacy_model_probability","legacy_model_confidence","absolute_difference","relative_difference","agreement_level","higher_risk_model"],a=e.entries.map(n=>{var r,c,l,d,m,u,b,v,g,h,E,L,$,T;return[n.timestamp,n.sessionId,((r=n.inputs)==null?void 0:r.age)||"",((c=n.inputs)==null?void 0:c.gfap)||"",((l=n.main)==null?void 0:l.probability)||"",((d=n.main)==null?void 0:d.module)||"",((m=n.legacy)==null?void 0:m.probability)||"",((u=n.legacy)==null?void 0:u.confidence)||"",((v=(b=n.comparison)==null?void 0:b.differences)==null?void 0:v.absolute)||"",((h=(g=n.comparison)==null?void 0:g.differences)==null?void 0:h.relative)||"",((L=(E=n.comparison)==null?void 0:E.agreement)==null?void 0:L.level)||"",((T=($=n.comparison)==null?void 0:$.agreement)==null?void 0:T.higherRiskModel)||""].join(",")});return[i.join(","),...a].join(`
`)}static exportAsJSON(){const e=this.getStoredData();return JSON.stringify(e,null,2)}static downloadData(e="csv"){try{const i=e==="csv"?this.exportAsCSV():this.exportAsJSON(),a=`igfap-research-${Date.now()}.${e}`,s=new Blob([i],{type:e==="csv"?"text/csv":"application/json"}),n=URL.createObjectURL(s),r=document.createElement("a");return r.href=n,r.download=a,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(n),console.log(`📥 Downloaded research data: ${a}`),!0}catch(i){return console.error("Failed to download research data:",i),!1}}static clearData(){try{return localStorage.removeItem(this.STORAGE_KEY),console.log("🗑️ Research data cleared"),!0}catch(e){return console.warn("Failed to clear research data:",e),!1}}static getDataSummary(){var n,r;const e=this.getStoredData();if(!e.entries||e.entries.length===0)return{totalEntries:0,dateRange:null,avgDifference:null};const i=e.entries,a=i.map(c=>{var l,d;return(d=(l=c.comparison)==null?void 0:l.differences)==null?void 0:d.absolute}).filter(c=>c!=null),s=a.length>0?a.reduce((c,l)=>c+Math.abs(l),0)/a.length:0;return{totalEntries:i.length,dateRange:{first:(n=i[0])==null?void 0:n.timestamp,last:(r=i[i.length-1])==null?void 0:r.timestamp},avgAbsoluteDifference:Math.round(s*10)/10,storageSize:JSON.stringify(e).length}}static generateEntryId(){return Date.now().toString(36)+Math.random().toString(36).substr(2)}static getSessionId(){let e=sessionStorage.getItem("research_session_id");return e||(e="session_"+Date.now().toString(36),sessionStorage.setItem("research_session_id",e)),e}}x(P,"STORAGE_KEY","igfap_research_data"),x(P,"MAX_ENTRIES",1e3);function ot(t,e,i){try{if(!C())return;const a={inputs:{age:i.age_years||i.age,gfap:i.gfap_value||i.gfap,module:t.module||"unknown"},main:{probability:t.probability,module:t.module,confidence:t.confidence},legacy:e,comparison:e?_.compareModels(t,e):null};P.logComparison(a)}catch(a){console.warn("Research logging failed (non-critical):",a)}}function C(t=null){var e;if(t==="coma")return!1;if(t==="limited"||t==="full")return!0;if(typeof window<"u")try{const i=window.store||((e=require("../state/store.js"))==null?void 0:e.store);if(i){const a=i.getState().formData;return a.limited||a.full}}catch{}return!1}function Se(){return""}function Le(t,e,i){if(!(e!=null&&e.isValid))return console.log("🔬 Legacy model results invalid:",e),`
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
    `;const a=_.compareModels(t,e);return`
    <div class="research-panel" id="researchPanel" style="display: none;">
      <div class="research-header">
        <h4>🔬 Model Comparison (Research)</h4>
        <button class="close-research" id="closeResearch">×</button>
      </div>
      
      <div class="model-comparison">
        ${lt(t,e)}
        ${ct(a)}
        ${dt(e,i)}
        ${ut()}
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
  `}function lt(t,e){let i=t.probability||0;i<=1&&(i=i*100);const a=e.probability||0;return`
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
          <div class="bar-fill legacy-model" style="width: ${Math.min(a,100)}%">
            <span class="bar-value">${a.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  `}function ct(t){if(!t.isValid)return'<div class="comparison-error">Unable to compare models</div>';const{differences:e,agreement:i}=t;return`
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
  `}function dt(t,e){return`
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
  `}function ut(){const t=_.getModelMetadata();return`
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
  `}function mt(){if(!document.getElementById("researchPanel"))return;const e=document.getElementById("closeResearch");e&&e.addEventListener("click",()=>{const n=document.getElementById("researchPanel");n&&(n.style.display="none")});const i=document.getElementById("exportResearchData");i&&i.addEventListener("click",()=>{P.downloadData("csv")});const a=document.getElementById("toggleCalculationDetails");a&&a.addEventListener("click",()=>{const n=document.getElementById("calculationDetails");n&&(n.style.display=n.style.display==="none"?"block":"none",a.textContent=n.style.display==="none"?"🧮 Details":"🧮 Hide")});const s=document.getElementById("clearResearchData");s&&s.addEventListener("click",()=>{if(confirm("Clear all research data? This cannot be undone.")){P.clearData();const n=P.getDataSummary();console.log(`Data cleared. Total entries: ${n.totalEntries}`)}}),console.log("🔬 Research mode initialized")}function we(){const e=p.getState().formData;if(!e||Object.keys(e).length===0)return"";let i="";return Object.entries(e).forEach(([a,s])=>{if(s&&Object.keys(s).length>0){const n=o(`${a}ModuleTitle`)||a.charAt(0).toUpperCase()+a.slice(1);let r="";Object.entries(s).forEach(([c,l])=>{if(l===""||l===null||l===void 0)return;let d=Ke(c),m=We(l,c);r+=`
          <div class="summary-item">
            <span class="summary-label">${d}:</span>
            <span class="summary-value">${m}</span>
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
  `:""}function Y(t,e,i){if(!e)return"";const a=Math.round((e.probability||0)*100),s=Xe(a,t),n=a>70,r=a>be[t].high,c={ich:"🩸",lvo:"🧠"},l={ich:o("ichProbability"),lvo:o("lvoProbability")},d=n?"critical":r?"high":"normal";return`
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
              <div class="probability-circle" data-react-ring data-percent="${a}" data-level="${d}"></div>
              <div class="circle-label">${t==="ich"?"ICH Risk":"LVO Risk"}</div>
            </div>
          </div>
          <div class="risk-level ${d}">${s}</div>
        </div>
        
        <div class="risk-assessment"></div>
      </div>
    </div>
  `}function gt(t){const e=t.gfap_value||j();if(!e||e<=0)return"";const i=ke(e);return`
    <div class="volume-display-container">
      ${at(i.volume)}
    </div>
  `}function j(){var i;const e=p.getState().formData;for(const a of["coma","limited","full"])if((i=e[a])!=null&&i.gfap_value)return parseFloat(e[a].gfap_value);return 0}function pt(t,e){const{ich:i,lvo:a}=t,s=kt(i),n=s!=="coma"?ft():null;console.log("🔬 Research Debug - Always Active:",{module:s,researchEnabled:C(s),mainResults:i,legacyResults:n,patientInputs:F(),legacyCalculationAttempted:s!=="coma"}),n&&C(s)&&ot(i,n,F());const r=(i==null?void 0:i.module)==="Limited"||(i==null?void 0:i.module)==="Coma"||(a==null?void 0:a.notPossible)===!0;i==null||i.module;let c;return r?c=ht(i,t,e,n,s):c=bt(i,a,t,e,n,s),setTimeout(async()=>{st();try{const{mountIslands:l}=await ze(async()=>{const{mountIslands:d}=await import("./mountIslands-cdRD6v1g.js");return{mountIslands:d}},[]);l()}catch(l){console.warn("React islands not available:",l)}},100),c}function ht(t,e,i,a,s){const n=t&&t.probability>.6?ve():"",r=Math.round(((t==null?void 0:t.probability)||0)*100),c=ye(),l=we(),d=C(s)?Se():"",m=a&&C(s)?Le(t,a,F()):"",u=(t==null?void 0:t.module)==="Coma"?yt(t.probability):"",b=(t==null?void 0:t.module)!=="Coma"?Te(t.probability):"";return`
    <div class="container">
      ${M(3)}
      <h2>${o("bleedingRiskAssessment")||"Blutungsrisiko-Bewertung / Bleeding Risk Assessment"}</h2>
      ${n}
      
      <!-- Single ICH Risk Card -->
      <div class="risk-results-single">
        ${Y("ich",t)}
      </div>

      ${(t==null?void 0:t.module)==="Coma"&&r>=50?`
      <!-- ICH Volume Card (Coma only) -->
      <div class="risk-results-single">
        ${Ae(t)}
      </div>
      `:""}
      
      <!-- Alternative Diagnoses for Coma Module -->
      ${u}
      
      <!-- Differential Diagnoses for Stroke Modules -->
      ${b}
      
      <!-- Research Model Comparison (hidden unless research mode) -->
      ${m}
      
      <!-- ICH Drivers Only (not shown for Coma module) -->
      ${(t==null?void 0:t.module)!=="Coma"?`
        <div class="enhanced-drivers-section">
          <h3>${o("riskFactorsTitle")||"Hauptrisikofaktoren / Main Risk Factors"}</h3>
          ${Ee(t)}
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
      
      ${$e(t)}
      ${d}
    </div>
  `}function bt(t,e,i,a,s,n){var X,ee,te,ie;const r=Math.round(((t==null?void 0:t.probability)||0)*100),c=Math.round(((e==null?void 0:e.probability)||0)*100),l=t&&t.probability>.6?ve():"",d=ye(),m=we(),u=C(n)?Se():"",b=s&&C(n)?Le(t,s,F()):"",v=p.getState(),g=parseInt((ee=(X=v.formData)==null?void 0:X.full)==null?void 0:ee.fast_ed_score)||0;console.log("🔍 Debug LVO Display:"),console.log("  Current Module:",n),console.log("  FAST-ED Score:",g),console.log("  FAST-ED Raw:",(ie=(te=v.formData)==null?void 0:te.full)==null?void 0:ie.fast_ed_score),console.log("  LVO Data:",e),console.log("  LVO notPossible:",e==null?void 0:e.notPossible),console.log("  LVO Probability:",e==null?void 0:e.probability),console.log("  ICH Module:",t==null?void 0:t.module);const h=n==="full"||(t==null?void 0:t.module)==="Full",E=e&&typeof e.probability=="number"&&!e.notPossible,L=h&&g>3&&E;console.log("  Conditions: isFullModule:",h),console.log("  Conditions: fastEdScore > 3:",g>3),console.log("  Conditions: hasValidLVO:",E),console.log("  Show LVO Card:",L);const $=r>=50,y=c/Math.max(r,.5),R=y>=.6&&y<=1.7,U=h&&r>=50&&c>=50&&R,B=h&&r>=50&&c>=50&&!R,Q=h&&r>=30&&c>=30;console.log("🎯 Tachometer conditions:",{isFullModule:h,ichPercent:r,lvoPercent:c,ratio:y.toFixed(2),inRatioBand:R,showTachometer:U,showDominanceBanner:B});let H=1;L&&H++,$&&H++;const Me=H===1?"risk-results-single":H===2?"risk-results-dual":"risk-results-triple",Pe=Te(t.probability);return`
    <div class="container">
      ${M(3)}
      <h2>${o("resultsTitle")}</h2>
      ${l}
      
      <!-- Risk Assessment Display -->
      <div class="${Me}">
        ${Y("ich",t)}
        ${L?Y("lvo",e):""}
        ${$?Ae(t):""}
      </div>
      
      <!-- Treatment Decision Gauge (when strong signal) -->
      ${Q?St(r,c):""}
      ${!Q&&B?vt(r,c,y):""}
      
      <!-- Differential Diagnoses for Stroke Modules -->
      ${Pe}
      
      <!-- Research Model Comparison (hidden unless research mode) -->
      ${b}
      
      <!-- Risk Factor Drivers -->
      <div class="enhanced-drivers-section">
        <h3>${o("riskFactorsTitle")||"Risikofaktoren / Risk Factors"}</h3>
        ${L?Ge(t,e):Ee(t)}
      </div>
      
      <!-- Collapsible Additional Information -->
      <div class="additional-info-section">
        <button class="info-toggle" data-target="input-summary">
          <span class="toggle-icon">📋</span>
          <span class="toggle-text">${o("inputSummaryTitle")}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="input-summary" style="display: none;">
          ${m}
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
      
      ${$e(t)}
      ${u}
    </div>
  `}function vt(t,e,i){const a=i>1?"LVO":"ICH",s=a==="LVO"?"🧠":"🩸",n=S.getCurrentLanguage()==="de"?a==="LVO"?"LVO-dominant":"ICH-dominant":a==="LVO"?"LVO dominant":"ICH dominant",r=S.getCurrentLanguage()==="de"?`Verhältnis LVO/ICH: ${i.toFixed(2)}`:`LVO/ICH ratio: ${i.toFixed(2)}`;return`
    <div class="tachometer-section">
      <div class="tachometer-card">
        <div class="treatment-recommendation ${a==="LVO"?"lvo-dominant":"ich-dominant"}">
          <div class="recommendation-icon">${s}</div>
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
  `}function Ee(t){if(!t||!t.drivers)return'<p class="no-drivers">No driver data available</p>';const e=t.drivers;if(!e.positive&&!e.negative)return'<p class="no-drivers">Driver format error</p>';const i=e.positive||[],a=e.negative||[];return`
    <div class="drivers-split-view">
      <div class="drivers-column positive-column">
        <div class="column-header">
          <span class="column-icon">⬆</span>
          <span class="column-title">${o("increasingRisk")||"Risikoerhöhend / Increasing Risk"}</span>
        </div>
        <div class="compact-drivers">
          ${i.length>0?i.slice(0,5).map(s=>ue(s,"positive")).join(""):`<p class="no-factors">${o("noFactors")||"Keine Faktoren / No factors"}</p>`}
        </div>
      </div>
      
      <div class="drivers-column negative-column">
        <div class="column-header">
          <span class="column-icon">⬇</span>
          <span class="column-title">${o("decreasingRisk")||"Risikomindernd / Decreasing Risk"}</span>
        </div>
        <div class="compact-drivers">
          ${a.length>0?a.slice(0,5).map(s=>ue(s,"negative")).join(""):`<p class="no-factors">${o("noFactors")||"Keine Faktoren / No factors"}</p>`}
        </div>
      </div>
    </div>
  `}function ue(t,e){const i=Math.abs(t.weight*100),a=Math.min(i*2,100);return`
    <div class="compact-driver-item">
      <div class="compact-driver-label">${V(t.label)}</div>
      <div class="compact-driver-bar ${e}" style="width: ${a}%;">
        <span class="compact-driver-value">${i.toFixed(1)}%</span>
      </div>
    </div>
  `}function $e(t){if(!t||!t.probability||Math.round((t.probability||0)*100)<50)return"";const i=j();return!i||i<=0?"":`
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
  `}function ft(t){try{const e=F();if(console.log("🔍 Legacy calculation inputs:",e),!e.age||!e.gfap)return console.warn("🔍 Missing required inputs for legacy model:",{age:e.age,gfap:e.gfap}),null;const i=rt(e);return console.log("🔍 Legacy calculation result:",i),i}catch(e){return console.warn("Legacy model calculation failed (non-critical):",e),null}}function F(){const e=p.getState().formData;console.log("🔍 Debug formData structure:",e);let i=null,a=null;for(const n of["coma","limited","full"])e[n]&&(console.log(`🔍 ${n} module data:`,e[n]),i=i||e[n].age_years,a=a||e[n].gfap_value);const s={age:parseInt(i)||null,gfap:parseFloat(a)||null};return console.log("🔍 Extracted patient inputs:",s),s}function Te(t){return Math.round(t*100)>25?`
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
    `:""}function yt(t){const e=Math.round(t*100),i=S.getCurrentLanguage()==="de";return e>25?`
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
    `}function kt(t){if(!(t!=null&&t.module))return"unknown";const e=t.module.toLowerCase();return e.includes("coma")?"coma":e.includes("limited")?"limited":e.includes("full")?"full":"unknown"}function Ae(t){const e=j();if(!e||e<=0)return"";const i=ke(e);return Math.round(((t==null?void 0:t.probability)||0)*100),`
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
              ${gt(t)}
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
  `}function St(t,e){const i=e/Math.max(t,1);return`
    <div class="tachometer-section">
      <div class="tachometer-card">
        <div class="tachometer-header">
          <h3>🎯 ${S.getCurrentLanguage()==="de"?"Entscheidungshilfe – LVO/ICH":"Decision Support – LVO/ICH"}</h3>
          <div class="ratio-display">LVO/ICH Ratio: ${i.toFixed(2)}</div>
        </div>
        
        <div class="tachometer-gauge" id="tachometer-canvas-container">
          <div data-react-tachometer data-ich="${t}" data-lvo="${e}" data-title="${S.getCurrentLanguage()==="de"?"Entscheidungshilfe – LVO/ICH":"Decision Support – LVO/ICH"}"></div>
        </div>

        <!-- Legend chips for zones -->
        <div class="tachometer-legend" aria-hidden="true">
          <span class="legend-chip ich">ICH</span>
          <span class="legend-chip uncertain">${S.getCurrentLanguage()==="de"?"Unsicher":"Uncertain"}</span>
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
            <div class="metric-value">${(()=>{const a=Math.abs(e-t),s=Math.max(e,t);let n=a<10?Math.round(30+s*.3):a<20?Math.round(50+s*.4):Math.round(70+s*.3);return n=Math.max(0,Math.min(100,n)),n})()}%</div>
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
  `}function Lt(t,e,i){const a=[];return i.required&&!e&&e!==0&&a.push("This field is required"),i.min!==void 0&&e!==""&&!isNaN(e)&&parseFloat(e)<i.min&&a.push(`Value must be at least ${i.min}`),i.max!==void 0&&e!==""&&!isNaN(e)&&parseFloat(e)>i.max&&a.push(`Value must be at most ${i.max}`),i.pattern&&!i.pattern.test(e)&&a.push("Invalid format"),a}function wt(t){let e=!0;const i={};return Object.entries(_e).forEach(([a,s])=>{const n=t.elements[a];if(n){const r=Lt(a,n.value,s);r.length>0&&(i[a]=r,e=!1)}}),{isValid:e,validationErrors:i}}function Et(t,e){Object.entries(e).forEach(([i,a])=>{const s=t.querySelector(`[name="${i}"]`);if(s){const n=s.closest(".input-group");if(n){n.classList.add("error"),n.querySelectorAll(".error-message").forEach(c=>c.remove());const r=document.createElement("div");r.className="error-message",r.innerHTML=`<span class="error-icon">⚠️</span> ${a[0]}`,n.appendChild(r)}}})}function $t(t){t.querySelectorAll(".input-group.error").forEach(e=>{e.classList.remove("error"),e.querySelectorAll(".error-message").forEach(i=>i.remove())})}function me(t,e){var r,c;console.log(`=== EXTRACTING ${e.toUpperCase()} DRIVERS ===`),console.log("Full response:",t);let i=null;if(e==="ICH"?(i=((r=t.ich_prediction)==null?void 0:r.drivers)||null,console.log("🧠 ICH raw drivers extracted:",i)):e==="LVO"&&(i=((c=t.lvo_prediction)==null?void 0:c.drivers)||null,console.log("🩸 LVO raw drivers extracted:",i)),!i)return console.log(`❌ No ${e} drivers found`),null;const a=Tt(i,e);console.log(`✅ ${e} drivers formatted:`,a);const n=[...a.positive,...a.negative].find(l=>l.label&&(l.label.toLowerCase().includes("fast")||l.label.includes("fast_ed")));return n?console.log(`🎯 FAST-ED found in ${e}:`,`${n.label}: ${n.weight>0?"+":""}${n.weight.toFixed(4)}`):console.log(`⚠️  FAST-ED NOT found in ${e} drivers`),a}function Tt(t,e){console.log(`🔄 Formatting ${e} drivers from dictionary:`,t);const i=[],a=[];return Object.entries(t).forEach(([s,n])=>{typeof n=="number"&&(n>0?i.push({label:s,weight:n}):n<0&&a.push({label:s,weight:Math.abs(n)}))}),i.sort((s,n)=>n.weight-s.weight),a.sort((s,n)=>n.weight-s.weight),console.log(`📈 ${e} positive drivers:`,i.slice(0,5)),console.log(`📉 ${e} negative drivers:`,a.slice(0,5)),{kind:"flat_dictionary",units:"logit",positive:i,negative:a,meta:{}}}function ge(t,e){var a,s;console.log(`=== EXTRACTING ${e.toUpperCase()} PROBABILITY ===`);let i=0;return e==="ICH"?(i=((a=t.ich_prediction)==null?void 0:a.probability)||0,console.log("🧠 ICH probability extracted:",i)):e==="LVO"&&(i=((s=t.lvo_prediction)==null?void 0:s.probability)||0,console.log("🩸 LVO probability extracted:",i)),i}function pe(t,e){var a,s;let i=.85;return e==="ICH"?i=((a=t.ich_prediction)==null?void 0:a.confidence)||.85:e==="LVO"&&(i=((s=t.lvo_prediction)==null?void 0:s.confidence)||.85),i}const f={intercept:-.4731,coefficients:{gfap:-.8623,fastEd:1.8253},scaling:{gfap:{mean:0,std:1},fastEd:{mean:3.6667,std:2.3495}}};function At(t,e=0){return t>=0?e===0?Math.log(t+1):(Math.pow(t+1,e)-1)/e:e===2?-Math.log(-t+1):-(Math.pow(-t+1,2-e)-1)/(2-e)}function he(t,e,i){return(t-e)/i}function Ct(t){return 1/(1+Math.exp(-t))}function Mt(t,e){try{if(t==null||e==null)throw new Error("Missing required inputs: GFAP and FAST-ED scores");if(t<0)throw new Error("GFAP value must be non-negative");if(e<0||e>9)throw new Error("FAST-ED score must be between 0 and 9");const i=At(t,0),a=he(i,f.scaling.gfap.mean,f.scaling.gfap.std),s=he(e,f.scaling.fastEd.mean,f.scaling.fastEd.std),n=f.intercept+f.coefficients.gfap*a+f.coefficients.fastEd*s,r=Ct(n),c=[];return e>=4?c.push({name:"High FAST-ED Score",value:e,impact:"increase",contribution:f.coefficients.fastEd*s}):e<=2&&c.push({name:"Low FAST-ED Score",value:e,impact:"decrease",contribution:f.coefficients.fastEd*s}),t>500?c.push({name:"Elevated GFAP",value:`${t.toFixed(0)} pg/mL`,impact:"decrease",contribution:f.coefficients.gfap*a,note:"May indicate hemorrhagic vs ischemic event"}):t<100&&c.push({name:"Low GFAP",value:`${t.toFixed(0)} pg/mL`,impact:"increase",contribution:Math.abs(f.coefficients.gfap*a),note:"Consistent with ischemic LVO"}),c.sort((l,d)=>Math.abs(d.contribution)-Math.abs(l.contribution)),{probability:r,riskLevel:r>.7?"high":r>.4?"moderate":"low",model:"Local LVO Model v2",inputs:{gfap:t,fastEd:e},scaledInputs:{gfap:a,fastEd:s},logit:n,riskFactors:c,interpretation:Pt(r,e,t)}}catch(i){return console.error("LVO prediction error:",i),{probability:null,error:i.message,model:"Local LVO Model v2"}}}function Pt(t,e,i){const a=Math.round(t*100);return t>.7?e>=6?`High probability of LVO (${a}%). FAST-ED score of ${e} strongly suggests large vessel occlusion. Consider immediate thrombectomy evaluation.`:`High probability of LVO (${a}%). Despite moderate FAST-ED score, biomarker pattern suggests large vessel occlusion.`:t>.4?i>500?`Moderate LVO probability (${a}%). Elevated GFAP (${i.toFixed(0)} pg/mL) may indicate hemorrhagic component. Further imaging recommended.`:`Moderate LVO probability (${a}%). Clinical correlation and vascular imaging recommended.`:e<=3?`Low probability of LVO (${a}%). FAST-ED score of ${e} suggests small vessel disease or non-vascular etiology.`:`Low probability of LVO (${a}%) despite FAST-ED score. Consider alternative diagnoses.`}function Rt(t){return(t==null?void 0:t.gfapValue)!=null&&(t==null?void 0:t.fastEdScore)!=null&&(t==null?void 0:t.gfapValue)>=0&&(t==null?void 0:t.fastEdScore)>=0&&(t==null?void 0:t.fastEdScore)<=9}async function It(){console.log("Warming up Cloud Functions...");const t=Object.values(A).map(async e=>{try{const i=new AbortController,a=setTimeout(()=>i.abort(),3e3);await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({}),signal:i.signal,mode:"cors"}),clearTimeout(a),console.log(`Warmed up: ${e}`)}catch{console.log(`Warm-up attempt for ${e.split("/").pop()} completed`)}});Promise.all(t).then(()=>{console.log("Cloud Functions warm-up complete")})}class w extends Error{constructor(e,i,a){super(e),this.name="APIError",this.status=i,this.url=a}}function J(t){const e={...t};return Object.keys(e).forEach(i=>{const a=e[i];(typeof a=="boolean"||a==="on"||a==="true"||a==="false")&&(e[i]=a===!0||a==="on"||a==="true"?1:0)}),e}function q(t,e=0){const i=parseFloat(t);return isNaN(i)?e:i}async function Z(t,e){const i=new AbortController,a=setTimeout(()=>i.abort(),W.requestTimeout);try{const s=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(e),signal:i.signal,mode:"cors"});if(clearTimeout(a),!s.ok){let r=`HTTP ${s.status}`;try{const c=await s.json();r=c.error||c.message||r}catch{r=`${r}: ${s.statusText}`}throw new w(r,s.status,t)}return await s.json()}catch(s){throw clearTimeout(a),s.name==="AbortError"?new w("Request timeout - please try again",408,t):s instanceof w?s:new w("Network error - please check your connection and try again",0,t)}}async function Dt(t){const e=J(t);console.log("Coma ICH API Payload:",e);try{const i=await Z(A.COMA_ICH,e);return console.log("Coma ICH API Response:",i),{probability:q(i.probability||i.ich_probability,0),drivers:i.drivers||null,confidence:q(i.confidence,.75),module:"Coma"}}catch(i){throw console.error("Coma ICH prediction failed:",i),new w(`Failed to get ICH prediction: ${i.message}`,i.status,A.COMA_ICH)}}async function Ft(t){const e={age_years:t.age_years,systolic_bp:t.systolic_bp,diastolic_bp:t.diastolic_bp,gfap_value:t.gfap_value,vigilanzminderung:t.vigilanzminderung||0},i=J(e);console.log("Limited Data ICH API Payload:",i);try{const a=await Z(A.LDM_ICH,i);return console.log("Limited Data ICH API Response:",a),{probability:q(a.probability||a.ich_probability,0),drivers:a.drivers||null,confidence:q(a.confidence,.65),module:"Limited Data"}}catch(a){throw console.error("Limited Data ICH prediction failed:",a),new w(`Failed to get ICH prediction: ${a.message}`,a.status,A.LDM_ICH)}}async function Nt(t){const e={age_years:t.age_years,systolic_bp:t.systolic_bp,diastolic_bp:t.diastolic_bp,gfap_value:t.gfap_value,fast_ed_score:t.fast_ed_score,headache:t.headache||0,vigilanzminderung:t.vigilanzminderung||0,armparese:t.armparese||0,beinparese:t.beinparese||0,eye_deviation:t.eye_deviation||0,atrial_fibrillation:t.atrial_fibrillation||0,anticoagulated_noak:t.anticoagulated_noak||0,antiplatelets:t.antiplatelets||0},i=J(e);console.log("=== BACKEND DATA MAPPING TEST ==="),console.log("📤 Full Stroke API Payload:",i),console.log("🧪 Clinical Variables Being Sent:"),console.log("  📊 FAST-ED Score:",i.fast_ed_score),console.log("  🩸 Systolic BP:",i.systolic_bp),console.log("  🩸 Diastolic BP:",i.diastolic_bp),console.log("  🧬 GFAP Value:",i.gfap_value),console.log("  👤 Age:",i.age_years),console.log("  🤕 Headache:",i.headache),console.log("  😵 Vigilanz:",i.vigilanzminderung),console.log("  💪 Arm Parese:",i.armparese),console.log("  🦵 Leg Parese:",i.beinparese),console.log("  👁️ Eye Deviation:",i.eye_deviation),console.log("  💓 Atrial Fib:",i.atrial_fibrillation),console.log("  💊 Anticoag NOAK:",i.anticoagulated_noak),console.log("  💊 Antiplatelets:",i.antiplatelets);let a=null;if(Rt(i)){console.log("🚀 Using local LVO model (GFAP + FAST-ED)");const s=Mt(i.gfap_value,i.fast_ed_score);s.probability!==null&&(a={probability:s.probability,drivers:s.riskFactors.map(n=>({feature:n.name,value:n.value,contribution:n.contribution,impact:n.impact})),confidence:s.riskLevel==="high"?.9:s.riskLevel==="moderate"?.7:.5,module:"Full Stroke (Local LVO)",interpretation:s.interpretation},console.log("✅ Local LVO prediction:",{probability:a.probability,riskLevel:s.riskLevel,inputs:s.inputs}))}try{const s=await Z(A.FULL_STROKE,i);console.log("📥 Full Stroke API Response (ICH only):",s);const n=ge(s,"ICH"),r=me(s,"ICH"),c=pe(s,"ICH"),l={probability:n,drivers:r,confidence:c,module:"Full Stroke"};if(!a){console.log("⚠️ Falling back to API for LVO prediction");const d=ge(s,"LVO"),m=me(s,"LVO"),u=pe(s,"LVO");a={probability:d,drivers:m,confidence:u,module:"Full Stroke (API)"}}return console.log("✅ Combined results:"),console.log("  ICH (API):",{probability:n,hasDrivers:!!r}),console.log("  LVO (Local):",{probability:a.probability,hasDrivers:!!a.drivers}),{ich:l,lvo:a}}catch(s){throw console.error("Full Stroke prediction failed:",s),new w(`Failed to get stroke predictions: ${s.message}`,s.status,A.FULL_STROKE)}}const _t=()=>[{id:"acute_deficit",checked:!1},{id:"symptom_onset",checked:!1},{id:"no_preexisting",checked:!1},{id:"no_trauma",checked:!1}];function Bt(){const t=_t();return`
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
  `}function Ht(){const t=document.getElementById("prerequisitesModal");if(!t){console.error("Prerequisites modal not found");return}console.log("Initializing prerequisites modal");const e=document.getElementById("closePrerequisites"),i=document.getElementById("cancelPrerequisites"),a=document.getElementById("confirmPrerequisites");console.log("Modal buttons found:",{closeBtn:!!e,cancelBtn:!!i,confirmBtn:!!a});const s=()=>{t.remove(),N("welcome")};e==null||e.addEventListener("click",s),i==null||i.addEventListener("click",s),a==null||a.addEventListener("click",r=>{r.preventDefault(),r.stopPropagation(),console.log("Prerequisites confirm button clicked");const c=t.querySelectorAll(".toggle-input"),l=Array.from(c).every(d=>d.checked);if(console.log("All prerequisites checked:",l),l)console.log("Navigating to triage2"),t.remove(),N("triage2");else{console.log("Showing prerequisites warning");const d=document.getElementById("prerequisitesWarning");d&&(d.style.display="flex",d.classList.add("shake"),setTimeout(()=>d.classList.remove("shake"),500))}});const n=t.querySelectorAll(".toggle-input");n.forEach(r=>{r.addEventListener("change",()=>{const c=Array.from(n).every(d=>d.checked),l=document.getElementById("prerequisitesWarning");c&&l&&(l.style.display="none")})})}function xt(){const t=document.getElementById("prerequisitesModal");t&&t.remove();const e=document.createElement("div");e.innerHTML=Bt();const i=e.firstElementChild;document.body.appendChild(i),Ht()}function Ot(t){p.logEvent("triage1_answer",{comatose:t}),t?N("coma"):xt()}function Vt(t){p.logEvent("triage2_answer",{examinable:t}),N(t?"full":"limited")}function N(t){p.logEvent("navigate",{from:p.getState().currentScreen,to:t}),p.navigate(t),window.scrollTo(0,0)}function zt(){p.hasUnsavedData()&&!confirm("Are you sure you want to start over? All entered data will be lost.")||(p.logEvent("reset"),p.reset())}function qt(){console.log("goBack() called");const t=p.goBack();console.log("goBack() success:",t),t?(p.logEvent("navigate_back"),window.scrollTo(0,0)):(console.log("No history available, going home instead"),Ce())}function Ce(){console.log("goHome() called"),p.logEvent("navigate_home"),p.goHome(),window.scrollTo(0,0)}async function Ut(t,e){t.preventDefault();const i=t.target,a=i.dataset.module,s=wt(i);if(!s.isValid){Et(e,s.validationErrors);try{const l=Object.keys(s.validationErrors)[0];if(l&&i.elements[l]){const u=i.elements[l];u.focus({preventScroll:!0}),u.scrollIntoView({behavior:"smooth",block:"center"})}const d=document.createElement("div");d.className="sr-only",d.setAttribute("role","status"),d.setAttribute("aria-live","polite");const m=Object.keys(s.validationErrors).length;d.textContent=`${m} field${m===1?"":"s"} need attention.`,document.body.appendChild(d),setTimeout(()=>d.remove(),1200)}catch{}return}const n={};Array.from(i.elements).forEach(l=>{if(l.name)if(l.type==="checkbox")n[l.name]=l.checked;else if(l.type==="number"){const d=parseFloat(l.value);n[l.name]=isNaN(d)?0:d}else l.type==="hidden"&&l.name==="armparese"?n[l.name]=l.value==="true":n[l.name]=l.value}),console.log("Collected form inputs:",n),p.setFormData(a,n);const r=i.querySelector("button[type=submit]"),c=r?r.innerHTML:"";r&&(r.disabled=!0,r.innerHTML=`<span class="loading-spinner"></span> ${o("analyzing")}`);try{let l;switch(a){case"coma":l={ich:await Dt(n),lvo:null};break;case"limited":l={ich:await Ft(n),lvo:{notPossible:!0}};break;case"full":l=await Nt(n);break;default:throw new Error("Unknown module: "+a)}p.setResults(l),p.logEvent("models_complete",{module:a,results:l}),N("results")}catch(l){console.error("Error running models:",l);let d="An error occurred during analysis. Please try again.";l instanceof w&&(d=l.message),Kt(e,d),r&&(r.disabled=!1,r.innerHTML=c)}}function Kt(t,e){t.querySelectorAll(".critical-alert").forEach(s=>{var n,r;(r=(n=s.querySelector("h4"))==null?void 0:n.textContent)!=null&&r.includes("Error")&&s.remove()});const i=document.createElement("div");i.className="critical-alert",i.innerHTML=`<h4><span class="alert-icon">⚠️</span> Error</h4><p>${e}</p>`;const a=t.querySelector(".container");a?a.prepend(i):t.prepend(i),setTimeout(()=>i.remove(),1e4)}function Wt(t){const e=document.createElement("div");e.className="sr-only",e.setAttribute("role","status"),e.setAttribute("aria-live","polite");const i={triage1:"Coma assessment",triage2:"Examination capability assessment",coma:"Coma module",limited:"Limited data module",full:"Full stroke assessment",results:"Assessment results"};e.textContent=`Navigated to ${i[t]||t}`,document.body.appendChild(e),setTimeout(()=>e.remove(),1e3)}function Gt(t){const e="iGFAP",a={triage1:"Initial Assessment",triage2:"Examination Capability",coma:"Coma Module",limited:"Limited Data Module",full:"Full Stroke Module",results:"Assessment Results"}[t];document.title=a?`${e} — ${a}`:e}function Yt(){setTimeout(()=>{const t=document.querySelector("h2");t&&(t.setAttribute("tabindex","-1"),t.focus(),setTimeout(()=>t.removeAttribute("tabindex"),100))},100)}class jt{constructor(){this.scores={facial_palsy:0,arm_weakness:0,speech_changes:0,eye_deviation:0,denial_neglect:0},this.onApply=null,this.modal=null}getTotal(){return Object.values(this.scores).reduce((e,i)=>e+i,0)}getRiskLevel(){return this.getTotal()>=4?"high":"low"}render(){const e=this.getTotal(),i=this.getRiskLevel();return`
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
    `}setupEventListeners(){if(this.modal=document.getElementById("fastEdModal"),!this.modal)return;this.modal.addEventListener("change",s=>{if(s.target.type==="radio"){const n=s.target.name,r=parseInt(s.target.value);this.scores[n]=r,this.updateDisplay()}});const e=this.modal.querySelector(".modal-close");e==null||e.addEventListener("click",()=>this.close());const i=this.modal.querySelector('[data-action="cancel-fast-ed"]');i==null||i.addEventListener("click",()=>this.close());const a=this.modal.querySelector('[data-action="apply-fast-ed"]');a==null||a.addEventListener("click",()=>this.apply()),this.modal.addEventListener("click",s=>{s.target===this.modal&&(s.preventDefault(),s.stopPropagation())}),document.addEventListener("keydown",s=>{var n;s.key==="Escape"&&((n=this.modal)!=null&&n.classList.contains("show"))&&this.close()})}updateDisplay(){var a,s;const e=(a=this.modal)==null?void 0:a.querySelector(".total-score"),i=(s=this.modal)==null?void 0:s.querySelector(".risk-indicator");if(e&&(e.textContent=`${this.getTotal()}/9`),i){const n=this.getRiskLevel();i.className=`risk-indicator ${n}`,i.textContent=`${o("riskLevel")}: ${o(n==="high"?"riskLevelHigh":"riskLevelLow")}`}}show(e=0,i=null){this.onApply=i,e>0&&e<=9&&this.approximateFromTotal(e),document.getElementById("fastEdModal")?(this.modal.remove(),document.body.insertAdjacentHTML("beforeend",this.render()),this.modal=document.getElementById("fastEdModal")):document.body.insertAdjacentHTML("beforeend",this.render()),this.setupEventListeners(),this.modal.setAttribute("aria-hidden","false"),this.modal.style.display="flex",this.modal.classList.add("show");const a=this.modal.querySelector('input[type="radio"]');a==null||a.focus()}close(){this.modal&&(this.modal.classList.remove("show"),this.modal.style.display="none",this.modal.setAttribute("aria-hidden","true"))}apply(){const e=this.getTotal(),i=this.scores.arm_weakness>0,a=this.scores.eye_deviation>0;this.onApply&&this.onApply({total:e,components:{...this.scores},armWeaknessBoolean:i,eyeDeviationBoolean:a}),this.close()}approximateFromTotal(e){this.scores={facial_palsy:0,arm_weakness:0,speech_changes:0,eye_deviation:0,denial_neglect:0};let i=e;const a=Object.keys(this.scores);for(const s of a){if(i<=0)break;const r=Math.min(i,s==="facial_palsy"?1:2);this.scores[s]=r,i-=r}}}const Jt=new jt;function I(t){const e=p.getState(),{currentScreen:i,results:a,startTime:s,navigationHistory:n}=e,r=document.createElement("div"),c=document.getElementById("backButton");c&&(c.style.display=n&&n.length>0?"flex":"none");let l="";switch(i){case"triage1":l=se();break;case"triage2":l=Ne();break;case"coma":l=Be();break;case"limited":l=He();break;case"full":l=xe();break;case"results":l=pt(a,s);break;default:l=se()}for(r.innerHTML=l,t.innerHTML="";r.firstChild;)t.appendChild(r.firstChild);const d=t.querySelector("form[data-module]");if(d){const m=d.dataset.module;Zt(d,m)}Qt(t),i==="results"&&a&&setTimeout(()=>{Je(a)},100),setTimeout(()=>{mt()},150),Wt(i),Gt(i),Yt()}function Zt(t,e){const i=p.getFormData(e);!i||Object.keys(i).length===0||Object.entries(i).forEach(([a,s])=>{const n=t.elements[a];n&&(n.type==="checkbox"?n.checked=s===!0||s==="on"||s==="true":n.value=s)})}function Qt(t){t.querySelectorAll('input[type="number"]').forEach(s=>{s.addEventListener("blur",()=>{$t(t)})}),t.querySelectorAll("[data-action]").forEach(s=>{s.addEventListener("click",n=>{const{action:r,value:c}=n.currentTarget.dataset,l=c==="true";switch(r){case"triage1":Ot(l);break;case"triage2":Vt(l);break;case"reset":zt();break;case"goBack":qt();break;case"goHome":Ce();break}})}),t.querySelectorAll("form[data-module]").forEach(s=>{s.addEventListener("submit",n=>{Ut(n,t)})});const e=t.querySelector("#printResults");e&&e.addEventListener("click",()=>window.print());const i=t.querySelector("#fast_ed_score");i&&(i.addEventListener("click",s=>{s.preventDefault();const n=parseInt(i.value)||0;Jt.show(n,r=>{i.value=r.total;const c=t.querySelector("#armparese_hidden");c&&(c.value=r.armWeaknessBoolean?"true":"false");const l=t.querySelector("#eye_deviation_hidden");l&&(l.value=r.eyeDeviationBoolean?"true":"false"),i.dispatchEvent(new Event("change",{bubbles:!0}))})}),i.addEventListener("keydown",s=>{s.preventDefault()})),t.querySelectorAll(".info-toggle").forEach(s=>{s.addEventListener("click",n=>{const r=s.dataset.target,c=t.querySelector(`#${r}`),l=s.querySelector(".toggle-arrow");c&&(c.style.display!=="none"?(c.style.display="none",c.classList.remove("show"),s.classList.remove("active"),l.style.transform="rotate(0deg)"):(c.style.display="block",c.classList.add("show"),s.classList.add("active"),l.style.transform="rotate(180deg)"))})})}class Xt{constructor(){this.container=null,this.unsubscribe=null}async init(){if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",()=>this.init());return}if(this.container=document.getElementById("appContainer"),!this.container){console.error("App container not found");return}this.unsubscribe=p.subscribe(()=>{I(this.container),setTimeout(()=>this.initializeResearchMode(),200)}),window.addEventListener("languageChanged",()=>{this.updateUILanguage(),I(this.container)}),this.setupGlobalEventListeners(),this.initializeTheme(),this.initializeResearchMode(),this.updateUILanguage(),this.startAutoSave(),this.setupSessionTimeout(),this.setCurrentYear(),this.registerServiceWorker(),It(),I(this.container),console.log("iGFAP Stroke Triage Assistant initialized")}setupGlobalEventListeners(){const e=document.getElementById("backButton");e&&e.addEventListener("click",()=>{p.goBack(),I(this.container)});const i=document.getElementById("homeButton");i&&i.addEventListener("click",()=>{p.goHome(),I(this.container)});const a=document.getElementById("languageToggle");a&&a.addEventListener("click",()=>this.toggleLanguage());const s=document.getElementById("darkModeToggle");s&&s.addEventListener("click",()=>this.toggleDarkMode());const n=document.getElementById("researchModeToggle");n&&n.addEventListener("click",r=>{r.preventDefault(),r.stopPropagation(),this.toggleResearchMode()}),this.setupHelpModal(),this.setupFooterLinks(),document.addEventListener("keydown",r=>{if(r.key==="Escape"){const c=document.getElementById("helpModal");c&&c.classList.contains("show")&&(c.classList.remove("show"),c.style.display="none",c.setAttribute("aria-hidden","true"))}}),window.addEventListener("beforeunload",r=>{p.hasUnsavedData()&&(r.preventDefault(),r.returnValue="You have unsaved data. Are you sure you want to leave?")})}setupHelpModal(){const e=document.getElementById("helpButton"),i=document.getElementById("helpModal"),a=i==null?void 0:i.querySelector(".modal-close");if(e&&i){i.classList.remove("show"),i.style.display="none",i.setAttribute("aria-hidden","true"),e.addEventListener("click",()=>{i.style.display="flex",i.classList.add("show"),i.setAttribute("aria-hidden","false")});const s=()=>{i.classList.remove("show"),i.style.display="none",i.setAttribute("aria-hidden","true")};a==null||a.addEventListener("click",s),i.addEventListener("click",n=>{n.target===i&&s()})}}setupFooterLinks(){var e,i;(e=document.getElementById("privacyLink"))==null||e.addEventListener("click",a=>{a.preventDefault(),this.showPrivacyPolicy()}),(i=document.getElementById("disclaimerLink"))==null||i.addEventListener("click",a=>{a.preventDefault(),this.showDisclaimer()})}initializeTheme(){const e=localStorage.getItem("theme"),i=document.getElementById("darkModeToggle");(e==="dark"||!e&&window.matchMedia("(prefers-color-scheme: dark)").matches)&&(document.body.classList.add("dark-mode"),i&&(i.textContent="☀️"))}toggleLanguage(){S.toggleLanguage(),this.updateUILanguage();const e=document.getElementById("languageToggle");if(e){const i=S.getCurrentLanguage();e.textContent=i==="en"?"🇬🇧":"🇩🇪",e.dataset.lang=i}}updateUILanguage(){document.documentElement.lang=S.getCurrentLanguage();const e=document.querySelector(".app-header h1");e&&(e.textContent=o("appTitle"));const i=document.querySelector(".emergency-badge");i&&(i.textContent=o("emergencyBadge"));const a=document.getElementById("languageToggle");a&&(a.title=o("languageToggle"),a.setAttribute("aria-label",o("languageToggle")));const s=document.getElementById("helpButton");s&&(s.title=o("helpButton"),s.setAttribute("aria-label",o("helpButton")));const n=document.getElementById("darkModeToggle");n&&(n.title=o("darkModeButton"),n.setAttribute("aria-label",o("darkModeButton")));const r=document.getElementById("modalTitle");r&&(r.textContent=o("helpTitle"))}toggleDarkMode(){const e=document.getElementById("darkModeToggle");document.body.classList.toggle("dark-mode");const i=document.body.classList.contains("dark-mode");e&&(e.textContent=i?"☀️":"🌙"),localStorage.setItem("theme",i?"dark":"light")}initializeResearchMode(){const e=document.getElementById("researchModeToggle");if(e){const i=this.getCurrentModuleFromResults(),a=i==="limited"||i==="full";e.style.display=a?"flex":"none",e.style.opacity=a?"1":"0.5",console.log(`🔬 Research button visibility: ${a?"VISIBLE":"HIDDEN"} (module: ${i})`)}}getCurrentModuleFromResults(){var a,s;const e=p.getState();if(e.currentScreen!=="results"||!((s=(a=e.results)==null?void 0:a.ich)!=null&&s.module))return null;const i=e.results.ich.module.toLowerCase();return i.includes("coma")?"coma":i.includes("limited")?"limited":i.includes("full")?"full":null}toggleResearchMode(){const e=document.getElementById("researchPanel");if(!e){console.warn("🔬 Research panel not found - likely not on results screen");return}const i=e.style.display!=="none";e.style.display=i?"none":"block";const a=document.getElementById("researchModeToggle");return a&&(a.style.background=i?"rgba(255, 255, 255, 0.1)":"rgba(0, 102, 204, 0.2)"),console.log(`🔬 Research panel ${i?"HIDDEN":"SHOWN"}`),!1}showResearchActivationMessage(){const e=document.createElement("div");e.className="research-activation-toast",e.innerHTML=`
      <div class="toast-content">
        🔬 <strong>Research Mode Activated</strong><br>
        <small>Model comparison features enabled</small>
      </div>
    `,document.body.appendChild(e),setTimeout(()=>{document.body.contains(e)&&document.body.removeChild(e)},3e3)}startAutoSave(){setInterval(()=>{this.saveCurrentFormData()},W.autoSaveInterval)}saveCurrentFormData(){this.container.querySelectorAll("form[data-module]").forEach(i=>{const a=new FormData(i),s=i.dataset.module;if(s){const n={};a.forEach((l,d)=>{const m=i.elements[d];m&&m.type==="checkbox"?n[d]=m.checked:n[d]=l});const r=p.getFormData(s);JSON.stringify(r)!==JSON.stringify(n)&&p.setFormData(s,n)}})}setupSessionTimeout(){setTimeout(()=>{confirm("Your session has been idle for 30 minutes. Would you like to continue?")?this.setupSessionTimeout():p.reset()},W.sessionTimeout)}setCurrentYear(){const e=document.getElementById("currentYear");e&&(e.textContent=new Date().getFullYear())}showPrivacyPolicy(){alert("Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.")}showDisclaimer(){alert("Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.")}async registerServiceWorker(){if(!("serviceWorker"in navigator)){console.log("Service Workers not supported");return}try{const e=await navigator.serviceWorker.register("/0825/sw.js",{scope:"/0825/"});console.log("Service Worker registered successfully:",e),e.addEventListener("updatefound",()=>{const i=e.installing;console.log("New service worker found"),i.addEventListener("statechange",()=>{i.state==="installed"&&navigator.serviceWorker.controller&&(console.log("New service worker installed, update available"),this.showUpdateNotification())})}),navigator.serviceWorker.addEventListener("message",i=>{console.log("Message from service worker:",i.data)})}catch(e){console.error("Service Worker registration failed:",e)}}showUpdateNotification(){const e=document.createElement("div");e.className="modal show update-modal",e.style.cssText=`
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
    `,e.appendChild(i),document.body.appendChild(e);const a=e.querySelector("#updateNow"),s=e.querySelector("#updateLater");a.addEventListener("click",()=>{window.location.reload()}),s.addEventListener("click",()=>{e.remove(),setTimeout(()=>this.showUpdateNotification(),5*60*1e3)}),e.addEventListener("click",n=>{n.target===e&&s.click()})}destroy(){this.unsubscribe&&this.unsubscribe()}}const ei=new Xt;ei.init();
//# sourceMappingURL=index-BwbTQxsN.js.map
