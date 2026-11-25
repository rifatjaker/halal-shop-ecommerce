import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { SkeletonGrid } from './Skeletons';
import { reviews, storeLocations, halalBadges } from '../data/extras';

/* ---------- Halal certification quote strip ---------- */
export function HalalQuote() {
  return (
    <section className="halal-quote">
      <div className="hq-inner">
        <div className="hq-seal">🌙</div>
        <div className="hq-text">
          <p className="hq-quote">
            “Every meat product we sell is <strong>100% Halal certified</strong> —
            zabiha slaughtered with tasmiyah, hand-slaughtered by a certified Muslim butcher,
            and verified by trusted certification bodies before it reaches your table.”
          </p>
          <div className="hq-badges">
            {halalBadges.map((b) => (
              <span key={b.name} className="hq-badge">
                {b.emoji} {b.name}
              </span>
            ))}
          </div>
          <div className="hq-source">— Halal Mart Quality Promise</div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Best sellers & most loved ---------- */
export function BestSales({ products, loading }) {
  return (
    <>
      <div className="section-title">
        <h2>🏆 Best Sales</h2>
        <Link className="see-all" to="/shop?sort=rating">See all →</Link>
      </div>
      <div className="product-grid">
        {loading ? (
          <SkeletonGrid count={5} />
        ) : (
          [...products]
            .sort((a, b) => b.reviews - a.reviews)
            .slice(0, 5)
            .map((p) => <ProductCard key={p.id} product={p} />)
        )}
      </div>
    </>
  );
}

export function MostLoved({ products, loading }) {
  return (
    <>
      <div className="section-title">
        <h2>❤️ Most Loved by Customers</h2>
        <Link className="see-all" to="/shop?sort=rating">See all →</Link>
      </div>
      <div className="product-grid">
        {loading ? (
          <SkeletonGrid count={5} />
        ) : (
          [...products]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5)
            .map((p) => <ProductCard key={p.id} product={p} />)
        )}
      </div>
    </>
  );
}

/* ---------- Customer reviews ---------- */
export function CustomerReviews() {
  const [idx, setIdx] = useState(0);
  const visible = [reviews[idx % reviews.length], reviews[(idx + 1) % reviews.length], reviews[(idx + 2) % reviews.length]];

  return (
    <section className="reviews">
      <div className="section-title">
        <h2>💬 What Our Customers Say</h2>
        <div className="rev-nav">
          <button onClick={() => setIdx((i) => i - 1)} aria-label="Previous reviews">←</button>
          <button onClick={() => setIdx((i) => i + 1)} aria-label="Next reviews">→</button>
        </div>
      </div>
      <div className="rev-grid">
        {visible.map((r) => (
          <div className="rev-card" key={r.id}>
            <div className="rev-stars">{'★'.repeat(r.stars)}<span>{'★'.repeat(5 - r.stars)}</span></div>
            <p className="rev-text">“{r.text}”</p>
            <div className="rev-person">
              <div className="rev-avatar" style={{ background: r.color }}>
                {r.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
              </div>
              <div>
                <strong>{r.name}</strong>
                <span>📍 {r.area} · Verified Buyer ✓</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Physical store locations ---------- */
export function StoreLocationsSection() {
  return (
    <section className="stores">
      <div className="section-title">
        <h2>🏪 Visit Our Physical Stores</h2>
        <p className="section-sub">Come see us — fresh meat counter, prayer room & Japanese-speaking staff</p>
      </div>
      <div className="store-grid">
        {storeLocations.map((s) => (
          <div className="store-card" key={s.id}>
            {s.flagship && <span className="store-flag">★ FLAGSHIP</span>}
            <div className="store-head">
              <span className="store-emoji">{s.emoji}</span>
              <strong>{s.name}</strong>
            </div>
            <p className="store-addr">📍 {s.address}<br /><span>{s.jp}</span></p>
            <p className="store-line">🕒 {s.hours}</p>
            <p className="store-line">📞 {s.phone}</p>
            <p className="store-note">{s.note}</p>
            <a
              className="btn ghost"
              href={`https://www.google.com/maps/search/${encodeURIComponent(s.name + ' ' + s.address)}`}
              target="_blank"
              rel="noreferrer"
            >
              🧭 Get Directions
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
