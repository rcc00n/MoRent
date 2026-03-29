import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  normalizeLanguage,
  resources,
  SUPPORTED_LANGUAGES,
} from './resources/index.js'

function setDocumentLanguage(language) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = language
  }
}

function getLanguageFromUrlSearch(search) {
  const language = new URLSearchParams(search).get('lang')

  if (!language) {
    return null
  }

  return normalizeLanguage(language)
}

function resolveInitialLanguage() {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE
  }

  const queryLanguage = getLanguageFromUrlSearch(window.location.search)

  if (queryLanguage) {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, queryLanguage)
    return queryLanguage
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)

  if (storedLanguage) {
    return normalizeLanguage(storedLanguage)
  }

  const detectedLanguage = normalizeLanguage(window.navigator.language)
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, detectedLanguage)

  return detectedLanguage
}

const initialLanguage = resolveInitialLanguage()

i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGES,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
  initImmediate: false,
})

setDocumentLanguage(initialLanguage)

i18n.on('languageChanged', (language) => {
  setDocumentLanguage(language)
})

export function setAppLanguage(language) {
  const nextLanguage = normalizeLanguage(language)

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage)
  }

  return i18n.changeLanguage(nextLanguage)
}

export default i18n
