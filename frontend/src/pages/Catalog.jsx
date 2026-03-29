import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

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
    <MotionSection
      animate={{ opacity: 1, y: 0 }}
      className="catalog-layout"
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.45 }}
    >
      <div className="section-header">
        <h1>Available cars</h1>
        <p>
          Open a car, check the dates, and send your request directly.
        </p>
      </div>

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
    </MotionSection>
  )
}

export default Catalog
