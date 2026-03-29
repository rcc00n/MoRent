import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import PageVisualStack from '../components/PageVisualStack'
import { pageMedia } from '../content/mediaLibrary'

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
  const { state } = useLocation()
  const locale = i18n.resolvedLanguage === 'ru' ? 'ru-RU' : 'en-US'
  const startDate = formatDate(state?.startDate, locale)
  const endDate = formatDate(state?.endDate, locale)
  const steps = t('requestReceived.steps', { returnObjects: true })

  return (
    <div className="content-page">
      <section className="thank-you scene scene--closing">
        <div className="thank-you__hero">
          <div className="thank-you__intro">
            <span className="page-eyebrow">{t('requestReceived.eyebrow')}</span>
            <h1>{t('requestReceived.title')}</h1>
            <p>
              {state?.carName
                ? t('requestReceived.descriptionWithCar', { carName: state.carName })
                : t('requestReceived.descriptionWithoutCar')}{' '}
              {t('requestReceived.descriptionEnd')}
            </p>
          </div>

          <PageVisualStack
            primary={pageMedia.sunsetArrival}
            primaryAlt={t('requestReceived.visuals.primaryAlt')}
            primaryCaption={t('requestReceived.visuals.primaryCaption')}
            secondary={pageMedia.sunsetCoast}
            secondaryAlt={t('requestReceived.visuals.secondaryAlt')}
            secondaryCaption={t('requestReceived.visuals.secondaryCaption')}
          />
        </div>

        {startDate || endDate ? (
          <div className="thank-you__dates">
            <div>
              <span>{t('requestReceived.dates.start')}</span>
              <strong>{startDate || t('common.labels.toBeConfirmed')}</strong>
            </div>
            <div>
              <span>{t('requestReceived.dates.end')}</span>
              <strong>{endDate || t('common.labels.toBeConfirmed')}</strong>
            </div>
          </div>
        ) : null}

        <div className="thank-you__steps">
          {steps.map((step) => (
            <div className="thank-you__step" key={step.title}>
              <strong>{step.title}</strong>
              <p>{step.description}</p>
            </div>
          ))}
        </div>

        <div className="button-row">
          <Link className="button button--primary" to="/catalog">
            {t('common.actions.backToFleet')}
          </Link>
          <Link className="button button--secondary" to="/">
            {t('common.actions.returnHome')}
          </Link>
        </div>
      </section>
    </div>
  )
}

export default RequestReceived
