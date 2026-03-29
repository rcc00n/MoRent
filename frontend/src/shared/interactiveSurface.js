export function updateInteractiveGlow(event) {
  const element = event.currentTarget
  const rect = element.getBoundingClientRect()

  element.style.setProperty('--spotlight-x', `${event.clientX - rect.left}px`)
  element.style.setProperty('--spotlight-y', `${event.clientY - rect.top}px`)
}

export function resetInteractiveGlow(event) {
  const element = event.currentTarget

  element.style.removeProperty('--spotlight-x')
  element.style.removeProperty('--spotlight-y')
}
