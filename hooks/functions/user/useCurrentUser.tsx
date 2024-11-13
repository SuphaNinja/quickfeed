import { User } from "@/lib/Types"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

// Custom hook to fetch current user data
export const useCurrentUser = () => {
    return useQuery<User, Error>({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const { data } = await api.get<User>('/user-routes/get-current-user')
            return data
        },
    })
}


// use like this
// const { data: user, isLoading, isError, error } = useCurrentUser()