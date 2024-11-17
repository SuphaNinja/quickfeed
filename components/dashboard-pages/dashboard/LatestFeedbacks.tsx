import React from "react";
import { useFeedbacks } from "@/hooks/functions/useFeedbacks";
import { Card, CardTitle } from "@/components/ui/card";
import FeedbackItem from "../../feedbacks/FeedbackItem";
export default function LatestFeedbacks({
  projectRoomId,
}: {
  projectRoomId: string;
}) {
  const { data: feedbacks, isLoading, isSuccess } = useFeedbacks(projectRoomId);

  if (isLoading) return null;
  if (!isSuccess) return null;

  return (
    <Card className="p-5 border border-[#141414] h-full">
      <CardTitle className="text-2xl my-2 font-normal">
        Latest Feedbacks🔥
      </CardTitle>

      <div>
        {feedbacks.length === 0 && (
          <p className="text-center mt-52 text-xl">There are no feedbacks 👀</p>
        )}

        {feedbacks
          .sort(
            (a, b) =>
              new Date(b.createdAt || "").getTime() -
              new Date(a.createdAt || "").getTime()
          )
          .splice(0, 6)
          ?.map((feedback) => (
            <FeedbackItem key={feedback.id} feedback={feedback} />
          ))}
      </div>
    </Card>
  );
}
