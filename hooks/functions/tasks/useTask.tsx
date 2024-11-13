import { Task, ProjectRoomUser } from "@/lib/Types"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

type TaskResponse = Task & {
    assignee: ProjectRoomUser;
    assignor: ProjectRoomUser;
}

// Custom hook to fetch a single task by its ID
export const useTask = (taskId: string) => {
    return useQuery<TaskResponse, Error>({
        queryKey: ['task', taskId],
        queryFn: async () => {
            const { data } = await api.get<TaskResponse>(`/projectroom-routes/tasks/get-task${taskId}`)
            return data
        },
        enabled: !!taskId,
    })
}

// use like this
// const { data: task, isLoading, isError, error } = useTask(taskId)