"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext, useToast } from "../../App"
import { getMilestoneTracker } from "../api"
import { CheckCircleIcon, TrophyIcon } from "lucide-react"

export default function MilestoneTracker() {
  const { accessToken } = useContext(AuthContext)
  const [milestoneData, setMilestoneData] = useState(null)
  const showToast = useToast()

  const fetchMilestones = async () => {
    try {
      const data = await getMilestoneTracker(accessToken)
      setMilestoneData(data)
    } catch (error) {
      showToast("Error", `Failed to load milestones: ${error.message}`, "error")
    }
  }

  useEffect(() => {
    if (accessToken) {
      fetchMilestones()
    }
  }, [accessToken])

  if (!milestoneData) {
    return (
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Milestone Tracker</h3>
        <p>Loading milestones...</p>
      </div>
    )
  }

  const { total_study_hours, milestones, next_milestone } = milestoneData
  const progressPercentage = next_milestone ? (total_study_hours / next_milestone.target_hours) * 100 : 100

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <TrophyIcon className="h-5 w-5" />
        Study Milestones
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Track your progress towards significant study hour milestones.
      </p>

      <div className="text-lg font-medium mb-4">
        Total Study Hours:{" "}
        <span className="font-bold text-blue-600 dark:text-blue-400">{total_study_hours.toFixed(2)}</span>
      </div>

      {next_milestone ? (
        <div className="grid gap-2 mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Next Milestone: <span className="font-semibold">{next_milestone.title}</span> at{" "}
            <span className="font-semibold">{next_milestone.target_hours.toFixed(0)}</span> hours
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${Math.min(100, progressPercentage)}%` }}
            ></div>
          </div>
          <p className="text-right text-sm text-gray-600 dark:text-gray-400">
            {next_milestone.hours_to_go.toFixed(2)} hours to go!
          </p>
        </div>
      ) : (
        <p className="text-green-600 font-medium mb-4">Congratulations! You've achieved all defined milestones.</p>
      )}

      <h4 className="text-md font-semibold mt-2 mb-2">Achieved Milestones:</h4>
      {milestones.length === 0 ? (
        <p className="text-gray-500">No milestones achieved yet.</p>
      ) : (
        <ul className="space-y-2">
          {milestones
            .filter((m) => m.achieved)
            .map((milestone) => (
              <li key={milestone.id} className="flex items-center gap-2 text-green-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span className="font-medium">{milestone.title}</span> (Achieved on{" "}
                {new Date(milestone.achieved_at).toLocaleDateString()})
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}
