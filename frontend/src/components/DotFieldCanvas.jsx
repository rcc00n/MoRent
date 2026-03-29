import { useEffect, useRef } from 'react'

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function buildPoints(width, compactMode) {
  const columns = compactMode ? 28 : width < 920 ? 40 : 58
  const rows = compactMode ? 14 : width < 920 ? 18 : 24
  const points = []

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const nx = columns === 1 ? 0.5 : column / (columns - 1)
      const ny = rows === 1 ? 0.5 : row / (rows - 1)

      points.push({
        accent: Math.random() > 0.955,
        depth: 0.72 + Math.random() * 0.62,
        nx: clamp(nx + (Math.random() - 0.5) * 0.012, 0.03, 0.97),
        ny: clamp(ny + (Math.random() - 0.5) * 0.018, 0.08, 0.92),
        seed: Math.random() * Math.PI * 2,
      })
    }
  }

  return points
}

function bindMediaListener(mediaQueryList, handler) {
  if (typeof mediaQueryList.addEventListener === 'function') {
    mediaQueryList.addEventListener('change', handler)

    return () => mediaQueryList.removeEventListener('change', handler)
  }

  mediaQueryList.addListener(handler)

  return () => mediaQueryList.removeListener(handler)
}

function DotFieldCanvas() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current

    if (!canvas || !container) {
      return undefined
    }

    const context = canvas.getContext('2d')

    if (!context) {
      return undefined
    }

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const compactModeQuery = window.matchMedia('(pointer: coarse), (max-width: 900px)')

    const state = {
      compactMode: compactModeQuery.matches,
      frameId: 0,
      height: 0,
      points: [],
      reducedMotion: reducedMotionQuery.matches,
      visible: false,
      width: 0,
    }

    const resizeCanvas = () => {
      state.width = container.clientWidth
      state.height = container.clientHeight

      const dpr = Math.min(window.devicePixelRatio || 1, state.compactMode ? 1.25 : 1.8)

      canvas.width = Math.floor(state.width * dpr)
      canvas.height = Math.floor(state.height * dpr)
      canvas.style.width = `${state.width}px`
      canvas.style.height = `${state.height}px`

      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      state.points = buildPoints(state.width, state.compactMode)
    }

    const render = (timestamp) => {
      if (!state.visible) {
        state.frameId = 0

        return
      }

      const rect = container.getBoundingClientRect()
      const progress = clamp(
        (window.innerHeight - rect.top) / (window.innerHeight + rect.height),
        0,
        1,
      )
      const centerPulse = 1 - Math.abs(progress - 0.5) / 0.5
      const choreography = Math.pow(clamp(centerPulse, 0, 1), 1.15)
      const motionStrength = state.reducedMotion ? choreography * 0.45 : choreography
      const ambientTime = timestamp * (state.reducedMotion ? 0.00008 : 0.00016)

      context.clearRect(0, 0, state.width, state.height)

      const glowGradient = context.createRadialGradient(
        state.width * 0.72,
        state.height * 0.5,
        0,
        state.width * 0.72,
        state.height * 0.5,
        state.width * 0.42,
      )

      glowGradient.addColorStop(0, `rgba(102, 156, 255, ${0.1 + choreography * 0.08})`)
      glowGradient.addColorStop(0.55, 'rgba(56, 94, 183, 0.05)')
      glowGradient.addColorStop(1, 'rgba(5, 10, 19, 0)')

      context.fillStyle = glowGradient
      context.fillRect(0, 0, state.width, state.height)
      context.globalCompositeOperation = 'screen'

      for (const point of state.points) {
        const baseX = point.nx * state.width
        const baseY = point.ny * state.height
        const contourA = 0.38 + Math.sin(point.nx * Math.PI * 1.08) * 0.08
        const contourB = 0.6 - Math.sin(point.nx * Math.PI * 1.2 + 0.4) * 0.065
        const bandWidth = state.compactMode ? 0.02 : 0.014
        const contourInfluenceA = Math.exp(
          -((point.ny - contourA) ** 2) / (2 * bandWidth * bandWidth),
        )
        const contourInfluenceB = Math.exp(
          -((point.ny - contourB) ** 2) / (2 * (bandWidth * 1.2) ** 2),
        )
        const contourInfluence = Math.max(contourInfluenceA, contourInfluenceB) * motionStrength
        const fieldInfluence =
          Math.exp(-((point.ny - 0.5) ** 2) / 0.12) * (0.16 + choreography * 0.14)
        const ambientShift = Math.sin(ambientTime + point.seed) * point.depth
        const flowX =
          Math.sin(
            (point.ny * 3.2 + point.seed + progress * 1.7) * Math.PI * 2 + ambientTime,
          ) *
          10 *
          contourInfluence
        const flowY =
          Math.cos(
            (point.nx * 2.6 - progress * 1.3 + point.seed * 0.34) * Math.PI * 2 +
              ambientTime * 1.1,
          ) *
          18 *
          contourInfluence
        const settleShift = ambientShift * (state.reducedMotion ? 1.1 : 1.9) * (1 - choreography * 0.45)
        const x = baseX + flowX + ambientShift * 0.32
        const y =
          baseY +
          flowY +
          settleShift * 0.34 +
          Math.sin(point.seed + ambientTime * 0.8) * 4.2 * fieldInfluence
        const radius =
          (state.compactMode ? 0.72 : 0.86) +
          point.depth * 0.2 +
          contourInfluence * 1.08
        const alpha = clamp(
          0.12 + point.depth * 0.06 + contourInfluence * 0.42 + fieldInfluence * 0.12,
          0.12,
          0.76,
        )

        let fill = `rgba(150, 193, 255, ${alpha})`

        if (point.accent && contourInfluence > 0.22) {
          fill = `rgba(255, 210, 154, ${Math.min(alpha * 0.72, 0.4)})`
        } else if (contourInfluence > 0.14) {
          fill = `rgba(120, 170, 255, ${Math.min(alpha * 1.02, 0.66)})`
        }

        context.fillStyle = fill
        context.beginPath()
        context.arc(x, y, radius, 0, Math.PI * 2)
        context.fill()
      }

      context.globalCompositeOperation = 'source-over'
      state.frameId = window.requestAnimationFrame(render)
    }

    const start = () => {
      if (state.frameId || !state.visible) {
        return
      }

      state.frameId = window.requestAnimationFrame(render)
    }

    const stop = () => {
      if (!state.frameId) {
        return
      }

      window.cancelAnimationFrame(state.frameId)
      state.frameId = 0
    }

    const handleResize = () => {
      state.compactMode = compactModeQuery.matches
      resizeCanvas()
    }

    const handleReducedMotionChange = () => {
      state.reducedMotion = reducedMotionQuery.matches
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stop()
      } else if (state.visible) {
        start()
      }
    }

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        state.visible = entry.isIntersecting

        if (state.visible) {
          start()
        } else {
          stop()
        }
      },
      {
        threshold: 0.08,
      },
    )

    const resizeObserver =
      typeof ResizeObserver === 'function'
        ? new ResizeObserver(() => {
            handleResize()
          })
        : null

    resizeCanvas()
    intersectionObserver.observe(container)
    resizeObserver?.observe(container)

    const removeReducedMotionListener = bindMediaListener(
      reducedMotionQuery,
      handleReducedMotionChange,
    )
    const removeCompactModeListener = bindMediaListener(
      compactModeQuery,
      handleResize,
    )

    window.addEventListener('resize', handleResize)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      stop()
      intersectionObserver.disconnect()
      resizeObserver?.disconnect()
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      removeReducedMotionListener()
      removeCompactModeListener()
    }
  }, [])

  return (
    <div aria-hidden="true" className="dot-field" ref={containerRef}>
      <canvas className="dot-field__canvas" ref={canvasRef} />
    </div>
  )
}

export default DotFieldCanvas
