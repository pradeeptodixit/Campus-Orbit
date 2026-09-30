import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, eventId, checkedInBy = 'Admin Desk' } = body;

    if (!code) {
      return NextResponse.json({ success: false, error: 'Registration code is required' }, { status: 400 });
    }

    const cleanCode = String(code).trim();

    // Find registration by registrationCode or id
    const registration = await prisma.registration.findFirst({
      where: {
        OR: [{ registrationCode: cleanCode }, { id: cleanCode }],
        ...(eventId ? { eventId } : {}),
      },
      include: {
        event: { select: { id: true, title: true, date: true, venue: true } },
        checkIn: true,
      },
    });

    if (!registration) {
      return NextResponse.json(
        {
          success: false,
          status: 'INVALID',
          error: `No registration found matching code "${cleanCode}".`,
        },
        { status: 404 }
      );
    }

    if (registration.status === 'CANCELLED') {
      return NextResponse.json(
        {
          success: false,
          status: 'CANCELLED',
          error: `Registration ${registration.registrationCode} for ${registration.name} was CANCELLED.`,
          data: registration,
        },
        { status: 400 }
      );
    }

    // Check if already checked in
    if (registration.checkIn || registration.status === 'CHECKED_IN') {
      return NextResponse.json({
        success: false,
        status: 'ALREADY_CHECKED_IN',
        error: `Student ${registration.name} (${registration.registrationCode}) is ALREADY CHECKED IN.`,
        data: registration,
        checkedInAt: registration.checkIn?.checkedInAt,
      });
    }

    // Process check-in
    const checkIn = await prisma.checkIn.create({
      data: {
        registrationId: registration.id,
        checkedInBy,
      },
    });

    const updatedRegistration = await prisma.registration.update({
      where: { id: registration.id },
      data: { status: 'CHECKED_IN' },
      include: {
        event: { select: { title: true } },
        checkIn: true,
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        actor: checkedInBy,
        action: 'ATTENDANCE_CHECK_IN',
        entityType: 'CHECK_IN',
        entityId: checkIn.id,
        metadata: JSON.stringify({ student: registration.name, code: registration.registrationCode }),
      },
    });

    return NextResponse.json({
      success: true,
      status: 'CHECKED_IN_SUCCESS',
      message: `🎉 Attendance verified for ${registration.name}!`,
      data: updatedRegistration,
    });
  } catch (error: any) {
    console.error('Error executing check-in:', error);
    return NextResponse.json({ success: false, error: 'Check-in server error' }, { status: 500 });
  }
}
