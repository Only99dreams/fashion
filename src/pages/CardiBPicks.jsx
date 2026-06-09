import { useState, useEffect, useMemo } from 'react'
import ProductCard from '../components/ProductCard'
import { getProducts } from '../data/getProducts'

const cardiBrands = [
  { name: 'Hermes', img: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=400&q=80' },
  { name: 'Chanel', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80' },
  { name: 'Bottega Veneta', img: 'https://images.unsplash.com/photo-1594226801341-41427b4e5c20?w=400&q=80' },
  { name: 'Gucci', img: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&q=80' },
  { name: 'Louis Vuitton', img: 'https://images.unsplash.com/photo-1564372427378-58eaf2d91d7b?w=400&q=80' },
  { name: 'Cartier', img: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&q=80' },
]

const filters = [
  { name: 'Designer', options: ['Chanel', 'Hermes', 'Louis Vuitton', 'Gucci', 'Bottega Veneta', 'Cartier', 'Christian Dior', 'Fendi'] },
  { name: 'Category', options: ['Bags', 'Jewelry', 'Watches', 'Shoes', 'Accessories'] },
  { name: 'Condition', options: ['Excellent', 'Very Good', 'Good', 'Shows Wear'] },
  { name: 'Price Range', options: ['Under $500', '$500 - $1,000', '$1,000 - $2,500', '$2,500 - $5,000', '$5,000 - $10,000', '$10,000+'] },
  { name: 'Color', options: ['Black', 'Brown', 'Beige', 'Red', 'Blue', 'Green', 'Pink', 'Purple', 'White', 'Gold'] },
]

export default function CardiBPicks() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    getProducts().then(setProducts)
  }, [])

  const cardiProducts = useMemo(
    () => products.filter((p) => p.is_cardi_pick),
    [products]
  )

  return (
    <main className="new-arrivals">
      <section className="cb-hero">
        <div className="cb-hero__bg">
          <img src="https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=1920&q=85" alt="" />
        </div>
        <div className="cb-hero__overlay" />
        <div className="cb-hero__content">
          <h1 className="cb-hero__title">Cardi B's Picks</h1>
          <p className="cb-hero__desc">
            Curated by Cardi B exclusively for FASHIONPHILE, this haute collection brings the drama.
            Cardi&rsquo;s edit features Cardi classics and newfound favorites from Hermes, Chanel,
            Louis Vuitton, Dior, and more.
          </p>
          <blockquote className="cb-hero__quote">
            &ldquo;I get excited over the bags everybody else can&rsquo;t find. The vintage ones,
            the rare colors, the sold-out styles, that&rsquo;s the fun part for me. And with
            FASHIONPHILE, I know everything&rsquo;s real, so I can get my bag without second-guessing.&rdquo;
            <cite>&mdash; Cardi B</cite>
          </blockquote>
        </div>
      </section>

      <section className="cb-brands">
        <div className="cb-brands__inner">
          {cardiBrands.map((b) => (
            <a key={b.name} href={'/designer/' + b.name.toLowerCase().replace(/&/g, 'and').replace(/\./g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')} className="cb-brand-card">
              <div className="cb-brand-card__img">
                <img src={b.img} alt={b.name} />
              </div>
              <span className="cb-brand-card__name">{b.name}</span>
            </a>
          ))}
        </div>
      </section>

      <div className="na-layout">
        <aside className="na-sidebar">
          <h3 className="na-sidebar__title">Filters</h3>
          {filters.map((group) => (
            <div key={group.name} className="na-filter-group">
              <h4 className="na-filter-group__name">{group.name}</h4>
              {group.options.map((opt) => (
                <label key={opt} className="na-filter-option">
                  <input type="checkbox" />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          ))}
          <button className="btn btn--dark" style={{ width: '100%', marginTop: '16px' }}>Apply Filters</button>
        </aside>

        <div className="na-main">
          <div className="na-toolbar">
            <p className="na-toolbar__count">{cardiProducts.length} Products</p>
            <div className="na-toolbar__sort">
              <label htmlFor="sort">Sort by:</label>
              <select id="sort" className="na-toolbar__select">
                <option>Featured</option>
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Best Selling</option>
              </select>
            </div>
          </div>

          <div className="na-grid">
            {cardiProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="na-pagination">
            <span className="na-pagination__active">1</span>
            <a href="#" className="na-pagination__next">
              Next
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </div>

      <section className="ab-info-cards">
        <div className="ab-info-cards__inner">
          <div className="ab-info-card">
            <div className="ab-info-card__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
            </div>
            <h3 className="ab-info-card__title">FASHIONPHILE TV</h3>
            <p className="ab-info-card__desc">Drop in, shop, and chat with us in real time. Only on TikTok Shop.</p>
            <a href="/help" className="ab-info-card__cta">Learn More</a>
          </div>
          <div className="ab-info-card">
            <div className="ab-info-card__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <h3 className="ab-info-card__title">Get Guidance</h3>
            <p className="ab-info-card__desc">Our Concierge team offers personal shopping services for any item you&rsquo;re eyeing.</p>
            <a href="/help" className="ab-info-card__cta">Learn More</a>
          </div>
          <div className="ab-info-card">
            <div className="ab-info-card__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <h3 className="ab-info-card__title">Shop in Person</h3>
            <p className="ab-info-card__desc">Visit us or select in-store pickup at checkout.</p>
            <a href="/stores" className="ab-info-card__cta">Learn More</a>
          </div>
        </div>
      </section>
    </main>
  )
}