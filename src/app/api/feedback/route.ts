import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId, registrationCode, rating, comment } = body;

    if (!eventId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: 'Valid event ID and rating (1-5) are required' }, { status: 400 });
    }

    let registrationId = null;
    if (registrationCode) {
      const reg = await prisma.registration.findFirst({
        where: { registrationCode: String(registrationCode).trim() },
      });
      if (reg) registrationId = reg.id;
    }

    const feedback = await prisma.feedback.create({
      data: {
        eventId,
        registrationId,
        rating: parseInt(rating, 10),
        comment: comment ? String(comment).trim() : null,
      },
    });

    return NextResponse.json({ success: true, message: 'Thank you for your feedback!', data: feedback }, { status: 201 });
  } catch (error: any) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit feedback' }, { status: 500 });
  }
}
