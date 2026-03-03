'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { CureItem, CureStatus, CureOwner } from '@/types';
import { 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Sparkles, 
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Calendar,
  ArrowRight,
  Edit3,
  Shield,
  DollarSign,
  Phone,
  Mail,
  Scale
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ExaminerCureCenterProps {
  regulatoryAuditMode: boolean;
}

export default function ExaminerCureCenter({ regulatoryAuditMode }: ExaminerCureCenterProps) {
  const { currentOrder, cureItems, updateCureItem } = useAppContext();
  const [expandedCureId, setExpandedCureId] = useState<string | null>(null);

  if (!currentOrder) return null;

  const orderCureItems = cureItems.filter(item => item.orderId === currentOrder.orderId);
  
  // Sort: Unresolved first, then oldest
  const sortedCureItems = [...orderCureItems].sort((a, b) => {
    if (a.status === 'Resolved' && b.status !== 'Resolved') return 1;
    if (a.status !== 'Resolved' && b.status === 'Resolved') return -1;
    return b.daysOpen - a.daysOpen; // Oldest (most days open) first
  });

  const toggleExpand = (id: string) => {
    setExpandedCureId(expandedCureId === id ? null : id);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Payoff': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Judgment': return 'bg-red-100 text-red-700 border-red-200';
      case 'Lien': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Tax': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Easement': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusColor = (status: CureStatus) => {
    switch (status) {
      case 'Resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Ready to Clear': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const handleGenerateLanguage = (item: CureItem) => {
    if (item.geminiAnalysis?.suggestedRequirement) {
      updateCureItem(item.cureId, { 
        commitmentRequirement: item.geminiAnalysis.suggestedRequirement 
      });
    }
  };

  const handleMarkResolved = (item: CureItem) => {
    updateCureItem(item.cureId, { 
      status: 'Resolved',
      auditLog: [
        ...(item.auditLog || []),
        { timestamp: new Date().toLocaleString(), action: 'Marked Resolved', user: 'Examiner' }
      ]
    });
  };

  const handleMarkReady = (item: CureItem) => {
    updateCureItem(item.cureId, { 
      status: 'Ready to Clear',
      auditLog: [
        ...(item.auditLog || []),
        { timestamp: new Date().toLocaleString(), action: 'Marked Ready to Clear', user: 'Examiner' }
      ]
    });
  };

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900">Examiner Cure Center</h2>
          <p className="text-slate-500 text-sm">Single source of truth for all outstanding curative items.</p>
        </div>
      </div>

      <div className="space-y-4">
        {sortedCureItems.map((item) => (
          <div 
            key={item.cureId} 
            className={`bg-white border rounded-2xl shadow-sm transition-all overflow-hidden ${
              expandedCureId === item.cureId ? 'ring-2 ring-indigo-500/20 border-indigo-200' : 'border-slate-200 hover:border-slate-300'
            } ${item.status === 'Resolved' ? 'opacity-75' : ''}`}
          >
            {/* Card Header */}
            <div 
              className="p-4 flex items-center justify-between cursor-pointer"
              onClick={() => toggleExpand(item.cureId)}
            >
              <div className="flex items-center gap-4">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border ${getTypeColor(item.type)}`}>
                  {item.type}
                </span>
                <div>
                  <h3 className={`text-sm font-bold ${item.status === 'Resolved' ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                     <span className="text-xs text-slate-500 flex items-center gap-1">
                        <User size={10} /> {item.owner}
                     </span>
                     <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock size={10} /> {item.daysOpen} days open
                     </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
                {expandedCureId === item.cureId ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
              </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
              {expandedCureId === item.cureId && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-slate-100 bg-slate-50/30"
                >
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Section A: Summary & Payoff/Judgment Info */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">A. Summary</h4>
                      
                      {/* Regulatory Metadata (Only in Audit Mode) */}
                      {regulatoryAuditMode && item.regulatoryMetadata && (
                        <div className="mb-4 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield size={12} className="text-indigo-600" />
                            <span className="text-[10px] font-bold text-indigo-800 uppercase">Regulatory Audit Data</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <div>
                              <span className="text-indigo-400 block">Source</span>
                              <span className="font-medium text-indigo-900">{item.regulatoryMetadata.dataSource}</span>
                            </div>
                            <div>
                              <span className="text-indigo-400 block">Identified By</span>
                              <span className="font-medium text-indigo-900">{item.regulatoryMetadata.identifiedBy}</span>
                            </div>
                            <div>
                              <span className="text-indigo-400 block">Date</span>
                              <span className="font-medium text-indigo-900">{item.regulatoryMetadata.dateIdentified}</span>
                            </div>
                            <div>
                              <span className="text-indigo-400 block">Decision</span>
                              <span className="font-medium text-indigo-900">{item.regulatoryMetadata.humanDecision || 'Pending'}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-xs text-slate-500">Ref</span>
                          <span className="text-xs font-bold text-slate-900">{item.recordingReference || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-slate-500">Date</span>
                          <span className="text-xs font-bold text-slate-900">{item.recordingDate || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-slate-500">Amount</span>
                          <span className="text-xs font-bold text-slate-900">{item.amount ? `$${item.amount.toLocaleString()}` : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-slate-500">Source</span>
                          <span className="text-xs font-bold text-slate-900">{item.source}</span>
                        </div>
                      </div>

                      {/* Payoff Information Panel */}
                      {item.payoffInfo && (
                        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                          <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-2">Payoff Information</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-xs text-slate-500">Lender</span>
                              <span className="text-xs font-bold text-slate-900">{item.payoffInfo.lenderName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-slate-500">Loan #</span>
                              <span className="text-xs font-bold text-slate-900">{item.payoffInfo.loanNumber}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-500">Balance</span>
                              <div className="text-right">
                                <span className="text-xs font-bold text-slate-900 block">
                                  {item.payoffInfo.verifiedBalance ? `$${item.payoffInfo.verifiedBalance.toLocaleString()}` : 'Unknown'}
                                </span>
                                {item.payoffInfo.verificationSource === 'Plaid' && (
                                  <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                    Verified via Plaid
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-slate-500">Status</span>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                item.payoffInfo.payoffStatus === 'Ordered' ? 'bg-blue-50 text-blue-700' : 
                                item.payoffInfo.payoffStatus === 'Not Ordered' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {item.payoffInfo.payoffStatus}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Judgment Information Panel */}
                      {item.judgmentInfo && (
                        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                          <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-2">Judgment Details</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-xs text-slate-500">Creditor</span>
                              <span className="text-xs font-bold text-slate-900">{item.judgmentInfo.creditorName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-slate-500">Attorney</span>
                              <span className="text-xs font-bold text-slate-900">{item.judgmentInfo.attorneyName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-slate-500">Contact</span>
                              <span className="text-xs font-bold text-slate-900">{item.judgmentInfo.attorneyContact.phone}</span>
                            </div>
                            <div className="pt-2">
                              <button className="w-full py-1.5 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-100 flex items-center justify-center gap-1">
                                <Sparkles size={10} className="text-indigo-500" /> Generate Payoff Email
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Audit Trail */}
                      <div className="mt-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Activity Log</h4>
                        <div className="space-y-2">
                          {item.auditLog?.map((log, idx) => (
                            <div key={idx} className="text-[10px] text-slate-500 flex gap-2">
                              <span className="text-slate-400">{log.timestamp}</span>
                              <span className="font-medium text-slate-700">{log.action}</span>
                              <span className="text-slate-400">– {log.user}</span>
                            </div>
                          ))}
                          {(!item.auditLog || item.auditLog.length === 0) && (
                            <p className="text-[10px] text-slate-400 italic">No activity recorded.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Section B: Required Action */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">B. Required Action</h4>
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
                        <div className="space-y-2">
                          {item.actionSteps.map((step) => (
                            <div key={step.stepId} className="flex items-start gap-2">
                              <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center ${step.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                                {step.completed && <CheckCircle2 size={10} />}
                              </div>
                              <span className={`text-xs ${step.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{step.description}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">Owner</label>
                            <select 
                              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-xs"
                              value={item.owner}
                              onChange={(e) => updateCureItem(item.cureId, { owner: e.target.value as CureOwner })}
                            >
                              {['Examiner', 'Curative Team', 'Closer', 'Seller', 'Buyer', 'Lender', 'HOA'].map(o => (
                                <option key={o} value={o}>{o}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">Due Date</label>
                            <input 
                              type="date" 
                              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-xs"
                              value={item.dueDate || ''}
                              onChange={(e) => updateCureItem(item.cureId, { dueDate: e.target.value })}
                            />
                          </div>
                        </div>

                        {item.status !== 'Resolved' && (
                          <button 
                            onClick={() => item.status === 'Ready to Clear' ? handleMarkResolved(item) : handleMarkReady(item)}
                            className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                              item.status === 'Ready to Clear' 
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                            }`}
                          >
                            {item.status === 'Ready to Clear' ? (
                              <>
                                <CheckCircle2 size={14} /> Mark Resolved
                              </>
                            ) : (
                              <>
                                <CheckCircle2 size={14} /> Mark Ready to Clear
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Section C: Commitment Language */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">C. Commitment Language</h4>
                        <button 
                          onClick={() => handleGenerateLanguage(item)}
                          className="text-[10px] font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-800"
                        >
                          <Sparkles size={10} /> Gemini Assist
                        </button>
                      </div>
                      
                      <div className="bg-white p-4 rounded-xl border border-slate-200 h-full flex flex-col">
                        <textarea 
                          className="flex-1 w-full text-xs text-slate-700 p-2 border border-slate-100 rounded-lg focus:outline-none focus:border-indigo-300 resize-none mb-3"
                          rows={4}
                          placeholder="Requirement language..."
                          value={item.commitmentRequirement || ''}
                          onChange={(e) => updateCureItem(item.cureId, { commitmentRequirement: e.target.value })}
                        />
                        <button 
                          className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 flex items-center justify-center gap-2"
                        >
                          <ArrowRight size={14} /> Insert Into Commitment
                        </button>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {sortedCureItems.every(i => i.status === 'Resolved') && sortedCureItems.length > 0 && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 text-center">
            <CheckCircle2 className="mx-auto text-emerald-500 mb-3" size={48} />
            <h3 className="text-lg font-bold text-emerald-900">All curative items cleared</h3>
            <p className="text-emerald-700">File ready for commitment approval.</p>
          </div>
        )}
      </div>
    </div>
  );
}
