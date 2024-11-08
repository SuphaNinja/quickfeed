import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        const { taskId, projectRoomId } = await request.json();
        
        if (!userId || projectRoomId) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        const user = await prisma.projectRoomUser.findFirst({
            where: {userId: userId, projectRoomId}
        })

        if (!user) {
            return NextResponse.json({ error: "User in projectRoom not found" }, { status: 404 });
        }
        if (user.role !== "admin") {
            return NextResponse.json({ error: "Only admins can delete tasks" }, { status: 401 });
        }

        const taskToDelete = await prisma.task.findUnique({
            where: { id: taskId }
        })

        if (!taskToDelete) {
            return NextResponse.json({ error: "Could not find task to delete" }, { status: 404 });
        }
        await prisma.task.delete({
            where: { id: taskId }
        })

        return NextResponse.json({ success: `Task has been deleted succesfully` }, { status: 200 });
        
    } catch (error) {
        console.error('Error deleting task:', error);
        return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
    }
}