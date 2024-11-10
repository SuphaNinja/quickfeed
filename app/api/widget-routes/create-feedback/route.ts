import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const data = await request.json();

    // Check if the project exists
    const project = await prisma.projectRoom.findUnique({
      where: { id: data.projectId },
    });

    if (!project) {
      return new NextResponse(JSON.stringify({ error: "Project not found" }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Create the feedback
    const feedback = await prisma.feedback.create({
      data: {
        projectRoomId: data.projectId,
        name: data.name,
        message: data.message,
        rating: data.rating
      },
    });

    return new NextResponse(JSON.stringify(feedback), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'An unknown error occurred during your request.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};