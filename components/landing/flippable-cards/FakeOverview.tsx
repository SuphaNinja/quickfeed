"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, Minus, ThumbsDown } from "lucide-react"

interface FeedbackCategoryProps {
    icon: React.ReactNode
    label: string
    count: number
    total: number
    color: string
}

const RATING_CATEGORIES = {
    GOOD: { label: "Good", icon: <ThumbsUp className="w-4 h-4 text-green-500" />, color: "bg-green-500" },
    OKAY: { label: "Okay", icon: <Minus className="w-4 h-4 text-yellow-500" />, color: "bg-yellow-500" },
    BAD: { label: "Bad", icon: <ThumbsDown className="w-4 h-4 text-red-500" />, color: "bg-red-500" },
} as const

const FeedbackCategory: React.FC<FeedbackCategoryProps> = ({ icon, label, count, total, color }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {icon}
                    <span className="text-sm dark:text-white text-black font-medium">{label}</span>
                </div>
                <span className="text-sm dark:text-white text-black">{count}</span>
            </div>
            <div className="h-2 w-full bg-gray-400 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                    className={`h-full ${color}`}
                    style={{ width: `${percentage}%` }}
                    role="progressbar"
                    aria-valuenow={percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                />
            </div>
        </div>
    )
}

const mockData = {
    overallRating: 4.2,
    totalFeedback: 100,
    feedbackCounts: {
        good: 70,
        okay: 20,
        bad: 10,
    },
}

export default function FakeOverview() {
    const { overallRating, totalFeedback, feedbackCounts } = mockData

    const categories = [
        { ...RATING_CATEGORIES.GOOD, count: feedbackCounts.good },
        { ...RATING_CATEGORIES.OKAY, count: feedbackCounts.okay },
        { ...RATING_CATEGORIES.BAD, count: feedbackCounts.bad },
    ]

    return (
        <Card className="w-full overflow-hidden bg-[#F1F3F5] dark:bg-[#131314] text-white border-none">
            <CardContent className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-lg font-semibold">Feedback Overview 🔍</h1>
                    <div className="bg-[#CED4DA] dark:bg-[#171717] rounded-full px-3 py-1 text-sm font-medium">
                        <p>{overallRating.toFixed(1)} / 5</p>
                    </div>
                </div>
                <div className="flex-grow flex flex-col justify-between">
                    {categories.map(({ label, icon, count, color }) => (
                        <FeedbackCategory
                            key={label}
                            icon={icon}
                            label={label}
                            count={count}
                            total={totalFeedback}
                            color={color}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}