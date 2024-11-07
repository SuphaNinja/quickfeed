import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    const { title, description, url } = await request.json();

    if (!title || !description || !url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: "Unathorized access, userId not provided" }, { status: 401 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { userId: userId },
        select: { id: true, first_name: true, last_name: true, email: true, profileImageUrl: true }
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const projectRoom = await tx.projectRoom.create({
        data: {
          title,
          description,
          url,
          users: {
            create: {
              userId: userId,
              first_name: user.first_name || "",
              last_name: user.last_name || "",
              email: user.email || "",
              image: user.profileImageUrl,
              role: "admin"
            }
          }
        },
        include: {
          users: true
        }
      });

      return projectRoom;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}