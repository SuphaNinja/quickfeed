"use client";

import Analysis from "@/components/dashboard-page/analysis/Analysis";
import Dashboard from "@/components/dashboard-page/dashboard/Dashboard";
import Feedbacks from "@/components/dashboard-page/feedbacks/Feedbacks";
import DashboardSidebar from "@/components/dashboard-page/Sidebar";
import Tasks from "@/components/dashboard-page/tasks/Tasks";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useProject } from "@/hooks/functions/useProject";

function DashboardPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const {
    data: projectRoom,
    isError,
    isSuccess,
    isLoading,
  } = useProject(params.roomId as string);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isSuccess) {
    const pages = [
      {
        name: "Dashboard",
        component: <Dashboard projectRoom={projectRoom} />,
      },
      {
        name: "Feedbacks",
        component: <Feedbacks projectRoom={projectRoom} />,
      },
      {
        name: "Analysis",
        component: <Analysis projectRoom={projectRoom} />,
      },
      {
        name: "Tasks",
        component: <Tasks projectRoom={projectRoom} />,
      },
    ];

    return (
      <div>
        <div className="flex w-full h-screen">
          <div className="hidden md:block">
            <DashboardSidebar
              setActiveTab={setActiveTab}
              projectRoom={projectRoom}
            />
          </div>
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:hidden">
              <DashboardSidebar
                setActiveTab={setActiveTab}
                projectRoom={projectRoom}
              />
            </div>
            {pages.find((page) => page.name === activeTab)?.component}
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardPage;
