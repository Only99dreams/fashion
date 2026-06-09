export default function FullBanner({ tag, title, description, cta, href, img, tagColor }) {
  return (
    <div className="full-banner">
      <img src={img} alt={title} className="full-banner__img" />
      <div className="full-banner__content full-banner__content--center">
        {tag && (
          <p className="full-banner__tag" style={tagColor ? { color: tagColor } : {}}>
            {tag}
          </p>
        )}
        <h2 className="full-banner__title">{title}</h2>
        {description && <p className="full-banner__desc">{description}</p>}
        <a href={href || '#'} className="btn btn--white">{cta}</a>
      </div>
    </div>
  )
}
