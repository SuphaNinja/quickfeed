"use client"

import React, { useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Skeleton } from '@/components/ui/skeleton'
import { FilterButtons, FilterType, SortSelect, filterFeedback, sortFeedback, sortByDate } from '../dashboard/feedbacks/FilterAndSort'
import FeedbackItem from '../dashboard/feedbacks/FeedbackItem'



export interface Feedback {
    id: string
    message: string
    rating: number
    createdAt: string | Date;
    name: string
    upvotes: number
    downvotes: number
}

type SortType = "newest" | "oldest" | "last7days" | "last30days";


export default function FeedBackList({ projectRoomId }: { projectRoomId: string }) {
    const [filter, setFilter] = useState<FilterType>("all");
    const [sort, setSort] = useState<SortType>("newest");

    const { data: feedbackdata, isLoading } = useQuery({
        queryKey: ["feedbacks", projectRoomId],
        queryFn: () => axios.post("/api/projectroom-routes/feedbacks/get-all-feedbacks", { projectRoomId })
    })
    const feedbacks: Feedback[] = feedbackdata?.data.feedbacks || [];

    const filteredAndSortedFeedbacks = feedbacks
        .filter((feedback) => filterFeedback(feedback, filter))
        .filter((feedback) => sortFeedback(feedback, sort))
        .sort((a, b) => sortByDate(a, b, sort));

    return (
        
        <div className="flex flex-col md:border md:p-6 my-8 border-neutral-900 rounded-lg w-full">
            <ScrollArea className="h-[700px] pr-4">
            <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                Feedbacks <span role="img" aria-label="waving hand">👋</span>
            </h1>
            <div className='flex md:flex-row gap-2 flex-col justify-between'>
                <FilterButtons filter={filter} setFilter={setFilter} />
                <SortSelect sort={sort} setSort={setSort} />
            </div>

            <div className="space-y-4 mt-67">
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                        <FeedbackSkeleton key={index} />
                    ))
                ) : (
                    filteredAndSortedFeedbacks.length === 0 ? (
                        <div className="flex justify-center items-center h-[calc(100dvh-202px)]">
                            <p className="text-center text-2xl">No feedback yet 👀</p>
                        </div>
                    ) : (
                        <ul className="flex flex-col gap-2 w-full">
                            {filteredAndSortedFeedbacks.map((feedback) => (
                                <FeedbackItem key={feedback.id} feedback={feedback} projectRoomId={projectRoomId} />
                            ))}
                        </ul>
                    )
                )}
            </div>
            </ScrollArea>
        </div>
    )
}

function FeedbackSkeleton() {
    return (
        <div className="p-4 rounded-lg bg-zinc-900/50">
            <div className="flex items-start justify-between gap-4 mb-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-6 w-20" />
            </div>
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-1/3" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                </div>
            </div>
        </div>
    )
}