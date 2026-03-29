import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import ContactRequestForm from '../components/ContactRequestForm'
import PageVisualStack from '../components/PageVisualStack'
import { pageMedia } from '../content/mediaLibrary'
import { useContactConfig } from '../hooks/useContactConfig'

function Contacts() {
  const { t } = useTranslation()
  const contactHighlights = t('contacts.highlights', { returnObjects: true })
  const contactSummary = t('contacts.summary', { returnObjects: true })
  const contactEntryCards = t('contacts.entryCards', { returnObjects: true })
  const { directChannels } = useContactConfig()

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

      <section className="page-section">
        <div>
          <div className="section-header section-header--split">
            <div>
              <h2>{t('contacts.entrySectionTitle')}</h2>
            </div>
            <p>{t('contacts.entrySectionDescription')}</p>
          </div>
        </div>

        <div className="contact-entry-grid">
          {contactEntryCards.map((item) => {
            const to =
              item.intent === 'booking'
                ? '/catalog'
                : `/contacts?intent=${item.intent}#contact-form`

            return (
              <article className="info-card contact-entry-card" key={item.title}>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <Link className="button button--secondary" to={to}>
                  {item.actionLabel}
                </Link>
              </article>
            )
          })}
        </div>
      </section>

      {directChannels.length ? (
        <section className="page-section">
          <div className="section-header section-header--split">
            <div>
              <h2>{t('contacts.channelsTitle')}</h2>
            </div>
            <p>{t('contacts.channelsDescription')}</p>
          </div>

          <div className="contact-channel-grid">
            {directChannels.map((channel) => (
              <a
                className="info-card contact-channel-card"
                href={channel.href}
                key={channel.key}
                rel={channel.href.startsWith('http') ? 'noreferrer' : undefined}
                target={channel.href.startsWith('http') ? '_blank' : undefined}
              >
                <span className="page-eyebrow">
                  {t(`contacts.channelLabels.${channel.key}`)}
                </span>
                <strong>{channel.value}</strong>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <section className="contact-request-shell" id="contact-form">
        <div className="section-header">
          <h2>{t('contacts.formSectionTitle')}</h2>
          <p>{t('contacts.formSectionDescription')}</p>
        </div>

        <ContactRequestForm />
      </section>
    </div>
  )
}

export default Contacts
