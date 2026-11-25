import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/mockData';
import ProductImg from './ProductImg';

export default function SearchBox() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(-1);
  const cursorRef = useRef(-1);
  const setCursorSafe = (v) => {
    cursorRef.current = v;
    setCursor(v);
  };
  const boxRef = useRef(null);

  const query = q.trim().toLowerCase();
  const matches =
    query.length >= 1
      ? products
          .filter(
            (p) =>
              p.name.toLowerCase().includes(query) ||
              p.jp.includes(query) ||
              p.brand.toLowerCase().includes(query) ||
              p.sub.toLowerCase().includes(query)
          )
          .slice(0, 6)
      : [];

  // close on outside click
  useEffect(() => {
    const onDoc = (e) => {
      if (!boxRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => setCursorSafe(-1), [q]);

  const go = (id) => {
    setOpen(false);
    setQ('');
    navigate(`/product/${id}`);
  };

  const onKeyDown = (e) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursorSafe(Math.min(cursorRef.current + 1, matches.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursorSafe(Math.max(cursorRef.current - 1, -1));
    } else if (e.key === 'Escape') {
      setOpen(false);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const c = cursorRef.current;
      if (c >= 0 && matches[c]) go(matches[c].id);
      else {
        setOpen(false);
        navigate(query ? `/shop?q=${encodeURIComponent(query)}` : '/shop');
      }
    }
  };

  return (
    <div className="search-wrap" ref={boxRef}>
      <form
        className="search"
        onSubmit={(e) => {
          e.preventDefault();
          setOpen(false);
          navigate(query ? `/shop?q=${encodeURIComponent(query)}` : '/shop');
        }}
      >
        <input
          type="text"
          placeholder="Search for products..."
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          autoComplete="off"
        />
        <button type="submit" aria-label="Search">🔍</button>
      </form>

      {open && query && (
        <div className="suggest">
          {matches.length === 0 ? (
            <div className="suggest-empty">
              🔍 No match for “{q.trim()}” — press Enter to search all products
            </div>
          ) : (
            <>
              <div className="suggest-head">Products</div>
              {matches.map((p, i) => (
                <button
                  key={p.id}
                  className={`suggest-item ${i === cursor ? 'hovered' : ''}`}
                  onMouseEnter={() => setCursorSafe(i)}
                  onClick={() => go(p.id)}
                >
                  <span className="s-thumb">
                    <ProductImg product={p} className="s-img" />
                  </span>
                  <span className="s-text">
                    <span className="s-name">{p.name}</span>
                    <span className="s-meta">{p.brand} · {p.weight || p.sub} · {p.jp}</span>
                  </span>
                  <span className="s-price">¥{p.price.toLocaleString()}</span>
                </button>
              ))}
              <button
                className="suggest-all"
                onMouseEnter={() => setCursor(-1)}
                onClick={() => {
                  setOpen(false);
                  navigate(`/shop?q=${encodeURIComponent(query)}`);
                }}
              >
                See all results for “{q.trim()}” →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
