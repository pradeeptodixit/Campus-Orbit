'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GlobalSearchModal } from '@/components/GlobalSearchModal';
import { EventAssistantModal } from '@/components/EventAssistantModal';
import { ToastProvider } from '@/components/Toast';
import { Users, Calendar, ArrowRight, Code, Globe, Share2, Search } from 'lucide-react';

export default function ClubsPage() {
  return (
    <ToastProvider>
      <ClubsPageContent />
    </ToastProvider>
  );
}

function ClubsPageContent() {
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const [searchOpen, setSearchOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);

  useEffect(() => {
    async function fetchClubs() {
      try {
        const res = await fetch('/api/clubs');
        const data = await res.json();
        if (data.success) {
          setClubs(data.data);
        }
      } catch (err) {
        console.error('Error fetching clubs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchClubs();
  }, []);

  const categories = ['All', 'Technical', 'Innovation & AI', 'Security & Systems', 'Creative & Design', 'Business & Startup', 'Science & Research'];

  const filteredClubs = clubs.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === 'All' || c.category.toLowerCase() === category.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      <Navbar onOpenSearch={() => setSearchOpen(true)} onOpenAssistant={() => setAssistantOpen(true)} />

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <EventAssistantModal isOpen={assistantOpen} onClose={() => setAssistantOpen(false)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Campus Directory</span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Student Societies & Clubs</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Discover student organizations, technical chapters, creative guilds, and startup incubators on campus.
          </p>
        </div>

        {/* Toolbar Filter */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search club name or category..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  category === cat
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Clubs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-slate-900/50 rounded-2xl animate-pulse border border-slate-800"></div>
            ))}
          </div>
        ) : filteredClubs.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
            <Users className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">No clubs found matching your search</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map((club) => (
              <div
                key={club.id}
                className="glass-card rounded-2xl overflow-hidden border border-slate-800/80 flex flex-col justify-between group"
              >
                {/* Banner Header */}
                <div className="relative h-28 w-full bg-slate-900">
                  <img src={club.bannerImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-950/80 text-purple-300 border border-purple-500/30">
                      {club.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 space-y-3 -mt-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <img
                      src={club.logo}
                      alt={club.name}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-slate-950 shadow-md bg-slate-900 shrink-0"
                    />
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition line-clamp-1">{club.name}</h3>
                      <span className="text-[11px] text-slate-400 font-medium">{club._count?.events || 0} Events Hosted</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{club.description}</p>
                </div>

                {/* Actions */}
                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/60 mt-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    {club.github && <Code className="w-3.5 h-3.5 hover:text-white" />}
                    {club.instagram && <Globe className="w-3.5 h-3.5 hover:text-white" />}
                    {club.linkedin && <Share2 className="w-3.5 h-3.5 hover:text-white" />}
                  </div>

                  <Link
                    href={`/clubs/${club.slug}`}
                    className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
