import { useState, useEffect } from 'react'
import { supabase } from '../../supabase/client'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(null)

  useEffect(() => { loadOrders() }, [])

  async function loadOrders() {
    setLoading(true)
    setError('')
    try {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
      setOrders(data || [])
    } catch {
      setError('Failed to load orders')
    }
    setLoading(false)
  }

  async function updateStatus(id, status) {
    setError('')
    try {
      await supabase.from('orders').update({ status }).eq('id', id)
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
    } catch {
      setError('Failed to update order status')
    }
  }

  function getPaymentLabel(method) {
    const labels = {
      flutterwave: 'Flutterwave',
      stripe: 'Stripe',
      bank_transfer: 'Bank Transfer',
    }
    return labels[method] || method || '—'
  }

  function getPaymentStatusBadge(status) {
    const cls = status === 'completed' ? 'admin-badge--delivered' :
                status === 'pending' ? 'admin-badge--pending' :
                status === 'failed' ? 'admin-badge--cancelled' : ''
    return <span className={`admin-badge ${cls}`}>{status || '—'}</span>
  }

  if (loading) return <p className="admin-empty">Loading...</p>

  return (
    <div className="admin-orders">
      <h1 className="admin-page-title">Orders</h1>

      {error && <p className="admin-form__error">{error}</p>}

      {orders.length === 0 ? (
        <p className="admin-empty">No orders yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Payment Status</th>
              <th>Order Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{o.customer_name}</td>
                <td>{o.customer_email}</td>
                <td>{Array.isArray(o.items) ? o.items.length : 0}</td>
                <td>${Number(o.total).toLocaleString()}</td>
                <td>{getPaymentLabel(o.payment_method)}</td>
                <td>{getPaymentStatusBadge(o.payment_status)}</td>
                <td>
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="admin-status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>{new Date(o.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
