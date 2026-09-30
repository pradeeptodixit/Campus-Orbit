import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { detectSchedulingConflict } from '@/lib/utils';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Search by ID or Slug
    const event = await prisma.event.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        club: true,
        registrations: {
          orderBy: { registeredAt: 'desc' },
          select: {
            id: true,
            registrationCode: true,
            name: true,
            email: true,
            collegeYear: true,
            branch: true,
            status: true,
            registeredAt: true,
            checkIn: true,
          },
        },
        feedbacks: {
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { registrations: true, feedbacks: true },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: event });
  } catch (error: any) {
    console.error('Error fetching event details:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch event details' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existingEvent = await prisma.event.findUnique({ where: { id } });
    if (!existingEvent) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    // Check for scheduling conflict if venue or dates changed
    if (body.venue || body.date || body.startTime || body.endTime) {
      const targetVenue = body.venue || existingEvent.venue;
      const targetDate = body.date ? new Date(body.date) : existingEvent.date;
      const targetStart = body.startTime || existingEvent.startTime;
      const targetEnd = body.endTime || existingEvent.endTime;

      const allEvents = await prisma.event.findMany({
        select: { id: true, title: true, venue: true, date: true, startTime: true, endTime: true, status: true },
      });

      const conflict = detectSchedulingConflict(
        { id: existingEvent.id, venue: targetVenue, date: targetDate, startTime: targetStart, endTime: targetEnd },
        allEvents
      );

      if (conflict.hasConflict) {
        return NextResponse.json(
          { success: false, error: 'Scheduling Conflict', details: conflict.message },
          { status: 409 }
        );
      }
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title: body.title,
        shortDescription: body.shortDescription,
        description: body.description,
        category: body.category,
        date: body.date ? new Date(body.date) : undefined,
        startTime: body.startTime,
        endTime: body.endTime,
        venue: body.venue,
        venueBuilding: body.venueBuilding,
        venueRoom: body.venueRoom,
        venueFloor: body.venueFloor,
        organizerName: body.organizerName,
        organizerEmail: body.organizerEmail,
        capacity: body.capacity ? parseInt(body.capacity, 10) : undefined,
        registrationDeadline: body.registrationDeadline ? new Date(body.registrationDeadline) : undefined,
        status: body.status,
        featured: body.featured !== undefined ? Boolean(body.featured) : undefined,
        image: body.image,
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        actor: body.organizerName || 'Admin',
        action: 'EVENT_UPDATED',
        entityType: 'EVENT',
        entityId: id,
        metadata: JSON.stringify({ title: updatedEvent.title, status: updatedEvent.status }),
      },
    });

    return NextResponse.json({ success: true, data: updatedEvent });
  } catch (error: any) {
    console.error('Error updating event:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    await prisma.event.delete({ where: { id } });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        actor: 'Admin',
        action: 'EVENT_DELETED',
        entityType: 'EVENT',
        entityId: id,
        metadata: JSON.stringify({ title: event.title }),
      },
    });

    return NextResponse.json({ success: true, message: 'Event deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete event' }, { status: 500 });
  }
}
