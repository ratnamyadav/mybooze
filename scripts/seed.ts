/* eslint-disable no-console */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import type { Article, Bottle, Faq, Store } from '../src/payload-types'

type PriceTier = NonNullable<Store['priceTier']>
type Payment = NonNullable<Store['payment']>
type BestFor = NonNullable<Bottle['best']>
type Occasion = NonNullable<Bottle['occasion']>
type ArticleCategory = Article['category']
type FaqScope = Faq['scope']

const SPIRIT_CATEGORIES = [
  { slug: 'whisky', name: 'Whisky', count: 412, blurb: 'Single malts, blends, bourbons & Indian whisky.' },
  { slug: 'rum', name: 'Rum', count: 188, blurb: 'Aged sippers, spiced classics, white mixers.' },
  { slug: 'vodka', name: 'Vodka', count: 142, blurb: 'Crisp, clean, neutral grain & specialty.' },
  { slug: 'gin', name: 'Gin', count: 156, blurb: 'London Dry, contemporary & Indian craft gins.' },
  { slug: 'tequila', name: 'Tequila', count: 78, blurb: 'Blanco, Reposado, Añejo and mezcal.' },
  { slug: 'brandy', name: 'Brandy', count: 96, blurb: 'After-dinner sippers and budget classics.' },
  { slug: 'cognac', name: 'Cognac', count: 44, blurb: 'VS, VSOP, XO from the Charente.' },
  { slug: 'wine', name: 'Wine', count: 312, blurb: 'Reds, whites, sparkling & Indian estates.' },
  { slug: 'beer', name: 'Beer', count: 264, blurb: 'Lagers, IPAs, stouts and craft.' },
  { slug: 'liqueurs', name: 'Liqueurs', count: 88, blurb: 'Cream, herbal, fruit & coffee liqueurs.' },
  { slug: 'rtd', name: 'RTD', count: 64, blurb: 'Ready-to-drink cans & cocktails.' },
  { slug: 'indian-craft', name: 'Indian Craft', count: 102, blurb: 'Homegrown distilleries from across India.' },
]

const STORES_SEED = [
  {
    name: 'The Cellar',
    slug: 'the-cellar',
    tagline: 'Premium imported spirits & rare malts',
    area: 'Pari Chowk',
    city: 'Greater Noida',
    address: 'Shop 14, Omega-1 Market, Pari Chowk, Greater Noida, UP 201310',
    phone: '+91 98 7000 1402',
    rating: 4.8,
    reviewsCount: 412,
    distanceKm: 1.2,
    priceTier: '₹₹₹₹',
    license: 'L-1 / FL-2',
    verified: true,
    openNow: true,
    pickup: true,
    parking: true,
    payment: ['Cash', 'UPI', 'Card'],
    categoryNames: ['Whisky', 'Wine', 'Cognac'],
  },
  {
    name: 'Knight & Barrel',
    slug: 'knight-and-barrel',
    tagline: 'Wine merchants since 1998',
    area: 'Sector 18',
    city: 'Noida',
    address: 'F-Block, Atta Market, Sector 18, Noida, UP 201301',
    phone: '+91 98 1142 2255',
    rating: 4.6,
    reviewsCount: 287,
    distanceKm: 8.4,
    priceTier: '₹₹₹',
    license: 'L-1',
    verified: true,
    openNow: true,
    pickup: true,
    payment: ['UPI', 'Card'],
    categoryNames: ['Wine', 'Whisky'],
  },
  {
    name: 'Highland Spirits',
    slug: 'highland-spirits',
    tagline: 'The neighbourhood whisky shop',
    area: 'Alpha-2',
    city: 'Greater Noida',
    address: 'Alpha-2 Commercial Belt, Greater Noida, UP 201310',
    phone: '+91 99 1003 4477',
    rating: 4.4,
    reviewsCount: 198,
    distanceKm: 2.7,
    priceTier: '₹₹',
    license: 'L-1',
    verified: true,
    openNow: true,
    pickup: true,
    parking: true,
    payment: ['Cash', 'UPI'],
    categoryNames: ['Whisky', 'Beer', 'Vodka'],
  },
  {
    name: 'Vines & Co.',
    slug: 'vines-and-co',
    tagline: 'Curated wines & craft beer',
    area: 'Khan Market',
    city: 'New Delhi',
    address: '7-A Khan Market, New Delhi 110003',
    phone: '+91 11 4040 5050',
    rating: 4.7,
    reviewsCount: 524,
    distanceKm: 22.6,
    priceTier: '₹₹₹₹',
    license: 'L-1 / L-19',
    verified: true,
    openNow: false,
    pickup: true,
    payment: ['UPI', 'Card', 'Wallet'],
    categoryNames: ['Wine', 'Beer', 'Indian Craft'],
  },
  {
    name: 'The Bottle Shop',
    slug: 'the-bottle-shop',
    tagline: 'Everyday pours, fair prices',
    area: 'Sector 50',
    city: 'Noida',
    address: 'C-Block Market, Sector 50, Noida, UP 201301',
    phone: '+91 98 7322 1198',
    rating: 4.2,
    reviewsCount: 142,
    distanceKm: 11.8,
    priceTier: '₹₹',
    license: 'L-1',
    verified: false,
    openNow: true,
    parking: true,
    payment: ['Cash', 'UPI'],
    categoryNames: ['Beer', 'Whisky', 'Rum'],
  },
  {
    name: 'Distillery Row',
    slug: 'distillery-row',
    tagline: 'Indian craft & small-batch',
    area: 'Sector 76',
    city: 'Noida',
    address: 'Sector 76 Market, Noida, UP 201304',
    phone: '+91 99 5564 8821',
    rating: 4.5,
    reviewsCount: 89,
    distanceKm: 14.2,
    priceTier: '₹₹₹',
    license: 'L-1',
    verified: true,
    openNow: true,
    pickup: true,
    parking: true,
    payment: ['UPI', 'Card'],
    categoryNames: ['Indian Craft', 'Gin', 'Rum'],
  },
]

