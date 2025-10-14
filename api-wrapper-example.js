/**
 * Example API Wrapper Implementation for iGFAP Stroke Triage
 * This demonstrates how to expose your existing functionality as a REST API
 */

import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { v4 as uuidv4 } from "uuid";

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per minute
  message: "Too many requests from this IP"
});

app.use("/api/", limiter);

// API Key Authentication Middleware
const authenticateApiKey = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      error: {
        code: "INVALID_API_KEY",
        message: "Missing or invalid API key"
      }
    });
  }
  
  const apiKey = authHeader.substring(7);
  
  // In production, validate against database
  // For now, simple check
  if (!isValidApiKey(apiKey)) {
    return res.status(401).json({
      status: "error",
      error: {
        code: "INVALID_API_KEY",
        message: "Invalid API key"
      }
    });
  }
  
  req.apiKey = apiKey;
  req.clientId = getClientIdFromApiKey(apiKey);
  next();
};

// Import your existing functions
import { 
  predictComaICH, 
  predictLimitedICH, 
  predictFullStroke 
} from "./src/api/client.js";

import { 
  calculateICHVolume,
  calculateMortalityRate 
} from "./src/logic/ich-volume-calculator.js";

/**
 * Main Assessment Endpoint
 */
app.post("/api/v1/assess", authenticateApiKey, async (req, res) => {
  const requestId = `req_${uuidv4()}`;
  const startTime = Date.now();
  
  try {
    const { module = "auto", patient_data, options = {} } = req.body;
    
    // Validate required fields
    const validation = validatePatientData(patient_data, module);
    if (!validation.valid) {
      return res.status(400).json({
        status: "error",
        error: {
          code: "INVALID_VALUE_RANGE",
          message: validation.message,
          field: validation.field
        },
        request_id: requestId
      });
    }
    
    // Auto-select module based on available data
    const selectedModule = module === "auto" 
      ? selectBestModule(patient_data) 
      : module;
    
    // Route to appropriate prediction function
    let results;
    switch (selectedModule) {
    case "coma":
      results = await predictComaICH(patient_data);
      break;
    case "limited":
      results = await predictLimitedICH(patient_data);
      break;
    case "full":
      results = await predictFullStroke(patient_data);
      break;
    default:
      throw new Error("Invalid module");
    }
    
    // Enhance results with additional calculations
    const enhancedResults = enhanceResults(results, patient_data, options);
    
    // Log usage for billing
    await logApiUsage(req.clientId, requestId, selectedModule, Date.now() - startTime);
    
    // Return standardized response
    return res.json({
      status: "success",
      request_id: requestId,
      timestamp: new Date().toISOString(),
      module_used: selectedModule,
      results: enhancedResults
    });
    
  } catch (error) {
    console.error("API Error:", error);
    
    return res.status(500).json({
      status: "error",
      error: {
        code: "SERVER_ERROR",
        message: "Internal server error occurred"
      },
      request_id: requestId
    });
  }
});

/**
 * Batch Assessment Endpoint
 */
app.post("/api/v1/assess/batch", authenticateApiKey, async (req, res) => {
  const requestId = `req_batch_${uuidv4()}`;
  
  try {
    const { patients, options = {} } = req.body;
    
    if (!Array.isArray(patients) || patients.length === 0) {
      return res.status(400).json({
        status: "error",
        error: {
          code: "INVALID_REQUEST",
          message: "Patients array is required"
        }
      });
    }
    
    if (patients.length > 100) {
      return res.status(400).json({
        status: "error",
        error: {
          code: "BATCH_SIZE_EXCEEDED",
          message: "Maximum batch size is 100 patients"
        }
      });
    }
    
    // Process all patients in parallel
    const results = await Promise.all(
      patients.map(async (patient) => {
        try {
          const result = await processPatient(patient, options);
          return {
            patient_id: patient.patient_id,
            status: "success",
            results: result
          };
        } catch (error) {
          return {
            patient_id: patient.patient_id,
            status: "error",
            error: error.message
          };
        }
      })
    );
    
    return res.json({
      status: "success",
      request_id: requestId,
      timestamp: new Date().toISOString(),
      results
    });
    
  } catch (error) {
    console.error("Batch API Error:", error);
    return res.status(500).json({
      status: "error",
      error: {
        code: "SERVER_ERROR",
        message: "Batch processing failed"
      },
      request_id: requestId
    });
  }
});

/**
 * Module Recommendation Endpoint
 */
app.get("/api/v1/modules/recommend", authenticateApiKey, (req, res) => {
  const { gcs_score, data_points } = req.query;
  
  const available = [];
  const dataPointsList = data_points ? data_points.split(",") : [];
  
  // Check for coma module
  if (gcs_score && parseInt(gcs_score) < 8) {
    return res.json({
      recommended_module: "coma",
      available_modules: ["coma"],
      reason: "GCS < 8 requires coma module",
      accuracy_estimate: 0.92
    });
  }
  
  // Check for full module
  const hasFullData = dataPointsList.includes("fast_ed_score");
  if (hasFullData) {
    available.push("full");
  }
  
  // Limited module is always available with basic data
  if (dataPointsList.includes("gfap_value")) {
    available.push("limited");
  }
  
  return res.json({
    recommended_module: hasFullData ? "full" : "limited",
    available_modules: available,
    reason: hasFullData 
      ? "Sufficient data for comprehensive assessment" 
      : "Limited data available",
    missing_for_full: hasFullData ? [] : ["fast_ed_score"],
    accuracy_estimate: hasFullData ? 0.94 : 0.88
  });
});

