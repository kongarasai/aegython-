# AEGISPHERE: Autonomous Cognitive Threat Defense & Deep Network Inspector
> Built specifically for **Aegython 2026** (Organized by **AeglysAI**)  
> **100% Real Live Network Handshakes · Zero Mock/Fake Data**

---

## 🛡️ Project Overview & Selected Challenge Tracks
**AEGISPHERE** addresses three core hackathon problem statements in a single unified SOC cockpit:
1. **Explain My Security Alert**: Ingests raw SIEM/WAF/EDR logs, extracts indicators of compromise (IOCs), maps directly to the MITRE ATT&CK matrix, and dynamically generates actionable step-by-step remediation playbooks.
2. **Smart Login Guardian & Endpoint Defense**: Performs live DNS lookups, real TLS 1.3 cryptographic handshakes, certificate authority auditing, Shannon entropy calculations, and homograph/typosquatting detection.
3. **API Traffic Watch**: Real-time high-throughput API stream monitoring with live Shannon entropy anomaly classification and latency tracking.

---

## 🚀 Live App Access
- **Frontend URL**: `http://localhost:3000/` (or `http://127.0.0.1:3000/`)
- **Backend API**: `http://127.0.0.1:8080/`
- **Interactive Swagger Docs**: `http://127.0.0.1:8080/docs`

---

## ⚡ What Makes It Superior to Veriq (`https://veriq.axiomjisu.tech/`)

| Metric | Veriq (`axiomjisu.tech`) | **AEGISPHERE** |
| :--- | :--- | :--- |
| **Real vs Static Data** | Relies on static preset mocks | **Strict Zero Mock Policy**: Opens live TCP/TLS sockets to port 443 of any host, performs real live DNS queries, and queries genuine Geo-IP registries. |
| **Visual Architecture** | 2D CSS spinning ring (`@keyframes sweep`) | **True Interactive 3D WebGL Threat Globe**: Built with Three.js. Drag to rotate, particle cloud lattice, and real-time 3D coordinate plotting. |
| **Cryptographic Deep Dive** | Basic padlock check | Real X.509 certificate parsing: Issuer CA, cipher suite, negotiated TLS protocol, handshake latency (ms), and expiration audit. |
| **Defensive Header Posture** | None visible | Audits live HSTS (`Strict-Transport-Security`), CSP, X-Frame-Options (Clickjacking defense), and HTTP redirection chains. |
| **Homograph & Brand Spoofing** | Basic dictionary check | Mathematical Shannon Entropy computation + Unicode/Punycode (`xn--`) foreign glyph detection + Brand spoofing heuristics. |
| **SOC Copilot** | Limited to URL check | Full Security Alert Transformer mapping to MITRE ATT&CK tactics (T1190, T1110, T1071, T1498) with automated playbooks. |

---

## 🛠️ Reproducible Setup Instructions

### 1. Backend Engine
```bash
# Navigate to project root
cd c:\Users\ASUS\Downloads\agethin

# Run backend engine (FastAPI + Uvicorn)
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8080
```

### 2. Frontend Cockpit
```bash
# Navigate to frontend
cd c:\Users\ASUS\Downloads\agethin\frontend

# Start Vite React server
npm run dev -- --host 127.0.0.1 --port 3000
```
Then open `http://localhost:3000` in your web browser.
