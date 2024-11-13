import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { projectRoomId } = await request.json();
        
        if (!projectRoomId) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        const allTasks = await prisma.task.findMany({
            where: {projectRoomId: projectRoomId },
            orderBy: { createdAt: "desc" },
            include: { assignee: true, assignor: true }
        })

        if (!allTasks) {
            return NextResponse.json({ error: "Cannot find any tasks associated with the user" }, { status: 404 });
        }
        return NextResponse.json((allTasks), { status: 200 });
    } catch (error) {
        console.error('Error getting tasks from the user:', error);
        return NextResponse.json({ error: "Failed to get tasks from the user" }, { status: 500 });
    }
}