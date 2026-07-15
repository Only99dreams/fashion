import { useState, useEffect, useMemo } from 'react'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { getProductById, getRelatedProducts } from '../data/getProducts'

const pexel = (id, w = 800) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`

const fallbackImages = {
  Bags: [
    pexel(16690455),
    pexel(1058959),
    pexel(27174565),
  ],
  Shoes: [
    pexel(3916017),
    pexel(16690455),
    pexel(1058959),
  ],
  Jewelry: [
    pexel(19646999),
    pexel(12194325),
    pexel(3641059),
  ],
  Watches: [
    pexel(380782),
    pexel(16690455),
    pexel(1058959),
  ],
  Accessories: [
    pexel(6044266),
    pexel(16690455),
    pexel(1058959),
  ],
}

export default function ProductDetail({ productId }) {
  const { addToCart } = useCart()
  const { showToast } = useToast()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Fetch the full product (with all images) and its related items on demand.
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setSelectedImage(0)
    setRelated([])
    getProductById(productId).then((full) => {
      if (cancelled) return
      setProduct(full)
      setLoading(false)
      if (full) {
        getRelatedProducts(full.category, full.id, 4).then((r) => {
          if (!cancelled) setRelated(r)
        })
      }
    })
    return () => { cancelled = true }
  }, [productId])

  const productImages = useMemo(() => {
    if (!product) return []
    if (product.images && product.images.length > 0) return product.images
    if (product.img) return [product.img]
    return [product.img, ...(fallbackImages[product.category] || fallbackImages.Bags)]
  }, [product])

  useEffect(() => { setSelectedImage(0) }, [productId])

  useEffect(() => {
    if (!lightboxOpen) return
    function handleKey(e) {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowLeft') setLightboxIndex(i => (i > 0 ? i - 1 : productImages.length - 1))
      if (e.key === 'ArrowRight') setLightboxIndex(i => (i < productImages.length - 1 ? i + 1 : 0))
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxOpen, productImages.length])

  if (loading) {
    return (
      <main className="new-arrivals">
        <div className="preloader">
          <div className="preloader__spinner" />
          <p className="preloader__text">Loading product...</p>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="new-arrivals">
        <div className="na-empty">
          <p>Product not found.</p>
          <a href="/" className="btn btn--dark" style={{ marginTop: '16px', display: 'inline-flex' }}>Back to Home</a>
        </div>
      </main>
    )
  }

  return (
    <main className="pd-page">
      <div className="pd-breadcrumb">
        <a href="/">Home</a>
        <span>/</span>
        <a href={'/' + product.category.toLowerCase()}>{product.category}</a>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="pd-layout">
        <div className="pd-gallery">
          <div className="pd-gallery__main" onClick={() => { setLightboxOpen(true); setLightboxIndex(selectedImage) }}>
            <img src={productImages[selectedImage]} alt={product.name} loading="eager" />
          </div>
          {productImages.length > 1 && (
            <div className="pd-gallery__thumbs">
              {productImages.slice(0, 6).map((src, i) => (
                <button
                  key={i}
                  className={`pd-gallery__thumb${i === selectedImage ? ' pd-gallery__thumb--active' : ''}`}
                  onClick={() => setSelectedImage(i)}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {lightboxOpen && (
          <div className="pd-lightbox" onClick={() => setLightboxOpen(false)}>
            <button className="pd-lightbox__close" onClick={() => setLightboxOpen(false)}>&times;</button>
            <button
              className="pd-lightbox__arrow pd-lightbox__arrow--left"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => (i > 0 ? i - 1 : productImages.length - 1)) }}
            >&#8249;</button>
            <div className="pd-lightbox__image" onClick={(e) => e.stopPropagation()}>
              <img src={productImages[lightboxIndex]} alt={product.name} />
            </div>
            <button
              className="pd-lightbox__arrow pd-lightbox__arrow--right"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => (i < productImages.length - 1 ? i + 1 : 0)) }}
            >&#8250;</button>
            <div className="pd-lightbox__counter">{lightboxIndex + 1} / {productImages.length}</div>
            <div className="pd-lightbox__preload">
              <img src={productImages[(lightboxIndex + 1) % productImages.length]} alt="" />
              <img src={productImages[(lightboxIndex - 1 + productImages.length) % productImages.length]} alt="" />
            </div>
          </div>
        )}

        <div className="pd-info">
          <p className="pd-info__brand">{product.brand}</p>
          <h1 className="pd-info__name">{product.name}</h1>
          <p className="pd-info__condition">Condition: {product.condition}</p>

          <div className="pd-info__pricing">
            <span className="pd-info__price">${product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <>
                <span className="pd-info__orig-price">${product.originalPrice.toLocaleString()}</span>
                <span className="pd-info__discount">{product.discount}</span>
              </>
            )}
          </div>

          {product.estRetail && (
            <p className="pd-info__retail">
              Est. Retail ${product.estRetail.toLocaleString()}
              {product.price < product.estRetail && (
                <span className="pd-info__below-retail">
                  {Math.round((1 - product.price / product.estRetail) * 100)}% below retail
                </span>
              )}
            </p>
          )}

          <div className="pd-info__divider" />

          <p className="pd-info__desc">
            Authenticated pre-owned {product.brand} {product.name}. This item is in {product.condition.toLowerCase()} condition.
            All items are 100% authentic and thoroughly inspected by our expert team.
          </p>

          <div className="pd-info__features">
            <div className="pd-info__feature">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <span>100% Authentic</span>
            </div>
            <div className="pd-info__feature">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              <span>Free Shipping</span>
            </div>
            <div className="pd-info__feature">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
              <span>Authenticity Guarantee</span>
            </div>
          </div>

          <button
            className="btn btn--dark pd-info__add-btn"
            onClick={() => { addToCart(product); showToast(`${product.brand} ${product.name} added to cart`) }}
          >
            Add to Cart — ${product.price.toLocaleString()}
          </button>

          <div className="pd-info__payment">
            <p>or 4 interest-free payments of ${(product.price / 4).toFixed(0)} with <strong>Affirm</strong></p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="pd-related">
          <h2 className="pd-related__title">More from {product.category}</h2>
          <div className="pd-related__grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}