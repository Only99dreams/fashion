// Columns pulled for listing/card views. Intentionally excludes the heavy
// `images` JSONB array — only the single `image_url` thumbnail is needed for
// cards. The full image set is fetched on-demand per product (getProductById).
const PRODUCT_COLUMNS = 'id,category,brand,name,condition,price,original_price,discount,est_retail,is_cardi_pick,image_url'
const FULL_COLUMNS = 'id,category,brand,name,condition,price,original_price,discount,est_retail,image_url,images,is_cardi_pick'

const CACHE_TTL = 5 * 60 * 1000

function apiUrl(path) {
  if (import.meta.env.DEV) return '/supabase-proxy' + path
  return import.meta.env.VITE_SUPABASE_URL + path
}

function anonKey() {
  return import.meta.env.VITE_SUPABASE_ANON_KEY
}

function resizeUrl(url, width) {
  if (!url) return ''
  if (url.startsWith('data:')) return url
  if (url.includes('w=')) return url.replace(/w=\d+/g, `w=${width}`)
  if (url.includes('width=')) return url.replace(/width=\d+/g, `width=${width}`)
  if (url.includes('?')) return `${url}&width=${width}`
  return `${url}?width=${width}`
}

function mapRow(p) {
  return {
    id: p.id,
    category: p.category,
    brand: p.brand,
    name: p.name,
    condition: p.condition || 'Excellent',
    price: Number(p.price),
    originalPrice: p.original_price ? Number(p.original_price) : undefined,
    discount: p.discount || undefined,
    estRetail: p.est_retail ? Number(p.est_retail) : undefined,
    is_cardi_pick: !!p.is_cardi_pick,
    img: resizeUrl(p.image_url || '', 400),
    images: [],
  }
}

function normalizeProduct(p) {
  const images = p.images && Array.isArray(p.images) && p.images.length > 0
    ? p.images
    : p.image_url ? [p.image_url] : []
  return {
    ...mapRow(p),
    img: resizeUrl(images[0] || '', 400),
    images: images.map((u) => resizeUrl(u, 400)),
  }
}

// ---------------------------------------------------------------------------
// PostgREST filter builder
// ---------------------------------------------------------------------------

// Match the client-side brand normalization used for designer slugs so that
// the DB `brand_slug` generated column lines up (see schema.sql).
export function brandSlugify(name) {
  return String(name).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '')
}

