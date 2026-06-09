import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { supabase } from '../supabase/client'

export default function Checkout() {
  const { items, totalPrice, totalItems, clearCart } = useCart()
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [orderNum, setOrderNum] = useState(null)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'US',
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const { data, error: err } = await supabase.from('orders').insert([{
        items: items.map((i) => ({
          id: i.id, name: i.name, brand: i.brand, price: i.price, qty: i.qty, img: i.img,
        })),
        total: totalPrice,
        customer_name: `${form.firstName} ${form.lastName}`,
        customer_email: form.email,
        shipping_address: `${form.address}, ${form.city}, ${form.state} ${form.zip}, ${form.country}`,
        status: 'pending',
      }]).select('id').single()

      if (err) throw err

      setOrderNum(data.id)
      clearCart()
      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.')
    }
    setSaving(false)
  }

  if (items.length === 0 && !submitted) {
    return (
      <main className="new-arrivals">
        <div className="cart-empty">
          <h1 className="cart-empty__title">Your Cart is Empty</h1>
          <a href="/" className="btn btn--dark">Continue Shopping</a>
        </div>
      </main>
    )
  }

  if (submitted) {
    return (
      <main className="checkout-page">
        <div className="checkout-success">
          <div className="checkout-success__icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#205107" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h1 className="checkout-success__title">Order Confirmed!</h1>
          <p className="checkout-success__desc">
            {orderNum ? `Order #${orderNum} — ` : ''}Thank you for your purchase. You'll receive a confirmation email shortly.
          </p>
          <a href="/" className="btn btn--dark">Continue Shopping</a>
        </div>
      </main>
    )
  }

  return (
    <main className="checkout-page">
      <div className="checkout-page__inner">
        <h1 className="checkout-page__title">Checkout</h1>

        <div className="checkout-page__layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h2 className="checkout-form__title">Contact Information</h2>
            <div className="checkout-form__group">
              <label>Email</label>
              <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
            </div>
            <div className="checkout-form__group">
              <label>Phone</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" />
            </div>

            <h2 className="checkout-form__title" style={{ marginTop: '24px' }}>Shipping Address</h2>
            <div className="checkout-form__row">
              <div className="checkout-form__group">
                <label>First Name</label>
                <input type="text" name="firstName" required value={form.firstName} onChange={handleChange} />
              </div>
              <div className="checkout-form__group">
                <label>Last Name</label>
                <input type="text" name="lastName" required value={form.lastName} onChange={handleChange} />
              </div>
            </div>
            <div className="checkout-form__group">
              <label>Address</label>
              <input type="text" name="address" required value={form.address} onChange={handleChange} placeholder="123 Main St" />
            </div>
            <div className="checkout-form__row">
              <div className="checkout-form__group">
                <label>City</label>
                <input type="text" name="city" required value={form.city} onChange={handleChange} />
              </div>
              <div className="checkout-form__group">
                <label>State</label>
                <input type="text" name="state" required value={form.state} onChange={handleChange} />
              </div>
              <div className="checkout-form__group">
                <label>ZIP</label>
                <input type="text" name="zip" required value={form.zip} onChange={handleChange} />
              </div>
            </div>

            {error && <p style={{ color: '#dc2626', fontSize: '14px', marginTop: '12px' }}>{error}</p>}

            <button type="submit" className="btn btn--dark checkout-form__submit" disabled={saving}>
              {saving ? 'Processing...' : `Place Order — $${totalPrice.toLocaleString()}`}
            </button>
          </form>

          <div className="checkout-sidebar">
            <h3 className="checkout-sidebar__title">{totalItems} items</h3>
            <div className="checkout-sidebar__items">
              {items.map((item) => (
                <div key={item.id} className="checkout-sidebar__item">
                  <div className="checkout-sidebar__item-img">
                    <img src={item.img} alt={item.name} />
                    <span className="checkout-sidebar__item-qty">{item.qty}</span>
                  </div>
                  <div className="checkout-sidebar__item-info">
                    <p className="checkout-sidebar__item-name">{item.brand} {item.name}</p>
                    <p className="checkout-sidebar__item-price">${(item.price * item.qty).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="checkout-sidebar__divider" />
            <div className="checkout-sidebar__row"><span>Subtotal</span><span>${totalPrice.toLocaleString()}</span></div>
            <div className="checkout-sidebar__row"><span>Shipping</span><span className="cart-summary__free">Free</span></div>
            <div className="checkout-sidebar__divider" />
            <div className="checkout-sidebar__row checkout-sidebar__total"><span>Total</span><span>${totalPrice.toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </main>
  )
}
