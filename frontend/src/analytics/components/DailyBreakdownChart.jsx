"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../../App"
import { getDailyBreakdown } from "../api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { useToast } from "@/components/ui/use-toast"

export default function DailyBreakdownChart() {
  const { accessToken } = useContext(AuthContext)
  const [chartData, setChartData] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchDailyData = async () => {
      try {
        const data = await getDailyBreakdown(accessToken)
        const formattedData = Object.keys(data).map((day) => ({
          day,
          hours: data[day],
        }))
        setChartData(formattedData)
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to load daily breakdown: ${error.message}`,
          variant: "destructive",
        })
      }
    }

    if (accessToken) {
      fetchDailyData()
    }
  }, [accessToken])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Study Breakdown (Last 7 Days)</CardTitle>
        <CardDescription>Hours studied per day.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            hours: {
              label: "Hours",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="hours" fill="var(--color-hours)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
