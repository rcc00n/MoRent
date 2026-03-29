import { Link } from 'react-router-dom'

import FaqList from '../components/FaqList'
import { faqItems } from '../content/siteContent'

function FAQ() {
  return (
    <div className="content-page">
      <section className="page-hero scene scene--benefits">
        <div className="page-hero__content">
          <span className="page-eyebrow">FAQ</span>
          <h1>Questions people ask before they send the request.</h1>
          <p>
            This page keeps the booking path readable: how requests work, what gets
            confirmed first, and what to expect after submission.
          </p>
        </div>
      </section>

      <section className="page-section">
        <FaqList items={faqItems} />
      </section>

      <section className="cta-panel">
        <div>
          <h2>Ready to move from answers to availability?</h2>
          <p>
            Open the fleet and send the request when the car and dates look right.
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

export default FAQ
