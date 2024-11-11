'use client'

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon } from 'lucide-react'
import { Task } from '@/lib/Types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useParams } from 'next/navigation'

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high': return 'bg-red-100 text-red-800 border-red-300'
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    case 'low': return 'bg-green-100 text-green-800 border-green-300'
    default: return 'bg-gray-100 text-gray-800 border-gray-300'
  }
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
    case 'in progress': return 'bg-blue-100 text-blue-800 border-blue-300'
    case 'pending': return 'bg-gray-100 text-gray-800 border-gray-300'
    default: return 'bg-gray-100 text-gray-800 border-gray-300'
  }
}

export default function TaskCard({ task, isAdmin }: { task: Task; isAdmin: boolean }) {
  const queryClient = useQueryClient()
  const params = useParams()

  const changeStatus = useMutation({
    mutationFn: (newStatus: string) =>
      axios.post("/api/projectroom-routes/tasks/edit-task", {
        taskId: task.id,
        status: newStatus,
        projectRoomId: params.roomId
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myTasks", params.roomId] })
      queryClient.invalidateQueries({ queryKey: ["allTasks", params.roomId] })
    },
  })

  const handleStatusChange = (newStatus: string) => {
    changeStatus.mutate(newStatus)
  }

  const changePriority = useMutation({
    mutationFn: (newPriority: string) =>
      axios.post("/api/projectroom-routes/tasks/edit-task", {
        taskId: task.id,
        priority: newPriority,
        projectRoomId: params.roomId
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myTasks", params.roomId] })
      queryClient.invalidateQueries({ queryKey: ["allTasks", params.roomId] })
    },
  })

  const handlePriorityChange = (newPriority: string) => {
    changePriority.mutate(newPriority)
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className='flex justify-between'>
          <div className="flex-1 mr-4">
            <h3 className="text-lg font-semibold mb-2 line-clamp-1">{task.title}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
          </div>
          <div className="flex flex-col gap-2 mb-3">
            {isAdmin ? (
              <Select
                defaultValue={task.priority}
                onValueChange={handlePriorityChange}
                disabled={changePriority.isPending}
              >
                <SelectTrigger className={`w-[130px] h-[22px] px-2 py-0 text-xs font-medium border rounded-full ${getPriorityColor(task.priority)}`}>
                  <SelectValue placeholder="Change priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            ) : (
            <Badge variant="outline" className={`${getPriorityColor(task.priority)} text-xs font-medium px-2 py-1`}>
              {task.priority}
            </Badge>
            )}
            {isAdmin ? (
              <Select
                defaultValue={task.status}
                onValueChange={handleStatusChange}
                disabled={changeStatus.isPending}
              >
                <SelectTrigger className={`w-[130px] h-[22px] px-2 py-0 text-xs font-medium border rounded-full ${getStatusColor(task.status)}`}>
                  <SelectValue placeholder="Change status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="outline" className={`${getStatusColor(task.status)} text-xs font-medium px-2 py-1`}>
                {task.status}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <CalendarIcon className="w-3 h-3 mr-1" />
          {task.deadline ? new Date(task.deadline).toLocaleDateString() : "No deadline set"}
        </div>
      </CardContent>
    </Card>
  )
}