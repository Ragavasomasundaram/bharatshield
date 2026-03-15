# ARCHITECTURE.md — BharatShield System Design

## Overview

BharatShield is a single-page React application with a serverless API layer.
All AI classification, translation, and data fetching happen through API routes.
The system is designed to run fully offline with local AI models.

---

## Frontend Architecture

```
src/
├── App.tsx                    ← Root component, tab routing, global state
├── i18n.ts                    ← i18next config, all 22 language translations
├── index.css                  ← Global styles, Tailwind, Indian font variables
├── main.tsx                   ← React entry point
├── components/
│   ├── IndiaMap.tsx            ← Leaflet.js India map with threat markers
│   ├── NewsFeed.tsx            ← Scrollable news feed with threat colour coding
│   ├── StatsBar.tsx            ← Dashboard stats (total/critical/high/medium/low/safe)
│   ├── LanguageSelector.tsx    ← 22-language dropdown switcher
│   └── ClassifyTool.tsx        ← Text input → AI threat classification
└── lib/
    ├── types.ts                ← TypeScript interfaces (NewsItem, StateData, etc.)
    ├── mockData.ts             ← Seed data (Indian states, sample news from PIB/NDRF/IMD)
    └── djinn/
        └── classifier.ts       ← Djinn AI India — 2-stage threat engine
```

---

## Djinn AI India — Classification Flow

```
User text input
      ↓
Stage 1: Keyword Matcher (< 10ms)
  - 120+ keywords in 22 Indian languages
  - Returns: level + confidence + keywords
      ↓
UI updates immediately with Stage 1 result
      ↓ (async, parallel)
Stage 2: Claude API (1-3 seconds)
  - Deep semantic analysis
  - Supports all Indian languages natively
  - Returns: level + confidence + category
      ↓
If Stage 2 confidence > Stage 1 confidence:
  UI updates with Stage 2 result
```

---

## Data Flow

```
Indian Govt APIs (PIB, NDRF, IMD, CERT-In)
      ↓
Vercel Edge Functions (api/feeds)
      ↓
RSS Parser + JSON normalisation
      ↓
Djinn AI India classifier (per headline)
      ↓
React state (App.tsx)
      ↓
Components: IndiaMap + NewsFeed + StatsBar
```

---

## Security Layers

```
Layer 1: OSINT          SpiderFoot, TheHarvester, Recon-ng
Layer 2: Threat Intel   MISP, OpenCTI, CERT-In, MITRE ATT&CK
Layer 3: SIEM + IDS     CDAC SIEM (India), Wazuh, Suricata, Zeek
Layer 4: AI Processing  IndicBERT, Ollama (offline), Kafka, Elasticsearch
Layer 5: Encryption     GnuPG, VeraCrypt, SQLCipher, OpenSSL
Layer 6: Auth           C-DAC Biometrics, Keycloak, FIDO2/WebAuthn, TOTP
Layer 7: Zero Trust     WireGuard, NetBird, OpenZiti, Pomerium
Layer 8: IR + Forensics TheHive, Cortex, IRIS, Shuffle SOAR, Velociraptor
```

---

## Offline Mode Architecture

```
BOSS Linux (C-DAC)
  └── Ollama (local LLM — replaces Claude API)
  └── IndicBERT (local AI model — AI4Bharat)
  └── SQLite + SQLCipher (local encrypted database)
  └── WireGuard VPN (local network tunnel)
  └── BharatShield app (no internet required)
```

---

## Deployment Options

| Mode | Stack | Internet Required |
|---|---|---|
| Development | npm run dev (Vite) | Yes |
| Cloud | Vercel (free tier) | Yes |
| Self-hosted | Docker + Nginx | Yes |
| Air-gap | BOSS Linux + Ollama | No |
