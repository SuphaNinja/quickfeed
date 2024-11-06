import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
    await prisma.feedback.update({
        where: { id: id },
        data: {
            downvotes: {
                increment: 1
            }
        },
    });

    return NextResponse.json({ 
      message: "Feedback upvoted!", 
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}