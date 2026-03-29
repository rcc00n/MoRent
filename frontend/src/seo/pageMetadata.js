import { getDictionary } from '../i18n/resources/index.js'
import {
  buildAbsoluteUrl,
  normalizePathname,
  SITE_NAME,
} from './site.js'

const pageMetadataRegistry = {
  '/': {
    key: 'home',
    structuredData: (siteUrl, dictionary) => [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: buildAbsoluteUrl('/', siteUrl),
        description: dictionary.metadata.organizationDescription,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: buildAbsoluteUrl('/', siteUrl),
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
  },
  '/contacts': {
    key: 'contacts',
  },
  '/faq': {
    key: 'faq',
    structuredData: (_siteUrl, dictionary) => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
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

function getLocalizedPageCopy(pathname, language) {
  const dictionary = getDictionary(language)
  const registryEntry =
    pageMetadataRegistry[normalizePathname(pathname)] || {}
  const metadataKey = registryEntry.key

  return {
    dictionary,
    entry: registryEntry,
    pageCopy: metadataKey
      ? dictionary.metadata.pages[metadataKey]
      : dictionary.metadata.default,
  }
}

export function getPageMetadata(pathname, siteUrl, language = 'en') {
  const normalizedPathname = normalizePathname(pathname)
  const { dictionary, entry, pageCopy } = getLocalizedPageCopy(
    normalizedPathname,
    language,
  )

  return {
    title: pageCopy.title,
    description: pageCopy.description,
    robots: entry.robots || 'index,follow',
    canonicalUrl: buildAbsoluteUrl(normalizedPathname, siteUrl),
    url: buildAbsoluteUrl(normalizedPathname, siteUrl),
    ogType: entry.ogType || 'website',
    shouldIndex: entry.shouldIndex !== false,
    structuredData: entry.structuredData
      ? entry.structuredData(siteUrl, dictionary)
      : null,
  }
}

export function getStaticPageEntries(siteUrl, language = 'en') {
  return Object.keys(pageMetadataRegistry).map((pathname) => ({
    pathname,
    metadata: getPageMetadata(pathname, siteUrl, language),
  }))
}

export function getCarPageMetadata(car, siteUrl, language = 'en') {
  const dictionary = getDictionary(language)
  const localizedCarDescription =
    (car.translationKey && dictionary.cars?.[car.translationKey]?.description) ||
    car.description
  const carName = `${car.brand} ${car.model}`
  const canonicalUrl = buildAbsoluteUrl(`/car/${car.id}`, siteUrl)
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
    },
  }
}
