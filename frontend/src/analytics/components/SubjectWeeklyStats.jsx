"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../../App"
import { getSubjectWiseWeeklyStats } from "../api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts"
import { useToast } from "@/components/ui/use-toast"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

export default function SubjectWeeklyStats() {
  const { accessToken } = useContext(AuthContext)
  const [chartData, setChartData] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchSubjectStats = async () => {
      try {
        const data = await getSubjectWiseWeeklyStats(accessToken)
        const formattedData = Object.keys(data).map((subject, index) => ({
          name: subject,
          value: data[subject],
          color: COLORS[index % COLORS.length],
        }))
        setChartData(formattedData.filter((item) => item.value > 0)) // Only show subjects with study time
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to load subject stats: ${error.message}`,
          variant: "destructive",
        })
      }
    }

    if (accessToken) {
      fetchSubjectStats()
    }
  }, [accessToken])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subject-wise Weekly Stats</CardTitle>
        <CardDescription>Distribution of study hours per subject this week.</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-center text-gray-500 h-[300px] flex items-center justify-center">
            No study sessions logged this week for any subject.
          </p>
        ) : (
          <ChartContainer
            config={chartData.reduce((acc, item) => {
              acc[item.name] = { label: item.name, color: item.color }
              return acc
            }, {})}
            className="h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
