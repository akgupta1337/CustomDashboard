'use client'

import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, Search, Calendar, Download } from 'lucide-react'

interface TableData {
  id: string
  date: string
  customer: string
  product: string
  amount: number
  status: 'completed' | 'pending' | 'failed'
  channel: string
}

interface DataTableProps {
  data: TableData[]
  onExport?: (data: TableData[]) => void
}

export const DataTable = ({ data, onExport }: DataTableProps) => {
  const [sortField, setSortField] = useState<keyof TableData>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleSort = (field: keyof TableData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(item => {
      const matchesSearch = 
        item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.channel.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter
      
      const matchesDate = !dateFilter || item.date.includes(dateFilter)
      
      return matchesSearch && matchesStatus && matchesDate
    })

    return filtered.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]
      
      if (sortField === 'amount') {
        aVal = Number(aVal)
        bVal = Number(bVal)
      }
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [data, searchTerm, statusFilter, dateFilter, sortField, sortDirection])

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedData, currentPage])

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4ade80'
      case 'pending': return '#fbbf24'
      case 'failed': return '#f87171'
      default: return '#a0a0a0'
    }
  }

  const SortIcon = ({ field }: { field: keyof TableData }) => {
    if (sortField !== field) return <ChevronUp size={16} style={{ opacity: 0.3 }} />
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <h3 className="chart-title">Transaction History</h3>
        <div className="table-filters">
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="Search transactions..."
              className="filter-input"
              style={{ paddingLeft: '40px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="filter-input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ minWidth: '150px' }}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          
          <input
            type="month"
            className="date-filter"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          
          {onExport && (
            <button
              className="export-btn"
              onClick={() => onExport(filteredAndSortedData)}
            >
              <Download size={16} />
              Export CSV
            </button>
          )}
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Date <SortIcon field="date" />
                </div>
              </th>
              <th onClick={() => handleSort('customer')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Customer <SortIcon field="customer" />
                </div>
              </th>
              <th onClick={() => handleSort('product')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Product <SortIcon field="product" />
                </div>
              </th>
              <th onClick={() => handleSort('amount')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Amount <SortIcon field="amount" />
                </div>
              </th>
              <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Status <SortIcon field="status" />
                </div>
              </th>
              <th onClick={() => handleSort('channel')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Channel <SortIcon field="channel" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.id}>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>{item.customer}</td>
                <td>{item.product}</td>
                <td>${item.amount.toLocaleString()}</td>
                <td>
                  <span style={{ 
                    color: getStatusColor(item.status),
                    fontWeight: '600',
                    textTransform: 'capitalize'
                  }}>
                    {item.status}
                  </span>
                </td>
                <td>{item.channel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div className="pagination-info">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredAndSortedData.length)} to {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length} entries
        </div>
        
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            const page = i + 1
            return (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            )
          })}
          
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}