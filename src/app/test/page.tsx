'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { QuestionCard } from '@/components/test/QuestionCard';
import { QUESTIONS } from '@/lib/questions';
import { evaluate } from '@/lib/saat-engine';
import type { StudentStage, LikertValue } from '@/lib/types';

function TestContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const stage = (searchParams.get('stage') || 'middle') as StudentStage;

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<LikertValue[]>([]);

  const handleAnswer = (value: LikertValue) => {
    const newAnswers = [...answers, value];

    if (currentQ < QUESTIONS.length - 1) {
      setAnswers(newAnswers);
      setCurrentQ(currentQ + 1);
    } else {
      const result = evaluate(QUESTIONS, newAnswers);
      const params = new URLSearchParams({
        stage,
        d1: String(result.scores.d1),
        d2: String(result.scores.d2),
        d3: String(result.scores.d3),
        d4: String(result.scores.d4),
      });
      router.push(`/result/${result.code}?${params.toString()}`);
    }
  };

  const q = QUESTIONS[currentQ];

  return (
    <main className="min-h-screen bg-slate-50 py-8">
      <QuestionCard
        questionNumber={currentQ + 1}
        totalQuestions={QUESTIONS.length}
        statement={q.statement}
        dimension={q.dimension}
        onAnswer={handleAnswer}
        onBack={() => {
          if (currentQ > 0) {
            setAnswers(answers.slice(0, -1));
            setCurrentQ(currentQ - 1);
          }
        }}
        canGoBack={currentQ > 0}
      />
    </main>
  );
}

export default function TestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-400">加载中...</div>
      </div>
    }>
      <TestContent />
    </Suspense>
  );
}
