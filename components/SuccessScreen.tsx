import React, { useEffect, useState } from 'react';
import { generateReceiptNote } from '../services/geminiService';

interface SuccessScreenProps {
  amount: number;
  item: string;
  onReset: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ amount, item, onReset }) => {
  const [aiNote, setAiNote] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchNote = async () => {
      if (!process.env.API_KEY) {
        setAiNote("Спасибо за оплату!");
        setLoading(false);
        return;
      }
      
      const note = await generateReceiptNote(amount, item);
      if (mounted) {
        setAiNote(note);
        setLoading(false);
      }
    };
    fetchNote();
    return () => { mounted = false; };
  }, [amount, item]);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center border-t-8 border-green-500">
      <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">Оплата прошла успешно!</h2>
      <p className="text-gray-500 mb-6">Сумма {amount.toFixed(2)} ₽ была списана.</p>

      <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left border border-gray-100">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Чек от AI-Кассира</p>
        <div className="min-h-[2rem]">
            {loading ? (
                 <div className="animate-pulse flex space-x-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                 </div>
            ) : (
                <p className="text-gray-700 italic text-sm">"{aiNote}"</p>
            )}
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium shadow-lg"
      >
        Новый платеж
      </button>
    </div>
  );
};
