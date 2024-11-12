import { ProjectRoom } from "@/lib/Types"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

type CreateProjectRoomInput = {
    title: string
    description: string
    url: string
}

// Custom hook to create a new project room
export const useCreateProject = () => {

    return useMutation<ProjectRoom, Error, CreateProjectRoomInput>({
        mutationFn: async (newProjectRoom) => {
            const { data } = await api.post<ProjectRoom>('/project-routes/create-project', newProjectRoom)
            return data
        },
    })
}

// use like this
// const createProject = useCreateProject()
// createProject.mutate({ title: 'New Project', description: 'Project description', url: 'https://example.com' })