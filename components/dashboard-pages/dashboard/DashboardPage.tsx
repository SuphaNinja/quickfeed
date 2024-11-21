import React from "react";
import DashboardHeader from "../../dashboard-header/DashboardHeader";
import Members from "./Members";
import LatestFeedbacks from "./LatestFeedbacks";
import { ProjectRoom } from "../../../lib/Types";
import FeedbackPieChart from "../analysis/FeedbackPieChart";

function DashboardPage({ projectRoom }: { projectRoom: ProjectRoom }) {
  const projectRoomId = projectRoom.id;
  return (
    <div className="md:px-10 mx-auto md:my-10 h-full min-h-[calc(100dvh-100px)] overflow-auto my-5 px-5">
      <DashboardHeader projectRoom={projectRoom} />
      <div className="grid lg:grid-cols-2 mt-12 grid-cols-1 gap-6">
        <div className="col-span-1 flex flex-col gap-6">
          <Members projectRoom={projectRoom} />
          <FeedbackPieChart projectRoom={projectRoom} />
        </div>
        <div className="col-span-1 h-full">
          <LatestFeedbacks projectRoomId={projectRoomId} />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
