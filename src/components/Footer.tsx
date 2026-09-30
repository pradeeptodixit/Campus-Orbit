import React from 'react';
import Link from 'next/link';
import { Calendar, Shield, Heart, MapPin, Mail, Globe, Code, Compass, User } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-1">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Compass className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Campus<span className="gradient-text">Orbit</span>
            </span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            The Intelligent Campus Event & Community Platform for college society events, registrations, desk check-ins, and campus engagement.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
            <User className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Created & Developed by <strong className="text-white">Pradeepto Dixit</strong></span>
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
              <Link href="/about" className="hover:text-indigo-400 transition">Campus Map & Creator Info</Link>
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

        {/* Creator & Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">Project Links</h4>
          <a
            href="https://github.com/pradeeptodixit/Campus-Orbit"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 font-semibold bg-slate-900/60 p-2.5 rounded-xl border border-indigo-500/20 transition"
          >
            <Code className="w-4 h-4 text-indigo-400" />
            <span>GitHub Repository</span>
          </a>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>contact@pradeeptodixit.dev</span>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Attribution */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 Pradeepto Dixit. All rights reserved.</p>
        <p className="text-slate-400">
          Campus Orbit is an original project designed and developed by <strong className="text-slate-200">Pradeepto Dixit</strong>.
        </p>
      </div>
    </footer>
  );
}
