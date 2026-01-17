/**
 * Cloud Function: Analysis Logger
 *
 * Logs iGFAP analysis data to Firestore for debugging purposes.
 * - Excludes age for privacy
 * - Automatically deletes after 4 hours via Firestore TTL policy
 *
 * Deployment:
 *   gcloud functions deploy logAnalysis \
 *     --runtime nodejs20 \
 *     --trigger-http \
 *     --allow-unauthenticated \
 *     --region europe-west1 \
 *     --project YOUR_PROJECT_ID
 *
 * Firestore TTL Setup (run once in Firebase Console or via CLI):
 *   gcloud firestore fields ttls update expireAt \
 *     --collection-group=analysis_logs \
 *     --enable-ttl \
 *     --project YOUR_PROJECT_ID
 */

const { Firestore } = require("@google-cloud/firestore");
const firestore = new Firestore();

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

/**
 * Sanitize input data - remove age and any PII
 */
function sanitizeInputs(inputs) {
  if (!inputs || typeof inputs !== "object") return {};

  const sanitized = { ...inputs };

  // Remove age for privacy
  delete sanitized.age;
  delete sanitized.patient_age;

  // Remove any other potential PII fields
  delete sanitized.name;
  delete sanitized.patient_name;
  delete sanitized.patient_id;
  delete sanitized.mrn;

  return sanitized;
}

/**
 * Main Cloud Function handler
 */
exports.logAnalysis = async (req, res) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.set(corsHeaders);
    return res.status(204).send("");
  }

  res.set(corsHeaders);

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { module, inputs, results, sessionId, userAgent, appVersion } = req.body;

    // Validate required fields
    if (!module || !inputs || !results) {
      return res.status(400).json({
        error: "Missing required fields: module, inputs, results"
      });
    }

    // Create timestamp and TTL (4 hours from now)
    const now = new Date();
    const expireAt = new Date(now.getTime() + 4 * 60 * 60 * 1000); // 4 hours

    // Prepare log document
    const logEntry = {
      timestamp: now.toISOString(),
      expireAt: Firestore.Timestamp.fromDate(expireAt),
      module,
      inputs: sanitizeInputs(inputs),
      results: {
        ich: results.ich ? {
          probability: results.ich.probability,
          riskCategory: results.ich.riskCategory,
          confidence: results.ich.confidence,
        } : null,
        lvo: results.lvo ? {
          probability: results.lvo.probability,
          riskCategory: results.lvo.riskCategory,
          confidence: results.lvo.confidence,
        } : null,
      },
      metadata: {
        sessionId: sessionId || "unknown",
        userAgent: userAgent || "unknown",
        appVersion: appVersion || "unknown",
        loggedAt: Firestore.FieldValue.serverTimestamp(),
      },
    };

    // Write to Firestore
    const docRef = await firestore.collection("analysis_logs").add(logEntry);

    console.log(`[Analysis Logger] Logged analysis: ${docRef.id} for module: ${module}`);

    return res.status(200).json({
      success: true,
      logId: docRef.id,
      expiresAt: expireAt.toISOString(),
    });

  } catch (error) {
    console.error("[Analysis Logger] Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};
