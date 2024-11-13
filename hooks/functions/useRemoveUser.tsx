import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

type RemoveUserInput = {
    projectRoomId: string
    removeUserId: string
}

type RemoveUserResponse = {
    success: string
}

// Custom hook to remove a user from a project room
export const useRemoveUserFromProjectRoom = () => {
    const queryClient = useQueryClient()

    return useMutation<RemoveUserResponse, Error, RemoveUserInput>({
        mutationFn: async ({ projectRoomId, removeUserId }) => {
            const { data } = await api.post<RemoveUserResponse>('/projectroom-routes/dashboard/remove-user-from-projectroom', { projectRoomId, removeUserId })
            return data
        },
        onSuccess: (_, variables) => {
            // Invalidate and refetch queries that might be affected by this mutation
            queryClient.invalidateQueries({ queryKey: ['projectRoom', variables.projectRoomId] })
        },
    })
}

// use like this
// const removeUserFromProjectRoom = useRemoveUserFromProjectRoom()
// removeUserFromProjectRoom.mutate({ projectRoomId, removeUserId })