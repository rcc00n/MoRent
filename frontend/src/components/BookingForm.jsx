import { useState } from 'react'

import { createBooking } from '../shared/api'

const initialFormState = {
  name: '',
  phone: '',
  start_date: '',
  end_date: '',
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

function BookingForm({ carId, carName }) {
  const [formData, setFormData] = useState(initialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState(null)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setFeedback(null)

    try {
      await createBooking({
        ...formData,
        car: carId,
      })

      setFormData(initialFormState)
      setFeedback({
        type: 'success',
        message: 'Booking request sent successfully.',
      })
    } catch (error) {
      setFeedback({
        type: 'error',
        message: extractErrorMessage(error),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <div>
        <span className="eyebrow">Booking form</span>
        <h2>Reserve {carName}</h2>
        <p className="muted-text">
          Send a quick rental request without registration.
        </p>
      </div>

      <div className="form-grid">
        <div className="field field--full">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            onChange={handleChange}
            placeholder="Your name"
            required
            value={formData.name}
          />
        </div>

        <div className="field field--full">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            onChange={handleChange}
            placeholder="+7 999 123 45 67"
            required
            type="tel"
            value={formData.phone}
          />
        </div>

        <div className="field">
          <label htmlFor="start_date">Start date</label>
          <input
            id="start_date"
            min={new Date().toISOString().slice(0, 10)}
            name="start_date"
            onChange={handleChange}
            required
            type="date"
            value={formData.start_date}
          />
        </div>

        <div className="field">
          <label htmlFor="end_date">End date</label>
          <input
            id="end_date"
            min={formData.start_date || new Date().toISOString().slice(0, 10)}
            name="end_date"
            onChange={handleChange}
            required
            type="date"
            value={formData.end_date}
          />
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
          {feedback.message}
        </div>
      ) : null}

      <button className="button button--primary" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Sending...' : 'Send booking request'}
      </button>
    </form>
  )
}

export default BookingForm
