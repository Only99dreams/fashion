const pexel = (id, w = 480) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`

const products = [
  { id: 1, brand: 'Chanel', name: 'Caviar Quilted Top Handle Slim Vanity With Chain Red', condition: 'Excellent', conditionLabel: 'Condition: Excellent', price: '$5,035', was: '$6,295', off: '20% off', img: pexel(13924894) },
  { id: 2, brand: 'Hermes', name: 'Togo Videpoches Orange', condition: 'Excellent', conditionLabel: 'Condition: Excellent', price: '$3,620', was: '$4,025', off: '10% off', retail: 'Est. $3,775 • 4% below retail', img: pexel(16690455) },
  { id: 3, brand: 'Hermes', name: 'Taurillon Clemence Verso Mini Lindy 20 Jaune Poussin Craie', condition: 'Excellent', conditionLabel: 'Condition: Excellent', price: '$8,135', was: '$10,170', off: '20% off', retail: 'Est. $9,050 • 10% below retail', img: pexel(22432984) },
  { id: 4, brand: 'Balenciaga', name: 'Extra Supple Calfskin Crocodile Embossed Le Cagole Mini Purse With Chain Acid Green', condition: 'Excellent', conditionLabel: 'Condition: Excellent', price: '$855', was: '$950', off: '10% off', retail: 'Est. $1,400 • 39% below retail', img: pexel(22432995) },
  { id: 5, brand: 'Hermes', name: 'Taurillon Clemence Evelyne III GM Bleu Electrique', condition: 'Shows Wear', conditionLabel: 'Condition: Shows Wear', price: '$3,185', was: '$3,355', off: '5% off', retail: 'Est. $3,750 • 15% below retail', img: pexel(27174565) },
  { id: 6, brand: 'Chanel', name: 'Lambskin Quilted Mini Top Handle Rectangular Flap Light Purple', condition: 'Shows Wear', conditionLabel: 'Condition: Shows Wear', price: '$4,935', was: '$5,195', off: '5% off', retail: 'Est. $5,600 • 12% below retail', img: pexel(22432983) },
  { id: 7, brand: 'Hermes', name: 'Taurillon Clemence Picotin Lock 22 MM Black', condition: 'Excellent', conditionLabel: 'Condition: Excellent', price: '$5,230', was: '$5,505', off: '5% off', img: pexel(22432986) },
  { id: 8, brand: 'Saint Laurent', name: 'Lambskin Chevron Quilted Mini Loulou Hortensia', condition: 'Excellent', conditionLabel: 'Condition: Excellent', price: '$1,935', was: '$2,035', off: '5% off', retail: 'Est. $2,000 • 3% below retail', img: pexel(6044266) },
  { id: 9, brand: 'Telfar', name: 'Vegan Leather Small Shopping Bag Pool Blue', condition: 'Shows Wear', conditionLabel: 'Condition: Shows Wear', price: '$155', was: '$225', off: '31% off', img: pexel(5926240) },
  { id: 10, brand: 'Bottega Veneta', name: 'Nappa Intrecciato Long Andiamo Top Handle Clutch Rose', condition: 'Excellent', conditionLabel: 'Condition: Excellent', price: '$2,855', was: '$3,175', off: '10% off', retail: 'Est. $3,500 • 18% below retail', img: pexel(3775120) },
  { id: 11, brand: 'Gucci', name: 'GG Marmont Matelassé Mini Bag White', condition: 'Excellent', conditionLabel: 'Condition: Excellent', price: '$1,250', was: '$1,890', off: '34% off', retail: 'Est. $1,890 • 34% below retail', img: pexel(16154672) },
  { id: 12, brand: 'Louis Vuitton', name: 'Monogram Speedy Bandoulière 25 Brown', condition: 'Very Good', conditionLabel: 'Condition: Very Good', price: '$1,450', was: '$1,890', off: '23% off', retail: 'Est. $1,890 • 23% below retail', img: pexel(1058959) },
  { id: 13, brand: 'Prada', name: 'Re-Edition 2000 Mini Bag Nylon Black', condition: 'Excellent', conditionLabel: 'Condition: Excellent', price: '$1,650', was: '$2,050', off: '20% off', img: pexel(13572540) },
  { id: 14, brand: 'Chanel', name: 'Lambskin Quilted Medium Classic Flap Black', condition: 'Excellent', conditionLabel: 'Condition: Excellent', price: '$8,995', was: '$10,500', off: '14% off', retail: 'Est. $10,500 • 14% below retail', img: pexel(22432987) },
  { id: 15, brand: 'Celine', name: 'Medium Triomphe Canvas & Calfskin Boston Bag', condition: 'Excellent', conditionLabel: 'Condition: Excellent', price: '$2,450', was: '$3,200', off: '23% off', img: pexel(22432988) },
]

export default function BagsOnSale() {
  return (
    <section className="bags-sale">
      <div className="bags-sale__header">
        <h4 className="bags-sale__title">Bags on Sale</h4>
        <p className="bags-sale__desc">Every luxury lover's dream. <a href="/sale">Shop Sale</a></p>
      </div>
      <div className="bags-sale__carousel">
        {products.map((p) => (
          <div key={p.id} className="product-card">
            <div className="product-card__image">
              <img src={p.img} alt={p.name} loading="lazy" />
              <button className="product-card__wishlist" aria-label="Wishlist">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                </svg>
              </button>
              {p.off && <span className="product-card__badge">{p.off}</span>}
            </div>
            <div className="product-card__info">
              <p className="product-card__vendor">{p.brand}</p>
              <p className="product-card__name">{p.name}</p>
              <p className="product-card__condition">{p.conditionLabel || p.condition}</p>
              <div className="product-card__pricing">
                <span className="product-card__price">{p.price}</span>
                {p.was && <span className="product-card__orig-price">{p.was}</span>}
              </div>
              {p.retail && <p className="product-card__retail">{p.retail}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
