'use client';

import { type SAATType, type DimensionScores, type SubjectRecommendation, type MajorRecommendation, type StudentStage, DIMENSIONS } from '@/lib/types';
import { RadarChart } from './RadarChart';
import { Button } from '@/components/ui/Button';

interface FullReportProps {
  type: SAATType;
  scores: DimensionScores;
  stage: StudentStage;
  subjectRecs: SubjectRecommendation[];
  majorRecs: MajorRecommendation[];
}

const displayCode = (code: string) => code.replace(/-/g, ' ');
const scoreValues = (scores: DimensionScores) => [scores.d1, scores.d2, scores.d3, scores.d4];

// 根据分数生成自然语言描述
function describeSide(key: string, val: number) {
  const dim = DIMENSIONS.find(d => d.key === key)!;
  if (Math.abs(val - 0.5) < 0.15) return `你在「${dim.name}」维度上表现出均衡的特质，既具备${dim.left.label}的特点，也能在需要时展现${dim.right.label}的灵活性。`;
  if (val < 0.5) return `你明显偏向「${dim.left.label}」——${dim.left.desc}。这是一个稳定的学习模式。`;
  return `你明显偏向「${dim.right.label}」——${dim.right.desc}。这种风格让你在学习中充满活力。`;
}

function describeLearningStyle(type: SAATType, scores: DimensionScores): string[] {
  const tips: string[] = [];
  const [d1, d2, d3, d4] = scoreValues(scores);

  if (d1 < 0.4) tips.push('你适合**结构化学习**：制定周计划、使用番茄钟、固定时间地点学习。不要轻易打破规律。');
  else if (d1 > 0.6) tips.push('你适合**弹性学习**：保留足够的自由度，根据精力状态切换任务。多项目并行反而让你效率更高。');
  else tips.push('你适合**混合节奏**：核心任务固定时间，灵活任务自由安排。找到稳定与变化的平衡点。');

  if (d2 < 0.4) tips.push('善用你的**逻辑优势**：用思维导图梳理知识体系、做习题时关注解题步骤的推导过程。');
  else if (d2 > 0.6) tips.push('善用你的**创造力**：用故事、图像、比喻来记忆知识点。把枯燥内容可视化会让学习事半功倍。');
  else tips.push('**理性与直觉并用**：先用逻辑搭建框架，再用联想丰富细节。两种思维方式的结合是你的独特优势。');

  if (d3 < 0.4) tips.push('你喜欢**深挖原理**：不要满足于"怎么做"，多问"为什么"。读原著、看论文、和老师深入讨论。');
  else if (d3 > 0.6) tips.push('你喜欢**动手实践**：项目制学习、实验操作、真实案例研究是最适合你的方式。先做再学，做中学。');
  else tips.push('**理论与实践并重**：学完一个概念后立刻找实际应用场景。知行合一是你的最佳状态。');

  if (d4 < 0.4) tips.push('你是**内在驱动型**：给自己设定个人目标而非外部标准。关注"我比昨天进步了什么"而非"我比别人强在哪里"。');
  else if (d4 > 0.6) tips.push('你是**外部激励型**：善用排名、奖励、公开承诺等外部机制。找一个学习伙伴互相监督效果翻倍。');
  else tips.push('你的**动力来源灵活**：内在兴趣和外部认可都能推动你。在不同阶段切换不同的激励机制。');

  return tips;
}

