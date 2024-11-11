"use client";

import { ProjectRoom, ProjectRoomUser } from '@/lib/Types'
import MyTasks from './MyTasks'
import AllTasks from './AllTasks';
import TaskHeader from './TaskHeader';
import { useAuth } from '@clerk/nextjs';
import { useProject } from '@/contexts/ProjectRoomContext';

function Tasks({ projectRoom }: { projectRoom: ProjectRoom }) {
  const { userId } = useAuth();
  const users: ProjectRoomUser[] = projectRoom.users || [];

  const isUserAdmin = (userId: string, users: ProjectRoomUser[]): boolean => {
    const user = users.find(user => user.userId === userId)
    return user?.role === 'admin'
  }


  
  return (
    <div className="md:mx-24 mx-6">
      <TaskHeader projectRoom={projectRoom} />
      <div className='flex lg:flex-row flex-col gap-8 h-[calc(100vh-100px)]'>
        <div className='lg:w-1/2 w-full'>
          <MyTasks isAdmin={isUserAdmin(userId!, users)} />
        </div>
        <div className='lg:w-1/2 w-full'>
          <AllTasks isAdmin={isUserAdmin(userId!, users)} />
        </div>
      </div>
    </div>
  );
}

export default Tasks;
