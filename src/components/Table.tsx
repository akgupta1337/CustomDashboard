import React from 'react'
import { Card } from './Card'

export interface TableColumn {
  key: string
  title: string
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (value: any, record: any, index: number) => React.ReactNode
  sortable?: boolean
}

export interface TableProps {
  title?: string
  columns: TableColumn[]
  data: any[]
  loading?: boolean
  error?: string
  pagination?: {
    current: number
    pageSize: number
    total: number
    onChange: (page: number) => void
  }
  className?: string
  striped?: boolean
  hoverable?: boolean
}

const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="table-skeleton">
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="skeleton-row">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div key={colIndex} className="skeleton-cell" />
        ))}
      </div>
    ))}
  </div>
)

const Pagination = ({ current, pageSize, total, onChange }: NonNullable<TableProps['pagination']>) => {
  const totalPages = Math.ceil(total / pageSize)
  const startItem = (current - 1) * pageSize + 1
  const endItem = Math.min(current * pageSize, total)

  return (
    <div className="table-pagination">
      <div className="pagination-info">
        Showing {startItem}-{endItem} of {total} entries
      </div>
      <div className="pagination-controls">
        <button
          onClick={() => onChange(current - 1)}
          disabled={current <= 1}
          className="pagination-btn"
        >
          Previous
        </button>
        <span className="pagination-pages">
          Page {current} of {totalPages}
        </span>
        <button
          onClick={() => onChange(current + 1)}
          disabled={current >= totalPages}
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export const Table: React.FC<TableProps> = ({
  title,
  columns,
  data,
  loading = false,
  error,
  pagination,
  className = '',
  striped = true,
  hoverable = true
}) => {
  const tableClasses = [
    'data-table',
    striped ? 'table-striped' : '',
    hoverable ? 'table-hoverable' : '',
    className
  ].filter(Boolean).join(' ')

  const renderCell = (column: TableColumn, record: any, index: number) => {
    const value = record[column.key]
    
    if (column.render) {
      return column.render(value, record, index)
    }
    
    if (typeof value === 'number') {
      return value.toLocaleString()
    }
    
    return value
  }

  return (
    <Card className="table-container">
      {title && <h3 className="table-title">{title}</h3>}
      
      {loading && <TableSkeleton rows={5} columns={columns.length} />}
      
      {error && (
        <div className="table-error">
          <p>Error loading table data: {error}</p>
        </div>
      )}
      
      {!loading && !error && (
        <>
          <div className="table-wrapper">
            <table className={tableClasses}>
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      style={{
                        width: column.width,
                        textAlign: column.align || 'left'
                      }}
                      className={column.sortable ? 'sortable' : ''}
                    >
                      {column.title}
                      {column.sortable && <span className="sort-indicator">↕</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((record, index) => (
                  <tr key={index}>
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        style={{ textAlign: column.align || 'left' }}
                      >
                        {renderCell(column, record, index)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {pagination && <Pagination {...pagination} />}
        </>
      )}
    </Card>
  )
}

// Specialized components for common table types
export interface MetricTableProps {
  data: Array<{
    metric: string
    current: number
    previous: number
    change: number
    target?: number
  }>
  loading?: boolean
}

export const MetricTable: React.FC<MetricTableProps> = ({ data, loading = false }) => {
  const columns: TableColumn[] = [
    { key: 'metric', title: 'Metric', width: '30%' },
    {
      key: 'current',
      title: 'Current',
      width: '20%',
      align: 'right',
      render: (value) => value.toLocaleString()
    },
    {
      key: 'previous',
      title: 'Previous',
      width: '20%',
      align: 'right',
      render: (value) => value.toLocaleString()
    },
    {
      key: 'change',
      title: 'Change',
      width: '15%',
      align: 'right',
      render: (value) => (
        <span className={`metric-change ${value >= 0 ? 'positive' : 'negative'}`}>
          {value >= 0 ? '+' : ''}{value.toFixed(1)}%
        </span>
      )
    },
    {
      key: 'target',
      title: 'Target',
      width: '15%',
      align: 'right',
      render: (value) => value ? value.toLocaleString() : '—'
    }
  ]

  return <Table title="Campaign Performance Metrics" columns={columns} data={data} loading={loading} />
}
