'use client';

import React, { useState } from 'react';
import { QrCode, CheckCircle2, AlertTriangle, XCircle, Search, UserCheck, Calendar, MapPin } from 'lucide-react';
import { useToast } from '@/components/Toast';
import { formatDate } from '@/lib/utils';

export default function AdminCheckInPage() {
  const { toast } = useToast();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<any | null>(null);

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim(),
          checkedInBy: 'Admin Entry Desk',
        }),
      });

      const data = await res.json();
      setResult(data);

      if (data.status === 'CHECKED_IN_SUCCESS') {
        toast({ title: 'Attendance Verified 🎉', description: data.message, type: 'success' });
      } else if (data.status === 'ALREADY_CHECKED_IN') {
        toast({ title: 'Already Checked In ⚠️', description: data.error, type: 'warning' });
      } else {
        toast({ title: 'Invalid Registration', description: data.error, type: 'error' });
      }
    } catch (err) {
      toast({ title: 'Check-In Error', description: 'Server issue processing check-in.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Desk Operations</span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">Event Check-In & Scanner</h1>
        <p className="text-xs text-slate-400 mt-1">Scan student QR Pass or type Registration Code (e.g. CC-2026-101)</p>
      </div>

      {/* Code Scanner Form */}
      <form onSubmit={handleScanSubmit} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <QrCode className="w-4 h-4 text-emerald-400" /> Enter or Scan Registration Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. CC-2026-101 or CC-REG-2026-101..."
              className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition shrink-0"
            >
              {loading ? 'Verifying...' : 'Verify Entry'}
            </button>
          </div>
        </div>
      </form>

      {/* Verification Result Display */}
      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          {result.status === 'CHECKED_IN_SUCCESS' && (
            <div className="glass-panel p-6 rounded-3xl border border-emerald-500/40 bg-emerald-950/20 space-y-4">
              <div className="flex items-center gap-3 text-emerald-400">
                <CheckCircle2 className="w-8 h-8 shrink-0" />
                <div>
                  <h3 className="text-lg font-bold">Attendance Verified 🎉</h3>
                  <p className="text-xs text-emerald-300">{result.message}</p>
                </div>
              </div>

              {result.data && (
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-400">Attendee:</span>
                    <span className="font-bold text-white">{result.data.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-slate-200">{result.data.email}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-400">Event:</span>
                    <span className="font-bold text-indigo-300">{result.data.event?.title}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Checked In At:</span>
                    <span className="font-mono text-emerald-400">{formatDate(result.data.checkIn?.checkedInAt || new Date())}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {result.status === 'ALREADY_CHECKED_IN' && (
            <div className="glass-panel p-6 rounded-3xl border border-amber-500/40 bg-amber-950/20 space-y-3 text-amber-300">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 shrink-0 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold">Duplicate Check-In Detected ⚠️</h3>
                  <p className="text-xs">{result.error}</p>
                </div>
              </div>
            </div>
          )}

          {result.status === 'INVALID' && (
            <div className="glass-panel p-6 rounded-3xl border border-red-500/40 bg-red-950/20 space-y-3 text-red-300">
              <div className="flex items-center gap-3">
                <XCircle className="w-8 h-8 shrink-0 text-red-400" />
                <div>
                  <h3 className="text-base font-bold">Invalid Registration Code ❌</h3>
                  <p className="text-xs">{result.error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
