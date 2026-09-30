import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const originalEvent = await prisma.event.findUnique({ where: { id } });
    if (!originalEvent) {
      return NextResponse.json({ success: false, error: 'Original event not found' }, { status: 404 });
    }

    const newTitle = `${originalEvent.title} (Copy)`;
    let newSlug = `${originalEvent.slug}-copy-${Math.floor(100 + Math.random() * 900)}`;

    const duplicatedEvent = await prisma.event.create({
      data: {
        clubId: originalEvent.clubId,
        title: newTitle,
        slug: newSlug,
        shortDescription: originalEvent.shortDescription,
        description: originalEvent.description,
        category: originalEvent.category,
        date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days from now
        startTime: originalEvent.startTime,
        endTime: originalEvent.endTime,
        venue: originalEvent.venue,
        venueBuilding: originalEvent.venueBuilding,
        venueRoom: originalEvent.venueRoom,
        venueFloor: originalEvent.venueFloor,
        organizerName: originalEvent.organizerName,
        organizerEmail: originalEvent.organizerEmail,
        capacity: originalEvent.capacity,
        registrationDeadline: new Date(new Date().getTime() + 6 * 24 * 60 * 60 * 1000),
        status: 'DRAFT', // Always set duplicated to DRAFT
        featured: false,
        image: originalEvent.image,
        tags: originalEvent.tags,
      },
    });

    await prisma.auditLog.create({
      data: {
        actor: 'Admin',
        action: 'EVENT_DUPLICATED',
        entityType: 'EVENT',
        entityId: duplicatedEvent.id,
        metadata: JSON.stringify({ originalId: id, newTitle }),
      },
    });

    return NextResponse.json({ success: true, data: duplicatedEvent }, { status: 201 });
  } catch (error: any) {
    console.error('Error duplicating event:', error);
    return NextResponse.json({ success: false, error: 'Failed to duplicate event' }, { status: 500 });
  }
}
