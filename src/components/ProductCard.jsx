import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { id, brand, name, condition, price, originalPrice, discount, estRetail, img } = product
  const { addToCart } = useCart()

  function handleAddToCart(e) {
    e.preventDefault()
    e.stopPropagation()
    addToCart({ id, brand, name, img, price, condition })
  }

  return (
    <a href={'/product/' + id} className="product-card">
      <div className="product-card__image">
        <img src={img} alt={name} loading="lazy" />
        <button className="product-card__wishlist" aria-label="Add to wishlist" onClick={(e) => { e.preventDefault(); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
        </button>
        {discount && <span className="product-card__badge">{discount}</span>}
        <button className="product-card__add-cart" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
      <div className="product-card__info">
        <p className="product-card__vendor">{brand}</p>
        <p className="product-card__name">{name}</p>
        <p className="product-card__condition">Condition: {condition}</p>
        <div className="product-card__pricing">
          <span className="product-card__price">${price.toLocaleString()}</span>
          {originalPrice && (
            <>
              <span className="product-card__orig-price">${originalPrice.toLocaleString()}</span>
              <span className="product-card__discount">{discount}</span>
            </>
          )}
        </div>
        {estRetail && (
          <div className="product-card__retail">
            <span>Est. Retail ${estRetail.toLocaleString()}</span>
            {originalPrice && price < estRetail && (
              <span className="product-card__retail-discount">
                {Math.round((1 - price / estRetail) * 100)}% below retail
              </span>
            )}
          </div>
        )}
      </div>
    </a>
  )
}
