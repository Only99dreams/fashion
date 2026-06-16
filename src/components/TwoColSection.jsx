const pexel = (id, w = 1200) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`

export default function TwoColSection() {
  return (
    <section className="two-col-section">
      <a href="/all-bags" className="two-col__item">
        <img
          src={pexel(16690455)}
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
          src={pexel(1058959)}
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
