import { faqItems } from '../content/siteContent.js'
import {
  buildAbsoluteUrl,
  normalizePathname,
  SITE_NAME,
} from './site.js'

const pageMetadataRegistry = {
  '/': {
    title: 'MoRent | Premium Coastal Car Rental With Visible Daily Rates',
    description:
      'Discover premium coastal car rental with visible daily rates, a curated fleet, and a fast request flow for resort, hotel, and airport pickup.',
    structuredData: (siteUrl) => [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: buildAbsoluteUrl('/', siteUrl),
        description:
          'Premium coastal car rental with visible daily rates and direct booking requests.',
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
    title: 'Fleet | Premium Coastal Rental Cars With Visible Rates | MoRent',
    description:
      'Browse the MoRent fleet, compare visible daily rates, and request premium cars for coastal, resort, and airport pickup plans.',
  },
  '/how-it-works': {
    title: 'How Booking Works | Fast Premium Car Request Flow | MoRent',
    description:
      'See how MoRent booking requests work, from choosing the car and dates to direct confirmation and coordinated pickup.',
  },
  '/about': {
    title: 'About MoRent | Premium Coastal Car Rental',
    description:
      'Learn how MoRent approaches premium coastal car rental with a curated fleet, visible rates, and direct request handling.',
  },
  '/contacts': {
    title: 'Contacts | Coastal Pickup and Booking Support | MoRent',
    description:
      'Find MoRent service details, booking support information, service hours, and pickup coordination guidance for your request.',
  },
  '/faq': {
    title: 'FAQ | Premium Car Rental Questions Answered | MoRent',
    description:
      'Read concise answers about booking, visible daily rates, confirmation timing, pickup arrangement, and required documents.',
    structuredData: () => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
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
    title: 'Terms and Legal Information | MoRent',
    description:
      'Review MoRent rental terms, booking confirmation notes, pricing guidance, vehicle use rules, and cancellation principles.',
  },
  '/privacy': {
    title: 'Privacy Policy | Booking Request Data Handling | MoRent',
    description:
      'Understand how MoRent handles booking request data, service follow-up, and operational information used for enquiries.',
  },
  '/request-received': {
    title: 'Request Received | MoRent',
    description:
      'Your booking request has been received and is being reviewed by the MoRent team.',
    robots: 'noindex,follow',
    shouldIndex: false,
  },
}

const defaultMetadata = {
  title: 'MoRent | Premium Car Rental',
  description:
    'Explore premium car rental with a curated fleet, visible daily rates, and a direct booking request flow.',
}

export function getPageMetadata(pathname, siteUrl) {
  const normalizedPathname = normalizePathname(pathname)
  const pageMetadata = pageMetadataRegistry[normalizedPathname] || defaultMetadata

  return {
    title: pageMetadata.title,
    description: pageMetadata.description,
    robots: pageMetadata.robots || 'index,follow',
    canonicalUrl: buildAbsoluteUrl(normalizedPathname, siteUrl),
    url: buildAbsoluteUrl(normalizedPathname, siteUrl),
    ogType: pageMetadata.ogType || 'website',
    shouldIndex: pageMetadata.shouldIndex !== false,
    structuredData: pageMetadata.structuredData
      ? pageMetadata.structuredData(siteUrl)
      : null,
  }
}

export function getStaticPageEntries(siteUrl) {
  return Object.keys(pageMetadataRegistry).map((pathname) => ({
    pathname,
    metadata: getPageMetadata(pathname, siteUrl),
  }))
}

export function getCarPageMetadata(car, siteUrl) {
  const carName = `${car.brand} ${car.model}`
  const canonicalUrl = buildAbsoluteUrl(`/car/${car.id}`, siteUrl)

  return {
    title: `${carName} | Premium Rental Car | MoRent`,
    description:
      car.description ||
      `View ${carName}, review the daily rate, and send a direct booking request with MoRent.`,
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
        car.description ||
        `Premium rental car available through the MoRent booking request flow.`,
      url: canonicalUrl,
    },
  }
}
