import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "No projectId provided" }, { status: 404 });
    }
    const userId = await auth()

    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    // Fetch the ProjectRoom with related data
    const projectRoom = await prisma.projectRoom.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            assignedTasks: { orderBy: { createdAt: "desc" }},
            createdTasks: { orderBy: { createdAt: "desc" }},
          }
        },
        analyses: {
          include: {
            ratingDistribution: true,
            sentimentBreakdown: true,
            topIssues: true,
            ratingTrends: true,
            keywordAnalyses: true
          },
          orderBy: { createdAt: "desc" }
        },
        tasks: { orderBy: { createdAt: "desc" }}, 
        feedbacks: { orderBy: { createdAt: "desc" }},
      }
    });

    
    if (!projectRoom) {
      return NextResponse.json({ error: "ProjectRoom not found" }, { status: 404 });
    }


    return NextResponse.json(projectRoom);
  } catch (error) {
    console.error('Error fetching ProjectRoom:', error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}