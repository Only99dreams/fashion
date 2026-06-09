import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, removeFromCart, updateQty, totalPrice, totalItems } = useCart()

  if (items.length === 0) {
    return (
      <main className="new-arrivals">
        <div className="cart-empty">
          <h1 className="cart-empty__title">Your Cart is Empty</h1>
          <p className="cart-empty__desc">Looks like you haven't added anything yet.</p>
          <a href="/" className="btn btn--dark">Continue Shopping</a>
        </div>
      </main>
    )
  }

  return (
    <main className="cart-page">
      <div className="cart-page__inner">
        <h1 className="cart-page__title">Shopping Cart ({totalItems} items)</h1>

        <div className="cart-page__layout">
          <div className="cart-page__items">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <a href={'/product/' + item.id} className="cart-item__image">
                  <img src={item.img} alt={item.name} />
                </a>
                <div className="cart-item__info">
                  <p className="cart-item__brand">{item.brand}</p>
                  <a href={'/product/' + item.id} className="cart-item__name">{item.name}</a>
                  <p className="cart-item__condition">Condition: {item.condition}</p>
                  <div className="cart-item__qty">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} disabled={item.qty <= 1}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                  </div>
                </div>
                <div className="cart-item__right">
                  <p className="cart-item__price">${(item.price * item.qty).toLocaleString()}</p>
                  <button className="cart-item__remove" onClick={() => removeFromCart(item.id)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-page__summary">
            <h3 className="cart-summary__title">Order Summary</h3>
            <div className="cart-summary__row">
              <span>Subtotal ({totalItems} items)</span>
              <span>${totalPrice.toLocaleString()}</span>
            </div>
            <div className="cart-summary__row">
              <span>Shipping</span>
              <span className="cart-summary__free">Free</span>
            </div>
            <div className="cart-summary__divider" />
            <div className="cart-summary__row cart-summary__total">
              <span>Total</span>
              <span>${totalPrice.toLocaleString()}</span>
            </div>
            <a href="/checkout" className="btn btn--dark cart-summary__checkout">
              Proceed to Checkout
            </a>
            <a href="/" className="cart-summary__continue">Continue Shopping</a>

            <div className="cart-summary__payment">
              <p>or 4 interest-free payments of ${(totalPrice / 4).toFixed(0)} with <strong>Affirm</strong></p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
