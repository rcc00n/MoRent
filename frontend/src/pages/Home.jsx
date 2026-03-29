import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'

import CarCard from '../components/CarCard'
import LoadingFleet from '../components/LoadingFleet'
import { getCars } from '../shared/api'

const MotionDiv = motion.div
const MotionSection = motion.section
const MotionSpan = motion.span
const MotionHeading = motion.h1
const MotionParagraph = motion.p

const trustPoints = [
  {
    title: 'Fast manager response',
    description: 'Short booking flow with quick manual confirmation after submission.',
  },
  {
    title: 'Premium fleet only',
    description: 'Focused inventory with business-ready and lifestyle-ready options.',
  },
  {
    title: 'Clear booking path',
    description: 'Catalog, car details, and request form are all wired end-to-end.',
  },
]

function formatPrice(price) {
  return `${Number(price).toFixed(0)} / day`
}

function Home() {
  const [cars, setCars] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const heroRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const glowY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, shouldReduceMotion ? 0 : 72],
  )
  const visualY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, shouldReduceMotion ? 0 : -48],
  )

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

  const heroCar = cars[0]

  return (
    <div className="home-page">
      <section className="hero hero--premium" ref={heroRef}>
        <MotionDiv className="hero__glow hero__glow--one" style={{ y: glowY }} />
        <MotionDiv className="hero__glow hero__glow--two" style={{ y: visualY }} />

        <div className="hero__grid">
          <div className="hero__content">
            <MotionSpan
              animate={{ opacity: 1, y: 0 }}
              className="eyebrow"
              initial={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.45 }}
            >
              Premium rental experience
            </MotionSpan>
            <MotionHeading
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 28 }}
              transition={{ delay: 0.08, duration: 0.55 }}
            >
              Premium cars for days that need more than transport.
            </MotionHeading>
            <MotionParagraph
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 26 }}
              transition={{ delay: 0.16, duration: 0.55 }}
            >
              Curated fleet, clean booking flow, and a calm premium interface that
              moves the customer from discovery to request without friction.
            </MotionParagraph>
            <MotionDiv
              animate={{ opacity: 1, y: 0 }}
              className="button-row"
              initial={{ opacity: 0, y: 22 }}
              transition={{ delay: 0.24, duration: 0.5 }}
            >
              <Link className="button button--primary" to="/catalog">
                Browse catalog
              </Link>
              <a className="button button--secondary" href="#featured-cars">
                Featured cars
              </a>
            </MotionDiv>
          </div>

          <MotionDiv
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="hero__visual"
            initial={{ opacity: 0, y: 36, scale: 0.96 }}
            style={{ y: visualY }}
            transition={{ delay: 0.14, duration: 0.7 }}
          >
            {heroCar ? (
              <>
                <img
                  alt={`${heroCar.brand} ${heroCar.model}`}
                  className="hero__image"
                  src={heroCar.image}
                />
                <div className="hero__visual-note">
                  <span>{heroCar.brand}</span>
                  <strong>{heroCar.model}</strong>
                  <span>{formatPrice(heroCar.price_per_day)}</span>
                </div>
              </>
            ) : (
              <div className="hero__image hero__image--placeholder" />
            )}
          </MotionDiv>
        </div>
      </section>

      <MotionSection
        animate={{ opacity: 1, y: 0 }}
        className="proof-strip"
        initial={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.2, duration: 0.45 }}
      >
        {trustPoints.map((item) => (
          <article className="proof-strip__item" key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </article>
        ))}
      </MotionSection>

      <section aria-labelledby="featured-cars-heading" id="featured-cars">
        <div className="section-header section-header--split">
          <div>
            <span className="eyebrow">Cars</span>
            <h2 id="featured-cars-heading">Featured inventory</h2>
          </div>
          <p>
            The first screen builds atmosphere. The next step should always be a
            car card and a booking CTA.
          </p>
        </div>

        {isLoading ? <LoadingFleet count={3} /> : null}
        {!isLoading && errorMessage ? (
          <div className="empty-state">{errorMessage}</div>
        ) : null}
        {!isLoading && !errorMessage ? (
          <div className="cars-grid">
            {cars.slice(0, 3).map((car) => (
              <CarCard car={car} key={car.id} />
            ))}
          </div>
        ) : null}

        {!isLoading && !errorMessage ? (
          <div className="section-cta">
            <p className="muted-text">
              Need more options? Open the full fleet and compare cars directly.
            </p>
            <Link className="button button--secondary" to="/catalog">
              View all cars
            </Link>
          </div>
        ) : null}
      </section>
    </div>
  )
}

export default Home
