import {
  buildLanguageAlternates,
  buildLocalizedUrl,
  getOgLocale,
  getOgLocaleAlternates,
} from './site'

export function buildCmsMetadata({
  description,
  language,
  pathname,
  robots = 'index,follow',
  siteUrl,
  structuredData,
  title,
}) {
  return {
    title,
    description,
    robots,
    canonicalUrl: buildLocalizedUrl(pathname, language, siteUrl),
    url: buildLocalizedUrl(pathname, language, siteUrl),
    ogType: 'website',
    language,
    alternates: buildLanguageAlternates(pathname, siteUrl),
    ogLocale: getOgLocale(language),
    ogLocaleAlternates: getOgLocaleAlternates(language),
    structuredData,
  }
}
