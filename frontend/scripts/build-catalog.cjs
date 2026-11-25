// Builds src/data/mockData.js from scripts/scrape.json (real products scraped
// from the reference shop) and downloads product images into public/products.
// Run once: node scripts/build-catalog.cjs
const fs = require('fs');
const path = require('path');

const items = JSON.parse(fs.readFileSync(path.join(__dirname, 'scrape.json'), 'utf8'));
const IMG_DIR = path.join(__dirname, '..', 'public', 'products');
fs.mkdirSync(IMG_DIR, { recursive: true });

// ---- category mapping by url slug keyword ----
const CAT = (slug) => {
  if (/chicken-leg|chicken-popcorn|shawarma/.test(slug)) return ['meat-fish', /popcorn|shawarma/.test(slug) ? 'Frozen Snacks' : 'Halal Chicken'];
  if (/fish|magur|baim|puti|koral/.test(slug)) return ['meat-fish', 'Fish & Seafood'];
  if (/masala|bumbu|chilli-flakes/.test(slug)) return ['masala-spice', /masala/.test(slug) ? 'Spice Mix' : 'Whole Spices'];
  if (/lal-shak|kochu-shak|jackfruit/.test(slug)) return ['fruits-vegetables', /jackfruit/.test(slug) ? 'Frozen & Canned' : 'Fresh Vegetables'];
  if (/rice|couscous/.test(slug)) return ['cooking', 'Rice & Grains'];
  if (/coconut-fine|coconut-long/.test(slug)) return ['cooking', 'Flour & Baking'];
  if (/chin-su|honey/.test(slug)) return ['cooking', 'Sauces & Paste'];
  if (/polos|yaprak/.test(slug)) return ['cooking', 'Canned & Jarred'];
  if (/coconut-milk|coconut-cream|kapal|java-latte/.test(slug)) return ['drinks-beverages', /kapal|java/.test(slug) ? 'Tea & Coffee' : 'Juice & Milk'];
  if (/biscuits|tipo|cosy|milky-shorties/.test(slug)) return ['snacks-sweets', 'Biscuits & Cookies'];
  if (/noodles|chips|crispy-skin|nimco|badshahi|khat|dal-moth/.test(slug)) return ['snacks-sweets', 'Chips & Noodles'];
  if (/chocolate|jelabi|pie|cake|rochers/.test(slug)) return ['snacks-sweets', 'Chocolate & Sweets'];
  return ['snacks-sweets', 'Chocolate & Sweets'];
};

// ---- brand detection ----
const BRAND = (slug, name) => {
  const pairs = [
    [/kara/, 'Kara'], [/hemani/, 'Hemani'], [/sa-giang/, 'SA Giang'], [/campo-belo/, 'Campo Belo'],
    [/thar-lon/, 'Thar Lon Thu'], [/national/, 'National'], [/maliban/, 'Maliban'], [/ahmed/, 'Ahmed'],
    [/burcu/, 'Burcu'], [/lezitta/, 'Lezitta'], [/united-king/, 'United King'], [/belta/, 'Belta'],
    [/pran/, 'Pran'], [/treat/, 'Treat'], [/abc-mi/, 'ABC'], [/kapal/, 'Kapal Api'],
    [/tipo/, 'Tipo'], [/cosy/, 'Cosy'], [/ibadah/, 'IBADAH'], [/puro/, 'Puro'],
    [/chin-su/, 'Chin-Su'], [/pure-curry/, 'Pure Curry'],
  ];
  for (const [re, brand] of pairs) if (re.test(slug)) return brand;
  return 'Imported';
};

// ---- weight detection ----
const WEIGHT = (name) => {
  const m = name.match(/(\d+(?:\.\d+)?)\s?(kg|ml|g|gm|L)\b/i);
  if (!m) return '';
  const v = m[1]; let u = m[2].toLowerCase();
  if (u === 'gm') u = 'g';
  if (u === 'l') u = 'L';
  return `${v}${u}`;
};

const JP_RE = /[\u3000-\u30ff\u4e00-\u9fff\uff01-\uff5e]+.*$/;

