'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

type Tab = 'wechat' | 'alipay';

interface PaymentModalProps {
  onUnlock: () => void;
  onClose: () => void;
}

export function PaymentModal({ onUnlock, onClose }: PaymentModalProps) {
  const [step, setStep] = useState<'pay' | 'nickname' | 'waiting' | 'done'>('pay');
  const [tab, setTab] = useState<Tab>('wechat');
  const [nickname, setNickname] = useState('');
  const [orderId, setOrderId] = useState('');
  const [unlockCode, setUnlockCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleSubmitNickname = async () => {
    if (!nickname.trim()) return;
    const res = await fetch('/api/admin/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname: nickname.trim() }),
    });
    const data = await res.json();
    if (data.orderId) {
      setOrderId(data.orderId);
      setStep('waiting');
      // 开始轮询
      pollingRef.current = setInterval(async () => {
        const r = await fetch(`/api/admin/check?orderId=${data.orderId}`);
        const d = await r.json();
        if (d.approved && d.code) {
          setUnlockCode(d.code);
          setStep('done');
          if (pollingRef.current) clearInterval(pollingRef.current);
        }
      }, 3000);
    }
  };

  const handleUnlock = () => {
    if (inputCode.trim().toUpperCase() === unlockCode) {
      onUnlock();
    } else {
      setError('解锁码不匹配');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <Card className="max-w-sm w-full my-8 shadow-2xl border-0">
        <CardContent className="p-0 relative overflow-hidden rounded-2xl">
          <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer">✕</button>

          <div className="p-6 space-y-5">
            <div className="text-center pt-2">
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                {step === 'done' ? '解锁成功' : step === 'waiting' ? '等待确认' : '解锁深度报告'}
              </h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-sm text-slate-400">¥</span>
                <span className="text-3xl font-extrabold text-slate-900">9.9</span>
              </div>
            </div>

            {step === 'pay' && (
              <>
                <div className="flex bg-slate-100 rounded-xl p-1">
                  {[
                    { key: 'wechat' as Tab, label: '微信', icon: '💬' },
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

                <div className="relative">
                  <div className="relative bg-white rounded-2xl p-5 border border-slate-100">
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <div className="absolute -top-2 -left-2 w-5 h-5 border-t-2 border-l-2 border-indigo-300 rounded-tl-lg" />
                        <div className="absolute -top-2 -right-2 w-5 h-5 border-t-2 border-r-2 border-indigo-300 rounded-tr-lg" />
                        <div className="absolute -bottom-2 -left-2 w-5 h-5 border-b-2 border-l-2 border-indigo-300 rounded-bl-lg" />
                        <div className="absolute -bottom-2 -right-2 w-5 h-5 border-b-2 border-r-2 border-indigo-300 rounded-br-lg" />
                        <img
                          src={tab === 'wechat' ? '/wechat-pay.jpeg' : '/alipay.jpeg'}
                          alt={tab === 'wechat' ? '微信' : '支付宝'}
                          className="w-44 h-44 object-contain rounded-lg"
                        />
                      </div>
                      <p className="mt-4 text-xs text-slate-400">
                        {tab === 'wechat' ? '打开微信扫一扫' : '打开支付宝扫一扫'}
                      </p>
                    </div>
                  </div>
                </div>

                <Button onClick={() => setStep('nickname')} size="lg" className="w-full h-12 text-base">
                  ✅ 已支付 ¥9.9，下一步
                </Button>
              </>
            )}

            {step === 'nickname' && (
              <>
                <p className="text-sm text-slate-600 text-center">请输入你的微信昵称，方便核对支付记录</p>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmitNickname()}
                  placeholder="你的微信昵称"
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 text-center text-lg outline-none focus:border-indigo-400"
                  autoFocus
                />
                <Button onClick={handleSubmitNickname} disabled={!nickname.trim()} size="lg" className="w-full h-12 text-base">
                  提交，等待确认
                </Button>
                <button onClick={() => setStep('pay')} className="w-full text-xs text-slate-400 hover:text-indigo-500 cursor-pointer">← 返回</button>
              </>
            )}

            {step === 'waiting' && (
              <div className="space-y-4">
                <div className="bg-amber-50 rounded-2xl p-5 text-center border border-amber-200">
                  <div className="text-3xl mb-3 animate-bounce">⏳</div>
                  <p className="font-bold text-amber-800 mb-1">等待确认支付</p>
                  <p className="text-sm text-amber-600">昵称：{nickname}</p>
                  <p className="text-xs text-amber-500 mt-2">客服正在核实你的支付记录，请稍候...</p>
                </div>
                <p className="text-xs text-slate-400 text-center">页面会自动刷新，无需手动操作</p>
              </div>
            )}

            {step === 'done' && (
              <>
                <div className="bg-green-50 rounded-2xl p-5 text-center border border-green-200">
                  <div className="text-3xl mb-2">✅</div>
                  <p className="font-bold text-green-800 mb-1">支付已确认</p>
                  <div className="bg-white rounded-xl py-3 px-4 mt-3 border border-green-200">
                    <span className="text-xl font-mono font-bold tracking-wider text-green-700 select-all">{unlockCode}</span>
                  </div>
                  <p className="text-xs text-green-500 mt-2">解锁码已生成，输入下方确认</p>
                </div>

                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => { setInputCode(e.target.value); setError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                  placeholder="粘贴解锁码"
                  className={`w-full px-4 py-3.5 rounded-xl border-2 text-center text-lg tracking-widest outline-none ${error ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-indigo-400'}`}
                  autoFocus
                />
                {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                <Button onClick={handleUnlock} size="lg" className="w-full h-12 text-base bg-green-600 hover:bg-green-700">确认解锁</Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
