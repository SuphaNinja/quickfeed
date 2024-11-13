import { Task } from "@/lib/Types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

type CreateTaskInput = {
    projectRoomId: string
    title: string
    description: string
    priority: string
    assigneeId: string
}

type CreateTaskResponse = {
    success: string
}

// Custom hook to create a new task in a project room
export const useCreateTask = () => {
    const queryClient = useQueryClient()

    return useMutation<CreateTaskResponse, Error, CreateTaskInput>({
        mutationFn: async ({ projectRoomId, title, description, priority, assigneeId }) => {
            const { data } = await api.post<CreateTaskResponse>('/projectroom-routes/tasks/create-task', {
                projectRoomId,
                title,
                description,
                priority,
                assigneeId
            })
            return data
        },
        onSuccess: (_, variables) => {
            // Invalidate and refetch queries that might be affected by this mutation
            queryClient.invalidateQueries({ queryKey: ['allTasks', variables.projectRoomId] })
            queryClient.invalidateQueries({ queryKey: ['myTasks', variables.projectRoomId] })
        },
    })
}

// use like this
// const createTask = useCreateTask()
// createTask.mutate({ projectRoomId, title, description, priority, assigneeId })