import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useSiteSettings } from '../hooks/useSiteContent'
import { mergeContent } from '../shared/content'

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
  const { i18n, t } = useTranslation()
  const footerNavigation = t('footer.navigation', { returnObjects: true })
  const { data: remoteSettings } = useSiteSettings(i18n.resolvedLanguage)
  const siteSettings = mergeContent(
    {
      brand_name: 'MoRent',
      footer: {
        title: t('footer.title'),
        text: t('footer.context'),
      },
      cta_labels: {
        footer_request: t('footer.requestCar'),
        footer_service: t('footer.serviceDetails'),
      },
    },
    remoteSettings || {},
  )
  const footerContactLinks = [
    { label: siteSettings.cta_labels.footer_request, to: '/catalog' },
    { label: siteSettings.cta_labels.footer_service, to: '/contacts' },
  ]
  const currentYear = new Date().getFullYear()
  const brandName = siteSettings.brand_name === 'MoRent'
    ? (
        <>
          Mo<span>Rent</span>
        </>
      )
    : siteSettings.brand_name

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand-block">
          <Link className="brand" to="/">
            {brandName}
          </Link>
          <p className="site-footer__title">{siteSettings.footer.title}</p>
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
        <p>{siteSettings.footer.text}</p>
        <p>{t('footer.copyright', { year: currentYear })}</p>
      </div>
    </footer>
  )
}

export default SiteFooter
