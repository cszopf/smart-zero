import React from 'react';
import { DeedDocument, ExtractedReference } from '@/types';
import { X, FileText, GitBranch, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface DeedDetailPanelProps {
  deed: DeedDocument;
  onClose: () => void;
  onBranchAction?: (ref: ExtractedReference) => void;
}

export default function DeedDetailPanel({ deed, onClose, onBranchAction }: DeedDetailPanelProps) {
  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-[100] overflow-y-auto border-l border-slate-200"
    >
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 p-6 flex items-center justify-between z-10">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="text-blue-600" size={24} />
            Deed Detail
          </h2>
          <p className="text-sm text-slate-500 font-mono mt-1">{deed.instrumentNumber}</p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
        >
          <X size={24} />
        </button>
      </div>

      <div className="p-8 space-y-8">
        {/* Key Information */}
        <div className="grid grid-cols-2 gap-6">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Grantor</p>
            <p className="text-sm font-bold text-slate-900">{deed.grantor}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Grantee</p>
            <p className="text-sm font-bold text-slate-900">{deed.grantee}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Recording Date</p>
            <p className="text-sm font-bold text-slate-900">{deed.recordingDate}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Vesting</p>
            <p className="text-sm font-bold text-slate-900">{deed.vestingLanguage || 'Not specified'}</p>
          </div>
        </div>

        {/* Legal Description */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Legal Description</h3>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 font-mono text-xs leading-relaxed text-slate-700">
            {deed.legalDescriptionText}
          </div>
        </div>

        {/* Exceptions */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Exceptions</h3>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 font-mono text-xs leading-relaxed text-slate-700">
            {deed.exceptionsText}
          </div>
        </div>

        {/* Extracted References */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider flex items-center gap-2">
            <GitBranch size={16} className="text-blue-600" />
            Extracted Branch References
          </h3>
          <div className="space-y-3">
            {deed.extractedReferences.map((ref, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold uppercase">
                      {ref.referenceType}
                    </span>
                    <span className="text-sm font-bold text-slate-900">{ref.citation}</span>
                  </div>
                  {ref.requiredFor42YearContinuity && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                      <AlertCircle size={12} />
                      Required for 42yr
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mb-3">{ref.whyItMatters}</p>
                
                {onBranchAction && (
                  <div className="flex justify-end">
                    <button 
                      onClick={() => onBranchAction(ref)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      View Linked Task <ArrowRight size={12} />
                    </button>
                  </div>
                )}
              </div>
            ))}
            {deed.extractedReferences.length === 0 && (
              <p className="text-sm text-slate-400 italic">No branch references extracted from this document.</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ArrowRight({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
