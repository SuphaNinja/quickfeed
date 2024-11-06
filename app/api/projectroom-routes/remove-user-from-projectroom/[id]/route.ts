import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const removeUserSchema = z.object({
    userId: z.string(),
});

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const projectRoomId = params.id;
        const adminId = request.headers.get('x-user-id');

        if (!adminId) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        // Check if the current user is an admin of the project room
        const isAdmin = await prisma.projectRoomAdmin.findFirst({
            where: {
                userId: adminId,
                projectRoomId: projectRoomId,
            },
        });

        if (!isAdmin) {
            return NextResponse.json({ error: "Only admins can remove users" }, { status: 403 });
        }

        const json = await request.json();
        const { userId } = removeUserSchema.parse(json);

        // Don't allow removing the last admin
        const adminCount = await prisma.projectRoomAdmin.count({
            where: { projectRoomId },
        });

        const isUserAdmin = await prisma.projectRoomAdmin.findFirst({
            where: {
                userId,
                projectRoomId,
            },
        });

        if (isUserAdmin && adminCount <= 1) {
            return NextResponse.json({ 
                error: "Cannot remove the last admin from the project room" 
            }, { status: 400 });
        }

        // Remove user from project room and remove their admin status if they have it
        const updatedProjectRoom = await prisma.$transaction(async (prisma) => {
            // Remove admin status if they have it
            if (isUserAdmin) {
                await prisma.projectRoomAdmin.delete({
                    where: {
                        userId_projectRoomId: {
                            userId,
                            projectRoomId,
                        },
                    },
                });
            }

            // Remove user from project room
            return prisma.projectRoom.update({
                where: { id: projectRoomId },
                data: {
                    users: {
                        disconnect: { id: userId }
                    }
                },
                include: {
                    users: true,
                    admins: {
                        include: {
                            user: true
                        }
                    },
                    project: true
                }
            });
        });

        return NextResponse.json(updatedProjectRoom);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        console.error('Error removing user from project room:', error);
        return NextResponse.json({ error: "Failed to remove user from project room" }, { status: 500 });
    }
}