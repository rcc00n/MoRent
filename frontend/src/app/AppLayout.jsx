import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLocation, useNavigationType } from 'react-router-dom'

import CustomCursor from '../components/CustomCursor'
import Navbar from '../components/Navbar'
import SiteFooter from '../components/SiteFooter'

const MotionMain = motion.main

const pageTransitionVariants = {
  initial: {
    opacity: 0,
    y: 24,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.42,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -18,
    transition: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

function AppLayout() {
  const location = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    if (location.hash) {
      const frameId = window.requestAnimationFrame(() => {
        const target = document.getElementById(
          decodeURIComponent(location.hash.slice(1)),
        )

        target?.scrollIntoView({
          block: 'start',
        })
      })

      return () => window.cancelAnimationFrame(frameId)
    }

    if (navigationType === 'POP') {
      return undefined
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    })

    return undefined
  }, [location.hash, location.pathname, navigationType])

  return (
    <div className="app-shell">
      <CustomCursor />
      <Navbar />
      <AnimatePresence initial={false} mode="wait">
        <MotionMain
          animate="animate"
          className="page-shell"
          exit="exit"
          initial="initial"
          key={location.pathname}
          variants={pageTransitionVariants}
        >
          <Outlet />
        </MotionMain>
      </AnimatePresence>
      <SiteFooter />
    </div>
  )
}

export default AppLayout
