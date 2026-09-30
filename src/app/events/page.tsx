'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { EventCard, EventCardData } from '@/components/EventCard';
import { GlobalSearchModal } from '@/components/GlobalSearchModal';
import { RegistrationModal } from '@/components/RegistrationModal';
import { QRRegistrationPassModal } from '@/components/QRRegistrationPassModal';
import { EventAssistantModal } from '@/components/EventAssistantModal';
import { ToastProvider } from '@/components/Toast';
import { Search, Filter, Calendar, MapPin, SlidersHorizontal, RefreshCw } from 'lucide-react';

export default function EventsPage() {
  return (
    <ToastProvider>
      <EventsPageContent />
    </ToastProvider>
  );
}

function EventsPageContent() {
  const [events, setEvents] = useState<EventCardData[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [sort, setSort] = useState('soonest');

  // Modals
  const [searchOpen, setSearchOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [selectedEventForReg, setSelectedEventForReg] = useState<EventCardData | null>(null);
  const [confirmedRegistration, setConfirmedRegistration] = useState<any | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category !== 'All') params.set('category', category);
      if (status !== 'All') params.set('status', status);
      params.set('sort', sort);

      const res = await fetch(`/api/events?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setEvents(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [category, status, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents();
  };

  const categories = ['All', 'Hackathon', 'Workshop', 'Seminar', 'Tech Talk', 'Competition', 'Cultural'];

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      <Navbar onOpenSearch={() => setSearchOpen(true)} onOpenAssistant={() => setAssistantOpen(true)} />

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <EventAssistantModal isOpen={assistantOpen} onClose={() => setAssistantOpen(false)} />

      <RegistrationModal
        event={selectedEventForReg}
        isOpen={Boolean(selectedEventForReg)}
        onClose={() => setSelectedEventForReg(null)}
        onSuccess={(reg) => setConfirmedRegistration(reg)}
      />

      <QRRegistrationPassModal
        registration={confirmedRegistration}
        isOpen={Boolean(confirmedRegistration)}
        onClose={() => setConfirmedRegistration(null)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Campus Schedule</span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Campus Events Catalog</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Filter by category, search by venue or title, and register for upcoming society events across campus.
          </p>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search event title, venue, or keywords..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Sorting Select */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="soonest">Sort: Soonest Date</option>
              <option value="latest">Sort: Latest Date</option>
              <option value="most_registered">Sort: Most Registered</option>
              <option value="title">Sort: Alphabetical</option>
            </select>

            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md transition"
            >
              Search
            </button>
          </form>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  category === cat
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-slate-900/50 rounded-2xl animate-pulse border border-slate-800"></div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
            <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">No events matched your search criteria</h3>
            <p className="text-xs text-slate-500">Try clearing your filters or searching for another keyword.</p>
            <button
              onClick={() => {
                setSearch('');
                setCategory('All');
                setStatus('All');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-slate-300 transition"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((ev) => (
              <EventCard
                key={ev.id}
                event={ev}
                onRegisterClick={(eventToReg) => setSelectedEventForReg(eventToReg)}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
