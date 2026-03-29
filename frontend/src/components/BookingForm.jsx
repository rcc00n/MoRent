import { startTransition, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { createBooking } from '../shared/api'

const initialFormState = {
  name: '',
  phone: '',
  start_date: '',
  end_date: '',
}

const initialTouchedState = {
  name: false,
  phone: false,
  start_date: false,
  end_date: false,
}

function extractErrorMessage(_error, fallbackMessage) {
  return fallbackMessage
}

function validateBookingForm(formData, t) {
  const errors = {}
  const phoneDigits = formData.phone.replace(/\D/g, '')

  if (!formData.name.trim()) {
    errors.name = t('bookingForm.validation.nameRequired')
  } else if (formData.name.trim().length < 2) {
    errors.name = t('bookingForm.validation.nameShort')
  }

  if (!formData.phone.trim()) {
    errors.phone = t('bookingForm.validation.phoneRequired')
  } else if (phoneDigits.length < 10) {
    errors.phone = t('bookingForm.validation.phoneShort')
  }

  if (!formData.start_date) {
    errors.start_date = t('bookingForm.validation.startDateRequired')
  }

  if (!formData.end_date) {
    errors.end_date = t('bookingForm.validation.endDateRequired')
  } else if (formData.start_date && formData.end_date < formData.start_date) {
    errors.end_date = t('bookingForm.validation.endDateAfterStart')
  }

  return errors
}

function BookingForm({ carId, carName }) {
  const { i18n, t } = useTranslation()
  const [formData, setFormData] = useState(initialFormState)
  const [touchedFields, setTouchedFields] = useState(initialTouchedState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const today = new Date().toISOString().slice(0, 10)
  const fieldErrors = validateBookingForm(formData, t)

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
      start_date: true,
      end_date: true,
    })
    setIsSubmitting(true)
    setFeedback(null)

    if (Object.keys(fieldErrors).length) {
      setFeedback({
        type: 'error',
        title: t('bookingForm.feedback.reviewTitle'),
        message: t('bookingForm.feedback.reviewMessage'),
      })
      setIsSubmitting(false)
      return
    }

    try {
      await createBooking({
        ...formData,
        car: carId,
        preferred_contact_method: 'phone',
        source: 'car_page',
        source_context: {
          car_id: carId,
          car_name: carName,
          entry_point: 'booking_form',
          locale: i18n.resolvedLanguage,
          page_path: location.pathname,
          page_title: document.title,
        },
      })

      const successState = {
        carName,
        startDate: formData.start_date,
        endDate: formData.end_date,
      }

      setFormData(initialFormState)
      setTouchedFields(initialTouchedState)

      startTransition(() => {
        navigate('/request-received', {
          state: successState,
        })
      })
    } catch (error) {
      setFeedback({
        type: 'error',
        title: t('bookingForm.feedback.requestErrorTitle'),
        message: extractErrorMessage(error, t('common.errors.booking')),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <div>
        <h2>{t('bookingForm.title', { carName })}</h2>
        <p className="muted-text">
          {t('bookingForm.description')}
        </p>
      </div>

      <div className="form-grid">
        <div
          className={
            touchedFields.name && fieldErrors.name
              ? 'field field--full field--invalid'
              : 'field field--full'
          }
        >
          <label htmlFor="name">{t('bookingForm.fields.name')}</label>
          <input
            aria-invalid={Boolean(touchedFields.name && fieldErrors.name)}
            id="name"
            name="name"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder={t('bookingForm.fields.namePlaceholder')}
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
              ? 'field field--full field--invalid'
              : 'field field--full'
          }
        >
          <label htmlFor="phone">{t('bookingForm.fields.phone')}</label>
          <input
            aria-invalid={Boolean(touchedFields.phone && fieldErrors.phone)}
            id="phone"
            name="phone"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder={t('bookingForm.fields.phonePlaceholder')}
            required
            type="tel"
            value={formData.phone}
          />
          {touchedFields.phone && fieldErrors.phone ? (
            <p className="field__error">{fieldErrors.phone}</p>
          ) : null}
        </div>

        <div
          className={
            touchedFields.start_date && fieldErrors.start_date
              ? 'field field--invalid'
              : 'field'
          }
        >
          <label htmlFor="start_date">{t('bookingForm.fields.startDate')}</label>
          <input
            aria-invalid={Boolean(touchedFields.start_date && fieldErrors.start_date)}
            id="start_date"
            min={today}
            name="start_date"
            onBlur={handleBlur}
            onChange={handleChange}
            required
            type="date"
            value={formData.start_date}
          />
          {touchedFields.start_date && fieldErrors.start_date ? (
            <p className="field__error">{fieldErrors.start_date}</p>
          ) : null}
        </div>

        <div
          className={
            touchedFields.end_date && fieldErrors.end_date
              ? 'field field--invalid'
              : 'field'
          }
        >
          <label htmlFor="end_date">{t('bookingForm.fields.endDate')}</label>
          <input
            aria-invalid={Boolean(touchedFields.end_date && fieldErrors.end_date)}
            id="end_date"
            min={formData.start_date || today}
            name="end_date"
            onBlur={handleBlur}
            onChange={handleChange}
            required
            type="date"
            value={formData.end_date}
          />
          {touchedFields.end_date && fieldErrors.end_date ? (
            <p className="field__error">{fieldErrors.end_date}</p>
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
              {t('bookingForm.submitLoading')}
            </>
          ) : (
            t('bookingForm.submitIdle')
          )}
        </button>
        <p className="booking-form__note muted-text">
          {t('bookingForm.note')}
        </p>
      </div>
    </form>
  )
}

export default BookingForm
