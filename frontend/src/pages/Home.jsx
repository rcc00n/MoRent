import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { Link } from 'react-router-dom'

import CarCard from '../components/CarCard'
import DotFieldCanvas from '../components/DotFieldCanvas'
import LoadingFleet from '../components/LoadingFleet'
import { getCars } from '../shared/api'

const MotionArticle = motion.article
const MotionDiv = motion.div
const MotionHeading = motion.h1
const MotionSection = motion.section

const premiumEase = [0.22, 1, 0.36, 1]
const viewportSettings = { once: true, amount: 0.24 }

const proofItems = [
  {
    value: '15 min',
    title: 'Average response',
    description: 'We confirm availability quickly after the request lands.',
  },
  {
    value: '100%',
    title: 'Verified fleet',
    description: 'Each listed car is reviewed before it reaches the catalog.',
  },
  {
    value: '24/7',
    title: 'Premium support',
    description: 'A manager stays close to the booking from request to return.',
  },
]

const benefitItems = [
  {
    tag: 'Fast booking',
    title: 'Request in minutes, not pages of forms.',
    description:
      'Pick a car, choose your dates, and send a request without registration or a payment wall.',
    tone: 'signal',
  },
  {
    tag: 'Verified fleet',
    title: 'Clean premium cars with clear availability.',
    description:
      'The catalog stays focused on high-end models and transparent day rates so the decision is simple.',
    tone: 'fleet',
  },
  {
    tag: 'Premium support',
    title: 'Manual confirmation with a real manager.',
    description:
      'The handoff stays personal after the form, which reduces uncertainty during the final booking step.',
    tone: 'support',
  },
  {
    tag: 'Transparent pricing',
    title: 'The rate is visible before the request starts.',
    description:
      'Customers see a clear daily price and booking path before they commit to sending their dates.',
    tone: 'pricing',
  },
]

const bookingSteps = [
  'Choose the car',
  'Check the dates',
  'Send the request',
]

const statItems = [
  {
    value: '4.9/5',
    label: 'service score',
  },
  {
    value: '48+',
    label: 'monthly premium bookings',
  },
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

const proofSectionVariants = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.985,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: premiumEase,
      staggerChildren: 0.09,
      delayChildren: 0.12,
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

  const driftAmount = shouldReduceMotion ? 0 : 12
  const glowY = useTransform(scrollYProgress, [0, 1], [0, driftAmount])
  const beamY = useTransform(scrollYProgress, [0, 1], [0, -8])
  const visualY = useTransform(scrollYProgress, [0, 1], [0, -6])

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
            <span className="eyebrow">
              Premium rental experience
            </span>

            <MotionHeading className="hero__headline">
              Premium cars for days that need more than transport.
            </MotionHeading>

            <p className="hero__description">
              Curated premium cars, transparent daily pricing, and a booking path
              designed to move from interest to confirmed availability without
              friction.
            </p>

            <div className="button-row button-row--hero">
              <Link className="button button--primary" to="/catalog">
                Book now
              </Link>
              <a className="button button--secondary" href="#featured-cars">
                Check availability
              </a>
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
                      <span>{heroCar.brand}</span>
                      <strong>{heroCar.model}</strong>
                      <span>{formatPrice(heroCar.price_per_day)}</span>
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
        className="proof-strip scene scene--proof"
        initial="hidden"
        variants={proofSectionVariants}
        viewport={viewportSettings}
        whileInView="visible"
      >
        {proofItems.map((item) => (
          <MotionArticle
            className="proof-strip__item"
            key={item.title}
            variants={proofItemVariants}
          >
            <span className="proof-strip__value">{item.value}</span>
            <div className="proof-strip__content">
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </div>
          </MotionArticle>
        ))}
      </MotionSection>

      <MotionSection
        className="benefits-section scene scene--benefits"
        initial="hidden"
        variants={benefitsSectionVariants}
        viewport={viewportSettings}
        whileInView="visible"
      >
        <div className="benefits-section__frame">
          <MotionDiv
            className="benefits-section__intro"
            variants={benefitsIntroVariants}
          >
            <span className="eyebrow">Why choose us</span>
            <h2>Premium booking should feel calm, clear, and personal.</h2>
            <p>
              MoRent is designed around one conversion path: see the car, trust the
              pricing, send the request, and get a fast confirmation from a real
              person.
            </p>

            <div className="benefits-section__stats">
              {statItems.map((item) => (
                <div className="benefits-section__stat" key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </MotionDiv>

          <MotionDiv className="benefits-grid" variants={benefitCardsContainerVariants}>
            {benefitItems.map((item) => (
              <MotionArticle
                className="benefit-card"
                key={item.title}
                variants={benefitCardRevealVariants}
              >
                <div
                  aria-hidden="true"
                  className={`benefit-card__glyph benefit-card__glyph--${item.tone}`}
                >
                  <span></span>
                  <span></span>
                </div>
                <span className="benefit-card__tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </MotionArticle>
            ))}
          </MotionDiv>
        </div>
      </MotionSection>

      <MotionSection
        aria-labelledby="motion-field-heading"
        className="signal-section scene scene--signal"
        initial="hidden"
        variants={signalSectionVariants}
        viewport={viewportSettings}
        whileInView="visible"
      >
        <div className="signal-section__intro">
          <span className="eyebrow">Motion field</span>
          <h2 id="motion-field-heading">
            Precision moves quietly before it becomes visible.
          </h2>
          <p>
            A controlled field of points responds to scroll with subtle density
            shifts and directional flow, creating a designed pause between trust
            and conversion.
          </p>
        </div>

        <MotionDiv className="signal-section__visual" variants={signalCanvasVariants}>
          <DotFieldCanvas />
        </MotionDiv>
      </MotionSection>

      <MotionSection
        aria-labelledby="featured-cars-heading"
        className="scene scene--fleet"
        id="featured-cars"
        initial="hidden"
        variants={fleetSectionVariants}
        viewport={viewportSettings}
        whileInView="visible"
      >
        <MotionDiv
          className="section-header section-header--split"
          variants={sectionSlideVariants}
        >
          <div>
            <span className="eyebrow">Featured fleet</span>
            <h2 id="featured-cars-heading">
              Check availability for the most requested cars.
            </h2>
          </div>
          <p>
            The fleet now follows the trust and motion layers, so the booking path
            feels considered before the inventory appears.
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
            <p className="muted-text">
              Need more options? Open the full fleet and move straight into the
              booking flow.
            </p>
            <Link className="button button--secondary" to="/catalog">
              View all cars
            </Link>
          </MotionDiv>
        ) : null}
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
            <span className="eyebrow">Ready to book</span>
            <h2>Choose the dates, send the request, and let the manager confirm the rest.</h2>
            <p>
              The path stays lightweight all the way through: browse the fleet,
              check availability, and submit a booking request without a long
              checkout.
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
              <Link className="button button--primary" to="/catalog">
                Book now
              </Link>
              <a className="button button--secondary" href="#featured-cars">
                Check availability
              </a>
            </div>
          </div>
        </MotionDiv>
      </MotionSection>
    </div>
  )
}

export default Home
