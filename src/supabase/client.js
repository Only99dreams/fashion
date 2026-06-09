import staticProducts from '../data/products'

const DB_KEY = 'fp_db'
const SESSION_KEY = 'fp_admin_session'
const authCallbacks = []

function loadStore() {
  try {
    const raw = localStorage.getItem(DB_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function saveStore(store) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(store))
  } catch {}
}

function buildClient() {
  const saved = loadStore()
  const store = saved || { products: [], orders: [], profiles: [] }

  if (!saved) {
    store.products = staticProducts.map((p) => ({
      id: p.id,
      category: p.category,
      brand: p.brand,
      name: p.name,
      condition: p.condition,
      price: p.price,
      original_price: p.originalPrice || null,
      discount: p.discount || null,
      est_retail: p.estRetail || null,
      image_url: p.img || null,
      images: p.img ? [p.img] : [],
      is_cardi_pick: ['Hermes', 'Chanel', 'Bottega Veneta', 'Gucci', 'Louis Vuitton', 'Cartier', 'Christian Dior', 'Fendi', 'Saint Laurent', 'Van Cleef & Arpels', 'Rolex', 'Bulgari', 'Tiffany'].includes(p.brand),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))
    saveStore(store)
  }

  function persist() {
    saveStore(store)
  }

  function query(table) {
    const data = [...(store[table] || [])]
    const chain = {
      data, error: null,
      order(column, opts = {}) {
        const sorted = [...this.data].sort((a, b) => {
          const va = a[column], vb = b[column]
          if (typeof va === 'number' && typeof vb === 'number') {
            return opts.ascending !== false ? va - vb : vb - va
          }
          const asc = opts.ascending !== false
          return asc
            ? String(va).localeCompare(String(vb))
            : String(vb).localeCompare(String(va))
        })
        return { ...this, data: sorted }
      },
      limit(n) { return { ...this, data: this.data.slice(0, n) } },
      eq(col, val) { return { ...this, data: this.data.filter((r) => r[col] === val) } },
      single() {
        const result = { data: this.data[0] || null, error: this.data.length ? null : { message: 'not found' } }
        return { ...result, then(r) { return r(result) } }
      },
      then(resolve) { return resolve({ data: this.data, error: this.error }) },
    }
    return chain
  }

  function normalizeImages(row) {
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

  function insertInto(table, rows) {
    const items = Array.isArray(rows) ? rows : [rows]
    const currentMax = store[table].reduce((max, x) => Math.max(max, x.id || 0), 0)
    const created = items.map((r, idx) => {
      return {
        id: currentMax + idx + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...normalizeImages(r),
      }
    })
    if (!store[table]) store[table] = []
    store[table].push(...created)
    persist()

    const select = () => ({
      single() {
        return Promise.resolve({ data: created[0], error: null })
      },
    })
    return { data: created, error: null, select }
  }

  return {
    from(table) {
      return {
        select(columns, options) {
          if (options?.head) {
            const rows = [...(store[table] || [])]
            const result = { count: rows.length, data: null, error: null }
            return { ...result, then(r) { return r(result) } }
          }
          return query(table)
        },
        insert(rows) { return insertInto(table, rows) },
        update(vals) {
          return {
            eq(col, val) {
              if (store[table]) {
                store[table] = store[table].map((r) =>
                  r[col] === val ? { ...r, ...normalizeImages(vals), updated_at: new Date().toISOString() } : r
                )
                persist()
              }
              return { data: null, error: null, then: (cb) => cb({ data: null, error: null }) }
            },
          }
        },
        delete() {
          return {
            eq(col, val) {
              if (store[table]) store[table] = store[table].filter((r) => r[col] !== val)
              persist()
              return { data: null, error: null, then: (cb) => cb({ data: null, error: null }) }
            },
          }
        },
      }
    },
    auth: {
      getSession() {
        try {
          const s = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
          return Promise.resolve({ data: { session: s }, error: null })
        } catch { return Promise.resolve({ data: { session: null }, error: null }) }
      },
      onAuthStateChange(fn) {
        const callbackId = authCallbacks.length
        authCallbacks.push(fn)
        const current = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
        fn('INITIAL_SESSION', current)
        return {
          data: { subscription: {
            unsubscribe: () => { authCallbacks.splice(callbackId, 1) }
          } }
        }
      },
      signInWithPassword({ email, password }) {
        const emailLower = email?.toLowerCase()
        if (!emailLower || !password) {
          return Promise.resolve({ error: { message: 'Email and password required' } })
        }
        const session = { user: { id: 'admin-' + Date.now(), email: emailLower }, access_token: 'mock-token', expires_at: Date.now() + 86400 }
        localStorage.setItem(SESSION_KEY, JSON.stringify(session))
        authCallbacks.forEach((fn) => fn('SIGNED_IN', session))
        return Promise.resolve({ data: { session }, error: null })
      },
      signOut() {
        localStorage.removeItem(SESSION_KEY)
        authCallbacks.forEach((fn) => fn('SIGNED_OUT', null))
        return Promise.resolve({ error: null })
      },
    },
  }
}

const client = buildClient()

export const supabase = new Proxy({}, {
  get(_, prop) {
    if (prop === 'then') return undefined
    if (typeof client[prop] === 'function') return client[prop].bind(client)
    return client[prop]
  },
})
