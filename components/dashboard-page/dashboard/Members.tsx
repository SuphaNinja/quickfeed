import React, { useState } from 'react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Trash2 } from "lucide-react"

import { ProjectRoom, ProjectRoomUser } from '../Types'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useAuth } from '@clerk/nextjs'



function Members({ projectRoom }: { projectRoom: ProjectRoom} ) {
    const queryClient = useQueryClient()
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')

    const { userId } = useAuth()
    const users: ProjectRoomUser[] = projectRoom.users || []

    const isUserAdmin = (userId: string, users: ProjectRoomUser[]): boolean => {
        const user = users.find(user => user.userId === userId)
        return user?.role === 'admin'
    }

    const getRoleColor = (role: string) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return 'bg-emerald-500/10 text-emerald-500';
            case 'developer':
                return 'bg-emerald-500/10 text-emerald-500';
            case 'marketing':
                return 'bg-pink-500/10 text-pink-500';
            default:
                return 'bg-gray-500/10 text-gray-500';
        }
    }
    const getInitials = (first_name: string, last_name: string) => {
        return `${first_name[0] || ''}${last_name[1] || ''}`.toUpperCase();
    }
    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(email)
    }

    const inviteUserMutation = useMutation({
        mutationFn: (email: string) => axios.post('/api/projectroom-routes/add-user-to-projectroom', { email, projectRoomId: projectRoom.id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projectRoom', projectRoom.id]})
            setEmail('')
            setError('')
        },
        onError: (error: any) => {
            setError(error.response?.data?.error || 'An error occurred while inviting the user.')
        },
    })

    const deleteUserFromProject = useMutation({
        mutationFn: (removeUserId: string) => axios.post("/api/projectroom-routes/remove-user-from-projectroom", { projectRoomId: projectRoom.id, removeUserId }),
    })

    const handleInvite = () => {
        if (!validateEmail(email)) {
            setError('Please enter a valid email address.')
            return
        }
        inviteUserMutation.mutate(email)
    }

    const handleDeleteUser = (removeUserId: string) => {
        deleteUserFromProject.mutate(removeUserId)
    }

    return (
        <div className="border p-6 border-neutral-900 rounded-lg w-2xl">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    Members <span role="img" aria-label="members">🥳</span>
                </h2>
                {userId && isUserAdmin(userId, users) && (
                    <div className="flex items-center gap-2">
                        <Input
                            type="email"
                            placeholder="Enter email to invite"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="max-w-xs"
                        />
                        <Button size="sm" onClick={handleInvite} disabled={inviteUserMutation.isPending}>
                            <UserPlus className="w-4 h-4 mr-2" />
                            {inviteUserMutation.isPending ? 'Inviting...' : 'Invite'}
                        </Button>
                    </div>
                )}
            </div>

            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-3 min-h-44 overflow-y-auto">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="flex items-center border border-neutral-900 gap-3 p-2 rounded-lg"
                    >
                        <Avatar className="h-8 w-8 bg-zinc-800">
                            <AvatarFallback className="text-sm">
                                {getInitials(user.first_name, user.last_name)}
                            </AvatarFallback>
                        </Avatar>
                        <span className="flex-1 text-sm">
                            {user.first_name} {user.last_name}
                        </span>
                        {user.role && (
                            <Badge variant="secondary" className={`${getRoleColor(user.role)} border-0`}>
                                {user.role}
                            </Badge>
                        )}
                        {userId && isUserAdmin(userId, users) && user.userId !== userId && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDeleteUser(user.userId)}
                                disabled={deleteUserFromProject.isPending}
                                aria-label={`Delete ${user.first_name} ${user.last_name}`}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Members