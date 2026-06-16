'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

type Tab = 'wechat' | 'alipay';

function getTodayKeyword(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `XG${mm}${dd}`;
}

interface PaymentModalProps {
  onUnlock: () => void;
  onClose: () => void;
}

export function PaymentModal({ onUnlock, onClose }: PaymentModalProps) {
  const [step, setStep] = useState<'pay' | 'confirm' | 'keyword' | 'unlock'>('pay');
  const [tab, setTab] = useState<Tab>('wechat');
  const [dailyCode, setDailyCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);

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
          <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            ✕
          </button>

          <div className="p-6 space-y-5">
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

            {/* ===== Step 1: 扫码支付 ===== */}
            {step === 'pay' && (
              <>
                {/* 支付切换 */}
                <div className="flex bg-slate-100 rounded-xl p-1">
                  {[
                    { key: 'wechat' as Tab, label: '微信支付', icon: '💬' },
                    { key: 'alipay' as Tab, label: '支付宝', icon: '💙' },
                  ].map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setTab(t.key)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                        tab === t.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>

                {/* 收款码 */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/50 via-purple-100/30 to-pink-100/50 rounded-2xl" />
                  <div className="relative bg-white rounded-2xl p-5 border border-slate-100 shadow-inner">
                    <div className="flex flex-col items-center">
                      <div className="relative">
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
                      <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h2l1-3h2l1 3h2l1-3h2l1 3h2M7 14h10M7 18h10" />
                        </svg>
                        {tab === 'wechat' ? '打开微信扫一扫' : '打开支付宝扫一扫'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-xs text-indigo-600 mt-0.5">1</div>
                  <p className="text-xs text-slate-500 leading-relaxed">扫码支付 ¥9.9，保存支付凭证截图</p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-xs text-indigo-600 mt-0.5">2</div>
                  <p className="text-xs text-slate-500 leading-relaxed">支付后点击下方按钮，获取暗号</p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-xs text-indigo-600 mt-0.5">3</div>
                  <p className="text-xs text-slate-500 leading-relaxed">关注公众号发送暗号，自动获取解锁码</p>
                </div>

                <Button onClick={() => setStep('confirm')} size="lg" className="w-full h-12 text-base">
                  ✅ 我已支付 ¥9.9，下一步
                </Button>
              </>
            )}

            {/* ===== Step 2: 确认支付 ===== */}
            {step === 'confirm' && (
              <>
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">⚠️</span>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-amber-800">请确认你已真实支付</p>
                      <p className="text-xs text-amber-600 leading-relaxed">
                        未支付获取解锁码属于不诚信行为。系统会记录每次解锁，异常访问将被限制。
                      </p>
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-3 p-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmChecked}
                    onChange={(e) => setConfirmChecked(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-600 leading-relaxed">
                    我已真实支付 ¥9.9，理解虚假操作将被限制使用
                  </span>
                </label>

                <Button
                  onClick={() => setStep('keyword')}
                  disabled={!confirmChecked}
                  size="lg"
                  className="w-full h-12 text-base"
                >
                  确认已支付，获取暗号
                </Button>
              </>
            )}

            {/* ===== Step 3: 公众号 + 暗号 ===== */}
            {step === 'keyword' && (
              <>
                <div className="bg-green-50 rounded-2xl p-5 space-y-4 border border-green-200">
                  <div className="text-center">
                    <p className="text-sm font-medium text-green-800 mb-3">
                      📱 微信搜索关注公众号
                    </p>
                    <div className="bg-white rounded-xl py-3 px-4 border border-green-200">
                      <span className="text-lg font-bold text-green-700">小蓝的志愿笔记</span>
                    </div>
                  </div>

                  <div className="border-t border-green-200 pt-4 text-center space-y-2">
                    <p className="text-sm font-medium text-green-800">
                      关注后发送下方暗号获取解锁码
                    </p>
                    <div className="bg-white rounded-xl py-3 px-4 border-2 border-dashed border-green-300">
                      <span className="text-2xl font-mono font-bold tracking-[0.3em] text-green-700 select-all">
                        {getTodayKeyword()}
                      </span>
                    </div>
                    <p className="text-xs text-green-500">
                      暗号每日更新 · 当日有效
                    </p>
                  </div>
                </div>

                <Button onClick={() => setStep('unlock')} size="lg" variant="outline" className="w-full">
                  已拿到解锁码，去输入 →
                </Button>

                <p className="text-xs text-slate-400 text-center">
                  如有问题，关注公众号后直接联系客服
                </p>
              </>
            )}

            {/* ===== Step 4: 输入解锁码 ===== */}
            {step === 'unlock' && (
              <>
                <div>
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => { setInputCode(e.target.value); setError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                    placeholder="输入解锁码"
                    className={`w-full px-4 py-3.5 rounded-xl border-2 text-center text-lg tracking-widest outline-none transition-all ${
                      error
                        ? 'border-red-300 bg-red-50 placeholder-red-300'
                        : 'border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50'
                    }`}
                    autoFocus
                  />
                  {error && <p className="text-red-500 text-xs mt-1.5 text-center">{error}</p>}
                </div>

                <Button onClick={handleVerify} disabled={verifying} size="lg" className="w-full h-12 text-base">
                  {verifying ? '验证中...' : '确认解锁'}
                </Button>

                <button
                  onClick={() => setStep('keyword')}
                  className="w-full text-xs text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer"
                >
                  ← 返回查看暗号
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
