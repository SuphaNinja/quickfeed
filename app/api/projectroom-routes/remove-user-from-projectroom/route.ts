import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        const { projectRoomId, removeUserId } = await request.json();
        
        if (!userId || !projectRoomId) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }
        
        const remover = await prisma.projectRoomUser.findFirst({
            where: {userId: userId, projectRoomId: projectRoomId}
        })

        if (!remover) {
            return NextResponse.json({ error: "User in projectRoom not found" }, { status: 404 });
        }
        if (remover.role !== "admin") {
            return NextResponse.json({ error: "Only admins can remove people" }, { status: 401 });
        }

        const userToBeRemoved = await prisma.user.findFirst({
            where: { userId: removeUserId }
        })

        if (!userToBeRemoved) {
            return NextResponse.json({ error: "The user you wanted to invite does not exist. Make sure they create an account first." }, { status: 404 });
        }
        
        const userIsInRoom = await prisma.projectRoomUser.findFirst({
            where: {projectRoomId: projectRoomId, userId: userToBeRemoved.userId}
        })

        if (userIsInRoom) {
            return NextResponse.json({ error: "The user already has access to this project" }, { status: 400 });
        }

        await prisma.projectRoomUser.deleteMany({
            where: {userId: removeUserId, projectRoomId: projectRoomId},
        })

        return NextResponse.json({ success: `User has been removed from the project` }, { status: 200 });
        
    } catch (error) {
        console.error('Error adding user to project room:', error);
        return NextResponse.json({ error: "Failed to add user to project room" }, { status: 500 });
    }
}