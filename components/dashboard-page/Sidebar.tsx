'use client'

import { useAuth } from '@/providers/QueryProvider'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LayoutDashboard, MessageSquare, BarChart, CheckSquare, Folder, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"

const tabs = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Feedbacks', icon: MessageSquare },
    { name: 'Analysis', icon: BarChart },
    { name: 'Tasks', icon: CheckSquare },
    { name: 'Project Page', icon: Folder },
]

interface DashboardSidebarProps {
    projectRoom: any;
    setActiveTab: (tab: string) => void;
}

export default function Component({ projectRoom, setActiveTab }: DashboardSidebarProps) {
    const  currentUser  = ["useAuth();"]
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(projectRoom);

    const handleProjectChange = (projectRoomId: string) => {
        const selected = currentUser.projectRoomsUser.find(user => user.projectRoomId === projectRoomId);
        if (selected) {
            setSelectedProject(selected.projectRoom);
            router.push(`/pages/dashboard/${projectRoomId}`);
        }
    }

    const SidebarContent = () => (
        <>
            <header className="p-6 border-b border-neutral-900">
                <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={currentUser?.avatarUrl} alt={currentUser?.firstName} />
                        <AvatarFallback className="text-lg">{currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-lg">{currentUser?.firstName} {currentUser?.lastName}</p>
                        <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
                    </div>
                </div>
            </header>
            <nav className="flex-1 overflow-y-auto py-6">
                <ul className="space-y-2 px-4">
                    {tabs.map((tab) => (
                        <li key={tab.name}>
                            <Button
                                variant="ghost"
                                className="w-full justify-start h-12 px-4 text-left font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                onClick={() => {
                                    setActiveTab(tab.name);
                                    setIsOpen(false);
                                }}
                            >
                                <tab.icon className="mr-3 h-5 w-5" />
                                {tab.name}
                            </Button>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-4">
                {currentUser.projectRoomsUser.length > 0 ? (
                    <Select onValueChange={handleProjectChange} value={selectedProject?.id}>
                        <SelectTrigger className="w-full bg-[#F8F9FA] border-neutral-900 dark:bg-[#09090B]">
                            <SelectValue>
                                {selectedProject?.title || "Select a project"}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className='bg-[#F8F9FA] dark:bg-[#09090B]'>
                            {currentUser.projectRoomsUser.map((user) => (
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
                        <Menu />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0 bg-[#F8F9FA] dark:bg-[#09090B]">
                    <SheetTitle className="sr-only">Dashboard Sidebar</SheetTitle>
                    <SidebarContent />
                </SheetContent>
            </Sheet>
            <aside className="hidden md:flex w-64 h-screen border-r border-neutral-900 flex-col bg-[#F8F9FA] dark:bg-[#09090B]">
                <SidebarContent />
            </aside>
        </>
    )
}