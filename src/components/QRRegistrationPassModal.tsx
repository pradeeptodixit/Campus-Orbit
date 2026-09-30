'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Calendar, Download, CheckCircle2, MapPin, Clock, User, QrCode, Share2 } from 'lucide-react';
import { formatDate, generateICSFile } from '@/lib/utils';
import { useToast } from './Toast';

interface QRRegistrationPassModalProps {
  registration: any;
  isOpen: boolean;
  onClose: () => void;
}

export function QRRegistrationPassModal({ registration, isOpen, onClose }: QRRegistrationPassModalProps) {
  const { toast } = useToast();
  const [qrSvg, setQrSvg] = useState<string>('');

  useEffect(() => {
    if (registration && registration.registrationCode) {
      // Safe identifier format CC-REG-2026-XXXXX
      const passPayload = `CC-REG-${registration.registrationCode}`;
      QRCode.toDataURL(passPayload, {
        width: 240,
        margin: 2,
        color: {
          dark: '#4F46E5',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrSvg(url))
        .catch((err) => console.error('Error generating QR code:', err));
    }
  }, [registration]);

  if (!isOpen || !registration) return null;

  const handleDownloadICS = () => {
    if (!registration.event) return;
    const icsContent = generateICSFile({
      title: registration.event.title,
      description: `Campus Event Registration Pass: ${registration.registrationCode}`,
      venue: registration.event.venue,
      date: registration.event.date,
      startTime: registration.event.startTime,
      endTime: '17:00',
    });

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${registration.registrationCode}-event.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: 'Calendar File Downloaded', description: 'Event saved as .ics calendar invite.', type: 'success' });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: registration.event?.title || 'CampusConnect Event',
        text: `I registered for ${registration.event?.title}! Pass Code: ${registration.registrationCode}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`Registered for ${registration.event?.title}! Pass Code: ${registration.registrationCode}`);
      toast({ title: 'Pass Code Copied', description: 'Share link copied to clipboard.', type: 'info' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pass Top Banner */}
        <div className="p-6 bg-gradient-to-tr from-indigo-950 via-slate-900 to-purple-950 border-b border-slate-800 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>

          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            {registration.status === 'WAITLISTED' ? 'Joined Waitlist' : 'Registration Confirmed 🎉'}
          </span>

          <h3 className="text-xl font-black text-white mt-3 leading-tight">{registration.event?.title}</h3>
          <p className="text-xs text-slate-400 mt-1 font-mono">ID: {registration.registrationCode}</p>
        </div>

        {/* QR Code Container */}
        <div className="p-6 flex flex-col items-center bg-slate-950">
          <div className="bg-white p-3 rounded-2xl shadow-xl border border-indigo-500/30">
            {qrSvg ? (
              <img src={qrSvg} alt="QR Registration Pass" className="w-48 h-48 object-contain" />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-slate-500">
                <QrCode className="w-12 h-12 animate-pulse" />
              </div>
            )}
          </div>
          <span className="text-[11px] text-slate-400 mt-3 flex items-center gap-1">
            <QrCode className="w-3.5 h-3.5 text-indigo-400" /> Show this QR code at venue desk for instant check-in
          </span>
        </div>

        {/* Pass Details */}
        <div className="p-6 space-y-3 bg-slate-900 border-t border-slate-800 text-xs text-slate-300">
          <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Attendee:</span>
            <span className="font-semibold text-white">{registration.name}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Email:</span>
            <span className="font-semibold text-white">{registration.email}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Venue:</span>
            <span className="font-semibold text-indigo-300">{registration.event?.venue}</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-slate-400">Date & Time:</span>
            <span className="font-semibold text-white">
              {formatDate(registration.event?.date)} • {registration.event?.startTime}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <button
            onClick={handleDownloadICS}
            className="flex-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Add to Calendar</span>
          </button>

          <button
            onClick={handleShare}
            className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
