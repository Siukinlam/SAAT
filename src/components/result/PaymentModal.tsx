'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

interface PaymentModalProps {
  onUnlock: () => void;
  onClose: () => void;
}

export function PaymentModal({ onUnlock, onClose }: PaymentModalProps) {
  const [step, setStep] = useState<'pay' | 'unlock'>('pay');
  const [qrUrl, setQrUrl] = useState('');
  const [outTradeNo, setOutTradeNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 创建支付宝订单
  useEffect(() => {
    fetch('/api/alipay/create-order', { method: 'POST' })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setQrUrl(data.qrCode);
          setOutTradeNo(data.outTradeNo);
        } else {
          setError(data.error || '创建订单失败');
        }
      })
      .catch(() => setError('网络错误'));
  }, []);

  // 轮询支付状态
  useEffect(() => {
    if (!outTradeNo || step !== 'pay') return;
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/alipay/check-order?outTradeNo=${outTradeNo}`);
        const data = await res.json();
        if (data.paid) {
          setPaid(true);
          if (pollingRef.current) clearInterval(pollingRef.current);
        }
      } catch {}
    }, 2000);

    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [outTradeNo, step]);

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
        setError(data.error || '解锁码无效');
      }
    } catch {
      setError('网络错误');
    } finally {
      setVerifying(false);
    }
  };

  const qrImageUrl = qrUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl)}`
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <Card className="max-w-sm w-full my-8 shadow-2xl border-0">
        <CardContent className="p-0 relative overflow-hidden rounded-2xl">
          <div className="h-1.5 bg-gradient-to-r from-blue-500 to-blue-600" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            ✕
          </button>

          <div className="p-6 space-y-5">
            <div className="text-center pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 rounded-full text-xs font-medium text-blue-600 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                {paid ? '支付成功' : '支付宝支付'}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">解锁深度报告</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-sm text-slate-400">¥</span>
                <span className="text-3xl font-extrabold text-slate-900">9.9</span>
              </div>
            </div>

            {step === 'pay' && (
              <>
                {/* 动态支付宝收款码 */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-blue-50/30 rounded-2xl" />
                  <div className="relative bg-white rounded-2xl p-5 border border-slate-100 shadow-inner">
                    <div className="flex flex-col items-center">
                      {loading ? (
                        <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-sm">
                          生成中...
                        </div>
                      ) : qrImageUrl ? (
                        <>
                          <div className="relative">
                            <div className="absolute -top-2 -left-2 w-5 h-5 border-t-2 border-l-2 border-blue-300 rounded-tl-lg" />
                            <div className="absolute -top-2 -right-2 w-5 h-5 border-t-2 border-r-2 border-blue-300 rounded-tr-lg" />
                            <div className="absolute -bottom-2 -left-2 w-5 h-5 border-b-2 border-l-2 border-blue-300 rounded-bl-lg" />
                            <div className="absolute -bottom-2 -right-2 w-5 h-5 border-b-2 border-r-2 border-blue-300 rounded-br-lg" />
                            <img
                              src={qrImageUrl}
                              alt="支付宝支付"
                              className="w-48 h-48 object-contain rounded-lg"
                            />
                          </div>

                          {paid && (
                            <div className="mt-4 px-4 py-2 bg-green-50 text-green-700 text-sm font-medium rounded-xl animate-in">
                              ✅ 支付成功！
                            </div>
                          )}

                          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h2l1-3h2l1 3h2l1-3h2l1 3h2M7 14h10M7 18h10" />
                            </svg>
                            打开支付宝扫一扫 · 自动检测支付
                          </div>
                        </>
                      ) : (
                        <div className="w-48 h-48 flex items-center justify-center">
                          <p className="text-sm text-red-500">{error || '生成失败，请重试'}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {paid && (
                  <Button onClick={() => setStep('unlock')} size="lg" className="w-full h-12 text-base bg-green-600 hover:bg-green-700">
                    支付成功！输入解锁码 →
                  </Button>
                )}

                <p className="text-xs text-slate-400 text-center">
                  支付成功后关注公众号「小蓝的志愿笔记」获取解锁码
                </p>
              </>
            )}

            {step === 'unlock' && (
              <>
                <div className="bg-green-50 rounded-2xl p-4 text-center border border-green-200">
                  <p className="text-sm text-green-700 mb-2">✅ 支付已确认</p>
                  <p className="text-xs text-green-500">
                    关注公众号「小蓝的志愿笔记」获取解锁码后输入
                  </p>
                </div>

                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => { setInputCode(e.target.value); setError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                  placeholder="输入解锁码"
                  className={`w-full px-4 py-3.5 rounded-xl border-2 text-center text-lg tracking-widest outline-none transition-all ${
                    error ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-blue-400'
                  }`}
                  autoFocus
                />
                {error && <p className="text-red-500 text-xs text-center">{error}</p>}

                <Button onClick={handleVerify} disabled={verifying} size="lg" className="w-full h-12 text-base">
                  {verifying ? '验证中...' : '确认解锁'}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
