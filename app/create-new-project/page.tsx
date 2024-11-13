'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useCreateProject } from '@/hooks/functions/useCreateProject'

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be 500 characters or less'),
  url: z.string().url('Invalid URL').min(1, 'URL is required')
})

type ProjectData = z.infer<typeof projectSchema>

export default function CreateNewProject() {
  const [isOpen, setIsOpen] = useState(false)
  const createProject = useCreateProject()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProjectData>({
    resolver: zodResolver(projectSchema)
  })

  const onSubmit = (data: ProjectData) => {
    createProject.mutate(data, {
      onSuccess: () => {
        setIsOpen(false)
        reset()
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create New Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Enter project title"
              aria-invalid={errors.title ? 'true' : 'false'}
            />
            {errors.title && (
              <p className="text-sm text-red-500" role="alert">{errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter project description"
              aria-invalid={errors.description ? 'true' : 'false'}
            />
            {errors.description && (
              <p className="text-sm text-red-500" role="alert">{errors.description.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              {...register('url')}
              placeholder="Enter project URL"
              aria-invalid={errors.url ? 'true' : 'false'}
            />
            {errors.url && (
              <p className="text-sm text-red-500" role="alert">{errors.url.message}</p>
            )}
          </div>
          <Button type="submit" disabled={createProject.isPending}>
            {createProject.isPending ? 'Creating...' : 'Create Project'}
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
              Project created successfully!
            </AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  )
}