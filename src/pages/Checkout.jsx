import { useState, useEffect, useRef } from 'react'
import { useCart } from '../context/CartContext'
import { supabase } from '../supabase/client'

const PAYMENT_METHODS = [
  { value: 'stripe', label: 'Credit / Debit Card', desc: 'Pay with Visa, Mastercard, Amex, Apple Pay, or Google Pay via Stripe', icon: '💳' },
  { value: 'paypal', label: 'PayPal', desc: 'Pay with your PayPal account — fast, easy, and secure', icon: '🅿️' },
  { value: 'affirm', label: 'Affirm — Pay Over Time', desc: 'Buy now, pay later with easy monthly installments', icon: '⏱️' },
]

export default function Checkout() {
  const { items, totalPrice, totalItems } = useCart()
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [orderNum, setOrderNum] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'US',
  })
  const [showContactModal, setShowContactModal] = useState(false)
  const formRef = useRef(form)
  const processingRef = useRef(false)

  useEffect(() => { formRef.current = form }, [form])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function createCustomerAccount(orderId) {
    const name = `${formRef.current.firstName} ${formRef.current.lastName}`
    const email = formRef.current.email
    const { data: existing } = await supabase.from('customers').select('*').eq('email', email).maybeSingle()
    if (existing) {
      const orderIds = [...(existing.order_ids || []), orderId]
      await supabase.from('customers').update({ order_ids: orderIds, full_name: name, updated_at: new Date().toISOString() }).eq('email', email)
    } else {
      await supabase.from('customers').insert([{ email, full_name: name, order_ids: [orderId] }])
    }
  }

  async function saveOrder(method, payStatus, ref) {
    const { data, error } = await supabase.from('orders').insert([{
      items: items.map((i) => ({ id: i.id, name: i.name, brand: i.brand, price: i.price, qty: i.qty, img: i.img })),
      total: totalPrice,
      customer_name: `${form.firstName} ${form.lastName}`,
      customer_email: form.email,
      shipping_address: `${form.address}, ${form.city}, ${form.state} ${form.zip}, ${form.country}`,
      status: 'pending',
      payment_method: method,
      payment_status: payStatus,
      payment_ref: ref || '',
    }]).select()
    if (error) throw error
    return data?.[0]?.id
  }

  async function handlePaymentMethodSelect(value) {
    if (processingRef.current) return
    setPaymentMethod(value)
    setError('')

    if (!form.firstName || !form.lastName || !form.email || !form.address) {
      setError('Please fill in all required fields before selecting a payment method.')
      return
    }

    processingRef.current = true
    setSaving(true)

    try {
      await new Promise((r) => setTimeout(r, 3000))

      const ref = value.toUpperCase() + '-DEMO-' + Date.now()
      const orderId = await saveOrder(value, 'completed', ref)
      await createCustomerAccount(orderId)
      setOrderNum(orderId)
      setSubmitted(true)
      setShowContactModal(true)
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.')
    } finally {
      setSaving(false)
      processingRef.current = false
    }
  }

  function openTawkTo() {
    if (window.Tawk_API) {
      window.Tawk_API.visitor = {
        name: form.firstName + ' ' + form.lastName,
        email: form.email,
      }
      window.Tawk_API.maximize()
    } else {
      window.open('https://tawk.to/chat/6a2d37a3f0b5881c2ac3fa6a/1jr0a2m43', '_blank')
    }
  }

  function closeModal() {
    setShowContactModal(false)
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
          <div className="checkout-pending__icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#bead0d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>

          <h1 className="checkout-pending__title">Order Pending!</h1>
          <p className="checkout-pending__desc">
            {orderNum ? `Order #${orderNum} — ` : ''}Thank you for your Order. Complete payment to receive a confirmation email shortly.
          </p>
          <a href="/" className="btn btn--dark">Continue Shopping</a>
        </div>

        {showContactModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">Payment Assistance</h2>
              <p className="modal-text">
                Your order has been received but pending payment. If you&rsquo;re having any issues with your payment, please contact our admin for assistance.
              </p>
              <div className="modal-actions">
                <button className="btn btn--dark" onClick={() => { openTawkTo(); closeModal() }}>
                  Contact Admin
                </button>
                <button className="btn btn--outline-dark" onClick={closeModal}>
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    )
  }

  return (
    <main className="checkout-page">
      {saving && (
        <div className="modal-overlay">
          <div className="modal-content modal-content--loading">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-black)" strokeWidth="2" style={{ animation: 'spin 0.6s linear infinite' }}>
              <circle cx="12" cy="12" r="10" opacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
            <p style={{ marginTop: '16px', fontSize: '16px', fontWeight: 600 }}>Processing Payment&hellip;</p>
            <p style={{ marginTop: '8px', fontSize: '14px', color: '#7d7d7d' }}>Please do not close this page.</p>
          </div>
        </div>
      )}

      <div className="checkout-page__inner">
        <h1 className="checkout-page__title">Checkout</h1>

        <div className="checkout-page__layout">
          <div className="checkout-form">
            <h2 className="checkout-form__title">Contact</h2>
            <div className="checkout-form__group">
              <label>Email</label>
              <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" disabled={saving} />
            </div>
            <div className="checkout-form__group">
              <label>Phone (optional)</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" disabled={saving} />
            </div>

            <h2 className="checkout-form__title" style={{ marginTop: '24px' }}>Shipping</h2>
            <div className="checkout-form__row">
              <div className="checkout-form__group">
                <label>First Name</label>
                <input type="text" name="firstName" required value={form.firstName} onChange={handleChange} disabled={saving} />
              </div>
              <div className="checkout-form__group">
                <label>Last Name</label>
                <input type="text" name="lastName" required value={form.lastName} onChange={handleChange} disabled={saving} />
              </div>
            </div>
            <div className="checkout-form__group">
              <label>Address</label>
              <input type="text" name="address" required value={form.address} onChange={handleChange} placeholder="123 Main St" disabled={saving} />
            </div>
            <div className="checkout-form__row">
              <div className="checkout-form__group">
                <label>City</label>
                <input type="text" name="city" required value={form.city} onChange={handleChange} disabled={saving} />
              </div>
              <div className="checkout-form__group">
                <label>State</label>
                <input type="text" name="state" required value={form.state} onChange={handleChange} disabled={saving} />
              </div>
              <div className="checkout-form__group">
                <label>ZIP</label>
                <input type="text" name="zip" required value={form.zip} onChange={handleChange} disabled={saving} />
              </div>
            </div>

            <h2 className="checkout-form__title" style={{ marginTop: '24px' }}>Payment Method</h2>
            <div className="payment-methods">
              {PAYMENT_METHODS.map((pm) => (
                <label key={pm.value} className={`payment-method ${paymentMethod === pm.value ? 'payment-method--active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={pm.value}
                    checked={paymentMethod === pm.value}
                    onChange={() => handlePaymentMethodSelect(pm.value)}
                    disabled={saving}
                  />
                  <span className="payment-method__icon">{pm.icon}</span>
                  <div className="payment-method__info">
                    <span className="payment-method__label">{pm.label}</span>
                    <span className="payment-method__desc">{pm.desc}</span>
                  </div>
                  <span className="payment-method__check">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </span>
                </label>
              ))}
            </div>

            {error && <p style={{ color: '#dc2626', fontSize: '14px', marginTop: '12px' }}>{error}</p>}
          </div>

          <div className="checkout-sidebar">
            <h3 className="checkout-sidebar__title">{totalItems} item{totalItems !== 1 ? 's' : ''}</h3>
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
            <div className="checkout-sidebar__payment-icons">
              <span>We accept</span>
              <div className="checkout-sidebar__icons">
                <svg viewBox="0 0 24 24" width="32" height="20"><rect x="1" y="3" width="22" height="18" rx="2" fill="#1A1F71"/><text x="12" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="Arial">V</text></svg>
                <svg viewBox="0 0 24 24" width="32" height="20"><rect x="1" y="3" width="22" height="18" rx="2" fill="#E61E24"/><text x="12" y="16" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="Arial">MC</text></svg>
                <svg viewBox="0 0 24 24" width="32" height="20"><rect x="1" y="3" width="22" height="18" rx="2" fill="#A6CD39"/><text x="12" y="16" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold" fontFamily="Arial">AMEX</text></svg>
                <svg viewBox="0 0 24 24" width="32" height="20"><rect x="1" y="3" width="22" height="18" rx="2" fill="#0070BA"/><text x="12" y="16" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold" fontFamily="Arial">PP</text></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
