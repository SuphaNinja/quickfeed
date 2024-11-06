"use client"

import Analysis from '@/components/dashboard-page/analysis/Analysis';
import Dashboard from '@/components/dashboard-page/dashboard/Dashboard';
import Feedbacks from '@/components/dashboard-page/feedbacks/Feedbacks';
import DashboardSidebar from '@/components/dashboard-page/Sidebar'
import Tasks from '@/components/dashboard-page/tasks/Tasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation'
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface ProjectFormValues {
    title: string;
    url: string;
    description: string;
}

function DashboardPage() {
    const params = useParams();
    const queryClient = useQueryClient()
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ProjectFormValues>()
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [isCreatingProject, setIsCreatingProject] = useState(false)

    const { data: projectRoom, isLoading } = useQuery({
        queryKey: ["projectRoom", params.roomId],
        queryFn: () => axios.get(`/api/projectroom-routes/get-projectroom-by-id/${params.roomId}`, {
            headers: { "x-access-token": token }
        }),
        enabled: !!token,
        retry: 2,
        retryDelay: 500,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })

    const createProject = useMutation({
        mutationFn: (data: ProjectFormValues) => axios.post("/api/project-routes/create-project", data, {
            headers: { "x-access-token": token }
        }),
        onMutate: () => setIsCreatingProject(true),
        onSuccess: () => {
            reset()
        },
        onSettled: () => setIsCreatingProject(false)
    })

    const onSubmit = (data: ProjectFormValues) => {
        createProject.mutate(data)
    }

    if (isLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div>
            {!projectRoom && !isLoading ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <header className="flex items-center justify-between mt-5">
                        <h1 className="md:text-3xl text-2xl text-white">
                            Create New Project <span className="wave">🚀</span>
                        </h1>
                    </header>

                    <div className="space-y-2">
                        <Label htmlFor="title">Project Title</Label>
                        <Input
                            id="title"
                            {...register("title", { required: "Project title is required" })}
                            placeholder="Enter project title"
                            className="bg-gray-800 text-white border-gray-700"
                        />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="url">Project URL</Label>
                        <Input
                            id="url"
                            {...register("url", {
                                required: "Project URL is required",
                                pattern: {
                                    value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                                    message: "Please enter a valid URL"
                                }
                            })}
                            placeholder="https://example.com"
                            className="bg-gray-800 text-white border-gray-700"
                        />
                        {errors.url && <p className="text-red-500 text-sm">{errors.url.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Project Description</Label>
                        <Textarea
                            id="description"
                            {...register("description", { required: "Project description is required" })}
                            placeholder="Enter project description"
                            className="bg-gray-800 text-white border-gray-700 min-h-[100px]"
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                        disabled={isCreatingProject}
                    >
                        {isCreatingProject ? "Creating..." : "Create Project"}
                    </Button>
                </form>
            ) : (
                <div className="flex w-full h-screen">
                    <div className='hidden md:block'>
                        <DashboardSidebar setActiveTab={setActiveTab} projectRoom={projectRoom} />
                    </div>
                    <div className="flex-1 overflow-auto">
                        <div className="p-4 md:hidden">
                            <DashboardSidebar setActiveTab={setActiveTab} projectRoom={projectRoom} />
                        </div>
                        {activeTab === "Dashboard" && (
                            <Dashboard projectRoom={projectRoom} />
                        )}
                        {activeTab === "Feedbacks" && (
                            <Feedbacks projectRoom={projectRoom} />
                        )}
                        {activeTab === "Analysis" && (
                            <Analysis analyses={projectRoom?.data.analyses} />
                        )}
                        {activeTab === "Tasks" && (
                            <Tasks projectRoom={projectRoom} />
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default DashboardPage