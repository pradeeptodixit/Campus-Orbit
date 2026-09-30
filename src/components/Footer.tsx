import React from 'react';
import Link from 'next/link';
import { Calendar, Shield, Heart, MapPin, Mail, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-1">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Campus<span className="gradient-text">Connect</span>
            </span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            The intelligent digital operating system for college society events, registrations, check-ins, and campus engagement.
          </p>
          <div className="flex items-center gap-3 pt-1">
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Database Active
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">Discovery</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="/events" className="hover:text-indigo-400 transition">All Campus Events</Link>
            </li>
            <li>
              <Link href="/clubs" className="hover:text-indigo-400 transition">Clubs & Societies</Link>
            </li>
            <li>
              <Link href="/my-events" className="hover:text-indigo-400 transition">My Registrations</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-indigo-400 transition">Campus Map & Venues</Link>
            </li>
          </ul>
        </div>

        {/* Organizers */}
        <div>
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">Society Leads</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="/admin" className="hover:text-indigo-400 transition">Admin Dashboard</Link>
            </li>
            <li>
              <Link href="/admin/events/new" className="hover:text-indigo-400 transition">Publish New Event</Link>
            </li>
            <li>
              <Link href="/admin/checkin" className="hover:text-indigo-400 transition">Scanner & Check-In</Link>
            </li>
            <li>
              <Link href="/admin/analytics" className="hover:text-indigo-400 transition">Event Intelligence</Link>
            </li>
          </ul>
        </div>

        {/* Contact & Campus Info */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">Campus Hub</h4>
          <div className="flex items-start gap-2 text-xs">
            <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>Central Technology Campus, University Block A</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>events@campusconnect.edu</span>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 CampusConnect. All campus data verified in real-time.</p>
        <p className="flex items-center gap-1">
          Built with precision for society recruitment portfolio.
        </p>
      </div>
    </footer>
  );
}
