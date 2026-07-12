import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

export function getApiErrorMessage(error) {
  const data = error?.response?.data

  if (typeof data?.message === 'string' && data.message.trim()) {
    return data.message
  }

  const fieldErrors = data?.fieldErrors ?? data?.errors
  if (fieldErrors && typeof fieldErrors === 'object') {
    const messages = Object.values(fieldErrors).filter(Boolean)
    if (messages.length > 0) return messages.join(' ')
  }

  if (error?.code === 'ECONNABORTED') {
    return 'The request took too long. Please try again.'
  }

  if (!error?.response) {
    return 'TaskFlow cannot reach the server. Please check your connection and try again.'
  }

  return 'Something went wrong. Please try again.'
}
