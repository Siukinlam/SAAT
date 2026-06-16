'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { QuestionCard } from '@/components/test/QuestionCard';
import { QUESTIONS } from '@/lib/questions';
import { evaluate } from '@/lib/saat-engine';
import type { StudentStage } from '@/lib/types';

function TestContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const stage = (searchParams.get('stage') || 'middle') as StudentStage;

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<('A' | 'B')[]>([]);

  const handleAnswer = (answer: 'A' | 'B') => {
    const newAnswers = [...answers, answer];

    if (currentQ < QUESTIONS.length - 1) {
      setAnswers(newAnswers);
      setCurrentQ(currentQ + 1);
    } else {
      const result = evaluate(QUESTIONS, newAnswers);
      router.push(`/result/${result.code}?stage=${stage}&d1=${result.scores.d1}&d2=${result.scores.d2}&d3=${result.scores.d3}&d4=${result.scores.d4}`);
    }
  };

  const q = QUESTIONS[currentQ];

  return (
    <main className="min-h-screen bg-slate-50 py-8">
      <QuestionCard
        questionNumber={currentQ + 1}
        totalQuestions={QUESTIONS.length}
        question={q.text}
        optionA={q.options[0].text}
        optionB={q.options[1].text}
        onAnswer={handleAnswer}
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
