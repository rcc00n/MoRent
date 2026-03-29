import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import CarCard from '../components/CarCard'
import LoadingFleet from '../components/LoadingFleet'
import { getCars } from '../shared/api'

const MotionSection = motion.section

function Catalog() {
  const [cars, setCars] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadCars() {
      try {
        const { data } = await getCars()

        if (isMounted) {
          setCars(data)
        }
      } catch {
        if (isMounted) {
          setErrorMessage('Unable to load the catalog.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadCars()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="catalog-layout">
      <MotionSection
        animate={{ opacity: 1, y: 0 }}
        className="catalog-intro scene scene--fleet"
        initial={{ opacity: 0, y: 18 }}
        transition={{ duration: 0.45 }}
      >
        <div className="section-header section-header--split">
          <div>
            <h1>Premium fleet with visible daily rates.</h1>
          </div>
          <p>
            Choose the car first, review the daily rate, and move into the request only
            when the timing works for the trip.
          </p>
        </div>

        <div className="info-grid info-grid--compact">
          <article className="info-card">
            <h2>Visible pricing</h2>
            <p>Daily rates stay clear before the request starts.</p>
          </article>
          <article className="info-card">
            <h2>Fast review</h2>
            <p>Most requests are checked within about 15 minutes during service hours.</p>
          </article>
          <article className="info-card">
            <h2>Pickup support</h2>
            <p>Hotel, airport, and private handoff points are agreed after confirmation.</p>
          </article>
        </div>

        <div className="button-row">
          <Link className="button button--secondary" to="/how-it-works">
            How booking works
          </Link>
          <Link className="button button--secondary" to="/contacts">
            Service details
          </Link>
        </div>
      </MotionSection>

      {isLoading ? <LoadingFleet count={6} /> : null}
      {!isLoading && errorMessage ? (
        <div className="empty-state">{errorMessage}</div>
      ) : null}
      {!isLoading && !errorMessage ? (
        <>
          <p className="muted-text">{cars.length} cars available right now.</p>
          <div className="cars-grid">
            {cars.map((car) => (
              <CarCard car={car} key={car.id} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}

export default Catalog
