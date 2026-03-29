function LoadingFleet({ count = 3 }) {
  return (
    <div aria-hidden="true" className="loading-grid">
      {Array.from({ length: count }, (_, index) => (
        <div className="loading-card" key={index}>
          <div className="loading-card__media"></div>
          <div className="loading-card__body">
            <div className="loading-line loading-line--wide"></div>
            <div className="loading-line"></div>
            <div className="loading-line loading-line--short"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default LoadingFleet
