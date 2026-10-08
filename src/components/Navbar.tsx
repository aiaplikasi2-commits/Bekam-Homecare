import React from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import { Home, Sparkles, Calendar, Calculator, ShieldCheck, UserCheck, MessageSquare } from 'lucide-react';
import type { ContactInfo } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  contactInfo: ContactInfo | null;
  isAdmin: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  contactInfo,
  isAdmin
}) => {
  const getWaUrl = () => {
    const raw = contactInfo?.whatsappNumber || '';
    const clean = raw.replace(/[^0-9]/g, '');
    const formatted = clean.startsWith('0') ? '62' + clean.slice(1) : clean;
    return formatted ? `https://wa.me/${formatted}` : '#';
  };

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-extrabold shadow-md group-hover:scale-105 transition">
              <span className="text-lg">T</span>
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                Terapis Panggilan
              </h1>
              <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 block tracking-wide">
                Bekam & Pijat Homecare
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 font-semibold text-xs">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-xl transition ${
                activeTab === 'home'
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Beranda
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`px-3 py-2 rounded-xl transition ${
                activeTab === 'about'
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Tentang Terapis
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`px-3 py-2 rounded-xl transition ${
                activeTab === 'services'
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Layanan
            </button>

            <button
              onClick={() => setActiveTab('activities')}
              className={`px-3 py-2 rounded-xl transition ${
                activeTab === 'activities'
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Kegiatan & Galeri
            </button>

            <button
              onClick={() => setActiveTab('articles')}
              className={`px-3 py-2 rounded-xl transition ${
                activeTab === 'articles'
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Artikel
            </button>

            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-3 py-2 rounded-xl transition ${
                activeTab === 'calculator'
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Kalkulator
            </button>

            <button
              onClick={() => setActiveTab('coverage')}
              className={`px-3 py-2 rounded-xl transition ${
                activeTab === 'coverage'
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Area Layanan
            </button>
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            <PWAInstallButton />

            {contactInfo?.whatsappNumber && (
              <a
                href={getWaUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-white" />
                <span>WhatsApp</span>
              </a>
            )}

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                isAdmin
                  ? 'bg-amber-500 text-white'
                  : activeTab === 'admin'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isAdmin ? 'Admin' : 'Login Admin'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Navigation Bar for Mobile / Android */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 shadow-2xl">
        <div className="grid grid-cols-5 gap-1">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition ${
              activeTab === 'home'
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span>Beranda</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition ${
              activeTab === 'services'
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Sparkles className="w-5 h-5 mb-0.5" />
            <span>Layanan</span>
          </button>

          <button
            onClick={() => setActiveTab('booking')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition ${
              activeTab === 'booking'
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Calendar className="w-5 h-5 mb-0.5 text-emerald-600" />
            <span>Booking</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition ${
              activeTab === 'calculator'
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Calculator className="w-5 h-5 mb-0.5" />
            <span>Kalkulator</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition ${
              activeTab === 'admin'
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <ShieldCheck className="w-5 h-5 mb-0.5" />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </>
  );
};
