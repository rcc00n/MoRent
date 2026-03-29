import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import PageVisualStack from '../components/PageVisualStack'
import { pageMedia } from '../content/mediaLibrary'

function About() {
  const { t } = useTranslation()
  const aboutStats = t('about.stats', { returnObjects: true })
  const aboutPrinciples = t('about.principles', { returnObjects: true })

  return (
    <div className="content-page">
      <section className="page-hero scene scene--fleet">
        <div className="page-hero__grid">
          <div className="page-hero__content">
            <span className="page-eyebrow">{t('about.eyebrow')}</span>
            <h1>{t('about.title')}</h1>
            <p>{t('about.description')}</p>
          </div>

          <PageVisualStack
            primary={pageMedia.sunsetCoast}
            primaryAlt={t('about.visuals.primaryAlt')}
            primaryCaption={t('about.visuals.primaryCaption')}
            secondary={pageMedia.compactCoastal}
            secondaryAlt={t('about.visuals.secondaryAlt')}
            secondaryCaption={t('about.visuals.secondaryCaption')}
          />
        </div>

        <div className="page-hero__aside">
          {aboutStats.map((item) => (
            <div className="info-chip" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-header section-header--split">
          <div>
            <h2>{t('about.sectionTitle')}</h2>
          </div>
          <p>{t('about.sectionDescription')}</p>
        </div>

        <div className="info-grid">
          {aboutPrinciples.map((item) => (
            <article className="info-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-panel">
        <div>
          <h2>{t('about.ctaTitle')}</h2>
          <p>{t('about.ctaDescription')}</p>
        </div>

        <div className="button-row">
          <Link className="button button--primary" to="/catalog">
            {t('common.actions.viewFleet')}
          </Link>
          <Link className="button button--secondary" to="/contacts">
            {t('common.actions.contactDetails')}
          </Link>
        </div>
      </section>
    </div>
  )
}

export default About
