import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import PageVisualStack from '../components/PageVisualStack'
import Seo from '../components/Seo'
import { pageMedia } from '../content/mediaLibrary'
import { useLegalPage } from '../hooks/useSiteContent'
import { buildCmsMetadata } from '../seo/cmsMetadata'
import { getRuntimeSiteUrl } from '../seo/site'
import { mergeContent } from '../shared/content'

function Terms() {
  const { i18n, t } = useTranslation()
  const siteUrl = getRuntimeSiteUrl()
  const { data: remoteTermsContent } = useLegalPage('terms', i18n.resolvedLanguage)
  const fallbackContent = {
    eyebrow: t('terms.eyebrow'),
    title: t('terms.title'),
    description: t('terms.description'),
    sections: t('terms.sections', { returnObjects: true }),
    cta: {
      title: t('terms.ctaTitle'),
      description: t('terms.ctaDescription'),
    },
    visuals: {
      primary_image: pageMedia.sunsetCoast,
      primary_alt: t('terms.visuals.primaryAlt'),
      primary_caption: t('terms.visuals.primaryCaption'),
      secondary_image: pageMedia.coastalHighway,
      secondary_alt: t('terms.visuals.secondaryAlt'),
      secondary_caption: t('terms.visuals.secondaryCaption'),
    },
    seo: {
      title: t('metadata.pages.terms.title'),
      description: t('metadata.pages.terms.description'),
    },
  }
  const termsContent = mergeContent(fallbackContent, remoteTermsContent || {})
  const termsSeo = buildCmsMetadata({
    pathname: '/terms',
    siteUrl,
    language: i18n.resolvedLanguage,
    title: termsContent.seo.title,
    description: termsContent.seo.description,
  })

  return (
    <div className="content-page">
      <Seo {...termsSeo} />
      <section className="page-hero scene scene--fleet">
        <div className="page-hero__grid">
          <div className="page-hero__content">
            <span className="page-eyebrow">{termsContent.eyebrow}</span>
            <h1>{termsContent.title}</h1>
            <p>{termsContent.description}</p>
          </div>

          <PageVisualStack
            primary={termsContent.visuals.primary_image}
            primaryAlt={termsContent.visuals.primary_alt}
            primaryCaption={termsContent.visuals.primary_caption}
            secondary={termsContent.visuals.secondary_image}
            secondaryAlt={termsContent.visuals.secondary_alt}
            secondaryCaption={termsContent.visuals.secondary_caption}
          />
        </div>
      </section>

      <section className="legal-grid">
        {termsContent.sections.map((section) => (
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
          <h2>{termsContent.cta.title}</h2>
          <p>{termsContent.cta.description}</p>
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
