// ============================================================
// SAAT 计分引擎
// ============================================================

import {
  type SAATCode,
  type DimensionScores,
  type Dim1,
  type Dim2,
  type Dim3,
  type Dim4,
  type Question,
} from './types';

/**
 * 根据20题答案计算4维度得分
 * returns [d1Score, d2Score, d3Score, d4Score] — 0.0~1.0
 */
export function calculateScores(
  questions: Question[],
  answers: ('A' | 'B')[]
): [number, number, number, number] {
  const totals: [number, number, number, number] = [0, 0, 0, 0];
  const counts: [number, number, number, number] = [0, 0, 0, 0];

  answers.forEach((answer, i) => {
    if (i >= questions.length) return;
    const opt = answer === 'A' ? questions[i].options[0] : questions[i].options[1];
    for (let d = 0; d < 4; d++) {
      totals[d] += opt.effects[d];
      counts[d]++;
    }
  });

  // 归一化到 0~1 (每个effect理论范围 -1~1)
  return totals.map((t, d) => {
    const maxPossible = counts[d]; // max possible absolute value
    if (maxPossible === 0) return 0.5;
    // map -maxPossible..+maxPossible → 0..1
    return Math.round(((t / maxPossible + 1) / 2) * 100) / 100;
  }) as [number, number, number, number];
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
 * 完整流水线: 答案 → 分数 + 代号
 */
export function evaluate(
  questions: Question[],
  answers: ('A' | 'B')[]
): { code: SAATCode; scores: DimensionScores } {
  const rawScores = calculateScores(questions, answers);
  const code = scoresToCode(rawScores);
  return {
    code,
    scores: {
      d1: rawScores[0],
      d2: rawScores[1],
      d3: rawScores[2],
      d4: rawScores[3],
    },
  };
}

/**
 * 分享文案生成
 */
export function getShareText(code: SAATCode, name: string): string {
  return `我在SAAT学格测评中是 ${code}「${name}」！快来测测你的学格是什么？`;
}
