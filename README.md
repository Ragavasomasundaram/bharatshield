# 🛡️ BharatShield
### India Defence Intelligence Dashboard

> **Atmanirbhar Bharat** — Built in India, for India, by Indians.
> Open-source, offline-capable, multilingual threat monitoring dashboard for India.

![Made in India](https://img.shields.io/badge/Made%20in-India%20🇮🇳-orange?style=flat-square)
![Languages](https://img.shields.io/badge/Languages-22%20Indian-blue?style=flat-square)
![License](https://img.shields.io/badge/License-AGPL--3.0-green?style=flat-square)

---

## 🌟 What is BharatShield?

BharatShield is an open-source intelligence and threat monitoring dashboard built specifically for India. It aggregates real-time data from Indian government sources (PIB, NDRF, IMD, CERT-In), classifies threats using an Indian-made AI engine (Djinn AI India), and presents information in all 22 scheduled Indian languages.

**Unlike foreign tools like worldmonitor.io, BharatShield:**
- ✅ Is built on 100% Indian-made core technology (C-DAC + AI4Bharat)
- ✅ Supports all 22 scheduled Indian languages
- ✅ Works fully offline — zero foreign cloud dependency
- ✅ Integrates Indian government data sources
- ✅ Is free and open source under AGPL-3.0

---

## 🏗️ Tech Stack

| Layer | Technology | Made By |
|---|---|---|
| OS | BOSS Linux v10 (Pragya) | C-DAC, Chennai |
| AI Classification | IndicBERT + Djinn AI India | AI4Bharat, IIT Madras |
| Translation API | Bhashini | MeitY, Govt of India |
| Frontend | React + TypeScript + Vite | Open source |
| Map | Leaflet.js + India GeoJSON | Open source |
| Fonts | Google Noto (all Indian scripts) | Google |
| Language UI | i18next | Open source |

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/bharatshield.git
cd bharatshield

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

---

## 🌐 Supported Languages

All 22 scheduled Indian languages from the Eighth Schedule of the Indian Constitution:

Tamil · Hindi · Telugu · Kannada · Malayalam · Marathi · Bengali · Gujarati · Punjabi · Urdu · Odia · Assamese · Sanskrit · Nepali · Maithili · Konkani · Sindhi · Kashmiri · Dogri · Manipuri · Santali · Bodo

---

## 🤖 Djinn AI India — Threat Classification Engine

BharatShield's AI engine operates in two stages:

**Stage 1 — Instant (< 10ms)**
Pattern-matches against 120+ threat keywords in all 22 Indian languages. Returns a threat level immediately with a confidence score.

**Stage 2 — Deep AI (async)**
Calls Claude AI for deep semantic analysis. Overrides Stage 1 result if confidence is higher. Supports all Indian language inputs natively.

**Threat Levels:** 🔴 Critical → 🟠 High → 🟡 Medium → 🟢 Low → 🔵 Safe

---

## 📡 Data Sources (All Free & Public)

| Source | Organisation | Data Type |
|---|---|---|
| PIB RSS | Press Information Bureau | Official Govt news |
| NDRF Alerts | National Disaster Response Force | Disaster alerts |
| IMD API | India Meteorological Department | Weather & cyclone alerts |
| CERT-In | Indian Cyber Emergency Response Team | Cyber threat advisories |
| DD News | Doordarshan | National news |
| Bhashini | MeitY | Translation API |

---

## 🔐 Security Architecture

8-layer security stack from public data collection to zero-trust network:

1. OSINT & Intelligence (SpiderFoot, TheHarvester)
2. Threat Intelligence (MISP, OpenCTI, CERT-In)
3. SIEM + IDS (CDAC SIEM, Wazuh, Suricata)
4. AI Processing (IndicBERT, Ollama, Elasticsearch)
5. Encryption (GnuPG, VeraCrypt, SQLCipher)
6. Authentication (C-DAC Biometrics, Keycloak, FIDO2)
7. Zero Trust Network (WireGuard, NetBird, OpenZiti)
8. Incident Response (TheHive, Cortex, Shuffle SOAR)

---

## 🏆 Project Alignment

| Goal | How BharatShield Contributes |
|---|---|
| Atmanirbhar Bharat | 100% Indian core technology stack |
| Digital India | Multilingual, accessible to all Indians |
| Cyber Surakshit Bharat | Real-time threat monitoring and classification |
| iDEX DISC | Individual innovator defence technology submission |
| DRDO CEPTAM | Portfolio project demonstrating defence AI skills |

---

## 📄 License

AGPL-3.0 — Free for personal, research, and educational use.
Commercial use requires a separate license. Contact via GitHub issues.

---

## 🙏 Acknowledgements

- **AI4Bharat, IIT Madras** — IndicBERT, IndicTrans2, IndicWhisper, all Indian language AI tools
- **C-DAC, India** — BOSS Linux, CDAC SIEM, Biometric Authentication
- **MeitY, Govt of India** — Bhashini Translation API
- **NDRF, IMD, PIB, CERT-In** — Free public data sources

---

*Jai Hind. 🇮🇳*
