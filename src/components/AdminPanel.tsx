import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AdminAccessTab } from './AdminAccessTab';
import type {
  TherapistProfile,
  Service,
  Activity,
  GalleryItem,
  Article,
  Testimonial,
  Booking,
  BookingStatus,
  ServiceArea,
  ContactInfo,
  VisitorStats
} from '../types';
import {
  saveTherapistProfile,
  addService,
  updateService,
  deleteService,
  addActivity,
  deleteActivity,
  addGalleryItem,
  deleteGalleryItem,
  addArticle,
  updateArticle,
  deleteArticle,
  addTestimonial,
  deleteTestimonial,
  updateBookingStatus,
  deleteBooking,
  addServiceArea,
  deleteServiceArea,
  saveContactInfo,
  getVisitorStats,
  exportFullDatabaseBackup,
  restoreFullDatabaseBackup
} from '../services/dataService';
import {
  Shield,
  ShieldCheck,
  LogOut,
  User,
  Sparkles,
  Calendar,
  Camera,
  Image as ImageIcon,
  FileText,
  Star,
  MapPin,
  PhoneCall,
  Download,
  Upload,
  BarChart3,
  Check,
  Trash2,
  Edit,
  Plus,
  MessageSquare,
  Lock,
  Mail,
  AlertCircle,
  FileSpreadsheet,
  Printer
} from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

