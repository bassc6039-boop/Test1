import React, { useEffect, useState } from 'react';
import { DEMO_BANKS } from '../constants';
import { BankApp, PaymentMode } from '../types';

interface QRCodeScreenProps {
  amount: number;
  onCancel: () => void;
  onSuccessDemo: () => void; 
  merchantName: string;
  merchantPhone: string;
  paymentMode: PaymentMode;
  realLink: string;
}

export const QRCodeScreen: React.FC<QRCodeScreenProps> = ({ 
  amount, 
  onCancel, 
  onSuccessDemo, 
  merchantName, 
  merchantPhone,
  paymentMode,
  realLink
}) => {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const isC2C = paymentMode === 'C2C';
  const isReal = paymentMode === 'REAL_STATIC';
  
  // Construct QR Data logic
  let qrData = '';

  if (isReal) {
      // Clean the user link
      let cleanLink = realLink.trim();
      if (!cleanLink.startsWith('http')) {
          // Fallback if they pasted just raw data or something broken
          qrData = cleanLink; 
      } else {
          // Try to append amount. 
          // Note: Many personal SBP links (sbp.nspk.ru) are static and ignore params, 
          // but Business QRs (qr.nspk.ru) often support &sum=.
          const hasParams = cleanLink.includes('?');
          const separator = hasParams ? '&' : '?';
          // Convert amount to cents/kopecks is not usually needed for NSPK url params standard, usually just sum=100.00
          // However, some banks require specific formatting. We will try the standard &sum=X
          qrData = `${cleanLink}${separator}sum=${amount}`;
      }
  } else if (isC2C) {
      qrData = `https://sberbank.ru/sms/p2p?phone=${merchantPhone}&amount=${amount}`;
  } else {
      qrData = `https://sbp.nspk.ru/pay?sum=${amount}&cur=RUB&merchant=${encodeURIComponent(merchantName)}&id=${merchantPhone}`;
  }
    
  // Use a reliable QR generator service
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}&color=${isReal ? '000000' : (isC2C ? '047857' : '0f172a')}&bgcolor=ffffff&margin=10`;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onCancel(); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onCancel]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleBankClick = (bank: BankApp) => {
    if (isReal) {
        // In real mode, we try to open the NSPK link directly
        window.location.href = qrData;
        return;
    }

    // Demo Logic
    let deepLink = bank.scheme;
    let message = '';

    if (isC2C && bank.id === 'sber') {
        deepLink = `sberbank://payments/p2p?phone=${merchantPhone}&amount=${amount}`;
        message = `Открываем СберБанк Онлайн для перевода ${amount}₽ на ${merchantPhone}...`;
    } else if (isC2C) {
        message = `Открываем ${bank.name} для перевода по номеру ${merchantPhone}...`;
    } else {
        message = `Открываем ${bank.name} для оплаты заказа...`;
    }
    
    alert(`${message}\n\n(Симуляция перехода: ${deepLink})`);
    
    setTimeout(() => {
        onSuccessDemo();
    }, 2000);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 flex flex-col items-center animate-fade-in relative overflow-hidden">
      
       <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
           isReal ? 'from-orange-500 to-red-600' :
           isC2C ? 'from-green-500 to-emerald-600' : 'from-indigo-500 to-purple-600'
        }`}></div>

      <div className="w-full flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">
            {isReal ? 'Реальный платеж' : (isC2C ? 'Сканируйте для перевода' : 'Сканируйте QR-код')}
        </h3>
        <span className={`${timeLeft < 60 ? 'text-red-600' : 'text-gray-500'} font-mono font-medium bg-gray-50 px-2 py-1 rounded`}>{formatTime(timeLeft)}</span>
      </div>

      <div className="relative group mb-4">
        <div className={`absolute -inset-1 bg-gradient-to-r rounded-xl blur opacity-25 ${
            isReal ? 'from-orange-400 to-red-500' : 
            isC2C ? 'from-green-400 to-teal-500' : 'from-indigo-500 to-purple-600'
        }`}></div>
        <div className="relative bg-white p-4 rounded-xl border-2 border-dashed border-gray-200">
           {/* If real link is missing */}
           {isReal && !realLink ? (
               <div className="w-48 h-48 flex items-center justify-center bg-gray-100 text-center text-xs text-gray-500 p-2">
                   Ссылка СБП не настроена. Зайдите в настройки.
               </div>
           ) : (
                <img src={qrUrl} alt="Payment QR" className="w-48 h-48 object-contain mix-blend-multiply" />
           )}
           
           {!isReal && (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white p-1 rounded-full shadow-sm opacity-90">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${isC2C ? 'from-green-500 to-green-700' : 'from-indigo-600 to-purple-600'}`}></div>
                </div>
               </div>
           )}
        </div>
      </div>

      <div className="text-center mb-6">
        <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">
            {isReal ? 'Режим реальной оплаты' : (isC2C ? 'Получатель' : 'Магазин')}
        </p>
        <p className="font-bold text-gray-800 text-lg leading-tight">
            {isReal ? 'Ваш Реквизит (Static)' : merchantName}
        </p>
        <p className="text-xs text-gray-500 font-mono mt-1">
            {isReal ? 'Проверьте поступление в банке' : merchantPhone}
        </p>
      </div>

      <p className="text-gray-500 text-center mb-6 text-sm">
        {isReal 
         ? <span className="text-orange-600 font-medium">Внимание: Авто-проверка статуса отключена.<br/>Отсканируйте код для оплаты.</span>
         : <span>Наведите камеру или выберите банк<br/><strong>{amount.toFixed(2)} ₽</strong></span>
        }
      </p>

      {/* Bank Buttons - Only show in Simulation mode or as simple links in Real mode */}
      <div className="w-full grid grid-cols-2 gap-3 mb-6">
        {DEMO_BANKS.map((bank) => {
            const isSberHighlighted = isC2C && bank.id === 'sber';
            return (
              <button
                key={bank.id}
                onClick={() => handleBankClick(bank)}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all group relative overflow-hidden ${
                    isSberHighlighted 
                    ? 'bg-green-50 border-green-300 shadow-md ring-1 ring-green-200 hover:bg-green-100' 
                    : 'bg-white border-gray-100 hover:bg-gray-50 hover:border-indigo-100'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex-shrink-0 ${bank.color} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                  {bank.name[0]}
                </div>
                <span className={`text-sm font-medium text-gray-700`}>
                    {bank.name}
                </span>
              </button>
            )
        })}
      </div>

      <button
        onClick={onCancel}
        className="text-gray-400 text-sm hover:text-gray-600 underline"
      >
        Отменить {isC2C ? 'перевод' : 'платеж'}
      </button>

      {/* Manual Success Trigger for Real Mode */}
      {isReal && (
          <div className="mt-6 w-full animate-pulse-slow">
              <button 
                onClick={onSuccessDemo}
                className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-200 transition-all"
              >
                Я получил деньги (Вручную)
              </button>
              <p className="text-[10px] text-center mt-2 text-gray-400">
                  Нажмите эту кнопку только после того, как увидите поступление денег в своем банковском приложении.
              </p>
          </div>
      )}

      {/* Demo Only Button */}
      {!isReal && (
        <div className="mt-8 pt-4 border-t w-full border-gray-100 text-center">
            <p className="text-xs text-gray-400 mb-2">РЕЖИМ ОТЛАДКИ</p>
            <button 
                onClick={onSuccessDemo}
                className="text-xs bg-gray-100 hover:bg-green-100 text-gray-500 hover:text-green-700 py-1 px-3 rounded border border-gray-200"
            >
                [Симуляция: Успех]
            </button>
        </div>
      )}
    </div>
  );
};