import React from 'react';
import type { Article } from '../types';
import { X, Calendar, Tag, BookOpen } from 'lucide-react';

interface ArticleDetailModalProps {
  article: Article | null;
  onClose: () => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 my-auto animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-full bg-slate-100 dark:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-56 sm:h-72 object-cover rounded-2xl mb-6 shadow-md"
          />
        )}

        <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 mb-3">
          <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
            <Tag className="w-3.5 h-3.5" />
            {article.category || 'Edukasi Kesehatan'}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {article.publishedDate}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
          {article.title}
        </h2>

        <div className="prose dark:prose-invert prose-emerald text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
          {article.content}
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full rounded-2xl bg-slate-100 dark:bg-slate-800 py-3 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          Tutup Artikel
        </button>
      </div>
    </div>
  );
};
