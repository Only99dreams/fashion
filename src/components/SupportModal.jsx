import { useState, useEffect } from 'react'

const SEEN_KEY = 'faph_support_seen'
const TAWK_LINK = 'https://tawk.to/chat/6a2d37a3f0b5881c2ac3fa6a/1jr0a2m43'

function openTawkTo() {
  if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') {
    window.Tawk_API.maximize()
  } else {
    window.open(TAWK_LINK, '_blank')
  }
}

export default function SupportModal() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(SEEN_KEY)) {
      setVisible(true)
    }
  }, [])

  function handleContact() {
    openTawkTo()
    setVisible(false)
    try { localStorage.setItem(SEEN_KEY, '1') } catch {}
  }

  function dismiss() {
    setVisible(false)
    try { localStorage.setItem(SEEN_KEY, '1') } catch {}
  }

  if (!visible) return null

  return (
    <div className="modal-overlay" onClick={dismiss}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Need Help?</h2>
        <p className="modal-text">
          If you have any issues with your shopping experience, please don't hesitate to contact our customer support team. We're here to help!
        </p>
        <div className="modal-actions">
          <button className="btn btn--dark" onClick={handleContact}>Contact Support</button>
          <button className="btn btn--outline-dark" onClick={dismiss}>Continue Shopping</button>
        </div>
      </div>
    </div>
  )
}
