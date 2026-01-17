# Analysis Logger - Deployment Guide

## Prerequisites

1. Google Cloud project with billing enabled
2. `gcloud` CLI installed and authenticated
3. Firestore database created (Native mode)

## Deployment Steps

### 1. Set your project ID

```bash
export PROJECT_ID="your-gcp-project-id"
gcloud config set project $PROJECT_ID
```

### 2. Enable required APIs

```bash
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable firestore.googleapis.com
```

### 3. Create Firestore database (if not exists)

```bash
gcloud firestore databases create --location=europe-west1
```

### 4. Deploy the Cloud Function

```bash
cd cloud-functions/analysis-logger

gcloud functions deploy logAnalysis \
  --gen2 \
  --runtime=nodejs20 \
  --trigger-http \
  --allow-unauthenticated \
  --region=europe-west1 \
  --memory=256MB \
  --timeout=30s \
  --entry-point=logAnalysis
```

### 5. Set up Firestore TTL Policy (auto-delete after 4 hours)

```bash
gcloud firestore fields ttls update expireAt \
  --collection-group=analysis_logs \
  --enable-ttl
```

### 6. Get the Function URL

After deployment, note the URL from the output. It will look like:
```
https://europe-west1-YOUR_PROJECT_ID.cloudfunctions.net/logAnalysis
```

### 7. Update the client configuration

Update `/src/config.js` with the function URL:
```javascript
ANALYSIS_LOGGER_URL: "https://europe-west1-YOUR_PROJECT_ID.cloudfunctions.net/logAnalysis"
```

## Testing

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"module":"test","inputs":{"gfap_value":100},"results":{"ich":{"probability":0.15}}}' \
  https://europe-west1-YOUR_PROJECT_ID.cloudfunctions.net/logAnalysis
```

## Viewing Logs

### Via Firebase Console
1. Go to Firebase Console > Firestore Database
2. Select `analysis_logs` collection
3. Logs auto-delete after 4 hours

### Via gcloud CLI
```bash
gcloud firestore documents list analysis_logs --project=$PROJECT_ID
```

## Cost Estimate

With ~100 analyses/day:
- Cloud Functions: ~$0 (free tier covers 2M invocations/month)
- Firestore: ~$0 (free tier covers 50K reads, 20K writes/day)
