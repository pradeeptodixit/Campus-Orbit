import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { detectSchedulingConflict } from '@/lib/utils';
import { z } from 'zod';

const createEventSchema = z.object({
  clubId: z.string().min(1, 'Club is required'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  shortDescription: z.string().min(10, 'Short description is required'),
  description: z.string().min(20, 'Full description is required'),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Event date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  venue: z.string().min(2, 'Venue is required'),
  venueBuilding: z.string().optional(),
  venueRoom: z.string().optional(),
  venueFloor: z.string().optional(),
  organizerName: z.string().min(2, 'Organizer name is required'),
  organizerEmail: z.string().email().optional().or(z.literal('')),
  capacity: z.number().int().positive('Capacity must be greater than 0'),
  registrationDeadline: z.string().min(1, 'Registration deadline is required'),
  status: z.string().default('REGISTRATION_OPEN'),
  featured: z.boolean().default(false),
  image: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const clubId = searchParams.get('clubId') || '';
    const featured = searchParams.get('featured');
    const sort = searchParams.get('sort') || 'soonest'; // soonest, latest, most_registered, title

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { venue: { contains: search } },
        { category: { contains: search } },
      ];
    }

    if (category && category !== 'All') {
      where.category = category;
    }

    if (status && status !== 'All') {
      where.status = status;
    }

    if (clubId) {
      where.clubId = clubId;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    let orderBy: any = { date: 'asc' };
    if (sort === 'latest') orderBy = { date: 'desc' };
    if (sort === 'title') orderBy = { title: 'asc' };

    const events = await prisma.event.findMany({
      where,
      orderBy,
      include: {
        club: {
          select: { id: true, name: true, logo: true, category: true },
        },
        _count: {
          select: { registrations: true, feedbacks: true },
        },
      },
    });

    // If sorting by most registered
    if (sort === 'most_registered') {
      events.sort((a, b) => b._count.registrations - a._count.registrations);
    }

    return NextResponse.json({ success: true, count: events.length, data: events });
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = createEventSchema.parse(body);

    // Create unique slug from title
    let slug = validatedData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Ensure unique slug
    const existingSlug = await prisma.event.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // Check for scheduling conflict in the same venue
    const allEvents = await prisma.event.findMany({
      select: { id: true, title: true, venue: true, date: true, startTime: true, endTime: true, status: true },
    });

    const conflict = detectSchedulingConflict(
      {
        venue: validatedData.venue,
        date: new Date(validatedData.date),
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
      },
      allEvents
    );

    if (conflict.hasConflict) {
      return NextResponse.json(
        {
          success: false,
          error: 'Scheduling Conflict Detected',
          details: conflict.message,
          conflict: conflict.conflictingEvent,
        },
        { status: 409 }
      );
    }

    const event = await prisma.event.create({
      data: {
        clubId: validatedData.clubId,
        title: validatedData.title,
        slug,
        shortDescription: validatedData.shortDescription,
        description: validatedData.description,
        category: validatedData.category,
        date: new Date(validatedData.date),
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        venue: validatedData.venue,
        venueBuilding: validatedData.venueBuilding,
        venueRoom: validatedData.venueRoom,
        venueFloor: validatedData.venueFloor,
        organizerName: validatedData.organizerName,
        organizerEmail: validatedData.organizerEmail || null,
        capacity: validatedData.capacity,
        registrationDeadline: new Date(validatedData.registrationDeadline),
        status: validatedData.status,
        featured: validatedData.featured,
        image: validatedData.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80',
        tags: JSON.stringify(validatedData.tags || [validatedData.category]),
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        actor: validatedData.organizerName,
        action: 'EVENT_CREATED',
        entityType: 'EVENT',
        entityId: event.id,
        metadata: JSON.stringify({ title: event.title, venue: event.venue }),
      },
    });

    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Validation Error', issues: error.issues }, { status: 400 });
    }
    console.error('Error creating event:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to create event' }, { status: 500 });
  }
}
