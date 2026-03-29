import { Link, useLocation } from 'react-router-dom'

function formatDate(value) {
  if (!value) {
    return null
  }

  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsedDate)
}

function RequestReceived() {
  const { state } = useLocation()
  const startDate = formatDate(state?.startDate)
  const endDate = formatDate(state?.endDate)

  return (
    <div className="content-page">
      <section className="thank-you scene scene--closing">
        <span className="page-eyebrow">Request received</span>
        <h1>Your request is in. We will review the availability next.</h1>
        <p>
          {state?.carName
            ? `${state.carName} has been added to the request queue.`
            : 'The booking request has been saved and sent to the team for review.'}{' '}
          No payment is taken at this stage.
        </p>

        {startDate || endDate ? (
          <div className="thank-you__dates">
            <div>
              <span>Requested start</span>
              <strong>{startDate || 'To be confirmed'}</strong>
            </div>
            <div>
              <span>Requested end</span>
              <strong>{endDate || 'To be confirmed'}</strong>
            </div>
          </div>
        ) : null}

        <div className="thank-you__steps">
          <div className="thank-you__step">
            <strong>1. Review</strong>
            <p>The team checks the car, timing, and pickup context.</p>
          </div>
          <div className="thank-you__step">
            <strong>2. Confirmation</strong>
            <p>You receive the next-step message with the final handoff plan.</p>
          </div>
        </div>

        <div className="button-row">
          <Link className="button button--primary" to="/catalog">
            Back to the fleet
          </Link>
          <Link className="button button--secondary" to="/">
            Return home
          </Link>
        </div>
      </section>
    </div>
  )
}

export default RequestReceived
