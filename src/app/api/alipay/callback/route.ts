import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const ALIPAY_PUBLIC_KEY = (process.env.ALIPAY_PUBLIC_KEY || '').replace(/\\n/g, '\n');
const CODE_SECRET = process.env.CODE_SECRET || 'saat-code-secret';

function verifySign(params: Record<string, string>): boolean {
  const sign = params.sign || '';
  delete params.sign;
  delete params.sign_type;

  const sorted = Object.keys(params)
    .filter((k) => params[k] !== '' && params[k] !== undefined && params[k] !== null)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');

  const verify = crypto.createVerify('RSA-SHA256');
  verify.update(sorted);
  return verify.verify(ALIPAY_PUBLIC_KEY, sign, 'base64');
}

function generateUniqueCode(): string {
  const nonce = crypto.randomBytes(4).toString('hex').toUpperCase();
  const sig = crypto
    .createHmac('sha256', CODE_SECRET)
    .update(nonce)
    .digest('hex')
    .slice(0, 8)
    .toUpperCase();
  return `SAAT-${nonce}-${sig}`;
}

/**
 * POST /api/alipay/callback
 * 支付宝异步通知
 */
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const params: Record<string, string> = {};
  formData.forEach((v, k) => { params[k] = v.toString(); });

  // 验证签名
  if (!verifySign({ ...params })) {
    return new NextResponse('fail', { status: 400 });
  }

  const tradeStatus = params.trade_status;
  const outTradeNo = params.out_trade_no;

  // 支付成功
  if (tradeStatus === 'TRADE_SUCCESS') {
    const code = generateUniqueCode();

    // 保存订单 → 解锁码映射（生产环境用数据库，这里打日志）
    console.log(`[支付成功] 订单: ${outTradeNo} | 解锁码: ${code}`);

    // TODO: 存入 Supabase/Vercel KV，供 check-order 查询
    // 当前 MVP: 在控制台日志查看，手动发给用户

    return new NextResponse('success');
  }

  return new NextResponse('success');
}
