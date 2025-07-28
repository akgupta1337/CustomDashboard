import React from 'react'
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
import { Card } from './Card'

export interface ChartProps {
  title: string
  data: any[]
  type: 'line' | 'bar' | 'pie'
  height?: number
  loading?: boolean
  error?: string
  className?: string
}

export interface LineChartProps extends Omit<ChartProps, 'type'> {
  lines: {
    dataKey: string
    color: string
    name?: string
  }[]
  gridColor?: string
  axisColor?: string
}

export interface BarChartProps extends Omit<ChartProps, 'type'> {
  bars: {
    dataKey: string
    color: string
    name?: string
  }[]
  gridColor?: string
  axisColor?: string
  xAxisKey?: string
}

export interface PieChartProps extends Omit<ChartProps, 'type'> {
  dataKey: string
  colorKey?: string
  innerRadius?: number
  outerRadius?: number
}

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

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{data.source || data.name}</p>
        <p className="tooltip-entry" style={{ color: payload[0].color }}>
          {`${payload[0].value}%`}
        </p>
        {data.trend && (
          <p className="tooltip-trend" style={{ color: data.trend >= 0 ? '#4ade80' : '#f5576c' }}>
            {`Trend: ${data.trend >= 0 ? '+' : ''}${data.trend.toFixed(1)}%`}
          </p>
        )}
      </div>
    )
  }
  return null
}

const LoadingSpinner = () => (
  <div className="chart-loading">
    <div className="spinner"></div>
    <p>Loading chart data...</p>
  </div>
)

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="chart-error">
    <p>Error loading chart: {message}</p>
  </div>
)

export const LineChartComponent: React.FC<LineChartProps> = ({
  title,
  data,
  lines,
  height = 400,
  loading = false,
  error,
  gridColor = 'rgba(255,255,255,0.1)',
  axisColor = '#a0a0a0',
  className = ''
}) => {
  return (
    <Card className={`chart-container ${className}`}>
      <h3 className="chart-title">{title}</h3>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="month" stroke={axisColor} />
            <YAxis stroke={axisColor} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {lines.map((line, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.color}
                strokeWidth={3}
                dot={{ fill: line.color, strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: line.color }}
                name={line.name || line.dataKey}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}

export const BarChartComponent: React.FC<BarChartProps> = ({
  title,
  data,
  bars,
  height = 300,
  loading = false,
  error,
  gridColor = 'rgba(255,255,255,0.1)',
  axisColor = '#a0a0a0',
  xAxisKey = 'category',
  className = ''
}) => {
  return (
    <Card className={`chart-container ${className}`}>
      <h3 className="chart-title">{title}</h3>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey={xAxisKey} stroke={axisColor} />
            <YAxis stroke={axisColor} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {bars.map((bar, index) => (
              <Bar
                key={index}
                dataKey={bar.dataKey}
                fill={bar.color}
                radius={[4, 4, 0, 0]}
                name={bar.name || bar.dataKey}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}

export const PieChartComponent: React.FC<PieChartProps> = ({
  title,
  data,
  dataKey,
  colorKey = 'color',
  height = 400,
  loading = false,
  error,
  innerRadius = 60,
  outerRadius = 120,
  className = ''
}) => {
  // Responsive sizing
  const getResponsiveSize = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width <= 480) {
        return { inner: 40, outer: 90, height: 280 };
      } else if (width <= 768) {
        return { inner: 50, outer: 110, height: 320 };
      }
    }
    return { inner: innerRadius, outer: outerRadius + 30, height };
  };

  const { inner, outer, height: responsiveHeight } = getResponsiveSize();

  return (
    <Card className={`chart-container ${className}`}>
      <h3 className="chart-title">{title}</h3>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && (
        <ResponsiveContainer width="100%" height={responsiveHeight}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={inner}
              outerRadius={outer}
              paddingAngle={2}
              dataKey={dataKey}
              nameKey="source"
            >
              {data.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry[colorKey]} />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}

// Generic Chart component that renders based on type
export const Chart: React.FC<ChartProps> = ({ type, ...props }) => {
  switch (type) {
    case 'line':
      return <LineChartComponent {...props} lines={[]} />
    case 'bar':
      return <BarChartComponent {...props} bars={[]} />
    case 'pie':
      return <PieChartComponent {...props} dataKey="value" />
    default:
      return <div>Unsupported chart type</div>
  }
}
