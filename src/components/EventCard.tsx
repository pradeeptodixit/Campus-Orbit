'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, MapPin, Users, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { formatDate, getCapacityStatus, getEventDerivedStatus } from '@/lib/utils';

export interface EventCardData {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  category: string;
  date: Date | string;
  startTime: string;
  venue: string;
  capacity: number;
  status: string;
  featured?: boolean;
  image?: string | null;
  registrationDeadline: Date | string;
  club?: { name: string; logo?: string | null };
  _count?: { registrations: number };
  registeredCount?: number;
}

interface EventCardProps {
  event: EventCardData;
  onRegisterClick?: (event: EventCardData) => void;
  showCategory?: boolean;
}

export function EventCard({ event, onRegisterClick, showCategory = true }: EventCardProps) {
  const registered = event.registeredCount ?? event._count?.registrations ?? 0;
  const capacityInfo = getCapacityStatus(registered, event.capacity);
  const statusInfo = getEventDerivedStatus({
    status: event.status,
    date: event.date,
    registrationDeadline: event.registrationDeadline,
    capacity: event.capacity,
    registeredCount: registered,
  });

  const seatsLeft = Math.max(0, event.capacity - registered);

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full border border-slate-800/80 group">
      {/* Event Header Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          {showCategory && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-indigo-300 border border-indigo-500/30">
              {event.category}
            </span>
          )}

          {event.featured && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 flex items-center gap-1 shadow-md shadow-amber-500/20">
              <Sparkles className="w-3 h-3 fill-slate-950" /> Featured
            </span>
          )}
        </div>

        {/* Club Tag */}
        {event.club && (
          <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-800 text-[11px] text-slate-300">
            {event.club.logo ? (
              <img src={event.club.logo} alt="" className="w-3.5 h-3.5 rounded-full object-cover" />
            ) : (
              <Users className="w-3.5 h-3.5 text-indigo-400" />
            )}
            <span className="truncate max-w-[140px] font-medium">{event.club.name}</span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <Link href={`/events/${event.slug}`} className="block group-hover:text-indigo-400 transition">
            <h3 className="text-base font-bold text-white line-clamp-2 leading-snug">{event.title}</h3>
          </Link>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{event.shortDescription}</p>
        </div>

        {/* Key Event Metadata */}
        <div className="space-y-2 pt-2 border-t border-slate-800/60 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>{formatDate(event.date)}</span>
            <span className="text-slate-600">•</span>
            <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>{event.startTime}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-300 truncate">
            <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {/* Smart Capacity Indicator Section */}
        <div className="pt-2 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Users className="w-3 h-3 text-indigo-400" />
              {registered} / {event.capacity} seats filled
            </span>
            <span className={`px-2 py-0.5 rounded-md font-semibold border ${capacityInfo.badgeClass}`}>
              {capacityInfo.label}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                capacityInfo.status === 'FULL'
                  ? 'bg-red-500'
                  : capacityInfo.status === 'ALMOST_FULL'
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500'
              }`}
              style={{ width: `${capacityInfo.percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 flex items-center gap-2">
          <Link
            href={`/events/${event.slug}`}
            className="flex-1 text-center py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition"
          >
            Details
          </Link>

          {statusInfo.isRegisterable ? (
            <button
              onClick={() => onRegisterClick && onRegisterClick(event)}
              className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition flex items-center justify-center gap-1.5 group/btn"
            >
              <span>Register</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition" />
            </button>
          ) : (
            <button
              disabled
              className="flex-1 py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 text-xs font-semibold cursor-not-allowed text-center"
            >
              {statusInfo.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
