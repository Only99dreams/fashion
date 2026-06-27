import { supabase } from '../supabase/client'

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

export async function getProducts() {
  try {
    const { data, error } = await supabase.from('products').select(COLUMNS).order('id', { ascending: true })
    if (error) {
      console.error('Supabase error:', error)
      return []
    }
    if (!data || data.length === 0) {
      console.warn('Supabase returned no data')
      return []
    }
    return data.map(normalizeProduct)
  } catch (err) {
    console.error('getProducts caught:', err)
    return []
  }
}

export async function getProductById(id) {
  try {
    const { data, error } = await supabase.from('products').select(COLUMNS).eq('id', id).single()
    if (!error && data) return normalizeProduct(data)
  } catch {}
  return null
}
