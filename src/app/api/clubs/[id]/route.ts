import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const club = await prisma.club.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        events: {
          orderBy: { date: 'asc' },
          include: {
            _count: { select: { registrations: true } },
          },
        },
        _count: { select: { events: true } },
      },
    });

    if (!club) {
      return NextResponse.json({ success: false, error: 'Club not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: club });
  } catch (error: any) {
    console.error('Error fetching club details:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch club details' }, { status: 500 });
  }
}
