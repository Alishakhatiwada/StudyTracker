// API functions remain the same
import { getAuthHeaders } from "../users/api"

const API_BASE_URL = "http://127.0.0.1:8000"

// Subjects API
export const getSubjects = async (accessToken) => {
  const response = await fetch(`${API_BASE_URL}/tracker/subjects/`, {
    headers: getAuthHeaders(accessToken),
  })
  if (!response.ok) throw new Error("Failed to fetch subjects")
  return response.json()
}

export const createSubject = async (accessToken, subjectData) => {
  const response = await fetch(`${API_BASE_URL}/tracker/subjects/`, {
    method: "POST",
    headers: getAuthHeaders(accessToken),
    body: JSON.stringify(subjectData),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.name || "Failed to create subject")
  }
  return response.json()
}

export const deleteSubject = async (accessToken, subjectId) => {
  const response = await fetch(`${API_BASE_URL}/tracker/subjects/${subjectId}/`, {
    method: "DELETE",
    headers: getAuthHeaders(accessToken),
  })
  if (!response.ok) throw new Error("Failed to delete subject")
  return null // 204 No Content
}

// Study Sessions API
export const getStudySessions = async (accessToken) => {
  const response = await fetch(`${API_BASE_URL}/tracker/sessions/`, {
    headers: getAuthHeaders(accessToken),
  })
  if (!response.ok) throw new Error("Failed to fetch study sessions")
  return response.json()
}

export const createStudySession = async (accessToken, sessionData) => {
  const response = await fetch(`${API_BASE_URL}/tracker/sessions/`, {
    method: "POST",
    headers: getAuthHeaders(accessToken),
    body: JSON.stringify(sessionData),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.detail || "Failed to create study session")
  }
  return response.json()
}

// Study Goals API
export const getStudyGoals = async (accessToken) => {
  const response = await fetch(`${API_BASE_URL}/tracker/goals/`, {
    headers: getAuthHeaders(accessToken),
  })
  if (!response.ok) throw new Error("Failed to fetch study goals")
  return response.json()
}

export const createStudyGoal = async (accessToken, goalData) => {
  const response = await fetch(`${API_BASE_URL}/tracker/goals/`, {
    method: "POST",
    headers: getAuthHeaders(accessToken),
    body: JSON.stringify(goalData),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.detail || "Failed to create study goal")
  }
  return response.json()
}

export const updateStudyGoal = async (accessToken, goalId, goalData) => {
  const response = await fetch(`${API_BASE_URL}/tracker/goals/${goalId}/`, {
    method: "PUT",
    headers: getAuthHeaders(accessToken),
    body: JSON.stringify(goalData),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.detail || "Failed to update study goal")
  }
  return response.json()
}

export const getProgressSummary = async (accessToken) => {
  const response = await fetch(`${API_BASE_URL}/tracker/goals/progress-summary/`, {
    headers: getAuthHeaders(accessToken),
  })
  if (!response.ok) throw new Error("Failed to fetch progress summary")
  return response.json()
}
