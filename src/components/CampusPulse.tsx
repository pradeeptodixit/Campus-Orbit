'use client';

import React from 'react';
import { Activity, Calendar, Users, TrendingUp, Sparkles, MapPin } from 'lucide-react';
import Link from 'next/link';

interface CampusPulseProps {
  stats: {
    eventsToday: number;
    eventsThisWeek: number;
    totalRegistrations: number;
    topCategory: string;
    featuredEvent?: {
      title: string;
      slug: string;
      date: string;
      venue: string;
      clubName: string;
      registeredCount: number;
      capacity: number;
    };
  };
}

export function CampusPulse({ stats }: CampusPulseProps) {
  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 shadow-2xl relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Campus Pulse
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </h3>
            <p className="text-xs text-slate-400">Live campus event metrics derived from active database records</p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
          Real-time Verified
        </span>
      </div>

      {/* Grid statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>Today's Events</span>
          </div>
          <p className="text-2xl font-black text-white">{stats.eventsToday}</p>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            <span>This Week</span>
          </div>
          <p className="text-2xl font-black text-white">{stats.eventsThisWeek}</p>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Total Registrations</span>
          </div>
          <p className="text-2xl font-black text-white">{stats.totalRegistrations}</p>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Top Category</span>
          </div>
          <p className="text-base font-bold text-white truncate mt-1">{stats.topCategory || 'Technical'}</p>
        </div>
      </div>

      {/* Featured Event Live Spotlight Bar */}
      {stats.featuredEvent && (
        <div className="bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900/80 rounded-xl p-4 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Featured Spotlight</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-300 font-medium">{stats.featuredEvent.clubName}</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-0.5">{stats.featuredEvent.title}</h4>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                <span>{stats.featuredEvent.date}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-indigo-400" /> {stats.featuredEvent.venue}</span>
              </p>
            </div>
          </div>

          <Link
            href={`/events/${stats.featuredEvent.slug}`}
            className="w-full sm:w-auto text-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md transition"
          >
            Explore Featured
          </Link>
        </div>
      )}
    </div>
  );
}
