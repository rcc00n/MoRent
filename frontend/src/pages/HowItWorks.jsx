import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import PageVisualStack from '../components/PageVisualStack'
import Seo from '../components/Seo'
import { pageMedia } from '../content/mediaLibrary'
import { usePageContent } from '../hooks/useSiteContent'
import { buildCmsMetadata } from '../seo/cmsMetadata'
import { getRuntimeSiteUrl } from '../seo/site'
import { mergeContent } from '../shared/content'

function HowItWorks() {
  const { i18n, t } = useTranslation()
  const siteUrl = getRuntimeSiteUrl()
  const { data: remoteHowItWorksContent } = usePageContent(
    'how-it-works',
    i18n.resolvedLanguage,
  )
  const fallbackContent = {
    eyebrow: t('howItWorks.eyebrow'),
    title: t('howItWorks.title'),
    description: t('howItWorks.description'),
    steps: t('howItWorks.steps', { returnObjects: true }),
    highlights: t('howItWorks.highlights', { returnObjects: true }),
    cta: {
      title: t('howItWorks.ctaTitle'),
      description: t('howItWorks.ctaDescription'),
      faq_label: t('howItWorks.ctaFaq'),
    },
    visuals: {
      primary_image: pageMedia.coastalHighway,
      primary_alt: t('howItWorks.visuals.primaryAlt'),
      primary_caption: t('howItWorks.visuals.primaryCaption'),
      secondary_image: '',
      secondary_alt: '',
      secondary_caption: '',
    },
    seo: {
      title: t('metadata.pages.howItWorks.title'),
      description: t('metadata.pages.howItWorks.description'),
    },
  }
  const howItWorksContent = mergeContent(
    fallbackContent,
    remoteHowItWorksContent || {},
  )
  const howItWorksSeo = buildCmsMetadata({
    pathname: '/how-it-works',
    siteUrl,
    language: i18n.resolvedLanguage,
    title: howItWorksContent.seo.title,
    description: howItWorksContent.seo.description,
  })

  return (
    <div className="content-page">
      <Seo {...howItWorksSeo} />
      <section className="page-hero scene scene--closing">
        <div className="page-hero__grid">
          <div className="page-hero__content">
            <span className="page-eyebrow">{howItWorksContent.eyebrow}</span>
            <h1>{howItWorksContent.title}</h1>
            <p>{howItWorksContent.description}</p>
          </div>

          <PageVisualStack
            primary={howItWorksContent.visuals.primary_image}
            primaryAlt={howItWorksContent.visuals.primary_alt}
            primaryCaption={howItWorksContent.visuals.primary_caption}
            secondary={howItWorksContent.visuals.secondary_image}
            secondaryAlt={howItWorksContent.visuals.secondary_alt}
            secondaryCaption={howItWorksContent.visuals.secondary_caption}
          />
        </div>
      </section>

      <section className="process-grid">
        {howItWorksContent.steps.map((step, index) => (
          <article className="process-card" key={step.title}>
            <span>{index + 1}</span>
            <h2>{step.title}</h2>
            <p>{step.description}</p>
          </article>
        ))}
      </section>

      <section className="info-grid">
        {howItWorksContent.highlights.map((item) => (
          <article className="info-card" key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </article>
        ))}
      </section>

      <section className="cta-panel">
        <div>
          <h2>{howItWorksContent.cta.title}</h2>
          <p>{howItWorksContent.cta.description}</p>
        </div>

        <div className="button-row">
          <Link className="button button--primary" to="/catalog">
            {t('common.actions.openFleet')}
          </Link>
          <Link className="button button--secondary" to="/faq">
            {howItWorksContent.cta.faq_label}
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HowItWorks
