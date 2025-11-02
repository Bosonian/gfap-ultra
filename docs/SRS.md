# Software Requirements Specification (SRS)

## Functional Requirements

| ID | Requirement | Acceptance Criteria |
|----|--------------|--------------------|
| R1 | The system shall calculate ICH probability | Display percentage (0–100%) with risk visualization |
| R2 | The system shall calculate LVO probability | Display percentage (0–100%) with ring/gauge chart |
| R3 | The user shall input patient parameters | Input fields validate before submission |
| R4 | The UI shall visualize results dynamically | Smooth gauge animations and alerts |
| R5 | The system shall support light/dark mode | Mode toggle persists session |
| R6 | The system shall provide print/export results | Click "Print Results" → open PDF print dialog |
| R7 | The system shall operate offline (PWA) | App installable via browser prompt |

## Non-Functional Requirements
- **Performance:** <2s render time for main results.
- **Usability:** Works on mobile, tablet, and desktop.
- **Security:** No patient data stored or transmitted.
- **Reliability:** CI tests must pass before deployment.
