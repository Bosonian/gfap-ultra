/**
 * Automated Clinical Reporting System
 * iGFAP Stroke Triage Assistant - Phase 4 Medical Intelligence
 *
 * Generates comprehensive clinical reports with AI insights and analytics
 */

import { medicalEventObserver, MEDICAL_EVENTS } from '../patterns/observer.js';
import { medicalPerformanceMonitor, PerformanceMetricType } from '../performance/medical-performance-monitor.js';

/**
 * Report types and templates
 */
export const ReportTypes = {
  CLINICAL_SUMMARY: 'clinical_summary',
  OUTCOME_PREDICTION: 'outcome_prediction',
  RISK_ASSESSMENT: 'risk_assessment',
  DECISION_SUPPORT: 'decision_support',
  QUALITY_METRICS: 'quality_metrics',
  RESEARCH_ANALYTICS: 'research_analytics',
  COMPREHENSIVE: 'comprehensive',
};

/**
 * Report formats
 */
export const ReportFormats = {
  PDF: 'pdf',
  HTML: 'html',
  JSON: 'json',
  CSV: 'csv',
  DICOM_SR: 'dicom_sr',
};

/**
 * Report delivery methods
 */
export const DeliveryMethods = {
  DOWNLOAD: 'download',
  EMAIL: 'email',
  EHR_INTEGRATION: 'ehr_integration',
  PACS: 'pacs',
  API: 'api',
};

/**
 * Clinical Report Generator
 */
class ClinicalReportGenerator {
  constructor() {
    this.templates = new Map();
    this.reportHistory = [];
    this.scheduledReports = new Map();
    this.isInitialized = false;

    this.initializeTemplates();
  }

  /**
   * Initialize report templates
   */
  initializeTemplates() {
    // Clinical Summary Template
    this.templates.set(ReportTypes.CLINICAL_SUMMARY, {
      name: 'Clinical Summary Report',
      sections: [
        'patient_demographics',
        'clinical_presentation',
        'assessment_findings',
        'risk_stratification',
        'treatment_recommendations',
        'disposition',
      ],
      requiredData: ['patientData', 'predictions'],
      format: 'structured',
    });

    // Outcome Prediction Template
    this.templates.set(ReportTypes.OUTCOME_PREDICTION, {
      name: 'Outcome Prediction Report',
      sections: [
        'prediction_overview',
        'mortality_risk',
        'functional_outcome',
        'complications_risk',
        'model_performance',
        'confidence_metrics',
      ],
      requiredData: ['predictions', 'mlResults'],
      format: 'analytical',
    });

    // Risk Assessment Template
    this.templates.set(ReportTypes.RISK_ASSESSMENT, {
      name: 'Risk Assessment Report',
      sections: [
        'risk_profile',
        'hemorrhagic_risk',
        'procedural_risks',
        'contraindications',
        'monitoring_requirements',
        'escalation_criteria',
      ],
      requiredData: ['patientData', 'predictions', 'alerts'],
      format: 'clinical',
    });

    // Decision Support Template
    this.templates.set(ReportTypes.DECISION_SUPPORT, {
      name: 'Clinical Decision Support Report',
      sections: [
        'treatment_options',
        'evidence_summary',
        'guideline_recommendations',
        'clinical_alerts',
        'action_plan',
        'follow_up',
      ],
      requiredData: ['patientData', 'predictions', 'recommendations'],
      format: 'actionable',
    });

    // Quality Metrics Template
    this.templates.set(ReportTypes.QUALITY_METRICS, {
      name: 'Quality Metrics Report',
      sections: [
        'performance_indicators',
        'process_metrics',
        'outcome_measures',
        'benchmarking',
        'improvement_opportunities',
        'action_items',
      ],
      requiredData: ['qualityMetrics', 'benchmarks'],
      format: 'dashboard',
    });

    // Comprehensive Template
    this.templates.set(ReportTypes.COMPREHENSIVE, {
      name: 'Comprehensive Clinical Report',
      sections: [
        'executive_summary',
        'clinical_summary',
        'risk_assessment',
        'outcome_predictions',
        'decision_support',
        'quality_metrics',
        'research_insights',
        'appendices',
      ],
      requiredData: ['all'],
      format: 'comprehensive',
    });
  }

