// Skeleton placeholders with shimmer animation, shown while
// products/pages are "loading".

function Shimmer({ className }) {
  return <div className={`shimmer ${className ?? ''}`} />;
}

export function SkeletonCard() {
  return (
    <div className="product-card skeleton-card">
      <Shimmer className="sk-img" />
      <div className="card-body">
        <Shimmer className="sk-line" style={{ width: '55%' }} />
        <Shimmer className="sk-line" style={{ width: '90%' }} />
        <Shimmer className="sk-line" style={{ width: '40%' }} />
        <div className="card-footer">
          <Shimmer className="sk-line" style={{ width: '30%' }} />
          <Shimmer className="sk-btn" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="product-grid" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="pd">
      <Shimmer className="sk-pd-img" />
      <div className="pd-info">
        <Shimmer className="sk-line" style={{ width: '30%' }} />
        <Shimmer className="sk-line sk-title" style={{ width: '70%' }} />
        <Shimmer className="sk-line" style={{ width: '45%' }} />
        <Shimmer className="sk-line sk-price" style={{ width: '25%' }} />
        <Shimmer className="sk-line" style={{ width: '95%' }} />
        <Shimmer className="sk-line" style={{ width: '88%' }} />
        <Shimmer className="sk-line" style={{ width: '60%' }} />
        <div className="pd-meta">
          {Array.from({ length: 4 }, (_, i) => (
            <Shimmer key={i} className="sk-meta" />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Shimmer className="sk-btn" style={{ width: 120, height: 44 }} />
          <Shimmer className="sk-btn" style={{ width: 220, height: 44 }} />
        </div>
      </div>
    </div>
  );
}
