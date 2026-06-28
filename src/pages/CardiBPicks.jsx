import { useState, useMemo } from 'react'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../context/ProductContext'

const PAGE_SIZE = 12

const pexel = (id, w = 400) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`

const cardiBrands = [
  { name: 'Hermes', img: pexel(16690455) },
  { name: 'Chanel', img: pexel(16690455) },
  { name: 'Bottega Veneta', img: pexel(27174565) },
  { name: 'Gucci', img: pexel(6044266) },
  { name: 'Louis Vuitton', img: pexel(1058959) },
  { name: 'Cartier', img: pexel(12194325) },
]

const filterConfig = [
  { name: 'Designer', key: 'brand', options: ['Chanel', 'Hermes', 'Louis Vuitton', 'Gucci', 'Bottega Veneta', 'Cartier', 'Christian Dior', 'Fendi'] },
  { name: 'Category', key: 'category', options: ['Bags', 'Jewelry', 'Watches', 'Shoes', 'Accessories'] },
  { name: 'Condition', key: 'condition', options: ['Excellent', 'Very Good', 'Good', 'Shows Wear'] },
  { name: 'Price Range', key: 'priceRange', options: ['Under $500', '$500 - $1,000', '$1,000 - $2,500', '$2,500 - $5,000', '$5,000 - $10,000', '$10,000+'] },
]

function parsePriceRange(label) {
  if (label === 'Under $500') return [0, 500]
  if (label === '$500 - $1,000') return [500, 1000]
  if (label === '$1,000 - $2,500') return [1000, 2500]
  if (label === '$2,500 - $5,000') return [2500, 5000]
  if (label === '$5,000 - $10,000') return [5000, 10000]
  if (label === '$10,000+') return [10000, Infinity]
  return null
}

export default function CardiBPicks() {
  const { products: allProducts, loading } = useProducts()
  const [selectedFilters, setSelectedFilters] = useState({})
  const [sort, setSort] = useState('Featured')
  const [page, setPage] = useState(1)

  const cardiProducts = useMemo(
    () => allProducts.filter((p) => p.is_cardi_pick),
    [allProducts]
  )

  function toggleFilter(groupKey, value) {
    setSelectedFilters((prev) => {
      const current = prev[groupKey] || []
      const exists = current.includes(value)
      const updated = exists ? current.filter((v) => v !== value) : [...current, value]
      setPage(1)
      return { ...prev, [groupKey]: updated.length ? updated : undefined }
    })
  }

  const filtered = useMemo(() => {
    let result = [...cardiProducts]

    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (!values || values.length === 0) return
      if (key === 'priceRange') {
        result = result.filter((p) =>
          values.some((v) => {
            const range = parsePriceRange(v)
            return range && p.price >= range[0] && p.price < range[1]
          })
        )
      } else {
        result = result.filter((p) => values.includes(p[key]))
      }
    })

    switch (sort) {
      case 'Price: Low to High':
        result.sort((a, b) => a.price - b.price); break
      case 'Price: High to Low':
        result.sort((a, b) => b.price - a.price); break
      case 'Newest':
        result.sort((a, b) => b.id - a.id); break
      default:
        break
    }

    return result
  }, [selectedFilters, sort, cardiProducts])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const currentPage = Math.min(page, totalPages || 1)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <main className="new-arrivals">
      <section className="cb-hero">
        <div className="cb-hero__bg">
          <img src={pexel(16690455, 1920)} alt="" />
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
          {filterConfig.map((group) => (
            <div key={group.key} className="na-filter-group">
              <h4 className="na-filter-group__name">{group.name}</h4>
              {group.options.map((opt) => {
                const checked = (selectedFilters[group.key] || []).includes(opt)
                return (
                  <label key={opt} className="na-filter-option">
                    <input type="checkbox" checked={checked} onChange={() => toggleFilter(group.key, opt)} />
                    <span>{opt}</span>
                  </label>
                )
              })}
            </div>
          ))}
          {Object.values(selectedFilters).some((v) => v && v.length) && (
            <button className="btn btn--outline-dark" style={{ width: '100%', marginTop: '16px' }} onClick={() => { setSelectedFilters({}); setPage(1) }}>
              Clear Filters
            </button>
          )}
        </aside>

        <div className="na-main">
          <div className="na-toolbar">
            <div className="na-toolbar__sort">
              <label htmlFor="sort">Sort by:</label>
              <select id="sort" className="na-toolbar__select" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1) }}>
                <option>Featured</option>
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="na-grid">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="product-card product-card--skeleton">
                  <div className="product-card__image" style={{ background: '#f0f0f0', borderRadius: '12px' }} />
                  <div className="product-card__info">
                    <div style={{ height: 14, width: '40%', background: '#f0f0f0', borderRadius: 4, marginBottom: 8 }} />
                    <div style={{ height: 14, width: '80%', background: '#f0f0f0', borderRadius: 4, marginBottom: 8 }} />
                    <div style={{ height: 14, width: '30%', background: '#f0f0f0', borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="na-empty" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '18px', color: '#7d7d7d' }}>No products match your filters. Try adjusting your selection.</p>
            </div>
          ) : (
            <div className="na-grid">
              {paginated.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="na-pagination">
              <a
                href="#"
                className={`na-pagination__prev${currentPage <= 1 ? ' na-pagination--disabled' : ''}`}
                onClick={(e) => { e.preventDefault(); if (currentPage > 1) setPage(currentPage - 1) }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Prev
              </a>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const start = Math.max(1, currentPage - 2)
                const pNum = start + i
                if (pNum > totalPages) return null
                return pNum === currentPage ? (
                  <span key={pNum} className="na-pagination__active">{pNum}</span>
                ) : (
                  <a key={pNum} href="#" onClick={(e) => { e.preventDefault(); setPage(pNum) }}>{pNum}</a>
                )
              })}
              <a
                href="#"
                className={`na-pagination__next${currentPage >= totalPages ? ' na-pagination--disabled' : ''}`}
                onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setPage(currentPage + 1) }}
              >
                Next
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          )}
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