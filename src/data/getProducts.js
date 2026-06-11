import { supabase } from '../supabase/client'
import staticProducts from './products'

export async function getProducts() {
  try {
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true })
    if (!error && data && data.length > 0) {
      return data.map(normalizeProduct)
    }
  } catch {}

  return staticProducts
}

export async function getProductById(id) {
  try {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single()
    if (!error && data) return normalizeProduct(data)
  } catch {}

  return staticProducts.find((p) => p.id === id) || null
}

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
    img: images[0] || '',
    images,
    is_cardi_pick: !!p.is_cardi_pick,
  }
}
