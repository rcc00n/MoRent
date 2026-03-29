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
  canonicalUrl,
  description,
  ogType = 'website',
  robots = 'index,follow',
  structuredData = null,
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
    upsertMetaTag('name', 'twitter:card', 'summary_large_image')
    upsertMetaTag('name', 'twitter:title', title)
    upsertMetaTag('name', 'twitter:description', description)
    upsertLinkTag('canonical', canonicalUrl)
    updateStructuredData(structuredData)
  }, [
    canonicalUrl,
    description,
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
