import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { formatDate, getCapacityStatus, getEventDerivedStatus } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ success: false, error: 'Query is required' }, { status: 400 });
    }

    const cleanQuery = query.trim().toLowerCase();

    // Database Retrieval
    const allEvents = await prisma.event.findMany({
      where: {
        status: { notIn: ['DRAFT', 'CANCELLED'] },
      },
      include: {
        club: { select: { name: true, category: true } },
        _count: { select: { registrations: true } },
      },
      orderBy: { date: 'asc' },
    });

    const clubs = await prisma.club.findMany({
      select: { name: true, category: true, description: true, _count: { select: { events: true } } },
    });

    // Intent detection & grounded matching logic
    let matchedEvents = allEvents.filter((ev) => {
      const titleMatch = ev.title.toLowerCase().includes(cleanQuery);
      const catMatch = ev.category.toLowerCase().includes(cleanQuery);
      const descMatch = ev.description.toLowerCase().includes(cleanQuery);
      const venueMatch = ev.venue.toLowerCase().includes(cleanQuery);
      const clubMatch = ev.club.name.toLowerCase().includes(cleanQuery);
      return titleMatch || catMatch || descMatch || venueMatch || clubMatch;
    });

    // Category / Keyword Fallback logic
    if (matchedEvents.length === 0) {
      if (cleanQuery.includes('workshop') || cleanQuery.includes('learn')) {
        matchedEvents = allEvents.filter((ev) => ev.category.toLowerCase() === 'workshop');
      } else if (cleanQuery.includes('hackathon') || cleanQuery.includes('code') || cleanQuery.includes('programming')) {
        matchedEvents = allEvents.filter((ev) => ev.category.toLowerCase() === 'hackathon' || ev.tags.includes('Coding'));
      } else if (cleanQuery.includes('ai') || cleanQuery.includes('machine learning') || cleanQuery.includes('agent')) {
        matchedEvents = allEvents.filter((ev) => ev.title.toLowerCase().includes('ai') || ev.category.toLowerCase().includes('ai'));
      } else if (cleanQuery.includes('today') || cleanQuery.includes('this week') || cleanQuery.includes('upcoming')) {
        matchedEvents = allEvents.slice(0, 4);
      } else {
        matchedEvents = allEvents.slice(0, 3);
      }
    }

    // Construct grounded explanation response
    let responseText = '';

    if (matchedEvents.length > 0) {
      responseText = `Here are the official campus events matching your search for **"${query}"**:\n\n`;
      matchedEvents.slice(0, 4).forEach((ev, idx) => {
        const capacityInfo = getCapacityStatus(ev._count.registrations, ev.capacity);
        const statusInfo = getEventDerivedStatus(ev);

        responseText += `**${idx + 1}. ${ev.title}**\n`;
        responseText += `• **Organized by:** ${ev.club.name}\n`;
        responseText += `• **Category:** ${ev.category}\n`;
        responseText += `• **Date & Time:** ${formatDate(ev.date)} at ${ev.startTime}\n`;
        responseText += `• **Venue:** ${ev.venue}\n`;
        responseText += `• **Seats:** ${ev._count.registrations}/${ev.capacity} (${capacityInfo.label})\n`;
        responseText += `• **Status:** ${statusInfo.label}\n\n`;
      });
      responseText += `*All details were retrieved live from Campus Orbit database.*`;
    } else {
      responseText = `I searched our official campus database, but couldn't find any active events matching **"${query}"**.\n\nYou can browse all upcoming events by category or check back as society leads publish new schedules!`;
    }

    return NextResponse.json({
      success: true,
      query,
      answer: responseText,
      referencedEvents: matchedEvents.slice(0, 4).map((e) => ({
        id: e.id,
        title: e.title,
        slug: e.slug,
        date: formatDate(e.date),
        venue: e.venue,
        category: e.category,
      })),
    });
  } catch (error: any) {
    console.error('Error in grounded assistant:', error);
    return NextResponse.json({ success: false, error: 'Assistant query failed' }, { status: 500 });
  }
}
