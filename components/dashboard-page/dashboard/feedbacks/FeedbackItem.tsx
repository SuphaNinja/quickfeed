import { useEffect, useState } from "react";
import { Feedback } from "./Feedbacks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Loader2, ThumbsDown, ThumbsUp, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FeedbackItem({ feedback, projectRoomId }: { feedback: Feedback, projectRoomId: string }) {
    const [votedFeedbacks, setVotedFeedbacks] = useState<string[]>([]);
    const queryClient = useQueryClient();

    const updateVotedFeedbacks = (id: string) => {
        const updatedVotedFeedbacks = [...votedFeedbacks, id];
        setVotedFeedbacks(updatedVotedFeedbacks);
        localStorage.setItem('votedFeedbacks', JSON.stringify(updatedVotedFeedbacks));
    }

    const upvoteFeedback = useMutation({
        mutationFn: (id: string) => axios.post("/api/projectroom-routes/feedbacks/upvote", { id }),
        onSuccess: (_, id) => {
            updateVotedFeedbacks(id);
            queryClient.invalidateQueries({ queryKey: ["feedbacks", projectRoomId] });
        }
    })

    const downvoteFeedback = useMutation({
        mutationFn: (id: string) => axios.post("/api/projectroom-routes/feedbacks/downvote", { id }),
        onSuccess: (_, id) => {
            updateVotedFeedbacks(id);
            queryClient.invalidateQueries({ queryKey: ["feedbacks", projectRoomId] });
        }
    })

    useEffect(() => {
        const storedVotedFeedbacks = localStorage.getItem('votedFeedbacks');
        if (storedVotedFeedbacks) {
            setVotedFeedbacks(JSON.parse(storedVotedFeedbacks));
        }
    }, []);

    const ratingClass = feedback.rating === 1 || feedback.rating === 2
        ? "bg-red-600 dark:bg-red-700"
        : feedback.rating === 3
            ? "bg-yellow-400 dark:bg-yellow-500"
            : "bg-green-500 dark:bg-green-600";

    return (
        <li className="flex flex-col gap-4 rounded-lg p-5 border border-neutral-900">
            <div className="flex flex-col sm:flex-row justify-between items-start w-full gap-2">
                <h3 className="text-sm font-medium leading-snug flex-grow">{feedback.message}</h3>
                <Badge variant="secondary" className={`${ratingClass} self-start sm:self-center whitespace-nowrap`}>
                    Rating: {feedback.rating}
                </Badge>
            </div>

            <div className="flex flex-wrap items-center text-xs text-muted-foreground gap-3">
                {feedback.name && (
                    <span className="flex items-center">
                        <UserIcon className="w-3 h-3 mr-1.5" />
                        <span className="font-medium">{feedback.name}</span>
                    </span>
                )}
                <span className="flex items-center">
                    <CalendarIcon className="w-3 h-3 mr-1.5" />
                    <span>{formatDate(feedback.createdAt)}</span>
                </span>
            </div>

            <div className="flex items-center gap-3 mt-1">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => upvoteFeedback.mutate(feedback.id)}
                    disabled={upvoteFeedback.isPending || downvoteFeedback.isPending || votedFeedbacks.includes(feedback.id)}
                    className="flex-1 sm:flex-none"
                >
                    {upvoteFeedback.isPending && upvoteFeedback.variables === feedback.id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                        <ThumbsUp className="h-4 w-4 mr-2" />
                    )}
                    <span>Upvote ({feedback.upvotes})</span>
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => downvoteFeedback.mutate(feedback.id)}
                    disabled={upvoteFeedback.isPending || downvoteFeedback.isPending || votedFeedbacks.includes(feedback.id)}
                    className="flex-1 sm:flex-none"
                >
                    {downvoteFeedback.isPending && downvoteFeedback.variables === feedback.id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                        <ThumbsDown className="h-4 w-4 mr-2" />
                    )}
                    <span>Downvote ({feedback.downvotes})</span>
                </Button>
            </div>
        </li>
    );
}

const formatDate = (date: string | Date | null): string => {
    if (!date) return "No date available";
    const dateObject = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObject.getTime())) return "Invalid date";
    return dateObject.toISOString().split('T')[0];
};