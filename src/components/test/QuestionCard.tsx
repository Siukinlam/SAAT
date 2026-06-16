'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  optionA: string;
  optionB: string;
  onAnswer: (answer: 'A' | 'B') => void;
}

export function QuestionCard({
  questionNumber,
  totalQuestions,
  question,
  optionA,
  optionB,
  onAnswer,
}: QuestionCardProps) {
  const progress = (questionNumber / totalQuestions) * 100;
  // 每5题展示维度标签
  const dimLabels = ['🎯 学习节奏', '🧠 思维通道', '📚 知识偏好', '⚡ 动力来源'];
  const dimIndex = Math.min(Math.floor((questionNumber - 1) / 5), 3);

  return (
    <div className="max-w-lg mx-auto px-4">
      {/* 进度条 + 维度标签 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-indigo-500">
            {dimLabels[dimIndex]}
          </span>
          <span className="text-xs text-slate-400">
            {questionNumber}/{totalQuestions}
          </span>
        </div>
        <ProgressBar value={progress} />
      </div>

      {/* 题目 */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-6 leading-relaxed">
            {question}
          </h2>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => onAnswer('A')}
              className="w-full text-left p-4 rounded-xl border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-150 group cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-100 group-hover:bg-indigo-100 text-xs font-bold text-slate-500 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
                  A
                </span>
                <span className="text-sm text-slate-700 group-hover:text-slate-900 leading-relaxed">
                  {optionA}
                </span>
              </div>
            </button>

            <button
              onClick={() => onAnswer('B')}
              className="w-full text-left p-4 rounded-xl border-2 border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all duration-150 group cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-100 group-hover:bg-purple-100 text-xs font-bold text-slate-500 group-hover:text-purple-600 flex items-center justify-center transition-colors">
                  B
                </span>
                <span className="text-sm text-slate-700 group-hover:text-slate-900 leading-relaxed">
                  {optionB}
                </span>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
