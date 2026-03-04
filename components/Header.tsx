'use client';

import React from 'react';
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';
import { LogOut, User } from 'lucide-react';

export default function Header() {
  const { role, setRole } = useAppContext();

  if (!role) return null;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest py-1 text-center">
        Current Role: {role}
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            <Image 
              src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXfTteioSstds6PWnMZuidJMqRYMtVVQGyPt3EexpjhnP9HrRXZ0_3H72SZooXQ3bnlURpX09s5mvrO07fLxO3k7C_8D9mBTm5eXlBqed8jPhaekxSkeuJuBpxwV1BbU1hu3xeG0cYIZkvDvBP-qK4YpkvyOq-g?key=kl0MF71HcvaAWt9zvK_MLQ"
              alt="Smart Zero Logo"
              fill
              className="object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-slate-800">
            Smart Zero™
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
              <User size={16} />
            </div>
            <span>{role === 'Abstractor' ? 'Abstractor #42' : role === 'Title Examiner' ? 'Senior Examiner' : 'Admin Manager'}</span>
          </div>
          <button 
            onClick={() => setRole(null)}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            title="Switch Role"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
