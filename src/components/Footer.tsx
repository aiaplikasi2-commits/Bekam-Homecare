import React from 'react';
import type { ContactInfo, TherapistProfile } from '../types';
import { Phone, Mail, MapPin, Shield, MessageSquare, Instagram, Facebook, Youtube } from 'lucide-react';

interface FooterProps {
  contactInfo: ContactInfo | null;
  profile: TherapistProfile | null;
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ contactInfo, profile, setActiveTab }) => {
  const getWaUrl = () => {
    const raw = contactInfo?.whatsappNumber || '';
    const clean = raw.replace(/[^0-9]/g, '');
    const formatted = clean.startsWith('0') ? '62' + clean.slice(1) : clean;
    return formatted ? `https://wa.me/${formatted}` : '#';
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Bio */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-extrabold text-base shadow-md">
                T
              </div>
              <span className="text-base font-extrabold text-white">
                {profile?.name || 'Terapis Panggilan'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Layanan terapis bekam dan pijat panggilan perorangan. Peralatan steril, higienis, dan terpercaya langsung ke lokasi Anda.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigasi Utama</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li><button onClick={() => setActiveTab('home')} className="hover:text-emerald-400 transition">Beranda</button></li>
              <li><button onClick={() => setActiveTab('about')} className="hover:text-emerald-400 transition">Tentang Terapis</button></li>
              <li><button onClick={() => setActiveTab('services')} className="hover:text-emerald-400 transition">Daftar Layanan</button></li>
              <li><button onClick={() => setActiveTab('booking')} className="hover:text-emerald-400 transition">Booking Online</button></li>
              <li><button onClick={() => setActiveTab('calculator')} className="hover:text-emerald-400 transition">Kalkulator Kesehatan</button></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Kontak Resmi</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {contactInfo?.whatsappNumber && (
                <li className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <a href={getWaUrl()} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">
                    WA: {contactInfo.whatsappNumber}
                  </a>
                </li>
              )}
              {contactInfo?.phoneNumber && (
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Telp: {contactInfo.phoneNumber}</span>
                </li>
              )}
              {contactInfo?.email && (
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{contactInfo.email}</span>
                </li>
              )}
              {contactInfo?.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{contactInfo.address}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Admin & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Akses Panel Admin</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pengaturan website, manajemen jadwal booking, galeri, dan artikel dapat dikelola penuh di Panel Admin.
            </p>
            <button
              onClick={() => setActiveTab('admin')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-emerald-400 border border-slate-700 transition"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Masuk Dashboard Admin</span>
            </button>
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 text-center text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} {profile?.name || 'Terapis Bekam & Pijat Panggilan'}. PWA Application.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab('coverage')} className="hover:text-slate-300">Area Layanan</button>
            <button onClick={() => setActiveTab('calculator')} className="hover:text-slate-300">Kalkulator Kesehatan</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
