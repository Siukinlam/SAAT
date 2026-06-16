import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// ---- 配置 ----
const APP_ID = process.env.ALIPAY_APP_ID || '';
const PRIVATE_KEY = (process.env.ALIPAY_PRIVATE_KEY || '').replace(/\\n/g, '\n');
const ALIPAY_PUBLIC_KEY = (process.env.ALIPAY_PUBLIC_KEY || '').replace(/\\n/g, '\n');
const ALIPAY_GATEWAY = 'https://openapi.alipay.com/gateway.do';

function sign(params: Record<string, string>): string {
  // 排序 + 拼接
  const sorted = Object.keys(params)
    .filter((k) => params[k] !== '' && params[k] !== undefined && params[k] !== null)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(sorted);
  return sign.sign(PRIVATE_KEY, 'base64');
}

async function alipayRequest(method: string, bizContent: object) {
  const params: Record<string, string> = {
    app_id: APP_ID,
    method,
    charset: 'utf-8',
    sign_type: 'RSA2',
    timestamp: new Date().toISOString().replace(/\.\d{3}Z$/, '+08:00').replace(/T/, ' '),
    version: '1.0',
    biz_content: JSON.stringify(bizContent),
  };

  params.sign = sign(params);

  const formBody = new URLSearchParams(params).toString();
  const res = await fetch(ALIPAY_GATEWAY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formBody,
  });

  const text = await res.text();

  // 解析支付宝返回的 JSON
  const jsonMatch = text.match(/"alipay_trade_precreate_response"\s*:\s*(\{[^}]+\})/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[1]);
  }

  // 备选解析
  try {
    const data = JSON.parse(text);
    const key = method.replace(/\./g, '_') + '_response';
    return data[key] || data;
  } catch {
    return { raw: text };
  }
}

/**
 * POST /api/alipay/create-order
 * 创建支付宝当面付订单
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body; // 可选：自定义订单号

    const outTradeNo = orderId || `SAAT${Date.now()}${crypto.randomBytes(2).toString('hex')}`;

    const result = await alipayRequest('alipay.trade.precreate', {
      out_trade_no: outTradeNo,
      total_amount: '9.90',
      subject: 'SAAT学格深度报告',
      body: '解锁SAAT学格AI深度分析报告 · 永久可看',
      timeout_express: '30m',
    });

    if (result.code === '10000') {
      return NextResponse.json({
        success: true,
        qrCode: result.qr_code,           // 支付宝返回的二维码链接
        outTradeNo: result.out_trade_no,
      });
    }

    return NextResponse.json({
      success: false,
      error: result.sub_msg || result.msg || '订单创建失败',
    }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || '服务器错误',
    }, { status: 500 });
  }
}
