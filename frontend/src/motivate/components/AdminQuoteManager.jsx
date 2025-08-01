"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext, useToast } from "../../App"
import { getAdminQuotes, createAdminQuote, deleteAdminQuote } from "../api"
import { PlusIcon, Trash2Icon } from "lucide-react"

export default function AdminQuoteManager() {
  const { accessToken } = useContext(AuthContext)
  const [quotes, setQuotes] = useState([])
  const [newQuoteText, setNewQuoteText] = useState("")
  const [newQuoteAuthor, setNewQuoteAuthor] = useState("")
  const showToast = useToast()

  const fetchQuotes = async () => {
    try {
      const data = await getAdminQuotes(accessToken)
      setQuotes(data)
    } catch (error) {
      showToast("Error", `Failed to load quotes: ${error.message}`, "error")
    }
  }

  useEffect(() => {
    if (accessToken) {
      fetchQuotes()
    }
  }, [accessToken])

  const handleCreateQuote = async (e) => {
    e.preventDefault()
    if (!newQuoteText.trim()) {
      showToast("Input Error", "Quote text cannot be empty.", "error")
      return
    }
    try {
      await createAdminQuote(accessToken, { text: newQuoteText, author: newQuoteAuthor })
      setNewQuoteText("")
      setNewQuoteAuthor("")
      fetchQuotes()
      showToast("Success", "Quote added successfully!", "success")
    } catch (error) {
      showToast("Error", `Failed to add quote: ${error.message}`, "error")
    }
  }

  const handleDeleteQuote = async (quoteId) => {
    if (!window.confirm("Are you sure you want to delete this quote?")) return
    try {
      await deleteAdminQuote(accessToken, quoteId)
      fetchQuotes()
      showToast("Success", "Quote deleted successfully!", "success")
    } catch (error) {
      showToast("Error", `Failed to delete quote: ${error.message}`, "error")
    }
  }

  return (
    <div className="card w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Admin Quote Management</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Add, view, and delete motivational quotes.</p>

      <form
        onSubmit={handleCreateQuote}
        className="grid gap-4 mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700"
      >
        <h3 className="text-lg font-semibold">Add New Quote</h3>
        <div className="grid gap-2">
          <label htmlFor="quote-text" className="label">
            Quote Text
          </label>
          <textarea
            id="quote-text"
            placeholder="Enter the motivational quote here..."
            value={newQuoteText}
            onChange={(e) => setNewQuoteText(e.target.value)}
            required
            className="input-field min-h-[100px]"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="quote-author" className="label">
            Author (Optional)
          </label>
          <input
            id="quote-author"
            type="text"
            placeholder="e.g., Unknown"
            value={newQuoteAuthor}
            onChange={(e) => setNewQuoteAuthor(e.target.value)}
            className="input-field"
          />
        </div>
        <button type="submit" className="btn-primary flex items-center gap-2">
          <PlusIcon className="h-4 w-4" />
          Add Quote
        </button>
      </form>

      <h3 className="text-lg font-semibold mb-4">Existing Quotes</h3>
      {quotes.length === 0 ? (
        <p className="text-center text-gray-500">No quotes added yet.</p>
      ) : (
        <ul className="space-y-3">
          {quotes.map((quote) => (
            <li
              key={quote.id}
              className="flex items-start justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-sm"
            >
              <div>
                <p className="font-medium">"{quote.text}"</p>
                {quote.author && <p className="text-sm text-gray-600 dark:text-gray-400">- {quote.author}</p>}
              </div>
              <button
                className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900 ml-4"
                onClick={() => handleDeleteQuote(quote.id)}
              >
                <Trash2Icon className="h-4 w-4 text-red-500" />
                <span className="sr-only">Delete quote</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
