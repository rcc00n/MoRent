import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import ContactRequestForm from '../components/ContactRequestForm'
import PageVisualStack from '../components/PageVisualStack'
import Seo from '../components/Seo'
import { pageMedia } from '../content/mediaLibrary'
import {
  usePageContent,
  useSiteSettings,
} from '../hooks/useSiteContent'
import { buildCmsMetadata } from '../seo/cmsMetadata'
import { getRuntimeSiteUrl } from '../seo/site'
import { mergeContent } from '../shared/content'

function Contacts() {
  const { i18n, t } = useTranslation()
  const siteUrl = getRuntimeSiteUrl()
  const fallbackSummary = t('contacts.summary', { returnObjects: true })
  const { data: remoteContactsContent } = usePageContent(
    'contacts',
    i18n.resolvedLanguage,
  )
  const { data: remoteSettings } = useSiteSettings(i18n.resolvedLanguage)
  const fallbackContent = {
    eyebrow: t('contacts.eyebrow'),
    title: t('contacts.title'),
    description: t('contacts.description'),
    summary_labels: {
      primary: fallbackSummary[0].label,
      hours: fallbackSummary[1].label,
      coverage: fallbackSummary[2].label,
    },
    highlights: t('contacts.highlights', { returnObjects: true }),
    entry_section: {
      title: t('contacts.entrySectionTitle'),
      description: t('contacts.entrySectionDescription'),
    },
    entry_cards: t('contacts.entryCards', { returnObjects: true }).map((item) => ({
      intent: item.intent,
      title: item.title,
      description: item.description,
      action_label: item.actionLabel,
    })),
    channels: {
      title: t('contacts.channelsTitle'),
      description: t('contacts.channelsDescription'),
    },
    form_section: {
      title: t('contacts.formSectionTitle'),
      description: t('contacts.formSectionDescription'),
    },
    visuals: {
      primary_image: pageMedia.sunsetArrival,
      primary_alt: t('contacts.visuals.primaryAlt'),
      primary_caption: t('contacts.visuals.primaryCaption'),
      secondary_image: '',
      secondary_alt: '',
      secondary_caption: '',
    },
    seo: {
      title: t('metadata.pages.contacts.title'),
      description: t('metadata.pages.contacts.description'),
    },
  }
  const fallbackSettings = {
    channels: {
      phone: { value: '', href: '' },
      email: { value: '', href: '' },
      whatsapp: { value: '', href: '' },
      telegram: { value: '', href: '' },
    },
    working_hours: fallbackSummary[1].value,
    contact_availability_text: fallbackSummary[0].value,
    pickup_location_text: fallbackSummary[2].value,
  }
  const contactsContent = mergeContent(fallbackContent, remoteContactsContent || {})
  const siteSettings = mergeContent(fallbackSettings, remoteSettings || {})
  const directChannels = Object.entries(siteSettings.channels || {})
    .map(([key, channel]) => ({
      key,
      value: channel?.value || '',
      href: channel?.href || '',
    }))
    .filter((channel) => channel.value && channel.href)
  const contactSummary = [
    {
      label: contactsContent.summary_labels.primary,
      value: siteSettings.contact_availability_text,
    },
    {
      label: contactsContent.summary_labels.hours,
      value: siteSettings.working_hours,
    },
    {
      label: contactsContent.summary_labels.coverage,
      value: siteSettings.pickup_location_text,
    },
  ]
  const contactsSeo = buildCmsMetadata({
    pathname: '/contacts',
    siteUrl,
    language: i18n.resolvedLanguage,
    title: contactsContent.seo.title,
    description: contactsContent.seo.description,
  })

  return (
    <div className="content-page">
      <Seo {...contactsSeo} />
      <section className="page-hero scene scene--destination">
        <div className="page-hero__grid">
          <div className="page-hero__content">
            <span className="page-eyebrow">{contactsContent.eyebrow}</span>
            <h1>{contactsContent.title}</h1>
            <p>{contactsContent.description}</p>
          </div>

          <PageVisualStack
            primary={contactsContent.visuals.primary_image}
            primaryAlt={contactsContent.visuals.primary_alt}
            primaryCaption={contactsContent.visuals.primary_caption}
            secondary={contactsContent.visuals.secondary_image}
            secondaryAlt={contactsContent.visuals.secondary_alt}
            secondaryCaption={contactsContent.visuals.secondary_caption}
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
          {contactsContent.highlights.map((item) => (
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
              <h2>{contactsContent.entry_section.title}</h2>
            </div>
            <p>{contactsContent.entry_section.description}</p>
          </div>
        </div>

        <div className="contact-entry-grid">
          {contactsContent.entry_cards.map((item) => {
            const to =
              item.intent === 'booking'
                ? '/catalog'
                : `/contacts?intent=${item.intent}#contact-form`

            return (
              <article className="info-card contact-entry-card" key={item.title}>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <Link className="button button--secondary" to={to}>
                  {item.action_label}
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
              <h2>{contactsContent.channels.title}</h2>
            </div>
            <p>{contactsContent.channels.description}</p>
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
          <h2>{contactsContent.form_section.title}</h2>
          <p>{contactsContent.form_section.description}</p>
        </div>

        <ContactRequestForm />
      </section>
    </div>
  )
}

export default Contacts
