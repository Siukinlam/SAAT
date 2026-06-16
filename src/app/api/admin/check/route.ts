import { NextRequest, NextResponse } from 'next/server';
import { approvedOrders } from '../approve/route';

/** GET: 用户轮询是否已审批 */
export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get('orderId') || '';
  const code = approvedOrders.get(orderId);

  if (code) {
    approvedOrders.delete(orderId); // 一次使用
    return NextResponse.json({ approved: true, code });
  }

  return NextResponse.json({ approved: false });
}
