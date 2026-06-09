import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../supabase/client'

const brands = [
  'Hermes', 'Chanel', 'Louis Vuitton', 'Gucci', 'Bottega Veneta', 'Prada',
  'Saint Laurent', 'Christian Dior', 'Fendi', 'Celine', 'Valentino Garavani',
  'Balenciaga', 'Loewe', 'Givenchy', 'Burberry', 'Cartier', 'Bulgari',
  'Tiffany & Co.', 'Van Cleef & Arpels', 'Rolex', 'Omega', 'Chopard',
  'David Yurman', 'Chrome Hearts', 'Off-White', 'Balmain', 'Versace',
  'Dolce & Gabbana', 'Moschino', 'Miu Miu', 'Marc Jacobs', 'Tory Burch',
  'Coach', 'Michael Kors', 'Alexander McQueen', 'Stella McCartney',
  'Tom Ford', 'Giorgio Armani', 'Ralph Lauren', 'Jimmy Choo',
  'Manolo Blahnik', 'Christian Louboutin', 'Isabel Marant', 'Bally',
  'Moynat', 'Goyard', 'Delvaux', 'Brunello Cucinelli', 'Moncler',
]
const categories = [
  'Bags', 'Shoes', 'Accessories', 'Jewelry',
  'Backpacks', 'Belt Bags', 'Bucket Bags', 'Clutches & Evening Bags',
  'Crossbody', 'Handbags', 'Hobo Bags', 'Shoulder Bags', 'Totes',
  'Travel & Luggage', 'Wallets', 'Boots & Booties', 'Flats', 'Pumps',
  'Sandals', 'Sneakers', 'Bracelets', 'Earrings', 'Necklaces', 'Rings',
  'Fine Jewelry', 'Scarves', 'Belts', 'Sunglasses', 'Cosmetic Cases',
  'Bag Charms', 'Key Rings', 'Watches',
]
const conditions = ['Excellent', 'Very Good', 'Good', 'Shows Wear']

function compressFile(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('Not an image'))
    if (file.size > 5 * 1024 * 1024) return reject(new Error('Image must be under 5MB'))
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const maxDim = 1200
        let w = img.width, h = img.height
        if (w > maxDim || h > maxDim) {
          const ratio = Math.min(maxDim / w, maxDim / h)
          w = Math.round(w * ratio)
          h = Math.round(h * ratio)
        }
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.onerror = () => reject(new Error('Failed to process image'))
      img.src = ev.target.result
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

