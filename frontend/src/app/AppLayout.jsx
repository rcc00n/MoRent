import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'

import CustomCursor from '../components/CustomCursor'
import Navbar from '../components/Navbar'

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

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [location.pathname])

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
    </div>
  )
}

export default AppLayout
