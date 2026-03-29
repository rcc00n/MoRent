import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import BookingForm from '../components/BookingForm'
import { getCar } from '../shared/api'

function formatPrice(price) {
  return `${Number(price).toFixed(0)} / day`
}

function CarPage() {
  const { id } = useParams()
  const [car, setCar] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

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
    return <div className="empty-state">Loading car details...</div>
  }

  if (errorMessage || !car) {
    return (
      <div className="empty-state">
        <p>{errorMessage || 'Car not found.'}</p>
        <Link className="button button--secondary" to="/catalog">
          Back to catalog
        </Link>
      </div>
    )
  }

  return (
    <section className="car-page">
      <div className="car-page__content">
        <div className="panel car-page__gallery">
          <img
            alt={`${car.brand} ${car.model}`}
            className="car-page__image"
            src={car.image}
          />
        </div>

        <div className="panel">
          <span className="eyebrow">Car details</span>
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
      </div>

      <BookingForm carId={car.id} carName={`${car.brand} ${car.model}`} />
    </section>
  )
}

export default CarPage
