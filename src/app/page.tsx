'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { DollarSign, Users, Target, TrendingUp, Activity } from 'lucide-react'
import { ThemeToggle } from '../components/ThemeToggle'
import { useTheme } from '../components/ThemeProvider'

// Initial data structures
const initialRevenueData = [
  { month: 'Jan', revenue: 45000, users: 2400 },
  { month: 'Feb', revenue: 52000, users: 2800 },
  { month: 'Mar', revenue: 48000, users: 2600 },
  { month: 'Apr', revenue: 61000, users: 3200 },
  { month: 'May', revenue: 55000, users: 2900 },
  { month: 'Jun', revenue: 67000, users: 3500 },
  { month: 'Jul', revenue: 73000, users: 3800 },
  { month: 'Aug', revenue: 69000, users: 3600 },
  { month: 'Sep', revenue: 78000, users: 4100 },
  { month: 'Oct', revenue: 84000, users: 4300 },
  { month: 'Nov', revenue: 91000, users: 4600 },
  { month: 'Dec', revenue: 88000, users: 4400 }
]

const initialConversionData = [
  { source: 'Organic Search', value: 45, color: '#667eea' },
  { source: 'Social Media', value: 25, color: '#764ba2' },
  { source: 'Email Campaign', value: 15, color: '#f093fb' },
  { source: 'Direct Traffic', value: 10, color: '#f5576c' },
  { source: 'Referrals', value: 5, color: '#4ade80' }
]

const initialPerformanceData = [
  { category: 'Mobile', current: 78, previous: 65 },
  { category: 'Desktop', current: 85, previous: 82 },
  { category: 'Tablet', current: 72, previous: 70 },
  { category: 'Smart TV', current: 45, previous: 38 }
]

// Utility functions for data simulation
const generateRandomVariation = (base: number, variation: number = 0.1) => {
  const change = (Math.random() - 0.5) * 2 * variation
  return Math.round(base * (1 + change))
}

const generateNewDataPoint = (lastValue: number, trend: number = 0.02) => {
  const randomFactor = (Math.random() - 0.5) * 0.1
  const trendFactor = trend + randomFactor
  return Math.round(lastValue * (1 + trendFactor))
}

interface MetricCardProps {
  title: string
  value: string
  change: number
  icon: React.ReactNode
  color: string
  isUpdating?: boolean
}

