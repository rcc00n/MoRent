import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import PageVisualStack from '../components/PageVisualStack'
import { pageMedia } from '../content/mediaLibrary'

function Contacts() {
  const { t } = useTranslation()
  const contactHighlights = t('contacts.highlights', { returnObjects: true })
  const contactSummary = t('contacts.summary', { returnObjects: true })

  return (
    <div className="content-page">
      <section className="page-hero scene scene--destination">
        <div className="page-hero__grid">
          <div className="page-hero__content">
            <span className="page-eyebrow">{t('contacts.eyebrow')}</span>
            <h1>{t('contacts.title')}</h1>
            <p>{t('contacts.description')}</p>
          </div>

          <PageVisualStack
            primary={pageMedia.sunsetArrival}
            primaryAlt={t('contacts.visuals.primaryAlt')}
            primaryCaption={t('contacts.visuals.primaryCaption')}
          />
        </div>

        <div className="contact-summary">
          {contactSummary.map((item) => (
            <div className="contact-summary__item" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="info-grid">
          {contactHighlights.map((item) => (
            <article className="info-card" key={item.title}>
              <h2>{item.title}</h2>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-panel" id="request">
        <div>
          <h2>{t('contacts.ctaTitle')}</h2>
          <p>{t('contacts.ctaDescription')}</p>
        </div>

        <div className="button-row">
          <Link className="button button--primary" to="/catalog">
            {t('common.actions.startRequest')}
          </Link>
          <Link className="button button--secondary" to="/faq">
            {t('common.actions.readFaq')}
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Contacts
