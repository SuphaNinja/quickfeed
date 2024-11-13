import React from "react";
import DashboardHeader from "../../dashboard-header/DashboardHeader";
import Members from "./Members";
import LatestFeedbacks from "./LatestFeedbacks";
import { ProjectRoom } from "../../../lib/Types";

function DashboardPage({ projectRoom }: { projectRoom: ProjectRoom }) {
  const projectRoomId = projectRoom.id;
  return (
    <div className="md:px-10 mx-auto md:my-10 my-5 px-5">
      <DashboardHeader projectRoom={projectRoom} />
      <div className="grid lg:grid-cols-2 mt-12 grid-cols-1 gap-6">
        <div className="col-span-1">
          <Members projectRoom={projectRoom} />
        </div>
        <div className="col-span-1">
          <LatestFeedbacks projectRoomId={projectRoomId} />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
