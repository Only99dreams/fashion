import ProductCard from './ProductCard'

export default function ProductGrid({ title, description, cta, href, products }) {
  const showHeader = title || description || cta
  return (
    <section className="section">
      {showHeader && (
        <div className="section-header">
          {title && <h2>{title}</h2>}
          {description && <p>{description}</p>}
          {cta && (
            <a href={href || '#'} className="btn btn--primary" style={{ display: 'inline-block', marginTop: '16px' }}>
              {cta}
            </a>
          )}
        </div>
      )}
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
