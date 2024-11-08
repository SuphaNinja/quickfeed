<<<<<<< HEAD
import React from "react";
import { ProjectRoom } from "../../../lib/Types";

function Feedbacks({ projectRoom }: { projectRoom: ProjectRoom }) {
  return <div>Feedbacks</div>;
=======
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
>>>>>>> 371113b24ccb19f7703ed6638c4d3bf1cf17a05d
}

export default Feedbacks;
