"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext, useToast } from "../../App"
import { getDailyBreakdown } from "../api"

export default function DailyBreakdownSummary() {
  const { accessToken } = useContext(AuthContext)
  const [dailyData, setDailyData] = useState(null)
  const showToast = useToast()

  useEffect(() => {
    const fetchDailyData = async () => {
      try {
        const data = await getDailyBreakdown(accessToken)
        setDailyData(data)
      } catch (error) {
        showToast("Error", `Failed to load daily breakdown: ${error.message}`, "error")
      }
    }

    if (accessToken) {
      fetchDailyData()
    }
  }, [accessToken])

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">Daily Study Breakdown (Last 7 Days)</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">Hours studied per day.</p>
      {dailyData ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(dailyData).map(([day, hours]) => (
            <div key={day} className="p-3 border border-gray-200 dark:border-gray-700 rounded-md text-center">
              <p className="font-medium">{day}</p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{hours.toFixed(2)}h</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading daily data...</p>
      )}
    </div>
  )
}
