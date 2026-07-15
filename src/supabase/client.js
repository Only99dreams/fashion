import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables')
}

const proxyUrl = import.meta.env.DEV
  ? supabaseUrl.replace(/^https?:\/\/[^/]+/, '')
  : ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch(url, options) {
      if (proxyUrl && typeof url === 'string') {
        url = url.replace(supabaseUrl, '/supabase-proxy')
      }
      return fetch(url, options)
    },
  },
})

export function normalizeImages(row) {
  const r = { ...row }
  if (r.images && Array.isArray(r.images) && r.images.length > 0) {
    r.image_url = r.images[0]
  } else if (r.image_url) {
    r.images = [r.image_url]
  } else {
    r.images = []
  }
  return r
}

const LEGACY_KEYS = ['fp_db', 'fp_cart', 'fp_admin_session', 'fp_admin_branding', 'fp_admin_settings', 'fp_admin_sidebar']
LEGACY_KEYS.forEach((k) => {
  try { localStorage.removeItem(k) } catch {}
})
