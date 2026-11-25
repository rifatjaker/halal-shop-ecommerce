import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { CategorySidebar } from '../components/Shared';
import { SkeletonGrid } from '../components/Skeletons';
import { useMockApi } from '../hooks/useMockApi';
import { categories, products } from '../data/mockData';
import { useStore } from '../context/StoreContext';

export default function Shop() {
  const [params] = useSearchParams();
  const { wishlist } = useStore();
  const [sort, setSort] = useState('featured');

  const catId = params.get('cat');
  const sub = params.get('sub');
  const q = (params.get('q') || '').toLowerCase();
  const wishlistOnly = params.get('wishlist') === '1';

  const activeCat = categories.find((c) => c.id === catId);

  // simulate API latency on category/search change → skeleton grid
  const { data, loading } = useMockApi(
    () => {
      let items = products;
      if (wishlistOnly) items = items.filter((p) => wishlist.includes(p.id));
      else {
        if (catId === 'most-popular') items = items.filter((p) => p.popular);
        else if (catId === 'ramadan-special') items = items.filter((p) => p.ramadan);
        else if (catId) {
          items = items.filter((p) => p.category === catId);
          if (sub) items = items.filter((p) => p.sub === sub);
        }
        if (q) {
          items = items.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.jp.includes(q) ||
              p.brand.toLowerCase().includes(q) ||
              p.sub.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q)
          );
        }
      }
      return items;
    },
    [catId, sub, q, wishlistOnly, wishlist.length],
    450
  );

  const list = (() => {
    const items = data ?? [];
    const sorted = [...items];
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    else if (sort === 'new') sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    else if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    else sorted.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    return sorted;
  })();

  const heading = wishlistOnly
    ? 'Your Wishlist ♥'
    : q
      ? `Search results for “${params.get('q')}”`
      : activeCat
        ? `${activeCat.emoji} ${activeCat.name}${sub ? ` · ${sub}` : ''}`
        : '🛍️ All Products';

  return (
    <div className="container">
      <div className="page-heading">
        <h1>{heading}</h1>
        <p>{list.length} product{list.length !== 1 ? 's' : ''} available · Mock catalog</p>
      </div>

      <div className="page-layout">
        {!wishlistOnly && <CategorySidebar activeCat={catId} activeSub={sub} />}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="shop-toolbar">
            <span className="result-count">Showing {list.length} items</span>
            <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="featured">Sort: Featured</option>
              <option value="new">Newest first</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>

          {loading ? (
            <SkeletonGrid count={9} />
          ) : list.length === 0 ? (
            <div className="empty-state" style={{ background: '#fff', borderRadius: 14 }}>
              <div className="big">🔍</div>
              <h2>No products found</h2>
              <p>Try a different category or search term.</p>
            </div>
          ) : (
            <div className="product-grid">
              {list.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
