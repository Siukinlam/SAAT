'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 no-underline">
          <span className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
            S
          </span>
          SAAT 学格
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-slate-600">
          <Link href="/test" className="hover:text-indigo-600 transition-colors">开始测评</Link>
          <Link href="/#types" className="hover:text-indigo-600 transition-colors">16种学格</Link>
          <Link href="/#about" className="hover:text-indigo-600 transition-colors">关于SAAT</Link>
        </nav>
        <Link href="/test">
          <Button size="sm">免费测评</Button>
        </Link>
      </div>
    </header>
  );
}
