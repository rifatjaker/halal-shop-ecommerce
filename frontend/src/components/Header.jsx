import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { storeInfo } from '../data/mockData';
import SearchBox from './SearchBox';

export default function Header() {
  const { cartCount, wishlist, user, logout } = useStore();

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <div className="logo-mark">🌙</div>
          <div className="logo-text">
            <strong>Halal Mart</strong>
            <span>{storeInfo.tagline}</span>
          </div>
        </Link>

        <SearchBox />

        <div className="header-actions">
          <nav>
            <NavLink to="/" end><span className="nav-emoji">🏠</span><span className="nav-label">Home</span></NavLink>
            <NavLink to="/shop"><span className="nav-emoji">🛍️</span><span className="nav-label">Shop</span></NavLink>
            <NavLink to="/about"><span className="nav-emoji">ℹ️</span><span className="nav-label">About</span></NavLink>
          </nav>

          <Link to="/shop?cat=ramadan-special" className="icon-btn" title="Ramadan Special">
            <span className="ic">🌙</span><span className="label">Daily Prayer</span>
          </Link>

          <Link to="/shop?wishlist=1" className="icon-btn" title="Wishlist">
            <span className="ic">🤍</span>
            <span className="label">Wishlist</span>
            {wishlist.length > 0 && <span className="badge-count pink">{wishlist.length}</span>}
          </Link>

          <Link to="/cart" className="icon-btn" title="Shopping Bag">
            <span className="ic">🛒</span>
            <span className="label">Bag</span>
            {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
          </Link>

          {user ? (
            <button className="icon-btn" title="Logout" onClick={logout}>
              <span className="ic avatar-mini">{user.name.charAt(0).toUpperCase()}</span>
              <span className="label">{user.name.split(' ')[0]} · Logout</span>
            </button>
          ) : (
            <Link to="/login" className="icon-btn" title="Login">
              <span className="ic">👤</span><span className="label">Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
