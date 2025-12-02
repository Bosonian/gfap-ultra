#!/bin/bash
# Deploy Coma ICH Cloud Function
# Fixes: Non-deterministic predictions and incorrect fallback formula

echo "🚀 Deploying Coma ICH Cloud Function..."
echo "📊 Using scientifically validated univariate logistic regression"
echo "📐 Formula: logit(P) = -6.30 + 2.25 × log₁₀(GFAP)"
echo ""

# Deploy to Google Cloud Functions Gen2
gcloud functions deploy predict_coma_ich \
  --gen2 \
  --runtime=python311 \
  --region=europe-west3 \
  --source=. \
  --entry-point=predict_coma_ich \
  --trigger-http \
  --allow-unauthenticated \
  --timeout=60s \
  --memory=512MB \
  --max-instances=10

echo ""
echo "✅ Deployment complete!"
echo "🔗 Endpoint: https://europe-west3-igfap-452720.cloudfunctions.net/predict_coma_ich"
echo ""
echo "📋 Changes deployed:"
echo "  ✅ Removed random noise (now deterministic)"
echo "  ✅ Replaced crude thresholds with validated logistic regression"
echo "  ✅ Formula: logit(P) = -6.30 + 2.25 × log₁₀(GFAP)"
echo "  ✅ AUC = 0.994 (DETECT study validation)"
