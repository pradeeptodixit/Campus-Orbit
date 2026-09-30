'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, Download, Filter, CheckCircle2, Clock } from 'lucide-react';
import { formatDate, generateCSV } from '@/lib/utils';
import { useToast } from '@/components/Toast';

export default function AdminRegistrationsPage() {
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedEventId !== 'All') params.set('eventId', selectedEventId);
      if (selectedStatus !== 'All') params.set('status', selectedStatus);

      const [regRes, evRes] = await Promise.all([
        fetch(`/api/registrations?${params.toString()}`),
        fetch('/api/events'),
      ]);

      const regData = await regRes.json();
      const evData = await evRes.json();

      if (regData.success) {
        setRegistrations(regData.data);
      }
      if (evData.success) {
        setEvents(evData.data);
      }
    } catch (err) {
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [selectedEventId, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRegistrations();
  };

  // CSV Exporter (Section 38)
  const handleExportCSV = () => {
    if (registrations.length === 0) {
      toast({ title: 'Export Empty', description: 'No registration data to export.', type: 'warning' });
      return;
    }

    const csvData = registrations.map((r) => ({
      RegistrationCode: r.registrationCode,
      StudentName: r.name,
      Email: r.email,
      Phone: r.phone,
      CollegeYear: r.collegeYear,
      Branch: r.branch || 'N/A',
      StudentID: r.studentId || 'N/A',
      EventTitle: r.event?.title || 'Unknown Event',
      Status: r.status,
      RegisteredAt: formatDate(r.registeredAt),
      CheckedIn: r.checkIn ? 'YES' : 'NO',
      CheckedInAt: r.checkIn?.checkedInAt ? formatDate(r.checkIn.checkedInAt) : 'N/A',
    }));

    const csvString = generateCSV(csvData);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CampusOrbit_Registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'CSV Exported 🎉',
      description: `Exported ${registrations.length} registration records.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Student Database</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">Registration Management</h1>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 w-fit"
        >
          <Download className="w-4 h-4" />
          <span>Export Filtered CSV</span>
        </button>
      </div>

      {/* Toolbar Filter */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student name, email, phone, or code (e.g. CC-2026-101)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
            />
          </div>

          {/* Event Selector */}
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
          >
            <option value="All">All Events</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>{ev.title}</option>
            ))}
          </select>

          {/* Status Selector */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CHECKED_IN">Checked In</option>
            <option value="WAITLISTED">Waitlisted</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Registrations Table */}
      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading registrations...</div>
      ) : registrations.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-300">No students registered yet</h3>
          <p className="text-xs text-slate-500">Registrations will appear here in real-time as students register.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-4">Pass Code</th>
                  <th className="p-4">Student</th>
                  <th className="p-4">Event</th>
                  <th className="p-4">Year / Branch</th>
                  <th className="p-4">Registered At</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {registrations.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-900/60 transition">
                    <td className="p-4 font-mono font-bold text-indigo-300">{r.registrationCode}</td>
                    <td className="p-4">
                      <p className="font-bold text-white">{r.name}</p>
                      <p className="text-[11px] text-slate-400">{r.email}</p>
                      <p className="text-[10px] text-slate-500">{r.phone}</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-200 truncate max-w-[200px]">{r.event?.title}</td>
                    <td className="p-4">
                      <p className="text-slate-200">{r.collegeYear}</p>
                      <p className="text-[10px] text-slate-400">{r.branch || 'General'}</p>
                    </td>
                    <td className="p-4 text-slate-400">{formatDate(r.registeredAt)}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          r.status === 'CHECKED_IN'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : r.status === 'WAITLISTED'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
