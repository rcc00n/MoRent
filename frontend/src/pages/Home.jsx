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
import Seo from '../components/Seo'
import coastalRoadHero from '../assets/coastal-road-hero.webp'
import { enrichCarMedia, pageMedia } from '../content/mediaLibrary'
import {
  useFaqItems,
  usePageContent,
  useSiteSettings,
} from '../hooks/useSiteContent'
import { buildCmsMetadata } from '../seo/cmsMetadata'
import { getRuntimeSiteUrl } from '../seo/site'
import { getCars } from '../shared/api'
import { mergeContent } from '../shared/content'
import {
  resetInteractiveGlow,
  updateInteractiveGlow,
} from '../shared/interactiveSurface'

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

const featuredCarsCache = new Map()
const featuredCarsRequest = new Map()

function formatPrice(price, suffix) {
  return `${Number(price).toFixed(0)} ${suffix}`
}

function loadFeaturedCars(language) {
  if (featuredCarsCache.has(language)) {
    return Promise.resolve(featuredCarsCache.get(language))
  }

  if (!featuredCarsRequest.has(language)) {
    featuredCarsRequest.set(
      language,
      getCars({ featured: '1', lang: language })
        .then(async ({ data }) => {
          if (data.length) {
            return data
          }

          const fallbackResponse = await getCars({ lang: language })
          return fallbackResponse.data
        })
        .then((data) => {
          const nextCars = data.slice(0, 3).map(enrichCarMedia)
          featuredCarsCache.set(language, nextCars)
          return nextCars
        })
        .finally(() => {
          featuredCarsRequest.delete(language)
        }),
    )
  }

  return featuredCarsRequest.get(language)
}

