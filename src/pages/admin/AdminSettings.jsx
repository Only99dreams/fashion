import { useState, useEffect } from 'react'
import { supabase } from '../../supabase/client'

export default function AdminSettings() {
  const [storeName, setStoreName] = useState('FASHIONPHILE')
  const [currency, setCurrency] = useState('USD')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('settings').select('*').single()
      .then(({ data }) => {
        if (data) {
          if (data.store_name) setStoreName(data.store_name)
          if (data.currency) setCurrency(data.currency)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleStoreSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const { error } = await supabase.from('settings').upsert({
        id: 'default',
        store_name: storeName,
        currency,
      })
      if (error) throw error
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      alert('Failed to save: ' + err.message)
    }
    setSaving(false)
  }

  if (loading) return <div className="admin-settings"><p className="admin-empty">Loading...</p></div>

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
