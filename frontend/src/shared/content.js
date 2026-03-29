function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

export function mergeContent(fallbackValue, overrideValue) {
  if (Array.isArray(fallbackValue)) {
    return Array.isArray(overrideValue) && overrideValue.length
      ? overrideValue
      : fallbackValue
  }

  if (isPlainObject(fallbackValue)) {
    const fallbackObject = fallbackValue
    const overrideObject = isPlainObject(overrideValue) ? overrideValue : {}
    const nextValue = { ...fallbackObject }

    Object.keys(overrideObject).forEach((key) => {
      nextValue[key] = key in fallbackObject
        ? mergeContent(fallbackObject[key], overrideObject[key])
        : overrideObject[key]
    })

    return nextValue
  }

  if (overrideValue === null || overrideValue === undefined || overrideValue === '') {
    return fallbackValue
  }

  return overrideValue
}

export function pickFirstFilled(...values) {
  return values.find(
    (value) =>
      value !== null &&
      value !== undefined &&
      !(typeof value === 'string' && value.trim() === ''),
  )
}
