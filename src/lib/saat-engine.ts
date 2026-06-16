// ============================================================
// SAAT 计分引擎 — Likert 5级量表版
// ============================================================

import {
  type SAATCode,
  type DimensionScores,
  type Dim1,
  type Dim2,
  type Dim3,
  type Dim4,
  type Question,
  type LikertValue,
} from './types';

/**
 * 根据60题 Likert 答案计算4维度得分
 * @returns [d1Score, d2Score, d3Score, d4Score] — 0.0~1.0
 */
export function calculateScores(
  questions: Question[],
  answers: LikertValue[]
): [number, number, number, number] {
  // 按维度分组
  const dimData: { sum: number; count: number }[] = [
    { sum: 0, count: 0 }, // d1
    { sum: 0, count: 0 }, // d2
    { sum: 0, count: 0 }, // d3
    { sum: 0, count: 0 }, // d4
  ];

  answers.forEach((answer, i) => {
    if (i >= questions.length) return;
    const q = questions[i];
    const d = q.dimension - 1;
    if (d < 0 || d > 3) return;

    // Likert 1-5 → 0-1
    const raw = (answer - 1) / 4;

    // direction='right': 同意=推向右端, score = raw
    // direction='left': 同意=推向左端, score = 1 - raw
    const score = q.direction === 'right' ? raw : 1 - raw;

    dimData[d].sum += score;
    dimData[d].count++;
  });

  return dimData.map(d =>
    d.count > 0 ? Math.round((d.sum / d.count) * 100) / 100 : 0.5
  ) as [number, number, number, number];
}

/**
 * 将4维分数转为SAAT代号
 */
export function scoresToCode(scores: [number, number, number, number]): SAATCode {
  const d1: Dim1 = scores[0] <= 0.5 ? 'S' : 'D';
  const d2: Dim2 = scores[1] <= 0.5 ? 'R' : 'C';
  const d3: Dim3 = scores[2] <= 0.5 ? 'T' : 'P';
  const d4: Dim4 = scores[3] <= 0.5 ? 'I' : 'E';
  return `${d1}-${d2}-${d3}-${d4}`;
}

/**
 * 完整评估
 */
export function evaluate(
  questions: Question[],
  answers: LikertValue[]
): { code: SAATCode; scores: DimensionScores } {
  const raw = calculateScores(questions, answers);
  return {
    code: scoresToCode(raw),
    scores: { d1: raw[0], d2: raw[1], d3: raw[2], d4: raw[3] },
  };
}

/**
 * 分享文案
 */
export function getShareText(code: SAATCode, name: string): string {
  const displayCode = code.replace(/-/g, ' ');
  return `我在SAAT学格测评中是 ${displayCode}「${name}」！快来测测你的学格是什么？`;
}
