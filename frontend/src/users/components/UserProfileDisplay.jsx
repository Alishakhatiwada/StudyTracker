"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext, useToast } from "../../App"
import { getCurrentUser } from "../api"
import { UserCircleIcon } from "lucide-react" // Using Lucide React for the icon

export default function UserProfileDisplay() {
  const { accessToken, isAuthenticated } = useContext(AuthContext)
  const [user, setUser] = useState(null)
  const showToast = useToast()

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated && accessToken) {
        try {
          const userData = await getCurrentUser(accessToken)
          setUser(userData)
        } catch (error) {
          showToast("Error", `Failed to load user profile: ${error.message}`, "error")
          setUser(null) // Clear user data on error
        }
      } else {
        setUser(null) // Clear user data if not authenticated
      }
    }

    fetchUser()
  }, [accessToken, isAuthenticated, showToast])

  if (!isAuthenticated || !user) {
    return null // Don't render if not authenticated or user data not loaded
  }

  return (
    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
      <UserCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      <div className="flex flex-col">
        <span className="font-semibold">{user.username}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
      </div>
    </div>
  )
}
