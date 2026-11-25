import { Link } from 'react-router-dom';
import { storeInfo } from '../data/mockData';

export default function About() {
  return (
    <div className="container">
      <div className="page-heading">
        <h1>ℹ️ About {storeInfo.name}</h1>
        <p>Demo storefront — frontend only, backend & database to be decided.</p>
      </div>

      <div className="cart-wrap" style={{ display: 'block' }}>
        <div className="cart-summary" style={{ width: 'auto', position: 'static', marginBottom: 20 }}>
          <h3>🌙 Our Story</h3>
          <p className="pd-desc">
            {storeInfo.name} is a halal grocery e-commerce demo for customers living in Japan —
            Bangladeshis, Pakistanis, Indonesians, Malaysians, Turkish, Sri Lankans, Arabs
            and Japanese Muslim families. We bring certified halal meat, authentic spices,
            rice, atta, fresh & frozen foods and Ramadan essentials to your door.
          </p>
        </div>

        <div className="cart-summary" style={{ width: 'auto', position: 'static', marginBottom: 20 }}>
          <h3>✅ Why shop with us</h3>
          <ul style={{ lineHeight: 2, margin: 0, paddingLeft: 18 }}>
            <li>100% halal certified meat — zabiha slaughtered</li>
            <li>Fresh & frozen items shipped in a refrigerated box ❄️</li>
            <li>Free delivery on orders over ¥{storeInfo.freeDeliveryThreshold.toLocaleString()}</li>
            <li>Customer support in English, বাংলা and 日本語</li>
            <li>Cash on Delivery, Credit Card, Bank Transfer & PayPay</li>
          </ul>
        </div>

        <div className="cart-summary" style={{ width: 'auto', position: 'static' }}>
          <h3>🛠️ This Demo</h3>
          <ul style={{ lineHeight: 2, margin: 0, paddingLeft: 18 }}>
            <li><strong>Frontend:</strong> React + Vite + React Router (this site)</li>
            <li><strong>Data:</strong> Mock catalog in <code>src/data/mockData.js</code> — shaped like future API responses</li>
            <li><strong>State:</strong> Cart & wishlist persisted in localStorage</li>
            <li><strong>Next:</strong> Backend + database (to be decided), auth, real payments, order history</li>
          </ul>
          <Link to="/shop" className="btn primary" style={{ marginTop: 16 }}>Start Shopping →</Link>
        </div>
      </div>
    </div>
  );
}
