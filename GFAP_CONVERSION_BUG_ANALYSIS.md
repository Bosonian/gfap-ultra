# GFAP Conversion Bug Analysis

**Date**: December 5, 2025
**Scope**: Limited and Full Stroke modules
**Focus**: Potential plasma/whole blood value confusion

---

## Executive Summary

✅ **NO CRITICAL BUGS FOUND** in GFAP conversion logic

The system correctly:
- Only accepts whole blood GFAP values
- Converts to plasma scale before API calls
- Stores both original and converted values
- Displays original values in results summary

However, there are **2 MINOR UX ISSUES** that could cause confusion.

---

## Analysis Results

### 1. Form Input Configuration ✅ CORRECT

**Limited Module** (`src/ui/screens/limited.js:68-79`):
```javascript
<input type="number" name="gfap_value" id="gfap_value"
       min="${GFAP_RANGES.wholeblood.min}" max="${GFAP_RANGES.wholeblood.max}"
       step="0.1" required>
<input type="hidden" id="gfap_cartridge_type" value="wholeblood">
```

**Full Module** (`src/ui/screens/full.js:81-93`):
```javascript
<input type="number" name="gfap_value" id="gfap_value"
       min="${GFAP_RANGES.wholeblood.min}" max="${GFAP_RANGES.wholeblood.max}"
       step="0.1" required>
<input type="hidden" id="gfap_cartridge_type" value="wholeblood">
<input type="hidden" id="gfap_displayed_value" value="">
```

✅ **Status**: Both modules correctly configured to accept ONLY whole blood values

---

### 2. Conversion Logic ✅ CORRECT

**File**: `src/logic/handlers.js:115-142`

**Coma Module** (Abbott Passing-Bablok):
```javascript
if (module === "coma") {
  const ABBOTT_SLOPE = 0.94;
  const ABBOTT_INTERCEPT = -1.34;
  const originalValue = inputs.gfap_value;
  inputs.gfap_value = (ABBOTT_SLOPE * originalValue) + ABBOTT_INTERCEPT;
  inputs.gfap_value_original = originalValue; // ← Saves original
}
```

**Limited & Full Modules** (Harmonization):
```javascript
else {
  inputs.gfap_value_original = inputs.gfap_value; // ← Saves original
  conversionFactor = 0.46;
  inputs.gfap_value = inputs.gfap_value * conversionFactor;
}
```

✅ **Status**: Conversion logic is correct
✅ **Storage**: Both original (whole blood) and converted (plasma) values stored

---

### 3. API Communication ✅ CORRECT

**Cloud Functions receive converted plasma values**:
- Limited ICH: `gfap_value` = plasma scale (×0.46)
- Full Stroke: `gfap_value` = plasma scale (×0.46)
- Coma ICH: `gfap_value` = Abbott equation (0.94x - 1.34)

✅ **Status**: APIs receive correctly converted values

---

## Potential Issues Identified

### ⚠️ ISSUE 1: Results Display Shows Original Whole Blood Value

**File**: `src/ui/screens/results.js:40-52`

```javascript
.filter(([key, _]) => key !== "gfap_cartridge_type" && key !== "gfap_value_original")
.map(([key, value]) => {
  // For GFAP value, use the original (user-entered) value if it exists
  let displayVal = value;
  if (key === "gfap_value" && data.gfap_value_original) {
    displayVal = data.gfap_value_original; // ← Shows whole blood value
  }
  // ...
})
```

**What happens**:
1. User enters: 100 pg/mL (whole blood)
2. Converted to: 46 pg/mL (plasma) - sent to API
3. Results summary shows: "GFAP: **100 pg/mL**" (original whole blood)

