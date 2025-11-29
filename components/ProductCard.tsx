import React from 'react';

export const ProductCard: React.FC = () => {
  return (
    <div className="w-full max-w-md mb-6 animate-fade-in-up">
      <div className="bg-white/5 backdrop-blur-sm border border-white/20 p-4 rounded-2xl mb-2">
         <p className="text-gray-500 text-xs font-bold uppercase tracking-widest text-center mb-2">Предмет покупки</p>
         
         {/* Telegram Profile Card Simulation */}
         <div className="bg-[#212121] text-white rounded-xl overflow-hidden shadow-2xl font-sans border border-gray-800">
            {/* Header / Avatar */}
            <div className="pt-6 pb-4 flex flex-col items-center relative">
               <button className="absolute top-4 right-4 text-gray-400 hover:text-white">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                   <path d="M18 6L6 18M6 6l12 12" />
                 </svg>
               </button>
               
               <div className="w-24 h-24 rounded-full overflow-hidden mb-3 ring-4 ring-[#1c1c1c]">
                 <img 
                   src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                   alt="Avatar" 
                   className="w-full h-full object-cover"
                 />
               </div>
               
               <h2 className="text-xl font-medium">Бабуин</h2>
               <p className="text-gray-500 text-sm">был(а) недавно</p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-4 gap-2 px-4 mb-4">
              {[
                { icon: '💬', label: 'Чат' },
                { icon: '🔔', label: 'Звук' },
                { icon: '📞', label: 'Звонок' },
                { icon: '•••', label: 'Ещё' }
              ].map((btn, idx) => (
                <div key={idx} className="bg-[#2c2c2c] rounded-xl py-2 flex flex-col items-center justify-center cursor-pointer hover:bg-[#353535] transition-colors">
                  <span className="text-xl mb-1 text-[#8774e1]">{btn.icon}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{btn.label}</span>
                </div>
              ))}
            </div>

            {/* Info List */}
            <div className="bg-[#1c1c1c] mx-2 mb-2 rounded-xl p-4 space-y-4">
               {/* Phone */}
               <div className="flex flex-col">
                  <span className="text-base text-white">+7 999 603 3644</span>
                  <span className="text-xs text-gray-500">Телефон</span>
               </div>
               <div className="h-px bg-gray-800 w-full"></div>
               
               {/* Bio */}
               <div className="flex flex-col">
                  <span className="text-base text-white">Я не умру. Меня кошка дома ждёт.</span>
                  <span className="text-xs text-gray-500">О себе</span>
               </div>
               <div className="h-px bg-gray-800 w-full"></div>

               {/* Username */}
               <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-base text-[#8774e1]">@Blublix</span>
                    <span className="text-xs text-gray-500">Имя пользователя</span>
                  </div>
                  <div className="flex gap-1">
                     <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                     <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                  </div>
               </div>
               <div className="h-px bg-gray-800 w-full"></div>

               {/* DOB */}
               <div className="flex flex-col">
                  <span className="text-base text-white">19 март 2007 (18 лет)</span>
                  <span className="text-xs text-gray-500">День рождения</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};