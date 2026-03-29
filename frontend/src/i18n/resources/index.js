import en from './en.js'
import ru from './ru.js'

export const DEFAULT_LANGUAGE = 'en'
export const LANGUAGE_STORAGE_KEY = 'morent-language'
export const SUPPORTED_LANGUAGES = ['en', 'ru']

export const resources = {
  en: {
    translation: en,
  },
  ru: {
    translation: ru,
  },
}

export function normalizeLanguage(language) {
  if (!language) {
    return DEFAULT_LANGUAGE
  }

  return String(language).toLowerCase().startsWith('ru') ? 'ru' : 'en'
}

export function getDictionary(language = DEFAULT_LANGUAGE) {
  return resources[normalizeLanguage(language)]?.translation || en
}
