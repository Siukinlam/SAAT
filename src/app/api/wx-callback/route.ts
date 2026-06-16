import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const WX_TOKEN = process.env.WX_TOKEN || 'saat2026';
const CODE_SECRET = process.env.CODE_SECRET || 'saat-code-secret';

/**
 * 微信公众平台回调 — GET: 服务器验证, POST: 消息处理
 */

// GET: 微信服务器URL验证
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const signature = sp.get('signature') || '';
  const timestamp = sp.get('timestamp') || '';
  const nonce = sp.get('nonce') || '';
  const echostr = sp.get('echostr') || '';

  // 验证签名
  const tmp = [WX_TOKEN, timestamp, nonce].sort().join('');
  const hash = crypto.createHash('sha1').update(tmp).digest('hex');

  if (hash === signature) {
    return new NextResponse(echostr);
  }
  return new NextResponse('fail', { status: 403 });
}

// POST: 接收用户消息
export async function POST(request: NextRequest) {
  const body = await request.text();

  // 解析XML消息（微信使用XML格式）
  const toUser = extractXML(body, 'ToUserName');
  const fromUser = extractXML(body, 'FromUserName');
  const content = extractXML(body, 'Content');
  const msgType = extractXML(body, 'MsgType');

  // 只处理文本消息
  if (msgType !== 'text' || !content) {
    return new NextResponse('success');
  }

  const keyword = content.trim().toUpperCase();
  const todayKeyword = getTodayKeyword();
  const dailyCode = generateDailyCode();

  let replyText = '';

  if (keyword === todayKeyword) {
    // 暗号匹配 → 返回今日解锁码
    replyText = [
      `🔓 今日解锁码：${dailyCode}`,
      '',
      '请在SAAT学格测评结果页输入此码解锁深度报告。',
      '解锁码当日有效，一码一用。',
      '',
      `暗号「${todayKeyword}」会每日更新，明天请重新获取。`,
    ].join('\n');
  } else if (keyword === 'HELP' || keyword === '帮助') {
    replyText = [
      '欢迎关注SAAT学格！',
      '',
      '🔓 获取解锁码：支付后输入页面显示的今日暗号',
      '📊 开始测评：https://saattype.com',
      '',
      '如有问题请联系客服。',
    ].join('\n');
  } else {
    // 不匹配 → 不回复（或提示无效暗号）
    replyText = [
      `暗号「${keyword}」无效或已过期。`,
      '',
      '请在SAAT学格支付页面获取今日最新暗号。',
      '如有问题请联系客服。',
    ].join('\n');
  }

  // 构建XML回复
  const replyXml = `<xml>
<ToUserName><![CDATA[${fromUser}]]></ToUserName>
<FromUserName><![CDATA[${toUser}]]></FromUserName>
<CreateTime>${Math.floor(Date.now() / 1000)}</CreateTime>
<MsgType><![CDATA[text]]></MsgType>
<Content><![CDATA[${replyText}]]></Content>
</xml>`;

  return new NextResponse(replyXml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}

// ---- 工具函数 ----

function getTodayKeyword(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `XG${mm}${dd}`;
}

function generateDailyCode(): string {
  const d = new Date();
  const dateStr = [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('');
  const sig = crypto
    .createHmac('sha256', CODE_SECRET)
    .update(`daily-${dateStr}`)
    .digest('hex')
    .slice(0, 4)
    .toUpperCase();
  return `SAAT-${dateStr}-${sig}`;
}

function extractXML(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}><!\\[CDATA\\[([^\\]]+)\\]\\]></${tag}>`));
  if (match) return match[1];
  const match2 = xml.match(new RegExp(`<${tag}>([^<]+)</${tag}>`));
  return match2 ? match2[1] : '';
}
