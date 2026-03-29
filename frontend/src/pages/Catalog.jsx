import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import CarCard from '../components/CarCard'
import LoadingFleet from '../components/LoadingFleet'
import PageVisualStack from '../components/PageVisualStack'
import { enrichCarMedia, pageMedia } from '../content/mediaLibrary'
import { getCars } from '../shared/api'

const MotionSection = motion.section

function Catalog() {
  const { i18n, t } = useTranslation()
  const [cars, setCars] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasLoadError, setHasLoadError] = useState(false)
  const infoCards = t('catalog.infoCards', { returnObjects: true })

  useEffect(() => {
    let isMounted = true

    async function loadCars() {
      try {
        setIsLoading(true)
        setHasLoadError(false)
        const { data } = await getCars({ lang: i18n.resolvedLanguage })

        if (isMounted) {
          setCars(data.map(enrichCarMedia))
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

    loadCars()

    return () => {
      isMounted = false
    }
  }, [i18n.resolvedLanguage])

  return (
    <div className="catalog-layout">
      <MotionSection
        animate={{ opacity: 1, y: 0 }}
        className="catalog-intro scene scene--fleet"
        initial={{ opacity: 0, y: 18 }}
        transition={{ duration: 0.45 }}
      >
        <div className="catalog-intro__top">
          <div className="section-header catalog-intro__header">
            <h1 className="catalog-intro__title">{t('catalog.title')}</h1>
            <p>{t('catalog.description')}</p>
          </div>

          <PageVisualStack
            className="catalog-intro__visual"
            primary={pageMedia.catalogBridge}
            primaryAlt={t('catalog.visuals.primaryAlt')}
            primaryCaption={t('catalog.visuals.primaryCaption')}
          />
        </div>

        <div className="info-grid info-grid--compact">
          {infoCards.map((card) => (
            <article className="info-card" key={card.title}>
              <h2>{card.title}</h2>
              <p>{card.description}</p>
            </article>
          ))}
        </div>

        <div className="button-row">
          <Link className="button button--secondary" to="/how-it-works">
            {t('common.actions.howBookingWorks')}
          </Link>
          <Link className="button button--secondary" to="/contacts">
            {t('common.actions.serviceDetails')}
          </Link>
        </div>
      </MotionSection>

      {isLoading ? <LoadingFleet count={6} /> : null}
      {!isLoading && hasLoadError ? (
        <div className="empty-state">{t('common.errors.catalog')}</div>
      ) : null}
      {!isLoading && !hasLoadError ? (
        <>
          <p className="muted-text">
            {t('common.labels.carsAvailable', { count: cars.length })}
          </p>
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
