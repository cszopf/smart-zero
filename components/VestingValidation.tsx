'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, FileText, Sparkles } from 'lucide-react';
import { VestingValidation } from '@/types';
import { MOCK_VESTING_VALIDATION } from '@/data/mock';

export default function VestingValidationPanel() {
  const validation: VestingValidation = MOCK_VESTING_VALIDATION;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pass': return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'Flag': return <AlertTriangle size={16} className="text-amber-500" />;
      case 'Missing': return <XCircle size={16} className="text-red-500" />;
      case 'Yes': return <AlertTriangle size={16} className="text-amber-500" />;
      case 'No': return <CheckCircle2 size={16} className="text-emerald-500" />;
      default: return <div className="w-4 h-4 rounded-full bg-slate-200" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Pass': return <span className="text-emerald-700 font-bold text-xs">Pass</span>;
      case 'Flag': return <span className="text-amber-700 font-bold text-xs">Flag</span>;
      case 'Missing': return <span className="text-red-700 font-bold text-xs">Missing</span>;
      case 'Yes': return <span className="text-amber-700 font-bold text-xs">Required</span>;
      case 'No': return <span className="text-emerald-700 font-bold text-xs">Not Required</span>;
      default: return <span className="text-slate-500 font-bold text-xs">{status}</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900">Vesting & Identity Validation</h2>
          <p className="text-slate-500 text-sm">Automated validation checks for ownership and identity.</p>
        </div>
        <div className="bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Auto-Validation Engine</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Owner Name Matches Vesting Deed</span>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
            {getStatusIcon(validation.ownerNameMatchesDeed)}
            {getStatusText(validation.ownerNameMatchesDeed)}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Name Variance Across Documents</span>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
            {getStatusIcon(validation.nameVarianceDetected)}
            {getStatusText(validation.nameVarianceDetected)}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Marital Status Verified</span>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
            {getStatusIcon(validation.maritalStatusVerified)}
            {getStatusText(validation.maritalStatusVerified)}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">LLC Authority Verified</span>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
            {getStatusIcon(validation.llcAuthorityVerified)}
            {getStatusText(validation.llcAuthorityVerified)}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Trust Certification Required</span>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
            {getStatusIcon(validation.trustCertificationRequired)}
            {getStatusText(validation.trustCertificationRequired)}
          </div>
        </div>
      </div>

      {/* Auto-generated Cure Item Preview (Static for MVP) */}
      {validation.nameVarianceDetected === 'Flag' && (
        <div className="mt-6 p-4 rounded-xl border border-amber-200 bg-amber-50">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Sparkles className="text-amber-600" size={16} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-amber-900 mb-1">Auto-Generated Cure Item: Name Variance</h4>
              <p className="text-xs text-amber-800 mb-3">
                System detected a name variance between the vesting deed and the current contract. A cure item has been created automatically.
              </p>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-white border border-amber-200 rounded-lg text-xs font-bold text-amber-700 hover:bg-amber-100 transition-colors">
                  View Cure Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
