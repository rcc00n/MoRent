import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { useTranslation } from 'react-i18next'

import CarCard from '../components/CarCard'
import DotFieldCanvas from '../components/DotFieldCanvas'
import FaqList from '../components/FaqList'
import LoadingFleet from '../components/LoadingFleet'
import MagneticAction from '../components/MagneticAction'
import coastalRoadHero from '../assets/coastal-road-hero.webp'
import { enrichCarMedia, pageMedia } from '../content/mediaLibrary'
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

function formatPrice(price, suffix) {
  return `${Number(price).toFixed(0)} ${suffix}`
}

function loadFeaturedCars() {
  if (featuredCarsCache !== null) {
    return Promise.resolve(featuredCarsCache)
  }

  if (!featuredCarsRequest) {
    featuredCarsRequest = getCars()
      .then(({ data }) => {
        featuredCarsCache = data.slice(0, 3).map(enrichCarMedia)

        return featuredCarsCache
      })
      .finally(() => {
        featuredCarsRequest = null
      })
  }

  return featuredCarsRequest
}

function Home() {
  const { t } = useTranslation()
  const [cars, setCars] = useState(() => featuredCarsCache ?? [])
  const [isLoading, setIsLoading] = useState(() => featuredCarsCache === null)
  const [hasLoadError, setHasLoadError] = useState(false)
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
  const proofItems = t('home.benefits.proofItems', { returnObjects: true })
  const processItems = t('home.benefits.processItems', { returnObjects: true })
  const bookingSteps = t('home.closing.steps', { returnObjects: true })
  const faqItems = t('faq.items', { returnObjects: true })

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

        setHasLoadError(true)
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
              {t('home.hero.title')}
            </MotionHeading>

            <p className="hero__description">{t('home.hero.description')}</p>

            <div className="button-row button-row--hero">
              <MagneticAction className="button button--primary" to="/catalog">
                {t('common.actions.bookNow')}
              </MagneticAction>
              <MagneticAction className="button button--secondary" href="#featured-cars">
                {t('common.actions.checkAvailability')}
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
                      <strong>
                        {formatPrice(heroCar.price_per_day, t('common.pricing.perDay'))}
                      </strong>
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
          <h2 id="motion-field-heading">{t('home.signal.title')}</h2>
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
            <h2 id="featured-cars-heading">{t('home.featured.title')}</h2>
          </div>
          <p>{t('home.featured.description')}</p>
        </MotionDiv>

        {isLoading ? <LoadingFleet count={3} /> : null}
        {!isLoading && hasLoadError ? (
          <div className="empty-state">{t('common.errors.featuredCars')}</div>
        ) : null}
        {!isLoading && !hasLoadError ? (
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

        {!isLoading && !hasLoadError ? (
          <MotionDiv className="section-cta" variants={sectionRevealVariants}>
            <p className="muted-text">{t('home.featured.moreOptions')}</p>
            <MagneticAction className="button button--secondary" to="/catalog">
              {t('common.actions.viewAllCars')}
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
            alt={t('home.destination.imageAlt')}
            className="destination-section__image"
            decoding="async"
            loading="lazy"
            src={pageMedia.compactCoastal}
            transition={{ duration: 0.7, ease: premiumEase }}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.035, y: -4 }}
          />
        </MotionDiv>

        <MotionDiv className="destination-section__content" variants={sectionRevealVariants}>
          <h2>{t('home.destination.title')}</h2>
          <p>{t('home.destination.description')}</p>
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
            <h2>{t('home.benefits.title')}</h2>
            <p>{t('home.benefits.description')}</p>
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
              aria-label={item.title}
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
        className="faq-preview scene scene--fleet"
        initial="hidden"
        variants={sectionRevealVariants}
        viewport={viewportSettings}
        whileInView="visible"
      >
        <MotionDiv
          className="section-header section-header--split"
          variants={sectionSlideVariants}
        >
          <div>
            <h2>{t('home.faqPreview.title')}</h2>
          </div>
          <p>{t('home.faqPreview.description')}</p>
        </MotionDiv>

        <FaqList items={faqItems.slice(0, 4)} />

        <MotionDiv className="section-cta" variants={sectionRevealVariants}>
          <p className="muted-text">{t('home.faqPreview.moreDetails')}</p>
          <MagneticAction className="button button--secondary" to="/faq">
            {t('common.actions.openFullFaq')}
          </MagneticAction>
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
            <h2>{t('home.closing.title')}</h2>
            <p>{t('home.closing.description')}</p>
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
                {t('common.actions.bookNow')}
              </MagneticAction>
              <MagneticAction className="button button--secondary" href="#featured-cars">
                {t('common.actions.checkAvailability')}
              </MagneticAction>
            </div>
          </div>
        </MotionDiv>
      </MotionSection>
    </div>
  )
}

export default Home
