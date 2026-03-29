import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import {
  resetInteractiveGlow,
  updateInteractiveGlow,
} from '../shared/interactiveSurface'

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
    y: -5,
    scale: 1.014,
    transition: {
      duration: 0.34,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const imageMotion = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.03,
    transition: {
      duration: 0.44,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

function CarCard({ car }) {
  const carName = `${car.brand} ${car.model}`

  return (
    <MotionArticle
      animate="rest"
      className="car-card interactive-surface interactive-surface--fleet"
      data-cursor="interactive"
      initial="rest"
      onPointerLeave={resetInteractiveGlow}
      onPointerMove={updateInteractiveGlow}
      variants={cardMotion}
      whileHover="hover"
    >
      <Link
        aria-label={`View availability for ${carName}`}
        className="car-card__link"
        to={`/car/${car.id}`}
      />

      <div className="car-card__content">
        <div className="car-card__media-wrap">
          <MotionImage
            alt={carName}
            className="car-card__media"
            decoding="async"
            loading="lazy"
            src={car.image}
            variants={imageMotion}
          />
        </div>
        <div className="car-card__body">
          <div className="car-card__top">
            <div>
              <h2 className="car-card__title">{carName}</h2>
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
            <span aria-hidden="true" className="button button--primary car-card__cta">
              Check availability
            </span>
          </div>
        </div>
      </div>
    </MotionArticle>
  )
}

export default CarCard
