import { DIMENSIONS, type DimensionScores } from '@/lib/types';

interface DimensionBarProps {
  scores: DimensionScores;
}

function SingleBar({
  label,
  leftLabel,
  rightLabel,
  value,
  leftDesc,
  rightDesc,
}: {
  label: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
  leftDesc: string;
  rightDesc: string;
}) {
  const pct = Math.round(value * 100);
  const isRight = value > 0.5;

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500">
          {isRight ? rightLabel : leftLabel} ({pct}%)
        </span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden flex">
        <div
          className="h-full bg-gradient-to-r from-slate-400 to-slate-500 transition-all duration-500"
          style={{ width: `${isRight ? 50 : pct}%` }}
        />
        <div className="h-full w-[2px] bg-white" />
        <div
          className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all duration-500"
          style={{ width: `${isRight ? pct - 50 : 50}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>{leftDesc}</span>
        <span>{rightDesc}</span>
      </div>
    </div>
  );
}

export function DimensionBars({ scores }: DimensionBarProps) {
  const dims = DIMENSIONS;
  const values = [scores.d1, scores.d2, scores.d3, scores.d4];

  return (
    <div>
      {dims.map((dim, i) => (
        <SingleBar
          key={dim.key}
          label={dim.name}
          leftLabel={dim.left.label}
          rightLabel={dim.right.label}
          value={values[i]}
          leftDesc={dim.left.desc}
          rightDesc={dim.right.desc}
        />
      ))}
    </div>
  );
}
