'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

type Tab = 'wechat' | 'alipay';

interface PaymentModalProps {
  onUnlock: () => void;
  onClose: () => void;
}

export function PaymentModal({ onUnlock, onClose }: PaymentModalProps) {
  const [step, setStep] = useState<'pay' | 'code' | 'unlock'>('pay');
  const [tab, setTab] = useState<Tab>('wechat');
  const [dailyCode, setDailyCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <Card className="max-w-sm w-full my-8 shadow-2xl border-0">
        <CardContent className="p-0 relative overflow-hidden rounded-2xl">

          {/* 顶部渐变条 */}
          <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            ✕
          </button>

          <div className="p-6 space-y-5">
            {/* 标题 */}
            <div className="text-center pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 rounded-full text-xs font-medium text-indigo-600 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                SAAT 深度报告
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">解锁深度报告</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-sm text-slate-400">¥</span>
                <span className="text-3xl font-extrabold text-slate-900">9.9</span>
                <span className="text-xs text-slate-400 ml-1">一次购买 · 永久可看</span>
              </div>
            </div>

            {step === 'pay' && (
              <>
                {/* 支付方式切换 */}
                <div className="flex bg-slate-100 rounded-xl p-1">
                  {[
                    { key: 'wechat' as Tab, label: '微信支付', icon: '💬' },
                    { key: 'alipay' as Tab, label: '支付宝', icon: '💙' },
                  ].map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setTab(t.key)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                        tab === t.key
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>

                {/* 收款码展示区 */}
                <div className="relative">
                  {/* 外框装饰 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/50 via-purple-100/30 to-pink-100/50 rounded-2xl" />
                  <div className="relative bg-white rounded-2xl p-5 border border-slate-100 shadow-inner">
                    <div className="flex flex-col items-center">
                      {/* 二维码 */}
                      <div className="relative">
                        {/* 四角装饰 */}
                        <div className="absolute -top-2 -left-2 w-5 h-5 border-t-2 border-l-2 border-indigo-300 rounded-tl-lg" />
                        <div className="absolute -top-2 -right-2 w-5 h-5 border-t-2 border-r-2 border-indigo-300 rounded-tr-lg" />
                        <div className="absolute -bottom-2 -left-2 w-5 h-5 border-b-2 border-l-2 border-indigo-300 rounded-bl-lg" />
                        <div className="absolute -bottom-2 -right-2 w-5 h-5 border-b-2 border-r-2 border-indigo-300 rounded-br-lg" />

                        <img
                          src={tab === 'wechat' ? '/wechat-pay.jpeg' : '/alipay.jpeg'}
                          alt={tab === 'wechat' ? '微信支付' : '支付宝'}
                          className="w-44 h-44 object-contain rounded-lg"
                        />
                      </div>

                      {/* 提示文字 */}
                      <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h2l1-3h2l1 3h2l1-3h2l1 3h2M7 14h10M7 18h10" />
                        </svg>
                        {tab === 'wechat' ? '打开微信扫一扫' : '打开支付宝扫一扫'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 支付说明 */}
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-xs text-indigo-600 mt-0.5">
                    1
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    扫码支付 ¥9.9 后，点击下方按钮获取今日解锁码
                  </p>
                </div>

                <Button onClick={() => setStep('code')} size="lg" className="w-full h-12 text-base">
                  ✅ 我已支付 ¥9.9，获取解锁码
                </Button>

                <p className="text-xs text-slate-400 text-center">
                  诚信交易 · 解锁后可永久查看报告
                </p>
              </>
            )}

            {step === 'code' && (
              <>
                <div className="bg-gradient-to-br from-white to-indigo-50/50 rounded-2xl p-5 text-center space-y-3 border border-indigo-100">
                  <p className="text-xs font-medium text-indigo-400 uppercase tracking-wider">今日解锁码</p>
                  <div className="bg-white rounded-xl py-4 px-4 border-2 border-dashed border-indigo-200">
                    <span className="text-2xl font-mono font-bold tracking-[0.3em] text-indigo-700 select-all">
                      {dailyCode || '••••••••••'}
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
                    placeholder="输入或粘贴解锁码"
                    className={`w-full px-4 py-3.5 rounded-xl border-2 text-center text-lg tracking-widest outline-none transition-all ${
                      error
                        ? 'border-red-300 bg-red-50 placeholder-red-300'
                        : 'border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50'
                    }`}
                    autoFocus
                  />
                  {error && (
                    <p className="text-red-500 text-xs mt-1.5 text-center">{error}</p>
                  )}
                </div>

                <Button onClick={handleVerify} disabled={verifying} size="lg" className="w-full h-12 text-base">
                  {verifying ? '验证中...' : '确认解锁'}
                </Button>

                <button
                  onClick={() => setStep('code')}
                  className="w-full text-xs text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer"
                >
                  ← 返回查看解锁码
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
