import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { Link } from 'react-router-dom'

import CarCard from '../components/CarCard'
import LoadingFleet from '../components/LoadingFleet'
import { getCars } from '../shared/api'

const MotionArticle = motion.article
const MotionDiv = motion.div
const MotionHeading = motion.h1
const MotionSection = motion.section
const MotionSpan = motion.span
const MotionParagraph = motion.p

const premiumEase = [0.22, 1, 0.36, 1]
const viewportSettings = { once: true, amount: 0.24 }

const heroHeadlineLines = [
  'Premium cars',
  'for days that need',
  'more than transport.',
]

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

const heroLineVariants = {
  hidden: {
    y: '115%',
  },
  visible: (index) => ({
    y: 0,
    transition: {
      duration: 0.72,
      delay: 0.12 + index * 0.08,
      ease: premiumEase,
    },
  }),
}

const heroFadeVariants = {
  hidden: {
    opacity: 0,
    y: 22,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.58,
      delay,
      ease: premiumEase,
    },
  }),
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

const proofContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.08,
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

const cardsContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.12,
    },
  },
}

const cardRevealVariants = {
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

function formatPrice(price) {
  return `${Number(price).toFixed(0)} / day`
}

function Home() {
  const [cars, setCars] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const heroRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const springX = useSpring(pointerX, {
    stiffness: 88,
    damping: 20,
    mass: 0.7,
  })
  const springY = useSpring(pointerY, {
    stiffness: 88,
    damping: 20,
    mass: 0.7,
  })
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const depthOffset = shouldReduceMotion ? 0 : 18
  const tiltOffset = shouldReduceMotion ? 0 : 6
  const chipOffset = shouldReduceMotion ? 0 : 14
  const scrollDrift = shouldReduceMotion ? 0 : 72
  const visualLift = shouldReduceMotion ? 0 : -48

  const glowY = useTransform(scrollYProgress, [0, 1], [0, scrollDrift])
  const glowX = useTransform(springX, [-1, 1], [-depthOffset, depthOffset])
  const meshX = useTransform(springX, [-1, 1], [depthOffset, -depthOffset])
  const meshY = useTransform(springY, [-1, 1], [-12, 12])
  const beamX = useTransform(springX, [-1, 1], [-20, 20])
  const beamY = useTransform(scrollYProgress, [0, 1], [0, visualLift])
  const visualX = useTransform(springX, [-1, 1], [-depthOffset, depthOffset])
  const visualY = useTransform(scrollYProgress, [0, 1], [0, visualLift])
  const visualRotateY = useTransform(springX, [-1, 1], [-tiltOffset, tiltOffset])
  const visualRotateX = useTransform(springY, [-1, 1], [tiltOffset, -tiltOffset])
  const backLayerX = useTransform(springX, [-1, 1], [-22, 22])
  const backLayerY = useTransform(springY, [-1, 1], [18, -18])
  const midLayerX = useTransform(springX, [-1, 1], [14, -14])
  const midLayerY = useTransform(springY, [-1, 1], [-12, 12])
  const chipTopX = useTransform(springX, [-1, 1], [-chipOffset, chipOffset])
  const chipTopY = useTransform(springY, [-1, 1], [10, -10])
  const chipBottomX = useTransform(springX, [-1, 1], [chipOffset, -chipOffset])
  const chipBottomY = useTransform(springY, [-1, 1], [-10, 10])

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

  function handleHeroPointerMove(event) {
    if (
      shouldReduceMotion ||
      window.matchMedia('(pointer: coarse), (hover: none)').matches
    ) {
      return
    }

    const heroBounds = heroRef.current?.getBoundingClientRect()
    if (!heroBounds) {
      return
    }

    const normalizedX = ((event.clientX - heroBounds.left) / heroBounds.width - 0.5) * 2
    const normalizedY = ((event.clientY - heroBounds.top) / heroBounds.height - 0.5) * 2

    pointerX.set(normalizedX)
    pointerY.set(normalizedY)
  }

  function handleHeroPointerLeave() {
    pointerX.set(0)
    pointerY.set(0)
  }

  const heroCar = cars[0]

  return (
    <div className="home-page">
      <section
        className="hero hero--premium"
        onPointerLeave={handleHeroPointerLeave}
        onPointerMove={handleHeroPointerMove}
        ref={heroRef}
      >
        <MotionDiv
          className="hero__mesh"
          style={{ x: meshX, y: meshY }}
        />
        <MotionDiv
          className="hero__beam hero__beam--one"
          style={{ x: beamX, y: glowY }}
        />
        <MotionDiv
          className="hero__beam hero__beam--two"
          style={{ x: glowX, y: beamY }}
        />
        <MotionDiv
          className="hero__glow hero__glow--one"
          style={{ x: glowX, y: glowY }}
        />
        <MotionDiv
          className="hero__glow hero__glow--two"
          style={{ x: meshX, y: visualY }}
        />

        <div className="hero__grid">
          <div className="hero__content">
            <MotionSpan
              animate="visible"
              className="eyebrow"
              custom={0}
              initial="hidden"
              variants={heroFadeVariants}
            >
              Premium rental experience
            </MotionSpan>

            <MotionHeading
              aria-label="Premium cars for days that need more than transport."
              className="hero__headline"
            >
              {heroHeadlineLines.map((line, index) => (
                <span className="hero__headline-line" key={line}>
                  <MotionSpan
                    animate="visible"
                    custom={index}
                    initial="hidden"
                    variants={heroLineVariants}
                  >
                    {line}
                  </MotionSpan>
                </span>
              ))}
            </MotionHeading>

            <MotionParagraph
              animate="visible"
              className="hero__description"
              custom={0.34}
              initial="hidden"
              variants={heroFadeVariants}
            >
              Curated premium cars, transparent daily pricing, and a booking path
              designed to move from interest to confirmed availability without
              friction.
            </MotionParagraph>

            <MotionDiv
              animate="visible"
              className="button-row button-row--hero"
              custom={0.46}
              initial="hidden"
              variants={heroFadeVariants}
            >
              <Link className="button button--primary" to="/catalog">
                Book now
              </Link>
              <a className="button button--secondary" href="#featured-cars">
                Check availability
              </a>
            </MotionDiv>

            <MotionDiv
              animate="visible"
              className="hero__booking-path"
              custom={0.56}
              initial="hidden"
              variants={heroFadeVariants}
            >
              {bookingSteps.map((step, index) => (
                <div className="hero__booking-step" key={step}>
                  <span>{`0${index + 1}`}</span>
                  <p>{step}</p>
                </div>
              ))}
            </MotionDiv>
          </div>

          <MotionDiv
            animate="visible"
            className="hero__visual-stage"
            custom={0.62}
            initial="hidden"
            variants={heroFadeVariants}
          >
            <MotionDiv
              className="hero__visual-shell"
              style={{
                x: visualX,
                y: visualY,
                rotateX: visualRotateX,
                rotateY: visualRotateY,
              }}
            >
              <MotionDiv
                className="hero__visual-layer hero__visual-layer--back"
                style={{ x: backLayerX, y: backLayerY }}
              />
              <MotionDiv
                className="hero__visual-layer hero__visual-layer--mid"
                style={{ x: midLayerX, y: midLayerY }}
              />

              <div className="hero__visual">
                {heroCar ? (
                  <>
                    <img
                      alt={`${heroCar.brand} ${heroCar.model}`}
                      className="hero__image"
                      decoding="async"
                      src={heroCar.image}
                    />
                    <MotionDiv
                      className="hero__visual-chip hero__visual-chip--top"
                      style={{ x: chipTopX, y: chipTopY }}
                    >
                      <span>Concierge response</span>
                      <strong>~15 min</strong>
                    </MotionDiv>
                    <MotionDiv
                      className="hero__visual-chip hero__visual-chip--bottom"
                      style={{ x: chipBottomX, y: chipBottomY }}
                    >
                      <span>Verified fleet</span>
                      <strong>Premium only</strong>
                    </MotionDiv>
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
        className="proof-strip"
        initial="hidden"
        variants={proofContainerVariants}
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
        aria-labelledby="featured-cars-heading"
        id="featured-cars"
        initial="hidden"
        viewport={viewportSettings}
        whileInView="visible"
      >
        <MotionDiv
          className="section-header section-header--split"
          variants={sectionSlideVariants}
        >
          <div>
            <span className="eyebrow">Featured fleet</span>
            <h2 id="featured-cars-heading">Check availability for the most requested cars.</h2>
          </div>
          <p>
            The homepage now leads directly into the inventory. Each card keeps the
            booking path visible and easy to continue.
          </p>
        </MotionDiv>

        {isLoading ? <LoadingFleet count={3} /> : null}
        {!isLoading && errorMessage ? (
          <div className="empty-state">{errorMessage}</div>
        ) : null}
        {!isLoading && !errorMessage ? (
          <MotionDiv
            className="cars-grid"
            initial="hidden"
            variants={cardsContainerVariants}
            viewport={viewportSettings}
            whileInView="visible"
          >
            {cars.map((car) => (
              <MotionDiv key={car.id} variants={cardRevealVariants}>
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
        className="benefits-section"
        initial="hidden"
        viewport={viewportSettings}
        whileInView="visible"
      >
        <div className="benefits-section__frame">
          <MotionDiv
            className="benefits-section__intro"
            variants={sectionRevealVariants}
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

          <MotionDiv className="benefits-grid" variants={cardsContainerVariants}>
            {benefitItems.map((item) => (
              <MotionArticle
                className="benefit-card"
                key={item.title}
                variants={cardRevealVariants}
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
        className="closing-cta"
        id="booking-path"
        initial="hidden"
        viewport={viewportSettings}
        whileInView="visible"
      >
        <MotionDiv className="closing-cta__panel" variants={sectionRevealVariants}>
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
            <div className="closing-cta__steps">
              {bookingSteps.map((step, index) => (
                <div className="closing-cta__step" key={step}>
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>

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
