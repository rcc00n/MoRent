import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion'
import { Link } from 'react-router-dom'

const MotionSpan = motion.span

function MagneticAction({ children, className, href, to }) {
  const wrapperRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, {
    stiffness: 220,
    damping: 26,
    mass: 0.5,
  })
  const springY = useSpring(y, {
    stiffness: 220,
    damping: 26,
    mass: 0.5,
  })

  const handlePointerMove = (event) => {
    if (shouldReduceMotion || event.pointerType !== 'mouse') {
      return
    }

    const wrapper = wrapperRef.current

    if (!wrapper) {
      return
    }

    const rect = wrapper.getBoundingClientRect()
    const offsetX = event.clientX - rect.left - rect.width / 2
    const offsetY = event.clientY - rect.top - rect.height / 2

    x.set(Math.max(Math.min(offsetX * 0.08, 5), -5))
    y.set(Math.max(Math.min(offsetY * 0.08, 4), -4))
  }

  const handlePointerLeave = () => {
    x.set(0)
    y.set(0)
  }

  const content = to ? (
    <Link className={className} to={to}>
      {children}
    </Link>
  ) : (
    <a className={className} href={href}>
      {children}
    </a>
  )

  return (
    <MotionSpan
      className="magnetic-action"
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      ref={wrapperRef}
      style={shouldReduceMotion ? undefined : { x: springX, y: springY }}
    >
      {content}
    </MotionSpan>
  )
}

export default MagneticAction
