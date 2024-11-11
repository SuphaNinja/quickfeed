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

const prompt = (feedbacks: string []) =>  `
You are an expert AI system specializing in customer experience and feedback analysis. 
  Your task is to comprehensively analyze the provided customer feedback, identifying key patterns, strengths, weaknesses, and opportunities for improvement. 
  Follow the detailed structure below to ensure the most valuable insights are surfaced.

  Feedback: ${feedbacks.join(", ")}

  Detailed Feedback Analysis:

  1. Key Themes & Trends:
    - Extract and summarize recurring themes or trends in the feedback. Focus on patterns in user experiences, both positive and negative. Highlight any common phrases or sentiments that appear frequently across multiple feedback entries.

  2. Sentiment Breakdown:
    - Analyze the overall sentiment of the feedback, categorizing it into positive, negative, or neutral.
    - For each sentiment type, identify what specific aspects of the product or service are driving that sentiment.

  3. Strengths (What’s Working Well):
    - Highlight specific strengths praised by customers.
    - Explain why these strengths matter to customers and how they contribute to satisfaction.
    - Provide examples of how these strengths have impacted the user experience positively.

  4. Weaknesses (Areas Needing Improvement):
    - Identify any weaknesses or areas of dissatisfaction.
    - Offer context on why these areas are problematic, considering the user's journey or expectations.
    - Group feedback into categories such as usability issues, performance problems, missing features, etc.

  5. User Journey Analysis:
    - Break down the feedback according to the different stages of the user journey (e.g., onboarding, using the product, after-sales support).
    - Provide insights into how customer satisfaction varies at each stage and where the most significant pain points lie.

  6. Actionable Suggestions for Improvement:
    - For each weakness or area needing improvement, provide at least two actionable suggestions that the business could implement to address the concerns raised.
    - Ensure suggestions are practical, considering resource constraints and potential impact.

  7. Competitive Benchmarking:
    - Compare the feedback to general industry standards or best practices. Are there areas where the product/service excels or falls behind when compared to competitors?
    - If available, suggest competitive features or approaches that could improve the overall experience.

  8. Impact Prioritization:
    - Rank the identified issues and improvements by their potential impact on overall customer satisfaction. Focus on changes that could bring the most significant positive impact.
    - Explain why certain improvements should be prioritized over others based on customer feedback and business goals.

  9. Quantitative Insights:
    - Include a brief statistical overview of the feedback:
      - Positive Feedback Ratio: What percentage of users had a predominantly positive experience?
      - Negative Feedback Ratio: What percentage of users had a predominantly negative experience?
      - Highlight any particularly extreme opinions (very positive or very negative) and their frequency.

  10. Customer Loyalty & Retention Analysis:
    - Provide insights into the likelihood of customer retention based on the tone of the feedback.
    - Analyze if customers seem likely to continue using the service/product or churn based on their feedback. If possible, quantify the potential churn risk.

  11. Additional Insights (Optional):
    - Identify any feedback that, while not critical, presents interesting insights or potential opportunities for innovation.
    - Highlight user suggestions for new features or use cases that the business might not have considered.

  12. General Tone & Emotion:
    - Assess the emotional tone of the feedback. Is the feedback given with frustration, enthusiasm, or neutrality? Break down emotional cues and their influence on overall customer satisfaction.

  Provide the analysis in a structured markdown format, with each section clearly labeled. Use bullet points and concise summaries where appropriate.
`

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
          content: `${prompt(feedbacks)}
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
