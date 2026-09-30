'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Plus, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminClubsPage() {
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClubs() {
      try {
        const res = await fetch('/api/clubs');
        const data = await res.json();
        if (data.success) {
          setClubs(data.data);
        }
      } catch (err) {
        console.error('Error fetching admin clubs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchClubs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Society Roster</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">Clubs & Societies Directory</h1>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading clubs roster...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((c) => (
            <div key={c.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <img src={c.logo} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0" />
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {c.category}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">{c.name}</h3>
                </div>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{c.description}</p>

              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300">{c._count?.events || 0} Events Hosted</span>
                <Link href={`/clubs/${c.slug}`} target="_blank" className="text-purple-400 font-bold hover:underline">
                  View Public Page
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
