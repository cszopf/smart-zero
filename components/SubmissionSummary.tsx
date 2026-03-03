'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { CheckCircle2, ShieldCheck, FileText, ArrowRight, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function SubmissionSummary() {
  const { currentOrder, setCurrentOrder, reconciliationFields } = useAppContext();
  const [attested, setAttested] = useState(false);
  const [signature, setSignature] = useState('');

  if (!currentOrder) return null;

  const handleSubmit = () => {
    setCurrentOrder({ ...currentOrder, status: 'Submitted For Examiner Review' });
  };

  const tier1Fields = reconciliationFields.filter(f => f.tier === 1);
  const escalationsCount = reconciliationFields.filter(f => f.final.escalated).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <button 
        onClick={() => setCurrentOrder({ ...currentOrder, status: 'Reconciliation In Progress' })}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors text-sm font-medium"
      >
        <ChevronLeft size={16} />
        Back to Reconciliation
      </button>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-8 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-slate-900">Verification Summary</h1>
              <p className="text-sm text-slate-500">Order {currentOrder.orderId} • {currentOrder.property.address}</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tier 1 Fields</p>
              <p className="text-2xl font-display font-bold text-slate-900">{tier1Fields.length}</p>
              <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
                <CheckCircle2 size={12} />
                All Reconciled
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Escalations</p>
              <p className="text-2xl font-display font-bold text-slate-900">{escalationsCount}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Pending Examiner Review</p>
            </div>
          </div>

          <section className="space-y-4">
            <h3 className="font-bold text-slate-900">Final Attestation</h3>
            <div className="p-6 rounded-2xl border-2 border-slate-100 bg-slate-50/50 space-y-6">
              <label className="flex items-start gap-4 cursor-pointer group">
                <div className="relative flex items-center mt-1">
                  <input 
                    type="checkbox" 
                    checked={attested}
                    onChange={(e) => setAttested(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-sm text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors">
                  I have reviewed and reconciled all Tier 1 fields, linked evidence, and escalated unresolved risk. 
                  I certify that the findings presented are accurate based on the search scope provided.
                </p>
              </label>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Electronic Signature (Type Full Name)</label>
                <input 
                  type="text" 
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-display font-bold"
                />
              </div>
            </div>
          </section>

          <button 
            onClick={handleSubmit}
            disabled={!attested || !signature}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
              attested && signature 
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            Submit Verified Package
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
