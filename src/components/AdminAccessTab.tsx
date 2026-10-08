import React, { useState, useEffect } from 'react';
import {
  getAllowedAdminEmails,
  addAllowedAdminEmail,
  removeAllowedAdminEmail
} from '../services/dataService';
import { useAuth } from '../hooks/useAuth';
import { Shield, ShieldCheck, UserPlus, Trash2, CheckCircle2, AlertCircle, Lock, Mail, KeyRound, Sparkles } from 'lucide-react';

interface AdminAccessTabProps {
  userEmail: string;
}

export const AdminAccessTab: React.FC<AdminAccessTabProps> = ({ userEmail }) => {
  const { registerEmail } = useAuth();
  const [allowedEmails, setAllowedEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [addingEmail, setAddingEmail] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New Account Creation Form States
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [creatingAccount, setCreatingAccount] = useState(false);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const list = await getAllowedAdminEmails();
      setAllowedEmails(list);
    } catch (err) {
      console.error('Failed to fetch allowed admin emails:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setFeedbackMsg(null);
    setAddingEmail(true);

    try {
      const updated = await addAllowedAdminEmail(newEmail.trim());
      setAllowedEmails(updated);
      setFeedbackMsg({ type: 'success', text: `Berhasil menambahkan ${newEmail} ke daftar Admin yang diizinkan.` });
      setNewEmail('');
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err?.message || 'Gagal menambahkan email admin.' });
    } finally {
      setAddingEmail(false);
    }
  };

  const handleRemoveEmail = async (emailToRemove: string) => {
    if (emailToRemove.toLowerCase() === 'jamurtv69@gmail.com') {
      alert('Email pemilik utama (jamurtv69@gmail.com) tidak dapat dihapus.');
      return;
    }

    if (!confirm(`Apakah Anda yakin ingin mencabut akses admin untuk ${emailToRemove}?`)) return;

    setFeedbackMsg(null);
    try {
      const updated = await removeAllowedAdminEmail(emailToRemove);
      setAllowedEmails(updated);
      setFeedbackMsg({ type: 'success', text: `Akses admin untuk ${emailToRemove} telah dicabut.` });
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err?.message || 'Gagal menghapus email admin.' });
    }
  };

  const handleCreateNewAdminAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createEmail.trim() || !createPassword.trim()) return;
    setFeedbackMsg(null);
    setCreatingAccount(true);

    try {
      // 1. First add to allowed list
      await addAllowedAdminEmail(createEmail.trim());
      // 2. Register account in Firebase Auth
      await registerEmail(createEmail.trim(), createPassword.trim());
      
      const updated = await getAllowedAdminEmails();
      setAllowedEmails(updated);

      setFeedbackMsg({
        type: 'success',
        text: `Akun Admin Baru untuk (${createEmail}) berhasil dibuat! Pengguna ini sekarang dapat login ke Panel Admin.`
      });
      setCreateEmail('');
      setCreatePassword('');
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err?.message || 'Gagal membuat akun admin baru.' });
    } finally {
      setCreatingAccount(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Info */}
      <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Kelola Hak Akses Admin Website</h3>
            <p className="text-xs text-slate-300">
              Proteksi Penuh: Hanya email terdaftar di bawah ini yang dapat login atau mengubah data website Anda.
            </p>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-2xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-200 text-xs flex items-center gap-2">
          <Lock className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Form pendaftaran publik di luar telah ditutup total untuk mencegah orang asing mengacak-acak data website.</span>
        </div>
      </div>

      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 border shadow-sm ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Grid: 1. Allowed Emails Whitelist, 2. Add Existing Email, 3. Create New Admin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Whitelist Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              Daftar Email Admin Diizinkan ({allowedEmails.length})
            </h4>
          </div>

          {loading ? (
            <p className="text-xs text-slate-400 py-4 text-center">Memuat daftar admin...</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {allowedEmails.map((email) => {
                const isPrimary = email.toLowerCase() === 'jamurtv69@gmail.com';
                const isCurrent = email.toLowerCase() === userEmail.toLowerCase();

                return (
                  <div
                    key={email}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 text-xs"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{email}</span>
                      {isPrimary && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold shrink-0">
                          Pemilik
                        </span>
                      )}
                      {isCurrent && !isPrimary && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold shrink-0">
                          Anda
                        </span>
                      )}
                    </div>

                    {!isPrimary && (
                      <button
                        onClick={() => handleRemoveEmail(email)}
                        className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition shrink-0"
                        title="Hapus Hak Akses Admin"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Add Email to Whitelist Form */}
          <form onSubmit={handleAddEmail} className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Izinkan Email Baru (Whitelisting):
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="misal: asisten.terapis@gmail.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <button
                type="submit"
                disabled={addingEmail}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition disabled:opacity-50 shrink-0"
              >
                {addingEmail ? '...' : 'Tambah Email'}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Email yang ditambahkan di atas bisa langsung login menggunakan akun Google atau email mereka.
            </p>
          </form>
        </div>

        {/* Create New Admin User Form */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Buat Akun Admin Baru</h4>
              <p className="text-[11px] text-slate-400">Buatkan email & password khusus untuk terapis/staf Anda.</p>
            </div>
          </div>

          <form onSubmit={handleCreateNewAdminAccount} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-amber-600" />
                Email Admin Baru
              </label>
              <input
                type="email"
                placeholder="staf@terapis.com"
                value={createEmail}
                onChange={(e) => setCreateEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                Password Admin
              </label>
              <input
                type="password"
                placeholder="minimal 6 karakter"
                value={createPassword}
                onChange={(e) => setCreatePassword(e.target.value)}
                minLength={6}
                required
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={creatingAccount}
              className="w-full rounded-xl bg-slate-900 dark:bg-amber-600 hover:bg-slate-800 dark:hover:bg-amber-700 text-white py-2.5 text-xs font-bold shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400 dark:text-white" />
              <span>{creatingAccount ? 'Membuat Akun...' : 'Buatkan Akun Admin'}</span>
            </button>
          </form>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 text-[11px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300">💡 Informasi Tambahan:</p>
            <p>• Akun yang dibuat di sini secara otomatis akan terdaftar dan bisa langsung digunakan untuk login di halaman depan Admin.</p>
          </div>
        </div>

      </div>
    </div>
  );
};
