import React from 'react'

export interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'glass' | 'solid'
  padding?: 'sm' | 'md' | 'lg'
  hover?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = true
}) => {
  const baseClasses = 'card'
  const variantClasses = {
    default: 'card-default',
    glass: 'card-glass',
    solid: 'card-solid'
  }
  const paddingClasses = {
    sm: 'card-padding-sm',
    md: 'card-padding-md',
    lg: 'card-padding-lg'
  }
  const hoverClass = hover ? 'card-hover' : ''
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    hoverClass,
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      {children}
    </div>
  )
}

export interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ReactNode
  color: string
  isUpdating?: boolean
  trend?: 'up' | 'down' | 'neutral'
  subtitle?: string
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  color,
  isUpdating = false,
  trend = 'neutral',
  subtitle
}) => {
  const formatValue = (val: string | number): string => {
    if (typeof val === 'number') {
      return val.toLocaleString()
    }
    return val
  }

  const getTrendIcon = () => {
    if (change === undefined) return null
    if (change > 0) return '↗'
    if (change < 0) return '↘'
    return '→'
  }

  const getTrendClass = () => {
    if (change === undefined) return 'neutral'
    if (change > 0) return 'positive'
    if (change < 0) return 'negative'
    return 'neutral'
  }

  return (
    <Card className={`metric-card ${isUpdating ? 'updating' : ''}`} hover>
      <div 
        className="metric-icon" 
        style={{ background: `linear-gradient(135deg, ${color}20, ${color}40)` }}
      >
        {icon}
      </div>
      <div className="metric-value">{formatValue(value)}</div>
      <div className="metric-label">{title}</div>
      {subtitle && <div className="metric-subtitle">{subtitle}</div>}
      {change !== undefined && (
        <div className={`metric-change ${getTrendClass()}`}>
          {getTrendIcon()} {Math.abs(change)}% vs last month
        </div>
      )}
      {isUpdating && <div className="update-indicator"></div>}
    </Card>
  )
}
