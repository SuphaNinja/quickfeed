import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        const { projectRoomId, taskId, title, description, deadline, priority, status } = await request.json();
        
        if (!userId || !projectRoomId || !taskId) {
            return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        }

        const editor = await prisma.projectRoomUser.findFirst({
            where: { userId: userId, projectRoomId: projectRoomId }
        });

        if (!editor) {
            return NextResponse.json({ error: "User not found in project room" }, { status: 404 });
        }

        const taskToEdit = await prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!taskToEdit) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        if (editor.role !== "admin" && editor.id !== taskToEdit.assigneeId) {
            return NextResponse.json({ error: "Only admins and the assignee can edit the task" }, { status: 403 });
        }

        const updateData: any = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (deadline !== undefined) updateData.deadline = new Date(deadline);
        if (priority !== undefined) updateData.priority = priority;
        if (status !== undefined) updateData.status = status;

        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: {
                ...updateData,
                updatedAt: new Date()
            }
        });

        return NextResponse.json({ 
            success: "The task has been updated",
            task: updatedTask
        }, { status: 200 });
        
    } catch (error) {
        console.error('Error updating task:', error);
        return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
    }
}