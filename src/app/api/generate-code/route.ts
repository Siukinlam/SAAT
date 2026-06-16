import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const ADMIN_KEY = process.env.ADMIN_KEY || 'saat-admin-2026';
const CODE_SECRET = process.env.CODE_SECRET || 'saat-code-secret';

/**
 * 生成唯一解锁码
 * POST /api/generate-code
 * Body: { adminKey: string }
 * Returns: { code: "SAAT-A3F9-K2M7" }
 */
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (body.adminKey !== ADMIN_KEY) {
    return NextResponse.json({ error: '无权限' }, { status: 403 });
  }

  // 随机4字节 → 8位十六进制
  const nonce = crypto.randomBytes(4).toString('hex');
  // HMAC签名 → 取前4字节 = 8位十六进制
  const sig = crypto
    .createHmac('sha256', CODE_SECRET)
    .update(nonce)
    .digest('hex')
    .slice(0, 8);

  const code = `SAAT-${nonce.toUpperCase()}-${sig.toUpperCase()}`;

  return NextResponse.json({ code });
}
