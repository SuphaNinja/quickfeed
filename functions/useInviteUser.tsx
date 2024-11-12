import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

type InviteUserInput = {
    projectRoomId: string
    email: string
}

type InviteUserResponse = {
    success: string
}

// Custom hook to invite a user to a project room
export const useInviteUser = () => {
    const queryClient = useQueryClient()

    return useMutation<InviteUserResponse, Error, InviteUserInput>({
        mutationFn: async ({ projectRoomId, email }) => {
            const { data } = await api.post<InviteUserResponse>('/projectroom-routes/dashboard/add-user-to-projectroom', { projectRoomId, email })
            return data
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['projectRoom', variables.projectRoomId] })
        },
    })
}

// use like this
// const inviteUser = useInviteUser()
// inviteUser.mutate({ projectRoomId, email })
