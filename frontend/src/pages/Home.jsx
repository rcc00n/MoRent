import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'

import CarCard from '../components/CarCard'
import DotFieldCanvas from '../components/DotFieldCanvas'
import LoadingFleet from '../components/LoadingFleet'
import MagneticAction from '../components/MagneticAction'
import coastalResortScene from '../assets/coastal-resort-scene.webp'
import coastalRoadHero from '../assets/coastal-road-hero.webp'
import { getCars } from '../shared/api'
import {
  resetInteractiveGlow,
  updateInteractiveGlow,
} from '../shared/interactiveSurface'

const MotionArticle = motion.article
const MotionAnchor = motion.a
const MotionDiv = motion.div
const MotionHeading = motion.h1
const MotionImage = motion.img
const MotionSection = motion.section

const premiumEase = [0.22, 1, 0.36, 1]
const viewportSettings = { once: true, amount: 0.24 }

const proofItems = [
  {
    value: '15 min',
    title: 'Average response',
    description: 'Availability moves fast.',
  },
  {
    value: 'Daily',
    title: 'Visible day rates',
    description: 'Rates stay readable first.',
  },
  {
    value: '100%',
    title: 'Verified fleet',
    description: 'Every listed car is checked.',
  },
]

const processItems = [
  {
    title: 'See the car.',
    description: 'Open the fleet and inspect the exact car first.',
    href: '#featured-cars',
    tone: 'fleet',
  },
  {
    title: 'Trust the rate.',
    description: 'Read the day rate before the request starts.',
    href: '#rate-clarity',
    tone: 'pricing',
  },
  {
    title: 'Send the request.',
    description: 'Choose the dates and send confirmation in minutes.',
    href: '#booking-path',
    tone: 'signal',
  },
]

const bookingSteps = [
  'Choose the car',
  'Check the dates',
  'Send the request',
]

const heroContentVariants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.64,
      ease: premiumEase,
    },
  },
}

const heroVisualVariants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.992,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.72,
      ease: premiumEase,
    },
  },
}

const sectionRevealVariants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.68,
      ease: premiumEase,
    },
  },
}

const sectionSlideVariants = {
  hidden: {
    opacity: 0,
    x: -24,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.64,
      ease: premiumEase,
    },
  },
}

const proofItemVariants = {
  hidden: {
    opacity: 0,
    scale: 0.97,
    y: 18,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.58,
      ease: premiumEase,
    },
  },
}

const fleetSectionVariants = {
  hidden: {
    opacity: 0,
    y: 34,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.76,
      ease: premiumEase,
    },
  },
}

const fleetCardsContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.18,
    },
  },
}

const fleetCardRevealVariants = {
  hidden: {
    opacity: 0,
    y: 26,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.62,
      ease: premiumEase,
    },
  },
}

const benefitsSectionVariants = {
  hidden: {
    opacity: 0,
    scale: 0.985,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.82,
      ease: premiumEase,
    },
  },
}

const benefitsIntroVariants = {
  hidden: {
    opacity: 0,
    x: -18,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.72,
      delay: 0.08,
      ease: premiumEase,
    },
  },
}

const benefitCardsContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.18,
    },
  },
}

const benefitCardRevealVariants = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.66,
      ease: premiumEase,
    },
  },
}

const signalSectionVariants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.86,
      ease: premiumEase,
    },
  },
}

const signalCanvasVariants = {
  hidden: {
    opacity: 0,
    scale: 0.975,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1,
      delay: 0.08,
      ease: premiumEase,
    },
  },
}

const closingPanelVariants = {
  hidden: {
    opacity: 0,
    y: 42,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.94,
      ease: premiumEase,
    },
  },
}

const closingStepsVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
}

const closingStepVariants = {
  hidden: {
    opacity: 0,
    x: 18,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: premiumEase,
    },
  },
}

let featuredCarsCache = null
let featuredCarsRequest = null

function formatPrice(price) {
  return `${Number(price).toFixed(0)} / day`
}

function loadFeaturedCars() {
  if (featuredCarsCache !== null) {
    return Promise.resolve(featuredCarsCache)
  }

  if (!featuredCarsRequest) {
    featuredCarsRequest = getCars()
      .then(({ data }) => {
        featuredCarsCache = data.slice(0, 3)

        return featuredCarsCache
      })
      .finally(() => {
        featuredCarsRequest = null
      })
  }

  return featuredCarsRequest
}

