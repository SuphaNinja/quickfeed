import { ProjectRoomUser } from "@/lib/Types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

type ChangeRoleInput = {
    projectRoomId: string
    email: string
    role: string
}

type ChangeRoleResponse = {
    success: string
}

// Custom hook to change a user's role in a project room
export const useChangeUserRole = () => {
    const queryClient = useQueryClient()

    return useMutation<ChangeRoleResponse, Error, ChangeRoleInput>({
        mutationFn: async ({ projectRoomId, email, role }) => {
            const { data } = await api.post<ChangeRoleResponse>('/projectroom-routes/dashboard/change-role-of-user', { projectRoomId, email, role })
            return data
        },
        onSuccess: (_, variables) => {
            // Invalidate and refetch queries that might be affected by this mutation
            queryClient.invalidateQueries({ queryKey: ['projectRoom', variables.projectRoomId] })
        },
    })
}

// use like this
// const changeUserRole = useChangeUserRole()
// changeUserRole.mutate({ projectRoomId, email, role })