const MetricCard = ({ title, value, change, icon, color, isUpdating = false }: MetricCardProps) => (
  <div className={`metric-card ${isUpdating ? 'updating' : ''}`}>
    <div 
      className="metric-icon" 
      style={{ background: `linear-gradient(135deg, ${color}20, ${color}40)` }}
    >
      {icon}
    </div>
    <div className="metric-value">{value}</div>
    <div className="metric-label">{title}</div>
    <div className={`metric-change ${change >= 0 ? 'positive' : 'negative'}`}>
      {change >= 0 ? '↗' : '↘'} {Math.abs(change)}% vs last month
    </div>
    {isUpdating && <div className="update-indicator"></div>}
  </div>
)

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="tooltip-entry" style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value.toLocaleString()}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const { theme } = useTheme()
  
  // State for all dynamic data
  const [revenueData, setRevenueData] = useState(initialRevenueData)
  const [conversionData, setConversionData] = useState(initialConversionData)
  const [performanceData, setPerformanceData] = useState(initialPerformanceData)
  const [isRealTimeActive, setIsRealTimeActive] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  
  const [animatedValues, setAnimatedValues] = useState({
    revenue: 0,
    users: 0,
    conversions: 0,
    growth: 0
  })

  const [realTimeMetrics, setRealTimeMetrics] = useState({
    revenue: 847000,
    users: 42800,
    conversions: 3247,
    growth: 12.5
  })

  const intervalsRef = useRef<NodeJS.Timeout[]>([])

  // Calculate current totals from data
  const calculateTotals = useCallback(() => {
    const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0)
    const totalUsers = revenueData.reduce((sum, item) => sum + item.users, 0)
    const totalConversions = Math.round(totalUsers * 0.076) // ~7.6% conversion rate
    const currentGrowth = realTimeMetrics.growth

    return {
      revenue: totalRevenue,
      users: totalUsers,
      conversions: totalConversions,
      growth: currentGrowth
    }
  }, [revenueData, realTimeMetrics.growth])

  // Real-time update functions
  const updateMetrics = useCallback(() => {
    setRealTimeMetrics(prev => ({
      revenue: generateRandomVariation(prev.revenue, 0.01),
      users: generateRandomVariation(prev.users, 0.02),
      conversions: generateRandomVariation(prev.conversions, 0.03),
      growth: Math.max(0, Math.min(100, prev.growth + (Math.random() - 0.5) * 2))
    }))
    setLastUpdate(new Date())
  }, [])

  const updateConversionData = useCallback(() => {
    setConversionData(prev => prev.map(item => ({
      ...item,
      value: Math.max(1, Math.min(90, generateRandomVariation(item.value, 0.1)))
    })))
  }, [])

  const updatePerformanceData = useCallback(() => {
    setPerformanceData(prev => prev.map(item => ({
      ...item,
      previous: item.current,
      current: Math.max(10, Math.min(100, generateRandomVariation(item.current, 0.05)))
    })))
  }, [])

  const addNewRevenueDataPoint = useCallback(() => {
    setRevenueData(prev => {
      const lastPoint = prev[prev.length - 1]
      const newRevenue = generateNewDataPoint(lastPoint.revenue, 0.01)
      const newUsers = generateNewDataPoint(lastPoint.users, 0.015)
      
      const newData = [...prev.slice(1), {
        month: `M${Date.now() % 100}`,
        revenue: newRevenue,
        users: newUsers
      }]
      
      return newData
    })
  }, [])

  // Initialize animations
  useEffect(() => {
    const timer = setTimeout(() => {
      const totals = calculateTotals()
      setAnimatedValues(totals)
    }, 500)

    return () => clearTimeout(timer)
  }, [calculateTotals])

  // Real-time updates
  useEffect(() => {
    if (!isRealTimeActive) return

    // Clear existing intervals
    intervalsRef.current.forEach(clearInterval)
    intervalsRef.current = []

    // Set up different update intervals for different data types
    const intervals = [
      setInterval(updateMetrics, 3000), // Update metrics every 3 seconds
      setInterval(updateConversionData, 8000), // Update conversion data every 8 seconds
      setInterval(updatePerformanceData, 12000), // Update performance data every 12 seconds
      setInterval(addNewRevenueDataPoint, 15000), // Add new data point every 15 seconds
    ]

    intervalsRef.current = intervals

    return () => {
      intervals.forEach(clearInterval)
    }
  }, [isRealTimeActive, updateMetrics, updateConversionData, updatePerformanceData, addNewRevenueDataPoint])

  // Update animated values when real-time metrics change
  useEffect(() => {
    if (isRealTimeActive) {
      setAnimatedValues(realTimeMetrics)
    }
  }, [realTimeMetrics, isRealTimeActive])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      intervalsRef.current.forEach(clearInterval)
    }
  }, [])

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
        <div className="chart-container">
          <h3 className="chart-title">Revenue & User Growth Trend</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" stroke={axisColor} />
              <YAxis stroke={axisColor} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#667eea" 
                strokeWidth={3}
                dot={{ fill: '#667eea', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: '#667eea' }}
              />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#f093fb" 
                strokeWidth={3}
                dot={{ fill: '#f093fb', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: '#f093fb' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Traffic Sources</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={conversionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {conversionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bottom-charts">
        <div className="chart-container">
          <h3 className="chart-title">Device Performance Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="category" stroke={axisColor} />
              <YAxis stroke={axisColor} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="current" fill="#667eea" radius={[4, 4, 0, 0]} />
              <Bar dataKey="previous" fill="#764ba2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Monthly Revenue Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData.slice(-6)}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" stroke={axisColor} />
              <YAxis stroke={axisColor} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" fill="url(#gradient)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#f093fb" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}