import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function FooterLinkGroup({ title, links, className = '' }) {
  return (
    <div className={`site-footer__group ${className}`.trim()}>
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
  const footerContactLinks = [
    { label: t('footer.requestCar'), to: '/catalog' },
    { label: t('footer.serviceDetails'), to: '/contacts' },
  ]
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand-block">
          <Link className="brand" to="/">
            Mo<span>Rent</span>
          </Link>
          <p className="site-footer__title">{t('footer.title')}</p>
        </div>

        <div className="site-footer__navigation-panel">
          <FooterLinkGroup
            links={footerNavigation.main}
            title={t('footer.groups.explore')}
          />
          <FooterLinkGroup
            links={footerNavigation.company}
            title={t('footer.groups.company')}
          />
        </div>

        <FooterLinkGroup
          className="site-footer__group--contact"
          links={footerContactLinks}
          title={t('contacts.eyebrow')}
        />

        <FooterLinkGroup
          className="site-footer__group--legal"
          links={footerNavigation.legal}
          title={t('footer.groups.legal')}
        />
      </div>

      <div className="site-footer__bottom">
        <p>{t('footer.context')}</p>
        <p>{t('footer.copyright', { year: currentYear })}</p>
      </div>
    </footer>
  )
}

export default SiteFooter
