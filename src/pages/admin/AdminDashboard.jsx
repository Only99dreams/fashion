import { useState, useEffect } from 'react'
import { supabase } from '../../supabase/client'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [error, setError] = useState('')
  const [debug, setDebug] = useState('')

  useEffect(() => {
    loadStats()
    loadRecentOrders()
  }, [])

  async function loadStats() {
    try {
      const prodResult = await supabase.from('products').select('*')
      const orderResult = await supabase.from('orders').select('*')
      const prods = prodResult?.data || []
      const orders = orderResult?.data || []
      const totalOrders = orders.length
      const revenue = orders.reduce((sum, o) => sum + Number(o.total), 0)
      const pending = orders.filter((o) => o.status === 'pending').length
      setStats({ products: prods.length, orders: totalOrders, revenue, pending })
    } catch (err) {
      setError('Failed to load stats: ' + err.message)
    }
  }

  async function loadRecentOrders() {
    try {
      const result = await supabase.from('orders').select('*')
      const data = result?.data || []
      if (data.length > 0) {
        data.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      }
      setRecentOrders(data.slice(0, 10))
      setDebug('orders in DB: ' + data.length)
    } catch (err) {
      setError('Failed to load orders: ' + err.message)
    }
  }

  async function approveOrder(id) {
    try {
      await supabase.from('orders').update({ status: 'processing' }).eq('id', id)
      setRecentOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'processing' } : o)))
      setStats((prev) => ({ ...prev, pending: Math.max(0, prev.pending - 1) }))
    } catch {
      setError('Failed to approve order')
    }
  }

  async function createTestOrder() {
    try {
      const insertResult = await supabase.from('orders').insert([{
        items: [{ id: 1, name: 'Test Bag', brand: 'Test Brand', price: 100, qty: 1, img: '' }],
        total: 100,
        customer_name: 'Test Customer',
        customer_email: 'test@example.com',
        shipping_address: '123 Test St, Test City, TS 12345, US',
        status: 'pending',
        payment_method: 'stripe',
        payment_status: 'completed',
        payment_ref: 'TEST-' + Date.now(),
      }])
      if (insertResult?.error) throw insertResult.error
      loadStats();
      loadRecentOrders()
    } catch (err) {
      setError('Test order failed: ' + err.message)
    }
  }

  async function rejectOrder(id) {
    try {
      await supabase.from('orders').update({ status: 'cancelled' }).eq('id', id)
      setRecentOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'cancelled' } : o)))
      setStats((prev) => ({ ...prev, pending: Math.max(0, prev.pending - 1) }))
    } catch {
      setError('Failed to reject order')
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="admin-page-title">Dashboard</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn--outline-dark" style={{ fontSize: '13px', padding: '6px 16px' }} onClick={createTestOrder}>
            + Test Order
          </button>
          <button className="btn btn--outline-dark" style={{ fontSize: '13px', padding: '6px 16px' }} onClick={() => { loadStats(); loadRecentOrders() }}>
            Refresh
          </button>
        </div>
      </div>
      {error && <p className="admin-form__error">{error}</p>}
      {debug && <p style={{ fontSize: '12px', color: '#7d7d7d', marginBottom: '12px' }}>{debug}</p>}
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
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{o.customer_name}</td>
                    <td>{o.customer_email}</td>
                    <td>{Array.isArray(o.items) ? o.items.length : 0}</td>
                    <td>${Number(o.total).toLocaleString()}</td>
                    <td><span className={`admin-badge admin-badge--${o.status}`}>{o.status}</span></td>
                    <td>{new Date(o.created_at).toLocaleDateString()}</td>
                    <td>
                      {o.status === 'pending' ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn btn--dark" style={{ fontSize: '12px', padding: '4px 12px' }} onClick={() => approveOrder(o.id)}>
                            Approve
                          </button>
                          <button className="btn btn--outline-dark" style={{ fontSize: '12px', padding: '4px 12px', color: '#dc2626', borderColor: '#dc2626' }} onClick={() => rejectOrder(o.id)}>
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#7d7d7d' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