function careerHints(type: SAATType): string[] {
  const hints: Record<string, string[]> = {
    'S-R-T-I': ['科研人员 · 大学教授 · 数据科学家', '精算师 · 算法工程师 · 理论物理学家'],
    'S-R-T-E': ['金融分析师 · 医生 · 律师', '管理咨询师 · 审计师 · 高级工程师'],
    'S-R-P-I': ['软件工程师 · 机械设计师 · 创业者', '工业设计师 · 建筑师 · 独立开发者'],
    'S-R-P-E': ['项目经理 · 会计 · 土木工程师', '运营总监 · 质量管理 · 公务员'],
    'S-C-T-I': ['作家 · 哲学家 · 心理咨询师', '策展人 · 编辑 · 独立研究者'],
    'S-C-T-E': ['记者 · 律师 · 教师', '公关 · 编剧 · 品牌策划'],
    'S-C-P-I': ['设计师 · 插画师 · 摄影师', '手工艺人 · 花艺师 · UI/UX设计师'],
    'S-C-P-E': ['市场营销 · 活动策划 · 销售总监', '客户经理 · 广告创意 · 社群运营'],
    'D-R-T-I': ['AI研究员 · 量化交易员 · 生物信息学家', '战略顾问 · 产品经理 · 研发工程师'],
    'D-R-T-E': ['投行分析师 · 外科医生 · 航天工程师', '基金经理 · 网络安全专家 · 竞技运动员'],
    'D-R-P-I': ['连续创业者 · 全栈工程师 · 产品设计师', '自由职业者 · 天使投资人 · 科技博主'],
    'D-R-P-E': ['企业高管 · 销售总监 · 军事指挥官', '企业家 · 风险投资 · 政府官员'],
    'D-C-T-I': ['人类学家 · 跨学科研究者 · 纪录⽚导演', '未来学家 · 社会企业家 · 策展人'],
    'D-C-T-E': ['演说家 · 自媒体创始人 · 播客主持人', '教育培训师 · 文化评论家 · 公共知识分子'],
    'D-C-P-I': ['独立艺术家 · 游戏制作人 · 音乐制作人', '自由撰稿人 · 独立导演 · NFT艺术家'],
    'D-C-P-E': ['时尚设计师 · MCN创始人 · 潮流主理人', '品牌创始人 · 创意总监 · 社交媒体影响者'],
  };
  return hints[type.code] || ['根据你的学格特质，建议探索跨学科、多元化的发展路径'];
}

