import { NextRequest, NextResponse } from 'next/server';
import { SAAT_TYPES, DIMENSIONS, type SAATCode, type DimensionScores } from '@/lib/types';
import { getSubjectRecommendations, getMajorRecommendations } from '@/lib/recommendations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, scores, stage } = body as {
      code: string;
      scores: DimensionScores;
      stage: 'middle' | 'high';
    };

    const saatType = SAAT_TYPES[code as SAATCode];
    if (!saatType) {
      return NextResponse.json({ error: '无效的学格代号' }, { status: 400 });
    }

    const subjectRecs = stage === 'middle' ? getSubjectRecommendations(code as SAATCode) : [];
    const majorRecs = stage === 'high' ? getMajorRecommendations(code as SAATCode) : [];

    // 如果配置了 DeepSeek API Key，用 AI 生成
    if (process.env.DEEPSEEK_API_KEY) {
      try {
        const aiReport = await generateWithAI(code, saatType.name, scores, stage, subjectRecs, majorRecs);
        return NextResponse.json({ report: aiReport, source: 'ai' });
      } catch (aiError) {
        console.warn('AI report generation failed, using template:', aiError);
      }
    }

    // Fallback: 模板报告
    const templateReport = generateTemplateReport(code, saatType.name, scores, stage, subjectRecs, majorRecs);
    return NextResponse.json({ report: templateReport, source: 'template' });
  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json({ error: '报告生成失败' }, { status: 500 });
  }
}

async function generateWithAI(
  code: string,
  name: string,
  scores: DimensionScores,
  stage: string,
  subjectRecs: { category: string; match: number; reason: string }[],
  majorRecs: { name: string; category: string; match: number; reason: string }[]
): Promise<string> {
  const dimSummary = DIMENSIONS.map((d, i) => {
    const key = `d${i + 1}` as keyof DimensionScores;
    const val = scores[key];
    const side = val > 0.5 ? d.right : d.left;
    return `${d.name}: ${side.label}(${Math.round(val * 100)}%)`;
  }).join(', ');

  const prompt = `你是SAAT学业测评系统的AI分析师。请为一个学格为 ${code}「${name}」的${stage === 'middle' ? '初中毕业' : '高中毕业'}生生成深度学业分析报告。

其四维度得分: ${dimSummary}
${stage === 'middle' ? `推荐选科: ${subjectRecs.map(r => `${r.category}(${r.match}%)`).join(', ')}` : ''}
${stage === 'high' ? `推荐专业: ${majorRecs.map(r => `${r.name}(${r.match}%)`).join(', ')}` : ''}

请用口语化、温暖的中文写作，内容包括:
1. 学格解读（2-3段，分析该学格的学习特点）
2. ${stage === 'middle' ? '高中选科建议（具体到3+1+2组合，并说明原因）' : '大学专业建议（推荐3-5个具体专业方向，说明匹配原因）'}
3. 学习方法建议（3-5条具体可操作的）
4. 未来职业方向预览（3个可能的职业路径）
5. 给家长的一句话建议

全文约800-1000字，使用Markdown格式。不要用过于学术的语言，像朋友在聊天。
重要: 开头加一句免责声明: "本报告由AI生成，仅供学业规划参考，请结合个人实际情况做最终决策。"`;

  const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: '你是一位经验丰富的学业规划顾问。' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    }),
  });

  if (!res.ok) throw new Error(`DeepSeek API error: ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

function generateTemplateReport(
  code: string,
  name: string,
  scores: DimensionScores,
  stage: string,
  subjectRecs: { category: string; match: number; reason: string }[],
  majorRecs: { name: string; category: string; match: number; reason: string }[]
): string {
  const lines: string[] = [
    '*本报告由模板生成，购买深度报告可获取AI定制分析。*',
    '',
    `## ${code}「${name}」学业分析报告`,
    '',
    '### 一、学格解读',
    '',
    `你的核心学格是 ${code}「${name}」，这意味着你在学习中展现出独特的模式和偏好。`,
    '',
    '### 二、维度分析',
    '',
  ];

  DIMENSIONS.forEach((d, i) => {
    const key = `d${i + 1}` as keyof DimensionScores;
    const val = scores[key];
    const side = val > 0.5 ? d.right : d.left;
    lines.push(`- **${d.name}**: ${side.label} (${Math.round(val * 100)}%) — ${side.desc}`);
  });

  lines.push('', `### 三、${stage === 'middle' ? '高中选科建议' : '大学专业推荐'}`, '');

  if (stage === 'middle') {
    subjectRecs.forEach((r) => {
      lines.push(`- **${r.category}** (匹配度 ${r.match}%): ${r.reason}`);
    });
  } else {
    majorRecs.forEach((r) => {
      lines.push(`- **${r.name}** (${r.category}, 匹配度 ${r.match}%): ${r.reason}`);
    });
  }

  lines.push('', '### 四、学习方法建议', '');
  lines.push('1. 找到适合自己的学习节奏，不盲目跟风');
  lines.push('2. 发挥自己的思维通道优势，扬长补短');
  lines.push('3. 在理论和实践之间找到平衡点');
  lines.push('4. 了解自己的动力来源，设计有效的激励机制');

  lines.push('', '### 五、给家长的一句话', '');
  lines.push('> 每个孩子都有独特的学习方式，最好的教育不是改造，而是理解和引导。');

  lines.push('', '---', '', '🔓 [升级AI深度报告] 获取更详细的个性化分析。');

  return lines.join('\n');
}
