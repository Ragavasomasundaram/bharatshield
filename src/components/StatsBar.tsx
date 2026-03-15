import { useTranslation } from 'react-i18next'
import { THREAT_COLORS } from '../lib/djinn/classifier'
import type { DashboardStats } from '../lib/types'

interface Props { stats: DashboardStats }

export default function StatsBar({ stats }: Props) {
  const { t } = useTranslation()
  const items = [
    { label: t('total_alerts'), value: stats.totalAlerts, color: '#94a3b8' },
    { label: t('critical'), value: stats.criticalCount, color: THREAT_COLORS.critical },
    { label: t('high'), value: stats.highCount, color: THREAT_COLORS.high },
    { label: t('medium'), value: stats.mediumCount, color: THREAT_COLORS.medium },
    { label: t('low'), value: stats.lowCount, color: THREAT_COLORS.low },
    { label: t('safe'), value: stats.safeCount, color: THREAT_COLORS.safe },
  ]
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
      {items.map(item => (
        <div key={item.label} className="bg-gray-900 rounded-lg p-3 text-center border border-gray-800">
          <div className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</div>
          <div className="text-xs text-gray-500 mt-1 truncate">{item.label}</div>
        </div>
      ))}
    </div>
  )
}
