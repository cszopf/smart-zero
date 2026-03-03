'use client';

import React from 'react';
import { motion } from 'motion/react';
import { X, CheckCircle2, FileText, ShieldCheck, List } from 'lucide-react';

interface PolicyPackageModalProps {
  onClose: () => void;
}

export default function PolicyPackageModal({ onClose }: PolicyPackageModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900">Policy Package Generated</h2>
            <p className="text-sm text-slate-500">Ready for delivery to Smart Space</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Final Commitment', icon: FileText, pages: 12 },
              { title: 'Pro Forma Policy', icon: ShieldCheck, pages: 8 },
              { title: 'Exception Index', icon: List, pages: 2 },
              { title: 'Curative Summary', icon: CheckCircle2, pages: 1 },
              { title: 'Chain Coverage Cert', icon: ShieldCheck, pages: 3 },
              { title: 'Audit Report', icon: FileText, pages: 5 },
            ].map((doc, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-50 transition-colors">
                  <doc.icon className="text-slate-400 group-hover:text-indigo-600 transition-colors" size={24} />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{doc.title}</h3>
                <p className="text-xs text-slate-500">{doc.pages} Pages • PDF</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-xl transition-colors">
            Cancel
          </button>
          <button className="px-6 py-2 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">
            Post Package to Smart Space
          </button>
        </div>
      </motion.div>
    </div>
  );
}
