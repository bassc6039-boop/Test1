import React, { useState } from 'react';
import { PaymentStatus, PaymentMode } from './types';
import { PaymentForm } from './components/PaymentForm';
import { QRCodeScreen } from './components/QRCodeScreen';
import { SuccessScreen } from './components/SuccessScreen';
import { SettingsModal } from './components/SettingsModal';
import { generateSmartDescription } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<PaymentStatus>(PaymentStatus.IDLE);
  const [amount, setAmount] = useState<number>(1);
  const [description, setDescription] = useState<string>('Тестовый платеж');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [merchantName, setMerchantName] = useState("Иван И.");
  const [merchantPhone, setMerchantPhone] = useState("+79990000000");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('C2C');
  const [realLink, setRealLink] = useState<string>("");

  const handlePay = () => {
    // If Real Mode is selected but no link provided, warn user
    if (paymentMode === 'REAL_STATIC' && !realLink) {
        setIsSettingsOpen(true);
        alert("Для реальных платежей укажите вашу СБП ссылку в настройках!");
        return;
    }

    setStatus(PaymentStatus.GENERATING_QR);
    
    // In Real Mode, we don't need a fake delay to 'simulate' generation if we use static link,
    // but a small delay looks nicer.
    setTimeout(() => {
      setStatus(PaymentStatus.WAITING_FOR_PAYMENT);
    }, 600);
  };

  const handleAiGenerate = async () => {
      if (!process.env.API_KEY) {
          alert("Пожалуйста, добавьте API_KEY для использования AI функций.");
          return;
      }
      setIsAiLoading(true);
      const smartDesc = await generateSmartDescription(description);
      setDescription(smartDesc);
      setIsAiLoading(false);
  };

  const handleSuccess = () => {
    setStatus(PaymentStatus.SUCCESS);
  };

  const handleReset = () => {
    setStatus(PaymentStatus.IDLE);
    setAmount(1);
    setDescription('Тестовый платеж');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-100 to-transparent rounded-full opacity-50 blur-3xl transform scale-150"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-100 to-transparent rounded-full opacity-50 blur-3xl transform scale-150"></div>
      </div>

      <div className="z-10 w-full flex flex-col items-center">
        
        {/* Header / Config Button */}
        <div className="absolute top-4 right-4 z-20">
           <button 
             onClick={() => setIsSettingsOpen(true)}
             className={`p-2 rounded-full shadow-md transition-colors ${paymentMode === 'REAL_STATIC' ? 'bg-orange-100 text-orange-600 ring-2 ring-orange-400' : 'bg-white text-gray-500 hover:text-indigo-600'}`}
             title="Настройки терминала"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
             </svg>
           </button>
        </div>

        <SettingsModal 
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          merchantName={merchantName}
          setMerchantName={setMerchantName}
          merchantPhone={merchantPhone}
          setMerchantPhone={setMerchantPhone}
          paymentMode={paymentMode}
          setPaymentMode={setPaymentMode}
          realLink={realLink}
          setRealLink={setRealLink}
        />

        {status === PaymentStatus.IDLE && (
          <PaymentForm 
            amount={amount}
            setAmount={setAmount}
            description={description}
            setDescription={setDescription}
            onPay={handlePay}
            isAiLoading={isAiLoading}
            onAiGenerate={handleAiGenerate}
            merchantName={merchantName}
            paymentMode={paymentMode}
          />
        )}

        {status === PaymentStatus.GENERATING_QR && (
           <div className="flex flex-col items-center justify-center mt-20">
             <div className={`w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mb-4 ${paymentMode === 'REAL_STATIC' ? 'border-orange-500' : 'border-indigo-600'}`}></div>
             <p className="text-gray-600 font-medium animate-pulse">Генерация ссылки на оплату...</p>
           </div>
        )}

        {status === PaymentStatus.WAITING_FOR_PAYMENT && (
          <QRCodeScreen 
            amount={amount}
            onCancel={() => setStatus(PaymentStatus.IDLE)}
            onSuccessDemo={handleSuccess}
            merchantName={merchantName}
            merchantPhone={merchantPhone}
            paymentMode={paymentMode}
            realLink={realLink}
          />
        )}

        {status === PaymentStatus.SUCCESS && (
          <SuccessScreen 
            amount={amount} 
            item={description}
            onReset={handleReset}
          />
        )}
        
        <div className="mt-8 text-center text-gray-400 text-xs max-w-xs">
          <p>© 2024 SBPay Demo.</p>
          {paymentMode === 'REAL_STATIC' ? (
              <p className="mt-1 text-orange-600 font-bold">⚠️ РЕЖИМ РЕАЛЬНОЙ ОПЛАТЫ АКТИВЕН</p>
          ) : (
              <p className="mt-1">Для реальных платежей переключите режим в настройках.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;