// ---- download images ----
const slugOf = (u) => path.basename(u).replace(/-\d{8,}.*$/, '');
const fileFor = (u) => path.join(IMG_DIR, `${slugOf(u)}.webp`);

(async () => {
  const dl = [];
  for (const it of items) {
    const f = fileFor(it.u);
    if (fs.existsSync(f) && fs.statSync(f).size > 2000) continue;
    dl.push(
      fetch(it.u, { headers: { 'User-Agent': 'Mozilla/5.0' } })
        .then(async (r) => {
          if (!r.ok) throw new Error(String(r.status));
          fs.writeFileSync(f, Buffer.from(await r.arrayBuffer()));
          console.log('ok ', slugOf(it.u));
        })
        .catch((e) => console.log('FAIL', slugOf(it.u), e.message))
    );
    await new Promise((r) => setTimeout(r, 250));
  }
  await Promise.all(dl);
  console.log('downloads done');

  // ---- build products ----
  const products = items.map((it, idx) => {
    const id = idx + 1;
    const slug = path.basename(it.u);
    let text = it.t.replace(/^✦ NEW\s*/, '').replace(/^¥\s*/, '');
    const price = parseInt(text.match(/^(\d{3,5})/)?.[1] ?? '0', 10);
    text = text.replace(/^\d{3,5}\s*/, '');
    const jpMatch = text.match(/(\S*)\s([^\x00-\x7F].*)$/); // split english / japanese tail
    let name = text, jp = '';
    // find where japanese starts: first CJK char
    const cjkIdx = text.search(/[\u3000-\u30ff\u4e00-\u9fff\uff01-\uff5e]/);
    if (cjkIdx > 0) {
      name = text.slice(0, cjkIdx).trim().replace(/[|/]+$/, '').trim();
      jp = text.slice(cjkIdx).trim();
    }
    // drop leading "|| " if any
    jp = jp.replace(/^[|│]+\s*/, '');
    // capture weight BEFORE stripping it from the name
    const weightStr = WEIGHT(name);
    // drop trailing weight & brand from name (already extracted separately)
    if (weightStr) name = name.replace(new RegExp(`\\s*${weightStr}\\s*(\\(\\d+\\s*pcs\\))?\\s*$`, 'i'), '').trim();
    const b = BRAND(slug, name);
    name = name.replace(new RegExp(`\\s*${b}\\s*$`, 'i'), '').trim();
    name = name.replace(/\\s*\\|\\|\\s*$/, '').trim();
    const [category, sub] = CAT(slug);
    const deterministic = (seed) => (Math.sin(seed * 99.7) + 1) / 2; // 0..1 stable
    return {
      id,
      slug: slugOf(it.u),
      name,
      jp,
      price,
      oldPrice: price > 400 && deterministic(id) > 0.72 ? Math.round(price * 1.12 / 10) * 10 : null,
      category,
      sub,
      brand: BRAND(slug, name),
      weight: weightStr,
      emoji: { 'meat-fish': '🍗', 'masala-spice': '🌶️', 'fruits-vegetables': '🥬', cooking: '🍛', 'drinks-beverages': '🥤', 'snacks-sweets': '🍪', 'beans-dry-fruits': '🥜' }[category],
      rating: Math.round((4.0 + deterministic(id + 3) * 0.9) * 10) / 10,
      reviews: 8 + Math.floor(deterministic(id + 7) * 180),
      isNew: /✦ NEW/.test(it.t),
      ramadan: /jelabi|honey|coconut-pie|pound-cake|dry-cake|rochers/.test(slug),
      stock: 6 + Math.floor(deterministic(id + 11) * 90),
      popular: [1, 5, 9, 10, 19, 27, 56, 57, 58].includes(id),
      image: `/products/${slugOf(it.u)}.webp`,
      description: `Halal certified ${sub.toLowerCase()} imported and quality checked. Authentic ${name} — a favorite among our customers in Japan. Delivered fresh from Halal Mart.`,
    };
  });

  // categories with real thumbnails + pastel tint for the tile label bar
  const categories = [
    { id: 'most-popular', name: 'Most Popular', emoji: '🔥', subcategories: [], image: '/categories/most-popular.webp', tint: '#e8f8ef', pos: 'right center' },
    { id: 'ramadan-special', name: 'Ramadan Special', emoji: '🌙', subcategories: [], image: '/categories/ramadan-special.webp', tint: '#fdf0e6', pos: 'right center' },
    { id: 'meat-fish', name: 'Meat & Fish', emoji: '🍗', subcategories: ['Halal Chicken', 'Fish & Seafood', 'Frozen Snacks'], image: '/categories/meat-fish.webp', tint: '#eef7ee', pos: 'center bottom' },
    { id: 'masala-spice', name: 'Masala & Spice', emoji: '🌶️', subcategories: ['Spice Mix', 'Whole Spices'], image: '/categories/masala-spice.webp', tint: '#fdf3e7', pos: 'center bottom' },
    { id: 'fruits-vegetables', name: 'Fruits & Vegetables', emoji: '🥬', subcategories: ['Fresh Vegetables', 'Frozen & Canned'], image: '/categories/fruits-vegetables.webp', tint: '#eefaf1', pos: 'center bottom' },
    { id: 'cooking', name: 'Cooking', emoji: '🍛', subcategories: ['Rice & Grains', 'Flour & Baking', 'Sauces & Paste', 'Canned & Jarred'], image: '/categories/cooking.webp', tint: '#eef2fb', pos: 'center bottom' },
    { id: 'drinks-beverages', name: 'Drinks & Beverages', emoji: '🥤', subcategories: ['Tea & Coffee', 'Juice & Milk'], image: '/categories/drinks-beverages.webp', tint: '#f0f8fd', pos: 'center bottom' },
    { id: 'snacks-sweets', name: 'Snacks & Sweets', emoji: '🍪', subcategories: ['Biscuits & Cookies', 'Chips & Noodles', 'Chocolate & Sweets'], image: '/categories/snacks-sweets.webp', tint: '#fbf0f4', pos: 'center bottom' },
    { id: 'beans-dry-fruits', name: 'Beans & Dry Fruits', emoji: '🥜', subcategories: ['Lentils & Beans', 'Dry Fruits & Nuts'], image: '/categories/beans-dry-fruits.webp', tint: '#f7f9ef', pos: 'center bottom' },
  ];

  const header = `// ============================================================
// MOCK DATA — real product catalog (names, prices & images
// collected from the reference shop for demo purposes).
// When backend + DB are decided, replace this file with
// fetch/axios calls returning the same shapes.
// ============================================================

export const storeInfo = {
  name: 'Halal Mart',
  tagline: 'Halal Food · Japan',
  banner: 'Enjoy FREE DELIVERY on orders of ¥10,000 or more. If you order fresh and frozen items together, your order may be delivered together in a refrigerated box.',
  currency: '¥',
  freeDeliveryThreshold: 10000,
};

`;

  const catBlock = `export const categories = ${JSON.stringify(categories, null, 2)};\n\n`;

  const prodBlock =
    `// GET /api/products  →  { products: [...] }\nexport const products = ` +
    JSON.stringify(products, null, 2) +
    `;\n\n`;

  const helpers = `// GET /api/products/featured → most popular 8
export const getFeatured = () => products.filter((p) => p.popular).slice(0, 8);
export const getNewArrivals = () => products.filter((p) => p.isNew).slice(0, 8);
export const getProduct = (id) => products.find((p) => p.id === Number(id));
`;

  fs.writeFileSync(
    path.join(__dirname, '..', 'src', 'data', 'mockData.js'),
    header + catBlock + prodBlock + helpers
  );
  console.log('mockData.js written with', products.length, 'products');

  // report products with missing images
  const missing = products.filter((p) => !fs.existsSync(path.join(IMG_DIR, `${p.slug}.webp`)));
  console.log('missing images:', missing.map((m) => m.slug).join(', ') || 'none');
})();
