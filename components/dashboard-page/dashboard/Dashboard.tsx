import React from "react";
import DashboardHeader from "./DashboardHeader";
import Members from "./Members";
import Feedbacks from "./feedbacks/Feedbacks";
import TopVotedFeedbacks from "./TopVotedFeedbacks";
import { ProjectRoom } from "../../../lib/Types";

function Dashboard({ projectRoom }: { projectRoom: ProjectRoom }) {
  const projectRoomId = projectRoom.id;
  return (
<<<<<<< HEAD
    <div className=" md:px-24">
=======
    <div className='md:px-24'>
>>>>>>> 371113b24ccb19f7703ed6638c4d3bf1cf17a05d
      <DashboardHeader projectRoom={projectRoom} />
      <div className="grid md:grid-cols-2 mt-12 grid-cols-1 gap-6">
        <div className="col-span-1">
          <Members projectRoom={projectRoom} />
          <TopVotedFeedbacks projectRoomId={projectRoomId} />
        </div>
        <div className="col-span-1">
          <Feedbacks projectRoomId={projectRoomId} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
