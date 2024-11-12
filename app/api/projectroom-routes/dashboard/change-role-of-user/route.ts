import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        const { projectRoomId, email, role } = await request.json();
        if (!userId || !projectRoomId) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        if (!email || !role) {
            return NextResponse.json({ error: "No role to change to" }, { status: 404 });
        }
        
        const changer = await prisma.projectRoomUser.findFirst({
            where: {userId: userId, projectRoomId: projectRoomId}
        })

        if (!changer) {
            return NextResponse.json({ error: "User in projectRoom not found" }, { status: 404 });
        }
        if (changer.role !== "admin") {
            return NextResponse.json({ error: "Only admins can invite people" }, { status: 401 });
        }

        const userToChange = await prisma.user.findFirst({
            where: { email: email }
        })

        if (!userToChange) {
            return NextResponse.json({ error: "The user you wanted to change role on does not exist." }, { status: 404 });
        }
        
        const userIsInRoom = await prisma.projectRoomUser.findFirst({
            where: {projectRoomId: projectRoomId, userId: userToChange.userId}
        })

        if (!userIsInRoom) {
            return NextResponse.json({ error: "The user does not exist in this project" }, { status: 400 });
        }

        await prisma.projectRoomUser.updateMany({
            where: {userId: userToChange.userId, projectRoomId: projectRoomId},
            data: {role: role}
        })

        return NextResponse.json({ success: `User role has changed to ${role}` }, { status: 200 });
        
    } catch (error) {
        console.error('Error changing role of the user:', error);
        return NextResponse.json({ error: "Failed to change role of the user" }, { status: 500 });
    }
}