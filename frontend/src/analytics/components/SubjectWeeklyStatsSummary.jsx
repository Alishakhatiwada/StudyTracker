"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext, useToast } from "../../App"
import { getSubjectWiseWeeklyStats } from "../api"

export default function SubjectWeeklyStatsSummary() {
  const { accessToken } = useContext(AuthContext)
  const [subjectStats, setSubjectStats] = useState(null)
  const showToast = useToast()

  useEffect(() => {
    const fetchSubjectStats = async () => {
      try {
        const data = await getSubjectWiseWeeklyStats(accessToken)
        setSubjectStats(data)
      } catch (error) {
        showToast("Error", `Failed to load subject stats: ${error.message}`, "error")
      }
    }

    if (accessToken) {
      fetchSubjectStats()
    }
  }, [accessToken])

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">Subject-wise Weekly Stats</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">Distribution of study hours per subject this week.</p>
      {subjectStats ? (
        Object.keys(subjectStats).length === 0 ? (
          <p className="text-center text-gray-500">No study sessions logged this week for any subject.</p>
        ) : (
          <ul className="space-y-2">
            {Object.entries(subjectStats).map(([subject, hours]) => (
              <li
                key={subject}
                className="flex justify-between items-center p-2 border border-gray-200 dark:border-gray-700 rounded-md"
              >
                <span className="font-medium">{subject}</span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{hours.toFixed(2)}h</span>
              </li>
            ))}
          </ul>
        )
      ) : (
        <p className="text-center text-gray-500">Loading subject stats...</p>
      )}
    </div>
  )
}
