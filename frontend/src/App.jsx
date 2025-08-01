"use client"

import { useState, useEffect, createContext, useContext, useCallback } from "react"
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom"
import { MenuIcon } from "lucide-react" // Still using Lucide React for icons

// Import API functions
import { loginUser, registerUser, refreshToken } from "./users/api"

// Import components for each app
import LoginForm from "./users/components/LoginForm"
import RegisterForm from "./users/components/RegisterForm"
import SubjectList from "./tracker/components/SubjectList"
import StudySessionForm from "./tracker/components/StudySessionForm"
import GoalSetting from "./tracker/components/GoalSetting"
import DailyBreakdownSummary from "./analytics/components/DailyBreakdownSummary" // Renamed
import SubjectWeeklyStatsSummary from "./analytics/components/SubjectWeeklyStatsSummary" // Renamed
import MonthlyReportSummary from "./analytics/components/MonthlyReportSummary" // Renamed
import MilestoneTracker from "./analytics/components/MilestoneTracker"
import ExportDataButton from "./analytics/components/ExportDataButton"
import QuoteDisplay from "./motivate/components/QuoteDisplay"
import ReminderMessages from "./motivate/components/ReminderMessages"
import AdminQuoteManager from "./motivate/components/AdminQuoteManager"
import UserProfileDisplay from "./users/components/UserProfileDisplay" // NEW: Import UserProfileDisplay

// Create Auth Context
export const AuthContext = createContext(null)

// Custom Toast Context and Provider
const ToastContext = createContext(null)

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((title, description, variant = "success") => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, title, description, variant }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 5000) // Auto-dismiss after 5 seconds
  }, [])

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-item ${toast.variant === "success" ? "toast-success" : "toast-error"}`}>
            <div className="font-bold">{toast.title}</div>
            <div>{toast.description}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// Custom hook to use toast
export const useToast = () => {
  return useContext(ToastContext)
}

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext)
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }
  return isAuthenticated ? children : <Navigate to="/login" />
}

export default function App() {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token"))
  const [refreshTokenValue, setRefreshTokenValue] = useState(localStorage.getItem("refresh_token"))
  const [isAuthenticated, setIsAuthenticated] = useState(!!accessToken)
  const [isLoading, setIsLoading] = useState(true)
  const showToast = useToast() // Using our custom useToast

  const updateTokens = (access, refresh) => {
    setAccessToken(access)
    setRefreshTokenValue(refresh)
    if (access) {
      localStorage.setItem("access_token", access)
      setIsAuthenticated(true)
    } else {
      localStorage.removeItem("access_token")
      setIsAuthenticated(false)
    }
    if (refresh) {
      localStorage.setItem("refresh_token", refresh)
    } else {
      localStorage.removeItem("refresh_token")
    }
  }

  const handleLogin = async (username, password) => {
    try {
      const data = await loginUser(username, password)
      updateTokens(data.access, data.refresh)
      return { success: true, message: "Welcome back!" };
    } catch (error) {
      return { success: false, message: error.message || "An error occurred during login." };
    }
  }

  const handleRegister = async (username, email, password) => {
    try {
      const data = await registerUser(username, email, password)
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message || "An error occurred during registration." };
    }
  }  
  

  const handleLogout = () => {
    updateTokens(null, null)
    showToast("Logged Out", "You have been successfully logged out.", "success")
  }

  // Token refresh logic
  useEffect(() => {
    const checkAuth = async () => {
      if (accessToken) {
        setIsAuthenticated(true)
      } else if (refreshTokenValue) {
        try {
          const data = await refreshToken(refreshTokenValue)
          updateTokens(data.access, refreshTokenValue) // Keep the same refresh token
          setIsAuthenticated(true)
        } catch (error) {
          console.error("Failed to refresh token:", error)
          updateTokens(null, null) // Clear tokens if refresh fails
        }
      }
      setIsLoading(false)
    }

    checkAuth()

    // Set up an interval to refresh token periodically (e.g., every 4 minutes if access token is 5 min)
    const refreshInterval = setInterval(
      async () => {
        if (refreshTokenValue && isAuthenticated) {
          try {
            const data = await refreshToken(refreshTokenValue)
            updateTokens(data.access, refreshTokenValue)
          } catch (error) {
            console.error("Auto-refresh failed:", error)
            updateTokens(null, null)
          }
        }
      },
      4 * 60 * 1000,
    ) // Every 4 minutes

    return () => clearInterval(refreshInterval)
  }, [accessToken, refreshTokenValue, isAuthenticated, showToast])

  const authContextValue = {
    accessToken,
    isAuthenticated,
    isLoading,
    updateTokens,
    handleLogin,
    handleRegister,
    handleLogout,
  }

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <ToastProvider>
      {" "}
      {/* Wrap the entire app with ToastProvider */}
      <AuthContext.Provider value={authContextValue}>
        <Router>
          <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
            {isAuthenticated && (
              <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-gray-800">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                  <Link to="/" className="flex items-center gap-2 font-semibold">
                    <BookIcon className="h-6 w-6" />
                    <span>Study Tracker</span>
                  </Link>
                  <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link to="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400">
                      Dashboard
                    </Link>
                    <Link to="/analytics" className="hover:text-blue-600 dark:hover:text-blue-400">
                      Analytics
                    </Link>
                    <Link to="/motivate" className="hover:text-blue-600 dark:hover:text-blue-400">
                      Motivate
                    </Link>
                    <UserProfileDisplay /> {/* NEW: User Profile Display */}
                    <button onClick={handleLogout} className="btn-ghost">
                      Logout
                    </button>
                  </nav>
                  <div className="md:hidden flex items-center gap-2">
                    {" "}
                    {/* Adjusted for mobile */}
                    <UserProfileDisplay /> {/* NEW: User Profile Display for mobile */}
                    <button
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <MenuIcon className="h-6 w-6" />
                      <span className="sr-only">Toggle navigation menu</span>
                    </button>
                  </div>
                </div>
                {isMobileMenuOpen && (
                  <div className="md:hidden bg-white dark:bg-gray-800 border-t">
                    <nav className="grid gap-4 p-4 text-lg font-medium">
                      <Link
                        to="/dashboard"
                        className="hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/analytics"
                        className="hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Analytics
                      </Link>
                      <Link
                        to="/motivate"
                        className="hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Motivate
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout()
                          setIsMobileMenuOpen(false)
                        }}
                        className="btn-ghost justify-start"
                      >
                        Logout
                      </button>
                    </nav>
                  </div>
                )}
              </header>
            )}

            <main className="flex-1 p-4 md:p-6">
              <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <DashboardPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <PrivateRoute>
                      <AnalyticsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/motivate"
                  element={
                    <PrivateRoute>
                      <MotivatePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/quotes"
                  element={
                    <PrivateRoute>
                      <AdminQuoteManager />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthContext.Provider>
    </ToastProvider>
  )
}

// Placeholder Pages for Routing
function DashboardPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <SubjectList />
      <StudySessionForm />
      <GoalSetting />
    </div>
  )
}

function AnalyticsPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold mb-4">Study Analytics</h1>
      <DailyBreakdownSummary />
      <SubjectWeeklyStatsSummary />
      <MonthlyReportSummary />
      <MilestoneTracker />
      <ExportDataButton />
    </div>
  )
}

function MotivatePage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold mb-4">Motivation & Reminders</h1>
      <QuoteDisplay />
      <ReminderMessages />
    </div>
  )
}

function BookIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  )
}
