export const MetricSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-circle"></div>
    <div className="skeleton skeleton-line" style={{ width: '60%' }}></div>
    <div className="skeleton skeleton-line" style={{ width: '80%' }}></div>
    <div className="skeleton skeleton-line" style={{ width: '40%' }}></div>
  </div>
)

export const ChartSkeleton = () => (
  <div className="chart-container">
    <div className="skeleton skeleton-line" style={{ width: '40%', marginBottom: '2rem' }}></div>
    <div className="skeleton" style={{ height: '300px', borderRadius: '12px' }}></div>
  </div>
)

export const TableSkeleton = () => (
  <div className="table-container">
    <div className="skeleton skeleton-line" style={{ width: '30%', marginBottom: '2rem' }}></div>
    <div className="skeleton skeleton-line" style={{ width: '100%', height: '40px', marginBottom: '1rem' }}></div>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="skeleton skeleton-line" style={{ width: '100%', height: '50px', marginBottom: '0.5rem' }}></div>
    ))}
  </div>
)