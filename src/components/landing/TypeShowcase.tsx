import Link from 'next/link';
import { SAAT_TYPES } from '@/lib/types';

const SHOWCASE_CODES = [
  'S-R-T-I', 'D-C-P-E', 'S-C-T-I', 'D-R-P-I',
  'S-R-P-E', 'D-C-T-I', 'S-C-P-I', 'D-R-T-E',
] as const;

export function TypeShowcase() {
  return (
    <section id="types" className="py-16 px-4 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">16种学格，你是哪一种？</h2>
          <p className="text-slate-500">每种学格由4个维度组成，代表独一无二的学业倾向</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SHOWCASE_CODES.map((code) => {
            const t = SAAT_TYPES[code];
            return (
              <Link
                key={code}
                href={`/result/${code}`}
                className="group block p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all text-center no-underline"
              >
                <div className="text-lg font-mono font-bold text-indigo-600 group-hover:text-indigo-700 mb-1">
                  {code}
                </div>
                <div className="text-sm font-bold text-slate-800 mb-1">{t.name}</div>
                <div className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {t.tagline}
                </div>
              </Link>
            );
          })}
        </div>
        <div className="text-center mt-6">
          <Link href="/test" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            查看全部16种学格 →
          </Link>
        </div>
      </div>
    </section>
  );
}
