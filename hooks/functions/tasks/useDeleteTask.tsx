import { Task } from "@/lib/Types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

type DeleteTaskInput = {
    taskId: string
    projectRoomId: string
}

// Custom hook to delete a task
export const useDeleteTask = () => {
    const queryClient = useQueryClient()

    return useMutation<{ success: string }, Error, DeleteTaskInput>({
        mutationFn: async ({ taskId, projectRoomId }) => {
            const { data } = await api.post<{ success: string }>('/projectroom-routes/dashboard/delete-task', { taskId, projectRoomId })
            return data
        },
        onSuccess: (_, variables) => {
            // Invalidate and refetch queries that might be affected by this mutation
            queryClient.invalidateQueries({ queryKey: ['myTasks', variables.projectRoomId] })
            queryClient.invalidateQueries({ queryKey: ['allTasks', variables.projectRoomId] })
            queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] })
        },
    })
}

// use like this
// const deleteTask = useDeleteTask()
// deleteTask.mutate({ taskId: 'task-id', projectRoomId: 'project-room-id' })