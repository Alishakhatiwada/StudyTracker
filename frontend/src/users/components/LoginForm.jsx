"use client"

import { Link } from "react-router-dom";
import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext, useToast } from "../../App"

export default function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { handleLogin } = useContext(AuthContext)
  const navigate = useNavigate()
  const showToast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const success = await handleLogin(username, password)
      if (success) {
        showToast("Login Successful", "Welcome back!", "success")
        navigate("/dashboard")
      } else {
        showToast("Login Failed", "Invalid username or password. Please try again.", "error")
      }
    } catch (error) {
      showToast("Login Error", "An error occurred during login. Please try again.", "error")
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="card w-full max-w-md">
        <div className="space-y-1 mb-6">
          <h2 className="text-2xl font-bold text-center">Login</h2>
          <p className="text-center text-gray-500 dark:text-gray-400">
            Enter your credentials to access your study tracker.
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
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium underline text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}