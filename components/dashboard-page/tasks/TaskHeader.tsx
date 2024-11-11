"use client"
import { ProjectRoom, ProjectRoomUser } from '@/lib/Types'
import { useAuth } from '@clerk/nextjs'

import NewTaskButton from './NewTaskButton'

function TaskHeader({ projectRoom }: { projectRoom: ProjectRoom }) {
    const { userId } = useAuth();
    const users: ProjectRoomUser[] = projectRoom.users || [];

    const isUserAdmin = (userId: string, users: ProjectRoomUser[]): boolean => {
        const user = users.find(user => user.userId === userId)
        return user?.role === 'admin'
    }

    return (
        <header className="">
            <div className="px-6 pb-12 pt-6 flex justify-between items-center">
                <h1 className='text-4xl'>{projectRoom.title}</h1>
                {isUserAdmin(userId!, users) && (
                    <NewTaskButton projectRoom={projectRoom}/>
                )}
            </div>
        </header>
    )
}

export default TaskHeader