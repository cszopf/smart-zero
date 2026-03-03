'use client';

import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { UserRole } from '@/types';
import { Shield, Search, BarChart3, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';

export default function LoginScreen() {
  const { setRole } = useAppContext();

  const roles: { id: UserRole; title: string; desc: string; icon: React.ReactNode }[] = [
    { 
      id: 'Abstractor', 
      title: 'Abstractor', 
      desc: 'Upload findings and reconcile search data.',
      icon: <Search className="text-emerald-600" size={24} />
    },
    { 
      id: 'Title Examiner', 
      title: 'Title Examiner', 
      desc: 'Review verified packages and resolve escalations.',
      icon: <Shield className="text-blue-600" size={24} />
    },
    { 
      id: 'Manager', 
      title: 'Manager', 
      desc: 'Monitor performance and configure risk rules.',
      icon: <BarChart3 className="text-purple-600" size={24} />
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="relative w-48 h-12 mb-8">
            <Image 
              src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXe4r2r4ZaZwuHQDYDcjhSD0oGZH_bM1-x0mYk85YwxjpP73WbzYraj7Cu-jXAjIq54t2s5y6pOvf4_Sf3DPuBXrMo1WS6OropNs9_w2XNqZVgdb_3s8HR717Ob_Bpl6BPoy2zZ5D5hfrF01WMrY9y0d5xUWMg?key=kl0MF71HcvaAWt9zvK_MLQ"
              alt="World Class Title"
              fill
              className="object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tight text-slate-900 mb-4">
            Smart Abstractor Verify
          </h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            The next generation of title search reconciliation. 
            Ensuring zero-claims accuracy through AI-assisted verification.
          </p>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-2">Prototype Access</h3>
            <p className="text-sm text-slate-500">Select a role to begin the simulation. All data is fictional and for demonstration purposes.</p>
          </div>
        </div>

        <div className="space-y-4">
          {roles.map((role, idx) => (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setRole(role.id)}
              className="w-full bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all text-left flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors">
                  {role.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{role.title}</h3>
                  <p className="text-sm text-slate-500">{role.desc}</p>
                </div>
              </div>
              <ArrowRight className="text-slate-300 group-hover:text-slate-900 transition-colors" size={20} />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
