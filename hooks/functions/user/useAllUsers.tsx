import { User } from '@/lib/Types'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type UsersResponse = {
    users: User[]
}

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

// Custom hook to fetch all users data
export const useAllUsers = () => {
    return useQuery<User[], Error>({
        queryKey: ['allUsers'],
        queryFn: async () => {
            const { data } = await api.get<UsersResponse>('/user-routes/get-all-users')
            return data.users
        },
    })
}

// use like this
// const { data: users, isLoading, isError, error } = useAllUsers()