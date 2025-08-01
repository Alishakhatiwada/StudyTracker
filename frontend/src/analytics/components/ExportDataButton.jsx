"use client"

import { useContext } from "react"
import { AuthContext, useToast } from "../../App"
import { exportStudyData } from "../api"
import { DownloadIcon } from "lucide-react"

export default function ExportDataButton() {
  const { accessToken } = useContext(AuthContext)
  const showToast = useToast()

  const handleExport = async () => {
    try {
      const blob = await exportStudyData(accessToken)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `study_data_${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      showToast("Success", "Study data exported successfully!", "success")
    } catch (error) {
      showToast("Error", `Failed to export data: ${error.message}`, "error")
    }
  }

  return (
    <div className="card p-6 flex flex-col items-center justify-center text-center">
      <h3 className="text-lg font-semibold mb-2">Export Your Study Data</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Download all your study sessions as a CSV file for personal analysis.
      </p>
      <button onClick={handleExport} className="btn-primary flex items-center gap-2">
        <DownloadIcon className="h-4 w-4" />
        Export to CSV
      </button>
    </div>
  )
}
