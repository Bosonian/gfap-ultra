const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/research-tools-D6-gi7wf.js","assets/medical-core-BFYLkP1b.js","assets/enterprise-features-DrM-1IqS.js"])))=>i.map(i=>d[i]);
var Qt=Object.defineProperty;var Jt=(s,e,t)=>e in s?Qt(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var ve=(s,e,t)=>Jt(s,typeof e!="symbol"?e+"":e,t);import{s as m,v as Zt,b as Xt,a as H,P as qe,m as p,M as f}from"./medical-core-BFYLkP1b.js";import{p as kt,a as wt,b as Tt,A as ei,e as Ct,c as ti}from"./prediction-models-BW8hqZ1g.js";import{s as Ee,a as me,b as Me,g as st,m as at,c as rt}from"./enterprise-features-DrM-1IqS.js";import{i as ke,s as ii,c as si,r as At,a as It,b as ai,d as nt,e as ot,q as We}from"./research-tools-D6-gi7wf.js";import{i as ri,r as Lt,a as ni,b as oi}from"./ui-components-BWyzIDxj.js";import{r as Se,R as se,c as lt}from"./vendor-x0kWEXnY.js";import"./index-BBmQgakm.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const n of a.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function t(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(r){if(r.ep)return;r.ep=!0;const a=t(r);fetch(r.href,a)}})();const li=!1,ci={success:!0,message:"Development mode - authentication bypassed",session_token:"dev-token-"+Date.now(),expires_at:new Date(Date.now()+30*60*1e3).toISOString(),session_duration:1800},di={coma_ich:{probability:25.3,ich_probability:25.3,drivers:{gfap_value:.4721,baseline_risk:.1456},confidence:.75},limited_ich:{probability:31.7,ich_probability:31.7,drivers:{age_years:.2845,systolic_bp:.1923,gfap_value:.4231,vigilanzminderung:.3456},confidence:.65},full_stroke:{ich_prediction:{probability:28.4,drivers:{age_years:.1834,gfap_value:.3921,systolic_bp:.2341,vigilanzminderung:.2876},confidence:.88},lvo_prediction:{probability:45.2,drivers:{fast_ed_score:.7834,age_years:.2341,eye_deviation:.1923},confidence:.82}},authenticate:{success:!0,message:"Development mode - authentication bypassed",session_token:"dev-token-"+Date.now(),expires_at:new Date(Date.now()+30*60*1e3).toISOString(),session_duration:1800}},Re={COMA_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_coma_ich",LDM_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_limited_data_ich",FULL_STROKE:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_full_stroke",LVO_PREDICTION:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_lvo",AUTHENTICATE:"https://europe-west3-igfap-452720.cloudfunctions.net/authenticate-research-access"},he={isDevelopment:li,mockAuthResponse:ci,mockApiResponses:di},Mt={ich:{medium:25,high:50},lvo:{medium:25,high:50}},K={min:29,max:10001,normal:100,elevated:500,critical:1e3},ct={autoSaveInterval:18e4,sessionTimeout:30*60*1e3},Ea={age_years:{required:!0,min:0,max:120,type:"integer",medicalCheck:s=>s<18?"Emergency stroke assessment typically for adults (≥18 years)":null},systolic_bp:{required:!0,min:60,max:300,type:"number",medicalCheck:(s,e)=>{const t=e==null?void 0:e.diastolic_bp;return t&&s<=t?"Systolic BP must be higher than diastolic BP":null}},diastolic_bp:{required:!0,min:30,max:200,type:"number",medicalCheck:(s,e)=>{const t=e==null?void 0:e.systolic_bp;return t&&s>=t?"Diastolic BP must be lower than systolic BP":null}},gfap_value:{required:!0,min:K.min,max:K.max,type:"number",medicalCheck:s=>s>8e3?"Warning: Extremely high GFAP value - please verify lab result (still valid)":null},fast_ed_score:{required:!0,min:0,max:9,type:"integer",medicalCheck:s=>s>=4?"High FAST-ED score suggests LVO - consider urgent intervention":null},gcs:{required:!0,min:3,max:15,type:"integer",medicalCheck:s=>s<8?"GCS < 8 indicates severe consciousness impairment - consider coma module":null}},ui=-.825559,hi=-.408314,mi=-.82645,gi=1.651521,pi=-0,fi=1,yi=3.701422,bi=2.306173,vi=1.11742,Si=-1.032167,Ei=.333333,ki=1e-15,wi=0,Ti=16;function Ci(s,e){return Math.abs(e)<ki?Math.log(s+1):(Math.pow(s+1,e)-1)/e}function dt(s,e,t){return(s-e)/t}function Ai(s){return s>500?1:s<-500?0:1/(1+Math.exp(-s))}function Ii(s,e){if(s==null)throw new Error("gfap is required");if(e==null)throw new Error("fasted is required");const t=Number(s),i=Number(e);if(!Number.isFinite(t))throw new Error("gfap must be a finite number");if(!Number.isFinite(i))throw new Error("fasted must be a finite number");if(t<0)throw new Error("GFAP value must be non-negative");return{gfap:t,fasted:i}}function Li(s,e){const t=Ii(s,e),i=Math.max(wi,Math.min(Ti,t.fasted)),r=Ci(t.gfap,ui),a=dt(r,pi,fi),n=dt(i,yi,bi),l=hi+mi*a+gi*n,c=vi*l+Si;return Ai(c)}function ka(s,e){return Li(s,e)>=Ei?1:0}const ut={en:{appTitle:"iGFAP",emergencyBadge:"Emergency Tool",helpButton:"Help and Instructions",darkModeButton:"Toggle dark mode",languageToggle:"Language",step1:"Initial Assessment",step2:"Data Collection",step3:"Results",comaModuleTitle:"Coma Module",limitedDataModuleTitle:"Limited Data Module",fullStrokeModuleTitle:"Full Stroke Module",triage1Title:"Patient Assessment",triage1Question:"Is the patient comatose?",triage1Help:"Glasgow Coma Scale < 9",triage1Yes:"YES - Comatose",triage1No:"NO - Conscious",triage2Title:"Examination Capability",triage2Question:"Can the patient be reliably examined?",triage2Help:"Patient is not aphasic, confused, or uncooperative",triage2Yes:"YES - Full Exam Possible",triage2No:"NO - Limited Exam Only",ageLabel:"Age (years)",ageHelp:"Patient age in years",systolicLabel:"Systolic BP (mmHg)",systolicHelp:"Systolic blood pressure",diastolicLabel:"Diastolic BP (mmHg)",diastolicHelp:"Diastolic blood pressure",gfapLabel:"GFAP Value (pg/mL)",gfapHelp:"GFAP biomarker level",fastEdLabel:"FAST-ED Score",fastEdHelp:"FAST-ED assessment score (0-9)",headacheLabel:"Headache",vigilanzLabel:"Reduced consciousness",armPareseLabel:"Arm weakness",beinPareseLabel:"Leg weakness",eyeDeviationLabel:"Eye deviation",atrialFibLabel:"Atrial fibrillation",anticoagLabel:"Anticoagulated (NOAK)",antiplateletsLabel:"Antiplatelets",analyzeButton:"Analyze",analyzing:"Analyzing...",printResults:"Print Results",newAssessment:"Start New Assessment",startOver:"Start Over",goBack:"Go Back",goHome:"Go Home",basicInformation:"Basic Information",biomarkersScores:"Biomarkers & Scores",clinicalSymptoms:"Clinical Symptoms",medicalHistory:"Medical History",ageYearsLabel:"Age (years)",systolicBpLabel:"Systolic BP (mmHg)",diastolicBpLabel:"Diastolic BP (mmHg)",gfapValueLabel:"GFAP Value (pg/mL)",fastEdScoreLabel:"FAST-ED Score",ageYearsHelp:"Patient's age in years",systolicBpHelp:"Normal: 90-140 mmHg",diastolicBpHelp:"Normal: 60-90 mmHg",gfapTooltip:"Brain injury biomarker",gfapTooltipLong:"Glial Fibrillary Acidic Protein - Brain injury biomarker",gfapRange:"Range: {min} - {max} pg/mL",fastEdTooltip:"0-9 scale for LVO screening",analyzeIchRisk:"Analyze ICH Risk",analyzeStrokeRisk:"Analyze Stroke Risk",criticalPatient:"Critical Patient",comaAlert:"Patient is comatose (GCS < 9). Rapid assessment required.",vigilanceReduction:"Vigilance Reduction (Decreased alertness)",armParesis:"Arm Paresis",legParesis:"Leg Paresis",eyeDeviation:"Eye Deviation",atrialFibrillation:"Atrial Fibrillation",onNoacDoac:"On NOAC/DOAC",onAntiplatelets:"On Antiplatelets",resultsTitle:"Assessment Results",bleedingRiskAssessment:"Bleeding Risk Assessment",ichProbability:"ICH Probability",lvoProbability:"LVO Probability",lvoMayBePossible:"Large vessel occlusion possible - further evaluation recommended",riskFactorsTitle:"Main Risk Factors",increasingRisk:"Increasing Risk",decreasingRisk:"Decreasing Risk",noFactors:"No factors",riskLevel:"Risk Level",lowRisk:"Low Risk",mediumRisk:"Medium Risk",highRisk:"High Risk",riskLow:"Low",riskMedium:"Medium",riskHigh:"High",riskFactorsAnalysis:"Risk Factors",contributingFactors:"Contributing factors to the assessment",riskFactors:"Risk Factors",increaseRisk:"INCREASE",decreaseRisk:"DECREASE",noPositiveFactors:"No increasing factors",noNegativeFactors:"No decreasing factors",ichRiskFactors:"ICH Risk Factors",lvoRiskFactors:"LVO Risk Factors",criticalAlertTitle:"CRITICAL RISK DETECTED",criticalAlertMessage:"High probability of intracerebral hemorrhage detected.",immediateActionsRequired:"Immediate actions required",initiateStrokeProtocol:"Initiate stroke protocol immediately",urgentCtImaging:"Urgent CT imaging required",considerBpManagement:"Consider blood pressure management",prepareNeurosurgicalConsult:"Prepare for potential neurosurgical consultation",helpTitle:"Quick Reference Guide",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 9: Comatose patient - use Coma Module",gcsMod:"GCS 8-12: Moderate impairment",gcsHigh:"GCS 13-15: Mild impairment",fastEdTitle:"FAST-ED Score Components",fastEdFacial:"Facial Palsy: 0-1 points",fastEdArm:"Arm Weakness: 0-2 points",fastEdSpeech:"Speech Changes: 0-2 points",fastEdTime:"Time: Critical factor",fastEdEye:"Eye Deviation: 0-2 points",fastEdDenial:"Denial/Neglect: 0-2 points",criticalValuesTitle:"Critical Values",criticalBp:"Systolic BP > 180: Increased ICH risk",criticalGfap:"GFAP > 500 pg/mL: Significant marker",criticalFastEd:"FAST-ED ≥ 4: Consider LVO",fastEdCalculatorTitle:"FAST-ED Score Calculator",fastEdCalculatorSubtitle:"Click to calculate FAST-ED score components",facialPalsyTitle:"Facial Palsy",facialPalsyNormal:"Normal (0)",facialPalsyMild:"Present (1)",armWeaknessTitle:"Arm Weakness",armWeaknessNormal:"Normal (0)",armWeaknessMild:"Mild weakness or drift (1)",armWeaknessSevere:"Severe weakness or falls immediately (2)",speechChangesTitle:"Speech Abnormalities",speechChangesNormal:"Normal (0)",speechChangesMild:"Mild dysarthria or aphasia (1)",speechChangesSevere:"Severe dysarthria or aphasia (2)",eyeDeviationTitle:"Eye Deviation",eyeDeviationNormal:"Normal (0)",eyeDeviationPartial:"Partial gaze deviation (1)",eyeDeviationForced:"Forced gaze deviation (2)",denialNeglectTitle:"Denial/Neglect",denialNeglectNormal:"Normal (0)",denialNeglectPartial:"Partial neglect (1)",denialNeglectComplete:"Complete neglect (2)",totalScoreTitle:"Total FAST-ED Score",riskLevel:"Risk Level",riskLevelLow:"LOW (Score <4)",riskLevelHigh:"HIGH (Score ≥4 - Consider LVO)",applyScore:"Apply Score",cancel:"Cancel",riskAnalysis:"Risk Analysis",riskAnalysisSubtitle:"Clinical factors in this assessment",contributingFactors:"Contributing factors",factorsShown:"shown",positiveFactors:"Positive factors",negativeFactors:"Negative factors",clinicalInformation:"Clinical Information",clinicalRecommendations:"Clinical Recommendations",clinicalRec1:"Consider immediate imaging if ICH risk is high",clinicalRec2:"Activate stroke team for LVO scores ≥ 50%",clinicalRec3:"Monitor blood pressure closely",clinicalRec4:"Document all findings thoroughly",noDriverData:"No driver data available",driverAnalysisUnavailable:"Driver analysis unavailable",driverInfoNotAvailable:"Driver information not available from this prediction model",driverAnalysisNotAvailable:"Driver analysis not available for this prediction",lvoNotPossible:"LVO assessment not possible with limited data",fullExamRequired:"Full neurological examination required for LVO screening",limitedAssessment:"Limited Assessment",disclaimer:"Clinical Disclaimer",disclaimerText:"This tool is for clinical decision support only. Always use clinical judgment and follow local protocols. Not a replacement for physician assessment.",importantNote:"Important",importantText:"These results are for clinical decision support only. Always use clinical judgment and follow institutional protocols.",predictedMortality:"Predicted 30-day mortality",ichVolumeLabel:"ICH Volume",references:"References",inputSummaryTitle:"Input Summary",inputSummarySubtitle:"Values used for this analysis",privacyLink:"Privacy Policy",disclaimerLink:"Medical Disclaimer",versionLink:"Version 2.1.0 - Research Preview",privacyPolicy:"Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.",medicalDisclaimer:"Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.",networkError:"Network error - please check your connection and try again",requestTimeout:"Request timeout - please try again",apiError:"Failed to get results",validationError:"Please check your input values",sessionTimeout:"Your session has been idle for 30 minutes. Would you like to continue?",unsavedData:"You have unsaved data. Are you sure you want to leave?",nearestCentersTitle:"Nearest Stroke Centers",useCurrentLocation:"Use Current Location",enterLocationPlaceholder:"Enter city or address...",enterManually:"Enter Location Manually",search:"Search",yourLocation:"Your Location",recommendedCenters:"Recommended Centers",alternativeCenters:"Alternative Centers",noCentersFound:"No stroke centers found in this area",gettingLocation:"Getting your location",searchingLocation:"Searching location",locationError:"Unable to get your location",locationPermissionDenied:"Location access denied. Please allow location access and try again.",locationUnavailable:"Location information is unavailable",locationTimeout:"Location request timed out",geolocationNotSupported:"Geolocation is not supported by this browser",geocodingNotImplemented:"Location search not available. Please use GPS or enter coordinates manually.",tryManualEntry:"Try entering your location manually or use GPS.",distanceNote:"Distances are calculated as straight-line distances. Actual travel times may vary.",travelTimeNote:"Travel times calculated for emergency vehicles with sirens and priority routing.",calculatingTravelTimes:"Calculating travel times",minutes:"min",poweredByOrs:"Travel times powered by OpenRoute Service",comprehensiveCenter:"Comprehensive Stroke Center",primaryCenter:"Primary Stroke Center",telemetryCenter:"Telemedicine Center",thrombectomy:"Thrombectomy",neurosurgery:"Neurosurgery",icu:"Intensive Care",telemedicine:"Telemedicine",stroke_unit:"Stroke Unit",call:"Call",directions:"Directions",emergency:"Emergency",certified:"Certified",prerequisitesTitle:"Prerequisites for Stroke Triage",prerequisitesIntro:"Please confirm that all of the following prerequisites are met:",prerequisitesWarning:"All prerequisites must be met to continue",continue:"Continue",acute_deficit:"Acute (severe) neurological deficit present",symptom_onset:"Symptom onset within 6 hours",no_preexisting:"No pre-existing severe neurological deficits",no_trauma:"No traumatic brain injury present",differentialDiagnoses:"Differential Diagnoses",reconfirmTimeWindow:"Please reconfirm time window!",unclearTimeWindow:"With unclear/extended time window, early demarcated brain infarction is also possible",rareDiagnoses:"Rare diagnoses such as glioblastoma are also possible"},de:{appTitle:"iGFAP",emergencyBadge:"Notfall-Tool",helpButton:"Hilfe und Anweisungen",darkModeButton:"Dunklen Modus umschalten",languageToggle:"Sprache",step1:"Erstbeurteilung",step2:"Datenerhebung",step3:"Ergebnisse",comaModuleTitle:"Koma-Modul",limitedDataModuleTitle:"Begrenzte Daten Modul",fullStrokeModuleTitle:"Vollständiges Schlaganfall-Modul",triage1Title:"Patientenbeurteilung",triage1Question:"Ist der Patient komatös?",triage1Help:"Glasgow Coma Scale < 9",triage1Yes:"JA - Komatös",triage1No:"NEIN - Bei Bewusstsein",triage2Title:"Untersuchungsfähigkeit",triage2Question:"Kann der Patient zuverlässig untersucht werden?",triage2Help:"Patient ist nicht aphasisch, verwirrt oder unkooperativ",triage2Yes:"JA - Vollständige Untersuchung möglich",triage2No:"NEIN - Nur begrenzte Untersuchung",ageLabel:"Alter (Jahre)",ageHelp:"Patientenalter in Jahren",systolicLabel:"Systolischer RR (mmHg)",systolicHelp:"Systolischer Blutdruck",diastolicLabel:"Diastolischer RR (mmHg)",diastolicHelp:"Diastolischer Blutdruck",gfapLabel:"GFAP-Wert (pg/mL)",gfapHelp:"GFAP-Biomarker-Wert",fastEdLabel:"FAST-ED-Score",fastEdHelp:"FAST-ED-Bewertungsscore (0-9)",headacheLabel:"Kopfschmerzen",vigilanzLabel:"Bewusstseinstrübung",armPareseLabel:"Armschwäche",beinPareseLabel:"Beinschwäche",eyeDeviationLabel:"Blickdeviation",atrialFibLabel:"Vorhofflimmern",anticoagLabel:"Antikoaguliert (NOAK)",antiplateletsLabel:"Thrombozytenaggregationshemmer",analyzeButton:"Analysieren",analyzing:"Analysiere...",printResults:"Ergebnisse drucken",newAssessment:"Neue Bewertung starten",startOver:"Von vorn beginnen",goBack:"Zurück",goHome:"Zur Startseite",basicInformation:"Grundinformationen",biomarkersScores:"Biomarker & Scores",clinicalSymptoms:"Klinische Symptome",medicalHistory:"Anamnese",ageYearsLabel:"Alter (Jahre)",systolicBpLabel:"Systolischer RR (mmHg)",diastolicBpLabel:"Diastolischer RR (mmHg)",gfapValueLabel:"GFAP-Wert (pg/mL)",fastEdScoreLabel:"FAST-ED-Score",ageYearsHelp:"Patientenalter in Jahren",systolicBpHelp:"Normal: 90-140 mmHg",diastolicBpHelp:"Normal: 60-90 mmHg",gfapTooltip:"Hirnverletzungs-Biomarker",gfapTooltipLong:"Glial Fibrillary Acidic Protein - Hirnverletzungs-Biomarker",gfapRange:"Bereich: {min} - {max} pg/mL",fastEdTooltip:"0-9 Skala für LVO-Screening",analyzeIchRisk:"ICB-Risiko analysieren",analyzeStrokeRisk:"Schlaganfall-Risiko analysieren",criticalPatient:"Kritischer Patient",comaAlert:"Patient ist komatös (GCS < 9). Schnelle Beurteilung erforderlich.",vigilanceReduction:"Vigilanzminderung (Verminderte Wachheit)",armParesis:"Armparese",legParesis:"Beinparese",eyeDeviation:"Blickdeviation",atrialFibrillation:"Vorhofflimmern",onNoacDoac:"NOAK/DOAK-Therapie",onAntiplatelets:"Thrombozytenaggregationshemmer",resultsTitle:"Bewertungsergebnisse",bleedingRiskAssessment:"Blutungsrisiko-Bewertung",ichProbability:"ICB-Risiko",lvoProbability:"LVO-Risiko",lvoMayBePossible:"Großgefäßverschluss möglich - weitere Abklärung empfohlen",riskFactorsTitle:"Hauptrisikofaktoren",increasingRisk:"Risikoerhöhend",decreasingRisk:"Risikomindernd",noFactors:"Keine Faktoren",riskLevel:"Risikostufe",lowRisk:"Niedriges Risiko",mediumRisk:"Mittleres Risiko",highRisk:"Hohes Risiko",riskLow:"Niedrig",riskMedium:"Mittel",riskHigh:"Hoch",riskFactorsAnalysis:"Risikofaktoren",contributingFactors:"Beitragende Faktoren zur Bewertung",riskFactors:"Risikofaktoren",increaseRisk:"ERHÖHEN",decreaseRisk:"VERRINGERN",noPositiveFactors:"Keine erhöhenden Faktoren",noNegativeFactors:"Keine verringernden Faktoren",ichRiskFactors:"ICB-Risikofaktoren",lvoRiskFactors:"LVO-Risikofaktoren",criticalAlertTitle:"KRITISCHES RISIKO ERKANNT",criticalAlertMessage:"Hohe Wahrscheinlichkeit einer intrazerebralen Blutung erkannt.",immediateActionsRequired:"Sofortige Maßnahmen erforderlich",initiateStrokeProtocol:"Schlaganfall-Protokoll sofort einleiten",urgentCtImaging:"Dringende CT-Bildgebung erforderlich",considerBpManagement:"Blutdruckmanagement erwägen",prepareNeurosurgicalConsult:"Neurochirurgische Konsultation vorbereiten",helpTitle:"Kurzreferenzleitfaden",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 9: Komatöser Patient - Koma-Modul verwenden",gcsMod:"GCS 8-12: Mäßige Beeinträchtigung",gcsHigh:"GCS 13-15: Leichte Beeinträchtigung",fastEdTitle:"FAST-ED-Score-Komponenten",fastEdFacial:"Faziale Parese: 0-1 Punkte",fastEdArm:"Armschwäche: 0-2 Punkte",fastEdSpeech:"Sprachveränderungen: 0-2 Punkte",fastEdTime:"Zeit: Kritischer Faktor",fastEdEye:"Blickdeviation: 0-2 Punkte",fastEdDenial:"Verneinung/Neglect: 0-2 Punkte",criticalValuesTitle:"Kritische Werte",criticalBp:"Systolischer RR > 180: Erhöhtes ICB-Risiko",criticalGfap:"GFAP > 500 pg/mL: Signifikanter Marker",criticalFastEd:"FAST-ED ≥ 4: LVO in Betracht ziehen",fastEdCalculatorTitle:"FAST-ED-Score-Rechner",fastEdCalculatorSubtitle:"Klicken Sie, um FAST-ED-Score-Komponenten zu berechnen",facialPalsyTitle:"Fazialisparese",facialPalsyNormal:"Normal (0)",facialPalsyMild:"Vorhanden (1)",armWeaknessTitle:"Armschwäche",armWeaknessNormal:"Normal (0)",armWeaknessMild:"Leichte Schwäche oder Absinken (1)",armWeaknessSevere:"Schwere Schwäche oder fällt sofort ab (2)",speechChangesTitle:"Sprachstörungen",speechChangesNormal:"Normal (0)",speechChangesMild:"Leichte Dysarthrie oder Aphasie (1)",speechChangesSevere:"Schwere Dysarthrie oder Aphasie (2)",eyeDeviationTitle:"Blickdeviation",eyeDeviationNormal:"Normal (0)",eyeDeviationPartial:"Partielle Blickdeviation (1)",eyeDeviationForced:"Forcierte Blickdeviation (2)",denialNeglectTitle:"Verneinung/Neglect",denialNeglectNormal:"Normal (0)",denialNeglectPartial:"Partieller Neglect (1)",denialNeglectComplete:"Kompletter Neglect (2)",totalScoreTitle:"Gesamt-FAST-ED-Score",riskLevel:"Risikostufe",riskLevelLow:"NIEDRIG (Score <4)",riskLevelHigh:"HOCH (Score ≥4 - LVO erwägen)",applyScore:"Score Anwenden",cancel:"Abbrechen",riskAnalysis:"Risikoanalyse",riskAnalysisSubtitle:"Klinische Faktoren in dieser Bewertung",contributingFactors:"Beitragende Faktoren",factorsShown:"angezeigt",positiveFactors:"Positive Faktoren",negativeFactors:"Negative Faktoren",clinicalInformation:"Klinische Informationen",clinicalRecommendations:"Klinische Empfehlungen",clinicalRec1:"Sofortige Bildgebung erwägen bei hohem ICB-Risiko",clinicalRec2:"Stroke-Team aktivieren bei LVO-Score ≥ 50%",clinicalRec3:"Blutdruck engmaschig überwachen",clinicalRec4:"Alle Befunde gründlich dokumentieren",noDriverData:"Keine Treiberdaten verfügbar",driverAnalysisUnavailable:"Treiberanalyse nicht verfügbar",driverInfoNotAvailable:"Treiberinformationen von diesem Vorhersagemodell nicht verfügbar",driverAnalysisNotAvailable:"Treiberanalyse für diese Vorhersage nicht verfügbar",lvoNotPossible:"LVO-Bewertung mit begrenzten Daten nicht möglich",fullExamRequired:"Vollständige neurologische Untersuchung für LVO-Screening erforderlich",limitedAssessment:"Begrenzte Bewertung",disclaimer:"Klinischer Haftungsausschluss",disclaimerText:"Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle. Kein Ersatz für ärztliche Beurteilung.",importantNote:"Wichtig",importantText:"Diese Ergebnisse dienen nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie institutionelle Protokolle.",predictedMortality:"Vorhergesagte 30-Tage-Mortalität",ichVolumeLabel:"ICB-Volumen",references:"Referenzen",inputSummaryTitle:"Eingabezusammenfassung",inputSummarySubtitle:"Für diese Analyse verwendete Werte",privacyLink:"Datenschutzrichtlinie",disclaimerLink:"Medizinischer Haftungsausschluss",versionLink:"Version 2.1.0 - Research Preview",privacyPolicy:"Datenschutzrichtlinie: Dieses Tool verarbeitet Daten lokal. Keine Patientendaten werden gespeichert oder übertragen.",medicalDisclaimer:"Medizinischer Haftungsausschluss: Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle.",networkError:"Netzwerkfehler - bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut",requestTimeout:"Anfrage-Timeout - bitte versuchen Sie es erneut",apiError:"Ergebnisse konnten nicht abgerufen werden",validationError:"Bitte überprüfen Sie Ihre Eingabewerte",sessionTimeout:"Ihre Sitzung war 30 Minuten lang inaktiv. Möchten Sie fortfahren?",unsavedData:"Sie haben ungespeicherte Daten. Sind Sie sicher, dass Sie verlassen möchten?",nearestCentersTitle:"Nächstgelegene Schlaganfall-Zentren",useCurrentLocation:"Aktuellen Standort verwenden",enterLocationPlaceholder:"Stadt oder Adresse eingeben...",enterManually:"Standort manuell eingeben",search:"Suchen",yourLocation:"Ihr Standort",recommendedCenters:"Empfohlene Zentren",alternativeCenters:"Alternative Zentren",noCentersFound:"Keine Schlaganfall-Zentren in diesem Bereich gefunden",gettingLocation:"Standort wird ermittelt",searchingLocation:"Standort wird gesucht",locationError:"Standort konnte nicht ermittelt werden",locationPermissionDenied:"Standortzugriff verweigert. Bitte erlauben Sie Standortzugriff und versuchen Sie es erneut.",locationUnavailable:"Standortinformationen sind nicht verfügbar",locationTimeout:"Standortanfrage ist abgelaufen",geolocationNotSupported:"Geolokalisierung wird von diesem Browser nicht unterstützt",geocodingNotImplemented:"Standortsuche nicht verfügbar. Bitte verwenden Sie GPS oder geben Sie Koordinaten manuell ein.",tryManualEntry:"Versuchen Sie, Ihren Standort manuell einzugeben oder GPS zu verwenden.",distanceNote:"Entfernungen werden als Luftlinie berechnet. Tatsächliche Fahrzeiten können variieren.",travelTimeNote:"Fahrzeiten berechnet für Rettungsfahrzeuge mit Sondersignalen und Vorfahrtsberechtigung.",calculatingTravelTimes:"Fahrzeiten werden berechnet",minutes:"Min",poweredByOrs:"Fahrzeiten bereitgestellt von OpenRoute Service",comprehensiveCenter:"Überregionales Schlaganfall-Zentrum",primaryCenter:"Regionales Schlaganfall-Zentrum",telemetryCenter:"Telemedizin-Zentrum",thrombectomy:"Thrombektomie",neurosurgery:"Neurochirurgie",icu:"Intensivstation",telemedicine:"Telemedizin",stroke_unit:"Stroke Unit",call:"Anrufen",directions:"Wegbeschreibung",emergency:"Notfall",certified:"Zertifiziert",prerequisitesTitle:"Voraussetzungen für Schlaganfall-Triage",prerequisitesIntro:"Bitte bestätigen Sie, dass alle folgenden Voraussetzungen erfüllt sind:",prerequisitesWarning:"Alle Voraussetzungen müssen erfüllt sein, um fortzufahren",continue:"Weiter",acute_deficit:"Akutes (schweres) neurologisches Defizit vorhanden",symptom_onset:"Symptombeginn innerhalb 6h",no_preexisting:"Keine vorbestehende schwere neurologische Defizite",no_trauma:"Kein Schädelhirntrauma vorhanden",differentialDiagnoses:"Differentialdiagnosen",reconfirmTimeWindow:"Bitte Zeitfenster rekonfirmieren!",unclearTimeWindow:"Bei unklarem/erweitertem Zeitfenster ist auch ein beginnend demarkierter Hirninfarkt möglich",rareDiagnoses:"Seltene Diagnosen wie ein Glioblastom sind auch möglich"}};class Mi{constructor(){this.supportedLanguages=["en","de"],this.currentLanguage=this.detectLanguage()}detectLanguage(){const e=localStorage.getItem("language");return e&&this.supportedLanguages.includes(e)?e:(navigator.language||navigator.userLanguage).substring(0,2).toLowerCase()==="de"?"de":"en"}getCurrentLanguage(){return this.currentLanguage}setLanguage(e){return this.supportedLanguages.includes(e)?(this.currentLanguage=e,localStorage.setItem("language",e),window.dispatchEvent(new CustomEvent("languageChanged",{detail:{language:e}})),!0):!1}getSupportedLanguages(){return[...this.supportedLanguages]}t(e){return(ut[this.currentLanguage]||ut.en)[e]||e}toggleLanguage(){const e=this.currentLanguage==="en"?"de":"en";return this.setLanguage(e)}getLanguageDisplayName(e=null){const t=e||this.currentLanguage;return{en:"English",de:"Deutsch"}[t]||t}formatDateTime(e){const t=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(t,{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(e)}formatTime(e){const t=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(t,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(e)}}const Y=new Mi,o=s=>Y.t(s),Ri=()=>[{id:"acute_deficit",checked:!1},{id:"symptom_onset",checked:!1},{id:"no_preexisting",checked:!1},{id:"no_trauma",checked:!1}];function _i(){const s=Ri();return`
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
            ${s.map(e=>`
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
  `}function Ni(){const s=document.getElementById("prerequisitesModal");if(!s)return;const e=document.getElementById("closePrerequisites"),t=document.getElementById("cancelPrerequisites"),i=document.getElementById("confirmPrerequisites"),r=()=>{s.remove(),pe("welcome")};e==null||e.addEventListener("click",r),t==null||t.addEventListener("click",r),i==null||i.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation();const l=s.querySelectorAll(".toggle-input");if(Array.from(l).every(h=>h.checked))s.remove(),pe("triage2");else{const h=document.getElementById("prerequisitesWarning");h&&(h.style.display="flex",h.classList.add("shake"),setTimeout(()=>h.classList.remove("shake"),500))}});const a=s.querySelectorAll(".toggle-input");a.forEach(n=>{n.addEventListener("change",()=>{const l=Array.from(a).every(h=>h.checked),c=document.getElementById("prerequisitesWarning");l&&c&&(c.style.display="none")})})}function Pi(){const s=document.getElementById("prerequisitesModal");s&&s.remove();const e=document.createElement("div");try{Ee(e,_i());const t=e.firstElementChild;if(!t)throw new Error("Failed to create modal element");document.body.appendChild(t)}catch(t){console.error("Prerequisites modal sanitization failed:",t);const i=document.createElement("div");i.className="modal prerequisites-modal",i.style.display="flex",i.textContent="Prerequisites modal could not be displayed securely. Please refresh the page.",document.body.appendChild(i);return}Ni()}function Di(s){m.logEvent("triage1_answer",{comatose:s}),s?pe("coma"):Pi()}function xi(s){m.logEvent("triage2_answer",{examinable:s}),pe(s?"full":"limited")}function pe(s){m.logEvent("navigate",{from:m.getState().currentScreen,to:s}),m.navigate(s),window.scrollTo(0,0)}function Oi(){m.hasUnsavedData()&&!confirm("Are you sure you want to start over? All entered data will be lost.")||(m.logEvent("reset"),m.reset())}function $i(){m.goBack()?(m.logEvent("navigate_back"),window.scrollTo(0,0)):Rt()}function Rt(){m.logEvent("navigate_home"),m.goHome(),window.scrollTo(0,0)}async function Fi(s,e){var c,h;s.preventDefault();const t=s.target,{module:i}=t.dataset,r=Zt(t);if(!r.isValid){Xt(e,r.validationErrors);try{const d=Object.keys(r.validationErrors)[0];if(d&&t.elements[d]){const w=t.elements[d];w.focus({preventScroll:!0}),w.scrollIntoView({behavior:"smooth",block:"center"})}const u=document.createElement("div");u.className="sr-only",u.setAttribute("role","status"),u.setAttribute("aria-live","polite");const v=Object.keys(r.validationErrors).length;u.textContent=`${v} field${v===1?"":"s"} need attention.`,document.body.appendChild(u),setTimeout(()=>u.remove(),1200)}catch(d){}return}const a={};Array.from(t.elements).forEach(d=>{if(d.name)if(d.type==="checkbox")a[d.name]=d.checked;else if(d.type==="number"){const u=parseFloat(d.value);a[d.name]=isNaN(u)?0:u}else d.type==="hidden"&&d.name==="armparese"?a[d.name]=d.value==="true":a[d.name]=d.value}),m.setFormData(i,a);const n=t.querySelector("button[type=submit]"),l=n?n.innerHTML:"";if(n){n.disabled=!0;try{Ee(n,`<span class="loading-spinner"></span> ${o("analyzing")}`)}catch(d){console.error("Button loading state sanitization failed:",d),n.textContent=o("analyzing")||"Analyzing..."}}try{console.log("[Submit] Module:",i),console.log("[Submit] Inputs:",a);let d;switch(i){case"coma":d={ich:{...await Tt(a),module:"Coma"},lvo:null};break;case"limited":d={ich:{...await wt(a),module:"Limited"},lvo:{notPossible:!0}};break;case"full":if(d=await kt(a),console.log("[Submit] Full results:",{ich:!!(d!=null&&d.ich),lvo:!!(d!=null&&d.lvo),ichP:(c=d==null?void 0:d.ich)==null?void 0:c.probability,lvoP:(h=d==null?void 0:d.lvo)==null?void 0:h.probability}),!d||!d.ich)throw new Error("Invalid response structure from Full Stroke API");d.ich&&!d.ich.probability&&d.ich.ich_probability!==void 0&&(d.ich.probability=d.ich.ich_probability,console.log("[Submit] Fixed ICH probability for Full Stroke:",d.ich.probability)),d.ich&&!d.ich.module&&(d.ich.module="Full Stroke"),d.lvo&&!d.lvo.module&&(d.lvo.module="Full Stroke");break;default:throw new Error(`Unknown module: ${i}`)}console.log("[Submit] Setting results in store:",d),m.setResults(d),m.logEvent("models_complete",{module:i,results:d});const u=m.getState();console.log("[Submit] State after setResults:",{hasResults:!!u.results,currentScreen:u.currentScreen}),console.log("[Submit] Navigating to results..."),pe("results"),ht("✅ Results loaded",2e3),setTimeout(()=>{try{const v=m.getState().currentScreen;console.log("[Submit] currentScreen after navigate:",v),v!=="results"&&(m.navigate("results"),ht("🔁 Forced results view",1500))}catch(v){}},0)}catch(d){const u=["localhost","127.0.0.1","0.0.0.0"].includes(window.location.hostname)&&!0;if(i==="full"&&u)try{const w=he.mockApiResponses.full_stroke,_=w.ich_prediction||{},M=w.lvo_prediction||{},$=parseFloat(_.probability)||0,R=parseFloat(M.probability)||0,X={ich:{probability:$>1?$/100:$,drivers:_.drivers||null,confidence:parseFloat(_.confidence)||.85,module:"Full Stroke"},lvo:{probability:R>1?R/100:R,drivers:M.drivers||null,confidence:parseFloat(M.confidence)||.85,module:"Full Stroke"}};m.setResults(X),m.logEvent("models_complete_fallback",{module:i,reason:d.message}),pe("results");return}catch(w){}let v="An error occurred during analysis. Please try again.";if(d instanceof ei&&(v=d.message),zi(e,v),n){n.disabled=!1;try{Ee(n,l)}catch(w){console.error("Button restore sanitization failed:",w),n.textContent="Submit"}}}}function zi(s,e){s.querySelectorAll(".critical-alert").forEach(l=>{var c,h;(h=(c=l.querySelector("h4"))==null?void 0:c.textContent)!=null&&h.includes("Error")&&l.remove()});const t=document.createElement("div");t.className="critical-alert";const i=document.createElement("h4"),r=document.createElement("span");r.className="alert-icon",r.textContent="⚠️",i.appendChild(r),i.appendChild(document.createTextNode(" Error"));const a=document.createElement("p");a.textContent=e,t.appendChild(i),t.appendChild(a);const n=s.querySelector(".container");n?n.prepend(t):s.prepend(t),setTimeout(()=>t.remove(),1e4)}function ht(s,e=2e3){try{const t=document.createElement("div");t.textContent=s,t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),t.style.cssText=`
      position: fixed;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      background: #0066CC;
      color: #fff;
      padding: 10px 14px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10000;
      font-size: 14px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 160ms ease;
    `,document.body.appendChild(t),requestAnimationFrame(()=>{t.style.opacity="1"}),setTimeout(()=>{t.style.opacity="0",setTimeout(()=>t.remove(),200)},e)}catch(t){}}const T={LOW:"low",MEDIUM:"medium",HIGH:"high",CRITICAL:"critical"},E={NETWORK:"network",VALIDATION:"validation",AUTHENTICATION:"authentication",CALCULATION:"calculation",STORAGE:"storage",RENDERING:"rendering",MEDICAL:"medical",SECURITY:"security"};class x extends Error{constructor(e,t,i=E.MEDICAL,r=T.MEDIUM){super(e),this.name="MedicalError",this.code=t,this.category=i,this.severity=r,this.timestamp=new Date().toISOString(),this.context={}}withContext(e){return this.context={...this.context,...e},this}getUserMessage(){switch(this.category){case E.NETWORK:return"Network connection issue. Please check your internet connection and try again.";case E.VALIDATION:return"Please check your input data and try again.";case E.AUTHENTICATION:return"Authentication failed. Please log in again.";case E.CALCULATION:return"Unable to complete calculation. Please verify your input data.";case E.MEDICAL:return"Medical calculation could not be completed. Please verify all clinical data.";default:return"An unexpected error occurred. Please try again."}}}class Bi{constructor(){this.errorQueue=[],this.maxQueueSize=100,this.setupGlobalHandlers()}setupGlobalHandlers(){window.addEventListener("unhandledrejection",e=>{this.handleError(e.reason,E.NETWORK,T.HIGH),e.preventDefault()}),window.addEventListener("error",e=>{this.handleError(e.error,E.RENDERING,T.MEDIUM)})}handleError(e,t=E.NETWORK,i=T.MEDIUM){const r={error:e instanceof Error?e:new Error(String(e)),category:t,severity:i,timestamp:new Date().toISOString(),userAgent:navigator.userAgent.substring(0,100),url:window.location.href};this.errorQueue.push(r),this.errorQueue.length>this.maxQueueSize&&this.errorQueue.shift(),i===T.CRITICAL&&this.handleCriticalError(r)}handleCriticalError(e){e.category===E.MEDICAL&&this.showMedicalAlert(e.error.message)}showMedicalAlert(e){const t=document.createElement("div");t.className="critical-medical-alert",t.style.cssText=`
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #ff4444;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      max-width: 90%;
      text-align: center;
    `,t.textContent=`⚠️ Medical Error: ${e}`,document.body.appendChild(t),setTimeout(()=>{document.body.contains(t)&&document.body.removeChild(t)},1e4)}getErrorSummary(){return{totalErrors:this.errorQueue.length,criticalErrors:this.errorQueue.filter(e=>e.severity===T.CRITICAL).length,recentErrors:this.errorQueue.slice(-10)}}}const Hi=new Bi;async function y(s,e={}){const{category:t=E.NETWORK,severity:i=T.MEDIUM,fallback:r=null,timeout:a=3e4,retries:n=0,context:l={}}=e;for(let c=0;c<=n;c++)try{const h=new Promise((u,v)=>{setTimeout(()=>v(new Error("Operation timeout")),a)});return await Promise.race([s(),h])}catch(h){if(Hi.handleError(h,t,i),c<n){await new Promise(u=>setTimeout(u,1e3*(c+1)));continue}if(r!==null)return typeof r=="function"?r(h):r;throw new x(h.message||"Operation failed",h.code||"UNKNOWN",t,i).withContext(l)}}async function mt(s,e={}){return y(s,{category:E.AUTHENTICATION,severity:T.HIGH,timeout:15e3,fallback:()=>({success:!1,error:!0,message:"Authentication service unavailable"}),...e})}function Vi(s){const e=[],t=[];return!s||typeof s!="object"?(e.push("Patient data must be an object"),{isValid:!1,errors:e,warnings:t}):((typeof s.age!="number"||s.age<0||s.age>120)&&e.push("Age must be a number between 0 and 120"),["male","female","other"].includes(s.gender)||e.push('Gender must be "male", "female", or "other"'),(typeof s.gfap!="number"||s.gfap<29||s.gfap>10001)&&e.push("GFAP must be a number between 29 and 10001 pg/mL"),s.nihss!==void 0&&(typeof s.nihss!="number"||s.nihss<0||s.nihss>42)&&e.push("NIHSS must be a number between 0 and 42"),s.gcs!==void 0&&(typeof s.gcs!="number"||s.gcs<3||s.gcs>15)&&e.push("GCS must be a number between 3 and 15"),s.sbp!==void 0&&(typeof s.sbp!="number"||s.sbp<50||s.sbp>300)&&t.push("Systolic BP should typically be between 50-300 mmHg"),s.dbp!==void 0&&(typeof s.dbp!="number"||s.dbp<30||s.dbp>200)&&t.push("Diastolic BP should typically be between 30-200 mmHg"),{isValid:e.length===0,errors:e,warnings:t})}function Ui(s){const e=[],t=[];return!s||typeof s!="object"?(e.push("ICH risk result must be an object"),{isValid:!1,errors:e,warnings:t}):((typeof s.probability!="number"||s.probability<0||s.probability>1)&&e.push("Probability must be a number between 0 and 1"),(typeof s.percentage!="number"||s.percentage<0||s.percentage>100)&&e.push("Percentage must be a number between 0 and 100"),["low","moderate","high","critical"].includes(s.riskLevel)||e.push('Risk level must be "low", "moderate", "high", or "critical"'),(!s.timestamp||!Date.parse(s.timestamp))&&e.push("Timestamp must be a valid ISO date string"),{isValid:e.length===0,errors:e,warnings:t})}function Gi(s){return Vi(s).isValid}function Wi(s){return Ui(s).isValid}class qi{static ensureType(e,t,i){let r=!1,a=typeof e;switch(t){case"PatientData":r=Gi(e),a="Invalid PatientData";break;case"ICHRiskResult":r=Wi(e),a="Invalid ICHRiskResult";break;case"number":r=typeof e=="number"&&!isNaN(e);break;case"string":r=typeof e=="string";break;case"boolean":r=typeof e=="boolean";break;default:r=typeof e===t}if(!r)throw new TypeError(`Type error in ${i}: expected ${t}, got ${a}. This is a critical error in medical calculations.`)}static ensureRange(e,t,i){this.ensureType(e,"number",i);const[r,a]=t;if(e<r||e>a)throw new RangeError(`Range error in ${i}: value ${e} must be between ${r} and ${a}. This is a critical error in medical calculations.`)}}const te={DEBUG:{level:0,name:"DEBUG",color:"#6366f1"},INFO:{level:1,name:"INFO",color:"#10b981"},WARN:{level:2,name:"WARN",color:"#f59e0b"},ERROR:{level:3,name:"ERROR",color:"#ef4444"},CRITICAL:{level:4,name:"CRITICAL",color:"#dc2626"}},b={AUTHENTICATION:"AUTH",MEDICAL_CALCULATION:"MEDICAL",NETWORK:"NETWORK",PERFORMANCE:"PERF",SECURITY:"SECURITY",USER_INTERACTION:"UI",DATA_VALIDATION:"VALIDATION",AUDIT:"AUDIT",SYSTEM:"SYSTEM",ERROR:"ERROR"};class Ki{constructor(){this.logLevel=this.getLogLevel(),this.sessionId=this.generateSessionId(),this.logBuffer=[],this.maxBufferSize=1e3,this.isProduction=window.location.hostname!=="localhost"&&window.location.hostname!=="127.0.0.1",this.enableConsole=!this.isProduction,this.enableStorage=!0,this.enableNetwork=!1,this.setupErrorHandlers(),this.startPeriodicFlush()}getLogLevel(){try{const e=localStorage.getItem("medicalLogLevel");if(e&&te[e.toUpperCase()])return te[e.toUpperCase()].level}catch(e){}return this.isProduction?te.INFO.level:te.DEBUG.level}generateSessionId(){const e=Date.now().toString(36),t=Math.random().toString(36).substring(2,8);return`sess_${e}_${t}`}setupErrorHandlers(){window.addEventListener("error",e=>{var t;try{this.critical("Unhandled JavaScript Error",{category:b.ERROR,message:e.message,filename:e.filename,lineno:e.lineno,colno:e.colno,stack:(t=e.error)==null?void 0:t.stack})}catch(i){console.error("Logging failed:",i),console.error("Original error:",e.error)}}),window.addEventListener("unhandledrejection",e=>{var t,i;try{this.critical("Unhandled Promise Rejection",{category:b.ERROR,reason:((t=e.reason)==null?void 0:t.message)||String(e.reason)||"Unknown rejection",stack:(i=e.reason)==null?void 0:i.stack})}catch(r){console.error("Logging failed:",r),console.error("Original rejection:",e.reason)}})}createLogEntry(e,t,i={}){var l;const r=i&&typeof i=="object"?i:{},a={timestamp:new Date().toISOString(),level:((l=te[e])==null?void 0:l.name)||e,category:r.category||b.SYSTEM,message:this.sanitizeMessage(t),sessionId:this.sessionId,context:this.sanitizeContext(r),performance:this.getPerformanceMetrics()};(e==="ERROR"||e==="CRITICAL")&&(a.stackTrace=new Error().stack);const n=this.getAnonymizedUserId();return n&&(a.userId=n),a}sanitizeMessage(e){return typeof e!="string"&&(e=String(e)),e.replace(/\b\d{3}-\d{2}-\d{4}\b/g,"***-**-****").replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,"***@***.***").replace(/\b\d{10,}\b/g,"**********").replace(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g,"[NAME]")}sanitizeContext(e){if(!e||typeof e!="object")return{};const t={...e},i=["password","token","sessionToken","authToken","patientName","firstName","lastName","fullName","email","phone","ssn","mrn","dob","dateOfBirth"],r=a=>{if(!a||typeof a!="object")return a;const n=Array.isArray(a)?[]:{};for(const[l,c]of Object.entries(a)){const h=l.toLowerCase();i.some(d=>h.includes(d))?n[l]="[REDACTED]":typeof c=="object"&&c!==null?n[l]=r(c):n[l]=c}return n};return r(t)}getAnonymizedUserId(){try{const e=sessionStorage.getItem("session_hash");if(e)return`user_${e.substring(0,8)}`}catch(e){}return null}getPerformanceMetrics(){var e;try{if("performance"in window){const t=gt.getEntriesByType("navigation")[0];return{memoryUsed:((e=gt.memory)==null?void 0:e.usedJSHeapSize)||0,loadTime:(t==null?void 0:t.loadEventEnd)-(t==null?void 0:t.loadEventStart)||0,domReady:(t==null?void 0:t.domContentLoadedEventEnd)-(t==null?void 0:t.domContentLoadedEventStart)||0}}}catch(t){}return null}log(e,t,i={}){return y(async()=>{if(!e||!t)return;const r=te[e.toUpperCase()];if(!r||r.level<this.logLevel)return;const a=this.createLogEntry(e.toUpperCase(),t,i);this.addToBuffer(a),this.enableConsole&&this.outputToConsole(a),this.enableStorage&&this.storeEntry(a),this.enableNetwork&&await this.sendToLoggingService(a)},{category:E.SYSTEM,context:{operation:"logging",level:e,message:t.substring(0,100)}})}addToBuffer(e){this.logBuffer.push(e),this.logBuffer.length>this.maxBufferSize&&(this.logBuffer=this.logBuffer.slice(-this.maxBufferSize))}outputToConsole(e){const t=te[e.level],r=`color: ${(t==null?void 0:t.color)||"#666666"}; font-weight: bold;`,a=new Date(e.timestamp).toLocaleTimeString();e.level==="ERROR"||e.level==="CRITICAL"||e.level,console.groupCollapsed(`%c[${e.level}] ${a} [${e.category}] ${e.message}`,r),e.context&&Object.keys(e.context).length>0&&console.log("Context:",e.context),e.performance&&console.log("Performance:",e.performance),e.stackTrace&&(e.level==="ERROR"||e.level==="CRITICAL")&&console.log("Stack Trace:",e.stackTrace),console.groupEnd()}storeEntry(e){try{const t=`medicalLog_${e.timestamp}`,i=JSON.stringify(e);sessionStorage.setItem(t,i),this.cleanOldEntries()}catch(t){}}cleanOldEntries(){try{const e=Object.keys(sessionStorage).filter(t=>t.startsWith("medicalLog_")).sort().reverse();e.length>100&&e.slice(100).forEach(t=>{sessionStorage.removeItem(t)})}catch(e){}}async sendToLoggingService(e){return Promise.resolve()}startPeriodicFlush(){setInterval(()=>{this.flushBuffer()},3e4)}flushBuffer(){this.logBuffer.length!==0&&this.info("Log buffer flushed",{category:b.SYSTEM,entriesCount:this.logBuffer.length})}debug(e,t={}){return this.log("DEBUG",e,t)}info(e,t={}){return this.log("INFO",e,t)}warn(e,t={}){return this.log("WARN",e,t)}error(e,t={}){return this.log("ERROR",e,t)}critical(e,t={}){return this.log("CRITICAL",e,t)}medicalCalculation(e,t,i={}){return this.info(`Medical calculation: ${e}`,{category:b.MEDICAL_CALCULATION,operation:e,success:!i.error,...i})}authentication(e,t,i={}){return this.info(`Authentication: ${e}`,{category:b.AUTHENTICATION,action:e,success:t,...i})}userInteraction(e,t={}){return this.debug(`User interaction: ${e}`,{category:b.USER_INTERACTION,action:e,...t})}networkRequest(e,t,i,r={}){const a=i>=400?"ERROR":i>=300?"WARN":"DEBUG";return this.log(a,`Network request: ${t} ${e}`,{category:b.NETWORK,method:t,url:this.sanitizeUrl(e),status:i,...r})}performance(e,t,i={}){return this.debug(`Performance metric: ${e} = ${t}`,{category:b.PERFORMANCE,metric:e,value:t,...i})}auditTrail(e,t={}){return this.info(`Audit: ${e}`,{category:b.AUDIT,event:e,...t})}sanitizeUrl(e){try{const t=new URL(e);return["token","auth","key","secret"].forEach(r=>{t.searchParams.has(r)&&t.searchParams.set(r,"[REDACTED]")}),t.toString()}catch(t){return e}}getLogs(e={}){var r;const t=[...this.logBuffer];try{Object.keys(sessionStorage).filter(n=>n.startsWith("medicalLog_")).sort().forEach(n=>{try{const l=JSON.parse(sessionStorage.getItem(n));l&&!t.find(c=>c.timestamp===l.timestamp)&&t.push(l)}catch(l){}})}catch(a){}let i=t.sort((a,n)=>new Date(n.timestamp)-new Date(a.timestamp));if(e.level){const a=((r=te[e.level.toUpperCase()])==null?void 0:r.level)||0;i=i.filter(n=>{var c;return(((c=te[n.level])==null?void 0:c.level)||0)>=a})}if(e.category&&(i=i.filter(a=>a.category===e.category)),e.since){const a=new Date(e.since);i=i.filter(n=>new Date(n.timestamp)>=a)}return e.limit&&(i=i.slice(0,e.limit)),i}exportLogs(e="json"){const t=this.getLogs();return e==="csv"?this.logsToCSV(t):JSON.stringify(t,null,2)}logsToCSV(e){if(e.length===0)return"";const t=["timestamp","level","category","message","sessionId"],i=e.map(r=>[r.timestamp,r.level,r.category,`"${r.message.replace(/"/g,'""')}"`,r.sessionId]);return[t.join(","),...i.map(r=>r.join(","))].join(`
`)}clearLogs(){this.logBuffer=[];try{Object.keys(sessionStorage).filter(t=>t.startsWith("medicalLog_")).forEach(t=>sessionStorage.removeItem(t))}catch(e){}this.info("Log storage cleared",{category:b.SYSTEM})}}const C=new Ki,{debug:wa,info:Ta,warn:Ca,error:Aa,critical:Ia,medicalCalculation:La,authentication:Ma,userInteraction:Ra,networkRequest:_a,performance:gt,auditTrail:Na}=C;class Yi{constructor(){this.isAuthenticated=!1,this.sessionToken=null,this.sessionExpiry=null,this.lastActivity=Date.now(),this.setupActivityTracking()}async authenticate(e){return mt(async()=>{if(C.info("Authentication attempt started",{category:b.AUTHENTICATION,hasPassword:!!e&&e.length>0,isDevelopment:he.isDevelopment}),qi.ensureType(e,"string","authentication password"),!e||e.trim().length===0)throw C.warn("Authentication failed: empty password",{category:b.AUTHENTICATION}),new x("Password is required","EMPTY_PASSWORD",E.VALIDATION,T.MEDIUM);if(["localhost","127.0.0.1","0.0.0.0"].includes(window.location.hostname)&&!0||he.isDevelopment){C.info("Development mode authentication path",{category:b.AUTHENTICATION});const l=st();if(e.trim()!==l)return await this.delayFailedAttempt(),{success:!1,message:"Invalid credentials",errorCode:"INVALID_CREDENTIALS"};await new Promise(c=>setTimeout(c,300)),this.isAuthenticated=!0,this.sessionToken=he.mockAuthResponse.session_token,this.sessionExpiry=new Date(he.mockAuthResponse.expires_at),this.lastActivity=Date.now();try{this.storeSecureSession()}catch(c){console.warn("Session storage failed:",c.message)}return{success:!0,message:"Authentication successful",sessionDuration:he.mockAuthResponse.session_duration}}const i=["localhost","127.0.0.1","0.0.0.0"].includes(window.location.hostname),r=localStorage.getItem("use_mock_api")!=="false";if(i&&r){if(e.trim()!==st())return await this.delayFailedAttempt(),{success:!1,message:"Invalid credentials",errorCode:"INVALID_CREDENTIALS"};await new Promise(l=>setTimeout(l,200)),this.isAuthenticated=!0,this.sessionToken="local-preview-token-"+Date.now(),this.sessionExpiry=new Date(Date.now()+30*60*1e3),this.lastActivity=Date.now();try{this.storeSecureSession()}catch(l){}return{success:!0,message:"Authentication successful",sessionDuration:1800}}C.debug("Sending authentication request",{category:b.AUTHENTICATION,url:Re.AUTHENTICATE});const a=await fetch(Re.AUTHENTICATE,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"login",password:e.trim()})});if(!a.ok){let l="Authentication failed",c="AUTH_FAILED";throw a.status===429?(l="Too many authentication attempts. Please wait and try again.",c="RATE_LIMITED"):a.status>=500&&(l="Authentication service temporarily unavailable",c="SERVICE_ERROR"),new x(l,c,E.AUTHENTICATION,a.status>=500?T.HIGH:T.MEDIUM).withContext({statusCode:a.status,url:Re.AUTHENTICATE})}const n=await a.json();if(!n||typeof n!="object")throw new x("Invalid response from authentication service","INVALID_RESPONSE",E.AUTHENTICATION,T.HIGH);if(n.success){this.isAuthenticated=!0,this.sessionToken=n.session_token,this.sessionExpiry=n.expires_at?new Date(n.expires_at):null,this.lastActivity=Date.now();try{this.storeSecureSession()}catch(l){console.warn("Session storage failed:",l.message)}return{success:!0,message:"Authentication successful",sessionDuration:n.session_duration}}else throw await this.delayFailedAttempt(),new x(n.message||"Invalid credentials","INVALID_CREDENTIALS",E.AUTHENTICATION,T.MEDIUM).withContext({remainingAttempts:n.rate_limit_remaining,statusCode:a.status})},{timeout:15e3,fallback:t=>{var i;return{success:!1,message:t instanceof x?t.getUserMessage():"Authentication service unavailable. Please try again.",errorCode:t.code||"NETWORK_ERROR",details:t.message,remainingAttempts:(i=t.context)==null?void 0:i.remainingAttempts}},context:{operation:"user_authentication",endpoint:"authenticate"}})}isValidSession(){return this.isAuthenticated?this.sessionExpiry&&new Date>this.sessionExpiry?(this.logout(),!1):!0:this.checkStoredSession()}async validateSessionWithServer(){return this.sessionToken?mt(async()=>{if(["localhost","127.0.0.1","0.0.0.0"].includes(window.location.hostname)&&!0)return this.updateActivity(),!0;const t=await fetch(Re.AUTHENTICATE,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"validate_session",session_token:this.sessionToken})});if(!t.ok){if(t.status===401||t.status===403)return this.logout(),!1;throw new x("Session validation service error","VALIDATION_ERROR",E.AUTHENTICATION,T.MEDIUM).withContext({statusCode:t.status})}const i=await t.json();if(!i||typeof i!="object")throw new x("Invalid response from session validation service","INVALID_RESPONSE",E.AUTHENTICATION,T.MEDIUM);return i.success?(this.updateActivity(),!0):(this.logout(),!1)},{timeout:1e4,fallback:e=>(console.warn("Session validation failed, continuing with local session:",e.message),this.isValidSession()),context:{operation:"session_validation",endpoint:"validate_session"}}):!1}updateActivity(){this.lastActivity=Date.now(),this.storeAuthSession()}async logout(){C.info("User logout initiated",{category:b.AUTHENTICATION}),this.isAuthenticated=!1,this.sessionToken=null,this.sessionExpiry=null;try{await me("auth_session",!0),await me("auth_timestamp",!0),await me("session_token",!0),await me("session_expiry",!0),sessionStorage.removeItem("auth_session"),sessionStorage.removeItem("auth_timestamp"),sessionStorage.removeItem("session_token"),sessionStorage.removeItem("session_expiry"),C.info("Session data cleared during logout",{category:b.SECURITY})}catch(e){C.warn("Failed to clear some session data during logout",{category:b.SECURITY,error:e.message})}}async hashPassword(e){return y(async()=>{if(!e||typeof e!="string")throw new x("Invalid input for password hashing","INVALID_INPUT",E.VALIDATION,T.MEDIUM);if(!crypto||!crypto.subtle)throw new x("Crypto API not available","CRYPTO_UNAVAILABLE",E.SECURITY,T.HIGH);const i=new TextEncoder().encode(e),r=await crypto.subtle.digest("SHA-256",i);return Array.from(new Uint8Array(r)).map(l=>l.toString(16).padStart(2,"0")).join("")},{category:E.SECURITY,severity:T.HIGH,timeout:5e3,fallback:()=>{let t=0;for(let i=0;i<e.length;i++){const r=e.charCodeAt(i);t=(t<<5)-t+r,t=t&t}return Math.abs(t).toString(16)},context:{operation:"password_hashing",inputLength:e?e.length:0}})}storeSecureSession(){return y(async()=>{if(!this.isAuthenticated||!this.sessionToken)throw new x("Cannot store session: not authenticated","NOT_AUTHENTICATED",E.AUTHENTICATION,T.LOW);if(typeof sessionStorage=="undefined")throw new x("Session storage not available","STORAGE_UNAVAILABLE",E.STORAGE,T.MEDIUM);return sessionStorage.setItem("auth_session","verified"),sessionStorage.setItem("auth_timestamp",this.lastActivity.toString()),sessionStorage.setItem("session_token",this.sessionToken),this.sessionExpiry&&sessionStorage.setItem("session_expiry",this.sessionExpiry.toISOString()),!0},{category:E.STORAGE,severity:T.LOW,timeout:1e3,fallback:e=>(console.warn("Failed to store session:",e.message),!1),context:{operation:"store_session",hasToken:!!this.sessionToken,hasExpiry:!!this.sessionExpiry}})}storeAuthSession(){this.storeSecureSession()}checkStoredSession(){try{return y(async()=>{if(typeof sessionStorage=="undefined")throw new x("Session storage not available","STORAGE_UNAVAILABLE",E.STORAGE,T.LOW);const e=await Me("auth_session",!0),t=await Me("auth_timestamp",!0),i=await Me("session_token",!0),r=await Me("session_expiry",!0);if(e==="verified"&&t&&i){if(r){const n=new Date(r);if(new Date>n)return this.logout(),!1;this.sessionExpiry=n}const a=parseInt(t);if(isNaN(a))throw new x("Invalid session timestamp","INVALID_SESSION_DATA",E.STORAGE,T.MEDIUM);return this.isAuthenticated=!0,this.sessionToken=i,this.lastActivity=a,!0}return this.logout(),!1},{category:E.STORAGE,severity:T.LOW,timeout:1e3,fallback:e=>(console.warn("Failed to check stored session:",e.message),this.logout(),!1),context:{operation:"check_stored_session"}})}catch(e){return this.logout(),!1}}setupActivityTracking(){const e=["mousedown","mousemove","keypress","scroll","touchstart"],t=()=>{this.isAuthenticated&&this.updateActivity()};e.forEach(i=>{document.addEventListener(i,t,{passive:!0})})}async delayFailedAttempt(){return y(async()=>new Promise(e=>{setTimeout(e,1e3)}),{category:E.AUTHENTICATION,severity:T.LOW,timeout:2e3,fallback:()=>Promise.resolve(),context:{operation:"auth_delay"}})}getSessionInfo(){if(!this.isAuthenticated)return{authenticated:!1};const e=this.sessionTimeout-(Date.now()-this.lastActivity),t=Math.floor(e/(60*60*1e3)),i=Math.floor(e%(60*60*1e3)/(60*1e3));return{authenticated:!0,timeRemaining:`${t}h ${i}m`,lastActivity:new Date(this.lastActivity).toLocaleTimeString()}}}const O=new Yi;function le(s){const e=[{id:1,label:"Triage"},{id:2,label:"Assessment"},{id:3,label:"Results"}];let t='<div class="progress-indicator">';return e.forEach((i,r)=>{const a=i.id===s,n=i.id<s;t+=`
      <div class="progress-step ${a?"active":""} ${n?"completed":""}">
        ${n?"":i.id}
      </div>
    `,r<e.length-1&&(t+=`<div class="progress-line ${n?"completed":""}"></div>`)}),t+="</div>",t}function pt(){return`
    <div class="container">
      ${le(1)}
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
  `}function ji(){return`
    <div class="container">
      ${le(1)}
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
  `}function Qi(){return`
    <div class="container">
      ${le(2)}
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
            <input type="number" id="gfap_value" name="gfap_value" min="${K.min}" max="${K.max}" step="0.1" required aria-describedby="gfap-help">
            <div id="gfap-help" class="input-help">
              ${o("gfapRange").replace("{min}",K.min).replace("{max}",K.max)}
            </div>
          </div>
        </div>
        <button type="submit" class="primary">${o("analyzeIchRisk")}</button>
        <button type="button" class="secondary" data-action="reset">${o("startOver")}</button>
      </form>
    </div>
  `}function Ji(){return`
    <div class="container">
      ${le(2)}
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
              <input type="number" name="gfap_value" id="gfap_value" min="${K.min}" max="${K.max}" step="0.1" required inputmode="decimal">
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
  `}function Zi(){return`
    <div class="container">
      ${le(2)}
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
              <input type="number" name="gfap_value" id="gfap_value" min="${K.min}" max="${K.max}" step="0.1" required inputmode="decimal">
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
  `}const Xi="modulepreload",es=function(s){return"/0925/"+s},ft={},ie=function(e,t,i){let r=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const n=document.querySelector("meta[property=csp-nonce]"),l=(n==null?void 0:n.nonce)||(n==null?void 0:n.getAttribute("nonce"));r=Promise.allSettled(t.map(c=>{if(c=es(c),c in ft)return;ft[c]=!0;const h=c.endsWith(".css"),d=h?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${d}`))return;const u=document.createElement("link");if(u.rel=h?"stylesheet":Xi,h||(u.as="script"),u.crossOrigin="",u.href=c,l&&u.setAttribute("nonce",l),document.head.appendChild(u),h)return new Promise((v,w)=>{u.addEventListener("load",v),u.addEventListener("error",()=>w(new Error(`Unable to preload CSS for ${c}`)))})}))}function a(n){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=n,window.dispatchEvent(l),!l.defaultPrevented)throw n}return r.then(n=>{for(const l of n||[])l.status==="rejected"&&a(l.reason);return e().catch(a)})};function _t(){return`
    <div class="critical-alert">
      <h4><span class="alert-icon">🚨</span> ${o("criticalAlertTitle")}</h4>
      <p>${o("criticalAlertMessage")}</p>
    </div>
  `}const ts={age_years:"ageLabel",age:"ageLabel",systolic_bp:"systolicLabel",diastolic_bp:"diastolicLabel",systolic_blood_pressure:"systolicLabel",diastolic_blood_pressure:"diastolicLabel",blood_pressure_systolic:"systolicLabel",blood_pressure_diastolic:"diastolicLabel",gfap_value:"gfapLabel",gfap:"gfapLabel",gfap_level:"gfapLabel",fast_ed_score:"fastEdLabel",fast_ed:"fastEdLabel",fast_ed_total:"fastEdLabel",vigilanzminderung:"vigilanzLabel",vigilance_reduction:"vigilanzLabel",reduced_consciousness:"vigilanzLabel",armparese:"armPareseLabel",arm_paresis:"armPareseLabel",arm_weakness:"armPareseLabel",beinparese:"beinPareseLabel",leg_paresis:"beinPareseLabel",leg_weakness:"beinPareseLabel",eye_deviation:"eyeDeviationLabel",blickdeviation:"eyeDeviationLabel",headache:"headacheLabel",kopfschmerzen:"headacheLabel",atrial_fibrillation:"atrialFibLabel",vorhofflimmern:"atrialFibLabel",anticoagulated_noak:"anticoagLabel",anticoagulation:"anticoagLabel",antiplatelets:"antiplateletsLabel",thrombozytenaggregationshemmer:"antiplateletsLabel"},is=[{pattern:/_score$/,replacement:" Score"},{pattern:/_value$/,replacement:" Level"},{pattern:/_bp$/,replacement:" Blood Pressure"},{pattern:/_years?$/,replacement:" (years)"},{pattern:/^ich_/,replacement:"Brain Bleeding "},{pattern:/^lvo_/,replacement:"Large Vessel "},{pattern:/parese$/,replacement:"Weakness"},{pattern:/deviation$/,replacement:"Movement"}];function xe(s){if(!s)return"";const e=ts[s.toLowerCase()];if(e){const i=o(e);if(i&&i!==e)return i}let t=s.toLowerCase();return is.forEach(({pattern:i,replacement:r})=>{t=t.replace(i,r)}),t=t.replace(/_/g," ").replace(/\b\w/g,i=>i.toUpperCase()).trim(),t}function ss(s){return xe(s).replace(/\s*\([^)]*\)\s*/g,"").trim()}function as(s,e=""){return s==null||s===""?"":typeof s=="boolean"?s?"✓":"✗":typeof s=="number"?e.includes("bp")||e.includes("blood_pressure")?`${s} mmHg`:e.includes("gfap")?`${s} pg/mL`:e.includes("age")?`${s} years`:e.includes("score")||Number.isInteger(s)?s.toString():s.toFixed(1):s.toString()}function rs(s,e){if(!(s!=null&&s.drivers)&&!(e!=null&&e.drivers))return"";let t=`
    <div class="drivers-section">
      <div class="drivers-header">
        <h3><span class="driver-header-icon">🎯</span> ${o("riskAnalysis")}</h3>
        <p class="drivers-subtitle">${o("riskAnalysisSubtitle")}</p>
      </div>
      <div class="enhanced-drivers-grid">
  `;return console.log("[Drivers] ICH has drivers:",!!(s!=null&&s.drivers),s==null?void 0:s.drivers),console.log("[Drivers] LVO has drivers:",!!(e!=null&&e.drivers),"notPossible:",e==null?void 0:e.notPossible,e==null?void 0:e.drivers),s!=null&&s.drivers&&(console.log("🧠 Rendering ICH drivers panel"),t+=yt(s.drivers,"ICH","ich",s.probability)),e!=null&&e.drivers&&!e.notPossible&&(console.log("🩸 Rendering LVO drivers panel"),t+=yt(e.drivers,"LVO","lvo",e.probability)),t+=`
      </div>
    </div>
  `,t}function yt(s,e,t,i){if(!s||Object.keys(s).length===0)return`
      <div class="enhanced-drivers-panel ${t}">
        <div class="panel-header">
          <div class="panel-icon ${t}">${t==="ich"?"🩸":"🧠"}</div>
          <div class="panel-title">
            <h4>${e} ${o("riskFactors")}</h4>
            <span class="panel-subtitle">${o("noDriverData")}</span>
          </div>
        </div>
        <p class="no-drivers-message">
          ${o("driverInfoNotAvailable")}
        </p>
      </div>
    `;const r=s;if(r.kind==="unavailable")return`
      <div class="enhanced-drivers-panel ${t}">
        <div class="panel-header">
          <div class="panel-icon ${t}">${t==="ich"?"🩸":"🧠"}</div>
          <div class="panel-title">
            <h4>${e} ${o("riskFactors")}</h4>
            <span class="panel-subtitle">${o("driverAnalysisUnavailable")}</span>
          </div>
        </div>
        <p class="no-drivers-message">
          ${o("driverAnalysisNotAvailable")}
        </p>
      </div>
    `;const a=(r.positive||[]).sort((u,v)=>Math.abs(v.weight)-Math.abs(u.weight)).slice(0,3),n=(r.negative||[]).sort((u,v)=>Math.abs(v.weight)-Math.abs(u.weight)).slice(0,3),l=Math.max(...a.map(u=>Math.abs(u.weight)),...n.map(u=>Math.abs(u.weight)),.01);console.log(`[Drivers] ${t} maxWeight:`,l),console.log(`[Drivers] ${t} positive:`,a.map(u=>`${u.label}: ${u.weight}`)),console.log(`[Drivers] ${t} negative:`,n.map(u=>`${u.label}: ${u.weight}`)),console.log(`[Drivers] ${t} positive weights:`,a.map(u=>Math.abs(u.weight))),console.log(`[Drivers] ${t} negative weights:`,n.map(u=>Math.abs(u.weight)));let c=`
    <div class="enhanced-drivers-panel ${t}">
      <div class="panel-header">
        <div class="panel-icon ${t}">${t==="ich"?"🩸":"🧠"}</div>
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
  `;const h=a.reduce((u,v)=>u+Math.abs(v.weight),0);a.length>0?a.forEach((u,v)=>{const w=h>0?Math.abs(u.weight)/h*100:0,_=Math.abs(u.weight)/l*100;console.log(`[Drivers] ${t} positive driver "${u.label}": weight=${Math.abs(u.weight)}, relativeImportance=${w.toFixed(1)}%, barWidth=${_}%`);const M=xe(u.label);c+=`
        <div class="compact-driver-item">
          <div class="compact-driver-label">${M}</div>
          <div class="compact-driver-bar positive" style="width: ${_}%">
            <span class="compact-driver-value">+${w.toFixed(0)}%</span>
          </div>
        </div>
      `}):c+=`<div class="no-factors">${o("noPositiveFactors")}</div>`,c+=`
          </div>
        </div>
        
        <div class="drivers-column negative-column">
          <div class="column-header">
            <span class="column-icon">↓</span>
            <span class="column-title">${o("decreaseRisk")}</span>
          </div>
          <div class="compact-drivers">
  `;const d=n.reduce((u,v)=>u+Math.abs(v.weight),0);return n.length>0?n.forEach((u,v)=>{const w=d>0?Math.abs(u.weight)/d*100:0,_=Math.abs(u.weight)/l*100;console.log(`[Drivers] ${t} negative driver "${u.label}": weight=${Math.abs(u.weight)}, relativeImportance=${w.toFixed(1)}%, barWidth=${_}%`);const M=xe(u.label);c+=`
        <div class="compact-driver-item">
          <div class="compact-driver-label">${M}</div>
          <div class="compact-driver-bar negative" style="width: ${_}%">
            <span class="compact-driver-value">-${w.toFixed(0)}%</span>
          </div>
        </div>
      `}):c+=`<div class="no-factors">${o("noNegativeFactors")}</div>`,c+=`
          </div>
        </div>
      </div>
    </div>
  `,c}const ns={bayern:{neurosurgicalCenters:[{id:"BY-NS-001",name:"LMU Klinikum München - Großhadern",address:"Marchioninistraße 15, 81377 München",coordinates:{lat:48.1106,lng:11.4684},phone:"+49 89 4400-0",emergency:"+49 89 4400-73331",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1440,network:"TEMPiS"},{id:"BY-NS-002",name:"Klinikum rechts der Isar München (TUM)",address:"Ismaninger Str. 22, 81675 München",coordinates:{lat:48.1497,lng:11.6052},phone:"+49 89 4140-0",emergency:"+49 89 4140-2249",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1161,network:"TEMPiS"},{id:"BY-NS-003",name:"Städtisches Klinikum München Schwabing",address:"Kölner Platz 1, 80804 München",coordinates:{lat:48.1732,lng:11.5755},phone:"+49 89 3068-0",emergency:"+49 89 3068-2050",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:648,network:"TEMPiS"},{id:"BY-NS-004",name:"Städtisches Klinikum München Bogenhausen",address:"Englschalkinger Str. 77, 81925 München",coordinates:{lat:48.1614,lng:11.6254},phone:"+49 89 9270-0",emergency:"+49 89 9270-2050",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:689,network:"TEMPiS"},{id:"BY-NS-005",name:"Universitätsklinikum Erlangen",address:"Maximiliansplatz 2, 91054 Erlangen",coordinates:{lat:49.5982,lng:11.0037},phone:"+49 9131 85-0",emergency:"+49 9131 85-39003",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1371,network:"TEMPiS"},{id:"BY-NS-006",name:"Universitätsklinikum Regensburg",address:"Franz-Josef-Strauß-Allee 11, 93053 Regensburg",coordinates:{lat:49.0134,lng:12.0991},phone:"+49 941 944-0",emergency:"+49 941 944-7501",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1042,network:"TEMPiS"},{id:"BY-NS-007",name:"Universitätsklinikum Würzburg",address:"Oberdürrbacher Str. 6, 97080 Würzburg",coordinates:{lat:49.784,lng:9.9721},phone:"+49 931 201-0",emergency:"+49 931 201-24444",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1264,network:"TEMPiS"},{id:"BY-NS-008",name:"Klinikum Nürnberg Nord",address:"Prof.-Ernst-Nathan-Str. 1, 90419 Nürnberg",coordinates:{lat:49.4521,lng:11.0767},phone:"+49 911 398-0",emergency:"+49 911 398-2369",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1368,network:"TEMPiS"},{id:"BY-NS-009",name:"Universitätsklinikum Augsburg",address:"Stenglinstr. 2, 86156 Augsburg",coordinates:{lat:48.3668,lng:10.9093},phone:"+49 821 400-01",emergency:"+49 821 400-2356",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1740,network:"TEMPiS"},{id:"BY-NS-010",name:"Klinikum Aschaffenburg-Alzenau",address:"Am Hasenkopf 1, 63739 Aschaffenburg",coordinates:{lat:49.9737,lng:9.157},phone:"+49 6021 32-0",emergency:"+49 6021 32-2800",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:40,network:"TRANSIT"},{id:"BY-NS-011",name:"Klinikum Landshut",address:"Robert-Koch-Str. 1, 84034 Landshut",coordinates:{lat:48.5665,lng:12.1512},phone:"+49 871 698-0",emergency:"+49 871 698-3333",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:505,network:"TEMPiS"},{id:"BY-NS-012",name:"Klinikum Coburg",address:"Ketschendorfer Str. 33, 96450 Coburg",coordinates:{lat:50.2596,lng:10.9644},phone:"+49 9561 22-0",emergency:"+49 9561 22-6800",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:547,network:"STENO"},{id:"BY-NS-013",name:"Klinikum Passau",address:"Bischof-Pilgrim-Str. 1, 94032 Passau",coordinates:{lat:48.5665,lng:13.4777},phone:"+49 851 5300-0",emergency:"+49 851 5300-2222",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:696,network:"TEMPiS"}],comprehensiveStrokeCenters:[{id:"BY-CS-001",name:"Klinikum Bamberg",address:"Buger Str. 80, 96049 Bamberg",coordinates:{lat:49.8988,lng:10.9027},phone:"+49 951 503-0",emergency:"+49 951 503-11101",thrombectomy:!0,thrombolysis:!0,beds:630,network:"TEMPiS"},{id:"BY-CS-002",name:"Klinikum Bayreuth",address:"Preuschwitzer Str. 101, 95445 Bayreuth",coordinates:{lat:49.9459,lng:11.5779},phone:"+49 921 400-0",emergency:"+49 921 400-5401",thrombectomy:!0,thrombolysis:!0,beds:848,network:"TEMPiS"},{id:"BY-CS-003",name:"Klinikum Coburg",address:"Ketschendorfer Str. 33, 96450 Coburg",coordinates:{lat:50.2596,lng:10.9685},phone:"+49 9561 22-0",emergency:"+49 9561 22-6300",thrombectomy:!0,thrombolysis:!0,beds:522,network:"TEMPiS"}],regionalStrokeUnits:[{id:"BY-RSU-001",name:"Goldberg-Klinik Kelheim",address:"Traubenweg 3, 93309 Kelheim",coordinates:{lat:48.9166,lng:11.8742},phone:"+49 9441 702-0",emergency:"+49 9441 702-6800",thrombolysis:!0,beds:200,network:"TEMPiS"},{id:"BY-RSU-002",name:"DONAUISAR Klinikum Deggendorf",address:"Perlasberger Str. 41, 94469 Deggendorf",coordinates:{lat:48.8372,lng:12.9619},phone:"+49 991 380-0",emergency:"+49 991 380-2201",thrombolysis:!0,beds:450,network:"TEMPiS"},{id:"BY-RSU-003",name:"Klinikum St. Elisabeth Straubing",address:"St.-Elisabeth-Str. 23, 94315 Straubing",coordinates:{lat:48.8742,lng:12.5733},phone:"+49 9421 710-0",emergency:"+49 9421 710-2000",thrombolysis:!0,beds:580,network:"TEMPiS"},{id:"BY-RSU-004",name:"Klinikum Freising",address:"Mainburger Str. 29, 85356 Freising",coordinates:{lat:48.4142,lng:11.7461},phone:"+49 8161 24-0",emergency:"+49 8161 24-2800",thrombolysis:!0,beds:380,network:"TEMPiS"},{id:"BY-RSU-005",name:"Klinikum Landkreis Erding",address:"Bajuwarenstr. 5, 85435 Erding",coordinates:{lat:48.3061,lng:11.9067},phone:"+49 8122 59-0",emergency:"+49 8122 59-2201",thrombolysis:!0,beds:350,network:"TEMPiS"},{id:"BY-RSU-006",name:"Helios Amper-Klinikum Dachau",address:"Krankenhausstr. 15, 85221 Dachau",coordinates:{lat:48.2599,lng:11.4342},phone:"+49 8131 76-0",emergency:"+49 8131 76-2201",thrombolysis:!0,beds:480,network:"TEMPiS"},{id:"BY-RSU-007",name:"Klinikum Fürstenfeldbruck",address:"Dachauer Str. 33, 82256 Fürstenfeldbruck",coordinates:{lat:48.1772,lng:11.2578},phone:"+49 8141 99-0",emergency:"+49 8141 99-2201",thrombolysis:!0,beds:420,network:"TEMPiS"},{id:"BY-RSU-008",name:"Klinikum Ingolstadt",address:"Krumenauerstraße 25, 85049 Ingolstadt",coordinates:{lat:48.7665,lng:11.4364},phone:"+49 841 880-0",emergency:"+49 841 880-2201",thrombolysis:!0,beds:665,network:"TEMPiS"},{id:"BY-RSU-009",name:"Klinikum Passau",address:"Bischof-Pilgrim-Str. 1, 94032 Passau",coordinates:{lat:48.5665,lng:13.4513},phone:"+49 851 5300-0",emergency:"+49 851 5300-2100",thrombolysis:!0,beds:540,network:"TEMPiS"},{id:"BY-RSU-010",name:"Klinikum Landshut",address:"Robert-Koch-Str. 1, 84034 Landshut",coordinates:{lat:48.5436,lng:12.1619},phone:"+49 871 698-0",emergency:"+49 871 698-3333",thrombolysis:!0,beds:790,network:"TEMPiS"},{id:"BY-RSU-011",name:"RoMed Klinikum Rosenheim",address:"Pettenkoferstr. 10, 83022 Rosenheim",coordinates:{lat:47.8567,lng:12.1265},phone:"+49 8031 365-0",emergency:"+49 8031 365-3711",thrombolysis:!0,beds:870,network:"TEMPiS"},{id:"BY-RSU-012",name:"Klinikum Memmingen",address:"Bismarckstr. 23, 87700 Memmingen",coordinates:{lat:47.9833,lng:10.1833},phone:"+49 8331 70-0",emergency:"+49 8331 70-2500",thrombolysis:!0,beds:520,network:"TEMPiS"},{id:"BY-RSU-013",name:"Klinikum Kempten-Oberallgäu",address:"Robert-Weixler-Str. 50, 87439 Kempten",coordinates:{lat:47.7261,lng:10.3097},phone:"+49 831 530-0",emergency:"+49 831 530-2201",thrombolysis:!0,beds:650,network:"TEMPiS"},{id:"BY-RSU-014",name:"Klinikum Aschaffenburg-Alzenau",address:"Am Hasenkopf 1, 63739 Aschaffenburg",coordinates:{lat:49.9747,lng:9.1581},phone:"+49 6021 32-0",emergency:"+49 6021 32-2700",thrombolysis:!0,beds:590,network:"TEMPiS"}],thrombolysisHospitals:[{id:"BY-TH-001",name:"Krankenhaus Vilsbiburg",address:"Sonnenstraße 10, 84137 Vilsbiburg",coordinates:{lat:48.6333,lng:12.2833},phone:"+49 8741 60-0",thrombolysis:!0,beds:180},{id:"BY-TH-002",name:"Krankenhaus Eggenfelden",address:"Pfarrkirchener Str. 5, 84307 Eggenfelden",coordinates:{lat:48.4,lng:12.7667},phone:"+49 8721 98-0",thrombolysis:!0,beds:220}]},badenWuerttemberg:{neurosurgicalCenters:[{id:"BW-NS-001",name:"Universitätsklinikum Freiburg",address:"Hugstetter Str. 55, 79106 Freiburg",coordinates:{lat:48.0025,lng:7.8347},phone:"+49 761 270-0",emergency:"+49 761 270-34010",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1600,network:"FAST"},{id:"BW-NS-002",name:"Universitätsklinikum Heidelberg",address:"Im Neuenheimer Feld 400, 69120 Heidelberg",coordinates:{lat:49.4178,lng:8.6706},phone:"+49 6221 56-0",emergency:"+49 6221 56-36643",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1621,network:"FAST"},{id:"BW-NS-003",name:"Universitätsklinikum Tübingen",address:"Geissweg 3, 72076 Tübingen",coordinates:{lat:48.5378,lng:9.0538},phone:"+49 7071 29-0",emergency:"+49 7071 29-82211",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1550,network:"FAST"},{id:"BW-NS-004",name:"Universitätsklinikum Ulm",address:"Albert-Einstein-Allee 23, 89081 Ulm",coordinates:{lat:48.4196,lng:9.9592},phone:"+49 731 500-0",emergency:"+49 731 500-63001",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1264,network:"FAST"},{id:"BW-NS-005",name:"Klinikum Stuttgart - Katharinenhospital",address:"Kriegsbergstraße 60, 70174 Stuttgart",coordinates:{lat:48.7784,lng:9.1682},phone:"+49 711 278-0",emergency:"+49 711 278-32001",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:950,network:"FAST"},{id:"BW-NS-006",name:"Städtisches Klinikum Karlsruhe",address:"Moltkestraße 90, 76133 Karlsruhe",coordinates:{lat:49.0047,lng:8.3858},phone:"+49 721 974-0",emergency:"+49 721 974-2301",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1570,network:"FAST"},{id:"BW-NS-007",name:"Klinikum Ludwigsburg",address:"Posilipostraße 4, 71640 Ludwigsburg",coordinates:{lat:48.8901,lng:9.1953},phone:"+49 7141 99-0",emergency:"+49 7141 99-67201",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:720,network:"FAST"}],comprehensiveStrokeCenters:[{id:"BW-CS-001",name:"Universitätsmedizin Mannheim",address:"Theodor-Kutzer-Ufer 1-3, 68167 Mannheim",coordinates:{lat:49.4828,lng:8.4664},phone:"+49 621 383-0",emergency:"+49 621 383-2251",thrombectomy:!0,thrombolysis:!0,beds:1400,network:"FAST"}],regionalStrokeUnits:[{id:"BW-RSU-001",name:"Robert-Bosch-Krankenhaus Stuttgart",address:"Auerbachstraße 110, 70376 Stuttgart",coordinates:{lat:48.7447,lng:9.2294},phone:"+49 711 8101-0",emergency:"+49 711 8101-3456",thrombolysis:!0,beds:850,network:"FAST"}],thrombolysisHospitals:[]},nordrheinWestfalen:{neurosurgicalCenters:[{id:"NRW-NS-001",name:"Universitätsklinikum Düsseldorf",address:"Moorenstraße 5, 40225 Düsseldorf",coordinates:{lat:51.1906,lng:6.8064},phone:"+49 211 81-0",emergency:"+49 211 81-17700",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1300,network:"NEVANO+"},{id:"NRW-NS-002",name:"Universitätsklinikum Köln",address:"Kerpener Str. 62, 50937 Köln",coordinates:{lat:50.9253,lng:6.9187},phone:"+49 221 478-0",emergency:"+49 221 478-32500",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1500,network:"NEVANO+"},{id:"NRW-NS-003",name:"Universitätsklinikum Essen",address:"Hufelandstraße 55, 45147 Essen",coordinates:{lat:51.4285,lng:7.0073},phone:"+49 201 723-0",emergency:"+49 201 723-84444",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1350,network:"NEVANO+"},{id:"NRW-NS-004",name:"Universitätsklinikum Münster",address:"Albert-Schweitzer-Campus 1, 48149 Münster",coordinates:{lat:51.9607,lng:7.6261},phone:"+49 251 83-0",emergency:"+49 251 83-47255",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1513,network:"NEVANO+"},{id:"NRW-NS-005",name:"Universitätsklinikum Bonn",address:"Venusberg-Campus 1, 53127 Bonn",coordinates:{lat:50.6916,lng:7.1127},phone:"+49 228 287-0",emergency:"+49 228 287-15107",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1200,network:"NEVANO+"},{id:"NRW-NS-006",name:"Klinikum Dortmund",address:"Beurhausstraße 40, 44137 Dortmund",coordinates:{lat:51.5036,lng:7.4663},phone:"+49 231 953-0",emergency:"+49 231 953-20050",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1200,network:"NVNR"},{id:"NRW-NS-007",name:"Rhein-Maas Klinikum Würselen",address:"Mauerfeldstraße 25, 52146 Würselen",coordinates:{lat:50.8178,lng:6.1264},phone:"+49 2405 62-0",emergency:"+49 2405 62-2222",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:420,network:"NEVANO+"}],comprehensiveStrokeCenters:[{id:"NRW-CS-001",name:"Universitätsklinikum Aachen",address:"Pauwelsstraße 30, 52074 Aachen",coordinates:{lat:50.778,lng:6.0614},phone:"+49 241 80-0",emergency:"+49 241 80-89611",thrombectomy:!0,thrombolysis:!0,beds:1400,network:"NEVANO+"}],regionalStrokeUnits:[{id:"NRW-RSU-001",name:"Helios Universitätsklinikum Wuppertal",address:"Heusnerstraße 40, 42283 Wuppertal",coordinates:{lat:51.2467,lng:7.1703},phone:"+49 202 896-0",emergency:"+49 202 896-2180",thrombolysis:!0,beds:1050,network:"NEVANO+"}],thrombolysisHospitals:[{id:"NRW-TH-009",name:"Elisabeth-Krankenhaus Essen",address:"Klara-Kopp-Weg 1, 45138 Essen",coordinates:{lat:51.4495,lng:7.0137},phone:"+49 201 897-0",thrombolysis:!0,beds:583},{id:"NRW-TH-010",name:"Klinikum Oberberg Gummersbach",address:"Wilhelm-Breckow-Allee 20, 51643 Gummersbach",coordinates:{lat:51.0277,lng:7.5694},phone:"+49 2261 17-0",thrombolysis:!0,beds:431},{id:"NRW-TH-011",name:"St. Vincenz-Krankenhaus Limburg",address:"Auf dem Schafsberg, 65549 Limburg",coordinates:{lat:50.3856,lng:8.0584},phone:"+49 6431 292-0",thrombolysis:!0,beds:452},{id:"NRW-TH-012",name:"Klinikum Lüdenscheid",address:"Paulmannshöher Straße 14, 58515 Lüdenscheid",coordinates:{lat:51.2186,lng:7.6298},phone:"+49 2351 46-0",thrombolysis:!0,beds:869}]}},Pa={routePatient(s){const{location:e,state:t,ichProbability:i,timeFromOnset:r,clinicalFactors:a}=s,n=t||this.detectState(e),l=ns[n];if(i>=.5){const h=this.findNearest(e,l.neurosurgicalCenters);if(!h)throw new Error(`No neurosurgical centers available in ${n}`);return{category:"NEUROSURGICAL_CENTER",destination:h,urgency:"IMMEDIATE",reasoning:"High bleeding probability (≥50%) - neurosurgical evaluation required",preAlert:"Activate neurosurgery team",bypassLocal:!0,threshold:"≥50%",state:n}}if(i>=.3){const h=[...l.neurosurgicalCenters,...l.comprehensiveStrokeCenters];return{category:"COMPREHENSIVE_CENTER",destination:this.findNearest(e,h),urgency:"URGENT",reasoning:"Intermediate bleeding risk (30-50%) - CT and possible intervention",preAlert:"Prepare for possible neurosurgical consultation",transferPlan:this.findNearest(e,l.neurosurgicalCenters),threshold:"30-50%",state:n}}if(r&&r<=270){const h=[...l.neurosurgicalCenters,...l.comprehensiveStrokeCenters,...l.regionalStrokeUnits,...l.thrombolysisHospitals];return{category:"THROMBOLYSIS_CAPABLE",destination:this.findNearest(e,h),urgency:"TIME_CRITICAL",reasoning:"Low bleeding risk (<30%), within tPA window - nearest thrombolysis",preAlert:"Prepare for thrombolysis protocol",bypassLocal:!1,threshold:"<30%",timeWindow:"≤4.5h",state:n}}const c=[...l.neurosurgicalCenters,...l.comprehensiveStrokeCenters,...l.regionalStrokeUnits];return{category:"STROKE_UNIT",destination:this.findNearest(e,c),urgency:"STANDARD",reasoning:r>270?"Low bleeding risk, outside tPA window - standard stroke evaluation":"Low bleeding risk - standard stroke evaluation",preAlert:"Standard stroke protocol",bypassLocal:!1,threshold:"<30%",timeWindow:r?">4.5h":"unknown",state:n}},detectState(s){return s.lat>=47.5&&s.lat<=49.8&&s.lng>=7.5&&s.lng<=10.2?"badenWuerttemberg":s.lat>=50.3&&s.lat<=52.5&&s.lng>=5.9&&s.lng<=9.5?"nordrheinWestfalen":s.lat>=47.2&&s.lat<=50.6&&s.lng>=10.2&&s.lng<=13.8?"bayern":this.findNearestState(s)},findNearestState(s){const e={bayern:{lat:49,lng:11.5},badenWuerttemberg:{lat:48.5,lng:9},nordrheinWestfalen:{lat:51.5,lng:7.5}};let t="bayern",i=1/0;for(const[r,a]of Object.entries(e)){const n=this.calculateDistance(s,a);n<i&&(i=n,t=r)}return t},findNearest(s,e){return!e||e.length===0?null:e.map(t=>!t.coordinates||typeof t.coordinates.lat!="number"?null:{...t,distance:this.calculateDistance(s,t.coordinates)}).filter(t=>t!==null).sort((t,i)=>t.distance-i.distance)[0]},calculateDistance(s,e){const i=this.toRad(e.lat-s.lat),r=this.toRad(e.lng-s.lng),a=Math.sin(i/2)*Math.sin(i/2)+Math.cos(this.toRad(s.lat))*Math.cos(this.toRad(e.lat))*Math.sin(r/2)*Math.sin(r/2);return 6371*(2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a)))},toRad(s){return s*(Math.PI/180)}};function Nt(s,e,t,i){const a=_e(t-s),n=_e(i-e),l=Math.sin(a/2)*Math.sin(a/2)+Math.cos(_e(s))*Math.cos(_e(t))*Math.sin(n/2)*Math.sin(n/2);return 6371*(2*Math.atan2(Math.sqrt(l),Math.sqrt(1-l)))}function _e(s){return s*(Math.PI/180)}async function os(s,e,t,i,r="driving-car"){try{const a=`https://api.openrouteservice.org/v2/directions/${r}`,l=await fetch(a,{method:"POST",headers:{Accept:"application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",Authorization:"5b3ce3597851110001cf624868c4c27b63ae476c9c26c8bffbc35688","Content-Type":"application/json; charset=utf-8"},body:JSON.stringify({coordinates:[[e,s],[i,t]],radiuses:[1e3,1e3],format:"json"})});if(!l.ok)throw new Error(`Routing API error: ${l.status}`);const c=await l.json();if(c.routes&&c.routes.length>0){const h=c.routes[0];return{duration:Math.round(h.summary.duration/60),distance:Math.round(h.summary.distance/1e3),source:"routing"}}throw new Error("No route found")}catch(a){const n=Nt(s,e,t,i);return{duration:Math.round(n/.8),distance:Math.round(n),source:"estimated"}}}async function Da(s,e,t,i){try{const r=await os(s,e,t,i,"driving-car");return{duration:Math.round(r.duration*.75),distance:r.distance,source:r.source==="routing"?"emergency-routing":"emergency-estimated"}}catch(r){const a=Nt(s,e,t,i);return{duration:Math.round(a/1.2),distance:Math.round(a),source:"emergency-estimated"}}}function ls(s,e){const t=Number(s),i=Mt[e];return t>=i.high?"🔴 HIGH RISK":t>=i.medium?"🟡 MEDIUM RISK":"🟢 LOW RISK"}function Pt(){const s=m.getState(),{formData:e}=s;if(!e||Object.keys(e).length===0)return"";let t="";return Object.entries(e).forEach(([i,r])=>{if(r&&Object.keys(r).length>0){const a=o(`${i}ModuleTitle`)||i.charAt(0).toUpperCase()+i.slice(1);let n="";Object.entries(r).forEach(([l,c])=>{if(c===""||c===null||c===void 0)return;const h=ss(l),d=as(c,l);n+=`
          <div class="summary-item">
            <span class="summary-label">${h}:</span>
            <span class="summary-value">${d}</span>
          </div>
        `}),n&&(t+=`
          <div class="summary-module">
            <h4>${a}</h4>
            <div class="summary-items">
              ${n}
            </div>
          </div>
        `)}}),t?`
    <div class="input-summary">
      <h3>📋 ${o("inputSummaryTitle")}</h3>
      <p class="summary-subtitle">${o("inputSummarySubtitle")}</p>
      <div class="summary-content">
        ${t}
      </div>
    </div>
  `:""}function Ke(s,e,t){if(!e)return console.log(`[RiskCard] No data for ${s}`),"";const i=Math.round((e.probability||0)*100);console.log(`[RiskCard] ${s} - probability: ${e.probability}, percent: ${i}%`);const r=ls(i,s),a=i>70,n=i>Mt[s].high,l={ich:"🩸",lvo:"🧠"},c={ich:o("ichProbability"),lvo:o("lvoProbability")},h=a?"critical":n?"high":"normal";return`
    <div class="enhanced-risk-card ${s} ${h}">
      <div class="risk-header">
        <div class="risk-icon">${l[s]}</div>
        <div class="risk-title">
          <h3>${c[s]}</h3>
        </div>
      </div>
      
      <div class="risk-probability">
        <div class="circles-container">
          <div class="rings-row">
            <div class="circle-item">
              <div class="probability-circle" data-react-ring data-percent="${i}" data-level="${h}">
                <svg viewBox="0 0 120 120" class="probability-svg">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="8"/>
                  <circle cx="60" cy="60" r="50" fill="none"
                    stroke="${h==="critical"?"#ff4444":h==="high"?"#ff8800":"#0066cc"}"
                    stroke-width="8"
                    stroke-dasharray="${Math.PI*100}"
                    stroke-dashoffset="${Math.PI*100*(1-i/100)}"
                    stroke-linecap="round"
                    transform="rotate(-90 60 60)"/>
                  <text x="60" y="60" text-anchor="middle" dominant-baseline="middle"
                    class="probability-text" fill="white" font-size="20" font-weight="bold">
                    ${i}%
                  </text>
                </svg>
              </div>
              <div class="circle-label">${s==="ich"?"ICH Risk":"LVO Risk"}</div>
            </div>
          </div>
          <div class="risk-level ${h}">${r}</div>
        </div>
        
        <div class="risk-assessment"></div>
      </div>
    </div>
  `}function cs(s){const e=s.gfap_value||Ye();if(!e||e<=0)return"";const t=Ct(e);return`
    <div class="volume-display-container">
      ${ni(t)}
    </div>
  `}function Ye(){var t;const s=m.getState(),{formData:e}=s;for(const i of["coma","limited","full"])if((t=e[i])!=null&&t.gfap_value)return parseFloat(e[i].gfap_value);return 0}function ds(s,e){var t;try{if(!s)return console.error("renderResults: No results data provided"),`
        <div class="container">
          <div class="error-message">
            <h2>No Results Available</h2>
            <p>Please complete an assessment first.</p>
            <button class="primary" onclick="window.location.reload()">Start Over</button>
          </div>
        </div>
      `;const{ich:i,lvo:r}=s,a=fs(i),n=a!=="coma"?gs(s):null;n&&ke(a)&&ii(i,n,Oe());const l=(i==null?void 0:i.module)==="Limited"||(i==null?void 0:i.module)==="Coma"||(r==null?void 0:r.notPossible)===!0,c=(i==null?void 0:i.module)==="Full Stroke"||((t=i==null?void 0:i.module)==null?void 0:t.includes("Full"));let h;return console.log("[Results] ICH data:",i),console.log("[Results] LVO data:",r),console.log("[Results] ICH module:",i==null?void 0:i.module),console.log("[Results] isLimitedOrComa:",l),console.log("[Results] isFullModule:",c),l?h=us(i,s,e,n,a):h=hs(i,r,s,e,n,a),setTimeout(async()=>{console.log("[Results] Initializing volume animations..."),ri();try{const{mountIslands:d}=await ie(async()=>{const{mountIslands:u}=await Promise.resolve().then(()=>Vs);return{mountIslands:u}},void 0);d()}catch(d){}},100),h}catch(i){return console.error("Error in renderResults:",i),`
      <div class="container">
        <div class="error-message">
          <h2>Error Displaying Results</h2>
          <p>There was an error displaying the results. Error: ${i.message}</p>
          <button class="primary" onclick="window.location.reload()">Start Over</button>
        </div>
      </div>
    `}}function us(s,e,t,i,r){const a=s&&s.probability>.6?_t():"",n=Math.round(((s==null?void 0:s.probability)||0)*100),l=Lt(),c=Pt(),h=ke(r)?At():"",d=i&&ke(r)?It(s,i,Oe()):"",u=(s==null?void 0:s.module)==="Coma"?ps(s.probability):"",v=(s==null?void 0:s.module)!=="Coma"?Ot(s.probability):"";return`
    <div class="container">
      ${le(3)}
      <h2>${o("bleedingRiskAssessment")||"Blutungsrisiko-Bewertung / Bleeding Risk Assessment"}</h2>
      ${a}
      
      <!-- Single ICH Risk Card -->
      <div class="risk-results-single">
        ${Ke("ich",s)}
      </div>

      ${(s==null?void 0:s.module)==="Coma"&&n>=50?`
      <!-- ICH Volume Card (Coma only) -->
      <div class="risk-results-single">
        ${$t(s)}
      </div>
      `:""}
      
      <!-- Alternative Diagnoses for Coma Module -->
      ${u}
      
      <!-- Differential Diagnoses for Stroke Modules -->
      ${v}
      
      <!-- Research Model Comparison (hidden unless research mode) -->
      ${d}
      
      <!-- ICH Drivers Only (not shown for Coma module) -->
      ${(s==null?void 0:s.module)!=="Coma"?`
        <div class="enhanced-drivers-section">
          <h3>${o("riskFactorsTitle")||"Hauptrisikofaktoren / Main Risk Factors"}</h3>
          ${Dt(s)}
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
          ${l}
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
      
      ${xt(s)}
      ${h}
    </div>
  `}function hs(s,e,t,i,r,a){var j,de;const n=Math.round(((s==null?void 0:s.probability)||0)*100),l=Math.round(((e==null?void 0:e.probability)||0)*100);console.log("[FullModuleResults] ICH probability:",s==null?void 0:s.probability,"-> %:",n),console.log("[FullModuleResults] LVO probability:",e==null?void 0:e.probability,"-> %:",l);const c=s&&s.probability>.6?_t():"",h=Lt(),d=Pt(),u=ke(a)?At():"",v=r&&ke(a)?It(s,r,Oe()):"",w=m.getState(),_=parseInt((de=(j=w.formData)==null?void 0:j.full)==null?void 0:de.fast_ed_score)||0,M=a==="full"||(s==null?void 0:s.module)==="Full",$=e&&typeof e.probability=="number"&&!e.notPossible,R=M&&_>3&&$,X=n>=50,G=l/Math.max(n,.5),ce=G>=.6&&G<=1.7,W=M&&n>=50&&l>=50&&!ce,F=M&&n>=30&&l>=30;let U=1;R&&U++,X&&U++;const q=U===1?"risk-results-single":U===2?"risk-results-dual":"risk-results-triple",Te=Ot(s.probability);return`
    <div class="container">
      ${le(3)}
      <h2>${o("resultsTitle")}</h2>
      ${c}
      
      <!-- Risk Assessment Display -->
      <div class="${q}">
        ${Ke("ich",s)}
        ${R?Ke("lvo",e):""}
        ${X?$t(s):""}
      </div>
      
      <!-- Treatment Decision Gauge (when strong signal) -->
      ${F?ys(n,l):""}
      ${!F&&W?ms(n,l,G):""}
      
      <!-- Differential Diagnoses for Stroke Modules -->
      ${Te}
      
      <!-- Research Model Comparison (hidden unless research mode) -->
      ${v}
      
      <!-- Risk Factor Drivers -->
      <div class="enhanced-drivers-section">
        <h3>${o("riskFactorsTitle")||"Risikofaktoren / Risk Factors"}</h3>
        ${R?rs(s,e):Dt(s)}
      </div>
      
      <!-- Collapsible Additional Information -->
      <div class="additional-info-section">
        <button class="info-toggle" data-target="input-summary">
          <span class="toggle-icon">📋</span>
          <span class="toggle-text">${o("inputSummaryTitle")}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="input-summary" style="display: none;">
          ${d}
        </div>
        
        <button class="info-toggle" data-target="stroke-centers">
          <span class="toggle-icon">🏥</span>
          <span class="toggle-text">${o("nearestCentersTitle")}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="stroke-centers" style="display: none;">
          ${h}
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
      
      ${xt(s)}
      ${u}
    </div>
  `}function ms(s,e,t){const i=t>1?"LVO":"ICH",r=i==="LVO"?"🧠":"🩸",a=Y.getCurrentLanguage()==="de"?i==="LVO"?"LVO-dominant":"ICH-dominant":i==="LVO"?"LVO dominant":"ICH dominant",n=Y.getCurrentLanguage()==="de"?`Verhältnis LVO/ICH: ${t.toFixed(2)}`:`LVO/ICH ratio: ${t.toFixed(2)}`;return`
    <div class="tachometer-section">
      <div class="tachometer-card">
        <div class="treatment-recommendation ${i==="LVO"?"lvo-dominant":"ich-dominant"}">
          <div class="recommendation-icon">${r}</div>
          <div class="recommendation-text">
            <h4>${a}</h4>
            <p>${n}</p>
          </div>
          <div class="probability-summary">
            ICH: ${s}% | LVO: ${e}%
          </div>
        </div>
      </div>
    </div>
  `}function Dt(s){if(!s||!s.drivers)return'<p class="no-drivers">No driver data available</p>';const e=s.drivers;if(!e.positive&&!e.negative)return'<p class="no-drivers">Driver format error</p>';const t=e.positive||[],i=e.negative||[];return`
    <div class="drivers-split-view">
      <div class="drivers-column positive-column">
        <div class="column-header">
          <span class="column-icon">⬆</span>
          <span class="column-title">${o("increasingRisk")||"Risikoerhöhend / Increasing Risk"}</span>
        </div>
        <div class="compact-drivers">
          ${t.length>0?t.slice(0,5).map(r=>bt(r,"positive")).join(""):`<p class="no-factors">${o("noFactors")||"Keine Faktoren / No factors"}</p>`}
        </div>
      </div>
      
      <div class="drivers-column negative-column">
        <div class="column-header">
          <span class="column-icon">⬇</span>
          <span class="column-title">${o("decreasingRisk")||"Risikomindernd / Decreasing Risk"}</span>
        </div>
        <div class="compact-drivers">
          ${i.length>0?i.slice(0,5).map(r=>bt(r,"negative")).join(""):`<p class="no-factors">${o("noFactors")||"Keine Faktoren / No factors"}</p>`}
        </div>
      </div>
    </div>
  `}function bt(s,e){const t=Math.abs(s.weight*100),i=Math.min(t*2,100);return`
    <div class="compact-driver-item">
      <div class="compact-driver-label">${xe(s.label)}</div>
      <div class="compact-driver-bar ${e}" style="width: ${i}%;">
        <span class="compact-driver-value">${t.toFixed(1)}%</span>
      </div>
    </div>
  `}function xt(s){if(!s||!s.probability||Math.round((s.probability||0)*100)<50)return"";const t=Ye();return!t||t<=0?"":`
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
  `}function gs(s){try{const e=Oe();return!e.age||!e.gfap?null:si(e)}catch(e){return null}}function Oe(){const s=m.getState(),{formData:e}=s;let t=null,i=null;for(const a of["coma","limited","full"])e[a]&&(t=t||e[a].age_years,i=i||e[a].gfap_value);return{age:parseInt(t)||null,gfap:parseFloat(i)||null}}function Ot(s){return Math.round(s*100)>25?`
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
    `:""}function ps(s){const e=Math.round(s*100),t=Y.getCurrentLanguage()==="de";return e>25?`
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
    `}function fs(s){if(!(s!=null&&s.module))return"unknown";const e=s.module.toLowerCase();return e.includes("coma")?"coma":e.includes("limited")?"limited":e.includes("full")?"full":"unknown"}function $t(s){const e=Ye();if(!e||e<=0)return"";const t=Ct(e),i=ti(t);return Math.round(((s==null?void 0:s.probability)||0)*100),`
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
              ${cs(s)}
              <div class="circle-label">${o("ichVolumeLabel")}</div>
            </div>
          </div>
        </div>
        
        <div class="risk-assessment">
          <div class="mortality-assessment">
            ${o("predictedMortality")}: ${i}
          </div>
      </div>
    </div>
  </div>
  `}function ys(s,e){const t=e/Math.max(s,1);return`
    <div class="tachometer-section">
      <div class="tachometer-card">
        <div class="tachometer-header">
          <h3>🎯 ${Y.getCurrentLanguage()==="de"?"Entscheidungshilfe – LVO/ICH":"Decision Support – LVO/ICH"}</h3>
          <div class="ratio-display">LVO/ICH Ratio: ${t.toFixed(2)}</div>
        </div>
        
        <div class="tachometer-gauge" id="tachometer-canvas-container">
          <div data-react-tachometer data-ich="${s}" data-lvo="${e}" data-title="${Y.getCurrentLanguage()==="de"?"Entscheidungshilfe – LVO/ICH":"Decision Support – LVO/ICH"}"></div>
        </div>

        <!-- Legend chips for zones -->
        <div class="tachometer-legend" aria-hidden="true">
          <span class="legend-chip ich">ICH</span>
          <span class="legend-chip uncertain">${Y.getCurrentLanguage()==="de"?"Unsicher":"Uncertain"}</span>
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
            <div class="metric-value">${(()=>{const i=Math.abs(e-s),r=Math.max(e,s);let a=i<10?Math.round(30+r*.3):i<20?Math.round(50+r*.4):Math.round(70+r*.3);return a=Math.max(0,Math.min(100,a)),a})()}%</div>
            <div class="metric-unit">percent</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Difference</div>
            <div class="metric-value">${Math.abs(e-s).toFixed(0)}%</div>
            <div class="metric-unit">|LVO − ICH|</div>
          </div>
        </div>
        
        <div class="probability-summary">
          ICH: ${s}% | LVO: ${e}%
        </div>
        
        <!-- Hidden probability summary for initialization -->
        <div class="probability-summary" style="display: none;">
          ICH: ${s}% | LVO: ${e}%
        </div>
      </div>
    </div>
  `}function bs(){return`
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
  `}function vs(){const s=document.getElementById("loginForm");if(!s)return;const e=document.getElementById("researchPassword"),t=document.getElementById("loginError"),i=s.querySelector(".login-button");e.focus(),s.addEventListener("submit",async l=>{l.preventDefault();const c=e.value.trim();if(!c){r("Please enter the research access code");return}n(!0),a();try{const h=await O.authenticate(c);if(h.success)m.logEvent("auth_success",{timestamp:new Date().toISOString(),userAgent:navigator.userAgent.substring(0,100)}),m.navigate("triage1");else{let d=h.message;r(d),e.value="",e.focus(),m.logEvent("auth_failed",{timestamp:new Date().toISOString(),errorCode:h.errorCode})}}catch(h){r("Authentication system error. Please try again.")}finally{n(!1)}}),e.addEventListener("input",()=>{a()});function r(l){t.textContent=l,t.style.display="block",e.classList.add("error")}function a(){t.style.display="none",e.classList.remove("error")}function n(l){const c=i.querySelector(".button-text"),h=i.querySelector(".loading-spinner");l?(c.style.display="none",h.style.display="inline",i.disabled=!0):(c.style.display="inline",h.style.display="none",i.disabled=!1)}}function Ss(s){const e=document.createElement("div");e.className="sr-only",e.setAttribute("role","status"),e.setAttribute("aria-live","polite");const t={triage1:"Coma assessment",triage2:"Examination capability assessment",coma:"Coma module",limited:"Limited data module",full:"Full stroke assessment",results:"Assessment results"};e.textContent=`Navigated to ${t[s]||s}`,document.body.appendChild(e),setTimeout(()=>e.remove(),1e3)}function Es(s){const e="iGFAP",i={triage1:"Initial Assessment",triage2:"Examination Capability",coma:"Coma Module",limited:"Limited Data Module",full:"Full Stroke Module",results:"Assessment Results"}[s];document.title=i?`${e} — ${i}`:e}function ks(){setTimeout(()=>{const s=document.querySelector("h2");s&&(s.setAttribute("tabindex","-1"),s.focus(),setTimeout(()=>s.removeAttribute("tabindex"),100))},100)}class ws{constructor(){this.scores={facial_palsy:0,arm_weakness:0,speech_changes:0,eye_deviation:0,denial_neglect:0},this.onApply=null,this.modal=null}getTotal(){return Object.values(this.scores).reduce((e,t)=>e+t,0)}getRiskLevel(){return this.getTotal()>=4?"high":"low"}render(){const e=this.getTotal(),t=this.getRiskLevel();return`
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
                <div class="risk-indicator ${t}">
                  ${o("riskLevel")}: ${o(t==="high"?"riskLevelHigh":"riskLevelLow")}
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
    `}setupEventListeners(){if(this.modal=document.getElementById("fastEdModal"),!this.modal)return;this.modal.addEventListener("change",r=>{if(r.target.type==="radio"){const a=r.target.name,n=parseInt(r.target.value);this.scores[a]=n,this.updateDisplay()}});const e=this.modal.querySelector(".modal-close");e==null||e.addEventListener("click",()=>this.close());const t=this.modal.querySelector('[data-action="cancel-fast-ed"]');t==null||t.addEventListener("click",()=>this.close());const i=this.modal.querySelector('[data-action="apply-fast-ed"]');i==null||i.addEventListener("click",()=>this.apply()),this.modal.addEventListener("click",r=>{r.target===this.modal&&(r.preventDefault(),r.stopPropagation())}),document.addEventListener("keydown",r=>{var a;r.key==="Escape"&&((a=this.modal)!=null&&a.classList.contains("show"))&&this.close()})}updateDisplay(){var i,r;const e=(i=this.modal)==null?void 0:i.querySelector(".total-score"),t=(r=this.modal)==null?void 0:r.querySelector(".risk-indicator");if(e&&(e.textContent=`${this.getTotal()}/9`),t){const a=this.getRiskLevel();t.className=`risk-indicator ${a}`,t.textContent=`${o("riskLevel")}: ${o(a==="high"?"riskLevelHigh":"riskLevelLow")}`}}show(e=0,t=null){this.onApply=t,e>0&&e<=9&&this.approximateFromTotal(e),document.getElementById("fastEdModal")?(this.modal.remove(),document.body.insertAdjacentHTML("beforeend",this.render()),this.modal=document.getElementById("fastEdModal")):document.body.insertAdjacentHTML("beforeend",this.render()),this.setupEventListeners(),this.modal.setAttribute("aria-hidden","false"),this.modal.style.display="flex",this.modal.classList.add("show");const i=this.modal.querySelector('input[type="radio"]');i==null||i.focus()}close(){this.modal&&(this.modal.classList.remove("show"),this.modal.style.display="none",this.modal.setAttribute("aria-hidden","true"))}apply(){const e=this.getTotal(),t=this.scores.arm_weakness>0,i=this.scores.eye_deviation>0;this.onApply&&this.onApply({total:e,components:{...this.scores},armWeaknessBoolean:t,eyeDeviationBoolean:i}),this.close()}approximateFromTotal(e){this.scores={facial_palsy:0,arm_weakness:0,speech_changes:0,eye_deviation:0,denial_neglect:0};let t=e;const i=Object.keys(this.scores);for(const r of i){if(t<=0)break;const n=Math.min(t,r==="facial_palsy"?1:2);this.scores[r]=n,t-=n}}}const Ts=new ws;function ge(s){const e=m.getState(),{currentScreen:t,results:i,startTime:r,screenHistory:a}=e;console.log("[Render] Rendering screen:",t,"Has results:",!!i);const n=document.createElement("div"),l=document.getElementById("backButton");l&&(l.style.display=a&&a.length>0?"flex":"none");let c="";switch(t){case"login":c=bs();break;case"triage1":if(!O.isValidSession()){m.navigate("login");return}c=pt();break;case"triage2":c=ji();break;case"coma":c=Qi();break;case"limited":c=Ji();break;case"full":c=Zi();break;case"results":c=ds(i,r);break;default:c=pt()}try{Ee(n,c)}catch(d){n.textContent="Error loading content. Please refresh."}for(;s.firstChild;)s.removeChild(s.firstChild);for(;n.firstChild;)s.appendChild(n.firstChild);const h=s.querySelector("form[data-module]");if(h){const{module:d}=h.dataset;Cs(h,d)}As(s),t==="login"&&setTimeout(()=>{vs()},100),t==="results"&&i&&setTimeout(()=>{try{console.log("[Render] Initializing stroke center map with results:",i),oi(i)}catch(d){console.error("[Render] Stroke center map initialization failed:",d)}},100),setTimeout(()=>{try{ai()}catch(d){}},150),Ss(t),Es(t),ks()}function Cs(s,e){const t=m.getFormData(e);!t||Object.keys(t).length===0||Object.entries(t).forEach(([i,r])=>{const a=s.elements[i];a&&(a.type==="checkbox"?a.checked=r===!0||r==="on"||r==="true":a.value=r)})}function As(s){s.querySelectorAll('input[type="number"]').forEach(r=>{r.addEventListener("input",()=>{const a=r.closest(".input-group");a&&a.classList.contains("error")&&(a.classList.remove("error"),a.querySelectorAll(".error-message").forEach(n=>n.remove()))})}),s.querySelectorAll("[data-action]").forEach(r=>{r.addEventListener("click",a=>{const{action:n,value:l}=a.currentTarget.dataset,c=l==="true";switch(n){case"triage1":Di(c);break;case"triage2":xi(c);break;case"reset":Oi();break;case"goBack":$i();break;case"goHome":Rt();break}})}),s.querySelectorAll("form[data-module]").forEach(r=>{r.addEventListener("submit",a=>{Fi(a,s)})});const e=s.querySelector("#printResults");e&&e.addEventListener("click",()=>window.print());const t=s.querySelector("#fast_ed_score");t&&(t.addEventListener("click",r=>{r.preventDefault();const a=parseInt(t.value)||0;Ts.show(a,n=>{t.value=n.total;const l=s.querySelector("#armparese_hidden");l&&(l.value=n.armWeaknessBoolean?"true":"false");const c=s.querySelector("#eye_deviation_hidden");c&&(c.value=n.eyeDeviationBoolean?"true":"false"),t.dispatchEvent(new Event("change",{bubbles:!0}))})}),t.addEventListener("keydown",r=>{r.preventDefault()})),s.querySelectorAll(".info-toggle").forEach(r=>{r.addEventListener("click",a=>{const n=r.dataset.target,l=s.querySelector(`#${n}`),c=r.querySelector(".toggle-arrow");l&&(l.style.display!=="none"?(l.style.display="none",l.classList.remove("show"),r.classList.remove("active"),c.style.transform="rotate(0deg)"):(l.style.display="block",l.classList.add("show"),r.classList.add("active"),c.style.transform="rotate(180deg)"))})})}class Is{constructor(){this.container=null,this.eventListeners=new Map,this.isInitialized=!1}initialize(e){this.container=e,this.setupGlobalEventListeners(),this.setupHelpModal(),this.setupFooterLinks(),this.initializeApiModeToggle(),this.initializeResearchMode(),this.setCurrentYear(),this.isInitialized=!0}setupGlobalEventListeners(){this.addEventListenerSafe("backButton","click",()=>{m.goBack(),ge(this.container)}),this.addEventListenerSafe("homeButton","click",()=>{m.goHome(),ge(this.container)}),this.addEventListenerSafe("languageToggle","click",()=>{this.toggleLanguage()}),this.addEventListenerSafe("darkModeToggle","click",()=>{this.toggleDarkMode()}),this.addEventListenerSafe("apiModeToggle","click",e=>{e.preventDefault(),this.toggleApiMode()}),this.addEventListenerSafe("researchModeToggle","click",e=>{e.preventDefault(),e.stopPropagation(),this.toggleResearchMode()}),this.addGlobalEventListener("keydown",e=>{e.key==="Escape"&&this.closeModal("helpModal")}),this.addGlobalEventListener("beforeunload",e=>{m.hasUnsavedData()&&(e.preventDefault(),e.returnValue="You have unsaved data. Are you sure you want to leave?")})}initializeApiModeToggle(){if(!document.getElementById("apiModeToggle"))return;const t=["localhost","127.0.0.1","0.0.0.0"].includes(window.location.hostname);localStorage.getItem("use_mock_api")===null&&t&&localStorage.setItem("use_mock_api","true"),this.updateApiModeButton()}toggleApiMode(){const t=localStorage.getItem("use_mock_api")==="true"?"false":"true";localStorage.setItem("use_mock_api",t),this.updateApiModeButton();try{const i=document.createElement("div");i.className="sr-only",i.setAttribute("role","status"),i.setAttribute("aria-live","polite"),i.textContent=t==="true"?"Mock data enabled":"Live API enabled",document.body.appendChild(i),setTimeout(()=>i.remove(),1200)}catch(i){}}updateApiModeButton(){const e=document.getElementById("apiModeToggle");if(!e)return;localStorage.getItem("use_mock_api")!=="false"?(e.textContent="🧪",e.title="Mock data: ON (click to use API)",e.setAttribute("aria-label","Mock data enabled")):(e.textContent="☁️",e.title="Live API: ON (click to use mock)",e.setAttribute("aria-label","Live API enabled"))}addEventListenerSafe(e,t,i){const r=document.getElementById(e);if(r){const a=n=>{try{i(n)}catch(l){this.handleUIError(l,`${e}_${t}`)}};r.addEventListener(t,a),this.eventListeners.set(`${e}_${t}`,{element:r,handler:a})}}addGlobalEventListener(e,t){const i=r=>{try{t(r)}catch(a){this.handleUIError(a,`global_${e}`)}};if(e==="keydown"||e==="beforeunload"){const r=e==="beforeunload"?window:document;r.addEventListener(e,i),this.eventListeners.set(`global_${e}`,{element:r,handler:i})}}setupHelpModal(){y(async()=>{const e=document.getElementById("helpButton"),t=document.getElementById("helpModal"),i=t==null?void 0:t.querySelector(".modal-close");e&&t&&(this.closeModal("helpModal"),this.addEventListenerSafe("helpButton","click",()=>{this.openModal("helpModal")}),i&&i.addEventListener("click",()=>{this.closeModal("helpModal")}),t.addEventListener("click",r=>{r.target===t&&this.closeModal("helpModal")}))},e=>{})}setupFooterLinks(){this.addEventListenerSafe("privacyLink","click",e=>{e.preventDefault(),this.showPrivacyPolicy()}),this.addEventListenerSafe("disclaimerLink","click",e=>{e.preventDefault(),this.showDisclaimer()})}toggleLanguage(){y(async()=>{Y.toggleLanguage(),this.updateLanguage()},e=>{})}updateLanguage(){document.documentElement.lang=Y.getCurrentLanguage(),this.updateElementText(".app-header h1",o("appTitle")),this.updateElementText(".emergency-badge",o("emergencyBadge")),this.updateButtonAttributes("languageToggle",o("languageToggle")),this.updateButtonAttributes("helpButton",o("helpButton")),this.updateButtonAttributes("darkModeToggle",o("darkModeButton")),this.updateElementText("#modalTitle",o("helpTitle"));const e=document.getElementById("languageToggle");if(e){const t=Y.getCurrentLanguage();e.textContent=t==="en"?"🇬🇧":"🇩🇪",e.dataset.lang=t}}updateElementText(e,t){const i=document.querySelector(e);i&&t&&(i.textContent=t)}updateButtonAttributes(e,t){const i=document.getElementById(e);i&&t&&(i.title=t,i.setAttribute("aria-label",t))}toggleDarkMode(){const e=document.getElementById("darkModeToggle");document.body.classList.toggle("dark-mode");const t=document.body.classList.contains("dark-mode");e&&(e.textContent=t?"☀️":"🌙"),localStorage.setItem("theme",t?"dark":"light")}initializeResearchMode(){document.getElementById("researchModeToggle")&&this.updateResearchMode()}updateResearchMode(){const e=document.getElementById("researchModeToggle");if(e){const t=this.getCurrentModuleFromResults(),i=t==="limited"||t==="full";e.style.display=i?"flex":"none",e.style.opacity=i?"1":"0.5"}}getCurrentModuleFromResults(){var i,r;const e=m.getState();if(e.currentScreen!=="results"||!((r=(i=e.results)==null?void 0:i.ich)!=null&&r.module))return null;const t=e.results.ich.module.toLowerCase();return t.includes("coma")?"coma":t.includes("limited")?"limited":t.includes("full")?"full":null}toggleResearchMode(){const e=document.getElementById("researchPanel");if(!e)return;const t=e.style.display!=="none";e.style.display=t?"none":"block";const i=document.getElementById("researchModeToggle");return i&&(i.style.background=t?"rgba(255, 255, 255, 0.1)":"rgba(0, 102, 204, 0.2)"),!1}showResearchActivationMessage(){y(async()=>{const e=document.createElement("div");e.className="research-activation-toast";try{Ee(e,`
            <div class="toast-content">
              🔬 <strong>Research Mode Activated</strong><br>
              <small>Model comparison features enabled</small>
            </div>
          `)}catch(t){e.textContent="🔬 Research Mode Activated - Model comparison features enabled"}document.body.appendChild(e),setTimeout(()=>{document.body.contains(e)&&document.body.removeChild(e)},3e3)},e=>{})}openModal(e){const t=document.getElementById(e);t&&(t.style.display="flex",t.classList.add("show"),t.setAttribute("aria-hidden","false"))}closeModal(e){const t=document.getElementById(e);t&&(t.classList.remove("show"),t.style.display="none",t.setAttribute("aria-hidden","true"))}showPrivacyPolicy(){alert("Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.")}showDisclaimer(){alert("Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.")}setCurrentYear(){const e=document.getElementById("currentYear");e&&(e.textContent=new Date().getFullYear())}handleUIError(e,t){try{const i=new CustomEvent("uiError",{detail:{error:e,context:t,timestamp:Date.now()}});document.dispatchEvent(i)}catch(i){}}async preloadCriticalComponents(){return y(async()=>{const t=["appContainer","helpModal","languageToggle","darkModeToggle"].filter(i=>!document.getElementById(i));if(t.length>0)throw new Error(`Missing critical UI elements: ${t.join(", ")}`);return!0},e=>!1)}getStatus(){return{isInitialized:this.isInitialized,hasContainer:!!this.container,eventListenersCount:this.eventListeners.size,currentLanguage:Y.getCurrentLanguage(),isDarkMode:document.body.classList.contains("dark-mode")}}destroy(){this.eventListeners.forEach(({element:e,handler:t},i)=>{const[,r]=i.split("_");e&&t&&e.removeEventListener(r,t)}),this.eventListeners.clear(),this.container=null,this.isInitialized=!1}}class Ls{constructor(){this.currentTheme="light",this.isInitialized=!1,this.storageKey="theme"}initialize(){this.loadSavedTheme(),this.setupThemeDetection(),this.isInitialized=!0}async loadSavedTheme(){return y(async()=>{const e=localStorage.getItem(this.storageKey),t=window.matchMedia("(prefers-color-scheme: dark)").matches;let i;return e==="dark"||e==="light"?i=e:t?i="dark":i="light",this.applyTheme(i),this.updateThemeButton(),i},e=>(this.applyTheme("light"),this.updateThemeButton(),"light"))}setupThemeDetection(){const e=window.matchMedia("(prefers-color-scheme: dark)"),t=i=>{if(!localStorage.getItem(this.storageKey)){const a=i.matches?"dark":"light";this.applyTheme(a),this.updateThemeButton()}};e.addEventListener?e.addEventListener("change",t):e.addListener(t)}applyTheme(e){e!=="light"&&e!=="dark"&&(e="light"),this.currentTheme=e,e==="dark"?document.body.classList.add("dark-mode"):document.body.classList.remove("dark-mode"),this.updateMetaThemeColor(e),this.dispatchThemeChangeEvent(e)}toggleTheme(){const e=this.currentTheme==="dark"?"light":"dark";this.setTheme(e)}setTheme(e){return y(async()=>(this.applyTheme(e),this.saveTheme(e),this.updateThemeButton(),e),t=>this.currentTheme)}saveTheme(e){try{localStorage.setItem(this.storageKey,e)}catch(t){}}updateThemeButton(){const e=document.getElementById("darkModeToggle");if(e){const t=this.currentTheme==="dark";e.textContent=t?"☀️":"🌙";const i=t?"Switch to light mode":"Switch to dark mode";e.setAttribute("aria-label",i),e.title=i}}updateMetaThemeColor(e){let t=document.querySelector('meta[name="theme-color"]');t||(t=document.createElement("meta"),t.name="theme-color",document.head.appendChild(t));const i={light:"#ffffff",dark:"#1a1a1a"};t.content=i[e]||i.light}dispatchThemeChangeEvent(e){try{const t=new CustomEvent("themeChanged",{detail:{theme:e,timestamp:Date.now()}});document.dispatchEvent(t)}catch(t){}}getCurrentTheme(){return this.currentTheme}isDarkMode(){return this.currentTheme==="dark"}getSystemPreferredTheme(){try{return window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}catch(e){return"light"}}resetToSystemTheme(){const e=this.getSystemPreferredTheme();this.setTheme(e);try{localStorage.removeItem(this.storageKey)}catch(t){}}getStatus(){return{isInitialized:this.isInitialized,currentTheme:this.currentTheme,isDarkMode:this.isDarkMode(),systemPreferred:this.getSystemPreferredTheme(),hasExplicitPreference:!!localStorage.getItem(this.storageKey)}}destroy(){this.isInitialized=!1}}class Ms{constructor(){this.autoSaveInterval=null,this.sessionCheckInterval=null,this.isInitialized=!1,this.lastAutoSave=0}initialize(){this.validateStoredSession(),this.startAutoSave(),this.setupSessionTimeout(),this.setupSessionValidation(),this.isInitialized=!0}async validateStoredSession(){return y(async()=>O.isValidSession()?(this.restoreFormData(),!0):(this.clearSessionData(),!1),e=>(this.clearSessionData(),!1))}startAutoSave(){this.autoSaveInterval&&clearInterval(this.autoSaveInterval),this.autoSaveInterval=setInterval(()=>{this.performAutoSave()},ct.autoSaveInterval)}async performAutoSave(){return y(async()=>{const e=document.getElementById("appContainer");if(!e)return!1;const t=e.querySelectorAll("form[data-module]");let i=0;for(const r of t)try{const{module:a}=r.dataset;if(a){const n=this.extractFormData(r);this.hasFormDataChanged(a,n)&&(m.setFormData(a,n),i++)}}catch(a){}return this.lastAutoSave=Date.now(),i>0},e=>!1)}extractFormData(e){const t=new FormData(e),i={};return t.forEach((r,a)=>{const n=e.elements[a];if(n)if(n.type==="checkbox")i[a]=n.checked;else if(n.type==="number"){const l=parseFloat(r);i[a]=isNaN(l)?r:l}else i[a]=r}),i}hasFormDataChanged(e,t){try{const i=m.getFormData(e);return JSON.stringify(i)!==JSON.stringify(t)}catch(i){return!0}}restoreFormData(){y(async()=>{const e=document.getElementById("appContainer");if(!e)return;e.querySelectorAll("form[data-module]").forEach(i=>{try{const{module:r}=i.dataset;if(r){const a=m.getFormData(r);a&&Object.keys(a).length>0&&this.populateForm(i,a)}}catch(r){}})},e=>{})}populateForm(e,t){Object.entries(t).forEach(([i,r])=>{const a=e.elements[i];if(a)try{a.type==="checkbox"?a.checked=!!r:a.type==="radio"?a.value===r&&(a.checked=!0):a.value=r,a.dispatchEvent(new Event("input",{bubbles:!0}))}catch(n){}})}setupSessionTimeout(){setTimeout(()=>{this.showSessionTimeoutWarning()},ct.sessionTimeout-6e4)}setupSessionValidation(){this.sessionCheckInterval=setInterval(()=>{this.validateCurrentSession()},5*60*1e3)}async validateCurrentSession(){return y(async()=>O.isValidSession()?await O.validateSessionWithServer()?!0:(this.handleSessionExpiry(),!1):(this.handleSessionExpiry(),!1),e=>O.isValidSession())}showSessionTimeoutWarning(){y(async()=>{confirm("Your session will expire in 1 minute. Would you like to continue?")?(O.updateActivity(),this.setupSessionTimeout()):this.endSession()},e=>{})}handleSessionExpiry(){this.clearSessionData(),m.navigate("login"),this.showSessionExpiredMessage()}showSessionExpiredMessage(){const e=document.createElement("div");e.style.cssText=`
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #ff9800;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `,e.textContent="⏰ Session expired. Please log in again.",document.body.appendChild(e),setTimeout(()=>{document.body.contains(e)&&document.body.removeChild(e)},5e3)}endSession(){O.logout(),this.clearSessionData(),m.reset(),m.navigate("login")}async clearSessionData(){try{C.info("Clearing session data",{category:b.SECURITY}),m.clearAllFormData(),await me("temp_data",!0),await me("research_data",!0),sessionStorage.removeItem("temp_data"),sessionStorage.removeItem("research_data"),C.info("Session data cleared successfully",{category:b.SECURITY})}catch(e){C.warn("Failed to clear some session data",{category:b.SECURITY,error:e.message})}}async forceSave(){return this.performAutoSave()}getStatus(){var e;return{isInitialized:this.isInitialized,isAuthenticated:O.isValidSession(),lastAutoSave:this.lastAutoSave,autoSaveActive:!!this.autoSaveInterval,sessionCheckActive:!!this.sessionCheckInterval,sessionInfo:((e=O.getSessionInfo)==null?void 0:e.call(O))||{}}}destroy(){this.autoSaveInterval&&(clearInterval(this.autoSaveInterval),this.autoSaveInterval=null),this.sessionCheckInterval&&(clearInterval(this.sessionCheckInterval),this.sessionCheckInterval=null),this.isInitialized=!1}}const J={MEMORY:"memory",SESSION:"session",LOCAL:"local",INDEXED_DB:"indexed_db"},oe={CRITICAL:"critical",HIGH:"high",NORMAL:"normal",LOW:"low"},Rs={API_RESPONSES:15*60*1e3};class vt{constructor(e,t,i,r=oe.NORMAL,a={}){this.key=e,this.value=this.sanitizeValue(t),this.ttl=i,this.priority=r,this.metadata={...a,createdAt:Date.now(),accessCount:0,lastAccessed:Date.now()},this.expiresAt=i>0?Date.now()+i:null,this.encrypted=!1}sanitizeValue(e){if(typeof e!="object"||e===null)return e;const t=JSON.parse(JSON.stringify(e)),i=["ssn","mrn","patient_id","user_id","session_token"];return this.removeSensitiveFields(t,i),t}removeSensitiveFields(e,t){Object.keys(e).forEach(i=>{t.some(r=>i.toLowerCase().includes(r))?e[i]="[REDACTED]":typeof e[i]=="object"&&e[i]!==null&&this.removeSensitiveFields(e[i],t)})}isExpired(){return this.expiresAt!==null&&Date.now()>this.expiresAt}markAccessed(){this.metadata.accessCount+=1,this.metadata.lastAccessed=Date.now()}getAge(){return Date.now()-this.metadata.createdAt}getTimeToExpiration(){return this.expiresAt===null?1/0:Math.max(0,this.expiresAt-Date.now())}getEvictionScore(){const t={[oe.CRITICAL]:1e3,[oe.HIGH]:100,[oe.NORMAL]:10,[oe.LOW]:1}[this.priority]||1,i=Math.log(this.metadata.accessCount+1),r=1/(this.getAge()+1);return t*i*r}}class Ne{constructor(e=J.MEMORY,t={}){this.storageType=e,this.options={maxSize:100*1024*1024,maxEntries:1e3,cleanupInterval:5*60*1e3,enableEncryption:!1,enableMetrics:!0,...t},this.cache=new Map,this.cleanupTimer=null,this.totalSize=0,this.hitCount=0,this.missCount=0,this.evictionCount=0,this.initializeStorage(),this.startCleanupTimer()}initializeStorage(){switch(this.storageType){case J.SESSION:this.storage=sessionStorage,this.loadFromStorage();break;case J.LOCAL:this.storage=localStorage,this.loadFromStorage();break;case J.INDEXED_DB:this.initializeIndexedDB();break;default:this.storage=null}}loadFromStorage(){if(this.storage)try{const e=this.storage.getItem("medical_cache");if(e){const t=JSON.parse(e);Object.entries(t).forEach(([i,r])=>{const a=new vt(r.key,r.value,r.ttl,r.priority,r.metadata);a.expiresAt=r.expiresAt,a.isExpired()||(this.cache.set(i,a),this.totalSize+=this.calculateSize(a.value))})}}catch(e){}}saveToStorage(){if(this.storage)try{const e={};this.cache.forEach((t,i)=>{e[i]={key:t.key,value:t.value,ttl:t.ttl,priority:t.priority,metadata:t.metadata,expiresAt:t.expiresAt}}),this.storage.setItem("medical_cache",JSON.stringify(e))}catch(e){}}async initializeIndexedDB(){}set(e,t,i=Rs.API_RESPONSES,r=oe.NORMAL,a={}){const n=H.startMeasurement(qe.CACHE,"cache_set",{key:e,priority:r});try{this.ensureCapacity();const l=new vt(e,t,i,r,a),c=this.calculateSize(t);if(this.cache.has(e)){const h=this.cache.get(e);this.totalSize-=this.calculateSize(h.value)}return this.cache.set(e,l),this.totalSize+=c,this.storageType!==J.MEMORY&&this.saveToStorage(),p.publish(f.AUDIT_EVENT,{action:"cache_set",key:e,size:c,ttl:i,priority:r}),H.endMeasurement(n,{success:!0}),!0}catch(l){return H.endMeasurement(n,{success:!1,error:l.message}),!1}}get(e){const t=H.startMeasurement(qe.CACHE,"cache_get",{key:e});try{const i=this.cache.get(e);return i?i.isExpired()?(this.cache.delete(e),this.totalSize-=this.calculateSize(i.value),this.missCount+=1,H.endMeasurement(t,{hit:!1,expired:!0}),null):(i.markAccessed(),this.hitCount+=1,H.endMeasurement(t,{hit:!0}),i.value):(this.missCount+=1,H.endMeasurement(t,{hit:!1}),null)}catch(i){return H.endMeasurement(t,{hit:!1,error:i.message}),null}}has(e){const t=this.cache.get(e);return t&&!t.isExpired()}delete(e){const t=this.cache.get(e);return t?(this.totalSize-=this.calculateSize(t.value),this.cache.delete(e),this.storageType!==J.MEMORY&&this.saveToStorage(),p.publish(f.AUDIT_EVENT,{action:"cache_delete",key:e}),!0):!1}clear(){const e=this.cache.size;this.cache.clear(),this.totalSize=0,this.storage&&this.storage.removeItem("medical_cache"),p.publish(f.AUDIT_EVENT,{action:"cache_cleared",entriesCleared:e})}ensureCapacity(){for(;this.totalSize>this.options.maxSize;)this.evictLeastImportant();for(;this.cache.size>=this.options.maxEntries;)this.evictLeastImportant()}evictLeastImportant(){let e=1/0,t=null;this.cache.forEach((i,r)=>{if(i.priority===oe.CRITICAL&&!i.isExpired())return;const a=i.getEvictionScore();a<e&&(e=a,t=r)}),t&&(this.delete(t),this.evictionCount+=1)}cleanup(){const e=performance.now();let t=0;this.cache.forEach((r,a)=>{r.isExpired()&&(this.delete(a),t+=1)});const i=performance.now()-e;return p.publish(f.AUDIT_EVENT,{action:"cache_cleanup",cleanedCount:t,duration:i,remainingEntries:this.cache.size}),t}startCleanupTimer(){this.cleanupTimer&&clearInterval(this.cleanupTimer),this.cleanupTimer=setInterval(()=>{this.cleanup()},this.options.cleanupInterval)}stopCleanupTimer(){this.cleanupTimer&&(clearInterval(this.cleanupTimer),this.cleanupTimer=null)}calculateSize(e){try{return JSON.stringify(e).length*2}catch(t){return 0}}getStats(){const e=this.hitCount+this.missCount>0?this.hitCount/(this.hitCount+this.missCount)*100:0;return{entries:this.cache.size,totalSize:this.totalSize,maxSize:this.options.maxSize,hitCount:this.hitCount,missCount:this.missCount,hitRate:`${e.toFixed(2)}%`,evictionCount:this.evictionCount,storageType:this.storageType,utilizationPercent:`${(this.totalSize/this.options.maxSize*100).toFixed(2)}%`}}getEntryInfo(e){const t=this.cache.get(e);return t?{key:t.key,size:this.calculateSize(t.value),priority:t.priority,ttl:t.ttl,age:t.getAge(),timeToExpiration:t.getTimeToExpiration(),accessCount:t.metadata.accessCount,lastAccessed:new Date(t.metadata.lastAccessed).toISOString(),isExpired:t.isExpired(),evictionScore:t.getEvictionScore()}:null}dispose(){this.stopCleanupTimer(),this.clear()}}class re{static getPatientDataCache(){return this.patientDataCache||(this.patientDataCache=new Ne(J.SESSION,{maxSize:10*1024*1024,maxEntries:100,enableEncryption:!0})),this.patientDataCache}static getPredictionCache(){return this.predictionCache||(this.predictionCache=new Ne(J.MEMORY,{maxSize:50*1024*1024,maxEntries:500})),this.predictionCache}static getValidationCache(){return this.validationCache||(this.validationCache=new Ne(J.LOCAL,{maxSize:5*1024*1024,maxEntries:200})),this.validationCache}static getApiCache(){return this.apiCache||(this.apiCache=new Ne(J.SESSION,{maxSize:20*1024*1024,maxEntries:300})),this.apiCache}static clearAllCaches(){[this.patientDataCache,this.predictionCache,this.validationCache,this.apiCache].forEach(e=>{e&&e.clear()})}static disposeAllCaches(){[this.patientDataCache,this.predictionCache,this.validationCache,this.apiCache].forEach(e=>{e&&e.dispose()}),this.patientDataCache=null,this.predictionCache=null,this.validationCache=null,this.apiCache=null}}ve(re,"patientDataCache",null),ve(re,"predictionCache",null),ve(re,"validationCache",null),ve(re,"apiCache",null);re.getPatientDataCache();const xa=re.getPredictionCache();re.getValidationCache();re.getApiCache();const k={CRITICAL:"critical",HIGH:"high",NORMAL:"normal",LOW:"low"},Z={PENDING:"pending",LOADING:"loading",LOADED:"loaded",ERROR:"error"};class _s{constructor(e,t,i={}){this.name=e,this.loader=t,this.priority=i.priority||k.NORMAL,this.state=Z.PENDING,this.component=null,this.error=null,this.loadTime=null,this.dependencies=i.dependencies||[],this.retryCount=0,this.maxRetries=i.maxRetries||3,this.loadPromise=null}async load(){if(this.state===Z.LOADED)return this.component;if(this.loadPromise)return this.loadPromise;const e=H.startMeasurement(qe.USER_INTERACTION,`lazy_load_${this.name}`,{priority:this.priority});return this.state=Z.LOADING,this.loadPromise=this.executeLoad(e),this.loadPromise}async executeLoad(e){try{const t=performance.now();return await this.loadDependencies(),this.component=await this.loader(),this.loadTime=performance.now()-t,this.state=Z.LOADED,H.endMeasurement(e,{success:!0,loadTime:this.loadTime,retryCount:this.retryCount}),p.publish(f.AUDIT_EVENT,{action:"lazy_component_loaded",component:this.name,loadTime:this.loadTime,priority:this.priority}),this.component}catch(t){if(this.error=t,this.retryCount++,H.endMeasurement(e,{success:!1,error:t.message,retryCount:this.retryCount}),this.retryCount<this.maxRetries){const i=Math.min(1e3*2**(this.retryCount-1),5e3);return await new Promise(r=>setTimeout(r,i)),this.loadPromise=null,this.load()}throw this.state=Z.ERROR,p.publish(f.AUDIT_EVENT,{action:"lazy_component_load_failed",component:this.name,error:t.message,retryCount:this.retryCount}),t}}async loadDependencies(){if(this.dependencies.length===0)return;const e=this.dependencies.map(t=>typeof t=="string"?Ft.load(t):typeof t=="function"?t():t.load());await Promise.all(e)}getStatus(){var e;return{name:this.name,state:this.state,priority:this.priority,loadTime:this.loadTime,error:(e=this.error)==null?void 0:e.message,retryCount:this.retryCount}}}class Ft{constructor(){this.components=new Map,this.intersectionObserver=null,this.idleCallback=null,this.loadQueue={[k.CRITICAL]:[],[k.HIGH]:[],[k.NORMAL]:[],[k.LOW]:[]},this.isProcessingQueue=!1,this.initializeObservers()}initializeObservers(){"IntersectionObserver"in window&&(this.intersectionObserver=new IntersectionObserver(e=>this.handleIntersectionChanges(e),{rootMargin:"50px",threshold:.1})),this.scheduleIdleLoading()}register(e,t,i={}){const r=new _s(e,t,i);return this.components.set(e,r),this.loadQueue[r.priority].push(r),r.priority===k.CRITICAL&&this.processLoadQueue(),p.publish(f.AUDIT_EVENT,{action:"lazy_component_registered",component:e,priority:r.priority}),r}async load(e){const t=this.components.get(e);if(!t)throw new Error(`Component '${e}' not registered`);return t.load()}async preload(e=k.HIGH){const t=[k.CRITICAL,k.HIGH,k.NORMAL,k.LOW],i=t.slice(0,t.indexOf(e)+1),r=[];i.forEach(a=>{this.loadQueue[a].forEach(n=>{n.state===Z.PENDING&&r.push(n.load())})}),await Promise.allSettled(r),p.publish(f.AUDIT_EVENT,{action:"lazy_components_preloaded",priority:e,count:r.length})}observeElement(e,t){this.intersectionObserver&&(e.dataset.lazyComponent=t,this.intersectionObserver.observe(e))}handleIntersectionChanges(e){e.forEach(t=>{if(t.isIntersecting){const i=t.target.dataset.lazyComponent;i&&(this.load(i).catch(r=>{}),this.intersectionObserver.unobserve(t.target))}})}async processLoadQueue(){if(!this.isProcessingQueue){this.isProcessingQueue=!0;try{await this.processQueueByPriority(k.CRITICAL),await this.processQueueByPriority(k.HIGH)}catch(e){}finally{this.isProcessingQueue=!1}}}async processQueueByPriority(e){const i=this.loadQueue[e].filter(a=>a.state===Z.PENDING);if(i.length===0)return;const r=i.map(a=>a.load().catch(n=>null));await Promise.allSettled(r)}scheduleIdleLoading(){const e=()=>{"requestIdleCallback"in window?this.idleCallback=requestIdleCallback(t=>{this.processIdleQueue(t),e()},{timeout:5e3}):setTimeout(()=>{this.processIdleQueue({timeRemaining:()=>50}),e()},100)};e()}async processIdleQueue(e){const t=this.loadQueue[k.NORMAL],i=this.loadQueue[k.LOW],r=[...t.filter(a=>a.state===Z.PENDING),...i.filter(a=>a.state===Z.PENDING)];for(const a of r)if(e.timeRemaining()>10)try{await a.load()}catch(n){}else break}getStats(){const e={total:this.components.size,byState:{pending:0,loading:0,loaded:0,error:0},byPriority:{critical:0,high:0,normal:0,low:0},totalLoadTime:0,averageLoadTime:0};let t=0,i=0;return this.components.forEach(r=>{e.byState[r.state]++,e.byPriority[r.priority]++,r.loadTime&&(t+=r.loadTime,i++)}),e.totalLoadTime=t,e.averageLoadTime=i>0?t/i:0,e}async reload(e){const t=this.components.get(e);if(!t)throw new Error(`Component '${e}' not registered`);return t.state=Z.PENDING,t.component=null,t.error=null,t.loadTime=null,t.retryCount=0,t.loadPromise=null,t.load()}dispose(){this.intersectionObserver&&this.intersectionObserver.disconnect(),this.idleCallback&&cancelIdleCallback(this.idleCallback),this.components.clear(),Object.values(this.loadQueue).forEach(e=>e.length=0),p.publish(f.AUDIT_EVENT,{action:"lazy_loader_disposed"})}}class Ns{constructor(e){this.lazyLoader=e,this.registerMedicalComponents()}registerMedicalComponents(){this.lazyLoader.register("advanced-analytics",()=>ie(()=>import("./research-tools-D6-gi7wf.js").then(e=>e.g),__vite__mapDeps([0,1])),{priority:k.LOW}),this.lazyLoader.register("clinical-reporting",()=>ie(()=>import("./research-tools-D6-gi7wf.js").then(e=>e.f),__vite__mapDeps([0,1])),{priority:k.LOW}),this.lazyLoader.register("audit-trail",()=>ie(()=>import("./research-tools-D6-gi7wf.js").then(e=>e.h),__vite__mapDeps([0,1])),{priority:k.LOW}),this.lazyLoader.register("medical-service-worker",()=>ie(()=>import("./enterprise-features-DrM-1IqS.js").then(e=>e.e),__vite__mapDeps([2,1])),{priority:k.LOW}),this.lazyLoader.register("sw-manager",()=>ie(()=>import("./enterprise-features-DrM-1IqS.js").then(e=>e.d),__vite__mapDeps([2,1])),{priority:k.LOW}),this.lazyLoader.register("command-pattern",()=>ie(()=>Promise.resolve().then(()=>Ys),void 0),{priority:k.NORMAL}),this.lazyLoader.register("prediction-strategy",()=>ie(()=>Promise.resolve().then(()=>ea),void 0),{priority:k.NORMAL}),this.lazyLoader.register("validation-factory",()=>ie(()=>Promise.resolve().then(()=>ua),void 0),{priority:k.NORMAL})}async loadByClinicalPriority(e){switch(e){case"emergency":await this.lazyLoader.preload(k.HIGH);break;case"routine":await this.lazyLoader.preload(k.NORMAL);break;case"research":await this.lazyLoader.load("advanced-analytics"),await this.lazyLoader.load("clinical-reporting"),await this.lazyLoader.load("audit-trail");break;case"background":await this.lazyLoader.load("medical-service-worker"),await this.lazyLoader.load("sw-manager");break;default:await this.lazyLoader.preload(k.NORMAL)}}async preloadForModule(e){const i={coma:["command-pattern"],limited:["prediction-strategy"],full:["command-pattern","prediction-strategy","validation-factory"],research:["advanced-analytics","clinical-reporting","audit-trail"]}[e]||[],r=i.map(a=>this.lazyLoader.load(a));await Promise.allSettled(r),p.publish(f.AUDIT_EVENT,{action:"medical_components_preloaded",moduleType:e,components:i})}async loadEnterpriseFeatures(){const e=["medical-service-worker","sw-manager","advanced-analytics","clinical-reporting","audit-trail"],t=e.map(a=>this.lazyLoader.load(a).catch(n=>(console.warn(`Enterprise feature ${a} failed to load:`,n),null))),r=(await Promise.allSettled(t)).filter(a=>a.status==="fulfilled"&&a.value!==null).length;return p.publish(f.AUDIT_EVENT,{action:"enterprise_features_loaded",requested:e.length,loaded:r}),r}}const De=new Ft;new Ns(De);class Ps{constructor(){this.isInitialized=!1,this.phase3Status={serviceWorker:!1,performanceMonitor:!1,syncManager:!1,lazyLoader:!1},this.phase4Status={reportingSystem:!1,qualityMetrics:!1,auditTrail:!1}}async initialize(){return y(async()=>(await this.initializePhase3Features(),await this.initializePhase4Features(),this.isInitialized=!0,!0),e=>!1)}async initializePhase3Features(){return y(async()=>(await this.initializePerformanceMonitor(),this.initializeServiceWorker(),await this.initializeSyncManager(),await this.initializeProgressiveLoading(),!0),e=>!1)}async initializePerformanceMonitor(){return y(async()=>(H.start(),this.phase3Status.performanceMonitor=!0,!0),e=>(this.phase3Status.performanceMonitor=!1,!1))}async initializeServiceWorker(){y(async()=>{const e=await at.initialize();return this.phase3Status.serviceWorker=e,e&&await this.prefetchCriticalResources(),e},e=>(this.phase3Status.serviceWorker=!1,!1))}async initializeSyncManager(){return y(async()=>{const e=await rt.initialize();return this.phase3Status.syncManager=e,e},e=>(this.phase3Status.syncManager=!1,!1))}async initializeProgressiveLoading(){return y(async()=>(await De.preload("critical"),setTimeout(()=>this.setupViewportLoading(),100),this.phase3Status.lazyLoader=!0,!0),e=>(this.phase3Status.lazyLoader=!1,!1))}setupViewportLoading(){try{document.querySelectorAll(".brain-visualization-placeholder").forEach(i=>{De.observeElement(i,"brain-visualization")}),document.querySelectorAll(".stroke-center-map-placeholder").forEach(i=>{De.observeElement(i,"stroke-center-map")})}catch(e){}}async prefetchCriticalResources(){return y(async()=>{const e=["/0925/src/logic/lvo-local-model.js","/0925/src/logic/ich-volume-calculator.js","/0925/src/patterns/prediction-strategy.js","/0925/src/performance/medical-cache.js"];return await at.prefetchResources(e),!0},e=>!1)}async initializePhase4Features(){return y(async()=>(await this.initializeAuditTrail(),await this.initializeReportingSystem(),await this.initializeQualityMetrics(),this.setupPhase4EventHandlers(),!0),e=>!1)}async initializeAuditTrail(){return y(async()=>(await nt.initialize(),this.phase4Status.auditTrail=!0,!0),e=>(this.phase4Status.auditTrail=!1,!1))}async initializeReportingSystem(){return y(async()=>(ot.start(),this.phase4Status.reportingSystem=!0,!0),e=>(this.phase4Status.reportingSystem=!1,!1))}async initializeQualityMetrics(){return y(async()=>(await We.initialize(),this.phase4Status.qualityMetrics=!0,!0),e=>(this.phase4Status.qualityMetrics=!1,!1))}setupPhase4EventHandlers(){document.addEventListener("submit",async e=>{const t=e.target;t.dataset.module&&await y(async()=>{const i=new FormData(t),r=Object.fromEntries(i.entries());return this.phase4Status.auditTrail&&nt.logEvent("data_entry",{module:t.dataset.module,timestamp:new Date().toISOString(),data_points:Object.keys(r).length}),this.phase4Status.qualityMetrics&&(We.recordMetric("form_completion","count",1),We.recordMetric("data_quality","completeness",Object.values(r).filter(a=>a&&a.trim()).length/Object.keys(r).length*100)),!0},i=>!1)})}getStatus(){return{isInitialized:this.isInitialized,phase3:{...this.phase3Status,overall:Object.values(this.phase3Status).some(e=>e)},phase4:{...this.phase4Status,overall:Object.values(this.phase4Status).some(e=>e)},systemStatus:this.getSystemStatus()}}getSystemStatus(){return{serviceWorkerSupported:"serviceWorker"in navigator,indexedDBSupported:"indexedDB"in window,notificationSupported:"Notification"in window,cacheSupported:"caches"in window,webLockSupported:"locks"in navigator,performanceSupported:"performance"in window}}async restart(){return this.destroy(),this.initialize()}destroy(){var e,t,i,r,a,n;if(this.phase3Status.performanceMonitor)try{(t=(e=H).stop)==null||t.call(e)}catch(l){}if(this.phase3Status.syncManager)try{(r=(i=rt).destroy)==null||r.call(i)}catch(l){}if(this.phase4Status.reportingSystem)try{(n=(a=ot).stop)==null||n.call(a)}catch(l){}this.phase3Status={serviceWorker:!1,performanceMonitor:!1,syncManager:!1,lazyLoader:!1},this.phase4Status={reportingSystem:!1,qualityMetrics:!1,auditTrail:!1},this.isInitialized=!1}}class Ds{constructor(){this.container=null,this.unsubscribe=null,this.isInitialized=!1,this.uiManager=new Is,this.themeManager=new Ls,this.sessionManager=new Ms,this.advancedFeaturesManager=new Ps}async init(){return y(async()=>{if(C.info("Application initialization started",{category:b.SYSTEM,version:"2.1.0",userAgent:navigator.userAgent.substring(0,100)}),document.readyState==="loading")return C.debug("Waiting for DOM ready",{category:b.SYSTEM}),new Promise(e=>{document.addEventListener("DOMContentLoaded",()=>e(this.init()))});if(this.container=document.getElementById("appContainer"),!this.container)throw C.critical("App container not found",{category:b.SYSTEM,containerId:"appContainer"}),new Error("Critical initialization failure: App container not found");return C.debug("App container found",{category:b.SYSTEM}),O.isValidSession()||(C.info("No valid session, redirecting to login",{category:b.AUTHENTICATION}),m.navigate("login")),C.info("Initializing core features",{category:b.SYSTEM}),await this.initializeCoreFeatures(),C.info("Skipping advanced features initialization",{category:b.SYSTEM}),this.setupRenderingSystem(),C.debug("Initializing UI manager",{category:b.SYSTEM}),this.uiManager.initialize(this.container),C.debug("Initializing theme manager",{category:b.SYSTEM}),this.themeManager.initialize(),C.debug("Initializing session manager",{category:b.SYSTEM}),this.sessionManager.initialize(),ge(this.container),this.isInitialized=!0,C.info("Application initialization completed successfully",{category:b.SYSTEM,initializationTime:performance.now()}),!0},e=>{throw C.critical("Application initialization failed",{category:b.SYSTEM,error:e.message,stack:e.stack}),new Error(`App initialization failed: ${e.message}`)})}async initializeCoreFeatures(){return y(async()=>{const e=[this.uiManager.preloadCriticalComponents(),this.themeManager.loadSavedTheme(),this.sessionManager.validateStoredSession()],i=(await Promise.allSettled(e)).filter(r=>r.status==="rejected");if(i.length>0)throw new Error(`${i.length} core features failed to initialize`);return!0},e=>!1)}async initializeAdvancedFeatures(){y(async()=>(await this.advancedFeaturesManager.initialize(),!0),e=>!1)}setupRenderingSystem(){this.unsubscribe=m.subscribe(()=>{ge(this.container),setTimeout(()=>this.uiManager.updateResearchMode(),200)}),window.addEventListener("languageChanged",()=>{this.uiManager.updateLanguage(),ge(this.container)})}getStatus(){return{isInitialized:this.isInitialized,hasContainer:!!this.container,isAuthenticated:O.isValidSession(),ui:this.uiManager.getStatus(),theme:this.themeManager.getStatus(),session:this.sessionManager.getStatus(),advancedFeatures:this.advancedFeaturesManager.getStatus()}}destroy(){this.unsubscribe&&this.unsubscribe(),this.uiManager.destroy(),this.themeManager.destroy(),this.sessionManager.destroy(),this.advancedFeaturesManager.destroy(),this.isInitialized=!1}}async function xs(){const s=new Ds;try{return await s.init(),s}catch(e){throw new Error(`Failed to create application: ${e.message}`)}}const Os={BASE_URL:"/0925/",DEV:!1,MODE:"production",PROD:!0,SSR:!1};let V=null;async function zt(){return y(async()=>{V=await xs();const s=V.getStatus(),e=new CustomEvent("appInitialized",{detail:{timestamp:new Date().toISOString(),status:s,version:"2.1.0",build:"production"}});return document.dispatchEvent(e),V},s=>{throw $s(s),s})}function $s(s){const e=document.getElementById("appContainer");e&&(e.innerHTML=`
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 50vh;
        padding: 20px;
        text-align: center;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <div style="
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 24px;
          max-width: 500px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        ">
          <h2 style="color: #856404; margin: 0 0 16px 0;">
            ⚠️ Application Initialization Failed
          </h2>
          <p style="color: #856404; margin: 0 0 16px 0; line-height: 1.5;">
            The medical triage system could not start properly.
            This may be due to a network issue or browser compatibility problem.
          </p>
          <button
            onclick="window.location.reload()"
            style="
              background: #007bff;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 6px;
              font-size: 16px;
              cursor: pointer;
              margin-right: 12px;
            "
          >
            🔄 Reload Application
          </button>
          <button
            onclick="window.open('mailto:bosdeepak@gmail.com?subject=iGFAP App Error', '_blank')"
            style="
              background: #6c757d;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 6px;
              font-size: 16px;
              cursor: pointer;
            "
          >
            📧 Report Issue
          </button>
        </div>
        <small style="color: #6c757d; margin-top: 20px;">
          Error: ${s.message||"Unknown initialization error"}
        </small>
      </div>
    `);const t=new CustomEvent("appInitializationFailed",{detail:{error:s.message,timestamp:new Date().toISOString(),userAgent:navigator.userAgent.substring(0,100)}});document.dispatchEvent(t)}function St(){if(V)try{V.destroy()}catch(s){}}function Fs(){document.addEventListener("visibilitychange",()=>{V&&document.visibilityState==="visible"&&(V.getStatus().isAuthenticated||window.location.reload())}),window.addEventListener("beforeunload",St),window.addEventListener("unload",St)}async function Et(){try{try{if(["localhost","127.0.0.1","0.0.0.0"].includes(window.location.hostname)&&!(import.meta&&Os&&!1)&&"serviceWorker"in navigator){const t=await navigator.serviceWorker.getRegistrations();for(const i of t)try{await i.unregister()}catch(r){}window.addEventListener("beforeinstallprompt",i=>{i.preventDefault()})}}catch(e){}Fs(),await zt();const s=new CustomEvent("appReady",{detail:{timestamp:new Date().toISOString(),version:"2.1.0"}});document.dispatchEvent(s)}catch(s){}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Et):Et();typeof window!="undefined"&&(window.iGFAPApp={getApp:()=>V,getStatus:()=>(V==null?void 0:V.getStatus())||{error:"App not initialized"},restart:async()=>(V&&V.destroy(),zt()),getCurrentScreen:()=>{try{return m.getState().currentScreen}catch(s){return"unknown"}},forceResults:()=>{try{m.navigate("results");const s=document.getElementById("appContainer");return s&&ge(s),!0}catch(s){return!1}}});function Oa(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}function Pe(s){return getComputedStyle(document.documentElement).getPropertyValue(s).trim()}function zs({percent:s=0,level:e="normal"}){const t=Se.useRef(null),i=Se.useRef(null);return Se.useEffect(()=>{const r=t.current,a=r==null?void 0:r.parentElement;if(!a||!r)return;i.current=a;const n=()=>{const h=window.devicePixelRatio||1,d=a.offsetWidth||120;r.width=Math.max(1,Math.floor(d*h)),r.height=Math.max(1,Math.floor(d*h));const u=r.getContext("2d");u.setTransform(1,0,0,1,0,0),u.scale(h,h);const v=d,w=d,_=v/2,M=w/2,$=d/2-8,R=Math.min(Math.max($*.12,6),12),X=Math.max(R-2,6),ee=R%2===1?$-.5:$;u.clearRect(0,0,v,w);const G=document.body.classList.contains("dark-mode"),ce=Pe("--border-color")||(G?"#2f3336":"#dee2e6");u.save(),u.globalAlpha=G?.36:.65,u.strokeStyle=ce,u.lineWidth=X,u.lineCap="round",u.beginPath(),u.arc(_,M,ee,0,Math.PI*2),u.stroke(),u.restore();let W=Pe("--primary-color");e==="high"&&(W=Pe("--warning-color")||"#ff9800"),e==="critical"&&(W=Pe("--danger-color")||"#DC143C"),G&&W.includes("#")&&(e==="high"&&(W="#ffaa00"),e==="critical"&&(W="#ff1744"));const F=-Math.PI/2,U=F+Math.PI*2*(Math.max(0,Math.min(100,s))/100);u.save(),u.strokeStyle=G?"rgba(0,0,0,0.3)":"rgba(0,0,0,0.15)",u.lineWidth=R+1.5,u.beginPath(),u.arc(_,M,ee,F,U,!1),u.stroke(),u.restore(),u.strokeStyle=W,u.lineWidth=R,u.beginPath(),u.arc(_,M,ee,F,U,!1),u.stroke()},l=requestAnimationFrame(n),c=new ResizeObserver(()=>requestAnimationFrame(n));return c.observe(a),()=>{cancelAnimationFrame(l),c.disconnect()}},[s,e]),se.createElement(se.Fragment,null,se.createElement("div",{className:"probability-number"},Math.round(s),se.createElement("span",null,"%")),se.createElement("canvas",{ref:t,className:"probability-canvas"}))}function Bs({lvoProb:s=0,ichProb:e=0,title:t="Decision Support – LVO/ICH"}){const i=Se.useRef(null);return Se.useEffect(()=>{const r=i.current;if(!r)return;const a=r.getContext("2d");let n=null,l=.5;const h=Math.max(e,.5),d=s/h,w=Math.max(.5,Math.min(2,d)),_=(Math.log2(w)+1)/2,M=Math.abs(s-e),$=Math.max(s,e);let R=M<10?Math.round(30+$*.3):M<20?Math.round(50+$*.4):Math.round(70+$*.3);R=Math.max(0,Math.min(100,R));const X=()=>{const ee=window.devicePixelRatio||1,G=r.getBoundingClientRect(),ce=G.width||300,W=G.height||200;r.width=Math.max(1,Math.floor(ce*ee)),r.height=Math.max(1,Math.floor(W*ee)),a.setTransform(1,0,0,1,0,0),a.scale(ee,ee);const F=ce,U=W,q=F<480,Te=F>=480&&F<1024,j=q?12:Te?14:16,de=15,Vt=F/2-de-j/2,je=U/2-de-j/2,Ut=Te?Math.min(je,U*.42):je,A=Math.max(10,Math.min(Vt,Ut)),g=F/2,S=U-(de+j/2+A);a.clearRect(0,0,F,U);const z=document.body.classList.contains("dark-mode"),Qe={day:{bezel:"#e8eaed",bezelShadow:"#c1c7cd",track:"#f5f7fa",ich:"#8b1538",lvo:"#1e3a5f",neutral:"#6b7280",needle:"#d4af37",text:"#374151",tickMajor:"#4b5563",tickMinor:"#9ca3af"},night:{bezel:"#2d3036",bezelShadow:"#1a1d23",track:"#383c42",ich:"#dc2626",lvo:"#3b82f6",neutral:"#64748b",needle:"#fbbf24",text:"#f3f4f6",tickMajor:"#d1d5db",tickMinor:"#6b7280"}},N=z?Qe.night:Qe.day,ye=a.createLinearGradient(g-A,S-A,g+A,S+A);ye.addColorStop(0,N.bezel),ye.addColorStop(.3,N.bezelShadow),ye.addColorStop(.7,N.bezel),ye.addColorStop(1,N.bezelShadow),a.strokeStyle=ye,a.lineWidth=j+4,a.lineCap="round",a.beginPath(),a.arc(g,S,A+2,0,Math.PI,!1),a.stroke(),a.strokeStyle=N.track,a.lineWidth=j,a.beginPath(),a.arc(g,S,A,0,Math.PI,!1),a.stroke();const Fe=60,Je=Math.PI/Fe;for(let L=0;L<Fe;L++){const P=L/(Fe-1),I=L*Je,B=Math.min((L+1)*Je,Math.PI);let D,be,Ge;if(P<=.5){const ue=P*2;D=Math.round(0+242*ue),be=Math.round(154+66*ue),Ge=Math.round(255*(1-ue))}else{const ue=(P-.5)*2;D=Math.round(242+13*ue),be=Math.round(220*(1-ue)),Ge=Math.round(0)}const jt=`rgba(${D}, ${be}, ${Ge}, 0.85)`;a.strokeStyle=jt,a.lineWidth=j-4,a.beginPath(),a.arc(g,S,A,I,B,!1),a.stroke()}const Gt=[.5,.75,1,1.5,2],Wt=q?[]:[.6,.9,1.2,1.8];Gt.forEach(L=>{const P=(Math.log2(L)+1)/2,I=Math.PI-P*Math.PI,B=A-12,D=A-24;a.strokeStyle=N.tickMajor,a.lineWidth=1.5,a.lineCap="round",a.beginPath(),a.moveTo(g+Math.cos(I)*B,S+Math.sin(I)*B),a.lineTo(g+Math.cos(I)*D,S+Math.sin(I)*D),a.stroke(),a.fillStyle=N.text;const be=q?13:15;a.font=`600 ${be}px "SF Pro Display", system-ui, sans-serif`,a.textAlign="center",a.textBaseline="middle",a.fillText(L.toFixed(1),g+Math.cos(I)*(A-35),S+Math.sin(I)*(A-35))}),Wt.forEach(L=>{const P=(Math.log2(L)+1)/2,I=Math.PI-P*Math.PI,B=A-8,D=A-16;a.strokeStyle=N.tickMinor,a.lineWidth=.8,a.lineCap="round",a.beginPath(),a.moveTo(g+Math.cos(I)*B,S+Math.sin(I)*B),a.lineTo(g+Math.cos(I)*D,S+Math.sin(I)*D),a.stroke()}),[{val:.77,label:"ICH",side:"left"},{val:1.3,label:"LVO",side:"right"}].forEach(L=>{const P=(Math.log2(L.val)+1)/2,I=Math.PI-P*Math.PI,B=A-2,D=A+12;a.strokeStyle=L.side==="left"?N.ich:N.lvo,a.lineWidth=2,a.setLineDash([3,2]),a.beginPath(),a.moveTo(g+Math.cos(I)*B,S+Math.sin(I)*B),a.lineTo(g+Math.cos(I)*D,S+Math.sin(I)*D),a.stroke(),a.setLineDash([])});const qt=q?15:17,Ce=q?A+35:A+42;a.fillStyle=z?"#ff4444":"#ff0000",a.font=`700 ${qt}px "SF Pro Display", system-ui, sans-serif`,a.textAlign="center",a.textBaseline="middle",z&&(a.shadowColor="rgba(0,0,0,0.8)",a.shadowBlur=3,a.shadowOffsetY=1),a.fillText("ICH",g+Math.cos(Math.PI)*Ce,S+Math.sin(Math.PI)*Ce-10),a.fillStyle=z?"#4499ff":"#0099ff",a.fillText("LVO",g+Math.cos(0)*Ce,S+Math.sin(0)*Ce-10),a.shadowBlur=0,a.shadowOffsetY=0,l+=(_-l)*.12;const ae=Math.PI-l*Math.PI,ne=Math.max(0,A-j/2-6),Ze=(1-R/100)*(Math.PI*.05);a.save(),a.globalAlpha=z?.2:.25,a.fillStyle=N.neutral,a.beginPath(),a.moveTo(g,S),a.arc(g,S,ne*.85,ae-Ze,ae+Ze,!1),a.closePath(),a.fill(),a.restore();const Q=N.needle,Kt=performance.now(),Ae=a.createLinearGradient(g,S,g+Math.cos(ae)*ne,S+Math.sin(ae)*ne);Ae.addColorStop(0,Q+"ff"),Ae.addColorStop(.7,Q+"dd"),Ae.addColorStop(1,Q+"bb"),a.strokeStyle=Ae,a.lineWidth=2.5,a.lineCap="round",a.shadowColor=z?"rgba(0,0,0,0.8)":"rgba(0,0,0,0.3)",a.shadowBlur=4,a.shadowOffsetY=2,a.beginPath(),a.moveTo(g,S),a.lineTo(g+Math.cos(ae)*ne,S+Math.sin(ae)*ne),a.stroke(),a.shadowBlur=0,a.shadowOffsetY=0;const ze=g+Math.cos(ae)*ne,Be=S+Math.sin(ae)*ne,Ie=.6+.4*Math.sin(Kt*.006),He=3+Ie*2;a.save(),a.globalAlpha=.15+Ie*.25,a.fillStyle=Q,a.beginPath(),a.arc(ze,Be,He*3.5,0,Math.PI*2),a.fill(),a.restore(),a.save(),a.globalAlpha=.4+Ie*.3,a.fillStyle=Q,a.beginPath(),a.arc(ze,Be,He*1.8,0,Math.PI*2),a.fill(),a.restore(),a.fillStyle=Q,a.shadowColor=Q,a.shadowBlur=4+Ie*6,a.beginPath(),a.arc(ze,Be,He,0,Math.PI*2),a.fill(),a.shadowBlur=0;const Ve=14,Xe=8,Le=a.createRadialGradient(g,S,0,g,S,Ve);Le.addColorStop(0,z?"#4a5568":"#718096"),Le.addColorStop(.7,z?"#2d3748":"#4a5568"),Le.addColorStop(1,z?"#1a202c":"#2d3748"),a.fillStyle=Le,a.beginPath(),a.arc(g,S,Ve,0,Math.PI*2),a.fill();const Ue=a.createRadialGradient(g,S,0,g,S,Xe);Ue.addColorStop(0,Q+"aa"),Ue.addColorStop(1,Q+"44"),a.fillStyle=Ue,a.beginPath(),a.arc(g,S,Xe,0,Math.PI*2),a.fill(),a.strokeStyle=Q,a.lineWidth=1,a.beginPath(),a.arc(g,S,Ve-1,0,Math.PI*2),a.stroke();const Yt=q?18:22,et=S-A*.65,tt=q?60:80,it=q?24:30;if(a.save(),a.globalAlpha=z?.9:.95,a.fillStyle=z?"#1f2937":"#ffffff",a.shadowColor=z?"rgba(0,0,0,0.5)":"rgba(0,0,0,0.2)",a.shadowBlur=8,a.shadowOffsetY=2,a.fillRect(g-tt/2,et-it/2,tt,it),a.restore(),a.fillStyle=N.text,a.font=`700 ${Yt}px "SF Mono", ui-monospace, monospace`,a.textAlign="center",a.textBaseline="middle",a.fillText(w.toFixed(2),g,et),!q){const L=S+A*.15,P=60,I=4;a.fillStyle=z?"#374151":"#e5e7eb",a.fillRect(g-P/2,L,P,I);const B=R/100*P,D=a.createLinearGradient(g-P/2,L,g-P/2+B,L);D.addColorStop(0,N.neutral),D.addColorStop(1,N.needle),a.fillStyle=D,a.fillRect(g-P/2,L,B,I),a.fillStyle=N.text,a.font='500 11px "SF Pro Display", system-ui, sans-serif',a.textAlign="center",a.fillText(`${R}% confidence`,g,L+18)}n=requestAnimationFrame(X)};return X(),()=>{n&&cancelAnimationFrame(n)}},[s,e]),se.createElement("div",{className:"gauge-wrapper"},se.createElement("canvas",{ref:i,className:"gauge-canvas"}))}function Hs(){document.querySelectorAll("[data-react-ring]").forEach(s=>{if(s.__mounted)return;const e=parseFloat(s.getAttribute("data-percent"))||0,t=s.getAttribute("data-level")||"normal",i=lt(s);i.render(se.createElement(zs,{percent:e,level:t})),s.__mounted=!0,s.__root=i}),document.querySelectorAll("[data-react-tachometer]").forEach(s=>{if(s.__mounted)return;const e=parseFloat(s.getAttribute("data-ich"))||0,t=parseFloat(s.getAttribute("data-lvo"))||0,i=s.getAttribute("data-title")||"Decision Support – LVO/ICH",r=lt(s);r.render(se.createElement(Bs,{ichProb:e,lvoProb:t,title:i})),s.__mounted=!0,s.__root=r})}const Vs=Object.freeze(Object.defineProperty({__proto__:null,mountIslands:Hs},Symbol.toStringTag,{value:"Module"}));class fe{constructor(e,t,i={}){this.name=e,this.description=t,this.metadata={...i,id:`cmd_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,timestamp:new Date().toISOString()},this.executed=!1,this.undone=!1}async execute(){if(this.executed&&!this.undone)throw new Error(`Command ${this.name} has already been executed`);try{p.publish(f.AUDIT_EVENT,{action:"command_execute_start",command:this.name,commandId:this.metadata.id});const e=await this.doExecute();return this.executed=!0,this.undone=!1,p.publish(f.AUDIT_EVENT,{action:"command_execute_success",command:this.name,commandId:this.metadata.id}),e}catch(e){throw p.publish(f.AUDIT_EVENT,{action:"command_execute_error",command:this.name,commandId:this.metadata.id,error:e.message}),e}}async undo(){if(!this.executed||this.undone)throw new Error(`Command ${this.name} cannot be undone`);try{p.publish(f.AUDIT_EVENT,{action:"command_undo_start",command:this.name,commandId:this.metadata.id});const e=await this.doUndo();return this.undone=!0,p.publish(f.AUDIT_EVENT,{action:"command_undo_success",command:this.name,commandId:this.metadata.id}),e}catch(e){throw p.publish(f.AUDIT_EVENT,{action:"command_undo_error",command:this.name,commandId:this.metadata.id,error:e.message}),e}}async doExecute(){throw new Error("doExecute() must be implemented by concrete command")}async doUndo(){throw new Error("doUndo() must be implemented by concrete command")}canUndo(){return this.executed&&!this.undone}getSummary(){return{name:this.name,description:this.description,id:this.metadata.id,timestamp:this.metadata.timestamp,executed:this.executed,undone:this.undone}}}class Us extends fe{constructor(e,t,i,r){super("UPDATE_PATIENT_DATA",`Update ${e} from ${i} to ${t}`,{fieldName:e,newValue:t,previousValue:i}),this.fieldName=e,this.newValue=t,this.previousValue=i,this.store=r}async doExecute(){const e=this.store.getFormData("current")||{};return e[this.fieldName]=this.newValue,this.store.setFormData("current",e),p.publish(f.PATIENT_DATA_UPDATED,{field:this.fieldName,newValue:this.newValue,previousValue:this.previousValue}),{field:this.fieldName,value:this.newValue}}async doUndo(){const e=this.store.getFormData("current")||{};return this.previousValue===null||this.previousValue===void 0?delete e[this.fieldName]:e[this.fieldName]=this.previousValue,this.store.setFormData("current",e),p.publish(f.PATIENT_DATA_UPDATED,{field:this.fieldName,newValue:this.previousValue,previousValue:this.newValue,action:"undo"}),{field:this.fieldName,value:this.previousValue}}}class Gs extends fe{constructor(e,t,i){super("NAVIGATE",`Navigate from ${t} to ${e}`,{targetScreen:e,sourceScreen:t}),this.targetScreen=e,this.sourceScreen=t,this.store=i}async doExecute(){return this.store.navigate(this.targetScreen),p.publish(f.NAVIGATION_CHANGED,{from:this.sourceScreen,to:this.targetScreen}),{from:this.sourceScreen,to:this.targetScreen}}async doUndo(){return this.store.navigate(this.sourceScreen),p.publish(f.NAVIGATION_CHANGED,{from:this.targetScreen,to:this.sourceScreen,action:"undo"}),{from:this.targetScreen,to:this.sourceScreen}}}class Ws extends fe{constructor(e,t,i){super("SUBMIT_FORM",`Submit ${t} form for prediction`,{moduleType:t,formFields:Object.keys(e)}),this.formData={...e},this.moduleType=t,this.predictionStrategy=i,this.results=null}async doExecute(){return this.predictionStrategy.setStrategy(this.getStrategyName()),this.results=await this.predictionStrategy.predict(this.formData),p.publish(f.FORM_SUBMITTED,{moduleType:this.moduleType,fieldsCount:Object.keys(this.formData).length,success:!0}),this.results}async doUndo(){return this.results=null,p.publish(f.FORM_SUBMITTED,{moduleType:this.moduleType,action:"undo"}),null}getStrategyName(){switch(this.moduleType){case"coma":return"COMA_ICH";case"limited":return"LIMITED_DATA_ICH";case"full":return"FULL_STROKE";default:throw new Error(`Unknown module type: ${this.moduleType}`)}}}class qs extends fe{constructor(e,t){super("CLEAR_DATA",`Clear ${e} data for privacy compliance`,{dataType:e}),this.dataType=e,this.store=t,this.backupData=null}async doExecute(){switch(this.backupData=this.store.getState(),this.dataType){case"all":this.store.reset();break;case"forms":this.store.clearFormData();break;case"results":this.store.clearResults();break;default:throw new Error(`Unknown data type: ${this.dataType}`)}return p.publish(f.AUDIT_EVENT,{action:"data_cleared",dataType:this.dataType}),{dataType:this.dataType,cleared:!0}}async doUndo(){if(this.backupData)return this.store.setState(this.backupData),p.publish(f.AUDIT_EVENT,{action:"data_restored",dataType:this.dataType}),{dataType:this.dataType,restored:!0};throw new Error("Cannot undo data clear: backup not available")}}class Bt{constructor(){this.commandHistory=[],this.currentIndex=-1,this.maxHistorySize=100}async executeCommand(e){if(!(e instanceof fe))throw new Error("Command must extend MedicalCommand");const t=await e.execute();return this.commandHistory=this.commandHistory.slice(0,this.currentIndex+1),this.commandHistory.push(e),this.currentIndex=this.commandHistory.length-1,this.commandHistory.length>this.maxHistorySize&&(this.commandHistory.shift(),this.currentIndex-=1),t}async undo(){if(this.currentIndex<0)throw new Error("No commands to undo");const e=this.commandHistory[this.currentIndex];if(!e.canUndo())throw new Error(`Command ${e.name} cannot be undone`);const t=await e.undo();return this.currentIndex-=1,t}async redo(){if(this.currentIndex>=this.commandHistory.length-1)throw new Error("No commands to redo");return this.currentIndex+=1,await this.commandHistory[this.currentIndex].execute()}canUndo(){return this.currentIndex>=0&&this.commandHistory[this.currentIndex]&&this.commandHistory[this.currentIndex].canUndo()}canRedo(){return this.currentIndex<this.commandHistory.length-1}getCommandHistory(){return this.commandHistory.map(e=>e.getSummary())}clearHistory(){this.commandHistory=[],this.currentIndex=-1}getStats(){return{totalCommands:this.commandHistory.length,currentIndex:this.currentIndex,canUndo:this.canUndo(),canRedo:this.canRedo(),executedCommands:this.currentIndex+1}}}const Ks=new Bt,Ys=Object.freeze(Object.defineProperty({__proto__:null,ClearDataCommand:qs,MedicalCommand:fe,MedicalCommandInvoker:Bt,NavigationCommand:Gs,SubmitFormCommand:Ws,UpdatePatientDataCommand:Us,medicalCommandInvoker:Ks},Symbol.toStringTag,{value:"Module"}));class $e{constructor(e,t){this.name=e,this.description=t,this.requiredFields=[],this.optionalFields=[]}validateInput(e){const t=[],i=[];return this.requiredFields.forEach(r=>{(!(r in e)||e[r]===null||e[r]===void 0)&&i.push(r)}),i.length>0&&t.push(`Missing required fields: ${i.join(", ")}`),{isValid:t.length===0,errors:t,missingFields:i}}preprocessInput(e){return{...e}}async predict(e){throw new Error("predict() method must be implemented by concrete strategy")}postprocessResult(e,t){return{...e,strategy:this.name,timestamp:new Date().toISOString(),inputSummary:this.createInputSummary(t)}}createInputSummary(e){const t={};return[...this.requiredFields,...this.optionalFields].forEach(i=>{i in e&&(t[i]=typeof e[i])}),t}}class js extends $e{constructor(){super("COMA_ICH","ICH prediction for comatose patients"),this.requiredFields=["gfap"],this.optionalFields=["age","symptoms_duration"]}preprocessInput(e){return{gfap:parseFloat(e.gfap),patientType:"comatose"}}async predict(e){const t=this.validateInput(e);if(!t.isValid)throw new Error(`Validation failed: ${t.errors.join(", ")}`);const i=this.preprocessInput(e);p.publish(f.ASSESSMENT_STARTED,{strategy:this.name,inputFields:Object.keys(i)});try{const r=await Tt(i),a=this.postprocessResult(r,e);return p.publish(f.RESULTS_GENERATED,{strategy:this.name,success:!0,confidence:a.confidence}),a}catch(r){throw p.publish(f.SECURITY_EVENT,{type:"prediction_error",strategy:this.name,error:r.message}),r}}}class Qs extends $e{constructor(){super("LIMITED_DATA_ICH","ICH prediction with limited clinical data"),this.requiredFields=["gfap","age","systolic_bp","diastolic_bp"],this.optionalFields=["weakness_sudden","speech_sudden","vigilanzminderung"]}preprocessInput(e){return{gfap:parseFloat(e.gfap),age:parseInt(e.age,10),systolic_bp:parseFloat(e.systolic_bp),diastolic_bp:parseFloat(e.diastolic_bp),weakness_sudden:e.weakness_sudden===!0||e.weakness_sudden==="true",speech_sudden:e.speech_sudden===!0||e.speech_sudden==="true",vigilanzminderung:e.vigilanzminderung===!0||e.vigilanzminderung==="true"}}async predict(e){const t=this.validateInput(e);if(!t.isValid)throw new Error(`Validation failed: ${t.errors.join(", ")}`);const i=this.preprocessInput(e);p.publish(f.ASSESSMENT_STARTED,{strategy:this.name,inputFields:Object.keys(i)});try{const r=await wt(i),a=this.postprocessResult(r,e);return p.publish(f.RESULTS_GENERATED,{strategy:this.name,success:!0,confidence:a.confidence}),a}catch(r){throw p.publish(f.SECURITY_EVENT,{type:"prediction_error",strategy:this.name,error:r.message}),r}}}class Js extends $e{constructor(){super("FULL_STROKE","Comprehensive stroke prediction with full clinical data"),this.requiredFields=["gfap","age","systolic_bp","diastolic_bp","fast_ed_score","sex","facialtwitching","armparese","speechdeficit","gaze","agitation"],this.optionalFields=["strokeOnsetKnown","medical_history"]}preprocessInput(e){return{gfap:parseFloat(e.gfap),age:parseInt(e.age,10),systolic_bp:parseFloat(e.systolic_bp),diastolic_bp:parseFloat(e.diastolic_bp),fast_ed_score:parseInt(e.fast_ed_score,10),sex:e.sex==="male"?1:0,facialtwitching:e.facialtwitching===!0||e.facialtwitching==="true",armparese:e.armparese===!0||e.armparese==="true",speechdeficit:e.speechdeficit===!0||e.speechdeficit==="true",gaze:e.gaze===!0||e.gaze==="true",agitation:e.agitation===!0||e.agitation==="true",strokeOnsetKnown:e.strokeOnsetKnown===!0||e.strokeOnsetKnown==="true"}}async predict(e){const t=this.validateInput(e);if(!t.isValid)throw new Error(`Validation failed: ${t.errors.join(", ")}`);const i=this.preprocessInput(e);p.publish(f.ASSESSMENT_STARTED,{strategy:this.name,inputFields:Object.keys(i)});try{const r=await kt(i),a=this.postprocessResult(r,e);return p.publish(f.RESULTS_GENERATED,{strategy:this.name,success:!0,confidence:a.confidence}),a}catch(r){throw p.publish(f.SECURITY_EVENT,{type:"prediction_error",strategy:this.name,error:r.message}),r}}}class Ht{constructor(){this.strategies=new Map,this.currentStrategy=null,this.predictionHistory=[],this.registerStrategy(new js),this.registerStrategy(new Qs),this.registerStrategy(new Js)}registerStrategy(e){if(!(e instanceof $e))throw new Error("Strategy must extend PredictionStrategy");this.strategies.set(e.name,e)}setStrategy(e){const t=this.strategies.get(e);if(!t)throw new Error(`Unknown strategy: ${e}`);this.currentStrategy=t}async predict(e){if(!this.currentStrategy)throw new Error("No prediction strategy selected");const t=performance.now();try{const i=await this.currentStrategy.predict(e),r=performance.now()-t;return this.predictionHistory.push({strategy:this.currentStrategy.name,timestamp:new Date().toISOString(),duration:r,success:!0}),i}catch(i){const r=performance.now()-t;throw this.predictionHistory.push({strategy:this.currentStrategy.name,timestamp:new Date().toISOString(),duration:r,success:!1,error:i.message}),i}}getAvailableStrategies(){return Array.from(this.strategies.keys())}getStrategyInfo(e){const t=this.strategies.get(e);return t?{name:t.name,description:t.description,requiredFields:t.requiredFields,optionalFields:t.optionalFields}:null}getPredictionHistory(){return[...this.predictionHistory]}clearHistory(){this.predictionHistory=[]}}const Zs=new Ht,Xs={COMA_ICH:"COMA_ICH",LIMITED_DATA_ICH:"LIMITED_DATA_ICH",FULL_STROKE:"FULL_STROKE"},ea=Object.freeze(Object.defineProperty({__proto__:null,PREDICTION_STRATEGIES:Xs,PredictionContext:Ht,predictionContext:Zs},Symbol.toStringTag,{value:"Module"}));class ta{constructor(e,t=!1){this.name=e,this.required=t,this.validators=[],this.medicalChecks=[]}addValidator(e){return this.validators.push(e),this}addMedicalCheck(e){return this.medicalChecks.push(e),this}validate(e,t=null){const i=[];this.required&&!e&&e!==0&&i.push("This field is required");for(const r of this.validators){const a=r(e);a&&i.push(a)}for(const r of this.medicalChecks){const a=r(e,t);a&&i.push(a)}return i}toConfig(){return{required:this.required,validate:(e,t)=>this.validate(e,t)}}}class we extends ta{constructor(e,t=!1,i=null,r=null){super(e,t),this.min=i,this.max=r,this.type="number",i!==null&&this.addValidator(a=>a!==""&&!isNaN(a)&&parseFloat(a)<i?`Value must be at least ${i}`:null),r!==null&&this.addValidator(a=>a!==""&&!isNaN(a)&&parseFloat(a)>r?`Value must be at most ${r}`:null)}toConfig(){return{...super.toConfig(),min:this.min,max:this.max,type:this.type}}}class ia extends we{constructor(e,t,i){super(e,!0,i.min,i.max),this.biomarkerType=t,this.ranges=i,this.addMedicalCheck(r=>{const a=parseFloat(r);return isNaN(a)?null:t==="GFAP"&&a>i.critical?"Extremely high GFAP value - please verify lab result":null})}}class sa extends we{constructor(e,t,i,r){super(e,!0,i,r),this.vitalType=t,this.addMedicalCheck((a,n)=>{const l=parseFloat(a);if(isNaN(l))return null;switch(t){case"SYSTOLIC_BP":if(n!=null&&n.diastolic_bp){const c=parseFloat(n.diastolic_bp);if(!isNaN(c)&&l<=c)return"Systolic BP must be higher than diastolic BP"}break;case"DIASTOLIC_BP":if(n!=null&&n.systolic_bp){const c=parseFloat(n.systolic_bp);if(!isNaN(c)&&l>=c)return"Diastolic BP must be lower than systolic BP"}break}return null})}}class aa extends we{constructor(e){super(e,!0,0,120),this.addMedicalCheck(t=>{const i=parseFloat(t);return isNaN(i)?null:i<18?"Emergency stroke assessment typically for adults (≥18 years)":null})}}class ra extends we{constructor(e,t,i,r){super(e,!0,i,r),this.scaleType=t,this.addMedicalCheck(a=>{const n=parseFloat(a);if(isNaN(n))return null;switch(t){case"GCS":if(n<8)return"GCS < 8 indicates severe consciousness impairment - consider coma module";break;case"FAST_ED":if(n>=4)return"High FAST-ED score suggests LVO - consider urgent intervention";break}return null})}}class na{static createRule(e,t,i={}){switch(e){case"AGE":return new aa(t);case"BIOMARKER":if(i.biomarkerType==="GFAP")return new ia(t,"GFAP",K);throw new Error(`Unsupported biomarker type: ${i.biomarkerType}`);case"VITAL_SIGN":return new sa(t,i.vitalType,i.min,i.max);case"CLINICAL_SCALE":return new ra(t,i.scaleType,i.min,i.max);case"NUMERIC":return new we(t,i.required,i.min,i.max);default:throw new Error(`Unsupported validation rule type: ${e}`)}}static createModuleValidation(e){const t={};switch(e){case"LIMITED":t.age_years=this.createRule("AGE","age_years").toConfig(),t.systolic_bp=this.createRule("VITAL_SIGN","systolic_bp",{vitalType:"SYSTOLIC_BP",min:60,max:300}).toConfig(),t.diastolic_bp=this.createRule("VITAL_SIGN","diastolic_bp",{vitalType:"DIASTOLIC_BP",min:30,max:200}).toConfig(),t.gfap_value=this.createRule("BIOMARKER","gfap_value",{biomarkerType:"GFAP"}).toConfig();break;case"FULL":Object.assign(t,this.createModuleValidation("LIMITED")),t.fast_ed_score=this.createRule("CLINICAL_SCALE","fast_ed_score",{scaleType:"FAST_ED",min:0,max:9}).toConfig();break;case"COMA":t.gfap_value=this.createRule("BIOMARKER","gfap_value",{biomarkerType:"GFAP"}).toConfig(),t.gcs=this.createRule("CLINICAL_SCALE","gcs",{scaleType:"GCS",min:3,max:15}).toConfig();break;default:throw new Error(`Unsupported module type: ${e}`)}return t}static validateModule(e,t){const i=this.createModuleValidation(t),r={};let a=!0;return Object.entries(i).forEach(([n,l])=>{const c=e[n],h=l.validate(c,e);h.length>0&&(r[n]=h,a=!1)}),{isValid:a,validationErrors:r}}}const oa={AGE:"AGE",BIOMARKER:"BIOMARKER",VITAL_SIGN:"VITAL_SIGN",CLINICAL_SCALE:"CLINICAL_SCALE",NUMERIC:"NUMERIC"},la={GFAP:"GFAP"},ca={SYSTOLIC_BP:"SYSTOLIC_BP",DIASTOLIC_BP:"DIASTOLIC_BP"},da={GCS:"GCS",FAST_ED:"FAST_ED"},ua=Object.freeze(Object.defineProperty({__proto__:null,BIOMARKER_TYPES:la,CLINICAL_SCALE_TYPES:da,MedicalValidationFactory:na,VALIDATION_RULE_TYPES:oa,VITAL_SIGN_TYPES:ca},Symbol.toStringTag,{value:"Module"}));export{Re as A,ns as C,he as D,E,b as L,x as M,Pa as R,Ea as V,T as a,ka as b,Nt as c,Da as d,Oa as g,Li as l,C as m,xa as p,y as s,o as t};
//# sourceMappingURL=index-BBmQgakm.js.map
