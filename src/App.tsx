import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import IndiaMap from './components/IndiaMap'
import NewsFeed from './components/NewsFeed'
import StatsBar from './components/StatsBar'
import LanguageSelector from './components/LanguageSelector'
import ClassifyTool from './components/ClassifyTool'
import { MOCK_NEWS, INDIA_STATES } from './lib/mockData'
import { classifyKeyword } from './lib/djinn/classifier'
import type { NewsItem, DashboardStats } from './lib/types'

type Tab = 'dashboard' | 'feeds' | 'classify'

export default function App() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<Tab>('dashboard')
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterLevel, setFilterLevel] = useState<string>('all')
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [stats, setStats] = useState<DashboardStats>({
    totalAlerts: 0, criticalCount: 0, highCount: 0,
    mediumCount: 0, lowCount: 0, safeCount: 0, lastUpdated: ''
  })

  const loadData = useCallback(() => {
    setLoading(true)
    setTimeout(() => {
      const classified = MOCK_NEWS.map(item => {
        if (!item.threatLevel) {
          const result = classifyKeyword(item.title + ' ' + item.description)
          return { ...item, threatLevel: result.level, threatConfidence: result.confidence, threatCategory: result.category }
        }
        return item
      })
      setNews(classified)
      setStats({
        totalAlerts: classified.length,
        criticalCount: classified.filter(n => n.threatLevel === 'critical').length,
        highCount: classified.filter(n => n.threatLevel === 'high').length,
        mediumCount: classified.filter(n => n.threatLevel === 'medium').length,
        lowCount: classified.filter(n => n.threatLevel === 'low').length,
        safeCount: classified.filter(n => n.threatLevel === 'safe').length,
        lastUpdated: new Date().toISOString()
      })
      setLastUpdated(new Date())
      setLoading(false)
    }, 600)
  }, [])

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 60000)
    return () => clearInterval(interval)
  }, [loadData])

  const filtered = news.filter(item => {
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase())
    const matchLevel = filterLevel === 'all' || item.threatLevel === filterLevel
    return matchSearch && matchLevel
  })

  return (
    <div style={{ minHeight: '100vh', background: '#060d1a', color: '#e2e8f0', display: 'flex', flexDirection: 'column', fontFamily: 'Noto Sans, sans-serif' }}>

      {/* ── Header ── */}
      <header style={{ background: '#0d1b2a', borderBottom: '1px solid #1e3a5f', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF9933' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffffff' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#138808' }} />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: 1 }}>BharatShield</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>India Defence Intelligence Dashboard</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#22c55e' }}>
            <div className="pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e' }} />
            {t('live')}
          </div>
          <span style={{ fontSize: 11, color: '#475569' }}>
            {t('last_updated')}: {lastUpdated.toLocaleTimeString()}
          </span>
          <button onClick={loadData} style={{ fontSize: 12, color: '#64748b', background: '#1e293b', border: '1px solid #334155', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>↺ Refresh</button>
          <LanguageSelector />
        </div>
      </header>

      {/* ── Nav Tabs ── */}
      <nav style={{ background: '#0d1b2a', borderBottom: '1px solid #1e3a5f', padding: '0 20px', display: 'flex', gap: 4 }}>
        {([
          ['dashboard', '🗺️ ' + t('dashboard')],
          ['feeds', '📰 ' + t('feeds')],
          ['classify', '🤖 ' + t('classify')]
        ] as [Tab, string][]).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: '12px 16px', fontSize: 13, fontWeight: 500, border: 'none', background: 'none', cursor: 'pointer',
            borderBottom: tab === id ? '2px solid #3b82f6' : '2px solid transparent',
            color: tab === id ? '#60a5fa' : '#64748b',
            transition: 'all 0.15s'
          }}>{label}</button>
        ))}
      </nav>

      {/* ── Main ── */}
      <main style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Stats Bar — always visible */}
        <StatsBar stats={stats} />

        {/* ── Dashboard Tab ── */}
        {tab === 'dashboard' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>

            {/* India Map */}
            <div style={{ background: '#0d1b2a', border: '1px solid #1e3a5f', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                <div className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6' }} />
                {t('india_map')}
              </div>
              <div style={{ height: 440 }}>
                <IndiaMap states={INDIA_STATES} />
              </div>
            </div>

            {/* News Feed below map */}
            <div style={{ background: '#0d1b2a', border: '1px solid #1e3a5f', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                <div className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#f97316' }} />
                {t('news_feed')} — Latest Alerts
              </div>
              <div style={{ maxHeight: 380, overflowY: 'auto' }}>
                <NewsFeed items={news.slice(0, 8)} loading={loading} />
              </div>
            </div>
          </div>
        )}

        {/* ── Feeds Tab ── */}
        {tab === 'feeds' && (
          <div style={{ background: '#0d1b2a', border: '1px solid #1e3a5f', borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16, alignItems: 'center' }}>
              <input
                type="text"
                placeholder={t('search')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#e2e8f0', flex: 1, minWidth: 200, outline: 'none' }}
              />
              <select
                value={filterLevel}
                onChange={e => setFilterLevel(e.target.value)}
                style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#e2e8f0', outline: 'none' }}
              >
                <option value="all">All Levels</option>
                {['critical','high','medium','low','safe'].map(l => (
                  <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                ))}
              </select>
              <span style={{ fontSize: 12, color: '#475569' }}>{filtered.length} alerts found</span>
            </div>

            {/* Source Filter Pills */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {['PIB', 'NDRF', 'IMD', 'CERT-In', 'DD News'].map(src => (
                <span key={src} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 20, padding: '4px 12px', fontSize: 11, color: '#94a3b8', cursor: 'pointer' }}>{src}</span>
              ))}
            </div>

            <NewsFeed items={filtered} loading={loading} />
          </div>
        )}

        {/* ── Classify Tab ── */}
        {tab === 'classify' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
            <div style={{ background: '#0d1b2a', border: '1px solid #1e3a5f', borderRadius: 12, padding: 20, maxWidth: 700 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>Classify Threat — Djinn AI India</div>
              <div style={{ fontSize: 12, color: '#475569', marginBottom: 16 }}>
                Powered by AI4Bharat keyword engine + Claude AI. Supports all 22 Indian languages.
              </div>
              <ClassifyTool />
            </div>

            {/* How it works */}
            <div style={{ background: '#0d1b2a', border: '1px solid #1e3a5f', borderRadius: 12, padding: 20, maxWidth: 700 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 12 }}>How Djinn AI India Works</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { step: '1', title: 'Instant Keyword Stage (< 10ms)', desc: 'Matches against 120+ threat keywords in all 22 Indian languages. Returns result immediately.', color: '#3b82f6' },
                  { step: '2', title: 'Deep AI Stage (1–3 seconds)', desc: 'Claude AI analyses the full semantic meaning. Overrides Stage 1 if confidence is higher.', color: '#8b5cf6' },
                  { step: '3', title: 'Result with Confidence Score', desc: 'Shows threat level: Critical / High / Medium / Low / Safe with % confidence and category.', color: '#22c55e' },
                ].map(item => (
                  <div key={item.step} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 12px', background: '#0f1f35', borderRadius: 8, borderLeft: `3px solid ${item.color}` }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: item.color + '30', color: item.color, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{item.step}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 2 }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer style={{ background: '#0d1b2a', borderTop: '1px solid #1e3a5f', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: '#475569' }}>
        <span>{t('made_in_india')} 🇮🇳</span>
        <span>{t('powered_by')}</span>
        <span>Atmanirbhar Bharat — iDEX Ready</span>
      </footer>
    </div>
  )
}
