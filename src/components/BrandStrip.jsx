function slugify(name) {
  return name.toLowerCase().replace(/&/g, 'and').replace(/\./g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const brands = [
  {
    name: 'Chanel', logo: 'CHANEL',
    href: '/designer/chanel',
  },
  {
    name: 'Hermes', logo: 'HERMÈS',
    href: '/designer/hermes',
  },
  {
    name: 'Louis Vuitton', logo: 'LOUIS VUITTON',
    href: '/designer/louis-vuitton',
  },
  {
    name: 'Gucci', logo: 'GUCCI',
    href: '/designer/gucci',
  },
  {
    name: 'Christian Dior', logo: 'DIOR',
    href: '/designer/christian-dior',
  },
  {
    name: 'Cartier', logo: 'CARTIER',
    href: '/designer/cartier',
  },
  {
    name: 'Saint Laurent', logo: 'SAINT LAURENT',
    href: '/designer/saint-laurent',
  },
  {
    name: 'Bottega Veneta', logo: 'BOTTEGA VENETA',
    href: '/designer/bottega-veneta',
  },
  {
    name: 'Fendi', logo: 'FENDI',
    href: '/designer/fendi',
  },
  {
    name: 'Prada', logo: 'PRADA',
    href: '/designer/prada',
  },
]

export default function BrandStrip() {
  return (
    <>
      <div className="section-divider" />
      <div className="brand-strip">
        {brands.map((brand, i) => (
          <a key={i} href={brand.href} className="brand-strip__link" title={brand.name}>
            <span className="brand-strip__logo">{brand.logo}</span>
          </a>
        ))}
      </div>
      <div className="section-divider" />
    </>
  )
}