// Quote a literal value for use inside an and()/or() PostgREST expression.
function q(v) {
  return '"' + String(v).replace(/"/g, '') + '"'
}

function inList(arr) {
  return '(' + arr.map(q).join(',') + ')'
}

function orderFor(sort) {
  switch (sort) {
    case 'Price: Low to High': return 'price.asc'
    case 'Price: High to Low': return 'price.desc'
    case 'Newest': return 'id.desc'
    default: return 'id.desc' // Featured
  }
}

function buildConditions({
  category, categoryIn, brandSlug, brandIlike, cardiPick,
  brands, conditions, priceRanges, search,
}) {
  const conds = []
  if (category) conds.push(`category.eq.${q(category)}`)
  if (categoryIn && categoryIn.length) conds.push(`category.in.${inList(categoryIn)}`)
  if (brandSlug) conds.push(`brand_slug.eq.${q(brandSlug)}`)
  if (brandIlike) {
    const s = brandIlike.replace(/[^a-z0-9 ]/gi, '').trim()
    if (s) conds.push(`brand.ilike.*${s}*`)
  }
  if (cardiPick) conds.push('is_cardi_pick.is.true')
  if (brands && brands.length) conds.push(`brand.in.${inList(brands)}`)
  if (conditions && conditions.length) conds.push(`condition.in.${inList(conditions)}`)
  if (priceRanges && priceRanges.length) {
    const ranges = priceRanges.map(([min, max]) =>
      (max == null || !isFinite(max))
        ? `price.gte.${min}`
        : `and(price.gte.${min},price.lt.${max})`
    )
    conds.push(`or(${ranges.join(',')})`)
  }
  if (search) {
    const s = search.replace(/[^a-z0-9 ]/gi, '').trim()
    if (s) {
      const pat = `*${s}*`
      conds.push(`or(name.ilike.${pat},brand.ilike.${pat},category.ilike.${pat})`)
    }
  }
  return conds
}

// ---------------------------------------------------------------------------
// Paginated fetch (server-side filtering, sorting and pagination)
// ---------------------------------------------------------------------------

const _pageCache = new Map()

// Flips to false if the DB doesn't yet have the brand_slug column (migration
// not run). We then fall back to a fuzzy brand ilike match so designer pages
// keep working, just less precisely, until schema.sql is applied.
let _brandSlugSupported = true

/**
 * Fetch one page of products from the server.
 * Returns { items, total } where total is the full match count (for pagination).
 */
export async function getProductsPage(options = {}) {
  const {
    page = 1,
    pageSize = 12,
    sort = 'Featured',
  } = options

  const useSlug = options.brandSlug && _brandSlugSupported
  const conds = buildConditions({
    ...options,
    brandSlug: useSlug ? options.brandSlug : undefined,
    brandIlike: (!useSlug && options.brandDisplay) ? options.brandDisplay : undefined,
  })

  const params = new URLSearchParams()
  params.set('select', PRODUCT_COLUMNS)
  params.set('order', orderFor(sort))
  params.set('limit', String(pageSize))
  params.set('offset', String((page - 1) * pageSize))
  if (conds.length) params.set('and', `(${conds.join(',')})`)

  const queryString = params.toString()
  const cacheKey = queryString

  const cached = _pageCache.get(cacheKey)
  if (cached && Date.now() - cached.t < CACHE_TTL) return cached.value

  try {
    const k = anonKey()
    const res = await fetch(apiUrl(`/rest/v1/products?${queryString}&apikey=${k}`), {
      headers: {
        apikey: k,
        Authorization: `Bearer ${k}`,
        Prefer: 'count=exact',
      },
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      // Migration not applied yet: retry once using the brand ilike fallback.
      if (res.status === 400 && text.includes('brand_slug') && useSlug) {
        _brandSlugSupported = false
        return getProductsPage(options)
      }
      console.error('getProductsPage failed:', res.status, text)
      return { items: [], total: 0 }
    }
    const data = await res.json()
    const items = Array.isArray(data) ? data.map(mapRow) : []
    const range = res.headers.get('content-range') // e.g. "0-11/57"
    let total = items.length
    if (range && range.includes('/')) {
      const parsed = parseInt(range.split('/')[1], 10)
      if (!isNaN(parsed)) total = parsed
    }
    const value = { items, total }
    _pageCache.set(cacheKey, { t: Date.now(), value })
    return value
  } catch (err) {
    console.error('getProductsPage caught:', err)
    return { items: [], total: 0 }
  }
}

// A small set of products for the home page.
export async function getFeaturedProducts(limit = 8) {
  const { items } = await getProductsPage({ page: 1, pageSize: limit, sort: 'Featured' })
  return items
}

// Related products for the product detail page (same category, excluding self).
export async function getRelatedProducts(category, excludeId, limit = 4) {
  const { items } = await getProductsPage({ category, page: 1, pageSize: limit + 1, sort: 'Featured' })
  return items.filter((p) => p.id !== excludeId).slice(0, limit)
}

// ---------------------------------------------------------------------------
// Single product (full image set) with in-memory cache
// ---------------------------------------------------------------------------

const _byIdCache = new Map()

export async function getProductById(id) {
  if (_byIdCache.has(id)) return _byIdCache.get(id)
  try {
    const k = anonKey()
    const params = new URLSearchParams({ select: FULL_COLUMNS, id: `eq.${id}`, apikey: k })
    const res = await fetch(apiUrl(`/rest/v1/products?${params}`))
    if (!res.ok) return null
    const data = await res.json()
    if (!data || data.length === 0) return null
    const product = normalizeProduct(data[0])
    _byIdCache.set(id, product)
    return product
  } catch {}
  return null
}

// Clear all cached product data (call after admin add/edit/delete so changes
// show immediately instead of waiting for the cache TTL to expire).
export function clearProductCache() {
  _pageCache.clear()
  _byIdCache.clear()
}
