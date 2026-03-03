'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Upload, FileText, Check, X, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UploadFindingsProps {
  onBack?: () => void;
}

export default function UploadFindings({ onBack }: UploadFindingsProps) {
  const { currentOrder, setCurrentOrder, updateAbstractorFindings } = useAppContext();
  const [isUploading, setIsUploading] = useState(false);
  const [isParsed, setIsParsed] = useState(false);
  const [findings, setFindings] = useState<Record<string, string>>({
    currentOwnerName: 'Taylor Example',
    releaseStatus: 'Released',
    clerkJudgments: 'No Hits',
    taxDelinquency: 'Current',
    pacerMatch: 'No Match'
  });

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate parsing from a document
    setTimeout(() => {
      setIsUploading(false);
      setIsParsed(true);
    }, 1500);
  };

  const handleContinue = () => {
    if (currentOrder) {
      updateAbstractorFindings(findings);
      setCurrentOrder({ ...currentOrder, status: 'Reconciliation In Progress' });
    }
  };

  const updateField = (key: string, value: string) => {
    setFindings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors text-sm font-medium"
      >
        <ArrowRight className="rotate-180" size={16} />
        Back to Overview
      </button>

      <div className="mb-12">
        <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">Input Search Findings</h1>
        <p className="text-slate-500 text-lg">Enter your discovered data points. These will be compared against AI and Plant data in the next step.</p>
      </div>

      <div className="space-y-12">
        <section className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">1. Document Evidence</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              <Check size={14} />
              OCR Ready
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Findings PDF</label>
              <div className="border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer group relative overflow-hidden">
                <Upload className="mx-auto text-slate-300 group-hover:text-emerald-500 mb-4 transition-colors" size={40} />
                <p className="text-sm font-bold text-slate-900">Drop findings PDF here</p>
                <p className="text-xs text-slate-400 mt-1">or click to browse</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Supporting Docs (Deeds, Mortgages, etc.)</label>
              <div className="border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer group">
                <Upload className="mx-auto text-slate-300 group-hover:text-blue-500 mb-4 transition-colors" size={40} />
                <p className="text-sm font-bold text-slate-900">Drop supporting docs</p>
                <p className="text-xs text-slate-400 mt-1">multiple files allowed</p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <button 
              onClick={handleUpload}
              disabled={isUploading || isParsed}
              className={`flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl ${
                isParsed 
                  ? 'bg-emerald-100 text-emerald-700 cursor-default' 
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/30'
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Analyzing Documents...
                </>
              ) : isParsed ? (
                <>
                  <Check size={24} />
                  Analysis Complete
                </>
              ) : (
                <>
                  <FileText size={24} />
                  Extract & Prefill Form
                </>
              )}
            </button>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-8">2. Structured Data Entry</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Owner Name</label>
              <input 
                type="text" 
                value={findings.currentOwnerName}
                onChange={(e) => updateField('currentOwnerName', e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 font-medium" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mortgage Release Status</label>
              <select 
                value={findings.releaseStatus}
                onChange={(e) => updateField('releaseStatus', e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 font-medium"
              >
                <option value="Open">Open</option>
                <option value="Released">Released</option>
                <option value="Partially Released">Partially Released</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Clerk Judgments</label>
              <input 
                type="text" 
                value={findings.clerkJudgments}
                onChange={(e) => updateField('clerkJudgments', e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 font-medium" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tax Status</label>
              <select 
                value={findings.taxDelinquency}
                onChange={(e) => updateField('taxDelinquency', e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 font-medium"
              >
                <option value="Current">Current</option>
                <option value="Delinquent">Delinquent</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bankruptcy Match</label>
              <input 
                type="text" 
                value={findings.pacerMatch}
                onChange={(e) => updateField('pacerMatch', e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 font-medium" 
              />
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
            <button 
              onClick={handleContinue}
              className="flex items-center gap-3 px-10 py-5 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/30"
            >
              Finalize Findings & Compare
              <ArrowRight size={24} />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
