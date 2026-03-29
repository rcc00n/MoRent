import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import PageVisualStack from '../components/PageVisualStack'
import { pageMedia } from '../content/mediaLibrary'

function Terms() {
  const { t } = useTranslation()
  const termsSections = t('terms.sections', { returnObjects: true })

  return (
    <div className="content-page">
      <section className="page-hero scene scene--fleet">
        <div className="page-hero__grid">
          <div className="page-hero__content">
            <span className="page-eyebrow">{t('terms.eyebrow')}</span>
            <h1>{t('terms.title')}</h1>
            <p>{t('terms.description')}</p>
          </div>

          <PageVisualStack
            primary={pageMedia.sunsetCoast}
            primaryAlt={t('terms.visuals.primaryAlt')}
            primaryCaption={t('terms.visuals.primaryCaption')}
            secondary={pageMedia.coastalHighway}
            secondaryAlt={t('terms.visuals.secondaryAlt')}
            secondaryCaption={t('terms.visuals.secondaryCaption')}
          />
        </div>
      </section>

      <section className="legal-grid">
        {termsSections.map((section) => (
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
          <h2>{t('terms.ctaTitle')}</h2>
          <p>{t('terms.ctaDescription')}</p>
        </div>

        <div className="button-row">
          <Link className="button button--secondary" to="/privacy">
            {t('common.actions.privacyPolicy')}
          </Link>
          <Link className="button button--primary" to="/faq">
            {t('common.actions.readFaq')}
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Terms
