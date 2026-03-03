'use client';

import React from 'react';
import { motion } from 'motion/react';
import { X, GitBranch, CheckCircle2, Clock } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

interface BranchReferencesModalProps {
  onClose: () => void;
}

export default function BranchReferencesModal({ onClose }: BranchReferencesModalProps) {
  const { branchTasks } = useAppContext();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <GitBranch className="text-indigo-600" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-slate-900">Branch References</h2>
              <p className="text-sm text-slate-500">Detected branches requiring validation for 42-year continuity.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {branchTasks.map((task) => (
            <div key={task.branchId} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-indigo-200 transition-colors">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{task.referenceType}</span>
                  {task.requiredFor42YearContinuity && (
                    <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-bold border border-amber-200">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-slate-900">{task.citation}</p>
                <p className="text-xs text-slate-500 mt-1">Source: {task.sourceDeedInstrument}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  task.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                  task.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                  'bg-slate-50 text-slate-600 border-slate-100'
                }`}>
                  {task.status === 'Completed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  {task.status}
                </div>
                {task.status !== 'Completed' && (
                  <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
                    Create Task
                  </button>
                )}
              </div>
            </div>
          ))}
          {branchTasks.length === 0 && (
            <p className="text-center text-slate-500 italic py-8">No branch references detected.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
