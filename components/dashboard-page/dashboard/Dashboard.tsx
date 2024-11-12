import React from "react";
import DashboardHeader from "./DashboardHeader";
import Members from "./Members";
import Feedbacks from "./feedbacks/Feedbacks";
import CodeImplementation from "./CodeImplementation";
import { ProjectRoom } from "../../../lib/Types";

function Dashboard({ projectRoom }: { projectRoom: ProjectRoom }) {
  const projectRoomId = projectRoom.id;
  return (

    <div className='md:px-10 mx-auto'>
      <DashboardHeader projectRoom={projectRoom} />
      <div className="grid lg:grid-cols-2 mt-12 grid-cols-1 gap-6">
        <div className="col-span-1">
          <Members projectRoom={projectRoom} />
          <CodeImplementation />
        </div>
        <div className="col-span-1">
          <Feedbacks projectRoomId={projectRoomId} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
