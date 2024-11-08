'use client'

import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

interface TaskEditorProps {
  task: {
    id: string
    title: string
    description: string
    deadline: string
    priority: 'low' | 'medium' | 'high'
    status: 'todo' | 'in_progress' | 'completed'
  }
}

export default function TaskEditor({ task }: TaskEditorProps) {
  const params = useParams()
  const queryClient = useQueryClient()
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  // const [deadline, setDeadline] = useState(task.deadline.split('T')[0]) // Format date for input
  const [priority, setPriority] = useState(task.priority)
  const [status, setStatus] = useState(task.status)

  const updateTask = useMutation({
    mutationFn: (updatedTask: Partial<TaskEditorProps['task']>) => 
      axios.post("/api/projectroom-routes/tasks/edit-task", {
        projectRoomId: params.roomId,
        taskId: task.id,
        ...updatedTask
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', params.roomId] })
      toast({
        title: "Task updated",
        description: "Your task has been successfully updated.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error updating the task. Please try again.",
        variant: "destructive",
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedFields: Partial<TaskEditorProps['task']> = {}
    if (title !== task.title) updatedFields.title = title
    if (description !== task.description) updatedFields.description = description
    // if (deadline !== task.deadline.split('T')[0]) updatedFields.deadline = new Date(deadline).toISOString()
    if (priority !== task.priority) updatedFields.priority = priority
    if (status !== task.status) updatedFields.status = status

    if (Object.keys(updatedFields).length > 0) {
      updateTask.mutate(updatedFields)
    } else {
      toast({
        title: "No changes",
        description: "No changes were made to the task.",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Task</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
           
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
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
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={updateTask.isPending}>
            {updateTask.isPending ? "Updating..." : "Update Task"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}