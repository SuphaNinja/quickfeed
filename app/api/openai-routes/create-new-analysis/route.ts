import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import { prisma } from '@/lib/prisma';

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: apiKey
});

interface DiagramData {
  ratingDistribution: {
    [key: string]: {
      count: number
      percentage: number
      keywords: string[]
    }
  }
  sentimentBreakdown: {
    positive: { count: number; percentage: number }
    neutral: { count: number; percentage: number }
    negative: { count: number; percentage: number }
  }
  topIssues: Array<{
    issue: string
    frequency: number
    averageRating: number
  }>
  ratingTrend: Array<{
    date: string
    averageRating: number
  }>
  keywordAnalysis: Array<{
    keyword: string
    frequency: number
    sentiment: 'positive' | 'neutral' | 'negative'
    associatedRatings: number[]
  }>
}

interface AnalysisResult {
  title: string
  description: string
  overallRating: number
  diagramData: DiagramData
  projectRoomId: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export async function POST(request: Request) {
  if (!apiKey) {
    return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
  }

  try {
    const { projectId, feedbacks} = await request.json()
    const userId = request.headers.get('x-user-id');

    if (!userId) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (!feedbacks || !Array.isArray(feedbacks)) {
      return NextResponse.json({ error: "Invalid feedbacks data" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
        where: {id: userId}
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
          {
            role: "system",
            content: `You are an AI assistant that analyzes customer feedback and ALWAYS provides a summary in valid JSON format. 
            Your analysis must be concise yet informative, focusing on key metrics, patterns, and important keywords found in the feedback.
            Follow these guidelines strictly:
            1. Calculate accurate counts and percentages for rating distribution and sentiment breakdown
            2. Identify the top 3-5 issues mentioned in the feedback
            3. Use the createdAt timestamps to create a rating trend over time
            4. Extract important keywords from each rating level
            5. For keywordAnalysis, identify frequently mentioned terms and their context
            6. Ensure all numeric values are numbers, not strings
            7. Provide concise and accurate information for each field`
          },
          {
          role: "user",
          content: `Analyze the following customer feedback and provide a summary in JSON format that MUST match this exact structure:
          {
            "title": "Brief title summarizing the overall feedback",
            "description": "Concise analysis of the feedback, including main points and trends",
            "overallRating": 0.0,
            "diagramData": {
              "ratingDistribution": {
                "5-star": {"count": 0, "percentage": 0, "keywords": []},
                "4-star": {"count": 0, "percentage": 0, "keywords": []},
                "3-star": {"count": 0, "percentage": 0, "keywords": []},
                "2-star": {"count": 0, "percentage": 0, "keywords": []},
                "1-star": {"count": 0, "percentage": 0, "keywords": []}
              },
              "sentimentBreakdown": {
                "positive": {"count": 0, "percentage": 0},
                "neutral": {"count": 0, "percentage": 0},
                "negative": {"count": 0, "percentage": 0}
              },
              "topIssues": [
                {"issue": "", "frequency": 0, "averageRating": 0.0}
              ],
              "ratingTrend": [
                {"date": "", "averageRating": 0.0}
              ],
              "keywordAnalysis": [
                {
                  "keyword": "",
                  "frequency": 0,
                  "sentiment": "positive|neutral|negative",
                  "associatedRatings": []
                }
              ]
            }
          }

          Parse and analyze this feedback: ${JSON.stringify(feedbacks)}`
        }
      ],
      temperature: 0.2, // Lower temperature for more consistent output
      response_format: { type: "json_object" }
    })

    const result = JSON.parse(completion.choices[0].message?.content || '{}')
    const analysis = await prisma.analysis.create({
      data: {
        title: result.title,
        description: result.description,
        overallRating: result.overallRating,
        createdBy: `${user.firstName} ${user.lastName}`,
        projectRoom: {
          connect: { id: projectId },
          },
        ratingDistribution: {
          create: {
            fiveStarCount: result.diagramData.ratingDistribution["5-star"].count,
            fiveStarPercentage: result.diagramData.ratingDistribution["5-star"].percentage,
            fiveStarKeywords: result.diagramData.ratingDistribution["5-star"].keywords,
            fourStarCount: result.diagramData.ratingDistribution["4-star"].count,
            fourStarPercentage: result.diagramData.ratingDistribution["4-star"].percentage,
            fourStarKeywords: result.diagramData.ratingDistribution["4-star"].keywords,
            threeStarCount: result.diagramData.ratingDistribution["3-star"].count,
            threeStarPercentage: result.diagramData.ratingDistribution["3-star"].percentage,
            threeStarKeywords: result.diagramData.ratingDistribution["3-star"].keywords,
            twoStarCount: result.diagramData.ratingDistribution["2-star"].count,
            twoStarPercentage: result.diagramData.ratingDistribution["2-star"].percentage,
            twoStarKeywords: result.diagramData.ratingDistribution["2-star"].keywords,
            oneStarCount: result.diagramData.ratingDistribution["1-star"].count,
            oneStarPercentage: result.diagramData.ratingDistribution["1-star"].percentage,
            oneStarKeywords: result.diagramData.ratingDistribution["1-star"].keywords,
          }
        },
        sentimentBreakdown: {
          create: {
            positiveCount: result.diagramData.sentimentBreakdown.positive.count,
            positivePercentage: result.diagramData.sentimentBreakdown.positive.percentage,
            neutralCount: result.diagramData.sentimentBreakdown.neutral.count,
            neutralPercentage: result.diagramData.sentimentBreakdown.neutral.percentage,
            negativeCount: result.diagramData.sentimentBreakdown.negative.count,
            negativePercentage: result.diagramData.sentimentBreakdown.negative.percentage,
          }
        },
        topIssues: {
          create: result.diagramData.topIssues.map(issue => ({
            issue: issue.issue,
            frequency: issue.frequency,
            averageRating: issue.averageRating,
          }))
        },
        ratingTrends: {
          create: result.diagramData.ratingTrend.map(trend => ({
            date: new Date(trend.date),
            averageRating: trend.averageRating,
          }))
        },
        keywordAnalyses: {
          create: result.diagramData.keywordAnalysis.map(keyword => ({
            keyword: keyword.keyword,
            frequency: keyword.frequency,
            sentiment: keyword.sentiment,
            associatedRatings: keyword.associatedRatings,
          }))
        },
      },
      include: {
        ratingDistribution: true,
        sentimentBreakdown: true,
        topIssues: true,
        ratingTrends: true,
        keywordAnalyses: true,
      },
    })

    if (!analysis) {
        return NextResponse.json({ error: "Failed to create analysis." }, { status: 404 })
    }
    
    return NextResponse.json(analysis)

  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error with OpenAI API request: ${error.message}`)
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      console.error(`Unknown error occurred: ${String(error)}`)
      return NextResponse.json({ error: 'An unknown error occurred during your request.' }, { status: 500 })
    }
  }
}