const TAWK_LINK = 'https://tawk.to/chat/6a2d37a3f0b5881c2ac3fa6a/1jr0a2m43'

function openTawkTo() {
  if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') {
    window.Tawk_API.maximize()
  } else {
    window.open(TAWK_LINK, '_blank')
  }
}

export default function SupportButton() {
  return (
    <button className="support-button" title="Contact Customer Support" onClick={openTawkTo}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <span>Support</span>
    </button>
  )
}
