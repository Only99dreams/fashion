import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../supabase/client'

export default function AdminSettings() {
  const [storeName, setStoreName] = useState('FASHIONPHILE')
  const [currency, setCurrency] = useState('USD')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [logo, setLogo] = useState('')
  const [favicon, setFavicon] = useState('')
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingFavicon, setUploadingFavicon] = useState(false)
  const logoRef = useRef(null)
  const faviconRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem('fp_admin_branding')
    if (saved) {
      try {
        const { logo: l, favicon: f } = JSON.parse(saved)
        if (l) setLogo(l)
        if (f) setFavicon(f)
      } catch {}
    }
  }, [])

  async function handleStoreSubmit(e) {
    e.preventDefault()
    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    localStorage.setItem('fp_admin_settings', JSON.stringify({ storeName, currency }))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleFileUpload(file, type) {
    if (!file) return
    if (!file.type.startsWith('image/')) return
    if (file.size > 2 * 1024 * 1024) return
    const setUploading = type === 'logo' ? setUploadingLogo : setUploadingFavicon
    const setValue = type === 'logo' ? setLogo : setFavicon
    setUploading(true)
    const reader = new FileReader()
    reader.onload = (ev) => {
      setValue(ev.target.result)
      setUploading(false)
      localStorage.setItem('fp_admin_branding', JSON.stringify({
        logo: type === 'logo' ? ev.target.result : logo,
        favicon: type === 'favicon' ? ev.target.result : favicon,
      }))
      if (type === 'favicon') {
        let link = document.querySelector('link[rel="icon"]')
        if (link) link.href = ev.target.result
      }
    }
    reader.onerror = () => setUploading(false)
    reader.readAsDataURL(file)
  }

  const seedProducts = async () => {
    if (!confirm('This will add sample products to your database. Continue?')) return
    const sampleProducts = [
      { category: 'Bags', brand: 'Chanel', name: 'Caviar Quilted Medium Classic Flap Black', condition: 'Excellent', price: 8995, original_price: 10500, discount: '14% off', est_retail: 10500, image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80' },
      { category: 'Bags', brand: 'Hermes', name: 'Togo Birkin 30 Gold', condition: 'Excellent', price: 12450, original_price: 14500, discount: '14% off', est_retail: 14500, image_url: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=600&q=80' },
      { category: 'Bags', brand: 'Louis Vuitton', name: 'Monogram Neverfull GM Damier Ebene', condition: 'Very Good', price: 1895, original_price: 2200, discount: '14% off', est_retail: 2200, image_url: 'https://images.unsplash.com/photo-1564372427378-58eaf2d91d7b?w=600&q=80' },
      { category: 'Bags', brand: 'Gucci', name: 'GG Marmont Small Shoulder Bag Black', condition: 'Excellent', price: 1495, original_price: 1890, discount: '21% off', est_retail: 1890, image_url: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&q=80' },
      { category: 'Bags', brand: 'Prada', name: 'Saffiano Lux Medium Galleria Nude', condition: 'Excellent', price: 2250, est_retail: 2850, image_url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80' },
      { category: 'Bags', brand: 'Saint Laurent', name: 'Lambskin Small Loulou Black', condition: 'Excellent', price: 1895, original_price: 2350, discount: '19% off', est_retail: 2350, image_url: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&q=80' },
      { category: 'Jewelry', brand: 'Tiffany', name: 'Return to Tiffany Heart Earrings', condition: 'Excellent', price: 295, est_retail: 450, image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c8ab60908?w=600&q=80' },
      { category: 'Watches', brand: 'Rolex', name: 'Submariner Date Black 41mm', condition: 'Excellent', price: 14950, original_price: 17500, discount: '15% off', est_retail: 17500, image_url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80' },
      { category: 'Shoes', brand: 'Christian Louboutin', name: 'Pigalle Follies Patent Leather Red', condition: 'Excellent', price: 595, original_price: 795, discount: '25% off', est_retail: 795, image_url: 'https://images.unsplash.com/photo-1543168256-418811576931?w=600&q=80' },
      { category: 'Accessories', brand: 'Louis Vuitton', name: 'Monogram Shawl Scarf Beige', condition: 'Excellent', price: 495, est_retail: 695, image_url: 'https://images.unsplash.com/photo-1584030373081-f37b01b6d34e?w=600&q=80' },
    ]
    const { error } = await supabase.from('products').insert(sampleProducts)
    if (error) {
      alert('Error seeding products: ' + error.message)
    } else {
      alert('Sample products added successfully!')
    }
  }

  return (
    <div className="admin-settings">
      <h1 className="admin-page-title">Settings</h1>

      <div className="admin-settings-grid" style={{ marginTop: '24px' }}>
        <div className="admin-settings-card">
          <h3 className="admin-settings-card__title">Store Settings</h3>
          <form onSubmit={handleStoreSubmit}>
            <div className="admin-settings-field">
              <label>Store Name</label>
              <input value={storeName} onChange={(e) => setStoreName(e.target.value)} />
            </div>
            <div className="admin-settings-field">
              <label>Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <button type="submit" className="btn btn--dark" disabled={saving}>
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
            </button>
          </form>
        </div>

        <div className="admin-settings-card">
          <h3 className="admin-settings-card__title">Branding</h3>
          <div className="admin-settings-field">
            <label>Site Logo</label>
            <div className="admin-form__upload">
              <input ref={logoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e.target.files?.[0], 'logo')} />
              <button type="button" className="btn btn--outline-dark" onClick={() => logoRef.current?.click()} disabled={uploadingLogo}>
                {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
              </button>
            </div>
            {logo && (
              <div className="admin-form__preview" style={{ marginTop: '8px' }}>
                <img src={logo} alt="Logo preview" style={{ maxHeight: '40px', width: 'auto' }} />
              </div>
            )}
          </div>
          <div className="admin-settings-field">
            <label>Favicon</label>
            <div className="admin-form__upload">
              <input ref={faviconRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e.target.files?.[0], 'favicon')} />
              <button type="button" className="btn btn--outline-dark" onClick={() => faviconRef.current?.click()} disabled={uploadingFavicon}>
                {uploadingFavicon ? 'Uploading...' : 'Upload Favicon'}
              </button>
            </div>
            {favicon && (
              <div className="admin-form__preview" style={{ marginTop: '8px' }}>
                <img src={favicon} alt="Favicon preview" style={{ width: '32px', height: '32px' }} />
              </div>
            )}
          </div>
        </div>

        <div className="admin-settings-card">
          <h3 className="admin-settings-card__title">Database</h3>
          <p style={{ fontSize: '14px', color: '#7d7d7d', marginBottom: '16px' }}>
            Seed your Supabase database with sample products to get started.
          </p>
          <button className="btn btn--dark" onClick={seedProducts}>
            Seed Sample Products
          </button>
        </div>

        <div className="admin-settings-card">
          <h3 className="admin-settings-card__title">Quick Links</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: 'Supabase Dashboard', href: 'https://supabase.com/dashboard' },
              { label: 'SQL Editor', href: 'https://supabase.com/dashboard/project/_/sql' },
              { label: 'Schema Reference', href: '/help' },
            ].map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: '14px', color: '#4f46e5', textDecoration: 'underline' }}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
