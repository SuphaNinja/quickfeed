

import React from 'react'
import DashboardHeader from '../dashboard/DashboardHeader'
import FeedBackList from './FeedbackList'
import { ProjectRoom } from '@/lib/Types';

function Feedbacks({ projectRoom }: {projectRoom: ProjectRoom}) {
  return (
    <div className='md:px-24'>
      <DashboardHeader projectRoom={projectRoom}/>
      <FeedBackList projectRoomId={projectRoom.id}/>
    </div>
  )
}

export default Feedbacks;
