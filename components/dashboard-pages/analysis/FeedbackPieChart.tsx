"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions, ChartData } from "chart.js"
import { ProjectRoom } from "@/lib/Types"

ChartJS.register(ArcElement, Tooltip, Legend)

const chartColors = [
    "rgba(149, 76, 233, 0.8)",
    "rgba(76, 0, 255, 0.8)",
    "rgba(191, 90, 242, 0.8)",
    "rgba(80, 250, 123, 0.8)",
    "rgba(255, 85, 85, 0.8)",
]

export default function FeedbackPieChart({ projectRoom }: { projectRoom: ProjectRoom }) {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    const feedbacks = projectRoom?.feedbacks.filter(feedback => {
        const feedbackDate = new Date(feedback.createdAt)
        return feedbackDate.getMonth() === currentMonth && feedbackDate.getFullYear() === currentYear
    }) || []

    const totalFeedbacks = feedbacks.length

    if (totalFeedbacks === 0) {
        return (
            <Card className="bg-[#1C1C1F]/50 backdrop-blur border-[#2A2A2D] rounded-lg overflow-hidden">
                <CardHeader className="p-4">
                    <CardTitle className="text-base font-medium text-white">This Month&apos;s Feedback Distribution</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <p className="text-sm text-gray-400">No feedback data available for this month</p>
                </CardContent>
            </Card>
        )
    }

    const ratingCounts = feedbacks.reduce((acc, feedback) => {
        const rating = Math.round(feedback.rating)
        acc[rating] = (acc[rating] || 0) + 1
        return acc
    }, {} as Record<number, number>)

    const chartData = {
        labels: Object.keys(ratingCounts).map(rating => `${rating} Star${ratingCounts[Number(rating)] !== 1 ? 's' : ''}`),
        datasets: [
            {
                data: Object.values(ratingCounts),
                backgroundColor: chartColors.slice(0, Object.keys(ratingCounts).length),
                borderColor: chartColors.slice(0, Object.keys(ratingCounts).length).map(color => color.replace("0.8", "1")),
                borderWidth: 1,
            },
        ],
    }

    const chartOptions: ChartOptions<'pie'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: "white",
                    font: {
                        family: "Inter, sans-serif",
                        size: 12,
                        weight: "bold",
                    },
                    padding: 12,
                    generateLabels: (chart) => {
                        const data = chart.data as ChartData<'pie'>;
                        if (data.labels && data.labels.length && data.datasets.length) {
                            return data.labels.map((label, i) => ({
                                text: `${label} (${data.datasets[0].data[i]})`,
                                fillStyle: Array.isArray(data.datasets[0].backgroundColor)
                                    ? data.datasets[0].backgroundColor[i]
                                    : undefined,
                                color: "white",
                                hidden: false,
                                index: i,
                            }));
                        }
                        return [];
                    },
                },
            },
            tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                titleColor: "rgba(255, 255, 255, 1)",
                bodyColor: "rgba(255, 255, 255, 0.8)",
                bodyFont: {
                    family: "Inter, sans-serif",
                    size: 12,
                },
                padding: 12,
                cornerRadius: 4,
                displayColors: false,
            },
        },
    };

    const averageRating = (feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / totalFeedbacks).toFixed(1)

    return (
        <Card className="bg-[#1C1C1F]/50 backdrop-blur border-[#2A2A2D] rounded-lg overflow-hidden">
            <CardHeader className="p-4">
                <CardTitle className="text-lg font-bold text-white mb-1">This Month&apos;s Feedback Distribution</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <div className="h-[300px] flex items-center justify-center">
                    <Pie data={chartData} options={chartOptions} />
                </div>
                <div className="mt-4 text-center text-white">
                    <p className="text-sm font-semibold">Total Feedbacks This Month: {totalFeedbacks}</p>
                    <p className="text-sm font-semibold">Average Rating This Month: {averageRating}</p>
                </div>
            </CardContent>
        </Card>
    )
}