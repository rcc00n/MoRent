import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import PageVisualStack from '../components/PageVisualStack'
import Seo from '../components/Seo'
import { pageMedia } from '../content/mediaLibrary'
import { useLegalPage } from '../hooks/useSiteContent'
import { buildCmsMetadata } from '../seo/cmsMetadata'
import { getRuntimeSiteUrl } from '../seo/site'
import { mergeContent } from '../shared/content'

function Privacy() {
  const { i18n, t } = useTranslation()
  const siteUrl = getRuntimeSiteUrl()
  const { data: remotePrivacyContent } = useLegalPage('privacy', i18n.resolvedLanguage)
  const fallbackContent = {
    eyebrow: t('privacy.eyebrow'),
    title: t('privacy.title'),
    description: t('privacy.description'),
    sections: t('privacy.sections', { returnObjects: true }),
    cta: {
      title: t('privacy.ctaTitle'),
      description: t('privacy.ctaDescription'),
    },
    visuals: {
      primary_image: pageMedia.mercedesInterior,
      primary_alt: t('privacy.visuals.primaryAlt'),
      primary_caption: t('privacy.visuals.primaryCaption'),
      secondary_image: pageMedia.sunsetArrival,
      secondary_alt: t('privacy.visuals.secondaryAlt'),
      secondary_caption: t('privacy.visuals.secondaryCaption'),
    },
    seo: {
      title: t('metadata.pages.privacy.title'),
      description: t('metadata.pages.privacy.description'),
    },
  }
  const privacyContent = mergeContent(fallbackContent, remotePrivacyContent || {})
  const privacySeo = buildCmsMetadata({
    pathname: '/privacy',
    siteUrl,
    language: i18n.resolvedLanguage,
    title: privacyContent.seo.title,
    description: privacyContent.seo.description,
  })

  return (
    <div className="content-page">
      <Seo {...privacySeo} />
      <section className="page-hero scene scene--benefits">
        <div className="page-hero__grid">
          <div className="page-hero__content">
            <span className="page-eyebrow">{privacyContent.eyebrow}</span>
            <h1>{privacyContent.title}</h1>
            <p>{privacyContent.description}</p>
          </div>

          <PageVisualStack
            primary={privacyContent.visuals.primary_image}
            primaryAlt={privacyContent.visuals.primary_alt}
            primaryCaption={privacyContent.visuals.primary_caption}
            secondary={privacyContent.visuals.secondary_image}
            secondaryAlt={privacyContent.visuals.secondary_alt}
            secondaryCaption={privacyContent.visuals.secondary_caption}
          />
        </div>
      </section>

      <section className="legal-grid">
        {privacyContent.sections.map((section) => (
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
          <h2>{privacyContent.cta.title}</h2>
          <p>{privacyContent.cta.description}</p>
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
