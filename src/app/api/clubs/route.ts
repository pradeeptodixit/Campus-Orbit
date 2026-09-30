import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const clubs = await prisma.club.findMany({
      orderBy: { name: 'asc' },
      include: {
        events: {
          select: {
            id: true,
            title: true,
            slug: true,
            date: true,
            status: true,
            category: true,
            image: true,
            capacity: true,
            _count: { select: { registrations: true } },
          },
          orderBy: { date: 'asc' },
        },
        _count: {
          select: { events: true },
        },
      },
    });

    return NextResponse.json({ success: true, count: clubs.length, data: clubs });
  } catch (error: any) {
    console.error('Error fetching clubs:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch clubs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, category, logo, bannerImage, contactEmail, website, instagram, github, linkedin, isFeatured } = body;

    if (!name || !description || !category) {
      return NextResponse.json({ success: false, error: 'Name, category, and description are required' }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const club = await prisma.club.create({
      data: {
        name,
        slug,
        description,
        category,
        logo: logo || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&auto=format&fit=crop&q=80',
        bannerImage: bannerImage || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80',
        contactEmail,
        website,
        instagram,
        github,
        linkedin,
        isFeatured: Boolean(isFeatured),
      },
    });

    return NextResponse.json({ success: true, data: club }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating club:', error);
    return NextResponse.json({ success: false, error: 'Failed to create club' }, { status: 500 });
  }
}
