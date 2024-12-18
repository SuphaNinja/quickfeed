'use client'

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios, { AxiosError } from "axios";
import { useAuth } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useInviteUser } from "@/hooks/functions/useInviteUser";
import { useChangeUserRole } from "../../../hooks/functions/useChangeUserRole";
import { useRemoveUser } from "@/hooks/functions/useRemoveUser";

interface InviteUserParams {
  projectRoomId: string
  email: string
}


type ProjectRoomUser = {
  id: string;
  userId: string;
  first_name: string;
  last_name: string;
  email: string;
  image?: string;
  role?: string;
};
type ProjectRoom = {
  id: string;
  users: any;
};

const getRoleColor = (role: string) => {
  switch (role?.toLowerCase()) {
    case "admin":
      return "bg-emerald-500/10 text-emerald-500";
    case "developer":
      return "bg-pink-500/10 text-pink-500";
    case "marketing":
      return "bg-pink-500/10 text-pink-500";
    default:
      return "bg-gray-500/10 text-gray-500";
  }
};

export default function Members({ projectRoom }: { projectRoom: ProjectRoom }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [users, setUsers] = useState<ProjectRoomUser[]>(projectRoom.users || []);
  const changeUserRole = useChangeUserRole();
  const removeUser = useRemoveUser();
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  const isUserAdmin = (userId: string, users: ProjectRoomUser[]): boolean => {
    const user = users.find((user) => user.userId === userId);
    return user?.role === "admin";
  };

  const getInitials = (first_name: string, last_name: string) => {
    return `${first_name[0] || ""}${last_name[0] || ""}`.toUpperCase();
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const inviteUser = useMutation<ProjectRoomUser, AxiosError, InviteUserParams>({
    mutationFn: ({ projectRoomId, email }) => {
      return axios.post('/api/projectroom-routes/dashboard/add-user-to-projectroom', {
        projectRoomId,
        email,
      })
        .then(response => response.data)
    },
    onSuccess: (data) => {
      setIsDialogOpen(false)
      setUsers(prevUsers => [...prevUsers, data])
      setEmail('')
      queryClient.invalidateQueries({ queryKey: ['projectRoom', projectRoom.id] })
    },
  })

  const handleDeleteUser = (removeUserId: string) => {
      setUsers(users.filter((user) => user.userId !== removeUserId));
      removeUser.mutate({ projectRoomId: projectRoom.id, removeUserId });
  };

  const handleRoleChange = async (email: string, role: string) => {
    setUsers(prevUsers =>prevUsers.map(user => user.email === email ? { ...user, role } : user ))
    changeUserRole.mutate({ projectRoomId: projectRoom.id , email, role })
  };

  const handleInvite = () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.")
      return
    }
    inviteUser.mutate({projectRoomId: projectRoom.id, email: email})
  }

  return (
    <div className="p-6 border border-[#141414] rounded-lg w-2xl min-h-[calc(100dvh-200px)] max-h-[calc(100dvh-200px)] overflow-y-auto custom-scrollbar">
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
                    setEmail(e.target.value);
                    setError("");
                  }}
                />
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
              <DialogFooter>
                <Button onClick={handleInvite} disabled={inviteUser.isPending}>
                  {inviteUser.isPending ? "Inviting..." : "Send Invite"}
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
                  disabled={inviteUser.isPending}
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
                    <SelectItem value="developer" className="text-xs">
                      Developer
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteUser(user.userId)}
                  disabled={inviteUser.isPending}
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
  );
}

