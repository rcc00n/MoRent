import { getDictionary } from '../i18n/resources/index.js'
import {
  buildLanguageAlternates,
  buildLocalizedUrl,
  getOgLocale,
  getOgLocaleAlternates,
  normalizePathname,
  SITE_NAME,
} from './site.js'

const pageMetadataRegistry = {
  '/': {
    key: 'home',
    structuredData: (siteUrl, dictionary, language) => [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: buildLocalizedUrl('/', language, siteUrl),
        description: dictionary.metadata.organizationDescription,
        inLanguage: language,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: SITE_NAME,
        url: buildLocalizedUrl('/', language, siteUrl),
        description: dictionary.metadata.organizationDescription,
        areaServed: [
          'Coastal resort area',
          'Hotel pickup coordination',
          'Airport arrival pickup',
        ],
        availableLanguage: ['en', 'ru'],
        serviceType: 'Premium car rental',
        inLanguage: language,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: buildLocalizedUrl('/', language, siteUrl),
        inLanguage: language,
      },
    ],
  },
  '/catalog': {
    key: 'catalog',
  },
  '/how-it-works': {
    key: 'howItWorks',
  },
  '/about': {
    key: 'about',
    structuredData: (siteUrl, dictionary, language, pathname, pageCopy) => ({
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: pageCopy.title,
      description: pageCopy.description,
      url: buildLocalizedUrl(pathname, language, siteUrl),
      inLanguage: language,
      about: {
        '@type': 'LocalBusiness',
        name: SITE_NAME,
        description: dictionary.metadata.organizationDescription,
      },
    }),
  },
  '/contacts': {
    key: 'contacts',
    structuredData: (siteUrl, _dictionary, language, pathname, pageCopy) => ({
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: pageCopy.title,
      description: pageCopy.description,
      url: buildLocalizedUrl(pathname, language, siteUrl),
      inLanguage: language,
    }),
  },
  '/faq': {
    key: 'faq',
    structuredData: (siteUrl, dictionary, language, pathname) => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      url: buildLocalizedUrl(pathname, language, siteUrl),
      inLanguage: language,
      mainEntity: dictionary.faq.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    }),
  },
  '/terms': {
    key: 'terms',
  },
  '/privacy': {
    key: 'privacy',
  },
  '/request-received': {
    key: 'requestReceived',
    robots: 'noindex,follow',
    shouldIndex: false,
  },
}

function normalizePageLanguage(language) {
  return language === 'ru' ? 'ru' : 'en'
}

function getLocalizedPageCopy(pathname, language) {
  const dictionary = getDictionary(language)
  const registryEntry = pageMetadataRegistry[normalizePathname(pathname)] || {}
  const metadataKey = registryEntry.key

  return {
    dictionary,
    entry: registryEntry,
    pageCopy: metadataKey
      ? dictionary.metadata.pages[metadataKey]
      : dictionary.metadata.default,
  }
}

function buildMetadataPayload({
  pathname,
  language,
  siteUrl,
  pageCopy,
  entry,
  structuredData,
}) {
  const normalizedLanguage = normalizePageLanguage(language)

  return {
    title: pageCopy.title,
    description: pageCopy.description,
    robots: entry.robots || 'index,follow',
    canonicalUrl: buildLocalizedUrl(pathname, normalizedLanguage, siteUrl),
    url: buildLocalizedUrl(pathname, normalizedLanguage, siteUrl),
    ogType: entry.ogType || 'website',
    shouldIndex: entry.shouldIndex !== false,
    language: normalizedLanguage,
    alternates: buildLanguageAlternates(pathname, siteUrl),
    ogLocale: getOgLocale(normalizedLanguage),
    ogLocaleAlternates: getOgLocaleAlternates(normalizedLanguage),
    structuredData,
  }
}

export function getDefaultSiteMetadata(siteUrl, language = 'en') {
  const dictionary = getDictionary(language)

  return buildMetadataPayload({
    pathname: '/',
    language,
    siteUrl,
    pageCopy: dictionary.metadata.default,
    entry: {},
    structuredData: null,
  })
}

export function getPageMetadata(pathname, siteUrl, language = 'en') {
  const normalizedPathname = normalizePathname(pathname)
  const normalizedLanguage = normalizePageLanguage(language)
  const { dictionary, entry, pageCopy } = getLocalizedPageCopy(
    normalizedPathname,
    normalizedLanguage,
  )

  return buildMetadataPayload({
    pathname: normalizedPathname,
    language: normalizedLanguage,
    siteUrl,
    pageCopy,
    entry,
    structuredData: entry.structuredData
      ? entry.structuredData(
          siteUrl,
          dictionary,
          normalizedLanguage,
          normalizedPathname,
          pageCopy,
        )
      : null,
  })
}

export function getStaticPageEntries(siteUrl) {
  return Object.keys(pageMetadataRegistry).map((pathname) => {
    const metadataByLanguage = {
      en: getPageMetadata(pathname, siteUrl, 'en'),
      ru: getPageMetadata(pathname, siteUrl, 'ru'),
    }

    return {
      pathname,
      metadata: metadataByLanguage.en,
      metadataByLanguage,
    }
  })
}

export function getCarPageMetadata(car, siteUrl, language = 'en') {
  const normalizedLanguage = normalizePageLanguage(language)
  const dictionary = getDictionary(normalizedLanguage)
  const localizedCarDescription =
    (car.translationKey && dictionary.cars?.[car.translationKey]?.description) ||
    car.description
  const carName = `${car.brand} ${car.model}`
  const canonicalUrl = buildLocalizedUrl(`/car/${car.id}`, normalizedLanguage, siteUrl)
  const metadataCopy = dictionary.metadata.pages.car

  return {
    title: metadataCopy.title.replace('{{carName}}', carName),
    description:
      localizedCarDescription ||
      metadataCopy.fallbackDescription.replace('{{carName}}', carName),
    robots: 'index,follow',
    canonicalUrl,
    url: canonicalUrl,
    ogType: 'product',
    shouldIndex: true,
    language: normalizedLanguage,
    alternates: buildLanguageAlternates(`/car/${car.id}`, siteUrl),
    ogLocale: getOgLocale(normalizedLanguage),
    ogLocaleAlternates: getOgLocaleAlternates(normalizedLanguage),
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Car',
      name: carName,
      brand: {
        '@type': 'Brand',
        name: car.brand,
      },
      model: car.model,
      description:
        localizedCarDescription || metadataCopy.structuredFallbackDescription,
      url: canonicalUrl,
      inLanguage: normalizedLanguage,
    },
  }
}
