import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { StateData } from '../lib/types'
import { THREAT_COLORS } from '../lib/djinn/classifier'

interface Props { states: StateData[]; onStateClick?: (state: StateData) => void }

export default function IndiaMap({ states, onStateClick }: Props) {
  const mapRef = useRef<any>(null)
  const mapDivRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  useEffect(() => {
    if (mapRef.current || !mapDivRef.current) return

    const map = L.map(mapDivRef.current, {
      center: [22.5, 82.0], zoom: 5, zoomControl: true,
      attributionControl: false, minZoom: 4, maxZoom: 10
    })
    mapRef.current = map

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '', subdomains: 'abcd'
    }).addTo(map)

    states.forEach(state => {
      const color = THREAT_COLORS[state.threatLevel]
      const marker = L.circleMarker([state.lat, state.lng], {
        radius: 8 + Math.min(state.alertCount, 12),
        fillColor: color, color: color,
        weight: 2, opacity: 0.9, fillOpacity: 0.5
      }).addTo(map)

      marker.bindPopup(`
        <div style="background:#0d1b2a;color:#e2e8f0;padding:10px;border-radius:8px;min-width:180px;border:1px solid ${color}">
          <div style="font-weight:bold;color:${color};margin-bottom:6px;font-size:14px">${state.name}</div>
          <div style="font-size:12px;margin-bottom:2px">Threat: <span style="color:${color};text-transform:capitalize;font-weight:bold">${state.threatLevel}</span></div>
          <div style="font-size:12px;color:#94a3b8">Active Alerts: ${state.alertCount}</div>
        </div>
      `, { className: 'dark-popup' })

      if (onStateClick) marker.on('click', () => onStateClick(state))
    })

    setTimeout(() => map.invalidateSize(), 100)
    return () => { map.remove(); mapRef.current = null }
  }, [states])

  return (
    <div className="relative w-full h-full">
      <div ref={mapDivRef} className="w-full h-full rounded-lg" style={{ minHeight: '420px', background: '#0d1b2a' }} />
      <div className="absolute top-3 left-3 bg-gray-900 bg-opacity-95 rounded-lg p-3 text-xs space-y-1.5 z-10 border border-gray-800">
        <div className="text-gray-400 font-semibold mb-2 text-xs uppercase tracking-wide">{t('threat_level')}</div>
        {(['critical','high','medium','low','safe'] as const).map(level => (
          <div key={level} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: THREAT_COLORS[level] }} />
            <span className="text-gray-300 capitalize">{t(level)}</span>
          </div>
        ))}
      </div>
      <div className="absolute bottom-3 right-3 bg-gray-900 bg-opacity-90 rounded px-2 py-1 text-xs text-gray-600 z-10">
        Click any state for details
      </div>
    </div>
  )
}
