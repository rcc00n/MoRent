import { useEffect, useRef } from 'react'

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function gaussian(distance, width) {
  return Math.exp(-((distance * distance) / (2 * width * width)))
}

function smoothstep(edge0, edge1, value) {
  const x = clamp((value - edge0) / (edge1 - edge0), 0, 1)

  return x * x * (3 - 2 * x)
}

function buildPoints(width, compactMode) {
  const columns = compactMode ? 30 : width < 920 ? 42 : 62
  const rows = compactMode ? 14 : width < 920 ? 18 : 26
  const points = []

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const nx = columns === 1 ? 0.5 : column / (columns - 1)
      const ny = rows === 1 ? 0.5 : row / (rows - 1)

      points.push({
        accent: Math.random() > 0.955,
        depth: 0.72 + Math.random() * 0.62,
        nx: clamp(nx + (Math.random() - 0.5) * 0.014, 0.03, 0.97),
        ny: clamp(ny + (Math.random() - 0.5) * 0.022, 0.08, 0.92),
        seed: Math.random() * Math.PI * 2,
      })
    }
  }

  return points
}

function getSilhouetteTarget(nx, ny, compactMode) {
  let totalWeight = 0
  let weightedX = 0
  let weightedY = 0
  let accentWeight = 0

  const addTarget = (targetX, targetY, weight, accent = 0) => {
    if (weight <= 0.002) {
      return
    }

    totalWeight += weight
    weightedX += targetX * weight
    weightedY += targetY * weight
    accentWeight = Math.max(accentWeight, accent * weight)
  }

  if (nx >= 0.18 && nx <= 0.82) {
    const t = (nx - 0.18) / 0.64
    const roofY = 0.47 - Math.sin(t * Math.PI) * 0.18
    const bodyY = 0.58 - Math.sin(t * Math.PI) * 0.018
    const roofWeight =
      gaussian(ny - roofY, compactMode ? 0.028 : 0.022) *
      Math.pow(Math.sin(t * Math.PI), 0.9) *
      1.55
    const bodyWeight =
      gaussian(ny - bodyY, compactMode ? 0.026 : 0.02) *
      (0.58 + Math.sin(t * Math.PI) * 0.18)

    addTarget(nx, roofY, roofWeight)
    addTarget(nx, bodyY, bodyWeight)
  }

  if (nx >= 0.77 && nx <= 0.9) {
    const t = (nx - 0.77) / 0.13
    const noseY = 0.46 + Math.pow(t, 0.78) * 0.16
    const noseWeight = gaussian(ny - noseY, compactMode ? 0.028 : 0.022) * 1.16

    addTarget(0.77 + t * 0.12, noseY, noseWeight, 0.9)
  }

  if (nx >= 0.1 && nx <= 0.24) {
    const t = (nx - 0.1) / 0.14
    const tailY = 0.57 - Math.pow(t, 0.82) * 0.12
    const tailWeight = gaussian(ny - tailY, compactMode ? 0.03 : 0.024) * 0.94

    addTarget(0.1 + t * 0.12, tailY, tailWeight, 0.35)
  }

  const wheelRadius = compactMode ? 0.078 : 0.065
  const wheelDepth = compactMode ? 0.048 : 0.058

  for (const centerX of [0.36, 0.66]) {
    const distance = Math.abs(nx - centerX)

    if (distance < wheelRadius) {
      const wheelArc = Math.sqrt(1 - (distance / wheelRadius) ** 2)
      const wheelY = 0.64 - wheelArc * wheelDepth
      const wheelWeight =
        gaussian(ny - wheelY, compactMode ? 0.026 : 0.02) * 1.18

      addTarget(nx, wheelY, wheelWeight)
    }
  }

  if (nx >= 0.16 && nx <= 0.88) {
    const t = (nx - 0.16) / 0.72
    const roadY = 0.77 + Math.sin(t * Math.PI) * 0.014
    const roadWeight = gaussian(ny - roadY, compactMode ? 0.036 : 0.028) * 0.38

    addTarget(nx, roadY, roadWeight)
  }

  if (totalWeight <= 0.001) {
    return {
      accent: 0,
      strength: 0,
      targetX: nx,
      targetY: ny,
    }
  }

  return {
    accent: clamp(accentWeight, 0, 1),
    strength: clamp(totalWeight, 0, 1.1),
    targetX: weightedX / totalWeight,
    targetY: weightedY / totalWeight,
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
      const choreography = Math.pow(clamp(centerPulse, 0, 1), 1.18)
      const convergence = state.reducedMotion ? choreography * 0.55 : choreography
      const ambientTime = timestamp * (state.reducedMotion ? 0.00008 : 0.00016)
      const fieldCompression = 1 - convergence * 0.09

      context.clearRect(0, 0, state.width, state.height)

      const glowGradient = context.createRadialGradient(
        state.width * 0.68,
        state.height * 0.48,
        0,
        state.width * 0.68,
        state.height * 0.48,
        state.width * 0.48,
      )

      glowGradient.addColorStop(0, `rgba(102, 156, 255, ${0.08 + choreography * 0.1})`)
      glowGradient.addColorStop(0.55, 'rgba(56, 94, 183, 0.05)')
      glowGradient.addColorStop(1, 'rgba(5, 10, 19, 0)')

      context.fillStyle = glowGradient
      context.fillRect(0, 0, state.width, state.height)
      context.globalCompositeOperation = 'screen'

      for (const point of state.points) {
        const compressedY = ((point.ny - 0.5) * fieldCompression + 0.5) * state.height
        const baseX = point.nx * state.width
        const baseY = compressedY
        const silhouette = getSilhouetteTarget(point.nx, point.ny, state.compactMode)
        const organizeStrength = silhouette.strength * convergence
        const fieldInfluence =
          Math.exp(-((point.ny - 0.52) ** 2) / 0.11) * (0.12 + convergence * 0.18)
        const ambientShift = Math.sin(ambientTime + point.seed) * point.depth
        const resolveWindow = smoothstep(0.08, 0.42, progress) * (1 - smoothstep(0.62, 0.94, progress))
        const flowX =
          Math.sin(
            (point.ny * 2.8 + point.seed + progress * 1.45) * Math.PI * 2 + ambientTime,
          ) *
          12 *
          (0.18 + (1 - convergence) * 0.82)
        const flowY =
          Math.cos(
            (point.nx * 2.2 - progress * 1.1 + point.seed * 0.34) * Math.PI * 2 +
              ambientTime * 1.1,
          ) *
          14 *
          (0.22 + (1 - convergence) * 0.64)
        const settleShift =
          ambientShift * (state.reducedMotion ? 1.1 : 1.9) * (1 - convergence * 0.52)
        const targetX = silhouette.targetX * state.width
        const targetY = silhouette.targetY * state.height
        const x =
          baseX +
          flowX +
          ambientShift * 0.34 +
          (targetX - baseX) * organizeStrength * 0.92 +
          Math.sin(point.seed + ambientTime * 0.72) * 3.2 * resolveWindow * (1 - organizeStrength)
        const y =
          baseY +
          flowY +
          settleShift * 0.34 +
          Math.sin(point.seed + ambientTime * 0.8) * 4.2 * fieldInfluence +
          (targetY - baseY) * organizeStrength * 0.96
        const radius =
          (state.compactMode ? 0.7 : 0.82) +
          point.depth * 0.2 +
          organizeStrength * 1.18
        const alpha = clamp(
          0.08 + point.depth * 0.05 + organizeStrength * 0.58 + fieldInfluence * 0.11,
          0.08,
          0.82,
        )

        let fill = `rgba(146, 192, 255, ${alpha})`

        if (silhouette.accent > 0.12 && organizeStrength > 0.18 && point.accent) {
          fill = `rgba(255, 208, 152, ${Math.min(alpha * 0.82, 0.46)})`
        } else if (organizeStrength > 0.18) {
          fill = `rgba(120, 172, 255, ${Math.min(alpha * 1.02, 0.72)})`
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
