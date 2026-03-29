import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { enrichCarMedia } from '../content/mediaLibrary'
import {
  resetInteractiveGlow,
  updateInteractiveGlow,
} from '../shared/interactiveSurface'

const MotionArticle = motion.article
const MotionImage = motion.img

function formatPrice(price, suffix) {
  return `${Number(price).toFixed(0)} ${suffix}`
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
  const { t } = useTranslation()
  const displayCar = enrichCarMedia(car)
  const carName = `${displayCar.brand} ${displayCar.model}`
  const description = displayCar.translationKey
    ? t(`cars.${displayCar.translationKey}.description`, {
        defaultValue: displayCar.description,
      })
    : displayCar.description

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
        aria-label={t('common.aria.viewCarAvailability', { carName })}
        className="car-card__link"
        to={`/car/${displayCar.id}`}
      />

      <div className="car-card__content">
        <div className="car-card__media-wrap">
          <MotionImage
            alt={carName}
            className="car-card__media"
            decoding="async"
            loading="lazy"
            src={displayCar.image}
            variants={imageMotion}
          />
        </div>
        <div className="car-card__body">
          <div className="car-card__top">
            <div>
              <h2 className="car-card__title">{carName}</h2>
              <p className="car-card__description muted-text">{description}</p>
            </div>
            <span
              className={
                displayCar.available
                  ? 'badge badge--available'
                  : 'badge badge--unavailable'
              }
            >
              {displayCar.available
                ? t('common.status.available')
                : t('common.status.booked')}
            </span>
          </div>
          <div className="price-row">
            <span className="price">
              {formatPrice(displayCar.price_per_day, t('common.pricing.perDay'))}
            </span>
            <span aria-hidden="true" className="button button--primary car-card__cta">
              {t('common.actions.checkAvailability')}
            </span>
          </div>
        </div>
      </div>
    </MotionArticle>
  )
}

export default CarCard