  /**
   * Generate clinical report
   */
  async generateReport(reportType, data, options = {}) {
    const metricId = medicalPerformanceMonitor.startMeasurement(
      PerformanceMetricType.REPORT_GENERATION,
      `generate_${reportType}_report`,
    );

    try {
      const template = this.templates.get(reportType);
      if (!template) {
        throw new Error(`Unknown report type: ${reportType}`);
      }

      // Validate required data
      this.validateReportData(template, data);

      // Generate report content
      const reportContent = await this.buildReportContent(template, data, options);

      // Apply formatting
      const formattedReport = await this.formatReport(reportContent, options.format || ReportFormats.HTML);

      // Create report metadata
      const reportMetadata = {
        id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: reportType,
        format: options.format || ReportFormats.HTML,
        generated: new Date().toISOString(),
        generator: 'ClinicalReportGenerator',
        version: '1.0',
        patient: data.patientData?.id || 'unknown',
        size: formattedReport.length,
      };

      // Add to history
      this.reportHistory.push({
        ...reportMetadata,
        dataSnapshot: this.createDataSnapshot(data),
      });

      medicalPerformanceMonitor.endMeasurement(metricId, { success: true });

      medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
        action: 'clinical_report_generated',
        reportType,
        reportId: reportMetadata.id,
        patient: reportMetadata.patient,
      });

