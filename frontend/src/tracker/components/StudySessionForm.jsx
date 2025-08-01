"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext, useToast } from "../../App"
import { getSubjects, createStudySession } from "../api"
import { ClockIcon } from "lucide-react"

export default function StudySessionForm() {
  const { accessToken } = useContext(AuthContext)
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [duration, setDuration] = useState("")
  const [notes, setNotes] = useState("")
  const [tags, setTags] = useState("")
  const showToast = useToast()

  const fetchSubjects = async () => {
    try {
      const data = await getSubjects(accessToken)
      setSubjects(data)
      if (data.length > 0) {
        setSelectedSubject(data[0].id.toString())
      }
    } catch (error) {
      showToast("Error", `Failed to load subjects for session: ${error.message}`, "error")
    }
  }

  useEffect(() => {
    if (accessToken) {
      fetchSubjects()
    }
  }, [accessToken])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedSubject || !date || !duration) {
      showToast("Input Error", "Please fill in all required fields (Subject, Date, Duration).", "error")
      return
    }
    if (isNaN(Number.parseFloat(duration)) || Number.parseFloat(duration) <= 0) {
      showToast("Input Error", "Duration must be a positive number.", "error")
      return
    }

    try {
      await createStudySession(accessToken, {
        subject: Number.parseInt(selectedSubject),
        date,
        duration: Number.parseFloat(duration),
        notes,
        tags,
      })
      setSelectedSubject(subjects.length > 0 ? subjects[0].id.toString() : "")
      setDate(new Date().toISOString().split("T")[0])
      setDuration("")
      setNotes("")
      setTags("")
      showToast("Success", "Study session logged successfully!", "success")
    } catch (error) {
      showToast("Error", `Failed to log session: ${error.message}`, "error")
    }
  }

  return (
    <div className="card col-span-1">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <ClockIcon className="h-5 w-5" />
        Log Study Session
      </h3>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="subject" className="label">
            Subject
          </label>
          <select
            id="subject"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="input-field"
            required
          >
            <option value="">Select a subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id.toString()}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <label htmlFor="date" className="label">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="duration" className="label">
            Duration (hours)
          </label>
          <input
            id="duration"
            type="number"
            step="0.01"
            placeholder="e.g., 1.5"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="notes" className="label">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            placeholder="What did you study?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input-field min-h-[80px]"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="tags" className="label">
            Tags (Optional, comma-separated)
          </label>
          <input
            id="tags"
            type="text"
            placeholder="e.g., math, calculus, review"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="input-field"
          />
        </div>
        <button type="submit" className="btn-primary">
          Log Session
        </button>
      </form>
    </div>
  )
}
