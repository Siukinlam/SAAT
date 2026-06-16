import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const APP_ID = process.env.ALIPAY_APP_ID || '';
const PRIVATE_KEY = (process.env.PRIVATE_KEY || '').replace(/\\n/g, '\n');
const ALIPAY_GATEWAY = 'https://openapi.alipay.com/gateway.do';

function sign(params: Record<string, string>): string {
  delete params.sign;
  const sorted = Object.keys(params)
    .filter((k) => params[k] !== '' && params[k] !== undefined && params[k] !== null)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
  const s = crypto.createSign('RSA-SHA256');
  s.update(sorted);
  return s.sign(PRIVATE_KEY, 'base64');
}

/**
 * GET /api/alipay/check-order?outTradeNo=xxx
 * 前端轮询支付状态
 */
export async function GET(request: NextRequest) {
  const outTradeNo = request.nextUrl.searchParams.get('outTradeNo');
  if (!outTradeNo) {
    return NextResponse.json({ paid: false, error: '缺少订单号' }, { status: 400 });
  }

  const params: Record<string, string> = {
    app_id: APP_ID,
    method: 'alipay.trade.query',
    charset: 'utf-8',
    sign_type: 'RSA2',
    timestamp: new Date().toISOString().replace(/\.\d{3}Z$/, '+08:00').replace(/T/, ' '),
    version: '1.0',
    biz_content: JSON.stringify({ out_trade_no: outTradeNo }),
  };
  params.sign = sign({ ...params });

  const res = await fetch(ALIPAY_GATEWAY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params).toString(),
  });

  const text = await res.text();
  const match = text.match(/"alipay_trade_query_response"\s*:\s*(\{[^}]+\})/);
  if (match) {
    const data = JSON.parse(match[1]);
    if (data.code === '10000' && data.trade_status === 'TRADE_SUCCESS') {
      return NextResponse.json({ paid: true, outTradeNo });
    }
  }

  return NextResponse.json({ paid: false });
}
