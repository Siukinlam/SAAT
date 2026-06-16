import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const ADMIN_KEY = process.env.ADMIN_KEY || 'saat-admin-2026';
const CODE_SECRET = process.env.CODE_SECRET || 'saat-code-secret';

// 内存存储（Vercel serverless 会丢，生产用 Supabase）
const pendingOrders: Map<string, { nickname: string; time: number; code?: string }> = new Map();
const approvedOrders: Map<string, string> = new Map(); // orderId → code

export { pendingOrders, approvedOrders };

/** POST: 用户提交支付信息 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { nickname } = body || {};

  if (!nickname?.trim()) {
    return NextResponse.json({ error: '请输入微信昵称' }, { status: 400 });
  }

  const orderId = `SAAT-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;
  pendingOrders.set(orderId, { nickname: nickname.trim(), time: Date.now() });

  // 发送企业微信通知
  const wecomKey = process.env.WECOM_WEBHOOK_KEY;
  if (wecomKey) {
    fetch(`https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${wecomKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        msgtype: 'markdown',
        markdown: {
          content: [
            `## 💰 新的支付订单`,
            `> 昵称: <font color="info">${nickname.trim()}</font>`,
            `> 订单号: ${orderId}`,
            `> 时间: ${new Date().toLocaleString('zh-CN')}`,
            ``,
            `[👉 去审批](https://saattype.com/admin)`,
          ].join('\n'),
        },
      }),
    }).catch(() => {});
  }

  return NextResponse.json({ orderId, status: 'pending' });
}

/** PUT: 管理员审批 */
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { adminKey, orderId, approved } = body || {};

  if (adminKey !== ADMIN_KEY) {
    return NextResponse.json({ error: '无权限' }, { status: 403 });
  }

  const order = pendingOrders.get(orderId);
  if (!order) {
    return NextResponse.json({ error: '订单不存在' }, { status: 404 });
  }

  if (approved) {
    const nonce = crypto.randomBytes(4).toString('hex').toUpperCase();
    const sig = crypto.createHmac('sha256', CODE_SECRET).update(nonce).digest('hex').slice(0, 8).toUpperCase();
    const code = `SAAT-${nonce}-${sig}`;
    approvedOrders.set(orderId, code);
    return NextResponse.json({ code, status: 'approved' });
  }

  pendingOrders.delete(orderId);
  return NextResponse.json({ status: 'rejected' });
}

/** GET: 查看待审批列表 */
export async function GET(request: NextRequest) {
  const adminKey = request.nextUrl.searchParams.get('key') || '';
  if (adminKey !== ADMIN_KEY) {
    return NextResponse.json({ error: '无权限' }, { status: 403 });
  }

  const list = Array.from(pendingOrders.entries()).map(([id, o]) => ({
    orderId: id,
    nickname: o.nickname,
    time: new Date(o.time).toLocaleString('zh-CN'),
  }));

  return NextResponse.json({ pending: list });
}
