'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Calendar, Users, Shield, Search, Menu, X, Bot } from 'lucide-react';

interface NavbarProps {
  onOpenSearch?: () => void;
  onOpenAssistant?: () => void;
}

export function Navbar({ onOpenSearch, onOpenAssistant }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/events', label: 'Events' },
    { href: '/clubs', label: 'Societies & Clubs' },
    { href: '/my-events', label: 'My Registrations' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-slate-950/85 backdrop-blur-md border-b border-slate-800/60 shadow-xl py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Calendar className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              Campus<span className="gradient-text">Connect</span>
            </span>
            <span className="text-[10px] text-indigo-400 font-medium tracking-wider uppercase">
              Event Intelligence
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80 backdrop-blur-sm">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* Global Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 text-xs font-medium bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-full px-3.5 py-2 transition shadow-sm group"
          >
            <Search className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition" />
            <span>Search</span>
            <kbd className="bg-slate-800 text-slate-400 text-[10px] px-1.5 py-0.5 rounded border border-slate-700">⌘K</kbd>
          </button>

          {/* AI Assistant Button */}
          {onOpenAssistant && (
            <button
              onClick={onOpenAssistant}
              className="flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-purple-600/20 to-indigo-600/20 hover:from-purple-600/30 hover:to-indigo-600/30 text-purple-300 border border-purple-500/30 rounded-full px-3.5 py-2 transition"
            >
              <Bot className="w-4 h-4 text-purple-400" />
              <span>Ask AI</span>
            </button>
          )}

          {/* Admin Portal CTA */}
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-xs font-semibold bg-slate-900 hover:bg-indigo-600 text-slate-200 hover:text-white border border-indigo-500/30 hover:border-indigo-500 rounded-full px-4 py-2 transition duration-200 shadow-md shadow-indigo-950/40"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>Admin Portal</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-300 bg-slate-900 rounded-lg border border-slate-800"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 bg-slate-900 rounded-lg border border-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-indigo-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-slate-800 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  pathname === link.href ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
            {onOpenAssistant && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAssistant();
                }}
                className="w-full flex items-center justify-center gap-2 text-sm font-semibold bg-purple-900/40 text-purple-300 border border-purple-500/30 rounded-xl py-2.5"
              >
                <Bot className="w-4 h-4 text-purple-400" />
                <span>Ask Campus Assistant</span>
              </button>
            )}

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold bg-indigo-600 text-white rounded-xl py-2.5 shadow-lg shadow-indigo-600/30"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
