const pendingGlowFrames = new WeakMap()
const pointerPositions = new WeakMap()

export function updateInteractiveGlow(event) {
  if (event.pointerType && event.pointerType !== 'mouse') {
    return
  }

  const element = event.currentTarget

  pointerPositions.set(element, {
    clientX: event.clientX,
    clientY: event.clientY,
  })

  if (pendingGlowFrames.has(element)) {
    return
  }

  const frameId = window.requestAnimationFrame(() => {
    pendingGlowFrames.delete(element)

    const pointer = pointerPositions.get(element)

    if (!pointer) {
      return
    }

    const rect = element.getBoundingClientRect()

    element.style.setProperty('--spotlight-x', `${pointer.clientX - rect.left}px`)
    element.style.setProperty('--spotlight-y', `${pointer.clientY - rect.top}px`)
  })

  pendingGlowFrames.set(element, frameId)
}

export function resetInteractiveGlow(event) {
  const element = event.currentTarget
  const frameId = pendingGlowFrames.get(element)

  if (frameId) {
    window.cancelAnimationFrame(frameId)
    pendingGlowFrames.delete(element)
  }

  pointerPositions.delete(element)
  element.style.removeProperty('--spotlight-x')
  element.style.removeProperty('--spotlight-y')
}
