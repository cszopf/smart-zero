'use client';

import React from 'react';
import { 
  FileCheck, 
  Download, 
  Calculator, 
  Shield, 
  Info,
  Check
} from 'lucide-react';

export default function ExaminerPriorPolicy() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900">Prior Title Policy</h2>
          <p className="text-slate-500 text-sm">Review prior policy details and reissue credit calculations.</p>
        </div>
        <button className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
          <Download size={16} />
          Download Policy PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Policy Details Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center shadow-sm">
                  <Shield className="text-indigo-600" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Fidelity National Title</h3>
                  <p className="text-xs text-slate-500">Policy #POL-987654321</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
                <Check size={12} />
                Valid Prior Policy
              </span>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Policy Date</p>
                <p className="text-sm font-bold text-slate-900">Jan 15, 2018</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Policy Amount</p>
                <p className="text-sm font-bold text-slate-900">$350,000.00</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Policy Type</p>
                <p className="text-sm font-bold text-slate-900">Owner&apos;s Policy</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Info size={16} className="text-slate-400" />
              Policy Exceptions
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              {[
                "Standard utility easements of record",
                "Covenants, conditions, and restrictions (CC&Rs) recorded in Book 123, Page 456",
                "Taxes for the year 2018 and subsequent years, not yet due and payable",
                "Rights of parties in possession",
                "Survey exception for fence encroachment on northern boundary"
              ].map((exception, index) => (
                <div key={index} className="px-4 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 text-sm text-slate-600 flex items-start gap-3">
                  <span className="text-xs font-bold text-slate-400 mt-0.5">{index + 1}.</span>
                  {exception}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reissue Calculation Card */}
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calculator className="text-indigo-600" size={20} />
            <h3 className="font-bold text-indigo-900">Reissue Credit</h3>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center pb-3 border-b border-indigo-100">
              <span className="text-sm text-indigo-700">Standard Premium</span>
              <span className="text-sm font-bold text-indigo-900">$1,500.00</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-indigo-100">
              <span className="text-sm text-indigo-700">Reissue Rate</span>
              <span className="text-sm font-bold text-indigo-900">$900.00</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-sm font-bold text-emerald-600">Total Savings</span>
              <span className="text-lg font-bold text-emerald-600">-$600.00</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-indigo-100 text-xs text-indigo-600 leading-relaxed mb-4">
            Based on the prior policy date being within 10 years, the borrower qualifies for a reissue rate discount on the new loan policy.
          </div>

          <button className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">
            Apply Reissue Credit
          </button>
        </div>
      </div>
    </div>
  );
}
