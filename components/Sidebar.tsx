'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LayoutDashboard, MessageSquare, BarChart, CheckSquare, UserSearch, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import {UserButton} from "@clerk/nextjs"
import { Skeleton } from "@/components/ui/skeleton"
import { ProjectRoom, ProjectRoomUser } from '@/lib/Types'
import CreateNewProject from '../app/create-new-project/page'

const tabs = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Feedbacks', icon: MessageSquare },
    { name: 'Analysis', icon: BarChart },
    { name: 'Tasks', icon: CheckSquare },
    { name: 'Team Members', icon: UserSearch },
]

interface DashboardSidebarProps {
    projectRoom: ProjectRoom;
    setActiveTab: (tab: string) => void;
    activeTab: string;
}

export default function Component({ activeTab, projectRoom, setActiveTab }: DashboardSidebarProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(projectRoom);

    const { data: currentUser, isLoading, isSuccess } = useQuery({
        queryKey: ["currentUser"],
        queryFn: () => axios.get("/api/user-routes/get-current-user")
    })  

    const handleProjectChange = (projectRoomId: string) => {
        const selected = currentUser?.data.projectRoomsUser.find((user: { projectRoomId: string }) => user.projectRoomId === projectRoomId);
        if (selected) {
            setSelectedProject(selected.projectRoom);
            router.push(`/dashboard/${projectRoomId}`);
        }
    }

    const SidebarContent = () => (
        <>
            <header className="p-6 border-b border border-[#141414]">
                <div className="flex items-center space-x-4">
                    {isLoading ? (
                        <Skeleton className="h-12 w-12 rounded-full" />
                    ) : (
                        <UserButton  appearance={{
                            elements: {
                              avatarBox: {
                                width: '45px',
                                height: '45px'
                              }
                            }
                          }} />
                    )}
                    <div className="flex-1 min-w-0">
                        {isLoading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        ) : (
                            <>
                                <p className="font-semibold text-lg truncate">
                                    {currentUser?.data.first_name} {currentUser?.data.last_name}
                                </p>
                                <p className="text-sm text-muted-foreground truncate">
                                    {currentUser?.data.email}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </header>
            <nav className="flex-1 overflow-y-auto py-6">
                <ul className="space-y-2 px-4">
                    {tabs.map((tab) => (
                        <li key={tab.name}>
                            <Button
                                variant="ghost"
                                className={`${activeTab === tab.name ? 'text-white' : " text-neutral-400"}  w-full justify-start h-12 px-4 text-left font-medium hover:bg-gray-100 dark:hover:bg-[#141414] transition-colors`}
                                onClick={() => {
                                    setActiveTab(tab.name);
                                    setIsOpen(false);
                                }}
                            >
                                <tab.icon className="mr-3 size-5" />
                                {tab.name}
                            </Button>
                        </li>
                    ))}
                    <CreateNewProject />
                </ul>
            </nav>
            <div className="p-4">
                {isLoading ? (
                    <Skeleton className="h-10 w-full" />
                ) : currentUser?.data.projectRoomsUser.length > 0 ? (
                        <Select onValueChange={handleProjectChange} defaultValue={"123"}>
                        <SelectTrigger className="w-full bg-[#F8F9FA] border border-[#141414] text-white dark:bg-[#09090B]">
                            <SelectValue className='text-wh'>
                                {selectedProject?.title}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className='bg-[#F8F9FA] dark:bg-[#09090B]'>
                            {isSuccess && currentUser.data.projectRoomsUser.map((user: ProjectRoomUser) => (
                                <SelectItem key={user.projectRoomId} value={user.projectRoomId} className='bg-[#F8F9FA] dark:bg-[#09090B]'>
                                    {user.projectRoom.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ) : (
                    <Button className="w-full">
                        Create New Project
                    </Button>
                )}
            </div>
        </>
    )

    return (
        <>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu  className='size-10'/>
                        <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0 bg-[#F8F9FA] dark:bg-[#09090B]">
                    <SheetTitle className="sr-only">Dashboard Sidebar</SheetTitle>
                    <SidebarContent />
                </SheetContent>
            </Sheet>
            <aside className="hidden md:flex w-[300px] h-screen border-r border border-[#141414] flex-col max-h-full bg-[#F8F9FA] dark:bg-[#09090B]">
                <SidebarContent />
            </aside>
        </>
    )
}