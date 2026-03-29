import { Link } from 'react-router-dom'

import { contactHighlights } from '../content/siteContent'

function Contacts() {
  return (
    <div className="content-page">
      <section className="page-hero scene scene--destination">
        <div className="page-hero__content">
          <span className="page-eyebrow">Contacts</span>
          <h1>Contact the team and plan the request with the right pickup context.</h1>
          <p>
            The site is the main booking channel. Once the request is in, the team
            follows up directly to confirm availability, pickup timing, and the handoff
            point.
          </p>
        </div>

        <div className="contact-summary">
          <div className="contact-summary__item">
            <span>Primary channel</span>
            <strong>Online booking request</strong>
          </div>
          <div className="contact-summary__item">
            <span>Service hours</span>
            <strong>Daily, 08:00 to 22:00</strong>
          </div>
          <div className="contact-summary__item">
            <span>Coverage</span>
            <strong>Resort, hotel, airport, and private pickup by arrangement</strong>
          </div>
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

      <section className="cta-panel" id="request">
        <div>
          <h2>Need the fastest response?</h2>
          <p>
            Open the fleet, choose the car, and send the dates. That gives the team the
            context needed to confirm the request quickly.
          </p>
        </div>

        <div className="button-row">
          <Link className="button button--primary" to="/catalog">
            Start a request
          </Link>
          <Link className="button button--secondary" to="/faq">
            Read the FAQ
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Contacts
