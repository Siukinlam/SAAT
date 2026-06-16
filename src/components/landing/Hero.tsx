import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function Hero() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 px-4">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 -z-10" />
      <div className="absolute top-20 right-0 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-0 w-60 h-60 bg-purple-200/30 rounded-full blur-3xl" />

      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 rounded-full text-sm text-indigo-600 font-medium mb-6">
          ✨ 中高考季限定 · 免费测评
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 leading-tight tracking-tight">
          发现你的<span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">学格</span>，<br />找到你的方向
        </h1>
        <p className="text-lg text-slate-500 mb-8 leading-relaxed max-w-lg mx-auto">
          SAAT（Student Academic Aptitude Type）学业倾向测评。
          60道题，5分钟，发现你的专属4字母学格代号，获取个性化的分科/专业推荐。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/test?stage=middle">
            <Button size="lg">🎓 我是准高中生 · 测选科方向</Button>
          </Link>
          <Link href="/test?stage=high">
            <Button size="lg" variant="outline">
              🏛 我是准大学生 · 测专业方向
            </Button>
          </Link>
        </div>
        <p className="mt-4 text-xs text-slate-400">
          已有 10,000+ 学生完成测评 · 完全免费 · 用时5分钟
        </p>
      </div>
    </section>
  );
}
