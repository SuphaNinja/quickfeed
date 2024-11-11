"use client";

import React, { useState, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Line, Bar, Doughnut } from "react-chartjs-2";
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
} from "chart.js";
import { Analysis } from "../../../lib/Types";
import dynamic from "next/dynamic";
import { formatDate } from "date-fns";
const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });

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
);

const chartColors = {
  primary: "rgba(149, 76, 233, 0.8)",
  secondary: "rgba(76, 0, 255, 0.8)",
  tertiary: "rgba(191, 90, 242, 0.8)",
  success: "rgba(80, 250, 123, 0.8)",
  danger: "rgba(255, 85, 85, 0.8)",
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        color: "rgba(255, 255, 255, 0.7)",
        font: {
          family: "Inter, sans-serif",
          size: 12,
        },
        padding: 16,
      },
    },
  },
  scales: {
    x: {
      grid: {
        color: "rgba(255, 255, 255, 0.1)",
      },
      ticks: {
        color: "rgba(255, 255, 255, 0.7)",
      },
    },
    y: {
      grid: {
        color: "rgba(255, 255, 255, 0.1)",
      },
      ticks: {
        color: "rgba(255, 255, 255, 0.7)",
      },
    },
  },
};

export default function DarkAnalysisDashboard({
  analyses,
}: {
  analyses: Analysis[];
}) {
  const [selectedAnalysisId, setSelectedAnalysisId] = useState(analyses[0]?.id);
  const selectedAnalysis =
    analyses.find((analysis) => analysis.id === selectedAnalysisId) ||
    analyses[0];

  const ratingDistributionData = {
    labels: ["5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"],
    datasets: [
      {
        data: [
          selectedAnalysis.ratingDistribution.fiveStarCount,
          selectedAnalysis.ratingDistribution.fourStarCount,
          selectedAnalysis.ratingDistribution.threeStarCount,
          selectedAnalysis.ratingDistribution.twoStarCount,
          selectedAnalysis.ratingDistribution.oneStarCount,
        ],
        backgroundColor: Object.values(chartColors),
        borderWidth: 0,
      },
    ],
  };

  const sentimentBreakdownData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        data: [
          selectedAnalysis.sentimentBreakdown.positiveCount,
          selectedAnalysis.sentimentBreakdown.neutralCount,
          selectedAnalysis.sentimentBreakdown.negativeCount,
        ],
        backgroundColor: [
          chartColors.success,
          chartColors.tertiary,
          chartColors.danger,
        ],
        borderWidth: 0,
      },
    ],
  };

  const topIssuesData = {
    labels: selectedAnalysis.topIssues.map((item) => item.issue),
    datasets: [
      {
        label: "Frequency",
        data: selectedAnalysis.topIssues.map((item) => item.frequency),
        backgroundColor: chartColors.primary,
        borderRadius: 8,
      },
      {
        label: "Average Rating",
        data: selectedAnalysis.topIssues.map((item) => item.averageRating),
        backgroundColor: chartColors.secondary,
        borderRadius: 8,
      },
    ],
  };

  const ratingTrendsData = {
    labels: selectedAnalysis.ratingTrends.map((item) => item.date),
    datasets: [
      {
        label: "Average Rating",
        data: selectedAnalysis.ratingTrends.map((item) => item.averageRating),
        borderColor: chartColors.primary,
        backgroundColor: "rgba(149, 76, 233, 0.2)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  };

  const keywordAnalysisData = {
    labels: selectedAnalysis.keywordAnalyses.map((item) => item.keyword),
    datasets: [
      {
        label: "Frequency",
        data: selectedAnalysis.keywordAnalyses.map((item) => item.frequency),
        backgroundColor: chartColors.primary,
        borderRadius: 8,
      },
      {
        label: "Average Rating",
        data: selectedAnalysis.keywordAnalyses.map(
          (item) => item.associatedRatings[0] || 0
        ),
        backgroundColor: chartColors.secondary,
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white p-5">
      <div className="max-w-[1400px] mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Analysis Dashboard
            </h1>
            <p className="text-gray-400 mt-1">
              Track your performance and user feedback
            </p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Select
              value={selectedAnalysisId}
              onValueChange={setSelectedAnalysisId}
            >
              <SelectTrigger className="w-[180px] border-[#2A2A2D] bg-[#1C1C1F] rounded-xl">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1C1F] border-[#2A2A2D]">
                {analyses.map((analysis) => (
                  <SelectItem key={analysis.id} value={analysis.id}>
                    {analysis.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="md:col-span-2 bg-[#1C1C1F]/50 backdrop-blur border-[#2A2A2D] rounded-xl max-h-[500px] overflow-auto custom-scrollbar">
          <CardHeader>
            <CardTitle className=" flex md:flex-row flex-col justify-between text-base font-medium ">
              <span className="text-xl mb-2">{selectedAnalysis.title}</span>
              <div className="text-xs text-muted-foreground flex flex-col ">
             <span className="text-base text-white">{selectedAnalysis.createdBy}</span>
                <span>
                  {formatDate(selectedAnalysis.createdAt, "MMMM d, yyyy")}
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="pb-5 shadow-lg 
             mx-auto"
            >
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1
                      className="text-3xl font-bold text-gray-800 dark:text-white mb-6"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mt-8 mb-4"
                      {...props}
                    />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc pl-6 mb-4" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li
                      className="mb-2 text-gray-600 dark:text-gray-300"
                      {...props}
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p
                      className="mb-4 text-gray-600 dark:text-gray-300"
                      {...props}
                    />
                  ),
                }}
                className="prose prose-lg max-w-none dark:prose-invert
                   prose-headings:tracking-tight
                   prose-p:leading-relaxed
                   prose-li:leading-relaxed"
              >
                {selectedAnalysis.description}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-[#1C1C1F]/50 backdrop-blur border-[#2A2A2D] rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Rating Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Doughnut
                  data={ratingDistributionData}
                  options={chartOptions}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1C1C1F]/50 backdrop-blur border-[#2A2A2D] rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Sentiment Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Doughnut
                  data={sentimentBreakdownData}
                  options={chartOptions}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1C1C1F]/50 backdrop-blur border-[#2A2A2D] rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Rating Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Line data={ratingTrendsData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1C1C1F]/50 backdrop-blur border-[#2A2A2D] rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Top Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Bar data={topIssuesData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 bg-[#1C1C1F]/50 backdrop-blur border-[#2A2A2D] rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Keyword Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <Bar data={keywordAnalysisData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
