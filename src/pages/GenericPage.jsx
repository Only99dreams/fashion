export default function GenericPage({ title, desc, children }) {
  return (
    <main className="new-arrivals">
      <section className="na-hero" style={{ background: '#f8f8f8' }}>
        <div className="na-hero__content">
          <h1 className="na-hero__title" style={{ fontSize: '36px' }}>{title}</h1>
          {desc && <p className="na-hero__subtitle">{desc}</p>}
        </div>
      </section>
      <div className="generic-content">
        {children || (
          <div className="na-empty">
            <p>This page is coming soon. Check back for updates!</p>
            <a href="/" className="btn btn--dark" style={{ marginTop: '16px', display: 'inline-flex' }}>Back to Home</a>
          </div>
        )}
      </div>
    </main>
  )
}
