# GFAP Cartridge Harmonization: Technical Implementation Report

**Author**: Deepak Bos
**Date**: November 19, 2025
**Version**: 1.0 - Clinical Cut-Off Ratio Method

---

## Executive Summary

This document describes the implementation of GFAP value harmonization between legacy Plasma cartridges and new Whole Blood cartridges in the iGFAP Stroke Triage Assistant. The harmonization uses a **clinical cut-off ratio method** (k=0.46) to align the decision boundaries of the two assay systems.

**Key Decision**:
- **Harmonization Factor**: k = 30/65 ≈ **0.46**
- **Rationale**: Clinical cut-off alignment (Plasma 30 pg/mL ≈ Whole Blood 65 pg/mL)
- **Validation**: Multi-center prospective study will test this hypothesis
- **Contingency**: Model retraining with real-world data if hypothesis proves incorrect

---

## 1. Problem Definition: Assay Transition

### 1.1 Legacy Training Environment

**Device**: Abbott i-STAT Plasma TBI Cartridge (discontinued)
**Diagnostic Cut-off**: 30 pg/mL
**Model Training**: All ML models (Coma ICH, Limited ICH, Full ICH, Full LVO) trained on Plasma cartridge data
**Decision Logic**: Values > 30 pg/mL = elevated/pathological

### 1.2 New Clinical Environment

**Device**: Abbott i-STAT Whole Blood TBI Cartridge (current)
**Diagnostic Cut-off**: 65 pg/mL
**Clinical Reality**: Plasma cartridges no longer available
**Decision Logic**: Values > 65 pg/mL = elevated/pathological

### 1.3 The Core Challenge

Without harmonization, a "normal" whole blood value (e.g., 47 pg/mL, below 65 cut-off) would be interpreted as "elevated" by models trained on plasma scale (47 > 30), leading to **false positives**.

**Example Case** (reported by Prof. Förch):
- Patient GFAP: 47 pg/mL (Whole Blood cartridge)
- Clinical Reality: **NEGATIVE** (47 < 65 pg/mL cut-off)
- Model Perception (without harmonization): **POSITIVE** (47 > 30 pg/mL cut-off)
- Result: False positive ICH prediction

---

## 2. Harmonization Strategy: Clinical Cut-Off Ratio

### 2.1 Theoretical Foundation

**Assumption**: The biological threshold for ICH pathology remains constant regardless of the measurement device.

**Hypothesis**: If 30 pg/mL on the plasma cartridge represents the pathology threshold, and 65 pg/mL on the whole blood cartridge represents the same threshold, then the two scales are related by the ratio of these cut-offs.

**Mathematical Derivation**:

```
k = Plasma_Cutoff / WholeBlood_Cutoff
k = 30 pg/mL / 65 pg/mL
k ≈ 0.46
```

### 2.2 Harmonization Formula

**For model input**:
```
GFAP_Harmonized = GFAP_WholeBlood × 0.46
```

**Validation Example**:
```
User Input (WB): 65 pg/mL (borderline positive on WB cartridge)
Harmonized:      65 × 0.46 = 29.9 pg/mL
Model Input:     ~30 pg/mL (borderline positive on plasma scale)
Result:          ✅ Decision boundaries perfectly aligned
```

### 2.3 Implementation

**Location**: `src/logic/handlers.js` (lines 115-126)

```javascript
// Harmonize GFAP from whole blood cartridge to legacy plasma cartridge scale
// Using clinical cut-off ratio: k = 30 pg/mL (plasma) / 65 pg/mL (whole blood) = 0.46
if ((module === "full" || module === "coma" || module === "limited") && inputs.gfap_value) {
  const cartridgeType = form.elements["gfap_cartridge_type"]?.value || "plasma";
  if (cartridgeType === "wholeblood") {
    // Harmonization factor: aligns whole blood cartridge scale (65 pg/mL cut-off)
    // to legacy plasma cartridge scale (30 pg/mL cut-off) that models were trained on
    const WHOLE_BLOOD_HARMONIZATION_FACTOR = 0.46;
    inputs.gfap_value = inputs.gfap_value * WHOLE_BLOOD_HARMONIZATION_FACTOR;
    console.log(`[Submit] GFAP harmonized from whole blood cartridge scale (${module} module): ${inputs.gfap_value.toFixed(2)} pg/mL`);
  }
}
```

---

## 3. Clinical Examples

### Example 1: Normal Patient
```
WB Cartridge Reading: 40 pg/mL
Clinical Status:      NEGATIVE (40 < 65)
Harmonized Value:     40 × 0.46 = 18.4 pg/mL
Model Prediction:     Low ICH risk (18.4 < 30)
Result:               ✅ Correct (TN - True Negative)
```

### Example 2: Prof. Förch's Case
```
WB Cartridge Reading: 47 pg/mL
Clinical Status:      NEGATIVE (47 < 65)
Harmonized Value:     47 × 0.46 = 21.6 pg/mL
Model Prediction:     Low ICH risk (21.6 < 30)
Result:               ✅ Correct (TN - prevents false positive)
```

### Example 3: Borderline Positive
```
WB Cartridge Reading: 65 pg/mL
Clinical Status:      BORDERLINE (≈ 65 cut-off)
Harmonized Value:     65 × 0.46 = 29.9 pg/mL
Model Prediction:     Borderline (≈ 30 cut-off)
Result:               ✅ Decision boundary preserved
```

