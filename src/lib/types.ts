export interface NewsItem {
  id: string
  title: string
  description: string
  source: string
  sourceType: 'PIB' | 'NDRF' | 'IMD' | 'CERT-In' | 'DD News' | 'AIR' | 'Other'
  url: string
  publishedAt: string
  state?: string
  threatLevel?: 'critical' | 'high' | 'medium' | 'low' | 'safe'
  threatConfidence?: number
  threatCategory?: string
}

export interface StateData {
  name: string
  code: string
  threatLevel: 'critical' | 'high' | 'medium' | 'low' | 'safe'
  alertCount: number
  lat: number
  lng: number
}

export interface DashboardStats {
  totalAlerts: number
  criticalCount: number
  highCount: number
  mediumCount: number
  lowCount: number
  safeCount: number
  lastUpdated: string
}
