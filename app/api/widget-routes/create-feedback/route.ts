import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const allowedOrigins = ["https://quickfeedwidgetlight.netlify.app"];

export async function POST(request: NextRequest): Promise<NextResponse> {
  const origin = request.headers.get("origin");

  if (origin && allowedOrigins.includes(origin)) {
    const response = await handlePostRequest(request);
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } else {
    return NextResponse.json({ error: "CORS not allowed" }, { status: 403 });
  }
}

async function handlePostRequest(request: NextRequest): Promise<NextResponse> {
  try {
    const data = await request.json();

    const project = await prisma.projectRoom.findUnique({
      where: { id: data.projectRoomId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        projectRoomId: data.projectRoomId,
        name: data.name,
        message: data.message,
        rating: data.rating,
      },
    });

    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'An unknown error occurred during your request.' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
  const origin = request.headers.get("origin");
  if (origin && allowedOrigins.includes(origin)) {
    const response = NextResponse.json({}, { status: 200 });
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return response;
  } else {
    return NextResponse.json({ error: "CORS not allowed" }, { status: 403 });
  }
}
