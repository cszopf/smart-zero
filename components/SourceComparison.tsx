'use client';

import React, { useState } from 'react';
import { GitCompare, AlertTriangle, CheckCircle2, Plus } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export default function SourceComparison() {
  const [activeTab, setActiveTab] = useState<'transfer' | 'liens'>('transfer');
  const { addEscalation, currentOrder } = useAppContext();

  if (!currentOrder) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <GitCompare className="text-indigo-600" size={20} />
          <h2 className="text-lg font-display font-bold text-slate-900">Source Comparison</h2>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('transfer')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeTab === 'transfer' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Transfer History
          </button>
          <button 
            onClick={() => setActiveTab('liens')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeTab === 'liens' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Liens & Judgments
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px bg-slate-200 rounded-xl overflow-hidden border border-slate-200">
        <div className="bg-slate-50 p-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
          CoreLogic Findings
        </div>
        <div className="bg-indigo-50 p-3 text-center text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center justify-center gap-2">
          Smart AI Findings
          <span className="bg-indigo-100 px-1.5 py-0.5 rounded text-[10px]">Enhanced</span>
        </div>

        {/* Row 1 */}
        <div className="bg-white p-4">
          <p className="text-sm font-medium text-slate-900">Deed Book 1234 Page 567</p>
          <p className="text-xs text-slate-500">Grantor: John Smith</p>
        </div>
        <div className="bg-white p-4 relative">
          <p className="text-sm font-medium text-slate-900">Deed Book 1234 Page 567</p>
          <p className="text-xs text-slate-500">Grantor: John Smith</p>
          <div className="absolute top-1/2 right-4 -translate-y-1/2">
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
        </div>

        {/* Row 2 - Discrepancy */}
        <div className="bg-white p-4">
          <p className="text-sm font-medium text-slate-400 italic">Not Found</p>
        </div>
        <div className="bg-white p-4 relative border-l-4 border-amber-400">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900">Easement Vol 99 Pg 10</p>
              <p className="text-xs text-slate-500">Utility Easement (1985)</p>
            </div>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-bold uppercase border border-amber-200">
              Discrepancy Detected
            </span>
          </div>
          <button 
            onClick={() => {
              // Mock creating curative item
              alert('Curative Item Created');
            }}
            className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <Plus size={12} /> Create Curative Item
          </button>
        </div>
      </div>
    </div>
  );
}
