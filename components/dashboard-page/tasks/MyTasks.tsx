'use client'

import axios from 'axios'
import { useParams } from 'next/navigation'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { format, parseISO } from 'date-fns'
import { CalendarIcon, AlertCircle } from 'lucide-react'
import TaskEditor from './TaskEditor'

interface Task {
    id: string
    title: string
    description: string
    deadline: string | null
    priority: 'low' | 'medium' | 'high'
    status: 'todo' | 'in_progress' | 'completed'
}

function MyTasks() {
    const params = useParams()
    const { data: myTasks, isLoading, isError } = useQuery<{ data: Task[] }>({
        queryKey: ["myTasks", params.roomId],
        queryFn: () => axios.post("/api/projectroom-routes/tasks/get-my-tasks", { projectRoomId: params.roomId }),
    })

    const getPriorityColor = (priority: Task['priority']) => {
        switch (priority) {
            case 'low': return 'bg-green-500'
            case 'medium': return 'bg-yellow-500'
            case 'high': return 'bg-red-500'
            default: return 'bg-gray-500'
        }
    }

    const getStatusColor = (status: Task['status']) => {
        switch (status) {
            case 'todo': return 'bg-gray-500'
            case 'in_progress': return 'bg-blue-500'
            case 'completed': return 'bg-green-500'
            default: return 'bg-gray-500'
        }
    }

    const formatDeadline = (deadline: string | null) => {
        if (!deadline) return 'No deadline set'
        try {
            const date = parseISO(deadline)
            return format(date, 'PPP p',)
        } catch (error) {
            console.error('Error parsing date:', error)
            return 'Invalid date'
        }
    }

    if (isLoading) return <div>Loading tasks...</div>
    if (isError) return <div>Error loading tasks</div>

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">My Tasks</h2>
            {myTasks?.data.map((task) => (
                <div key={task.id}>
                    <TaskEditor task={task} />
                </div>
            ))}
            {myTasks?.data.length === 0 && (
                <Card>
                    <CardContent className="flex items-center justify-center p-6">
                        <AlertCircle className="mr-2 h-4 w-4 opacity-70" />
                        <span className="text-sm text-muted-foreground">No tasks found</span>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default MyTasks