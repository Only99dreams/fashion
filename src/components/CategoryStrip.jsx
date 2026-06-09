const categoryLinks = {
  'Chanel': '/designer/chanel',
  'Hermes': '/designer/hermes',
  'Louis Vuitton': '/designer/louis-vuitton',
  'Jewelry': '/jewelry',
  'Watches': '/watches',
  'Gucci': '/designer/gucci',
}

export default function CategoryStrip() {
  const categories = [
    'Chanel', 'Hermes', 'Louis Vuitton', 'Jewelry', 'Watches', 'Gucci'
  ]

  return (
    <div className="category-strip">
      {categories.map((cat, i) => (
        <a key={i} href={categoryLinks[cat] || '#'} className="category-strip__link">{cat}</a>
      ))}
    </div>
  )
}
