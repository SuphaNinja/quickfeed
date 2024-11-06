import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const userId = request.headers.get('x-user-id');
    console.log("userId: " , userId)
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    // Fetch the ProjectRoom with related data
    const projectRoom = await prisma.projectRoom.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            assignedTasks: true,
            createdTasks: true
          }
        },
        analyses: {
          include: {
            ratingDistribution: true,
            sentimentBreakdown: true,
            topIssues: true,
            ratingTrends: true,
            keywordAnalyses: true
          }
        },
        tasks: true, 
        feedbacks: true
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