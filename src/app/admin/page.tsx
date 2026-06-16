'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

const ADMIN_KEY = 'saat-admin-2026';

export default function AdminPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchList = () => {
    fetch(`/api/admin/approve?key=${ADMIN_KEY}`)
      .then((r) => r.json())
      .then((d) => setList(d.pending || []))
      .catch(() => {});
  };

  useEffect(() => { fetchList(); const t = setInterval(fetchList, 5000); return () => clearInterval(t); }, []);

  const approve = async (orderId: string) => {
    setLoading(true);
    const res = await fetch('/api/admin/approve', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminKey: ADMIN_KEY, orderId, approved: true }),
    });
    const data = await res.json();
    if (data.code) {
      await navigator.clipboard.writeText(data.code);
      alert(`✅ 已批准！解锁码已复制：${data.code}`);
    }
    fetchList();
    setLoading(false);
  };

  const reject = async (orderId: string) => {
    await fetch('/api/admin/approve', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminKey: ADMIN_KEY, orderId, approved: false }),
    });
    fetchList();
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-2">📋 支付审批</h1>
      <p className="text-sm text-slate-500 mb-6">待审批 {list.length} 笔</p>

      {list.length === 0 && (
        <div className="text-center py-12 text-slate-400">暂无待审批订单</div>
      )}

      <div className="space-y-3">
        {list.map((item: any) => (
          <div key={item.orderId} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
            <div>
              <p className="font-medium text-slate-800">{item.nickname}</p>
              <p className="text-xs text-slate-400">{item.time}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => approve(item.orderId)} disabled={loading}>
                ✅ 通过
              </Button>
              <Button size="sm" variant="ghost" onClick={() => reject(item.orderId)}>
                ❌ 拒绝
              </Button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
