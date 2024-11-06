import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { projectRoomId } = await request.json();

    // Validate the projectRoomId
    if (!projectRoomId) {
      return NextResponse.json({ error: "projectRoomId is required" }, { status: 400 });
    }

    // Fetch feedbacks for the given projectRoomId
    const feedbacks = await prisma.feedback.findMany({
      where: {
        projectRoomId: projectRoomId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ 
        feedbacks
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}