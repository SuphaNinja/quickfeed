"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Bar, Pie, Line } from 'react-chartjs-2'
import { formatDistanceToNow } from 'date-fns'
import { User } from 'lucide-react'
import { Analysis } from '../Types'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
)

export default function AnalysisCharts({ analyses }: {analyses: Analysis[]}) {
    const [selectedAnalysisId, setSelectedAnalysisId] = useState(analyses[0]?.id)
    const selectedAnalysis = analyses.find(analysis => analysis.id === selectedAnalysisId) || analyses[0]

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
    }

    const ratingDistributionData = {
        labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
        datasets: [
            {
                data: [
                    selectedAnalysis.ratingDistribution.fiveStarCount,
                    selectedAnalysis.ratingDistribution.fourStarCount,
                    selectedAnalysis.ratingDistribution.threeStarCount,
                    selectedAnalysis.ratingDistribution.twoStarCount,
                    selectedAnalysis.ratingDistribution.oneStarCount,
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                ],
            },
        ],
    }

    const sentimentBreakdownData = {
        labels: ['Positive', 'Neutral', 'Negative'],
        datasets: [
            {
                data: [
                    selectedAnalysis.sentimentBreakdown.positiveCount,
                    selectedAnalysis.sentimentBreakdown.neutralCount,
                    selectedAnalysis.sentimentBreakdown.negativeCount,
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                ],
            },
        ],
    }

    const topIssuesData = {
        labels: selectedAnalysis.topIssues.map(item => item.issue),
        datasets: [
            {
                label: 'Frequency',
                data: selectedAnalysis.topIssues.map(item => item.frequency),
                backgroundColor: 'rgba(255, 99, 132, 0.8)',
            },
            {
                label: 'Average Rating',
                data: selectedAnalysis.topIssues.map(item => item.averageRating),
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
            },
        ],
    }

    const ratingTrendsData = {
        labels: selectedAnalysis.ratingTrends.map(item => item.date),
        datasets: [
            {
                label: 'Average Rating',
                data: selectedAnalysis.ratingTrends.map(item => item.averageRating),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    }

    const keywordAnalysisData = {
        labels: selectedAnalysis.keywordAnalyses.map(item => item.keyword),
        datasets: [
            {
                label: 'Frequency',
                data: selectedAnalysis.keywordAnalyses.map(item => item.frequency),
                backgroundColor: 'rgba(255, 99, 132, 0.8)',
            },
            {
                label: 'Average Rating',
                data: selectedAnalysis.keywordAnalyses.map(item => item.associatedRatings[0] || 0),
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
            },
        ],
    }

    return (
        <div className="space-y-8 md:p-8">
            <Card className="w-full mx-auto bg-[#F8F9FA] dark:bg-[#09090B] border-none">
                <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <CardTitle className="text-3xl font-bold">Analysis Dashboard</CardTitle>
                        <Select value={selectedAnalysisId} onValueChange={setSelectedAnalysisId}>
                            <SelectTrigger className="w-full sm:w-[280px] border border-neutral-900 bg-[#F8F9FA] dark:bg-[#09090B]">
                                <SelectValue placeholder="Select an analysis" />
                            </SelectTrigger>
                            <SelectContent className='border border-neutral-900 bg-[#F8F9FA] dark:bg-[#09090B]'>
                                {analyses.map(analysis => (
                                    <SelectItem key={analysis.id} value={analysis.id}>
                                        {analysis.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    {selectedAnalysis.id && (
                        <div className="space-y-4">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <User className="mr-2 h-4 w-4" />
                                <span>{selectedAnalysis.createdBy}</span>
                                <span className="mx-2">•</span>
                                <time dateTime={selectedAnalysis.createdAt}>
                                    {formatDistanceToNow(new Date(selectedAnalysis.createdAt))} ago
                                </time>
                            </div>
                            <p className="text-lg leading-relaxed">{selectedAnalysis.description}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Rating Distribution</CardTitle>
                        <CardDescription>Distribution of ratings from 1 to 5 stars</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <Pie data={ratingDistributionData} options={chartOptions} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Sentiment Breakdown</CardTitle>
                        <CardDescription>Distribution of positive, neutral, and negative sentiments</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <Pie data={sentimentBreakdownData} options={chartOptions} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top Issues</CardTitle>
                        <CardDescription>Frequency and average rating of top issues</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <Bar data={topIssuesData} options={chartOptions} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Rating Trends</CardTitle>
                        <CardDescription>Average rating over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <Line data={ratingTrendsData} options={chartOptions} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Keyword Analysis</CardTitle>
                        <CardDescription>Frequency and average rating of key terms</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[400px]">
                            <Bar data={keywordAnalysisData} options={chartOptions} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}