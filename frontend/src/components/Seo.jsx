import { useEffect } from 'react'

import { SITE_NAME } from '../seo/site'

function upsertMetaTag(attribute, key, content) {
  const selector = `meta[${attribute}="${key}"]`
  const existingTag = document.head.querySelector(selector)
  const metaTag = existingTag || document.createElement('meta')

  metaTag.setAttribute(attribute, key)
  metaTag.setAttribute('content', content)

  if (!existingTag) {
    document.head.appendChild(metaTag)
  }
}

function upsertLinkTag(rel, href) {
  const selector = `link[rel="${rel}"]`
  const existingTag = document.head.querySelector(selector)
  const linkTag = existingTag || document.createElement('link')

  linkTag.setAttribute('rel', rel)
  linkTag.setAttribute('href', href)

  if (!existingTag) {
    document.head.appendChild(linkTag)
  }
}

function updateAlternateLinks(alternates) {
  document.head
    .querySelectorAll('link[data-seo-alternate="true"]')
    .forEach((linkTag) => linkTag.remove())

  alternates.forEach((alternate) => {
    const linkTag = document.createElement('link')
    linkTag.rel = 'alternate'
    linkTag.href = alternate.href
    linkTag.hreflang = alternate.hrefLang
    linkTag.dataset.seoAlternate = 'true'
    document.head.appendChild(linkTag)
  })
}

function updateRepeatableMetaTags(attribute, key, values, dataAttribute) {
  document.head
    .querySelectorAll(`meta[data-${dataAttribute}="true"]`)
    .forEach((metaTag) => metaTag.remove())

  values.forEach((value) => {
    const metaTag = document.createElement('meta')
    metaTag.setAttribute(attribute, key)
    metaTag.setAttribute('content', value)
    metaTag.setAttribute(`data-${dataAttribute}`, 'true')
    document.head.appendChild(metaTag)
  })
}

function updateStructuredData(structuredData) {
  document.head
    .querySelectorAll('script[data-seo-json-ld="true"]')
    .forEach((scriptTag) => scriptTag.remove())

  const entries = Array.isArray(structuredData)
    ? structuredData
    : structuredData
      ? [structuredData]
      : []

  entries.forEach((entry) => {
    const scriptTag = document.createElement('script')
    scriptTag.type = 'application/ld+json'
    scriptTag.dataset.seoJsonLd = 'true'
    scriptTag.textContent = JSON.stringify(entry)
    document.head.appendChild(scriptTag)
  })
}

function Seo({
  alternates = [],
  canonicalUrl,
  description,
  ogType = 'website',
  ogLocale = 'en_US',
  ogLocaleAlternates = [],
  robots = 'index,follow',
  structuredData,
  title,
  url,
}) {
  const structuredDataKey = JSON.stringify(structuredData)

  useEffect(() => {
    document.title = title

    upsertMetaTag('name', 'description', description)
    upsertMetaTag('name', 'robots', robots)
    upsertMetaTag('property', 'og:title', title)
    upsertMetaTag('property', 'og:description', description)
    upsertMetaTag('property', 'og:type', ogType)
    upsertMetaTag('property', 'og:url', url)
    upsertMetaTag('property', 'og:site_name', SITE_NAME)
    upsertMetaTag('property', 'og:locale', ogLocale)
    upsertMetaTag('name', 'twitter:card', 'summary_large_image')
    upsertMetaTag('name', 'twitter:title', title)
    upsertMetaTag('name', 'twitter:description', description)
    upsertLinkTag('canonical', canonicalUrl)
    updateAlternateLinks(alternates)
    updateRepeatableMetaTags(
      'property',
      'og:locale:alternate',
      ogLocaleAlternates,
      'seo-og-locale-alternate',
    )
    if (structuredData !== undefined) {
      updateStructuredData(structuredData)
    }
  }, [
    alternates,
    canonicalUrl,
    description,
    ogLocale,
    ogLocaleAlternates,
    ogType,
    robots,
    structuredData,
    structuredDataKey,
    title,
    url,
  ])

  return null
}

export default Seo
