import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { OfflineIndicator } from './components/OfflineIndicator';
import { HealthCalculators } from './components/HealthCalculators';
import { BookingForm } from './components/BookingForm';
import { AdminPanel } from './components/AdminPanel';
import { ArticleDetailModal } from './components/ArticleDetailModal';
import { FloatingSocialBar } from './components/FloatingSocialBar';
import type {
  TherapistProfile,
  Service,
  Activity,
  GalleryItem,
  Article,
  Testimonial,
  Booking,
  ServiceArea,
  ContactInfo
} from './types';
import {
  getTherapistProfile,
  getServices,
  getActivities,
  getGalleryItems,
  getArticles,
  getTestimonials,
  getBookings,
  getServiceAreas,
  getContactInfo,
  incrementVisitorCount
} from './services/dataService';
import {
  Sparkles,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Clock,
  PhoneCall,
  MapPin,
  Star,
  ChevronRight,
  MessageSquare,
  BookOpen,
  Camera,
  Image as ImageIcon,
  Award,
  HeartHandshake,
  Droplet,
  Flame,
  ArrowRight
} from 'lucide-react';

function AppContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('home');

  // Firestore Data States
  const [profile, setProfile] = useState<TherapistProfile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  // UI States
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [preSelectedServiceId, setPreSelectedServiceId] = useState<string | undefined>(undefined);
  const [galleryCategory, setGalleryCategory] = useState<string>('all');
  const [loadingData, setLoadingData] = useState(true);

  // Fetch data
  const loadAllData = async () => {
    setLoadingData(true);
    try {
      const [prof, srv, act, gal, art, tst, bkg, areas, cnt] = await Promise.all([
        getTherapistProfile(),
        getServices(),
        getActivities(),
        getGalleryItems(),
        getArticles(user != null),
        getTestimonials(),
        user ? getBookings() : Promise.resolve([]),
        getServiceAreas(),
        getContactInfo(),
      ]);

      setProfile(prof);
      setServices(srv);
      setActivities(act);
      setGallery(gal);
      setArticles(art);
      setTestimonials(tst);
      setBookings(bkg);
      setServiceAreas(areas);
      setContactInfo(cnt);
    } catch (err) {
      console.error('Error loading application data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadAllData();
    incrementVisitorCount();
  }, [user]);

  const handleSelectServiceForBooking = (serviceId?: string) => {
    setPreSelectedServiceId(serviceId);
    setActiveTab('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getWaUrl = () => {
    const raw = contactInfo?.whatsappNumber || '';
    const clean = raw.replace(/[^0-9]/g, '');
    const formatted = clean.startsWith('0') ? '62' + clean.slice(1) : clean;
    return formatted ? `https://wa.me/${formatted}` : '#';
  };

  // Filter gallery items by category
  const filteredGallery = galleryCategory === 'all'
    ? gallery
    : gallery.filter(g => g.category === galleryCategory);

  const galleryCategories = ['all', ...Array.from(new Set(gallery.map(g => g.category)))];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        contactInfo={contactInfo}
        isAdmin={user != null}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
        
        {/* VIEW 1: BERANDA (HOME) */}
        {activeTab === 'home' && (
          <div className="space-y-12 animate-in fade-in">
            
            {/* HERO BANNER */}
            <section className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-6 sm:p-12 lg:p-16 shadow-2xl border border-slate-800">
              {profile?.bannerPhotoUrl && (
                <div className="absolute inset-0 z-0 opacity-25">
                  <img src={profile.bannerPhotoUrl} alt="Banner" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="relative z-10 max-w-3xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 backdrop-blur-md">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Terapis Panggilan Homecare Perorangan</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
                  {profile?.bannerTitle || 'Layanan Bekam Sunnah dan Terapi Pijat ke Rumah Anda'}
                </h1>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                  {profile?.bannerSubtitle || 'Terapi kesehatan tradisional higienis dan profesional. Peralatan steril sekali pakai, nyaman tanpa perlu mengantre keluar rumah.'}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {contactInfo?.whatsappNumber && (
                    <a
                      href={getWaUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xl transition-all hover:scale-105"
                    >
                      <MessageSquare className="w-4 h-4 fill-white" />
                      <span>Hubungi WhatsApp</span>
                    </a>
                  )}

                  <button
                    onClick={() => setActiveTab('booking')}
                    className="inline-flex items-center gap-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 px-6 py-3.5 text-xs sm:text-sm font-bold shadow-xl transition-all hover:scale-105"
                  >
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>{profile?.ctaText || 'Booking Online Sekarang'}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('coverage')}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 hover:bg-slate-800 text-slate-300 px-5 py-3.5 text-xs sm:text-sm font-semibold transition"
                  >
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>Cek Area Layanan</span>
                  </button>
                </div>
              </div>
            </section>

            {/* QUICK ADVANTAGES */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Peralatan Steril</h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Jarum & cup bekam baru dan steril untuk setiap pelanggan demi higienitas penuh.
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Layanan Panggilan</h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Terapis siap datang langsung ke lokasi rumah, apartemen, atau tempat tinggal Anda.
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Terapis Berpengalaman</h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Memahami titik sunnah bekam dan teknik pijat relaksasi penanganan pegal.
                  </p>
                </div>
              </div>
            </section>

            {/* SERVICES PREVIEW */}
            <section className="space-y-6">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Layanan Pilihan</span>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">Daftar Terapi & Pijat</h2>
                </div>
                <button
                  onClick={() => setActiveTab('services')}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  <span>Lihat Semua ({services.length})</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {services.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center border border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-500">Belum ada data layanan diatur. Silakan atur melalui Panel Admin.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.slice(0, 3).map((srv) => (
                    <div key={srv.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition">
                      <div>
                        {srv.photoUrl && (
                          <img src={srv.photoUrl} alt={srv.name} className="w-full h-40 object-cover rounded-2xl mb-4" />
                        )}
                        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{srv.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-black text-emerald-600">
                            Rp {srv.priceRp.toLocaleString('id-ID')}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs font-semibold text-slate-500">{srv.durationMinutes} Menit</span>
                        </div>
                        <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {srv.description}
                        </p>
                      </div>

                      <button
                        onClick={() => handleSelectServiceForBooking(srv.id)}
                        className="w-full rounded-2xl bg-slate-900 hover:bg-emerald-600 dark:bg-slate-800 dark:hover:bg-emerald-600 text-white py-3 text-xs font-bold transition-all"
                      >
                        Pesan Layanan Ini
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* LATEST ACTIVITIES FEED (MINI SOCIAL FEED) */}
            {activities.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Dokumentasi</span>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Kegiatan Terkini Terapis</h2>
                  </div>
                  <button
                    onClick={() => setActiveTab('activities')}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <span>Galeri Kegiatan</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {activities.slice(0, 2).map((act) => (
                    <div key={act.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-md space-y-3">
                      {act.photos && act.photos.length > 0 && (
                        <img src={act.photos[0]} alt={act.title} className="w-full h-48 object-cover rounded-2xl" />
                      )}
                      <span className="text-[10px] font-bold text-emerald-600">{act.activityDate}</span>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{act.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{act.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* TESTIMONIALS */}
            {testimonials.length > 0 && (
              <section className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 space-y-6 border border-emerald-900">
                <div className="text-center max-w-lg mx-auto">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Kepuasan Pelanggan</span>
                  <h2 className="text-2xl sm:text-3xl font-black mt-1">Apa Kata Pelanggan?</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testimonials.map((t) => (
                    <div key={t.id} className="bg-emerald-900/50 p-6 rounded-2xl border border-emerald-800/60 space-y-3">
                      <div className="flex items-center gap-1 text-amber-400">
                        {'★'.repeat(t.rating)}
                      </div>
                      <p className="text-xs text-slate-200 italic leading-relaxed font-sans">
                        "{t.reviewText}"
                      </p>
                      <div className="pt-2 border-t border-emerald-800/60 flex items-center justify-between">
                        <span className="font-extrabold text-xs text-emerald-300">{t.clientName}</span>
                        <span className="text-[10px] text-slate-400">{t.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CONTACT & SOCIAL MEDIA SECTION ON HOME */}
            <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-100 dark:border-slate-800 shadow-xl space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Kontak Resmi & Media Sosial</span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Hubungi & Ikuti Terapis</h2>
                <p className="text-xs text-slate-500">Terhubung langsung melalui WhatsApp atau media sosial resmi terapis.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* WHATSAPP */}
                {contactInfo?.whatsappNumber ? (
                  <a
                    href={getWaUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-center hover:scale-105 transition"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold mb-2 shadow">
                      <MessageSquare className="w-5 h-5 fill-white" />
                    </div>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">WhatsApp</span>
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium truncate max-w-full">{contactInfo.whatsappNumber}</span>
                  </a>
                ) : (
                  <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
                    <MessageSquare className="w-6 h-6 text-slate-400 mb-1" />
                    <span className="text-xs font-bold text-slate-500">WhatsApp</span>
                    <span className="text-[10px] text-slate-400">Atur di Admin</span>
                  </div>
                )}

                {/* INSTAGRAM */}
                {contactInfo?.instagram ? (
                  <a
                    href={contactInfo.instagram.startsWith('http') ? contactInfo.instagram : `https://instagram.com/${contactInfo.instagram.replace('@', '').trim()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 border border-pink-200 dark:border-pink-900/40 text-center hover:scale-105 transition"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center font-bold mb-2 shadow">
                      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </div>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">Instagram</span>
                    <span className="text-[11px] text-rose-600 dark:text-rose-400 font-medium truncate max-w-full">{contactInfo.instagram}</span>
                  </a>
                ) : (
                  <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-lg font-bold text-slate-400 mb-1">IG</span>
                    <span className="text-xs font-bold text-slate-500">Instagram</span>
                    <span className="text-[10px] text-slate-400">Atur di Admin</span>
                  </div>
                )}

                {/* TIKTOK */}
                {contactInfo?.tiktok ? (
                  <a
                    href={contactInfo.tiktok.startsWith('http') ? contactInfo.tiktok : `https://tiktok.com/@${contactInfo.tiktok.replace('@', '').trim()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-center hover:scale-105 transition"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold mb-2 shadow">
                      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-.99.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.57-1.31 1.55-1.35 2.55-.07 1.41.76 2.76 2.02 3.27.87.41 1.9.41 2.8-.01.99-.44 1.67-1.38 1.78-2.45.15-1.8.03-3.62.06-5.43 0-4.08-.01-8.16.02-12.24z"/></svg>
                    </div>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">TikTok</span>
                    <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium truncate max-w-full">{contactInfo.tiktok}</span>
                  </a>
                ) : (
                  <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-lg font-bold text-slate-400 mb-1">TT</span>
                    <span className="text-xs font-bold text-slate-500">TikTok</span>
                    <span className="text-[10px] text-slate-400">Atur di Admin</span>
                  </div>
                )}

                {/* FACEBOOK */}
                {contactInfo?.facebook ? (
                  <a
                    href={contactInfo.facebook.startsWith('http') ? contactInfo.facebook : `https://facebook.com/${contactInfo.facebook.trim()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 text-center hover:scale-105 transition"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold mb-2 shadow">
                      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.847 9 5.052V8z"/></svg>
                    </div>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">Facebook</span>
                    <span className="text-[11px] text-blue-700 dark:text-blue-400 font-medium truncate max-w-full">{contactInfo.facebook}</span>
                  </a>
                ) : (
                  <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-lg font-bold text-slate-400 mb-1">FB</span>
                    <span className="text-xs font-bold text-slate-500">Facebook</span>
                    <span className="text-[10px] text-slate-400">Atur di Admin</span>
                  </div>
                )}
              </div>
            </section>

          </div>
        )}

        {/* VIEW 2: TENTANG TERAPIS (ABOUT) */}
        {activeTab === 'about' && (
          <div className="space-y-8 animate-in fade-in">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Profil Resmi</span>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Tentang Terapis</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Mengenal profil, sertifikasi, visi misi, dan keahlian terapis bekam dan pijat panggilan.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-100 dark:border-slate-800 space-y-8">
              {!profile?.name ? (
                <div className="text-center py-12">
                  <p className="text-sm text-slate-500">Profil terapis belum diisi oleh pengelola. Silakan isi melalui Panel Admin.</p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    {profile.photoUrl ? (
                      <img src={profile.photoUrl} alt={profile.name} className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl object-cover shadow-xl border-4 border-emerald-500/20" />
                    ) : (
                      <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold text-4xl shadow-xl">
                        {profile.name[0]}
                      </div>
                    )}

                    <div className="space-y-4 text-center md:text-left flex-1">
                      <div>
                        <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2">
                          {profile.experienceYears || 'Berpengalaman'}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{profile.name}</h2>
                      </div>

                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {profile.bio || 'Terapis perorangan memberikan layanan bekam sunnah, pijat refleksi, dan relaksasi langsung ke rumah pelanggan.'}
                      </p>

                      {profile.expertise && profile.expertise.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Bidang Keahlian:</h4>
                          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            {profile.expertise.map((exp, i) => (
                              <span key={i} className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200">
                                ✓ {exp}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {profile.certificates && profile.certificates.length > 0 && (
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5 text-emerald-600" />
                        Sertifikasi & Pelatihan Resmi
                      </h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {profile.certificates.map((cert, i) => (
                          <li key={i} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{cert}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(profile.vision || profile.mission) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-slate-100 dark:border-slate-800 pt-6">
                      {profile.vision && (
                        <div className="bg-emerald-50/50 dark:bg-emerald-950/30 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
                          <h4 className="text-sm font-extrabold text-emerald-800 dark:text-emerald-300 mb-1">Visi Terapis</h4>
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{profile.vision}</p>
                        </div>
                      )}

                      {profile.mission && (
                        <div className="bg-emerald-50/50 dark:bg-emerald-950/30 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
                          <h4 className="text-sm font-extrabold text-emerald-800 dark:text-emerald-300 mb-1">Misi Terapis</h4>
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{profile.mission}</p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: LAYANAN (SERVICES) */}
        {activeTab === 'services' && (
          <div className="space-y-8 animate-in fade-in">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Pilihan Terapi</span>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Daftar Layanan Panggilan</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Pilih paket terapi bekam, pijat, atau relaksasi sesuai kebutuhan Anda.
              </p>
            </div>

            {services.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-500">Belum ada layanan ditambahkan. Silakan atur di Panel Admin.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((srv) => (
                  <div key={srv.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col justify-between space-y-4 hover:border-emerald-500 transition">
                    <div className="space-y-3">
                      {srv.photoUrl && (
                        <img src={srv.photoUrl} alt={srv.name} className="w-full h-44 object-cover rounded-2xl" />
                      )}
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{srv.name}</h3>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          {srv.durationMinutes} Menit
                        </span>
                      </div>
                      <div className="text-xl font-black text-emerald-600">
                        Rp {srv.priceRp.toLocaleString('id-ID')}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {srv.description}
                      </p>
                      {srv.notes && (
                        <p className="text-[11px] font-semibold text-slate-500 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
                          📌 {srv.notes}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleSelectServiceForBooking(srv.id)}
                      className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-xs font-bold shadow-lg transition"
                    >
                      Pesan Panggilan Ke Rumah
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: KEGIATAN & GALERI (ACTIVITIES & GALLERY) */}
        {activeTab === 'activities' && (
          <div className="space-y-8 animate-in fade-in">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Dokumentasi Terapi</span>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Kegiatan & Galeri Foto</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Melihat album kegiatan dan bukti pelayanan profesional terapis.
              </p>
            </div>

            {/* Gallery Category Filter */}
            {galleryCategories.length > 1 && (
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {galleryCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setGalleryCategory(cat)}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${
                      galleryCategory === cat
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {cat === 'all' ? 'Semua Foto' : cat}
                  </button>
                ))}
              </div>
            )}

            {/* Gallery Grid */}
            <div className="space-y-6">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Foto Galeri ({filteredGallery.length})</h3>
              {filteredGallery.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center border border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-500">Belum ada foto galeri.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredGallery.map((item) => (
                    <div key={item.id} className="group rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-md">
                      <img src={item.photoUrl} alt={item.title} className="w-full h-40 object-cover group-hover:scale-105 transition duration-300" />
                      <div className="p-3">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase">{item.category}</span>
                        <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">{item.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mini Social Feed Activities */}
            {activities.length > 0 && (
              <div className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Dokumentasi Kegiatan Terapis ({activities.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {activities.map((act) => (
                    <div key={act.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl space-y-3">
                      {act.photos && act.photos.length > 0 && (
                        <div className="grid grid-cols-1 gap-2">
                          <img src={act.photos[0]} alt={act.title} className="w-full h-52 object-cover rounded-2xl" />
                        </div>
                      )}
                      <span className="text-[10px] font-bold text-emerald-600">{act.activityDate}</span>
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{act.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">{act.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 5: ARTIKEL (BLOG) */}
        {activeTab === 'articles' && (
          <div className="space-y-8 animate-in fade-in">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Edukasi Kesehatan</span>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Artikel Kesehatan Tradisional</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Informasi seputar bekam sunnah, pijat refleksi, dan tips menjaga stamina tubuh.
              </p>
            </div>

            {articles.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-500">Belum ada artikel dipublikasikan.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((art) => (
                  <div key={art.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {art.imageUrl && (
                        <img src={art.imageUrl} alt={art.title} className="w-full h-40 object-cover rounded-2xl" />
                      )}
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-bold text-emerald-600">{art.category}</span>
                        <span>{art.publishedDate}</span>
                      </div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">{art.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {art.content}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedArticle(art)}
                      className="w-full rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-800 dark:text-slate-200 py-2.5 text-xs font-bold transition"
                    >
                      Baca Artikel Selengkapnya
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 6: KALKULATOR KESEHATAN */}
        {activeTab === 'calculator' && (
          <div className="animate-in fade-in">
            <HealthCalculators />
          </div>
        )}

        {/* VIEW 7: BOOKING ONLINE */}
        {activeTab === 'booking' && (
          <div className="max-w-xl mx-auto animate-in fade-in">
            <BookingForm
              services={services}
              contactInfo={contactInfo}
              selectedServiceId={preSelectedServiceId}
            />
          </div>
        )}

        {/* VIEW 8: AREA LAYANAN (COVERAGE) */}
        {activeTab === 'coverage' && (
          <div className="space-y-8 animate-in fade-in">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Jangkauan Panggilan</span>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Wilayah Area Layanan</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Terapis melayani panggilan langsung ke rumah di area berikut:
              </p>
            </div>

            {serviceAreas.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-500">Belum ada wilayah layanan diatur.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceAreas.map((area) => (
                  <div key={area.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{area.districtName}</h3>
                        <span className="text-xs font-bold text-emerald-600">Radius Layanan: Hingga {area.radiusKm} KM</span>
                      </div>
                    </div>

                    {area.notes && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                        {area.notes}
                      </p>
                    )}

                    {area.mapEmbedUrl && (
                      <div className="rounded-xl overflow-hidden h-40 border border-slate-200 dark:border-slate-800">
                        <iframe
                          src={area.mapEmbedUrl}
                          className="w-full h-full border-0"
                          allowFullScreen
                          loading="lazy"
                          title={area.districtName}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 9: ADMIN PANEL */}
        {activeTab === 'admin' && (
          <div className="animate-in fade-in">
            <AdminPanel
              profile={profile}
              services={services}
              activities={activities}
              gallery={gallery}
              articles={articles}
              testimonials={testimonials}
              bookings={bookings}
              serviceAreas={serviceAreas}
              contactInfo={contactInfo}
              onRefreshData={loadAllData}
            />
          </div>
        )}

      </main>

      {/* ARTICLE DETAIL MODAL */}
      <ArticleDetailModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      {/* FLOATING ACTION BAR FOR SOCIAL MEDIA */}
      <FloatingSocialBar contactInfo={contactInfo} />

      {/* FOOTER */}
      <Footer
        contactInfo={contactInfo}
        profile={profile}
        setActiveTab={setActiveTab}
      />

      {/* OFFLINE STATUS BANNER */}
      <OfflineIndicator />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
