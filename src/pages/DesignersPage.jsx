const designers = [
  'Alaia', 'Alexander McQueen', 'Alexander Wang', 'Anita Ko', 'Audemars Piguet',
  'Balenciaga', 'Bottega Veneta', 'Boucheron', 'Breitling', 'Bulgari', 'Burberry',
  'Cartier', 'Celine', 'Chanel', 'Chloe', 'Chopard', 'Christian Dior', 'Christian Louboutin', 'Chrome Hearts',
  'Damiani', 'David Yurman', 'Delvaux', 'Dolce & Gabbana',
  'FASHIONPHILE', 'Fendi', 'Foundrae', 'Franck Muller',
  'Givenchy', 'Goyard', 'Graff', 'Gucci',
  'Harry Winston', 'Hermes', 'Hublot',
  'Irene Neuwirth', 'IWC',
  'Jacquemus', 'Jennifer Meyer', 'Jimmy Choo', 'John Hardy', 'Judith Leiber',
  'Khaite',
  'Lanvin', 'Loewe', 'Loro Piana', 'Louis Vuitton',
  'Mansur Gavriel', 'Marc Jacobs', 'Marco Bicego', 'MCM', 'Messika', 'Moynat', 'Mikimoto', 'Miu Miu', 'Mulberry',
  'Off-White', 'Oliver Peoples', 'Omega',
  'Panerai', 'Parker & West', 'Pasquale Bruni', 'Patek Philippe', '3.1 Phillip Lim', 'Piaget', 'Pomellato', 'Prada', 'Proenza Schouler',
  'Rimowa', 'Roberto Coin', 'Rolex',
  'Saint Laurent', 'Salvatore Ferragamo', 'Stella McCartney', 'Suzanne Kalan',
  'Tag Heuer', 'Telfar', 'Temple St. Clair', 'The Row', 'Tiffany', 'Tom Ford', 'TUDOR',
  'Valentino Garavani', 'Van Cleef & Arpels', 'Versace',
]

function slugify(name) {
  return name.toLowerCase().replace(/&/g, 'and').replace(/\./g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function DesignersPage() {
  return (
    <main className="new-arrivals">
      <section className="na-hero">
        <div className="na-hero__content">
          <h1 className="na-hero__title">Designers</h1>
          <p className="na-hero__subtitle">Browse authenticated luxury items from the world's most coveted designers.</p>
        </div>
      </section>
      <div className="na-layout">
        <div className="na-main">
          <div className="na-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {designers.map((d) => (
              <a
                key={d}
                href={'/designer/' + slugify(d)}
                className="header__dropdown-link"
                style={{ padding: '16px 20px', fontSize: '15px', background: '#f8f8f8', textAlign: 'center', borderRadius: '0', fontWeight: '500' }}
              >
                {d}
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
