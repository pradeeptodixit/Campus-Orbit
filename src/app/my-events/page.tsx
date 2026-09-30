'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GlobalSearchModal } from '@/components/GlobalSearchModal';
import { QRRegistrationPassModal } from '@/components/QRRegistrationPassModal';
import { EventAssistantModal } from '@/components/EventAssistantModal';
import { ToastProvider, useToast } from '@/components/Toast';
import { Search, Calendar, QrCode, CheckCircle2, Clock, AlertCircle, MapPin } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function MyEventsPage() {
  return (
    <ToastProvider>
      <MyEventsPageContent />
    </ToastProvider>
  );
}

function MyEventsPageContent() {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [selectedPass, setSelectedPass] = useState<any | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/registrations?search=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.data);
      } else {
        setRegistrations([]);
      }
    } catch (err) {
      console.error('Lookup error:', err);
      toast({ title: 'Lookup Failed', description: 'Could not fetch registrations.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      <Navbar onOpenSearch={() => setSearchOpen(true)} onOpenAssistant={() => setAssistantOpen(true)} />

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <EventAssistantModal isOpen={assistantOpen} onClose={() => setAssistantOpen(false)} />

      <QRRegistrationPassModal
        registration={selectedPass}
        isOpen={Boolean(selectedPass)}
        onClose={() => setSelectedPass(null)}
      />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full space-y-8">
        <div className="space-y-2 text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Student Portal</span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">My Registrations & Passes</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Enter your email address or Registration Code (e.g. <code className="text-indigo-300 font-mono">CC-2026-101</code>) to view your event passes and check-in QR codes.
          </p>
        </div>

        {/* Lookup Box */}
        <form onSubmit={handleLookup} className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your student email or Pass Code..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition shrink-0"
          >
            {loading ? 'Searching...' : 'Lookup Passes'}
          </button>
        </form>

        {/* Results List */}
        {hasSearched && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-300">
              Found Registrations ({registrations.length})
            </h3>

            {registrations.length === 0 ? (
              <div className="text-center py-12 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-2">
                <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-xs font-bold text-slate-300">No registrations found for "{query}"</p>
                <p className="text-[11px] text-slate-500">Please verify the email address or code entered.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {registrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/20">
                          {reg.registrationCode}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            reg.status === 'CHECKED_IN'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : reg.status === 'WAITLISTED'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                          }`}
                        >
                          {reg.status}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white truncate">{reg.event?.title}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{formatDate(reg.event?.date)}</span>
                        <span>•</span>
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="truncate">{reg.event?.venue}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedPass(reg)}
                      className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>View Pass & QR</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
