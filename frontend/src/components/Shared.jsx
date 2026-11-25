import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { categories, products, storeInfo } from '../data/mockData';

export function TopBanner() {
  return <div className="top-banner">{storeInfo.banner}</div>;
}

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="footer">
      <div className="foot-news">
        <div className="fn-inner container">
          <div>
            <h3>🌙 Get Weekly Deals & Ramadan Updates</h3>
            <p>Fresh arrival alerts, discount codes and iftar recipe ideas — straight to your inbox.</p>
          </div>
          {subscribed ? (
            <div className="fn-done">✅ JazakAllah khair! Check <strong>{email}</strong> for your welcome discount.</div>
          ) : (
            <form className="fn-form" onSubmit={(e) => { e.preventDefault(); if (email.trim()) setSubscribed(true); }}>
              <input type="email" required placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button className="btn" type="submit">Subscribe →</button>
            </form>
          )}
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-inner container">
          <div className="foot-brand">
            <div className="foot-logo">
              <div className="logo-mark">🌙</div>
              <div>
                <h4>Halal Mart</h4>
                <p className="foot-tag">100% Halal · 100% Authentic</p>
              </div>
            </div>
            <p>
              Your trusted halal grocery store in Japan — certified zabiha meat, South Asian,
              Southeast Asian & Middle Eastern groceries delivered nationwide.
            </p>
            <div className="foot-social">
              {['📘', '📷', '🎵', '💬', '✈️'].map((s, i) => (
                <a key={i} href="#" onClick={(e) => e.preventDefault()} title="Social link (demo)">{s}</a>
              ))}
            </div>
            <div className="foot-halal">✅ Certified Halal · Zabiha Slaughtered</div>
          </div>

          <div>
            <h4>Shop Categories</h4>
            {categories.slice(2, 8).map((c) => (
              <Link key={c.id} to={`/shop?cat=${c.id}`}>{c.emoji} {c.name}</Link>
            ))}
          </div>

          <div>
            <h4>Customer Care</h4>
            <Link to="/about">ℹ️ About Us</Link>
            <a href="#" onClick={(e) => e.preventDefault()}>🚚 Delivery Information</a>
            <a href="#" onClick={(e) => e.preventDefault()}>↩️ Returns & Refunds</a>
            <a href="#" onClick={(e) => e.preventDefault()}>🧾 Halal Certificate (PDF)</a>
            <a href="#" onClick={(e) => e.preventDefault()}>📞 080-XXXX-XXXX</a>
            <a href="#" onClick={(e) => e.preventDefault()}>💬 WhatsApp Support</a>
          </div>

          <div>
            <h4>Visit Our Stores</h4>
            <p>🕌 <strong>Gunma (Flagship)</strong><br />2-15-5 Oizumi-machi, Ora-gun<br />10:00–21:00 daily</p>
            <p>📍 <strong>Tokyo</strong><br />Ikebukuro, Toshima-ku<br />11:00–21:00 daily</p>
            <p>📍 <strong>Nagoya</strong><br />Naka-ku, Nagoya<br />11:00–20:00 (Tue closed)</p>
          </div>

          <div>
            <h4>We Accept</h4>
            <div className="foot-pay">
              {['💳', '🏦', '📦', '📱'].map((p, i) => (
                <span key={i} className="pay-chip">{p}</span>
              ))}
            </div>
            <p style={{ marginTop: 10, fontSize: 12.5 }}>
              Credit Card · Bank Transfer<br />Cash on Delivery · PayPay (demo)
            </p>
            <div className="foot-free">🚚 Free delivery over ¥{storeInfo.freeDeliveryThreshold.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Halal Mart — Demo store with mock data · React + Vite</span>
        <span>🌙 Bismillah — made with ❤️ for the Muslim community in Japan</span>
      </div>
    </footer>
  );
}

const countFor = (catId, sub = null) =>
  catId === 'most-popular'
    ? products.filter((p) => p.popular).length
    : catId === 'ramadan-special'
      ? products.filter((p) => p.ramadan).length
      : products.filter((p) => p.category === catId && (sub ? p.sub === sub : true)).length;

export function CategorySidebar({ activeCat, activeSub }) {
  const navigate = useNavigate();
  // accordion: only ONE category open at a time (plus the active one auto-opens)
  const [openCat, setOpenCat] = useState(null);

  // navigating to a category auto-opens just that one, collapsing the rest
  useEffect(() => {
    setOpenCat(activeCat ?? null);
  }, [activeCat]);

  const toggle = (id) => setOpenCat((prev) => (prev === id ? null : id));

  return (
    <aside className="sidebar">
      {categories.map((cat) => {
        const isActive = activeCat === cat.id;
        const isOpen = openCat === cat.id;
        const hasSubs = cat.subcategories.length > 0;
        return (
          <div key={cat.id} className={`sidebar-group ${isOpen ? 'open' : ''}`}>
            <div className={`sidebar-item ${isActive ? 'active' : ''}`}>
              <Link to={`/shop?cat=${cat.id}`} className="sidebar-link" title={cat.name}>
                <span className="side-emoji">{cat.emoji}</span>
                <span className="side-name">{cat.name}</span>
              </Link>
              {hasSubs ? (
                <button
                  className={`chevron ${isOpen ? 'rot' : ''}`}
                  onClick={() => toggle(cat.id)}
                  aria-label={isOpen ? `Collapse ${cat.name}` : `Expand ${cat.name}`}
                  title={isOpen ? 'Collapse' : 'Expand'}
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ) : (
                <span className="side-count" title={`${countFor(cat.id)} products`}>
                  {countFor(cat.id)}
                </span>
              )}
            </div>

            {hasSubs && isOpen && (
              <div className="sidebar-sub">
                <button
                  className={`sub-btn ${isActive && !activeSub ? 'active' : ''}`}
                  onClick={() => navigate(`/shop?cat=${cat.id}`)}
                >
                  <span className="dot" /> All {cat.name}
                  <span className="side-count">{countFor(cat.id)}</span>
                </button>
                {cat.subcategories.map((sub) => (
                  <button
                    key={sub}
                    className={`sub-btn ${activeSub === sub ? 'active' : ''}`}
                    onClick={() => navigate(`/shop?cat=${cat.id}&sub=${encodeURIComponent(sub)}`)}
                  >
                    <span className="dot" /> {sub}
                    <span className="side-count">{countFor(cat.id, sub)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
}
