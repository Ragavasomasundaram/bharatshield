import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { classify, type ThreatResult, THREAT_COLORS } from '../lib/djinn/classifier'

export default function ClassifyTool() {
  const { t } = useTranslation()
  const [text, setText] = useState('')
  const [result, setResult] = useState<ThreatResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleClassify = async () => {
    if (!text.trim()) return
    setLoading(true)
    await classify(text, undefined, (r) => setResult(r))
    setLoading(false)
  }

  return (
    <div className="space-y-3">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste any Indian news headline or text in any language to classify threat level..."
        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-blue-500"
        rows={3}
      />
      <button
        onClick={handleClassify}
        disabled={loading || !text.trim()}
        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
      >
        {loading ? t('loading') : t('classify')}
      </button>
      {result && (
        <div className="rounded-lg p-3 space-y-2" style={{ background: THREAT_COLORS[result.level] + '20', border: `1px solid ${THREAT_COLORS[result.level]}40` }}>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full pulse-dot" style={{ background: THREAT_COLORS[result.level] }} />
            <span className="font-bold capitalize text-lg" style={{ color: THREAT_COLORS[result.level] }}>{t(result.level)}</span>
            <span className="text-xs text-gray-500">{Math.round(result.confidence * 100)}% confidence</span>
            <span className="text-xs text-gray-600 ml-auto">via {result.source}</span>
          </div>
          <div className="text-sm text-gray-400">Category: {result.category}</div>
          {result.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {result.keywords.map(kw => (
                <span key={kw} className="text-xs px-2 py-0.5 rounded" style={{ background: THREAT_COLORS[result.level] + '30', color: THREAT_COLORS[result.level] }}>
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
