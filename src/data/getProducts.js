const PRODUCT_COLUMNS = 'id,category,brand,name,condition,price,original_price,discount,est_retail,is_cardi_pick'
const IMAGE_COLUMNS = 'id,image_url'
const FULL_COLUMNS = 'id,category,brand,name,condition,price,original_price,discount,est_retail,image_url,images,is_cardi_pick'

function resizeUrl(url, width) {
  if (!url) return ''
  if (url.startsWith('data:')) return url
  if (url.includes('w=')) return url.replace(/w=\d+/g, `w=${width}`)
  if (url.includes('width=')) return url.replace(/width=\d+/g, `width=${width}`)
  if (url.includes('?')) return `${url}&width=${width}`
  return `${url}?width=${width}`
}

function normalizeProduct(p) {
  const images = p.images && Array.isArray(p.images) && p.images.length > 0
    ? p.images
    : p.image_url ? [p.image_url] : []
  if (p.id === 1 || p.id === images[0]?.slice(0, 10)) {
    console.log('Sample product image URL:', images[0])
  }
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
    img: resizeUrl(images[0] || '', 400),
    images: images.map((u) => resizeUrl(u, 400)),
    is_cardi_pick: !!p.is_cardi_pick,
  }
}

function buildImageMap(raw) {
  if (!Array.isArray(raw)) return {}
  const map = {}
  for (const p of raw) {
    const img = resizeUrl(p.image_url || '', 400)
    map[p.id] = { img, images: img ? [img] : [] }
  }
  return map
}

const LIMIT = 100

async function fetchProducts() {
  try {
    const u = import.meta.env.VITE_SUPABASE_URL
    const k = import.meta.env.VITE_SUPABASE_ANON_KEY
    const params = new URLSearchParams({ select: PRODUCT_COLUMNS, order: 'id.desc', limit: LIMIT, apikey: k })
    const res = await fetch(`${u}/rest/v1/products?${params}`)
    if (!res.ok) return []
    const data = await res.json()
    if (!Array.isArray(data)) return []
    return data.map((p) => ({
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
      img: '',
      images: [],
    }))
  } catch (err) {
    console.error('fetchProducts caught:', err)
    return []
  }
}

async function fetchProductImages() {
  try {
    const u = import.meta.env.VITE_SUPABASE_URL
    const k = import.meta.env.VITE_SUPABASE_ANON_KEY
    const params = new URLSearchParams({ select: IMAGE_COLUMNS, order: 'id.desc', limit: LIMIT, apikey: k })
    const res = await fetch(`${u}/rest/v1/products?${params}`)
    if (!res.ok) return {}
    const data = await res.json()
    return buildImageMap(data)
  } catch (err) {
    console.error('fetchProductImages caught:', err)
    return {}
  }
}

let _productsPromise
let _imagesPromise

function startFetches() {
  if (!_productsPromise) {
    console.log('Started Supabase fetches at', new Date().toISOString())
    _productsPromise = fetchProducts()
    _imagesPromise = fetchProductImages()
  }
}

startFetches()

export async function getProducts() {
  return await _productsPromise
}

export async function getProductImages() {
  return await _imagesPromise
}

export async function getProductById(id) {
  try {
    const u = import.meta.env.VITE_SUPABASE_URL
    const k = import.meta.env.VITE_SUPABASE_ANON_KEY
    const params = new URLSearchParams({ select: FULL_COLUMNS, id: `eq.${id}`, apikey: k })
    const res = await fetch(`${u}/rest/v1/products?${params}`)
    if (!res.ok) return null
    const data = await res.json()
    if (!data || data.length === 0) return null
    return normalizeProduct(data[0])
  } catch {}
  return null
}
