'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LIKERT_OPTIONS, type LikertValue } from '@/lib/types';
import { DIMENSIONS } from '@/lib/types';

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  statement: string;
  dimension: number;
  onAnswer: (value: LikertValue) => void;
}

const OPTION_COLORS = [
  'bg-red-100 border-red-200 hover:bg-red-200 hover:border-red-400 text-red-800',
  'bg-orange-50 border-orange-200 hover:bg-orange-100 hover:border-orange-400 text-orange-700',
  'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-400 text-slate-600',
  'bg-emerald-50 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-400 text-emerald-700',
  'bg-green-100 border-green-200 hover:bg-green-200 hover:border-green-400 text-green-800',
];

export function QuestionCard({
  questionNumber,
  totalQuestions,
  statement,
  dimension,
  onAnswer,
}: QuestionCardProps) {
  const progress = (questionNumber / totalQuestions) * 100;
  const dimLabel = DIMENSIONS[dimension - 1];

  return (
    <div className="max-w-lg mx-auto px-4">
      {/* 进度条 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-indigo-500">
            {dimLabel?.name}
          </span>
          <span className="text-xs text-slate-400">
            {questionNumber}/{totalQuestions}
          </span>
        </div>
        <ProgressBar value={progress} />
      </div>

      {/* 陈述 */}
      <Card className="mb-8">
        <CardContent className="px-6 pt-8 pb-8 text-center">
          <p className="text-lg font-medium text-slate-800 leading-relaxed">
            {statement}
          </p>
        </CardContent>
      </Card>

      {/* Likert 量表 */}
      <div className="space-y-2">
        {LIKERT_OPTIONS.map((opt, i) => (
          <button
            key={opt.value}
            onClick={() => onAnswer(opt.value as LikertValue)}
            className={`w-full text-left px-5 py-3.5 rounded-xl border-2 transition-all duration-150 cursor-pointer ${OPTION_COLORS[i]}`}
          >
            <span className="text-sm font-medium">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
