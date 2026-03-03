'use client';

import React from 'react';
import { Clock, AlertTriangle, Calendar } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export default function AgingRiskBanner() {
  const { currentOrder, cureItems } = useAppContext();

  if (!currentOrder) return null;

  const orderCureItems = cureItems.filter(item => item.orderId === currentOrder.orderId);
  
  // Mock calculations
  const closingDate = new Date();
  closingDate.setDate(closingDate.getDate() + 14); // 14 days from now
  const daysUntilClosing = 14;
  
  const oldestItemAge = orderCureItems.length > 0 
    ? Math.max(...orderCureItems.map(i => i.daysOpen)) 
    : 0;

  const hasHighRiskOverdue = orderCureItems.some(i => i.priority === 'High' && i.daysOpen > 5);
  const payoffWarning = daysUntilClosing <= 14 && orderCureItems.some(i => i.type === 'Payoff' && i.status !== 'Resolved');

  return (
    <div className="bg-slate-900 rounded-xl p-4 mb-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
            <Calendar size={20} className="text-indigo-300" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Closing Countdown</p>
            <p className="text-xl font-bold">{daysUntilClosing} Days</p>
          </div>
        </div>
        
        <div className="w-px h-10 bg-slate-700 hidden md:block" />
        
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg border ${oldestItemAge > 10 ? 'bg-red-500/20 border-red-500/30' : 'bg-slate-700 border-slate-600'}`}>
            <Clock size={20} className={oldestItemAge > 10 ? 'text-red-300' : 'text-slate-300'} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Oldest Open Item</p>
            <p className="text-xl font-bold">{oldestItemAge} Days</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {payoffWarning && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <AlertTriangle size={14} className="text-amber-400" />
            <span className="text-xs font-bold text-amber-200">Payoff Ordering Critical</span>
          </div>
        )}
        {hasHighRiskOverdue && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg">
            <AlertTriangle size={14} className="text-red-400" />
            <span className="text-xs font-bold text-red-200">High Risk Escalation Warning</span>
          </div>
        )}
      </div>
    </div>
  );
}
