'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  const [formData, setFormData] = useState<any>({
    title: '',
    shortDescription: '',
    description: '',
    category: 'Workshop',
    date: '',
    startTime: '',
    endTime: '',
    venue: '',
    organizerName: '',
    capacity: 100,
    registrationDeadline: '',
    status: 'REGISTRATION_OPEN',
    featured: false,
  });

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events/${id}`);
        const data = await res.json();
        if (data.success) {
          const ev = data.data;
          setFormData({
            title: ev.title,
            shortDescription: ev.shortDescription,
            description: ev.description,
            category: ev.category,
            date: ev.date ? new Date(ev.date).toISOString().split('T')[0] : '',
            startTime: ev.startTime,
            endTime: ev.endTime,
            venue: ev.venue,
            organizerName: ev.organizerName,
            capacity: ev.capacity,
            registrationDeadline: ev.registrationDeadline ? new Date(ev.registrationDeadline).toISOString().split('T')[0] : '',
            status: ev.status,
            featured: ev.featured,
          });
        }
      } catch (err) {
        console.error('Error fetching event for edit:', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchEvent();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setConflictWarning(null);

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 409) {
        setConflictWarning(data.details);
        toast({ title: 'Conflict Warning', description: data.details, type: 'warning' });
        return;
      }

      if (!res.ok || !data.success) {
        toast({ title: 'Update Failed', description: data.error, type: 'error' });
        return;
      }

      toast({ title: 'Event Updated', description: 'Changes saved successfully.', type: 'success' });
      router.push('/admin/events');
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to update event.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-slate-400">Loading event editor...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <Link href="/admin/events" className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Events
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Edit Event Details</h1>
        </div>
      </div>

      {conflictWarning && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Scheduling Conflict</h4>
            <p className="mt-0.5 leading-relaxed">{conflictWarning}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Short Summary *</label>
          <input
            type="text"
            required
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Full Description *</label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Venue *</label>
            <input
              type="text"
              required
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Capacity *</label>
            <input
              type="number"
              required
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value, 10) })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Status *</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
            >
              <option value="DRAFT">Draft</option>
              <option value="REGISTRATION_OPEN">Registration Open</option>
              <option value="REGISTRATION_CLOSED">Registration Closed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Update Event'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
