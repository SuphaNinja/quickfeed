'use client'

import React, { useState } from 'react'
import { ProjectRoom, ProjectRoomUser } from '@/lib/Types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { PlusCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'


export default function NewTaskButton({ projectRoom }: { projectRoom: ProjectRoom }) {
    const queryClient = useQueryClient()
    const users: ProjectRoomUser[] = projectRoom.users || []

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [priority, setPriority] = useState("")
    const [assigneeId, setAssigneeId] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)

    const createNewTask = useMutation({
        mutationFn: (taskData: {
            projectRoomId: string
            title: string
            description: string
            priority: string
            assigneeId: string
        }) => axios.post("/api/projectroom-routes/tasks/create-new-task", taskData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["myTasks", projectRoom.id] })
            queryClient.invalidateQueries({ queryKey: ["allTasks", projectRoom.id] })
            // Reset form fields and close modal
            setTitle("")
            setDescription("")
            setPriority("")
            setAssigneeId("")
            setIsModalOpen(false)
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        createNewTask.mutate({
            projectRoomId: projectRoom.id,
            title,
            description,
            priority,
            assigneeId,
        })
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Task
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-primary">Create New Task</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="space-y-4">
                        <Label htmlFor="title" className="text-sm font-medium text-gray-700">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full"
                        />
                    </div>
                    <div className="space-y-4">
                        <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="w-full"
                        />
                    </div>
                    <div className="space-y-4">
                        <Label htmlFor="priority" className="text-sm font-medium text-gray-700">Priority</Label>
                        <Select value={priority} onValueChange={setPriority} required>
                            <SelectTrigger id="priority">
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-4">
                        <Label htmlFor="assignee" className="text-sm font-medium text-gray-700">Assignee</Label>
                        <Select value={assigneeId} onValueChange={setAssigneeId} required>
                            <SelectTrigger id="assignee">
                                <SelectValue placeholder="Select assignee" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem key={user.id} value={user.id} className="flex items-center space-x-2 p-2">
                                        <Avatar className="h-6 w-6">
                                            {user.image && 
                                            <   AvatarImage src={user.image} alt={`${user.first_name} ${user.last_name}`} />
                                            }
                                                <AvatarFallback>{user.first_name[0]}{user.first_name[1]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{user.first_name} {user.last_name}</span>
                                            <span className="text-xs text-muted-foreground">{user.role}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" disabled={createNewTask.isPending} className="w-full">
                        {createNewTask.isPending ? "Creating..." : "Create Task"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}