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
            where: { userId, projectRoomId }
        });

        if (!remover || remover.role !== "admin") {
            return NextResponse.json({ error: "Only admins can remove users" }, { status: 403 });
        }

        const userToBeRemoved = await prisma.projectRoomUser.findFirst({
            where: { userId: removeUserId, projectRoomId }
        });

        if (!userToBeRemoved) {
            return NextResponse.json({ error: "User not found in project room" }, { status: 404 });
        }

        // Delete dependent tasks first
        await prisma.task.deleteMany({
            where: {
                OR: [
                    { assigneeId: userToBeRemoved.id },
                    { assignorId: userToBeRemoved.id }
                ]
            }
        });

        // Delete the user from the project room
        await prisma.projectRoomUser.delete({
            where: { id: userToBeRemoved.id }
        });

        return NextResponse.json({ success: "User removed from the project room" }, { status: 200 });
    } catch (error) {
        console.error("Error removing user:", error);
        return NextResponse.json({ error: "Failed to remove user from project room" }, { status: 500 });
    }
}
