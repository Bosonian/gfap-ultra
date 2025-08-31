# Stroke Triage Assistant - Project Context

## Restore Point: 2025-08-31 21:50:52 CEST
Successfully fixed mobile ring alignment issues. Both ICH Risk and Volume rings display correctly.

### Git Commit at Restore Point
- Commit: ab9622a (Fix mobile ring alignment by removing transform scale conflicts)
- Date: August 31, 2025, 21:50 CEST
- State: All rings perfectly aligned on mobile devices (iPhone & Android)

### How to Restore to This Exact Point
```bash
# View current status
git log --oneline -5

# Restore to this exact code state (CAUTION: saves current changes first)
git stash                    # Save any current uncommitted changes
git checkout ab9622a         # Go to restore point
# OR to make a new branch from this point:
git checkout -b restore-point-aug31 ab9622a

# To return to latest version
git checkout main

# To see what any file looked like at this point
git show ab9622a:src/ui/screens/results.js
git show ab9622a:src/styles/app.css

# To compare current code with restore point
git diff ab9622a HEAD

# If you need to permanently revert (CAUTION: loses changes after this point)
git reset --hard ab9622a    # Only if you're sure!
```

## Architecture Overview

### Core Structure
- **PWA** built with Vite, vanilla JavaScript (no framework)
- **Deployment**: GitHub Pages at `/0825/` subdirectory
- **Three AI Modules**: 
  - Coma Module (GCS < 8)
  - Limited Module (basic data)
  - Full Module (complete assessment)

### Key Files
```
src/
├── ui/
│   ├── screens/
│   │   ├── welcome.js         # Landing page with module selection
│   │   ├── triage.js          # Initial triage questions
│   │   ├── data-input.js      # Patient data collection
│   │   └── results.js         # Risk visualization with rings
│   └── components/
│       └── brain-visualization.js  # Canvas blood animation
├── logic/
│   ├── api-client.js          # API calls to GCP endpoints
│   └── ich-volume-calculator.js   # Volume calculations
├── styles/
│   └── app.css                # All styling with responsive rules
├── app.js                     # Main app controller
└── config.js                  # API URLs and thresholds
```

### Visual Design Elements

#### Risk Rings Implementation
1. **ICH Risk Ring** (SVG)
   - Background circle: gray, opacity 0.4
   - Progress circle: color changes based on risk (blue→orange→red)
   - Centered percentage display
   - Risk level text below ring (High Risk, Very High Risk, etc.)

2. **ICH Volume Ring** (Canvas)
   - Animated blood fluid with waves
   - Dynamic fill level based on volume
   - Appears only when ICH risk ≥ 50%
   - Robust moving animation using requestAnimationFrame

#### Responsive Breakpoints
- Desktop: 120px rings
- Mobile (≤480px): 100px rings  
- High-DPI Android: 90px rings
- Small phones (≤375px): 80px rings

### Recent Fixes & Improvements

1. **Ring Alignment Fix (Current Restore Point)**
   - Removed CSS transform scale conflicts
   - SVG uses viewBox="0 0 120 120" for scaling
   - Canvas dynamically reads CSS dimensions
   - Consistent absolute positioning

2. **Layout Structure**
   ```html
   <div class="circles-container">
     <div class="rings-row">  <!-- Side-by-side rings -->
       <div class="circle-item"><!-- ICH Risk --></div>
       <div class="circle-item"><!-- Volume --></div>
     </div>
     <div class="risk-level"><!-- Risk text below --></div>
   </div>
   ```

3. **Color Transitions**
   - Fixed threshold logic: `percent > 70` for critical (red)
   - 50-70% shows orange
   - Below 50% shows blue

### API Endpoints (GCP Cloud Functions)
- Coma: `predict_coma_ich`
- Limited: `predict_limited_data_ich`
- Full: `predict_full_stroke`

### Testing Commands
```bash
npm run dev          # Local development
npm run build        # Production build
npm run preview      # Preview production build
```

### Git Workflow
- Always build before pushing
- Commits include: 🤖 Generated with Claude Code
- Main branch deploys to GitHub Pages

### Known Device Testing
- iPhone (various models)
- Android S25 Ultra (high-DPI)
- Responsive design tested 375px - 1920px

### User Preferences
- Clean, minimal commits
- Test before pushing
- No unnecessary documentation files
- Preserve robust animations

## Important Context
- **Language Toggle**: Supports English/German
- **Dark Mode**: Full support with CSS variables
- **Research Mode**: Hidden feature for model comparison
- **GFAP Values**: Critical biomarker (29-10001 pg/mL range)
- **Blood Animation**: Must remain smooth and robust

This file serves as the project memory. Update it when making significant changes.