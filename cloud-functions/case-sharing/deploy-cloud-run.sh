#!/bin/bash

# Deploy case-sharing as Cloud Run service
# This is simpler than Cloud Functions for Flask apps

echo "🚀 Deploying case-sharing to Cloud Run..."

# Build and deploy in one step
gcloud run deploy case-sharing \
  --source . \
  --region europe-west3 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars BUCKET_NAME=igfap-stroke-cases \
  --memory 512Mi \
  --cpu 1 \
  --timeout 60s \
  --max-instances 10 \
  --min-instances 0 \
  --clear-base-image \
  --quiet

echo ""
echo "✓ Deployment complete!"
echo ""
echo "Endpoints:"
echo "  POST /store-case        - Create new case"
echo "  POST /update-location   - Update ambulance GPS"
echo "  GET  /get-cases         - Get active cases"
echo "  POST /mark-arrived      - Mark case as arrived"
echo "  POST /archive-case      - Archive/dismiss case (kiosk)"
echo "  POST /cleanup-old-cases - Remove old cases"
echo "  GET  /health            - Health check"
