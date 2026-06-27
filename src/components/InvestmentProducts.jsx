const pexel = (id, w = 480) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`

const products = [
  { id: 1, brand: 'Hermes', name: 'Togo Birkin 30 Gold', price: '$12,450', was: '$14,500', off: '14% off', img: pexel(16690455) },
  { id: 2, brand: 'Rolex', name: 'Submariner Date Black 41mm', price: '$14,950', was: '$17,500', off: '15% off', img: pexel(380782) },
  { id: 3, brand: 'Chanel', name: 'Cavior Quilted Medium Classic Flap Black', price: '$8,995', was: '$10,500', off: '14% off', img: pexel(27174565) },
  { id: 4, brand: 'Cartier', name: 'Love Bracelet Small Model Yellow Gold', price: '$4,850', was: '$5,600', off: '13% off', img: pexel(12194325) },
  { id: 5, brand: 'Louis Vuitton', name: 'Monogram Neverfull GM Damier Ebene', price: '$1,895', was: '$2,200', off: '14% off', img: pexel(1058959) },
  { id: 6, brand: 'Gucci', name: 'GG Marmont Small Shoulder Bag Black', price: '$1,495', was: '$1,890', off: '21% off', img: pexel(6044266) },
  { id: 7, brand: 'Prada', name: 'Saffiano Lux Medium Galleria Nude', price: '$2,250', img: pexel(3775120) },
  { id: 8, brand: 'Saint Laurent', name: 'Lambskin Small Loulou Black', price: '$1,895', was: '$2,350', off: '19% off', img: pexel(1058959) },
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
              <img src={p.img} alt={p.name} loading="lazy" />
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