import { useState } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="cookie-banner">
      <div className="cookie-banner__content">
        <h6>We Value Your Privacy</h6>
        <p>
          FASHIONPHILE uses cookies to give you the best shopping experience. By continuing, you agree to our use of cookies. Please see our <a href="/help" style={{textDecoration:'underline',color:'inherit'}}>Privacy Policy</a>.
        </p>
      </div>
      <button className="cookie-banner__close" onClick={() => setVisible(false)}>
        Accept
      </button>
    </div>
  )
}
