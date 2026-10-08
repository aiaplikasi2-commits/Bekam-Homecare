import React, { useState } from 'react';
import type { ContactInfo } from '../types';
import { MessageSquare, Share2, X } from 'lucide-react';

interface FloatingSocialBarProps {
  contactInfo: ContactInfo | null;
}

export const FloatingSocialBar: React.FC<FloatingSocialBarProps> = ({ contactInfo }) => {
  const [expanded, setExpanded] = useState(true);

  if (!contactInfo) return null;

  // Format URLs
  const getWaUrl = () => {
    const raw = contactInfo.whatsappNumber || '';
    const clean = raw.replace(/[^0-9]/g, '');
    const formatted = clean.startsWith('0') ? '62' + clean.slice(1) : clean;
    return formatted ? `https://wa.me/${formatted}?text=${encodeURIComponent('Halo Terapis, saya ingin bertanya layanan terapi...')}` : null;
  };

  const getIgUrl = () => {
    if (!contactInfo.instagram) return null;
    if (contactInfo.instagram.startsWith('http')) return contactInfo.instagram;
    const username = contactInfo.instagram.replace('@', '').trim();
    return username ? `https://instagram.com/${username}` : null;
  };

  const getFbUrl = () => {
    if (!contactInfo.facebook) return null;
    if (contactInfo.facebook.startsWith('http')) return contactInfo.facebook;
    return `https://facebook.com/${contactInfo.facebook.trim()}`;
  };

  const getTiktokUrl = () => {
    if (!contactInfo.tiktok) return null;
    if (contactInfo.tiktok.startsWith('http')) return contactInfo.tiktok;
    const handle = contactInfo.tiktok.replace('@', '').trim();
    return handle ? `https://tiktok.com/@${handle}` : null;
  };

  const waUrl = getWaUrl();
  const igUrl = getIgUrl();
  const fbUrl = getFbUrl();
  const tiktokUrl = getTiktokUrl();

  const hasAnySocial = waUrl || igUrl || fbUrl || tiktokUrl;
  if (!hasAnySocial) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 z-40 flex flex-col items-end gap-2.5 animate-in fade-in slide-in-from-bottom-4">
      
      {/* Expanded Social Icons Stack */}
      {expanded && (
        <div className="flex flex-col items-end gap-2 transition-all">
          
          {/* WHATSAPP */}
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 text-xs font-bold shadow-xl transition-all hover:scale-105"
            >
              <span className="hidden sm:inline">Chat WhatsApp</span>
              <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 fill-white" />
              </div>
            </a>
          )}

          {/* INSTAGRAM */}
          {igUrl && (
            <a
              href={igUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:opacity-90 text-white px-3.5 py-2 text-xs font-bold shadow-xl transition-all hover:scale-105"
            >
              <span className="hidden sm:inline">Instagram</span>
              <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center font-black">
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
            </a>
          )}

          {/* TIKTOK */}
          {tiktokUrl && (
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-2xl bg-slate-900 hover:bg-black text-white px-3.5 py-2 text-xs font-bold shadow-xl border border-slate-700 transition-all hover:scale-105"
            >
              <span className="hidden sm:inline">TikTok</span>
              <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center font-black">
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-.99.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.57-1.31 1.55-1.35 2.55-.07 1.41.76 2.76 2.02 3.27.87.41 1.9.41 2.8-.01.99-.44 1.67-1.38 1.78-2.45.15-1.8.03-3.62.06-5.43 0-4.08-.01-8.16.02-12.24z"/>
                </svg>
              </div>
            </a>
          )}

          {/* FACEBOOK */}
          {fbUrl && (
            <a
              href={fbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 text-xs font-bold shadow-xl transition-all hover:scale-105"
            >
              <span className="hidden sm:inline">Facebook</span>
              <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center font-black">
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.847 9 5.052V8z"/>
                </svg>
              </div>
            </a>
          )}

        </div>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-12 h-12 rounded-full bg-slate-900 text-emerald-400 border border-slate-700 flex items-center justify-center shadow-2xl hover:bg-slate-800 transition-all active:scale-95"
        aria-label="Kontak Sosial Media Terapis"
      >
        {expanded ? <X className="w-5 h-5 text-slate-300" /> : <Share2 className="w-5 h-5" />}
      </button>

    </div>
  );
};
