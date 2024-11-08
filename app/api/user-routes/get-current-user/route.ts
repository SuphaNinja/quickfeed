import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { userId: userId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        isSubscribed: true,
        created_at: true,
        updated_at: true,
        projectRoomsUser: {
          include: {
            createdTasks: true,
            assignedTasks: true,
            projectRoom: true
          }
        }
      },
    });

    if (!user) {
      console.error(`User not found for ID: ${userId}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  
    return NextResponse.json(user);

  } catch (error) {
    console.error('Error in GET /api/user-routes/get-current-user:', error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}