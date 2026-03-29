import { Link } from 'react-router-dom'

import { bookingProcessSteps } from '../content/siteContent'

function HowItWorks() {
  return (
    <div className="content-page">
      <section className="page-hero scene scene--closing">
        <div className="page-hero__content">
          <span className="page-eyebrow">How It Works</span>
          <h1>A short booking path built for premium trips, not admin.</h1>
          <p>
            MoRent keeps the process intentionally simple so the client sees the fleet,
            understands the rate, and reaches a confirmed handoff without extra steps.
          </p>
        </div>
      </section>

      <section className="process-grid">
        {bookingProcessSteps.map((step, index) => (
          <article className="process-card" key={step.title}>
            <span>{index + 1}</span>
            <h2>{step.title}</h2>
            <p>{step.description}</p>
          </article>
        ))}
      </section>

      <section className="info-grid">
        <article className="info-card">
          <h2>Visible rates first</h2>
          <p>
            The daily rate is shown before the request starts, which keeps the decision
            clear and commercially honest.
          </p>
        </article>
        <article className="info-card">
          <h2>No payment at request stage</h2>
          <p>
            The online request is an availability check and booking signal. Final
            payment handling happens only after manual confirmation.
          </p>
        </article>
        <article className="info-card">
          <h2>Pickup arranged after review</h2>
          <p>
            Airport arrival, hotel delivery, and private pickup details are agreed once
            the requested car and dates are confirmed.
          </p>
        </article>
      </section>

      <section className="cta-panel">
        <div>
          <h2>Ready to start the request?</h2>
          <p>Open the fleet and move straight into the car that fits the trip.</p>
        </div>

        <div className="button-row">
          <Link className="button button--primary" to="/catalog">
            Open the fleet
          </Link>
          <Link className="button button--secondary" to="/faq">
            Booking questions
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HowItWorks
