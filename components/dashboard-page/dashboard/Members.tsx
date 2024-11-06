import React from 'react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserPlus } from "lucide-react"

interface DashboardHeaderProps {
    projectRoom: any;
}

function Members({ projectRoom }: DashboardHeaderProps) {
    const users = projectRoom?.data?.users || [];

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

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    }

    return (
        <div className="border p-6 border-neutral-900  rounded-lg  w-2xl">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    Members <span role="img" aria-label="members">🥳</span>
                </h2>
                <div className="flex items-center gap-2">
                    <Button size="sm">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Invite
                    </Button>
                </div>
            </div>

            <div className="space-y-3 min-h-44 overflow-y-auto">
                {users.map((user, index) => (
                    <div
                        key={index}
                        className="flex items-center border border-neutral-900 gap-3 p-2 rounded-lg "
                    >
                        <Avatar className="h-8 w-8 bg-zinc-800">
                            <AvatarFallback className="text-sm">
                                {getInitials(user.fullName[0], user.fullName[1])}
                            </AvatarFallback>
                        </Avatar>
                        <span className="flex-1 text-sm">
                            {user.fullName}
                        </span>
                        {user.role && (
                            <Badge variant="secondary" className={`${getRoleColor(user.role)} border-0`}>
                                {user.role}
                            </Badge>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Members