interface AdminPanelProps {
  profile: TherapistProfile | null;
  services: Service[];
  activities: Activity[];
  gallery: GalleryItem[];
  articles: Article[];
  testimonials: Testimonial[];
  bookings: Booking[];
  serviceAreas: ServiceArea[];
  contactInfo: ContactInfo | null;
  onRefreshData: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  profile,
  services,
  activities,
  gallery,
  articles,
  testimonials,
  bookings,
  serviceAreas,
  contactInfo,
  onRefreshData
}) => {
  const { user, loginEmail, registerEmail, loginGoogle, resetPassword, logout } = useAuth();

  // Auth form states
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [emailInput, setEmailInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Admin Tab selection
  const [adminTab, setAdminTab] = useState<
    'overview' | 'profile' | 'services' | 'bookings' | 'activities' | 'gallery' | 'articles' | 'testimonials' | 'areas' | 'contact' | 'backup' | 'admins'
  >('overview');

  // Visitor Stats
  const [stats, setStats] = useState<VisitorStats>({ totalVisits: 0 });

  useEffect(() => {
    if (user) {
      getVisitorStats().then(setStats);
    }
  }, [user]);

  // Auth submission handlers
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setAuthLoading(true);

    try {
      if (authMode === 'login') {
        await loginEmail(emailInput, passInput);
      } else if (authMode === 'register') {
        await registerEmail(emailInput, passInput);
        setAuthSuccess('Pendaftaran berhasil! Anda sudah masuk.');
      } else if (authMode === 'forgot') {
        await resetPassword(emailInput);
        setAuthSuccess('Email instruksi reset password telah dikirim ke ' + emailInput);
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Terjadi kesalahan autentikasi.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    setAuthSuccess(null);
    setAuthLoading(true);

    try {
      await loginGoogle();
    } catch (err: any) {
      setAuthError(err?.message || 'Gagal masuk dengan Google.');
    } finally {
      setAuthLoading(false);
    }
  };

  // IF NOT LOGGED IN -> SHOW AUTH FORM
  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white mx-auto shadow-lg mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {authMode === 'login' && 'Login Panel Admin'}
            {authMode === 'register' && 'Daftar Akun Terapis'}
            {authMode === 'forgot' && 'Reset Password'}
          </h2>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[11px] font-bold border border-amber-200 dark:border-amber-800">
            <Lock className="w-3.5 h-3.5" />
            <span>Terkunci Khusus Pemilik Website</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Akses khusus pemilik terapis untuk mengelola profil, layanan, jadwal booking, dan konten.
          </p>
        </div>

        {authError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {authSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{authSuccess}</span>
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-emerald-600" />
              Email Terapis
            </label>
            <input
              type="email"
              placeholder="nama@terapis.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {authMode !== 'forgot' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={authLoading}
            className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 py-3 text-xs sm:text-sm font-bold text-white shadow-lg transition"
          >
            {authLoading
              ? 'Memproses...'
              : authMode === 'login'
              ? 'Masuk ke Dashboard'
              : authMode === 'register'
              ? 'Daftar Akun Baru'
              : 'Kirim Link Reset Password'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400 bg-white dark:bg-slate-900 px-2">Atau</div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={authLoading}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Masuk Dengan Google</span>
        </button>

        <div className="mt-6 flex items-center justify-center text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
          {authMode === 'login' ? (
            <button onClick={() => setAuthMode('forgot')} className="hover:underline flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              Lupa Password Anda?
            </button>
          ) : (
            <button onClick={() => setAuthMode('login')} className="hover:underline">Kembali ke Form Login</button>
          )}
        </div>
      </div>
    );
  }

  // LOGGED IN ADMIN DASHBOARD
  return (
    <div className="space-y-6">
      
      {/* Admin Header Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              <Shield className="w-3.5 h-3.5" />
              Panel Administrator
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black mt-2">Dashboard Terapis</h2>
          <p className="text-xs text-slate-400">Masuk sebagai: <strong className="text-slate-200">{user.email}</strong></p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-xs font-bold text-slate-300 hover:text-rose-300 border border-slate-700 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Admin</span>
        </button>
      </div>

      {/* Admin Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setAdminTab('overview')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition ${
            adminTab === 'overview' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Ringkasan</span>
        </button>

        <button
          onClick={() => setAdminTab('profile')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition ${
            adminTab === 'profile' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profil & Banner</span>
        </button>

        <button
          onClick={() => setAdminTab('services')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition ${
            adminTab === 'services' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Layanan ({services.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('bookings')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition ${
            adminTab === 'bookings' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span>Booking ({bookings.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('activities')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition ${
            adminTab === 'activities' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Kegiatan ({activities.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('gallery')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition ${
            adminTab === 'gallery' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Galeri ({gallery.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('articles')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition ${
            adminTab === 'articles' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Artikel ({articles.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('testimonials')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition ${
            adminTab === 'testimonials' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Testimoni ({testimonials.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('areas')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition ${
            adminTab === 'areas' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Area Layanan ({serviceAreas.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('contact')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition ${
            adminTab === 'contact' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          <span>Kontak & Sosmed</span>
        </button>

        <button
          onClick={() => setAdminTab('backup')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition ${
            adminTab === 'backup' ? 'bg-amber-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Backup & Export</span>
        </button>

        <button
          onClick={() => setAdminTab('admins')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition ${
            adminTab === 'admins' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Akses Admin</span>
        </button>
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {adminTab === 'overview' && (
        <AdminOverviewTab
          bookings={bookings}
          articles={articles}
          activities={activities}
          gallery={gallery}
          testimonials={testimonials}
          services={services}
          stats={stats}
          profile={profile}
        />
      )}

      {/* TAB CONTENT: PROFILE & BANNER */}
      {adminTab === 'profile' && (
        <AdminProfileTab profile={profile} onRefreshData={onRefreshData} />
      )}

      {/* TAB CONTENT: SERVICES */}
      {adminTab === 'services' && (
        <AdminServicesTab services={services} onRefreshData={onRefreshData} />
      )}

      {/* TAB CONTENT: BOOKINGS */}
      {adminTab === 'bookings' && (
        <AdminBookingsTab bookings={bookings} contactInfo={contactInfo} onRefreshData={onRefreshData} />
      )}

      {/* TAB CONTENT: ACTIVITIES */}
      {adminTab === 'activities' && (
        <AdminActivitiesTab activities={activities} onRefreshData={onRefreshData} />
      )}

      {/* TAB CONTENT: GALLERY */}
      {adminTab === 'gallery' && (
        <AdminGalleryTab gallery={gallery} onRefreshData={onRefreshData} />
      )}

      {/* TAB CONTENT: ARTICLES */}
      {adminTab === 'articles' && (
        <AdminArticlesTab articles={articles} onRefreshData={onRefreshData} />
      )}

      {/* TAB CONTENT: TESTIMONIALS */}
      {adminTab === 'testimonials' && (
        <AdminTestimonialsTab testimonials={testimonials} onRefreshData={onRefreshData} />
      )}

      {/* TAB CONTENT: SERVICE AREAS */}
      {adminTab === 'areas' && (
        <AdminAreasTab serviceAreas={serviceAreas} onRefreshData={onRefreshData} />
      )}

      {/* TAB CONTENT: CONTACT & SOSMED */}
      {adminTab === 'contact' && (
        <AdminContactTab contactInfo={contactInfo} onRefreshData={onRefreshData} />
      )}

      {/* TAB CONTENT: BACKUP & EXPORT */}
      {adminTab === 'backup' && (
        <AdminBackupTab bookings={bookings} onRefreshData={onRefreshData} />
      )}

      {/* TAB CONTENT: AKSES ADMIN */}
      {adminTab === 'admins' && (
        <AdminAccessTab userEmail={user.email || ''} />
      )}

    </div>
  );
};

// OVERVIEW TAB SUB-COMPONENT
const AdminOverviewTab: React.FC<{
  bookings: Booking[];
  articles: Article[];
  activities: Activity[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  services: Service[];
  stats: VisitorStats;
  profile: TherapistProfile | null;
}> = ({ bookings, articles, activities, gallery, testimonials, services, stats, profile }) => {
  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-md">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Total Booking</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{bookings.length}</div>
          <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full inline-block mt-2">
            {pendingCount} Pending
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-md">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Layanan</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{services.length}</div>
          <span className="text-[10px] text-slate-400 mt-2 block">Aktif Ditampilkan</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-md">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Kegiatan</span>
          <div className="text-2xl font-black text-teal-600 mt-1">{activities.length}</div>
          <span className="text-[10px] text-slate-400 mt-2 block">Dokumentasi</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-md">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Foto Galeri</span>
          <div className="text-2xl font-black text-cyan-600 mt-1">{gallery.length}</div>
          <span className="text-[10px] text-slate-400 mt-2 block">Koleksi Foto</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-md">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Artikel Edukasi</span>
          <div className="text-2xl font-black text-indigo-600 mt-1">{articles.length}</div>
          <span className="text-[10px] text-slate-400 mt-2 block">Postingan Blog</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-md">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Statistik Pengunjung</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{stats.totalVisits || 0}</div>
          <span className="text-[10px] text-slate-400 mt-2 block">Pengunjung Unik</span>
        </div>
      </div>

      {/* Quick Status / Empty Guidance */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">
          Status Konfigurasi Website
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Semua data pada website terapis ini disimpan secara langsung di Firebase Firestore.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className={`p-3 rounded-xl border ${profile?.name ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
            <strong>Profil Terapis:</strong> {profile?.name ? profile.name : 'Belum diisi'}
          </div>
          <div className={`p-3 rounded-xl border ${services.length > 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
            <strong>Jumlah Layanan:</strong> {services.length} Layanan
          </div>
          <div className={`p-3 rounded-xl border ${pendingCount > 0 ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
            <strong>Booking Baru Pending:</strong> {pendingCount} Permintaan
          </div>
        </div>
      </div>
    </div>
  );
};

// PROFILE TAB
const AdminProfileTab: React.FC<{ profile: TherapistProfile | null; onRefreshData: () => void }> = ({ profile, onRefreshData }) => {
  const [name, setName] = useState(profile?.name || '');
  const [photoUrl, setPhotoUrl] = useState(profile?.photoUrl || '');
  const [experienceYears, setExperienceYears] = useState(profile?.experienceYears || '');
  const [certificatesInput, setCertificatesInput] = useState((profile?.certificates || []).join(', '));
  const [expertiseInput, setExpertiseInput] = useState((profile?.expertise || []).join(', '));
  const [bio, setBio] = useState(profile?.bio || '');
  const [vision, setVision] = useState(profile?.vision || '');
  const [mission, setMission] = useState(profile?.mission || '');
  const [bannerTitle, setBannerTitle] = useState(profile?.bannerTitle || '');
  const [bannerSubtitle, setBannerSubtitle] = useState(profile?.bannerSubtitle || '');
  const [bannerPhotoUrl, setBannerPhotoUrl] = useState(profile?.bannerPhotoUrl || '');
  const [ctaText, setCtaText] = useState(profile?.ctaText || '');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await saveTherapistProfile({
        name,
        photoUrl,
        experienceYears,
        certificates: certificatesInput.split(',').map(s => s.trim()).filter(Boolean),
        expertise: expertiseInput.split(',').map(s => s.trim()).filter(Boolean),
        bio,
        vision,
        mission,
        bannerTitle,
        bannerSubtitle,
        bannerPhotoUrl,
        ctaText
      });
      setMessage('Profil & Banner berhasil disimpan!');
      onRefreshData();
    } catch (err) {
      setMessage('Gagal menyimpan profil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 dark:border-slate-800 space-y-6">
      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
        Atur Profil Terapis & Banner Utama
      </h3>

      {message && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Terapis</label>
          <input
            type="text"
            placeholder="Contoh: Heri Supriatna"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Pengalaman (Tahun)</label>
          <input
            type="text"
            placeholder="Contoh: 7+ Tahun Berpengalaman"
            value={experienceYears}
            onChange={(e) => setExperienceYears(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">URL Foto Terapis</label>
          <input
            type="url"
            placeholder="https://..."
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Keahlian (Pisahkan dengan Koma)</label>
          <input
            type="text"
            placeholder="Bekam Sunnah, Pijat Refleksi, Relaksasi"
            value={expertiseInput}
            onChange={(e) => setExpertiseInput(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Sertifikat Resmi (Pisahkan dengan Koma)</label>
        <input
          type="text"
          placeholder="Sertifikat Bekam Thibbun Nabawi, Pelatihan Refleksi Indonesia"
          value={certificatesInput}
          onChange={(e) => setCertificatesInput(e.target.value)}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Deskripsi Profil Singkat / Bio</label>
        <textarea
          rows={3}
          placeholder="Jelaskan mengenai keahlian dan dedikasi Anda sebagai terapis panggilan perorangan..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Visi Terapis</label>
          <textarea
            rows={2}
            placeholder="Visi Anda..."
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Misi Terapis</label>
          <textarea
            rows={2}
            placeholder="Misi Anda..."
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm outline-none"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Pengaturan Banner Utama (Beranda)</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Judul Utama Banner</label>
            <input
              type="text"
              placeholder="Contoh: Layanan Bekam & Pijat Panggilan ke Rumah Anda"
              value={bannerTitle}
              onChange={(e) => setBannerTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Teks Tombol Booking (CTA)</label>
            <input
              type="text"
              placeholder="Contoh: Booking Layanan Panggilan"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Deskripsi Singkat Banner</label>
          <textarea
            rows={2}
            placeholder="Layanan terapis perorangan berpengalaman langsung ke tempat Anda..."
            value={bannerSubtitle}
            onChange={(e) => setBannerSubtitle(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">URL Foto Header / Background Banner</label>
          <input
            type="url"
            placeholder="https://..."
            value={bannerPhotoUrl}
            onChange={(e) => setBannerPhotoUrl(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg transition"
      >
        {saving ? 'Menyimpan...' : 'Simpan Profil & Banner'}
      </button>
    </form>
  );
};

// SERVICES TAB
const AdminServicesTab: React.FC<{ services: Service[]; onRefreshData: () => void }> = ({ services, onRefreshData }) => {
  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('60');
  const [priceRp, setPriceRp] = useState('');
  const [notes, setNotes] = useState('');

  const [adding, setAdding] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !priceRp) return;

    setAdding(true);
    try {
      await addService({
        name,
        photoUrl,
        description,
        durationMinutes: parseInt(durationMinutes) || 60,
        priceRp: parseFloat(priceRp) || 0,
        notes
      });
      setName('');
      setPhotoUrl('');
      setDescription('');
      setPriceRp('');
      setNotes('');
      onRefreshData();
    } catch (err) {
      alert('Gagal menambah layanan.');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus layanan ini?')) return;
    await deleteService(id);
    onRefreshData();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Plus className="w-5 h-5 text-emerald-600" />
          Tambah Layanan Baru
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold mb-1">Nama Layanan *</label>
            <input
              type="text"
              placeholder="Contoh: Bekam Sunnah Premium"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Tarif / Harga (Rp) *</label>
            <input
              type="number"
              placeholder="Contoh: 150000"
              value={priceRp}
              onChange={(e) => setPriceRp(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Durasi (Menit)</label>
            <input
              type="number"
              placeholder="60"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold mb-1">URL Foto Layanan</label>
            <input
              type="url"
              placeholder="https://..."
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Catatan Khusus (Peralatan / Persiapan)</label>
            <input
              type="text"
              placeholder="Contoh: Termasuk jarum steril & minyak herbal"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">Deskripsi Layanan</label>
          <textarea
            rows={2}
            placeholder="Jelaskan manfaat dan proses terapi..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={adding}
          className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-md"
        >
          {adding ? 'Menambahkan...' : 'Simpan Layanan Baru'}
        </button>
      </form>

      {/* Services List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800">
        <h3 className="text-base font-extrabold mb-4">Daftar Layanan Ditampilkan ({services.length})</h3>

        {services.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Belum ada layanan yang ditambahkan.</p>
        ) : (
          <div className="space-y-3">
            {services.map((s) => (
              <div key={s.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {s.photoUrl ? (
                    <img src={s.photoUrl} alt={s.name} className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <Sparkles className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-extrabold text-sm">{s.name}</h4>
                    <p className="text-xs text-emerald-600 font-bold">Rp {s.priceRp.toLocaleString('id-ID')} • {s.durationMinutes} Menit</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{s.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => s.id && handleDelete(s.id)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// BOOKINGS TAB
const AdminBookingsTab: React.FC<{ bookings: Booking[]; contactInfo: ContactInfo | null; onRefreshData: () => void }> = ({ bookings, contactInfo, onRefreshData }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredBookings = bookings.filter(b => {
    if (filterStatus === 'all') return true;
    return b.status === filterStatus;
  });

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    await updateBookingStatus(id, newStatus);
    onRefreshData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus record booking ini?')) return;
    await deleteBooking(id);
    onRefreshData();
  };

  const getWaClientUrl = (b: Booking) => {
    const raw = b.whatsappNumber || '';
    const clean = raw.replace(/[^0-9]/g, '');
    const formatted = clean.startsWith('0') ? '62' + clean.slice(1) : clean;
    const msg = encodeURIComponent(`Halo ${b.clientName}, mengenai booking layanan ${b.serviceName} untuk jadwal ${b.bookingDate} jam ${b.bookingTime}...`);
    return `https://wa.me/${formatted}?text=${msg}`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 dark:border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Kelola Booking Masuk</h3>
          <p className="text-xs text-slate-500">Daftar pelanggan yang mengajukan reservasi panggilan ke rumah.</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500">Filter Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-bold outline-none"
          >
            <option value="all">Semua Booking ({bookings.length})</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Dikonfirmasi</option>
            <option value="completed">Selesai</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <p className="text-xs text-slate-400 italic text-center py-8">Belum ada booking dalam kategori ini.</p>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div key={b.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-3">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    {b.clientName}
                    <span className="text-[10px] font-mono text-slate-400">#{b.id}</span>
                  </h4>
                  <p className="text-xs text-emerald-600 font-bold">{b.serviceName}</p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={b.status}
                    onChange={(e) => b.id && handleStatusChange(b.id, e.target.value as BookingStatus)}
                    className={`rounded-xl px-2.5 py-1 text-xs font-bold outline-none cursor-pointer ${
                      b.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      b.status === 'confirmed' ? 'bg-cyan-100 text-cyan-800 border border-cyan-300' :
                      b.status === 'completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    <option value="pending">🟡 Pending</option>
                    <option value="confirmed">🔵 Dikonfirmasi</option>
                    <option value="completed">🟢 Selesai</option>
                    <option value="cancelled">🔴 Dibatalkan</option>
                  </select>

                  <button
                    onClick={() => b.id && handleDelete(b.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                <div><strong>Jadwal:</strong> {b.bookingDate} ({b.bookingTime})</div>
                <div><strong>WA Pelanggan:</strong> {b.whatsappNumber}</div>
                <div className="sm:col-span-2"><strong>Alamat Rumah:</strong> {b.address}</div>
                {b.notes && <div className="sm:col-span-2 text-slate-500 italic"><strong>Catatan:</strong> {b.notes}</div>}
              </div>

              <div className="pt-2 flex justify-end">
                <a
                  href={getWaClientUrl(b)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-white" />
                  <span>Hubungi Pelanggan via WA</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ACTIVITIES TAB
const AdminActivitiesTab: React.FC<{ activities: Activity[]; onRefreshData: () => void }> = ({ activities, onRefreshData }) => {
  const [title, setTitle] = useState('');
  const [activityDate, setActivityDate] = useState('');
  const [description, setDescription] = useState('');
  const [photosInput, setPhotosInput] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !activityDate) return;

    setAdding(true);
    try {
      await addActivity({
        title,
        activityDate,
        description,
        photos: photosInput.split(',').map(s => s.trim()).filter(Boolean)
      });
      setTitle('');
      setActivityDate('');
      setDescription('');
      setPhotosInput('');
      onRefreshData();
    } catch (err) {
      alert('Gagal menambah kegiatan.');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus kegiatan ini?')) return;
    await deleteActivity(id);
    onRefreshData();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-extrabold flex items-center gap-2">
          <Plus className="w-5 h-5 text-emerald-600" />
          Posting Kegiatan Baru (Social Feed Mini)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold mb-1">Judul Kegiatan *</label>
            <input
              type="text"
              placeholder="Contoh: Sesi Bekam Homecare Wilayah Jakarta"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Tanggal Kegiatan *</label>
            <input
              type="date"
              value={activityDate}
              onChange={(e) => setActivityDate(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">URL Foto (Bisa beberapa foto, pisahkan dengan Koma)</label>
          <input
            type="text"
            placeholder="https://foto1.jpg, https://foto2.jpg"
            value={photosInput}
            onChange={(e) => setPhotosInput(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">Deskripsi Kegiatan</label>
          <textarea
            rows={2}
            placeholder="Keterangan singkat mengenai kegiatan terapis..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={adding}
          className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-md"
        >
          {adding ? 'Posting...' : 'Publikasikan Kegiatan'}
        </button>
      </form>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-extrabold">Daftar Kegiatan ({activities.length})</h3>
        {activities.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Belum ada kegiatan yang diunggah.</p>
        ) : (
          <div className="space-y-3">
            {activities.map((act) => (
              <div key={act.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-extrabold text-sm">{act.title}</h4>
                  <p className="text-xs text-emerald-600 font-bold">{act.activityDate}</p>
                  <p className="text-xs text-slate-500 line-clamp-1">{act.description}</p>
                </div>
                <button
                  onClick={() => act.id && handleDelete(act.id)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// GALLERY TAB
const AdminGalleryTab: React.FC<{ gallery: GalleryItem[]; onRefreshData: () => void }> = ({ gallery, onRefreshData }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Terapi Bekam');
  const [photoUrl, setPhotoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !photoUrl) return;

    setAdding(true);
    try {
      await addGalleryItem({
        title,
        category,
        photoUrl,
        description
      });
      setTitle('');
      setPhotoUrl('');
      setDescription('');
      onRefreshData();
    } catch (err) {
      alert('Gagal menambah galeri.');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus foto galeri ini?')) return;
    await deleteGalleryItem(id);
    onRefreshData();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-extrabold flex items-center gap-2">
          <Plus className="w-5 h-5 text-emerald-600" />
          Tambah Foto Galeri
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold mb-1">Judul Foto *</label>
            <input
              type="text"
              placeholder="Contoh: Alat Bekam Steril & Higienis"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Kategori Galeri *</label>
            <input
              type="text"
              placeholder="Contoh: Terapi Bekam, Pijat Refleksi, Peralatan"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">URL Foto *</label>
          <input
            type="url"
            placeholder="https://..."
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">Keterangan Singkat</label>
          <input
            type="text"
            placeholder="Catatan kecil foto..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={adding}
          className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-md"
        >
          {adding ? 'Menyimpan...' : 'Simpan ke Galeri'}
        </button>
      </form>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800">
        <h3 className="text-base font-extrabold mb-4">Koleksi Galeri ({gallery.length})</h3>
        {gallery.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Belum ada foto galeri.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {gallery.map((g) => (
              <div key={g.id} className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100">
                <img src={g.photoUrl} alt={g.title} className="w-full h-32 object-cover" />
                <div className="p-2.5 bg-white dark:bg-slate-900">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">{g.category}</span>
                  <h5 className="font-extrabold text-xs truncate">{g.title}</h5>
                </div>
                <button
                  onClick={() => g.id && handleDelete(g.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600 text-white shadow hover:bg-rose-700 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ARTICLES TAB
const AdminArticlesTab: React.FC<{ articles: Article[]; onRefreshData: () => void }> = ({ articles, onRefreshData }) => {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('Kesehatan');
  const [content, setContent] = useState('');
  const [isDraft, setIsDraft] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setAdding(true);
    try {
      await addArticle({
        title,
        imageUrl,
        category,
        content,
        publishedDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        isDraft
      });
      setTitle('');
      setImageUrl('');
      setContent('');
      onRefreshData();
    } catch (err) {
      alert('Gagal membuat artikel.');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus artikel ini?')) return;
    await deleteArticle(id);
    onRefreshData();
  };

  const handleToggleDraft = async (id: string, currentDraft: boolean) => {
    await updateArticle(id, { isDraft: !currentDraft });
    onRefreshData();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-extrabold flex items-center gap-2">
          <Plus className="w-5 h-5 text-emerald-600" />
          Buat Artikel Edukasi Kesehatan
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold mb-1">Judul Artikel *</label>
            <input
              type="text"
              placeholder="Contoh: Manfaat Bekam Sunnah Bagi Vitalitas Tubuh"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Kategori Artikel *</label>
            <input
              type="text"
              placeholder="Bekam, Refleksi, Pola Hidup Sehat"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">URL Gambar Header Artikel</label>
          <input
            type="url"
            placeholder="https://..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">Isi Artikel Lengkap *</label>
          <textarea
            rows={6}
            placeholder="Tuliskan artikel penjelasan mengenai manfaat kesehatan, tips perawatan, atau informasi tradisional..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="draftCheck"
            checked={isDraft}
            onChange={(e) => setIsDraft(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
          />
          <label htmlFor="draftCheck" className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Simpan Sebagai Draft (Tidak langsung dipublikasikan)
          </label>
        </div>

        <button
          type="submit"
          disabled={adding}
          className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-md"
        >
          {adding ? 'Menerbitkan...' : 'Simpan & Publikasikan Artikel'}
        </button>
      </form>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-extrabold">Daftar Artikel ({articles.length})</h3>
        {articles.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Belum ada artikel.</p>
        ) : (
          <div className="space-y-3">
            {articles.map((art) => (
              <div key={art.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">{art.category}</span>
                    {art.isDraft && <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">Draft</span>}
                  </div>
                  <h4 className="font-extrabold text-sm">{art.title}</h4>
                  <p className="text-xs text-slate-400">{art.publishedDate}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => art.id && handleToggleDraft(art.id, art.isDraft)}
                    className="px-2.5 py-1 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                  >
                    {art.isDraft ? 'Publish' : 'Jadikan Draft'}
                  </button>
                  <button
                    onClick={() => art.id && handleDelete(art.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// TESTIMONIALS TAB
const AdminTestimonialsTab: React.FC<{ testimonials: Testimonial[]; onRefreshData: () => void }> = ({ testimonials, onRefreshData }) => {
  const [clientName, setClientName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [rating, setRating] = useState('5');
  const [reviewText, setReviewText] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !reviewText) return;

    setAdding(true);
    try {
      await addTestimonial({
        clientName,
        photoUrl,
        rating: parseInt(rating) || 5,
        reviewText,
        date: new Date().toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
      });
      setClientName('');
      setPhotoUrl('');
      setReviewText('');
      onRefreshData();
    } catch (err) {
      alert('Gagal menambah testimoni.');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus testimoni ini?')) return;
    await deleteTestimonial(id);
    onRefreshData();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-extrabold flex items-center gap-2">
          <Plus className="w-5 h-5 text-emerald-600" />
          Tambah Testimoni Pelanggan
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold mb-1">Nama Pelanggan *</label>
            <input
              type="text"
              placeholder="Contoh: Pak Budi - Jakarta"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Rating Bintang</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm outline-none"
            >
              <option value="5">⭐⭐⭐⭐⭐ (5 Bintang)</option>
              <option value="4">⭐⭐⭐⭐ (4 Bintang)</option>
              <option value="3">⭐⭐⭐ (3 Bintang)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">URL Foto Pelanggan (Opsional)</label>
            <input
              type="url"
              placeholder="https://..."
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">Isi Testimoni *</label>
          <textarea
            rows={2}
            placeholder="Tulis ulasan pelanggan mengenai layanan bekam/pijat panggilan..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={adding}
          className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-md"
        >
          {adding ? 'Menyimpan...' : 'Simpan Testimoni'}
        </button>
      </form>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-extrabold">Daftar Testimoni ({testimonials.length})</h3>
        {testimonials.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Belum ada testimoni.</p>
        ) : (
          <div className="space-y-3">
            {testimonials.map((t) => (
              <div key={t.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-extrabold text-sm flex items-center gap-2">
                    {t.clientName}
                    <span className="text-amber-500 text-xs">{'★'.repeat(t.rating)}</span>
                  </h4>
                  <p className="text-xs text-slate-500 italic mt-0.5 font-medium font-sans">"{t.reviewText}"</p>
                </div>
                <button
                  onClick={() => t.id && handleDelete(t.id)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// SERVICE AREAS TAB
const AdminAreasTab: React.FC<{ serviceAreas: ServiceArea[]; onRefreshData: () => void }> = ({ serviceAreas, onRefreshData }) => {
  const [districtName, setDistrictName] = useState('');
  const [radiusKm, setRadiusKm] = useState('15');
  const [notes, setNotes] = useState('');
  const [mapEmbedUrl, setMapEmbedUrl] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!districtName) return;

    setAdding(true);
    try {
      await addServiceArea({
        districtName,
        radiusKm: parseFloat(radiusKm) || 15,
        notes,
        mapEmbedUrl
      });
      setDistrictName('');
      setNotes('');
      setMapEmbedUrl('');
      onRefreshData();
    } catch (err) {
      alert('Gagal menambah wilayah.');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus wilayah ini?')) return;
    await deleteServiceArea(id);
    onRefreshData();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-extrabold flex items-center gap-2">
          <Plus className="w-5 h-5 text-emerald-600" />
          Tambah Wilayah Jangkauan Panggilan
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold mb-1">Nama Wilayah / Kecamatan / Kota *</label>
            <input
              type="text"
              placeholder="Contoh: Jakarta Selatan, Depok & Sekitarnya"
              value={districtName}
              onChange={(e) => setDistrictName(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Maksimal Radius Layanan (km)</label>
            <input
              type="number"
              placeholder="15"
              value={radiusKm}
              onChange={(e) => setRadiusKm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">Catatan Tambahan (Ongkir / Bebas Biaya Jalan)</label>
          <input
            type="text"
            placeholder="Contoh: Gratis biaya transportasi untuk radius < 10km"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">URL Google Maps Embed (Opsional)</label>
          <input
            type="text"
            placeholder="https://www.google.com/maps/embed?..."
            value={mapEmbedUrl}
            onChange={(e) => setMapEmbedUrl(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={adding}
          className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-md"
        >
          {adding ? 'Menyimpan...' : 'Simpan Wilayah Jangkauan'}
        </button>
      </form>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-extrabold">Wilayah Jangkauan ({serviceAreas.length})</h3>
        {serviceAreas.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Belum ada wilayah layanan diatur.</p>
        ) : (
          <div className="space-y-3">
            {serviceAreas.map((a) => (
              <div key={a.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-extrabold text-sm">{a.districtName}</h4>
                  <p className="text-xs text-emerald-600 font-bold">Radius: Hingga {a.radiusKm} KM</p>
                  {a.notes && <p className="text-xs text-slate-500">{a.notes}</p>}
                </div>
                <button
                  onClick={() => a.id && handleDelete(a.id)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// CONTACT TAB
const AdminContactTab: React.FC<{ contactInfo: ContactInfo | null; onRefreshData: () => void }> = ({ contactInfo, onRefreshData }) => {
  const [whatsappNumber, setWhatsappNumber] = useState(contactInfo?.whatsappNumber || '');
  const [phoneNumber, setPhoneNumber] = useState(contactInfo?.phoneNumber || '');
  const [email, setEmail] = useState(contactInfo?.email || '');
  const [address, setAddress] = useState(contactInfo?.address || '');
  const [googleMapsUrl, setGoogleMapsUrl] = useState(contactInfo?.googleMapsUrl || '');
  const [instagram, setInstagram] = useState(contactInfo?.instagram || '');
  const [facebook, setFacebook] = useState(contactInfo?.facebook || '');
  const [tiktok, setTiktok] = useState(contactInfo?.tiktok || '');
  const [youtube, setYoutube] = useState(contactInfo?.youtube || '');

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    try {
      await saveContactInfo({
        whatsappNumber,
        phoneNumber,
        email,
        address,
        googleMapsUrl,
        instagram,
        facebook,
        tiktok,
        youtube
      });
      setMsg('✅ Kontak Resmi & Media Sosial berhasil disinkronkan ke Beranda & Floating Bar!');
      onRefreshData();
    } catch (err) {
      setMsg('❌ Gagal menyimpan informasi kontak.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 dark:border-slate-800 space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <PhoneCall className="w-6 h-6 text-emerald-600" />
          Pengaturan Kontak & Media Sosial Terapis
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Isi kontak WhatsApp, Instagram, TikTok, dan Facebook di bawah ini. Semua data ini akan langsung tampil secara otomatis di Beranda Pengunjung dan Tombol Ikon Mengambang (Floating Social Bar).
        </p>
      </div>

      {msg && (
        <div className={`p-4 rounded-2xl text-xs font-bold ${msg.includes('✅') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
          {msg}
        </div>
      )}

      {/* PROMINENT SOCIAL MEDIA SECTION WITH OFFICIAL LOGOS */}
      <div className="space-y-4">
        <h4 className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          Akses Kontak Sosial Media Utama (WA, IG, TikTok, FB)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* WHATSAPP INPUT */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-800/60 space-y-2">
            <label className="block text-xs font-black text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shadow">
                <MessageSquare className="w-3.5 h-3.5 fill-white" />
              </div>
              Nomor WhatsApp Terapis *
            </label>
            <input
              type="text"
              placeholder="Contoh: 081234567890 atau 6281234567890"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="w-full rounded-xl border border-emerald-200 dark:border-emerald-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
              Digunakan untuk tombol booking langsung & floating chat WA pengunjung.
            </p>
          </div>

          {/* INSTAGRAM INPUT */}
          <div className="p-4 rounded-2xl bg-pink-50/70 dark:bg-pink-950/40 border-2 border-pink-300 dark:border-pink-800/60 space-y-2">
            <label className="block text-xs font-black text-pink-900 dark:text-pink-300 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center font-bold shadow">
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </div>
              Akun Instagram Terapis
            </label>
            <input
              type="text"
              placeholder="Contoh: @terapisbekam atau link profil IG"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full rounded-xl border border-pink-200 dark:border-pink-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-pink-500"
            />
            <p className="text-[10px] text-pink-700 dark:text-pink-400 font-semibold">
              Tampil di beranda & tombol floating Instagram.
            </p>
          </div>

          {/* TIKTOK INPUT */}
          <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700 space-y-2">
            <label className="block text-xs font-black text-slate-900 dark:text-slate-200 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-black text-white flex items-center justify-center font-bold shadow">
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-.99.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.57-1.31 1.55-1.35 2.55-.07 1.41.76 2.76 2.02 3.27.87.41 1.9.41 2.8-.01.99-.44 1.67-1.38 1.78-2.45.15-1.8.03-3.62.06-5.43 0-4.08-.01-8.16.02-12.24z"/></svg>
              </div>
              Akun TikTok Terapis
            </label>
            <input
              type="text"
              placeholder="Contoh: @terapisbekam atau link akun TikTok"
              value={tiktok}
              onChange={(e) => setTiktok(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-slate-900"
            />
            <p className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold">
              Tampil di beranda & tombol floating TikTok.
            </p>
          </div>

          {/* FACEBOOK INPUT */}
          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border-2 border-blue-300 dark:border-blue-800/60 space-y-2">
            <label className="block text-xs font-black text-blue-900 dark:text-blue-300 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow">
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.847 9 5.052V8z"/></svg>
              </div>
              Akun / Halaman Facebook
            </label>
            <input
              type="text"
              placeholder="Contoh: Heri.Bekam atau link profil Facebook"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className="w-full rounded-xl border border-blue-200 dark:border-blue-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[10px] text-blue-700 dark:text-blue-400 font-semibold">
              Tampil di beranda & tombol floating Facebook.
            </p>
          </div>

        </div>
      </div>

      {/* INFORMASI ALAMAT & KONTAK PENDUKUNG */}
      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
          Informasi Alamat & Kontak Pendukung
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold mb-1">Nomor Telepon Seluler</label>
            <input
              type="text"
              placeholder="081234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Email Resmi Terapis</label>
            <input
              type="email"
              placeholder="terapis@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Link Google Maps Basecamp</label>
            <input
              type="url"
              placeholder="https://maps.google.com/..."
              value={googleMapsUrl}
              onChange={(e) => setGoogleMapsUrl(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">Alamat Lengkap / Basecamp Terapis</label>
          <textarea
            rows={2}
            placeholder="Masukkan alamat domisili atau basecamp terapis..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xl transition hover:scale-[1.01]"
      >
        {saving ? 'Menyimpan & Menyinkronkan...' : 'Simpan & Sinkronkan Kontak Sosmed'}
      </button>
    </form>
  );
};

// BACKUP & EXPORT TAB
const AdminBackupTab: React.FC<{ bookings: Booking[]; onRefreshData: () => void }> = ({ bookings, onRefreshData }) => {
  const [downloadingJson, setDownloadingJson] = useState(false);
  const [restoringJson, setRestoringJson] = useState(false);

  // Export JSON Backup
  const handleExportJson = async () => {
    setDownloadingJson(true);
    try {
      const data = await exportFullDatabaseBackup();
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup_terapis_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Gagal mengeksport database.');
    } finally {
      setDownloadingJson(false);
    }
  };

  // Restore JSON Backup
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        setRestoringJson(true);
        const parsed = JSON.parse(evt.target?.result as string);
        await restoreFullDatabaseBackup(parsed);
        alert('Restore database berhasil!');
        onRefreshData();
      } catch (err) {
        alert('Format file JSON tidak sesuai.');
      } finally {
        setRestoringJson(false);
      }
    };
    reader.readAsText(file);
  };

  // Export Bookings to Excel
  const handleExportExcel = () => {
    if (bookings.length === 0) {
      alert('Belum ada data booking untuk dieksport.');
      return;
    }

    const rows = bookings.map((b, i) => ({
      'No': i + 1,
      'ID Booking': b.id,
      'Nama Pelanggan': b.clientName,
      'Nomor WA': b.whatsappNumber,
      'Layanan': b.serviceName,
      'Tanggal': b.bookingDate,
      'Jam': b.bookingTime,
      'Alamat': b.address,
      'Status': b.status.toUpperCase(),
      'Catatan': b.notes || '-'
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Booking');
    XLSX.writeFile(workbook, `Booking_Terapis_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Export PDF Summary Report
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Laporan Rekapitulasi Booking Terapis Panggilan', 14, 20);
    doc.setFontSize(10);
    doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, 14, 28);
    doc.text(`Total Pesanan: ${bookings.length} Booking`, 14, 34);

    let y = 45;
    bookings.forEach((b, idx) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(10);
      doc.text(`${idx + 1}. [${b.status.toUpperCase()}] ${b.clientName} - ${b.serviceName}`, 14, y);
      doc.setFontSize(8);
      doc.text(`   Jadwal: ${b.bookingDate} (${b.bookingTime}) | WA: ${b.whatsappNumber} | Alamat: ${b.address}`, 14, y + 5);
      y += 12;
    });

    doc.save(`Laporan_Terapis_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 dark:border-slate-800 space-y-6">
      <h3 className="text-lg font-extrabold border-b border-slate-100 dark:border-slate-800 pb-3">
        Backup, Restore, & Eksport Data
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Database JSON */}
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 space-y-3">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-extrabold">
            <Download className="w-5 h-5" />
            <span>Full Backup Database (JSON)</span>
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-400">
            Unduh seluruh data profil, layanan, kegiatan, galeri, artikel, dan testimoni dalam format file JSON.
          </p>
          <button
            onClick={handleExportJson}
            disabled={downloadingJson}
            className="w-full rounded-xl bg-amber-600 hover:bg-amber-700 py-2.5 text-xs font-bold text-white shadow transition"
          >
            {downloadingJson ? 'Mengeksport...' : 'Download Backup JSON'}
          </button>
        </div>

        {/* Restore Database */}
        <div className="p-5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-900/50 space-y-3">
          <div className="flex items-center gap-2 text-cyan-800 dark:text-cyan-300 font-extrabold">
            <Upload className="w-5 h-5" />
            <span>Restore Database (JSON)</span>
          </div>
          <p className="text-xs text-cyan-700 dark:text-cyan-400">
            Unggah file backup JSON untuk mengembalikan seluruh isi data website terapis.
          </p>
          <label className="block w-full text-center rounded-xl bg-cyan-600 hover:bg-cyan-700 py-2.5 text-xs font-bold text-white shadow cursor-pointer transition">
            {restoringJson ? 'Memproses Restore...' : 'Pilih File JSON & Restore'}
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>
        </div>

        {/* Export Excel */}
        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-extrabold">
            <FileSpreadsheet className="w-5 h-5" />
            <span>Eksport Excel (.xlsx)</span>
          </div>
          <p className="text-xs text-emerald-700 dark:text-emerald-400">
            Unduh daftar rekapitulasi booking pelanggan dalam format tabel Microsoft Excel.
          </p>
          <button
            onClick={handleExportExcel}
            className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-bold text-white shadow transition"
          >
            Eksport Booking ke Excel
          </button>
        </div>

        {/* Export PDF */}
        <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 space-y-3">
          <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-300 font-extrabold">
            <Printer className="w-5 h-5" />
            <span>Cetak / PDF Summary Report</span>
          </div>
          <p className="text-xs text-indigo-700 dark:text-indigo-400">
            Cetak atau unduh dokumen PDF resmi rekapitulasi booking pelanggan.
          </p>
          <button
            onClick={handleExportPDF}
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 py-2.5 text-xs font-bold text-white shadow transition"
          >
            Cetak PDF Laporan
          </button>
        </div>
      </div>
    </div>
  );
};
