'use client';

import React, { useState } from 'react';
import { Sparkles, Check, Info } from 'lucide-react';
import { EventCard, EventCardData } from './EventCard';

interface SmartDiscoveryProps {
  events: EventCardData[];
  onRegisterClick: (event: EventCardData) => void;
}

const INTEREST_TAGS = [
  { id: 'Hackathon', label: 'Hackathons & Coding', categoryMatch: 'Hackathon' },
  { id: 'AI', label: 'AI & Machine Learning', categoryMatch: 'Workshop' },
  { id: 'Workshop', label: 'Hands-on Workshops', categoryMatch: 'Workshop' },
  { id: 'Cybersecurity', label: 'Cybersecurity & CTFs', categoryMatch: 'Competition' },
  { id: 'Design', label: 'UI/UX & Design', categoryMatch: 'Workshop' },
  { id: 'Seminar', label: 'Startups & Keynotes', categoryMatch: 'Seminar' },
];

export function SmartDiscovery({ events, onRegisterClick }: SmartDiscoveryProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Hackathon', 'AI']);

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Deterministic Grounded Scoring Formula
  const scoredEvents = events.map((ev) => {
    let score = 0;
    const matchReasons: string[] = [];

    // Interest category match (+10 pts)
    for (const interestId of selectedInterests) {
      if (
        ev.category.toLowerCase().includes(interestId.toLowerCase()) ||
        ev.title.toLowerCase().includes(interestId.toLowerCase()) ||
        ev.shortDescription.toLowerCase().includes(interestId.toLowerCase())
      ) {
        score += 10;
        matchReasons.push(`Matches interest "${interestId}"`);
        break; // Count once per event
      }
    }

    // Availability bonus (+5 pts)
    if (ev.status === 'REGISTRATION_OPEN') {
      score += 5;
      matchReasons.push('Registration open');
    }

    // Featured bonus (+3 pts)
    if (ev.featured) {
      score += 3;
      matchReasons.push('Featured event');
    }

    return { event: ev, score, matchReasons };
  });

  // Sort descending by score
  scoredEvents.sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl border border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Smart Discovery Engine
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select your interests to generate a transparent, rule-based recommendation feed.
            </p>
          </div>
          <span className="text-[11px] font-mono text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full w-fit">
            Deterministic Scoring Formula
          </span>
        </div>

        {/* Interest Toggle Chips */}
        <div className="flex flex-wrap gap-2">
          {INTEREST_TAGS.map((tag) => {
            const isSelected = selectedInterests.includes(tag.id);
            return (
              <button
                key={tag.id}
                onClick={() => toggleInterest(tag.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-500'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                {tag.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recommended Event Cards with Transparent Reasons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scoredEvents.slice(0, 3).map(({ event: ev, matchReasons }) => (
          <div key={ev.id} className="flex flex-col space-y-2">
            {/* Transparent Explanation Tag */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 text-[11px] text-indigo-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">
                Why this event? {matchReasons[0] || 'Upcoming on campus schedule'}
              </span>
            </div>
            <EventCard event={ev} onRegisterClick={onRegisterClick} />
          </div>
        ))}
      </div>
    </div>
  );
}
