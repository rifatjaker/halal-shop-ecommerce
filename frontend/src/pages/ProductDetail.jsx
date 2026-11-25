import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductImg from '../components/ProductImg';
import { SkeletonDetail } from '../components/Skeletons';
import { useMockApi } from '../hooks/useMockApi';
import { getProduct, products } from '../data/mockData';
import { useStore } from '../context/StoreContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [qty, setQty] = useState(1);
  const { data: product, loading } = useMockApi(() => getProduct(id), [id], 350);

  if (loading) {
    return (
      <div className="container">
        <SkeletonDetail />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="big">🤔</div>
          <h2>Product not found</h2>
          <button className="btn primary" onClick={() => navigate('/shop')}>Back to shop</button>
        </div>
      </div>
    );
  }

  const wished = wishlist.includes(product.id);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 5);
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  return (
    <div className="container">
      <p style={{ fontSize: 13, color: '#6b7280', margin: '18px 0 0' }}>
        <Link to="/">Home</Link> ›{' '}
        <Link to={`/shop?cat=${product.category}`}>{product.category.replace(/-/g, ' ')}</Link>{' '}
        › {product.name}
      </p>

      <div className="pd">
        <div className="pd-image">
          <ProductImg product={product} className="pd-photo" />
        </div>

        <div className="pd-info">
          <div className="card-brand">{product.brand} · {product.weight}</div>
          <h1>{product.name}</h1>
          <div className="pd-jp">{product.jp} · {product.sub}</div>
          <div className="pd-price">
            ¥{product.price.toLocaleString()}
            {product.oldPrice && (
              <>
                {' '}<span className="price-old">¥{product.oldPrice.toLocaleString()}</span>
                <span className="badge sale" style={{ marginLeft: 10, verticalAlign: 'middle' }}>
                  -{discount}%
                </span>
              </>
            )}
          </div>
          <span className="stars">{'★'.repeat(Math.round(product.rating))} <span style={{ color: '#6b7280', letterSpacing: 0 }}>{product.rating} · {product.reviews} reviews</span></span>

          <p className="pd-desc">{product.description}</p>

          <div className="pd-meta">
            <div><strong>Brand</strong>{product.brand}</div>
            <div><strong>Weight</strong>{product.weight}</div>
            <div><strong>Category</strong>{product.sub}</div>
            <div>
              <strong>Stock</strong>
              <span className={product.stock < 12 ? 'stock-low' : 'stock-ok'}>
                {product.stock < 12 ? `Only ${product.stock} left!` : `${product.stock} in stock`}
              </span>
            </div>
          </div>

          <div className="pd-actions">
            <div className="qty-box">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>＋</button>
            </div>
            <button className="btn primary" onClick={() => addToCart(product.id, qty)}>
              🛒 Add to Bag — ¥{(product.price * qty).toLocaleString()}
            </button>
            <button
              className="btn outline"
              onClick={() => {
                toggleWishlist(product.id);
                if (!wished) addToCart(product.id, qty);
                navigate('/cart');
              }}
            >
              {wished ? '❤️ In Wishlist' : '🤍 Buy Now'}
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <>
          <div className="section-title">
            <h2>You may also like</h2>
            <Link className="see-all" to={`/shop?cat=${product.category}`}>See all →</Link>
          </div>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