/**
 * Health Check Endpoint
 */
app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "healthy",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

// Helper Functions

function isValidApiKey(apiKey) {
  // In production, check against database
  // For demo, accept any key starting with 'sk_'
  return apiKey && apiKey.startsWith("sk_");
}

function getClientIdFromApiKey(apiKey) {
  // In production, lookup from database
  return "client_" + apiKey.substring(3, 10);
}

function validatePatientData(data, module) {
  // Check required fields
  const required = ["age_years", "systolic_bp", "diastolic_bp", "gfap_value"];
  
  if (module === "coma") {
    required.push("gcs_total");
  }
  
  if (module === "full") {
    required.push("fast_ed_score");
  }
  
  for (const field of required) {
    if (data[field] === undefined || data[field] === null) {
      return {
        valid: false,
        message: `Missing required field: ${field}`,
        field: `patient_data.${field}`
      };
    }
  }
  
  // Validate ranges
  if (data.age_years < 0 || data.age_years > 120) {
    return {
      valid: false,
      message: "Age must be between 0 and 120",
      field: "patient_data.age_years"
    };
  }
  
  if (data.gfap_value < 29 || data.gfap_value > 10001) {
    return {
      valid: false,
      message: "GFAP value must be between 29 and 10001 pg/mL",
      field: "patient_data.gfap_value"
    };
  }
  
  return { valid: true };
}

function selectBestModule(data) {
  if (data.gcs_total && data.gcs_total < 8) {
    return "coma";
  }
  
  if (data.fast_ed_score !== undefined) {
    return "full";
  }
  
  return "limited";
}

function enhanceResults(results, patientData, options) {
  const enhanced = { ...results };
  
  // Add volume calculation if requested
  if (options.include_volume && patientData.gfap_value) {
    const volumeData = calculateICHVolume(patientData.gfap_value);
    enhanced.ich = {
      ...enhanced.ich,
      volume_ml: volumeData.volume,
      mortality_30d: volumeData.mortalityRate
    };
  }
  
  // Add risk level classifications
  if (enhanced.ich?.probability) {
    enhanced.ich.risk_level = classifyRiskLevel(enhanced.ich.probability);
  }
  
  if (enhanced.lvo?.probability) {
    enhanced.lvo.risk_level = classifyRiskLevel(enhanced.lvo.probability);
  }
  
  // Add recommendations if requested
  if (options.include_recommendations) {
    enhanced.recommendations = generateRecommendations(enhanced);
  }
  
  return enhanced;
}

function classifyRiskLevel(probability) {
  if (probability > 0.7) return "very_high";
  if (probability > 0.5) return "high";
  if (probability > 0.25) return "moderate";
  return "low";
}

function generateRecommendations(results) {
  const recommendations = {
    priority: "routine",
    suggested_actions: [],
    contraindications: [],
    suggested_imaging: ["CT"],
    transfer_recommendation: "primary_stroke_center"
  };
  
  if (results.ich?.probability > 0.7) {
    recommendations.priority = "emergent";
    recommendations.suggested_actions.push(
      "Immediate neurosurgical consultation",
      "Blood pressure management critical"
    );
    recommendations.contraindications.push("Avoid thrombolysis");
    recommendations.transfer_recommendation = "comprehensive_stroke_center";
  }
  
  if (results.lvo?.probability > 0.5) {
    recommendations.suggested_imaging.push("CTA");
    recommendations.suggested_actions.push("Consider endovascular therapy");
  }
  
  return recommendations;
}

async function logApiUsage(clientId, requestId, module, responseTime) {
  // In production, log to database for billing
  console.log("API Usage:", {
    clientId,
    requestId,
    module,
    responseTime,
    timestamp: new Date().toISOString()
  });
}

async function processPatient(patient, options) {
  // Similar to single assessment but for batch
  const validation = validatePatientData(patient.patient_data, patient.module);
  if (!validation.valid) {
    throw new Error(validation.message);
  }
  
  const module = patient.module === "auto" 
    ? selectBestModule(patient.patient_data)
    : patient.module;
    
  let results;
  switch (module) {
  case "coma":
    results = await predictComaICH(patient.patient_data);
    break;
  case "limited":
    results = await predictLimitedICH(patient.patient_data);
    break;
  case "full":
    results = await predictFullStroke(patient.patient_data);
    break;
  default:
    throw new Error("Invalid module");
  }
  
  return enhanceResults(results, patient.patient_data, options);
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`iGFAP API Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/v1/health`);
});

export default app;