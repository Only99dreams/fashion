import { useState, useEffect } from 'react'
import { supabase } from '../../supabase/client'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    loadStats()
    loadRecentOrders()
  }, [])

  async function loadStats() {
    try {
      const { data: prods } = await supabase.from('products').select('*')
      const { data: orders } = await supabase.from('orders').select('*')
      const totalOrders = orders?.length || 0
      const revenue = orders?.reduce((sum, o) => sum + Number(o.total), 0) || 0
      const pending = orders?.filter((o) => o.status === 'pending').length || 0
      setStats({ products: prods?.length || 0, orders: totalOrders, revenue, pending })
    } catch (err) {
      setError('Failed to load stats')
    }
  }

  async function loadRecentOrders() {
    try {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5)
      setRecentOrders(data || [])
    } catch {
      setError('Failed to load orders')
    }
  }

  const cards = [
    { label: 'Total Products', value: stats.products, color: '#4f46e5' },
    { label: 'Total Orders', value: stats.orders, color: '#0891b2' },
    { label: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, color: '#059669' },
    { label: 'Pending Orders', value: stats.pending, color: '#d97706' },
  ]

  return (
    <div className="admin-dashboard">
      <h1 className="admin-page-title">Dashboard</h1>
      {error && <p className="admin-form__error">{error}</p>}
      <div className="admin-stats-grid">
        {cards.map((card) => (
          <div key={card.label} className="admin-stat-card" style={{ borderTopColor: card.color }}>
            <p className="admin-stat-card__label">{card.label}</p>
            <p className="admin-stat-card__value">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="admin-section">
        <h2 className="admin-section__title">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p className="admin-empty">No orders yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{o.customer_name}</td>
                  <td>${Number(o.total).toLocaleString()}</td>
                  <td><span className={`admin-badge admin-badge--${o.status}`}>{o.status}</span></td>
                  <td>{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