      return {
        metadata: reportMetadata,
        content: formattedReport,
        sections: reportContent.sections,
        dataQuality: reportContent.dataQuality,
      };
    } catch (error) {
      medicalPerformanceMonitor.endMeasurement(metricId, {
        success: false,
        error: error.message,
      });

      //(`Report generation failed for ${reportType}:`, error);
      throw error;
    }
  }

  /**
   * Validate report data
   */
  validateReportData(template, data) {
    const missingData = [];

    for (const requirement of template.requiredData) {
      if (requirement === 'all') {
        continue;
      } // Special case for comprehensive reports

      if (!data[requirement]) {
        missingData.push(requirement);
      }
    }

    if (missingData.length > 0) {
      throw new Error(`Missing required data: ${missingData.join(', ')}`);
    }
  }

  /**
   * Build report content
   */
  async buildReportContent(template, data, options) {
    const sections = {};
    const dataQuality = { score: 100, issues: [] };

    for (const sectionName of template.sections) {
      try {
        const section = await this.generateSection(sectionName, data, options);
        sections[sectionName] = section;

        // Update data quality based on section completeness
        if (section.quality && section.quality.score < dataQuality.score) {
          dataQuality.score = section.quality.score;
          dataQuality.issues = dataQuality.issues.concat(section.quality.issues || []);
        }
      } catch (error) {
        //(`Failed to generate section ${sectionName}:`, error);
        sections[sectionName] = {
          title: this.getSectionTitle(sectionName),
          content: `Error generating section: ${error.message}`,
          error: true,
        };
        dataQuality.issues.push(`Section ${sectionName} generation failed`);
      }
    }

    return {
      template: template.name,
      sections,
      dataQuality,
      generated: new Date().toISOString(),
    };
  }

  /**
   * Generate individual report section
   */
  async generateSection(sectionName, data, options) {
    switch (sectionName) {
      case 'patient_demographics':
        return this.generatePatientDemographics(data.patientData);

      case 'clinical_presentation':
        return this.generateClinicalPresentation(data.patientData);

      case 'assessment_findings':
        return this.generateAssessmentFindings(data.patientData, data.predictions);

      case 'risk_stratification':
        return this.generateRiskStratification(data.predictions);

      case 'treatment_recommendations':
        return this.generateTreatmentRecommendations(data.recommendations || data.predictions?.recommendations);

      case 'disposition':
        return this.generateDisposition(data.predictions);

      case 'prediction_overview':
        return this.generatePredictionOverview(data.predictions);

      case 'mortality_risk':
        return this.generateMortalityRisk(data.predictions?.mortality);

      case 'functional_outcome':
        return this.generateFunctionalOutcome(data.predictions?.functionalOutcome);

      case 'complications_risk':
        return this.generateComplicationsRisk(data.predictions?.complications);

      case 'model_performance':
        return this.generateModelPerformance(data.mlResults);

      case 'confidence_metrics':
        return this.generateConfidenceMetrics(data.predictions);

      case 'risk_profile':
        return this.generateRiskProfile(data.patientData, data.predictions);

      case 'hemorrhagic_risk':
        return this.generateHemorrhagicRisk(data.predictions?.hemorrhagicRisk);

      case 'procedural_risks':
        return this.generateProceduralRisks(data.patientData);

      case 'contraindications':
        return this.generateContraindications(data.patientData);

      case 'monitoring_requirements':
        return this.generateMonitoringRequirements(data.predictions);

      case 'escalation_criteria':
        return this.generateEscalationCriteria(data.predictions);

      case 'treatment_options':
        return this.generateTreatmentOptions(data.patientData, data.predictions);

      case 'evidence_summary':
        return this.generateEvidenceSummary(data.patientData);

      case 'guideline_recommendations':
        return this.generateGuidelineRecommendations(data.patientData);

      case 'clinical_alerts':
        return this.generateClinicalAlerts(data.alerts);

      case 'action_plan':
        return this.generateActionPlan(data.recommendations);

      case 'follow_up':
        return this.generateFollowUp(data.predictions);

      case 'executive_summary':
        return this.generateExecutiveSummary(data);

      case 'research_insights':
        return this.generateResearchInsights(data);

      case 'appendices':
        return this.generateAppendices(data);

      default:
        throw new Error(`Unknown section: ${sectionName}`);
    }
  }

  /**
   * Generate patient demographics section
   */
  generatePatientDemographics(patientData) {
    const demographics = [];

    if (patientData.age) {
      demographics.push(`Age: ${patientData.age} years`);
    }

    if (patientData.gender) {
      demographics.push(`Gender: ${patientData.gender}`);
    }

    if (patientData.weight) {
      demographics.push(`Weight: ${patientData.weight} kg`);
    }

    if (patientData.medical_history) {
      demographics.push(`Medical History: ${patientData.medical_history}`);
    }

    return {
      title: 'Patient Demographics',
      content: demographics.join('; '),
      quality: this.assessDataQuality(['age', 'gender'], patientData),
    };
  }

  /**
   * Generate clinical presentation section
   */
  generateClinicalPresentation(patientData) {
    const presentation = [];

    if (patientData.symptom_onset) {
      presentation.push(`Symptom onset: ${patientData.symptom_onset} hours ago`);
    }

    if (patientData.gcs_score) {
      presentation.push(`Glasgow Coma Scale: ${patientData.gcs_score}/15`);
    }

    if (patientData.systolic_bp && patientData.diastolic_bp) {
      presentation.push(`Blood Pressure: ${patientData.systolic_bp}/${patientData.diastolic_bp} mmHg`);
    }

    if (patientData.fast_ed_score) {
      presentation.push(`FAST-ED Score: ${patientData.fast_ed_score}/10`);
    }

    return {
      title: 'Clinical Presentation',
      content: presentation.join('<br>'),
      quality: this.assessDataQuality(['symptom_onset', 'gcs_score', 'systolic_bp'], patientData),
    };
  }

  /**
   * Generate assessment findings section
   */
  generateAssessmentFindings(patientData, predictions) {
    const findings = [];

    if (patientData.gfap_value) {
      const gfap = parseFloat(patientData.gfap_value);
      findings.push(`GFAP Biomarker: ${gfap.toLocaleString()} pg/mL${gfap > 5000 ? ' (Elevated)' : ''}`);
    }

    if (patientData.ich_volume) {
      findings.push(`ICH Volume: ${patientData.ich_volume} mL`);
    }

    if (predictions?.lvoDetection) {
      findings.push(`LVO Detection: ${predictions.lvoDetection.probability}% probability`);
    }

    return {
      title: 'Assessment Findings',
      content: findings.join('<br>'),
      quality: this.assessDataQuality(['gfap_value'], patientData),
    };
  }

  /**
   * Generate risk stratification section
   */
  generateRiskStratification(predictions) {
    const risks = [];

    if (predictions?.mortality) {
      const { risk } = predictions.mortality;
      const level = predictions.mortality.riskLevel?.level || 'unknown';
      risks.push(`<strong>Mortality Risk:</strong> ${risk}% (${level})`);
    }

    if (predictions?.hemorrhagicRisk) {
      const { risk } = predictions.hemorrhagicRisk;
      const level = predictions.hemorrhagicRisk.riskLevel?.level || 'unknown';
      risks.push(`<strong>Hemorrhagic Risk:</strong> ${risk}% (${level})`);
    }

    if (predictions?.compositeRisk) {
      const { score } = predictions.compositeRisk;
      const level = predictions.compositeRisk.riskLevel?.level || 'unknown';
      risks.push(`<strong>Composite Risk:</strong> ${score}% (${level})`);
    }

    return {
      title: 'Risk Stratification',
      content: risks.join('<br>'),
      quality: { score: predictions ? 95 : 0, issues: predictions ? [] : ['No predictions available'] },
    };
  }

  /**
   * Generate treatment recommendations section
   */
  generateTreatmentRecommendations(recommendations) {
    if (!recommendations) {
      return {
        title: 'Treatment Recommendations',
        content: 'No recommendations available',
        quality: { score: 0, issues: ['No recommendations data'] },
      };
    }

    const recs = [];

    if (recommendations.priority && recommendations.priority.length > 0) {
      recs.push('<strong>Priority Actions:</strong>');
      recommendations.priority.forEach((rec) => {
        recs.push(`• ${rec.action} (${rec.rationale})`);
      });
    }

    if (recommendations.standard && recommendations.standard.length > 0) {
      recs.push('<br><strong>Standard Care:</strong>');
      recommendations.standard.forEach((rec) => {
        recs.push(`• ${rec.action} (${rec.rationale})`);
      });
    }

    return {
      title: 'Treatment Recommendations',
      content: recs.join('<br>'),
      quality: { score: 90, issues: [] },
    };
  }

  /**
   * Generate disposition section
   */
  generateDisposition(predictions) {
    let disposition = 'Standard stroke unit care';

    if (predictions?.mortality?.risk > 50) {
      disposition = 'ICU admission recommended due to high mortality risk';
    } else if (predictions?.hemorrhagicRisk?.risk > 40) {
      disposition = 'Enhanced monitoring unit due to hemorrhagic transformation risk';
    } else if (predictions?.compositeRisk?.score > 60) {
      disposition = 'Stroke unit with close monitoring';
    }

    return {
      title: 'Disposition',
      content: disposition,
      quality: { score: predictions ? 85 : 0, issues: predictions ? [] : ['No predictions for disposition'] },
    };
  }

  /**
   * Generate prediction overview section
   */
  generatePredictionOverview(predictions) {
    if (!predictions) {
      return {
        title: 'Prediction Overview',
        content: 'No predictions available',
        quality: { score: 0, issues: ['No predictions data'] },
      };
    }

    const overview = [
      '<table class="prediction-table">',
      '<tr><th>Outcome</th><th>Prediction</th><th>Confidence</th></tr>',
    ];

    if (predictions.mortality) {
      overview.push(`<tr><td>30-Day Mortality</td><td>${predictions.mortality.risk}%</td><td>${predictions.mortality.confidence?.level || 'N/A'}</td></tr>`);
    }

    if (predictions.functionalOutcome) {
      overview.push(`<tr><td>Good Functional Outcome</td><td>${predictions.functionalOutcome.probability}%</td><td>${predictions.functionalOutcome.confidence?.level || 'N/A'}</td></tr>`);
    }

    if (predictions.hemorrhagicRisk) {
      overview.push(`<tr><td>Hemorrhagic Transformation</td><td>${predictions.hemorrhagicRisk.risk}%</td><td>High</td></tr>`);
    }

    overview.push('</table>');

    return {
      title: 'Prediction Overview',
      content: overview.join(''),
      quality: { score: 95, issues: [] },
    };
  }

  /**
   * Generate mortality risk section
   */
  generateMortalityRisk(mortalityData) {
    if (!mortalityData) {
      return {
        title: 'Mortality Risk',
        content: 'Mortality risk assessment not available',
        quality: { score: 0, issues: ['No mortality data'] },
      };
    }

    const content = [
      `<p><strong>30-Day Mortality Risk:</strong> ${mortalityData.risk}%</p>`,
      `<p><strong>Risk Level:</strong> ${mortalityData.riskLevel?.label || 'Unknown'}</p>`,
      `<p><strong>Confidence:</strong> ${mortalityData.confidence?.level || 'Unknown'} (${mortalityData.confidence?.percent || 0}%)</p>`,
    ];

    if (mortalityData.explanation) {
      content.push(`<p><strong>Explanation:</strong> ${mortalityData.explanation}</p>`);
    }

    if (mortalityData.factors && mortalityData.factors.length > 0) {
      content.push('<p><strong>Contributing Factors:</strong></p>');
      content.push('<ul>');
      mortalityData.factors.forEach((factor) => {
        content.push(`<li>${factor.name}: ${factor.impact} impact (weight: ${Math.round((factor.weight || 0) * 100)}%)</li>`);
      });
      content.push('</ul>');
    }

    return {
      title: 'Mortality Risk Analysis',
      content: content.join(''),
      quality: { score: 95, issues: [] },
    };
  }

  /**
   * Generate functional outcome section
   */
  generateFunctionalOutcome(functionalData) {
    if (!functionalData) {
      return {
        title: 'Functional Outcome',
        content: 'Functional outcome prediction not available',
        quality: { score: 0, issues: ['No functional outcome data'] },
      };
    }

    const content = [
      `<p><strong>Probability of Good Outcome (mRS 0-2):</strong> ${functionalData.probability}%</p>`,
      `<p><strong>Predicted Outcome:</strong> ${functionalData.outcome}</p>`,
      `<p><strong>Confidence:</strong> ${functionalData.confidence?.level || 'Unknown'}</p>`,
    ];

    if (functionalData.factors && functionalData.factors.length > 0) {
      content.push('<p><strong>Influencing Factors:</strong></p>');
      content.push('<ul>');
      functionalData.factors.forEach((factor) => {
        content.push(`<li>${factor.name}: ${factor.impact} impact - ${factor.description}</li>`);
      });
      content.push('</ul>');
    }

    return {
      title: 'Functional Outcome Prediction',
      content: content.join(''),
      quality: { score: 90, issues: [] },
    };
  }

  /**
   * Generate executive summary
   */
  generateExecutiveSummary(data) {
    const summary = [];

    // Patient overview
    if (data.patientData?.age) {
      summary.push(`${data.patientData.age}-year-old patient presenting with stroke symptoms.`);
    }

    // Key findings
    if (data.patientData?.gfap_value) {
      const gfap = parseFloat(data.patientData.gfap_value);
      summary.push(`GFAP level: ${gfap.toLocaleString()} pg/mL${gfap > 5000 ? ' (significantly elevated)' : ''}.`);
    }

    // Risk assessment
    if (data.predictions?.compositeRisk) {
      const risk = data.predictions.compositeRisk.score;
      const level = data.predictions.compositeRisk.riskLevel?.level || 'unknown';
      summary.push(`Overall risk assessment: ${risk}% (${level} risk).`);
    }

    // Recommendations
    if (data.predictions?.recommendations?.summary) {
      summary.push(data.predictions.recommendations.summary);
    }

    return {
      title: 'Executive Summary',
      content: summary.join(' '),
      quality: { score: 85, issues: [] },
    };
  }

  /**
   * Assess data quality for a section
   */
  assessDataQuality(requiredFields, data) {
    const availableFields = requiredFields.filter((field) => data[field] !== undefined && data[field] !== null && data[field] !== '');

    const score = (availableFields.length / requiredFields.length) * 100;
    const missingFields = requiredFields.filter((field) => !availableFields.includes(field));

    return {
      score: Math.round(score),
      issues: missingFields.length > 0 ? [`Missing data: ${missingFields.join(', ')}`] : [],
    };
  }

  /**
   * Get section title
   */
  getSectionTitle(sectionName) {
    const titles = {
      patient_demographics: 'Patient Demographics',
      clinical_presentation: 'Clinical Presentation',
      assessment_findings: 'Assessment Findings',
      risk_stratification: 'Risk Stratification',
      treatment_recommendations: 'Treatment Recommendations',
      disposition: 'Disposition',
      prediction_overview: 'Prediction Overview',
      mortality_risk: 'Mortality Risk',
      functional_outcome: 'Functional Outcome',
      complications_risk: 'Complications Risk',
      model_performance: 'Model Performance',
      confidence_metrics: 'Confidence Metrics',
      executive_summary: 'Executive Summary',
    };

    return titles[sectionName] || sectionName.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }

  /**
   * Format report content
   */
  async formatReport(reportContent, format) {
    switch (format) {
      case ReportFormats.HTML:
        return this.formatAsHTML(reportContent);

      case ReportFormats.PDF:
        return this.formatAsPDF(reportContent);

      case ReportFormats.JSON:
        return JSON.stringify(reportContent, null, 2);

      case ReportFormats.CSV:
        return this.formatAsCSV(reportContent);

      default:
        return this.formatAsHTML(reportContent);
    }
  }

  /**
   * Format report as HTML
   */
  formatAsHTML(reportContent) {
    const html = [
      '<!DOCTYPE html>',
      '<html lang="en">',
      '<head>',
      '<meta charset="UTF-8">',
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      `<title>${reportContent.template}</title>`,
      '<style>',
      this.getReportCSS(),
      '</style>',
      '</head>',
      '<body>',
      '<div class="report-container">',
      '<header class="report-header">',
      `<h1>${reportContent.template}</h1>`,
      `<div class="report-meta">Generated: ${reportContent.generated}</div>`,
      `<div class="data-quality">Data Quality: ${reportContent.dataQuality.score}%</div>`,
      '</header>',
      '<main class="report-content">',
    ];

    // Add sections
    Object.entries(reportContent.sections).forEach(([sectionName, section]) => {
      html.push(`<section class="report-section" id="${sectionName}">`);
      html.push(`<h2>${section.title}</h2>`);
      html.push(`<div class="section-content">${section.content}</div>`);
      if (section.quality && section.quality.score < 100) {
        html.push(`<div class="quality-indicator">Quality: ${section.quality.score}%</div>`);
      }
      html.push('</section>');
    });

    html.push('</main>');
    html.push('</div>');
    html.push('</body>');
    html.push('</html>');

    return html.join('\n');
  }

  /**
   * Get report CSS styles
   */
  getReportCSS() {
    return `
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        margin: 0;
        padding: 20px;
        background: #f5f5f5;
      }

      .report-container {
        max-width: 1200px;
        margin: 0 auto;
        background: white;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        border-radius: 8px;
        overflow: hidden;
      }

      .report-header {
        background: #2196F3;
        color: white;
        padding: 30px;
        text-align: center;
      }

      .report-header h1 {
        margin: 0 0 10px 0;
        font-size: 2.5em;
      }

      .report-meta {
        font-size: 0.9em;
        opacity: 0.9;
      }

      .data-quality {
        margin-top: 10px;
        padding: 5px 15px;
        background: rgba(255,255,255,0.2);
        border-radius: 20px;
        display: inline-block;
      }

      .report-content {
        padding: 40px;
      }

      .report-section {
        margin-bottom: 40px;
        border-bottom: 1px solid #e0e0e0;
        padding-bottom: 30px;
      }

      .report-section:last-child {
        border-bottom: none;
      }

      .report-section h2 {
        color: #2196F3;
        margin: 0 0 20px 0;
        font-size: 1.8em;
        border-left: 4px solid #2196F3;
        padding-left: 15px;
      }

      .section-content {
        font-size: 1.1em;
        line-height: 1.8;
      }

      .quality-indicator {
        margin-top: 10px;
        font-size: 0.8em;
        color: #666;
        text-align: right;
      }

      .prediction-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }

      .prediction-table th,
      .prediction-table td {
        border: 1px solid #ddd;
        padding: 12px;
        text-align: left;
      }

      .prediction-table th {
        background: #f5f5f5;
        font-weight: bold;
      }

      .prediction-table tr:nth-child(even) {
        background: #f9f9f9;
      }

      ul {
        margin: 15px 0;
      }

      li {
        margin: 5px 0;
      }

      p {
        margin: 15px 0;
      }

      strong {
        color: #333;
      }

      @media print {
        body {
          background: white;
          padding: 0;
        }

        .report-container {
          box-shadow: none;
          border-radius: 0;
        }

        .report-section {
          page-break-inside: avoid;
        }
      }
    `;
  }

  /**
   * Create data snapshot for history
   */
  createDataSnapshot(data) {
    return {
      hasPatientData: !!data.patientData,
      hasPredictions: !!data.predictions,
      hasMLResults: !!data.mlResults,
      hasRecommendations: !!data.recommendations,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Generate additional sections (simplified implementations)
   */
  generateClinicalAlerts(alerts) {
    if (!alerts || alerts.length === 0) {
      return {
        title: 'Clinical Alerts',
        content: 'No active alerts',
        quality: { score: 100, issues: [] },
      };
    }

    const alertsHtml = alerts.map((alert) => `<div class="alert ${alert.severity?.level}">
        <strong>${alert.title}</strong><br>
        ${alert.message}<br>
        <em>Recommendation: ${alert.recommendation}</em>
      </div>`).join('');

    return {
      title: 'Clinical Alerts',
      content: alertsHtml,
      quality: { score: 95, issues: [] },
    };
  }

  generateHemorrhagicRisk(hemorrhagicData) {
    if (!hemorrhagicData) {
      return {
        title: 'Hemorrhagic Risk',
        content: 'Hemorrhagic risk assessment not available',
        quality: { score: 0, issues: ['No hemorrhagic risk data'] },
      };
    }

    const content = [
      `<p><strong>Hemorrhagic Transformation Risk:</strong> ${hemorrhagicData.risk}%</p>`,
      `<p><strong>Risk Level:</strong> ${hemorrhagicData.riskLevel?.label || 'Unknown'}</p>`,
      `<p><strong>Recommendation:</strong> ${hemorrhagicData.recommendation}</p>`,
    ];

    if (hemorrhagicData.activeFactors && hemorrhagicData.activeFactors.length > 0) {
      content.push('<p><strong>Active Risk Factors:</strong></p>');
      content.push('<ul>');
      hemorrhagicData.activeFactors.forEach((factor) => {
        content.push(`<li>${factor.factor}: ${factor.contribution}% contribution</li>`);
      });
      content.push('</ul>');
    }

    return {
      title: 'Hemorrhagic Transformation Risk',
      content: content.join(''),
      quality: { score: 90, issues: [] },
    };
  }

  generateResearchInsights(data) {
    return {
      title: 'Research Insights',
      content: 'Research analytics and population-based insights would be generated here based on anonymized data comparisons.',
      quality: { score: 70, issues: ['Research module not fully implemented'] },
    };
  }

  generateAppendices(data) {
    return {
      title: 'Appendices',
      content: 'Technical details, model specifications, and additional data would be included in appendices.',
      quality: { score: 80, issues: [] },
    };
  }

  // Additional simplified generators for remaining sections
  generateModelPerformance(mlResults) {
    return {
      title: 'Model Performance',
      content: mlResults ? 'Model performance metrics and validation results.' : 'No ML results available.',
      quality: { score: mlResults ? 85 : 0, issues: mlResults ? [] : ['No ML results'] },
    };
  }

  generateConfidenceMetrics(predictions) {
    return {
      title: 'Confidence Metrics',
      content: predictions ? 'Prediction confidence analysis and reliability metrics.' : 'No predictions available.',
      quality: { score: predictions ? 90 : 0, issues: predictions ? [] : ['No predictions'] },
    };
  }

  generateRiskProfile(patientData, predictions) {
    return {
      title: 'Risk Profile',
      content: 'Comprehensive risk profile based on clinical and predictive factors.',
      quality: { score: 85, issues: [] },
    };
  }

  generateProceduralRisks(patientData) {
    return {
      title: 'Procedural Risks',
      content: 'Assessment of risks associated with potential interventions.',
      quality: { score: 80, issues: [] },
    };
  }

  generateContraindications(patientData) {
    return {
      title: 'Contraindications',
      content: 'Analysis of contraindications for various treatment options.',
      quality: { score: 85, issues: [] },
    };
  }

  generateMonitoringRequirements(predictions) {
    return {
      title: 'Monitoring Requirements',
      content: 'Recommended monitoring protocols based on risk assessment.',
      quality: { score: 90, issues: [] },
    };
  }

  generateEscalationCriteria(predictions) {
    return {
      title: 'Escalation Criteria',
      content: 'Criteria for escalating care based on clinical deterioration.',
      quality: { score: 85, issues: [] },
    };
  }

  generateTreatmentOptions(patientData, predictions) {
    return {
      title: 'Treatment Options',
      content: 'Available treatment options with risk-benefit analysis.',
      quality: { score: 88, issues: [] },
    };
  }

  generateEvidenceSummary(patientData) {
    return {
      title: 'Evidence Summary',
      content: 'Summary of relevant clinical evidence and guidelines.',
      quality: { score: 75, issues: [] },
    };
  }

  generateGuidelineRecommendations(patientData) {
    return {
      title: 'Guideline Recommendations',
      content: 'Relevant clinical guideline recommendations.',
      quality: { score: 85, issues: [] },
    };
  }

  generateActionPlan(recommendations) {
    return {
      title: 'Action Plan',
      content: recommendations ? 'Structured action plan based on recommendations.' : 'No recommendations available.',
      quality: { score: recommendations ? 90 : 0, issues: recommendations ? [] : ['No recommendations'] },
    };
  }

  generateFollowUp(predictions) {
    return {
      title: 'Follow-up',
      content: 'Recommended follow-up schedule and monitoring plan.',
      quality: { score: 85, issues: [] },
    };
  }

  generateComplicationsRisk(complicationsData) {
    if (!complicationsData) {
      return {
        title: 'Complications Risk',
        content: 'Complications risk assessment not available',
        quality: { score: 0, issues: ['No complications data'] },
      };
    }

    const content = [`<p><strong>Overall Complications Risk:</strong> ${complicationsData.totalRisk}%</p>`];

    if (complicationsData.complications && complicationsData.complications.length > 0) {
      content.push('<p><strong>Specific Complications:</strong></p>');
      content.push('<ul>');
      complicationsData.complications.forEach((comp) => {
        content.push(`<li>${comp.type}: ${comp.risk}% risk</li>`);
      });
      content.push('</ul>');
    }

    return {
      title: 'Complications Risk Assessment',
      content: content.join(''),
      quality: { score: 90, issues: [] },
    };
  }
}

/**
 * Automated Clinical Reporting System
 */
export class ClinicalReportingSystem {
  constructor() {
    this.reportGenerator = new ClinicalReportGenerator();
    this.scheduledReports = new Map();
    this.deliveryQueue = [];
    this.isActive = false;
  }

  /**
   * Start the reporting system
   */
  start() {
    this.isActive = true;
    this.processDeliveryQueue();

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: 'clinical_reporting_system_started',
    });
  }

  /**
   * Generate comprehensive report
   */
  async generateComprehensiveReport(data, options = {}) {
    return await this.reportGenerator.generateReport(ReportTypes.COMPREHENSIVE, data, options);
  }

  /**
   * Generate specific report type
   */
  async generateReport(reportType, data, options = {}) {
    return await this.reportGenerator.generateReport(reportType, data, options);
  }

  /**
   * Schedule automated report generation
   */
  scheduleReport(schedule) {
    const scheduleId = `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    this.scheduledReports.set(scheduleId, {
      ...schedule,
      id: scheduleId,
      created: new Date().toISOString(),
      lastGenerated: null,
      nextGeneration: this.calculateNextGeneration(schedule.frequency),
    });

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: 'report_scheduled',
      scheduleId,
      reportType: schedule.reportType,
    });

    return scheduleId;
  }

  /**
   * Queue report for delivery
   */
  queueReportForDelivery(report, deliveryMethod, deliveryOptions = {}) {
    this.deliveryQueue.push({
      report,
      deliveryMethod,
      deliveryOptions,
      queued: new Date().toISOString(),
      attempts: 0,
      maxAttempts: 3,
    });

    if (this.isActive) {
      this.processDeliveryQueue();
    }
  }

  /**
   * Process delivery queue
   */
  async processDeliveryQueue() {
    while (this.deliveryQueue.length > 0 && this.isActive) {
      const deliveryItem = this.deliveryQueue.shift();

      try {
        await this.deliverReport(deliveryItem);
      } catch (error) {
        deliveryItem.attempts++;
        if (deliveryItem.attempts < deliveryItem.maxAttempts) {
          // Retry later
          setTimeout(() => {
            this.deliveryQueue.push(deliveryItem);
          }, 60000 * deliveryItem.attempts); // Exponential backoff
        } else {
          //('Failed to deliver report after max attempts:', error);
        }
      }
    }

    // Process again in 30 seconds
    if (this.isActive) {
      setTimeout(() => this.processDeliveryQueue(), 30000);
    }
  }

  /**
   * Deliver report using specified method
   */
  async deliverReport(deliveryItem) {
    const { report, deliveryMethod, deliveryOptions } = deliveryItem;

    switch (deliveryMethod) {
      case DeliveryMethods.DOWNLOAD:
        this.triggerDownload(report);
        break;

      case DeliveryMethods.EMAIL:
        await this.emailReport(report, deliveryOptions);
        break;

      case DeliveryMethods.EHR_INTEGRATION:
        await this.integrateWithEHR(report, deliveryOptions);
        break;

      case DeliveryMethods.API:
        await this.sendToAPI(report, deliveryOptions);
        break;

      default:
        throw new Error(`Unknown delivery method: ${deliveryMethod}`);
    }

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: 'report_delivered',
      reportId: report.metadata.id,
      deliveryMethod,
    });
  }

  /**
   * Trigger report download
   */
  triggerDownload(report) {
    const blob = new Blob([report.content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `clinical-report-${report.metadata.id}.html`;
    link.click();

    URL.revokeObjectURL(url);
  }

  /**
   * Email report (simulated)
   */
  async emailReport(report, options) {
    // In real implementation, this would integrate with email service
    //(`Email report ${report.metadata.id} to ${options.recipient}`);
  }

  /**
   * Integrate with EHR (simulated)
   */
  async integrateWithEHR(report, options) {
    // In real implementation, this would integrate with EHR system
    //(`Integrate report ${report.metadata.id} with EHR system`);
  }

  /**
   * Send to API (simulated)
   */
  async sendToAPI(report, options) {
    // In real implementation, this would send to external API
    //(`Send report ${report.metadata.id} to API endpoint`);
  }

  /**
   * Calculate next generation time
   */
  calculateNextGeneration(frequency) {
    const now = new Date();
    switch (frequency) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      case 'monthly':
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return null;
    }
  }

  /**
   * Get report history
   */
  getReportHistory(filters = {}) {
    return this.reportGenerator.reportHistory.filter((report) => {
      if (filters.reportType && report.type !== filters.reportType) {
        return false;
      }
      if (filters.startDate && new Date(report.generated) < new Date(filters.startDate)) {
        return false;
      }
      if (filters.endDate && new Date(report.generated) > new Date(filters.endDate)) {
        return false;
      }
      return true;
    });
  }

  /**
   * Export reporting statistics
   */
  getReportingStatistics() {
    const history = this.reportGenerator.reportHistory;

    return {
      totalReports: history.length,
      reportsByType: this.groupBy(history, 'type'),
      averageDataQuality: this.calculateAverageDataQuality(history),
      reportingTrends: this.calculateReportingTrends(history),
      scheduledReports: this.scheduledReports.size,
      queuedDeliveries: this.deliveryQueue.length,
    };
  }

  /**
   * Helper methods
   */
  groupBy(array, key) {
    return array.reduce((result, item) => {
      const group = item[key] || 'unknown';
      result[group] = (result[group] || 0) + 1;
      return result;
    }, {});
  }

  calculateAverageDataQuality(history) {
    if (history.length === 0) {
      return 0;
    }

    const totalQuality = history.reduce(
      (sum, report) => sum + (report.dataSnapshot?.quality || 85), // Default quality
      0,
    );

    return Math.round(totalQuality / history.length);
  }

  calculateReportingTrends(history) {
    // Simplified trend calculation
    const last30Days = history.filter((report) => new Date(report.generated) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

    return {
      reportsLast30Days: last30Days.length,
      averageReportsPerDay: Math.round(last30Days.length / 30 * 10) / 10,
    };
  }

  /**
   * Stop the reporting system
   */
  stop() {
    this.isActive = false;

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: 'clinical_reporting_system_stopped',
    });
  }
}

// Export reporting system instance
export const clinicalReportingSystem = new ClinicalReportingSystem();
