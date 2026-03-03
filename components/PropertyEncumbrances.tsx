'use client';

import React from 'react';
import { 
  Building2, 
  DollarSign, 
  ShieldCheck, 
  AlertCircle, 
  FileText, 
  Phone, 
  Mail, 
  Landmark,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function PropertyEncumbrances() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900">Liens & Encumbrances</h2>
          <p className="text-slate-500 text-sm">Mortgages, judgments, and tax status.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200">
            Total Liens: 4
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Mortgages Section */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Building2 size={14} /> Mortgages
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Mortgage - Plaid Verified */}
            <div className="border border-emerald-200 bg-emerald-50/30 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-3 right-3">
                <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold border border-emerald-200">
                  <ShieldCheck size={10} /> Verified via Plaid
                </span>
              </div>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-lg border border-emerald-100 flex items-center justify-center shadow-sm text-emerald-600">
                  <Building2 size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Wells Fargo Bank, N.A.</h4>
                  <p className="text-xs text-slate-500">First Mortgage • Loan #****1234</p>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-3 mb-3">
                <div className="flex justify-between items-end">
                  <span className="text-xs text-slate-500">Verified Balance</span>
                  <span className="text-lg font-bold text-slate-900">$287,450.00</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[10px] text-slate-400">As of today</span>
                  <span className="text-[10px] font-bold text-emerald-600">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Payoff Status</span>
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Ordered</span>
              </div>
            </div>

            {/* Second Mortgage - Needs Info */}
            <div className="border border-amber-200 bg-amber-50/30 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-lg border border-amber-100 flex items-center justify-center shadow-sm text-amber-600">
                  <Building2 size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Chase Bank</h4>
                  <p className="text-xs text-slate-500">Second Mortgage • Loan #****5678</p>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-amber-100 p-3 mb-3 text-center py-4">
                <p className="text-sm font-bold text-slate-400">Balance Unknown</p>
                <p className="text-[10px] text-amber-600 mt-1">Seller authorization required</p>
              </div>
              <button className="w-full py-2 bg-white border border-amber-200 text-amber-700 rounded-lg text-xs font-bold hover:bg-amber-50 transition-colors flex items-center justify-center gap-2">
                Request Info from Seller <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Judgments Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <DollarSign size={14} /> Judgments
            </h3>
            <div className="border border-red-200 bg-red-50/30 rounded-xl p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Capital Recovery Services</h4>
                  <p className="text-xs text-slate-500">Case #2019-009881 • Filed 06/15/2019</p>
                </div>
                <span className="text-sm font-bold text-slate-900">$8,450.00</span>
              </div>
              
              <div className="bg-white rounded-lg border border-red-100 p-3 space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Attorney of Record</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <FileText size={12} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">James T. Miller</p>
                    <p className="text-[10px] text-slate-500">Miller & Stone LLP</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-600 bg-slate-50 px-2 py-1 rounded">
                    <Phone size={10} /> 614-555-9011
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-600 bg-slate-50 px-2 py-1 rounded">
                    <Mail size={10} /> jmiller@...
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Taxes Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Landmark size={14} /> Tax Status
            </h3>
            <div className="border border-slate-200 bg-slate-50/50 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-900">Parcel #123-456-789</h4>
                <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-bold border border-red-200">
                  Delinquent
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Tax Year</span>
                  <span className="font-medium text-slate-900">2024</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">First Half</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 size={10} /> Paid
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Second Half</span>
                  <span className="font-bold text-red-600">$1,250.00 (Due)</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">Total Due</span>
                  <span className="text-sm font-bold text-slate-900">$1,250.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
