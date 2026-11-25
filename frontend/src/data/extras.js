// Site extras (not part of the product catalog generator):
// reviews, store locations, halal badges — mock data for the demo.

export const reviews = [
  {
    id: 1,
    name: 'Ayesha Rahman',
    area: 'Oizumi, Gunma',
    color: '#0e9f6e',
    stars: 5,
    text: 'Best halal grocery in Gunma! The chicken is always fresh and properly zabiha. Delivery came in a refrigerated box just like they promised. Alhamdulillah, ordering every week now.',
  },
  {
    id: 2,
    name: 'Muhammad Imran',
    area: 'Tokyo',
    color: '#7c3aed',
    stars: 5,
    text: 'Finally found authentic Bangladeshi shak and desi masala in Japan. The prices are way better than the shops near my station. Customer support replied to me in Bangla within minutes.',
  },
  {
    id: 3,
    name: 'Hiroshi Tanaka',
    area: 'Nagoya',
    color: '#d97706',
    stars: 4,
    text: 'I embraced Islam last year and this store made finding halal food so easy. The staff explained everything and the certification is clearly shown on every meat product.',
  },
  {
    id: 4,
    name: 'Nurul Islam',
    area: 'Saitama',
    color: '#0ea5e9',
    stars: 5,
    text: 'Ordered the Ramadan iftar items for my family of six — dates, keema, everything arrived in 2 days. The Tipo cookies and Karachi biscuits are my kids\' favorite now!',
  },
  {
    id: 5,
    name: 'Fatima Begum',
    area: 'Osaka',
    color: '#e91e63',
    stars: 5,
    text: 'The freshest rui and koral fish I have found online in Japan. Cleaned and cut exactly how I asked. Free delivery over ¥10,000 is a big saving for a big family like ours.',
  },
];

export const storeLocations = [
  {
    id: 'gunma',
    name: 'Gunma Main Store',
    emoji: '🕌',
    flagship: true,
    address: '2-15-5 Oizumi-machi, Ora-gun, Gunma 370-0516',
    jp: '群馬県邑楽郡大泉町',
    hours: '10:00 – 21:00 (Open daily)',
    phone: '080-XXXX-XXXX',
    note: 'Largest store — full fresh meat counter & prayer room',
  },
  {
    id: 'tokyo',
    name: 'Tokyo Branch',
    emoji: '📍',
    address: '1-2-3 Ikebukuro, Toshima-ku, Tokyo 171-0014',
    jp: '東京都豊島区池袋',
    hours: '11:00 – 21:00 (Open daily)',
    phone: '080-YYYY-YYYY',
    note: 'Frozen & packaged halal groceries',
  },
  {
    id: 'nagoya',
    name: 'Nagoya Branch',
    emoji: '📍',
    address: '4-6-8 Naka-ku, Nagoya, Aichi 460-0008',
    jp: '愛知県名古屋市中区',
    hours: '11:00 – 20:00 (Closed Tuesday)',
    phone: '080-ZZZZ-ZZZZ',
    note: 'Fresh vegetables & South Asian imports',
  },
];

export const halalBadges = [
  { name: 'JAKIM Malaysia', emoji: '✅' },
  { name: 'Halal Japan Association', emoji: '🕌' },
  { name: 'MUI Indonesia', emoji: '✅' },
  { name: 'HFA Certified', emoji: '🛡️' },
  { name: '100% Zabiha', emoji: '🌙' },
];
