'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Sparkles,
  ArrowRight,
  Search,
  Users,
  Compass,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  Shield,
  Layers,
  ChevronRight,
  User,
  Code,
} from 'lucide-react';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CampusPulse } from '@/components/CampusPulse';
import { EventCard, EventCardData } from '@/components/EventCard';
import { SmartDiscovery } from '@/components/SmartDiscovery';
import { GlobalSearchModal } from '@/components/GlobalSearchModal';
import { RegistrationModal } from '@/components/RegistrationModal';
import { QRRegistrationPassModal } from '@/components/QRRegistrationPassModal';
import { EventAssistantModal } from '@/components/EventAssistantModal';
import { ToastProvider, useToast } from '@/components/Toast';
import { formatDate } from '@/lib/utils';

export default function HomePage() {
  return (
    <ToastProvider>
      <HomePageContent />
    </ToastProvider>
  );
}

function HomePageContent() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventCardData[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [pulseStats, setPulseStats] = useState<any>({
    eventsToday: 0,
    eventsThisWeek: 0,
    totalRegistrations: 0,
    topCategory: 'Technical',
  });

  // Modal States
  const [searchOpen, setSearchOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [selectedEventForReg, setSelectedEventForReg] = useState<EventCardData | null>(null);
  const [confirmedRegistration, setConfirmedRegistration] = useState<any | null>(null);

  // Active Category Filter
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventsRes, clubsRes, analyticsRes] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/clubs'),
          fetch('/api/admin/analytics'),
        ]);

        const eventsData = await eventsRes.json();
        const clubsData = await clubsRes.json();
        const analyticsData = await analyticsRes.json();

        if (eventsData.success) {
          setEvents(eventsData.data);
        }
        if (clubsData.success) {
          setClubs(clubsData.data);
        }
        if (analyticsData.success) {
          const summary = analyticsData.data.summary;
          const featured = eventsData.data.find((e: any) => e.featured);

          setPulseStats({
            eventsToday: summary.upcomingEvents > 0 ? 1 : 0,
            eventsThisWeek: summary.upcomingEvents,
            totalRegistrations: summary.totalRegistrations,
            topCategory: analyticsData.data.eventsByCategory[0]?.category || 'Workshop',
            featuredEvent: featured
              ? {
                  title: featured.title,
                  slug: featured.slug,
                  date: formatDate(featured.date),
                  venue: featured.venue,
                  clubName: featured.club?.name || 'Campus Society',
                  registeredCount: featured._count?.registrations || 0,
                  capacity: featured.capacity,
                }
              : undefined,
          });
        }
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const categories = ['All', 'Hackathon', 'Workshop', 'Seminar', 'Tech Talk', 'Competition', 'Cultural'];

  const filteredEvents = activeCategory === 'All'
    ? events
    : events.filter((ev) => ev.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-indigo-600 selection:text-white">
      {/* Navigation */}
      <Navbar onOpenSearch={() => setSearchOpen(true)} onOpenAssistant={() => setAssistantOpen(true)} />

      {/* Global Modals */}
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

      <main className="flex-1 space-y-16 pt-20 pb-16">
        {/* 1. TOPMOST HERO SECTION WITH PROMINENT CREATOR AUTHORSHIP */}
        <section className="relative pt-12 pb-16 overflow-hidden">
          {/* Ambient Background Gradients */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-pink-500/10 rounded-full blur-[130px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
            {/* Top Product Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-xs font-semibold text-indigo-300 shadow-xl shadow-indigo-950/50 animate-in fade-in duration-500">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Official Product Platform • 2026</span>
            </div>

            {/* Product Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
                Campus <span className="gradient-text">Orbit</span>
              </h1>
              <p className="text-lg sm:text-xl font-semibold text-slate-300 max-w-2xl mx-auto tracking-wide">
                Where Campus Events, Communities &amp; Experiences Come Together.
              </p>
            </div>

            {/* PROMINENT CREATOR / AUTHOR BADGE & IDENTITY */}
            <div className="inline-flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-gradient-to-tr from-slate-900/90 via-slate-900/95 to-slate-950/90 border border-indigo-500/30 shadow-2xl backdrop-blur-xl max-w-md mx-auto transform hover:scale-[1.02] transition duration-300 group">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 group-hover:rotate-12 transition" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300">
                  CREATED &amp; DEVELOPED BY
                </span>
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 group-hover:-rotate-12 transition" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wider gradient-text-cyan uppercase">
                PRADEEPTO DIXIT
              </h2>
              <p className="text-[11px] text-slate-400 mt-1 font-medium flex items-center gap-2">
                <span>Creator &amp; Full-Stack Architect</span>
              </p>
            </div>

            {/* Supporting Product Copy */}
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
              Find workshops, hackathons, competitions, tech talks, cultural events and student societies — all in one intelligent, verifiable platform.
            </p>

            {/* Primary Product CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/events"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition duration-300 flex items-center justify-center gap-2 group"
              >
                <span>Explore Events</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>

              <Link
                href="/clubs"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 font-bold text-sm transition duration-300 flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4 text-indigo-400" />
                <span>Discover Clubs</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 2. LIVE CAMPUS PULSE SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CampusPulse stats={pulseStats} />
        </section>

        {/* 3. SMART DISCOVERY ENGINE */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <SmartDiscovery
            events={events}
            onRegisterClick={(ev) => setSelectedEventForReg(ev)}
          />
        </section>

        {/* 4. UPCOMING EVENTS CATALOG */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Campus Schedule</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Upcoming Events</h2>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                    activeCategory === cat
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
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
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-slate-900/50 rounded-2xl animate-pulse border border-slate-800"></div>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">No events found in this category</h3>
              <p className="text-xs text-slate-500">Check back soon as society leads publish new schedules!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.slice(0, 6).map((ev) => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  onRegisterClick={(eventToReg) => setSelectedEventForReg(eventToReg)}
                />
              ))}
            </div>
          )}

          <div className="text-center pt-4">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-slate-900 hover:bg-slate-800 px-6 py-3 rounded-full border border-indigo-500/20 transition"
            >
              <span>View All {events.length} Campus Events</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* 5. DISCOVER CLUBS & SOCIETIES SPOTLIGHT */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Student Communities</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Clubs & Societies</h2>
            </div>
            <Link href="/clubs" className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1">
              <span>View All Clubs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.slice(0, 6).map((club) => (
              <Link
                key={club.id}
                href={`/clubs/${club.slug}`}
                className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-purple-500/40 transition group flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={club.logo || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&auto=format&fit=crop&q=80'}
                    alt={club.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                      {club.category}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1 group-hover:text-purple-300 transition truncate max-w-[200px]">
                      {club.name}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{club.description}</p>

                <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    {club._count?.events || club.events?.length || 0} Events
                  </span>
                  <span className="text-purple-400 font-semibold group-hover:translate-x-1 transition flex items-center gap-0.5">
                    View Club <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 6. HOW CAMPUS ORBIT WORKS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800/80 space-y-8 relative overflow-hidden">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Product Lifecycle</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">How Campus Orbit Works</h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Designed and developed by Pradeepto Dixit for seamless campus engagement.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 pt-4">
              {[
                { step: '01', title: 'Discover', desc: 'Browse upcoming workshops, hackathons, and society events.' },
                { step: '02', title: 'Explore', desc: 'Inspect full event schedules, venues, capacity, and timelines.' },
                { step: '03', title: 'Register', desc: 'Reserve your seat with instant duplicate prevention & waitlisting.' },
                { step: '04', title: 'Attend', desc: 'Receive your QR Registration Pass and verify attendance at entry.' },
                { step: '05', title: 'Connect', desc: 'Rate events, provide feedback, and join society communities.' },
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 space-y-2 relative group hover:border-indigo-500/40 transition">
                  <span className="text-2xl font-black font-mono text-indigo-500/40 group-hover:text-indigo-400 transition">{item.step}</span>
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
