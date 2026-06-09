import { useState, useMemo } from 'react'
import ProductCard from '../components/ProductCard'
import products from '../data/products'

const PAGE_SIZE = 12

const filterConfig = [
  { name: 'Category', key: 'category', options: ['Bags', 'Shoes', 'Accessories', 'Jewelry', 'Watches'] },
  { name: 'Designer', key: 'brand', options: ['Chanel', 'Hermes', 'Louis Vuitton', 'Gucci', 'Prada', 'Saint Laurent', 'Bottega Veneta', 'Dior', 'Fendi', 'Celine'] },
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

function matchesPriceRange(price, range) {
  if (!range) return true
  const [min, max] = range
  return price >= min && price < max
}

export default function NewArrivals() {
  const [selectedFilters, setSelectedFilters] = useState({})
  const [sort, setSort] = useState('Featured')
  const [page, setPage] = useState(1)

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
    let result = [...products]

    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (!values || values.length === 0) return
      if (key === 'priceRange') {
        result = result.filter((p) =>
          values.some((v) => {
            const range = parsePriceRange(v)
            return range && matchesPriceRange(p.price, range)
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
  }, [selectedFilters, sort])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const currentPage = Math.min(page, totalPages || 1)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <main className="new-arrivals">
      <section className="na-hero">
        <div className="na-hero__content">
          <h1 className="na-hero__title">New Arrivals</h1>
          <p className="na-hero__subtitle">Shop the latest pre-owned luxury designs added to our collection.</p>
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
            <p className="na-toolbar__count">{filtered.length} Product{filtered.length !== 1 ? 's' : ''}</p>
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

          {paginated.length === 0 ? (
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
                const rangeLen = Math.min(totalPages, 5)
                const start = Math.max(1, Math.min(currentPage - 2, totalPages - rangeLen + 1))
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
    </main>
  )
}
