import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    console.log(id)
    await prisma.feedback.update({
        where: { id: id },
        data: {
            upvotes: {
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