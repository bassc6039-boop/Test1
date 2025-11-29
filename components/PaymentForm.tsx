import React from 'react';
import { PaymentMode } from '../types';

interface PaymentFormProps {
  amount: number;
  setAmount: (val: number) => void;
  description: string;
  setDescription: (val: string) => void;
  onPay: () => void;
  isAiLoading: boolean;
  onAiGenerate: () => void;
  merchantName: string;
  paymentMode: PaymentMode;
}

const SbpLogo = () => (
  <svg viewBox="0 0 200 120" className="w-16 h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="120" rx="10" fill="transparent" />
    <path d="M40 60L70 30V50H130V30L160 60L130 90V70H70V90L40 60Z" fill="url(#paint0_linear_local)" />
    <defs>
      <linearGradient id="paint0_linear_local" x1="40" y1="60" x2="160" y2="60" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7C3AED" />
        <stop offset="1" stopColor="#2563EB" />
      </linearGradient>
    </defs>
    <text x="100" y="110" textAnchor="middle" fill="#333" fontSize="14" fontFamily="sans-serif" fontWeight="bold">СБП</text>
  </svg>
);

export const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  setAmount,
  description,
  setDescription,
  onPay,
  isAiLoading,
  onAiGenerate,
  merchantName,
  paymentMode
}) => {
  const isC2C = paymentMode === 'C2C';
  const isReal = paymentMode === 'REAL_STATIC';
  
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 relative overflow-hidden">
      {/* Merchant Badge */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
          isReal ? 'from-orange-500 to-red-600' :
          isC2C ? 'from-green-500 to-emerald-600' : 'from-indigo-500 to-purple-600'
      }`}></div>
      
      <div className="flex justify-between items-start mb-6">
         <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
           <SbpLogo />
         </div>
         <div className="text-right">
             <p className={`text-xs font-medium uppercase tracking-wider ${isReal ? 'text-orange-600' : 'text-gray-400'}`}>
                 {isReal ? 'Реальный платеж' : (isC2C ? 'Получатель перевода' : 'Магазин')}
             </p>
             <p className="text-sm font-bold text-gray-800">
                 {isReal ? 'Прямой перевод' : merchantName}
             </p>
         </div>
      </div>
      
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          {isReal ? 'Оплата (Real Mode)' : (isC2C ? 'Перевод через СБП' : 'Оплата через СБП')}
      </h2>
      <p className="text-center text-gray-500 mb-8 text-sm">
          {isReal 
           ? 'Платеж по вашей ссылке СБП' 
           : (isC2C ? 'Моментально по номеру телефона' : 'Безопасные платежи без комиссии')
          }
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Сумма {isC2C ? 'перевода' : 'платежа'} (₽)</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="block w-full text-center text-4xl font-bold text-gray-900 border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 py-4 bg-gray-50"
              placeholder="0.00"
              min="1"
            />
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <span className="text-gray-400 font-bold text-xl">₽</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Назначение / Сообщение</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={isC2C ? "Вернуть долг за обед" : "Например: кофе"}
            />
            <button
              onClick={onAiGenerate}
              disabled={isAiLoading}
              className={`px-3 rounded-lg transition-colors flex items-center justify-center border ${
                  isReal ? 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100' :
                  isC2C ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100' : 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100'
              }`}
              title="Сгенерировать описание с помощью AI"
            >
              {isAiLoading ? (
                 <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
              ) : (
                <span>✨ AI</span>
              )}
            </button>
          </div>
        </div>

        <button
          onClick={onPay}
          disabled={amount < 1}
          className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white transition-all transform hover:scale-[1.02] ${
            amount < 1 
            ? 'bg-gray-300 cursor-not-allowed' 
            : isReal
                ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg shadow-orange-500/30'
                : isC2C 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30'
          }`}
        >
          {isReal ? 'Создать QR' : (isC2C ? 'Перевести' : 'Оплатить')} {amount > 0 ? `${amount} ₽` : ''}
        </button>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
        <span>🔒 Защищено сквозным шифрованием</span>
      </div>
    </div>
  );
};