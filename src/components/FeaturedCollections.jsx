const pexel = (id, w = 480) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`

const collections = [
  {
    title: 'Over 50% Off Retail',
    desc: 'Score and up your game.',
    cta: 'Shop Luxe Deals',
    href: '/sale',
    img: pexel(16690455),
  },
  {
    title: "Editor's Picks",
    desc: 'Breakout stars and fan favorites.',
    cta: 'Shop Most Popular',
    href: '/all-bags',
    img: pexel(27174565),
  },
  {
    title: 'Light and Airy',
    desc: 'The forecast is raffia.',
    cta: 'Shop Raffia',
    href: '/all-bags',
    img: pexel(6044266),
  },
]

export default function FeaturedCollections() {
  return (
    <section className="featured-collections">
      <h3 className="featured-collections__heading">Featured Collections</h3>
      <div className="featured-collections__grid">
        {collections.map((col, i) => (
          <a key={i} href={col.href} className="featured-col__card">
            <img src={col.img} alt={col.title} className="featured-col__image" />
            <h4 className="featured-col__title">{col.title}</h4>
            <p className="featured-col__desc">{col.desc}</p>
            <span className="featured-col__cta">{col.cta}</span>
          </a>
        ))}
      </div>
    </section>
  )
}
