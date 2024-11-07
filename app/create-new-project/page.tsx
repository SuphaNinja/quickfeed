'use client'

import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from 'next/navigation'
interface ProjectData {
    title: string
    description: string
    url: string
}

export default function CreateNewProject() {
    const [projectData, setProjectData] = useState<ProjectData>({
        title: '',
        description: '',
        url: ''
    })
    const [ isCreating, setIsCreating ] = useState(false)

    const router = useRouter()

    const createProject = useMutation({
        mutationFn: (data: ProjectData) => axios.post('/api/project-routes/create-project', data),
        onMutate: () => setIsCreating(true),
        onSettled: (data) => {
            setIsCreating(false)
            if(data?.data.id) {
                router.push(`/dashboard/${data.data.id}`)
            } else {
                router.push("/")
            }
        }
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setProjectData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        createProject.mutate(projectData)
    }

    return (
        <div className="max-w-md mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4">Create New Project</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        name="title"
                        value={projectData.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={projectData.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="url">URL</Label>
                    <Input
                        id="url"
                        name="url"
                        type="url"
                        value={projectData.url}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <Button type="submit" disabled={isCreating}>
                    {isCreating ? 'Creating...' : 'Create Project'}
                </Button>
            </form>
            {createProject.isError && (
                <Alert variant="destructive" className="mt-4">
                    <AlertDescription>
                        An error occurred while creating the project. Please try again.
                    </AlertDescription>
                </Alert>
            )}
            {createProject.isSuccess && (
                <Alert className="mt-4">
                    <AlertDescription>
                        Project created successfully! Redirecting...
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
}