import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { projectRoomId } = await request.json();
        
        if (!projectRoomId) {
            return NextResponse.json({ error: "No project id provided" }, { status: 401 });
        }

        const tasks = await prisma.task.findMany({
            where: { projectRoomId: projectRoomId },
            orderBy: { createdAt: "desc" }
        })

        if (!tasks) {
            return NextResponse.json({ error: "Could not find any tasks" }, { status: 404 });
        }

        return NextResponse.json((tasks), { status: 200 });
        
    } catch (error) {
        console.error('Error getting tasks:', error);
        return NextResponse.json({ error: "Failed to get tasks" }, { status: 500 });
    }
}