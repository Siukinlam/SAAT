'use client';

import { DIMENSIONS, type DimensionScores } from '@/lib/types';

interface RadarChartProps {
  scores: DimensionScores;
  size?: number;
}

export function RadarChart({ scores, size = 280 }: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.35;
  const levels = 4;

  const scoreValues = [scores.d1, scores.d2, scores.d3, scores.d4];
  const axisAngles = [-90, -90 + 90, -90 + 180, -90 + 270]; // top, right, bottom, left

  // 计算点的坐标
  const getPoint = (angleDeg: number, value: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    const dist = r * value;
    return {
      x: cx + dist * Math.cos(rad),
      y: cy + dist * Math.sin(rad),
    };
  };

  // 背景网格
  const gridPolygons = Array.from({ length: levels }, (_, i) => {
    const levelR = r * ((i + 1) / levels);
    const pts = axisAngles.map((a) => {
      const rad = (a * Math.PI) / 180;
      return `${cx + levelR * Math.cos(rad)},${cy + levelR * Math.sin(rad)}`;
    });
    return pts.join(' ');
  });

  // 数据多边形
  const dataPts = axisAngles.map((a, i) => {
    const p = getPoint(a, scoreValues[i]);
    return `${p.x},${p.y}`;
  });

  // 轴线
  const axisLines = axisAngles.map((a) => {
    const end = getPoint(a, 1.0);
    return { x1: cx, y1: cy, x2: end.x, y2: end.y };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {/* 网格 */}
      {gridPolygons.map((pts, i) => (
        <polygon
          key={i}
          points={pts}
          fill="none"
          stroke={i === levels - 1 ? '#cbd5e1' : '#e2e8f0'}
          strokeWidth={1}
        />
      ))}

      {/* 轴线 */}
      {axisLines.map((l, i) => (
        <line key={i} {...l} stroke="#e2e8f0" strokeWidth={1} />
      ))}

      {/* 数据区域 */}
      <polygon
        points={dataPts.join(' ')}
        fill="rgba(99, 102, 241, 0.2)"
        stroke="rgb(99, 102, 241)"
        strokeWidth={2}
      />

      {/* 数据点 */}
      {dataPts.map((pt, i) => {
        const [px, py] = pt.split(',').map(Number);
        return (
          <circle
            key={i}
            cx={px}
            cy={py}
            r={4}
            fill="rgb(99, 102, 241)"
            stroke="white"
            strokeWidth={2}
          />
        );
      })}

      {/* 标签 */}
      {axisAngles.map((a, i) => {
        const p = getPoint(a, 1.15);
        const dim = DIMENSIONS[i];
        // 根据角度调整文字对齐
        let textAnchor: 'start' | 'middle' | 'end' = 'middle';
        let dy = '0.3em';
        if (a === -90) { textAnchor = 'middle'; dy = '-0.5em'; }
        else if (a === 90) { textAnchor = 'start'; dy = '0.3em'; }
        else if (a === 180) { textAnchor = 'middle'; dy = '1.2em'; }
        else if (a === 0) { textAnchor = 'end'; dy = '0.3em'; }

        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor={textAnchor}
            dy={dy}
            className="text-[10px] fill-slate-500"
            style={{ fontFamily: 'system-ui' }}
          >
            {dim.shortName}
          </text>
        );
      })}
    </svg>
  );
}
