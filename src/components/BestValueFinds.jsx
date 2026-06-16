const pexel = (id, w = 480) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`

const items = [
  { label: 'Shop Bags', href: '/all-bags', img: pexel(16690455) },
  { label: 'Shop Sale', href: '/sale', img: pexel(1058959) },
  { label: 'Shop Jewelry', href: '/jewelry', img: pexel(19646999) },
  { label: 'Shop Accessories', href: '/accessories', img: pexel(6044266) },
  { label: 'Shop Shoes', href: '/shoes', img: pexel(3916017) },
]

export default function BestValueFinds() {
  return (
    <div className="scrollable-grid">
      <div className="scrollable-grid__header">
        <h3 className="scrollable-grid__title">Best Value Finds</h3>
        <p className="scrollable-grid__desc">Over 15% off retail, plus an extra 10% off or more.</p>
      </div>
      <div className="scrollable-grid__items">
        {items.map((item, i) => (
          <a key={i} href={item.href} className="scrollable-grid__item scrollable-grid__item--btn">
            <img src={item.img} alt={item.label} />
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
