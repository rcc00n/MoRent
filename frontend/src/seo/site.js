import {
  DEFAULT_LANGUAGE,
  normalizeLanguage,
  SUPPORTED_LANGUAGES,
} from '../i18n/resources/index.js'

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

export function getLanguageFromSearch(search = '') {
  const language = new URLSearchParams(search).get('lang')

  if (!language) {
    return null
  }

  return normalizeLanguage(language)
}

export function getSearchWithLanguage(search = '', language = DEFAULT_LANGUAGE) {
  const params = new URLSearchParams(search)
  const normalizedLanguage = normalizeLanguage(language)

  if (normalizedLanguage === DEFAULT_LANGUAGE) {
    params.delete('lang')
  } else {
    params.set('lang', normalizedLanguage)
  }

  const nextSearch = params.toString()
  return nextSearch ? `?${nextSearch}` : ''
}

export function buildLocalizedUrl(
  pathname,
  language = DEFAULT_LANGUAGE,
  siteUrl = DEFAULT_SITE_URL,
) {
  const url = new URL(buildAbsoluteUrl(pathname, siteUrl))
  const normalizedLanguage = normalizeLanguage(language)

  if (normalizedLanguage !== DEFAULT_LANGUAGE) {
    url.searchParams.set('lang', normalizedLanguage)
  }

  return url.toString()
}

export function buildLanguageAlternates(pathname, siteUrl = DEFAULT_SITE_URL) {
  const alternates = SUPPORTED_LANGUAGES.map((language) => ({
    hrefLang: language,
    href: buildLocalizedUrl(pathname, language, siteUrl),
  }))

  alternates.push({
    hrefLang: 'x-default',
    href: buildLocalizedUrl(pathname, DEFAULT_LANGUAGE, siteUrl),
  })

  return alternates
}

export function getOgLocale(language = DEFAULT_LANGUAGE) {
  return normalizeLanguage(language) === 'ru' ? 'ru_RU' : 'en_US'
}

export function getOgLocaleAlternates(language = DEFAULT_LANGUAGE) {
  const currentLanguage = normalizeLanguage(language)

  return SUPPORTED_LANGUAGES.filter((item) => item !== currentLanguage).map((item) =>
    getOgLocale(item),
  )
}

export function getRuntimeSiteUrl() {
  return normalizeSiteUrl(import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL)
}
