// API functions remain the same as they don't depend on UI components
const API_BASE_URL = "http://127.0.0.1:8000" // Your Django backend URL

export const loginUser = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/users/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.detail || "Login failed")
  }
  return response.json()
}

export const registerUser = async (username, email, password) => {
  const response = await fetch(`${API_BASE_URL}/users/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    const errorMessage = Object.values(errorData).flat().join(" ")
    throw new Error(errorMessage || "Registration failed")
  }
  return response.json()
}

export const refreshToken = async (refresh) => {
  const response = await fetch(`${API_BASE_URL}/users/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.detail || "Failed to refresh token")
  }
  return response.json()
}

// Helper to get authenticated headers
export const getAuthHeaders = (accessToken) => {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  }
}

// NEW: Fetch current user details
export const getCurrentUser = async (accessToken) => {
  const response = await fetch(`${API_BASE_URL}/users/profile/`, {
    headers: getAuthHeaders(accessToken),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.detail || "Failed to fetch user data")
  }
  return response.json()
}
