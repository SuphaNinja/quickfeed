"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useParams } from "next/navigation"
import { ProjectRoom, Feedback, Analysis as AnalysisTypes } from "@/lib/Types"
import AnalysisCharts from "./AnalysisCharts"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Analysis({
  projectRoom,
}: {
  projectRoom: ProjectRoom
}) {
  return (
    <div className="space-y-5 md:p-5">
      <CreateNewAnalysis feedbacks={projectRoom.feedbacks} lastAnalysis={projectRoom.analyses[0]} />
      {projectRoom.analyses.length > 0 && (
        <AnalysisCharts analyses={projectRoom.analyses} />
      )}
    </div>
  )
}

export function CreateNewAnalysis({ feedbacks, lastAnalysis }: { feedbacks: Feedback[], lastAnalysis?: AnalysisTypes }) {
  const { roomId } = useParams()
  const { toast } = useToast()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const queryClient = useQueryClient()
  const params = useParams()

  const { mutate: sendData, isPending } = useMutation({
    mutationFn: () => axios.post("/api/openai-routes/create-new-analysis", { feedbacks, projectId: roomId }),
    onMutate: () => setIsAnalyzing(true),
    onSuccess: () => {
      toast({
        title: "Analysis complete!",
        description: "Your feedback has been successfully analyzed.",
        variant: "default",
      })
      setIsAnalyzing(false)
      queryClient.invalidateQueries({ queryKey: ["projectRoom", params.roomId] })
    },
    onError: (error: Error) => {
      toast({
        title: "An error occurred.",
        description: error.message,
        variant: "destructive",
      })
      setIsAnalyzing(false)
    },
  })

  useEffect(() => {
    const cooldownPeriod = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    const now = new Date().getTime()
    const lastAnalysisTime = lastAnalysis ? new Date(lastAnalysis.createdAt).getTime() : 0
    const timeElapsed = now - lastAnalysisTime
    const remainingTime = Math.max(cooldownPeriod - timeElapsed, 0)

    setCountdown(remainingTime)

    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1000) {
          clearInterval(timer)
          if (feedbacks.length >= 15) {
            sendData()
          }
          return 0
        }
        return prevCountdown - 1000
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [lastAnalysis, feedbacks, sendData])

  const formatCountdown = (ms: number) => {
    const days = Math.floor(ms / (24 * 60 * 60 * 1000))
    const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000))
    const seconds = Math.floor((ms % (60 * 1000)) / 1000)
    return `${days}d ${hours}h ${minutes}m ${seconds}s`
  }

  if (feedbacks.length < 15) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Not Enough Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            You currently have {feedbacks.length}
            {feedbacks.length === 1 ? " feedback" : " feedbacks"}. You need at least
            15 feedbacks before you can analyze the data.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>

      <CardContent>
        {countdown > 0 ? (
          <p>Next analysis in: {formatCountdown(countdown)}</p>
        ) : (
          <p>{isPending || isAnalyzing ? "Analyzing..." : "Analysis will start automatically"}</p>
        )}
      </CardContent>
    </Card>
  )
}