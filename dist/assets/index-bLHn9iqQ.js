const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/research-tools-DfKHAme-.js","assets/medical-core-Bzh3BI-O.js","assets/enterprise-features-DOrIKDK9.js"])))=>i.map(i=>d[i]);
var ar=Object.defineProperty;var sr=(a,e,t)=>e in a?ar(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t;var be=(a,e,t)=>sr(a,typeof e!="symbol"?e+"":e,t);import{s as g,v as ir,b as nr,a as O,P as Ke,m as y,M as b}from"./medical-core-Bzh3BI-O.js";import{p as Ct,a as It,b as Lt,A as or,e as Mt,c as lr,w as cr}from"./prediction-models-DkrcyEmP.js";import{R as $,r as nt,c as ot}from"./vendor-BrzQuFJh.js";import{s as ve,a as de,b as Le,g as lt,m as ct,c as dt}from"./enterprise-features-DOrIKDK9.js";import{i as xe,s as dr,c as ur,r as _t,a as Rt,b as mr,d as ut,e as mt,q as je}from"./research-tools-DfKHAme-.js";import{i as gr,r as Pt,a as hr,b as pr}from"./ui-components-CSDtpZid.js";import"./index-bLHn9iqQ.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(s){if(s.ep)return;s.ep=!0;const i=t(s);fetch(s.href,i)}})();const fr={},Nt=!!(import.meta&&fr),yr={success:!0,message:"Development mode - authentication bypassed",session_token:`dev-token-${Date.now()}`,expires_at:new Date(Date.now()+30*60*1e3).toISOString(),session_duration:1800},br={coma_ich:{probability:25.3,ich_probability:25.3,drivers:{gfap_value:.4721,baseline_risk:.1456},confidence:.75},limited_ich:{probability:31.7,ich_probability:31.7,drivers:{age_years:.2845,systolic_bp:.1923,gfap_value:.4231,vigilanzminderung:.3456},confidence:.65},full_stroke:{ich_prediction:{probability:28.4,drivers:{age_years:.1834,gfap_value:.3921,systolic_bp:.2341,vigilanzminderung:.2876},confidence:.88},lvo_prediction:{probability:45.2,drivers:{fast_ed_score:.7834,age_years:.2341,eye_deviation:.1923},confidence:.82}},authenticate:{success:!0,message:"Development mode - authentication bypassed",session_token:`dev-token-${Date.now()}`,expires_at:new Date(Date.now()+30*60*1e3).toISOString(),session_duration:1800}},Me=Nt?{COMA_ICH:"/api/cloud-functions/predict_coma_ich",LDM_ICH:"/api/cloud-functions/predict_limited_data_ich",FULL_STROKE:"/api/cloud-functions/predict_full_stroke",LVO_PREDICTION:"/api/cloud-functions/predict_lvo",AUTHENTICATE:"/api/cloud-functions/authenticate-research-access"}:{COMA_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_coma_ich",LDM_ICH:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_limited_data_ich",FULL_STROKE:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_full_stroke",LVO_PREDICTION:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_lvo",AUTHENTICATE:"https://europe-west3-igfap-452720.cloudfunctions.net/authenticate-research-access"},ce={isDevelopment:Nt,mockAuthResponse:yr,mockApiResponses:br},Dt={ich:{medium:25,high:50},lvo:{medium:25,high:50}},F={min:29,max:10001,normal:100,elevated:500,critical:1e3},gt={autoSaveInterval:18e4,sessionTimeout:30*60*1e3},vs={age_years:{required:!0,min:0,max:120,type:"integer",medicalCheck:a=>a<18?"Emergency stroke assessment typically for adults (≥18 years)":null},systolic_bp:{required:!0,min:60,max:300,type:"number",medicalCheck:(a,e)=>{const t=e==null?void 0:e.diastolic_bp;return t&&a<=t?"Systolic BP must be higher than diastolic BP":null}},diastolic_bp:{required:!0,min:30,max:200,type:"number",medicalCheck:(a,e)=>{const t=e==null?void 0:e.systolic_bp;return t&&a>=t?"Diastolic BP must be lower than systolic BP":null}},gfap_value:{required:!0,min:F.min,max:F.max,type:"number",medicalCheck:a=>a>8e3?"Warning: Extremely high GFAP value - please verify lab result (still valid)":null},fast_ed_score:{required:!0,min:0,max:9,type:"integer",medicalCheck:a=>a>=4?"High FAST-ED score suggests LVO - consider urgent intervention":null},gcs:{required:!0,min:3,max:15,type:"integer",medicalCheck:a=>a<8?"GCS < 8 indicates severe consciousness impairment - consider coma module":null}};function xs(a){return a&&a.__esModule&&Object.prototype.hasOwnProperty.call(a,"default")?a.default:a}function vr(a){if(a.__esModule)return a;var e=a.default;if(typeof e=="function"){var t=function r(){return this instanceof r?Reflect.construct(e,arguments,this.constructor):e.apply(this,arguments)};t.prototype=e.prototype}else t={};return Object.defineProperty(t,"__esModule",{value:!0}),Object.keys(a).forEach(function(r){var s=Object.getOwnPropertyDescriptor(a,r);Object.defineProperty(t,r,s.get?s:{enumerable:!0,get:function(){return a[r]}})}),t}const xr=new Proxy({},{get(a,e){throw new Error(`Module "" has been externalized for browser compatibility. Cannot access ".${e}" in client code.  See https://vite.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`)}}),kr=Object.freeze(Object.defineProperty({__proto__:null,default:xr},Symbol.toStringTag,{value:"Module"})),ks=vr(kr),ht={en:{appTitle:"iGFAP",emergencyBadge:"Emergency Tool",helpButton:"Help and Instructions",darkModeButton:"Toggle dark mode",languageToggle:"Language",step1:"Initial Assessment",step2:"Data Collection",step3:"Results",comaModuleTitle:"Coma Module",limitedDataModuleTitle:"Limited Data Module",fullStrokeModuleTitle:"Full Stroke Module",triage1Title:"Patient Assessment",triage1Question:"Is the patient comatose?",triage1Help:"Glasgow Coma Scale < 9",triage1Yes:"YES - Comatose",triage1No:"NO - Conscious",triage2Title:"Examination Capability",triage2Question:"Can the patient be reliably examined?",triage2Help:"Patient is not aphasic, confused, or uncooperative",triage2Yes:"YES - Full Exam Possible",triage2No:"NO - Limited Exam Only",ageLabel:"Age (years)",ageHelp:"Patient age in years",systolicLabel:"Systolic BP (mmHg)",systolicHelp:"Systolic blood pressure",diastolicLabel:"Diastolic BP (mmHg)",diastolicHelp:"Diastolic blood pressure",gfapLabel:"GFAP Value (pg/mL)",gfapHelp:"GFAP biomarker level",fastEdLabel:"FAST-ED Score",fastEdHelp:"FAST-ED assessment score (0-9)",headacheLabel:"Headache",vigilanzLabel:"Reduced consciousness",armPareseLabel:"Arm weakness",beinPareseLabel:"Leg weakness",eyeDeviationLabel:"Eye deviation",atrialFibLabel:"Atrial fibrillation",anticoagLabel:"Anticoagulated (NOAK)",antiplateletsLabel:"Antiplatelets",analyzeButton:"Analyze",analyzing:"Analyzing...",printResults:"Print Results",newAssessment:"Start New Assessment",startOver:"Start Over",goBack:"Go Back",goHome:"Go Home",basicInformation:"Basic Information",biomarkersScores:"Biomarkers & Scores",clinicalSymptoms:"Clinical Symptoms",medicalHistory:"Medical History",ageYearsLabel:"Age (years)",systolicBpLabel:"Systolic BP (mmHg)",diastolicBpLabel:"Diastolic BP (mmHg)",gfapValueLabel:"GFAP Value (pg/mL)",fastEdScoreLabel:"FAST-ED Score",ageYearsHelp:"Patient's age in years",systolicBpHelp:"Normal: 90-140 mmHg",diastolicBpHelp:"Normal: 60-90 mmHg",gfapTooltip:"Brain injury biomarker",gfapTooltipLong:"Glial Fibrillary Acidic Protein - Brain injury biomarker",gfapRange:"Range: {min} - {max} pg/mL",fastEdTooltip:"0-9 scale for LVO screening",analyzeIchRisk:"Analyze ICH Risk",analyzeStrokeRisk:"Analyze Stroke Risk",criticalPatient:"Critical Patient",comaAlert:"Patient is comatose (GCS < 9). Rapid assessment required.",vigilanceReduction:"Vigilance Reduction (Decreased alertness)",armParesis:"Arm Paresis",legParesis:"Leg Paresis",eyeDeviation:"Eye Deviation",atrialFibrillation:"Atrial Fibrillation",onNoacDoac:"On NOAC/DOAC",onAntiplatelets:"On Antiplatelets",resultsTitle:"Assessment Results",bleedingRiskAssessment:"Bleeding Risk Assessment",ichProbability:"ICH Probability",lvoProbability:"LVO Probability",lvoMayBePossible:"Large vessel occlusion possible - further evaluation recommended",riskFactorsTitle:"Main Risk Factors",increasingRisk:"Increasing Risk",decreasingRisk:"Decreasing Risk",noFactors:"No factors",riskLevel:"Risk Level",lowRisk:"Low Risk",mediumRisk:"Medium Risk",highRisk:"High Risk",riskLow:"Low",riskMedium:"Medium",riskHigh:"High",riskFactorsAnalysis:"Risk Factors",contributingFactors:"Contributing factors to the assessment",riskFactors:"Risk Factors",increaseRisk:"INCREASE",decreaseRisk:"DECREASE",noPositiveFactors:"No increasing factors",noNegativeFactors:"No decreasing factors",ichRiskFactors:"ICH Risk Factors",lvoRiskFactors:"LVO Risk Factors",criticalAlertTitle:"CRITICAL RISK DETECTED",criticalAlertMessage:"High probability of intracerebral hemorrhage detected.",immediateActionsRequired:"Immediate actions required",initiateStrokeProtocol:"Initiate stroke protocol immediately",urgentCtImaging:"Urgent CT imaging required",considerBpManagement:"Consider blood pressure management",prepareNeurosurgicalConsult:"Prepare for potential neurosurgical consultation",helpTitle:"Quick Reference Guide",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 9: Comatose patient - use Coma Module",gcsMod:"GCS 8-12: Moderate impairment",gcsHigh:"GCS 13-15: Mild impairment",fastEdTitle:"FAST-ED Score Components",fastEdFacial:"Facial Palsy: 0-1 points",fastEdArm:"Arm Weakness: 0-2 points",fastEdSpeech:"Speech Changes: 0-2 points",fastEdTime:"Time: Critical factor",fastEdEye:"Eye Deviation: 0-2 points",fastEdDenial:"Denial/Neglect: 0-2 points",criticalValuesTitle:"Critical Values",criticalBp:"Systolic BP > 180: Increased ICH risk",criticalGfap:"GFAP > 500 pg/mL: Significant marker",criticalFastEd:"FAST-ED ≥ 4: Consider LVO",fastEdCalculatorTitle:"FAST-ED Score Calculator",fastEdCalculatorSubtitle:"Click to calculate FAST-ED score components",facialPalsyTitle:"Facial Palsy",facialPalsyNormal:"Normal (0)",facialPalsyMild:"Present (1)",armWeaknessTitle:"Arm Weakness",armWeaknessNormal:"Normal (0)",armWeaknessMild:"Mild weakness or drift (1)",armWeaknessSevere:"Severe weakness or falls immediately (2)",speechChangesTitle:"Speech Abnormalities",speechChangesNormal:"Normal (0)",speechChangesMild:"Mild dysarthria or aphasia (1)",speechChangesSevere:"Severe dysarthria or aphasia (2)",eyeDeviationTitle:"Eye Deviation",eyeDeviationNormal:"Normal (0)",eyeDeviationPartial:"Partial gaze deviation (1)",eyeDeviationForced:"Forced gaze deviation (2)",denialNeglectTitle:"Denial/Neglect",denialNeglectNormal:"Normal (0)",denialNeglectPartial:"Partial neglect (1)",denialNeglectComplete:"Complete neglect (2)",totalScoreTitle:"Total FAST-ED Score",riskLevel:"Risk Level",riskLevelLow:"LOW (Score <4)",riskLevelHigh:"HIGH (Score ≥4 - Consider LVO)",applyScore:"Apply Score",cancel:"Cancel",riskAnalysis:"Risk Analysis",riskAnalysisSubtitle:"Clinical factors in this assessment",contributingFactors:"Contributing factors",factorsShown:"shown",positiveFactors:"Positive factors",negativeFactors:"Negative factors",clinicalInformation:"Clinical Information",clinicalRecommendations:"Clinical Recommendations",clinicalRec1:"Consider immediate imaging if ICH risk is high",clinicalRec2:"Activate stroke team for LVO scores ≥ 50%",clinicalRec3:"Monitor blood pressure closely",clinicalRec4:"Document all findings thoroughly",noDriverData:"No driver data available",driverAnalysisUnavailable:"Driver analysis unavailable",driverInfoNotAvailable:"Driver information not available from this prediction model",driverAnalysisNotAvailable:"Driver analysis not available for this prediction",lvoNotPossible:"LVO assessment not possible with limited data",fullExamRequired:"Full neurological examination required for LVO screening",limitedAssessment:"Limited Assessment",disclaimer:"Clinical Disclaimer",disclaimerText:"This tool is for clinical decision support only. Always use clinical judgment and follow local protocols. Not a replacement for physician assessment.",importantNote:"Important",importantText:"These results are for clinical decision support only. Always use clinical judgment and follow institutional protocols.",predictedMortality:"Predicted 30-day mortality",ichVolumeLabel:"ICH Volume",references:"References",inputSummaryTitle:"Input Summary",inputSummarySubtitle:"Values used for this analysis",privacyLink:"Privacy Policy",disclaimerLink:"Medical Disclaimer",versionLink:"Version 2.1.0 - Research Preview",privacyPolicy:"Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.",medicalDisclaimer:"Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.",networkError:"Network error - please check your connection and try again",requestTimeout:"Request timeout - please try again",apiError:"Failed to get results",validationError:"Please check your input values",sessionTimeout:"Your session has been idle for 30 minutes. Would you like to continue?",unsavedData:"You have unsaved data. Are you sure you want to leave?",nearestCentersTitle:"Nearest Stroke Centers",useCurrentLocation:"Use Current Location",enterLocationPlaceholder:"Enter city or address...",enterManually:"Enter Location Manually",search:"Search",yourLocation:"Your Location",recommendedCenters:"Recommended Centers",alternativeCenters:"Alternative Centers",noCentersFound:"No stroke centers found in this area",gettingLocation:"Getting your location",searchingLocation:"Searching location",locationError:"Unable to get your location",locationPermissionDenied:"Location access denied. Please allow location access and try again.",locationUnavailable:"Location information is unavailable",locationTimeout:"Location request timed out",geolocationNotSupported:"Geolocation is not supported by this browser",geocodingNotImplemented:"Location search not available. Please use GPS or enter coordinates manually.",tryManualEntry:"Try entering your location manually or use GPS.",distanceNote:"Distances are calculated as straight-line distances. Actual travel times may vary.",travelTimeNote:"Travel times calculated for emergency vehicles with sirens and priority routing.",calculatingTravelTimes:"Calculating travel times",minutes:"min",poweredByOrs:"Travel times powered by OpenRoute Service",comprehensiveCenter:"Comprehensive Stroke Center",primaryCenter:"Primary Stroke Center",telemetryCenter:"Telemedicine Center",thrombectomy:"Thrombectomy",neurosurgery:"Neurosurgery",icu:"Intensive Care",telemedicine:"Telemedicine",stroke_unit:"Stroke Unit",call:"Call",directions:"Directions",emergency:"Emergency",certified:"Certified",prerequisitesTitle:"Prerequisites for Stroke Triage",prerequisitesIntro:"Please confirm that all of the following prerequisites are met:",prerequisitesWarning:"All prerequisites must be met to continue",continue:"Continue",acute_deficit:"Acute (severe) neurological deficit present",symptom_onset:"Symptom onset within 6 hours",no_preexisting:"No pre-existing severe neurological deficits",no_trauma:"No traumatic brain injury present",differentialDiagnoses:"Differential Diagnoses",reconfirmTimeWindow:"Please reconfirm time window!",unclearTimeWindow:"With unclear/extended time window, early demarcated brain infarction is also possible",rareDiagnoses:"Rare diagnoses such as glioblastoma are also possible",researchAccessRequired:"Research Access Required",researchrPreviewValidation:"This is a research preview of the iGFAP Stroke Triage Assistant for clinical validation.",importantNotice:"Important Notice",researchUseOnly:"Research Use Only",noClinicalDecision:" Not for clinical decision making",noDataStorage:"No Patient Data Storage",dataProcessedLocally:" All data processed locally",clinicalAdvisory:"Clinical Advisory",supervision:"Under supervision of Prof. Christian Förch & Dr. Lovepreet Kalra",contact:"Contact",accessCode:"Research Access Code",accessCodePlaceholder:"Enter research access code",accessResearchBtn:"Access Research System",regulatoryStatus:"Regulatory Status",protoTypeOnly:"Research prototype - CE certification pending",dataProtection:"Data Protection",gdprComplaint:"GDPR compliant - local processing only",clinicalOversight:"Clinical Oversight"},de:{appTitle:"iGFAP",emergencyBadge:"Notfall-Tool",helpButton:"Hilfe und Anweisungen",darkModeButton:"Dunklen Modus umschalten",languageToggle:"Sprache",step1:"Erstbeurteilung",step2:"Datenerhebung",step3:"Ergebnisse",comaModuleTitle:"Koma-Modul",limitedDataModuleTitle:"Begrenzte Daten Modul",fullStrokeModuleTitle:"Vollständiges Schlaganfall-Modul",triage1Title:"Patientenbeurteilung",triage1Question:"Ist der Patient komatös?",triage1Help:"Glasgow Coma Scale < 9",triage1Yes:"JA - Komatös",triage1No:"NEIN - Bei Bewusstsein",triage2Title:"Untersuchungsfähigkeit",triage2Question:"Kann der Patient zuverlässig untersucht werden?",triage2Help:"Patient ist nicht aphasisch, verwirrt oder unkooperativ",triage2Yes:"JA - Vollständige Untersuchung möglich",triage2No:"NEIN - Nur begrenzte Untersuchung",ageLabel:"Alter (Jahre)",ageHelp:"Patientenalter in Jahren",systolicLabel:"Systolischer RR (mmHg)",systolicHelp:"Systolischer Blutdruck",diastolicLabel:"Diastolischer RR (mmHg)",diastolicHelp:"Diastolischer Blutdruck",gfapLabel:"GFAP-Wert (pg/mL)",gfapHelp:"GFAP-Biomarker-Wert",fastEdLabel:"FAST-ED-Score",fastEdHelp:"FAST-ED-Bewertungsscore (0-9)",headacheLabel:"Kopfschmerzen",vigilanzLabel:"Bewusstseinstrübung",armPareseLabel:"Armschwäche",beinPareseLabel:"Beinschwäche",eyeDeviationLabel:"Blickdeviation",atrialFibLabel:"Vorhofflimmern",anticoagLabel:"Antikoaguliert (NOAK)",antiplateletsLabel:"Thrombozytenaggregationshemmer",analyzeButton:"Analysieren",analyzing:"Analysiere...",printResults:"Ergebnisse drucken",newAssessment:"Neue Bewertung starten",startOver:"Von vorn beginnen",goBack:"Zurück",goHome:"Zur Startseite",basicInformation:"Grundinformationen",biomarkersScores:"Biomarker & Scores",clinicalSymptoms:"Klinische Symptome",medicalHistory:"Anamnese",ageYearsLabel:"Alter (Jahre)",systolicBpLabel:"Systolischer RR (mmHg)",diastolicBpLabel:"Diastolischer RR (mmHg)",gfapValueLabel:"GFAP-Wert (pg/mL)",fastEdScoreLabel:"FAST-ED-Score",ageYearsHelp:"Patientenalter in Jahren",systolicBpHelp:"Normal: 90-140 mmHg",diastolicBpHelp:"Normal: 60-90 mmHg",gfapTooltip:"Hirnverletzungs-Biomarker",gfapTooltipLong:"Glial Fibrillary Acidic Protein - Hirnverletzungs-Biomarker",gfapRange:"Bereich: {min} - {max} pg/mL",fastEdTooltip:"0-9 Skala für LVO-Screening",analyzeIchRisk:"ICB-Risiko analysieren",analyzeStrokeRisk:"Schlaganfall-Risiko analysieren",criticalPatient:"Kritischer Patient",comaAlert:"Patient ist komatös (GCS < 9). Schnelle Beurteilung erforderlich.",vigilanceReduction:"Vigilanzminderung (Verminderte Wachheit)",armParesis:"Armparese",legParesis:"Beinparese",eyeDeviation:"Blickdeviation",atrialFibrillation:"Vorhofflimmern",onNoacDoac:"NOAK/DOAK-Therapie",onAntiplatelets:"Thrombozytenaggregationshemmer",resultsTitle:"Bewertungsergebnisse",bleedingRiskAssessment:"Blutungsrisiko-Bewertung",ichProbability:"ICB-Risiko",lvoProbability:"LVO-Risiko",lvoMayBePossible:"Großgefäßverschluss möglich - weitere Abklärung empfohlen",riskFactorsTitle:"Hauptrisikofaktoren",increasingRisk:"Risikoerhöhend",decreasingRisk:"Risikomindernd",noFactors:"Keine Faktoren",riskLevel:"Risikostufe",lowRisk:"Niedriges Risiko",mediumRisk:"Mittleres Risiko",highRisk:"Hohes Risiko",riskLow:"Niedrig",riskMedium:"Mittel",riskHigh:"Hoch",riskFactorsAnalysis:"Risikofaktoren",contributingFactors:"Beitragende Faktoren zur Bewertung",riskFactors:"Risikofaktoren",increaseRisk:"ERHÖHEN",decreaseRisk:"VERRINGERN",noPositiveFactors:"Keine erhöhenden Faktoren",noNegativeFactors:"Keine verringernden Faktoren",ichRiskFactors:"ICB-Risikofaktoren",lvoRiskFactors:"LVO-Risikofaktoren",criticalAlertTitle:"KRITISCHES RISIKO ERKANNT",criticalAlertMessage:"Hohe Wahrscheinlichkeit einer intrazerebralen Blutung erkannt.",immediateActionsRequired:"Sofortige Maßnahmen erforderlich",initiateStrokeProtocol:"Schlaganfall-Protokoll sofort einleiten",urgentCtImaging:"Dringende CT-Bildgebung erforderlich",considerBpManagement:"Blutdruckmanagement erwägen",prepareNeurosurgicalConsult:"Neurochirurgische Konsultation vorbereiten",helpTitle:"Kurzreferenzleitfaden",gcsTitle:"Glasgow Coma Scale (GCS)",gcsLow:"GCS < 9: Komatöser Patient - Koma-Modul verwenden",gcsMod:"GCS 8-12: Mäßige Beeinträchtigung",gcsHigh:"GCS 13-15: Leichte Beeinträchtigung",fastEdTitle:"FAST-ED-Score-Komponenten",fastEdFacial:"Faziale Parese: 0-1 Punkte",fastEdArm:"Armschwäche: 0-2 Punkte",fastEdSpeech:"Sprachveränderungen: 0-2 Punkte",fastEdTime:"Zeit: Kritischer Faktor",fastEdEye:"Blickdeviation: 0-2 Punkte",fastEdDenial:"Verneinung/Neglect: 0-2 Punkte",criticalValuesTitle:"Kritische Werte",criticalBp:"Systolischer RR > 180: Erhöhtes ICB-Risiko",criticalGfap:"GFAP > 500 pg/mL: Signifikanter Marker",criticalFastEd:"FAST-ED ≥ 4: LVO in Betracht ziehen",fastEdCalculatorTitle:"FAST-ED-Score-Rechner",fastEdCalculatorSubtitle:"Klicken Sie, um FAST-ED-Score-Komponenten zu berechnen",facialPalsyTitle:"Fazialisparese",facialPalsyNormal:"Normal (0)",facialPalsyMild:"Vorhanden (1)",armWeaknessTitle:"Armschwäche",armWeaknessNormal:"Normal (0)",armWeaknessMild:"Leichte Schwäche oder Absinken (1)",armWeaknessSevere:"Schwere Schwäche oder fällt sofort ab (2)",speechChangesTitle:"Sprachstörungen",speechChangesNormal:"Normal (0)",speechChangesMild:"Leichte Dysarthrie oder Aphasie (1)",speechChangesSevere:"Schwere Dysarthrie oder Aphasie (2)",eyeDeviationTitle:"Blickdeviation",eyeDeviationNormal:"Normal (0)",eyeDeviationPartial:"Partielle Blickdeviation (1)",eyeDeviationForced:"Forcierte Blickdeviation (2)",denialNeglectTitle:"Verneinung/Neglect",denialNeglectNormal:"Normal (0)",denialNeglectPartial:"Partieller Neglect (1)",denialNeglectComplete:"Kompletter Neglect (2)",totalScoreTitle:"Gesamt-FAST-ED-Score",riskLevel:"Risikostufe",riskLevelLow:"NIEDRIG (Score <4)",riskLevelHigh:"HOCH (Score ≥4 - LVO erwägen)",applyScore:"Score Anwenden",cancel:"Abbrechen",riskAnalysis:"Risikoanalyse",riskAnalysisSubtitle:"Klinische Faktoren in dieser Bewertung",contributingFactors:"Beitragende Faktoren",factorsShown:"angezeigt",positiveFactors:"Positive Faktoren",negativeFactors:"Negative Faktoren",clinicalInformation:"Klinische Informationen",clinicalRecommendations:"Klinische Empfehlungen",clinicalRec1:"Sofortige Bildgebung erwägen bei hohem ICB-Risiko",clinicalRec2:"Stroke-Team aktivieren bei LVO-Score ≥ 50%",clinicalRec3:"Blutdruck engmaschig überwachen",clinicalRec4:"Alle Befunde gründlich dokumentieren",noDriverData:"Keine Treiberdaten verfügbar",driverAnalysisUnavailable:"Treiberanalyse nicht verfügbar",driverInfoNotAvailable:"Treiberinformationen von diesem Vorhersagemodell nicht verfügbar",driverAnalysisNotAvailable:"Treiberanalyse für diese Vorhersage nicht verfügbar",lvoNotPossible:"LVO-Bewertung mit begrenzten Daten nicht möglich",fullExamRequired:"Vollständige neurologische Untersuchung für LVO-Screening erforderlich",limitedAssessment:"Begrenzte Bewertung",disclaimer:"Klinischer Haftungsausschluss",disclaimerText:"Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle. Kein Ersatz für ärztliche Beurteilung.",importantNote:"Wichtig",importantText:"Diese Ergebnisse dienen nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie institutionelle Protokolle.",predictedMortality:"Vorhergesagte 30-Tage-Mortalität",ichVolumeLabel:"ICB-Volumen",references:"Referenzen",inputSummaryTitle:"Eingabezusammenfassung",inputSummarySubtitle:"Für diese Analyse verwendete Werte",privacyLink:"Datenschutzrichtlinie",disclaimerLink:"Medizinischer Haftungsausschluss",versionLink:"Version 2.1.0 - Research Preview",privacyPolicy:"Datenschutzrichtlinie: Dieses Tool verarbeitet Daten lokal. Keine Patientendaten werden gespeichert oder übertragen.",medicalDisclaimer:"Medizinischer Haftungsausschluss: Dieses Tool dient nur zur klinischen Entscheidungsunterstützung. Verwenden Sie immer klinisches Urteilsvermögen und befolgen Sie lokale Protokolle.",networkError:"Netzwerkfehler - bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut",requestTimeout:"Anfrage-Timeout - bitte versuchen Sie es erneut",apiError:"Ergebnisse konnten nicht abgerufen werden",validationError:"Bitte überprüfen Sie Ihre Eingabewerte",sessionTimeout:"Ihre Sitzung war 30 Minuten lang inaktiv. Möchten Sie fortfahren?",unsavedData:"Sie haben ungespeicherte Daten. Sind Sie sicher, dass Sie verlassen möchten?",nearestCentersTitle:"Nächstgelegene Schlaganfall-Zentren",useCurrentLocation:"Aktuellen Standort verwenden",enterLocationPlaceholder:"Stadt oder Adresse eingeben...",enterManually:"Standort manuell eingeben",search:"Suchen",yourLocation:"Ihr Standort",recommendedCenters:"Empfohlene Zentren",alternativeCenters:"Alternative Zentren",noCentersFound:"Keine Schlaganfall-Zentren in diesem Bereich gefunden",gettingLocation:"Standort wird ermittelt",searchingLocation:"Standort wird gesucht",locationError:"Standort konnte nicht ermittelt werden",locationPermissionDenied:"Standortzugriff verweigert. Bitte erlauben Sie Standortzugriff und versuchen Sie es erneut.",locationUnavailable:"Standortinformationen sind nicht verfügbar",locationTimeout:"Standortanfrage ist abgelaufen",geolocationNotSupported:"Geolokalisierung wird von diesem Browser nicht unterstützt",geocodingNotImplemented:"Standortsuche nicht verfügbar. Bitte verwenden Sie GPS oder geben Sie Koordinaten manuell ein.",tryManualEntry:"Versuchen Sie, Ihren Standort manuell einzugeben oder GPS zu verwenden.",distanceNote:"Entfernungen werden als Luftlinie berechnet. Tatsächliche Fahrzeiten können variieren.",travelTimeNote:"Fahrzeiten berechnet für Rettungsfahrzeuge mit Sondersignalen und Vorfahrtsberechtigung.",calculatingTravelTimes:"Fahrzeiten werden berechnet",minutes:"Min",poweredByOrs:"Fahrzeiten bereitgestellt von OpenRoute Service",comprehensiveCenter:"Überregionales Schlaganfall-Zentrum",primaryCenter:"Regionales Schlaganfall-Zentrum",telemetryCenter:"Telemedizin-Zentrum",thrombectomy:"Thrombektomie",neurosurgery:"Neurochirurgie",icu:"Intensivstation",telemedicine:"Telemedizin",stroke_unit:"Stroke Unit",call:"Anrufen",directions:"Wegbeschreibung",emergency:"Notfall",certified:"Zertifiziert",prerequisitesTitle:"Voraussetzungen für Schlaganfall-Triage",prerequisitesIntro:"Bitte bestätigen Sie, dass alle folgenden Voraussetzungen erfüllt sind:",prerequisitesWarning:"Alle Voraussetzungen müssen erfüllt sein, um fortzufahren",continue:"Weiter",acute_deficit:"Akutes (schweres) neurologisches Defizit vorhanden",symptom_onset:"Symptombeginn innerhalb 6h",no_preexisting:"Keine vorbestehende schwere neurologische Defizite",no_trauma:"Kein Schädelhirntrauma vorhanden",differentialDiagnoses:"Differentialdiagnosen",reconfirmTimeWindow:"Bitte Zeitfenster rekonfirmieren!",unclearTimeWindow:"Bei unklarem/erweitertem Zeitfenster ist auch ein beginnend demarkierter Hirninfarkt möglich",rareDiagnoses:"Seltene Diagnosen wie ein Glioblastom sind auch möglich",researchAccessRequired:"Forschungszugang erforderlich",researchrPreviewValidation:"Dies ist eine Forschungsvorschau des iGFAP Stroke Triage Assistant zur klinischen Validierung.",importantNotice:"Wichtiger Hinweis",researchUseOnly:"Nur für Forschungszwecke",noClinicalDecision:" Nicht für klinische Entscheidungen",noDataStorage:"Keine Speicherung von Patientendaten",dataProcessedLocally:"Alle Daten werden lokal verarbeitet",clinicalAdvisory:"Klinischer Hinweis",supervision:"Unter Aufsicht von Prof. Christian Förch und Dr. Lovepreet Kalra",contact:"Kontakt",accessCode:"Forschungszugangscode",accessCodePlaceholder:"Forschungszugangscode eingeben",accessResearchBtn:"Forschungssystem zugreifen",regulatoryStatus:"Regulatorischer Status",protoTypeOnly:"Research prototype - CE certification pending",dataProtection:"Daten- und Datenschutz",gdprComplaint:"DSGVO-konform - nur lokale Verarbeitung",clinicalOversight:"Klinische Aufsicht"}};class wr{constructor(){this.supportedLanguages=["en","de"],this.currentLanguage=this.detectLanguage()}detectLanguage(){const e=localStorage.getItem("language");return e&&this.supportedLanguages.includes(e)?e:(navigator.language||navigator.userLanguage).substring(0,2).toLowerCase()==="de"?"de":"en"}getCurrentLanguage(){return this.currentLanguage}setLanguage(e){return this.supportedLanguages.includes(e)?(this.currentLanguage=e,localStorage.setItem("language",e),window.dispatchEvent(new CustomEvent("languageChanged",{detail:{language:e}})),!0):!1}getSupportedLanguages(){return[...this.supportedLanguages]}t(e){return(ht[this.currentLanguage]||ht.en)[e]||e}toggleLanguage(){const e=this.currentLanguage==="en"?"de":"en";return this.setLanguage(e)}getLanguageDisplayName(e=null){const t=e||this.currentLanguage;return{en:"English",de:"Deutsch"}[t]||t}formatDateTime(e){const t=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(t,{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(e)}formatTime(e){const t=this.currentLanguage==="de"?"de-DE":"en-US";return new Intl.DateTimeFormat(t,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(e)}}const K=new wr,l=a=>K.t(a),Sr=()=>[{id:"acute_deficit",checked:!1},{id:"symptom_onset",checked:!1},{id:"no_preexisting",checked:!1},{id:"no_trauma",checked:!1}];function Er(){const a=Sr();return`
    <div id="prerequisitesModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fadeIn">
        
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">${l("prerequisitesTitle")}</h2>
          <button id="closePrerequisites" class="text-gray-500 hover:text-gray-800 dark:hover:text-white text-xl leading-none">&times;</button>
        </div>

        <!-- Body -->
        <div class="px-6 py-5 space-y-5">
          <p class="text-sm text-gray-700 dark:text-gray-300">${l("prerequisitesIntro")}</p>
          
          <div class="space-y-4">
            ${a.map(e=>`
              <label class="flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
                <span class="text-gray-800 dark:text-gray-100 font-medium">${l(e.id)}</span>
                <input type="checkbox" id="${e.id}" class="toggle-input w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
              </label>
            `).join("")}
          </div>

          <div id="prerequisitesWarning" class="hidden items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm">
            <span>⚠️</span>
            <span>${l("prerequisitesWarning")}</span>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button id="cancelPrerequisites" class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            ${l("cancel")}
          </button>
          <button id="confirmPrerequisites" class="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition">
            ${l("continue")}
          </button>
        </div>
      </div>
    </div>
  `}function Tr(){const a=document.getElementById("prerequisitesModal");if(!a)return;const e=document.getElementById("closePrerequisites"),t=document.getElementById("cancelPrerequisites"),r=document.getElementById("confirmPrerequisites"),s=()=>{a.remove(),me("welcome")};e==null||e.addEventListener("click",s),t==null||t.addEventListener("click",s),r==null||r.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const c=a.querySelectorAll(".toggle-input");if(Array.from(c).every(u=>u.checked))a.remove(),me("triage2");else{const u=document.getElementById("prerequisitesWarning");u&&(u.classList.remove("hidden"),u.classList.add("animate-shake"),setTimeout(()=>u.classList.remove("animate-shake"),500))}});const i=a.querySelectorAll(".toggle-input");i.forEach(o=>{o.addEventListener("change",()=>{const c=Array.from(i).every(u=>u.checked),n=document.getElementById("prerequisitesWarning");c&&n&&n.classList.add("hidden")})})}function Ar(){const a=document.getElementById("prerequisitesModal");a&&a.remove();const e=document.createElement("div");try{ve(e,Er());const t=e.firstElementChild;if(!t)throw new Error("Failed to create modal element");document.body.appendChild(t)}catch(t){console.error("Prerequisites modal sanitization failed:",t);const r=document.createElement("div");r.className="fixed inset-0 flex items-center justify-center bg-black/50 text-white",r.textContent="Failed to load prerequisites modal. Please refresh.",document.body.appendChild(r);return}Tr()}const Cr={};function Ir(a){g.logEvent("triage1_answer",{comatose:a}),a?me("coma"):Ar()}function Lr(a){g.logEvent("triage2_answer",{examinable:a}),me(a?"full":"limited")}function me(a){g.logEvent("navigate",{from:g.getState().currentScreen,to:a}),g.navigate(a),window.scrollTo(0,0)}function Mr(){g.hasUnsavedData()&&!confirm("Are you sure you want to start over? All entered data will be lost.")||(g.logEvent("reset"),g.reset())}function _r(){g.goBack()?(g.logEvent("navigate_back"),window.scrollTo(0,0)):Ot()}function Ot(){g.logEvent("navigate_home"),g.goHome(),window.scrollTo(0,0)}async function Rr(a,e){var n,u;a.preventDefault();const t=a.target,{module:r}=t.dataset,s=ir(t);if(!s.isValid){nr(e,s.validationErrors);try{const d=Object.keys(s.validationErrors)[0];if(d&&t.elements[d]){const C=t.elements[d];C.focus({preventScroll:!0}),C.scrollIntoView({behavior:"smooth",block:"center"})}const m=document.createElement("div");m.className="sr-only",m.setAttribute("role","status"),m.setAttribute("aria-live","polite");const x=Object.keys(s.validationErrors).length;m.textContent=`${x} field${x===1?"":"s"} need attention.`,document.body.appendChild(m),setTimeout(()=>m.remove(),1200)}catch(d){}return}const i={};Array.from(t.elements).forEach(d=>{if(d.name)if(d.type==="checkbox")i[d.name]=d.checked;else if(d.type==="number"){const m=parseFloat(d.value);i[d.name]=isNaN(m)?0:m}else d.type==="hidden"&&d.name==="armparese"?i[d.name]=d.value==="true":i[d.name]=d.value}),g.setFormData(r,i);const o=t.querySelector("button[type=submit]"),c=o?o.innerHTML:"";if(o){o.disabled=!0;try{ve(o,`<span class="loading-spinner"></span> ${l("analyzing")}`)}catch(d){console.error("Button loading state sanitization failed:",d),o.textContent=l("analyzing")||"Analyzing..."}}try{console.log("[Submit] Module:",r),console.log("[Submit] Inputs:",i);let d;switch(r){case"coma":d={ich:{...await Lt(i),module:"Coma"},lvo:null};break;case"limited":d={ich:{...await It(i),module:"Limited"},lvo:{notPossible:!0}};break;case"full":if(d=await Ct(i),console.log("[Submit] Full results:",{ich:!!(d!=null&&d.ich),lvo:!!(d!=null&&d.lvo),ichP:(n=d==null?void 0:d.ich)==null?void 0:n.probability,lvoP:(u=d==null?void 0:d.lvo)==null?void 0:u.probability}),!d||!d.ich)throw new Error("Invalid response structure from Full Stroke API");d.ich&&!d.ich.probability&&d.ich.ich_probability!==void 0&&(d.ich.probability=d.ich.ich_probability,console.log("[Submit] Fixed ICH probability for Full Stroke:",d.ich.probability)),d.ich&&!d.ich.module&&(d.ich.module="Full Stroke"),d.lvo&&!d.lvo.module&&(d.lvo.module="Full Stroke");break;default:throw new Error(`Unknown module: ${r}`)}console.log("[Submit] Setting results in store:",d),g.setResults(d),g.logEvent("models_complete",{module:r,results:d});const m=g.getState();console.log("[Submit] State after setResults:",{hasResults:!!m.results,currentScreen:m.currentScreen}),console.log("[Submit] Navigating to results..."),me("results"),pt("✅ Results loaded",2e3),setTimeout(()=>{try{const x=g.getState().currentScreen;console.log("[Submit] currentScreen after navigate:",x),x!=="results"&&(g.navigate("results"),pt("🔁 Forced results view",1500))}catch(x){}},0)}catch(d){const m=["localhost","127.0.0.1","0.0.0.0"].includes(window.location.hostname)&&!(import.meta&&Cr);if(r==="full"&&m)try{const C=ce.mockApiResponses.full_stroke,Y=C.ich_prediction||{},ie=C.lvo_prediction||{},H=parseFloat(Y.probability)||0,Q=parseFloat(ie.probability)||0,he={ich:{probability:H>1?H/100:H,drivers:Y.drivers||null,confidence:parseFloat(Y.confidence)||.85,module:"Full Stroke"},lvo:{probability:Q>1?Q/100:Q,drivers:ie.drivers||null,confidence:parseFloat(ie.confidence)||.85,module:"Full Stroke"}};g.setResults(he),g.logEvent("models_complete_fallback",{module:r,reason:d.message}),me("results");return}catch(C){}let x="An error occurred during analysis. Please try again.";if(d instanceof or&&(x=d.message),Pr(e,x),o){o.disabled=!1;try{ve(o,c)}catch(C){console.error("Button restore sanitization failed:",C),o.textContent="Submit"}}}}function Pr(a,e){a.querySelectorAll(".critical-alert").forEach(c=>{var n,u;(u=(n=c.querySelector("h4"))==null?void 0:n.textContent)!=null&&u.includes("Error")&&c.remove()});const t=document.createElement("div");t.className="critical-alert";const r=document.createElement("h4"),s=document.createElement("span");s.className="alert-icon",s.textContent="⚠️",r.appendChild(s),r.appendChild(document.createTextNode(" Error"));const i=document.createElement("p");i.textContent=e,t.appendChild(r),t.appendChild(i);const o=a.querySelector(".container");o?o.prepend(t):a.prepend(t),setTimeout(()=>t.remove(),1e4)}function pt(a,e=2e3){try{const t=document.createElement("div");t.textContent=a,t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),t.style.cssText=`
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
    `,document.body.appendChild(t),requestAnimationFrame(()=>{t.style.opacity="1"}),setTimeout(()=>{t.style.opacity="0",setTimeout(()=>t.remove(),200)},e)}catch(t){}}const E={LOW:"low",MEDIUM:"medium",HIGH:"high",CRITICAL:"critical"},w={NETWORK:"network",VALIDATION:"validation",AUTHENTICATION:"authentication",CALCULATION:"calculation",STORAGE:"storage",RENDERING:"rendering",MEDICAL:"medical",SECURITY:"security"};class R extends Error{constructor(e,t,r=w.MEDICAL,s=E.MEDIUM){super(e),this.name="MedicalError",this.code=t,this.category=r,this.severity=s,this.timestamp=new Date().toISOString(),this.context={}}withContext(e){return this.context={...this.context,...e},this}getUserMessage(){switch(this.category){case w.NETWORK:return"Network connection issue. Please check your internet connection and try again.";case w.VALIDATION:return"Please check your input data and try again.";case w.AUTHENTICATION:return"Authentication failed. Please log in again.";case w.CALCULATION:return"Unable to complete calculation. Please verify your input data.";case w.MEDICAL:return"Medical calculation could not be completed. Please verify all clinical data.";default:return"An unexpected error occurred. Please try again."}}}class Nr{constructor(){this.errorQueue=[],this.maxQueueSize=100,this.setupGlobalHandlers()}setupGlobalHandlers(){window.addEventListener("unhandledrejection",e=>{this.handleError(e.reason,w.NETWORK,E.HIGH),e.preventDefault()}),window.addEventListener("error",e=>{this.handleError(e.error,w.RENDERING,E.MEDIUM)})}handleError(e,t=w.NETWORK,r=E.MEDIUM){const s={error:e instanceof Error?e:new Error(String(e)),category:t,severity:r,timestamp:new Date().toISOString(),userAgent:navigator.userAgent.substring(0,100),url:window.location.href};this.errorQueue.push(s),this.errorQueue.length>this.maxQueueSize&&this.errorQueue.shift(),r===E.CRITICAL&&this.handleCriticalError(s)}handleCriticalError(e){e.category===w.MEDICAL&&this.showMedicalAlert(e.error.message)}showMedicalAlert(e){const t=document.createElement("div");t.className="critical-medical-alert",t.style.cssText=`
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
    `,t.textContent=`⚠️ Medical Error: ${e}`,document.body.appendChild(t),setTimeout(()=>{document.body.contains(t)&&document.body.removeChild(t)},1e4)}getErrorSummary(){return{totalErrors:this.errorQueue.length,criticalErrors:this.errorQueue.filter(e=>e.severity===E.CRITICAL).length,recentErrors:this.errorQueue.slice(-10)}}}const Dr=new Nr;async function v(a,e={}){const{category:t=w.NETWORK,severity:r=E.MEDIUM,fallback:s=null,timeout:i=3e4,retries:o=0,context:c={}}=e;for(let n=0;n<=o;n++)try{const u=new Promise((m,x)=>{setTimeout(()=>x(new Error("Operation timeout")),i)});return await Promise.race([a(),u])}catch(u){if(Dr.handleError(u,t,r),n<o){await new Promise(m=>setTimeout(m,1e3*(n+1)));continue}if(s!==null)return typeof s=="function"?s(u):s;throw new R(u.message||"Operation failed",u.code||"UNKNOWN",t,r).withContext(c)}}async function ft(a,e={}){return v(a,{category:w.AUTHENTICATION,severity:E.HIGH,timeout:15e3,fallback:()=>({success:!1,error:!0,message:"Authentication service unavailable"}),...e})}function Or(a){const e=[],t=[];return!a||typeof a!="object"?(e.push("Patient data must be an object"),{isValid:!1,errors:e,warnings:t}):((typeof a.age!="number"||a.age<0||a.age>120)&&e.push("Age must be a number between 0 and 120"),["male","female","other"].includes(a.gender)||e.push('Gender must be "male", "female", or "other"'),(typeof a.gfap!="number"||a.gfap<29||a.gfap>10001)&&e.push("GFAP must be a number between 29 and 10001 pg/mL"),a.nihss!==void 0&&(typeof a.nihss!="number"||a.nihss<0||a.nihss>42)&&e.push("NIHSS must be a number between 0 and 42"),a.gcs!==void 0&&(typeof a.gcs!="number"||a.gcs<3||a.gcs>15)&&e.push("GCS must be a number between 3 and 15"),a.sbp!==void 0&&(typeof a.sbp!="number"||a.sbp<50||a.sbp>300)&&t.push("Systolic BP should typically be between 50-300 mmHg"),a.dbp!==void 0&&(typeof a.dbp!="number"||a.dbp<30||a.dbp>200)&&t.push("Diastolic BP should typically be between 30-200 mmHg"),{isValid:e.length===0,errors:e,warnings:t})}function zr(a){const e=[],t=[];return!a||typeof a!="object"?(e.push("ICH risk result must be an object"),{isValid:!1,errors:e,warnings:t}):((typeof a.probability!="number"||a.probability<0||a.probability>1)&&e.push("Probability must be a number between 0 and 1"),(typeof a.percentage!="number"||a.percentage<0||a.percentage>100)&&e.push("Percentage must be a number between 0 and 100"),["low","moderate","high","critical"].includes(a.riskLevel)||e.push('Risk level must be "low", "moderate", "high", or "critical"'),(!a.timestamp||!Date.parse(a.timestamp))&&e.push("Timestamp must be a valid ISO date string"),{isValid:e.length===0,errors:e,warnings:t})}function $r(a){return Or(a).isValid}function Fr(a){return zr(a).isValid}class Hr{static ensureType(e,t,r){let s=!1,i=typeof e;switch(t){case"PatientData":s=$r(e),i="Invalid PatientData";break;case"ICHRiskResult":s=Fr(e),i="Invalid ICHRiskResult";break;case"number":s=typeof e=="number"&&!isNaN(e);break;case"string":s=typeof e=="string";break;case"boolean":s=typeof e=="boolean";break;default:s=typeof e===t}if(!s)throw new TypeError(`Type error in ${r}: expected ${t}, got ${i}. This is a critical error in medical calculations.`)}static ensureRange(e,t,r){this.ensureType(e,"number",r);const[s,i]=t;if(e<s||e>i)throw new RangeError(`Range error in ${r}: value ${e} must be between ${s} and ${i}. This is a critical error in medical calculations.`)}}const j={DEBUG:{level:0,name:"DEBUG",color:"#6366f1"},INFO:{level:1,name:"INFO",color:"#10b981"},WARN:{level:2,name:"WARN",color:"#f59e0b"},ERROR:{level:3,name:"ERROR",color:"#ef4444"},CRITICAL:{level:4,name:"CRITICAL",color:"#dc2626"}},f={AUTHENTICATION:"AUTH",MEDICAL_CALCULATION:"MEDICAL",NETWORK:"NETWORK",PERFORMANCE:"PERF",SECURITY:"SECURITY",USER_INTERACTION:"UI",DATA_VALIDATION:"VALIDATION",AUDIT:"AUDIT",SYSTEM:"SYSTEM",ERROR:"ERROR"};class Br{constructor(){this.logLevel=this.getLogLevel(),this.sessionId=this.generateSessionId(),this.logBuffer=[],this.maxBufferSize=1e3,this.isProduction=window.location.hostname!=="localhost"&&window.location.hostname!=="127.0.0.1",this.enableConsole=!this.isProduction,this.enableStorage=!0,this.enableNetwork=!1,this.setupErrorHandlers(),this.startPeriodicFlush()}getLogLevel(){try{const e=localStorage.getItem("medicalLogLevel");if(e&&j[e.toUpperCase()])return j[e.toUpperCase()].level}catch(e){}return this.isProduction?j.INFO.level:j.DEBUG.level}generateSessionId(){const e=Date.now().toString(36),t=Math.random().toString(36).substring(2,8);return`sess_${e}_${t}`}setupErrorHandlers(){window.addEventListener("error",e=>{var t;try{this.critical("Unhandled JavaScript Error",{category:f.ERROR,message:e.message,filename:e.filename,lineno:e.lineno,colno:e.colno,stack:(t=e.error)==null?void 0:t.stack})}catch(r){console.error("Logging failed:",r),console.error("Original error:",e.error)}}),window.addEventListener("unhandledrejection",e=>{var t,r;try{this.critical("Unhandled Promise Rejection",{category:f.ERROR,reason:((t=e.reason)==null?void 0:t.message)||String(e.reason)||"Unknown rejection",stack:(r=e.reason)==null?void 0:r.stack})}catch(s){console.error("Logging failed:",s),console.error("Original rejection:",e.reason)}})}createLogEntry(e,t,r={}){var c;const s=r&&typeof r=="object"?r:{},i={timestamp:new Date().toISOString(),level:((c=j[e])==null?void 0:c.name)||e,category:s.category||f.SYSTEM,message:this.sanitizeMessage(t),sessionId:this.sessionId,context:this.sanitizeContext(s),performance:this.getPerformanceMetrics()};(e==="ERROR"||e==="CRITICAL")&&(i.stackTrace=new Error().stack);const o=this.getAnonymizedUserId();return o&&(i.userId=o),i}sanitizeMessage(e){return typeof e!="string"&&(e=String(e)),e.replace(/\b\d{3}-\d{2}-\d{4}\b/g,"***-**-****").replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,"***@***.***").replace(/\b\d{10,}\b/g,"**********").replace(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g,"[NAME]")}sanitizeContext(e){if(!e||typeof e!="object")return{};const t={...e},r=["password","token","sessionToken","authToken","patientName","firstName","lastName","fullName","email","phone","ssn","mrn","dob","dateOfBirth"],s=i=>{if(!i||typeof i!="object")return i;const o=Array.isArray(i)?[]:{};for(const[c,n]of Object.entries(i)){const u=c.toLowerCase();r.some(d=>u.includes(d))?o[c]="[REDACTED]":typeof n=="object"&&n!==null?o[c]=s(n):o[c]=n}return o};return s(t)}getAnonymizedUserId(){try{const e=sessionStorage.getItem("session_hash");if(e)return`user_${e.substring(0,8)}`}catch(e){}return null}getPerformanceMetrics(){var e;try{if("performance"in window){const t=yt.getEntriesByType("navigation")[0];return{memoryUsed:((e=yt.memory)==null?void 0:e.usedJSHeapSize)||0,loadTime:(t==null?void 0:t.loadEventEnd)-(t==null?void 0:t.loadEventStart)||0,domReady:(t==null?void 0:t.domContentLoadedEventEnd)-(t==null?void 0:t.domContentLoadedEventStart)||0}}}catch(t){}return null}log(e,t,r={}){return v(async()=>{if(!e||!t)return;const s=j[e.toUpperCase()];if(!s||s.level<this.logLevel)return;const i=this.createLogEntry(e.toUpperCase(),t,r);this.addToBuffer(i),this.enableConsole&&this.outputToConsole(i),this.enableStorage&&this.storeEntry(i),this.enableNetwork&&await this.sendToLoggingService(i)},{category:w.SYSTEM,context:{operation:"logging",level:e,message:t.substring(0,100)}})}addToBuffer(e){this.logBuffer.push(e),this.logBuffer.length>this.maxBufferSize&&(this.logBuffer=this.logBuffer.slice(-this.maxBufferSize))}outputToConsole(e){const t=j[e.level],s=`color: ${(t==null?void 0:t.color)||"#666666"}; font-weight: bold;`,i=new Date(e.timestamp).toLocaleTimeString();e.level==="ERROR"||e.level==="CRITICAL"||e.level,console.groupCollapsed(`%c[${e.level}] ${i} [${e.category}] ${e.message}`,s),e.context&&Object.keys(e.context).length>0&&console.log("Context:",e.context),e.performance&&console.log("Performance:",e.performance),e.stackTrace&&(e.level==="ERROR"||e.level==="CRITICAL")&&console.log("Stack Trace:",e.stackTrace),console.groupEnd()}storeEntry(e){try{const t=`medicalLog_${e.timestamp}`,r=JSON.stringify(e);sessionStorage.setItem(t,r),this.cleanOldEntries()}catch(t){}}cleanOldEntries(){try{const e=Object.keys(sessionStorage).filter(t=>t.startsWith("medicalLog_")).sort().reverse();e.length>100&&e.slice(100).forEach(t=>{sessionStorage.removeItem(t)})}catch(e){}}async sendToLoggingService(e){return Promise.resolve()}startPeriodicFlush(){setInterval(()=>{this.flushBuffer()},3e4)}flushBuffer(){this.logBuffer.length!==0&&this.info("Log buffer flushed",{category:f.SYSTEM,entriesCount:this.logBuffer.length})}debug(e,t={}){return this.log("DEBUG",e,t)}info(e,t={}){return this.log("INFO",e,t)}warn(e,t={}){return this.log("WARN",e,t)}error(e,t={}){return this.log("ERROR",e,t)}critical(e,t={}){return this.log("CRITICAL",e,t)}medicalCalculation(e,t,r={}){return this.info(`Medical calculation: ${e}`,{category:f.MEDICAL_CALCULATION,operation:e,success:!r.error,...r})}authentication(e,t,r={}){return this.info(`Authentication: ${e}`,{category:f.AUTHENTICATION,action:e,success:t,...r})}userInteraction(e,t={}){return this.debug(`User interaction: ${e}`,{category:f.USER_INTERACTION,action:e,...t})}networkRequest(e,t,r,s={}){const i=r>=400?"ERROR":r>=300?"WARN":"DEBUG";return this.log(i,`Network request: ${t} ${e}`,{category:f.NETWORK,method:t,url:this.sanitizeUrl(e),status:r,...s})}performance(e,t,r={}){return this.debug(`Performance metric: ${e} = ${t}`,{category:f.PERFORMANCE,metric:e,value:t,...r})}auditTrail(e,t={}){return this.info(`Audit: ${e}`,{category:f.AUDIT,event:e,...t})}sanitizeUrl(e){try{const t=new URL(e);return["token","auth","key","secret"].forEach(s=>{t.searchParams.has(s)&&t.searchParams.set(s,"[REDACTED]")}),t.toString()}catch(t){return e}}getLogs(e={}){var s;const t=[...this.logBuffer];try{Object.keys(sessionStorage).filter(o=>o.startsWith("medicalLog_")).sort().forEach(o=>{try{const c=JSON.parse(sessionStorage.getItem(o));c&&!t.find(n=>n.timestamp===c.timestamp)&&t.push(c)}catch(c){}})}catch(i){}let r=t.sort((i,o)=>new Date(o.timestamp)-new Date(i.timestamp));if(e.level){const i=((s=j[e.level.toUpperCase()])==null?void 0:s.level)||0;r=r.filter(o=>{var n;return(((n=j[o.level])==null?void 0:n.level)||0)>=i})}if(e.category&&(r=r.filter(i=>i.category===e.category)),e.since){const i=new Date(e.since);r=r.filter(o=>new Date(o.timestamp)>=i)}return e.limit&&(r=r.slice(0,e.limit)),r}exportLogs(e="json"){const t=this.getLogs();return e==="csv"?this.logsToCSV(t):JSON.stringify(t,null,2)}logsToCSV(e){if(e.length===0)return"";const t=["timestamp","level","category","message","sessionId"],r=e.map(s=>[s.timestamp,s.level,s.category,`"${s.message.replace(/"/g,'""')}"`,s.sessionId]);return[t.join(","),...r.map(s=>s.join(","))].join(`
