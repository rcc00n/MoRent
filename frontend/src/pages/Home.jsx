import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import CarCard from '../components/CarCard'
import { getCars } from '../shared/api'

function Home() {
  const [cars, setCars] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadCars() {
      try {
        const { data } = await getCars()

        if (isMounted) {
          setCars(data.slice(0, 3))
        }
      } catch {
        if (isMounted) {
          setErrorMessage('Unable to load featured cars.')
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
    <div>
      <section className="hero">
        <span className="eyebrow">Premium car rental MVP</span>
        <h1>Choose a car, open the details, and send a booking request.</h1>
        <p>
          This first iteration focuses on the core flow only: catalog, car page,
          and booking submission.
        </p>
        <div className="button-row">
          <Link className="button button--primary" to="/catalog">
            Browse catalog
          </Link>
          <a className="button button--secondary" href="#featured-cars">
            Featured cars
          </a>
        </div>
      </section>

      <section aria-labelledby="featured-cars-heading" id="featured-cars">
        <div className="section-header">
          <span className="eyebrow">Cars</span>
          <h2 id="featured-cars-heading">Featured inventory</h2>
          <p>Live data comes from the Django API.</p>
        </div>

        {isLoading ? <div className="empty-state">Loading cars...</div> : null}
        {!isLoading && errorMessage ? (
          <div className="empty-state">{errorMessage}</div>
        ) : null}
        {!isLoading && !errorMessage ? (
          <div className="cars-grid">
            {cars.map((car) => (
              <CarCard car={car} key={car.id} />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  )
}

export default Home
