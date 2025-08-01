"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../../App"
import { getMonthlyReport } from "../api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { useToast } from "@/components/ui/use-toast"

export default function MonthlyReportChart() {
  const { accessToken } = useContext(AuthContext)
  const [chartData, setChartData] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const data = await getMonthlyReport(accessToken)
        const formattedData = Object.keys(data)
          .map((day) => ({
            day: Number.parseInt(day),
            hours: data[day],
          }))
          .sort((a, b) => a.day - b.day) // Sort by day number
        setChartData(formattedData)
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to load monthly report: ${error.message}`,
          variant: "destructive",
        })
      }
    }

    if (accessToken) {
      fetchMonthlyData()
    }
  }, [accessToken])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Study Report</CardTitle>
        <CardDescription>Daily study hours for the current month.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            hours: {
              label: "Hours",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" label={{ value: "Day of Month", position: "insideBottom", offset: 0 }} />
              <YAxis label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="hours" stroke="var(--color-hours)" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
