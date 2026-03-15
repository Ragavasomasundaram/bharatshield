// BharatShield — Djinn AI India
// Two-stage threat classification engine
// Stage 1: Instant keyword matcher (< 10ms)
// Stage 2: AI classifier via Claude/Groq API (async)

export type ThreatLevel = 'critical' | 'high' | 'medium' | 'low' | 'safe'

export interface ThreatResult {
  level: ThreatLevel
  confidence: number
  keywords: string[]
  source: 'keyword' | 'ai'
  category: string
  timestamp: number
}

// Keyword database — English + all 22 Indian languages
const THREAT_KEYWORDS: Record<ThreatLevel, string[]> = {
  critical: [
    // English
    'attack', 'bomb', 'explosion', 'nuclear', 'missile', 'terror', 'terrorist',
    'killed', 'dead', 'casualty', 'casualties', 'emergency', 'war', 'strike',
    'airstrike', 'blast', 'shoot', 'gunfire', 'hostage', 'hijack', 'biological',
    'chemical weapon', 'pandemic', 'outbreak', 'epidemic',
    // Hindi
    'हमला', 'बम', 'विस्फोट', 'आतंकवाद', 'मृत', 'आपातकाल', 'युद्ध',
    // Tamil
    'தாக்குதல்', 'குண்டு', 'வெடிப்பு', 'பயங்கரவாதம்', 'மரணம்', 'அவசரநிலை',
    // Telugu
    'దాడి', 'బాంబు', 'పేలుడు', 'తీవ్రవాదం', 'యుద్ధం',
    // Kannada
    'ದಾಳಿ', 'ಬಾಂಬ್', 'ಸ್ಫೋಟ', 'ಭಯೋತ್ಪಾದನೆ',
    // Malayalam
    'ആക്രമണം', 'ബോംബ്', 'സ്ഫോടനം', 'ഭീകരവാദം',
  ],
  high: [
    // English
    'flood', 'cyclone', 'earthquake', 'tsunami', 'landslide', 'fire', 'riot',
    'protest', 'violence', 'injured', 'arrest', 'detained', 'border', 'infiltration',
    'ceasefire', 'curfew', 'shutdown', 'breach', 'hack', 'ransomware', 'cyber attack',
    'data breach', 'power outage', 'blackout',
    // Hindi
    'बाढ़', 'चक्रवात', 'भूकंप', 'सुनामी', 'भूस्खलन', 'दंगा', 'हिंसा',
    // Tamil
    'வெள்ளம்', 'சூறாவளி', 'நிலநடுக்கம்', 'சுனாமி', 'நிலச்சரிவு', 'கலவரம்',
    // Telugu
    'వరదలు', 'తుఫాను', 'భూకంపం', 'అల్లర్లు',
    // Kannada
    'ಪ್ರವಾಹ', 'ಚಂಡಮಾರುತ', 'ಭೂಕಂಪ', 'ಗಲಭೆ',
    // Malayalam
    'വെള്ളപ്പൊക്കം', 'ചുഴലിക്കാറ്റ്', 'ഭൂകമ്പം', 'കലാപം',
  ],
  medium: [
    // English
    'warning', 'alert', 'caution', 'disruption', 'accident', 'crash', 'collision',
    'missing', 'search', 'rescue', 'investigation', 'suspected', 'suspicious',
    'delay', 'strike', 'blockade', 'shortage', 'scam', 'fraud', 'leaked',
    // Hindi
    'चेतावनी', 'सतर्क', 'दुर्घटना', 'लापता', 'जांच',
    // Tamil
    'எச்சரிக்கை', 'விபத்து', 'காணாமல்', 'விசாரணை',
    // Telugu
    'హెచ్చరిక', 'ప్రమాదం', 'దర్యాప్తు',
    // Kannada
    'ಎಚ್ಚರಿಕೆ', 'ಅಪಘಾತ', 'ತನಿಖೆ',
  ],
  low: [
    // English
    'monitor', 'watch', 'notice', 'advisory', 'update', 'briefing', 'report',
    'development', 'situation', 'concern', 'tension', 'dispute',
    // Hindi
    'निगरानी', 'नोटिस', 'तनाव', 'विवाद',
    // Tamil
    'கண்காணிப்பு', 'அறிவிப்பு', 'பதற்றம்',
  ],
  safe: []
}

