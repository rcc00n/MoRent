import { startTransition, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

function extractErrorMessage(error) {
  if (!error?.response?.data) {
    return 'Unable to submit the booking right now.'
  }

  const entries = Object.entries(error.response.data)
  if (!entries.length) {
    return 'Unable to submit the booking right now.'
  }

  const [, value] = entries[0]
  return Array.isArray(value) ? value[0] : value
}

function validateBookingForm(formData) {
  const errors = {}
  const phoneDigits = formData.phone.replace(/\D/g, '')

  if (!formData.name.trim()) {
    errors.name = 'Enter the driver name.'
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Name looks too short.'
  }

  if (!formData.phone.trim()) {
    errors.phone = 'Enter a phone number.'
  } else if (phoneDigits.length < 10) {
    errors.phone = 'Use at least 10 digits for contact.'
  }

  if (!formData.start_date) {
    errors.start_date = 'Choose a start date.'
  }

  if (!formData.end_date) {
    errors.end_date = 'Choose an end date.'
  } else if (formData.start_date && formData.end_date < formData.start_date) {
    errors.end_date = 'End date must be after the start date.'
  }

  return errors
}

function BookingForm({ carId, carName }) {
  const [formData, setFormData] = useState(initialFormState)
  const [touchedFields, setTouchedFields] = useState(initialTouchedState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const navigate = useNavigate()
  const today = new Date().toISOString().slice(0, 10)
  const fieldErrors = validateBookingForm(formData)

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
        title: 'Please review the form',
        message: 'A few fields still need attention before we can check availability.',
      })
      setIsSubmitting(false)
      return
    }

    try {
      await createBooking({
        ...formData,
        car: carId,
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
        title: 'Unable to send the request',
        message: extractErrorMessage(error),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <div>
        <h2>Check availability for {carName}</h2>
        <p className="muted-text">
          Send your dates and contact details. No payment is required to request the car.
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
          <label htmlFor="name">Full name</label>
          <input
            aria-invalid={Boolean(touchedFields.name && fieldErrors.name)}
            id="name"
            name="name"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="Your name"
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
          <label htmlFor="phone">Phone</label>
          <input
            aria-invalid={Boolean(touchedFields.phone && fieldErrors.phone)}
            id="phone"
            name="phone"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="+7 999 123 45 67"
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
          <label htmlFor="start_date">Start date</label>
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
          <label htmlFor="end_date">End date</label>
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
              Checking...
            </>
          ) : (
            'Book now'
          )}
        </button>
        <p className="booking-form__note muted-text">
          Prefer to decide first? The request only checks availability and starts the
          manager callback.
        </p>
      </div>
    </form>
  )
}

export default BookingForm
