import React from "react";
import { useFeedbacks } from "@/hooks/functions/useFeedbacks";
import { Card, CardTitle } from "@/components/ui/card";
import FeedbackItem from "../../feedbacks/FeedbackItem";
import { FeedbackSkeleton } from "../../feedbacks/FeedbackItem";

export default function LatestFeedbacks({
  projectRoomId,
}: {
  projectRoomId: string;
}) {
  const { feedbacks, isLoading, isError } = useFeedbacks(projectRoomId);

  return (
    <div className="p-5 border border-[#141414] min-h-[calc(100dvh-200px)] max-h-[calc(100dvh-200px)] overflow-y-auto custom-scrollbar rounded-xl">
      <CardTitle className="text-2xl my-2 font-normal">
        Latest Feedbacks🔥
      </CardTitle>

      <div className="flex flex-col gap-2">
        {feedbacks?.length === 0 ? (
          <p className="text-center mt-52 text-xl">There are no feedbacks 👀</p>
        ) : isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <FeedbackSkeleton key={index} />
          ))
        ) : (
          feedbacks
            ?.sort(
              (a, b) =>
                new Date(b.createdAt || "").getTime() -
                new Date(a.createdAt || "").getTime()
            )
            .slice(0, 6)
            .map((feedback) => (
              <FeedbackItem key={feedback.id} feedback={feedback} />
            ))
        )}
      </div>
    </div>
  );
}
