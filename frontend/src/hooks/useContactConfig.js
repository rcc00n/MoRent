import { useEffect, useState } from 'react'

import { getSiteContactConfig } from '../shared/api'

const emptyContactConfig = {
  channels: {
    phone: { value: '', href: '' },
    email: { value: '', href: '' },
    whatsapp: { value: '', href: '' },
    telegram: { value: '', href: '' },
  },
  service_hours: '',
}

let cachedContactConfig = null
let contactConfigRequest = null

function normalizeContactConfig(data = {}) {
  return {
    channels: {
      phone: data.channels?.phone || emptyContactConfig.channels.phone,
      email: data.channels?.email || emptyContactConfig.channels.email,
      whatsapp: data.channels?.whatsapp || emptyContactConfig.channels.whatsapp,
      telegram: data.channels?.telegram || emptyContactConfig.channels.telegram,
    },
    service_hours: data.service_hours || emptyContactConfig.service_hours,
  }
}

async function loadContactConfig() {
  if (cachedContactConfig) {
    return cachedContactConfig
  }

  if (!contactConfigRequest) {
    contactConfigRequest = getSiteContactConfig()
      .then(({ data }) => {
        cachedContactConfig = normalizeContactConfig(data)
        return cachedContactConfig
      })
      .finally(() => {
        contactConfigRequest = null
      })
  }

  return contactConfigRequest
}

export function getConfiguredContactChannels(contactConfig) {
  return Object.entries(contactConfig?.channels || {})
    .map(([key, channel]) => ({
      key,
      value: channel?.value || '',
      href: channel?.href || '',
    }))
    .filter((channel) => channel.value && channel.href)
}

export function useContactConfig() {
  const [contactConfig, setContactConfig] = useState(
    () => cachedContactConfig || emptyContactConfig,
  )
  const [hasLoadError, setHasLoadError] = useState(false)

  useEffect(() => {
    let isActive = true

    if (cachedContactConfig) {
      return () => {
        isActive = false
      }
    }

    loadContactConfig()
      .then((data) => {
        if (!isActive) {
          return
        }

        setContactConfig(data)
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
  }, [])

  return {
    contactConfig,
    directChannels: getConfiguredContactChannels(contactConfig),
    hasLoadError,
  }
}
