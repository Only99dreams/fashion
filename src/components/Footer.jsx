export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__main">
        <div className="footer__left">
          <div className="footer__brand">
            <img src="/logo.jpg" alt="FASHIONPHILE" style={{ height: '24px', width: 'auto', filter: 'brightness(10)' }} />
          </div>
          <div className="footer__newsletter">
            <h5>Join Our Circle</h5>
            <div className="footer__newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit" aria-label="Subscribe">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
          <div className="footer__social">
            <h6>Follow Us</h6>
            <div className="footer__social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">TikTok</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">Pinterest</a>
            </div>
          </div>
          <div className="footer__apps">
            <h6>Download the App</h6>
            <div className="footer__apps-badges">
              <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className="footer__app-btn">
                <svg width="120" height="40" viewBox="0 0 120 40" fill="none">
                  <rect width="120" height="40" rx="4" fill="#35383a"/>
                  <text x="60" y="24" textAnchor="middle" fill="white" fontSize="10" fontFamily="Inter,sans-serif" fontWeight="600">App Store</text>
                </svg>
              </a>
              <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" className="footer__app-btn">
                <svg width="120" height="40" viewBox="0 0 120 40" fill="none">
                  <rect width="120" height="40" rx="4" fill="#35383a"/>
                  <text x="60" y="24" textAnchor="middle" fill="white" fontSize="10" fontFamily="Inter,sans-serif" fontWeight="600">Google Play</text>
                </svg>
              </a>
            </div>
            <p className="footer__apps-tm">Android and Google Play are trademarks of Google LLC.</p>
          </div>
        </div>
        <div className="footer__right">
          <div className="footer__links">
            <div className="footer__col">
              <h6>Customer Service</h6>
              <a href="/help">Contact Us</a>
              <a href="/account">My Account</a>
              <a href="/orders">My Orders</a>
              <a href="/help">Alerts</a>
              <a href="/help">Shipping</a>
              <a href="/help">Returns</a>
              <a href="/help">FAQ</a>
              <a href="/help">Give Us Feedback</a>
            </div>
            <div className="footer__col">
              <h6>Sell with Us</h6>
              <a href="/sell">Ways to Sell</a>
              <a href="/sell">Submit an Item</a>
              <a href="/sell">Refresh Program</a>
              <a href="/sell">Designer Directory</a>
              <a href="/sell">Consignment</a>
              <a href="/sale">Sold Items</a>
            </div>
            <div className="footer__col">
              <h6>Shop with Us</h6>
              <a href="/all-bags">Ways to Shop</a>
              <a href="/help">Authenticity</a>
              <a href="/help">FASHIONPHILE Certified</a>
              <a href="/sale">Luxury Sales</a>
              <a href="/sell">Gift Cards</a>
              <a href="/help">Personal Shopping</a>
              <a href="/sell">Reserve Luxury Layaway</a>
              <a href="/help">Subscribe to Newsletter</a>
            </div>
            <div className="footer__col">
              <h6>About Us</h6>
              <a href="/about">About</a>
              <a href="/stores">Locations</a>
              <a href="/about">FASHIONPHILE Blog</a>
              <a href="/about">FASHIONPHILE Gives Back</a>
              <a href="/about">Careers</a>
              <a href="/about">Sustainability</a>
              <a href="/about">Influencer Program</a>
              <a href="/about">Partner Program</a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <div className="footer__legal">
          <a href="/help">Accessibility Statement</a>
          <a href="/help">Privacy Policy</a>
          <a href="/help">Privacy Request Portal</a>
          <a href="/help">Seller Terms</a>
          <a href="/help">Terms of Use</a>
          <a href="/help">Your Privacy Choices</a>
        </div>
        <span className="footer__copy">© 2026 Fashionphile Group, LLC</span>
        <div className="footer__partners">
          <span className="footer__partner">Neiman Marcus</span>
          <span className="footer__partner">B Corp</span>
        </div>
      </div>
    </footer>
  )
}
