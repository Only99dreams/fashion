export default function TwoColSection() {
  return (
    <section className="two-col-section">
      <a href="/all-bags" className="two-col__item">
        <img
          src="https://picsum.photos/seed/wayshop/900/600"
          alt="Shop"
        />
        <div className="two-col__overlay">
          <p className="two-col__caption">Explore</p>
          <h2 className="two-col__heading">Ways to Shop</h2>
          <p className="two-col__text">Discover luxury finds curated just for you.</p>
          <span className="btn btn--white">Shop Now</span>
        </div>
      </a>
      <a href="/sell" className="two-col__item">
        <img
          src="https://picsum.photos/seed/waysell/900/600"
          alt="Sell"
        />
        <div className="two-col__overlay">
          <p className="two-col__caption">Explore</p>
          <h2 className="two-col__heading">Ways to Sell</h2>
          <p className="two-col__text">Turn your pre-loved pieces into cash.</p>
          <span className="btn btn--white">Sell Now</span>
        </div>
      </a>
    </section>
  )
}
