import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import PageVisualStack from '../components/PageVisualStack'
import Seo from '../components/Seo'
import { pageMedia } from '../content/mediaLibrary'
import { usePageContent } from '../hooks/useSiteContent'
import { buildCmsMetadata } from '../seo/cmsMetadata'
import { getRuntimeSiteUrl } from '../seo/site'
import { mergeContent } from '../shared/content'

function formatDate(value, locale) {
  if (!value) {
    return null
  }

  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsedDate)
}

function RequestReceived() {
  const { i18n, t } = useTranslation()
  const siteUrl = getRuntimeSiteUrl()
  const { state } = useLocation()
  const locale = i18n.resolvedLanguage === 'ru' ? 'ru-RU' : 'en-US'
  const startDate = formatDate(state?.startDate, locale)
  const endDate = formatDate(state?.endDate, locale)
  const { data: remoteThankYouContent } = usePageContent(
    'request-received',
    i18n.resolvedLanguage,
  )
  const fallbackContent = {
    eyebrow: t('requestReceived.eyebrow'),
    title: t('requestReceived.title'),
    description_with_car: t('requestReceived.descriptionWithCar'),
    description_without_car: t('requestReceived.descriptionWithoutCar'),
    description_end: t('requestReceived.descriptionEnd'),
    dates: {
      start: t('requestReceived.dates.start'),
      end: t('requestReceived.dates.end'),
    },
    steps: t('requestReceived.steps', { returnObjects: true }),
    actions: {
      primary: t('common.actions.backToFleet'),
      secondary: t('common.actions.returnHome'),
    },
    visuals: {
      primary_image: pageMedia.sunsetArrival,
      primary_alt: t('requestReceived.visuals.primaryAlt'),
      primary_caption: t('requestReceived.visuals.primaryCaption'),
      secondary_image: pageMedia.sunsetCoast,
      secondary_alt: t('requestReceived.visuals.secondaryAlt'),
      secondary_caption: t('requestReceived.visuals.secondaryCaption'),
    },
    seo: {
      title: t('metadata.pages.requestReceived.title'),
      description: t('metadata.pages.requestReceived.description'),
    },
  }
  const thankYouContent = mergeContent(fallbackContent, remoteThankYouContent || {})
  const confirmationLeadText = state?.carName
    ? thankYouContent.description_with_car.replace('{{carName}}', state.carName)
    : thankYouContent.description_without_car
  const thankYouSeo = buildCmsMetadata({
    pathname: '/request-received',
    siteUrl,
    language: i18n.resolvedLanguage,
    title: thankYouContent.seo.title,
    description: thankYouContent.seo.description,
    robots: 'noindex,follow',
  })

  return (
    <div className="content-page">
      <Seo {...thankYouSeo} />
      <section className="thank-you scene scene--closing">
        <div className="thank-you__hero">
          <div className="thank-you__intro">
            <span className="page-eyebrow">{thankYouContent.eyebrow}</span>
            <h1>{thankYouContent.title}</h1>
            <p>
              {confirmationLeadText}{' '}
              {thankYouContent.description_end}
            </p>
          </div>

          <PageVisualStack
            primary={thankYouContent.visuals.primary_image}
            primaryAlt={thankYouContent.visuals.primary_alt}
            primaryCaption={thankYouContent.visuals.primary_caption}
            secondary={thankYouContent.visuals.secondary_image}
            secondaryAlt={thankYouContent.visuals.secondary_alt}
            secondaryCaption={thankYouContent.visuals.secondary_caption}
          />
        </div>

        {startDate || endDate ? (
          <div className="thank-you__dates">
            <div>
              <span>{thankYouContent.dates.start}</span>
              <strong>{startDate || t('common.labels.toBeConfirmed')}</strong>
            </div>
            <div>
              <span>{thankYouContent.dates.end}</span>
              <strong>{endDate || t('common.labels.toBeConfirmed')}</strong>
            </div>
          </div>
        ) : null}

        <div className="thank-you__steps">
          {thankYouContent.steps.map((step) => (
            <div className="thank-you__step" key={step.title}>
              <strong>{step.title}</strong>
              <p>{step.description}</p>
            </div>
          ))}
        </div>

        <div className="button-row">
          <Link className="button button--primary" to="/catalog">
            {thankYouContent.actions.primary}
          </Link>
          <Link className="button button--secondary" to="/">
            {thankYouContent.actions.secondary}
          </Link>
        </div>
      </section>
    </div>
  )
}

export default RequestReceived
