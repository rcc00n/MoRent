import { startTransition, useEffect, useEffectEvent, useState } from 'react'

import {
  getFaqItems,
  getLegalPage,
  getPageContent,
  getSiteSettings,
} from '../shared/api'

const resourceCache = new Map()
const resourceRequests = new Map()

function getCachedResource(key) {
  return resourceCache.has(key) ? resourceCache.get(key) : null
}

async function loadResource(key, loader) {
  const cachedResource = getCachedResource(key)
  if (cachedResource !== null) {
    return cachedResource
  }

  if (!resourceRequests.has(key)) {
    resourceRequests.set(
      key,
      loader()
        .then(({ data }) => {
          resourceCache.set(key, data)
          return data
        })
        .finally(() => {
          resourceRequests.delete(key)
        }),
    )
  }

  return resourceRequests.get(key)
}

function useCmsResource(resourceKey, loader) {
  const [data, setData] = useState(() => getCachedResource(resourceKey))
  const [hasLoadError, setHasLoadError] = useState(false)
  const loadResourceEvent = useEffectEvent(() => loadResource(resourceKey, loader))
  const cachedResource = getCachedResource(resourceKey)
  const resolvedData = cachedResource ?? data

  useEffect(() => {
    let isActive = true

    if (cachedResource !== null) {
      return () => {
        isActive = false
      }
    }

    loadResourceEvent()
      .then((nextData) => {
        if (!isActive) {
          return
        }

        startTransition(() => {
          setData(nextData)
          setHasLoadError(false)
        })
      })
      .catch(() => {
        if (!isActive) {
          return
        }

        setHasLoadError(true)
      })

    return () => {
      isActive = false
    }
  }, [cachedResource, resourceKey])

  return {
    data: resolvedData,
    hasLoadError,
  }
}

export function useSiteSettings(language) {
  return useCmsResource(`site-settings:${language}`, () => getSiteSettings(language))
}

export function usePageContent(pageKey, language) {
  return useCmsResource(`page-content:${pageKey}:${language}`, () =>
    getPageContent(pageKey, language),
  )
}

export function useFaqItems(language) {
  return useCmsResource(`faq-items:${language}`, () => getFaqItems(language))
}

export function useLegalPage(pageKey, language) {
  return useCmsResource(`legal-page:${pageKey}:${language}`, () =>
    getLegalPage(pageKey, language),
  )
}
