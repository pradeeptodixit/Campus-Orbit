'use client';

import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, Loader2, Sparkles, User, Mail, Phone, GraduationCap, Building2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventCardData } from './EventCard';
import { formatDate } from '@/lib/utils';
import { useToast } from './Toast';

interface RegistrationModalProps {
  event: EventCardData | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (registrationData: any) => void;
}

export function RegistrationModal({ event, isOpen, onClose, onSuccess }: RegistrationModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    collegeYear: '3rd Year',
    phone: '',
    branch: 'Computer Science',
    studentId: '',
  });

  if (!isOpen || !event) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          ...formData,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Registration failed.');
        toast({ title: 'Registration Failed', description: data.error, type: 'error' });
        return;
      }

      // Fire confetti micro-interaction for successful registration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // Fallback gracefully
      }

      toast({
        title: data.data.status === 'WAITLISTED' ? 'Joined Waitlist' : 'Registration Confirmed! 🎉',
        description: data.message,
        type: data.data.status === 'WAITLISTED' ? 'warning' : 'success',
      });

      onSuccess(data.data);
      onClose();
    } catch (err: any) {
      console.error('Error submitting registration:', err);
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800/80 bg-slate-950/50 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Event Registration</span>
            <h3 className="text-lg font-bold text-white line-clamp-1 mt-0.5">{event.title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{formatDate(event.date)} • {event.venue}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="m-6 mb-0 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300">Registration Issue</p>
              <p className="mt-0.5 leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" /> Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Alex Johnson"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" /> College Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="alex.johnson@student.edu"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Phone & College Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-indigo-400" /> Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> College Year *
              </label>
              <select
                value={formData.collegeYear}
                onChange={(e) => setFormData({ ...formData, collegeYear: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>
          </div>

          {/* Branch & Student ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" /> Branch / Major
              </label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                placeholder="Computer Science"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Student Roll / ID (Optional)</label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                placeholder="CS2024-089"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Submission CTA */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Confirming Registration...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Complete Registration</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