function Home() {
  const [cars, setCars] = useState(() => featuredCarsCache ?? [])
  const [isLoading, setIsLoading] = useState(() => featuredCarsCache === null)
  const [errorMessage, setErrorMessage] = useState('')
  const heroRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const driftAmount = shouldReduceMotion ? 0 : 12
  const glowY = useTransform(scrollYProgress, [0, 1], [0, driftAmount])
  const beamY = useTransform(scrollYProgress, [0, 1], [0, -8])
  const coastalY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 18])
  const visualY = useTransform(scrollYProgress, [0, 1], [0, -6])

  useEffect(() => {
    let active = true

    if (featuredCarsCache !== null) {
      return () => {
        active = false
      }
    }

    loadFeaturedCars()
      .then((nextCars) => {
        if (!active) {
          return
        }

        setCars(nextCars)
      })
      .catch(() => {
        if (!active) {
          return
        }

        setErrorMessage('Unable to load featured cars.')
      })
      .finally(() => {
        if (active) {
          setIsLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const heroCar = cars[0]

  return (
    <div className="home-page">
      <section
        className="hero hero--premium"
        ref={heroRef}
        style={{ '--hero-destination-image': `url(${coastalRoadHero})` }}
      >
        <MotionDiv
          className="hero__destination-plane"
          style={{ y: coastalY }}
        />
        <MotionDiv
          className="hero__horizon-glow"
          style={{ y: glowY }}
        />
        <MotionDiv
          className="hero__beam hero__beam--one"
          style={{ y: glowY }}
        />
        <MotionDiv
          className="hero__beam hero__beam--two"
          style={{ y: beamY }}
        />
        <MotionDiv
          className="hero__glow hero__glow--one"
          style={{ y: glowY }}
        />
        <MotionDiv
          className="hero__glow hero__glow--two"
          style={{ y: beamY }}
        />

        <div className="hero__grid">
          <MotionDiv
            animate="visible"
            className="hero__content"
            initial="hidden"
            variants={heroContentVariants}
          >
            <MotionHeading className="hero__headline">
              Premium coastal car rental with visible rates and a fast booking path.
            </MotionHeading>

            <p className="hero__description">
              Choose the car, check the day rate, and send the request before pickup.
            </p>

            <div className="button-row button-row--hero">
              <MagneticAction className="button button--primary" to="/catalog">
                Book now
              </MagneticAction>
              <MagneticAction className="button button--secondary" href="#featured-cars">
                Check availability
              </MagneticAction>
            </div>
          </MotionDiv>

          <MotionDiv
            animate="visible"
            className="hero__visual-stage"
            initial="hidden"
            variants={heroVisualVariants}
          >
            <MotionDiv
              className="hero__visual-shell"
              style={{ y: visualY }}
            >
              <div className="hero__visual-layer hero__visual-layer--back" />
              <div className="hero__visual-layer hero__visual-layer--mid" />

              <div className="hero__visual">
                {heroCar ? (
                  <>
                    <img
                      alt={`${heroCar.brand} ${heroCar.model}`}
                      className="hero__image"
                      decoding="async"
                      src={heroCar.image}
                    />
                    <div className="hero__visual-note">
                      <strong>{formatPrice(heroCar.price_per_day)}</strong>
                    </div>
                  </>
                ) : (
                  <div className="hero__image hero__image--placeholder" />
                )}
              </div>
            </MotionDiv>
          </MotionDiv>
        </div>
      </section>

      <MotionSection
        aria-labelledby="motion-field-heading"
        className="signal-section"
        initial="hidden"
        variants={signalSectionVariants}
        viewport={viewportSettings}
        whileInView="visible"
      >
        <div className="signal-section__intro">
          <h2 id="motion-field-heading">
            A grand tourer in motion.
          </h2>
        </div>

        <MotionDiv className="signal-section__visual" variants={signalCanvasVariants}>
          <DotFieldCanvas />
        </MotionDiv>
      </MotionSection>

      <MotionSection
        aria-labelledby="featured-cars-heading"
        className="scene scene--fleet"
        id="featured-cars"
        animate="visible"
        initial={shouldReduceMotion ? false : 'hidden'}
        variants={fleetSectionVariants}
      >
        <MotionDiv
          className="section-header section-header--split"
          variants={sectionSlideVariants}
        >
          <div>
            <h2 id="featured-cars-heading">
              Check availability for the cars booked first.
            </h2>
          </div>
          <p>
            Open any car and move straight into dates.
          </p>
        </MotionDiv>

        {isLoading ? <LoadingFleet count={3} /> : null}
        {!isLoading && errorMessage ? (
          <div className="empty-state">{errorMessage}</div>
        ) : null}
        {!isLoading && !errorMessage ? (
          <MotionDiv
            className="cars-grid"
            variants={fleetCardsContainerVariants}
          >
            {cars.map((car) => (
              <MotionDiv key={car.id} variants={fleetCardRevealVariants}>
                <CarCard car={car} />
              </MotionDiv>
            ))}
          </MotionDiv>
        ) : null}

        {!isLoading && !errorMessage ? (
          <MotionDiv className="section-cta" variants={sectionRevealVariants}>
            <p className="muted-text">Need more options? Open the full fleet.</p>
            <MagneticAction className="button button--secondary" to="/catalog">
              View all cars
            </MagneticAction>
          </MotionDiv>
        ) : null}
      </MotionSection>

      <MotionSection
        className="destination-section scene scene--destination"
        initial="hidden"
        variants={sectionRevealVariants}
        viewport={viewportSettings}
        whileInView="visible"
      >
        <MotionDiv
          className="destination-section__media interactive-surface interactive-surface--scene"
          onPointerLeave={resetInteractiveGlow}
          onPointerMove={updateInteractiveGlow}
          variants={sectionSlideVariants}
        >
          <MotionImage
            alt="Seafront resort with a calm bay and sunset light"
            className="destination-section__image"
            decoding="async"
            loading="lazy"
            src={coastalResortScene}
            transition={{ duration: 0.7, ease: premiumEase }}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.035, y: -4 }}
          />
        </MotionDiv>

        <MotionDiv className="destination-section__content" variants={sectionRevealVariants}>
          <h2>Seafront light. Calm pickup. Premium cars ready for the coast.</h2>
          <p>
            Resort calm, direct booking, and a clean handoff from arrival to the road.
          </p>
        </MotionDiv>
      </MotionSection>

      <MotionSection
        className="benefits-section scene scene--benefits"
        id="rate-clarity"
        initial="hidden"
        variants={benefitsSectionVariants}
        viewport={viewportSettings}
        whileInView="visible"
      >
        <div className="benefits-section__header">
          <MotionDiv
            className="benefits-section__intro"
            variants={benefitsIntroVariants}
          >
            <h2>See the car. Trust the rate. Send the request.</h2>
            <p>
              Exact fleet, readable day rates, direct confirmation.
            </p>
          </MotionDiv>

          <MotionDiv className="benefits-proof" variants={benefitCardsContainerVariants}>
            {proofItems.map((item) => (
              <MotionArticle
                className="benefits-proof__item interactive-surface interactive-surface--soft"
                key={item.title}
                onPointerLeave={resetInteractiveGlow}
                onPointerMove={updateInteractiveGlow}
                variants={proofItemVariants}
              >
                <span className="benefits-proof__value">{item.value}</span>
                <div className="benefits-proof__content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </MotionArticle>
            ))}
          </MotionDiv>
        </div>

        <MotionDiv className="benefits-grid" variants={benefitCardsContainerVariants}>
          {processItems.map((item) => (
            <MotionAnchor
              aria-label={`Jump to ${item.title.replace('.', '').toLowerCase()}`}
              className="benefit-card benefit-card--link interactive-surface interactive-surface--feature"
              data-cursor="interactive"
              href={item.href}
              key={item.title}
              onPointerLeave={resetInteractiveGlow}
              onPointerMove={updateInteractiveGlow}
              variants={benefitCardRevealVariants}
            >
              <div
                aria-hidden="true"
                className={`benefit-card__glyph benefit-card__glyph--${item.tone}`}
              >
                <span></span>
                <span></span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </MotionAnchor>
          ))}
        </MotionDiv>
      </MotionSection>

      <MotionSection
        className="closing-cta scene scene--closing"
        id="booking-path"
        initial="hidden"
        viewport={viewportSettings}
        whileInView="visible"
      >
        <MotionDiv className="closing-cta__panel" variants={closingPanelVariants}>
          <div className="closing-cta__content">
            <h2>Choose the dates. We confirm the rest.</h2>
            <p>
              Pick the car, choose the dates, send the request.
            </p>
          </div>

          <div className="closing-cta__actions">
            <MotionDiv className="closing-cta__steps" variants={closingStepsVariants}>
              {bookingSteps.map((step, index) => (
                <MotionDiv className="closing-cta__step" key={step} variants={closingStepVariants}>
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </MotionDiv>
              ))}
            </MotionDiv>

            <div className="button-row">
              <MagneticAction className="button button--primary" to="/catalog">
                Book now
              </MagneticAction>
              <MagneticAction className="button button--secondary" href="#featured-cars">
                Check availability
              </MagneticAction>
            </div>
          </div>
        </MotionDiv>
      </MotionSection>
    </div>
  )
}

export default Home
