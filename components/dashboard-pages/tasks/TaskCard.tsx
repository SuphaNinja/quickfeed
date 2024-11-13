'use client'

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, UserIcon } from 'lucide-react'
import { Task } from '@/lib/Types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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

export default function TaskCard({ task: initialTask, isAdmin }: { task: Task; isAdmin: boolean }) {
  const queryClient = useQueryClient()
  const params = useParams()


  const { data: task } = useQuery<Task>({
    queryKey: ['task', initialTask.id],
    queryFn: () => axios.get(`/api/projectroom-routes/tasks/get-task/${initialTask.id}`).then(res => res.data),
    initialData: initialTask,
  })
  

  const changeStatus = useMutation({
    mutationFn: (newStatus: string) =>
      axios.post("/api/projectroom-routes/tasks/edit-task", {
        taskId: task.id,
        status: newStatus,
        projectRoomId: params.roomId
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", initialTask.id] })
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
      queryClient.invalidateQueries({ queryKey: ["task", initialTask.id] }) 
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
                value={task.priority}
                onValueChange={handlePriorityChange}
                disabled={changePriority.isPending}
              >
                <SelectTrigger className={`w-[130px] h-[22px] px-2 py-0 text-xs font-medium border rounded-full ${getPriorityColor(task.priority)}`}>
                  <SelectValue>{task.priority}</SelectValue>
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
                value={task.status}
                onValueChange={handleStatusChange}
                disabled={changeStatus.isPending}
              >
                <SelectTrigger className={`w-[130px] h-[22px] px-2 py-0 text-xs font-medium border rounded-full ${getStatusColor(task.status)}`}>
                  <SelectValue>{task.status}</SelectValue>
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
        <div className="space-y-2 mt-3">
          <div className="flex items-center text-xs text-gray-500">
            <CalendarIcon className="w-3 h-3 mr-1" />
            {task.deadline ? new Date(task.deadline).toLocaleDateString() : "No deadline set"}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <div className="flex items-center">
              <UserIcon className="w-3 h-3 mr-1" />
              <span>Assigned to: {task.assignee?.first_name || 'Unassigned'}</span>
            </div>
            <div className="flex items-center">
              <UserIcon className="w-3 h-3 mr-1" />
              <span>Assigned by: {task.assignor?.first_name || 'N/A'}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}