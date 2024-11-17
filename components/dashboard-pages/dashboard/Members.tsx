'use client'

import React, { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useAuth } from "@clerk/nextjs"
import { useUser } from "@clerk/nextjs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ProjectRoomUser = {
  id: string
  userId: string
  first_name: string
  last_name: string
  email: string
  image?: string
  role?: string
}
type ProjectRoom = {
  id: string
  users: any
}

export default function Members({ projectRoom }: { projectRoom: ProjectRoom }) {
  const queryClient = useQueryClient()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { userId } = useAuth()
  const users: ProjectRoomUser[] = projectRoom.users || []

  const isUserAdmin = (userId: string, users: ProjectRoomUser[]): boolean => {
    const user = users.find((user) => user.userId === userId)
    return user?.role === "admin"
  }

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-emerald-500/10 text-emerald-500"
      case "developer":
        return "bg-emerald-500/10 text-emerald-500"
      case "marketing":
        return "bg-pink-500/10 text-pink-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  const getInitials = (first_name: string, last_name: string) => {
    return `${first_name[0] || ""}${last_name[0] || ""}`.toUpperCase()
  }

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const inviteUserMutation = useMutation({
    mutationFn: (email: string) =>
      axios.post("/api/projectroom-routes/dashboard/add-user-to-projectroom", {
        email,
        projectRoomId: projectRoom.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projectRoom", projectRoom.id],
      })
      setIsDialogOpen(false)
      setEmail("")
    },
    onError: (error: any) => {
      setError(
        error.response?.data?.error ||
          "An error occurred while inviting the user."
      )
    },
  })

  const deleteUserFromProject = useMutation({
    mutationFn: (removeUserId: string) =>
      axios.post(
        "/api/projectroom-routes/dashboard/remove-user-from-projectroom",
        { projectRoomId: projectRoom.id, removeUserId }
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["projectRoom", projectRoom.id],
      }),
  })

  const changeRoleOfUser = useMutation({
    mutationFn: ({ email, role }: { email: string; role: string }) =>
      axios.post("/api/projectroom-routes/dashboard/change-role-of-user", {
        projectRoomId: projectRoom.id,
        email,
        role,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projectRoom", projectRoom.id],
      })
    },
  })

  const handleRoleChange = (email: string, newRole: string) => {
    changeRoleOfUser.mutate({ email, role: newRole })
  }

  const handleInvite = () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.")
      return
    }
    inviteUserMutation.mutate(email)
  }

  const handleDeleteUser = (removeUserId: string) => {
    deleteUserFromProject.mutate(removeUserId)
  }

  return (
    <div className=" p-6 border border-[#141414] rounded-lg w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl my-2 flex items-center gap-2">
          Members{" "}
          <span role="img" aria-label="members">
            🚀
          </span>
        </h2>
        {userId && isUserAdmin(userId, users) && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Invite new member</DialogTitle>
                <DialogDescription>
                  Enter the email address of the person you&apos;d like to invite to this project.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  type="email"
                  placeholder="Enter email to invite"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError("")
                  }}
                />
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
              <DialogFooter>
                <Button onClick={handleInvite} disabled={inviteUserMutation.isPending}>
                  {inviteUserMutation.isPending ? "Inviting..." : "Send Invite"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-3 min-h-44 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center border border-neutral-900 gap-3 p-2 rounded-lg"
          >
            <Avatar className="h-8 w-8 bg-zinc-800">
              <AvatarImage
                src={user.image || undefined}
                alt={`${user.first_name} ${user.last_name}`}
              />
              <AvatarFallback className="text-sm">
                {getInitials(user.first_name, user.last_name)}
              </AvatarFallback>
            </Avatar>
            <span className="flex-1 text-sm">
              {user.first_name} {user.last_name}
            </span>
            {userId && user.role && !isUserAdmin(userId, users) ? (
              <Badge
                variant="secondary"
                className={`${getRoleColor(user.role)} border-0`}
              >
                {user.role}
              </Badge>
            ) : null}
            {userId && isUserAdmin(userId, users) && user.userId !== userId && (
              <>
                <Select
                  value={user.role || ""}
                  onValueChange={(newRole) =>
                    handleRoleChange(user.email, newRole)
                  }
                  disabled={changeRoleOfUser.isPending}
                >
                  <SelectTrigger
                    className={`w-[100px] h-6 px-2.5 border-0 ${getRoleColor(
                      user.role || ""
                    )} hover:bg-opacity-80`}
                  >
                    <SelectValue
                      placeholder="Select role"
                      className="text-xs font-medium"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin" className="text-xs">
                      Admin
                    </SelectItem>
                    <SelectItem value="user" className="text-xs">
                      User
                    </SelectItem>
                  </SelectContent>
                </Select>
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
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}