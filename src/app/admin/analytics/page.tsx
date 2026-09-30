'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, CheckCircle2, Star, Activity, Sparkles } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminAnalyticsPage() {
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
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="py-12 text-center text-slate-400">Calculating event intelligence...</div>;
  }

  const summary = analytics?.summary || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Verifiable Metrics</span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">Event Intelligence & Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">Calculated in real-time from active database records.</p>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Attendance Rate</span>
          <p className="text-3xl font-black text-emerald-400">{summary.attendanceRate}%</p>
          <p className="text-xs text-slate-400">
            Explainable Metric: {summary.totalCheckIns} checked in / {summary.totalRegistrations} registered
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Capacity Utilization</span>
          <p className="text-3xl font-black text-indigo-400">{summary.capacityUtilization}%</p>
          <p className="text-xs text-slate-400">
            {summary.totalRegistrations} filled / {summary.totalCapacity} total seat capacity
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Avg Feedback Rating</span>
          <p className="text-3xl font-black text-amber-400 flex items-center gap-2">
            {summary.averageFeedbackRating} <Star className="w-6 h-6 fill-amber-400 text-amber-400 inline" />
          </p>
          <p className="text-xs text-slate-400">From {summary.feedbackCount} participant reviews</p>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-400" /> Category Breakdown & Popularity
        </h3>
        <div className="space-y-3">
          {analytics?.eventsByCategory?.map((cat: any, idx: number) => (
            <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-white text-sm">{cat.category}</span>
              <div className="flex items-center gap-6 text-slate-300">
                <span>Events: <strong>{cat.eventCount}</strong></span>
                <span className="text-indigo-400 font-bold">Registrations: {cat.registrationCount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log Trail */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-400" /> Complete Audit Trail
        </h3>
        <div className="space-y-2">
          {analytics?.auditLogs?.map((log: any) => (
            <div key={log.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-indigo-300">{log.action}</span>
                <span className="text-slate-400 ml-2 font-mono text-[11px]">[{log.entityType}]</span>
                <p className="text-slate-400 text-[11px] mt-0.5">Actor: {log.actor}</p>
              </div>
              <span className="text-slate-500 font-mono text-[11px]">{formatDate(log.createdAt)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
