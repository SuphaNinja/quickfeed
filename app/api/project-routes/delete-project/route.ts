import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const deleteProjectSchema = z.object({
  projectId: z.string().cuid(),
});

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { projectId } = deleteProjectSchema.parse(body);

    // Check if the project exists and if the user is an admin of the project room
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        projectRoom: {
          include: {
            admins: true
          }
        }
      }
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!project.projectRoom) {
      return NextResponse.json({ error: "Project room not found" }, { status: 404 });
    }

    if (project.projectRoom.admins.length === 0) {
      return NextResponse.json({ error: "User is not authorized to delete this project" }, { status: 403 });
    }

    // Delete the project and its associated project room
    await prisma.$transaction(async (prisma) => {
      // Delete the project room
      await prisma.projectRoom.delete({
        where: { id: project.projectRoom!.id },
      });

      // Delete the project
      await prisma.project.delete({
        where: { id: projectId },
      });
    });

    return NextResponse.json({ message: "Project and associated project room deleted successfully" }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}