import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import PageVisualStack from '../components/PageVisualStack'
import { pageMedia } from '../content/mediaLibrary'

function Privacy() {
  const { t } = useTranslation()
  const privacySections = t('privacy.sections', { returnObjects: true })

  return (
    <div className="content-page">
      <section className="page-hero scene scene--benefits">
        <div className="page-hero__grid">
          <div className="page-hero__content">
            <span className="page-eyebrow">{t('privacy.eyebrow')}</span>
            <h1>{t('privacy.title')}</h1>
            <p>{t('privacy.description')}</p>
          </div>

          <PageVisualStack
            primary={pageMedia.mercedesInterior}
            primaryAlt={t('privacy.visuals.primaryAlt')}
            primaryCaption={t('privacy.visuals.primaryCaption')}
            secondary={pageMedia.sunsetArrival}
            secondaryAlt={t('privacy.visuals.secondaryAlt')}
            secondaryCaption={t('privacy.visuals.secondaryCaption')}
          />
        </div>
      </section>

      <section className="legal-grid">
        {privacySections.map((section) => (
          <article className="legal-card" key={section.title}>
            <h2>{section.title}</h2>
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="cta-panel">
        <div>
          <h2>{t('privacy.ctaTitle')}</h2>
          <p>{t('privacy.ctaDescription')}</p>
        </div>

        <div className="button-row">
          <Link className="button button--primary" to="/catalog">
            {t('common.actions.viewFleet')}
          </Link>
          <Link className="button button--secondary" to="/terms">
            {t('common.actions.rentalTerms')}
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Privacy
