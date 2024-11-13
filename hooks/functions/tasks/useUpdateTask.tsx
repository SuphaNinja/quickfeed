import { Task } from "@/lib/Types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

type UpdateTaskInput = {
    projectRoomId: string
    taskId: string
    title?: string
    description?: string
    deadline?: string
    priority?: string
    status?: string
}

type UpdateTaskResponse = {
    success: string
    task: Task
}

// Custom hook to update a task in a project room
export const useUpdateTask = () => {
    const queryClient = useQueryClient()

    return useMutation<UpdateTaskResponse, Error, UpdateTaskInput>({
        mutationFn: async (updateData) => {
            const { data } = await api.post<UpdateTaskResponse>('/projectroom-routes/tasks/edit-task', updateData)
            return data
        },
        onSuccess: (_, variables) => {
            // Invalidate and refetch queries that might be affected by this mutation
            queryClient.invalidateQueries({ queryKey: ['allTasks', variables.projectRoomId] })
            queryClient.invalidateQueries({ queryKey: ['myTasks', variables.projectRoomId] })
            queryClient.invalidateQueries({ queryKey: ['myTasks', variables.taskId] })
        },
    })
}

// use like this
// const updateTask = useUpdateTask()
// updateTask.mutate({
//     projectRoomId: 'project-room-id',
//     taskId: 'task-id',
//     title: 'Updated Title',
//     description: 'Updated Description',
//     deadline: '2023-12-31',
//     priority: 'high',
//     status: 'in-progress'
// })