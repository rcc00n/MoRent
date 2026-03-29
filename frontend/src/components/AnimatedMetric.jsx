import { useEffect, useRef, useState } from 'react'

function AnimatedMetric({ decimals = 0, suffix = '', value }) {
  const containerRef = useRef(null)
  const [displayValue, setDisplayValue] = useState(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return value
    }

    return 0
  })

  useEffect(() => {
    const node = containerRef.current

    if (!node) {
      return undefined
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      return undefined
    }

    let frameId = 0
    let hasPlayed = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasPlayed) {
          return
        }

        hasPlayed = true
        const duration = 900
        const startTime = performance.now()

        const tick = (now) => {
          const elapsed = now - startTime
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)

          setDisplayValue(value * eased)

          if (progress < 1) {
            frameId = window.requestAnimationFrame(tick)
          } else {
            setDisplayValue(value)
          }
        }

        frameId = window.requestAnimationFrame(tick)
        observer.disconnect()
      },
      {
        threshold: 0.45,
      },
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(frameId)
    }
  }, [value])

  const formattedValue =
    decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue).toString()

  return (
    <span className="animated-metric" ref={containerRef}>
      {formattedValue}
      {suffix}
    </span>
  )
}

export default AnimatedMetric
