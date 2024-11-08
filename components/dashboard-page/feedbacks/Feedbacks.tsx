<<<<<<< HEAD
import React from 'react'
import DashboardHeader from "../dashboard/DashboardHeader"
=======

import React from 'react'
import { ProjectRoom } from '@/lib/Types'
import DashboardHeader from '../dashboard/DashboardHeader'
>>>>>>> a2e71b58b4e6a3dde5f0bcc014492095540a110a
import FeedBackList from './FeedbackList'
import { ProjectRoom } from '@/lib/Types';

function Feedbacks({ projectRoom }: {projectRoom: ProjectRoom}) {
  return (
    <div className='md:px-24'>
      <DashboardHeader projectRoom={projectRoom}/>
      <FeedBackList projectRoomId={projectRoom.id}/>
    </div>
  )
<<<<<<< HEAD

=======
>>>>>>> a2e71b58b4e6a3dde5f0bcc014492095540a110a
}

export default Feedbacks;
