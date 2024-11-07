"use client"

import React, { useState } from 'react'
import { useMutation } from "@tanstack/react-query"
import axios from 'axios'
import { useParams } from 'next/navigation'
import { ProjectRoom, Feedback } from '../Types'
import { Button } from '@/components/ui/button'
import AnalysisCharts from './AnalysisCharts'


export default function Analysis({ projectRoom }: { projectRoom: ProjectRoom } ) {
 

  return (  
    <div className="space-y-8 md:p-8">
      {projectRoom.analyses.length === 0 ? (
        <CreateNewAnalysis feedbacks={projectRoom.feedbacks} />
      ) : (
        <AnalysisCharts analyses={projectRoom.analyses}/>
      )}  
    </div>
  )
}

function CreateNewAnalysis({ feedbacks }: { feedbacks: Feedback[]}) {
  const { roomId } = useParams()
  
  const sendData = useMutation({
    mutationFn: () => axios.post("/api/openai-routes/create-new-analysis", { feedbacks: feedbacks, projectId: roomId })
  })

  if (feedbacks.length < 5) {
    return ( 
      <div>
        <h1>
          {`You only have ${feedbacks.length} feedbacks. You need atleast 15 feedbacks before you can analyse the data.`}
        </h1>
      </div>
    )
  }
  

  return (
    <div>
      <Button onClick={() => sendData.mutate()}>
        testsend and see what we get back
      </Button>
    </div>
  )
}