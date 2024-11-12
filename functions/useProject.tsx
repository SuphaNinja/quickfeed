import { ProjectRoom } from "@/lib/Types"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

// Custom hook to fetch a project room by ID
export const useProject = (id: string) => {
    return useQuery<ProjectRoom, Error>({
        queryKey: ['projectRoom', id],
        queryFn: async () => {
            const { data } = await api.get<ProjectRoom>(`/projectroom-routes/get-projectroom-by-id/${id}`)
            return data
        },
        enabled: !!id,
    })
}

// use like this
// const { data: projectRoom, isLoading, isError, error } = useProject(projectRoomId)