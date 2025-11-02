# Safety Classification

## Intended Use
The iGFAP Stroke Triage Assistant provides clinicians with probabilistic insights
for Intracerebral Hemorrhage (ICH) and Large Vessel Occlusion (LVO) prediction
based on patient inputs such as GFAP levels, FAST-ED score, and vital signs.

## Safety Relevance
- The software is a **clinical decision support tool**, not an autonomous diagnosis system.
- All predictions are **for research and educational use**.
- Final clinical decisions must remain under physician supervision.

## Risk Justification
| Risk Type | Potential Harm | Mitigation |
|------------|----------------|-------------|
| Incorrect prediction | May mislead triage decision | UI warnings + physician validation required |
| Input errors | Wrong data entered | Input validation, UI guidance |
| Software malfunction | Incorrect visualization | Automated CI testing + manual QA |

**Safety Classification:** Medium — supports human decisions, does not replace them.
