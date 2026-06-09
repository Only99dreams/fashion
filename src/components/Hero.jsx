export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__media">
        <img
          src="/hero.jpg"
          alt="FASHIONPHILE x CARDI B"
          className="hero__image"
        />
      </div>
      <div className="hero__content">
        <div className="hero__box">
          <p className="hero__tag">FASHIONPHILE x CARDI B</p>
          <h1 className="hero__heading">GET YOUR BAG</h1>
          <div className="hero__buttons">
            <a href="/new-arrivals" className="btn btn--dark">Shop Now</a>
            <a href="/sell" className="btn btn--outline-dark">Sell Now</a>
          </div>
        </div>
      </div>
    </section>
  )
}
