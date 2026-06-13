import { useState, useRef, useCallback, useEffect } from 'react'
import { useCart } from '../context/CartContext'

function slugify(name) {
  return name.toLowerCase().replace(/&/g, 'and').replace(/\./g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

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

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [customLogo, setCustomLogo] = useState('')
  const hideTimer = useRef(null)
  const { totalItems } = useCart()

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('fp_admin_branding') || '{}')
      if (saved.logo) setCustomLogo(saved.logo)
    } catch {}
  }, [])

  const show = useCallback((name) => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    setActiveDropdown(name)
  }, [])

  const scheduleHide = useCallback(() => {
    hideTimer.current = setTimeout(() => setActiveDropdown(null), 200)
  }, [])

  const cancelHide = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
  }, [])

  const nav = [
    { label: 'New Arrivals', href: '/new-arrivals', highlight: true },
    { label: 'Designers', hasDropdown: true, dropdownContent: 'designers' },
    { label: 'Bags', href: '/all-bags', hasDropdown: true, dropdownContent: 'bags' },
    { label: 'Shoes', href: '/shoes', hasDropdown: true, dropdownContent: 'shoes' },
    { label: 'Accessories', href: '/accessories', hasDropdown: true, dropdownContent: 'accessories' },
    { label: 'Jewelry', href: '/jewelry', hasDropdown: true, dropdownContent: 'jewelry' },
    { label: 'Watches', href: '/watches', hasDropdown: true, dropdownContent: 'watches' },
  ]

  function renderDropdown(item) {
    if (item.dropdownContent === 'designers') {
      return (
        <div className="header__dropdown" onMouseEnter={cancelHide} onMouseLeave={scheduleHide}>
          <div className="header__dropdown-inner">
            <a href="/all-bags" className="header__dropdown-shop-all">Shop All Designers</a>
            <div className="header__dropdown-grid">
              {designers.map((d) => (
                <a key={d} href={'/designer/' + slugify(d)} className="header__dropdown-link">{d}</a>
              ))}
            </div>
          </div>
        </div>
      )
    }
    if (item.dropdownContent === 'bags') {
      return (
        <div className="header__dropdown" onMouseEnter={cancelHide} onMouseLeave={scheduleHide}>
          <div className="header__dropdown-inner">
            <div className="header__dropdown-cols">
              <div className="header__dropdown-col">
                <a href="/all-bags" className="header__dropdown-shop-all">Shop All Bags</a>
                <div className="header__dropdown-list">
                  {['Backpacks','Belt Bags','Bucket Bags','Clutches & Evening Bags','Crossbody','East West','Handbags','Hobo Bags',"Men's Bags",'Professional','Shoulder Bags','Top Handles','Totes','Travel & Luggage','Wallet Style'].map((s) => (
                    <a key={s} href="/all-bags" className="header__dropdown-link">{s}</a>
                  ))}
                </div>
              </div>
              <div className="header__dropdown-col">
                <a href="/all-bags" className="header__dropdown-shop-all">Shop By Price</a>
                <div className="header__dropdown-list">
                  {['Best Value','Under $500','Under $1,000','Under $2,000'].map((p) => (
                    <a key={p} href="/all-bags" className="header__dropdown-link">{p}</a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    if (item.dropdownContent === 'accessories') {
      return (
        <div className="header__dropdown" onMouseEnter={cancelHide} onMouseLeave={scheduleHide}>
          <div className="header__dropdown-inner">
            <div className="header__dropdown-cols">
              <div className="header__dropdown-col">
                <a href="/accessories" className="header__dropdown-shop-all">Shop All Accessories</a>
                <div className="header__dropdown-list">
                  {['Agendas','Bag Charms','Belts','Cosmetic Cases','Extra Bag Straps','FASHIONPHILE Merchandise','Gloves','Hair Accessories','Hats','Key Rings','Lifestyle','Luggage Tags','Pet Accessories','Phone & Tablet Cases','Pins & Brooches','Pouches','Scarves','Sunglasses','Wallets'].map((s) => (
                    <a key={s} href="/accessories" className="header__dropdown-link">{s}</a>
                  ))}
                </div>
              </div>
              <div className="header__dropdown-col">
                <a href="/accessories" className="header__dropdown-shop-all">Investment Protection Collection</a>
                <div className="header__dropdown-list">
                  <a href="/accessories" className="header__dropdown-link">View the Collection</a>
                  {['Handbag Hook','Handbag Protector Pouch','Handbag Wipes','Mending & Repairs Kit','ReNew Handbag Cleaning Kit','x SoulCycle Sweat Bag'].map((s) => (
                    <a key={s} href="/accessories" className="header__dropdown-link">{s}</a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    if (item.dropdownContent === 'shoes') {
      return (
        <div className="header__dropdown" onMouseEnter={cancelHide} onMouseLeave={scheduleHide}>
          <div className="header__dropdown-inner">
            <div className="header__dropdown-cols">
              <div className="header__dropdown-col">
                <a href="/shoes" className="header__dropdown-shop-all">Shop All Shoes</a>
                <div className="header__dropdown-list">
                  {['Boots & Booties','Flats','Pumps','Sandals','Sneakers'].map((s) => (
                    <a key={s} href="/shoes" className="header__dropdown-link">{s}</a>
                  ))}
                </div>
              </div>
              <div className="header__dropdown-col">
                <a href="/shoes" className="header__dropdown-shop-all">Top Designers</a>
                <div className="header__dropdown-list">
                  {['Chanel','Christian Louboutin','Gucci','Hermes','Louis Vuitton','Christian Dior'].map((s) => (
                    <a key={s} href={'/designer/' + slugify(s)} className="header__dropdown-link">{s}</a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    if (item.dropdownContent === 'jewelry') {
      return (
        <div className="header__dropdown" onMouseEnter={cancelHide} onMouseLeave={scheduleHide}>
          <div className="header__dropdown-inner">
            <div className="header__dropdown-cols">
              <div className="header__dropdown-col">
                <a href="/jewelry" className="header__dropdown-shop-all">Shop All Jewelry</a>
                <div className="header__dropdown-list">
                  {['Bracelets','Earrings','Necklaces','Rings','Fine Jewelry','Parker & West'].map((s) => (
                    <a key={s} href="/jewelry" className="header__dropdown-link">{s}</a>
                  ))}
                </div>
              </div>
              <div className="header__dropdown-col">
                <a href="/jewelry" className="header__dropdown-shop-all">Top Designers</a>
                <div className="header__dropdown-list">
                  {['Cartier','Chanel','David Yurman','Hermes','Tiffany','Van Cleef & Arpels'].map((s) => (
                    <a key={s} href={'/designer/' + slugify(s)} className="header__dropdown-link">{s}</a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    if (item.dropdownContent === 'watches') {
      return (
        <div className="header__dropdown" onMouseEnter={cancelHide} onMouseLeave={scheduleHide}>
          <div className="header__dropdown-inner">
            <div className="header__dropdown-cols">
              <div className="header__dropdown-col">
                <a href="/watches" className="header__dropdown-shop-all">Shop All Watches</a>
                <div className="header__dropdown-list">
                  {['Fashion Watches','Luxury Watches',"Women's Watches","Men's Watches"].map((s) => (
                    <a key={s} href="/watches" className="header__dropdown-link">{s}</a>
                  ))}
                </div>
              </div>
              <div className="header__dropdown-col">
                <a href="/watches" className="header__dropdown-shop-all">Top Designers</a>
                <div className="header__dropdown-list">
                  {['Audemars Piguet','Cartier','Hublot','Omega','Rolex','Tiffany'].map((s) => (
                    <a key={s} href={'/designer/' + slugify(s)} className="header__dropdown-link">{s}</a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  const mobileNavLinks = [
    { label: 'New Arrivals', href: '/new-arrivals' },
    { label: 'Bags', href: '/all-bags' },
    { label: 'Shoes', href: '/shoes' },
    { label: 'Accessories', href: '/accessories' },
    { label: 'Jewelry', href: '/jewelry' },
    { label: 'Watches', href: '/watches' },
  ]

  const [searchQuery, setSearchQuery] = useState('')

  function handleSearch(e) {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.history.pushState(null, '', '/all-bags?q=' + encodeURIComponent(searchQuery.trim()))
      window.dispatchEvent(new CustomEvent('app:navigate', { detail: 'all-bags' }))
    }
  }

  return (
    <div className="header-wrapper">
      <header className="header">
        <div className="header__left">
          <button
            className={`header__mobile-btn${mobileOpen ? ' header__mobile-btn--open' : ''}`}
            aria-label="Menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
          <a href="/" className="header__logo">FASHIONPHILE</a>
        </div>
        <nav className={`header__nav${mobileOpen ? ' header__nav--open' : ''}`}>
          {nav.map((item, i) => (
            <div
              key={i}
              className={`header__nav-item-wrapper${item.hasDropdown ? ' header__nav-item-wrapper--dropdown' : ''}${activeDropdown === item.label ? ' header__nav-item-wrapper--active' : ''}`}
              onMouseEnter={() => item.hasDropdown && show(item.label)}
              onMouseLeave={item.hasDropdown ? scheduleHide : undefined}
            >
              <a
                href={item.href || "#"}
                className={`header__nav-item${item.highlight ? ' header__nav-item--new' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
                {item.hasDropdown && (
                  <svg width="8" height="5" viewBox="0 0 8 5" fill="none" className="header__nav-caret">
                    <path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </a>
              {item.hasDropdown && activeDropdown === item.label && renderDropdown(item)}
            </div>
          ))}
          {mobileOpen && (
            <div className="header__mobile-nav">
              {mobileNavLinks.map((link) => (
                <a key={link.label} href={link.href} className="header__mobile-nav-link" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </a>
              ))}
              <a href="/orders" className="header__mobile-nav-link" onClick={() => setMobileOpen(false)}>
                Order History
              </a>
              <a href="/admin/login" className="header__mobile-nav-link header__mobile-nav-link--admin" onClick={() => setMobileOpen(false)}>
                Admin
              </a>
            </div>
          )}
        </nav>
        <div className="header__right">
          <a href="/all-bags" className="header__icon" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </a>
          <a href="/account" className="header__icon" aria-label="Account">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/>
            </svg>
          </a>
          <a href="/cart" className="header__icon" aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            {totalItems > 0 && <span className="header__cart-count">{totalItems}</span>}
          </a>
        </div>
      </header>
      <form className="header__mobile-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search bags, accessories, designers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" aria-label="Search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
      </form>
    </div>
  )
}