function Home() {
  const { i18n, t } = useTranslation()
  const siteUrl = getRuntimeSiteUrl()
  const { data: remoteSettings } = useSiteSettings(i18n.resolvedLanguage)
  const { data: remoteHomeContent } = usePageContent('home', i18n.resolvedLanguage)
  const { data: remoteFaqItems } = useFaqItems(i18n.resolvedLanguage)
  const [cars, setCars] = useState(
    () => featuredCarsCache.get(i18n.resolvedLanguage) ?? [],
  )
  const [loadedLanguage, setLoadedLanguage] = useState(i18n.resolvedLanguage)
  const [hasLoadError, setHasLoadError] = useState(false)
  const heroRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const fallbackHomeContent = {
    hero: {
      title: t('home.hero.title'),
      description: t('home.hero.description'),
      background_image: coastalRoadHero,
    },
    signal: {
      title: t('home.signal.title'),
    },
    featured: {
      title: t('home.featured.title'),
      description: t('home.featured.description'),
      more_options: t('home.featured.moreOptions'),
    },
    destination: {
      title: t('home.destination.title'),
      description: t('home.destination.description'),
      image: pageMedia.compactCoastal,
      image_alt: t('home.destination.imageAlt'),
    },
    benefits: {
      title: t('home.benefits.title'),
      description: t('home.benefits.description'),
      process_items: t('home.benefits.processItems', { returnObjects: true }),
    },
    faq_preview: {
      title: t('home.faqPreview.title'),
      description: t('home.faqPreview.description'),
      more_details: t('home.faqPreview.moreDetails'),
    },
    closing: {
      title: t('home.closing.title'),
      description: t('home.closing.description'),
      steps: t('home.closing.steps', { returnObjects: true }),
    },
    seo: {
      title: t('metadata.pages.home.title'),
      description: t('metadata.pages.home.description'),
    },
  }
  const fallbackSettings = {
    cta_labels: {
      primary: t('common.actions.bookNow'),
      availability: t('common.actions.checkAvailability'),
    },
  }
  const homeContent = mergeContent(fallbackHomeContent, remoteHomeContent || {})
  const siteSettings = mergeContent(fallbackSettings, remoteSettings || {})
  const faqItems = mergeContent(
    t('faq.items', { returnObjects: true }),
    remoteFaqItems || [],
  )
  const cachedCars = featuredCarsCache.get(i18n.resolvedLanguage)
  const visibleCars =
    cachedCars ||
    (loadedLanguage === i18n.resolvedLanguage ? cars : [])
  const visibleIsLoading =
    !cachedCars && loadedLanguage !== i18n.resolvedLanguage
  const visibleHasLoadError =
    !visibleIsLoading &&
    loadedLanguage === i18n.resolvedLanguage &&
    hasLoadError

  useEffect(() => {
    let active = true

    if (cachedCars) {
      return () => {
        active = false
      }
    }

    loadFeaturedCars(i18n.resolvedLanguage)
      .then((nextCars) => {
        if (!active) {
          return
        }

        setCars(nextCars)
        setLoadedLanguage(i18n.resolvedLanguage)
        setHasLoadError(false)
      })
      .catch(() => {
        if (!active) {
          return
        }

        setLoadedLanguage(i18n.resolvedLanguage)
        setHasLoadError(true)
      })

    return () => {
      active = false
    }
  }, [cachedCars, i18n.resolvedLanguage])

  const driftAmount = shouldReduceMotion ? 0 : 12
  const glowY = useTransform(scrollYProgress, [0, 1], [0, driftAmount])
  const beamY = useTransform(scrollYProgress, [0, 1], [0, -8])
  const coastalY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 18])
  const visualY = useTransform(scrollYProgress, [0, 1], [0, -6])
  const processItems = homeContent.benefits.process_items
  const bookingSteps = homeContent.closing.steps
  const heroCar = visibleCars[0]
  const homeSeo = buildCmsMetadata({
    pathname: '/',
    siteUrl,
    language: i18n.resolvedLanguage,
    title: homeContent.seo.title,
    description: homeContent.seo.description,
  })

  return (
    <div className="home-page">
      <Seo {...homeSeo} />
      <section
        className="hero hero--premium"
        ref={heroRef}
        style={{ '--hero-destination-image': `url(${homeContent.hero.background_image})` }}
      >
        <MotionDiv className="hero__destination-plane" style={{ y: coastalY }} />
        <MotionDiv className="hero__horizon-glow" style={{ y: glowY }} />
        <MotionDiv className="hero__beam hero__beam--one" style={{ y: glowY }} />
        <MotionDiv className="hero__beam hero__beam--two" style={{ y: beamY }} />
        <MotionDiv className="hero__glow hero__glow--one" style={{ y: glowY }} />
        <MotionDiv className="hero__glow hero__glow--two" style={{ y: beamY }} />

        <div className="hero__grid">
          <MotionDiv
            animate="visible"
            className="hero__content"
            initial="hidden"
            variants={heroContentVariants}
          >
            <MotionHeading className="hero__headline">
              {homeContent.hero.title}
            </MotionHeading>

            <p className="hero__description">{homeContent.hero.description}</p>

            <div className="button-row button-row--hero">
              <MagneticAction className="button button--primary" to="/catalog">
                {siteSettings.cta_labels.primary}
              </MagneticAction>
              <MagneticAction className="button button--secondary" href="#featured-cars">
                {siteSettings.cta_labels.availability}
              </MagneticAction>
            </div>
          </MotionDiv>

          <MotionDiv
            animate="visible"
            className="hero__visual-stage"
            initial="hidden"
            variants={heroVisualVariants}
          >
            <MotionDiv className="hero__visual-shell" style={{ y: visualY }}>
              <div className="hero__visual-layer hero__visual-layer--back" />
              <div className="hero__visual-layer hero__visual-layer--mid" />

              <div className="hero__visual">
                {heroCar ? (
                  <>
                    <img
                      alt={heroCar.title || `${heroCar.brand} ${heroCar.model}`}
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
          <h2 id="motion-field-heading">{homeContent.signal.title}</h2>
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
        <MotionDiv className="section-header section-header--split" variants={sectionSlideVariants}>
          <div>
            <h2 id="featured-cars-heading">{homeContent.featured.title}</h2>
          </div>
          <p>{homeContent.featured.description}</p>
        </MotionDiv>

        {visibleIsLoading ? <LoadingFleet count={3} /> : null}
        {!visibleIsLoading && visibleHasLoadError ? (
          <div className="empty-state">{t('common.errors.featuredCars')}</div>
        ) : null}
        {!visibleIsLoading && !visibleHasLoadError ? (
          <MotionDiv className="cars-grid" variants={fleetCardsContainerVariants}>
            {visibleCars.map((car) => (
              <MotionDiv key={car.id} variants={fleetCardRevealVariants}>
                <CarCard car={car} />
              </MotionDiv>
            ))}
          </MotionDiv>
        ) : null}

        {!visibleIsLoading && !visibleHasLoadError ? (
          <MotionDiv className="section-cta" variants={sectionRevealVariants}>
            <p className="muted-text">{homeContent.featured.more_options}</p>
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
            alt={homeContent.destination.image_alt}
            className="destination-section__image"
            decoding="async"
            loading="lazy"
            src={homeContent.destination.image}
            transition={{ duration: 0.7, ease: premiumEase }}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.035, y: -4 }}
          />
        </MotionDiv>

        <MotionDiv className="destination-section__content" variants={sectionRevealVariants}>
          <h2>{homeContent.destination.title}</h2>
          <p>{homeContent.destination.description}</p>
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
          <MotionDiv className="benefits-section__intro" variants={benefitsIntroVariants}>
            <h2>{homeContent.benefits.title}</h2>
            <p>{homeContent.benefits.description}</p>
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
        <MotionDiv className="section-header section-header--split" variants={sectionSlideVariants}>
          <div>
            <h2>{homeContent.faq_preview.title}</h2>
          </div>
          <p>{homeContent.faq_preview.description}</p>
        </MotionDiv>

        <FaqList items={faqItems.slice(0, 4)} />

        <MotionDiv className="section-cta" variants={sectionRevealVariants}>
          <p className="muted-text">{homeContent.faq_preview.more_details}</p>
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
            <h2>{homeContent.closing.title}</h2>
            <p>{homeContent.closing.description}</p>
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
                {siteSettings.cta_labels.primary}
              </MagneticAction>
              <MagneticAction className="button button--secondary" href="#featured-cars">
                {siteSettings.cta_labels.availability}
              </MagneticAction>
            </div>
          </div>
        </MotionDiv>
      </MotionSection>
    </div>
  )
}

export default Home
