'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export default function ProductivityMetrics() {
  const { productivityMetrics } = useAppContext();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Examiner Metrics Preview</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {productivityMetrics.map((metric, idx) => (
          <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] text-slate-500 uppercase mb-1">{metric.metric}</p>
            <div className="flex items-end justify-between">
              <p className="text-lg font-bold text-slate-900">{metric.value}</p>
              <div className={`flex items-center gap-0.5 text-[10px] font-bold ${
                metric.trend === 'up' ? 'text-emerald-600' : 
                metric.trend === 'down' ? 'text-emerald-600' : // Assuming down is good for time/override
                'text-slate-400'
              }`}>
                {metric.trend === 'up' && <TrendingUp size={12} />}
                {metric.trend === 'down' && <TrendingDown size={12} />}
                {metric.trend === 'neutral' && <Minus size={12} />}
                {metric.trendValue}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
