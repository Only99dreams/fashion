const products = [
  { id: 1, brand: 'Hermes', name: 'Togo Birkin 30 Gold', price: '$12,450', was: '$14,500', off: '14% off', img: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=480&q=80' },
  { id: 2, brand: 'Rolex', name: 'Submariner Date Black 41mm', price: '$14,950', was: '$17,500', off: '15% off', img: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=480&q=80' },
  { id: 3, brand: 'Chanel', name: 'Cavior Quilted Medium Classic Flap Black', price: '$8,995', was: '$10,500', off: '14% off', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=480&q=80' },
  { id: 4, brand: 'Cartier', name: 'Love Bracelet Small Model Yellow Gold', price: '$4,850', was: '$5,600', off: '13% off', img: 'https://images.unsplash.com/photo-1535632066927-ab7c8ab60908?w=480&q=80' },
  { id: 5, brand: 'Louis Vuitton', name: 'Monogram Neverfull GM Damier Ebene', price: '$1,895', was: '$2,200', off: '14% off', img: 'https://images.unsplash.com/photo-1564372427378-58eaf2d91d7b?w=480&q=80' },
  { id: 6, brand: 'Gucci', name: 'GG Marmont Small Shoulder Bag Black', price: '$1,495', was: '$1,890', off: '21% off', img: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=480&q=80' },
  { id: 7, brand: 'Prada', name: 'Saffiano Lux Medium Galleria Nude', price: '$2,250', img: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=480&q=80' },
  { id: 8, brand: 'Saint Laurent', name: 'Lambskin Small Loulou Black', price: '$1,895', was: '$2,350', off: '19% off', img: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=480&q=80' },
]

export default function InvestmentProducts() {
  return (
    <section className="investment-products">
      <div className="scrollable-grid__header" style={{ padding: '16px 24px', maxWidth: 'var(--page-width)', margin: '0 auto' }}>
        <h3 className="scrollable-grid__title">Investment Pieces</h3>
        <p className="scrollable-grid__desc">Timeless luxury that holds its value.</p>
      </div>
      <div className="bags-sale__carousel">
        {products.map((p) => (
          <a key={p.id} href={'/product/' + p.id} className="product-card">
            <div className="product-card__image">
              <img src={p.img} alt={p.name} />
              {p.off && <span className="product-card__badge">{p.off}</span>}
            </div>
            <div className="product-card__info">
              <p className="product-card__vendor">{p.brand}</p>
              <p className="product-card__name">{p.name}</p>
              <div className="product-card__pricing">
                <span className="product-card__price">{p.price}</span>
                {p.was && <span className="product-card__orig-price">{p.was}</span>}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}