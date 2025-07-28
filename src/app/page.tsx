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
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([])
  const [conversionData, setConversionData] = useState<ConversionData[]>([])
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])
  const [metrics, setMetrics] = useState<MetricData>({
    revenue: 0,
    users: 0,
    conversions: 0,
    growth: 0,
    bounceRate: 0,
    avgSessionDuration: 0
  })
  const [isRealTimeActive, setIsRealTimeActive] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [loading, setLoading] = useState(true)
  
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
            <h1>Analytics Dashboard</h1>
            <p>Real-time insights and performance metrics</p>
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
          title="Total Revenue"
          value={`$${animatedValues.revenue.toLocaleString()}`}
          change={15.2}
          icon={<DollarSign size={24} />}
          color="#667eea"
          isUpdating={isRealTimeActive}
        />
        <MetricCard
          title="Active Users"
          value={animatedValues.users.toLocaleString()}
          change={8.7}
          icon={<Users size={24} />}
          color="#764ba2"
          isUpdating={isRealTimeActive}
        />
        <MetricCard
          title="Conversions"
          value={animatedValues.conversions.toLocaleString()}
          change={23.1}
          icon={<Target size={24} />}
          color="#f093fb"
          isUpdating={isRealTimeActive}
        />
        <MetricCard
          title="Growth Rate"
          value={`${animatedValues.growth.toFixed(1)}%`}
          change={4.3}
          icon={<TrendingUp size={24} />}
          color="#4ade80"
          isUpdating={isRealTimeActive}
        />
      </div>

      <div className="charts-section">
        <LineChartComponent
          title="Revenue & User Growth Trend"
          data={revenueData}
          lines={[
            { dataKey: 'revenue', color: '#667eea', name: 'Revenue' },
            { dataKey: 'users', color: '#f093fb', name: 'Users' }
          ]}
          gridColor={gridColor}
          axisColor={axisColor}
          loading={loading}
          height={400}
        />

        <PieChartComponent
          title="Traffic Sources"
          data={conversionData}
          dataKey="value"
          loading={loading}
          height={400}
        />
      </div>

      <div className="bottom-charts">
        <BarChartComponent
          title="Device Performance Comparison" 
          data={performanceData}
          bars={[
            { dataKey: 'current', color: '#667eea', name: 'Current' },
            { dataKey: 'previous', color: '#764ba2', name: 'Previous' }
          ]}
          gridColor={gridColor}
          axisColor={axisColor}
          loading={loading}
          height={300}
        />

        <div className="chart-and-table">
          <BarChartComponent
            title="Monthly Revenue Distribution"
            data={revenueData.slice(-6)}
            bars={[
              { dataKey: 'revenue', color: '#667eea', name: 'Revenue' }
            ]}
            gridColor={gridColor}
            axisColor={axisColor}
            loading={loading}
            height={300}
          />
          
          <MetricTable
            data={tableData}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}