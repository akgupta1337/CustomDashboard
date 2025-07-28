'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { DollarSign, Users, Target, TrendingUp, Activity } from 'lucide-react'
import { ThemeToggle } from '../components/ThemeToggle'
import { useTheme } from '../components/ThemeProvider'
import { MetricCard } from '../components/Card'
import { LineChartComponent, BarChartComponent, PieChartComponent } from '../components/Chart'
import { Table, MetricTable } from '../components/Table'
import {
  MockApiService,
  RevenueDataPoint,
  ConversionData,
  PerformanceData,
  MetricData
} from '../services/mockDataService'

export default function Dashboard() {
  const { theme } = useTheme()
  const apiService = MockApiService.getInstance()
  
  // State for all dynamic data
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([
    { month: 'Jan', revenue: 45000, users: 2400, timestamp: Date.now() },
    { month: 'Feb', revenue: 52000, users: 2800, timestamp: Date.now() },
    { month: 'Mar', revenue: 48000, users: 2600, timestamp: Date.now() },
    { month: 'Apr', revenue: 61000, users: 3200, timestamp: Date.now() },
    { month: 'May', revenue: 55000, users: 2900, timestamp: Date.now() },
    { month: 'Jun', revenue: 67000, users: 3500, timestamp: Date.now() }
  ])
  const [conversionData, setConversionData] = useState<ConversionData[]>([
    { source: 'Google Ads', value: 42, color: '#667eea', trend: 2.3 },
    { source: 'Facebook Ads', value: 28, color: '#764ba2', trend: -1.2 },
    { source: 'Email Marketing', value: 18, color: '#f093fb', trend: 4.1 },
    { source: 'LinkedIn Ads', value: 8, color: '#f5576c', trend: 1.8 },
    { source: 'Organic & Referrals', value: 4, color: '#4ade80', trend: 3.5 }
  ])
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([
    { category: 'Mobile Campaigns', current: 78, previous: 65, target: 85 },
    { category: 'Desktop Campaigns', current: 85, previous: 82, target: 90 },
    { category: 'Tablet Campaigns', current: 72, previous: 70, target: 80 },
    { category: 'Smart TV Ads', current: 45, previous: 38, target: 60 }
  ])
  const [metrics, setMetrics] = useState<MetricData>({
    revenue: 847000,
    users: 42800,
    conversions: 3247,
    growth: 12.5,
    bounceRate: 35.2,
    avgSessionDuration: 4.3
  })
  const [isRealTimeActive, setIsRealTimeActive] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [loading, setLoading] = useState(false) // Set to false to show data immediately
  
  const [animatedValues, setAnimatedValues] = useState({
    revenue: 0,
    users: 0,
    conversions: 0,
    growth: 0
  })

  const intervalsRef = useRef<NodeJS.Timeout[]>([])

  // Load initial data
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true)
      const [revenueRes, conversionRes, performanceRes, metricsRes] = await Promise.all([
        apiService.fetchRevenueData(),
        apiService.fetchConversionData(),
        apiService.fetchPerformanceData(),
        apiService.fetchMetrics()
      ])
      
      setRevenueData(revenueRes)
      setConversionData(conversionRes)
      setPerformanceData(performanceRes)
      setMetrics(metricsRes)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to load initial data:', error)
    } finally {
      setLoading(false)
    }
  }, [apiService])

  // Real-time update functions
  const updateMetrics = useCallback(async () => {
    try {
      const newMetrics = await apiService.fetchMetrics()
      setMetrics(newMetrics)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to update metrics:', error)
    }
  }, [apiService])

  const updateConversionData = useCallback(async () => {
    try {
      const newData = await apiService.fetchConversionData()
      setConversionData(newData)
    } catch (error) {
      console.error('Failed to update conversion data:', error)
    }
  }, [apiService])

  const updatePerformanceData = useCallback(async () => {
    try {
      const newData = await apiService.fetchPerformanceData()
      setPerformanceData(newData)
    } catch (error) {
      console.error('Failed to update performance data:', error)
    }
  }, [apiService])

  const updateRevenueData = useCallback(async () => {
    try {
      const newData = await apiService.fetchRevenueData()
      setRevenueData(newData)
    } catch (error) {
      console.error('Failed to update revenue data:', error)
    }
  }, [apiService])

  // Initialize data
  useEffect(() => {
    loadInitialData()
  }, [loadInitialData])

  // Initialize animations
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setAnimatedValues({
          revenue: metrics.revenue,
          users: metrics.users,
          conversions: metrics.conversions,
          growth: metrics.growth
        })
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [loading, metrics])

  // Real-time updates
  useEffect(() => {
    if (!isRealTimeActive || loading) return

    // Clear existing intervals
    intervalsRef.current.forEach(clearInterval)
    intervalsRef.current = []

    // Set up different update intervals for different data types
    const intervals = [
      setInterval(updateMetrics, 3000), // Update metrics every 3 seconds
      setInterval(updateConversionData, 8000), // Update conversion data every 8 seconds
      setInterval(updatePerformanceData, 12000), // Update performance data every 12 seconds
      setInterval(updateRevenueData, 15000), // Update revenue data every 15 seconds
    ]

    intervalsRef.current = intervals

    return () => {
      intervals.forEach(clearInterval)
    }
  }, [isRealTimeActive, loading, updateMetrics, updateConversionData, updatePerformanceData, updateRevenueData])

  // Update animated values when metrics change
  useEffect(() => {
    if (isRealTimeActive && !loading) {
      setAnimatedValues({
        revenue: metrics.revenue,
        users: metrics.users,
        conversions: metrics.conversions,
        growth: metrics.growth
      })
    }
  }, [metrics, isRealTimeActive, loading])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      intervalsRef.current.forEach(clearInterval)
    }
  }, [])

  // Prepare table data
  const tableData = performanceData.map(item => ({
    metric: item.category,
    current: item.current,
    previous: item.previous,
    change: ((item.current - item.previous) / item.previous) * 100,
    target: item.target
  }))

  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
  const axisColor = theme === 'dark' ? '#a0a0a0' : '#64748b'

  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-content">
          <div className="header-text">
            <div className="brand-logo">
              <h1>ADmyBRAND Insights</h1>
              <div className="brand-tagline">Digital Marketing Analytics Platform</div>
            </div>
            <p>Real-time campaign performance and audience insights</p>
            <div className="real-time-status">
              <div className={`status-indicator ${isRealTimeActive ? 'active' : 'inactive'}`}>
                <Activity size={16} />
                <span>{isRealTimeActive ? 'Live Updates' : 'Static View'}</span>
                <div className="pulse-dot"></div>
              </div>
              <button 
                className="real-time-toggle"
                onClick={() => setIsRealTimeActive(!isRealTimeActive)}
              >
                {isRealTimeActive ? 'Pause' : 'Resume'} Updates
              </button>
              <div className="last-update">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="metrics-grid">
        <MetricCard
          title="Campaign Revenue"
          value={`$${animatedValues.revenue.toLocaleString()}`}
          change={15.2}
          icon={<DollarSign size={24} />}
          color="#667eea"
          isUpdating={isRealTimeActive}
          subtitle="Total ad spend ROI"
        />
        <MetricCard
          title="Active Users"
          value={animatedValues.users.toLocaleString()}
          change={8.7}
          icon={<Users size={24} />}
          color="#764ba2"
          isUpdating={isRealTimeActive}
          subtitle="Unique website visitors"
        />
        <MetricCard
          title="Lead Conversions"
          value={animatedValues.conversions.toLocaleString()}
          change={23.1}
          icon={<Target size={24} />}
          color="#f093fb"
          isUpdating={isRealTimeActive}
          subtitle="Quality leads generated"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${animatedValues.growth.toFixed(1)}%`}
          change={4.3}
          icon={<TrendingUp size={24} />}
          color="#4ade80"
          isUpdating={isRealTimeActive}
          subtitle="Visitor to lead ratio"
        />
      </div>

      <div className="charts-section">
        <LineChartComponent
          title="Campaign Performance & Audience Growth"
          data={revenueData}
          lines={[
            { dataKey: 'revenue', color: '#667eea', name: 'Ad Revenue' },
            { dataKey: 'users', color: '#f093fb', name: 'Website Visitors' }
          ]}
          gridColor={gridColor}
          axisColor={axisColor}
          loading={loading}
          height={400}
        />

        <PieChartComponent
          title="Marketing Channel Performance"
          data={conversionData}
          dataKey="value"
          loading={loading}
          height={400}
        />
      </div>

      <div className="bottom-charts">
        <BarChartComponent
          title="Device & Platform Analytics" 
          data={performanceData}
          bars={[
            { dataKey: 'current', color: '#667eea', name: 'Current Period' },
            { dataKey: 'previous', color: '#764ba2', name: 'Previous Period' }
          ]}
          gridColor={gridColor}
          axisColor={axisColor}
          xAxisKey="category"
          loading={loading}
          height={300}
        />

        <BarChartComponent
          title="Monthly Campaign ROI Trends"
          data={revenueData.slice(-6)}
          bars={[
            { dataKey: 'revenue', color: '#667eea', name: 'Campaign Revenue' }
          ]}
          gridColor={gridColor}
          axisColor={axisColor}
          xAxisKey="month"
          loading={loading}
          height={300}
        />
      </div>

      <div className="table-section">
        <MetricTable
          data={tableData}
          loading={loading}
        />
      </div>
    </div>
  )
}