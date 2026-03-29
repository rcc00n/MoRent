import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'

import BookingForm from '../components/BookingForm'
import Seo from '../components/Seo'
import { getCarPageMetadata } from '../seo/pageMetadata'
import { getRuntimeSiteUrl } from '../seo/site'
import { getCar } from '../shared/api'

const MotionDiv = motion.div

function formatPrice(price) {
  return `${Number(price).toFixed(0)} / day`
}

function CarPage() {
  const { id } = useParams()
  const [car, setCar] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const siteUrl = getRuntimeSiteUrl()

  useEffect(() => {
    let isMounted = true

    async function loadCar() {
      try {
        const { data } = await getCar(id)

        if (isMounted) {
          setCar(data)
        }
      } catch {
        if (isMounted) {
          setErrorMessage('Unable to load this car.')
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

  if (isLoading) {
    return (
      <>
        <Seo
          canonicalUrl={`${siteUrl}/catalog`}
          description="Open the premium MoRent fleet, review car details, and send a direct booking request."
          title="Premium Rental Car Details | MoRent"
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

  if (errorMessage || !car) {
    return (
      <>
        <Seo
          canonicalUrl={`${siteUrl}/catalog`}
          description="The requested car could not be loaded. Browse the active premium fleet instead."
          title="Car Not Found | MoRent"
          url={`${siteUrl}/catalog`}
        />
        <div className="empty-state">
          <p>{errorMessage || 'Car not found.'}</p>
          <Link className="button button--secondary" to="/catalog">
            Back to catalog
          </Link>
        </div>
      </>
    )
  }

  const pageMetadata = getCarPageMetadata(car, siteUrl)

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
              src={car.image}
            />
          </div>

          <div className="panel">
            <div className="car-page__summary">
              <div>
                <h1 className="car-page__title">
                  {car.brand} {car.model}
                </h1>
                <p className="muted-text">{car.description}</p>
              </div>
              <span
                className={
                  car.available ? 'badge badge--available' : 'badge badge--unavailable'
                }
              >
                {car.available ? 'Available' : 'Booked'}
              </span>
            </div>
            <p className="price">{formatPrice(car.price_per_day)}</p>
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
            <h2>What happens after the request?</h2>
            <p>
              The team reviews availability, confirms the timing, and arranges the pickup
              details directly.
            </p>
          </article>
          <article className="info-card">
            <h2>Need the booking details first?</h2>
            <p>
              Review the booking flow and FAQ before you submit the dates.
            </p>
            <div className="button-row">
              <Link className="button button--secondary" to="/how-it-works">
                How it works
              </Link>
              <Link className="button button--secondary" to="/faq">
                FAQ
              </Link>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}

export default CarPage
