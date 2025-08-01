"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext, useToast } from "../../App"
import { getReminderMessages } from "../api"
import { MessageSquareIcon } from "lucide-react"

export default function ReminderMessages() {
  const { accessToken } = useContext(AuthContext)
  const [reminders, setReminders] = useState([])
  const showToast = useToast()

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const data = await getReminderMessages(accessToken)
        setReminders(data)
      } catch (error) {
        showToast("Error", `Failed to load reminders: ${error.message}`, "error")
      }
    }

    if (accessToken) {
      fetchReminders()
    }
  }, [accessToken])

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <MessageSquareIcon className="h-5 w-5" />
        Your Reminders & Encouragement
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">Messages based on your study progress and goals.</p>
      {reminders.length === 0 ? (
        <p className="text-gray-500">No reminders or encouragement messages at the moment.</p>
      ) : (
        <ul className="space-y-3">
          {reminders.map((reminder, index) => (
            <li
              key={index}
              className={`p-3 rounded-md ${reminder.type === "goal_progress" && reminder.goal_met ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200" : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"}`}
            >
              <p className="font-medium">{reminder.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