const BOTTLES_SEED = [
  { name: 'Glen Moray 12 Yr Single Malt', slug: 'glen-moray-12', brand: 'Glen Moray', cat: 'Whisky', region: 'Speyside, Scotland', abv: 40, volume: '750ml', priceLow: 4200, priceHigh: 4800, rating: 4.6, notes: ['Honey', 'Pear', 'Vanilla', 'Light oak'], best: 'Sipping', occasion: 'Gifting' },
  { name: 'Amrut Fusion Single Malt', slug: 'amrut-fusion', brand: 'Amrut', cat: 'Whisky', region: 'Bangalore, India', abv: 50, volume: '750ml', priceLow: 4800, priceHigh: 5400, rating: 4.8, notes: ['Smoke', 'Tropical fruit', 'Caramel'], best: 'Sipping', occasion: 'Collector' },
  { name: 'Old Monk 7 Yr XXX Rum', slug: 'old-monk-7-xxx', brand: 'Mohan Meakin', cat: 'Rum', region: 'Ghaziabad, India', abv: 42.8, volume: '750ml', priceLow: 580, priceHigh: 720, rating: 4.7, notes: ['Vanilla', 'Caramel', 'Treacle'], best: 'Mixers', occasion: 'Everyday' },
  { name: "Hendrick's Gin", slug: 'hendricks-gin', brand: "Hendrick's", cat: 'Gin', region: 'Girvan, Scotland', abv: 41.4, volume: '750ml', priceLow: 4400, priceHigh: 4900, rating: 4.5, notes: ['Cucumber', 'Rose', 'Juniper'], best: 'Cocktails', occasion: 'Party' },
  { name: 'Greater Than London Dry Gin', slug: 'greater-than-gin', brand: 'Nao Spirits', cat: 'Gin', region: 'Goa, India', abv: 42.8, volume: '750ml', priceLow: 1900, priceHigh: 2300, rating: 4.4, notes: ['Juniper', 'Citrus', 'Coriander'], best: 'Cocktails', occasion: 'Everyday' },
  { name: 'Jaisalmer Indian Craft Gin', slug: 'jaisalmer-gin', brand: 'Radico Khaitan', cat: 'Gin', region: 'Rajasthan, India', abv: 43, volume: '750ml', priceLow: 3200, priceHigh: 3700, rating: 4.6, notes: ['Cardamom', 'Lemongrass', 'Vetiver'], best: 'Sipping', occasion: 'Gifting' },
  { name: 'Lagavulin 16 Yr', slug: 'lagavulin-16', brand: 'Lagavulin', cat: 'Whisky', region: 'Islay, Scotland', abv: 43, volume: '750ml', priceLow: 11200, priceHigh: 12400, rating: 4.9, notes: ['Peat', 'Smoke', 'Sea salt', 'Iodine'], best: 'Sipping', occasion: 'Collector' },
  { name: 'Sula Rasa Shiraz', slug: 'sula-rasa-shiraz', brand: 'Sula Vineyards', cat: 'Wine', region: 'Nashik, India', abv: 14, volume: '750ml', priceLow: 1100, priceHigh: 1400, rating: 4.3, notes: ['Plum', 'Pepper', 'Vanilla'], best: 'Pairing', occasion: 'Dinner' },
]

