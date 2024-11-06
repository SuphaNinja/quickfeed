import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';


export async function POST(request: NextRequest) {
  try {

    const { title, description, url, userId } = await request.json();

    if (!title || !description || !url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, first_name: true, last_name: true, email: true, profileImageUrl: true }
      });

      if (!user) {
        throw new Error("User not found");
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
              email: user.email,
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