import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
})

function withLanguage(language, params = {}) {
  if (!language) {
    return params
  }

  return {
    ...params,
    lang: language,
  }
}

export function getCars(params = {}) {
  return apiClient.get('/cars/', { params })
}

export function getCar(id, language) {
  return apiClient.get(`/cars/${id}/`, {
    params: withLanguage(language),
  })
}

export function createBooking(payload) {
  return apiClient.post('/bookings/', payload)
}

export function createContactRequest(payload) {
  return apiClient.post('/contact-requests/', payload)
}

export function getSiteContactConfig(language) {
  return apiClient.get('/site-config/contact/', {
    params: withLanguage(language),
  })
}

export function getSiteSettings(language) {
  return apiClient.get('/site-config/settings/', {
    params: withLanguage(language),
  })
}

export function getPageContent(pageKey, language) {
  return apiClient.get(`/site-config/pages/${pageKey}/`, {
    params: withLanguage(language),
  })
}

export function getFaqItems(language) {
  return apiClient.get('/site-config/faqs/', {
    params: withLanguage(language),
  })
}

export function getLegalPage(pageKey, language) {
  return apiClient.get(`/site-config/legal/${pageKey}/`, {
    params: withLanguage(language),
  })
}
