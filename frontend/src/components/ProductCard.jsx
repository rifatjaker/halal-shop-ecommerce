import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import ProductImg from './ProductImg';

function Stars({ rating }) {
  const full = Math.round(rating);
  return (
    <span className="stars" title={`${rating} / 5`}>
      {'★'.repeat(full)}
      <span className="dim">{'★'.repeat(5 - full)}</span>
    </span>
  );
}

export default function ProductCard({ product, highlight }) {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const wished = wishlist.includes(product.id);
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  return (
    <div className={`product-card ${highlight ? 'highlight' : ''}`}>
      <div className="card-badges">
        {product.isNew && <span className="badge new">✦ NEW</span>}
        {discount > 0 && <span className="badge sale">-{discount}%</span>}
        {product.category === 'ramadan-special' && (
          <span className="badge ramadan">🌙 Ramadan</span>
        )}
      </div>

      <button
        className={`wish-btn ${wished ? 'on' : ''}`}
        onClick={() => toggleWishlist(product.id)}
        aria-label="Add to wishlist"
      >
        {wished ? '❤️' : '🤍'}
      </button>

      <div className="card-img" onClick={() => navigate(`/product/${product.id}`)} title={product.name}>
        <ProductImg product={product} className="card-photo" />
      </div>

      <div className="card-body">
        <div className="card-brand">{product.brand} · {product.weight}</div>
        <p className="card-name" onClick={() => navigate(`/product/${product.id}`)}>
          {product.name} <span className="card-jp">{product.jp}</span>
        </p>
        <div className="card-price-row">
          <span className="price">¥{product.price.toLocaleString()}</span>
          {product.oldPrice && (
            <span className="price-old">¥{product.oldPrice.toLocaleString()}</span>
          )}
        </div>
        <div className="card-footer">
          <Stars rating={product.rating} />
          <button
            className="card-add"
            onClick={() => addToCart(product.id)}
            aria-label={`Add ${product.name} to bag`}
          >
            🛒
          </button>
        </div>
      </div>
    </div>
  );
}
