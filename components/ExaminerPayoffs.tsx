'use client';

import React from 'react';
import { 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  User, 
  Phone, 
  Mail, 
  FileText,
  DollarSign,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export default function ExaminerPayoffs() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900">Mortgage & Judgment Payoffs</h2>
          <p className="text-slate-500 text-sm">Manage payoff requests and verify balances.</p>
        </div>
        <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors flex items-center gap-2">
          <FileText size={16} />
          Generate Payoff Letters
        </button>
      </div>

      <div className="space-y-4">
        {/* First Mortgage - Verified via Plaid */}
        <div className="border border-emerald-200 bg-emerald-50/30 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
              <ShieldCheck size={14} />
              Verified via Plaid
            </span>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center shadow-sm">
              <Building2 className="text-slate-400" size={24} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-slate-900">Wells Fargo Bank, N.A.</h3>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">First Mortgage</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Account Balance</p>
                  <p className="text-xl font-bold text-slate-900">$245,678.90</p>
                  <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Updated today
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Account Number</p>
                  <p className="text-sm font-medium text-slate-900 font-mono">**** 1234</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Authorized Borrower</p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                      JD
                    </div>
                    <p className="text-sm font-medium text-slate-900">John Doe</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Authorization on file</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Mortgage - Missing Info */}
        <div className="border border-amber-200 bg-amber-50/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center shadow-sm">
              <Building2 className="text-slate-400" size={24} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-900">Bank of America</h3>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Second Mortgage</span>
                </div>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200">
                  <AlertCircle size={14} />
                  Payoff Statement Needed
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Estimated Balance</p>
                  <p className="text-xl font-bold text-slate-400">Unknown</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Account Number</p>
                  <p className="text-sm font-medium text-slate-400 font-mono">Unknown</p>
                </div>
                <div className="flex items-center">
                  <button className="w-full py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center justify-center gap-2 shadow-sm">
                    Request Payoff Info <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Judgment - Needs Payoff */}
        <div className="border border-red-200 bg-red-50/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center shadow-sm">
              <DollarSign className="text-red-500" size={24} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-900">Superior Court Judgment #CV-2023-001</h3>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Judgment Lien</span>
                </div>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200">
                  <AlertCircle size={14} />
                  Action Required
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                <div>
                  <div className="mb-4">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Plaintiff</p>
                    <p className="text-sm font-bold text-slate-900">ABC Collections, LLC</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Judgment Amount</p>
                    <p className="text-xl font-bold text-slate-900">$5,400.00 <span className="text-sm font-normal text-slate-500">+ interest & fees</span></p>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-3">Attorney of Record</p>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <User size={14} className="text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Smith & Jones Law Group</p>
                      <p className="text-xs text-slate-500">Representing Plaintiff</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone size={14} className="text-slate-400" />
                      (555) 123-4567
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail size={14} className="text-slate-400" />
                      payoffs@smithjoneslaw.com
                    </div>
                  </div>
                  <button className="w-full mt-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors">
                    Contact Attorney for Payoff
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
