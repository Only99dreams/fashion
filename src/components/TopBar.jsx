export default function TopBar() {
  return (
    <div className="top-bar">
      <div className="top-bar__left">
        <a href="/sell" className="top-bar__link">Sell Now</a>
        <a href="/sell" className="top-bar__link">Sell Online</a>
        <a href="/stores" className="top-bar__link">Sell in Person</a>
      </div>
      <div className="top-bar__right">
        <a href="/account" className="top-bar__link">Wishlist (0)</a>
        <a href="/account" className="top-bar__link">Sign In</a>
        <a href="/help" className="top-bar__link">United States | USD $</a>
      </div>
    </div>
  )
}
