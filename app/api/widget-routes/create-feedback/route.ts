import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Enable CORS headers
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', 'https://quickfeedwidgetlight.netlify.app');  // Allow only the widget domain
    headers.set('Access-Control-Allow-Methods', 'POST');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS request (for pre-flight)
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers });
    }

    const data = await request.json();

    // Check if the project exists
    const project = await prisma.projectRoom.findUnique({
      where: { id: data.projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404, headers });
    }

    // Create the feedback
    const feedback = await prisma.feedback.create({
      data: {
        projectRoomId: data.projectId,
        name: data.name,
        message: data.message,
        rating: data.rating,
      },
    });

    return NextResponse.json(feedback, { status: 201, headers });

  } catch (error) {
    return NextResponse.json({ error: 'An unknown error occurred during your request.' }, { status: 500 });
  }
}
