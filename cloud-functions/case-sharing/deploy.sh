#!/bin/bash

# Deploy case-sharing Cloud Function
# This function handles case storage, location updates, and retrieval

echo "🚀 Deploying case-sharing Cloud Function..."

gcloud functions deploy case-sharing \
  --runtime python311 \
  --region europe-west3 \
  --source . \
  --entry-point app \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars BUCKET_NAME=igfap-stroke-cases \
  --memory 256MB \
  --timeout 60s \
  --max-instances 10

echo "✓ Deployment complete!"
echo ""
echo "Function URL:"
echo "https://europe-west3-igfap-452720.cloudfunctions.net/case-sharing"
echo ""
echo "Endpoints:"
echo "  POST /store-case       - Create new case"
echo "  POST /update-location  - Update ambulance GPS"
echo "  GET  /get-cases        - Get active cases"
echo "  POST /mark-arrived     - Mark case as arrived"
echo "  POST /cleanup-old-cases - Remove old cases"
echo "  GET  /health           - Health check"
