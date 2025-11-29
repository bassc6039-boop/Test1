import React from 'react';
import { PaymentMode } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchantName: string;
  setMerchantName: (val: string) => void;
  merchantPhone: string;
  setMerchantPhone: (val: string) => void;
  paymentMode: PaymentMode;
  setPaymentMode: (val: PaymentMode) => void;
  realLink: string;
  setRealLink: (val: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  merchantName,
  setMerchantName,
  merchantPhone,
  setMerchantPhone,
  paymentMode,
  setPaymentMode,
  realLink,
  setRealLink
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h3 className="text-xl font-bold text-gray-800">Настройки терминала</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-5">
          {/* Mode Switcher */}
          <div className="space-y-2">
             <label className="block text-sm font-medium text-gray-700">Режим работы</label>
             <div className="bg-gray-100 p-1 rounded-lg flex flex-col gap-1">
                <div className="flex w-full">
                    <button
                    onClick={() => setPaymentMode('C2B')}
                    className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${
                        paymentMode === 'C2B' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    >
                    🏢 Демо C2B
                    </button>
                    <button
                    onClick={() => setPaymentMode('C2C')}
                    className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${
                        paymentMode === 'C2C' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    >
                    👤 Демо C2C
                    </button>
                </div>
                <button
                onClick={() => setPaymentMode('REAL_STATIC')}
                className={`w-full py-2 text-xs font-bold rounded-md transition-all border ${
                    paymentMode === 'REAL_STATIC' ? 'bg-orange-50 text-orange-700 border-orange-200 shadow-sm' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                >
                ⚡ Реальный QR (Static Link)
                </button>
            </div>
          </div>

          <div className={`p-4 rounded-lg border text-xs leading-relaxed ${
              paymentMode === 'C2B' ? 'bg-indigo-50 border-indigo-100 text-indigo-800' : 
              paymentMode === 'C2C' ? 'bg-green-50 border-green-100 text-green-800' :
              'bg-orange-50 border-orange-100 text-orange-800'
          }`}>
            <p>
              <strong>
                  {paymentMode === 'C2B' && 'Симуляция Магазина (Демо)'}
                  {paymentMode === 'C2C' && 'Симуляция Перевода (Демо)'}
                  {paymentMode === 'REAL_STATIC' && 'Реальные платежи (Без сервера)'}
              </strong>
              <br/>
              {paymentMode === 'C2B' && 'Генерирует тестовые ссылки. Оплата не проходит.'}
              {paymentMode === 'C2C' && 'Имитирует диплинки Сбера. Оплата не проходит.'}
              {paymentMode === 'REAL_STATIC' && 'Генерирует QR на основе вашей реальной ссылки СБП. Деньги придут на ваш счет. Статус платежа нужно проверять вручную.'}
            </p>
          </div>

          {paymentMode === 'REAL_STATIC' && (
              <div className="animate-fade-in">
                <label className="block text-sm font-bold text-gray-800 mb-1">
                    Ваша ссылка СБП (NSPK)
                </label>
                <input
                    type="text"
                    value={realLink}
                    onChange={(e) => setRealLink(e.target.value)}
                    className="block w-full border border-orange-300 rounded-lg shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500 sm:text-xs font-mono bg-orange-50"
                    placeholder="https://qr.nspk.ru/..."
                />
                <p className="text-[10px] text-gray-500 mt-1">
                    Получите QR в приложении банка -> Распознайте его сканером -> Скопируйте ссылку сюда.
                </p>
              </div>
          )}

          {(paymentMode === 'C2B' || paymentMode === 'C2C') && (
            <>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    {paymentMode === 'C2B' ? 'Название магазина' : 'Имя получателя'}
                    </label>
                    <input
                    type="text"
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    className="block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder={paymentMode === 'C2B' ? "Моя Кофейня" : "Иван И."}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {paymentMode === 'C2B' ? 'ID Мерчанта / Телефон' : 'Номер телефона'}
                    </label>
                    <input
                    type="text"
                    value={merchantPhone}
                    onChange={(e) => setMerchantPhone(e.target.value)}
                    className="block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="+7 (999) 000-00-00"
                    />
                </div>
            </>
          )}
        </div>

        <div className="mt-8">
          <button
            onClick={onClose}
            className="w-full bg-gray-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Сохранить настройки
          </button>
        </div>
      </div>
    </div>
  );
};