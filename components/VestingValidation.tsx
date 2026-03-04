'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, FileText, Sparkles, Info, ChevronRight } from 'lucide-react';
import { VestingValidation } from '@/types';
import { MOCK_VESTING_VALIDATION } from '@/data/mock';
import { motion, AnimatePresence } from 'motion/react';

export default function VestingValidationPanel() {
  const validation: VestingValidation = MOCK_VESTING_VALIDATION;
  const [selectedCheck, setSelectedCheck] = useState<string | null>(null);

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

  const validationDetails: Record<string, { label: string; details: string; status: string }> = {
    ownerNameMatchesDeed: {
      label: "Owner Name Matches Vesting Deed",
      status: validation.ownerNameMatchesDeed,
      details: validation.ownerNameMatchesDeed === 'Pass' 
        ? "System confirmed 'Taylor Example' matches the Grantee on Instrument REC-2020-000111 recorded 05/12/2020."
        : "Discrepancy found: Contract lists 'Taylor Example' but Deed lists 'Taylor A. Example'. Verification required."
    },
    nameVarianceDetected: {
      label: "Name Variance Across Documents",
      status: validation.nameVarianceDetected,
      details: validation.nameVarianceDetected === 'Pass'
        ? "No significant name variations found across searched records for the last 42 years."
        : "Variation detected: 'Taylor Example' vs 'Taylor A. Example' on prior mortgage (Bk 1234 Pg 567). AKA Affidavit recommended."
    },
    maritalStatusVerified: {
      label: "Marital Status Verified",
      status: validation.maritalStatusVerified,
      details: validation.maritalStatusVerified === 'Pass'
        ? "Marital status 'Single' confirmed via 2020 Vesting Deed and current purchase contract representations."
        : "Marital status not explicitly stated on Vesting Deed. Verification required for dower/homestead rights compliance."
    },
    llcAuthorityVerified: {
      label: "LLC Authority Verified",
      status: validation.llcAuthorityVerified,
      details: validation.llcAuthorityVerified === 'Pass'
        ? "LLC Good Standing confirmed via Secretary of State. Operating Agreement identifies Taylor Example as Authorized Signatory."
        : "LLC status verified, but Authorized Signatory list or Operating Agreement is missing from the file."
    },
    trustCertificationRequired: {
      label: "Trust Certification Required",
      status: validation.trustCertificationRequired,
      details: validation.trustCertificationRequired === 'No'
        ? "Property is held by an individual; Trust Certification is not required for this transaction."
        : "Property held in 'The Example Family Trust'. Certification of Trust required per standard underwriting guidelines."
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {Object.entries(validationDetails).map(([key, item]) => (
          <button
            key={key}
            onClick={() => setSelectedCheck(selectedCheck === key ? null : key)}
            className={`p-4 rounded-xl border transition-all text-left flex items-center justify-between group ${
              selectedCheck === key 
                ? 'border-indigo-500 bg-indigo-50/30 ring-1 ring-indigo-500' 
                : 'border-slate-100 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-100/50'
            }`}
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{item.label}</span>
              <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                <Info size={10} /> Click for details
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
              {getStatusIcon(item.status)}
              {getStatusText(item.status)}
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedCheck && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-5 rounded-xl border border-indigo-100 bg-indigo-50/20 mb-6"
          >
            <div className="flex items-start gap-3">
              <div className="mt-1 p-1.5 bg-indigo-100 rounded-lg text-indigo-600">
                <FileText size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-indigo-900">{validationDetails[selectedCheck].label}</h4>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(validationDetails[selectedCheck].status)}
                    {getStatusText(validationDetails[selectedCheck].status)}
                  </div>
                </div>
                <p className="text-sm text-indigo-800 leading-relaxed">
                  {validationDetails[selectedCheck].details}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto-generated Cure Item Preview (Static for MVP) */}
      {validation.nameVarianceDetected === 'Flag' && (
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50">
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
