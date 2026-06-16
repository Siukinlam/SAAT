export function HowItWorks() {
  const steps = [
    {
      icon: '📝',
      title: '回答20道题',
      desc: '每题2选1，跟随你的直觉作答',
    },
    {
      icon: '🔍',
      title: '获取学格代号',
      desc: '系统分析4维度倾向，生成专属4字母代号',
    },
    {
      icon: '📊',
      title: '查看分析报告',
      desc: '查看维度雷达图、学习风格分析和分科/专业推荐',
    },
    {
      icon: '🚀',
      title: '分享给朋友',
      desc: '一键生成分享卡片，看看朋友的学格和你是否一样',
    },
  ];

  return (
    <section id="about" className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">
          3分钟，4步完成
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3">
                {s.icon}
              </div>
              <div className="text-xs text-indigo-400 font-medium mb-1">Step {i + 1}</div>
              <h3 className="font-bold text-slate-900 mb-1">{s.title}</h3>
              <p className="text-sm text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
