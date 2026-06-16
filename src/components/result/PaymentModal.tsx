'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

interface PaymentModalProps {
  onUnlock: () => void;
  onClose: () => void;
}

export function PaymentModal({ onUnlock, onClose }: PaymentModalProps) {
  const [step, setStep] = useState<'pay' | 'code' | 'unlock'>('pay');
  const [dailyCode, setDailyCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);

  // 获取今日解锁码
  useEffect(() => {
    fetch('/api/verify-code')
      .then((r) => r.json())
      .then((d) => setDailyCode(d.code || ''))
      .catch(() => {});
  }, []);

  const handleVerify = async () => {
    const trimmed = inputCode.trim();
    if (!trimmed) return;
    setVerifying(true);
    setError('');
    try {
      const res = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmed }),
      });
      const data = await res.json();
      if (data.valid) {
        onUnlock();
      } else {
        setError(data.error || '解锁码无效或已过期');
      }
    } catch {
      setError('网络错误，请重试');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <Card className="max-w-sm w-full my-8">
        <CardContent className="p-6 space-y-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
          >
            ✕
          </button>

          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-900 mb-1">🔓 解锁深度报告</h3>
            <p className="text-sm text-slate-500">¥9.9 · 一次购买 · 永久可看</p>
          </div>

          {step === 'pay' && (
            <>
              <div className="text-center space-y-3">
                <p className="text-sm font-medium text-slate-700">微信或支付宝扫码支付 ¥9.9</p>
                <div className="flex gap-3 justify-center">
                  <div className="text-center">
                    <img src="/wechat-pay.jpeg" alt="微信支付" className="w-36 h-36 object-contain rounded-xl border" />
                    <p className="text-xs text-slate-400 mt-1">微信</p>
                  </div>
                  <div className="text-center">
                    <img src="/alipay.jpeg" alt="支付宝" className="w-36 h-36 object-contain rounded-xl border" />
                    <p className="text-xs text-slate-400 mt-1">支付宝</p>
                  </div>
                </div>
              </div>

              <Button onClick={() => setStep('code')} size="lg" className="w-full">
                ✅ 我已支付 ¥9.9
              </Button>

              <p className="text-xs text-slate-400 text-center">
                诚信解锁 · 支付后可获取今日解锁码
              </p>
            </>
          )}

          {step === 'code' && (
            <>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 text-center space-y-2">
                <p className="text-xs text-indigo-500 font-medium">今日解锁码</p>
                <div className="bg-white rounded-lg py-3 px-4 border-2 border-indigo-200 border-dashed">
                  <span className="text-2xl font-mono font-bold tracking-widest text-indigo-700">
                    {dailyCode || '加载中...'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">当日有效 · 请勿外传</p>
              </div>

              <Button onClick={() => setStep('unlock')} size="lg" variant="outline" className="w-full">
                去输入解锁码 →
              </Button>
            </>
          )}

          {step === 'unlock' && (
            <>
              <div>
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => { setInputCode(e.target.value); setError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                  placeholder="粘贴解锁码"
                  className={`w-full px-4 py-3 rounded-xl border-2 text-center text-lg tracking-widest outline-none transition-colors ${
                    error ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-indigo-400'
                  }`}
                  autoFocus
                />
                {error && <p className="text-red-500 text-xs mt-1 text-center">{error}</p>}
              </div>

              <Button onClick={handleVerify} disabled={verifying} size="lg" className="w-full">
                {verifying ? '验证中...' : '确认解锁'}
              </Button>

              <button
                onClick={() => setStep('code')}
                className="w-full text-xs text-slate-400 hover:text-indigo-500 cursor-pointer"
              >
                ← 返回查看解锁码
              </button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
