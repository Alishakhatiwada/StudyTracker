"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext, useToast } from "../../App"
import { getRandomQuote, getQuoteOfTheDay } from "../api"
import { RefreshCwIcon, SparklesIcon } from "lucide-react"

export default function QuoteDisplay() {
  const { accessToken } = useContext(AuthContext)
  const [randomQuote, setRandomQuote] = useState(null)
  const [dailyQuote, setDailyQuote] = useState(null)
  const showToast = useToast()

  const fetchRandomQuote = async () => {
    try {
      const data = await getRandomQuote(accessToken)
      setRandomQuote(data)
    } catch (error) {
      showToast("Error", `Failed to load random quote: ${error.message}`, "error")
    }
  }

  const fetchDailyQuote = async () => {
    try {
      const data = await getQuoteOfTheDay(accessToken)
      setDailyQuote(data)
    } catch (error) {
      showToast("Error", `Failed to load daily quote: ${error.message}`, "error")
    }
  }

  useEffect(() => {
    if (accessToken) {
      fetchRandomQuote()
      fetchDailyQuote()
    }
  }, [accessToken])

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="card">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <SparklesIcon className="h-5 w-5" />
          Quote of the Day
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">A daily dose of inspiration.</p>
        {dailyQuote ? (
          <blockquote className="text-lg italic border-l-4 border-blue-500 pl-4 text-gray-700 dark:text-gray-300">
            "{dailyQuote.text}"
            {dailyQuote.author && (
              <footer className="mt-2 text-sm not-italic text-gray-500 dark:text-gray-400">
                - {dailyQuote.author}
              </footer>
            )}
          </blockquote>
        ) : (
          <p className="text-gray-500">Loading quote of the day...</p>
        )}
      </div>

      <div className="card">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <RefreshCwIcon className="h-5 w-5" />
          Random Motivational Quote
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Need a quick boost? Get a new quote!</p>
        {randomQuote ? (
          <blockquote className="text-lg italic border-l-4 border-blue-500 pl-4 text-gray-700 dark:text-gray-300">
            "{randomQuote.text}"
            {randomQuote.author && (
              <footer className="mt-2 text-sm not-italic text-gray-500 dark:text-gray-400">
                - {randomQuote.author}
              </footer>
            )}
          </blockquote>
        ) : (
          <p className="text-gray-500">Click the button to get a random quote.</p>
        )}
        <button onClick={fetchRandomQuote} className="btn-primary mt-4">
          Get New Quote
        </button>
      </div>
    </div>
  )
}
