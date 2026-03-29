import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import PageVisualStack from '../components/PageVisualStack'
import Seo from '../components/Seo'
import { pageMedia } from '../content/mediaLibrary'
import { usePageContent } from '../hooks/useSiteContent'
import { buildCmsMetadata } from '../seo/cmsMetadata'
import { getRuntimeSiteUrl } from '../seo/site'
import { mergeContent } from '../shared/content'

function About() {
  const { i18n, t } = useTranslation()
  const siteUrl = getRuntimeSiteUrl()
  const { data: remoteAboutContent } = usePageContent('about', i18n.resolvedLanguage)
  const fallbackContent = {
    eyebrow: t('about.eyebrow'),
    title: t('about.title'),
    description: t('about.description'),
    section: {
      title: t('about.sectionTitle'),
      description: t('about.sectionDescription'),
    },
    stats: t('about.stats', { returnObjects: true }),
    principles: t('about.principles', { returnObjects: true }),
    cta: {
      title: t('about.ctaTitle'),
      description: t('about.ctaDescription'),
    },
    visuals: {
      primary_image: pageMedia.sunsetCoast,
      primary_alt: t('about.visuals.primaryAlt'),
      primary_caption: t('about.visuals.primaryCaption'),
      secondary_image: '',
      secondary_alt: '',
      secondary_caption: '',
    },
    seo: {
      title: t('metadata.pages.about.title'),
      description: t('metadata.pages.about.description'),
    },
  }
  const aboutContent = mergeContent(fallbackContent, remoteAboutContent || {})
  const aboutSeo = buildCmsMetadata({
    pathname: '/about',
    siteUrl,
    language: i18n.resolvedLanguage,
    title: aboutContent.seo.title,
    description: aboutContent.seo.description,
  })

  return (
    <div className="content-page">
      <Seo {...aboutSeo} />
      <section className="page-hero scene scene--fleet">
        <div className="page-hero__grid">
          <div className="page-hero__content">
            <span className="page-eyebrow">{aboutContent.eyebrow}</span>
            <h1>{aboutContent.title}</h1>
            <p>{aboutContent.description}</p>
          </div>

          <PageVisualStack
            primary={aboutContent.visuals.primary_image}
            primaryAlt={aboutContent.visuals.primary_alt}
            primaryCaption={aboutContent.visuals.primary_caption}
            secondary={aboutContent.visuals.secondary_image}
            secondaryAlt={aboutContent.visuals.secondary_alt}
            secondaryCaption={aboutContent.visuals.secondary_caption}
          />
        </div>

        <div className="page-hero__aside">
          {aboutContent.stats.map((item) => (
            <div className="info-chip" key={`${item.label}-${item.value}`}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-header section-header--split">
          <div>
            <h2>{aboutContent.section.title}</h2>
          </div>
          <p>{aboutContent.section.description}</p>
        </div>

        <div className="info-grid">
          {aboutContent.principles.map((item) => (
            <article className="info-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-panel">
        <div>
          <h2>{aboutContent.cta.title}</h2>
          <p>{aboutContent.cta.description}</p>
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
