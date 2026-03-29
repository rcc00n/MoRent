import { Link } from 'react-router-dom'

import { termsSections } from '../content/siteContent'

function Terms() {
  return (
    <div className="content-page">
      <section className="page-hero scene scene--fleet">
        <div className="page-hero__content">
          <span className="page-eyebrow">Terms</span>
          <h1>Rental terms and legal information for MoRent requests.</h1>
          <p>
            This summary explains how booking requests, pricing review, vehicle use, and
            booking changes are handled before a confirmed rental begins.
          </p>
        </div>
      </section>

      <section className="legal-grid">
        {termsSections.map((section) => (
          <article className="legal-card" key={section.title}>
            <h2>{section.title}</h2>
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="cta-panel">
        <div>
          <h2>Need the practical side of the process?</h2>
          <p>
            The FAQ and booking flow explain what happens before handoff, while privacy
            handling is described separately.
          </p>
        </div>

        <div className="button-row">
          <Link className="button button--secondary" to="/privacy">
            Privacy policy
          </Link>
          <Link className="button button--primary" to="/faq">
            Read the FAQ
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Terms
