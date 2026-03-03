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
        <div className="flex items-center gap-4">
          <div className="relative w-40 h-10">
            <Image 
              src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXe4r2r4ZaZwuHQDYDcjhSD0oGZH_bM1-x0mYk85YwxjpP73WbzYraj7Cu-jXAjIq54t2s5y6pOvf4_Sf3DPuBXrMo1WS6OropNs9_w2XNqZVgdb_3s8HR717Ob_Bpl6BPoy2zZ5D5hfrF01WMrY9y0d5xUWMg?key=kl0MF71HcvaAWt9zvK_MLQ"
              alt="World Class Title"
              fill
              className="object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="h-6 w-px bg-slate-200 mx-2" />
          <span className="font-display font-bold text-lg tracking-tight text-slate-800">
            Smart Abstractor Verify
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
