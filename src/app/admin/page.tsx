'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Users,
  QrCode,
  TrendingUp,
  Plus,
  ArrowRight,
  Shield,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminOverviewPage() {
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/admin/analytics');
        const data = await res.json();
        if (data.success) {
          setAnalytics(data.data);
        }
      } catch (err) {
        console.error('Error fetching admin overview:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-400">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <span className="text-xs">Loading admin intelligence...</span>
      </div>
    );
  }

  const summary = analytics?.summary || {};

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Super Admin Dashboard</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">Campus Intelligence Overview</h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/events/new"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/30 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Event</span>
          </Link>

          <Link
            href="/admin/checkin"
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>Scan Pass</span>
          </Link>
        </div>
      </div>

      {/* Real Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Events</span>
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-black text-white">{summary.totalEvents || 0}</p>
          <p className="text-[11px] text-slate-500">{summary.upcomingEvents || 0} active / upcoming</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Registrations</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-black text-white">{summary.totalRegistrations || 0}</p>
          <p className="text-[11px] text-slate-500">{summary.capacityUtilization || 0}% capacity utilization</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Check-Ins</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-white">{summary.totalCheckIns || 0}</p>
          <p className="text-[11px] text-emerald-400 font-semibold">{summary.attendanceRate || 0}% Verifiable Attendance Rate</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Clubs</span>
            <Shield className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-white">{summary.totalClubs || 0}</p>
          <p className="text-[11px] text-slate-500">Student societies onboarded</p>
        </div>
      </div>

      {/* Main Grid: Category Breakdown & Audit Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Events by Category */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" /> Category Breakdown
          </h3>
          <div className="space-y-3">
            {analytics?.eventsByCategory?.map((cat: any, idx: number) => (
              <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">{cat.category}</span>
                <div className="flex items-center gap-4 text-slate-400">
                  <span>{cat.eventCount} Events</span>
                  <span className="font-semibold text-indigo-400">{cat.registrationCount} Registrations</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real Admin Audit Activity Feed */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" /> System Audit Feed
          </h3>
          <div className="space-y-2.5">
            {analytics?.auditLogs?.slice(0, 6).map((log: any) => (
              <div key={log.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-300">{log.action}</span>
                  <span className="text-slate-500">{formatDate(log.createdAt)}</span>
                </div>
                <p className="text-slate-400 truncate">Actor: {log.actor}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
