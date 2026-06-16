import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const CODE_SECRET = process.env.CODE_SECRET || 'saat-code-secret';

/**
 * 验证解锁码（支持独立码 + 每日码）
 * POST /api/verify-code
 * Body: { code: "SAAT-A3F9-K2M7" }
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const code = (body.code || '').trim().toUpperCase();

  // 1. 尝试独立码: SAAT-NONCE-SIG
  const match = code.match(/^SAAT-([A-F0-9]{8})-([A-F0-9]{8})$/);
  if (match) {
    const [, nonce, sig] = match;
    const expectedSig = crypto
      .createHmac('sha256', CODE_SECRET)
      .update(nonce.toLowerCase())
      .digest('hex')
      .slice(0, 8)
      .toUpperCase();
    if (sig === expectedSig) {
      return NextResponse.json({ valid: true });
    }
  }

  // 2. 尝试每日码: SAAT-YYYYMMDD-XXXX
  const dailyMatch = code.match(/^SAAT-(\d{8})-([A-F0-9]{4})$/);
  if (dailyMatch) {
    const [, dateStr, sig] = dailyMatch;
    const expectedSig = crypto
      .createHmac('sha256', CODE_SECRET)
      .update(`daily-${dateStr}`)
      .digest('hex')
      .slice(0, 4)
      .toUpperCase();
    if (sig === expectedSig) {
      // 检查日期是否在±1天内（允许时差）
      const codeDate = new Date(
        parseInt(dateStr.slice(0, 4)),
        parseInt(dateStr.slice(4, 6)) - 1,
        parseInt(dateStr.slice(6, 8))
      );
      const now = new Date();
      const diffMs = Math.abs(now.getTime() - codeDate.getTime());
      if (diffMs <= 2 * 24 * 60 * 60 * 1000) {
        return NextResponse.json({ valid: true });
      }
    }
  }

  return NextResponse.json({ valid: false, error: '解锁码无效或已过期' });
}

/** 获取今日每日码（公开调用） */
export async function GET() {
  const now = new Date();
  const dateStr = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('');

  const sig = crypto
    .createHmac('sha256', CODE_SECRET)
    .update(`daily-${dateStr}`)
    .digest('hex')
    .slice(0, 4)
    .toUpperCase();

  return NextResponse.json({ code: `SAAT-${dateStr}-${sig}`, date: dateStr });
}
