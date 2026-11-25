// One-off helper: fetch real product photos from Wikimedia Commons
// into frontend/public/products/{id}.jpg. Run with: node scripts/fetch-images.mjs
const fs = require('fs');
const path = require('path');

const QUERIES = {
  1: 'raw whole chicken',
  2: 'raw chicken breast meat',
  3: 'ground beef mince',
  4: 'lamb meat',
  5: 'chicken nuggets fried',
  6: 'sausages cooked',
  7: 'rohu carp fish',
  8: 'raw shrimp prawns',
  9: 'curry powder masala',
  10: 'biryani masala spice',
  11: 'turmeric powder bowl',
  12: 'cumin seeds',
  13: 'garam masala powder',
  14: 'red amaranth leaves',
  15: 'potatoes harvest',
  16: 'okra vegetable',
  17: 'green mango fruit',
  18: 'white rice bowl',
  19: 'basmati rice',
  20: 'mustard oil bottle',
  21: 'ghee',
  22: 'wheat flour atta',
  23: 'soy sauce bottle',
  24: 'garlic paste jar',
  25: 'coconut milk can',
  26: 'rose syrup bottle',
  27: 'black tea leaves ctc',
  28: 'mango juice glass',
  29: 'wafer stick cookies',
  30: 'shortbread biscuits',
  31: 'wafer rolls',
  32: 'instant noodles package',
  33: 'chocolate coins',
  34: 'red lentils masoor',
  35: 'chana dal split chickpeas',
  36: 'ajwa dates',
  37: 'ramadan iftar table food',
  38: 'almonds pile',
  39: 'red lentils dry',
};

const OUT = path.join(__dirname, '..', 'public', 'products');
fs.mkdirSync(OUT, { recursive: true });

const search = async (q) => {
  const url =
    'https://commons.wikimedia.org/w/api.php?action=query&generator=search' +
    `&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=8` +
    '&prop=imageinfo&iiprop=url|mime&iiurlwidth=500&format=json';
  const res = await fetch(url, { headers: { 'User-Agent': 'HalalMartDemo/1.0 (dev)' } });
  const d = await res.json();
  const pages = Object.values(d?.query?.pages ?? {});
  return pages
    .map((p) => p.imageinfo?.[0])
    .filter((ii) => ii && /image\/(jpeg|png)/.test(ii.mime || ''))
    .map((ii) => ii.thumburl || ii.url);
};

const download = async (url, file) => {
  const res = await fetch(url, { headers: { 'User-Agent': 'HalalMartDemo/1.0 (dev)' } });
  if (!res.ok) throw new Error(`${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 3000) throw new Error('too small');
  fs.writeFileSync(file, buf);
};

(async () => {
  const report = {};
  for (const [id, q] of Object.entries(QUERIES)) {
    const file = path.join(OUT, `${id}.jpg`);
    if (fs.existsSync(file) && fs.statSync(file).size > 5000) {
      report[id] = 'exists';
      continue;
    }
    try {
      const urls = await search(q);
      if (!urls.length) throw new Error('no results');
      let done = false;
      for (const u of urls) {
        try {
          await download(u, file);
          report[id] = q;
          done = true;
          break;
        } catch {
          /* try next result */
        }
      }
      if (!done) throw new Error('all downloads failed');
    } catch (e) {
      report[id] = `FAIL: ${e.message}`;
    }
    console.log(id, report[id]);
    await new Promise((r) => setTimeout(r, 5000)); // be polite to the API
  }
  fs.writeFileSync(path.join(__dirname, 'img-report.json'), JSON.stringify(report, null, 2));
  console.log('DONE');
})();
