import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateRegistrationCode } from '@/lib/utils';
import { z } from 'zod';

const registrationSchema = z.object({
  eventId: z.string().min(1, 'Event selection is required'),
  name: z.string().min(2, 'Full Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  collegeYear: z.string().min(1, 'College Year is required'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  branch: z.string().optional(),
  studentId: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const eventId = searchParams.get('eventId') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { registrationCode: { contains: search } },
        { phone: { contains: search } },
        { event: { title: { contains: search } } },
      ];
    }

    if (eventId && eventId !== 'All') {
      where.eventId = eventId;
    }

    if (status && status !== 'All') {
      where.status = status;
    }

    const totalCount = await prisma.registration.count({ where });

    const registrations = await prisma.registration.findMany({
      where,
      orderBy: { registeredAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        event: {
          select: { id: true, title: true, date: true, venue: true, capacity: true },
        },
        checkIn: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: registrations,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch registrations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = registrationSchema.parse(body);

    const event = await prisma.event.findUnique({
      where: { id: validated.eventId },
      include: {
        _count: { select: { registrations: true } },
      },
    });

    if (!event) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    if (event.status === 'CANCELLED' || event.status === 'DRAFT') {
      return NextResponse.json({ success: false, error: 'Event is not open for registration' }, { status: 400 });
    }

    const now = new Date();
    if (now > new Date(event.registrationDeadline)) {
      return NextResponse.json({ success: false, error: 'Registration deadline has passed for this event' }, { status: 400 });
    }

    // Smart Duplicate Registration Prevention
    const existingRegistration = await prisma.registration.findUnique({
      where: {
        eventId_email: {
          eventId: validated.eventId,
          email: validated.email.toLowerCase().trim(),
        },
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        {
          success: false,
          error: 'You are already registered for this event.',
          registrationCode: existingRegistration.registrationCode,
          registration: existingRegistration,
        },
        { status: 409 }
      );
    }

    // Capacity & Waitlist logic
    const currentRegistrationCount = event._count.registrations;
    const isFull = currentRegistrationCount >= event.capacity;
    let registrationStatus = 'CONFIRMED';
    let waitlistPosition: number | null = null;

    if (isFull) {
      registrationStatus = 'WAITLISTED';
      const waitlistCount = await prisma.registration.count({
        where: { eventId: validated.eventId, status: 'WAITLISTED' },
      });
      waitlistPosition = waitlistCount + 1;
    }

    // Generate unique code
    let code = generateRegistrationCode();
    let codeCheck = await prisma.registration.findUnique({ where: { registrationCode: code } });
    while (codeCheck) {
      code = generateRegistrationCode();
      codeCheck = await prisma.registration.findUnique({ where: { registrationCode: code } });
    }

    const registration = await prisma.registration.create({
      data: {
        registrationCode: code,
        eventId: validated.eventId,
        name: validated.name.trim(),
        email: validated.email.toLowerCase().trim(),
        collegeYear: validated.collegeYear,
        phone: validated.phone.trim(),
        branch: validated.branch || 'General',
        studentId: validated.studentId || null,
        status: registrationStatus,
        waitlistPosition,
      },
      include: {
        event: {
          select: { title: true, date: true, startTime: true, venue: true },
        },
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        actor: validated.name,
        action: registrationStatus === 'WAITLISTED' ? 'WAITLISTED_REGISTRATION' : 'NEW_REGISTRATION',
        entityType: 'REGISTRATION',
        entityId: registration.id,
        metadata: JSON.stringify({ code: registration.registrationCode, eventTitle: event.title }),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: registrationStatus === 'WAITLISTED' ? `Event is at full capacity. You are #${waitlistPosition} on the waitlist.` : 'Registration confirmed successfully!',
        data: registration,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid registration details', issues: error.issues }, { status: 400 });
    }
    console.error('Error creating registration:', error);
    return NextResponse.json({ success: false, error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
