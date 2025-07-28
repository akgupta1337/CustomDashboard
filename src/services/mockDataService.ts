// Mock data service with realistic sample data
export interface RevenueDataPoint {
  month: string
  revenue: number
  users: number
  timestamp: number
}

export interface ConversionData {
  source: string
  value: number
  color: string
  trend: number
}

export interface PerformanceData {
  category: string
  current: number
  previous: number
  target: number
}

export interface MetricData {
  revenue: number
  users: number
  conversions: number
  growth: number
  bounceRate: number
  avgSessionDuration: number
}

// Realistic base data
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Generate realistic revenue data with seasonal patterns
export const generateRevenueData = (): RevenueDataPoint[] => {
  const baseRevenue = 45000
  const seasonalMultipliers = [0.8, 0.85, 0.9, 1.0, 1.1, 1.2, 1.3, 1.25, 1.15, 1.05, 1.4, 1.5] // Holiday boost in Nov/Dec
  
  return months.map((month, index) => {
    const seasonal = seasonalMultipliers[index]
    const randomVariation = 0.85 + Math.random() * 0.3 // ±15% variation
    const growthTrend = 1 + (index * 0.03) // 3% monthly growth trend
    
    const revenue = Math.round(baseRevenue * seasonal * randomVariation * growthTrend)
    const users = Math.round(revenue * (0.04 + Math.random() * 0.02)) // 4-6% of revenue as user count
    
    return {
      month,
      revenue,
      users,
      timestamp: Date.now() + index * 1000
    }
  })
}

// Generate realistic conversion data
export const generateConversionData = (): ConversionData[] => {
  const sources = [
    { name: 'Google Ads', baseValue: 45, color: '#667eea', volatility: 0.1 },
    { name: 'Facebook Ads', baseValue: 25, color: '#764ba2', volatility: 0.2 },
    { name: 'Email Marketing', baseValue: 15, color: '#f093fb', volatility: 0.15 },
    { name: 'LinkedIn Ads', baseValue: 10, color: '#f5576c', volatility: 0.05 },
    { name: 'Organic & Referrals', baseValue: 5, color: '#4ade80', volatility: 0.3 }
  ]
  
  return sources.map(source => {
    const variation = 1 + (Math.random() - 0.5) * 2 * source.volatility
    const value = Math.max(1, Math.round(source.baseValue * variation))
    const trend = (Math.random() - 0.5) * 10 // ±5% trend
    
    return {
      source: source.name,
      value,
      color: source.color,
      trend
    }
  })
}

// Generate realistic performance data
export const generatePerformanceData = (): PerformanceData[] => {
  const devices = [
    { name: 'Mobile Campaigns', basePerformance: 78, target: 85 },
    { name: 'Desktop Campaigns', basePerformance: 85, target: 90 },
    { name: 'Tablet Campaigns', basePerformance: 72, target: 80 },
    { name: 'Smart TV Ads', basePerformance: 45, target: 60 }
  ]
  
  return devices.map(device => {
    const variation = 0.9 + Math.random() * 0.2 // ±10% variation
    const current = Math.max(10, Math.min(100, Math.round(device.basePerformance * variation)))
    const previous = Math.max(10, Math.min(100, current + (Math.random() - 0.5) * 10))
    
    return {
      category: device.name,
      current,
      previous,
      target: device.target
    }
  })
}

// Generate realistic metrics
export const generateMetrics = (): MetricData => {
  const baseMetrics = {
    revenue: 847000,
    users: 42800,
    conversions: 3247,
    growth: 12.5,
    bounceRate: 35.2,
    avgSessionDuration: 4.3
  }
  
  return {
    revenue: Math.round(baseMetrics.revenue * (0.95 + Math.random() * 0.1)),
    users: Math.round(baseMetrics.users * (0.98 + Math.random() * 0.04)),
    conversions: Math.round(baseMetrics.conversions * (0.9 + Math.random() * 0.2)),
    growth: Math.max(0, Math.min(50, baseMetrics.growth + (Math.random() - 0.5) * 4)),
    bounceRate: Math.max(20, Math.min(60, baseMetrics.bounceRate + (Math.random() - 0.5) * 6)),
    avgSessionDuration: Math.max(2, Math.min(8, baseMetrics.avgSessionDuration + (Math.random() - 0.5) * 2))
  }
}

// Utility functions for real-time updates
export const updateDataPoint = <T extends Record<string, any>>(
  data: T,
  field: keyof T,
  maxVariation: number = 0.05
): T => {
  const currentValue = data[field] as number
  const variation = 1 + (Math.random() - 0.5) * 2 * maxVariation
  const newValue = Math.round(currentValue * variation)
  
  return {
    ...data,
    [field]: newValue
  }
}

export const addDataPoint = (
  data: RevenueDataPoint[],
  maxPoints: number = 12
): RevenueDataPoint[] => {
  const lastPoint = data[data.length - 1]
  const newTimestamp = Date.now()
  
  const newPoint: RevenueDataPoint = {
    month: `T${Math.floor(newTimestamp / 1000) % 100}`,
    revenue: Math.round(lastPoint.revenue * (0.98 + Math.random() * 0.04)),
    users: Math.round(lastPoint.users * (0.95 + Math.random() * 0.1)),
    timestamp: newTimestamp
  }
  
  const newData = [...data, newPoint]
  return newData.length > maxPoints ? newData.slice(-maxPoints) : newData
}

// Simulate API delay
export const simulateApiDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Mock API service
export class MockApiService {
  private static instance: MockApiService
  
  static getInstance(): MockApiService {
    if (!MockApiService.instance) {
      MockApiService.instance = new MockApiService()
    }
    return MockApiService.instance
  }
  
  async fetchRevenueData(): Promise<RevenueDataPoint[]> {
    await simulateApiDelay(300)
    return generateRevenueData()
  }
  
  async fetchConversionData(): Promise<ConversionData[]> {
    await simulateApiDelay(200)
    return generateConversionData()
  }
  
  async fetchPerformanceData(): Promise<PerformanceData[]> {
    await simulateApiDelay(250)
    return generatePerformanceData()
  }
  
  async fetchMetrics(): Promise<MetricData> {
    await simulateApiDelay(150)
    return generateMetrics()
  }
}
