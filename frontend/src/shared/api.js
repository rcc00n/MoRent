import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
})

export function getCars() {
  return apiClient.get('/cars/')
}

export function getCar(id) {
  return apiClient.get(`/cars/${id}/`)
}

export function createBooking(payload) {
  return apiClient.post('/bookings/', payload)
}

export function createContactRequest(payload) {
  return apiClient.post('/contact-requests/', payload)
}

export function getSiteContactConfig() {
  return apiClient.get('/site-config/contact/')
}
