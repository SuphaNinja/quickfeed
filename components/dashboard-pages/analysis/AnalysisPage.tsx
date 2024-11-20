"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import { ProjectRoom, Feedback, Analysis as AnalysisTypes } from "@/lib/Types";
import AnalysisCharts from "./AnalysisCharts";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquareWarningIcon } from "lucide-react";

export default function Analysis({
  projectRoom,
}: {
  projectRoom: ProjectRoom;
}) {
  return (
    <div className="space-y-5 md:p-10 px-5">
      <CreateNewAnalysis
        feedbacks={projectRoom.feedbacks}
        lastAnalysis={projectRoom.analyses[0]}
      />
      {projectRoom.analyses.length > 0 && (
        <AnalysisCharts projectRoom={projectRoom} analyses={projectRoom.analyses} />
      )}
    </div>
  );
}

export function CreateNewAnalysis({
  feedbacks,
  lastAnalysis,
}: {
  feedbacks: Feedback[];
  lastAnalysis?: AnalysisTypes;
}) {
  const { roomId } = useParams();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const queryClient = useQueryClient();
  const params = useParams();
  const sendDataCalledRef = useRef(false)

  const cooldownPeriod = 7 * 24 * 60 * 60 * 1000

  const { mutate: sendData, isPending } = useMutation({
    mutationFn: () =>
      axios.post("/api/openai-routes/create-new-analysis", {
        feedbacks,
        projectId: roomId,
      }),
    onMutate: () => setIsAnalyzing(true),
    onSuccess: () => {
      toast({
        title: "Analysis complete!",
        description: "Your feedback has been successfully analyzed.",
        variant: "default",
      });
      setIsAnalyzing(false);
      queryClient.invalidateQueries({
        queryKey: ["projectRoom", params.roomId],
      });

      setCountdown(cooldownPeriod)
    },
    onError: (error: Error) => {
      toast({
        title: "An error occurred.",
        description: error.message,
        variant: "destructive",
      });
      setIsAnalyzing(false);
    },
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime()
      const lastAnalysisTime = lastAnalysis
        ? new Date(lastAnalysis.createdAt).getTime()
        : 0
      const timeElapsed = now - lastAnalysisTime
      const remainingTime = Math.max(cooldownPeriod - timeElapsed, 0)

      setCountdown(remainingTime)
    }

    // Initial update
    updateCountdown()

    const timer = setInterval(() => {
      updateCountdown()

      if (countdown <= 1000) {
        if (feedbacks.length >= 15 && !sendDataCalledRef.current && !isAnalyzing) {
          sendDataCalledRef.current = true
          sendData()
        }
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [feedbacks.length, lastAnalysis, sendData, isAnalyzing])

  const formatCountdown = (ms: number) => {
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  if (feedbacks.length < 15) {
    return (
      <Card className="bg-yellow-50 text-yellow-700 border-yellow-400  border-2">
        <CardHeader>
          <CardTitle className="flex items-center">
            Not Enough Feedback
            <MessageSquareWarningIcon className="size-6 ml-2" />
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
            You currently have {feedbacks.length}
            {feedbacks.length === 1 ? " feedback" : " feedbacks"}. You need at
            least 15 feedbacks before you can analyze the data.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col items-center mt-5">
      {countdown > 0 ? (
        <p className=" text-gray-500">Next analysis in: {formatCountdown(countdown)}</p>
      ) : (
        <p>
          {isPending || isAnalyzing
            ? "Analyzing..."
            : "Analysis will start automatically"}
        </p>
      )}
    </div>
  );
}
