import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(timeStr: string): string {
  return timeStr;
}

export function formatFullDateTime(date: Date | string, timeStr: string): string {
  return `${formatDate(date)} • ${timeStr}`;
}

export function getDaysRemaining(targetDate: Date | string): number {
  const diff = new Date(targetDate).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Generate unique registration code e.g. CC-2026-89412
export function generateRegistrationCode(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `CC-${year}-${randomNum}`;
}

// Deterministic Event Capacity status
export type CapacityStatus = 'PLENTY' | 'FILLING_FAST' | 'ALMOST_FULL' | 'FULL';

export function getCapacityStatus(registeredCount: number, capacity: number): {
  status: CapacityStatus;
  label: string;
  badgeClass: string;
  percentage: number;
} {
  const percentage = Math.min(100, Math.round((registeredCount / capacity) * 100));

  if (registeredCount >= capacity) {
    return {
      status: 'FULL',
      label: 'Event Full',
      badgeClass: 'bg-red-500/10 text-red-500 border-red-500/20',
      percentage,
    };
  } else if (percentage >= 90) {
    return {
      status: 'ALMOST_FULL',
      label: 'Almost Full',
      badgeClass: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      percentage,
    };
  } else if (percentage >= 65) {
    return {
      status: 'FILLING_FAST',
      label: 'Filling Fast',
      badgeClass: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
      percentage,
    };
  }
  return {
    status: 'PLENTY',
    label: 'Seats Available',
    badgeClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    percentage,
  };
}

// Deterministic status derivation
export function getEventDerivedStatus(event: {
  status: string;
  date: Date | string;
  registrationDeadline: Date | string;
  capacity: number;
  _count?: { registrations: number };
  registeredCount?: number;
}): {
  key: string;
  label: string;
  colorClass: string;
  isRegisterable: boolean;
} {
  const count = event.registeredCount ?? event._count?.registrations ?? 0;
  const now = new Date();
  const eventDate = new Date(event.date);
  const deadline = new Date(event.registrationDeadline);

  if (event.status === 'DRAFT') {
    return { key: 'DRAFT', label: 'Draft', colorClass: 'bg-slate-500/10 text-slate-400 border-slate-500/20', isRegisterable: false };
  }
  if (event.status === 'CANCELLED') {
    return { key: 'CANCELLED', label: 'Cancelled', colorClass: 'bg-red-500/10 text-red-500 border-red-500/20', isRegisterable: false };
  }
  if (event.status === 'COMPLETED' || eventDate < now) {
    return { key: 'COMPLETED', label: 'Completed', colorClass: 'bg-slate-500/10 text-slate-400 border-slate-500/20', isRegisterable: false };
  }
  if (count >= event.capacity) {
    return { key: 'FULL', label: 'Registration Full', colorClass: 'bg-red-500/10 text-red-500 border-red-500/20', isRegisterable: false };
  }
  if (now > deadline) {
    return { key: 'CLOSED', label: 'Registration Closed', colorClass: 'bg-amber-500/10 text-amber-500 border-amber-500/20', isRegisterable: false };
  }

  return { key: 'OPEN', label: 'Registration Open', colorClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', isRegisterable: true };
}

// Deterministic Scheduling Conflict Detector for Admin
export function detectSchedulingConflict(
  newEvent: { venue: string; date: Date | string; startTime: string; endTime: string; id?: string },
  existingEvents: Array<{ id: string; title: string; venue: string; date: Date | string; startTime: string; endTime: string; status: string }>
): { hasConflict: boolean; message?: string; conflictingEvent?: any } {
  const newDateStr = new Date(newEvent.date).toDateString();

  for (const ev of existingEvents) {
    if (ev.id && ev.id === newEvent.id) continue;
    if (ev.status === 'CANCELLED' || ev.status === 'DRAFT') continue;

    const evDateStr = new Date(ev.date).toDateString();
    if (newDateStr === evDateStr && ev.venue.toLowerCase().trim() === newEvent.venue.toLowerCase().trim()) {
      return {
        hasConflict: true,
        message: `Venue "${newEvent.venue}" is already booked on ${newDateStr} for "${ev.title}" (${ev.startTime} - ${ev.endTime}).`,
        conflictingEvent: ev,
      };
    }
  }

  return { hasConflict: false };
}

// Generate .ics iCalendar file string
export function generateICSFile(event: {
  title: string;
  description: string;
  venue: string;
  date: Date | string;
  startTime: string;
  endTime: string;
}): string {
  const d = new Date(event.date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  const dtStart = `${year}${month}${day}T090000Z`;
  const dtEnd = `${year}${month}${day}T170000Z`;

  const escapeText = (str: string) => str.replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CampusConnect//Campus Event Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(event.description)}`,
    `LOCATION:${escapeText(event.venue)}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `STATUS:CONFIRMED`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

// Generate CSV string from array of objects
export function generateCSV(data: Record<string, any>[]): string {
  if (!data || data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers
      .map((header) => {
        const val = row[header] ?? '';
        const escaped = String(val).replace(/"/g, '""');
        return `"${escaped}"`;
      })
      .join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}
