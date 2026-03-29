import { Link } from 'react-router-dom'

import { aboutPrinciples, aboutStats } from '../content/siteContent'

function About() {
  return (
    <div className="content-page">
      <section className="page-hero scene scene--fleet">
        <div className="page-hero__content">
          <span className="page-eyebrow">About MoRent</span>
          <h1>Premium coastal car rental designed to feel calm, clear, and direct.</h1>
          <p>
            MoRent is built around a short decision path: visible daily rates, a curated
            fleet, and direct request handling for resort arrivals, hotel delivery, and
            private pickup coordination.
          </p>
        </div>

        <div className="page-hero__aside">
          {aboutStats.map((item) => (
            <div className="info-chip" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-header section-header--split">
          <div>
            <h2>Why the service feels different</h2>
          </div>
          <p>
            The business is structured around fewer cars, clearer pricing, and a manual
            handoff process that protects the premium experience.
          </p>
        </div>

        <div className="info-grid">
          {aboutPrinciples.map((item) => (
            <article className="info-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-panel">
        <div>
          <h2>Ready to choose the car?</h2>
          <p>
            The fleet stays concise on purpose. Open the catalog and send the request
            when the timing feels right.
          </p>
        </div>

        <div className="button-row">
          <Link className="button button--primary" to="/catalog">
            View the fleet
          </Link>
          <Link className="button button--secondary" to="/contacts">
            Contact details
          </Link>
        </div>
      </section>
    </div>
  )
}

export default About
