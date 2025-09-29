#!/bin/bash

# Deploy Authentication Cloud Function for iGFAP Stroke Triage Assistant
# Production-ready deployment with security environment variables

echo "🚀 Deploying secure authentication Cloud Function..."

# Set the function name
FUNCTION_NAME="authenticate-research-access"
REGION="europe-west3"
PROJECT_ID="igfap-452720"

# Generate secure password hash for "Neuro25"
PASSWORD_HASH=$(echo -n "Neuro25igfap_research_2024" | sha256sum | cut -d' ' -f1)

echo "📋 Password hash generated: $PASSWORD_HASH"

# Deploy the function with environment variables
gcloud functions deploy $FUNCTION_NAME \
  --gen2 \
  --runtime=python311 \
  --region=$REGION \
  --source=./cloud-functions/authenticate-research-access \
  --entry-point=authenticate_research_access \
  --trigger-http \
  --allow-unauthenticated \
  --memory=256MB \
  --timeout=60s \
  --max-instances=10 \
  --set-env-vars="RESEARCH_PASSWORD_HASH=$PASSWORD_HASH,PASSWORD_SALT=igfap_research_2024,SESSION_SECRET=igfap_session_key_$(date +%s)" \
  --project=$PROJECT_ID

if [ $? -eq 0 ]; then
    echo "✅ Authentication function deployed successfully!"
    echo "🔗 Function URL: https://$REGION-$PROJECT_ID.cloudfunctions.net/$FUNCTION_NAME"

    # Test the deployment
    echo "🧪 Testing authentication endpoint..."
    curl -X POST \
      -H "Content-Type: application/json" \
      -d '{"action": "login", "password": "Neuro25"}' \
      "https://$REGION-$PROJECT_ID.cloudfunctions.net/$FUNCTION_NAME"

    echo -e "\n✅ Authentication Cloud Function is ready for production!"
else
    echo "❌ Deployment failed. Please check the logs."
    exit 1
fi