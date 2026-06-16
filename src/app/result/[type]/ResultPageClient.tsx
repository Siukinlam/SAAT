'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TypeBadge } from '@/components/result/TypeBadge';
import { RadarChart } from '@/components/result/RadarChart';
import { DimensionBars } from '@/components/result/DimensionBars';
import { RecommendationCard } from '@/components/result/RecommendationCard';
import { PaymentModal } from '@/components/result/PaymentModal';
import { FullReport } from '@/components/result/FullReport';
import { getShareText } from '@/lib/saat-engine';
import type { SAATType, DimensionScores, StudentStage, SubjectRecommendation, MajorRecommendation, SAATCode } from '@/lib/types';

interface ResultPageClientProps {
  type: SAATType;
  scores: DimensionScores;
  stage: StudentStage;
  subjectRecs: SubjectRecommendation[];
  majorRecs: MajorRecommendation[];
}

export function ResultPageClient({ type, scores, stage, subjectRecs, majorRecs }: ResultPageClientProps) {
  const [showReport, setShowReport] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const shareText = getShareText(type.code, type.name);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `我是 ${type.code}「${type.name}」`,
          text: shareText,
          url: window.location.href,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      alert('已复制分享文案和链接！');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-lg mx-auto px-4 space-y-6">
        {/* 学格徽章 */}
        <div className="text-center">
          <TypeBadge code={type.code} name={type.name} size="lg" />
          <p className="mt-3 text-slate-600 text-sm leading-relaxed">{type.tagline}</p>
        </div>

        {/* 雷达图 */}
        <Card>
          <CardHeader>
            <CardTitle>四维学格雷达图</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <RadarChart scores={scores} />
          </CardContent>
        </Card>

        {/* 维度分析 */}
        <Card>
          <CardHeader>
            <CardTitle>维度分析</CardTitle>
          </CardHeader>
          <CardContent>
            <DimensionBars scores={scores} />
          </CardContent>
        </Card>

        {/* 学习风格 */}
        <Card>
          <CardHeader>
            <CardTitle>学习风格</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 leading-relaxed">{type.learningStyle}</p>
          </CardContent>
        </Card>

        {/* 优势与注意 */}
        <Card>
          <CardHeader>
            <CardTitle>你的优势</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {type.strengths.map((s, i) => (
                <Badge key={i} variant="success">{s}</Badge>
              ))}
            </div>
            <div className="p-3 bg-amber-50 rounded-xl text-sm text-amber-700">
              ⚠️ {type.watchOut}
            </div>
          </CardContent>
        </Card>

        {/* 推荐 */}
        {stage === 'middle' && subjectRecs.length > 0 && (
          <RecommendationCard title="🎓 高中选科推荐（新高考3+1+2）" items={subjectRecs} />
        )}
        {stage === 'high' && majorRecs.length > 0 && (
          <RecommendationCard title="🏛 大学专业推荐" items={majorRecs} />
        )}

        {/* 深度报告付费区 */}
        {!showReport ? (
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
            <CardContent className="p-6 text-center">
              <h3 className="font-bold text-lg text-indigo-900 mb-2">🔓 解锁深度报告</h3>
              <p className="text-sm text-indigo-600 mb-4">
                获取由AI生成的完整学业分析报告，包含详细的专业匹配度分析、
                职业路径预览和个性化学习建议。
              </p>
              <div className="text-2xl font-bold text-indigo-800 mb-4">¥9.9</div>
              <Button onClick={() => setShowPayment(true)} size="lg">
                立即解锁
              </Button>
              <p className="text-xs text-indigo-400 mt-2">扫码支付 · 输入解锁码 · 即刻查看</p>
            </CardContent>
          </Card>
        ) : (
          <FullReport
            type={type}
            scores={scores}
            stage={stage}
            subjectRecs={subjectRecs}
            majorRecs={majorRecs}
          />
        )}

        {/* 支付弹窗 */}
        {showPayment && (
          <PaymentModal
            onUnlock={() => { setShowReport(true); setShowPayment(false); }}
            onClose={() => setShowPayment(false)}
          />
        )}

        {/* 分享按钮 */}
        <div className="flex flex-col gap-3 pb-8">
          <Button onClick={handleShare} size="lg" className="w-full">
            📤 分享我的学格
          </Button>
          <Link href="/test">
            <Button variant="outline" size="lg" className="w-full">
              🔄 重新测评
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="w-full">
              了解更多学格类型 →
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
