import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { createContactRequest } from '../shared/api'

const contactIntents = new Set(['contact_request', 'support_request'])
const phonePreferredMethods = new Set(['phone', 'whatsapp', 'telegram'])

const initialFormState = {
  name: '',
  phone: '',
  email: '',
  message: '',
  request_type: 'contact_request',
  preferred_contact_method: '',
}

const initialTouchedState = {
  name: false,
  phone: false,
  email: false,
  message: false,
  request_type: false,
  preferred_contact_method: false,
}

function extractErrorMessage(_error, fallbackMessage) {
  return fallbackMessage
}

function normalizeIntent(value) {
  return contactIntents.has(value) ? value : 'contact_request'
}

function isEmailValid(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function validateContactRequestForm(formData, t) {
  const errors = {}
  const cleanedPhone = formData.phone.trim()
  const cleanedEmail = formData.email.trim()
  const phoneDigits = cleanedPhone.replace(/\D/g, '')

  if (!formData.name.trim()) {
    errors.name = t('contactForm.validation.nameRequired')
  } else if (formData.name.trim().length < 2) {
    errors.name = t('contactForm.validation.nameShort')
  }

  if (!cleanedPhone && !cleanedEmail) {
    errors.phone = t('contactForm.validation.contactRequired')
    errors.email = t('contactForm.validation.contactRequired')
  } else {
    if (cleanedPhone && phoneDigits.length < 10) {
      errors.phone = t('contactForm.validation.phoneShort')
    }

    if (cleanedEmail && !isEmailValid(cleanedEmail)) {
      errors.email = t('contactForm.validation.emailInvalid')
    }
  }

  if (!formData.message.trim()) {
    errors.message = t('contactForm.validation.messageRequired')
  } else if (formData.message.trim().length < 10) {
    errors.message = t('contactForm.validation.messageShort')
  }

  if (formData.preferred_contact_method === 'email' && !cleanedEmail) {
    errors.preferred_contact_method = t(
      'contactForm.validation.preferredMethodNeedsEmail',
    )
  }

  if (
    phonePreferredMethods.has(formData.preferred_contact_method) &&
    !cleanedPhone
  ) {
    errors.preferred_contact_method = t(
      'contactForm.validation.preferredMethodNeedsPhone',
    )
  }

  return errors
}

function ContactRequestForm() {
  const { i18n, t } = useTranslation()
  const location = useLocation()
  const requestedIntent = normalizeIntent(
    new URLSearchParams(location.search).get('intent'),
  )
  const [formData, setFormData] = useState(() => ({
    ...initialFormState,
    request_type: requestedIntent,
  }))
  const [touchedFields, setTouchedFields] = useState(initialTouchedState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const fieldErrors = validateContactRequestForm(formData, t)

  useEffect(() => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      request_type: requestedIntent,
    }))
  }, [requestedIntent])

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }))

    if (feedback) {
      setFeedback(null)
    }
  }

  function handleBlur(event) {
    const { name } = event.target

    setTouchedFields((currentTouchedFields) => ({
      ...currentTouchedFields,
      [name]: true,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setTouchedFields({
      name: true,
      phone: true,
      email: true,
      message: true,
      request_type: true,
      preferred_contact_method: true,
    })
    setIsSubmitting(true)
    setFeedback(null)

    if (Object.keys(fieldErrors).length) {
      setFeedback({
        type: 'error',
        title: t('contactForm.feedback.reviewTitle'),
        message: t('contactForm.feedback.reviewMessage'),
      })
      setIsSubmitting(false)
      return
    }

    try {
      await createContactRequest({
        ...formData,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        source: 'contacts_page',
        source_context: {
          entry_point: 'contact_form',
          page_path: location.pathname,
          page_title: document.title,
          locale: i18n.resolvedLanguage,
          intent: formData.request_type,
        },
      })

      setFormData({
        ...initialFormState,
        request_type: requestedIntent,
      })
      setTouchedFields(initialTouchedState)
      setFeedback({
        type: 'success',
        title: t('contactForm.feedback.successTitle'),
        message: t('contactForm.feedback.successMessage'),
      })
    } catch (error) {
      setFeedback({
        type: 'error',
        title: t('contactForm.feedback.requestErrorTitle'),
        message: extractErrorMessage(error, t('common.errors.contact')),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="booking-form contact-request-form" onSubmit={handleSubmit}>
      <div>
        <h2>{t('contactForm.title')}</h2>
        <p className="muted-text">{t('contactForm.description')}</p>
      </div>

      <div className="form-grid">
        <div
          className={
            touchedFields.name && fieldErrors.name
              ? 'field field--full field--invalid'
              : 'field field--full'
          }
        >
          <label htmlFor="contact-name">{t('contactForm.fields.name')}</label>
          <input
            aria-invalid={Boolean(touchedFields.name && fieldErrors.name)}
            id="contact-name"
            name="name"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder={t('contactForm.fields.namePlaceholder')}
            required
            value={formData.name}
          />
          {touchedFields.name && fieldErrors.name ? (
            <p className="field__error">{fieldErrors.name}</p>
          ) : null}
        </div>

        <div
          className={
            touchedFields.phone && fieldErrors.phone
              ? 'field field--invalid'
              : 'field'
          }
        >
          <label htmlFor="contact-phone">{t('contactForm.fields.phone')}</label>
          <input
            aria-invalid={Boolean(touchedFields.phone && fieldErrors.phone)}
            id="contact-phone"
            name="phone"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder={t('contactForm.fields.phonePlaceholder')}
            type="tel"
            value={formData.phone}
          />
          {touchedFields.phone && fieldErrors.phone ? (
            <p className="field__error">{fieldErrors.phone}</p>
          ) : null}
        </div>

        <div
          className={
            touchedFields.email && fieldErrors.email
              ? 'field field--invalid'
              : 'field'
          }
        >
          <label htmlFor="contact-email">{t('contactForm.fields.email')}</label>
          <input
            aria-invalid={Boolean(touchedFields.email && fieldErrors.email)}
            id="contact-email"
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder={t('contactForm.fields.emailPlaceholder')}
            type="email"
            value={formData.email}
          />
          {touchedFields.email && fieldErrors.email ? (
            <p className="field__error">{fieldErrors.email}</p>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="contact-request-type">
            {t('contactForm.fields.requestType')}
          </label>
          <select
            id="contact-request-type"
            name="request_type"
            onBlur={handleBlur}
            onChange={handleChange}
            value={formData.request_type}
          >
            <option value="contact_request">
              {t('contactForm.intents.contact_request')}
            </option>
            <option value="support_request">
              {t('contactForm.intents.support_request')}
            </option>
          </select>
        </div>

        <div
          className={
            touchedFields.preferred_contact_method &&
            fieldErrors.preferred_contact_method
              ? 'field field--invalid'
              : 'field'
          }
        >
          <label htmlFor="contact-method">
            {t('contactForm.fields.preferredContactMethod')}
          </label>
          <select
            id="contact-method"
            name="preferred_contact_method"
            onBlur={handleBlur}
            onChange={handleChange}
            value={formData.preferred_contact_method}
          >
            <option value="">
              {t('contactForm.fields.preferredContactMethodPlaceholder')}
            </option>
            <option value="phone">{t('contactForm.contactMethods.phone')}</option>
            <option value="email">{t('contactForm.contactMethods.email')}</option>
            <option value="whatsapp">{t('contactForm.contactMethods.whatsapp')}</option>
            <option value="telegram">{t('contactForm.contactMethods.telegram')}</option>
          </select>
          {touchedFields.preferred_contact_method &&
          fieldErrors.preferred_contact_method ? (
            <p className="field__error">{fieldErrors.preferred_contact_method}</p>
          ) : null}
        </div>

        <div
          className={
            touchedFields.message && fieldErrors.message
              ? 'field field--full field--invalid'
              : 'field field--full'
          }
        >
          <label htmlFor="contact-message">{t('contactForm.fields.message')}</label>
          <textarea
            aria-invalid={Boolean(touchedFields.message && fieldErrors.message)}
            id="contact-message"
            name="message"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder={t('contactForm.fields.messagePlaceholder')}
            rows="5"
            value={formData.message}
          />
          {touchedFields.message && fieldErrors.message ? (
            <p className="field__error">{fieldErrors.message}</p>
          ) : null}
        </div>
      </div>

      {feedback ? (
        <div
          aria-live="polite"
          className={
            feedback.type === 'success'
              ? 'feedback feedback--success'
              : 'feedback feedback--error'
          }
        >
          <strong className="feedback__title">{feedback.title}</strong>
          <p className="feedback__message">{feedback.message}</p>
        </div>
      ) : null}

      <div className="booking-form__footer">
        <button className="button button--primary" disabled={isSubmitting} type="submit">
          {isSubmitting ? (
            <>
              <span aria-hidden="true" className="button__spinner"></span>
              {t('contactForm.submitLoading')}
            </>
          ) : (
            t('contactForm.submitIdle')
          )}
        </button>
        <p className="booking-form__note muted-text">{t('contactForm.note')}</p>
      </div>
    </form>
  )
}

export default ContactRequestForm
