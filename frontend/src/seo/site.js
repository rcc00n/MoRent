export const SITE_NAME = 'MoRent'
export const DEFAULT_SITE_URL = 'https://morent82.duckdns.org'

export function normalizeSiteUrl(value) {
  return (value || DEFAULT_SITE_URL).replace(/\/+$/, '')
}

export function normalizePathname(pathname) {
  if (!pathname || pathname === '/') {
    return '/'
  }

  const normalizedPath = pathname.replace(/\/+$/, '')
  return normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`
}

export function buildAbsoluteUrl(pathname, siteUrl = DEFAULT_SITE_URL) {
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl)
  const normalizedPathname = normalizePathname(pathname)

  if (normalizedPathname === '/') {
    return normalizedSiteUrl
  }

  return `${normalizedSiteUrl}${normalizedPathname}`
}

export function getRuntimeSiteUrl() {
  return normalizeSiteUrl(import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL)
}
