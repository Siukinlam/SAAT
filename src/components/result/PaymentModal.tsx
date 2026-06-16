'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

const UNLOCK_CODE = 'SAAT2026';

interface PaymentModalProps {
  onUnlock: () => void;
  onClose: () => void;
}

export function PaymentModal({ onUnlock, onClose }: PaymentModalProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (code.toUpperCase().trim() === UNLOCK_CODE) {
      onUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="max-w-sm w-full">
        <CardContent className="p-6 space-y-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
          >
            ✕
          </button>

          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              🔓 解锁深度报告
            </h3>
            <p className="text-sm text-slate-500">¥9.9 · 一次购买 · 永久可看</p>
          </div>

          {/* 扫码区 */}
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
            <p className="text-xs text-slate-400">
              支付完成后联系客服获取解锁码
            </p>
          </div>

          {/* 解锁码输入 */}
          <div>
            <input
              type="text"
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(false); }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="请输入解锁码"
              className={`w-full px-4 py-3 rounded-xl border-2 text-center text-lg tracking-widest outline-none transition-colors ${
                error
                  ? 'border-red-300 bg-red-50'
                  : 'border-slate-200 focus:border-indigo-400'
              }`}
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-xs mt-1 text-center">
                解锁码错误，请检查后重试
              </p>
            )}
          </div>

          <Button onClick={handleSubmit} size="lg" className="w-full">
            确认解锁
          </Button>

          <p className="text-xs text-slate-400 text-center">
            支付后联系客服获取解锁码，解锁后永久可看
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
