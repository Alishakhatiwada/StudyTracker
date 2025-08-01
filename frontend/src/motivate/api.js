// API functions remain the same
import { getAuthHeaders } from "../users/api"

const API_BASE_URL = "http://127.0.0.1:8000"

export const getRandomQuote = async (accessToken) => {
  const response = await fetch(`${API_BASE_URL}/motivate/quote/random/`, {
    headers: getAuthHeaders(accessToken),
  })
  if (!response.ok) throw new Error("Failed to fetch random quote")
  return response.json()
}

export const getQuoteOfTheDay = async (accessToken) => {
  const response = await fetch(`${API_BASE_URL}/motivate/quote/daily/`, {
    headers: getAuthHeaders(accessToken),
  })
  if (!response.ok) throw new Error("Failed to fetch quote of the day")
  return response.json()
}

export const getReminderMessages = async (accessToken) => {
  const response = await fetch(`${API_BASE_URL}/motivate/reminders/`, {
    headers: getAuthHeaders(accessToken),
  })
  if (!response.ok) throw new Error("Failed to fetch reminder messages")
  return response.json()
}

// Admin Quote Management
export const getAdminQuotes = async (accessToken) => {
  const response = await fetch(`${API_BASE_URL}/motivate/admin/quotes/`, {
    headers: getAuthHeaders(accessToken),
  })
  if (!response.ok) throw new Error("Failed to fetch admin quotes")
  return response.json()
}

export const createAdminQuote = async (accessToken, quoteData) => {
  const response = await fetch(`${API_BASE_URL}/motivate/admin/quotes/`, {
    method: "POST",
    headers: getAuthHeaders(accessToken),
    body: JSON.stringify(quoteData),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.detail || "Failed to create quote")
  }
  return response.json()
}

export const deleteAdminQuote = async (accessToken, quoteId) => {
  const response = await fetch(`${API_BASE_URL}/motivate/admin/quotes/${quoteId}/`, {
    method: "DELETE",
    headers: getAuthHeaders(accessToken),
  })
  if (!response.ok) throw new Error("Failed to delete quote")
  return null
}
