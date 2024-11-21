import { ProjectRoom } from '@/lib/Types'
import React from 'react'
import Members from '../dashboard/Members'
import DashboardHeader from '@/components/dashboard-header/DashboardHeader'

export default function TeamPage({projectRoom}: {projectRoom: ProjectRoom}) {
  return (
    <div className='md:px-10 mx-auto md:my-10 h-full min-h-[calc(100dvh-100px)] overflow-auto my-5 px-5 flex flex-col gap-6'>
        <DashboardHeader projectRoom={projectRoom} />
      <Members projectRoom={projectRoom} />
    </div>
  )
}
