'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { EventCard } from '@/components/EventCard';
import { GlobalSearchModal } from '@/components/GlobalSearchModal';
import { RegistrationModal } from '@/components/RegistrationModal';
import { QRRegistrationPassModal } from '@/components/QRRegistrationPassModal';
import { EventAssistantModal } from '@/components/EventAssistantModal';
import { ToastProvider } from '@/components/Toast';
import { Users, Calendar, ArrowLeft, Mail, Code, Globe, Share2, Sparkles } from 'lucide-react';

export default function ClubDetailPage() {
  return (
    <ToastProvider>
      <ClubDetailPageContent />
    </ToastProvider>
  );
}

function ClubDetailPageContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [club, setClub] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const [searchOpen, setSearchOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [selectedEventForReg, setSelectedEventForReg] = useState<any | null>(null);
  const [confirmedRegistration, setConfirmedRegistration] = useState<any | null>(null);

  useEffect(() => {
    async function fetchClub() {
      try {
        const res = await fetch(`/api/clubs/${slug}`);
        const data = await res.json();
        if (data.success) {
          setClub(data.data);
        }
      } catch (err) {
        console.error('Error fetching club details:', err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchClub();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <Users className="w-12 h-12 text-purple-400" />
          <h1 className="text-2xl font-bold">Club Not Found</h1>
          <Link href="/clubs" className="px-5 py-2.5 bg-purple-600 rounded-xl text-xs font-semibold">
            Back to Clubs
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

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

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full space-y-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Clubs
        </button>

        {/* Club Profile Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
          <div className="h-48 sm:h-64 w-full relative">
            <img src={club.bannerImage} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          </div>

          <div className="p-6 sm:p-8 -mt-16 relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <img
                  src={club.logo}
                  alt={club.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-slate-950 shadow-xl bg-slate-900 shrink-0"
                />
                <div className="space-y-1">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                    {club.category}
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-black text-white">{club.name}</h1>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {club.github && (
                  <a href={club.github} target="_blank" rel="noreferrer" className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 hover:text-purple-400">
                    <Code className="w-4 h-4" />
                  </a>
                )}
                {club.instagram && (
                  <a href={club.instagram} target="_blank" rel="noreferrer" className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 hover:text-purple-400">
                    <Globe className="w-4 h-4" />
                  </a>
                )}
                {club.linkedin && (
                  <a href={club.linkedin} target="_blank" rel="noreferrer" className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 hover:text-purple-400">
                    <Share2 className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">{club.description}</p>
          </div>
        </div>

        {/* Club Events Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              Events Organized by {club.name} ({club.events?.length || 0})
            </h2>
          </div>

          {!club.events || club.events.length === 0 ? (
            <p className="text-xs text-slate-500 py-8">No events currently scheduled by this society.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {club.events.map((ev: any) => (
                <EventCard
                  key={ev.id}
                  event={{ ...ev, club: { name: club.name, logo: club.logo } }}
                  onRegisterClick={(eventToReg) => setSelectedEventForReg(eventToReg)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