export default function AdminProductForm({ productId }) {
  const isEdit = Boolean(productId)
  const [form, setForm] = useState({
    brand: 'Chanel', name: '', category: 'Bags', condition: 'Excellent',
    price: '', original_price: '', discount: '', est_retail: '',
    image_url: '', images: [],
    is_cardi_pick: false,
  })
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!productId) return
    supabase.from('products').select('*').eq('id', productId).single().then(({ data, error: err }) => {
      if (err) setError(err.message)
      if (data) {
        const images = data.images && Array.isArray(data.images) && data.images.length > 0
          ? data.images
          : data.image_url ? [data.image_url] : []
        setForm({
          brand: data.brand || 'Chanel',
          name: data.name || '',
          category: data.category || 'Bags',
          condition: data.condition || 'Excellent',
          price: data.price?.toString() || '',
          original_price: data.original_price?.toString() || '',
          discount: data.discount || '',
          est_retail: data.est_retail?.toString() || '',
          image_url: images[0] || '',
          images,
          is_cardi_pick: !!data.is_cardi_pick,
        })
      }
      setLoading(false)
    })
  }, [productId])

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleFiles(files) {
    setError('')
    const valid = []
    for (const f of files) {
      if (!f.type.startsWith('image/')) {
        setError('Please select image files only')
        return
      }
      if (f.size > 5 * 1024 * 1024) {
        setError('Each image must be under 5MB')
        return
      }
      valid.push(f)
    }
    if (valid.length === 0) return
    setUploading(true)
    const compressed = await Promise.all(valid.map(compressFile))
    setForm((prev) => {
      const updated = [...prev.images, ...compressed]
      return { ...prev, images: updated, image_url: updated[0] }
    })
    setUploading(false)
  }

  async function handleFileSelect(e) {
    await handleFiles(Array.from(e.target.files || []))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleUrlAdd() {
    const url = urlInputValue.trim()
    if (!url) return
    setForm((prev) => {
      const updated = [...prev.images, url]
      return { ...prev, images: updated, image_url: updated[0] }
    })
    setUrlInputValue('')
  }

  function removeImage(index) {
    setForm((prev) => {
      const updated = prev.images.filter((_, i) => i !== index)
      return { ...prev, images: updated, image_url: updated[0] || '' }
    })
  }

  function moveImage(from, to) {
    if (to < 0 || to >= form.images.length) return
    setForm((prev) => {
      const updated = [...prev.images]
      const [item] = updated.splice(from, 1)
      updated.splice(to, 0, item)
      return { ...prev, images: updated, image_url: updated[0] }
    })
  }

  const [urlInputValue, setUrlInputValue] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    if (!form.images.length) {
      setError('Please add at least one image')
      setSaving(false)
      return
    }
    const payload = {
      brand: form.brand,
      name: form.name,
      category: form.category,
      condition: form.condition,
      price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      discount: form.discount || null,
      est_retail: form.est_retail ? parseFloat(form.est_retail) : null,
      images: form.images,
      is_cardi_pick: form.is_cardi_pick || false,
    }

    let err
    if (isEdit) {
      ;({ error: err } = await supabase.from('products').update(payload).eq('id', productId))
    } else {
      ;({ error: err } = await supabase.from('products').insert([payload]))
    }

    if (err) {
      setError(err.message)
    } else {
      setDone(true)
    }
    setSaving(false)
  }

  if (loading) return <p className="admin-empty">Loading...</p>

  if (done) {
    return (
      <div className="admin-product-form">
        <div className="admin-form-success">
          <h2>Product {isEdit ? 'updated' : 'added'} successfully!</h2>
          <div className="admin-form-success__actions">
            {!isEdit && <button className="btn btn--dark" onClick={() => { setDone(false); setForm({ brand: 'Chanel', name: '', category: 'Bags', condition: 'Excellent', price: '', original_price: '', discount: '', est_retail: '', image_url: '', images: [], is_cardi_pick: false }); setUrlInputValue('') }}>Add Another</button>}
            <a href="/admin/products" className="btn btn--outline-dark">Back to Products</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-product-form">
      <div className="admin-page-header">
        <h1 className="admin-page-title">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
        <a href="/admin/products" className="btn btn--outline-dark">Back</a>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-form__grid">
          <div className="admin-form__field">
            <label>Brand *</label>
            <select value={form.brand} onChange={(e) => update('brand', e.target.value)}>
              {brands.map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div className="admin-form__field">
            <label>Category *</label>
            <select value={form.category} onChange={(e) => update('category', e.target.value)}>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="admin-form__field admin-form__field--wide">
            <label>Product Name *</label>
            <input value={form.name} onChange={(e) => update('name', e.target.value)} required />
          </div>
          <div className="admin-form__field">
            <label>Price *</label>
            <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => update('price', e.target.value)} required />
          </div>
          <div className="admin-form__field">
            <label>Original Price</label>
            <input type="number" step="0.01" min="0" value={form.original_price} onChange={(e) => update('original_price', e.target.value)} />
          </div>
          <div className="admin-form__field">
            <label>Discount Label</label>
            <input placeholder="e.g. 20% off" value={form.discount} onChange={(e) => update('discount', e.target.value)} />
          </div>
          <div className="admin-form__field">
            <label>Est. Retail</label>
            <input type="number" step="0.01" min="0" value={form.est_retail} onChange={(e) => update('est_retail', e.target.value)} />
          </div>
          <div className="admin-form__field">
            <label>Condition</label>
            <select value={form.condition} onChange={(e) => update('condition', e.target.value)}>
              {conditions.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="admin-form__field">
            <label className="admin-form__checkbox-label">
              <input type="checkbox" checked={form.is_cardi_pick} onChange={(e) => update('is_cardi_pick', e.target.checked)} />
              Cardi's Pick
            </label>
          </div>
          <div className="admin-form__field admin-form__field--wide">
            <label>Product Images *</label>
            <div className="admin-form__upload-row">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="admin-form__file-input"
              />
              <button type="button" className="btn btn--outline-dark" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload Images'}
              </button>
              <span className="admin-form__upload-hint">or paste URLs</span>
            </div>
            <div className="admin-form__url-add-row">
              <input placeholder="https://example.com/image.jpg" value={urlInputValue} onChange={(e) => setUrlInputValue(e.target.value)} className="admin-form__url-input" />
              <button type="button" className="btn btn--outline-dark admin-form__url-add-btn" onClick={handleUrlAdd}>Add</button>
            </div>
            {form.images.length > 0 && (
              <div className="admin-form__image-grid">
                {form.images.map((src, i) => (
                  <div key={i} className="admin-form__image-item">
                    <img src={src} alt="" />
                    <div className="admin-form__image-overlay">
                      <span className="admin-form__image-order">{i === 0 ? 'Main' : `#${i + 1}`}</span>
                      <div className="admin-form__image-actions">
                        <button type="button" disabled={i === 0} onClick={() => moveImage(i, i - 1)} title="Move left">&larr;</button>
                        <button type="button" disabled={i === form.images.length - 1} onClick={() => moveImage(i, i + 1)} title="Move right">&rarr;</button>
                        <button type="button" onClick={() => removeImage(i)} title="Remove">&times;</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && <p className="admin-form__error">{error}</p>}

        <div className="admin-form__actions">
          <button type="submit" className="btn btn--dark" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
          </button>
          <a href="/admin/products" className="btn btn--outline-dark">Cancel</a>
        </div>
      </form>
    </div>
  )
}