export function FullReport({ type, scores, stage, subjectRecs, majorRecs }: FullReportProps) {
  const tips = describeLearningStyle(type, scores);
  const careers = careerHints(type);
  const code = displayCode(type.code);

  const handleExportPDF = () => {
    // 给 body 加 print class，触发打印 CSS
    document.body.classList.add('printing-report');
    window.print();
    document.body.classList.remove('printing-report');
  };

  return (
    <>
      {/* 打印专用样式 */}
      <style jsx global>{`
        @media print {
          body.printing-report * { visibility: hidden; }
          body.printing-report .report-container,
          body.printing-report .report-container * { visibility: visible; }
          body.printing-report .report-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          body.printing-report .no-print { display: none !important; }
          @page { margin: 12mm; size: A4; }
        }
      `}</style>

      <div className="report-container space-y-6">
        {/* 导出按钮 */}
        <div className="no-print flex justify-end">
          <Button onClick={handleExportPDF} variant="outline" size="sm">
            📄 导出 PDF
          </Button>
        </div>

        {/* ===== 1. 封面 ===== */}
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl p-8 text-white text-center break-inside-avoid">
          <p className="text-indigo-200 text-sm mb-3 tracking-widest uppercase">Student Academic Aptitude Type</p>
          <div className="flex justify-center gap-1.5 mb-4">
            {type.code.replace(/-/g, '').split('').map((l, i) => (
              <span key={i} className="w-12 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-3xl font-extrabold text-white border border-white/30">
                {l}
              </span>
            ))}
          </div>
          <h1 className="text-2xl font-bold mb-1">{type.name}</h1>
          <p className="text-indigo-100 text-sm">{type.tagline}</p>
          <div className="mt-4 inline-block px-4 py-1.5 bg-white/10 rounded-full text-xs text-indigo-100">
            {stage === 'middle' ? '准高中生 · 选科指导版' : '准大学生 · 专业指导版'}
          </div>
        </div>

        {/* ===== 2. 四维雷达图 ===== */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 break-inside-avoid">
          <h2 className="text-lg font-bold text-slate-900 mb-4">四维学格画像</h2>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <RadarChart scores={scores} size={250} />
            <div className="flex-1 space-y-3 text-sm">
              {DIMENSIONS.map((dim, i) => {
                const val = scoreValues(scores)[i];
                const side = val < 0.45 ? dim.left : val > 0.55 ? dim.right : null;
                return (
                  <div key={dim.key} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-14 text-xs font-medium text-slate-400 pt-0.5">{dim.name}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-slate-700">
                          {side ? side.label : '均衡型'}
                        </span>
                        <span className="text-xs text-slate-400">{Math.round(val * 100)}%</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {side ? side.desc : '左右倾向接近，灵活切换'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ===== 3. 维度深度解读 ===== */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 break-inside-avoid">
          <h2 className="text-lg font-bold text-slate-900 mb-4">维度深度解读</h2>
          <div className="space-y-4">
            {DIMENSIONS.map((dim, i) => {
              const val = scoreValues(scores)[i];
              const side = val < 0.45 ? dim.left : val > 0.55 ? dim.right : null;
              return (
                <div key={dim.key} className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-bold text-slate-800">{dim.name}</span>
                    <span className="text-sm text-indigo-600 font-medium">
                      {side ? side.label : '均衡型'} — {Math.round((side ? Math.max(val, 1 - val) : 0.5) * 100)}%
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {describeSide(dim.key, val)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== 4. 学习风格 & 方法 ===== */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 break-inside-avoid">
          <h2 className="text-lg font-bold text-slate-900 mb-4">个性化学习方法</h2>
          <div className="space-y-3">
            {tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-indigo-50/50 rounded-xl">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                  {i + 1}
                </span>
                <p className="text-sm text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: tip.replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-700">$1</strong>') }} />
              </div>
            ))}
          </div>
        </div>

        {/* ===== 5. 优势 & 成长 ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 break-inside-avoid">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-emerald-700 mb-3">✨ 核心优势</h2>
            <ul className="space-y-2">
              {type.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-emerald-500 mt-0.5">●</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-amber-700 mb-3">🌱 成长空间</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{type.watchOut}</p>
            <div className="mt-4 p-3 bg-amber-50 rounded-xl">
              <p className="text-xs text-amber-700">
                💡 <strong>发展建议</strong>：每个学格都有独特的成长路径。不要试图变成别人，而是在自己的特质基础上持续优化。
              </p>
            </div>
          </div>
        </div>

        {/* ===== 6. 分科/专业推荐 ===== */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 break-inside-avoid">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            {stage === 'middle' ? '📐 高中选科推荐' : '🎓 大学专业推荐'}
          </h2>
          {stage === 'middle' ? (
            <div className="space-y-3">
              {subjectRecs.map((r, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">
                    {r.match}%
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-800">{r.category}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{r.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {majorRecs.map((r, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">
                    {r.match}%
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-sm text-slate-800">{r.name}</p>
                      <span className="text-xs text-slate-400">{r.category}</span>
                    </div>
                    <p className="text-xs text-slate-500">{r.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== 7. 职业方向预览 ===== */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 break-inside-avoid">
          <h2 className="text-lg font-bold text-slate-900 mb-4">🔭 未来职业方向</h2>
          {careers.map((group, i) => (
            <div key={i} className="mb-3 last:mb-0">
              <div className="flex flex-wrap gap-2">
                {group.split(' · ').map((c, j) => (
                  <span key={j} className="px-3 py-1.5 bg-slate-100 rounded-lg text-sm text-slate-700">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <p className="text-xs text-slate-400 mt-4">
            * 以上为基于学格特质的推荐方向，实际选择还需结合个人兴趣、行业趋势和家庭情况综合判断。
          </p>
        </div>

        {/* ===== 8. 给家长的建议 ===== */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 break-inside-avoid">
          <h2 className="text-lg font-bold text-amber-800 mb-3">💛 给家长的一句话</h2>
          <p className="text-amber-700 leading-relaxed mb-3">
            {type.code.startsWith('S') ? '你的孩子是一个喜欢稳定节奏的学习者。' : '你的孩子是一个灵活多变的学习者。'}
            {type.code.includes('R') ? 'TA的理性思维能力突出，' : 'TA的创造力是最大的财富，'}
            {type.code.includes('I') ? 'TA需要内在的成就感和自主空间。' : 'TA需要外部的认可和正向反馈。'}
          </p>
          <p className="text-sm text-amber-600 leading-relaxed">
            最好的教育不是把孩子塑造成某个模板，而是理解TA的独特模式，提供匹配的土壤和阳光。
            这份报告的目的不是给孩子的未来下定论，而是帮助你和孩子开启一场关于"我适合什么"的对话。
          </p>
        </div>

        {/* ===== 底部声明 ===== */}
        <div className="text-center text-xs text-slate-400 py-4 break-inside-avoid">
          <p>SAAT 学格测评 © 2026 · saattype.com</p>
          <p className="mt-1">本报告由SAAT测评系统生成，仅供学业规划参考，不构成专业建议。</p>
          <p>学格代号：{code}</p>
        </div>
      </div>
    </>
  );
}
