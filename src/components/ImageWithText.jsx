export default function ImageWithText({ caption, title, desc, cta, href, img, reverse, desktopBg, compact }) {
  return (
    <section className="image-text" style={desktopBg ? { '--desktop-bg': desktopBg } : {}}>
      <div className={`image-text__inner${reverse ? ' image-text__inner--reverse' : ''}`}
        style={{ background: desktopBg || 'transparent' }}
      >
        <div className="image-text__media">
          <img src={img} alt={title} />
        </div>
        <div className={`image-text__content${!reverse ? ' image-text__content--left' : ''}`}
          style={compact ? { padding: '12px 40px' } : {}}
        >
          {caption && <p className="image-text__caption">{caption}</p>}
          <h2 className="image-text__title" style={compact ? { fontSize: '24px' } : {}}>{title}</h2>
          {desc && <p className="image-text__desc">{desc}</p>}
          <a href={href || '#'} className="btn btn--outline-dark">{cta}</a>
        </div>
      </div>
    </section>
  )
}
