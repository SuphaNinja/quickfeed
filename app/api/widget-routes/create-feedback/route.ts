import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Handle OPTIONS request (preflight request)
    if (request.method === 'OPTIONS') {
      const headers = new Headers();
      headers.set('Access-Control-Allow-Origin', 'https://quickfeedwidgetlight.netlify.app');  // Allow requests from your widget domain
      headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
      headers.set('Access-Control-Allow-Headers', 'Content-Type');
      return new NextResponse(null, { status: 200, headers });
    }

    // Your existing logic for handling the POST request
    const data = await request.json();

    // Check if the project exists
    const project = await prisma.projectRoom.findUnique({
      where: { id: data.projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
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

    // Return the feedback data in the response
    return NextResponse.json(feedback, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: 'An unknown error occurred during your request.' }, { status: 500 });
  }
}
