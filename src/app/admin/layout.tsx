'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Users,
  QrCode,
  TrendingUp,
  History,
  Shield,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { ToastProvider } from '@/components/Toast';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If on login page, skip admin layout shell
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const sidebarLinks = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/events', label: 'Events & Drafts', icon: Calendar },
    { href: '/admin/registrations', label: 'Registrations', icon: Users },
    { href: '/admin/checkin', label: 'Check-In & Scanner', icon: QrCode },
    { href: '/admin/clubs', label: 'Clubs Directory', icon: Shield },
    { href: '/admin/analytics', label: 'Intelligence & Metrics', icon: TrendingUp },
  ];

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col md:flex-row">
        {/* Mobile Header Bar */}
        <div className="md:hidden bg-slate-950 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-40">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-white text-sm">
            <Shield className="w-5 h-5 text-indigo-400" />
            <span>CampusConnect Admin</span>
          </Link>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 text-slate-300 rounded-lg bg-slate-900 border border-slate-800"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Sidebar Container */}
        <aside
          className={`w-full md:w-64 bg-slate-950 border-r border-slate-800/80 p-5 flex flex-col justify-between fixed md:sticky top-0 z-30 h-screen transition-transform duration-300 ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-white tracking-tight">Admin Portal</span>
                <span className="text-[10px] text-indigo-400 font-mono">Super Admin Role</span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className="pt-6 border-t border-slate-900 space-y-2">
            <Link
              href="/"
              target="_blank"
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => router.push('/admin/login')}
              className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Main Admin Content Area */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full min-w-0">{children}</main>
      </div>
    </ToastProvider>
  );
}
