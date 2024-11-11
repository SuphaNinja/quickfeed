"use client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import { ProjectRoom, Feedback } from "@/lib/Types";
import { Button } from "@/components/ui/button";
import AnalysisCharts from "./AnalysisCharts";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function Analysis({
  projectRoom,
}: {
  projectRoom: ProjectRoom;
}) {
  return (
    <div className="space-y-8 md:p-8">
      {projectRoom.analyses.length === 0 ? (
        <CreateNewAnalysis feedbacks={projectRoom.feedbacks} />
      ) : (
        <>
          <CreateNewAnalysis feedbacks={projectRoom.feedbacks} />
          <AnalysisCharts analyses={projectRoom.analyses} />
        </>
      )}
    </div>
  );
}

export function CreateNewAnalysis({ feedbacks }: { feedbacks: Feedback[] }) {
  const { roomId } = useParams();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);



  const { mutate: sendData, isPending } = useMutation({
    mutationFn: async () => {
      setIsAnalyzing(true);
      const response = await axios.post(
        "/api/openai-routes/create-new-analysis",
        {
          feedbacks,
          projectId: roomId,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Analysis complete!",
        description: "Your feedback has been successfully analyzed.",
        variant: "default",
      });
      setIsAnalyzing(false);
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

  if (feedbacks.length < 1) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-md">
        <h2 className="text-lg font-semibold text-yellow-800">
          Not Enough Feedback
        </h2>
        <p className="mt-2 text-yellow-700">
          You currently have {feedbacks.length}
          {feedbacks.length === 1 ? "feedback" : "feedbacks"}. You need at least
          15 feedbacks before you can analyze the data.
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-4">
      <Button
        onClick={() => {
          sendData();
        }}
        disabled={isPending || isAnalyzing}
      >
        {isPending || isAnalyzing ? "Analyzing..." : "Send and Analyze"}
      </Button>
    </div>
  );
}