const ARTICLES_SEED = [
  { title: 'Best Whisky Under ₹2,000: 11 Bottles Worth Pouring', slug: 'best-whisky-under-2000', category: 'Buying Guides', readMin: 9, datePublished: '2026-04-18', excerpt: 'From honest Indian blends to surprisingly good imports — what to actually buy.' },
  { title: "Scotch vs Bourbon vs Indian Whisky: A Beginner's Map", slug: 'scotch-vs-bourbon-vs-indian-whisky', category: 'Education', readMin: 7, datePublished: '2026-04-11', excerpt: 'How geography, grain, and oak shape what ends up in your glass.' },
  { title: 'How to Read a Liquor Bottle Label Without Getting Fooled', slug: 'how-to-read-a-bottle-label', category: 'Education', readMin: 6, datePublished: '2026-04-04', excerpt: 'NAS, ABV, sourced vs distilled — terms decoded for everyday shoppers.' },
  { title: 'The Definitive Guide to Liquor Stores in Greater Noida', slug: 'guide-liquor-stores-greater-noida', category: 'City Guides', readMin: 12, datePublished: '2026-03-28', excerpt: 'Fifteen verified shops, ranked by selection, price and service.' },
  { title: 'Best Rum for Cocktails (Without Spending a Fortune)', slug: 'best-rum-for-cocktails', category: 'Buying Guides', readMin: 8, datePublished: '2026-03-22', excerpt: "A bartender's shortlist for daiquiris, mojitos and tiki nights." },
  { title: 'Single Malt vs Blended Whisky: Which Should You Buy?', slug: 'single-malt-vs-blended', category: 'Education', readMin: 7, datePublished: '2026-03-15', excerpt: 'A simple framework to decide based on budget, mood and meal.' },
]

const REVIEWS_SEED = [
  { authorName: 'Aarav K.', when: '2 weeks ago', stars: 5, text: 'Hands-down the best curated selection in Greater Noida. They got me a Glen Scotia in three days when no one else had it.', storeSlug: 'the-cellar' },
  { authorName: 'Priya M.', when: '1 month ago', stars: 5, text: "The staff actually knows what they're talking about. Asked for a smoky whisky under ₹5k and walked out very happy.", storeSlug: 'the-cellar' },
  { authorName: 'Rohan S.', when: '1 month ago', stars: 4, text: 'Excellent stock of Indian craft gins. Slightly steeper than other shops but worth it for the consistency.', storeSlug: 'distillery-row' },
  { authorName: 'Neha D.', when: '2 months ago', stars: 5, text: 'My go-to for gifting. They wrap nicely, take UPI and never push the high-margin stuff.', storeSlug: 'the-cellar' },
]

const FAQS_SEED = [
  { question: 'Does Mybooz sell alcohol directly?', answer: 'No. Mybooz is a directory and content platform that helps you find verified liquor stores and learn about spirits. All purchases happen at the licensed retailer.', scope: 'home', order: 1 },
  { question: 'How do you verify stores?', answer: 'Listed stores submit their license details (L-1, L-2, FL-2 etc.) which our team checks against state excise department records before we issue a verified badge.', scope: 'home', order: 2 },
  { question: "Why don't you show prices online?", answer: 'Alcohol pricing in India is regulated state-by-state and changes frequently. We show price ranges as a guide; final pricing is set by the retailer.', scope: 'home', order: 3 },
  { question: 'Can I order delivery through Mybooz?', answer: 'Mybooz does not facilitate alcohol delivery. Some listed stores may offer pickup; delivery (where shown) is arranged directly with the store and only where state law permits.', scope: 'home', order: 4 },
  { question: 'Is the site for users above 21?', answer: 'Yes. The legal drinking age varies by state (21 or 25 in most). You must confirm you are of legal drinking age in your state to use Mybooz.', scope: 'home', order: 5 },
]

