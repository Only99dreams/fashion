const COLUMNS = 'id,category,brand,name,condition,price,original_price,discount,est_retail,image_url,images,is_cardi_pick'

function normalizeProduct(p) {
  const images = p.images && Array.isArray(p.images) && p.images.length > 0
    ? p.images
    : p.image_url ? [p.image_url] : []
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
    img: (images[0] || '').replace(/w=\d+/g, 'w=400'),
    images: images.map((u) => u.replace(/w=\d+/g, 'w=400')),
    is_cardi_pick: !!p.is_cardi_pick,
  }
}

const LIMIT = 100

async function fetchProducts() {
  try {
    const u = import.meta.env.VITE_SUPABASE_URL
    const k = import.meta.env.VITE_SUPABASE_ANON_KEY
    const params = new URLSearchParams({ select: COLUMNS, order: 'id.asc', limit: LIMIT, apikey: k })
    console.time('supabase-raw-fetch')
    const res = await fetch(`${u}/rest/v1/products?${params}`)
    console.timeEnd('supabase-raw-fetch')
    console.log('Status:', res.status)
    if (!res.ok) {
      const text = await res.text()
      console.error('Supabase error body:', text)
      return []
    }
    const data = await res.json()
    console.log('Response type:', Array.isArray(data) ? 'array' : typeof data, 'length:', data?.length ?? 'N/A')
    if (!Array.isArray(data)) {
      console.error('Unexpected response:', JSON.stringify(data).slice(0, 500))
      return []
    }
    return data.map(normalizeProduct)
  } catch (err) {
    console.error('fetchProducts caught:', err)
    return []
  }
}

console.log('Started Supabase fetch at', new Date().toISOString())
const promise = fetchProducts()

export async function getProducts() {
  return await promise
}

export async function getProductById(id) {
  try {
    const u = import.meta.env.VITE_SUPABASE_URL
    const k = import.meta.env.VITE_SUPABASE_ANON_KEY
    const params = new URLSearchParams({ select: COLUMNS, id: `eq.${id}`, apikey: k })
    const res = await fetch(`${u}/rest/v1/products?${params}`)
    if (!res.ok) return null
    const data = await res.json()
    if (!data || data.length === 0) return null
    return normalizeProduct(data[0])
  } catch {}
  return null
}