`)}clearLogs(){this.logBuffer=[];try{Object.keys(sessionStorage).filter(t=>t.startsWith("medicalLog_")).forEach(t=>sessionStorage.removeItem(t))}catch(e){}this.info("Log storage cleared",{category:f.SYSTEM})}}const p=new Br,{debug:ws,info:Ss,warn:Es,error:Ts,critical:As,medicalCalculation:Cs,authentication:Is,userInteraction:Ls,networkRequest:Ms,performance:yt,auditTrail:_s}=p,qe={};class Vr{constructor(){this.isAuthenticated=!1,this.sessionToken=null,this.sessionExpiry=null,this.lastActivity=Date.now(),this.setupActivityTracking()}async authenticate(e){return ft(async()=>{if(p.info("Authentication attempt started",{category:f.AUTHENTICATION,hasPassword:!!e&&e.length>0,isDevelopment:ce.isDevelopment}),Hr.ensureType(e,"string","authentication password"),!e||e.trim().length===0)throw p.warn("Authentication failed: empty password",{category:f.AUTHENTICATION}),new R("Password is required","EMPTY_PASSWORD",w.VALIDATION,E.MEDIUM);if(["localhost","127.0.0.1","0.0.0.0"].includes(window.location.hostname)&&!(import.meta&&qe)||ce.isDevelopment){p.info("Development mode authentication path",{category:f.AUTHENTICATION});const c=lt();if(e.trim()!==c)return await this.delayFailedAttempt(),{success:!1,message:"Invalid credentials",errorCode:"INVALID_CREDENTIALS"};await new Promise(n=>setTimeout(n,300)),this.isAuthenticated=!0,this.sessionToken=ce.mockAuthResponse.session_token,this.sessionExpiry=new Date(ce.mockAuthResponse.expires_at),this.lastActivity=Date.now();try{this.storeSecureSession()}catch(n){console.warn("Session storage failed:",n.message)}return{success:!0,message:"Authentication successful",sessionDuration:ce.mockAuthResponse.session_duration}}const r=["localhost","127.0.0.1","0.0.0.0"].includes(window.location.hostname),s=localStorage.getItem("use_mock_api")!=="false";if(r&&s&&!(import.meta&&qe)){if(e.trim()!==lt())return await this.delayFailedAttempt(),{success:!1,message:"Invalid credentials",errorCode:"INVALID_CREDENTIALS"};await new Promise(c=>setTimeout(c,200)),this.isAuthenticated=!0,this.sessionToken=`local-preview-token-${Date.now()}`,this.sessionExpiry=new Date(Date.now()+30*60*1e3),this.lastActivity=Date.now();try{this.storeSecureSession()}catch(c){}return{success:!0,message:"Authentication successful",sessionDuration:1800}}p.debug("Sending authentication request",{category:f.AUTHENTICATION,url:Me.AUTHENTICATE});const i=await fetch(Me.AUTHENTICATE,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"login",password:e.trim()})});if(!i.ok){let c="Authentication failed",n="AUTH_FAILED";throw i.status===429?(c="Too many authentication attempts. Please wait and try again.",n="RATE_LIMITED"):i.status>=500&&(c="Authentication service temporarily unavailable",n="SERVICE_ERROR"),new R(c,n,w.AUTHENTICATION,i.status>=500?E.HIGH:E.MEDIUM).withContext({statusCode:i.status,url:Me.AUTHENTICATE})}const o=await i.json();if(!o||typeof o!="object")throw new R("Invalid response from authentication service","INVALID_RESPONSE",w.AUTHENTICATION,E.HIGH);if(o.success){this.isAuthenticated=!0,this.sessionToken=o.session_token,this.sessionExpiry=o.expires_at?new Date(o.expires_at):null,this.lastActivity=Date.now();try{this.storeSecureSession()}catch(c){console.warn("Session storage failed:",c.message)}return{success:!0,message:"Authentication successful",sessionDuration:o.session_duration}}throw await this.delayFailedAttempt(),new R(o.message||"Invalid credentials","INVALID_CREDENTIALS",w.AUTHENTICATION,E.MEDIUM).withContext({remainingAttempts:o.rate_limit_remaining,statusCode:i.status})},{timeout:15e3,fallback:t=>{var r;return{success:!1,message:t instanceof R?t.getUserMessage():"Authentication service unavailable. Please try again.",errorCode:t.code||"NETWORK_ERROR",details:t.message,remainingAttempts:(r=t.context)==null?void 0:r.remainingAttempts}},context:{operation:"user_authentication",endpoint:"authenticate"}})}isValidSession(){return this.isAuthenticated?this.sessionExpiry&&new Date>this.sessionExpiry?(this.logout(),!1):!0:this.checkStoredSession()}async validateSessionWithServer(){return this.sessionToken?ft(async()=>{if(["localhost","127.0.0.1","0.0.0.0"].includes(window.location.hostname)&&!(import.meta&&qe))return this.updateActivity(),!0;const t=await fetch(Me.AUTHENTICATE,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"validate_session",session_token:this.sessionToken})});if(!t.ok){if(t.status===401||t.status===403)return this.logout(),!1;throw new R("Session validation service error","VALIDATION_ERROR",w.AUTHENTICATION,E.MEDIUM).withContext({statusCode:t.status})}const r=await t.json();if(!r||typeof r!="object")throw new R("Invalid response from session validation service","INVALID_RESPONSE",w.AUTHENTICATION,E.MEDIUM);return r.success?(this.updateActivity(),!0):(this.logout(),!1)},{timeout:1e4,fallback:e=>(console.warn("Session validation failed, continuing with local session:",e.message),this.isValidSession()),context:{operation:"session_validation",endpoint:"validate_session"}}):!1}updateActivity(){this.lastActivity=Date.now(),this.storeAuthSession()}async logout(){p.info("User logout initiated",{category:f.AUTHENTICATION}),this.isAuthenticated=!1,this.sessionToken=null,this.sessionExpiry=null;try{await de("auth_session",!0),await de("auth_timestamp",!0),await de("session_token",!0),await de("session_expiry",!0),sessionStorage.removeItem("auth_session"),sessionStorage.removeItem("auth_timestamp"),sessionStorage.removeItem("session_token"),sessionStorage.removeItem("session_expiry"),p.info("Session data cleared during logout",{category:f.SECURITY})}catch(e){p.warn("Failed to clear some session data during logout",{category:f.SECURITY,error:e.message})}}async hashPassword(e){return v(async()=>{if(!e||typeof e!="string")throw new R("Invalid input for password hashing","INVALID_INPUT",w.VALIDATION,E.MEDIUM);if(!crypto||!crypto.subtle)throw new R("Crypto API not available","CRYPTO_UNAVAILABLE",w.SECURITY,E.HIGH);const r=new TextEncoder().encode(e),s=await crypto.subtle.digest("SHA-256",r);return Array.from(new Uint8Array(s)).map(c=>c.toString(16).padStart(2,"0")).join("")},{category:w.SECURITY,severity:E.HIGH,timeout:5e3,fallback:()=>{let t=0;for(let r=0;r<e.length;r++){const s=e.charCodeAt(r);t=(t<<5)-t+s,t&=t}return Math.abs(t).toString(16)},context:{operation:"password_hashing",inputLength:e?e.length:0}})}storeSecureSession(){return v(async()=>{if(!this.isAuthenticated||!this.sessionToken)throw new R("Cannot store session: not authenticated","NOT_AUTHENTICATED",w.AUTHENTICATION,E.LOW);if(typeof sessionStorage=="undefined")throw new R("Session storage not available","STORAGE_UNAVAILABLE",w.STORAGE,E.MEDIUM);return sessionStorage.setItem("auth_session","verified"),sessionStorage.setItem("auth_timestamp",this.lastActivity.toString()),sessionStorage.setItem("session_token",this.sessionToken),this.sessionExpiry&&sessionStorage.setItem("session_expiry",this.sessionExpiry.toISOString()),!0},{category:w.STORAGE,severity:E.LOW,timeout:1e3,fallback:e=>(console.warn("Failed to store session:",e.message),!1),context:{operation:"store_session",hasToken:!!this.sessionToken,hasExpiry:!!this.sessionExpiry}})}storeAuthSession(){this.storeSecureSession()}checkStoredSession(){try{return v(async()=>{if(typeof sessionStorage=="undefined")throw new R("Session storage not available","STORAGE_UNAVAILABLE",w.STORAGE,E.LOW);const e=await Le("auth_session",!0),t=await Le("auth_timestamp",!0),r=await Le("session_token",!0),s=await Le("session_expiry",!0);if(e==="verified"&&t&&r){if(s){const o=new Date(s);if(new Date>o)return this.logout(),!1;this.sessionExpiry=o}const i=parseInt(t);if(isNaN(i))throw new R("Invalid session timestamp","INVALID_SESSION_DATA",w.STORAGE,E.MEDIUM);return this.isAuthenticated=!0,this.sessionToken=r,this.lastActivity=i,!0}return this.logout(),!1},{category:w.STORAGE,severity:E.LOW,timeout:1e3,fallback:e=>(console.warn("Failed to check stored session:",e.message),this.logout(),!1),context:{operation:"check_stored_session"}})}catch(e){return this.logout(),!1}}setupActivityTracking(){const e=["mousedown","mousemove","keypress","scroll","touchstart"],t=()=>{this.isAuthenticated&&this.updateActivity()};e.forEach(r=>{document.addEventListener(r,t,{passive:!0})})}async delayFailedAttempt(){return v(async()=>new Promise(e=>{setTimeout(e,1e3)}),{category:w.AUTHENTICATION,severity:E.LOW,timeout:2e3,fallback:()=>Promise.resolve(),context:{operation:"auth_delay"}})}getSessionInfo(){if(!this.isAuthenticated)return{authenticated:!1};const e=this.sessionTimeout-(Date.now()-this.lastActivity),t=Math.floor(e/(60*60*1e3)),r=Math.floor(e%(60*60*1e3)/(60*1e3));return{authenticated:!0,timeRemaining:`${t}h ${r}m`,lastActivity:new Date(this.lastActivity).toLocaleTimeString()}}}const P=new Vr;function se(a){const e=[{id:1,label:"Triage"},{id:2,label:"Assessment"},{id:3,label:"Results"}];let t=`
    <div class="flex items-center justify-between mb-6 relative">
  `;return e.forEach((r,s)=>{const i=r.id===a,o=r.id<a;t+=`
      <div class="flex-1 flex flex-col items-center text-center relative">
        <!-- Step Circle -->
        <div class="w-8 h-8 flex items-center justify-center rounded-full 
                    ${o?"bg-green-500 text-white":i?"bg-blue-500 text-white":"bg-gray-300 text-gray-700"} 
                    font-bold z-10">
          ${o?"✓":r.id}
        </div>

        <!-- Step Label -->
        <span class="mt-2 text-xs ${i?"text-blue-500":"text-gray-500"}">
          ${r.label}
        </span>

        <!-- Connector Line (except last step) -->
        ${s<e.length-1?`<div class="absolute top-4 left-1/2 w-full h-1 ${o?"bg-green-500":"bg-gray-300"} z-0"></div>`:""}
      </div>
    `}),t+="</div>",t}function Ur(){return`

   <div class="container mx-auto px-4 py-8 max-w-lg">
      <!-- Progress -->
      <div class="mb-6">
        ${se(2)}
      </div>

        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
        <!-- Title -->
        <h2 class="text-2xl font-extrabold text-gray-900 dark:text-white mb-4 text-center">
             ${l("comaModuleTitle")||"Coma Module"}
        </h2>

        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl mb-6">
             <form data-module="coma" class="flex flex-col space-y-4">
                <div class="flex flex-col space-y-2">
                  <label for="gfap_value" class="text-gray-700 dark:text-gray-200 font-semibold flex items-center space-x-2">
                    <span>${l("gfapValueLabel")}</span>
                    <span class="relative group cursor-pointer text-gray-400 dark:text-gray-300">
                      ℹ️
                      <span class="absolute left-1/2 transform -translate-x-1/2 -top-8 w-56 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        ${l("gfapTooltipLong")}
                      </span>
                    </span>
                  </label>
                  <input
                    type="number"
                    id="gfap_value"
                    name="gfap_value"
                    min="${F.min}"
                    max="${F.max}"
                    step="0.1"
                    required
                    aria-describedby="gfap-help"
                    class="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                  <div id="gfap-help" class="text-gray-500 dark:text-gray-400 text-sm">
                    ${l("gfapRange").replace("{min}",F.min).replace("{max}",F.max)}
                  </div>
                </div>
       
              <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                <button
                  type="submit"
                  class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
                >
                  ${l("analyzeIchRisk")}
                </button>
                <button
                  type="button"
                  class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-3 rounded-lg transition"
                  data-action="reset"
                >
                  ${l("startOver")}
                </button>
              </div>
            </form>
      </div>
    </div>
  `}function Wr(){return`
   <div class="container mx-auto px-4 py-8 max-w-lg">
        
        <div class="mb-6 ">
          ${se(2)}
        
        </div>

           <div class="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
            <!-- Title -->
            <h2 class="text-2xl font-extrabold text-gray-900 dark:text-white mb-4 text-center">
              ${l("limitedDataModuleTitle")||"Limited Data Module"}
            </h2>
              <p class="text-sm text-gray-500 dark:text-slate-400 mt-1">${l("enterRequiredDetails")||"Enter the required data for limited module analysis"}</p>

                <form data-module="limited" class="space-y-5">
          <div class="space-y-4">
            <!-- Age -->
            <div class="flex flex-col">
              <label for="age_years" class="text-sm font-medium text-gray-700 dark:text-slate-200">${l("ageYearsLabel")}</label>
              <input type="number" name="age_years" id="age_years"
                     class="mt-1 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors duration-300"
                     min="0" max="120" required aria-describedby="age-help">
              <div id="age-help" class="text-xs text-gray-500 dark:text-slate-400 mt-1">${l("ageYearsHelp")}</div>
            </div>

            <!-- Systolic BP -->
            <div class="flex flex-col">
              <label for="systolic_bp" class="text-sm font-medium text-gray-700 dark:text-slate-200">${l("systolicBpLabel")}</label>
              <div class="relative">
                <input type="number" name="systolic_bp" id="systolic_bp"
                       class="mt-1 w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 pr-12 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors duration-300"
                       min="60" max="300" required aria-describedby="sbp-help" inputmode="numeric">
                <span class="absolute right-3 top-2.5 text-gray-400 dark:text-slate-400 text-sm">mmHg</span>
              </div>
              <div id="sbp-help" class="text-xs text-gray-500 dark:text-slate-400 mt-1">${l("systolicBpHelp")}</div>
            </div>

            <!-- Diastolic BP -->
            <div class="flex flex-col">
              <label for="diastolic_bp" class="text-sm font-medium text-gray-700 dark:text-slate-200">${l("diastolicBpLabel")}</label>
              <div class="relative">
                <input type="number" name="diastolic_bp" id="diastolic_bp"
                       class="mt-1 w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 pr-12 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors duration-300"
                       min="30" max="200" required aria-describedby="dbp-help" inputmode="numeric">
                <span class="absolute right-3 top-2.5 text-gray-400 dark:text-slate-400 text-sm">mmHg</span>
              </div>
              <div id="dbp-help" class="text-xs text-gray-500 dark:text-slate-400 mt-1">${l("diastolicBpHelp")}</div>
            </div>

            <!-- GFAP Value -->
            <div class="flex flex-col">
              <label for="gfap_value" class="text-sm font-medium text-gray-700 dark:text-slate-200 flex items-center gap-2">
                ${l("gfapValueLabel")}
                <span class="tooltip relative group cursor-pointer">
                  ℹ️
                  <span class="tooltiptext absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 dark:bg-slate-800 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity w-48 text-center z-10">
                    ${l("gfapTooltipLong")}
                  </span>
                </span>
              </label>
              <div class="relative">
                <input type="number" name="gfap_value" id="gfap_value"
                       class="mt-1 w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 pr-12 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors duration-300"
                       min="${F.min}" max="${F.max}" step="0.1" required inputmode="decimal">
                <span class="absolute right-3 top-2.5 text-gray-400 dark:text-slate-400 text-sm">pg/mL</span>
              </div>
            </div>
          </div>

          <!-- Checkbox -->
          <div class="flex items-center space-x-2">
            <input type="checkbox" name="vigilanzminderung" id="vigilanzminderung"
                   class="accent-blue-600 dark:accent-blue-500 w-4 h-4 rounded focus:ring-2 focus:ring-blue-600">
            <label for="vigilanzminderung" class="text-sm text-gray-700 dark:text-slate-300">${l("vigilanceReduction")}</label>
          </div>

          <!-- Buttons -->
          <div class="flex flex-col sm:flex-row sm:justify-between sm:space-x-2 space-y-3 sm:space-y-0 mt-6">
            <button type="submit" class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition">
              ${l("analyzeIchRisk")}
            </button>
            <button type="button" class="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-lg transition" data-action="reset">
              ${l("startOver")}
            </button>
          </div>
        </form>
            </div>
      </div>
  `}function Gr(){return`
   <div class="container mx-auto px-4 py-8 max-w-lg">
        
        <div class="mb-6">
          ${se(2)}
        </div>

        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
          <!-- Title -->
          <h2 class="text-2xl font-extrabold text-gray-900 dark:text-white mb-4 text-center">
            ${l("fullStrokeModuleTitle")||"Full Stroke Module"}
          </h2>
          <p class="text-sm text-gray-500 dark:text-slate-400 mt-1 text-center">
            ${l("enterRequiredDetails")||"Enter the required data for full module analysis"}
          </p>

          <form data-module="full" class="space-y-8 mt-6">

            <!-- Basic Information -->
            <div>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">${l("basicInformation")}</h3>
              <div class="space-y-4">
                <!-- Age -->
                <div class="flex flex-col">
                  <label for="age_years" class="text-sm font-medium text-gray-700 dark:text-slate-200">${l("ageYearsLabel")}</label>
                  <input type="number" name="age_years" id="age_years"
                         class="mt-1 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 
                                text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                         min="0" max="120" required>
                </div>

                <!-- Systolic BP -->
                <div class="flex flex-col">
                  <label for="systolic_bp" class="text-sm font-medium text-gray-700 dark:text-slate-200">${l("systolicBpLabel")}</label>
                  <div class="relative">
                    <input type="number" name="systolic_bp" id="systolic_bp"
                           class="mt-1 w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 
                                  text-gray-900 dark:text-white rounded-lg px-3 py-2 pr-12 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                           min="60" max="300" required inputmode="numeric">
                    <span class="absolute right-3 top-2.5 text-gray-400 dark:text-slate-400 text-sm">mmHg</span>
                  </div>
                </div>

                <!-- Diastolic BP -->
                <div class="flex flex-col">
                  <label for="diastolic_bp" class="text-sm font-medium text-gray-700 dark:text-slate-200">${l("diastolicBpLabel")}</label>
                  <div class="relative">
                    <input type="number" name="diastolic_bp" id="diastolic_bp"
                           class="mt-1 w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 
                                  text-gray-900 dark:text-white rounded-lg px-3 py-2 pr-12 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                           min="30" max="200" required inputmode="numeric">
                    <span class="absolute right-3 top-2.5 text-gray-400 dark:text-slate-400 text-sm">mmHg</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Biomarkers & Scores -->
            <div>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">${l("biomarkersScores")}</h3>
              <div class="space-y-4">

                <!-- GFAP -->
                <div class="flex flex-col">
                  <label for="gfap_value" class="text-sm font-medium text-gray-700 dark:text-slate-200 flex items-center gap-2">
                    ${l("gfapValueLabel")}
                    <span class="tooltip relative group cursor-pointer">
                      ℹ️
                      <span class="tooltiptext absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 dark:bg-slate-800 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity w-48 text-center z-10">
                        ${l("gfapTooltip")}
                      </span>
                    </span>
                  </label>
                  <div class="relative">
                    <input type="number" name="gfap_value" id="gfap_value"
                           class="mt-1 w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 
                                  text-gray-900 dark:text-white rounded-lg px-3 py-2 pr-12 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                           min="${F.min}" max="${F.max}" step="0.1" required inputmode="decimal">
                    <span class="absolute right-3 top-2.5 text-gray-400 dark:text-slate-400 text-sm">pg/mL</span>
                  </div>
                </div>

                <!-- FAST-ED Score -->
                <div class="flex flex-col">
                  <label for="fast_ed_score" class="text-sm font-medium text-gray-700 dark:text-slate-200 flex items-center gap-2">
                    ${l("fastEdScoreLabel")}
                    <span class="tooltip relative group cursor-pointer">
                      ℹ️
                      <span class="tooltiptext absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 dark:bg-slate-800 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity w-48 text-center z-10">
                        ${l("fastEdCalculatorSubtitle")}
                      </span>
                    </span>
                  </label>
                  <input type="number" name="fast_ed_score" id="fast_ed_score"
                         class="mt-1 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 
                                text-gray-900 dark:text-white rounded-lg px-3 py-2 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
                         min="0" max="9" required readonly placeholder="${l("fastEdCalculatorSubtitle")}">
                  <input type="hidden" name="armparese" id="armparese_hidden" value="false">
                  <input type="hidden" name="eye_deviation" id="eye_deviation_hidden" value="false">
                </div>
              </div>
            </div>

            <!-- Clinical Symptoms -->
            <div>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">${l("clinicalSymptoms")}</h3>
              <div class="space-y-2">
                <label class="flex items-center space-x-2">
                  <input type="checkbox" name="headache" id="headache" class="accent-blue-600 dark:accent-blue-500 w-4 h-4 rounded">
                  <span class="text-sm text-gray-700 dark:text-slate-300">${l("headacheLabel")}</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input type="checkbox" name="vigilanzminderung" id="vigilanzminderung" class="accent-blue-600 dark:accent-blue-500 w-4 h-4 rounded">
                  <span class="text-sm text-gray-700 dark:text-slate-300">${l("vigilanzLabel")}</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input type="checkbox" name="beinparese" id="beinparese" class="accent-blue-600 dark:accent-blue-500 w-4 h-4 rounded">
                  <span class="text-sm text-gray-700 dark:text-slate-300">${l("legParesis")}</span>
                </label>
              </div>
            </div>

            <!-- Medical History -->
            <div>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">${l("medicalHistory")}</h3>
              <div class="space-y-2">
                <label class="flex items-center space-x-2">
                  <input type="checkbox" name="atrial_fibrillation" id="atrial_fibrillation" class="accent-blue-600 dark:accent-blue-500 w-4 h-4 rounded">
                  <span class="text-sm text-gray-700 dark:text-slate-300">${l("atrialFibrillation")}</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input type="checkbox" name="anticoagulated_noak" id="anticoagulated_noak" class="accent-blue-600 dark:accent-blue-500 w-4 h-4 rounded">
                  <span class="text-sm text-gray-700 dark:text-slate-300">${l("onNoacDoac")}</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input type="checkbox" name="antiplatelets" id="antiplatelets" class="accent-blue-600 dark:accent-blue-500 w-4 h-4 rounded">
                  <span class="text-sm text-gray-700 dark:text-slate-300">${l("onAntiplatelets")}</span>
                </label>
              </div>
            </div>

            <!-- Buttons -->
            <div class="flex flex-col sm:flex-row sm:justify-between sm:space-x-2 space-y-3 sm:space-y-0 mt-6">
              <button type="submit" class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition">
                ${l("analyzeStrokeRisk")}
              </button>
              <button type="button" class="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-lg transition" data-action="reset">
                ${l("startOver")}
              </button>
            </div>

          </form>
        </div>
      </div>
  `}const jr="modulepreload",qr=function(a){return"/0925/"+a},bt={},q=function(e,t,r){let s=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),c=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));s=Promise.allSettled(t.map(n=>{if(n=qr(n),n in bt)return;bt[n]=!0;const u=n.endsWith(".css"),d=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${n}"]${d}`))return;const m=document.createElement("link");if(m.rel=u?"stylesheet":jr,u||(m.as="script"),m.crossOrigin="",m.href=n,c&&m.setAttribute("nonce",c),document.head.appendChild(m),u)return new Promise((x,C)=>{m.addEventListener("load",x),m.addEventListener("error",()=>C(new Error(`Unable to preload CSS for ${n}`)))})}))}function i(o){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=o,window.dispatchEvent(c),!c.defaultPrevented)throw o}return s.then(o=>{for(const c of o||[])c.status==="rejected"&&i(c.reason);return e().catch(i)})};function zt(){return`
   <div class="critical-alert bg-red-50 dark:bg-red-900/40 border-l-4 border-red-600 rounded-lg p-4 shadow-sm flex flex-col gap-2 transition-all duration-300 hover:shadow-md mb-3">
  <h4 class="flex items-center gap-2 text-red-700 dark:text-red-300 font-semibold text-lg">
    <span class="alert-icon text-xl">🚨</span>
    ${l("criticalAlertTitle")}
  </h4>
  <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
    ${l("criticalAlertMessage")}
  </p>
</div>

  `}const Kr={age_years:"ageLabel",age:"ageLabel",systolic_bp:"systolicLabel",diastolic_bp:"diastolicLabel",systolic_blood_pressure:"systolicLabel",diastolic_blood_pressure:"diastolicLabel",blood_pressure_systolic:"systolicLabel",blood_pressure_diastolic:"diastolicLabel",gfap_value:"gfapLabel",gfap:"gfapLabel",gfap_level:"gfapLabel",fast_ed_score:"fastEdLabel",fast_ed:"fastEdLabel",fast_ed_total:"fastEdLabel",vigilanzminderung:"vigilanzLabel",vigilance_reduction:"vigilanzLabel",reduced_consciousness:"vigilanzLabel",armparese:"armPareseLabel",arm_paresis:"armPareseLabel",arm_weakness:"armPareseLabel",beinparese:"beinPareseLabel",leg_paresis:"beinPareseLabel",leg_weakness:"beinPareseLabel",eye_deviation:"eyeDeviationLabel",blickdeviation:"eyeDeviationLabel",headache:"headacheLabel",kopfschmerzen:"headacheLabel",atrial_fibrillation:"atrialFibLabel",vorhofflimmern:"atrialFibLabel",anticoagulated_noak:"anticoagLabel",anticoagulation:"anticoagLabel",antiplatelets:"antiplateletsLabel",thrombozytenaggregationshemmer:"antiplateletsLabel"},Yr=[{pattern:/_score$/,replacement:" Score"},{pattern:/_value$/,replacement:" Level"},{pattern:/_bp$/,replacement:" Blood Pressure"},{pattern:/_years?$/,replacement:" (years)"},{pattern:/^ich_/,replacement:"Brain Bleeding "},{pattern:/^lvo_/,replacement:"Large Vessel "},{pattern:/parese$/,replacement:"Weakness"},{pattern:/deviation$/,replacement:"Movement"}];function De(a){if(!a)return"";const e=Kr[a.toLowerCase()];if(e){const r=l(e);if(r&&r!==e)return r}let t=a.toLowerCase();return Yr.forEach(({pattern:r,replacement:s})=>{t=t.replace(r,s)}),t=t.replace(/_/g," ").replace(/\b\w/g,r=>r.toUpperCase()).trim(),t}function Qr(a){return De(a).replace(/\s*\([^)]*\)\s*/g,"").trim()}function Jr(a,e=""){return a==null||a===""?"":typeof a=="boolean"?a?"✓":"✗":typeof a=="number"?e.includes("bp")||e.includes("blood_pressure")?`${a} mmHg`:e.includes("gfap")?`${a} pg/mL`:e.includes("age")?`${a} years`:e.includes("score")||Number.isInteger(a)?a.toString():a.toFixed(1):a.toString()}function Zr(a,e){if(!(a!=null&&a.drivers)&&!(e!=null&&e.drivers))return"";let t=`
    <div class="drivers-section bg-white p-6 md:p-8 rounded-2xl shadow-sm drivers-section">
      <div class="drivers-header flex flex-col md:flex-row md:items-center md:justify-between gap-3 drivers-header">
        <div class="flex items-start md:items-center gap-3">
          <h3 class="driver-title text-lg md:text-xl font-semibold leading-tight flex items-center gap-2">
            <span class="driver-header-icon text-2xl">🎯</span>
            ${l("riskAnalysis")}
          </h3>
          <p class="drivers-subtitle text-sm text-gray-500 mt-1 md:mt-0">${l("riskAnalysisSubtitle")}</p>
        </div>
        <!-- place for header actions (optional) -->
        <div class="drivers-actions flex items-center gap-2"></div>
      </div>
      <div class="enhanced-drivers-grid flex flex-col gap-4 mt-6 enhanced-drivers-grid">
  `;return console.log("[Drivers] ICH has drivers:",!!(a!=null&&a.drivers),a==null?void 0:a.drivers),console.log("[Drivers] LVO has drivers:",!!(e!=null&&e.drivers),"notPossible:",e==null?void 0:e.notPossible,e==null?void 0:e.drivers),a!=null&&a.drivers&&(console.log("🧠 Rendering ICH drivers panel"),t+=vt(a.drivers,"ICH","ich",a.probability)),e!=null&&e.drivers&&!e.notPossible&&(console.log("🩸 Rendering LVO drivers panel"),t+=vt(e.drivers,"LVO","lvo",e.probability)),t+=`
      </div>
    </div>
  `,t}function vt(a,e,t,r){if(!a||Object.keys(a).length===0)return`
      <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 text-center shadow-sm">
        <div class="flex flex-col items-center justify-center gap-2">
          <div class="text-3xl ${t==="ich"?"text-blue-500":"text-red-500"}">
            ${t==="ich"?"🧠":"🩸"}
          </div>
          <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100">${e} ${l("riskFactors")}</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">${l("noDriverData")}</p>
          <p class="italic text-gray-400">${l("driverInfoNotAvailable")}</p>
        </div>
      </div>
    `;const s=a;if(s.kind==="unavailable")return`
      <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 text-center shadow-sm">
        <div class="flex flex-col items-center justify-center gap-2">
          <div class="text-3xl ${t==="ich"?"text-blue-500":"text-red-500"}">
            ${t==="ich"?"🧠":"🩸"}
          </div>
          <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100">${e} ${l("riskFactors")}</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">${l("driverAnalysisUnavailable")}</p>
          <p class="italic text-gray-400">${l("driverAnalysisNotAvailable")}</p>
        </div>
      </div>
    `;const i=(s.positive||[]).sort((m,x)=>Math.abs(x.weight)-Math.abs(m.weight)).slice(0,3),o=(s.negative||[]).sort((m,x)=>Math.abs(x.weight)-Math.abs(m.weight)).slice(0,3),c=Math.max(...i.map(m=>Math.abs(m.weight)),...o.map(m=>Math.abs(m.weight)),.01);let n=`
    <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="text-3xl ${t==="ich"?"text-blue-500":"text-red-500"}">
          ${t==="ich"?"🧠":"🩸"}
        </div>
        <div>
          <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100">${e} ${l("riskFactors")}</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">${l("contributingFactors")}</p>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
  `;n+=`
    <div class="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-700 p-4">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-green-600 dark:text-green-400 text-lg">⬆</span>
        <span class="text-sm font-semibold text-green-700 dark:text-green-300">${l("increaseRisk")}</span>
      </div>
      <div class="space-y-3">
  `;const u=i.reduce((m,x)=>m+Math.abs(x.weight),0);i.length>0?i.forEach(m=>{const x=u>0?Math.abs(m.weight)/u*100:0;Math.abs(m.weight)/c*100;const C=De(m.label);n+=`
        <div class="flex justify-between items-center text-sm bg-white dark:bg-gray-800 rounded-md px-3 py-2 shadow-sm border border-green-100 dark:border-green-800">
          <span class="text-gray-700 dark:text-gray-300">${C}</span>
          <span class="text-green-600 dark:text-green-400 font-semibold">+${x.toFixed(0)}%</span>
        </div>
      `}):n+=`<p class="text-sm italic text-gray-500 dark:text-gray-400">${l("noPositiveFactors")}</p>`,n+=`
      </div>
    </div>
  `,n+=`
    <div class="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-700 p-4">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-red-600 dark:text-red-400 text-lg">⬇</span>
        <span class="text-sm font-semibold text-red-700 dark:text-red-300">${l("decreaseRisk")}</span>
      </div>
      <div class="space-y-3">
  `;const d=o.reduce((m,x)=>m+Math.abs(x.weight),0);return o.length>0?o.forEach(m=>{const x=d>0?Math.abs(m.weight)/d*100:0;Math.abs(m.weight)/c*100;const C=De(m.label);n+=`
        <div class="flex justify-between items-center text-sm bg-white dark:bg-gray-800 rounded-md px-3 py-2 shadow-sm border border-red-100 dark:border-red-800">
          <span class="text-gray-700 dark:text-gray-300">${C}</span>
          <span class="text-red-600 dark:text-red-400 font-semibold">-${x.toFixed(0)}%</span>
        </div>
      `}):n+=`<p class="text-sm italic text-gray-500 dark:text-gray-400">${l("noNegativeFactors")}</p>`,n+=`
      </div>
    </div>
  </div>
</div>
`,n}const Xr={bayern:{neurosurgicalCenters:[{id:"BY-NS-001",name:"LMU Klinikum München - Großhadern",address:"Marchioninistraße 15, 81377 München",coordinates:{lat:48.1106,lng:11.4684},phone:"+49 89 4400-0",emergency:"+49 89 4400-73331",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1440,network:"TEMPiS"},{id:"BY-NS-002",name:"Klinikum rechts der Isar München (TUM)",address:"Ismaninger Str. 22, 81675 München",coordinates:{lat:48.1497,lng:11.6052},phone:"+49 89 4140-0",emergency:"+49 89 4140-2249",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1161,network:"TEMPiS"},{id:"BY-NS-003",name:"Städtisches Klinikum München Schwabing",address:"Kölner Platz 1, 80804 München",coordinates:{lat:48.1732,lng:11.5755},phone:"+49 89 3068-0",emergency:"+49 89 3068-2050",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:648,network:"TEMPiS"},{id:"BY-NS-004",name:"Städtisches Klinikum München Bogenhausen",address:"Englschalkinger Str. 77, 81925 München",coordinates:{lat:48.1614,lng:11.6254},phone:"+49 89 9270-0",emergency:"+49 89 9270-2050",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:689,network:"TEMPiS"},{id:"BY-NS-005",name:"Universitätsklinikum Erlangen",address:"Maximiliansplatz 2, 91054 Erlangen",coordinates:{lat:49.5982,lng:11.0037},phone:"+49 9131 85-0",emergency:"+49 9131 85-39003",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1371,network:"TEMPiS"},{id:"BY-NS-006",name:"Universitätsklinikum Regensburg",address:"Franz-Josef-Strauß-Allee 11, 93053 Regensburg",coordinates:{lat:49.0134,lng:12.0991},phone:"+49 941 944-0",emergency:"+49 941 944-7501",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1042,network:"TEMPiS"},{id:"BY-NS-007",name:"Universitätsklinikum Würzburg",address:"Oberdürrbacher Str. 6, 97080 Würzburg",coordinates:{lat:49.784,lng:9.9721},phone:"+49 931 201-0",emergency:"+49 931 201-24444",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1264,network:"TEMPiS"},{id:"BY-NS-008",name:"Klinikum Nürnberg Nord",address:"Prof.-Ernst-Nathan-Str. 1, 90419 Nürnberg",coordinates:{lat:49.4521,lng:11.0767},phone:"+49 911 398-0",emergency:"+49 911 398-2369",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1368,network:"TEMPiS"},{id:"BY-NS-009",name:"Universitätsklinikum Augsburg",address:"Stenglinstr. 2, 86156 Augsburg",coordinates:{lat:48.3668,lng:10.9093},phone:"+49 821 400-01",emergency:"+49 821 400-2356",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1740,network:"TEMPiS"},{id:"BY-NS-010",name:"Klinikum Aschaffenburg-Alzenau",address:"Am Hasenkopf 1, 63739 Aschaffenburg",coordinates:{lat:49.9737,lng:9.157},phone:"+49 6021 32-0",emergency:"+49 6021 32-2800",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:40,network:"TRANSIT"},{id:"BY-NS-011",name:"Klinikum Landshut",address:"Robert-Koch-Str. 1, 84034 Landshut",coordinates:{lat:48.5665,lng:12.1512},phone:"+49 871 698-0",emergency:"+49 871 698-3333",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:505,network:"TEMPiS"},{id:"BY-NS-012",name:"Klinikum Coburg",address:"Ketschendorfer Str. 33, 96450 Coburg",coordinates:{lat:50.2596,lng:10.9644},phone:"+49 9561 22-0",emergency:"+49 9561 22-6800",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:547,network:"STENO"},{id:"BY-NS-013",name:"Klinikum Passau",address:"Bischof-Pilgrim-Str. 1, 94032 Passau",coordinates:{lat:48.5665,lng:13.4777},phone:"+49 851 5300-0",emergency:"+49 851 5300-2222",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:696,network:"TEMPiS"}],comprehensiveStrokeCenters:[{id:"BY-CS-001",name:"Klinikum Bamberg",address:"Buger Str. 80, 96049 Bamberg",coordinates:{lat:49.8988,lng:10.9027},phone:"+49 951 503-0",emergency:"+49 951 503-11101",thrombectomy:!0,thrombolysis:!0,beds:630,network:"TEMPiS"},{id:"BY-CS-002",name:"Klinikum Bayreuth",address:"Preuschwitzer Str. 101, 95445 Bayreuth",coordinates:{lat:49.9459,lng:11.5779},phone:"+49 921 400-0",emergency:"+49 921 400-5401",thrombectomy:!0,thrombolysis:!0,beds:848,network:"TEMPiS"},{id:"BY-CS-003",name:"Klinikum Coburg",address:"Ketschendorfer Str. 33, 96450 Coburg",coordinates:{lat:50.2596,lng:10.9685},phone:"+49 9561 22-0",emergency:"+49 9561 22-6300",thrombectomy:!0,thrombolysis:!0,beds:522,network:"TEMPiS"}],regionalStrokeUnits:[{id:"BY-RSU-001",name:"Goldberg-Klinik Kelheim",address:"Traubenweg 3, 93309 Kelheim",coordinates:{lat:48.9166,lng:11.8742},phone:"+49 9441 702-0",emergency:"+49 9441 702-6800",thrombolysis:!0,beds:200,network:"TEMPiS"},{id:"BY-RSU-002",name:"DONAUISAR Klinikum Deggendorf",address:"Perlasberger Str. 41, 94469 Deggendorf",coordinates:{lat:48.8372,lng:12.9619},phone:"+49 991 380-0",emergency:"+49 991 380-2201",thrombolysis:!0,beds:450,network:"TEMPiS"},{id:"BY-RSU-003",name:"Klinikum St. Elisabeth Straubing",address:"St.-Elisabeth-Str. 23, 94315 Straubing",coordinates:{lat:48.8742,lng:12.5733},phone:"+49 9421 710-0",emergency:"+49 9421 710-2000",thrombolysis:!0,beds:580,network:"TEMPiS"},{id:"BY-RSU-004",name:"Klinikum Freising",address:"Mainburger Str. 29, 85356 Freising",coordinates:{lat:48.4142,lng:11.7461},phone:"+49 8161 24-0",emergency:"+49 8161 24-2800",thrombolysis:!0,beds:380,network:"TEMPiS"},{id:"BY-RSU-005",name:"Klinikum Landkreis Erding",address:"Bajuwarenstr. 5, 85435 Erding",coordinates:{lat:48.3061,lng:11.9067},phone:"+49 8122 59-0",emergency:"+49 8122 59-2201",thrombolysis:!0,beds:350,network:"TEMPiS"},{id:"BY-RSU-006",name:"Helios Amper-Klinikum Dachau",address:"Krankenhausstr. 15, 85221 Dachau",coordinates:{lat:48.2599,lng:11.4342},phone:"+49 8131 76-0",emergency:"+49 8131 76-2201",thrombolysis:!0,beds:480,network:"TEMPiS"},{id:"BY-RSU-007",name:"Klinikum Fürstenfeldbruck",address:"Dachauer Str. 33, 82256 Fürstenfeldbruck",coordinates:{lat:48.1772,lng:11.2578},phone:"+49 8141 99-0",emergency:"+49 8141 99-2201",thrombolysis:!0,beds:420,network:"TEMPiS"},{id:"BY-RSU-008",name:"Klinikum Ingolstadt",address:"Krumenauerstraße 25, 85049 Ingolstadt",coordinates:{lat:48.7665,lng:11.4364},phone:"+49 841 880-0",emergency:"+49 841 880-2201",thrombolysis:!0,beds:665,network:"TEMPiS"},{id:"BY-RSU-009",name:"Klinikum Passau",address:"Bischof-Pilgrim-Str. 1, 94032 Passau",coordinates:{lat:48.5665,lng:13.4513},phone:"+49 851 5300-0",emergency:"+49 851 5300-2100",thrombolysis:!0,beds:540,network:"TEMPiS"},{id:"BY-RSU-010",name:"Klinikum Landshut",address:"Robert-Koch-Str. 1, 84034 Landshut",coordinates:{lat:48.5436,lng:12.1619},phone:"+49 871 698-0",emergency:"+49 871 698-3333",thrombolysis:!0,beds:790,network:"TEMPiS"},{id:"BY-RSU-011",name:"RoMed Klinikum Rosenheim",address:"Pettenkoferstr. 10, 83022 Rosenheim",coordinates:{lat:47.8567,lng:12.1265},phone:"+49 8031 365-0",emergency:"+49 8031 365-3711",thrombolysis:!0,beds:870,network:"TEMPiS"},{id:"BY-RSU-012",name:"Klinikum Memmingen",address:"Bismarckstr. 23, 87700 Memmingen",coordinates:{lat:47.9833,lng:10.1833},phone:"+49 8331 70-0",emergency:"+49 8331 70-2500",thrombolysis:!0,beds:520,network:"TEMPiS"},{id:"BY-RSU-013",name:"Klinikum Kempten-Oberallgäu",address:"Robert-Weixler-Str. 50, 87439 Kempten",coordinates:{lat:47.7261,lng:10.3097},phone:"+49 831 530-0",emergency:"+49 831 530-2201",thrombolysis:!0,beds:650,network:"TEMPiS"},{id:"BY-RSU-014",name:"Klinikum Aschaffenburg-Alzenau",address:"Am Hasenkopf 1, 63739 Aschaffenburg",coordinates:{lat:49.9747,lng:9.1581},phone:"+49 6021 32-0",emergency:"+49 6021 32-2700",thrombolysis:!0,beds:590,network:"TEMPiS"}],thrombolysisHospitals:[{id:"BY-TH-001",name:"Krankenhaus Vilsbiburg",address:"Sonnenstraße 10, 84137 Vilsbiburg",coordinates:{lat:48.6333,lng:12.2833},phone:"+49 8741 60-0",thrombolysis:!0,beds:180},{id:"BY-TH-002",name:"Krankenhaus Eggenfelden",address:"Pfarrkirchener Str. 5, 84307 Eggenfelden",coordinates:{lat:48.4,lng:12.7667},phone:"+49 8721 98-0",thrombolysis:!0,beds:220}]},badenWuerttemberg:{neurosurgicalCenters:[{id:"BW-NS-001",name:"Universitätsklinikum Freiburg",address:"Hugstetter Str. 55, 79106 Freiburg",coordinates:{lat:48.0025,lng:7.8347},phone:"+49 761 270-0",emergency:"+49 761 270-34010",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1600,network:"FAST"},{id:"BW-NS-002",name:"Universitätsklinikum Heidelberg",address:"Im Neuenheimer Feld 400, 69120 Heidelberg",coordinates:{lat:49.4178,lng:8.6706},phone:"+49 6221 56-0",emergency:"+49 6221 56-36643",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1621,network:"FAST"},{id:"BW-NS-003",name:"Universitätsklinikum Tübingen",address:"Geissweg 3, 72076 Tübingen",coordinates:{lat:48.5378,lng:9.0538},phone:"+49 7071 29-0",emergency:"+49 7071 29-82211",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1550,network:"FAST"},{id:"BW-NS-004",name:"Universitätsklinikum Ulm",address:"Albert-Einstein-Allee 23, 89081 Ulm",coordinates:{lat:48.4196,lng:9.9592},phone:"+49 731 500-0",emergency:"+49 731 500-63001",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1264,network:"FAST"},{id:"BW-NS-005",name:"Klinikum Stuttgart - Katharinenhospital",address:"Kriegsbergstraße 60, 70174 Stuttgart",coordinates:{lat:48.7784,lng:9.1682},phone:"+49 711 278-0",emergency:"+49 711 278-32001",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:950,network:"FAST"},{id:"BW-NS-006",name:"Städtisches Klinikum Karlsruhe",address:"Moltkestraße 90, 76133 Karlsruhe",coordinates:{lat:49.0047,lng:8.3858},phone:"+49 721 974-0",emergency:"+49 721 974-2301",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1570,network:"FAST"},{id:"BW-NS-007",name:"Klinikum Ludwigsburg",address:"Posilipostraße 4, 71640 Ludwigsburg",coordinates:{lat:48.8901,lng:9.1953},phone:"+49 7141 99-0",emergency:"+49 7141 99-67201",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:720,network:"FAST"}],comprehensiveStrokeCenters:[{id:"BW-CS-001",name:"Universitätsmedizin Mannheim",address:"Theodor-Kutzer-Ufer 1-3, 68167 Mannheim",coordinates:{lat:49.4828,lng:8.4664},phone:"+49 621 383-0",emergency:"+49 621 383-2251",thrombectomy:!0,thrombolysis:!0,beds:1400,network:"FAST"}],regionalStrokeUnits:[{id:"BW-RSU-001",name:"Robert-Bosch-Krankenhaus Stuttgart",address:"Auerbachstraße 110, 70376 Stuttgart",coordinates:{lat:48.7447,lng:9.2294},phone:"+49 711 8101-0",emergency:"+49 711 8101-3456",thrombolysis:!0,beds:850,network:"FAST"}],thrombolysisHospitals:[]},nordrheinWestfalen:{neurosurgicalCenters:[{id:"NRW-NS-001",name:"Universitätsklinikum Düsseldorf",address:"Moorenstraße 5, 40225 Düsseldorf",coordinates:{lat:51.1906,lng:6.8064},phone:"+49 211 81-0",emergency:"+49 211 81-17700",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1300,network:"NEVANO+"},{id:"NRW-NS-002",name:"Universitätsklinikum Köln",address:"Kerpener Str. 62, 50937 Köln",coordinates:{lat:50.9253,lng:6.9187},phone:"+49 221 478-0",emergency:"+49 221 478-32500",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1500,network:"NEVANO+"},{id:"NRW-NS-003",name:"Universitätsklinikum Essen",address:"Hufelandstraße 55, 45147 Essen",coordinates:{lat:51.4285,lng:7.0073},phone:"+49 201 723-0",emergency:"+49 201 723-84444",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1350,network:"NEVANO+"},{id:"NRW-NS-004",name:"Universitätsklinikum Münster",address:"Albert-Schweitzer-Campus 1, 48149 Münster",coordinates:{lat:51.9607,lng:7.6261},phone:"+49 251 83-0",emergency:"+49 251 83-47255",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1513,network:"NEVANO+"},{id:"NRW-NS-005",name:"Universitätsklinikum Bonn",address:"Venusberg-Campus 1, 53127 Bonn",coordinates:{lat:50.6916,lng:7.1127},phone:"+49 228 287-0",emergency:"+49 228 287-15107",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1200,network:"NEVANO+"},{id:"NRW-NS-006",name:"Klinikum Dortmund",address:"Beurhausstraße 40, 44137 Dortmund",coordinates:{lat:51.5036,lng:7.4663},phone:"+49 231 953-0",emergency:"+49 231 953-20050",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:1200,network:"NVNR"},{id:"NRW-NS-007",name:"Rhein-Maas Klinikum Würselen",address:"Mauerfeldstraße 25, 52146 Würselen",coordinates:{lat:50.8178,lng:6.1264},phone:"+49 2405 62-0",emergency:"+49 2405 62-2222",neurosurgery:!0,thrombectomy:!0,thrombolysis:!0,beds:420,network:"NEVANO+"}],comprehensiveStrokeCenters:[{id:"NRW-CS-001",name:"Universitätsklinikum Aachen",address:"Pauwelsstraße 30, 52074 Aachen",coordinates:{lat:50.778,lng:6.0614},phone:"+49 241 80-0",emergency:"+49 241 80-89611",thrombectomy:!0,thrombolysis:!0,beds:1400,network:"NEVANO+"}],regionalStrokeUnits:[{id:"NRW-RSU-001",name:"Helios Universitätsklinikum Wuppertal",address:"Heusnerstraße 40, 42283 Wuppertal",coordinates:{lat:51.2467,lng:7.1703},phone:"+49 202 896-0",emergency:"+49 202 896-2180",thrombolysis:!0,beds:1050,network:"NEVANO+"}],thrombolysisHospitals:[{id:"NRW-TH-009",name:"Elisabeth-Krankenhaus Essen",address:"Klara-Kopp-Weg 1, 45138 Essen",coordinates:{lat:51.4495,lng:7.0137},phone:"+49 201 897-0",thrombolysis:!0,beds:583},{id:"NRW-TH-010",name:"Klinikum Oberberg Gummersbach",address:"Wilhelm-Breckow-Allee 20, 51643 Gummersbach",coordinates:{lat:51.0277,lng:7.5694},phone:"+49 2261 17-0",thrombolysis:!0,beds:431},{id:"NRW-TH-011",name:"St. Vincenz-Krankenhaus Limburg",address:"Auf dem Schafsberg, 65549 Limburg",coordinates:{lat:50.3856,lng:8.0584},phone:"+49 6431 292-0",thrombolysis:!0,beds:452},{id:"NRW-TH-012",name:"Klinikum Lüdenscheid",address:"Paulmannshöher Straße 14, 58515 Lüdenscheid",coordinates:{lat:51.2186,lng:7.6298},phone:"+49 2351 46-0",thrombolysis:!0,beds:869}]}},Rs={routePatient(a){const{location:e,state:t,ichProbability:r,timeFromOnset:s,clinicalFactors:i}=a,o=t||this.detectState(e),c=Xr[o];if(r>=.5){const u=this.findNearest(e,c.neurosurgicalCenters);if(!u)throw new Error(`No neurosurgical centers available in ${o}`);return{category:"NEUROSURGICAL_CENTER",destination:u,urgency:"IMMEDIATE",reasoning:"High bleeding probability (≥50%) - neurosurgical evaluation required",preAlert:"Activate neurosurgery team",bypassLocal:!0,threshold:"≥50%",state:o}}if(r>=.3){const u=[...c.neurosurgicalCenters,...c.comprehensiveStrokeCenters];return{category:"COMPREHENSIVE_CENTER",destination:this.findNearest(e,u),urgency:"URGENT",reasoning:"Intermediate bleeding risk (30-50%) - CT and possible intervention",preAlert:"Prepare for possible neurosurgical consultation",transferPlan:this.findNearest(e,c.neurosurgicalCenters),threshold:"30-50%",state:o}}if(s&&s<=270){const u=[...c.neurosurgicalCenters,...c.comprehensiveStrokeCenters,...c.regionalStrokeUnits,...c.thrombolysisHospitals];return{category:"THROMBOLYSIS_CAPABLE",destination:this.findNearest(e,u),urgency:"TIME_CRITICAL",reasoning:"Low bleeding risk (<30%), within tPA window - nearest thrombolysis",preAlert:"Prepare for thrombolysis protocol",bypassLocal:!1,threshold:"<30%",timeWindow:"≤4.5h",state:o}}const n=[...c.neurosurgicalCenters,...c.comprehensiveStrokeCenters,...c.regionalStrokeUnits];return{category:"STROKE_UNIT",destination:this.findNearest(e,n),urgency:"STANDARD",reasoning:s>270?"Low bleeding risk, outside tPA window - standard stroke evaluation":"Low bleeding risk - standard stroke evaluation",preAlert:"Standard stroke protocol",bypassLocal:!1,threshold:"<30%",timeWindow:s?">4.5h":"unknown",state:o}},detectState(a){return a.lat>=47.5&&a.lat<=49.8&&a.lng>=7.5&&a.lng<=10.2?"badenWuerttemberg":a.lat>=50.3&&a.lat<=52.5&&a.lng>=5.9&&a.lng<=9.5?"nordrheinWestfalen":a.lat>=47.2&&a.lat<=50.6&&a.lng>=10.2&&a.lng<=13.8?"bayern":this.findNearestState(a)},findNearestState(a){const e={bayern:{lat:49,lng:11.5},badenWuerttemberg:{lat:48.5,lng:9},nordrheinWestfalen:{lat:51.5,lng:7.5}};let t="bayern",r=1/0;for(const[s,i]of Object.entries(e)){const o=this.calculateDistance(a,i);o<r&&(r=o,t=s)}return t},findNearest(a,e){return!e||e.length===0?null:e.map(t=>!t.coordinates||typeof t.coordinates.lat!="number"?null:{...t,distance:this.calculateDistance(a,t.coordinates)}).filter(t=>t!==null).sort((t,r)=>t.distance-r.distance)[0]},calculateDistance(a,e){const r=this.toRad(e.lat-a.lat),s=this.toRad(e.lng-a.lng),i=Math.sin(r/2)*Math.sin(r/2)+Math.cos(this.toRad(a.lat))*Math.cos(this.toRad(e.lat))*Math.sin(s/2)*Math.sin(s/2);return 6371*(2*Math.atan2(Math.sqrt(i),Math.sqrt(1-i)))},toRad(a){return a*(Math.PI/180)}};function $t(a,e,t,r){const i=_e(t-a),o=_e(r-e),c=Math.sin(i/2)*Math.sin(i/2)+Math.cos(_e(a))*Math.cos(_e(t))*Math.sin(o/2)*Math.sin(o/2);return 6371*(2*Math.atan2(Math.sqrt(c),Math.sqrt(1-c)))}function _e(a){return a*(Math.PI/180)}async function ea(a,e,t,r,s="driving-car"){try{const i=`https://api.openrouteservice.org/v2/directions/${s}`,c=await fetch(i,{method:"POST",headers:{Accept:"application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",Authorization:"5b3ce3597851110001cf624868c4c27b63ae476c9c26c8bffbc35688","Content-Type":"application/json; charset=utf-8"},body:JSON.stringify({coordinates:[[e,a],[r,t]],radiuses:[1e3,1e3],format:"json"})});if(!c.ok)throw new Error(`Routing API error: ${c.status}`);const n=await c.json();if(n.routes&&n.routes.length>0){const u=n.routes[0];return{duration:Math.round(u.summary.duration/60),distance:Math.round(u.summary.distance/1e3),source:"routing"}}throw new Error("No route found")}catch(i){let o="estimated";i.name==="TypeError"&&i.message.includes("Failed to fetch")?(console.info("[TravelTime] OpenRouteService blocked by CORS, using distance estimation"),o="cors-fallback"):i.message.includes("signal")?(console.info("[TravelTime] OpenRouteService timeout, using distance estimation"),o="timeout-fallback"):(console.info("[TravelTime] OpenRouteService error, using distance estimation:",i.message),o="error-fallback");const c=$t(a,e,t,r);return{duration:Math.round(c/.8),distance:Math.round(c),source:o}}}async function Ps(a,e,t,r){try{const s=await ea(a,e,t,r,"driving-car");return{duration:Math.round(s.duration*.75),distance:s.distance,source:s.source==="routing"?"emergency-routing":"emergency-estimated"}}catch(s){const i=$t(a,e,t,r);return{duration:Math.round(i/1.2),distance:Math.round(i),source:"emergency-estimated"}}}function ta(a,e){const t=Number(a),r=Dt[e];return t>=r.high?"🔴 HIGH RISK":t>=r.medium?"🟡 MEDIUM RISK":"🟢 LOW RISK"}function Ft(){const{formData:a}=g.getState()||{};if(!a||Object.keys(a).length===0)return"";let e=Object.entries(a).map(([t,r])=>{if(!r||Object.keys(r).length===0)return"";const s=l(`${t}ModuleTitle`)||t.charAt(0).toUpperCase()+t.slice(1),i=Object.entries(r).filter(([o,c])=>c!==""&&c!==null&&c!==void 0).map(([o,c])=>{const n=Qr(o),u=Jr(c,o);return`
            <div class="summary-item flex justify-between items-center py-1.5 border-b border-gray-200 dark:border-gray-700">
              <span class="summary-label text-gray-600 dark:text-gray-300 font-medium">${n}</span>
              <span class="summary-value text-gray-900 dark:text-gray-100 font-semibold">${u}</span>
            </div>
          `}).join("");return i?`
        <div class="summary-module bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4 transition-all duration-200 hover:shadow-md">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <span class="text-blue-600 dark:text-blue-400">🩺</span> ${s}
          </h4>
          <div class="summary-items divide-y divide-gray-200 dark:divide-gray-700">
            ${i}
          </div>
        </div>
      `:""}).join("");return e?`
    <div class="">
      <div class="summary-content space-y-5">
        ${e}
      </div>
    </div>
  `:""}function Ye(a,e,t){if(!e)return console.log(`[RiskCard] No data for ${a}`),"";const r=Math.round((e.probability||0)*100);console.log(`[RiskCard] ${a} - probability: ${e.probability}, percent: ${r}%`);const s=ta(r,a),i=r>70,o=r>Dt[a].high,c={ich:"🩸",lvo:"🧠"},n={ich:l("ichProbability"),lvo:l("lvoProbability")},u=i?"critical":o?"high":"normal";return`
   <div class="enhanced-risk-card ${a} ${u} bg-white dark:bg-gray-800 shadow-md rounded-2xl p-5 transition-all duration-300 hover:shadow-lg">
      <!-- Header -->
      <div class="risk-header flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
          <div class="risk-icon text-3xl">${c[a]}</div>
          <div class="risk-title">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">${n[a]}</h3>
          </div>
      </div>
      <!-- Probability Section -->
      <div class="risk-probability flex flex-col items-center">
          <div class="circles-container flex flex-col items-center">
            <div class="rings-row flex justify-center">
                <div class="circle-item flex flex-col items-center">
                  <!-- React ring mount -->
                  <div
                      class="probability-circle w-28 h-28 relative flex items-center justify-center"
                      data-react-ring
                      data-percent="${r}"
                      data-level="${u}"
                      >
                      <svg viewBox="0 0 120 120" class="probability-svg w-full h-full absolute top-0 left-0">
                        <circle
                            cx="60" cy="60" r="50"
                            fill="none"
                            stroke="rgba(255,255,255,0.2)"
                            stroke-width="8"
                            />
                        <circle
                        cx="60" cy="60" r="50"
                        fill="none"
                        stroke="${u==="critical"?"#ff4444":u==="high"?"#ff8800":"#0066cc"}"
                        stroke-width="8"
                        stroke-dasharray="${Math.PI*100}"
                        stroke-dashoffset="${Math.PI*100*(1-r/100)}"
                        stroke-linecap="round"
                        transform="rotate(-90 60 60)"
                        />
                        <text
                            x="60" y="60"
                            text-anchor="middle"
                            dominant-baseline="middle"
                            class="probability-text fill-white font-bold text-xl"
                            >
                            ${r}%
                        </text>
                      </svg>
                  </div>
                  <!-- Label -->
                  <div class="circle-label text-sm font-medium text-gray-700 dark:text-gray-300 mt-3">
                      ${a==="ich"?"ICH Risk":"LVO Risk"}
                  </div>
                </div>
            </div>
            <!-- Risk Level -->
            <div class="risk-level ${u} text-center mt-4 px-3 py-1 rounded-full text-sm font-semibold
            ${u==="critical"?"bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300":u==="high"?"bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300":"bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"}">
            ${s}
          </div>
      </div>
    </div>
</div>
  `}function ra(a){const e=a.gfap_value||Qe();if(!e||e<=0)return"";const t=Mt(e);return`
    <div class="volume-display-container">
      ${hr(t)}
    </div>
  `}function Qe(){var t;const a=g.getState(),{formData:e}=a;for(const r of["coma","limited","full"])if((t=e[r])!=null&&t.gfap_value)return parseFloat(e[r].gfap_value);return 0}function aa(a,e){var t;try{if(!a)return console.error("renderResults: No results data provided"),`
        <div class="container">
          <div class="error-message">
            <h2>No Results Available</h2>
            <p>Please complete an assessment first.</p>
            <button class="primary" onclick="window.location.reload()">Start Over</button>
          </div>
        </div>
      `;const{ich:r,lvo:s}=a,i=ca(r),o=i!=="coma"?oa(a):null;o&&xe(i)&&dr(r,o,Oe());const c=(r==null?void 0:r.module)==="Limited"||(r==null?void 0:r.module)==="Coma"||(s==null?void 0:s.notPossible)===!0,n=(r==null?void 0:r.module)==="Full Stroke"||((t=r==null?void 0:r.module)==null?void 0:t.includes("Full"));let u;return console.log("[Results] ICH data:",r),console.log("[Results] LVO data:",s),console.log("[Results] ICH module:",r==null?void 0:r.module),console.log("[Results] isLimitedOrComa:",c),console.log("[Results] isFullModule:",n),c?u=sa(r,a,e,o,i):u=ia(r,s,a,e,o,i),setTimeout(async()=>{console.log("[Results] Initializing volume animations..."),gr();try{const{mountIslands:d}=await q(async()=>{const{mountIslands:m}=await Promise.resolve().then(()=>Fa);return{mountIslands:m}},void 0);d()}catch(d){}},100),u}catch(r){return console.error("Error in renderResults:",r),`
      <div class="container">
        <div class="error-message">
          <h2>Error Displaying Results</h2>
          <p>There was an error displaying the results. Error: ${r.message}</p>
          <button class="primary" onclick="window.location.reload()">Start Over</button>
        </div>
      </div>
    `}}function sa(a,e,t,r,s){const i=a&&a.probability>.6?zt():"",o=Math.round(((a==null?void 0:a.probability)||0)*100),c=Pt(),n=Ft();xe(s)&&_t();const u=r&&xe(s)?Rt(a,r,Oe()):"",d=(a==null?void 0:a.module)==="Coma"?la(a.probability):"",m=(a==null?void 0:a.module)!=="Coma"?Vt(a.probability):"";return`
    <div class="container mx-auto px-4 py-8 max-w-5xl">
      <!-- Progress -->
      <div class="mb-8">
        ${se(3)}
      </div>

      <!-- Title -->
      <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        ${l("bleedingRiskAssessment")||"Blutungsrisiko-Bewertung / Bleeding Risk Assessment"}
      </h2>

      <!-- Critical Alert -->
      ${i?`<div class="mb-6">${i}</div>`:""}

      <!-- ICH Risk Card -->
      <div class="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 mb-6">
        ${Ye("ich",a)}
      </div>

      <!-- ICH Volume (Coma only) -->
      ${(a==null?void 0:a.module)==="Coma"&&o>=50?`
          <div class="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 mb-6">
            ${Ut(a)}
          </div>
        `:""}

      <!-- Alternative Diagnoses (Coma) -->
      ${d?`<div class="mb-6">${d}</div>`:""}

      <!-- Stroke Differential Diagnoses -->
      ${m?`<div class="mb-6">${m}</div>`:""}

      <!-- Research Comparison -->
      ${u?`<div class="mb-6">${u}</div>`:""}

      <!-- ICH Drivers (non-Coma) -->
      ${(a==null?void 0:a.module)!=="Coma"?`
          <div class="alternative-diagnosis-card bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 my-6 transition-all duration-300 hover:shadow-lg">
          <div class="diagnosis-header flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
            <span class="text-3xl">⚡</span>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100"> ${l("riskFactorsTitle")||"Hauptrisikofaktoren / Main Risk Factorss"}</h3>
          </div>
           ${Ht(a)}
        </div>`:""}

      <!-- Collapsible Sections -->
      <div class="space-y-4 mb-8">
        <!-- Input Summary -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <button 
            class="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition info-toggle"
            data-target="input-summary">
            <div class="flex items-center gap-2">
              <span class="text-xl">📋</span>
              <span class="font-medium text-gray-800 dark:text-gray-200">${l("inputSummaryTitle")}</span>
            </div>
            <span class="text-gray-600 dark:text-gray-300">▼</span>
          </button>
          <div id="input-summary" class="collapsible-content hidden bg-white dark:bg-gray-800 p-4">
            ${n}
          </div>
        </div>

        <!-- Stroke Centers -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <button 
            class="info-toggle w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            data-target="stroke-centers">
            <div class="flex items-center gap-2">
              <span class="text-xl">🏥</span>
              <span class="font-medium text-gray-800 dark:text-gray-200">${l("nearestCentersTitle")}</span>
            </div>
            <span class="text-gray-600 dark:text-gray-300">▼</span>
          </button>
          <div id="stroke-centers" class="collapsible-content hidden bg-white dark:bg-gray-800 p-4 my-3">
            ${c}
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col md:flex-row md:justify-between gap-4 mb-8">
        <div class="flex flex-wrap gap-4">
          <button id="printResults" class="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md transition">
            📄 ${l("printResults")}
          </button>
          <button data-action="reset" class="px-5 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold shadow-md transition">
            ${l("newAssessment")}
          </button>
        </div>
        <div class="flex flex-wrap gap-4">
          <button data-action="goBack" class="px-5 py-3 text-blue-600 hover:text-blue-700 font-medium transition">
            ← ${l("goBack")}
          </button>
          <button data-action="goHome" class="px-5 py-3 text-blue-600 hover:text-blue-700 font-medium transition">
            🏠 ${l("goHome")}
          </button>
        </div>
      </div>

      <!-- Disclaimer -->
      <div class="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-4 rounded-xl text-sm text-yellow-800 dark:text-yellow-100 mb-6">
        <strong>⚠️ ${l("importantNote")}:</strong> ${l("importantText")} 
        <span class="block mt-1 text-xs opacity-80">Results generated at ${new Date().toLocaleTimeString()}.</span>
      </div>

      <!-- Bibliography -->
      <div class="mt-6">${Bt(a)}</div>

      <!-- Research Toggle -->
      
    </div>
  `}function ia(a,e,t,r,s,i){var W,ee;const o=Math.round(((a==null?void 0:a.probability)||0)*100),c=Math.round(((e==null?void 0:e.probability)||0)*100);console.log("[FullModuleResults] ICH probability:",a==null?void 0:a.probability,"-> %:",o),console.log("[FullModuleResults] LVO probability:",e==null?void 0:e.probability,"-> %:",c);const n=a&&a.probability>.6?zt():"",u=Pt(),d=Ft();xe(i)&&_t();const m=s&&xe(i)?Rt(a,s,Oe()):"",x=g.getState(),C=parseInt((ee=(W=x.formData)==null?void 0:W.full)==null?void 0:ee.fast_ed_score)||0,Y=i==="full"||(a==null?void 0:a.module)==="Full",ie=e&&typeof e.probability=="number"&&!e.notPossible,H=Y&&C>3&&ie,Q=o>=50,ne=c/Math.max(o,.5),oe=ne>=.6&&ne<=1.7,we=Y&&o>=50&&c>=50&&!oe,pe=Y&&o>=30&&c>=30;let X=1;H&&X++,Q&&X++;const Se=X===1?"risk-results-single":X===2?"risk-results-dual":"risk-results-triple",Ee=Vt(a.probability);return`
     <div class="container mx-auto px-4 py-8 max-w-5xl">
      <!-- Progress -->
      <div class="mb-8">
        ${se(3)}
      </div>
      <h2 class="text-2xl font-extrabold text-gray-900 dark:text-white mb-4 text-center">
        ${l("resultsTitle")}
      </h2>
      ${n}
      
      <!-- Risk Assessment Display -->
      <div class="${Se} gap-1 flex flex-col flex-wrap justify-center items-stretch mb-6">
        ${Ye("ich",a)}
        ${H?Ye("lvo",e):""}
        ${Q?Ut(a):""}
      </div>
      
      <!-- Treatment Decision Gauge (when strong signal) -->
      ${pe?da(o,c):""}
      ${!pe&&we?na(o,c,ne):""}
      
      <!-- Differential Diagnoses for Stroke Modules -->
      ${Ee}
      
      <!-- Research Model Comparison (hidden unless research mode) -->
      ${m}
      
      <!-- Risk Factor Drivers -->
      <div class="alternative-diagnosis-card bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 my-6 transition-all duration-300 hover:shadow-lg">
        <div class="diagnosis-header flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
          <span class="text-3xl">⚡</span>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100"> ${l("riskFactorsTitle")||"Risikofaktoren / Risk Factors"}</h3>
        </div>
      ${H?Zr(a,e):Ht(a)}
      </div>
      
      <!-- Collapsible Additional Information -->
      <div class="space-y-4 mb-8">
        <!-- Input Summary -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <button 
            class="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition info-toggle"
            data-target="input-summary">
            <div class="flex items-center gap-2">
              <span class="text-xl">📋</span>
              <span class="font-medium text-gray-800 dark:text-gray-200">${l("inputSummaryTitle")}</span>
            </div>
            <span class="text-gray-600 dark:text-gray-300">▼</span>
          </button>
          <div id="input-summary" class="collapsible-content hidden bg-white dark:bg-gray-800 p-4">
            ${d}
          </div>
        </div>

        <!-- Stroke Centers -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <button 
            class="info-toggle w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            data-target="stroke-centers">
            <div class="flex items-center gap-2">
              <span class="text-xl">🏥</span>
              <span class="font-medium text-gray-800 dark:text-gray-200">${l("nearestCentersTitle")}</span>
            </div>
            <span class="text-gray-600 dark:text-gray-300">▼</span>
          </button>
          <div id="stroke-centers" class="collapsible-content hidden bg-white dark:bg-gray-800 p-4">
            ${u}
          </div>
        </div>
      </div>
      
       <!-- Actions -->
      <div class="flex flex-col md:flex-row md:justify-between gap-4 mb-8">
        <div class="flex flex-wrap gap-4">
          <button id="printResults" class="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md transition">
            📄 ${l("printResults")}
          </button>
          <button data-action="reset" class="px-5 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold shadow-md transition">
            ${l("newAssessment")}
          </button>
        </div>
        <div class="flex flex-wrap gap-4">
          <button data-action="goBack" class="px-5 py-3 text-blue-600 hover:text-blue-700 font-medium transition">
            ← ${l("goBack")}
          </button>
          <button data-action="goHome" class="px-5 py-3 text-blue-600 hover:text-blue-700 font-medium transition">
            🏠 ${l("goHome")}
          </button>
        </div>
      </div>

      <!-- Disclaimer -->
      <div class="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-4 rounded-xl text-sm text-yellow-800 dark:text-yellow-100 mb-6">
        <strong>⚠️ ${l("importantNote")}:</strong> ${l("importantText")} 
        <span class="block mt-1 text-xs opacity-80">Results generated at ${new Date().toLocaleTimeString()}.</span>
      </div>

      <!-- Bibliography -->
      <div class="mt-6">${Bt(a)}</div>

      <!-- Research Toggle -->
      
    </div>
  `}function na(a,e,t){const r=t>1?"LVO":"ICH",s=r==="LVO"?"🧠":"🩸",i=K.getCurrentLanguage()==="de"?r==="LVO"?"LVO-dominant":"ICH-dominant":r==="LVO"?"LVO dominant":"ICH dominant",o=K.getCurrentLanguage()==="de"?`Verhältnis LVO/ICH: ${t.toFixed(2)}`:`LVO/ICH ratio: ${t.toFixed(2)}`;return`
    <div class="tachometer-section w-full my-6">
      <div class="tachometer-card">
        <div class="treatment-recommendation ${r==="LVO"?"lvo-dominant":"ich-dominant"}">
          <div class="recommendation-icon">${s}</div>
          <div class="recommendation-text">
            <h4>${i}</h4>
            <p>${o}</p>
          </div>
          <div class="probability-summary">
            ICH: ${a}% | LVO: ${e}%
          </div>
        </div>
      </div>
    </div>
  `}function Ht(a){if(!a||!a.drivers)return`
      <div class="no-drivers text-center py-6 text-gray-500 dark:text-gray-400 italic">
        No driver data available
      </div>
    `;const{positive:e=[],negative:t=[]}=a.drivers||{};return!Array.isArray(e)&&!Array.isArray(t)?`
      <div class="no-drivers text-center py-6 text-red-500 dark:text-red-400 font-medium">
        Driver format error
      </div>
    `:`
    <div class="drivers-split-view grid grid-cols-1 md:grid-cols-2 gap-5 my-5">
      
      <!-- Positive Drivers -->
      <div class="drivers-column positive-column rounded-2xl bg-gradient-to-br from-green-50 to-white dark:from-green-950/40 dark:to-gray-900 border border-green-200 dark:border-green-800 shadow-sm hover:shadow-md transition-all duration-300">
        <div class="column-header flex items-center gap-2 px-5 py-3 border-b border-green-100 dark:border-green-800">
          <span class="column-icon text-green-600 dark:text-green-400 text-xl">⬆</span>
          <span class="column-title font-semibold text-green-800 dark:text-green-200 tracking-wide uppercase text-sm">
            ${l("increasingRisk")||"Increasing Risk"}
          </span>
        </div>
        <div class="compact-drivers p-4 space-y-2">
          ${e.length>0?e.slice(0,5).map(r=>xt(r,"positive")).join(""):`<p class="no-factors text-gray-500 dark:text-gray-400 italic text-sm"> 
                  ${l("noFactors")||"No factors"} 
                 </p>`}
        </div>
      </div>

      <!-- Negative Drivers -->
      <div class="drivers-column negative-column rounded-2xl bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/40 dark:to-gray-900 border border-blue-200 dark:border-blue-800 shadow-sm hover:shadow-md transition-all duration-300">
        <div class="column-header flex items-center gap-2 px-5 py-3 border-b border-blue-100 dark:border-blue-800">
          <span class="column-icon text-blue-600 dark:text-blue-400 text-xl">⬇</span>
          <span class="column-title font-semibold text-blue-800 dark:text-blue-200 tracking-wide uppercase text-sm">
            ${l("decreasingRisk")||"Decreasing Risk"}
          </span>
        </div>
        <div class="compact-drivers p-4 space-y-2">
          ${t.length>0?t.slice(0,5).map(r=>xt(r,"negative")).join(""):`<p class="no-factors text-gray-500 dark:text-gray-400 italic text-sm">
                  ${l("noFactors")||"No factors"}
                 </p>`}
        </div>
      </div>
    </div>
  `}function xt(a,e){const t=Math.abs(a.weight*100).toFixed(1),r=e==="positive",s=r?"text-green-700 dark:text-green-300":"text-blue-700 dark:text-blue-300";return`
    <div class="compact-driver-item flex justify-between items-center ${r?"bg-green-50 dark:bg-green-950/40":"bg-blue-50 dark:bg-blue-950/40"} border ${r?"border-green-300 dark:border-green-600":"border-blue-300 dark:border-blue-600"} rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition-all duration-300">
      <div class="compact-driver-label text-sm font-medium ${s}">
        ${De(a.label)}
      </div>
      <div class="compact-driver-value text-sm font-semibold ${s}">
        ${t}%
      </div>
    </div>
  `}function Bt(a){if(!a||!a.probability||Math.round((a.probability||0)*100)<50)return"";const t=Qe();return!t||t<=0?"":`
    <div class="my-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 p-5 shadow-sm">
      <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
        📚 ${l("references")}
      </h4>
      
      <div class="space-y-3">
        <div class="flex items-start gap-2">
          <span class="text-sm font-semibold text-blue-600 dark:text-blue-400">¹</span>
          <p class="text-sm text-gray-700 dark:text-gray-300 leading-snug">
            Broderick et al. (1993). <em>Volume of intracerebral hemorrhage: A powerful and easy-to-use predictor of 30-day mortality.</em> Stroke, 24(7), 987–993.
          </p>
        </div>

        <div class="flex items-start gap-2">
          <span class="text-sm font-semibold text-blue-600 dark:text-blue-400">²</span>
          <p class="text-sm text-gray-700 dark:text-gray-300 leading-snug">
            Krishnan et al. (2013). <em>Hematoma expansion in intracerebral hemorrhage: Predictors and outcomes.</em> Neurology, 81(19), 1660–1666.
          </p>
        </div>

        <div class="flex items-start gap-2">
          <span class="text-sm font-semibold text-blue-600 dark:text-blue-400">³</span>
          <p class="text-sm text-gray-700 dark:text-gray-300 leading-snug">
            Putra et al. (2020). <em>Functional outcomes and mortality in patients with intracerebral hemorrhage.</em> Critical Care Medicine, 48(3), 347–354.
          </p>
        </div>

        <div class="flex items-start gap-2">
          <span class="text-sm font-semibold text-blue-600 dark:text-blue-400">⁴</span>
          <p class="text-sm text-gray-700 dark:text-gray-300 leading-snug">
            Tangella et al. (2020). <em>Early prediction of mortality in intracerebral hemorrhage using clinical markers.</em> Journal of Neurocritical Care, 13(2), 89–97.
          </p>
        </div>
      </div>
    </div>
  `}function oa(a){try{const e=Oe();return!e.age||!e.gfap?null:ur(e)}catch(e){return null}}function Oe(){const a=g.getState(),{formData:e}=a;let t=null,r=null;for(const i of["coma","limited","full"])e[i]&&(t=t||e[i].age_years,r=r||e[i].gfap_value);return{age:parseInt(t)||null,gfap:parseFloat(r)||null}}function Vt(a){return Math.round(a*100)<=25?"":`
    <div class="alternative-diagnosis-card bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 my-6 transition-all duration-300 hover:shadow-lg">
      <!-- Header -->
      <div class="diagnosis-header flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
        <span class="lightning-icon text-2xl text-yellow-500">⚡</span>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
          ${l("differentialDiagnoses")}
        </h3>
      </div>

      <!-- Content -->
      <div class="diagnosis-content space-y-4">
        <!-- Clinical Action Heading -->
        <h4 class="clinical-action-heading text-base font-medium text-blue-600 dark:text-blue-400">
          ${l("reconfirmTimeWindow")}
        </h4>

        <!-- Diagnosis List -->
        <ul class="diagnosis-list list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-2">
          <li>${l("unclearTimeWindow")}</li>
          <li>${l("rareDiagnoses")}</li>
        </ul>
      </div>
    </div>
  `}function la(a){const e=Math.round(a*100),t=K.getCurrentLanguage()==="de",r=e>25,s=t?"Differentialdiagnosen":"Differential Diagnoses",c=(r?[t?"Alternative Diagnosen sind SAB, SDH, EDH (Subarachnoidalblutung, Subduralhämatom, Epiduralhämatom)":"Alternative diagnoses include SAH, SDH, EDH (Subarachnoid Hemorrhage, Subdural Hematoma, Epidural Hematoma)",t?"Bei unklarem Zeitfenster seit Symptombeginn oder im erweiterten Zeitfenster kommen auch ein demarkierter Infarkt oder hypoxischer Hirnschaden in Frage":"In cases of unclear time window since symptom onset or extended time window, demarcated infarction or hypoxic brain injury should also be considered"]:[t?"Alternative Diagnose von Vigilanzminderung wahrscheinlich":"Alternative diagnosis for reduced consciousness likely",t?"Ein Verschluss der Arteria Basilaris ist nicht ausgeschlossen":"Basilar artery occlusion cannot be excluded"]).map(n=>`<li class="mb-2 text-gray-700 dark:text-gray-300 leading-relaxed">${n}</li>`).join("");return`
    <div class="alternative-diagnosis-card bg-white dark:bg-gray-800 shadow-md rounded-2xl p-5 transition-all duration-300 hover:shadow-lg">
      <!-- Header -->
      <div class="diagnosis-header flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
        <span class="text-3xl">⚡</span>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">${s}</h3>
      </div>

      <!-- Content -->
      <div class="diagnosis-content">
        <ul class="diagnosis-list list-disc pl-5">
          ${c}
        </ul>
      </div>
    </div>
  `}function ca(a){if(!(a!=null&&a.module))return"unknown";const e=a.module.toLowerCase();return e.includes("coma")?"coma":e.includes("limited")?"limited":e.includes("full")?"full":"unknown"}function Ut(a){const e=Qe();if(!e||e<=0)return"";const t=Mt(e),r=lr(t),s=Math.round(((a==null?void 0:a.probability)||0)*100);return`
    <div class="enhanced-risk-card volume-card bg-white dark:bg-gray-800 shadow-md rounded-2xl p-5 transition-all duration-300 hover:shadow-lg my-2">
      <!-- Header -->
      <div class="risk-header flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
        <div class="risk-icon text-3xl">🧮</div>
        <div class="risk-title">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">${l("ichVolumeLabel")}</h3>
        </div>
      </div>

      <!-- Body -->
      <div class="risk-body flex flex-col items-center">
        <!-- Volume Display -->
        <div class="circles-container flex flex-col items-center">
          <div class="rings-row flex justify-center">
            <div class="circle-item flex flex-col items-center">
              ${ra(a)}
              <div class="circle-label text-sm font-medium text-gray-700 dark:text-gray-300 mt-3">${l("ichVolumeLabel")}</div>
            </div>
          </div>
        </div>

        <!-- Risk Details -->
        <div class="risk-details mt-6 w-full grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800 dark:text-gray-200">
          <div class="mortality-assessment bg-gray-100 dark:bg-gray-700/40 rounded-lg px-4 py-3 flex flex-col items-center">
            <span class="label font-medium text-gray-600 dark:text-gray-400">${l("predictedMortality")}</span>
            <span class="value text-lg font-semibold text-red-600 dark:text-red-400">${r}</span>
          </div>
          <div class="probability bg-gray-100 dark:bg-gray-700/40 rounded-lg px-4 py-3 flex flex-col items-center">
            <span class="label font-medium text-gray-600 dark:text-gray-400">${l("probability")}</span>
            <span class="value text-lg font-semibold text-blue-600 dark:text-blue-400">${s}%</span>
          </div>
        </div>
      </div>
    </div>
  `}function da(a,e){const t=e/Math.max(a,1),r=K.getCurrentLanguage(),s=r==="de"?"Entscheidungshilfe – LVO/ICH":"Decision Support – LVO/ICH",i=r==="de"?"Unsicher":"Uncertain",o=Math.abs(e-a),c=Math.max(e,a);let n=o<10?Math.round(30+c*.3):o<20?Math.round(50+c*.4):Math.round(70+c*.3);return n=Math.max(0,Math.min(100,n)),`
    <div class="tachometer-section flex mt-6 w-full">
      <div class="tachometer-card w-full p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 backdrop-blur-md shadow-md transition-all duration-300 hover:shadow-xl">
        
        <!-- Header -->
        <div class="tachometer-header flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            🎯 ${s}
          </h3>
          <div class="ratio-display text-sm text-gray-600 dark:text-gray-400">
            LVO/ICH Ratio: <span class="font-semibold text-blue-600 dark:text-blue-400">${t.toFixed(2)}</span>
          </div>
        </div>

        <!-- Gauge Canvas -->
        <div class="tachometer-gauge flex justify-center mb-6">
          <div data-react-tachometer 
               data-ich="${a}" 
               data-lvo="${e}" 
               data-title="${s}" 
              ></div>
        </div>

        <!-- Legend -->
        <div class="tachometer-legend flex justify-center gap-4 mb-6 text-sm font-medium">
          <span class="legend-chip px-3 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">ICH</span>
          <span class="legend-chip px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">${i}</span>
          <span class="legend-chip px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">LVO</span>
        </div>

        <!-- Metrics -->
        <div class="metrics-row grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div class="metric-card p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
            <div class="metric-label text-gray-500 dark:text-gray-400 text-sm uppercase">Ratio</div>
            <div class="metric-value text-2xl font-bold text-blue-600 dark:text-blue-400">${t.toFixed(2)}</div>
            <div class="metric-unit text-xs text-gray-500 dark:text-gray-400">LVO / ICH</div>
          </div>

          <div class="metric-card p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 border border-green-200 dark:border-green-800">
            <div class="metric-label text-gray-500 dark:text-gray-400 text-sm uppercase">Confidence</div>
            <div class="metric-value text-2xl font-bold text-green-600 dark:text-green-400">${n}%</div>
            <div class="metric-unit text-xs text-gray-500 dark:text-gray-400">percent</div>
          </div>

          <div class="metric-card p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/10 border border-red-200 dark:border-red-800">
            <div class="metric-label text-gray-500 dark:text-gray-400 text-sm uppercase">Difference</div>
            <div class="metric-value text-2xl font-bold text-red-600 dark:text-red-400">${Math.abs(e-a).toFixed(0)}%</div>
            <div class="metric-unit text-xs text-gray-500 dark:text-gray-400">|LVO − ICH|</div>
          </div>
        </div>

        <!-- Probability Summary -->
        <div class="probability-summary text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          <span class="font-semibold text-red-600 dark:text-red-400">ICH:</span> ${a}% 
          <span class="mx-2 text-gray-400">|</span> 
          <span class="font-semibold text-blue-600 dark:text-blue-400">LVO:</span> ${e}%
        </div>
      </div>
    </div>
  `}function ua(){return`
   <div class="">
  <div class="bg-white dark:bg-gray-800 shadow-lg rounded-2xl w-full max-w-xl p-8">
    <!-- Header -->
    <div class="text-center mb-6">
      <div class="flex justify-center items-center space-x-2">
        <div class="text-3xl">🧠</div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">iGFAP Stroke Triage</h1>
      </div>
      <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">Research Preview v2.1</div>
    </div>
    <!-- Research Access Notice -->
    <div class="mb-6 p-4 bg-yellow-50 dark:bg-gray-700 border-l-4 border-yellow-400 rounded">
      <h2 class="font-semibold text-lg mb-1 text-gray-900 dark:text-yellow-300">🔬 ${l("researchAccessRequired")}
      <p class="text-gray-700 dark:text-gray-200 text-sm mb-2">
        ${l("researchrPreviewValidation")}
      </p>
      <div class="bg-yellow-100 dark:bg-gray-800 p-2 rounded border border-yellow-200 dark:border-yellow-600 text-sm text-gray-800 dark:text-gray-100">
        <h3 class="font-semibold mb-1 text-yellow-600 dark:text-yellow-400">⚠️ ${l("importantNotice")}</h3>
        <ul class="list-disc ml-5 space-y-1">
          <li><span class="font-semibold">${l("researchUseOnly")}</span> - ${l("noClinicalDecision")}</li>
          <li><span class="font-semibold">${l("noDataStorage")}</span> - ${l("dataProcessedLocally")}</li>
          <li><span class="font-semibold">${l("clinicalAdvisory")}</span> - ${l("supervision")}</li>
          <li><span class="font-semibold">${l("contact")}:</span> Deepak Bos (bosdeepak@gmail.com)</li>
        </ul>
      </div>
    </div>
    <!-- Login Form -->
    <form id="loginForm" class="space-y-4">
      <div>
        <label for="researchPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">${l("accessCode")}</label>
        <input
          type="password"
          id="researchPassword"
          name="password"
          required
          autocomplete="off"
          placeholder="${l("accessCodePlaceholder")}"
          class="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-700"
        >
      </div>
      <div id="loginError" class="text-red-600 dark:text-red-400 text-sm hidden"></div>
      <button type="submit" class="w-full bg-blue-600 dark:bg-blue-800 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center disabled:opacity-50 login-button">
        <span class="button-text">${l("accessResearchBtn")}</span>
        <span class="loading-spinner ml-2 hidden">⏳</span>
      </button>
    </form>
    <!-- Footer -->
    <div class="mt-6 text-gray-500 dark:text-gray-400 text-xs space-y-1">
      <p><strong class="text-gray-700 dark:text-gray-200">${l("regulatoryStatus")}:</strong> ${l("protoTypeOnly")}</p>
      <p><strong class="text-gray-700 dark:text-gray-200">${l("dataProtection")}:</strong> ${l("gdprComplaint")}</p>
      <p><strong class="text-gray-700 dark:text-gray-200">${l("clinicalOversight")}:</strong> RKH Klinikum Ludwigsburg, Neurologie</p>
    </div>
  </div>
</div>
  `}function ma(){const a=document.getElementById("loginForm");if(!a)return;const e=document.getElementById("researchPassword"),t=document.getElementById("loginError"),r=a.querySelector(".login-button");e.focus(),a.addEventListener("submit",async c=>{c.preventDefault();const n=e.value.trim();if(!n){s("Please enter the research access code");return}o(!0),i();try{const u=await P.authenticate(n);console.log(u),u.success?(g.logEvent("auth_success",{timestamp:new Date().toISOString(),userAgent:navigator.userAgent.substring(0,100)}),g.navigate("triage1")):(s(u.message),e.value="",e.focus(),g.logEvent("auth_failed",{timestamp:new Date().toISOString(),errorCode:u.errorCode}))}catch(u){s("Authentication system error. Please try again.")}finally{o(!1)}}),e.addEventListener("input",i);function s(c){t.textContent=c,t.classList.remove("hidden"),e.classList.add("border-red-500")}function i(){t.classList.add("hidden"),e.classList.remove("border-red-500")}function o(c){const n=r.querySelector(".button-text"),u=r.querySelector(".loading-spinner");c?(n.classList.add("hidden"),u.classList.remove("hidden"),r.disabled=!0):(n.classList.remove("hidden"),u.classList.add("hidden"),r.disabled=!1)}}function ga(a){const e=document.createElement("div");e.className="sr-only",e.setAttribute("role","status"),e.setAttribute("aria-live","polite");const t={triage1:"Coma assessment",triage2:"Examination capability assessment",coma:"Coma module",limited:"Limited data module",full:"Full stroke assessment",results:"Assessment results"};e.textContent=`Navigated to ${t[a]||a}`,document.body.appendChild(e),setTimeout(()=>e.remove(),1e3)}function ha(a){const e="iGFAP",r={triage1:"Initial Assessment",triage2:"Examination Capability",coma:"Coma Module",limited:"Limited Data Module",full:"Full Stroke Module",results:"Assessment Results"}[a];document.title=r?`${e} — ${r}`:e}function pa(){setTimeout(()=>{const a=document.querySelector("h2");a&&(a.setAttribute("tabindex","-1"),a.focus(),setTimeout(()=>a.removeAttribute("tabindex"),100))},100)}class fa{constructor(){this.scores={facial_palsy:0,arm_weakness:0,speech_changes:0,eye_deviation:0,denial_neglect:0},this.onApply=null,this.modal=null}getTotal(){return Object.values(this.scores).reduce((e,t)=>e+t,0)}getRiskLevel(){return this.getTotal()>=4?"high":"low"}render(){const e=this.getTotal(),t=this.getRiskLevel();return`
      <div id="fastEdModal" class="fixed inset-0 z-50 hidden items-center justify-center bg-black/40 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden transition-all duration-300">
          
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white">${l("fastEdCalculatorTitle")}</h2>
            <button class="modal-close text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl leading-none">&times;</button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            
            ${this.renderSection("facial_palsy",l("facialPalsyTitle"),[{label:l("facialPalsyNormal"),value:0},{label:l("facialPalsyMild"),value:1}])}

            ${this.renderSection("arm_weakness",l("armWeaknessTitle"),[{label:l("armWeaknessNormal"),value:0},{label:l("armWeaknessMild"),value:1},{label:l("armWeaknessSevere"),value:2}])}

            ${this.renderSection("speech_changes",l("speechChangesTitle"),[{label:l("speechChangesNormal"),value:0},{label:l("speechChangesMild"),value:1},{label:l("speechChangesSevere"),value:2}])}

            ${this.renderSection("eye_deviation",l("eyeDeviationTitle"),[{label:l("eyeDeviationNormal"),value:0},{label:l("eyeDeviationPartial"),value:1},{label:l("eyeDeviationForced"),value:2}])}

            ${this.renderSection("denial_neglect",l("denialNeglectTitle"),[{label:l("denialNeglectNormal"),value:0},{label:l("denialNeglectPartial"),value:1},{label:l("denialNeglectComplete"),value:2}])}

            <!-- Total -->
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 flex flex-col items-center text-center">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white">${l("totalScoreTitle")}: 
                <span class="text-blue-600 dark:text-blue-400 font-bold text-xl total-score">${e}/9</span>
              </h3>
              <div class="risk-indicator mt-2 px-4 py-2 rounded-full font-medium 
                ${t==="high"?"bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300":"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"}">
                ${l("riskLevel")}: ${l(t==="high"?"riskLevelHigh":"riskLevelLow")}
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <button class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold" data-action="cancel-fast-ed">${l("cancel")}</button>
            <button class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold" data-action="apply-fast-ed">${l("applyScore")}</button>
          </div>
        </div>
      </div>
    `}renderSection(e,t,r){return`
      <div class="space-y-2">
        <h3 class="font-semibold text-gray-800 dark:text-gray-100">${t}</h3>
        <div class="flex flex-wrap gap-3">
          ${r.map(s=>`
            <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              <input type="radio" name="${e}" value="${s.value}" 
                class="accent-blue-600 dark:accent-blue-500"
                ${this.scores[e]===s.value?"checked":""}>
              <span>${s.label}</span>
            </label>`).join("")}
        </div>
      </div>
    `}setupEventListeners(){var e,t,r;this.modal=document.getElementById("fastEdModal"),this.modal&&(this.modal.addEventListener("change",s=>{s.target.type==="radio"&&(this.scores[s.target.name]=parseInt(s.target.value),this.updateDisplay())}),(e=this.modal.querySelector(".modal-close"))==null||e.addEventListener("click",()=>this.close()),(t=this.modal.querySelector('[data-action="cancel-fast-ed"]'))==null||t.addEventListener("click",()=>this.close()),(r=this.modal.querySelector('[data-action="apply-fast-ed"]'))==null||r.addEventListener("click",()=>this.apply()),this.modal.addEventListener("click",s=>{s.target===this.modal&&s.stopPropagation()}),document.addEventListener("keydown",s=>{var i;s.key==="Escape"&&((i=this.modal)!=null&&i.classList.contains("flex"))&&this.close()}))}updateDisplay(){var i,o;const e=(i=this.modal)==null?void 0:i.querySelector(".total-score"),t=(o=this.modal)==null?void 0:o.querySelector(".risk-indicator");if(!e||!t)return;const r=this.getTotal(),s=this.getRiskLevel();e.textContent=`${r}/9`,t.className="risk-indicator mt-2 px-4 py-2 rounded-full font-medium "+(s==="high"?"bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300":"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"),t.textContent=`${l("riskLevel")}: ${l(s==="high"?"riskLevelHigh":"riskLevelLow")}`}show(e=0,t=null){this.onApply=t,e>0&&e<=9&&this.approximateFromTotal(e);const r=document.getElementById("fastEdModal");r&&r.remove(),document.body.insertAdjacentHTML("beforeend",this.render()),this.modal=document.getElementById("fastEdModal"),this.setupEventListeners(),this.modal.classList.remove("hidden"),this.modal.classList.add("flex")}close(){this.modal&&(this.modal.classList.remove("flex"),this.modal.classList.add("hidden"))}apply(){const e=this.getTotal(),t=this.scores.arm_weakness>0,r=this.scores.eye_deviation>0;this.onApply&&this.onApply({total:e,components:{...this.scores},armWeaknessBoolean:t,eyeDeviationBoolean:r}),this.close()}approximateFromTotal(e){this.scores={facial_palsy:0,arm_weakness:0,speech_changes:0,eye_deviation:0,denial_neglect:0};let t=e;for(const r of Object.keys(this.scores)){if(t<=0)break;const i=Math.min(t,r==="facial_palsy"?1:2);this.scores[r]=i,t-=i}}}const ya=new fa;function kt(){return`
    <div class="container mx-auto px-4 py-8 max-w-lg">
      <!-- Progress -->
      <div class="mb-6">
        ${se(1)}
      </div>

      <!-- Card -->
      <div class="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
        <!-- Title -->
        <h2 class="text-2xl font-extrabold text-gray-900 dark:text-white mb-4 text-center">
          ${l("triage1Title")}
        </h2>

        <!-- Question -->
        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl mb-6">
          <p class="text-lg text-gray-800 dark:text-gray-200 font-medium mb-2 text-center">
            ${l("triage1Question")}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
            ${l("triage1Help")}
          </p>
        </div>

        <!-- Buttons -->
        <div class="grid grid-cols-2 gap-4">
          <button 
            class="yes-btn w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl shadow-md transition transform hover:scale-105"
            data-action="triage1" 
            data-value="true"
          >
             ${l("triage1Yes")} ✅
          </button>
          
          <button 
            class="no-btn w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl shadow-md transition transform hover:scale-105"
            data-action="triage1" 
            data-value="false"
          >
             ${l("triage1No")} ❌
          </button>
        </div>
      </div>
    </div>
  `}function ba(){return`
    <div class="container mx-auto px-4 py-8 max-w-lg">
      <!-- Progress -->
      <div class="mb-6">
        ${se(2)}
      </div>

      <!-- Card -->
      <div class="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
        <!-- Title -->
        <h2 class="text-2xl font-extrabold text-gray-900 dark:text-white mb-4 text-center">
          ${l("triage2Title")}
        </h2>

        <!-- Question -->
        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl mb-6">
          <p class="text-lg text-gray-800 dark:text-gray-200 font-medium mb-2 text-center">
            ${l("triage2Question")}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
            ${l("triage2Help")}
          </p>
        </div>

        <!-- Buttons -->
        <div class="flex flex-col gap-4">
          <button 
            class="yes-btn w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-md transition transform hover:scale-105"
            data-action="triage2" 
            data-value="true"
          >
            ${l("triage2Yes")} ✅ 
          </button>
           <button 
            class="no-btn w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl shadow-md transition transform hover:scale-105"
            data-action="triage2" 
            data-value="false"
          >
            ${l("triage2No")} ❌ 
          </button>
        </div>
      </div>
    </div>
  `}function ue(a){const e=g.getState(),{currentScreen:t,results:r,startTime:s,screenHistory:i}=e;console.log("[Render] Rendering screen:",t,"Has results:",!!r);const o=document.createElement("div"),c=document.getElementById("backButton");c&&(c.style.display=i&&i.length>0?"flex":"none");let n="";switch(t){case"login":n=ua();break;case"triage1":if(!P.isValidSession()){g.navigate("login");return}n=kt();break;case"triage2":n=ba();break;case"coma":n=Ur();break;case"limited":n=Wr();break;case"full":n=Gr();break;case"results":n=aa(r,s);break;default:n=kt()}try{ve(o,n)}catch(d){o.textContent="Error loading content. Please refresh."}for(;a.firstChild;)a.removeChild(a.firstChild);for(;o.firstChild;)a.appendChild(o.firstChild);const u=a.querySelector("form[data-module]");if(u){const{module:d}=u.dataset;va(u,d)}xa(a),t==="login"&&setTimeout(()=>{ma()},100),t==="results"&&r&&setTimeout(()=>{try{console.log("[Render] Initializing stroke center map with results:",r),pr(r)}catch(d){console.error("[Render] Stroke center map initialization failed:",d)}},100),setTimeout(()=>{try{mr()}catch(d){}},150),ga(t),ha(t),pa()}function va(a,e){const t=g.getFormData(e);!t||Object.keys(t).length===0||Object.entries(t).forEach(([r,s])=>{const i=a.elements[r];i&&(i.type==="checkbox"?i.checked=s===!0||s==="on"||s==="true":i.value=s)})}function xa(a){a.querySelectorAll('input[type="number"]').forEach(s=>{s.addEventListener("input",()=>{const i=s.closest(".input-group");i&&i.classList.contains("error")&&(i.classList.remove("error"),i.querySelectorAll(".error-message").forEach(o=>o.remove()))})}),a.querySelectorAll("[data-action]").forEach(s=>{s.addEventListener("click",i=>{const{action:o,value:c}=i.currentTarget.dataset,n=c==="true";switch(o){case"triage1":Ir(n);break;case"triage2":Lr(n);break;case"reset":Mr();break;case"goBack":_r();break;case"goHome":Ot();break}})}),a.querySelectorAll("form[data-module]").forEach(s=>{s.addEventListener("submit",i=>{Rr(i,a)})});const e=a.querySelector("#printResults");e&&e.addEventListener("click",()=>window.print());const t=a.querySelector("#fast_ed_score");t&&(t.addEventListener("click",s=>{s.preventDefault();const i=parseInt(t.value)||0;ya.show(i,o=>{t.value=o.total;const c=a.querySelector("#armparese_hidden");c&&(c.value=o.armWeaknessBoolean?"true":"false");const n=a.querySelector("#eye_deviation_hidden");n&&(n.value=o.eyeDeviationBoolean?"true":"false"),t.dispatchEvent(new Event("change",{bubbles:!0}))})}),t.addEventListener("keydown",s=>{s.preventDefault()}));const r=a.querySelectorAll(".info-toggle");a.querySelectorAll(".collapsible-content").forEach(s=>{s.style.display="none"}),r.forEach(s=>{s.addEventListener("click",()=>{const i=s.dataset.target,o=a.querySelector(`#${i}`),c=s.querySelector(".toggle-arrow");if(!o)return;o.style.display==="block"?(o.style.display="none",o.classList.remove("show"),s.classList.remove("active"),c.style.transform="rotate(0deg)"):(o.style.display="block",o.classList.add("show"),s.classList.add("active"),c.style.transform="rotate(180deg)")})})}const ka={};class wa{constructor(){this.container=null,this.eventListeners=new Map,this.isInitialized=!1}initialize(e){this.container=e,this.setupGlobalEventListeners(),this.setupHelpModal(),this.setupFooterLinks(),this.initializeApiModeToggle(),this.initializeResearchMode(),this.setCurrentYear(),this.isInitialized=!0,this.initializeLanguage()}initializeLanguage(){const e=localStorage.getItem("language"),t=document.getElementById("languageToggle");t&&(t.innerHTML=e==="en"?'<svg width="20px" height="20px" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--twemoji" preserveAspectRatio="xMidYMid meet"><path fill="#00247D" d="M0 9.059V13h5.628zM4.664 31H13v-5.837zM23 25.164V31h8.335zM0 23v3.941L5.63 23zM31.337 5H23v5.837zM36 26.942V23h-5.631zM36 13V9.059L30.371 13zM13 5H4.664L13 10.837z"></path><path fill="#CF1B2B" d="M25.14 23l9.712 6.801a3.977 3.977 0 0 0 .99-1.749L28.627 23H25.14zM13 23h-2.141l-9.711 6.8c.521.53 1.189.909 1.938 1.085L13 23.943V23zm10-10h2.141l9.711-6.8a3.988 3.988 0 0 0-1.937-1.085L23 12.057V13zm-12.141 0L1.148 6.2a3.994 3.994 0 0 0-.991 1.749L7.372 13h3.487z"></path><path fill="#EEE" d="M36 21H21v10h2v-5.836L31.335 31H32a3.99 3.99 0 0 0 2.852-1.199L25.14 23h3.487l7.215 5.052c.093-.337.158-.686.158-1.052v-.058L30.369 23H36v-2zM0 21v2h5.63L0 26.941V27c0 1.091.439 2.078 1.148 2.8l9.711-6.8H13v.943l-9.914 6.941c.294.07.598.116.914.116h.664L13 25.163V31h2V21H0zM36 9a3.983 3.983 0 0 0-1.148-2.8L25.141 13H23v-.943l9.915-6.942A4.001 4.001 0 0 0 32 5h-.663L23 10.837V5h-2v10h15v-2h-5.629L36 9.059V9zM13 5v5.837L4.664 5H4a3.985 3.985 0 0 0-2.852 1.2l9.711 6.8H7.372L.157 7.949A3.968 3.968 0 0 0 0 9v.059L5.628 13H0v2h15V5h-2z"></path><path fill="#CF1B2B" d="M21 15V5h-6v10H0v6h15v10h6V21h15v-6z"></path></svg>':`<svg
            width="20px"
            height="20px"
            viewBox="0 0 36 36"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            aria-hidden="true"
            role="img"
            class="iconify iconify--twemoji"
            preserveAspectRatio="xMidYMid meet"
          >
            <path fill="#FFCD05" d="M0 27a4 4 0 0 0 4 4h28a4 4 0 0 0 4-4v-4H0v4z"></path>
            <path fill="#ED1F24" d="M0 14h36v9H0z"></path>
            <path fill="#141414" d="M32 5H4a4 4 0 0 0-4 4v5h36V9a4 4 0 0 0-4-4z"></path>
          </svg>`)}setupGlobalEventListeners(){this.addEventListenerSafe("backButton","click",()=>{g.goBack(),ue(this.container)}),this.addEventListenerSafe("homeButton","click",()=>{g.goHome(),ue(this.container)}),this.addEventListenerSafe("languageToggle","click",()=>{this.toggleLanguage()}),this.addEventListenerSafe("darkModeToggle","click",()=>{this.toggleDarkMode()}),this.addEventListenerSafe("apiModeToggle","click",e=>{e.preventDefault(),this.toggleApiMode()}),this.addEventListenerSafe("researchModeToggle","click",e=>{e.preventDefault(),e.stopPropagation(),this.toggleResearchMode()}),this.addGlobalEventListener("keydown",e=>{e.key==="Escape"&&(this.closeModal("helpModal"),this.closeModal("privacyPolicyModal"),this.closeModal("disclaimerModal"))}),this.addGlobalEventListener("beforeunload",e=>{g.hasUnsavedData()&&(e.preventDefault(),e.returnValue="You have unsaved data. Are you sure you want to leave?")})}initializeApiModeToggle(){if(!document.getElementById("apiModeToggle"))return;const t=["localhost","127.0.0.1","0.0.0.0"].includes(window.location.hostname);localStorage.getItem("use_mock_api")===null&&t&&!(import.meta&&ka)&&localStorage.setItem("use_mock_api","true"),this.updateApiModeButton()}toggleApiMode(){const t=localStorage.getItem("use_mock_api")==="true"?"false":"true";localStorage.setItem("use_mock_api",t),this.updateApiModeButton();try{const r=document.createElement("div");r.className="sr-only",r.setAttribute("role","status"),r.setAttribute("aria-live","polite"),r.textContent=t==="true"?"Mock data enabled":"Live API enabled",document.body.appendChild(r),setTimeout(()=>r.remove(),1200)}catch(r){}}updateApiModeButton(){const e=document.getElementById("apiModeToggle");if(!e)return;localStorage.getItem("use_mock_api")!=="false"?(e.textContent="🧪",e.title="Mock data: ON (click to use API)",e.setAttribute("aria-label","Mock data enabled")):(e.textContent="☁️",e.title="Live API: ON (click to use mock)",e.setAttribute("aria-label","Live API enabled"))}addEventListenerSafe(e,t,r){const s=document.getElementById(e);if(s){const i=o=>{try{r(o)}catch(c){this.handleUIError(c,`${e}_${t}`)}};s.addEventListener(t,i),this.eventListeners.set(`${e}_${t}`,{element:s,handler:i})}}addGlobalEventListener(e,t){const r=s=>{try{t(s)}catch(i){this.handleUIError(i,`global_${e}`)}};if(e==="keydown"||e==="beforeunload"){const s=e==="beforeunload"?window:document;s.addEventListener(e,r),this.eventListeners.set(`global_${e}`,{element:s,handler:r})}}setupHelpModal(){v(async()=>{const e=document.getElementById("helpButton"),t=document.getElementById("helpModal"),r=t==null?void 0:t.querySelector(".modal-close");e&&t&&(this.closeModal("helpModal"),this.addEventListenerSafe("helpButton","click",()=>{this.openModal("helpModal")}),r&&r.addEventListener("click",()=>{this.closeModal("helpModal")}),t.addEventListener("click",s=>{s.target===t&&this.closeModal("helpModal")}))},e=>{})}setupFooterLinks(){this.addEventListenerSafe("privacyLink","click",e=>{e.preventDefault(),this.openModal("privacyPolicyModal");const t=document.getElementById("privacyPolicyModal"),r=t==null?void 0:t.querySelector(".modal-close");r&&r.addEventListener("click",()=>{this.closeModal("privacyPolicyModal")})}),this.addEventListenerSafe("disclaimerLink","click",e=>{e.preventDefault(),this.openModal("disclaimerModal");const t=document.getElementById("disclaimerModal"),r=t==null?void 0:t.querySelector(".modal-close");r&&r.addEventListener("click",()=>{this.closeModal("disclaimerModal")})})}toggleLanguage(){v(async()=>{K.toggleLanguage(),this.updateLanguage()},e=>{})}updateLanguage(){document.documentElement.lang=K.getCurrentLanguage(),this.updateElementText(".app-header h1",l("appTitle")),this.updateElementText(".emergency-badge",l("emergencyBadge")),this.updateButtonAttributes("languageToggle",l("languageToggle")),this.updateButtonAttributes("helpButton",l("helpButton")),this.updateButtonAttributes("darkModeToggle",l("darkModeButton")),this.updateElementText("#modalTitle",l("helpTitle"));const e=document.getElementById("languageToggle");if(e){const t=K.getCurrentLanguage();e.innerHTML=t==="en"?'<svg width="20px" height="20px" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--twemoji" preserveAspectRatio="xMidYMid meet"><path fill="#00247D" d="M0 9.059V13h5.628zM4.664 31H13v-5.837zM23 25.164V31h8.335zM0 23v3.941L5.63 23zM31.337 5H23v5.837zM36 26.942V23h-5.631zM36 13V9.059L30.371 13zM13 5H4.664L13 10.837z"></path><path fill="#CF1B2B" d="M25.14 23l9.712 6.801a3.977 3.977 0 0 0 .99-1.749L28.627 23H25.14zM13 23h-2.141l-9.711 6.8c.521.53 1.189.909 1.938 1.085L13 23.943V23zm10-10h2.141l9.711-6.8a3.988 3.988 0 0 0-1.937-1.085L23 12.057V13zm-12.141 0L1.148 6.2a3.994 3.994 0 0 0-.991 1.749L7.372 13h3.487z"></path><path fill="#EEE" d="M36 21H21v10h2v-5.836L31.335 31H32a3.99 3.99 0 0 0 2.852-1.199L25.14 23h3.487l7.215 5.052c.093-.337.158-.686.158-1.052v-.058L30.369 23H36v-2zM0 21v2h5.63L0 26.941V27c0 1.091.439 2.078 1.148 2.8l9.711-6.8H13v.943l-9.914 6.941c.294.07.598.116.914.116h.664L13 25.163V31h2V21H0zM36 9a3.983 3.983 0 0 0-1.148-2.8L25.141 13H23v-.943l9.915-6.942A4.001 4.001 0 0 0 32 5h-.663L23 10.837V5h-2v10h15v-2h-5.629L36 9.059V9zM13 5v5.837L4.664 5H4a3.985 3.985 0 0 0-2.852 1.2l9.711 6.8H7.372L.157 7.949A3.968 3.968 0 0 0 0 9v.059L5.628 13H0v2h15V5h-2z"></path><path fill="#CF1B2B" d="M21 15V5h-6v10H0v6h15v10h6V21h15v-6z"></path></svg>':`<svg
            width="20px"
            height="20px"
            viewBox="0 0 36 36"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            aria-hidden="true"
            role="img"
            class="iconify iconify--twemoji"
            preserveAspectRatio="xMidYMid meet"
          >
            <path fill="#FFCD05" d="M0 27a4 4 0 0 0 4 4h28a4 4 0 0 0 4-4v-4H0v4z"></path>
            <path fill="#ED1F24" d="M0 14h36v9H0z"></path>
            <path fill="#141414" d="M32 5H4a4 4 0 0 0-4 4v5h36V9a4 4 0 0 0-4-4z"></path>
          </svg>`,e.dataset.lang=t}}updateElementText(e,t){const r=document.querySelector(e);r&&t&&(r.textContent=t)}updateButtonAttributes(e,t){const r=document.getElementById(e);r&&t&&(r.title=t,r.setAttribute("aria-label",t))}toggleDarkMode(){const e=document.documentElement;e.classList.toggle("dark");const t=e.classList.contains("dark"),r=document.getElementById("darkModeToggle");r&&(r.textContent=t?"☀️":"🌙"),localStorage.setItem("theme",t?"dark":"light")}initializeResearchMode(){document.getElementById("researchModeToggle")&&this.updateResearchMode()}updateResearchMode(){const e=document.getElementById("researchModeToggle");if(e){const t=this.getCurrentModuleFromResults(),r=t==="limited"||t==="full";e.style.display=r?"flex":"none",e.style.opacity=r?"1":"0.5"}}getCurrentModuleFromResults(){var r,s;const e=g.getState();if(e.currentScreen!=="results"||!((s=(r=e.results)==null?void 0:r.ich)!=null&&s.module))return null;const t=e.results.ich.module.toLowerCase();return t.includes("coma")?"coma":t.includes("limited")?"limited":t.includes("full")?"full":null}toggleResearchMode(){const e=document.getElementById("researchPanel");if(!e)return;const t=e.style.display!=="none";e.style.display=t?"none":"block";const r=document.getElementById("researchModeToggle");return r&&(r.style.background=t?"rgba(255, 255, 255, 0.1)":"rgba(0, 102, 204, 0.2)"),!1}showResearchActivationMessage(){v(async()=>{const e=document.createElement("div");e.className="research-activation-toast";try{ve(e,`
            <div class="toast-content">
              🔬 <strong>Research Mode Activated</strong><br>
              <small>Model comparison features enabled</small>
            </div>
          `)}catch(t){e.textContent="🔬 Research Mode Activated - Model comparison features enabled"}document.body.appendChild(e),setTimeout(()=>{document.body.contains(e)&&document.body.removeChild(e)},3e3)},e=>{})}openModal(e){const t=document.getElementById(e);t&&(t.style.display="flex",t.classList.add("show"),t.setAttribute("aria-hidden","false"))}closeModal(e){const t=document.getElementById(e);t&&(t.classList.remove("show"),t.style.display="none",t.setAttribute("aria-hidden","true"))}showPrivacyPolicy(){}showDisclaimer(){alert("Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.")}setCurrentYear(){const e=document.getElementById("currentYear");e&&(e.textContent=new Date().getFullYear())}handleUIError(e,t){try{const r=new CustomEvent("uiError",{detail:{error:e,context:t,timestamp:Date.now()}});document.dispatchEvent(r)}catch(r){}}async preloadCriticalComponents(){return v(async()=>{const t=["appContainer","helpModal","languageToggle","darkModeToggle"].filter(r=>!document.getElementById(r));if(t.length>0)throw new Error(`Missing critical UI elements: ${t.join(", ")}`);return!0},e=>!1)}getStatus(){return{isInitialized:this.isInitialized,hasContainer:!!this.container,eventListenersCount:this.eventListeners.size,currentLanguage:K.getCurrentLanguage(),isDarkMode:document.body.classList.contains("dark-mode")}}destroy(){this.eventListeners.forEach(({element:e,handler:t},r)=>{const[,s]=r.split("_");e&&t&&e.removeEventListener(s,t)}),this.eventListeners.clear(),this.container=null,this.isInitialized=!1}}class Sa{constructor(){this.currentTheme="light",this.isInitialized=!1,this.storageKey="theme"}initialize(){this.loadSavedTheme(),this.setupThemeDetection(),this.isInitialized=!0}async loadSavedTheme(){return v(async()=>{const e=localStorage.getItem(this.storageKey),t=window.matchMedia("(prefers-color-scheme: dark)").matches;let r;return e==="dark"||e==="light"?r=e:t?r="dark":r="light",this.applyTheme(r),this.updateThemeButton(),r},e=>(this.applyTheme("light"),this.updateThemeButton(),"light"))}setupThemeDetection(){const e=window.matchMedia("(prefers-color-scheme: dark)"),t=r=>{if(!localStorage.getItem(this.storageKey)){const i=r.matches?"dark":"light";this.applyTheme(i),this.updateThemeButton()}};e.addEventListener?e.addEventListener("change",t):e.addListener(t)}applyTheme(e){e!=="light"&&e!=="dark"&&(e="light"),this.currentTheme=e,e==="dark"?document.body.classList.add("dark-mode"):document.body.classList.remove("dark-mode"),this.updateMetaThemeColor(e),this.dispatchThemeChangeEvent(e)}toggleTheme(){const e=this.currentTheme==="dark"?"light":"dark";this.setTheme(e)}setTheme(e){return v(async()=>(this.applyTheme(e),this.saveTheme(e),this.updateThemeButton(),e),t=>this.currentTheme)}saveTheme(e){try{localStorage.setItem(this.storageKey,e)}catch(t){}}updateThemeButton(){const e=document.getElementById("darkModeToggle");if(e){const t=this.currentTheme==="dark";e.textContent=t?"☀️":"🌙";const r=t?"Switch to light mode":"Switch to dark mode";e.setAttribute("aria-label",r),e.title=r}}updateMetaThemeColor(e){let t=document.querySelector('meta[name="theme-color"]');t||(t=document.createElement("meta"),t.name="theme-color",document.head.appendChild(t));const r={light:"#ffffff",dark:"#1a1a1a"};t.content=r[e]||r.light}dispatchThemeChangeEvent(e){try{const t=new CustomEvent("themeChanged",{detail:{theme:e,timestamp:Date.now()}});document.dispatchEvent(t)}catch(t){}}getCurrentTheme(){return this.currentTheme}isDarkMode(){return this.currentTheme==="dark"}getSystemPreferredTheme(){try{return window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}catch(e){return"light"}}resetToSystemTheme(){const e=this.getSystemPreferredTheme();this.setTheme(e);try{localStorage.removeItem(this.storageKey)}catch(t){}}getStatus(){return{isInitialized:this.isInitialized,currentTheme:this.currentTheme,isDarkMode:this.isDarkMode(),systemPreferred:this.getSystemPreferredTheme(),hasExplicitPreference:!!localStorage.getItem(this.storageKey)}}destroy(){this.isInitialized=!1}}class Ea{constructor(){this.autoSaveInterval=null,this.sessionCheckInterval=null,this.isInitialized=!1,this.lastAutoSave=0}initialize(){this.validateStoredSession(),this.startAutoSave(),this.setupSessionTimeout(),this.setupSessionValidation(),this.isInitialized=!0}async validateStoredSession(){return v(async()=>P.isValidSession()?(this.restoreFormData(),!0):(this.clearSessionData(),!1),e=>(this.clearSessionData(),!1))}startAutoSave(){this.autoSaveInterval&&clearInterval(this.autoSaveInterval),this.autoSaveInterval=setInterval(()=>{this.performAutoSave()},gt.autoSaveInterval)}async performAutoSave(){return v(async()=>{const e=document.getElementById("appContainer");if(!e)return!1;const t=e.querySelectorAll("form[data-module]");let r=0;for(const s of t)try{const{module:i}=s.dataset;if(i){const o=this.extractFormData(s);this.hasFormDataChanged(i,o)&&(g.setFormData(i,o),r++)}}catch(i){}return this.lastAutoSave=Date.now(),r>0},e=>!1)}extractFormData(e){const t=new FormData(e),r={};return t.forEach((s,i)=>{const o=e.elements[i];if(o)if(o.type==="checkbox")r[i]=o.checked;else if(o.type==="number"){const c=parseFloat(s);r[i]=isNaN(c)?s:c}else r[i]=s}),r}hasFormDataChanged(e,t){try{const r=g.getFormData(e);return JSON.stringify(r)!==JSON.stringify(t)}catch(r){return!0}}restoreFormData(){v(async()=>{const e=document.getElementById("appContainer");if(!e)return;e.querySelectorAll("form[data-module]").forEach(r=>{try{const{module:s}=r.dataset;if(s){const i=g.getFormData(s);i&&Object.keys(i).length>0&&this.populateForm(r,i)}}catch(s){}})},e=>{})}populateForm(e,t){Object.entries(t).forEach(([r,s])=>{const i=e.elements[r];if(i)try{i.type==="checkbox"?i.checked=!!s:i.type==="radio"?i.value===s&&(i.checked=!0):i.value=s,i.dispatchEvent(new Event("input",{bubbles:!0}))}catch(o){}})}setupSessionTimeout(){setTimeout(()=>{this.showSessionTimeoutWarning()},gt.sessionTimeout-6e4)}setupSessionValidation(){this.sessionCheckInterval=setInterval(()=>{this.validateCurrentSession()},5*60*1e3)}async validateCurrentSession(){return v(async()=>P.isValidSession()?await P.validateSessionWithServer()?!0:(this.handleSessionExpiry(),!1):(this.handleSessionExpiry(),!1),e=>P.isValidSession())}showSessionTimeoutWarning(){v(async()=>{confirm("Your session will expire in 1 minute. Would you like to continue?")?(P.updateActivity(),this.setupSessionTimeout()):this.endSession()},e=>{})}handleSessionExpiry(){this.clearSessionData(),g.navigate("login"),this.showSessionExpiredMessage()}showSessionExpiredMessage(){const e=document.createElement("div");e.style.cssText=`
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
    `,e.textContent="⏰ Session expired. Please log in again.",document.body.appendChild(e),setTimeout(()=>{document.body.contains(e)&&document.body.removeChild(e)},5e3)}endSession(){P.logout(),this.clearSessionData(),g.reset(),g.navigate("login")}async clearSessionData(){try{p.info("Clearing session data",{category:f.SECURITY}),g.clearAllFormData(),await de("temp_data",!0),await de("research_data",!0),sessionStorage.removeItem("temp_data"),sessionStorage.removeItem("research_data"),p.info("Session data cleared successfully",{category:f.SECURITY})}catch(e){p.warn("Failed to clear some session data",{category:f.SECURITY,error:e.message})}}async forceSave(){return this.performAutoSave()}getStatus(){var e;return{isInitialized:this.isInitialized,isAuthenticated:P.isValidSession(),lastAutoSave:this.lastAutoSave,autoSaveActive:!!this.autoSaveInterval,sessionCheckActive:!!this.sessionCheckInterval,sessionInfo:((e=P.getSessionInfo)==null?void 0:e.call(P))||{}}}destroy(){this.autoSaveInterval&&(clearInterval(this.autoSaveInterval),this.autoSaveInterval=null),this.sessionCheckInterval&&(clearInterval(this.sessionCheckInterval),this.sessionCheckInterval=null),this.isInitialized=!1}}const V={MEMORY:"memory",SESSION:"session",LOCAL:"local",INDEXED_DB:"indexed_db"},ae={CRITICAL:"critical",HIGH:"high",NORMAL:"normal",LOW:"low"},Ta={API_RESPONSES:15*60*1e3};class wt{constructor(e,t,r,s=ae.NORMAL,i={}){this.key=e,this.value=this.sanitizeValue(t),this.ttl=r,this.priority=s,this.metadata={...i,createdAt:Date.now(),accessCount:0,lastAccessed:Date.now()},this.expiresAt=r>0?Date.now()+r:null,this.encrypted=!1}sanitizeValue(e){if(typeof e!="object"||e===null)return e;const t=JSON.parse(JSON.stringify(e)),r=["ssn","mrn","patient_id","user_id","session_token"];return this.removeSensitiveFields(t,r),t}removeSensitiveFields(e,t){Object.keys(e).forEach(r=>{t.some(s=>r.toLowerCase().includes(s))?e[r]="[REDACTED]":typeof e[r]=="object"&&e[r]!==null&&this.removeSensitiveFields(e[r],t)})}isExpired(){return this.expiresAt!==null&&Date.now()>this.expiresAt}markAccessed(){this.metadata.accessCount+=1,this.metadata.lastAccessed=Date.now()}getAge(){return Date.now()-this.metadata.createdAt}getTimeToExpiration(){return this.expiresAt===null?1/0:Math.max(0,this.expiresAt-Date.now())}getEvictionScore(){const t={[ae.CRITICAL]:1e3,[ae.HIGH]:100,[ae.NORMAL]:10,[ae.LOW]:1}[this.priority]||1,r=Math.log(this.metadata.accessCount+1),s=1/(this.getAge()+1);return t*r*s}}class Re{constructor(e=V.MEMORY,t={}){this.storageType=e,this.options={maxSize:100*1024*1024,maxEntries:1e3,cleanupInterval:5*60*1e3,enableEncryption:!1,enableMetrics:!0,...t},this.cache=new Map,this.cleanupTimer=null,this.totalSize=0,this.hitCount=0,this.missCount=0,this.evictionCount=0,this.initializeStorage(),this.startCleanupTimer()}initializeStorage(){switch(this.storageType){case V.SESSION:this.storage=sessionStorage,this.loadFromStorage();break;case V.LOCAL:this.storage=localStorage,this.loadFromStorage();break;case V.INDEXED_DB:this.initializeIndexedDB();break;default:this.storage=null}}loadFromStorage(){if(this.storage)try{const e=this.storage.getItem("medical_cache");if(e){const t=JSON.parse(e);Object.entries(t).forEach(([r,s])=>{const i=new wt(s.key,s.value,s.ttl,s.priority,s.metadata);i.expiresAt=s.expiresAt,i.isExpired()||(this.cache.set(r,i),this.totalSize+=this.calculateSize(i.value))})}}catch(e){}}saveToStorage(){if(this.storage)try{const e={};this.cache.forEach((t,r)=>{e[r]={key:t.key,value:t.value,ttl:t.ttl,priority:t.priority,metadata:t.metadata,expiresAt:t.expiresAt}}),this.storage.setItem("medical_cache",JSON.stringify(e))}catch(e){}}async initializeIndexedDB(){}set(e,t,r=Ta.API_RESPONSES,s=ae.NORMAL,i={}){const o=O.startMeasurement(Ke.CACHE,"cache_set",{key:e,priority:s});try{this.ensureCapacity();const c=new wt(e,t,r,s,i),n=this.calculateSize(t);if(this.cache.has(e)){const u=this.cache.get(e);this.totalSize-=this.calculateSize(u.value)}return this.cache.set(e,c),this.totalSize+=n,this.storageType!==V.MEMORY&&this.saveToStorage(),y.publish(b.AUDIT_EVENT,{action:"cache_set",key:e,size:n,ttl:r,priority:s}),O.endMeasurement(o,{success:!0}),!0}catch(c){return O.endMeasurement(o,{success:!1,error:c.message}),!1}}get(e){const t=O.startMeasurement(Ke.CACHE,"cache_get",{key:e});try{const r=this.cache.get(e);return r?r.isExpired()?(this.cache.delete(e),this.totalSize-=this.calculateSize(r.value),this.missCount+=1,O.endMeasurement(t,{hit:!1,expired:!0}),null):(r.markAccessed(),this.hitCount+=1,O.endMeasurement(t,{hit:!0}),r.value):(this.missCount+=1,O.endMeasurement(t,{hit:!1}),null)}catch(r){return O.endMeasurement(t,{hit:!1,error:r.message}),null}}has(e){const t=this.cache.get(e);return t&&!t.isExpired()}delete(e){const t=this.cache.get(e);return t?(this.totalSize-=this.calculateSize(t.value),this.cache.delete(e),this.storageType!==V.MEMORY&&this.saveToStorage(),y.publish(b.AUDIT_EVENT,{action:"cache_delete",key:e}),!0):!1}clear(){const e=this.cache.size;this.cache.clear(),this.totalSize=0,this.storage&&this.storage.removeItem("medical_cache"),y.publish(b.AUDIT_EVENT,{action:"cache_cleared",entriesCleared:e})}ensureCapacity(){for(;this.totalSize>this.options.maxSize;)this.evictLeastImportant();for(;this.cache.size>=this.options.maxEntries;)this.evictLeastImportant()}evictLeastImportant(){let e=1/0,t=null;this.cache.forEach((r,s)=>{if(r.priority===ae.CRITICAL&&!r.isExpired())return;const i=r.getEvictionScore();i<e&&(e=i,t=s)}),t&&(this.delete(t),this.evictionCount+=1)}cleanup(){const e=performance.now();let t=0;this.cache.forEach((s,i)=>{s.isExpired()&&(this.delete(i),t+=1)});const r=performance.now()-e;return y.publish(b.AUDIT_EVENT,{action:"cache_cleanup",cleanedCount:t,duration:r,remainingEntries:this.cache.size}),t}startCleanupTimer(){this.cleanupTimer&&clearInterval(this.cleanupTimer),this.cleanupTimer=setInterval(()=>{this.cleanup()},this.options.cleanupInterval)}stopCleanupTimer(){this.cleanupTimer&&(clearInterval(this.cleanupTimer),this.cleanupTimer=null)}calculateSize(e){try{return JSON.stringify(e).length*2}catch(t){return 0}}getStats(){const e=this.hitCount+this.missCount>0?this.hitCount/(this.hitCount+this.missCount)*100:0;return{entries:this.cache.size,totalSize:this.totalSize,maxSize:this.options.maxSize,hitCount:this.hitCount,missCount:this.missCount,hitRate:`${e.toFixed(2)}%`,evictionCount:this.evictionCount,storageType:this.storageType,utilizationPercent:`${(this.totalSize/this.options.maxSize*100).toFixed(2)}%`}}getEntryInfo(e){const t=this.cache.get(e);return t?{key:t.key,size:this.calculateSize(t.value),priority:t.priority,ttl:t.ttl,age:t.getAge(),timeToExpiration:t.getTimeToExpiration(),accessCount:t.metadata.accessCount,lastAccessed:new Date(t.metadata.lastAccessed).toISOString(),isExpired:t.isExpired(),evictionScore:t.getEvictionScore()}:null}dispose(){this.stopCleanupTimer(),this.clear()}}class Z{static getPatientDataCache(){return this.patientDataCache||(this.patientDataCache=new Re(V.SESSION,{maxSize:10*1024*1024,maxEntries:100,enableEncryption:!0})),this.patientDataCache}static getPredictionCache(){return this.predictionCache||(this.predictionCache=new Re(V.MEMORY,{maxSize:50*1024*1024,maxEntries:500})),this.predictionCache}static getValidationCache(){return this.validationCache||(this.validationCache=new Re(V.LOCAL,{maxSize:5*1024*1024,maxEntries:200})),this.validationCache}static getApiCache(){return this.apiCache||(this.apiCache=new Re(V.SESSION,{maxSize:20*1024*1024,maxEntries:300})),this.apiCache}static clearAllCaches(){[this.patientDataCache,this.predictionCache,this.validationCache,this.apiCache].forEach(e=>{e&&e.clear()})}static disposeAllCaches(){[this.patientDataCache,this.predictionCache,this.validationCache,this.apiCache].forEach(e=>{e&&e.dispose()}),this.patientDataCache=null,this.predictionCache=null,this.validationCache=null,this.apiCache=null}}be(Z,"patientDataCache",null),be(Z,"predictionCache",null),be(Z,"validationCache",null),be(Z,"apiCache",null);Z.getPatientDataCache();const Ns=Z.getPredictionCache();Z.getValidationCache();Z.getApiCache();const S={CRITICAL:"critical",HIGH:"high",NORMAL:"normal",LOW:"low"},U={PENDING:"pending",LOADING:"loading",LOADED:"loaded",ERROR:"error"};class Aa{constructor(e,t,r={}){this.name=e,this.loader=t,this.priority=r.priority||S.NORMAL,this.state=U.PENDING,this.component=null,this.error=null,this.loadTime=null,this.dependencies=r.dependencies||[],this.retryCount=0,this.maxRetries=r.maxRetries||3,this.loadPromise=null}async load(){if(this.state===U.LOADED)return this.component;if(this.loadPromise)return this.loadPromise;const e=O.startMeasurement(Ke.USER_INTERACTION,`lazy_load_${this.name}`,{priority:this.priority});return this.state=U.LOADING,this.loadPromise=this.executeLoad(e),this.loadPromise}async executeLoad(e){try{const t=performance.now();return await this.loadDependencies(),this.component=await this.loader(),this.loadTime=performance.now()-t,this.state=U.LOADED,O.endMeasurement(e,{success:!0,loadTime:this.loadTime,retryCount:this.retryCount}),y.publish(b.AUDIT_EVENT,{action:"lazy_component_loaded",component:this.name,loadTime:this.loadTime,priority:this.priority}),this.component}catch(t){if(this.error=t,this.retryCount++,O.endMeasurement(e,{success:!1,error:t.message,retryCount:this.retryCount}),this.retryCount<this.maxRetries){const r=Math.min(1e3*2**(this.retryCount-1),5e3);return await new Promise(s=>setTimeout(s,r)),this.loadPromise=null,this.load()}throw this.state=U.ERROR,y.publish(b.AUDIT_EVENT,{action:"lazy_component_load_failed",component:this.name,error:t.message,retryCount:this.retryCount}),t}}async loadDependencies(){if(this.dependencies.length===0)return;const e=this.dependencies.map(t=>typeof t=="string"?Wt.load(t):typeof t=="function"?t():t.load());await Promise.all(e)}getStatus(){var e;return{name:this.name,state:this.state,priority:this.priority,loadTime:this.loadTime,error:(e=this.error)==null?void 0:e.message,retryCount:this.retryCount}}}class Wt{constructor(){this.components=new Map,this.intersectionObserver=null,this.idleCallback=null,this.loadQueue={[S.CRITICAL]:[],[S.HIGH]:[],[S.NORMAL]:[],[S.LOW]:[]},this.isProcessingQueue=!1,this.initializeObservers()}initializeObservers(){"IntersectionObserver"in window&&(this.intersectionObserver=new IntersectionObserver(e=>this.handleIntersectionChanges(e),{rootMargin:"50px",threshold:.1})),this.scheduleIdleLoading()}register(e,t,r={}){const s=new Aa(e,t,r);return this.components.set(e,s),this.loadQueue[s.priority].push(s),s.priority===S.CRITICAL&&this.processLoadQueue(),y.publish(b.AUDIT_EVENT,{action:"lazy_component_registered",component:e,priority:s.priority}),s}async load(e){const t=this.components.get(e);if(!t)throw new Error(`Component '${e}' not registered`);return t.load()}async preload(e=S.HIGH){const t=[S.CRITICAL,S.HIGH,S.NORMAL,S.LOW],r=t.slice(0,t.indexOf(e)+1),s=[];r.forEach(i=>{this.loadQueue[i].forEach(o=>{o.state===U.PENDING&&s.push(o.load())})}),await Promise.allSettled(s),y.publish(b.AUDIT_EVENT,{action:"lazy_components_preloaded",priority:e,count:s.length})}observeElement(e,t){this.intersectionObserver&&(e.dataset.lazyComponent=t,this.intersectionObserver.observe(e))}handleIntersectionChanges(e){e.forEach(t=>{if(t.isIntersecting){const r=t.target.dataset.lazyComponent;r&&(this.load(r).catch(s=>{}),this.intersectionObserver.unobserve(t.target))}})}async processLoadQueue(){if(!this.isProcessingQueue){this.isProcessingQueue=!0;try{await this.processQueueByPriority(S.CRITICAL),await this.processQueueByPriority(S.HIGH)}catch(e){}finally{this.isProcessingQueue=!1}}}async processQueueByPriority(e){const r=this.loadQueue[e].filter(i=>i.state===U.PENDING);if(r.length===0)return;const s=r.map(i=>i.load().catch(o=>null));await Promise.allSettled(s)}scheduleIdleLoading(){const e=()=>{"requestIdleCallback"in window?this.idleCallback=requestIdleCallback(t=>{this.processIdleQueue(t),e()},{timeout:5e3}):setTimeout(()=>{this.processIdleQueue({timeRemaining:()=>50}),e()},100)};e()}async processIdleQueue(e){const t=this.loadQueue[S.NORMAL],r=this.loadQueue[S.LOW],s=[...t.filter(i=>i.state===U.PENDING),...r.filter(i=>i.state===U.PENDING)];for(const i of s)if(e.timeRemaining()>10)try{await i.load()}catch(o){}else break}getStats(){const e={total:this.components.size,byState:{pending:0,loading:0,loaded:0,error:0},byPriority:{critical:0,high:0,normal:0,low:0},totalLoadTime:0,averageLoadTime:0};let t=0,r=0;return this.components.forEach(s=>{e.byState[s.state]++,e.byPriority[s.priority]++,s.loadTime&&(t+=s.loadTime,r++)}),e.totalLoadTime=t,e.averageLoadTime=r>0?t/r:0,e}async reload(e){const t=this.components.get(e);if(!t)throw new Error(`Component '${e}' not registered`);return t.state=U.PENDING,t.component=null,t.error=null,t.loadTime=null,t.retryCount=0,t.loadPromise=null,t.load()}dispose(){this.intersectionObserver&&this.intersectionObserver.disconnect(),this.idleCallback&&cancelIdleCallback(this.idleCallback),this.components.clear(),Object.values(this.loadQueue).forEach(e=>e.length=0),y.publish(b.AUDIT_EVENT,{action:"lazy_loader_disposed"})}}class Ca{constructor(e){this.lazyLoader=e,this.registerMedicalComponents()}registerMedicalComponents(){this.lazyLoader.register("advanced-analytics",()=>q(()=>import("./research-tools-DfKHAme-.js").then(e=>e.g),__vite__mapDeps([0,1])),{priority:S.LOW}),this.lazyLoader.register("clinical-reporting",()=>q(()=>import("./research-tools-DfKHAme-.js").then(e=>e.f),__vite__mapDeps([0,1])),{priority:S.LOW}),this.lazyLoader.register("audit-trail",()=>q(()=>import("./research-tools-DfKHAme-.js").then(e=>e.h),__vite__mapDeps([0,1])),{priority:S.LOW}),this.lazyLoader.register("medical-service-worker",()=>q(()=>import("./enterprise-features-DOrIKDK9.js").then(e=>e.e),__vite__mapDeps([2,1])),{priority:S.LOW}),this.lazyLoader.register("sw-manager",()=>q(()=>import("./enterprise-features-DOrIKDK9.js").then(e=>e.d),__vite__mapDeps([2,1])),{priority:S.LOW}),this.lazyLoader.register("command-pattern",()=>q(()=>Promise.resolve().then(()=>Ga),void 0),{priority:S.NORMAL}),this.lazyLoader.register("prediction-strategy",()=>q(()=>Promise.resolve().then(()=>Ja),void 0),{priority:S.NORMAL}),this.lazyLoader.register("validation-factory",()=>q(()=>Promise.resolve().then(()=>ls),void 0),{priority:S.NORMAL})}async loadByClinicalPriority(e){switch(e){case"emergency":await this.lazyLoader.preload(S.HIGH);break;case"routine":await this.lazyLoader.preload(S.NORMAL);break;case"research":await this.lazyLoader.load("advanced-analytics"),await this.lazyLoader.load("clinical-reporting"),await this.lazyLoader.load("audit-trail");break;case"background":await this.lazyLoader.load("medical-service-worker"),await this.lazyLoader.load("sw-manager");break;default:await this.lazyLoader.preload(S.NORMAL)}}async preloadForModule(e){const r={coma:["command-pattern"],limited:["prediction-strategy"],full:["command-pattern","prediction-strategy","validation-factory"],research:["advanced-analytics","clinical-reporting","audit-trail"]}[e]||[],s=r.map(i=>this.lazyLoader.load(i));await Promise.allSettled(s),y.publish(b.AUDIT_EVENT,{action:"medical_components_preloaded",moduleType:e,components:r})}async loadEnterpriseFeatures(){const e=["medical-service-worker","sw-manager","advanced-analytics","clinical-reporting","audit-trail"],t=e.map(i=>this.lazyLoader.load(i).catch(o=>(console.warn(`Enterprise feature ${i} failed to load:`,o),null))),s=(await Promise.allSettled(t)).filter(i=>i.status==="fulfilled"&&i.value!==null).length;return y.publish(b.AUDIT_EVENT,{action:"enterprise_features_loaded",requested:e.length,loaded:s}),s}}const Ne=new Wt;new Ca(Ne);class Ia{constructor(){this.isInitialized=!1,this.phase3Status={serviceWorker:!1,performanceMonitor:!1,syncManager:!1,lazyLoader:!1},this.phase4Status={reportingSystem:!1,qualityMetrics:!1,auditTrail:!1}}async initialize(){return v(async()=>(await this.initializePhase3Features(),await this.initializePhase4Features(),this.isInitialized=!0,!0),e=>!1)}async initializePhase3Features(){return v(async()=>(await this.initializePerformanceMonitor(),this.initializeServiceWorker(),await this.initializeSyncManager(),await this.initializeProgressiveLoading(),!0),e=>!1)}async initializePerformanceMonitor(){return v(async()=>(O.start(),this.phase3Status.performanceMonitor=!0,!0),e=>(this.phase3Status.performanceMonitor=!1,!1))}async initializeServiceWorker(){v(async()=>{const e=await ct.initialize();return this.phase3Status.serviceWorker=e,e&&await this.prefetchCriticalResources(),e},e=>(this.phase3Status.serviceWorker=!1,!1))}async initializeSyncManager(){return v(async()=>{const e=await dt.initialize();return this.phase3Status.syncManager=e,e},e=>(this.phase3Status.syncManager=!1,!1))}async initializeProgressiveLoading(){return v(async()=>(await Ne.preload("critical"),setTimeout(()=>this.setupViewportLoading(),100),this.phase3Status.lazyLoader=!0,!0),e=>(this.phase3Status.lazyLoader=!1,!1))}setupViewportLoading(){try{document.querySelectorAll(".brain-visualization-placeholder").forEach(r=>{Ne.observeElement(r,"brain-visualization")}),document.querySelectorAll(".stroke-center-map-placeholder").forEach(r=>{Ne.observeElement(r,"stroke-center-map")})}catch(e){}}async prefetchCriticalResources(){return v(async()=>{const e=["/0925/src/logic/lvo-local-model.js","/0925/src/logic/ich-volume-calculator.js","/0925/src/patterns/prediction-strategy.js","/0925/src/performance/medical-cache.js"];return await ct.prefetchResources(e),!0},e=>!1)}async initializePhase4Features(){return v(async()=>(await this.initializeAuditTrail(),await this.initializeReportingSystem(),await this.initializeQualityMetrics(),this.setupPhase4EventHandlers(),!0),e=>!1)}async initializeAuditTrail(){return v(async()=>(await ut.initialize(),this.phase4Status.auditTrail=!0,!0),e=>(this.phase4Status.auditTrail=!1,!1))}async initializeReportingSystem(){return v(async()=>(mt.start(),this.phase4Status.reportingSystem=!0,!0),e=>(this.phase4Status.reportingSystem=!1,!1))}async initializeQualityMetrics(){return v(async()=>(await je.initialize(),this.phase4Status.qualityMetrics=!0,!0),e=>(this.phase4Status.qualityMetrics=!1,!1))}setupPhase4EventHandlers(){document.addEventListener("submit",async e=>{const t=e.target;t.dataset.module&&await v(async()=>{const r=new FormData(t),s=Object.fromEntries(r.entries());return this.phase4Status.auditTrail&&ut.logEvent("data_entry",{module:t.dataset.module,timestamp:new Date().toISOString(),data_points:Object.keys(s).length}),this.phase4Status.qualityMetrics&&(je.recordMetric("form_completion","count",1),je.recordMetric("data_quality","completeness",Object.values(s).filter(i=>i&&i.trim()).length/Object.keys(s).length*100)),!0},r=>!1)})}getStatus(){return{isInitialized:this.isInitialized,phase3:{...this.phase3Status,overall:Object.values(this.phase3Status).some(e=>e)},phase4:{...this.phase4Status,overall:Object.values(this.phase4Status).some(e=>e)},systemStatus:this.getSystemStatus()}}getSystemStatus(){return{serviceWorkerSupported:"serviceWorker"in navigator,indexedDBSupported:"indexedDB"in window,notificationSupported:"Notification"in window,cacheSupported:"caches"in window,webLockSupported:"locks"in navigator,performanceSupported:"performance"in window}}async restart(){return this.destroy(),this.initialize()}destroy(){var e,t,r,s,i,o;if(this.phase3Status.performanceMonitor)try{(t=(e=O).stop)==null||t.call(e)}catch(c){}if(this.phase3Status.syncManager)try{(s=(r=dt).destroy)==null||s.call(r)}catch(c){}if(this.phase4Status.reportingSystem)try{(o=(i=mt).stop)==null||o.call(i)}catch(c){}this.phase3Status={serviceWorker:!1,performanceMonitor:!1,syncManager:!1,lazyLoader:!1},this.phase4Status={reportingSystem:!1,qualityMetrics:!1,auditTrail:!1},this.isInitialized=!1}}const La={};class Ma{constructor(){this.container=null,this.unsubscribe=null,this.isInitialized=!1,this.uiManager=new wa,this.themeManager=new Sa,this.sessionManager=new Ea,this.advancedFeaturesManager=new Ia}async init(){return v(async()=>{if(p.info("Application initialization started",{category:f.SYSTEM,version:"2.1.0",userAgent:navigator.userAgent.substring(0,100)}),document.readyState==="loading")return p.debug("Waiting for DOM ready",{category:f.SYSTEM}),new Promise(e=>{document.addEventListener("DOMContentLoaded",()=>e(this.init()))});if(this.container=document.getElementById("appContainer"),!this.container)throw p.critical("App container not found",{category:f.SYSTEM,containerId:"appContainer"}),new Error("Critical initialization failure: App container not found");return p.debug("App container found",{category:f.SYSTEM}),P.isValidSession()||(p.info("No valid session, redirecting to login",{category:f.AUTHENTICATION}),g.navigate("login")),p.info("Initializing core features",{category:f.SYSTEM}),await this.initializeCoreFeatures(),p.info("Skipping advanced features initialization",{category:f.SYSTEM}),this.setupRenderingSystem(),p.debug("Initializing UI manager",{category:f.SYSTEM}),this.uiManager.initialize(this.container),p.debug("Initializing theme manager",{category:f.SYSTEM}),this.themeManager.initialize(),p.debug("Initializing session manager",{category:f.SYSTEM}),this.sessionManager.initialize(),import.meta&&La&&(p.info("Starting Cloud Functions warm-up (dev only)",{category:f.NETWORK}),cr()),ue(this.container),this.isInitialized=!0,p.info("Application initialization completed successfully",{category:f.SYSTEM,initializationTime:performance.now()}),!0},e=>{throw p.critical("Application initialization failed",{category:f.SYSTEM,error:e.message,stack:e.stack}),new Error(`App initialization failed: ${e.message}`)})}async initializeCoreFeatures(){return v(async()=>{const e=[this.uiManager.preloadCriticalComponents(),this.themeManager.loadSavedTheme(),this.sessionManager.validateStoredSession()],r=(await Promise.allSettled(e)).filter(s=>s.status==="rejected");if(r.length>0)throw new Error(`${r.length} core features failed to initialize`);return!0},e=>!1)}async initializeAdvancedFeatures(){v(async()=>(await this.advancedFeaturesManager.initialize(),!0),e=>!1)}setupRenderingSystem(){this.unsubscribe=g.subscribe(()=>{ue(this.container),setTimeout(()=>this.uiManager.updateResearchMode(),200)}),window.addEventListener("languageChanged",()=>{this.uiManager.updateLanguage(),ue(this.container)})}getStatus(){return{isInitialized:this.isInitialized,hasContainer:!!this.container,isAuthenticated:P.isValidSession(),ui:this.uiManager.getStatus(),theme:this.themeManager.getStatus(),session:this.sessionManager.getStatus(),advancedFeatures:this.advancedFeaturesManager.getStatus()}}destroy(){this.unsubscribe&&this.unsubscribe(),this.uiManager.destroy(),this.themeManager.destroy(),this.sessionManager.destroy(),this.advancedFeaturesManager.destroy(),this.isInitialized=!1}}async function _a(){const a=new Ma;try{return await a.init(),a}catch(e){throw new Error(`Failed to create application: ${e.message}`)}}const Pe={authentication:"https://europe-west3-igfap-452720.cloudfunctions.net/authenticate-research-access",comaIch:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_coma_ich",limitedIch:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_limited_data_ich",fullStroke:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_full_stroke",lvo:"https://europe-west3-igfap-452720.cloudfunctions.net/predict_lvo"},St={authentication:{action:"validate_session",session_token:"warmup-test-token"},comaIch:{gfap_value:100},limitedIch:{age_years:65,systolic_bp:140,diastolic_bp:80,gfap_value:100,vigilanzminderung:0},fullStroke:{age_years:65,systolic_bp:140,diastolic_bp:80,gfap_value:100,fast_ed_score:4,headache:0,vigilanzminderung:0,armparese:0,beinparese:0,eye_deviation:0,atrial_fibrillation:0,anticoagulated_noak:0,antiplatelets:0},lvo:{gfap_value:100,fast_ed_score:4}};class Ra{constructor(){this.warmupAttempts=0,this.successfulWarmups=0,this.warmupResults={},this.isWarming=!1}async warmupAllAPIs(e=!0){if(this.isWarming)return p.info("API warmup already in progress",{category:"WARMUP"}),this.warmupResults;this.isWarming=!0,this.warmupAttempts=0,this.successfulWarmups=0,this.warmupResults={},p.info("Starting API warmup process",{category:"WARMUP",endpoints:Object.keys(Pe).length});const t=Object.entries(Pe).map(async([r,s])=>{try{const i=await this.warmupSingleAPI(r,s,St[r]);return this.warmupResults[r]=i,i.success&&this.successfulWarmups++,i}catch(i){const o={success:!1,error:i.message,duration:0,timestamp:new Date().toISOString()};return this.warmupResults[r]=o,o}});return e?(Promise.all(t).then(()=>{this.completeWarmup()}).catch(r=>{p.error("Background API warmup failed",{category:"WARMUP",error:r.message}),this.isWarming=!1}),{status:"warming",message:"APIs warming up in background"}):(await Promise.all(t),this.completeWarmup(),this.warmupResults)}async warmupSingleAPI(e,t,r){const s=Date.now();this.warmupAttempts++;try{p.info(`Warming up ${e} API`,{category:"WARMUP",url:t});const i=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json","User-Agent":"iGFAP-Warmup/2.1.0"},body:JSON.stringify(r),signal:AbortSignal.timeout(1e4)}),o=Date.now()-s,c={success:!0,status:i.status,duration:o,message:`${e} API warmed up`,timestamp:new Date().toISOString()};return p.info(`Successfully warmed up ${e} API`,{category:"WARMUP",duration:o,status:i.status}),c}catch(i){const o=Date.now()-s;return i.name==="TypeError"&&i.message.includes("Failed to fetch")?(p.info(`${e} API warmup encountered CORS (expected), function still warmed`,{category:"WARMUP",duration:o}),{success:!0,status:"cors-blocked",duration:o,message:`${e} API warmed (CORS blocked but function activated)`,timestamp:new Date().toISOString()}):(p.warn(`Failed to warm up ${e} API`,{category:"WARMUP",error:i.message,duration:o}),{success:!1,error:i.message,duration:o,timestamp:new Date().toISOString()})}}completeWarmup(){this.isWarming=!1;const e={total:this.warmupAttempts,successful:this.successfulWarmups,failed:this.warmupAttempts-this.successfulWarmups,results:this.warmupResults};p.info("API warmup process completed",{category:"WARMUP",summary:e}),typeof window!="undefined"&&window.dispatchEvent(new CustomEvent("api-warmup-complete",{detail:e}))}getWarmupStatus(){return{isWarming:this.isWarming,attempts:this.warmupAttempts,successful:this.successfulWarmups,results:this.warmupResults}}async warmupCriticalAPIs(){const e=["authentication","comaIch","limitedIch"];p.info("Starting critical API warmup",{category:"WARMUP",apis:e});const t={};for(const r of e)Pe[r]&&(t[r]=await this.warmupSingleAPI(r,Pe[r],St[r]));return p.info("Critical API warmup completed",{category:"WARMUP",results:t}),t}}const Et=new Ra;async function Gt(a={}){const{background:e=!0,criticalOnly:t=!1}=a;try{return t?await Et.warmupCriticalAPIs():await Et.warmupAllAPIs(e)}catch(r){return p.error("API warmup initialization failed",{category:"WARMUP",error:r.message}),{error:r.message}}}typeof window!="undefined"&&setTimeout(()=>{Gt({background:!0,criticalOnly:!1})},1e3);const Pa={BASE_URL:"/0925/",DEV:!0,MODE:"production",PROD:!1,SSR:!1,VITE_USER_NODE_ENV:"development"};let z=null;async function jt(){return v(async()=>{z=await _a(),setTimeout(()=>{Gt({background:!0,criticalOnly:!1}).then(t=>{console.info("[Main] API warmup started:",t.status||"completed")}).catch(t=>{console.warn("[Main] API warmup failed:",t.message)})},2e3);const a=z.getStatus(),e=new CustomEvent("appInitialized",{detail:{timestamp:new Date().toISOString(),status:a,version:"2.1.0",build:"production"}});return document.dispatchEvent(e),document.querySelectorAll(".bar-fill").forEach(t=>{const r=t.getAttribute("data-width");t.style.width=`${r}%`}),z},a=>{throw Na(a),a})}function Na(a){const e=document.getElementById("appContainer");e&&(e.innerHTML=`
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
          Error: ${a.message||"Unknown initialization error"}
        </small>
      </div>
    `);const t=new CustomEvent("appInitializationFailed",{detail:{error:a.message,timestamp:new Date().toISOString(),userAgent:navigator.userAgent.substring(0,100)}});document.dispatchEvent(t)}function Tt(){if(z)try{z.destroy()}catch(a){}}function Da(){document.addEventListener("visibilitychange",()=>{z&&document.visibilityState==="visible"&&(z.getStatus().isAuthenticated||window.location.reload())}),window.addEventListener("beforeunload",Tt),window.addEventListener("unload",Tt)}async function At(){try{try{if(["localhost","127.0.0.1","0.0.0.0"].includes(window.location.hostname)&&!(import.meta&&Pa)&&"serviceWorker"in navigator){const t=await navigator.serviceWorker.getRegistrations();for(const r of t)try{await r.unregister()}catch(s){console.warn("[Main] Failed to unregister service worker:",r)}window.addEventListener("beforeinstallprompt",r=>{r.preventDefault()})}}catch(e){console.warn("[Main] Service worker cleanup failed")}Da(),await jt();const a=new CustomEvent("appReady",{detail:{timestamp:new Date().toISOString(),version:"2.1.0"}});document.dispatchEvent(a)}catch(a){}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",At):At();typeof window!="undefined"&&(window.iGFAPApp={getApp:()=>z,getStatus:()=>(z==null?void 0:z.getStatus())||{error:"App not initialized"},restart:async()=>(z&&z.destroy(),jt()),getCurrentScreen:()=>{try{return g.getState().currentScreen}catch(a){return"unknown"}},forceResults:()=>{try{g.navigate("results");const a=document.getElementById("appContainer");return a&&ue(a),!0}catch(a){return!1}}});function Oa({percent:a=0,level:e="normal"}){const s=2*Math.PI*50,i=s-a/100*s,o=e==="critical"?"#DC2626":e==="high"?"#F59E0B":"#2563EB";return $.createElement("div",{className:"relative w-28 h-28 flex items-center justify-center"},$.createElement("svg",{className:"w-full h-full transform -rotate-90",viewBox:"0 0 120 120"},$.createElement("circle",{cx:"60",cy:"60",r:50,stroke:"rgba(0,0,0,0.1)",strokeWidth:8,fill:"none"}),$.createElement("circle",{cx:"60",cy:"60",r:50,stroke:o,strokeWidth:8,strokeDasharray:s,strokeDashoffset:i,strokeLinecap:"round",fill:"none",className:"transition-all duration-700 ease-out"})),$.createElement("div",{className:"absolute text-center"},$.createElement("span",{className:"text-2xl font-bold text-gray-800 dark:text-gray-100"},Math.round(a),"%")))}function za({lvoProb:a=0,ichProb:e=0,title:t="Decision Support – LVO/ICH"}){const r=nt.useRef(null),s=Math.abs(a-e),i=Math.max(a,e);let o=s<10?Math.round(30+i*.3):s<20?Math.round(50+i*.4):Math.round(70+i*.3);return o=Math.max(0,Math.min(100,o)),nt.useEffect(()=>{const c=r.current;if(!c)return;const n=c.getContext("2d");let u=null,d=.5;const x=Math.max(e,.5),C=a/x,H=Math.max(.5,Math.min(2,C)),Q=(Math.log2(H)+1)/2,he=1e4,ne=()=>{const oe=window.devicePixelRatio||1,we=c.getBoundingClientRect(),pe=Math.max(1,we.width||300),X=Math.max(1,we.height||200),Se=Math.min(he,Math.floor(pe*oe)),Ee=Math.min(he,Math.floor(X*oe));(c.width!==Se||c.height!==Ee)&&(c.width=Se,c.height=Ee,n.setTransform(1,0,0,1,0,0),n.scale(oe,oe));const W=pe,ee=X,G=W<480,Je=W>=480&&W<1024,te=G?12:Je?14:16,$e=15,Yt=W/2-$e-te/2,Ze=ee/2-$e-te/2,Qt=Je?Math.min(Ze,ee*.42):Ze,T=Math.max(10,Math.min(Yt,Qt)),h=W/2,k=ee-($e+te/2+T);n.clearRect(0,0,W,ee);const N=document.body.classList.contains("dark-mode"),Xe={day:{bezel:"#e8eaed",bezelShadow:"#c1c7cd",track:"#f5f7fa",ich:"#8b1538",lvo:"#1e3a5f",neutral:"#6b7280",needle:"#d4af37",text:"#374151",tickMajor:"#4b5563",tickMinor:"#9ca3af"},night:{bezel:"#2d3036",bezelShadow:"#1a1d23",track:"#383c42",ich:"#dc2626",lvo:"#3b82f6",neutral:"#64748b",needle:"#fbbf24",text:"#f3f4f6",tickMajor:"#d1d5db",tickMinor:"#6b7280"}},L=N?Xe.night:Xe.day,fe=n.createLinearGradient(h-T,k-T,h+T,k+T);fe.addColorStop(0,L.bezel),fe.addColorStop(.3,L.bezelShadow),fe.addColorStop(.7,L.bezel),fe.addColorStop(1,L.bezelShadow),n.strokeStyle=fe,n.lineWidth=te+4,n.lineCap="round",n.beginPath(),n.arc(h,k,T+2,0,Math.PI,!1),n.stroke(),n.strokeStyle=L.track,n.lineWidth=te,n.beginPath(),n.arc(h,k,T,0,Math.PI,!1),n.stroke();const Fe=60,et=Math.PI/Fe;for(let I=0;I<Fe;I++){const M=I/(Fe-1),A=I*et,D=Math.min((I+1)*et,Math.PI);let _,ye,Ge;if(M<=.5){const le=M*2;_=Math.round(0+242*le),ye=Math.round(154+66*le),Ge=Math.round(255*(1-le))}else{const le=(M-.5)*2;_=Math.round(242+13*le),ye=Math.round(220*(1-le)),Ge=Math.round(0)}const rr=`rgba(${_}, ${ye}, ${Ge}, 0.85)`;n.strokeStyle=rr,n.lineWidth=Math.max(1,te-4),n.beginPath(),n.arc(h,k,T,A,D,!1),n.stroke()}const Jt=[.5,.75,1,1.5,2],Zt=G?[]:[.6,.9,1.2,1.8];Jt.forEach(I=>{const M=(Math.log2(I)+1)/2,A=Math.PI-M*Math.PI,D=T-12,_=T-24;n.strokeStyle=L.tickMajor,n.lineWidth=1.5,n.lineCap="round",n.beginPath(),n.moveTo(h+Math.cos(A)*D,k+Math.sin(A)*D),n.lineTo(h+Math.cos(A)*_,k+Math.sin(A)*_),n.stroke(),n.fillStyle=L.text;const ye=G?13:15;n.font=`600 ${ye}px "SF Pro Display", system-ui, sans-serif`,n.textAlign="center",n.textBaseline="middle",n.fillText(I.toFixed(1),h+Math.cos(A)*(T-35),k+Math.sin(A)*(T-35))}),Zt.forEach(I=>{const M=(Math.log2(I)+1)/2,A=Math.PI-M*Math.PI,D=T-8,_=T-16;n.strokeStyle=L.tickMinor,n.lineWidth=.8,n.lineCap="round",n.beginPath(),n.moveTo(h+Math.cos(A)*D,k+Math.sin(A)*D),n.lineTo(h+Math.cos(A)*_,k+Math.sin(A)*_),n.stroke()}),[{val:.77,label:"ICH",side:"left"},{val:1.3,label:"LVO",side:"right"}].forEach(I=>{const M=(Math.log2(I.val)+1)/2,A=Math.PI-M*Math.PI,D=T-2,_=T+12;n.strokeStyle=I.side==="left"?L.ich:L.lvo,n.lineWidth=2,n.setLineDash([3,2]),n.beginPath(),n.moveTo(h+Math.cos(A)*D,k+Math.sin(A)*D),n.lineTo(h+Math.cos(A)*_,k+Math.sin(A)*_),n.stroke(),n.setLineDash([])});const Xt=G?15:17,Te=G?T+35:T+42;n.fillStyle=N?"#ff4444":"#ff0000",n.font=`700 ${Xt}px "SF Pro Display", system-ui, sans-serif`,n.textAlign="center",n.textBaseline="middle",N&&(n.shadowColor="rgba(0,0,0,0.8)",n.shadowBlur=3,n.shadowOffsetY=1),n.fillText("ICH",h+Math.cos(Math.PI)*Te,k+Math.sin(Math.PI)*Te-10),n.fillStyle=N?"#4499ff":"#0099ff",n.fillText("LVO",h+Math.cos(0)*Te,k+Math.sin(0)*Te-10),n.shadowBlur=0,n.shadowOffsetY=0,d+=(Q-d)*.12;const J=Math.PI-d*Math.PI,re=Math.max(0,T-te/2-6),tt=(1-o/100)*(Math.PI*.05);n.save(),n.globalAlpha=N?.2:.25,n.fillStyle=L.neutral,n.beginPath(),n.moveTo(h,k),n.arc(h,k,re*.85,J-tt,J+tt,!1),n.closePath(),n.fill(),n.restore();const B=L.needle,er=performance.now(),Ae=n.createLinearGradient(h,k,h+Math.cos(J)*re,k+Math.sin(J)*re);Ae.addColorStop(0,B+"ff"),Ae.addColorStop(.7,B+"dd"),Ae.addColorStop(1,B+"bb"),n.strokeStyle=Ae,n.lineWidth=2.5,n.lineCap="round",n.shadowColor=N?"rgba(0,0,0,0.8)":"rgba(0,0,0,0.3)",n.shadowBlur=4,n.shadowOffsetY=2,n.beginPath(),n.moveTo(h,k),n.lineTo(h+Math.cos(J)*re,k+Math.sin(J)*re),n.stroke(),n.shadowBlur=0,n.shadowOffsetY=0;const He=h+Math.cos(J)*re,Be=k+Math.sin(J)*re,Ce=.6+.4*Math.sin(er*.006),Ve=3+Ce*2;n.save(),n.globalAlpha=.15+Ce*.25,n.fillStyle=B,n.beginPath(),n.arc(He,Be,Ve*3.5,0,Math.PI*2),n.fill(),n.restore(),n.save(),n.globalAlpha=.4+Ce*.3,n.fillStyle=B,n.beginPath(),n.arc(He,Be,Ve*1.8,0,Math.PI*2),n.fill(),n.restore(),n.fillStyle=B,n.shadowColor=B,n.shadowBlur=4+Ce*6,n.beginPath(),n.arc(He,Be,Ve,0,Math.PI*2),n.fill(),n.shadowBlur=0;const Ue=14,rt=8,Ie=n.createRadialGradient(h,k,0,h,k,Ue);Ie.addColorStop(0,N?"#4a5568":"#718096"),Ie.addColorStop(.7,N?"#2d3748":"#4a5568"),Ie.addColorStop(1,N?"#1a202c":"#2d3748"),n.fillStyle=Ie,n.beginPath(),n.arc(h,k,Ue,0,Math.PI*2),n.fill();const We=n.createRadialGradient(h,k,0,h,k,rt);We.addColorStop(0,B+"aa"),We.addColorStop(1,B+"44"),n.fillStyle=We,n.beginPath(),n.arc(h,k,rt,0,Math.PI*2),n.fill(),n.strokeStyle=B,n.lineWidth=1,n.beginPath(),n.arc(h,k,Ue-1,0,Math.PI*2),n.stroke();const tr=G?18:22,at=k-T*.65,st=G?60:80,it=G?24:30;n.save(),n.globalAlpha=N?.9:.95,n.fillStyle=N?"#1f2937":"#ffffff",n.shadowColor=N?"rgba(0,0,0,0.5)":"rgba(0,0,0,0.2)",n.shadowBlur=8,n.shadowOffsetY=2,n.fillRect(h-st/2,at-it/2,st,it),n.restore(),n.fillStyle=L.text,n.font=`700 ${tr}px "SF Mono", ui-monospace, monospace`,n.textAlign="center",n.textBaseline="middle",n.fillText(H.toFixed(2),h,at);{const I=k-T*.25,M=Math.min(120,T*1.2),A=Math.max(3,Math.min(6,T*.06));n.fillStyle=N?"#374151":"#e5e7eb",n.fillRect(h-M/2,I,M,A);const D=o/100*M,_=n.createLinearGradient(h-M/2,I,h-M/2+D,I);_.addColorStop(0,L.neutral),_.addColorStop(1,L.needle),n.fillStyle=_,n.fillRect(h-M/2,I,D,A),n.fillStyle=L.text,n.font=`500 ${G?10:12}px "SF Pro Display", system-ui, sans-serif`,n.textAlign="center",n.fillText(`${o}% confidence`,h,I-8)}u=requestAnimationFrame(ne)};return ne(),()=>{u&&cancelAnimationFrame(u)}},[a,e]),$.createElement("div",{className:"relative flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-900  w-full max-w-[420px] aspect-[16/9]","data-react-tachometer":!0,"aria-label":t},$.createElement("div",{className:"w-full h-full flex items-center justify-center"},$.createElement("canvas",{ref:r,className:"w-full h-full block"})))}function $a(){document.querySelectorAll("[data-react-ring]").forEach(a=>{if(a.__mounted)return;const e=parseFloat(a.getAttribute("data-percent"))||0,t=a.getAttribute("data-level")||"normal",r=ot(a);r.render($.createElement(Oa,{percent:e,level:t})),a.__mounted=!0,a.__root=r}),document.querySelectorAll("[data-react-tachometer]").forEach(a=>{if(a.__mounted)return;const e=parseFloat(a.getAttribute("data-ich"))||0,t=parseFloat(a.getAttribute("data-lvo"))||0,r=a.getAttribute("data-title")||"Decision Support – LVO/ICH",s=ot(a);s.render($.createElement(za,{ichProb:e,lvoProb:t,title:r})),a.__mounted=!0,a.__root=s})}const Fa=Object.freeze(Object.defineProperty({__proto__:null,mountIslands:$a},Symbol.toStringTag,{value:"Module"}));class ge{constructor(e,t,r={}){this.name=e,this.description=t,this.metadata={...r,id:`cmd_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,timestamp:new Date().toISOString()},this.executed=!1,this.undone=!1}async execute(){if(this.executed&&!this.undone)throw new Error(`Command ${this.name} has already been executed`);try{y.publish(b.AUDIT_EVENT,{action:"command_execute_start",command:this.name,commandId:this.metadata.id});const e=await this.doExecute();return this.executed=!0,this.undone=!1,y.publish(b.AUDIT_EVENT,{action:"command_execute_success",command:this.name,commandId:this.metadata.id}),e}catch(e){throw y.publish(b.AUDIT_EVENT,{action:"command_execute_error",command:this.name,commandId:this.metadata.id,error:e.message}),e}}async undo(){if(!this.executed||this.undone)throw new Error(`Command ${this.name} cannot be undone`);try{y.publish(b.AUDIT_EVENT,{action:"command_undo_start",command:this.name,commandId:this.metadata.id});const e=await this.doUndo();return this.undone=!0,y.publish(b.AUDIT_EVENT,{action:"command_undo_success",command:this.name,commandId:this.metadata.id}),e}catch(e){throw y.publish(b.AUDIT_EVENT,{action:"command_undo_error",command:this.name,commandId:this.metadata.id,error:e.message}),e}}async doExecute(){throw new Error("doExecute() must be implemented by concrete command")}async doUndo(){throw new Error("doUndo() must be implemented by concrete command")}canUndo(){return this.executed&&!this.undone}getSummary(){return{name:this.name,description:this.description,id:this.metadata.id,timestamp:this.metadata.timestamp,executed:this.executed,undone:this.undone}}}class Ha extends ge{constructor(e,t,r,s){super("UPDATE_PATIENT_DATA",`Update ${e} from ${r} to ${t}`,{fieldName:e,newValue:t,previousValue:r}),this.fieldName=e,this.newValue=t,this.previousValue=r,this.store=s}async doExecute(){const e=this.store.getFormData("current")||{};return e[this.fieldName]=this.newValue,this.store.setFormData("current",e),y.publish(b.PATIENT_DATA_UPDATED,{field:this.fieldName,newValue:this.newValue,previousValue:this.previousValue}),{field:this.fieldName,value:this.newValue}}async doUndo(){const e=this.store.getFormData("current")||{};return this.previousValue===null||this.previousValue===void 0?delete e[this.fieldName]:e[this.fieldName]=this.previousValue,this.store.setFormData("current",e),y.publish(b.PATIENT_DATA_UPDATED,{field:this.fieldName,newValue:this.previousValue,previousValue:this.newValue,action:"undo"}),{field:this.fieldName,value:this.previousValue}}}class Ba extends ge{constructor(e,t,r){super("NAVIGATE",`Navigate from ${t} to ${e}`,{targetScreen:e,sourceScreen:t}),this.targetScreen=e,this.sourceScreen=t,this.store=r}async doExecute(){return this.store.navigate(this.targetScreen),y.publish(b.NAVIGATION_CHANGED,{from:this.sourceScreen,to:this.targetScreen}),{from:this.sourceScreen,to:this.targetScreen}}async doUndo(){return this.store.navigate(this.sourceScreen),y.publish(b.NAVIGATION_CHANGED,{from:this.targetScreen,to:this.sourceScreen,action:"undo"}),{from:this.targetScreen,to:this.sourceScreen}}}class Va extends ge{constructor(e,t,r){super("SUBMIT_FORM",`Submit ${t} form for prediction`,{moduleType:t,formFields:Object.keys(e)}),this.formData={...e},this.moduleType=t,this.predictionStrategy=r,this.results=null}async doExecute(){return this.predictionStrategy.setStrategy(this.getStrategyName()),this.results=await this.predictionStrategy.predict(this.formData),y.publish(b.FORM_SUBMITTED,{moduleType:this.moduleType,fieldsCount:Object.keys(this.formData).length,success:!0}),this.results}async doUndo(){return this.results=null,y.publish(b.FORM_SUBMITTED,{moduleType:this.moduleType,action:"undo"}),null}getStrategyName(){switch(this.moduleType){case"coma":return"COMA_ICH";case"limited":return"LIMITED_DATA_ICH";case"full":return"FULL_STROKE";default:throw new Error(`Unknown module type: ${this.moduleType}`)}}}class Ua extends ge{constructor(e,t){super("CLEAR_DATA",`Clear ${e} data for privacy compliance`,{dataType:e}),this.dataType=e,this.store=t,this.backupData=null}async doExecute(){switch(this.backupData=this.store.getState(),this.dataType){case"all":this.store.reset();break;case"forms":this.store.clearFormData();break;case"results":this.store.clearResults();break;default:throw new Error(`Unknown data type: ${this.dataType}`)}return y.publish(b.AUDIT_EVENT,{action:"data_cleared",dataType:this.dataType}),{dataType:this.dataType,cleared:!0}}async doUndo(){if(this.backupData)return this.store.setState(this.backupData),y.publish(b.AUDIT_EVENT,{action:"data_restored",dataType:this.dataType}),{dataType:this.dataType,restored:!0};throw new Error("Cannot undo data clear: backup not available")}}class qt{constructor(){this.commandHistory=[],this.currentIndex=-1,this.maxHistorySize=100}async executeCommand(e){if(!(e instanceof ge))throw new Error("Command must extend MedicalCommand");const t=await e.execute();return this.commandHistory=this.commandHistory.slice(0,this.currentIndex+1),this.commandHistory.push(e),this.currentIndex=this.commandHistory.length-1,this.commandHistory.length>this.maxHistorySize&&(this.commandHistory.shift(),this.currentIndex-=1),t}async undo(){if(this.currentIndex<0)throw new Error("No commands to undo");const e=this.commandHistory[this.currentIndex];if(!e.canUndo())throw new Error(`Command ${e.name} cannot be undone`);const t=await e.undo();return this.currentIndex-=1,t}async redo(){if(this.currentIndex>=this.commandHistory.length-1)throw new Error("No commands to redo");return this.currentIndex+=1,await this.commandHistory[this.currentIndex].execute()}canUndo(){return this.currentIndex>=0&&this.commandHistory[this.currentIndex]&&this.commandHistory[this.currentIndex].canUndo()}canRedo(){return this.currentIndex<this.commandHistory.length-1}getCommandHistory(){return this.commandHistory.map(e=>e.getSummary())}clearHistory(){this.commandHistory=[],this.currentIndex=-1}getStats(){return{totalCommands:this.commandHistory.length,currentIndex:this.currentIndex,canUndo:this.canUndo(),canRedo:this.canRedo(),executedCommands:this.currentIndex+1}}}const Wa=new qt,Ga=Object.freeze(Object.defineProperty({__proto__:null,ClearDataCommand:Ua,MedicalCommand:ge,MedicalCommandInvoker:qt,NavigationCommand:Ba,SubmitFormCommand:Va,UpdatePatientDataCommand:Ha,medicalCommandInvoker:Wa},Symbol.toStringTag,{value:"Module"}));class ze{constructor(e,t){this.name=e,this.description=t,this.requiredFields=[],this.optionalFields=[]}validateInput(e){const t=[],r=[];return this.requiredFields.forEach(s=>{(!(s in e)||e[s]===null||e[s]===void 0)&&r.push(s)}),r.length>0&&t.push(`Missing required fields: ${r.join(", ")}`),{isValid:t.length===0,errors:t,missingFields:r}}preprocessInput(e){return{...e}}async predict(e){throw new Error("predict() method must be implemented by concrete strategy")}postprocessResult(e,t){return{...e,strategy:this.name,timestamp:new Date().toISOString(),inputSummary:this.createInputSummary(t)}}createInputSummary(e){const t={};return[...this.requiredFields,...this.optionalFields].forEach(r=>{r in e&&(t[r]=typeof e[r])}),t}}class ja extends ze{constructor(){super("COMA_ICH","ICH prediction for comatose patients"),this.requiredFields=["gfap"],this.optionalFields=["age","symptoms_duration"]}preprocessInput(e){return{gfap:parseFloat(e.gfap),patientType:"comatose"}}async predict(e){const t=this.validateInput(e);if(!t.isValid)throw new Error(`Validation failed: ${t.errors.join(", ")}`);const r=this.preprocessInput(e);y.publish(b.ASSESSMENT_STARTED,{strategy:this.name,inputFields:Object.keys(r)});try{const s=await Lt(r),i=this.postprocessResult(s,e);return y.publish(b.RESULTS_GENERATED,{strategy:this.name,success:!0,confidence:i.confidence}),i}catch(s){throw y.publish(b.SECURITY_EVENT,{type:"prediction_error",strategy:this.name,error:s.message}),s}}}class qa extends ze{constructor(){super("LIMITED_DATA_ICH","ICH prediction with limited clinical data"),this.requiredFields=["gfap","age","systolic_bp","diastolic_bp"],this.optionalFields=["weakness_sudden","speech_sudden","vigilanzminderung"]}preprocessInput(e){return{gfap:parseFloat(e.gfap),age:parseInt(e.age,10),systolic_bp:parseFloat(e.systolic_bp),diastolic_bp:parseFloat(e.diastolic_bp),weakness_sudden:e.weakness_sudden===!0||e.weakness_sudden==="true",speech_sudden:e.speech_sudden===!0||e.speech_sudden==="true",vigilanzminderung:e.vigilanzminderung===!0||e.vigilanzminderung==="true"}}async predict(e){const t=this.validateInput(e);if(!t.isValid)throw new Error(`Validation failed: ${t.errors.join(", ")}`);const r=this.preprocessInput(e);y.publish(b.ASSESSMENT_STARTED,{strategy:this.name,inputFields:Object.keys(r)});try{const s=await It(r),i=this.postprocessResult(s,e);return y.publish(b.RESULTS_GENERATED,{strategy:this.name,success:!0,confidence:i.confidence}),i}catch(s){throw y.publish(b.SECURITY_EVENT,{type:"prediction_error",strategy:this.name,error:s.message}),s}}}class Ka extends ze{constructor(){super("FULL_STROKE","Comprehensive stroke prediction with full clinical data"),this.requiredFields=["gfap","age","systolic_bp","diastolic_bp","fast_ed_score","sex","facialtwitching","armparese","speechdeficit","gaze","agitation"],this.optionalFields=["strokeOnsetKnown","medical_history"]}preprocessInput(e){return{gfap:parseFloat(e.gfap),age:parseInt(e.age,10),systolic_bp:parseFloat(e.systolic_bp),diastolic_bp:parseFloat(e.diastolic_bp),fast_ed_score:parseInt(e.fast_ed_score,10),sex:e.sex==="male"?1:0,facialtwitching:e.facialtwitching===!0||e.facialtwitching==="true",armparese:e.armparese===!0||e.armparese==="true",speechdeficit:e.speechdeficit===!0||e.speechdeficit==="true",gaze:e.gaze===!0||e.gaze==="true",agitation:e.agitation===!0||e.agitation==="true",strokeOnsetKnown:e.strokeOnsetKnown===!0||e.strokeOnsetKnown==="true"}}async predict(e){const t=this.validateInput(e);if(!t.isValid)throw new Error(`Validation failed: ${t.errors.join(", ")}`);const r=this.preprocessInput(e);y.publish(b.ASSESSMENT_STARTED,{strategy:this.name,inputFields:Object.keys(r)});try{const s=await Ct(r),i=this.postprocessResult(s,e);return y.publish(b.RESULTS_GENERATED,{strategy:this.name,success:!0,confidence:i.confidence}),i}catch(s){throw y.publish(b.SECURITY_EVENT,{type:"prediction_error",strategy:this.name,error:s.message}),s}}}class Kt{constructor(){this.strategies=new Map,this.currentStrategy=null,this.predictionHistory=[],this.registerStrategy(new ja),this.registerStrategy(new qa),this.registerStrategy(new Ka)}registerStrategy(e){if(!(e instanceof ze))throw new Error("Strategy must extend PredictionStrategy");this.strategies.set(e.name,e)}setStrategy(e){const t=this.strategies.get(e);if(!t)throw new Error(`Unknown strategy: ${e}`);this.currentStrategy=t}async predict(e){if(!this.currentStrategy)throw new Error("No prediction strategy selected");const t=performance.now();try{const r=await this.currentStrategy.predict(e),s=performance.now()-t;return this.predictionHistory.push({strategy:this.currentStrategy.name,timestamp:new Date().toISOString(),duration:s,success:!0}),r}catch(r){const s=performance.now()-t;throw this.predictionHistory.push({strategy:this.currentStrategy.name,timestamp:new Date().toISOString(),duration:s,success:!1,error:r.message}),r}}getAvailableStrategies(){return Array.from(this.strategies.keys())}getStrategyInfo(e){const t=this.strategies.get(e);return t?{name:t.name,description:t.description,requiredFields:t.requiredFields,optionalFields:t.optionalFields}:null}getPredictionHistory(){return[...this.predictionHistory]}clearHistory(){this.predictionHistory=[]}}const Ya=new Kt,Qa={COMA_ICH:"COMA_ICH",LIMITED_DATA_ICH:"LIMITED_DATA_ICH",FULL_STROKE:"FULL_STROKE"},Ja=Object.freeze(Object.defineProperty({__proto__:null,PREDICTION_STRATEGIES:Qa,PredictionContext:Kt,predictionContext:Ya},Symbol.toStringTag,{value:"Module"}));class Za{constructor(e,t=!1){this.name=e,this.required=t,this.validators=[],this.medicalChecks=[]}addValidator(e){return this.validators.push(e),this}addMedicalCheck(e){return this.medicalChecks.push(e),this}validate(e,t=null){const r=[];this.required&&!e&&e!==0&&r.push("This field is required");for(const s of this.validators){const i=s(e);i&&r.push(i)}for(const s of this.medicalChecks){const i=s(e,t);i&&r.push(i)}return r}toConfig(){return{required:this.required,validate:(e,t)=>this.validate(e,t)}}}class ke extends Za{constructor(e,t=!1,r=null,s=null){super(e,t),this.min=r,this.max=s,this.type="number",r!==null&&this.addValidator(i=>i!==""&&!isNaN(i)&&parseFloat(i)<r?`Value must be at least ${r}`:null),s!==null&&this.addValidator(i=>i!==""&&!isNaN(i)&&parseFloat(i)>s?`Value must be at most ${s}`:null)}toConfig(){return{...super.toConfig(),min:this.min,max:this.max,type:this.type}}}class Xa extends ke{constructor(e,t,r){super(e,!0,r.min,r.max),this.biomarkerType=t,this.ranges=r,this.addMedicalCheck(s=>{const i=parseFloat(s);return isNaN(i)?null:t==="GFAP"&&i>r.critical?"Extremely high GFAP value - please verify lab result":null})}}class es extends ke{constructor(e,t,r,s){super(e,!0,r,s),this.vitalType=t,this.addMedicalCheck((i,o)=>{const c=parseFloat(i);if(isNaN(c))return null;switch(t){case"SYSTOLIC_BP":if(o!=null&&o.diastolic_bp){const n=parseFloat(o.diastolic_bp);if(!isNaN(n)&&c<=n)return"Systolic BP must be higher than diastolic BP"}break;case"DIASTOLIC_BP":if(o!=null&&o.systolic_bp){const n=parseFloat(o.systolic_bp);if(!isNaN(n)&&c>=n)return"Diastolic BP must be lower than systolic BP"}break}return null})}}class ts extends ke{constructor(e){super(e,!0,0,120),this.addMedicalCheck(t=>{const r=parseFloat(t);return isNaN(r)?null:r<18?"Emergency stroke assessment typically for adults (≥18 years)":null})}}class rs extends ke{constructor(e,t,r,s){super(e,!0,r,s),this.scaleType=t,this.addMedicalCheck(i=>{const o=parseFloat(i);if(isNaN(o))return null;switch(t){case"GCS":if(o<8)return"GCS < 8 indicates severe consciousness impairment - consider coma module";break;case"FAST_ED":if(o>=4)return"High FAST-ED score suggests LVO - consider urgent intervention";break}return null})}}class as{static createRule(e,t,r={}){switch(e){case"AGE":return new ts(t);case"BIOMARKER":if(r.biomarkerType==="GFAP")return new Xa(t,"GFAP",F);throw new Error(`Unsupported biomarker type: ${r.biomarkerType}`);case"VITAL_SIGN":return new es(t,r.vitalType,r.min,r.max);case"CLINICAL_SCALE":return new rs(t,r.scaleType,r.min,r.max);case"NUMERIC":return new ke(t,r.required,r.min,r.max);default:throw new Error(`Unsupported validation rule type: ${e}`)}}static createModuleValidation(e){const t={};switch(e){case"LIMITED":t.age_years=this.createRule("AGE","age_years").toConfig(),t.systolic_bp=this.createRule("VITAL_SIGN","systolic_bp",{vitalType:"SYSTOLIC_BP",min:60,max:300}).toConfig(),t.diastolic_bp=this.createRule("VITAL_SIGN","diastolic_bp",{vitalType:"DIASTOLIC_BP",min:30,max:200}).toConfig(),t.gfap_value=this.createRule("BIOMARKER","gfap_value",{biomarkerType:"GFAP"}).toConfig();break;case"FULL":Object.assign(t,this.createModuleValidation("LIMITED")),t.fast_ed_score=this.createRule("CLINICAL_SCALE","fast_ed_score",{scaleType:"FAST_ED",min:0,max:9}).toConfig();break;case"COMA":t.gfap_value=this.createRule("BIOMARKER","gfap_value",{biomarkerType:"GFAP"}).toConfig(),t.gcs=this.createRule("CLINICAL_SCALE","gcs",{scaleType:"GCS",min:3,max:15}).toConfig();break;default:throw new Error(`Unsupported module type: ${e}`)}return t}static validateModule(e,t){const r=this.createModuleValidation(t),s={};let i=!0;return Object.entries(r).forEach(([o,c])=>{const n=e[o],u=c.validate(n,e);u.length>0&&(s[o]=u,i=!1)}),{isValid:i,validationErrors:s}}}const ss={AGE:"AGE",BIOMARKER:"BIOMARKER",VITAL_SIGN:"VITAL_SIGN",CLINICAL_SCALE:"CLINICAL_SCALE",NUMERIC:"NUMERIC"},is={GFAP:"GFAP"},ns={SYSTOLIC_BP:"SYSTOLIC_BP",DIASTOLIC_BP:"DIASTOLIC_BP"},os={GCS:"GCS",FAST_ED:"FAST_ED"},ls=Object.freeze(Object.defineProperty({__proto__:null,BIOMARKER_TYPES:is,CLINICAL_SCALE_TYPES:os,MedicalValidationFactory:as,VALIDATION_RULE_TYPES:ss,VITAL_SIGN_TYPES:ns},Symbol.toStringTag,{value:"Module"}));export{Me as A,Xr as C,ce as D,w as E,f as L,R as M,Rs as R,vs as V,E as a,Ps as b,$t as c,xs as g,p as m,Ns as p,ks as r,v as s,l as t};
//# sourceMappingURL=index-bLHn9iqQ.js.map
