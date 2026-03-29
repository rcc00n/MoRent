import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import FaqList from '../components/FaqList'
import PageVisualStack from '../components/PageVisualStack'
import Seo from '../components/Seo'
import { pageMedia } from '../content/mediaLibrary'
import {
  useFaqItems,
  usePageContent,
} from '../hooks/useSiteContent'
import { buildCmsMetadata } from '../seo/cmsMetadata'
import { buildLocalizedUrl, getRuntimeSiteUrl } from '../seo/site'
import { mergeContent } from '../shared/content'

function FAQ() {
  const { i18n, t } = useTranslation()
  const siteUrl = getRuntimeSiteUrl()
  const { data: remoteFaqPage } = usePageContent('faq', i18n.resolvedLanguage)
  const { data: remoteFaqItems } = useFaqItems(i18n.resolvedLanguage)
  const fallbackContent = {
    eyebrow: t('faq.eyebrow'),
    title: t('faq.title'),
    description: t('faq.description'),
    cta: {
      title: t('faq.ctaTitle'),
      description: t('faq.ctaDescription'),
    },
    visuals: {
      primary_image: pageMedia.mercedesInterior,
      primary_alt: t('faq.visuals.primaryAlt'),
      primary_caption: t('faq.visuals.primaryCaption'),
      secondary_image: pageMedia.compactCoastal,
      secondary_alt: t('faq.visuals.secondaryAlt'),
      secondary_caption: t('faq.visuals.secondaryCaption'),
    },
    seo: {
      title: t('metadata.pages.faq.title'),
      description: t('metadata.pages.faq.description'),
    },
  }
  const faqContent = mergeContent(fallbackContent, remoteFaqPage || {})
  const faqItems = mergeContent(
    t('faq.items', { returnObjects: true }),
    remoteFaqItems || [],
  )
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    url: buildLocalizedUrl('/faq', i18n.resolvedLanguage, siteUrl),
    inLanguage: i18n.resolvedLanguage,
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
  const faqSeo = buildCmsMetadata({
    pathname: '/faq',
    siteUrl,
    language: i18n.resolvedLanguage,
    title: faqContent.seo.title,
    description: faqContent.seo.description,
    structuredData: faqStructuredData,
  })

  return (
    <div className="content-page">
      <Seo {...faqSeo} />
      <section className="page-hero scene scene--benefits">
        <div className="page-hero__grid">
          <div className="page-hero__content">
            <span className="page-eyebrow">{faqContent.eyebrow}</span>
            <h1>{faqContent.title}</h1>
            <p>{faqContent.description}</p>
          </div>

          <PageVisualStack
            primary={faqContent.visuals.primary_image}
            primaryAlt={faqContent.visuals.primary_alt}
            primaryCaption={faqContent.visuals.primary_caption}
            secondary={faqContent.visuals.secondary_image}
            secondaryAlt={faqContent.visuals.secondary_alt}
            secondaryCaption={faqContent.visuals.secondary_caption}
          />
        </div>
      </section>

      <section className="page-section">
        <FaqList items={faqItems} />
      </section>

      <section className="cta-panel">
        <div>
          <h2>{faqContent.cta.title}</h2>
          <p>{faqContent.cta.description}</p>
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
