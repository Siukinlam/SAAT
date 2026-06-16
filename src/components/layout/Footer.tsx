export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50 py-12 mt-20">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold text-slate-900 mb-3">SAAT 学格</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Student Academic Aptitude Type<br />
              发现你的学格，找到你的方向
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-3">快速链接</h4>
            <div className="flex flex-col gap-2 text-sm text-slate-500">
              <a href="/test" className="hover:text-indigo-600">开始测评</a>
              <a href="/#types" className="hover:text-indigo-600">16种学格</a>
              <a href="/#about" className="hover:text-indigo-600">关于SAAT</a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-3">声明</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              本测评仅供学业规划参考，不构成专业建议。
              深度分析报告由AI生成，请结合实际情况做决策。
            </p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
          © 2026 SAAT 学格 · 开源项目 · MIT License
        </div>
      </div>
    </footer>
  );
}
