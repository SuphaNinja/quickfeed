"use client"

import Analysis from '@/components/dashboard-page/analysis/Analysis';
import Dashboard from '@/components/dashboard-page/dashboard/Dashboard';
import Feedbacks from '@/components/dashboard-page/feedbacks/Feedbacks';
import DashboardSidebar from '@/components/dashboard-page/Sidebar'
import Tasks from '@/components/dashboard-page/tasks/Tasks';
import {  useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation'
import { useState } from 'react';

interface ProjectFormValues {
    title: string;
    url: string;
    description: string;
}

function DashboardPage() {
    const params = useParams();
    const queryClient = useQueryClient()
    const [activeTab, setActiveTab] = useState('Dashboard');
    const { data: projectRoom, isLoading } = useQuery({
        queryKey: ["projectRoom", params.roomId],
        queryFn: () => axios.get(`/api/projectroom-routes/get-projectroom-by-id/${params.roomId}`, {
        }),
        enabled: !!params.roomId
    })
    
    if (isLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }
    
    return (
        <div>
            <div className="flex w-full h-screen">
                <div className='hidden md:block'>
                    <DashboardSidebar setActiveTab={setActiveTab} projectRoom={projectRoom} />
                </div>
                <div className="flex-1 overflow-auto">
                    <div className="p-4 md:hidden">
                        <DashboardSidebar setActiveTab={setActiveTab} projectRoom={projectRoom} />
                    </div>
                    {activeTab === "Dashboard" && (
                        <Dashboard projectRoom={projectRoom?.data} />
                    )}
                    {activeTab === "Feedbacks" && (
                        <Feedbacks projectRoom={projectRoom?.data} />
                    )}
                    {activeTab === "Analysis" && (
                        <Analysis projectRoom={projectRoom?.data} />
                    )}
                    {activeTab === "Tasks" && (
                        <Tasks projectRoom={projectRoom?.data} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default DashboardPage