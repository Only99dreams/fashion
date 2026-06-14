import { useState } from 'react'
import { supabase } from '../supabase/client'

export default function MyAccount() {
  const [email, setEmail] = useState('')
  const [orders, setOrders] = useState(null)
  const [loading, setLoading] = useState(false)
  const [lookedUp, setLookedUp] = useState(false)
  const [customerName, setCustomerName] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setLookedUp(true)
    try {
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', email.trim().toLowerCase())
        .order('created_at', { ascending: false })
      setOrders(ordersData || [])

      const { data: existing } = await supabase.from('customers').select('*').eq('email', email.trim().toLowerCase()).single()
      if (existing) {
        setCustomerName(existing.full_name || '')
      } else {
        await supabase.from('customers').insert([{ email: email.trim().toLowerCase(), full_name: '', order_ids: [] }])
        setCustomerName('')
      }
    } catch {
      setOrders([])
    }
    setLoading(false)
  }

  return (
    <main className="new-arrivals">
      <div className="order-history-page">
        <h1 className="order-history__title">My Account</h1>

        {!lookedUp ? (
          <>
            <p className="order-history__desc">Enter your email to sign in and view your orders.</p>
            <form className="order-history__form" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="order-history__input"
              />
              <button type="submit" className="btn btn--dark" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </>
        ) : loading ? (
          <p style={{ textAlign: 'center', color: '#7d7d7d', marginTop: '32px' }}>Loading your orders...</p>
        ) : (
          <div className="order-history__results">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <p className="order-history__count" style={{ margin: 0 }}>
                {orders.length} order{orders.length !== 1 ? 's' : ''} for <strong>{email}</strong>
              </p>
              <button className="btn btn--outline-dark" style={{ fontSize: '13px', padding: '6px 16px' }} onClick={() => { setLookedUp(false); setOrders(null); setEmail('') }}>
                Sign Out
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="order-history__empty">
                <p>No orders found for <strong>{email}</strong>.</p>
                <p style={{ color: '#7d7d7d', fontSize: '14px', marginTop: '8px' }}>Orders appear here once you complete a purchase and an admin approves it.</p>
                <a href="/" className="btn btn--dark" style={{ marginTop: '16px' }}>Start Shopping</a>
              </div>
            ) : (
              <div className="order-history__list">
                {orders.map((order) => (
                  <div key={order.id} className="order-history__card">
                    <div className="order-history__card-header">
                      <span className="order-history__order-num">Order #{order.id}</span>
                      <span className={`order-history__status order-history__status--${order.status}`}>{order.status}</span>
                    </div>
                    <div className="order-history__card-date">{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    <div className="order-history__card-items">
                      {order.items && order.items.map((item, i) => (
                        <div key={i} className="order-history__item">
                          {item.img && <img src={item.img} alt={item.name} className="order-history__item-img" />}
                          <div className="order-history__item-info">
                            <span className="order-history__item-name">{item.brand} {item.name}</span>
                            <span className="order-history__item-qty">Qty: {item.qty}</span>
                            <span className="order-history__item-price">${(item.price * item.qty).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="order-history__card-footer">
                      <span className="order-history__total">Total: ${order.total.toLocaleString()}</span>
                      <span className="order-history__payment">Paid via {order.payment_method}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
