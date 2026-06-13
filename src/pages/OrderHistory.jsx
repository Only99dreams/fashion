import { useState } from 'react'
import { supabase } from '../supabase/client'

export default function OrderHistory() {
  const [email, setEmail] = useState('')
  const [orders, setOrders] = useState(null)
  const [loading, setLoading] = useState(false)
  const [lookedUp, setLookedUp] = useState(false)

  async function handleLookup(e) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setLookedUp(true)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', email.trim().toLowerCase())
        .order('created_at', { ascending: false })
      if (error) throw error
      setOrders(data || [])
    } catch {
      setOrders([])
    }
    setLoading(false)
  }

  return (
    <main className="new-arrivals">
      <div className="order-history-page">
        <h1 className="order-history__title">Order History</h1>
        <p className="order-history__desc">Enter the email address you used at checkout to look up your orders.</p>

        <form className="order-history__form" onSubmit={handleLookup}>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="order-history__input"
          />
          <button type="submit" className="btn btn--dark" disabled={loading}>
            {loading ? 'Looking up...' : 'Look Up Orders'}
          </button>
        </form>

        {lookedUp && !loading && (
          <div className="order-history__results">
            {orders && orders.length > 0 ? (
              <>
                <p className="order-history__count">{orders.length} order{orders.length !== 1 ? 's' : ''} found for <strong>{email}</strong></p>
                <div className="order-history__list">
                  {orders.map((order) => (
                    <div key={order.id} className="order-history__card">
                      <div className="order-history__card-header">
                        <span className="order-history__order-num">Order #{order.id}</span>
                        <span className={`order-history__status order-history__status--${order.status}`}>{order.status}</span>
                      </div>
                      <div className="order-history__card-date">{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                      <div className="order-history__card-items">
                        {order.items.map((item, i) => (
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
                        <span className="order-history__payment">Paid via {order.payment_method} — {order.payment_status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="order-history__empty">
                <p>No orders found for <strong>{email}</strong>.</p>
                <p style={{ color: '#7d7d7d', fontSize: '14px', marginTop: '8px' }}>Orders appear here once you complete a purchase.</p>
                <a href="/" className="btn btn--dark" style={{ marginTop: '16px' }}>Start Shopping</a>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
