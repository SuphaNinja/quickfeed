"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ProjectRoom } from "@/lib/Types"

export default function FeedbackBarChart({ projectRoom }: { projectRoom: ProjectRoom }) {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()

  // Group feedbacks by month
  const feedbacksByMonth = projectRoom?.feedbacks.reduce((acc, feedback) => {
    const feedbackDate = new Date(feedback.createdAt)
    if (feedbackDate.getFullYear() === currentYear) {
      const month = feedbackDate.getMonth()
      if (!acc[month]) {
        acc[month] = { count: 0, totalRating: 0 }
      }
      acc[month].count += 1
      acc[month].totalRating += feedback.rating
    }
    return acc
  }, {} as Record<number, { count: number; totalRating: number }>)

  // Prepare data for the chart
  const chartData = Object.entries(feedbacksByMonth).map(([month, data]) => ({
    month: new Date(currentYear, parseInt(month)).toLocaleString('default', { month: 'short' }),
    feedbacks: data.count,
    averageRating: data.totalRating / data.count
  }))

  if (chartData.length === 0) {
    return (
      <Card className="backdrop-blur border-neutral-900 rounded-lg overflow-hidden">
        <CardHeader className="p-4">
          <CardTitle className="text-base font-medium text-white">Feedback Distribution</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm text-gray-400">No feedback data available for this year</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className=" backdrop-blur border-neutral-900 rounded-lg overflow-hidden">
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-bold text-white mb-1">Feedback Distribution ({currentYear})</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ChartContainer
          config={{
            feedbacks: {
              label: "Feedbacks",
              color: "hsl(var(--chart-1))",
            },
            averageRating: {
              label: "Average Rating",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <ChartTooltip content={<CustomTooltip />} />
              <Bar yAxisId="left" dataKey="feedbacks" fill="var(--color-feedbacks)" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="averageRating" fill="var(--color-averageRating)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1C1C1F] border border-[#2A2A2D] rounded p-2 shadow-lg">
        <p className="text-white font-semibold">{label}</p>
        <p className="text-[#888888]">Feedbacks: {payload[0].value}</p>
        <p className="text-[#888888]">Avg Rating: {payload[1].value.toFixed(2)}</p>
      </div>
    )
  }

  return null
}

