"use client"

import { useState, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import { AuthContext, useToast } from "../../App"

export default function RegisterForm() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { handleRegister } = useContext(AuthContext)
  const navigate = useNavigate()
  const showToast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Basic client-side validation
    if (password.length < 6) {
      showToast("Password Error", "Password must be at least 6 characters long.", "error")
      setIsLoading(false)
      return
    }

    try {
      const result = await handleRegister(username, email, password)
      if (result.success) {
        showToast("Registration Successful", result.message, "success")
        navigate("/login")
      } else {
        showToast("Registration Failed", result.message, "error")
      }
    } catch (error) {
      showToast("Registration Error", "An error occurred during registration. Please try again.", "error")
      console.error("Registration error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="card w-full max-w-md">
        <div className="space-y-1 mb-6">
          <h2 className="text-2xl font-bold text-center">Register</h2>
          <p className="text-center text-gray-500 dark:text-gray-400">
            Create your account to start tracking your studies.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="username" className="label">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="yourusername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              className="input-field"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="input-field"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="input-field"
              minLength={6}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Minimum 6 characters
            </p>
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Account..." : "Register"}
          </button>
        </form>
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium underline text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}