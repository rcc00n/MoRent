import { Link } from 'react-router-dom'

import PageVisualStack from '../components/PageVisualStack'
import { pageMedia } from '../content/mediaLibrary'
import { privacySections } from '../content/siteContent'

function Privacy() {
  return (
    <div className="content-page">
      <section className="page-hero scene scene--benefits">
        <div className="page-hero__grid">
          <div className="page-hero__content">
            <span className="page-eyebrow">Privacy</span>
            <h1>Privacy policy for booking requests and service follow-up.</h1>
            <p>
              MoRent keeps personal data collection focused on what is needed to review
              availability, confirm the request, and manage future operational
              workflows.
            </p>
          </div>

          <PageVisualStack
            primary={pageMedia.mercedesInterior}
            primaryAlt="Premium car interior supporting privacy and request-handling context"
            primaryCaption="Only the details needed to review the request"
            secondary={pageMedia.sunsetArrival}
            secondaryAlt="Arrival setting linked to service follow-up and request handling"
            secondaryCaption="Operational follow-up stays tied to the booking journey"
          />
        </div>
      </section>

      <section className="legal-grid">
        {privacySections.map((section) => (
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
          <h2>Continue with the booking path</h2>
          <p>
            When you are ready, open the fleet and send the request with the dates you
            want reviewed.
          </p>
        </div>

        <div className="button-row">
          <Link className="button button--primary" to="/catalog">
            View the fleet
          </Link>
          <Link className="button button--secondary" to="/terms">
            Rental terms
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Privacy
