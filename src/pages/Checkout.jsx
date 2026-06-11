import { useState, useEffect, useRef } from 'react'
import { useCart } from '../context/CartContext'
import { supabase } from '../supabase/client'

const FLW_KEY = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || ''
const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || ''
const IS_DEMO = !FLW_KEY && !STRIPE_KEY

const PAYMENT_METHODS = [
  { value: 'stripe', label: 'Credit / Debit Card', desc: 'Pay with Visa, Mastercard, Amex, Apple Pay, or Google Pay via Stripe', icon: '💳' },
  { value: 'flutterwave', label: 'Flutterwave', desc: 'Cards, Bank Transfer, USSD, Mobile Money — available in 30+ countries', icon: '🌍' },
  { value: 'manual', label: 'Bank Transfer', desc: 'Pay via wire transfer or direct deposit', icon: '🏦' },
]

export default function Checkout() {
  const { items, totalPrice, totalItems, clearCart } = useCart()
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [orderNum, setOrderNum] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [paymentRef, setPaymentRef] = useState('')
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'US',
  })
  const [stripeReady, setStripeReady] = useState(false)
  const stripeCardRef = useRef(null)
  const stripeObjRef = useRef(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function saveOrder(method, payStatus, ref) {
    const { data, error: err } = await supabase.from('orders').insert([{
      items: items.map((i) => ({ id: i.id, name: i.name, brand: i.brand, price: i.price, qty: i.qty, img: i.img })),
      total: totalPrice,
      customer_name: `${form.firstName} ${form.lastName}`,
      customer_email: form.email,
      shipping_address: `${form.address}, ${form.city}, ${form.state} ${form.zip}, ${form.country}`,
      status: payStatus === 'completed' ? 'processing' : 'pending',
      payment_method: method,
      payment_status: payStatus,
      payment_ref: ref || '',
    }]).select('id').single()
    if (err) throw err
    return data.id
  }

  useEffect(() => {
    if (paymentMethod === 'stripe' && STRIPE_KEY && !stripeReady) {
      const s = document.createElement('script')
      s.src = 'https://js.stripe.com/v3/'
      s.onload = () => {
        const stripe = window.Stripe(STRIPE_KEY)
        const elements = stripe.elements()
        const card = elements.create('card', {
          style: {
            base: {
              fontSize: '16px',
              fontFamily: 'Inter, Helvetica Neue, sans-serif',
              color: '#191c1f',
              '::placeholder': { color: '#adadad' },
            },
            invalid: { color: '#dc2626' },
          },
        })
        card.mount('#stripe-card-element')
        stripeObjRef.current = { stripe, card }
        setStripeReady(true)
      }
      document.head.appendChild(s)
    }
  }, [paymentMethod, stripeReady])

  useEffect(() => {
    return () => {
      if (stripeObjRef.current?.card) {
        stripeObjRef.current.card.destroy()
        stripeObjRef.current = null
      }
      setStripeReady(false)
    }
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!paymentMethod) { setError('Please select a payment method.'); return }
    setSaving(true)
    setError('')

    try {
      if (paymentMethod === 'flutterwave') {
        await payWithFlutterwave()
      } else if (paymentMethod === 'stripe') {
        await payWithStripe()
      } else if (paymentMethod === 'manual') {
        const ref = 'BANK-' + Date.now().toString(36).toUpperCase()
        const id = await saveOrder('bank_transfer', 'pending', ref)
        setPaymentRef(ref)
        setOrderNum(id)
        clearCart()
        setSubmitted(true)
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.')
      setSaving(false)
    }
  }

  function payWithFlutterwave() {
    return new Promise((resolve, reject) => {
      function open() {
        window.FlutterwaveCheckout({
          public_key: FLW_KEY || 'FLWPUBK-DEMO',
          tx_ref: 'FP-' + Date.now(),
          amount: totalPrice,
          currency: 'USD',
          payment_options: 'card, banktransfer, ussd, mobilemoney, account',
          customer: {
            email: form.email,
            name: `${form.firstName} ${form.lastName}`,
            phone_number: form.phone || '0000000000',
          },
          callback: async (resp) => {
            if (resp.status === 'successful' || resp.status === 'completed') {
              const id = await saveOrder('flutterwave', 'completed', resp.transaction_id || '')
              setOrderNum(id)
              clearCart()
              setSubmitted(true)
              resolve()
            } else {
              reject(new Error('Payment was not completed.'))
            }
          },
          onclose: () => {
            if (!submitted) reject(new Error('Payment cancelled'))
          },
        })
      }
      if (window.FlutterwaveCheckout) {
        open()
      } else {
        const s = document.createElement('script')
        s.src = 'https://checkout.flutterwave.com/v3.js'
        s.onload = open
        s.onerror = () => reject(new Error('Failed to load Flutterwave SDK'))
        document.head.appendChild(s)
      }
    }).catch((err) => { throw err })
  }

  async function payWithStripe() {
    if (IS_DEMO) {
      await new Promise((r) => setTimeout(r, 1000))
      const ref = 'STRIPE-DEMO-' + Date.now()
      const id = await saveOrder('stripe', 'completed', ref)
      setOrderNum(id)
      clearCart()
      setSubmitted(true)
      return
    }

    if (!stripeObjRef.current) throw new Error('Stripe not loaded yet')
    const { stripe, card } = stripeObjRef.current

    const { error: payErr, paymentIntent } = await stripe.confirmCardPayment(
      '{PAYMENT_INTENT_CLIENT_SECRET}',
      {
        payment_method: {
          card,
          billing_details: {
            name: `${form.firstName} ${form.lastName}`,
            email: form.email,
          },
        },
      },
    )

    if (payErr) throw payErr
    const id = await saveOrder('stripe', 'completed', paymentIntent?.id || '')
    setOrderNum(id)
    clearCart()
    setSubmitted(true)
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
          {paymentMethod === 'manual' ? (
            <>
              <div className="checkout-success__icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" /><line x1="12" y1="12" x2="12" y2="12.01" />
                </svg>
              </div>
              <h1 className="checkout-success__title">Order Placed — Awaiting Payment</h1>
              <p className="checkout-success__desc">
                {orderNum ? `Order #${orderNum} — ` : ''}Please complete via bank transfer.
              </p>
              <div className="checkout-bank-details">
                <h3>Bank Transfer Details</h3>
                <div className="checkout-bank-details__row"><span>Bank:</span><span>Chase Bank</span></div>
                <div className="checkout-bank-details__row"><span>Account Name:</span><span>FASHIONPHILE LLC</span></div>
                <div className="checkout-bank-details__row"><span>Account Number:</span><span>**** **** **** 4832</span></div>
                <div className="checkout-bank-details__row"><span>Routing Number:</span><span>021000021</span></div>
                <div className="checkout-bank-details__row"><span>Amount Due:</span><span>${totalPrice.toLocaleString()} USD</span></div>
                <div className="checkout-bank-details__row"><span>Reference:</span><span>{paymentRef}</span></div>
              </div>
              <p style={{ fontSize: '14px', color: '#7d7d7d', marginTop: '16px', maxWidth: '440px', marginInline: 'auto' }}>
                Include reference <strong>{paymentRef}</strong> with your transfer. Orders process once payment clears.
              </p>
              <a href="/" className="btn btn--dark" style={{ marginTop: '16px' }}>Continue Shopping</a>
            </>
          ) : (
            <>
              <div className="checkout-success__icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#205107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h1 className="checkout-success__title">Order Confirmed!</h1>
              <p className="checkout-success__desc">
                {orderNum ? `Order #${orderNum} — ` : ''}Thank you for your purchase. You&rsquo;ll receive a confirmation email shortly.
              </p>
              <a href="/" className="btn btn--dark">Continue Shopping</a>
            </>
          )}
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
            <h2 className="checkout-form__title">Contact</h2>
            <div className="checkout-form__group">
              <label>Email</label>
              <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
            </div>
            <div className="checkout-form__group">
              <label>Phone (optional)</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" />
            </div>

            <h2 className="checkout-form__title" style={{ marginTop: '24px' }}>Shipping</h2>
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

            <h2 className="checkout-form__title" style={{ marginTop: '24px' }}>Payment Method</h2>
            <div className="payment-methods">
              {PAYMENT_METHODS.map((pm) => (
                <label key={pm.value} className={`payment-method ${paymentMethod === pm.value ? 'payment-method--active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={pm.value}
                    checked={paymentMethod === pm.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
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

            {paymentMethod === 'stripe' && (
              <div className="payment-stripe-wrapper">
                {IS_DEMO ? (
                  <p className="payment-demo-notice">
                    Stripe is in demo mode. Click &quot;Place Order&quot; to simulate a successful payment. Add <code>VITE_STRIPE_PUBLIC_KEY</code> to your <code>.env</code> for live payments.
                  </p>
                ) : (
                  <div id="stripe-card-element" className="payment-stripe-card" />
                )}
              </div>
            )}

            {paymentMethod === 'flutterwave' && (
              <p className="payment-method-info">
                You will be redirected to Flutterwave to complete your payment using a card, bank transfer, USSD, or mobile money.
              </p>
            )}

            {paymentMethod === 'manual' && (
              <div className="payment-manual-info">
                <p>After placing your order, you&rsquo;ll receive bank transfer details to complete payment. Your order will be processed once the funds are received.</p>
              </div>
            )}

            {error && <p style={{ color: '#dc2626', fontSize: '14px', marginTop: '12px' }}>{error}</p>}

            <button type="submit" className="btn btn--dark checkout-form__submit" disabled={saving}>
              {saving ? (
                <span className="btn-loading">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 0.6s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" opacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" />
                  </svg>
                  Processing Payment&hellip;
                </span>
              ) : `Place Order — $${totalPrice.toLocaleString()}`}
            </button>
          </form>

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
