function PageVisualStack({
  primary,
  primaryAlt,
  primaryCaption,
  secondary,
  secondaryAlt,
  secondaryCaption,
  className = '',
}) {
  const hasSecondary = Boolean(secondary)

  return (
    <div
      className={`page-visual-stack ${hasSecondary ? '' : 'page-visual-stack--single'} ${className}`.trim()}
    >
      <figure className="page-visual-stack__figure page-visual-stack__figure--primary">
        <img
          alt={primaryAlt}
          className="page-visual-stack__image"
          decoding="async"
          src={primary}
        />
        {primaryCaption ? (
          <figcaption className="page-visual-stack__caption">
            {primaryCaption}
          </figcaption>
        ) : null}
      </figure>

      {secondary ? (
        <figure className="page-visual-stack__figure page-visual-stack__figure--secondary">
          <img
            alt={secondaryAlt}
            className="page-visual-stack__image"
            decoding="async"
            loading="lazy"
            src={secondary}
          />
          {secondaryCaption ? (
            <figcaption className="page-visual-stack__caption">
              {secondaryCaption}
            </figcaption>
          ) : null}
        </figure>
      ) : null}
    </div>
  )
}

export default PageVisualStack
