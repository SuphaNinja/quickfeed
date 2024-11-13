import React from "react";
import { useFeedbacks } from "@/hooks/functions/useFeedbacks";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import FeedbackItem from "./FeedbackItem";

export default function LatestFeedbacks({
  projectRoomId,
}: {
  projectRoomId: string;
}) {
  const { data: feedbacks, isLoading, isSuccess } = useFeedbacks(projectRoomId);

  if (!isSuccess) return null;

  return (
    <Card className="p-5">
      <CardTitle className="text-2xl my-2">Latest Feedbacks🔥</CardTitle>

      <div>
        {feedbacks
          .sort(
            (a, b) =>
              new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
          )
          .splice(0, 5)
          ?.map((feedback) => (
            <FeedbackItem key={feedback.id} feedback={feedback} />
          ))}
      </div>
    </Card>
  );
}
