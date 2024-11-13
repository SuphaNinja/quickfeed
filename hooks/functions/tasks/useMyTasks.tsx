import { Task, ProjectRoomUser } from "@/lib/Types"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

type UserProjectTasksResponse = Task & {
    assignee: ProjectRoomUser;
    assignor: ProjectRoomUser;
}

// Custom hook to fetch tasks assigned to the current user in a specific project room
export const useMyTasks = (projectRoomId: string) => {
    return useQuery<UserProjectTasksResponse[], Error>({
        queryKey: ['myTasks', projectRoomId],
        queryFn: async () => {
            const { data } = await api.post<UserProjectTasksResponse[]>('/projectroom-routes/tasks/get-my-tasks', { projectRoomId })
            return data
        },
        enabled: !!projectRoomId,
    })
}

// use like this
// const { data: userTasks, isLoading, isError, error } = useUserProjectTasks(projectRoomId)