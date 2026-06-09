const items = [
  { label: 'Shop Bags', href: '/all-bags', img: 'https://picsum.photos/seed/bags/400/400' },
  { label: 'Shop Sale', href: '/sale', img: 'https://picsum.photos/seed/sale/400/400' },
  { label: 'Shop Jewelry', href: '/jewelry', img: 'https://picsum.photos/seed/jewelry/400/400' },
  { label: 'Shop Accessories', href: '/accessories', img: 'https://picsum.photos/seed/accessories/400/400' },
  { label: 'Shop Shoes', href: '/shoes', img: 'https://picsum.photos/seed/shoesss/400/400' },
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
