import React from 'react'
import { ProjectRoom } from '../Types'
import DashboardHeader from '../dashboard/DashboardHeader'
import FeedBackList from './FeedbackList'

function Feedbacks({ projectRoom }: {projectRoom: ProjectRoom}) {
  return (
    <div className='md:px-24'>
      <DashboardHeader projectRoom={projectRoom}/>
      <FeedBackList projectRoomId={projectRoom.id}/>
    </div>
  )
}

export default Feedbacks