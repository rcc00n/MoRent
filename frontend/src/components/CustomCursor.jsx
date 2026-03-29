import { useEffect, useRef } from 'react'

const interactiveSelector = [
  'a',
  'button',
  'input',
  'textarea',
  'select',
  'label',
  '[role="button"]',
  '[data-cursor="interactive"]',
].join(',')

function CustomCursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse), (hover: none)').matches) {
      return undefined
    }

    const cursorNode = cursorRef.current
    if (!cursorNode) {
      return undefined
    }

    document.body.classList.add('cursor-enhanced')

    const state = {
      active: false,
      currentX: window.innerWidth / 2,
      currentY: window.innerHeight / 2,
      targetX: window.innerWidth / 2,
      targetY: window.innerHeight / 2,
      visible: false,
    }

    let frameId = 0

    const updateInteractiveState = (target) => {
      state.active = Boolean(target instanceof Element && target.closest(interactiveSelector))
    }

    const render = () => {
      state.currentX += (state.targetX - state.currentX) * 0.16
      state.currentY += (state.targetY - state.currentY) * 0.16

      cursorNode.style.opacity = state.visible ? (state.active ? '0.9' : '0.62') : '0'
      cursorNode.style.transform = `translate3d(${state.currentX}px, ${state.currentY}px, 0) translate(-50%, -50%) scale(${state.active ? 1.75 : 1})`

      frameId = window.requestAnimationFrame(render)
    }

    const handlePointerMove = (event) => {
      state.targetX = event.clientX
      state.targetY = event.clientY
      state.visible = true
      updateInteractiveState(event.target)
    }

    const handleMouseLeave = () => {
      state.visible = false
      state.active = false
    }

    const handleMouseOver = (event) => {
      updateInteractiveState(event.target)
    }

    const handleBlur = () => {
      state.visible = false
      state.active = false
    }

    frameId = window.requestAnimationFrame(render)

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('blur', handleBlur)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('blur', handleBlur)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.body.classList.remove('cursor-enhanced')
    }
  }, [])

  return (
    <div aria-hidden="true" className="custom-cursor" ref={cursorRef}>
      <span className="custom-cursor__core"></span>
    </div>
  )
}

export default CustomCursor
