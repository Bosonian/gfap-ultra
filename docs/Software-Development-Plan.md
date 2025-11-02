# Software Development Plan (SDP)

## Overview
iGFAP follows an **iterative Agile process** with strict version control and CI/CD integration.
All development is tracked via GitHub Issues and Pull Requests.

## Development Lifecycle
1. Requirement creation (GitHub Issue → Documentation)
2. Code implementation in feature branches
3. Code review and lint check via CI workflow
4. Deployment to Vercel (staging) or GitHub Pages (production)

## Tools & Frameworks
| Category | Tool | Purpose |
|-----------|------|----------|
| Frontend | Vite + TailwindCSS | Build and styling |
| Language | JavaScript (ES2020) | Main application code |
| State Management | `store.js` | Persistent app state |
| Build Automation | GitHub Actions | CI/CD |
| Hosting | GitHub Pages / Vercel | Deployment |
| Backend | Node.js + Google Cloud Functions | API |
| Version Control | Git + GitHub | Source control |

## Configuration and Change Control
- Every feature branch merged via Pull Request.
- Version tags denote production-ready builds.
- Configuration managed via `.env` (not committed).

