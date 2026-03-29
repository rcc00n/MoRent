import { useEffect, useRef } from 'react'

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function smoothstep(edge0, edge1, value) {
  const x = clamp((value - edge0) / (edge1 - edge0), 0, 1)

  return x * x * (3 - 2 * x)
}

function fract(value) {
  return value - Math.floor(value)
}

function pseudoRandom(seed) {
  return fract(Math.sin(seed * 127.1) * 43758.5453123)
}

function sampleLine(start, end, count, accent = 0) {
  const points = []

  for (let index = 0; index < count; index += 1) {
    const t = count === 1 ? 0.5 : index / (count - 1)

    points.push({
      accent,
      x: start.x + (end.x - start.x) * t,
      y: start.y + (end.y - start.y) * t,
    })
  }

  return points
}

function sampleQuadratic(start, control, end, count, accent = 0) {
  const points = []

  for (let index = 0; index < count; index += 1) {
    const t = count === 1 ? 0.5 : index / (count - 1)
    const inverse = 1 - t

    points.push({
      accent,
      x: inverse * inverse * start.x + 2 * inverse * t * control.x + t * t * end.x,
      y: inverse * inverse * start.y + 2 * inverse * t * control.y + t * t * end.y,
    })
  }

  return points
}

function sampleArc(center, radiusX, radiusY, startAngle, endAngle, count, accent = 0) {
  const points = []

  for (let index = 0; index < count; index += 1) {
    const t = count === 1 ? 0.5 : index / (count - 1)
    const angle = startAngle + (endAngle - startAngle) * t

    points.push({
      accent,
      x: center.x + Math.cos(angle) * radiusX,
      y: center.y + Math.sin(angle) * radiusY,
    })
  }

  return points
}

function scaleCount(count, density) {
  return Math.max(5, Math.round(count * density))
}

function buildSilhouetteModel(compactMode) {
  const density = compactMode ? 0.62 : 1
  const guides = [
    sampleQuadratic(
      { x: 0.1, y: 0.66 },
      { x: 0.13, y: 0.55 },
      { x: 0.2, y: 0.5 },
      scaleCount(18, density),
      0.34,
    ),
    sampleQuadratic(
      { x: 0.2, y: 0.5 },
      { x: 0.4, y: 0.27 },
      { x: 0.6, y: 0.37 },
      scaleCount(40, density),
      0.9,
    ),
    sampleQuadratic(
      { x: 0.6, y: 0.37 },
      { x: 0.77, y: 0.38 },
      { x: 0.86, y: 0.54 },
      scaleCount(28, density),
      0.96,
    ),
    sampleLine(
      { x: 0.86, y: 0.54 },
      { x: 0.93, y: 0.64 },
      scaleCount(10, density),
      1,
    ),
    sampleLine(
      { x: 0.12, y: 0.67 },
      { x: 0.24, y: 0.67 },
      scaleCount(14, density),
      0.18,
    ),
    sampleArc(
      { x: 0.34, y: 0.67 },
      0.1,
      compactMode ? 0.088 : 0.1,
      Math.PI,
      0,
      scaleCount(28, density),
      0.5,
    ),
    sampleLine(
      { x: 0.44, y: 0.67 },
      { x: 0.58, y: 0.67 },
      scaleCount(18, density),
      0.18,
    ),
    sampleArc(
      { x: 0.68, y: 0.67 },
      0.1,
      compactMode ? 0.088 : 0.1,
      Math.PI,
      0,
      scaleCount(28, density),
      0.5,
    ),
    sampleLine(
      { x: 0.78, y: 0.67 },
      { x: 0.91, y: 0.67 },
      scaleCount(16, density),
      0.34,
    ),
    sampleLine(
      { x: 0.31, y: 0.49 },
      { x: 0.47, y: 0.41 },
      scaleCount(16, density),
      0.18,
    ),
    sampleLine(
      { x: 0.52, y: 0.41 },
      { x: 0.69, y: 0.45 },
      scaleCount(18, density),
      0.18,
    ),
  ]

  return {
    guides,
    targets: guides.flat(),
  }
}

