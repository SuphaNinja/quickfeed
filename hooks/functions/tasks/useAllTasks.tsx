import { Task, ProjectRoomUser } from "@/lib/Types"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

type ProjectTasksResponse = Task & {
    assignee: ProjectRoomUser;
    assignor: ProjectRoomUser;
}

// Custom hook to fetch tasks for a specific project room
export const useAllTasks = (projectRoomId: string) => {
    return useQuery<ProjectTasksResponse[], Error>({
        queryKey: ['allTasks', projectRoomId],
        queryFn: async () => {
            const { data } = await api.post<ProjectTasksResponse[]>('/projectroom-routes/tasks/get-all-tasks', { projectRoomId })
            return data
        },
        enabled: !!projectRoomId,
    })
}

// use like this
// const { data: tasks, isLoading, isError, error } = useProjectTasks(projectRoomId)