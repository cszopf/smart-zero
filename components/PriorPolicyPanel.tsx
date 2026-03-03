'use client';

import React from 'react';
import { FileText, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PriorPolicy } from '@/types';
import { MOCK_PRIOR_POLICY } from '@/data/mock';

export default function PriorPolicyPanel() {
  const policy: PriorPolicy | null = MOCK_PRIOR_POLICY;

  if (!policy) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm mb-8">
        <h2 className="text-xl font-display font-bold text-slate-900 mb-6">Prior Title Policy</h2>
        <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl bg-slate-50">
          <AlertCircle className="mx-auto text-slate-400 mb-3" size={32} />
          <p className="text-slate-500 font-medium mb-4">No prior policy on file.</p>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            Request Prior Policy from Seller
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900">Prior Title Policy</h2>
          <p className="text-slate-500 text-sm">Details from the previous title insurance policy.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors">
          <Download size={14} />
          Download Prior Policy PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 grid grid-cols-2 gap-6">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Company</p>
            <p className="text-sm font-bold text-slate-900">{policy.companyName}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Policy Number</p>
            <p className="text-sm font-bold text-slate-900">{policy.policyNumber}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Effective Date</p>
            <p className="text-sm font-bold text-slate-900">{policy.effectiveDate}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Amount</p>
            <p className="text-sm font-bold text-slate-900">${policy.amount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Insured Owner</p>
            <p className="text-sm font-bold text-slate-900">{policy.ownerInsured}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Loan Policy</p>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${policy.loanPolicyPresent ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                {policy.loanPolicyPresent ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Reissue Credit</h4>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Eligible?</span>
            <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 size={14} /> Yes
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <span className="text-sm text-slate-600">Est. Savings</span>
            <span className="text-lg font-bold text-slate-900">${policy.reissueRateEstimate.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Exceptions Carried Forward</h4>
        <div className="space-y-2">
          {policy.exceptionsCarriedForward.map((ex, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
              <FileText size={14} className="mt-0.5 text-slate-400" />
              {ex}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
