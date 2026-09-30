'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Calendar, Users, X, ArrowRight, MapPin, Tag } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const searchApi = async () => {
      setLoading(true);
      try {
        const [eventsRes, clubsRes] = await Promise.all([
          fetch(`/api/events?search=${encodeURIComponent(query)}`),
          fetch('/api/clubs'),
        ]);

        const eventsData = await eventsRes.json();
        const clubsData = await clubsRes.json();

        if (eventsData.success) {
          setEvents(eventsData.data.slice(0, 5));
        }

        if (clubsData.success) {
          const filteredClubs = query
            ? clubsData.data.filter((c: any) =>
                c.name.toLowerCase().includes(query.toLowerCase()) ||
                c.category.toLowerCase().includes(query.toLowerCase())
              )
            : clubsData.data.slice(0, 4);
          setClubs(filteredClubs.slice(0, 4));
        }
      } catch (err) {
        console.error('Error during global search:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(searchApi, 200);
    return () => clearTimeout(timer);
  }, [query, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div className="p-4 border-b border-slate-800/80 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, workshops, clubs, venues, or categories..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 overflow-y-auto space-y-6 flex-1">
          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Searching database...</span>
            </div>
          ) : (
            <>
              {/* Events Section */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  Events ({events.length})
                </h4>
                {events.length === 0 ? (
                  <p className="text-xs text-slate-500 py-2">No matching events found.</p>
                ) : (
                  <div className="space-y-1.5">
                    {events.map((ev) => (
                      <Link
                        key={ev.id}
                        href={`/events/${ev.slug}`}
                        onClick={onClose}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60 transition group"
                      >
                        <div className="space-y-1 min-w-0">
                          <h5 className="text-sm font-semibold text-slate-200 group-hover:text-indigo-300 truncate">
                            {ev.title}
                          </h5>
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span>{formatDate(ev.date)}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-indigo-400" /> {ev.venue}</span>
                            <span>•</span>
                            <span className="text-indigo-400 font-medium">{ev.category}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Clubs Section */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  Clubs & Societies ({clubs.length})
                </h4>
                {clubs.length === 0 ? (
                  <p className="text-xs text-slate-500 py-2">No matching clubs found.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {clubs.map((c) => (
                      <Link
                        key={c.id}
                        href={`/clubs/${c.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 transition group"
                      >
                        <img src={c.logo} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                        <div className="min-w-0">
                          <h5 className="text-xs font-semibold text-slate-200 group-hover:text-purple-300 truncate">
                            {c.name}
                          </h5>
                          <span className="text-[10px] text-slate-400">{c.category}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-3 bg-slate-950/90 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">ESC</kbd> to close</span>
          <span>Verified Campus Database</span>
        </div>
      </div>
    </div>
  );
}
