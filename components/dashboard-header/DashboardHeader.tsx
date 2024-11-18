'use client'

import React, { useMemo } from "react"
import { ProjectRoom } from "../../lib/Types"
import { calculateTaskStats, calculateFeedbackGrowth, calculateRatingStats } from '@/utils/dashboardCalculations'
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, ListTodo, TrendingUp } from 'lucide-react'
import { useAllUsers } from "../../hooks/functions/user/useAllUsers"

type DashboardHeaderProps = {
  projectRoom: ProjectRoom
}

export default function DashboardHeader({ projectRoom }: DashboardHeaderProps) {
  const feedbacks = projectRoom?.feedbacks || []
  const tasks = projectRoom?.tasks || []

  const { averageRating, goodPercentage } = useMemo(() => calculateRatingStats(feedbacks), [feedbacks])
  const { growth, growthPercentage } = useMemo(() => calculateFeedbackGrowth(feedbacks), [feedbacks])
  const { activeTasks, tasksAddedToday } = useMemo(() => calculateTaskStats(tasks), [tasks])


  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#FFE4E6] border-none shadow-none">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-neutral-600">Positive rating</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-3xl font-bold text-neutral-900">{goodPercentage}%</p>
                  <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                </div>
                <p className="text-xs text-neutral-500">
                  Overall rating <span className="font-medium text-neutral-900">{averageRating}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#DCFCE7] border-none shadow-none">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-neutral-600">Total feedbacks</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-3xl font-bold text-neutral-900">{feedbacks.length}</p>
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="text-xs text-neutral-500">
                  <span className={`font-medium ${growth >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    {growth >= 0 ? "+" : ""}
                    {growthPercentage}%
                  </span>
                  <span className="ml-1">last month</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#F3E8FF] border-none shadow-none">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-neutral-600">Total users</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-3xl font-bold text-neutral-900">{projectRoom.users.length}</p>
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-neutral-500">
                    <span className="font-medium text-purple-600">+5%</span> last week
                  </p>

                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#FEF3C7] border-none shadow-none">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-neutral-600">Active tasks</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-3xl font-bold text-neutral-900">{activeTasks}</p>
                  <ListTodo className="h-4 w-4 text-amber-600" />
                </div>
                <p className="text-xs text-neutral-500">
                  <span className="font-medium text-amber-600">
                    {tasksAddedToday === 0 ? "No tasks" : `+${tasksAddedToday}`}
                  </span>
                  <span className="ml-1">assigned today</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}