import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import PageVisualStack from '../components/PageVisualStack'
import { pageMedia } from '../content/mediaLibrary'

function HowItWorks() {
  const { t } = useTranslation()
  const bookingProcessSteps = t('howItWorks.steps', { returnObjects: true })
  const highlightCards = t('howItWorks.highlights', { returnObjects: true })

  return (
    <div className="content-page">
      <section className="page-hero scene scene--closing">
        <div className="page-hero__grid">
          <div className="page-hero__content">
            <span className="page-eyebrow">{t('howItWorks.eyebrow')}</span>
            <h1>{t('howItWorks.title')}</h1>
            <p>{t('howItWorks.description')}</p>
          </div>

          <PageVisualStack
            primary={pageMedia.coastalHighway}
            primaryAlt={t('howItWorks.visuals.primaryAlt')}
            primaryCaption={t('howItWorks.visuals.primaryCaption')}
            secondary={pageMedia.sunsetArrival}
            secondaryAlt={t('howItWorks.visuals.secondaryAlt')}
            secondaryCaption={t('howItWorks.visuals.secondaryCaption')}
          />
        </div>
      </section>

      <section className="process-grid">
        {bookingProcessSteps.map((step, index) => (
          <article className="process-card" key={step.title}>
            <span>{index + 1}</span>
            <h2>{step.title}</h2>
            <p>{step.description}</p>
          </article>
        ))}
      </section>

      <section className="info-grid">
        {highlightCards.map((item) => (
          <article className="info-card" key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </article>
        ))}
      </section>

      <section className="cta-panel">
        <div>
          <h2>{t('howItWorks.ctaTitle')}</h2>
          <p>{t('howItWorks.ctaDescription')}</p>
        </div>

        <div className="button-row">
          <Link className="button button--primary" to="/catalog">
            {t('common.actions.openFleet')}
          </Link>
          <Link className="button button--secondary" to="/faq">
            {t('howItWorks.ctaFaq')}
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HowItWorks
