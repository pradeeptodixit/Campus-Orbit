import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Campus Orbit | Created by Pradeepto Dixit',
  description:
    'Campus Orbit — The Intelligent Campus Event & Community Platform, created and developed by Pradeepto Dixit. Discover events, societies, workshops, and instant QR passes.',
  keywords: [
    'Campus Orbit',
    'Pradeepto Dixit',
    'College Events',
    'Society Management',
    'Campus Community',
    'Event Intelligence',
  ],
  authors: [{ name: 'Pradeepto Dixit', url: 'https://github.com/pradeeptodixit/Campus-Orbit' }],
  creator: 'Pradeepto Dixit',
  publisher: 'Pradeepto Dixit',
  openGraph: {
    title: 'Campus Orbit | Created by Pradeepto Dixit',
    description:
      'Campus Orbit — The Intelligent Campus Event & Community Platform, created and developed by Pradeepto Dixit.',
    url: 'https://campus-orbit-sand.vercel.app/',
    siteName: 'Campus Orbit',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Campus Orbit | Created by Pradeepto Dixit',
    description:
      'Campus Orbit — The Intelligent Campus Event & Community Platform, created and developed by Pradeepto Dixit.',
    creator: '@pradeeptodixit',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#090d16] text-slate-100 font-sans">{children}</body>
    </html>
  );
}
