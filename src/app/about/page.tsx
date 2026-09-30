'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GlobalSearchModal } from '@/components/GlobalSearchModal';
import { EventAssistantModal } from '@/components/EventAssistantModal';
import { ToastProvider } from '@/components/Toast';
import { MapPin, Building, Layers, Navigation, ExternalLink, Calendar } from 'lucide-react';

export default function AboutPage() {
  return (
    <ToastProvider>
      <AboutPageContent />
    </ToastProvider>
  );
}

function AboutPageContent() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);

  const venues = [
    {
      name: 'Main Computer Science Auditorium',
      building: 'Computer Science Block',
      room: 'Auditorium A',
      floor: 'Ground Floor',
      campusArea: 'North Technology Quadrant',
      capacity: 250,
      mapsUrl: 'https://maps.google.com/?q=Computer+Science+Department',
    },
    {
      name: 'Innovation Hub Lab 302',
      building: 'Technology & Engineering Center',
      room: 'Lab 302',
      floor: '3rd Floor',
      campusArea: 'Innovation Park',
      capacity: 80,
      mapsUrl: 'https://maps.google.com/?q=Innovation+Center',
    },
    {
      name: 'Cyber Security Lab (Block C)',
      building: 'Science & Cyber Block',
      room: 'Lab C-204',
      floor: '2nd Floor',
      campusArea: 'Science Quad',
      capacity: 60,
      mapsUrl: 'https://maps.google.com/?q=Science+Block',
    },
    {
      name: 'Media & Design Studio B',
      building: 'Arts & Media Wing',
      room: 'Studio B',
      floor: '1st Floor',
      campusArea: 'Creative Arts Square',
      capacity: 50,
      mapsUrl: 'https://maps.google.com/?q=Arts+Block',
    },
    {
      name: 'University Grand Auditorium',
      building: 'Central Administration Block',
      room: 'Grand Auditorium',
      floor: '1st Floor',
      campusArea: 'Main Campus Square',
      capacity: 500,
      mapsUrl: 'https://maps.google.com/?q=University+Auditorium',
    },
    {
      name: 'Campus Observatory Deck',
      building: 'Physics Science Tower',
      room: 'Rooftop Observatory',
      floor: 'Roof (5th Floor)',
      campusArea: 'Science Quad',
      capacity: 40,
      mapsUrl: 'https://maps.google.com/?q=Observatory',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      <Navbar onOpenSearch={() => setSearchOpen(true)} onOpenAssistant={() => setAssistantOpen(true)} />

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <EventAssistantModal isOpen={assistantOpen} onClose={() => setAssistantOpen(false)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full space-y-12">
        <div className="space-y-3 max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Campus Infrastructure</span>
          <h1 className="text-3xl sm:text-5xl font-black text-white">Campus Venues & Locations</h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            CampusConnect maps official society event venues across campus buildings, auditoriums, and labs.
          </p>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue, idx) => (
            <div
              key={idx}
              className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4 hover:border-indigo-500/40 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                    {venue.campusArea}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Capacity: {venue.capacity}</span>
                </div>

                <h3 className="text-base font-bold text-white pt-1">{venue.name}</h3>

                <div className="space-y-1.5 pt-2 text-xs text-slate-300">
                  <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400 flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-indigo-400" /> Building:</span>
                    <span className="font-semibold text-slate-200">{venue.building}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-indigo-400" /> Room / Hall:</span>
                    <span className="text-slate-200">{venue.room}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-400 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-indigo-400" /> Floor:</span>
                    <span className="text-slate-200">{venue.floor}</span>
                  </div>
                </div>
              </div>

              <a
                href={venue.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-indigo-400" />
                <span>Open in Campus Maps</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
