import { useTranslation } from 'react-i18next'
import type { NewsItem } from '../lib/types'
import { THREAT_COLORS, THREAT_BG } from '../lib/djinn/classifier'

const SOURCE_COLORS: Record<string, string> = {
  'PIB': '#3b82f6', 'NDRF': '#f97316', 'IMD': '#06b6d4',
  'CERT-In': '#ef4444', 'DD News': '#8b5cf6', 'AIR': '#10b981', 'Other': '#6b7280'
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

interface Props { items: NewsItem[]; loading?: boolean }

export default function NewsFeed({ items, loading }: Props) {
  const { t } = useTranslation()

  if (loading) return (
    <div className="flex items-center justify-center h-48 text-gray-500">
      <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mr-2" />
      {t('loading')}
    </div>
  )

  return (
    <div className="space-y-2 overflow-y-auto max-h-full pr-1">
      {items.map(item => (
        <div
          key={item.id}
          className="rounded-lg p-3 cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: item.threatLevel ? THREAT_BG[item.threatLevel] : 'rgba(30,58,95,0.3)', borderLeft: `3px solid ${item.threatLevel ? THREAT_COLORS[item.threatLevel] : '#3b82f6'}` }}
          onClick={() => window.open(item.url, '_blank')}
        >
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: SOURCE_COLORS[item.sourceType] + '30', color: SOURCE_COLORS[item.sourceType] }}>
              {item.sourceType}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              {item.threatLevel && item.threatLevel !== 'safe' && (
                <span className="text-xs font-semibold capitalize" style={{ color: THREAT_COLORS[item.threatLevel] }}>
                  {item.threatLevel}
                </span>
              )}
              {item.state && <span className="text-xs text-gray-500">{item.state}</span>}
              <span className="text-xs text-gray-600">{timeAgo(item.publishedAt)}</span>
            </div>
          </div>
          <p className="text-sm text-gray-200 leading-snug line-clamp-2">{item.title}</p>
          {item.threatCategory && item.threatCategory !== 'General' && (
            <span className="text-xs text-gray-500 mt-1 inline-block">{item.threatCategory}</span>
          )}
        </div>
      ))}
    </div>
  )
}
