"use client";
import Analysis from "@/components/dashboard-pages/analysis/AnalysisPage";
import Dashboard from "@/components/dashboard-pages/dashboard/DashboardPage";
import DashboardSidebar from "@/components/Sidebar";
import FeedbacksPage from "@/components/dashboard-pages/feedbacks/FeedbacksPage";
import Tasks from "@/components/dashboard-pages/tasks/TasksPage";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useProject } from "@/hooks/functions/useProject";

function DashboardPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedTab = localStorage.getItem('activeTab')
      return storedTab || "Dashboard"
    }
    return "Dashboard"
  })
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab)
  }, [activeTab])
  
  const {
    data: projectRoom,
    isError,
    isSuccess,
    isLoading,
  } = useProject(params.roomId as string);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <Loader2  className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <p className="text-2xl text-red-700">Something went wrong</p>
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
        component: <FeedbacksPage projectRoom={projectRoom} />,
      },
      {
        name: "Analysis",
        component: <Analysis  projectRoom={projectRoom} />,
      },
      {
        name: "Tasks",
        component: <Tasks projectRoom={projectRoom} />,
      },
    ];

    return (
        <div className="flex w-full h-screen">
          <div className="hidden md:block">
            <DashboardSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              projectRoom={projectRoom}
            />
          </div>
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:hidden">
              <DashboardSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                projectRoom={projectRoom}
              />
            </div>
            {pages.find((page) => page.name === activeTab)?.component}
          </div>
        </div>
    );
  }
}

export default DashboardPage;
