import { useState, useEffect } from 'react'

export default function AnnouncementBar() {
  const [slide, setSlide] = useState(0)
  const messages = [
    { text: 'Buy Now, Pay Later with ', highlight: 'Affirm' },
    { text: 'Free Ground Shipping for Domestic Orders' },
  ]

  useEffect(() => {
    const t = setInterval(() => setSlide((p) => (p + 1) % messages.length), 6000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="utility-bar">
      <div className="utility-bar__left">
        <a href="/stores">Find a Location</a>
      </div>
      <div className="utility-bar__mid">
        <div className="utility-bar__slide" key={slide}>
          {messages[slide].highlight ? (
            <span>
              {messages[slide].text}<span className="highlight-pink">{messages[slide].highlight}</span>
            </span>
          ) : (
            <span>{messages[slide].text}</span>
          )}
        </div>
      </div>
      <div className="utility-bar__right">
        <span className="utility-bar__cta">
          Sell Now
          <div className="utility-bar__cta-dropdown">
            <a href="/sell">Sell Online</a>
            <a href="/stores">Sell in Person</a>
          </div>
        </span>
      </div>
    </div>
  )
}
