# Model Governance

## Dataset Provenance
Models trained on anonymized stroke biomarker datasets.  
Sources: Institutional research data (GFAP, BP, FAST-ED).

## Versioning
| File | Description |
|------|--------------|
| `/model/version.json` | Contains model version and checksum |
| `/logic/shap.js` | Feature importance mapping logic |

## Validation
- Accuracy target ≥ 90% for ICH / LVO differentiation.
- Validation dataset locked under `/research/data/validation.json`.

## Model Update Procedure
1. Update model weights and metadata.
2. Validate with reference dataset.
3. Increment version in `version.json`.
4. Push change with tag `model-vX.Y.Z`.
