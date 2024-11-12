import { Feedback } from "@/lib/Types"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

// Custom hook to fetch feedbacks for a specific project room
export const useFeedbacks = (projectRoomId: string) => {
    return useQuery<Feedback[], Error>({
        queryKey: ['feedbacks', projectRoomId],
        queryFn: async () => {
            const { data } = await api.post<{ feedbacks: Feedback[] }>('/projectroom-routes/feedbacks/get-all-feedbacks', { projectRoomId })
            return data.feedbacks
        },
        enabled: !!projectRoomId,
    })
}

// use like this
// const { data: feedbacks, isLoading, isError, error } = useFeedbacks(projectRoomId)