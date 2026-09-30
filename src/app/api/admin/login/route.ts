import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = String(email).toLowerCase().trim();

    // Check user in database
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: { club: true },
    });

    if (!user || user.passwordHash !== password) {
      return NextResponse.json({ success: false, error: 'Invalid admin credentials' }, { status: 401 });
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        clubId: user.clubId,
        clubName: user.club?.name,
      },
    });

    // Set secure cookie for admin session
    response.cookies.set({
      name: 'campusorbit_admin_session',
      value: JSON.stringify({ id: user.id, role: user.role, email: user.email }),
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error: any) {
    console.error('Error logging in admin:', error);
    return NextResponse.json({ success: false, error: 'Login error' }, { status: 500 });
  }
}
