import { useState, useEffect } from 'react'
import { supabase } from '../../supabase/client'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    setLoading(true)
    setError('')
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      setCustomers(data || [])
    } catch {
      setError('Failed to load customers')
    }
    setLoading(false)
  }

  if (loading) return <p className="admin-empty">Loading...</p>

  return (
    <div className="admin-customers">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Customers</h1>
        <span className="admin-badge">{customers.length} total</span>
      </div>

      {error && <p className="admin-form__error">{error}</p>}

      {customers.length === 0 ? (
        <p className="admin-empty">No customers yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td><strong>{c.full_name || '—'}</strong></td>
                <td>{c.email || '—'}</td>
                <td><span className="admin-badge">{c.role}</span></td>
                <td>{c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