function buildPoints(compactMode) {
  const silhouette = buildSilhouetteModel(compactMode)
  const points = silhouette.targets.map((target, index) => {
    const scatterX = 0.05 + pseudoRandom(index * 1.37 + 2.1) * 0.9
    const scatterY = 0.12 + pseudoRandom(index * 2.41 + 4.3) * 0.76
    const driftBiasX = (pseudoRandom(index * 5.17 + 3.8) - 0.5) * (compactMode ? 16 : 22)
    const driftBiasY = (pseudoRandom(index * 7.91 + 1.2) - 0.5) * (compactMode ? 14 : 18)

    return {
      accent: target.accent,
      driftBiasX,
      driftBiasY,
      scatterX,
      scatterY,
      seed: pseudoRandom(index * 6.71 + 0.91) * Math.PI * 2,
      targetX: target.x,
      targetY: target.y,
    }
  })

  return {
    guides: silhouette.guides,
    points,
  }
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
      guides: [],
      height: 0,
      points: [],
      reducedMotion: reducedMotionQuery.matches,
      visible: false,
      width: 0,
    }

    const resizeCanvas = () => {
      state.width = container.clientWidth
      state.height = container.clientHeight

      const dpr = Math.min(window.devicePixelRatio || 1, state.compactMode ? 1.2 : 1.7)

      canvas.width = Math.floor(state.width * dpr)
      canvas.height = Math.floor(state.height * dpr)
      canvas.style.width = `${state.width}px`
      canvas.style.height = `${state.height}px`

      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      const dotField = buildPoints(state.compactMode)
      state.guides = dotField.guides
      state.points = dotField.points
    }

    const renderGuide = (guide, alpha) => {
      if (guide.length < 2 || alpha <= 0.002) {
        return
      }

      context.beginPath()

      guide.forEach((node, index) => {
        const x = node.x * state.width
        const y = node.y * state.height

        if (index === 0) {
          context.moveTo(x, y)
        } else {
          context.lineTo(x, y)
        }
      })

      context.lineWidth = state.compactMode ? 0.8 : 1
      context.strokeStyle = `rgba(126, 177, 255, ${alpha})`
      context.stroke()
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
      const organizeIn = smoothstep(0.08, 0.4, progress)
      const organizeOut = 1 - smoothstep(0.62, 0.94, progress)
      const formation = organizeIn * organizeOut
      const focus = Math.pow(clamp(1 - Math.abs(progress - 0.5) / 0.2, 0, 1), 1.2)
      const resolve = state.reducedMotion ? formation * 0.8 : formation
      const ambientTime = timestamp * (state.reducedMotion ? 0.00006 : 0.00013)

      context.clearRect(0, 0, state.width, state.height)

      const glowGradient = context.createRadialGradient(
        state.width * 0.52,
        state.height * 0.48,
        0,
        state.width * 0.52,
        state.height * 0.48,
        state.width * 0.42,
      )

      glowGradient.addColorStop(0, `rgba(96, 156, 255, ${0.04 + focus * 0.14})`)
      glowGradient.addColorStop(0.65, 'rgba(46, 78, 149, 0.05)')
      glowGradient.addColorStop(1, 'rgba(5, 10, 19, 0)')

      context.fillStyle = glowGradient
      context.fillRect(0, 0, state.width, state.height)

      state.guides.forEach((guide) => {
        const guideAlpha = (0.02 + focus * 0.18) * (0.45 + guide[0].accent * 0.55)
        renderGuide(guide, guideAlpha * resolve)
      })

      context.globalCompositeOperation = 'screen'

      for (const point of state.points) {
        const scatterX = point.scatterX * state.width
        const scatterY = point.scatterY * state.height
        const targetX = point.targetX * state.width
        const targetY = point.targetY * state.height
        const ambientX =
          Math.sin(ambientTime + point.seed) *
          (state.compactMode ? 7 : 10) *
          (1 - resolve * 0.9)
        const ambientY =
          Math.cos(ambientTime * 1.16 + point.seed * 0.82) *
          (state.compactMode ? 6 : 9) *
          (1 - resolve * 0.88)
        const dissolveX = point.driftBiasX * (1 - formation)
        const dissolveY = point.driftBiasY * (1 - formation)
        const x = scatterX + (targetX - scatterX) * resolve + ambientX + dissolveX
        const y = scatterY + (targetY - scatterY) * resolve + ambientY + dissolveY
        const radius =
          (state.compactMode ? 1.05 : 1.18) +
          point.accent * 0.45 +
          focus * 0.52
        const alpha = clamp(
          0.2 + point.accent * 0.16 + resolve * 0.34 + focus * 0.2,
          0.18,
          0.88,
        )

        let fill = `rgba(142, 190, 255, ${alpha})`

        if (point.accent > 0.88 && resolve > 0.38) {
          fill = `rgba(255, 210, 160, ${Math.min(alpha * 0.82, 0.54)})`
        } else if (point.accent > 0.42 && resolve > 0.3) {
          fill = `rgba(118, 175, 255, ${Math.min(alpha * 1.04, 0.8)})`
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
