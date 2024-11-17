import { useState, useEffect } from "react";
import axios from "axios";
import { Feedback } from "@/lib/Types";

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Fetch feedbacks for a specific project room
const fetchFeedbacks = async (projectRoomId: string): Promise<Feedback[]> => {
    const { data } = await api.post<{ feedbacks: Feedback[] }>('/projectroom-routes/feedbacks/get-all-feedbacks', { projectRoomId });
    return data.feedbacks;
};

// Custom hook to manage feedbacks fetching
export const useFeedbacks = (projectRoomId: string) => {
    const [feedbacks, setFeedbacks] = useState<Feedback[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!projectRoomId) return;

        const getFeedbacks = async () => {
            setIsLoading(true);
            setIsError(false);
            setError(null);

            try {
                const data = await fetchFeedbacks(projectRoomId);
                setFeedbacks(data);
            } catch (err) {
                setIsError(true);
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        };

        getFeedbacks();
    }, [projectRoomId]);

    return { feedbacks, isLoading, isError, error };
};

// Usage
// const { feedbacks, isLoading, isError, error } = useFeedbacks(projectRoomId);
