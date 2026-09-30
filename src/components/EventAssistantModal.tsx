'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bot, Send, X, Sparkles, Loader2, Calendar, MapPin } from 'lucide-react';

interface EventAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EventAssistantModal({ isOpen, onClose }: EventAssistantModalProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; references?: any[] }>>([
    {
      sender: 'bot',
      text: "👋 Hi! I'm your **Campus Orbit Assistant**. Ask me about upcoming workshops, hackathons, society events, venues, or registration deadlines on campus!",
    },
  ]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userText = query.trim();
    setQuery('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userText }),
      });

      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: data.answer, references: data.referencedEvents },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: "Sorry, I couldn't process that query right now." },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Network connection issue. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col h-[600px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
              <Bot className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                Campus Event Assistant
                <span className="text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-full font-mono">
                  Grounded AI
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Strictly answers from live database records</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                {m.text}
              </div>

              {/* Referenced Event Chips */}
              {m.references && m.references.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5 max-w-[85%]">
                  {m.references.map((refEv: any) => (
                    <Link
                      key={refEv.id}
                      href={`/events/${refEv.slug}`}
                      onClick={onClose}
                      className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-indigo-500/30 text-indigo-300 text-[11px] rounded-lg flex items-center gap-1.5 transition"
                    >
                      <Calendar className="w-3 h-3" />
                      <span className="truncate">{refEv.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              <span>Querying database events...</span>
            </div>
          )}
        </div>

        {/* Query Input */}
        <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask e.g. 'What hackathons are coming up?'..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-purple-500 transition"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
