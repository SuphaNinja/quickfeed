import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        const { projectRoomId, title, description, deadline, priority, assigneeId } = await request.json();
        
        if (!userId || !projectRoomId) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        const assignor = await prisma.projectRoomUser.findFirst({
            where: {userId: userId, projectRoomId: projectRoomId}
        })

        if (!assignor) {
            return NextResponse.json({ error: "User in projectRoom not found" }, { status: 404 });
        }
        if (assignor.role !== "admin") {
            return NextResponse.json({ error: "Only admins can assign tasks to people" }, { status: 401 });
        }

        const assignee = await prisma.projectRoomUser.findUnique({
            where: { id: assigneeId }
        })

        if (!assignee) {
            return NextResponse.json({ error: "The user you wanted to assign a task to does not exist." }, { status: 404 });
        }

        const createTask = await prisma.task.create({
            data: {
                title: title,
                description: description,
                deadline: deadline && deadline,
                priority: priority,
                projectRoomId: projectRoomId,
                assigneeId: assignee.id,
                assignorId: assignor.id
            }
        })

        return NextResponse.json({ success: `A new task has been created` }, { status: 200 });
        
    } catch (error) {
        console.error('Error adding user to project room:', error);
        return NextResponse.json({ error: "Failed to add user to project room" }, { status: 500 });
    }
}