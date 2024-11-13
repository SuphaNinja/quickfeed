import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }


  } catch (error) {
    console.error('Error in GET /api/user-routes/get-current-user:', error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}