**Impact**:
- ⚠️ **CONFUSING**: Users see the original whole blood value
- ⚠️ **EDUCATIONAL ISSUE**: Users don't know conversion happened
- ✅ **NOT A BUG**: The original value is technically correct (it's what they entered)

**Recommendation**: Add clarification text
```javascript
displayValue = `${data.gfap_value_original} pg/mL (whole blood)`;
// Or show both:
displayValue = `${data.gfap_value_original} → ${value.toFixed(1)} pg/mL (plasma scale)`;
```

---

### ⚠️ ISSUE 2: No Form Restoration When Clicking Back

**File**: No form restoration logic found in form screens

**Current Behavior**:
1. User enters data in Limited module
2. Click "Calculate"
3. See results
4. Click "Back" button
5. Form is **EMPTY** (all data lost)

**Expected Behavior**:
1. User enters data
2. Calculate results
3. Click "Back"
4. Form shows **ORIGINAL VALUES** (whole blood)

**Impact**:
- ⚠️ **BAD UX**: Users must re-enter all data if they want to adjust
- ✅ **NOT A BUG**: Data is not lost (stored in state), just not restored to form

**Current State Management**:
```javascript
// State stores formData:
formData = {
  limited: {
    age_years: 82,
    systolic_bp: 150,
    diastolic_bp: 90,
    gfap_value: 46,           // ← Converted plasma value
    gfap_value_original: 100, // ← Original whole blood value
    vigilanzminderung: false
  }
}
```

**CRITICAL QUESTION**: If user clicks Back and form WAS restored, which value should populate the GFAP field?

- ❌ **Option A**: `gfap_value` (46 plasma) → Would get converted AGAIN to 21.16 (WRONG!)
- ✅ **Option B**: `gfap_value_original` (100 whole blood) → Would convert to 46 again (CORRECT!)

**Recommendation**:
- If form restoration is implemented, MUST use `gfap_value_original`
- Add comment explaining this critical logic

---

## Test Scenarios

### Scenario 1: Normal Flow (No Back Button) ✅ WORKS

```
User enters: GFAP = 100 pg/mL
  ↓
Handler converts: 100 × 0.46 = 46 pg/mL
  ↓
Stored: gfap_value=46, gfap_value_original=100
  ↓
API receives: 46 pg/mL (plasma) ✓
  ↓
Results show: "GFAP: 100 pg/mL" (original)
```

**Result**: ✅ Correct

---

### Scenario 2: Back Button (Current Behavior) ✅ SAFE

```
User enters: GFAP = 100 pg/mL
  ↓
Calculate → Results
  ↓
Click "Back"
  ↓
Form is EMPTY (no restoration)
  ↓
User must re-enter data
```

**Result**: ✅ Annoying but SAFE (no double-conversion bug)

---

### Scenario 3: Back Button with Restoration (HYPOTHETICAL) ⚠️ POTENTIAL BUG

**If form restoration was implemented incorrectly**:

```
User enters: GFAP = 100 pg/mL
  ↓
Converted: 46 pg/mL (plasma)
  ↓
Stored: gfap_value=46, gfap_value_original=100
  ↓
Click "Back"
  ↓
Form restored with: gfap_value=46 ❌ (WRONG FIELD!)
  ↓
User submits again
  ↓
Converted AGAIN: 46 × 0.46 = 21.16 ❌ (DOUBLE CONVERSION!)
```

**Result**: ❌ **CRITICAL BUG** (but currently not present because no form restoration)

---

## Recommendations

### 1. Add Clarification to Results Display (Priority: LOW)

**Current**:
```
GFAP Value: 100 pg/mL
```

**Recommended**:
```
GFAP Value: 100 pg/mL (whole blood)
  Plasma equivalent: 46 pg/mL (used for prediction)
```

### 2. Implement Form Restoration with Safeguard (Priority: MEDIUM)

**If form restoration is added**:
```javascript
function restoreFormData(module) {
  const data = store.getFormData(module);

  // CRITICAL: Use original whole blood value for GFAP
  // to prevent double-conversion bug!
  if (data.gfap_value_original) {
    document.getElementById('gfap_value').value = data.gfap_value_original;
  }

  // Restore other fields normally
  document.getElementById('age_years').value = data.age_years;
  // etc...
}
```

### 3. Add Unit Test for Double-Conversion Bug (Priority: HIGH)

**Test case**:
```javascript
test('GFAP conversion should not double-convert on re-submission', () => {
  // First submission
  const inputs1 = { gfap_value: 100 };
  handler.convert(inputs1, 'limited');
  expect(inputs1.gfap_value).toBe(46); // 100 × 0.46
  expect(inputs1.gfap_value_original).toBe(100);

  // Simulate re-submission with ORIGINAL value
  const inputs2 = { gfap_value: inputs1.gfap_value_original };
  handler.convert(inputs2, 'limited');
  expect(inputs2.gfap_value).toBe(46); // Still 46, not 21.16!
});
```

---

## Summary

| Item | Status | Risk | Action Needed |
|------|--------|------|---------------|
| **Form accepts only whole blood** | ✅ Correct | None | None |
| **Conversion logic** | ✅ Correct | None | None |
| **API receives plasma values** | ✅ Correct | None | None |
| **Results display clarity** | ⚠️ Could be clearer | Low | Optional improvement |
| **Form restoration** | ⚠️ Not implemented | Low | Optional feature |
| **Double-conversion guard** | ✅ Safe (no restoration) | None | Add safeguard if restoration added |

---

## Conclusion

**NO CRITICAL BUGS FOUND** in GFAP conversion system.

The current implementation is **SAFE** because:
1. ✅ Only whole blood values accepted
2. ✅ Conversion happens correctly (0.46 factor)
3. ✅ Original values preserved
4. ✅ No form restoration = No double-conversion risk

**Minor UX improvements** recommended but not urgent.

---

**Technical Lead**: Deepak Bos
**Audit Date**: December 5, 2025
**Status**: PASS (with minor UX recommendations)
