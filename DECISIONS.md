# DECISIONS.md — Why I Built BharatShield This Way

This document explains every major technical decision made in BharatShield.
This is what I refer to when interviewers ask "why did you choose X over Y?"

---

## 1. Why React + TypeScript over plain JavaScript?

TypeScript catches errors before the code runs. In a defence intelligence dashboard where wrong data could mislead an analyst, type safety is critical. React was chosen over Angular because it is lighter, has a larger community, and its component model maps perfectly to a dashboard with many independent panels (map, feeds, classifier, stats).

---

## 2. Why Vite over Create React App (CRA)?

CRA is deprecated and slow. Vite starts in under 300ms and handles hot module replacement instantly. For a project where I am actively developing, this saves hours of waiting across months of development.

---

## 3. Why Leaflet.js over Google Maps or Mapbox?

Leaflet.js is 100% open source and works offline. Google Maps and Mapbox require internet connectivity and send data to foreign servers — which directly violates the zero-foreign-dependency principle of BharatShield. Leaflet with CartoDb dark tiles gives a professional look that matches the defence dashboard aesthetic.

---

## 4. Why i18next for language support?

i18next is the industry standard for React internationalisation. It supports runtime language switching (no page reload), lazy loading of language files, and fallback chains (if a translation is missing, fall back to English). This was the only library that could handle 22 languages cleanly without performance degradation.

---

## 5. Why Google Noto fonts?

Noto fonts are the only font family that correctly renders all Indian scripts — Tamil, Devanagari, Telugu, Kannada, Malayalam, Bengali, Gujarati, Gurmukhi, Odia, and more — in the browser without fallback boxes. The name "Noto" comes from "no more tofu" — meaning no more empty boxes where characters should be.

---

## 6. Why a two-stage AI classifier (Djinn AI India)?

Stage 1 (keyword) returns a result instantly — under 10ms. This means the UI never blocks or shows a spinner for classification. Stage 2 (Claude AI) runs asynchronously and updates the result only if its confidence score is higher than Stage 1. This hybrid approach mirrors worldmonitor.io's Djinn AI architecture and is directly explainable in interviews as a conscious engineering decision.

---

## 7. Why Claude API over OpenAI GPT for AI classification?

Claude natively understands all 22 Indian languages without special prompting. Claude Sonnet 4.6 is more cost-effective than GPT-4. Claude's safety model is better aligned with a defence use case where misclassification has real consequences.

---

## 8. Why BOSS Linux as the deployment OS?

BOSS Linux (Bharat Operating System Solutions) is developed by C-DAC, Chennai — a Government of India organisation. It is used by Indian defence and government agencies. Deploying BharatShield on BOSS Linux directly aligns with Atmanirbhar Bharat and makes the iDEX pitch credible. Ubuntu or Windows would undermine the "Indian-made" positioning.

---

## 9. Why AI4Bharat models over multilingual BERT or OpenAI?

AI4Bharat models (IndicBERT, IndicTrans2, IndicWhisper) are trained specifically on Indian language data at IIT Madras. Generic multilingual models like mBERT have poor performance on low-resource Indian languages like Santali, Dogri, and Bodo. AI4Bharat models are free, open source, and can run offline — which is essential for the air-gap deployment scenario.

---

## 10. Why Bhashini API over Google Translate?

Bhashini is the Government of India's official translation and speech API under MeitY. Using Bhashini means: (a) data stays within India, (b) translations are more accurate for Indian official text, (c) the project qualifies as "Made in India" for iDEX purposes. Google Translate sends data to US servers and has no guarantee of accuracy for government terminology.

---

## 11. Why WireGuard over OpenVPN for the network layer?

WireGuard is faster (uses modern cryptography — ChaCha20, Poly1305), simpler (4,000 lines of code vs 70,000 for OpenVPN), and is now part of the Linux kernel. For a project deployed on BOSS Linux, WireGuard integrates natively. OpenVPN is older, slower, and harder to audit for security vulnerabilities.

---

## 12. Why Wazuh over Splunk or IBM QRadar for SIEM?

Wazuh is 100% free and open source. Splunk costs ₹50+ lakhs per year. IBM QRadar is expensive and cloud-dependent. Wazuh provides the same core SIEM functionality — log aggregation, threat detection, compliance monitoring, file integrity checking — at zero cost and can run entirely on-premises on BOSS Linux.

---

## 13. Why modular tab-based layout over a single page?

A single dense page would overwhelm the user with information. Separating Dashboard (map + quick feed), Feeds (full searchable feed), and Classify (AI tool) into tabs allows each use case to have the full screen. This is the same design decision made by worldmonitor.io and most professional intelligence dashboards.

---

## 14. Why AGPL-3.0 license?

AGPL-3.0 ensures that if anyone deploys a modified version of BharatShield as a web service, they must release their source code. This prevents commercial misuse while keeping the project open for research, education, and government use. It is the same license used by worldmonitor.io.
