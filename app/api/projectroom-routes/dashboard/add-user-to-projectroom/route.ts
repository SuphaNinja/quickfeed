import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        const { projectRoomId, email } = await request.json();
        
        if (!userId || !projectRoomId) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
        }

        const inviter = await prisma.projectRoomUser.findFirst({
            where: {userId: userId, projectRoomId: projectRoomId}
        })

        if (!inviter) {
            return NextResponse.json({ error: "User in projectRoom not found" }, { status: 404 });
        }
        if (inviter.role !== "admin") {
            return NextResponse.json({ error: "Only admins can invite people" }, { status: 401 });
        }

        const invitedUser = await prisma.user.findFirst({
            where: { email: email }
        })

        if (!invitedUser) {
            return NextResponse.json({ error: "The user you wanted to invite does not exist. Make sure they create an account first." }, { status: 404 });
        }
        
        const userIsInRoom = await prisma.projectRoomUser.findFirst({
            where: {projectRoomId: projectRoomId, userId: invitedUser.userId}
        })

        if (userIsInRoom) {
            return NextResponse.json({ error: "The user already has access to this project" }, { status: 400 });
        }

        const addedUser = await prisma.projectRoomUser.create({
            data: {
                userId: invitedUser.userId,
                first_name: invitedUser.first_name || "",
                last_name: invitedUser.last_name || "",
                email: invitedUser.email || "",
                image: invitedUser.profileImageUrl,
                role: "user",
                projectRoomId: projectRoomId
            }
        })

        return NextResponse.json( addedUser, { status: 200 });
        
    } catch (error) {
        console.error('Error adding user to project room:', error);
        return NextResponse.json({ error: "Failed to add user to project room" }, { status: 500 });
    }
}