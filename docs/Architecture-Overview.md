# Architecture Overview

## System Layers
- **Core Logic:** Medical prediction & inference modules.
- **UI Layer:** Screens, components, renderers.
- **State Layer:** Centralized data store and sync logic.
- **API Layer:** Secure backend communication.

## Module Map

| Directory | Purpose | Safety Relevance |
|------------|----------|------------------|
| `core/` | Application bootstrap, lifecycle, and routing | High |
| `logic/` | ICH/LVO computation, SHAP driver analysis | High |
| `ui/screens/` | Contains individual screen components that handle rendering of each major UI view | Medium |
| `ui/components/` | Reusable UI widgets (rings, gauges, modals) | Medium |
| `state/` | Central store for patient data and session state | High |
| `api/` | Handles Cloud Function requests | Medium |
| `research/` | Data logging and model comparison utilities | Low |
| `assets/` | Icons, manifest, PWA config | Low |


## Interfaces
- **Input:** Browser UI (form, FAST-ED score)
- **Output:** DOM visualization + Print Result
- **API:** Secure HTTPS fetch calls (for model updates)
