import { useMemo } from 'react'
import ProductCard from '../components/ProductCard'
import products from '../data/products'

const heroImages = {
  Bags: 'https://images.unsplash.com/photo-1491637639811-1e2756d1cd62?w=1920&q=85',
  Shoes: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1920&q=85',
  Accessories: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=1920&q=85',
  Jewelry: 'https://images.unsplash.com/photo-1515562141589-6773d0b1c5c0?w=1920&q=85',
  Watches: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1920&q=85',
}

const filters = [
  { name: 'Designer', options: ['Chanel', 'Hermes', 'Louis Vuitton', 'Gucci', 'Prada', 'Saint Laurent', 'Bottega Veneta', 'Dior', 'Fendi', 'Celine'] },
  { name: 'Condition', options: ['Excellent', 'Very Good', 'Good', 'Shows Wear'] },
  { name: 'Price Range', options: ['Under $500', '$500 - $1,000', '$1,000 - $2,500', '$2,500 - $5,000', '$5,000 - $10,000', '$10,000+'] },
  { name: 'Size', options: ['Mini', 'Small', 'Medium', 'Large', 'Extra Large'] },
  { name: 'Color', options: ['Black', 'Brown', 'Beige', 'Red', 'Blue', 'Green', 'Pink', 'Purple', 'White', 'Gold'] },
]

export default function CollectionPage({ category }) {
  const categoryProducts = useMemo(
    () => products.filter((p) => p.category === category),
    [category]
  )

  return (
    <main className="new-arrivals">
      <section className="ab-hero">
        <div className="ab-hero__bg">
          <img src={heroImages[category] || 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=1920&q=85'} alt="" />
        </div>
        <div className="ab-hero__content">
          <h1 className="ab-hero__title">{category}</h1>
          <p className="ab-hero__subtitle">Shop authenticated pre-owned {category.toLowerCase()} at FASHIONPHILE.</p>
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
            <p className="na-toolbar__count">{categoryProducts.length} Products</p>
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

          {categoryProducts.length === 0 ? (
            <div className="na-empty">
              <p>No {category} products available right now. Check back soon!</p>
            </div>
          ) : (
            <div className="na-grid">
              {categoryProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          <div className="na-pagination">
            <span className="na-pagination__active">1</span>
            <a href="#" className="na-pagination__next">
              Next
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