### Example 4: Clearly Positive
```
WB Cartridge Reading: 200 pg/mL
Clinical Status:      POSITIVE (200 >> 65)
Harmonized Value:     200 × 0.46 = 92 pg/mL
Model Prediction:     High ICH risk (92 >> 30)
Result:               ✅ Correct (TP - True Positive)
```

---

## 4. Multi-Center Study Validation

### 4.1 Study Design

**Purpose**: Validate the 0.46 harmonization hypothesis with real-world prospective data

**Method**:
- Multi-center prospective observational study
- All patients measured with Whole Blood cartridges
- GFAP values harmonized using k=0.46 before model input
- Clinical outcomes collected (confirmed ICH/LVO via imaging)

**Primary Endpoint**:
- Diagnostic accuracy (sensitivity, specificity, AUC) using harmonized values
- Compare to original validation studies with plasma cartridges

**Hypothesis**:
- Harmonized WB cartridge predictions will match original plasma-based performance
- Non-inferiority margin: ΔA UC < 0.05

### 4.2 Sample Size

**Target**: N = 200 (100 ICH+, 100 LVO+)

**Statistical Power**:
- α = 0.05 (two-sided)
- Power = 0.80
- Expected effect: <5 percentage points difference in AUC

### 4.3 Contingency Plan

**If hypothesis fails** (harmonized predictions significantly differ from expected):
1. Analyze collected data to derive empirical conversion formula
2. Retrain models using prospective whole blood cartridge data
3. Update PWA with retrained models
4. Re-validate before clinical deployment

---

## 5. Comparison: 0.46 vs 0.94

### 5.1 Why NOT 0.94?

**Abbott Specification**: 0.94 represents the **sample matrix conversion** (biological difference between plasma and whole blood samples).

**Problem**: This only applies if the **same cartridge/assay** is used on both sample types. Our situation is different:
- **Different cartridges**: Plasma cartridge (30 pg/mL cut-off) vs WB cartridge (65 pg/mL cut-off)
- **Different calibrations**: Each cartridge calibrated to its own reference range

**If we used 0.94**:
```
WB Reading: 65 pg/mL (borderline positive)
Converted:  65 × 0.94 = 61 pg/mL
Model sees: 61 pg/mL >> 30 pg/mL
Result:     ❌ FALSE POSITIVE (decision boundary not aligned)
```

### 5.2 Why 0.46?

**Rationale**: Aligns the clinical decision boundaries of two different assay systems.

**Assumption**: The biological threshold for pathology is the same; the two cartridges just report it on different numeric scales.

**Validation**:
```
WB Reading: 65 pg/mL (borderline positive on WB scale)
Harmonized: 65 × 0.46 = 30 pg/mL
Model sees: 30 pg/mL (borderline positive on plasma scale)
Result:     ✅ Decision boundaries perfectly aligned
```

---

## 6. Risk Mitigation

### 6.1 Transparency

**Study Protocol**: Explicitly states harmonization method
**Informed Consent**: Participants informed about model training/harmonization
**Regulatory Documentation**: Complete traceability of harmonization logic

### 6.2 Quality Control

**Data Validation**:
- Each GFAP entry tagged with cartridge type
- Harmonization automatically logged in console
- Audit trail for all conversions

**Monitoring**:
- Real-time performance tracking during study
- Early stopping rules if unexpected prediction patterns emerge

### 6.3 Fallback Strategy

**If k=0.46 proves incorrect**:
1. Multi-center study data provides empirical calibration
2. Derive data-driven conversion formula via linear regression
3. Retrain models if necessary
4. Update PWA with validated approach

**Study Timeline**: 6-12 months data collection
**Decision Point**: Interim analysis at N=100

---

## 7. Implementation Checklist

✅ **Code Updated**:
- `handlers.js`: Harmonization factor changed to 0.46
- `render.js`: UI conversion logic updated to 0.46
- `messages.js`: User-facing text updated (EN/DE)

✅ **Documentation Created**:
- Technical implementation report (this document)
- Clinical rationale documented
- Validation strategy defined

⏸️ **Pending**:
- Multi-center study initiation
- Real-world validation data collection
- Model performance monitoring

---

## 8. References

1. **Abbott Point of Care** (2024). *i-STAT TBI Plasma Cartridge - Product Insert* (Discontinued).
2. **Abbott Point of Care** (2025). *i-STAT TBI Whole Blood Cartridge - Product Insert*. Cut-off: 65 pg/mL.
3. **Prof. Förch Clinical Report** (Nov 2025). False positive case with 47 pg/mL WB reading.
4. **Harmonization Protocol**: Clinical cut-off ratio method, k = 30/65 = 0.46.

---

## 9. Glossary

**Harmonization**: Process of aligning values from two different measurement scales to enable comparison

**Clinical Cut-Off**: Diagnostic threshold that separates normal from pathological values

**k-Factor**: Harmonization multiplier (0.46) derived from ratio of clinical cut-offs

**WB**: Whole Blood cartridge (new, current use)

**Plasma**: Plasma cartridge (legacy, used for model training)

---

**End of Report**

**Next Steps**:
1. Deploy updated PWA with k=0.46 harmonization
2. Initiate multi-center prospective study
3. Collect real-world validation data
4. Analyze results and refine approach if needed
