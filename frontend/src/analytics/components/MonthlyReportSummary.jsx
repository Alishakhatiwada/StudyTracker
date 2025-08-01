"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext, useToast } from "../../App"
import { getMonthlyReport } from "../api"

export default function MonthlyReportSummary() {
  const { accessToken } = useContext(AuthContext)
  const [monthlyData, setMonthlyData] = useState(null)
  const showToast = useToast()

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const data = await getMonthlyReport(accessToken)
        // Convert object to array of { day, hours } and sort by day
        const formattedData = Object.keys(data)
          .map((day) => ({
            day: Number.parseInt(day),
            hours: data[day],
          }))
          .sort((a, b) => a.day - b.day)
        setMonthlyData(formattedData)
      } catch (error) {
        showToast("Error", `Failed to load monthly report: ${error.message}`, "error")
      }
    }

    if (accessToken) {
      fetchMonthlyData()
    }
  }, [accessToken])

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">Monthly Study Report</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">Daily study hours for the current month.</p>
      {monthlyData ? (
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2 text-sm">
          {monthlyData.map((item) => (
            <div key={item.day} className="p-2 border border-gray-200 dark:border-gray-700 rounded-md text-center">
              <p className="font-medium">Day {item.day}</p>
              <p className="text-md font-bold text-blue-600 dark:text-blue-400">{item.hours.toFixed(2)}h</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading monthly data...</p>
      )}
    </div>
  )
}
