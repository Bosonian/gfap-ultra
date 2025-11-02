# Threat Model

| Asset | Threat | Mitigation | Residual Risk |
|--------|--------|-------------|----------------|
| API endpoints | Unauthorized requests | HTTPS + Auth key | Low |
| Model files | Tampering | SHA256 hash check | Low |
| Local storage | Data leak | Anonymized, ephemeral session | Minimal |
| UI Inputs | XSS or injection | Input sanitization | Minimal |
| GitHub Actions | Secret exposure | Scoped tokens only | Minimal |
