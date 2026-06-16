import Link from 'next/link';
import { Hero } from '@/components/landing/Hero';
import { TypeShowcase } from '@/components/landing/TypeShowcase';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TypeShowcase />
      <HowItWorks />

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-lg mx-auto text-center bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-10 text-white">
          <h2 className="text-2xl font-bold mb-3">准备好发现你的学格了吗？</h2>
          <p className="text-indigo-100 mb-6 text-sm leading-relaxed">
            5分钟 · 60道题 · 免费获取专属学格报告
          </p>
          <Link href="/test">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-xl inline-flex">
              开始免费测评 →
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
