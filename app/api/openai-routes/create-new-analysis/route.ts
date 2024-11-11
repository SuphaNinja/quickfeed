import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

console.log(apiKey);

const openai = new OpenAI({
  apiKey: apiKey,
});

interface DiagramData {
  ratingDistribution: {
    [key: string]: {
      count: number;
      percentage: number;
      keywords: string[];
    };
  };
  sentimentBreakdown: {
    positive: { count: number; percentage: number };
    neutral: { count: number; percentage: number };
    negative: { count: number; percentage: number };
  };
  topIssues: Array<{
    issue: string;
    frequency: number;
    averageRating: number;
  }>;
  ratingTrend: Array<{
    date: string;
    averageRating: number;
  }>;
  keywordAnalysis: Array<{
    keyword: string;
    frequency: number;
    sentiment: "positive" | "neutral" | "negative";
    associatedRatings: number[];
  }>;
}

interface AnalysisResult {
  title: string;
  description: string;
  overallRating: number;
  diagramData: DiagramData;
  projectRoomId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const prompt = `Analyze the following customer feedback data and generate a detailed feedback analysis report. Use the exact structure provided below, but fill each section with relevant insights based on the given data. Use Markdown syntax for formatting.

# Detailed Feedback Analysis

## 1. Key Themes & Trends
- List the main recurring themes or trends identified in the feedback.

## 2. Sentiment Breakdown
- Provide an overview of the sentiment (positive, negative, neutral) found in the feedback.

## 3. Strengths (What's Working Well)
- Highlight aspects that customers appreciate, if any.

## 4. Weaknesses (Areas Needing Improvement)
- Identify areas where customers have expressed dissatisfaction or see room for improvement.

## 5. User Journey Analysis
- Describe how the feedback reflects on different stages of the user journey.

## 6. Actionable Suggestions for Improvement
- Provide specific, actionable suggestions based on the feedback.

## 7. Competitive Benchmarking
- If mentioned in the feedback, include how the company compares to competitors.

## 8. Impact Prioritization
- Suggest which areas should be prioritized for improvement based on the feedback.

## 9. Quantitative Insights
- Include any quantitative data or trends that can be extracted from the feedback.

## 10. Customer Loyalty & Retention Analysis
- Discuss how the feedback might impact customer loyalty and retention.

## 11. Additional Insights (Optional)
- Include any other relevant insights derived from the feedback.

## 12. General Tone & Emotion
- Summarize the overall tone and emotional content of the feedback.

Ensure that each section contains relevant content based on the provided feedback data and follows proper Markdown syntax for headings and bullet points.`

export async function POST(request: Request) {
  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenAI API key not configured" },
      { status: 500 }
    );
  }

  try {
    const { projectId, feedbacks } = await request.json();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unautorized, userId not provided" },
        { status: 401 }
      );
    }

    if (!feedbacks || !Array.isArray(feedbacks)) {
      return NextResponse.json(
        { error: "Invalid feedbacks data" },
        { status: 400 }
      );
    }

    const user = await prisma.projectRoomUser.findFirst({
      where: { userId: userId, projectRoomId: projectId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Unautorized creation of analysis, role not admin" },
        { status: 401 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Analyze the following customer feedback and provide a summary in JSON format that MUST match this exact structure:
          {
            "title": "Brief title summarizing the overall feedback",
            "description": "",
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

          Parse and analyze this feedback: ${JSON.stringify(feedbacks)}`,
        },
      ],
      temperature: 0.2, // Lower temperature for more consistent output
      response_format: { type: "json_object" },
    });

    const description = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `${prompt}
          Parse and analyze this feedback: ${JSON.stringify(feedbacks)}`,
        },
      ],
      temperature: 0.2, // Lower temperature for more consistent output
    });


    const result = JSON.parse(completion.choices[0].message?.content || "{}");
    const desc = description.choices[0].message?.content;

    const analysis = await prisma.analysis.create({
      data: {
        title: result.title,
        description: desc ?? "",
        overallRating: result.overallRating,
        createdBy: `${user.first_name} ${user.last_name}`,
        projectRoom: {
          connect: { id: projectId },
        },
        ratingDistribution: {
          create: {
            fiveStarCount:
              result.diagramData.ratingDistribution["5-star"].count,
            fiveStarPercentage:
              result.diagramData.ratingDistribution["5-star"].percentage,
            fiveStarKeywords:
              result.diagramData.ratingDistribution["5-star"].keywords,
            fourStarCount:
              result.diagramData.ratingDistribution["4-star"].count,
            fourStarPercentage:
              result.diagramData.ratingDistribution["4-star"].percentage,
            fourStarKeywords:
              result.diagramData.ratingDistribution["4-star"].keywords,
            threeStarCount:
              result.diagramData.ratingDistribution["3-star"].count,
            threeStarPercentage:
              result.diagramData.ratingDistribution["3-star"].percentage,
            threeStarKeywords:
              result.diagramData.ratingDistribution["3-star"].keywords,
            twoStarCount: result.diagramData.ratingDistribution["2-star"].count,
            twoStarPercentage:
              result.diagramData.ratingDistribution["2-star"].percentage,
            twoStarKeywords:
              result.diagramData.ratingDistribution["2-star"].keywords,
            oneStarCount: result.diagramData.ratingDistribution["1-star"].count,
            oneStarPercentage:
              result.diagramData.ratingDistribution["1-star"].percentage,
            oneStarKeywords:
              result.diagramData.ratingDistribution["1-star"].keywords,
          },
        },
        sentimentBreakdown: {
          create: {
            positiveCount: result.diagramData.sentimentBreakdown.positive.count,
            positivePercentage:
              result.diagramData.sentimentBreakdown.positive.percentage,
            neutralCount: result.diagramData.sentimentBreakdown.neutral.count,
            neutralPercentage:
              result.diagramData.sentimentBreakdown.neutral.percentage,
            negativeCount: result.diagramData.sentimentBreakdown.negative.count,
            negativePercentage:
              result.diagramData.sentimentBreakdown.negative.percentage,
          },
        },
        topIssues: {
          create: result.diagramData.topIssues.map(
            (issue: { issue: any; frequency: any; averageRating: any }) => ({
              issue: issue.issue,
              frequency: issue.frequency,
              averageRating: issue.averageRating,
            })
          ),
        },
        ratingTrends: {
          create: result.diagramData.ratingTrend.map(
            (trend: { date: string | number | Date; averageRating: any }) => ({
              date: new Date(trend.date),
              averageRating: trend.averageRating,
            })
          ),
        },
        keywordAnalyses: {
          create: result.diagramData.keywordAnalysis.map(
            (keyword: {
              keyword: any;
              frequency: any;
              sentiment: any;
              associatedRatings: any;
            }) => ({
              keyword: keyword.keyword,
              frequency: keyword.frequency,
              sentiment: keyword.sentiment,
              associatedRatings: keyword.associatedRatings,
            })
          ),
        },
      },
      include: {
        ratingDistribution: true,
        sentimentBreakdown: true,
        topIssues: true,
        ratingTrends: true,
        keywordAnalyses: true,
      },
    });

    if (!analysis) {
      return NextResponse.json(
        { error: "Failed to create analysis." },
        { status: 404 }
      );
    }

    return NextResponse.json(analysis);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error with OpenAI API request: ${error.message}`);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error(`Unknown error occurred: ${String(error)}`);
      return NextResponse.json(
        { error: "An unknown error occurred during your request." },
        { status: 500 }
      );
    }
  }
}
