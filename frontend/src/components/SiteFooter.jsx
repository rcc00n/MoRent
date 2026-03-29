import { Link } from 'react-router-dom'

import { footerContext, footerNavigation } from '../content/siteContent'

function FooterLinkGroup({ title, links }) {
  return (
    <div className="site-footer__group">
      <span className="site-footer__eyebrow">{title}</span>
      <div className="site-footer__links">
        {links.map((link) => (
          <Link key={link.to} to={link.to}>
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand-block">
          <Link className="brand" to="/">
            Mo<span>Rent</span>
          </Link>
          <p className="site-footer__title">{footerContext.title}</p>
          <p className="site-footer__description">{footerContext.description}</p>
          <div className="site-footer__contact-links">
            <Link to="/catalog">Request a car</Link>
            <Link to="/contacts">Service details</Link>
          </div>
        </div>

        <div className="site-footer__navigation">
          <FooterLinkGroup links={footerNavigation.main} title="Explore" />
          <FooterLinkGroup links={footerNavigation.company} title="Company" />
          <FooterLinkGroup links={footerNavigation.legal} title="Legal" />
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>Coastal service area with resort, hotel, and airport pickup by arrangement.</p>
        <p>© {new Date().getFullYear()} MoRent. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default SiteFooter
