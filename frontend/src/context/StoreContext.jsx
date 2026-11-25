import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getProduct } from '../data/mockData';

const StoreContext = createContext(null);

const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => load('hm_cart', [])); // [{id, qty}]
  const [wishlist, setWishlist] = useState(() => load('hm_wishlist', [])); // [id]
  const [user, setUser] = useState(() => load('hm_user', null)); // {name, email}
  const [toast, setToast] = useState(null);

  useEffect(() => localStorage.setItem('hm_cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('hm_wishlist', JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem('hm_user', JSON.stringify(user)), [user]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const cartItems = useMemo(
    () =>
      cart
        .map((c) => ({ ...c, product: getProduct(c.id) }))
        .filter((c) => c.product),
    [cart]
  );

  const cartCount = cart.reduce((n, c) => n + c.qty, 0);
  const cartTotal = cartItems.reduce((n, c) => n + c.product.price * c.qty, 0);

  const addToCart = (id, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === id);
      if (existing) {
        return prev.map((c) => (c.id === id ? { ...c, qty: c.qty + qty } : c));
      }
      return [...prev, { id, qty }];
    });
    setToast(`Added to bag ✓ ${getProduct(id)?.name ?? ''}`);
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((c) => c.id !== id));
    } else {
      setCart((prev) => prev.map((c) => (c.id === id ? { ...c, qty } : c)));
    }
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((c) => c.id !== id));
  const clearCart = () => setCart([]);

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const has = prev.includes(id);
      setToast(has ? 'Removed from wishlist' : 'Added to wishlist ♥');
      return has ? prev.filter((w) => w !== id) : [...prev, id];
    });
  };

  const login = (mockUser) => {
    setUser(mockUser);
    setToast(`Welcome, ${mockUser.name}! 🌙`);
  };

  const logout = () => {
    setUser(null);
    setToast('Logged out');
  };

  const value = {
    user,
    login,
    logout,
    cart,
    cartItems,
    cartCount,
    cartTotal,
    wishlist,
    toast,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    toggleWishlist,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
