import { useState } from 'react';

// Renders the product photo; falls back to a big emoji if the image
// fails to load (e.g. missing asset) or is absent.
export default function ProductImg({ product, className }) {
  const [failed, setFailed] = useState(false);
  if (!product.image || failed) {
    return (
      <div className={`img-fallback ${className ?? ''}`} aria-label={product.name}>
        {product.emoji}
      </div>
    );
  }
  return (
    <img
      className={className}
      src={product.image}
      alt={product.name}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
