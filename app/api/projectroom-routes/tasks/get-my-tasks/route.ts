import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        const { projectRoomId } = await request.json();
        
        if (!userId || !projectRoomId) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        const user = await prisma.projectRoomUser.findFirst({
            where: {userId: userId, projectRoomId: projectRoomId}
        })

        if (!user) {
            return NextResponse.json({ error: "User in projectRoom not found" }, { status: 404 });
        }

        const myTasks = await prisma.task.findMany({
            where: { assigneeId: user.id, projectRoomId: projectRoomId }
        })

        if (!myTasks) {
            return NextResponse.json({ error: "Cannot find any tasks associated with the user" }, { status: 404 });
        }
        return NextResponse.json((myTasks), { status: 200 });
        3
    } catch (error) {
        console.error('Error getting tasks from the user:', error);
        return NextResponse.json({ error: "Failed to get tasks from the user" }, { status: 500 });
    }
}