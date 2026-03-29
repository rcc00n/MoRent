import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import BookingForm from '../components/BookingForm'
import Seo from '../components/Seo'
import { enrichCarMedia } from '../content/mediaLibrary'
import { getCarPageMetadata } from '../seo/pageMetadata'
import { getRuntimeSiteUrl } from '../seo/site'
import { getCar } from '../shared/api'

const MotionDiv = motion.div

function formatPrice(price, suffix) {
  return `${Number(price).toFixed(0)} ${suffix}`
}

function CarPage() {
  const { id } = useParams()
  const { i18n, t } = useTranslation()
  const [car, setCar] = useState(null)
  const [activeImage, setActiveImage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [hasLoadError, setHasLoadError] = useState(false)
  const siteUrl = getRuntimeSiteUrl()

  useEffect(() => {
    let isMounted = true

    async function loadCar() {
      try {
        const { data } = await getCar(id)
        const enrichedCar = enrichCarMedia(data)

        if (isMounted) {
          setCar(enrichedCar)
          setActiveImage(enrichedCar.primaryImage || enrichedCar.image || '')
        }
      } catch {
        if (isMounted) {
          setHasLoadError(true)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadCar()

    return () => {
      isMounted = false
    }
  }, [id])

  const galleryImages = [...new Set([car?.primaryImage, ...(car?.gallery || [])].filter(Boolean))]
  const currentImage =
    galleryImages.find((image) => image === activeImage) || galleryImages[0] || car?.image
  const carDescription =
    car?.translationKey
      ? t(`cars.${car.translationKey}.description`, { defaultValue: car.description })
      : car?.description

  if (isLoading) {
    return (
      <>
        <Seo
          canonicalUrl={`${siteUrl}/catalog`}
          description={t('metadata.pages.carLoading.description')}
          title={t('metadata.pages.carLoading.title')}
          url={`${siteUrl}/catalog`}
        />
        <div className="loading-shell loading-shell--panel" aria-hidden="true">
          <div className="loading-line loading-line--wide"></div>
          <div className="loading-line"></div>
          <div className="loading-line loading-line--short"></div>
        </div>
      </>
    )
  }

  if (hasLoadError || !car) {
    return (
      <>
        <Seo
          canonicalUrl={`${siteUrl}/catalog`}
          description={t('metadata.pages.carNotFound.description')}
          title={t('metadata.pages.carNotFound.title')}
          url={`${siteUrl}/catalog`}
        />
        <div className="empty-state">
          <p>{hasLoadError ? t('common.errors.car') : t('common.errors.carNotFound')}</p>
          <Link className="button button--secondary" to="/catalog">
            {t('common.actions.backToCatalog')}
          </Link>
        </div>
      </>
    )
  }

  const pageMetadata = getCarPageMetadata(car, siteUrl, i18n.resolvedLanguage)
  const supportCards = t('carPage.supportCards', { returnObjects: true })

  return (
    <>
      <Seo {...pageMetadata} />
      <section className="car-page">
        <MotionDiv
          animate={{ opacity: 1, x: 0 }}
          className="car-page__content"
          initial={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.45 }}
        >
          <div className="panel car-page__gallery panel--visual">
            <img
              alt={`${car.brand} ${car.model}`}
              className="car-page__image"
              decoding="async"
              src={currentImage}
            />
            {galleryImages.length > 1 ? (
              <div className="car-page__gallery-strip">
                {galleryImages.map((image, index) => (
                  <button
                    aria-label={t('common.aria.viewCarPhoto', {
                      carName: `${car.brand} ${car.model}`,
                      index: index + 1,
                    })}
                    className={
                      image === currentImage
                        ? 'car-page__thumbnail is-active'
                        : 'car-page__thumbnail'
                    }
                    key={image}
                    onClick={() => setActiveImage(image)}
                    type="button"
                  >
                    <img
                      alt=""
                      className="car-page__thumbnail-image"
                      decoding="async"
                      loading="lazy"
                      src={image}
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="panel">
            <div className="car-page__summary">
              <div>
                <h1 className="car-page__title">
                  {car.brand} {car.model}
                </h1>
                <p className="muted-text">{carDescription}</p>
              </div>
              <span
                className={
                  car.available ? 'badge badge--available' : 'badge badge--unavailable'
                }
              >
                {car.available
                  ? t('common.status.available')
                  : t('common.status.booked')}
              </span>
            </div>
            <p className="price">
              {formatPrice(car.price_per_day, t('common.pricing.perDay'))}
            </p>
          </div>
        </MotionDiv>

        <MotionDiv
          animate={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: 20 }}
          transition={{ delay: 0.08, duration: 0.45 }}
        >
          <BookingForm carId={car.id} carName={`${car.brand} ${car.model}`} />
        </MotionDiv>

        <div className="car-page__support">
          <article className="info-card">
            <h2>{supportCards[0].title}</h2>
            <p>{supportCards[0].description}</p>
          </article>
          <article className="info-card">
            <h2>{supportCards[1].title}</h2>
            <p>{supportCards[1].description}</p>
            <div className="button-row">
              <Link className="button button--secondary" to="/how-it-works">
                {t('common.actions.howItWorks')}
              </Link>
              <Link className="button button--secondary" to="/faq">
                {t('common.actions.readFaq')}
              </Link>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}

export default CarPage
