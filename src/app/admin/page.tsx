'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [keyError, setKeyError] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 先检查 sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem('saat_admin_key');
    if (stored) setAdminKey(stored);
  }, []);

  const handleLogin = () => {
    if (adminKey.trim().length >= 6) {
      sessionStorage.setItem('saat_admin_key', adminKey.trim());
      setAuthed(true);
      setKeyError(false);
    } else {
      setKeyError(true);
    }
  };

  const fetchList = useCallback(() => {
    if (!adminKey) return;
    fetch(`/api/admin/approve?key=${adminKey}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setAuthed(false); sessionStorage.removeItem('saat_admin_key'); }
        else setList(d.pending || []);
      })
      .catch(() => {});
  }, [adminKey]);

  useEffect(() => {
    if (authed && adminKey) {
      fetchList();
      const t = setInterval(fetchList, 5000);
      return () => clearInterval(t);
    }
  }, [authed, adminKey, fetchList]);

  const approve = async (orderId: string) => {
    setLoading(true);
    const res = await fetch('/api/admin/approve', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminKey, orderId, approved: true }),
    });
    const data = await res.json();
    if (data.code) {
      await navigator.clipboard.writeText(data.code);
      alert(`✅ 解锁码已复制：${data.code}`);
    }
    fetchList();
    setLoading(false);
  };

  const reject = async (orderId: string) => {
    await fetch('/api/admin/approve', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminKey, orderId, approved: false }),
    });
    fetchList();
  };

  // 未登录 → 显示登录页
  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-sm w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
          <div className="text-center mb-6">
            <div className="text-3xl mb-3">🔐</div>
            <h1 className="text-xl font-bold text-slate-900">SAAT 管理后台</h1>
            <p className="text-sm text-slate-500 mt-1">请输入管理密钥</p>
          </div>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => { setAdminKey(e.target.value); setKeyError(false); }}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="管理密钥"
            autoFocus
            className={`w-full px-4 py-3.5 rounded-xl border-2 text-center text-lg outline-none transition-colors ${
              keyError ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-indigo-400'
            }`}
          />
          {keyError && <p className="text-red-500 text-xs mt-2 text-center">密钥至少6位</p>}
          <Button onClick={handleLogin} size="lg" className="w-full mt-4">进入后台</Button>
        </div>
      </main>
    );
  }

  // 已登录 → 审批面板
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">📋 支付审批</h1>
          <p className="text-sm text-slate-500">待审批 {list.length} 笔</p>
        </div>
        <button
          onClick={() => { setAuthed(false); sessionStorage.removeItem('saat_admin_key'); }}
          className="text-xs text-slate-400 hover:text-red-500 cursor-pointer"
        >
          退出
        </button>
      </div>

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

      <div className="mt-8 text-center">
        <button onClick={fetchList} className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer">
          🔄 手动刷新
        </button>
      </div>
    </main>
  );
}
