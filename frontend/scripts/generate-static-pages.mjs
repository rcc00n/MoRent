import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { getStaticPageEntries } from '../src/seo/pageMetadata.js'
import {
  buildAbsoluteUrl,
  normalizeSiteUrl,
  SITE_NAME,
  DEFAULT_SITE_URL,
} from '../src/seo/site.js'

const currentFilePath = fileURLToPath(import.meta.url)
const currentDirectory = path.dirname(currentFilePath)
const distDirectory = path.resolve(currentDirectory, '../dist')
const indexHtmlPath = path.join(distDirectory, 'index.html')
const buildDate = new Date().toISOString()
const siteUrl = normalizeSiteUrl(process.env.VITE_SITE_URL || DEFAULT_SITE_URL)

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function serializeStructuredData(structuredData) {
  const entries = Array.isArray(structuredData)
    ? structuredData
    : structuredData
      ? [structuredData]
      : []

  return entries
    .map(
      (entry) =>
        `<script type="application/ld+json" data-seo-json-ld="true">${JSON.stringify(entry)}</script>`,
    )
    .join('\n    ')
}

function buildSeoBlock(metadata) {
  const seoTags = [
    `<meta name="description" content="${escapeHtml(metadata.description)}" />`,
    `<meta name="robots" content="${escapeHtml(metadata.robots)}" />`,
    `<meta property="og:title" content="${escapeHtml(metadata.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(metadata.description)}" />`,
    `<meta property="og:type" content="${escapeHtml(metadata.ogType)}" />`,
    `<meta property="og:url" content="${escapeHtml(metadata.url)}" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeHtml(metadata.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(metadata.description)}" />`,
    `<link rel="canonical" href="${escapeHtml(metadata.canonicalUrl)}" />`,
  ]

  const structuredData = serializeStructuredData(metadata.structuredData)

  return [
    '<!-- SEO_HEAD_START -->',
    ...seoTags,
    structuredData,
    '<!-- SEO_HEAD_END -->',
  ]
    .filter(Boolean)
    .join('\n    ')
}

function injectMetadata(baseHtml, metadata) {
  const cleanedHtml = baseHtml.replace(
    /\s*<!-- SEO_HEAD_START -->[\s\S]*?<!-- SEO_HEAD_END -->/gi,
    '',
  )

  return cleanedHtml
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(metadata.title)}</title>`)
    .replace(/<meta\s+name="description"[\s\S]*?\/>\s*/i, '')
    .replace('</head>', `    ${buildSeoBlock(metadata)}\n  </head>`)
}

async function writeRouteHtml(pathname, metadata, baseHtml) {
  const html = injectMetadata(baseHtml, metadata)

  if (pathname === '/') {
    await writeFile(indexHtmlPath, html)
    return
  }

  const routeDirectory = path.join(distDirectory, pathname.slice(1))
  await mkdir(routeDirectory, { recursive: true })
  await writeFile(path.join(routeDirectory, 'index.html'), html)
}

function buildSitemap(entries) {
  const urlEntries = entries
    .filter((entry) => entry.metadata.shouldIndex)
    .map(
      (entry) => `  <url>
    <loc>${escapeHtml(buildAbsoluteUrl(entry.pathname, siteUrl))}</loc>
    <lastmod>${buildDate}</lastmod>
  </url>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`
}

function buildRobots() {
  return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${buildAbsoluteUrl('/sitemap.xml', siteUrl)}
`
}

async function main() {
  const baseHtml = await readFile(indexHtmlPath, 'utf8')
  const pageEntries = getStaticPageEntries(siteUrl, 'en')

  await Promise.all(
    pageEntries.map((entry) =>
      writeRouteHtml(entry.pathname, entry.metadata, baseHtml),
    ),
  )

  await writeFile(path.join(distDirectory, 'sitemap.xml'), buildSitemap(pageEntries))
  await writeFile(path.join(distDirectory, 'robots.txt'), buildRobots())
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
