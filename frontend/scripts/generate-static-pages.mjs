import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { DEFAULT_LANGUAGE } from '../src/i18n/resources/index.js'
import {
  getDefaultSiteMetadata,
  getStaticPageEntries,
} from '../src/seo/pageMetadata.js'
import {
  buildAbsoluteUrl,
  DEFAULT_SITE_URL,
  normalizeSiteUrl,
  SITE_NAME,
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

function serializeAlternateLinks(alternates = []) {
  return alternates
    .map(
      (alternate) =>
        `<link rel="alternate" hreflang="${escapeHtml(alternate.hrefLang)}" href="${escapeHtml(alternate.href)}" data-seo-alternate="true" />`,
    )
    .join('\n    ')
}

function serializeOgLocaleAlternates(ogLocaleAlternates = []) {
  return ogLocaleAlternates
    .map(
      (locale) =>
        `<meta property="og:locale:alternate" content="${escapeHtml(locale)}" data-seo-og-locale-alternate="true" />`,
    )
    .join('\n    ')
}

function buildSeoBootstrapScript(seoRegistry) {
  const serializedRegistry = JSON.stringify(seoRegistry)

  return `<script data-seo-bootstrap="true">
window.__MORENT_STATIC_SEO__ = ${serializedRegistry};
(function () {
  var registry = window.__MORENT_STATIC_SEO__ || {};

  function normalizePathname(pathname) {
    if (!pathname || pathname === '/') {
      return '/';
    }

    return pathname.replace(/\\/+$/, '') || '/';
  }

  function normalizeLanguage(language) {
    return String(language || '').toLowerCase().indexOf('ru') === 0 ? 'ru' : 'en';
  }

  function buildCurrentLocalizedUrl(pathname, language) {
    var url = new URL(pathname, window.location.origin);

    if (language === 'ru') {
      url.searchParams.set('lang', 'ru');
    } else {
      url.searchParams.delete('lang');
    }

    return url.toString();
  }

  function upsertMeta(attribute, key, content) {
    var selector = 'meta[' + attribute + '="' + key + '"]';
    var metaTag = document.head.querySelector(selector) || document.createElement('meta');
    metaTag.setAttribute(attribute, key);
    metaTag.setAttribute('content', content);

    if (!metaTag.parentNode) {
      document.head.appendChild(metaTag);
    }
  }

  function upsertCanonical(href) {
    var linkTag = document.head.querySelector('link[rel="canonical"]') || document.createElement('link');
    linkTag.setAttribute('rel', 'canonical');
    linkTag.setAttribute('href', href);

    if (!linkTag.parentNode) {
      document.head.appendChild(linkTag);
    }
  }

  function updateAlternates(alternates) {
    document.head
      .querySelectorAll('link[data-seo-alternate="true"]')
      .forEach(function (linkTag) {
        linkTag.remove();
      });

    alternates.forEach(function (alternate) {
      var linkTag = document.createElement('link');
      linkTag.setAttribute('rel', 'alternate');
      linkTag.setAttribute('hreflang', alternate.hrefLang);
      linkTag.setAttribute('href', alternate.href);
      linkTag.setAttribute('data-seo-alternate', 'true');
      document.head.appendChild(linkTag);
    });
  }

  function updateOgLocaleAlternates(locales) {
    document.head
      .querySelectorAll('meta[data-seo-og-locale-alternate="true"]')
      .forEach(function (metaTag) {
        metaTag.remove();
      });

    locales.forEach(function (locale) {
      var metaTag = document.createElement('meta');
      metaTag.setAttribute('property', 'og:locale:alternate');
      metaTag.setAttribute('content', locale);
      metaTag.setAttribute('data-seo-og-locale-alternate', 'true');
      document.head.appendChild(metaTag);
    });
  }

  function updateStructuredData(structuredData) {
    document.head
      .querySelectorAll('script[data-seo-json-ld="true"]')
      .forEach(function (scriptTag) {
        scriptTag.remove();
      });

    var entries = Array.isArray(structuredData)
      ? structuredData
      : structuredData
        ? [structuredData]
        : [];

    entries.forEach(function (entry) {
      var scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      scriptTag.setAttribute('data-seo-json-ld', 'true');
      scriptTag.textContent = JSON.stringify(entry);
      document.head.appendChild(scriptTag);
    });
  }

  var pathname = normalizePathname(window.location.pathname);
  var params = new URLSearchParams(window.location.search);
  var language = params.get('lang');

  if (!language) {
    try {
      language = window.localStorage.getItem('morent-language') || window.navigator.language;
    } catch (error) {
      language = 'en';
    }
  }

  language = normalizeLanguage(language);

  var pageRegistry = registry[pathname];
  var seo = pageRegistry && pageRegistry[language] ? pageRegistry[language] : null;

  if (!seo && registry.__default__) {
    var fallback = registry.__default__[language];

    if (fallback) {
      seo = Object.assign({}, fallback, {
        canonicalUrl: buildCurrentLocalizedUrl(pathname, language),
        url: buildCurrentLocalizedUrl(pathname, language),
        alternates: [
          { hrefLang: 'en', href: buildCurrentLocalizedUrl(pathname, 'en') },
          { hrefLang: 'ru', href: buildCurrentLocalizedUrl(pathname, 'ru') },
          { hrefLang: 'x-default', href: buildCurrentLocalizedUrl(pathname, 'en') }
        ]
      });
    }
  }

  if (!seo) {
    return;
  }

  document.documentElement.lang = seo.language || language;
  document.title = seo.title;
  upsertMeta('name', 'description', seo.description);
  upsertMeta('name', 'robots', seo.robots);
  upsertMeta('property', 'og:title', seo.title);
  upsertMeta('property', 'og:description', seo.description);
  upsertMeta('property', 'og:type', seo.ogType);
  upsertMeta('property', 'og:url', seo.url);
  upsertMeta('property', 'og:site_name', '${SITE_NAME}');
  upsertMeta('property', 'og:locale', seo.ogLocale || 'en_US');
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', seo.title);
  upsertMeta('name', 'twitter:description', seo.description);
  upsertCanonical(seo.canonicalUrl);
  updateAlternates(seo.alternates || []);
  updateOgLocaleAlternates(seo.ogLocaleAlternates || []);
  updateStructuredData(seo.structuredData || null);
})();
</script>`
}

function buildSeoBlock(metadata, seoRegistry) {
  const seoTags = [
    `<meta name="description" content="${escapeHtml(metadata.description)}" />`,
    `<meta name="robots" content="${escapeHtml(metadata.robots)}" />`,
    `<meta property="og:title" content="${escapeHtml(metadata.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(metadata.description)}" />`,
    `<meta property="og:type" content="${escapeHtml(metadata.ogType)}" />`,
    `<meta property="og:url" content="${escapeHtml(metadata.url)}" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
    `<meta property="og:locale" content="${escapeHtml(metadata.ogLocale)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeHtml(metadata.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(metadata.description)}" />`,
    `<link rel="canonical" href="${escapeHtml(metadata.canonicalUrl)}" />`,
    serializeAlternateLinks(metadata.alternates),
    serializeOgLocaleAlternates(metadata.ogLocaleAlternates),
  ]

  const structuredData = serializeStructuredData(metadata.structuredData)

  return [
    '<!-- SEO_HEAD_START -->',
    ...seoTags,
    structuredData,
    buildSeoBootstrapScript(seoRegistry),
    '<!-- SEO_HEAD_END -->',
  ]
    .filter(Boolean)
    .join('\n    ')
}

function injectMetadata(baseHtml, metadata, seoRegistry) {
  const cleanedHtml = baseHtml.replace(
    /\s*<!-- SEO_HEAD_START -->[\s\S]*?<!-- SEO_HEAD_END -->/gi,
    '',
  )

  return cleanedHtml
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(metadata.title)}</title>`)
    .replace(/<meta\s+name="description"[\s\S]*?\/>\s*/i, '')
    .replace('</head>', `    ${buildSeoBlock(metadata, seoRegistry)}\n  </head>`)
}

async function writeRouteHtml(pathname, metadata, baseHtml, seoRegistry) {
  const routeSeoRegistry =
    pathname === '/'
      ? seoRegistry
      : {
          __default__: seoRegistry.__default__,
          [pathname]: seoRegistry[pathname],
        }
  const html = injectMetadata(baseHtml, metadata, routeSeoRegistry)

  if (pathname === '/') {
    await writeFile(indexHtmlPath, html)
    return
  }

  const routeDirectory = path.join(distDirectory, pathname.slice(1))
  await mkdir(routeDirectory, { recursive: true })
  await writeFile(path.join(routeDirectory, 'index.html'), html)
}

function buildSeoRegistry(pageEntries) {
  return {
    __default__: {
      en: getDefaultSiteMetadata(siteUrl, 'en'),
      ru: getDefaultSiteMetadata(siteUrl, 'ru'),
    },
    ...Object.fromEntries(
      pageEntries.map((entry) => [entry.pathname, entry.metadataByLanguage]),
    ),
  }
}

function buildSitemap(entries) {
  const urlEntries = entries
    .flatMap((entry) =>
      Object.values(entry.metadataByLanguage)
        .filter((metadata) => metadata.shouldIndex)
        .map(
          (metadata) => `  <url>
    <loc>${escapeHtml(metadata.canonicalUrl)}</loc>
${metadata.alternates
  .map(
    (alternate) =>
      `    <xhtml:link rel="alternate" hreflang="${escapeHtml(alternate.hrefLang)}" href="${escapeHtml(alternate.href)}" />`,
  )
  .join('\n')}
    <lastmod>${buildDate}</lastmod>
  </url>`,
        ),
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
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
  const pageEntries = getStaticPageEntries(siteUrl)
  const seoRegistry = buildSeoRegistry(pageEntries)

  await Promise.all(
    pageEntries.map((entry) =>
      writeRouteHtml(
        entry.pathname,
        entry.metadataByLanguage[DEFAULT_LANGUAGE],
        baseHtml,
        seoRegistry,
      ),
    ),
  )

  await writeFile(path.join(distDirectory, 'sitemap.xml'), buildSitemap(pageEntries))
  await writeFile(path.join(distDirectory, 'robots.txt'), buildRobots())
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
