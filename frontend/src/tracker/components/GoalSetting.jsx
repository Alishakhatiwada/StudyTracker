"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext, useToast } from "../../App"
import { getStudyGoals, createStudyGoal, updateStudyGoal, getProgressSummary } from "../api"
import { TargetIcon } from "lucide-react"

export default function GoalSetting() {
  const { accessToken } = useContext(AuthContext)
  const [goalId, setGoalId] = useState(null)
  const [targetHours, setTargetHours] = useState("")
  const [progressSummary, setProgressSummary] = useState(null)
  const showToast = useToast()

  const fetchGoalAndProgress = async () => {
    try {
      const goals = await getStudyGoals(accessToken)
      if (goals.length > 0) {
        setGoalId(goals[0].id)
        setTargetHours(goals[0].target_hours_per_week.toString())
      } else {
        setGoalId(null)
        setTargetHours("")
      }
      const summary = await getProgressSummary(accessToken)
      setProgressSummary(summary)
    } catch (error) {
      showToast("Error", `Failed to load goal or progress: ${error.message}`, "error")
    }
  }

  useEffect(() => {
    if (accessToken) {
      fetchGoalAndProgress()
    }
  }, [accessToken])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isNaN(Number.parseFloat(targetHours)) || Number.parseFloat(targetHours) <= 0) {
      showToast("Input Error", "Target hours must be a positive number.", "error")
      return
    }

    try {
      const goalData = { target_hours_per_week: Number.parseFloat(targetHours) }
      if (goalId) {
        await updateStudyGoal(accessToken, goalId, goalData)
        showToast("Success", "Study goal updated successfully!", "success")
      } else {
        const newGoal = await createStudyGoal(accessToken, goalData)
        setGoalId(newGoal.id)
        showToast("Success", "Study goal created successfully!", "success")
      }
      fetchGoalAndProgress() // Refresh data
    } catch (error) {
      showToast("Error", `Failed to save goal: ${error.message}`, "error")
    }
  }

  return (
    <div className="card col-span-1">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <TargetIcon className="h-5 w-5" />
        Weekly Study Goal
      </h3>
      <form onSubmit={handleSubmit} className="grid gap-4 mb-4">
        <div className="grid gap-2">
          <label htmlFor="target-hours" className="label">
            Target Hours Per Week
          </label>
          <input
            id="target-hours"
            type="number"
            step="0.01"
            placeholder="e.g., 10.0"
            value={targetHours}
            onChange={(e) => setTargetHours(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <button type="submit" className="btn-primary">
          {goalId ? "Update Goal" : "Set Goal"}
        </button>
      </form>

      {progressSummary && (
        <div className="grid gap-2 text-sm">
          <p>
            <span className="font-medium">Studied this week:</span>{" "}
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {progressSummary.total_hours_this_week.toFixed(2)}
            </span>{" "}
            hours
          </p>
          <p>
            <span className="font-medium">Target:</span>{" "}
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {progressSummary.target_hours_per_week.toFixed(2)}
            </span>{" "}
            hours
          </p>
          <p>
            <span className="font-medium">Progress:</span>{" "}
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {progressSummary.progress_percentage.toFixed(1)}%
            </span>
          </p>
          {progressSummary.hours_remaining > 0 ? (
            <p className="text-red-500 font-medium">
              <span className="text-lg font-bold">{progressSummary.hours_remaining.toFixed(2)}</span> hours remaining!
            </p>
          ) : (
            <p className="text-green-500 font-medium">Goal achieved! Keep up the great work!</p>
          )}
        </div>
      )}
    </div>
  )
}
