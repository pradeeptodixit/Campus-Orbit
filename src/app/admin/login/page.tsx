'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, ArrowRight, Loader2, Calendar } from 'lucide-react';
import { ToastProvider, useToast } from '@/components/Toast';

export default function AdminLoginPage() {
  return (
    <ToastProvider>
      <AdminLoginContent />
    </ToastProvider>
  );
}

function AdminLoginContent() {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState('admin@campusconnect.edu');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast({ title: 'Admin Authenticated', description: `Welcome back, ${data.user.name}`, type: 'success' });
        router.push('/admin');
      } else {
        setErrorMsg(data.error || 'Invalid credentials');
        toast({ title: 'Authentication Error', description: data.error, type: 'error' });
      }
    } catch (err) {
      setErrorMsg('Login network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Glow Ambient */}
      <div className="absolute w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 relative z-10">
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">CampusConnect Admin</h1>
          <p className="text-xs text-slate-400">Authenticate to access the society management portal.</p>
        </div>

        {/* Demo Credentials Box */}
        <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Demo Admin Credentials:
          </p>
          <p className="font-mono text-[11px]">Email: admin@campusconnect.edu</p>
          <p className="font-mono text-[11px]">Password: admin123</p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" /> Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-400" /> Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
