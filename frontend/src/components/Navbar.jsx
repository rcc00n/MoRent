import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NavLink, useLocation } from 'react-router-dom'

const MotionAside = motion.aside
const MotionDiv = motion.div

const primaryLinks = [
  {
    label: 'Home',
    to: '/',
    end: true,
  },
  {
    label: 'Fleet',
    to: '/catalog',
  },
  {
    label: 'How It Works',
    to: '/how-it-works',
  },
  {
    label: 'About',
    to: '/about',
  },
  {
    label: 'Contacts',
    to: '/contacts',
  },
]

const navLinkClassName = ({ isActive }) =>
  isActive ? 'nav-link active' : 'nav-link'

const drawerLinkClassName = ({ isActive }) =>
  isActive ? 'mobile-drawer__link mobile-drawer__link--active' : 'mobile-drawer__link'

function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const location = useLocation()
  const previousLocationRef = useRef(`${location.pathname}${location.hash}`)

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

  return (
    <>
      <header className="navbar">
        <div className="navbar__inner">
          <NavLink className="brand" to="/">
            Mo<span>Rent</span>
          </NavLink>
          <div className="navbar__actions">
            <nav className="nav-links" aria-label="Primary">
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
            <NavLink className="button button--primary button--small" to="/catalog">
              Book now
            </NavLink>
          </div>
          <button
            aria-controls="mobile-navigation-drawer"
            aria-expanded={isDrawerOpen}
            aria-label={isDrawerOpen ? 'Close navigation menu' : 'Open navigation menu'}
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
              aria-label="Close navigation menu"
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
                <span>Navigate</span>
                <button
                  aria-label="Close navigation menu"
                  className="mobile-drawer__close"
                  onClick={closeDrawer}
                  type="button"
                >
                  <span></span>
                  <span></span>
                </button>
              </div>

              <nav aria-label="Mobile primary" className="mobile-drawer__nav">
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
                <NavLink
                  className={drawerLinkClassName}
                  onClick={closeDrawer}
                  to="/faq"
                >
                  FAQ
                </NavLink>
                <NavLink
                  className={drawerLinkClassName}
                  onClick={closeDrawer}
                  to="/catalog"
                >
                  Book now
                </NavLink>
              </nav>
            </MotionAside>
          </MotionDiv>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export default Navbar
