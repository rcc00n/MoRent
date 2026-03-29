import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useSiteSettings } from '../hooks/useSiteContent'
import { mergeContent } from '../shared/content'
import LanguageSwitcher from './LanguageSwitcher'
const MotionAside = motion.aside
const MotionDiv = motion.div

const navLinkClassName = ({ isActive }) =>
  isActive ? 'nav-link active' : 'nav-link'

const drawerLinkClassName = ({ isActive }) =>
  isActive ? 'mobile-drawer__link mobile-drawer__link--active' : 'mobile-drawer__link'

function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { i18n, t } = useTranslation()
  const location = useLocation()
  const previousLocationRef = useRef(`${location.pathname}${location.hash}`)
  const primaryLinks = t('nav.links', { returnObjects: true })
  const mobileExtraLinks = t('nav.mobileExtraLinks', { returnObjects: true })
  const { data: remoteSettings } = useSiteSettings(i18n.resolvedLanguage)
  const siteSettings = mergeContent(
    {
      brand_name: 'MoRent',
      cta_labels: {
        primary: t('common.actions.bookNow'),
      },
    },
    remoteSettings || {},
  )

  useEffect(() => {
    const nextLocation = `${location.pathname}${location.hash}`

    if (previousLocationRef.current !== nextLocation && isDrawerOpen) {
      const frameId = window.requestAnimationFrame(() => {
        setIsDrawerOpen(false)
      })

      previousLocationRef.current = nextLocation

      return () => window.cancelAnimationFrame(frameId)
    }

    previousLocationRef.current = nextLocation

    return undefined
  }, [isDrawerOpen, location.hash, location.pathname])

  useEffect(() => {
    if (!isDrawerOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsDrawerOpen(false)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isDrawerOpen])

  const closeDrawer = () => {
    setIsDrawerOpen(false)
  }

  const toggleDrawer = () => {
    setIsDrawerOpen((current) => !current)
  }

  const brandName = siteSettings.brand_name === 'MoRent'
    ? (
        <>
          Mo<span>Rent</span>
        </>
      )
    : siteSettings.brand_name

  return (
    <>
      <header className="navbar">
        <div className="navbar__inner">
          <NavLink className="brand" to="/">
            {brandName}
          </NavLink>
          <div className="navbar__actions">
            <nav className="nav-links" aria-label={t('nav.primaryLabel')}>
              {primaryLinks.map((link) => (
                <NavLink
                  className={navLinkClassName}
                  end={link.end}
                  key={link.to}
                  to={link.to}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <LanguageSwitcher />
            <NavLink className="button button--primary button--small" to="/catalog">
              {siteSettings.cta_labels.primary}
            </NavLink>
          </div>
          <button
            aria-controls="mobile-navigation-drawer"
            aria-expanded={isDrawerOpen}
            aria-label={
              isDrawerOpen ? t('nav.closeMenu') : t('nav.openMenu')
            }
            className={`navbar__menu-toggle${isDrawerOpen ? ' is-open' : ''}`}
            onClick={toggleDrawer}
            type="button"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isDrawerOpen ? (
          <MotionDiv
            animate={{ opacity: 1 }}
            className="mobile-drawer"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            <button
              aria-label={t('nav.closeMenu')}
              className="mobile-drawer__backdrop"
              onClick={closeDrawer}
              type="button"
            />

            <MotionAside
              animate={{ opacity: 1, x: 0 }}
              className="mobile-drawer__panel"
              exit={{ opacity: 0, x: 18 }}
              id="mobile-navigation-drawer"
              initial={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mobile-drawer__header">
                <span>{t('nav.navigate')}</span>
                <button
                  aria-label={t('nav.closeMenu')}
                  className="mobile-drawer__close"
                  onClick={closeDrawer}
                  type="button"
                >
                  <span></span>
                  <span></span>
                </button>
              </div>

              <LanguageSwitcher className="language-switcher--drawer" />

              <nav
                aria-label={t('nav.mobilePrimaryLabel')}
                className="mobile-drawer__nav"
              >
                {primaryLinks.map((link) => (
                  <NavLink
                    className={drawerLinkClassName}
                    end={link.end}
                    key={link.to}
                    onClick={closeDrawer}
                    to={link.to}
                  >
                    {link.label}
                  </NavLink>
                ))}
                {mobileExtraLinks.map((link) => (
                  <NavLink
                    className={drawerLinkClassName}
                    key={link.to}
                    onClick={closeDrawer}
                    to={link.to}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </MotionAside>
          </MotionDiv>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export default Navbar
