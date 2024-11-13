

import React from 'react'
import DashboardHeader from '../dashboard/DashboardHeader'
import { ProjectRoom } from '@/lib/Types';

function Feedbacks({ projectRoom }: {projectRoom: ProjectRoom}) {
  return (
    <div className='md:px-24'>
      <DashboardHeader projectRoom={projectRoom}/>
    </div>
  )
}

export default Feedbacks;
