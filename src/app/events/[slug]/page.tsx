'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Share2,
  Download,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Star,
  MessageSquare,
  Building,
  Mail,
  UserCheck,
} from 'lucide-react';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GlobalSearchModal } from '@/components/GlobalSearchModal';
import { RegistrationModal } from '@/components/RegistrationModal';
import { QRRegistrationPassModal } from '@/components/QRRegistrationPassModal';
import { EventAssistantModal } from '@/components/EventAssistantModal';
import { ToastProvider, useToast } from '@/components/Toast';
import { formatDate, getCapacityStatus, getEventDerivedStatus, generateICSFile } from '@/lib/utils';

export default function EventDetailPage() {
  return (
    <ToastProvider>
      <EventDetailPageContent />
    </ToastProvider>
  );
}

function EventDetailPageContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { toast } = useToast();

  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Countdown state
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  // Modals
  const [searchOpen, setSearchOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [regModalOpen, setRegModalOpen] = useState(false);
  const [confirmedRegistration, setConfirmedRegistration] = useState<any | null>(null);

  // Feedback form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [regCodeForFeedback, setRegCodeForFeedback] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${slug}`);
      const data = await res.json();
      if (data.success) {
        setEvent(data.data);
      } else {
        setEvent(null);
      }
    } catch (err) {
      console.error('Error fetching event details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchEvent();
  }, [slug]);

  // Dynamic Countdown Calculator
  useEffect(() => {
    if (!event || !event.date) return;

    const target = new Date(event.date).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [event]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <h1 className="text-2xl font-bold">Event Not Found</h1>
          <p className="text-xs text-slate-400">The event slug you requested does not exist or was deleted.</p>
          <Link href="/events" className="px-5 py-2.5 bg-indigo-600 rounded-xl text-xs font-semibold">
            Back to All Events
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const registeredCount = event.registrations?.length || event._count?.registrations || 0;
  const capacityInfo = getCapacityStatus(registeredCount, event.capacity);
  const statusInfo = getEventDerivedStatus({
    status: event.status,
    date: event.date,
    registrationDeadline: event.registrationDeadline,
    capacity: event.capacity,
    registeredCount,
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.shortDescription,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Link Copied', description: 'Event link copied to clipboard.', type: 'info' });
    }
  };

  const handleDownloadICS = () => {
    const icsContent = generateICSFile({
      title: event.title,
      description: event.shortDescription,
      venue: event.venue,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
    });

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.slug}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: 'Calendar Invite Downloaded', description: 'Saved .ics event file.', type: 'success' });
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingFeedback(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          registrationCode: regCodeForFeedback,
          rating,
          comment,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast({ title: 'Feedback Submitted', description: 'Thank you for your rating!', type: 'success' });
        setComment('');
        fetchEvent();
      } else {
        toast({ title: 'Submission Failed', description: data.error, type: 'error' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to submit feedback.', type: 'error' });
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      <Navbar onOpenSearch={() => setSearchOpen(true)} onOpenAssistant={() => setAssistantOpen(true)} />

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <EventAssistantModal isOpen={assistantOpen} onClose={() => setAssistantOpen(false)} />

      <RegistrationModal
        event={event}
        isOpen={regModalOpen}
        onClose={() => setRegModalOpen(false)}
        onSuccess={(reg) => {
          setConfirmedRegistration(reg);
          fetchEvent();
        }}
      />

      <QRRegistrationPassModal
        registration={confirmedRegistration}
        isOpen={Boolean(confirmedRegistration)}
        onClose={() => setConfirmedRegistration(null)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full space-y-8">
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </button>

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
          <div className="h-64 sm:h-96 w-full relative">
            <img
              src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80'}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-indigo-300 border border-indigo-500/30">
                {event.category}
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusInfo.colorClass}`}>
                {statusInfo.label}
              </span>
            </div>
          </div>

          {/* Hero Content Body */}
          <div className="p-6 sm:p-8 -mt-20 relative z-10 space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">{event.title}</h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">{event.shortDescription}</p>
            </div>

            {/* Event Key Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-3 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
                <Calendar className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">Date & Time</span>
                  <p className="text-xs font-bold text-white">{formatDate(event.date)} • {event.startTime}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
                <MapPin className="w-5 h-5 text-purple-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">Venue Location</span>
                  <p className="text-xs font-bold text-white truncate max-w-[200px]">{event.venue}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
                <Users className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">Capacity</span>
                  <p className="text-xs font-bold text-white">{registeredCount} / {event.capacity} Filled</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Countdown Section (If upcoming) */}
        {timeLeft && (
          <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Live Countdown
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">Event Starts In:</h3>
            </div>

            <div className="flex items-center gap-3 font-mono">
              <div className="bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl text-center min-w-[60px]">
                <span className="text-xl font-black text-indigo-400">{timeLeft.days}</span>
                <span className="block text-[9px] text-slate-400 uppercase">Days</span>
              </div>
              <span className="text-indigo-400 font-bold">:</span>
              <div className="bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl text-center min-w-[60px]">
                <span className="text-xl font-black text-indigo-400">{timeLeft.hours}</span>
                <span className="block text-[9px] text-slate-400 uppercase">Hours</span>
              </div>
              <span className="text-indigo-400 font-bold">:</span>
              <div className="bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl text-center min-w-[60px]">
                <span className="text-xl font-black text-indigo-400">{timeLeft.minutes}</span>
                <span className="block text-[9px] text-slate-400 uppercase">Mins</span>
              </div>
              <span className="text-indigo-400 font-bold">:</span>
              <div className="bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl text-center min-w-[60px]">
                <span className="text-xl font-black text-pink-400">{timeLeft.seconds}</span>
                <span className="block text-[9px] text-slate-400 uppercase">Secs</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content & Registration Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Description */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white">About This Event</h3>
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-line">
                {event.description}
              </div>
            </div>

            {/* Event Lifecycle Timeline */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white">Event Timeline</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">Step 01</span>
                  <h4 className="font-bold text-white">Registration Opens</h4>
                  <p className="text-[11px] text-emerald-400">Active Now</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">Step 02</span>
                  <h4 className="font-bold text-white">Registration Closes</h4>
                  <p className="text-[11px] text-amber-400">{formatDate(event.registrationDeadline)}</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">Step 03</span>
                  <h4 className="font-bold text-white">Event Day Check-In</h4>
                  <p className="text-[11px] text-indigo-400">QR Desk Entry</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">Step 04</span>
                  <h4 className="font-bold text-white">Event Concludes</h4>
                  <p className="text-[11px] text-slate-400">{event.endTime}</p>
                </div>
              </div>
            </div>

            {/* Venue & Location Details */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-indigo-400" /> Venue & Campus Location
              </h3>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Venue Name:</span>
                  <span className="font-bold text-white">{event.venue}</span>
                </div>
                {event.venueBuilding && (
                  <div className="flex items-center justify-between border-t border-slate-900 pt-2">
                    <span className="text-slate-400">Building:</span>
                    <span className="text-slate-200">{event.venueBuilding}</span>
                  </div>
                )}
                {event.venueRoom && (
                  <div className="flex items-center justify-between border-t border-slate-900 pt-2">
                    <span className="text-slate-400">Room / Hall:</span>
                    <span className="text-slate-200">{event.venueRoom}</span>
                  </div>
                )}
                {event.venueFloor && (
                  <div className="flex items-center justify-between border-t border-slate-900 pt-2">
                    <span className="text-slate-400">Floor:</span>
                    <span className="text-slate-200">{event.venueFloor}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Post Event Feedback Ratings & Form */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400" /> Participant Feedback
                </h3>
                <span className="text-xs text-slate-400">{event.feedbacks?.length || 0} Ratings</span>
              </div>

              {/* Feedback Form */}
              <form onSubmit={handleFeedbackSubmit} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-200">Leave Your Rating</h4>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star className={`w-6 h-6 ${rating >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-400 ml-2">{rating} / 5</span>
                </div>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share what you liked about this event..."
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  rows={2}
                ></textarea>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={regCodeForFeedback}
                    onChange={(e) => setRegCodeForFeedback(e.target.value)}
                    placeholder="Reg Pass Code (Optional e.g. CC-2026-101)"
                    className="flex-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={submittingFeedback}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition"
                  >
                    Submit Rating
                  </button>
                </div>
              </form>

              {/* Feedback List */}
              {event.feedbacks && event.feedbacks.length > 0 && (
                <div className="space-y-2 pt-2">
                  {event.feedbacks.map((fb: any) => (
                    <div key={fb.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`w-3 h-3 ${fb.rating >= s ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-500">{formatDate(fb.createdAt)}</span>
                      </div>
                      {fb.comment && <p className="text-slate-300 italic">{fb.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Action Sidebar */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 sticky top-28">
              {/* Capacity Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Capacity Utilization</span>
                  <span className={`px-2 py-0.5 rounded font-bold border ${capacityInfo.badgeClass}`}>
                    {capacityInfo.label}
                  </span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500"
                    style={{ width: `${capacityInfo.percentage}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-400 text-right font-medium">
                  {registeredCount} / {event.capacity} seats filled ({event.capacity - registeredCount} remaining)
                </p>
              </div>

              {/* Main Registration Button */}
              {statusInfo.isRegisterable ? (
                <button
                  onClick={() => setRegModalOpen(true)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition text-center"
                >
                  Register Now 🎉
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 font-bold text-sm cursor-not-allowed text-center"
                >
                  {statusInfo.label}
                </button>
              )}

              {/* Secondary Actions */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleDownloadICS}
                  className="py-2.5 px-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Calendar .ics</span>
                </button>

                <button
                  onClick={handleShare}
                  className="py-2.5 px-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Share Link</span>
                </button>
              </div>

              {/* Organizer Info Box */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3 text-xs">
                <h4 className="font-bold text-slate-300">Society Organizer</h4>
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-indigo-400" /> {event.organizerName}
                  </p>
                  {event.club && (
                    <p className="text-slate-400 text-[11px]">{event.club.name}</p>
                  )}
                  {event.organizerEmail && (
                    <p className="text-indigo-400 text-[11px] truncate flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {event.organizerEmail}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
