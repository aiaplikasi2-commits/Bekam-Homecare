import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, Share } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md hover:from-emerald-700 hover:to-teal-700 active:scale-95 transition-all"
      >
        <Download className="w-4 h-4" />
        <span>Instal App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Instal di iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  Instal di iPhone / iPad
                </h3>
                <button onClick={() => setShowIOSGuide(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-3 bg-emerald-50 dark:bg-emerald-950/50 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">1</span>
                  <p>Ketuk tombol <strong className="text-slate-800 dark:text-slate-100 flex items-center gap-1 inline-flex"><Share className="w-3.5 h-3.5 text-emerald-600" /> Bagikan (Share)</strong> di menu bawah Safari browser.</p>
                </div>
                <div className="flex items-start gap-3 bg-emerald-50 dark:bg-emerald-950/50 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">2</span>
                  <p>Gulir ke bawah dan ketuk opsi <strong className="text-slate-800 dark:text-slate-100">"Tambah ke Layar Utama" (Add to Home Screen)</strong>.</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 transition"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
