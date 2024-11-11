'use client'

import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, CalendarIcon } from 'lucide-react'
import TaskCard from './TaskCard'
import { Task } from '@/lib/Types'
import { sortTasks, TaskSortSelect } from './TaskSort'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'

type SortType = "newest" | "oldest" | "status" | "priority";

export default function MyTasks({ isAdmin }: { isAdmin: boolean }) {
    const [sort, setSort] = useState<SortType>("newest");
    const params = useParams()
    const { data: myTasks, isLoading, isError } = useQuery<{ data: Task[] }>({
        queryKey: ["myTasks", params.roomId],
        queryFn: () => axios.post("/api/projectroom-routes/tasks/get-my-tasks", { projectRoomId: params.roomId }),
    })

    const tasks: Task[] = myTasks?.data || [];
    const sortedTasks = sortTasks(tasks, sort);

    if (isError) return null

    return (
        <div className="space-y-4">
            <div className='flex md:flex-row flex-col justify-between'>
                <h2 className="text-2xl font-bold">My Tasks</h2>
                <TaskSortSelect sort={sort} setSort={setSort} />
            </div>
            <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, index) => (
                            <TaskSkeleton key={index} />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sortedTasks.map((task) => (
                            <TaskCard key={task.id} task={task} isAdmin={isAdmin} />
                        ))}
                    </div>
                )}
                {myTasks?.data.length === 0 && (
                    <Card>
                        <CardContent className="flex items-center justify-center p-6">
                            <AlertCircle className="mr-2 h-4 w-4 opacity-70" />
                            <span className="text-sm text-muted-foreground">No tasks found</span>
                        </CardContent>
                    </Card>
                )}
            </ScrollArea>
        </div>
    )
}

function TaskSkeleton() {
    return (
        <Card className="overflow-hidden">
            <CardContent className="p-4">
                <div className='flex justify-between'>
                    <div className="w-2/3">
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-3/4 mb-3" />
                    </div>
                    <div className="flex flex-col gap-2 mb-3">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                    <CalendarIcon className="w-3 h-3 mr-1 text-gray-400" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </CardContent>
        </Card>
    )
}