import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SAAT_TYPES, DIMENSIONS, type SAATCode, type DimensionScores } from '@/lib/types';
import { getSubjectRecommendations, getMajorRecommendations } from '@/lib/recommendations';
import { ResultPageClient } from './ResultPageClient';

interface ResultPageProps {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ stage?: string; d1?: string; d2?: string; d3?: string; d4?: string }>;
}

// 预生成所有16种学格的静态路径
export function generateStaticParams() {
  return Object.keys(SAAT_TYPES).map((code) => ({ type: code }));
}

export async function generateMetadata({ params }: ResultPageProps): Promise<Metadata> {
  const { type } = await params;
  const saatType = SAAT_TYPES[type as SAATCode];
  if (!saatType) return { title: '未知学格' };

  const displayCode = type.replace(/-/g, ' ');
  return {
    title: `${displayCode} ${saatType.name} — SAAT 学格测评结果`,
    description: `我是 ${displayCode}「${saatType.name}」— ${saatType.tagline}。来测测你的学格是什么？`,
    openGraph: {
      title: `我是 ${displayCode}「${saatType.name}」`,
      description: saatType.tagline,
      type: 'website',
      locale: 'zh_CN',
    },
  };
}

export default async function ResultPage({ params, searchParams }: ResultPageProps) {
  const { type } = await params;
  const sp = await searchParams;

  const saatType = SAAT_TYPES[type as SAATCode];
  if (!saatType) notFound();

  // 从 query params 获取分数，或生成默认分数
  let scores: DimensionScores;
  if (sp.d1 && sp.d2 && sp.d3 && sp.d4) {
    scores = {
      d1: parseFloat(sp.d1),
      d2: parseFloat(sp.d2),
      d3: parseFloat(sp.d3),
      d4: parseFloat(sp.d4),
    };
  } else {
    // 直接访问URL时使用默认中点分数
    scores = { d1: 0.5, d2: 0.5, d3: 0.5, d4: 0.5 };
  }

  const stage = sp.stage === 'high' ? 'high' : 'middle';
  const subjectRecs = getSubjectRecommendations(type as SAATCode);
  const majorRecs = getMajorRecommendations(type as SAATCode);

  return (
    <ResultPageClient
      type={saatType}
      scores={scores}
      stage={stage}
      subjectRecs={subjectRecs}
      majorRecs={majorRecs}
    />
  );
}
