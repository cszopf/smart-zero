'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { 
  X, 
  History as HistoryIcon, 
  GitBranch, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  User, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import DeedDetailPanel from './DeedDetailPanel';
import { DeedDocument } from '@/types';

interface TransferHistoryModalProps {
  onClose: () => void;
}

export default function TransferHistoryModal({ onClose }: TransferHistoryModalProps) {
  const { 
    transferHistory, 
    branchTasks, 
    deedDocuments, 
    updateBranchStatus, 
    transferHistoryVersions,
    currentOrder,
    role
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<'timeline' | 'branches' | 'history'>('timeline');
  const [selectedDeed, setSelectedDeed] = useState<DeedDocument | null>(null);

  const canEdit = role === 'Abstractor' || role === 'Manager';

  if (!currentOrder) return null;

  // Filter data for current order
  const orderTransferHistory = transferHistory.filter(t => t.orderId === currentOrder.orderId);
  const orderBranchTasks = branchTasks.filter(t => t.orderId === currentOrder.orderId);
  const orderHistoryVersions = transferHistoryVersions.filter(v => v.orderId === currentOrder.orderId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-6xl h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <HistoryIcon className="text-indigo-600" size={28} />
              Transfer History & Chain Coverage
            </h2>
            <p className="text-sm text-slate-500 mt-1">Full audit log and chain verification details.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-8 border-b border-slate-100 bg-slate-50/50">
          <button 
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'timeline' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Transfer Timeline
          </button>
          <button 
            onClick={() => setActiveTab('branches')}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'branches' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Branch Tasks ({orderBranchTasks.filter(t => t.status !== 'Completed').length})
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'history' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Version History
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Deed Date</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Instrument</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Grantor</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Grantee</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Legal Type</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Branches</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orderTransferHistory.map((transfer) => (
                      <tr key={transfer.transferId} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{transfer.deedDate}</td>
                        <td className="px-6 py-4 text-xs font-mono text-slate-500">{transfer.instrumentNumber}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{transfer.grantor}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{transfer.grantee}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">
                            {transfer.legalType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <GitBranch size={14} className={transfer.branchCount > 0 ? 'text-blue-500' : 'text-slate-300'} />
                            <span className="text-sm font-bold text-slate-700">{transfer.branchCount}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => {
                              const doc = deedDocuments.find(d => d.instrumentNumber === transfer.instrumentNumber);
                              if (doc) setSelectedDeed(doc);
                            }}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                          >
                            View Deed
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'branches' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Branch Type</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Citation</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Required</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Linked Document</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orderBranchTasks.map((task) => (
                      <tr key={task.branchId} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold uppercase">
                            {task.referenceType}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-900">{task.citation}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold ${task.requiredFor42YearContinuity ? 'text-red-600' : 'text-slate-400'}`}>
                            {task.requiredFor42YearContinuity ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            task.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                            task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                            task.status === 'Not Found' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          {task.linkedDocumentId ? (
                            <div className="flex items-center gap-1 text-blue-600 font-medium">
                              <FileText size={14} />
                              {task.linkedDocumentId}
                            </div>
                          ) : 'None'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {canEdit && task.status !== 'Completed' && (
                              <button 
                                onClick={() => updateBranchStatus(task.branchId, 'Completed', `DOC-BR-${task.branchId}`)}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Mark Complete"
                              >
                                <CheckCircle2 size={16} />
                              </button>
                            )}
                            {canEdit && (
                              <button 
                                onClick={() => updateBranchStatus(task.branchId, 'Not Found')}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Mark Not Found / Escalate"
                              >
                                <AlertCircle size={16} />
                              </button>
                            )}
                            {!canEdit && (
                              <span className="text-xs text-slate-400 italic">View Only</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timestamp</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Action</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Field Changed</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orderHistoryVersions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500 italic">
                          No history recorded yet.
                        </td>
                      </tr>
                    ) : (
                      orderHistoryVersions.map((version) => (
                        <tr key={version.versionId} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-xs text-slate-500">
                            {new Date(version.timestamp).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-[10px] font-bold">
                                {version.userId.substring(0, 2)}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-900">{version.userId}</p>
                                <p className="text-xs text-slate-400">{version.role}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-900">{version.actionType}</td>
                          <td className="px-6 py-4 text-xs font-mono text-slate-500">{version.fieldChanged}</td>
                          <td className="px-6 py-4 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-red-500 line-through opacity-60">{version.previousValue}</span>
                              <span className="text-slate-300">→</span>
                              <span className="text-emerald-600 font-bold">{version.newValue}</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Deed Detail Slide-over */}
        <AnimatePresence>
          {selectedDeed && (
            <DeedDetailPanel 
              deed={selectedDeed} 
              onClose={() => setSelectedDeed(null)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
