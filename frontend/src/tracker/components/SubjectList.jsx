"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext, useToast } from "../../App"
import { getSubjects, createSubject, deleteSubject } from "../api"
import { List, XIcon } from "lucide-react"

export default function SubjectList() {
  const { accessToken } = useContext(AuthContext)
  const [subjects, setSubjects] = useState([])
  const [newSubjectName, setNewSubjectName] = useState("")
  const [newSubjectDescription, setNewSubjectDescription] = useState("")
  const showToast = useToast()

  const fetchSubjects = async () => {
    try {
      const data = await getSubjects(accessToken)
      setSubjects(data)
    } catch (error) {
      showToast("Error", `Failed to load subjects: ${error.message}`, "error")
    }
  }

  useEffect(() => {
    if (accessToken) {
      fetchSubjects()
    }
  }, [accessToken])

  const handleCreateSubject = async (e) => {
    e.preventDefault()
    if (!newSubjectName.trim()) {
      showToast("Input Error", "Subject name cannot be empty.", "error")
      return
    }
    try {
      await createSubject(accessToken, { name: newSubjectName, description: newSubjectDescription })
      setNewSubjectName("")
      setNewSubjectDescription("")
      fetchSubjects()
      showToast("Success", "Subject created successfully!", "success")
    } catch (error) {
      showToast("Error", `Failed to create subject: ${error.message}`, "error")
    }
  }

  const handleDeleteSubject = async (subjectId) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return
    try {
      await deleteSubject(accessToken, subjectId)
      fetchSubjects()
      showToast("Success", "Subject deleted successfully!", "success")
    } catch (error) {
      showToast("Error", `Failed to delete subject: ${error.message}`, "error")
    }
  }

  return (
    <div className="card col-span-1">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <List className="h-5 w-5" />
        Your Subjects
      </h3>
      <form onSubmit={handleCreateSubject} className="grid gap-2 mb-4">
        <label htmlFor="new-subject-name" className="label">
          New Subject Name
        </label>
        <input
          id="new-subject-name"
          type="text"
          placeholder="e.g., Data Structures"
          value={newSubjectName}
          onChange={(e) => setNewSubjectName(e.target.value)}
          required
          className="input-field"
        />
        <label htmlFor="new-subject-description" className="label">
          Description (Optional)
        </label>
        <input
          id="new-subject-description"
          type="text"
          placeholder="e.g., Algorithms and Complexity"
          value={newSubjectDescription}
          onChange={(e) => setNewSubjectDescription(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="btn-primary">
          Add Subject
        </button>
      </form>
      {subjects.length === 0 ? (
        <p className="text-center text-gray-500">No subjects added yet.</p>
      ) : (
        <ul className="space-y-2">
          {subjects.map((subject) => (
            <li
              key={subject.id}
              className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700"
            >
              <div>
                <p className="font-medium">{subject.name}</p>
                {subject.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{subject.description}</p>
                )}
              </div>
              <button
                className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900"
                onClick={() => handleDeleteSubject(subject.id)}
              >
                <XIcon className="h-4 w-4 text-red-500" />
                <span className="sr-only">Delete subject</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
