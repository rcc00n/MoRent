import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import FaqList from '../components/FaqList'
import PageVisualStack from '../components/PageVisualStack'
import { pageMedia } from '../content/mediaLibrary'

function FAQ() {
  const { t } = useTranslation()
  const faqItems = t('faq.items', { returnObjects: true })

  return (
    <div className="content-page">
      <section className="page-hero scene scene--benefits">
        <div className="page-hero__grid">
          <div className="page-hero__content">
            <span className="page-eyebrow">{t('faq.eyebrow')}</span>
            <h1>{t('faq.title')}</h1>
            <p>{t('faq.description')}</p>
          </div>

          <PageVisualStack
            primary={pageMedia.mercedesInterior}
            primaryAlt={t('faq.visuals.primaryAlt')}
            primaryCaption={t('faq.visuals.primaryCaption')}
            secondary={pageMedia.compactCoastal}
            secondaryAlt={t('faq.visuals.secondaryAlt')}
            secondaryCaption={t('faq.visuals.secondaryCaption')}
          />
        </div>
      </section>

      <section className="page-section">
        <FaqList items={faqItems} />
      </section>

      <section className="cta-panel">
        <div>
          <h2>{t('faq.ctaTitle')}</h2>
          <p>{t('faq.ctaDescription')}</p>
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

export default FAQ
