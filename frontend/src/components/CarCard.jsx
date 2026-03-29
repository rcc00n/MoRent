import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const MotionArticle = motion.article
const MotionImage = motion.img

function formatPrice(price) {
  return `${Number(price).toFixed(0)} / day`
}

const cardMotion = {
  rest: {
    y: 0,
    scale: 1,
  },
  hover: {
    y: -10,
    scale: 1.01,
    transition: {
      duration: 0.26,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const imageMotion = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.08,
    transition: {
      duration: 0.38,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

function CarCard({ car }) {
  return (
    <MotionArticle
      animate="rest"
      className="car-card"
      initial="rest"
      variants={cardMotion}
      whileHover="hover"
    >
      <div className="car-card__media-wrap">
        <MotionImage
          alt={`${car.brand} ${car.model}`}
          className="car-card__media"
          src={car.image}
          variants={imageMotion}
        />
      </div>
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
    </MotionArticle>
  )
}

export default CarCard
