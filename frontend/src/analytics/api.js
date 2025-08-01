// API functions remain the same
import { getAuthHeaders } from "../users/api"

const API_BASE_URL = "http://127.0.0.1:8000"

export const getDailyBreakdown = async (accessToken) => {
  const response = await fetch(`${API_BASE_URL}/analytics/daily/`, {
    headers: getAuthHeaders(accessToken),
  })
  if (!response.ok) throw new Error("Failed to fetch daily breakdown")
  return response.json()
}

export const getSubjectWiseWeeklyStats = async (accessToken) => {
  const response = await fetch(`${API_BASE_URL}/analytics/subjects/`, {
    headers: getAuthHeaders(accessToken),
  })
  if (!response.ok) throw new Error("Failed to fetch subject-wise weekly stats")
  return response.json()
}

export const getMonthlyReport = async (accessToken) => {
  const response = await fetch(`${API_BASE_URL}/analytics/monthly/`, {
    headers: getAuthHeaders(accessToken),
  })
  if (!response.ok) throw new Error("Failed to fetch monthly report")
  return response.json()
}

export const getMilestoneTracker = async (accessToken) => {
  const response = await fetch(`${API_BASE_URL}/analytics/milestone/`, {
    headers: getAuthHeaders(accessToken),
  })
  if (!response.ok) throw new Error("Failed to fetch milestone tracker")
  return response.json()
}

export const exportStudyData = async (accessToken) => {
  const response = await fetch(`${API_BASE_URL}/analytics/export/`, {
    headers: getAuthHeaders(accessToken),
  })
  if (!response.ok) throw new Error("Failed to export study data")
  return response.blob() // Return as blob for file download
}
