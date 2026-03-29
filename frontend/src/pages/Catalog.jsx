import { useEffect, useState } from 'react'

import CarCard from '../components/CarCard'
import { getCars } from '../shared/api'

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
    <section className="catalog-layout">
      <div className="section-header">
        <span className="eyebrow">Catalog</span>
        <h1>Available cars</h1>
        <p>
          The catalog is connected to the backend endpoint at <code>/api/cars/</code>.
        </p>
      </div>

      {isLoading ? <div className="empty-state">Loading catalog...</div> : null}
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
    </section>
  )
}

export default Catalog
