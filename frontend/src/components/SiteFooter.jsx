import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
  const footerNavigation = t('footer.navigation', { returnObjects: true })
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand-block">
          <Link className="brand" to="/">
            Mo<span>Rent</span>
          </Link>
          <p className="site-footer__title">{t('footer.title')}</p>
          <p className="site-footer__description">{t('footer.description')}</p>
          <div className="site-footer__contact-links">
            <Link to="/catalog">{t('footer.requestCar')}</Link>
            <Link to="/contacts">{t('footer.serviceDetails')}</Link>
          </div>
        </div>

        <div className="site-footer__navigation">
          <FooterLinkGroup
            links={footerNavigation.main}
            title={t('footer.groups.explore')}
          />
          <FooterLinkGroup
            links={footerNavigation.company}
            title={t('footer.groups.company')}
          />
          <FooterLinkGroup
            links={footerNavigation.legal}
            title={t('footer.groups.legal')}
          />
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>{t('footer.context')}</p>
        <p>{t('footer.copyright', { year: currentYear })}</p>
      </div>
    </footer>
  )
}

export default SiteFooter
