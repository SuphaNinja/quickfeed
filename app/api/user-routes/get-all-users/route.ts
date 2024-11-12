import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error in GET /api/users/all:', error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}