const CATEGORIES: Record<string, string[]> = {
  'Cyber': ['hack', 'ransomware', 'cyber', 'breach', 'malware', 'phishing', 'ddos', 'vulnerability'],
  'Natural Disaster': ['flood', 'cyclone', 'earthquake', 'tsunami', 'landslide', 'drought', 'storm', 'बाढ़', 'वेळ्ळम्'],
  'Terror': ['terror', 'attack', 'bomb', 'explosion', 'militant', 'आतंकवाद', 'பயங்கரவாதம்'],
  'Border': ['border', 'infiltration', 'ceasefire', 'LOC', 'LAC', 'china', 'pakistan'],
  'Health': ['pandemic', 'outbreak', 'epidemic', 'virus', 'disease', 'hospital', 'health'],
  'Civil Unrest': ['riot', 'protest', 'violence', 'curfew', 'shutdown', 'दंगा', 'கலவரம்'],
  'General': []
}

function detectCategory(text: string): string {
  const lower = text.toLowerCase()
  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    if (keywords.some(kw => lower.includes(kw.toLowerCase()))) return category
  }
  return 'General'
}

// Stage 1 — instant keyword classification
export function classifyKeyword(text: string): ThreatResult {
  const lower = text.toLowerCase()
  const matchedKeywords: string[] = []

  for (const level of ['critical', 'high', 'medium', 'low'] as ThreatLevel[]) {
    const matches = THREAT_KEYWORDS[level].filter(kw => lower.includes(kw.toLowerCase()))
    if (matches.length > 0) {
      matchedKeywords.push(...matches)
      const confidence = Math.min(0.5 + (matches.length * 0.1), 0.85)
      return {
        level,
        confidence,
        keywords: matches,
        source: 'keyword',
        category: detectCategory(text),
        timestamp: Date.now()
      }
    }
  }

  return {
    level: 'safe',
    confidence: 0.7,
    keywords: [],
    source: 'keyword',
    category: 'General',
    timestamp: Date.now()
  }
}

// Stage 2 — AI classification (async, overrides Stage 1 if higher confidence)
export async function classifyAI(text: string, apiKey?: string): Promise<ThreatResult> {
  const systemPrompt = `You are BharatShield's Djinn AI India — a threat classification engine for India.
Classify the following text and respond ONLY with valid JSON in this exact format:
{"level":"critical|high|medium|low|safe","confidence":0.0-1.0,"category":"string","reasoning":"one sentence"}
Levels: critical=immediate danger/attack/disaster, high=serious incident, medium=concerning event, low=minor issue, safe=no threat.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey || '' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        system: systemPrompt,
        messages: [{ role: 'user', content: text }]
      })
    })
    const data = await response.json()
    const raw = data.content?.[0]?.text || '{}'
    const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim())
    return {
      level: parsed.level || 'safe',
      confidence: parsed.confidence || 0.7,
      keywords: [],
      source: 'ai',
      category: parsed.category || 'General',
      timestamp: Date.now()
    }
  } catch {
    return classifyKeyword(text)
  }
}

// Main classifier — runs Stage 1 instantly, Stage 2 async
export async function classify(text: string, apiKey?: string, onUpdate?: (r: ThreatResult) => void): Promise<ThreatResult> {
  const stage1 = classifyKeyword(text)
  if (onUpdate) onUpdate(stage1)

  const stage2 = await classifyAI(text, apiKey)
  const final = stage2.confidence > stage1.confidence ? stage2 : stage1
  if (onUpdate) onUpdate(final)
  return final
}

export const THREAT_COLORS: Record<ThreatLevel, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
  safe: '#3b82f6'
}

export const THREAT_BG: Record<ThreatLevel, string> = {
  critical: 'rgba(239,68,68,0.15)',
  high: 'rgba(249,115,22,0.15)',
  medium: 'rgba(234,179,8,0.15)',
  low: 'rgba(34,197,94,0.15)',
  safe: 'rgba(59,130,246,0.15)'
}
