import { Link } from 'react-router-dom'

function formatPrice(price) {
  return `${Number(price).toFixed(0)} / day`
}

function CarCard({ car }) {
  return (
    <article className="car-card">
      <img
        className="car-card__media"
        src={car.image}
        alt={`${car.brand} ${car.model}`}
      />
      <div className="car-card__body">
        <div className="car-card__top">
          <div>
            <h2 className="car-card__title">
              {car.brand} {car.model}
            </h2>
            <p className="car-card__description muted-text">{car.description}</p>
          </div>
          <span
            className={
              car.available ? 'badge badge--available' : 'badge badge--unavailable'
            }
          >
            {car.available ? 'Available' : 'Booked'}
          </span>
        </div>
        <div className="price-row">
          <span className="price">{formatPrice(car.price_per_day)}</span>
          <Link className="button button--primary" to={`/car/${car.id}`}>
            View car
          </Link>
        </div>
      </div>
    </article>
  )
}

export default CarCard