const seed = async () => {
  const payload = await getPayload({ config })

  console.log('→ Seeding categories…')
  const catBySlug: Record<string, number> = {}
  for (const c of SPIRIT_CATEGORIES) {
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: c.slug } },
      limit: 1,
    })
    if (existing.docs[0]) {
      catBySlug[c.slug] = existing.docs[0].id
      continue
    }
    const created = await payload.create({
      collection: 'categories',
      data: { ...c, status: 'published' },
    })
    catBySlug[c.slug] = created.id
  }
  const catByName: Record<string, number> = Object.fromEntries(
    SPIRIT_CATEGORIES.map((c) => [c.name, catBySlug[c.slug]]),
  )

  console.log('→ Seeding stores…')
  const storeBySlug: Record<string, number> = {}
  for (const s of STORES_SEED) {
    const existing = await payload.find({
      collection: 'stores',
      where: { slug: { equals: s.slug } },
      limit: 1,
    })
    if (existing.docs[0]) {
      storeBySlug[s.slug] = existing.docs[0].id
      continue
    }
    const { categoryNames, priceTier, payment, ...rest } = s
    const created = await payload.create({
      collection: 'stores',
      data: {
        ...rest,
        priceTier: priceTier as PriceTier,
        payment: payment as Payment,
        categories: categoryNames.map((n) => catByName[n]).filter(Boolean),
        status: 'published',
      },
    })
    storeBySlug[s.slug] = created.id
  }

  console.log('→ Seeding bottles…')
  for (const b of BOTTLES_SEED) {
    const existing = await payload.find({
      collection: 'bottles',
      where: { slug: { equals: b.slug } },
      limit: 1,
    })
    if (existing.docs[0]) continue
    await payload.create({
      collection: 'bottles',
      data: {
        name: b.name,
        slug: b.slug,
        brand: b.brand,
        category: catByName[b.cat],
        region: b.region,
        abv: b.abv,
        volume: b.volume,
        priceLow: b.priceLow,
        priceHigh: b.priceHigh,
        rating: b.rating,
        tastingNotes: b.notes.map((n) => ({ note: n })),
        best: b.best as BestFor,
        occasion: b.occasion as Occasion,
        availableAt: Object.values(storeBySlug).slice(0, 4),
        status: 'published',
      },
    })
  }

  console.log('→ Seeding articles…')
  for (const a of ARTICLES_SEED) {
    const existing = await payload.find({
      collection: 'articles',
      where: { slug: { equals: a.slug } },
      limit: 1,
    })
    if (existing.docs[0]) continue
    await payload.create({
      collection: 'articles',
      data: {
        ...a,
        category: a.category as ArticleCategory,
        status: 'published',
      },
    })
  }

  console.log('→ Seeding reviews…')
  for (const r of REVIEWS_SEED) {
    const storeId = storeBySlug[r.storeSlug]
    if (!storeId) continue
    const existing = await payload.find({
      collection: 'reviews',
      where: { and: [{ authorName: { equals: r.authorName } }, { store: { equals: storeId } }] },
      limit: 1,
    })
    if (existing.docs[0]) continue
    await payload.create({
      collection: 'reviews',
      data: { ...r, store: storeId, verified: true, status: 'published' },
    })
  }

  console.log('→ Seeding FAQs…')
  for (const f of FAQS_SEED) {
    const existing = await payload.find({
      collection: 'faqs',
      where: { question: { equals: f.question } },
      limit: 1,
    })
    if (existing.docs[0]) continue
    await payload.create({
      collection: 'faqs',
      data: { ...f, scope: f.scope as FaqScope, status: 'published' },
    })
  }

  console.log('→ Seeding home page…')
  const home = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
  })
  if (!home.docs[0]) {
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Mybooz Homepage',
        slug: 'home',
        hero: {
          eyebrow: 'Vol. 04 · Issue 02 · Apr 2026',
          heading: 'Discover trusted liquor stores & spirits near you.',
          subheading:
            "A curated directory of verified retailers across Delhi NCR — with reviews, food pairings, expert tasting notes and beginner guides. We don't sell. We help you find.",
          variant: 'editorial',
        },
        stats: [
          { label: 'Verified stores', value: '2,100+' },
          { label: 'Cities covered', value: '14' },
          { label: 'Spirit categories', value: '12' },
          { label: 'Tasting notes', value: '3,800+' },
        ],
        status: 'published',
      },
    })
  }

  console.log('✓ Seed complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
