import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { storeInfo } from '../data/mockData';
import ProductImg from '../components/ProductImg';

const DELIVERY_FEE = 900;

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, updateQty, removeFromCart, clearCart } = useStore();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [placed, setPlaced] = useState(null);

  const freeDelivery = cartTotal >= storeInfo.freeDeliveryThreshold;
  const delivery = cartItems.length === 0 || freeDelivery ? 0 : DELIVERY_FEE;
  const total = cartTotal + delivery;

  const placeOrder = (e) => {
    e.preventDefault();
    const order = {
      id: 'HM-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      total,
      items: cartItems.length,
    };
    setPlaced(order);
    clearCart();
  };

  const closeAndGo = () => {
    setCheckoutOpen(false);
    setPlaced(null);
    navigate('/shop');
  };

  return (
    <div className="container">
      <div className="page-heading">
        <h1>🛒 Shopping Bag</h1>
        <p>{cartItems.length} item type(s) in your bag · Demo checkout (no real payment)</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-state">
          <div className="big">🛒</div>
          <h2>Your bag is empty</h2>
          <p>Add some halal goodness from the shop!</p>
          <Link to="/shop" className="btn primary">Browse Products</Link>
        </div>
      ) : (
        <div className="cart-wrap">
          <div className="cart-table">
            {cartItems.map(({ product, qty }) => (
              <div className="cart-row" key={product.id}>
                <div className="cart-emoji">
                  <ProductImg product={product} className="cart-photo" />
                </div>
                <div className="cart-info">
                  <strong>
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                  </strong>
                  <span>{product.brand} · {product.weight} · ¥{product.price.toLocaleString()} each</span>
                </div>
                <div className="qty-box">
                  <button onClick={() => updateQty(product.id, qty - 1)}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => updateQty(product.id, qty + 1)}>＋</button>
                </div>
                <div className="cart-price">¥{(product.price * qty).toLocaleString()}</div>
                <button className="cart-remove" onClick={() => removeFromCart(product.id)} title="Remove">
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="sum-line"><span>Subtotal</span><span>¥{cartTotal.toLocaleString()}</span></div>
            <div className="sum-line"><span>Delivery</span><span>{delivery === 0 ? 'FREE 🎉' : `¥${delivery.toLocaleString()}`}</span></div>
            <div className="sum-line total"><span>Total</span><span>¥{total.toLocaleString()}</span></div>

            {freeDelivery ? (
              <div className="free-delivery-note">✅ You've unlocked FREE delivery!</div>
            ) : (
              <div className="free-delivery-note">
                🚚 Add ¥{(storeInfo.freeDeliveryThreshold - cartTotal).toLocaleString()} more for free delivery
              </div>
            )}

            <button className="btn primary btn-block" onClick={() => setCheckoutOpen(true)}>
              Proceed to Checkout →
            </button>
            <button className="btn ghost btn-block" style={{ marginTop: 8 }} onClick={clearCart}>
              Clear Bag
            </button>
          </div>
        </div>
      )}

      {checkoutOpen && !placed && (
        <div className="modal-backdrop" onClick={() => setCheckoutOpen(false)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={placeOrder}>
            <h2>Checkout (Demo)</h2>
            <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>
              Mock checkout — no payment is processed. Backend coming soon.
            </p>
            <div className="form-grid">
              <input required placeholder="Full name" />
              <input required type="email" placeholder="Email address" />
              <input required placeholder="Postal code (〒)" />
              <input required placeholder="Address (address, city, prefecture)" />
              <input required placeholder="Phone number" />
              <select required className="sort-select" defaultValue="">
                <option value="" disabled>Payment method</option>
                <option>Cash on Delivery</option>
                <option>Credit Card (demo)</option>
                <option>Bank Transfer</option>
                <option>PayPay (demo)</option>
              </select>
            </div>
            <div className="sum-line total" style={{ border: 'none', padding: 0 }}>
              <span>Total</span><span>¥{total.toLocaleString()}</span>
            </div>
            <button type="submit" className="btn primary btn-block" style={{ marginTop: 14 }}>
              Place Order 🌙
            </button>
          </form>
        </div>
      )}

      {placed && (
        <div className="modal-backdrop">
          <div className="modal" style={{ textAlign: 'center' }}>
            <div className="success-icon">🌙</div>
            <h2>Order Placed!</h2>
            <p style={{ color: '#6b7280' }}>JazakAllah khair — your demo order was received.</p>
            <div className="success-lines">
              <div><span>Order ID</span><strong>{placed.id}</strong></div>
              <div><span>Items</span><strong>{placed.items}</strong></div>
              <div><span>Total</span><strong>¥{placed.total.toLocaleString()}</strong></div>
              <div><span>Delivery</span><strong>2–4 days (mock)</strong></div>
            </div>
            <button className="btn primary btn-block" onClick={closeAndGo}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
