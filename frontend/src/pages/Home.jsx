import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { SkeletonGrid } from '../components/Skeletons';
import { useMockApi } from '../hooks/useMockApi';
import {
  HalalQuote,
  BestSales,
  MostLoved,
  CustomerReviews,
  StoreLocationsSection,
} from '../components/HomeSections';
import { categories, getFeatured, getNewArrivals, storeInfo, products } from '../data/mockData';

export default function Home() {
  const navigate = useNavigate();
  const { data, loading } = useMockApi(
    () => ({ featured: getFeatured(), arrivals: getNewArrivals(), all: products }),
    [],
    500
  );
  const featured = data?.featured ?? [];
  const newArrivals = data?.arrivals ?? [];

  return (
    <div className="container">
      {/* Hero */}
      <section className="hero">
        <div className="hero-text">
          <span className="hero-eyebrow">🌙 HALAL FOOD · JAPAN</span>
          <h1>100% Halal.<br />100% Authentic.</h1>
          <p>
            Halal certified meat, masala, rice, snacks and Ramadan specials —
            fresh & frozen groceries delivered across Japan.
          </p>
          <div className="hero-cta">
            <button className="btn" onClick={() => navigate('/shop')}>🛍️ Shop Now →</button>
            <Link className="btn outline-light" to="/shop?cat=ramadan-special">🌙 Ramadan Special</Link>
          </div>
          <div className="hero-trust">
            <span>✅ Zabiha Halal</span>
            <span>❄️ Fresh & Frozen</span>
            <span>🚚 Free over ¥10,000</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-main-img">
            <img src="/categories/meat-fish.webp" alt="Fresh halal meat and fish" />
          </div>
          <div className="hero-chip hc-1">
            <img src="/products/tipo-cream-egg-cookies-220g.webp" alt="" />
            <div><strong>Tipo Cookies</strong><span>¥450</span></div>
          </div>
          <div className="hero-chip hc-2">
            <img src="/products/chicken-leg-whole-big-size-2kg.webp" alt="" />
            <div><strong>Halal Chicken</strong><span>¥1,480</span></div>
          </div>
          <div className="hero-chip hc-3">
            <img src="/products/lal-shak-250gm.webp" alt="" />
            <div><strong>Fresh Lal Shak</strong><span>¥390</span></div>
          </div>
          <div className="hero-badge">
            <strong>60+ products</strong>
            <span>imported & halal verified</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <div className="section-title">
        <h2>Shop by Category</h2>
        <Link className="see-all" to="/shop">See all →</Link>
      </div>
      <div className="cat-tiles">
        {categories.map((c) => (
          <Link
            key={c.id}
            to={`/shop?cat=${c.id}`}
            className="cat-tile"
            style={{ '--tint': c.tint }}
          >
            <div className="tile-img">
              <img
                src={c.image}
                alt={c.name}
                loading="lazy"
                style={{ objectPosition: c.pos }}
              />
            </div>
            <div className="tile-label">
              <span className="tile-emoji">{c.emoji}</span> {c.name}
            </div>
          </Link>
        ))}
      </div>

      {/* New arrivals */}
      <div className="section-title">
        <h2>✦ New Arrivals</h2>
        <Link className="see-all" to="/shop?sort=new">See all →</Link>
      </div>
      <div className="product-grid">
        {loading ? <SkeletonGrid count={8} /> : newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>

      {/* Most popular */}
      <div className="section-title">
        <h2>🔥 Most Popular</h2>
        <Link className="see-all" to="/shop?cat=most-popular">See all →</Link>
      </div>
      <div className="product-grid">
        {loading ? <SkeletonGrid count={8} /> : featured.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>

      {/* Halal certification quote */}
      <HalalQuote />

      {/* Best sales & most loved */}
      <BestSales products={data?.all ?? []} loading={loading} />
      <MostLoved products={data?.all ?? []} loading={loading} />

      {/* Customer reviews */}
      <CustomerReviews />

      {/* Physical stores */}
      <StoreLocationsSection />

      {/* Feature strip */}
      <div className="features">
        <div className="feature">
          <div className="f-emoji">✅</div>
          <div>
            <strong>Halal Certified</strong>
            <span>All meat is zabiha slaughtered</span>
          </div>
        </div>
        <div className="feature">
          <div className="f-emoji">❄️</div>
          <div>
            <strong>Fresh & Frozen</strong>
            <span>Refrigerated box delivery</span>
          </div>
        </div>
        <div className="feature">
          <div className="f-emoji">🚚</div>
          <div>
            <strong>Free Delivery</strong>
            <span>On orders over ¥{storeInfo.freeDeliveryThreshold.toLocaleString()}</span>
          </div>
        </div>
        <div className="feature">
          <div className="f-emoji">💬</div>
          <div>
            <strong>Support</strong>
            <span>English / বাংলা / 日本語</span>
          </div>
        </div>
      </div>
    </div>
  );
}
