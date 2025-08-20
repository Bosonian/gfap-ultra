# Stroke Triage Assistant - Professional Edition

A modular, professional stroke triage assistant for emergency medical services, providing ICH and LVO risk assessment using GFAP biomarkers and clinical data.

## 🚨 Emergency Tool

This is a time-critical medical decision support tool designed for healthcare professionals in emergency settings.

## Features

- **Modular Architecture**: Clean separation of concerns with ES modules
- **Real-time API Integration**: Connects to cloud-based prediction models
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Accessibility**: Full ARIA support and keyboard navigation
- **Dark Mode**: Automatic and manual theme switching
- **Offline Capability**: Progressive web app features
- **Print Support**: Professional printable reports

## Architecture

```
stroke-triage/
├─ index.html                 # Minimal HTML shell
├─ src/
│  ├─ main.js                 # App bootstrap
│  ├─ config.js               # API URLs, thresholds, settings
│  ├─ api/
│  │  └─ client.js            # API client with timeout & error handling
│  ├─ state/
│  │  └─ store.js             # Central state management
│  ├─ ui/
│  │  ├─ render.js            # Main render controller
│  │  ├─ a11y.js              # Accessibility helpers
│  │  ├─ screens/             # Individual screen components
│  │  │  ├─ triage1.js        # Coma assessment
│  │  │  ├─ triage2.js        # Examination capability
│  │  │  ├─ coma.js           # Coma module form
│  │  │  ├─ limited.js        # Limited data module form
│  │  │  ├─ full.js           # Full stroke assessment form
│  │  │  └─ results.js        # Results display
│  │  └─ components/          # Reusable UI components
│  │     ├─ progress.js       # Progress indicator
│  │     ├─ drivers.js        # SHAP driver visualization
│  │     ├─ alerts.js         # Critical alerts
│  │     └─ recommendations.js # Clinical recommendations
│  ├─ logic/
│  │  ├─ validate.js          # Form validation
│  │  ├─ handlers.js          # Event handlers & navigation
│  │  ├─ formatters.js        # Data formatting utilities
│  │  └─ shap.js              # SHAP driver normalization
│  └─ styles/
│     └─ app.css              # Complete CSS (unchanged from original)
```

## API Endpoints

The application connects to three Google Cloud Functions:

- **COMA ICH**: `https://europe-west3-igfap-452720.cloudfunctions.net/predict_coma_ich`
- **LDM ICH**: `https://europe-west3-igfap-452720.cloudfunctions.net/predict_limited_data_ich`
- **FULL STROKE**: `https://europe-west3-igfap-452720.cloudfunctions.net/predict_full_stroke`

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Modern web browser with ES modules support

### Installation & Development

```bash
# Clone or extract the project
cd stroke-triage

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage Flow

1. **Initial Triage**: Assess if patient is comatose (GCS < 8)
2. **Module Selection**: 
   - **Comatose** → Coma Module (ICH only)
   - **Conscious** → Check examination capability
     - **Examinable** → Full Stroke Module (ICH + LVO)
     - **Limited** → Limited Data Module (ICH only)
3. **Data Entry**: Complete the selected assessment module
4. **Results**: View predictions with risk levels and clinical recommendations
5. **Print/Export**: Generate professional report

## Clinical Modules

### Coma Module
- **Purpose**: ICH prediction for comatose patients
- **Required**: GFAP value only
- **Output**: ICH probability with basic recommendations

### Limited Data Module  
- **Purpose**: ICH prediction when full examination isn't possible
- **Required**: Age, BP, GFAP, basic symptoms
- **Output**: ICH probability (LVO assessment not possible)

### Full Stroke Module
- **Purpose**: Complete stroke assessment
- **Required**: Demographics, vitals, biomarkers, neurological exam
- **Output**: Both ICH and LVO probabilities with SHAP drivers

## Driver Visualization

The app handles multiple driver formats from the backend:

- **SHAP Values**: Feature importance from tree models
- **Logistic Contributions**: Linear model coefficients  
- **Raw Weights**: Direct feature impacts

All formats are normalized and displayed with:
- Positive drivers (increase risk) in red
- Negative drivers (decrease risk) in green
- Metadata (base values, contribution sums) when available

## Configuration

Key settings in `src/config.js`:

```javascript
// API endpoints
export const API_URLS = {
  COMA_ICH: 'https://...',
  LDM_ICH: 'https://...',
  FULL_STROKE: 'https://...'
};

// Risk thresholds
export const CRITICAL_THRESHOLDS = {
  ich: { high: 60, critical: 80 },
  lvo: { high: 50, critical: 70 }
};

// GFAP reference ranges
export const GFAP_RANGES = {
  min: 29, max: 10001,
  normal: 100, elevated: 500, critical: 1000
};
```

## Security & Privacy

- **Local Processing**: All calculations performed locally
- **No Data Storage**: Patient data never stored or transmitted to third parties
- **CORS Enabled**: Secure API communication
- **Input Validation**: Comprehensive client-side validation
- **Session Management**: Automatic cleanup and timeout

## Browser Support

- Chrome 88+
- Firefox 84+  
- Safari 14+
- Edge 88+

## Development

### Project Structure

- **ES Modules**: Native module system, no bundling in development
- **Vanilla JavaScript**: No framework dependencies
- **CSS Variables**: Theme-able design system
- **Progressive Enhancement**: Works without JavaScript for basic functionality

### Code Style

- **Modular**: Single responsibility principle
- **Functional**: Prefer pure functions and immutable data
- **Accessible**: ARIA-first design
- **Responsive**: Mobile-first CSS

### Testing the Build

```bash
# Test development server
npm run dev
# Visit http://localhost:3000

# Test production build  
npm run build && npm run preview
# Visit http://localhost:3001
```

## Deployment

### Static Hosting

The built application is a static site that can be deployed to:

- Netlify
- Vercel  
- GitHub Pages
- Amazon S3 + CloudFront
- Google Cloud Storage
- Any static web server

### Environment Variables

No environment variables required. All configuration is in `src/config.js`.

### Build Output

```
dist/
├─ index.html
├─ assets/
│  ├─ index-[hash].js
│  └─ index-[hash].css
└─ (other static assets)
```

## Troubleshooting

### Common Issues

1. **API Errors**: Check network connectivity and endpoint URLs
2. **Validation Errors**: Ensure all required fields are completed
3. **Print Issues**: Use Chrome or Firefox for best print results
4. **Dark Mode**: Preference saved in localStorage

### Debug Mode

Open browser console for detailed event logging and error messages.

## Medical Disclaimer

⚠️ **For clinical decision support only**

This tool is designed to assist healthcare professionals and should not replace clinical judgment. Always follow institutional protocols and guidelines. Results are probabilistic estimates based on available data.

## Version

**v2.0.1** - Modular Professional Edition

## License

Proprietary - iGFAP Project

---

## Support

For technical issues or feature requests, contact the development team.