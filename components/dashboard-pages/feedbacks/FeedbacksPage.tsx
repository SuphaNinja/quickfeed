import React from "react";
import DashboardHeader from "../../dashboard-header/DashboardHeader";
import Feedbacks from "../../feedbacks/Feedbacks";
import { ProjectRoom } from "@/lib/Types";

function FeedbacksPage({ projectRoom }: { projectRoom: ProjectRoom }) {
  return (
    <div className="md:px-10 mx-auto md:my-10 my-5 px-5 ">
      <DashboardHeader projectRoom={projectRoom} />
      <Feedbacks projectRoomId={projectRoom.id} />
    </div>
  );
}

export default FeedbacksPage;
